'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const html=fs.readFileSync(path.join(__dirname,'acces-proprietaire-v4.html'),'utf8');
const helper=fs.readFileSync(path.join(__dirname,'owner-phone-mfa-v1.js'),'utf8');
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'owner email access script exists');

function page(){
 const nodes=new Map();
 const node=id=>{
  if(!nodes.has(id)) nodes.set(id,{value:'',textContent:'',hidden:true,href:'https://mon-commerce.digiylyfe.com/index.html',disabled:false,className:'',classList:{toggle(){}},dataset:{}});
  return nodes.get(id);
 };
 const dom={
  documentElement:{lang:'fr',dir:'ltr'},
  getElementById:node,
  querySelector:()=>node('i18n'),
  querySelectorAll:()=>[]
 };
 return {node,dom};
}
async function runEmail({verifySuccess=true,enteredCode='123456'}={}){
 const {node,dom}=page();
 let loggedIn=false,otpRequests=[],verifications=[],redirects=[];
 const sb={
   auth:{
    getSession:async()=>({data:{session:loggedIn?{user:{id:'verified-test-user'}}:null},error:null}),
    signInWithOtp:async x=>{otpRequests.push(x);return {error:null}},
    verifyOtp:async x=>{verifications.push(x);if(!verifySuccess) return {error:{message:'Code invalide'}};loggedIn=true;return {error:null}}
   }
 };
 const location={href:'https://mon-commerce.digiylyfe.com/acces-proprietaire-v4.html?site=astou-boutique',origin:'https://mon-commerce.digiylyfe.com',replace:x=>{redirects.push(x)}};
 const localStorage={getItem:()=>null,setItem(){}};
 const context={window:{supabase:{createClient:()=>sb}},document:dom,location,localStorage,URL};
 vm.runInNewContext(script,context,{timeout:1200});
 await new Promise(resolve=>setImmediate(resolve));
 node('email').value='owner@example.test';
 await node('send').onclick();
 node('otpToken').value=enteredCode;
 await node('verifyOtp').onclick();
 return {node,otpRequests,verifications,redirects};
}
test('email owner login preserves existing magic-link and never creates a new user',async()=>{
 const x=await runEmail();
 assert.equal(x.otpRequests.length,1);
 assert.equal(x.otpRequests[0].options.shouldCreateUser,false);
 assert.ok(x.otpRequests[0].options.emailRedirectTo.endsWith('/gestion-produits-v3.html'));
 assert.equal(x.node('otpPanel').hidden,false,'email code is an option after email request');
 assert.equal(x.verifications.length,1);
 assert.equal(x.verifications[0].type,'email');
 assert.match(x.redirects[0],/site=astou-boutique/);
});
test('invalid email OTP code never creates a session or redirects',async()=>{
 const x=await runEmail({verifySuccess:false});
 assert.equal(x.redirects.length,0);
 assert.equal(x.verifications.length,1);
 assert.match(x.node('msg').textContent,/invalide/);
});
test('bad OTP format is rejected without contacting Supabase Auth',async()=>{
 const x=await runEmail({enteredCode:'<script>'});
 assert.equal(x.verifications.length,0);
 assert.equal(x.redirects.length,0);
});
test('commerce helper suppresses paid SMS offer when not required, but blocks required accounts',async()=>{
 const box={className:'',innerHTML:'',querySelector(){return {onclick:null}},parentNode:null};
 const elements={getElementById:()=>null,createElement:()=>box,body:{prepend(){}}};
 let called=0;
 const ctx={window:{},document:elements,setTimeout,location:{reload(){}}};
 vm.runInNewContext(helper,ctx,{timeout:1200});
 assert.equal(typeof ctx.window.DIGIY_OWNER_PHONE_MFA.guard,'function');
 const sb={
  rpc:async()=>({data:{ok:true,required:false,phone:'+221000000000'},error:null}),
  auth:{mfa:{listFactors:async()=>{called++;return {data:{phone:[]},error:null}}}}
 };
 assert.equal(await ctx.window.DIGIY_OWNER_PHONE_MFA.guard({supabase:sb,offerEnrollment:false}),true);
 assert.equal(called,0,'no phone enrollment/challenge for email-only account');
 assert.match(html,/verifyOtp\(\{email,token,type:"email"\}\)/);
 assert.match(html,/signInWithOtp\(\{email,options:\{shouldCreateUser:false/);
});
