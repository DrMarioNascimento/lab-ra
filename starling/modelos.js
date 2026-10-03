import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
// Geometria independente da física. A aplicação fornece o sinal dos fluxos.
export const FORA = new THREE.Color('#f4ac68');
export const DENTRO = new THREE.Color('#76b9ee');
const phys = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
  color, roughness: .47, metalness: 0, sheen: .35, sheenRoughness: .65, ...extra,
});
const M = {
  arterial: phys('#bc4456'), venoso: phys('#8566a7'), capilar: phys('#d87588'),
  parede: phys('#dba0ab', { transparent: true, opacity: .67, depthWrite: false, side: THREE.DoubleSide }),
  nucleo: phys('#744471'), hemacia: phys('#b62649', { roughness: .36 }),
  glicocalix: phys('#71d7ce', { roughness: .58 }), basal: phys('#c3b4dd', { transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false }),
  albumina: phys('#e8bd6b'), agua: phys('#83d8ff', { transparent: true, opacity: .8, roughness: .16 }),
  fibra: phys('#aaa0ad', { transparent: true, opacity: .32, depthWrite: false }),
  celula: phys('#af8eae', { transparent: true, opacity: .45, depthWrite: false }),
  pericito: phys('#b897b9'), linfa: phys('#5fb7a0', { transparent: true, opacity: .6, depthWrite: false, side: THREE.DoubleSide }),
  setaFora: phys('#f4ac68'), setaDentro: phys('#76b9ee'),
};
const v = (x,y,z) => new THREE.Vector3(x,y,z);
let seed = 19;
const rnd = () => { seed = (Math.imul(seed,1664525) + 1013904223) >>> 0; return seed / 4294967296; };
function esfera(r = 1) { return new THREE.SphereGeometry(r, 20, 12); }
function organico(r, along = 1) {
  const geo = esfera(r), p = geo.attributes.position;
  for (let i=0;i<p.count;i++) {
    const x=p.getX(i), y=p.getY(i), z=p.getZ(i);
    const f=1+.045*Math.sin(x*2.1+y*1.7)*Math.cos(z*2.4);
    p.setXYZ(i,x*f*along,y*f,z*f);
  }
  geo.computeVertexNormals(); return geo;
}
function mesh(geo, mat, pos = [0,0,0], scale = [1,1,1]) {
  const o=new THREE.Mesh(geo, mat); o.position.set(...pos); o.scale.set(...scale); return o;
}
function curva(pts) { return new THREE.CatmullRomCurve3(pts.map(p=>Array.isArray(p)?v(...p):p)); }
function tubo(path, radius, segments=48, sides=10, endRadius=radius) {
  const geo = new THREE.TubeGeometry(path, segments, radius, sides, false);
  if (endRadius !== radius) {
    const p=geo.attributes.position;
    for(let i=0;i<=segments;i++) {
      const c=path.getPointAt(i/segments), f=1+(endRadius/radius-1)*(i/segments);
      for(let j=0;j<=sides;j++) {
        const k=i*(sides+1)+j;
        p.setXYZ(k,c.x+(p.getX(k)-c.x)*f,c.y+(p.getY(k)-c.y)*f,c.z+(p.getZ(k)-c.z)*f);
      }
    }
    geo.computeVertexNormals();
  }
  return geo;
}
function fibras(group, length=62, width=19) {
  const geos=[];
  for(let i=0;i<17;i++) {
    const y=(rnd()-.5)*width*2, z=-8-rnd()*7, pts=[];
    const tilt=(rnd()-.5)*width*.85, start=(rnd()-.5)*length*.2, span=length*(.5+rnd()*.5);
    for(let k=0;k<7;k++) pts.push(v(start-span/2+k*span/6,y+tilt*(k/6-.5)+Math.sin(k*.85+i)*3,z+Math.sin(k*1.3+i)*2.2));
    geos.push(tubo(curva(pts),.1+rnd()*.13,30,5));
  }
  group.add(mesh(mergeGeometries(geos), M.fibra));
}
function fibroblasto(group, x,y,z) {
  const g=new THREE.Group(); g.position.set(x,y,z);
  g.add(mesh(organico(2.1),M.celula,[0,0,0],[2.6,.6,1.1]));
  g.add(mesh(organico(.9),M.nucleo,[0,0,.3],[1.5,.55,.8]));
  for(let i=0;i<5;i++) {
    const a=i*1.31;
    g.add(mesh(tubo(curva([[0,0,0],[Math.cos(a)*4,Math.sin(a)*2,-.3],[Math.cos(a)*8,Math.sin(a)*3,-1]]),.38,18,6,.08),M.celula));
  }
  group.add(g);
}
function hemaciaGeo() {
  const pts=[];
  for(let i=0;i<=40;i++) {
    const a=Math.PI*i/40, r=3.15*Math.sin(a), rr=Math.sin(a);
    const h=.65*Math.cos(a)*(.26+1.3*rr*rr);
    pts.push(new THREE.Vector2(r,h));
  }
  const geo=new THREE.LatheGeometry(pts,28); geo.rotateZ(Math.PI/2); return geo;
}
const HEM=hemaciaGeo(), DROP=esfera(.43), PROT=organico(.58);
function proteina() {
  const g=new THREE.Group();
  g.add(mesh(PROT,M.albumina,[0,0,0],[1.8,.8,1]));
  g.add(mesh(PROT,M.albumina,[.6,.3,.1],[.8,.6,.7]));
  return g;
}
function corteParede(length, radius=4.4, start=.12, extent=Math.PI*1.47) {
  // Abertura longitudinal anterior: expõe luz, parede e revestimento.
  const geos=[];
  const tiles=6;
  for(let tile=0;tile<tiles;tile++) {
    const geo=new THREE.CylinderGeometry(radius,radius,length/tiles-.12,44,5,true,start,extent);
    geo.rotateZ(-Math.PI/2); geo.translate(-length/2+(tile+.5)*length/tiles,0,0);
    const p=geo.attributes.position;
    for(let i=0;i<p.count;i++) {
      const x=p.getX(i), y=p.getY(i), z=p.getZ(i);
      const f=1+.018*Math.sin(x*1.4+Math.atan2(y,z)*3);
      p.setXYZ(i,x,y*f,z*f);
    }
    geo.computeVertexNormals(); geos.push(geo);
  }
  return mergeGeometries(geos);
}
function capilar(length=62, radius=4.4) {
  const g=new THREE.Group();
  g.add(mesh(corteParede(length,radius),M.parede));
  g.add(mesh(corteParede(length,radius+.28),M.basal));
  for(let i=0;i<6;i++) {
    const x=-length/2+(i+.5)*length/6, angle=.6+(i%3)*1.3;
    const n=mesh(organico(1),M.nucleo,[x,Math.cos(angle)*(radius+.2),Math.sin(angle)*(radius+.2)],[2.1,.48,.95]);
    n.rotation.x=angle; g.add(n);
  }
  const brush=[];
  for(let i=0;i<210;i++) {
    const x=(rnd()-.5)*length, a=.2+rnd()*Math.PI*1.43;
    const r=radius-.22, p=v(x,Math.cos(a)*r,Math.sin(a)*r);
    const q=v(x+.15,Math.cos(a)*(r-.7),Math.sin(a)*(r-.7));
    brush.push(tubo(curva([p,p.clone().lerp(q,.6).add(v(.08,.05,.03)),q]),.07,5,4));
  }
  g.add(mesh(mergeGeometries(brush),M.glicocalix));
  const per=new THREE.Group();
  per.add(mesh(organico(1.25),M.pericito,[6,-radius-1,-1],[3,.58,1]));
  for(let i=0;i<5;i++) {
    const x=6+(i-2)*3.5, pts=[];
    for(let k=0;k<=8;k++) {
      const a=3.5+k*.38;
      pts.push(v(x+Math.sin(k*.5)*1.2,Math.cos(a)*(radius+.75),Math.sin(a)*(radius+.75)));
    }
    per.add(mesh(tubo(curva(pts),.24,24,6,.10),M.pericito));
  }
  g.add(per); return g;
}
function linfatico(g, motion, scale=1) {
  const pts=[[-19,-14,-2],[-12,-15,-3],[2,-17,-4],[18,-17,-5],[30,-14,-6]];
  const path=curva(pts.map(p=>p.map(n=>n*scale)));
  g.add(mesh(tubo(path,2.6*scale),M.linfa));
  g.add(mesh(organico(2.6*scale),M.linfa,pts[0].map(n=>n*scale),[1.1,1,1]));
  // Sobreposição endotelial: abas de entrada do linfático inicial.
  for(let i=0;i<6;i++) {
    const p=path.getPointAt(.12+i*.12);
    const flap=mesh(new THREE.SphereGeometry(1.4*scale,16,8,0,Math.PI),M.linfa,[p.x,p.y+2.2*scale,p.z+.7*scale],[1,.3,1]);
    g.add(flap);
    g.add(mesh(tubo(curva([p.clone().add(v(0,2.4*scale,0)),p.clone().add(v(1,5*scale,-1)),p.clone().add(v(3,7*scale,-3))]),.1*scale,12,4),M.fibra));
  }
  for(let i=0;i<9;i++) { const o=mesh(DROP,M.agua); g.add(o); motion.lymph.push({o,path,offset:i/9}); }
}
function rede(motion) {
  const g=new THREE.Group(); fibras(g,112,28);
  [[-22,17,-14],[14,-11,-16],[35,18,-15]].forEach(p=>fibroblasto(g,...p));
  const left=curva([[-56,12,0],[-38,10,1],[-24,5,0],[-16,-4,-1]]);
  const right=curva([[17,-4,0],[29,7,-1],[42,10,1],[57,13,0]]);
  g.add(mesh(tubo(left,3.5,55,12,1.9),M.arterial));
  g.add(mesh(tubo(right,2.2,55,12,4.2),M.venoso));
  const paths=[];
  for(let i=0;i<5;i++) {
    const a=left.getPointAt(.32+i*.17), b=right.getPointAt(i*.15);
    const y=-22+i*10, z=(i%2?2:-3);
    const path=curva([a,[-24,y*.65,z],[-9,y+Math.sin(i)*2,z+1],[8,y,z],[20,y*.7,z],b]);
    g.add(mesh(tubo(path,.88,64,10),M.capilar)); paths.push(path);
    [a,b].forEach(p=>g.add(mesh(esfera(1.2),M.capilar,[p.x,p.y,p.z])));
  }
  for(let i=0;i<4;i++) {
    const a=paths[i].getPointAt(.36+(i%2)*.14), b=paths[i+1].getPointAt(.5);
    g.add(mesh(tubo(curva([a,a.clone().lerp(b,.5).add(v(2,0,-1)),b]),.65,20,8),M.capilar));
  }
  for(const path of paths) for(let i=0;i<5;i++) {
    const o=mesh(esfera(.58),M.hemacia); g.add(o); motion.blood.push({o,path,offset:i/5,scale:1});
  }
  linfatico(g,motion,1.2);
  g.userData.rotulos=[
    {nome:'Arteríola',p:[-45,12,0],cor:'arterial'},
    {nome:'Rede capilar',p:[0,22,0],cor:'arterial'},
    {nome:'Linfático',p:[9,-21,-5],cor:'linfa'},
    {nome:'Vênula',p:[44,11,0],cor:'venoso'},
  ]; return g;
}
function seta() {
  const g=new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.16,.16,1,10),M.setaFora));
  const tip=mesh(new THREE.ConeGeometry(.62,1.3,16),M.setaFora); g.add(tip);
  return g;
}
function closeup(n,motion) {
  const g=new THREE.Group(), L=n===2?44:62;
  fibras(g,L+10,9); fibroblasto(g,-12,13,-12);
  g.add(capilar(L));
  const path=curva([[-L/2,0,0],[0,.2,0],[L/2,0,0]]);
  for(let i=0;i<7;i++) {
    const o=mesh(HEM,M.hemacia); o.rotation.y=(i%2-.5)*.2; g.add(o);
    motion.blood.push({o,path,offset:i/7,scale:1});
  }
  for(let i=0;i<22;i++) {
    const o=proteina(); g.add(o); motion.protein.push({o,L,u:rnd(),a:rnd()*6.28,r:1.7+rnd()*1.2});
  }
  for(let i=0;i<50;i++) {
    const o=mesh(DROP,M.agua); g.add(o); motion.water.push({o,L,u:rnd(),a:rnd()*6.28,offset:rnd(),park:rnd()});
  }
  if(n===2) for(const u of [.22,.78]) {
    for(const [i,key] of ['pc','pi','oncPlasma','oncExterna'].entries()) {
      const o=seta(); g.add(o); motion.arrows.push({o,u,key,x:(u-.5)*L+(i-1.5)*2.3,side:i<2?1:-1});
    }
  }
  if(n===4) {
    const gel=mesh(organico(1),phys('#83afbb',{transparent:true,opacity:.09,depthWrite:false}),[0,-1,-4],[L*.52,16,10]);
    g.add(gel); motion.gel=gel; linfatico(g,motion);
  }
  g.userData.rotulos=[
    {nome:'Hemácia',p:[-18,0,3],cor:'arterial'},
    {nome:'Endotélio',p:[18,4.7,1],cor:'parede'},
    {nome:'Glicocálix',p:[2,3.5,3],cor:'glicocalix'},
    {nome:n===4?'Linfa':'Interstício',p:n===4?[12,-15,0]:[-6,13,-12],cor:n===4?'linfa':'tecido'},
  ]; return g;
}
function barreira(motion) {
  const g=new THREE.Group(), geos=[], basal=[], brushes=[];
  const surface=(x,z)=>.006*x*x+.014*z*z+.28*Math.sin(x*.22)*Math.cos(z*.53);
  // Campo curvo: quatro células, fendas estreitas, membrana basal e escova.
  for(let cell=0;cell<4;cell++) {
    const geo=new THREE.PlaneGeometry(9.7,24,20,24), p=geo.attributes.position;
    for(let i=0;i<p.count;i++) {
      const xx=p.getX(i), z=p.getY(i), mix=(xx+4.85)/9.7;
      const edgeA=.8*Math.sin(z*.42+cell*1.3), edgeB=.8*Math.sin(z*.42+(cell+1)*1.3);
      const x=xx+(cell-1.5)*10+edgeA*(1-mix)+edgeB*mix;
      const y=surface(x,z);
      p.setXYZ(i,x,y,z);
    }
    geo.computeVertexNormals(); geos.push(geo);
    const b=geo.clone(); b.translate(0,-.65,0); basal.push(b);
    g.add(mesh(organico(1.4),M.nucleo,[(cell-1.5)*10,1.3,3],[2.4,.45,1.25]));
  }
  g.add(mesh(mergeGeometries(geos),M.parede)); g.add(mesh(mergeGeometries(basal),M.basal));
  for(let i=0;i<460;i++) {
    const x=(rnd()-.5)*38, z=(rnd()-.5)*23, y=surface(x,z);
    const tip=v(x+Math.sin(i)*.55,y+1.2+rnd()*2.1,z+.3*Math.cos(i*.7));
    brushes.push(tubo(curva([[x,y+.12,z],[x-.3*Math.cos(i),y+.9,z-.25*Math.sin(i)],tip]),.085,7,5));
    if(i%4===0) brushes.push(tubo(curva([[x,y+1.3,z],tip.clone().add(v(-.5,-.2,.4))]),.065,4,4));
  }
  g.add(mesh(mergeGeometries(brushes),M.glicocalix));
  for(let i=0;i<18;i++) {
    const o=proteina(); o.scale.setScalar(1.5); o.position.set((rnd()-.5)*34,5+rnd()*4,(rnd()-.5)*20); g.add(o);
    motion.fixedProtein.push({o,y:o.position.y,leak:i/18});
  }
  for(let i=0;i<35;i++) {
    const z=(rnd()-.5)*18, boundary=i%3;
    const x=-10+boundary*10+.8*Math.sin(z*.42+(boundary+1)*1.3);
    const o=mesh(DROP,M.agua,[0,0,0],[.33,.33,.33]); g.add(o);
    motion.crossing.push({o,x,z,offset:rnd()});
  }
  fibras(g,45,8);
  g.userData.rotulos=[
    {nome:'Plasma · proteínas',p:[-12,7,0],cor:'albumina'},
    {nome:'Glicocálix',p:[10,3.5,6],cor:'glicocalix'},
    {nome:'Endotélio',p:[-15,.3,8],cor:'parede'},
    {nome:'Interstício',p:[10,-6,0],cor:'tecido'},
  ]; return g;
}
export function criar() {
  seed=19;
  const motions=[], modelos=[];
  for(let i=0;i<5;i++) {
    const d={blood:[],protein:[],water:[],arrows:[],lymph:[],crossing:[],fixedProtein:[]}; motions.push(d);
    const g=i===0?rede(d):i===3?barreira(d):closeup(i,d);
    g.name='Starling-nivel-'+(i+1); g.visible=i===0; modelos.push(g);
  }
  function animar(t, liquidaEm, {encharcado=0,semLinfa=false,nivel=0,sigma=1,oncPlasma=25,kf=.02}={}) {
    const d=motions[nivel];
    for(const {o,path,offset} of d.blood) {
      const u=(t*.07+offset)%1; o.position.copy(path.getPointAt(u));
      // Disco eritrocitário perpendicular à direção do fluxo.
      if(nivel!==0) o.quaternion.setFromUnitVectors(v(1,0,0),path.getTangentAt(u));
    }
    for(const [i,{o,L,u,a,r}] of d.protein.entries()) {
      o.visible=i<Math.round(d.protein.length*oncPlasma/34);
      o.position.set(((u+t*.026)%1-.5)*L,Math.cos(a)*r,Math.sin(a)*r); o.rotation.x=t*.16+a;
    }
    for(const {o,L,u,a,offset,park} of d.water) {
      const p=liquidaEm(u), speed=(.12+Math.min(Math.abs(p),40)*.008)*kf/.02;
      const q=(t*speed+offset)%1;
      const retained=park<encharcado;
      const r=retained?7+park*14*(1+encharcado*.3):p>=0?4+q*10:14-q*10;
      o.visible=retained||Math.abs(p)>.08;
      o.position.set((u-.5)*L,Math.cos(a)*r,Math.sin(a)*r);
    }
    for(const {o,path,offset} of d.lymph) {
      o.visible=!semLinfa; const q=(t*.13+offset)%1; o.position.copy(path.getPointAt(q));
    }
    for(const {o,x,z,offset} of d.crossing) {
      const p=liquidaEm((x+16)/32), q=(t*(.2+Math.min(Math.abs(p),40)*.006)*kf/.02+offset)%1;
      const y=p>=0?9-q*17:-8+q*17;
      o.visible=Math.abs(p)>.08; o.position.set(x,y+.006*x*x+.014*z*z,z);
    }
    for(const [i,{o,y,leak}] of d.fixedProtein.entries()) {
      o.visible=i<Math.round(d.fixedProtein.length*oncPlasma/34);
      o.position.y=leak>sigma?y-((t*.08+leak)%1)*15:y+Math.sin(t*.2+y)*.18;
      o.rotation.y=t*.05;
    }
    if(d.gel) {
      const e=1+encharcado*.32; d.gel.scale.y=16*e; d.gel.scale.z=10*e;
      d.gel.material.opacity=.09+encharcado*.14;
      d.gel.material.color.set('#83afbb').lerp(new THREE.Color('#5aaad9'),encharcado);
    }
  }
  function aplicarForcas(nivel,e,pressaoCapilarEm,oncExternaEm) {
    for(const {o,u,key,x,side} of motions[nivel].arrows) {
      const values={pc:pressaoCapilarEm(u,e),pi:-e.pi,oncPlasma:-e.sigma*e.oncPlasma,oncExterna:e.sigma*oncExternaEm(e)};
      const p=values[key], length=Math.abs(p)*.19;
      o.visible=Math.abs(p)>.05;
      const outward=p>=0, dir=side*(outward?1:-1);
      o.position.set(x,side*(outward?5:5+length),4.5);
      o.rotation.z=dir>0?0:Math.PI;
      const shaft=o.children[0],tip=o.children[1],mat=outward?M.setaFora:M.setaDentro;
      shaft.material=tip.material=mat;
      const head=Math.min(1.3,length*.6);
      shaft.scale.y=Math.max(.001,length-head); shaft.position.y=(length-head)/2;
      tip.scale.set(head/1.3,head/1.3,head/1.3);
      tip.position.y=length-head/2;
    }
  }
  return {modelos,animar,aplicarForcas};
}
