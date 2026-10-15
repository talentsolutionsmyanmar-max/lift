/* Static, locally bundled copy. No text is sent to a translation service. */
(function(root){
  "use strict";
  const dictionary=root.LiftMyanmar||{};
  const localeKey="lift-language-v1";
  let locale="en";
  try{locale=localStorage.getItem(localeKey)==="my"?"my":"en";}catch{}
  const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
  function translate(source,params){
    let value=String(source);
    if(locale==="my"){
      if(Object.prototype.hasOwnProperty.call(dictionary,value))value=dictionary[value];
      else {
        // Composite text nodes (for example a note followed by its saving status)
        // are translated from exact reviewed phrases, never from user content.
        let rest=value,result="";
        while(rest){
          let best=null,pos=rest.length;
          for(const key of keys){const i=rest.indexOf(key);if(i>=0&&(i<pos||(i===pos&&key.length>(best||"").length))){
            const before=rest[i-1],after=rest[i+key.length];
            if((!before||!/[A-Za-z]/.test(before))&&(!after||!/[A-Za-z]/.test(after))){best=key;pos=i;}
          }}
          if(!best){result+=rest;break;}
          result+=rest.slice(0,pos)+dictionary[best];rest=rest.slice(pos+best.length);
        }
        value=result;
      }
    }
    return value.replace(/\{(\w+)\}/g,(match,key)=>params&&Object.prototype.hasOwnProperty.call(params,key)?String(params[key]):match);
  }
  const textSources=new WeakMap(),attributeSources=new WeakMap();
  let observer;
  function render(){
    if(!root.document)return;
    if(observer)observer.disconnect();
    document.documentElement.lang=locale;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.parentElement.closest('script,style,textarea,[data-user-content],[data-language-name]'))continue;
      const previous=textSources.get(node),current=node.nodeValue;
      const source=previous&&current===previous.rendered?previous.source:current;
      const trimmed=source.trim();
      const translated=translate(trimmed);
      const rendered=trimmed?source.replace(trimmed,translated):source;
      if(current!==rendered)node.nodeValue=rendered;
      textSources.set(node,{source,rendered});
    }
    for(const el of document.querySelectorAll('[aria-label],[placeholder]')){
      if(el.closest('[data-user-content],[data-language-name]'))continue;
      const saved=attributeSources.get(el)||{};
      for(const attr of ['aria-label','placeholder'])if(el.hasAttribute(attr)){
        const current=el.getAttribute(attr),last=saved[attr],source=last&&current===last.rendered?last.source:current;
        const rendered=translate(source);if(current!==rendered)el.setAttribute(attr,rendered);saved[attr]={source,rendered};
      }
      attributeSources.set(el,saved);
    }
    const label=document.getElementById('current-language');
    if(label)label.textContent=locale==="my"?"မြန်မာ":"English";
    if(observer)observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder']});
  }
  function setLocale(value){locale=value==="my"?"my":"en";try{localStorage.setItem(localeKey,locale);}catch{}render();}
  const api={t:translate,render,setLocale,get locale(){return locale;}};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  else root.LiftI18n=api;
  if(root.document){observer=new MutationObserver(render);render();}
})(typeof window!=="undefined"?window:globalThis);
