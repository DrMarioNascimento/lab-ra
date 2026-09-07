/* ============================================================================
   TESTE 10 — ESPAÇO PLEURAL E ZONAS DE WEST · painel, sensor, laço e RA.

   ESTA É A SEGUNDA BANCADA EM QUE O SENSOR É A FISIOLOGIA, e ela usa o mesmo
   truque da 08: `cos(θ) = cos(β)·cos(γ)`, só gravidade, sem `alpha` — que é
   rumo de bússola e castiga o iPhone. Aqui a inclinação faz DUAS coisas de
   uma vez, e é essa economia que justifica juntar os dois assuntos numa
   bancada só: em pé, o peso do pulmão abre o gradiente pleural (ventilação) e
   a coluna de sangue abre as zonas de West (perfusão). Deitado, as duas
   achatam. É a relação V/Q inteira num sensor.

   `?nivel=`, `?grau=`, `?pneumo=` e `?cenario=` abrem a bancada parada, que é
   a regra da casa — o painel do navegador congela o laço.
   ========================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { criar } from './modelos.js';
import {
  PULMAO, VOLUMES, alturaEfetiva, pressaoPleural, transpulmonar, volumeRelativo,
  ventilacaoRelativa, zonaEm, fluxoEm, perfilDeZonas, estadoDoPneumotorax, eixoDependente,
  cicloPleural, cicloAlveolar, retornoVenosoRelativo, AMPLITUDE_PPL,
  comCenario, CENARIOS,
} from './fisica.js';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .74;

const camera = new THREE.PerspectiveCamera(34, 1, .1, 900);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;

scene.add(new THREE.HemisphereLight(0xe9f0ff, 0x161018, 1.0));
const key = new THREE.DirectionalLight(0xfff4e8, 2.5); key.position.set(30, 46, 40); scene.add(key);
const fill = new THREE.DirectionalLight(0xffd0c4, .6); fill.position.set(-34, 12, 26); scene.add(fill);
const rim = new THREE.DirectionalLight(0x8fb8ff, 1.05); rim.position.set(-20, 16, -44); scene.add(rim);

/* O corpo pende deste grupo, e é ele que a inclinação gira — girar a câmera
   daria a mesma imagem e a conta errada: quem tem postura é o corpo. */
const root = new THREE.Group(); scene.add(root);
const { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas } = criar();
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
/* o quadro cabe a caixa ABERTA e o corpo DEITADO: medido em repouso e de pé,
   o modelo sairia pela beira justamente nos dois estados que a bancada mostra */
const FOLGA = 1.35;
function enquadrar(n) {
  const d = raio[n] * FOLGA / Math.tan(camera.fov * Math.PI / 360) * 1.1;
  camera.position.set(d * .22, d * .12, d * .95);
  controls.target.set(0, 0, 0);
  controls.minDistance = d * .3; controls.maxDistance = d * 2.6;
  controls.update();
}

/* ------------------------------------------------------------ o sensor */
const g2r = d => d * Math.PI / 180;
export function inclinacaoDe(beta, gamma) {
  const c = Math.cos(g2r(beta)) * Math.cos(g2r(gamma));
  const t = Math.acos(clamp(c, -1, 1)) * 180 / Math.PI;
  return t > 90 ? 180 - t : t;   /* de bruços também é decúbito */
}
let grauAlvo = 90, grau = 90, eventos = 0;
const SUAVE = .16;
function definirGrau(g, imediato = false) {
  grauAlvo = clamp(g, 0, 90);
  if (imediato) { grau = grauAlvo; atualizar(); desenhar(); }
}
function ligarSensor() {
  addEventListener('deviceorientation', e => {
    if (e.beta === null || e.gamma === null) return;
    eventos++;
    $('sensorEstado').textContent = 'sensor ligado';
    $('sensorEstado').classList.add('vivo');
    definirGrau(inclinacaoDe(e.beta, e.gamma));
  });
  /* a espera só começa a correr agora, quando já há o que esperar */
  setTimeout(() => { if (!eventos) $('sensorEstado').textContent = 'sem sensor — use o cursor'; }, 3500);
}
if (typeof DeviceOrientationEvent !== 'undefined'
    && typeof DeviceOrientationEvent.requestPermission === 'function') {
  $('permitir').hidden = false;
  $('permitir').onclick = async () => {
    try {
      const r = await DeviceOrientationEvent.requestPermission();
      if (r === 'granted') { $('permitir').hidden = true; ligarSensor(); }
      else $('sensorEstado').textContent = 'permissão negada — use o cursor';
    } catch (err) { $('sensorEstado').textContent = 'não deu para pedir a permissão'; }
  };
} else { ligarSensor(); }

/* ------------------------------------------------------------ estado */
let pneumo = 'nenhum', cenario = 'repouso';
/* O CICLO. `fase` 0 é o fim da expiração, quando não há fluxo — é o único
   instante em que a transpulmonar é o simétrico da pleural, e é por isso que
   todos os números clássicos são medidos ali. */
let fase = 0, respirando = false;
const ajuste = () => comCenario(cenario).ajuste;

/* ------------------------------------------------------------ níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'Um espaço que não é espaço',
    texto: 'Entre as duas pleuras não há vão: há um filme de líquido e pressão negativa segurando as duas encostadas, como dois vidros molhados que deslizam mas não se separam. O espaço pleural só vira espaço de verdade quando alguém fura a parede.',
    tags: ['poucos mililitros', 'deslizam, não separam'] },
  { olho: 'Nível 02', titulo: 'Duas molas em empate',
    texto: 'O pulmão puxa para dentro, a caixa torácica empurra para fora, e no repouso elas se anulam a 40% da capacidade total. É esse empate que deixa a pressão entre as duas negativa — a pressão pleural não é uma bomba, é o resultado de um cabo de guerra.',
    tags: ['recolhe × abre', 'CRF a 40%'] },
  { olho: 'Nível 03', titulo: 'O pneumotórax',
    texto: 'Fura a parede e o empate acaba: cada mola vai para o seu volume de repouso. O pulmão colapsa a 10% e — a parte que ninguém espera — a caixa ABRE até 60%. No hipertensivo a pressão passa de zero — e o que mata não é o desvio do mediastino, que é o sinal: é a pressão positiva ESMAGANDO O RETORNO VENOSO. Choque obstrutivo. Pela mesma conta, com sinal trocado, pleura mais negativa ajuda o retorno: é a bomba torácica.',
    tags: ['pulmão 10% · caixa 60%', 'retorno venoso a 64%'] },
  { olho: 'Nível 04', titulo: 'O ápice é maior e ventila menos',
    texto: 'A pressão pleural não é um número, é um gradiente: −10 no ápice, −2,5 na base. O alvéolo de cima já está esticado e senta na parte plana da curva; o de baixo senta no joelho, onde a mesma pressão enche muito mais. Respire com o botão e veja: numa respiração a base vai de 22% a 42% do volume e o ápice, de 63% a 73%. A base ganha o dobro sendo menor.',
    tags: ['−10 no ápice, −2,5 na base', 'a base ganha o dobro'] },
  { olho: 'Nível 05', titulo: 'As zonas de West',
    texto: 'Três pressões disputam o capilar: a arterial, a venosa e a alveolar, que aperta por fora. Em pé, a coluna de sangue faz o ápice receber pouco. Deitado, o pulmão inteiro vira zona 3. É a mesma gravidade do gradiente pleural, agora do lado da perfusão.',
    tags: ['zona 1 não existe em repouso', 'a cachoeira da zona 2'] },
];
const ROTULO = ['A fresta', 'As molas', 'Pneumotórax', 'O gradiente', 'As zonas'];
const TAM_REAL = [.34, .58, .58, .55, .55];

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
  $('caixaPneumo').hidden = atual > 2;
  $('caixaPostura').hidden = atual < 3;
  $('caixaZonas').hidden = atual !== 4;
  enquadrar(atual);
  atualizar(); prepararRA();
}

/* ------------------------------------------------------------ atualizar */
function atualizar() {
  const dPpl = respirando ? cicloPleural(fase) : 0;
  const pAlv = respirando ? cicloAlveolar(fase) : 0;
  const e = { ...ajuste(), pneumo, palveolar: pAlv, deslocaPleural: dPpl };
  const pn = estadoDoPneumotorax(pneumo);

  /* o corpo pende: 90 graus = em pé = giro zero */
  root.rotation.z = g2r(90 - grau);

  aplicarFresta(pn.ppl);
  const forcas = { pulmao: pneumo === 'nenhum' ? 5 : 1.6, caixa: pneumo === 'nenhum' ? 5 : 3.6 };
  aplicarTorax(1, { pulmao: VOLUMES.crf, caixa: VOLUMES.crf, forcas });
  aplicarTorax(2, { pulmao: pn.pulmao, caixa: pn.caixa, desvio: pn.desvio });
  /* o ciclo desloca a pleural inteira: a física entrega o gradiente parado e
     o app soma a respiração por cima, que é o que a musculatura faz */
  const plEm = f => transpulmonar(f, grau, e) - dPpl;
  aplicarAlveolos(f => volumeRelativo(plEm(f)));
  aplicarZonas(f => zonaEm(f, grau, e), f => fluxoEm(f, grau, e));

  $('posturaLabel').textContent = grau < 20 ? `Decúbito · ${grau.toFixed(0)}°`
    : grau > 70 ? `Ortostatismo · ${grau.toFixed(0)}°` : `Inclinado · ${grau.toFixed(0)}°`;
  $('pplLabel').textContent = pneumo === 'nenhum'
    ? `Pleural ${pressaoPleural(.5, grau).toFixed(1)} cmH₂O`
    : `Pleural ${pn.ppl >= 0 ? '+' : ''}${pn.ppl.toFixed(0)} cmH₂O`;
  $('grauValor').textContent = `${grau.toFixed(0)}°`;
  if (!arrastando) $('grauCursor').value = grau.toFixed(0);

  $('lApice').textContent = pressaoPleural(1, grau, e).toFixed(1);
  $('lBase').textContent = pressaoPleural(0, grau, e).toFixed(1);
  /* Deitado a queda ao longo do eixo ápice-base é ZERO, e o gradiente não
     sumiu: mudou para o esterno-dorso, que esta bancada não desenha. Dizer
     isso em palavras é honesto; enfiar os dois eixos num número só foi o erro
     que a conta denunciou ao dar 35 cm a 45 graus. */
  const eixo = eixoDependente(grau);
  $('lAltura').textContent = alturaEfetiva(grau) < 3
    ? `0 cm — o gradiente passou ${eixo.nome} (${eixo.atravessando.toFixed(0)} cm)`
    : `${alturaEfetiva(grau).toFixed(0)} cm, ${eixo.nome}`;
  const vA = ventilacaoRelativa(1, grau, e), vB = ventilacaoRelativa(0, grau, e);
  $('lVent').textContent = vA > 0 ? `${(vB / vA).toFixed(2)}×` : '—';
  $('lVolApice').textContent = (volumeRelativo(plEm(1)) * 100).toFixed(0);
  $('lVolBase').textContent = (volumeRelativo(plEm(0)) * 100).toFixed(0);
  $('lFase').textContent = !respirando ? 'parado no fim da expiração'
    : (pAlv < -.05 ? 'inspirando' : pAlv > .05 ? 'expirando' : 'sem fluxo');
  $('lPalv').textContent = pAlv.toFixed(2);

  const perfil = perfilDeZonas(grau, e, 9);
  $('lZonas').textContent = perfil.map(l => l.zona).join('');
  const fA = fluxoEm(1, grau, e), fB = fluxoEm(0, grau, e);
  $('lFluxo').textContent = fA > .01 ? `${(fB / fA).toFixed(2)}×` : 'ápice sem fluxo';
  $('notaCenario').textContent = comCenario(cenario).nota;

  $('lPulmao').textContent = (pn.pulmao * 100).toFixed(0);
  $('lCaixa').textContent = (pn.caixa * 100).toFixed(0);
  $('lRetorno').textContent = (pn.retorno * 100).toFixed(0);
  $('lRetorno').parentElement.classList.toggle('alerta', pn.retorno < .8);

  desenharCurva();
}

/* ------------------------------------------------------------ a curva */
const gr = $('curvaPerfil'), ctx = gr.getContext('2d');
function desenharCurva() {
  const e = { ...ajuste(), pneumo }, W = gr.width, H = gr.height;
  ctx.clearRect(0, 0, W, H);
  const m = { e: 30, d: 12, t: 12, b: 24 };
  const py = f => H - m.b - f * (H - m.t - m.b);
  const px = v => m.e + clamp(v, 0, 1) * (W - m.e - m.d);
  ctx.strokeStyle = '#1f6b33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(m.e, m.t); ctx.lineTo(m.e, H - m.b); ctx.stroke();
  ctx.fillStyle = '#7f9a80'; ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.fillText('ápice', 2, py(1) + 8); ctx.fillText('base', 2, py(0) - 2);

  /* duas curvas no mesmo eixo: ventilação e perfusão. É o encontro delas que
     é a relação V/Q, e vê-las juntas é o ponto do nível 05. */
  const vs = [], fs = [];
  for (let i = 0; i <= 40; i++) {
    const f = i / 40;
    vs.push([f, ventilacaoRelativa(f, grau, e)]);
    fs.push([f, fluxoEm(f, grau, e)]);
  }
  const maxV = Math.max(.0001, ...vs.map(x => x[1]));
  const maxF = Math.max(.0001, ...fs.map(x => x[1]));
  for (const [dados, maxi, tinta, nome] of [[vs, maxV, '#5fd177', 'ventilação'], [fs, maxF, '#c8363e', 'perfusão']]) {
    ctx.beginPath();
    dados.forEach(([f, v], i) => { const x = px(v / maxi), y = py(f); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.strokeStyle = tinta; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.fillStyle = tinta;
    ctx.fillText(nome, nome === 'ventilação' ? m.e + 4 : W - m.d - 52, H - 8);
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
renderer.setAnimationLoop(agora => {
  /* teto no delta: aba em segundo plano volta com um salto de segundos e a
     respiração daria um pulo */
  const dt = Math.min(.12, (agora - anterior) / 1000); anterior = agora;
  const antes = grau;
  grau += (grauAlvo - grau) * SUAVE;
  if (respirando) fase = (fase + dt / 4) % 1;      // 4 s por ciclo, 15 por minuto
  if (respirando || Math.abs(grau - antes) > .02) atualizar();
  controls.update();
  renderer.render(scene, camera);
});

/* ------------------------------------------------------------ controles */
let arrastando = false;
$('grauCursor').addEventListener('pointerdown', () => { arrastando = true; });
addEventListener('pointerup', () => { arrastando = false; });
$('grauCursor').addEventListener('input', ev => definirGrau(parseFloat(ev.currentTarget.value), true));
$('deitar').onclick = () => definirGrau(0, true);
$('levantar').onclick = () => definirGrau(90, true);

$('pneumos').addEventListener('click', ev => {
  const b = ev.target.closest('button[data-pneumo]');
  if (!b) return;
  pneumo = b.dataset.pneumo;
  $('pneumos').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  atualizar(); prepararRA();
});
$('cenarios').innerHTML = CENARIOS.map(c =>
  `<button type="button" data-cenario="${c.id}"${c.id === 'repouso' ? ' class="on"' : ''}>${c.nome}</button>`).join('');
$('cenarios').addEventListener('click', ev => {
  const b = ev.target.closest('button[data-cenario]');
  if (!b) return;
  cenario = b.dataset.cenario;
  $('cenarios').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  atualizar(); prepararRA();
});

$('respirar').onclick = ev => {
  respirando = !respirando;
  ev.currentTarget.textContent = respirando ? 'Parar' : 'Respirar';
  if (!respirando) fase = 0;                       // volta ao fim da expiração
  atualizar(); desenhar();
};

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
      clone.visible = true;
      /* a RA leva a postura e o estado que estão na tela: é uma foto */
      clone.rotation.z = g2r(90 - grau);
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
const grauPedido = parseFloat(busca.get('grau'));
const pn = busca.get('pneumo');
const ce = busca.get('cenario');
if (pn && ['nenhum', 'aberto', 'hipertensivo'].includes(pn)) {
  pneumo = pn;
  $('pneumos').querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.pneumo === pn));
}
if (ce && CENARIOS.some(c => c.id === ce)) {
  cenario = ce;
  $('cenarios').querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.cenario === ce));
}
if (Number.isFinite(grauPedido)) { grau = grauAlvo = clamp(grauPedido, 0, 90); }
const faseP = parseFloat(busca.get('fase'));
if (Number.isFinite(faseP)) { fase = clamp(faseP, 0, 1); respirando = true; }
irAoNivel(Number.isFinite(nivel) ? nivel - 1 : 0);
/* desenha uma vez à mão: o laço pode estar congelado no painel do navegador */
desenhar();
