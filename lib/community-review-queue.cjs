'use strict';
// Local operator workflow only. Never expose these exports from a public route.
const {recordPath}=require('./community-review.cjs');
const {receiptView}=require('./community-receipt-view.cjs');
function currentRecord(record,now){
 return record?.version===1&&record.state==='received'&&record.content&&Number.isFinite(Date.parse(record.expiresAt))&&Date.parse(record.expiresAt)>now;
}
async function reviewQueue({list,store,now=Date.now(),maxPages=10}){
 if(!Number.isInteger(maxPages)||maxPages<1||maxPages>100)throw Error('Invalid queue limit');
 let cursor;const cursors=new Set(),keys=new Set(),items=[];let skipped=0;
 for(let pageNumber=0;pageNumber<maxPages;pageNumber++){
  const page=await list({prefix:'community-private/v1/',cursor,limit:100});
  if(!Array.isArray(page?.blobs)||typeof page.hasMore!=='boolean')throw Error('Invalid queue page');
  for(const item of page.blobs){
   const match=/^community-private\/v1\/([a-f0-9]{64})\.json$/.exec(item.pathname||'');
   if(!match||keys.has(match[1]))continue;keys.add(match[1]);
   const current=await store.read(item.pathname),r=current?.value;
   if(!currentRecord(r,now)){skipped++;continue;}
   const c=r.content;
   if(!['en','my'].includes(c.language)||!['question','experience'].includes(c.kind)||!['daily','family','work','documents','health'].includes(c.topic)){skipped++;continue;}
   let status;try{status=receiptView(r,new Date(now)).status;}catch{status='needs_inspection';}
   items.push({key:match[1],language:c.language,kind:c.kind,topic:c.topic,submittedAt:r.createdAt,expiresAt:r.expiresAt,aiAllowed:c.consentToAI===true,qualifiedReviewRequired:['documents','health'].includes(c.topic),status});
  }
  if(!page.hasMore)return {version:1,items,skipped,truncated:false};
  if(typeof page.cursor!=='string'||!page.cursor||cursors.has(page.cursor))throw Error('Invalid queue pagination');
  cursors.add(page.cursor);cursor=page.cursor;
 }
 return {version:1,items,skipped,truncated:true};
}
async function humanReviewPacket({key,store,now=Date.now(),humanReviewConfirmed=false}){
 if(humanReviewConfirmed!==true)throw Error('Explicit human-only review confirmation required');
 const current=await store.read(recordPath(key)),r=current?.value;
 if(!currentRecord(r,now))throw Error('Question unavailable');
 const c=r.content;
 return {version:1,purpose:'private_human_review_only',itemId:key,language:c.language,kind:c.kind,topic:c.topic,text:c.text,consentToAI:c.consentToAI===true,submittedAt:r.createdAt,expiresAt:r.expiresAt,instruction:'Private original submission for an authorised human operator. Do not publish or send this original packet to a model. Prepare a separate redacted ai-packet only when AI consent permits.'};
}
module.exports={reviewQueue,humanReviewPacket};
