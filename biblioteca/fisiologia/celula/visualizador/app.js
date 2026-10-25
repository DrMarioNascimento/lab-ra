import {configureAR} from './ra.js?v=volume-20261025';
import {configureLayers} from './layers.js?v=celula-v3';
import * as T from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
const stage=document.getElementById('cell-stage'),button=id=>document.getElementById(id),status=button('status');
// Native AR is available even if this browser cannot create a WebGL context.
const layers=configureLayers();
let arPresenting=false,syncRender=()=>{};
configureAR({...layers,onPresenting(value){arPresenting=value;syncRender();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try { renderer=new T.WebGLRenderer({antialias:true,alpha:true}); }
catch(error){
 status.textContent='A prévia 3D não está disponível neste navegador. No celular compatível, use Abrir em realidade aumentada.';
 const poster=document.createElement('img');poster.src='./celula-v3-'+layers.getVariant()+'.webp';layers.subscribe(()=>{poster.src='./celula-v3-'+layers.getVariant()+'.webp';});poster.alt='Novo modelo da célula humana';poster.className='cell-poster';stage.append(poster);
 for(const id of ['nuc','motion','speed','reset'])button(id).disabled=true;
 console.warn('Prévia 3D indisponível',error);
}
if(renderer) init().catch(error=>{status.textContent='Não foi possível carregar a prévia. Recarregue a página ou abra o modelo em RA.';console.error(error);});
async function init(){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.localClippingEnabled=true;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;stage.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.01,100),controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.minDistance=1.3;controls.maxDistance=16;
 scene.add(new T.HemisphereLight(0xffffff,0x8593a3,2));
 for(const [intensity,pos] of [[2.5,[3,4,4]],[1.5,[-3,1,2]],[1.5,[1,2,-3]]]){const light=new T.DirectionalLight(0xffffff,intensity);light.position.set(...pos);scene.add(light);}
 const loader=new GLTFLoader();let gltf;
 if(matchMedia('(pointer:coarse)').matches){
  gltf=await loader.loadAsync('./celula-v3-completa.glb',e=>{if(e.total)status.textContent=`Carregando célula · ${Math.round(100*e.loaded/e.total)}%`;});
 }else{
  // Lossless original, split only for transport. Embedded buffers and textures stay identical.
  const response=await fetch('./modelo-original-v3/manifest.json');if(!response.ok)throw Error('Manifesto indisponível');const manifest=await response.json();let loaded=0;
  const parts=await Promise.all(manifest.parts.map(async part=>{const response=await fetch('./modelo-original-v3/'+part.file);if(!response.ok)throw Error('Parte do modelo indisponível');const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length!==part.bytes)throw Error('Parte incompleta');loaded+=bytes.length;status.textContent=`Carregando célula · ${Math.round(100*loaded/manifest.bytes)}%`;return bytes;}));
  const bytes=new Uint8Array(manifest.bytes);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  gltf=await loader.parseAsync(bytes.buffer,'./');
 }
 const model=gltf.scene,root=new T.Group();root.add(model);scene.add(root);
 const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
 const scale=2/Math.max(size.x,size.y,size.z);root.scale.setScalar(scale);root.position.copy(center).multiplyScalar(-scale);root.updateMatrixWorld(true);
 const nuclear=[];let open=false,moving=!reduced,activeTab=true;
 const plane=new T.Plane(new T.Vector3(0,-1,0),0);
 model.traverse(o=>{if(!o.isMesh)return;
   o.material=o.material.clone();if(o.material.transparent)o.material.depthWrite=false;
   if(['envoltorio_nuclear','poros_nucleares','nucleoplasma'].includes(o.name))nuclear.push(o);
 });
 layers.attachModel(model);
 const mixer=new T.AnimationMixer(model);gltf.animations.forEach(clip=>mixer.clipAction(clip).play());
 function updateClip(){
  if(!nuclear.length)return;
  const bounds=new T.Box3().setFromObject(nuclear[0]);
  plane.constant=bounds.max.y-(bounds.max.y-bounds.min.y)*Number(button('cut').value)/100;
  nuclear.forEach(o=>{o.material.clippingPlanes=open?[plane]:[];});
 }
 button('nuc').disabled=!nuclear.length;
 button('nuc').onclick=()=>{open=!open;button('nuc').setAttribute('aria-pressed',String(open));button('nuc').textContent=open?'Restaurar núcleo':'Revelar núcleo';button('cutlabel').hidden=!open;updateClip();};button('cut').oninput=updateClip;
 function motionText(){button('motion').setAttribute('aria-pressed',String(moving));button('motion').textContent=moving?'Animação ativa':'Animação pausada';}
 button('motion').onclick=()=>{moving=!moving;motionText();};motionText();
 function fitView(reset=false){
  const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
  const direction=reset?new T.Vector3(2.7,1.6,3.2):camera.position.clone().sub(controls.target);
  const vertical=T.MathUtils.degToRad(camera.fov),horizontal=2*Math.atan(Math.tan(vertical/2)*camera.aspect),distance=1.12/Math.sin(Math.min(vertical,horizontal)/2)*1.08;
  controls.target.set(0,0,0);camera.position.copy(direction.normalize().multiplyScalar(distance));controls.update();
 }
 button('reset').onclick=()=>fitView(true);new ResizeObserver(()=>fitView()).observe(stage);fitView(true);
 const names={reticulo_endoplasmatico_liso:'Retículo endoplasmático liso',reticulo_endoplasmatico_rugoso:'Retículo endoplasmático rugoso',ribossomos_RER:'Ribossomos do retículo rugoso',envoltorio_nuclear:'Envoltório nuclear',poros_nucleares:'Poros nucleares',nucleolo:'Nucléolo',cromatina:'Cromatina',cromatina_densa:'Cromatina densa',cisternas_golgi:'Complexo de Golgi',microtubulos:'Microtúbulos',microfilamentos:'Microfilamentos',centrossomo:'Centrossomo'};
 const ray=new T.Raycaster();let down;
 renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
 renderer.domElement.addEventListener('pointerup',e=>{
  if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8)return;down=null;
  const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);
  const hit=ray.intersectObject(model,true).find(h=>h.object.visible&&!['membrana_plasmatica','citosol','nucleoplasma'].includes(h.object.name)&&(!open||!nuclear.includes(h.object)||plane.distanceToPoint(h.point)>=0));
  const name=hit?.object.name||'';button('tip').textContent=names[name]||(/^mitocondria/.test(name)?(name.endsWith('_membrana')?'Membrana da mitocôndria':'Mitocôndria · cristas'):/^ribossomo/.test(name)?'Ribossomo livre':/^vesicula/.test(name)?'Vesícula do complexo de Golgi':/^lisossomo/.test(name)?'Lisossomo':/^peroxissomo/.test(name)?'Peroxissomo':name.replaceAll('_',' '));
 });
 renderer.domElement.addEventListener('pointercancel',()=>down=null);
 let frameId=null,last=performance.now();
 function frame(now){frameId=null;if(document.hidden||!activeTab||arPresenting)return;const dt=Math.min((now-last)/1000,.05);last=now;
  if(moving)mixer.update(dt*Number(button('speed').value)/100);if(open)updateClip();controls.update();renderer.render(scene,camera);frameId=requestAnimationFrame(frame);
 }
 function resume(){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;last=performance.now();if(!document.hidden&&activeTab&&!arPresenting)frameId=requestAnimationFrame(frame);}
 addEventListener('message',event=>{if(event.origin===location.origin&&event.source===parent&&event.data?.type==='celula-visibilidade'){activeTab=event.data.ativa===true;resume();}});
 syncRender=resume;
 document.addEventListener('visibilitychange',resume);addEventListener('pageshow',resume);resume();
 status.textContent='Organelas · animação original do modelo';window.cellReady=true;
}
