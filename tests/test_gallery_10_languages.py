"""MON COMMERCE : galerie territoriale à 10 langues sans modifier les paiements directs."""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/"index.html").read_text(encoding="utf-8")
GALLERY=(ROOT/"galerie.html").read_text(encoding="utf-8")
MASTER=(ROOT/"commerce-master-v1.js").read_text(encoding="utf-8")
EXAMPLES=(ROOT/"commerce-open-places-v1.js").read_text(encoding="utf-8")
GUARD=(ROOT/"commerce-territory-guard-v1.js").read_text(encoding="utf-8")
CARDS=(ROOT/"commerce-gallery-cards-10.js").read_text(encoding="utf-8")
ROUTE=(ROOT/"commerce-public-route.js").read_text(encoding="utf-8")
LANDING=(ROOT/"lang.html").read_text(encoding="utf-8")
LANGS=["fr","en","es","pt","de","it","nl","ar","wo","zh"]

class CommerceGalleryTenLanguages(unittest.TestCase):
    def test_selector_and_primary_dictionary(self):
        nav=HTML.split('<div class="langs" id="langs">',1)[1].split('</div>',1)[0]
        self.assertEqual(re.findall(r'data-lang="([^"]+)"',nav),LANGS)
        self.assertIn(">🇸🇳 WO</button>",nav)
        self.assertIn(">🇨🇳 中文</button>",nav)
        self.assertIn('lang="zh-CN"',nav)
        m=re.search(r"const T = (\{.*?\});\s*function setLang",HTML,re.S)
        self.assertIsNotNone(m)
        d=json.loads(m.group(1))
        self.assertEqual(set(d),set(LANGS))
        for key in LANGS:
            self.assertEqual(set(d[key]),set(d["fr"]))
            self.assertEqual(len(d[key]),19)
        self.assertIn("lang==='zh'?'zh-CN':lang",HTML)
        self.assertIn('id="commerces"',HTML)
        self.assertIn("commerce-gallery-cards-10.js",HTML)

    def test_dynamic_example_translations(self):
        self.assertIn("const LANGS=['fr','en','es','pt','de','it','nl','ar','wo','zh']",EXAMPLES)
        m=re.search(r'const T=\{\s*wo:(\{[^\n]+\}),\s*zh:(\{[^\n]+\}),\s*fr:',EXAMPLES)
        self.assertIsNotNone(m)
        wo,zh=json.loads(m.group(1)),json.loads(m.group(2))
        self.assertEqual(set(wo),set(zh))
        self.assertEqual(len(wo["items"]),5)
        self.assertEqual(len(zh["items"]),5)
        self.assertEqual(len(wo["items"][0][2]),4)
        self.assertEqual(len(zh["items"][0][2]),4)
        self.assertIn("19 900 FCFA",wo["join"])
        self.assertIn("19,900",zh["join"])
        self.assertIn("const l=(document.documentElement.lang||'fr').slice(0,2)",EXAMPLES)
        self.assertIn("lang()==='wo'||lang()==='zh'?'fr':lang()",EXAMPLES)

    def test_real_shops_galleries_all_ten_languages(self):
        m=re.search(r'const translations=(\{.*?\});\s*const original=',CARDS,re.S)
        self.assertIsNotNone(m)
        d=json.loads(m.group(1))
        self.assertEqual(set(d),set(LANGS)-{"fr"})
        for lang,shops in d.items():
            self.assertEqual(set(shops),{"astou","bcheikh","noa"},lang)
            for name,fields in shops.items():
                self.assertEqual(len(fields),9 if name=="noa" else 3,(lang,name))
                self.assertEqual(len(fields[2]),4)
        self.assertIn("original=new WeakMap()",CARDS)
        self.assertIn("original.get(node)",CARDS)
        self.assertIn("document.querySelectorAll('main > article.listing')",CARDS)
        self.assertIn("site.href=url.toString()",CARDS)

    def test_language_routing_and_locality(self):
        self.assertIn("#commerces",GALLERY)
        self.assertIn("query.set('lang',lang)",GALLERY)
        self.assertIn("location.replace(target)",GALLERY)
        for content in (MASTER,ROUTE,GUARD):
            self.assertIn("wo",content)
            self.assertIn("zh",content)
        self.assertIn("wo|zh",LANDING)

    def test_pro_contacts_and_existing_prices_untouched(self):
        for value in ("https://wa.me/221778765785","https://wa.me/221786523129",
                      "https://wa.me/221778329612","7 000 FCFA","20 000 FCFA",
                      "+221 77 876 57 85","0 %"):
            self.assertIn(value,HTML)
        self.assertIn("ASTOU_CARD",EXAMPLES)
        self.assertNotIn("supabase",CARDS.lower())
        self.assertNotIn("fetch(",CARDS)
        self.assertNotIn("eval(",CARDS)

    @unittest.skipUnless(shutil.which("node"),"Node not installed")
    def test_javascript_valid(self):
        for path in ("commerce-open-places-v1.js","commerce-gallery-cards-10.js",
                     "commerce-master-v1.js","commerce-public-route.js",
                     "commerce-territory-guard-v1.js"):
            result=subprocess.run(["node","--check",str(ROOT/path)],capture_output=True,text=True,check=False)
            self.assertEqual(result.returncode,0,path+"\n"+result.stderr)
        for path in ("index.html","galerie.html","lang.html"):
            content=(ROOT/path).read_text(encoding="utf-8")
            for script in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',content,re.S):
                if not script.strip():continue
                result=subprocess.run(["node","--check"],input=script,capture_output=True,text=True,check=False)
                self.assertEqual(result.returncode,0,path+"\n"+result.stderr)

if __name__=="__main__":
    unittest.main()
