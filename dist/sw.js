'use strict';
// Only generic application files are cached, and only after an explicit request.
// Personal plan values are never copied into Cache Storage.
const CACHE_NAME = 'lift-shell-v30';
const FILES = ['/', '/styles.css', '/myanmar.css', '/mobile.css', '/companion.css', '/companion-ui.js', '/community-intake.css', '/brand-cards.css', '/community-intake-copy.js', '/community-intake-client.js', '/community-intake-ui.js', '/community-intake-session.js', '/community-intake-availability.js', '/community-wall-copy.js', '/community-intake-route.js', '/community-wall-ui.js', '/learning.css', '/cashflow.js', '/learning.js', '/learning-copy.js', '/cashflow-ui.js', '/cash-transfer-copy.js', '/cashflow-transfer.js', '/cashflow-transfer-ui.js', '/learning-ui.js', '/myanmar.js', '/i18n.js', '/fonts/Padauk-Regular.ttf', '/fonts/Padauk-Bold.ttf', '/family.js', '/family-ui.js', '/dates.js', '/dates-ui.js', '/planner.js', '/spending.js', '/spending-ui.js', '/everyday-ui.js', '/community.js', '/community-data.js', '/choice-copy.js', '/community-choices.js', '/community-ui.js', '/workflow-copy.js', '/community-receipt-store.js', '/workflow.js', '/workflow-ui.js', '/app.js', '/extras.js', '/icon.svg', '/manifest.webmanifest'];
const ALLOWED = new Set(FILES.map(path => new URL(path,self.location.origin).href));
async function saveShell(){
  const responses = await Promise.all(FILES.map(async path=>{
    const response=await fetch(new Request(path,{cache:'reload',credentials:'same-origin'}));
    const type=response.headers.get('content-type') || '';
    if(!response.ok || response.redirected || ((path==='/' || path==='/index.html') && !type.includes('text/html'))) throw new Error('Application files could not be saved.');
    if(path==='/' || path==='/index.html') {
      const body=await response.clone().text();
      if(!body.includes('Lift — your next step, together') || !body.includes('id="main"')) throw new Error('A sign-in page cannot be saved as Lift.');
    }
    return [path,response];
  }));
  const cache=await caches.open(CACHE_NAME);
  await Promise.all(responses.map(([path,response])=>cache.put(path,response)));
}
self.addEventListener('install',event => event.waitUntil((async()=>{
  await saveShell();
  await self.skipWaiting();
})()));
self.addEventListener('message',event=>{
  if(event.data?.type!=='REFRESH_LIFT_SHELL' || !event.ports?.[0])return;
  event.waitUntil(saveShell().then(()=>event.ports[0].postMessage({ok:true})).catch(()=>event.ports[0].postMessage({ok:false})));
});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('lift-shell-') && key!==CACHE_NAME).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET' || new URL(request.url).origin!==self.location.origin) return;
  const url=new URL(request.url);url.hash='';
  // The app reads its view from the hash, never from query parameters.
  // Only top-level root navigation may fall back to the canonical saved shell.
  // Query strings themselves are never stored as cache keys or personalized pages.
  const appNavigation=request.mode==='navigate' && url.pathname==='/';
  if(appNavigation)url.search='';
  const cacheKey=appNavigation?url.href:request;
  if(!ALLOWED.has(url.href)) return;
  event.respondWith((async()=>{
    try {
      const response=await fetch(request);
      // A server-side denial/sign-in response is never replaced with an offline copy.
      if(response.ok && !response.redirected && url.pathname!=='/' && url.pathname!=='/index.html') {
        const type=response.headers.get('content-type')||'';
        if(!type.includes('text/html')) {
          const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());
        }
      }
      return response;
    } catch {
      const cache=await caches.open(CACHE_NAME);
      const saved=await cache.match(cacheKey,{ignoreSearch:false});
      return saved || new Response('This file is not available offline. Reconnect to continue.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  })());
});
