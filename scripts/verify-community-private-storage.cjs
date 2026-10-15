'use strict';
// Explicit opt-in provider test. Only a newly generated synthetic object is touched.
const {randomUUID}=require('node:crypto');
const sdk=require('@vercel/blob');
const {makeStore}=require('../lib/community-blob.cjs');
async function verify({enabled=process.env.RUN_COMMUNITY_PRIVATE_BLOB_TEST==='1',store=makeStore(),del=sdk.del}={}){
 if(!enabled)throw Error('Explicit synthetic private-storage opt-in required');
 const path='community-integration/'+randomUUID()+'.json';let created=false,latest,stage='create';
 try{
  await store.create(path,{synthetic:true,marker:'v1'});created=true;stage='initial_read';const first=await store.read(path);
  if(first?.value?.marker!=='v1'||!first.etag)throw Error('Initial read failed');latest=first.etag;
  stage='conditional_update';await store.replace(path,{synthetic:true,marker:'v2'},first.etag);const second=await store.read(path);
  if(second?.value?.marker!=='v2'||!second.etag||second.etag===first.etag)throw Error('Fresh version read failed');latest=second.etag;
  stage='stale_update_probe';let rejected=false;try{await store.replace(path,{synthetic:true,marker:'must-not-write'},first.etag);}catch(error){if(error.code!=='CONFLICT')throw error;rejected=true;}
  if(!rejected)throw Error('Stale overwrite was not refused');const final=await store.read(path);if(final?.value?.marker!=='v2')throw Error('Stale write changed content');latest=final.etag;
  stage='conditional_delete';await del(path,{ifMatch:latest});created=false;if(await store.read(path))throw Error('Synthetic deletion not confirmed');
  return {privateCreate:true,originRead:true,conditionalUpdate:true,staleUpdateRefused:true,syntheticDeletion:true};
 }catch(error){error.probeStage=stage;throw error;}finally{if(created)await del(path,latest?{ifMatch:latest}:undefined);}
}
function safeFailure(error){const names=['BlobError','BlobAccessError','BlobOidcEnvironmentNotAllowedError','BlobStoreNotFoundError','BlobPreconditionFailedError','BlobServiceNotAvailable','BlobServiceRateLimited'];const kind=names.includes(error?.name)?error.name:names.includes(error?.constructor?.name)?error.constructor.name:'unconfirmed';return {stage:['create','initial_read','conditional_update','stale_update_probe','conditional_delete'].includes(error?.probeStage)?error.probeStage:'local_setup',kind};}
if(require.main===module)verify().then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error('Private synthetic verification incomplete. Intake stays closed.');console.error(JSON.stringify(safeFailure(error)));process.exitCode=1});
module.exports={verify,safeFailure};
