'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const file=fs.readFileSync(path.join(__dirname,'gestion-produits-v3.html'),'utf8');
const helper=fs.readFileSync(path.join(__dirname,'owner-phone-mfa-v1.js'),'utf8');
const match=file.match(/<script>\s*([\s\S]*?)<\/script>/);
assert.ok(match,'must include inline management script');
function fakeNode(){
 const children=[];
 return {className:'',value:'',href:'',textContent:'',hidden:true,children,
  classList:{add(){}},appendChild(x){children.push(x);return x},querySelector(sel){
   this.q??={};return this.q[sel]??(this.q[sel]=fakeNode());
  },set innerHTML(x){this._innerHTML=x},get innerHTML(){return this._innerHTML}};
}
async function run({guardPresent=true,guardAllows=false,withOrder=false,ordersVerified=true}={}){
 const byId=new Map(),created=[],calls=[],guardCalls=[];
 const $=id=>{if(!byId.has(id))byId.set(id,fakeNode());return byId.get(id)};
 const document={getElementById:$,createElement:()=>{const n=fakeNode();created.push(n);return n}};
 const sampleOrder={
  id:'sample-order',product_name:'Sample basket',quantity:1,
  customer_name:'Test Customer',customer_phone:'221770000000',
  status:'request',created_at:'2026-10-09T00:00:00Z',
  country:'SN',city:'Saly',delivery_address:null,currency:'XOF',
  order_source:'cart',message:''
 };
 const dangerous='<img src=x onerror=alert(1)>';
 const mockDb={
  from(table){
   calls.push(table);
   let q={select(){return q},eq(){return q},order(){return Promise.resolve({data:table==='digiy_commerce_sites'?null:table==='digiy_commerce_orders'&&withOrder?[sampleOrder]:table==='digiy_commerce_products'?[]:null,error:null})},
    maybeSingle(){return Promise.resolve({data:{slug:'sample-shop',name:'Sample Shop'},error:null})},
    in(){return q},update(){return q},delete(){return q},insert(){return Promise.resolve({error:null})}};
   if(table==='digiy_commerce_order_items')q.order=()=>Promise.resolve({data:[{
    order_id:'sample-order',product_name:dangerous,quantity:1,unit_price_label:'100 FCFA',variant:'<svg/onload=alert(2)>',position:1
   }],error:null});
   return q;
  }
 };
 const sb={
  auth:{
    getUser:async()=>({data:{user:{id:'auth-user-fixture'}},error:null}),
    signOut:async()=>{},
    mfa:{getAuthenticatorAssuranceLevel:async()=>({data:{currentLevel:ordersVerified?'aal2':'aal1'},error:null})}
  },
  rpc:async function(){return {data:{ok:true,required:ordersVerified,matching_phone_factor_verified:ordersVerified},error:null}},
  ...mockDb
 };
 const fakeWindow={supabase:{createClient:()=>sb}};
 if(guardPresent)fakeWindow.DIGIY_OWNER_PHONE_MFA={guard:async x=>{guardCalls.push(x);return guardAllows}};
 const location={origin:'https://mon-commerce.digiylyfe.com',href:'https://mon-commerce.digiylyfe.com/gestion-produits-v3.html?site=sample-shop'};
 const ctx={window:fakeWindow,document,location,URL,console,setTimeout};
 await vm.runInNewContext(match[1],ctx,{timeout:1000});
 return {byId:$,calls,guardCalls,created,helper,order:sampleOrder};
}
test('COMMERCE owner session never reads shop or orders when phone MFA denied',async()=>{
 const r=await run({guardAllows:false});
 assert.equal(r.guardCalls.length,1);
 assert.equal(r.calls.length,0);
 assert.equal(r.byId('editor').hidden,true);
 assert.match(r.byId('status').textContent,/téléphone/);
});
test('missing MFA helper fails closed instead of opening products',async()=>{
 const r=await run({guardPresent:false});
 assert.equal(r.calls.length,0);
 assert.equal(r.byId('ordersCard').hidden,true);
 assert.match(r.byId('status').textContent,/indisponible/);
});
test('owner MFA precedes merchant reads; all cart text rendered as text',async()=>{
 const r=await run({guardAllows:true,withOrder:true});
 assert.equal(r.guardCalls.length,1);
 assert.equal(r.guardCalls[0].offerEnrollment,false,'no SMS prompt for email-only account');
 assert.ok(r.calls.includes('digiy_commerce_sites'));
 assert.ok(r.calls.includes('digiy_commerce_order_items'));
 const entries=r.created.flatMap(x=>[...x.children,...Object.values(x.q||{}).flatMap(y=>y.children||[])]);
 assert.ok(entries.some(e=>e.textContent.includes('<img src=x onerror=alert(1)>')),'literal customer item kept as inert text');
 const box=r.created.find(x=>x.className==='order');
 assert.ok(box);
 const itemList=box.querySelector('.lines');
 assert.equal(itemList._innerHTML,undefined,'untrusted lines never parsed as HTML');
 const wa=box.querySelector('.wa');
 assert.match(decodeURIComponent(wa.href),/chez Sample Shop/);
 assert.doesNotMatch(decodeURIComponent(wa.href),/chez Astou Boutique/);
});
test('COMMERCE email-only: the real authenticated owner can read orders without SMS',async()=>{
 const r=await run({guardAllows:true,withOrder:true,ordersVerified:false});
 assert.ok(r.calls.includes('digiy_commerce_sites'));
 assert.ok(r.calls.includes('digiy_commerce_products'));
 assert.ok(r.calls.includes('digiy_commerce_orders'));
 assert.ok(r.calls.includes('digiy_commerce_order_items'));
 assert.equal(r.byId('ordersCard').hidden,false);
 assert.equal(r.guardCalls[0].offerEnrollment,false);
 assert.equal(r.byId('ordersLocked').hidden,true);
});
test('COMMERCE still denies private order access when existing owner guard rejects',async()=>{
 const r=await run({guardAllows:false,withOrder:true});
 assert.ok(!r.calls.includes('digiy_commerce_orders'));
 assert.equal(r.byId('ordersCard').hidden,true);
});
test('MFA helper requires real Supabase Auth MFA and no client-side bypass',()=>{
 assert.match(file,/<script src="\.\/owner-phone-mfa-v1\.js"><\/script>/);
 assert.match(file,/DIGIY_OWNER_PHONE_MFA\.guard/);
 assert.match(file,/offerEnrollment:false/);
 assert.doesNotMatch(file,/ordersUnlocked|phoneContextError|\.from\("digiy_core_private/);
 assert.match(helper,/mfa\.getAuthenticatorAssuranceLevel/);
 assert.match(helper,/mfa\.challenge/);
 assert.match(helper,/mfa\.verify/);
 assert.match(helper,/digiy_owner_mfa_context/);
 assert.match(helper,/digiy_owner_mfa_activate/);
 assert.doesNotMatch(file,/\.lines"\)\.innerHTML\s*=/);
});
