const test=require('node:test'),assert=require('node:assert/strict'),{render}=require('../dist/community-intake-ui.js'),copy=require('../docs/community/intake-copy-en.json');
const state=()=>({mode:'consent',enabled:true,busy:false,locale:'en',consents:{adult:false,consent:false,ai:false},lookup:'',receipt:'A'.repeat(43),view:null});
test('consent starts unchecked and sending needs the two required choices, never AI opt-in',()=>{
 let s=state(),html=render(copy,s);assert.equal((html.match(/type="checkbox"/g)||[]).length,3);assert.doesNotMatch(html,/ checked/);assert.match(html,/data-intake-action="send" disabled/);s.consents.adult=s.consents.consent=true;html=render(copy,s);assert.doesNotMatch(html,/data-intake-action="send" disabled/);assert.doesNotMatch(html,/data-intake-consent="ai" checked/);
 s.enabled=false;assert.match(render(copy,s),/data-intake-action="send" disabled/);
});
test('receipt and reply text are escaped and withdrawal requires a separate confirmation',()=>{
 const s={...state(),mode:'receipt',receipt:'<script>not-code</script>',view:{status:'answered',reply:{en:'<img src=x onerror=alert(1)>',my:'မေးမြန်းပါ။',sources:['https://example.org/source']}}};const html=render(copy,s);assert.doesNotMatch(html,/<script>|<img/);assert.match(html,/&lt;img/);assert.match(html,/data-intake-action="withdraw"/);assert.doesNotMatch(html,/data-intake-action="confirm-withdraw"/);
 s.mode='confirm-withdraw';const confirm=render(copy,s);assert.match(confirm,/data-intake-action="confirm-withdraw"/);assert.match(confirm,/data-intake-action="check"/);
});
test('terminal withdrawal removes reply and further withdrawal action from the view',()=>{
 const s={...state(),mode:'receipt',view:{status:'withdrawn'}};const html=render(copy,s);assert.doesNotMatch(html,/intake-reply|data-intake-action="withdraw"/);assert.match(html,/has been withdrawn/);
});
test('reply view refuses active URL schemes even if called outside the client parser',()=>{
 const s={...state(),mode:'receipt',view:{status:'answered',reply:{en:'Reply',my:'မေးမြန်းပါ။',sources:['javascript:alert(1)','https://example.org/source']}}};const html=render(copy,s);assert.doesNotMatch(html,/href="javascript:/);assert.match(html,/https:\/\/example.org\/source/);
});
test('lookup remains enabled for existing receipts when new submissions close',()=>{
 const s={...state(),enabled:false,receiptsEnabled:true,mode:'lookup'};assert.doesNotMatch(render(copy,s),/data-intake-action="check" disabled/);
 s.receiptsEnabled=false;assert.match(render(copy,s),/data-intake-action="check" disabled/);
});
test('receipt recovery requires a check action, remembering is explicit, and test mode never saves',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),workflowCopy={en:require('../docs/ux/workflow-copy-en.json')};
 async function run(testOnly){const events={},feedback={textContent:''},code='b'.repeat(43);let checks=0,saves=0,loads=0;const root={LIFT_TEAM_TEST:testOnly,LiftWorkflowCopy:workflowCopy,LiftCommunityIntakeClient:{validReceipt:value=>value===code}};const ctx={window:root,URL,Blob,setTimeout};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../dist/community-intake-ui.js'),'utf8'),ctx);const element={classList:{add(){}},innerHTML:'',querySelector:()=>feedback,addEventListener:(type,fn)=>events[type]=fn,removeEventListener(){},replaceChildren(){}};root.LiftCommunityIntakeUI.mount(element,{copy,locale:'en',enabled:false,receiptsEnabled:true,initialMode:'lookup',receiptStore:{load(){loads++;return code;},save(){saves++;return true;},forget(){return true;}},clientFactory:()=>({check:async()=>{checks++;return {status:'received'};}})});assert.equal(checks,0);assert.equal(saves,0);if(testOnly){assert.equal(loads,0);events.input({target:{matches:()=>true,value:code}});}else assert.equal(loads,1);const click=action=>events.click({target:{closest:()=>({dataset:{intakeAction:action}})},preventDefault(){}});await click('check');assert.equal(checks,1);await click('remember');assert.equal(saves,testOnly?0:1);if(testOnly){assert.match(element.innerHTML,/Test only/);assert.doesNotMatch(element.innerHTML,/data-intake-action="remember"/);}else assert.equal(feedback.textContent,workflowCopy.en.receiptSaved);}
 await run(false);await run(true);
});
