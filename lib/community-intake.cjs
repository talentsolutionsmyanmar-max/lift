'use strict';
const {createHmac}=require('node:crypto');
const {receiptView}=require('./community-receipt-view.cjs');
const TTL=14*86400000;
const topics=['daily','family','work','documents','health'];
function credential(body){if(!body||body.version!==1||!['submit','status','withdraw'].includes(body.action)||typeof body.receipt!=='string'||! /^[A-Za-z0-9_-]{43}$/.test(body.receipt))throw Error('invalid');return body.receipt;}
function submission(body){
 credential(body);if(body.action!=='submit'||body.adult!==true||body.consentToReview!==true||typeof body.consentToAI!=='boolean'||!['en','my'].includes(body.language)||!['question','experience'].includes(body.kind)||!topics.includes(body.topic)||typeof body.text!=='string'||!body.text.trim()||body.text.length>1200||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(body.text))throw Error('invalid');
 return {language:body.language,kind:body.kind,topic:body.topic,text:body.text.trim(),adult:true,consentToReview:true,consentToAI:body.consentToAI};
}
function hmac(secret,purpose,value){return createHmac('sha256',secret).update('lift-community-v1:'+purpose+':'+value).digest('hex');}
function pathFor(secret,receipt){return 'community-private/v1/'+hmac(secret,'receipt',receipt)+'.json';}
function makeService({store,secret,now=()=>new Date()}){
 if(typeof secret!=='string'||secret.length<32)throw Error('Community secret unavailable');
 function status(record){return receiptView(record,now());}
 async function run(body){const receipt=credential(body),path=pathFor(secret,receipt);let current=await store.read(path);
  if(body.action==='submit'){
   const content=submission(body),contentDigest=hmac(secret,'content',JSON.stringify(content));
   if(current){const result=status(current.value);if(!['received','answered'].includes(result.status))return result;if(current.value.contentDigest!==contentDigest)return {status:'conflict'};return result;}
   const createdAt=now().toISOString(),value={version:1,state:'received',createdAt,expiresAt:new Date(now().getTime()+TTL).toISOString(),contentDigest,content};
   try{await store.create(path,value);}catch(error){current=await store.read(path);if(!current)throw error;const result=status(current.value);if(!['received','answered'].includes(result.status))return result;if(current.value.contentDigest!==contentDigest)return {status:'conflict'};return result;}
   return status(value);
  }
  if(!current)return {status:'not_found'};
  if(body.action==='status')return status(current.value);
  // Replace rather than delete: the receipt cannot recreate a withdrawn question on a retry.
  for(let attempt=0;attempt<3;attempt++){
   const result=status(current.value);if(!['received','answered'].includes(result.status))return result;
   const tombstone={version:1,state:'withdrawn',createdAt:current.value.createdAt,expiresAt:current.value.expiresAt,withdrawnAt:now().toISOString()};
   try{await store.replace(path,tombstone,current.etag);return {status:'withdrawn'};}catch(error){if(error.code!=='CONFLICT')throw error;current=await store.read(path);if(!current)return {status:'not_found'};}
  }
  return {status:'retry'};
 }
 return {run};
}
module.exports={TTL,credential,submission,hmac,pathFor,makeService};
