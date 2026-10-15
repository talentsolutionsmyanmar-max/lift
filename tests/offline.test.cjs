const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync(require.resolve('../dist/sw.js'),'utf8');
const origin='https://lift.example';
function harness(fetcher){
  const listeners={},saved=new Map(),writes=[];
  class LocalRequest extends Request {constructor(input,options){super(typeof input==='string'?new URL(input,origin).href:input,options);}}
  const self={location:{origin},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
  const cache={put:async(key,response)=>{const url=typeof key==='string'?new URL(key,origin).href:key.url;saved.set(url,response);writes.push(url);},match:async key=>saved.get(typeof key==='string'?new URL(key,origin).href:key.url)};
  const caches={open:async()=>cache,keys:async()=>[],delete:async()=>true};
  vm.runInNewContext(source,{self,caches,fetch:fetcher,URL,Request:LocalRequest,Response,Set,Promise,Error});
  return {listeners,saved,writes};
}
function request(h,url,options={}){const {navigation,...requestOptions}=options;const req=new Request(url,requestOptions);if(navigation)Object.defineProperty(req,'mode',{value:'navigate'});let result;h.listeners.fetch({request:req,respondWith:p=>{result=p;}});return result;}
test('external URLs, unknown paths, query variants and writes are not intercepted',()=>{
  const h=harness(()=>{throw Error('must not fetch');});
  for(const [url,options] of [['https://other.example/',{}],[origin+'/private-record',{}],[origin+'/app.js?private=value',{}],[origin+'/',{method:'POST'}]])assert.equal(request(h,url,options),undefined);
});
test('network failure can return only the previously saved generic app file',async()=>{
  const h=harness(async()=>{throw Error('offline');});h.saved.set(origin+'/',new Response('saved app'));
  assert.equal(await (await request(h,origin+'/')).text(),'saved app');
  assert.equal((await request(h,origin+'/app.js')).status,503);
});
test('server-side access denial is not replaced by cached content',async()=>{
  const h=harness(async()=>new Response('Access denied',{status:403}));h.saved.set(origin+'/',new Response('saved app'));
  const response=await request(h,origin+'/');assert.equal(response.status,403);assert.equal(await response.text(),'Access denied');
});
test('an HTML sign-in response is never saved as a script',async()=>{
  const h=harness(async()=>new Response('Sign in',{headers:{'Content-Type':'text/html'}}));
  await request(h,origin+'/app.js');assert.equal(h.writes.length,0);
});
test('install rejects a sign-in page before writing any cache entries',async()=>{
  const h=harness(async()=>new Response('Sign in',{headers:{'Content-Type':'text/html'}}));let installed;
  h.listeners.install({waitUntil:p=>{installed=p;}});await assert.rejects(installed,/sign-in page/);assert.equal(h.writes.length,0);
});
test('refresh reports failure instead of claiming pages were saved',async()=>{
  const h=harness(async()=>{throw Error('offline');});let refresh,message;
  h.listeners.message({data:{type:'REFRESH_LIFT_SHELL'},ports:[{postMessage:value=>{message=value;}}],waitUntil:p=>{refresh=p;}});
  await refresh;assert.equal(message.ok,false);
});
test('installation uses the canonical root and does not request the host-redirected index path',async()=>{
  const paths=[];
  const h=harness(async request=>{
    const path=new URL(request.url).pathname;paths.push(path);
    assert.notEqual(path,'/index.html');
    return new Response(path==='/'?'<title>Lift — your next step, together</title><main id="main"></main>':'static asset',{headers:{'Content-Type':path==='/'?'text/html':'text/javascript'}});
  });let installed;
  h.listeners.install({waitUntil:p=>{installed=p;}});await installed;
  assert.equal(h.writes.length,paths.length);
  const index=readFileSync(require.resolve('../dist/index.html'),'utf8');
  const linked=[...index.matchAll(/(?:src|href)="\.\/([^"]+\.(?:js|css))"/g)].map(match=>'/'+match[1]);
  for(const path of [...linked,'/fonts/Padauk-Regular.ttf','/fonts/Padauk-Bold.ttf'])assert.ok(paths.includes(path),path);
});

test('offline root navigation with a query uses the canonical shell without saving query data',async()=>{
 const h=harness(async()=>{throw Error('offline');});h.saved.set(origin+'/',new Response('generic app'));
 const response=await request(h,origin+'/?utm_source=shared',{navigation:true});
 assert.equal(await response.text(),'generic app');assert.deepEqual(h.writes,[]);
 assert.equal(request(h,origin+'/?utm_source=shared'),undefined);
});
test('query navigation never replaces an online denial with the saved shell',async()=>{
 const seen=[];const h=harness(async req=>{seen.push(req.url);return new Response('Access denied',{status:403});});h.saved.set(origin+'/',new Response('generic app'));
 const response=await request(h,origin+'/?from=share',{navigation:true});
 assert.equal(response.status,403);assert.equal(await response.text(),'Access denied');assert.deepEqual(seen,[origin+'/?from=share']);assert.deepEqual(h.writes,[]);
});
test('query variants of scripts and unknown paths remain outside the cache handler even during navigation',()=>{
 const h=harness(()=>{throw Error('must not fetch');});
 for(const url of [origin+'/app.js?x=1',origin+'/survey?x=1',origin+'/private?x=1','https://other.example/?x=1'])assert.equal(request(h,url,{navigation:true}),undefined);
});
