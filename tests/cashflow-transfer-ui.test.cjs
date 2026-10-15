const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const transfer=require('../dist/cashflow-transfer.js');
function app(){
 const nodes=new Map(),listeners={};let focused='';
 function node(id){const n={id,dataset:{},value:'',checked:false,disabled:false,textContent:'',setAttribute(){},focus(){focused=id;},remove(){nodes.delete(this.id);},replaceChildren(){this.empty=true;},before(child){nodes.set(child.id,child);},querySelector(){return {setAttribute(){},focus(){focused='offer-heading';}};}};nodes.set(id,n);return n;}
 for(const id of ['cashflow-form','cash-cash','cash-daily','cash-results','cash-error'])node(id);
 const doc={getElementById:id=>nodes.get(id),querySelector:s=>s==='[data-cash-transfer-use]'?nodes.get('use'):null,addEventListener:(k,f)=>listeners[k]=f,createElement:()=>node('temporary')};
 const cash={values:{days:'7'},result:{old:true},error:true},spending={period:'today',result:{available:100000,costs:20000,remaining:80000}};
 const context={document:doc,window:{addEventListener:(k,f)=>listeners[k]=f,LiftCashTransferCopy:{en:JSON.parse(fs.readFileSync('docs/learning/transfer-copy-en.json','utf8'))}},LiftI18n:{locale:'en'},LiftCashflowTransfer:transfer,cashflowDraft:cash,spendingDraft:spending,escapeText:x=>x,spendingLabel:x=>x,cashAmount:x=>x/100};
 vm.runInNewContext(fs.readFileSync('dist/cashflow-transfer-ui.js','utf8'),context);
 function click(selector){listeners.click({target:{closest:s=>s.split(',').includes(selector)?{}:null}});}
 function confirmation(value){const n=node('cash-transfer-confirm');n.checked=value;node('use').disabled=true;listeners.change({target:n});}
 return {nodes,node,cash,spending,click,confirmation,leave(){listeners.hashchange();},get focused(){return focused;},input(id){listeners.input({target:{matches:s=>s.split(',').includes(id)}});}};
}
test('UI handoff never fills cash without explicit checkbox and action',()=>{const a=app();a.click('[data-cash-open]');assert.ok(a.nodes.has('cash-transfer-offer'));a.click('[data-cash-transfer-use]');assert.equal(a.cash.values.cash,undefined);a.confirmation(true);a.click('[data-cash-transfer-use]');assert.equal(a.cash.values.cash,'800.00');assert.equal(JSON.stringify(a.cash.values),JSON.stringify({days:'7',cash:'800.00'}));assert.equal(a.nodes.get('cash-cash').value,'800.00');assert.equal(a.focused,'cash-daily');assert.equal(a.nodes.has('cash-transfer-offer'),false);assert.ok(a.nodes.has('cash-transfer-status'));a.input('#cash-cash');assert.equal(a.nodes.has('cash-transfer-status'),false);});
test('manual alternative and changed source cannot apply a stale proposal',()=>{const a=app();a.click('[data-cash-open]');a.click('[data-cash-transfer-own]');assert.equal(a.cash.values.cash,undefined);assert.equal(a.focused,'cash-cash');a.click('[data-cash-open]');a.confirmation(true);a.spending.result={available:100000,costs:30000,remaining:70000};a.click('[data-cash-transfer-use]');assert.equal(a.cash.values.cash,undefined);a.input('[data-spending-input]');assert.equal(a.nodes.has('cash-transfer-offer'),false);});
test('reopening never overwrites an existing zero or manual amount',()=>{for(const cash of ['0','55']){const a=app();a.cash.values.cash=cash;a.click('[data-cash-open]');assert.equal(a.nodes.has('cash-transfer-offer'),false);a.confirmation(true);a.click('[data-cash-transfer-use]');assert.equal(a.cash.values.cash,cash);}});

test('leaving a route discards unaccepted confirmation',()=>{const a=app();a.click('[data-cash-open]');a.confirmation(true);a.leave();a.click('[data-cash-transfer-use]');assert.equal(a.cash.values.cash,undefined);assert.equal(a.nodes.has('cash-transfer-offer'),false);});
