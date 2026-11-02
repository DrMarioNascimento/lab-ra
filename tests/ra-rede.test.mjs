import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
function files(dir){if(dir instanceof URL)dir=fileURLToPath(dir);return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.name==='node_modules'||x.name==='.git'||x.name==='arquivo'||x.name==='desenvolvimento'?[]:x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const sources=files(new URL('../',import.meta.url)).filter(p=>p.endsWith('.js')&&/\/(motor-ra|ac-ra)\.js$/.test(p)).filter(p=>fs.readFileSync(p,'utf8').includes('data-preload-chunks'));
test('explorar em 3D não baixa o rastreador; pedir câmera baixa uma única vez',async()=>{
 assert(sources.length>0);
 for(const file of sources){
  const appended=[],events={};const global={addEventListener:(n,f)=>events[n]=f};
  const c={window:global,navigator:{userAgent:'iPhone',maxTouchPoints:1},document:{createElement:()=>({setAttribute(){}}),head:{appendChild:x=>appended.push(x)}},setTimeout(){},console,Promise};
  vm.runInNewContext(fs.readFileSync(file,'utf8'),c);
  const api=global.OIRA||global.ACRA;await api.preparar();assert.equal(appended.length,0,file);
  const first=api.carregarXR8(),second=api.carregarXR8();assert.equal(first,second,file);assert.equal(appended.length,1,file);
  global.XR8={};events.xrloaded();await first;await api.carregarXR8();assert.equal(appended.length,1,file);
 }
});
const eco=files(new URL('../',import.meta.url)).filter(p=>p.endsWith('/maquete.js')&&fs.readFileSync(p,'utf8').includes('function interioresDoModelo(andar)'));
if(eco.length)test('Eco baixa somente o andar solicitado, reutiliza e tenta novamente após falha',()=>{
 for(const file of eco){
  const source=fs.readFileSync(file,'utf8'),start=source.indexOf('  function interioresDoModelo(andar)'),end=source.indexOf('\n  }',start)+5;
  const calls=[],added=[];const stage=()=>({children:[],remove(){},add:x=>added.push(x)});
  const context={global:{location:{search:''},THREE:{GLTFLoader:class{load(url,success,progress,error){calls.push({url,success,error});}}}},BASE:'/',INTERIORES:{'-1':['subsolo.glb',[0,0,0]],'+8':['imprensa.glb',[0,0,0]]},andares:{'-1':{interior:stage()},'+8':{interior:stage()}},telasImprensa(){}};
  vm.createContext(context);vm.runInContext('var interioresPendentes={};'+source.slice(start,end),context);
  assert.equal(calls.length,0);context.interioresDoModelo('-1');context.interioresDoModelo('-1');assert.equal(calls.length,1);
  calls[0].error();context.interioresDoModelo('-1');assert.equal(calls.length,2);
  calls[1].success({scene:{position:{set(){}},traverse(){}}});context.interioresDoModelo('-1');assert.equal(calls.length,2);assert.equal(added.length,1);
  context.interioresDoModelo('+8');assert.equal(calls.length,3);assert.equal(calls[2].url,'/imprensa.glb');
  assert.doesNotMatch(source,/enfeites\(\); interioresDoModelo\(\);/);
 }
});
