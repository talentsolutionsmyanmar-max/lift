const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
for(const [tool,copy] of [['spending','daily-spending-copy'],['everyday','everyday-questions']]){
 test(`${tool} keeps reviewed contextual Myanmar labels despite shared dictionary collisions`,()=>{
  const root=path.resolve(__dirname,'..'), en=JSON.parse(fs.readFileSync(path.join(root,`docs/${copy}-en.json`))), my=JSON.parse(fs.readFileSync(path.join(root,`docs/${copy}-my.json`)));
  const context={window:{LiftMyanmar:{}},LiftI18n:{locale:'my',t:s=>s},icons:{},document:{addEventListener(){}}};vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,`dist/${tool}-ui.js`),'utf8'),context);
  for(const key of Object.keys(en))context.window.LiftMyanmar[en[key]]='wrong shared translation';
  for(const key of Object.keys(en))assert.equal(vm.runInContext(`${tool}Label(${JSON.stringify(key)})`,context),my[key]);
  context.LiftI18n.locale='en';
  for(const key of Object.keys(en))assert.equal(vm.runInContext(`${tool}Label(${JSON.stringify(key)})`,context),en[key]);
 });
}
test('everyday topic position survives rerender and language changes, and clear removes it',()=>{
 const callbacks={},context={window:{LiftMyanmar:{}},LiftI18n:{locale:'en',t:s=>s},icons:{},document:{addEventListener(type,fn){(callbacks[type]??=[]).push(fn)},querySelector(){return null}},heading:()=>'',icon:()=>'',phaseOneTools:{title:'Language'},route(){}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../dist/everyday-ui.js'),'utf8'),context);
 const toggle=callbacks.toggle[0];
 toggle({target:{dataset:{everydayTopic:'housing'},open:true}});
 assert.match(vm.runInContext('everydayPage()',context),/data-everyday-topic="housing" open/);
 context.LiftI18n.locale='my';
 assert.match(vm.runInContext('everydayPage()',context),/data-everyday-topic="housing" open/);
 toggle({target:{dataset:{everydayTopic:'housing'},open:false}});
 assert.doesNotMatch(vm.runInContext('everydayPage()',context),/data-everyday-topic="housing" open/);
 toggle({target:{dataset:{everydayTopic:'transport'},open:true}});
 callbacks.click[0]({target:{closest:()=>({dataset:{action:'confirm-clear'}})}});
 assert.equal(vm.runInContext('everydayOpenTopics.size',context),0);
});
