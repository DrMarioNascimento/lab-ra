import {configureAR} from './ra.js';
import * as T from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
const stage=document.getElementById('cell-stage');
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.localClippingEnabled=true;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;stage.append(renderer.domElement);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,stage.clientWidth/stage.clientHeight,.01,100);camera.position.set(2.7,1.6,3.2);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=1.3;controls.maxDistance=16;
scene.add(new T.HemisphereLight(0xc1f7ff,0x30213e,2.1));for(const [color,intensity,pos] of [[0x97ebff,4,[3,4,4]],[0xffb69d,3,[-3,1,2]],[0x729bff,5,[1,2,-3]]]){const l=new T.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l)}
const root=new T.Group();scene.add(root);let model,membrane,nuclear=[],moving=true,open=false,t=0;const plane=new T.Plane(new T.Vector3(0,0,-1),0);let center=new T.Vector3(),radius=.3;
const status=document.querySelector('#status'),button=id=>document.getElementById(id);const mobiles=[];let closedNucleus,bilayer,chromatin3D;const nuclearInterior=[];
new GLTFLoader().load('./celula-aprimorada.glb',g=>{
 model=g.scene;root.add(model);const box=new T.Box3().setFromObject(model),c=box.getCenter(new T.Vector3()),s=box.getSize(new T.Vector3());model.position.sub(c);const scale=2/Math.max(s.x,s.y,s.z);model.scale.setScalar(scale);model.position.multiplyScalar(scale);model.updateMatrixWorld(true);
 model.traverse(o=>{if(!o.isMesh)return;if(o.name==='membrana_plasmatica')membrane=o;if(['envoltorio_nuclear','poros_nucleares','nucleoplasma'].includes(o.name)){nuclear.push(o);o.material=o.material.clone();o.material.clippingPlanes=[]}if(o.material.transparent)o.material.depthWrite=false});
 const n=model.getObjectByName('envoltorio_nuclear');if(n){center.copy(n.localToWorld(new T.Vector3()));radius=.301*scale;const mat=n.material.clone();mat.clippingPlanes=[];mat.transparent=true;mat.opacity=.68;mat.vertexColors=false;mat.color.set(0x8966cc);mat.depthWrite=false;mat.side=T.FrontSide;closedNucleus=new T.Mesh(new T.SphereGeometry(.301,80,56),mat);closedNucleus.name='envoltorio_nuclear_completo';closedNucleus.position.copy(n.position);closedNucleus.quaternion.copy(n.quaternion);closedNucleus.scale.copy(n.scale);n.parent.add(closedNucleus);}
 if(closedNucleus){
  // A continuous spherical envelope, perforated only by the illustrated pore channels.
  closedNucleus.material.opacity=.94;closedNucleus.material.roughness=.48;
  const directions=[],poreCount=96;
  const rings=new T.InstancedMesh(new T.TorusGeometry(.013,.0032,8,16),new T.MeshStandardMaterial({color:0xd8c0ff,roughness:.35,metalness:.12}),poreCount);
  rings.name='poros_nucleares_completos';const obj=new T.Object3D();
  for(let i=0;i<poreCount;i++){const y=1-2*(i+.5)/poreCount,a=i*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-y*y),v=new T.Vector3(r*Math.cos(a),y,r*Math.sin(a));directions.push(v);obj.position.copy(v).multiplyScalar(.302);obj.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),v);obj.updateMatrix();rings.setMatrixAt(i,obj.matrix)}
  const shell=new T.SphereGeometry(.301,160,112),pos=shell.attributes.position,index=shell.index.array,keep=[];const v=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  for(let i=0;i<index.length;i+=3){a.fromBufferAttribute(pos,index[i]);b.fromBufferAttribute(pos,index[i+1]);c.fromBufferAttribute(pos,index[i+2]);v.copy(a).add(b).add(c).normalize();if(!directions.some(d=>d.dot(v)>Math.cos(.040)))keep.push(index[i],index[i+1],index[i+2])}
  shell.setIndex(keep);closedNucleus.geometry.dispose();closedNucleus.geometry=shell;closedNucleus.add(rings);
  chromatin3D=new T.Group();chromatin3D.name='cromatina_volumetrica';chromatin3D.position.copy(closedNucleus.position);chromatin3D.quaternion.copy(closedNucleus.quaternion);chromatin3D.scale.copy(closedNucleus.scale);closedNucleus.parent.add(chromatin3D);
  let seed=481;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
  const loose=new T.MeshStandardMaterial({color:0xd5b5f3,roughness:.7}),dense=new T.MeshStandardMaterial({color:0x8056ba,roughness:.7});
  for(let i=0;i<52;i++){const base=new T.Vector3(rnd()-.5,rnd()-.5,rnd()-.5).normalize().multiplyScalar(.10+rnd()*.12),points=[],phase=rnd()*6.28;for(let k=0;k<24;k++){const u=k/23*6.28,point=base.clone().add(new T.Vector3(Math.sin(u*1.7+phase)*.065,Math.cos(u*2.3+phase)*.062,Math.sin(u*2.1-phase)*.061));if(point.length()>.274)point.setLength(.274);if(point.length()<.085)point.setLength(.085);points.push(point)}const curve=new T.CatmullRomCurve3(points);const strand=new T.Mesh(new T.TubeGeometry(curve,90,i%4===0?.004:.0023,5,false),i%4===0?dense:loose);strand.name=i%4===0?'heterocromatina':'eucromatina';chromatin3D.add(strand)}
  ['cromatina','cromatina_densa'].forEach(name=>{const o=model.getObjectByName(name);if(o)o.visible=true});
 }
 ['envoltorio_nuclear','poros_nucleares','nucleoplasma'].forEach(name=>{const o=model.getObjectByName(name);if(o)nuclearInterior.push(o)});
 if(membrane){membrane.material=membrane.material.clone();membrane.material.opacity=.055;bilayer=new T.Group();bilayer.name='bicamada_lipidica';membrane.add(bilayer);const pos=membrane.geometry.attributes.position,norm=membrane.geometry.attributes.normal,count=1400;const heads=new T.InstancedMesh(new T.SphereGeometry(.004,6,4),new T.MeshStandardMaterial({color:0x8ce5ef,transparent:true,opacity:.25,roughness:.48,depthWrite:false}),count*2);const dummy=new T.Object3D(),lines=[];for(let i=0;i<count;i++){const index=Math.floor(i*pos.count/count),p=new T.Vector3().fromBufferAttribute(pos,index),normal=new T.Vector3().fromBufferAttribute(norm,index).normalize();for(let k=0;k<2;k++){const q=p.clone().addScaledVector(normal,k===0?.007:-.007);dummy.position.copy(q);dummy.updateMatrix();heads.setMatrixAt(i*2+k,dummy.matrix);const end=q.clone().addScaledVector(normal,k===0?-.006:.006);lines.push(...q.toArray(),...end.toArray());}}bilayer.add(heads,new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(lines,3)),new T.LineBasicMaterial({color:0x7ab6da,transparent:true,opacity:.16,depthWrite:false})));}
 const geo=new T.SphereGeometry(.012,10,8);for(let i=0;i<95;i++){const p=new T.Vector3((Math.random()-.5)*1.5,(Math.random()-.5)*1.2,(Math.random()-.5)*1.5);if(p.length()>.74){i--;continue}const mol=new T.Group(),mat=new T.MeshStandardMaterial({color:i%3?0x89e5df:0xffd7a3,emissive:i%3?0x257d81:0x826037,emissiveIntensity:.5,roughness:.35,metalness:.2});for(let k=0;k<3;k++){const atom=new T.Mesh(geo,mat);atom.position.set(k*.016,Math.sin(k*2)*.012,0);mol.add(atom)}mol.position.copy(p);root.add(mol);mobiles.push({mol,p,phase:Math.random()*6.28})}
 fitView(true);configureAR(root);clip();status.textContent='Bicamada lipídica · moléculas em suspensão';window.cellReady=true;
},e=>{if(e.total)status.textContent=`Carregando célula · ${Math.round(100*e.loaded/e.total)}%`},e=>{status.textContent='Não foi possível carregar. Abra pelo Iniciar.cmd.';console.error(e)});
function clip(){if(closedNucleus)closedNucleus.visible=!open;if(chromatin3D)chromatin3D.visible=open;nuclearInterior.forEach(o=>o.visible=open);plane.normal.set(0,-1,0);plane.constant=center.y+radius*(1-2*Number(button('cut').value)/100);nuclear.forEach(o=>{o.material.clippingPlanes=open&&Number(button('cut').value)>55?[plane]:[];o.material.needsUpdate=true})}
button('mem').onclick=()=>{if(!membrane)return;membrane.visible=!membrane.visible;button('mem').setAttribute('aria-pressed',membrane.visible);button('mem').textContent=membrane.visible?'Membrana visível':'Membrana oculta'};
button('nuc').onclick=()=>{open=!open;button('nuc').setAttribute('aria-pressed',open);button('nuc').textContent=open?'Fechar núcleo':'Abrir núcleo';button('cutlabel').hidden=!open;clip()};button('cut').oninput=clip;
button('motion').onclick=()=>{moving=!moving;button('motion').setAttribute('aria-pressed',moving);button('motion').textContent=moving?'Movimento ativo':'Movimento pausado'};
button('reset').onclick=()=>fitView(true);
const names={reticulo_endoplasmatico_liso:'Retículo endoplasmático liso',reticulo_endoplasmatico_rugoso:'Retículo endoplasmático rugoso',ribossomos_RER:'Ribossomos do retículo rugoso',envoltorio_nuclear:'Envoltório nuclear',nucleolo:'Nucléolo',cromatina:'Cromatina',mitocondrias_membrana:'Mitocôndrias',cisternas_golgi:'Complexo de Golgi'};const ray=new T.Raycaster();let down;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!model||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);const hit=ray.intersectObject(model,true).find(h=>h.object.visible&&!['citosol','membrana_plasmatica','nucleoplasma'].includes(h.object.name)&&(!open||!nuclear.includes(h.object)||plane.distanceToPoint(h.point)>=0));button('tip').textContent=hit?(names[hit.object.name]||hit.object.name.replaceAll('_',' ')):''});
function fitView(reset=false){
 const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
 renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
 const direction=reset?new T.Vector3(2.7,1.6,3.2):camera.position.clone().sub(controls.target);
 const vertical=T.MathUtils.degToRad(camera.fov),horizontal=2*Math.atan(Math.tan(vertical/2)*camera.aspect);
 const distance=1.12/Math.sin(Math.min(vertical,horizontal)/2)*1.08;
 controls.target.set(0,0,0);camera.position.copy(direction.normalize().multiplyScalar(distance));controls.update();
}
new ResizeObserver(()=>fitView()).observe(stage);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)button('motion').click();
let activeTab=true;addEventListener('message',event=>{if(event.origin===location.origin && event.source===parent && event.data?.type==='celula-visibilidade')activeTab=event.data.ativa===true});
const clock=new T.Clock();function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);if(moving&&activeTab)t+=dt*Number(button('speed').value)/100;mobiles.forEach(({mol,p,phase})=>{mol.position.set(p.x+Math.sin(t*1.4+phase)*.12,p.y+Math.cos(t*1.1+phase)*.10,p.z+Math.sin(t*1.25+phase)*.11);mol.rotation.set(t*.7+phase,t*.9,0)});controls.update();renderer.render(scene,camera)}frame();



