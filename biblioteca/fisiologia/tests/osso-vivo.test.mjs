import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {estado,avancar,fluxoCanalicular,CENARIOS} from '../osso-vivo/fisica.js';
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('osso: deposição e mineralização não antecedem reabsorção',()=>{
 const initial=estado(0);close(initial.mineral,1);close(initial.retirada,0);close(initial.depositada,0);
 assert(estado(.25).retirada>0);close(estado(.39).depositada,0);close(estado(.425).mineralizada,0);
 assert(estado(.6).depositada>estado(.6).mineralizada);assert(estado(.6).mineralizada>0);
});
test('osso: balanço e limites se conservam em todo cenário e progresso',()=>{
 for(const key of Object.keys(CENARIOS)){let before=estado(0,key);for(let i=0;i<=1000;i++){
  const a=estado(i/1000,key);for(const v of Object.values(a).filter(v=>typeof v==='number'))assert(Number.isFinite(v));
  assert(a.retirada>=before.retirada-1e-10);assert(a.depositada>=before.depositada-1e-10);assert(a.mineralizada>=before.mineralizada-1e-10);
  assert(a.mineralizada<=a.depositada);assert(a.osteoide>=0);assert(a.mineral>0);
  close(a.mineral,1-a.retirada+a.mineralizada);close(a.matriz,1-a.retirada+a.depositada);close(a.osteoide,a.depositada-a.mineralizada);before=a;
 }}
});
test('osso: comparação é explícita e o basal mantém o balanço final',()=>{
 close(estado(1).mineral,1);close(estado(1,'exercicio').mineral,1.0216);close(estado(1,'imobilizacao').mineral,.9154);
 for(const key of Object.keys(CENARIOS))close(estado(0,key).mineral,1);
 assert.deepEqual(estado(.6,'desconhecido'),estado(.6));assert.deepEqual(estado(NaN),estado(0));
});
test('osso: cursor é determinístico e loop preserva excedente sem acumular matriz',()=>{
 assert.deepEqual(estado(.7),estado(.7));close(avancar(.99,.03,true).t,.02);assert(!avancar(.99,.03,true).fim);
 assert.deepEqual(avancar(.99,.03),{t:1,fim:true});assert.deepEqual(avancar(.4,NaN),{t:.4,fim:false});
 close(avancar(.4,-1).t,.4);close(avancar(.2,.05).t,.25);
});
test('osso: fluido tem reversão contínua, responde à carga e fecha o loop',()=>{
 for(let k=0;k<20;k++){close(fluxoCanalicular(0,k,1),fluxoCanalicular(1,k,1));for(let i=0;i<=100;i++){const v=fluxoCanalicular(i/100,k,1.55);assert(v>=0&&v<=1);}}
 const f=t=>fluxoCanalicular(t,0,1.55);assert(f(.04)>f(.03));assert(f(.07)<f(.06));
 assert(Math.abs(fluxoCanalicular(0,0,1.55)-.5)>Math.abs(fluxoCanalicular(0,0,.18)-.5));
});
test('osso: documentação não confunde curvas escolhidas com medidas clínicas',()=>{
 const read=p=>fs.readFileSync(new URL('../osso-vivo/'+p,import.meta.url),'utf8');
 for(const p of ['index.html','app.js','modelos.js','fisica.js','style.css'])assert(!/lab-ra|accounts\.google|firebase-auth/.test(read(p)));
 assert.match(read('index.html'),/não extraídos como efeito clínico/);assert.match(read('README.md'),/sem conversão para dias/);
 assert.match(read('app.js'),/dt\*speed\/40/);assert.match(read('app.js'),/onlyVisible:true/);
});
