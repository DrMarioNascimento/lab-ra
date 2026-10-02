import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const ALTURA=.28; // 14 cm: coração com os cotos dos grandes vasos.
let carregamento;
const protecoes=new WeakMap();
export function carregarCoracaoAnatomico() {
  return carregamento??=new GLTFLoader().loadAsync(new URL('../bancadas/11-coracao/fontes/scan/A-scan-realista.glb',import.meta.url).href).then(({scene})=>{
    scene.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(scene),c=bb.getCenter(V()),k=ALTURA/bb.getSize(V()).y;
    const g=new THREE.Group();
    scene.traverse(o=>{
      if(!o.isMesh)return;
      const geo=o.geometry.clone().applyMatrix4(o.matrixWorld).translate(-c.x,-c.y,-c.z).scale(k,k,k);
      const mat=o.material.clone();mat.roughnessMap=null;mat.metalness=0;mat.roughness=.55;
      mat.emissive=new THREE.Color('#682a2a');mat.emissiveIntensity=.12;mat.userData={};
      const m=new THREE.Mesh(geo,mat);m.name='coracao_scan_realista';g.add(m);
    });
    return g;
  });
}
export function instalarCoracao(scan,posicao,materialFallback) {
  const g=new THREE.Group();g.name='coracao';g.position.copy(posicao);g.rotation.z=.15;
  if(scan)scan.children.forEach(o=>{const m=o.clone();m.geometry=o.geometry.clone();m.material=o.material.clone();g.add(m)});
  else {const m=new THREE.Mesh(new THREE.SphereGeometry(.07,32,24),materialFallback.clone());m.scale.set(.95,1.15,.85);g.add(m)}
  g.updateMatrixWorld(true);
  // Coordenadas dos cotos no scan normalizado; +X é o lado esquerdo do paciente.
  const locais={superior:V(-.052,.118,-.009),inferior:V(-.065,-.020,-.035),aorta:V(.067,.091,-.061)};
  g.userData.ligacoes=Object.fromEntries(Object.entries(locais).map(([n,p])=>[n,p.clone().applyMatrix4(g.matrixWorld)]));
  const bases=g.children.map(m=>({m,base:m.geometry.attributes.position.array.slice()}));
  g.userData.animar=beat=>{
    for(const {m,base} of bases){const p=m.geometry.attributes.position;
      for(let i=0;i<p.count;i++){const x=base[i*3],y=base[i*3+1],z=base[i*3+2],t=THREE.MathUtils.clamp((.045-y)/.15,0,1);
        const d=Math.min(...Object.values(locais).map(a=>Math.hypot(x-a.x,y-a.y,z-a.z))),a=THREE.MathUtils.clamp((d-.03)/.025,0,1),w=t*t*(3-2*t)*a*a*(3-2*a);
        p.setXYZ(i,x*(1-.045*beat*w),y+.004*beat*w,z*(1-.045*beat*w));
      }
      p.needsUpdate=true;m.geometry.computeVertexNormals();m.material.emissiveIntensity=.12+.04*beat;
    }
  };
  return g;
}
class CurvaLigada extends THREE.Curve {
  constructor(original,local,corte,inicio){super();this.original=original;this.local=local;this.corte=corte;this.inicio=inicio}
  getPoint(t,target=V()) {
    if(this.inicio)return t>=this.corte?this.original.getPoint(t,target):this.local.getPoint(t/this.corte,target);
    return t<=this.corte?this.original.getPoint(t,target):this.local.getPoint((t-this.corte)/(1-this.corte),target);
  }
  calibreNoPonto(t) {
    if(this.raioNaPonta===undefined)return 1;
    const f=THREE.MathUtils.clamp(this.inicio?1-t/this.corte:(t-this.corte)/(1-this.corte),0,1);
    return 1+(this.raioNaPonta-1)*f*f*(3-2*f);
  }
}
export function ligarVaso(original,ponta,alturaLimite,inicio=false,direcao=V(0,1,0)) {
  // Busca somente a transição torácica. Fora dela a curva original é devolvida literalmente.
  let corte=inicio?1:0;
  const sobe=!inicio&&original.getPoint(0).y<original.getPoint(1).y;
  for(let i=0;i<=2048;i++){const t=i/2048,y=original.getPoint(t).y;
    if(inicio){if(y<alturaLimite){corte=t;break}}
    else if(y>alturaLimite){corte=t;if(sobe)break}
  }
  const junta=original.getPoint(corte),tan=original.getTangent(corte),dist=junta.distanceTo(ponta);
  const local=inicio?
    new THREE.CubicBezierCurve3(ponta,ponta.clone().addScaledVector(direcao,dist*.30),junta.clone().addScaledVector(tan,-dist*corte*.25),junta):
    new THREE.CubicBezierCurve3(junta,junta.clone().addScaledVector(tan,dist*.28),ponta.clone().addScaledVector(direcao,-dist*.22),ponta);
  return new CurvaLigada(original,local,corte,inicio);
}
export function ajustarTrechoCardiaco(mesh,original,ligada,segmentos,radiais,inicio=false,raioNaPonta=1) {
  const geo=mesh.geometry,p=geo.attributes.position,n=geo.attributes.normal,antigas=n?.array.slice(),u=geo.userData;
  const originalGeo=geo.clone();
  originalGeo.userData={...u,centros:u.centros?.map(p=>p.clone()),alturas:u.alturas?.slice()};
  const alterados=new Set(),q=new THREE.Quaternion();
  ligada.raioNaPonta=raioNaPonta;
  if(u.centros)u.calibreCardiaco=Array(segmentos+1).fill(1);
  for(let s=0;s<=segmentos;s++){
    const amostra=s/segmentos,t=u.centros?amostra:original.getUtoTmapping(amostra);
    if(inicio?t>=ligada.corte:t<=ligada.corte)continue;
    if(!u.centros&&Array.from({length:radiais+1},(_,j)=>p.getY(s*(radiais+1)+j)).some(y=>y<1.21*(3.4/1.75)||y>1.44*(3.4/1.75)))continue;
    const antes=original.getPointAt(amostra),depois=ligada.getPoint(t);q.setFromUnitVectors(original.getTangentAt(amostra),ligada.getTangent(t));
    const f=THREE.MathUtils.clamp(inicio?1-t/ligada.corte:(t-ligada.corte)/(1-ligada.corte),0,1),calibre=1+(raioNaPonta-1)*f*f*(3-2*f);
    for(let j=0;j<=radiais;j++){const i=s*(radiais+1)+j,r=V().fromBufferAttribute(p,i).sub(antes).applyQuaternion(q).multiplyScalar(calibre).add(depois);p.setXYZ(i,r.x,r.y,r.z);alterados.add(i)}
    if(u.centros){u.centros[s]=depois;u.alturas[s]=depois.y/.02}
    if(u.centros)u.calibreCardiaco[s]=calibre;
  }
  p.needsUpdate=true;geo.computeVertexNormals();
  // Nem as normais da malha fora do trecho autorizado mudam.
  if(antigas)for(let i=0;i<n.count;i++)if(!alterados.has(i))n.setXYZ(i,antigas[i*3],antigas[i*3+1],antigas[i*3+2]);
  geo.computeBoundingBox();geo.computeBoundingSphere();
  if(u.centros)protecoes.set(geo,{original:originalGeo,alterados});
  else originalGeo.dispose();
  return ligada;
}
export function moldarOriginalCardiaca(geo,grau,opc,moldar) {
  const p=protecoes.get(geo);if(p)moldar({geometry:p.original},grau,opc);
}
export function restaurarNormaisProtegidas(geo) {
  const p=protecoes.get(geo);if(!p)return;
  const n=geo.attributes.normal,a=p.original.attributes.normal;
  for(let i=0;i<n.count;i++)if(!p.alterados.has(i))n.setXYZ(i,a.getX(i),a.getY(i),a.getZ(i));
  n.needsUpdate=true;
}
