// /simulador: telão em cima, turma embaixo. O "cérebro" da sala roda nesta página (na sala real, no celular de quem conduz).
import { estadoInicial, reduzir, progresso } from "./engine.js";
import { renderTelao, duracaoTelao } from "./views/telao.js";
import { renderAluno, acaoAluno, novoLocal } from "./views/aluno.js";
import { renderProfessor, acaoProfessor } from "./views/professor.js";
import { iconeFamilia, ico } from "./views/desenho.js";
import { montar, setPath } from "./ui.js";
import { passoBot, NOMES, perfilBot, papelBully } from "./bots.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let st = estadoInicial();
const subs = new Set();
let agendado = false;
function dispatch(a) {
  st = reduzir(st, a);
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}

let nAlunos = 20, auto = true, autoProf = false;
const locs = {}, pilotos = {};
const app = document.getElementById("app");
app.innerHTML = `
  <header class="row" style="padding:14px 16px 0;max-width:1800px;margin:0 auto">
    ${ico("app-mosaico-vila", "g")}
    <div class="grow"><b style="font-size:18px">Mosaico Vila · Simulador de aula</b><div class="faint" style="font-size:12px">Telão em cima, turma embaixo. O professor comanda pelo painel ao lado (na sala real, pelo celular).</div></div>
    <label class="row muted" style="gap:6px">Participantes <input id="nAl" type="range" min="4" max="40" value="20" style="width:140px"><b id="nAlV" class="mono">20</b></label>
    <button class="btn sm ok on" id="auto">Piloto automático: ligado</button>
    <button class="btn sm sec" id="autoProf">Professor automático: desligado</button>
    <button class="btn sm sec" id="fundo">Ver do fundo da sala</button>
    <button class="btn sm sec" id="reset">Recomeçar</button>
  </header>
  <div class="sim">
    <div><div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs">⛶ Tela cheia</button><div id="telaoIn"></div></div><p class="fundo-nota">Assim fica o telão numa TV de 55" vista a uns 6 m: se der para ler aqui, dá para ler do fundo da sala.</p></div>
    <aside class="card" id="prof" style="max-height:calc(56.25vw * 0.78);overflow:auto"></aside>
    <section class="turma"><div class="row" style="justify-content:space-between"><h3>Turma</h3><span class="faint">Desligue o piloto de um celular para clicar nele à mão.</span></div><div class="phones" id="phones"></div></section>
  </div>`;

const telaoIn = document.getElementById("telaoIn");
subs.add(() => { telaoIn.innerHTML = renderTelao(st); });
const prof = montar(document.getElementById("prof"), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch), () => {});
subs.add(() => prof.draw());

// Tela cheia de verdade: o telão ocupa a tela inteira (no iPhone, o Safari só deixa simular: ver estilo .telao.cheio)
const telao = document.getElementById("telao"), fs = document.getElementById("fs");
fs.onclick = () => {
  if (document.fullscreenElement || telao.classList.contains("cheio")) { if (document.fullscreenElement) document.exitFullscreen(); telao.classList.remove("cheio"); }
  else if (telao.requestFullscreen) telao.requestFullscreen().catch(() => telao.classList.add("cheio"));
  else telao.classList.add("cheio");
  setTimeout(atualizarFs, 50);
};
function atualizarFs() { fs.textContent = document.fullscreenElement || telao.classList.contains("cheio") ? "✕ Sair da tela cheia" : "⛶ Tela cheia"; }
document.addEventListener("fullscreenchange", atualizarFs);

let phoneSubs = [];
function montarTurma() {
  phoneSubs.forEach((f) => subs.delete(f)); phoneSubs = [];
  const box = document.getElementById("phones"); box.innerHTML = "";
  const ordem = Object.keys(st.fams).length ? Object.values(st.fams).flatMap((f) => f.membros) : st.ordem;
  for (const id of ordem) {
    const i = +id.slice(1);
    locs[id] ??= Object.assign(novoLocal(), { perfil: perfilBot(i), papelBully: papelBully(i) });
    pilotos[id] ??= true;
    const f = st.alunos[id]?.fam ? st.fams[st.alunos[id].fam] : null;
    const wrap = document.createElement("div"); wrap.className = "ph-wrap";
    wrap.innerHTML = `<div class="ph-cap">${f ? iconeFamilia(f, 22) : ""}<b class="grow">${esc(st.alunos[id]?.nome || id)}</b>
      <button class="btn sm ${pilotos[id] ? "ok on" : "sec"}" data-pilot="${id}">${pilotos[id] ? "piloto" : "manual"}</button></div><div class="ph-frame"><div class="ph-screen"></div></div>`;
    box.appendChild(wrap);
    const m = montar(wrap.querySelector(".ph-screen"), () => `<div class="phone">${renderAluno(st, id, locs[id])}</div>`, (a, el) => acaoAluno(a, el, { st, id, loc: locs[id], dispatch }), (path, v) => setPath(locs[id], path, v));
    const fn = () => m.draw(); subs.add(fn); phoneSubs.push(fn); m.draw(true);
    wrap.querySelector("[data-pilot]").onclick = (e) => { pilotos[id] = !pilotos[id]; e.target.className = `btn sm ${pilotos[id] ? "ok on" : "sec"}`; e.target.textContent = pilotos[id] ? "piloto" : "manual"; };
  }
}

function novaSala() {
  st = estadoInicial();
  for (const k of Object.keys(locs)) delete locs[k];
  for (let i = 0; i < nAlunos; i++) dispatch({ t: "entrar", id: `a${i + 1}`, nome: NOMES[i] });
  montarTurma();
}
let faseAnt = st.fase;
subs.add(() => { if (st.fase !== faseAnt) { if (faseAnt === "entrada") montarTurma(); faseAnt = st.fase; } });

document.getElementById("nAl").oninput = (e) => { nAlunos = +e.target.value; document.getElementById("nAlV").textContent = nAlunos; if (st.fase === "entrada") novaSala(); };
document.getElementById("reset").onclick = () => { faseAnt = "entrada"; novaSala(); };
document.getElementById("fundo").onclick = (e) => { const on = document.querySelector(".sim").classList.toggle("fundo"); e.target.className = `btn sm ${on ? "ok on" : "sec"}`; };
document.getElementById("auto").onclick = (e) => { auto = !auto; e.target.className = `btn sm ${auto ? "ok on" : "sec"}`; e.target.textContent = `Piloto automático: ${auto ? "ligado" : "desligado"}`; };
document.getElementById("autoProf").onclick = (e) => { autoProf = !autoProf; e.target.className = `btn sm ${autoProf ? "ok on" : "sec"}`; e.target.textContent = `Professor automático: ${autoProf ? "ligado" : "desligado"}`; };

setInterval(() => { if (!auto) return; for (const id of st.ordem) if (pilotos[id]) passoBot(st, id, locs[id], dispatch); }, 600);
// Professor automático: avança quando todos enviaram (ou a cada 6 s nas telas só de leitura)
let espera = 0;
setInterval(() => {
  if (!autoProf) return;
  if (st.fase === "entrada") { dispatch({ t: "sortear", seed: Date.now() }); return; }
  if (st.fase === "fechamento") return;
  const p = progresso(st);
  const cheio = p && p.total > 0 && p.feito >= p.total;
  espera += 1;
  // R11: nas telas com revelações em sequência ou exemplo linha a linha, espera as animações do telão terminarem
  const minimo = duracaoTelao(st);
  if (espera < minimo) return;
  if ((cheio && espera >= 2) || (!(p && p.total) && espera >= 6) || espera >= Math.max(40, minimo)) { espera = 0; dispatch({ t: "fase", dir: 1 }); }
}, 1000);

novaSala();
subs.forEach((f) => f());
window.__sala = { get st() { return st; }, dispatch };
