'use strict';
(()=>{
 const $=id=>document.getElementById(id),copy=window.CHECK_COPY;
 let language='my',answer=null,imageReady=false,busy=false,reviewed=false,originalText='',myanmarAiReady=false;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const t=k=>copy[language][k]||copy.en[k]||k;
 const sample='DEMONSTRATION ONLY — NOT A REAL NOTICE. A message says: “Pay 2,500 baht by 20 October 2026. We will do your TM.47 90-day report. This automatically extends your stay for another three months and gives every pink-card holder permission to work anywhere.” Is that what a TM.47 does?';
 let sourceList=[];
 function renderSources(sources){$('sources').innerHTML=sources.map(s=>`<article class="source-card"><h3><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${t(s.id==='forms'?'formsTitle':'servicesTitle')}</a></h3><small>${t('checked')}: ${esc(s.checkedAt)}</small><p>${t('scopeLabel')}: ${t(s.id==='forms'?'formsScope':'servicesScope')}</p>${s.state&&s.state!=='available'?`<p class="note">${t(s.state==='expired'?'expired':'offlineSource')}</p>`:''}</article>`).join('')}
 function applyAvailability(){
  const held=language==='my'&&!myanmarAiReady;
  $('language-hold').hidden=!held;
  $('language-hold').textContent=held?t('unavailable'):'';
  for(const el of $('check-form').elements)el.disabled=busy||held;
 }
 function renderCopy(){document.documentElement.lang=language;for(const el of document.querySelectorAll('[data-t]'))el.textContent=t(el.dataset.t);for(const el of document.querySelectorAll('[data-placeholder]'))el.placeholder=t(el.dataset.placeholder);document.title='Lift — '+t('checkLink');renderSources(sourceList);if(answer)renderResult();applyAvailability()}
 function message(key){$('status').textContent=t(key);$('status').focus()}
 function factText(key,a){
  if(!a[key]?.length)return `<p>${t('none')}</p>`;
  return a[key].map(value=>{
   const spans=['dates','amounts'].includes(key)?window.LIFT_CHECK_CONTEXT.contexts(originalText,value):[];
   return `<p>${esc(value)}</p>${spans.map(span=>`<blockquote>${span.leading?'…':''}${esc(span.before)}<mark>${esc(span.value)}</mark>${esc(span.after)}${span.trailing?'…':''}</blockquote>`).join('')}`;
  }).join('');
 }
 function renderResult(){
  const a=answer;
  $('result').hidden=false;
  $('result').innerHTML=`<div class="result-header"><span class="badge">${t(reviewed?'reviewed':'draft')}</span><p>${t('model')}: ${esc(a.model)}</p><small>${t('twoPass')}</small></div><article class="result-card"><h2>${t('summary')}</h2><p>${esc(a.summary)}</p>${a.transcript?`<details><summary>${t('readImage')}</summary><p>${esc(a.transcript)}</p></details>`:''}</article><article class="result-card"><h2>${t('facts')}</h2>${['dates','amounts','documents','questions'].map(key=>`<h3>${t(key)}</h3>${factText(key,a)}`).join('')}</article><h2>${t('claims')}</h2>${!a.claims.length?`<p>${t('none')}</p>`:''}${a.claims.map(c=>`<article class="result-card"><span class="badge ${esc(c.finding)}">${t(c.finding)}</span><h3>${esc(c.claim)}</h3><p>${esc(c.reason)}</p>${c.evidence.map(e=>{const s=a.sources.find(x=>x.id===e.sourceId);return `<small>${t('evidence')}</small><blockquote>${esc(e.quote)}</blockquote><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${t(s.id==='forms'?'formsTitle':'servicesTitle')}</a>`}).join('')}</article>`).join('')}<article class="result-card"><h2>${t('uncertainty')}</h2><ul>${a.uncertainty.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></article><article class="result-card"><h2>${t('next')}</h2><ul class="action-list">${a.actions.map((s,i)=>`<li><label><input type="checkbox" data-action-index="${i}" ${a.completed?.includes(i)?'checked':''}><span>${esc(s)}</span></label></li>`).join('')}</ul><h3>${t('questions')}</h3><ul>${a.questions.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></article><div class="result-actions"><button type="button" id="open-review">${t('review')}</button><button type="button" id="download-plan">${t('download')}</button><a href="/#prepare">${t('prepare')}</a><button type="button" id="clear-result">${t('clear')}</button></div><form id="review-form" class="review-panel" hidden><h2>${t('review')}</h2><p>${t('reviewNote')}</p><label>${t('summary')}<textarea id="review-summary" rows="5" maxlength="2000">${esc(a.summary)}</textarea></label><label>${t('next')}<textarea id="review-actions" rows="6" maxlength="5000">${esc(a.actions.join('\n'))}</textarea></label>${['dates','amounts','documents','questions'].map(key=>`<label>${t(key)}<textarea id="review-${key}" rows="2" maxlength="4000">${esc(a[key].join('\n'))}</textarea></label>`).join('')}${a.claims.map((c,i)=>`<label>${esc(c.claim)}<select data-review-finding="${i}"><option value="${esc(c.finding)}">${t(c.finding)}</option>${c.finding!=='unverified'?`<option value="unverified">${t('unverified')}</option>`:''}</select><textarea data-review-reason="${i}" rows="3" maxlength="1200">${esc(c.reason)}</textarea></label>`).join('')}<label class="consent"><input id="review-confirm" type="checkbox" required><span>${t('reviewConfirm')}</span></label><button class="primary" type="submit">${t('saveReview')}</button></form>${reviewed?`<button type="button" id="download-review">${t('downloadReview')}</button>`:''}`;
  $('open-review').onclick=()=>{$('review-form').hidden=false;$('review-summary').focus()};
  $('review-form').onsubmit=e=>{e.preventDefault();if(!$('review-confirm').checked)return;answer={...answer,originalAiDraft:answer.originalAiDraft||JSON.parse(JSON.stringify({summary:answer.summary,dates:answer.dates,amounts:answer.amounts,documents:answer.documents,questions:answer.questions,claims:answer.claims,actions:answer.actions})),summary:$('review-summary').value.trim(),actions:$('review-actions').value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,6),completed:[],reviewStatus:'local_review',localReviewedAt:new Date().toISOString()};for(const key of ['dates','amounts','documents','questions'])answer[key]=$('review-'+key).value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,6);answer.claims=answer.claims.map((c,i)=>({...c,finding:document.querySelector(`[data-review-finding="${i}"]`).value,reason:document.querySelector(`[data-review-reason="${i}"]`).value.trim()}));reviewed=true;renderResult();$('result').scrollIntoView({behavior:'smooth'})};
  $('download-plan').onclick=()=>download('my-lift-information-check.txt',`${t(reviewed?'reviewed':'draft')}\n${a.summary}\n\n${t('next')}\n${a.actions.map((s,i)=>`${a.completed?.includes(i)?'[x]':'[ ]'} ${s}`).join('\n')}\n\n${t('questions')}\n${a.questions.join('\n')}\n\n${a.sources.map(s=>s.url).join('\n')}\n\n${t('limit')}`,'text/plain');
  if($('download-review'))$('download-review').onclick=()=>download('lift-local-review.json',JSON.stringify({...answer,reviewerIdentityVerified:false,independentReviewVerified:false,reviewed,language},null,2),'application/json');
  $('clear-result').onclick=()=>{answer=null;originalText='';reviewed=false;imageReady=false;$('preview').width=1;$('image-tools').hidden=true;$('image').value='';$('check-form').reset();$('result').hidden=true;$('result').replaceChildren();$('sample-note').hidden=true;$('status').textContent='';$('message').focus()};
  for(const el of document.querySelectorAll('[data-action-index]'))el.onchange=()=>{const i=Number(el.dataset.actionIndex),done=answer.completed||[];answer.completed=el.checked?[...new Set([...done,i])]:done.filter(n=>n!==i)};
 }
 function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type:type+';charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 $('locale').onchange=()=>{language=$('locale').value;renderCopy()};
 $('size').onclick=()=>{$('size').setAttribute('aria-pressed',String(document.body.classList.toggle('large')))};
 $('sample').onclick=()=>{$('message').value=sample;$('sample-note').hidden=false;$('message').focus()};
 $('remove-image').onclick=()=>{imageReady=false;$('preview').width=1;$('image-tools').hidden=true;$('image').value=''};
 $('image').onchange=async()=>{
  const file=$('image').files[0];if(!file)return;
  if(file.size>12*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type)){message('imageError');imageReady=false;$('image-tools').hidden=true;$('preview').width=1;$('image').value='';return}
  let url;
  try{url=URL.createObjectURL(file);const image=new Image();image.src=url;await image.decode();const scale=Math.min(1,1400/Math.max(image.width,image.height)),canvas=$('preview');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);imageReady=true;$('image-tools').hidden=false}catch{imageReady=false;$('image-tools').hidden=true;$('preview').width=1;message('imageError')}finally{if(url)URL.revokeObjectURL(url)}
 };
 let start=null;
 const point=e=>{const r=$('preview').getBoundingClientRect();return {x:(e.clientX-r.left)*$('preview').width/r.width,y:(e.clientY-r.top)*$('preview').height/r.height}};
 $('preview').onpointerdown=e=>{if(!imageReady||busy)return;start=point(e);$('preview').setPointerCapture(e.pointerId)};
 $('preview').onpointerup=e=>{if(!start)return;const end=point(e),context=$('preview').getContext('2d');context.fillStyle='#000000';context.fillRect(Math.min(start.x,end.x),Math.min(start.y,end.y),Math.max(12,Math.abs(start.x-end.x)),Math.max(12,Math.abs(start.y-end.y)));start=null};
 $('preview').onpointercancel=()=>{start=null};
 $('check-form').onsubmit=async e=>{
  e.preventDefault();if(busy||language==='my'&&!myanmarAiReady)return;
  const text=$('message').value.trim();if(!text&&!imageReady||!$('consent').checked){message('invalid');return}
  const image=imageReady?$('preview').toDataURL('image/jpeg',0.78):'';
  if(image.length>1800000){message('imageError');return}
  busy=true;$('locale').disabled=true;for(const el of $('check-form').elements)el.disabled=true;message('checking');
  answer=null;reviewed=false;$('result').hidden=true;$('result').replaceChildren();
  try{const response=await fetch('/api/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,image,language,consent:true}),signal:AbortSignal.timeout(110000)});if(!response.ok){message(response.status===429?'rate':response.status===503?'unavailable':'error');return}const data=await response.json();if(!data.ok)throw Error('no_result');originalText=text;answer={...data,completed:[]};sourceList=data.sources;renderSources(sourceList);renderResult();$('status').textContent='';$('result').scrollIntoView({behavior:'smooth'})}catch{message('error')}finally{busy=false;$('locale').disabled=false;applyAvailability()}
 };
 renderCopy();
 fetch('/api/check').then(r=>r.ok?r.json():null).then(data=>{if(data?.sources){sourceList=data.sources;myanmarAiReady=data.myanmarAiReady===true;renderSources(sourceList);applyAvailability()}}).catch(()=>{});
})();
