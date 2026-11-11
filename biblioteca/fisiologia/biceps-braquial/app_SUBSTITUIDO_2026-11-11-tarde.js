/* Bíceps braquial · RA — 10/11/2026
   ---------------------------------------------------------------------------
   O MODELO (modelo.glb). Ossos, tendões das duas cabeças e membrana interóssea
   vêm do BodyParts3D (DBCLS, CC BY), membro superior direito, em metros, y para
   cima e face anterior para +z. Os ventres musculares são os do modelo do autor,
   encaixados no trajeto do BodyParts3D; cartilagens e ligamentos são peças
   esquemáticas modeladas sobre a superfície dos ossos. Cada peça tem nome
   próprio no arquivo (umero, radio, ulna, escapula, clavicula, ventres_biceps,
   tendoes_cabeca_longa, tendoes_cabeca_curta, cartilagem_*, ligamento_*,
   aponeurose_bicipital, membrana_interossea) e é por esse nome que a página
   escolhe material, rótulo e botão.

   O MOVIMENTO (10/11/2026, ciclo de 8 s gravado no próprio GLB/USDZ):
   0–1 s posição anatômica; 1–2,5 s pronação com o bíceps relaxado (o tendão se
   enrola no rádio); 2,5–5 s contração: supinação + flexão do cotovelo até 95°,
   com o ventre encurtando e engrossando; 5–5,5 s cotovelo fletido; 5,5–7,5 s
   relaxamento e extensão; 7,5–8 s repouso. Antebraço e rádio giram como peças
   rígidas (nós "antebraco" e "radio_pronossupinacao", eixos do cotovelo e da
   pronossupinação); ventres, tendões, aponeurose e membrana interóssea se
   deformam (morph targets no GLB; esqueleto no USDZ, que é o que o Quick Look
   do iPhone reproduz). Amplitudes didáticas, em câmera lenta.

   A RA. iPhone/iPad: link rel="ar" escrito no HTML apontando para modelo.usdz
   (gerado do mesmo GLB) — abre o Quick Look no mesmo toque, sem conversão na
   hora. Android: model-viewer com o GLB (ra-android.js cuida dos aparelhos sem
   o serviço de RA do Google). */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
const DECODIFICADOR = 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/libs/draco/gltf/';

const $ = id => document.getElementById(id);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const stage = $('stage'), canvas = $('scene');

/* ── Cena ─────────────────────────────────────────────────────────────── */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.005, 20);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 0.12; controls.maxDistance = 2.2;
scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3a44, 1.25));
const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(0.6, 1.4, 1.2); scene.add(key);
const rim = new THREE.DirectionalLight(0xbfd8ff, 0.8); rim.position.set(-1, 0.6, -1.2); scene.add(rim);

function resize() {
  const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage); resize();

/* ── Materiais ────────────────────────────────────────────────────────── */
const mat = (name, color, roughness, extra = {}) =>
  Object.assign(new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...extra }), { name });
// Osso: base bege com manchas suaves (textura feita na página, sem arquivo).
const boneMap = (() => {
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S; const cx = cv.getContext('2d');
  cx.fillStyle = 'rgb(206,186,152)'; cx.fillRect(0, 0, S, S);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const blob = (x, y, r, col, a) => { const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.globalAlpha = a; cx.fillStyle = g; cx.fillRect(x - r, y - r, r * 2, r * 2); };
  for (let i = 0; i < 140; i++) { const x = rnd() * S, y = rnd() * S, r = 30 + rnd() * 110; for (const [ox, oy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) blob(x + ox, y + oy, r, rnd() < 0.55 ? 'rgb(168,142,106)' : 'rgb(232,216,186)', 0.08 + rnd() * 0.07); }
  cx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const M = {
  bone: mat('osso', 0xffffff, 0.62, { map: boneMap }),
  cartilage: mat('cartilagem', 0xcfe0de, 0.3),
  tendon: mat('tendao', 0xece2d8, 0.45),
  ligament: mat('tecido_conjuntivo', 0xf1ebdd, 0.6, { side: THREE.DoubleSide }),
};
// UV por projeção na face dominante, para a textura do osso cobrir malhas sem UV.
function boxUV(geom, scale) {
  const g = geom.index ? geom.toNonIndexed() : geom, p = g.attributes.position.array, uv = new Float32Array(p.length / 3 * 2);
  for (let i = 0; i < p.length; i += 9) {
    const ux = p[i + 3] - p[i], uy = p[i + 4] - p[i + 1], uz = p[i + 5] - p[i + 2], vx = p[i + 6] - p[i], vy = p[i + 7] - p[i + 1], vz = p[i + 8] - p[i + 2];
    const nx = Math.abs(uy * vz - uz * vy), ny = Math.abs(uz * vx - ux * vz), nz = Math.abs(ux * vy - uy * vx);
    for (let k = 0; k < 3; k++) { const x = p[i + k * 3], y = p[i + k * 3 + 1], z = p[i + k * 3 + 2], o = (i / 3 + k) * 2;
      if (nx >= ny && nx >= nz) { uv[o] = z; uv[o + 1] = y; } else if (ny >= nz) { uv[o] = x; uv[o + 1] = z; } else { uv[o] = x; uv[o + 1] = y; }
      uv[o] *= scale; uv[o + 1] *= scale; }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}

/* ── Modelo ───────────────────────────────────────────────────────────── */
const BONES = ['umero', 'radio', 'ulna', 'escapula', 'clavicula'];
const groups = { soft: [], conj: [], cart: [] }, part = {};
let LABELS = [], ready = false, home = null, mixer = null, playing = true, clipTime = 0;
const clock = new THREE.Clock();
const loader = new GLTFLoader(); loader.setDRACOLoader(new DRACOLoader().setDecoderPath(DECODIFICADOR));
loader.load('modelo.glb?v=correcao-20261111', gltf => {
  const model = gltf.scene;
  model.traverse(o => {
    if (!o.isMesh) return;
    const name = o.name; part[name] = o;
    if (BONES.some(b => name.startsWith(b))) { o.geometry = boxUV(o.geometry, 9); o.material = M.bone; }
    else if (name.startsWith('cartilagem')) { o.material = M.cartilage; groups.cart.push(o); }
    else if (name.startsWith('tendoes')) { o.material = M.tendon.clone(); groups.soft.push(o); }
    else if (name.startsWith('ventres')) { o.material = o.material.clone(); o.material.side = THREE.DoubleSide; groups.soft.push(o); }
    else { o.material = M.ligament; groups.conj.push(o); }
  });
  scene.add(model); window.__model = model;
  if (gltf.animations.length) { mixer = new THREE.AnimationMixer(model); mixer.clipAction(gltf.animations[0]).play(); }
  model.updateMatrixWorld(true);
  buildLabels(model); frame(); ready = true;
  for (const id of ['toggleLabels', 'toggleXray', 'toggleConj', 'toggleCart', 'resetView', 'toggleMove']) $(id).disabled = false;
}, ev => { if (ev.total) $('loadStatus').textContent = `Carregando modelo… ${Math.round(ev.loaded / ev.total * 100)}%`; },
() => { $('loadStatus').textContent = 'O modelo não carregou. Recarregue a página.'; });

// Posição atual de um vértice, já com a deformação do instante (morph) e o movimento dos nós.
function vpos(mesh, i, out = V()) {
  const p = mesh.geometry.attributes.position; out.fromBufferAttribute(p, i);
  const ma = mesh.geometry.morphAttributes.position, inf = mesh.morphTargetInfluences;
  if (ma && inf) { const rel = mesh.geometry.morphTargetsRelative; for (let k = 0; k < ma.length; k++) { const w = inf[k]; if (!w) continue; const a = ma[k]; if (rel) { out.x += a.getX(i) * w; out.y += a.getY(i) * w; out.z += a.getZ(i) * w; } } }
  return mesh.localToWorld(out);
}
const worldPts = mesh => { const p = mesh.geometry.attributes.position, a = []; for (let i = 0; i < p.count; i++) a.push(vpos(mesh, i)); return a; };
const argBy = (a, f) => { let bi = 0, bv = -Infinity; a.forEach((v, i) => { const s = f(v); if (s > bv) { bv = s; bi = i; } }); return bi; };
const nearestIdx = (a, q) => argBy(a, v => -v.distanceToSquared(q));

function frame() {
  const vb = new THREE.Box3().setFromObject(part.ventres_biceps), c = vb.getCenter(V()); c.y -= 0.02; c.z += 0.03;
  const dir = V(-0.55, 0.16, 1).normalize(), wide = stage.clientWidth > 700;
  home = { target: c.clone(), pos: c.clone().addScaledVector(dir, wide ? 0.84 : 1.05) };
  camera.position.copy(home.pos); controls.target.copy(home.target); controls.update();
}

/* ── Rótulos projetados (presos a vértices: acompanham o movimento) ───── */
// As duas cabeças lado a lado: 2-médias no plano x-z da faixa do meio do ventre (a lateral, −x no braço direito, é a longa).
const duasCabecas = (lista, P) => {
  let a = lista.reduce((m, i) => P(i).x < P(m).x ? i : m, lista[0]), b = lista.reduce((m, i) => P(i).x > P(m).x ? i : m, lista[0]);
  let ca = [P(a).x, P(a).z], cb = [P(b).x, P(b).z], A = [], B = [];
  for (let it = 0; it < 15; it++) {
    A = []; B = [];
    for (const i of lista) { const p = P(i), da = (p.x - ca[0]) ** 2 + (p.z - ca[1]) ** 2, db = (p.x - cb[0]) ** 2 + (p.z - cb[1]) ** 2; (da <= db ? A : B).push(i); }
    const m = L => [L.reduce((s, i) => s + P(i).x, 0) / L.length, L.reduce((s, i) => s + P(i).z, 0) / L.length];
    if (A.length) ca = m(A); if (B.length) cb = m(B);
  }
  return ca[0] <= cb[0] ? [A, B] : [B, A];
};

const labelsEl = $('labels'), svg = $('leaders');
function buildLabels() {
  const LTm = part.tendoes_cabeca_longa, STm = part.tendoes_cabeca_curta, VBm = part.ventres_biceps;
  const LT = worldPts(LTm), ST = worldPts(STm), VB = worldPts(VBm);
  const vbb = new THREE.Box3().setFromPoints(VB), midY = (vbb.min.y + vbb.max.y) / 2, midX = (vbb.min.x + vbb.max.x) / 2;
  const bandIdx = VB.map((v, i) => i).filter(i => Math.abs(VB[i].y - midY) < 0.006);
  const antOf = list => list.reduce((m, i) => VB[i].z > VB[m].z ? i : m, list[0]);
  const [cabL, cabS] = duasCabecas(bandIdx, i => VB[i]);
  const at = (mesh, idx, off = V()) => ({ mesh, idx, off });
  LABELS = [
    { a: at(LTm, argBy(LT, v => v.y)), k: 'Origem · cabeça longa', t: 'Tubérculo supraglenoidal', c: '#e8472a', dx: -78, dy: -48, ign: [LTm] },
    { a: at(STm, argBy(ST, v => v.y)), k: 'Origem · cabeça curta', t: 'Processo coracoide', c: '#e8472a', dx: 80, dy: -22, ign: [STm] },
    { a: at(LTm, argBy(LT, v => -v.y)), k: 'Inserção', t: 'Tuberosidade do rádio', c: '#2d6ad9', dx: -82, dy: 38, ign: [LTm] },
    { a: at(VBm, antOf(cabL), V(0, 0, 0.002)), t: 'Cabeça longa', c: '#b0423a', dx: -84, dy: -4, m: true, ign: [VBm] },
    { a: at(VBm, antOf(cabS), V(0, 0, 0.002)), t: 'Cabeça curta', c: '#b0423a', dx: 84, dy: 10, m: true, ign: [VBm] },
  ];
  const ctr = mesh => { const w = worldPts(mesh); return { w, c: w.reduce((s, v) => s.add(v), V()).multiplyScalar(1 / w.length) }; };
  if (part.aponeurose_bicipital) { const { w, c } = ctr(part.aponeurose_bicipital); LABELS.push({ a: at(part.aponeurose_bicipital, nearestIdx(w, c.add(V(0, 0, 0.02)))), t: 'Aponeurose bicipital', c: '#e8d7b3', dx: 86, dy: 28, grp: 'conj', ign: [part.aponeurose_bicipital] }); }
  if (part.ligamento_transverso_umero) { const { w, c } = ctr(part.ligamento_transverso_umero); LABELS.push({ a: at(part.ligamento_transverso_umero, nearestIdx(w, c.add(V(0, 0, 0.01)))), t: 'Lig. transverso do úmero', c: '#e8d7b3', dx: -92, dy: 4, grp: 'conj', ign: [part.ligamento_transverso_umero, LTm] }); }
  if (part.ligamento_anular_radio) { const { w, c } = ctr(part.ligamento_anular_radio); LABELS.push({ a: at(part.ligamento_anular_radio, nearestIdx(w, c.add(V(-0.02, 0, 0.01)))), t: 'Lig. anular do rádio', c: '#e8d7b3', dx: -88, dy: 2, grp: 'conj', ign: [part.ligamento_anular_radio] }); }
  for (const L of LABELS) {
    L.p = V();
    L.el = document.createElement('div'); L.el.className = 'lbl ' + (L.dx < 0 ? 'l' : 'r') + (L.m ? ' m' : '');
    const s = document.createElement('span'); s.style.borderLeftColor = L.c;
    if (L.k) { const b = document.createElement('b'); b.style.color = L.c; b.textContent = L.k; s.append(b); }
    s.append(L.t); L.el.append(s);
    L.dot = document.createElement('div'); L.dot.className = 'dot'; L.dot.style.background = L.c;
    L.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    labelsEl.append(L.el, L.dot); svg.append(L.line);
  }
}
const ray = new THREE.Raycaster(), tmp = V();
let lastOcc = 0, labelsOn = true, conjOn = true;
function updateLabels(now) {
  const w = stage.clientWidth, h = stage.clientHeight;
  const doOcc = now - lastOcc > 160; if (doOcc) lastOcc = now;
  for (const L of LABELS) {
    vpos(L.a.mesh, L.a.idx, L.p).add(L.a.off);
    tmp.copy(L.p).project(camera);
    const x = (tmp.x + 1) / 2 * w, y = (1 - tmp.y) / 2 * h;
    const vis = labelsOn && tmp.z < 1 && (L.grp !== 'conj' || conjOn);
    if (labelsOn && (doOcc || L.occ === undefined)) {
      const dist = camera.position.distanceTo(L.p);
      ray.set(camera.position, tmp.copy(L.p).sub(camera.position).normalize());
      const hit = ray.intersectObject(window.__model, true).find(hh => hh.object.visible && !L.ign.includes(hh.object));
      L.occ = !!hit && hit.distance < dist - 0.004;
    }
    const op = vis ? (L.occ ? 0.25 : 1) : 0;
    L.el.style.opacity = L.dot.style.opacity = L.line.style.opacity = op;
    L.el.style.left = (x + L.dx) + 'px'; L.el.style.top = (y + L.dy) + 'px';
    L.dot.style.left = x + 'px'; L.dot.style.top = y + 'px';
    L.line.setAttribute('x1', x); L.line.setAttribute('y1', y); L.line.setAttribute('x2', x + L.dx); L.line.setAttribute('y2', y + L.dy);
  }
}
const FASES = [[1, 'Posição anatômica · relaxado'], [2.5, 'Pronação · bíceps relaxado, tendão enrola no rádio'], [5, 'Contração · supinação + flexão do cotovelo'], [5.5, 'Cotovelo fletido · ventre curto e grosso'], [7.5, 'Relaxamento · extensão do cotovelo'], [8.01, 'Posição anatômica · relaxado']];
let faseAtual = '';
renderer.setAnimationLoop(now => {
  const dt = clock.getDelta();
  if (mixer && playing) { mixer.update(dt); clipTime = mixer.time % 8; }
  controls.update(); renderer.render(scene, camera);
  if (ready) {
    updateLabels(now);
    const f = (FASES.find(([t]) => clipTime < t) || FASES[0])[1];
    if (f !== faseAtual) { faseAtual = f; $('loadStatus').textContent = f; }
  }
});

/* ── Controles ────────────────────────────────────────────────────────── */
const toggle = (id, fn) => { const b = $(id); b.onclick = () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); fn(on); }; };
toggle('toggleLabels', on => { labelsOn = on; });
toggle('toggleXray', on => { for (const m of groups.soft) { const mt = m.material; mt.transparent = on; mt.opacity = on ? 0.3 : 1; mt.depthWrite = !on; mt.needsUpdate = true; } });
toggle('toggleConj', on => { conjOn = on; for (const m of groups.conj) m.visible = on; });
toggle('toggleCart', on => { for (const m of groups.cart) m.visible = on; });
toggle('toggleMove', on => { playing = on; $('toggleMove').textContent = on ? 'Pausar movimento' : 'Retomar movimento'; });
$('resetView').onclick = () => { if (!home) return; camera.position.copy(home.pos); controls.target.copy(home.target); controls.update(); };
$('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await stage.requestFullscreen(); } catch { $('fullscreen').textContent = 'Ampliar indisponível'; } };
$('exitFullscreen').onclick = () => document.exitFullscreen();
document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Reduzir' : 'Ampliar'; resize(); });

/* ── Abas ─────────────────────────────────────────────────────────────── */
const tabs = [...document.querySelectorAll('.study-tabs [role="tab"]')];
function abrirAba(tab) {
  for (const t of tabs) { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; $(t.getAttribute('aria-controls')).hidden = !on; }
  if (tab.id === 'tab-ra') prepararRA();
}
tabs.forEach((t, i) => {
  t.onclick = () => abrirAba(t);
  t.onkeydown = e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); abrirAba(n); };
});

/* ── Realidade aumentada ──────────────────────────────────────────────── */
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
$('raIOS').hidden = !IOS; $('raOutros').hidden = IOS;
const mv = $('arViewer');
let raPreparada = false;
function prepararRA() {
  if (IOS || raPreparada) return; raPreparada = true;
  $('raStatus').textContent = 'Preparando o modelo…';
  mv.setAttribute('loading', 'eager'); if (mv.dismissPoster) mv.dismissPoster();
}
mv.addEventListener('load', () => {
  $('launchAR').disabled = !mv.canActivateAR;
  $('raStatus').textContent = mv.canActivateAR ? 'Pronto para RA · tamanho real (cerca de 55 cm do ombro ao antebraço).' : 'Modelo 3D pronto. Para RA, use o Safari no iPhone/iPad ou o Chrome num Android compatível.';
});
mv.addEventListener('error', () => { $('launchAR').disabled = true; $('raStatus').textContent = 'A prévia de RA não carregou. O modelo 3D continua disponível acima.'; });
$('launchAR').onclick = () => { mv.activateAR().catch(() => { $('raStatus').textContent = 'A câmera não abriu. Confira a compatibilidade e a permissão no aparelho.'; }); };
