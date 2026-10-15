(function(root){
'use strict';
const fields=['available','food','home','travel','phone','other'];
function parse(value){
 if(typeof value!=='string')throw Error('invalid');
 const text=value.trim().replace(/[၀-၉]/g,c=>String(c.charCodeAt(0)-0x1040));
 if(!text)return null;
 if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text))throw Error('invalid');
 const parts=text.replace(/,/g,'').split('.');const cents=Number(parts[0])*100+Number((parts[1]||'').padEnd(2,'0'));
 if(!Number.isSafeInteger(cents)||cents>999999999)throw Error('invalid');return cents;
}
function calculate(input){
 const amounts={};let entered=false;
 for(const name of fields){const amount=parse(input[name]??'');amounts[name]=amount??0;if(amount!==null)entered=true;}
 if(!entered)throw Error('empty');
 const costs=fields.slice(1).reduce((sum,key)=>sum+amounts[key],0);
 return {available:amounts.available,costs,remaining:amounts.available-costs};
}
const api={fields,parse,calculate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LiftSpending=api;
})(typeof window!=='undefined'?window:globalThis);
