'use strict';
(function(root){
 function createAvailability({fetchImpl=root.fetch?.bind(root),timeoutMs=5000}={}){
  let value={submissionsOpen:false,receiptsOpen:false},active=null;
  return {current:()=>({...value}),refresh(){
   if(active)return active;
   const controller=typeof root.AbortController==='function'?new root.AbortController():null;let timer;
   const deadline=new Promise(resolve=>{timer=setTimeout(()=>{resolve(null);controller?.abort();},timeoutMs);});
   const read=async()=>{try{const r=await fetchImpl('/api/community-availability',{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',signal:controller?.signal});if(r.status!==200)return null;const body=await r.json();return typeof body?.submissionsOpen==='boolean'&&typeof body?.receiptsOpen==='boolean'&&(!body.submissionsOpen||body.receiptsOpen)?{submissionsOpen:body.submissionsOpen,receiptsOpen:body.receiptsOpen}:null;}catch{return null;}};
   active=Promise.race([read(),deadline]).then(next=>{value=next||{...value,submissionsOpen:false};return {...value};}).finally(()=>{clearTimeout(timer);active=null;});return active;
  }};
 }
 const api={createAvailability};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunityIntakeAvailability=api;
})(typeof window!=='undefined'?window:globalThis);
