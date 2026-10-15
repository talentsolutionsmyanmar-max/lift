(function(root){'use strict';
const topics=['start','language','routine','device','cost','support'];
function normalize(value){const selected=Array.isArray(value?.topics)?[...new Set(value.topics.filter(x=>topics.includes(x)))]:['start'];return {topics:selected,ready:Array.isArray(value?.ready)?[...new Set(value.ready.filter(x=>selected.includes(x)))]:[]};}
function toggleTopic(value,key,checked){const state=normalize(value);if(!topics.includes(key))return state;return normalize({...state,topics:checked?[...state.topics,key]:state.topics.filter(x=>x!==key)});}
function toggleReady(value,key,checked){const state=normalize(value);if(!state.topics.includes(key))return state;return normalize({...state,ready:checked?[...state.ready,key]:state.ready.filter(x=>x!==key)});}
function questionKeys(value){return normalize(value).topics.map(key=>key+'Q');}
const api={topics,normalize,toggleTopic,toggleReady,questionKeys};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LiftFamily=api;
})(typeof window!=='undefined'?window:globalThis);
