'use strict';
(function(root){
 const MAX=999999999;
 function offer(result,period){if(!['today','week','month'].includes(period)||!result)return null;const {available,costs,remaining}=result;if(![available,costs,remaining].every(Number.isSafeInteger)||available<0||costs<0||remaining<0||remaining>MAX||available-costs!==remaining)return null;return {amount:remaining,period,key:[period,available,costs,remaining].join(':')};}
 function accept(proposal,current,{confirmed=false,key}={}){if(!proposal||confirmed!==true||proposal.key!==key||!current||String(current.cash??'')!=='')return null;if(!Number.isSafeInteger(proposal.amount)||proposal.amount<0||proposal.amount>MAX)return null;return {...current,cash:(proposal.amount/100).toFixed(2)};}
 const api={offer,accept};if(typeof module!=='undefined')module.exports=api;else root.LiftCashflowTransfer=api;
})(typeof window!=='undefined'?window:globalThis);
