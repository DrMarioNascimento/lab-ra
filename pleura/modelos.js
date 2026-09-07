/* ============================================================================
   TESTE 10 — ESPAÇO PLEURAL E ZONAS DE WEST · geometria. Nada de DOM.
   A física mora em `fisica.js` e não é importada aqui: geometria não decide
   número. O app junta as duas.

   A REGRA DE COR: pressão NEGATIVA é azul-frio, pressão POSITIVA é âmbar. É a
   mesma gramática da bancada 09 e ela vale a pena aqui porque o pneumotórax é
   literalmente uma troca de sinal — a fresta azul vira espaço âmbar.

   Nas zonas de West a cor é outra e de propósito: as três zonas são
   CATEGORIAS, não uma escala. Zona 1 cinza (não corre nada), zona 2 âmbar
   (corre em cachoeira), zona 3 vermelha (corre cheio). Usar um degradê ali
   apagaria justamente a fronteira que a lição nomeia.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const cor = (r, g, b) => new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

/* Uma unidade de mundo = 1 cm. O tórax tem 30 de altura. */
export const TORAX = { altura: 30, largura: 26, fundo: 19 };

export const CORES = {
  negativa: cor(70, 132, 214),
  positiva: cor(245, 158, 46),
  zona1: cor(140, 146, 152),
  zona2: cor(233, 160, 62),
  zona3: cor(200, 54, 62),
};

const phys = o => new THREE.MeshPhysicalMaterial(o);
export const M = {
  parede: phys({ color: 0xd8b9a6, roughness: .74, sheen: .8,
                 sheenColor: cor(255, 214, 190),
                 transparent: true, opacity: .16, depthWrite: false }),
  costela: phys({ color: 0xe9e0cd, roughness: .6, sheen: .35 }),
  pulmao: phys({ color: 0xd48fa0, roughness: .68, sheen: .85,
                 sheenColor: cor(255, 190, 200) }),
  pulmaoColapso: phys({ color: 0x9c5a68, roughness: .62, sheen: .7,
                        sheenColor: cor(255, 170, 180) }),
  pleuraV: phys({ color: 0xf0dfe4, roughness: .38, sheen: .9,
                  sheenColor: cor(255, 255, 255),
                  transparent: true, opacity: .52 }),
  pleuraP: phys({ color: 0xe6d3c8, roughness: .42, sheen: .8,
                  sheenColor: cor(255, 250, 240),
                  transparent: true, opacity: .52 }),
  liquido: phys({ color: 0xa8dcf0, roughness: .12, sheen: 1,
                  sheenColor: cor(255, 255, 255),
                  transparent: true, opacity: .66 }),
  frestaNeg: phys({ color: CORES.negativa.getHex(), roughness: .4,
                    emissive: cor(6, 24, 60).getHex(), emissiveIntensity: .7,
                    transparent: true, opacity: .5 }),
  frestaPos: phys({ color: CORES.positiva.getHex(), roughness: .4,
                    emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .7,
                    transparent: true, opacity: .5 }),
  diafragma: phys({ color: 0xb8555f, roughness: .7, sheen: .8,
                    sheenColor: cor(255, 160, 150) }),
  seta: phys({ color: 0xf5c518, roughness: .4, sheen: .5,
               emissive: cor(70, 52, 0).getHex(), emissiveIntensity: .5 }),
  vaso: phys({ color: 0xffffff, roughness: .5, sheen: .6, vertexColors: true }),
};

/* ── A CAIXA TORÁCICA ─────────────────────────────────────────────────────
   Costelas como arcos, e elas existem por uma razão de conteúdo: no
   pneumotórax a caixa ABRE, e sem costela ninguém vê que ela abriu. É a
   parte que surpreende — todo mundo espera o pulmão colapsar, ninguém espera
   a parede saltar para fora. */
/* UMA COSTELA É UM TUBO VARRIDO POR UMA ELIPSE, e não um toro espremido.
   A primeira versão escalava `TorusGeometry(1, .52, ...)` por (rx, rz) — e o
   tubo é escalado junto com o anel, então ele virava FITA. Na foto a caixa
   lia como pratos empilhados, um abajur, e o pulmão sumia entre eles.

   Com tubo varrido o calibre fica constante, e ainda cabem duas coisas que a
   silhueta pedia: a costela ABRE ATRÁS, onde ela se articula na coluna, e
   CAI PARA A FRENTE, porque costela de gente não é horizontal — é essa queda
   que faz o gradil parecer tórax e não gaiola. */
function costela(y, rx, rz, queda, raio) {
  const pts = [];
  const a0 = -Math.PI / 2 + .30, a1 = 3 * Math.PI / 2 - .30;
  for (let i = 0; i <= 44; i++) {
    const a = a0 + (a1 - a0) * i / 44;
    const frente = (1 + Math.sin(a)) / 2;          // 1 no esterno, 0 na coluna
    pts.push(V(Math.cos(a) * rx, y - queda * frente, Math.sin(a) * rz));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 44, raio, 7, false);
}

function caixaToracica() {
  const g = new THREE.Group();
  const arcos = [];
  for (let i = 0; i < 8; i++) {
    const y = 5 + i * 2.9;
    const t = (i + 1.2) / 10;
    const rx = TORAX.largura / 2 * (0.60 + 0.40 * Math.sin(Math.PI * t));
    const rz = TORAX.fundo / 2 * (0.60 + 0.40 * Math.sin(Math.PI * t));
    /* as de baixo caem mais: é o que dá o formato de sino ao gradil */
    arcos.push(costela(y, rx, rz, 1.6 + i * .42, .52));
  }
  /* esterno e coluna: sem eles os arcos ficam soltos no ar */
  const est = new THREE.BoxGeometry(3.0, 16, 1.4); est.translate(0, 13.5, TORAX.fundo / 2 * .70);
  const col = new THREE.CylinderGeometry(1.7, 1.9, 28, 12); col.translate(0, 15, -TORAX.fundo / 2 * .86);
  arcos.push(est, col);
  g.add(new THREE.Mesh(mergeGeometries(arcos), M.costela));

  /* a parede mole, translúcida, para dar volume sem tapar o pulmão */
  const pele = new THREE.CylinderGeometry(TORAX.largura / 2, TORAX.largura / 2 * .88, 27, 30, 1, true);
  pele.scale(1, 1, TORAX.fundo / TORAX.largura);
  pele.translate(0, 15, 0);
  const mp = new THREE.Mesh(pele, M.parede); mp.renderOrder = 6;
  g.add(mp);
  return g;
}

function diafragma() {
  const perfil = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    perfil.push(new THREE.Vector2(TORAX.largura / 2 * .94 * Math.sin(t * Math.PI / 2),
                                  2.4 - 2.4 * Math.cos(t * Math.PI / 2)));
  }
  const g = new THREE.LatheGeometry(perfil, 28);
  g.scale(1, 1, TORAX.fundo / TORAX.largura);
  g.translate(0, 1.4, 0);
  const m = new THREE.Mesh(g, M.diafragma);
  m.userData.foraDoQuadro = false;
  return m;
}

/* ── O PULMÃO ─────────────────────────────────────────────────────────────
   Um lobo por lado, com fissura. O volume é o que muda, e ele muda pela
   ESCALA do grupo — assim a mesma peça serve à CRF, ao colapso e à caixa
   aberta sem refazer geometria a cada quadro. */
function pulmaoLado(lado) {
  const g = new THREE.Group();
  const partes = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    /* mais estreito em cima (ápice) e largo embaixo (base): é essa forma que
       faz o ápice caber menos alvéolo e ajuda a ler o gradiente */
    const r = (2.6 + 6.4 * Math.sin(Math.PI * (.18 + .74 * t))) * (t > .93 ? .5 : 1);
    partes.push(new THREE.Vector2(r, 2.6 + t * 24));
  }
  const lobo = new THREE.LatheGeometry(partes, 26);
  lobo.scale(1, 1, .78);
  const m = new THREE.Mesh(lobo, M.pulmao);
  m.position.x = lado * 6.4;
  g.add(m);
  g.userData = { malha: m, lado };
  return g;
}

/* ── NÍVEL 01 — A FRESTA ──────────────────────────────────────────────────
   Close nas duas pleuras. O que se vê é que NÃO HÁ ESPAÇO: duas membranas
   encostadas com um filme de líquido entre elas. A fresta é desenhada como
   uma lâmina fina e azul — a cor da pressão negativa —, e no pneumotórax ela
   engorda e vira âmbar. */
function nivelFresta() {
  const g = new THREE.Group();
  const L = 26, R = 9;
  const casca = (raio, mat, ordem) => {
    const c = new THREE.CylinderGeometry(raio, raio, L, 40, 1, true, -Math.PI * .55, Math.PI * 1.1);
    const m = new THREE.Mesh(c, mat); m.renderOrder = ordem; return m;
  };
  const visceral = casca(R, M.pleuraV, 3);
  const parietal = casca(R + 1.4, M.pleuraP, 3);
  /* o filme de líquido: poucos mililitros no corpo inteiro, e é ele que faz
     as duas deslizarem sem se separarem — como dois vidros molhados */
  const filme = casca(R + .7, M.liquido, 2);
  const fresta = casca(R + .7, M.frestaNeg, 1);
  fresta.scale.set(1, 1, 1);
  g.add(visceral, filme, fresta, parietal);

  /* o pulmão por dentro, para dar contexto */
  const dentro = new THREE.Mesh(new THREE.CylinderGeometry(R - .9, R - .9, L * .98, 32), M.pulmao);
  g.add(dentro);
  /* a parede por fora */
  const fora = new THREE.Mesh(new THREE.CylinderGeometry(R + 3.6, R + 3.6, L, 34, 1, true), M.parede);
  fora.renderOrder = 5; g.add(fora);

  g.rotation.z = Math.PI / 2;
  g.userData = { fresta, filme, visceral, parietal, dentro, R };
  return g;
}

/* ── NÍVEL 02 e 03 — O TÓRAX ─────────────────────────────────────────────
   As duas molas e o pneumotórax usam a MESMA peça: é o mesmo tórax, com e
   sem furo. Trocar o objeto faria parecer que são dois assuntos. */
function nivelTorax({ comSetas = false } = {}) {
  const g = new THREE.Group();
  const caixa = caixaToracica();
  g.add(caixa);
  g.add(diafragma());
  const esq = pulmaoLado(-1), dir = pulmaoLado(1);
  g.add(esq, dir);

  let setas = null;
  if (comSetas) {
    /* uma seta para dentro (o pulmão recolhe) e uma para fora (a caixa
       empurra), na mesma altura: é o EMPATE delas que faz a pressão negativa */
    setas = new THREE.Group();
    for (const [nome, sinal] of [['pulmao', -1], ['caixa', 1]]) {
      const s = new THREE.Group();
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, 1, 10), M.seta);
      haste.geometry.rotateZ(-Math.PI / 2); haste.geometry.translate(.5, 0, 0);
      const ponta = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2, 12), M.seta);
      ponta.geometry.rotateZ(-Math.PI / 2); ponta.geometry.translate(1, 0, 0);
      s.add(haste, ponta);
      s.userData = { nome, sinal, haste, ponta };
      setas.add(s);
    }
    g.add(setas);
  }
  g.userData = { caixa, pulmoes: [esq, dir], setas };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 04 — O GRADIENTE ──────────────────────────────────────────────
   Uma coluna de alvéolos do ápice à base. O raio de cada um vem da física, e
   por isso a foto do ápice inflado com a base murcha não é decisão de
   desenho: é a curva. */
const N_ALV = 9;
function nivelGradiente() {
  const g = new THREE.Group();
  const esq = pulmaoLado(-1);
  esq.userData.malha.material = M.pleuraV;      // translúcido, para ver dentro
  esq.position.x = 6.4;
  g.add(esq);

  const alveolos = [];
  for (let i = 0; i < N_ALV; i++) {
    const f = i / (N_ALV - 1);
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), M.pulmao);
    m.position.set(0, 3.4 + f * 22, 0);
    m.userData.f = f;
    alveolos.push(m); g.add(m);
  }
  g.userData = { alveolos };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 05 — AS ZONAS ─────────────────────────────────────────────────
   Faixas horizontais de capilar, uma por altura, pintadas pela zona. A cor é
   CATEGÓRICA de propósito: a fronteira entre zonas é o que a lição nomeia, e
   um degradê a apagaria. */
const N_FAIXA = 9;
function nivelZonas() {
  const g = new THREE.Group();
  const esq = pulmaoLado(-1);
  esq.userData.malha.material = M.pleuraV;
  esq.position.x = 6.4;
  g.add(esq);

  const faixas = [];
  for (let i = 0; i < N_FAIXA; i++) {
    const f = i / (N_FAIXA - 1);
    const largura = 5.5 + 4.5 * Math.sin(Math.PI * (.2 + .7 * f));
    const geo = new THREE.CylinderGeometry(.85, .85, largura * 2, 12, 1, false);
    geo.rotateZ(Math.PI / 2);
    geo.setAttribute('color', new THREE.BufferAttribute(
      new Float32Array(geo.attributes.position.count * 3), 3));
    const m = new THREE.Mesh(geo, M.vaso);
    m.position.set(0, 3.4 + f * 22, 0);
    m.userData.f = f;
    faixas.push(m); g.add(m);
  }
  g.userData = { faixas };
  g.position.y = -15;
  return g;
}

function pintar(malha, c) {
  const a = malha.geometry.attributes.color;
  for (let i = 0; i < a.count; i++) a.setXYZ(i, c.r, c.g, c.b);
  a.needsUpdate = true;
}

/* ========================================================================= */
export function criar() {
  const modelos = [nivelFresta(), nivelTorax({ comSetas: true }), nivelTorax(),
                   nivelGradiente(), nivelZonas()];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* A fresta: fina e azul quando a pressão é negativa, grossa e âmbar quando
     alguém furou. O ESPAÇO PLEURAL SÓ VIRA ESPAÇO NO PNEUMOTÓRAX, e é essa a
     frase que a geometria tem de dizer sozinha. */
  function aplicarFresta(ppl) {
    const d = modelos[0].userData;
    const positiva = ppl >= 0;
    d.fresta.material = positiva ? M.frestaPos : M.frestaNeg;
    /* de 1,0 (encostadas) a 2,4 (espaço de verdade) */
    const abre = 1 + clamp(positiva ? .6 + ppl * .07 : 0, 0, 1.4);
    d.fresta.scale.set(abre, 1, abre);
    d.parietal.scale.set(abre * .96 + .04, 1, abre * .96 + .04);
    d.filme.visible = !positiva;
    d.dentro.scale.set(positiva ? .72 : 1, positiva ? .96 : 1, positiva ? .72 : 1);
  }

  /* Os dois volumes do nível 02/03: o pulmão e a caixa vão cada um para o
     seu. `escalaDe` traduz fração da capacidade total em escala linear —
     volume vai com o cubo, e ignorar isso faria o colapso parecer brando. */
  const escalaDe = fracao => Math.cbrt(clamp(fracao, .02, 1.2) / .40);

  function aplicarTorax(nivel, { pulmao, caixa, desvio = 0, forcas = null }) {
    const d = modelos[nivel].userData;
    if (!d || !d.pulmoes) return;
    const ep = escalaDe(pulmao), ec = escalaDe(caixa);
    d.pulmoes.forEach((p, i) => {
      /* só o lado direito adoece: pneumotórax é de um lado só, e ver os dois
         colapsarem juntos ensinaria errado */
      const doente = i === 1;
      const e = doente ? ep : escalaDe(0.40);
      p.scale.set(e, e, e);
      p.userData.malha.material = (doente && pulmao < .2) ? M.pulmaoColapso : M.pulmao;
      /* o mediastino empurrado: o pulmão bom é deslocado para o lado */
      p.position.x = (doente ? 0 : -desvio * 2.6);
    });
    d.caixa.scale.set(ec, 1, ec);

    if (d.setas && forcas) {
      for (const s of d.setas.children) {
        const v = Math.abs(forcas[s.userData.nome]) * .55;
        s.userData.haste.scale.x = Math.max(.001, v);
        s.userData.ponta.position.x = Math.max(0, v - 2);
        s.position.set(s.userData.sinal > 0 ? 9 : -9, 16, 0);
        s.rotation.y = 0;
        s.rotation.z = s.userData.sinal > 0 ? 0 : Math.PI;
        s.visible = v > .2;
      }
    }
  }

  /* Os alvéolos do nível 04: o raio sai do volume relativo, e o volume vai
     com o cubo do raio. */
  function aplicarAlveolos(volumeEm) {
    for (const m of modelos[3].userData.alveolos) {
      const v = volumeEm(m.userData.f);
      const r = 1.1 + 1.9 * Math.cbrt(clamp(v, 0, 1));
      m.scale.setScalar(r);
    }
  }

  /* As faixas do nível 05: cor pela zona, espessura pelo fluxo. */
  function aplicarZonas(zonaEm, fluxoEm) {
    const fluxos = modelos[4].userData.faixas.map(m => fluxoEm(m.userData.f));
    const maior = Math.max(.001, ...fluxos);
    modelos[4].userData.faixas.forEach((m, i) => {
      const z = zonaEm(m.userData.f);
      pintar(m, z === 1 ? CORES.zona1 : z === 2 ? CORES.zona2 : CORES.zona3);
      const e = .45 + 1.5 * (fluxos[i] / maior);
      m.scale.set(1, e, e);
    });
  }

  return { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas, N_ALV, N_FAIXA };
}
