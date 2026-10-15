const {test}=require('node:test');const assert=require('node:assert/strict');const core=require('../lib/checker/core.cjs');const {makeHandler,refreshSources}=require('../api/check.js');
const valid={text:'A notice says TM.47 extends my stay.',language:'en',consent:true};
const res=()=>({code:0,headers:{},setHeader(k,v){this.headers[k]=v},status(c){this.code=c;return this},json(v){this.body=v;return this}});
const req=body=>({method:'POST',headers:{origin:'https://lift-next-step.vercel.app','content-type':'application/json'},body});
const store={put:async()=>({}),head:async()=>{throw Error('missing')}};
test('checker rejects remote images, fake formats, missing consent and oversized input',()=>{
 for(const body of [{...valid,consent:false},{...valid,image:'https://example.com/a.png'},{...valid,image:'data:image/png;base64,'+Buffer.from('not an image at all').toString('base64')},{...valid,text:'x'.repeat(6001)}])assert.throws(()=>core.validateInput(body));
 assert.equal(core.validateInput({...valid,unknown:'ignored'}).unknown,undefined);
});
test('unknown sources and invented passages cannot produce supported findings',()=>{
 const v={claims:[{claim:'Any worker can work anywhere',kind:'personal_eligibility',finding:'supported',reason:'x',evidence:[{sourceId:'forms',quote:'Every worker can work anywhere'}]},{claim:'Another claim',finding:'supported',evidence:[{sourceId:'unknown',quote:'Extension of Temporary Stay'}]}],actions:['Check the service name'],questions:[]};
 const clean=core.cleanReport(v,core.sources);assert.deepEqual(clean.claims.map(c=>c.finding),['unverified','unverified']);
 v.claims[0].kind='form_identity';v.claims[0].evidence=[{sourceId:'forms',quote:'Extension of Temporary Stay'}];assert.equal(core.cleanReport(v,core.sources).claims[0].finding,'supported');
 assert.equal(core.cleanReport(v,[]).claims[0].finding,'unverified');
});
test('expired or changed source pages are withheld from evidence',async()=>{
 const expired=await refreshSources(async()=>{throw Error('should not fetch')},Date.parse('2026-10-22'));assert.ok(expired.every(s=>s.state==='expired'));
 const changed=await refreshSources(async()=>({ok:true,text:async()=>'<html>different page</html>'}),Date.parse('2026-10-14'));assert.ok(changed.every(s=>s.state==='unavailable'));
});
test('checker keeps inputs out of stored objects and requires both model stages',async()=>{
 const writes=[],calls=[];const extraction={summary:'The message makes an unverified promise.',transcript:'',dates:[],amounts:[],documents:['TM.47'],claims:['TM.47 extends stay'],uncertainty:['Personal eligibility unknown']};
 const comparison={claims:[{claim:'TM.47 extends stay',kind:'form_identity',finding:'unverified',reason:'Sources distinguish forms.',evidence:[]}],uncertainty:['Fees unknown'],actions:['Pay after 20 October'],questions:['What is your passport number?']};
 const fetcher=async(url,opts)=>{if(url.includes('ai-gateway')){const b=JSON.parse(opts.body);calls.push(b);return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(calls.length===1?extraction:comparison)}}]})}}return {ok:true,text:async()=>core.sources.flatMap(s=>[...s.markers,s.excerpt.replace(/\n/g,' ')]).join(' ')}};
 const handler=makeHandler({fetcher,store:{put:async(path,body,options)=>{writes.push({path,body,options})},head:store.head},env:{VERCEL_OIDC_TOKEN:'test',SURVEY_RATE_SECRET:'test'}});const out=res();await handler(req(valid),out);
 assert.equal(out.code,200);assert.equal(calls.length,2);assert.equal(calls[0].providerOptions.gateway.zeroDataRetention,true);assert.equal(calls[0].model,core.MODEL);assert.ok(writes.every(w=>w.body==='{}'&&w.options.access==='private'&&w.path.startsWith('check-limits/')));assert.ok(!JSON.stringify(writes).includes(valid.text));assert.ok(out.body.uncertainty.includes('Personal eligibility unknown'));assert.equal(out.body.preparationOrigin,'fixed_checklist_v1');assert.ok(!out.body.actions.includes('Pay after 20 October'));assert.ok(!out.body.questions.includes('What is your passport number?'));
});
test('foreign origins, missing credentials and provider errors cannot return fabricated answers',async()=>{
 const empty=makeHandler({env:{}});let out=res();await empty(req(valid),out);assert.equal(out.code,503);
 out=res();await empty({...req(valid),headers:{origin:'https://evil.example','content-type':'application/json'}},out);assert.equal(out.code,403);
 const fail=makeHandler({env:{VERCEL_OIDC_TOKEN:'test',SURVEY_RATE_SECRET:'test'},store,fetcher:async()=>({ok:false,status:402})});out=res();await fail(req(valid),out);assert.equal(out.code,503);assert.equal(out.body.ok,undefined);
});

test('a valid citation cannot verify fees or eligibility under this source scope',()=>{
 const report={claims:[{claim:'A fee is correct',kind:'fees',finding:'supported',evidence:[{sourceId:'forms',quote:'Extension of Temporary Stay'}],reason:'x'}],actions:[],questions:[]};
 assert.equal(core.cleanReport(report,core.sources).claims[0].finding,'unverified');assert.deepEqual(core.cleanReport(report,core.sources).claims[0].evidence,[]);
});
test('Myanmar output cannot silently pass with an English-only explanation',()=>{
 const report={summary:'English only',claims:[],uncertainty:[],actions:[],questions:[]};assert.equal(core.hasRequestedLanguage(report,'my'),false);assert.equal(core.hasRequestedLanguage(report,'en'),true);
 report.summary="မြန်မာ";assert.equal(core.hasRequestedLanguage(report,'my'),true);
});

test('Myanmar generation is held before spending or calling a provider after failed semantic evaluation',async()=>{
 let calls=0;const handler=makeHandler({fetcher:async()=>{calls++;throw Error('must not call')},env:{}});const out=res();await handler(req({...valid,language:'my'}),out);assert.equal(out.code,503);assert.equal(out.body.stage,'language_quality');assert.equal(calls,0);
});

test('server validates schemas even when a provider uses JSON object mode',()=>{
 const value={summary:'x',transcript:'x',dates:[],amounts:[],documents:[],claims:[],uncertainty:[]};assert.doesNotThrow(()=>core.assertSchema(value,core.extractionSchema));
 for(const patch of [{dates:'bad'},{claims:Array(7).fill('x')},{unexpected:'x'}])assert.throws(()=>core.assertSchema({...value,...patch},core.extractionSchema),/model_shape/);
 const missing={...value};delete missing.summary;assert.throws(()=>core.assertSchema(missing,core.extractionSchema),/model_shape/);
});
test('JSON-mode completion supplies its schema and validates the returned object',async()=>{
 const {completion}=require('../api/check.js');let sent;const value={summary:'x',transcript:'x',dates:[],amounts:[],documents:[],claims:[],uncertainty:[]};
 const fetcher=async(_url,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(value)}}]})}};
 assert.deepEqual(await completion([{role:'user',content:'synthetic'}],core.extractionSchema,'test',fetcher,'not-real','meta/llama-4-maverick','json_object'),value);
 assert.equal(sent.response_format.type,'json_object');assert.ok(sent.messages[0].content.includes('additionalProperties'));assert.equal(sent.providerOptions.gateway.zeroDataRetention,true);
});
test('a reviewed PDF can supply evidence only while its exact bytes and review date still match',async()=>{
 const {createHash}=require('node:crypto'),bytes=Buffer.from('%PDF-synthetic-test'),source={id:'test-pdf',url:'https://fixed.example/form.pdf',format:'pdf',reviewBy:'2026-10-21',sha256:createHash('sha256').update(bytes).digest('hex'),excerpt:'fixed reviewed excerpt'};
 const fetcher=async()=>({ok:true,arrayBuffer:async()=>bytes});assert.equal((await refreshSources(fetcher,Date.parse('2026-10-14'),[source]))[0].state,'available');
 assert.equal((await refreshSources(async()=>({ok:true,arrayBuffer:async()=>Buffer.from('%PDF-changed')}),Date.parse('2026-10-14'),[source]))[0].state,'unavailable');
 assert.equal((await refreshSources(fetcher,Date.parse('2026-10-22'),[source]))[0].state,'expired');
});

test('text extraction rejects invented or normalised dates and amounts',()=>{
 const input={text:'Before 20 October 2026 pay 2,500 baht.',image:''};
 const extraction={summary:'A message requests payment',transcript:'',dates:['20 October 2026'],amounts:['2,500 baht'],documents:[],claims:[],uncertainty:[]};
 assert.doesNotThrow(()=>core.cleanExtraction(extraction,input));
 assert.throws(()=>core.cleanExtraction({...extraction,dates:['21 October 2026']},input),/extraction_fidelity/);
 assert.throws(()=>core.cleanExtraction({...extraction,amounts:['2500']},input),/extraction_fidelity/);
 // This guard cannot establish whether a model omitted a qualifier or an entire item.
});

test('public preparation checklist cannot inherit generated payment or date instructions',()=>{
 const raw={claims:[],actions:['Pay after 20 October'],questions:['What is your passport number?']};
 const result=core.withPreparationChecklist(raw,'en');
 assert.equal(result.preparationOrigin,'fixed_checklist_v1');
 assert.ok(!result.actions.includes(raw.actions[0]));
 assert.ok(!result.questions.includes(raw.questions[0]));
 assert.throws(()=>core.withPreparationChecklist(raw,'th'),/language_quality/);
 const my=core.withPreparationChecklist(raw,'my');assert.equal(my.actions.length,3);assert.ok(my.actions.every(s=>/[\u1000-\u109f]/.test(s)));
});

test('an invented extracted date stops processing before comparison or a successful response',async()=>{
 let gatewayCalls=0;
 const extraction={summary:'A message gives a date.',transcript:'',dates:['21 October 2026'],amounts:[],documents:[],claims:[],uncertainty:[]};
 const fetcher=async(url)=>{if(url.includes('ai-gateway')){gatewayCalls++;return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(extraction)}}]})}}return {ok:true,text:async()=>core.sources.flatMap(s=>[...s.markers,s.excerpt.replace(/\n/g,' ')]).join(' ')}};
 const handler=makeHandler({fetcher,store,env:{VERCEL_OIDC_TOKEN:'test',SURVEY_RATE_SECRET:'test'}}),out=res();
 await handler(req({...valid,text:'The message says 20 October 2026.'}),out);
 assert.equal(out.code,503);assert.equal(out.body.stage,'extract');assert.equal(out.body.category,'extraction_fidelity');assert.equal(gatewayCalls,1);assert.equal(out.body.ok,undefined);
});

test('out-of-scope claims cannot borrow valid source quotes to look substantiated',()=>{
 for(const kind of ['deadline','personal_eligibility','fees','other']){
  const report={claims:[{claim:'Unestablished claim',kind,finding:'unverified',reason:'Unknown',evidence:[{sourceId:'services',quote:'Notification of staying in the Kingdom for more than 90 days'}]}],actions:[],questions:[]};
  assert.deepEqual(core.cleanReport(report,core.sources).claims[0].evidence,[]);
 }
});
