// Personagens 3D em estilo miniatura — mesmos papéis/roupas das ilustrações do dilema-bonde-mobile.
// Cada personagem é um nó nomeado (preset do simulador). Altura de adulto ≈ 1,75 m, origem nos pés, olhando para +Z.
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fs from 'fs';

globalThis.FileReader = class {
  readAsArrayBuffer(b) { b.arrayBuffer().then(r => { this.result = r; this.onloadend && this.onloadend(); }); }
  readAsDataURL(b) { b.arrayBuffer().then(r => { this.result = 'data:' + (b.type || 'application/octet-stream') + ';base64,' + Buffer.from(r).toString('base64'); this.onloadend && this.onloadend(); }); }
};
const fonte = new FontLoader().parse(JSON.parse(fs.readFileSync('node_modules/three/examples/fonts/helvetiker_bold.typeface.json', 'utf8')));

const cache = new Map();
const C = (hex, o = {}) => { const k = hex + JSON.stringify(o); if (!cache.has(k)) cache.set(k, new THREE.MeshStandardMaterial({ name: 'cor_' + hex.toString(16).padStart(6, '0'), color: hex, roughness: 0.7, ...o })); return cache.get(k); };
const PELE = { clara: 0xf1c6a5, media: 0xd9a27a, morena: 0xb97a52, escura: 0x7a4a2c };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function membro(a, b, r0, r1 = r0, seg = 8) {           // cilindro com pontas arredondadas entre dois pontos
  const d = new THREE.Vector3().subVectors(b, a), L = d.length();
  const g = new THREE.CapsuleGeometry((r0 + r1) / 2, Math.max(0.001, L), 2, seg);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.normalize());
  return g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, V(1, 1, 1)));
}
const esfera = (r, x, y, z, sx = 1, sy = 1, sz = 1) => new THREE.SphereGeometry(r, 14, 10).scale(sx, sy, sz).translate(x, y, z);
const caixa = (w, h, d, x, y, z, r = 0.01) => new RoundedBoxGeometry(w, h, d, 2, r).translate(x, y, z);
const torno = (pts, y0 = 0, seg = 18) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg).translate(0, y0, 0);
const txt = (t, size) => { const g = new TextGeometry(t, { font: fonte, size, depth: 0.004, curveSegments: 2, bevelEnabled: false }); g.computeBoundingBox(); const b = g.boundingBox; g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0); return g; };

function montar(nome, itens) {
  const g = new THREE.Group(); g.name = nome;
  const porMat = new Map();
  for (const [geo, m] of itens) { const n = geo.index ? geo.toNonIndexed() : geo; for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(k)) n.deleteAttribute(k); if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2)); if (!porMat.has(m)) porMat.set(m, []); porMat.get(m).push(n); }
  for (const [m, gs] of porMat) { const me = new THREE.Mesh(mergeGeometries(gs), m); me.name = nome + '_' + m.name; g.add(me); }
  return g;
}

// ---------- corpo-base parametrizado ----------
// o: { esc, pele, camisa, calca, sapato, cabelo, tipoCabelo, bracos:{e,d}, saia, tronco, oculos, barba }
function corpo(o) {
  const s = o.esc ?? 1, it = [];
  const P = (x, y, z) => V(x * s, y * s, z * s);
  const pele = C(o.pele), camisa = C(o.camisa), calca = C(o.calca), sapato = C(o.sapato ?? 0x5a3a22, { roughness: 0.5 });
  const yQ = 0.92, yOmb = 1.42, yCab = 1.62, rCab = 0.13;
  // pernas e sapatos
  for (const sx of [-1, 1]) {
    const pe = P(sx * 0.09, 0.07, 0), joelho = P(sx * 0.09, 0.48, 0.01), quadril = P(sx * 0.095, yQ, 0);
    if (!o.saiaLonga) { it.push([membro(pe, joelho, 0.058 * s, 0.062 * s), calca]); it.push([membro(joelho, quadril, 0.064 * s, 0.075 * s), calca]); }
    else it.push([membro(P(sx * 0.07, 0.07, 0), P(sx * 0.07, 0.3, 0), 0.035 * s), pele]);
    it.push([caixa(0.11 * s, 0.075 * s, 0.24 * s, sx * 0.09 * s, 0.038 * s, 0.04 * s, 0.03 * s), sapato]);
  }
  // quadril e tronco
  if (!o.saiaLonga) it.push([esfera(0.15 * s, 0, yQ * s, 0, 1.15, 0.7, 0.85), calca]);
  const tr = o.tronco ?? [[0.16, 0], [0.17, 0.12], [0.185, 0.36], [0.17, 0.48], [0.09, 0.53]];
  it.push([torno(tr.map(([r, y]) => [r * s, y * s]), (yQ - 0.02) * s).scale(1, 1, 0.72), camisa]);
  // pescoço e cabeça
  it.push([membro(P(0, 1.45, 0), P(0, 1.53, 0), 0.05 * s), pele]);
  it.push([esfera(rCab * s, 0, yCab * s, 0, 0.95, 1.05, 1), pele]);
  for (const sx of [-1, 1]) it.push([esfera(0.03 * s, sx * 0.125 * s, yCab * s, 0, 0.6, 1, 1), pele]);          // orelhas
  for (const sx of [-1, 1]) it.push([esfera(0.016 * s, sx * 0.045 * s, (yCab + 0.015) * s, 0.115 * s), C(0x1c1612)]); // olhos
  for (const sx of [-1, 1]) it.push([caixa(0.045 * s, 0.009 * s, 0.01 * s, sx * 0.047 * s, (yCab + 0.055) * s, 0.118 * s, 0.003), C(o.sobrancelha ?? 0x3a2a1e)]);
  it.push([esfera(0.022 * s, 0, (yCab - 0.015) * s, 0.128 * s, 1, 1.1, 1), pele]);                                    // nariz
  it.push([caixa(0.05 * s, 0.01 * s, 0.01 * s, 0, (yCab - 0.065) * s, 0.112 * s, 0.004), C(0x8a3a32)]);              // boca
  // cabelo
  const cab = C(o.cabelo ?? 0x3a2414, { roughness: 0.85 });
  // calota de cabelo inclinada: cobre topo e nuca, deixa testa e olhos livres
  const calota = (r, inc = -0.5, abre = 0.56, dz = -0.015, dy = 0.0) => new THREE.SphereGeometry(r * s * 1.07, 16, 10, 0, Math.PI * 2, 0, Math.PI * abre).rotateX(inc).translate(0, (yCab + dy) * s, dz * s);
  if (o.tipoCabelo === 'curto') it.push([calota(0.14), cab]);
  if (o.tipoCabelo === 'grisalho') { it.push([calota(0.139, -0.9, 0.5, -0.02), cab]); }
  if (o.tipoCabelo === 'cacheado') { it.push([calota(0.138, -0.6, 0.5), cab]); for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; it.push([esfera(0.055 * s, Math.cos(a) * 0.1 * s, (yCab + 0.1 + (k % 2) * 0.025) * s, (Math.sin(a) * 0.085 - 0.04) * s), cab]); } }
  if (o.tipoCabelo === 'afro') it.push([esfera(0.18 * s, 0, (yCab + 0.09) * s, -0.06 * s, 1.1, 0.95, 0.9), cab]);
  if (o.tipoCabelo === 'longo') { it.push([calota(0.143, -0.55, 0.58), cab]); it.push([caixa(0.3 * s, 0.4 * s, 0.1 * s, 0, (yCab - 0.17) * s, -0.08 * s, 0.05 * s), cab]); }
  if (o.tipoCabelo === 'espetado') { it.push([calota(0.14), cab]); for (let k = 0; k < 7; k++) { const x = (k - 3) * 0.035; it.push([new THREE.ConeGeometry(0.035 * s, 0.09 * s, 6).rotateX(-0.3).translate(x * s, (yCab + 0.12) * s, (-0.01 - Math.abs(x) * 0.2) * s), cab]); } }
  if (o.barba) { it.push([esfera(0.105 * s, 0, (yCab - 0.06) * s, 0.035 * s, 1.05, 0.65, 0.9), C(o.barba)]); }
  if (o.bigode) it.push([caixa(0.1 * s, 0.022 * s, 0.025 * s, 0, (yCab - 0.042) * s, 0.122 * s, 0.01), C(o.bigode)]);
  if (o.oculos) { for (const sx of [-1, 1]) it.push([new THREE.TorusGeometry(0.03 * s, 0.006 * s, 6, 16).translate(sx * 0.046 * s, (yCab + 0.015) * s, 0.128 * s), C(0x1a1a1a)]); it.push([caixa(0.03 * s, 0.006 * s, 0.006 * s, 0, (yCab + 0.018) * s, 0.13 * s, 0.002), C(0x1a1a1a)]); }
  // braços (ângulos em graus: abertura lateral, flexão para frente, cotovelo)
  const bracos = o.bracos ?? {};
  const maos = {};
  for (const [lado, sx] of [['e', -1], ['d', 1]]) {
    const cfg = bracos[lado] ?? { abre: 8, frente: 0, cotovelo: 5 };
    const omb = P(sx * 0.21, yOmb, 0);
    const a1 = THREE.MathUtils.degToRad(cfg.abre), f1 = THREE.MathUtils.degToRad(cfg.frente), c1 = THREE.MathUtils.degToRad(cfg.cotovelo);
    const dir1 = V(sx * Math.sin(a1), -Math.cos(a1) * Math.cos(f1), Math.cos(a1) * Math.sin(f1)).normalize();
    const cot = omb.clone().add(dir1.clone().multiplyScalar(0.29 * s));
    const dir2 = V(dir1.x * Math.cos(c1), dir1.y * Math.cos(c1), dir1.z * Math.cos(c1) + Math.sin(c1)).normalize();
    const mao = cot.clone().add(dir2.clone().multiplyScalar(0.27 * s));
    const manga = C(cfg.manga ?? o.manga ?? o.camisa);
    it.push([membro(omb, cot, 0.055 * s, 0.05 * s), manga]);
    it.push([membro(cot, mao, 0.047 * s, 0.04 * s), cfg.antebracoPele ? pele : manga]);
    it.push([esfera(0.05 * s, mao.x, mao.y, mao.z, 0.9, 1.15, 0.75), o.luvas ? C(o.luvas) : pele]);
    maos[lado] = mao;
  }
  return { it, maos, s, yCab, P };
}

const personagens = [];
const add = (nome, fn) => { const g = montar(nome, fn()); personagens.push(g); };

// TRABALHADOR — capacete amarelo, colete laranja refletivo, camisa e calça azul-marinho, luvas
add('trabalhador', () => {
  const b = corpo({ pele: PELE.media, camisa: 0x23324f, calca: 0x22304a, sapato: 0x8a5a2b, tipoCabelo: 'curto', cabelo: 0x2a1a10, luvas: 0x9a6b3a, bracos: { e: { abre: 10, frente: 0, cotovelo: 8 }, d: { abre: 10, frente: 0, cotovelo: 8 } } });
  const { it, s, yCab } = b;
  it.push([torno([[0.172, 0], [0.182, 0.12], [0.195, 0.34], [0.18, 0.46]].map(([r, y]) => [r * s, y * s]), 0.98 * s).scale(1, 1, 0.75), C(0xff7a1a)]);
  for (const y of [1.18, 1.3]) it.push([torno([[0.197, 0], [0.197, 0.035]], y * s).scale(1, 1, 0.76), C(0xd8dde2, { metalness: 0.6, roughness: 0.25 })]);
  it.push([torno([[0, 0.02], [0.15, 0.02], [0.16, 0.06], [0.14, 0.13], [0.07, 0.17], [0, 0.175]], (yCab + 0.02) * s), C(0xf5c400, { roughness: 0.35 })]);
  it.push([caixa(0.34 * s, 0.015 * s, 0.32 * s, 0, (yCab + 0.035) * s, 0.02 * s, 0.006), C(0xf5c400, { roughness: 0.35 })]);
  it.push([torno([[0.13, 0], [0.135, 0.04]], 0.9 * s).scale(1, 1, 0.75), C(0x2a1a10)]);                          // cinto
  return it;
});
// IDOSO — cabelo grisalho, óculos, cardigã cinza, camisa azul-clara, calça cáqui, bengala
add('idoso', () => {
  const b = corpo({ pele: PELE.clara, camisa: 0xa9c4dc, calca: 0xbfae8e, sapato: 0x5a3a22, tipoCabelo: 'grisalho', cabelo: 0xe6e3dc, sobrancelha: 0xcfcac2, oculos: true, manga: 0x54575c, bracos: { e: { abre: 6, frente: 4, cotovelo: 10 }, d: { abre: 14, frente: 12, cotovelo: 25 } } });
  const { it, s, maos } = b;
  it.push([torno([[0.178, 0], [0.188, 0.14], [0.198, 0.36], [0.18, 0.49], [0.1, 0.53]].map(([r, y]) => [r * s, y * s]), 0.88 * s, 28).scale(1, 1, 0.75), C(0x54575c)]);
  const m = maos.d; it.push([membro(V(m.x + 0.02, 0.0, m.z + 0.06), V(m.x, m.y, m.z), 0.014), C(0x5a3a1e)]);
  it.push([membro(V(m.x - 0.05, m.y + 0.01, m.z), V(m.x + 0.03, m.y + 0.01, m.z), 0.016), C(0x5a3a1e)]);
  return it;
});
// GESTANTE — vestido longo vinho, barriga, cabelo longo escuro
add('gestante', () => {
  const b = corpo({ pele: PELE.media, camisa: 0x6a2448, calca: 0x6a2448, sapato: 0x1d2a44, tipoCabelo: 'longo', cabelo: 0x2a1a12, saiaLonga: true, bracos: { e: { abre: 5, frente: 25, cotovelo: 60 }, d: { abre: 5, frente: 20, cotovelo: 75 } } });
  const { it, s } = b;
  it.push([torno([[0.1, 0.0], [0.2, 0.05], [0.23, 0.4], [0.2, 0.75], [0.165, 0.95]].map(([r, y]) => [r * s, y * s]), 0.1 * s, 28).scale(1, 1, 0.85), C(0x6a2448)]);
  it.push([esfera(0.17 * s, 0, 1.05 * s, 0.09 * s, 1, 1, 0.95), C(0x6a2448)]);
  return it;
});
// CRIANÇAS — camisa amarela "8" (verde), short azul, tênis, cabelo cacheado, bola de basquete
add('criancas', () => {
  const b = corpo({ esc: 0.68, pele: PELE.morena, camisa: 0xf3c51a, calca: 0x2d4f9a, sapato: 0x2a2a2a, tipoCabelo: 'cacheado', cabelo: 0x5a2e14, manga: 0xf3c51a, bracos: { e: { abre: 25, frente: 20, cotovelo: 40, antebracoPele: true }, d: { abre: 20, frente: 15, cotovelo: 30, antebracoPele: true } } });
  const { it, s, maos } = b;
  for (const sx of [-1, 1]) it.push([membro(V(sx * 0.09 * s, 0.1 * s, 0), V(sx * 0.09 * s, 0.4 * s, 0), 0.055 * s), C(PELE.morena)]);
  for (const sx of [-1, 1]) it.push([caixa(0.06 * s, 0.1 * s, 0.06 * s, sx * 0.09 * s, 0.13 * s, 0, 0.02), C(0xffffff)]);
  const t = txt('8', 0.16 * s); t.translate(0, 1.2 * s, 0.135 * s); it.push([t, C(0x1f8a3a)]);
  const m = maos.d; it.push([esfera(0.12, m.x + 0.05, m.y - 0.12, m.z + 0.05), C(0xd2601e, { roughness: 0.6 })]);
  return it;
});
// ESTUDANTE — camiseta verde, calça cargo azul, tênis, cabelo espetado, mochila e livro "ÉTICA"
add('estudante', () => {
  const b = corpo({ esc: 0.92, pele: PELE.media, camisa: 0x56b13c, calca: 0x1f2c4f, sapato: 0x111111, tipoCabelo: 'espetado', cabelo: 0x111111, bracos: { e: { abre: 6, frente: 30, cotovelo: 80, antebracoPele: true }, d: { abre: 6, frente: 30, cotovelo: 80, antebracoPele: true } } });
  const { it, s } = b;
  it.push([caixa(0.3 * s, 0.4 * s, 0.16 * s, 0, 1.2 * s, -0.18 * s, 0.05 * s), C(0x5d6066)]);
  for (const sx of [-1, 1]) it.push([caixa(0.04 * s, 0.38 * s, 0.03 * s, sx * 0.12 * s, 1.22 * s, 0.11 * s, 0.01), C(0x3c3f44)]);
  it.push([caixa(0.24 * s, 0.3 * s, 0.05 * s, 0, 1.12 * s, 0.22 * s, 0.01), C(0xd8732a)]);
  const t = txt('ETICA', 0.045 * s); t.translate(0, 1.2 * s, 0.25 * s); it.push([t, C(0xffffff)]);
  return it;
});
// CIENTISTA — careca, óculos, jaleco branco, camisa azul-clara, calça cáqui, frasco verde e livro
add('cientista', () => {
  const b = corpo({ pele: PELE.clara, camisa: 0xa9c8e4, calca: 0xb48a5a, sapato: 0x6a3e1e, tipoCabelo: 'nenhum', oculos: true, sobrancelha: 0x6a5a4a, manga: 0xf4f4f2, bracos: { e: { abre: 8, frente: 25, cotovelo: 70 }, d: { abre: 20, frente: 10, cotovelo: 95 } } });
  const { it, s, maos } = b;
  it.push([torno([[0.21, 0], [0.205, 0.3], [0.195, 0.6], [0.2, 0.86], [0.18, 0.98], [0.1, 1.03]].map(([r, y]) => [r * s, y * s]), 0.38 * s, 28).scale(1, 1, 0.75), C(0xf4f4f2, { roughness: 0.6 })]);
  const m = maos.d; it.push([new THREE.CylinderGeometry(0.02, 0.07, 0.13, 16).translate(m.x, m.y + 0.07, m.z), C(0x9fe6a8, { transparent: true, opacity: 0.6, roughness: 0.05 })]);
  it.push([new THREE.CylinderGeometry(0.0, 0.062, 0.08, 16).translate(m.x, m.y + 0.04, m.z), C(0x3da34a)]);
  const e = maos.e; it.push([caixa(0.22, 0.04, 0.17, e.x + 0.05, e.y + 0.03, e.z + 0.02), C(0x6b7a5a)]);
  return it;
});
// COLEGA — cabelo castanho cacheado, suéter marrom com coração, calça jeans, acenando, livro
add('colega', () => {
  const b = corpo({ pele: PELE.clara, camisa: 0x8a3f22, calca: 0x3a5f91, sapato: 0x9a6a3a, tipoCabelo: 'cacheado', cabelo: 0x5a3418, bracos: { e: { abre: 6, frente: 15, cotovelo: 30 }, d: { abre: 50, frente: 10, cotovelo: -100 } } });
  const { it, s, maos } = b;
  const h = new THREE.TorusGeometry(0.05, 0.008, 6, 20).translate(0, 1.25, 0.14); it.push([h, C(0xf2e6d8)]);
  const e = maos.e; it.push([caixa(0.05, 0.24, 0.18, e.x - 0.01, e.y + 0.05, e.z), C(0x2f5f4a)]);
  return it;
});
// VÍNCULO AFETIVO — cabelo afro, blusa florida clara, saia azul-petróleo, segurando coração vermelho
add('vinculo', () => {
  const b = corpo({ pele: PELE.escura, camisa: 0xf2e2cf, calca: 0x2e6e85, sapato: 0x4a1e14, tipoCabelo: 'afro', cabelo: 0x161010, saiaLonga: true, bracos: { e: { abre: 6, frente: 45, cotovelo: 55, antebracoPele: true }, d: { abre: 6, frente: 45, cotovelo: 55, antebracoPele: true } } });
  const { it, s, maos } = b;
  it.push([torno([[0.32, 0.0], [0.3, 0.12], [0.22, 0.45], [0.16, 0.62]].map(([r, y]) => [r * s, y * s]), 0.33 * s, 32).scale(1, 1, 0.9), C(0x2e6e85)]);
  for (let k = 0; k < 10; k++) { const a = k * 2.4, y = 1.05 + (k % 5) * 0.08; it.push([esfera(0.018, Math.cos(a) * 0.17, y, Math.abs(Math.sin(a)) * 0.13 + 0.02), C(k % 2 ? 0xd8506a : 0x4a8a5a)]); }
  // coração
  const hs = new THREE.Shape(); hs.moveTo(0, -0.12); hs.bezierCurveTo(-0.16, 0.0, -0.13, 0.13, 0, 0.06); hs.bezierCurveTo(0.13, 0.13, 0.16, 0.0, 0, -0.12);
  const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4 });
  const mx = (maos.e.x + maos.d.x) / 2, my = (maos.e.y + maos.d.y) / 2 + 0.06, mz = (maos.e.z + maos.d.z) / 2 + 0.06;
  hg.scale(1.3, 1.3, 1.3).translate(mx, my, mz); it.push([hg, C(0xe0201e, { roughness: 0.35 })]);
  return it;
});
// DESCONHECIDOS — sobretudo bege, chapéu, bigode, placa "?"
add('desconhecidos', () => {
  const b = corpo({ pele: PELE.clara, camisa: 0xcdb48a, calca: 0x5a3e28, sapato: 0x3a2414, tipoCabelo: 'curto', cabelo: 0x5a3a20, bigode: 0x5a3a20, bracos: { e: { abre: 6, frente: 40, cotovelo: 60 }, d: { abre: 6, frente: 40, cotovelo: 60 } } });
  const { it, s, yCab, maos } = b;
  it.push([torno([[0.23, 0], [0.22, 0.4], [0.2, 0.8], [0.21, 1.0], [0.12, 1.07]].map(([r, y]) => [r * s, y * s]), 0.36 * s, 28).scale(1, 1, 0.78), C(0xcdb48a, { roughness: 0.75 })]);
  it.push([torno([[0, 0.11], [0.12, 0.11], [0.13, 0.03], [0.21, 0.02], [0.21, 0.0], [0, 0.0]], (yCab + 0.06) * s), C(0xb89a6a)]);
  it.push([torno([[0.131, 0.03], [0.131, 0.05]], (yCab + 0.06) * s), C(0x4a3424)]);
  const mx = (maos.e.x + maos.d.x) / 2, my = (maos.e.y + maos.d.y) / 2 + 0.08, mz = (maos.e.z + maos.d.z) / 2 + 0.04;
  it.push([caixa(0.34, 0.4, 0.015, mx, my, mz, 0.005), C(0xf7f3e8)]);
  const t = txt('?', 0.26); t.translate(mx, my, mz + 0.01); it.push([t, C(0x1a1a1a)]);
  return it;
});
// OPERADOR (alavanca) — quepe listrado azul, camisa azul-clara, macacão jeans, lenço vermelho, barba
add('operador', () => {
  const b = corpo({ pele: PELE.clara, camisa: 0x8fbce8, calca: 0x1f5aa6, sapato: 0x7a4a24, tipoCabelo: 'curto', cabelo: 0x6a3a1a, barba: 0x6a3a1a, manga: 0x8fbce8, bracos: { e: { abre: 10, frente: 50, cotovelo: 30 }, d: { abre: 10, frente: 50, cotovelo: 30 } } });
  const { it, s, yCab } = b;
  it.push([torno([[0.172, 0], [0.182, 0.12], [0.188, 0.3], [0.15, 0.31]].map(([r, y]) => [r * s, y * s]), 0.9 * s).scale(1, 1, 0.75), C(0x1f5aa6)]);   // macacão
  it.push([caixa(0.2 * s, 0.17 * s, 0.03 * s, 0, 1.3 * s, 0.13 * s, 0.01), C(0x1f5aa6)]);                                                                  // peitilho
  for (const sx of [-1, 1]) it.push([caixa(0.035 * s, 0.25 * s, 0.03 * s, sx * 0.09 * s, 1.36 * s, 0.11 * s, 0.01), C(0x1f5aa6)]);                        // alças
  it.push([new THREE.ConeGeometry(0.06, 0.1, 3).rotateX(Math.PI).translate(0, 1.4, 0.14), C(0xd8281e)]);                                                     // lenço
  it.push([torno([[0, 0.1], [0.14, 0.1], [0.145, 0.0], [0, 0.0]], (yCab + 0.07) * s), C(0x2d4a86)]);                                                          // quepe
  for (let k = 0; k < 6; k++) it.push([torno([[0.146, 0], [0.146, 0.006]], (yCab + 0.075 + k * 0.016) * s), C(0x8fb0e0)]);                                   // listras
  it.push([caixa(0.2, 0.015, 0.1, 0, (yCab + 0.07) * s, 0.15, 0.005), C(0x1a2440)]);                                                                         // pala
  it.push([new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12).rotateX(Math.PI / 2).translate(0, (yCab + 0.13) * s, 0.145), C(0xd8b040, { metalness: 0.8, roughness: 0.3 })]);
  return it;
});

// ---------- export: personagens lado a lado (o app clona pelo nome) ----------
const cena = new THREE.Scene();
personagens.forEach((p, i) => { p.position.x = (i - (personagens.length - 1) / 2) * 0.9; cena.add(p); });
new GLTFExporter().parse(cena, glb => { fs.writeFileSync('../assets/personagens.glb', Buffer.from(glb)); console.log('ok', personagens.map(p => p.name).join(', '), (glb.byteLength / 1024).toFixed(0) + ' KB'); },
  e => { console.error(e); process.exit(1); }, { binary: true });
