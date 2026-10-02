import * as THREE from 'three';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),clamp=THREE.MathUtils.clamp;
const protecoes=new WeakMap();
const suave=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};

// A pele serve somente como sonda: sua geometria e seu material nunca são alterados.
export function prepararPes(geo,S) {
  const recorte=new THREE.BufferGeometry(),pos=geo.attributes.position,indices=[];
  for(let i=0;i<(geo.index?.count||pos.count);i+=3){const a=geo.index?geo.index.getX(i):i,b=geo.index?geo.index.getX(i+1):i+1,c=geo.index?geo.index.getX(i+2):i+2;if(Math.max(pos.getY(a),pos.getY(b),pos.getY(c))<.26*S)indices.push(a,b,c)}
  recorte.setAttribute('position',pos);recorte.setIndex(indices);
  const sonda=new THREE.Mesh(recorte,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})),ray=new THREE.Raycaster();
  const centro=(x,z)=>{ray.set(V(x,-.1,z),V(0,1,0));const h=ray.intersectObject(sonda,false).filter(h=>h.point.y<.18*S);if(h.length<2)return null;return V(x,(h[0].point.y+h[h.length-1].point.y)/2,z)};
  const direcoes=[];for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)if(x||y||z)direcoes.push(V(x,y,z).normalize());
  const margem=p=>{let d=Infinity;for(const dir of direcoes){ray.set(p,dir);const h=ray.intersectObject(sonda,false)[0];if(h)d=Math.min(d,h.distance)}return Number.isFinite(d)?d:0};
  const encaixar=(p,lado)=>{
    let x=0,z=0,n=0;for(let i=0;i<pos.count;i++)if(Math.abs(pos.getY(i)-p.y)<.012*S&&pos.getX(i)*lado>.005*S){x+=pos.getX(i);z+=pos.getZ(i);n++}if(!n)return p;
    x/=n;z/=n;
    const limites=(origem,dir,eixo)=>{ray.set(origem,dir);const hs=ray.intersectObject(sonda,false).filter(h=>h.point.x*lado>.005*S);return hs.length>=2?[hs[0].point.getComponent(eixo),hs[hs.length-1].point.getComponent(eixo)]:null};
    let zs=limites(V(x,p.y,-S),V(0,0,1),2);if(!zs)return V(x,p.y,z);z=clamp(p.z,zs[0]+(zs[1]-zs[0])*.25,zs[1]-(zs[1]-zs[0])*.25);
    const xs=limites(V(-S,p.y,z),V(1,0,0),0);if(xs)x=clamp(p.x,xs[0]+(xs[1]-xs[0])*.25,xs[1]-(xs[1]-xs[0])*.25);
    zs=limites(V(x,p.y,-S),V(0,0,1),2);if(zs)z=clamp(z,zs[0]+(zs[1]-zs[0])*.25,zs[1]-(zs[1]-zs[0])*.25);
    return V(x,p.y,z);
  };
  const locais=new Map();
  return {
    ligar(mesh,original,S,inicio=false) {
      const lado=(inicio?original.getPoint(0):original.getPoint(1)).x<0?-1:1;
      if(!locais.has(lado)){
        const ponta=inicio?original.getPoint(0):original.getPoint(1);let melhor=null,valor=-1;
        for(let ix=-3;ix<=3;ix++)for(let iz=-4;iz<=1;iz++){
          const c=centro(ponta.x+ix*.006*S,ponta.z+iz*.006*S);if(!c)continue;
          const a=centro(c.x-lado*.004*S,c.z),v=centro(c.x+lado*.004*S,c.z),frente=centro(c.x,c.z+.012*S);if(!a||!v||!frente)continue;
          const score=Math.min(margem(a),margem(v),margem(frente));if(score>valor){valor=score;melhor={a,v,frente}}
        }
        if(!melhor)throw Error('Não foi possível encaixar a microcirculação no pé');locais.set(lado,melhor);
      }
      const local=locais.get(lado),ponta=inicio?local.v:local.a;
      let corte=inicio?0:1;for(let i=0;i<=2048;i++){const t=i/2048;if(original.getPoint(t).y<.22*S){if(inicio)corte=t;else{corte=t;break}}}
      const junta=original.getPoint(corte),tan=original.getTangent(corte),d=junta.distanceTo(ponta),direcao=V(0,0,inicio?-1:1);
      const bez=inicio?new THREE.CubicBezierCurve3(ponta,ponta.clone().addScaledVector(direcao,d*.22),junta.clone().addScaledVector(tan,-d*.22),junta):new THREE.CubicBezierCurve3(junta,junta.clone().addScaledVector(tan,d*.22),ponta.clone().addScaledVector(direcao,-d*.22),ponta);
      const amostras=Array.from({length:257},(_,i)=>i===0||i===256?bez.getPoint(i/256):encaixar(bez.getPoint(i/256),lado));
      const pontoLocal=(t,target)=>{const x=clamp(t,0,1)*256,i=Math.min(255,Math.floor(x));return target.copy(amostras[i]).lerp(amostras[i+1],x-i)};
      class Distal extends THREE.Curve {
        getPoint(t,target=V()){if(inicio?t>=corte:t<=corte)return original.getPoint(t,target);return pontoLocal(inicio?t/corte:(t-corte)/(1-corte),target)}
        calibreNoPonto(t){const f=suave(inicio?1-t/corte:(t-corte)/(1-corte)),base=mesh.geometry.userData.raioBase||mesh.geometry.parameters.radius,tip=.001*S/base/(inicio?1.45:1);let r=1+(tip-1)*f;const p=this.getPoint(t);if(p.y<.22*S)r=Math.min(r,margem(p)*.52/base/(inicio?1.45:1));return Math.max(.015,r)}
      }
      const curva=new Distal(),u=mesh.geometry.userData,p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,originalGeo=mesh.geometry.clone(),alterados=new Set();
      originalGeo.userData={...u,centros:u.centros?.map(p=>p.clone()),alturas:u.alturas?.slice()};
      const segmentos=u.segsU||mesh.geometry.parameters.tubularSegments,radiais=u.segsV||mesh.geometry.parameters.radialSegments,q=new THREE.Quaternion(),fatores=[];
      // Cache do calibre: sondagem só na construção, nunca no laço da animação.
      for(let i=0;i<=256;i++)fatores.push(curva.calibreNoPonto(i/256));curva.calibreNoPonto=t=>{const x=clamp(t,0,1)*256,i=Math.min(255,Math.floor(x));return THREE.MathUtils.lerp(fatores[i],fatores[i+1],x-i)};
      if(u.centros)u.calibreDistal=Array(segmentos+1).fill(1);
      for(let s=0;s<=segmentos;s++){
        const t=u.centros?s/segmentos:original.getUtoTmapping(s/segmentos);if(inicio?t>=corte:t<=corte)continue;
        const antes=u.centros?u.centros[s]:original.getPoint(t),depois=curva.getPoint(t),calibre=curva.calibreNoPonto(t);q.setFromUnitVectors(original.getTangent(t),curva.getTangent(t));
        for(let j=0;j<=radiais;j++){const i=s*(radiais+1)+j,r=V().fromBufferAttribute(p,i).sub(antes).applyQuaternion(q).multiplyScalar(calibre).add(depois);p.setXYZ(i,r.x,r.y,r.z);alterados.add(i)}
        if(u.centros){u.centros[s]=depois;u.alturas[s]=depois.y/.02;u.calibreDistal[s]=calibre}
      }
      p.needsUpdate=true;mesh.geometry.computeVertexNormals();for(let i=0;i<n.count;i++)if(!alterados.has(i))n.setXYZ(i,originalGeo.attributes.normal.getX(i),originalGeo.attributes.normal.getY(i),originalGeo.attributes.normal.getZ(i));
      mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();protecoes.set(mesh.geometry,{original:originalGeo,alterados});
      return curva;
    },
    micro(lado) {
      const p=locais.get(lado);const c1=p.a.clone().lerp(p.frente,.7),c2=p.v.clone().lerp(p.frente,.7);c1.z=p.frente.z;c2.z=p.frente.z;
      const curva=new THREE.CubicBezierCurve3(p.a,c1,c2,p.v);curva.calibreNoPonto=()=>1;
      return {curve:curva,r:.001*S};
    },
    dispose(){sonda.material.dispose();recorte.dispose()}
  };
}
export function centrosParaVolume(geo){return protecoes.get(geo)?.original.userData.centros||geo.userData.centros}
export function moldarOriginalDistal(geo,grau,opc,moldar){const p=protecoes.get(geo);if(p?.original.userData.centros)moldar({geometry:p.original},grau,opc)}
export function restaurarNormaisDistais(geo){const p=protecoes.get(geo);if(!p)return;const n=geo.attributes.normal,a=p.original.attributes.normal;for(let i=0;i<n.count;i++)if(!p.alterados.has(i))n.setXYZ(i,a.getX(i),a.getY(i),a.getZ(i));n.needsUpdate=true}
