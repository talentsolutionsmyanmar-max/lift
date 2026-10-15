const {test}=require('node:test'),assert=require('node:assert/strict'),{makeHandler}=require('../api/check-evaluation.js');
const response=()=>({code:0,setHeader(){},status(code){this.code=code;return this},json(value){this.body=value;return this}});
const request=body=>({method:'POST',headers:{'content-type':'application/json',authorization:'Bearer synthetic-test-token'},body});
test('synthetic evaluation is unavailable outside preview without calling a provider',async()=>{let calls=0;for(const VERCEL_ENV of ['production','development',undefined]){const res=response();await makeHandler({env:{VERCEL_ENV},fetcher:async()=>{calls++}})(request({fixtureId:'extension-fee',model:'meta/llama-4-maverick',language:'my'}),res);assert.equal(res.code,404)}assert.equal(calls,0)});
test('evaluation refuses arbitrary content, image, model and unknown fixture',async()=>{let calls=0;const run=makeHandler({env:{VERCEL_ENV:'preview',LIFT_EVAL_TOKEN:'synthetic-test-token',LIFT_EVAL_EXPIRES:String(Date.now()+60000)},fetcher:async()=>{calls++}});for(const patch of [{text:'private'},{image:'private'},{model:'other/provider'},{fixtureId:'unknown'}]){const res=response();await run(request({fixtureId:'extension-fee',model:'meta/llama-4-maverick',language:'my',...patch}),res);assert.equal(res.code,400)}assert.equal(calls,0)});
test('evaluation never substitutes a local answer without credentials',async()=>{const res=response();await makeHandler({env:{VERCEL_ENV:'preview',LIFT_EVAL_TOKEN:'synthetic-test-token',LIFT_EVAL_EXPIRES:String(Date.now()+60000)},counter:new Map()})(request({fixtureId:'extension-fee',model:'meta/llama-4-maverick',language:'my'}),res);assert.equal(res.code,503);assert.equal(res.body.error,'configuration')});

test('expired or unauthorised preview access cannot call a provider',async()=>{let calls=0;for(const patch of [{LIFT_EVAL_TOKEN:'another-token'},{LIFT_EVAL_EXPIRES:'1'},{LIFT_EVAL_EXPIRES:'invalid'}]){const res=response();await makeHandler({env:{VERCEL_ENV:'preview',LIFT_EVAL_TOKEN:'synthetic-test-token',LIFT_EVAL_EXPIRES:String(Date.now()+60000),...patch},fetcher:async()=>{calls++}})(request({fixtureId:'extension-fee',model:'meta/llama-4-maverick',language:'my'}),res);assert.equal(res.code,401)}assert.equal(calls,0)});

test('synthetic fixture labels are unique and exact spans of their input',()=>{
 const fixtures=require('../lib/checker/evaluation-fixtures.json');
 assert.ok(fixtures.length>=20);
 assert.equal(new Set(fixtures.map(f=>f.id)).size,fixtures.length);
 for(const fixture of fixtures)for(const span of [...fixture.expectedDates,...fixture.expectedAmounts])assert.ok(fixture.text.includes(span),fixture.id);
});

test('failed synthetic comparisons retain source states without returning partial model answers',async()=>{
 const core=require('../lib/checker/core.cjs');let calls=0;
 const extracted={summary:'Synthetic notice only.',transcript:'',dates:[],amounts:[],documents:[],claims:[],uncertainty:[]};
 const fetcher=async url=>{
  if(url.includes('ai-gateway')){calls++;return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:calls===1?JSON.stringify(extracted):'invalid model JSON'}}]})}}
  return {ok:true,text:async()=>core.sources.flatMap(s=>[...s.markers,s.excerpt.replace(/\n/g,' ')]).join(' ')};
 };
 const env={VERCEL_ENV:'preview',LIFT_EVAL_TOKEN:'synthetic-test-token',LIFT_EVAL_EXPIRES:String(Date.now()+60000),VERCEL_OIDC_TOKEN:'test'};
 const res=response();await makeHandler({env,fetcher,counter:new Map()})(request({fixtureId:'pink-card',model:'meta/llama-4-maverick',language:'en'}),res);
 assert.equal(res.code,503);assert.equal(res.body.stage,'compare');assert.equal(res.body.category,'invalid_json');assert.equal(res.body.result,undefined);
 assert.equal(res.body.sourceStates.length,3);assert.ok(res.body.sourceStates.every(s=>Object.keys(s).sort().join(',')==='id,state'));
 assert.equal(res.body.sourceStates.find(s=>s.id==='forms').state,'available');
});

test('authorised evaluation metadata checks fixed sources without invoking a model',async()=>{
 const core=require('../lib/checker/core.cjs');let calls=0;
 const fetcher=async url=>{assert.ok(!url.includes('ai-gateway'));calls++;return {ok:true,text:async()=>core.sources.flatMap(s=>[...s.markers,s.excerpt.replace(/\n/g,' ')]).join(' ')}};
 const env={VERCEL_ENV:'preview',LIFT_EVAL_TOKEN:'synthetic-test-token',LIFT_EVAL_EXPIRES:String(Date.now()+60000)};
 const res=response();await makeHandler({env,fetcher})({...request(),method:'GET'},res);
 assert.equal(res.code,200);assert.equal(calls,3);assert.equal(res.body.sourceStates.length,3);assert.ok(res.body.sourceStates.every(s=>Object.keys(s).sort().join(',')==='id,state'));assert.equal(res.body.configured,false);
});
