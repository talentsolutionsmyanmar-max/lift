'use strict';
// Operator-only CLI. Never invoked by an API or background model.
const fs=require('node:fs/promises'),path=require('node:path');
const {makeStore}=require('../lib/community-blob.cjs');
const {makeReviewer}=require('../lib/community-review.cjs');
const {reviewQueue,humanReviewPacket}=require('../lib/community-review-queue.cjs');
async function privateOutput(filename,value){
 const root=await fs.realpath(path.resolve(__dirname,'..')),target=path.resolve(filename),parent=await fs.realpath(path.dirname(target));
 if(parent===root||parent.startsWith(root+path.sep))throw Error('Review exports must stay outside the repository');
 await fs.writeFile(path.join(parent,path.basename(target)),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
}
async function main(args){
 const [action,key,input,output]=args,store=makeStore(),reviewer=makeReviewer({store});
 if(action==='queue'){
  if(args.length!==2||!key)throw Error('Usage: community-review.cjs queue <private-output.json>');
  const result=await reviewQueue({list:require('@vercel/blob').list,store});
  await privateOutput(key,result);console.log('Prepared private queue metadata. No question text printed or sent to a model.');return;
 }
 if(action==='open'){
  if(args.length!==4||output!=='--human-review'||!key||!input)throw Error('Usage: community-review.cjs open <key> <private-output.json> --human-review');
  await privateOutput(input,await humanReviewPacket({key,store,humanReviewConfirmed:true}));
  console.log('Prepared private human-review packet. Do not send the original packet to a model.');return;
 }
 if(!['ai-packet','ai-pass','approve-reply'].includes(action)||!key||!input)throw Error('Usage: community-review.cjs ai-packet <key> <redaction.json> <private-output.json> | ai-pass <key> <pass.json> | approve-reply <key> <reply-and-review.json>');
 const value=JSON.parse(await fs.readFile(input,'utf8'));
 if(action==='ai-packet'){if(!output)throw Error('A private output path is required');await privateOutput(output,await reviewer.aiPacket(key,value));console.log('Prepared a consent-checked, redacted AI packet. Nothing sent to a model.');}
 if(action==='ai-pass'){await reviewer.saveAIPass(key,value);console.log('Saved AI first-pass status only. No reply or post approved.');}
 if(action==='approve-reply'){await reviewer.approveReply(key,value.reply,value.review);console.log('Saved a reviewed private reply. Nothing published to the community board.');}
}
if(require.main===module)main(process.argv.slice(2)).catch(()=>{console.error('Review operation did not complete. No private content is printed. Check inputs, permissions, expiry and storage availability.');process.exitCode=1});
module.exports={privateOutput};
