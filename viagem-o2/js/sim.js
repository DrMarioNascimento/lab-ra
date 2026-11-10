// /simulador: telão em cima, turma embaixo. O "cérebro" da sala roda nesta página.
import { estadoInicial, reduzir, FASES } from "./engine.js";
import { renderTelao } from "./views/telao.js";
import { renderAluno, acaoAluno, novoLocal } from "./views/aluno.js";
import { renderProfessor, acaoProfessor } from "./views/professor.js";
import { montar, setPath } from "./ui.js";
import { passoBot, NOMES } from "./bots.js";
import { esc } from "./views/metro.js";

import { icon, studentShell, teamStyle } from "./visual.js";

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
  <header class="sim-header">
    <a class="brand" href="../">${icon('o2')}<span>VIAGEM DO O₂<small>Fisiologia em equipe</small></span></a>
    <div class="sim-heading"><h1>Simulador de aula</h1><p>Explore o telão, o painel do professor e os celulares da turma.</p></div>
    <div class="sim-controls"><label class="row muted">Alunos <input id="nAl" type="range" min="3" max="40" value="12"><b id="nAlV" class="mono">12</b></label>
    <button class="btn sm ok on" id="auto" aria-pressed="true">Piloto automático: ligado</button>
    <button class="btn sm sec" id="reset">Recomeçar</button></div>
  </header>
  <div class="sim">
    <div><div class="stage-heading"><span><i class="stage-dot"></i>TELÃO DA TURMA</span><b>Uma corrente. Todas as equipes.</b></div><div class="telao" id="telao"><div id="telaoIn"></div><button class="btn sm sec fsbtn" id="fs" title="Tela cheia">⛶ Tela cheia</button></div><ol class="phase-track" id="phaseTrack" aria-label="Etapas da aula"></ol></div>
    <aside class="card" id="prof" aria-label="Painel do professor"></aside>
    <section class="turma"><div class="turma-header"><div><h2>Celulares da turma</h2><p>Desligue o piloto de um celular para responder por ele. Deslize para ver os demais.</p></div><div class="turma-tools"><button class="btn sm sec" id="phonesPrev" aria-label="Ver celulares anteriores">←</button><button class="btn sm sec" id="phonesNext" aria-label="Ver próximos celulares">→</button></div></div><div class="group-nav" id="groupNav" aria-label="Localizar grupo"></div><div class="phones" id="phones"></div></section>
  </div>`;

const telaoIn = document.getElementById("telaoIn");
subs.add(() => {
  telaoIn.innerHTML = renderTelao(st);
  const k = FASES.findIndex(f => f.id === st.fase);
  document.getElementById('phaseTrack').innerHTML = FASES.map((f, i) => `<li class="${i === k ? 'current' : i < k ? 'done' : ''}" ${i === k ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${f.nome}</li>`).join('');
});
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
for (const [button, direction] of [['phonesPrev', -1], ['phonesNext', 1]]) document.getElementById(button).onclick = () => {
  const box = document.getElementById('phones');
  box.scrollBy({ left: direction * (box.querySelector('.ph-wrap')?.offsetWidth + 18 || 328), behavior: reducedMotion() ? 'auto' : 'smooth' });
};
document.getElementById('groupNav').onclick = (e) => {
  const button = e.target.closest('[data-group]');
  if (!button) return;
  const box = document.getElementById('phones');
  const target = box.querySelector(`[data-group="${button.dataset.group}"]`);
  if (target) box.scrollTo({ left: target.offsetLeft - box.offsetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
};

const prof = montar(document.getElementById("prof"), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch), () => {});
subs.add(() => prof.draw());

const screenButton = document.getElementById('fs');
const projection = document.getElementById('telao');
function projectionLabel() {
  const open = !!document.fullscreenElement || projection.classList.contains('expanded');
  screenButton.textContent = open ? '✕ Sair da tela cheia' : '⛶ Tela cheia';
  screenButton.setAttribute('aria-pressed', String(open));
}
function closeProjection() {
  projection.classList.remove('expanded');
  document.body.classList.remove('projection-open');
  projectionLabel();
}
screenButton.onclick = async () => {
  if (document.fullscreenElement) { await document.exitFullscreen(); return; }
  if (projection.classList.contains('expanded')) { closeProjection(); return; }
  const expand = () => { projection.classList.add('expanded'); document.body.classList.add('projection-open'); projectionLabel(); };
  if (projection.requestFullscreen) {
    try { await projection.requestFullscreen(); } catch { expand(); }
  } else { expand(); }
};
document.addEventListener('fullscreenchange', projectionLabel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjection(); });

let phoneSubs = [];
function montarTurma() {
  phoneSubs.forEach((f) => subs.delete(f));
  phoneSubs = [];
  const box = document.getElementById("phones");
  box.innerHTML = "";
  document.getElementById('groupNav').innerHTML = Object.values(st.grupos).map(g => `<button class="group-jump" style="${teamStyle(g)}" data-group="${g.id}"><i aria-hidden="true"></i>${g.i + 1} · ${g.cor.nome}</button>`).join('');
  const ids = Array.from({ length: nAlunos }, (_, i) => `a${i + 1}`);
  const ordem = Object.keys(st.grupos).length ? Object.values(st.grupos).flatMap((g) => g.membros) : ids;
  for (const id of ordem) {
    locs[id] ??= novoLocal();
    pilotos[id] ??= true;
    const wrap = document.createElement("div");
    wrap.className = "ph-wrap";
    const g = st.alunos[id]?.grupo ? st.grupos[st.alunos[id].grupo] : null;
    if (g) { wrap.dataset.group = g.id; wrap.style.cssText = teamStyle(g); }
    wrap.innerHTML = `<div class="ph-cap">${g ? `<span class="badge" style="background:${g.cor.hex};width:22px;height:22px;font-size:12px">${g.i + 1}</span>` : ""}<b class="grow">${esc(st.alunos[id]?.nome || id)}</b>
      <button class="btn sm ${pilotos[id] ? "ok on" : "sec"}" data-pilot="${id}">${pilotos[id] ? "piloto" : "manual"}</button></div><div class="ph-frame"><div class="ph-screen"></div></div>`;
    box.appendChild(wrap);
    const screen = wrap.querySelector(".ph-screen");
    const m = montar(screen, () => studentShell(st.grupos[st.alunos[id]?.grupo], renderAluno(st, id, locs[id])),
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
document.getElementById("auto").onclick = (e) => { auto = !auto; e.target.className = `btn sm ${auto ? "ok on" : "sec"}`; e.target.textContent = `Piloto automático: ${auto ? "ligado" : "desligado"}`; e.target.setAttribute("aria-pressed", String(auto)); };

setInterval(() => {
  if (!auto) return;
  for (const id of st.ordem) if (pilotos[id]) passoBot(st, id, locs[id], dispatch);
}, 700);

novaSala();
subs.forEach((f) => f());
window.__sala = { get st() { return st; }, dispatch };
