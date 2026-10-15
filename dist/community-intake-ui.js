'use strict';
(function(root){
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function sourceLink(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return '';return `<a href="${escape(u.href)}" target="_blank" rel="noopener noreferrer">${escape(u.hostname)}</a>`;}catch{return '';}}
 const messages={received:'waiting',answered:'answered',withdrawn:'withdrawn',expired:'expired',not_found:'notFound',closed:'closed',unavailable:'unavailable',offline:'offline',rate_limited:'rateLimited',conflict:'unavailable',retry:'unavailable'};
 function receiptChoices(s){
  const c=root.LiftWorkflowCopy?.[s.locale==='my'?'my':'en'];if(!c)return '';
  if(s.testOnly)return `<p class="intake-notice">${escape(c.testReceiptLimit)}</p>`;
  if(!s.receipt&&!s.remembered)return '';
  return `<section class="intake-receipt-saving"><p>${escape(c.receiptSaveHelp)}</p>${s.receipt?`<button type="button" class="intake-secondary" data-intake-action="remember" ${s.busy?'disabled':''}>${escape(c.saveReceipt)}</button>`:''}${s.remembered?`<button type="button" class="intake-secondary" data-intake-action="forget" ${s.busy?'disabled':''}>${escape(c.forgetReceipt)}</button>`:''}</section>`;
 }
 function render(copy,s){
  const t=k=>escape(copy[k]),disabled=s.busy?'disabled':'',receiptAllowed=s.receiptsEnabled??s.enabled,receiptDisabled=s.busy||!receiptAllowed?'disabled':'';
  if(s.mode==='consent')return `<h2>${t('send')}</h2><p>${t('notice')}</p>${!s.enabled?`<p class="intake-notice" role="note">${t('closed')}</p>`:''}<form method="dialog" data-intake-form><div class="intake-consents">${['adult','consent','ai'].map(k=>`<label class="intake-choice"><input type="checkbox" data-intake-consent="${k}" ${s.consents[k]?'checked':''} ${disabled}><span>${t(k)}</span></label>`).join('')}</div><p>${t('aiHelp')}</p><details><summary>${t('retention')}</summary><p>${t('receiptWarning')}</p></details><p>${t('noUrgent')}</p><button type="button" data-intake-action="send" ${!s.enabled||s.busy||!s.consents.adult||!s.consents.consent?'disabled':''}>${t('confirmSend')}</button><button type="button" class="intake-secondary" data-intake-action="lookup" ${disabled}>${t('check')}</button></form>`;
  if(s.mode==='lookup')return `<h2>${t('check')}</h2><p>${t('receiptWarning')}</p><label for="intake-code">${t('enterReceipt')}</label><input id="intake-code" type="text" value="${escape(s.lookup)}" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="43" data-intake-code data-user-content ${disabled}><button type="button" data-intake-action="check" ${receiptDisabled}>${t('checkAction')}</button>${!receiptAllowed?`<p>${t('closed')}</p>`:''}${receiptChoices(s)}`;
  const code=`<label for="intake-receipt" class="${s.mode==='receipt'?'intake-sr-only':''}">${t('receipt')}</label><textarea id="intake-receipt" readonly rows="2" data-user-content autocomplete="off" spellcheck="false">${escape(s.receipt)}</textarea><p class="intake-notice">${t('receiptWarning')}</p><p>${t('receiptMemory')}</p><div class="intake-actions"><button type="button" class="intake-secondary" data-intake-action="copy">${t('copyReceipt')}</button><button type="button" class="intake-secondary" data-intake-action="download">${t('saveReceipt')}</button></div>${receiptChoices(s)}`;
  if(s.mode==='confirm-withdraw')return `<h2>${t('withdraw')}</h2>${code}<p>${t('withdrawExplain')}</p><button type="button" data-intake-action="confirm-withdraw" ${receiptDisabled}>${t('confirmWithdraw')}</button><button type="button" class="intake-secondary" data-intake-action="check" ${receiptDisabled}>${t('checkAction')}</button>`;
  const reply=s.view?.status==='answered'?`<section class="intake-reply"><h3>${t('reply')}</h3><p data-user-content>${escape(s.view.reply[s.locale]||s.view.reply.en)}</p>${s.view.reply.sources.map(sourceLink).join(' ')}</section>`:'';
  return `<h2>${t('receipt')}</h2>${code}<p role="status">${s.busy?t('sending'):t(s.justSent&&s.view?.status==='received'?'received':messages[s.view?.status]||'unavailable')}</p>${reply}<button type="button" data-intake-action="check" ${receiptDisabled}>${t('checkAction')}</button>${!['withdrawn','expired','not_found'].includes(s.view?.status)?`<button type="button" class="intake-secondary" data-intake-action="withdraw" ${receiptDisabled}>${t('withdraw')}</button>`:''}`;
 }
 function mount(element,{copy,locale='en',enabled=false,receiptsEnabled=enabled,initialMode='consent',draft,receiptStore,clientFactory=()=>root.LiftCommunityIntakeClient.createClient()}={}){
  let storage;try{storage=root.localStorage;}catch{}
  const savedReceipts=receiptStore||root.LiftCommunityReceiptStore?.createStore({storage}),remembered=root.LIFT_TEAM_TEST?null:savedReceipts?.load();
  const client=clientFactory(),s={mode:initialMode==='lookup'?'lookup':'consent',locale,enabled,receiptsEnabled,consents:{adult:false,consent:false,ai:false},lookup:remembered||'',receipt:'',remembered:remembered||'',testOnly:root.LIFT_TEAM_TEST===true,view:null,busy:false,justSent:false};
  element.classList.add('community-intake-root');element.lang=locale;
  let destroyed=false;
  function paint(){if(destroyed)return;element.innerHTML=render(copy,s)+'<p data-intake-feedback role="status" aria-live="polite"></p>';}
  function feedback(key){if(destroyed)return;const node=element.querySelector('[data-intake-feedback]');if(node)node.textContent=copy[key];}
  async function call(operation){s.busy=true;paint();try{s.view=await operation();}catch{s.view={status:'unavailable'};}finally{s.busy=false;s.mode='receipt';paint();}}
  async function click(event){const control=event.target.closest('[data-intake-action]');if(!control)return;event.preventDefault();const action=control.dataset.intakeAction;
   if(action==='remember'){if(s.testOnly||s.busy)return;const saved=savedReceipts?.save(s.receipt)===true;if(saved)s.remembered=s.receipt;paint();const c=root.LiftWorkflowCopy?.[s.locale==='my'?'my':'en'];const node=element.querySelector('[data-intake-feedback]');if(node&&c)node.textContent=c[saved?'receiptSaved':'receiptNotSaved'];return;}
   if(action==='forget'){if(s.testOnly||s.busy)return;if(savedReceipts?.forget()===true){s.remembered='';s.lookup='';}paint();return;}
   if(action==='copy'){try{await root.navigator.clipboard.writeText(s.receipt);}catch{feedback('saveReceipt');}return;}
   if(action==='download'){const url=URL.createObjectURL(new Blob([copy.receipt+'\n\n'+s.receipt+'\n\n'+copy.receiptWarning],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='lift-private-receipt.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
   if(s.busy)return;
   if(action==='lookup'){s.mode='lookup';paint();element.querySelector('[data-intake-code]')?.focus();return;}
   if((action==='send'&&!s.enabled)||(['check','withdraw','confirm-withdraw'].includes(action)&&!s.receiptsEnabled)){feedback('closed');return;}
   if(action==='send'){
    if(!s.consents.adult||!s.consents.consent){feedback('consentNeeded');return;}
    try{s.receipt=client.begin(typeof draft==='function'?draft():draft,{adult:s.consents.adult,review:s.consents.consent,ai:s.consents.ai});}catch{feedback('unavailable');return;}
    s.mode='receipt';s.justSent=true;await call(()=>client.send());return;
   }
   if(action==='check'){
    const receipt=s.mode==='lookup'?s.lookup:s.receipt;if(!root.LiftCommunityIntakeClient.validReceipt(receipt)){feedback('invalidReceipt');return;}s.receipt=receipt;s.justSent=false;await call(()=>client.check(receipt));return;
   }
   if(action==='withdraw'){s.mode='confirm-withdraw';paint();return;}
   if(action==='confirm-withdraw'){s.justSent=false;await call(()=>client.withdraw(s.receipt));}
  }
  function change(event){const key=event.target.dataset.intakeConsent;if(key){s.consents[key]=event.target.checked;const button=element.querySelector('[data-intake-action="send"]');if(button)button.disabled=!s.enabled||!s.consents.adult||!s.consents.consent;}}
  function input(event){if(event.target.matches('[data-intake-code]'))s.lookup=event.target.value.trim();}
  function submit(event){event.preventDefault();}
  element.addEventListener('click',click);element.addEventListener('change',change);element.addEventListener('input',input);element.addEventListener('submit',submit);paint();
  return {showLookup(){if(s.busy)return;s.mode='lookup';s.lookup=s.receipt||s.remembered||s.lookup;paint();},showConsent(){if(s.busy)return;s.mode=s.receipt?'receipt':'consent';paint();},setLanguage(nextCopy,nextLocale){copy=nextCopy;s.locale=nextLocale;element.lang=nextLocale;paint();},setAvailability({enabled=false,receiptsEnabled=false}={}){s.enabled=enabled===true;s.receiptsEnabled=receiptsEnabled===true;paint();},destroy(){destroyed=true;element.removeEventListener('click',click);element.removeEventListener('change',change);element.removeEventListener('input',input);element.removeEventListener('submit',submit);element.replaceChildren();}};
 }
 const api={render,mount};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunityIntakeUI=api;
})(typeof window!=='undefined'?window:globalThis);
