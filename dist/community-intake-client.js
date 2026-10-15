'use strict';
(function(root){
 function validReceipt(value){return typeof value==='string'&&/^[A-Za-z0-9_-]{43}$/.test(value);}
 function parseResponse(body){
  if(!body||typeof body!=='object'||!['received','answered','withdrawn','expired','not_found','closed','conflict','retry','rate_limited','unavailable'].includes(body.status))throw Error('Unconfirmed response');
  if(['received','answered'].includes(body.status)){
   if(body.ok!==true||!Number.isFinite(Date.parse(body.submittedAt))||!Number.isFinite(Date.parse(body.expiresAt)))throw Error('Unconfirmed response');
   const result={status:body.status,submittedAt:body.submittedAt,expiresAt:body.expiresAt};
   if(body.status==='answered'){
    const r=body.reply;if(!r||!['en','my'].every(k=>typeof r[k]==='string'&&r[k].trim()&&r[k].length<=2400)||!Array.isArray(r.sources)||r.sources.length<1||r.sources.length>5||!Number.isFinite(Date.parse(body.reviewedAt)))throw Error('Unconfirmed reply');
    for(const source of r.sources){const u=new URL(source);if(u.protocol!=='https:'||u.username||u.password)throw Error('Unconfirmed source');}
    result.reply={en:r.en,my:r.my,sources:[...r.sources]};result.reviewedAt=body.reviewedAt;
   }
   return result;
  }
  if(body.status==='withdrawn'&&body.ok!==true)throw Error('Unconfirmed withdrawal');return {status:body.status};
 }
 function createClient({fetchImpl=root.fetch?.bind(root),cryptoImpl=root.crypto,online=()=>root.navigator?.onLine!==false,timeoutMs=15000}={}){
  if(!Number.isFinite(timeoutMs)||timeoutMs<1||timeoutMs>60000)throw Error('Invalid request timeout');
  let pending=null,busy=false;
  function begin(draft,consent){
   if(busy||pending)throw Error('A receipt is already pending');
   if(!draft||!['question','experience'].includes(draft.kind)||!['daily','family','work','documents','health'].includes(draft.topic)||typeof draft.text!=='string'||!draft.text.trim()||draft.text.length>1200||!['en','my'].includes(draft.language)||consent?.adult!==true||consent.review!==true||typeof consent.ai!=='boolean')throw Error('Consent or draft invalid');
   if(!cryptoImpl?.getRandomValues)throw Error('Secure receipt unavailable');const bytes=cryptoImpl.getRandomValues(new Uint8Array(32));
   const receipt=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
   pending={version:1,action:'submit',receipt,kind:draft.kind,topic:draft.topic,text:draft.text.trim(),language:draft.language,adult:true,consentToReview:true,consentToAI:consent.ai};return receipt;
  }
  async function request(body){
   if(busy)throw Error('Request already running');if(!online())return {status:'offline'};if(typeof fetchImpl!=='function')return {status:'unavailable'};
   busy=true;let timer;const controller=typeof root.AbortController==='function'?new root.AbortController():null;
   const deadline=new Promise(resolve=>{timer=setTimeout(()=>{resolve({status:'unavailable'});controller?.abort();},timeoutMs);});
   async function perform(){try{const response=await fetchImpl('/api/community',{method:'POST',credentials:'omit',cache:'no-store',redirect:'error',signal:controller?.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const result=parseResponse(await response.json());if(response.status>=500&&result.status!=='closed')return {status:'unavailable'};
    const expected={received:200,answered:200,withdrawn:200,expired:410,not_found:404,closed:503,conflict:409,retry:409,rate_limited:429,unavailable:503};
    if(expected[result.status]!==response.status)throw Error('Unexpected response status');return result;
   }catch{return {status:'unavailable'};}}
   try{return await Promise.race([perform(),deadline]);}finally{clearTimeout(timer);busy=false;}
  }
  return {begin,receipt:()=>pending?.receipt||null,isBusy:()=>busy,send:()=>{if(!pending)throw Error('No prepared submission');return request({...pending});},check:receipt=>{if(!validReceipt(receipt))throw Error('Invalid receipt');return request({version:1,action:'status',receipt});},withdraw:receipt=>{if(!validReceipt(receipt))throw Error('Invalid receipt');return request({version:1,action:'withdraw',receipt});}};
 }
 const api={validReceipt,parseResponse,createClient};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunityIntakeClient=api;
})(typeof window!=='undefined'?window:globalThis);
