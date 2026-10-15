'use strict';
// Called by `vercel env run` only with explicit test opt-in. No env file is written.
// The child receives Blob authentication only, not unrelated project credentials.
const {spawnSync}=require('node:child_process');
const {inspectAuth}=require('./community-probe-auth.cjs');
if(process.env.RUN_COMMUNITY_PRIVATE_BLOB_TEST!=='1'){console.error('Explicit synthetic probe opt-in required.');process.exitCode=1;}
else{
 const env={RUN_COMMUNITY_PRIVATE_BLOB_TEST:'1'};
 for(const key of ['BLOB_READ_WRITE_TOKEN','BLOB_STORE_ID','VERCEL_OIDC_TOKEN'])if(process.env[key])env[key]=process.env[key];
 const auth=inspectAuth(env);
 if(process.argv.includes('--check-only')){console.log(JSON.stringify(auth));process.exit(0);}
 if(!auth.readyForAttempt){console.error('Development Blob authentication is missing, expired or unreadable. Refresh the scoped development identity before retrying. No provider request was made.');process.exit(1);}
 const result=spawnSync(process.execPath,[require('node:path').join(__dirname,'verify-community-private-storage.cjs')],{cwd:require('node:path').resolve(__dirname,'..'),env,stdio:'inherit'});
 process.exitCode=result.status??1;
}
