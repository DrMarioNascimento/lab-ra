/* Do músculo ao sarcômero — v3
   ---------------------------------------------------------------------------
   O QUE MUDOU NO v3 (a queixa era simples: a qualidade das peças, o músculo à frente)
   • sombra ligada. Sem ela, cada peça era um adesivo colado no fundo preto;
   • enquadramento medido, não uma lista de distâncias fixas — o palco tinha
     672×1204 e a lista só servia a uma proporção de tela;
   • ?nivel=1..5 abre direto num nível, sem mergulho: serve à aula que já sabe
     onde quer parar, e serve à conferência do desenho, que precisa do quadro
     parado;
   • a geometria e as texturas mudaram muito; o porquê de cada uma está em
     modelos.js, junto do código que a desenha.
   ---------------------------------------------------------------------------
   Cinco níveis gerados por código (sem .glb externo), com:
   • materiais PBR e texturas de estriação desenhadas em canvas;
   • fascículo com perimísio e extremidade cortada; fibra com núcleos periféricos,
     mitocôndrias e miofibrilas; miofibrila com corte longitudinal mostrando os
     filamentos; sarcômero com rede hexagonal (cada miosina rodeada por 6 actinas),
     cabeças de miosina, linha M, discos Z e titina;
   • contração por controle deslizante (deslizamento dos filamentos) com a curva
     comprimento–tensão ao lado;
   • "aprofundar" como mergulho contínuo: o nível atual se abre e o próximo nasce
     de dentro dele;
   • rótulos ancorados no 3D;
   • RA: o GLB do nível é exportado ANTES do clique, e o clique chama activateAR()
     de forma síncrona — o Safari do iPhone exige que o gesto do usuário chegue
     inteiro até o Quick Look. Era isso que impedia a câmera de abrir.            */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { usdzComBotoes } from '../ra-botoes-ios.js';
import { novaMitocondria } from '../mitocondria.js';
import { criar } from './modelos.js?v=musculo-anatomico-20261003';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');

/* ------------------------------------------------------------ renderer / cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
/* SUBIU DE 1.02 PARA 1.16 EM 05/09/2026. Os materiais deixaram de ter verniz
   e ganharam oclusão entre as peças: as duas coisas tiram luz do quadro, e é
   isso que se quer — mas somadas deixaram os níveis 03 e 04 no escuro. A
   exposição devolve a leitura sem devolver o brilho de plástico, porque quem
   dava o brilho era o clearcoat, não a exposição. */
renderer.toneMappingExposure = 1.16;
/* Sombra de contato entre estruturas para preservar a leitura de profundidade. */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x120c09, .028);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .72;

const camera = new THREE.PerspectiveCamera(36, 1, .01, 200);
camera.position.set(0, 1.4, 8.4);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;
controls.minDistance = 1.6; controls.maxDistance = 16;

scene.add(new THREE.HemisphereLight(0xffe6cc, 0x1c110c, 1.1));
const key = new THREE.DirectionalLight(0xfff0dc, 2.9); key.position.set(4.5, 7, 5.5); scene.add(key);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -.0012; key.shadow.normalBias = .02; key.shadow.radius = 2.4;
const sombra = key.shadow.camera;
sombra.near = 1; sombra.far = 28; sombra.left = -7.5; sombra.right = 7.5; sombra.top = 7.5; sombra.bottom = -7.5;
sombra.updateProjectionMatrix();
const fill = new THREE.DirectionalLight(0xffc6ac, .75); fill.position.set(-5, 2, 3.5); scene.add(fill);
/* a contraluz é o que separa a peça do fundo preto; laranja demais tingia o
   tecido de neon, então ficou fraca de propósito */
const rim = new THREE.DirectionalLight(0xff8a4e, 1.5); rim.position.set(-3.5, 2, -6); scene.add(rim);

const root = new THREE.Group(); scene.add(root);

/* ------------------------------------------------------------ texturas (navegador) */
function canvasTex(w, h, draw, { repeatX = 1, repeatY = 1 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX, repeatY);
  t.anisotropy = 8; return t;
}
const { modelos, aplicarComprimento, SARC, SCM } = criar(canvasTex);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* MITOCÔNDRIAS NOVAS NA FIBRA. Em `modelos.js` (aprovado, intocado) as 84
   mitocôndrias entre as miofibrilas são cápsulas de raio 0,028 fundidas numa
   malha só. A malha é desfeita aqui: cada cápsula tem o mesmo número de
   vértices, e a caixa de cada trecho dá o lugar e o comprimento da
   mitocôndria, que é substituída pela compartilhada fechada (`../mitocondria.js`)
   com as mesmas medidas, deitada no eixo da fibra. */
(async () => {
  const fibra = modelos[2]; let antiga = null;
  fibra.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === 0xc9822f) antiga = o; });
  if (!antiga) return;
  const porCapsula = new THREE.CapsuleGeometry(.028, .1, 4, 10).attributes.position.count;
  const pos = antiga.geometry.attributes.position, n = Math.round(pos.count / porCapsula);
  if (n * porCapsula !== pos.count) return;          // estrutura diferente da esperada: fica a antiga
  try {
    const medidas = [];
    for (let k = 0; k < n; k++) {
      const b = new THREE.Box3();
      for (let i = k * porCapsula; i < (k + 1) * porCapsula; i++) b.expandByPoint(V(pos.getX(i), pos.getY(i), pos.getZ(i)));
      medidas.push(b);
    }
    const novas = await Promise.all(medidas.map(b => { const t = b.getSize(V()); return novaMitocondria('fechada', V(t.x, t.y, t.z)); }));
    novas.forEach((m, k) => { medidas[k].getCenter(m.position); m.position.applyMatrix4(antiga.matrix); antiga.parent.add(m); });
    antiga.parent.remove(antiga);
    if (atual === 2) prepararRA();
  } catch (err) { console.error('mitocôndria nova não carregou; ficam as antigas', err); }
})();

/* ------------------------------------------------------------ montagem dos níveis */
modelos.forEach((m, i) => {
  m.visible = i === 0; root.add(m);
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  /* medido aqui, com tudo na identidade: durante o mergulho a escala muda, e um
     Box3 tirado no meio da transição enquadraria o quadro errado */
  m.updateWorldMatrix(true, true);
  const caixa = new THREE.Box3();
  m.traverse(o => { if (o.isMesh && !o.userData.foraDoQuadro) caixa.expandByObject(o); });
  const t = caixa.getSize(new THREE.Vector3()).multiplyScalar(.5);
  /* rh é o meio-vão horizontal já contando o giro: o que hoje é o eixo X daqui a
     meia volta aponta para a câmera, então o maior entre X e Z é que manda. */
  m.userData.quadro = { rh: Math.max(t.x, t.z), hv: t.y };
});
const sarc = modelos[4];

const dados = [
  ['Escala macroscópica', '01 · Músculo', 'Órgão contrátil', 'Músculo esquelético', 'Ventre fusiforme envolvido pelo epimísio, com tendões nas extremidades. Sob a fáscia já se veem os feixes: o músculo é organizado em fascículos.', 'ventre muscular,epimísio,tendão,fascículos'],
  ['Escala mesoscópica', '02 · Fascículo', 'Feixe de fibras', 'Fascículo muscular', 'Dezenas de fibras envolvidas pelo perimísio. Capilares serpenteiam entre elas. Na extremidade cortada, as fibras aparecem individualmente.', 'perimísio,fibras,capilares,endomísio'],
  ['Escala celular', '03 · Fibra', 'Célula multinucleada', 'Fibra muscular', 'Uma célula longa: sarcolema estriado, núcleos achatados na periferia, mitocôndrias entre miofibrilas paralelas. A estriação vista de fora vem de dentro.', 'sarcolema,núcleos periféricos,mitocôndrias,miofibrilas'],
  ['Escala subcelular', '04 · Miofibrila', 'Cadeia de sarcômeros', 'Miofibrila', 'Sarcômeros em série, de disco Z a disco Z. O corte longitudinal mostra que as bandas claras e escuras são os próprios filamentos vistos de lado. Deslize o controle: os sarcômeros em série encurtam juntos, e a banda A não muda.', 'disco Z,banda I,banda A,sarcômeros em série'],
  ['Escala molecular', '05 · Sarcômero', 'Unidade contrátil', 'Sarcômero', 'Rede hexagonal: cada miosina rodeada por seis actinas. As cabeças de miosina apontam para os discos Z. A titina ancora a miosina ao Z. Deslize o controle e veja a banda I e a zona H encolherem — a banda A não muda.', 'disco Z,actina,miosina,zona H,linha M,titina'],
];
const E = {
  scale: $('scaleLabel'), step: $('stepLabel'), eye: $('infoEyebrow'), title: $('infoTitle'), text: $('infoText'), tags: $('microtags'),
  prev: $('prev'), next: $('next'), ar: $('launchAR'), status: $('raStatus'), viewer: $('arViewer'),
  contr: $('contracao'), contrBox: $('contracaoBox'), contrVal: $('contracaoValor'), tens: $('tensao'), rot: $('rotulos'), labels: $('labels'),
};

let atual = 0, transicao = null, girar = false, velocidadeGiro = 1;
/* A distância era uma lista fixa — e lista fixa só serve a uma proporção de tela.
   Num painel alto e estreito o músculo saía cortado pelas beiras. Agora a câmera
   recua o que a caixa do nível exigir, largura e altura medidas contra a abertura
   de cada eixo. Pela ESFERA não serve: uma peça deitada, seis vezes mais comprida
   que alta, tem esfera do tamanho do comprimento, e enquadrá-la assim deixava o
   músculo ocupando um quarto da altura do palco, com vazio em cima e embaixo. */
function resetCam() {
  const q = modelos[atual].userData.quadro || { rh: 3, hv: 1 };
  const fovV = camera.fov * Math.PI / 180;
  const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
  const dist = Math.max(q.rh / Math.tan(fovH / 2), q.hv / Math.tan(fovV / 2)) * 1.06 + q.rh * .38;
  controls.target.set(0, 0, 0);
  camera.position.set(0, q.hv * .55, dist);
  controls.minDistance = q.rh * .5;
  controls.maxDistance = dist * 2.6;
  controls.update();
}

function aplicarTextos(n) {
  const d = dados[n];
  E.scale.textContent = d[0]; E.step.textContent = d[1]; E.eye.textContent = d[2]; E.title.textContent = d[3]; E.text.textContent = d[4];
  E.tags.innerHTML = d[5].split(',').map(x => `<span>${x}</span>`).join('');
  E.prev.disabled = n === 0; E.next.disabled = n === 4; E.next.textContent = n === 4 ? 'Unidade contrátil ✓' : 'Aprofundar →';
  document.querySelectorAll('.step').forEach((b, i) => b.classList.toggle('active', i === n));
  E.contrBox.hidden = n < 3; E.labels.innerHTML = '';
}

function setStep(n, viaMergulho = false) {
  n = Math.max(0, Math.min(4, n)); if (n === atual) return;
  const velho = modelos[atual], novo = modelos[n]; const mergulho = viaMergulho && n === atual + 1;
  novo.visible = true; novo.scale.setScalar(mergulho ? .18 : .7);
  if (mergulho) { const f = velho.userData.foco || V(); novo.position.copy(f); } else novo.position.set(0, 0, 0);
  transicao = { velho, novo, t: 0, mergulho, foco: (velho.userData.foco || V()).clone() };
  atual = n; aplicarTextos(n);
  prepararRA();
}
/* Abrir direto num nível, sem transição. Serve à aula que já sabe onde quer
   parar (…/musculo-sarcomero/?nivel=4) e serve à conferência do desenho, que
   precisa do quadro parado — o mergulho depende de animação para terminar. */
function irDireto(n) {
  n = Math.max(0, Math.min(4, n));
  modelos.forEach((m, i) => { m.visible = i === n; m.scale.setScalar(1); m.position.set(0, 0, 0); });
  atual = n; transicao = null; aplicarTextos(n); resetCam(); prepararRA();
}
document.querySelectorAll('.step').forEach((b, i) => b.onclick = () => setStep(i));
E.prev.onclick = () => setStep(atual - 1); E.next.onclick = () => setStep(atual + 1, true);
$('resetView').onclick = resetCam;

/* materiais que podem esmaecer durante o mergulho */
/* Guardar também o depthWrite. Epimísio, perimísio e sarcolema nascem com
   depthWrite:false de propósito — é o que deixa ver o que está atrás da bainha.
   Restaurar todo mundo como `true` depois do primeiro mergulho fazia a bainha
   passar a tapar o que ela devia mostrar, e só a partir da segunda visita. */
function setOpacidade(obj, f) {
  obj.traverse(o => {
    if (!o.isMesh) return; const m = o.material;
    if (m.userData.op0 === undefined) { m.userData.op0 = m.opacity; m.userData.tr0 = m.transparent; m.userData.dw0 = m.depthWrite; }
    m.transparent = true; m.opacity = m.userData.op0 * f; m.depthWrite = m.userData.dw0 && f > .6;
  });
}
function restaurar(obj) {
  obj.traverse(o => {
    if (!o.isMesh) return; const m = o.material;
    if (m.userData.op0 !== undefined) { m.opacity = m.userData.op0; m.transparent = m.userData.tr0; m.depthWrite = m.userData.dw0; }
  });
}

/* ------------------------------------------------------------ contração + curva comprimento–tensão */
function tensaoRelativa(L) { // Gordon, Huxley & Julian (1966), sarcômero de rã, aproximação linear por trechos
  if (L <= 1.27) return 0; if (L < 1.67) return (L - 1.27) / (1.67 - 1.27) * .84; if (L < 2.0) return .84 + (L - 1.67) / (2.0 - 1.67) * .16; if (L <= 2.2) return 1; if (L < 3.6) return 1 - (L - 2.2) / 1.4; return 0;
}
function desenharCurva() {
  const c = E.tens, g = c.getContext('2d'), w = c.width, h = c.height; g.clearRect(0, 0, w, h);
  const px = L => 28 + (L - 1.2) / (3.7 - 1.2) * (w - 40), py = T => h - 22 - T * (h - 36);
  g.strokeStyle = 'rgba(224,177,58,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(28, py(0)); g.lineTo(w - 10, py(0)); g.moveTo(28, py(0)); g.lineTo(28, 8); g.stroke();
  g.strokeStyle = '#f3d078'; g.lineWidth = 2; g.beginPath(); for (let L = 1.2; L <= 3.7; L += .02) { const x = px(L), y = py(tensaoRelativa(L)); L === 1.2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  const L = sarc.userData.comprimento; g.fillStyle = '#ff6a18'; g.beginPath(); g.arc(px(L), py(tensaoRelativa(L)), 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#c9bba3'; g.font = '600 10px "IBM Plex Mono", monospace'; g.fillText('comprimento do sarcômero (µm)', 30, h - 6); g.save(); g.translate(10, h / 2 + 20); g.rotate(-Math.PI / 2); g.fillText('tensão', 0, 0); g.restore();
  ['1,5', '2,0', '2,5', '3,0', '3,5'].forEach((t, i) => g.fillText(t, px(1.5 + i * .5) - 8, h - 12));
}
function onContracao() {
  const L = parseFloat(E.contr.value); aplicarComprimento(sarc, L);
  const I = Math.max(0, L - SCM.A), H = Math.max(0, L - 2 * SCM.actina);
  E.contrVal.textContent = `${L.toFixed(2)} µm · banda I ${I.toFixed(2)} · zona H ${H.toFixed(2)} · banda A ${SCM.A.toFixed(2)} (fixa) · tensão ${(tensaoRelativa(L) * 100).toFixed(0)}%` + (L < 2 * SCM.actina ? ' · actinas sobrepostas' : '');
  desenharCurva(); prepararRA();
}
E.contr.addEventListener('input', onContracao);
$('relaxar').onclick = () => { E.contr.value = 2.4; onContracao(); };
$('contrair').onclick = () => { E.contr.value = 1.9; onContracao(); };

/* ------------------------------------------------------------ rótulos ancorados */
const ancoras = {
  4: () => { const L = sarc.userData.comprimento; return [
    ['disco Z', V(-L / 2, .66, 0)], ['disco Z', V(L / 2, .66, 0)], ['banda I', V(-(L / 2 + SCM.A / 2) / 2, -.5, .3)], ['banda A', V(.55, -.5, .3)],
    ['zona H', V(0, .42, .35)], ['linha M', V(0, -.2, .45)], ['actina', V(-L / 2 + .45, .12, .38)], ['miosina', V(.35, .04, .32)], ['cabeças de miosina', V(-.6, -.15, .32)], ['titina', V(-(L / 2 + SCM.A / 2) / 2, .18, .12)]]; },
  /* nível 04: as âncoras acompanham o comprimento escolhido — disco Z entre o
     1º e o 2º sarcômero, banda I no meio da metade esquerda da banda I do
     sarcômero central, banda A dentro dela */
  3: () => { const L = sarc.userData.comprimento; return [['disco Z', V(-L / 2, -.62, .2)], ['banda A (escura)', V(.45, -.55, .2)], ['banda I (clara)', V(-(SCM.A / 2 + L / 2) / 2, .6, .2)], ['filamentos', V(0, .2, .4)]]; },
  2: () => [['sarcolema', V(-1.6, .85, 0)], ['núcleo periférico', V(.4, .8, .3)], ['miofibrilas', V(2.7, .2, 0)], ['mitocôndrias', V(-.6, -.55, .5)]],
  1: () => [['perimísio', V(-1.4, 1.05, 0)], ['fibras musculares', V(2.1, .44, .3)], ['capilar', V(0, -.9, .4)]],
  0: () => [['ventre muscular', V(0, 1.06, .4)], ['tendão', V(2.95, .40, 0)], ['osso', V(4.3, .55, 0)], ['epimísio', V(-1.35, -.90, .5)], ['fascículos', V(.5, .84, .58)]],
};
let mostrarRotulos = true; E.rot.onclick = () => { mostrarRotulos = !mostrarRotulos; E.rot.classList.toggle('on', mostrarRotulos); E.rot.setAttribute('aria-pressed',String(mostrarRotulos)); E.labels.innerHTML = ''; };
function atualizarRotulos() {
  if (!mostrarRotulos || transicao) { if (E.labels.childElementCount) E.labels.innerHTML = ''; return; }
  const lista = ancoras[atual](); if (E.labels.childElementCount !== lista.length) { E.labels.innerHTML = lista.map(([t]) => `<span class="lbl">${t}</span>`).join(''); }
  const w = stage.clientWidth, h = stage.clientHeight; const obj = modelos[atual];
  lista.forEach(([, p], i) => {
    const v = p.clone().applyMatrix4(obj.matrixWorld).project(camera), el = E.labels.children[i];
    const x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h;
    const direita = x + el.offsetWidth + 9 > w - 8;
    el.classList.toggle('ancora-direita', direita);
    el.style.marginLeft = `${Math.max(8 - x, direita ? -el.offsetWidth - 9 : 9)}px`;
    el.style.opacity = v.z < 1 ? 1 : 0;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ------------------------------------------------------------ miofibrila contrátil (nível 04)
   O mesmo controle de comprimento do nível 05 passa a valer na miofibrila: os
   três sarcômeros em série encurtam juntos, com a MESMA função aprovada
   (`aplicarComprimento`, de modelos.js, que não foi alterado). A banda A
   continua com 1,6 µm; encolhem a banda I e a zona H.

   DOIS ACERTOS DE MONTAGEM, feitos aqui e não em modelos.js:
   1. Os sarcômeros internos eram ampliados ×1,34 em TODAS as direções para
      encher o cilindro. No comprimento isso os deixava com 3,2 de disco a
      disco num vão de 2,4: os discos Z de dentro caíam a ±1,61 em vez de ±1,2
      (onde estão os anéis), vizinhos se sobrepunham e os discos das pontas
      vazavam além das tampas. Agora a ampliação é só na espessura (y, z); no
      comprimento a escala é 1, e 1 unidade = 1 µm, como no nível 05.
   2. As duas pontas da capa (a parte da frente, fora da janela) repetiam o
      padrão de três sarcômeros nos seus próprios 2,3 de comprimento — bandas
      três vezes mais estreitas que as do fundo. Agora as faixas pintadas
      seguem a mesma posição do fundo: cada sarcômero pintado coincide com o
      vão entre dois anéis.

   A CAPA ENCOLHE COMO TECIDO. A pintura das bandas acompanha o tecido: o
   trecho da banda A fica com o mesmo comprimento; o trecho da banda I e o da
   zona H encurtam pela mesma regra do sarcômero. Por isso a capa ganhou
   anéis de vértices nas bordas das bandas (antes tinha só as duas pontas): em
   repouso a aparência é a mesma, e na contração o desenho encurta onde deve. */
const mio = modelos[3];
const N_SARC_MIO = 3;
const mioPartes = { capa: [], tampas: [], aneis: [], sarcs: [] };
for (const o of mio.children) {
  const p = o.isMesh && o.geometry.parameters;
  if (o.isGroup) o.children.forEach(s => mioPartes.sarcs.push(s));
  else if (o.geometry.type === 'TorusGeometry') mioPartes.aneis.push(o);
  else if (p && p.openEnded) mioPartes.capa.push(o);
  else if (p && p.height < .05) mioPartes.tampas.push(o);
}
mioPartes.sarcs.forEach(s => s.scale.set(1, s.scale.y, s.scale.z));               // acerto 1
{
  mio.updateMatrix();
  /* o fundo (a maior peça) dá a relação entre posição no eixo e coordenada da
     pintura; as pontas passam a usar a mesma relação */
  const fundo = mioPartes.capa.reduce((a, b) => (a.geometry.parameters.height > b.geometry.parameters.height ? a : b));
  const v = new THREE.Vector3();
  let rel = null;
  for (const m of mioPartes.capa) {
    m.updateMatrix();
    const q = m.geometry.parameters;
    /* anéis de vértices só onde a regra muda de trecho (bordas das bandas de
       cada sarcômero): entre eles o encurtamento é linear, então a pintura sai
       exata sem encher o arquivo de RA de vértices */
    const xDe = y => v.set(0, y, 0).applyMatrix4(m.matrix).x;
    const xTopo = xDe(q.height / 2), xBase = xDe(-q.height / 2);
    const xs = [xTopo, xBase];
    for (let k = 0; k < N_SARC_MIO; k++) for (const d of [-1.2, -1.175, -.8, -.2, .2, .8, 1.175, 1.2]) {
      const x = (k - (N_SARC_MIO - 1) / 2) * SARC.len + d;
      if (x > Math.min(xTopo, xBase) + 1e-6 && x < Math.max(xTopo, xBase) - 1e-6) xs.push(x);
    }
    const linhas = [...new Set(xs.map(x => +x.toFixed(6)))].sort((p1, p2) => (xBase > xTopo ? p1 - p2 : p2 - p1));
    const g = new THREE.CylinderGeometry(q.radiusTop, q.radiusBottom, q.height, q.radialSegments,
      linhas.length - 1, q.openEnded, q.thetaStart, q.thetaLength);
    const pos = g.attributes.position, uv = g.attributes.uv, porLinha = q.radialSegments + 1;
    for (let i = 0; i < pos.count; i++)
      pos.setY(i, q.height / 2 - (linhas[Math.floor(i / porLinha)] - xTopo) / (xBase - xTopo) * q.height);
    const xRep = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) xRep[i] = v.fromBufferAttribute(pos, i).applyMatrix4(m.matrix).x;
    if (m === fundo) {
      const i0 = 0, i1 = pos.count - 1;                                          // bordas opostas
      rel = { a: (uv.getY(i1) - uv.getY(i0)) / (xRep[i1] - xRep[i0]) };
      rel.b = uv.getY(i0) - rel.a * xRep[i0];
    }
    m.userData.capaRepouso = { geo: g, xRep, posRep: new Float32Array(pos.array), inv: m.matrix.clone().invert() };
    m.geometry = g;
  }
  for (const m of mioPartes.capa) {                                              // acerto 2
    const { geo, xRep } = m.userData.capaRepouso, uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, rel.a * xRep[i] + rel.b);
    uv.needsUpdate = true;
  }
}
/* posição de repouso (2,4 µm) → posição no comprimento L, por trechos:
   zona H |d| ≤ 0,2 → [0, H/2]; resto da banda A ≤ 0,8 → até 0,8 (fixa);
   banda I ≤ 1,175 → até L/2 − 0,025; disco Z (0,025 de cada lado) mantém a largura */
function posicaoNoComprimento(xr, L) {
  const L0 = SARC.len, i = Math.max(0, Math.min(N_SARC_MIO - 1, Math.round(xr / L0) + 1));
  const d = xr - (i - 1) * L0, s = Math.sign(d), a = Math.abs(d), meio = L / 2;
  const h = Math.max(0, meio - SCM.actina), fimA = Math.min(SCM.A / 2, meio - .025);
  let g;
  if (a <= .2) g = a / .2 * h;
  else if (a <= SCM.A / 2) g = h + (a - .2) / (SCM.A / 2 - .2) * (fimA - h);
  else if (a <= 1.175) g = fimA + (a - SCM.A / 2) / (1.175 - SCM.A / 2) * (meio - .025 - fimA);
  else g = meio - .025 + (a - 1.175);
  return (i - 1) * L + s * g;
}
function aplicarMiofibrila() {
  const L = parseFloat(E.contr.value);
  mioPartes.sarcs.forEach((s, i) => { aplicarComprimento(s, L); s.position.x = (i - (N_SARC_MIO - 1) / 2) * L; });
  mioPartes.aneis.forEach((z, j) => { z.position.x = (j - N_SARC_MIO / 2) * L; });
  mioPartes.tampas.forEach(t => { t.position.x = Math.sign(t.position.x) * (N_SARC_MIO * L / 2 + .03); });
  const v = new THREE.Vector3();
  for (const m of mioPartes.capa) {
    const { geo, xRep, posRep, inv } = m.userData.capaRepouso, pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.set(posRep[i * 3], posRep[i * 3 + 1], posRep[i * 3 + 2]).applyMatrix4(m.matrix);
      v.x = posicaoNoComprimento(xRep[i], L);
      v.applyMatrix4(inv);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true; geo.computeBoundingBox(); geo.computeBoundingSphere();
  }
}
E.contr.addEventListener('input', aplicarMiofibrila);
/* depois da ação do próprio botão (o de Restaurar é ligado mais abaixo) */
for (const id of ['relaxar', 'contrair', 'restaurarParametros']) $(id).addEventListener('click', () => setTimeout(aplicarMiofibrila));
aplicarMiofibrila();
window.miofibrilaMedidas = () => {                                                // diagnóstico (console)
  const L = parseFloat(E.contr.value), r = x => +x.toFixed(4);
  return { L, aneis: mioPartes.aneis.map(z => r(z.position.x)),
    discosZ: mioPartes.sarcs.flatMap(s => [r(s.position.x + s.userData.zL.position.x), r(s.position.x + s.userData.zR.position.x)]),
    bandaA: SCM.A, tampas: mioPartes.tampas.map(t => r(t.position.x)) };
};

/* ------------------------------------------------------------ laço */
/* O devicePixelRatio muda quando a janela vai para outro monitor ou o navegador
   dá zoom. Fixá-lo só na partida deixava a cena rasterizada abaixo da tela. */
let ultimoDPR = 0, enquadrado = false;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  const mudouProporcao = Math.abs(camera.aspect - w / h) > .001;
  if (devicePixelRatio !== ultimoDPR) { ultimoDPR = devicePixelRatio; renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); }
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  if (!enquadrado || mudouProporcao) { enquadrado = true; resetCam(); }
}
new ResizeObserver(resize).observe(stage); resize();
function definirGiro(ativo) {
  girar = ativo;
  $('iniciar').disabled = ativo; $('pausar').disabled = !ativo;
  $('giroEstado').textContent = ativo ? 'Giro em execução' : 'Giro pausado';
}
$('iniciar').onclick = () => definirGiro(true);
$('pausar').onclick = () => definirGiro(false);
$('velocidade').oninput = e => {
  velocidadeGiro = Number(e.target.value);
  $('velocidadeValor').textContent = velocidadeGiro.toFixed(2).replace('.',',') + '×';
};
$('restaurarParametros').onclick = () => {
  definirGiro(false); velocidadeGiro = 1; $('velocidade').value = 1;
  $('velocidadeValor').textContent = '1,00×';
  E.contr.value = 2.4; onContracao(); root.rotation.set(0,0,0); resetCam();
};
$('telaCheia').onclick = async () => {
  try { if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen(); }
  catch { $('giroEstado').textContent = 'A ampliação não está disponível neste navegador.'; }
};
document.addEventListener('fullscreenchange', () => {
  $('telaCheia').textContent = document.fullscreenElement ? 'Reduzir' : 'Ampliar';
  resize(); resetCam();
});
const clock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop); const dt = clock.getDelta();
  if (girar && !transicao) root.rotation.y += dt * .08 * velocidadeGiro;
  if (transicao) {
    transicao.t = Math.min(1, transicao.t + dt * (transicao.mergulho ? 1.1 : 2.4)); const e = 1 - Math.pow(1 - transicao.t, 3);
    if (transicao.mergulho) {
      transicao.velho.scale.setScalar(1 + e * 2.2); transicao.velho.position.copy(transicao.foco).multiplyScalar(-e * 2.2); setOpacidade(transicao.velho, Math.max(0, 1 - e * 1.6));
      transicao.novo.scale.setScalar(.18 + e * .82); transicao.novo.position.copy(transicao.foco).multiplyScalar(1 - e);
    } else { transicao.velho.scale.setScalar(1 - e * .3); setOpacidade(transicao.velho, 1 - e); transicao.novo.scale.setScalar(.7 + e * .3); }
    if (transicao.t >= 1) { restaurar(transicao.velho); transicao.velho.visible = false; transicao.velho.scale.setScalar(1); transicao.velho.position.set(0, 0, 0); transicao.novo.scale.setScalar(1); transicao.novo.position.set(0, 0, 0); transicao = null; resetCam(); }
  }
  controls.update(); renderer.render(scene, camera); atualizarRotulos();
})();

/* ------------------------------------------------------------ RA */
const TAM_REAL = [.36, .40, .46, .60, .90]; // metros, maior dimensão de cada nível no ambiente
/* O QUE O IPHONE FAZ HOJE, e por que a página precisa dizer.
   O Quick Look abre no modo Objeto: o modelo aparece parado sobre fundo claro,
   e a câmera só entra depois de um toque em "AR", no alto da folha. O iOS
   antigo abria direto na câmera — a página prometia isso e a promessa quebrou
   sozinha, sem uma linha mudar aqui. Quem lê "Toque para abrir a câmera",
   recebe um objeto parado e não vê o seletor conclui que a RA não funciona.
   Foi exatamente o que aconteceu. */
const ehQuickLook = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const COMO_ABRIR = ehQuickLook
  ? 'Toque, e depois em "AR" no alto da tela para ir à câmera.'
  : 'Toque para abrir a câmera.';
/* CLONAR SEM COPIAR OS DADOS INTERNOS. `clone(true)` copia o userData por
   JSON, e o do sarcômero guarda os próprios discos Z e titinas — objetos 3D
   com textura, que o JSON transforma em imagem: 3,6 s a cada exportação, e o
   GLB não usa nada disso. O clone sai com a mesma geometria, material e pose;
   o userData de cada objeto volta intacto logo depois. */
function clonarSemDados(obj) {
  const guardados = [];
  obj.traverse(o => { if (o.userData && Object.keys(o.userData).length) { guardados.push([o, o.userData]); o.userData = {}; } });
  try { return obj.clone(true); } finally { for (const [o, u] of guardados) o.userData = u; }
}
let arUrl = null, prepId = 0, timer = null, tamNoAmbiente = 0;
/* MIOFIBRILA E SARCÔMERO VÃO À MESA NA ESCALA DO REPOUSO. A escala era tirada
   da caixa do instante: o sarcômero contraído (1,9 µm) e o relaxado (2,4 µm)
   saíam com os mesmos 0,90 m, e duas peças lado a lado pareciam iguais. Agora
   o fator vem da peça a 2,4 µm, medida aqui (a página abre relaxada): a
   contraída chega mais curta, na proporção certa, e a banda A tem o mesmo
   tamanho nas duas. */
const maiorLado = obj => { const c = clonarSemDados(obj); c.visible = true; c.position.set(0, 0, 0); c.scale.setScalar(1); c.updateMatrixWorld(true); const t = new THREE.Box3().setFromObject(c).getSize(V()); return Math.max(t.x, t.y, t.z); };
const LADO_REPOUSO = { 3: maiorLado(modelos[3]), 4: maiorLado(modelos[4]) };
function prepararRA() {
  if (typeof prepararBotoes === 'function') prepararBotoes();
  clearTimeout(timer); timer = setTimeout(async () => {
    const id = ++prepId; E.ar.disabled = true; E.status.textContent = 'Preparando o modelo para a câmera…';
    try {
      const clone = clonarSemDados(modelos[atual]); clone.visible = true; clone.position.set(0, 0, 0); clone.scale.setScalar(1);
      // titina/discos do sarcômero são referenciados pelo userData, mas o clone leva a pose atual
      const box = new THREE.Box3().setFromObject(clone); const tam = box.getSize(V()); const lado = Math.max(tam.x, tam.y, tam.z); const esc = TAM_REAL[atual] / (LADO_REPOUSO[atual] || lado); tamNoAmbiente = lado * esc;
      clone.scale.setScalar(esc); clone.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(clone); clone.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
      /* nem a cor por vértice nem a dupla face atravessam o USDZ: sem isto o
         iPhone recebe branco no lugar do tecido e um vão onde havia parede */
      prepararParaRA(clone);
      const wrap = new THREE.Group(); wrap.add(clone);
      const buf = await new GLTFExporter().parseAsync(wrap, { binary: true, onlyVisible: true });
      if (id !== prepId) return;
      if (arUrl) URL.revokeObjectURL(arUrl); arUrl = URL.createObjectURL(new Blob([buf], { type: 'model/gltf-binary' }));
      E.viewer.src = arUrl;
    } catch (err) { console.error(err); E.status.textContent = 'Não foi possível preparar o modelo para RA.'; }
  }, 350);
}
E.viewer.addEventListener('load', () => {
  /* no sarcômero do iPhone o botão espera o arquivo com as placas, que é o que ele abre */
  if (usaBotoes()) { if (!botoesProntos) { E.ar.disabled = true; E.status.textContent = 'Preparando as placas Contrair e Relaxar…'; } return; }
  if (E.viewer.canActivateAR) { E.ar.disabled = false; E.status.textContent = `Pronto. Tamanho no ambiente: ${tamNoAmbiente.toFixed(2)} m. ${COMO_ABRIR}`; }
  else { E.ar.disabled = true; E.status.textContent = 'Este navegador não abre RA. Use o Safari no iPhone/iPad ou o Chrome no Android.'; }
});
E.viewer.addEventListener('error', () => { E.status.textContent = 'O modelo não carregou no visualizador de RA.'; });
/* o clique tem de chamar activateAR() sem nenhum await antes — regra do Safari */
E.ar.addEventListener('click', () => {
  /* nível 05 no iPhone: o botão único abre a peça com as placas; sem await — regra do Safari */
  if (usaBotoes() && botoesProntos && ancoraAR.href) { ancoraAR.click(); return; }
  try { E.viewer.activateAR(); } catch (err) { console.error(err); E.status.textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; } });

/* ------------------------------------------------------------ RA com botões no iPhone (nível 05)
   O botão "Abrir em realidade aumentada" é o único: no nível 05, no iPhone,
   ele abre a peça com as placas; nos outros níveis e no Android, a peça de
   sempre. (Antes havia um segundo botão de teste ao lado.)
   O Quick Look não aceita controles da página, mas lê comportamentos de dentro
   do USDZ: na mesa aparecem duas placas, "Relaxar" (2,4 µm) e "Contrair"
   (1,9 µm). Tocar numa placa desliza os discos Z (com as actinas) e estica ou
   encurta a titina até aquele comprimento — as poses saem de
   `aplicarComprimento`, a mesma função da tela. A peça abre no comprimento
   escolhido no controle. O botão atual de RA continua igual. */
const ESTADOS_BOTOES = [{ rotulo: 'Relaxar', L: 2.4 }, { rotulo: 'Contrair', L: 1.9 }];
let botoesUrl = null, botoesId = 0, botoesTimer = null, pacoteBotoes = null, botoesProntos = false, botoesFalhou = false;
/* se as placas não puderem ser montadas, o botão volta a abrir a peça comum */
const usaBotoes = () => atual === 4 && !botoesFalhou && (ehQuickLook || new URLSearchParams(location.search).has('botoesios'));
const ancoraAR = document.createElement('a');
ancoraAR.rel = 'ar'; ancoraAR.hidden = true; ancoraAR.appendChild(document.createElement('img'));
document.body.appendChild(ancoraAR);
function prepararBotoes() {
  clearTimeout(botoesTimer);
  botoesProntos = false; botoesFalhou = false; ancoraAR.removeAttribute('href');
  if (!usaBotoes()) return;
  E.ar.disabled = true; E.status.textContent = 'Preparando as placas Contrair e Relaxar…';
  botoesTimer = setTimeout(async () => {
    const id = ++botoesId, t0 = performance.now();
    try {
      /* poses das partes que se movem, em cada estado, tiradas do próprio motor */
      const moveisTela = [sarc.userData.zL, sarc.userData.zR, ...sarc.userData.titinas.map(t => t.mola)];
      const atualL = sarc.userData.comprimento;
      const poses = ESTADOS_BOTOES.map(e => { aplicarComprimento(sarc, e.L); return moveisTela.map(m => { m.updateMatrix(); return m.matrix.clone(); }); });
      aplicarComprimento(sarc, atualL);
      const clone = clonarSemDados(sarc); clone.visible = true; clone.position.set(0, 0, 0); clone.scale.setScalar(1);
      /* o clone tem a mesma árvore: acha as partes correspondentes pela ordem */
      const orig = [], copia = []; sarc.traverse(o => orig.push(o)); clone.traverse(o => copia.push(o));
      const moveis = moveisTela.map(m => copia[orig.indexOf(m)]);
      const esc = TAM_REAL[4] / LADO_REPOUSO[4]; clone.scale.setScalar(esc); clone.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(clone); clone.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
      moveis.forEach((m, i) => { m.name = 'rqbMovel_' + i; });                       // nome único antes das gêmeas
      prepararParaRA(clone);
      /* gêmeas pelo avesso (dupla face) acompanham a parte de origem */
      const todos = [...moveis], posesTodos = poses.map(p => [...p]);
      moveis.forEach((m, i) => m.parent.children.filter(x => x.name === m.name + '-avesso').forEach(g => { todos.push(g); posesTodos.forEach((p, k) => p.push(poses[k][i])); }));
      const { usdz, usda, alinhado } = await usdzComBotoes({ peca: clone, moveis: todos,
        estados: ESTADOS_BOTOES.map((e, k) => ({ rotulo: e.rotulo, poses: posesTodos[k] })) });
      if (id !== botoesId) return;
      if (botoesUrl) URL.revokeObjectURL(botoesUrl);
      botoesUrl = URL.createObjectURL(new Blob([usdz], { type: 'model/vnd.usdz+zip' }));
      /* SEM PINÇA NESTE MODO. Testado no iPhone: ampliando a cena, a peça
         passava a cobrir as placas e o toque deixava de chegar a elas. Com a
         escala travada, a peça fica no tamanho real e as placas sempre no
         chão, à frente. O botão de RA comum continua com a pinça. */
      ancoraAR.href = botoesUrl + '#allowsContentScaling=0';
      pacoteBotoes = { bytes: usdz.byteLength, ms: +(performance.now() - t0).toFixed(0), partesMoveis: todos.length,
        estados: ESTADOS_BOTOES, comprimentoInicial: atualL, alinhado: alinhado.every(a => a.ok), arquivos: alinhado.length, usda };
      botoesProntos = true;
      if (usaBotoes()) { E.ar.disabled = false; E.status.textContent = `Pronto. Tamanho no ambiente: ${TAM_REAL[4].toFixed(2)} m em repouso. ${COMO_ABRIR} Na mesa, toque nas placas Contrair e Relaxar.`; }
    } catch (err) {
      console.error(err);
      if (id !== botoesId) return;
      /* NÃO DEIXAR O ÚNICO BOTÃO PRESO. Sem as placas, ele abre a peça comum, se
         ela já estiver pronta; senão o carregamento do visualizador o libera. */
      botoesFalhou = true;
      if (E.viewer.canActivateAR && E.viewer.src) { E.ar.disabled = false; E.status.textContent = `Pronto, sem as placas Contrair e Relaxar (não puderam ser preparadas). Tamanho no ambiente: ${tamNoAmbiente.toFixed(2)} m. ${COMO_ABRIR}`; }
    }
  }, 450);
}
window.pacoteBotoesIOS = () => pacoteBotoes && (({ usda, ...r }) => r)(pacoteBotoes);
window.usdaBotoesIOS = () => pacoteBotoes && pacoteBotoes.usda;
window.urlBotoesIOS = () => botoesUrl;

onContracao();
const pedido = parseInt(new URLSearchParams(location.search).get('nivel'), 10);
if (Number.isFinite(pedido) && pedido >= 1 && pedido <= 5) irDireto(pedido - 1); else prepararRA();
