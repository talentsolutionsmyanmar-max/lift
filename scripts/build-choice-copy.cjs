'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const en=read('docs/community/choice-copy-en.json'),my=read('docs/community/choice-copy-my.json'),provenance=read('docs/community/choice-copy-provenance.json');
if(JSON.stringify(Object.keys(en).sort())!==JSON.stringify(Object.keys(my).sort())||hash(en)!==provenance.englishHash||hash(my)!==provenance.myanmarHash)throw Error('Exact CCO choice copy provenance required');
fs.writeFileSync(path.join(root,'dist/choice-copy.js'),'window.LiftChoiceCopy='+JSON.stringify({en,my}).replace(/</g,'\\u003c')+';\n');
console.log('Built exact reviewed choice copy: '+Object.keys(en).length+' keys');
