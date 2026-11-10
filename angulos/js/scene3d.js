// Cena 3D da academia (three.js local). Personagens e objetos provisórios feitos de primitivas;
// textos legíveis (cartaz, maquininha, celular, papéis) são texturas desenhadas em canvas.
import * as THREE from "../vendor/three.module.min.js";
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

function pessoa(id, { camisa, calca = "#1f2937", pele = "#c58c5c", cabelo = "#1b1b1b", altura = 1.75, x, z, ry = 0, colete, textoPeito, bracos = "baixo", grisalho, cabeloLongo }) {
  const g = new THREE.Group();
  const k = altura / 1.75;
  const pernaM = mat(calca), corpoM = mat(camisa), peleM = mat(pele);
  for (const s of [-1, 1]) {
    const perna = new THREE.Mesh(new THREE.CapsuleGeometry(0.075 * k, 0.72 * k, 4, 8), pernaM);
    perna.position.set(0.1 * s * k, 0.45 * k, 0); perna.castShadow = true; g.add(perna);
  }
  const tronco = new THREE.Mesh(new THREE.CapsuleGeometry(0.19 * k, 0.42 * k, 6, 12), colete ? mat(colete) : corpoM);
  tronco.position.y = 1.12 * k; tronco.scale.z = 0.7; tronco.castShadow = true; g.add(tronco);
  if (textoPeito) {
    const t = placa(0.3 * k, 0.12 * k, tex([{ t: textoPeito, b: true, c: "#fff" }], { w: 256, h: 100, bg: colete || camisa, font: 52 }), 0, 1.2 * k, 0.142 * k);
    g.add(t);
  }
  for (const s of [-1, 1]) {
    const braco = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * k, 0.5 * k, 4, 8), corpoM);
    if (bracos === "frente") { braco.position.set(0.25 * s * k, 1.22 * k, 0.18 * k); braco.rotation.x = -1.2; }
    else if (bracos === "telefone" && s === 1) { braco.position.set(0.25 * k, 1.42 * k, 0.05); braco.rotation.z = 2.6; }
    else if (bracos === "cima") { braco.position.set(0.24 * s * k, 1.55 * k, 0); braco.rotation.z = s * 0.25; }
    else { braco.position.set(0.26 * s * k, 1.05 * k, 0); braco.rotation.z = s * 0.12; }
    braco.castShadow = true; g.add(braco);
  }
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.12 * k, 16, 12), peleM);
  cabeca.position.y = 1.58 * k; cabeca.castShadow = true; g.add(cabeca);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(0.125 * k, 16, 12, 0, Math.PI * 2, 0, Math.PI * (cabeloLongo ? 0.75 : 0.5)), mat(grisalho ? "#cbd5e1" : cabelo));
  cab.position.y = 1.6 * k; cab.rotation.x = -0.25; g.add(cab);
  g.position.set(x, 0, z); g.rotation.y = ry;
  g.userData.cabeca = new THREE.Vector3(x, 1.6 * k, z);
  if (id) PESSOA_POS[id] = g.userData.cabeca.clone();
  return g;
}

export function construirCena(pers) {
  const cena = new THREE.Scene();
  cena.background = new THREE.Color("#1e293b");
  cena.fog = new THREE.Fog("#1e293b", 30, 60);

  cena.add(new THREE.HemisphereLight("#eef2ff", "#3f3a33", 1.15));
  const luz = new THREE.DirectionalLight("#fff7e6", 1.5);
  luz.position.set(4, 12, 6); luz.castShadow = true;
  luz.shadow.mapSize.set(1024, 1024);
  Object.assign(luz.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12 });
  cena.add(luz);
  for (const [x, z] of [[-6, -3], [4, -3], [-6, 4], [5, 4]]) {
    const p = new THREE.PointLight("#fff1d6", 6, 12, 1.6); p.position.set(x, 3.6, z); cena.add(p);
  }

  // Piso, paredes e teto aberto
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(24, 17), mat("#3b3f46"));
  piso.rotation.x = -Math.PI / 2; piso.position.set(0, 0, 0); piso.receiveShadow = true; cena.add(piso);
  const borracha = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), mat("#1f2125"));
  borracha.rotation.x = -Math.PI / 2; borracha.position.set(8, 0.005, 2.5); cena.add(borracha);
  const tapete = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), mat("#2d5a4a"));
  tapete.rotation.x = -Math.PI / 2; tapete.position.set(-7.2, 0.005, 5.2); cena.add(tapete);
  const parede = mat("#d6d3cd");
  cena.add(caixa(24, 4.2, 0.2, parede, 0, 2.1, -8.5));
  cena.add(caixa(24, 4.2, 0.2, parede, 0, 2.1, 8.5));
  cena.add(caixa(0.2, 4.2, 17, parede, 12, 2.1, 0));
  cena.add(caixa(0.2, 4.2, 6.6, parede, -12, 2.1, -5.2));
  cena.add(caixa(0.2, 4.2, 5.4, parede, -12, 2.1, 5.8));
  const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3, 5.2), new THREE.MeshStandardMaterial({ color: "#9bd3ff", transparent: true, opacity: 0.18, roughness: 0.1 }));
  vidro.position.set(-12, 1.5, 0.5); cena.add(vidro);
  cena.add(placa(3.6, 0.7, tex([{ t: "ACADEMIA MOVIMENTO", b: true, c: "#fff" }], { bg: "#0f766e", font: 54, h: 128 }), -11.88, 3.3, 0.5, Math.PI / 2));

  // Estacionamento (fora)
  const asfalto = new THREE.Mesh(new THREE.PlaneGeometry(12, 17), mat("#26282c"));
  asfalto.rotation.x = -Math.PI / 2; asfalto.position.set(-18, -0.01, 0); cena.add(asfalto);
  const carro = new THREE.Group();
  carro.add(caixa(1.8, 0.7, 4.2, "#7f1d1d", 0, 0.6, 0));
  carro.add(caixa(1.6, 0.6, 2.2, "#991b1b", 0, 1.2, -0.3));
  for (const [x, z] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.25, 16), mat("#111")); r.rotation.z = Math.PI / 2; r.position.set(x, 0.33, z); carro.add(r);
  }
  const tampa = caixa(1.7, 0.06, 1.0, "#7f1d1d", 0, 1.45, 2.3); tampa.rotation.x = -1.1; carro.add(tampa);
  carro.add(caixa(0.5, 0.35, 0.4, "#f1f5f9", -0.4, 1.05, 1.6));
  carro.add(caixa(0.5, 0.35, 0.4, "#f1f5f9", 0.3, 1.05, 1.65));
  carro.add(caixa(0.45, 0.3, 0.38, "#e2e8f0", -0.05, 1.38, 1.55));
  carro.position.set(-16.4, 0, -2.6); carro.rotation.y = 0.15; cena.add(carro);
  cena.add(pessoa("homem", { camisa: "#4b5563", x: -15.0, z: -0.5, ry: 0.6, bracos: "telefone" }));

  // Recepção
  cena.add(caixa(4.2, 1.1, 0.8, "#e5e7eb", -0.6, 0.55, -6.9));
  cena.add(caixa(4.4, 0.06, 1.0, "#94a3b8", -0.6, 1.13, -6.9));
  cena.add(caixa(0.32, 0.4, 0.05, "#111827", 0.35, 1.36, -6.62, -0.5));
  cena.add(placa(0.28, 0.19, tex([{ t: "R$ 480,00", b: true, c: "#22c55e", s: 64 }, { t: "APROVADO", s: 30, c: "#e2e8f0" }], { w: 300, h: 200, bg: "#020617" }), 0.35 - 0.0144, 1.42, -6.62 + 0.0263, -0.5));
  const env = caixa(0.32, 0.22, 0.02, "#a16207", -0.95, 1.22, -6.05, 0.1); cena.add(env);
  cena.add(pessoa("personal", { camisa: "#111111", textoPeito: "STAFF", x: -1.45, z: -6.0, ry: Math.PI / 2 + 0.3, bracos: "frente" }));
  cena.add(pessoa("bia", { camisa: "#ec4899", calca: "#334155", cabeloLongo: true, cabelo: "#5b3a1e", pele: "#e0b48a", altura: 1.66, x: -0.4, z: -5.95, ry: -Math.PI / 2 - 0.3, bracos: "frente" }));
  cena.add(pessoa("recep", { camisa: "#15803d", cabeloLongo: true, altura: 1.62, x: -0.2, z: -7.7, ry: Math.PI - 0.5 + Math.PI }));
  cena.add(placa(1.8, 1.2, tex([{ t: "DESAFIO 90 DIAS", b: true, s: 56, c: "#fde047" }, { t: "Prêmio: 1 ano de plano", c: "#fff" }, { t: "+ kit Farmácia Vitta", c: "#fff" }, { t: "(parceira oficial)", s: 26, c: "#cbd5e1" }], { w: 600, h: 400, bg: "#7c2d12", font: 40 }), 2.6, 1.8, -8.38));
  const prat = caixa(1.6, 1.6, 0.4, "#64748b", 4.6, 0.8, -8.15); cena.add(prat);
  for (let i = 0; i < 6; i++) { const pote = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 12), mat(i % 2 ? "#f97316" : "#0ea5e9")); pote.position.set(4.0 + (i % 3) * 0.5, 0.95 + Math.floor(i / 3) * 0.55, -7.85); cena.add(pote); }

  // Sala de avaliação
  const vidroSala = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 4), new THREE.MeshStandardMaterial({ color: "#bfdbfe", transparent: true, opacity: 0.22 }));
  vidroSala.position.set(7, 1.3, -6.5); cena.add(vidroSala);
  cena.add(caixa(3.0, 2.6, 0.12, "#cbd5e1", 9.5, 1.3, -4.5));
  cena.add(placa(1.1, 0.3, tex([{ t: "AVALIAÇÃO FÍSICA", b: true, c: "#0f172a" }], { h: 120, bg: "#e2e8f0" }), 9.5, 2.35, -4.43));
  cena.add(caixa(1.8, 0.06, 0.9, "#a8a29e", 9.0, 0.76, -6.4));
  for (const [x, z] of [[8.2, -6.0], [9.8, -6.0], [8.2, -6.8], [9.8, -6.8]]) cena.add(caixa(0.05, 0.75, 0.05, "#57534e", x, 0.38, z));
  cena.add(placa(0.3, 0.42, tex(["Dr. M. A. Ferreira — CRM", "", "▬▬▬▬▬▬▬▬", "▬▬▬▬▬▬", "▬▬▬▬▬▬▬▬▬"], { w: 300, h: 420, bg: "#f8fafc", fg: "#64748b", font: 26, extra: (g) => { g.strokeStyle = "#1d4ed8"; g.lineWidth = 6; g.beginPath(); g.arc(200, 330, 55, 0, Math.PI * 2); g.stroke(); g.font = "700 20px Arial"; g.fillStyle = "#1d4ed8"; g.fillText("CARIMBO", 200, 330); } }), 8.6, 0.795, -6.3, 0.2, -Math.PI / 2));
  cena.add(caixa(0.13, 0.012, 0.24, "#020617", 9.3, 0.795, -6.2, -0.4));
  cena.add(placa(0.115, 0.22, tex([{ t: "chegou", s: 40, c: "#e2e8f0", b: true }, { t: "o seu ✓", s: 40, c: "#e2e8f0", b: true }], { w: 200, h: 400, bg: "#065f46", extra: (g) => { g.fillStyle = "#94a3b8"; g.font = "600 22px Arial"; g.fillText("19:02", 100, 40); } }), 9.3, 0.803, -6.2, -0.4, -Math.PI / 2));
  const planilha = ["DESAFIO 90 DIAS — % gordura", `${pers.n.bia}  31% → 24%`, `${pers.n.kaua}  18% → 9%`, "Marcela  28% → 26%", "Joel  25% → 23%", `${pers.n.colega}  21% → 19%`];
  cena.add(placa(1.4, 1.0, tex(planilha.map((t, i) => ({ t, b: i === 0, s: i === 0 ? 30 : 28 })), { w: 560, h: 400, align: "left", bg: "#ffffff", font: 28 }), 11.88, 1.6, -5.0, -Math.PI / 2));

  // Pesos livres
  cena.add(caixa(0.4, 0.42, 1.3, "#111827", 8.6, 0.21, 2.6));
  cena.add(caixa(1.6, 2.2, 0.1, "#4b5563", 8.6, 1.1, 1.6));
  const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 8), mat("#9ca3af", { metalness: 0.7 })); barra.rotation.z = Math.PI / 2; barra.position.set(8.6, 1.75, 2.6); cena.add(barra);
  for (const s of [-1, 1]) { const anilha = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 20), mat("#111")); anilha.rotation.z = Math.PI / 2; anilha.position.set(8.6 + s * 0.8, 1.75, 2.6); cena.add(anilha); }
  cena.add(pessoa("kaua", { camisa: "#f97316", calca: "#111827", altura: 1.72, x: 8.6, z: 2.6, ry: -Math.PI / 2 - 0.4, bracos: "cima", pele: "#a86b3c" }));
  cena.add(pessoa("colega", { camisa: "#0ea5e9", x: 6.8, z: 1.5, ry: 0.9, bracos: "frente" }));
  cena.add(caixa(0.07, 0.13, 0.01, "#020617", 7.0, 1.3, 1.75, 0.9));
  cena.add(caixa(0.4, 0.42, 1.2, "#111827", 7.6, 0.21, 4.3));
  cena.add(caixa(0.36, 0.22, 0.24, "#1e3a8a", 7.6, 0.53, 4.3));
  cena.add(caixa(0.3, 0.02, 0.2, "#0b1220", 7.6, 0.645, 4.3));
  const frasco = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.09, 12), new THREE.MeshStandardMaterial({ color: "#b45309", transparent: true, opacity: 0.85, roughness: 0.2 }));
  frasco.position.set(7.66, 0.69, 4.28); cena.add(frasco);

  // Corredor do vestiário
  cena.add(caixa(1.2, 2.2, 0.1, "#78716c", 6.4, 1.1, 8.4));
  cena.add(placa(1.0, 0.3, tex([{ t: "VESTIÁRIO", b: true }], { h: 120, bg: "#e7e5e4" }), 6.4, 2.45, 8.33, Math.PI));
  const lixo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.6, 16, 1, true), mat("#334155", { side: THREE.DoubleSide })); lixo.position.set(5.6, 0.3, 6.9); cena.add(lixo);
  const cx = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.08), [mat("#fff"), mat("#fff"), new THREE.MeshStandardMaterial({ map: tex([{ t: "...TERONA", b: true, s: 60, c: "#b91c1c" }, { t: "Farmácia São Luiz", s: 30, c: "#334155" }], { w: 400, h: 200, bg: "#ffffff" }) }), mat("#fff"), mat("#fff"), mat("#fff")]);
  cx.position.set(5.6, 0.62, 6.9); cx.rotation.set(0.2, 0.5 + Math.PI, 0.1); cena.add(cx);
  cena.add(pessoa("joaquim", { camisa: "#a3a3a3", calca: "#3f3f46", grisalho: true, pele: "#d6a77a", x: 6.3, z: 7.5, ry: Math.PI + 0.5 + Math.PI }));
  cena.add(caixa(0.25, 0.3, 0.1, "#ffffff", 6.55, 0.75, 7.75));
  cena.add(placa(0.12, 0.12, tex([{ t: "+", b: true, s: 160, c: "#16a34a" }], { w: 200, h: 200, bg: "#ffffff" }), 6.55, 0.78, 7.81, 0));

  // Aula funcional
  cena.add(pessoa("lara", { camisa: "#ffffff", colete: "#facc15", textoPeito: "ESTÁGIO", cabeloLongo: true, altura: 1.64, x: -6.2, z: 3.5, ry: Math.PI + 0.5 + Math.PI * 0, bracos: "cima" }));
  const turmaCores = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#14b8a6", "#f43f5e", "#64748b", "#eab308", "#0ea5e9", "#84cc16"];
  let soma = new THREE.Vector3(); let n = 0;
  turmaCores.forEach((c, i) => {
    const x = -9.2 + (i % 5) * 0.9, z = 5.2 + Math.floor(i / 5) * 1.3;
    const p = pessoa(null, { camisa: c, x, z, ry: Math.PI * 0.85, altura: 1.6 + (i % 3) * 0.06, bracos: i % 2 ? "cima" : "baixo" });
    cena.add(p); soma.add(p.userData.cabeca); n++;
  });
  PESSOA_POS.turma = soma.divideScalar(n);
  cena.add(placa(1.4, 1.0, tex([{ t: "RANKING DESAFIO", b: true, c: "#fde047" }, `1º ${pers.n.kaua}`, `2º ${pers.n.bia}`, "3º Marcela"], { w: 500, h: 360, bg: "#1e293b", fg: "#f8fafc", font: 36 }), -4.6, 1.5, -1.6, 0.9));
  cena.add(caixa(0.06, 1.0, 0.06, "#334155", -4.6, 0.5, -1.6));

  // Mezanino
  cena.add(caixa(5, 0.2, 4.6, "#57534e", -9.5, 3.2, -6.2));
  for (const [x, z] of [[-7.1, -4.0], [-7.1, -8.3]]) cena.add(caixa(0.2, 3.2, 0.2, "#44403c", x, 1.6, z));
  cena.add(caixa(0.05, 0.9, 4.6, "#a8a29e", -7.05, 3.75, -6.2));
  cena.add(caixa(5, 0.9, 0.05, "#a8a29e", -9.5, 3.75, -3.92));
  cena.add(caixa(1.4, 0.05, 0.7, "#78350f", -9.6, 4.05, -7.5));
  cena.add(caixa(1.3, 0.75, 0.6, "#451a03", -9.6, 3.67, -7.5));
  cena.add(placa(0.3, 0.4, tex([{ t: "CONTRATO DE", b: true, s: 30 }, { t: "PARCERIA", b: true, s: 30 }, { t: "Farmácia Vitta", s: 26, c: "#1d4ed8" }, "▬▬▬▬▬", "▬▬▬▬"], { w: 300, h: 400, bg: "#fafaf9", font: 26 }), -9.7, 4.08, -7.45, 0.3, -Math.PI / 2));
  const dono = pessoa("dono", { camisa: "#e2e8f0", calca: "#1e293b", x: -10.6, z: -6.9, ry: 1.2, bracos: "telefone" });
  dono.position.y = 3.3; dono.userData.cabeca.y += 3.3; PESSOA_POS.dono.y += 3.3; cena.add(dono);

  // Mãe entrando
  cena.add(pessoa("mae", { camisa: "#7c3aed", calca: "#1f2937", cabeloLongo: true, altura: 1.64, x: -11.2, z: 0.4, ry: Math.PI / 2 + 0.2 }));

  // Equipamentos de enchimento
  for (let i = 0; i < 3; i++) cena.add(caixa(0.8, 1.4, 1.8, "#475569", -3 + i * 2.2, 0.7, 6.6));
  for (let i = 0; i < 3; i++) cena.add(caixa(0.9, 1.2, 1.8, "#334155", 1 + i * 1.6, 0.6, -2.4));

  return cena;
}

let cache = null;
export function fotosDaCena(pers) {
  const chave = JSON.stringify(pers);
  if (cache && cache.chave === chave) return cache.fotos;
  const cena = construirCena(pers);
  const W = 900, H = 600;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.shadowMap.enabled = true; r.outputColorSpace = THREE.SRGBColorSpace;
  const fotos = {};
  for (const [id, f] of Object.entries(FOTOS)) {
    const cam = new THREE.PerspectiveCamera(f.cam.fov, W / H, 0.05, 80);
    cam.position.set(...f.cam.pos); cam.lookAt(new THREE.Vector3(...f.cam.alvo)); cam.updateMatrixWorld();
    r.render(cena, cam);
    r.render(cena, cam);
    const url = r.domElement.toDataURL("image/jpeg", 0.86);
    const pontos = {};
    for (const pid of f.pessoas) {
      const p = PESSOA_POS[pid]?.clone();
      if (!p) continue;
      p.project(cam);
      if (p.z < 1 && Math.abs(p.x) <= 1.05 && Math.abs(p.y) <= 1.05) pontos[pid] = { x: (p.x + 1) / 2, y: (1 - p.y) / 2 };
    }
    fotos[id] = { url, pontos };
  }
  r.dispose();
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
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), new THREE.MeshBasicMaterial({ color: p.cor }));
    const pos = new THREE.Vector3(...f.cam.pos), alvo = new THREE.Vector3(...f.cam.alvo);
    cone.position.copy(pos);
    cone.lookAt(alvo); cone.rotateX(Math.PI / 2);
    cena.add(cone);
    marcas.push({ papel: p.id, foto: fid, pos, alvo, fov: f.cam.fov });
  }
  let modo = { tipo: "girar", yaw: 0 };
  let alvoAnim = null;
  let arrastando = null;
  r.domElement.addEventListener("pointerdown", (e) => { arrastando = { x: e.clientX, yaw: modo.yaw ?? 0 }; });
  window.addEventListener("pointerup", () => (arrastando = null));
  r.domElement.addEventListener("pointermove", (e) => { if (arrastando && modo.tipo === "girar") modo.yaw = arrastando.yaw - (e.clientX - arrastando.x) * 0.006; });

  function irPara(fotoId) {
    const m = marcas.find((x) => x.foto === fotoId);
    if (!m) { modo = { tipo: "girar", yaw: modo.yaw ?? 0 }; alvoAnim = null; return; }
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
  return { irPara, girar: () => irPara(null), destruir: () => { vivo = false; r.dispose(); r.domElement.remove(); } };
}
