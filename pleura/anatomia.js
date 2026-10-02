/* ============================================================================
   ANATOMIA DO TÓRAX · geometria compartilhada (metros, y para cima, +z é a
   frente). Lado DIREITO do paciente em x NEGATIVO: visto de frente, fica à
   esquerda de quem olha, como numa radiografia. Nada de DOM, nada de física.
   ========================================================================== */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const DIR = -1, ESQ = 1;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gauss = (v, c, s) => Math.exp(-(((v - c) / s) ** 2));
const lado = s => (s === DIR ? 'D' : 'E');

export const mk = (name, geo, mat) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.castShadow = m.receiveShadow = true; return m; };

// Agrupa por tecido para manter a anatomia detalhada leve no celular.
function compactar(g) {
  const buckets=new Map();g.updateMatrixWorld(true);
  for(const m of g.children) {
    if(!m.isMesh)continue;
    const geo=m.geometry.clone().applyMatrix4(m.matrix);geo.deleteAttribute('uv');
    if(!buckets.has(m.material))buckets.set(m.material,{geos:[],nomes:[]});
    buckets.get(m.material).geos.push(geo);buckets.get(m.material).nomes.push(m.name);
  }
  const children=[...g.children];g.clear();
  for(const [mat,{geos,nomes}] of buckets) {
    const m=mk(`${g.name}_${mat.name}`,mergeGeometries(geos),mat);m.userData.partes=nomes;g.add(m);
    geos.forEach(geo=>geo.dispose());
  }
  children.forEach(m=>{if(m.isMesh)m.geometry.dispose();else g.add(m)});
  return g;
}

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

/* Superfícies de tecido com variação suave, sem facetas ou esferas perfeitas.
   A deformação é determinística e permanece na geometria exportada para RA. */
export function tecidoGeo(rx, ry, rz, detalhe = .018) {
  const g = new THREE.SphereGeometry(1, 28, 20), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + detalhe * Math.sin(x * 8 + y * 5) * Math.sin(z * 7 - y * 4);
    p.setXYZ(i, x * rx * k, y * ry * k, z * rz * k);
  }
  g.computeVertexNormals(); return g;
}

/* Um fragmento curvo da parede costal, com espessura e faces de corte reais. */
export function fragmentoGeo(z0, z1, largura = 24, altura = 18, centroX = 0) {
  const p = [], idx = [], nx = 48, ny = 30;
  const curvatura = (x, y) => -.013 * x * x - .004 * y * y;
  for (const z of [z0, z1]) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const y = (j / ny - .5) * altura;
    const organic = .88 + .12 * Math.sin(Math.PI*j/ny)**.7;
    const x = (centroX + (i / nx - .5) * largura)*organic+.10*Math.sin(y*.53);
    p.push(x, y, z + curvatura(x, y));
  }
  const n = (nx + 1) * (ny + 1), at = (i, j) => j * (nx + 1) + i;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = at(i, j), b = a + 1, c = at(i, j + 1), d = c + 1;
    idx.push(a, c, b, b, c, d, a + n, b + n, c + n, b + n, d + n, c + n);
  }
  const borda = [];
  for (let i = 0; i <= nx; i++) borda.push(at(i, 0));
  for (let j = 1; j <= ny; j++) borda.push(at(nx, j));
  for (let i = nx - 1; i >= 0; i--) borda.push(at(i, ny));
  for (let j = ny - 1; j > 0; j--) borda.push(at(0, j));
  for (let i = 0; i < borda.length; i++) {
    const a = borda[i], b = borda[(i + 1) % borda.length];
    idx.push(a, b, a + n, b, b + n, a + n);
  }
  const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));g.setIndex(idx);g.computeVertexNormals();return g;
}

/* ── Coluna: C7, T1–T12, L1–L2 ──────────────────────────────────────────── */
export const yPost = j => 0.283 - j * 0.0205;     // altura posterior da costela j (0 = 1ª)
export function construirColuna(M) {
  const g = new THREE.Group(); g.name = 'coluna';
  const vertebras = [['C7', 0.3035, 0.012, 0.014]];
  for (let j = 0; j < 12; j++) vertebras.push([`T${j + 1}`, yPost(j), 0.013 + j * 0.0006, 0.0155+j*.00027]);
  vertebras.push(['L1', 0.0345, 0.0205, 0.0195], ['L2', 0.0105, 0.021, 0.02]);
  for (let v=0;v<vertebras.length;v++) {
    const [n, y, r, h] = vertebras[v];
    const z = zS(y);
    const rings = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, cintura = 1 - .10 * Math.sin(Math.PI * t), ring = [];
      for (let k = 0; k < 32; k++) {
        const a = k / 32 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
        ring.push(V(Math.sign(c) * Math.abs(c) ** .65 * r * cintura, (t - .5) * h,
          Math.sign(sn) * Math.abs(sn) ** .75 * r * .82 * cintura));
      }
      rings.push(ring);
    }
    const corpo = mk(`corpo_${n}`, loft(rings), M.osso); corpo.position.set(0, y, z);
    if(v+1<vertebras.length) {
      const [,yn,rn,hn]=vertebras[v+1],superior=y-h/2,inferior=yn+hn/2;
      const discos=[];
      for(let k=0;k<=6;k++) {
        const t=k/6,yy=inferior+(superior-inferior)*t,rr=(rn+(r-rn)*t)*(.96+.035*Math.sin(Math.PI*t));
        discos.push(Array.from({length:32},(_,a)=>{const th=a/32*Math.PI*2;return V(Math.sign(Math.cos(th))*Math.abs(Math.cos(th))**.65*rr,yy,zS(yy)+Math.sign(Math.sin(th))*Math.abs(Math.sin(th))**.75*rr*.82);}));
      }
      g.add(mk(`disco_${n}_${vertebras[v+1][0]}`,loft(discos),M.disco));
    }
    const arco = mk(`arco_${n}`, new THREE.TorusGeometry(0.011, 0.0032, 8, 18, Math.PI), M.osso);
    arco.rotation.x = Math.PI / 2; arco.rotation.z = Math.PI; arco.position.set(0, y, z - r * .55);
    const esp = mk(`espinhosa_${n}`, tuboGeo([V(0,y,z-r*.8),V(0,y-.007,z-r-.010),V(0,y-.017,z-r-.021)], .003, 16), M.osso);
    const tpE = mk(`transverso_E_${n}`, new THREE.CylinderGeometry(0.0032, 0.0042, 0.026, 10), M.osso);
    tpE.rotation.z = Math.PI / 2; tpE.rotation.y = -0.35; tpE.position.set(0.016, y, z - r * .55 - 0.004);
    const tpD = tpE.clone(); tpD.name = `transverso_D_${n}`; tpD.rotation.y = 0.35; tpD.position.x = -0.016;
    g.add(corpo, arco, esp, tpE, tpD);
  }
  return compactar(g);
}

/* ── Caixa torácica: costelas em fita, cartilagens, esterno, clavículas ──── */
const ESTERNAL = [0.268, 0.246, 0.224, 0.202, 0.182, 0.164, 0.148];   // onde 1–7 chegam ao esterno
const MARGEM = [[0.045, 0.138], [0.075, 0.116], [0.1, 0.092]];        // 8–10 na margem costal
const DIP = [0.004, 0.009, 0.015, 0.021, 0.027, 0.033, 0.038, 0.044, 0.046, 0.04];
const ESTERNO = [[.118,.0015],[.128,.004],[.142,.009],[.16,.010],[.18,.012],[.20,.012],[.22,.014],[.236,.013],[.244,.013],[.251,.014],[.268,.020],[.279,.023],[.287,.019]];
const larguraEsterno=tabela(ESTERNO);
const insercaoEsternal=(s,y)=>V(s*(larguraEsterno(y)-.0012),y,dT(y)-.0055);
// Margem cartilaginosa contínua: 8–10 encontram a cartilagem acima,
// que finalmente alcança a 7ª inserção no esterno.
const arcoCostal=s=>[insercaoEsternal(s,ESTERNAL[6]),...MARGEM.map(([x,y])=>V(s*x,y,dT(y)*Math.sqrt(1-(x/wT(y))**2)))];
function costela(g, M, s, j) {
  const yP = yPost(j), flutuante = j >= 10;
  let xEnd, yA;
  if (j < 7) { yA = ESTERNAL[j]; xEnd = larguraEsterno(yA)-.0012; }
  else if (j < 10) { [xEnd, yA] = MARGEM[j - 7]; }
  else { yA = yP - (j === 10 ? 0.03 : 0.018); }
  const theta1 = flutuante ? (j === 10 ? 0.46 : 0.31) * Math.PI : Math.PI - Math.asin(xEnd / wT(yA));
  const theta0 = Math.asin(0.03 / wT(yP)) + 0.15;
  const tj = flutuante ? 1 : 0.88 - j * 0.018;
  const dip = flutuante ? 0 : DIP[j];
  const rv=.013+j*.0006;
  const pts = [V(s*rv*.93,yP,zS(yP)-.002),V(s*.028,yP-.001,zS(yP)-rv*.55-.004)];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, th = theta0 + (theta1 - theta0) * t;
    const y = yP + (yA - yP) * Math.pow(t, 1.35) - dip * gauss(t, tj, 0.2);
    pts.push(V(s * wT(y) * Math.sin(th), y, -dT(y) * Math.cos(th)));
  }
  if(j<7)pts[pts.length-1]=insercaoEsternal(s,yA);
  else if(!flutuante)pts[pts.length-1]=arcoCostal(s)[j-6].clone();
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const hb = j === 0 ? 0.0034 : j === 1 ? 0.0046 : flutuante ? 0.0028 : 0.0046;
  const wb = j === 0 ? 0.0068 : j === 1 ? 0.0038 : flutuante ? 0.0026 : 0.0029;
  const perfil = t => { const k = flutuante ? .10+.90*Math.pow(1-t,.65) : 1; const q = 0.6 + 0.4 * Math.pow(Math.sin(Math.PI * clamp(t / tj, 0, 1)), .4); return { h: hb * q * k, w: wb * (0.8 + 0.2 * q) * k }; };
  // A frente direita fica translúcida, mantendo todas as articulações.
  // Os segmentos posteriores continuam opacos para delimitar o pulmão.
  const janela=s===DIR&&j>=2&&j<=7;
  const janelaOsso=M.ossoJanela||M.osso,janelaCart=M.cartilagemJanela||M.cartilagem;
  const corte=janela?Math.min(.60,tj):tj;
  g.add(mk(`costela_${lado(s)}_${j+1}_posterior`,fita(curva,0,corte,perfil,48),M.osso));
  if(janela)g.add(mk(`costela_${lado(s)}_${j+1}_anterior`,fita(curva,corte,tj,perfil,24),janelaOsso));
  if (!flutuante) g.add(mk(`cartilagem_${lado(s)}_${j + 1}`, fita(curva, tj - 0.01, 1, () => ({ h: 0.0038, w: 0.0030 }), 28), janela?janelaCart:M.cartilagem));
}
export function construirCaixa(M) {
  const g = new THREE.Group(); g.name = 'caixa_toracica';
  for (let j = 0; j < 12; j++) { costela(g, M, DIR, j); costela(g, M, ESQ, j); }
  for(const s of [DIR,ESQ])g.add(mk(`margem_costal_${lado(s)}`,tuboGeo(arcoCostal(s),.0033,48),M.cartilagem));
  const perfil = [...ESTERNO].reverse();
  const rings = perfil.map(([y, hw]) => {
    const z0 = dT(y) - 0.0055, r = [];
    for (let j = 0; j < 20; j++) {
      const a = j / 20 * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      r.push(V(Math.sign(c) * Math.pow(Math.abs(c), .65) * hw, y, z0 + Math.sign(sn) * Math.pow(Math.abs(sn), .65) * 0.0038));
    }
    return r;
  });
  g.add(mk('esterno', loft(rings), M.osso));
  for (const s of [DIR, ESQ]) {
    const raiz=insercaoEsternal(s,.283);
    g.add(mk(`articulacao_esternoclavicular_${lado(s)}`,tecidoGeo(.0045,.005,.0045),M.cartilagem));
    g.children[g.children.length-1].position.copy(raiz);
    g.add(mk(`clavicula_${lado(s)}`,tuboGeo([raiz,V(s*.041,.288,.052),V(s*.072,.291,.052),V(s*.101,.292,.038),V(s*.128,.285,.028)],.0043,40),M.osso));
  }
  return compactar(g);
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
  const grupo = new THREE.Group(); grupo.name = 'diafragma';
  grupo.add(mk('musculo_diafragmatico', loft(rings, [true, false]), M.diafragma));
  const tendon = [];
  for (let i = 1; i <= 14; i++) {
    const r = [], rho = i / 14;
    for (let j = 0; j < 64; j++) {
      const t = j / 64 * Math.PI * 2, x = rho * .051 * Math.sin(t), z = .006 + rho * .032 * Math.cos(t);
      r.push(V(x, yDiafragma(x,z)+.0006,z));
    }
    tendon.push(r);
  }
  grupo.add(mk('tendao_central', loft(tendon,[true,false]), M.tendao || M.cartilagem));
  for (let j = 0; j < 32; j++) {
    const t = j / 32 * Math.PI * 2, pts = [];
    for (let i = 0; i <= 12; i++) {
      const r = .46 + i / 12 * .52, x = r * W_r * Math.sin(t), z = ZD-r*D_r*Math.cos(t);
      pts.push(V(x,yDiafragma(x,z)+.0009,z));
    }
    grupo.add(mk(`fibra_diafragma_${j}`,tuboGeo(pts,.00038,20),M.fibra || M.diafragma));
  }
  return compactar(grupo);
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
  const yApex = (s === DIR ? 0.306 : 0.299) + inflate, K = 96, NB = 14, NW = 76, ZC = -0.008;
  const med = medias(s);
  const ponto = (y, phi, R) => {
    const m = med(y), a = Math.max(0.004, (wIn(y) - m) / 2 + inflate), xc = m + a - inflate;
    const dI = dIn(y) + inflate, bAnt = dI * .74, bPost = dI * .92;
    const c = Math.cos(phi), sn = Math.sin(phi), nx = c > 0 ? 2 : 3.4;
    let px = Math.sign(c) * Math.pow(Math.abs(c), 2 / nx) * a * R;
    let pz = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / 2.3) * (sn > 0 ? bAnt : bPost) * R;
    if (s === ESQ) px += 0.022 * gauss(y, 0.172, 0.03) * clamp((sn - .2) / .6, 0, 1) * clamp(-c * 1.5, 0, 1) * R;
    // A parede costal é elíptica, não um retângulo arredondado. Restringe
    // a face posterior/lateral e reserva espaço para corpos vertebrais.
    const x=s*(xc+px),w=wT(y)-.007+inflate,d=dT(y)-.007+inflate;
    const alcance=d*Math.sqrt(Math.max(.002,1-(x/w)**2));
    const posterior=Math.max(-alcance+.002,zS(y)+.016*gauss(x,0,.029));
    const z=clamp(ZC+pz,posterior,alcance-.002);
    pz=z-ZC;
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
    const R = v < .62 ? 1 : Math.sqrt(Math.max(0, 1 - ((v - .62) / .38) ** 2));
    for (let j = 0; j < K; j++) {
      const y = yBase[j] + (yApex - yBase[j]) * v;
      const p = ponto(y, j / K * Math.PI * 2, R);
      let x = p.x, z = p.z;
      if (fissuras && R > .3) {
        const f = (y - 0.18) + 0.8 * (z - ZC);
        let g = gauss(f, 0, 0.0025);
        if (s === DIR && f > 0.004 && z > -.025) g = Math.max(g, gauss(y, 0.207, 0.0022));
        const k = 1 - 0.045 * g;
        x = p.xc + (x - p.xc) * k; z = ZC + (z - ZC) * k;
      }
      r.push(V(x, y, z));
    }
    rings.push(r);
  }
  const geo = loft(rings), pos = geo.attributes.position, colors = [];
  for (let i=0;i<pos.count;i++) {
    const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
    const grain = .93 + .055*Math.sin(x*680+y*410)*Math.sin(z*720-y*370);
    const fissure = fissuras ? gauss((y-.18)+.8*(z-ZC),0,.002) : 0;
    const inferior=(y-.18)+.8*(z-ZC)<0;
    const medio=s===DIR&&!inferior&&y<.207&&z>-.025;
    colors.push((grain-.17*fissure)*(inferior?.87:1),(grain-.22*fissure)*(medio?.88:1),(grain-.19*fissure)*(inferior?1:medio?.94:.98));
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  return geo;
}

/* ── Mediastino: traqueia anelada, brônquios, coração, aorta, cava, tronco pulmonar ── */
let matrizCardiaca,carregamentoCardiaco;
export function carregarCoracao() {
  if(!carregamentoCardiaco)carregamentoCardiaco=new GLTFLoader().loadAsync(
    new URL('../bancadas/11-coracao/fontes/scan/A-scan-realista.glb',import.meta.url).href
  ).then(({scene})=>{
    scene.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(scene),centro=bb.getCenter(new THREE.Vector3());
    const escala=.105/bb.getSize(new THREE.Vector3()).y;
    const g=new THREE.Group();g.name='coracao_scan_prototipo';
    scene.traverse(o=>{
      if(!o.isMesh)return;
      const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);
      geo.translate(-centro.x,-centro.y,-centro.z);geo.scale(escala,escala,escala);
      const mat=o.material.clone();
      // Mesmo acabamento da Vista Externa do protótipo; textura preservada.
      mat.roughnessMap=null;mat.metalness=0;mat.roughness=.55;
      mat.emissive=new THREE.Color('#a8494a');mat.emissiveIntensity=.16;
      mat.userData={};
      g.add(mk('coracao_scan_realista',geo,mat));
    });
    g.position.set(.012,.207,.018);
    // Assenta a face diafragmática sem atravessar a cúpula.
    let elevar=0;
    for(const m of g.children){const p=m.geometry.attributes.position;
      for(let i=0;i<p.count;i++){
        const x=p.getX(i)+g.position.x,y=p.getY(i)+g.position.y,z=p.getZ(i)+g.position.z;
        elevar=Math.max(elevar,yDiafragma(x,z)+.001-y);
      }
    }
    g.position.y+=elevar;
    matrizCardiaca=g;return g;
  });
  return carregamentoCardiaco;
}
function coracaoDoRepositorio() {
  return matrizCardiaca?matrizCardiaca.clone():new THREE.Group();
}
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
  const coracao=coracaoDoRepositorio();
  g.add(coracao);
  return g;
}

/* Amostras dentro da MESMA superfície pulmonar usada nos níveis macroscópicos.
   O centro vem da secção real; a margem limita os exemplos ampliados. */
const amostras = new Map();
export function amostraPulmao(s,f) {
  if(!amostras.has(s)) {
    const geo=geoPulmao(s),mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
    geo.computeBoundingBox();amostras.set(s,{geo,mesh,cache:new Map()});
  }
  const {geo,mesh,cache}=amostras.get(s);
  if(cache.has(f))return cache.get(f);
  const p=geo.attributes.position,idx=geo.index;
  const bb=geo.boundingBox,y=bb.min.y+(bb.max.y-bb.min.y)*(.23+.61*f),pts=[];
  for(let i=0;i<idx.count;i+=3) for(let j=0;j<3;j++) {
    const a=idx.getX(i+j),b=idx.getX(i+(j+1)%3),ya=p.getY(a),yb=p.getY(b);
    if((ya<y)===(yb<y))continue;
    const t=(y-ya)/(yb-ya);pts.push(V(p.getX(a)+(p.getX(b)-p.getX(a))*t,y,p.getZ(a)+(p.getZ(b)-p.getZ(a))*t));
  }
  const c=V(0,y,0);for(const p of pts){c.x+=p.x;c.z+=p.z;}c.x/=pts.length;c.z/=pts.length;
  const ray=new THREE.Raycaster();
  const span=(from,d,axis)=>{ray.set(from,d);const h=ray.intersectObject(mesh);return [h[0].point.getComponent(axis),h[h.length-1].point.getComponent(axis)];};
  const xs=span(V(-1,y,c.z),V(1,0,0),0);c.x=(xs[0]+xs[1])/2;
  const zs=span(V(c.x,y,-1),V(0,0,1),2);c.z=(zs[0]+zs[1])/2;
  const tri=new THREE.Triangle(),near=new THREE.Vector3();let folga=Infinity;
  for(let i=0;i<idx.count;i+=3) {
    tri.a.fromBufferAttribute(p,idx.getX(i));tri.b.fromBufferAttribute(p,idx.getX(i+1));tri.c.fromBufferAttribute(p,idx.getX(i+2));
    tri.closestPointToPoint(c,near);folga=Math.min(folga,c.distanceTo(near));
  }
  const result={centro:c,rx:(xs[1]-xs[0])/2,rz:(zs[1]-zs[0])/2,folga};cache.set(f,result);return result;
}

export function unidadeAcinar(M,r=.01) {
  const g=new THREE.Group();g.name='unidade_acinar';
  g.add(mk('ducto_alveolar',tuboGeo([V(0,r*.72,-r*.1),V(0,r*.18,0),V(0,-r*.65,0)],r*.12,16),M.traqueia));
  const centers=[V(-.40,.36,0),V(.40,.36,0),V(-.48,-.20,0),V(.48,-.20,0),V(0,-.65,0)];
  centers.forEach((c,i)=>{
    c.multiplyScalar(r);
    g.add(mk(`saco_alveolar_${i}`,tecidoGeo(r*.36,r*.39,r*.30,.055),M.alveolo));g.children[g.children.length-1].position.copy(c);
    g.add(mk(`abertura_alveolar_${i}`,tuboGeo([V(0,c.y,0),c],r*.10,12),M.traqueia));
  });
  return compactar(g);
}

/* Rede ramificada, com anastomoses; não uma barra atravessando o órgão. */
export function redeCapilar(rx,rz) {
  const geos=[],r=Math.min(.00065,rx*.045),dy=rx*.060;
  for(let row=-2;row<=2;row++) {
    const pts=[];
    for(let i=0;i<=22;i++) {const u=i/22*2-1;pts.push(V(u*rx,row*dy+Math.sin(u*Math.PI*3+row)*rx*.025,Math.sin(u*Math.PI)*rz*.32));}
    geos.push(tuboGeo(pts,r,30));
  }
  for(let j=-3;j<=3;j++) {
    const pts=[];
    for(let i=0;i<=8;i++) {const v=i/8*2-1;pts.push(V(j/3*rx*.88+Math.sin(v*Math.PI)*rx*.045,v*dy*2,Math.sin((j/3)*Math.PI)*rz*.32));}
    geos.push(tuboGeo(pts,r*.74,16));
  }
  // Concatena as malhas sem dependência extra, preservando normais e índices.
  const p=[],n=[],idx=[];
  for(const geo of geos){const off=p.length/3;p.push(...geo.attributes.position.array);n.push(...geo.attributes.normal.array);idx.push(...Array.from(geo.index.array,i=>i+off));geo.dispose();}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));geo.setIndex(idx);return geo;
}
