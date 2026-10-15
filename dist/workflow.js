(function(root){
 'use strict';
 const groups={home:'home',about:'home',life:'life',daily:'life',spending:'life',dates:'life',language:'life',prepare:'life',resources:'life',family:'family',community:'community',mine:'mine',steps:'mine',privacy:'mine',receipts:'mine'};
 const navigation=[{route:'home',label:'Home',copy:'navHome',icon:'home'},{route:'life',label:'Daily life',copy:'navLife',icon:'people'},{route:'family',label:'Family',copy:'navFamily',icon:'learn'},{route:'community',label:'Community',copy:'navCommunity',icon:'people'},{route:'mine',label:'Mine',copy:'navMine',icon:'steps'}];
 const api={navigation,group:route=>groups[route]||'home'};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.LiftWorkflow=api;
})(typeof window==='undefined'?globalThis:window);
