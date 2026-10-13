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
import { criar } from './modelos.js?v=pa-pv-20261003';
import {criarEstadoBomba,avancarBomba} from './bomba.js?v=pes-bomba-20261002';

import {mmHgParaCmH2O} from './fisica.js?v=pa-pv-20261003';
import {criarGraficoPostura,desenharGraficoTemporal} from './grafico.js?v=pa-pv-20261003';
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

const { modelos, aplicarPostura, aplicarBomba, degrausDaValvula, animarCirculacao,reiniciarCirculacao } = await criar();
$('modeloStatus').hidden=true;
modelos.forEach((m, i) => {
  m.visible = i === 0; root.add(m);
  m.traverse(o => {
    if (!o.isMesh) return;
    const viva = !(o.userData.semSombra || (o.material && o.material.transparent));
    o.castShadow = viva; o.receiveShadow = viva;
  });
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
const centrosCorpo=[0,4].map(n=>{
 const pele=modelos[n].getObjectByName('corpo_translucido')??modelos[n].children.find(o=>o.isMesh&&!o.geometry.userData.centros);
 pele.updateWorldMatrix(true,false);const P=pele.geometry.attributes.position,pontos=new Float32Array(P.count*3),p=new THREE.Vector3();
 for(let i=0;i<P.count;i++){p.fromBufferAttribute(P,i).applyMatrix4(pele.matrixWorld);pontos.set(p.toArray(),i*3)}
 return {n,pontos};
});
let ultimaPosturaVista=null;
function vistaCorpo(n){
 const info=centrosCorpo.find(x=>x.n===n),a=g2r(90-grau),c=Math.cos(a),s=Math.sin(a),box=new THREE.Box3(),p=new THREE.Vector3();
 for(let i=0;i<info.pontos.length;i+=3){const x=info.pontos[i],y=info.pontos[i+1],z=info.pontos[i+2];p.set(x,y*c+z*s,z*c-y*s);box.expandByPoint(p)}
 const centro=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 const tan=Math.tan(camera.fov*Math.PI/360),ajuste=Math.max(size.y/2/tan,size.z/2/(tan*camera.aspect))*1.14+size.x/2;
 const d=Math.max(ajuste,raio[n]/tan*1.28*.84);
 return {centro,d};
}
function acompanharCorpo(){
 if(atual!==0&&atual!==4)return;
 if(ultimaPosturaVista!==null&&Math.abs(grau-ultimaPosturaVista)<.02)return;
 const v=vistaCorpo(atual),offset=camera.position.clone().sub(controls.target),delta=v.centro.clone().sub(controls.target);
 camera.position.add(delta);controls.target.copy(v.centro);
 // Respeita a distância escolhida pelo aluno, ajustando apenas a proporção entre posturas.
 if(ultimaPosturaVista!==null){const anterior=vistaAnterior;offset.multiplyScalar(v.d/anterior);camera.position.copy(v.centro).add(offset)}
 vistaAnterior=v.d;ultimaPosturaVista=grau;
 controls.minDistance=v.d*.35;controls.maxDistance=v.d*2.6;
 controls.update();
}
let vistaAnterior=0;
function enquadrar(n) {
 let centro=new THREE.Vector3(),d=raio[n]/Math.tan(camera.fov*Math.PI/360)*1.28;
 if(n===0||n===4){const v=vistaCorpo(n);centro=v.centro;d=v.d;vistaAnterior=d;ultimaPosturaVista=grau;}else ultimaPosturaVista=null;
 camera.position.copy(centro).add(n===0||n===4?new THREE.Vector3(-d,0,0):new THREE.Vector3(0,0,d));controls.target.copy(centro);
 controls.minDistance=d*.35;controls.maxDistance=d*2.6;controls.update();
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

let grauAlvo = 90, grau = 90, sensorVivo = false, eventos = 0;
/* Tremor de mão é o estado normal de quem segura um telefone: sem suavizar, o
   número dança e a peça treme. Média exponencial, que aqui basta — inclinação
   não vira em 360 como rumo, então não precisa de média circular. */
const SUAVE = .18; // Constante de tempo em segundos, independente da taxa de quadros.
let posturaParaRA=false;

function definirGrau(g, imediato = false) {
  grauAlvo = clamp(g, 0, 90);
  posturaParaRA=!imediato;
  if (imediato) { grau = grauAlvo; aplicarTudo(); desenhar(); }
}

/* ------------------------------------------------------------ os níveis */
const TEXTOS = [
  { olho: 'A pergunta', titulo: 'Onde a gravidade aperta?',
    texto: 'Deitado, as veias periféricas estão em 5 mmHg e o átrio direito em 2: existe gradiente de escoamento mesmo sem desnível gravitacional. Em pé, cada centímetro abaixo do átrio acrescenta cerca de 0,78 mmHg às pressões arterial e venosa. Compare PA e PV na mesma região enquanto muda a postura.',
    tags: ['0,78 mmHg/cm', 'altura de referência: átrio direito', 'U nos pés: microcirculação simplificada'] },
  { olho: 'Nível 02', titulo: 'A reserva venosa nas pernas',
    texto: 'A veia é um saco complacente, não um cano: recebe muito volume com pouca pressão. Ao levantar, algumas centenas de mililitros descem para as pernas e deixam de voltar ao coração — e esse represamento pode reduzir a pré-carga. O card estima o volume adicional nas pernas neste modelo didático.',
    tags: ['safena e profunda', 'perfurantes'] },
  { olho: 'Nível 03', titulo: 'Abre para subir, fecha para não voltar',
    texto: 'As duas cúspides abrem com o fluxo em direção ao coração e fecham quando o gradiente favorece o refluxo. Durante a caminhada, acompanhe a abertura na ejeção e o fechamento no relaxamento. Em pé parado, válvulas competentes não eliminam a pressão hidrostática do tornozelo.',
    tags: ['bicúspide', 'gradiente de pressão', 'fluxo anterógrado e refluxo'] },
  { olho: 'Nível 04', titulo: 'O músculo que esvazia a veia',
    texto: 'A panturrilha é a segunda bomba do corpo. Ao contrair, espreme a veia profunda entre as barrigas: a válvula de baixo fecha, a de cima abre, e o segmento se esvazia para cima. As valvas coordenam o esvaziamento na contração e o reenchimento no relaxamento.',
    tags: ['bomba muscular', 'vista interna das válvulas', 'fluxo: distal → proximal → coração'] },
  { olho: 'Nível 05', titulo: 'Parado em pé é pior que andar',
    texto: 'De pé e imóvel, a pressão venosa no tornozelo se aproxima de 95 mmHg neste corpo. A caminhada com válvulas competentes reduz a pressão ambulatorial para perto de 25 mmHg neste modelo. Ao parar, o reservatório distal se reenche gradualmente. A pressão não mede diretamente o fluxo ou o débito cardíaco.',
    tags: ['pressão venosa ambulatorial', 'retorno ao coração', 'U nos pés: microcirculação simplificada'] },
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

  $('caixaValvula').hidden = atual !== 2;
  enquadrar(atual);
  aplicarTudo(); prepararRA(); desenhar();
}

/* ------------------------------------------------------------ a bomba */
let bombaAndando = false, faseBomba = 0, ultimaAmostra = 0;
let executando=false, velocidade=1, tempoSimulado=0, tempoCiclo=0;
let passoRestante=0;
const estadoBomba=criarEstadoBomba();
const historico = [];                     // pressão do tornozelo no tempo
const JANELA_S = 12;

/* ------------------------------------------------------------ aplicar */
let ultimo = {};
function aplicarTudo(atualizarFluxo=true) {
  // Corpo/Ciclo reclinam no plano sagital: cabeça para trás, face para cima.
  // As ampliações da perna e bomba conservam a orientação aprovada.
  root.rotation.set(atual===0||atual===4?-g2r(90-grau):0,0,atual===0||atual===4?0:g2r(90-grau));
  acompanharCorpo();
  const p = aplicarPostura(grau,{atividade:estadoBomba.atividade});
  ultimo = p;

  aplicarBomba(faseBomba, grau,estadoBomba.atividade,bombaAndando||passoRestante>0);

  $('posturaLabel').textContent =
    grau < 20 ? `Decúbito · ${grau.toFixed(0)}°`
    : grau > 70 ? `Ortostatismo · ${grau.toFixed(0)}°`
    : `Inclinado · ${grau.toFixed(0)}°`;
  const numero=v=>v.toFixed(1).replace('.',','),equivalente=v=>numero(mmHgParaCmH2O(v))+' cmH₂O';
  const distal=p.regioes.tornozelo;
  $('pressaoLabel').innerHTML='<b>Tornozelo</b><small class="pa-hud">PA '+numero(distal.pa)+' mmHg <em class="hud-agua">· '+equivalente(distal.pa)+'</em></small><small class="pv-hud">PV '+numero(distal.pv)+' mmHg <em class="hud-agua">· '+equivalente(distal.pv)+'</em></small>';
  $('grauValor').textContent=grau.toFixed(0)+'°';if(!arrastando)$('grauCursor').value=grau.toFixed(0);
  for(const [id,r] of Object.entries(p.regioes)){
   const k=id[0].toUpperCase()+id.slice(1);
   $('pa'+k).textContent=numero(r.pa);$('uPa'+k).textContent=equivalente(r.pa);
   $('l'+k).textContent=r.colabada?'colabada':numero(r.pv);
   $('unidade'+k).textContent=r.colabada?'':' mmHg';$('u'+k).textContent=r.colabada?'Coluna venosa interrompida':equivalente(r.pv);
   $('h'+k).textContent=Math.abs(r.desnivel)<.05?'Mesmo nível vertical do átrio direito':numero(Math.abs(r.desnivel))+' cm '+(r.desnivel>0?'abaixo':'acima')+' do átrio direito';
   $('d'+k).textContent=r.diferenca===null?'Jugular colabada: diferença PA−PV não estimada.':'Diferença PA−PV: '+numero(r.diferenca)+' mmHg · '+equivalente(r.diferenca);
  }
  $('lEmpocado').textContent=Math.max(0,p.empocado).toFixed(0);
  $('deitar').setAttribute('aria-pressed',grau<1);
  $('levantar').setAttribute('aria-pressed',grau>89);
  atualizarExecucao();
  if(atualizarFluxo)animarCirculacao(0,grau,bombaAndando||passoRestante>0,estadoBomba.atividade);

  if (atual === 2) escreverDegraus();
}

function escreverDegraus() {
  const d = degrausDaValvula(grau);
  $('degraus').innerHTML = d.passos.map((s, i) =>
    `<li><b>${i + 1}ª</b> de ${s.de} a ${s.ate} cm <span>${s.mmHg.toFixed(1)} mmHg · ${mmHgParaCmH2O(s.mmHg).toFixed(1).replace('.',',')} cmH₂O</span></li>`).join('');
  $('colunaTotal').textContent = d.coluna.toFixed(1);
  $('colunaAgua').textContent = mmHgParaCmH2O(d.coluna).toFixed(1).replace('.',',');
}

/* ------------------------------------------------------------ o gráfico */
const gr=$('curvaColuna');
const peleGrafico=modelos[0].getObjectByName('corpo_translucido')??modelos[0].children.find(o=>o.isMesh&&!o.geometry.userData.centros);
const graficoPostura=criarGraficoPostura(peleGrafico.geometry);
let ultimaCurva='';
function desenharCurva(){
 if(!Number.isFinite(ultimo.coracao))return;
 const chave=[grau.toFixed(2),estadoBomba.atividade.toFixed(4),ultimo.empocado,gr.clientWidth].join('|');if(chave===ultimaCurva)return;ultimaCurva=chave;
 graficoPostura(gr,grau,ultimo);
}

const gt=$('curvaTempo');
let ultimoTempo='';
function desenharTempo(){if(!ultimo.regioes)return;const r=ultimo.regioes.tornozelo,chave=[tempoSimulado,r.pa,r.pv,gt.clientWidth].join('|');if(chave===ultimoTempo)return;ultimoTempo=chave;desenharGraficoTemporal(gt,historico,tempoSimulado,r,JANELA_S);}

function desenhar() { desenharCurva(); desenharTempo(); renderer.render(scene, camera); rotularValvulas(); }

// As legendas seguem o modelo; não alteram enquadramento nem geometria.
function rotularValvulas() {
  const layer=$('valveLabels');layer.hidden=atual!==3;if(layer.hidden)return;
  const w=stage.clientWidth,h=stage.clientHeight,bw=w<450?120:136;
  layer.querySelector('svg').setAttribute('viewBox',`0 0 ${w} ${h}`);
  const valves=modelos[3].userData.valvulas;
  const anchors=valves.map(par=>{
    const g=par.children[0].geometry,u=g.userData,i=Math.floor(u.nu/2)*(u.nv+1)+Math.floor(u.nv/2);
    const p=new THREE.Vector3().fromBufferAttribute(g.attributes.position,i).add(new THREE.Vector3().fromBufferAttribute(par.children[1].geometry.attributes.position,i)).multiplyScalar(.5);
    const projected=par.localToWorld(p).project(camera);
    return {x:(projected.x+1)*w/2,y:(1-projected.y)*h/2,visible:projected.z>-1&&projected.z<1&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1};
  });
  const horizontal=Math.abs(anchors[1].x-anchors[0].x)>Math.abs(anchors[1].y-anchors[0].y);
  anchors.forEach((a,i)=>{
    const label=$('valveLabel'+i),leader=$('valveLeader'+i);label.hidden=!a.visible;leader.style.display=a.visible?'':'none';if(!a.visible)return;
    const x=clamp(horizontal?a.x-bw/2:a.x+34,8,w-bw-8),y=clamp(horizontal?a.y+(i?-66:24):a.y-22,54,h-94);
    label.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    const open=valves[i].userData.abertura;label.lastElementChild.textContent=open<.1?'Fechada':open>.85?'Aberta':'Em transição';
    const lx=clamp(a.x,x,x+bw),ly=clamp(a.y,y,y+44);
    leader.setAttribute('d',`M${a.x.toFixed(1)},${a.y.toFixed(1)} L${lx.toFixed(1)},${ly.toFixed(1)}`);
  });
  const flow=$('valveFlow'),eject=valves[1].userData.abertura>.85,fill=valves[0].userData.abertura>.85;
  flow.style.display=anchors.every(a=>a.visible)&&(eject||fill)?'':'none';
  if(eject||fill){const dx=anchors[1].x-anchors[0].x,dy=anchors[1].y-anchors[0].y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,a=anchors[eject?1:0],start=eject?14:-50,end=eject?50:-14;
    flow.setAttribute('d',`M${a.x+ux*start+uy*24},${a.y+uy*start-ux*24} L${a.x+ux*end+uy*24},${a.y+uy*end-ux*24}`);
  }
}

/* ------------------------------------------------------------ tamanho */
function ajustar() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  if(atual===0||atual===4)enquadrar(atual);
  desenhar();
}
addEventListener('resize', ajustar);

/* ------------------------------------------------------------ execução */
function atualizarExecucao(){
  $('iniciar').disabled=executando;$('pausar').disabled=!executando;$('passo').disabled=passoRestante>0;
  const modo=passoRestante>0?'passo isolado':bombaAndando?(grau>70?'caminhada':'bomba muscular'):'repouso';
  $('cicloEstado').textContent=(executando?'Em execução':'Pausado')+' · '+modo;
  $('andar').classList.toggle('on',bombaAndando);$('andar').setAttribute('aria-pressed',bombaAndando);
  for(const [id,on] of [['estadoDeitado',!bombaAndando&&grau<20],['estadoParado',!bombaAndando&&grau>70]]){$(id).classList.toggle('on',on);$(id).setAttribute('aria-pressed',on)}
  $('notaEstado').textContent=bombaAndando?'Caminhada: contração e relaxamento favorecem o retorno venoso.':grau>70?'Em pé parado: a pressão retorna gradualmente ao valor hidrostático.':grau<20?'Decúbito: a altura da coluna de sangue é mínima.':'Inclinado: o componente hidrostático acompanha a postura.';
}
function executar(dt){
  // Um único relógio simulado governa músculo, pressão, partículas e coração.
  if(!executando||dt<=0)return;
  const ativo=bombaAndando||passoRestante>0;
  let restante=dt;
  while(restante>1e-8&&executando){
    let h=Math.min(.04,restante);
    if(passoRestante>0)h=Math.min(h,passoRestante);
    if(!$('loopContinuo').checked)h=Math.min(h,Math.max(0,1.15-tempoCiclo));
    if(h<=1e-8){executando=false;break}
    tempoSimulado+=h;tempoCiclo+=h;restante-=h;
    if(ativo)faseBomba=(faseBomba+h/1.15)%1;
    avancarBomba(estadoBomba,h,ativo);
    aplicarTudo(false);animarCirculacao(h,grau,ativo,estadoBomba.atividade);
    if(tempoSimulado-ultimaAmostra>=.125){ultimaAmostra=tempoSimulado;historico.push({t:tempoSimulado,p:ultimo.regioes.tornozelo.pv,pa:ultimo.regioes.tornozelo.pa});}
    while(historico.length&&historico[0].t<tempoSimulado-JANELA_S)historico.shift();
    if(passoRestante>0){passoRestante=Math.max(0,passoRestante-h);if(passoRestante<1e-8){passoRestante=0;faseBomba=0;executando=false;}}
    if(!$('loopContinuo').checked&&tempoCiclo>=1.15-1e-8){executando=false;faseBomba=0;}
  }
  aplicarTudo(false);desenharTempo();
  if(!executando)prepararRA();
}
let anterior = performance.now();
renderer.setAnimationLoop(() => {
  const agora=performance.now(),dt=Math.min(.12,(agora-anterior)/1000);anterior=agora;
  const antes=grau;grau+=(grauAlvo-grau)*(1-Math.exp(-dt/SUAVE));
  if(Math.abs(grauAlvo-grau)<.05)grau=grauAlvo;
  if(Math.abs(grau-antes)>1e-5)aplicarTudo();
  if(posturaParaRA&&grau===grauAlvo){posturaParaRA=false;prepararRA();}
  executar(dt*velocidade);
  controls.update();desenharCurva();desenharTempo();renderer.render(scene,camera);rotularValvulas();
});

/* ------------------------------------------------------------ o sensor */
function ligarSensor() {
  addEventListener('deviceorientation', e => {
    if (e.beta === null || e.gamma === null) return;
    if(arrastando)return;
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
$('grauCursor').addEventListener('input', e => {definirGrau(parseFloat(e.currentTarget.value),true);prepararRA()});
$('deitar').onclick = () => definirGrau(0);
$('levantar').onclick = () => definirGrau(90);

function reiniciar(){executando=false;bombaAndando=false;faseBomba=0;passoRestante=0;estadoBomba.atividade=0;tempoCiclo=0;tempoSimulado=0;ultimaAmostra=0;historico.length=0;reiniciarCirculacao(grau);aplicarTudo();desenhar();prepararRA();}
$('iniciar').onclick=()=>{if(tempoCiclo>=1.15-1e-8)tempoCiclo=0;executando=true;atualizarExecucao()};
$('pausar').onclick=()=>{executando=false;atualizarExecucao();prepararRA()};
$('reiniciar').onclick=reiniciar;
$('velocidade').oninput=e=>{velocidade=+e.currentTarget.value;$('velocidadeValor').textContent=velocidade.toFixed(2).replace('.',',')+'×'};
$('loopContinuo').onchange=()=>{tempoCiclo=bombaAndando?faseBomba*1.15:0};
$('restaurarParametros').onclick=()=>{reiniciar();velocidade=1;$('velocidade').value='1';$('velocidadeValor').textContent='1,00×';$('loopContinuo').checked=true;definirGrau(90,true);enquadrar(atual);prepararRA()};
function estadoRapido(g,andando){bombaAndando=andando;faseBomba=0;passoRestante=0;tempoCiclo=0;executando=true;definirGrau(g,true);desenhar();prepararRA()}
$('andar').onclick=()=>estadoRapido(90,true);
$('estadoParado').onclick=()=>estadoRapido(90,false);
$('estadoDeitado').onclick=()=>estadoRapido(0,false);
$('passo').onclick=()=>{bombaAndando=false;faseBomba=0;passoRestante=1.15;tempoCiclo=0;executando=true;aplicarTudo();desenhar()};
document.querySelectorAll('[data-grafico]').forEach(b=>b.onclick=()=>{const temporal=b.dataset.grafico==='tempo';$('curvaColuna').hidden=temporal;$('curvaTempo').hidden=!temporal;document.querySelectorAll('[data-grafico]').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});$('notaGrafico').textContent=temporal?'PA e PV do tornozelo nos últimos 12 segundos simulados, na mesma escala. Caminhada reduz PV; a PA mantém a referência didática desta postura.':'Postura do corpo e pressões regionais: a silhueta fica em pé ou deitada como na cena. PA e PV são comparadas na mesma escala e na mesma postura.';desenhar()});
$('telaCheia').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen()}catch{$('telaCheia').textContent='Ampliação indisponível'}};
document.addEventListener('fullscreenchange',()=>{$('telaCheia').textContent=document.fullscreenElement?'Reduzir':'Ampliar';ajustar()});

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
      clone.rotation.copy(root.rotation);
      clone.updateMatrixWorld(true);
      const caixa = new THREE.Box3().setFromObject(clone), tam = caixa.getSize(new THREE.Vector3());
      clone.scale.setScalar(TAM_REAL[atual] / Math.max(tam.x, tam.y, tam.z));
      clone.updateMatrixWorld(true);
      const c2 = new THREE.Box3().setFromObject(clone);
      clone.position.set(-(c2.min.x + c2.max.x) / 2, -c2.min.y, -(c2.min.z + c2.max.z) / 2);
      /* shader e pontos não atravessam o USDZ: a pele vira vidro, o sangue sai */
      const fora = [];
      clone.traverse(o => {
        if (o.userData.naoExportar || o.isPoints) { fora.push(o); return; }
        if (o.isMesh && o.material && o.material.isShaderMaterial) {
          o.material = new THREE.MeshPhysicalMaterial({
            color: 0xa9dcff, transparent: true, opacity: .22, roughness: .35,
            depthWrite: false, side: THREE.FrontSide,
          });
        }
      });
      fora.forEach(o => o.parent && o.parent.remove(o));
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
