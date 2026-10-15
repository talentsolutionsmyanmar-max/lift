/* Lift Doorstep — screens. Each route returns {html, nav, dock, progress, showing}.
   Activity pattern: intro (why / what you get / limit / one start) → steps → result card
   (your answers · the output · what it means · what is unclear · one next step · edit / save). */
(function(root){'use strict';
const U=root.LiftUI, I=root.LiftI18n, St=root.LiftStore, S=St.S;
const {t,x,ic,esc}=U;
const EQ=St.EQ_TOPICS, FAM=St.FAM_TOPICS;
const madeOn=c=>{const d=new Date(c.createdAt||Date.now());return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};

/* ------------------------------------------------------------ HOME */
function home(){
  const resume=S.cards.length?'':'';
  const task=(href,i,title,get)=>`<a class="task" href="${href}"><span class="tile">${ic(i)}</span><span class="tt"><b>${t(title)}</b><span>${t(get)}</span></span><span class="chev">${ic('chev','sm')}</span></a>`;
  return {nav:'home',html:`<main id="main" class="page" tabindex="-1">
   ${U.ph(t('home.title'),t('home.intro'))}
   <section class="start" aria-labelledby="start-t">
    <span class="eyebrow">${t('home.start.eyebrow')}</span>
    <h2 id="start-t">${t('home.start.title')}</h2>
    <p class="lede">${t('home.start.sub')}</p>
    ${U.ghost(3,'eq.receive')}
    <a class="btn primary" href="#a/everyday/intro" data-act="start-housing">${t('home.start.cta')} ${ic('arrow','sm')}</a>
   </section>
   <h2 class="sec-t">${t('home.more')}</h2>
   <div class="stack">
    ${task('#a/everyday/intro','sunrise','home.daily.title','home.daily.get')}
    ${task('#a/money/intro','wallet','home.money.title','home.money.get')}
    ${task('#a/family/intro','sprout','home.family.title','home.family.get')}
    ${task('#a/dates/intro','calendar','home.dates.title','home.dates.get')}
   </div>
   ${U.note('info','shield',t('app.tagline'),'style="margin-top:20px"')}
  </main>`};
}

/* ------------------------------------------------------------ shared activity pieces */
function intro(a){
  return {nav:null,progress:0,html:`<main id="main" class="page" tabindex="-1">
   ${U.crumb('#home','nav.home')}
   ${U.ph(a.title,'',a.eyebrow||'')}
   ${U.facts(a.facts)}
   ${U.previewCard(a.lines)}
   ${a.extra||''}
   ${U.note('info','info',t(a.limit))}
  </main>`,dock:`<a class="btn primary" href="${a.first}">${t('act.start')}</a><a class="btn text" href="#home">${t('act.notnow')}</a>`};
}
function step({back,n,total,title,hint,whyKey,body,err,dockExtra,nextLabel='act.next',nextAct}){
  return {nav:null,progress:Math.round((n-1)/total*100+50/total),html:`<main id="main" class="page" tabindex="-1" style="padding-bottom:12px">
   ${U.crumb(back,'act.back')}
   ${U.stepmeta(n,total)}
   <fieldset class="qg"><legend><h1 tabindex="-1">${title}</h1></legend>
   ${hint?`<p class="help" style="margin-top:6px">${hint}</p>`:''}
   ${whyKey?U.why(whyKey):'<div style="height:16px"></div>'}
   ${body}</fieldset>
   ${err||''}
  </main>`,dock:`${dockExtra||''}<button class="btn primary" type="button" data-act="${nextAct}">${t(nextLabel)} ${ic('arrow','sm')}</button>`};
}
function resultShell(card,{eyebrowKey='result.status',title,cardHtml,meaning,uncertain,uncertainSmall=true,nextHtml,actions,extra}){
  return {nav:'home',progress:100,html:`<main id="main" class="page" tabindex="-1">
   ${U.ph(title,'',t(eyebrowKey))}
   ${cardHtml}
   ${U.mean('info','result.meaning',meaning)}
   ${U.mean('help','result.uncertain',uncertain,uncertainSmall)}
   ${nextHtml}
   <div class="res-actions">${actions}</div>
   ${extra||''}
   <p class="sr-only" role="status" id="res-status"></p>
  </main>`};
}
function saveControls(card){
  const st=St.status(card);
  if(st==='never') return '';
  if(st==='saved') return '';
  return `<button class="btn secondary" type="button" data-act="open-save" data-id="${card.id}">${ic('phone','sm')} ${t(st==='changed'?'result.save':'result.save')}</button>`;
}

/* ------------------------------------------------------------ EVERYDAY QUESTIONS */
const eqTitleKey=topic=>topic?'eq.introTitle.'+topic:'eq.title';
const everyday={
  intro(){const d=S.drafts.everyday;return intro({title:t(eqTitleKey(d.topic)),eyebrow:d.topic?t('eq.'+d.topic):'',lines:3,first:'#a/everyday/1',limit:'eq.limit',
    facts:[['why','act.why','eq.helps'],['get','act.get','eq.receive'],['clock','act.time','eq.time']]});},
  1(){const d=S.drafts.everyday;
    const body=`<div class="stack" role="radiogroup">${EQ.map(k=>U.opt({type:'radio',name:'eq-topic',value:k,checked:d.topic===k&&!d.else,label:t('eq.'+k),act:'eq-topic'})).join('')}
      ${U.opt({type:'radio',name:'eq-topic',value:'else',checked:d.else,label:t('eq.somethingElse'),act:'eq-topic',soft:true})}</div>
      ${d.else?U.note('info','info',`${t('eq.elseNote')} <a href="#community">${t('eq.elseGo')}</a>`,'style="margin-top:12px"'):''}`;
    return step({back:'#a/everyday/intro',n:1,total:2,title:t('eq.pickTopic'),whyKey:null,hint:t('eq.pickWhy'),body,nextAct:'eq-next1',err:U.errorMsg('e-step',S.errors.eq1,'eq.pickTopic')});},
  2(){const d=S.drafts.everyday; if(!d.topic) return null;
    const keys=[1,2,3].map(n=>d.topic+n);
    const body=`<div class="stack">${keys.map((k,i)=>U.opt({name:'eq-q',value:k,checked:d.selected.includes(k),label:t('eq.'+k),why:t('eq.why'+(i+1)),act:'eq-q'})).join('')}
       ${U.opt({name:'eq-unsure',value:'all',checked:d.unsure,label:t('eq.unsure'),why:t('eq.unsureSub'),act:'eq-unsure',soft:true})}</div>`;
    const last=d.selected.length?d.selected[d.selected.length-1]:null;
    const tray=`<div class="tray ${S.trayAnim?'writing':''}" aria-live="polite"><span class="tn num">${I.num(d.selected.length)}</span><span class="tt"><b>${t('eq.selected')}</b><span>${last?t('eq.'+last):t('eq.trayEmpty')}</span></span></div>`;
    return step({back:'#a/everyday/1',n:2,total:2,title:t('eq.q'),hint:t('eq.hint'),whyKey:'eq.whyBody',body,nextAct:'eq-finish',nextLabel:'act.seeResult',dockExtra:tray,
      err:U.errorMsg('e-step',S.errors.eq2,'eq.none')});},
  result(card){
    const {topic,keys}=card.data;
    const cardHtml=`<article class="qcard ${St.status(card)==='saved'?'':'unkept'}" aria-labelledby="ct-${card.id}">
      <div class="qh"><h2 id="ct-${card.id}">${t('eq.title')}</h2></div>
      <ol>${keys.map(k=>`<li>${t('eq.'+k)}</li>`).join('')}</ol>
      <div class="meta">${U.stateLabel(St.status(card))}<span class="help micro">${t('result.made',{date:madeOn(card)})}</span></div></article>`;
    return resultShell(card,{title:t(eqTitleKey(topic)),cardHtml,
      meaning:keys.length===1?t('eq.meaning1'):t('eq.meaning',{count:I.num(keys.length)}),uncertain:t('eq.uncertain'),
      nextHtml:U.next('eq.nextTitle','eq.nextSub',`<a class="btn primary" href="#show/${card.id}">${ic('show','sm')} ${t('result.show')}</a>`),
      actions:`<div class="row2"><button class="btn secondary" type="button" data-act="copy" data-id="${card.id}">${ic('copy','sm')} ${t('eq.copy')}</button><button class="btn secondary" type="button" data-act="download" data-id="${card.id}">${ic('get','sm')} ${t('eq.download')}</button></div>
        ${saveControls(card)}<a class="btn text" href="#edit/${card.id}">${t('act.edit')}</a>`});
  },
  text(card){return [x('eq.title'),'',...card.data.keys.map((k,i)=>`${i+1}. ${x('eq.'+k)}`),'',x('eq.uncertain')].join('\n');}
};

/* ------------------------------------------------------------ FAMILY LEARNING */
const RES={
  unicef:{url:'https://www.unicef.org/thailand/reports/make-learning-count',t:'fam.unicef',s:'fam.sources'},
  unesco:{url:'https://core.unesco.org/en/project/567THA1001',t:'fam.unesco',s:'fam.sources'},
  learnbig:{url:'https://www.learnbig.net/thai-language-lessons/',t:'fam.learnbig',s:'fam.learnbigText'},
  translate:{url:'https://translate.google.com/',t:'fam.translate',s:'fam.translateText'}
};
function famResources(topics){
  const r=[];
  if(topics.includes('language')||topics.includes('device')) r.push('learnbig','translate');
  if(topics.includes('start')||topics.includes('cost')||topics.includes('support')||!r.length) r.push('unicef','unesco');
  return [...new Set(r)];
}
const family={
  intro(){return intro({title:t('fam.title'),lines:3,first:'#a/family/1',limit:'fam.uncertain',
    facts:[['why','act.why','fam.helps'],['get','act.get','fam.receive'],['clock','act.time','fam.time']],
    extra:U.note('info','shield',t('fam.intro'),'style="margin-bottom:12px"')});},
  1(){const d=S.drafts.family;
    const body=`<div class="stack">${FAM.map(k=>U.opt({name:'fam-t',value:k,checked:d.topics.includes(k),label:t('fam.'+k),why:t('fam.'+k+'Q'),act:'fam-t'})).join('')}</div>
      ${U.note('info','info',t('fam.adult'),'style="margin-top:16px"')}`;
    return step({back:'#a/family/intro',n:1,total:1,title:t('fam.choose'),whyKey:'fam.chooseWhy',body,nextAct:'fam-finish',nextLabel:'act.seeResult',
      err:U.errorMsg('e-step',S.errors.fam1,'fam.none')});},
  result(card){
    const topics=card.data.topics;
    const cardHtml=`<article class="qcard ${St.status(card)==='saved'?'':'unkept'}" aria-labelledby="ct-${card.id}">
      <div class="qh"><h2 id="ct-${card.id}">${t('fam.cardTitle')}</h2></div>
      <ol>${topics.map(k=>`<li>${t('fam.'+k+'Q')}</li>`).join('')}</ol>
      <div class="meta">${U.stateLabel(St.status(card))}<span class="help micro">${t('result.made',{date:madeOn(card)})}</span></div></article>`;
    const res=famResources(topics);
    return resultShell(card,{title:t('fam.title'),cardHtml,meaning:t('fam.meaning'),uncertain:t('fam.uncertain'),
      nextHtml:U.next('fam.nextTitle','fam.nextSub',`<a class="btn primary" href="#show/${card.id}">${ic('show','sm')} ${t('result.show')}</a>`),
      actions:`<div class="row2"><button class="btn secondary" type="button" data-act="copy" data-id="${card.id}">${ic('copy','sm')} ${t('eq.copy')}</button><button class="btn secondary" type="button" data-act="download" data-id="${card.id}">${ic('get','sm')} ${t('fam.download')}</button></div>
        <p class="help">${t('fam.downloadNote')}</p>${saveControls(card)}<a class="btn text" href="#edit/${card.id}">${t('act.edit')}</a>`,
      extra:`<h2 class="sec-t">${t('fam.resources')}</h2><div class="ext-list">${res.map(k=>U.ext(RES[k].url,RES[k].t,RES[k].s)).join('')}</div>
        <p class="help" style="margin-top:8px">${t('fam.resourcesNote')}</p>${res.includes('translate')?`<p class="help" style="margin-top:6px">${t('fam.limits')}</p>`:''}`});
  },
  text(card){return [x('fam.cardTitle'),'',...card.data.topics.map((k,i)=>`${i+1}. ${x('fam.'+k+'Q')}`),'',x('fam.uncertain')].join('\n');}
};

/* ------------------------------------------------------------ IMPORTANT DATES (nothing persisted) */
const PROC=['unknown','report','stay','work','other'], SRC=['receipt','notice','message'];
const dates={
  intro(){return intro({title:t('dt.title'),lines:1,first:'#a/dates/1',limit:'dt.review',
    facts:[['why','act.why','dt.helps'],['get','act.get','dt.receive'],['clock','act.time','dt.time']],
    extra:U.note('info','info',t('dt.intro'),'style="margin-bottom:12px"')});},
  1(){const d=S.drafts.dates;
    const body=`<div class="stack" role="radiogroup">${PROC.map(k=>U.opt({type:'radio',name:'dt-p',value:k,checked:d.process===k,label:t('dt.'+k),act:'dt-p',soft:k==='unknown'})).join('')}</div>`;
    return step({back:'#a/dates/intro',n:1,total:2,title:t('dt.process'),whyKey:'dt.processWhy',body,nextAct:'dt-next1',err:U.errorMsg('e-step',S.errors.dt1,'dt.error')});},
  2(){const d=S.drafts.dates;
    const body=`${U.field({id:'dt-date',key:'date',type:'date',label:t('dt.date'),value:d.date,err:S.errors.dt2,errKey:'dt.error'})}
      <p class="help" style="margin:16px 0 8px;font-weight:700">${t('dt.source')}</p>
      <div class="stack" role="radiogroup" aria-label="${esc(x('dt.source'))}">${SRC.map(k=>U.opt({type:'radio',name:'dt-s',value:k,checked:d.source===k,label:t('dt.'+k),act:'dt-s'})).join('')}</div>
      <div class="stack" style="margin-top:16px">${U.opt({name:'dt-c',value:'yes',checked:d.confirmed,label:t('dt.confirm'),act:'dt-c'})}</div>`;
    return step({back:'#a/dates/1',n:2,total:2,title:t('dt.date'),whyKey:null,body,nextAct:'dt-finish',nextLabel:'act.seeResult'});},
  result(card){
    const {process,date,source}=card.data; const past=date<I.today();
    const cardHtml=`<article class="qcard unkept" aria-labelledby="ct-${card.id}">
      <div class="qh"><h2 id="ct-${card.id}">${t('dt.cardTitle')}</h2></div>
      <p class="big" style="font-size:calc(26*var(--u))">${esc(date)}</p>
      <dl class="kv stacked"><dt>${t('dt.process')}</dt><dd>${t('dt.'+process)}</dd><dt>${t('dt.source')}</dt><dd>${t('dt.'+source)}</dd></dl>
      <div class="meta"><span class="state warn">${ic('bell')}${t('state.reminder')}</span>${U.stateLabel('never')}</div></article>
      ${past?U.note('warn','alert',t('dt.past'),'style="margin:-8px 0 20px"'):''}`;
    return resultShell(card,{title:t('dt.title'),cardHtml,meaning:t('dt.meaning'),uncertain:t('dt.review'),
      nextHtml:U.next('dt.nextTitle',null,`<p>${t('dt.calendarNote')}</p><button class="btn primary" type="button" data-act="ics" data-id="${card.id}">${ic('calendar','sm')} ${t('dt.calendar')}</button>`),
      actions:`<p class="help">${t('dt.neutral')}</p><p class="help">${t('dt.notKept')}</p><a class="btn text" href="#edit/${card.id}">${t('act.edit')}</a>`});
  }
};

/* ------------------------------------------------------------ MONEY: DAILY SPENDING (never persisted) */
const COSTS=['food','home','travel','phone','other'];
function parseField(v){try{return {ok:true,v:root.LiftSpending.parse(v||'')};}catch{return {ok:false};}}
const money={
  intro(){return intro({title:t('mn.title'),lines:1,first:'#a/money/1',limit:'mn.limit',
    facts:[['why','act.why','mn.helps'],['get','act.get','mn.receive'],['clock','act.time','mn.time']],
    extra:U.note('info','wallet',t('mn.privacy'),'style="margin-bottom:12px"')});},
  1(){const d=S.drafts.money;
    const body=`<div class="stack" role="radiogroup">${['today','week','month'].map(k=>U.opt({type:'radio',name:'mn-p',value:k,checked:d.period===k,label:t('mn.'+k),act:'mn-p'})).join('')}</div>`;
    return step({back:'#a/money/intro',n:1,total:3,title:t('mn.period'),whyKey:'mn.periodWhy',body,nextAct:'mn-next1',err:U.errorMsg('e-step',S.errors.mn1,'mn.period')});},
  2(){const d=S.drafts.money; const e=S.errors.mn2;
    const body=`${U.field({id:'available',label:t('mn.available'),value:d.available,prefix:'฿',placeholder:x('mn.blank'),help:t('mn.currency'),err:!!e,errKey:e==='missing'?'mn.availableMissing':'mn.error'})}`;
    return step({back:'#a/money/1',n:2,total:3,title:t('mn.available'),whyKey:'mn.availableWhy',body,nextAct:'mn-next2'});},
  3(){const d=S.drafts.money; const e=S.errors.mn3||{};
    const body=`<div>${COSTS.map(k=>U.field({id:k,label:t('mn.'+k),value:d[k],prefix:'฿',placeholder:x('mn.blank'),err:!!e[k],errKey:'mn.error'})).join('')}</div>`;
    return step({back:'#a/money/2',n:3,total:3,title:t('mn.costsTitle'),whyKey:'mn.costsWhy',body,nextAct:'mn-finish',nextLabel:'mn.calculate'});},
  result(card){
    const {period,values}=card.data; const r=root.LiftSpending.calculate(values);
    const missing=COSTS.filter(k=>!String(values[k]||'').trim());
    const short=r.remaining<0;
    const cardHtml=`<article class="qcard unkept" aria-labelledby="ct-${card.id}">
      <div class="qh"><h2 id="ct-${card.id}">${t('mn.cardTitle')}</h2><span class="chip">${t('mn.'+period)}</span></div>
      <p class="eyebrow" style="color:var(--text-2)">${t(short?'mn.shortfall':(r.remaining===0?'mn.remaining':'mn.remaining'))}</p>
      <p class="big ${short?'short':''}">≈ ${I.baht(Math.abs(r.remaining))}</p>
      <dl class="kv"><dt>${t('mn.available')}</dt><dd>${I.baht(r.available)}</dd>
        ${COSTS.map(k=>`<dt>${t('mn.'+k)}</dt>${missing.includes(k)?`<dd class="muted">${t('mn.notEntered')}</dd>`:`<dd>− ${I.baht(root.LiftSpending.parse(values[k]))}</dd>`}`).join('')}
        <dt><b>${t('mn.costs')}</b></dt><dd>${I.baht(r.costs)}</dd></dl>
      <div class="meta"><span class="state calc">≈ ${t('state.calc')}</span>${U.stateLabel('never')}</div></article>`;
    const meaning=(r.remaining===0?t('mn.zero'):t(short?'mn.meaningShort':'mn.meaningLeft',{amount:I.baht(Math.abs(r.remaining))}))+(missing.length?` ${t('mn.missingNote',{count:I.num(missing.length)})}`:'');
    return resultShell(card,{title:t('mn.title'),cardHtml,meaning,uncertain:t('mn.limit'),
      nextHtml:U.next('mn.nextTitle','mn.nextSub',`<a class="btn primary" href="#a/cash/intro" data-act="cash-from-money" data-id="${card.id}">${t('cf.calculate')} ${ic('arrow','sm')}</a>`),
      actions:`<p class="help">${t('mn.privacy')}</p><a class="btn text" href="#edit/${card.id}">${t('act.edit')}</a>`});
  }
};

/* ------------------------------------------------------------ MONEY: DAYS AHEAD (never persisted) */
function cashInput(d){
  const P=v=>{const r=parseField(v);return r;};
  const cash=P(d.cash),daily=P(d.daily),bill=P(d.bill),income=P(d.income);
  return {cash,daily,bill,income,days:parseInt(d.days,10),billDay:d.billDay?parseInt(d.billDay,10):null,incomeDay:d.incomeDay?parseInt(d.incomeDay,10):null};
}
function runCash(data,delay){
  const i=cashInput(data);
  const bills=(i.bill.v&&i.billDay)?[{day:i.billDay,amount:i.bill.v}]:[];
  const income=(i.income.v&&i.incomeDay)?i.income.v:0;
  return root.LiftCashflow.project({cash:i.cash.v,days:i.days,daily:i.daily.v,bills,income,incomeDay:income?i.incomeDay:null,delay:delay||0});
}
const dayOpts=(max,unknownKey)=>[['',x(unknownKey)],...Array.from({length:max},(_,k)=>[k+1,I.num(k+1)])];
const cash={
  intro(){return intro({title:t('cf.title'),lines:1,first:'#a/cash/1',limit:'cf.limits',
    facts:[['why','act.why','mn.nextSub'],['get','act.get','cf.receive']],extra:U.note('info','wallet',t('cf.intro'),'style="margin-bottom:12px"')});},
  1(){const d=S.drafts.cash; const e=S.errors.cf1||{};
    const body=`${U.field({id:'cash',label:t('cf.cash'),value:d.cash,prefix:'฿',placeholder:x('mn.blank'),err:!!e.cash,errKey:e.cash==='missing'?'cf.required':'mn.error'})}
      ${U.select({id:'days',label:t('cf.days'),value:d.days,options:Array.from({length:31},(_,k)=>[k+1,I.num(k+1)])})}
      ${U.field({id:'daily',label:t('cf.daily'),value:d.daily,prefix:'฿',placeholder:x('mn.blank'),err:!!e.daily,errKey:e.daily==='missing'?'cf.required':'mn.error'})}`;
    return step({back:'#a/cash/intro',n:1,total:2,title:t('cf.title'),whyKey:'cf.cashWhy',body,nextAct:'cf-next1'});},
  2(){const d=S.drafts.cash; const e=S.errors.cf2; const days=parseInt(d.days,10)||14;
    const body=`${U.field({id:'bill',label:t('cf.bill'),value:d.bill,prefix:'฿',placeholder:x('mn.blank')})}
      ${U.select({id:'billDay',label:t('cf.billDay'),value:d.billDay,options:dayOpts(days,'cf.unknownDay')})}
      ${U.field({id:'income',label:t('cf.income'),value:d.income,prefix:'฿',placeholder:x('mn.blank')})}
      ${U.select({id:'incomeDay',label:t('cf.incomeDay'),value:d.incomeDay,options:dayOpts(31,'cf.unknownDay'),help:t('cf.expected')})}
      ${U.errorMsg('e-step',!!e,'cf.error')}`;
    return step({back:'#a/cash/1',n:2,total:2,title:t('cf.bill'),whyKey:null,body,nextAct:'cf-finish',nextLabel:'cf.calculate'});},
  result(card){
    const late=!!S.cashLate[card.id]; const r=runCash(card.data,late?3:0); const i=cashInput(card.data);
    const billSkipped=i.bill.v&&!i.billDay, incomeSkipped=i.income.v&&!i.incomeDay;
    const endShort=r.closing<0;
    const rows=r.timeline.map(d=>`<tr class="${d.beforeIncome<0?'short':''}"><td>${t('cf.day')} ${I.num(d.day)}</td><td>${I.baht(d.out)}</td><td>${d.incoming?I.baht(d.incoming):'—'}</td><td>${I.baht(d.balance)}</td></tr>`).join('');
    const cardHtml=`<article class="qcard unkept" aria-labelledby="ct-${card.id}">
      <div class="qh"><h2 id="ct-${card.id}">${t('cf.title')}</h2></div>
      <div class="toggle-row" role="group"><button type="button" class="chipbtn" data-act="cash-late" data-id="${card.id}" data-v="0" aria-pressed="${!late}">${t('cf.original')}</button><button type="button" class="chipbtn" data-act="cash-late" data-id="${card.id}" data-v="1" aria-pressed="${late}">${t('cf.scenario')}</button></div>
      <p class="eyebrow" style="color:var(--text-2)">${t('cf.closing')}</p>
      <p class="big ${endShort?'short':''}">≈ ${I.baht(r.closing)}</p>
      <dl class="kv"><dt>${t('cf.first')}</dt><dd>${r.firstGap?`${t('cf.day')} ${I.num(r.firstGap)}`:t('cf.none')}</dd>
        <dt>${t('cf.gap')}</dt><dd>${r.gap?I.baht(r.gap):'—'}</dd>
        <dt>${t('cf.cash')}</dt><dd>${I.baht(i.cash.v)}</dd><dt>${t('cf.daily')}</dt><dd>${I.baht(i.daily.v)}</dd>
        <dt>${t('cf.bill')}</dt><dd ${i.bill.v&&i.billDay?'':'class="muted"'}>${i.bill.v&&i.billDay?`${I.baht(i.bill.v)} · ${t('cf.day')} ${I.num(i.billDay)}`:t('mn.notEntered')}</dd>
        <dt>${t('cf.income')}</dt><dd ${i.income.v&&i.incomeDay?'':'class="muted"'}>${i.income.v&&i.incomeDay?`${I.baht(i.income.v)} · ${t('cf.day')} ${I.num(i.incomeDay+(late?3:0))}`:t('mn.notEntered')}</dd></dl>
      ${billSkipped?`<p class="help" style="margin-top:8px">${t('cf.billSkipped')}</p>`:''}${incomeSkipped?`<p class="help" style="margin-top:4px">${t('cf.incomeSkipped')}</p>`:''}
      <details class="tl-wrap"><summary>${ic('chev','sm')}${t('cf.timeline')}</summary>
        <table class="tl"><thead><tr><th scope="col">${t('cf.day')}</th><th scope="col">${t('cf.out')}</th><th scope="col">${t('cf.incoming')}</th><th scope="col">${t('cf.balance')}</th></tr></thead><tbody>${rows}</tbody></table></details>
      <div class="meta"><span class="state calc">≈ ${t('state.calc')}</span>${U.stateLabel('never')}</div></article>`;
    const meaning=(r.firstGap&&!endShort?`<b>${t('cf.lesson')}</b>`:t('cf.lesson'));
    return resultShell(card,{title:t('cf.title'),cardHtml,meaning,uncertain:t('cf.limits'),
      nextHtml:U.next('cf.action','cf.actionHelp',''),
      actions:`<p class="help">${t('mn.privacy')}</p><a class="btn text" href="#edit/${card.id}">${t('act.edit')}</a>`});
  }
};
const ACT={everyday,family,dates,money,cash};

/* ------------------------------------------------------------ MINE */
function nextFor(card){return {everyday:'eq.nextTitle',family:'fam.nextTitle',dates:'dt.nextTitle',money:'mn.nextTitle',cash:'cf.action'}[card.kind];}
function titleFor(card){return {everyday:eqTitleKey(card.data.topic),family:'fam.title',dates:'dt.title',money:'mn.title',cash:'cf.title'}[card.kind];}
function youSaid(card){
  const d=card.data;
  if(card.kind==='everyday') return `<span class="chip">${t('eq.'+d.topic)}</span><span class="chip">${d.keys.length===1?t('eq.count1'):t('eq.count',{count:I.num(d.keys.length)})}</span>`;
  if(card.kind==='family') return d.topics.map(k=>`<span class="chip">${t('fam.'+k)}</span>`).join('');
  if(card.kind==='dates') return `<span class="chip">${t('dt.'+d.process)}</span><span class="chip">${esc(d.date)}</span>`;
  if(card.kind==='money') return `<span class="chip">${t('mn.'+d.period)}</span>`;
  return `<span class="chip">${I.num(d.days)} · ${t('cf.days')}</span>`;
}
function youGot(card){
  if(card.kind==='everyday') return card.data.keys.length===1?t('eq.meaning1'):t('eq.meaning',{count:I.num(card.data.keys.length)});
  if(card.kind==='family') return t('fam.'+card.data.topics[0]+'Q')+(card.data.topics.length>1?` <span class="chip">+${I.num(card.data.topics.length-1)}</span>`:'');
  if(card.kind==='dates') return t('state.reminder');
  if(card.kind==='money'){const r=root.LiftSpending.calculate(card.data.values);return `<span class="num" style="font-weight:700">≈ ${I.baht(Math.abs(r.remaining))}</span> · ${t(r.remaining<0?'mn.shortfall':'mn.remaining')}`;}
  const r=runCash(card.data,0);return `<span class="num" style="font-weight:700">≈ ${I.baht(r.closing)}</span> · ${t('cf.closing')}`;
}
function mine(){
  const cards=S.cards;
  const storeNote=S.storage.available===false?U.note('info','cloudoff',t('mine.storageOff'),'style="margin-bottom:16px"'):'';
  if(!cards.length) return {nav:'mine',html:`<main id="main" class="page" tabindex="-1">${U.ph(t('mine.title'),t('mine.intro'))}${storeNote}
    <div class="empty"><div class="doorway" aria-hidden="true"></div><h2>${t('mine.empty.title')}</h2><p>${t('mine.empty.body')}</p><a class="btn primary" href="#home">${t('mine.empty.cta')}</a></div></main>`};
  const todo=cards.slice(0,3).map(c=>`<div class="todo"><span class="tt"><b>${t(nextFor(c))}</b><span>${t(titleFor(c))}</span></span><a class="go" href="#c/${c.id}">${t('mine.open')}</a></div>`).join('');
  const recs=cards.map(c=>{const st=St.status(c);return `<article class="rec ${st==='saved'?'kept':''}" aria-labelledby="r-${c.id}">
    <div class="rh"><b id="r-${c.id}">${t(titleFor(c))}</b><span class="date">${esc(madeOn(c))}</span></div>
    <dl><div><dt>${t('result.youChose')}</dt><dd><span class="chips">${youSaid(c)}</span></dd></div>
        <div><dt>${t('mine.youGot')}</dt><dd>${youGot(c)}</dd></div>
        <div><dt>${t('mine.doNext')}</dt><dd><b>${t(nextFor(c))}</b></dd></div></dl>
    <div class="meta" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">${U.stateLabel(st)}</div>
    <div class="row2" style="margin-top:12px"><a class="btn secondary" href="#c/${c.id}">${t('mine.open')}</a><button class="btn secondary" type="button" data-act="ask-remove" data-id="${c.id}">${t('mine.remove')}</button></div>
  </article>`;}).join('');
  return {nav:'mine',html:`<main id="main" class="page" tabindex="-1">${U.ph(t('mine.title'),t('mine.intro'))}${storeNote}
    <h2 class="sec-t" style="margin-top:0">${t('mine.nextUp')}</h2><div class="stack">${todo}</div>
    <h2 class="sec-t">${t('mine.cards')}</h2><div class="stack">${recs}</div>
    <p class="help" style="margin-top:16px">${t('mine.sessionNote')}</p></main>`};
}

/* ------------------------------------------------------------ COMMUNITY (closed) */
function communityText(){
  const d=S.drafts.community; const lines=[];
  if(d.starter) lines.push(x('com.'+d.starter));
  if(d.question) lines.push(x('eq.'+d.question));
  return lines;
}
function community(){
  const d=S.drafts.community;
  const starters=d.purpose==='share'?['aExperience']:d.purpose==='ask'?['qHelp','qAsk','qExperience']:[];
  const lines=communityText();
  const qOpts=[['',x('com.topic')],...St.EQ_KEYS.map(k=>[k,x('eq.'+k)])];
  return {nav:'community',html:`<main id="main" class="page" tabindex="-1">
   ${U.ph(t('com.title'),t('com.prepare'))}
   <div class="note closed">${ic('lock')}<span><b>${t('com.closedTitle')}</b>${t('com.closed')}</span></div>
   <fieldset class="qg" style="margin-top:20px"><legend class="help" style="font-weight:700;margin-bottom:8px">${t('com.purpose')}</legend>
    <div class="stack" role="radiogroup">${['ask','share'].map(k=>U.opt({type:'radio',name:'com-p',value:k,checked:d.purpose===k,label:t('com.'+k),act:'com-p'})).join('')}</div></fieldset>
   ${starters.length?`<fieldset class="qg" style="margin-top:20px"><legend class="help" style="font-weight:700;margin-bottom:8px">${t(d.purpose==='share'?'com.answer':'com.starter')}</legend>
    <div class="stack" role="radiogroup">${starters.map(k=>U.opt({type:'radio',name:'com-s',value:k,checked:d.starter===k,label:t('com.'+k),act:'com-s'})).join('')}</div></fieldset>`:''}
   ${d.purpose==='ask'?`<div style="margin-top:20px">${U.select({id:'com-q',label:t('com.topic'),value:d.question,options:qOpts,act:'com-q'})}</div>`:''}
   <article class="qcard is-draft" style="margin-top:24px" aria-labelledby="draft-t">
    <div class="qh"><span class="eyebrow" id="draft-t" style="color:var(--text-2)">${t('com.draft')}</span></div>
    ${lines.length?lines.map(l=>`<p style="font-weight:500;margin-top:6px">${esc(l)}</p>`).join(''):`<p class="help">${t('com.empty')}</p>`}
    <div class="meta"><span class="state closed">${ic('lock')}${t('state.notSent')}</span><span class="state draft">${ic('pencil')}${t('state.notKept')}</span></div>
   </article>
   <div class="row2"><button class="btn secondary" type="button" data-act="com-copy" ${lines.length?'':'disabled'}>${ic('copy','sm')} ${t('com.copy')}</button><button class="btn secondary" type="button" data-act="com-download" ${lines.length?'':'disabled'}>${ic('get','sm')} ${t('com.download')}</button></div>
   <p class="help" style="margin-top:12px">${t('com.note')}</p>
   <p class="sr-only" role="status" id="res-status"></p>
  </main>`};
}

/* ------------------------------------------------------------ SHOW LARGE */
function show(card){
  const items=card.kind==='everyday'?card.data.keys.map(k=>t('eq.'+k)):card.data.topics.map(k=>t('fam.'+k+'Q'));
  const title=card.kind==='everyday'?t('eq.title'):t('fam.cardTitle');
  return {nav:null,showing:true,html:`<main id="main" class="show" tabindex="-1">
   <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:12px"><h1 class="eyebrow" tabindex="-1" style="font-size:var(--t-micro)">${title}</h1><a class="tool" href="#c/${card.id}" data-act="show-close">${t('show.close')}</a></div>
   <ol>${items.map(i=>`<li>${i}</li>`).join('')}</ol>
   <p class="help" style="margin-top:16px;display:flex;gap:8px;align-items:center">${ic('info','sm')}${t('show.hint')}</p></main>`};
}
function notFound(){return {nav:'home',html:`<main id="main" class="page" tabindex="-1">${U.ph(t('error.title'),t('error.body'))}<a class="btn primary" href="#home">${t('nav.home')}</a></main>`};}

root.LiftScreens={home,mine,community,show,notFound,ACT,everyday,family,dates,money,cash,communityText,COSTS,runCash,cashInput,parseField,titleFor};
})(window);
