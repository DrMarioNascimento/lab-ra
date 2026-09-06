/* A película de carga — potencial de membrana, Unidade I
   ---------------------------------------------------------------------------
   A bancada existe para desfazer um erro de GEOMETRIA, não de vocabulário. O
   aluno lê "−70 mV" e imagina a célula inteira carregada. Então a página faz
   três coisas, e nesta ordem:

   1. MOSTRA O VOLUME NEUTRO. No nível 02 o citoplasma aparece cheio dos dois
      sinais em número igual. Não há como sair de lá achando que a célula é
      uma pilha.
   2. DÁ O NÚMERO. A conta de `contagem()` é feita ao vivo com o diâmetro e o
      potencial que estiverem na tela: quantos íons de fato saíram de posição,
      e que fração do potássio da célula isso representa. Um em ~160 mil, para
      uma célula de 50 µm a −70 mV. É esse número que o aluno leva.
   3. LIGA O NÚMERO À FORMA. O mesmo controle de permeabilidade que move a
      equação de Goldman move os íons no 3D. Se os dois pudessem discordar, a
      página ensinaria duas coisas; como são o mesmo estado, ensina uma.

   O nível 05 é o brinde honesto: quando a permeabilidade ao sódio dispara, a
   película VIRA — e a inversão viaja, ponto a ponto, acendendo a vizinha.

   Sobre RA: o GLB do nível é exportado ANTES do clique, e o clique chama
   activateAR() de forma síncrona. O Safari do iPhone exige que o gesto do
   usuário chegue inteiro até o Quick Look; qualquer await no meio mata a
   câmera. Foi assim que se resolveu no músculo, e vale igual aqui.        */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { corParaRA } from '../cores-para-ra.js';
import { criar } from './modelos.js';

const $ = id => document.getElementById(id);
const canvas = $('scene'), stage = $('stage');
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ renderer / cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
/* Materiais sem verniz e com oclusão de contato tiram luz do quadro — é o que
   se quer, e é o que tirou a cara de drágea do músculo. A exposição devolve a
   leitura sem devolver o brilho, porque quem dava o brilho era o clearcoat. */
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0e0a10, .026);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .70;

const camera = new THREE.PerspectiveCamera(36, 1, .01, 200);
camera.position.set(0, 1.4, 8.4);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;
controls.minDistance = 1.6; controls.maxDistance = 18;

scene.add(new THREE.HemisphereLight(0xffe8d6, 0x160f1a, 1.05));
const key = new THREE.DirectionalLight(0xfff2e2, 2.8); key.position.set(4.5, 7, 5.5); scene.add(key);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -.0012; key.shadow.normalBias = .02; key.shadow.radius = 2.4;
const sombra = key.shadow.camera;
sombra.near = 1; sombra.far = 30; sombra.left = -8; sombra.right = 8; sombra.top = 8; sombra.bottom = -8;
sombra.updateProjectionMatrix();
/* Object3D.position é somente-leitura (defineProperty com `value`), e módulo
   roda em modo estrito: atribuir a ela lança. Tem de ser .set(). */
const fill = new THREE.DirectionalLight(0xffc9c0, .70); fill.position.set(-5, 2, 3.5); scene.add(fill);
/* contraluz fraca de propósito: é ela que separa a peça do fundo, mas em
   força alta tingia o tecido de neon e a membrana virava anúncio */
const rim = new THREE.DirectionalLight(0x8fa8ff, 1.15); rim.position.set(-3.5, 2.5, -6); scene.add(rim);

const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.7, .14, 72),
  new THREE.MeshStandardMaterial({ color: 0x0c0810, roughness: .9, metalness: .04 }));
pedestal.position.y = -2.05; pedestal.receiveShadow = true; scene.add(pedestal);
const root = new THREE.Group(); scene.add(root);

/* ------------------------------------------------------------ texturas */
function canvasTex(w, h, draw, { repeatX = 1, repeatY = 1 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX, repeatY);
  t.anisotropy = 8; return t;
}
const { modelos, aplicarPotencial, aplicarOnda, uReg } = criar(canvasTex);

modelos.forEach((m, i) => {
  m.visible = i === 0; root.add(m);
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  /* medido com tudo na identidade: um Box3 tirado no meio do mergulho
     enquadraria o quadro errado */
  m.updateWorldMatrix(true, true);
  /* ── O QUE ENQUADRA É O RAIO DO GIRO, MEDIDO NOS VÉRTICES ────────────────
     Duas coisas erradas foram tentadas antes desta:

     1. A METADE DA CAIXA. A peça gira em torno da ORIGEM e a caixa dela não é
        centrada nela — o neurônio vai de −2,8 a +3,4 no eixo do axônio. Meia
        volta depois, a ponta saía pela beira do quadro.
     2. OS CANTOS DA CAIXA. Melhor, mas pessimista: o canto combina o maior x
        com o maior z, e quase nunca existe peça alguma ali. O axônio ganhava
        uma margem grande de nada.

     O que vale é a maior distância de um VÉRTICE à origem, no plano do giro —
     porque é exatamente esse o círculo que a peça varre. Custa uma passada
     única na partida, com tudo na identidade: um Box3 tirado no meio do
     mergulho enquadraria o quadro errado. */
  let rh = 0, hv = 0;
  const pt = new THREE.Vector3();
  m.traverse(o => {
    if (!o.isMesh || o.userData.foraDoQuadro) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pt.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      rh = Math.max(rh, Math.hypot(pt.x, pt.z));
      hv = Math.max(hv, Math.abs(pt.y));
    }
  });
  m.userData.quadro = { rh, hv };
});

/* ------------------------------------------------------------ a física
   Concentrações de mamífero, 37 °C. O fator 61,5 mV já traz RT/F em log10.
   O cloreto entra com permeabilidade fixa porque na maioria das células ele
   se distribui passivamente: ele acompanha o potencial, não o define. */
const CONC = { K: { i: 140, o: 4 }, Na: { i: 12, o: 145 }, Cl: { i: 6, o: 116 } };
const RTF = 61.5, P_CL = .45;
const nernst = (z, dentro, fora) => RTF / z * Math.log10(fora / dentro);
/* Goldman: o potencial é a média das forças de cada íon PESADA PELA
   PERMEABILIDADE. É por isso que um só controle — quanto o sódio pode passar
   em relação ao potássio — leva do repouso ao pico do potencial de ação. */
function goldman(alfa, Ko) {
  const num = Ko + alfa * CONC.Na.o + P_CL * CONC.Cl.i;
  const den = CONC.K.i + alfa * CONC.Na.i + P_CL * CONC.Cl.o;
  return RTF * Math.log10(num / den);
}
/* ── A CONTA QUE DESFAZ O ERRO ────────────────────────────────────────────
   Capacitância de membrana ~1 µF/cm², que é constante universal de bicamada.
   Q = C·V dá a carga separada; dividida por Faraday, os mols de íon que de
   fato mudaram de lado. Comparados ao potássio que a célula inteira contém,
   sai a fração — e ela é ridícula. Feita ao vivo de propósito: número
   chumbado no texto é número que ninguém confere. */
const F = 96485, CM = 1e-6;
function contagem(dUm, EmMv) {
  const d = dUm * 1e-4;                       // cm
  const area = Math.PI * d * d;               // cm² (esfera)
  const q = CM * area * Math.abs(EmMv) * 1e-3;// C
  const molSep = q / F;
  const litros = (Math.PI / 6) * d * d * d / 1000;
  const molK = CONC.K.i * 1e-3 * litros;
  return { molSep, molK, razao: molSep > 0 ? molK / molSep : Infinity, area, litros };
}
const br = (n, d = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ------------------------------------------------------------ potencial de ação */
const REPOUSO = -70, PICO = 38, FUNDO = -82, LIMIAR = -55;
/* A MESMA COR DO MARCADOR NO 3D, em modelos.js (M.marcador). É ela que
   amarra o gráfico à figura sem legenda: cor igual nos dois lugares é a
   mesma coisa, e mudar uma sem a outra desfaz o elo.

   Era laranja e virou violeta porque laranja é a cor que a PELÍCULA usa para
   o lado positivo — o marcador sumia dentro da parede que devia marcar.
   Violeta está fora do eixo âmbar↔azul do filme e é a cor que o valor de Vm
   já usa no alto da cena: medida com cor própria, separada do fenômeno. */
const COR_MARCA = '#c9a3ff';
const facil = t => t * t * (3 - 2 * t);
/* Forma por trechos, com os tempos do axônio de mamífero: subida em 0,4 ms,
   repolarização em 0,9, e a pós-hiperpolarização arrastando por 3. Não é
   Hodgkin-Huxley resolvido — é a forma medida, que é o que o aluno precisa
   reconhecer no osciloscópio. */
function vmNoTempo(ms) {
  if (ms <= 0 || ms > 5.2) return REPOUSO;
  if (ms < .4) return REPOUSO + (PICO - REPOUSO) * facil(ms / .4);
  if (ms < 1.3) return PICO + (FUNDO - PICO) * facil((ms - .4) / .9);
  return FUNDO + (REPOUSO - FUNDO) * facil((ms - 1.3) / 3.9);
}
const AXONIO_MM = 6;                     // comprimento real do segmento desenhado
const VEL_AXONIO = 2;                    // m/s — axônio amielínico
const LENTIDAO = 260;                    // câmera lenta: 1 s de tela ≈ 3,8 ms

/* ------------------------------------------------------------ estado e textos */
const dados = [
  ['Escala celular', '01 · Neurônio', 'A pergunta', 'Onde está a carga?',
   'Duas pontas medem: a micropipeta dentro do soma e o eletrodo de referência no banho. O número que elas dão é uma DIFERENÇA entre dois lados de uma parede — não uma propriedade do corpo da célula. Aprofunde e veja o que há dentro.',
   'soma,dendritos,espinhas dendríticas,cone de implantação,axônio,micropipeta'],
  ['Escala celular · em corte', '02 · Interior', 'O volume', 'O citoplasma é neutro',
   'A célula aberta ao meio. Do centro à parede — núcleo incluído — cargas positivas e negativas em número igual: o volume não se carrega em lugar nenhum. A única fila desemparelhada é a que FORRA a parede, por dentro e por fora. A espessura da membrana está muito aumentada aqui; no nível seguinte ela volta à proporção.',
   'citoplasma,K⁺,Na⁺,Cl⁻,ânions orgânicos,eletroneutralidade'],
  ['Escala nanométrica', '03 · Película', 'A separação', 'Uma pele colada na membrana',
   'Aqui o desenho está em proporção, e por isso leva régua: a bicamada mede 5 nm de superfície a superfície, e a película cabe dentro de cerca de 1 nm de cada face. Numa célula de 50 µm isso é uma casca cinquenta mil vezes mais fina que o corpo — e envolve menos de um milésimo de por cento dos íons. Mexa na permeabilidade e veja a película encher, esvaziar e inverter.',
   'bicamada · 5 nm,película · 1 nm,cabeças polares,caudas,duas faces em oposição'],
  ['Escala molecular', '04 · Travessias', 'Quatro maneiras de atravessar', 'Bicamada, canal, transportador e bomba',
   '1 · Difusão simples: o O₂ entra e o CO₂ sai pelo próprio lipídio, sem proteína nenhuma — só molécula pequena e apolar consegue, e por isso este posto não tem peça alguma. 2 · Canal: poro de água com filtro que escolhe o íon; o de vazamento fica sempre aberto, o de Na⁺ só abre quando a voltagem manda. 3 · Difusão facilitada: o transportador liga a glicose e muda de forma, uma comporta de cada vez — daí ser lento e saturar. 4 · Transporte ativo: só a bomba trabalha contra o gradiente, e é a única que paga ATP. As três primeiras não custam nada: quem empurra é o gradiente.',
   'difusão simples,canal iônico,difusão facilitada,transporte ativo,ATP'],
  ['Escala do axônio', '05 · A onda', 'A película que vira', 'Potencial de ação',
   'Um axônio amielínico, aberto ao meio para que as duas faces apareçam ao mesmo tempo. Onde o sódio entra a película inverte: por um instante o lado de dentro fica positivo, e as duas fileiras de sinais trocam de lugar. A inversão não anda sozinha — ela acende a vizinha, e é essa sequência que viaja. Atrás dela a membrana repolariza e passa um momento ainda mais negativa que o repouso.',
   'axoplasma,película interna,película externa,inversão,repolarização'],
];
const E = {
  scale: $('scaleLabel'), step: $('stepLabel'), em: $('emLabel'),
  eye: $('infoEyebrow'), title: $('infoTitle'), text: $('infoText'), tags: $('microtags'),
  prev: $('prev'), next: $('next'), ar: $('launchAR'), status: $('raStatus'), viewer: $('arViewer'),
  rot: $('rotulos'), labels: $('labels'),
  gBox: $('goldmanBox'), alfa: $('alfa'), ko: $('ko'), diam: $('diam'),
  gVal: $('goldmanValor'), gConta: $('goldmanConta'), gCanvas: $('curvaGoldman'),
  dBox: $('disparoBox'), dCanvas: $('curvaDisparo'), dVal: $('disparoValor'), inst: $('instante'),
};

let atual = 0, transicao = null, girar = true, tempo = 0;
let alfa = .03, Ko = 4, diam = 50, Em = goldman(alfa, Ko);
let disparo = { t: -1, tocando: false };

function resetCam() {
  const q = modelos[atual].userData.quadro || { rh: 3, hv: 1 };
  const fovV = camera.fov * Math.PI / 180;
  const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
  /* Pela ESFERA não serve: uma peça deitada, seis vezes mais comprida que
     alta, tem esfera do tamanho do comprimento — e enquadrá-la assim deixa o
     axônio ocupando um quarto da altura, com vazio em cima e embaixo. */
  const dist = Math.max(q.rh / Math.tan(fovH / 2), q.hv / Math.tan(fovV / 2)) * 1.02 + q.rh * .16;
  controls.target.set(0, 0, 0);
  /* A ALTURA DA CÂMERA É POR NÍVEL, e não é enfeite. Nos níveis da membrana o
     assunto são as DUAS faces: de cima, a folha de baixo fica escondida sob a
     de cima e metade da lição some. Então ali a câmera desce quase à linha do
     horizonte; no neurônio e no axônio ela sobe, porque lá o que conta é a
     forma inteira. */
  /* A ALTURA DA CÂMERA É POR NÍVEL, e não é enfeite. Nos dois níveis da
     membrana plana o assunto são as DUAS faces: de cima, a de baixo fica
     escondida sob a de cima e metade da lição some, então ali a câmera desce
     quase à linha do horizonte. No neurônio, na célula em corte e no axônio
     ela sobe, porque lá o que conta é a forma inteira. */
  const ELEV = [.19, .21, .048, .052, .44];
  camera.position.set(0, dist * ELEV[atual], dist);
  controls.minDistance = q.rh * .45; controls.maxDistance = dist * 2.8;
  controls.update();
}

/* ------------------------------------------------------------ navegação */
function aplicarTextos(n) {
  const d = dados[n];
  E.scale.textContent = d[0]; E.step.textContent = d[1];
  E.eye.textContent = d[2]; E.title.textContent = d[3]; E.text.textContent = d[4];
  E.tags.innerHTML = d[5].split(',').map(x => `<span>${x}</span>`).join('');
  E.prev.disabled = n === 0; E.next.disabled = n === 4;
  /* o rótulo do botão diz a verdade do que vai acontecer: de 04 para 05 não
     há mergulho — a câmera SOBE de escala, e prometer "aprofundar" ali seria
     mentira de interface */
  E.next.textContent = n === 4 ? 'A onda ✓' : n === 3 ? 'Ver o axônio →' : 'Aprofundar →';
  document.querySelectorAll('.step').forEach((b, i) => b.classList.toggle('active', i === n));
  E.gBox.hidden = n === 4; E.dBox.hidden = n !== 4;
  E.labels.innerHTML = '';
  if (n === 4) { disparo = { t: 0, tocando: true }; textosDisparo(); }
}
function setStep(n, viaMergulho = false) {
  n = Math.max(0, Math.min(4, n)); if (n === atual) return;
  const velho = modelos[atual], novo = modelos[n];
  /* mergulho só na descida de escala, e só de um degrau */
  const mergulho = viaMergulho && n === atual + 1 && n <= 3;
  novo.visible = true; novo.scale.setScalar(mergulho ? .18 : .7);
  if (mergulho) novo.position.copy(velho.userData.foco || V()); else novo.position.set(0, 0, 0);
  transicao = { velho, novo, t: 0, mergulho, foco: (velho.userData.foco || V()).clone() };
  atual = n; aplicarTextos(n); prepararRA();
}
/* Abrir direto num nível, sem transição: serve à aula que já sabe onde quer
   parar (…/potencial-membrana/?nivel=3) e serve à conferência do desenho,
   que precisa do quadro parado. */
function irDireto(n) {
  n = Math.max(0, Math.min(4, n));
  modelos.forEach((m, i) => { m.visible = i === n; m.scale.setScalar(1); m.position.set(0, 0, 0); });
  atual = n; transicao = null; aplicarTextos(n); resetCam(); prepararRA();
}
document.querySelectorAll('.step').forEach((b, i) => b.onclick = () => setStep(i));
E.prev.onclick = () => setStep(atual - 1); E.next.onclick = () => setStep(atual + 1, true);
$('resetView').onclick = resetCam;

/* Guardar também o depthWrite: as películas e o miolo nascem com transparência
   própria, e restaurar todo mundo como `true` depois do primeiro mergulho
   fazia a bicamada tapar o que ela devia mostrar — e só na segunda visita. */
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

/* ------------------------------------------------------------ painel de Goldman */
function desenharGoldman() {
  const c = E.gCanvas, g = c.getContext('2d'), w = c.width, h = c.height;
  g.clearRect(0, 0, w, h);
  /* mesma divisão do traçado ao lado: números à esquerda, nomes à direita */
  const ESQ = 46;
  const px = l => ESQ + (l + 2) / 3.5 * (w - ESQ - 12), py = v => h - 24 - (v + 100) / 180 * (h - 40);
  g.strokeStyle = 'rgba(245,197,24,.22)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(ESQ, py(-100)); g.lineTo(w - 10, py(-100)); g.moveTo(ESQ, py(-100)); g.lineTo(ESQ, 8); g.stroke();
  g.font = '600 10px "IBM Plex Mono", monospace'; g.textAlign = 'right'; g.textBaseline = 'middle';
  /* sem o −100: ele cai exatamente na linha de base do quadro e encostava no
     primeiro número do eixo de baixo. Três marcas bastam para ler a altura. */
  for (const v of [50, 0, -50]) {
    const y = py(v);
    g.strokeStyle = 'rgba(245,197,24,.35)';
    g.beginPath(); g.moveTo(ESQ - 4, y); g.lineTo(ESQ, y); g.stroke();
    g.fillStyle = '#b0c4ac'; g.fillText(v > 0 ? '+' + v : String(v), ESQ - 7, y);
  }
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  const eK = nernst(1, CONC.K.i, Ko), eNa = nernst(1, CONC.Na.i, CONC.Na.o);
  g.setLineDash([4, 4]);
  [[eK, '#8fb6ff', 'E'], [eNa, '#ffb066', 'E']].forEach(([v, cor]) => {
    g.strokeStyle = cor; g.beginPath(); g.moveTo(ESQ, py(v)); g.lineTo(w - 10, py(v)); g.stroke();
  });
  g.setLineDash([]);
  g.strokeStyle = '#ffe066'; g.lineWidth = 2; g.beginPath();
  for (let l = -2; l <= 1.5; l += .02) {
    const x = px(l), y = py(goldman(Math.pow(10, l), Ko));
    l === -2 ? g.moveTo(x, y) : g.lineTo(x, y);
  }
  g.stroke();
  g.fillStyle = COR_MARCA; g.beginPath(); g.arc(px(Math.log10(alfa)), py(Em), 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#b0c4ac'; g.font = '600 10px "IBM Plex Mono", monospace';
  g.fillText('permeabilidade ao Na⁺ ÷ ao K⁺', ESQ + 6, h - 3);
  g.fillText('E(K)', w - 44, py(eK) - 4); g.fillText('E(Na)', w - 50, py(eNa) + 11);
  g.save(); g.translate(10, h / 2 + 22); g.rotate(-Math.PI / 2); g.fillText('Em (mV)', 0, 0); g.restore();
  ['0,01', '0,1', '1', '10'].forEach((t, i) => g.fillText(t, px(-2 + i) - 6, h - 16));
}
function onGoldman() {
  alfa = Math.pow(10, parseFloat(E.alfa.value));
  Ko = parseFloat(E.ko.value); diam = parseFloat(E.diam.value);
  Em = goldman(alfa, Ko);
  aplicarPotencial(Em);
  const eK = nernst(1, CONC.K.i, Ko), eNa = nernst(1, CONC.Na.i, CONC.Na.o);
  E.gVal.textContent = `Em ${Em >= 0 ? '+' : ''}${Em.toFixed(1)} mV · E(K⁺) ${eK.toFixed(0)} · E(Na⁺) +${eNa.toFixed(0)} · P(Na)/P(K) ${alfa < 1 ? alfa.toFixed(3) : alfa.toFixed(1)} · [K⁺]fora ${Ko.toFixed(1)} mM`;
  const q = contagem(diam, Em);
  const exp = Math.floor(Math.log10(q.molSep));
  E.gConta.innerHTML = `<b>Célula de ${diam} µm a ${Em >= 0 ? '+' : ''}${Em.toFixed(0)} mV:</b> ${(q.molSep / Math.pow(10, exp)).toFixed(1)}×10<sup>${exp}</sup> mol de carga separada — <b>1 íon em cada ${br(q.razao)}</b> do K⁺ que a célula contém (${(100 / q.razao).toFixed(5).replace('.', ',')} %). O volume não muda: só a fila da parede.`;
  E.em.textContent = `Em ${Em >= 0 ? '+' : ''}${Em.toFixed(0)} mV`;
  desenharGoldman(); prepararRA();
}
[E.alfa, E.ko, E.diam].forEach(el => el.addEventListener('input', onGoldman));
$('repouso').onclick = () => { E.alfa.value = Math.log10(.03); E.ko.value = 4; onGoldman(); };
$('pico').onclick = () => { E.alfa.value = Math.log10(20); E.ko.value = 4; onGoldman(); };

/* ------------------------------------------------------------ painel do disparo
   A CÂMERA LENTA É DECLARADA, e por um motivo: a onda atravessa os 6 mm em
   3 ms e a subida do potencial dura 0,4 ms. Em tempo real não há o que ver —
   e uma bancada que precisa desacelerar o mundo tem de dizer quanto. O fator
   aparece escrito ao lado do número, e o controle deixa o professor abrir
   mais. Número escondido seria truque; número na tela é a aula. */
/* DOBRADA EM 06/09/2026. Em 700x a travessia levava 2,1 s e a subida do
   potencial, 0,28 s — e ninguem le 0,28 s. Em 1400x a subida passa a 0,56 s,
   que e assistivel, e a repolarizacao, que e o trecho lento, ganha tempo de
   ser vista. O laco inteiro fica em ~12 s; quem quiser precisao tem o cursor
   de instante ao lado. */
const LENTO = 1400;
const travessiaMs = () => (AXONIO_MM / 1000) / VEL_AXONIO * 1000;
/* cada ponto dispara quando a onda chega nele, e ela chega na velocidade do
   axônio: é essa proporcionalidade simples que faz a inversão ANDAR */
const tDisparo = u => u * travessiaMs();
const vmDe = u => vmNoTempo(disparo.t - tDisparo(u));
/* Vem de modelos.js, onde o eletrodo é DESENHADO. Antes era um .78 escrito
   aqui e a geometria não sabia dele: o gráfico prometia um ponto de registro
   que a cena não mostrava. Uma fonte só para os dois. */
const U_REG = uReg;
const multLento = () => parseFloat($('lento').value);
const janelaMs = () => travessiaMs() + 5.4;

function desenharDisparo() {
  const c = E.dCanvas, g = c.getContext('2d'), w = c.width, h = c.height;
  g.clearRect(0, 0, w, h);
  const t0 = -.3, t1 = 5.4;
  /* ── A ESCALA EM mV ───────────────────────────────────────────────────
     O eixo vertical não tinha número nenhum: dizia "Vm (mV)" e mostrava duas
     linhas nomeadas. Quem olhasse não sabia se o pico era 20 ou 60 — e um
     traçado de potencial de ação sem escala é desenho, não medida.

     São DUAS coisas, e ficam em bordas opostas de propósito:
     • à ESQUERDA a escala de verdade, em passos redondos de 40 mV, que
       serve para ler qualquer altura da curva;
     • à DIREITA os dois marcos que o aluno reconhece pelo nome, limiar e
       repouso. Eles distam 15 mV, o que aqui são doze pixels: no mesmo lado
       dos números virariam um amontoado. */
  const ESQ = 46;
  const px = t => ESQ + (t - t0) / (t1 - t0) * (w - ESQ - 12), py = v => h - 24 - (v + 95) / 150 * (h - 40);
  g.strokeStyle = 'rgba(245,197,24,.22)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(ESQ, py(-95)); g.lineTo(w - 10, py(-95)); g.moveTo(ESQ, py(-95)); g.lineTo(ESQ, 8); g.stroke();
  g.font = '600 10px "IBM Plex Mono", monospace'; g.textAlign = 'right'; g.textBaseline = 'middle';
  for (const v of [40, 0, -40, -80]) {
    const y = py(v);
    g.strokeStyle = 'rgba(245,197,24,.35)';
    g.beginPath(); g.moveTo(ESQ - 4, y); g.lineTo(ESQ, y); g.stroke();
    g.fillStyle = '#b0c4ac'; g.fillText(v > 0 ? '+' + v : String(v), ESQ - 7, y);
  }
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.setLineDash([4, 4]);
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(ESQ, py(0)); g.lineTo(w - 10, py(0)); g.stroke();
  g.strokeStyle = '#ff9c5a'; g.beginPath(); g.moveTo(ESQ, py(LIMIAR)); g.lineTo(w - 10, py(LIMIAR)); g.stroke();
  g.strokeStyle = 'rgba(95,209,119,.45)'; g.beginPath(); g.moveTo(ESQ, py(REPOUSO)); g.lineTo(w - 10, py(REPOUSO)); g.stroke();
  g.setLineDash([]);
  g.strokeStyle = '#ffe066'; g.lineWidth = 2; g.beginPath();
  for (let t = t0; t <= t1; t += .02) { const x = px(t), y = py(vmNoTempo(t)); t === t0 ? g.moveTo(x, y) : g.lineTo(x, y); }
  g.stroke();
  const tl = clamp(disparo.t - tDisparo(U_REG), t0, t1);
  g.fillStyle = COR_MARCA; g.beginPath(); g.arc(px(tl), py(vmNoTempo(tl)), 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#b0c4ac'; g.font = '600 10px "IBM Plex Mono", monospace';
  g.fillText('tempo no ponto de registro (ms)', ESQ + 6, h - 3);
  /* os marcos nomeados ficam afastados um do outro: a 15 mV de distância eles
     se encostariam se saíssem na mesma altura dos seus traços */
  g.fillStyle = '#ff9c5a'; g.fillText('limiar', w - 48, py(LIMIAR) - 4);
  g.fillStyle = '#5fd177'; g.fillText('repouso', w - 54, py(REPOUSO) + 12);
  g.fillStyle = '#b0c4ac';
  g.save(); g.translate(10, h / 2 + 22); g.rotate(-Math.PI / 2); g.fillText('Vm (mV)', 0, 0); g.restore();
  /* seis pixels entre o número e o título, com fonte de dez, é sobreposição:
     os dois se encavalavam desde a primeira versão */
  ['0', '1', '2', '3', '4', '5'].forEach((t, i) => g.fillText(t, px(i) - 3, h - 16));
}
function textosDisparo() {
  const T = travessiaMs();
  E.dVal.innerHTML = `<b>Axônio amielínico:</b> ${VEL_AXONIO} m/s · ${AXONIO_MM} mm em ${T.toFixed(1)} ms`
    + ` · avança ponto a ponto · câmera lenta ${br(LENTO * multLento())}×`;
}
/* ── O INSTANTE É UM CONTROLE, NÃO UM SUBPRODUTO DA ANIMAÇÃO ──────────────
   Duas razões, e a segunda é a que obriga:

   1. NA AULA. "Pare no pico" é a frase mais dita diante de um traçado de
      potencial de ação. Sem cursor, o professor depende de acertar o botão
      de pausa no meio de um milissegundo simulado.
   2. NA CONFERÊNCIA. O Browser pane roda a aba como oculta: o
      requestAnimationFrame desenha o primeiro quadro e PARA. Uma página cujo
      estado interessante só se alcança por animação é uma página que não se
      confere aqui — e foi exatamente assim que esta bancada pareceu, por
      meia hora, ter uma onda quebrada que nunca existiu. Vale a regra do
      repositório: todo estado que só se chega andando precisa de um jeito de
      se chegar parado. `?nivel=5&ms=1.9` abre no instante pedido.

   Por isso o cursor força a repintura E o desenho na hora, sem esperar
   quadro nenhum. */
function irAoInstante(ms, tocar = disparo.tocando) {
  disparo.t = clamp(ms, 0, janelaMs());
  disparo.tocando = tocar;
  E.inst.value = disparo.t;
  aplicarOnda(vmDe); desenharDisparo();
  const v = vmDe(U_REG);
  E.em.textContent = `Vm ${v >= 0 ? '+' : ''}${v.toFixed(0)} mV`;
  renderer.render(scene, camera);
  /* O modelo da RA é uma FOTO: nem o USDZ do iPhone nem o caminho do Android
     recebem daqui animação nenhuma. Então a foto tem de ser do instante que a
     pessoa escolheu — parado, o nível 05 vira uma série de instantes, que é o
     mais perto de movimento que a RA alcança. Só com a onda parada: tocando,
     isto reexportaria a cada quadro. O atraso de 350 ms de `prepararRA` já
     absorve o arrastar do cursor. */
  if (!disparo.tocando) prepararRA();
}
function ajustarJanela() {
  E.inst.max = janelaMs().toFixed(2);
  E.inst.step = (janelaMs() / 400).toFixed(4);
}
$('disparar').onclick = () => irAoInstante(0, true);
$('pausar').onclick = e => {
  disparo.tocando = !disparo.tocando;
  e.currentTarget.textContent = disparo.tocando ? 'Pausar' : 'Seguir';
  /* parar é o que fixa o instante que vai ao ambiente */
  if (!disparo.tocando) prepararRA();
  else E.status.textContent = 'A onda está andando. Pause para levar um instante ao ambiente.';
};
E.inst.addEventListener('input', e => {
  $('pausar').textContent = 'Seguir';
  irAoInstante(parseFloat(e.currentTarget.value), false);
});
$('lento').addEventListener('input', textosDisparo);

/* ------------------------------------------------------------ rótulos ancorados */
const ancoras = {
  0: () => [['soma', V(-.05, .80, .28)], ['dendritos', V(-1.90, 1.20, .10)], ['cone de implantação', V(.52, .38, .22)],
    ['axônio', V(2.30, -.44, .16)], ['bainha de mielina', V(1.18, .34, .18)], ['nó de Ranvier', V(1.52, -.36, .18)],
    ['terminais', V(3.58, .38, .10)], ['micropipeta', V(-1.20, 1.50, .92)], ['eletrodo de referência', V(2.10, -1.75, 1.18)]],
  1: () => [['citoplasma', V(-.20, .50, .80)], ['núcleo', V(-.42, 1.00, -.10)],
    ['membrana em corte', V(1.30, -.95, 1.30)], ['película interna', V(1.31, .18, 1.14)],
    ['película externa', V(1.55, -.72, 1.29)], ['extracelular', V(-1.35, 1.95, 1.55)],
    ['toco de dendrito', V(-2.00, .94, -.70)]],
  2: () => [['bicamada · 5 nm', V(-3.12, 0, .35)], ['película · 1 nm', V(-3.12, .56, -.35)],
    ['cabeças polares', V(-2.10, .48, .55)], ['caudas hidrofóbicas', V(-2.10, .02, .55)],
    ['película interna', V(1.20, .55, .55)], ['película externa', V(1.20, -.55, .55)],
    ['volume neutro', V(-.30, 1.55, .45)]],
  /* NUMERADOS E CURTOS. Escritos por extenso, nove rótulos viravam uma parede
     de texto por cima justamente das peças que se quer comparar. O número
     amarra cada um à ordem do cartão ao lado, que é onde o nome inteiro cabe
     sem tapar nada. */
  3: () => [['1 · sem proteína', V(-2.52, 1.55, -.42)], ['O₂ entra · CO₂ sai', V(-2.52, -1.35, -.42)],
    ['2 · canal de K⁺', V(-1.24, 1.45, .34)], ['filtro', V(-1.24, .24, .58)],
    ['2 · canal de Na⁺ (voltagem)', V(.04, -1.50, -.40)],
    ['3 · transportador', V(1.34, 1.62, .36)], ['glicose', V(1.34, -1.38, .36)],
    ['4 · bomba', V(2.62, 1.85, -.30)], ['ATP', V(3.02, 1.38, -.10)]],
  4: () => [['axoplasma', V(-.30, -.08, .28)],
    ['película interna · sinais', V(-1.55, -.62, -.30)], ['película externa · sinais', V(1.45, .74, .52)],
    ['ponto de registro', modelos[4].userData.pontoRegistro.clone().add(V(.10, -.22, .16))]],
};
let mostrarRotulos = true;
E.rot.onclick = () => { mostrarRotulos = !mostrarRotulos; E.rot.classList.toggle('on', mostrarRotulos); E.labels.innerHTML = ''; };
function atualizarRotulos() {
  if (!mostrarRotulos || transicao) { if (E.labels.childElementCount) E.labels.innerHTML = ''; return; }
  const lista = ancoras[atual]();
  if (E.labels.childElementCount !== lista.length) E.labels.innerHTML = lista.map(([t]) => `<span class="lbl">${t}</span>`).join('');
  const w = stage.clientWidth, h = stage.clientHeight, obj = modelos[atual];
  /* A PEÇA GIRA, e com ela os pontos de ancoragem: em certos ângulos seis
     rótulos caem na mesma faixa de altura e viram um borrão dourado. Ajeitar
     as âncoras não resolve — a colisão é do ângulo, não do lugar. Então quem
     chega depois desce até caber, na ordem de cima para baixo, e o que estiver
     atrás da peça já sai antes por opacidade. */
  const postos = [];
  lista.map(([, p]) => p.clone().applyMatrix4(obj.matrixWorld).project(camera))
    .map((v, i) => ({ i, v, x: (v.x * .5 + .5) * w, y: (-v.y * .5 + .5) * h }))
    .sort((a, b) => a.y - b.y)
    .forEach(q => {
      const el = E.labels.children[q.i]; if (!el) return;
      if (q.v.z >= 1) { el.style.opacity = 0; return; }
      let y = q.y, voltas = 0;
      while (voltas++ < 12 && postos.some(o => Math.abs(o.y - y) < 19 && Math.abs(o.x - q.x) < 132)) y += 19;
      postos.push({ x: q.x, y });
      /* e preso dentro do palco: um rótulo ancorado na beirada direita saía
         cortado pela metade, e rótulo cortado é pior que rótulo ausente */
      const larguraRotulo = el.offsetWidth || 90;
      const x = clamp(q.x, 8, Math.max(8, w - larguraRotulo - 8));
      el.style.opacity = 1;
      el.style.transform = `translate(${x}px, ${clamp(y, 6, h - 14)}px)`;
    });
}

/* ------------------------------------------------------------ laço */
/* O devicePixelRatio muda quando a janela vai para outro monitor ou o
   navegador dá zoom. Fixá-lo só na partida deixava a cena rasterizada abaixo
   da tela. */
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
  requestAnimationFrame(loop);
  const dt = Math.min(.05, clock.getDelta()); tempo += dt;
  if (girar && !transicao) root.rotation.y += dt * .07;
  if (transicao) {
    transicao.t = Math.min(1, transicao.t + dt * (transicao.mergulho ? 1.1 : 2.4));
    const e = 1 - Math.pow(1 - transicao.t, 3);
    if (transicao.mergulho) {
      transicao.velho.scale.setScalar(1 + e * 2.2);
      transicao.velho.position.copy(transicao.foco).multiplyScalar(-e * 2.2);
      setOpacidade(transicao.velho, Math.max(0, 1 - e * 1.6));
      transicao.novo.scale.setScalar(.18 + e * .82);
      transicao.novo.position.copy(transicao.foco).multiplyScalar(1 - e);
    } else {
      transicao.velho.scale.setScalar(1 - e * .3); setOpacidade(transicao.velho, 1 - e);
      transicao.novo.scale.setScalar(.7 + e * .3);
    }
    if (transicao.t >= 1) {
      restaurar(transicao.velho); transicao.velho.visible = false;
      transicao.velho.scale.setScalar(1); transicao.velho.position.set(0, 0, 0);
      transicao.novo.scale.setScalar(1); transicao.novo.position.set(0, 0, 0);
      transicao = null; resetCam();
    }
  }
  /* a coreografia das portas anda com a MESMA permeabilidade da equação */
  if (atual === 3) modelos[3].userData.animar(tempo, { abertura: clamp((Math.log10(alfa) + 1.2) / 1.9, 0, 1) });
  if (atual === 4) {
    if (disparo.tocando) {
      disparo.t += dt * 1000 / (LENTO * multLento());
      if (disparo.t > janelaMs()) disparo.t = 0;
      E.inst.value = disparo.t;
    }
    aplicarOnda(vmDe);
    desenharDisparo();
    const v = vmDe(U_REG);
    E.em.textContent = `Vm ${v >= 0 ? '+' : ''}${v.toFixed(0)} mV`;
  }
  controls.update(); renderer.render(scene, camera); atualizarRotulos();
})();

/* ------------------------------------------------------------ RA */
const TAM_REAL = [.62, .56, .52, .60, 1.05]; // metros, maior dimensão no ambiente
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
let arUrl = null, prepId = 0, timer = null;
function prepararRA() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const id = ++prepId; E.ar.disabled = true; E.status.textContent = 'Preparando o modelo para a câmera…';
    try {
      const clone = modelos[atual].clone(true);
      clone.visible = true; clone.position.set(0, 0, 0); clone.scale.setScalar(1); clone.rotation.set(0, 0, 0);
      const box = new THREE.Box3().setFromObject(clone), tam = box.getSize(V());
      clone.scale.setScalar(TAM_REAL[atual] / Math.max(tam.x, tam.y, tam.z));
      clone.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(clone);
      clone.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
      /* a cor por vértice não atravessa o USDZ: sem assar, o iPhone recebe
         branco no lugar do tecido, da membrana e dos íons */
      corParaRA(clone);
      const wrap = new THREE.Group(); wrap.add(clone);
      const buf = await new GLTFExporter().parseAsync(wrap, { binary: true, onlyVisible: true });
      if (id !== prepId) return;
      if (arUrl) URL.revokeObjectURL(arUrl);
      arUrl = URL.createObjectURL(new Blob([buf], { type: 'model/gltf-binary' }));
      E.viewer.src = arUrl;
    } catch (err) { console.error(err); E.status.textContent = 'Não foi possível preparar o modelo para RA.'; }
  }, 350);
}
E.viewer.addEventListener('load', () => {
  if (E.viewer.canActivateAR) {
    E.ar.disabled = false;
    E.status.textContent = `Pronto. Tamanho no ambiente: ${TAM_REAL[atual].toFixed(2)} m. ${COMO_ABRIR}`;
  } else {
    E.ar.disabled = true;
    E.status.textContent = 'Este navegador não abre RA. Use o Safari no iPhone/iPad ou o Chrome no Android.';
  }
});
E.viewer.addEventListener('error', () => { E.status.textContent = 'O modelo não carregou no visualizador de RA.'; });
/* sem nenhum await antes do activateAR — regra do Safari, e foi ela que
   impedia a câmera de abrir no músculo */
E.ar.addEventListener('click', () => {
  try { E.viewer.activateAR(); }
  catch (err) { console.error(err); E.status.textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; }
});

/* ------------------------------------------------------------ partida */
E.alfa.value = Math.log10(.03);
onGoldman();
ajustarJanela(); textosDisparo(); desenharDisparo(); aplicarOnda(vmDe);
const busca = new URLSearchParams(location.search);
const pedido = parseInt(busca.get('nivel'), 10);
if (Number.isFinite(pedido) && pedido >= 1 && pedido <= 5) irDireto(pedido - 1); else prepararRA();
const ms = parseFloat(busca.get('ms'));
if (Number.isFinite(ms)) { $('pausar').textContent = 'Seguir'; irAoInstante(ms, false); }
