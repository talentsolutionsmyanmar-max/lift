(function(root){'use strict';
function project({cash,days,daily,bills=[],income=0,incomeDay=null,delay=0,reduction=0}){
 for(const n of [cash,daily,income,reduction])if(!Number.isSafeInteger(n)||n<0)throw Error('amount');
 if(!Number.isInteger(days)||days<1||days>31||!Number.isInteger(delay)||delay<0||delay>31)throw Error('days');
 if(incomeDay!==null&&(!Number.isInteger(incomeDay)||incomeDay<1||incomeDay>31))throw Error('incomeDay');
 for(const bill of bills)if(!Number.isInteger(bill.day)||bill.day<1||bill.day>days||!Number.isSafeInteger(bill.amount)||bill.amount<0)throw Error('bill');
 let balance=cash,firstGap=null,lowest=cash;const timeline=[];
 for(let day=1;day<=days;day++){const due=bills.filter(b=>b.day===day).reduce((sum,b)=>sum+b.amount,0);const out=Math.max(0,daily-reduction)+due;
 // Conservatively show bills and daily costs before same-day expected income.
 const beforeIncome=balance-out;if(beforeIncome<0&&firstGap===null)firstGap=day;lowest=Math.min(lowest,beforeIncome);
 const incoming=incomeDay!==null&&day===incomeDay+delay?income:0;balance=beforeIncome+incoming;
 if(!Number.isSafeInteger(balance)||!Number.isSafeInteger(out))throw Error('amount');timeline.push({day,out,incoming,balance,beforeIncome});}
 return {timeline,firstGap,lowest,closing:balance,gap:Math.max(0,-lowest)};
}
const api={project};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LiftCashflow=api;
})(typeof window!=='undefined'?window:globalThis);
