const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function setup(share){
 const status={textContent:''},button={disabled:false,isConnected:true};
 const ctx={window:{LiftMyanmar:{}},LiftI18n:{locale:'en',t:s=>s},navigator:share?{share}:{},icons:{},document:{addEventListener(){},getElementById:()=>status,querySelector:()=>button}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist/everyday-ui.js'),'utf8'),ctx);
 vm.runInContext("everydaySelected=['housing1','phone2'];",ctx);
 return {ctx,status,button,run:()=>vm.runInContext('shareEverydayQuestions()',ctx)};
}
test('sharing exports only selected fixed questions, without plan, amounts, files or URL',async()=>{
 let payload;const s=setup(async data=>{payload=data;});await s.run();
 assert.deepEqual(Object.keys(payload).sort(),['text','title']);
 assert.match(payload.text,/including utilities/);assert.match(payload.text,/renew automatically/);assert.doesNotMatch(payload.text,/last return service/);
 assert.match(s.status.textContent,/does not confirm/);assert.equal(s.button.disabled,false);
});
test('missing or failed share uses manual fallback, cancellation stays quiet',async()=>{
 const absent=setup();await absent.run();assert.match(absent.status.textContent,/copy or download/);
 const failed=setup(async()=>{throw Object.assign(Error(),{name:'NotAllowedError'});});await failed.run();assert.match(failed.status.textContent,/copy or download/);
 const cancelled=setup(async()=>{throw Object.assign(Error(),{name:'AbortError'});});await cancelled.run();assert.equal(cancelled.status.textContent,'');
});
test('empty selection, duplicate taps and changed selection do not trigger misleading outcomes',async()=>{
 let finish,calls=0;const s=setup(()=>{calls++;return new Promise(resolve=>finish=resolve)});
 const first=s.run();await s.run();assert.equal(calls,1);assert.equal(s.button.disabled,true);
 vm.runInContext('everydaySelected=[];',s.ctx);finish();await first;assert.equal(s.status.textContent,'');assert.equal(s.button.disabled,true);
 await s.run();assert.equal(calls,1);
});
