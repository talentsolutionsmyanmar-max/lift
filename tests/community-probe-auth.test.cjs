const test=require('node:test'),assert=require('node:assert/strict');
const {inspectAuth}=require('../scripts/community-probe-auth.cjs');
const jwt=claims=>'header.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.signature';
test('expired development identity is refused even with a store ID',()=>{
 const state=inspectAuth({VERCEL_OIDC_TOKEN:jwt({exp:100}),BLOB_STORE_ID:'store-test'},100000);
 assert.equal(state.oidcExpiry,'expired');assert.equal(state.readyForAttempt,false);
});
test('future expiry requires the store ID and does not imply authenticated access',()=>{
 const env={VERCEL_OIDC_TOKEN:jwt({exp:101})};
 assert.equal(inspectAuth(env,100000).readyForAttempt,false);
 assert.equal(inspectAuth({...env,BLOB_STORE_ID:'store-test'},100000).readyForAttempt,true);
});
test('malformed, missing or nonnumeric expiry is refused without echoing credentials',()=>{
 for(const token of ['private-token',jwt({}),jwt({exp:'999999999999'})]){
  const state=inspectAuth({VERCEL_OIDC_TOKEN:token,BLOB_STORE_ID:'private-store'});
  assert.equal(state.oidcExpiry,'unreadable');assert.equal(state.readyForAttempt,false);
  assert.equal(JSON.stringify(state).includes(token),false);assert.equal(JSON.stringify(state).includes('private-store'),false);
 }
});
test('independent Blob token can be attempted without OIDC',()=>{
 assert.equal(inspectAuth({BLOB_READ_WRITE_TOKEN:'private-token'}).readyForAttempt,true);
 assert.equal(inspectAuth({}).readyForAttempt,false);
});
