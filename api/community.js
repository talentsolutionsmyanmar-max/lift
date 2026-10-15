'use strict';
const {put,head}=require('@vercel/blob');
const {makeStore}=require('../lib/community-blob.cjs');
const {capabilities,allowed}=require('../lib/community-availability.cjs');
const {credential,submission,hmac,makeService}=require('../lib/community-intake.cjs');
function makeHandler({store,quotaPut=put,quotaHead=head,env=()=>process.env,now=()=>new Date()}){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
  if(req.headers.origin!=='https://lift-next-step.vercel.app')return res.status(403).json({ok:false});
  const config=env();
  // Opening intake is a separate operational decision. No default environment enables it.
  if(!capabilities(config).receiptsOpen)return res.status(503).json({ok:false,status:'closed'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({ok:false});
  let body;try{const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw||'')>10000)return res.status(413).json({ok:false});body=typeof req.body==='string'?JSON.parse(req.body):req.body;credential(body);if(!allowed(config,body.action))return res.status(503).json({ok:false,status:'closed'});if(body.action==='submit')submission(body);}catch{return res.status(400).json({ok:false});}
  try{
   const hour=now().toISOString().slice(0,13),ip=String(req.headers['x-vercel-forwarded-for']||'unknown').split(',')[0].trim(),key=hmac(config.COMMUNITY_RECEIPT_SECRET,'rate',hour+':'+ip),limit=body.action==='submit'?3:30,bucket=body.action==='submit'?'create':'receipt';let allowed=false;
   for(let slot=0;slot<limit;slot++){const path=`community-limits/${hour}/${bucket}-${key}-${slot}.json`;try{await quotaPut(path,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json',cacheControlMaxAge:60});allowed=true;break;}catch(error){try{await quotaHead(path);}catch{throw error;}}}
   if(!allowed)return res.status(429).json({ok:false,status:'rate_limited'});
   const result=await makeService({store,secret:config.COMMUNITY_RECEIPT_SECRET,now}).run(body);
   const codes={received:200,answered:200,withdrawn:200,not_found:404,expired:410,conflict:409,retry:409};
   return res.status(codes[result.status]||503).json({ok:['received','answered','withdrawn'].includes(result.status),...result});
  }catch{return res.status(503).json({ok:false,status:'unavailable'});}
 };
}
module.exports=makeHandler({store:makeStore()});module.exports.makeHandler=makeHandler;
