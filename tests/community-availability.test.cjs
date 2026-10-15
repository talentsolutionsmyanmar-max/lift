const test=require('node:test'),assert=require('node:assert/strict'),{capabilities,allowed}=require('../lib/community-availability.cjs'),{makeHandler}=require('../api/community-availability.js');
const config={COMMUNITY_RECEIPT_SECRET:'test-only-secret-32-characters-long',COMMUNITY_INTAKE_ENABLED:'true',COMMUNITY_REVIEW_READY:'v1'};
test('stopping intake or removing reviewer readiness preserves receipt operations',()=>{
 for(const c of [{...config,COMMUNITY_INTAKE_ENABLED:'false'},{...config,COMMUNITY_REVIEW_READY:''}]){assert.equal(allowed(c,'submit'),false);assert.equal(allowed(c,'status'),true);assert.equal(allowed(c,'withdraw'),true);assert.equal(allowed(c,'list'),false);}
 assert.deepEqual(capabilities(config),{submissionsOpen:true,receiptsOpen:true});
});
test('missing credentials fail closed for all operations',()=>{for(const c of [{},{...config,COMMUNITY_RECEIPT_SECRET:'short'}]){assert.deepEqual(capabilities(c),{submissionsOpen:false,receiptsOpen:false});for(const action of ['submit','status','withdraw'])assert.equal(allowed(c,action),false);}});
test('availability exposes booleans only, never secret or operational config values',()=>{
 const r={headers:{},setHeader(k,v){this.headers[k]=v},status(v){this.code=v;return this},json(v){this.body=v;return this}};makeHandler({env:()=>config})({method:'GET'},r);assert.equal(r.code,200);assert.equal(r.headers['Cache-Control'],'no-store');assert.deepEqual(Object.keys(r.body).sort(),['receiptsOpen','submissionsOpen']);assert.equal(JSON.stringify(r.body).includes(config.COMMUNITY_RECEIPT_SECRET),false);
});
