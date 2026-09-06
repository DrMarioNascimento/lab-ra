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
import { criar } from './modelos.js';

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
/* Sem sombra, tecido vira adesivo: é o contato com o pedestal e a sombra que um
   fascículo joga no vizinho que dizem qual está na frente. */
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

const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, .14, 72), new THREE.MeshStandardMaterial({ color: 0x0e0907, roughness: .9, metalness: .04 }));
pedestal.position.y = -1.9; pedestal.receiveShadow = true; scene.add(pedestal);
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
  ['Escala subcelular', '04 · Miofibrila', 'Cadeia de sarcômeros', 'Miofibrila', 'Sarcômeros em série, de disco Z a disco Z. O corte longitudinal mostra que as bandas claras e escuras são os próprios filamentos vistos de lado.', 'disco Z,banda I,banda A,sarcômeros em série'],
  ['Escala molecular', '05 · Sarcômero', 'Unidade contrátil', 'Sarcômero', 'Rede hexagonal: cada miosina rodeada por seis actinas. As cabeças de miosina apontam para os discos Z. A titina ancora a miosina ao Z. Deslize o controle e veja a banda I e a zona H encolherem — a banda A não muda.', 'disco Z,actina,miosina,zona H,linha M,titina'],
];
const E = {
  scale: $('scaleLabel'), step: $('stepLabel'), eye: $('infoEyebrow'), title: $('infoTitle'), text: $('infoText'), tags: $('microtags'),
  prev: $('prev'), next: $('next'), ar: $('launchAR'), status: $('raStatus'), viewer: $('arViewer'),
  contr: $('contracao'), contrBox: $('contracaoBox'), contrVal: $('contracaoValor'), tens: $('tensao'), rot: $('rotulos'), labels: $('labels'),
};

let atual = 0, transicao = null, girar = true;
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
  E.contrBox.hidden = n !== 4; E.labels.innerHTML = '';
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
  3: () => [['disco Z', V(-SARC.len, .5, 0)], ['banda A (escura)', V(.45, -.55, .2)], ['banda I (clara)', V(-.75, .6, .2)], ['filamentos', V(0, .2, .4)]],
  2: () => [['sarcolema', V(-1.6, .85, 0)], ['núcleo periférico', V(.4, .8, .3)], ['miofibrilas', V(2.7, .2, 0)], ['mitocôndrias', V(-.6, -.55, .5)]],
  1: () => [['perimísio', V(-1.4, 1.05, 0)], ['fibras musculares', V(2.1, .44, .3)], ['capilar', V(0, -.9, .4)]],
  0: () => [['ventre muscular', V(0, 1.06, .4)], ['tendão', V(2.95, .40, 0)], ['osso', V(4.3, .55, 0)], ['epimísio', V(-1.35, -.90, .5)], ['fascículos', V(.5, .84, .58)]],
};
let mostrarRotulos = true; E.rot.onclick = () => { mostrarRotulos = !mostrarRotulos; E.rot.classList.toggle('on', mostrarRotulos); E.labels.innerHTML = ''; };
function atualizarRotulos() {
  if (!mostrarRotulos || transicao) { if (E.labels.childElementCount) E.labels.innerHTML = ''; return; }
  const lista = ancoras[atual](); if (E.labels.childElementCount !== lista.length) { E.labels.innerHTML = lista.map(([t]) => `<span class="lbl">${t}</span>`).join(''); }
  const w = stage.clientWidth, h = stage.clientHeight; const obj = modelos[atual];
  lista.forEach(([, p], i) => { const v = p.clone().applyMatrix4(obj.matrixWorld).project(camera); const el = E.labels.children[i]; const vis = v.z < 1; el.style.opacity = vis ? 1 : 0; el.style.transform = `translate(${(v.x * .5 + .5) * w}px, ${(-v.y * .5 + .5) * h}px)`; });
}

/* ------------------------------------------------------------ laço */
/* O devicePixelRatio muda quando a janela vai para outro monitor ou o navegador
   dá zoom. Fixá-lo só na partida deixava a cena rasterizada abaixo da tela. */
let ultimoDPR = 0, enquadrado = false;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  if (devicePixelRatio !== ultimoDPR) { ultimoDPR = devicePixelRatio; renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); }
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  if (!enquadrado) { enquadrado = true; resetCam(); }
}
new ResizeObserver(resize).observe(stage); resize();
$('girar').onclick = e => { girar = !girar; e.currentTarget.classList.toggle('on', girar); };
const clock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop); const dt = clock.getDelta();
  if (girar && !transicao) root.rotation.y += dt * .08;
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
let arUrl = null, prepId = 0, timer = null;
function prepararRA() {
  clearTimeout(timer); timer = setTimeout(async () => {
    const id = ++prepId; E.ar.disabled = true; E.status.textContent = 'Preparando o modelo para a câmera…';
    try {
      const clone = modelos[atual].clone(true); clone.visible = true; clone.position.set(0, 0, 0); clone.scale.setScalar(1);
      // titina/discos do sarcômero são referenciados pelo userData, mas o clone leva a pose atual
      const box = new THREE.Box3().setFromObject(clone); const tam = box.getSize(V()); const esc = TAM_REAL[atual] / Math.max(tam.x, tam.y, tam.z);
      clone.scale.setScalar(esc); clone.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(clone); clone.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
      const wrap = new THREE.Group(); wrap.add(clone);
      const buf = await new GLTFExporter().parseAsync(wrap, { binary: true, onlyVisible: true });
      if (id !== prepId) return;
      if (arUrl) URL.revokeObjectURL(arUrl); arUrl = URL.createObjectURL(new Blob([buf], { type: 'model/gltf-binary' }));
      E.viewer.src = arUrl;
    } catch (err) { console.error(err); E.status.textContent = 'Não foi possível preparar o modelo para RA.'; }
  }, 350);
}
E.viewer.addEventListener('load', () => {
  if (E.viewer.canActivateAR) { E.ar.disabled = false; E.status.textContent = `Pronto. Tamanho no ambiente: ${TAM_REAL[atual].toFixed(2)} m. Toque para abrir a câmera.`; }
  else { E.ar.disabled = true; E.status.textContent = 'Este navegador não abre RA. Use o Safari no iPhone/iPad ou o Chrome no Android.'; }
});
E.viewer.addEventListener('error', () => { E.status.textContent = 'O modelo não carregou no visualizador de RA.'; });
/* o clique tem de chamar activateAR() sem nenhum await antes — regra do Safari */
E.ar.addEventListener('click', () => { try { E.viewer.activateAR(); } catch (err) { console.error(err); E.status.textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; } });

onContracao();
const pedido = parseInt(new URLSearchParams(location.search).get('nivel'), 10);
if (Number.isFinite(pedido) && pedido >= 1 && pedido <= 5) irDireto(pedido - 1); else prepararRA();
