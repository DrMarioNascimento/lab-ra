import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {equilibrio,criarEstado,avancar,quadro,conteudo,saturacao} from '../integracao/fisica.js';
const close=(a,b,t=1e-9)=>assert(Math.abs(a-b)<t,`${a} != ${b}`),read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));
test('integração: Fick, oferta, extração e conteúdo se conservam em todos os esforços',()=>{
 let previous=equilibrio(0);for(let k=0;k<=1000;k++){const a=equilibrio(k/1000);for(const v of Object.values(a))assert(Number.isFinite(v));
 close(a.dc,a.fc*a.vs/1000);close(a.vo2,a.dc*(a.cao2-a.cvo2)/100);close(a.oferta,a.dc*a.cao2/100);close(a.vo2,a.oferta*a.extracao);close(a.cvo2,conteudo(a.po2v));close(a.sv,saturacao(a.po2v));
 assert(a.sv>0&&a.sv<a.sa&&a.sa<1);assert(a.extracao>0&&a.extracao<1);assert(a.dc>=previous.dc&&a.vo2>=previous.vo2&&a.extracao>=previous.extracao);previous=a;
 }
 close(equilibrio(0).dc,4.9);close(equilibrio(1).dc,16.5);close(equilibrio(0).vo2,.25);close(equilibrio(1).vo2,2.2);
});
test('integração: ventilação desconta espaço morto e é coerente com CO2 fixado',()=>{
 for(let k=0;k<=100;k++){const a=equilibrio(k/100);close(a.ve,a.fr*a.vt);close(a.va,a.fr*(a.vt-a.vd));close(a.paco2,.863*a.vco2*1000/a.va);assert(a.vt>.15&&a.vt<2);assert(a.pao2>a.po2a&&a.po2a>90);}
});
test('integração: transição contínua é reversível e fases não se reiniciam',()=>{
 const s=criarEstado();s.alvo=1;avancar(s,8);close(s.esforco,1-Math.exp(-1));assert(s.cardiaco>s.respiratorio);const fc=s.cardiaco,fr=s.respiratorio;s.alvo=0;avancar(s,8);close(s.esforco,(1-Math.exp(-1))*Math.exp(-1));assert(s.cardiaco>fc&&s.respiratorio>fr);const old={...s};avancar(s,0);assert.deepEqual(s,old);
 const a=criarEstado(),b=criarEstado();a.alvo=b.alvo=1;avancar(a,10);for(let i=0;i<600;i++)avancar(b,1/60);for(const key of ['tempo','esforco','cardiaco','respiratorio','transporte'])close(a[key],b[key],1e-7);
});
test('integração: quadros têm movimentos limitados e compartilham o mesmo estado',()=>{
 const s=criarEstado();s.alvo=1;for(let i=0;i<2000;i++){avancar(s,.04);const a=quadro(s);for(const key of ['sistole','inspiracao','contracao'])assert(a[key]>=0&&a[key]<=1);close(a.dc,a.fc*a.vs/1000);close(a.vo2,a.dc*a.diferenca/100);}
 assert.deepEqual(equilibrio(NaN),equilibrio(0));assert.deepEqual(equilibrio(2),equilibrio(1));
});
test('integração: corpo e coração usam Meshopt local sem simplificação anatômica',()=>{
 for(const name of ['corpo','coracao']){const b=read('integracao/assets/'+name+'.glb'),j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));assert(j.extensionsRequired.includes('EXT_meshopt_compression'));assert(j.bufferViews.some(v=>v.extensions?.EXT_meshopt_compression));assert(j.buffers.every(b=>!b.uri||b.uri.startsWith('data:')));}
 const r=JSON.parse(read('integracao/assets/compressao.json'));for(const a of r.models)assert(a.compressed<a.original);assert.match(r.method,/sem simplify/);
});
test('integração: acesso exclusivo às bancadas LAB-RA e dependências locais',()=>{
 const html=read('integracao/index.html').toString();assert.match(html,/Como interpretar/);assert.match(html,/WebXR/);assert.match(html,/href="\.\.\/bancadas.html"/);assert.match(html,/Voltar às bancadas/);assert.doesNotMatch(html,/tutor-origem|tutor-ef|tutor-fisio|data-voltar-tutor|fisiologia-interativa/);assert.match(read('bancadas.html').toString(),/href="integracao\/"/);assert.match(read('integracao/style.css').toString(),/base.css/);assert.doesNotMatch(read('integracao/base.css').toString(),/@import/);assert.match(read('integracao/README.md').toString(),/exclusiva do LAB-RA/);assert.match(read('integracao/app.js').toString(),/renderer\.setAnimationLoop/);
});
