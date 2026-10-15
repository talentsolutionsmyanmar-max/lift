const {test}=require('node:test'),assert=require('node:assert/strict');
const {contexts}=require('../dist/check-context.js');
test('local context preserves qualifiers and repeated occurrences without inventing matches',()=>{
 const text='Before 20 October 2026 ask a question. After 20 October 2026 collect a copy.';
 const values=contexts(text,'20 October 2026');assert.equal(values.length,2);
 assert.ok(values[0].before.endsWith('Before '));assert.ok(values[1].before.endsWith('After '));
 assert.deepEqual(contexts(text,'21 October 2026'),[]);assert.deepEqual(contexts(text,''),[]);
});
test('local context bounds long text and preserves source characters verbatim',()=>{
 const text='x'.repeat(100)+'<private> 2,500 baht'+'z'.repeat(100),value=contexts(text,'2,500 baht')[0];
 assert.equal(value.before.length,60);assert.equal(value.after.length,60);assert.equal(value.leading,true);assert.equal(value.trailing,true);assert.ok(value.before.endsWith('<private> '));
 assert.equal(contexts('x '.repeat(20),'x').length,6);
});
