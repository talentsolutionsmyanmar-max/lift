const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root=require('node:path').join(__dirname,'..');
function load(saved=null,denied=false){
 const writes=[],context={window:null,localStorage:{getItem(){if(denied)throw Error('blocked');return saved;},setItem(k,v){if(denied)throw Error('blocked');writes.push([k,v]);}}};context.window=context;
 vm.createContext(context);vm.runInContext(fs.readFileSync(root+'/dist/myanmar.js','utf8'),context);vm.runInContext(fs.readFileSync(root+'/dist/i18n.js','utf8'),context);
 return {api:context.LiftI18n,writes};
}
test('locale is bounded and denied storage never blocks the planner',()=>{
 assert.equal(load('garbage').api.locale,'en');assert.equal(load('my').api.locale,'my');const {api}=load(null,true);api.setLocale('my');assert.equal(api.locale,'my');api.setLocale('unexpected');assert.equal(api.locale,'en');
});
test('language preference writes only its own key and static copy translates reversibly',()=>{
 const {api,writes}=load();const source='My next steps';assert.equal(api.t(source),source);api.setLocale('my');assert.match(api.t(source),/[\u1000-\u109f]/);assert.deepEqual(writes,[['lift-language-v1','my']]);api.setLocale('en');assert.equal(api.t(source),source);
});
test('all supplied copy has reviewed translations with intact placeholders',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(root+'/dist/myanmar.js','utf8'),context);const catalogue=context.window.LiftMyanmar;
 for(const source of JSON.parse(fs.readFileSync(root+'/docs/english-copy-inventory.json','utf8'))){assert.equal(typeof catalogue[source],'string',source);assert.ok(catalogue[source].length,source);assert.deepEqual((source.match(/\{\w+\}/g)||[]).sort(),(catalogue[source].match(/\{\w+\}/g)||[]).sort(),source);}
});
test('exports translate suggestions while keeping user-provided goals and steps byte-for-byte',()=>{
 const context={window:null,localStorage:{getItem:()=>null,setItem:()=>{}},state:{plan:'work',checked:[0],goal:'Save — ကိုယ်ပိုင် goal <>&',edits:{0:{title:'Edit',detail:'My next steps'}},custom:[{title:'Support',detail:'အတိအကျ'}]},plans:{work:{title:'Explore a work opportunity',tasks:[['Choose one information source','Prepare your questions'],['Gather your own records','Pick a week or month that feels manageable.'],['Prepare your questions','Choose a small first step'],['Choose one practical next step','Choose your next conversation']]}},preparationItems:[]};context.window=context;vm.createContext(context);
 for(const file of ['myanmar.js','i18n.js','planner.js'])vm.runInContext(fs.readFileSync(root+'/dist/'+file,'utf8'),context);
 const extras=fs.readFileSync(root+'/dist/extras.js','utf8');vm.runInContext(extras.slice(extras.indexOf('function preparationText()'),extras.indexOf('let offlineReady')),context);context.LiftI18n.setLocale('my');const result=context.exportText();assert.ok(result.includes(context.state.goal));assert.ok(result.includes('Edit\nMy next steps'));assert.ok(result.includes('Support\nအတိအကျ'));assert.ok(!result.includes('Gather your own records'));assert.match(result,/[\u1000-\u109f]/);
});
test('page requests browser translation stay off so native locale is not back-translated',()=>{
 const html=fs.readFileSync(root+'/dist/index.html','utf8');
 assert.match(html,/<html[^>]+translate="no"[^>]+class="notranslate"/);
 assert.ok(html.includes('<meta name="google" content="notranslate">'));
});
