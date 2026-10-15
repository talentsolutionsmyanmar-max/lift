const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require.resolve('../dist/team-test.html'),'utf8');
const match=html.match(/app64=("[A-Za-z0-9+/=]+");let locale/),app=Buffer.from(JSON.parse(match[1]),'base64').toString();
const scripts=value=>[...value.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
test('portable test has valid scripts, opaque sandbox and network-blocking policies',()=>{
 assert.match(html,/sandbox="allow-scripts allow-downloads allow-forms"/);assert.doesNotMatch(html,/allow-same-origin/);assert.match(html,/connect-src 'none'/);assert.match(app,/connect-src 'none'/);
 for(const source of [...scripts(html),...scripts(app)])assert.doesNotThrow(()=>new vm.Script(source));
 assert.doesNotMatch(app,/<script src=/);assert.equal(Buffer.byteLength(html)<2000000,true);
});
test('test transport never forwards requests and a withdrawn test receipt cannot be revived',async()=>{
 const context={window:{},document:{addEventListener(){}},Response,Map,Date,JSON};vm.runInNewContext(scripts(app)[0],context);
 await assert.rejects(()=>context.window.fetch('https://example.org/private'));
 const send=action=>context.window.fetch('/api/community',{method:'POST',body:JSON.stringify({action,receipt:'synthetic-code',text:'must-not-be-retained'})}).then(r=>r.json());
 assert.equal((await send('submit')).status,'received');assert.equal(JSON.stringify([...context.window.__testRows.values()]).includes('must-not-be-retained'),false);
 assert.equal((await send('withdraw')).status,'withdrawn');assert.equal((await send('submit')).status,'withdrawn');
});
test('test feedback includes an unrestricted own question and optional explanation without upload',()=>{
 for(const id of ['needs','confusing','ownQuestion','answer'])assert.match(html,new RegExp('data-feedback="'+id+'"'));
 assert.match(html,/lift-team-test-feedback\.txt/);assert.doesNotMatch(scripts(html)[0],/fetch\(|localStorage|sessionStorage/);
});
test('feedback download includes selected choices and own words with real line breaks',async()=>{
 const source=html.match(/\$\('download'\)\.onclick=(\(\)=>\{[\s\S]*?\});\$\('reset'\)/)[1];let blob,clicked=false;
 const context={copies:{en:{title:'Test',badge:'Test only',feedbackPrivacy:'Local',needs:'Need',confusing:'Ease',ownQuestion:'Own question',answer:'Answer'}},locale:'en',feedback:{ownQuestion:'My own question'},feedbackChoices:{needs:'housing'},surveyCopy:{en:{housing:'Housing'}},choices:{en:{}},URL:{createObjectURL:b=>{blob=b;return 'blob:test'},revokeObjectURL(){}},Blob,document:{createElement:()=>({click(){clicked=true},remove(){}}),body:{append(){}}},setTimeout(){}};
 vm.runInNewContext('const download='+source+';download()',context);const text=await blob.text();assert.equal(clicked,true);assert.match(text,/Need\nHousing/);assert.match(text,/Own question\nMy own question/);assert.doesNotMatch(text,/\\n/);
});
