/* Lift pages — the four situations + community + mine.
   Each situation follows the approved three-beat activity pattern:
   intro (why start / what you get) → answer (one small step) → result (meaning + next action).
   Deterministic engines reused verbatim from the existing build. */
(function(root){
'use strict';
let A; // LIFT_APP (set in init)
const S=()=>root.LIFT_STORE, T=(k,p)=>root.LIFT_I18N.t(k,p);
const I=()=>root.LIFT_I18N;

/* ============ shared three-beat scaffolding ============ */
function introCard(section, back, cfg){
 return `
 ${A.pagehead(T('nav.'+section), cfg.title, '')}
 <div class="card">
  <p class="lede"><strong>${T('act.helps')}</strong> ${cfg.helps}</p>
  <dl style="margin:14px 0 0">
    <div class="kv"><dt>${T('act.receive')}</dt><dd>${cfg.receive}</dd></div>
    <div class="kv"><dt>${T('act.time')}</dt><dd>${cfg.time}</dd></div>
    <div class="kv"><dt>${T('act.goodtoknow')}</dt><dd>${cfg.limit}</dd></div>
  </dl>
 </div>
 <div class="stack" style="margin-top:16px">
  <button class="btn primary block" data-begin>${T('act.start')}</button>
  <a class="btn text block" href="#${back}">${T('act.notnow')}</a>
 </div>`;
}
function stepHeader(n,total,title,sub){
 return `
 <div class="stepdots">${Array.from({length:total},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>
 <div class="stepcount">${T('act.stepOf',{n,total})}</div>
 ${A.pagehead('', title, sub||'')}`;
}
function resultShell(cfg){
 return `
 ${A.pagehead(T('result.title'), cfg.title, '')}
 <div class="resultband"><span class="cap">${T('result.whatYouMade')}</span><div class="big">${cfg.big}</div><div class="mean">${cfg.mean}</div></div>
 ${cfg.unsure?`<p class="help" style="margin-top:12px"><span class="hic">i</span><span><strong>${T('result.unsure')}:</strong> ${cfg.unsure}</span></p>`:''}
 <div class="nextact" style="margin-top:14px"><span class="cap">${T('result.next')}</span><b>${cfg.next}</b><span>${cfg.nextSub}</span></div>
 <div class="stack" style="margin-top:16px">${cfg.actions}</div>
 ${cfg.disclaimer?`<p class="help" style="margin-top:14px"><span class="hic">i</span><span>${cfg.disclaimer}</span></p>`:''}
 ${cfg.saveNote?`<p class="help" style="margin-top:10px"><span class="hic">i</span><span>${cfg.saveNote}</span></p>`:''}`;
}

/* =========================================================
   A · EVERYDAY QUESTIONS
   ========================================================= */
const EQ_TOPICS=['housing','transport','phone','food'];
function pgEveryday(){
 const st=S().get().everyday;
 if(!st.topic && !st.selected.length){
   // beat 1 — intro
   return introCard('life','life',{title:T('eq.title'),helps:T('eq.helps'),receive:T('eq.receive'),time:T('eq.time'),limit:T('eq.limit')});
 }
 if(!st.topic){
   // step 1 — pick situation
   return stepHeader(1,2,T('eq.pickTopic'),'')+
    `<div class="stack" role="radiogroup" aria-label="${T('eq.pickTopic')}">
      ${EQ_TOPICS.map(k=>A.opt('radio','eq-topic',k,false,T('eq.'+k))).join('')}
     </div>
     <p class="help" style="margin-top:14px"><span class="hic">i</span><span>${T('eq.limit')}</span></p>`;
 }
 // step 2 — tick questions
 const keys=[1,2,3].map(n=>st.topic+n);
 const WHY={ [st.topic+'1']:T('eq.whyTotal'), [st.topic+'2']:T('eq.whyDeposit'), [st.topic+'3']:T('eq.whyContact') };
 return stepHeader(2,2,T('eq.'+st.topic),T('eq.intro'))+
  `<div class="stack">
    ${keys.map(k=>A.opt('checkbox','eq-q',k,st.selected.includes(k),T('eq.'+k),WHY[k])).join('')}
   </div>
   <div class="card" style="margin-top:16px"><h3>${T('eq.selected')} (${st.selected.length})</h3>
     ${st.selected.length?`<p style="margin-top:6px">${st.selected.map(k=>T('eq.'+k)).join(' · ')}</p>`:`<p class="muted">${T('eq.none')}</p>`}
   </div>
   <div class="stack" style="margin-top:16px">
     <button class="btn primary block" data-eq-finish ${st.selected.length?'':'disabled'}>${st.selected.length?T('result.title'):T('eq.none')}</button>
     <button class="btn secondary block" data-eq-backtopic>${T('act.keepAnswers')}</button>
   </div>`;
}
function eqResult(){
 const st=S().get().everyday;
 const c=st.selected.length;
 const rec={id:'everyday-'+st.topic, kind:'everyday', title:T('eq.title')+' — '+T('eq.'+st.topic),
   summary:T('eq.resultBig',{count:c}), nextAction:T('eq.resultNext'), selections:st.selected.slice() };
 return resultShell({
   title:T('eq.title'),
   big:T('eq.resultBig',{count:I().fmtNum(c)}),
   mean:T('eq.resultMean',{count:I().fmtNum(c)}),
   unsure:T('eq.disclaimer'),
   next:T('eq.resultNext'), nextSub:T('eq.resultNextSub'),
   actions:`
    <button class="btn primary block" data-eq-copy>${T('eq.copy')} ${A.icon('copy')}</button>
    <button class="btn secondary block" data-eq-save>${T('result.save')}</button>
    <a class="btn text block" href="#mine">${T('result.seeMine')}</a>`,
   disclaimer:T('eq.disclaimer')
 })+`<template id="eq-payload">${A.esc(eqText())}</template>`;
}
function eqText(){
 const st=S().get().everyday;
 return st.selected.map((k,i)=>`${i+1}. ${T('eq.'+k)}`).join('\n');
}
function eqFinish(){ root.LIFT_APP.__eqdone=true; renderInto('life/everyday', eqResult()); }

/* =========================================================
   B · FAMILY LEARNING
   ========================================================= */
function pgFamily(){
 const st=S().get().family;
 if(!st.topics.length){
   return introCard('family','home',{title:T('fam.title'),helps:T('fam.helps'),receive:T('fam.receive'),time:T('fam.time'),limit:T('fam.limit')})
     + resourcesCard();
 }
 const qs=st.topics.map(k=>k+'Q');
 return `
  ${A.pagehead(T('nav.family'), T('fam.title'), T('fam.intro'))}
  <div class="card"><h2>${T('fam.choose')}</h2>
    <div class="stack" style="margin-top:12px">
      ${LiftFamilyTopics.map(k=>A.opt('checkbox','fam-t',k,st.topics.includes(k),T('fam.'+k))).join('')}
    </div>
  </div>
  <div class="card"><h2>${T('eq.selected')} (${st.topics.length})</h2>
    ${qs.length?`<div class="stack" style="margin-top:10px">${qs.map(q=>`<div class="opt checkbox"><span class="box" style="border-color:var(--action)"></span><span class="ot"><b>${T('fam.'+q)}</b></span></div>`).join('')}</div>`:''}
  </div>
  <div class="stack" style="margin-top:16px">
    <button class="btn primary block" data-fam-finish>${T('result.title')}</button>
  </div>
  ${resourcesCard()}`;
}
const LiftFamilyTopics=['start','language','routine','device','cost','support'];
function resourcesCard(){
 return `<div class="card"><h2>${T('fam.resourcesTitle')}</h2>
  <p style="margin:6px 0 12px">${T('fam.resourcesNote')}</p>
  <div class="stack">
   <button class="btn secondary block" data-ext="https://www.unicef.org/thailand/reports/make-learning-count">${T('fam.unicef')} ${A.icon('ext')}</button>
   <button class="btn secondary block" data-ext="https://core.unesco.org/en/project/567THA1001">${T('fam.unesco')} ${A.icon('ext')}</button>
   <button class="btn secondary block" data-ext="https://www.learnbig.net/thai-language-lessons/">LearnBig ${A.icon('ext')}</button>
   <button class="btn secondary block" data-ext="https://translate.google.com/">Google Translate ${A.icon('ext')}</button>
  </div>
  <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('fam.noPromise')}</span></p></div>`;
}
function famResult(){
 const st=S().get().family;
 const c=st.topics.length;
 const text=st.topics.map((k,i)=>`${i+1}. ${T('fam.'+k+'Q')}`).join('\n');
 return resultShell({
   title:T('fam.title'),
   big:T('fam.resultBig',{count:I().fmtNum(c)}),
   mean:T('fam.resultMean',{count:I().fmtNum(c)}),
   unsure:T('fam.noPromise'),
   next:T('fam.resultNext'), nextSub:T('fam.resultNextSub'),
   actions:`
    <button class="btn primary block" data-fam-copy>${T('eq.copy')} ${A.icon('copy')}</button>
    <button class="btn secondary block" data-fam-save>${T('result.save')}</button>
    <a class="btn text block" href="#mine">${T('result.seeMine')}</a>`,
   disclaimer:T('fam.noPromise')
 })+`<template id="fam-payload">${A.esc(text)}</template>`;
}

/* =========================================================
   C · DATES
   ========================================================= */
function pgDates(){
 const st=S().get();
 return `
  ${A.pagehead(T('nav.life'), T('dt.title'), T('dt.intro'))}
  ${introMini('dt')}
  <form id="dt-form" class="card" novalidate>
    ${A.field('dt-process', T('dt.process'), `<select class="control" id="dt-process" name="process">${['unknown','report','stay','work','other'].map(k=>`<option value="${k}">${T('dt.'+k)}</option>`).join('')}</select>`)}
    ${A.field('dt-date', T('dt.date'), `<input class="control" id="dt-date" name="date" type="date" min="1900-01-01" max="2200-12-31" required>`)}
    ${A.field('dt-source', T('dt.source'), `<select class="control" id="dt-source" name="source">${['receipt','notice','message'].map(k=>`<option value="${k}">${T('dt.'+k)}</option>`).join('')}</select>`)}
    <label class="opt checkbox" style="margin:6px 0 12px"><input type="checkbox" id="dt-confirm" required><span class="box"></span><span class="ot"><b>${T('dt.confirm')}</b></span></label>
    <p class="error-msg" id="dt-err" role="alert" hidden></p>
    <button class="btn primary block" type="submit">${T('dt.save')}</button>
  </form>
  <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('dt.limit')} ${T('dt.review')}</span></p>
  <div id="dt-list" style="margin-top:16px">${dtList()}</div>`;
}
function introMini(prefix){ return ''; } // dates uses a single-card form, not a separate intro screen
function dtList(){
 const dates=S().get().dates;
 if(!dates.length) return `<div class="card empty" style="padding:24px"><p class="muted">${T('mine.empty.title')}</p></div>`;
 const today=new Date(); const iso=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
 return dates.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(d=>`
   <div class="card">
     <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
       <div><b style="font-size:15px">${I().fmtDate(d.date)}</b>
       <p style="margin-top:3px">${T('dt.'+d.process)} · ${T('dt.'+d.source)}</p>
       ${d.date<iso?`<p class="notice err" style="margin-top:8px">${T('dt.past')}</p>`:''}</div>
       <span class="tag info">${T('mine.unsaved')}</span>
     </div>
     <div class="stack" style="margin-top:12px">
       <button class="btn secondary block" data-dt-cal="${d.id}">${T('dt.calendar')} ${A.icon('download')}</button>
       <button class="btn text block" data-dt-del="${d.id}">${T('cm.clear')}</button>
     </div>
   </div>`).join('');
}
function dtResult(d){
 return resultShell({
   title:T('dt.title'),
   big:T('dt.resultBig'),
   mean:T('dt.resultMean',{date:I().fmtDate(d.date)}),
   unsure:T('dt.limit'),
   next:T('dt.resultNext'), nextSub:T('dt.resultNextSub'),
   actions:`<button class="btn primary block" data-dt-cal="${d.id}">${T('dt.calendar')} ${A.icon('download')}</button>
            <a class="btn secondary block" href="#life/dates">${T('result.done')}</a>`,
   disclaimer:T('dt.review')
 });
}

/* =========================================================
   D · MONEY (spending → cash-flow)
   ========================================================= */
function pgMoney(){
 const st=S().get().money;
 if(st.result){ return moneyResult(); }
 const fields=[['available',T('mn.available')],['food',T('mn.food')],['home',T('mn.home')],['travel',T('mn.travel')],['phone',T('mn.phone')],['other',T('mn.other')]];
 return `
  ${A.pagehead(T('nav.life'), T('mn.title'), T('mn.intro'))}
  <div class="card">
    <p class="lede"><strong>${T('act.helps')}</strong> ${T('mn.helps')}</p>
    <dl style="margin:12px 0 0">
      <div class="kv"><dt>${T('act.receive')}</dt><dd>${T('mn.receive')}</dd></div>
      <div class="kv"><dt>${T('act.time')}</dt><dd>${T('mn.time')}</dd></div>
      <div class="kv"><dt>${T('act.goodtoknow')}</dt><dd>${T('mn.limit')}</dd></div>
    </dl>
  </div>
  <form id="mn-form" class="card" novalidate>
    ${A.field('m-period', T('mn.period'), `<select class="control" id="m-period" name="period">${['today','week','month'].map(k=>`<option value="${k}" ${st.period===k?'selected':''}>${T('mn.'+k)}</option>`).join('')}</select>`)}
    <p class="help" style="margin-bottom:14px"><span class="hic">i</span><span>${T('mn.currency')}</span></p>
    ${fields.map(([k,label],i)=>A.field('m-'+k,label,A.moneyInput('m-'+k, st.values[k]||''), i===0?T('mn.empty'):null)).join('')}
    <p class="error-msg" id="mn-err" role="alert" hidden></p>
    <div class="stack">
      <button class="btn primary block" type="submit">${T('mn.calculate')}</button>
      <button class="btn secondary block" type="button" data-mn-clear>${T('mn.clear')}</button>
    </div>
  </form>`;
}
function moneyResult(){
 const st=S().get().money; const r=st.result;
 const short=r.remaining<0;
 const amt=I().fmtMoney(Math.abs(r.remaining));
 const big= short? T('mn.resultBigShort',{amount:amt}) : T('mn.resultBig',{amount:amt});
 const mean= short? T('mn.resultMeanShort',{amount:amt, period:T('mn.'+st.period)}) : T('mn.resultMean',{amount:amt, period:T('mn.'+st.period)});
 return resultShell({
   title:T('mn.title'),
   big, mean,
   unsure:T('mn.resultCalculated'),
   next:T('mn.resultNext'), nextSub:T('mn.resultNextSub'),
   actions:`
     <button class="btn primary block" data-mn-cashflow>${T('cf.title')} ${A.icon('arrow')}</button>
     <button class="btn secondary block" data-mn-edit>${T('act.back')}</button>`,
   disclaimer:T('mn.limit'),
   saveNote:T('mine.unsaved')
 })+`
   <div class="card" style="margin-top:16px"><h2>${T('result.whatYouMade')}</h2>
     <dl style="margin-top:8px">
       <div class="kv"><dt>${T('mn.available')}</dt><dd>${I().fmtMoney(r.available)}</dd></div>
       <div class="kv"><dt>${T('mn.costs')}</dt><dd>${I().fmtMoney(r.costs)}</dd></div>
       <div class="kv"><dt>${short?T('mn.shortfall'):T('mn.remaining')}</dt><dd>${amt}</dd></div>
     </dl>
     ${r.remaining===0?`<p class="notice info" style="margin-top:10px">${T('mn.zero')}</p>`:''}
   </div>
   <div id="cf-area">${cashflowPanel()}</div>`;
}
function cashflowPanel(){
 const cf=S().get().cashflow;
 const r=cf.result;
 return `
  <div class="card" style="margin-top:16px"><h2>${T('cf.title')}</h2>
   <form id="cf-form" novalidate style="margin-top:10px">
     ${A.field('cf-days', T('cf.days'), `<select class="control" id="cf-days" name="days">${[7,14,30].map(d=>`<option value="${d}" ${String(d)===cf.values.days?'selected':''}>${I().fmtNum(d)}</option>`).join('')}</select>`)}
     ${A.field('cf-cash', T('cf.cash'), `<input class="control" id="cf-cash" name="cash" type="text" inputmode="decimal" value="${cf.values.cash||''}">`)}
     ${A.field('cf-daily', T('cf.daily'), `<input class="control" id="cf-daily" name="daily" type="text" inputmode="decimal" value="${cf.values.daily||''}">`)}
     ${A.field('cf-bill', T('cf.bill'), `<input class="control" id="cf-bill" name="bill" type="text" inputmode="decimal" value="${cf.values.bill||''}">`)}
     ${A.field('cf-billDay', T('cf.billDay'), `<select class="control" id="cf-billDay" name="billDay"><option value="">${T('act.skip')}</option>${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${String(i+1)===cf.values.billDay?'selected':''}>${I().fmtNum(i+1)}</option>`).join('')}</select>`)}
     ${A.field('cf-income', T('cf.income'), `<input class="control" id="cf-income" name="income" type="text" inputmode="decimal" value="${cf.values.income||''}">`)}
     ${A.field('cf-incomeDay', T('cf.incomeDay'), `<select class="control" id="cf-incomeDay" name="incomeDay"><option value="">${T('act.skip')}</option>${Array.from({length:31},(_,i)=>`<option value="${i+1}" ${String(i+1)===cf.values.incomeDay?'selected':''}>${I().fmtNum(i+1)}</option>`).join('')}</select>`, T('cf.expected'))}
     <p class="error-msg" id="cf-err" role="alert" hidden></p>
     <button class="btn primary block" type="submit">${T('cf.calculate')}</button>
   </form>
   <div id="cf-out" style="margin-top:14px">${cf.result?cfResult(cf.result):''}</div>
   <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('cf.limits')} ${T('cf.lesson')}</span></p>
  </div>`;
}
function cfResult(r){
 const sum=(res,title)=>`
   <div class="card" style="margin-top:10px"><h3>${title}</h3>
     <dl style="margin-top:6px">
       <div class="kv"><dt>${T('cf.first')}</dt><dd>${res.firstGap? T('cf.day')+' '+I().fmtNum(res.firstGap) : T('cf.none')}</dd></div>
       <div class="kv"><dt>${T('cf.gap')}</dt><dd>${I().fmtMoney(res.gap)}</dd></div>
       <div class="kv"><dt>${T('cf.closing')}</dt><dd>${I().fmtMoney(res.closing)}</dd></div>
     </dl></div>`;
 return `
  ${sum(r.base, T('mn.title'))}
  ${r.late? sum(r.late, T('cf.scenarioLate')):''}
  <details class="card" style="margin-top:10px"><summary style="cursor:pointer;font-weight:600">${T('cf.timeline')}</summary>
    <div style="margin-top:10px">${r.base.timeline.map(row=>`
      <div class="kv"><dt>${T('cf.day')} ${I().fmtNum(row.day)}</dt><dd>${T('cf.out')} ${I().fmtMoney(row.out)} · ${T('cf.incoming')} ${I().fmtMoney(row.incoming)} · ${T('cf.balance')} ${I().fmtMoney(row.balance)}</dd></div>`).join('')}
    </div></details>`;
}

/* =========================================================
   COMMUNITY (closed)
   ========================================================= */
function pgCommunity(){
 const d=S().get().community;
 return `
  ${A.pagehead(T('nav.community'), T('cm.title'), T('cm.intro'))}
  <div class="notice info">${A.icon('shield')}<span>${T('cm.closed')}</span></div>
  <div class="card" style="margin-top:16px">
    <h2>${T('cm.statusTitle')}</h2>
    <div style="margin-top:12px">${A.stepsList([
      {n:1, title:T('cm.step.draft'), sub:T('cm.step.draft.done'), state:'done'},
      {n:2, title:T('cm.step.sent'), sub:T('cm.step.sent.pending'), state:''},
      {n:3, title:T('cm.step.answered'), sub:T('cm.step.answered.pending'), state:''}
    ])}</div>
    <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('cm.closedNote')}</span></p>
  </div>
  <form id="cm-form" class="card" style="margin-top:16px" novalidate>
    ${A.field('cm-kind', T('cm.kind'), `<select class="control" id="cm-kind" name="kind">${['question','experience'].map(k=>`<option value="${k}" ${d.kind===k?'selected':''}>${T('cm.'+k)}</option>`).join('')}</select>`)}
    ${A.field('cm-topic', T('cm.topic'), `<select class="control" id="cm-topic" name="topic">${['daily','family','work','documents','health'].map(k=>`<option value="${k}" ${d.topic===k?'selected':''}>${T('cm.'+k)}</option>`).join('')}</select>`)}
    ${A.field('cm-text', T('cm.prompt'), `<textarea class="control" id="cm-text" name="text" maxlength="1200" placeholder="${A.esc(T('cm.placeholder'))}">${A.esc(d.text)}</textarea>`, T('cm.safety'))}
    <p class="error-msg" id="cm-err" role="alert" hidden></p>
    <button class="btn primary block" type="submit">${T('cm.preview')}</button>
  </form>
  <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('cm.privacy')}</span></p>`;
}
function cmPreview(){
 const d=S().get().community;
 const text=`${T('cm.previewTitle')}\n\n${T('cm.'+d.kind)} · ${T('cm.'+d.topic)}\n\n${d.text.trim()}\n\n${T('cm.draftNote')}`;
 return `
  ${A.pagehead(T('nav.community'), T('cm.previewTitle'), '')}
  <div class="notice">${A.icon('info')}<span>${T('cm.draftNote')}</span></div>
  <div class="card" style="margin-top:16px"><pre style="white-space:pre-wrap;font:inherit;font-size:13.5px;line-height:1.7">${A.esc(d.text.trim())}</pre></div>
  <div class="stack" style="margin-top:16px">
    <button class="btn primary block" data-cm-copy>${T('cm.copy')} ${A.icon('copy')}</button>
    <button class="btn secondary block" data-cm-download>${T('cm.download')} ${A.icon('download')}</button>
    <button class="btn secondary block" data-cm-edit>${T('cm.edit')}</button>
    <button class="btn text block" data-cm-clear>${T('cm.clear')}</button>
  </div>
  <template id="cm-payload">${A.esc(text)}</template>`;
}

/* =========================================================
   MINE — the record
   ========================================================= */
function pgMine(){
 const st=S().get();
 const session=[];
 if(st.everyday.selected.length) session.push({kind:'everyday', title:T('eq.title'), said:st.everyday.selected.map(k=>T('eq.'+k)).join('; '), got:T('eq.resultBig',{count:I().fmtNum(st.everyday.selected.length)}), next:T('eq.resultNext')});
 if(st.family.topics.length) session.push({kind:'family', title:T('fam.title'), said:st.family.topics.map(k=>T('fam.'+k)).join('; '), got:T('fam.resultBig',{count:I().fmtNum(st.family.topics.length)}), next:T('fam.resultNext')});
 // date reminders (saved when saving is on; session otherwise) — money is deliberately never here (Opus Q6)
 const dateRecs=(st.dates||[]).map(d=>({kind:'dates', title:T('dt.title'), said:T('dt.'+d.process), got:I().fmtDate(d.date), next:T('dt.resultNext'), updatedAt:null, _date:d}));
 const saved=st.saved;
 const hasAny=session.length||saved.length||dateRecs.length;
 const saveTag = st.saveOn? `<span class="tag done">${T('mine.saved')}</span>` : `<span class="tag neutral">${T('mine.unsaved')}</span>`;
 return `
  ${A.pagehead(T('nav.mine'), T('mine.title'), T('mine.intro'))}
  ${!hasAny? `
    <div class="card empty wm-host">
      <svg class="door" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M13 22V5a2 2 0 0 1 2-2h4v19h-6"/><path d="M13 22H4V3h9v19"/><circle cx="15.5" cy="12" r="1"/></svg>
      <h2>${T('mine.empty.title')}</h2><p>${T('mine.empty.body')}</p>
      <a class="btn primary" href="#life/everyday">${T('mine.empty.cta')}</a>
    </div>
    <p class="help" style="margin-top:14px"><span class="hic">i</span><span>${st.saveOn?T('mine.saved'):T('mine.sessionNote')}</span></p>
  `
  :`
    ${(session.length||dateRecs.length)? `<div class="card"><h2>${T('mine.nextUp')}</h2><div class="stack" style="margin-top:12px">${session.map(r=>recordCard(r,false)).join('')}${dateRecs.map(r=>recordCard(r,st.saveOn)).join('')}</div></div>`:''}
    ${saved.length? `<div class="card"><h2>${T('mine.saved')}</h2><div class="stack" style="margin-top:12px">${saved.map(r=>recordCard(r,true)).join('')}</div></div>`:''}
  `}
  <div class="card" style="margin-top:16px">
    <h2>${T('sv.title')}</h2>
    <p style="margin:6px 0 12px">${T('sv.body')}</p>
    <div class="stack" role="radiogroup">
      ${A.opt('radio','sv-choice','save',st.saveOn, T('sv.save'), T('sv.saveSub'))}
      ${A.opt('radio','sv-choice','nosave',!st.saveOn, T('sv.nosave'), T('sv.nosaveSub'))}
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="btn primary block" data-sv-confirm>${T('sv.confirm')}</button>
      ${saved.length? `<button class="btn danger block" data-sv-clear>${T('cm.clear')}</button>`:''}
    </div>
    <p class="help" style="margin-top:12px"><span class="hic">i</span><span>${T('sv.sharedWarn')} ${T('sv.separate')}</span></p>
  </div>`;
}
function recordCard(r,saved){
 return `
  <div class="card" style="box-shadow:none">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
      <b style="font-size:14px">${A.esc(r.title)}</b>
      <span class="tag ${saved?'done':'neutral'}">${saved?T('mine.saved'):T('mine.unsaved')}</span>
    </div>
    <dl style="margin-top:10px">
      <div class="kv"><dt>${T('mine.youSaid')}</dt><dd style="text-align:right;max-width:60%">${A.esc(r.said||r.summary||'')}</dd></div>
      <div class="kv"><dt>${T('mine.youGot')}</dt><dd>${A.esc(r.got||r.summary||'')}</dd></div>
      <div class="kv"><dt>${T('mine.doNext')}</dt><dd>${A.esc(r.next||r.nextAction||'')}</dd></div>
    </dl>
    ${r.updatedAt? `<p class="help" style="margin-top:8px"><span class="hic">i</span><span>${T('mine.from',{date:I().fmtDate(String(r.updatedAt).slice(0,10))})}</span></p>`:''}
    ${saved? `<button class="btn text" data-sv-del="${A.esc(r.id)}" style="margin-top:6px">${T('cm.clear')}</button>`:''}
  </div>`;
}

/* =========================================================
   WIRING
   ========================================================= */
function err(id,msg){ const e=document.getElementById(id); if(e){ e.textContent=msg; e.hidden=!msg; } }
function copyText(text,ok,fail){
 if(!navigator.clipboard||!navigator.clipboard.writeText){ A.toast(T(fail)); return; }
 navigator.clipboard.writeText(text).then(()=>A.toast(T(ok)),()=>A.toast(T(fail)));
}
function downloadText(text,name){
 try{ const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})); const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); }catch{}
}
function renderInto(route,html){ const m=document.getElementById('main'); if(m){ m.innerHTML=html; } }

function wire(route,main){
 const q=(s)=>main.querySelector(s);
 const qa=(s)=>[...main.querySelectorAll(s)];
 const money=root.LiftSpending, cash=root.LiftCashflow, dates=root.LiftDates;

 /* external links */
 qa('[data-ext]').forEach(b=>b.onclick=()=>A.externalSheet(b.dataset.ext));

 /* EVERYDAY */
 const beginBtn=q('[data-begin]');
 if(beginBtn) beginBtn.onclick=()=>{ S().update(s=>{s.everyday._started=true;}); renderInto('life/everyday', stepPick()); };
 function stepPick(){
   return stepHeader(1,2,T('eq.pickTopic'),'')+
    `<div class="stack" role="radiogroup" aria-label="${T('eq.pickTopic')}">
      ${EQ_TOPICS.map(k=>A.opt('radio','eq-topic',k,false,T('eq.'+k))).join('')}
     </div>
     <p class="help" style="margin-top:14px"><span class="hic">i</span><span>${T('eq.limit')}</span></p>`;
 }
 qa('input[name="eq-topic"]').forEach(r=>r.onchange=()=>{ S().update(s=>{s.everyday.topic=r.value;}); A.rerender(); });
 qa('input[name="eq-q"]').forEach(c=>c.onchange=()=>{
   S().update(s=>{ const v=c.value; s.everyday.selected = c.checked? [...new Set([...s.everyday.selected,v])] : s.everyday.selected.filter(x=>x!==v); });
   A.rerender();
 });
 const eqBack=q('[data-eq-backtopic]'); if(eqBack) eqBack.onclick=()=>{ A.rerender(); };
 const eqFin=q('[data-eq-finish]'); if(eqFin) eqFin.onclick=()=>{ renderInto('life/everyday', eqResult()); };
 const eqCopy=q('[data-eq-copy]'); if(eqCopy) eqCopy.onclick=()=>copyText(document.getElementById('eq-payload').innerHTML,'eq.copied','eq.copyFailed');
 const eqSave=q('[data-eq-save]'); if(eqSave) eqSave.onclick=()=>{
   const st=S().get(); const res=S().saveRecord({id:'everyday-'+st.everyday.topic,kind:'everyday',title:T('eq.title')+' — '+T('eq.'+st.everyday.topic),summary:T('eq.resultBig',{count:st.everyday.selected.length}),nextAction:T('eq.resultNext'),selections:st.everyday.selected});
   A.toast(T(res.ok?'sv.savedOk':'sv.saveFailed'));
 };

 /* FAMILY */
 qa('input[name="fam-t"]').forEach(c=>c.onchange=()=>{
   S().update(s=>{ const v=c.value; s.family.topics = c.checked? [...new Set([...s.family.topics,v])] : s.family.topics.filter(x=>x!==v); });
   A.rerender();
 });
 const famFin=q('[data-fam-finish]'); if(famFin) famFin.onclick=()=>{ renderInto('family', famResult()); };
 const famCopy=q('[data-fam-copy]'); if(famCopy) famCopy.onclick=()=>copyText(document.getElementById('fam-payload').innerHTML,'eq.copied','eq.copyFailed');
 const famSave=q('[data-fam-save]'); if(famSave) famSave.onclick=()=>{
   const st=S().get(); const res=S().saveRecord({id:'family-'+st.family.topics.join('-'),kind:'family',title:T('fam.title'),summary:T('fam.resultBig',{count:st.family.topics.length}),nextAction:T('fam.resultNext'),selections:st.family.topics});
   A.toast(T(res.ok?'sv.savedOk':'sv.saveFailed'));
 };

 /* DATES */
 const dtForm=q('#dt-form');
 if(dtForm) dtForm.onsubmit=(e)=>{
   e.preventDefault();
   const fd=new FormData(dtForm);
   const rec={id:(crypto.randomUUID?crypto.randomUUID():'d'+Date.now()),date:fd.get('date'),process:fd.get('process'),source:fd.get('source'),confirmed:q('#dt-confirm').checked};
   try{
     S().update(s=>{ s.dates=dates.keep(s.dates,rec); });
     // dates persist when saving is on (reminder tool requires it — Opus Q6)
     if(S().get().saveOn) S().writeSaved();
     S().emit();
     renderInto('life/dates', dtResult(S().get().dates.find(x=>x.id===rec.id)||rec));
   }catch(ex){ err('dt-err', T(ex.message==='full'?'dt.full':'dt.error')); }
 };
 qa('[data-dt-cal]').forEach(b=>b.onclick=()=>{
   const d=S().get().dates.find(x=>x.id===b.dataset.dtCal); if(!d) return;
   try{ const ics=dates.calendar(d, T('dt.title'), T('dt.resultMean',{date:d.date})); downloadText(ics,'lift-reminder.ics'); }catch{}
 });
 qa('[data-dt-del]').forEach(b=>b.onclick=()=>{ S().update(s=>{ s.dates=s.dates.filter(x=>x.id!==b.dataset.dtDel); }); if(S().get().saveOn) S().writeSaved(); A.rerender(); });

 /* MONEY */
 qa('#mn-form input, #mn-form select').forEach(el=>el.oninput=()=>{ S().update(s=>{ if(el.name==='period') s.money.period=el.value; else s.money.values[el.name]=el.value; s.money.error=null; }); });
 const mnForm=q('#mn-form');
 if(mnForm) mnForm.onsubmit=(e)=>{
   e.preventDefault();
   const st=S().get().money;
   try{
     const res=money.calculate(st.values);
     S().update(s=>{ s.money.result=res; s.money.error=null; });
     A.rerender();
   }catch(ex){ err('mn-err', T(ex.message==='empty'?'mn.empty':'mn.error')); }
 };
 const mnClear=q('[data-mn-clear]'); if(mnClear) mnClear.onclick=()=>{ S().update(s=>{ s.money={period:'today',values:{},result:null,error:null}; }); A.rerender(); };
 const mnEdit=q('[data-mn-edit]'); if(mnEdit) mnEdit.onclick=()=>{ S().update(s=>{ s.money.result=null; }); A.rerender(); };
 const mnCf=q('[data-mn-cashflow]'); if(mnCf) mnCf.onclick=()=>{ const p=q('#cf-area'); if(p) p.scrollIntoView({behavior:'smooth',block:'start'}); };

 /* CASHFLOW */
 qa('#cf-form input, #cf-form select').forEach(el=>el.oninput=()=>{ S().update(s=>{ s.cashflow.values[el.name]=el.value; s.cashflow.error=false; }); });
 const cfForm=q('#cf-form');
 if(cfForm) cfForm.onsubmit=(e)=>{
   e.preventDefault();
   const v=S().get().cashflow.values;
   const parse=(x)=>{ const p=money.parse(String(x||'')); return p; };
   try{
     const c=parse(v.cash), daily=parse(v.daily);
     if(c===null||daily===null) throw Error('required');
     const days=Number(v.days);
     const bill=parse(v.bill)||0, income=parse(v.income)||0;
     const billDay=v.billDay?Number(v.billDay):null, incomeDay=v.incomeDay?Number(v.incomeDay):null;
     if((bill>0&&(!billDay||billDay>days))||(income>0&&!incomeDay)) throw Error('date');
     const base=cash.project({cash:c,daily,days,bills:bill?[{day:billDay,amount:bill}]:[],income,incomeDay});
     const late=income>0? cash.project({cash:c,daily,days,bills:bill?[{day:billDay,amount:bill}]:[],income,incomeDay,delay:3}) : null;
     S().update(s=>{ s.cashflow.result={base,late}; s.cashflow.error=false; });
     A.rerender();
     setTimeout(()=>{ const out=q('#cf-out'); if(out) out.scrollIntoView({behavior:'smooth',block:'start'}); },50);
   }catch(ex){ err('cf-err', T('cf.error')); }
 };

 /* COMMUNITY */
 const cmForm=q('#cm-form');
 if(cmForm){
   cmForm.onsubmit=(e)=>{
     e.preventDefault();
     const d={kind:q('#cm-kind').value, topic:q('#cm-topic').value, text:q('#cm-text').value};
     if(!d.text.trim()){ err('cm-err', T('cm.empty')); return; }
     if(d.text.length>1200){ err('cm-err', T('cm.tooLong')); return; }
     S().update(s=>{ s.community=d; });
     renderInto('community', cmPreview());
   };
 }
 const cmCopy=q('[data-cm-copy]'); if(cmCopy) cmCopy.onclick=()=>copyText(document.getElementById('cm-payload').innerHTML,'cm.copied','cm.copyFailed');
 const cmDl=q('[data-cm-download]'); if(cmDl) cmDl.onclick=()=>downloadText(document.getElementById('cm-payload').innerHTML,'lift-community-draft.txt');
 const cmEdit=q('[data-cm-edit]'); if(cmEdit) cmEdit.onclick=()=>A.rerender();
 const cmClear=q('[data-cm-clear]'); if(cmClear) cmClear.onclick=()=>{ S().update(s=>{ s.community={kind:'question',topic:'daily',text:''}; }); A.rerender(); };

 /* MINE / SAVE */
 const svConfirm=q('[data-sv-confirm]');
 if(svConfirm) svConfirm.onclick=()=>{
   const choice=(q('input[name="sv-choice"]:checked')||{}).value;
   const res=S().setSaveOn(choice==='save');
   A.toast(T(res.ok? (choice==='save'?'sv.savedOk':'sv.nosave') : (choice==='save'?'sv.saveFailed':'sv.deleteFailed')));
   A.rerender();
 };
 const svClear=q('[data-sv-clear]'); if(svClear) svClear.onclick=()=>{ const res=S().clearAllSaved(); A.toast(T(res.ok?'sv.deleted':'sv.deleteFailed')); A.rerender(); };
 qa('[data-sv-del]').forEach(b=>b.onclick=()=>{ const res=S().deleteRecord(b.dataset.svDel); A.toast(T(res.ok?'sv.deleted':'sv.deleteFailed')); A.rerender(); });
}

/* page module registry used by app.js */
root.LIFT_PG={
 everyday:()=> root.LIFT_APP.__eqdone? (root.LIFT_APP.__eqdone=false, eqResult()) : pgEveryday(),
 family:pgFamily, dates:pgDates, money:pgMoney, community:pgCommunity, mine:pgMine
};
root.LIFT_WIRE=wire;

function init(app){ A=app; }
root.LIFT_PAGES_INIT=init;
})(typeof window!=='undefined'?window:globalThis);
