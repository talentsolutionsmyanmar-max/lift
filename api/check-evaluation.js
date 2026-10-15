'use strict';
// Preview-only fixed synthetic evaluation; never accepts a user message or image.
const {completion,runtimeToken,refreshSources}=require('./check.js');
const {timingSafeEqual}=require('node:crypto');
const core=require('../lib/checker/core.cjs');
const fixtures=require('../lib/checker/evaluation-fixtures.json');
const evaluationSources=[...core.sources,...require('../lib/checker/evaluation-candidate-sources.json')];
const MODELS=['meta/llama-4-scout','meta/llama-4-maverick','meta/muse-glimmer-30b'];
const slots=new Map();
function makeHandler({env=process.env,fetcher=fetch,counter=slots}={}){return async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(env.VERCEL_ENV!=='preview')return res.status(404).json({error:'not_found'});
 const expected=env.LIFT_EVAL_TOKEN,expires=Number(env.LIFT_EVAL_EXPIRES),provided=String(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!expected||!Number.isFinite(expires)||expires<Date.now()||Buffer.byteLength(provided)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(provided),Buffer.from(expected)))return res.status(401).json({error:'evaluation_access'});
 if(req.method==='GET'){const states=await refreshSources(fetcher,Date.now(),evaluationSources);return res.status(200).json({syntheticOnly:true,models:MODELS,fixtures:fixtures.map(f=>f.id),configured:!!runtimeToken(env),sourceVersion:core.sourceVersion(evaluationSources),sourceStates:states.map(s=>({id:s.id,state:s.state}))})}
 if(req.method!=='POST')return res.status(405).json({error:'method'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'content_type'});
 let body;try{const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw||'')>512)throw Error();body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||Object.keys(body).some(k=>!['fixtureId','model','language'].includes(k)))throw Error();}catch{return res.status(400).json({error:'input'})}
 const fixture=fixtures.find(f=>f.id===body.fixtureId),model=body.model;
 if(!fixture||!MODELS.includes(model)||!['en','my'].includes(body.language))return res.status(400).json({error:'input'});
 const key=new Date().toISOString().slice(0,13),count=counter.get(key)||0;
 if(count>=6)return res.status(429).json({error:'evaluation_limit'});
 counter.clear();counter.set(key,count+1);
 const token=runtimeToken(env);if(!token)return res.status(503).json({error:'configuration'});
 const format=model==='meta/llama-4-maverick'?'json_object':'json_schema';
 const input=core.validateInput({text:fixture.text,language:body.language,consent:true}),start=Date.now();let stage='sources',sourceStates=[];
 try{
  sourceStates=await refreshSources(fetcher,Date.now(),evaluationSources);const available=sourceStates.filter(s=>s.state==='available');
  stage='extract';const extracted=core.cleanExtraction(await completion(core.messages(input),core.extractionSchema,'lift_extract',fetcher,token,model,format),input);
  stage='compare';const compared=core.cleanReport(await completion(core.comparisonMessages(input,extracted,available),core.reportSchema,'lift_compare',fetcher,token,model,format),available);
  return res.status(200).json({syntheticOnly:true,fixtureId:fixture.id,model,structuredFormat:format,requestedLanguage:body.language,elapsedMs:Date.now()-start,sourceVersion:core.sourceVersion(evaluationSources),languageGate:core.hasRequestedLanguage({...extracted,...compared},body.language),exactDateMatch:JSON.stringify([...fixture.expectedDates].sort())===JSON.stringify([...extracted.dates].sort()),exactAmountMatch:JSON.stringify([...fixture.expectedAmounts].sort())===JSON.stringify([...extracted.amounts].sort()),reviewStatus:'semantic_review_required',result:{...extracted,...compared},sources:sourceStates.map(({markers,...s})=>s)});
 }catch(e){return res.status(503).json({syntheticOnly:true,fixtureId:fixture.id,model,stage,elapsedMs:Date.now()-start,category:e.category||(['model_shape','incomplete','extraction_fidelity'].includes(e.message)?e.message:e.name==='TimeoutError'?'timeout':e.name==='SyntaxError'?'invalid_json':'processing'),providerStatus:Number.isInteger(e.status)?e.status:null,sourceStates:sourceStates.map(s=>({id:s.id,state:s.state}))})}
};}
module.exports=makeHandler();module.exports.makeHandler=makeHandler;
