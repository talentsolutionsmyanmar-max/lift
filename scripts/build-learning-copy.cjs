'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=name=>JSON.parse(fs.readFileSync(path.join(root,'docs/learning',name),'utf8')),hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const en=read('copy-en.json'),my=read('copy-my.json'),provenance=read('copy-provenance.json');
if(JSON.stringify(Object.keys(en).sort())!==JSON.stringify(Object.keys(my).sort()))throw Error('Learning copy keys differ');
if(hash(en)!==provenance.englishHash||hash(my)!==provenance.myanmarHash)throw Error('Learning copy changed after CCO review');
for(const [key,value] of Object.entries(my))if(typeof value!=='string'||!value.trim()||!/[\u1000-\u109f]/.test(value))throw Error('Missing Myanmar '+key);
fs.writeFileSync(path.join(root,'dist/learning-copy.js'),'window.LiftLearningCopy='+JSON.stringify({en,my}).replace(/</g,'\\u003c')+';\n');console.log('Built exact reviewed learning copy: '+Object.keys(en).length+' bilingual keys');
