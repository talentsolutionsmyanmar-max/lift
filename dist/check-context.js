'use strict';
(function(root){
 // Context comes from the text already on the device, never model reconstruction.
 function contexts(text,span){
  if(typeof text!=='string'||typeof span!=='string'||!span.trim())return [];
  const result=[];let offset=0;
  while(result.length<6){
   const index=text.indexOf(span,offset);if(index<0)break;
   const start=Math.max(0,index-60),end=Math.min(text.length,index+span.length+60);
   result.push({before:text.slice(start,index),value:span,after:text.slice(index+span.length,end),leading:start>0,trailing:end<text.length});
   offset=index+span.length;
  }
  return result;
 }
 const api={contexts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LIFT_CHECK_CONTEXT=api;
})(typeof window!=='undefined'?window:this);
