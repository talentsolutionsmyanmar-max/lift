'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function validatePack(pack,{root,release=false}={}){
 const errors=[],missing=[];const ids=new Set();
 if(!pack||!Array.isArray(pack.cards))return {valid:false,errors:['cards must be an array'],missing:[]};
 if(!pack.cards.length)errors.push('pack contains no cards');
 for(const card of pack.cards){
  const id=card.id||'(missing id)';
  if(!/^[a-z0-9-]+$/.test(id)||ids.has(id))errors.push(id+': invalid or duplicate id');ids.add(id);
  if(card.audience!=='adult')errors.push(id+': this prototype supports adult cards only');
  const required=['thaiText','thaiTextVersion','meaningLanguage','meaningText'];
  for(const field of required)if(typeof card[field]!=='string'||!card[field].trim())missing.push(id+': '+field);
  for(const field of ['thaiTextReview','meaningReview','rightsReview']){
   const review=card[field];
   if(!review||review.status!=='approved'||typeof review.reference!=='string'||!review.reference.trim())missing.push(id+': '+field);
  }
  for(const role of ['thaiNormal','thaiClear','homeLanguageMeaning']){
   const asset=card.audio?.[role];
   if(!asset){missing.push(id+': '+role);continue}
   const isMeaning=role==='homeLanguageMeaning';
   const expectedVersion=isMeaning?card.meaningTextVersion:card.thaiTextVersion;
   if(!expectedVersion||asset.textVersion!==expectedVersion)errors.push(id+': stale '+role+' text version');
   const currentText=isMeaning?card.meaningText:card.thaiText;
   if(typeof currentText!=='string'||asset.textSha256!==crypto.createHash('sha256').update(currentText).digest('hex'))errors.push(id+': stale '+role+' text hash');
   if(!asset.review||asset.review.status!=='approved'||!asset.review.reference)missing.push(id+': '+role+' review');
   if(!asset.rightsReference)missing.push(id+': '+role+' rights');
   if(!root){errors.push(id+': asset root required');continue}
   if(typeof asset.path!=='string'||path.isAbsolute(asset.path)){errors.push(id+': invalid '+role+' path');continue}
   const base=fs.realpathSync(root),target=path.resolve(base,asset.path);
   if(!target.startsWith(base+path.sep)){errors.push(id+': escaping '+role+' path');continue}
   try{
    const actual=fs.realpathSync(target);
    if(!actual.startsWith(base+path.sep)){errors.push(id+': escaping '+role+' symlink');continue}
    const bytes=fs.readFileSync(actual);
    if(!bytes.length||asset.bytes!==bytes.length)errors.push(id+': '+role+' size mismatch');
    if(crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)errors.push(id+': '+role+' hash mismatch');
   }catch(e){errors.push(id+': '+role+' asset unreadable')}
  }
  if(!card.meaningTextVersion)missing.push(id+': meaningTextVersion');
  if(card.readyForLearners===true&&(missing.some(x=>x.startsWith(id+':'))||errors.some(x=>x.startsWith(id+':'))))errors.push(id+': claims readiness with unresolved assets');
 }
 if(release&&missing.length)errors.push('release has missing content or review records');
 return {valid:errors.length===0,releaseReady:errors.length===0&&missing.length===0,errors,missing,limits:'Checks references, text versions, file bounds, sizes and hashes only. Does not prove audio decoding, pronunciation, rights validity, reviewer competence or phone usability.'};
}
module.exports={validatePack};
if(require.main===module){
 const file=process.argv[2];if(!file){console.error('Usage: node scripts/validate-audio-pack.cjs manifest.json [--release]');process.exit(2)}
 const pack=JSON.parse(fs.readFileSync(file,'utf8'));const result=validatePack(pack,{root:path.dirname(path.resolve(file)),release:process.argv.includes('--release')});console.log(JSON.stringify(result,null,2));process.exitCode=result.valid?0:1;
}
