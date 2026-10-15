/* Lift — Quiet doorway app.
   Single navigation source, explicit page renderers, reusable components.
   No global function reassignment; no script-order-dependent overrides. */
(function(root){
'use strict';
const I=LIFT_I18N, S=LIFT_STORE;
const t=(k,p)=>I.t(k,p);

/* ---------- icons — Lift's own set (geometric, doorway-derived) ----------
   One coherent family: rounded-square geometry, 1.6 stroke, round joins, 24 grid.
   Each mark is drawn for its meaning, not pulled from a generic line set. */
const ICONS={
 // home — a doorway with a step
 home:'<path d="M5 20v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9"/><path d="M5 20h14"/><path d="M9 20v-5a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 15v5"/><circle cx="12" cy="5.5" r="1.6" fill="currentColor" stroke="none"/>',
 // daily life — a day: sun over a horizon line
 life:'<circle cx="12" cy="11" r="3.4"/><path d="M12 4.5v1.6M5.5 11H4m16 0h-1.6M7.2 6.9l1.1 1.1m7.4-1.1-1.1 1.1"/><path d="M4 17.5h16M7 20.5h10"/>',
 // family — two figures, one sheltered
 family:'<circle cx="9" cy="8.5" r="2.6"/><path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20"/><circle cx="16.8" cy="10" r="2.1"/><path d="M15.5 20v-.8a3.6 3.6 0 0 1 5-3.3"/>',
 // community — two speech marks overlapping
 community:'<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h6A2.5 2.5 0 0 1 15 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.2 2.6c-.4.3-1 0-1-.5V6.5Z"/><path d="M17 9.5h.5A2.5 2.5 0 0 1 20 12v3.4c0 .5-.6.8-1 .5l-1.5-1.2" opacity=".55"/>',
 // mine — a record card with a checkmark
 mine:'<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8h7M8.5 11.5h7"/><path d="m8.7 16.2 1.6 1.6 3-3.2"/>',
 // money — a note with a strong centre mark
 money:'<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v.01M18 14.5v.01" stroke-width="2"/>',
 // dates — a calendar with a marked day
 dates:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/><circle cx="15.5" cy="15.5" r="2" fill="currentColor" stroke="none"/>',
 // arrows / utility
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 back:'<path d="M20 12H5m6 6-6-6 6-6"/>',
 check:'<path d="m4.5 12.5 4.5 4.5L19.5 6.5"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c5.8 5.8 5.8 11.2 0 17-5.8-5.8-5.8-11.2 0-17Z"/>',
 shield:'<path d="M12 2.8 3.5 6.8v5.4c0 4.6 8.5 8.4 8.5 8.4s8.5-3.8 8.5-8.4V6.8Z"/><path d="m8.6 12 2.3 2.3 4.5-4.8"/>',
 sprout:'<path d="M12 21.5v-9"/><path d="M12 12.5C5 12.5 3.2 7.5 4 3.5c5.5-.9 9 2.6 8 9 0-7 3.6-9.8 9-8.8.9 5.4-2.7 9.8-9 8.8" fill="none"/>',
 copy:'<rect x="8.5" y="8.5" width="11" height="12" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
 download:'<path d="M12 3.5v11m-4.5-4.5L12 14.5l4.5-4.5M4.5 17v3.5h15V17"/>',
 ext:'<path d="M14 4.5h5.5V10M19.5 4.5 10.5 13.5M18 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H11"/>',
 sun:'<circle cx="12" cy="12" r="3.6"/><path d="M12 2.5v2m0 15v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2.5 12h2m15 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
 moon:'<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3a6.8 6.8 0 0 0 10 10.5Z"/>',
 info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="1.1" fill="currentColor" stroke="none"/>'
};
function icon(name,cls){return `<svg class="${cls||'ic'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.sprout}</svg>`;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* Lift wordmark — the red dot sits ON the dotless ı (tight, optically centred) */
function wordmark(){return `<span class="wordmark">l<span class="wl">ı</span>ft</span>`;}

/* ---------- navigation (single source) ---------- */
const SECTIONS=[
 {id:'home', icon:'home'},
 {id:'life', icon:'life'},
 {id:'family', icon:'family'},
 {id:'community', icon:'community'},
 {id:'mine', icon:'mine'}
];
const ROUTES={
 home:()=>PgHome(),
 /* daily life tools */
 life:()=>PgLifeHub(),
 'life/everyday':()=>LIFT_PG.everyday(),
 'life/money':()=>LIFT_PG.money(),
 'life/dates':()=>LIFT_PG.dates(),
 family:()=>LIFT_PG.family(),
 community:()=>LIFT_PG.community(),
 mine:()=>LIFT_PG.mine()
};
function sectionOf(route){ const r=(route||'home'); if(r==='home')return 'home'; if(r.startsWith('life'))return 'life'; if(r.startsWith('family'))return 'family'; if(r.startsWith('community'))return 'community'; if(r.startsWith('mine'))return 'mine'; return 'home'; }
function navigate(route){ if(location.hash==='#'+route) render(); else location.hash=route; }

/* ---------- shell ---------- */
function renderShell(){
 document.body.innerHTML=`
 <a class="skip" href="#main">${t('a11y.skip')}</a>
 <div class="shell">
  <aside class="sidebar">
    <a class="brand" href="#home" aria-label="Lift home">${wordmark()}</a>
    <p class="brand-note">${t('app.tagline')}</p>
    <nav class="sidenav" aria-label="Main">
      ${SECTIONS.map(s=>`<a href="#${s.id}" data-route="${s.id}">${icon(s.icon)}<span>${t('nav.'+s.id)}</span></a>`).join('')}
    </nav>
    <div class="side-foot">
      <div class="motifline">${icon('sprout')}<span>${t('home.assurance')}</span></div>
    </div>
  </aside>
  <div class="workspace">
    <header class="topbar">
      <a class="mobile-brand" href="#home" aria-label="Lift home">${wordmark()}</a>
      <span class="context">${t('app.context')}</span>
      <span class="spacer"></span>
      <button class="iconbtn" id="btn-text" aria-pressed="false" aria-label="${t('a11y.largerText')}"><b style="font-size:13px">A+</b></button>
      <button class="iconbtn" id="btn-theme" aria-pressed="false" aria-label="${t('a11y.theme')}">${icon('sun')}</button>
      <button class="iconbtn" id="btn-lang" aria-label="${t('a11y.language')}">${icon('globe')}<span>${I.isMy()?'မြန်မာ':'EN'}</span></button>
    </header>
    <main id="main" tabindex="-1"></main>
  </div>
 </div>
 <nav class="pillbar" aria-label="Mobile">
   ${SECTIONS.map(s=>`<a href="#${s.id}" data-route="${s.id}">${icon(s.icon)}<span>${t('nav.'+s.id)}</span><span class="badge" hidden></span></a>`).join('')}
 </nav>
 <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
 bindShell();
}
function bindShell(){
 document.getElementById('btn-lang').onclick=()=>{ switchLocale(); };
 document.getElementById('btn-theme').onclick=function(){
   const dark=document.documentElement.dataset.theme==='dark';
   document.documentElement.dataset.theme=dark?'':'dark';
   try{localStorage.setItem('lift-theme', dark?'':'dark');}catch{}
   this.setAttribute('aria-pressed', String(!dark));
   this.innerHTML=icon(dark?'sun':'moon');
 };
 document.getElementById('btn-text').onclick=function(){
   const on=document.documentElement.classList.toggle('large-text');
   this.setAttribute('aria-pressed', String(on));
   fixNavClearance();
 };
}
/* flip language and rebuild the whole shell so nav, headings and buttons all translate */
function switchLocale(){
 I.setLocale(I.isMy()?'en':'my');
 renderShell();
 render();
}
/* when locale is set from outside (verification harness), rebuild shell too */
if(root.addEventListener){ root.addEventListener('lift:locale', ()=>{ renderShell(); render(); }); }
/* reserve real bottom-nav height so it never covers content (grows with enlarged Myanmar) */
function fixNavClearance(){
 const bar=document.querySelector('.pillbar');
 if(!bar) return;
 const h=Math.ceil(bar.getBoundingClientRect().height);
 document.documentElement.style.setProperty('--nav-h',(h)+'px');
}
if(typeof ResizeObserver!=='undefined'){
 addEventListener('load',()=>{const bar=document.querySelector('.pillbar'); if(bar) new ResizeObserver(fixNavClearance).observe(bar);});
}

/* ---------- shared components ---------- */
function pagehead(eyebrow,title,desc){return `<div class="pagehead"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${desc?`<p>${esc(desc)}</p>`:''}</div>`;}
function toast(msg){const el=document.getElementById('toast'); if(!el)return; el.textContent=msg; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),4000);}
function sheet(html){
 closeSheet();
 const w=document.createElement('div'); w.className='sheet'; w.id='sheet';
 w.innerHTML=`<div class="panel" role="dialog" aria-modal="true"><div class="wrap"><button class="close" aria-label="${t('a11y.close')}">×</button>${html}</div></div>`;
 document.body.appendChild(w);
 w.querySelector('.close').onclick=closeSheet;
 w.addEventListener('click',e=>{ if(e.target===w) closeSheet(); });
 document.addEventListener('keydown',escClose);
 return w;
}
function escClose(e){ if(e.key==='Escape') closeSheet(); }
function closeSheet(){ const s=document.getElementById('sheet'); if(s){s.remove(); document.removeEventListener('keydown',escClose);} }
function externalSheet(url,label){
 const w=sheet(`<h2>${t('ex.title')}</h2><p class="lede">${t('ex.help')}</p><p class="help" style="margin-top:10px"><span class="hic">i</span><span>${t('ex.needsNet')}</span></p>
 <div class="stack" style="margin-top:18px"><a class="btn primary block" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${t('ex.open')} ${icon('ext')}</a><button class="btn secondary block" data-x>${t('ex.cancel')}</button></div>`);
 w.querySelector('[data-x]').onclick=closeSheet;
 w.querySelector('a').addEventListener('click',()=>setTimeout(closeSheet,300));
}
function opt(kind,name,value,checked,label,sub,disabled){
 return `<label class="opt ${kind==='checkbox'?'checkbox':''} ${disabled?'disabled':''}"><input type="${kind}" name="${esc(name)}" value="${esc(value)}" ${checked?'checked':''} ${disabled?'disabled':''}><span class="box"></span><span class="ot"><b>${esc(label)}</b>${sub?`<span>${esc(sub)}</span>`:''}</span></label>`;
}
function field(id,label,inner,help,err){
 return `<div class="field"><label for="${esc(id)}">${esc(label)}</label>${inner}${help?`<p class="help" id="${esc(id)}-help"><span class="hic">i</span><span>${esc(help)}</span></p>`:''}<p class="error-msg" id="${esc(id)}-err" role="alert" hidden>${err?esc(err):''}</p></div>`;
}
function moneyInput(id,val){return `<input class="control" id="${esc(id)}" name="${esc(id.replace(/^m-/,''))}" type="text" inputmode="decimal" autocomplete="off" maxlength="16" value="${esc(val||'')}" placeholder="0">`;}
function stepsList(items){return `<ol class="steps">${items.map(s=>`<li class="${s.state}"><span class="n">${s.state==='done'?icon('check'):s.n}</span><span class="st"><b>${esc(s.title)}</b><span>${esc(s.sub)}</span></span></li>`).join('')}</ol>`;}

/* ---------- Home ---------- */
function inProgressCount(){
 const s=S.get();
 let n=0;
 if(s.everyday.selected.length) n++;
 if(s.family.topics.length) n++;
 if(S.get().saved.length) n+=0;
 return n;
}
function PgHome(){
 const s=S.get();
 const hasEq=s.everyday.selected.length>0, hasFam=s.family.topics.length>0;
 const cont=(hasEq||hasFam)?`<a class="taskrow" href="${hasEq?'#life/everyday':'#family'}"><span class="tic">${icon(hasEq?'life':'family')}</span><span class="tt"><b>${t('home.continue')}</b><span>${hasEq?t('eq.selected'):t('fam.questions','')||t('fam.choose')}</span></span><span class="chev">›</span></a>`:'';
 return `
 ${pagehead(t('home.eyebrow'), t('home.title'), t('home.intro'))}
 <div class="card wm-host hero-card">
   <b style="font-size:15px">${t('home.start.title')}</b>
   <p style="margin-top:4px">${t('home.start.sub')}</p>
   <a class="btn primary block" style="margin-top:14px" href="#life/everyday">${t('home.start.cta')} ${icon('arrow')}</a>
 </div>
 ${cont}
 <div class="stack" style="margin-top:16px">
   <a class="taskrow" href="#life/money"><span class="tic">${icon('money')}</span><span class="tt"><b>${t('home.money.title')}</b><span>${t('home.money.sub')}</span></span><span class="chev">›</span></a>
   <a class="taskrow" href="#family"><span class="tic">${icon('family')}</span><span class="tt"><b>${t('home.family.title')}</b><span>${t('home.family.sub')}</span></span><span class="chev">›</span></a>
   <a class="taskrow" href="#community"><span class="tic">${icon('community')}</span><span class="tt"><b>${t('home.community.title')}</b><span>${t('home.community.sub')}</span></span><span class="chev">›</span></a>
   <a class="taskrow" href="#mine"><span class="tic">${icon('mine')}</span><span class="tt"><b>${t('home.record.title')}</b><span>${t('home.record.sub')}</span></span><span class="chev">›</span></a>
 </div>
 <p class="help" style="margin-top:16px"><span class="hic">i</span><span>${t('home.assurance')}</span></p>`;
}
/* Daily-life hub — canonical home of the life tools */
function PgLifeHub(){
 return `
 ${pagehead(t('nav.life'), t('nav.life'), '')}
 <div class="stack">
  <a class="taskrow" href="#life/everyday"><span class="tic">${icon('life')}</span><span class="tt"><b>${t('eq.title')}</b><span>${t('eq.receive')}</span></span><span class="chev">›</span></a>
  <a class="taskrow" href="#life/money"><span class="tic">${icon('money')}</span><span class="tt"><b>${t('mn.title')}</b><span>${t('mn.receive')}</span></span><span class="chev">›</span></a>
  <a class="taskrow" href="#life/dates"><span class="tic">${icon('dates')}</span><span class="tt"><b>${t('dt.title')}</b><span>${t('dt.receive')}</span></span><span class="chev">›</span></a>
 </div>`;
}

/* ---------- render + route ---------- */
function render(){
 const route=location.hash.slice(1)||'home';
 const fn=ROUTES[route]||ROUTES.home;
 const main=document.getElementById('main');
 main.innerHTML=fn();
 const sec=sectionOf(route);
 document.querySelectorAll('[data-route]').forEach(a=>{
   const on=a.dataset.route===sec;
   if(on) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
 });
 // wire dynamic handlers defined by page modules
 if(root.LIFT_WIRE) root.LIFT_WIRE(route,main);
 fixNavClearance();
 window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>{ render(); document.getElementById('main').focus(); });

/* ---------- boot ---------- */
S.init();
// apply persisted theme
try{ const th=localStorage.getItem('lift-theme'); if(th==='dark'){document.documentElement.dataset.theme='dark';} }catch{}

/* expose small API for page modules */
root.LIFT_APP={t,icon,esc,navigate,toast,sheet,closeSheet,externalSheet,opt,field,moneyInput,stepsList,pagehead,wordmark,fixNavClearance,rerender:render};
if(root.LIFT_PAGES_INIT) root.LIFT_PAGES_INIT(root.LIFT_APP);

renderShell();
render();
})(typeof window!=='undefined'?window:globalThis);
