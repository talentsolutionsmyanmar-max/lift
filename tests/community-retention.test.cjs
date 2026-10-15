const test=require('node:test'),assert=require('node:assert/strict'),{cleanupExpiredQuestions}=require('../lib/community-retention.cjs');
const path='community-private/v1/'+'a'.repeat(64)+'.json',now=Date.parse('2026-10-15T12:00:00Z');
test('recent editor upload does not extend original question expiry',async()=>{
 let deleted;const list=async()=>({blobs:[{pathname:path,uploadedAt:new Date(now)}],hasMore:false}),store={read:async()=>({value:{expiresAt:'2026-10-14T12:00:00Z'},etag:'edited-v2'}),remove:async(p,e)=>{deleted={p,e}}};assert.equal(await cleanupExpiredQuestions({list,store,now}),1);assert.deepEqual(deleted,{p:path,e:'edited-v2'});
});
test('retention never deletes a changed version or an unexpired question',async()=>{
 const list=async()=>({blobs:[{pathname:path}],hasMore:false});let attempts=0;const store={read:async()=>({value:{expiresAt:'2026-10-20T12:00:00Z'},etag:'v1'}),remove:async()=>{attempts++}};assert.equal(await cleanupExpiredQuestions({list,store,now}),0);assert.equal(attempts,0);
 store.read=async()=>({value:{expiresAt:'2026-10-14T12:00:00Z'},etag:'v2'});store.remove=async()=>{throw Object.assign(Error('changed'),{code:'CONFLICT'})};assert.equal(await cleanupExpiredQuestions({list,store,now}),0);
});
test('retention ignores other namespaces and refuses corrupt expiry or pagination',async()=>{
 const store={read:async()=>{throw Error('must not read foreign data')},remove:async()=>{throw Error('must not delete')}};assert.equal(await cleanupExpiredQuestions({list:async()=>({blobs:[{pathname:'responses/private.json'}],hasMore:false}),store,now}),0);
 await assert.rejects(()=>cleanupExpiredQuestions({list:async()=>({blobs:[{pathname:path}],hasMore:false}),store:{read:async()=>({value:{expiresAt:'bad'},etag:'v1'})},now}));
 await assert.rejects(()=>cleanupExpiredQuestions({list:async()=>({blobs:[],hasMore:true}),store,now}));
});
