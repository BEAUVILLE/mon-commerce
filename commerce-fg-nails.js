(()=>{
  'use strict';

  const ID='fg-nails-commerce-featured';
  const PROFILE='https://f-g-nails.digiylyfe.com/';
  const PRODUCTS='https://f-g-nails.digiylyfe.com/hygiene-bien-etre-saly.html';
  const IMAGE='https://f-g-nails.digiylyfe.com/fg-nails-carte-officielle.webp';
  const WHATSAPP='https://wa.me/221780127062?text='+encodeURIComponent('Bonjour FG NAILS, je viens de MON COMMERCE et je souhaite voir les produits disponibles.');

  function addStyle(){
    if(document.getElementById(ID+'-style')) return;
    const style=document.createElement('style');
    style.id=ID+'-style';
    style.textContent=`
      #${ID}{margin:0 0 14px;padding:15px;border:2px solid rgba(214,168,95,.42);border-radius:25px;background:linear-gradient(135deg,rgba(214,168,95,.13),rgba(255,255,255,.045));box-shadow:0 16px 42px rgba(0,0,0,.22)}
      #${ID} .fg-label{display:inline-flex;min-height:30px;align-items:center;padding:0 10px;border-radius:999px;border:1px solid rgba(214,168,95,.35);background:rgba(214,168,95,.11);color:#f5dca8;font-size:.74rem;font-weight:1000;letter-spacing:.05em;text-transform:uppercase}
      #${ID} .fg-grid{display:grid;grid-template-columns:145px 1fr;gap:15px;align-items:center;margin-top:12px}
      #${ID} img{width:145px;aspect-ratio:9/16;object-fit:cover;border-radius:19px;border:1px solid rgba(255,255,255,.10);background:#241f1b}
      #${ID} h3{margin:0 0 5px;font-family:Lora,Georgia,serif;color:#f3e8d8;font-size:1.62rem;line-height:1.04}
      #${ID} p{margin:0;color:#c8b8a7;font-size:.92rem;line-height:1.55;font-weight:750}
      #${ID} .fg-meta{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}
      #${ID} .fg-meta span{padding:7px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#d7c8b8;font-size:.76rem;font-weight:900}
      #${ID} .fg-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:11px}
      #${ID} .fg-actions a{min-height:43px;display:inline-flex;align-items:center;justify-content:center;padding:0 13px;border-radius:999px;text-decoration:none;font-size:.82rem;font-weight:1000}
      #${ID} .fg-main{background:linear-gradient(135deg,#d6a85f,#f0d29a);color:#17120e}
      #${ID} .fg-green{background:linear-gradient(135deg,#6fa27e,#99c5a7);color:#101812}
      #${ID} .fg-soft{border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.055);color:#f8f1e8}
      @media(max-width:560px){#${ID} .fg-grid{grid-template-columns:88px 1fr;align-items:start}#${ID} img{width:88px;border-radius:15px}#${ID} h3{font-size:1.28rem}#${ID} .fg-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr}#${ID} .fg-actions a:last-child{grid-column:1/-1}}
    `;
    document.head.appendChild(style);
  }

  function gridAlreadyHasFg(){
    const grid=document.getElementById('commerceGrid');
    if(!grid) return false;
    const text=(grid.textContent||'').toLowerCase();
    return text.includes('fg nails') || !!grid.querySelector('a[href*="f-g-nails.digiylyfe.com"]');
  }

  function ensure(){
    const panel=document.querySelector('#commerces .gallery-panel');
    if(!panel) return false;
    const current=document.getElementById(ID);
    if(gridAlreadyHasFg()){
      current?.remove();
      return true;
    }
    if(current) return true;

    addStyle();
    const en=(document.documentElement.lang||'fr').toLowerCase().startsWith('en');
    const block=document.createElement('section');
    block.id=ID;
    block.setAttribute('aria-label','FG NAILS dans MON COMMERCE');
    block.innerHTML=`
      <span class="fg-label">${en?'Active partner':'Commerce partenaire actif'}</span>
      <div class="fg-grid">
        <a href="${PROFILE}" target="_blank" rel="noopener"><img src="${IMAGE}" alt="FG NAILS Saly" loading="lazy"></a>
        <div>
          <h3>FG NAILS · Saly</h3>
          <p>${en?'Nail salon, beauty care, body treatments and hygiene products for women and men. Direct contact with Fama.':'Onglerie, soins de beauté, massage modelant, lipocavitation et produits d’hygiène femme et homme. Contact direct avec Fama.'}</p>
          <div class="fg-meta"><span>📍 Résidence Nafil</span><span>💬 +221 78 012 70 62</span><span>0% commission</span></div>
          <div class="fg-actions">
            <a class="fg-main" href="${PRODUCTS}" target="_blank" rel="noopener">${en?'Open shop':'Voir la boutique'}</a>
            <a class="fg-soft" href="${PROFILE}" target="_blank" rel="noopener">${en?'View profile':'Voir la fiche'}</a>
            <a class="fg-green" href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>`;
    const status=document.getElementById('galleryStatus');
    panel.insertBefore(block,status||panel.firstChild);
    return true;
  }

  function watch(){
    const grid=document.getElementById('commerceGrid');
    if(grid){
      new MutationObserver(ensure).observe(grid,{childList:true,subtree:true});
    }
  }

  if(!ensure()){
    const obs=new MutationObserver(()=>{if(ensure()){watch();obs.disconnect();}});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>obs.disconnect(),15000);
  }else watch();
})();