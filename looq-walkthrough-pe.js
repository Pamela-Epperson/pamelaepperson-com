(function(){
  if(window.__LOOQ_WT) return; window.__LOOQ_WT=1;
  var CSS=`.lqw-film{position:fixed;inset:0;z-index:2000;background:#050D1A;display:none;flex-direction:column;
    font-family:'DM Sans',system-ui,sans-serif;color:#F4F6F8;}
  .lqw-film.lqw-on{display:flex;}
  .lqw-stage{flex:1;position:relative;display:flex;align-items:center;justify-content:center;padding:8vh 8vw;text-align:center;overflow:hidden;}
  .lqw-ticker{position:absolute;left:0;right:0;z-index:1;opacity:.34;pointer-events:none;overflow:hidden;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;letter-spacing:.02em;color:#c3d3e6;}
  .lqw-ticker.lqw-top{top:7%;} .lqw-ticker.lqw-mid{top:47%;} .lqw-ticker.lqw-bot{bottom:7%;}
  .lqw-ticker .lqw-run{display:inline-block;padding-left:100%;animation:lqwtick 44s linear infinite;}
  .lqw-ticker.lqw-mid .lqw-run{animation-duration:60s;animation-direction:reverse;} .lqw-ticker.lqw-bot .lqw-run{animation-duration:52s;}
  @keyframes lqwtick{to{transform:translateX(-100%);}}
  .lqw-ticker .lqw-it{margin:0 26px;} .lqw-ticker .lqw-it::before{content:"\\25CF";color:rgba(240,112,112,.7);margin-right:11px;font-size:8px;vertical-align:2px;}
  .lqw-scene{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8vh 7vw;opacity:0;transform:translateY(18px) scale(.99);transition:opacity .9s ease,transform .9s ease;pointer-events:none;}
  .lqw-scene.lqw-live{opacity:1;transform:none;pointer-events:auto;}
  .lqw-line{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(26px,4.6vw,52px);line-height:1.12;color:#F4F6F8;max-width:16ch;margin:0;text-shadow:0 2px 30px rgba(5,13,26,.9);}
  .lqw-line .lqw-hl{color:#4ECFA0;} .lqw-line .lqw-go{color:#F0D080;}
  .lqw-scene.lqw-small .lqw-line{font-size:clamp(20px,3.2vw,34px);max-width:26ch;color:rgba(244,246,248,.62);}
  .lqw-eyes{display:flex;gap:26px;margin-bottom:34px;}
  .lqw-eye{width:clamp(58px,10vw,92px);aspect-ratio:220/130;display:inline-block;}
  .lqw-eyesvg{width:100%;height:100%;display:block;overflow:visible;}
  .lqw-eyesvg .lqw-slid{transform-box:fill-box;transform-origin:center top;transition:transform 1.05s cubic-bezier(.6,0,.2,1);transform:scaleY(1);}
  .lqw-scene[data-eyes="open"] .lqw-eye .lqw-eyesvg .lqw-slid{transform:scaleY(0);}
  .lqw-nums{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-top:30px;}
  .lqw-fn{font-family:'DM Serif Display',Georgia,serif;font-size:clamp(34px,7vw,64px);color:#4ECFA0;line-height:1;}
  .lqw-fl{display:block;font-size:12px;color:rgba(244,246,248,.62);margin-top:6px;letter-spacing:.04em;}
  .lqw-scene-cta{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:34px;}
  .lqw-final{display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:32px;}
  .lqw-apps{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;}
  .lqw-btn.lqw-app{background:transparent;border:1px solid rgba(29,158,117,.4);color:#4ECFA0;}
  .lqw-btn.lqw-app:hover{border-color:#4ECFA0;background:rgba(29,158,117,.1);}
  .lqw-btn{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;padding:13px 24px;cursor:pointer;border:none;}
  .lqw-btn.lqw-primary{background:#1D9E75;color:#050D1A;} .lqw-btn.lqw-primary:hover{background:#4ECFA0;}
  .lqw-btn.lqw-ghost{border:1px solid rgba(29,158,117,.4);color:#4ECFA0;background:transparent;} .lqw-btn.lqw-ghost:hover{border-color:#4ECFA0;background:rgba(29,158,117,.1);}
  .lqw-bar{display:flex;gap:6px;padding:14px 20px 0;}
  .lqw-seg{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden;}
  .lqw-seg .lqw-fill{display:block;height:100%;width:0;background:#4ECFA0;} .lqw-seg.lqw-done .lqw-fill{width:100%;}
  .lqw-ctrls{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 20px 20px;}
  .lqw-grp{display:flex;align-items:center;gap:8px;}
  .lqw-cbtn{background:transparent;border:1px solid rgba(255,255,255,.18);color:#F4F6F8;border-radius:8px;padding:8px 14px;font-family:'DM Sans',system-ui,sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s;}
  .lqw-cbtn:hover{border-color:#4ECFA0;background:rgba(29,158,117,.1);}
  .lqw-cbtn.lqw-icon{width:40px;padding:8px 0;text-align:center;}
  .lqw-closebtn{color:rgba(244,246,248,.4);} .lqw-hint{font-size:11px;color:rgba(244,246,248,.4);letter-spacing:.03em;}
  @media (prefers-reduced-motion:reduce){
    .lqw-eyesvg .lqw-slid,.lqw-scene{transition:none;} .lqw-ticker{display:none;} .lqw-scene{position:relative;opacity:1;transform:none;}
  }`;
  var MARKUP=`<div class="lqw-film" id="lqwFilm" role="dialog" aria-modal="true" aria-label="Walk me through it: a guided introduction to OpenQuorum" hidden>
    <div class="lqw-bar" id="lqwBar" aria-hidden="true"></div>
    <div class="lqw-stage" id="lqwStage">
      <div class="lqw-ticker lqw-top" aria-hidden="true"><span class="lqw-run" id="lqwTickA"></span></div>
      <div class="lqw-ticker lqw-mid" aria-hidden="true"><span class="lqw-run" id="lqwTickB"></span></div>
      <div class="lqw-ticker lqw-bot" aria-hidden="true"><span class="lqw-run" id="lqwTickC"></span></div>

      <div class="lqw-scene lqw-small" data-dur="6500" data-eyes="closed"><div class="lqw-eyes" aria-hidden="true"><span class="lqw-eye" data-iris="brown"></span><span class="lqw-eye" data-iris="hazel"></span></div><p class="lqw-line">The hardest problems hide in plain sight.</p></div>
      <div class="lqw-scene" data-dur="6500" data-eyes="open"><div class="lqw-eyes" aria-hidden="true"><span class="lqw-eye" data-iris="brown"></span><span class="lqw-eye" data-iris="hazel"></span></div><p class="lqw-line">Seeing them is the whole discipline. It&rsquo;s the first move of the work.</p></div>
      <div class="lqw-scene lqw-small" data-dur="8000"><p class="lqw-line">A dependency no one names. A decision layer no one&rsquo;s minding. <span class="lqw-hl">That&rsquo;s the shape of what Pamela finds.</span></p></div>
      <div class="lqw-scene" data-dur="7500"><p class="lqw-line">She doesn&rsquo;t write a report about it. She ships the <span class="lqw-hl">instrument</span> that lets ordinary people act on it.</p></div>
      <div class="lqw-scene" data-dur="7000"><p class="lqw-line" style="margin-bottom:4px;">OpenQuorum &mdash; live, in every state:</p><div class="lqw-nums" aria-hidden="true"><div><span class="lqw-fn" data-stat="jurisdictions">51</span><span class="lqw-fl">states + DC</span></div><div><span class="lqw-fn" data-stat="boards">430</span><span class="lqw-fl">boards</span></div><div><span class="lqw-fn" data-stat="seats">4,951</span><span class="lqw-fl">seats</span></div></div></div>
      <div class="lqw-scene" data-dur="8000"><p class="lqw-line">&ldquo;We couldn&rsquo;t find anyone qualified&rdquo; was never true. <span class="lqw-hl">It was unmapped.</span></p></div>
      <div class="lqw-scene" data-dur="7500"><p class="lqw-line">Same method, three scales: <span class="lqw-hl">civic, institutional, community.</span> One reckoning.</p></div>
      <div class="lqw-scene" data-dur="99999999"><p class="lqw-line">Once you see it, <span class="lqw-go">you LOOQ away at your own peril.</span></p><div class="lqw-final"><div class="lqw-apps"><a class="lqw-btn lqw-primary" href="https://seatfinder.us.com" target="_blank" rel="noopener">Find your seat &rarr;</a><a class="lqw-btn lqw-app" href="https://vacancyclock.us.com" target="_blank" rel="noopener">LOOQ for Vacancies</a><a class="lqw-btn lqw-app" href="https://impactmap.us.com" target="_blank" rel="noopener">Work not done</a><a class="lqw-btn lqw-app" href="https://civicquest.us.com" target="_blank" rel="noopener">Legacy LOOQ forward</a></div><button class="lqw-btn lqw-ghost" id="lqwDone">Take me back</button></div></div>
      </div>
    <div class="lqw-ctrls">
      <div class="lqw-grp">
        <button class="lqw-cbtn lqw-icon" id="lqwPrev" aria-label="Previous">&#8249;</button>
        <button class="lqw-cbtn lqw-icon" id="lqwPlay" aria-label="Pause">&#10073;&#10073;</button>
        <button class="lqw-cbtn lqw-icon" id="lqwNext" aria-label="Next">&#8250;</button>
        <span class="lqw-hint" id="lqwHint">Captions on &middot; press Esc to exit</span>
      </div>
      <button class="lqw-cbtn lqw-closebtn" id="lqwClose">Skip &times;</button>
    </div>
  </div>`;
  var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  var h=document.createElement('div');h.innerHTML=MARKUP.trim();document.body.appendChild(h.firstElementChild);
  (function(){
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var film=document.getElementById('lqwFilm'); if(!film) return;
    var stage=document.getElementById('lqwStage'), scenes=[].slice.call(stage.querySelectorAll('.lqw-scene')), bar=document.getElementById('lqwBar');
    var idx=0,timer=null,paused=false,lastFocus=null,started=false;

    var _eid=0;
    function makeEye(variant){
      var id=++_eid;
      var c = variant==='hazel' ? {a:'#9aa85e',b:'#5f7538',c:'#28331c',ring:'#1d2712'} : {a:'#b4823f',b:'#7a4f28',c:'#3a2414',ring:'#241408'};
      return '<svg class="lqw-eyesvg" viewBox="0 0 220 130" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
        +'<defs><radialGradient id="lqi'+id+'" cx="44%" cy="38%" r="62%"><stop offset="0%" stop-color="'+c.a+'"/><stop offset="55%" stop-color="'+c.b+'"/><stop offset="100%" stop-color="'+c.c+'"/></radialGradient>'
        +'<clipPath id="lqc'+id+'"><path d="M8,65 Q110,4 212,65 Q110,126 8,65 Z"/></clipPath></defs>'
        +'<g clip-path="url(#lqc'+id+')"><rect x="0" y="0" width="220" height="130" fill="#F1EADB"/><ellipse cx="110" cy="4" rx="150" ry="42" fill="#2a1d10" opacity="0.2"/>'
        +'<g><circle cx="110" cy="66" r="45" fill="url(#lqi'+id+')"/><circle cx="110" cy="66" r="45" fill="none" stroke="'+c.ring+'" stroke-width="4" opacity="0.75"/>'
        +'<g stroke="'+c.c+'" stroke-width="1" opacity="0.28"><line x1="110" y1="66" x2="110" y2="26"/><line x1="110" y1="66" x2="150" y2="66"/><line x1="110" y1="66" x2="110" y2="106"/><line x1="110" y1="66" x2="70" y2="66"/><line x1="110" y1="66" x2="139" y2="39"/><line x1="110" y1="66" x2="81" y2="93"/><line x1="110" y1="66" x2="139" y2="93"/><line x1="110" y1="66" x2="81" y2="39"/></g>'
        +'<circle cx="110" cy="66" r="18" fill="#0d0906"/><circle cx="99" cy="54" r="7.5" fill="#fff" opacity="0.92"/><circle cx="121" cy="77" r="3" fill="#fff" opacity="0.5"/></g>'
        +'<rect class="lqw-slid" x="-6" y="-6" width="232" height="142" fill="#050D1A"/></g>'
        +'<path d="M8,65 Q110,4 212,65 Q110,126 8,65 Z" fill="none" stroke="#F4F6F8" stroke-width="3.5" stroke-linejoin="round"/>'
        +'<g stroke="#F4F6F8" stroke-width="2.4" stroke-linecap="round" opacity="0.8"><line x1="52" y1="28" x2="45" y2="15"/><line x1="86" y1="16" x2="82" y2="1"/><line x1="120" y1="13" x2="123" y2="-2"/><line x1="152" y1="18" x2="159" y2="4"/><line x1="176" y1="30" x2="185" y2="19"/></g>'
        +'</svg>';
    }
    [].slice.call(film.querySelectorAll('.lqw-eye')).forEach(function(el){ el.innerHTML = makeEye(el.getAttribute('data-iris')); });

    /* dynamic numbers (site root /oq-stats.json, with baked fallback) */
    var FALLBACK={jurisdictions:51,boards:430,seats:4951};
    function paint(s){ film.querySelectorAll('[data-stat]').forEach(function(el){ var k=el.getAttribute('data-stat'); if(s[k]!=null) el.setAttribute('data-count',s[k]); }); }
    paint(FALLBACK);
    fetch('/oq-stats.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(j){ if(j) paint(Object.assign({},FALLBACK,j)); }).catch(function(){});
    function countUp(el){ var t=parseFloat((el.getAttribute('data-count')||el.textContent).toString().replace(/,/g,'')); if(isNaN(t))return; if(reduce){el.textContent=t.toLocaleString();return;}
      var s=null,d=1300;(function tick(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1),e=1-Math.pow(1-p,3);el.textContent=Math.floor(e*t).toLocaleString();if(p<1)requestAnimationFrame(tick);else el.textContent=t.toLocaleString();})(performance.now()); }

    /* ticker */
    var HEAD=["Ratepayers billed for a data center they never approved","Public comment sealed behind a nondisclosure agreement","A community hospital closes after a private-equity buyout","Fresh produce recalled — cyclospora","Packaged meals pulled — salmonella","Days without power, and no one held to account","The hearing was public. The seats were empty.","Decided while the rest of us scrolled past","Who signed off on this? The seat was empty."];
    function fillT(el,ord){ if(!el)return; var s=ord.map(function(i){return '<span class="lqw-it">'+HEAD[i]+'</span>';}).join(''); el.innerHTML=s+s; }
    fillT(document.getElementById('lqwTickA'),[0,2,4,8,6]); fillT(document.getElementById('lqwTickB'),[1,3,7,5]); fillT(document.getElementById('lqwTickC'),[8,6,0,2,4]);

    /* engine */
    scenes.forEach(function(){var s=document.createElement('span');s.className='lqw-seg';s.innerHTML='<span class="lqw-fill"></span>';bar.appendChild(s);});
    var segs=[].slice.call(bar.querySelectorAll('.lqw-seg'));
    function clearTimer(){if(timer){clearTimeout(timer);timer=null;}}
    function show(i){ clearTimer(); scenes.forEach(function(s,n){s.classList.toggle('lqw-live',n===i);}); segs.forEach(function(s,n){s.classList.toggle('lqw-done',n<i);var f=s.querySelector('.lqw-fill');f.style.transition='none';f.style.width=(n<i?'100%':'0');}); idx=i;
      var nums=scenes[i].querySelectorAll('[data-stat]'); if(nums.length)nums.forEach(countUp);
      if(reduce)return; var dur=parseInt(scenes[i].getAttribute('data-dur'),10)||7000; if(dur>10000000)return;
      var fill=segs[i].querySelector('.lqw-fill'); requestAnimationFrame(function(){fill.style.transition='width '+dur+'ms linear';fill.style.width='100%';});
      if(!paused)timer=setTimeout(next,dur); }
    function next(){ if(idx<scenes.length-1)show(idx+1); else show(scenes.length-1); }
    function prev(){ if(idx>0)show(idx-1); }
    function play(){ paused=false; var b=document.getElementById('lqwPlay'); b.innerHTML='&#10073;&#10073;'; b.setAttribute('aria-label','Pause'); show(idx); }
    function pause(){ paused=true; clearTimer(); var f=segs[idx].querySelector('.lqw-fill'),w=getComputedStyle(f).width; f.style.transition='none'; f.style.width=w; var b=document.getElementById('lqwPlay'); b.innerHTML='&#9654;'; b.setAttribute('aria-label','Play'); }
    function openModal(){ lastFocus=document.activeElement; film.hidden=false; film.classList.add('lqw-on'); document.documentElement.style.overflow='hidden'; paused=false; document.getElementById('lqwPlay').innerHTML='&#10073;&#10073;'; if(reduce){document.getElementById('lqwHint').textContent='Use ‹ › to move · Esc to exit';scenes.forEach(function(s){s.classList.add('lqw-live');});} idx=0; show(0); document.getElementById('lqwClose').focus(); }
    function closeModal(){ clearTimer(); film.classList.remove('lqw-on'); film.hidden=true; document.documentElement.style.overflow=''; if(lastFocus&&lastFocus.focus)lastFocus.focus(); }

    [].slice.call(document.querySelectorAll('[data-looq-play]')).forEach(function(b){ b.addEventListener('click',function(e){e.preventDefault();openModal();}); });
    document.getElementById('lqwClose').addEventListener('click',closeModal);
    document.getElementById('lqwDone').addEventListener('click',closeModal);
    document.getElementById('lqwNext').addEventListener('click',function(){if(paused)paused=false;next();});
    document.getElementById('lqwPrev').addEventListener('click',prev);
    document.getElementById('lqwPlay').addEventListener('click',function(){paused?play():pause();});
    document.addEventListener('keydown',function(e){ if(film.hidden)return; if(e.key==='Escape')closeModal(); else if(e.key==='ArrowRight'){if(paused)paused=false;next();} else if(e.key==='ArrowLeft')prev(); else if(e.key===' '){e.preventDefault();paused?play():pause();} });
    window.LOOQ={open:openModal,close:closeModal};
  })();
})();
