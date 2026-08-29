/* DIGIYLYFE — MON COMMERCE MASTER V1
 * Source unique de contexte public : territory + local + lang.
 * TERRITOIRE aiguille ; MON COMMERCE reste le maître unique.
 */
(()=>{
  'use strict';

  const LANGS=['fr','en','es','pt','de','it','nl','ar'];
  const DEFAULT_TERRITORY='petite-cote';
  const TERRITORY_NAMES={
    'petite-cote':'PETITE CÔTE',
    'dakar':'DAKAR',
    'vallee-dordogne':'VALLÉE DORDOGNE',
    'bordeaux':'BORDEAUX'
  };

  function params(){
    try{return new URLSearchParams(location.search)}catch(_){return new URLSearchParams()}
  }

  function resolveLang(p){
    const q=(p.get('lang')||'').slice(0,2).toLowerCase();
    if(LANGS.includes(q))return q;
    const html=(document.documentElement.lang||'').slice(0,2).toLowerCase();
    if(LANGS.includes(html))return html;
    try{
      const stored=(localStorage.getItem('digiy-lang')||'').slice(0,2).toLowerCase();
      if(LANGS.includes(stored))return stored;
    }catch(_){ }
    return 'fr';
  }

  function labelSlug(value){
    if(!value)return'';
    if(TERRITORY_NAMES[value])return TERRITORY_NAMES[value];
    return String(value).replace(/-/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
  }

  const p=params();
  const explicitTerritory=(p.get('territory')||'').trim();
  const territory=explicitTerritory||DEFAULT_TERRITORY;
  const local=(p.get('local')||'').trim();
  const lang=resolveLang(p);

  /* Compatibilité : une entrée directe dans MON COMMERCE garde la vitrine Petite Côte actuelle,
     mais le contexte devient désormais explicite et transmissible. */
  let changed=false;
  if(!explicitTerritory){p.set('territory',territory);changed=true}
  if(p.get('lang')!==lang){p.set('lang',lang);changed=true}
  if(changed){
    const next=location.pathname+'?'+p.toString()+location.hash;
    history.replaceState(null,'',next);
  }

  document.documentElement.setAttribute('data-digiy-commerce-master','1');
  document.documentElement.setAttribute('data-digiy-territory',territory);
  if(local)document.documentElement.setAttribute('data-digiy-local',local);

  function withContext(raw){
    const u=new URL(raw,location.href);
    u.searchParams.set('territory',territory);
    if(local)u.searchParams.set('local',local);else u.searchParams.delete('local');
    u.searchParams.set('lang',lang);
    return u.toString();
  }

  function matchesTerritory(memberTerritory){
    return !memberTerritory||memberTerritory===territory;
  }

  window.DIGIY_COMMERCE_MASTER=Object.freeze({
    version:'20260829-v1',
    module:'MON_COMMERCE',
    territory,
    territoryLabel:labelSlug(territory),
    local,
    localLabel:labelSlug(local),
    lang,
    source:explicitTerritory?'territoire':'direct-default',
    context:()=>({territory,local,lang}),
    labelSlug,
    withContext,
    matchesTerritory
  });

  window.dispatchEvent(new CustomEvent('digiy:commerce-master-ready',{detail:window.DIGIY_COMMERCE_MASTER.context()}));

  if(!document.querySelector('script[data-digiy-commerce-territory-guard]')){
    const guard=document.createElement('script');
    guard.src='/commerce-territory-guard-v1.js?v=20260829-territory-v1';
    guard.setAttribute('data-digiy-commerce-territory-guard','1');
    document.head.appendChild(guard);
  }
})();