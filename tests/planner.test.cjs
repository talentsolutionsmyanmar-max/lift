const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../dist/planner.js');
test('malformed and inherited storage cannot create tasks or a valid plan',()=>{
  assert.equal(core.normalize(null).plan,null);
  assert.equal(core.normalize({plan:'constructor',remember:'yes'}).plan,null);
  assert.equal(core.normalize({plan:'__proto__'}).plan,null);
  assert.equal(core.normalize({plan:'work',custom:[null,{},'bad']}).custom.length,0);
});
test('old saved plans migrate without inventing completion',()=>{
  const value=core.normalize({plan:'work',remember:true,checked:[0,0,3,4,-1,'2',Infinity]});
  assert.deepEqual(value.checked,[0,3]);
  assert.equal(value.version,2);
  assert.equal(value.remember,true);
});
test('custom task deletion keeps completion attached to the right remaining task',()=>{
  const state=core.normalize({plan:'work',custom:[{title:'First'},{title:'Second'}],checked:[0,4,5]});
  const next=core.removeCustom(state,4);
  assert.equal(next.custom[0].title,'Second');
  assert.deepEqual(next.checked,[0,4]);
  assert.deepEqual(core.removeCustom(state,0),state);
});
test('changing plan resets its private edits while keeping consent and preparation',()=>{
  const state=core.normalize({plan:'work',remember:true,goal:'A goal',edits:{0:{title:'Edited'}},custom:[{title:'Task'}],checked:[0,4],prep:[0,3]});
  const next=core.changePlan(state,'skills');
  assert.equal(next.remember,true);assert.deepEqual(next.prep,[0,3]);
  assert.deepEqual(next.checked,[]);assert.deepEqual(next.custom,[]);assert.equal(next.goal,'');
});
test('untrusted imported field sizes, task counts and checkmarks are bounded',()=>{
  const state=core.normalize({plan:'work',goal:'a'.repeat(500),custom:Array.from({length:50},()=>({title:'b'.repeat(500),detail:'c'.repeat(500)})),checked:[0,9,10],prep:[1,1,5,6,-1]});
  assert.equal(state.goal.length,100);assert.equal(state.custom.length,6);
  assert.equal(state.custom[0].title.length,120);assert.equal(state.custom[0].detail.length,240);
  assert.deepEqual(state.checked,[0,9]);assert.deepEqual(state.prep,[1,5]);
});

test('goal changes archive the previous goal and progress without changing completion',()=>{
 const old=core.normalize({plan:'work',goal:'My first goal',checked:[0,2],remember:true});
 const next=core.setGoal(old,'My next goal');
 assert.equal(next.goal,'My next goal');assert.equal(next.history[0].goal,'My first goal');
 assert.equal(next.history[0].done,2);assert.deepEqual(next.checked,[0,2]);assert.equal(next.remember,true);
 assert.equal(core.setGoal(next,'My next goal'),next);
 const changed=core.changePlan(next,'skills');assert.equal(changed.history[0].goal,'My next goal');assert.equal(changed.history[1].goal,'My first goal');assert.equal(changed.checked.length,0);
 assert.deepEqual(core.normalize(JSON.parse(JSON.stringify(changed))).history,changed.history);
});
test('history is bounded, malformed entries are rejected and clear removes history',()=>{
 let value=core.normalize({plan:'work',goal:'Start'});
 for(let i=0;i<25;i++)value=core.setGoal(value,'Goal '+i);
 assert.equal(value.history.length,20);assert.equal(value.history[0].goal,'Goal 23');
 const normalized=core.normalize({...value,history:[{plan:'__proto__',changedAt:'2026-01-01T00:00:00Z'},null,{plan:'work',changedAt:'bad'},...value.history]});
 assert.equal(normalized.history.length,17);
 assert.deepEqual(core.empty().history,[]);
});
