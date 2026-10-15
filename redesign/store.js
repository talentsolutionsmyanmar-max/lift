/* Lift store — single source of truth for state.
   Session by default. Optional LOCAL saving of standard selection-cards only,
   behind an explicit user choice, with honest failure handling.
   Never persists: raw money amounts, document dates, free text, community drafts. */
(function(root){
'use strict';
const KEY='lift-record-v1';
const listeners=new Set();
let saveAvailable=true;

/* A "record" is a saved result card. shape:
   {id, kind:'everyday'|'family', title, summary, nextAction, createdAt, updatedAt, selections:[keys]}
   Only standard selections + their labels' keys are stored — never amounts, dates, or free text. */
let state={
  // session-only working state
  everyday:{topic:null, selected:[], own:''},
  family:{topics:[], ready:[]},
  money:{period:'today', values:{}, result:null, error:null},
  cashflow:{values:{days:'7'}, result:null, error:false},
  community:{kind:'question', topic:'daily', text:''},
  dates:[],
  // durable (only if saveOn)
  saveOn:false,
  saved:[]          // saved record cards
};

/* ---- persistence ---- */
function loadSaved(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw) return {saveOn:false, saved:[], dates:[]};
    const p=JSON.parse(raw);
    if(!p||p.saveOn!==true) return {saveOn:false, saved:[], dates:[]};
    return {
      saveOn:true,
      saved: Array.isArray(p.saved)? p.saved.filter(r=>r&&typeof r.id==='string'&&typeof r.kind==='string').slice(0,50):[],
      // dates persist when saving is on — the reminder tool doesn't work otherwise (Opus Q6)
      dates: Array.isArray(p.dates)? p.dates.filter(d=>d&&typeof d.id==='string'&&typeof d.date==='string').slice(0,6):[]
    };
  }catch{ return {saveOn:false, saved:[], dates:[]}; }
}
function writeSaved(){
  if(!state.saveOn) { try{localStorage.removeItem(KEY);}catch{} return {ok:true}; }
  try{
    // durable payload: standard selection-cards + date reminders ONLY.
    // never: money amounts, free text, community drafts.
    localStorage.setItem(KEY, JSON.stringify({saveOn:true, saved:state.saved, dates:state.dates}));
    return {ok:true};
  }catch(e){ return {ok:false, error:e}; }
}
function init(){
  const p=loadSaved();
  state.saveOn=p.saveOn; state.saved=p.saved; state.dates=p.dates||[];
  saveAvailable=storageWorks();
}
function storageWorks(){
  try{const k='__lift_t';localStorage.setItem(k,'1');localStorage.removeItem(k);return true;}catch{return false;}
}

/* ---- mutation + notify ---- */
function emit(){ listeners.forEach(f=>f(state)); }
function on(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
function get(){ return state; }
function set(patch){ Object.assign(state, patch); }
function update(fn){ fn(state); }

/* ---- save choice ---- */
function setSaveOn(on){
  if(on){
    if(!storageWorks()){ saveAvailable=false; return {ok:false}; }
    state.saveOn=true;
    const w=writeSaved();
    if(!w.ok){ state.saveOn=false; return {ok:false,error:w.error}; }
    return {ok:true};
  }else{
    state.saveOn=false;
    try{localStorage.removeItem(KEY);}catch(e){ return {ok:false,error:e}; }
    return {ok:true};
  }
}
function saveRecord(rec){
  if(!state.saveOn) return {ok:false, reason:'off'};
  const now=new Date().toISOString();
  const existing=state.saved.findIndex(r=>r.id===rec.id);
  const clean={ id:String(rec.id), kind:String(rec.kind), title:String(rec.title||''),
    summary:String(rec.summary||''), nextAction:String(rec.nextAction||''),
    createdAt: existing>=0? state.saved[existing].createdAt : now,
    updatedAt: now, selections: Array.isArray(rec.selections)? rec.selections.map(String).slice(0,24):[] };
  if(existing>=0) state.saved[existing]=clean; else state.saved.unshift(clean);
  const w=writeSaved();
  if(!w.ok) return {ok:false, error:w.error};
  return {ok:true, record:clean};
}
function deleteRecord(id){
  const before=state.saved.length;
  state.saved=state.saved.filter(r=>r.id!==id);
  const w=writeSaved();
  if(!w.ok){ return {ok:false,error:w.error}; }
  return {ok:true, removed: state.saved.length<before};
}
function clearAllSaved(){
  state.saved=[]; state.dates=[]; state.saveOn=false;
  try{localStorage.removeItem(KEY); return {ok:true};}catch(e){ return {ok:false,error:e}; }
}

const api={init,on,get,set,update,emit,setSaveOn,saveRecord,deleteRecord,clearAllSaved,writeSaved,storageWorks:()=>storageWorks(),isSaveAvailable:()=>saveAvailable};
root.LIFT_STORE=api;
})(typeof window!=='undefined'?window:globalThis);
