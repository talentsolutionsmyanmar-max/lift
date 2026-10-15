const {createHash}=require('node:crypto');
function digest(p){return createHash('sha256').update(JSON.stringify({id:p.id,kind:p.kind,topic:p.topic,title:p.title,body:p.body,sources:p.sources,reviewedAt:p.reviewedAt,reviewDue:p.reviewDue})).digest('hex');}
function validate(p,now=new Date()){
 const fail=()=>{throw Error('Community publication review is incomplete or invalid');};
 if(!p||!/^post-[a-z0-9-]{1,64}$/.test(p.id)||!['answer','experience'].includes(p.kind)||!['daily','family','work','documents','health'].includes(p.topic))fail();
 for(const key of ['title','body'])for(const lang of ['en','my'])if(typeof p[key]?.[lang]!=='string'||!p[key][lang].trim()||p[key][lang].length>(key==='title'?160:2400)||/[<>\u0000-\u0008]/.test(p[key][lang]))fail();
 if(!/[\u1000-\u109f]/.test(p.title.my)||!/[\u1000-\u109f]/.test(p.body.my))fail();
 if(!Array.isArray(p.sources)||p.sources.length>5||(p.kind==='answer'&&!p.sources.length))fail();
 for(const source of p.sources){let url;try{url=new URL(source)}catch{fail();}if(url.protocol!=='https:'||url.username||url.password||url.hash||url.hostname==='localhost'||!url.hostname.includes('.'))fail();}
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
 if(!date(p.reviewedAt)||!date(p.reviewDue))fail();
 const checked=Date.parse(p.reviewedAt+'T00:00:00Z'),due=Date.parse(p.reviewDue+'T23:59:59Z');
 if(checked>now.getTime()||due<now.getTime()||due<=checked||due-checked>32*86400000)fail();
 const r=p.review;if(!r||r.decision!=='publish'||r.contentHash!==digest(p)||!r.reviewerId||r.privacyChecked!==true||r.myanmarChecked!==true||r.sourcesChecked!==true||r.consentToPublish!==true)fail();
 if(['documents','health'].includes(p.topic)&&(!r.qualifiedReviewerId||r.qualifiedReviewConfirmed!==true))fail();
 // Private review identities and attestations never enter the public payload.
 return {id:p.id,kind:p.kind,topic:p.topic,title:{en:p.title.en,my:p.title.my},body:{en:p.body.en,my:p.body.my},sources:p.sources,reviewedAt:p.reviewedAt,reviewDue:p.reviewDue};
}
module.exports={digest,validate};
