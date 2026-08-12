/* MON COMMERCE — conserve la langue vers l'inscription et les boutiques MARKET */
(() => {
  "use strict";
  const SUPPORTED = ["fr","en","es","pt","de","it","nl","ar"];

  function currentLang(){
    try{
      const query = String(new URLSearchParams(location.search).get("lang") || "").toLowerCase();
      if(SUPPORTED.includes(query)) return query;
      const stored = String(localStorage.getItem("digiy-lang") || "").toLowerCase();
      if(SUPPORTED.includes(stored)) return stored;
    }catch(_){}
    return "fr";
  }

  function copyParams(source, target, excluded){
    source.searchParams.forEach((value,key) => {
      if(!excluded.includes(key)) target.searchParams.set(key,value);
    });
  }

  function rewriteTarifsAdherent1(anchor, target){
    if(!/(^|\.)digiylyfe\.com$/i.test(target.hostname)) return false;
    if(!/\/tarifs-adherents\.html$/i.test(target.pathname)) return false;
    const url = new URL("https://digiylyfe.com/tarifs-adherents-1.html");
    url.searchParams.set("lang", currentLang());
    anchor.setAttribute("href", url.toString());
    return true;
  }

  function rewriteCommerceInscription(anchor, target){
    if(!/\/inscription-pos\.html$/i.test(target.pathname)) return false;
    const wrapper = new URL("./inscription-lang.html", location.href);
    copyParams(target, wrapper, ["lang","v"]);
    wrapper.searchParams.set("lang", currentLang());
    if(target.hash) wrapper.hash = target.hash;
    anchor.setAttribute("href", wrapper.toString());
    return true;
  }

  function rewriteMarketShop(anchor, target){
    if(!/(^|\.)market\.digiylyfe\.com$/i.test(target.hostname)) return false;
    if(!/\/(?:fiche|shop)\.html$/i.test(target.pathname)) return false;

    const wrapper = new URL("https://market.digiylyfe.com/lang.html");
    wrapper.searchParams.set("page","fiche.html");
    copyParams(target, wrapper, ["page","lang","v"]);
    wrapper.searchParams.set("lang", currentLang());
    if(target.hash) wrapper.hash = target.hash;
    anchor.setAttribute("href", wrapper.toString());
    return true;
  }

  function rewrite(anchor){
    try{
      const raw = anchor.getAttribute("href");
      if(!raw || /^(mailto:|tel:|sms:|javascript:|#)/i.test(raw)) return;
      const target = new URL(raw, location.href);
      if(rewriteTarifsAdherent1(anchor,target)) return;
      if(rewriteCommerceInscription(anchor,target)) return;
      rewriteMarketShop(anchor,target);
    }catch(_){}
  }

  function apply(root){
    if(root && root.matches?.("a[href]")) rewrite(root);
    (root || document).querySelectorAll?.("a[href]").forEach(rewrite);
  }

  function start(){
    apply(document);
    new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if(node.nodeType === Node.ELEMENT_NODE) apply(node);
        });
      });
    }).observe(document.documentElement,{subtree:true,childList:true});
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})();
