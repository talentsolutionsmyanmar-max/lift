'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=name=>JSON.parse(fs.readFileSync(path.join(root,'docs/community',name),'utf8'));
const provenance=read('intake-copy-provenance.json'),copies={en:read('intake-copy-en.json'),my:read('intake-copy-my.json')};
for(const [locale,key] of [['en','englishHash'],['my','myanmarHash']]){
 if(createHash('sha256').update(JSON.stringify(copies[locale])).digest('hex')!==provenance[key])throw Error('Reviewed intake copy hash mismatch');
 if(Object.keys(copies[locale]).length!==provenance.keyCount)throw Error('Reviewed intake copy keys differ');
}
fs.writeFileSync(path.join(root,'dist/community-intake-copy.js'),'window.LiftCommunityIntakeCopy='+JSON.stringify(copies)+';\n');
