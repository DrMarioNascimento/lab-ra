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
  return raio * Math.pow(s, .40 * pontudo)
    * (u < .12 ? .55 + u / .12 * .45 : 1);
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
export const LABIO_DY = 3.2;
export function perfilDoLabio(pDentro, pFora, dy = LABIO_DY) {
  const recolher = Math.max(pDentro.x * 0.58, pDentro.x - 7);
  return [
    { x: pDentro.x, y: pDentro.y },
    { x: recolher, y: pDentro.y + dy },
    { x: pFora.x, y: pFora.y + dy },
    { x: pFora.x, y: pFora.y },
  ];
}

/* Colar da raiz: rBase tem de cobrir o vão em cresce entre o teto da câmara
   e o tubo. O lúmen do vaso (rTubo) continua patente. */
export const JUNTAS_VASO = {
  aorta:    { rTubo: 12,   rBase: 23 },
  pulmonar: { rTubo: 10.5, rBase: 24 },
  cava:     { rTubo: 9.5,  rBase: 16 },
  cavaInf:  { rTubo: 10.5, rBase: 16 },
  veiaPulm: { rTubo: 4.6,  rBase: 9 },
};

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
  return {
    ve: medida(ve),
    vd: medida(vd),
    ae: medida(ae),
    faceCoincideComLathe: Math.hypot(
      noFace.x - lathe.x, noFace.y - lathe.y, noFace.z - lathe.z) < 1e-9,
    vaoDaConvencaoAntigaMm: vaoAntigo,
    labioAltura: Math.max(...ys) - Math.min(...ys),
    labioNaoTampona: labioVE[1].x > 8,
    juntas: JUNTAS_VASO,
  };
}
