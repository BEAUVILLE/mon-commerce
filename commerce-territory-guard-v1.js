/* DIGIYLYFE — MON COMMERCE · GARDE TERRITOIRE V1
 * Complète le MASTER sans toucher au moteur commerce :
 * - Europe = 45 € / mois
 * - local = filtre fail-closed des commerces réels
 */
(()=>{
'use strict';
const LANGS=['fr','en','es','pt','de','it','nl','ar'];
const EUROPE=new Set(['vallee-dordogne','bordeaux']);
const COPY={
 fr:{price:'45 € / mois',join:'PRENDRE MA PLACE · 45 € / mois →',head:'DEMANDE D’ADHÉSION · À PARTIR DE 45 € / mois'},
 en:{price:'€45 / month',join:'TAKE MY PLACE · €45 / month →',head:'MEMBERSHIP REQUEST · FROM €45 / month'},
 es:{price:'45 € / mes',join:'OCUPAR MI LUGAR · 45 € / mes →',head:'SOLICITUD DE ADHESIÓN · DESDE 45 € / mes'},
 pt:{price:'45 € / mês',join:'OCUPAR O MEU LUGAR · 45 € / mês →',head:'PEDIDO DE ADESÃO · A PARTIR DE 45 € / mês'},
 de:{price:'45 € / Monat',join:'MEINEN PLATZ NEHMEN · 45 € / Monat →',head:'MITGLIEDSCHAFT ANFRAGEN · AB 45 € / Monat'},
 it:{price:'45 € / mese',join:'PRENDERE IL MIO POSTO · 45 € / mese →',head:'RICHIESTA DI ADESIONE · DA 45 € / mese'},
 nl:{price:'€ 45 / maand',join:'MIJN PLAATS NEMEN · € 45 / maand →',head:'LIDMAATSCHAP AANVRAGEN · VANAF € 45 / maand'},
 ar:{price:'45 € / شهر',join:'خذ مكاني · 45 € / شهر ←',head:'طلب العضوية · ابتداءً من 45 € / شهر'}
};
function master(){return window.DIGIY_COMMERCE_MASTER||null}
function ctx(){const m=master();if(m)return m.context();const p=new URLSearchParams(location.search);return{territory:p.get('territory')||'petite-cote',local:p.get('local')||'',lang:(p.get('lang')||'fr').slice(0,2)}}
function clean(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim()}
function localMatch(text,local){const a=clean(text),b=clean(local);if(!b)return true;if(a.includes(b))return true;const tokens=b.split(' ').filter(x=>x.length>2);return tokens.length>0&&tokens.every(x=>a.includes(x))}
function filterReal(c){
 if(!c.local)return;
 document.querySelectorAll('main > article.listing').forEach(card=>{const area=card.querySelector('.area');if(!area||!localMatch(area.textContent,c.local))card.style.display='none'});
}
function patchPrice(c){
 if(!EUROPE.has(c.territory))return;
 const l=LANGS.includes(c.lang)?c.lang:'fr',x=COPY[l]||COPY.fr;
 const head=document.querySelector('.join a[data-i18n="join"]');if(head)head.textContent=x.head;
 document.querySelectorAll('#digiy-commerce-open-places .op-meta').forEach(el=>{el.textContent=x.price+' · QR · 0 %'});
 document.querySelectorAll('#digiy-commerce-open-places .op-join').forEach(el=>{el.textContent=x.join});
}
function apply(){const c=ctx();filterReal(c);patchPrice(c)}
function boot(){apply();const root=document.body;new MutationObserver(()=>setTimeout(apply,0)).observe(root,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#langs button'))setTimeout(apply,60)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
