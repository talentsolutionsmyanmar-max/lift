/* Lift Doorstep — explicit state.
   DATA BOUNDARIES (frontend assignment, 15 Oct 2026):
   - Everything lives in memory by default.
   - Only after an explicit confirm may a card be written to localStorage, and only:
     kind, whitelisted choice keys (everyday question keys / family topic keys), next-action id, savedAt.
   - Never written: money amounts, document dates, free text, community drafts, preferences.
   - A failed write never reports success; a failed delete never reports success. */
(function(root){'use strict';
const KEY='lift.doorstep.saved.v1';
const EQ_TOPICS=['housing','transport','phone','food'];
const EQ_KEYS=EQ_TOPICS.flatMap(t=>[1,2,3].map(n=>t+n));
const FAM_TOPICS=['start','language','routine','device','cost','support'];
const SAVABLE={everyday:1,family:1};
const MAX=20;
const blankDrafts=()=>({
  everyday:{topic:null,selected:[],unsure:false,else:false},
  family:{topics:[]},
  dates:{process:null,date:'',source:null,confirmed:false},
  money:{period:null,available:'',food:'',home:'',travel:'',phone:'',other:''},
  cash:{cash:'',days:'14',daily:'',bill:'',billDay:'',income:'',incomeDay:''},
  community:{purpose:null,starter:null,question:''}
});
const S={drafts:blankDrafts(),cards:[],editing:{},errors:{},storage:{available:null,loadError:false}};

/* ---------- local persistence (opt-in only) ---------- */
function storageAvailable(){
  try{const k='__lift_probe__';root.localStorage.setItem(k,'1');root.localStorage.removeItem(k);return true;}catch{return false;}
}
function validRecord(r){
  if(!r||typeof r!=='object'||!SAVABLE[r.kind]||typeof r.id!=='string'||!/^[a-z0-9-]{6,40}$/.test(r.id))return null;
  if(r.kind==='everyday'){
    if(!EQ_TOPICS.includes(r.topic))return null;
    const keys=(Array.isArray(r.keys)?r.keys:[]).filter(k=>EQ_KEYS.includes(k)&&k.startsWith(r.topic));
    if(!keys.length)return null; return {id:r.id,kind:'everyday',data:{topic:r.topic,keys:[...new Set(keys)]},savedAt:+r.savedAt||0};
  }
  const topics=(Array.isArray(r.topics)?r.topics:[]).filter(k=>FAM_TOPICS.includes(k));
  if(!topics.length)return null; return {id:r.id,kind:'family',data:{topics:[...new Set(topics)]},savedAt:+r.savedAt||0};
}
/* Read the stored collection. Any failure (exception, unparsable or non-array data) is reported as
   {ok:false} — it is NEVER treated as an empty collection, because a mutation built on that would
   overwrite other saved cards. Mutations work on the raw records so unrelated entries are kept byte-for-byte. */
function readRaw(){
  try{const raw=root.localStorage.getItem(KEY);if(raw===null)return {ok:true,raw:[]};const list=JSON.parse(raw);if(!Array.isArray(list))return {ok:false};return {ok:true,raw:list};}
  catch{return {ok:false};}
}
function readSaved(){const r=readRaw();if(!r.ok){S.storage.loadError=true;return [];}return r.raw.map(validRecord).filter(Boolean).slice(0,MAX);}
function serialise(card){
  return card.kind==='everyday'?{id:card.id,kind:'everyday',topic:card.data.topic,keys:[...card.data.keys],next:'show-card',savedAt:Date.now()}
                               :{id:card.id,kind:'family',topics:[...card.data.topics],next:'ask-educator',savedAt:Date.now()};
}
function writeSaved(list){root.localStorage.setItem(KEY,JSON.stringify(list));}
const sig=card=>JSON.stringify(card.kind==='everyday'?[card.data.topic,[...card.data.keys].sort()]:[[...card.data.topics].sort()]);

function init(){
  S.storage.available=storageAvailable();
  if(S.storage.available){
    for(const r of readSaved()) S.cards.push({id:r.id,kind:r.kind,data:r.data,createdAt:r.savedAt,updatedAt:r.savedAt,saved:true,savedSig:sig({kind:r.kind,data:r.data})});
  }
}
/* returns {ok:true} or {ok:false, reason} — callers must not claim success otherwise.
   Saving: abort if the existing collection cannot be read; after writing, read back and compare the
   stored CONTENT (normalised topic/keys or topics) with the intended payload, not just the id. */
function save(id){
  const card=S.cards.find(c=>c.id===id); if(!card||!SAVABLE[card.kind])return {ok:false,reason:'unsavable'};
  try{
    if(!storageAvailable())return {ok:false,reason:'unavailable'};
    const before=readRaw(); if(!before.ok)return {ok:false,reason:'read'};
    const others=before.raw.filter(r=>!(r&&r.id===id));
    if(others.length>=MAX)return {ok:false,reason:'full'};
    writeSaved([serialise(card),...others]);
    const after=readRaw(); if(!after.ok)return {ok:false,reason:'verify-read'};
    const stored=validRecord(after.raw.find(r=>r&&r.id===id));
    if(!stored||sig(stored)!==sig(card))return {ok:false,reason:'verify-content'};
    if(after.raw.filter(r=>!(r&&r.id===id)).length!==others.length)return {ok:false,reason:'verify-others'};
    card.saved=true; card.savedSig=sig(card); return {ok:true};
  }catch(e){return {ok:false,reason:e.message};}
}
/* Removing: abort (and report failure) if the collection cannot be read; otherwise remove only this id
   and verify it is gone while every other record survives. */
function remove(id){
  const card=S.cards.find(c=>c.id===id); if(!card)return {ok:true};
  if(card.saved){
    try{
      const before=readRaw(); if(!before.ok)return {ok:false,reason:'read'};
      const others=before.raw.filter(r=>!(r&&r.id===id));
      writeSaved(others);
      const after=readRaw(); if(!after.ok)return {ok:false,reason:'verify-read'};
      if(after.raw.some(r=>r&&r.id===id)||after.raw.length!==others.length)return {ok:false,reason:'verify'};
    }catch(e){return {ok:false,reason:e.message};}
  }
  S.cards=S.cards.filter(c=>c.id!==id); return {ok:true};
}
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
/* create or update the card for an activity from its draft */
function commit(kind,data){
  const editId=S.editing[kind]; let card=editId&&S.cards.find(c=>c.id===editId);
  const now=Date.now();
  if(card){card.data=data;card.updatedAt=now;}
  else{card={id:uid(),kind,data,createdAt:now,updatedAt:now,saved:false,savedSig:null};S.cards.unshift(card);}
  S.editing[kind]=card.id; return card;
}
function status(card){
  if(!SAVABLE[card.kind])return 'never';
  if(!card.saved)return 'unsaved';
  return card.savedSig===sig(card)?'saved':'changed';
}
root.LiftStore={S,init,save,remove,commit,status,blankDrafts,EQ_TOPICS,EQ_KEYS,FAM_TOPICS,SAVABLE,KEY,_sig:sig};
})(window);
