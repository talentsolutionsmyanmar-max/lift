const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../dist/community.js'),{digest,validate}=require('../lib/community-publication.cjs');
test('draft boundaries and text export retain user choice and unreviewed status',()=>{
 const p=core.normalize({kind:'experience',topic:'family',text:' A useful question '});
 const text=core.exportText(p,k=>k);assert.match(text,/previewTitle/);assert.match(text,/experience/);assert.match(text,/draftNote/);assert.match(text,/A useful question/);
 assert.equal(core.valid({...p,text:' '}),false);assert.equal(core.valid({...p,text:'x'.repeat(1201)}),false);assert.equal(core.normalize({topic:'GPS',text:'x'.repeat(1300)}).text.length,1200);assert.throws(()=>core.exportText({text:''},k=>k));
});
function post(){const p={id:'post-test',kind:'answer',topic:'daily',title:{en:'Question',my:'မေးခွန်း'},body:{en:'Sample answer',my:'မေးခွန်း'},sources:['https://example.org/source'],reviewedAt:'2026-10-14',reviewDue:'2026-10-21',review:{decision:'publish',reviewerId:'internal-reviewer',privacyChecked:true,myanmarChecked:true,sourcesChecked:true,consentToPublish:true}};p.review.contentHash=digest(p);return p;}
const now=new Date('2026-10-14T10:00:00Z');
test('publication requires content-bound review and strips private reviewer identities',()=>{
 const p=post();assert.equal(validate(p,now).review,undefined);p.body.en='Changed';assert.throws(()=>validate(p,now));
 for(const field of ['privacyChecked','myanmarChecked','sourcesChecked','consentToPublish']){const p=post();p.review[field]=false;assert.throws(()=>validate(p,now));}
});
test('publication rejects stale, unqualified, unsafe and unsourced posts',()=>{
 for(const change of [p=>p.sources=[],p=>p.sources=['javascript:alert(1)'],p=>p.body.en='<script>x</script>',p=>p.reviewDue='2026-10-01',p=>p.reviewedAt='2026-10-20',p=>p.reviewDue='2026-12-01',p=>p.topic='health',p=>p.topic='documents']){const p=post();change(p);p.review.contentHash=digest(p);assert.throws(()=>validate(p,now));}
 const p=post();p.topic='health';p.review.qualifiedReviewConfirmed=true;p.review.qualifiedReviewerId='qualified-reviewer';p.review.contentHash=digest(p);assert.equal(validate(p,now).topic,'health');
});
test('offline board review age remains explicit',()=>{assert.equal(core.overdue('2026-10-14',now),false);assert.equal(core.overdue('2026-10-13',now),true);assert.equal(core.overdue('bad-date',now),true);});
test('community text is escaped, never saved, and clearing removes the in-memory draft',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),listeners={};const escapeText=v=>String(v).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
 const context={window:{LiftMyanmar:{},LiftCommunityPosts:[]},LiftI18n:{locale:'en'},LiftCommunity:core,document:{addEventListener(type,fn){(listeners[type]??=[]).push(fn)},getElementById(){return null}},heading:()=>'',icon:()=>'',escapeText,route(){},navigator:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(require('node:path').resolve(__dirname,'../dist/community-ui.js'),'utf8'),context);
 listeners.input[0]({target:{dataset:{communityField:'text'},value:'<img src=x onerror=alert(1)>'}});
 const html=vm.runInContext('communityPage()',context);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img/);assert.match(html,/method="dialog"/);
 listeners.click[0]({target:{closest:s=>s==='[data-community-action]'?{dataset:{communityAction:'clear'}}:null}});
 assert.equal(vm.runInContext('communityDraft.text',context),'');
 const source=fs.readFileSync(require('node:path').resolve(__dirname,'../dist/community-ui.js'),'utf8');assert.doesNotMatch(source,/fetch\(|localStorage|sessionStorage|XMLHttpRequest/);
});
test('sharing exports only the previewed draft and handles unavailable sharing without upload',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),listeners={},feedback={isConnected:true,textContent:''};let sent;
 const context={window:{LiftMyanmar:{},LiftCommunityPosts:[]},LiftI18n:{locale:'en'},LiftCommunity:core,document:{addEventListener(type,fn){(listeners[type]??=[]).push(fn)},getElementById(){return feedback}},heading:()=>'',icon:()=>'',escapeText:String,route(){},navigator:{share:async payload=>{sent=payload}}};vm.createContext(context);vm.runInContext(fs.readFileSync(require('node:path').resolve(__dirname,'../dist/community-ui.js'),'utf8'),context);
 vm.runInContext("communityDraft=LiftCommunity.normalize({text:'Fictional family question',topic:'family'});communityPreview=true",context);
 const button={dataset:{communityAction:'share'},isConnected:true},event={target:{closest:s=>s==='[data-community-action]'?button:null}};
 await listeners.click[0](event);assert.deepEqual(Object.keys(sent).sort(),['text','title']);assert.match(sent.text,/Fictional family question/);assert.match(sent.text,/not verified/);assert.equal(button.disabled,false);assert.equal(feedback.textContent,'');
 context.navigator.share=undefined;await listeners.click[0](event);assert.match(feedback.textContent,/copy or download/);
 context.navigator.share=async()=>{throw Object.assign(Error('cancelled'),{name:'AbortError'})};feedback.textContent='';await listeners.click[0](event);assert.equal(feedback.textContent,'');
});
test('publication emits only reviewed English and Myanmar language fields',()=>{const p=post();p.title.zz='Unrendered extra';p.body.zz='<b>Extra payload</b>';p.review.contentHash=digest(p);const result=validate(p,now);assert.deepEqual(Object.keys(result.title).sort(),['en','my']);assert.deepEqual(Object.keys(result.body).sort(),['en','my']);});
test('reviewed-sharing cards keep sources, review dates and stale warnings visible',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),p=validate(post(),now),context={window:{LiftMyanmar:{},LiftCommunityPosts:[p]},LiftI18n:{locale:'en'},LiftCommunity:core,document:{addEventListener(){}},icon:()=>'<svg></svg>',escapeText:String};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../dist/community-ui.js'),'utf8'),context);const html=vm.runInContext('communityBoard()',context);assert.match(html,/community-post-meta/);assert.match(html,/2026-10-14/);assert.match(html,/2026-10-21/);assert.match(html,/https:\/\/example.org\/source/);assert.match(html,/community-post-sources/);context.window.LiftCommunityPosts[0].reviewDue='2000-01-01';assert.match(vm.runInContext('communityBoard()',context),/Review is overdue/);
});
