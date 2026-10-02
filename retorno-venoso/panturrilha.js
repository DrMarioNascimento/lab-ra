import * as THREE from 'three';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export function tecidosDaPanturrilha(pele,H,R,material) {
  const P=pele?.attributes.position,amostras=[];
  for(let i=0;i<=48;i++){
    const y=H*i/48;let xmin=Infinity,xmax=-Infinity,zmin=Infinity,zmax=-Infinity;
    if(P)for(let k=0;k<P.count;k++)if(Math.abs(P.getY(k)-y)<H*.035){xmin=Math.min(xmin,P.getX(k));xmax=Math.max(xmax,P.getX(k));zmin=Math.min(zmin,P.getZ(k));zmax=Math.max(zmax,P.getZ(k))}
    if(!Number.isFinite(xmin)){xmin=-.12;xmax=.12;zmin=-.10;zmax=.10}
    amostras.push({c:V((xmin+xmax)/2,y,(zmin+zmax)/2),x:Math.max(.018,(xmax-xmin)*.42),z:Math.max(.015,(zmax-zmin)*.40)});
  }
  // Suaviza só o eixo/envelope dos tecidos internos, sem editar a pele.
  for(let passe=0;passe<2;passe++){
    const antes=amostras.map(s=>({c:s.c.clone(),x:s.x,z:s.z}));
    for(let i=0;i<amostras.length;i++){const c=V(),pesos=[1,4,6,4,1];let x=0,z=0;for(let k=-2;k<=2;k++){const a=antes[Math.min(48,Math.max(0,i+k))],w=pesos[k+2]/16;c.addScaledVector(a.c,w);x+=a.x*w;z+=a.z*w}c.y=antes[i].c.y;amostras[i]={c,x,z}}
  }
  const secao=y=>{const t=THREE.MathUtils.clamp(y/H,0,1)*48,i=Math.min(47,Math.floor(t)),f=t-i,a=amostras[i],b=amostras[i+1];return {c:a.c.clone().lerp(b.c,f),x:THREE.MathUtils.lerp(a.x,b.x,f),z:THREE.MathUtils.lerp(a.z,b.z,f)}};
  const curva=new THREE.CatmullRomCurve3(Array.from({length:49},(_,i)=>secao(H*i/48).c.add(V(0,0,.005))),false,'centripetal');
  const veiaGeo=new THREE.TubeGeometry(curva,80,R,24,false),centros=Array.from({length:81},(_,i)=>curva.getPointAt(i/80)),raio=y=>{const s=secao(y);return Math.min(R,s.x*.40,s.z*.45)};
  const pVeia=veiaGeo.attributes.position;for(let i=0;i<pVeia.count;i++){const c=centros[Math.floor(i/25)],f=raio(c.y)/R;pVeia.setXYZ(i,c.x+(pVeia.getX(i)-c.x)*f,c.y+(pVeia.getY(i)-c.y)*f,c.z+(pVeia.getZ(i)-c.z)*f)}veiaGeo.computeVertexNormals();
  const baseVeia=veiaGeo.attributes.position.array.slice();
  const barrigas=[];
  // Cabeças medial/lateral distintas e sóleo profundo. Os tendões permanecem fixos.
  for(const [nome,lado,inicio,fim,fator] of [['gastrocnemio_medial',-1,.19,.94,1],['gastrocnemio_lateral',1,.25,.90,.88],['soleo',0,.10,.78,.73]]){
    const pos=[],uv=[],cores=[],indices=[],rings=64,radiais=32,corMusculo=material.color.clone(),corTendao=new THREE.Color(0xaaa18b),suave=t=>{t=THREE.MathUtils.clamp(t,0,1);return t*t*(3-2*t)};
    for(let i=0;i<=rings;i++){const t=i/rings,y=H*(inicio+(fim-inicio)*t),s=secao(y),perfil=.16+.84*Math.pow(Math.sin(Math.PI*t),1.1)*(1+.12*t),rx=s.x*(lado===0?.65:.40)*fator,rz=s.z*.55*fator;
      const mistura=Math.max(1-suave((t-.04)/.17),suave((t-.78)/.17)),cor=corMusculo.clone().lerp(corTendao,mistura);
      for(let k=0;k<=radiais;k++){const a=k/radiais*Math.PI*2,estria=1+.006*Math.cos(a*14)*(1-mistura),x=s.c.x+lado*s.x*.46+rx*perfil*Math.cos(a)*estria,z=s.c.z-s.z*(lado===0?.38:.18)+rz*perfil*Math.sin(a)*estria;pos.push(x,y,z);cores.push(cor.r,cor.g,cor.b);uv.push(k/radiais,t);if(i<rings&&k<radiais){const a0=i*(radiais+1)+k,b=a0+radiais+1;indices.push(a0,b,a0+1,b,b+1,a0+1)}}
    }
    // Fecha as extremidades no tendão, sem pontas musculares nem fendas abertas.
    for(const [ring,alto] of [[0,false],[rings,true]]){const offset=ring*(radiais+1),centro=V();for(let k=0;k<radiais;k++)centro.add(V(pos[(offset+k)*3],pos[(offset+k)*3+1],pos[(offset+k)*3+2]));centro.divideScalar(radiais);const idx=pos.length/3;pos.push(...centro.toArray());cores.push(corTendao.r,corTendao.g,corTendao.b);uv.push(.5,alto?1:0);for(let k=0;k<radiais;k++)indices.push(idx,offset+(alto?k+1:k),offset+(alto?k:k+1))}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(cores,3));geo.setIndex(indices);geo.computeVertexNormals();
    const mat=material.clone();mat.color.set(0xffffff);mat.vertexColors=true;const m=new THREE.Mesh(geo,mat);m.name=nome;const base=geo.attributes.position.array.slice();
    m.userData.contrair=aperto=>{const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=base[i*3],y=base[i*3+1],z=base[i*3+2],t=(y/H-inicio)/(fim-inicio),sCore=THREE.MathUtils.clamp((t-.20)/.58,0,1),w=Math.pow(Math.sin(Math.PI*sCore),2),s=secao(y),cx=s.c.x+lado*s.x*.46,cz=s.c.z-s.z*(lado===0?.38:.18);p.setXYZ(i,cx+(x-cx)*(1+.14*aperto*w)-lado*s.x*.08*aperto*w,y+.012*aperto*w*(.5-t),cz+(z-cz)*(1+.10*aperto*w));}p.needsUpdate=true;geo.computeVertexNormals()};barrigas.push(m);
  }
  const tendaoPts=Array.from({length:12},(_,i)=>{const s=secao(H*(.03+.17*i/11));return s.c.add(V(0,0,-s.z*.38))}),tendao=new THREE.Group(),matTendao=new THREE.MeshStandardMaterial({color:0x786d5a,roughness:.90});tendao.name='tendao_calcaneo';tendao.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tendaoPts),30,.010,14,false),matTendao));
  for(const [lado,y] of [[-1,.19],[1,.25]]){const s=secao(H*y),p=s.c.add(V(lado*s.x*.46,0,-s.z*.18)),q=tendaoPts.at(-1);tendao.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([q.clone(),q.clone().lerp(p,.55),p]),18,.006,12,false),matTendao))}
  const deformarVeia=aperto=>{const p=veiaGeo.attributes.position;for(let i=0;i<p.count;i++){const ring=Math.floor(i/25),c=centros[ring],s=THREE.MathUtils.clamp((c.y-H*.2174)/(H*.7391-H*.2174),0,1),w=Math.pow(Math.sin(Math.PI*s),2);p.setXYZ(i,c.x+(baseVeia[i*3]-c.x)*(1-.78*aperto*w),baseVeia[i*3+1],c.z+(baseVeia[i*3+2]-c.z)*(1+.06*aperto*w))}p.needsUpdate=true;veiaGeo.computeVertexNormals()};
  return {curva,veiaGeo,barrigas,tendao,deformarVeia,raio};
}
