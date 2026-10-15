/* Lift Doorstep — shell, router and the ONE delegated event handler.
   Routes: #home · #community · #mine · #a/<activity>/<step> · #c/<cardId> · #edit/<cardId> · #show/<cardId> */
(function(root){'use strict';
const U=root.LiftUI, I=root.LiftI18n, St=root.LiftStore, S=St.S, X=root.LiftScreens;
const {t,x,ic,esc}=U;
const ui={theme:root.matchMedia&&root.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',large:false,sheet:null,lastFocus:null};
S.trayAnim=false; S.cashLate={};
const params=new URLSearchParams(location.search);
I.setLang(params.get('lang')==='en'?'en':'my'); I.setDev(params.get('copy')==='dev');
let app;

/* ---------------- render ---------------- */
function route(){return (location.hash||'#home').slice(1);}
function view(){
  const r=route(), p=r.split('/');
  if(r==='home'||r==='') return X.home();
  if(r==='community') return X.community();
  if(r==='mine') return X.mine();
  if(p[0]==='a'&&X.ACT[p[1]]){const fn=X.ACT[p[1]][p[2]||'intro'];const v=fn&&fn();return v||X.ACT[p[1]].intro();}
  if(p[0]==='edit'){const to=edit(p[1]);history.replaceState(null,'',to||'#home');return view();}
  if(p[0]==='c'||p[0]==='show'){const c=S.cards.find(c=>c.id===p[1]);if(!c)return X.notFound();return p[0]==='show'&&(c.kind==='everyday'||c.kind==='family')?X.show(c):X.ACT[c.kind].result(c);}
  return X.notFound();
}
function render(keepFocus){
  let v; try{v=view();}catch(e){console.error(e);v={nav:'home',html:`<main id="main" class="page" tabindex="-1">${U.ph(t('error.title'),t('error.body'))}<button class="btn primary" type="button" data-act="retry">${t('error.retry')}</button></main>`};}
  const focusKey=keepFocus&&document.activeElement&&(document.activeElement.dataset.field||(document.activeElement.name?document.activeElement.name+'='+document.activeElement.value:null)||(document.activeElement.dataset.act?'act='+document.activeElement.dataset.act+(document.activeElement.dataset.v||''):null));
  const offline=navigator.onLine===false?`<div class="offline-bar">${U.note('offline','cloudoff',t('offline'),'role="status"')}</div>`:'';
  app.className=`app lift${ui.large?' is-large':''}${v.showing?' showing':''}${I.dev?' copy-dev':''}`;
  app.lang=I.lang; if(ui.theme==='dark')app.dataset.theme='dark';else delete app.dataset.theme;
  document.documentElement.lang=I.lang; document.body.classList.toggle('dark',ui.theme==='dark');
  app.innerHTML=`<a class="skip" href="#main" data-act="skip">${t('a11y.skip')}</a>${U.header(ui)}${U.sill(v.progress)}${offline}${v.html}${v.dock?U.dock(v.dock):''}${v.nav?U.nav(v.nav):''}${ui.sheet?ui.sheet():''}<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  S.trayAnim=false;
  if(focusKey){const el=[...app.querySelectorAll('input,select,button')].find(e=>(e.dataset.field===focusKey)||(e.name&&e.name+'='+e.value===focusKey)||('act='+e.dataset.act+(e.dataset.v||'')===focusKey));if(el)el.focus({preventScroll:true});}
  if(ui.sheet){const first=app.querySelector('.sheet input,.sheet button,.sheet summary');if(first&&!keepFocus)first.focus();}
}
function go(hash){if(location.hash===hash)render();else location.hash=hash;}
addEventListener('hashchange',()=>{ui.sheet=null;render();scrollTo(0,0);const h=app.querySelector('main h1');if(h)h.focus({preventScroll:true});});

/* ---------------- feedback ---------------- */
function toast(msg){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),4200);}
function announce(msg){const el=document.getElementById('res-status');if(el)el.textContent=msg;toast(msg);}

/* ---------------- sheets ---------------- */
function openSheet(fn){ui.lastFocus=document.activeElement&&document.activeElement.dataset.act;ui.sheet=fn;render();}
function closeSheet(){ui.sheet=null;render();const back=ui.lastFocus&&app.querySelector(`[data-act="${ui.lastFocus}"]`);if(back)back.focus();}
function saveSheet(id){
  let choice=null, error=false;
  const fn=()=>U.sheet(`<h2 id="sh-t">${t('save.title')}</h2>
    <p class="keeplist">${t('save.what')}</p>
    <div class="stack" role="radiogroup" aria-labelledby="sh-t">
      ${U.opt({type:'radio',name:'save-c',value:'keep',checked:choice==='keep',label:t('save.keep'),why:t('save.keepSub'),act:'save-choice'})}
      ${U.opt({type:'radio',name:'save-c',value:'dont',checked:choice==='dont',label:t('save.dont'),why:t('save.dontSub'),act:'save-choice'})}
    </div>
    <details><summary>${t('save.shared')}</summary><p class="help">${t('save.sharedText')}</p></details>
    ${error?U.note('error','alert',`<b style="display:block">${t('save.failTitle')}</b>${t('save.failBody')}`,'role="alert" style="margin:8px 0 0"'):''}
    ${U.errorMsg('save-e',false,'save.choose')}
    <div class="sheet-actions"><button class="btn primary" type="button" data-act="save-confirm" data-id="${id}">${t('save.confirm')}</button><button class="btn text" type="button" data-act="sheet-close">${t('a11y.close')}</button></div>`,'sh-t');
  fn.setChoice=v=>{choice=v;error=false;}; fn.getChoice=()=>choice; fn.fail=()=>{error=true;};
  openSheet(fn);
}
function removeSheet(id){
  openSheet(()=>U.sheet(`<h2 id="sh-t">${t('mine.removeConfirm')}</h2><p class="help">${esc(x(X.titleFor(S.cards.find(c=>c.id===id))))}</p>
   <div class="sheet-actions"><button class="btn primary" type="button" data-act="remove-confirm" data-id="${id}">${t('mine.remove')}</button><button class="btn text" type="button" data-act="sheet-close">${t('a11y.close')}</button></div>`,'sh-t'));
}
function extSheet(url,name){
  openSheet(()=>U.sheet(`<h2 id="sh-t">${t('ext.title')}</h2><p class="help" style="font-weight:700;margin-bottom:6px">${esc(name)}</p><p class="help">${t('ext.help')}</p>
   ${U.note('info','info',t('ext.needsNet'),'style="margin-top:12px"')}
   <div class="sheet-actions"><a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-act="ext-open">${t('ext.open')} ${ic('ext','sm')}</a><button class="btn text" type="button" data-act="sheet-close">${t('ext.stay')}</button></div>`,'sh-t'));
}

/* ---------------- outputs: copy / download / calendar ---------------- */
async function copyText(text){
  try{if(navigator.clipboard&&root.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch{}
  try{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;}catch{return false;}
}
function download(name,text,type){
  try{const blob=new Blob([text],{type:type||'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);return true;}catch{return false;}
}
const cardText=c=>c.kind==='everyday'?X.everyday.text(c):X.family.text(c);

/* ---------------- validation + commit per activity ---------------- */
const D=new Proxy({},{get:(o,k)=>S.drafts[k]});
function moneyErr(fields){const e={};let bad=false;for(const k of fields){if(!X.parseField(D.money[k]).ok){e[k]=true;bad=true;}}return bad?e:null;}
const ACTIONS={
  retry:()=>render(),
  large:()=>{ui.large=!ui.large;render(true);},
  theme:()=>{ui.theme=ui.theme==='dark'?'light':'dark';render(true);},
  lang:()=>{I.setLang(I.lang==='my'?'en':'my');render(true);},
  'start-housing':e=>{e.preventDefault();freshStart('everyday');D.everyday.topic='housing';D.everyday.else=false;go('#a/everyday/intro');},
  'eq-topic':(e,el)=>{const v=el.value;if(v==='else'){D.everyday.else=true;}else{if(D.everyday.topic!==v){D.everyday.selected=[];D.everyday.unsure=false;}D.everyday.topic=v;D.everyday.else=false;}S.errors.eq1=false;render(true);},
  'eq-next1':()=>{if(!D.everyday.topic||D.everyday.else){S.errors.eq1=!D.everyday.else;render(true);if(D.everyday.else)return;return;}go('#a/everyday/2');},
  'eq-q':(e,el)=>{const s=new Set(D.everyday.selected);el.checked?s.add(el.value):s.delete(el.value);const order=[1,2,3].map(n=>D.everyday.topic+n);D.everyday.selected=[...s].sort((a,b)=>order.indexOf(a)-order.indexOf(b));if(el.checked){D.everyday.selected=D.everyday.selected.filter(k=>k!==el.value).concat(el.value);}D.everyday.unsure=D.everyday.selected.length===3&&D.everyday.unsure;S.errors.eq2=false;S.trayAnim=true;render(true);},
  'eq-unsure':(e,el)=>{D.everyday.unsure=el.checked;if(el.checked)D.everyday.selected=[1,2,3].map(n=>D.everyday.topic+n);S.errors.eq2=false;S.trayAnim=true;render(true);},
  'eq-finish':()=>{if(!D.everyday.selected.length){S.errors.eq2=true;render(true);return;}const order=[1,2,3].map(n=>D.everyday.topic+n);const c=St.commit('everyday',{topic:D.everyday.topic,keys:order.filter(k=>D.everyday.selected.includes(k))});go('#c/'+c.id);},
  'fam-t':(e,el)=>{const s=new Set(D.family.topics);el.checked?s.add(el.value):s.delete(el.value);D.family.topics=St.FAM_TOPICS.filter(k=>s.has(k));S.errors.fam1=false;render(true);},
  'fam-finish':()=>{if(!D.family.topics.length){S.errors.fam1=true;render(true);return;}const c=St.commit('family',{topics:[...D.family.topics]});go('#c/'+c.id);},
  'dt-p':(e,el)=>{D.dates.process=el.value;S.errors.dt1=false;render(true);},
  'dt-next1':()=>{if(!D.dates.process){S.errors.dt1=true;render(true);return;}go('#a/dates/2');},
  'dt-s':(e,el)=>{D.dates.source=el.value;S.errors.dt2=false;render(true);},
  'dt-c':(e,el)=>{D.dates.confirmed=el.checked;S.errors.dt2=false;render(true);},
  'dt-finish':()=>{const d=D.dates;if(!root.LiftDates.validDate(d.date)||!d.source||!d.confirmed){S.errors.dt2=true;render(true);const err=app.querySelector('#dt-date-e');if(err)err.scrollIntoView({block:'center'});return;}const c=St.commit('dates',{process:d.process,date:d.date,source:d.source,id:'d'+Math.random().toString(36).slice(2,12)});go('#c/'+c.id);},
  'mn-p':(e,el)=>{D.money.period=el.value;S.errors.mn1=false;render(true);},
  'mn-next1':()=>{if(!D.money.period){S.errors.mn1=true;render(true);return;}go('#a/money/2');},
  'mn-next2':()=>{const v=String(D.money.available||'').trim();if(!v){S.errors.mn2='missing';render(true);return;}if(!X.parseField(v).ok){S.errors.mn2='invalid';render(true);return;}S.errors.mn2=null;go('#a/money/3');},
  'mn-finish':()=>{const e=moneyErr(X.COSTS);if(e){S.errors.mn3=e;render(true);return;}S.errors.mn3=null;const c=St.commit('money',{period:D.money.period,values:{...D.money}});go('#c/'+c.id);},
  /* A spending remainder is NOT money held now. Offer it only as a clearly labelled proposal that
     needs explicit acceptance; never fill or overwrite the field automatically. */
  'cash-from-money':(e)=>{e.preventDefault();const m=S.cards.find(c=>c.id===e.target.closest('[data-id]').dataset.id);S.cashProposal=null;if(m){const r=root.LiftSpending.calculate(m.data.values);if(r.remaining>0)S.cashProposal=r.remaining;}go('#a/cash/intro');},
  'cf-accept':()=>{if(S.cashProposal&&!String(D.cash.cash||'').trim()){D.cash.cash=(S.cashProposal/100).toFixed(S.cashProposal%100?2:0);}S.cashProposal=null;render(true);const f=app.querySelector('#cash');if(f)f.focus();},
  'cf-dismiss':()=>{S.cashProposal=null;render(true);},
  'cf-next1':()=>{const d=D.cash,e={};for(const k of ['cash','daily']){const v=String(d[k]||'').trim();if(!v)e[k]='missing';else if(!X.parseField(v).ok)e[k]='invalid';}if(Object.keys(e).length){S.errors.cf1=e;render(true);return;}S.errors.cf1=null;go('#a/cash/2');},
  'cf-finish':()=>{const d=D.cash;const ok=['bill','income'].every(k=>X.parseField(d[k]).ok);const days=parseInt(d.days,10);const billDay=d.billDay?parseInt(d.billDay,10):null;
    if(!ok||(billDay&&billDay>days)){S.errors.cf2=true;render(true);return;}
    const data={...d};try{X.runCash(data,0);}catch{S.errors.cf2=true;render(true);return;}S.errors.cf2=false;const c=St.commit('cash',data);go('#c/'+c.id);},
  'cash-late':(e,el)=>{S.cashLate[el.dataset.id]=el.dataset.v==='1';render(true);},
  'com-p':(e,el)=>{D.community.purpose=el.value;D.community.starter=null;if(el.value!=='ask')D.community.question='';render(true);},
  'com-s':(e,el)=>{D.community.starter=el.value;render(true);},
  'com-q':(e,el)=>{D.community.question=el.value;render(true);},
  'com-copy':async()=>{const ok=await copyText(X.communityText().join('\n'));announce(x(ok?'com.copied':'com.copyFailed'));},
  'com-download':()=>{const ok=download('lift-draft.txt',X.communityText().join('\n')+'\n\n'+x('com.draft'));if(!ok)announce(x('com.copyFailed'));},
  copy:async(e,el)=>{const c=S.cards.find(c=>c.id===el.dataset.id);const ok=c&&await copyText(cardText(c));announce(x(ok?'eq.copied':'eq.copyFailed'));},
  download:(e,el)=>{const c=S.cards.find(c=>c.id===el.dataset.id);const ok=c&&download(c.kind==='everyday'?'lift-questions.txt':'lift-family-questions.txt',cardText(c));if(!ok)announce(x('eq.copyFailed'));},
  ics:(e,el)=>{const c=S.cards.find(c=>c.id===el.dataset.id);if(!c)return;const id=(c.data.id||'lift-'+c.id).replace(/[^a-zA-Z0-9-]/g,'').padEnd(8,'0');
    const ics=root.LiftDates.calendar({id,date:c.data.date,process:c.data.process,source:c.data.source,revision:0},x('dt.event'),x('dt.eventBody'));download('lift-reminder.ics',ics,'text/calendar;charset=utf-8');},
  'open-save':(e,el)=>saveSheet(el.dataset.id),
  'save-choice':(e,el)=>{ui.sheet.setChoice(el.value);render(true);},
  'save-confirm':(e,el)=>{const ch=ui.sheet.getChoice();if(!ch){const m=app.querySelector('#save-e');if(m){m.hidden=false;m.querySelector('span').innerHTML=t('save.choose');}return;}
    if(ch==='dont'){closeSheet();announce(x('save.notSaved'));return;}
    const r=St.save(el.dataset.id);if(r.ok){closeSheet();announce(x('save.done'));}else{ui.sheet.fail();render(true);}},
  'sheet-close':()=>closeSheet(),
  scrim:(e)=>{if(e.target.classList.contains('scrim'))closeSheet();},
  'ask-remove':(e,el)=>removeSheet(el.dataset.id),
  'remove-confirm':(e,el)=>{const r=St.remove(el.dataset.id);ui.sheet=null;render();announce(x(r.ok?'mine.removed':'mine.removeFailed'));},
  ext:(e,el)=>extSheet(el.dataset.url,el.dataset.name),
  'ext-open':()=>setTimeout(closeSheet,200),
  skip:(e)=>{e.preventDefault();const m=app.querySelector('main');if(m)m.focus();}
};
/* edit: restore the card's answers into the draft and return to the last answer step */
function edit(id){
  const c=S.cards.find(c=>c.id===id);if(!c){go('#home');return;}
  S.editing[c.kind]=c.id;
  if(c.kind==='everyday'){Object.assign(D.everyday,{topic:c.data.topic,selected:[...c.data.keys],unsure:false,else:false});return '#a/everyday/2';}
  if(c.kind==='family'){D.family.topics=[...c.data.topics];return '#a/family/1';}
  if(c.kind==='dates'){Object.assign(D.dates,{process:c.data.process,date:c.data.date,source:c.data.source,confirmed:false});return '#a/dates/2';}
  if(c.kind==='money'){Object.assign(D.money,c.data.values,{period:c.data.period});return '#a/money/3';}
  Object.assign(D.cash,c.data);return '#a/cash/2';
}
/* starting an activity fresh from Home clears any "editing" link so a new card is made */
function freshStart(kind){if(S.editing[kind]){S.editing[kind]=null;S.drafts[kind]=St.blankDrafts()[kind];}}

function handle(e){
  const el=e.target.closest('[data-act]');if(!el||!app.contains(el))return;
  const act=el.dataset.act; const fn=ACTIONS[act];
  if(e.type==='click'){
    if(act==='input'||el.matches('input,select'))return; // handled on change/input
    if(fn){fn(e,el);}
  }else if(e.type==='change'&&el.matches('input[type=radio],input[type=checkbox],select')){
    if(el.dataset.field&&act==='input'){D[currentDraft()][el.dataset.field]=el.value;if(el.dataset.field==='days')render(true);return;}
    if(fn)fn(e,el);
  }else if(e.type==='input'&&el.dataset.field&&act==='input'){
    D[currentDraft()][el.dataset.field]=el.value; // no re-render while typing
  }
}
function currentDraft(){const p=route().split('/');return p[0]==='a'?p[1]:'community';}
function keydown(e){
  if(e.key==='Escape'&&ui.sheet){closeSheet();return;}
  if(e.key==='Tab'&&ui.sheet){const f=[...app.querySelectorAll('.sheet a,.sheet button,.sheet input,.sheet summary')].filter(n=>!n.disabled);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
}
/* Home entry links start a fresh card; result "Edit" links keep the card */
function onLinkClick(e){const a=e.target.closest('a.task[href^="#a/"]');if(!a)return;freshStart(a.getAttribute('href').split('/')[1]);}

function boot(){
  app=document.getElementById('app');
  St.init();
  ['click','change','input'].forEach(ev=>app.addEventListener(ev,handle));
  app.addEventListener('click',onLinkClick,true);
  document.addEventListener('keydown',keydown);
  addEventListener('online',()=>render(true));addEventListener('offline',()=>render(true));
  const r=route(); if(r.startsWith('edit/')){const to=edit(r.slice(5));history.replaceState(null,'',to||'#home');}
  render();
}
root.LiftApp={boot,render,_ui:ui};
document.addEventListener('DOMContentLoaded',boot);
})(window);
