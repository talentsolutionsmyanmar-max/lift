'use strict';
(function(root){
 const topics=['daily','family','work','documents','health'];
 function normalize(value){return {kind:value?.kind==='experience'?'experience':'question',topic:topics.includes(value?.topic)?value.topic:'daily',text:typeof value?.text==='string'?value.text.slice(0,1200):''};}
 function valid(value){return typeof value?.text==='string'&&value.text.trim().length>0&&value.text.length<=1200&&topics.includes(value.topic)&&['question','experience'].includes(value.kind);}
 function appendPrompt(value,prompt){
  const draft=normalize(value);if(typeof prompt!=='string'||!prompt.trim())return {draft,status:'invalid'};
  const text=prompt.trim();if(draft.text.split('\n').some(line=>line.trim()===text))return {draft,status:'duplicate'};
  const next=draft.text.trim()?draft.text+'\n\n'+text:text;
  return next.length>1200?{draft,status:'full'}:{draft:{...draft,text:next},status:'added'};
 }
 function replacePrompt(value,previous,prompt){
  const draft=normalize(value),text=typeof prompt==='string'?prompt.trim():'';
  const base=previous?{...draft,text:draft.text.split('\n\n').filter(part=>part!==previous).join('\n\n')}:draft;
  if(!text)return {draft:base,status:'cleared',owned:false};
  const next=appendPrompt(base,text);
  if(next.status==='full'||next.status==='invalid')return {draft,status:next.status,owned:false};
  return {...next,owned:next.status==='added'};
 }
 function exportText(value,label){if(!valid(value))throw Error('Invalid draft');return [label('previewTitle'),label(value.kind),label(value.topic),value.text.trim(),label('draftNote')].join('\n\n');}
 function overdue(due,now=new Date()){const end=Date.parse(due+'T23:59:59Z');return !Number.isFinite(end)||now.getTime()>end;}
 const api={topics,normalize,valid,appendPrompt,replacePrompt,exportText,overdue};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunity=api;
})(typeof window!=='undefined'?window:globalThis);
