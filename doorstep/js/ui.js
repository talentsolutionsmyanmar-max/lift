/* Lift Doorstep — components. Markup mirrors the approved package (doorstep.css class names)
   and the specs in docs: purpose / anatomy / states. Interactions use data-act attributes
   handled by ONE delegated listener in app.js — re-rendering never loses handlers. */
(function(root){'use strict';
const I=root.LiftI18n, {icon:ic,WORDMARK}=root.LiftIcons;
const t=(k,p)=>I.t(k,p), x=(k,p)=>I.txt(k,p), esc=I.esc;

function header(st){
  const other=I.lang==='my'?'English':'မြန်မာ';
  return `<header class="hdr"><a href="#home" aria-label="Lift">${WORDMARK}</a><span class="sp"></span>
    <button class="tool" type="button" data-act="large" aria-pressed="${st.large}" aria-label="${esc(x('a11y.largerText'))}">A+</button>
    <button class="tool" type="button" data-act="theme" aria-pressed="${st.theme==='dark'}" aria-label="${esc(x('a11y.theme'))}">${ic(st.theme==='dark'?'moon':'sun','sm')}</button>
    <button class="tool" type="button" data-act="lang" aria-label="${esc(x('a11y.language'))}: ${other}" lang="${I.lang==='my'?'en':'my'}">${ic('globe','sm')}<span>${other}</span></button>
  </header>`;
}
const sill=p=>p===undefined?'<div class="sill" aria-hidden="true"></div>':`<div class="sill progress" style="--p:${p}%" aria-hidden="true"></div>`;
function nav(cur){
  const items=[['home','home'],['community','community'],['mine','mine']];
  return `<nav class="nav" aria-label="${esc(x('a11y.main'))}">${items.map(([k,i])=>`<a href="#${k}" ${k===cur?'aria-current="page"':''}>${ic(i)}<span>${t('nav.'+k)}</span></a>`).join('')}</nav>`;
}
const crumb=(href,key)=>`<a class="crumb" href="${href}">${ic('back','sm')}${t(key)}</a>`;
const ph=(h1,lede,eyebrow)=>`<div class="ph">${eyebrow?`<span class="eyebrow">${eyebrow}</span>`:''}<h1 tabindex="-1" ${eyebrow?'style="margin-top:4px"':''}>${h1}</h1>${lede?`<p class="lede">${lede}</p>`:''}</div>`;
function opt({type='checkbox',name,value,checked,label,why,act,soft,disabled}){
  return `<label class="opt ${type==='radio'?'radio':''} ${checked?'on':''} ${soft?'soft':''} ${disabled?'disabled':''}">
    <input type="${type}" name="${esc(name)}" value="${esc(value)}" ${checked?'checked':''} ${disabled?'disabled':''} data-act="${act}">
    <span class="bx" aria-hidden="true">${checked?ic('check','sm'):''}</span>
    <span class="ol">${label}${why?`<span class="ow">${why}</span>`:''}</span></label>`;
}
const why=(bodyKey)=>`<div class="why">${ic('help')}<span><b>${t('act.whyAsk')}</b>${t(bodyKey)}</span></div>`;
const stepmeta=(n,total)=>`<div class="stepmeta"><span class="count">${t('act.stepOf',{n:I.num(n),total:I.num(total)})}</span></div>`;
function facts(rows){return `<div class="facts">${rows.map(([i,k,v])=>`<div class="fact"><span class="fi">${ic(i)}</span><span><span class="k">${t(k)}</span><span class="v" style="display:block">${t(v)}</span></span></div>`).join('')}</div>`;}
function ghost(n,capKey){return `<div class="ghost" aria-hidden="true">${capKey?`<div class="gcap">${ic('get','sm')}${t(capKey)}</div>`:''}${Array.from({length:n},(_,i)=>`<div class="gl"><i>${I.num(i+1)}</i><b></b></div>`).join('')}</div>`;}
function previewCard(n){
  return `<div class="qcard is-draft" style="margin-bottom:16px"><div class="qh"><span class="eyebrow" style="color:var(--text-2)">${t('act.thisIsCard')}</span><span class="state draft">${ic('pencil')}${I.num(n)}</span></div>
   <div class="ghost" style="margin:0;border:0;padding:0;background:none" aria-hidden="true">${Array.from({length:n},(_,i)=>`<div class="gl"><i>${I.num(i+1)}</i><b></b></div>`).join('')}</div></div>`;
}
function note(kind,iconName,html,attrs=''){return `<div class="note ${kind}" ${attrs}>${ic(iconName)}<span>${html}</span></div>`;}
function errorMsg(id,show,key){return `<p class="err" id="${id}" role="alert" ${show?'':'hidden'}>${ic('alert')}<span>${key?t(key):''}</span></p>`;}
function stateLabel(status){
  return {saved:`<span class="state kept">${ic('phone')}${t('state.kept')}</span>`,
          unsaved:`<span class="state draft">${ic('pencil')}${t('state.notKept')}</span>`,
          changed:`<span class="state warn">${ic('pencil')}${t('state.changed')}</span>`,
          never:`<span class="state draft">${ic('pencil')}${t('state.neverKept')}</span>`}[status];
}
function mean(iconName,labelKey,bodyHtml,small){return `<div class="mean"><span class="fi">${ic(iconName)}</span><span><b>${t(labelKey)}</b><p ${small?'class="help" style="font-size:var(--t-help)"':''}>${bodyHtml}</p></span></div>`;}
function next(titleKey,subKey,btn){return `<section class="next" aria-labelledby="nx"><span class="eyebrow">${t('result.next')}</span><b id="nx">${t(titleKey)}</b>${subKey?`<p>${t(subKey)}</p>`:''}${btn||''}</section>`;}
function dock(inner){return `<div class="dock">${inner}</div>`;}
function ext(url,titleKey,subKey){
  return `<button type="button" class="ext" data-act="ext" data-url="${esc(url)}" data-name="${esc(x(titleKey))}" style="width:100%;text-align:left"><span class="tt"><b>${t(titleKey)}</b>${subKey?`<small>${t(subKey)}</small>`:''}<span>${ic('ext','sm')}${t('ext.needsNet')}</span></span>${ic('chev','sm')}</button>`;
}
function sheet(inner,labelId){
  return `<div class="scrim" data-act="scrim"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="${labelId}"><div class="grab" aria-hidden="true"></div>${inner}</section></div>`;
}
function field({id,key,label,value='',help,errKey,err,inputmode='decimal',placeholder,prefix,type='text',act='input',describe=''}){
  const d=[help?id+'-h':'',id+'-e',describe].filter(Boolean).join(' ');
  const input=`<input class="control ${prefix?'money':''}" id="${id}" name="${id}" type="${type}" ${type==='text'?`inputmode="${inputmode}" autocomplete="off" maxlength="16"`:''} value="${esc(value)}" ${placeholder?`placeholder="${esc(placeholder)}"`:''} aria-describedby="${d}" ${err?'aria-invalid="true"':''} data-act="${act}" data-field="${key||id}">`;
  return `<div class="field"><label for="${id}">${label}</label>${prefix?`<div class="affix"><span class="pre" aria-hidden="true">${prefix}</span>${input}</div>`:input}${help?`<p class="help" id="${id}-h">${help}</p>`:''}${errorMsg(id+'-e',err,errKey)}</div>`;
}
function select({id,label,options,value,act='input',help}){
  return `<div class="field"><label for="${id}">${label}</label><select class="control" id="${id}" name="${id}" data-act="${act}" data-field="${id}" ${help?`aria-describedby="${id}-h"`:''}>${options.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${l}</option>`).join('')}</select>${help?`<p class="help" id="${id}-h">${help}</p>`:''}</div>`;
}
root.LiftUI={header,sill,nav,crumb,ph,opt,why,stepmeta,facts,ghost,previewCard,note,errorMsg,stateLabel,mean,next,dock,ext,sheet,field,select,ic,t,x,esc};
})(window);
