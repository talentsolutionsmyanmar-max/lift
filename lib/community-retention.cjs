'use strict';
// Authoritative expiry, not upload age: an editor's update must not extend retention.
async function cleanupExpiredQuestions({list,store,now=Date.now()}){
 let cursor,removed=0;
 do{
  const page=await list({prefix:'community-private/v1/',cursor,limit:1000});
  for(const item of page.blobs){
   if(!/^community-private\/v1\/[a-f0-9]{64}\.json$/.test(item.pathname))continue;
   const current=await store.read(item.pathname);if(!current)continue;
   const expiry=Date.parse(current.value?.expiresAt);
   if(!Number.isFinite(expiry)||!current.etag)throw Error('Community retention record needs inspection');
   if(expiry>now)continue;
   try{await store.remove(item.pathname,current.etag);removed++;}catch(error){if(error.code!=='CONFLICT')throw error;}
  }
  if(page.hasMore&&!page.cursor)throw Error('Invalid retention pagination');cursor=page.hasMore?page.cursor:undefined;
 }while(cursor);
 return removed;
}
module.exports={cleanupExpiredQuestions};
