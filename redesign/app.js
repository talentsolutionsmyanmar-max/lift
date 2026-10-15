/* Lift — Quiet doorway app.
   Single navigation source, explicit page renderers, reusable components.
   No global function reassignment; no script-order-dependent overrides. */
(function(root){
'use strict';
const I=LIFT_I18N, S=LIFT_STORE;
const t=(k,p)=>I.t(k,p);

/* ---------- icons (one family, 1.7 stroke, currentColor) ---------- */
const ICONS={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
 life:'<rect x="7" y="3" width="12" height="18" rx="3"/><path d="M10 6h4M10 18h4"/><path d="M10 10h4M10 13h4"/>',
 family:'<path d="m2 9 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6"/>',
 community:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m1-16a3 3 0 0 1 0 6m2 3c3 1 3 4 3 7"/>',
 mine:'<path d="M9 6h12M9 12h12M9 18h12M3 6l1 1 2-3M3 12l1 1 2-3M3 18l1 1 2-3"/>',
 money:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>',
 dates:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4"/><circle cx="16" cy="16" r="2"/>',
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 back:'<path d="M20 12H5m6 6-6-6 6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 6 6 12 0 18-6-6-6-12 0-18Z"/>',
 shield:'<path d="M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7Zm-4 9 3 3 5-6"/>',
 sprout:'<path d="M12 22V12M12 15C4 15 2 9 3 4c6-1 10 3 9 9 0-8 4-11 10-10 1 6-3 11-10 10"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 ext:'<path d="M14 4h6v6M20 4 10 14M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>'
};
function icon(name,cls){return `<svg class="${cls||'ic'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.sprout}</svg>`;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function wordmark(){return `<span class="wordmark">l<i>ı</i>ft</span>`;}

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
 <div class="card wm-host" style="background:var(--action-soft);border-color:color-mix(in srgb,var(--action) 20%,transparent)">
   <b style="font-size:14px">${t('home.start.title')}</b>
   <p style="margin-top:3px">${t('home.start.sub')}</p>
   <a class="btn primary block" style="margin-top:12px" href="#life/everyday">${t('home.start.cta')} ${icon('arrow')}</a>
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
