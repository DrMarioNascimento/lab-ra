import * as THREE from 'three';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

import {criar} from './modelos.js?v=corpo-20261004';

import {criarEstado,avancar,quadro,equilibrio,CORES} from './fisica.js?v=corpo-20261004';

const $=id=>document.getElementById(id),fmt=(n,d=1)=>n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});

const stage=$('stage'),renderer=new THREE.WebGLRenderer({canvas:$('scene'),alpha:true,antialias:true,powerPreference:'high-performance'});

renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local');

const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.01,100),controls=new OrbitControls(camera,renderer.domElement);

controls.enableDamping=true;controls.minDistance=.4;controls.maxDistance=12;

const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromScene(new RoomEnvironment(),.04);scene.environment=env.texture;scene.environmentIntensity=.6;pmrem.dispose();scene.add(new THREE.HemisphereLight(0xe3f5ff,0x28333e,.95));

for(const [c,n,p]of [[0xffdfd4,2,[4,6,5]],[0x7ac3dc,.9,[-4,3,4]],[0xb0cfdd,1,[0,3,-4]]]){const l=new THREE.DirectionalLight(c,n);l.position.set(...p);scene.add(l);}

const descriptions=[['Um organismo, diferentes ritmos','O pulmão ventila, o coração impulsiona o sangue e o músculo utiliza oxigênio. O esforço modifica cada função sem fazer uma respiração corresponder a um batimento.','Organismo · escala anatômica'],['Do ar ao sangue','A inspiração amplia os alvéolos. O oxigênio atravessa a barreira alveolocapilar e é transportado principalmente pela hemoglobina. O sangue chega menos oxigenado e sai mais oxigenado.','Alvéolos · ampliação didática'],['Dois circuitos, um coração','A circulação pulmonar leva sangue para as trocas nos pulmões. A sistêmica distribui o oxigênio aos tecidos e retorna ao coração. Débito = frequência cardíaca × volume sistólico.','Coração e vasos · aproximação'],['Do capilar à fibra muscular','A extração cresce com a demanda. O oxigênio deixa o sangue e difunde até as mitocôndrias. O encurtamento mostrado é ilustrativo; o consumo não é calculado a partir dessa deformação.','Capilar e fibra · ampliação didática'],['Oxigênio para sustentar o trabalho','O corte expõe as cristas mitocondriais. O oxigênio é o aceptor final de elétrons na fosforilação oxidativa; ATP abastece o trabalho celular. As partículas não medem moléculas nem ATP produzido.','Mitocôndria · corte ampliado']];

let anatomy=null,state=criarEstado(),running=false,speed=1,nivel=0,last=0,ui=0,loopTime=0,labels=true,labelNodes=[],xr=null,xrRef=null,hitSource=null,placed=false,previousView=0,disposed=false;

const reticle=new THREE.Mesh(new THREE.RingGeometry(.10,.13,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:'#71d7ce',side:THREE.DoubleSide}));reticle.matrixAutoUpdate=false;reticle.visible=false;scene.add(reticle);

const controller=renderer.xr.getController(0);scene.add(controller);controller.addEventListener('select',()=>{if(!xr||!reticle.visible)return;anatomy.root.position.setFromMatrixPosition(reticle.matrix);anatomy.root.scale.setScalar(.45);anatomy.root.visible=true;placed=true;$('xrHint').textContent='Corpo posicionado · compare repouso e exercício.';});

const xrLabels=new THREE.Group();
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let pointerStart=null;
renderer.domElement.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener('pointerup',e=>{if(!pointerStart||!anatomy||xr)return;const start=pointerStart;pointerStart=null;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const candidates=anatomy.hotspots.filter(h=>h.from===nivel),hits=raycaster.intersectObjects(candidates.map(h=>h.object),true);if(!hits.length)return;let target=hits[0].object;while(target){const found=candidates.find(h=>h.object===target);if(found){selectView(found.view);break;}target=target.parent;}});
function buildLabels(){

 $('labels').replaceChildren();labelNodes=[];

 for(const [text,pos]of anatomy.views[nivel].points){const el=document.createElement('span');el.textContent=text;$('labels').append(el);labelNodes.push({el,pos});}

}

function positionLabels(){if(!anatomy)return;const w=stage.clientWidth,h=stage.clientHeight,rects=[];for(const {el,pos}of labelNodes){const p=anatomy.root.localToWorld(pos.clone()).project(camera);el.hidden=!labels||!!xr||p.z>1||p.z<-1||Math.abs(p.x)>1||Math.abs(p.y)>1;if(el.hidden)continue;const ew=el.offsetWidth,eh=el.offsetHeight,x=Math.min(w-ew-8,Math.max(8,(p.x*.5+.5)*w+12));let y=Math.min(h-70-eh,Math.max(56,(-p.y*.5+.5)*h-10));for(const r of rects)if(x<r.x+r.w&&x+ew>r.x&&y<r.y+r.h+5&&y+eh>r.y-5)y=Math.min(h-70-eh,r.y+r.h+6);el.style.left=x+'px';el.style.top=y+'px';rects.push({x,y,w:ew,h:eh});}}

function fit(){if(!anatomy||xr)return;const v=anatomy.views[nivel],distance=Math.max(v.distance,v.distance/camera.aspect*.73);controls.target.copy(v.target);camera.position.copy(v.target).add(new THREE.Vector3(nivel===0?.28:.40,nivel===0?.10:.23,1).normalize().multiplyScalar(distance));camera.near=.01;camera.far=100;camera.updateProjectionMatrix();controls.update();}

function selectView(i){if(!anatomy||xr)return;nivel=Math.max(0,Math.min(4,i));anatomy.selecionar(nivel);$('viewName').textContent=anatomy.views[nivel].label;const [title,text,scale]=descriptions[nivel];$('infoTitle').textContent=title;$('infoText').textContent=text;$('scaleNote').textContent=scale;document.querySelectorAll('[data-view]').forEach(b=>{const active=Number(b.dataset.view)===nivel;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});buildLabels();fit();renderState();}

function play(value){running=value;$('play').textContent=$('xrPlay').textContent=value?'Pausar':'Iniciar';$('play').setAttribute('aria-pressed',String(value));$('transitionNote').textContent=value?'Mudanças graduais: acompanhe o esforço solicitado e a resposta integrada.':'Pausado: compare estados estabilizados. Inicie para acompanhar as transições.';renderState();}

function effort(value,{automatic=false}={}){state.alvo=Math.max(0,Math.min(1,value));if(!running)state.esforco=state.alvo;$('effort').value=Math.round(state.alvo*100);$('effortValue').textContent=fmt(state.alvo*100,0)+'%';if(!automatic){$('autoLoop').checked=false;loopTime=0;}document.querySelectorAll('[data-effort]').forEach(b=>{const active=Math.abs(Number(b.dataset.effort)-state.alvo)<.001;b.classList.toggle('on',active);b.setAttribute('aria-pressed',String(active));});renderState();}

function renderState(){if(!anatomy)return;const a=quadro(state);anatomy.atualizar(a);$('fr').textContent=fmt(a.fr,0)+'/min';$('fc').textContent=fmt(a.fc,0)+' bpm';$('dc').textContent=fmt(a.dc,2)+' L/min';$('extract').textContent=fmt(a.extracao*100,0)+'%';$('vo2').textContent=fmt(a.vo2,2)+' L/min';$('responseValue').textContent=fmt(a.esforco*100,0)+'%';$('responseBar').style.width=a.esforco*100+'%';$('phase').textContent=(running?'':'Pausado · ')+a.faseRespiratoria+' · '+a.faseCardiaca;

 const content=nivel===0||nivel===2?[['heart','Volume sistólico',fmt(a.vs,0)+' mL'],['flow','Oferta de O₂',fmt(a.oferta,2)+' L/min']]:nivel===1?[['resp','Volume corrente',fmt(a.vt,2)+' L'],['resp','Ventilação minuto',fmt(a.ve,1)+' L/min'],['resp','Ventilação alveolar',fmt(a.va,1)+' L/min']]:[['flow','Conteúdo arterial de O₂',fmt(a.cao2,1)+' mL/dL'],['extract','Conteúdo venoso misto de O₂',fmt(a.cvo2,1)+' mL/dL'],['extract','Saturação venosa mista',fmt(a.sv*100,0)+'%']];$('contextNumbers').replaceChildren(...content.map(([cls,label,value])=>{const el=document.createElement('span');el.className=cls;el.textContent=label+': '+value;return el;}));$('xrReadings').textContent='FR '+fmt(a.fr,0)+'/min · FC '+fmt(a.fc,0)+' bpm · DC '+fmt(a.dc,1)+' L/min · Extração '+fmt(a.extracao*100,0)+'%';drawGraph();}

function drawGraph(){if($('panel-graphs').hidden)return;const el=$('graph'),w=Math.max(260,el.clientWidth),h=280,dpr=Math.min(devicePixelRatio,2);if(el.width!==Math.round(w*dpr)||el.height!==h*dpr){el.width=Math.round(w*dpr);el.height=h*dpr;}const c=el.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);const x=e=>45+e*(w-64),y=p=>h-40-p*(h-78)/100;c.font='12px Inter,Arial';c.fillStyle='#a6bdcf';c.strokeStyle='#355060';c.lineWidth=1;for(const p of [0,25,50,75,100]){c.beginPath();c.moveTo(45,y(p));c.lineTo(w-19,y(p));c.stroke();c.fillText(p+'%',4,y(p)+4);}c.fillText('% da referência no exercício intenso',8,17);for(const e of [0,.5,1]){c.textAlign=e===0?'left':e===1?'right':'center';c.fillText(fmt(e*100,0)+'%',x(e),h-20);}c.textAlign='center';c.fillText('Esforço solicitado em estado estabilizado',w/2,h-3);c.textAlign='left';const peak=equilibrio(1);for(const [key,color]of [['fr',CORES.respiracao],['fc',CORES.coracao],['dc',CORES.fluxo],['extracao',CORES.extracao],['vo2',CORES.consumo]]){c.strokeStyle=color;c.lineWidth=2;c.beginPath();for(let i=0;i<=100;i++){const e=i/100,py=y(equilibrio(e)[key]/peak[key]*100);i?c.lineTo(x(e),py):c.moveTo(x(e),py);}c.stroke();}c.strokeStyle='#f5ead4';c.lineWidth=1.2;c.setLineDash([4,4]);c.beginPath();c.moveTo(x(state.esforco),30);c.lineTo(x(state.esforco),h-40);c.stroke();c.setLineDash([]);}

function resize(){if(xr)return;const w=stage.clientWidth,h=stage.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();fit();drawGraph();}}

const observer=new ResizeObserver(resize);observer.observe(stage);

$('play').onclick=()=>play(!running);$('reset').onclick=()=>{state=criarEstado();loopTime=0;effort(0);play(false);};$('effort').oninput=()=>effort(Number($('effort').value)/100);document.querySelectorAll('[data-effort]').forEach(b=>b.onclick=()=>effort(Number(b.dataset.effort)));

$('autoLoop').onchange=()=>{loopTime=0;if($('autoLoop').checked){effort(0,{automatic:true});play(true);}};

$('speed').oninput=()=>{speed=Number($('speed').value);$('speedValue').textContent=fmt(speed,speed%1?2:0)+'×';};$('labelsToggle').onchange=()=>{labels=$('labelsToggle').checked;xrLabels.visible=!!xr&&labels;positionLabels();};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>selectView(Number(b.dataset.view)));$('resetView').onclick=fit;

$('fullscreen').onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await stage.requestFullscreen();}catch{$('fullscreen').textContent='Ampliação indisponível';}};$('exitFullscreen').onclick=()=>document.exitFullscreen();document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Reduzir':'Ampliar';resize();});document.addEventListener('studychange',drawGraph);document.addEventListener('visibilitychange',()=>{if(document.hidden&&!xr)play(false);});

function createXRLabels(){for(const [text,pos]of anatomy.views[0].points){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#10232f';ctx.fillRect(0,0,512,96);ctx.fillStyle='#e7eef4';ctx.font='36px Arial';ctx.textAlign='center';ctx.fillText(text,256,61);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));sp.position.copy(pos).add(new THREE.Vector3(.20,0,.04));sp.scale.set(.36,.067,1);xrLabels.add(sp);}xrLabels.visible=false;anatomy.root.add(xrLabels);}

async function checkXR(){try{const supported=!!navigator.xr&&await navigator.xr.isSessionSupported('immersive-ar');$('enterAR').disabled=!supported||!anatomy;$('enterAR').textContent=supported?'Abrir RA animada':'RA animada indisponível neste aparelho';$('arStatus').textContent=supported?'Compatível com WebXR. Permita a câmera para posicionar o corpo.':'Este navegador não oferece WebXR com câmera. A viagem 3D e todos os movimentos continuam disponíveis aqui.';}catch{$('enterAR').disabled=true;$('arStatus').textContent='Não foi possível verificar WebXR. A viagem 3D permanece disponível.';}}

$('enterAR').onclick=async()=>{if(!anatomy||xr)return;try{previousView=nivel;selectView(0);$('xrOverlay').hidden=false;xr=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay'],domOverlay:{root:$('xrOverlay')}});xr.addEventListener('end',()=>{hitSource?.cancel();hitSource=null;xr=null;xrRef=null;placed=false;if(disposed)return;reticle.visible=false;anatomy.root.visible=true;anatomy.root.position.set(0,0,0);anatomy.root.scale.setScalar(1);xrLabels.visible=false;controls.enabled=true;$('xrOverlay').hidden=true;selectView(previousView);resize();last=0;});await renderer.xr.setSession(xr);xrRef=await xr.requestReferenceSpace('local');const viewer=await xr.requestReferenceSpace('viewer');hitSource=await xr.requestHitTestSource({space:viewer});anatomy.root.visible=false;controls.enabled=false;placed=false;xrLabels.visible=labels;if(!xr.domOverlayState){await xr.end();$('arStatus').textContent='A câmera oferece RA, mas não os controles necessários. Use a viagem 3D neste aparelho.';return;}}catch(e){if(xr)await xr.end().catch(()=>{});xr=null;controls.enabled=true;anatomy.root.visible=true;anatomy.root.position.set(0,0,0);anatomy.root.scale.setScalar(1);xrLabels.visible=false;selectView(previousView);$('xrOverlay').hidden=true;$('arStatus').textContent='A RA não iniciou. Confira a permissão de câmera e a compatibilidade; a viagem 3D continua disponível.';}};

$('xrPlay').onclick=()=>play(!running);$('xrRest').onclick=()=>effort(0);$('xrExercise').onclick=()=>effort(1);$('xrExit').onclick=()=>xr?.end();$('xrOverlay').addEventListener('beforexrselect',e=>{if(e.target.closest('button'))e.preventDefault();});

try{anatomy=await criar();scene.add(anatomy.root);createXRLabels();$('loading').hidden=true;$('play').disabled=$('reset').disabled=false;resize();selectView(Math.max(0,Math.min(4,(parseInt(new URLSearchParams(location.search).get('nivel'))||1)-1)));await checkXR();}catch(e){console.error(e);$('loading').textContent='O modelo não carregou. Recarregue a página e confira a conexão.';$('arStatus').textContent='A RA aguarda o carregamento da anatomia.';}

renderer.setAnimationLoop((t,frame)=>{if(disposed)return;const dt=last?Math.min(.08,Math.max(0,(t-last)/1000)):0;last=t;if(xr&&frame&&hitSource){const hit=frame.getHitTestResults(hitSource)[0];reticle.visible=!!hit&&!placed;if(hit&&!placed)reticle.matrix.fromArray(hit.getPose(xrRef).transform.matrix);}if(anatomy&&running&&(!document.hidden||xr)){if($('autoLoop').checked){loopTime=(loopTime+dt*speed)%70;const target=loopTime<15?0:loopTime<40?1:0;if(state.alvo!==target)effort(target,{automatic:true});}avancar(state,dt*speed);anatomy.atualizar(quadro(state));ui+=dt;if(ui>.1){ui=0;renderState();}}if(!xr){controls.update();positionLabels();}renderer.render(scene,camera);});

addEventListener('pagehide',()=>{disposed=true;xr?.end();observer.disconnect();renderer.setAnimationLoop(null);anatomy?.dispose();controls.dispose();renderer.dispose();env.dispose();});

