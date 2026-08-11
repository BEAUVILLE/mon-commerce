/* MON COMMERCE — extension PT locale, n'affecte pas les 7 langues stables */
(() => {
  "use strict";
  if(window.__DIGIY_MON_COMMERCE_PT__) return;
  window.__DIGIY_MON_COMMERCE_PT__ = true;

  const PT = {"Boutiques":"Lojas","Découvrir":"Descobrir","Galerie":"Galeria","Demande commerce":"Pedido de comércio","Commerce local · Afrique · France · Diaspora":"Comércio local · África · França · Diáspora","La vitrine du commerce local n’est pas réservée aux grands.":"A vitrine do comércio local não é reservada aos grandes.","📝 Activer ma présence":"📝 Ativar a minha presença","🎧 Écouter l’intro":"🎧 Ouvir a introdução","🇸🇳 Lexique Wolof caisse":"🇸🇳 Léxico Wolof da caixa","🖼️ Voir les boutiques partenaires":"🖼️ Ver lojas parceiras","🛍️ Voir les commerces":"🛍️ Ver os comércios","💬 Demande WhatsApp":"💬 Pedido WhatsApp","📩 Demande SMS":"📩 Pedido SMS","0% commission":"0% de comissão","Paiement direct":"Pagamento direto","WhatsApp direct":"WhatsApp direto","QR boutique":"QR da loja","Simple sur téléphone":"Simples no telemóvel","Tu as un commerce ?":"Tens um comércio?","🎥 Vidéo de présentation":"🎥 Vídeo de apresentação","Voir les fiches":"Ver as fichas","Pour qui ?":"Para quem?","Cantines & nourriture":"Cantinas e alimentação","Artisans & ateliers":"Artesãos e oficinas","Beauté & services":"Beleza e serviços","Boutiques & marchés":"Lojas e mercados","Démocratiser la vitrine":"Democratizar a vitrine","Pas une plateforme qui capte":"Não uma plataforma que captura a relação","Aperçu des commerces":"Pré-visualização dos comércios","Chargement des commerces publiés…":"A carregar os comércios publicados…","Ton commerce mérite sa présence.":"O teu comércio merece a sua presença.","Voir les tarifs":"Ver preços","Accueil":"Início","Métiers":"Atividades","Activer":"Ativar","Voir la fiche":"Ver ficha","Inscription commerce":"Registo de comércio","Exemple métier":"Exemplo de atividade","Partenaire vedette":"Parceiro em destaque","Publié":"Publicado","Territoires":"Territórios","Afrique · France · Diaspora":"África · França · Diáspora","Contact direct":"Contacto direto","Activation POS payante":"Ativação POS paga","Le commerçant vend.":"O comerciante vende.","DIGIY ouvre la porte, sans prendre la caisse.":"A DIGIY abre a porta sem ficar com a caixa.","Vente et paiement directs":"Venda e pagamento diretos","Le terrain garde la main.":"O terreno mantém o controlo.","Une vitrine pour le commerce réel":"Uma vitrine para o comércio real","Galerie partenaires":"Galeria de parceiros","Demande sans engagement":"Pedido sem compromisso","Les boutiques":"As lojas","Toute la galerie":"Toda a galeria","Ajouter mon commerce":"Adicionar o meu comércio","Découvre les boutiques du terrain.":"Descobre as lojas do terreno.","Contacte-les directement.":"Contacta-as diretamente.","Ouvre une fiche pour voir l’activité, les photos et contacter directement le commerce.":"Abre uma ficha para ver a atividade, as fotos e contactar diretamente o comércio.","Site":"Site","Activation":"Ativação","Commerce partenaire actif":"Comércio parceiro ativo","Voir la boutique":"Ver loja","0 % de commission":"0% de comissão","Onglerie, soins de beauté, massage modelant, lipocavitation ventre et produits d’hygiène femme et homme. Contact direct avec Fama.":"Unhas, cuidados de beleza, massagem modeladora, lipocavitação abdominal e produtos de higiene para mulheres e homens. Contacto direto com Fama.","Linge de maison, draps, serviettes, peignoirs et packs pour villas et résidences. Contact direct avec Astou.":"Roupa de casa, lençóis, toalhas, roupões e packs para villas e residências. Contacto direto com Astou.","Tee-shirts, polos et sous-vêtements avec prix clairs. Contact direct, paiement vendeur et zéro commission DIGIY.":"T-shirts, polos e roupa interior com preços claros. Contacto direto, pagamento ao vendedor e zero comissão DIGIY."};
  const requested = (() => {
    try {
      const q=(new URLSearchParams(location.search).get("lang")||"").toLowerCase();
      if(q) return q;
      return (localStorage.getItem("digiy-lang")||"").toLowerCase();
    } catch(_) { return ""; }
  })();

  function goPt(){
    try{localStorage.setItem("digiy-lang","pt");localStorage.setItem("digiy_mon_commerce_lang","fr");}catch(_){}
    location.assign("https://mon-commerce.digiylyfe.com/?lang=pt&v=20260811-commerce-pt-native-v1");
  }

  function ensureButton(){
    const bar=document.querySelector(".lang-switch");
    if(!bar) return;
    let b=bar.querySelector('[data-digiy-lang="pt"],[data-lang="pt"]');
    if(!b){
      b=document.createElement("button");
      b.type="button";
      b.dataset.digiyLang="pt";
      b.textContent="🇵🇹 PT";
      b.addEventListener("click",(e)=>{e.preventDefault();e.stopImmediatePropagation();goPt();},true);
      const es=bar.querySelector('[data-digiy-lang="es"],[data-lang="es"]');
      if(es && es.nextSibling) bar.insertBefore(b,es.nextSibling); else bar.appendChild(b);
    }
    b.classList.toggle("active",requested==="pt");
    b.setAttribute("aria-pressed",requested==="pt"?"true":"false");
    if(requested==="pt"){
      bar.querySelectorAll("button").forEach(x=>{ if(x!==b){x.classList.remove("active");x.setAttribute("aria-pressed","false");} });
    }
  }

  function translateNode(root){
    if(requested!=="pt" || !root) return;
    const skip=new Set(["SCRIPT","STYLE","NOSCRIPT","TEXTAREA"]);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(n){
        const p=n.parentElement;
        if(!p || skip.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }
    });
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const n of nodes){
      const raw=n.nodeValue, t=raw.trim(), v=PT[t];
      if(v) n.nodeValue=raw.replace(t,v);
    }
    root.querySelectorAll?.("[placeholder],[aria-label],[title]").forEach(el=>{
      ["placeholder","aria-label","title"].forEach(a=>{
        const v=el.getAttribute(a); if(v && PT[v]) el.setAttribute(a,PT[v]);
      });
    });
  }

  function setMeta(){
    if(requested!=="pt") return;
    document.documentElement.lang="pt";
    document.documentElement.dir="ltr";
    document.title="MON COMMERCE — Comércio local direto · 0% de comissão";
    const d=document.querySelector('meta[name="description"]');
    if(d)d.content="Comércios locais visíveis, contacto e pagamento diretos ao comerciante, 0% de comissão DIGIY.";
  }

  function apply(){
    ensureButton();
    if(requested==="pt"){ translateNode(document.body); setMeta(); }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",apply,{once:true});
  else apply();

  let timer=0;
  new MutationObserver(()=>{ clearTimeout(timer); timer=setTimeout(apply,40); }).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,450);
  setTimeout(apply,900);
})();
