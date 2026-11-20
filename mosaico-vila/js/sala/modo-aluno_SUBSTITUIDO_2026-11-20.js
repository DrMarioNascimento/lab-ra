// Aluno: entra pelo código (ou QR), recebe o estado publicado pelo professor e manda as ações como pedidos.
import { renderAluno, acaoAluno, novoLocal } from "../views/aluno.js";
import { ico } from "../views/desenho.js";
import { montar, setPath } from "../ui.js";
import { ouvirEstado, entrarNaSala, enviarAcao, lerSala, normalizar } from "./transporte.js";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const codigo = normalizar(new URLSearchParams(location.search).get("sala"));
const CH = "vila-aluno-" + codigo;

function telaEntrada(msg) {
  const nomeSalvo = localStorage.getItem("vila-nome") || "";
  app.innerHTML = `<div class="al-entrada"><div class="row">${ico("app-mosaico-vila", "g")}<div><div class="ent-kicker">Sala de jogo</div><h1 class="ent-titulo">Mosaico Vila</h1></div></div>
    <div class="ent-card"><p class="ent-rot">Participar</p><h2>Entrar com o código</h2>
    <input class="ent-cod" id="cod" maxlength="5" placeholder="CÓDIGO" value="${esc(codigo)}" autocomplete="off" autocapitalize="characters" aria-label="Código da sala">
    <input class="ent-nome" id="nome" maxlength="24" placeholder="Seu nome" value="${esc(nomeSalvo)}" autocomplete="given-name" aria-label="Seu nome">
    <button class="btn block" id="ir">Entrar</button><p class="ent-erro" id="erro" role="alert">${esc(msg || "")}</p><p class="ent-aviso">Não precisa de cadastro.</p></div></div>`;
  const c = document.getElementById("cod"), n = document.getElementById("nome"), ir = document.getElementById("ir");
  c.oninput = () => { c.value = normalizar(c.value); };
  ir.onclick = async () => {
    const cod = normalizar(c.value), nome = n.value.trim();
    if (cod.length < 5) { document.getElementById("erro").textContent = "Digite o código de 5 letras ou números."; return; }
    if (!nome) { document.getElementById("erro").textContent = "Digite seu nome."; return; }
    ir.disabled = true; document.getElementById("erro").textContent = "Entrando…";
    try {
      const id = await entrarNaSala(cod, nome);
      localStorage.setItem("vila-nome", nome); sessionStorage.setItem("vila-aluno-" + cod, id);
      if (cod !== codigo) { location.search = "?sala=" + cod; return; }
      jogar(id);
    } catch (e) { ir.disabled = false; document.getElementById("erro").textContent = e.message || "Não foi possível entrar."; }
  };
}

function jogar(id) {
  document.body.classList.add("so-aluno");
  app.innerHTML = `<div id="tela" class="ph-screen" style="min-height:100vh"></div>`;
  const root = document.getElementById("tela");
  let st = null; const loc = novoLocal();
  const dispatch = (a) => { enviarAcao(codigo, a).catch(() => {}); };
  const m = montar(root, () => (st ? (st.alunos[id] ? `<div class="phone">${renderAluno(st, id, loc)}</div>` : `<div class="phone"><div class="bd"><h2>Você saiu desta sala</h2><p class="muted">A sala foi reiniciada. Digite o código de novo para entrar.</p><button class="btn" data-a="sair-sala">Entrar de novo</button></div></div>`) : `<div class="phone"><div class="bd"><p class="muted">Conectando à sala…</p></div></div>`),
    (a, el) => { if (a === "sair-sala") { sessionStorage.removeItem(CH); location.reload(); return false; } return acaoAluno(a, el, { st, id, loc, dispatch }); },
    (path, v) => setPath(loc, path, v));
  ouvirEstado(codigo, (novo) => { st = novo; m.draw(); }, () => {});
  m.draw(true);
  window.__aluno = { get st() { return st; }, id };
}

(async () => {
  if (codigo.length === 5) {
    const id = sessionStorage.getItem(CH);
    const info = await lerSala(codigo).catch(() => null);
    if (id && info) { jogar(id); return; }
    telaEntrada(info ? "" : "Sala não encontrada. Confira o código.");
  } else telaEntrada();
})();
