// /simulador: telão em cima, turma embaixo. O "cérebro" da sala roda nesta página.
import { estadoInicial, reduzir, papelById } from "./engine.js";
import { renderTelao } from "./views/telao.js";
import { renderAluno, acaoAluno, novoLocal } from "./views/aluno.js";
import { renderProfessor, acaoProfessor } from "./views/professor.js";
import { montar, setPath } from "./ui.js";
import { passoBot, NOMES } from "./bots.js";
import { visor360 } from "./scene3d.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let st = estadoInicial();
const subs = new Set();
let agendado = false;
function dispatch(a) {
  st = reduzir(st, a);
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}

const app = document.getElementById("app");
let nAlunos = 14, auto = true;
const locs = {}, pilotos = {};
app.innerHTML = `
  <header class="row" style="padding:14px 16px 0;max-width:1800px;margin:0 auto">
    <span class="badge" style="background:linear-gradient(180deg,#a78bfa,#6d28d9)">◎</span>
    <div class="grow"><b style="font-size:18px">Ângulos · Simulador de aula</b><div class="faint" style="font-size:12px">Telão em cima, turma embaixo. Use o painel do professor para conduzir a aula.</div></div>
    <label class="row muted" style="gap:6px">Alunos <input id="nAl" type="range" min="3" max="40" value="14" style="width:140px"><b id="nAlV" class="mono">14</b></label>
    <button class="btn sm ok on" id="auto">Piloto automático: ligado</button>
    <button class="btn sm sec" id="reset">Recomeçar</button>
  </header>
  <div class="sim">
    <div><div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs">⛶ Tela cheia</button><div id="telaoIn"></div></div></div>
    <aside class="card" id="prof" style="max-height:calc(56.25vw * 0.78);overflow:auto"></aside>
    <section class="turma"><div class="row" style="justify-content:space-between"><h3>Turma</h3><span class="faint">Desligue o piloto de um celular para clicar nele à mão.</span></div><label class="row filtro-turma" for="filtroTurma">Mostrar <select id="filtroTurma"></select></label><p id="filtroVazio" class="muted" hidden>Este papel ainda não tem líder.</p><div class="phones" id="phones"></div></section>
  </div>`;

// Telão, preservando o visor 3D entre redesenhos
const telaoIn = document.getElementById("telaoIn");
const caixa3d = document.createElement("div");
caixa3d.style.cssText = "position:absolute;inset:0";
let visor = null, focoAtual;
subs.add(() => {
  if (caixa3d.parentNode) caixa3d.remove();
  telaoIn.innerHTML = renderTelao(st);
  const slot = telaoIn.querySelector("#slot3d");
  if (slot) {
    slot.appendChild(caixa3d);
    if (!visor) visor = visor360(caixa3d, st.pers);
    if (st.foco !== focoAtual) { focoAtual = st.foco; visor.irPara(st.foco || null); }
  } else if (visor && st.fase !== "confronto") { visor.destruir(); visor = null; focoAtual = undefined; }
});

const prof = montar(document.getElementById("prof"), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch), () => {});
subs.add(() => prof.draw());

document.getElementById("fs").onclick = () => { const t = document.getElementById("telao"); if (document.fullscreenElement) document.exitFullscreen(); else t.requestFullscreen?.(); };
document.addEventListener("fullscreenchange", () => { document.getElementById("fs").textContent = document.fullscreenElement ? "✕ Sair da tela cheia" : "⛶ Tela cheia"; });

let phoneSubs = [];
function montarTurma() {
  phoneSubs.forEach((f) => subs.delete(f)); phoneSubs = [];
  const box = document.getElementById("phones"); box.innerHTML = "";
  const ids = Array.from({ length: nAlunos }, (_, i) => `a${i + 1}`);
  const ordem = Object.keys(st.grupos).length ? Object.values(st.grupos).flatMap((g) => g.membros) : ids;
  for (const id of ordem) {
    locs[id] ??= novoLocal(); pilotos[id] ??= true;
    const g = st.alunos[id]?.grupo ? st.grupos[st.alunos[id].grupo] : null;
    const cor = g ? papelById(g.papel).cor : null;
    const wrap = document.createElement("div"); wrap.className = "ph-wrap";
    wrap.innerHTML = `<div class="ph-cap">${g ? `<span class="badge" style="background:${cor};width:22px;height:22px;font-size:12px">${g.i + 1}</span>` : ""}<b class="grow">${esc(st.alunos[id]?.nome || id)}</b>
      <button class="btn sm ${pilotos[id] ? "ok on" : "sec"}" data-pilot="${id}">${pilotos[id] ? "piloto" : "manual"}</button></div><div class="ph-frame"><div class="ph-screen"></div></div>`;
    wrap.dataset.grupo = g?.id ?? "";
    wrap.dataset.aluno = id;
    box.appendChild(wrap);
    const m = montar(wrap.querySelector(".ph-screen"), () => `<div class="phone">${renderAluno(st, id, locs[id])}</div>`, (a, el) => acaoAluno(a, el, { st, id, loc: locs[id], dispatch }), (path, v) => setPath(locs[id], path, v));
    const f = () => m.draw(); subs.add(f); phoneSubs.push(f); m.draw(true);
    wrap.querySelector("[data-pilot]").onclick = (e) => { pilotos[id] = !pilotos[id]; e.target.className = `btn sm ${pilotos[id] ? "ok on" : "sec"}`; e.target.textContent = pilotos[id] ? "piloto" : "manual"; };
  }
  const filtro = document.getElementById("filtroTurma");
  filtro.innerHTML = '<option value="">Toda a turma</option>' + Object.values(st.grupos).map((g) =>
    `<optgroup label="${esc(papelById(g.papel).nome)}">
      <option value="${g.id}">${esc(papelById(g.papel).nome)} · todos</option>
      <option value="lider:${g.id}">${esc(papelById(g.papel).nome)} · líder</option>
    </optgroup>`).join("");
}

const filtroTurma = document.getElementById("filtroTurma");
function filtrarTurma() {
  const filtro = filtroTurma.value;
  const alvo = filtro.startsWith("lider:") ? st.grupos[filtro.slice(6)] : null;
  for (const wrap of document.querySelectorAll("#phones .ph-wrap")) {
    wrap.hidden = alvo ? wrap.dataset.aluno !== alvo.lider : Boolean(filtro && wrap.dataset.grupo !== filtro);
  }
  document.getElementById("filtroVazio").hidden = Boolean(!alvo || alvo.lider);
}
filtroTurma.onchange = () => {
  document.getElementById("phones").scrollLeft = 0;
  filtrarTurma();
};
subs.add(filtrarTurma);

function novaSala() {
  st = estadoInicial();
  for (const k of Object.keys(locs)) delete locs[k];
  if (visor) { visor.destruir(); visor = null; focoAtual = undefined; }
  for (let i = 0; i < nAlunos; i++) dispatch({ t: "entrar", id: `a${i + 1}`, nome: NOMES[i] });
  montarTurma();
}
let faseAnt = st.fase;
subs.add(() => { if (st.fase !== faseAnt) { if (faseAnt === "entrada") montarTurma(); faseAnt = st.fase; } });

document.getElementById("nAl").oninput = (e) => { nAlunos = +e.target.value; document.getElementById("nAlV").textContent = nAlunos; if (st.fase === "entrada") novaSala(); };
document.getElementById("reset").onclick = () => { faseAnt = "entrada"; novaSala(); };
document.getElementById("auto").onclick = (e) => { auto = !auto; e.target.className = `btn sm ${auto ? "ok on" : "sec"}`; e.target.textContent = `Piloto automático: ${auto ? "ligado" : "desligado"}`; };

setInterval(() => { if (!auto) return; for (const id of st.ordem) if (pilotos[id]) passoBot(st, id, locs[id], dispatch); }, 700);

novaSala();
subs.forEach((f) => f());
window.__sala = { get st() { return st; }, dispatch };
