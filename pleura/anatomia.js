/* ============================================================================
   ANATOMIA DO TÓRAX · geometria compartilhada (metros, y para cima, +z é a
   frente). Lado DIREITO do paciente em x NEGATIVO: visto de frente, fica à
   esquerda de quem olha, como numa radiografia. Nada de DOM, nada de física.
   ========================================================================== */
import * as THREE from 'three';

export const DIR = -1, ESQ = 1;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gauss = (v, c, s) => Math.exp(-(((v - c) / s) ** 2));
const lado = s => (s === DIR ? 'D' : 'E');

export const mk = (name, geo, mat) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.castShadow = m.receiveShadow = true; return m; };

/* ── O envelope do tórax: meia-largura e meio-fundo por altura ─────────── */
const tabela = pts => y => {
  if (y <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [y0, v0] = pts[i], [y1, v1] = pts[i + 1];
    if (y <= y1) { const k = (1 - Math.cos(Math.PI * (y - y0) / (y1 - y0))) / 2; return v0 + (v1 - v0) * k; }
  }
  return pts[pts.length - 1][1];
};
export const wT = tabela([[0, .122], [.09, .14], [.18, .128], [.25, .095], [.30, .055], [.34, .045]]);
export const dT = tabela([[0, .094], [.09, .10], [.18, .094], [.25, .072], [.30, .042], [.34, .035]]);
export const wIn = y => wT(y) - .012, dIn = y => dT(y) - .012;
export const zS = y => -dT(y) * .80;            // o corpo vertebral invade o tórax por trás

/* ── Loft: anéis de pontos → superfície, orientada para fora quando fechada ── */
export function loft(rings, caps = [true, true]) {
  const n = rings.length, k = rings[0].length, pos = [], idx = [];
  for (const r of rings) for (const p of r) pos.push(p.x, p.y, p.z);
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < k; j++) {
    const a = i * k + j, b = i * k + (j + 1) % k;
    idx.push(a, b, a + k, b, b + k, a + k);
  }
  let base = n * k;
  const centro = r => { const c = new THREE.Vector3(); r.forEach(p => c.add(p)); return c.multiplyScalar(1 / r.length); };
  if (caps[0]) { const c = centro(rings[0]); pos.push(c.x, c.y, c.z); for (let j = 0; j < k; j++) idx.push(base, (j + 1) % k, j); base++; }
  if (caps[1]) { const c = centro(rings[n - 1]); pos.push(c.x, c.y, c.z); const o = (n - 1) * k; for (let j = 0; j < k; j++) idx.push(base, o + j, o + (j + 1) % k); base++; }
  if (caps[0] && caps[1]) {
    let vol = 0; const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    for (let i = 0; i < idx.length; i += 3) { A.fromArray(pos, idx[i] * 3); B.fromArray(pos, idx[i + 1] * 3); C.fromArray(pos, idx[i + 2] * 3); vol += A.dot(B.cross(C)); }
    if (vol < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* fita varrida ao longo de uma curva, seção elíptica alinhada à parede torácica */
function fita(curve, t0, t1, perfil, n = 40, k = 12) {
  const rings = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + (t1 - t0) * i / n;
    const p = curve.getPointAt(t), T = curve.getTangentAt(t);
    const N = V(p.x, 0, p.z).normalize(); N.addScaledVector(T, -N.dot(T)).normalize();
    const B = new THREE.Vector3().crossVectors(T, N);
    const { h, w } = perfil(t), r = [];
    for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2; r.push(p.clone().addScaledVector(N, w * Math.cos(a)).addScaledVector(B, h * Math.sin(a))); }
    rings.push(r);
  }
  return loft(rings);
}
export const tuboGeo = (pts, r, seg = 24) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 14, false);

/* ── Coluna: C7, T1–T12, L1–L2 ──────────────────────────────────────────── */
export const yPost = j => 0.283 - j * 0.0205;     // altura posterior da costela j (0 = 1ª)
export function construirColuna(M) {
  const g = new THREE.Group(); g.name = 'coluna';
  const vertebras = [['C7', 0.3035, 0.012, 0.014]];
  for (let j = 0; j < 12; j++) vertebras.push([`T${j + 1}`, yPost(j), 0.013 + j * 0.0006, 0.016]);
  vertebras.push(['L1', 0.025, 0.0205, 0.02], ['L2', 0.0015, 0.021, 0.02]);
  for (const [n, y, r, h] of vertebras) {
    const z = zS(y);
    const corpo = mk(`corpo_${n}`, new THREE.CylinderGeometry(r, r * 1.04, h, 24), M.osso);
    corpo.geometry.scale(1, 1, .86); corpo.position.set(0, y, z);
    const disco = mk(`disco_${n}`, new THREE.CylinderGeometry(r * .96, r * .96, 0.0045, 24), M.disco);
    disco.geometry.scale(1, 1, .86); disco.position.set(0, y - h / 2 - 0.0022, z);
    const arco = mk(`arco_${n}`, new THREE.TorusGeometry(0.011, 0.0032, 8, 18, Math.PI), M.osso);
    arco.rotation.x = Math.PI / 2; arco.rotation.z = Math.PI; arco.position.set(0, y, z - r * .55);
    const esp = mk(`espinhosa_${n}`, new THREE.CylinderGeometry(0.0022, 0.0038, 0.03, 10), M.osso);
    esp.rotation.x = 1.05; esp.position.set(0, y - 0.011, z - r * .55 - 0.022);
    const tpE = mk(`transverso_E_${n}`, new THREE.CylinderGeometry(0.0032, 0.0042, 0.026, 10), M.osso);
    tpE.rotation.z = Math.PI / 2; tpE.rotation.y = -0.35; tpE.position.set(0.016, y, z - r * .55 - 0.004);
    const tpD = tpE.clone(); tpD.name = `transverso_D_${n}`; tpD.rotation.y = 0.35; tpD.position.x = -0.016;
    g.add(corpo, disco, arco, esp, tpE, tpD);
  }
  return g;
}

/* ── Caixa torácica: costelas em fita, cartilagens, esterno, clavículas ──── */
const ESTERNAL = [0.268, 0.246, 0.224, 0.202, 0.182, 0.164, 0.148];   // onde 1–7 chegam ao esterno
const MARGEM = [[0.045, 0.138], [0.075, 0.116], [0.1, 0.092]];        // 8–10 na margem costal
const DIP = [0.004, 0.009, 0.015, 0.021, 0.027, 0.033, 0.038, 0.044, 0.046, 0.04];
function costela(g, M, s, j) {
  const yP = yPost(j), flutuante = j >= 10;
  let xEnd, yA;
  if (j < 7) { yA = ESTERNAL[j]; xEnd = 0.019; }
  else if (j < 10) { [xEnd, yA] = MARGEM[j - 7]; }
  else { yA = yP - (j === 10 ? 0.03 : 0.018); }
  const theta1 = flutuante ? (j === 10 ? 0.58 : 0.42) * Math.PI : Math.PI - Math.asin(xEnd / wT(yA));
  const theta0 = Math.asin(0.03 / wT(yP)) + 0.15;
  const tj = flutuante ? 1 : 0.88 - j * 0.018;
  const dip = flutuante ? 0 : DIP[j];
  const pts = [V(s * 0.028, yP, zS(yP) - 0.007)];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, th = theta0 + (theta1 - theta0) * t;
    const y = yP + (yA - yP) * Math.pow(t, 1.35) - dip * gauss(t, tj, 0.2);
    pts.push(V(s * wT(y) * Math.sin(th), y, -dT(y) * Math.cos(th)));
  }
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const hb = j === 0 ? 0.0038 : j === 1 ? 0.006 : flutuante ? 0.0048 : 0.0072;
  const wb = j === 0 ? 0.0068 : j === 1 ? 0.0038 : flutuante ? 0.0026 : 0.0029;
  const perfil = t => { const k = flutuante ? Math.pow(1 - t * .999, .3) : 1; const q = 0.6 + 0.4 * Math.pow(Math.sin(Math.PI * clamp(t / tj, 0, 1)), .4); return { h: hb * q * k, w: wb * (0.8 + 0.2 * q) * k }; };
  g.add(mk(`costela_${lado(s)}_${j + 1}`, fita(curva, 0, tj, perfil, flutuante ? 30 : 44), M.osso));
  if (!flutuante) g.add(mk(`cartilagem_${lado(s)}_${j + 1}`, fita(curva, tj - 0.01, 1, () => ({ h: 0.0052, w: 0.0036 }), 16), M.cartilagem));
}
export function construirCaixa(M) {
  const g = new THREE.Group(); g.name = 'caixa_toracica';
  for (let j = 0; j < 12; j++) { costela(g, M, DIR, j); costela(g, M, ESQ, j); }
  const perfil = [[0.287, 0.026], [0.272, 0.024], [0.248, 0.017], [0.236, 0.015], [0.2, 0.014], [0.16, 0.013], [0.142, 0.011], [0.128, 0.007], [0.112, 0.003]];
  const rings = perfil.map(([y, hw]) => {
    const z0 = dT(y) - 0.0055, r = [];
    for (let j = 0; j < 20; j++) {
      const a = j / 20 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      r.push(V(Math.sign(c) * Math.pow(Math.abs(c), .5) * hw, y, z0 + Math.sign(sn) * Math.pow(Math.abs(sn), .5) * 0.0055));
    }
    return r;
  });
  g.add(mk('esterno', loft(rings), M.osso));
  for (const s of [DIR, ESQ]) g.add(mk(`clavicula_${lado(s)}`, tuboGeo([V(s * 0.028, 0.286, 0.038), V(s * 0.065, 0.292, 0.047), V(s * 0.105, 0.296, 0.034), V(s * 0.138, 0.3, 0.01)], 0.0058), M.osso));
  return g;
}

/* ── Diafragma: duas cúpulas, a direita mais alta (fígado); rebordo baixo
   atrás, alto na frente ───────────────────────────────────────────────── */
const W_r = 0.128, D_r = 0.088, ZD = -0.004;
const apexY = x => 0.12 + 0.055 * gauss(x, DIR * 0.055, 0.06) + 0.045 * gauss(x, ESQ * 0.06, 0.06);
export function yDiafragma(x, z) {
  const zz = z - ZD; let rho = Math.hypot(x / W_r, zz / D_r);
  const cosT = rho > 1e-6 ? clamp(-zz / (rho * D_r), -1, 1) : 0;
  rho = Math.min(1, rho);
  const rim = 0.045 + 0.085 * (1 - cosT) / 2;
  return rim + (apexY(x) - rim) * (1 - Math.pow(rho, 2.6));
}
export function construirDiafragma(M) {
  const rings = [];
  for (let i = 1; i <= 24; i++) {
    const rho = i / 24, r = [];
    for (let j = 0; j < 72; j++) {
      const th = j / 72 * Math.PI * 2, x = rho * W_r * Math.sin(th), z = ZD - rho * D_r * Math.cos(th);
      r.push(V(x, yDiafragma(x, z), z));
    }
    rings.push(r);
  }
  return mk('diafragma', loft(rings, [true, false]), M.diafragma);
}

/* ── Pulmão: superfície paramétrica — base côncava sobre o diafragma, face
   costal seguindo as costelas, face mediastinal plana, ápice arredondado,
   fissura oblíqua (e horizontal à direita), chanfradura cardíaca à esquerda ── */
export const HILO = s => V(s * 0.03, 0.21, -0.012);
const medias = s => y => 0.02 + (s === ESQ ? 0.03 : 0.016) * gauss(y, 0.195, 0.045);
/* meia-largura e centro x do pulmão numa altura: serve às faixas do nível 05 */
export function secaoPulmao(s, y) {
  const m = medias(s)(y), a = Math.max(0.004, (wIn(y) - m) / 2);
  return { xc: s * (m + a), a };
}
export function geoPulmao(s, { inflate = 0, fissuras = true, assoalho = 0.012 } = {}) {
  const yApex = (s === DIR ? 0.306 : 0.299) + inflate, K = 80, NB = 10, NW = 50, ZC = -0.008;
  const med = medias(s);
  const ponto = (y, phi, R) => {
    const m = med(y), a = Math.max(0.004, (wIn(y) - m) / 2 + inflate), xc = m + a - inflate;
    const dI = dIn(y) + inflate, bAnt = dI * .74, bPost = dI * .92;
    const c = Math.cos(phi), sn = Math.sin(phi), nx = c > 0 ? 2 : 3.4;
    let px = Math.sign(c) * Math.pow(Math.abs(c), 2 / nx) * a * R;
    const pz = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / 2.3) * (sn > 0 ? bAnt : bPost) * R;
    if (s === ESQ) px += 0.022 * gauss(y, 0.172, 0.03) * clamp((sn - .2) / .6, 0, 1) * clamp(-c * 1.5, 0, 1) * R;
    return { x: s * (xc + px), z: ZC + pz, xc: s * xc, pz };
  };
  const yBase = [];
  for (let j = 0; j < K; j++) {
    const phi = j / K * Math.PI * 2; let y = 0.1;
    for (let it = 0; it < 3; it++) { const p = ponto(y, phi, 1); y = yDiafragma(p.x, p.z) + assoalho; }
    yBase.push(y);
  }
  const rings = [];
  for (let i = 1; i <= NB; i++) {
    const rho = i / NB, r = [];
    for (let j = 0; j < K; j++) {
      const per = ponto(yBase[j], j / K * Math.PI * 2, 1);
      const x = per.xc + (per.x - per.xc) * rho, z = ZC + per.pz * rho;
      r.push(V(x, yDiafragma(x, z) + assoalho, z));
    }
    rings.push(r);
  }
  for (let i = 1; i < NW; i++) {
    const v = i / NW, r = [];
    const R = v < .7 ? 1 : Math.sqrt(Math.max(0, 1 - ((v - .7) / .3) ** 2));
    for (let j = 0; j < K; j++) {
      const y = yBase[j] + (yApex - yBase[j]) * v;
      const p = ponto(y, j / K * Math.PI * 2, R);
      let x = p.x, z = p.z;
      if (fissuras && R > .3) {
        const f = (y - 0.18) + 0.8 * (z - ZC);
        let g = gauss(f, 0, 0.009);
        if (s === DIR && f > 0.012) g = Math.max(g, gauss(y, 0.2, 0.008));
        const k = 1 - 0.11 * g;
        x = p.xc + (x - p.xc) * k; z = ZC + (z - ZC) * k;
      }
      r.push(V(x, y, z));
    }
    rings.push(r);
  }
  return loft(rings);
}

/* ── Mediastino: traqueia anelada, brônquios, coração, aorta, cava, tronco pulmonar ── */
export function construirMediastino(M) {
  const g = new THREE.Group(); g.name = 'mediastino';
  g.add(mk('traqueia', tuboGeo([V(0, 0.345, -0.004), V(0, 0.29, -0.009), V(0, 0.24, -0.014)], 0.0085, 12), M.traqueia));
  for (let i = 0; i < 11; i++) {
    const y = 0.252 + i * 0.0085;
    const anel = mk(`anel_traqueal_${i + 1}`, new THREE.TorusGeometry(0.0088, 0.0014, 8, 24, Math.PI * 1.5), M.cartilagem);
    anel.rotation.x = Math.PI / 2; anel.rotation.z = Math.PI * .75; anel.position.set(0, y, -0.004 - (0.345 - y) / 0.105 * 0.01);
    g.add(anel);
  }
  /* o brônquio direito é mais largo e mais vertical */
  g.add(mk('bronquio_D', tuboGeo([V(0, 0.242, -0.014), V(DIR * 0.018, 0.228, -0.013), V(DIR * 0.042, 0.212, -0.01)], 0.0066, 12), M.traqueia));
  g.add(mk('bronquio_E', tuboGeo([V(0, 0.242, -0.014), V(ESQ * 0.022, 0.232, -0.014), V(ESQ * 0.05, 0.218, -0.012)], 0.0058, 12), M.traqueia));
  const cg = new THREE.SphereGeometry(1, 48, 36); cg.scale(0.043, 0.056, 0.04);
  const c = mk('coracao', cg, M.coracao); c.position.set(ESQ * 0.012, 0.192, 0.024); c.rotation.set(-0.3, 0, ESQ * 0.5);
  g.add(c);
  g.add(mk('aorta', tuboGeo([V(DIR * 0.012, 0.232, 0.022), V(DIR * 0.014, 0.256, 0.014), V(ESQ * 0.02, 0.267, -0.002), V(ESQ * 0.034, 0.255, -0.028), V(ESQ * 0.03, 0.22, -0.046), V(ESQ * 0.024, 0.16, -0.05), V(ESQ * 0.02, 0.105, -0.052)], 0.0105, 40), M.arteria));
  g.add(mk('veia_cava_superior', tuboGeo([V(DIR * 0.024, 0.215, 0.016), V(DIR * 0.024, 0.272, 0.008)], 0.0082, 8), M.veia));
  g.add(mk('tronco_pulmonar', tuboGeo([V(ESQ * 0.006, 0.222, 0.036), V(ESQ * 0.024, 0.244, 0.022), V(ESQ * 0.036, 0.246, 0.0)], 0.0088, 12), M.veia));
  return g;
}
