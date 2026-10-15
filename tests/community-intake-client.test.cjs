const test=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto'),{createClient,parseResponse}=require('../dist/community-intake-client.js');
const draft={kind:'question',topic:'family',text:'Fictional family question',language:'my'},consent={adult:true,review:true,ai:false};
const received={ok:true,status:'received',submittedAt:'2026-10-15T12:00:00Z',expiresAt:'2026-10-29T12:00:00Z'};
test('client generates secret receipts, snapshots consent, never uses a URL query or auto-saves',async()=>{
 const calls=[],client=createClient({cryptoImpl:webcrypto,online:()=>true,fetchImpl:async(...args)=>{calls.push(args);return {status:200,json:async()=>received}}});const code=client.begin(draft,consent);assert.match(code,/^[A-Za-z0-9_-]{43}$/);assert.equal(calls.length,0);assert.equal((await client.send()).status,'received');assert.equal(calls[0][0],'/api/community');const options=calls[0][1];assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');assert.equal(JSON.parse(options.body).consentToAI,false);assert.equal(JSON.parse(options.body).receipt,code);assert.throws(()=>client.begin(draft,consent));
});
test('uncertain submission retains the same receipt and snapshot for manual status/retry',async()=>{
 let fail=true;const bodies=[],client=createClient({cryptoImpl:webcrypto,online:()=>true,fetchImpl:async(url,o)=>{bodies.push(JSON.parse(o.body));if(fail)throw Error('network');return {status:200,json:async()=>received}}});const code=client.begin(draft,consent);assert.equal((await client.send()).status,'unavailable');assert.equal(client.receipt(),code);fail=false;assert.equal((await client.check(code)).status,'received');assert.equal(bodies[1].action,'status');assert.equal(bodies[1].text,undefined);assert.equal((await client.send()).status,'received');assert.equal(bodies[2].receipt,code);assert.equal(bodies[2].text,draft.text);
});
test('offline prevents sending and simultaneous taps do not duplicate a request',async()=>{
 let requests=0,finish;const client=createClient({cryptoImpl:webcrypto,online:()=>false,fetchImpl:async()=>{requests++}});client.begin(draft,consent);assert.equal((await client.send()).status,'offline');assert.equal(requests,0);
 const active=createClient({cryptoImpl:webcrypto,online:()=>true,fetchImpl:()=>new Promise(resolve=>{requests++;finish=resolve})});active.begin(draft,consent);const first=active.send();await assert.rejects(()=>active.send());finish({status:200,json:async()=>received});await first;assert.equal(requests,1);assert.equal(active.isBusy(),false);
});
test('client rejects false success and unsafe private reply DTOs',()=>{
 for(const value of [{status:'received',ok:true},{...received,ok:false},{...received,status:'answered',reply:{en:'Answer',my:'မေးခွန်း',sources:['javascript:alert(1)']},reviewedAt:'2026-10-15T12:00:00Z'},{status:'withdrawn',ok:false}])assert.throws(()=>parseResponse(value));
 assert.deepEqual(parseResponse({status:'closed',ok:false}),{status:'closed'});
});
test('stalled send times out, aborts and retains the receipt without automatic resend',async()=>{
 let calls=0,signal,finish;
 const client=createClient({cryptoImpl:webcrypto,online:()=>true,timeoutMs:10,fetchImpl:(url,options)=>{calls++;signal=options.signal;return new Promise(resolve=>{finish=resolve});}});
 const code=client.begin(draft,consent);assert.deepEqual(await client.send(),{status:'unavailable'});
 assert.equal(signal.aborted,true);assert.equal(client.isBusy(),false);assert.equal(client.receipt(),code);assert.equal(calls,1);
 finish({status:200,json:async()=>received});await Promise.resolve();assert.equal(client.isBusy(),false);assert.equal(calls,1);
});
test('deadline includes a stalled JSON body and status can be checked manually afterward',async()=>{
 let calls=0,completeBody;
 const client=createClient({cryptoImpl:webcrypto,online:()=>true,timeoutMs:10,fetchImpl:async()=>{calls++;return calls===1?{status:200,json:()=>new Promise(resolve=>{completeBody=resolve})}:{status:200,json:async()=>received};}});
 const code=client.begin(draft,consent);assert.equal((await client.send()).status,'unavailable');assert.equal((await client.check(code)).status,'received');
 completeBody(received);await Promise.resolve();assert.equal(calls,2);assert.equal(client.receipt(),code);
});
