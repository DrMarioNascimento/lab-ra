/* Nível 01 · o bíceps braquial modelado — 29/10/2026
   ---------------------------------------------------------------------------
   O músculo do 01 era desenhado por código: um ventre fusiforme entre dois
   ossos genéricos. Agora o nível 01 é um músculo de verdade, o bíceps
   braquial, com escápula, úmero, rádio e ulna (../assets/biceps-braquial.glb).

   O ARQUIVO. Veio do designer (biceps_tendoes_novos.glb) e foi corrigido antes
   de entrar aqui:
   • saiu uma peça solta (um cone branco a uns 20 cm do braço);
   • o tendão distal antigo terminava no ar, à frente do rádio, sem tocar o
     osso. Foi retirado e trocado por um tendão contínuo: nasce dentro do
     ventre, desce à frente do cotovelo, mergulha entre rádio e ulna e se
     prende achatado na tuberosidade do rádio, na face anteromedial, ~2,5 cm
     abaixo da cabeça do rádio;
   • mais leve: rádio e ulna vinham em cinco partes com os mesmos vértices
     (juntadas), ossos simplificados sem perda visível, texturas no tamanho do
     que cobrem e malha em Draco — de 6,0 MB para 0,9 MB. O USDZ que o iPhone
     recebe fica em ~11,7 MB, menor que o do músculo por código (~12,7 MB).

   O QUE FICA IGUAL. `modelos.js` (aprovado) e `acabamento.js` continuam
   montando o músculo por código. Ele é a reserva: se o GLB não chegar (rede,
   aparelho), a página mostra o músculo de antes e segue funcionando.

   POSIÇÃO. Fica de pé, na posição anatômica (ombro em cima, cotovelo embaixo,
   face anterior para a câmera): o giro da página é em torno do eixo vertical,
   e um braço de pé gira como numa bancada. Na RA vai em tamanho real.        */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const DECODIFICADOR = 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/';
const ALTURA_NA_TELA = 6.4;            /* unidades da cena; o músculo antigo tinha ~5 de ventre */
const ESPERA_MAX = 20000;              /* ms; passado isso, fica o músculo por código */

/* Pontos dos rótulos, nas coordenadas do arquivo (metros, braço esquerdo:
   +x medial, +y para cima, +z anterior). Tirados da própria malha. */
const ROTULOS = [
  ['ventre muscular', [-0.0278, 0.0582, 0.0324]],
  ['fascículos', [-0.0346, 0.0119, 0.0431]],
  ['epimísio', [-0.0712, -0.0327, 0.0138]],
  ['cabeça longa', [-0.0289, 0.1311, 0.0134]],
  ['origem da cabeça curta', [-0.0109, 0.1486, 0.0117]],    /* processo coracoide; um rótulo
     só aqui: os dois tendões ficam a menos de 1 cm, e dois rótulos se sobrepunham */
  ['articulação do cotovelo', [-0.0337, -0.0968, -0.0097]],
  ['inserção', [-0.0590, -0.1270, -0.0160]],                 /* tuberosidade do rádio */
  ['úmero', [-0.0610, -0.0800, -0.0130]],
];
const FOCO = [-0.0346, 0.0119, 0.0382];                       /* centro da janela no epimísio */

export const TEXTO_BICEPS = {
  titulo: 'Músculo esquelético · bíceps braquial',
  texto: 'O bíceps braquial inteiro. Duas cabeças nascem na escápula: a longa, no tubérculo supraglenoidal, com o tendão passando por dentro da cápsula do ombro; a curta, no processo coracoide. O ventre, envolvido pelo epimísio, cruza o ombro e o cotovelo, e o tendão distal se prende à tuberosidade do rádio. Ao encurtar, aproxima a inserção da origem: flexiona o cotovelo e supina o antebraço. Pela janela no epimísio já se veem os fascículos.',
  tags: 'ventre muscular,epimísio,fascículos,cabeça longa,cabeça curta,origem,inserção,articulação',
};

/* Troca o conteúdo do nível 01 pelo bíceps. Devolve true se trocou.
   Enquanto carrega, o músculo por código fica escondido; se falhar, volta. */
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
    braco.traverse(o => { if (o.isMesh) { o.castShadow = !o.material.transparent; o.receiveShadow = true; } });

    /* escala e centro: a caixa do arquivo vira a caixa da cena */
    braco.updateMatrixWorld(true);
    const caixa = new THREE.Box3().setFromObject(braco), tam = caixa.getSize(new THREE.Vector3());
    const esc = ALTURA_NA_TELA / tam.y, centro = caixa.getCenter(new THREE.Vector3());
    const pivo = new THREE.Group(); pivo.name = 'biceps_pivo';
    pivo.scale.setScalar(esc); pivo.position.copy(centro).multiplyScalar(-esc);
    pivo.add(braco);
    const naCena = p => new THREE.Vector3(...p).sub(centro).multiplyScalar(esc);

    antigos.forEach(o => musculo.remove(o));
    musculo.add(pivo);
    musculo.updateMatrixWorld(true);

    const t = tam.clone().multiplyScalar(esc * .5);
    musculo.userData.quadro = { rh: Math.max(t.x, t.z), hv: t.y };
    musculo.userData.foco = naCena(FOCO);
    musculo.userData.desvio = new THREE.Vector3();
    musculo.userData.rotulos = ROTULOS.map(([nome, p]) => [nome, naCena(p)]);
    musculo.userData.tamanhoReal = Math.max(tam.x, tam.y, tam.z);      /* metros: RA em 1:1 */
    return true;
  } catch (err) {
    console.warn('bíceps não carregou; fica o músculo desenhado por código', err);
    return voltar();
  }
}
