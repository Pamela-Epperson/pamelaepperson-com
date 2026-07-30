-- ============================================================================
-- HGZ DIGITAL SOLUTIONS — CRM SCHEMA (Supabase / Postgres)
-- Author: built 2026-07-30 for Dr. Pamela Epperson
--
-- DESIGN PRINCIPLES
--   1. Do not break the deployed endpoint. `public.intake` keeps exactly the
--      columns api/intake.js already writes. New columns are nullable, so the
--      current code inserts successfully with no redeploy.
--   2. Raw capture and worked pipeline are separate. `intake` is an append-only
--      log of what was actually submitted (provenance). `leads` is the layer
--      you work. A trigger promotes one into the other.
--   3. The pricing floor is enforced by the database, not by memory. Quoting
--      below an offer's floor RAISES unless you write down which rule you are
--      overriding and why. That is the deal, in DDL.
--   4. RLS on, no anon policies. Only the service key (server-side) touches it.
--
-- RUN: Supabase Dashboard -> SQL Editor -> paste -> Run. Idempotent.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------
do $$ begin
  create type lead_stage as enum (
    'new',          -- landed, not yet read
    'qualified',    -- real buyer, real trigger event
    'scoped',       -- deliverable + owner + finish-line clause agreed
    'proposed',     -- written proposal out
    'won',
    'lost',
    'archived'      -- spam, student, vendor pitch, not-a-buyer
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type offer_track as enum ('A_government','B_commercial','C_voice','civic');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- OFFERS — the catalog, and the floor it carries
-- ---------------------------------------------------------------------------
create table if not exists public.offers (
  slug             text primary key,
  name             text        not null,
  track            offer_track not null,
  floor_amount     numeric(12,2) not null default 0,   -- 0 = deliberately unpriced (community)
  is_fixed_price   boolean     not null default false, -- true = exact, not "from"
  card_buyable     boolean     not null default false, -- under FAR micro-purchase threshold
  unit             text        not null default 'engagement', -- engagement | month | year | session
  floor_rule       text,                                -- which rule defends this number
  active           boolean     not null default true,
  sort_order       int         not null default 100
);

comment on table  public.offers is
  'Sellable offers with their published floor. Source: Pavement Working Bible, Part D6 / Part E0.';
comment on column public.offers.floor_amount is
  'Minimum. Enforced by trg_leads_floor_guard. Override requires a written reason.';

insert into public.offers
  (slug, name, track, floor_amount, is_fixed_price, card_buyable, unit, floor_rule, sort_order) values
  ('discovery-brief',      'Discovery Brief',                      'A_government',  14500, true,  true,  'engagement', 'Fixed at $14,500 — under the $15,000 FAR 2.101 micro-purchase threshold. Do not discount; the precision is the product.', 10),
  ('triage-sprint',        'Inventory & Triage Sprint',            'A_government',  35000, false, false, 'engagement', 'Floor Rule 3 — never below $35,000. The Discovery Brief is a different product, not a cheaper Sprint.', 20),
  ('governance-build-60',  '60-Day Governance Build',              'A_government',  95000, false, false, 'engagement', 'Floor Rule 4 — never below $95,000. Keep any single award under $350,000 (simplified acquisition threshold) unless the buyer holds a vehicle.', 30),
  ('operate-retainer',     'Operate / Monitor / Advise retainer',  'A_government',  12000, false, false, 'month',      'Floor $12,000/mo on a 6-12 month term.', 40),
  ('gcmm-assessment',      'Governance Capacity Assessment (GCMM)','A_government',  45000, false, false, 'engagement', 'Calibrated floor $45,000.', 50),
  ('strategic-session',    'Strategic session (half day)',         'B_commercial',   7500, true,  false, 'session',    'Track B judgment, not sourced. Do not present as market research.', 60),
  ('ai-readiness',         'AI Readiness & Governance Assessment', 'B_commercial',  55000, false, false, 'engagement', 'Track B judgment, not sourced.', 70),
  ('fractional-officer',   'Fractional Chief AI/Data Gov Officer', 'B_commercial',  18000, false, false, 'month',      'Track B judgment, 0.2-0.4 FTE.', 80),
  ('board-advisory',       'Board advisory retainer',              'B_commercial',  30000, false, false, 'year',       'Track B judgment, not sourced.', 90),
  ('keynote-corporate',    'Keynote — corporate / health system',  'C_voice',       15000, false, false, 'session',    'Track C judgment. Publish the floor, never a band.', 100),
  ('keynote-association',  'Keynote — association / nonprofit',    'C_voice',        7500, false, false, 'session',    'Track C judgment.', 110),
  ('keynote-community',    'Keynote — community / HBCU / faith',   'C_voice',           0, false, false, 'session',    'DELIBERATELY $0 — at cost or sponsor-funded. This is a stated policy, not a negotiation. Floor guard does not apply.', 120),
  ('workshop-day',         'Workshop day',                         'C_voice',       12000, false, false, 'session',    'Track C judgment.', 130),
  ('pipeline-admin',       'The Pipeline — implementation & Board Ready admin', 'civic', 10000, false, false, 'year',  'The Pipeline stays FREE to partner orgs. This is the paid implementation tier only.', 140),
  ('calendar-time',        'Time on my calendar',                  'B_commercial',    150, true,  false, 'session',    'Floor Rule 5 — no free discovery. Ever.', 150)
on conflict (slug) do update set
  name = excluded.name, track = excluded.track, floor_amount = excluded.floor_amount,
  is_fixed_price = excluded.is_fixed_price, card_buyable = excluded.card_buyable,
  unit = excluded.unit, floor_rule = excluded.floor_rule, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- INTAKE — raw, append-only. Columns api/intake.js already writes, plus
-- nullable additions. Existing endpoint keeps working with zero changes.
-- ---------------------------------------------------------------------------
create table if not exists public.intake (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  email       text,
  role        text,
  state       text,
  interest    text[],
  message     text
);

-- Additive, all nullable — safe on an existing table.
alter table public.intake add column if not exists offer_slug   text references public.offers(slug);
alter table public.intake add column if not exists source       text;   -- 'website' | 'linkedin' | 'referral' | 'keynote'
alter table public.intake add column if not exists page_path    text;
alter table public.intake add column if not exists raw          jsonb;  -- full submitted payload, untouched

comment on table public.intake is
  'Append-only record of what was actually submitted. Never edit rows here — work the lead in public.leads.';

-- ---------------------------------------------------------------------------
-- LEADS — the worked pipeline
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  intake_id             uuid references public.intake(id) on delete set null,

  name                  text not null,
  email                 text not null,
  org                   text,
  role                  text,
  state                 text,
  interests             text[],
  message               text,

  offer_slug            text references public.offers(slug),
  stage                 lead_stage not null default 'new',
  source                text,

  quoted_amount         numeric(12,2),
  floor_override_reason text,        -- REQUIRED to quote below floor. Name the rule.
  close_probability     int check (close_probability between 0 and 100),
  expected_close_on     date,

  -- Floor Rule 6: no number without a named deliverable, a named owner,
  -- and the finish-line clause. These three make the rule checkable.
  named_deliverable     text,
  named_owner           text,
  finish_line_clause    boolean not null default false,

  lost_reason           text,
  next_action           text,
  next_action_due       date
);

create unique index if not exists leads_email_offer_uniq
  on public.leads (lower(email), coalesce(offer_slug,''));
create index if not exists leads_stage_idx        on public.leads (stage);
create index if not exists leads_next_due_idx     on public.leads (next_action_due);
create index if not exists leads_created_idx      on public.leads (created_at desc);

create table if not exists public.lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  author     text not null default 'Pamela',
  note       text not null
);
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- THE FLOOR GUARD — the Underprice Interceptor, in DDL
-- Quoting below an offer's floor raises, unless you write down the override.
-- ---------------------------------------------------------------------------
create or replace function public.leads_floor_guard()
returns trigger language plpgsql as $$
declare
  f numeric(12,2);
  r text;
  n text;
begin
  if new.quoted_amount is null or new.offer_slug is null then
    return new;
  end if;

  select floor_amount, floor_rule, name into f, r, n
  from public.offers where slug = new.offer_slug;

  -- Community/at-cost offers are deliberately unpriced. Guard does not apply.
  if f is null or f = 0 then
    return new;
  end if;

  if new.quoted_amount < f and coalesce(btrim(new.floor_override_reason), '') = '' then
    raise exception
      'FLOOR VIOLATION on "%": quoted % is below the floor of %. % — To proceed, set floor_override_reason and name which rule you are overriding and why.',
      n, new.quoted_amount, f, coalesce(r, 'See the Pavement Working Bible, Part D4.')
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists trg_leads_floor_guard on public.leads;
create trigger trg_leads_floor_guard
  before insert or update of quoted_amount, offer_slug, floor_override_reason
  on public.leads for each row execute function public.leads_floor_guard();

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_leads_touch on public.leads;
create trigger trg_leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- PROMOTION — every raw intake becomes a lead automatically
-- ---------------------------------------------------------------------------
create or replace function public.promote_intake_to_lead()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(btrim(new.email), '') = '' then
    return new;  -- nothing to work
  end if;

  insert into public.leads
    (intake_id, name, email, role, state, interests, message, offer_slug, source, stage, next_action, next_action_due)
  values
    (new.id, coalesce(nullif(btrim(new.name),''),'(no name given)'), lower(btrim(new.email)),
     new.role, new.state, new.interest, new.message, new.offer_slug,
     coalesce(new.source,'website'), 'new',
     'Read and qualify or archive', (now() + interval '1 day')::date)
  on conflict (lower(email), coalesce(offer_slug,'')) do update set
    message    = coalesce(excluded.message, public.leads.message),
    interests  = coalesce(excluded.interests, public.leads.interests),
    updated_at = now();

  return new;
end $$;

drop trigger if exists trg_intake_promote on public.intake;
create trigger trg_intake_promote after insert on public.intake
  for each row execute function public.promote_intake_to_lead();

-- ---------------------------------------------------------------------------
-- VIEWS — the three screens actually worth looking at
-- ---------------------------------------------------------------------------
create or replace view public.v_inbox as
select l.id, l.created_at, l.name, l.email, l.org, l.state,
       o.name as offer, o.floor_amount as floor, l.message, l.source
from public.leads l
left join public.offers o on o.slug = l.offer_slug
where l.stage = 'new'
order by l.created_at desc;

create or replace view public.v_pipeline as
select l.id, l.name, l.org, l.stage,
       o.name as offer, o.track, o.floor_amount as floor,
       l.quoted_amount,
       coalesce(l.quoted_amount, o.floor_amount) as value_at_floor,
       l.close_probability, l.expected_close_on,
       l.named_deliverable, l.named_owner, l.finish_line_clause,
       l.next_action, l.next_action_due,
       (current_date - l.created_at::date) as days_open
from public.leads l
left join public.offers o on o.slug = l.offer_slug
where l.stage not in ('won','lost','archived')
order by
  case l.stage when 'proposed' then 1 when 'scoped' then 2 when 'qualified' then 3 else 4 end,
  l.next_action_due nulls last;

-- Anything quoted under floor, or proposed without the Rule 6 three.
create or replace view public.v_floor_watch as
select l.id, l.name, l.org, o.name as offer, o.floor_amount as floor,
       l.quoted_amount, l.floor_override_reason,
       (l.quoted_amount < o.floor_amount)                    as below_floor,
       (l.named_deliverable is null)                         as missing_deliverable,
       (l.named_owner is null)                               as missing_owner,
       (l.finish_line_clause is false)                       as missing_finish_line,
       o.floor_rule
from public.leads l
join public.offers o on o.slug = l.offer_slug
where l.stage in ('scoped','proposed','won')
  and ( (l.quoted_amount is not null and l.quoted_amount < o.floor_amount)
     or l.named_deliverable is null
     or l.named_owner is null
     or l.finish_line_clause is false );

-- ---------------------------------------------------------------------------
-- RLS — on, with no anon policies. Service key (server-side) only.
-- The endpoint uses SUPABASE_SERVICE_KEY, which bypasses RLS server-side.
-- A leaked anon key therefore reads nothing.
-- ---------------------------------------------------------------------------
alter table public.intake     enable row level security;
alter table public.leads      enable row level security;
alter table public.lead_notes enable row level security;
alter table public.offers     enable row level security;

revoke all on public.intake, public.leads, public.lead_notes from anon, authenticated;
revoke all on public.offers from anon;

-- Read-only offer catalog for a signed-in dashboard, if you ever build one.
drop policy if exists offers_read_authenticated on public.offers;
create policy offers_read_authenticated on public.offers
  for select to authenticated using (true);

-- ============================================================================
-- SMOKE TEST (optional — run, confirm, then roll back)
-- ============================================================================
-- begin;
--   insert into public.intake (name, email, role, state, interest, message, offer_slug, source)
--   values ('Test Buyer','test@example.gov','CIO, Test Agency','Maryland',
--           array['Consulting engagement'],'Testing the pipe.','discovery-brief','website');
--   select * from public.v_inbox;
--   -- should RAISE: quoting a Discovery Brief at 9000 with no override
--   update public.leads set quoted_amount = 9000 where email = 'test@example.gov';
-- rollback;
-- ============================================================================
