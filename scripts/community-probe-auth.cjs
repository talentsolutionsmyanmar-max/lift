'use strict';
// Local expiry preflight only. Decoding a JWT does not authenticate it.
function inspectAuth(env,now=Date.now()){
 const blobTokenPresent=Boolean(env.BLOB_READ_WRITE_TOKEN),oidcPresent=Boolean(env.VERCEL_OIDC_TOKEN),storeIdPresent=Boolean(env.BLOB_STORE_ID);
 let oidcExpiry='absent';
 if(oidcPresent){
  oidcExpiry='unreadable';
  try{
   const token=env.VERCEL_OIDC_TOKEN;
   if(typeof token==='string'&&token.length<=32768){
    const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());
    if(Number.isFinite(claims?.exp))oidcExpiry=claims.exp*1000>now?'future':'expired';
   }
  }catch{}
 }
 return {blobTokenPresent,oidcPresent,storeIdPresent,oidcExpiry,blobAuthenticationConfigured:Boolean(blobTokenPresent||(oidcPresent&&storeIdPresent)),readyForAttempt:Boolean(blobTokenPresent||(storeIdPresent&&oidcExpiry==='future'))};
}
module.exports={inspectAuth};
