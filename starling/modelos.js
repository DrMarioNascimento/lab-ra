/* ============================================================================
   TESTE 09 — FORÇAS DE STARLING · geometria e materiais. Nada de DOM.
   A física mora em `fisica.js` e não é importada aqui de propósito: geometria
   não decide número. O app junta as duas.

   A REGRA DE COR DESTA BANCADA, e ela é a lição inteira em duas tintas:
   ÂMBAR EMPURRA PARA FORA, AZUL PUXA PARA DENTRO. Não é cor por espécie — Pc
   e πi são coisas diferentes e ficam da mesma cor porque fazem a mesma coisa.
   O aluno que decora quatro nomes não vê isso; o que olha o quadro, vê.

   E a regra da casa, herdada das bancadas 06 a 08: face invertida na
   GEOMETRIA e nunca em `side`, nada de `clearcoat` em tecido vivo, e cor
   montada em sRGB — `THREE.Color` lê linear por padrão e a bancada 08 já
   perdeu uma tarde com isso.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* Uma unidade de mundo = 1 micrômetro. O capilar tem 8 µm de luz e 1 mm de
   comprimento — mil vezes mais longo que largo, e desenhar isso em escala
   daria um fio de cabelo de um metro. O DESENHO ENCURTA O CAPILAR, e o painel
   diz isso em texto: é exagero de forma, e a física não usa comprimento. */
export const UM = 1;
export const CAP = { luz: 4.2, parede: 1.1, comp: 62 };

const cor = (r, g, b) => new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
export const FORA = cor(245, 158, 46);     // âmbar: empurra para fora
export const DENTRO = cor(70, 132, 214);   // azul: puxa para dentro

const phys = o => new THREE.MeshPhysicalMaterial(o);
export const M = {
  endotelio: phys({ color: 0xc9a8b4, roughness: .5, sheen: .6,
                    sheenColor: cor(255, 210, 220),
                    transparent: true, opacity: .30, depthWrite: false }),
  nucleo: phys({ color: 0x8c5f73, roughness: .62, sheen: .4 }),
  hemacia: phys({ color: 0xa8202c, roughness: .48, sheen: .9,
                  sheenColor: cor(255, 120, 110) }),
  agua: phys({ color: 0x9fd8f2, roughness: .18, sheen: .9,
               sheenColor: cor(255, 255, 255), transparent: true, opacity: .72 }),
  albumina: phys({ color: 0xe8c25a, roughness: .5, sheen: .5 }),
  gel: phys({ color: 0x7f8fa0, roughness: .85, sheen: .3,
              transparent: true, opacity: .13, depthWrite: false }),
  fibra: phys({ color: 0x9a9384, roughness: .85, sheen: .2,
                transparent: true, opacity: .55, depthWrite: false }),
  linfa: phys({ color: 0xbfe3c8, roughness: .48, sheen: .5,
                sheenColor: cor(230, 255, 235),
                transparent: true, opacity: .34, depthWrite: false }),
  arteriola: phys({ color: 0xb8323a, roughness: .55, sheen: .8,
                    sheenColor: cor(255, 150, 140) }),
  venula: phys({ color: 0x5a4f96, roughness: .55, sheen: .7,
                 sheenColor: cor(170, 170, 255) }),
  setaFora: phys({ color: FORA.getHex(), roughness: .42, sheen: .5,
                   emissive: cor(90, 46, 0).getHex(), emissiveIntensity: .5 }),
  setaDentro: phys({ color: DENTRO.getHex(), roughness: .42, sheen: .5,
                     emissive: cor(0, 30, 80).getHex(), emissiveIntensity: .5 }),
};

/* ── A SETA ────────────────────────────────────────────────────────────────
   Haste mais cabeça, num grupo só, apontando em +X. Quem gira e escala é
   quem chama — assim o mesmo desenho serve às quatro forças e a seta é a
   única peça cujo TAMANHO é o número. */
function seta(mat) {
  const g = new THREE.Group();
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(.30, .30, 1, 12), mat);
  haste.geometry.rotateZ(-Math.PI / 2); haste.geometry.translate(.5, 0, 0);
  const ponta = new THREE.Mesh(new THREE.ConeGeometry(.78, 1.5, 14), mat);
  /* a ponta nasce ocupando de 0 a 1,5 no proprio eixo: assim basta empurra-la
     para `v - 1.5` e ela encosta no fim da haste, seja qual for o tamanho */
  ponta.geometry.rotateZ(-Math.PI / 2); ponta.geometry.translate(.75, 0, 0);
  g.add(haste, ponta);
  g.userData.haste = haste; g.userData.ponta = ponta;
  return g;
}

/* Ajusta a seta a uma CONTRIBUIÇÃO em mmHg: o comprimento é o módulo, o
   sentido é o sinal, e A COR SEGUE O SINAL — não a espécie da força.

   Foi aqui que eu errei na primeira volta. Pintei Pi de azul porque "pressão
   do interstício empurra de volta", e não empurra: em tecido normal ela é
   NEGATIVA, cerca de -3 mmHg, e portanto SUGA para fora. Com a cor presa à
   espécie, o quadro mostrava uma seta azul apontando para fora — dizendo o
   contrário do que acontece. Amarrando a cor ao sinal, o desenho não tem como
   mentir: em repouso saem três âmbares contra um azul, e é essa desproporção
   que explica por que o capilar filtra na maior parte do trajeto. */
export function moldarSeta(g, mmHg, radial, escala = .34) {
  const v = Math.abs(mmHg) * escala;
  g.visible = v > .12;
  g.userData.haste.scale.x = Math.max(.001, v);
  g.userData.ponta.position.x = Math.max(0, v - 1.5);
  /* as forças atravessam a PAREDE: a seta é radial, nunca ao longo do tubo */
  const alvo = mmHg >= 0 ? radial : radial.clone().negate();
  g.quaternion.setFromUnitVectors(EIXO_X, alvo);
  g.position.copy(radial).multiplyScalar(CAP.luz + CAP.parede + .7);
  const mat = mmHg >= 0 ? M.setaFora : M.setaDentro;
  g.userData.haste.material = mat; g.userData.ponta.material = mat;
}
const EIXO_X = new THREE.Vector3(1, 0, 0);

/* ── O CAPILAR ────────────────────────────────────────────────────────────
   Tubo deitado no eixo X: u = 0 na ponta arteriolar, u = 1 na venular. */
function tuboCapilar(comp = CAP.comp, luz = CAP.luz) {
  const g = new THREE.CylinderGeometry(luz + CAP.parede, luz + CAP.parede, comp, 28, 1, true);
  g.rotateZ(Math.PI / 2);
  g.translate(comp / 2, 0, 0);
  const m = new THREE.Mesh(g, M.endotelio);
  m.renderOrder = 3;
  return m;
}

/* núcleos das células endoteliais, esparramados pela parede */
function nucleosEndoteliais(comp = CAP.comp) {
  const gs = [];
  for (let i = 0; i < 9; i++) {
    const u = (i + .5) / 9, teta = i * 2.4;
    const n = new THREE.SphereGeometry(1.5, 10, 8);
    n.scale(2.2, .8, 1);
    n.rotateX(teta);
    n.translate(u * comp, Math.cos(teta) * (CAP.luz + .3), Math.sin(teta) * (CAP.luz + .3));
    gs.push(n);
  }
  return new THREE.Mesh(mergeGeometries(gs), M.nucleo);
}

/* hemácias em fila: no capilar elas passam UMA A UMA e dobradas, e é isso
   que faz o capilar ser onde a troca acontece */
function hemacias(n = 7, comp = CAP.comp) {
  const grupo = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const g = new THREE.SphereGeometry(3.4, 16, 12);
    g.scale(.62, 1, .9);
    const m = new THREE.Mesh(g, M.hemacia);
    m.userData.u = i / n;
    grupo.add(m);
  }
  grupo.userData.comp = comp;
  return grupo;
}

/* ── O INTERSTÍCIO ────────────────────────────────────────────────────────
   Gel, não vão vazio. É por ser gel que ele aguenta encher sem estourar, e é
   a complacência dele que dá parte da folga de 17 mmHg. */
function intersticio(comp = CAP.comp, raio = 20) {
  const g = new THREE.Group();
  const bloco = new THREE.CylinderGeometry(raio, raio, comp * 1.04, 26, 1, true);
  bloco.rotateZ(Math.PI / 2); bloco.translate(comp / 2, 0, 0);
  const m = new THREE.Mesh(bloco, M.gel); m.renderOrder = 4;
  g.add(m);

  /* fibras de colágeno: dão textura de tecido e impedem que o gel leia como
     névoa. Poucas e finas — muitas viram palha de aço. */
  const fs = [];
  /* POUCAS E FINAS. Com 26 fibras de raio .32 elas viravam andaime e
     roubavam o quadro do capilar, que e o assunto. */
  for (let i = 0; i < 13; i++) {
    const x0 = rnd(0, comp), a0 = rnd(0, 6.3), r0 = rnd(CAP.luz + 9, raio - 2);
    const pts = [];
    for (let k = 0; k <= 4; k++) {
      const t = k / 4;
      pts.push(V(x0 + rnd(-9, 9) * t, Math.cos(a0 + t * 1.6) * r0 * (1 - .1 * t),
                 Math.sin(a0 + t * 1.6) * r0 * (1 - .1 * t)));
    }
    const c = new THREE.CatmullRomCurve3(pts);
    fs.push(new THREE.TubeGeometry(c, 5, .17, 5, false));
  }
  g.add(new THREE.Mesh(mergeGeometries(fs), M.fibra));
  return g;
}

/* ── A ÁGUA QUE ATRAVESSA ─────────────────────────────────────────────────
   Gotas que saem pela parede onde a soma é positiva e voltam onde é
   negativa. Guardam u e o raio para o app mover conforme a física — a
   geometria não sabe de Starling, só sabe onde a gota está. */
function gotas(n = 90, comp = CAP.comp) {
  const grupo = new THREE.Group();
  const base = new THREE.SphereGeometry(.62, 8, 6);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(base, M.agua);
    m.userData = { u: Math.random(), teta: rnd(0, 6.3), t: Math.random() };
    grupo.add(m);
  }
  grupo.userData.comp = comp;
  return grupo;
}

/* albumina: fica DENTRO, e é justamente por ficar que ela puxa água de volta */
function albuminas(n = 26, comp = CAP.comp) {
  const grupo = new THREE.Group();
  const base = new THREE.SphereGeometry(1.05, 8, 6);
  base.scale(1.5, 1, 1);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(base, M.albumina);
    m.userData = { u: Math.random(), teta: rnd(0, 6.3), r: rnd(.2, .74) };
    grupo.add(m);
  }
  grupo.userData.comp = comp;
  return grupo;
}

/* ── NÍVEL 01 — A REDE ───────────────────────────────────────────────────
   Arteríola, leito capilar e vênula. O que este nível diz é ONDE: não se
   troca nada na artéria nem na veia — troca-se aqui, onde a parede tem uma
   célula de espessura e o sangue anda devagar. */
function nivelRede() {
  const g = new THREE.Group();
  const L = 150, R = 9;
  const art = new THREE.Mesh(new THREE.CylinderGeometry(R, R * .7, 46, 20, 1, true), M.arteriola);
  art.geometry.rotateZ(Math.PI / 2); art.geometry.translate(-L / 2 + 23, 0, 0);
  g.add(art);
  const ven = new THREE.Mesh(new THREE.CylinderGeometry(R * .95, R * 1.35, 46, 20, 1, true), M.venula);
  ven.geometry.rotateZ(Math.PI / 2); ven.geometry.translate(L / 2 - 23, 0, 0);
  g.add(ven);

  /* os capilares: leque entre os dois, com calibres desiguais — um leito
     regular lê como grade e grade não é tecido */
  const caps = [];
  for (let i = 0; i < 9; i++) {
    const y = (i - 4) * 7.6 + rnd(-1.4, 1.4), z = rnd(-6, 6);
    const pts = [V(-L / 2 + 44, 0, 0), V(-L / 2 + 62, y * .7, z * .6),
                 V(0, y, z), V(L / 2 - 62, y * .7, z * .6), V(L / 2 - 44, 0, 0)];
    caps.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 26, rnd(2.1, 3.0), 7, false));
  }
  g.add(new THREE.Mesh(mergeGeometries(caps), M.endotelio));
  g.add(intersticio(L, 34).children[1]);          // só as fibras, sem o gel
  g.position.x = 0;
  return g;
}

/* ── NÍVEIS 02 a 05 — O MESMO CAPILAR, FUNÇÕES DIFERENTES ────────────────
   Um único desenho serve aos quatro, e isso é decisão de conteúdo: trocar o
   objeto a cada nível faria parecer que são fenômenos diferentes. São o
   mesmo capilar visto com perguntas diferentes. */
function nivelCapilar({ comSetas = false, comLinfa = false } = {}) {
  const g = new THREE.Group();
  const comp = CAP.comp;
  g.add(intersticio(comp));
  g.add(tuboCapilar());
  g.add(nucleosEndoteliais());

  const hem = hemacias(); g.add(hem);
  const gt = gotas(); g.add(gt);
  const alb = albuminas(); g.add(alb);

  let setas = null;
  if (comSetas) {
    setas = new THREE.Group();
    /* duas estações: ponta arteriolar e ponta venular. Quatro setas em cada,
       e o COMPRIMENTO de cada uma é o valor em mmHg. */
    for (const u of [0.12, 0.88]) {
      const est = new THREE.Group();
      est.position.x = u * comp;
      ['pc', 'pi', 'oncPlasma', 'oncInter'].forEach((nome, k) => {
        const s = seta(M.setaFora);
        /* espalha as quatro em torno do tubo para não se sobreporem; a
           direção radial de cada uma fica guardada, e é ela que `moldarSeta`
           usa para apontar através da parede */
        const a = (k / 4) * Math.PI * 2 + .5;
        s.userData.nome = nome;
        s.userData.radial = new THREE.Vector3(0, Math.cos(a), Math.sin(a));
        est.add(s);
      });
      est.userData.u = u;
      setas.add(est);
    }
    g.add(setas);
  }

  let linfa = null;
  if (comLinfa) {
    /* o linfático nasce em FUNDO CEGO no tecido: não é um cano que passa, é
       um ralo que começa ali. Sem o fundo cego ninguém entende de onde a
       linfa vem. */
    const pts = [V(comp * .18, -15, 6), V(comp * .42, -17, 3), V(comp * .78, -19, -2), V(comp * 1.02, -21, -6)];
    const t = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 3.4, 10, false);
    linfa = new THREE.Mesh(t, M.linfa);
    linfa.renderOrder = 3;
    const tampa = new THREE.Mesh(new THREE.SphereGeometry(3.4, 12, 9), M.linfa);
    tampa.position.copy(pts[0]);
    g.add(linfa, tampa);
  }

  g.userData = { hem, gotas: gt, albuminas: alb, setas, linfa, comp };
  g.position.x = -comp / 2;
  return g;
}

/* ========================================================================= */
export function criar() {
  const modelos = [
    nivelRede(),
    nivelCapilar(),
    nivelCapilar({ comSetas: true }),
    nivelCapilar({ comSetas: true }),
    nivelCapilar({ comSetas: true, comLinfa: true }),
  ];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* Move hemácias, gotas e albumina. `liquidaEm(u)` vem da física: a gota sai
     onde a soma é positiva e volta onde é negativa, então o desenho não
     decide nada — ele obedece. */
  function animar(t, liquidaEm, { encharcado = 0 } = {}) {
    for (const m of modelos) {
      const d = m.userData;
      if (!d || !d.hem) continue;
      for (const h of d.hem.children) {
        h.userData.u = (h.userData.u + .0016) % 1;
        h.position.set(h.userData.u * d.comp, 0, 0);
      }
      for (const gt of d.gotas.children) {
        const u = gt.userData;
        const p = liquidaEm(u.u);
        /* fora do capilar quando a soma manda para fora, e o quanto ela
           manda decide a que distância a gota chega */
        u.t = (u.t + .004 + Math.abs(p) * .00035) % 1;
        const alcance = clamp(Math.abs(p) / 26, 0, 1);
        const r = p >= 0
          ? CAP.luz * (1 - u.t) + (CAP.luz + 3 + alcance * 13) * u.t
          : (CAP.luz + 3 + alcance * 13) * (1 - u.t) + CAP.luz * u.t;
        const rr = r + encharcado * 6 * (r > CAP.luz + 1 ? 1 : 0);
        gt.position.set(u.u * d.comp, Math.cos(u.teta) * rr, Math.sin(u.teta) * rr);
      }
      for (const a of d.albuminas.children) {
        a.userData.u = (a.userData.u + .0011) % 1;
        const r = CAP.luz * a.userData.r;
        a.position.set(a.userData.u * d.comp, Math.cos(a.userData.teta) * r, Math.sin(a.userData.teta) * r);
        a.rotation.z = t * .0006 + a.userData.teta;
      }
    }
  }

  /* As setas de um nível, ajustadas a um estado da física. */
  function aplicarForcas(nivel, estado, pressaoCapilarEm) {
    const d = modelos[nivel] && modelos[nivel].userData;
    if (!d || !d.setas) return null;
    const leitura = [];
    for (const est of d.setas.children) {
      const u = est.userData.u;
      const pc = pressaoCapilarEm(u, estado);
      const valores = {
        pc: pc,
        pi: -estado.pi,                    /* Pi empurra para DENTRO quando é
                                              positiva; negativa, ela suga */
        oncPlasma: -estado.sigma * estado.oncPlasma,
        oncInter: estado.sigma * estado.oncInter,
      };
      for (const s of est.children) moldarSeta(s, valores[s.userData.nome], s.userData.radial);
      leitura.push({ u, ...valores, soma: valores.pc + valores.pi + valores.oncPlasma + valores.oncInter });
    }
    return leitura;
  }

  return { modelos, animar, aplicarForcas, CAP };
}
