const test=require('node:test'),assert=require('node:assert/strict'),{verify}=require('../scripts/verify-community-private-storage.cjs');
test('provider probe requires opt-in before any IO and touches only one new synthetic namespace',async()=>{
 let io=0;await assert.rejects(()=>verify({enabled:false,store:{create:async()=>io++}}));assert.equal(io,0);
 const rows=new Map(),paths=new Set();let version=0;const store={async create(p,value){paths.add(p);assert.match(p,/^community-integration\/[a-f0-9-]+\.json$/);assert.deepEqual(value,{synthetic:true,marker:'v1'});rows.set(p,{value,etag:String(++version)})},async read(p){return rows.has(p)?structuredClone(rows.get(p)):null},async replace(p,value,etag){assert.ok(paths.has(p));if(rows.get(p).etag!==etag)throw Object.assign(Error('conflict'),{code:'CONFLICT'});rows.set(p,{value,etag:String(++version)})}};
 const result=await verify({enabled:true,store,del:async(p,o)=>{assert.ok(paths.has(p));assert.equal(rows.get(p).etag,o.ifMatch);rows.delete(p)}});assert.equal(result.staleUpdateRefused,true);assert.equal(paths.size,1);assert.equal(rows.size,0);
});
test('provider probe cleans its own synthetic object if the initial read fails',async()=>{
 let created,removed;await assert.rejects(()=>verify({enabled:true,store:{create:async p=>{created=p},read:async()=>{throw Error('read outage')}},del:async p=>{removed=p}}));assert.match(created,/^community-integration\//);assert.equal(removed,created);
});
test('probe diagnostics expose only known stage and class, never error messages or tokens',()=>{
 const {safeFailure}=require('../scripts/verify-community-private-storage.cjs'),e=Object.assign(Error('must-not-print-token-or-private-url'),{probeStage:'create',name:'BlobAccessError'});assert.deepEqual(safeFailure(e),{stage:'create',kind:'BlobAccessError'});assert.equal(JSON.stringify(safeFailure(e)).includes('must-not-print'),false);assert.deepEqual(safeFailure({name:'private-secret',probeStage:'private-secret'}),{stage:'local_setup',kind:'unconfirmed'});
});
test('probe recognises SDK subclass constructors even when Error.name is generic',()=>{
 const {safeFailure}=require('../scripts/verify-community-private-storage.cjs');
 class BlobOidcEnvironmentNotAllowedError extends Error{}
 const error=new BlobOidcEnvironmentNotAllowedError('private-provider-message');error.probeStage='create';
 assert.deepEqual(safeFailure(error),{stage:'create',kind:'BlobOidcEnvironmentNotAllowedError'});
});
