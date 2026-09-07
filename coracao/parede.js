/* ============================================================================
   TESTE 11 — o perfil da parede, sem three.js.
   A malha em `modelos.js` revoluciona estes pontos. O teste lê daqui para
   provar que o polo fecha, o óstio fica patente e a face do corte senta
   no mesmo anel que o LatheGeometry — sem pixel e sem importar o three.
   ========================================================================== */

export function raioPerfilVentriculo(u, raio, pontudo = 1) {
  /* O VENTRÍCULO É CONE, NÃO OVO. Com expoente alto o perfil engorda no
     meio e a peça vira bola; a ponta tem de afinar de verdade, e ir ao
     eixo — senão o lathe deixa um furo na ponta. */
  const s = Math.sin(Math.PI * (.82 * u));
  if (s <= 0) return 0;
  let r = raio * Math.pow(s, .40 * pontudo)
    * (u < .12 ? .55 + u / .12 * .45 : 1);
  /* o teto aperta no vaso: um óstio largo deixa um cresce em volta do
     tubo, visível de lado mesmo com colar plano */
  if (u > 0.84) {
    const t = (u - 0.84) / 0.16;
    const s2 = t * t * (3 - 2 * t);
    const rVaso = Math.max(9.5, raio * 0.44);
    r = r * (1 - s2) + rVaso * s2;
  }
  return r;
}

export function perfilVentriculo(raio, altura, pontudo = 1) {
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const u = i / 20;
    pts.push({ x: raioPerfilVentriculo(u, raio, pontudo), y: u * altura });
  }
  return pts;
}

export function perfilAtrio(altura = 34, raio = 21) {
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const u = i / 14;
    /* óstio AV aberto em u=0; teto fechado no eixo em u=1 */
    pts.push({ x: raio * Math.sin(Math.PI * (.12 + .88 * u)), y: u * altura });
  }
  return pts;
}

export function perfilExterno(perfil, espessura) {
  return perfil.map((p, i, a) => {
    const ant = a[Math.max(0, i - 1)], pro = a[Math.min(a.length - 1, i + 1)];
    const tx = pro.x - ant.x, ty = pro.y - ant.y;
    const n = Math.hypot(tx, ty) || 1;
    return { x: p.x + ty / n * espessura, y: p.y - tx / n * espessura };
  });
}

export function prepararPerfis(perfilInterno, espessura) {
  const dentro = perfilInterno.map(p => ({ x: p.x, y: p.y }));
  const fora = perfilExterno(dentro, espessura);
  /* o offset da normal no polo deixa um furo no epicárdio; puxa-o ao eixo */
  if (dentro[0].x < 0.2) fora[0] = { x: 0, y: fora[0].y };
  const ultimo = dentro.length - 1;
  if (dentro[ultimo].x < 0.2) fora[ultimo] = { x: 0, y: fora[ultimo].y };
  return { dentro, fora };
}

/* LatheGeometry do three: (r·sin φ, y, r·cos φ). φ=0 cai em +Z. */
export function pontoNoLathe(r, y, angulo) {
  return { x: r * Math.sin(angulo), y, z: r * Math.cos(angulo) };
}

/* O anel plano do óstio, visto de lado, vira LINHA: o vão em cresce entre
   epicárdio e endocárdio. O lábio tem altura, e recolhe um pouco para dentro
   — o lúmen continua aberto (não vai ao eixo). */
export const LABIO_DY = 4.4;
export function perfilDoLabio(pDentro, pFora, dy = LABIO_DY) {
  /* o óstio já aperta no vaso; o lábio só arremata a espessura, sem
     ir ao eixo (senão tampa a cavidade) */
  const recolher = Math.max(8.2, pDentro.x - 2.4);
  return [
    { x: pDentro.x, y: pDentro.y },
    { x: recolher, y: pDentro.y + dy },
    { x: pFora.x, y: pFora.y + dy },
    { x: pFora.x, y: pFora.y },
  ];
}

/* Anel GORDO no teto: retângulo revolvido, de rLúmen até fora da parede.
   Colar/coroa de superfície, vistos de lado, viram linha e o cresce volta. */
export const TAMPO_DY = 10;
export function perfilDoTampo(pDentro, pFora, dy = TAMPO_DY) {
  if (pDentro.x < 5) return null;
  const r0 = Math.max(8, pDentro.x * 0.96);
  const r1 = pFora.x + 5;
  const y = (pDentro.y + pFora.y) / 2;
  return [
    { x: r0, y: y - 2 },
    { x: r1, y: y - 2 },
    { x: r1, y: y + dy },
    { x: r0, y: y + dy },
  ];
}

/* Colar da raiz: rBase tem de cobrir o vão em cresce entre o teto da câmara
   e o tubo. O lúmen do vaso (rTubo) continua patente.
   ySaida é o Y do teto no grupo dos vasos (teto da câmara − SUBIR_PLANO).
   Um t fixo no primeiro segmento punha o colar ACIMA do furo. */
export const JUNTAS_VASO = {
  aorta:    { rTubo: 12,   rBase: 32, ySaida: 60 },
  pulmonar: { rTubo: 10.5, rBase: 36, ySaida: 58 },
  cava:     { rTubo: 9.5,  rBase: 20, ySaida: 90 },
  cavaInf:  { rTubo: 10.5, rBase: 20, ySaida: 50 },
  veiaPulm: { rTubo: 4.6,  rBase: 12, ySaida: 66 },
};

export function pontoNoSegmento(p0, p1, t) {
  return [
    p0[0] + (p1[0] - p0[0]) * t,
    p0[1] + (p1[1] - p0[1]) * t,
    p0[2] + (p1[2] - p0[2]) * t,
  ];
}

/* Cruza o polígono no plano y do teto. Sem isso o colar flutua no ar e o
   cresce da foto — miocárdio cortando no vaso — continua no anel. */
export function saidaDaParede(pts, yPlano) {
  if (yPlano != null) {
    for (let i = 0; i < pts.length - 1; i++) {
      const y0 = pts[i][1], y1 = pts[i + 1][1];
      const dy = y1 - y0;
      if (Math.abs(dy) < 1e-6) continue;
      const t = (yPlano - y0) / dy;
      if (t >= -0.02 && t <= 1.02) {
        const tt = Math.min(1, Math.max(0, t));
        const p = pontoNoSegmento(pts[i], pts[i + 1], tt);
        const q = tt < 0.97 ? pts[i + 1] : (pts[i + 2] || pts[i + 1]);
        return { p, q, t: tt, i };
      }
    }
  }
  const p = pontoNoSegmento(pts[0], pts[1], 0.38);
  return { p, q: pts[1], t: 0.38, i: 0 };
}

export function verticesDaFaceDoCorte(dentro, fora, angulo) {
  const pos = [];
  for (let i = 0; i < dentro.length; i++) {
    const a = pontoNoLathe(dentro[i].x, dentro[i].y, angulo);
    const b = pontoNoLathe(fora[i].x, fora[i].y, angulo);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  return pos;
}

function medida({ dentro, fora }) {
  const n = dentro.length - 1;
  return {
    polo0Dentro: dentro[0].x,
    polo0Fora: fora[0].x,
    polo1Dentro: dentro[n].x,
    polo1Fora: fora[n].x,
    espessura0: Math.hypot(fora[0].x - dentro[0].x, fora[0].y - dentro[0].y),
    espessura1: Math.hypot(fora[n].x - dentro[n].x, fora[n].y - dentro[n].y),
    nIguais: dentro.length === fora.length,
  };
}

export function provaSelosDaParede({ alturaVE, alturaVD }) {
  const ve = prepararPerfis(perfilVentriculo(26, alturaVE), 10);
  const vd = prepararPerfis(perfilVentriculo(23, alturaVD, 1.15), 3.4);
  const ae = prepararPerfis(perfilAtrio(), 2.6);
  const t0 = Math.PI * .306;
  const face = verticesDaFaceDoCorte(ve.dentro, ve.fora, t0);
  const lathe = pontoNoLathe(ve.dentro[5].x, ve.dentro[5].y, t0);
  const noFace = { x: face[5 * 6], y: face[5 * 6 + 1], z: face[5 * 6 + 2] };
  const vaoAntigo = (() => {
    let melhor = ve.dentro[0];
    for (const p of ve.dentro) if (p.x > melhor.x) melhor = p;
    const r = melhor.x, phi = t0;
    const certa = pontoNoLathe(r, 0, phi);
    const errada = { x: r * Math.cos(phi), z: r * Math.sin(phi) };
    return Math.hypot(certa.x - errada.x, certa.z - errada.z);
  })();
  const labioVE = perfilDoLabio(ve.dentro[ve.dentro.length - 1], ve.fora[ve.fora.length - 1]);
  const ys = labioVE.map(p => p.y);
  const tampoVE = perfilDoTampo(ve.dentro[ve.dentro.length - 1], ve.fora[ve.fora.length - 1]);
  const tampoVD = perfilDoTampo(vd.dentro[vd.dentro.length - 1], vd.fora[vd.fora.length - 1]);
  const aortaPts = [[4, 56, -4], [5, 82, -2], [4, 104, 2]];
  const pulPts = [[-12, 50, 16], [-10, 80, 14], [-4, 98, 8]];
  const saidaAorta = saidaDaParede(aortaPts, JUNTAS_VASO.aorta.ySaida);
  const saidaPul = saidaDaParede(pulPts, JUNTAS_VASO.pulmonar.ySaida);
  const colarAntigoAorta = pontoNoSegmento(aortaPts[0], aortaPts[1], 0.38);
  return {
    ve: medida(ve),
    vd: medida(vd),
    ae: medida(ae),
    faceCoincideComLathe: Math.hypot(
      noFace.x - lathe.x, noFace.y - lathe.y, noFace.z - lathe.z) < 1e-9,
    vaoDaConvencaoAntigaMm: vaoAntigo,
    labioAltura: Math.max(...ys) - Math.min(...ys),
    labioNaoTampona: labioVE[1].x > 8,
    tampoLumenVE: tampoVE[0].x,
    tampoLumenVD: tampoVD[0].x,
    tampoCobreVE: tampoVE[1].x - ve.fora[ve.fora.length - 1].x,
    tampoAltura: Math.max(...tampoVE.map(p => p.y)) - Math.min(...tampoVE.map(p => p.y)),
    juntas: JUNTAS_VASO,
    saidaAortaY: saidaAorta.p[1],
    saidaPulY: saidaPul.p[1],
    colarAntigoAcimaDoOstioMm: Math.abs(colarAntigoAorta[1] - JUNTAS_VASO.aorta.ySaida),
  };
}
