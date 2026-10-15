/* Lift i18n — keyed bilingual lookup.
   Replaces the DOM text-node rewriter: templates ask for copy by key,
   so a wording change can never silently break a translation.
   Myanmar loads as a static object (bundled, offline-available). */
(function(root){
'use strict';
const KEY='lift-lang';
let locale='en';
try{const s=localStorage.getItem(KEY); if(s==='my'||s==='en') locale=s;}catch{}
function t(key,params){
  const dict=root.LIFT_COPY||{en:{},my:{}};
  let s=(dict[locale]&&dict[locale][key]) ?? (dict.en&&dict.en[key]) ?? key;
  if(params) s=String(s).replace(/\{(\w+)\}/g,(m,k)=>params[k]!=null?String(params[k]):m);
  return s;
}
function setLocale(l){ locale=(l==='my')?'my':'en'; try{localStorage.setItem(KEY,locale);}catch{} document.documentElement.lang=locale; }
function isMy(){return locale==='my';}
function fmtMoney(cents){ return new Intl.NumberFormat(locale==='my'?'my-MM':'en',{minimumFractionDigits:2,maximumFractionDigits:2}).format(cents/100)+' THB'; }
function fmtNum(n){ return new Intl.NumberFormat(locale==='my'?'my-MM':'en').format(n); }
function fmtDate(iso){ try{return new Intl.DateTimeFormat(locale==='my'?'my-MM':'en-GB',{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso+'T00:00:00'));}catch{return iso;} }
const api={t,setLocale,isMy,fmtMoney,fmtNum,fmtDate,get locale(){return locale;}};
root.LIFT_I18N=api;
if(root.document) document.documentElement.lang=locale;
})(typeof window!=='undefined'?window:globalThis);
