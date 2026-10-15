const test=require('node:test'),assert=require('node:assert/strict'),{appendPrompt}=require('../dist/community.js');
test('daily prompt appends without replacing a person’s words or topic',()=>{
 const draft={kind:'experience',topic:'family',text:'My existing words'};
 const result=appendPrompt(draft,'A useful question?');assert.equal(result.status,'added');assert.equal(result.draft.text,'My existing words\n\nA useful question?');assert.equal(result.draft.kind,'experience');assert.equal(result.draft.topic,'family');assert.equal(draft.text,'My existing words');
});
test('duplicate or oversized prompt never silently changes or truncates the draft',()=>{
 assert.equal(appendPrompt({text:'Question?'},'Question?').status,'duplicate');
 const text='x'.repeat(1199),result=appendPrompt({text},'More?');assert.equal(result.status,'full');assert.equal(result.draft.text,text);
});
