/* MON COMMERCE — localize visible business card descriptions; preserve phone numbers, prices, QR, data. */
(function(){
'use strict';
const translations={"en":{"astou":["Home linen · Textiles","Local store offering bed linen and home textiles in Saly.",["Bed sheets","Towels","Bathrobes","Home items"]],"bcheikh":["Men's fashion · T-shirts · Polos · Underwear","Direct sale of men's clothing. Confirm sizes, colors and availability directly with BCHEIKH.",["T-shirt / Polo · 7 000 FCFA","Pack of 3 · 20 000 FCFA","3 briefs · 7 000 FCFA","Men's fashion"]],"noa":["Bags · Watches · Belts · Accessories","Sale of bags, watches, belts and accessories. Verify prices, availability, brands and authenticity directly with the seller.",["Bags","Watches","Belts","Accessories"],"INVITED BUSINESS · DIRECT CONTACT","The seller is responsible for the products, their origin, prices and sales.","to the seller","VIEW CARD","VIEW PROFILE","Direct WhatsApp"]},"es":{"astou":["Ropa de hogar · Textiles","Tienda local de ropa de hogar y textiles en Saly.",["Sábanas","Toallas","Albornoces","Artículos para el hogar"]],"bcheikh":["Moda masculina · Camisetas · Polos · Ropa interior","Venta directa de ropa masculina. Confirma tallas, colores y disponibilidad con BCHEIKH.",["Camiseta / Polo · 7 000 FCFA","Lote de 3 · 20 000 FCFA","3 calzoncillos · 7 000 FCFA","Moda masculina"]],"noa":["Bolsos · Relojes · Cinturones · Accesorios","Venta de bolsos, relojes, cinturones y accesorios. Confirma precios, disponibilidad, marcas y autenticidad directamente con el vendedor.",["Bolsos","Relojes","Cinturones","Accesorios"],"COMERCIO INVITADO · CONTACTO DIRECTO","El vendedor responde por sus productos, origen, precios y ventas.","al vendedor","VER TARJETA","VER FICHA","WhatsApp directo"]},"pt":{"astou":["Roupa de casa · Têxteis","Loja local de roupa de casa e têxteis em Saly.",["Lençóis","Toalhas","Roupões","Artigos para casa"]],"bcheikh":["Moda masculina · T-shirts · Polos · Roupa interior","Venda direta de roupa masculina. Confirme tamanhos, cores e disponibilidade com BCHEIKH.",["T-shirt / Polo · 7 000 FCFA","Conjunto de 3 · 20 000 FCFA","3 cuecas · 7 000 FCFA","Moda masculina"]],"noa":["Malas · Relógios · Cintos · Acessórios","Venda de malas, relógios, cintos e acessórios. Confirme preços, disponibilidade, marcas e autenticidade diretamente com o vendedor.",["Malas","Relógios","Cintos","Acessórios"],"COMÉRCIO CONVIDADO · CONTACTO DIRETO","O vendedor responde pelos produtos, sua origem, preços e vendas.","ao vendedor","VER CARTÃO","VER FICHA","WhatsApp direto"]},"de":{"astou":["Heimtextilien · Stoffwaren","Lokales Geschäft für Heimtextilien und Haushaltswäsche in Saly.",["Bettwäsche","Handtücher","Bademäntel","Haushaltsartikel"]],"bcheikh":["Herrenmode · T-Shirts · Polos · Unterwäsche","Direktverkauf von Herrenbekleidung. Größen, Farben und Verfügbarkeit direkt bei BCHEIKH erfragen.",["T-Shirt / Polo · 7 000 FCFA","3er-Pack · 20 000 FCFA","3 Unterhosen · 7 000 FCFA","Herrenmode"]],"noa":["Taschen · Uhren · Gürtel · Accessoires","Verkauf von Taschen, Uhren, Gürteln und Accessoires. Preise, Verfügbarkeit, Marken und Echtheit direkt beim Verkäufer bestätigen.",["Taschen","Uhren","Gürtel","Accessoires"],"GASTHÄNDLER · DIREKTKONTAKT","Der Verkäufer ist verantwortlich für Produkte, Herkunft, Preise und Verkäufe.","an den Verkäufer","KARTE ANSEHEN","PROFIL ANSEHEN","WhatsApp direkt"]},"it":{"astou":["Biancheria per la casa · Tessili","Negozio locale di biancheria e tessili per la casa a Saly.",["Lenzuola","Asciugamani","Accappatoi","Articoli per la casa"]],"bcheikh":["Moda uomo · T-shirt · Polo · Intimo","Vendita diretta di abbigliamento da uomo. Verifica taglie, colori e disponibilità con BCHEIKH.",["T-shirt / Polo · 7 000 FCFA","Pacco da 3 · 20 000 FCFA","3 slip · 7 000 FCFA","Moda uomo"]],"noa":["Borse · Orologi · Cinture · Accessori","Vendita di borse, orologi, cinture e accessori. Verifica prezzi, disponibilità, marchi e autenticità direttamente con il venditore.",["Borse","Orologi","Cinture","Accessori"],"COMMERCIANTE OSPITE · CONTATTO DIRETTO","Il venditore è responsabile dei prodotti, della loro origine, dei prezzi e delle vendite.","al venditore","VEDI BIGLIETTO","VEDI SCHEDA","WhatsApp diretto"]},"nl":{"astou":["Huishoudtextiel · Stoffen","Lokale winkel voor huishoudtextiel in Saly.",["Lakens","Handdoeken","Badjassen","Woonartikelen"]],"bcheikh":["Herenmode · T-shirts · Polo's · Ondergoed","Directe verkoop van herenkleding. Vraag BCHEIKH rechtstreeks naar maten, kleuren en beschikbaarheid.",["T-shirt / Polo · 7 000 FCFA","Set van 3 · 20 000 FCFA","3 onderbroeken · 7 000 FCFA","Herenmode"]],"noa":["Tassen · Horloges · Riemen · Accessoires","Verkoop van tassen, horloges, riemen en accessoires. Bevestig prijzen, voorraad, merken en echtheid rechtstreeks bij de verkoper.",["Tassen","Horloges","Riemen","Accessoires"],"GASTWINKEL · DIRECT CONTACT","De verkoper is verantwoordelijk voor producten, herkomst, prijzen en verkopen.","aan de verkoper","BEKIJK KAART","BEKIJK PROFIEL","WhatsApp direct"]},"ar":{"astou":["مفروشات منزلية · منسوجات","متجر محلي للمفروشات والمنسوجات المنزلية في سالي.",["ملاءات","مناشف","أردية حمام","مستلزمات منزلية"]],"bcheikh":["أزياء رجالية · قمصان · بولو · ملابس داخلية","بيع مباشر للملابس الرجالية. تأكد من المقاسات والألوان والتوفر مع BCHEIKH.",["قميص / بولو · 7 000 FCFA","طقم 3 قطع · 20 000 FCFA","3 قطع داخلية · 7 000 FCFA","أزياء رجالية"]],"noa":["حقائب · ساعات · أحزمة · إكسسوارات","بيع الحقائب والساعات والأحزمة والإكسسوارات. تحقق من الأسعار والتوفر والعلامات التجارية والأصالة مباشرة مع البائع.",["حقائب","ساعات","أحزمة","إكسسوارات"],"تاجر ضيف · اتصال مباشر","البائع مسؤول عن منتجاته ومصدرها وأسعارها ومبيعاتها.","إلى البائع","عرض البطاقة","عرض الصفحة","واتساب مباشر"]},"wo":{"astou":["Linge de maison · Textile","Butik bu jaay linge de maison ak tissu ci Saly.",["Drap yi","Serwiyet yi","Peignoir yi","Jumtukaayi kër"]],"bcheikh":["Sol yu góor · Tee-shirt · Polo · Caleçon","Jaay bu jub ci yére yu góor. Laajal BCHEIKH taille, melokaan ak li am.",["Tee-shirt / Polo · 7 000 FCFA","Paket bu 3 · 20 000 FCFA","3 caleçon · 7 000 FCFA","Sol yu góor"]],"noa":["Sak yi · Montre yi · Ceinture yi · Accessoires","Jaay sak, montre, ceinture ak accessoires. Laajal jaaykat bi njëg, li am, marque ak ndax yëf yi dëgg lañu.",["Sak yi","Montre yi","Ceinture yi","Accessoires"],"JAAYKAT BU ÑU WOO · JOKKOO CI SA BOPP","Jaaykat bi mooy yor ay yëfam, fu ñu jóge, njëg yi ak njaay gi.","ci jaaykat bi","XOOLAL CARTE BI","XOOLAL FICHE BI","WhatsApp bu jub"]},"zh":{"astou":["家居布艺 · 纺织品","位于塞内加尔萨利的家纺及家居用品商店。",["床单","毛巾","浴袍","家居用品"]],"bcheikh":["男装 · T 恤 · Polo 衫 · 内裤","男装商品直接销售。尺码、颜色和库存请直接向 BCHEIKH 确认。",["T 恤 / Polo 衫 · 7 000 FCFA","3 件套 · 20 000 FCFA","3 条内裤 · 7 000 FCFA","男士服饰"]],"noa":["手袋 · 手表 · 腰带 · 配饰","销售手袋、手表、腰带及配饰。价格、库存、品牌与商品真伪请直接向卖家核实。",["手袋","手表","腰带","配饰"],"特邀商家 · 直接联系","商家自行对商品、来源、价格和交易负责。","付给卖家本人","查看名片","查看资料","直接联系 WhatsApp"]}};
const original=new WeakMap();
const names={'ASTOU BOUTIQUE':'astou','BCHEIKH':'bcheikh','ONCLE NOA':'noa'};
function put(node,value){
 if(!node||value===undefined)return;
 if(!original.has(node))original.set(node,node.textContent);
 node.textContent=value===null?original.get(node):value;
}
function locale(){
 const v=(document.documentElement.lang||'fr').toLowerCase().slice(0,2);
 return translations[v]?v:'fr';
}
function translateCard(card,lang){
 const h=card.querySelector('h2');if(!h)return;
 const key=names[(h.textContent||'').trim().toUpperCase()];
 if(!key)return;
 const translated=translations[lang]&&translations[lang][key];
 const p=translated||null;
 put(card.querySelector('.activity'),p?p[0]:null);
 put(card.querySelector('.desc'),p?p[1]:null);
 const chips=card.querySelectorAll('.chips .chip');
 chips.forEach((el,i)=>put(el,p?p[2][i]:null));
 if(key==='noa'){
  put(card.querySelector('.eyebrow'),p?p[3]:null);
  put(card.querySelector('.rule'),p?p[4]:null);
  put(card.querySelector('.direct > div:nth-child(2) > span'),p?p[5]:null);
  const actions=card.querySelectorAll('.actions a');
  [6,7,8].forEach((k,i)=>put(actions[i],p?p[k]:null));
  const hint=card.querySelector('.visual-hint');
  put(hint,p?'↗ '+p[6]:null);
 }
 if(key==='astou'||key==='bcheikh'){
  const site=card.querySelector('.actions a[href*="astou-boutique.digiylyfe.com/"], .actions a[href*="bcheikh.digiylyfe.com/"]');
  if(site){
   const url=new URL(site.href);url.searchParams.set('lang',lang);site.href=url.toString();
  }
 }
}
function apply(){
 const lang=locale();
 document.querySelectorAll('main > article.listing').forEach(c=>translateCard(c,lang));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
document.addEventListener('click',event=>{if(event.target.closest&&event.target.closest('#langs button'))setTimeout(apply,0)});
})();
