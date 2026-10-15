'use strict';
(function(root){
 // Reparent one live panel after route rendering. Never serialise its state.
 function createSession({mountUI=(element,options)=>root.LiftCommunityIntakeUI.mount(element,options),makeElement=()=>root.document.createElement('section')}={}){
  let element,panel,lastCopy,lastLocale;
  return {
   attach(slot,options){
    if(!slot||typeof slot.append!=='function')throw Error('Intake route slot required');
    if(!panel){element=makeElement();panel=mountUI(element,options);lastCopy=options.copy;lastLocale=options.locale;}
    else{
     if(lastCopy!==options.copy||lastLocale!==options.locale){panel.setLanguage(options.copy,options.locale);lastCopy=options.copy;lastLocale=options.locale;}
     panel.setAvailability({enabled:options.enabled===true,receiptsEnabled:options.receiptsEnabled===true});
    }
    slot.append(element);
   },
   showConsent(){panel?.showConsent();},
   showLookup(){panel?.showLookup();},
   exists(){return Boolean(panel);},
   destroy(){panel?.destroy();element?.remove();element=panel=lastCopy=lastLocale=undefined;}
  };
 }
 const api={createSession};if(typeof module!=='undefined')module.exports=api;else root.LiftCommunityIntakeSession=api;
})(typeof window!=='undefined'?window:globalThis);
