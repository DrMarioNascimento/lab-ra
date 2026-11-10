// /simulador: telão em cima, turma embaixo. O "cérebro" da sala roda nesta página.
import { estadoInicial, reduzir } from "./engine.js";
import { renderTelao } from "./views/telao.js";
import { renderAluno, acaoAluno, novoLocal } from "./views/aluno.js";
import { renderProfessor, acaoProfessor } from "./views/professor.js";
import { montar, setPath } from "./ui.js";
import { passoBot, NOMES } from "./bots.js";
import { esc } from "./views/metro.js";

let st = estadoInicial("B1");
const subs = new Set();
let agendado = false;
function dispatch(a) {
  st = reduzir(st, a);
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}

const app = document.getElementById("app");
let nAlunos = 12, auto = true;
const locs = {}, pilotos = {};

app.innerHTML = `
  <header class="row" style="padding:14px 16px 0;max-width:1800px;margin:0 auto">
    <span class="badge" style="background:linear-gradient(180deg,#fb7185,#e11d48)">O₂</span>
    <div class="grow"><b style="font-size:18px">Viagem do O₂ · Simulador de aula</b><div class="faint" style="font-size:12px">Telão em cima, turma embaixo. O professor comanda pelo painel ao lado (na sala real, pelo celular).</div></div>
    <label class="row muted" style="gap:6px">Alunos <input id="nAl" type="range" min="3" max="40" value="12" style="width:140px"><b id="nAlV" class="mono">12</b></label>
    <button class="btn sm ok on" id="auto">Piloto automático: ligado</button>
    <button class="btn sm sec" id="reset">Recomeçar</button>
  </header>
  <div class="sim">
    <div><div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs" title="Tela cheia">⛶ Tela cheia</button><div id="telaoIn"></div></div></div>
    <aside class="card" id="prof" style="max-height:calc(56.25vw * 0.78);overflow:auto"></aside>
    <section class="turma"><div class="row" style="justify-content:space-between"><h3>Turma</h3><span class="faint">Desligue o piloto de um celular para clicar nele à mão.</span></div><div class="phones" id="phones"></div></section>
  </div>`;

const telaoIn = document.getElementById("telaoIn");
subs.add(() => { telaoIn.innerHTML = renderTelao(st); });

const prof = montar(document.getElementById("prof"), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch), () => {});
subs.add(() => prof.draw());

document.getElementById("fs").onclick = () => {
  const t = document.getElementById("telao");
  if (document.fullscreenElement) document.exitFullscreen(); else t.requestFullscreen?.();
};
document.addEventListener("fullscreenchange", () => { document.getElementById("fs").textContent = document.fullscreenElement ? "✕ Sair da tela cheia" : "⛶ Tela cheia"; });

let phoneSubs = [];
function montarTurma() {
  phoneSubs.forEach((f) => subs.delete(f));
  phoneSubs = [];
  const box = document.getElementById("phones");
  box.innerHTML = "";
  const ids = Array.from({ length: nAlunos }, (_, i) => `a${i + 1}`);
  const ordem = Object.keys(st.grupos).length ? Object.values(st.grupos).flatMap((g) => g.membros) : ids;
  for (const id of ordem) {
    locs[id] ??= novoLocal();
    pilotos[id] ??= true;
    const wrap = document.createElement("div");
    wrap.className = "ph-wrap";
    const g = st.alunos[id]?.grupo ? st.grupos[st.alunos[id].grupo] : null;
    wrap.innerHTML = `<div class="ph-cap">${g ? `<span class="badge" style="background:${g.cor.hex};width:22px;height:22px;font-size:12px">${g.i + 1}</span>` : ""}<b class="grow">${esc(st.alunos[id]?.nome || id)}</b>
      <button class="btn sm ${pilotos[id] ? "ok on" : "sec"}" data-pilot="${id}">${pilotos[id] ? "piloto" : "manual"}</button></div><div class="ph-frame"><div class="ph-screen"></div></div>`;
    box.appendChild(wrap);
    const screen = wrap.querySelector(".ph-screen");
    const m = montar(screen, () => `<div class="phone">${renderAluno(st, id, locs[id])}</div>`,
      (a, el) => acaoAluno(a, el, { st, id, loc: locs[id], dispatch }),
      (path, v) => setPath(locs[id], path, v));
    const f = () => m.draw();
    subs.add(f); phoneSubs.push(f);
    m.draw(true);
    wrap.querySelector("[data-pilot]").onclick = (e) => { pilotos[id] = !pilotos[id]; e.target.className = `btn sm ${pilotos[id] ? "ok on" : "sec"}`; e.target.textContent = pilotos[id] ? "piloto" : "manual"; };
  }
}

function novaSala() {
  const caso = st.casoId;
  st = estadoInicial(caso);
  for (const k of Object.keys(locs)) delete locs[k];
  for (let i = 0; i < nAlunos; i++) dispatch({ t: "entrar", id: `a${i + 1}`, nome: NOMES[i] });
  montarTurma();
}

let faseAnt = st.fase;
subs.add(() => { if (st.fase !== faseAnt) { if (faseAnt === "entrada") montarTurma(); faseAnt = st.fase; } });

document.getElementById("nAl").oninput = (e) => { nAlunos = +e.target.value; document.getElementById("nAlV").textContent = nAlunos; if (st.fase === "entrada") novaSala(); };
document.getElementById("reset").onclick = () => { faseAnt = "entrada"; novaSala(); };
document.getElementById("auto").onclick = (e) => { auto = !auto; e.target.className = `btn sm ${auto ? "ok on" : "sec"}`; e.target.textContent = `Piloto automático: ${auto ? "ligado" : "desligado"}`; };

setInterval(() => {
  if (!auto) return;
  for (const id of st.ordem) if (pilotos[id]) passoBot(st, id, locs[id], dispatch);
}, 700);

novaSala();
subs.forEach((f) => f());
window.__sala = { get st() { return st; }, dispatch };
