const test=require('node:test'),assert=require('node:assert/strict');
const {reviewQueue,humanReviewPacket}=require('../lib/community-review-queue.cjs');
const key='a'.repeat(64),path='community-private/v1/'+key+'.json',now=Date.parse('2026-10-15T00:00:00Z');
const record=()=>({version:1,state:'received',createdAt:'2026-10-14T00:00:00Z',expiresAt:'2026-10-28T00:00:00Z',content:{language:'my',kind:'question',topic:'documents',text:'private-original',consentToAI:false},contentDigest:'private-digest'});
test('queue exports metadata without original text, receipt, digest or reviewer identifiers',async()=>{
 const result=await reviewQueue({now,list:async()=>({blobs:[{pathname:path},{pathname:'responses/private.json'}],hasMore:false}),store:{read:async p=>{assert.equal(p,path);return {value:record()}}}});
 assert.equal(result.items.length,1);assert.equal(result.items[0].aiAllowed,false);assert.equal(result.items[0].qualifiedReviewRequired,true);assert.equal(result.items[0].status,'received');
 assert.equal(JSON.stringify(result).includes('private-original'),false);assert.equal(JSON.stringify(result).includes('private-digest'),false);
});
test('withdrawn and expired content cannot enter the queue or human packet',async()=>{
 for(const r of [{...record(),state:'withdrawn'},{...record(),expiresAt:'2026-10-14T00:00:00Z'}]){
  const store={read:async()=>({value:r})};const result=await reviewQueue({now,list:async()=>({blobs:[{pathname:path}],hasMore:false}),store});assert.equal(result.items.length,0);
  await assert.rejects(()=>humanReviewPacket({key,store,now,humanReviewConfirmed:true}));
 }
});
test('human packet requires explicit intent, omits digest and does not imply AI consent',async()=>{
 let reads=0;const store={read:async()=>{reads++;return {value:record()}}};
 await assert.rejects(()=>humanReviewPacket({key,store,now}));assert.equal(reads,0);
 const result=await humanReviewPacket({key,store,now,humanReviewConfirmed:true});assert.equal(result.text,'private-original');assert.equal(result.consentToAI,false);assert.equal(result.contentDigest,undefined);
 await assert.rejects(()=>humanReviewPacket({key:'../responses/private',store,now,humanReviewConfirmed:true}));assert.equal(reads,1);
});
test('queue bounds pagination, refuses cursor cycles and marks partial scans',async()=>{
 const store={read:async()=>({value:record()})};
 const result=await reviewQueue({now,maxPages:1,store,list:async()=>({blobs:[],hasMore:true,cursor:'next'})});assert.equal(result.truncated,true);
 await assert.rejects(()=>reviewQueue({now,store,list:async()=>({blobs:[],hasMore:true,cursor:'repeat'})}),/pagination/);
});
