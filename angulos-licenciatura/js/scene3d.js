// Cena 3D da escola (versão Licenciatura; three.js local). Personagens e equipamentos são modelos GLB (assets/modelos);
// paredes, piso e textos legíveis (cartaz, maquininha, celular, papéis) são primitivas e texturas em canvas.
import * as THREE from "../vendor/three.module.min.js";
import { GLTFLoader } from "../vendor/GLTFLoader.js";
import { MeshoptDecoder } from "../vendor/meshopt_decoder.module.js";
import { clone as cloneSkinned } from "../vendor/SkeletonUtils.js";
import { FOTOS, PAPEIS, txt } from "./content/cena.js";

const PESSOA_POS = {}; // id → THREE.Vector3 (pés)

function tex(linhas, { w = 512, h = 256, bg = "#f8fafc", fg = "#0f172a", font = 34, align = "center", pad = 20, extra } = {}) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = fg; g.textBaseline = "middle"; g.textAlign = align;
  const lh = font * 1.25;
  const y0 = h / 2 - ((linhas.length - 1) * lh) / 2;
  linhas.forEach((l, i) => {
    const f = typeof l === "object" ? l : { t: l };
    g.font = `${f.b ? "800" : "600"} ${f.s || font}px Sora, Arial, sans-serif`;
    g.fillStyle = f.c || fg;
    g.fillText(f.t, align === "center" ? w / 2 : pad, y0 + i * lh);
  });
  if (extra) extra(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05, ...o });

// Piso discreto em escala arquitetônica; o padrão é gerado localmente, sem imagens externas.
function materialPiso(cor) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"); g.fillStyle = cor; g.fillRect(0, 0, 256, 256);
  let seed = 3917;
  for (let i = 0; i < 950; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0; const x = seed % 256;
    seed = (seed * 1664525 + 1013904223) >>> 0; const y = seed % 256;
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.04)";
    g.fillRect(x, y, 1 + (i % 2), 1);
  }
  g.strokeStyle = "rgba(0,0,0,0.12)"; g.lineWidth = 1;
  g.strokeRect(0.5, 0.5, 255, 255);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(12, 8.5); t.anisotropy = 4;
  return mat("#ffffff", { map: t, roughness: 0.92, metalness: 0 });
}

function caixa(w, h, d, m, x, y, z, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof m === "object" && m.isMaterial ? m : mat(m));
  mesh.position.set(x, y, z); mesh.rotation.y = ry;
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

function placa(w, h, textura, x, y, z, ry = 0, rx = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: textura, roughness: 0.9 }));
  m.position.set(x, y, z); m.rotation.order = "YXZ"; m.rotation.set(rx, ry, 0);
  return m;
}


// ---------- modelos ----------
const MODELOS = ["personal", "recep", "bia", "lara", "kaua", "colega", "joaquim", "dono", "homem", "mae", "treino",
  "k1", "k2", "k3", "k4", "k5", "k6", "avo", "zelador", "escrivaninha", "balcao", "supino", "torre", "suporte2", "halter", "halter2", "maquina", "bola", "envelope", "frasco", "carro", "deitado", "banco", "celular", "lixeira", "sacola", "mesa1", "mesa2", "mochila", "prateleira"];
const ANIM = {};
const BIB = {};
let carregando = null;
export function prepararCena(aoProgresso) {
  if (carregando) return carregando;
  const ld = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  let feitos = 0;
  carregando = Promise.all(MODELOS.map((id) => ld.loadAsync(new URL(`../assets/modelos/${id}.glb`, import.meta.url).href).then((g) => {
    g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    BIB[id] = g.scene; ANIM[id] = g.animations; feitos++; aoProgresso?.(feitos / MODELOS.length);
  })));
  return carregando;
}
export const cenaPronta = () => Object.keys(BIB).length === MODELOS.length;

function modelo(id, x, z, ry = 0, { y = 0, s = 1 } = {}) {
  const o = BIB[id].clone();
  o.position.set(x, y, z); o.rotation.y = ry; o.scale.setScalar(s);
  return o;
}

// Pessoa: modelo + ponto da cabeça (para os marcadores das fotos) + id para o teste de visibilidade.
function pessoa(id, modeloId, x, z, ry, { y = 0, altura } = {}) {
  const o = modelo(modeloId, x, z, ry, { y });
  const box = new THREE.Box3().setFromObject(o);
  const h = altura ?? box.max.y - y;
  o.userData.pid = id;
  o.traverse((m) => { if (m.isMesh) m.userData.pid = id; });
  const cab = new THREE.Vector3(x, y + h * 0.9, z);
  if (id) PESSOA_POS[id] = cab.clone();
  o.userData.cabeca = cab;
  return o;
}

// Ponta da mão estendida à frente (lado +x do modelo), em coordenadas do mundo.
const _v = new THREE.Vector3();
function maoFrente(o) {
  o.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(o.matrixWorld).invert();
  let melhor = null, mz = -1e9;
  o.traverse((m) => {
    if (!m.isMesh) return;
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 2) {
      _v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      const l = _v.clone().applyMatrix4(inv);
      if (l.x > 0.05 && l.y > 0.7 && l.y < 1.4 && l.z > mz) { mz = l.z; melhor = _v.clone(); }
    }
  });
  return melhor;
}

// Mão caída ao lado do corpo (lado = +1 ou -1 no x do modelo), em coordenadas do mundo.
function maoLado(o, lado) {
  o.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(o.matrixWorld).invert();
  let melhor = null, mx = -1e9;
  o.traverse((m) => {
    if (!m.isMesh) return;
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 2) {
      _v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      const l = _v.clone().applyMatrix4(inv);
      if (l.y > 0.6 && l.y < 0.95 && l.x * lado > mx) { mx = l.x * lado; melhor = _v.clone(); }
    }
  });
  return melhor;
}

// Ponto local (relativo a quem está em x,z virado para ry) → mundo.
function local(x, z, ry, dx, dy, dz) {
  const c = Math.cos(ry), s = Math.sin(ry);
  return [x + dx * c + dz * s, dy, z - dx * s + dz * c];
}

export const DEIT = { x: 8.9, y: 0.45, z: 2.4, ry: 0 };
const MESA1 = { x: 9.0, z: -6.45, ry: Math.PI / 2 };
const MESA2 = { x: -9.6, z: -7.6, ry: Math.PI / 2 };
const MOCH = { ry: -2.43, fx: 0.11, fy: 0.2 };
export function construirCena(pers) {
  for (const k of Object.keys(PESSOA_POS)) delete PESSOA_POS[k];
  const cena = new THREE.Scene();
  cena.background = new THREE.Color("#1e293b");
  cena.fog = new THREE.Fog("#1e293b", 30, 60);

  cena.add(new THREE.HemisphereLight("#eef2ff", "#3f3a33", 1.25));
  const luz = new THREE.DirectionalLight("#fff7e6", 1.5);
  luz.position.set(4, 12, 6); luz.castShadow = true;
  luz.shadow.mapSize.set(2048, 2048); luz.shadow.bias = -0.0004; luz.shadow.normalBias = 0.02;
  Object.assign(luz.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12 });
  cena.add(luz);
  for (const [x, z] of [[-6, -3], [4, -3], [-6, 4], [5, 4], [0, -6], [8, -6]]) {
    const p = new THREE.PointLight("#fff1d6", 6, 12, 1.6); p.position.set(x, 3.6, z); cena.add(p);
  }

  // Piso, paredes e teto aberto
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(24, 17), materialPiso("#788285"));
  piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; cena.add(piso);
  const borracha = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), mat("#1f2125"));
  borracha.rotation.x = -Math.PI / 2; borracha.position.set(8.2, 0.005, 2.2); borracha.receiveShadow = true; cena.add(borracha);
  // quadra (piso azul com linhas)
  const linhas = tex([""], { w: 700, h: 560, bg: "#326c9b", extra: (g) => { g.globalAlpha = 0.08; for (let i = 0; i < 45; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#193d60"; g.fillRect(0, (i * 97) % 560, 700, 1); } g.globalAlpha = 1; g.strokeStyle = "#f8fafc"; g.lineWidth = 8; g.strokeRect(20, 20, 660, 520); g.beginPath(); g.moveTo(350, 20); g.lineTo(350, 540); g.stroke(); g.beginPath(); g.arc(350, 280, 70, 0, Math.PI * 2); g.stroke(); g.strokeRect(20, 170, 90, 220); g.strokeRect(590, 170, 90, 220); } });
  const tapete = new THREE.Mesh(new THREE.PlaneGeometry(7, 5.6), new THREE.MeshStandardMaterial({ map: linhas, roughness: 0.7 }));
  tapete.rotation.x = -Math.PI / 2; tapete.position.set(-7.6, 0.005, 5.2); tapete.receiveShadow = true; cena.add(tapete);
  const parede = mat("#d6d3cd");
  cena.add(caixa(24, 4.2, 0.2, parede, 0, 2.1, -8.5));
  cena.add(caixa(24, 4.2, 0.2, parede, 0, 2.1, 8.5));
  cena.add(caixa(0.2, 4.2, 17, parede, 12, 2.1, 0));
  cena.add(caixa(0.2, 4.2, 6.6, parede, -12, 2.1, -5.2));
  cena.add(caixa(0.2, 4.2, 5.4, parede, -12, 2.1, 5.8));
  const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3, 5.2), new THREE.MeshStandardMaterial({ color: "#9bd3ff", transparent: true, opacity: 0.18, roughness: 0.1 }));
  vidro.position.set(-12, 1.5, 0.5); cena.add(vidro);
  cena.add(placa(3.6, 0.7, tex([{ t: "E. E. PARQUE DAS ÁGUAS", b: true, c: "#fff" }], { bg: "#1e3a8a", font: 50, h: 128 }), -11.88, 3.3, 0.5, Math.PI / 2));
  // espelho da área de pesos
  cena.add(caixa(0.04, 2.0, 5.5, new THREE.MeshStandardMaterial({ color: "#cbd5e1", roughness: 0.05, metalness: 0.9 }), 11.86, 1.3, 2.5));

  // Ambientação escolar: painéis, rodapés e luminárias mantêm livres as linhas de visão das fotos.
  const destaqueParede = mat("#b8cdd5", { roughness: 0.92 });
  cena.add(caixa(6.8, 2.3, 0.015, destaqueParede, -0.5, 2.25, -8.394));
  cena.add(caixa(6.8, 0.10, 0.018, "#315782", -0.5, 1.08, -8.383));
  cena.add(caixa(6.8, 0.06, 0.018, "#e9c770", -0.5, 3.40, -8.383));
  for (const x of [-3.5, -1.5, 0.5]) cena.add(caixa(0.035, 2.2, 0.018, "#d9e6e7", x, 2.23, -8.383));
  for (const x of [-8, 0, 8]) {
    const moldura = caixa(2.2, 0.06, 0.36, "#d9e3e8", x, 4.07, -2.4);
    cena.add(moldura);
    const difusor = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 0.22), new THREE.MeshBasicMaterial({ color: "#fff8e7" }));
    difusor.rotation.x = Math.PI / 2; difusor.position.set(x, 4.035, -2.4); cena.add(difusor);
  }

  // Ginásio escolar: detalhes fixos na parede não alteram as pistas nem a circulação.
  cena.add(caixa(23.7, 0.16, 0.035, "#647b88", 0, 0.10, 8.38));
  cena.add(caixa(23.7, 0.08, 0.035, "#718fa3", 0, 2.05, 8.38));
  for (const x of [-9.8, -5.8, -1.8, 2.2, 6.2, 10.2]) {
    cena.add(caixa(2.5, 0.88, 0.04, "#708b9a", x, 3.38, 8.37));
    cena.add(caixa(2.32, 0.72, 0.05, new THREE.MeshStandardMaterial({ color: "#c9e2eb", roughness: 0.38, metalness: 0.08 }), x, 3.38, 8.34));
    cena.add(caixa(0.055, 0.72, 0.06, "#829aa5", x, 3.38, 8.30));
  }
  // Tabela e aro identificam a quadra; a rede é formada por fios leves.
  cena.add(caixa(1.25, 0.78, 0.06, "#ecf1f1", -8.4, 3.06, 8.30));
  cena.add(caixa(0.50, 0.04, 0.02, "#d86a45", -8.4, 3.02, 8.25));
  cena.add(caixa(0.04, 0.30, 0.02, "#d86a45", -8.65, 3.17, 8.25));
  cena.add(caixa(0.04, 0.30, 0.02, "#d86a45", -8.15, 3.17, 8.25));
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.018, 6, 24), mat("#e96a38"));
  aro.rotation.x = Math.PI / 2; aro.position.set(-8.4, 2.98, 7.99); cena.add(aro);
  const redeMat = mat("#e7ecea");
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 4), redeMat);
    fio.position.set(-8.4 + Math.cos(a) * 0.16, 2.80, 7.99 + Math.sin(a) * 0.16);
    fio.rotation.z = Math.cos(a) * 0.35; fio.rotation.x = -Math.sin(a) * 0.35; cena.add(fio);
  }

  // Estacionamento (fora)
  const asfalto = new THREE.Mesh(new THREE.PlaneGeometry(12, 17), mat("#26282c"));
  asfalto.rotation.x = -Math.PI / 2; asfalto.position.set(-18, -0.01, 0); cena.add(asfalto);
  // Rua e fachada ao fundo, afastadas das pessoas e dos objetos observáveis do caso.
  cena.add(caixa(0.22, 0.11, 17, "#9a9b96", -23.45, 0.045, 0));
  const calcada = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 17), mat("#8b8e88"));
  calcada.rotation.x = -Math.PI / 2; calcada.position.set(-24.45, 0.001, 0); calcada.receiveShadow = true; cena.add(calcada);
  for (const z of [-7, -3.5, 0, 3.5, 7]) {
    const linha = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 0.055), mat("#bbbdb3"));
    linha.rotation.x = -Math.PI / 2; linha.position.set(-20.4, 0.003, z); cena.add(linha);
  }
  // Fachadas discretas do outro lado da rua, sem letreiros ou personagens.
  for (const [z, largura, altura, cor] of [[-6.4, 5.4, 4.9, "#a9a49a"], [-0.4, 5.8, 4.2, "#b9b3a7"], [5.6, 5.4, 5.1, "#aaa9a1"]]) {
    cena.add(caixa(0.22, altura, largura, cor, -25.6, altura / 2, z));
    for (const dz of [-1.3, 1.3]) {
      cena.add(caixa(0.03, 1.05, 0.95, "#56676d", -25.47, 2.75, z + dz));
      cena.add(caixa(0.04, 0.86, 0.76, "#a7c0c4", -25.44, 2.75, z + dz));
      cena.add(caixa(0.05, 0.86, 0.035, "#6f858a", -25.41, 2.75, z + dz));
    }
    cena.add(caixa(0.03, 2.0, 1.0, "#676d68", -25.46, 1.0, z));
  }
  const carro = new THREE.Group();
  carro.add(modelo("carro", 0, 0, -Math.PI / 2)); // traseira (porta-malas aberto) para +z
  carro.add(caixa(0.42, 0.3, 0.34, "#f1f5f9", -0.3, 0.78, 1.55));
  carro.add(caixa(0.42, 0.3, 0.34, "#f1f5f9", 0.25, 0.78, 1.6));
  carro.add(caixa(0.38, 0.26, 0.32, "#e2e8f0", -0.02, 1.06, 1.55));
  carro.position.set(-16.4, 0, -2.6); carro.rotation.y = 0.85; cena.add(carro);
  cena.add(pessoa("homem", "homem", -14.0, -2.3, 0.9));

  // Recepção: dois módulos de balcão; o lado do cliente fica para +z
  cena.add(modelo("balcao", -1.55, -6.95, Math.PI));
  cena.add(modelo("balcao", 0.33, -6.95, Math.PI));
  const tampo = 1.1;
  cena.add(placa(0.15, 0.2, tex([{ t: "RECIBO", b: true, s: 34 }, { t: "Inscrição do time", s: 22 }, { t: "Jogos Escolares", s: 22 }, { t: "R$ 480,00", b: true, s: 34, c: "#15803d" }, { t: "PAGO", b: true, s: 30, c: "#b91c1c" }], { w: 300, h: 400, bg: "#fefce8", font: 22 }), 0.55, tampo + 0.004, -6.72, -0.4, -Math.PI / 2));
  // a entrega: envelope entre as mãos e um pote branco sem rótulo sobre o balcão, ao lado
  const pRy = Math.PI / 2, bRy = -Math.PI / 2;
  cena.add(pessoa("personal", "personal", -1.42, -6.0, pRy));
  cena.add(pessoa("bia", "bia", -0.42, -6.0, bRy));
  const bia = cena.children[cena.children.length - 1];
  {
    // envelope preso na mão estendida da aluna, saindo à frente dela em direção ao personal
    const m = maoFrente(bia);
    const f = new THREE.Vector3(Math.sin(bRy), 0, Math.cos(bRy));
    const env = modelo("envelope", 0, 0, bRy + Math.PI / 2);
    env.rotation.order = "YXZ"; env.rotation.x = -1.35;
    env.position.copy(m).addScaledVector(f, 0.07); env.position.y -= 0.035;
    cena.add(env);
  }
  cena.add(modelo("frasco", -0.98, -6.66, 0.4, { y: tampo }));
  cena.add(pessoa("recep", "recep", 0.25, -7.65, 0));
  cena.add(placa(1.8, 1.2, tex([{ t: "JOGOS ESCOLARES 2026", b: true, s: 42, c: "#fde047" }, { t: "Uniformes e premiação:", c: "#fff", s: 32 }, { t: "Vitta Suplementos & Manipulação", c: "#fff", s: 28 }, { t: "(patrocinadora oficial)", s: 26, c: "#cbd5e1" }], { w: 600, h: 400, bg: "#7c2d12", font: 38 }), 2.6, 1.8, -8.38));
  cena.add(placa(1.0, 0.3, tex([{ t: "SECRETARIA", b: true, c: "#0f172a" }], { h: 120, bg: "#e2e8f0" }), -0.6, 2.9, -8.38));
  cena.add(modelo("escrivaninha", -3.6, -7.95, 0));
  cena.add(modelo("prateleira", 4.6, -8.05, 0));

  // Aparelhos de peito entre a área de treino e a recepção (um deles tapa a visão do balcão)
  cena.add(modelo("maquina", 1.2, -3.45, Math.PI * 0.82));
  cena.add(modelo("maquina", 4.6, -3.0, Math.PI));

  // Sala de avaliação
  const vidroSala = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 4), new THREE.MeshStandardMaterial({ color: "#bfdbfe", transparent: true, opacity: 0.22 }));
  vidroSala.position.set(7, 1.3, -6.5); cena.add(vidroSala);
  cena.add(caixa(3.0, 2.6, 0.12, "#cbd5e1", 9.5, 1.3, -4.5));
  cena.add(placa(1.1, 0.3, tex([{ t: "EDUCAÇÃO FÍSICA", b: true, c: "#0f172a" }], { h: 120, bg: "#e2e8f0" }), 9.5, 2.35, -4.43));
  cena.add(modelo("mesa1", MESA1.x, MESA1.z, MESA1.ry));
  cena.add(placa(0.3, 0.42, tex(["Dr. M. A. Ferreira — CRM", "", "▬▬▬▬▬▬▬▬", "▬▬▬▬▬▬", "▬▬▬▬▬▬▬▬▬"], { w: 300, h: 420, bg: "#f8fafc", fg: "#64748b", font: 26, extra: (g) => { g.strokeStyle = "#1d4ed8"; g.lineWidth = 6; g.beginPath(); g.arc(200, 330, 55, 0, Math.PI * 2); g.stroke(); g.font = "700 20px Arial"; g.fillStyle = "#1d4ed8"; g.fillText("CARIMBO", 200, 330); } }), 8.6, 0.795, -6.3, 0.2, -Math.PI / 2));
  cena.add(caixa(0.13, 0.012, 0.24, "#020617", 8.8, 0.795, -6.85, -0.4));
  cena.add(placa(0.115, 0.22, tex([{ t: "chegou", s: 40, c: "#e2e8f0", b: true }, { t: "o seu ✓", s: 40, c: "#e2e8f0", b: true }], { w: 200, h: 400, bg: "#065f46", extra: (g) => { g.fillStyle = "#94a3b8"; g.font = "600 22px Arial"; g.fillText("19:02", 100, 40); } }), 8.8, 0.803, -6.85, -0.4, -Math.PI / 2));
  const planilha = ["TIME DA ESCOLA — % gordura", `${pers.n.kaua}  18% → 9%`, `${pers.n.colega}  21% → 19%`, "Marcela  28% → 26%", "Joel  25% → 23%", "Ana Clara  24% → 23%"];
  cena.add(placa(1.4, 1.0, tex(planilha.map((t, i) => ({ t, b: i === 0, s: i === 0 ? 30 : 28 })), { w: 560, h: 400, align: "left", bg: "#ffffff", font: 28 }), 11.88, 1.6, -5.0, -Math.PI / 2));

  // Pesos livres: supino, torre de halteres, suporte e halteres no chão
  cena.add(modelo("supino", 8.9, 2.4, -Math.PI / 2));
  {
    // aluno deitado no banco do supino (modelo com esqueleto, quadro final da animação "deitar")
    const d = cloneSkinned(BIB.deitado);
    const clip = ANIM.deitado.find((a) => /Lie/i.test(a.name));
    const mix = new THREE.AnimationMixer(d); const ac = mix.clipAction(clip); ac.play(); mix.setTime(clip.duration - 0.01);
    d.position.set(DEIT.x, DEIT.y, DEIT.z); d.rotation.y = DEIT.ry;
    d.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.frustumCulled = false; } });
    cena.add(d);
  }
  cena.add(pessoa("kaua", "kaua", 8.85, 3.75, Math.PI));
  cena.add(pessoa("colega", "colega", 6.9, 2.6, Math.PI / 2 - 0.15));
  {
    const col = cena.children[cena.children.length - 1];
    const cRy = Math.PI / 2 - 0.15, m = maoFrente(col);
    const cel = modelo("celular", 0, 0, cRy + Math.PI);
    cel.position.copy(m).add(new THREE.Vector3(Math.sin(cRy), 0, Math.cos(cRy)).multiplyScalar(0.02)); cel.position.y -= 0.09;
    cena.add(cel);
  }
  cena.add(modelo("torre", 10.9, 0.2, -Math.PI / 2));
  cena.add(modelo("torre", 10.9, 4.9, -Math.PI / 2));
  cena.add(modelo("suporte2", 6.0, 0.0, 0.3));
  cena.add(modelo("halter", 7.4, 4.9, 0.4));
  cena.add(modelo("halter", 7.7, 5.0, 0.2));
  cena.add(modelo("halter2", 9.7, 4.2, 1.2));
  // banco com a mochila aberta e o mesmo tipo de pote branco
  cena.add(modelo("banco", 7.6, 4.3, Math.PI / 2));
  const mRy = MOCH.ry;
  cena.add(modelo("mochila", 7.6, 4.3, mRy, { y: 0.45 }));
  cena.add(modelo("frasco", 7.6 + Math.sin(mRy) * MOCH.fx, 4.3 + Math.cos(mRy) * MOCH.fx, 0.2, { y: 0.45 + MOCH.fy }));

  // Corredor do vestiário
  cena.add(caixa(1.2, 2.2, 0.1, "#78716c", 6.4, 1.1, 8.4));
  cena.add(placa(1.0, 0.3, tex([{ t: "VESTIÁRIO", b: true }], { h: 120, bg: "#e7e5e4" }), 6.4, 2.45, 8.33, Math.PI));
  cena.add(modelo("lixeira", 5.4, 7.0, 0));
  const cx = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.08), [mat("#fff"), mat("#fff"), new THREE.MeshStandardMaterial({ map: tex([{ t: "...TERONA", b: true, s: 60, c: "#b91c1c" }, { t: "Farmácia São Luiz", s: 30, c: "#334155" }], { w: 400, h: 200, bg: "#ffffff" }) }), mat("#fff"), mat("#fff"), mat("#fff")]);
  cx.position.set(5.6, 0.62, 6.9); cx.rotation.set(0.2, 0.5 + Math.PI, 0.1); cena.add(cx);
  const jRy = Math.PI + 0.5;
  cena.add(pessoa("joaquim", "joaquim", 6.3, 7.5, jRy));
  {
    const jo = cena.children[cena.children.length - 1];
    const m = maoLado(jo, -1);
    const sac = modelo("sacola", 0, 0, jRy + Math.PI / 2);
    sac.position.set(m.x, m.y - 0.36, m.z); cena.add(sac);
    const cruz = placa(0.1, 0.1, tex([{ t: "+", b: true, s: 160, c: "#16a34a" }], { w: 200, h: 200, bg: "#f5e6c8" }), 0, 0, 0, 0);
    cruz.position.set(m.x, m.y - 0.2, m.z).add(new THREE.Vector3(Math.sin(jRy), 0, Math.cos(jRy)).multiplyScalar(0.085)); cruz.rotation.y = jRy; cena.add(cruz);
  }

  // Aula funcional
  cena.add(pessoa("lara", "lara", -6.2, 3.5, Math.PI - 0.35));
  const turma = [["k1", -9.0, 5.4], ["k3", -8.0, 5.3], ["k4", -7.0, 5.5], ["k2", -9.3, 6.6], ["k5", -8.2, 6.7], ["k6", -7.1, 6.8]];
  const soma = new THREE.Vector3();
  for (const [mid, x, z] of turma) {
    const ry = Math.atan2(-6.2 - x, 3.5 - z);
    const p = pessoa(null, mid, x, z, ry); p.traverse((m) => { if (m.isMesh) m.userData.pid = "turma"; });
    cena.add(p); soma.add(p.userData.cabeca);
  }
  PESSOA_POS.turma = soma.divideScalar(turma.length);
  cena.add(modelo("bola", -9.8, 4.6, 0)); cena.add(modelo("bola", -6.6, 6.2, 0));
  cena.add(placa(1.4, 1.0, tex([{ t: "JOGOS ESCOLARES", b: true, c: "#fde047" }, "1º Parque das Águas", "2º Colégio Horizonte", "3º E. E. Vila Nova"], { w: 500, h: 360, bg: "#1e293b", fg: "#f8fafc", font: 36 }), -4.6, 1.5, -1.6, 0.9));
  cena.add(caixa(0.06, 1.0, 0.06, "#334155", -4.6, 0.5, -1.6));
  // praticante treinando na frente da vista para o balcão
  cena.add(pessoa("treino", "treino", -2.75, -3.2, 0.75));
  {
    for (const lado of [-1, 1]) {
      const [hx, , hz] = local(-2.75, -3.2, 0.75, 0.2 * lado, 0, 0.36);
      const h = modelo("halter2", hx, hz, 0.75 + Math.PI / 2, { y: 1.08 }); cena.add(h);
    }
  }

  // Mezanino
  cena.add(caixa(5, 0.2, 4.6, "#57534e", -9.5, 3.2, -6.2));
  for (const [x, z] of [[-7.1, -4.0], [-7.1, -8.3]]) cena.add(caixa(0.2, 3.2, 0.2, "#44403c", x, 1.6, z));
  cena.add(caixa(0.05, 0.9, 4.6, "#a8a29e", -7.05, 3.75, -6.2));
  cena.add(caixa(5, 0.9, 0.05, "#a8a29e", -9.5, 3.75, -3.92));
  cena.add(modelo("mesa2", MESA2.x, MESA2.z, MESA2.ry, { y: 3.3 }));
  cena.add(placa(0.3, 0.4, tex([{ t: "CONTRATO DE", b: true, s: 30 }, { t: "PATROCÍNIO", b: true, s: 30 }, { t: "Vitta Suplementos", s: 26, c: "#1d4ed8" }, "▬▬▬▬▬", "▬▬▬▬"], { w: 300, h: 400, bg: "#fafaf9", font: 26 }), -9.7, 4.08, -7.45, 0.3, -Math.PI / 2));
  cena.add(pessoa("dono", "dono", -10.6, -6.9, 1.2, { y: 3.3 }));

  // Avô esperando do lado de fora do portão e zelador no canto da quadra (sem papel no caso)
  cena.add(modelo("avo", -13.4, 2.8, Math.PI / 2 + 0.4));
  cena.add(modelo("zelador", -11.2, 7.7, Math.PI * 0.85));
  // Mãe entrando
  cena.add(pessoa("mae", "mae", -10.3, 1.5, Math.PI / 2 + 0.25));

  // Outros aparelhos e pesos
  cena.add(modelo("torre", -2.6, 6.9, Math.PI));
  cena.add(modelo("suporte2", -1.0, 7.4, Math.PI));
  cena.add(modelo("maquina", 1.6, 6.6, Math.PI));

  return cena;
}

// Pessoa visível de fato na foto (não tapada por aparelho ou por outra pessoa)?
const ray = new THREE.Raycaster();
function visivel(cena, cam, pid, p) {
  const origem = cam.position;
  let vistos = 0;
  for (const dy of [0, -0.25, -0.55]) {
    const alvo = p.clone(); alvo.y += dy;
    const dir = alvo.clone().sub(origem); const dist = dir.length(); dir.normalize();
    ray.set(origem, dir); ray.far = dist + 0.4;
    const hit = ray.intersectObjects(cena.children, true).find((h) => h.object.isMesh && h.object.material && !h.object.material.transparent);
    if (!hit || hit.object.userData.pid === pid || hit.distance > dist - 0.35) vistos++;
  }
  return vistos >= 1;
}

let cache = null;
export function fotosDaCena(pers) {
  const chave = JSON.stringify(pers);
  if (cache && cache.chave === chave) return cache.fotos;
  const cena = construirCena(pers);
  const W = 1200, H = 800;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.outputColorSpace = THREE.SRGBColorSpace;
  // A cena das fotografias é estática: uma única atualização de sombras atende todos os ângulos.
  r.shadowMap.autoUpdate = false; r.shadowMap.needsUpdate = true;
  const fotos = {};
  for (const [id, f] of Object.entries(FOTOS)) {
    const cam = new THREE.PerspectiveCamera(f.cam.fov, W / H, 0.05, 80);
    cam.position.set(...f.cam.pos); cam.lookAt(new THREE.Vector3(...f.cam.alvo)); cam.updateMatrixWorld();
    r.render(cena, cam);
    // Evita replicar uma longa string base64 em cada celular do simulador.
    const dados = r.domElement.toDataURL("image/jpeg", 0.91).split(",")[1];
    const binario = atob(dados);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
    const pontos = {};
    cena.updateMatrixWorld(true);
    for (const pid of f.pessoas) {
      const p0 = PESSOA_POS[pid];
      if (!p0) continue;
      if (pid !== "turma" && !visivel(cena, cam, pid, p0)) continue;
      const p = p0.clone();
      p.project(cam);
      if (p.z < 1 && Math.abs(p.x) <= 1.05 && Math.abs(p.y) <= 1.05) pontos[pid] = { x: (p.x + 1) / 2, y: (1 - p.y) / 2 };
    }
    fotos[id] = { url, pontos };
  }
  r.dispose();
  r.forceContextLoss();
  if (cache) for (const foto of Object.values(cache.fotos)) URL.revokeObjectURL(foto.url);
  cache = { chave, fotos };
  return fotos;
}

// Visualizador 360° para o telão: câmera no centro girando, com marcadores das câmeras de cada papel.
export function visor360(container, pers) {
  const cena = construirCena(pers);
  const r = new THREE.WebGLRenderer({ antialias: true });
  r.shadowMap.enabled = true; r.outputColorSpace = THREE.SRGBColorSpace;
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  container.appendChild(r.domElement);
  r.domElement.style.cssText = "width:100%;height:100%;display:block;border-radius:inherit";
  const cam = new THREE.PerspectiveCamera(70, 16 / 9, 0.05, 90);
  const centro = new THREE.Vector3(0.5, 2.7, 1.2);
  const marcas = [];
  for (const p of PAPEIS) for (const fid of p.fotos) {
    const f = FOTOS[fid];
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 4), new THREE.MeshBasicMaterial({ color: p.cor, transparent: true, opacity: 0.8 }));
    const pos = new THREE.Vector3(...f.cam.pos), alvo = new THREE.Vector3(...f.cam.alvo);
    cone.position.copy(pos);
    cone.lookAt(alvo); cone.rotateX(Math.PI / 2);
    cena.add(cone);
    marcas.push({ papel: p.id, foto: fid, pos, alvo, fov: f.cam.fov });
  }
  // A quadra identifica a situação escolar na abertura; a rotação continua livre.
  const yawInicial = -2.1;
  let modo = { tipo: "girar", yaw: yawInicial };
  let alvoAnim = null;
  let arrastando = null;
  r.domElement.addEventListener("pointerdown", (e) => { arrastando = { x: e.clientX, yaw: modo.yaw ?? 0 }; });
  const soltarPonteiro = () => { arrastando = null; };
  window.addEventListener("pointerup", soltarPonteiro);
  r.domElement.addEventListener("pointermove", (e) => { if (arrastando && modo.tipo === "girar") modo.yaw = arrastando.yaw - (e.clientX - arrastando.x) * 0.006; });

  function irPara(fotoId) {
    const m = marcas.find((x) => x.foto === fotoId);
    if (!m) { modo = { tipo: "girar", yaw: modo.yaw ?? yawInicial }; alvoAnim = null; return; }
    alvoAnim = { de: cam.position.clone(), deAlvo: cam.getWorldDirection(new THREE.Vector3()).add(cam.position), para: m.pos.clone(), paraAlvo: m.alvo.clone(), fov0: cam.fov, fov1: m.fov, t: 0 };
    modo = { tipo: "foto" };
  }

  let vivo = true;
  function quadro() {
    if (!vivo) return;
    const w = container.clientWidth || 640, h = container.clientHeight || 360;
    if (r.domElement.width !== Math.floor(w * r.getPixelRatio())) { r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    if (modo.tipo === "girar") {
      if (!arrastando) modo.yaw += 0.0025;
      cam.position.copy(centro);
      cam.fov += (70 - cam.fov) * 0.05; cam.updateProjectionMatrix();
      cam.lookAt(centro.x + Math.sin(modo.yaw), centro.y - 0.32, centro.z - Math.cos(modo.yaw));
    } else if (alvoAnim) {
      alvoAnim.t = Math.min(1, alvoAnim.t + 0.02);
      const k = alvoAnim.t < 0.5 ? 2 * alvoAnim.t * alvoAnim.t : 1 - Math.pow(-2 * alvoAnim.t + 2, 2) / 2;
      cam.position.lerpVectors(alvoAnim.de, alvoAnim.para, k);
      const olho = new THREE.Vector3().lerpVectors(alvoAnim.deAlvo, alvoAnim.paraAlvo, k);
      cam.fov = alvoAnim.fov0 + (alvoAnim.fov1 - alvoAnim.fov0) * k; cam.updateProjectionMatrix();
      cam.lookAt(olho);
    }
    r.render(cena, cam);
    requestAnimationFrame(quadro);
  }
  quadro();
  return { irPara, girar: () => irPara(null), destruir: () => { vivo = false; window.removeEventListener("pointerup", soltarPonteiro); r.dispose(); r.domElement.remove(); } };
}

