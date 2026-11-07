// Maquete do Dilema do Bonde — cena 3D compartilhada (tela e RA).
// Unidades em metros. Chão em y = 0; topo do trilho em Y_TRILHO.
// Traçado: anel (estação no trecho de cima) + ramal interno que passa atrás da oficina.
// Trilho PRINCIPAL = trecho de baixo (1 pessoa). RAMAL = trecho de cima (grupo de 3).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ARAUCARIAS_RA } from './vegetacao-ra.js?v=20261107-ra5';

export const Y_TRILHO = 0.42;
const BITOLA = 1.435;
const L = 40, R = 30, ZT = -30, ZB = 30;          // anel: retas x∈[-L, L], semicírculos de raio R
const XD = -38, ZR = 14;                          // desvio (agulha) em x = XD; ramal em z = ZR
const BASE = new URL('../assets/', import.meta.url).href;

// ---------- curvas ----------
class Arco extends THREE.Curve {
  constructor(cx, cz, r, a0, a1) { super(); Object.assign(this, { cx, cz, r, a0, a1 }); }
  getPoint(t, alvo = new THREE.Vector3()) { const a = this.a0 + (this.a1 - this.a0) * t; return alvo.set(this.cx + this.r * Math.cos(a), Y_TRILHO, this.cz + this.r * Math.sin(a)); }
}
const P = (x, z) => new THREE.Vector3(x, Y_TRILHO, z);
const reta = (a, b) => new THREE.LineCurve3(P(...a), P(...b));
const bez = (a, b, c, d) => new THREE.CubicBezierCurve3(P(...a), P(...b), P(...c), P(...d));
const SEG = {
  topoE: reta([0, ZT], [-L, ZT]),
  arcoE: new Arco(-L, 0, R, -Math.PI / 2, -Math.PI * 1.5),
  baixoAteDesvio: reta([-L, ZB], [XD, ZB]),
  baixoPrincipal: reta([XD, ZB], [L, ZB]),
  ramalSai: bez([XD, ZB], [XD + 13, ZB], [XD + 13, ZR], [XD + 26, ZR]),
  ramalReto: reta([XD + 26, ZR], [-XD - 26, ZR]),
  ramalVolta: bez([-XD - 26, ZR], [-XD - 13, ZR], [-XD - 13, ZB], [-XD, ZB]),
  baixoFim: reta([-XD, ZB], [L, ZB]),
  arcoD: new Arco(L, 0, R, Math.PI / 2, -Math.PI / 2),
  topoD: reta([L, ZT], [0, ZT]),
};
function rota(nomes) { const c = new THREE.CurvePath(); nomes.forEach(n => c.add(SEG[n])); c.arcLengthDivisions = 4000; return c; }
export const ROTAS = {
  principal: rota(['topoE', 'arcoE', 'baixoAteDesvio', 'baixoPrincipal', 'arcoD', 'topoD']),
  ramal: rota(['topoE', 'arcoE', 'baixoAteDesvio', 'ramalSai', 'ramalReto', 'ramalVolta', 'baixoFim', 'arcoD', 'topoD']),
};
// distância ao longo da rota até o ponto mais próximo de (x, z)
function sNoPonto(curva, x, z) {
  const n = 3000, total = curva.getLength(); let best = 1e9, sb = 0;
  for (let i = 0; i <= n; i++) { const p = curva.getPointAt(i / n); const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < best) { best = d; sb = i / n * total; } }
  return sb;
}
export const S_DESVIO = sNoPonto(ROTAS.principal, XD, ZB);

// ---------- texturas ----------
const tl = new THREE.TextureLoader();
function tex(nome, rep = 1, srgb = true) {
  const t = tl.load(BASE + 'tex/' + nome); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function matTex(nome, cor, rep, o = {}) {
  return new THREE.MeshStandardMaterial({ color: cor, map: tex(nome + '.jpg', rep), normalMap: tex(nome + '_n.jpg', rep, false), roughness: 0.9, ...o });
}

// ---------- trilhos (lastro, dormentes, trilhos) ao longo de uma curva ----------
function viaAoLongo(curva, mats, dormentes, opts = {}) {
  const len = curva.getLength(), n = Math.max(2, Math.ceil(len / 0.5));
  const pos = [], uv = [], idx = [];
  const lastro = [[-1.85, 0.0], [-1.35, 0.27], [1.35, 0.27], [1.85, 0.0]];
  const trilho = [[-0.036, Y_TRILHO - 0.15], [-0.036, Y_TRILHO], [0.036, Y_TRILHO], [0.036, Y_TRILHO - 0.15]];
  const gL = { pos: [], uv: [], idx: [] }, gT = { pos: [], uv: [], idx: [] };
  const p = new THREE.Vector3(), t = new THREE.Vector3();
  const anel = (g, perfil, i, off, s) => {
    curva.getPointAt(i / n, p); curva.getTangentAt(i / n, t);
    const nx = -t.z, nz = t.x;
    perfil.forEach(([a, y], k) => { g.pos.push(p.x + nx * (a + off), y, p.z + nz * (a + off)); g.uv.push((a + k) * 0.5, s / 2); });
  };
  const costura = (g, np, base) => { for (let i = 0; i < n; i++) for (let k = 0; k < np - 1; k++) { const a = base + i * np + k, b = a + np; g.idx.push(a, a + 1, b, a + 1, b + 1, b); } };
  if (!opts.semLastro) { for (let i = 0; i <= n; i++) anel(gL, lastro, i, 0, i / n * len); costura(gL, 4, 0); }
  for (const lado of [-1, 1]) { const base = gT.pos.length / 3; for (let i = 0; i <= n; i++) anel(gT, trilho, i, lado * BITOLA / 2, i / n * len); costura(gT, 4, base); }
  const mk = g => { const b = new THREE.BufferGeometry(); b.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3)); b.setAttribute('uv', new THREE.Float32BufferAttribute(g.uv, 2)); b.setIndex(g.idx); b.computeVertexNormals(); return b; };
  // dormentes (posições para o InstancedMesh)
  if (!opts.semDormentes) for (let s = 0.3; s < len; s += 0.62) { const u = s / len; curva.getPointAt(u, p); curva.getTangentAt(u, t); dormentes.push({ x: p.x, z: p.z, ang: Math.atan2(-t.z, t.x) }); }
  return { lastro: opts.semLastro ? null : mk(gL), trilhos: mk(gT) };
}

// ---------- utilitários de geometria ----------
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function tingir(g, cor) { const c = new THREE.Color(cor), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; }
function limpa(g) { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) n.deleteAttribute(k); if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2)); return n; }
function aleat(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// distância mínima de um ponto a qualquer trilho (para espalhar vegetação sem invadir a via)
const amostrasVia = [];
for (const c of Object.values(SEG)) { const n = Math.ceil(c.getLength() / 2); for (let i = 0; i <= n; i++) { const q = c.getPointAt(i / n); amostrasVia.push([q.x, q.z]); } }
const distVia = (x, z) => { let m = 1e9; for (const [a, b] of amostrasVia) m = Math.min(m, (a - x) ** 2 + (b - z) ** 2); return Math.sqrt(m); };

// =====================================================================
export async function criarMaquete(opts = {}) {
  const root = new THREE.Group(); root.name = 'Maquete';
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  // versões leves (sufixo _ra) para a RA nativa do iPhone: o USDZ guarda a geometria em texto
  const LEVES = new Set(['araucaria', 'arvore', 'arvore_nova1', 'oficina', 'cientista', 'colega', 'criancas', 'desconhecidos', 'estudante', 'gestante', 'idoso', 'operador', 'trabalhador', 'vinculo']);
  const nomeArq = url => { const b = url.replace('.glb', ''); return opts.ra && LEVES.has(b) ? b + '_ra.glb' : url; };
  const carregar = url => new Promise((ok, erro) => loader.load(BASE + nomeArq(url), g => ok(g.scene), undefined, erro));

  // ---------- terreno da maquete (base com bordas de terra) ----------
  {
    const s = new THREE.Shape(), w = 80, h = 52, r = 14, cz = 2;
    s.moveTo(-w + r, -h + cz); s.lineTo(w - r, -h + cz); s.quadraticCurveTo(w, -h + cz, w, -h + r + cz); s.lineTo(w, h - r + cz); s.quadraticCurveTo(w, h + cz, w - r, h + cz);
    s.lineTo(-w + r, h + cz); s.quadraticCurveTo(-w, h + cz, -w, h - r + cz); s.lineTo(-w, -h + r + cz); s.quadraticCurveTo(-w, -h + cz, -w + r, -h + cz);
    const topo = new THREE.ShapeGeometry(s, 24); topo.rotateX(-Math.PI / 2);
    const mt = matTex('grama', 0xffffff, 1 / 5); mt.map.repeat.set(1 / 5, 1 / 5); mt.normalMap.repeat.set(1 / 5, 1 / 5);
    const mTopo = new THREE.Mesh(topo, mt); mTopo.receiveShadow = true; mTopo.name = 'Gramado'; root.add(mTopo);
    const lado = new THREE.ExtrudeGeometry(s, { depth: 3, bevelEnabled: false, curveSegments: 24 }); lado.rotateX(Math.PI / 2); lado.translate(0, -0.02, 0);
    const ml = matTex('terra', 0xffffff, 1 / 3); const mLado = new THREE.Mesh(lado, ml); mLado.name = 'Base_Terra'; root.add(mLado);
  }

  // ---------- via permanente ----------
  const via = new THREE.Group(); via.name = 'Via'; root.add(via);
  const mLastro = matTex('brita', 0xffffff, 1, { roughness: 1 });
  const mTrilho = new THREE.MeshStandardMaterial({ color: 0x8d8780, metalness: 0.85, roughness: 0.35, map: tex('metal.jpg', 1) });
  const mDorm = matTex('madeira', 0x7a5a3e, 1);
  const dorm = [], lastros = [], trilhos = [];
  for (const [nome, c] of Object.entries(SEG)) {
    const r = viaAoLongo(c, null, dorm, { semDormentes: nome === 'ramalSai' || nome === 'ramalVolta' ? false : false });
    if (r.lastro) lastros.push(r.lastro); trilhos.push(r.trilhos);
  }
  const mL = new THREE.Mesh(mergeGeometries(lastros), mLastro); mL.receiveShadow = true; mL.name = 'Lastro'; via.add(mL);
  const mT = new THREE.Mesh(mergeGeometries(trilhos), mTrilho); mT.castShadow = true; mT.name = 'Trilhos'; via.add(mT);
  const gd = new THREE.BoxGeometry(0.24, 0.14, 2.5); const iD = new THREE.InstancedMesh(gd, mDorm, dorm.length); iD.name = 'Dormentes';
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
  dorm.forEach((d, i) => { q.setFromAxisAngle(V(0, 1, 0), d.ang); m4.compose(V(d.x, 0.2, d.z), q, V(1, 1, 1)); iD.setMatrixAt(i, m4); });
  iD.receiveShadow = true; via.add(iD);

  // ---------- agulhas do desvio (móveis) e sinal de posição ----------
  const desvio = new THREE.Group(); desvio.name = 'Desvio'; root.add(desvio);
  const agulhas = [];
  for (const lado of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(XD + 6.5, Y_TRILHO - 0.06, ZB + lado * (BITOLA / 2 - 0.09));
    const a = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.12, 0.07), new THREE.MeshStandardMaterial({ color: 0xb8b4ae, metalness: 0.9, roughness: 0.25 }));
    a.position.x = -3.25; a.castShadow = true; piv.add(a); desvio.add(piv); agulhas.push({ piv, lado });
  }
  const sinal = new THREE.Group(); sinal.position.set(XD + 1, 0, ZB + 2.6); desvio.add(sinal);
  sinal.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 8).translate(0, 0.65, 0), new THREE.MeshStandardMaterial({ color: 0x2b2f36, metalness: 0.6, roughness: 0.4 })));
  const disco = new THREE.Group(); disco.position.y = 1.35; sinal.add(disco);
  const mVerde = new THREE.MeshStandardMaterial({ color: 0x2f9a4a, emissive: 0x1b6a30, emissiveIntensity: 0.6 }), mAmarelo = new THREE.MeshStandardMaterial({ color: 0xf2b21b, emissive: 0xa06a00, emissiveIntensity: 0.6 });
  const dV = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24).rotateZ(Math.PI / 2), mVerde); disco.add(dV);
  const dA = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.6), mAmarelo); dA.rotation.x = Math.PI / 2; disco.add(dA);

  // ---------- alavanca de manobra (operador ao lado) ----------
  const ALAV = V(-47, 0, 38);
  const alavanca = new THREE.Group(); alavanca.name = 'Alavanca'; alavanca.position.copy(ALAV); alavanca.rotation.y = -0.5; alavanca.scale.setScalar(opts.escalaPersonagens ?? 1.5); root.add(alavanca);
  const mConc = matTex('pedra', 0xb9b6ae, 1);
  alavanca.add(new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 1.6).translate(0, 0.09, 0), mConc));
  const mCaixa = new THREE.MeshStandardMaterial({ color: 0x4b525c, metalness: 0.6, roughness: 0.45, map: tex('metal.jpg', 1) });
  alavanca.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 0.55).translate(0, 0.55, 0), mCaixa));
  for (const sx of [-1, 1]) alavanca.add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.5).translate(sx * 0.22, 1.1, 0), mCaixa));
  const haste = new THREE.Group(); haste.position.set(0, 0.95, 0); alavanca.add(haste);
  const mVerm = new THREE.MeshStandardMaterial({ color: 0xd2231c, metalness: 0.4, roughness: 0.35 });
  haste.add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.3, 12).translate(0, 0.65, 0), mVerm));
  haste.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.3, 12).rotateZ(Math.PI / 2).translate(0, 1.3, 0), mVerm));
  haste.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10).translate(0, 0.0, 0), mCaixa));
  // área de toque maior (invisível) para facilitar o clique no celular
  const alvoToque = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 2.2).translate(0, 1.4, 0), new THREE.MeshBasicMaterial({ visible: false })); alvoToque.name = 'Alavanca_Toque'; alavanca.add(alvoToque);
  // tirante até o desvio
  { const a = V(ALAV.x, 0.12, ALAV.z), b = V(XD + 0.3, 0.12, ZB + 1.4), d = b.clone().sub(a);
    const g = new THREE.CylinderGeometry(0.03, 0.03, d.length(), 6); g.rotateZ(Math.PI / 2); const m = new THREE.Mesh(g, mCaixa);
    m.position.copy(a.clone().add(b).multiplyScalar(0.5)); m.rotation.y = Math.atan2(-d.z, d.x); root.add(m); }

  // ---------- modelos (estação, oficina, bonde, personagens) ----------
  // personagens: um GLB por papel (pasta AAnimacoes/Bonde).
  const ARQ = { gestante: 'gestante', trabalhador: 'trabalhador', idoso: 'idoso', criancas: 'criancas', estudante: 'estudante', cientista: 'cientista', colega: 'colega', vinculo: 'vinculo', desconhecidos: 'desconhecidos', operador: 'operador' };
  const ALTURA = { criancas: 1.3 };
  // só carrega os personagens em uso (economiza memória no celular/RA); os demais vêm sob demanda
  const PERS = {};
  const garantirPersonagens = async lista => { await Promise.all([...new Set(lista)].filter(k => ARQ[k] && !PERS[k]).map(async k => { PERS[k] = await carregar(ARQ[k] + '.glb'); })); };
  const avisa = t => { try { opts.progresso && opts.progresso(t); } catch (e) {} };
  const g0 = opts.grupos || {};
  avisa('Carregando estação, bonde e oficina…');
  const [estacao, oficina, bonde, arvoreAntigaGLB, arvoreGLB, araucariaGLB] = await Promise.all([carregar('estacao.glb'), carregar('oficina.glb'), carregar('bonde.glb'), carregar('arvore.glb'), carregar('arvore_nova1.glb'), carregar('araucaria.glb')]);
  avisa('Carregando personagens…');
  await garantirPersonagens(['operador', g0.presetPrincipal || 'trabalhador', g0.presetRamal || 'desconhecidos']);
  estacao.position.set(0, 0, ZT + 1.9); root.add(estacao);                     // eixo da via da estação sobre o trecho de cima
  oficina.position.set(6, 0, ZR + 5.45); root.add(oficina);                   // entre o ramal (atrás) e o principal (frente)
  root.add(bonde);
  [estacao, oficina, bonde].forEach(o => o.traverse(m => { if (m.isMesh) { m.castShadow = !m.material.transparent; m.receiveShadow = true; } }));
  // luzes internas dos modelos ficam fracas no ambiente da maquete
  root.traverse(o => { if (o.isLight) o.intensity *= 0.3; });

  const rodeiros = []; bonde.traverse(o => { if (/^Rodeiro_/.test(o.name)) rodeiros.push(o); });
  const ESC_PERS = opts.escalaPersonagens ?? 1.5;
  const modelo = n => {
    const fonte = PERS[n] || PERS.desconhecidos, base = fonte.clone(true); base.position.set(0, 0, 0);
    const bb = new THREE.Box3().setFromObject(base), h = bb.max.y - bb.min.y, alvo = (ALTURA[n] ?? 1.75) * ESC_PERS;
    base.scale.setScalar(alvo / h); base.position.set(-(bb.min.x + bb.max.x) / 2 * alvo / h, -bb.min.y * alvo / h, -(bb.min.z + bb.max.z) / 2 * alvo / h);
    const c = new THREE.Group(); c.add(base); c.traverse(m => { if (m.isMesh) { m.castShadow = true; } });
    return c; };
  // "?" claro no rosto (dentro do capuz) do desconhecido
  function interrogacao(base, alvo) {
    base.updateMatrixWorld(true);
    let zFrente = -1e9; const v = new THREE.Vector3(), yMin = alvo * 0.82, yMax = alvo * 0.93;
    base.traverse(o => { if (!o.isMesh) return; const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i += 3) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); if (v.y > yMin && v.y < yMax && Math.abs(v.x) < alvo * 0.06) zFrente = Math.max(zFrente, v.z); } });
    if (!interrogacao.tex) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
      g.font = '900 210px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.shadowColor = 'rgba(255,214,120,0.95)'; g.shadowBlur = 26; g.fillStyle = '#fff4d6'; g.fillText('?', 128, 142); g.shadowBlur = 0; g.fillText('?', 128, 142);
      interrogacao.tex = new THREE.CanvasTexture(cv); interrogacao.tex.colorSpace = THREE.SRGBColorSpace;
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(alvo * 0.17, alvo * 0.17), new THREE.MeshBasicMaterial({ map: interrogacao.tex, transparent: true, depthWrite: false, toneMapped: false }));
    m.name = 'Interrogacao'; m.position.set(0, alvo * 0.875, zFrente - alvo * 0.02); m.renderOrder = 2;
    return m;
  }

  // operador junto à alavanca
  const operador = modelo('operador'); operador.position.set(ALAV.x + 1.2, 0.02, ALAV.z + 2.4); operador.rotation.y = 0.35; root.add(operador);   // de frente para o jogador (câmera ao sul), de costas para a alavanca

  // grupos nos trilhos
  const grupoPrincipal = new THREE.Group(), grupoRamal = new THREE.Group(); root.add(grupoPrincipal, grupoRamal);
  for (const g of [grupoPrincipal, grupoRamal]) { const f = new THREE.Group(); f.name = 'Fantasmas'; g.userData.fantasmas = f; root.add(f); }
  const POS_PRINCIPAL = V(4, 0.27, ZB), POS_RAMAL = V(-8, 0.27, ZR);
  const S_ALVO = { principal: sNoPonto(ROTAS.principal, POS_PRINCIPAL.x, POS_PRINCIPAL.z), ramal: sNoPonto(ROTAS.ramal, POS_RAMAL.x, POS_RAMAL.z) };
  // FANTASMINHA (como no Dilema do Bonde 2D): corpo branco translúcido, barra ondulada, olhos e sorriso
  const matFantasma = new THREE.MeshStandardMaterial({ name: 'fantasma', color: 0xf5f7f8, emissive: 0x9aa3a8, emissiveIntensity: 0.35, roughness: 0.6, transparent: true, opacity: 0.88, depthWrite: false });
  const matOlho = new THREE.MeshStandardMaterial({ name: 'fantasma_olho', color: 0x37474f, roughness: 0.4 });
  const geoFantasma = (() => {
    const pts = [[0, 2.42], [0.22, 2.38], [0.42, 2.22], [0.55, 1.98], [0.6, 1.6], [0.6, 1.0], [0.62, 0.55], [0.66, 0.32]].map(([r, y]) => new THREE.Vector2(r, y));
    const g = new THREE.LatheGeometry(pts, 36), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < 0.6) { const a = Math.atan2(p.getZ(i), p.getX(i)); p.setY(i, y + (0.6 - y) / 0.28 * 0.11 * Math.sin(a * 7)); } }
    g.computeVertexNormals(); return g;
  })();
  function criarFantasma() {
    const f = new THREE.Group(); f.name = 'Fantasma';
    f.add(new THREE.Mesh(geoFantasma, matFantasma));
    for (const sx of [-1, 1]) {
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), matOlho); o.scale.set(1, 1.15, 0.5); o.position.set(sx * 0.19, 1.98, 0.5); f.add(o);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 })); b.position.set(sx * 0.19 + 0.035, 2.03, 0.55); f.add(b);
    }
    const boca = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 6, 16, Math.PI * 0.8), matOlho); boca.rotation.z = Math.PI + Math.PI * 0.1; boca.position.set(0, 1.78, 0.56); f.add(boca);
    f.scale.setScalar(1e-4); f.visible = true; return f;
  }
  const PEQ = 1e-4;
  function montarGrupo(grupo, centro, preset, n) {
    grupo.clear(); grupo.position.copy(centro); grupo.userData.caido = 0;
    const fant = grupo.userData.fantasmas;
    // Os fantasmas são irmãos das pessoas: recebem seu centro, sem herdar
    // a redução de escala dos personagens durante o impacto.
    if (fant) { fant.clear(); fant.position.copy(centro); }
    for (let i = 0; i < n; i++) {
      const p = modelo(preset); p.position.x = (i - (n - 1) / 2) * 0.85 * ESC_PERS; p.position.z = (i % 2) * 0.25 - 0.1; p.rotation.y = (i - (n - 1) / 2) * 0.12; grupo.add(p);
      const f = criarFantasma(); f.position.copy(p.position); f.userData.base = p.position.clone(); fant.add(f);
    }
  }

  // ---------- vegetação, pedras e cidadezinha ----------
  {
    const rnd = aleat(42);
    const troncos = [], copas = [], pedras = [], flores = [], arvoresGLB = [], araucarias = [], antigas = [];
    const livre = (x, z, m) => distVia(x, z) > m && !(Math.abs(x) < 26 && z < -12 && z > -38) && !(x > -3 && x < 15 && z > 12 && z < 29) && !(x > -62 && x < -28 && z > 26 && z < 60) && !(x > -24 && x < 18 && z > 6 && z < 60);
    const arvore = (x, z, esc, pinheiro) => {
      const h = (pinheiro ? 3.2 : 2.6) * esc;
      troncos.push(tingir(new THREE.CylinderGeometry(0.18 * esc, 0.28 * esc, h, 7).translate(x, h / 2, z), 0x6a4a30));
      const verdes = [0x4f7a2e, 0x5f8a34, 0x6b8f3a, 0x3f6a2a, 0x7a9a3e];
      troncos.pop();
      (pinheiro ? arvoresGLB : (rnd() < 0.45 ? antigas : araucarias)).push({ x, z, esc, rot: rnd() * 6.28 });
    };
    let tent = 0, nArv = 0;
    while (nArv < 46 && tent++ < 3000) { const x = (rnd() * 2 - 1) * 76, z = -48 + rnd() * 98; if (livre(x, z, 6)) { arvore(x, z, 0.8 + rnd() * 0.7, rnd() < 0.45); nArv++; } }
    tent = 0; let nP = 0;
    while (nP < 14 && tent++ < 2000) { const x = (rnd() * 2 - 1) * 72, z = -44 + rnd() * 92; if (livre(x, z, 5)) { const g = new THREE.IcosahedronGeometry(1, 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = V(p.getX(i), p.getY(i), p.getZ(i)); const k = 0.75 + 0.35 * Math.sin(v.x * 3.1 + v.y * 2.3) * Math.cos(v.z * 2.7); p.setXYZ(i, v.x * k, v.y * k * 0.65, v.z * k); } const e = 1 + rnd() * 1.6; g.scale(e * 1.4, e, e); g.rotateY(rnd() * 6); g.translate(x, e * 0.35, z); g.computeVertexNormals(); pedras.push(g); nP++; } }
    tent = 0; let nF = 0;
    while (nF < 40 && tent++ < 3000) { const x = (rnd() * 2 - 1) * 74, z = -46 + rnd() * 96; if (livre(x, z, 3.5)) { for (let k = 0; k < 4; k++) { const g = new THREE.IcosahedronGeometry(0.5 + rnd() * 0.4, 1); g.scale(1, 0.75, 1); g.translate(x + (rnd() - 0.5) * 1.6, 0.35, z + (rnd() - 0.5) * 1.6); flores.push(tingir(g, 0x5a8a36)); } if (rnd() < 0.7) for (let k = 0; k < 5; k++) flores.push(tingir(new THREE.IcosahedronGeometry(0.16, 0).translate(x + (rnd() - 0.5) * 1.4, 0.7 + rnd() * 0.2, z + (rnd() - 0.5) * 1.4), [0xd88ab8, 0xe8c040, 0xf0f0f0][Math.floor(rnd() * 3)])); nF++; } }
    // floreiras junto à escadaria da estação (como no print)
    for (const sx of [-1, 1]) for (let k = 0; k < 5; k++) { const g = new THREE.IcosahedronGeometry(0.6, 1); g.scale(1, 0.75, 1); g.translate(sx * (3.2 + k * 1.2), 0.4, ZT + 10.5 + (k % 2) * 0.6); flores.push(tingir(g, 0x5a8a36)); flores.push(tingir(new THREE.IcosahedronGeometry(0.2, 0).translate(sx * (3.2 + k * 1.2) + 0.2, 0.85, ZT + 10.8), 0xd88ab8)); }
    const mCor = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
    const mesh = (gs, m, nome) => { if (!gs.length) return; const me = new THREE.Mesh(mergeGeometries(gs.map(limpa)), m); me.castShadow = true; me.receiveShadow = true; me.name = nome; root.add(me); };
    mesh(troncos, mCor, 'Troncos'); mesh(copas, mCor, 'Copas');
    // árvores do usuário: copa larga (antiga), folhosa nova e araucária — instanciadas (uma chamada de desenho por parte)
    const instanciar = (modelo, lista, altura, nome) => { if (!lista.length) return;
      modelo.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(modelo), H = bb.max.y - bb.min.y;
      const partes = []; modelo.traverse(o => { if (o.isMesh) partes.push(o); });
      const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), T = new THREE.Vector3();
      for (const p of partes) {
        const inst = new THREE.InstancedMesh(p.geometry, p.material, lista.length); inst.name = nome; inst.castShadow = inst.receiveShadow = true;
        lista.forEach((a, i) => { const alt = altura * a.esc / H; Q.setFromAxisAngle(V(0, 1, 0), a.rot); S.setScalar(alt); T.set(a.x, -bb.min.y * alt - 0.03, a.z);
          M.compose(T, Q, S).multiply(p.matrixWorld); inst.setMatrixAt(i, M); });
        root.add(inst);
      } };
    instanciar(arvoreAntigaGLB, antigas, 6.5, 'Arvores_Copa_Larga');
    instanciar(arvoreGLB, arvoresGLB, 6.5, 'Arvores');
    instanciar(araucariaGLB, opts.ra ? ARAUCARIAS_RA : araucarias, 13, 'Araucarias'); mesh(flores, mCor, 'Arbustos_Flores');
    mesh(pedras.map(g => tingir(g, 0xffffff)), matTex('pedra', 0xa8a49c, 0.5, { vertexColors: true }), 'Pedras');

    // cidadezinha ao fundo (atrás da estação)
    const casas = [], telhados = [], janelas = [];
    const coresParede = [0xe8dcc0, 0xd9c7a6, 0xc9b79a, 0xe2d6c8, 0xbfae96, 0xd8c0a8], coresTelh = [0x5c6f8f, 0x6a5a52, 0x7a4a3a, 0x55607a];
    for (let i = 0; i < 26; i++) {
      const x = -74 + i * 5.9 + (rnd() - 0.5) * 1.5, z = -47.5 + (i % 3) * 1.6 - (rnd() * 1.2);
      if (Math.abs(x) < 8 && i % 2 === 0) continue;
      const w = 3.6 + rnd() * 1.8, d = 3.2 + rnd(), h = 3.2 + rnd() * 2.6;
      casas.push(tingir(new THREE.BoxGeometry(w, h, d).translate(x, h / 2, z), coresParede[Math.floor(rnd() * coresParede.length)]));
      const sh = new THREE.Shape(); sh.moveTo(-w / 2 - 0.25, 0); sh.lineTo(w / 2 + 0.25, 0); sh.lineTo(0, 1.6 + rnd() * 0.8); sh.closePath();
      const tg = new THREE.ExtrudeGeometry(sh, { depth: d + 0.4, bevelEnabled: false }); tg.translate(x, h, z - d / 2 - 0.2); telhados.push(tingir(tg, coresTelh[Math.floor(rnd() * coresTelh.length)]));
      for (let k = 0; k < Math.floor(w / 1.2); k++) for (let a = 0; a < Math.floor(h / 1.6); a++) janelas.push(tingir(new THREE.BoxGeometry(0.55, 0.75, 0.05).translate(x - w / 2 + 0.75 + k * 1.2, 1.1 + a * 1.5, z + d / 2 + 0.02), rnd() < 0.4 ? 0xffd27a : 0x3b4a5c));
    }
    // igreja com torre
    casas.push(tingir(new THREE.BoxGeometry(5, 6, 7).translate(46, 3, -46), 0xe6dcc8));
    casas.push(tingir(new THREE.BoxGeometry(2.6, 11, 2.6).translate(46, 5.5, -42.5), 0xe6dcc8));
    telhados.push(tingir(new THREE.ConeGeometry(2.1, 5, 4).rotateY(Math.PI / 4).translate(46, 13.5, -42.5), 0x4f5f7a));
    mesh(casas, mCor, 'Cidade_Casas'); mesh(telhados, mCor, 'Cidade_Telhados'); mesh(janelas, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, emissive: 0x332200, emissiveIntensity: 0.4 }), 'Cidade_Janelas');
  }

  // =====================================================================
  // ESTADO E ANIMAÇÃO
  // =====================================================================
  const estado = { rota: 'principal', s: 0.5, v: 0, vMax: opts.velocidade ?? 12, rodando: false, impacto: false, s0: 0.5, alavancaAng: 0, agulhaAlvo: 0, agulha: 0, aoImpacto: null, aoFim: null, travado: false };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
  function posicionarBonde() {
    const c = ROTAS[estado.rota], len = c.getLength();
    const uF = THREE.MathUtils.clamp((estado.s + 1.7) / len, 0, 1), uR = THREE.MathUtils.clamp((estado.s - 2.33) / len, 0, 1);
    c.getPointAt(uF, tmpA); c.getPointAt(uR, tmpB);
    const d = tmpA.clone().sub(tmpB).normalize();
    bonde.position.copy(tmpB).addScaledVector(d, 2.33); bonde.position.y = Y_TRILHO;
    bonde.rotation.set(0, Math.atan2(-d.z, d.x), 0);
  }
  function aplicarAlavanca(instantaneo) {
    estado.agulhaAlvo = estado.rota === 'ramal' ? 1 : 0;
    if (instantaneo) estado.agulha = estado.agulhaAlvo;
  }
  const api = {
    root, estado, S_DESVIO,
    get rota() { return estado.rota; },
    // troca a posição do desvio (só antes de o bonde passar pela agulha)
    alternarAlavanca() { if (estado.travado) return false; estado.rota = estado.rota === 'principal' ? 'ramal' : 'principal'; aplicarAlavanca(false); posicionarBonde(); return true; },
    definirRota(r) { if (estado.travado || r === estado.rota) return false; estado.rota = r; aplicarAlavanca(false); posicionarBonde(); return true; },
    // nova rodada: sorteia dois papéis diferentes (e diferentes dos atuais) para os dois trilhos
    async sortearPersonagens() {
      const PAPEIS = ['trabalhador', 'idoso', 'gestante', 'criancas', 'estudante', 'cientista', 'colega', 'vinculo', 'desconhecidos'];
      const atuais = [estado.presets?.[0], estado.presets?.[1]];
      const pool = PAPEIS.filter(p => !atuais.includes(p));
      const a = pool.splice(Math.floor(Math.random() * pool.length), 1)[0], b = pool[Math.floor(Math.random() * pool.length)];
      await api.configurar({ presetPrincipal: a, nPrincipal: 1, presetRamal: b, nRamal: 3 });
      return [a, b];
    },
    async configurar({ presetPrincipal = 'trabalhador', nPrincipal = 1, presetRamal = 'desconhecidos', nRamal = 3 } = {}) {
      await garantirPersonagens([presetPrincipal, presetRamal]);
      estado.presets = [presetPrincipal, presetRamal];
      montarGrupo(grupoPrincipal, POS_PRINCIPAL, presetPrincipal, nPrincipal);
      montarGrupo(grupoRamal, POS_RAMAL, presetRamal, nRamal);
      // pessoas ficam de frente para a câmera (sul)
    },
    partir() { if (!estado.rodando) { estado.rodando = true; } },
    pausar() { estado.rodando = false; },
    reiniciar() {
      Object.assign(estado, { s: estado.s0, v: 0, rodando: false, impacto: false, travado: false });
      [grupoPrincipal, grupoRamal].forEach(g => { g.userData.caido = 0; g.children.forEach((p, i) => { p.rotation.x = 0; p.position.y = 0; p.position.z = (i % 2) * 0.25 - 0.1; p.scale.setScalar(1); });
        g.userData.fantasmas.children.forEach(f => { f.scale.setScalar(PEQ); f.position.copy(f.userData.base); }); });
      posicionarBonde();
    },
    irPara(rota, s) { estado.rota = rota; aplicarAlavanca(true); estado.s = s; estado.travado = s + 6.6 > S_DESVIO; posicionarBonde(); },
    S_ALVO,
    atingido() { return estado.rota === 'principal' ? 'principal' : 'ramal'; },
    alvoToque, alavanca,
    // partes que se movem durante a rodada (para gravar o percurso da RA nativa do iPhone)
    partesMoveis: () => [bonde, haste, ...agulhas.map(a => a.piv), disco, ...grupoPrincipal.children, ...grupoRamal.children, ...grupoPrincipal.userData.fantasmas.children, ...grupoRamal.userData.fantasmas.children],
    update(dt) {
      // alavanca e agulhas acompanham o estado com suavidade
      const alvoAng = estado.rota === 'ramal' ? 0.55 : -0.55;
      haste.rotation.z += (alvoAng - haste.rotation.z) * Math.min(1, dt * 8);
      estado.agulha += (estado.agulhaAlvo - estado.agulha) * Math.min(1, dt * 6);
      agulhas.forEach(({ piv, lado }) => { piv.rotation.y = -0.022 * estado.agulha + (lado < 0 ? 0 : 0); piv.position.z = ZB + lado * (BITOLA / 2 - 0.09) - estado.agulha * 0.08; });
      disco.rotation.y = estado.agulha * Math.PI / 2;
      if (estado.rodando) {
        const c = ROTAS[estado.rota], len = c.getLength();
        // parte da estação, dá a volta e para de novo na estação (ponto final = ponto de partida)
        const sFim = len - 1.8, frenagem = 1.4;                       // m/s² na chegada
        const vLim = Math.sqrt(Math.max(0, 2 * frenagem * (sFim - estado.s)));
        const alvo = Math.min(estado.vMax, vLim);
        estado.v += (alvo - estado.v) * Math.min(1, dt * (alvo < estado.v ? 4 : 0.6));
        const ds = Math.min(estado.v * dt, Math.max(0, sFim - estado.s)); estado.s += ds;
        rodeiros.forEach(r => { r.rotation.z -= ds / 0.35; });
        if (!estado.travado && estado.s + 6.6 > S_DESVIO) estado.travado = true;           // passou da agulha: decisão travada
        const sAlvo = S_ALVO[estado.rota], grupo = estado.rota === 'principal' ? grupoPrincipal : grupoRamal;
        if (!estado.impacto && estado.s + 6.8 >= sAlvo - 0.6) { estado.impacto = true; grupo.userData.caido = 0.0001; estado.aoImpacto && estado.aoImpacto(estado.rota); }
        if (estado.s >= sFim - 0.02) { estado.s = sFim; estado.v = 0; estado.rodando = false; estado.aoFim && estado.aoFim(estado.rota); }
        posicionarBonde();
      }
      // atingidos: o boneco some e o fantasminha sobe (~3,2 s), como no Dilema do Bonde 2D
      for (const g of [grupoPrincipal, grupoRamal]) if (g.userData.caido > 0 && g.userData.caido < 1) {
        g.userData.caido = Math.min(1, g.userData.caido + dt / 3.4);
        const k = g.userData.caido, ESC_F = ESC_PERS * 0.95;
        g.children.forEach(p => p.scale.setScalar(Math.max(PEQ, 1 - k * 8)));
        g.userData.fantasmas.children.forEach((f, i) => {
          const t = THREE.MathUtils.clamp((k - i * 0.025) / 0.94, 0, 1);
          const e = t < 0.08 ? t / 0.08 : t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1;
          f.scale.setScalar(Math.max(PEQ, ESC_F * e * (0.92 + 0.12 * t)));
          f.position.set(f.userData.base.x + Math.sin(t * 9 + i) * 0.25, f.userData.base.y + 0.2 + t * 7.5 + t * t * 2, f.userData.base.z);
          matFantasma.opacity = 0.88;
        });
      }
    },
  };
  await api.configurar(opts.grupos);
  aplicarAlavanca(true); posicionarBonde();
  return api;
}
