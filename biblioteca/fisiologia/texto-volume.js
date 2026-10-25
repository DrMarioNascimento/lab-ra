/* Geometria de letras e placas, exportável em GLB e USDZ. */
import * as THREE from 'three';
import { Font } from 'three/addons/loaders/FontLoader.js';
import dados from './fonte-ra.js';
const fonte = new Font(dados);
const inferiores = '₀₁₂₃₄₅₆₇₈₉', superiores = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function textoVolume(texto, { largura = 1, altura = .15, profundidade = .012, cor = 0xf5f7f8 } = {}) {
 const partes = []; let x = 0;
 for (const original of String(texto).normalize('NFC')) {
  let c = original, escala = 1, y = 0;
  if (inferiores.includes(c)) { c = String(inferiores.indexOf(c)); escala = .65; y = -.18; }
  else if (superiores.includes(c)) { c = String(superiores.indexOf(c)); escala = .65; y = .48; }
  else if (c === '⁺' || c === '⁻') { c = c === '⁺' ? '+' : '-'; escala = .65; y = .48; }
  else if ('−–—'.includes(c)) c = '-';
  if (!dados.glyphs[c]) throw new Error('Glifo não disponível para RA: ' + original);
  if (c !== ' ') {
   const g = new THREE.ExtrudeGeometry(fonte.generateShapes(c, escala), { depth: .06, bevelEnabled: true, bevelThickness: .008, bevelSize: .006, bevelSegments: 1, curveSegments: 5, steps: 1 });
   g.translate(x,y,0); partes.push(g);
  }
  x += dados.glyphs[c].ha / dados.resolution * escala;
 }
 const geo = new THREE.BufferGeometry();
 for (const nome of ['position','normal','uv']) {
  const arrays = partes.map(g=>g.attributes[nome].array), total = arrays.reduce((s,a)=>s+a.length,0), joined = new Float32Array(total);
  let offset=0;for(const a of arrays){joined.set(a,offset);offset+=a.length;}
  geo.setAttribute(nome,new THREE.BufferAttribute(joined,nome==='uv'?2:3));
 }
 partes.forEach(g=>g.dispose());
 geo.computeBoundingBox(); const b=geo.boundingBox;
 if(b.isEmpty())throw new Error('Texto vazio');
 const f=Math.min(largura/Math.max(b.max.x-b.min.x,.001),altura/Math.max(b.max.y-b.min.y,.001));
 geo.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,-b.min.z);
 geo.scale(f,f,profundidade/(b.max.z-b.min.z||1));geo.computeBoundingBox();geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:cor,roughness:.4,metalness:.12}));
 mesh.name='texto_em_relevo';mesh.userData.textoRA=String(texto);return mesh;
}
export function placaVolume(rotulo,{largura=1,altura=.2,espessura=.025,cor=0x123446,textoCor=0xf5f7f8}={}){
 const grupo=new THREE.Group();grupo.name='placa_com_relevo';
 const base=new THREE.Mesh(new THREE.BoxGeometry(largura,altura,espessura),new THREE.MeshStandardMaterial({color:cor,roughness:.5,metalness:.15}));base.name='placa_solida';grupo.add(base);
 const texto=textoVolume(rotulo,{largura:largura*.9,altura:altura*.56,profundidade:espessura*.3,cor:textoCor});texto.position.z=espessura*.525;grupo.add(texto);return grupo;
}

