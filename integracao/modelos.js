import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {geoPulmao} from '../pleura/anatomia.js';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),TAU=Math.PI*2;
const mat=(color,extra={})=>new THREE.MeshPhysicalMaterial({color,roughness:.65,metalness:0,sheen:.65,sheenRoughness:.7,...extra});
const tube=(points,r=.012)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>Array.isArray(p)?V(...p):p)),64,r,10,false);
function sphere(parent,name,pos,scale,material){const m=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),material);m.name=name;m.position.set(...pos);m.scale.set(...scale);parent.add(m);return m;}
function texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256);let seed=51439;for(let y=0;y<256;y++)for(let x=0;x<256;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=seed/4294967296;const b=kind==='muscle'?20*Math.sin(x*.40+Math.sin(y*.04)):12*Math.sin(x*.06)*Math.cos(y*.09);const v=195+15*n+b;const i=(y*256+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}ctx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
export function normalizarModelo(scene,height){scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(scene),c=box.getCenter(V()),k=height/box.getSize(V()).y,g=new THREE.Group();scene.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone(),p=geo.attributes.position,xyz=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){xyz[i*3]=p.getX(i);xyz[i*3+1]=p.getY(i);xyz[i*3+2]=p.getZ(i);}geo.setAttribute('position',new THREE.BufferAttribute(xyz,3));geo.applyMatrix4(o.matrixWorld).translate(-c.x,-box.min.y,-c.z).scale(k,k,k);geo.deleteAttribute('normal');geo.computeVertexNormals();const m=new THREE.Mesh(geo,o.material);m.name=o.name;g.add(m);});return g;}
function blood(parent,curve,count,radius){const mesh=new THREE.InstancedMesh(new THREE.SphereGeometry(radius,8,6),new THREE.MeshStandardMaterial({roughness:.45}),count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.name='hemacias_em_fluxo';mesh.frustumCulled=false;parent.add(mesh);return {mesh,curve,count};}
export async function criar(){
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 const [bodyFile,heartFile]=await Promise.all(['corpo','coracao'].map(n=>loader.loadAsync(new URL('./assets/'+n+'.glb',import.meta.url).href)));
 const root=new THREE.Group();root.name='corpo_em_acao';
 const body=normalizarModelo(bodyFile.scene,3.4),skin=mat('#8ebccc',{transparent:true,opacity:.10,depthWrite:false,side:THREE.DoubleSide});
 body.traverse(o=>{if(o.isMesh){o.material=skin;o.renderOrder=4;}});root.add(body);
 const contour=body.clone();contour.traverse(o=>{if(o.isMesh){o.material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.FrontSide,uniforms:{tint:{value:new THREE.Color('#79b5ce')},alpha:{value:.28}},vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'uniform vec3 tint;uniform float alpha;varying vec3 n;varying vec3 v;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),2.5);gl_FragColor=vec4(tint,alpha*rim);}' });o.renderOrder=5;}});root.add(contour);
 const lungs=new THREE.Group();lungs.position.y=2.02;lungs.scale.setScalar(2.3);root.add(lungs);
 const lungMaterial=mat('#d89b9c',{map:texture('tissue'),bumpMap:texture('tissue'),bumpScale:.0007,transparent:true,opacity:.56,depthWrite:false});
 for(const s of [-1,1]){const m=new THREE.Mesh(geoPulmao(s,{toracico:true}),lungMaterial);m.name=s<0?'pulmao_direito':'pulmao_esquerdo';lungs.add(m);}
 const air=new THREE.Group();root.add(air);const airway=mat('#bdb8a2',{transparent:true,opacity:.85});for(const pts of [[[0,2.91,-.015],[0,2.74,-.035],[0,2.56,-.04]],[ [0,2.56,-.04],[-.09,2.49,-.025],[-.17,2.42,0] ],[[0,2.56,-.04],[.08,2.51,-.025],[.14,2.44,0]]]){const m=new THREE.Mesh(tube(pts,.015),airway);air.add(m);}
 for(let j=0;j<10;j++){const m=new THREE.Mesh(new THREE.TorusGeometry(.018,.0025,6,24),mat('#e5dac5'));m.rotation.x=Math.PI/2;m.position.set(0,2.62+j*.027,-.03);air.add(m);}
 const diaphragm=sphere(root,'diafragma',[0,2.23,-.015],[.235,.048,.15],mat('#a57173',{transparent:true,opacity:.65}));
 const heart=normalizarModelo(heartFile.scene,.28);heart.position.set(.055,2.42,.062);heart.rotation.z=.13;heart.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.metalness=0;o.material.roughnessMap=null;o.material.roughness=.6;}});root.add(heart);
 const muscle=new THREE.Group();muscle.position.set(.185,1.30,.045);root.add(muscle);const muscleMaterial=mat('#a95c58',{map:texture('muscle'),bumpMap:texture('muscle'),bumpScale:.002});
 sphere(muscle,'quadriceps',[0,0,0],[.085,.34,.075],muscleMaterial);for(const y of [-.37,.37])sphere(muscle,'tendao',[0,y,-.01],[.028,.075,.024],mat('#d9c8ad'));
 const paths=[];
 const addRoute=(pts,color,r,count)=>{const curve=new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),wall=new THREE.Mesh(new THREE.TubeGeometry(curve,80,r,10),mat(color,{transparent:true,opacity:.36,depthWrite:false}));root.add(wall);paths.push(blood(root,curve,count,r*.65));return paths.at(-1);};
 // Circulação sistêmica: sai pelo lado arterial, atravessa o leito muscular,
 // retorna pelo lado venoso. Circulação pulmonar tem circuito próprio.
 const systemic=addRoute([[.10,2.59,.075],[.15,2.72,-.03],[.03,2.60,-.09],[.025,2.19,-.09],[.10,1.71,-.035],[.19,1.32,.07],[.21,.89,.095],[.22,.65,.07],[.16,.69,.075],[.14,1.12,.065],[.075,1.67,-.015],[-.04,2.13,-.035],[-.04,2.51,.045]],'#b987b2',.014,66);systemic.type='systemic';
 for(const s of [-1,1]){const p=addRoute([[-.025,2.55,.10],[s*.075,2.61,.03],[s*.17,2.57,-.012],[s*.20,2.40,.015],[s*.12,2.36,.09],[s*.085,2.51,.055],[.075,2.58,.045]],'#b987b2',.009,22);p.type='pulmonary';}
 // Ampliações didáticas no mesmo relógio; entram por aproximação guiada.
 const alveolar=new THREE.Group();alveolar.visible=false;root.add(alveolar);const alvmat=mat('#e7b1a6',{transparent:true,opacity:.62,depthWrite:false,bumpMap:texture('tissue'),bumpScale:.006});
 const capmat=mat('#a44d61',{transparent:true,opacity:.65,depthWrite:false});
 alveolar.add(new THREE.Mesh(tube([[0,.52,0],[0,.2,0],[0,-.3,0]],.055),mat('#dfc7ad',{transparent:true,opacity:.45,depthWrite:false})));
 for(let i=0;i<18;i++){const a=i*2.399,y=(i%6-2.5)*.11,rr=.27+Math.sin(i)*.04,center=V(rr*Math.cos(a),y,rr*Math.sin(a)),m=sphere(alveolar,'alveolo',center.toArray(),[.15,.145,.15],alvmat),p=m.geometry.attributes.position;for(let k=0;k<p.count;k++){const x=p.getX(k),z=p.getZ(k),yy=p.getY(k),r=1+.055*Math.sin(x*7+i)*Math.sin(z*5+yy*3);p.setXYZ(k,x*r,yy*r,z*r);}p.needsUpdate=true;m.geometry.computeVertexNormals();alveolar.add(new THREE.Mesh(tube([V(0,y,0),center.clone().multiplyScalar(.6),center],.023),mat('#d7bfa5',{transparent:true,opacity:.40,depthWrite:false})));
  for(let j=0;j<2;j++){const points=Array.from({length:25},(_,k)=>{const t=k/24*TAU;return center.clone().add(V(.153*Math.cos(t),.153*Math.sin(t)*Math.cos(j*.9),.153*Math.sin(t)*Math.sin(j*.9)));});alveolar.add(new THREE.Mesh(tube(points,.007),capmat));}
 }
 const alvCurve=new THREE.CatmullRomCurve3(Array.from({length:45},(_,i)=>{const a=i/44*TAU*2;return V(.41*Math.cos(a),-.38+i/44*.76,.41*Math.sin(a));}));alveolar.add(new THREE.Mesh(new THREE.TubeGeometry(alvCurve,100,.022,10),mat('#9e657d',{transparent:true,opacity:.38,depthWrite:false})));const alvBlood=blood(alveolar,alvCurve,20,.018);alvBlood.type='pulmonary';
 const fibre=new THREE.Group();fibre.visible=false;root.add(fibre);sphere(fibre,'fibra_muscular',[0,0,0],[.23,.6,.20],mat('#bd7872',{map:texture('muscle'),transparent:true,opacity:.30,depthWrite:false}));const fibCurve=new THREE.CatmullRomCurve3([V(-.32,.65,.12),V(-.35,.2,.1),V(-.3,-.25,.10),V(-.27,-.65,.11)]);fibre.add(new THREE.Mesh(new THREE.TubeGeometry(fibCurve,60,.05,16),mat('#8e617b',{transparent:true,opacity:.30,depthWrite:false})));const fibBlood=blood(fibre,fibCurve,14,.031);fibBlood.type='systemicDetail';
 const mitochondria=[];
 for(let i=0;i<6;i++){const g=mitochondrion(.17);g.position.set(.11*Math.sin(i*2),-.43+i*.16,.025);fibre.add(g);mitochondria.push(g);}
 const mito=mitochondrion(.60);mito.visible=false;root.add(mito);
 const oxygen=[];for(let i=0;i<40;i++){const m=sphere(fibre,'oxigenio',[0,0,0],[.013,.013,.013],mat('#e8bd6b',{emissive:'#b98723',emissiveIntensity:.4}));oxygen.push(m);}
 const atp=[];for(let i=0;i<24;i++)atp.push(sphere(mito,'ATP',[0,0,0],[.023,.023,.023],mat('#c7a5ec',{emissive:'#613d88',emissiveIntensity:.3})));
 const alveolarOxygen=[];for(let i=0;i<32;i++)alveolarOxygen.push(sphere(alveolar,'oxigenio_para_sangue',[0,0,0],[.012,.012,.012],mat('#e8bd6b',{emissive:'#b98723',emissiveIntensity:.2})));
 const temp=new THREE.Object3D(),red=new THREE.Color('#aa3536'),dark=new THREE.Color('#391825');
 const structures=[body,contour,lungs,air,diaphragm,heart,muscle,...paths.map(x=>x.mesh)];const walls=root.children.filter(o=>o.isMesh&&!structures.includes(o));
 let selected=0;
 function selecionar(i){selected=i;for(const o of [...structures,...walls])o.visible=i===0||i===2;alveolar.visible=i===1;fibre.visible=i===3;mito.visible=i===4;if(i===2){body.visible=contour.visible=false;lungs.visible=false;muscle.visible=false;diaphragm.visible=false;air.visible=false;}return views[i];}
 function particles(b,a){for(let i=0;i<b.count;i++){const f=(i/b.count+a.transporte)%1,point=b.curve.getPoint(f),t=b.curve.getTangent(f);temp.position.copy(point);temp.quaternion.setFromUnitVectors(V(0,1,0),t);temp.scale.set(1,.47,1);temp.updateMatrix();b.mesh.setMatrixAt(i,temp.matrix);let sat=b.type==='pulmonary'?a.sv+(a.sa-a.sv)*Math.min(1,Math.max(0,(f-.2)/.5)):a.sa-(a.sa-a.sv)*Math.min(1,Math.max(0,(f-(b.type==='systemicDetail'?.15:.5))/.18));b.mesh.setColorAt(i,dark.clone().lerp(red,sat));}b.mesh.instanceMatrix.needsUpdate=true;if(b.mesh.instanceColor)b.mesh.instanceColor.needsUpdate=true;}
 function atualizar(a){const expansion=.04+.045*a.esforco;lungs.scale.set(2.3*(1+expansion*a.inspiracao),2.3*(1+.04*a.inspiracao),2.3*(1+expansion*a.inspiracao));lungs.position.y=2.02-.025*a.inspiracao;diaphragm.position.y=2.23-.045*a.inspiracao;diaphragm.scale.y=.048*(1-.4*a.inspiracao);heart.scale.set(1-.048*a.sistole,1-.022*a.sistole,1-.055*a.sistole);muscle.scale.set(1+.025*a.contracao,1-.04*a.contracao,1+.025*a.contracao);alveolar.scale.setScalar(1+.07*a.inspiracao);fibre.scale.set(1+.025*a.contracao,1-.04*a.contracao,1+.025*a.contracao);paths.forEach(b=>particles(b,a));particles(alvBlood,a);particles(fibBlood,a);
  for(let i=0;i<alveolarOxygen.length;i++){const u=(i/alveolarOxygen.length+a.transporte*.8)%1,theta=i*2.399,rr=.08+.34*u;alveolarOxygen[i].position.set(rr*Math.cos(theta),-.28+(i%7)*.085+.015*Math.sin(a.tempo+i),rr*Math.sin(theta));alveolarOxygen[i].visible=u<.92;}
  for(let i=0;i<oxygen.length;i++){const u=(i/oxygen.length+a.transporte*(.3+1.2*a.extracao))%1;oxygen[i].position.set(-.31+.44*u,.53-(i%8)/7*1.04+.013*Math.sin(a.tempo*1.5+i),.12-.10*u+.015*Math.sin(i*3+a.tempo));oxygen[i].visible=u<.85;}
  for(let i=0;i<atp.length;i++){const u=(i/atp.length+a.transporte*(.3+1.3*a.esforco))%1;atp[i].position.set(.1+.62*u,-.35+(i%6)*.14+.03*Math.sin(a.tempo+i),.26+.05*Math.sin(i*3+a.tempo));atp[i].scale.setScalar(.018*(1-u*.4));}
 }
 const views=[{target:V(0,1.7,0),distance:5.6,label:'Corpo integrado',points:[['Pulmões',V(-.18,2.52,.08)],['Cœur',V(.08,2.5,.10)],['Músculo ativo',V(.23,1.07,.10)]]},{target:V(),distance:2,label:'Alvéolo',points:[['Ar alveolar',V(.12,.24,.12)],['Barreira alveolocapilar',V(-.32,0,.10)],['Sangue capilar',V(.3,-.25,.28)]]},{target:V(.06,2.56,.02),distance:1.35,label:'Circulação',points:[['Coração',V(.08,2.5,.12)],['Circulação pulmonar',V(-.18,2.54,.02)],['Circulação sistêmica',V(.03,2.23,-.06)]]},{target:V(),distance:2,label:'Músculo',points:[['Capilar muscular',V(-.32,.3,.1)],['Fibra muscular',V(.15,.47,.17)],['Mitocôndrias',V(.04,-.3,.04)]]},{target:V(),distance:2.3,label:'Mitocôndria',points:[['Membrana externa em corte',V(-.36,.12,.1)],['Cristas mitocondriais',V(.05,0,.2)],['ATP · adenosina trifosfato',V(.62,-.06,.3)]]}];
 views[0].label='Corpo integrado';views[0].points=[['Pulmões',V(-.18,2.52,.08)],['Coração',V(.08,2.5,.1)],['Músculo ativo',V(.23,1.07,.1)]];
 const hotspots=[{object:lungs,view:1,from:0},{object:heart,view:2,from:0},{object:muscle,view:3,from:0},...mitochondria.map(object=>({object,view:4,from:3}))];
 selecionar(0);return {root,views,selecionar,atualizar,heart,body,lungMaterial,hotspots,dispose(){const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){ms.add(m);for(const value of Object.values(m))if(value?.isTexture)ts.add(value);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());}};
}
function mitochondrion(size){
 const g=new THREE.Group();g.name='mitocondria_em_corte';
 // Janela anterior: a membrana permanece atrás e nas bordas do corte.
 const geo=new THREE.SphereGeometry(1,48,28,Math.PI*.95,Math.PI*1.1);geo.scale(size,size*.48,size*.45);
 g.add(new THREE.Mesh(geo,mat('#b59a88',{side:THREE.DoubleSide,bumpMap:texture('tissue'),bumpScale:.004})));
 sphere(g,'matriz',[0,0,-size*.22],[size*.91,size*.37,size*.17],mat('#916a72'));
 const m=mat('#d9b69c',{side:THREE.DoubleSide,bumpMap:texture('tissue'),bumpScale:.002});
 for(let k=0;k<8;k++){const x=(k/7-.5)*size*1.45,vertices=[],indices=[],nu=14,nv=8,extent=Math.sqrt(1-(x/size)**2);
  for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const u=i/nu,v=j/nv,y=(u-.5)*size*.68*extent,z=size*(-.09+.36*v),px=x+size*.035*Math.sin(u*Math.PI*3+k)*Math.sin(v*Math.PI);vertices.push(px,y,z);if(i<nu&&j<nv){const a=i*(nv+1)+j,b=a+nv+1;indices.push(a,b,a+1,a+1,b,b+1);}}
  const fold=new THREE.BufferGeometry();fold.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));fold.setIndex(indices);fold.computeVertexNormals();const mesh=new THREE.Mesh(fold,m);mesh.name='crista_membrana_interna';g.add(mesh);
 }
 return g;
}
