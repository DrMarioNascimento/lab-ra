/* Compilação: copia o movimento dos modelos originais, sem motor paralelo. */
import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {prepararParaRA} from '../cores-para-ra.js';
import {placaVolume} from '../texto-volume.js';
import {texturaOsso,texturaJuncao,normalDeRelevo} from './texturas-das-bancadas.js';
import {TECIDOS,marcarTecidos,texturizar} from '../texturas-tecido.js';
import {formasReduzidas} from './formas-reduzidas.js';
export function textura(w,h,draw,{repeatX=1,repeatY=1}={}){
 const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeatX,repeatY);return t;
}
export async function preparar(tipo,nivel){
 let seed=251026+nivel;for(const c of tipo)seed=(seed*31+c.charCodeAt(0))>>>0;
 Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 let a,update,duracao=8,titulo,modo='ciclo',acabamento;
 if(tipo==='osso-vivo'){
  a=(await import('../osso-vivo/modelos.js')).criar(texturaOsso);
  update=u=>a.atualizar(nivel,u,'habitual',0,true);titulo=['Osso vivo','Carga no osso compacto','Carga no osteon','Reabsorção óssea','Formação e mineralização'][nivel];
  if(nivel>=3)modo='sequencia';
 }else if(tipo==='juncao-neuromuscular'){
  const f=await import('../juncao-neuromuscular/fisica.js');a=(await import('../juncao-neuromuscular/modelos.js')).criar(texturaJuncao);
  if(nivel===4)await a.prepararSarcomero(textura);
  const sim=f.simular();update=u=>a.atualizar(nivel,f.noInstante(sim,u*sim.duracao),u*sim.duracao,sim);
  titulo=['Junção neuromuscular','Placa motora','Potencial no sarcolema','Acoplamento excitação-contração','Contração do sarcômero'][nivel];modo='sequencia';
 }else if(tipo==='musculo-sarcomero'){
  a=(await import('../musculo-sarcomero/modelos.js')).criar(textura);
  update=u=>{const L=2.4-.5*(.5-.5*Math.cos(u*2*Math.PI));const m=a.modelos[nivel];if(nivel===4)a.aplicarComprimento(m,L);else for(const s of m.userData.sarcomeros||[])a.aplicarComprimento(s,L);};
  titulo=nivel===4?'Deslizamento dos filamentos':'Contração da miofibrila';
 }else if(tipo==='starling'){
  const f=await import('../starling/fisica.js');a=(await import('../starling/modelos.js')).criar();
  update=u=>{a.animar(u*8,x=>f.pressaoLiquida(x),{encharcado:0,semLinfa:false,nivel,sigma:f.PADRAO.sigma,oncPlasma:f.PADRAO.oncPlasma,kf:f.PADRAO.kf});a.aplicarForcas(nivel,f.PADRAO,f.pressaoCapilar,f.oncExterna);};
  titulo=['Microcirculação','Trocas pela parede capilar','Forças de Starling','Glicocálix','Retorno linfático'][nivel];
 }else if(tipo==='retorno-venoso'){
  a=await(await import('../retorno-venoso/modelos.js')).criar();
  update=u=>{a.aplicarPostura(90,.7);a.aplicarBomba(u,90,.7,true);};titulo=nivel===2?'Válvulas venosas':'Bomba muscular da panturrilha';duracao=2.3;
 }else if(tipo==='pleura'){
  a=(await import('../pleura/modelos.js')).criar();const f=await import('../pleura/fisica.js'),perfil=await import('../pleura/estados.js');
  update=u=>{const e=perfil.estadoDoPerfil(u),volume=e.volume;a.aplicarTorax(nivel,{pulmao:.4,caixa:.4,ciclo:Math.cbrt(volume/.4),inspiracao:e.expansao});a.aplicarCoracao(nivel,perfil.contracaoCardiaca(u*4,75));};
  titulo='Mecânica respiratória';duracao=4;
 }else throw Error('Experiência desconhecida: '+tipo);
 // Superfície de tecido onde a experiência declarou famílias (texturas-tecido.js).
 if(TECIDOS[tipo]){marcarTecidos(a.modelos,TECIDOS[tipo]);acabamento=texturizar;}
 const root=a.modelos[nivel];root.visible=true;update(0);
 return {root,update,duracao,titulo,modo,acabamento};
}
export async function compilar({root,update,duracao=8,titulo,modo='ciclo',acabamento}){
 update(0);root.updateMatrixWorld(true);
 const wrap=new T.Group(),modelo=new T.Group();wrap.add(modelo);
 const pares=[];let serial=0;
 function copiar(o,pai){
  if(o.userData.naoExportar||o.isPoints||o.isLine||o.isSprite)return;
  let c;
  if(o.isMesh){
   let mat=Array.isArray(o.material)?o.material[0]:o.material;
   const material=new T.MeshStandardMaterial();if(mat.isMeshStandardMaterial)material.copy(mat);else{for(const key of ['color','map','alphaMap','normalMap','opacity','transparent','side','depthWrite'])if(mat[key]!==undefined)material[key]=mat[key]?.clone&&!mat[key].isTexture?mat[key].clone():mat[key];}material.emissiveIntensity=Math.min(material.emissiveIntensity,1);
   // relevo vira normal: o USDZ não lê EXT_materials_bump
   if(material.bumpMap&&!material.normalMap){material.normalMap=normalDeRelevo(material.bumpMap,material.bumpScale);material.bumpMap=null;material.bumpScale=1;}
   c=new T.Mesh(o.geometry.clone(),material);
  }else c=new T.Group();
  c.name='movel_'+serial++;c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);pai.add(c);
  pares.push({o,c,pos:[],rot:[],scale:[],base:o.isMesh?new Float32Array(o.geometry.attributes.position.array):null,formas:[]});
  for(const filho of o.children)copiar(filho,c);
 }
 copiar(root,modelo);
 const limites=new T.Box3().setFromObject(modelo);const passoForma=root.children.length>0&&titulo==='Mecânica respiratória'?32:8;const N=128,tempos=Array.from({length:N+1},(_,k)=>k*duracao/N),temposForma=[];
 for(let k=0;k<=N;k++){
  const u=k/N;update(u);root.updateMatrixWorld(true);
  limites.union(new T.Box3().setFromObject(root));const fade=modo==='sequencia'?Math.min(1,u/.015,(1-u)/.015):1;
  for(const p of pares){
   p.pos.push(...p.o.position.toArray());p.rot.push(...p.o.quaternion.toArray());
   let vis=true;for(let o=p.o;o&&o!==root.parent;o=o.parent)if(!o.visible){vis=false;break;}
   const s=p.o.scale.clone().multiplyScalar(vis?Math.max(.00001,fade):.00001);p.scale.push(...s.toArray());
   if(p.base&&k%passoForma===0)p.formas.push(new Float32Array(p.o.geometry.attributes.position.array));
  }
  if(k%passoForma===0)temposForma.push(k*duracao/N);
 }
 update(0);
 const trilhas=[],mudou=(a,n)=>a.some((v,i)=>Math.abs(v-a[i%n])>1e-6);
 for(const p of pares){
  if(mudou(p.pos,3))trilhas.push(new T.VectorKeyframeTrack(p.c.name+'.position',tempos,p.pos));
  if(mudou(p.rot,4))trilhas.push(new T.QuaternionKeyframeTrack(p.c.name+'.quaternion',tempos,p.rot));
  if(mudou(p.scale,3))trilhas.push(new T.VectorKeyframeTrack(p.c.name+'.scale',tempos,p.scale));
  p.c.position.fromArray(p.pos);p.c.quaternion.fromArray(p.rot);p.c.scale.fromArray(p.scale);
  if(p.base&&p.formas.some(f=>f.some((v,i)=>Math.abs(v-p.base[i])>1e-5))){
   const g=p.c.geometry,r=formasReduzidas(p.base,p.formas);g.setAttribute('position',new T.BufferAttribute(r.base,3));
   g.morphAttributes.position=r.alvos.map(a=>new T.BufferAttribute(a,3));g.morphTargetsRelative=true;p.c.updateMorphTargets();
   r.pesos.slice(0,r.alvos.length).forEach((w,j)=>p.c.morphTargetInfluences[j]=w);trilhas.push(new T.NumberKeyframeTrack(p.c.name+'.morphTargetInfluences',temposForma,r.pesos));
  }
 }
 const tam=limites.getSize(new T.Vector3()),escala=.55/Math.max(tam.x,tam.y,tam.z);modelo.scale.setScalar(escala);modelo.position.set(-(limites.min.x+limites.max.x)/2*escala,-limites.min.y*escala,-(limites.min.z+limites.max.z)/2*escala);
 // Superfície de tecido medida já na escala final (metros no ambiente).
 const acabado=acabamento?acabamento(modelo):null;
 const placa=placaVolume(titulo,{largura:.48,altura:.055,espessura:.008});placa.position.set(0,.04,.35);wrap.add(placa);
 wrap.traverse(o=>{if(o.isMesh&&!o.geometry.index)o.geometry.setIndex(Array.from({length:o.geometry.attributes.position.count},(_,i)=>i));});
 prepararParaRA(wrap);
 // Gêmeas de dupla face precisam acompanhar os mesmos alvos e transformações.
 const twins=[];wrap.traverse(o=>{if(o.name.endsWith('-avesso'))twins.push(o);});
 for(const twin of twins){
  const origem=pares.find(p=>p.c.name===twin.name.slice(0,-7));if(!origem)continue;
  for(const t of [...trilhas])if(t.name.startsWith(origem.c.name+'.')){const clone=t.clone();clone.name=twin.name+t.name.slice(origem.c.name.length);trilhas.push(clone);}
 }
 wrap.traverse(o=>{o.userData=o.userData.textoRA?{textoRA:o.userData.textoRA}:{};});
 const clip=new T.AnimationClip('ciclo_didatico',duracao,trilhas);
 if(!trilhas.length)throw Error('Sem movimento: '+titulo);
 const buffer=await new GLTFExporter().parseAsync(wrap,{binary:true,trs:true,onlyVisible:false,animations:[clip]});
 return {base64:await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.readAsDataURL(new Blob([buffer]));}),trilhas:trilhas.length,bytes:buffer.byteLength,titulo,duracao,...(acabado?{texturas:acabado}:{})};
}


export async function compilarCelula(variant){
 const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
 const url=new URL('../celula/visualizador/celula-v3-'+variant+'.glb',import.meta.url).href;
 const g=await new GLTFLoader().loadAsync(url),wrap=new T.Group(),velhas=[];g.scene.traverse(o=>{if(['placa_celula_viva','placa_com_relevo'].includes(o.name))velhas.push(o);});velhas.forEach(o=>o.removeFromParent());wrap.add(g.scene);g.scene.updateMatrixWorld(true);
 const b=new T.Box3().setFromObject(g.scene),w=Math.min(.42,Math.max(.25,b.max.x-b.min.x));
 const p=placaVolume('Célula viva',{largura:w,altura:.055,espessura:.008});p.name='placa_celula_viva';p.position.set((b.min.x+b.max.x)/2,b.min.y+.04,b.max.z+.06);wrap.add(p);
 const buf=await new GLTFExporter().parseAsync(wrap,{binary:true,animations:g.animations,trs:true,onlyVisible:true});
 return await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.readAsDataURL(new Blob([buf]));});
}


export async function legendarGLB(buffer,titulo){
 const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
 const g=await new GLTFLoader().parseAsync(buffer,''),wrap=new T.Group();wrap.add(g.scene);
 const b=new T.Box3().setFromObject(g.scene),w=Math.max(.2,Math.min(.42,b.max.x-b.min.x));
 const p=placaVolume(titulo,{largura:w,altura:.035,espessura:.005});p.position.set((b.min.x+b.max.x)/2,b.min.y+.025,b.max.z+.035);wrap.add(p);
 const buf=await new GLTFExporter().parseAsync(wrap,{binary:true,animations:g.animations,trs:true,onlyVisible:true});
 return await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.readAsDataURL(new Blob([buf]));});
}

