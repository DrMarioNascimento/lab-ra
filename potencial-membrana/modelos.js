/* modelos.js — Potencial de membrana: a película de carga (código puro, sem DOM).
   Recebe uma fábrica de textura para funcionar tanto no navegador (CanvasTexture)
   quanto em renderização headless usada nos testes visuais.

   ── O QUE ESTA BANCADA PRECISA MOSTRAR ────────────────────────────────────
   O erro que ela existe para desfazer não é de nome nem de número: é de
   GEOMETRIA. O aluno lê "a célula está a −70 mV" e desenha na cabeça uma
   célula inteira carregada, como uma pilha cheia. Não é isso. O citoplasma é
   eletricamente neutro do começo ao fim; a separação de cargas é uma PELÍCULA
   finíssima colada nas duas faces da membrana, e ela envolve uma fração
   ridícula dos íons que a célula tem. Num corpo de 50 µm, um íon em cada
   ~160 mil sai de posição — a conta está em app.js, feita ao vivo.

   Por isso os cinco níveis descem em escala e param na membrana: neurônio →
   interior neutro → película → canais e bomba → a película que vira e viaja.

   ── AS TRÊS ARMADILHAS QUE JÁ CUSTARAM CARO NO MÚSCULO ────────────────────
   Elas valem aqui inteiras, e estão respeitadas linha a linha:
   1. NADA DE VERNIZ EM TECIDO VIVO. `clearcoat` é laca de carro e de drágea.
      Tecido tem filme úmido: `sheen`. As exceções legítimas aqui são três, e
      só três — o vidro da micropipeta, a bainha de mielina (que é lipídio de
      verdade, e brilha) e os íons, que são esquema molecular, não carne.
   2. SOMBRA DE CONTATO ENTRE PEÇAS ENCOSTADAS. Sem ela o olho resolve pela
      hipótese mais simples — um corpo só com relevo na casca —, e isso é a
      cara de uma cápsula estriada. Aqui há duas formas do mesmo problema, e
      cada uma tem a sua função: os dendritos são um tufo radial saindo do
      soma (`ocluirPorCentro`, que escurece a junção) e as hélices de um canal
      são um feixe paralelo (`ocluirNoAnel`).
   3. A INVERSÃO DE FACE TEM DE ESTAR NA GEOMETRIA, NÃO NO MATERIAL.
      `side: THREE.BackSide` funciona só no navegador; o glTF não tem esse
      conceito e o visualizador de RA desenha a face da frente. Como tudo aqui
      é exportado para a câmera, quem inverte é `peloAvesso()`.

   As utilidades abaixo são gêmeas das de ../musculo-sarcomero/modelos.js e
   foram COPIADAS de propósito: aquele arquivo está fechado e aprovado, e
   extrair uma biblioteca comum agora significaria mexer nele para ganhar
   nada que o aluno veja. */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function criar(canvasTex) {

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);
const C = h => new THREE.Color(h);
const clamp = THREE.MathUtils.clamp;
const suave = t => t * t * (3 - 2 * t);

/* A membrana dos níveis 02, 03 e 04 é a MESMA superfície, vista de três
   distâncias. Ela não é plana: curva de leve, com raio grande, porque é um
   pedaço de algo enorme. Membrana plana lê como parede; membrana curva lê
   como célula. `intra` é para cima, `extra` para baixo — e essa convenção
   vale nos três níveis, senão o mergulho desorienta. */
/* A PROFUNDIDADE DO RETALHO É MEDIDA, NÃO ESCOLHIDA. Com z = 1,75 e a câmera
   quase na linha do horizonte, a borda perto do olho subia o bastante para
   TAPAR metade da película de baixo — e o nível que existe para mostrar as
   duas faces mostrava uma e meia. Estreitando a faixa, o desnível entre a
   ponta perto e a ponta longe fica muito menor que a distância da película à
   membrana, e as duas filas aparecem inteiras. */
const MEM = { curva: 30, x: 2.95, z: 1.35 };
/* ── UM NANÔMETRO VALE ISTO ───────────────────────────────────────────────
   Nos níveis 03 e 04 o desenho está EM PROPORÇÃO, e por isso pode levar
   régua. A bicamada mede 5 nm de superfície a superfície e a película de
   carga fica dentro de cerca de 1 nm de cada face — as duas medidas saem
   daqui, e as réguas desenhadas na cena leem exatamente estes números.

   O que NÃO cabe em proporção é a célula: 50 000 nm de diâmetro contra 1 nm
   de película. É essa razão — e só ela — que obriga a página a ter níveis. */
const NM = .157;
const memY = (x, z) => -(x * x + z * z) / (2 * MEM.curva);

/* ============================================================ texturas */
function ruido2(x, y) {
  return Math.sin(x * 1.7 + y * 2.3) * .5 + Math.sin(x * 4.1 - y * 3.3) * .3 + Math.sin(x * 8.9 + y * 7.1) * .2;
}
const TEX = {
  /* tecido neural: manchado fino, sem listra. Neurônio não é estriado — se
     esta textura ganhasse bandas, a peça viraria uma fibra muscular pálida. */
  neural: canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#9c8a92'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5200; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = rnd(1.4, 6.5);
      g.globalAlpha = rnd(.03, .13);
      g.fillStyle = Math.random() < .5 ? '#f0dfe4' : '#4a333f';
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }),
  /* rugosidade variável: um valor só para a peça inteira faz cada pixel
     refletir igual, e superfície de reflexo uniforme é a definição de moldado */
  neuralRug: canvasTex(256, 256, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = 150 + ruido2(x / 26, y / 26) * 44 + rnd(-14, 14);
      const i = (y * w + x) * 4; d.data[i] = d.data[i + 1] = d.data[i + 2] = clamp(v, 0, 255); d.data[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
  }),
  /* mielina: lamelas enroladas. A listra aqui é verdade — a bainha É uma
     membrana enrolada dezenas de vezes, e é isso que se vê no corte. */
  mielina: canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#c9b89e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      g.globalAlpha = rnd(.06, .22); g.fillStyle = i % 2 ? '#e4d5bd' : '#8d7c66';
      g.fillRect(0, Math.random() * h, w, rnd(.8, 2.6));
    }
    g.globalAlpha = 1;
  }),
  /* a bicamada vista de longe (nível 02): as cabeças viram pontilhado, não
     esferas. Desenhar fosfolipídio individual nessa escala não ensina nada e
     o mip-map transforma em moiré. */
  bicamadaLonge: canvasTex(256, 256, (g, w, h) => {
    /* ERA GROSSA DEMAIS E CONTRASTADA DEMAIS: pintalgado creme sobre marrom,
       em pontos gordos, lia como casca de ovo de codorna — e a célula virava
       fruta. Ponto fino e contraste baixo devolvem uma superfície de membrana,
       que é o que ela precisa ser: presente e discreta, porque o assunto do
       nível está DENTRO dela e em volta dela, não nela. */
    g.fillStyle = '#7d6b5e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5200; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      g.fillStyle = 'rgba(206,186,158,' + rnd(.10, .34) + ')';
      g.beginPath(); g.arc(x, y, rnd(.8, 1.7), 0, Math.PI * 2); g.fill();
    }
  }, { repeatX: 7, repeatY: 4 }),
  /* O CORTE DA BICAMADA, e este conserto veio de uma foto: a borda do retalho
     era um bloco marrom liso, alto como a membrana inteira, e ele TAPAVA a
     folha de baixo — o nível que existe para mostrar as duas faces mostrava
     uma. Cortada, a membrana tem três faixas: cabeças, miolo escuro, cabeças.
     Desenhá-las na borda transforma a parede em corte histológico. */
  corte: canvasTex(16, 128, (g, w, h) => {
    const faixas = [[0, .21, '#e8d3a6'], [.21, .79, '#40312b'], [.79, 1, '#e8d3a6']];
    for (const [a0, a1, cor] of faixas) { g.fillStyle = cor; g.fillRect(0, a0 * h, w, (a1 - a0) * h + 1); }
    for (let i = 0; i < 260; i++) {
      g.globalAlpha = .05 + Math.random() * .12;
      g.fillStyle = Math.random() < .5 ? '#fff' : '#000';
      g.fillRect(0, Math.random() * h, w, 1.4);
    }
    g.globalAlpha = 1;
  }),
  /* o axônio do nível 05: estas duas são REPINTADAS a cada quadro. A cor de
     cada coluna é o sinal e a intensidade da película naquele ponto do
     comprimento — a de fora e a de dentro sempre em oposição. */
  ondaFora: canvasTex(256, 8, (g, w, h) => { g.fillStyle = '#c98a4e'; g.fillRect(0, 0, w, h); }),
  ondaDentro: canvasTex(256, 8, (g, w, h) => { g.fillStyle = '#4a6fa8'; g.fillRect(0, 0, w, h); }),
};

/* ============================================================ materiais */
const phys = o => new THREE.MeshPhysicalMaterial(Object.assign({ roughness: .45, metalness: 0 }, o));

/* Tecido vivo: sem laca, brilho amplo e fraco, e uma brasa interna de leve.
   O `emissive` não é luz própria — é o barato que se paga no lugar de
   subsuperfície de verdade. Sem ele a sombra fica preta e cheia de plástico. */
const vivo = o => phys(Object.assign({
  roughness: .70, clearcoat: 0, sheen: .26, sheenRoughness: .85,
  emissive: 0x150912, emissiveIntensity: .38,
}, o));

const M = {
  neuronio: vivo({ color: 0xffffff, vertexColors: true, map: TEX.neural, emissiveMap: TEX.neural,
    roughnessMap: TEX.neuralRug, roughness: .78, sheenColor: 0xffc6d6, emissive: 0x1d0a16 }),
  /* MIELINA É A EXCEÇÃO HONESTA. É lipídio empilhado e realmente reflete em
     faixa. Aqui a laca não é descuido — é a coisa. Mas fica baixa: em .5 a
     bainha virava pérola de colar. */
  /* Estava clara demais: sob a exposição da cena as quatro bainhas estouravam
     em branco e perdiam a lamela — e superfície sem textura é a definição de
     plástico, a mesma armadilha do tendão no músculo. */
  /* LAVAVA NO PICO. Sobre uma parede clara e sob a exposição da cena, em
     0xbcab90 com sheen .45 as quatro bainhas estouravam em branco e perdiam a
     lamela — e superfície sem textura é a definição de plástico, a mesma
     armadilha do tendão no músculo. Mais escura e mais fosca, ela continua
     lendo como lipídio e para de competir com a onda por brilho. */
  mielina: phys({ color: 0x9c8a6e, map: TEX.mielina, roughness: .56, sheen: .30,
    sheenColor: 0xf4e3c8, clearcoat: .10, clearcoatRoughness: .58 }),
  /* vidro de micropipeta: aqui clearcoat alto é a verdade do material */
  vidro: phys({ color: 0xbcd6e4, roughness: .06, transmission: .0, transparent: true, opacity: .22,
    side: THREE.FrontSide, clearcoat: .9, clearcoatRoughness: .08, depthWrite: false }),
  metal: phys({ color: 0x9fa6ad, roughness: .32, metalness: .85 }),

  cabeca: phys({ color: 0xffffff, vertexColors: true, roughness: .44, clearcoat: 0,
    sheen: .35, sheenRoughness: .7, sheenColor: 0xffe6c0 }),
  cauda: phys({ color: 0x6a564a, roughness: .82, clearcoat: 0 }),
  bicamadaLonge: phys({ color: 0xcbb69c, map: TEX.bicamadaLonge, roughness: .62, clearcoat: 0,
    sheen: .3, sheenColor: 0xffe0bb }),
  /* corte da bicamada: o miolo hidrofóbico visto de lado */
  miolo: phys({ color: 0x4b3a33, roughness: .78, side: THREE.DoubleSide }),

  /* Os íons são ESQUEMA, não carne: aqui um pouco de brilho ajuda, porque o
     que se lê é o contraste entre os dois sinais. Mas o volume vem do
     emissivo, não da laca — em .5 de clearcoat viravam confeito. */
  cargaPos: phys({ color: 0xffffff, vertexColors: true, roughness: .38, clearcoat: .10,
    clearcoatRoughness: .5, emissive: 0x612a05, emissiveIntensity: .55 }),
  cargaNeg: phys({ color: 0xffffff, vertexColors: true, roughness: .38, clearcoat: .10,
    clearcoatRoughness: .5, emissive: 0x0b2a5c, emissiveIntensity: .55 }),

  proteina: vivo({ color: 0xffffff, vertexColors: true, roughness: .58, sheenColor: 0xbfe6d8,
    emissive: 0x0b2b26, emissiveIntensity: .42 }),
  filtro: phys({ color: 0xe6c766, roughness: .40, clearcoat: .12, clearcoatRoughness: .5 }),
  atp: phys({ color: 0x8fd47a, roughness: .42, emissive: 0x123a12, emissiveIntensity: .6 }),
  poro: phys({ color: 0xffffff, vertexColors: true, roughness: .84, clearcoat: 0 }),
  /* A MESMA COR DO MARCADOR QUE CORRE SOBRE A CURVA. É ela que amarra o
     gráfico à figura sem precisar de legenda: o aluno vê laranja nos dois
     lugares e entende que são a mesma coisa. Se alguém mudar uma, tem de
     mudar a outra — está anotado nos dois arquivos. */
  marcador: phys({ color: 0xff9d2e, roughness: .35, clearcoat: .2, clearcoatRoughness: .4,
    emissive: 0x7a3a02, emissiveIntensity: 1.1 }),

  /* ---- nível 02: a célula em corte ---- */
  /* O NÚCLEO NÃO PODE SER ROXO. Nesta página a cor diz SINAL DE CARGA — quente
     é cátion, frio é ânion —, e um núcleo violeta do tamanho de um punho
     mandava a mensagem errada mais alto que todos os íons juntos. Em pardo
     neutro ele volta a ser o que é: uma organela, sem carga a declarar. */
  nucleo: vivo({ color: 0xffffff, vertexColors: true, roughness: .70, sheenColor: 0xe8d4c4,
    emissive: 0x1d1310, emissiveIntensity: .38 }),
  nucleolo: phys({ color: 0x7a6250, roughness: .62, clearcoat: 0, sheen: .35, sheenColor: 0xe0cbb4 }),

  /* ---- anotação: a régua não é objeto da cena, é legenda em três dimensões,
     e por isso brilha por conta própria em vez de receber luz ---- */
  regua: phys({ color: 0xe6c46a, roughness: .5, clearcoat: 0, emissive: 0x7a5a12, emissiveIntensity: 1.1 }),

  /* ---- moléculas que atravessam sem proteína nenhuma ---- */
  oxigenio: phys({ color: 0xa8e6d0, roughness: .34, clearcoat: .12, clearcoatRoughness: .5,
    emissive: 0x0d3a2c, emissiveIntensity: .55 }),
  carbono: phys({ color: 0x9aa3ad, roughness: .40, clearcoat: .10, emissive: 0x1c2228, emissiveIntensity: .45 }),
  glicose: phys({ color: 0xe8a35c, roughness: .44, clearcoat: .12, clearcoatRoughness: .5,
    emissive: 0x4a2408, emissiveIntensity: .5 }),

  axonioFora: phys({ color: 0xffffff, map: TEX.ondaFora, roughness: .52, clearcoat: 0,
    sheen: .3, sheenRoughness: .8, sheenColor: 0xffd0c0, emissive: 0x120810, emissiveIntensity: .3,
    emissiveMap: TEX.ondaFora }),
  axonioDentro: phys({ color: 0xffffff, map: TEX.ondaDentro, roughness: .58, clearcoat: 0,
    sheen: .25, sheenColor: 0xc9d8ff, emissive: 0x0a0d18, emissiveIntensity: .35,
    emissiveMap: TEX.ondaDentro }),
  parede: phys({ color: 0x54423c, roughness: .74, side: THREE.DoubleSide }),
  /* os sinais + e − são LEGENDA, não tecido: podem brilhar um pouco por conta
     própria, senão somem contra a parede que eles descrevem */
  sinal: phys({ color: 0xffffff, vertexColors: true, roughness: .40,
    clearcoat: .10, clearcoatRoughness: .50, emissive: 0x2a241a, emissiveIntensity: 1.0 }),
  corte: phys({ color: 0xcfc0a4, map: TEX.corte, roughness: .70, clearcoat: 0, side: THREE.DoubleSide }),
};

/* ============================================================ utilidades */
function tintar(geo, cor) {
  const n = geo.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = cor.r; arr[i * 3 + 1] = cor.g; arr[i * 3 + 2] = cor.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}
/* A face de trás vira a face da frente NA GEOMETRIA — ver o cabeçalho. */
function peloAvesso(mesh) {
  const g = mesh.geometry;
  if (g.index) {
    const a = g.index.array;
    for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; }
    g.index.needsUpdate = true;
  }
  g.computeVertexNormals();
  const n = g.attributes.normal.array;
  for (let i = 0; i < n.length; i++) n[i] = -n[i];
  g.attributes.normal.needsUpdate = true;
  return mesh;
}
/* SOMBRA DE CONTATO ENTRE PEÇAS DE UM FEIXE, em torno do eixo Y — é o que
   separa uma hélice da vizinha num canal. Sem ela, seis hélices coladas viram
   um copo com canelura, que é a mesma armadilha da cápsula estriada: sem
   sombra entre as peças, o olho resolve pela hipótese mais simples e lê um
   corpo só com relevo na casca.

   Oclusão de ambiente de verdade custa um render à parte. Esta é a
   aproximação que serve a feixe paralelo, e é geométrica: um ponto está tão
   escondido quanto (a) sua normal aponta para DENTRO do feixe, onde só há
   vizinho, e (b) ele está fundo. Os dois se multiplicam, e o resultado entra
   na cor de vértice, que os materiais já leem. */
function ocluirNoAnel(geo, cor, raioFeixe, piso = .34) {
  geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const n = pos.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), z = pos.getZ(i), d = Math.hypot(x, z) || 1e-6;
    const aberto = (nor.getX(i) * (x / d) + nor.getZ(i) * (z / d) + 1) * .5;
    const prof = Math.min(1, d / raioFeixe);
    const ao = piso + (1 - piso) * Math.pow(aberto, 1.3) * (.44 + .56 * prof);
    arr[i * 3] = cor.r * ao; arr[i * 3 + 1] = cor.g * ao; arr[i * 3 + 2] = cor.b * ao;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

function variar(hex, dh, ds, dl) {
  const c = C(hex), hsl = {}; c.getHSL(hsl);
  return c.setHSL(hsl.h + rnd(-dh, dh), clamp(hsl.s + rnd(-ds, ds), 0, 1), clamp(hsl.l + rnd(-dl, dl), 0, 1));
}
function tuboPerfil(curva, raio, { segsU = 60, segsV = 12 } = {}) {
  const geo = new THREE.TubeGeometry(curva, segsU, 1, segsV, false);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  const p = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    p.fromBufferAttribute(pos, i); curva.getPointAt(u, c);
    p.sub(c).multiplyScalar(Math.max(1e-4, raio(u))).add(c);
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return geo;
}
function curvaDePontos(fn, n = 24) {
  const pts = []; for (let i = 0; i <= n; i++) pts.push(fn(i / n));
  return new THREE.CatmullRomCurve3(pts);
}

/* ── A NUVEM DE CARGAS ────────────────────────────────────────────────────
   Cada íon tem DOIS endereços: um no volume (onde ele está quando não faz
   parte da película) e um colado na face da membrana. O controle de
   permeabilidade não acende nem apaga nada — ele MUDA O ENDEREÇO, e é isso
   que torna a demonstração honesta: o íon que entra na película some do
   volume, porque é de lá que ele veio.

   Uma malha por sinal, e não uma por íon: 600 esferas separadas seriam 600
   chamadas de desenho e um GLB inútil. Fundidas, são duas. */
function nuvem(cargas, mat) {
  const base = new THREE.SphereGeometry(1, 7, 5);
  const vpe = base.attributes.position.count;
  const geo = mergeGeometries(cargas.map(c => tintar(base.clone(), c.cor)));
  const off = Float32Array.from(geo.attributes.position.array);
  for (let k = 0; k < cargas.length; k++) {
    const r = cargas[k].r;
    for (let j = 0; j < vpe; j++) { const i = (k * vpe + j) * 3; off[i] *= r; off[i + 1] *= r; off[i + 2] *= r; }
  }
  /* sem mapa, sem uv: o exportador grava tudo o que estiver na geometria, e
     600 esferas carregando coordenada de textura que ninguém lê engordam o
     GLB que o telefone vai ter de abrir */
  geo.deleteAttribute('uv');
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.nuvem = { cargas, off, vpe };
  return mesh;
}
function moverNuvem(mesh, fracao) {
  const { cargas, off, vpe } = mesh.userData.nuvem;
  const attr = mesh.geometry.attributes.position, arr = attr.array;
  for (let k = 0; k < cargas.length; k++) {
    const c = cargas[k], f = suave(clamp(fracao(c), 0, 1));
    const cx = c.bulk.x + (c.filme.x - c.bulk.x) * f;
    const cy = c.bulk.y + (c.filme.y - c.bulk.y) * f;
    const cz = c.bulk.z + (c.filme.z - c.bulk.z) * f;
    for (let j = 0; j < vpe; j++) {
      const i = (k * vpe + j) * 3;
      arr[i] = cx + off[i]; arr[i + 1] = cy + off[i + 1]; arr[i + 2] = cz + off[i + 2];
    }
  }
  attr.needsUpdate = true; mesh.geometry.computeBoundingSphere();
}

/* Espécies: cor, raio e onde cada uma mora. Sódio fora, potássio dentro,
   cloreto fora, e os ânions orgânicos (proteínas, fosfatos) presos dentro —
   estes são a razão de o interior ser eletronegativo quando o potássio sai. */
/* A COR CODIFICA O SINAL, NÃO A ESPÉCIE. O primeiro jogo tinha K+ e A- os
   dois em roxo, e com isso a única coisa que o nível 02 precisa provar — que
   positivos e negativos estão em número igual — virava impossível de LER: o
   volume parecia roxo de ponta a ponta. Agora todo cátion é quente e todo
   ânion é frio; a espécie se distingue pelo tom e pelo tamanho dentro do seu
   sinal. O olho conta cargas antes de ler legenda. */
const ION = {
  K:  { z: +1, cor: 0xffc22e, r: .052 },
  Na: { z: +1, cor: 0xff8a3c, r: .046 },
  Cl: { z: -1, cor: 0x5fd0ea, r: .058 },
  A:  { z: -1, cor: 0x7b86e6, r: .086 },
};

/* ── CADA ÍON VAI RETO PARA A FACE MAIS PRÓXIMA ───────────────────────────
   O endereço na película era um ponto sorteado de uma grade, longe de onde o
   íon estava. Consequência: com a página em −76 mV o deslocamento fica em 93%
   do caminho, e como cada um vinha de um lugar e ia para outro, os 93% caíam
   espalhados numa faixa — nunca numa fila. A película só fechava exatamente
   em 100%, potencial que a página nunca mostra.

   O conserto é também o modelo mais honesto: o íon não procura vaga, ele é
   puxado para a face que tem ao lado. Mantendo x e z (ou a direção radial, no
   nível 02) e mexendo só na distância à membrana, o caminho de todos é
   paralelo — e em qualquer fração eles param na MESMA altura. A fila fecha
   sozinha, e fecha proporcional ao potencial, que é o que se quer ver. */
function popular({ especies, n, lado, faixa, faceY, larg = MEM.x }) {
  const cargas = [];
  for (let i = 0; i < n; i++) {
    const e = especies[i % especies.length], d = ION[e];
    const bx = rnd(-larg * .96, larg * .96), bz = rnd(-MEM.z * .94, MEM.z * .94);
    cargas.push({
      especie: e, z: d.z, lado, r: d.r, cor: variar(d.cor, .02, .10, .06),
      bulk: V(bx, memY(bx, bz) + lado * rnd(faixa[0], faixa[1]), bz),
      filme: V(bx, memY(bx, bz) + lado * faceY, bz),
    });
  }
  return cargas;
}

/* ── as duas superfícies curvas da bicamada ─────────────────────────────── */
function planoCurvo(mat, y0, { seg = 44, larg = MEM.x } = {}) {
  const g = new THREE.PlaneGeometry(larg * 2, MEM.z * 2, seg, Math.round(seg * MEM.z / larg));
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, memY(p.getX(i), p.getZ(i)) + y0);
  p.needsUpdate = true; g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

/* ── A BICAMADA DE PERTO ──────────────────────────────────────────────────
   É a única escala em que desenhar fosfolipídio individual ensina alguma
   coisa — no nível 02 ele vira pontilhado, e é assim que tem de ser.

   DUAS COISAS MUDARAM DEPOIS DE OLHAR A FOTO:
   1. AS CAUDAS ERAM DOIS PALITOS RETOS, finos, e some no meio: a membrana
      lida como duas fileiras de contas sobre uma tábua. Cauda de verdade
      DOBRA — a insaturação cis põe um joelho no meio dela, e é esse joelho
      que impede o empacotamento perfeito e dá à bicamada a espessura que ela
      tem. Duas caudas por cabeça, cada uma em dois trechos com ângulo.
   2. A BORDA SAIU. Havia uma moldura de caixas em volta do retalho, e ela
      lia como bandeja. Sem moldura, quem faz o corte é a própria fileira de
      cabeças vista de lado, com o miolo escuro entre elas: é o corte de
      verdade, em geometria, e não uma textura de corte pintada numa borda. */
function bicamadaDePerto({ passo = .295, rc = .112, esp = 5 * NM - 2 * .112, buracos = [], larg = MEM.x } = {}) {
  const g = new THREE.Group();
  const cab = [], cau = [];
  const baseCab = new THREE.SphereGeometry(rc, 9, 7);
  const meio = esp / 2 - rc * .55;
  const tSup = new THREE.CylinderGeometry(.034, .030, meio * .52, 5, 1, true);
  const tInf = new THREE.CylinderGeometry(.030, .022, meio * .56, 5, 1, true);
  const nx = Math.floor(larg * 2 / passo), nz = Math.floor(MEM.z * 2 / passo);
  for (let ix = 0; ix <= nx; ix++) for (let iz = 0; iz <= nz; iz++) {
    const x = -larg + ix * passo + rnd(-.02, .02), z = -MEM.z + iz * passo + rnd(-.02, .02);
    if (buracos.some(b => Math.hypot(x - b.x, z - b.z) < b.r)) continue;
    for (const lado of [1, -1]) {
      const y = memY(x, z) + lado * esp / 2;
      /* CABEÇA NÃO PODE TER A COR DO POTÁSSIO. No creme claro original, com o
         potencial invertido a fila de K+ pousava sobre a folha e as duas
         viravam a mesma coisa — a película sumia bem no quadro em que ela é o
         assunto. Taupe apagado: continua sendo cabeça polar, deixa de
         competir com íon nenhum. */
      const c = baseCab.clone(); tintar(c, variar(lado > 0 ? 0xc9b394 : 0xbfa889, .015, .07, .06));
      c.translate(x, y, z); cab.push(c);
      for (const dx of [-.048, .048]) {
        const inc = rnd(.28, .48) * Math.sign(dx);
        const yA = y - lado * (rc * .45 + meio * .26);
        const a = tSup.clone();
        a.rotateZ(inc * .35); a.translate(x + dx, yA, z + rnd(-.03, .03));
        cau.push(a);
        /* o joelho: o segundo trecho sai em ângulo, e é ele que tira da
           membrana a cara de escova */
        const b = tInf.clone();
        b.rotateZ(-inc); b.translate(x + dx - inc * .05, yA - lado * meio * .54, z + rnd(-.03, .03));
        cau.push(b);
      }
    }
  }
  g.add(new THREE.Mesh(mergeGeometries(cab), M.cabeca));
  const geoCau = mergeGeometries(cau); geoCau.deleteAttribute('uv');
  g.add(new THREE.Mesh(geoCau, M.cauda));
  /* o miolo hidrofóbico fecha o vão entre as caudas: sem ele, de raspão a
     membrana é um vidro furado e o olho atravessa a parede */
  g.add(planoCurvo(M.miolo, .055, { larg }));
  g.add(peloAvesso(planoCurvo(M.miolo, -.055, { larg })));
  return g;
}

/* ============================================================ 01 NEURÔNIO
   ── POR QUE ESTE NÍVEL FOI REFEITO ───────────────────────────────────────
   A queixa é de aspecto, e o diagnóstico é o mesmo de sempre nesta bancada:
   não era o material, era a MONTAGEM. O que havia era uma bola de ruído com
   seis tubos espetados nela, todos do mesmo comprimento, todos abrindo dois
   ramos nas mesmas alturas, todos partindo do mesmo raio. Isso não é um
   neurônio — é um jaque, um brinquedo de encaixe. E a peça de encaixe se
   denuncia por quatro coisas, nesta ordem de culpa:

   1. A JUNÇÃO ERA UMA COSTURA. Tubo encostado em esfera deixa uma quina, e
      quina é solda. Célula não tem solda: o soma SE ESTICA para virar
      dendrito. Agora cada direção de saída puxa a superfície do soma para
      fora num cone suave (`flareEm`), e o dendrito nasce com o raio dessa
      saliência e afina depois — a passagem de um para o outro deixa de ter
      ponto onde começar.
   2. A ÁRVORE ERA UM PENTE. Ramificação em alturas fixas, ângulos fixos e
      dois filhos iguais lê como gerador de peça. Agora é recursiva e obedece
      à lei de Rall — o diâmetro do pai elevado a 3/2 é a SOMA dos filhos —,
      com repartição desigual: um ramo grosso e um fino, como na natureza.
   3. OS RAMOS ERAM CONES LISOS. Dendrito tem varicosidade: engrossa e afina
      ao longo do caminho. Cone perfeito é torneado, e torneado é plástico —
      a mesma armadilha que a cápsula do músculo.
   4. NÃO HAVIA ESPINHAS. É o detalhe que mais rápido diz "isto está vivo",
      e é barato: um pescoço e uma cabecinha nos ramos distais, que é
      exatamente onde elas existem.

   E os primários deixaram de ser iguais: um domina, os outros escalonam. Foi
   a simetria perfeita entre eles que dava a leitura de estrela-do-mar.      */
function ruido3(x, y, z) {
  return Math.sin(x * 3.1 + y * 1.7) * .5 + Math.sin(y * 2.3 + z * 2.9) * .3 + Math.sin(z * 4.1 + x * 1.3) * .2;
}
function ocluirPorCentro(geo, cor, centro, raio, piso = .40) {
  const pos = geo.attributes.position, n = pos.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const d = Math.hypot(pos.getX(i) - centro.x, pos.getY(i) - centro.y, pos.getZ(i) - centro.z);
    const ao = piso + (1 - piso) * clamp((d - raio * .78) / (raio * .95), 0, 1);
    arr[i * 3] = cor.r * ao; arr[i * 3 + 1] = cor.g * ao; arr[i * 3 + 2] = cor.b * ao;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}
const COR_NEURO = 0xd9b3bd;
const SOMA = { R: .60 };

/* Uma espinha dendrítica: pescoço fino e cabeça. Construída deitada no eixo Y
   e depois posta no lugar por matriz — orientar cada uma por rotação de malha
   custaria uma malha por espinha, e são duas centenas delas. */
function espinha(ponto, dir, comp, esc = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir);
  const m = new THREE.Matrix4().compose(ponto, q, V(1, 1, 1));
  /* a espinha acompanha a grossura do ramo onde nasce: fixa, ela virava
     bengala nos galhos finos e cravo nos grossos */
  const pescoco = new THREE.CylinderGeometry(.0085 * esc, .012 * esc, comp, 5, 1);
  pescoco.translate(0, comp / 2, 0);
  const cabeca = new THREE.SphereGeometry(.0205 * esc, 7, 5);
  cabeca.translate(0, comp + .008 * esc, 0);
  const g = mergeGeometries([pescoco, cabeca]);
  g.applyMatrix4(m);
  return g;
}

function neuronio() {
  const g = new THREE.Group(), R = SOMA.R;

  /* primários DESIGUAIS: um dominante, os outros escalonando. Seis iguais em
     torno de uma bola é um jaque, e nenhum ajuste de superfície conserta
     simetria de arranjo. */
  const prim = [
    [-.52, .88, .22, 2.05, .128],
    [-.96, .18, -.20, 1.72, .110],
    [-.68, -.60, .48, 1.52, .096],
    [-.28, -.92, -.32, 1.28, .085],
    [-.56, .24, .82, 1.40, .091],
    [-.44, -.26, -.88, 1.16, .080],
  ].map(([x, y, z, comp, r]) => ({ d: V(x, y, z).normalize(), comp, r }));
  const dirAxo = V(.97, -.10, .12).normalize();

  /* o soma se estica na direção de cada saída: é isto que apaga a costura */
  const flareEm = n => {
    let f = 0;
    for (const p of prim) f += (p.r / .128) * Math.pow(Math.max(0, n.dot(p.d)), 5);
    f += 1.15 * Math.pow(Math.max(0, n.dot(dirAxo)), 7);
    return f * .40;
  };
  const raioSoma = n => {
    const ruido = 1 + .080 * ruido3(n.x * 2.4, n.y * 2.1, n.z * 2.6)
      + .032 * ruido3(n.x * 5.7, n.y * 4.9, n.z * 6.3)
      + .013 * ruido3(n.x * 11.3, n.y * 9.5, n.z * 12.1);
    return R * ruido * (1 + flareEm(n));
  };
  const geoS = new THREE.SphereGeometry(1, 92, 64);
  const ps = geoS.attributes.position, nn = new THREE.Vector3();
  for (let i = 0; i < ps.count; i++) {
    nn.fromBufferAttribute(ps, i).normalize();
    const r = raioSoma(nn);
    ps.setXYZ(i, nn.x * r, nn.y * r * .97, nn.z * r * .93);
  }
  ps.needsUpdate = true; geoS.computeVertexNormals();
  tintar(geoS, C(COR_NEURO));
  g.add(new THREE.Mesh(geoS, M.neuronio));

  /* ── a árvore ────────────────────────────────────────────────────────── */
  const galhos = [], espinhos = [];
  let semente = 0;
  function ramo(base, dir, raio, comp, ordem, alarga) {
    const s = ++semente;
    const up = Math.abs(dir.y) < .9 ? V(0, 1, 0) : V(1, 0, 0);
    const n1 = V().crossVectors(dir, up).normalize();
    const n2 = V().crossVectors(dir, n1).normalize();
    const torto = rnd(.30, .62) * (ordem >= 2 ? .65 : 1);
    const curva = curvaDePontos(t => base.clone()
      .addScaledVector(dir, t * comp)
      .addScaledVector(n1, Math.sin(t * 2.2 + s) * torto * t * comp * .34)
      .addScaledVector(n2, Math.sin(t * 1.6 + s * 1.7) * torto * t * comp * .28), 20);
    /* O AFINAMENTO COMPOSTO SECAVA A ÁRVORE. Com 0,62 por trecho e mais a
       repartição de Rall a cada bifurcação, quatro ordens levavam a ponta a
       seis milésimos — um arbusto seco, não um dendrito. O trecho afina
       menos, e o perfil tem piso: ramo distal é fino, não é fio. */
    const rFim = Math.max(.013, raio * (ordem === 0 ? .55 : .76));
    /* alarga: só o trecho primário nasce inchado, do tamanho da saliência do
       soma, e afina depressa — é a continuação da carne, não um encaixe */
    const perfil = u => {
      const base = raio + (rFim - raio) * u;
      const boca = alarga ? 1 + 1.05 * Math.exp(-Math.pow(u / .17, 2)) : 1;
      /* varicosidade: dendrito engrossa e afina, não é cone de torno */
      return Math.max(.011, base * boca * (1 + .095 * Math.sin(u * 12 + s) + .055 * Math.sin(u * 26 + s * 2.1)));
    };
    galhos.push(ocluirPorCentro(
      tuboPerfil(curva, perfil, { segsU: ordem === 0 ? 34 : ordem === 3 ? 14 : 20, segsV: ordem === 0 ? 12 : ordem === 3 ? 7 : 9 }),
      variar(COR_NEURO, .012, .07, .04 + ordem * .02), V(0, 0, 0), R));

    if (ordem >= 2) {
      const quantas = ordem === 2 ? 6 : 9;
      for (let i = 0; i < quantas; i++) {
        const u = rnd(.14, .96);
        const p = curva.getPointAt(u), tan = curva.getTangentAt(u).normalize();
        const e1 = V().crossVectors(tan, Math.abs(tan.y) < .9 ? V(0, 1, 0) : V(1, 0, 0)).normalize();
        const e2 = V().crossVectors(tan, e1).normalize();
        const a = rnd(0, Math.PI * 2);
        const fora = e1.multiplyScalar(Math.cos(a)).addScaledVector(e2, Math.sin(a)).normalize();
        const rLocal = perfil(u);
        espinhos.push(espinha(p.addScaledVector(fora, rLocal * .72), fora,
          rnd(.040, .080) * clamp(rLocal / .040, .6, 1.25), clamp(rLocal / .040, .55, 1.3)));
      }
    }
    if (ordem >= 3) return;

    /* Lei de Rall: d(pai)^1.5 = d(f1)^1.5 + d(f2)^1.5. A repartição é
       DESIGUAL de propósito — dois filhos iguais é a assinatura do gerador */
    const fim = curva.getPointAt(1), tan = curva.getTangentAt(1).normalize();
    const eixo = V(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).cross(tan).normalize();
    const f = rnd(.56, .74);
    const filhos = [
      { r: Math.max(.013, rFim * Math.pow(f, 2 / 3)), ang: rnd(.26, .48), esc: rnd(.62, .84) },
      { r: Math.max(.012, rFim * Math.pow(1 - f, 2 / 3)), ang: -rnd(.34, .62), esc: rnd(.44, .68) },
    ];
    for (const c of filhos) {
      ramo(fim, tan.clone().applyAxisAngle(eixo, c.ang).normalize(), c.r, comp * c.esc, ordem + 1, false);
    }
  }
  for (const p of prim) {
    const nrm = p.d.clone();
    ramo(nrm.clone().multiplyScalar(raioSoma(nrm) * .82), p.d, p.r, p.comp, 0, true);
  }
  g.add(new THREE.Mesh(mergeGeometries(galhos), M.neuronio));
  g.add(new THREE.Mesh(mergeGeometries(espinhos), M.neuronio));

  /* ── cone de implantação e axônio ────────────────────────────────────── */
  const eixo = curvaDePontos(t => V(R * .50 + t * 3.15, Math.sin(t * 2.4) * .11 - t * .07, Math.sin(t * 1.5) * .08), 28);
  g.add(new THREE.Mesh(ocluirPorCentro(
    tuboPerfil(eixo, u => .094 + .165 * Math.exp(-Math.pow(u / .11, 2)), { segsU: 74, segsV: 14 }),
    C(COR_NEURO), V(0, 0, 0), R), M.neuronio));

  /* ── BAINHAS DE MIELINA ────────────────────────────────────────────────
     ESTAS ERAM CÁPSULAS, LITERALMENTE. Quatro CapsuleGeometry de mesmo
     comprimento, mesmo raio e pontas hemisféricas, enfileiradas com vão
     igual: a definição de comprimido em cartela. O conserto é de FORMA:
     internódio real AFINA para o nó, os quatro não têm o mesmo comprimento,
     e a bainha segue a curva do axônio em vez de ser um segmento reto. */
  const bainhas = [];
  /* AS BAINHAS AINDA ERAM CONTAS DE ROSÁRIO. Não pelo formato — esse já
     afinava — mas pela PROPORÇÃO: bainha de 0,168 sobre axônio de 0,078 é
     mais que o dobro, e o que se via era uma fieira de bolas num cordão. A
     bainha de verdade é uma casca sobre o axônio, não um bulbo em volta
     dele. Com o axônio mais grosso e a bainha menos inchada a razão cai para
     um e meio, e os vãos — desiguais agora — passam a ser o que chama
     atenção, que é o certo: o nó é o assunto. */
  const trechos = [[.175, .335], [.372, .560], [.594, .726], [.762, .955]];
  trechos.forEach(([u0, u1], i) => {
    const sub = curvaDePontos(t => eixo.getPointAt(u0 + t * (u1 - u0)), 16);
    const grossura = .148 - i * .006;
    bainhas.push(tuboPerfil(sub, u => {
      const ponta = clamp(Math.min(u, 1 - u) / .19, 0, 1);
      return .098 + (grossura - .098) * suave(ponta);
    }, { segsU: 34, segsV: 20 }));
  });
  g.add(new THREE.Mesh(mergeGeometries(bainhas), M.mielina));

  /* terminais: cinco, desiguais, com botões de tamanhos diferentes */
  const fim = eixo.getPointAt(1), term = [];
  for (let i = 0; i < 5; i++) {
    const d = V(.85 + rnd(-.1, .2), (i - 2) * .34 + rnd(-.08, .08), rnd(-.45, .45)).normalize();
    const len = rnd(.38, .68);
    const c = curvaDePontos(t => fim.clone().addScaledVector(d, t * len)
      .addScaledVector(V(0, 1, 0), Math.sin(t * 2.4 + i) * .05), 10);
    term.push(tintar(tuboPerfil(c, u => .048 - u * .014, { segsU: 14, segsV: 8 }), variar(COR_NEURO, .01, .06, .05)));
    const rb = rnd(.062, .098);
    const b = new THREE.SphereGeometry(rb, 14, 10);
    b.translate(fim.x + d.x * (len + rb * .5), fim.y + d.y * (len + rb * .5) + Math.sin(2.4 + i) * .05, fim.z + d.z * (len + rb * .5));
    term.push(tintar(b, variar(COR_NEURO, .01, .06, .05)));
  }
  g.add(new THREE.Mesh(mergeGeometries(term), M.neuronio));

  /* ── contexto: as duas pontas que medem ──────────────────────────────
     A micropipeta furando o soma e o eletrodo de referência no banho. Sem as
     duas o número −70 mV não quer dizer nada: potencial é DIFERENÇA, e o
     aluno que só vê um eletrodo entende voltagem como propriedade da célula,
     que é exatamente a confusão que esta página existe para desfazer.
     `foraDoQuadro` os tira do enquadramento: são contexto, não assunto. */
  const ctx = [];
  const haste = (de, ate, r0, r1, mat, segs = 20) => {
    const d = ate.clone().sub(de), m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, d.length(), segs, 1, true), mat);
    m.position.copy(de).add(ate).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
    return m;
  };
  const pontaPip = V(-.18, .28, .42), traseiraPip = V(-2.35, 2.55, 1.45);
  ctx.push(haste(traseiraPip, pontaPip, .155, .014, M.vidro));
  ctx.push(haste(traseiraPip.clone().lerp(pontaPip, .06), pontaPip.clone().lerp(traseiraPip, .10), .020, .006, M.metal, 10));
  const pontaRef = V(1.62, -1.18, .88);
  ctx.push(haste(V(2.85, -2.45, 1.62), pontaRef, .062, .030, M.metal, 14));
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(.075, 16, 12), M.metal);
  bulbo.position.copy(pontaRef); ctx.push(bulbo);
  ctx.forEach(o => { o.userData.foraDoQuadro = true; g.add(o); });

  g.userData.foco = V(0, .22, .58);
  return g;
}

/* ============================================================ a película
   Registro central: cada nível que tenha nuvem de cargas se inscreve aqui, e
   `aplicarPotencial` move todas de uma vez. Uma regra só, três níveis. */
const filmes = [];
function inscrever(mesh) { filmes.push(mesh); return mesh; }
function fixar(cargas) { cargas.forEach(c => { c.filme = c.bulk; c.pode = false; }); return cargas; }
function sortear(cargas, p) { cargas.forEach(c => { c.pode = Math.random() < p; }); return cargas; }

const EM_CHEIO = 90; // mV que enchem a película por completo no desenho
/* A regra inteira em cinco linhas. A face de dentro carrega o sinal de Em; a
   de fora, o oposto. Um íon só entra na película da SUA face — potássio de
   dentro não tem como se alinhar do lado de fora sem atravessar a membrana. */
function fracaoDe(Em) {
  const s = Math.sign(Em), mag = clamp(Math.abs(Em) / EM_CHEIO, 0, 1);
  return c => {
    if (!c.pode || s === 0) return 0;
    const precisa = c.lado > 0 ? s : -s;
    return c.z === precisa ? mag : 0;
  };
}
function aplicarPotencial(Em) {
  const f = fracaoDe(Em);
  filmes.forEach(m => moverNuvem(m, f));
}

/* ============================================================ 02 INTERIOR
   ── POR QUE ESTE NÍVEL FOI REFEITO DO ZERO ───────────────────────────────
   A primeira versão era uma tábua horizontal com confete em cima e embaixo.
   Ela dizia a frase certa — o volume é neutro — e não mostrava CÉLULA
   nenhuma: sem corpo, sem parede fechada, sem dentro. E o erro que esta
   página existe para desfazer é justamente espacial. Uma tábua não desfaz
   uma ideia errada sobre um corpo.

   Agora é a célula inteira, aberta numa fatia. O que muda não é o enfeite:
   • a parede é FECHADA, então "dentro" e "fora" são lugares e não lados;
   • a película forra a parede TODA, por dentro e por fora, e forrar é a
     palavra certa — o aluno vê uma casca, não uma fileira;
   • o volume, com núcleo e tudo, aparece cheio dos dois sinais em número
     igual, do centro à parede.
   E o mergulho para o nível 03 passa a fazer sentido sozinho: aproximando-se
   da parede, ela vira plana — que é exatamente como os níveis seguintes a
   desenham.                                                                */
/* A parede em .16 sobre um raio de 2,05 lia como casca de coco: a célula
   virava fruta. Fina, ela volta a ser membrana — e a exageração continua
   enorme (na verdade seria 0,02% do raio), o que o texto do nível diz. */
const CEL = { R: 2.05, par: .105, abre: .95, rNuc: .68 };
CEL.ini = Math.PI / 2 + CEL.abre;
CEL.arco = Math.PI * 2 - 2 * CEL.abre;
CEL.nuc = V(-.42, .18, -.30);

/* A fatia aberta precisa de duas faces planas, uma em cada corte. Um anel
   deitado no plano XY vira meia coroa no plano do corte com dois giros: o
   primeiro leva o ângulo do anel a virar latitude, o segundo aponta o plano
   para o azimute pedido. Sem elas a parede é papel: aparece com dois lados e
   espessura nenhuma. */
function faceDoCorte(phi, r0, r1) {
  const g = new THREE.RingGeometry(r0, r1, 44, 1, 0, Math.PI);
  /* As uv que o anel traz são planares e correm com o ÂNGULO: com elas, a
     textura de corte pintaria as três faixas em volta da coroa em vez de
     atravessá-la. Refeitas pelo raio, a faixa clara cai nas cabeças de fora,
     a escura no miolo e a clara de novo nas de dentro — e a parede da célula
     passa a ter, no corte, a mesma leitura que o nível 03 mostra de perto. */
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i));
    uv.setXY(i, uv.getX(i), (r - r0) / (r1 - r0));
  }
  uv.needsUpdate = true;
  g.rotateZ(-Math.PI / 2); g.rotateY(phi + Math.PI);
  return g;
}
function direcaoAoAcaso() {
  let d;
  do { d = V(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)); } while (d.lengthSq() < .01 || d.lengthSq() > 1);
  return d.normalize();
}
function popularEsfera({ especies, n, lado, rDe, rAte, rFilme, semNucleo = false }) {
  const cargas = [];
  for (let i = 0; i < n; i++) {
    const e = especies[i % especies.length], d = ION[e];
    let p, tent = 0;
    do {
      /* raiz cúbica: sem ela a amostragem entope o centro e esvazia a beirada,
         e o citoplasma sai com um caroço de íons no meio */
      const t = Math.cbrt(rnd(Math.pow(rDe / rAte, 3), 1));
      p = direcaoAoAcaso().multiplyScalar(rAte * t);
    } while (semNucleo && p.distanceTo(CEL.nuc) < CEL.rNuc + .16 && ++tent < 50);
    cargas.push({
      especie: e, z: d.z, lado, r: d.r, cor: variar(d.cor, .02, .10, .06),
      /* mesma regra do retalho plano, em coordenada radial: o íon sobe ou
         desce pela SUA linha até a casca, e por isso a película forra a
         parede inteira em qualquer potencial parcial */
      bulk: p, filme: p.clone().normalize().multiplyScalar(rFilme),
    });
  }
  return cargas;
}

function interior() {
  const g = new THREE.Group();
  const { R, par, ini, arco, rNuc } = CEL, Rin = R - par;

  g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 76, 48, ini, arco), M.bicamadaLonge));
  g.add(peloAvesso(new THREE.Mesh(new THREE.SphereGeometry(Rin, 76, 48, ini, arco), M.bicamadaLonge)));
  g.add(new THREE.Mesh(mergeGeometries([faceDoCorte(ini, Rin, R), faceDoCorte(ini + arco, Rin, R)]), M.corte));

  /* núcleo deslocado por ruído: esfera lisa aqui seria pérola dentro de bola,
     e a página inteira existe para não parecer drágea */
  const geoN = new THREE.SphereGeometry(rNuc, 44, 32);
  const pn = geoN.attributes.position;
  for (let i = 0; i < pn.count; i++) {
    const x = pn.getX(i), y = pn.getY(i), z = pn.getZ(i);
    const d = 1 + .07 * ruido3(x * 3.1, y * 2.7, z * 3.4);
    pn.setXYZ(i, x * d, y * d * .95, z * d);
  }
  pn.needsUpdate = true; geoN.computeVertexNormals(); tintar(geoN, C(0xa89078));
  const nuc = new THREE.Mesh(geoN, M.nucleo); nuc.position.copy(CEL.nuc); g.add(nuc);
  const nucl = new THREE.Mesh(new THREE.SphereGeometry(.21, 20, 14), M.nucleolo);
  nucl.position.copy(CEL.nuc).add(V(.16, -.10, .18)); g.add(nucl);

  /* três tocos de dendrito: são eles que dizem que este corpo é o MESMO do
     nível 01, e é isso que faz o mergulho ser mergulho e não troca de assunto */
  const tocos = [];
  for (const d0 of [[-.86, .40, -.30], [-.62, -.66, .42], [-.30, .90, -.28]]) {
    const dir = V(...d0).normalize();
    const curva = curvaDePontos(t => dir.clone().multiplyScalar(R * .93 + t * .62), 10);
    tocos.push(tintar(tuboPerfil(curva, u => .17 * (1 - u * .45), { segsU: 16, segsV: 12 }), variar(0xc7a898, .01, .06, .05)));
  }
  g.add(new THREE.Mesh(mergeGeometries(tocos), M.neuronio));

  /* O VÃO ENTRE A FILA E O VOLUME É O QUE FAZ A FILA SER LIDA COMO FILA — a
     mesma medida que salvou o nível 03. Aqui ela é radial: a película forra a
     parede e o volume só começa meio raio adiante. */
  const rFilmeIn = Rin - .10, rFilmeFora = R + .11, bulkAte = Rin - .52;
  const dentro = [
    ...popularEsfera({ especies: ['K'], n: 176, lado: 1, rDe: .10, rAte: bulkAte, rFilme: rFilmeIn, semNucleo: true }),
    ...popularEsfera({ especies: ['A', 'A', 'Cl'], n: 176, lado: 1, rDe: .10, rAte: bulkAte, rFilme: rFilmeIn, semNucleo: true }),
  ];
  const fora = [
    ...popularEsfera({ especies: ['Na'], n: 128, lado: -1, rDe: R + .26, rAte: R + .80, rFilme: rFilmeFora }),
    ...popularEsfera({ especies: ['Cl'], n: 128, lado: -1, rDe: R + .26, rAte: R + .80, rFilme: rFilmeFora }),
  ];
  sortear(dentro, 1); sortear(fora, 1);
  /* e um volume que NUNCA sai do lugar, dos dois lados: sem ele, num potencial
     alto o citoplasma esvaziaria de um sinal e a página passaria a ensinar
     justamente o contrário do que quer */
  const parado = [
    ...popularEsfera({ especies: ['K'], n: 58, lado: 1, rDe: .10, rAte: bulkAte, rFilme: rFilmeIn, semNucleo: true }),
    ...popularEsfera({ especies: ['A', 'Cl'], n: 58, lado: 1, rDe: .10, rAte: bulkAte, rFilme: rFilmeIn, semNucleo: true }),
    ...popularEsfera({ especies: ['Na'], n: 40, lado: -1, rDe: R + .24, rAte: R + .80, rFilme: rFilmeFora }),
    ...popularEsfera({ especies: ['Cl'], n: 40, lado: -1, rDe: R + .24, rAte: R + .80, rFilme: rFilmeFora }),
  ];
  fixar(parado);
  const todas = dentro.concat(fora, parado);
  todas.forEach(c => { c.r *= .92; });
  g.add(inscrever(nuvem(todas.filter(c => c.z > 0), M.cargaPos)));
  g.add(inscrever(nuvem(todas.filter(c => c.z < 0), M.cargaNeg)));

  /* o mergulho mira a parede, não o miolo: é dela que nasce o nível 03 */
  g.userData.foco = V(1.12, .52, 1.48);
  return g;
}

/* ============================================================ 03 PELÍCULA
   O nível que dá nome à página, e o único da bancada que pode levar RÉGUA:
   aqui o desenho está em proporção. A bicamada mede 5 nm de superfície a
   superfície e a película fica dentro de cerca de 1 nm de cada face — as duas
   medidas vêm de NM e as duas réguas na cena marcam exatamente isso.

   O que não cabe em proporção é a célula inteira: 50 000 nm contra 1 nm. É
   por isso que existe um nível 02 e existe um mergulho.                     */
const SUP = 2.5 * NM;                 // superfície da bicamada, a partir do meio
const FACE = SUP + NM * .5;           // centro da película, meio nanômetro adiante

/* Uma régua de verdade: haste com dois traços, na altura que ela mede. O
   rótulo com o número vive em app.js, ancorado no mesmo lugar. */
function reguaY(x, z, y0, y1, braco = .26) {
  const g = [];
  const haste = new THREE.CylinderGeometry(.017, .017, Math.abs(y1 - y0), 6, 1);
  haste.translate(x, (y0 + y1) / 2, z); g.push(haste);
  for (const y of [y0, y1]) {
    const t = new THREE.CylinderGeometry(.014, .014, braco, 6, 1);
    t.rotateZ(Math.PI / 2); t.translate(x + braco / 2, y, z); g.push(t);
  }
  return new THREE.Mesh(mergeGeometries(g), M.regua);
}

function pelicula() {
  const g = new THREE.Group();
  g.add(bicamadaDePerto());
  const xr = -MEM.x - .30;
  g.add(reguaY(xr, .35, -SUP, SUP));          // bicamada: 5 nm
  g.add(reguaY(xr, -.35, SUP, FACE + NM * .5)); // película: 1 nm da face para dentro

  const migram = [
    ...popular({ especies: ['K'], n: 176, lado: 1, faixa: [1.02, 2.20], faceY: FACE }),
    ...popular({ especies: ['A', 'A', 'Cl'], n: 176, lado: 1, faixa: [1.02, 2.20], faceY: FACE }),
    ...popular({ especies: ['Na'], n: 132, lado: -1, faixa: [1.02, 2.10], faceY: FACE }),
    ...popular({ especies: ['Cl'], n: 132, lado: -1, faixa: [1.02, 2.10], faceY: FACE }),
  ];
  /* ── A ALTURA DO VOLUME É O CONSERTO QUE FEZ A PELÍCULA APARECER ──────
     Na primeira montagem o volume começava a 0,46 da membrana e a película
     ficava a 0,40: seis centésimos entre uma coisa e outra. Resultado, na
     foto: uma nuvem só, sem camada nenhuma, no nível que existe para mostrar
     a camada. O vão entre a fila e a nuvem é o que faz a fila ser lida como
     fila. */
  sortear(migram, 1);
  const parado = [
    ...popular({ especies: ['K'], n: 52, lado: 1, faixa: [1.06, 2.20], faceY: FACE }),
    ...popular({ especies: ['A', 'Cl'], n: 52, lado: 1, faixa: [1.06, 2.20], faceY: FACE }),
    ...popular({ especies: ['Na'], n: 52, lado: -1, faixa: [1.06, 2.10], faceY: FACE }),
    ...popular({ especies: ['Cl'], n: 52, lado: -1, faixa: [1.06, 2.10], faceY: FACE }),
  ];
  fixar(parado);
  const cargas = migram.concat(parado);
  cargas.forEach(c => { c.r *= 1.04; });
  g.add(inscrever(nuvem(cargas.filter(c => c.z > 0), M.cargaPos)));
  g.add(inscrever(nuvem(cargas.filter(c => c.z < 0), M.cargaNeg)));
  g.userData.foco = V(-1.10, 0, .30);
  return g;
}

/* ============================================================ 04 TRAVESSIAS
   A membrana não tem UMA porta: tem quatro maneiras de ser atravessada, e o
   que separa uma da outra são três perguntas — precisa de proteína? vai a
   favor do gradiente? gasta ATP? O nível põe as quatro lado a lado no mesmo
   retalho para que a comparação seja de olho, e não de tabela:

   1. DIFUSÃO SIMPLES PELA BICAMADA — sem proteína nenhuma. O O₂ entra e o CO₂
      sai dissolvendo-se no próprio lipídio. Só serve à molécula pequena e
      apolar, e é por isso que este posto não tem peça alguma: a AUSÊNCIA é a
      informação, e abrir um buraco ali seria a mentira exata.
   2. CANAL — poro cheio de água, com filtro que escolhe o íon. A favor do
      gradiente, rápido, e pode ser comportado: o de vazamento fica sempre
      aberto, o de Na⁺ dependente de voltagem só abre quando a permeabilidade
      sobe. Os dois estão aqui de propósito — a diferença entre eles é a única
      coisa que faz o nível 05 acontecer.
   3. DIFUSÃO FACILITADA — transportador. Liga a molécula, MUDA DE FORMA e
      solta do outro lado. A favor do gradiente também, mas lenta e saturável,
      e é a mudança de forma que explica as duas coisas. Por isso ele tem duas
      comportas que se alternam: nunca as duas abertas ao mesmo tempo, senão
      ele seria um canal largo e a distinção se perderia no desenho.
   4. TRANSPORTE ATIVO — a bomba Na⁺/K⁺. Contra o gradiente, e por isso gasta
      ATP: três sódios para fora, dois potássios para dentro.                */
function corpoProteico(perfil, cor, { radiais = 30, amp = .06 } = {}) {
  const pts = perfil.map(q => new THREE.Vector2(Math.max(1e-3, q.r), q.y));
  const geo = new THREE.LatheGeometry(pts, radiais);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const d = 1 + amp * ruido3(x * 4.6, y * 5.2, z * 4.6);
    p.setXYZ(i, x * d, y + amp * .35 * ruido3(z * 3.1, x * 3.7, y * 2.9), z * d);
  }
  p.needsUpdate = true; geo.computeVertexNormals();
  return tintar(geo, cor);
}
function ionzinho(especie, escala = 2.4) {
  const d = ION[especie];
  const m = new THREE.Mesh(new THREE.SphereGeometry(d.r * escala, 12, 9),
    (d.z > 0 ? M.cargaPos : M.cargaNeg).clone());
  m.material.vertexColors = false; m.material.color = C(d.cor);
  return m;
}
/* Gás não é íon e não pode parecer um. Dois átomos ligados leem como molécula
   à primeira olhada; três em fila, como CO₂. É essa diferença de silhueta que
   diz ao aluno, antes de qualquer rótulo, que este posto não é sobre carga. */
function molecula(n, raio, mat, passo) {
  const g = [];
  for (let i = 0; i < n; i++) {
    const e = new THREE.SphereGeometry(raio * (n === 3 && i === 1 ? 1.18 : 1), 14, 10);
    e.translate((i - (n - 1) / 2) * passo, 0, 0); g.push(e);
  }
  return new THREE.Mesh(mergeGeometries(g), mat);
}
function glicose() {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(.185, .185, .13, 6), M.glicose);
  m.rotation.x = Math.PI / 2.6; return m;
}

/* PROTEÍNA NÃO É PEÇA TORNEADA. A primeira versão era um perfil de revolução
   com boca larga e cintura estreita, e a foto devolveu três copos de plástico
   pastel sobre a membrana — o mesmo defeito da cápsula, de louça. O conserto é
   o que salvou o ventre do músculo: a peça não RECEBE a textura de feixe, ela
   É um feixe. Canal iônico é um punhado de hélices atravessando o lipídio em
   torno de um poro; desenhadas uma a uma, com sombra de contato entre elas e
   matiz próprio, some a revolução — e o poro passa a existir porque há um vão
   no meio, não porque alguém o esculpiu. */
function canalDeHelices({ y0, y1, raio, poro, nH = 6, rh = .085, torcao = .6, cor }) {
  const g = new THREE.Group(), geos = [];
  for (let i = 0; i < nH; i++) {
    const a0 = i / nH * Math.PI * 2 + rnd(-.07, .07), fase = rnd(-.05, .05);
    const curva = curvaDePontos(t => {
      const y = y0 + (y1 - y0) * t;
      const a = a0 + torcao * t + Math.sin(t * 3.1 + i) * .06 + fase;
      const r = raio(y);
      return V(Math.cos(a) * r, y, Math.sin(a) * r);
    }, 24);
    geos.push(ocluirNoAnel(
      tuboPerfil(curva, u => rh * (.80 + .32 * Math.sin(u * Math.PI) + .06 * Math.sin(u * 9 + i)), { segsU: 42, segsV: 10 }),
      variar(cor, .02, .09, .075), raio((y0 + y1) / 2) + rh));
  }
  g.add(new THREE.Mesh(mergeGeometries(geos), M.proteina));
  /* a parede do poro, vista POR DENTRO: é ela que faz a boca ser um buraco e
     não uma tampa, e é nela que o filtro de seletividade aperta */
  const pts = [];
  for (let i = 0; i <= 28; i++) { const t = i / 28, y = y0 + (y1 - y0) * t; pts.push({ y, r: poro(y) }); }
  g.add(peloAvesso(new THREE.Mesh(corpoProteico(pts, C(0x2f2722), { radiais: 30, amp: .03 }), M.poro)));
  return g;
}
function comporta(cor, r) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), M.proteina.clone());
  m.material.vertexColors = false; m.material.color = C(cor);
  m.scale.set(1, .46, 1); return m;
}

function portas() {
  const g = new THREE.Group();
  /* --- LARGURA CONTRA TAMANHO -----------------------------------------
     Com o retalho em 4,0 as cinco estacoes cabiam folgadas -- e a camera, que
     enquadra pelo raio do giro, recuava o bastante para transformar cada
     proteina num tufo de dois milimetros na tela. Um nivel que existe para
     COMPARAR quatro mecanismos nao pode mostrar quatro manchas.
     O retalho encolheu, as pecas cresceram um quinto, e as estacoes passaram
     a alternar em z: assim elas se afastam sem precisar de mais x. */
  const LARG = 3.35;
  const S = {
    livre: { x: -2.52, z: -.42 },
    vazK: { x: -1.24, z: .34 },
    volNa: { x: .04, z: -.40 },
    carr: { x: 1.34, z: .36 },
    bomba: { x: 2.62, z: -.30 },
  };
  const emY = k => memY(S[k].x, S[k].z);
  g.add(bicamadaDePerto({
    larg: LARG,
    buracos: [[S.vazK, .68], [S.volNa, .70], [S.carr, .73], [S.bomba, .87]].map(([q, r]) => ({ x: q.x, z: q.z, r })),
  }));

  const canalK = canalDeHelices({
    y0: -.95, y1: .95, nH: 6, rh: .105, torcao: .55, cor: 0x8fbfa8,
    raio: y => .350 + .053 * Math.abs(y) + .036 * Math.exp(-Math.pow(y / .35, 2)),
    poro: y => Math.max(.065, .231 - .160 * Math.exp(-Math.pow((y - .21) / .26, 2))),
  });
  canalK.position.set(S.vazK.x, emY('vazK'), S.vazK.z); g.add(canalK);
  const filtro = new THREE.Mesh(new THREE.TorusGeometry(.160, .036, 8, 30), M.filtro);
  filtro.rotation.x = Math.PI / 2; filtro.position.copy(canalK.position).add(V(0, .21, 0)); g.add(filtro);

  const canalNa = canalDeHelices({
    y0: -.97, y1: 1.09, nH: 6, rh: .107, torcao: .65, cor: 0xc39784,
    raio: y => .373 + .059 * Math.abs(y) + .036 * Math.exp(-Math.pow(y / .33, 2)),
    poro: y => Math.max(.071, .237 - .154 * Math.exp(-Math.pow((y - .12) / .28, 2))),
  });
  canalNa.position.set(S.volNa.x, emY('volNa'), S.volNa.z); g.add(canalNa);
  const compNa = comporta(0xa8705f, .225); g.add(compNa);

  const carr = canalDeHelices({
    y0: -.92, y1: 1.02, nH: 7, rh: .109, torcao: 1.15, cor: 0xb9a7d6,
    raio: y => .397 + .065 * Math.abs(y),
    poro: y => Math.max(.089, .278 - .118 * Math.exp(-Math.pow(y / .35, 2))),
  });
  carr.position.set(S.carr.x, emY('carr'), S.carr.z); g.add(carr);
  const compFora = comporta(0x8f7ab5, .25), compDentro = comporta(0x8f7ab5, .25);
  g.add(compFora, compDentro);

  const bomba = canalDeHelices({
    y0: -.92, y1: 1.30, nH: 8, rh: .112, torcao: .85, cor: 0x8aabc2,
    raio: y => .421 + (y > 0 ? .085 * y : .059 * Math.abs(y)) + .041 * Math.sin(y * 3.4),
    poro: y => Math.max(.071, .249 - .166 * Math.exp(-Math.pow((y + .06) / .31, 2))),
  });
  bomba.position.set(S.bomba.x, emY('bomba'), S.bomba.z); g.add(bomba);
  const atp = new THREE.Mesh(new THREE.IcosahedronGeometry(.125, 0), M.atp);
  g.add(atp);

  /* poucas moléculas e legíveis: vinte esferas correndo viram chuva, e chuva
     não tem direção — e aqui a direção é metade do conteúdo */
  const o2 = [0, 1, 2].map(() => { const m = molecula(2, .090, M.oxigenio, .138); g.add(m); return m; });
  const co2 = [0, 1].map(() => { const m = molecula(3, .079, M.carbono, .142); g.add(m); return m; });
  const kVaza = [0, 1, 2].map(() => { const m = ionzinho('K'); g.add(m); return m; });
  const naEntra = [0, 1, 2, 3].map(() => { const m = ionzinho('Na'); g.add(m); return m; });
  const acucar = glicose(); g.add(acucar);
  const naBomba = [0, 1, 2].map(() => { const m = ionzinho('Na'); g.add(m); return m; });
  const kBomba = [0, 1].map(() => { const m = ionzinho('K'); g.add(m); return m; });

  const migram = [
    ...popular({ especies: ['K'], n: 74, lado: 1, faixa: [1.02, 2.16], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['A', 'A', 'Cl'], n: 74, lado: 1, faixa: [1.02, 2.16], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['Na'], n: 74, lado: -1, faixa: [1.02, 2.06], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['Cl'], n: 74, lado: -1, faixa: [1.02, 2.06], faceY: FACE, larg: LARG }),
  ];
  sortear(migram, 1);
  const parado = [
    ...popular({ especies: ['K'], n: 30, lado: 1, faixa: [1.06, 2.16], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['A', 'Cl'], n: 30, lado: 1, faixa: [1.06, 2.16], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['Na'], n: 30, lado: -1, faixa: [1.06, 2.06], faceY: FACE, larg: LARG }),
    ...popular({ especies: ['Cl'], n: 30, lado: -1, faixa: [1.06, 2.06], faceY: FACE, larg: LARG }),
  ];
  fixar(parado);
  const cargas = migram.concat(parado);
  cargas.forEach(c => { c.r *= 1.04; });
  g.add(inscrever(nuvem(cargas.filter(c => c.z > 0), M.cargaPos)));
  g.add(inscrever(nuvem(cargas.filter(c => c.z < 0), M.cargaNeg)));

  /* A coreografia. `abertura` vem do painel — é a MESMA permeabilidade que
     move o número de Goldman, então a porta e a conta nunca se contradizem. */
  const pK = canalK.position, pN = canalNa.position, pC = carr.position, pB = bomba.position;
  const yLivre = memY(S.livre.x, S.livre.z);
  g.userData.animar = (t, est) => {
    const ab = clamp(est.abertura, 0, 1);
    /* 1 · pelo lipídio, sem proteína: O₂ para dentro e CO₂ para fora, cada um
       a favor do seu gradiente. Os dois sentidos cruzando no mesmo ponto são o
       que mostra que a bicamada não escolhe direção — quem escolhe é o
       gradiente. */
    o2.forEach((m, i) => {
      const u = (t * .30 + i / 3) % 1;
      m.position.set(S.livre.x - .34 + i * .30, yLivre - 1.35 + u * 2.7, S.livre.z + Math.sin(u * 5 + i) * .10);
      m.rotation.set(u * 4, u * 3, i);
    });
    co2.forEach((m, i) => {
      const u = (t * .26 + i / 2) % 1;
      m.position.set(S.livre.x + .40 + i * .30, yLivre + 1.35 - u * 2.7, S.livre.z + Math.cos(u * 4 + i) * .10);
      m.rotation.set(u * 3, u * 4, i);
    });
    /* 2 · canal de vazamento: sempre aberto, e por isso de fluxo constante */
    kVaza.forEach((m, i) => {
      const u = (t * .45 + i / 3) % 1;
      m.position.set(pK.x + Math.sin(u * 9) * .04, pK.y + 1.50 - u * 3.0, pK.z + Math.cos(u * 7) * .04);
    });
    /* 2b · canal dependente de voltagem: a comporta É a permeabilidade */
    naEntra.forEach((m, i) => {
      const u = (t * (.35 + ab * 1.5) + i / 4) % 1;
      m.position.set(pN.x + Math.sin(u * 8) * .04, pN.y - 1.50 + u * 3.0, pN.z + Math.cos(u * 6) * .04);
      m.visible = ab > .12;
    });
    compNa.position.set(pN.x + ab * .66, pN.y + .95 + ab * .20, pN.z + ab * .26);
    /* 3 · transportador em quatro tempos, e NUNCA as duas comportas abertas */
    const c = (t * .17) % 1;
    const foraAberta = c < .45, dentroAberta = c > .55;
    compFora.position.set(pC.x + (foraAberta ? .54 : 0), pC.y - .97 - (foraAberta ? .12 : 0), pC.z + (foraAberta ? .21 : 0));
    compDentro.position.set(pC.x + (dentroAberta ? .54 : 0), pC.y + 1.04 + (dentroAberta ? .12 : 0), pC.z + (dentroAberta ? .21 : 0));
    const passo = c < .30 ? c / .30 * .45 : c < .62 ? .45 : c < .92 ? .45 + (c - .62) / .30 * .55 : 1;
    acucar.position.set(pC.x, pC.y - 1.35 + passo * 2.7, pC.z);
    acucar.rotation.y = t * .9; acucar.rotation.z = Math.sin(t) * .3;
    /* 4 · bomba: contra o gradiente, três para fora e dois para dentro */
    const ciclo = (t * .28) % 1;
    naBomba.forEach((m, i) => {
      const u = clamp(ciclo * 2 - i * .06, 0, 1);
      m.position.set(pB.x + (i - 1) * .13, pB.y + 1.40 - u * 2.72, pB.z + (i - 1) * .09);
      m.visible = ciclo < .55;
    });
    kBomba.forEach((m, i) => {
      const u = clamp((ciclo - .5) * 2 - i * .06, 0, 1);
      m.position.set(pB.x + (i - .5) * .15, pB.y - 1.30 + u * 2.66, pB.z + (i - .5) * .10);
      m.visible = ciclo >= .5;
    });
    atp.position.set(pB.x + .34, pB.y + 1.26, pB.z + .18);
    atp.rotation.y = t * 1.6; atp.visible = ciclo < .3;
  };
  g.userData.postos = S;
  g.userData.foco = V(S.volNa.x, 0, S.volNa.z);
  return g;
}

/* ============================================================ 05 AXÔNIO
   ── A REGRA DO NÍVEL, E A EXCEÇÃO QUE ELA ADMITE ─────────────────────────
   A película aqui é SUPERFÍCIE, não partícula, e isso não é economia: na
   escala de seis milímetros de axônio um íon não tem tamanho de pixel, e
   desenhar bolinha nessa distância só produz moiré. A cor da parede é o
   estado da película, dentro e fora, sempre em oposição.

   Mas a cor sozinha exige que o aluno tenha DECORADO o código — azul é
   negativo, âmbar é positivo —, e o resto da página desenha carga como
   objeto. Havia aí uma costura: nos níveis 02 a 04 a carga é bolinha que se
   move; no 05 ela virava tinta.

   A costura fecha com SINAL, não com esfera, e a diferença é toda:
   • uma esfera é uma PARTÍCULA — afirma que existe uma coisa daquele tamanho
     ali, o que num tubo de 6 mm é mentira por sete ordens de grandeza, e traz
     o moiré de volta assim que ela encolher;
   • um "+" ou um "−" é um SÍMBOLO — não afirma tamanho nenhum. É legenda
     desenhada sobre a coisa, e legenda é honesta em qualquer escala. É o que
     todo livro de fisiologia faz nesta figura exata.
   Por isso os sinais são barras deitadas na parede, UMA FILEIRA por face e
   nunca dando a volta no tubo: enrolados na circunferência, o moiré volta com
   razão e o axônio vira tela de crochê.

   As duas camadas medem coisas diferentes e por isso convivem: a COR carrega
   o quanto — é ela, e só ela, que mostra a pós-hiperpolarização, porque em
   sinal −70 e −82 são o mesmo símbolo — e o SINAL carrega de que lado.

   ── O AXÔNIO AQUI É AMIELÍNICO, e isso é escolha, não omissão ────────────
   A bainha existia como botão e foi apagada. Com ela a onda atravessa os 6 mm
   em 0,1 ms em vez de 3 ms: no mesmo relógio de tela vira um piscar, e o
   nível passava a mostrar todo o axônio acendendo junto — que é a verdade da
   condução saltatória, e é justamente por isso que ela não cabe aqui. Este
   nível existe para mostrar a onda ANDANDO, ponto a ponto, acendendo a
   vizinha. São dois mecanismos diferentes, e o segundo merece bancada
   própria em vez de um botão que apaga o primeiro.

   ── E O TUBO DEIXOU DE SER CANO ──────────────────────────────────────────
   Eixo perfeitamente reto, calibre constante e corte de navalha: as três
   coisas que faziam um cano. Agora o eixo ondula de leve, o calibre tem
   varicosidade e a fatia aberta segue a curva. Isso obrigou a abandonar o
   CylinderGeometry por um tubo varrido — e com ele o eixo da textura da onda
   passou do v para o u, que é a parte mais fácil de quebrar em silêncio.

   O quadro de referência NÃO é o de Frenet: numa curva quase reta ele escolhe
   a normal inicial pelo menor componente da tangente, e o ângulo zero cai
   onde calhar. Aqui a referência é fixa — normal para cima, binormal para a
   frente —, e por isso a janela do corte pode ser posta em π/4 sabendo que
   isso é entre o topo e quem olha.                                         */
/* A JANELA ERA LARGA DEMAIS: tirando 89° o que restava lia como calha, não
   como tubo. Em 71° sobra parede bastante para a silhueta ser redonda, e
   ainda se vê a face de dentro inteira. */
const AX = { L: 6.2, R: .62, par: .105, jan: .62 };
AX.centro = Math.PI / 4;            // a janela olha para quem olha
AX.a0 = AX.centro + AX.jan;
AX.arco = Math.PI * 2 - 2 * AX.jan;
/* AS DUAS FILEIRAS PRECISAM SE SEPARAR NA TELA, e não só no espaço: em
   +0,42 do bordo da janela elas caíam quase na mesma altura projetada, e nem
   eu distingui uma da outra numa foto. Se eu não distingo, o aluno não
   distingue. A de fora desce para a parede da frente-baixo, bem abaixo da
   janela por onde se vê a de dentro. */
AX.aFora = AX.centro + AX.jan + .62;
/* A de dentro sobe para a parede de TRÁS, não para a de baixo. Diametralmente
   oposta à janela ela caía no fundo do tubo e projetava na mesma altura da
   fileira de fora — as duas viravam uma só na tela, que era o defeito que eu
   próprio cometi ao ler a primeira foto. Deslocada para trás, a de dentro fica
   longe e alta, a de fora perto e baixa, e a perspectiva separa as duas. */
AX.aDentro = AX.centro + Math.PI + .42;
/* ── ONDE O OSCILOSCÓPIO ENCOSTA ──────────────────────────────────────────
   Esta constante morava em app.js e a geometria não a conhecia: o gráfico
   dizia "tempo no ponto de registro" e a cena não tinha ponto nenhum — o
   rótulo apontava para um trecho vazio do tubo. Duas fontes para a mesma
   coisa é o começo de duas verdades; agora ela nasce aqui, com a peça, e
   app.js a recebe pronta. */
AX.uReg = .78;

const eixoAx = curvaDePontos(t => V(
  -AX.L / 2 + t * AX.L,
  Math.sin(t * 3.4 + .6) * .105 + Math.sin(t * 7.1) * .035,
  Math.sin(t * 2.3 + 1.1) * .085), 44);

/* quadro de referência estável ao longo da curva */
function quadro(u) {
  const T = eixoAx.getTangentAt(u).normalize();
  const B = V().crossVectors(T, V(0, 1, 0)).normalize();
  const N = V().crossVectors(B, T).normalize();
  return { P: eixoAx.getPointAt(u), T, N, B };
}
function pontoNaParede(u, ang, raio) {
  const q = quadro(u);
  return q.P.clone().addScaledVector(q.N, Math.cos(ang) * raio).addScaledVector(q.B, Math.sin(ang) * raio);
}

/* calibre com varicosidade: é o que impede o tubo de ser um cano de PVC */
/* O CONE DE IMPLANTAÇÃO FOI APAGADO. Passou por 2,05× do calibre e depois por
   1,6×, e nas duas ele era a coisa mais chamativa do quadro — um alargamento
   na ponta esquerda disputando atenção com a onda, que é o assunto do nível.
   Nada do que ele mostrava é conteúdo daqui: a INICIAÇÃO do potencial de ação
   pertence ao neurônio do nível 01, e aqui só interessa a propagação.

   O TOCO DE SOMA FOI APAGADO JUNTO, e por dois motivos. Sem o cone não havia
   mais transição: o tubo nascia dentro dele, e o que se via era um bolo rosa
   grudado na ponta — esfera com ruído, sem núcleo e sem dendrito, nada que
   dissesse "corpo celular". E ele existia para apontar DE ONDE a onda vem,
   coisa que a própria onda já faz ao partir da esquerda. Origem do disparo é
   assunto do nível 01.
   Sobra o calibre com varicosidade, que é o que impede o tubo de ser cano. */
const raioAx = u => AX.R * (1 + .055 * Math.sin(u * 9.3 + .4) + .03 * Math.sin(u * 17.1))
  /* e uma folga DISCRETA de 12% na ponta de onde a onda sai. Ela não é cone:
     é só o bastante para o tubo não terminar num corte reto de cano serrado,
     e pouco o bastante para ninguém reparar nela. */
  * (1 + .12 * Math.exp(-Math.pow(u / .17, 2)));

/* Tubo aberto varrido sobre a curva. TubeGeometry não faz ângulo parcial, e
   ângulo parcial é o que deixa ver as duas faces ao mesmo tempo. */
function tuboAberto(raio, { a0, arco, u0 = 0, u1 = 1, segsU = 110, segsV = 30 } = {}) {
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i <= segsU; i++) {
    const u = u0 + (u1 - u0) * (i / segsU);
    const q = quadro(u), r = raio(u);
    for (let j = 0; j <= segsV; j++) {
      const a = a0 + arco * (j / segsV), ca = Math.cos(a), sa = Math.sin(a);
      const nx = q.N.x * ca + q.B.x * sa, ny = q.N.y * ca + q.B.y * sa, nz = q.N.z * ca + q.B.z * sa;
      pos.push(q.P.x + nx * r, q.P.y + ny * r, q.P.z + nz * r);
      nor.push(nx, ny, nz);
      uv.push(u, j / segsV);
    }
  }
  for (let i = 0; i < segsU; i++) for (let j = 0; j < segsV; j++) {
    const a = i * (segsV + 1) + j, b = a + segsV + 1, c = b + 1, d = a + 1;
    idx.push(a, b, d, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}
/* a borda do corte e as duas pontas: sem elas o tubo é folha enrolada, e a
   parede — que é a espessura onde tudo acontece — some */
function fitaRadial(ang, rDe, rAte, { u0 = 0, u1 = 1, segsU = 90 } = {}) {
  const pos = [], idx = [];
  for (let i = 0; i <= segsU; i++) {
    const u = u0 + (u1 - u0) * (i / segsU);
    const a = pontoNaParede(u, ang, rDe(u)), b = pontoNaParede(u, ang, rAte(u));
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  for (let i = 0; i < segsU; i++) {
    const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
  return g;
}
function tampaAnelar(u, rDe, rAte, a0, arco, segs = 40) {
  const pos = [], idx = [];
  for (let j = 0; j <= segs; j++) {
    const a = a0 + arco * (j / segs);
    const p0 = pontoNaParede(u, a, rDe), p1 = pontoNaParede(u, a, rAte);
    pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
  }
  for (let j = 0; j < segs; j++) { const k = j * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
  return g;
}

/* ── os sinais ────────────────────────────────────────────────────────────
   Barra atravessada para o menos, duas cruzadas para o mais. Geometria, e não
   textura: exporta limpo para RA (o glTF não tem letreiro que gira para a
   câmera) e continua legível em qualquer tamanho. */
const SINAL = { comp: .245, esp: .060, alt: .030 };
function glifo(mais) {
  const partes = [new THREE.BoxGeometry(SINAL.esp, SINAL.alt, SINAL.comp)];
  if (mais) partes.push(new THREE.BoxGeometry(SINAL.comp, SINAL.alt, SINAL.esp));
  return mergeGeometries(partes);
}
const sinais = { glifos: [], off: null, malha: null };

function axonio() {
  const g = new THREE.Group();
  const { R, par, a0, arco } = AX;
  const rFora = raioAx, rDentro = u => raioAx(u) - par;

  const fora = new THREE.Mesh(tuboAberto(rFora, { a0, arco }), M.axonioFora);
  const dentro = peloAvesso(new THREE.Mesh(tuboAberto(rDentro, { a0, arco }), M.axonioDentro));
  g.add(fora, dentro);
  g.add(new THREE.Mesh(mergeGeometries([
    fitaRadial(a0, rDentro, rFora), fitaRadial(a0 + arco, rDentro, rFora),
    tampaAnelar(0, rDentro(0), rFora(0), a0, arco), tampaAnelar(1, rDentro(1), rFora(1), a0, arco),
  ], false), M.parede));

  /* ── O ELETRODO DE REGISTRO ────────────────────────────────────────────
     A ponta entra pela janela do corte e encosta na parede de DENTRO — que é
     o que um registro intracelular é, e é de lá que sai o Vm do gráfico. Vai
     como `foraDoQuadro`: é instrumento, não assunto, e sem isso ele
     empurraria a câmera para trás e afinaria a parede. */
  const pReg = pontoNaParede(AX.uReg, AX.aDentro, rDentro(AX.uReg) - .07);
  const traseira = pReg.clone().add(V(.30, 2.30, 1.45));
  const haste = (de, ate, r0, r1, mat, segs = 18) => {
    const d = ate.clone().sub(de);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, d.length(), segs, 1, true), mat);
    m.position.copy(de).add(ate).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
    return m;
  };
  const conta = new THREE.Mesh(new THREE.SphereGeometry(.058, 16, 12), M.marcador);
  conta.position.copy(pReg);
  for (const o of [haste(traseira, pReg, .100, .012, M.vidro),
                   haste(traseira.clone().lerp(pReg, .07), pReg.clone().lerp(traseira, .11), .015, .005, M.metal, 10),
                   conta]) {
    o.userData.foraDoQuadro = true; g.add(o);
  }
  g.userData.pontoRegistro = pReg;

  /* ── as fileiras de sinal ──────────────────────────────────────────────
     Uma por face. A de fora fica logo acima da parede e por isso some sob a
     bainha quando ela é ligada — o que é a verdade: o internódio está
     isolado, e só nos nós a carga tem com quem conversar. */
  const geosG = [], glifos = [];
  const N_EST = 16;
  let cursor = 0;
  for (let k = 0; k < N_EST; k++) {
    const u = .045 + (k + .5) / N_EST * .91;
    for (const face of [1, -1]) {
      const ang = face > 0 ? AX.aDentro : AX.aFora;
      const raio = face > 0 ? rDentro(u) - .055 : rFora(u) + .048;
      const p = pontoNaParede(u, ang, raio);
      const q = quadro(u);
      const radial = q.N.clone().multiplyScalar(Math.cos(ang)).addScaledVector(q.B, Math.sin(ang)).normalize();
      /* T × radial, e não o contrário: invertida, a base fica canhota, as
         normais dos glifos apontam para dentro e eles ficam escuros */
      const circ = V().crossVectors(q.T, radial).normalize();
      const base = new THREE.Matrix4().makeBasis(q.T, radial, circ);
      for (const s of [1, -1]) {
        const geo = glifo(s > 0);
        geo.applyMatrix4(base);
        /* ── OS SINAIS NÃO PODEM TER A COR DA PAREDE ─────────────────
           O menos nasceu ciano e a parede em repouso é azul: o símbolo sumia
           exatamente no estado em que ele precisa ser lido. Cor e forma
           passaram a carregar coisas diferentes, e param de brigar — a
           PAREDE diz quanto e de que lado pelo tom, o SÍMBOLO diz o sinal
           pela forma. Em creme, os dois se leem sobre azul e sobre âmbar. */
        tintar(geo, C(s > 0 ? 0xf7e4bc : 0xe8dcc6));
        const n = geo.attributes.position.count;
        glifos.push({ ini: cursor, fim: cursor + n, centro: p, s, face, u });
        cursor += n;
        geosG.push(geo);
      }
    }
  }
  const geoG = mergeGeometries(geosG);
  sinais.glifos = glifos;
  sinais.off = Float32Array.from(geoG.attributes.position.array);
  const malhaG = new THREE.Mesh(geoG, M.sinal);
  malhaG.frustumCulled = false;
  sinais.malha = malhaG;
  g.add(malhaG);

  g.userData.foco = V(0, 0, 0);
  return g;
}

/* ── repintar a película e virar os sinais ────────────────────────────────
   `vmDe(u)` devolve o potencial em mV no ponto u do comprimento (0 na ponta
   de onde a onda sai). A face de dentro recebe o sinal de Vm; a de fora,
   o oposto — e é só isso: a inversão que o aluno vê passar é literalmente o
   sinal trocando de lado.

   A ESCALA DE COR SATURA EM 50 mV, e não no máximo de 92. Linear no máximo, o
   pico de +38 dava 0,41 de intensidade — o instante mais dramático da
   fisiologia aparecia mais fraco que o repouso. O que o olho tem de ler não é
   QUANTO, é DE QUE LADO; a magnitude vem depois. O grão fixo por coluna
   impede que a parede vire degradê liso, que é aparência de moldado. */
const NEU = [146, 128, 124], POS = [255, 146, 48], NEG = [58, 104, 196];
const SAT = 50;
const grao = Array.from({ length: 256 }, () => .90 + Math.random() * .16);
function pintarFace(tex, sinalDe) {
  const img = tex.image;
  if (!img || typeof img.getContext !== 'function') return;
  const g = img.getContext('2d'), w = img.width, h = img.height;
  for (let i = 0; i < w; i++) {
    const v = sinalDe(i / (w - 1)), m = Math.pow(clamp(Math.abs(v) / SAT, 0, 1), .68);
    const alvo = v >= 0 ? POS : NEG, q = grao[i % 256];
    const c = alvo.map((a, k) => Math.round((NEU[k] + (a - NEU[k]) * m) * q));
    g.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    g.fillRect(i, 0, 1.05, h);
  }
  tex.needsUpdate = true;
}
function aplicarOnda(vmDe) {
  pintarFace(TEX.ondaDentro, u => vmDe(u));
  pintarFace(TEX.ondaFora, u => -vmDe(u));
  if (!sinais.malha) return;
  /* o glifo não acende nem apaga: ele CRESCE do nada e volta para o nada, e a
     travessia por zero — o instante da inversão — é o único em que os dois
     estão pequenos ao mesmo tempo */
  const attr = sinais.malha.geometry.attributes.position, arr = attr.array, off = sinais.off;
  for (const gl of sinais.glifos) {
    const vmFace = gl.face > 0 ? vmDe(gl.u) : -vmDe(gl.u);
    const e = suave(clamp(gl.s * vmFace / 14, 0, 1));
    for (let i = gl.ini; i < gl.fim; i++) {
      arr[i * 3] = gl.centro.x + off[i * 3] * e;
      arr[i * 3 + 1] = gl.centro.y + off[i * 3 + 1] * e;
      arr[i * 3 + 2] = gl.centro.z + off[i * 3 + 2] * e;
    }
  }
  attr.needsUpdate = true;
}

const modelos = [neuronio(), interior(), pelicula(), portas(), axonio()];
return { modelos, aplicarPotencial, aplicarOnda, EM_CHEIO, MEM, uReg: AX.uReg };
}
