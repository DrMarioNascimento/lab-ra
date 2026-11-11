/* Nível 01 · o bíceps braquial em movimento — 11/11/2026
   ---------------------------------------------------------------------------
   Substitui o bíceps de 29/10/2026 (biceps_SUBSTITUIDO_2026-11-11.js, arquivo
   ../assets/biceps-braquial.glb, que continua no repositório).

   O ARQUIVO (../assets/biceps-braquial-rosca.glb, 4 MB, Draco). Membro
   superior direito em metros, +y para cima, +z anterior. Escápula, clavícula,
   úmero, rádio, ulna, tendões das duas cabeças e membrana interóssea do
   BodyParts3D (DBCLS, CC BY); ventres do modelo do autor encaixados nesse
   trajeto; cartilagens articulares e ligamentos esquemáticos (a mesma base da
   RA ../biceps-braquial/). Antebraço inteiro, aponeurose bicipital presente.
   A janela no epimísio continua: uma elipse recortada na face anterior da
   cabeça longa, com a borda do epimísio cortado e os fascículos por baixo —
   é ela que liga este nível ao 02.

   O MOVIMENTO. Rosca direta: em 8 s o cotovelo vai de 0° a 100° de flexão e
   volta (cosseno, pico aos 4 s — o mesmo instante em que o sarcômero do 05
   chega a 1,9 µm). O antebraço gira como peça rígida em torno do eixo do
   cotovelo; ventre, fascículos, borda do epimísio e tendões se deformam
   (morph targets): o ventre encurta até 58% e engrossa, na medida que mantém
   o comprimento dos tendões. Sem pronossupinação.

   O QUE FICA IGUAL. `modelos.js` (aprovado) continua montando o músculo por
   código como reserva: se o GLB não chegar em 20 s, volta o de antes.       */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const DECODIFICADOR = 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/';
const ALTURA_NA_TELA = 6.4;            /* unidades da cena; o músculo antigo tinha ~5 de ventre */
const ESPERA_MAX = 20000;              /* ms; passado isso, fica o músculo por código */

export const TEXTO_BICEPS = {
  titulo: 'Músculo esquelético · bíceps braquial',
  texto: 'O bíceps braquial inteiro, em rosca direta. Duas cabeças nascem na escápula: a longa, no tubérculo supraglenoidal, com o tendão passando por dentro da cápsula do ombro; a curta, no processo coracoide. O ventre, envolvido pelo epimísio, cruza o ombro e o cotovelo, e o tendão distal se prende à tuberosidade do rádio. Ao contrair, o ventre encurta e engrossa e aproxima a inserção da origem: o cotovelo flexiona; ao relaxar, o cotovelo estende. Pela janela no epimísio já se veem os fascículos.',
  tags: 'ventre muscular,epimísio,fascículos,cabeça longa,cabeça curta,origem,inserção,flexão do cotovelo',
};

/* posição atual de um vértice (com a deformação do instante), no mundo */
function vpos(mesh, i, out) {
  out.fromBufferAttribute(mesh.geometry.attributes.position, i);
  const ma = mesh.geometry.morphAttributes.position, inf = mesh.morphTargetInfluences;
  if (ma && inf) for (let k = 0; k < ma.length; k++) { const w = inf[k]; if (w) { out.x += ma[k].getX(i) * w; out.y += ma[k].getY(i) * w; out.z += ma[k].getZ(i) * w; } }
  return mesh.localToWorld(out);
}
function indice(mesh, nota) {                 /* vértice de maior nota, na pose de repouso */
  const p = mesh.geometry.attributes.position, v = new THREE.Vector3(); mesh.updateWorldMatrix(true, false);
  let bi = 0, bv = -Infinity;
  for (let i = 0; i < p.count; i++) { vpos(mesh, i, v); const s = nota(v); if (s > bv) { bv = s; bi = i; } }
  return bi;
}

export async function montarBiceps(musculo, url) {
  const antigos = [...musculo.children];
  antigos.forEach(o => { o.visible = false; });
  const voltar = () => { antigos.forEach(o => { o.visible = true; }); return false; };
  try {
    const draco = new DRACOLoader().setDecoderPath(DECODIFICADOR);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    const gltf = await Promise.race([
      loader.loadAsync(url),
      new Promise((_, nao) => setTimeout(() => nao(new Error('tempo esgotado')), ESPERA_MAX)),
    ]);
    draco.dispose();
    const braco = gltf.scene; braco.name = 'biceps_braquial';
    const parte = {};
    const OSSOS = ['umero', 'radio', 'ulna', 'escapula', 'clavicula'];
    braco.traverse(o => { if (o.isMesh && OSSOS.includes(o.name)) { o.material = o.material.clone(); o.material.color.set(0xd9c39b); o.material.roughness = .66; } });
    braco.traverse(o => { if (o.isMesh) { parte[o.name] = o; o.castShadow = !o.material.transparent; o.receiveShadow = true; if (o.morphTargetInfluences) o.material.side = THREE.DoubleSide; } });

    /* escala e centro: a caixa do arquivo (em repouso) vira a caixa da cena */
    braco.updateMatrixWorld(true);
    const caixa = new THREE.Box3().setFromObject(braco), tam = caixa.getSize(new THREE.Vector3());
    const esc = ALTURA_NA_TELA / tam.y, centro = caixa.getCenter(new THREE.Vector3());
    const pivo = new THREE.Group(); pivo.name = 'biceps_pivo';
    pivo.scale.setScalar(esc); pivo.position.copy(centro).multiplyScalar(-esc);
    pivo.add(braco);
    antigos.forEach(o => musculo.remove(o));
    musculo.add(pivo);
    musculo.updateMatrixWorld(true);

    /* rótulos presos a vértices: acompanham a rosca */
    const v = new THREE.Vector3(), cen = m => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(m.matrixWorld); };
    const VB = parte.ventres_biceps, LT = parte.tendoes_cabeca_longa, ST = parte.tendoes_cabeca_curta;
    const jan = cen(parte.fasciculos), vb = new THREE.Box3().setFromObject(VB);
    const xm = (vb.min.x + vb.max.x) / 2, alt = f => vb.min.y + (vb.max.y - vb.min.y) * f;
    /* âncoras espalhadas: lateral (−x) à esquerda do quadro, medial (+x) à direita */
    const ancoras = [
      ['ventre muscular', VB, indice(VB, p => -Math.abs(p.y - alt(.3)) * 60 + p.x * 2 + p.z)],
      ['fascículos', parte.fasciculos, indice(parte.fasciculos, p => -p.distanceTo(jan) + p.z * .3)],
      ['epimísio', VB, indice(VB, p => -Math.abs(p.y - alt(.2)) * 60 - p.x * 2 + p.z * .5)],
      ['cabeça longa', VB, indice(VB, p => -Math.abs(p.y - alt(.9)) * 60 - p.x + p.z * .3)],
      ['origem da cabeça curta', ST, indice(ST, p => p.y)],
      ['articulação do cotovelo', parte.cartilagem_troclea_capitulo, indice(parte.cartilagem_troclea_capitulo, p => p.x + p.z * .3)],
      ['inserção', LT, indice(LT, p => -p.y)],
      ['úmero', parte.umero, indice(parte.umero, p => -Math.abs(p.y - (vb.min.y * .75 + vb.max.y * .25)) * 40 - p.x)],
    ];
    const rotulos = ancoras.map(([nome]) => [nome, new THREE.Vector3()]);
    const inv = new THREE.Matrix4();
    function atualizarRotulos() {
      musculo.updateWorldMatrix(true, true); inv.copy(musculo.matrixWorld).invert();
      ancoras.forEach(([, m, i], k) => { vpos(m, i, v); rotulos[k][1].copy(v).applyMatrix4(inv); });
    }

    /* rosca direta: o relógio fica com a página, que chama passo(dt) quando o
       nível 01 está na tela */
    const mixer = gltf.animations.length ? new THREE.AnimationMixer(braco) : null;
    if (mixer) mixer.clipAction(gltf.animations[0]).play();
    let tocando = true;
    musculo.userData.movimento = {
      passo(dt) { if (mixer && tocando) mixer.update(dt); atualizarRotulos(); },
      alternar() { tocando = !tocando; return tocando; },
      get tocando() { return tocando; },
      tempo: () => (mixer ? mixer.time % 8 : 0),
    };
    atualizarRotulos();

    const t = tam.clone().multiplyScalar(esc * .5);
    /* o antebraço sobe na flexão: o quadro reserva a frente para ele */
    musculo.userData.quadro = { rh: Math.max(t.x, t.z, t.y * .55), hv: t.y };
    musculo.userData.foco = jan.clone().applyMatrix4(inv.copy(musculo.matrixWorld).invert());
    musculo.userData.desvio = new THREE.Vector3();
    musculo.userData.rotulos = rotulos;
    musculo.userData.tamanhoReal = Math.max(tam.x, tam.y, tam.z);      /* metros: RA em 1:1 */
    return true;
  } catch (err) {
    console.warn('bíceps não carregou; fica o músculo desenhado por código', err);
    return voltar();
  }
}
