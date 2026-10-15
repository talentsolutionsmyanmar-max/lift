const test=require('node:test'),assert=require('node:assert/strict');
const {makeService,pathFor,submission}=require('../lib/community-intake.cjs');
const {makeHandler}=require('../api/community.js');
const secret='test-only-community-secret-32-characters';const now=()=>new Date('2026-10-15T12:00:00Z');
const input=()=>({version:1,action:'submit',receipt:'A'.repeat(43),language:'my',kind:'question',topic:'family',text:'Fictional family learning question',adult:true,consentToReview:true,consentToAI:false});
function memory(){const data=new Map();let version=0;return {data,async read(path){return data.has(path)?structuredClone(data.get(path)):null},async create(path,value){if(data.has(path))throw Error('Already exists');data.set(path,{value:structuredClone(value),etag:String(++version)})},async replace(path,value,etag){if(data.get(path)?.etag!==etag)throw Object.assign(Error('conflict'),{code:'CONFLICT'});data.set(path,{value:structuredClone(value),etag:String(++version)})}};}
function res(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(v){this.code=v;return this},json(v){this.body=v;return this}};}
const req=body=>({method:'POST',headers:{origin:'https://lift-next-step.vercel.app','content-type':'application/json','x-vercel-forwarded-for':'192.0.2.7'},body});
const config=()=>({COMMUNITY_INTAKE_ENABLED:'true',COMMUNITY_REVIEW_READY:'v1',COMMUNITY_RECEIPT_SECRET:secret});
test('private receipt isolates questions, preserves opt-out and never returns content',async()=>{
 const store=memory(),s=makeService({store,secret,now}),b=input(),first=await s.run(b);assert.equal(first.status,'received');assert.equal(first.expiresAt,'2026-10-29T12:00:00.000Z');assert.equal(JSON.stringify(first).includes(b.text),false);
 assert.deepEqual(await s.run(b),first);assert.equal(store.data.size,1);assert.equal((await s.run({...b,text:'Changed question'})).status,'conflict');
 assert.equal((await s.run({version:1,action:'status',receipt:'B'.repeat(43)})).status,'not_found');
 const raw=JSON.stringify([...store.data]);assert.equal(raw.includes(b.receipt),false);assert.equal(raw.includes('192.0.2.7'),false);assert.equal([...store.data.values()][0].value.content.consentToAI,false);
});
test('withdrawal strips text and consent, and retries cannot recreate it',async()=>{
 const store=memory(),s=makeService({store,secret,now}),b=input();await s.run(b);assert.equal((await s.run({...b,action:'withdraw'})).status,'withdrawn');
 assert.equal((await s.run(b)).status,'withdrawn');assert.equal((await s.run({...b,action:'status'})).status,'withdrawn');const record=store.data.get(pathFor(secret,b.receipt)).value;assert.equal(record.content,undefined);assert.equal(record.contentDigest,undefined);assert.equal(JSON.stringify(record).includes(b.text),false);
});
test('conditional withdrawal retries conflicts and never does a blind overwrite',async()=>{
 const store=memory(),baseReplace=store.replace;let attempts=0;store.replace=async(...args)=>{assert.ok(args[2]);if(++attempts===1)throw Object.assign(Error('conflict'),{code:'CONFLICT'});return baseReplace(...args)};
 const s=makeService({store,secret,now}),b=input();await s.run(b);assert.equal((await s.run({...b,action:'withdraw'})).status,'withdrawn');assert.equal(attempts,2);
});
test('expired credentials cannot revive old content; corrupt records fail',async()=>{
 const store=memory(),b=input();await makeService({store,secret,now}).run(b);const later=makeService({store,secret,now:()=>new Date('2026-10-30T00:00:00Z')});assert.equal((await later.run(b)).status,'expired');assert.equal((await later.run({...b,action:'status'})).status,'expired');
 store.data.get(pathFor(secret,b.receipt)).value.expiresAt='invalid';await assert.rejects(()=>later.run({...b,action:'status'}));
});
test('consent, adult-only scope, size and bearer credentials are required',()=>{
 for(const mutate of [b=>b.adult=false,b=>b.consentToReview=false,b=>delete b.consentToAI,b=>b.text='x'.repeat(1201),b=>b.receipt='guess',b=>b.text=' ',b=>b.topic='GPS',b=>b.language='unknown']){const b=input();mutate(b);assert.throws(()=>submission(b));}
 const b=input();b.name='must discard';assert.equal(submission(b).name,undefined);
});
test('closed or unready intake does no storage IO and GET never exposes a question',async()=>{
 let io=0;const h=makeHandler({store:{read:async()=>io++},quotaPut:async()=>io++,env:()=>({}),now});let r=res();await h(req(input()),r);assert.equal(r.code,503);assert.equal(r.body.status,'closed');assert.equal(io,0);
 r=res();await h({...req(input()),method:'GET'},r);assert.equal(r.code,405);assert.equal(io,0);
});
test('API rejects foreign origin, bad payload, missing operational readiness and write failures',async()=>{
 const store=memory(),quotaPut=async()=>{},quotaHead=async()=>{};const h=makeHandler({store,quotaPut,quotaHead,env:config,now});
 let r=res();await h({...req(input()),headers:{origin:'https://foreign.test'}},r);assert.equal(r.code,403);
 r=res();await h(req({...input(),adult:false}),r);assert.equal(r.code,400);assert.equal(store.data.size,0);
 const unready=makeHandler({store,quotaPut,env:()=>({...config(),COMMUNITY_REVIEW_READY:''}),now});r=res();await unready(req(input()),r);assert.equal(r.body.status,'closed');
 const broken=makeHandler({store:{read:async()=>null,create:async()=>{throw Error('outage')}},quotaPut,quotaHead,env:config,now});r=res();await broken(req(input()),r);assert.equal(r.code,503);assert.equal(r.body.ok,false);
});
test('API responses are private and the quota refuses overflow without storing a question',async()=>{
 const store=memory(),slots=new Map(),h=makeHandler({store,env:config,now,quotaPut:async(p,v,o)=>{assert.equal(o.access,'private');if(slots.has(p))throw Error('exists');slots.set(p,v)},quotaHead:async p=>{if(!slots.has(p))throw Error('missing')}});
 let r=res();await h(req(input()),r);assert.equal(r.code,200);assert.equal(r.headers['Cache-Control'],'no-store');assert.equal(r.body.text,undefined);
 for(let i=0;i<2;i++){r=res();await h(req({...input(),receipt:String.fromCharCode(66+i).repeat(43)}),r);assert.equal(r.code,200);}
 r=res();await h(req({...input(),receipt:'Z'.repeat(43)}),r);assert.equal(r.code,429);assert.equal(store.data.size,3);assert.equal(JSON.stringify([...slots]).includes('192.0.2.7'),false);
});
test('blob adapter reads private origin data and enforces conditional replacement',async()=>{
 const {makeStore}=require('../lib/community-blob.cjs');class Missing extends Error{}class Conflict extends Error{}const calls=[];
 const sdk={BlobNotFoundError:Missing,BlobPreconditionFailedError:Conflict,get:async(p,o)=>{calls.push(o);return {statusCode:200,stream:new Response('{"version":1}').body,blob:{etag:'v1',size:13,contentType:'application/json'}}},put:async(p,s,o)=>{calls.push(o);if(o.ifMatch==='stale')throw new Conflict();}};
 const store=makeStore(sdk);assert.deepEqual((await store.read('path')).value,{version:1});assert.deepEqual(calls[0],{access:'private',useCache:false});await store.replace('path',{},'v1');assert.equal(calls[1].ifMatch,'v1');assert.equal(calls[1].access,'private');await assert.rejects(()=>store.replace('path',{},'stale'),e=>e.code==='CONFLICT');
 sdk.get=async()=>{throw new Missing()};assert.equal(await store.read('path'),null);sdk.get=async()=>{throw Error('outage')};await assert.rejects(()=>store.read('path'));
});
test('daily cleanup follows original expiry across pages and isolates namespaces',async()=>{
 const {cleanupCommunity}=require('../lib/community-cleanup.cjs'),removed=[],time=now().getTime(),old='community-private/v1/'+'a'.repeat(64)+'.json',fresh='community-private/v1/'+'b'.repeat(64)+'.json',second='community-private/v1/'+'c'.repeat(64)+'.json';let pages=0;
 const list=async({prefix,cursor})=>{if(prefix==='community-private/v1/'){pages++;return cursor?{blobs:[{pathname:second,uploadedAt:new Date(time)}],hasMore:false}:{blobs:[{pathname:old,uploadedAt:new Date(time)},{pathname:fresh,uploadedAt:new Date(time-30*86400000)},{pathname:'responses/not-community',url:'foreign',uploadedAt:new Date(0)}],hasMore:true,cursor:'next'}}return {blobs:[{pathname:prefix+'old-rate',url:'rate',uploadedAt:new Date(time-3*86400000)}],hasMore:false}};
 const store={read:async p=>({value:{expiresAt:p===fresh?'2026-10-20T12:00:00Z':'2026-10-14T12:00:00Z'},etag:'current-v2'}),remove:async(p,e)=>{assert.equal(e,'current-v2');removed.push(p)}};
 assert.equal(await cleanupCommunity({list,del:async urls=>removed.push(...urls),store,now:time}),3);assert.deepEqual(removed,[old,second,'rate']);assert.equal(pages,2);
});
test('two simultaneous withdrawals cannot overwrite or restore question text',async()=>{
 const store=memory(),replace=store.replace;let writes=0;store.replace=async(...args)=>{await replace(...args);writes++};const b=input(),s=makeService({store,secret,now});await s.run(b);
 const results=await Promise.all([s.run({...b,action:'withdraw'}),s.run({...b,action:'withdraw'})]);assert.deepEqual(results.map(r=>r.status),['withdrawn','withdrawn']);assert.equal(writes,1);assert.equal(store.data.get(pathFor(secret,b.receipt)).value.content,undefined);
});
test('synthetic client-to-API-to-review-to-receipt-to-withdraw flow preserves privacy',async()=>{
 const {makeReviewer,replyHash,normalizeReply}=require('../lib/community-review.cjs'),{createClient}=require('../dist/community-intake-client.js'),{webcrypto}=require('node:crypto');
 const store=memory(),handler=makeHandler({store,quotaPut:async()=>{},env:config,now}),client=createClient({cryptoImpl:webcrypto,online:()=>true,fetchImpl:async(url,options)=>{assert.equal(url,'/api/community');const result=res();await handler(req(JSON.parse(options.body)),result);return {status:result.code,json:async()=>result.body}}});
 const b=input(),receipt=client.begin({...b},{adult:true,review:true,ai:false});assert.equal((await client.send()).status,'received');const key=pathFor(secret,receipt).split('/').at(-1).replace('.json',''),reviewer=makeReviewer({store,now});
 await assert.rejects(()=>reviewer.aiPacket(key,{redactedText:'A question',redactionConfirmed:true,editorId:'editor'}));
 const reply=normalizeReply({en:'Fictional reviewed response',my:'မေးမြန်းပါ။',sources:['https://example.org/source']});await reviewer.approveReply(key,reply,{reviewerKind:'human',editorId:'private-editor',privacyChecked:true,sourcesChecked:true,myanmarChecked:true,contentHash:replyHash(reply)});
 const status=await client.check(receipt);assert.equal(status.status,'answered');assert.deepEqual(status.reply,reply);assert.equal(JSON.stringify(status).includes(b.text),false);assert.equal(JSON.stringify(status).includes('private-editor'),false);
 assert.equal((await client.withdraw(receipt)).status,'withdrawn');assert.deepEqual(await client.check(receipt),{status:'withdrawn'});assert.equal(store.data.get(pathFor(secret,receipt)).value.reply,undefined);
});
test('private deletion adapter passes the exact version and maps stale deletion to conflict',async()=>{
 const {makeStore}=require('../lib/community-blob.cjs');class Conflict extends Error{}const calls=[],store=makeStore({BlobPreconditionFailedError:Conflict,del:async(p,o)=>{calls.push({p,o});if(o.ifMatch==='stale')throw new Conflict()}});await store.remove('community-private/v1/key.json','v2');assert.deepEqual(calls[0],{p:'community-private/v1/key.json',o:{ifMatch:'v2'}});await assert.rejects(()=>store.remove('community-private/v1/key.json','stale'),e=>e.code==='CONFLICT');
});
test('closing new intake preserves status and withdrawal of existing receipts',async()=>{
 const store=memory(),b=input();let current=config();const handler=makeHandler({store,quotaPut:async()=>{},env:()=>current,now});let r=res();await handler(req(b),r);assert.equal(r.body.status,'received');
 current={...current,COMMUNITY_INTAKE_ENABLED:'false',COMMUNITY_REVIEW_READY:''};r=res();await handler(req({...b,receipt:'Z'.repeat(43)}),r);assert.equal(r.code,503);assert.equal(r.body.status,'closed');assert.equal(store.data.size,1);
 r=res();await handler(req({version:1,action:'status',receipt:b.receipt}),r);assert.equal(r.code,200);assert.equal(r.body.status,'received');
 r=res();await handler(req({version:1,action:'withdraw',receipt:b.receipt}),r);assert.equal(r.code,200);assert.equal(r.body.status,'withdrawn');assert.equal(store.data.get(pathFor(secret,b.receipt)).value.content,undefined);
});
