// Mosaico Alostase · tela do modo Prognóstico.
import { ROTINAS } from './rotinas.js';
import { novaPartida, pontuar, VARIAVEIS, TEMPOS, hhmm } from './prognostico.js';

const $ = (s) => document.querySelector(s);
const tela = $('#tela'), placar = $('#placar');
const fmt = (v, casas) => v.toFixed(casas).replace('.', ',');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const E = { tempo: 1, rotina: 'sorteio', partida: null, i: 0, respostas: [] };

// manual: abre na entrada, fica no "i"
const manual = $('#manual'), refs = $('#refs');
$('#abre-manual').onclick = () => manual.showModal();
$('#fecha-manual').onclick = () => { manual.close(); try { localStorage.setItem('ma-manual', '1'); } catch (e) { /* sem armazenamento */ } };
$('#abre-refs').onclick = () => { manual.close(); refs.showModal(); refs.scrollTop = 0; };
$('#fecha-refs').onclick = () => refs.close();
let jaViu = false; try { jaViu = localStorage.getItem('ma-manual') === '1'; } catch (e) { /* segue */ }
if (!jaViu) manual.showModal();

const CLASSE = { trabalho: 'trab', estudo: 'trab', 'trabalho-noturno': 'trab', exercicio: 'ex', 'noite-ativa': 'noite', prova: 'prova' };
const COR = { sono: '#4c1d95', trab: '#1e40af', ex: '#b45309', noite: '#9d174d', prova: '#b91c1c', ref: '#34d399' };

function blocos(ini, fim, cls) {                       // parte o bloco que atravessa a meia-noite
  const a = ((ini % 24) + 24) % 24, b = ((fim % 24) + 24) % 24;
  const um = (x, y) => `<span class="bl ${cls}" style="left:${(x / 24) * 100}%;width:${Math.max(0.8, ((y - x) / 24) * 100)}%"></span>`;
  return a < b ? um(a, b) : um(a, 24) + (b > 0 ? um(0, b) : '');
}
function linhaDoTempo(r, agora) {
  let h = '';
  for (const s of r.sono) h += blocos(s.inicio, s.fim, 'sono');
  for (const j of r.jornadas) h += blocos(j.inicio, j.fim, CLASSE[j.tipo] || 'trab');
  for (const m of r.refeicoes) h += `<span class="ref" style="left:${(m.hora / 24) * 100}%"></span>`;
  if (agora != null) h += `<span class="agora" style="left:${(agora / 24) * 100}%"></span>`;
  return `<div class="linha" role="img" aria-label="Linha do tempo de 24 horas da rotina">${h}</div><div class="horas"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>`;
}
function listaDaRotina(r) {
  const it = [];
  for (const s of r.sono) it.push({ h: s.inicio, t: `${hhmm(s.inicio)} a ${hhmm(s.fim)}`, n: 'Sono', c: 'sono' });
  for (const j of r.jornadas) it.push({ h: j.inicio, t: `${hhmm(j.inicio)} a ${hhmm(j.fim)}`, c: CLASSE[j.tipo] || 'trab',
    n: j.tipo === 'exercicio' ? `${j.nome} (${Math.round((((j.fim - j.inicio) % 24) + 24) % 24 * 60)} min, ${j.vo2}% do VO2máx)` : j.nome });
  for (const m of r.refeicoes) it.push({ h: m.hora, t: hhmm(m.hora), n: `${m.nome} (${m.carboG} g de carboidrato)`, c: 'ref' });
  if (r.alcoolGkg) it.push({ h: 23.9, t: 'Na festa', n: `Álcool: ${fmt(r.alcoolGkg, 2)} g por kg de peso`, c: 'noite' });
  it.sort((a, b) => a.h - b.h);
  return `<ul class="itens">${it.map((x) => `<li><span class="pt" style="background:${COR[x.c]}"></span><span class="h">${x.t}</span><span>${esc(x.n)}</span></li>`).join('')}</ul>`;
}

function telaInicio() {
  placar.hidden = true;
  tela.innerHTML = `
    <section class="card"><h2>Quanto tempo você tem?</h2>
      <p class="muted">O tempo define quantas estimativas o jogo pede.</p>
      <div class="grade c4" id="tempos">${TEMPOS.map((t, k) => `<button class="btn sec ${k === E.tempo ? 'on' : ''}" data-k="${k}" aria-pressed="${k === E.tempo}">${t.min} min</button>`).join('')}</div>
    </section>
    <section class="card"><h2>Qual rotina?</h2>
      <div class="grade" id="rotinas" style="margin-top:10px">
        <button class="btn sec ${E.rotina === 'sorteio' ? 'on' : ''}" data-r="sorteio">Sortear uma rotina</button>
        ${ROTINAS.map((r) => `<button class="btn sec ${E.rotina === r.id ? 'on' : ''}" data-r="${r.id}">${esc(r.nome)}</button>`).join('')}
      </div>
    </section>
    <button class="btn ok block" id="vai">Ver a rotina</button>`;
  $('#tempos').onclick = (e) => { const b = e.target.closest('[data-k]'); if (b) { E.tempo = +b.dataset.k; telaInicio(); } };
  $('#rotinas').onclick = (e) => { const b = e.target.closest('[data-r]'); if (b) { E.rotina = b.dataset.r; telaInicio(); } };
  $('#vai').onclick = () => {
    const semente = (Date.now() % 100000) + 1;
    const r = E.rotina === 'sorteio' ? ROTINAS[semente % ROTINAS.length] : ROTINAS.find((x) => x.id === E.rotina);
    E.partida = novaPartida(r, TEMPOS[E.tempo].perguntas, semente); E.i = 0; E.respostas = [];
    telaRotina();
  };
  scrollTo(0, 0);
}

function telaRotina() {
  const p = E.partida, r = p.rotina;
  tela.innerHTML = `
    <section class="card"><div class="rotulo">Rotina de hoje</div><h2>${esc(r.nome)}</h2>
      <div style="margin-top:10px">${linhaDoTempo(r)}</div>${listaDaRotina(r)}
    </section>
    <section class="card"><div class="rotulo">Ao acordar, às ${hhmm(p.ancora.hora)}</div>
      <div class="ancoras">
        <div class="valor cort"><b>${fmt(p.ancora.cortisol, 1)}</b><span>Cortisol, µg/dL</span></div>
        <div class="valor glic"><b>${fmt(p.ancora.glicemia, 0)}</b><span>Glicemia, mg/dL</span></div>
      </div>
      <p class="muted nota">Este é o ponto de partida. Serão ${p.perguntas.length} estimativas ao longo do dia.</p>
    </section>
    <button class="btn ok block" id="vai">Começar</button>
    <button class="link" id="volta">Trocar de rotina</button>`;
  $('#vai').onclick = telaPergunta; $('#volta').onclick = telaInicio; scrollTo(0, 0);
}

const somaPontos = () => E.respostas.reduce((t, x) => t + x.pontos, 0);
function atualizaPlacar() { placar.hidden = false; placar.textContent = `${Math.min(E.i + 1, E.partida.perguntas.length)}/${E.partida.perguntas.length} · ${somaPontos()} pts`; }

function telaPergunta() {
  const p = E.partida, q = p.perguntas[E.i], v = VARIAVEIS[q.variavel];
  const ant = E.respostas.filter((x) => x.variavel === q.variavel).slice(-1)[0];
  const ref = ant ? { hora: ant.hora, valor: ant.valor } : { hora: p.ancora.hora, valor: p.ancora[q.variavel] };
  atualizaPlacar();
  tela.innerHTML = `
    <section class="card">${linhaDoTempo(p.rotina, q.hora)}</section>
    <section class="card pergunta">
      <div class="rotulo">Estimativa ${E.i + 1} de ${p.perguntas.length}</div>
      <h2>Às ${hhmm(q.hora)}, quanto está <span class="cor-${q.variavel}">${v.nome === 'Cortisol' ? 'o cortisol' : 'a glicemia'}</span>?</h2>
      <p class="muted nota">Último valor conhecido: <b class="mono">${fmt(ref.valor, v.casas)} ${v.unidade}</b> às ${hhmm(ref.hora)}.</p>
      <div class="numero"><b id="num" class="cor-${q.variavel}">${fmt(ref.valor, v.casas)}</b><span>${v.unidade}</span></div>
      <input type="range" id="sl" min="${v.min}" max="${v.max}" step="${v.passo}" value="${ref.valor}" aria-label="${v.nome} em ${v.unidade}">
      <div class="limites"><span>${v.min}</span><span>${v.max}</span></div>
      <div class="ajuste"><button class="btn sec sm" id="menos">− ${fmt(v.passo, v.casas)}</button><button class="btn sec sm" id="mais">+ ${fmt(v.passo, v.casas)}</button></div>
      <button class="btn ok block" id="ok">Confirmar</button>
    </section>
    <details class="card"><summary class="rotulo" style="cursor:pointer;margin:0">Rever a rotina</summary>${listaDaRotina(p.rotina)}</details>`;
  const sl = $('#sl'), num = $('#num');
  const mostra = () => { num.textContent = fmt(+sl.value, v.casas); };
  sl.oninput = mostra;
  $('#menos').onclick = () => { sl.value = +sl.value - v.passo; mostra(); };
  $('#mais').onclick = () => { sl.value = +sl.value + v.passo; mostra(); };
  $('#ok').onclick = () => { const palpite = +sl.value; E.respostas.push({ ...q, palpite, pontos: pontuar(palpite, q.faixa) }); telaRevelacao(); };
  scrollTo(0, 0);
}

function telaRevelacao() {
  const p = E.partida, x = E.respostas[E.i], v = VARIAVEIS[x.variavel];
  const pos = (val) => Math.max(0, Math.min(100, ((val - v.min) / (v.max - v.min)) * 100));
  const cls = x.pontos === 100 ? 'cheio' : x.pontos > 0 ? 'meio' : 'zero';
  const frase = x.pontos === 100 ? 'Dentro da faixa.' : x.pontos > 0 ? (x.palpite < x.valor ? 'Um pouco abaixo da faixa.' : 'Um pouco acima da faixa.') : (x.palpite < x.valor ? 'Bem abaixo do esperado.' : 'Bem acima do esperado.');
  const ultima = E.i === p.perguntas.length - 1;
  atualizaPlacar();
  tela.innerHTML = `
    <section class="card">
      <div class="rotulo">${v.nome} às ${hhmm(x.hora)}</div>
      <div class="resultado"><h2>${frase}</h2><span class="pontos ${cls}">+${x.pontos}</span></div>
      <div class="regua" role="img" aria-label="Esperado ${fmt(x.valor, v.casas)}, faixa de ${fmt(x.faixa[0], v.casas)} a ${fmt(x.faixa[1], v.casas)}, seu palpite ${fmt(x.palpite, v.casas)} ${v.unidade}">
        <span class="trilho"></span>
        <span class="faixa" style="left:${pos(x.faixa[0])}%;width:${pos(x.faixa[1]) - pos(x.faixa[0])}%"></span>
        <span class="m esp" style="left:${pos(x.valor)}%"><i>esperado ${fmt(x.valor, v.casas)}</i></span>
        <span class="m pal" style="left:${pos(x.palpite)}%"><i>você ${fmt(x.palpite, v.casas)}</i></span>
      </div>
      <p class="muted nota">Faixa aceita: <b class="mono">${fmt(x.faixa[0], v.casas)} a ${fmt(x.faixa[1], v.casas)} ${v.unidade}</b>, a variação entre pessoas saudáveis.</p>
      <div class="rotulo" style="margin-top:12px">Por quê</div>
      <ul class="porque">${x.raciocinio.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <button class="btn ok block" id="prox">${ultima ? 'Ver o dia inteiro' : 'Próxima'}</button>
    </section>`;
  $('#prox').onclick = () => { E.i++; ultima ? telaFim() : telaPergunta(); };
  scrollTo(0, 0);
}

function grafico(variavel) {
  const p = E.partida, v = VARIAVEIS[variavel], W = 340, H = 150, L = 34, R = 8, T = 8, B = 22;
  const pts = p.dia.pontos, vals = pts.map((q) => q[variavel]);
  const pal = E.respostas.filter((x) => x.variavel === variavel);
  const max = Math.max(...vals, ...pal.map((x) => x.palpite)) * 1.1, min = variavel === 'glicemia' ? Math.min(70, ...pal.map((x) => x.palpite)) : 0;
  const X = (h) => L + (h / 24) * (W - L - R), Y = (val) => T + (1 - (val - min) / (max - min)) * (H - T - B);
  const linha = pts.map((q, i) => `${i ? 'L' : 'M'}${X(q.hora).toFixed(1)},${Y(q[variavel]).toFixed(1)}`).join('');
  const cor = variavel === 'cortisol' ? '#f59e0b' : '#38bdf8';
  const ticks = [min, (min + max) / 2, max].map((t) => `<text x="${L - 5}" y="${Y(t) + 4}" text-anchor="end" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${fmt(t, 0)}</text><line x1="${L}" x2="${W - R}" y1="${Y(t)}" y2="${Y(t)}" stroke="#23415f" stroke-width="1"/>`).join('');
  const hx = [0, 6, 12, 18, 24].map((h) => `<text x="${X(h)}" y="${H - 6}" text-anchor="${h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${h}h</text>`).join('');
  const bolas = pal.map((x) => `<circle cx="${X(x.hora)}" cy="${Y(x.palpite)}" r="5" fill="#fff" stroke="#07111f" stroke-width="2"><title>${hhmm(x.hora)}: você ${fmt(x.palpite, v.casas)}, esperado ${fmt(x.valor, v.casas)}</title></circle>`).join('');
  return `<svg class="graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva esperada de ${v.nome} no dia e seus palpites">${ticks}${hx}<path d="${linha}" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linejoin="round"/>${bolas}</svg>`;
}

function telaFim() {
  const p = E.partida, total = somaPontos(), maximo = p.perguntas.length * 100, naFaixa = E.respostas.filter((x) => x.pontos === 100).length;
  const q = p.dia.sonoQualidade, notas = [];
  for (const a of p.dia.alertas) notas.push(a.texto);
  if (q.remPerdidoMin) notas.push(`Nesta noite, o álcool tirou cerca de ${fmt(q.remPerdidoMin, 0)} minutos de sono REM e atrasou o primeiro REM em ${fmt(q.atrasoRemMin, 0)} minutos.`);
  if (q.horas < 7) notas.push(`Foram ${fmt(q.horas, 0)} horas de sono: a pressão de sono não chega a zerar e o dia seguinte começa devendo.`);
  if (p.rotina.jornadas.some((j) => j.tipo === 'prova')) notas.push('Em volta da prova o jogo não pediu o cortisol: avaliação diante de outras pessoas costuma elevá-lo, com pico de 20 a 40 minutos depois do início, mas o tamanho varia muito de pessoa para pessoa.');
  placar.hidden = true;
  tela.innerHTML = `
    <section class="card total"><div class="rotulo">Fim do dia</div><b>${total}</b><span class="muted">de ${maximo} pontos · ${naFaixa} de ${p.perguntas.length} dentro da faixa</span></section>
    ${['cortisol', 'glicemia'].map((k) => `<section class="card"><h3 class="cor-${k}">${VARIAVEIS[k].nome} (${VARIAVEIS[k].unidade})</h3>${grafico(k)}
      <div class="legenda"><span><i style="background:${k === 'cortisol' ? '#f59e0b' : '#38bdf8'}"></i>Esperado</span><span><i style="background:#fff;height:8px;width:8px;border-radius:50%"></i>Seus palpites</span></div></section>`).join('')}
    ${notas.length ? `<section class="card"><div class="rotulo">O que este dia mostra</div><ul class="porque">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}
    <p class="aviso">Modelo médio de adulto saudável. Não é o seu corpo e não serve de diagnóstico.</p>
    <button class="btn ok block" id="de-novo">Jogar outra rotina</button>`;
  $('#de-novo').onclick = telaInicio; scrollTo(0, 0);
}

telaInicio();
