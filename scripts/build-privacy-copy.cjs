const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const en=JSON.parse(fs.readFileSync(path.join(root,'docs/privacy-tools-en.json'))),my=JSON.parse(fs.readFileSync(path.join(root,'docs/privacy-tools-my.json')));
if(JSON.stringify(Object.keys(en).sort())!==JSON.stringify(Object.keys(my).sort()))throw Error('Copy keys differ');
for(const v of Object.values(my))if(typeof v!=='string'||!/[\u1000-\u109f]/.test(v)||/[<>]/.test(v))throw Error('Invalid Myanmar copy');
const file=path.join(root,'dist/myanmar.js'),source=fs.readFileSync(file,'utf8'),offset=source.indexOf('window.LiftMyanmar=')+'window.LiftMyanmar='.length;
const dictionary=JSON.parse(source.slice(offset).trim().replace(/;$/,''));for(const k of Object.keys(en))dictionary[en[k]]=my[k];fs.writeFileSync(file,source.slice(0,offset)+JSON.stringify(dictionary,null,2)+';\n');
fs.writeFileSync(path.join(root,'docs/privacy-tools-provenance.json'),JSON.stringify({date:'2026-10-14',review:'CCO AI language review in founder-designated conversation; not participant validation',conversation:'CCO-private-review',keys:Object.keys(en).length,englishSHA256:crypto.createHash('sha256').update(JSON.stringify(en)).digest('hex'),myanmarSHA256:crypto.createHash('sha256').update(JSON.stringify(my)).digest('hex')},null,2)+'\n');
const uiPath=path.join(root,'dist/companion-ui.js');let ui=fs.readFileSync(uiPath,'utf8');
ui=ui.replace(/\/\* privacy-copy:start \*\/[\s\S]*?\/\* privacy-copy:end \*\//,'');
const registration='/* privacy-copy:start */\nconst companionPrivacyCopy='+JSON.stringify(en)+';\nObject.assign(window.LiftMyanmar,'+JSON.stringify(Object.fromEntries(Object.keys(en).map(k=>[en[k],my[k]])))+');\n/* privacy-copy:end */\n';

ui=ui.replace("'use strict';\n","'use strict';\n"+registration);fs.writeFileSync(uiPath,ui);
console.log('Added '+Object.keys(en).length+' reviewed privacy strings');
