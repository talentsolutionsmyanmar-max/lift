'use strict';
const {normalizeReply,replyHash}=require('./community-review.cjs');
function receiptView(record,now=new Date()){
 if(!record||record.version!==1||!['received','withdrawn'].includes(record.state)||!Number.isFinite(Date.parse(record.createdAt))||!Number.isFinite(Date.parse(record.expiresAt)))throw Error('Invalid stored record');
 if(Date.parse(record.expiresAt)<=now.getTime())return {status:'expired'};
 if(record.state==='withdrawn')return {status:'withdrawn'};
 const base={status:'received',submittedAt:record.createdAt,expiresAt:record.expiresAt},r=record.replyReview;
 if(!record.reply||r?.reviewerKind!=='human'||r.privacyChecked!==true||r.sourcesChecked!==true||r.myanmarChecked!==true)return base;
 const reply=normalizeReply(record.reply);
 if(r.contentHash!==replyHash(reply)||!r.editorId||!Number.isFinite(Date.parse(r.reviewedAt)))throw Error('Reply review invalid');
 if(['documents','health'].includes(record.content?.topic)&&(r.qualifiedReviewConfirmed!==true||!r.qualifiedReviewerId))return base;
 return {...base,status:'answered',reply,reviewedAt:r.reviewedAt};
}
module.exports={receiptView};
