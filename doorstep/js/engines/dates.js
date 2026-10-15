(function(root){
'use strict';
const processes=['unknown','report','stay','work','other'],sources=['receipt','notice','message'];
function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const year=Number(value.slice(0,4));if(year<1900||year>2200)return false;const date=new Date(value+'T00:00:00Z');return Number.isFinite(+date)&&date.toISOString().slice(0,10)===value;}
function normalize(values){const seen=new Set();return (Array.isArray(values)?values:[]).slice(0,6).flatMap(v=>{if(!v||typeof v!=='object'||!validDate(v.date)||typeof v.id!=='string'||! /^[a-zA-Z0-9-]{8,64}$/.test(v.id)||seen.has(v.id))return [];seen.add(v.id);return [{id:v.id,date:v.date,process:processes.includes(v.process)?v.process:'unknown',source:sources.includes(v.source)?v.source:'message',revision:Number.isInteger(v.revision)?Math.max(0,Math.min(9999,v.revision)):0}];});}
function keep(values,input){const list=normalize(values);if(input?.confirmed!==true||!validDate(input.date)||!processes.includes(input.process)||!sources.includes(input.source))throw Error('invalid');const existing=list.find(x=>x.id===input.id);if(!existing&&list.length>=6)throw Error('full');const record=normalize([{...input,revision:existing?existing.revision+1:0}])[0];if(!record)throw Error('invalid');return existing?list.map(x=>x.id===record.id?record:x):[...list,record];}
function escapeCalendar(s){return String(s).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
function fold(line){let out='',current='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){out+=current+'\r\n';current=' ';bytes=1;}current+=char;bytes+=size;}return out+current;}
function calendar(value,title,description,now=new Date()){
 const record=normalize([value])[0];if(!record||!Number.isFinite(+now))throw Error('invalid');const next=new Date(record.date+'T00:00:00Z');next.setUTCDate(next.getUTCDate()+1);
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Lift//Personal reminder//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+record.id+'@lift-next-step.vercel.app','DTSTAMP:'+now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'SEQUENCE:'+record.revision,'DTSTART;VALUE=DATE:'+record.date.replace(/-/g,''),'DTEND;VALUE=DATE:'+next.toISOString().slice(0,10).replace(/-/g,''),'SUMMARY:'+escapeCalendar(title),'DESCRIPTION:'+escapeCalendar(description),'TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';
}
const api={normalize,validDate,keep,calendar};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LiftDates=api;
})(typeof window!=='undefined'?window:globalThis);
