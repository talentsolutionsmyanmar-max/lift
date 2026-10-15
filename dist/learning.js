(function(root){'use strict';
const routes=['daily','dates','family','community','resources','language','steps','spending'];
const actions={daily:'daily',dates:'dates',family:'family',community:'community',resources:'resources',language:'language',steps:'steps',spending:'spending'};
const sourceIds={daily:'cfpb',dates:'lift',family:'lift',community:'unesco',resources:'unesco',language:'lift',steps:'lift',spending:'cfpb'};
const sources={cfpb:{url:'https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/toolkit/',label:'CFPB · English',scope:'General money education; not Thai financial advice',checked:'2026-10-15'},unesco:{url:'https://www.unesco.org/en/media-information-literacy/five-laws',label:'UNESCO · English',scope:'Information literacy principles; not individual service verification',checked:'2026-10-15'},lift:{url:null,label:'Lift',scope:'How this prototype works; not confirmation of an external outcome',checked:'2026-10-15'}};
function lesson(route){if(!routes.includes(route))return null;return {id:'lift-'+route+'-v1',version:1,route,action:actions[route],source:sourceIds[route],correct:'yes',options:routes.indexOf(route)%2?['no','yes']:['yes','no'],kind:'educational-example',qualifiedAdvice:false};}
function answer(route,value){return !!lesson(route)&&value==='yes';}
const api={routes,lesson,answer,sources};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LiftLearning=api;
})(typeof window!=='undefined'?window:globalThis);
