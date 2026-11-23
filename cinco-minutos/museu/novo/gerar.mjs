// Museu novo, em caixas: cada sala é uma caixa (laje + paredes baixas + pedestal + peça) e a fachada é outra caixa separada.
// Uso (na pasta do gltf-transform): node gerar.mjs ../pecas saida.glb
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds, mergeDocuments, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs'; import path from 'path';
const [,, PECAS = '../pecas', SAIDA = 'museu-novo.glb'] = process.argv;
// VARIANTE=B|C: monta a maquete com as peças alternativas sorteadas (as mesmas do jogo, game.js)
const VARIANTE = (process.env.VARIANTE || 'A').toUpperCase(), VI = VARIANTE === 'B' ? 1 : VARIANTE === 'C' ? 2 : 0;
let ALT = {}, ID2SALA = { N14: 'veiculos' };
if (VI) {
 const gj = fs.readFileSync(process.env.GAME_JS || '/home/claude/lab-ra/cinco-minutos/game.js', 'utf8');
 for (const m of gj.matchAll(/\{id:'(\w+)',\s*name:'[^']*',\s*andar:'[^']*',\s*icon:'[^']*',\s*sub:'[^']*',\s*peca:'(\w+)'/g)) ID2SALA[m[2]] = ID2SALA[m[2]] || m[1];
 const ini = gj.indexOf('const PECAS_ALT = {'), fim = gj.indexOf('\n};', ini);
 ALT = new Function('return ' + gj.slice(ini + 'const PECAS_ALT = '.length, fim + 3))();
}
// [peça, tamanho: G grande / M médio / P pequeno]  — por andar, na ordem das salas do jogo (2º, 1º, térreo)
const G = 0.095, M = 0.06, P = 0.036;
// 5 andares x 6 salas (2 colunas x 3 fileiras). De cima para baixo: 5º andar primeiro.
const PECAS_ORDEM = [['D01','G'],['D02','G'],['N14','G'],['N01','P'],['N15','M'],['CERA','G'],
 ['N02','M'],['F01','M'],['C01','M'],['D08','G'],['F02','M'],['N03','P'],
 ['N04','M'],['N05','M'],['D09','M'],['B09','M'],['B02','M'],['N06','M'],
 ['N12','M'],['N07','P'],['N11','P'],['N09','P'],['L01','M'],['L02','M'],
 ['B01','M'],['S01','M'],['L03','M'],['B04','M'],['M01','M'],['B05','G']];   // térreo: as 5 funções de entrada (recepção, segurança, limpeza, conservação, manutenção) ocupam os 5 primeiros lugares, da porta para dentro
const ANDARES = [4,3,2,1,0].map(a => [a === 0 ? 'T' : String(a), PECAS_ORDEM.slice((4 - a) * 6, (4 - a) * 6 + 6)]);
const TAM = { G, M, P };
const AGENCIA = process.argv[4] || '../../../biblioteca/dragon/jogos/a-manha-do-carro-forte/o-impostor/modelos/agencia-0688-base.glb';
const ESC = 0.025;                         // 1 m do prédio = 2,5 cm de maquete
const COLS = 2, LINHAS = 3, ESP = 0.004, PED = 0.022;
const X0 = -8.2, X1 = 4.2, Z0 = -6.0, Z1 = 6.2;           // área interna do prédio (m)
const NIVEL = [0.4, 4.0, 7.7, 11.4, 15.1];                   // altura de cada andar (m)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule(), 'meshopt.decoder': MeshoptDecoder });
await MeshoptDecoder.ready;
const doc = new Document(); const buf = doc.createBuffer(); const cena = doc.createScene('museu');
const mats = {};
function mat(nome, cor, rug = .8, met = 0, alfa = 1) { if (!mats[nome]) { const m = doc.createMaterial(nome).setBaseColorFactor([...cor, alfa]).setRoughnessFactor(rug).setMetallicFactor(met); if (alfa < 1) m.setAlphaMode('BLEND'); mats[nome] = m; } return mats[nome]; }
function caixa(nome, m, [w, h, d], [x, y, z]) { // caixa com base em y (y = parte de baixo)
 const hw = w/2, hd = d/2; const P_ = [], N = [], I = [];
 const faces = [[[0,0,1],[[-hw,0,hd],[hw,0,hd],[hw,h,hd],[-hw,h,hd]]],[[0,0,-1],[[hw,0,-hd],[-hw,0,-hd],[-hw,h,-hd],[hw,h,-hd]]],[[1,0,0],[[hw,0,hd],[hw,0,-hd],[hw,h,-hd],[hw,h,hd]]],[[-1,0,0],[[-hw,0,-hd],[-hw,0,hd],[-hw,h,hd],[-hw,h,-hd]]],[[0,1,0],[[-hw,h,hd],[hw,h,hd],[hw,h,-hd],[-hw,h,-hd]]],[[0,-1,0],[[-hw,0,-hd],[hw,0,-hd],[hw,0,hd],[-hw,0,hd]]]];
 faces.forEach(([n, vs], i) => { vs.forEach(v => { P_.push(...v); N.push(...n); }); I.push(i*4, i*4+1, i*4+2, i*4, i*4+2, i*4+3); });
 const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf);
 const nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf);
 const ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(ind).setMaterial(m);
 return doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(pr)).setTranslation([x, y, z]);
}
const PALETA = [[.93,.88,.78],[.85,.9,.82],[.82,.87,.94],[.94,.84,.82],[.9,.86,.93],[.95,.92,.78]];

// ----- sala: caixa própria (laje + paredes baixas com vão de porta + pedestal + peça). Medidas em metros do prédio; tudo no nó 'mundo' (escala ESC)
const torre = doc.createNode('torre').setScale([ESC, ESC, ESC]); cena.addChild(torre);
const grupo = []; for (let k = 0; k < 5; k++) { grupo[k] = doc.createNode('andar_' + k); torre.addChild(grupo[k]); }
const RW = (X1 - X0 - 0.3) / COLS, RD = (Z1 - Z0 - 0.4) / LINHAS;   // tamanho de cada sala (m)

// ----- ESCALA REAL (auditoria 23/11): 1 m do prédio = 1 m real; pessoa de referência = 1,75 m (figuras da sala de cera).
// alvo = maior dimensão exibida (m); ped = altura da base (m); uso 'pub' (visitação: circulação em volta) ou 'serv' (serviço do museu: tamanho de uso real);
// 'ampliada' = objeto pequeno mostrado maior para ser visto de fora; 'réplica' = objeto grande mostrado menor. rot: graus (frente = +z, onde fica a porta).
const ESCALA = {
 D01: { alvo: 3.4, ped: .25, uso: 'pub', real: 'esqueleto de ~18 m, réplica reduzida' },
 D02: { alvo: 3.2, ped: .25, uso: 'pub', real: 'esqueleto de ~6 m, réplica reduzida' },
 VEI_A: { alvo: 3.4, ped: .12, uso: 'pub', real: 'caminhão de ~4,6 m e bicicleta de roda alta, réplica reduzida' },
 T01: { alvo: 2.2, ped: .15, uso: 'pub', real: 'máquina do tempo protótipo de ~2,2 m' },
 L04: { alvo: 1.2, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'carrinho de limpeza de ~1,2 m, tamanho real' },
 L05: { alvo: 1.0, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'prateleira de produtos de ~1,0 m, tamanho real' },
 M02: { alvo: .9, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'baú de ferramentas de ~0,9 m, tamanho real' },
 M03: { alvo: 1.8, ped: 0, uso: 'serv', real: 'armário de ferramentas de ~1,8 m, tamanho real' },
 L06: { alvo: 1.6, ped: 0, uso: 'serv', real: 'bancada de projetos de ~1,6 m, tamanho real' },
 L07: { alvo: 1.2, ped: .85, uso: 'serv', real: 'ferramentas de teste sobre bancada, ~1,2 m' },
 N16: { alvo: .9, ped: 1.0, uso: 'pub', real: 'rádio comunicador de ~0,25 m, ampliado' },
 V44: { alvo: 1.0, ped: .9, uso: 'pub', real: 'gramofone de ~0,8 m, quase real' },
 R01: { alvo: .7, ped: 1.0, uso: 'pub', real: 'relógio de custódia de ~0,2 m, ampliado' },
 R02: { alvo: 2.0, ped: .15, uso: 'pub', real: 'relógio de pêndulo de ~2,0 m, tamanho real' },
 E01: { alvo: 1.0, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'quadro elétrico de ~1,0 m, tamanho real' },
 E02: { alvo: 1.8, ped: .1, uso: 'serv', real: 'central de energia de ~1,8 m, tamanho real' },
 I01: { alvo: 1.4, ped: .1, uso: 'serv', real: 'fichário de registros de ~1,4 m, tamanho real' },
 P02: { alvo: 1.6, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'balcão com notebook de ~1,6 m, tamanho real' },
 V12: { alvo: 1.0, ped: .1, uso: 'pub', real: 'cômoda de ~1,0 m, tamanho real' },
 M04: { alvo: 1.2, ped: .1, uso: 'pub', real: 'gaveteiro de ~1,2 m, tamanho real' },
 V41: { alvo: 1.9, ped: .1, uso: 'pub', real: 'sofá de ~1,9 m, tamanho real' },
 C02: { alvo: 1.6, ped: 0, uso: 'pub', real: 'quadro de recados de ~1,6 m' },
 S02: { alvo: 1.5, ped: .1, base: 'red', uso: 'serv', rot: 0, real: 'mesa com monitor de ~1,5 m, tamanho de uso' },
 S03: { alvo: 2.0, ped: .1, base: 'red', uso: 'serv', rot: 0, real: 'parede de telas de ~2,0 m, tamanho de uso' },
 F03: { alvo: 2.2, ped: .15, base: 'red', uso: 'pub', real: 'farol de luz de ~2,2 m' },
 N10: { alvo: 3.0, ped: .15, base: 'red', uso: 'pub', real: 'lanterna de rua de ~3,0 m, tamanho real' },
 V01: { alvo: 1.4, ped: .3, uso: 'pub', real: 'crânio de mamute de ~1,2 m' },
 V02: { alvo: 2.4, ped: .25, uso: 'pub', real: 'costelas gigantes de ~2,4 m' },
 V03: { alvo: 1.6, ped: .3, uso: 'pub', real: 'mandíbula de tubarão de ~1,6 m, réplica' },
 V06: { alvo: .7, ped: 1.0, uso: 'pub', real: 'bule de ~0,2 m, ampliado' },
 V07: { alvo: .9, ped: 1.0, uso: 'pub', real: 'jarro de ~0,4 m, ampliado' },
 V08: { alvo: 1.3, ped: .8, uso: 'pub', real: 'tabuleiro de xadrez de ~0,5 m, ampliado' },
 V09: { alvo: .6, ped: 1.0, uso: 'pub', real: 'dados de ~0,02 m, muito ampliados' },
 V10: { alvo: .7, ped: 1.0, uso: 'pub', real: 'crânio de primata de ~0,2 m, ampliado' },
 V11: { alvo: .8, ped: 1.0, uso: 'pub', real: 'máscara de pedra de ~0,3 m, ampliada' },
 V13: { alvo: 1.8, ped: .1, uso: 'pub', real: 'vitrine de ~1,8 m, tamanho real' },
 V14: { alvo: 1.6, ped: .3, uso: 'pub', real: 'escultura de ~1,6 m' },
 V15: { alvo: .9, ped: 1.0, uso: 'pub', real: 'refletor de ~0,5 m, ampliado' },
 V16: { alvo: 1.5, ped: .1, uso: 'pub', real: 'microfone de pedestal de ~1,5 m, tamanho real' },
 V17: { alvo: 3.4, ped: .25, uso: 'pub', real: 'planador de ~8 m, réplica reduzida' },
 V18: { alvo: .9, ped: 1.0, uso: 'pub', real: 'esqueleto de pássaro de ~0,4 m, ampliado' },
 V19: { alvo: .8, ped: 1.0, uso: 'pub', real: 'amonite de ~0,2 m, ampliada' },
 V20: { alvo: .6, ped: 1.0, uso: 'pub', real: 'trilobita de ~0,08 m, muito ampliada' },
 V23: { alvo: .8, ped: 1.0, uso: 'pub', real: 'capacete de ~0,3 m, ampliado' },
 V24: { alvo: 1.0, ped: .8, uso: 'pub', real: 'escudo de ~0,8 m' },
 V25: { alvo: .9, ped: 1.0, uso: 'pub', real: 'câmera antiga de ~0,3 m, ampliada' },
 V26: { alvo: 1.0, ped: .9, uso: 'pub', real: 'projetor de ~0,5 m, ampliado' },
 V30: { alvo: .9, ped: 1.0, uso: 'pub', real: 'garrafa de ~0,3 m, ampliada' },
 V31: { alvo: 1.2, ped: .5, uso: 'pub', real: 'lustre de cristal de ~1,0 m' },
 V32: { alvo: 1.0, ped: 1.0, uso: 'pub', real: 'concha de ~0,3 m, ampliada' },
 V33: { alvo: 3.4, ped: .25, uso: 'pub', real: 'esqueleto de baleia de ~15 m, réplica reduzida' },
 V48: { alvo: 1.1, ped: .1, uso: 'pub', real: 'cavalinho de balanço de ~1,0 m, tamanho real' },
 V49: { alvo: .6, ped: 1.0, uso: 'pub', real: 'pião de ~0,08 m, muito ampliado' },
 V52: { alvo: .6, ped: 1.0, uso: 'pub', real: 'inseto em âmbar de ~0,05 m, muito ampliado' },
 V50: { alvo: .6, ped: 1.0, uso: 'pub', real: 'âmbar polido de ~0,08 m, muito ampliado' },
 B07: { alvo: 1.2, ped: 1.0, uso: 'pub', real: 'inseto sob vidro de ~0,1 m, ampliado' },
 T02: { alvo: 4.2, ped: .1, uso: 'pub', rot: 0, real: 'carro de viagem no tempo de ~4,2 m, tamanho real' },
 N01: { alvo: .8, ped: 1.0, uso: 'pub', real: 'xícara de ~0,12 m, ampliada' },
 N15: { alvo: 1.3, ped: .8, uso: 'pub', real: 'tabuleiro de ~0,5 m, ampliado' },
 CERA: { nativo: true, ped: 0, semBase: true, uso: 'pub', rot: 0, real: 'figuras de 1,75 m, tamanho real' },
 N02: { alvo: 1.1, ped: .3, uso: 'pub', real: 'cadeira de ~1,0 m, tamanho real' },
 F01: { alvo: 2.6, ped: .25, uso: 'pub', real: 'esqueleto de ~8 m, réplica reduzida' },
 C01: { alvo: 2.2, ped: .3, uso: 'pub', real: 'painel de programa, ~2 m' },
 D08: { alvo: 3.4, ped: .25, uso: 'pub', real: 'asa de planador de ~8 m, réplica reduzida' },
 F02: { alvo: 1.6, ped: .9, uso: 'pub', real: 'placa de fóssil de ~0,6 m, ampliada' },
 N03: { alvo: .7, ped: 1.0, uso: 'pub', real: 'relógio de pulso de ~0,05 m, muito ampliado' },
 N04: { alvo: .8, ped: 1.0, uso: 'pub', real: 'capacete de ~0,3 m, ampliado' },
 N05: { alvo: 1.5, ped: .15, uso: 'pub', real: 'câmera com tripé de ~1,4 m, tamanho real' },
 D09: { alvo: 2.0, ped: .25, uso: 'pub', real: 'trenó de ~2 m, tamanho real' },
 B09: { alvo: 1.2, ped: 1.0, uso: 'pub', real: 'besouro de ~0,05 m, muito ampliado' },
 B02: { alvo: 1.6, ped: .9, uso: 'pub', real: 'placa de frascos de ~0,6 m, ampliada' },
 N06: { alvo: .9, ped: 1.0, uso: 'pub', real: 'porta-velas de ~0,35 m, ampliado' },
 N12: { alvo: 1.2, ped: 1.0, uso: 'pub', real: 'peixe de ~0,7 m, ampliado' },
 B01: { alvo: 1.4, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'quadro de borboletas de ~1,2 m, pendurado na parede' },
 B04: { alvo: 1.8, ped: .9, uso: 'pub', real: 'mesa de espécimes de ~1,5 m' },
 S01: { alvo: 2.0, ped: .12, base: 'red', uso: 'serv', rot: 0, real: 'central de comando de ~2,0 m, tamanho de uso' },
 L01: { alvo: 1.5, ped: .85, uso: 'serv', real: 'bancada de ensaios (microscópio de ~0,4 m, ampliado) ' },
 L02: { alvo: 1.8, ped: 0, uso: 'serv', real: 'armários de equipe, tamanho de uso' },
 N07: { alvo: .9, ped: 1.0, uso: 'pub', real: 'rádio de ~0,5 m, ampliado' },
 L03: { alvo: 1.5, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'esfregão com balde de ~1,4 m, tamanho real' },
 N11: { alvo: .6, ped: 1.0, uso: 'pub', real: 'âmbar de ~0,08 m, muito ampliado' },
 B05: { alvo: 2.4, ped: .15, base: 'red', uso: 'pub', real: 'canteiro do pátio de ~2,4 m, tamanho real' },
 N09: { alvo: .9, ped: 1.0, uso: 'pub', real: 'carrinho de ~0,15 m, muito ampliado' },
 M01: { extras: [{ id: 'QUADRO_ENERGIA', arq: '/home/claude/lab-ra/biblioteca/dragon/jogos/o-eco-do-amanha/o-impostor/modelos/pecas/rec-quadro-eletrico.glb', alvo: 1.0, pos: [2.6, .25 + 1.0, -1.3], rot: -90 }], alvo: .7, ped: .9, uso: 'serv', rot: 0, dx: 0, dz: -1.0, semBase: true, real: 'caixa de ferramentas de ~0,6 m sobre bancada',
  cenario: async ({ sala, pre, HW, HD }) => {   // oficina: bancada e quadro de ferramentas "OFICINA E REPARO" na parede
   const mw = mat(pre + 'madeira', [.45,.3,.18], .8);
   sala.addChild(caixa('bancada', mw, [2.8, .9, .8], [0, .25, -HD + .8]));
   const tex = doc.createTexture('oficina').setImage(fs.readFileSync(path.join(path.dirname(process.argv[1]), 'oficina.png'))).setMimeType('image/png');
   const mq = doc.createMaterial(pre + 'quadro_oficina').setBaseColorTexture(tex).setRoughnessFactor(.8).setMetallicFactor(0);
   const QW = 3.0, QH = QW * 960 / 1792, qy = .25 + 1.1, qz = -HD + .2;
   sala.addChild(caixa('quadro_base', mat(pre + 'quadro_moldura', [.1,.12,.13], .8), [QW + .1, QH + .1, .05], [0, qy - .05, qz - .03]));
   const P_ = [-QW/2, qy, qz, QW/2, qy, qz, QW/2, qy + QH, qz, -QW/2, qy + QH, qz];
   const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf), nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0,0,1, 0,0,1, 0,0,1, 0,0,1])).setBuffer(buf),
    uv = doc.createAccessor().setType('VEC2').setArray(new Float32Array([0,1, 1,1, 1,0, 0,0])).setBuffer(buf), ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array([0,1,2,0,2,3])).setBuffer(buf);
   sala.addChild(doc.createNode('quadro_oficina').setMesh(doc.createMesh('quadro_oficina').addPrimitive(doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setAttribute('TEXCOORD_0', uv).setIndices(ind).setMaterial(mq)))); } },
 P01: { alvo: 1.9, ped: 0, semBase: true, uso: 'serv', rot: 0, real: 'balcão de recepção de ~1,9 m, tamanho real' },
};
// salas onde a peça principal do jogo (B01) não é a recepção em si: a recepção usa o balcão P01 e o quadro B01 na parede
const TROCA = { N14: { peca: 'VEI_A' }, B01: { peca: 'P01', extras: [{ id: 'B01', alvo: 1.4, pos: [0, 1.2, -1.7], rot: 0 }, { id: 'COFRE', arq: '/home/claude/lab-ra/biblioteca/dragon/jogos/o-eco-do-amanha/o-impostor/modelos/pecas/rec-cofre-balanca.glb', alvo: 1.0, pos: [-2.3, .25, -1.45], rot: 0 }] } };
async function carrega(pd) {
 for (const nd of pd.getRoot().listNodes()) { const inst = nd.getExtension('EXT_mesh_gpu_instancing'); if (!inst) continue;
  const T_ = inst.getAttribute('TRANSLATION'), R_ = inst.getAttribute('ROTATION'), S_ = inst.getAttribute('SCALE'), ct = (T_ || R_ || S_).getCount(), mesh = nd.getMesh();
  for (let q = 0; q < ct; q++) { const f = pd.createNode(nd.getName() + '_i' + q).setMesh(mesh); if (T_) f.setTranslation(T_.getElement(q,[0,0,0])); if (R_) f.setRotation(R_.getElement(q,[0,0,0,1])); if (S_) f.setScale(S_.getElement(q,[0,0,0])); nd.addChild(f); }
  nd.setMesh(null); nd.setExtension('EXT_mesh_gpu_instancing', null); }
}
function cilindro(nome, m, r, h, [x, y, z], seg = 28) {
 const P_ = [], N = [], I = [];
 for (let i = 0; i <= seg; i++) { const t = i / seg * Math.PI * 2, c = Math.cos(t), s_ = Math.sin(t);
  P_.push(r*c, 0, r*s_, r*c, h, r*s_); N.push(c, 0, s_, c, 0, s_); }
 for (let i = 0; i < seg; i++) { const a = i*2; I.push(a, a+1, a+3, a, a+3, a+2); }
 const base = P_.length / 3; P_.push(0, h, 0); N.push(0, 1, 0); for (let i = 0; i <= seg; i++) { const t = i / seg * Math.PI * 2; P_.push(r*Math.cos(t), h, r*Math.sin(t)); N.push(0, 1, 0); }
 for (let i = 0; i < seg; i++) I.push(base, base + 2 + i, base + 1 + i);
 const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf), nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)).setBuffer(buf), ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(I)).setBuffer(buf);
 const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(ind).setMaterial(m);
 return doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(pr)).setTranslation([x, y, z]);
}
async function extra(sala, pre, ex_) {   // peça extra pendurada/pousada numa sala (ex.: quadro na parede, cofre no chão)
 const pd = await io.read(ex_.arq || path.join(PECAS, ex_.id + '.glb')); await carrega(pd);
 const bb = getBounds(pd.getRoot().listScenes()[0]); const e = ex_.alvo / Math.max(bb.max[0]-bb.min[0], bb.max[1]-bb.min[1], bb.max[2]-bb.min[2]);
 const th = (ex_.rot || 0) * Math.PI / 180, cs = Math.cos(th), sn = Math.sin(th), mx = (bb.min[0]+bb.max[0])/2, mz = (bb.min[2]+bb.max[2])/2;
 const rx = mx * cs + mz * sn, rz = -mx * sn + mz * cs;
 const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
 const raiz = doc.createNode('extra_' + ex_.id).setScale([e,e,e]).setRotation([0, Math.sin(th/2), 0, Math.cos(th/2)]).setTranslation([ex_.pos[0] - rx*e, ex_.pos[1] - bb.min[1]*e, ex_.pos[2] - rz*e]);
 for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); } nova.dispose(); sala.addChild(raiz);
 raiz.traverse(nd => { const m = nd.getMesh(); if (m) for (const p of m.listPrimitives()) { const mt = p.getMaterial(); if (mt) mt.setName(pre + 'extra_' + ex_.id + '_' + mt.getName()); } });
}
const auditoria = [], salasFeitas = [];
let n = 0;
for (let a = 0; a < ANDARES.length; a++) {
 const [rot, lista] = ANDARES[a]; const ROTULO_ANDAR = rot; const pre = rot === 'T' ? '' : 'A' + rot + '_'; const y0 = NIVEL[4 - a];
 for (let i = 0; i < lista.length; i++) {
  const [id, cl] = lista[i]; const c = i % COLS, l = ROTULO_ANDAR === 'T' ? (LINHAS - 1 - Math.floor(i / COLS)) : Math.floor(i / COLS);   // térreo: lugar 1 = junto à porta (frente)
  const cx = X0 + RW / 2 + c * (RW + 0.3), cz = Z0 + RD / 2 + l * (RD + 0.2);
  const sala = doc.createNode('sala_' + id).setTranslation([cx, y0, cz]); grupo[4 - a].addChild(sala);
  const k = 1 / ESC; // caixa() recebe medidas em m do prédio; pedestal/peça em unidades de maquete são convertidos por k
  sala.addChild(caixa('laje', mat(pre + 'laje' + (n % PALETA.length), PALETA[n % PALETA.length], .9), [RW, .25, RD], [0, 0, 0]));
  const mp = mat(pre + 'parede', [.97,.96,.93], .95), HW = RW / 2, HD = RD / 2, VG = 1.3, PA = 1.5, T = .15;
  for (const s of [-1, 1]) {
   const Lx = HW - VG / 2, Lz = HD - VG / 2;
   sala.addChild(caixa('p', mp, [Lx, PA, T], [s * (VG / 2 + Lx / 2), .25, HD - T / 2])); sala.addChild(caixa('p', mp, [Lx, PA, T], [s * (VG / 2 + Lx / 2), .25, -HD + T / 2]));
   sala.addChild(caixa('p', mp, [T, PA, Lz], [HW - T / 2, .25, s * (VG / 2 + Lz / 2)])); sala.addChild(caixa('p', mp, [T, PA, Lz], [-HW + T / 2, .25, s * (VG / 2 + Lz / 2)]));
  }
  let pecaId = (TROCA[id] && TROCA[id].peca) || id;
  let cfg = { ...(ESCALA[pecaId] || { alvo: 1.2, ped: 1.0, uso: 'pub' }) }; if (TROCA[id]) cfg.extras = TROCA[id].extras;
  if (VI) { const alt = ALT[ID2SALA[id]]?.[VI - 1]; if (alt && alt.peca) { const base = cfg; pecaId = alt.peca; cfg = { ...(ESCALA[pecaId] || { alvo: 1.2, ped: 1.0, uso: 'pub' }), extras: base.extras, cenario: base.cenario }; console.log(VARIANTE, id, '->', pecaId); } else console.log(VARIANTE, id, 'sem alternativa, fica a principal'); }
  const arq = path.join(PECAS, pecaId + '.glb'); if (!fs.existsSync(arq)) { console.log('falta', id); n++; continue; }
  const pd = await io.read(arq); await carrega(pd);
  const bb = getBounds(pd.getRoot().listScenes()[0]); const dx = bb.max[0]-bb.min[0], dy = bb.max[1]-bb.min[1], dz = bb.max[2]-bb.min[2];
  const mx0 = (bb.min[0]+bb.max[0])/2, mz0 = (bb.min[2]+bb.max[2])/2;
  // orientação: o lado maior deita ao longo da sala (x), salvo se a peça tem frente definida (rot)
  let rot = cfg.rot; if (rot === undefined) rot = (dz > dx * 1.1) ? 90 : 0;
  const th = rot * Math.PI / 180, cs = Math.cos(th), sn = Math.sin(th);
  const ex = Math.abs(dx * cs) + Math.abs(dz * sn), ez = Math.abs(dx * sn) + Math.abs(dz * cs);      // pegada depois de girar
  const pub = cfg.uso !== 'serv', LMAXp = pub ? 3.6 : 4.6, PMAXp = pub ? 1.8 : 2.4, ped = cfg.ped;
  const HMAXp = 3.55 - .25 - ped - .1;
  let e = cfg.nativo ? 1 : cfg.alvo / Math.max(dx, dy, dz);
  if (!cfg.nativo) e = Math.min(e, LMAXp / ex, PMAXp / ez, HMAXp / dy);
  const px = ex * e, pz = ez * e;
  const mt_ped = mat(pre + 'pedestal', [.18,.2,.24], .5, .2);
  if (ped > 0 && !cfg.semBase) {
   if (cfg.base === 'red') sala.addChild(cilindro('pedestal', mt_ped, Math.max(px, pz) / 2 + .25, ped, [0, .25, 0]));
   else sala.addChild(caixa('pedestal', mt_ped, [Math.max(px + .3, 1.0), ped, Math.max(pz + .3, 1.0)], [0, .25, 0]));
  }
  const rx = mx0 * cs + mz0 * sn, rz = -mx0 * sn + mz0 * cs;                                  // centro depois de girar
  const mapa = mergeDocuments(doc, pd); const nova = mapa.get(pd.getRoot().listScenes()[0]);
  const raiz = doc.createNode('peca_' + pecaId).setScale([e,e,e]).setRotation([0, Math.sin(th/2), 0, Math.cos(th/2)])
   .setTranslation([-rx*e + (cfg.dx || 0), .25 + ped - bb.min[1]*e, -rz*e + (cfg.dz || 0)]);
  for (const f of nova.listChildren()) { nova.removeChild(f); raiz.addChild(f); } nova.dispose(); sala.addChild(raiz);
  raiz.traverse(nd => { const m = nd.getMesh(); if (m) for (const p of m.listPrimitives()) { const mt = p.getMaterial(); if (mt) mt.setName(pre + 'peca_' + pecaId + '_' + mt.getName()); } });
  auditoria.push({ id: pecaId, sala: id, uso: cfg.uso || 'pub', real: cfg.real || '', alvo: +(Math.max(dx, dy, dz) * e).toFixed(2), larg: +px.toFixed(2), prof: +pz.toFixed(2), alt: +(dy * e).toFixed(2), ped, rot, e: +e.toFixed(3) });
  // cenário de serviço (recepção, oficina...) e peças extras da sala
  if (cfg.cenario) await cfg.cenario({ sala, pre, HW, HD, doc, mat, caixa });
  for (const ex_ of (cfg.extras || [])) await extra(sala, pre, ex_);
  salasFeitas.push({ sala, id, a, HW, HD });
  n++;
 }
}

// (visitante de referência removido a pedido: as figuras da sala de cera já são a régua de 1,75 m)
// ----- letreiro "Museu Mosaico" sobre o telhado (grupo do 4º andar, some junto com a fachada)
{ const tex = doc.createTexture('letreiro').setImage(fs.readFileSync(path.join(path.dirname(process.argv[1]), 'letreiro.png'))).setMimeType('image/png');
  const mL = doc.createMaterial('letreiro').setBaseColorTexture(tex).setEmissiveTexture(tex).setEmissiveFactor([1, 1, 1]).setRoughnessFactor(.6).setMetallicFactor(0);
  const LW = 14, LH = LW * 320 / 2048, LY = 19.7, LZ = 4.6, LX = -2;
  const quad = (z, n, flip) => { const xs = flip ? [LW/2, -LW/2] : [-LW/2, LW/2];
   const P_ = [xs[0], LY, z, xs[1], LY, z, xs[1], LY + LH, z, xs[0], LY + LH, z], UV = [0, 1, 1, 1, 1, 0, 0, 0];
   const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(P_)).setBuffer(buf), nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array([0,0,n, 0,0,n, 0,0,n, 0,0,n])).setBuffer(buf),
    uv = doc.createAccessor().setType('VEC2').setArray(new Float32Array(UV)).setBuffer(buf), ind = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array([0,1,2,0,2,3])).setBuffer(buf);
   const pr = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setAttribute('TEXCOORD_0', uv).setIndices(ind).setMaterial(mL);
   return doc.createNode('fachada_4_letreiro_' + (n > 0 ? 'frente' : 'costas')).setMesh(doc.createMesh('letreiro' + n).addPrimitive(pr)).setTranslation([LX, 0, 0]); };
  const mB = mat('letreiro_base', [.07, .07, .09], .5, .3);
  const corpo = caixa('fachada_4_letreiro_corpo', mB, [LW, LH, .3], [LX, LY, LZ]);
  const q1 = quad(LZ + .16, 1, false), q2 = quad(LZ - .16, -1, true);
  const base = caixa('fachada_4_letreiro_pe', mB, [LW * .8, LY - 18.8, .6], [LX, 18.8, LZ]);
  for (const nd of [corpo, base]) grupo[4].addChild(nd);
  for (const q of [q1, q2]) grupo[4].addChild(q); }
// ----- fachada: a agência 0688 (prédio preto do carro-forte), empilhada em 5 andares. Caixa à parte, nó 'fachada'.
const ag = await io.read(AGENCIA);
const mapaA = mergeDocuments(doc, ag); const cenaA = mapaA.get(ag.getRoot().listScenes()[0]);
const raizA = cenaA.listChildren()[0]; const porNome = {}; raizA.listChildren().forEach(c => porNome[c.getName()] = c);
const clona = (no, dy, k) => { const f = doc.createNode('fachada_' + k + '_' + no.getName()).setMesh(no.getMesh()); const t = no.getTranslation(); f.setTranslation([t[0], t[1] + dy, t[2]]); f.setRotation(no.getRotation()); f.setScale(no.getScale()); grupo[k].addChild(f); };
for (const nm of ['agencia', 'porta-giratoria']) if (porNome[nm]) clona(porNome[nm], 0, 0);
for (let i = 1; i < 5; i++) if (porNome['porta-giratoria']) clona(porNome['porta-giratoria'], i * 3.7, i);   // vidro redondo repetido em todos os andares
const ALT_P = 3.7; for (let i = 0; i < 4; i++) clona(porNome['piso-2'], i * ALT_P, i + 1);
clona(porNome['telhado'], 3 * ALT_P, 4);
// canto arredondado com vidro (vidro + esquadrias do térreo) repetido nos andares 1..4
{ const ag0 = porNome['agencia'], mAg = ag0.getMesh(), mv = doc.createMesh('canto_vidro');
  for (const p of mAg.listPrimitives()) { const mn = p.getMaterial() && p.getMaterial().getName(); if (mn !== 'vidro' && mn !== 'aco-escuro') continue;
   const q = doc.createPrimitive().setMode(p.getMode()).setMaterial(p.getMaterial()); for (const sem of p.listSemantics()) q.setAttribute(sem, p.getAttribute(sem)); if (p.getIndices()) q.setIndices(p.getIndices()); mv.addPrimitive(q); }
  const t = ag0.getTranslation(), sc = ag0.getScale(), FY = 0.85, yb = -7436 / 32767;   // altura menor: pé-direito dos andares é 3,7 m
  for (let k = 1; k < 5; k++) { const base = 4.0 + (k - 1) * ALT_P + 0.1;
   const f = doc.createNode('fachada_' + k + '_canto_vidro').setMesh(mv).setTranslation([t[0], base - yb * sc[1] * FY, t[2]]).setRotation(ag0.getRotation()).setScale([sc[0], sc[1] * FY, sc[2]]); grupo[k].addChild(f); } }
cenaA.removeChild(raizA);   // o resto do quarteirão fica sem cena e é limpo pelo prune
doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({ method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER });
for (const sc of doc.getRoot().listScenes()) if (sc !== cena) sc.dispose();
await doc.transform(prune());
for (const a of doc.getRoot().listAnimations()) a.dispose();
const bufs = doc.getRoot().listBuffers();
for (const b of bufs.slice(1)) { for (const a of doc.getRoot().listAccessors()) if (a.getBuffer() === b) a.setBuffer(bufs[0]); b.dispose(); }
fs.writeFileSync(path.join(path.dirname(SAIDA), VI ? 'auditoria-salas-' + VARIANTE + '.json' : 'auditoria-salas.json'), JSON.stringify(auditoria, null, 1));
await io.write(SAIDA, doc); console.log('ok', n, 'salas ->', SAIDA);
