// Reprodutível: node ra/celula/membrana/tools/construir.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
import {placaVolume} from '../../../texto-volume.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createCanvas as nativeCanvas, Canvas, ImageData, GlobalFonts} from '@napi-rs/canvas';

import {prepararParaRA} from '../../../potencial-membrana/cores-para-ra.js';
import {DURACAO, estadoPelicula, estadoTransporte, suave, limitar} from '../ciclo.js';

const createCanvas=(w,h)=>{const c=nativeCanvas(w,h);Object.defineProperty(c,'data',{value:undefined});return c;};
for(const f of ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','C:/Windows/Fonts/arial.ttf'])if(fs.existsSync(f)){GlobalFonts.registerFromPath(f,'Membrana');break;}
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets');
fs.mkdirSync(dir,{recursive:true});
globalThis.document={createElement:()=>createCanvas(1,1)};
globalThis.HTMLCanvasElement=Canvas;
globalThis.ImageData=ImageData;
globalThis.FileReader=class {
 readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();});}
 readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result=`data:${blob.type};base64,${Buffer.from(v).toString('base64')}`;this.onloadend?.();});}
};
// A malha procedural usa aleatoriedade apenas para textura e distribuição.
let seed=24625; Math.random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const tex=(w,h,draw,{repeatX=1,repeatY=1}={})=>{
 const c=createCanvas(w,h);draw(c.getContext('2d'),w,h);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);return t;
};
// Adaptador de autoria em memória: preserva byte a byte a biblioteca aprovada
// que também atende Neurônio, Interior e A onda. Só compila os dois retalhos.
let source=fs.readFileSync(new URL('../../../potencial-membrana/modelos.js',import.meta.url),'utf8');
source=source.replace('const modelos = [neuronio(), interior(), pelicula(), portas(), axonio()];',
 'const modelos = [new THREE.Group(),new THREE.Group(),pelicula(),portas(),new THREE.Group()];');
source=source.replace('  g.userData.postos = S;',
 '  g.movimento={o2,co2,kVaza,naEntra,acucar,naBomba,kBomba,atp,compNa,compFora,compDentro,canalK,canalNa,carr,bomba,yLivre};\n  g.userData.postos = S;');
source=source.replace(/from '(three(?:\/[^']*)?)'/g,(_,specifier)=>"from '"+import.meta.resolve(specifier)+"'");
const {criar}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const base=criar(tex);
base.aplicarPotencial(-70);

function placa(texto,x,y,z,w=2.3,cor='#d6edf4') {
 const p=placaVolume(texto,{largura:w,altura:w/6,espessura:.045,textoCor:cor});p.position.set(x,y,z);return p;
}

function cargasDoModelo(modelo,animadas) {
 const fontes=[];modelo.traverse(o=>{if(o.userData.nuvem)fontes.push(o);});
 const particulas=[];
 for(const fonte of fontes){
  const todas=fonte.userData.nuvem.cargas;
  fonte.removeFromParent();
  // Amostragem equilibrada por lado e sinal: íons grandes o bastante para leitura.
  for(const lado of [-1,1]) {
   const lista=todas.filter(c=>c.lado===lado);
   const quantidade=animadas?24:12;
   for(let i=0;i<quantidade;i++){
    const c=lista[Math.floor(i*lista.length/quantidade)];
    const m=new THREE.Mesh(new THREE.SphereGeometry(c.r*1.3,8,6),new THREE.MeshStandardMaterial({color:c.cor,roughness:.48,metalness:0}));
    m.name=`carga_${particulas.length}`;modelo.add(m);particulas.push({m,c,i});
   }
  }
 }
 return particulas;
}

function atualizarCargas(particulas,t,potencial) {
 particulas.forEach(({m,c,i})=>{
  const sinal=c.lado>0?Math.sign(potencial):-Math.sign(potencial);
  const f=c.pode&&c.z===sinal?suave(Math.abs(potencial)/90):0;
  m.position.copy(c.bulk).lerp(c.filme,f);
  // Agitação apenas tangencial; nenhuma partícula atravessa o lipídio neste modelo.
  m.position.x+=.035*Math.sin(t*Math.PI/2+i*1.7);
  m.position.z+=.025*Math.sin(t*Math.PI/2+i*2.4);
 });
}
const vis=(m,v)=>m.scale.setScalar(v?1:.00001);
function fluxo(m,t,periodo,fase,de,ate,x,z){
 const u=((t/periodo+fase)%1+1)%1;
 m.position.set(x,de+(ate-de)*u,z);
 // Desaparecimento no reservatório evita a falsa travessia inversa no reinício.
 m.scale.setScalar(Math.max(.00001,Math.min(suave(u/.08),suave((1-u)/.08))));
}

for(const [tipo,indice] of [['pelicula',2],['travessias',3]]) {
 const modelo=base.modelos[indice];modelo.visible=true;
 const ions=cargasDoModelo(modelo,tipo==='pelicula');
 modelo.add(placa('INTERIOR · citoplasma',0,2.55,.9,3.1,'#bba9f2'));
 modelo.add(placa('EXTERIOR · meio extracelular',0,-2.42,.9,3.5,'#8bd3dc'));
 const fases=[];
 if(tipo==='pelicula') {
  ['Repouso: interior negativo','Inversão das cargas','Interior positivo','Retorno ao repouso'].forEach((s,i)=>{const p=placa(s,0,3.05,.9,3.8);modelo.add(p);fases.push(p);});

 } else {
  const postos=modelo.userData.postos;
  for(const [nome,texto,cor] of [['livre','1 · O₂ / CO₂','#e8c49a'],['vazK','2 · canal K⁺','#f8c44d'],['volNa','2 · canal Na⁺','#ff9c68'],['carr','3 · glicose','#cdb3f8'],['bomba','4 · 3 Na⁺ / 2 K⁺','#92d6f0']]) {
   modelo.add(placa(texto,postos[nome].x,1.98,1.55,1.27,cor));
  }
  ['3 Na⁺ ligam-se no interior','ATP → 3 Na⁺ para fora','2 K⁺ ligam-se no exterior','2 K⁺ para dentro'].forEach(s=>{const p=placa(s,0,3.05,.9,3.8);modelo.add(p);fases.push(p);});
 }
 const refs=modelo.movimento;
 if(refs){refs.acucar.material=refs.acucar.material.clone();refs.acucar.material.color.set(0xc9a0ef);refs.atp.material=refs.atp.material.clone();refs.atp.material.color.set(0x65bce5);}
 const cabecas=modelo.getObjectByName('cabeças polares');
 if(cabecas){const a=cabecas.geometry.attributes.color;const cor=new THREE.Color(0xc5c9c2);for(let i=0;i<a.count;i++){const l=.75+.25*a.getX(i);a.setXYZ(i,cor.r*l,cor.g*l,cor.b*l);}cabecas.material=cabecas.material.clone();cabecas.material.roughness=.46;}
 const caudas=modelo.getObjectByName('caudas hidrofóbicas');if(caudas){caudas.material=caudas.material.clone();caudas.material.color.set(0x9c8374);}

 function atualizar(t){
  if(tipo==='pelicula') {
   const e=estadoPelicula(t);atualizarCargas(ions,t,e.potencial);fases.forEach((p,i)=>vis(p,i===e.fase));return;
  }
  atualizarCargas(ions,t,-70);
  const e=estadoTransporte(t),r=refs,S=modelo.userData.postos;
  r.o2.forEach((m,i)=>{fluxo(m,t,4,i/3,r.yLivre-1.55,r.yLivre+1.55,S.livre.x-.28+i*.22,S.livre.z);m.rotation.set(t*Math.PI/2,0,i);});
  r.co2.forEach((m,i)=>{fluxo(m,t,4,i/2,r.yLivre+1.55,r.yLivre-1.55,S.livre.x+.22+i*.20,S.livre.z+.13);m.rotation.set(0,t*Math.PI/2,i);});
  r.kVaza.forEach((m,i)=>fluxo(m,t,4,i/3,r.canalK.position.y+1.55,r.canalK.position.y-1.55,r.canalK.position.x,r.canalK.position.z));
  r.naEntra.forEach((m,i)=>fluxo(m,t,4,i/4,r.canalNa.position.y-1.55,r.canalNa.position.y+1.55,r.canalNa.position.x,r.canalNa.position.z));
  const n=r.canalNa.position,c=r.carr.position,b=r.bomba.position;
  r.compNa.position.set(n.x+.65,n.y+1.12,n.z+.23);
  r.compFora.position.set(c.x+.58*e.fora,c.y-.97-.12*e.fora,c.z+.21*e.fora);
  r.compDentro.position.set(c.x+.58*e.dentro,c.y+1.04+.12*e.dentro,c.z+.21*e.dentro);
  r.acucar.position.set(c.x,c.y-1.5+3*e.glicose,c.z);vis(r.acucar,e.t%8<7.5);r.acucar.rotation.y=t*Math.PI/4;
  const p=e.bomba;
  r.naBomba.forEach((m,i)=>{m.position.set(b.x+(i-1)*.14,b.y+1.5-3*suave((p-.20)/.25),b.z+(i-1)*.1);vis(m,p<.5);});
  r.kBomba.forEach((m,i)=>{m.position.set(b.x+(i-.5)*.16,b.y-1.5+3*suave((p-.70)/.25),b.z+(i-.5)*.1);vis(m,p>=.5);});
  r.atp.position.set(b.x+.65-.25*suave(p/.2),b.y+1.2,b.z+.32);r.atp.rotation.y=t*Math.PI;vis(r.atp,p<.3);
  // Pequena mudança conformacional acompanha a troca de acesso.
  r.bomba.rotation.z=.055*Math.sin(p*Math.PI*2);
  fases.forEach((m,i)=>vis(m,i===(p<.2?0:p<.5?1:p<.7?2:3)));
 }
 atualizar(0);
 const moveis=[...ions.map(p=>p.m),...fases];
 if(refs)moveis.push(...refs.o2,...refs.co2,...refs.kVaza,...refs.naEntra,refs.acucar,...refs.naBomba,...refs.kBomba,refs.atp,refs.compNa,refs.compFora,refs.compDentro,refs.bomba);
 const roles=new Map();
 if(refs){for(const key of ['o2','co2','kVaza','naEntra','naBomba','kBomba'])refs[key].forEach((m,i)=>roles.set(m,key+'_'+i));for(const key of ['acucar','atp','compNa','compFora','compDentro','bomba'])roles.set(refs[key],key);}
 const amostras=new Map(moveis.map((m,i)=>{m.name=`${tipo}_movel_${roles.get(m)||i}`;return[m,{pos:[],rot:[],scale:[]}];}));
 const times=[];const frames=DURACAO*24;
 for(let i=0;i<=frames;i++){
  const t=i/24;times.push(t);atualizar(t);
  for(const [m,a] of amostras){a.pos.push(...m.position.toArray());a.rot.push(...m.quaternion.toArray());a.scale.push(...m.scale.toArray());}
 }
 atualizar(0);
 const tracks=[];
 const mudou=(a,n)=>a.some((v,i)=>Math.abs(v-a[i%n])>1e-6);
 for(const [m,a] of amostras){
  if(mudou(a.pos,3))tracks.push(new THREE.VectorKeyframeTrack(m.name+'.position',times,a.pos));
  if(mudou(a.rot,4))tracks.push(new THREE.QuaternionKeyframeTrack(m.name+'.quaternion',times,a.rot));
  if(mudou(a.scale,3))tracks.push(new THREE.VectorKeyframeTrack(m.name+'.scale',times,a.scale));
 }
 // Remove metadados de execução e usa materiais glTF PBR básicos nos dois sistemas.
 modelo.traverse(o=>{o.userData=o.userData.textoRA?{textoRA:o.userData.textoRA}:{};o.visible=true;if(o.isMesh){const old=o.material;const m=new THREE.MeshStandardMaterial();m.copy(old);m.emissiveIntensity=Math.min(m.emissiveIntensity,1);o.material=m;}});
 prepararParaRA(modelo);
 let serial=0;modelo.traverse(o=>{if(!o.name.startsWith(tipo+'_movel_'))o.name=`${tipo}_estrutura_${serial++}`;});
 // Gêmeas de placas dupla face acompanham a animação (a conversão cria irmãos).
 for(const m of fases){const twin=modelo.children.find(o=>o!==m&&o.material===m.material&&o.geometry!==m.geometry&&o.position.equals(m.position));if(twin){twin.removeFromParent();m.add(twin);twin.position.set(0,0,0);twin.quaternion.identity();twin.scale.setScalar(1);}}
 modelo.traverse(o=>{o.name=o.name.replace(/[^a-zA-Z0-9_]/g,'_');if(o.isMesh&&!o.geometry.index)o.geometry.setIndex(Array.from({length:o.geometry.attributes.position.count},(_,i)=>i));});
 modelo.scale.setScalar(.075);modelo.position.y=.205;
 const wrap=new THREE.Group();wrap.name=tipo;wrap.add(modelo);
 const clip=new THREE.AnimationClip(tipo+'_ciclo',DURACAO,tracks);
 const buf=await new GLTFExporter().parseAsync(wrap,{binary:true,onlyVisible:true,animations:[clip],trs:true});
 const arquivo=path.join(dir,tipo+'-v1.glb');fs.writeFileSync(arquivo,Buffer.from(buf));
 console.log(JSON.stringify({tipo,bytes:buf.byteLength,tracks:tracks.length,segundos:DURACAO}));
}
