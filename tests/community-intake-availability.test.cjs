const test=require('node:test'),assert=require('node:assert/strict');
const {createAvailability}=require('../dist/community-intake-availability.js');
test('readiness request is GET without receipts, credentials or caching, and rejects contradictory flags',async()=>{
 let call;const a=createAvailability({fetchImpl:async(...args)=>{call=args;return {status:200,json:async()=>({submissionsOpen:true,receiptsOpen:false})};}});
 assert.deepEqual(await a.refresh(),{submissionsOpen:false,receiptsOpen:false});assert.equal(call[0],'/api/community-availability');assert.equal(call[1].method,'GET');assert.equal(call[1].credentials,'omit');assert.equal(call[1].body,undefined);assert.equal(call[1].cache,'no-store');
});
test('failed readiness refresh closes new submissions without revoking previously known receipt access',async()=>{
 let count=0;const a=createAvailability({fetchImpl:async()=>{if(count++)throw Error('offline');return {status:200,json:async()=>({submissionsOpen:true,receiptsOpen:true})};}});
 assert.equal((await a.refresh()).submissionsOpen,true);assert.deepEqual(await a.refresh(),{submissionsOpen:false,receiptsOpen:true});
});
test('stalled availability times out and late readiness cannot reopen intake',async()=>{
 let finish;const a=createAvailability({timeoutMs:10,fetchImpl:()=>new Promise(resolve=>{finish=resolve;})});
 const first=a.refresh();assert.equal(first,a.refresh());assert.deepEqual(await first,{submissionsOpen:false,receiptsOpen:false});
 finish({status:200,json:async()=>({submissionsOpen:true,receiptsOpen:true})});await Promise.resolve();assert.equal(a.current().submissionsOpen,false);
});
