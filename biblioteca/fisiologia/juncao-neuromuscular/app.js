import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {prepararParaRA} from '../cores-para-ra.js';
import {novaMitocondria} from '../mitocondria.js';
import {criar,NIVEIS} from './modelos.js?v=jun-mito-20261009';
import {simular,noInstante,fase,CORES,LIMIAR} from './fisica.js?v=jun-20261003';
import {avancarInstante} from './reproducao.js?v=jun-realismo-20261003';
import {estadoVisual,comprimentoVisual,faseContracao} from './animacao.js?v=jun-encaixe-20261004';
const $=id=>document.getElementById(id),fmt=(v,n=1)=>v.toLocaleString('pt-BR',{minimumFractionDigits:n,maximumFractionDigits:n});
const stage=$('stage'),renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.01,100);
const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(new RoomEnvironment(),.04);scene.environment=environment.texture;scene.environmentIntensity=.65;pmrem.dispose();
const hemisphere=new THREE.HemisphereLight(0xe4f6ff,0x263044,1.6);scene.add(hemisphere);
const lights=[];
for(const [color,intensity,pos]of [[0xffe9d8,2.9,[4,6,5]],[0x8cc6df,1.5,[-4,2,4]],[0xabc6d7,1.7,[0,3,-5]]]){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);lights.push(l);}
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=.6;controls.maxDistance=22;
function canvasFactory(w,h,draw,{repeatX=1,repeatY=1}={}){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(repeatX,repeatY);return tex;}
function textura(tipo){return canvasFactory(512,512,(ctx,w,h)=>{
 const image=ctx.createImageData(w,h);let seed=72917;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=(seed/4294967296-.5)*24;const bands=tipo==='estrias'?23*Math.sin(y*.27)+9*Math.cos(y*.54)+12*Math.cos(x*.12):24*Math.sin(x*.027+y*.018)*Math.cos(y*.043)+7*Math.sin(x*.19-y*.12);const c=Math.max(0,Math.min(255,199+n+bands)),i=(y*w+x)*4;image.data[i]=c;image.data[i+1]=c;image.data[i+2]=c;image.data[i+3]=255;}ctx.putImageData(image,0,0);
 });}
const anatomy=criar(textura);anatomy.modelos.forEach((m,i)=>{m.visible=i===0;scene.add(m);});
/* MITOCÔNDRIAS NOVAS NO TERMINAL: cada lugar marcado em modelos.js (meia
   elipsoide 2 × 0,94 × 0,90, aberta para +z) recebe a mitocôndria compartilhada
   aberta, nas mesmas medidas; a antiga fica até o GLB chegar. */
(async()=>{const lugares=[];anatomy.modelos.forEach(m=>m.traverse(o=>{if(o.userData.mitocondria)lugares.push(o);}));
 try{const novas=await Promise.all(lugares.map(()=>novaMitocondria('aberta',new THREE.Vector3(2,.94,.90))));
  lugares.forEach((o,k)=>{for(const c of [...o.children])o.remove(c);o.add(novas[k]);});
  if(lugares.length&&typeof prepararRA==='function')prepararRA();
 }catch(e){console.error('mitocôndria nova não carregou; ficam as antigas',e);}})();
const bounds=anatomy.modelos.map((m,i)=>i===4?null:new THREE.Box3().setFromObject(m));
let uiElapsed=0;
let nivel=0,sim=simular(),instante=0,running=false,speed=Number($('speed').value),labels=$('toggleLabels').checked,frame=0,exportId=0,readyId=-1,arUrl=null,arTimer=null,selectionId=0,disposed=false;
let labelNodes=[];
function enquadrar(){
 const box=bounds[nivel]??(bounds[nivel]=new THREE.Box3().setFromObject(anatomy.modelos[nivel])),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const radius=Math.max(size.length()/2,.8),fov=camera.fov*Math.PI/180,lim=Math.min(fov,2*Math.atan(Math.tan(fov/2)*camera.aspect));
 const direction=new THREE.Vector3(.2,nivel===2||nivel===3?.65:.25,1).normalize();
 let dist=radius/Math.sin(lim/2)*1.12;
 if(nivel<4){const right=new THREE.Vector3().crossVectors(camera.up,direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right),tan=Math.tan(fov/2);dist=0;
  for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).sub(center),depth=p.dot(direction);dist=Math.max(dist,Math.abs(p.dot(right))/(tan*camera.aspect)+depth,Math.abs(p.dot(up))/tan+depth);}dist=Math.max(2,dist*1.15);
 }
 controls.target.copy(center);camera.position.copy(center).add(direction.multiplyScalar(dist));camera.near=Math.max(.01,dist/1000);camera.far=Math.max(100,dist*5);camera.updateProjectionMatrix();controls.update();
}
function criarLegendas(){
 $('labels').replaceChildren();labelNodes=anatomy.modelos[nivel].userData.labels.map(l=>{const el=document.createElement('span');el.textContent=l.text;if(l.text.includes('Ca²⁺'))el.style.borderLeftColor=CORES.ca;$('labels').append(el);return {...l,el};});
}
function posicionarLegendas(){
 const w=stage.clientWidth,h=stage.clientHeight,placed=[];
 for(const l of labelNodes){const world=anatomy.modelos[nivel].localToWorld(l.pos.clone()),p=world.project(camera);l.el.hidden=!labels||p.z>1||p.z<-1;if(l.el.hidden)continue;
  const x=(p.x*.5+.5)*w,y=(-p.y*.5+.5)*h,ew=l.el.offsetWidth,eh=l.el.offsetHeight,left=Math.min(w-ew-8,Math.max(8,x+12));let top=Math.min(h-eh-36,Math.max(52,y-10));
  for(let n=0;n<placed.length;n++){const collision=placed.find(r=>left<r.x+r.w+4&&left+ew>r.x-4&&top<r.y+r.h+4&&top+eh>r.y-4);if(!collision)break;top=Math.min(h-eh-36,collision.y+collision.h+5);}
  l.el.style.left=left+'px';l.el.style.top=top+'px';placed.push({x:left,y:top,w:ew,h:eh});
 }
}
function definirRunning(value){
 running=value;$('play').textContent=value?'Pausar':'Iniciar';$('play').setAttribute('aria-pressed',String(value));
 if(value){++exportId;clearTimeout(arTimer);$('launchAR').disabled=true;$('raStatus').textContent='Pause para preparar o estado atual em RA.';}else prepararRA();
}
function atualizar(leituras=true){
 const a=noInstante(sim,instante);anatomy.atualizar(nivel,a,instante,sim);$('phaseLabel').textContent=nivel===4?faseContracao(sim,instante):fase(sim,instante);if(!leituras)return;$('instant').value=instante;$('instantValue').textContent=fmt(instante)+' ms';
 $('eppValue').textContent=fmt(a.epp)+' mV';$('vmValue').textContent=fmt(a.vm)+' mV';$('caValue').textContent=fmt(a.ca,2);$('activationValue').textContent=fmt(a.ativacao*100,0)+'%';
 $('shortening').hidden=nivel<3;const length=comprimentoVisual(estadoVisual(sim,instante).ativacao);$('shortening').textContent=nivel===3?'Encurtamento ilustrativo das miofibrilas: '+fmt((1-length/2.4)*100,0)+'%.':'Comprimento do sarcômero: '+fmt(length,2)+' µm · banda A: 1,60 µm (fixa).';
 const seen=sim.disparos.filter(t=>t<=instante).length,stim=sim.estimulos.filter(t=>t<=instante).length;
 $('transmission').textContent=stim===0?'Antes do estímulo.':seen+' potencial(is) de ação muscular para '+stim+' impulso(s) recebido(s).';
 $('safety').textContent='Pico de placa: '+fmt(sim.picoEpp)+' mV · fator de segurança ilustrativo: '+fmt(sim.fatorSeguranca,2)+' (pico da despolarização ÷ 25 mV).';
 drawGraphs();
}
function novaObservacao(){
 definirRunning(false);instante=0;sim=simular({modo:$('mode').value,frequencia:Number($('frequency').value),liberacao:Number($('release').value)/100,receptores:Number($('receptors').value)/100});
 $('instant').max=sim.duracao;$('frequency').disabled=sim.p.modo==='unico';$('frequencyValue').textContent=sim.p.frequencia+' Hz';$('releaseValue').textContent=fmt(sim.p.liberacao*100,0)+'%';$('receptorsValue').textContent=fmt(sim.p.receptores*100,0)+'%';
 $('controlNote').textContent=sim.p.modo==='unico'?'No modo Um impulso, a frequência não altera o estímulo único.':'A sequência termina antes de 400 ms; depois observe a recuperação. A frequência muda o intervalo entre impulsos da mesma fibra, sem recrutamento.';
 atualizar();prepararRA();
}
async function selecionar(i){
 const ticket=++selectionId;definirRunning(false);++exportId;clearTimeout(arTimer);nivel=Math.max(0,Math.min(4,i));
 // O sarcômero mantém a iluminação original; os cortes recebem luz menos intensa.
 hemisphere.intensity=nivel===4?1.6:.85;scene.environmentIntensity=nivel===4?.65:.42;
 lights.forEach((l,j)=>l.intensity=(nivel===4?[2.9,1.5,1.7]:[1.7,.75,1.25])[j]);
 const d=NIVEIS[nivel];$('stepLabel').textContent=String(nivel+1).padStart(2,'0')+' · '+d.nome;$('infoTitle').textContent=d.titulo;$('infoText').textContent=d.texto;$('infoEyebrow').textContent='Nível '+(nivel+1)+' · escala ampliada';$('raPiece').textContent=$('stepLabel').textContent;
 document.querySelectorAll('[data-step],[data-ra-step]').forEach(b=>{const active=Number(b.dataset.step??b.dataset.raStep)===nivel;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 anatomy.modelos.forEach((m,j)=>m.visible=j===nivel);
 if(nivel===4){$('raStatus').textContent='Preparando o sarcômero aprovado…';try{await anatomy.prepararSarcomero(canvasFactory);}catch(e){console.error(e);$('raStatus').textContent='Não foi possível carregar o sarcômero. Os outros níveis continuam disponíveis.';return;}}
 if(ticket!==selectionId||disposed)return;if(nivel===4&&!bounds[4])bounds[4]=new THREE.Box3().setFromObject(anatomy.modelos[4]);atualizar();enquadrar();criarLegendas();prepararRA();
}
function chart(id){const el=$(id),w=Math.max(230,el.clientWidth),h=240,dpr=Math.min(devicePixelRatio,2);if(el.width!==Math.round(w*dpr)||el.height!==h*dpr){el.width=Math.round(w*dpr);el.height=h*dpr;}const c=el.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);return {c,w,h};}
function drawGraphs(){
 if($('panel-graphs').hidden)return;
 for(const electrical of [true,false]){
  const {c,w,h}=chart(electrical?'electrical':'mechanical'),left=electrical?42:38,right=electrical?14:43;
  const x=t=>left+t/sim.duracao*(w-left-right),y=(v,lo,hi)=>24+(hi-v)/(hi-lo)*(h-55);
  const caMax=Math.max(1,Math.ceil(sim.picoCa*2)/2),hi=electrical?40:1,lo=electrical?-100:0;
  c.font='10px Inter,Arial';c.lineWidth=1;c.strokeStyle='#345365';c.fillStyle='#a6bdcf';
  for(let k=0;k<=4;k++){const value=lo+(hi-lo)*k/4,py=y(value,lo,hi);c.beginPath();c.moveTo(left,py);c.lineTo(w-right,py);c.stroke();c.fillText(fmt(value,electrical?0:2),3,py+3);if(!electrical){c.fillStyle=CORES.ca;c.fillText(fmt(caMax*k/4,1),w-right+5,py+3);c.fillStyle='#a6bdcf';}}
  c.fillText(electrical?'mV':'Ativação',3,13);if(!electrical){c.fillStyle=CORES.ca;c.textAlign='right';c.fillText('Ca²⁺ relativo',w-5,13);c.textAlign='left';}
  for(const t of [0,sim.duracao/2,sim.duracao]){c.textAlign=t===0?'left':t===sim.duracao?'right':'center';c.fillStyle='#a6bdcf';c.fillText(fmt(t,0)+' ms',x(t),h-10);}c.textAlign='left';
  if(electrical){c.setLineDash([4,4]);c.strokeStyle='#e8bd6b88';c.beginPath();c.moveTo(left,y(LIMIAR,lo,hi));c.lineTo(w-right,y(LIMIAR,lo,hi));c.stroke();c.setLineDash([]);}
  for(const [key,color,max]of electrical?[['epp',CORES.epp,hi],['vm',CORES.vm,hi]]:[['ativacao',CORES.ativacao,1],['ca',CORES.ca,caMax]]){
   c.strokeStyle=color;c.lineWidth=electrical&&key==='vm'?1.7:2;c.beginPath();
   // Todas as amostras mantêm os potenciais de ação de poucos ms visíveis.
   for(let i=0;i<sim.amostras.length;i++){const a=sim.amostras[i],px=x(a.t),py=y(a[key],electrical?lo:0,max);i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
  }
  c.lineWidth=1.2;c.strokeStyle='#f5e3b8';c.beginPath();c.moveTo(x(instante),19);c.lineTo(x(instante),h-30);c.stroke();
 }
}
document.addEventListener('studychange',()=>{drawGraphs();if(!$('panel-ra').hidden)prepararRA();});
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();enquadrar();drawGraphs();}}
new ResizeObserver(resize).observe(stage);
function clonarPeca(source){
 // Só a anatomia e suas transformações vão ao GLB. As listas de animação têm
 // referências às malhas e não devem duplicar geometrias/texturas nos extras.
 const clone=source.isMesh?new THREE.Mesh(source.geometry,source.material):new THREE.Group();
 clone.position.copy(source.position);clone.quaternion.copy(source.quaternion);clone.scale.copy(source.scale);clone.visible=source.visible;clone.name=source.name;clone.renderOrder=source.renderOrder;
 for(const child of source.children)clone.add(clonarPeca(child));return clone;
}
function prepararRA(){
 const id=++exportId;clearTimeout(arTimer);$('launchAR').disabled=true;
 if(running||$('panel-ra').hidden)return;$('raStatus').textContent='Preparando o estado atual…';
 arTimer=setTimeout(async()=>{try{
  anatomy.atualizar(nivel,noInstante(sim,instante),instante,sim);const clone=clonarPeca(anatomy.modelos[nivel]);clone.visible=true;
  const box=new THREE.Box3().setFromObject(clone),size=box.getSize(new THREE.Vector3());clone.scale.setScalar(.65/Math.max(size.x,size.y,size.z));clone.updateMatrixWorld(true);
  const fitted=new THREE.Box3().setFromObject(clone),center=fitted.getCenter(new THREE.Vector3());clone.position.set(-center.x,-fitted.min.y,-center.z);prepararParaRA(clone);
  const wrap=new THREE.Group();wrap.add(clone);const buffer=await new GLTFExporter().parseAsync(wrap,{binary:true,onlyVisible:true});
  if(id!==exportId||running||disposed)return;if(arUrl)URL.revokeObjectURL(arUrl);arUrl=URL.createObjectURL(new Blob([buffer],{type:'model/gltf-binary'}));readyId=id;$('arViewer').alt='Peça selecionada: '+NIVEIS[nivel].nome;$('arViewer').src=arUrl;
 }catch(e){if(id!==exportId)return;console.error(e);$('raStatus').textContent='Não foi possível preparar a RA. A experiência 3D continua disponível.';}},250);
}
$('arViewer').addEventListener('load',()=>{if(readyId!==exportId||running)return;$('launchAR').disabled=!$('arViewer').canActivateAR;$('launchAR').textContent='Abrir '+NIVEIS[nivel].nome+' em RA';$('raStatus').textContent=$('arViewer').canActivateAR?'Estado pronto para RA · ampliação de aproximadamente 65 cm.':'Modelo 3D pronto. Para RA, use Safari no iPhone/iPad ou Chrome no Android compatível.';});
$('arViewer').addEventListener('error',()=>{$('launchAR').disabled=true;$('raStatus').textContent='A prévia de RA não carregou. O modelo 3D continua disponível.';});
$('launchAR').onclick=()=>{$('arViewer').activateAR().catch(()=>{$('raStatus').textContent='A câmera não abriu. Confira a compatibilidade e a permissão no aparelho.';});};
$('play').onclick=()=>{if(!running&&instante>=sim.duracao)instante=0;definirRunning(!running);atualizar();};$('reset').onclick=()=>{definirRunning(false);instante=0;atualizar();prepararRA();};
$('instant').oninput=()=>{definirRunning(false);instante=Number($('instant').value);atualizar();prepararRA();};
$('speed').oninput=()=>{speed=Number($('speed').value);$('speedValue').textContent=fmt(speed,speed%1?2:0)+'×';};
for(const id of ['mode','frequency','release','receptors'])$(id).addEventListener(id==='mode'?'change':'input',()=>{document.querySelectorAll('[data-case]').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-pressed','false');});novaObservacao();});
const casos={abalo:['unico',15,100,100],somacao:['trem',15,100,100],tetano:['trem',50,100,100],liberacao:['unico',15,35,100],receptores:['unico',15,100,40]};
$('quick').onclick=e=>{const b=e.target.closest('[data-case]');if(!b)return;const [mode,freq,release,receptors]=casos[b.dataset.case];$('mode').value=mode;$('frequency').value=freq;$('release').value=release;$('receptors').value=receptors;document.querySelectorAll('[data-case]').forEach(el=>{el.classList.toggle('on',el===b);el.setAttribute('aria-pressed',String(el===b));});novaObservacao();};
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>selecionar(Number(b.dataset.step)));
$('raChoices').innerHTML=NIVEIS.map((d,i)=>'<button class="button" data-ra-step="'+i+'">'+String(i+1).padStart(2,'0')+' · '+d.nome+'</button>').join('');
document.querySelectorAll('[data-ra-step]').forEach(b=>b.onclick=()=>selecionar(Number(b.dataset.raStep)));
$('resetView').onclick=enquadrar;$('toggleLabels').onchange=()=>{labels=$('toggleLabels').checked;posicionarLegendas();};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{$('fullscreen').textContent='Ampliar indisponível';}};
$('exitFullscreen').onclick=()=>document.exitFullscreen();document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Reduzir':'Ampliar';resize();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)definirRunning(false);});
addEventListener('pagehide',()=>{disposed=true;++exportId;clearTimeout(arTimer);renderer.setAnimationLoop(null);if(arUrl)URL.revokeObjectURL(arUrl);controls.dispose();renderer.dispose();environment.dispose();});
const query=new URLSearchParams(location.search),initial=Number.parseInt(query.get('nivel'),10);novaObservacao();resize();selecionar(Number.isFinite(initial)?initial-1:0);
renderer.setAnimationLoop(t=>{const dt=Math.min(.06,Math.max(0,(t-frame)/1000));frame=t;if(running&&!document.hidden){const next=avancarInstante(instante,dt*40*speed,sim.duracao,$('loop').checked);instante=next.instante;uiElapsed+=dt;const ui=uiElapsed>=.05||next.terminou;atualizar(ui);if(ui)uiElapsed=0;if(next.terminou)definirRunning(false);}controls.update();posicionarLegendas();renderer.render(scene,camera);});
