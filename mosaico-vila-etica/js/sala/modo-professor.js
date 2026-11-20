// Professor: o "cérebro" do jogo roda neste aparelho. Entra com Google (lista de mestres), abre a sala, publica o estado
// para o telão e para os celulares e processa os pedidos da turma. O desenho é o mesmo do Comitê de Ética.
import { estadoInicial, reduzir, progresso } from "../engine.js";
import { renderProfessor, acaoProfessor, ligarSinal, SEM_SINAL_S } from "../views/professor.js";
import { renderTelao } from "../views/telao.js";
import { novoLocal } from "../views/aluno.js";
import { passoAuto, perfilBot, papelBully } from "../bots.js";
import { ico } from "../views/desenho.js";
import { montar } from "../ui.js";
import { conectar, abrirSala, retomarSala } from "./transporte.js";

const JOGO = "mosaico-vila-etica";
const CHAVE = "vila-prof-sala";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const app = document.getElementById("app");
let st = estadoInicial(), sala = null, liberada = true;
const subs = new Set(); let agendado = false;
function dispatch(a) {
  st = reduzir(st, a);
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}
const topo = (sub) => `<div class="ent-topo">${ico("app-mosaico-vila")}<div><div class="ent-kicker">Sala de jogo · professor</div><div class="ent-titulo">Mosaico Vila Ética</div></div></div>${sub || ""}`;
const lacre = `<img class="cadeado" src="../assets/icones/cadeado-fechado.png" width="36" height="36" alt="" aria-hidden="true">`;

async function telaLogin(msg) {
  app.innerHTML = topo() + `<div class="ent-wrap"><div class="ent-card escuro" style="max-width:460px;margin:0 auto;width:100%"><p class="ent-rot">Conduzir</p><h2>Entrar como professor</h2>
    <p class="ent-aviso">Entre com a conta Google que está na lista de professores autorizados. A turma entra pelo código ou pelo QR, sem cadastro.</p>
    <button class="btn professor block" id="google"><span class="entrada-prof">${lacre}Entrar com Google</span><small>Só o Professor tem a chave</small></button>
    <p class="ent-erro" id="erro" role="alert">${esc(msg || "")}</p><a class="ent-link" href="../index.html">Voltar</a></div></div>`;
  const b = await conectar();
  document.getElementById("google").onclick = () => {
    // sem await antes do signInWithPopup: o Safari do iPhone bloqueia a janela do Google se houver
    b.entrarGoogleNoToque().then(async (u) => {
      if (!(await b.ehMestre(u.email))) { await b.sair(); telaLogin("Esta conta não está na lista de professores autorizados."); return; }
      abrir(u);
    }).catch((e) => { document.getElementById("erro").textContent = e && e.code === "auth/popup-closed-by-user" ? "A janela do Google foi fechada." : "Não consegui entrar. Tente de novo."; });
  };
}

async function abrir(u) {
  app.innerHTML = topo() + `<div class="ent-wrap"><p class="ent-aviso">Abrindo a sala…</p></div>`;
  try {
    const guardado = sessionStorage.getItem(CHAVE) || localStorage.getItem(CHAVE);
    let s = null;
    if (guardado) { try { s = await retomarSala(guardado, aoEntrar, aoAcao); const sv = localStorage.getItem(CHAVE + ":" + guardado); if (sv) st = JSON.parse(sv); } catch { s = null; } }
    if (!s) { s = await abrirSala(JOGO, aoEntrar, aoAcao); st = estadoInicial(); }
    sala = s; localStorage.setItem(CHAVE, s.codigo);
    ligarSinal((id) => (st.alunos[id]?.auto ? null : sala.sinalDe(id)));
    st.codigo = s.codigo;
    painel(u);
  } catch (e) { app.innerHTML = topo() + `<div class="ent-wrap"><p class="ent-erro">${esc(e.message || "Não consegui abrir a sala.")}</p><button class="btn" onclick="location.reload()">Tentar de novo</button></div>`; }
}

let seq = 0;
function aoEntrar(nome, uid, reassumir, atual) {
  if (atual && st.alunos[atual]) return { ok: true, id: atual };   // o mesmo celular de volta
  if (!nome) return { ok: false, erro: "Digite seu nome." };
  const chave = (x) => String(x || "").trim().toLowerCase();
  const ex = st.ordem.find((i) => !st.alunos[i]?.auto && chave(st.alunos[i]?.nome) === chave(nome));
  if (ex) {   // R43: o mesmo nome. Com sinal: ocupado. Sem sinal: pode ser a mesma pessoa voltando de outro aparelho
    const sem = sala ? sala.sinalDe(ex) : Infinity;
    if (sem <= SEM_SINAL_S) return { ok: false, erro: "Esse nome já está na sala. Use outro nome (por exemplo, com o sobrenome)." };
    if (!reassumir) return { ok: false, cod: 412, erro: "Esse nome já está na sala, mas ninguém está usando agora. Se for você, toque em “Sou eu, voltar”." };
    return { ok: true, id: ex };
  }
  if (st.fase !== "entrada") return { ok: false, erro: "O jogo já começou. Fale com o professor." };
  if (!liberada) return { ok: false, erro: "A entrada ainda não foi liberada pelo professor." };
  seq = Math.max(seq, ...st.ordem.map((i) => (/^a\d+$/.test(i) ? +i.slice(1) : 0))) + 1;   // ids nunca se repetem, mesmo depois de expulsões
  const id = `a${seq}`;
  dispatch({ t: "entrar", id, nome });
  return { ok: true, id };
}
function aoAcao(a) { dispatch(a); }

function painel(u) {
  const link = new URL("../aluno/index.html?sala=" + sala.codigo, location.href).href;
  const telaoLink = new URL("../telao/index.html?sala=" + sala.codigo, location.href).href;
  let qr = ""; try { qr = window.MosaicoQR ? window.MosaicoQR.svg(link, { rotulo: "Código QR para entrar na sala " + sala.codigo }) : ""; } catch {}
  app.innerHTML = topo() + `<div class="ent-wrap"><div class="ent-card escuro"><div class="pro-faixa"><div class="pro-qr">${qr}</div>
      <div><p class="ent-rot">Código da sala</p><div class="pro-cod">${sala.codigo}</div><p class="ent-aviso">A turma entra por este código ou pelo QR, sem cadastro.</p></div></div>
      <div class="row"><a class="btn contorno" href="${telaoLink}" target="_blank" rel="noopener">Abrir telão</a>
      <button class="btn sm sec" id="lib">Entrada liberada</button><button class="btn sm sec" id="nova">Nova sala</button><button class="btn sm sec" id="sair">Sair</button></div></div>
    <div id="prof" class="card"></div></div>`;
  const prof = montar(document.getElementById("prof"), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch), () => {});
  subs.add(() => prof.draw()); prof.draw(true);
  setInterval(() => prof.draw(), 5000);   // o sinal dos celulares muda sem o estado mudar
  subs.add(() => { sala.publicar(st); localStorage.setItem(CHAVE + ":" + sala.codigo, JSON.stringify(st)); });
  sala.publicar(st);
  const lib = document.getElementById("lib");
  lib.onclick = () => { liberada = !liberada; lib.textContent = liberada ? "Entrada liberada" : "Entrada fechada"; lib.className = "btn sm " + (liberada ? "sec" : "warn"); sala.entradaLiberada(liberada); };
  document.getElementById("nova").onclick = () => { if (confirm("Abrir uma sala nova? A atual será deixada de lado.")) { localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE); location.reload(); } };
  document.getElementById("sair").onclick = async () => { sala.encerrar(); const b = await conectar(); await b.sair(); location.href = "../index.html"; };
  // os vizinhos automáticos jogam sempre; na sala real, quem roda isto é o aparelho de quem conduz
  const locs = {};
  setInterval(() => {
    for (const id of st.ordem) {
      if (!st.alunos[id]?.auto) continue;
      const i = 500 + +id.slice(1);
      locs[id] ??= Object.assign(novoLocal(), { perfil: perfilBot(i), papelBully: papelBully(i) });
      passoAuto(st, id, locs[id], dispatch);
    }
  }, 600);
  window.__sala = { get st() { return st; }, dispatch, codigo: sala.codigo };
}

(async () => {
  const b = await conectar();
  const u = await b.usuario();
  if (u && (await b.ehMestre(u.email))) abrir(u); else telaLogin();
})();
