import * as THREE from 'three';
import {CORES} from './fisica.js?v=jun-20261003';
import {estadoVisual,comprimentoVisual,encaixeTriade,impulsoVisual,particulaVisual,vesiculaVisual,trajetoFluido,suave} from './animacao.js?v=jun-encaixe-20261004';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export const NIVEIS=[
 {nome:'O encontro',titulo:'Uma conexão, duas células',texto:'O axônio motor termina em ramos sobre uma fibra muscular. A mielina termina antes dos botões; células de Schwann terminais acompanham a arborização. O nervo não se funde à fibra: existe uma fenda entre as membranas.'},
 {nome:'O terminal',titulo:'O impulso prepara a liberação',texto:'O corte revela vesículas e mitocôndrias. A chegada do impulso abre canais de cálcio do terminal. A entrada de cálcio favorece a fusão das vesículas e a liberação de acetilcolina nas zonas ativas.'},
 {nome:'A fenda',titulo:'Uma resposta local precisa alcançar o limiar',texto:'A acetilcolina alcança receptores nicotínicos nas cristas das pregas musculares. O potencial de placa é graduado. Os canais de sódio dependentes de voltagem, concentrados nas regiões profundas, permitem iniciar o potencial de ação muscular. A acetilcolinesterase encerra o sinal.'},
 {nome:'A tríade',titulo:'O sinal elétrico chega ao reservatório',texto:'Um túbulo T fica entre duas cisternas terminais do retículo sarcoplasmático. No músculo esquelético, o sensor DHPR transmite a mudança de voltagem ao RyR1. O retículo libera cálcio no sarcoplasma. As miofibrilas encurtam depois da liberação; a SERCA recaptura o cálcio e permite o relaxamento.'},
 {nome:'A contração',titulo:'O cálcio permite a interação dos filamentos',texto:'O cálcio liga-se à troponina C e desloca a tropomiosina, permitindo as pontes entre actina e miosina. A ativação cresce depois do sinal elétrico e diminui após a recaptura do cálcio. Os filamentos mantêm seus comprimentos; a banda A não encurta.'}
];
export function criar(textura){
 const bump=textura('tecido'),bands=textura('estrias');
 const mat=(cor,extra={})=>new THREE.MeshPhysicalMaterial({color:cor,roughness:.48,metalness:0,sheen:.24,sheenRoughness:.68,bumpMap:bump,bumpScale:.022,clearcoat:.12,clearcoatRoughness:.65,...extra});
 const M={nerve:mat('#cfb09a'),muscle:mat('#a65359',{map:bands,bumpMap:bands,bumpScale:.012}),membrane:mat('#c98085',{side:THREE.DoubleSide}),inside:mat('#9c545f'),glia:mat('#8baba4',{transparent:true,opacity:.27,depthWrite:false,side:THREE.DoubleSide}),myelin:mat('#c6c9ad',{transparent:true,opacity:.58,depthWrite:false}),nucleus:mat('#594971'),vesicle:mat('#d1ad73',{bumpScale:.01}),mito:mat('#a85f48',{side:THREE.DoubleSide}),crista:mat('#e1a46e',{side:THREE.DoubleSide}),ach:mat(CORES.ach),ca:mat(CORES.ca,{emissive:CORES.ca,emissiveIntensity:.12}),sodium:mat(CORES.vm),receptor:mat('#9f9d5b'),ryr:mat('#9380b1'),reticulum:mat('#9e9c85',{side:THREE.DoubleSide}),t:mat('#5b9698',{side:THREE.DoubleSide}),pulse:mat(CORES.vm,{emissive:CORES.vm,emissiveIntensity:.7}),lipid:mat('#e8bdac'),tails:mat('#aa8174'),matrix:mat('#75565e'),lamina:mat('#beb998',{transparent:true,opacity:.5,depthWrite:false})};
 for(const tissue of ['nerve','membrane','inside','reticulum','t','myelin'])M[tissue].map=bump;
 const sphere=new THREE.SphereGeometry(1,24,16),small=new THREE.SphereGeometry(1,10,8);
 function organificar(geo,amount=.045){const a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i),r=1+amount*Math.sin(x*5+y*3)*Math.cos(z*6-y*2);a.setXYZ(i,x*r,y*r,z*r);}geo.computeVertexNormals();return geo;}
 function ell(g,pos,size,material,rough=false){const mesh=new THREE.Mesh(rough?organificar(sphere.clone()):sphere,material);mesh.position.copy(V(...pos));mesh.scale.set(...size);g.add(mesh);return mesh;}
 function tube(g,points,r,material,end=r,segments=36){
  const c=new THREE.CatmullRomCurve3(points.map(p=>V(...p))),geo=new THREE.TubeGeometry(c,segments,1,12,false),a=geo.attributes.position;
  for(let i=0;i<=segments;i++){const u=i/segments,p=c.getPointAt(u),radius=(r+(end-r)*u)*(1+.04*Math.sin(u*19));for(let j=0;j<=12;j++){const k=i*13+j;a.setXYZ(k,p.x+(a.getX(k)-p.x)*radius,p.y+(a.getY(k)-p.y)*radius,p.z+(a.getZ(k)-p.z)*radius);}}
  geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,material);g.add(mesh);return {mesh,curve:c};
 }
 function label(g,text,pos){g.userData.labels.push({text,pos:V(...pos)});}
 function group(){const g=new THREE.Group();g.userData={labels:[],particles:[],pulses:[],receptors:[],vesicles:[],floating:[],reticula:[],myofibrils:[]};return g;}
 function mito(g,pos,scale=.45){
  const organ=new THREE.Group();organ.position.copy(V(...pos));organ.scale.setScalar(scale);organ.rotation.set(.08,.18,-.24);g.add(organ);
  // marca o lugar: a página troca o conteúdo pela mitocôndria compartilhada (../mitocondria.js) quando o GLB chega
  organ.name='mitocondria';organ.userData.mitocondria=true;
  const cut=new THREE.Mesh(organificar(new THREE.SphereGeometry(1,40,26,Math.PI,Math.PI)),M.mito);cut.scale.set(1,.47,.45);organ.add(cut);
  ell(organ,[0,0,-.09],[.92,.405,.16],M.matrix,true);
  // Cristas em lâminas contínuas, contidas na matriz da mitocôndria em corte.
  for(let k=0;k<7;k++){const x=-.68+k*.22,extent=.36*Math.sqrt(1-x*x),points=[];for(let j=0;j<=12;j++){const y=-extent+2*extent*j/12;points.push([x+.035*Math.sin(j*.9+k),y,.025+.055*Math.sin(j*Math.PI/12)]);}tube(organ,points,.031,M.crista,.022,18);}
  const edge=[];for(let i=0;i<=64;i++){const a=i*Math.PI*2/64;edge.push([.97*Math.cos(a),.44*Math.sin(a),0]);}tube(organ,edge,.021,M.crista,.021,64);
 }
 function dots(g,type,n,path){for(let i=0;i<n;i++){const material=(type==='ach'?M.ach:type==='na'?M.sodium:M.ca).clone();material.transparent=true;material.depthWrite=false;const m=new THREE.Mesh(small,material),radius=type==='ach'?.053:.044;m.scale.setScalar(radius);m.visible=false;g.add(m);g.userData.particles.push({m,type,index:i,n,path,radius});}}
 function onda(g,curve,fonte='estimulos',inicio=-9,duracao=7,radius=.14){
  const marks=[];for(let i=0;i<4;i++){const material=M.pulse.clone();material.transparent=true;material.depthWrite=false;const m=new THREE.Mesh(small,material);m.scale.setScalar(radius*(1-i*.15));m.visible=false;g.add(m);marks.push(m);}g.userData.pulses.push({marks,curve,fonte,inicio,duracao,radius});
 }
 function liberar(g,index,origem,alvo,size=.09){const m=ell(g,origem,[size,size,size],M.vesicle.clone(),true);m.material.transparent=true;m.material.depthWrite=false;g.userData.vesicles.push({m,index,origem:V(...origem),alvo:V(...alvo),size});}
 function receptor(g,x,y,z,type='ach'){
  const protein=new THREE.Group();protein.position.set(x,y,z);g.add(protein);
  const count=type==='ach'?5:4;
  for(let k=0;k<count;k++){const a=k*Math.PI*2/count,r=.081;tube(protein,[[Math.cos(a)*r,-.12,Math.sin(a)*r],[Math.cos(a)*r*.78,.02,Math.sin(a)*r*.78],[Math.cos(a)*r*1.23,.14,Math.sin(a)*r*1.23]],.038,type==='ach'?M.receptor:type==='ca'?M.ca:M.sodium,.045,10);}
  g.userData.receptors.push({protein,type});return protein;
 }
 function sheet(g,offset=0,folded=false,material=M.membrane){
  const nu=144,nv=24,positions=[],uv=[],index=[];
  // Pregas de fundo arredondado, com profundidade e trajeto variáveis.
  const surface=(x,z)=>offset+(folded?-(.62+.055*Math.sin(x*1.8+z))*Math.pow((1+Math.cos((x+.035*Math.sin(z*2))*5.7))*.5,1.45):.09*Math.cos(x*1.1))+.04*Math.cos(z*2.7+x*.6);
  const edgeZ=x=>1.22*Math.sqrt(1-(x/2.8)**2)*(1+.025*Math.sin(x*2.4));
  for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const u=i/nu,v=j/nv,x=(u-.5)*5,z=(v-.5)*2*edgeZ(x);positions.push(x,surface(x,z),z);uv.push(u,v);}
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;index.push(a,a+1,b,a+1,b+1,b);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(index);geo.computeVertexNormals();g.add(new THREE.Mesh(geo,material));
  const inner=geo.clone(),p=inner.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,p.getY(i)-.06);inner.computeVertexNormals();g.add(new THREE.Mesh(inner,M.inside));
  // Os dois folhetos fosfolipídicos permanecem visíveis na borda do corte.
  for(let i=0;i<96;i++){const x=-2.48+i*4.96/95,z=edgeZ(x),slope=(surface(x+.002,z)-surface(x-.002,z))/.004,normal=V(-slope,1,0).normalize(),mid=V(x,surface(x,z)-.03,z);
   for(const sign of [-1,1]){const head=mid.clone().addScaledVector(normal,sign*.04);const h=new THREE.Mesh(small,M.lipid);h.position.copy(head);h.scale.setScalar(.022);g.add(h);const end=mid.clone().addScaledVector(normal,-sign*.014);tube(g,[head.toArray(),head.clone().lerp(end,.6).add(V(.008,0,.009)).toArray(),end.toArray()],.006,M.tails,.004,4);}
  }return surface;
 }
 const encounter=group();
 const fiber=new THREE.Mesh(new THREE.CapsuleGeometry(.87,5.9,12,60),M.muscle);fiber.rotation.z=Math.PI/2;fiber.position.y=-.94;encounter.add(fiber);
 const top=z=>-.94+Math.sqrt(Math.max(.08,.87*.87-z*z));
 // Feixes longitudinais sob o sarcolema e núcleos periféricos integrados.
 for(let i=0;i<16;i++){const a=i*Math.PI*2/16,z=Math.sin(a)*.87,y=-.94+Math.cos(a)*.87;tube(encounter,[[-2.92,y,z],[-1.4,y+.008,z],[1.5,y-.01,z],[2.94,y,z]],.01,M.membrane,.008,24);}
 for(let i=0;i<5;i++)ell(encounter,[-2.6+i*1.23,-.72,.835],[.24,.075,.068],M.nucleus,true);
 const main=tube(encounter,[[-3,2.3,-.2],[-2.4,1.7,-.15],[-1.65,1.07,-.08],[-.75,.46,-.02]],.14,M.nerve,.09);
 for(let i=0;i<4;i++){const u=.05+i*.19,points=[];for(let j=0;j<=8;j++)points.push(main.curve.getPointAt(u+j*.13/8).toArray());tube(encounter,points,.225,M.myelin,.195,20);const p=main.curve.getPointAt(u+.055);ell(encounter,[p.x+.13,p.y+.02,p.z+.13],[.055,.13,.06],M.nucleus,true);}
 for(let i=0;i<6;i++){
  const x=-1.6+i*.62,z=-.49+(i%3)*.42,y=top(z)+.105;
  const branch=tube(encounter,[[-.75,.46,-.02],[x*.6,.27,z*.6],[x-.28,y+.07,z],[x+.02,y,z]],.09,M.nerve,.058,28);onda(encounter,branch.curve,'estimulos',-2,2,.095);
  const path=[[x-.24,y,z-.035],[x-.02,y-.025,z+.075],[x+.22,y+.02,z+.06],[x+.41,y-.015,z+.12]];
  tube(encounter,path,.105,M.nerve,.073,28);
  tube(encounter,[[x,y,z],[x+.12,top(z-.19)+.1,z-.19],[x+.28,top(z-.25)+.08,z-.25]],.067,M.nerve,.045,18);
  tube(encounter,path.map(([px,py,pz])=>[px,py+.056,pz]),.145,M.glia,.095,24);
  if(i%2===0)ell(encounter,[x+.12,y+.12,z+.085],[.16,.055,.085],M.nucleus,true);
 }
 onda(encounter,main.curve);
 for(const side of [-1,1]){const path=new THREE.CatmullRomCurve3([V(-.55,top(.34)+.035,.34),V(side*1.5,top(.65)+.035,.65),V(side*3,top(.67)+.035,.67)]);onda(encounter,path,'disparos',0,9,.12);}
 label(encounter,'Axônio motor',[-2.2,1.5,0]);label(encounter,'Schwann terminal',[1.2,.25,.45]);label(encounter,'Fibra muscular',[1.65,-1.28,.83]);label(encounter,'Placa motora',[-.6,.08,.52]);
 const terminal=group();
 const shellGeo=organificar(new THREE.SphereGeometry(1,64,40,Math.PI,Math.PI),.06);
 const shell=new THREE.Mesh(shellGeo,M.membrane);shell.scale.set(2.25,1.25,1.28);shell.position.y=.6;terminal.add(shell);
 ell(terminal,[0,.57,-.22],[2.1,1.14,.19],M.inside,true);
 const rim=[];for(let i=0;i<=96;i++){const a=i*Math.PI*2/96,x=Math.cos(a),y=Math.sin(a),r=1+.06*Math.sin(x*5+y*3)*Math.cos(-y*2);rim.push([x*2.25*r,.6+y*1.25*r,.008]);}tube(terminal,rim,.032,M.lipid,.032,96);
 const inlet=tube(terminal,[[-3.05,1.4,-.4],[-2.35,1.22,-.12],[-1.8,.95,-.15]],.3,M.nerve,.35);onda(terminal,inlet.curve,'estimulos',-8,8,.29);
 ell(terminal,[.08,1.48,-.63],[1.9,.25,.78],M.glia,true);ell(terminal,[.84,1.59,-.46],[.27,.12,.18],M.nucleus,true);
 sheet(terminal,-1.05,true,M.membrane);
 for(let i=0;i<48;i++){const a=i*2.3999,r=.25+1.48*Math.sqrt((i+.5)/48),x=Math.cos(a)*r,y=-.18+(i%5)*.18,z=.05+(Math.sin(a)+1)*.21,size=.085+.032*(.5+.5*Math.sin(i*7)),m=ell(terminal,[x,y,z],[size,size*.96,size],M.vesicle,true);terminal.userData.floating.push({m,index:i,origem:V(x,y,z)});}
 for(let i=0;i<7;i++){const x=-1.55+i*.51,y=.6-1.25*Math.sqrt(1-(x/2.25)**2);receptor(terminal,x,y,.02,'ca');liberar(terminal,i,[x,y+.31,.12],[x,y+.035,.12],.08);tube(terminal,[[x-.1,y+.045,.11],[x,y+.055,.15],[x+.1,y+.035,.11]],.021,M.receptor,.018,10);}
 mito(terminal,[-.86,.98,.19],.65);mito(terminal,[.88,.89,.12],.49);
 for(let i=0;i<7;i++){const x=-1.6+i*.52;tube(terminal,[[x,-.82,-.35],[x+.14,-.85,.15],[x-.07,-.8,.66]],.012,M.lamina,.01,14);}
 dots(terminal,'ach',96,(u,i)=>{const x=-1.55+(i%7)*.51,y=.6-1.25*Math.sqrt(1-(x/2.25)**2);return V(...trajetoFluido([x,y-.025,.14],[x+.15*Math.sin(i),-1.025,.52+.12*Math.cos(i)],u,i,.09));});
 dots(terminal,'preca',48,(u,i)=>{const x=-1.55+(i%7)*.51,y=.6-1.25*Math.sqrt(1-(x/2.25)**2);return V(...trajetoFluido([x,y-.16,.13],[x*.86,y+.35,.24],u,i,.05));});
 label(terminal,'Vesículas de ACh',[-.5,.4,.6]);label(terminal,'Mitocôndria',[-.95,1.08,.38]);label(terminal,'Ca²⁺ do terminal',[1.25,-.43,.4]);label(terminal,'Zona ativa',[0,-.58,.45]);label(terminal,'Membrana muscular',[1,-1.46,1.1]);
 const cleft=group();
 const surface=sheet(cleft,-.62,true);sheet(cleft,.42,false,M.nerve);
 const cleftSignal=new THREE.CatmullRomCurve3([V(-2.4,.52,-.42),V(0,.56,-.42),V(2.4,.5,-.42)]);onda(cleft,cleftSignal,'estimulos',-4,4,.09);
 const cristas=[-3*Math.PI/5.7,-Math.PI/5.7,Math.PI/5.7,3*Math.PI/5.7];
 for(const x of cristas)for(const z of [-.34,.53])receptor(cleft,x,surface(x,z)+.01,z);
 for(let i=-2;i<=2;i++){const x=i*2*Math.PI/5.7;receptor(cleft,x,surface(x,.08)+.035,.08,'na');}
 for(let i=0;i<8;i++){const x=-2+i*.55;liberar(cleft,i,[x,.73,.25],[x,.48+.09*Math.cos(x*1.1),.25],.105);
  tube(cleft,[[x,-.43,-.47],[x+.02,-.33,-.43],[x+.01,-.22,-.4]],.016,M.lamina,.016,9);
  for(const s of [-1,1])ell(cleft,[x+s*.065,-.19,-.4],[.075,.04,.05],M.reticulum,true);
 }
 for(let i=0;i<11;i++){const x=-2.35+i*.47;tube(cleft,[[x-.09,-.38,-1.05],[x+.04,-.39,-.45],[x-.07,-.36,.4],[x+.08,-.39,1.04]],.01,M.lamina,.009,20);}
 dots(cleft,'ach',96,(u,i)=>{const x=-2+(i%8)*.55,target=cristas[i%4],z=i%2?.53:-.34;return V(...trajetoFluido([x,.39+.09*Math.cos(x*1.1),.25],[target,surface(target,z)+.16,z],u,i,.08));});
 dots(cleft,'na',48,(u,i)=>{const x=(i%5-2)*2*Math.PI/5.7,y=surface(x,.08);return V(...trajetoFluido([x,y+.16,.08],[x+.08*Math.sin(i),y-.28,.09],u,i,.035));});
 label(cleft,'Membrana do terminal',[-1.2,.57,.9]);label(cleft,'Acetilcolina',[1.6,-.08,.6]);label(cleft,'Receptor nicotínico',[.52,-.55,.63]);label(cleft,'Pregas do sarcolema',[-1.3,-1.05,1.1]);label(cleft,'Acetilcolinesterase',[1.6,-.16,-.4]);
 const triad=group();const reticula={};for(const s of [-1,1]){const network=new THREE.Group();triad.add(network);reticula[s]=network;triad.userData.reticula.push({network,s});}
 const tCurve=tube(triad,[[-2.8,.61,0],[-1.4,.51,.01],[0,.5,-.02],[1.5,.54,.01],[2.8,.64,0]],.22,M.t,.23);
 tube(triad,[[-2.78,.61,0],[-3.01,1.02,-.06],[-2.98,1.58,-.16]],.22,M.t,.24);
 for(const s of [-1,1]){
  const cisterna=tube(triad,[[-2.55,.52,s*.68],[-1.3,.52,s*.7],[.1,.52,s*.71],[1.4,.55,s*.7],[2.55,.52,s*.68]],.34,M.reticulum,.3);
  const cp=cisterna.mesh.geometry.attributes.position;
  for(let k=0;k<cp.count;k++){const x=cp.getX(k),ripple=1+.14*Math.sin(x*4.3)+.03*Math.cos(x*9);cp.setY(k,.52+(cp.getY(k)-.52)*.77*ripple);cp.setZ(k,s*.7+(cp.getZ(k)-s*.7)*1.03*ripple);}cisterna.mesh.geometry.computeVertexNormals();
  ell(triad,[-2.55,.52,s*.68],[.29,.25,.32],M.reticulum,true);ell(triad,[2.55,.52,s*.68],[.26,.22,.3],M.reticulum,true);
  for(let i=0;i<7;i++){const x=-2.17+i*.72;tube(triad,[[x,.52,s*.2],[x,.52,s*.3],[x,.52,s*.39]],.055,M.ryr,.055,10);ell(triad,[x,.52,s*.4],[.13,.1,.075],M.ryr,true);}
 }
 // O túbulo T cruza o eixo longitudinal das miofibrilas. A rede do retículo
 // conecta as cisternas e acompanha os feixes.
 for(const x of [-1.65,0,1.65]){
  const fascicle=new THREE.Group();triad.add(fascicle);triad.userData.myofibrils.push(fascicle);
  const m=new THREE.Mesh(new THREE.CylinderGeometry(.51,.51,3.65,40,1),M.muscle);m.rotation.x=Math.PI/2;m.position.set(x,-.48,0);fascicle.add(m);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,cx=x+.57*Math.cos(a),cy=-.48+.57*Math.sin(a);
   for(const s of [-1,1])tube(reticula[s],[[x+.18*Math.cos(a),.33,s*.88],[cx,cy,s*1.12],[cx+.035,cy-.02,s*1.8]],.035,M.reticulum,.028,18);
  }
  for(const s of [-1,1]){const points=[];for(let i=0;i<=36;i++){const a=i*Math.PI*2/36;points.push([x+.57*Math.cos(a),-.48+.57*Math.sin(a),s*1.52+.035*Math.sin(a*3)]);}tube(reticula[s],points,.03,M.reticulum,.03,36);}
  for(let i=0;i<19;i++){const a=i*2.4,r=.44*Math.sqrt((i+.5)/19);ell(fascicle,[x+Math.cos(a)*r,-.48+Math.sin(a)*r,1.832],[.055,.055,.018],M.inside);}
 }
 dots(triad,'ca',160,(u,i)=>{const x=-2.17+(i%7)*.72,s=i%2?1:-1,origin=[x,.4,s*.52],target=[Math.max(-2.13,Math.min(2.13,x)), -.35-.33*(.5+.5*Math.sin(i)),s*(.9+.35*Math.cos(i))];const f=u<.7?suave(u/.7):1-suave((u-.7)/.3);return V(...trajetoFluido(origin,target,f,i,.055));});
 onda(triad,tCurve.curve,'disparos',.15,7,.23);
 label(triad,'Túbulo T',[-2.98,1.48,-.12]);label(triad,'Cisterna terminal',[1.4,.8,.8]);label(triad,'DHPR → RyR1',[-.74,.55,.36]);label(triad,'Retículo sarcoplasmático',[1.92,-.45,1.52]);label(triad,'Miofibrilas',[.5,-.9,1.8]);
 const sarcomere=group();let approved=null,loading=null;
 async function prepararSarcomero(canvasFactory){
  if(approved)return approved;if(loading)return loading;
  loading=import('../musculo-sarcomero/modelos.js?v=musculo-anatomico-20261003').then(({criar:original})=>{
   const all=original(canvasFactory);approved={model:all.modelos[4],aplicar:all.aplicarComprimento};sarcomere.add(approved.model);
   // Geometrias descartadas pertencem aos quatro modelos não utilizados. Materiais
   // e texturas compartilhados permanecem vivos para o sarcômero aprovado.
   const used=new Set();approved.model.traverse(o=>{if(o.geometry)used.add(o.geometry);});
   for(const m of all.modelos.slice(0,4))m.traverse(o=>{if(o.geometry&&!used.has(o.geometry))o.geometry.dispose();});
   label(sarcomere,'Disco Z',[-1.2,.45,0]);label(sarcomere,'Actina',[-.57,.17,.32]);label(sarcomere,'Miosina',[.35,-.27,.22]);label(sarcomere,'Troponina',[.58,.28,.2]);
   return approved;
  }).catch(e=>{loading=null;throw e;});return loading;
 }
 const modelos=[encounter,terminal,cleft,triad,sarcomere];
 function atualizar(indice,a,t,sim){
  const g=modelos[indice],visual=estadoVisual(sim,t);
  for(const {m,index,origem}of g.userData.floating)m.position.copy(origem).add(V(Math.sin(t*.021+index)*.025,Math.sin(t*.016+index*2)*.025,Math.cos(t*.025+index)*.022));
  for(const {m,type,index,n,path,radius}of g.userData.particles){
   const p=particulaVisual(type,index,n,t,sim);m.visible=Boolean(p&&p.fade>.002);
   if(m.visible){m.position.copy(path(p.u,p.local));m.scale.setScalar(radius*(.7+.3*p.fade));m.material.opacity=.88*p.fade;}
  }
  for(const {marks,curve,fonte,inicio,duracao,radius}of g.userData.pulses){
   const u=impulsoVisual(sim[fonte],t,inicio,duracao);
   marks.forEach((m,i)=>{const p=u===null?-1:u-i*.055;m.visible=p>=0&&p<=1;if(m.visible){m.position.copy(curve.getPointAt(p));m.material.opacity=(1-i*.18)*Math.min(1,p*16,(1-p)*16);m.scale.setScalar(radius*(1-i*.15));}});
  }
  for(const {m,index,origem,alvo,size}of g.userData.vesicles){
   const state=vesiculaVisual(index,t,sim);m.visible=!state||state.fade>.002;
   if(state){m.position.lerpVectors(origem,alvo,suave(state.u/.25));m.scale.set(size*(1+.2*state.fusao),size*(1-.75*state.fusao),size*(1+.2*state.fusao));m.material.opacity=state.fade;}
   else{m.position.copy(origem).add(V(Math.sin(t*.019+index)*.012,Math.sin(t*.024+index*2)*.012,Math.cos(t*.016+index)*.012));m.scale.setScalar(size);m.material.opacity=1;}
  }
  const totalReceptors=g.userData.receptors.filter(r=>r.type==='ach').length;let receptorIndex=0;
  for(const {protein,type}of g.userData.receptors){
   protein.visible=type!=='ach'||(++receptorIndex-.5)/totalReceptors<=sim.p.receptores;
   protein.scale.x=1+(type==='ach'?visual.ach*sim.p.receptores:type==='ca'?visual.preca:visual.vm>-65?1:0)*.12;protein.scale.z=protein.scale.x;
  }
  const length=comprimentoVisual(visual.ativacao);
  if(indice===3){const fit=encaixeTriade(visual.ativacao);for(const fiber of g.userData.myofibrils)fiber.scale.z=fit.fibra;for(const {network,s}of g.userData.reticula){network.scale.z=fit.reticulo;network.position.z=s*fit.deslocamento;}g.userData.labels[3].pos.z=1.52*fit.reticulo+fit.deslocamento;g.userData.labels[4].pos.z=1.8*fit.fibra;}
  if(indice===4&&approved){approved.aplicar(approved.model,length);const shift=(2.4-length)/2;g.userData.labels[0].pos.x=-length/2;g.userData.labels[1].pos.x=-.57+shift;g.userData.labels[3].pos.x=.58-shift;}
 }
 return {modelos,prepararSarcomero,atualizar};
}
