// /simulador: telão em cima, turma embaixo. O "cérebro" da sala roda nesta página (na sala real, no celular de quem conduz).
import { estadoInicial, reduzir, perguntaAtual, partidaDe } from './engine.js';
import { renderTelao, renderAluno, renderProfessor, acaoProfessor, chaveDoAluno, esc } from './views.js';
import { montar } from './ui.js';
import { ligarTelaCheia } from './modo-telao.js';

const NOMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabi', 'Hugo', 'Iara', 'João', 'Kátia', 'Leo', 'Mari', 'Nando', 'Olga', 'Pedro', 'Rita', 'Sérgio', 'Tati', 'Vitor', 'Wanda', 'Yuri', 'Zeca', 'Alice', 'Bia', 'Caio', 'Duda', 'Enzo', 'Flávia', 'Gui', 'Heitor', 'Isa', 'Jade', 'Kaio', 'Lara', 'Marcos', 'Nina', 'Otávio', 'Paula', 'Rafa'];
const MAX_TELAS = 6;
let st = { ...estadoInicial(), codigo: 'SIMUL' }, nAlunos = 20, auto = true;
const pilotos = {}, locs = {}, subs = new Set(); let agendado = false;
function dispatch(a) {
  const novo = reduzir(st, a); if (novo === st) return; st = novo;
  if (!agendado) { agendado = true; requestAnimationFrame(() => { agendado = false; subs.forEach((f) => f()); }); }
}
const app = document.getElementById('app');
app.innerHTML = `<header class="sim-topo"><span class="selo">MA</span><div style="flex:1"><b>Mosaico Alostase · Simulador de aula</b><div class="faint">Telão em cima, turma embaixo. O professor comanda pelo painel ao lado.</div></div>
  <label class="row muted">Participantes <input id="nAl" type="range" min="2" max="40" value="20" style="width:140px"><b id="nAlV" class="mono">20</b></label>
  <button class="btn sm ok on" id="auto">Participantes automáticos: ligados</button><button class="btn sm sec" id="reset">Recomeçar</button></header>
  <div class="sim"><div><div class="telao" id="telao"><button class="btn sm sec fsbtn" id="fs">⛶ Tela cheia</button><div class="tl" id="telaoIn"></div></div><p class="fundo-nota">Assim fica o telão numa TV de 55" vista de longe.</p></div>
  <aside class="card" id="prof"></aside>
  <section class="turma card"><div class="row" style="justify-content:space-between"><h3>Turma</h3><span class="faint" id="nota"></span></div><div class="phones" id="phones"></div></section></div>`;
const telaoIn = document.getElementById('telaoIn');
ligarTelaCheia(document.getElementById('telao'), document.getElementById('fs'));
subs.add(() => { telaoIn.innerHTML = renderTelao(st); });
const prof = montar(document.getElementById('prof'), () => renderProfessor(st), (a, el) => acaoProfessor(a, el, dispatch, st),
  () => [st.fase, st.qi, st.rotinaId, st.n, st.semente, st.ordem.length, Object.keys(st.resp[st.qi] || {}).length].join('|'));
subs.add(() => prof.draw());

let fones = [];
function montarTurma() {
  fones.forEach((f) => subs.delete(f)); fones = [];
  const box = document.getElementById('phones'); box.innerHTML = '';
  const ids = st.ordem.slice(0, MAX_TELAS), outros = st.ordem.length - ids.length;
  document.getElementById('nota').textContent = outros > 0 ? `Mais ${outros} participantes automáticos, sem celular na tela.` : '';
  for (const id of ids) {
    pilotos[id] ??= true; locs[id] ??= { manual: false, valor: {} };
    const wrap = document.createElement('div'); wrap.className = 'ph-wrap';
    wrap.innerHTML = `<div class="ph-cap"><b>${esc(st.alunos[id].nome)}</b><button class="btn sm ${pilotos[id] ? 'ok on' : 'sec'}" data-piloto="${id}">${pilotos[id] ? 'piloto' : 'manual'}</button></div><div class="ph-frame"><div class="ph-screen"></div></div>`;
    box.appendChild(wrap);
    const loc = locs[id];
    const m = montar(wrap.querySelector('.ph-screen'), () => renderAluno(st, id, loc), (a) => {
      if (a === 'manual') { loc.manual = true; m.draw(true); return; }
      if (a === 'entendi') { loc.manual = false; m.draw(true); return; }
      if (a === 'enviar') { const v = loc.valor[st.qi] ?? Number(wrap.querySelector('#sl')?.value); if (Number.isFinite(v)) dispatch({ t: 'responder', id, valor: v }); }
    }, () => chaveDoAluno(st, id, loc), (el) => { if (el.id === 'sl') { loc.valor[st.qi] = Number(el.value); const vv = wrap.querySelector('#vv'); if (vv) vv.textContent = Number(el.value).toFixed(el.step.includes('.') ? 1 : 0).replace('.', ','); } });
    const f = () => m.draw(); subs.add(f); fones.push(f); m.draw(true);
    wrap.querySelector('[data-piloto]').onclick = (e) => { pilotos[id] = !pilotos[id]; e.target.className = `btn sm ${pilotos[id] ? 'ok on' : 'sec'}`; e.target.textContent = pilotos[id] ? 'piloto' : 'manual'; };
  }
}
function novaSala() {
  st = { ...estadoInicial(), codigo: 'SIMUL' };
  for (const k of Object.keys(locs)) delete locs[k];
  for (let i = 0; i < nAlunos; i++) st = reduzir(st, { t: 'entrar', id: `a${i + 1}`, nome: NOMES[i % NOMES.length] + (i >= NOMES.length ? ` ${Math.floor(i / NOMES.length) + 1}` : '') });
  montarTurma(); subs.forEach((f) => f());
}
// Participantes automáticos: respondem perto do esperado, com erro de tamanho variado e uma parte bem fora.
const rnd = (() => { let a = 12345; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
const marcados = new Set();
setInterval(() => {
  if (st.fase !== 'pergunta') { marcados.clear(); return; }
  if (!auto) return;
  const q = perguntaAtual(st), meia = (q.faixa[1] - q.faixa[0]) / 2;
  for (const id of st.ordem) {
    if (st.resp[st.qi]?.[id] != null || (pilotos[id] === false) || marcados.has(`${st.qi}|${id}`)) continue;
    if (rnd() < 0.35) { marcados.add(`${st.qi}|${id}`); dispatch({ t: 'responder', id, valor: q.valor + gauss() * meia * (rnd() < 0.2 ? 3.5 : 1.1) }); }
  }
}, 700);
// Professor automático: avança sozinho, útil para ver a rodada inteira.
document.getElementById('auto').onclick = (e) => { auto = !auto; e.target.className = `btn sm ${auto ? 'ok on' : 'sec'}`; e.target.textContent = `Participantes automáticos: ${auto ? 'ligados' : 'desligados'}`; };
document.getElementById('nAl').oninput = (e) => { nAlunos = +e.target.value; document.getElementById('nAlV').textContent = nAlunos; novaSala(); };
document.getElementById('reset').onclick = novaSala;
novaSala();
window.__sim = { get st() { return st; }, dispatch };
