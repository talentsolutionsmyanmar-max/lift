/* Lift Doorstep — keyed bilingual copy with provenance.
   R = reviewed Myanmar, L = inherited unverified Myanmar, P = no Myanmar (English is shown, marked lang="en").
   Nothing here rewrites DOM text; templates look strings up by key. */
(function(root){'use strict';
const C=root.LIFT_COPY;
let lang='my', dev=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fill=(s,p)=>p?s.replace(/\{(\w+)\}/g,(m,k)=>p[k]!==undefined?p[k]:m):s;
const MYD='၀၁၂၃၄၅၆၇၈၉';
const num=n=>lang==='my'?String(n).replace(/\d/g,d=>MYD[d]):String(n);
function entry(k){const e=C[k];if(!e){console.warn('missing copy key',k);return {en:k,p:'P'};}return e;}
/* HTML-safe string for element content; params are escaped */
function t(k,p){
  const e=entry(k); const P=p&&Object.fromEntries(Object.entries(p).map(([a,b])=>[a,esc(b)]));
  if(lang==='en') return fill(esc(e.en),P);
  if(e.p==='P') return `<span lang="en" class="cco" data-copy="${k}">${fill(esc(e.en),P)}</span>`;
  if(e.p==='L') return `<span class="unv" data-copy="${k}">${fill(esc(e.my),P)}</span>`;
  return fill(esc(e.my),P);
}
/* plain text for attributes, clipboard and files */
function txt(k,p){const e=entry(k);return fill(lang==='en'||e.p==='P'?e.en:e.my,p);}
/* money is always Latin digits with ฿ (people check against Thai receipts) */
function baht(cents){const neg=cents<0,a=Math.abs(cents);const s=(a/100).toLocaleString('en-US',{minimumFractionDigits:a%100?2:0,maximumFractionDigits:2});return (neg?'−':'')+'฿'+s;}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
root.LiftI18n={t,txt,esc,num,baht,today,
  get lang(){return lang;}, setLang(l){lang=l==='en'?'en':'my';},
  get dev(){return dev;}, setDev(v){dev=!!v;},
  counts(){const c={R:0,L:0,P:0};Object.values(C).forEach(e=>c[e.p]++);return c;}};
})(window);
