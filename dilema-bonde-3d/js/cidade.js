import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Fachadas completas: visíveis também ao dar a volta na maquete em RA.
export function criarCidade(parede, cobertura) {
  const root = new THREE.Group(); root.name = 'Cidade';
  const volumes = [], lotes = new Map();
  let seed = 92; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const cores = [0xc6b18b,0xbfb0a1,0xd0c0a6,0xbda58d,0xb5b5ac,0xd0b897];
  function guardar(g, nome, mat) {
    const key = nome + '_' + mat.color.getHexString();
    if (!lotes.has(key)) lotes.set(key,{gs:[],mat,nome:key});
    lotes.get(key).gs.push(g.index ? g.toNonIndexed() : g);
  }
  const moldura = new THREE.MeshStandardMaterial({color:0xe1d8c6,roughness:.8});
  const vidro = new THREE.MeshStandardMaterial({color:0x263d50,metalness:.25,roughness:.3});
  const reflexo = new THREE.MeshStandardMaterial({color:0x849bab,metalness:.1,roughness:.4});
  const porta = new THREE.MeshStandardMaterial({color:0x513d2d,roughness:.85});
  const matParede = cor => { const m = parede.clone(); m.color.setHex(cor); return m; };
  function caixa(w,h,d,x,y,z) { return new THREE.BoxGeometry(w,h,d).translate(x,y,z); }
  function texturaMetrica(g) {
    const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;
    for(let i=0;i<p.count;i++) {
      const topo=Math.abs(n.getY(i))>.5;
      uv.setXY(i,(Math.abs(n.getX(i))>.5?p.getZ(i):p.getX(i))*.7,(topo?p.getZ(i):p.getY(i))*.7);
    }
    return g;
  }
  function predio(x,z,w,d,h,cor,torre=false) {
    volumes.push(new THREE.Box3(new THREE.Vector3(x-w/2,0,z-d/2),new THREE.Vector3(x+w/2,h+2,z+d/2)));
    guardar(texturaMetrica(caixa(w,h,d,x,h/2,z)),'Cidade_Paredes',matParede(cor));
    guardar(caixa(w+.12,.28,d+.12,x,.14,z),'Cidade_Embasamento',matParede(0x746c60));
    guardar(caixa(w+.18,.16,d+.18,x,h-.08,z),'Cidade_Cornijas',moldura);
    if(torre) {
      guardar(new THREE.ConeGeometry(w*.8,4,4).rotateY(Math.PI/4).translate(x,h+2,z),'Cidade_Telhados',cobertura);
    } else {
      const s=new THREE.Shape();s.moveTo(-w/2-.25,0);s.lineTo(w/2+.25,0);s.lineTo(0,1.8);s.closePath();
      const telhado=new THREE.ExtrudeGeometry(s,{depth:d+.4,bevelEnabled:false});
      telhado.translate(x,h,z-d/2-.2);guardar(texturaMetrica(telhado),'Cidade_Telhados',cobertura);
    }
    const faces=[['Frente',0,d/2,w,0],['Fundos',0,-d/2,w,Math.PI],['Direita',w/2,0,d,Math.PI/2],['Esquerda',-w/2,0,d,-Math.PI/2]];
    for(const [nome,fx,fz,larg,ang] of faces) {
      const n=Math.max(1,Math.floor(larg/1.45)),andares=Math.max(1,Math.floor((h-.4)/1.65));
      const porNaFace=g=>g.rotateY(ang).translate(x+fx,0,z+fz);
      for(let a=0;a<andares;a++)for(let k=0;k<n;k++) {
        const u=(k-(n-1)/2)*1.35,y=1.15+a*1.65;
        if(nome==='Frente'&&a===0&&Math.abs(u)<.6)continue;
        guardar(porNaFace(caixa(.92,1.15,.10,u,y,.04)),'Cidade_Molduras_'+nome,moldura);
        guardar(porNaFace(new THREE.PlaneGeometry(.70,.91).translate(u,y,.122)),'Cidade_Janelas_'+nome,vidro);
        guardar(porNaFace(new THREE.PlaneGeometry(.05,.91).translate(u,y,.15)),'Cidade_Caixilhos',moldura);
        guardar(porNaFace(new THREE.PlaneGeometry(.70,.045).translate(u,y,.15)),'Cidade_Caixilhos',moldura);
        guardar(porNaFace(new THREE.PlaneGeometry(.14,.77).translate(u-.20,y+.04,.136)),'Cidade_Reflexos',reflexo);
      }
      if(nome==='Frente') {
        guardar(porNaFace(caixa(.94,1.85,.12,0,.925,.04)),'Cidade_Portas',moldura);
        guardar(porNaFace(caixa(.74,1.72,.04,0,.86,.12)),'Cidade_Portas',porta);
      }
    }
  }
  for(let i=0;i<26;i++) {
    const x=-73+i*5.8,z=-47+(i%3)*1.3;
    if(Math.abs(x-46)<5)continue;
    predio(x,z,3.6+rnd()*1.5,3.2+rnd()*.8,3.9+rnd()*2.3,cores[i%cores.length]);
  }
  predio(46,-46,5,7,6,0xcbbd9c);
  predio(46,-42.5,2.6,2.6,11,0xcbbd9c,true);
  for(const {gs,mat,nome} of lotes.values()) {
    const mesh=new THREE.Mesh(mergeGeometries(gs),mat);mesh.name=nome;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
  }
  root.userData.volumes=volumes;
  return root;
}
