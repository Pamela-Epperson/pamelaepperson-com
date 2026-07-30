// /api/intake — CRM intake endpoint (Vercel serverless function)
//
// Backend is SWAPPABLE via environment variables, checked in this order:
//   1. SUPABASE_URL + SUPABASE_SERVICE_KEY  → inserts into table `intake`
//        create table intake (id uuid default gen_random_uuid() primary key,
//          created_at timestamptz default now(), name text, email text,
//          role text, state text, interest text[], message text);
//        (enable RLS; the service key bypasses it server-side only)
//   2. FORMSPREE_ENDPOINT (e.g. https://formspree.io/f/xxxxxxx) → forwards JSON
//   3. INTAKE_WEBHOOK_URL (any webhook: Zapier/Make/Google Apps Script → Sheet)
//   4. Nothing configured → returns 503 so the form shows its graceful
//      error state with a direct-email fallback. No data is silently dropped.
//
// Privacy: stores ONLY what was submitted. No IP logging, no trackers.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot — bots fill the hidden "website" field; humans never see it.
  if (body.website) {
    return res.status(200).json({ ok: true }); // silently accept & discard spam
  }

  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 200);
  const role = String(body.role || "").trim().slice(0, 300);
  const state = String(body.state || "").trim().slice(0, 60);
  const message = String(body.message || "").trim().slice(0, 5000);
  const interest = Array.isArray(body.interest) ? body.interest.map(String).slice(0, 10) : [];

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Name and a valid email are required." });
  }

  // Which offer drove the inquiry. Validated against the catalog so an unknown
  // value can never blow up the insert on a foreign-key violation.
  const OFFER_SLUGS = new Set([
    "discovery-brief", "triage-sprint", "governance-build-60", "operate-retainer",
    "gcmm-assessment", "strategic-session", "ai-readiness", "fractional-officer",
    "board-advisory", "keynote-corporate", "keynote-association", "keynote-community",
    "workshop-day", "pipeline-admin", "calendar-time",
  ]);
  const rawOffer = String(body.offer_slug || "").trim();
  const offer_slug = OFFER_SLUGS.has(rawOffer) ? rawOffer : null;

  const SOURCES = new Set(["website", "linkedin", "referral", "keynote"]);
  const rawSource = String(body.source || "website").trim();
  const source = SOURCES.has(rawSource) ? rawSource : "website";

  const record = { name, email, role, state, interest, message, offer_slug, source };

  try {
    // ── Option 1: Supabase ──
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!r.ok) throw new Error(`Supabase ${r.status}`);
      return res.status(200).json({ ok: true });
    }

    // ── Option 2: Formspree / Basin ──
    if (process.env.FORMSPREE_ENDPOINT) {
      const r = await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(record),
      });
      if (!r.ok) throw new Error(`Formspree ${r.status}`);
      return res.status(200).json({ ok: true });
    }

    // ── Option 3: generic webhook (Zapier / Make / Apps Script → Google Sheet) ──
    if (process.env.INTAKE_WEBHOOK_URL) {
      const r = await fetch(process.env.INTAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!r.ok) throw new Error(`Webhook ${r.status}`);
      return res.status(200).json({ ok: true });
    }

    // ── Nothing configured yet ──
    return res.status(503).json({
      ok: false,
      error: "Intake backend not configured — set SUPABASE_URL/SUPABASE_SERVICE_KEY, FORMSPREE_ENDPOINT, or INTAKE_WEBHOOK_URL in Vercel env vars",
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: "Delivery failed — please email directly." });
  }
}
