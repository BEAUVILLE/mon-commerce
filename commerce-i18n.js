/* DIGIY MON COMMERCE — 7 langues stables · FR EN ES DE IT NL AR */
(function(){
'use strict';
if(window.__DIGIY_COMMERCE_7LANG__)return;
window.__DIGIY_COMMERCE_7LANG__=true;

var VERSION='20260730-commerce7a';
var SUPPORTED=['fr','en','es','de','it','nl','ar'];
var LABELS={fr:'🇫🇷 FR',en:'🇬🇧 EN',es:'🇪🇸 ES',de:'🇩🇪 DE',it:'🇮🇹 IT',nl:'🇳🇱 NL',ar:'🌙 AR'};
var META={
 es:{title:'MON COMMERCE — Comercio local directo · 0 % de comisión',description:'Comercios locales visibles, contacto y pago directos al comerciante, 0 % de comisión DIGIY.'},
 de:{title:'MON COMMERCE — Lokaler Handel direkt · 0 % Provision',description:'Lokale Geschäfte sichtbar, direkter Kontakt und direkte Zahlung an den Händler, 0 % DIGIY-Provision.'},
 it:{title:'MON COMMERCE — Commercio locale diretto · 0% commissioni',description:'Attività locali visibili, contatto e pagamento diretti al commerciante, 0% commissioni DIGIY.'},
 nl:{title:'MON COMMERCE — Lokale handel rechtstreeks · 0% commissie',description:'Lokale winkels zichtbaar, rechtstreeks contact en betaling aan de handelaar, 0% DIGIY-commissie.'},
 ar:{title:'MON COMMERCE — تجارة محلية مباشرة · عمولة 0٪',description:'متاجر محلية مرئية، تواصل ودفع مباشران للتاجر، وعمولة DIGIY بنسبة 0٪.'}
};

var ITEMS=[
 ['Boutiques','Tiendas','Geschäfte','Negozi','Winkels','المتاجر'],
 ['Découvrir','Descubrir','Entdecken','Scopri','Ontdekken','اكتشف'],
 ['Galerie','Galería','Galerie','Galleria','Galerij','المعرض'],
 ['Demande commerce','Solicitud de comercio','Geschäftsanfrage','Richiesta attività','Handelsaanvraag','طلب متجر'],
 ['Commerce local · Afrique · France · Diaspora','Comercio local · África · Francia · Diáspora','Lokaler Handel · Afrika · Frankreich · Diaspora','Commercio locale · Africa · Francia · Diaspora','Lokale handel · Afrika · Frankrijk · Diaspora','تجارة محلية · أفريقيا · فرنسا · الجاليات'],
 ['La vitrine du commerce local n’est pas réservée aux grands.','El escaparate digital del comercio local no está reservado a los grandes.','Das digitale Schaufenster des lokalen Handels ist nicht nur für große Unternehmen.','La vetrina digitale del commercio locale non è riservata ai grandi.','De digitale etalage van lokale handel is niet alleen voor grote bedrijven.','الواجهة الرقمية للتجارة المحلية ليست حكرًا على الكبار.'],
 ['📝 Activer ma présence','📝 Activar mi presencia','📝 Meine Präsenz aktivieren','📝 Attiva la mia presenza','📝 Mijn aanwezigheid activeren','📝 تفعيل حضوري'],
 ['🎧 Écouter l’intro','🎧 Escuchar la introducción','🎧 Einführung anhören','🎧 Ascolta l’introduzione','🎧 Intro beluisteren','🎧 الاستماع إلى المقدمة'],
 ['🇸🇳 Lexique Wolof caisse','🇸🇳 Léxico wolof de caja','🇸🇳 Wolof-Kassenlexikon','🇸🇳 Lessico wolof della cassa','🇸🇳 Wolof-kassawoordenlijst','🇸🇳 معجم الولوف للصندوق'],
 ['🖼️ Voir les boutiques partenaires','🖼️ Ver tiendas asociadas','🖼️ Partnergeschäfte ansehen','🖼️ Vedi i negozi partner','🖼️ Partnerwinkels bekijken','🖼️ عرض المتاجر الشريكة'],
 ['🛍️ Voir les commerces','🛍️ Ver comercios','🛍️ Geschäfte ansehen','🛍️ Vedi le attività','🛍️ Bedrijven bekijken','🛍️ عرض المتاجر'],
 ['💬 Demande WhatsApp','💬 Solicitud por WhatsApp','💬 Anfrage über WhatsApp','💬 Richiesta WhatsApp','💬 WhatsApp-aanvraag','💬 طلب عبر واتساب'],
 ['📩 Demande SMS','📩 Solicitud por SMS','📩 Anfrage per SMS','📩 Richiesta SMS','📩 Sms-aanvraag','📩 طلب عبر رسالة نصية'],
 ['0% commission','0% de comisión','0 % Provision','0% commissioni','0% commissie','عمولة 0٪'],
 ['Paiement direct','Pago directo','Direkte Zahlung','Pagamento diretto','Rechtstreekse betaling','دفع مباشر'],
 ['WhatsApp direct','WhatsApp directo','Direktes WhatsApp','WhatsApp diretto','Rechtstreeks WhatsApp','واتساب مباشر'],
 ['QR boutique','QR de la tienda','Geschäfts-QR','QR del negozio','Winkel-QR','رمز QR للمتجر'],
 ['Simple sur téléphone','Fácil en el teléfono','Einfach auf dem Handy','Semplice sul telefono','Eenvoudig op de telefoon','سهل على الهاتف'],
 ['Tu as un commerce ?','¿Tienes un comercio?','Hast du ein Geschäft?','Hai un’attività?','Heb je een winkel?','هل لديك متجر؟'],
 ['🎥 Vidéo de présentation','🎥 Vídeo de presentación','🎥 Präsentationsvideo','🎥 Video di presentazione','🎥 Presentatievideo','🎥 فيديو تعريفي'],
 ['Voir les fiches','Ver perfiles','Profile ansehen','Vedi le schede','Profielen bekijken','عرض الملفات'],
 ['Pour qui ?','¿Para quién?','Für wen?','Per chi?','Voor wie?','لمن؟'],
 ['Cantines & nourriture','Comedores y comida','Imbisse & Essen','Ristori e cibo','Eetstalletjes & eten','المطاعم الصغيرة والطعام'],
 ['Artisans & ateliers','Artesanos y talleres','Handwerker & Werkstätten','Artigiani e laboratori','Ambachtslieden & werkplaatsen','الحرفيون والورش'],
 ['Beauté & services','Belleza y servicios','Beauty & Dienstleistungen','Bellezza e servizi','Schoonheid & diensten','الجمال والخدمات'],
 ['Boutiques & marchés','Tiendas y mercados','Geschäfte & Märkte','Negozi e mercati','Winkels & markten','المتاجر والأسواق'],
 ['Démocratiser la vitrine','Hacer accesible el escaparate','Das Schaufenster zugänglich machen','Rendere accessibile la vetrina','De etalage toegankelijk maken','إتاحة الواجهة للجميع'],
 ['Pas une plateforme qui capte','No una plataforma que se apropia','Keine Plattform, die alles an sich zieht','Non una piattaforma che si appropria','Geen platform dat alles overneemt','ليست منصة تستحوذ على العلاقة'],
 ['Aperçu des commerces','Vista previa de los comercios','Vorschau der Geschäfte','Anteprima delle attività','Voorbeeld van bedrijven','معاينة المتاجر'],
 ['Chargement des commerces publiés…','Cargando comercios publicados…','Veröffentlichte Geschäfte werden geladen…','Caricamento delle attività pubblicate…','Gepubliceerde bedrijven laden…','جارٍ تحميل المتاجر المنشورة…'],
 ['Ton commerce mérite sa présence.','Tu comercio merece su presencia.','Dein Geschäft verdient seine Präsenz.','La tua attività merita la sua presenza.','Jouw winkel verdient zichtbaarheid.','متجرك يستحق حضوره.'],
 ['Voir les tarifs','Ver tarifas','Preise ansehen','Vedi le tariffe','Tarieven bekijken','عرض الأسعار'],
 ['Accueil','Inicio','Startseite','Home','Start','الرئيسية'],
 ['Métiers','Actividades','Berufe','Attività','Vakgebieden','المهن'],
 ['Activer','Activar','Aktivieren','Attiva','Activeren','تفعيل'],
 ['Voir la fiche','Ver perfil','Profil ansehen','Vedi scheda','Profiel bekijken','عرض الملف'],
 ['Inscription commerce','Registro de comercio','Geschäftsanmeldung','Registrazione attività','Bedrijfsregistratie','تسجيل المتجر'],
 ['Exemple métier','Ejemplo de actividad','Berufsbeispiel','Esempio attività','Voorbeeldactiviteit','مثال مهني'],
 ['Partenaire vedette','Socio destacado','Hervorgehobener Partner','Partner in evidenza','Uitgelichte partner','شريك مميز'],
 ['Publié','Publicado','Veröffentlicht','Pubblicato','Gepubliceerd','منشور'],
 ['Territoires','Territorios','Gebiete','Territori','Gebieden','المناطق'],
 ['Afrique · France · Diaspora','África · Francia · Diáspora','Afrika · Frankreich · Diaspora','Africa · Francia · Diaspora','Afrika · Frankrijk · Diaspora','أفريقيا · فرنسا · الجاليات'],
 ['Contact direct','Contacto directo','Direkter Kontakt','Contatto diretto','Rechtstreeks contact','تواصل مباشر'],
 ['Activation POS payante','Activación POS de pago','Kostenpflichtige POS-Aktivierung','Attivazione POS a pagamento','Betaalde POS-activering','تفعيل نقطة البيع مدفوع'],
 ['Le commerçant vend.','El comerciante vende.','Der Händler verkauft.','Il commerciante vende.','De handelaar verkoopt.','التاجر يبيع.'],
 ['DIGIY ouvre la porte, sans prendre la caisse.','DIGIY abre la puerta sin quedarse con la caja.','DIGIY öffnet die Tür, ohne die Kasse zu übernehmen.','DIGIY apre la porta senza prendere la cassa.','DIGIY opent de deur zonder de kassa over te nemen.','DIGIY يفتح الباب دون أن يأخذ صندوق التاجر.'],
 ['Vente et paiement directs','Venta y pago directos','Direkter Verkauf und direkte Zahlung','Vendita e pagamento diretti','Rechtstreekse verkoop en betaling','بيع ودفع مباشران'],
 ['Le terrain garde la main.','El terreno mantiene el control.','Das Feld behält die Kontrolle.','Il territorio mantiene il controllo.','Het werkveld houdt de regie.','الميدان يحتفظ بالقرار.'],
 ['Une vitrine pour le commerce réel','Un escaparate para el comercio real','Ein Schaufenster für echten Handel','Una vetrina per il commercio reale','Een etalage voor echte handel','واجهة للتجارة الحقيقية'],
 ['Galerie partenaires','Galería de socios','Partnergalerie','Galleria partner','Partnergalerij','معرض الشركاء'],
 ['Demande sans engagement','Solicitud sin compromiso','Unverbindliche Anfrage','Richiesta senza impegno','Vrijblijvende aanvraag','طلب دون التزام'],
 ['Les boutiques','Las tiendas','Die Geschäfte','I negozi','De winkels','المتاجر'],
 ['Toute la galerie','Toda la galería','Die ganze Galerie','Tutta la galleria','De hele galerij','المعرض الكامل'],
 ['Ajouter mon commerce','Añadir mi comercio','Mein Geschäft hinzufügen','Aggiungi la mia attività','Mijn winkel toevoegen','إضافة متجري'],
 ['Découvre les boutiques du terrain.','Descubre las tiendas locales.','Entdecke die lokalen Geschäfte.','Scopri i negozi del territorio.','Ontdek lokale winkels.','اكتشف متاجر الميدان.'],
 ['Contacte-les directement.','Contáctalos directamente.','Kontaktiere sie direkt.','Contattali direttamente.','Neem rechtstreeks contact op.','تواصل معها مباشرة.'],
 ['Ouvre une fiche pour voir l’activité, les photos et contacter directement le commerce.','Abre un perfil para ver la actividad, las fotos y contactar directamente con el comercio.','Öffne ein Profil, um Tätigkeit und Fotos zu sehen und das Geschäft direkt zu kontaktieren.','Apri una scheda per vedere attività e foto e contattare direttamente il negozio.','Open een profiel om de activiteit en foto’s te zien en rechtstreeks contact op te nemen.','افتح الملف لرؤية النشاط والصور والتواصل مباشرة مع المتجر.'],
 ['Site','Sitio','Website','Sito','Website','الموقع'],
 ['Activation','Activación','Aktivierung','Attivazione','Activering','التفعيل']
];

function selected(){
 try{
  var q=(new URL(location.href)).searchParams.get('lang');
  if(SUPPORTED.indexOf(q)>=0)return q;
  var s=localStorage.getItem('digiy-lang');
  if(SUPPORTED.indexOf(s)>=0)return s;
 }catch(e){}
 return 'fr';
}
function ensureBase(lang){
 var desired=lang==='en'?'en':'fr';
 try{
  var current=localStorage.getItem('digiy_mon_commerce_lang')||'fr';
  localStorage.setItem('digiy-lang',lang);
  if(current!==desired){
   localStorage.setItem('digiy_mon_commerce_lang',desired);
   location.replace('https://mon-commerce.digiylyfe.com/?lang='+encodeURIComponent(lang)+'&v='+VERSION);
   return true;
  }
 }catch(e){}
 return false;
}
function injectStyles(){
 if(document.getElementById('commerce-seven-style'))return;
 var style=document.createElement('style');
 style.id='commerce-seven-style';
 style.textContent='#digiy-i18n-bar{display:none!important}.lang-switch{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:5px!important;width:100%!important;max-width:720px!important;flex:1 1 100%!important;order:20!important;pointer-events:auto!important}.lang-switch button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;min-height:40px!important;padding:0 7px!important;border-radius:999px!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important;white-space:nowrap!important}.lang-switch button.active{background:linear-gradient(135deg,#d6a85f,#f0d29a)!important;color:#17120e!important}@media(max-width:760px){.nav{width:100%!important}.lang-switch{grid-template-columns:repeat(4,minmax(0,1fr))!important;max-width:none!important}.lang-switch button{font-size:.76rem!important;padding:0 4px!important}}@media(max-width:390px){.lang-switch button{font-size:.69rem!important}}';
 document.head.appendChild(style);
}
function navigate(lang){
 if(SUPPORTED.indexOf(lang)<0)lang='fr';
 try{
  localStorage.setItem('digiy-lang',lang);
  localStorage.setItem('digiy_mon_commerce_lang',lang==='en'?'en':'fr');
 }catch(e){}
 try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
 location.assign('https://mon-commerce.digiylyfe.com/?lang='+encodeURIComponent(lang)+'&v='+VERSION);
}
function renderBar(lang){
 var bar=document.querySelector('.lang-switch');
 if(!bar)return;
 bar.innerHTML='';
 bar.setAttribute('aria-label',lang==='ar'?'اختيار اللغة':'Choisir la langue');
 SUPPORTED.forEach(function(code){
  var button=document.createElement('button');
  button.type='button';
  button.className=code===lang?'active':'';
  button.id=code==='fr'?'langFrBtn':code==='en'?'langEnBtn':'';
  button.dataset.digiyLang=code;
  button.textContent=LABELS[code];
  button.setAttribute('aria-pressed',code===lang?'true':'false');
  button.addEventListener('click',function(event){event.preventDefault();event.stopImmediatePropagation();navigate(code);},true);
  bar.appendChild(button);
 });
}
function buildPacks(){
 var out={es:{},de:{},it:{},nl:{},ar:{}};
 ITEMS.forEach(function(row){out.es[row[0]]=row[1];out.de[row[0]]=row[2];out.it[row[0]]=row[3];out.nl[row[0]]=row[4];out.ar[row[0]]=row[5];});
 return out;
}
function setMeta(lang){
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 var m=META[lang];
 if(!m)return;
 document.title=m.title;
 var d=document.querySelector('meta[name="description"]');
 if(d)d.setAttribute('content',m.description);
}
function activateUniversal(lang){
 function apply(){
  if(!window.DIGIY_I18N)return;
  window.DIGIY_I18N.register(buildPacks());
  window.DIGIY_I18N.setLanguage(lang);
  setMeta(lang);
  renderBar(lang);
 }
 if(window.DIGIY_I18N){apply();return;}
 var script=document.createElement('script');
 script.src='https://digiylyfe.com/assets/i18n/digiy-i18n.js?v='+VERSION;
 script.onload=apply;
 script.onerror=function(){setMeta(lang);renderBar(lang);};
 document.head.appendChild(script);
}
function init(){
 var lang=selected();
 if(ensureBase(lang))return;
 injectStyles();
 renderBar(lang);
 setMeta(lang);
 if(lang==='fr'||lang==='en'){
  setTimeout(function(){if(window.DIGIY_APPLY_COMMERCE_LANG)window.DIGIY_APPLY_COMMERCE_LANG();renderBar(lang);setMeta(lang);},0);
 }else{
  activateUniversal(lang);
 }
 setTimeout(function(){renderBar(lang);setMeta(lang);},400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
