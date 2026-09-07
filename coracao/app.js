/* ============================================================================
   TESTE 11 — CORAÇÃO EM AÇÃO · painel, relógio e RA.
   O motor está em `fisica.js`, a geometria em `modelos.js`. Aqui só se juntam.

   ── O RELÓGIO É UM SÓ, E É ELE O PEDIDO ──────────────────────────────────
   Condução elétrica, movimento das válvulas e fluxo de sangue não são três
   animações sincronizadas por mim: são três LEITURAS do mesmo instante do
   mesmo ciclo. `fase` vai de 0 a 1, o motor devolve o quadro daquele
   instante, e as três vistas apenas mostram partes diferentes dele. Não há
   como uma sair do compasso das outras — não porque eu tomei cuidado, mas
   porque não existe onde guardar um segundo tempo.

   O diagrama de Wiggers é a prova disso na tela: as pressões, o volume, o
   traçado elétrico e as bulhas num eixo de tempo só, com um cursor que é a
   mesma `fase` que move o coração em 3D.

   `?nivel=`, `?fc=` e `?fase=` abrem a bancada parada — regra da casa, porque
   o painel do navegador congela o laço de animação.
   ========================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { criar, aplicarQuadro } from './modelos.js';
import { NIVEIS } from './niveis.js';
import {
  simular, em, faseDe, duracoes, estruturaAtiva,
  tempoDiastolicoPorMinuto, CONDUCAO, faseDeSnapshotRA, bulhas,
} from './fisica.js';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
/* o ambiente também clareia: com ele alto o músculo perde a profundidade */
scene.environmentIntensity = .60;

const camera = new THREE.PerspectiveCamera(32, 1, .5, 3000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;

scene.add(new THREE.HemisphereLight(0xffeede, 0x181016, 1.0));
const key = new THREE.DirectionalLight(0xfff2e6, 2.6); key.position.set(120, 180, 160); scene.add(key);
const fill = new THREE.DirectionalLight(0xffcfc4, .62); fill.position.set(-140, 60, 100); scene.add(fill);
const rim = new THREE.DirectionalLight(0x9fb8ff, 1.1); rim.position.set(-80, 90, -180); scene.add(rim);

const root = new THREE.Group(); scene.add(root);
const { modelos, aplicarVolumes, aplicarValvas, aplicarConducao, aplicarSangue } = criar();
modelos.forEach((m, i) => { m.visible = i === 0; root.add(m); });

const raio = modelos.map(m => {
  m.updateWorldMatrix(true, true);
  let r = 0; const p = new THREE.Vector3();
  m.traverse(o => {
    if (!o.isMesh) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      r = Math.max(r, p.length());
    }
  });
  return r;
});
function alvoDaCamera(n) {
  if (NIVEIS[n].foco !== 'valvas') return new THREE.Vector3(0, 0, 0);
  const vs = modelos[n].userData.valvas;
  if (!vs) return new THREE.Vector3(0, 8, 0);
  modelos[n].updateWorldMatrix(true, true);
  const c = new THREE.Vector3();
  let k = 0;
  for (const v of Object.values(vs)) {
    const p = new THREE.Vector3();
    v.getWorldPosition(p);
    c.add(p);
    k++;
  }
  return k ? c.multiplyScalar(1 / k) : new THREE.Vector3(0, 8, 0);
}

function enquadrar(n) {
  const alvo = alvoDaCamera(n);
  /* o plano valvar pede um recorte, não um mergulho: zoom 0,58 deixava a
     câmera dentro da parede e as quatro cúspides sumiam num close-up */
  const valvas = NIVEIS[n].foco === 'valvas';
  const corte = NIVEIS[n].foco === 'corte';
  const zoom = valvas ? .88 : 1.12;
  const d = raio[n] / Math.tan(camera.fov * Math.PI / 360) * zoom;
  if (valvas) {
    controls.target.set(alvo.x, alvo.y - 2, alvo.z + 10);
    camera.position.set(alvo.x + d * .10, alvo.y + d * .20, alvo.z + d * 1.02);
  } else if (corte) {
    /* UMA SUPERFÍCIE VISTA DE PERFIL VIRA LINHA. A face do corte sempre
       esteve desenhada — pintei-a de verde numa cópia para conferir —, mas o
       ângulo padrão (azimute +13°) olhava quase dentro do plano do cunho e a
       faixa da espessura encolhia a três pixels. Os 10 mm contra 3,4, que são
       a lição inteira deste nível, estavam sendo jogados fora pela óptica e
       não pela geometria.

       Em −22° a faixa abre E a cavidade continua à vista. Em −40° a faixa
       fica ainda mais larga, mas aí se perde o que há dentro — e o nível se
       chama "por dentro". */
    controls.target.copy(alvo);
    camera.position.set(alvo.x - d * .36, alvo.y + d * .14, alvo.z + d * .90);
  } else {
    controls.target.copy(alvo);
    camera.position.set(alvo.x + d * .22, alvo.y + d * .14, alvo.z + d * .94);
  }
  controls.minDistance = d * .28; controls.maxDistance = d * 2.6;
  controls.update();
}

/* ------------------------------------------------------------ o relógio */
let fc = 75, fase = 0, batendo = true, sim = simular(fc);

function trocarFrequencia(nova) {
  fc = clamp(Math.round(nova), 40, 200);
  /* o motor roda dezesseis ciclos para chegar ao regime; é caro para o laço,
     então só se refaz quando a frequência muda de verdade */
  sim = simular(fc);
  $('fcValor').textContent = fc;
  $('fcCursor').value = fc;
  atualizar();
}

/* ------------------------------------------------------------ níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'O que acontece entre duas batidas?',
    texto: 'O coração inteiro, com os grandes vasos e as coronárias nos seus sulcos. Repare que os vasos se CRUZAM: o tronco pulmonar sai à frente e vai para a esquerda, a aorta sai atrás dele e curva para a direita. Gire e acompanhe o batimento.',
    tags: ['as coronárias correm nos sulcos', 'os vasos se cruzam'] },
  { olho: 'Nível 02', titulo: 'A parede esquerda é três vezes a direita',
    texto: 'As quatro câmaras por dentro. A diferença de espessura não é detalhe de ilustrador: é a resposta inteira à pergunta de por que a aorta tem 120 mmHg e a artéria pulmonar tem 25. O mesmo volume sai dos dois lados a cada batida — o que muda é contra o quê.',
    tags: ['10 mm contra 3', 'mesmo volume, pressões diferentes'] },
  { olho: 'Nível 03', titulo: 'As válvulas obedecem às pressões',
    texto: 'Nenhuma delas foi animada. A mitral abre quando o átrio tem mais pressão que o ventrículo, e a aórtica quando o ventrículo tem mais que a aorta. Entre os dois momentos as quatro ficam fechadas e o volume não muda — a fase isovolumétrica aparece sozinha.',
    tags: ['bolsa, não tampa', 'a fase isovolumétrica emerge'] },
  { olho: 'Nível 04', titulo: 'Do impulso ao músculo',
    texto: 'O sinal nasce no nó sinusal, espalha pelos átrios, e ENCALHA cem milissegundos no nó atrioventricular — é esse atraso que deixa o átrio terminar de encher antes de o ventrículo apertar. Depois desce pelo His, pelos ramos e pela rede de Purkinje. O músculo contrai um pouco DEPOIS de despolarizar.',
    tags: ['o nó AV segura 100 ms', 'contrair vem depois'] },
  { olho: 'Nível 05', titulo: 'Tudo no mesmo relógio',
    texto: 'As três leituras num instante só. Mexa na frequência e veja o que ela come: de 60 para 180 o ciclo perde 669 ms, e 519 saem da diástole. A diástase some primeiro, o enchimento encurta, o volume ejetado cai — e a coronária esquerda, que só enche na diástole, perde o tempo dela.',
    tags: ['a taquicardia come a diástole', 'a coronária perde tempo'] },
];
const ROTULO = NIVEIS.map(n => n.rotulo);
const TAM_REAL = [.26, .26, .22, .26, .26];

let atual = 0;
function irAoNivel(n) {
  atual = clamp(n, 0, 4);
  modelos.forEach((m, i) => { m.visible = i === atual; });
  const t = TEXTOS[atual];
  $('infoEyebrow').textContent = t.olho;
  $('infoTitle').textContent = t.titulo;
  $('infoText').textContent = t.texto;
  $('microtags').innerHTML = t.tags.map(x => `<span>${x}</span>`).join('');
  document.querySelectorAll('.step').forEach((b, i) => b.classList.toggle('active', i === atual));
  $('stepLabel').textContent = `0${atual + 1} · ${ROTULO[atual]}`;
  $('prev').disabled = atual === 0; $('next').disabled = atual === 4;
  enquadrar(atual);
  atualizar(); prepararRA();
}

/* ------------------------------------------------------------ atualizar */
const NOMES = {
  'sistole atrial': 'sístole atrial', 'contracao isovolumetrica': 'contração isovolumétrica',
  'ejecao': 'ejeção', 'relaxamento isovolumetrico': 'relaxamento isovolumétrico',
  'enchimento': 'enchimento', 'diastase': 'diástase',
};

function atualizar(dt = 0) {
  const q = em(sim, fase);
  const i = Math.floor(((fase % 1) + 1) % 1 * sim.quadro.length);
  const ant = sim.quadro[(i - 1 + sim.quadro.length) % sim.quadro.length];

  aplicarVolumes(q.vVE, q.vVD, q.vAE, q.vAD);
  aplicarValvas({ mitral: q.mitral, aortica: q.aortica, tricuspide: q.tricuspide, pulmonar: q.pulmonar });
  aplicarConducao(estruturaAtiva(q.t));
  /* o sangue anda com a MESMA vazão que o motor calculou para este instante,
     e não passa por valva fechada */
  aplicarSangue({
    mitral: { q: q.qMitral, aberta: q.mitral },
    aortica: { q: q.qAortica, aberta: q.aortica },
    tricuspide: { q: q.qTri, aberta: q.tricuspide },
    pulmonar: { q: q.qPulm, aberta: q.pulmonar },
  }, dt);

  const f = faseDe(q, ant);
  $('faseLabel').textContent = NOMES[f] || f;
  $('fcLabel').textContent = `${fc} bpm`;
  $('valvasLabel').textContent =
    (q.mitral ? 'M' : '·') + (q.aortica ? 'A' : '·') + (q.tricuspide ? 'T' : '·') + (q.pulmonar ? 'P' : '·');

  $('lPVE').textContent = q.pVE.toFixed(0);
  $('lPAo').textContent = q.pAo.toFixed(0);
  $('lPAE').textContent = q.pAE.toFixed(0);
  $('lVVE').textContent = q.vVE.toFixed(0);
  $('lPA').textContent = `${sim.sistolica.toFixed(0)}/${sim.diastolica.toFixed(0)}`;
  $('lSV').textContent = sim.ejecao.toFixed(0);
  $('lFE').textContent = (sim.fracao * 100).toFixed(0);
  $('lDC').textContent = sim.debito.toFixed(1);
  const d = duracoes(fc);
  $('lSistole').textContent = (d.sistole * 1000).toFixed(0);
  $('lDiastole').textContent = (d.diastole * 1000).toFixed(0);
  $('lCoronaria').textContent = tempoDiastolicoPorMinuto(fc).toFixed(0);
  $('lEletrico').textContent = estruturaAtiva(q.t).map(id =>
    (CONDUCAO.find(c => c.id === id) || {}).nome).filter(Boolean).join(' · ') || 'em repouso';

  desenharWiggers();
}

/* ── O DIAGRAMA DE WIGGERS ────────────────────────────────────────────────
   Quatro faixas num eixo de tempo só: pressões, volume, traçado elétrico e as
   bulhas. O cursor é a MESMA `fase` que move o coração em 3D — é aqui que a
   sincronia deixa de ser promessa e vira coisa que se confere. */
const gw = $('wiggers'), cw = gw.getContext('2d');
const fundoWiggers = document.createElement('canvas');
let wiggersQuadro = null;

function desenharTracosWiggers() {
  const W = gw.width, H = gw.height;
  if (fundoWiggers.width !== W || fundoWiggers.height !== H) {
    fundoWiggers.width = W;
    fundoWiggers.height = H;
  }
  const fw = fundoWiggers.getContext('2d');
  fw.clearRect(0, 0, W, H);
  const m = { e: 30, d: 8, t: 8, b: 14 };
  const px = f => m.e + f * (W - m.e - m.d);
  const faixa = (i, n) => {
    const alt = (H - m.t - m.b) / n;
    return { topo: m.t + i * alt, alt: alt - 6 };
  };
  const linha = (dados, y0, alt, min, max, tinta, largura = 1.8) => {
    fw.beginPath();
    dados.forEach((v, i) => {
      const x = px(i / (dados.length - 1));
      const y = y0 + alt - (clamp(v, min, max) - min) / (max - min) * alt;
      i ? fw.lineTo(x, y) : fw.moveTo(x, y);
    });
    fw.strokeStyle = tinta; fw.lineWidth = largura; fw.stroke();
  };
  const q = sim.quadro;
  fw.font = '9px "IBM Plex Mono", monospace';

  /* 1 · pressões: ventrículo, aorta e átrio no mesmo eixo — é o cruzamento
     delas que ABRE e FECHA as válvulas, e por isso têm de ficar juntas */
  let fx = faixa(0, 4);
  linha(q.map(x => x.pAo), fx.topo, fx.alt, 0, 140, '#c8363e');
  linha(q.map(x => x.pVE), fx.topo, fx.alt, 0, 140, '#f2f7ec', 2.1);
  linha(q.map(x => x.pAE), fx.topo, fx.alt, 0, 140, '#5fd177', 1.4);
  fw.fillStyle = '#7f9a80'; fw.fillText('mmHg', 2, fx.topo + 9);

  /* 2 · volume do ventrículo: os patamares são as fases isovolumétricas, e
     eles são o argumento visual de que as válvulas não foram roteirizadas */
  fx = faixa(1, 4);
  linha(q.map(x => x.vVE), fx.topo, fx.alt, 30, 140, '#f5c518', 2.1);
  fw.fillStyle = '#7f9a80'; fw.fillText('ml', 2, fx.topo + 9);

  /* 3 · o traçado elétrico */
  fx = faixa(2, 4);
  linha(q.map(x => x.ecg), fx.topo, fx.alt, -.35, 1.1, '#9fd8f2', 1.8);
  fw.fillStyle = '#7f9a80'; fw.fillText('ECG', 2, fx.topo + 9);

  /* 4 · as bulhas: a primeira no fechamento da mitral, a segunda no da
     aórtica. Elas não são desenhadas por tempo — são achadas percorrendo as
     válvulas, então caem sozinhas no lugar certo. O laço dá a volta: a 150
     bpm o B2 cai na emenda do ciclo. */
  fx = faixa(3, 4);
  fw.fillStyle = '#7f9a80'; fw.fillText('bulhas', 2, fx.topo + 9);
  for (const b of bulhas(q).todas) {
    const x = px(b.fase);
    fw.beginPath(); fw.moveTo(x, fx.topo + fx.alt); fw.lineTo(x, fx.topo + 2);
    fw.strokeStyle = '#ff9d2e'; fw.lineWidth = 2; fw.stroke();
    fw.fillStyle = '#ff9d2e'; fw.fillText(b.nome, x + 3, fx.topo + 9);
  }
  wiggersQuadro = q;
}

function desenharWiggers() {
  /* os traços só mudam quando o ciclo é recalculado; o cursor anda sozinho */
  if (wiggersQuadro !== sim.quadro) desenharTracosWiggers();
  const W = gw.width, H = gw.height;
  cw.clearRect(0, 0, W, H);
  cw.drawImage(fundoWiggers, 0, 0);
  const m = { e: 30, d: 8, t: 8, b: 14 };
  const x = m.e + ((fase % 1) + 1) % 1 * (W - m.e - m.d);
  cw.beginPath(); cw.moveTo(x, m.t); cw.lineTo(x, H - m.b);
  cw.strokeStyle = 'rgba(245,197,24,.85)'; cw.lineWidth = 1.5; cw.stroke();
}

/* ------------------------------------------------------------ laço */
function ajustar() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  desenhar();
}
addEventListener('resize', ajustar);
function desenhar() { desenharWiggers(); renderer.render(scene, camera); }

let anterior = performance.now();
renderer.setAnimationLoop(agora => {
  /* teto no delta: aba em segundo plano volta com um salto de segundos e o
     coração daria um pulo de vários batimentos */
  const dt = Math.min(.10, (agora - anterior) / 1000); anterior = agora;
  if (batendo) {
    fase = (fase + dt / duracoes(fc).rr * lentidao()) % 1;
    atualizar(dt * lentidao());
  }
  controls.update();
  renderer.render(scene, camera);
});
const lentidao = () => parseFloat($('lento').value);
const syncLento = () => { $('lentoValor').textContent = lentidao().toFixed(2) + '×'; };
syncLento();

/* ------------------------------------------------------------ controles */
$('fcCursor').addEventListener('input', e => trocarFrequencia(parseFloat(e.currentTarget.value)));
$('faseCursor').addEventListener('input', e => {
  batendo = false; $('bater').textContent = 'Bater';
  fase = parseFloat(e.currentTarget.value); atualizar(); desenhar();
});
$('bater').onclick = e => {
  batendo = !batendo;
  e.currentTarget.textContent = batendo ? 'Parar' : 'Bater';
};
$('lento').addEventListener('input', syncLento);
for (const [id, v] of [['repouso', 60], ['normal', 75], ['esforco', 150]])
  $(id).onclick = () => trocarFrequencia(v);

$('prev').onclick = () => irAoNivel(atual - 1);
$('next').onclick = () => irAoNivel(atual + 1);
document.querySelectorAll('.step').forEach(b => b.onclick = () => irAoNivel(+b.dataset.step));
$('resetView').onclick = () => enquadrar(atual);

/* ------------------------------------------------------------ RA */
let arUrl = null, prepId = 0, temporizador = null;
function prepararRA() {
  clearTimeout(temporizador);
  temporizador = setTimeout(async () => {
    const id = ++prepId;
    $('launchAR').disabled = true;
    $('raStatus').textContent = 'Preparando o modelo para a câmera…';
    try {
      /* `clone(true)` faz JSON.stringify do userData. No sangue isso
         serializa a CatmullRom das gotas — e no miolo do three.js o
         toJSON do grupo inteiro é pesado demais. Tira o sangue (é
         animação, não anatomia), esvazia o userData da raiz, clona,
         devolve. As cúspides ganham geometria própria só então. */
      const vivo = modelos[atual];
      const sangue = vivo.userData.sangue;
      if (sangue) vivo.remove(sangue);
      const udRaiz = vivo.userData;
      vivo.userData = {};
      const clone = vivo.clone(true);
      vivo.userData = udRaiz;
      if (sangue) vivo.add(sangue);
      clone.visible = true;
      clone.traverse(o => {
        if (o.isMesh && o.geometry?.userData?.nu) o.geometry = o.geometry.clone();
        if (o.isMesh && o.userData?.papelParede === 'selo') o.geometry = o.geometry.clone();
      });
      const spec = NIVEIS[atual].faseRA;
      if (spec) {
        const faseSnap = faseDeSnapshotRA(sim, spec);
        if (faseSnap != null) aplicarQuadro(clone, em(sim, faseSnap));
      }
      clone.updateMatrixWorld(true);
      const caixa = new THREE.Box3().setFromObject(clone), tam = caixa.getSize(new THREE.Vector3());
      clone.scale.setScalar(TAM_REAL[atual] / Math.max(tam.x, tam.y, tam.z));
      clone.updateMatrixWorld(true);
      const c2 = new THREE.Box3().setFromObject(clone);
      clone.position.set(-(c2.min.x + c2.max.x) / 2, -c2.min.y, -(c2.min.z + c2.max.z) / 2);
      prepararParaRA(clone);
      const wrap = new THREE.Group(); wrap.add(clone);
      const buf = await new GLTFExporter().parseAsync(wrap, { binary: true, onlyVisible: true });
      if (id !== prepId) return;
      if (arUrl) URL.revokeObjectURL(arUrl);
      arUrl = URL.createObjectURL(new Blob([buf], { type: 'model/gltf-binary' }));
      $('arViewer').src = arUrl;
    } catch (err) {
      console.error(err);
      $('raStatus').textContent = 'Não foi possível preparar o modelo para RA.';
    }
  }, 350);
}
const ehQuickLook = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const COMO_ABRIR = ehQuickLook
  ? 'Toque, e depois em "AR" no alto da tela para ir à câmera.'
  : 'Toque para abrir a câmera.';
$('arViewer').addEventListener('load', () => {
  if ($('arViewer').canActivateAR) {
    $('launchAR').disabled = false;
    $('raStatus').textContent = `Pronto. Tamanho no ambiente: ${TAM_REAL[atual].toFixed(2)} m. ${COMO_ABRIR}`;
  } else {
    $('launchAR').disabled = true;
    $('raStatus').textContent = 'Este navegador não abre RA. Use o Safari no iPhone/iPad ou o Chrome no Android.';
  }
});
$('arViewer').addEventListener('error', () => { $('raStatus').textContent = 'O modelo não carregou no visualizador de RA.'; });
$('launchAR').addEventListener('click', () => {
  try { $('arViewer').activateAR(); }
  catch (err) { $('raStatus').textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; }
});

/* ------------------------------------------------------------ entradas paradas */
ajustar();
const busca = new URLSearchParams(location.search);
const nivel = parseInt(busca.get('nivel'), 10);
const fcPedida = parseFloat(busca.get('fc'));
const fasePedida = parseFloat(busca.get('fase'));
if (Number.isFinite(fcPedida)) trocarFrequencia(fcPedida);
if (Number.isFinite(fasePedida)) {
  fase = clamp(fasePedida, 0, .999);
  batendo = false; $('bater').textContent = 'Bater';
  $('faseCursor').value = fase;
}
irAoNivel(Number.isFinite(nivel) ? nivel - 1 : 0);
/* desenha uma vez à mão: o laço pode estar congelado no painel do navegador */
desenhar();
