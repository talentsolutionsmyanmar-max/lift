'use strict';
const {cleanupExpiredQuestions}=require('./community-retention.cjs');
async function cleanupCommunity({list,del,store,now=Date.now()}){
 let removed=await cleanupExpiredQuestions({list,store,now}),cursor;
 do{const page=await list({prefix:'community-limits/',cursor,limit:1000});
  const stale=page.blobs.filter(b=>b.pathname.startsWith('community-limits/')&&Number.isFinite(new Date(b.uploadedAt).getTime())&&now-new Date(b.uploadedAt).getTime()>2*86400000);
  if(stale.length){await del(stale.map(b=>b.url));removed+=stale.length;}
  if(page.hasMore&&!page.cursor)throw Error('Invalid quota pagination');cursor=page.hasMore?page.cursor:undefined;
 }while(cursor);
 return removed;
}
module.exports={cleanupCommunity};
