const test=require('node:test'),assert=require('node:assert/strict');
const {createSession}=require('../dist/community-intake-session.js');
test('route and language changes reuse one mounted panel rather than losing its receipt',()=>{
 let mounts=0,languages=[],availability=[];const element={remove(){}};
 const panel={setLanguage:(copy,locale)=>languages.push(locale),setAvailability:value=>availability.push(value),destroy(){}};
 const session=createSession({makeElement:()=>element,mountUI:()=>{mounts++;return panel;}}),first=[],second=[],en={},my={};
 session.attach({append:node=>first.push(node)},{copy:en,locale:'en',enabled:true,receiptsEnabled:true});
 session.attach({append:node=>second.push(node)},{copy:my,locale:'my',enabled:false,receiptsEnabled:true});
 assert.equal(mounts,1);assert.equal(first[0],second[0]);assert.deepEqual(languages,['my']);assert.deepEqual(availability,[{enabled:false,receiptsEnabled:true}]);
});
test('explicit session destruction removes the old panel before a fresh session begins',()=>{
 let mounts=0,destroyed=0,removed=0;const session=createSession({makeElement:()=>({remove(){removed++;}}),mountUI:()=>{mounts++;return {setAvailability(){},setLanguage(){},destroy(){destroyed++;}};}});
 const slot={append(){}};session.attach(slot,{});session.destroy();session.destroy();session.attach(slot,{});
 assert.equal(mounts,2);assert.equal(destroyed,1);assert.equal(removed,1);
});
