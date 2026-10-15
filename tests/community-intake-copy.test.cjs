const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{createHash}=require('node:crypto');
test('bundled intake wording matches exact CCO provenance in both languages',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/community-intake-copy.js'),'utf8'),context);
 const copies=context.window.LiftCommunityIntakeCopy,p=require('../docs/community/intake-copy-provenance.json');
 for(const [locale,key] of [['en','englishHash'],['my','myanmarHash']]){assert.equal(Object.keys(copies[locale]).length,p.keyCount);assert.equal(createHash('sha256').update(JSON.stringify(copies[locale])).digest('hex'),p[key]);}
});
