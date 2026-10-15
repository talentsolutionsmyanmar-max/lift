'use strict';
(function(root){
 const KEY='lift-private-community-receipt-v1',TTL=14*86400000;
 const valid=value=>typeof value==='string'&&/^[A-Za-z0-9_-]{43}$/.test(value);
 function createStore({storage,now=()=>Date.now()}={}){
  function forget(){try{storage?.removeItem(KEY);return true;}catch{return false;}}
  function load(){try{const value=JSON.parse(storage?.getItem(KEY)||'null');if(!value)return null;if(!valid(value.receipt)||!Number.isFinite(value.expiresAt)||value.expiresAt<=now()||value.expiresAt>now()+TTL){forget();return null;}return value.receipt;}catch{return null;}}
  function save(receipt){if(!valid(receipt)||!storage)return false;try{storage.setItem(KEY,JSON.stringify({receipt,expiresAt:now()+TTL}));return load()===receipt;}catch{return false;}}
  return {load,save,forget};
 }
 const api={createStore};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunityReceiptStore=api;
})(typeof window!=='undefined'?window:globalThis);
