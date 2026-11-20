// Telão: só lê o que o Mestre publica. Abre pelo link ?sala=CÓDIGO (ou digitando o código) e ocupa a tela toda.
import { renderTelao } from "../views/telao.js";
import { ico } from "../views/desenho.js";
import { ouvirEstado, marcarPresencaTelao, lerSala, normalizar } from "./transporte.js";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const codigo = normalizar(new URLSearchParams(location.search).get("sala"));

function pedirCodigo(msg) {
  document.body.classList.remove("so-telao");
  app.innerHTML = `<div class="tl-entrada"><div class="ent-card escuro" style="max-width:420px;width:100%"><p class="ent-rot">Telão</p><h2>Qual é o código da sala?</h2>
    <input class="ent-cod" id="cod" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" aria-label="Código da sala">
    <button class="btn block" id="ir" disabled>Abrir telão</button><p class="ent-erro" role="alert">${esc(msg || "")}</p></div></div>`;
  const c = document.getElementById("cod"), ir = document.getElementById("ir");
  c.oninput = () => { c.value = normalizar(c.value); ir.disabled = c.value.length < 5; };
  const go = () => { if (c.value.length >= 5) location.search = "?sala=" + c.value; };
  ir.onclick = go; c.onkeydown = (e) => { if (e.key === "Enter") go(); };
}

async function ligar() {
  const info = await lerSala(codigo).catch(() => null);
  if (!info) { pedirCodigo("Sala não encontrada. Confira o código."); return; }
  marcarPresencaTelao(codigo);
  app.innerHTML = `<div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs">⛶ Tela cheia</button><div id="telaoIn"></div></div><div id="qrbox"></div>`;
  const telao = document.getElementById("telao"), tin = document.getElementById("telaoIn"), fs = document.getElementById("fs");
  const link = new URL("../aluno/index.html?sala=" + codigo, location.href).href;
  let qr = ""; try { qr = window.MosaicoQR ? window.MosaicoQR.svg(link, { rotulo: "Código QR para entrar na sala " + codigo }) : ""; } catch {}
  let ultimo = null;
  ouvirEstado(codigo, (st) => {
    ultimo = st;
    tin.innerHTML = renderTelao(st);
    telao.dataset.ano = st.ano || 1;
    const box = document.getElementById("qrbox");
    box.innerHTML = st.fase === "entrada" && qr ? `<div class="pro-qr" style="position:fixed;left:2vw;bottom:2vw;width:14vw;height:14vw;z-index:4">${qr}</div>` : "";
  }, () => pedirCodigo("Não consegui abrir o telão desta sala."));
  fs.onclick = () => {
    if (document.fullscreenElement || telao.classList.contains("cheio")) { if (document.fullscreenElement) document.exitFullscreen(); telao.classList.remove("cheio"); }
    else if (telao.requestFullscreen) telao.requestFullscreen().catch(() => telao.classList.add("cheio"));
    else telao.classList.add("cheio");
    setTimeout(() => { fs.textContent = document.fullscreenElement || telao.classList.contains("cheio") ? "✕ Sair da tela cheia" : "⛶ Tela cheia"; }, 50);
  };
  let t = 0; const mostra = () => { telao.classList.add("mostra-fs"); clearTimeout(t); t = setTimeout(() => telao.classList.remove("mostra-fs"), 2500); };
  ["mousemove", "touchstart", "pointerdown"].forEach((ev) => telao.addEventListener(ev, mostra, { passive: true }));
  window.__telao = { get st() { return ultimo; } };
}

if (codigo.length === 5) ligar(); else pedirCodigo();
