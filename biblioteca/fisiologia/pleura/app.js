import {carregarToraxAprovado,controlarCamadas} from './torax-aprovado.js?v=simulador-20261009';
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
import { prepararParaRA } from '../cores-para-ra.js?v=tutor-ra-cores-20261002';
import { criar } from './modelos.js?v=simulador-20261009';
import { clonarVisual } from './ra.js';
import { carregarCoracao } from './anatomia.js?v=encaixes-20261002';
import {
  VOLUMES, alturaEfetiva, pressaoPleural, transpulmonar,
  zonaEm, fluxoEm, perfilDeZonas, estadoDoPneumotorax, eixoDependente,
  retornoVenosoRelativo,
  comCenario, CENARIOS, pressoesEm, CMH2O_EM_MMHG, PPL_MEDIA_FRC,
} from './fisica.js?v=encaixes-20261002';

import {ESTADOS,comEstado,estadoDoPerfil,volumeRegional,ventilacaoDoPerfil,duracaoEstado,contracaoCardiaca,indicesCVF,CAPACIDADE_MODELO} from './estados.js?v=encaixes-20261002';
import {desenharGrafico} from './grafico.js?v=encaixes-20261002';

const $ = id => document.getElementById(id);
const valorPressao = (valor, casas=1) => valor.toFixed(casas).replace(/^-0(?:\.0+)?$/, v=>v.slice(1));
function mostrarPressao(id, valor, unidade='cmH₂O', casas=1) {
  $(id).textContent=valorPressao(valor,casas);
  const equivalente=unidade==='cmH₂O'?valor*CMH2O_EM_MMHG:valor/CMH2O_EM_MMHG;
  $(`${id}Equiv`).textContent=`${valorPressao(equivalente,casas)} ${unidade==='cmH₂O'?'mmHg':'cmH₂O'}`;
}
const canvas = $('scene'), stage = $('stage');
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------ cena */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .88;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .50;

const camera = new THREE.PerspectiveCamera(34, 1, .1, 900);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .06;

scene.add(new THREE.HemisphereLight(0xe9f0ff, 0x161018, .75));
const key = new THREE.DirectionalLight(0xfff4e8, 1.65); key.position.set(30, 46, 40); scene.add(key);
const fill = new THREE.DirectionalLight(0xffd0c4, .6); fill.position.set(-34, 12, 26); scene.add(fill);
const rim = new THREE.DirectionalLight(0x8fb8ff, 1.05); rim.position.set(-20, 16, -44); scene.add(rim);

/* O corpo pende deste grupo, e é ele que a inclinação gira — girar a câmera
   daria a mesma imagem e a conta errada: quem tem postura é o corpo. */
const root = new THREE.Group(); scene.add(root);
try {
  await Promise.all([carregarCoracao(),carregarToraxAprovado()]);
  $('modeloStatus').hidden=true;
} catch(err) {
  $('modeloStatus').textContent='O modelo anatômico não carregou. Recarregue a página para tentar novamente.';
  console.error(err);
}
const { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas, aplicarCoracao } = criar();
modelos.forEach((m, i) => { m.visible = i === 0; root.add(m); });

const camadaIds=['camadaVisceral','camadaParietal','atenuarPulmoes','atenuarOssos'];
function camadas(){controlarCamadas(modelos,{visceral:$('camadaVisceral').checked,parietal:$('camadaParietal').checked,pulmoes:$('atenuarPulmoes').checked,ossos:$('atenuarOssos').checked});}
camadaIds.forEach(id=>$(id).addEventListener('change',()=>{camadas();desenhar();prepararRA();}));camadas();
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
  const folga=modelos[n].userData.aprovado?.95:n===3?1.08:FOLGA;
  const d = raio[n] * folga / Math.tan(camera.fov * Math.PI / 360) * 1.1;
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
    $('sensorEstado').textContent = 'Sensor de inclinação ativo';
    $('sensorEstado').classList.add('vivo');
    definirGrau(inclinacaoDe(e.beta, e.gamma));
  });
  /* a espera só começa a correr agora, quando já há o que esperar */
  setTimeout(() => { if (!eventos) $('sensorEstado').textContent = 'Sensor indisponível · use o controle de inclinação'; }, 3500);
}
if (typeof DeviceOrientationEvent !== 'undefined'
    && typeof DeviceOrientationEvent.requestPermission === 'function') {
  $('permitir').hidden = false;
  $('permitir').onclick = async () => {
    try {
      const r = await DeviceOrientationEvent.requestPermission();
      if (r === 'granted') { $('permitir').hidden = true; ligarSensor(); }
      else $('sensorEstado').textContent = 'Sensor não autorizado · use o controle de inclinação';
    } catch (err) { $('sensorEstado').textContent = 'Não foi possível ativar o sensor de inclinação'; }
  };
} else { ligarSensor(); }

/* ------------------------------------------------------------ estado */
let pneumo = 'nenhum', cenario = 'repouso';
/* fase 0 é o fim da expiração; o cenário abre parado nesse ponto. */
let fase = 0, respirando = false, velocidade = 1;
let estadoRapido='repouso',tempoCardiaco=0,modoGrafico='perfil';
const ajuste = () => comCenario(cenario).ajuste;
const FLUXO_REFERENCIA=Math.max(...CENARIOS.map(c=>fluxoEm(0,0,c.ajuste)));

/* ------------------------------------------------------------ níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'Camadas da parede ao pulmão',
    texto: 'Entre as duas pleuras há um espaço potencial com um filme de líquido e pressão negativa segurando as duas encostadas, como dois vidros molhados que deslizam mas não se separam. Quando ar entra no espaço pleural, as superfícies podem se separar e o pulmão perde expansão.',
    tags: ['poucos mililitros', 'deslizam, não separam'] },
  { olho: 'Nível 02', titulo: 'Equilíbrio elástico do tórax',
    texto: 'O pulmão puxa para dentro, a caixa torácica empurra para fora; no repouso saudável elas se equilibram na CRF, representada por 40% da capacidade total neste modelo. É esse empate que deixa a pressão entre as duas negativa — a pressão pleural não é uma bomba, é o resultado de um cabo de guerra.',
    tags: ['recolhe × abre', 'CRF a 40%'] },
  { olho: 'Nível 03', titulo: 'O pneumotórax',
    texto: 'Quando entra ar, a ligação mecânica entre pulmão e parede se perde. O pulmão direito perde volume, enquanto a parede tende a se expandir. Os volumes de 10% e 60% representam estados ilustrativos de equilíbrio do modelo. No hipertensivo, a pressão pleural pode ficar positiva e comprometer o retorno venoso, causando choque obstrutivo. O desvio do mediastino acompanha a alteração. Na respiração espontânea, a pressão pleural mais negativa favorece o retorno dentro dos limites do modelo.',
    tags: ['pulmão 10% · caixa 60%', 'retorno venoso reduzido · estimativa do modelo'] },
  { olho: 'Nível 04', titulo: 'O ápice é maior e ventila menos',
    texto: 'A pressão pleural não é um número, é um gradiente: −10 cmH₂O (−7,4 mmHg) no ápice, −2,5 cmH₂O (−1,8 mmHg) na base. O alvéolo de cima já está esticado e senta na parte plana da curva; o de baixo senta no joelho, onde a mesma pressão enche muito mais. Ao deitar, os tamanhos ao longo do eixo ápice–base se aproximam; o gradiente passa para o eixo esterno–dorso. Selecione Iniciar e observe: numa respiração a base vai de 22% a 42% do volume e o ápice, de 63% a 73%. A base ganha o dobro sendo menor. O contraste visual dos tamanhos está ampliado para facilitar a leitura; os valores do painel mantêm os volumes calculados.',
    tags: ['−10 no ápice, −2,5 na base', 'contraste de tamanho ampliado'] },
  { olho: 'Nível 05', titulo: 'As zonas de West',
    texto: 'Três pressões disputam o capilar: a arterial, a venosa e a alveolar, que aperta por fora. Em pé, a coluna de sangue faz o ápice receber pouco. No repouso, ao deitar, os pontos do eixo ápice–base ficam em zona 3 neste modelo; o gradiente dorso–ventral continua existindo. É a mesma gravidade do gradiente pleural, agora do lado da perfusão.',
    tags: ['zona 1 não existe em repouso', 'a cachoeira da zona 2'] },
];
const ROTULO = ['Camadas', 'Mecânica', 'Pneumotórax', 'Gradiente', 'Zonas de West'];
const TAM_REAL = [.34, .58, .58, .55, .55];
const CONTEXTO = [
  'Corte da parede costal · camadas ampliadas',
  'Direito: 3 lobos · esquerdo: 2 lobos · costelas opacas',
  'Amarelo: ar no espaço pleural direito · pulmão recolhido',
  'Unidades acinares ampliadas · posição representativa',
  'Cor: zona de West · tamanho: perfusão relativa',
];

let atual = 0;
const ajusteAtivo=()=>atual===4?ajuste():(comEstado(estadoRapido).vascular??{});
const pneumoAtivo=()=>atual===0||atual===2?pneumo:'nenhum';
const estadoAtual=()=>estadoDoPerfil(fase,estadoRapido,{...ajusteAtivo(),pneumo:pneumoAtivo()});
const pontosFresta=[
  [9,5,2.65,'#c7987c'],[6.5,4,2.25,'#d2b56d'],[3.5,3,1.65,'#984757'],
  [0,2,.64,'#8db7ca'],[-2,1,.55,'#a8dcf0'],[-4.5,0,.40,'#d9a1b2'],[-8,-2,.30,'#b77285'],
].map(([x,y,z,cor],i)=>{
  const marcador=document.createElement('span');marcador.textContent=i+1;marcador.style.setProperty('--tecido',cor);
  $('frestaPontos').appendChild(marcador);
  return {marcador,ponto:new THREE.Vector3(x,y,z-.013*x*x-.004*y*y),camada:i<4?'parede':i===4?'filme':i===5?'visceral':'dentro'};
});
function posicionarLegendaFresta() {
  if(atual!==0)return;
  modelos[0].updateWorldMatrix(true,true);
  for(const {marcador,ponto,camada} of pontosFresta) {
    const p=ponto.clone();p.z+=modelos[0].userData[camada].position.z;
    p.applyMatrix4(modelos[0].matrixWorld).project(camera);
    marcador.style.left=`${(p.x+1)*.5*stage.clientWidth}px`;
    marcador.style.top=`${(1-p.y)*.5*stage.clientHeight}px`;
    marcador.hidden=p.z>1||p.z< -1;
  }
}
function posicionarPerfil() {
  if(atual!==3&&atual!==4)return;
  const unidades=atual===3?modelos[3].userData.alveolos:modelos[4].userData.faixas;
  for(const [id,m] of [['perfilApice',unidades.at(-1)],['perfilBase',unidades[0]]]) {
    const marcador=$(id),p=m.getWorldPosition(new THREE.Vector3()).project(camera);
    marcador.style.left=`${clamp((p.x+1)*.5*stage.clientWidth-28,marcador.offsetWidth+10,stage.clientWidth-10)}px`;
    marcador.style.top=`${clamp((1-p.y)*.5*stage.clientHeight,96,stage.clientHeight-66)}px`;
    marcador.hidden=p.z>1||p.z< -1;
  }
}
function irAoNivel(n) {
  atual = clamp(n, 0, 4);
  modelos.forEach((m, i) => { m.visible = i === atual; });
  const t = TEXTOS[atual];
  $('anatomiaLegenda').textContent=CONTEXTO[atual];
  $('infoEyebrow').textContent = t.olho;
  $('infoTitle').textContent = t.titulo;
  $('infoText').textContent = t.texto;
  $('microtags').innerHTML = t.tags.map(x => `<span>${x}</span>`).join('');
  document.querySelectorAll('.step').forEach((b, i) => {
    b.classList.toggle('active', i === atual);
    if (i === atual) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
  $('stepLabel').textContent = `0${atual + 1} · ${ROTULO[atual]}`;
  $('prev').disabled = atual === 0; $('next').disabled = atual === 4;
  $('caixaPneumo').hidden = atual!==0&&atual!==2;
  $('caixaPostura').hidden = false;
  $('cicloControls').hidden = false;
  $('leiturasTorax').hidden = atual !== 1 && atual !== 2;
  $('perfilPontos').hidden = atual!==3&&atual!==4;
  $('caixaZonas').hidden = atual !== 4;
  $('legendaFresta').hidden = atual !== 0;
  $('frestaPontos').hidden = atual !== 0;
  enquadrar(atual);
  atualizar(); prepararRA();
}

/* ------------------------------------------------------------ atualizar */
function atualizar() {
  /* A pausa congela a fase: pressões, geometria e leituras permanecem nela. */
  const e=estadoAtual();
  const pn=estadoDoPneumotorax(e.pneumo);
  const pplAtual=f=>pressaoPleural(f,grau,e);

  /* o corpo pende: 90 graus = em pé = giro zero */
  root.rotation.z = g2r(90 - grau);

  aplicarFresta(pn.ppl);
  const inspirado=estadoDoPerfil(fase,estadoRapido);
  const ganhoVolume=inspirado.volume/.4;
  const ciclo=Math.cbrt(ganhoVolume),inspiracao=e.expansao;
  aplicarTorax(1, { pulmao: VOLUMES.crf, caixa: VOLUMES.crf, ciclo, inspiracao });
  aplicarTorax(2, { pulmao: pn.pulmao, caixa: pn.caixa, desvio: pn.desvio, ciclo, inspiracao });
  if(atual===2)$('anatomiaLegenda').textContent=pneumo==='nenhum'
    ? 'Pleuras em contato · pulmões expandidos'
    : 'Amarelo: ar no espaço pleural direito · pulmão recolhido';
  /* O estado do motor já reúne as pressões do ciclo e da postura. */
  const plEm = f => transpulmonar(f, grau, e);
  aplicarAlveolos(f => volumeRegional(f,grau,e));
  if(atual===3)$('anatomiaLegenda').textContent=grau<20
    ? 'Volume alveolar · deitado: tamanhos semelhantes · escala ampliada'
    : grau>70?'Volume maior no ápice · maior expansão inspiratória na base'
    : 'Volume alveolar · a diferença diminui ao inclinar · escala ampliada';
  aplicarZonas(f => zonaEm(f, grau, e), f => fluxoEm(f, grau, e),FLUXO_REFERENCIA);

  $('posturaLabel').textContent = grau < 20 ? `Decúbito · ${grau.toFixed(0)}°`
    : grau > 70 ? `Ortostatismo · ${grau.toFixed(0)}°` : `Inclinado · ${grau.toFixed(0)}°`;
  const pleural=pplAtual(.5);
  $('pplLabel').firstChild.nodeValue=`Pleural · centro ${valorPressao(pleural)} cmH₂O`;
  $('pplMmHg').textContent=`${valorPressao(pleural*CMH2O_EM_MMHG)} mmHg`;
  $('grauValor').textContent = `${grau.toFixed(0)}°`;
  if (!arrastando) $('grauCursor').value = grau.toFixed(0);

  mostrarPressao('lApice',pplAtual(1));
  mostrarPressao('lBase',pplAtual(0));
  mostrarPressao('lPlApice',plEm(1));mostrarPressao('lPlBase',plEm(0));
  $('lVolumeTotal').textContent=`${(e.volume*CAPACIDADE_MODELO).toFixed(2)} L · ${(e.volume*100).toFixed(0)}% da capacidade total`;
  $('notaExecucao').textContent=estadoRapido==='cvf'?'A velocidade altera apenas a reprodução. Manobra de 8 s · coração: 75 bpm.':`A velocidade altera apenas a reprodução. Referência: ${comEstado(estadoRapido).fr} respirações/min · coração: ${comEstado(estadoRapido).fc} bpm.`;
  /* Deitado a queda ao longo do eixo ápice-base é ZERO, e o gradiente não
     sumiu: mudou para o esterno-dorso, que esta bancada não desenha. Dizer
     isso em palavras é honesto; enfiar os dois eixos num número só foi o erro
     que a conta denunciou ao dar 35 cm a 45 graus. */
  const eixo = eixoDependente(grau);
  $('lAltura').textContent = alturaEfetiva(grau) < 3
    ? `0 cm — o gradiente passou ${eixo.nome} (${eixo.atravessando.toFixed(0)} cm)`
    : `${alturaEfetiva(grau).toFixed(0)} cm, ${eixo.nome}`;
  const vA = ventilacaoDoPerfil(1, grau, estadoRapido, ajusteAtivo()), vB = ventilacaoDoPerfil(0, grau, estadoRapido, ajusteAtivo());
  $('lVent').textContent = vA > 0 ? `${(vB / vA).toFixed(2)}×` : '—';
  $('lVolApice').textContent = (volumeRegional(1,grau,e) * 100).toFixed(0);
  $('lVolBase').textContent = (volumeRegional(0,grau,e) * 100).toFixed(0);
  if(atual===3) {
    $('perfilApice').textContent=`Ápice · ${$('lVolApice').textContent}%`;
    $('perfilBase').textContent=`Base · ${$('lVolBase').textContent}%`;
  } else if(atual===4) {
    $('perfilApice').textContent=`Ápice · zona ${zonaEm(1,grau,e)}`;
    $('perfilBase').textContent=`Base · zona ${zonaEm(0,grau,e)}`;
  }
  const fi=comEstado(estadoRapido).fi;
  const faseNome=fase<fi?'Inspiração':estadoRapido==='cvf'?'Expiração forçada':'Expiração';
  const instante=fase===0?'Fim da expiração':fase===1?'Fim da manobra':Math.abs(fase-fi)<1e-6?'Fim da inspiração':faseNome;
  const estadoCiclo=respirando||fase===0?instante:`Pausado · ${instante.toLowerCase()}`;
  $('lFase').textContent = estadoCiclo;
  if ($('cicloEstado').textContent !== estadoCiclo) $('cicloEstado').textContent = estadoCiclo;
  mostrarPressao('lPalv',e.palveolar,'cmH₂O',2);
  for(const [local,f] of [['Apice',1],['Base',0]]) {
    const p=pressoesEm(f,grau,e);
    mostrarPressao(`lPa${local}`,p.pa,'mmHg');
    mostrarPressao(`lPv${local}`,p.pv,'mmHg');
  }

  const perfil = perfilDeZonas(grau, e, 9);
  $('lZonas').textContent = perfil.map(l => l.zona).join('');
  const fA = fluxoEm(1, grau, e), fB = fluxoEm(0, grau, e);
  $('lFluxo').textContent = fA > .01 ? `${(fB / fA).toFixed(2)}×` : 'ápice sem fluxo';
  $('notaCenario').textContent = comCenario(cenario).nota;

  $('lPulmao').textContent = (pn.pulmao * (e.pneumo==='nenhum'?ganhoVolume:1) * 100).toFixed(0);
  $('lCaixa').textContent = (pn.caixa * (e.pneumo==='nenhum'?ganhoVolume:1) * 100).toFixed(0);
  const retorno=retornoVenosoRelativo(pleural)/retornoVenosoRelativo(PPL_MEDIA_FRC);
  $('lRetorno').textContent = (retorno * 100).toFixed(0);
  $('lRetorno').closest('li').classList.toggle('alerta', retorno < .8);

  aplicarCoracao(atual,contracaoCardiaca(tempoCardiaco,comEstado(estadoRapido).fc));
  desenharCurva();
}

/* ------------------------------------------------------------ a curva */
const gr = $('curvaPerfil'), ctx = gr.getContext('2d');
function desenharCurva() {
  const e=estadoAtual();
  const resumo=desenharGrafico(ctx,{modo:modoGrafico,estado:estadoRapido,fase,grau,ajuste:ajusteAtivo(),e});
  $('notaGrafico').textContent=modoGrafico==='perfil'?'Mesmo eixo ápice–base, escalas separadas. Ventilação: ganho de volume por inspiração. Perfusão: índice relativo em escala fixa; não é V/Q.':estadoRapido==='cvf'?'Volume expirado desde a inspiração máxima, ao longo da expiração forçada. A linha marca o primeiro segundo.':'Volume pulmonar e fluxo em painéis separados, no mesmo tempo. Fluxo positivo: inspiração; negativo: expiração. O ponto marca a fase atual.';
  $('resumoGrafico').textContent=resumo;
  gr.setAttribute('aria-label',resumo);
  $('indicesCVF').hidden=estadoRapido!=='cvf';
  if(estadoRapido==='cvf'){const q=indicesCVF();$('indicesCVF').textContent=`Adulto virtual: CVF ${q.cvf.toFixed(2)} L · VEF₁ ${q.vef1.toFixed(2)} L · VEF₁/CVF ${(q.razao*100).toFixed(0)}%. Valores ilustrativos.`;}
}

/* ------------------------------------------------------------ laço */
function ajustar() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  desenhar();
}
addEventListener('resize', ajustar);
function desenhar() { desenharCurva(); renderer.render(scene, camera); posicionarLegendaFresta(); posicionarPerfil(); }

let anterior = performance.now();
renderer.setAnimationLoop(agora => {
  /* teto no delta: aba em segundo plano volta com um salto de segundos e a
     respiração daria um pulo */
  const dt = Math.min(.12, (agora - anterior) / 1000); anterior = agora;
  const antes = grau;
  grau += (grauAlvo - grau) * SUAVE;
  if (respirando) {
    tempoCardiaco+=dt*velocidade;
    const proxima=fase+dt*velocidade/duracaoEstado(estadoRapido);
    if(proxima>=1&&(!$('loopContinuo').checked||estadoRapido==='cvf')) { fase=estadoRapido==='cvf'?1:0;respirando=false;sincronizarCiclo();atualizar();prepararRA(); }
    else fase=proxima%1;
  }
  if (respirando || Math.abs(grau - antes) > .02) atualizar();
  controls.update();
  renderer.render(scene, camera);
  posicionarLegendaFresta();
  posicionarPerfil();
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
  if(estadoRapido==='cvf')selecionarEstado('repouso');
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
  if(cenario==='exercicio')selecionarEstado('exercicio',false);
  else selecionarEstado('repouso',false);
  $('cenarios').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  atualizar(); prepararRA();
});

$('estadosRapidos').innerHTML=ESTADOS.map(p=>`<button type="button" data-estado="${p.id}" aria-pressed="${p.id==='repouso'}"${p.id==='repouso'?' class="on"':''}>${p.nome}</button>`).join('');
function selecionarEstado(id,limpar=true) {
  estadoRapido=comEstado(id).id;fase=0;tempoCardiaco=0;respirando=false;
  if(limpar){pneumo='nenhum';cenario=comEstado(id).vascular?'exercicio':'repouso';
    $('pneumos').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.pneumo==='nenhum'));
    $('cenarios').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.cenario===cenario));}
  $('estadosRapidos').querySelectorAll('button').forEach(b=>{const on=b.dataset.estado===estadoRapido;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  $('notaEstado').textContent=comEstado(id).nota;
  $('loopContinuo').disabled=estadoRapido==='cvf';
  if(estadoRapido==='cvf')$('loopContinuo').checked=false;
  sincronizarCiclo();sincronizarGrafico();
}
$('estadosRapidos').onclick=ev=>{const b=ev.target.closest('button[data-estado]');if(!b)return;selecionarEstado(b.dataset.estado);modoGrafico=estadoRapido==='repouso'?'perfil':'ciclo';sincronizarGrafico();atualizar();desenhar();prepararRA();};
function sincronizarGrafico(){$('modosGrafico').querySelector('[data-grafico="ciclo"]').textContent=estadoRapido==='cvf'?'CVF · volume-tempo':'Volume e fluxo';$('modosGrafico').querySelectorAll('button').forEach(b=>{const on=b.dataset.grafico===modoGrafico;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});}
$('modosGrafico').onclick=ev=>{const b=ev.target.closest('button[data-grafico]');if(b){modoGrafico=b.dataset.grafico;sincronizarGrafico();desenharCurva();}};

function sincronizarCiclo() {
  $('respirar').disabled = respirando;
  $('pausar').disabled = !respirando;
  $('respirar').textContent = estadoRapido==='cvf'&&fase===1?'Repetir manobra':!respirando&&fase>0?'Retomar':estadoRapido==='cvf'?'Iniciar manobra':'Iniciar';
}
$('respirar').onclick = () => {
  if(fase===1)fase=0;
  respirando = true;
  anterior = performance.now();
  sincronizarCiclo(); atualizar(); desenhar();
};
$('pausar').onclick = () => {
  respirando = false;
  sincronizarCiclo(); atualizar(); desenhar(); prepararRA();
};
$('reiniciar').onclick = () => {
  respirando = false; fase = 0;tempoCardiaco=0;
  sincronizarCiclo(); atualizar(); desenhar(); prepararRA();
};

$('velocidade').addEventListener('input',()=>{velocidade=parseFloat($('velocidade').value);$('velocidadeValor').textContent=`${velocidade.toFixed(2).replace('.',',')}×`;});
$('avancarFase').onclick=()=>{
  respirando=false;
  const fi=comEstado(estadoRapido).fi,proxima=[fi/2,fi,(1+fi)/2,1].find(p=>p>fase+1e-6)??1;
  fase=estadoRapido==='cvf'?proxima:proxima%1;tempoCardiaco=fase*duracaoEstado(estadoRapido);
  sincronizarCiclo();atualizar();desenhar();prepararRA();
};
$('restaurarParametros').onclick=()=>{
  respirando=false;fase=0;velocidade=1;grau=grauAlvo=90;pneumo='nenhum';cenario='repouso';estadoRapido='repouso';tempoCardiaco=0;selecionarEstado('repouso',false);modoGrafico='perfil';sincronizarGrafico();
  $('velocidade').value='1';$('velocidadeValor').textContent='1,00×';$('loopContinuo').checked=true;
  $('pneumos').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.pneumo==='nenhum'));
  $('cenarios').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.cenario==='repouso'));
  sincronizarCiclo();atualizar();enquadrar(atual);desenhar();prepararRA();
};
$('telaCheia').onclick=async()=>{
  try { if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen(); }
  catch { $('modeloStatus').hidden=false;$('modeloStatus').textContent='O navegador não permitiu tela cheia. Use a ampliação por gesto ou zoom.'; }
};
document.addEventListener('fullscreenchange',()=>{$('telaCheia').textContent=document.fullscreenElement?'Reduzir':'Ampliar';ajustar();});
$('prev').onclick = () => irAoNivel(atual - 1);
$('next').onclick = () => irAoNivel(atual + 1);
document.querySelectorAll('.step').forEach(b => b.onclick = () => irAoNivel(+b.dataset.step));
$('resetView').onclick = () => enquadrar(atual);

/* ------------------------------------------------------------ RA */
let arUrl = null, prepId = 0, temporizador = null;
let modoRA = 'simulacao';
const URL_TORAX_COMPLETO = new URL('../assets/torax-completo-lobos-corrigidos.glb?v=20261008-vasos', import.meta.url).href;
const URL_CORACAO_VASOS = new URL('../assets/coracao-e-vasos-foco.glb?v=20261008-foco', import.meta.url).href;
const URL_APROVADO = new URL('../assets/torax-apices-nivelados.glb?v=apices-20261009', import.meta.url).href;
function prepararRA() {
  const id = ++prepId;
  clearTimeout(temporizador);
  const viewer = $('arViewer');
  viewer.classList.toggle('ra-foco-vasos', modoRA === 'vasos');
  temporizador = setTimeout(async () => {
    if (modoRA === 'completo' || modoRA === 'vasos' || modoRA === 'aprovado') {
      const modelo = modoRA === 'aprovado' ? URL_APROVADO : modoRA === 'vasos' ? URL_CORACAO_VASOS : URL_TORAX_COMPLETO;
      if (viewer.getAttribute('src') === modelo) return;
      $('launchAR').disabled = true;
      $('raStatus').textContent = modoRA === 'vasos'
        ? 'Carregando o coração e os vasos em foco…'
        : 'Carregando o tórax anatômico completo…';
      viewer.setAttribute('alt', modoRA === 'vasos'
        ? 'Coração com vasos pulmonares, aorta, veias cavas e vasos coronários em visualização ampliada'
        : 'Modelo anatômico do tórax completo em 3D');
      viewer.setAttribute('src', modelo);
      return;
    }
    $('launchAR').disabled = true;
    viewer.setAttribute('alt', 'Modelo da simulação respiratória em realidade aumentada');
    $('raStatus').textContent = 'Preparando o modelo para a câmera…';
    try {
      const clone = clonarVisual(modelos[atual]);
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
      $('arViewer').setAttribute('src', arUrl);
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
    $('raStatus').textContent = modoRA === 'vasos'
      ? `Coração e vasos carregados. Gire o modelo para conferir as conexões. ${COMO_ABRIR}`
      : modoRA === 'completo'
        ? `Tórax anatômico completo carregado; modelo estático. ${COMO_ABRIR}`
        : `Pronto. Tamanho no ambiente: ${TAM_REAL[atual].toFixed(2)} m. ${COMO_ABRIR}`;
  } else {
    $('launchAR').disabled = true;
    $('raStatus').textContent = modoRA === 'vasos'
      ? 'Modelo 3D carregado. Este navegador não abre a câmera de RA; gire e amplie o modelo aqui.'
      : 'Este navegador não abre RA. Use o Safari no iPhone/iPad ou o Chrome no Android.';
  }
});
$('arViewer').addEventListener('error', () => { $('launchAR').disabled = true; $('raStatus').textContent = 'O modelo não carregou no visualizador de RA.'; });
$('raModelo').addEventListener('change', () => {
  modoRA = $('raModelo').value;
  $('raNotaModelo').textContent = modoRA === 'aprovado' ? 'Modelo aprovado: ombros anatômicos, bordas pulmonares revisadas e acabamento das fissuras. É um instante estático de repouso e não reproduz o ciclo respiratório.' : modoRA === 'vasos'
    ? 'Visualização ampliada do coração, aorta, veias cavas, tronco e ramos pulmonares, veias pulmonares e vasos coronários. Gire para examinar as faces. As terminações pulmonares indicam os hilos de forma esquemática; as dimensões anatômicas originais foram preservadas.'
    : modoRA === 'completo'
      ? 'Tórax completo com pulmões, caixa torácica, diafragma e coração em posição anatômica, com vasos pulmonares e coronários esquemáticos. Modelo estático: não reproduz ciclo respiratório, pneumotórax ou os demais estados da bancada.'
      : 'A RA acompanha o nível, o estado e a postura selecionados na simulação.';
  prepararRA();
});
$('verVasos').addEventListener('click', () => {
  $('raModelo').value = 'vasos';
  $('raModelo').dispatchEvent(new Event('change'));
});
$('launchAR').addEventListener('click', () => {
  try { $('arViewer').activateAR(); }
  catch (err) { $('raStatus').textContent = 'A câmera não abriu. Verifique a permissão de câmera do navegador.'; }
});

/* ------------------------------------------------------------ entradas paradas */
ajustar();
const busca = new URLSearchParams(location.search);
const modeloPedido = busca.get('modelo');
if (['completo', 'vasos', 'aprovado'].includes(modeloPedido)) {
  $('raModelo').value = modeloPedido;
  $('raModelo').dispatchEvent(new Event('change'));
}
const nivel = parseInt(busca.get('nivel'), 10);
const grauPedido = parseFloat(busca.get('grau'));
const pn = busca.get('pneumo');
const ce = busca.get('cenario');
const pedidoEstado=busca.get('estado');
if(pedidoEstado&&ESTADOS.some(p=>p.id===pedidoEstado))selecionarEstado(pedidoEstado);
else selecionarEstado('repouso',false);
if (pn && ['nenhum', 'aberto', 'hipertensivo'].includes(pn)) {
  pneumo = pn;
  $('pneumos').querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.pneumo === pn));
}
if (ce && CENARIOS.some(c => c.id === ce)) {
  cenario = ce;
  if(ce==='exercicio'&&!pedidoEstado)selecionarEstado('exercicio',false);
  $('cenarios').querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.cenario === ce));
}
if (Number.isFinite(grauPedido)) { grau = grauAlvo = clamp(grauPedido, 0, 90); }
const faseP = parseFloat(busca.get('fase'));
if (Number.isFinite(faseP)) { fase = clamp(faseP, 0, 1); }
sincronizarCiclo();
irAoNivel(Number.isFinite(nivel) ? nivel - 1 : 0);
/* desenha uma vez à mão: o laço pode estar congelado no painel do navegador */
desenhar();
if (modeloPedido === 'vasos') $('visualizacaoRA').scrollIntoView({ block: 'center' });
