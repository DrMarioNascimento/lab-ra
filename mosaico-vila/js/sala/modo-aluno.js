// Aluno: entra pelo código (ou QR), recebe o estado publicado pelo Mestre e manda as ações como pedidos.
import { renderAluno, acaoAluno, novoLocal, temaFamilia } from "../views/aluno.js";
import { ico } from "../views/desenho.js";
import { montar, setPath } from "../ui.js";
import { ouvirEstado, entrarNaSala, enviarAcao, lerSala, normalizar, marcarPresencaAluno } from "./transporte.js";

const app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const codigo = normalizar(new URLSearchParams(location.search).get("sala"));
const CH = "vila-aluno-" + codigo;

const FORMAS = [{ k: "m", e: "👨", l: "Bem-vindo" }, { k: "f", e: "👩", l: "Bem-vinda" }, { k: "n", e: "👥", l: "Tanto faz" }];
function telaEntrada(msg) {
  const nomeSalvo = localStorage.getItem("vila-nome") || "";
  let forma = localStorage.getItem("vila-forma") || "";
  app.innerHTML = `<div class="al-entrada"><div class="row">${ico("app-mosaico-vila", "g")}<div><div class="ent-kicker">Sala de jogo</div><h1 class="ent-titulo">Mosaico Vila</h1></div></div>
    <div class="ent-card"><p class="ent-rot">Participar</p><h2>Entrar com o código</h2>
    <input class="ent-cod" id="cod" maxlength="5" placeholder="CÓDIGO" value="${esc(codigo)}" autocomplete="off" autocapitalize="characters" aria-label="Código da sala">
    <input class="ent-nome" id="nome" maxlength="24" placeholder="Seu nome" value="${esc(nomeSalvo)}" autocomplete="given-name" aria-label="Seu nome">
    <div id="formas" role="radiogroup" aria-label="Como o jogo deve receber você"><p class="ent-aviso" style="margin:2px 0 6px">Como o jogo deve receber você?</p>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${FORMAS.map((x) => `<button type="button" class="btn sec${forma === x.k ? " ok on" : ""}" data-forma="${x.k}" role="radio" aria-checked="${forma === x.k}" style="display:flex;flex-direction:column;align-items:center;gap:4px;min-height:82px;padding:8px 4px"><span style="font-size:26px;line-height:1">${x.e}</span><span style="white-space:nowrap;font-size:14px">${x.l}</span></button>`).join("")}</div></div>
    <button class="btn block" id="ir">Entrar</button><p class="ent-erro" id="erro" role="alert">${esc(msg || "")}</p><p class="ent-aviso">Não precisa de cadastro.</p></div></div>`;
  const c = document.getElementById("cod"), n = document.getElementById("nome"), ir = document.getElementById("ir");
  c.oninput = () => { c.value = normalizar(c.value); };
  document.querySelectorAll("#formas [data-forma]").forEach((b) => { b.onclick = () => { forma = b.dataset.forma; document.querySelectorAll("#formas [data-forma]").forEach((o) => { const on = o === b; o.className = "btn sec" + (on ? " ok on" : ""); o.setAttribute("aria-checked", on); }); }; });
  const entrar = async (reassumir) => {
    const cod = normalizar(c.value), nome = n.value.trim(), erro = document.getElementById("erro");
    if (cod.length < 5) { erro.textContent = "Digite o código de 5 letras ou números."; return; }
    if (!nome) { erro.textContent = "Digite seu nome."; return; }
    if (!forma) { erro.textContent = "Escolha: Bem-vindo, Bem-vinda ou Tanto faz."; return; }
    ir.disabled = true; erro.textContent = "Entrando…"; document.getElementById("eu-box")?.remove();
    try {
      const id = await entrarNaSala(cod, nome, !!reassumir, forma);
      localStorage.setItem("vila-nome", nome); localStorage.setItem("vila-forma", forma); sessionStorage.setItem("vila-aluno-" + cod, id);
      if (cod !== codigo) { location.search = "?sala=" + cod; return; }
      jogar(id);
    } catch (e) {
      ir.disabled = false;
      if (e.cod === 412) {   // R43: o mesmo nome, mas ninguém está usando: pode ser a pessoa voltando
        erro.textContent = "";
        erro.insertAdjacentHTML("afterend", `<div id="eu-box" class="ent-confirma"><p><b>Já existe “${esc(nome)}” na sala, mas ninguém está usando agora.</b></p><button class="btn block" id="eu">Sou eu, voltar</button><button class="btn sec block" id="outro">Não sou eu, mudar o nome</button></div>`);
        document.getElementById("eu").onclick = () => entrar(true);
        document.getElementById("outro").onclick = () => { document.getElementById("eu-box")?.remove(); n.focus(); n.select(); };
      } else erro.textContent = e.message || "Não foi possível entrar.";
    }
  };
  ir.onclick = () => entrar(false);
}

function jogar(id) {
  document.body.classList.add("so-aluno");
  app.innerHTML = `<div id="tela" class="ph-screen" style="min-height:100vh"></div>`;
  const root = document.getElementById("tela");
  let st = null; const loc = novoLocal();
  const dispatch = (a) => { enviarAcao(codigo, a).catch(() => {}); };
  const m = montar(root, () => (st ? (st.alunos[id] ? `<div class="phone"${temaFamilia(st, id)}>${renderAluno(st, id, loc)}</div>` : `<div class="phone"><div class="bd"><h2>Você saiu desta sala</h2><p class="muted">O Mestre tirou você da sala ou a sala foi reiniciada. Se foi engano, toque em “Entrar de novo” e use o mesmo nome.</p><button class="btn" data-a="sair-sala">Entrar de novo</button></div></div>`) : `<div class="phone"><div class="bd"><p class="muted">Conectando à sala…</p></div></div>`),
    (a, el) => { if (a === "sair-sala") { sessionStorage.removeItem(CH); location.reload(); return false; } return acaoAluno(a, el, { st, id, loc, dispatch }); },
    (path, v) => setPath(loc, path, v));
  ouvirEstado(codigo, (novo) => { st = novo; m.draw(); }, () => {});
  marcarPresencaAluno(codigo);   // R43: o Mestre vê quem está com a tela aberta
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
