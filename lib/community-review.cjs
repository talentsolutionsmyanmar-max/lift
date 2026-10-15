'use strict';
// Privileged local reviewer operations. No HTTP route or model invocation is exported.
const {createHash}=require('node:crypto');
function recordPath(key){if(typeof key!=='string'||! /^[a-f0-9]{64}$/.test(key))throw Error('Invalid review key');return 'community-private/v1/'+key+'.json';}
function checkedText(value,max){if(typeof value!=='string'||!value.trim()||value.length>max||/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))throw Error('Invalid reviewed text');return value.trim();}
function replyHash(reply){return createHash('sha256').update(JSON.stringify({en:reply.en,my:reply.my,sources:reply.sources})).digest('hex');}
function normalizeReply(value){
 const en=checkedText(value?.en,2400),my=checkedText(value?.my,2400);if(!/[\u1000-\u109f]/.test(my))throw Error('Myanmar reply required');
 if(!Array.isArray(value?.sources)||value.sources.length<1||value.sources.length>5)throw Error('Reply needs sources');
 const sources=value.sources.map(s=>{if(typeof s!=='string')throw Error('Invalid source');const u=new URL(s);if(u.protocol!=='https:'||u.username||u.password||u.hash||!u.hostname.includes('.'))throw Error('Invalid source');return u.href;});return {en,my,sources};
}
function makeReviewer({store,now=()=>new Date()}){
 async function load(key){const path=recordPath(key),current=await store.read(path);if(!current)throw Error('Question unavailable');const r=current.value;if(r.version!==1||r.state!=='received'||!r.content||!Number.isFinite(Date.parse(r.expiresAt))||Date.parse(r.expiresAt)<=now().getTime())throw Error('Question unavailable');return {path,current};}
 async function aiPacket(key,{redactedText,redactionConfirmed,editorId}){
  const {current}=await load(key),r=current.value;
  if(r.content.consentToAI!==true||redactionConfirmed!==true||typeof editorId!=='string'||!editorId.trim())throw Error('AI handoff not authorised');
  return {version:1,itemId:key,reviewerKind:'ai',language:r.content.language,kind:r.content.kind,topic:r.content.topic,redactedText:checkedText(redactedText,1200),instruction:'First-pass suggestions only. Do not identify people, invent facts, approve publication or give an individual legal/health decision.'};
 }
 async function saveAIPass(key,pass){
  const {path,current}=await load(key),r=current.value;if(r.content.consentToAI!==true)throw Error('AI handoff not authorised');
  const allowed=['needs_source_check','needs_qualified_review','needs_wording_review','ready_for_editor'];
  if(pass?.reviewerKind!=='ai'||!allowed.includes(pass.status)||typeof pass.model!=='string'||!pass.model.trim())throw Error('Invalid AI pass');
  const aiReview={reviewerKind:'ai',model:checkedText(pass.model,120),status:['documents','health'].includes(r.content.topic)?'needs_qualified_review':pass.status,reviewedAt:now().toISOString()};
  await store.replace(path,{...r,aiReview},current.etag);return {saved:true,reviewerKind:'ai',status:aiReview.status};
 }
 async function approveReply(key,rawReply,review){
  const {path,current}=await load(key),r=current.value,reply=normalizeReply(rawReply);
  if(review?.reviewerKind!=='human'||typeof review.editorId!=='string'||!review.editorId.trim()||review.privacyChecked!==true||review.sourcesChecked!==true||review.myanmarChecked!==true||review.contentHash!==replyHash(reply))throw Error('Human reply review incomplete');
  if(['documents','health'].includes(r.content.topic)&&(review.qualifiedReviewConfirmed!==true||typeof review.qualifiedReviewerId!=='string'||!review.qualifiedReviewerId.trim()))throw Error('Qualified review required');
  const replyReview={reviewerKind:'human',editorId:review.editorId.trim(),reviewedAt:now().toISOString(),contentHash:replyHash(reply),privacyChecked:true,sourcesChecked:true,myanmarChecked:true,...(review.qualifiedReviewConfirmed===true?{qualifiedReviewerId:review.qualifiedReviewerId,qualifiedReviewConfirmed:true}:{} )};
  await store.replace(path,{...r,reply,replyReview},current.etag);return {saved:true,visibility:'private_receipt_only'};
 }
 return {aiPacket,saveAIPass,approveReply};
}
module.exports={recordPath,replyHash,normalizeReply,makeReviewer};
