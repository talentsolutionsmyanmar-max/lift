'use strict';
const {put,head,BlobNotFoundError}=require('@vercel/blob');
const {createHmac}=require('node:crypto');
const core=require('../lib/checker/core.cjs');
const {getVercelOidcTokenSync}=require('@vercel/oidc');
function runtimeToken(env){if(env.AI_GATEWAY_API_KEY||env.VERCEL_OIDC_TOKEN)return env.AI_GATEWAY_API_KEY||env.VERCEL_OIDC_TOKEN;if(env===process.env)try{return getVercelOidcTokenSync()}catch{}return null;}
const ENDPOINT='https://ai-gateway.vercel.sh/v1/chat/completions';
const ORIGIN='https://lift-next-step.vercel.app';
async function claimSlot(path,count,store){
 for(let i=0;i<count;i++){
  const key=`${path}/${i}.json`;
  try{await store.put(key,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});return true}
  catch(e){try{await store.head(key)}catch{throw e}}
 }
 return false;
}
async function rateLimit(req,store,secret){
 const now=new Date().toISOString(),day=now.slice(0,10),hour=now.slice(0,13);
 const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 const hash=createHmac('sha256',secret).update(hour+':'+ip).digest('hex');
 if(!await claimSlot(`check-limits/${day}/ip-${hash}`,6,store))return false;
 return claimSlot(`check-limits/${day}/global`,30,store);
}
async function refreshSources(fetcher,now=Date.now(),sourceList=core.sources){
 return Promise.all(sourceList.map(async source=>{
  if(now>Date.parse(source.reviewBy+'T23:59:59Z'))return {...source,state:'expired'};
  try{
   const response=await fetcher(source.url,{signal:AbortSignal.timeout(source.format==='pdf'?12000:7000),redirect:'error'});
   if(!response.ok)throw Error('source');
   if(source.format==='pdf'){
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length>1500000||bytes.subarray(0,4).toString()!=='%PDF'||require('node:crypto').createHash('sha256').update(bytes).digest('hex')!==source.sha256)throw Error('changed_source');
    return {...source,state:'available',refreshedAt:new Date(now).toISOString()};
   }
   const text=await response.text();
   if(text.length>1500000||!source.markers.every(marker=>text.includes(marker))||!source.excerpt.split('\n').every(line=>text.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').includes(line)))throw Error('changed_source');
   return {...source,state:'available',refreshedAt:new Date(now).toISOString()};
  }catch{return {...source,state:'unavailable'}}
 }));
}
async function completion(messages,schema,name,fetcher,token,model=core.MODEL,structuredFormat='json_schema'){
 const wireMessages=structuredFormat==='json_object'?[{role:'system',content:'Return exactly one JSON object matching this schema; no extra keys or prose: '+JSON.stringify(schema)},...messages]:messages;
 const response=await fetcher(ENDPOINT,{method:'POST',signal:AbortSignal.timeout(45000),headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:wireMessages,temperature:0,max_tokens:5500,stream:false,response_format:structuredFormat==='json_object'?{type:'json_object'}:{type:'json_schema',json_schema:{name,strict:true,schema}},providerOptions:{gateway:{zeroDataRetention:true,disallowPromptTraining:true}}})});
 if(!response.ok){const error=Error('gateway');error.status=response.status;const detail=JSON.stringify(await response.json().catch(()=>({}))).toLowerCase();error.category=/response_format|json_schema|structured.output/.test(detail)?'structured_format':/zero.?data.?retention|zdr/.test(detail)?'privacy_policy':/credit|billing|balance/.test(detail)?'billing':/region|country|geograph/.test(detail)?'region':/enable|activat|onboard/.test(detail)?'activation':/model|provider/.test(detail)?'model_access':'identity';throw error}
 const result=await response.json();
 const choice=result.choices?.[0];if(choice?.finish_reason!=='stop')throw Error('incomplete');
 const value=JSON.parse(choice.message.content.replace(/^```(?:json)?\s*|\s*```$/g,''));core.assertSchema(value,schema);return value;
}
function makeHandler({fetcher=fetch,store={put,head},env=process.env}={}){return async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='GET')return res.status(200).json({model:core.MODEL,configured:!!runtimeToken(env),rateConfigured:!!env.SURVEY_RATE_SECRET,myanmarAiReady:false,sourceVersion:core.sourceVersion(),sources:core.sources.map(({markers,...s})=>s)});
 if(req.method!=='POST')return res.status(405).json({error:'method'});
 if(req.headers.origin!==ORIGIN)return res.status(403).json({error:'origin'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'content_type'});
 let input;
 try{const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw||'')>1900000)return res.status(413).json({error:'size'});input=core.validateInput(typeof req.body==='string'?JSON.parse(req.body):req.body)}catch{return res.status(400).json({error:'input'})}
 // Live Myanmar test failed semantic quality: withhold generated guidance until reviewed.
 if(input.language==='my')return res.status(503).json({error:'unavailable',stage:'language_quality'});
 const token=runtimeToken(env);
 if(!token||!env.SURVEY_RATE_SECRET)return res.status(503).json({error:'unavailable',stage:'configuration'});
 let stage='limit';
 try{
  if(!await rateLimit(req,store,env.SURVEY_RATE_SECRET))return res.status(429).json({error:'limit'});
  stage='sources';const sourceStates=await refreshSources(fetcher);
  const available=sourceStates.filter(s=>s.state==='available');
  stage='extract';const extracted=core.cleanExtraction(await completion(core.messages(input),core.extractionSchema,'lift_extract',fetcher,token),input);
  stage='compare';const compared=core.withPreparationChecklist(core.cleanReport(await completion(core.comparisonMessages(input,extracted,available),core.reportSchema,'lift_compare',fetcher,token),available),input.language);
  if(!core.hasRequestedLanguage({...extracted,...compared},input.language))throw Error('language');
  return res.status(200).json({ok:true,model:core.MODEL,generatedAt:new Date().toISOString(),sourceVersion:core.sourceVersion(),reviewStatus:'ai_draft',outputLanguage:input.language,...extracted,...compared,uncertainty:[...new Set([...extracted.uncertainty,...compared.uncertainty])].slice(0,8),sources:sourceStates.map(({markers,...s})=>s)});
 }catch(e){console.warn('Lift checker unavailable',Number.isInteger(e.status)?e.status:'processing');return res.status(503).json({error:'unavailable',stage,providerStatus:Number.isInteger(e.status)?e.status:null,category:e.category||(['model_shape','incomplete','language','extraction_fidelity','language_quality'].includes(e.message)?e.message:e.name==='SyntaxError'?'invalid_json':e.name==='TimeoutError'?'timeout':'processing')})}
};}
module.exports=makeHandler();module.exports.makeHandler=makeHandler;module.exports.refreshSources=refreshSources;module.exports.rateLimit=rateLimit;

module.exports.completion=completion;module.exports.runtimeToken=runtimeToken;
