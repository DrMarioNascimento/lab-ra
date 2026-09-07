/* ============================================================================
   TESTE 09 — FORÇAS DE STARLING · painel, laço e o caminho da RA.
   A física está em `fisica.js` e a geometria em `modelos.js`. Aqui só se
   juntam as duas — e essa separação é o que permite conferir a física sem
   abrir navegador nenhum, que é onde esta bancada podia errar calada.

   A ALAVANCA É A ONCÓTICA, e ela é o centro da bancada: puxar a albumina para
   baixo move o ponto de virada até ele sair do capilar, e a partir daí filtra
   do começo ao fim. O interstício encharca na tela e o número diz em quantos
   mililitros.

   A REGRA DA CASA: todo estado a que só se chega andando precisa de um jeito
   de se chegar parado. `?nivel=`, `?onc=` e `?causa=` abrem a bancada onde se
   quiser — o painel do navegador congela o laço, e sem isso nada é conferível.
   ========================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { criar, FORA, DENTRO } from './modelos.js';
import {
  PADRAO, FOLGA_MMHG, pressaoCapilar, pressaoLiquida, pontoDeVirada,
  mediaLiquida, balanco, edemaEm, comCausa, CAUSAS,
} from './fisica.js';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.14;
const scene = new THREE.Scene();
/* A NEVOA TEM DE CABER NOS DOIS TAMANHOS DESTA BANCADA. Calibrada para o
   capilar de 60 um, ela comia 62% do nivel 01, que a camera olha de 280 de
   distancia — o leito virava neblina roxa. Fraca aqui, e o nivel 01 ainda
   ganha profundidade sem perder o desenho. */
scene.fog = new THREE.FogExp2(0x0a0d10, .0008);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .74;

const camera = new THREE.PerspectiveCamera(34, 1, .1, 3000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;

scene.add(new THREE.HemisphereLight(0xe6f0ff, 0x151018, 1.0));
const key = new THREE.DirectionalLight(0xfff4e8, 2.5); key.position.set(60, 90, 80); scene.add(key);
const fill = new THREE.DirectionalLight(0xffd0c4, .6); fill.position.set(-70, 20, 50); scene.add(fill);
const rim = new THREE.DirectionalLight(0x8fb8ff, 1.0); rim.position.set(-40, 30, -90); scene.add(rim);

const root = new THREE.Group(); scene.add(root);
const { modelos, animar, aplicarForcas } = criar();
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
/* O QUADRO TEM DE CABER O TECIDO INCHADO, e não o em repouso. O gel cresce
   até 1,55x com o edema, e medido parado o modelo saía pela beira justamente
   no estado que a bancada existe para mostrar. A rede do nível 01 não incha e
   não paga essa margem. */
const FOLGA_EDEMA = 1.5;
function enquadrar(n) {
  const d = raio[n] * (n === 0 ? 1 : FOLGA_EDEMA) / Math.tan(camera.fov * Math.PI / 360) * 1.15;
  camera.position.set(d * .18, d * .34, d * .92);
  controls.target.set(0, 0, 0);
  controls.minDistance = d * .3; controls.maxDistance = d * 3;
  controls.update();
}

/* ------------------------------------------------------------ estado */
let causaAtual = 'normal';
let oncManual = null;                 // quando a alavanca é puxada à mão
let minutos = 0, correndo = false;

function estado() {
  const { estado: e } = comCausa(causaAtual);
  return oncManual === null ? e : { ...e, oncPlasma: oncManual };
}
function semLinfa() { return comCausa(causaAtual).semLinfa; }

/* ------------------------------------------------------------ níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'Onde a água sai e onde ela volta?',
    texto: 'Não se troca nada na artéria nem na veia: troca-se aqui, onde a parede tem uma célula de espessura e o sangue anda devagar. O leito capilar é o único lugar do corpo em que o sangue e o tecido conversam.',
    tags: ['arteríola · capilar · vênula', 'parede de uma célula'] },
  { olho: 'Nível 02', titulo: 'Um capilar, e o gel em volta',
    texto: 'O interstício não é vão vazio: é gel, com fibra e proteína. É por ser gel que ele aguenta encher sem estourar — e é a complacência dele que responde por parte da folga de 17 mmHg que segura o edema.',
    tags: ['interstício é gel', 'hemácia passa uma a uma'] },
  { olho: 'Nível 03', titulo: 'Quatro forças, e o que decide é a soma',
    texto: 'Âmbar empurra para fora, azul puxa para dentro, e o comprimento de cada seta é o valor em mmHg. Nenhuma das quatro decide sozinha. A soma dá +13 na ponta arteriolar e −7 na venular, e troca de sinal a 65% do caminho.',
    tags: ['Pc · Pi · πc · πi', 'virada em 65%'] },
  { olho: 'Nível 04', titulo: 'A alavanca que encharca',
    texto: 'Puxe a albumina para baixo e veja o ponto de virada correr para a ponta venular — e depois sair do capilar. Sem virada, filtra do começo ao fim. Repare que albumina baixa sozinha incha pouco: a força oncótica inteira vale 20 mmHg e mal vence a folga de 17.',
    tags: ['πc é a albumina', 'a virada some'] },
  { olho: 'Nível 05', titulo: 'Edema é o que a linfa não deu conta',
    texto: 'Em tecido normal filtra-se um pouco mais do que se reabsorve, e a diferença volta pela linfa — que nasce em fundo cego, ali no tecido. Edema não é filtrar demais: é filtrar mais do que a linfa leva. Por isso um linfático obstruído incha sem nenhuma das quatro forças mudar.',
    tags: ['linfático de fundo cego', 'folga de 17 mmHg'] },
];
const ROTULO = ['A rede', 'O capilar', 'As forças', 'A alavanca', 'O edema'];
const TAM_REAL = [.72, .58, .58, .58, .62];

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
  $('caixaForcas').hidden = atual < 2;
  $('caixaEdema').hidden = atual < 3;
  enquadrar(atual);
  atualizar(); prepararRA();
}

/* ------------------------------------------------------------ atualizar */
function atualizar() {
  const e = estado(), sl = semLinfa();
  const b = balanco(e, { semLinfa: sl });
  const v = pontoDeVirada(e);

  aplicarForcas(atual, e, pressaoCapilar);

  $('lArterial').textContent = (pressaoLiquida(0, e) >= 0 ? '+' : '') + pressaoLiquida(0, e).toFixed(0);
  $('lVenular').textContent = (pressaoLiquida(1, e) >= 0 ? '+' : '') + pressaoLiquida(1, e).toFixed(0);
  $('lMedia').textContent = (b.media >= 0 ? '+' : '') + b.media.toFixed(1);
  $('lVirada').textContent = v === null ? 'não há' : `${(v * 100).toFixed(0)}%`;
  $('lOnc').textContent = e.oncPlasma.toFixed(0);
  $('oncCursor').value = e.oncPlasma;
  $('lLinfa').textContent = sl ? 'obstruído' : `${(b.linfa * 60).toFixed(1)} ml/h`;
  $('lAcumula').textContent = b.acumula <= 0 ? 'nada' : `${(b.acumula * 60).toFixed(1)} ml/h`;

  const ml = edemaEm(minutos, e, { semLinfa: sl });
  $('lEdema').textContent = ml.toFixed(1);
  $('lMinutos').textContent = minutos.toFixed(0);
  $('barraEdema').style.width = clamp(ml / 60 * 100, 0, 100).toFixed(1) + '%';

  $('estadoLabel').textContent = comCausa(causaAtual).nome;
  $('somaLabel').textContent = v === null
    ? (b.media > 0 ? 'filtra do começo ao fim' : 'reabsorve do começo ao fim')
    : `vira a ${(v * 100).toFixed(0)}% do capilar`;

  desenharCurva();
}

/* ------------------------------------------------------------ a curva */
const gr = $('curvaSoma'), ctx = gr.getContext('2d');
function desenharCurva() {
  const e = estado(), W = gr.width, H = gr.height;
  ctx.clearRect(0, 0, W, H);
  const m = { e: 34, d: 10, t: 14, b: 24 };
  const px = u => m.e + u * (W - m.e - m.d);
  /* a escala do eixo segue o estado: com a alavanca no chão a soma passa de
     +20, e uma escala fixa cortaria a curva justamente onde ela ensina */
  const alto = Math.max(20, Math.abs(pressaoLiquida(0, e)), Math.abs(pressaoLiquida(1, e)));
  const py = p => m.t + (alto - p) / (2 * alto) * (H - m.t - m.b);

  ctx.strokeStyle = '#1f6b33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(m.e, py(0)); ctx.lineTo(W - m.d, py(0)); ctx.stroke();
  ctx.fillStyle = '#7f9a80'; ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.fillText('0', 16, py(0) + 3);
  ctx.fillText('+' + alto.toFixed(0), 8, py(alto) + 8);
  ctx.fillText('-' + alto.toFixed(0), 8, py(-alto) - 2);
  ctx.fillText('arteriolar', m.e, H - 8);
  ctx.fillText('venular', W - m.d - 42, H - 8);

  /* a área acima de zero é filtração e a de baixo é reabsorção: pintar as
     duas com as cores das setas amarra o gráfico ao modelo */
  for (const [sinal, tinta] of [[1, 'rgba(245,158,46,.22)'], [-1, 'rgba(70,132,214,.22)']]) {
    ctx.beginPath(); ctx.moveTo(px(0), py(0));
    for (let i = 0; i <= 100; i++) {
      const u = i / 100, p = pressaoLiquida(u, e);
      ctx.lineTo(px(u), py(sinal > 0 ? Math.max(0, p) : Math.min(0, p)));
    }
    ctx.lineTo(px(1), py(0)); ctx.closePath();
    ctx.fillStyle = tinta; ctx.fill();
  }

  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const u = i / 100, p = pressaoLiquida(u, e);
    i ? ctx.lineTo(px(u), py(p)) : ctx.moveTo(px(u), py(p));
  }
  ctx.strokeStyle = '#f2f7ec'; ctx.lineWidth = 2.2; ctx.stroke();

  const v = pontoDeVirada(e);
  if (v !== null) {
    ctx.beginPath(); ctx.arc(px(v), py(0), 4, 0, 7);
    ctx.fillStyle = '#5fd177'; ctx.fill();
  }
}

/* ------------------------------------------------------------ laço */
function ajustar() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  desenhar();
}
addEventListener('resize', ajustar);
function desenhar() { desenharCurva(); renderer.render(scene, camera); }

let anterior = performance.now();
renderer.setAnimationLoop(t => {
  const dt = Math.min(.12, (t - anterior) / 1000); anterior = t;
  const e = estado();
  const encharcado = clamp(edemaEm(minutos, e, { semLinfa: semLinfa() }) / 60, 0, 1);
  animar(t, u => pressaoLiquida(u, e), { encharcado });
  if (correndo) {
    minutos += dt * 2;                 // um segundo de relógio, dois minutos de tecido
    atualizar();
  }
  controls.update();
  renderer.render(scene, camera);
});

/* ------------------------------------------------------------ controles */
$('oncCursor').addEventListener('input', e => {
  oncManual = parseFloat(e.currentTarget.value);
  atualizar(); prepararRA();
});
$('reporOnc').onclick = () => { oncManual = null; atualizar(); prepararRA(); };
$('correr').onclick = e => {
  correndo = !correndo;
  e.currentTarget.textContent = correndo ? 'Parar o relógio' : 'Correr o relógio';
};
$('zerar').onclick = () => { minutos = 0; atualizar(); };

const seletor = $('causas');
seletor.innerHTML = CAUSAS.map(c =>
  `<button type="button" data-causa="${c.id}"${c.id === 'normal' ? ' class="on"' : ''}>${c.nome}</button>`).join('');
seletor.addEventListener('click', ev => {
  const b = ev.target.closest('button[data-causa]');
  if (!b) return;
  causaAtual = b.dataset.causa; oncManual = null; minutos = 0;
  seletor.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  atualizar(); prepararRA();
});

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
      const clone = modelos[atual].clone(true);
      clone.visible = true; clone.updateMatrixWorld(true);
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
const onc = parseFloat(busca.get('onc'));
const causa = busca.get('causa');
if (causa && CAUSAS.some(c => c.id === causa)) {
  causaAtual = causa;
  seletor.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.causa === causa));
}
if (Number.isFinite(onc)) oncManual = onc;
const min = parseFloat(busca.get('min'));
if (Number.isFinite(min)) minutos = min;
irAoNivel(Number.isFinite(nivel) ? nivel - 1 : 0);
/* desenha uma vez à mão: o laço pode estar congelado no painel do navegador */
animar(0, u => pressaoLiquida(u, estado()));
desenhar();
