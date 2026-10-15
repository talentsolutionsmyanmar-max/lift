'use strict';
// Local integration; server readiness controls new submissions. No auto POST.
(function(){
 const availability=LiftCommunityIntakeAvailability.createAvailability();
 const session=LiftCommunityIntakeSession.createSession();
 const originalPage=communityPage,originalRoute=route;
 let requested=false;
 communityPage=function(){return originalPage()+'<section class="content-card" id="community-intake-slot" hidden data-user-content></section>';};
 function sync(){
  const slot=document.getElementById('community-intake-slot');if(!slot)return;
  const flags=availability.current(),locale=LiftI18n.locale==='my'?'my':'en',copy=LiftCommunityIntakeCopy[locale];
  const receiptRoute=document.body.dataset.route==='receipts';
  const visible=receiptRoute||flags.receiptsOpen||flags.submissionsOpen||session.exists();slot.hidden=!visible;
  if(visible)session.attach(slot,{copy,locale,initialMode:'lookup',enabled:flags.submissionsOpen,receiptsEnabled:flags.receiptsOpen,draft:()=>({...communityDraft,language:LiftI18n.locale==='my'?'my':'en'})});
  if(receiptRoute)session.showLookup();
  const notice=document.querySelector('[data-community-notice]');if(notice)notice.textContent=flags.submissionsOpen?copy.notice:communityLabel('status');
  const actions=document.querySelector('.community-actions');
  if(!receiptRoute&&flags.submissionsOpen&&communityPreview&&actions){actions.before(slot);session.showConsent();}

 }
 function refresh(){if(window.LIFT_DOWNLOADED_COPY||navigator.onLine===false)return;availability.refresh().then(sync);}
 route=function(){originalRoute();sync();if(['community','receipts'].includes(document.body.dataset.route)&&!requested){requested=true;refresh();}};
 window.addEventListener('online',refresh);
 route();
})();
