import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { criar } from './modelos.js?v=starling-20261003b';
import { pressaoCapilar, pressaoLiquida, oncExterna, pontoDeVirada,
  balanco, avancar, comCausa, CAUSAS, cmH2O, estadoDoTecido } from './fisica.js?v=starling-20261003b';
const $ = id => document.getElementById(id), clamp=THREE.MathUtils.clamp;
const fmt=(v,n=1)=>v.toLocaleString('pt-BR',{minimumFractionDigits:n,maximumFractionDigits:n});
const pressure=(v,signed=false)=> (signed&&v>0?'+':'')+fmt(v)+' mmHg · '+(signed&&v>0?'+':'')+fmt(cmH2O(v))+' cmH₂O';
const stage=$('stage'), renderer=new THREE.WebGLRenderer({canvas:$('scene'),alpha:true,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8)); renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1;
const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,1500);
const pmrem=new THREE.PMREMGenerator(renderer), environment=pmrem.fromScene(new RoomEnvironment(),.04);
scene.environment=environment.texture; scene.environmentIntensity=.38; pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xdfefff,0x293342,1.5));
for(const [color,intensity,pos] of [[0xffece0,2.1,[10,45,50]],[0x9bd8ec,.9,[-40,8,-35]],[0xe8c1d0,.45,[40,-10,20]]]) {
 const light=new THREE.DirectionalLight(color,intensity); light.position.set(...pos); scene.add(light);
}
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.08;
const {modelos,animar,aplicarForcas}=criar(); modelos.forEach(m=>scene.add(m));
const TEXTOS=[
 ['Microcirculação','Uma rede dentro do tecido','Siga o sangue da arteríola aos capilares e à vênula. Os capilares formam caminhos interligados entre fibras e células do tecido conjuntivo. A água filtrada encontra o linfático, que começa em fundo cego. Capilares e vênulas pós-capilares participam das trocas.',['rede interligada','retorno pela linfa']],
 ['Corte longitudinal','A parede é uma estrutura viva','O corte revela hemácias bicôncavas, proteínas plasmáticas e a camada de glicocálix voltada para o sangue. Células endoteliais, membrana basal e prolongamentos de um pericito compõem a parede; fibras e fibroblastos ocupam o interstício.',['endotélio · pericito','glicocálix luminal']],
 ['Duas estações de leitura','O sentido depende da soma','Compare as contribuições em 22% e 78% do capilar. As setas laranja apontam para fora; as azuis, para dentro. Comprimentos representam o módulo das contribuições na mesma escala. Nos cards abaixo, mova a posição para conferir a soma em qualquer ponto.',['mesma escala de força','sinal e direção']],
 ['Viagem à barreira','O glicocálix modifica o gradiente','A ampliação expõe a camada de glicocálix sobre células endoteliais curvas. A água atravessa a barreira; proteínas são representadas predominantemente no plasma. No modo revisado, a oncótica externa relevante é a do subglicocálix, não a do interstício inteiro.',['barreira seletiva','πc − πsg']],
 ['Equilíbrio e acúmulo','O que entra precisa encontrar uma saída','O linfático de fundo cego recebe água do interstício por junções sobrepostas e a conduz adiante. Quando a drenagem não acompanha a entrada, aumenta o volume excedente: a matriz incha, fica mais azul e mais água permanece no tecido.',['filtração − absorção − linfa','pressão intersticial dinâmica']],
];
const ROTULOS=['A rede','O capilar','As forças','A barreira','Edema e linfa'];
let atual=0, causaAtual='normal', modelo='revisado', manual={}, volume=0, minutos=0, tempo=0, correndo=false;
let velocidade=1, posicao=.5, legends=true, history=[{t:0,v:0}], nextSample=.5;
let arUrl=null, prepId=0, arReadyId=0, arTimer=null, labelNodes=[];
function estado(){return {...comCausa(causaAtual,modelo).estado,...manual};}
function semLinfa(){return comCausa(causaAtual,modelo).semLinfa;}
function local(){return estadoDoTecido(estado(),volume);}
function anatomy(){
 const e=local(), edema=volume/(volume+18);
 animar(tempo,u=>pressaoLiquida(u,e),{encharcado:edema,semLinfa:semLinfa(),nivel:atual,sigma:e.sigma,oncPlasma:e.oncPlasma,kf:e.kf});
 aplicarForcas(atual,e,pressaoCapilar,oncExterna);
}
function enquadrar(){
 anatomy(); modelos[atual].updateWorldMatrix(true,true);
 const box=new THREE.Box3().setFromObject(modelos[atual]), center=box.getCenter(new THREE.Vector3());
 const halfV=THREE.MathUtils.degToRad(camera.fov/2), halfH=Math.atan(Math.tan(halfV)*camera.aspect);
 const dir=atual===3?new THREE.Vector3(.32,.68,1):new THREE.Vector3(.13,.28,1);
 dir.normalize();
 const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),dir).normalize();
 const up=new THREE.Vector3().crossVectors(dir,right).normalize();
 let required=0;
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
  const p=new THREE.Vector3(x,y,z).sub(center), depth=p.dot(dir);
  required=Math.max(required,Math.abs(p.dot(right))/Math.tan(halfH)+depth,Math.abs(p.dot(up))/Math.tan(halfV)+depth);
 }
 const d=required*1.18;
 camera.position.copy(center).add(dir.clone().multiplyScalar(d)); controls.target.copy(center);
 controls.minDistance=d*.28; controls.maxDistance=d*3; controls.update();
}
function labelSetup(){
 labelNodes.forEach(x=>x.remove()); labelNodes=[];
 for(const r of modelos[atual].userData.rotulos){
  const el=document.createElement('span'); el.className='label '+r.cor; el.textContent=r.nome; $('labels').append(el);
  labelNodes.push(el);
 }
}
function placeLabels(){
 const w=stage.clientWidth,h=stage.clientHeight, items=[];
 modelos[atual].userData.rotulos.forEach((r,i)=>{
  const p=new THREE.Vector3(...r.p).applyMatrix4(modelos[atual].matrixWorld).project(camera);
  const x=(p.x+1)*w/2,y=(1-p.y)*h/2; items.push({i,x,y,shown:p.z<1&&p.z>-1});
 });
 const lines=[];
 for(const side of [0,1]){
  const group=items.filter(x=>x.i%2===side).sort((a,b)=>a.y-b.y); let previous=42;
  for(const p of group){
   const el=labelNodes[p.i]; el.style.display=legends&&p.shown?'block':'none';
   const y=clamp(Math.max(p.y-12,previous+38),65,h-120); previous=y;
   const x=side?w-el.offsetWidth-12:12; el.style.left=x+'px'; el.style.top=y+'px';
   const lx=side?x:x+el.offsetWidth, ly=y+el.offsetHeight/2;
   if(legends&&p.shown) lines.push('<line x1="'+lx+'" y1="'+ly+'" x2="'+p.x+'" y2="'+p.y+'"/><circle cx="'+p.x+'" cy="'+p.y+'" r="2"/>');
  }
 }
 $('leaders').innerHTML=lines.join('');
}
function irAoNivel(n){
 atual=clamp(Math.floor(n),0,4); modelos.forEach((m,i)=>m.visible=i===atual);
 document.querySelectorAll('.step').forEach((b,i)=>{b.classList.toggle('active',i===atual);b.setAttribute('aria-current',i===atual?'step':'false');});
 const [eye,title,text,tags]=TEXTOS[atual];
 $('infoEyebrow').textContent=eye; $('infoTitle').textContent=title; $('infoText').textContent=text;
 $('microtags').replaceChildren(...tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
 $('stepLabel').textContent='0'+(atual+1)+' · '+ROTULOS[atual];
 $('sceneMessage').textContent=atual===3?'Plasma acima · interstício abaixo':atual===2?'Duas estações · laranja para fora · azul para dentro':'Microcirculação em tecido conjuntivo';
 labelSetup(); atualizar(); enquadrar(); prepararRA();
}
function atualizar(){
 const e=estado(), l=local(), b=balanco(e,{volume,semLinfa:semLinfa()});
 const c=comCausa(causaAtual,modelo), v=pontoDeVirada(l), rev=modelo==='revisado';
 $('estadoLabel').textContent=c.nome; $('causeNote').textContent=c.descricao;
 $('modelNote').textContent=rev?'πsg é definida neste exercício. A filtração basal retorna pela linfa. Absorção sustentada não é a regra na maioria dos tecidos.':'Comparação histórica com oncótica intersticial: os valores iniciais reproduzem +13/−7 mmHg. Não generalize a reabsorção venosa para todo tecido.';
 $('equacao').textContent=rev?'Jv = Kf [(Pc − Pi) − σ(πc − πsg)]':'Jv = Kf [(Pc − Pi) − σ(πc − πi)]';
 $('modelo').value=modelo;
 for(const [input,out,key] of [['pcA','oPcA','pcArterial'],['pcV','oPcV','pcVenular'],['piBase','oPi','pi'],['oncCursor','lOnc','oncPlasma']]){
  $(input).value=e[key]; $(out).textContent=fmt(e[key])+' mmHg / '+fmt(cmH2O(e[key]))+' cmH₂O';
 }
 $('oncExternal').value=oncExterna(e); $('oExt').textContent=pressure(oncExterna(e));
 $('externalLabel').textContent=rev?'πsg · oncótica subglicocálix':'πi · oncótica intersticial';
 $('sigma').value=e.sigma; $('oSigma').textContent=fmt(e.sigma,2)+' (sem unidade)';
 $('kf').value=e.kf; $('oKf').textContent=fmt(e.kf,3)+' mL/min/mmHg';
 $('lEdema').textContent=fmt(volume,2); $('lMinutos').textContent=fmt(minutos);
 $('barraEdema').style.width=(volume/(volume+18)*100)+'%';
 $('lFiltrado').textContent=fmt(b.filtrado,3); $('lAbsorcao').textContent=fmt(b.reabsorvido,3);
 $('lLinfa').textContent=semLinfa()?'0,000 · obstruída':fmt(b.linfa,3);
 $('lAcumula').textContent=(b.acumula>0?'+':'')+fmt(b.acumula,3);
 $('balanceStatus').textContent=b.acumula>.0005?'Acumulando':b.acumula<-.0005?'Diminuindo':'Equilíbrio';
 const vals=[pressaoCapilar(posicao,l),-l.pi,-l.sigma*l.oncPlasma,l.sigma*oncExterna(l)];
 const outs=['fPc','fPi','fOnc','fExt'],dirs=['dirPc','dirPi','dirOnc','dirExt'],cards=['cardPc','cardPi','cardOnc','cardExt'];
 vals.forEach((x,i)=>{ $(outs[i]).textContent=pressure(x,true);$(dirs[i]).textContent=Math.abs(x)<.0001?'Sem contribuição':x>0?'→ para fora':'← para dentro';$(cards[i]).classList.toggle('inward',x<0); });
 const sum=pressaoLiquida(posicao,l);
 $('fSoma').textContent=pressure(sum,true); $('nameExt').textContent=rev?'+σπsg · oncótica subglicocálix':'+σπi · oncótica intersticial';
 $('flowDirection').textContent=Math.abs(sum)<.0001?'Sem força líquida neste ponto':sum>0?'Filtração: sangue → tecido':rev?'Tendência de absorção; não implica absorção sustentada':'Absorção no modelo clássico: tecido → sangue';
 $('pointLabel').textContent=fmt(posicao*100,0)+'% do capilar';
 $('lArterial').textContent=pressure(pressaoLiquida(0,l),true); $('lVenular').textContent=pressure(pressaoLiquida(1,l),true);
 $('lVirada').textContent=v===null?'Sem cruzamento':fmt(v*100,0)+'%';
 $('curveNote').textContent=rev?'πsg permanece especificada, sem adaptação de proteínas. Valores negativos são uma tendência sob as pressões fixadas, não uma previsão de equilíbrio estacionário.':'Esta comparação mostra a equação clássica. O sinal não substitui a descrição atual da barreira e do retorno linfático.';
 anatomy(); drawGraphs();
}
function chartCanvas(id){
 const el=$(id), w=Math.max(240,el.clientWidth), h=el.clientHeight||220, dpr=Math.min(devicePixelRatio,2);
 if(el.width!==Math.round(w*dpr)||el.height!==Math.round(h*dpr)){el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);}
 const ctx=el.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 ctx.font='10px Inter, sans-serif'; return {ctx,w,h};
}
function axes(ctx,w,h,lo,hi,unit,xmax=1,time=false){
 const x=u=>48+u*(w-64), y=p=>25+(hi-p)/(hi-lo)*(h-62);
 ctx.lineWidth=1;ctx.font='10px Inter, sans-serif';
 for(let i=0;i<=4;i++){
  const p=lo+(hi-lo)*i/4;
  ctx.strokeStyle='#44607066';ctx.beginPath();ctx.moveTo(48,y(p));ctx.lineTo(w-16,y(p));ctx.stroke();
  ctx.fillStyle='#9eb6c8';ctx.fillText(fmt(p,Math.abs(hi-lo)<4?1:0),3,y(p)+3);
 }
 ctx.fillStyle='#b7cfdd';ctx.fillText(unit,3,12);
 const ticks=time?[0,xmax/2,xmax]:[0,.5,1];
 ticks.forEach(u=>{const px=x(time?u/xmax:u);ctx.textAlign=u===0?'left':u===xmax||u===1?'right':'center';ctx.fillText(time?fmt(u,0)+' min':u===0?'Arteriolar':u===1?'Venular':'50%',px,h-12);});ctx.textAlign='left';
 return {x,y};
}
function drawGraphs(){
 const a=chartCanvas('curvaSoma'), e=local(), mult=$('graphUnit').value==='mmHg'?1:1.35951;
 const p0=pressaoLiquida(0,e)*mult,p1=pressaoLiquida(1,e)*mult;
 const lo=Math.floor(Math.min(-2,p0,p1)/5)*5, hi=Math.ceil(Math.max(5,p0,p1)/5)*5;
 const {x,y}=axes(a.ctx,a.w,a.h,lo,hi,$('graphUnit').value==='mmHg'?'mmHg':'cmH₂O');
 for(const [sign,color] of [[1,'#f4ac6836'],[-1,'#76b9ee36']]){
  a.ctx.beginPath();a.ctx.moveTo(x(0),y(0));
  for(let i=0;i<=100;i++){const u=i/100,p=pressaoLiquida(u,e)*mult;a.ctx.lineTo(x(u),y(sign>0?Math.max(0,p):Math.min(0,p)));}
  a.ctx.lineTo(x(1),y(0));a.ctx.closePath();a.ctx.fillStyle=color;a.ctx.fill();
 }
 a.ctx.strokeStyle='#a5bfce';a.ctx.setLineDash([4,4]);a.ctx.beginPath();a.ctx.moveTo(x(0),y(0));a.ctx.lineTo(x(1),y(0));a.ctx.stroke();a.ctx.setLineDash([]);
 a.ctx.strokeStyle='#e8f4fb';a.ctx.lineWidth=2.3;a.ctx.beginPath();a.ctx.moveTo(x(0),y(p0));a.ctx.lineTo(x(1),y(p1));a.ctx.stroke();
 a.ctx.beginPath();a.ctx.arc(x(posicao),y(pressaoLiquida(posicao,e)*mult),4,0,Math.PI*2);a.ctx.fillStyle='#71d7ce';a.ctx.fill();
 const b=chartCanvas('curvaVolume'), xmax=Math.max(10,Math.ceil(minutos/10)*10), ymax=Math.max(1,Math.ceil(Math.max(volume,...history.map(p=>p.v))));
 const coords=axes(b.ctx,b.w,b.h,0,ymax,'mL',xmax,true);
 b.ctx.strokeStyle='#76b9ee';b.ctx.lineWidth=2.3;b.ctx.beginPath();
 [...history,{t:minutos,v:volume}].forEach((p,i)=>i?b.ctx.lineTo(coords.x(p.t/xmax),coords.y(p.v)):b.ctx.moveTo(coords.x(p.t/xmax),coords.y(p.v)));
 b.ctx.stroke();
}
function resetTime(){
 volume=0;minutos=0;tempo=0;history=[{t:0,v:0}];nextSample=.5;setRunning(false);atualizar();enquadrar();prepararRA();
}
function setRunning(value){
 correndo=value;$('correr').textContent=value?'Pausar':'Iniciar';$('correr').setAttribute('aria-pressed',String(value));
 if(value){++prepId;clearTimeout(arTimer);$('launchAR').disabled=true;$('raStatus').textContent='Pause para preparar o estado atual em RA.';}
 else prepararRA();
}
$('causas').innerHTML=CAUSAS.map(c=>'<button data-causa="'+c.id+'">'+c.nome+'</button>').join('');
function markCause(){document.querySelectorAll('[data-causa]').forEach(b=>{const active=b.dataset.causa===causaAtual;b.classList.toggle('on',active);b.setAttribute('aria-pressed',String(active));});}
$('causas').addEventListener('click',ev=>{const b=ev.target.closest('[data-causa]');if(!b)return;causaAtual=b.dataset.causa;manual={};markCause();resetTime();});
$('modelo').onchange=()=>{modelo=$('modelo').value;manual={};resetTime();};
for(const [id,key] of [['pcA','pcArterial'],['pcV','pcVenular'],['piBase','pi'],['oncCursor','oncPlasma'],['sigma','sigma'],['kf','kf']]){
 $(id).oninput=()=>{
  manual[key]=Number($(id).value);
  const e=estado();
  if(key==='pcArterial'&&e.pcVenular>e.pcArterial)manual.pcVenular=e.pcArterial;
  if(key==='pcVenular'&&e.pcVenular>e.pcArterial)manual.pcArterial=e.pcVenular;
  atualizar();prepararRA();
 };
}
$('oncExternal').oninput=()=>{manual[modelo==='classico'?'oncInter':'oncSub']=Number($('oncExternal').value);atualizar();prepararRA();};
$('reporOnc').onclick=()=>{manual={};atualizar();prepararRA();};
$('correr').onclick=()=>setRunning(!correndo);$('zerar').onclick=resetTime;
$('velocidade').oninput=()=>{velocidade=Number($('velocidade').value);$('lVelocidade').textContent=fmt(velocidade,velocidade%1?2:0)+'×';};
$('posicao').oninput=()=>{posicao=Number($('posicao').value)/100;atualizar();};
$('graphUnit').onchange=drawGraphs;
$('resetView').onclick=enquadrar;
$('toggleLabels').onclick=()=>{legends=!legends;$('toggleLabels').setAttribute('aria-pressed',String(legends));};
document.querySelectorAll('.step').forEach(b=>b.onclick=()=>irAoNivel(Number(b.dataset.step)));
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{$('fullscreen').textContent='Ampliar indisponível';}};
$('exitFullscreen').onclick=()=>document.exitFullscreen();
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Reduzir':'Ampliar';ajustar();});
function ajustar(){
 const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();enquadrar();drawGraphs();
}
new ResizeObserver(ajustar).observe(stage);addEventListener('resize',drawGraphs);
function prepararRA(){
 const id=++prepId;clearTimeout(arTimer);if(correndo)return;
 $('launchAR').disabled=true;$('raStatus').textContent='Preparando o estado atual…';
 arTimer=setTimeout(async()=>{
  try{
   anatomy();const clone=modelos[atual].clone(true);clone.visible=true;
   const box=new THREE.Box3().setFromObject(clone),size=box.getSize(new THREE.Vector3());
   clone.scale.setScalar(.65/Math.max(size.x,size.y,size.z));clone.updateMatrixWorld(true);
   const b=new THREE.Box3().setFromObject(clone),center=b.getCenter(new THREE.Vector3());
   clone.position.set(-center.x,-b.min.y,-center.z);prepararParaRA(clone);
   const wrap=new THREE.Group();wrap.add(clone);
   const buffer=await new GLTFExporter().parseAsync(wrap,{binary:true,onlyVisible:true});
   if(id!==prepId||correndo)return;
   if(arUrl)URL.revokeObjectURL(arUrl);arUrl=URL.createObjectURL(new Blob([buffer],{type:'model/gltf-binary'}));
   arReadyId=id;$('arViewer').src=arUrl;
  }catch(err){if(id!==prepId)return;console.error(err);$('raStatus').textContent='Não foi possível preparar a RA. O modelo 3D continua disponível.';}
 },300);
}
$('arViewer').addEventListener('load',()=>{
 if(correndo||arReadyId!==prepId)return;
 $('launchAR').disabled=!$('arViewer').canActivateAR;
 $('raStatus').textContent=$('arViewer').canActivateAR?'Estado pronto. Abra em RA no aparelho compatível. Ampliação de aproximadamente 65 cm.':'Modelo 3D pronto. Para RA, use Safari no iPhone/iPad ou Chrome no Android compatível.';
});
$('arViewer').addEventListener('error',()=>{$('launchAR').disabled=true;$('raStatus').textContent='Não foi possível abrir o modelo em RA.';});
$('launchAR').onclick=async()=>{try{await $('arViewer').activateAR();}catch{$('raStatus').textContent='A câmera não abriu. Confira a compatibilidade e a permissão no navegador.';}};
addEventListener('pagehide',()=>{++prepId;clearTimeout(arTimer);if(arUrl)URL.revokeObjectURL(arUrl);});
const busca=new URLSearchParams(location.search);
if(busca.get('modelo')==='classico')modelo='classico';
const causa=busca.get('causa');if(CAUSAS.some(c=>c.id===causa))causaAtual=causa;
const onc=Number.parseFloat(busca.get('onc'));if(Number.isFinite(onc))manual.oncPlasma=clamp(onc,4,34);
const min=Number.parseFloat(busca.get('min'));
if(Number.isFinite(min)){
 const target=clamp(min,0,1440);for(let t=0;t<target;){const dt=Math.min(.5,target-t);volume=avancar(volume,dt,estado(),{semLinfa:semLinfa()});t+=dt;history.push({t,v:volume});}minutos=target;nextSample=Math.floor(target*2)/2+.5;
}
markCause();ajustar();const nivel=Number.parseInt(busca.get('nivel'),10);irAoNivel(Number.isFinite(nivel)?nivel-1:0);
let anterior=performance.now(), uiTick=0;
renderer.setAnimationLoop(t=>{
 const dt=document.hidden?0:Math.min(.1,Math.max(0,(t-anterior)/1000));anterior=t;
 if(correndo){
  const dm=Math.min(dt*2*velocidade,1440-minutos);
  volume=avancar(volume,dm,estado(),{semLinfa:semLinfa()});minutos+=dm;tempo+=dt*velocidade;
  if(minutos>=nextSample){history.push({t:minutos,v:volume});nextSample=minutos+.5;}
  anatomy();uiTick+=dt;if(uiTick>.12){atualizar();uiTick=0;}
  if(minutos>=1440)setRunning(false);
 }
 controls.update();placeLabels();renderer.render(scene,camera);
});
