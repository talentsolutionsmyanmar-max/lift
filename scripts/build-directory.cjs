'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const en=read('docs/directory-copy-en.json'),my=read('docs/directory-copy-my.json');
if(JSON.stringify(Object.keys(en).sort())!==JSON.stringify(Object.keys(my).sort()))throw new Error('Directory copy keys differ');
for(const value of Object.values(my))if(typeof value!=='string'||!/[\u1000-\u109f]/.test(value)||/[<>]/.test(value))throw new Error('Invalid Myanmar wording');
const records=[
 {id:'map-media',title:'MAP Foundation',category:'support',label:en.mapLabel,description:en.mapDescription,note:en.mapNote,url:'https://www.mapfoundationcm.org/en/',visitLabel:en.visitMap},
 {id:'hrdf',title:'HRDF',category:'support',label:en.hrdfLabel,description:en.hrdfDescription,note:en.hrdfNote,url:'https://hrdfoundation.org/?lang=en&page_id=7042',visitLabel:en.visitHRDF},
 {id:'golden-dreams',title:'Golden Dreams',category:'work',label:en.gdLabel,description:en.gdDescription,note:en.gdNote,url:'https://www.issarainstitute.org/empowerment-incubator',visitLabel:en.visitGD}
].map(r=>({...r,checked:en.checked,independent:en.independent}));
let app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
const start='  /* directory-source-records:start */',end='  /* directory-source-records:end */';
if(app.includes(start)){const from=app.indexOf(start),to=app.indexOf(end)+end.length;app=app.slice(0,from)+app.slice(to)}
app=app.replace('const resources = [\n','const resources = [\n'+start+'\n'+records.map(r=>'  '+JSON.stringify(r)+',').join('\n')+'\n'+end+'\n');
app=app.replace('<small>${r.note}</small>${r.url?', '<small>${r.note}</small>${r.checked?`<small>${r.checked}</small><small>${r.independent}</small>`:""}${r.url?');
app=app.replace('Visit ${r.title} <span aria-hidden="true">','${r.visitLabel||`Visit ${r.title}`} <span aria-hidden="true">');
fs.writeFileSync(path.join(root,'dist/app.js'),app);
const myPath=path.join(root,'dist/myanmar.js');let source=fs.readFileSync(myPath,'utf8'),offset=source.indexOf('window.LiftMyanmar=')+'window.LiftMyanmar='.length;
const dictionary=JSON.parse(source.slice(offset).trim().replace(/;$/,''));
for(const key of Object.keys(en))dictionary[en[key]]=my[key];
fs.writeFileSync(myPath,source.slice(0,offset)+JSON.stringify(dictionary,null,2)+';\n');
const sw=path.join(root,'dist/sw.js');fs.writeFileSync(sw,fs.readFileSync(sw,'utf8').replace('lift-shell-v8','lift-shell-v9'));
fs.writeFileSync(path.join(root,'docs/directory-release-records.json'),JSON.stringify({records,translation:'CCO AI wording reviewed; participant validation pending',inputHash:crypto.createHash('sha256').update(JSON.stringify(en)).digest('hex')},null,2)+'\n');
console.log('Built three external source entries');
