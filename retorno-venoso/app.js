/* ============================================================================
   TESTE 08 — RETORNO VENOSO E ORTOSTATISMO
   Física, sensor, painel e o caminho da RA. A geometria mora em modelos.js.

   O QUE FAZ ESTA BANCADA DIFERENTE DAS OUTRAS: aqui o SENSOR é a fisiologia.
   O aparelho deitado é decúbito; o aparelho em pé é ortostatismo. Não há
   botão "postura" — há o telefone na mão do aluno.

   TRÊS DECISÕES QUE SUSTENTAM ISSO:

   1. A INCLINAÇÃO SAI SÓ DE BETA E GAMMA. cos(theta) = cos(beta)*cos(gamma) é
      a componente vertical da normal da tela. Não entra `alpha`, que é rumo de
      bússola — o sinal que castiga o iPhone, exige calibração e oscila. Aqui
      só a GRAVIDADE decide, e gravidade é firme nos dois sistemas. Foi a sorte
      deste tema, e é o motivo de esta bancada ser possível.

   2. O CORPO GIRA NO PLANO DA TELA, e isso não é enfeite. A componente da
      gravidade ao longo do corpo é exatamente sen(inclinação) — a mesma
      grandeza que move a coluna hidrostática. Desenho e conta são a mesma
      coisa, e por isso o desenho não pode mentir.

   3. O CURSOR FICA NA TELA DESDE O PRIMEIRO SEGUNDO. Quem está no computador,
      quem negou a permissão e quem ainda não tocou em "Permitir" precisam
      poder mexer. Prender a bancada ao sensor foi o erro que a Janela do Norte
      já cometeu uma vez.

   E A REGRA DA CASA, que vale em todas: todo estado a que só se chega andando
   precisa de um jeito de se chegar PARADO. `?nivel=` e `?grau=` abrem a
   bancada onde se quiser, porque o painel do navegador congela o laço de
   animação e sem elas nada aqui seria conferível.
   ========================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prepararParaRA } from '../cores-para-ra.js';
import { criar, CM, CORPO, PIH, MMHG_POR_CM, pressaoVenosa, corDaPressao } from './modelos.js';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ renderer / cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090c10, .024);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .72;

const camera = new THREE.PerspectiveCamera(34, 1, .01, 200);
camera.position.set(0, 0, 8);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;
controls.minDistance = 1.2; controls.maxDistance = 20;

scene.add(new THREE.HemisphereLight(0xdcecff, 0x140f18, 1.0));
const key = new THREE.DirectionalLight(0xfff4e8, 2.7); key.position.set(4.2, 6.5, 5.2); scene.add(key);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -.0012; key.shadow.normalBias = .02; key.shadow.radius = 2.4;
const sc = key.shadow.camera;
sc.near = 1; sc.far = 30; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8;
sc.updateProjectionMatrix();
const fill = new THREE.DirectionalLight(0xffd0c4, .62); fill.position.set(-5, 1.6, 3.4); scene.add(fill);
const rim = new THREE.DirectionalLight(0x8fb8ff, 1.05); rim.position.set(-3.2, 2.2, -6); scene.add(rim);

/* O corpo pende dentro deste grupo, e é ele que a inclinação gira. Girar a
   CÂMERA em vez do corpo daria a mesma imagem e a conta errada: quem tem
   postura é o corpo, não quem olha. */
const root = new THREE.Group(); scene.add(root);

const { modelos, aplicarPostura, aplicarBomba, degrausDaValvula } = criar();
modelos.forEach((m, i) => {
  m.visible = i === 0; root.add(m);
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
});

/* ── ENQUADRAMENTO: o raio do giro medido nos vértices ──────────────────────
   Mesma medida das bancadas 06 e 07, e pela mesma razão: a peça gira em torno
   da origem e a caixa dela não é centrada nela. Aqui há um agravante — o corpo
   TAMBÉM gira no plano da tela com a inclinação, então o que precisa caber é a
   maior distância de um vértice à origem em QUALQUER giro, isto é, o raio da
   esfera. Enquadrar pela altura deixaria o corpo deitado sair pelos lados. */
const raio = modelos.map(m => {
  m.updateWorldMatrix(true, true);
  let r = 0; const p = new THREE.Vector3();
  m.traverse(o => {
    if (!o.isMesh || o.userData.foraDoQuadro) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      r = Math.max(r, p.length());
    }
  });
  return r;
});
function enquadrar(n) {
  const d = raio[n] / Math.tan(camera.fov * Math.PI / 360) * 1.28;
  camera.position.set(0, 0, d);
  controls.target.set(0, 0, 0);
  controls.minDistance = d * .35; controls.maxDistance = d * 2.6;
  controls.update();
}

/* ------------------------------------------------------------ a inclinação */
const g2r = d => d * Math.PI / 180;

/* De beta e gamma para 0..90. De bruços passa de 90 e voltaria a "deitado":
   espelhar é o certo, porque de bruços TAMBÉM é decúbito. */
export function inclinacaoDe(beta, gamma) {
  const c = Math.cos(g2r(beta)) * Math.cos(g2r(gamma));
  const t = Math.acos(clamp(c, -1, 1)) * 180 / Math.PI;
  return t > 90 ? 180 - t : t;
}

let grauAlvo = 0, grau = 0, sensorVivo = false, eventos = 0;
/* Tremor de mão é o estado normal de quem segura um telefone: sem suavizar, o
   número dança e a peça treme. Média exponencial, que aqui basta — inclinação
   não vira em 360 como rumo, então não precisa de média circular. */
const SUAVE = .16;

function definirGrau(g, imediato = false) {
  grauAlvo = clamp(g, 0, 90);
  if (imediato) { grau = grauAlvo; aplicarTudo(); desenhar(); }
}

/* ------------------------------------------------------------ os níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'Onde a gravidade aperta?',
    texto: 'Deitado, a coluna de sangue não tem altura: do tornozelo ao pescoço a pressão venosa é quase a mesma. Em pé, cada centímetro abaixo do diafragma acrescenta 0,78 mmHg — e o tornozelo chega a noventa. Incline o aparelho e veja a árvore mudar de calibre e de cor.',
    tags: ['0,78 mmHg/cm', 'ponto indiferente no diafragma'] },
  { olho: 'Nível 02', titulo: 'Meio litro sai de circulação',
    texto: 'A veia é um saco complacente, não um cano: recebe muito volume com pouca pressão. Ao levantar, algumas centenas de mililitros descem para as pernas e deixam de voltar ao coração — e é essa a conta que decide se alguém desmaia na formatura.',
    tags: ['safena e profunda', 'perfurantes'] },
  { olho: 'Nível 03', titulo: 'Nenhuma segura a coluna inteira',
    texto: 'A válvula não é tampa. É bicúspide, se enche por trás e encosta as bordas — e cada uma sustenta só o segmento até a de cima. É a fila que parte a coluna em degraus de poucos centímetros; sozinha, nenhuma delas daria conta.',
    tags: ['bicúspide', 'degrau por segmento'] },
  { olho: 'Nível 04', titulo: 'O músculo que esvazia a veia',
    texto: 'A panturrilha é a segunda bomba do corpo. Ao contrair, espreme a veia profunda entre as barrigas: a válvula de baixo fecha, a de cima abre, e o segmento se esvazia para cima. É o mesmo músculo da bancada 06, agora com outra função.',
    tags: ['bomba muscular', 'fluxo de mão única'] },
  { olho: 'Nível 05', titulo: 'Parado em pé é pior que andar',
    texto: 'De pé e imóvel, a coluna é inteira e o tornozelo fica em noventa. Bastam alguns passos para a bomba partir essa coluna e derrubar a pressão para perto de vinte e cinco. Quem desmaia em posição de sentido não desmaia por estar em pé: desmaia por estar parado.',
    tags: ['pressão venosa ambulatorial', 'retorno ao coração'] },
];
const ROTULO = ['O corpo', 'A perna', 'A válvula', 'A bomba', 'O ciclo'];
const TAM_REAL = [1.60, .82, .34, .40, 1.60];   // metros, maior dimensão na RA

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
  $('caixaBomba').hidden = atual < 3;
  $('caixaValvula').hidden = atual !== 2;
  enquadrar(atual);
  aplicarTudo(); prepararRA(); desenhar();
}

/* ------------------------------------------------------------ a bomba */
let bombaAndando = false, faseBomba = 0, ultimaAmostra = 0;
const historico = [];                     // pressão do tornozelo no tempo
const JANELA_S = 12;

/* ------------------------------------------------------------ aplicar */
let ultimo = {};
function aplicarTudo() {
  /* o corpo pende: 90 graus de inclinação = corpo em pé = giro zero */
  root.rotation.z = g2r(90 - grau);
  const p = aplicarPostura(grau);
  ultimo = p;

  const b = aplicarBomba(faseBomba, grau);
  const tornozelo = bombaAndando ? b.bombeando : p.tornozelo;

  $('posturaLabel').textContent =
    grau < 20 ? `Decúbito · ${grau.toFixed(0)}°`
    : grau > 70 ? `Ortostatismo · ${grau.toFixed(0)}°`
    : `Inclinado · ${grau.toFixed(0)}°`;
  $('pressaoLabel').textContent = `Tornozelo ${tornozelo.toFixed(0)} mmHg`;
  $('grauValor').textContent = `${grau.toFixed(0)}°`;
  if (!arrastando) $('grauCursor').value = grau.toFixed(0);

  $('lTornozelo').textContent = tornozelo.toFixed(0);
  $('lCoxa').textContent = p.coxa.toFixed(0);
  $('lCoracao').textContent = p.coracao.toFixed(0);
  /* veia é tubo COLABÁVEL: não sustenta pressão negativa, ela fecha. Escrever
     o número negativo seria ensinar errado. */
  $('lJugular').textContent = p.jugularColabada ? 'colabada' : p.jugular.toFixed(0);
  $('lEmpocado').textContent = Math.max(0, p.empocado).toFixed(0);

  if (atual === 2) escreverDegraus();
}

function escreverDegraus() {
  const d = degrausDaValvula(grau);
  $('degraus').innerHTML = d.passos.map((s, i) =>
    `<li><b>${i + 1}ª</b> de ${s.de} a ${s.ate} cm <span>${s.mmHg.toFixed(1)} mmHg</span></li>`).join('');
  $('colunaTotal').textContent = d.coluna.toFixed(0);
}

/* ------------------------------------------------------------ o gráfico */
const gr = $('curvaColuna'), ctx = gr.getContext('2d');
function desenharCurva() {
  const W = gr.width, H = gr.height;
  ctx.clearRect(0, 0, W, H);
  const m = { e: 40, d: 10, t: 12, b: 26 };
  const px = mmHg => m.e + (clamp(mmHg, -20, 110) + 20) / 130 * (W - m.e - m.d);
  const py = h => H - m.b - (h / 175) * (H - m.t - m.b);

  ctx.strokeStyle = '#1f6b33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px(0), m.t); ctx.lineTo(px(0), H - m.b); ctx.stroke();
  ctx.fillStyle = '#7f9a80'; ctx.font = '10px "IBM Plex Mono", monospace';
  for (const v of [0, 40, 80]) { ctx.fillText(String(v), px(v) - 5, H - 10); }
  for (const [h, r] of [[CORPO.tornozelo, 'tornozelo'], [PIH, 'diafragma'], [CORPO.olhos, 'cabeça']]) {
    ctx.fillText(r, 2, py(h) + 3);
  }

  /* a linha da pressão contra a altura: em pé é uma reta inclinada, deitado é
     uma vertical. O cruzamento com o eixo é o ponto indiferente, e ele fica
     PARADO enquanto tudo gira — é a coisa mais bonita de ver aqui. */
  ctx.beginPath();
  for (let h = 0; h <= 175; h += 2) {
    const p = pressaoVenosa(h, grau, { base: h > PIH ? 6 : 10 });
    const x = px(Math.max(0, p));
    h === 0 ? ctx.moveTo(x, py(h)) : ctx.lineTo(x, py(h));
  }
  ctx.strokeStyle = '#f5c518'; ctx.lineWidth = 2.2; ctx.stroke();

  ctx.beginPath(); ctx.arc(px(pressaoVenosa(PIH, grau)), py(PIH), 3.4, 0, 7);
  ctx.fillStyle = '#5fd177'; ctx.fill();
}

const gt = $('curvaTempo'), ctt = gt && gt.getContext('2d');
function desenharTempo() {
  if (!ctt) return;
  const W = gt.width, H = gt.height;
  ctt.clearRect(0, 0, W, H);
  const m = { e: 34, d: 8, t: 10, b: 22 };
  const py = v => H - m.b - clamp(v, 0, 100) / 100 * (H - m.t - m.b);
  ctt.strokeStyle = '#1f6b33'; ctt.lineWidth = 1;
  ctt.beginPath(); ctt.moveTo(m.e, m.t); ctt.lineTo(m.e, H - m.b); ctt.lineTo(W - m.d, H - m.b); ctt.stroke();
  ctt.fillStyle = '#7f9a80'; ctt.font = '10px "IBM Plex Mono", monospace';
  for (const v of [0, 50, 100]) ctt.fillText(String(v), 6, py(v) + 3);
  if (!historico.length) return;
  ctt.beginPath();
  historico.forEach((v, i) => {
    const x = m.e + (i / Math.max(1, historico.length - 1)) * (W - m.e - m.d);
    i ? ctt.lineTo(x, py(v)) : ctt.moveTo(x, py(v));
  });
  ctt.strokeStyle = '#ff9d2e'; ctt.lineWidth = 2; ctt.stroke();
}

function desenhar() { desenharCurva(); desenharTempo(); renderer.render(scene, camera); }

/* ------------------------------------------------------------ tamanho */
function ajustar() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  desenhar();
}
addEventListener('resize', ajustar);

/* ------------------------------------------------------------ laço */
let anterior = performance.now();
renderer.setAnimationLoop(() => {
  const agora = performance.now();
  /* teto no delta: aba em segundo plano volta com um salto de segundos e a
     bomba daria um pulo. Mesma trava da Janela do Norte. */
  const dt = Math.min(.12, (agora - anterior) / 1000); anterior = agora;

  const antes = grau;
  grau += (grauAlvo - grau) * SUAVE;
  if (bombaAndando) faseBomba = (faseBomba + dt / 1.15) % 1;
  if (Math.abs(grau - antes) > .02 || bombaAndando) aplicarTudo();

  if (bombaAndando && agora - ultimaAmostra > 120) {
    ultimaAmostra = agora;
    const b = aplicarBomba(faseBomba, grau);
    historico.push(b.bombeando);
    while (historico.length > JANELA_S * 8) historico.shift();
    desenharTempo();
  }
  controls.update();
  desenharCurva();
  renderer.render(scene, camera);
});

/* ------------------------------------------------------------ o sensor */
function ligarSensor() {
  addEventListener('deviceorientation', e => {
    if (e.beta === null || e.gamma === null) return;
    eventos++; sensorVivo = true;
    $('sensorEstado').textContent = 'sensor ligado';
    $('sensorEstado').classList.add('vivo');
    definirGrau(inclinacaoDe(e.beta, e.gamma));
  });
  /* A espera só COMEÇA A CORRER AGORA, quando já há o que esperar. Contada
     desde o carregamento, ela dispararia enquanto a pessoa lê a permissão. */
  setTimeout(() => {
    if (!eventos) $('sensorEstado').textContent = 'sem sensor — use o cursor';
  }, 3500);
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
} else {
  ligarSensor();
}

/* ------------------------------------------------------------ controles */
let arrastando = false;
$('grauCursor').addEventListener('pointerdown', () => { arrastando = true; });
addEventListener('pointerup', () => { arrastando = false; });
$('grauCursor').addEventListener('input', e => definirGrau(parseFloat(e.currentTarget.value), true));
$('deitar').onclick = () => definirGrau(0, true);
$('levantar').onclick = () => definirGrau(90, true);

$('andar').onclick = e => {
  bombaAndando = !bombaAndando;
  e.currentTarget.textContent = bombaAndando ? 'Parar' : 'Andar';
  if (!bombaAndando) { historico.length = 0; desenharTempo(); }
};
$('passo').onclick = () => {
  /* um passo só, para quem quiser ver a coreografia parada */
  faseBomba = (faseBomba + .5) % 1; aplicarTudo(); desenhar();
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
      /* a RA leva a POSTURA que está na tela: é uma foto, e a foto tem de ser
         do estado que a pessoa escolheu */
      clone.rotation.z = g2r(90 - grau);
      clone.updateMatrixWorld(true);
      const caixa = new THREE.Box3().setFromObject(clone), tam = caixa.getSize(new THREE.Vector3());
      clone.scale.setScalar(TAM_REAL[atual] / Math.max(tam.x, tam.y, tam.z));
      clone.updateMatrixWorld(true);
      const c2 = new THREE.Box3().setFromObject(clone);
      clone.position.set(-(c2.min.x + c2.max.x) / 2, -c2.min.y, -(c2.min.z + c2.max.z) / 2);
      /* nem a cor por vértice nem a dupla face atravessam o USDZ */
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
/* O Quick Look abre no modo Objeto: a câmera só entra depois de um toque em
   "AR", no alto da folha. Prometer a câmera direto já custou um diagnóstico
   inteiro na bancada 07. iPad recente se apresenta como Mac, daí maxTouchPoints. */
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
/* sem nenhum await antes do activateAR — regra do Safari */
$('launchAR').addEventListener('click', () => {
  try { $('arViewer').activateAR(); }
  catch (err) { $('raStatus').textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; }
});

/* ------------------------------------------------------------ entradas paradas */
ajustar();
const busca = new URLSearchParams(location.search);
const nivel = parseInt(busca.get('nivel'), 10);
const grauPedido = parseFloat(busca.get('grau'));
irAoNivel(Number.isFinite(nivel) ? nivel - 1 : 0);
if (Number.isFinite(grauPedido)) definirGrau(grauPedido, true);
/* desenha uma vez à mão: o laço pode estar congelado, e sem isto a conferência
   fotografa uma tela em branco e acusa um defeito que não existe */
desenhar();
