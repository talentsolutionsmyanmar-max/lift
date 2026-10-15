const test=require('node:test'),assert=require('node:assert/strict');
const {makeReviewer,replyHash,recordPath,normalizeReply}=require('../lib/community-review.cjs');
const key='a'.repeat(64),now=()=>new Date('2026-10-15T12:00:00Z');
function fixture(){let record={value:{version:1,state:'received',createdAt:'2026-10-15T10:00:00Z',expiresAt:'2026-10-29T10:00:00Z',content:{consentToAI:true,language:'my',kind:'question',topic:'family',text:'PRIVATE ORIGINAL MUST NOT LEAVE'}},etag:'v1'};let writes=0;return {get record(){return record},get writes(){return writes},async read(path){assert.equal(path,recordPath(key));return structuredClone(record)},async replace(path,value,etag){assert.equal(path,recordPath(key));if(etag!==record.etag)throw Error('conflict');record={value:structuredClone(value),etag:'v'+(++writes+1)}}};}
const reply=()=>({en:'Ask the learning provider about options.',my:'သင်ယူမှုအကြောင်း မေးမြန်းပါ။',sources:['https://example.org/source']});
function review(r){return {reviewerKind:'human',editorId:'internal-editor',privacyChecked:true,sourcesChecked:true,myanmarChecked:true,contentHash:replyHash(normalizeReply(r))};}
test('AI handoff uses only editor-redacted content and respects opt-out',async()=>{
 const s=fixture(),r=makeReviewer({store:s,now}),packet=await r.aiPacket(key,{redactedText:'An anonymised learning question',redactionConfirmed:true,editorId:'editor'});assert.equal(JSON.stringify(packet).includes('PRIVATE ORIGINAL'),false);assert.equal(packet.reviewerKind,'ai');assert.equal(s.writes,0);
 s.record.value.content.consentToAI=false;await assert.rejects(()=>r.aiPacket(key,{redactedText:'Question',redactionConfirmed:true,editorId:'editor'}));
});
test('AI pass cannot publish, approve a reply or bypass qualified review',async()=>{
 const s=fixture(),r=makeReviewer({store:s,now});s.record.value.content.topic='health';const saved=await r.saveAIPass(key,{reviewerKind:'ai',model:'ZCode test',status:'ready_for_editor',decision:'publish',reply:reply()});assert.equal(saved.status,'needs_qualified_review');assert.equal(s.record.value.reply,undefined);assert.equal(s.record.value.aiReview.decision,undefined);
 await assert.rejects(()=>r.approveReply(key,reply(),{...review(reply()),reviewerKind:'ai'}));await assert.rejects(()=>r.approveReply(key,reply(),review(reply())));
});
test('human reply is bound to exact checked text, retains expiry and stays private',async()=>{
 const s=fixture(),r=makeReviewer({store:s,now}),value=reply(),attestation=review(value);value.en='Changed';await assert.rejects(()=>r.approveReply(key,value,attestation));assert.equal(s.writes,0);
 const result=await r.approveReply(key,reply(),review(reply()));assert.equal(result.visibility,'private_receipt_only');assert.equal(s.record.value.expiresAt,'2026-10-29T10:00:00Z');assert.equal(s.record.value.reply.en,reply().en);
});
test('withdrawn or expired questions cannot be read for AI or receive a reply',async()=>{
 for(const state of ['withdrawn','expired']){const s=fixture();if(state==='withdrawn')s.record.value.state='withdrawn';else s.record.value.expiresAt='2026-10-14T00:00:00Z';const r=makeReviewer({store:s,now});await assert.rejects(()=>r.aiPacket(key,{redactedText:'Question',redactionConfirmed:true,editorId:'editor'}));await assert.rejects(()=>r.approveReply(key,reply(),review(reply())));assert.equal(s.writes,0);}
});
test('review write racing with withdrawal fails conditionally rather than reviving data',async()=>{
 const s=fixture(),original=s.replace;s.replace=async(path,value,etag)=>{s.record.value.state='withdrawn';s.record.etag='withdrawn-v2';return original(path,value,etag)};
 await assert.rejects(()=>makeReviewer({store:s,now}).approveReply(key,reply(),review(reply())));assert.equal(s.record.value.state,'withdrawn');assert.equal(s.record.value.reply,undefined);
});
test('private AI exports are exclusive, mode 0600 and refused inside the repository',async()=>{
 const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),{privateOutput}=require('../scripts/community-review.cjs');const dir=await fs.mkdtemp(path.join(os.tmpdir(),'lift-review-output-'));try{const file=path.join(dir,'packet.json');await privateOutput(file,{redactedText:'Fictional example'});assert.equal((await fs.stat(file)).mode&0o777,0o600);await assert.rejects(()=>privateOutput(file,{overwrite:true}));await assert.rejects(()=>privateOutput(path.resolve(__dirname,'../docs/community/must-not-create.json'),{}));}finally{await fs.rm(dir,{recursive:true,force:true})}
});
test('receipt response exposes only approved reply, never private question or reviewer identity',async()=>{
 const {receiptView}=require('../lib/community-receipt-view.cjs'),s=fixture(),r=makeReviewer({store:s,now});await r.approveReply(key,reply(),review(reply()));const view=receiptView(s.record.value,now());assert.equal(view.status,'answered');assert.equal(view.reply.en,reply().en);assert.equal(JSON.stringify(view).includes('PRIVATE ORIGINAL'),false);assert.equal(JSON.stringify(view).includes('internal-editor'),false);
 s.record.value.replyReview.reviewerKind='ai';assert.equal(receiptView(s.record.value,now()).status,'received');s.record.value.state='withdrawn';assert.deepEqual(receiptView(s.record.value,now()),{status:'withdrawn'});
});
test('reviewed replies reject the same non-text control characters as intake',()=>{const {normalizeReply}=require('../lib/community-review.cjs');for(const c of ['\u000b','\u000c','\u001f'])assert.throws(()=>normalizeReply({...reply(),en:'Text'+c}));assert.equal(normalizeReply({...reply(),en:'First line\nSecond line'}).en,'First line\nSecond line');});
