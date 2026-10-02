/* ============================================================================
   TESTE 10 — ESPAÇO PLEURAL E ZONAS DE WEST · geometria. Nada de DOM.
   A física mora em `fisica.js` e não é importada aqui: geometria não decide
   número. O app junta as duas. A INTERFACE com o app é a mesma de antes:
   `criar()` devolve { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos,
   aplicarZonas, N_ALV, N_FAIXA }.

   O QUE MUDOU. As peças agora são anatômicas e vêm de `anatomia.js`
   (metros, lado direito do paciente em x negativo — como numa radiografia):
   doze pares de costelas em fita descendo até o esterno, coluna com
   processos, pulmões com fissuras e chanfradura cardíaca, pleura parietal
   como envelope, diafragma em duas cúpulas, coração e grandes vasos.

   A REGRA DE COR continua: pressão NEGATIVA é azul-frio, POSITIVA é âmbar.
   No pneumotórax o pulmão direito recolhe para o hilo e o envelope da pleura
   parietal — que fica com a parede — vira ESPAÇO âmbar entre os dois. Nas
   zonas de West a cor é categórica: cinza, âmbar, vermelho.
   ========================================================================== */
import * as THREE from 'three';
import {
  DIR, ESQ, mk, loft, tuboGeo, construirCaixa, construirColuna, construirDiafragma,
  construirMediastino, geoPulmao, secaoPulmao, HILO,
} from './anatomia.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const cor = (r, g, b) => new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);

/* Uma unidade de mundo = 1 cm. A anatomia é construída em metros e entra num
   grupo `cm` com escala 100 — o nível em si fica com escala 1, que é o que a
   RA espera ao medir a caixa. */
export const TORAX = { altura: 30, largura: 28, fundo: 20 };

export const CORES = {
  negativa: cor(70, 132, 214),
  positiva: cor(245, 158, 46),
  zona1: cor(140, 146, 152),
  zona2: cor(233, 160, 62),
  zona3: cor(200, 54, 62),
};

const phys = (name, o) => Object.assign(new THREE.MeshPhysicalMaterial(o), { name });
export const M = {
  osso:       phys('osso',       { color: 0xe9e1cf, roughness: .58, sheen: .3, sheenColor: cor(255, 250, 240) }),
  cartilagem: phys('cartilagem', { color: 0xd3dedb, roughness: .42, sheen: .4 }),
  disco:      phys('disco',      { color: 0xc8b5a2, roughness: .82 }),
  pulmao:     phys('pulmao',     { color: 0xd49aa2, roughness: .68, sheen: .85, sheenColor: cor(255, 190, 200) }),
  pulmaoColapso: phys('pulmao_colapsado', { color: 0x8a4452, roughness: .6, sheen: .7, sheenColor: cor(255, 170, 180) }),
  pulmaoVidro: phys('pulmao_translucido', { color: 0xf0dfe4, roughness: .3, sheen: .9, sheenColor: cor(255, 255, 255),
                 transparent: true, opacity: .34, depthWrite: false }),
  pleuraP:    phys('pleura_parietal', { color: CORES.negativa.getHex(), roughness: .15, transparent: true, opacity: .12, depthWrite: false, side: THREE.DoubleSide }),
  pleuraAr:   phys('espaco_pleural_ar', { color: CORES.positiva.getHex(), roughness: .3, emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .6,
                 transparent: true, opacity: .26, depthWrite: false, side: THREE.DoubleSide }),
  diafragma:  phys('diafragma',  { color: 0xb8626b, roughness: .72, sheen: .6, sheenColor: cor(255, 160, 150), side: THREE.DoubleSide }),
  coracao:    phys('coracao',    { color: 0xa8434e, roughness: .55, sheen: .5 }),
  arteria:    phys('arteria',    { color: 0xc44b53, roughness: .5 }),
  veia:       phys('veia',       { color: 0x5c6fae, roughness: .5 }),
  traqueia:   phys('traqueia',   { color: 0xe8ded8, roughness: .55 }),
  alveolo:    phys('alveolo',    { color: 0xe4a9b0, roughness: .55, sheen: .8, sheenColor: cor(255, 220, 225) }),
  zona1:      phys('zona1',      { color: CORES.zona1.getHex(), roughness: .5 }),
  zona2:      phys('zona2',      { color: CORES.zona2.getHex(), roughness: .5 }),
  zona3:      phys('zona3',      { color: CORES.zona3.getHex(), roughness: .5 }),
  seta:       phys('seta',       { color: 0xf5c518, roughness: .4, emissive: cor(70, 52, 0).getHex(), emissiveIntensity: .5, depthTest: false }),
  /* nível 01, o corte */
  parede:     phys('parede',     { color: 0xd8b9a6, roughness: .74, sheen: .8, sheenColor: cor(255, 214, 190), transparent: true, opacity: .16, depthWrite: false }),
  musculo:    phys('musculo',    { color: 0xa84f5a, roughness: .7, transparent: true, opacity: .3, depthWrite: false }),
  pleuraV:    phys('pleura_visceral', { color: 0xf0dfe4, roughness: .38, sheen: .9, sheenColor: cor(255, 255, 255), transparent: true, opacity: .52 }),
  pleuraPc:   phys('pleura_parietal_corte', { color: 0xe6d3c8, roughness: .42, sheen: .8, transparent: true, opacity: .36 }),
  liquido:    phys('liquido',    { color: 0xa8dcf0, roughness: .12, sheen: 1, sheenColor: cor(255, 255, 255), transparent: true, opacity: .66 }),
  frestaNeg:  phys('fresta_negativa', { color: CORES.negativa.getHex(), roughness: .4, emissive: cor(6, 24, 60).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
  frestaPos:  phys('fresta_positiva', { color: CORES.positiva.getHex(), roughness: .4, emissive: cor(70, 34, 0).getHex(), emissiveIntensity: .7, transparent: true, opacity: .5 }),
};

const emCm = () => { const g = new THREE.Group(); g.name = 'cm'; g.scale.setScalar(100); return g; };

/* ── NÍVEL 01 — A FRESTA ──────────────────────────────────────────────────
   Close no corte da parede. Em cm, esquemático de propósito: duas costelas
   dentro do músculo intercostal, a pleura parietal forrando a parede, o
   filme de líquido, a pleura visceral, e o pulmão por dentro. A fresta é a
   lâmina azul; no pneumotórax ela engorda e vira âmbar. */
function nivelFresta() {
  const g = new THREE.Group();
  const L = 26, R = 9, a0 = -Math.PI * .55, a1 = Math.PI * .55;
  const casca = (nome, raio, mat, ordem) => {
    const m = mk(nome, new THREE.CylinderGeometry(raio, raio, L, 48, 1, true, a0, a1 - a0), mat);
    m.renderOrder = ordem; m.castShadow = false; return m;
  };
  const visceral = casca('pleura_visceral', R, M.pleuraV, 3);
  const filme = casca('filme_liquido', R + .7, M.liquido, 2);
  const fresta = casca('fresta', R + .7, M.frestaNeg, 1);
  const parietal = casca('pleura_parietal', R + 1.4, M.pleuraPc, 3);
  g.add(visceral, filme, fresta, parietal);

  /* a parede: um setor anular sólido — a face de corte mostra a espessura */
  const setor = (ri, ro) => {
    const s = new THREE.Shape();
    s.absarc(0, 0, ro, a0, a1, false); s.absarc(0, 0, ri, a1, a0, true); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: false, curveSegments: 40 });
    geo.rotateX(Math.PI / 2); geo.translate(0, L / 2, 0);
    /* o cilindro das cascas começa o arco em +z e o Shape em +x: alinha */
    geo.rotateY(-Math.PI / 2);
    return geo;
  };
  const musculo = mk('intercostal', setor(R + 1.5, R + 3.4), M.musculo); musculo.renderOrder = 4;
  const pele = mk('parede', setor(R + 3.4, R + 4.6), M.parede); pele.renderOrder = 5;
  g.add(musculo, pele);
  /* duas costelas no meio do músculo, correndo ao longo do corte — depois do
     giro do grupo elas ficam horizontais, uma acima e outra abaixo */
  for (const [nome, th] of [['costela_a', -0.22 * Math.PI], ['costela_b', 0.22 * Math.PI]]) {
    const geo = new THREE.CylinderGeometry(.85, .85, L * .98, 16); geo.scale(1.35, 1, .7);
    const c = mk(nome, geo, M.osso); const r = R + 2.45;
    c.position.set(r * Math.sin(th), 0, r * Math.cos(th)); c.rotation.y = th;
    g.add(c);
  }

  /* o pulmão por dentro, com a superfície lobulada */
  const pulGeo = new THREE.CylinderGeometry(R - .9, R - .9, L * .98, 64, 24);
  { const p = pulGeo.attributes.position, n = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), rr = Math.hypot(x, z);
      if (rr < R - 1) continue;
      const k = 1 + .035 * (Math.sin(y * 1.9 + x * 2.3) * Math.cos(z * 2.1 - y * 1.3) + .5 * Math.sin((x + z) * 4.1 + y * 2.7));
      n.set(x, 0, z).multiplyScalar(k); p.setXYZ(i, n.x, y, n.z);
    }
    pulGeo.computeVertexNormals(); }
  const dentro = mk('pulmao', pulGeo, M.pulmao);
  g.add(dentro);

  g.rotation.z = Math.PI / 2;
  g.userData = { fresta, filme, visceral, parietal, dentro, R };
  return g;
}

/* ── NÍVEL 02 e 03 — O TÓRAX ─────────────────────────────────────────────
   As duas molas e o pneumotórax usam a MESMA peça: é o mesmo tórax, com e
   sem furo. A caixa (costelas, esterno, coluna e a pleura PARIETAL, que é da
   parede) escala em x e z; cada pulmão escala em torno do seu hilo. */
function nivelTorax({ comSetas = false } = {}) {
  const g = new THREE.Group();
  const cm = emCm(); g.add(cm);

  const caixa = new THREE.Group(); caixa.name = 'caixa';
  caixa.add(construirCaixa(M), construirColuna(M));
  const pleuras = {};
  for (const s of [DIR, ESQ]) {
    const m = mk(`pleura_parietal_${s === DIR ? 'D' : 'E'}`, geoPulmao(s, { inflate: .0045, fissuras: false, assoalho: .003 }), M.pleuraP);
    m.renderOrder = 4; m.castShadow = false; caixa.add(m); pleuras[s] = m;
  }
  const med = construirMediastino(M);
  cm.add(caixa, construirDiafragma(M), med);

  /* ordem [esquerdo, direito]: o doente é o direito, como na física */
  const pulmoes = [ESQ, DIR].map(s => {
    const p = new THREE.Group(); p.name = `pulmao_${s === DIR ? 'D' : 'E'}`;
    const h = HILO(s); p.position.copy(h);
    const malha = mk(`pulmao_${s === DIR ? 'D' : 'E'}_malha`, geoPulmao(s), M.pulmao);
    malha.position.copy(h).negate();
    p.add(malha);
    p.userData = { malha, lado: s, base: h.clone() };
    cm.add(p);
    return p;
  });

  let setas = null;
  if (comSetas) {
    /* uma seta para dentro (o pulmão recolhe) e uma para fora (a caixa
       empurra), na mesma altura, na parede lateral direita: é o EMPATE delas
       que faz a pressão negativa. Geometria em metros, dentro do `cm`. */
    setas = new THREE.Group(); setas.name = 'setas';
    for (const [nome, sinal] of [['pulmao', -1], ['caixa', 1]]) {
      const s = new THREE.Group(); s.name = `seta_${nome}`;
      const haste = mk(`haste_${nome}`, new THREE.CylinderGeometry(.0042, .0042, .01, 12), M.seta);
      haste.geometry.rotateZ(-Math.PI / 2); haste.geometry.translate(.005, 0, 0);   // 1 cm, esticado por scale.x
      const ponta = mk(`ponta_${nome}`, new THREE.ConeGeometry(.0105, .02, 14), M.seta);
      ponta.geometry.rotateZ(-Math.PI / 2); ponta.geometry.translate(.01, 0, 0);
      haste.renderOrder = ponta.renderOrder = 20;   // a seta se vê através do pulmão
      s.add(haste, ponta);
      s.userData = { nome, sinal, haste, ponta };
      setas.add(s);
    }
    cm.add(setas);
  }
  g.userData = { caixa, pulmoes, setas, med, pleuras };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 04 — O GRADIENTE ──────────────────────────────────────────────
   O pulmão direito em vidro, centrado no eixo, e uma coluna de alvéolos do
   ápice à base na parte posterior — onde o pulmão é mais alto. O raio de
   cada um vem da física. */
const N_ALV = 9;
function pulmaoDeVidro() {
  const cm = emCm();
  cm.position.x = -secaoPulmao(DIR, 0.18).xc * 100;   // centra o pulmão no eixo de rotação
  const malha = mk('pulmao_D', geoPulmao(DIR), M.pulmaoVidro);
  malha.renderOrder = 6; malha.castShadow = false;
  cm.add(malha);
  return cm;
}
function nivelGradiente() {
  const g = new THREE.Group();
  const cm = pulmaoDeVidro(); g.add(cm);
  const alveolos = [];
  for (let i = 0; i < N_ALV; i++) {
    const f = i / (N_ALV - 1);
    const m = mk(`alveolo_${i + 1}`, new THREE.SphereGeometry(.01, 24, 18), M.alveolo);
    const y = 0.1 + f * 0.175;
    m.position.set(secaoPulmao(DIR, y).xc, y, -0.068 + f * 0.044);
    m.userData.f = f;
    alveolos.push(m); cm.add(m);
  }
  g.userData = { alveolos };
  g.position.y = -15;
  return g;
}

/* ── NÍVEL 05 — AS ZONAS ─────────────────────────────────────────────────
   Faixas horizontais de capilar atravessando o pulmão, uma por altura,
   pintadas pela zona. A cor é CATEGÓRICA de propósito. */
const N_FAIXA = 9;
function nivelZonas() {
  const g = new THREE.Group();
  const cm = pulmaoDeVidro(); g.add(cm);
  const faixas = [];
  for (let i = 0; i < N_FAIXA; i++) {
    const f = i / (N_FAIXA - 1);
    const y = 0.11 + f * 0.16;
    const { xc, a } = secaoPulmao(DIR, y);
    const geo = new THREE.CapsuleGeometry(.0075, Math.max(.01, 2 * a * .8 - .015), 6, 16);
    geo.rotateZ(Math.PI / 2);
    const m = mk(`capilar_${i + 1}`, geo, M.zona3);
    m.position.set(xc, y, -0.062 + f * 0.04);
    m.userData.f = f;
    faixas.push(m); cm.add(m);
  }
  g.userData = { faixas };
  g.position.y = -15;
  return g;
}

/* ========================================================================= */
export function criar() {
  const modelos = [nivelFresta(), nivelTorax({ comSetas: true }), nivelTorax(),
                   nivelGradiente(), nivelZonas()];
  modelos.forEach((m, i) => { m.visible = i === 0; });

  /* A fresta: fina e azul quando a pressão é negativa, grossa e âmbar quando
     alguém furou. O ESPAÇO PLEURAL SÓ VIRA ESPAÇO NO PNEUMOTÓRAX. */
  function aplicarFresta(ppl) {
    const d = modelos[0].userData;
    const positiva = ppl >= 0;
    d.fresta.material = positiva ? M.frestaPos : M.frestaNeg;
    const abre = 1 + clamp(positiva ? .6 + ppl * .07 : 0, 0, 1.4);
    d.fresta.scale.set(abre, 1, abre);
    d.parietal.scale.set(abre * .96 + .04, 1, abre * .96 + .04);
    d.filme.visible = !positiva;
    d.dentro.scale.set(positiva ? .72 : 1, positiva ? .96 : 1, positiva ? .72 : 1);
  }

  /* fração da capacidade total → escala linear: volume vai com o cubo */
  const escalaDe = fracao => Math.cbrt(clamp(fracao, .02, 1.2) / .40);

  function aplicarTorax(nivel, { pulmao, caixa, desvio = 0, forcas = null }) {
    const d = modelos[nivel].userData;
    if (!d || !d.pulmoes) return;
    const ep = escalaDe(pulmao), ec = escalaDe(caixa);
    d.pulmoes.forEach(p => {
      /* só o direito adoece: pneumotórax é de um lado só */
      const doente = p.userData.lado === DIR;
      const e = doente ? ep : escalaDe(0.40);
      p.scale.setScalar(e);
      p.userData.malha.material = (doente && pulmao < .2) ? M.pulmaoColapso : M.pulmao;
      /* o mediastino empurrado: o pulmão bom é deslocado PARA LONGE do lado
         doente — para a esquerda do paciente (+x) */
      p.position.x = p.userData.base.x + (doente ? 0 : ESQ * desvio * 0.026);
    });
    d.caixa.scale.set(ec, 1, ec);
    d.med.position.x = ESQ * desvio * 0.016;
    /* a pleura parietal ficou com a parede; o que sobra entre ela e o pulmão
       recolhido é o espaço — e ele é âmbar porque a pressão virou positiva */
    d.pleuras[DIR].material = pulmao < .3 ? M.pleuraAr : M.pleuraP;

    if (d.setas && forcas) {
      /* na parede lateral direita, à altura do 5º espaço, em metros */
      const xParede = DIR * 0.128 * ec, y = 0.17, z = 0.03;
      for (const s of d.setas.children) {
        const v = Math.abs(forcas[s.userData.nome]) * .55 * 0.01;
        s.userData.haste.scale.x = Math.max(.01, v / .01);
        s.userData.ponta.position.x = Math.max(0, v - .02);
        if (s.userData.sinal < 0) { s.position.set(xParede + 0.012, y + 0.009, z); s.rotation.z = 0; }   // pulmão recolhe: para o centro
        else { s.position.set(xParede - 0.008, y - 0.009, z); s.rotation.z = Math.PI; }                 // caixa empurra: para fora
        s.visible = v > .002;
      }
    }
  }

  /* Os alvéolos do nível 04: o raio sai do volume relativo (cubo). Em cm. */
  function aplicarAlveolos(volumeEm) {
    for (const m of modelos[3].userData.alveolos) {
      const v = volumeEm(m.userData.f);
      m.scale.setScalar(.6 + 1.1 * Math.cbrt(clamp(v, 0, 1)));
    }
  }

  /* As faixas do nível 05: cor pela zona, espessura pelo fluxo. */
  function aplicarZonas(zonaEm, fluxoEm) {
    const faixas = modelos[4].userData.faixas;
    const fluxos = faixas.map(m => fluxoEm(m.userData.f));
    const maior = Math.max(.001, ...fluxos);
    faixas.forEach((m, i) => {
      const z = zonaEm(m.userData.f);
      m.material = z === 1 ? M.zona1 : z === 2 ? M.zona2 : M.zona3;
      const e = .45 + 1.5 * (fluxos[i] / maior);
      m.scale.set(1, e, e);
    });
  }

  return { modelos, aplicarFresta, aplicarTorax, aplicarAlveolos, aplicarZonas, N_ALV, N_FAIXA };
}
