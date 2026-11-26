// Mosaico Alostase · tela do modo Prognóstico.
import { ROTINAS } from './rotinas.js';
import { relogio, ligarCeu } from './relogio.js';
import { novaPartida, pontuar, VARIAVEIS, TEMPOS, hhmm, momentoGlicemia, rotuloGlicemia } from './prognostico.js';
import { leitura, custoDoDia } from './rotina-montada.js';
import { $, fmt, esc, linhaDoTempo, listaDaRotina, grafico, cartaoCusto, CORV } from './ui.js';
import { telaEntradaDiag } from './diagnostico.js';
import { SEMANAS } from './semanas.js';
import { jogarSemana } from './prog-semana.js';

const tela = $('#tela'), placar = $('#placar'), sub = $('#sub');
ligarCeu(tela);
const E = { tempo: 1, rotina: 'sorteio', escala: 'dia', semana: 'sorteio', partida: null, i: 0, respostas: [] };

// manual: abre na entrada, fica no "i"
const manual = $('#manual'), refs = $('#refs');
$('#abre-manual').onclick = () => { manual.showModal(); manual.scrollTop = 0; };
$('#fecha-manual').onclick = () => { manual.close(); try { localStorage.setItem('ma-manual', '1'); } catch (e) { /* sem armazenamento */ } };
$('#abre-refs').onclick = () => { manual.close(); refs.showModal(); refs.scrollTop = 0; };
$('#fecha-refs').onclick = () => refs.close();
let jaViu = false; try { jaViu = localStorage.getItem('ma-manual') === '1'; } catch (e) { /* segue */ }
if (!jaViu) { manual.showModal(); manual.scrollTop = 0; }

function telaModos() {
  placar.hidden = true; sub.textContent = 'Fisiologia da rotina';
  tela.innerHTML = `
    <section class="card modo"><div class="rotulo">Modo Prognóstico</div><h2>O jogo dá a rotina, você estima</h2>
      <p class="muted">A cada hora sorteada, diga onde estão o cortisol e a glicemia. Vale ponto.</p>
      <button class="btn ok block" id="m-prog">Jogar o Prognóstico</button></section>
    <section class="card modo"><div class="rotulo">Modo Diagnóstico</div><h2>Você monta a rotina, o jogo mostra</h2>
      <p class="muted">Escolha sono, refeições, trabalho, treino e noite. Veja o esperado, hora a hora.</p>
      <button class="btn block" id="m-diag">Abrir o Diagnóstico</button></section>
    <section class="card modo"><div class="rotulo">Sala de aula</div><h2>Com telão e a turma nos celulares</h2>
      <p class="muted">O professor abre a sala; a turma estima no celular e o telão revela onde a turma acertou.</p>
      <a class="btn sec block" href="sala/index.html" style="text-align:center;text-decoration:none;display:block;padding-top:14px">Entrar na sala de aula</a></section>
    <section class="card modo"><div class="rotulo">Bancada cardiovascular</div><h2>Frequência cardíaca e pressão em 24 horas</h2>
      <p class="muted">Compare duas rotinas e confira os cálculos em cada horário.</p>
      <a class="btn sec block" href="cardiovascular/" style="text-align:center;text-decoration:none;display:block;padding-top:14px">Abrir a bancada cardiovascular</a></section>
    <section class="card modo"><div class="rotulo">Hidratação e circulação</div><h2>Como o calor altera a resposta ao exercício?</h2>
      <p class="muted">Acompanhe suor, volume plasmático, osmolalidade e suas relações com o coração.</p>
      <a class="btn sec block" href="hidratacao/" style="text-align:center;text-decoration:none;display:block;padding-top:14px">Abrir hidratação e circulação</a></section>
    <section class="card modo"><div class="rotulo">Fisiologia renal</div><h2>Como o rim ajusta água e sódio?</h2>
      <p class="muted">Acompanhe pressão, vasopressina, renina, angiotensina II, aldosterona e o que muda na urina.</p>
      <a class="btn sec block" href="hidratacao/?rim=1" style="text-align:center;text-decoration:none;display:block;padding-top:14px">Abrir rim e pressão arterial</a></section>
    <p class="aviso">O organismo do jogo é um modelo médio de adulto saudável. Não é o seu corpo e não serve de diagnóstico clínico.</p>`;
  $('#m-prog').onclick = telaInicio;
  $('#m-diag').onclick = () => { sub.textContent = 'Modo Diagnóstico'; telaEntradaDiag(tela, telaModos); };
  scrollTo(0, 0);
}

function telaInicio() {
  placar.hidden = true; sub.textContent = 'Modo Prognóstico';
  tela.innerHTML = `
    <section class="card"><h2>Quanto tempo você tem?</h2>
      <p class="muted">O tempo define quantas estimativas o jogo pede.</p>
      <div class="grade c4" id="tempos">${TEMPOS.map((t, k) => `<button class="btn sec ${k === E.tempo ? 'on' : ''}" data-k="${k}" aria-pressed="${k === E.tempo}">${t.min} min</button>`).join('')}</div>
    </section>
    <section class="card"><h2>Um dia ou a semana?</h2>
      <div class="grade c2" id="escala" style="margin-top:10px"><button class="btn sec ${E.escala === 'dia' ? 'on' : ''}" data-e="dia" aria-pressed="${E.escala === 'dia'}">Um dia</button><button class="btn sec ${E.escala === 'semana' ? 'on' : ''}" data-e="semana" aria-pressed="${E.escala === 'semana'}">Semana 1</button></div>
    </section>
    ${E.escala === 'dia' ? `<section class="card"><h2>Qual rotina?</h2>
      <div class="grade" id="rotinas" style="margin-top:10px">
        <button class="btn sec ${E.rotina === 'sorteio' ? 'on' : ''}" data-r="sorteio">Sortear uma rotina</button>
        ${ROTINAS.map((r) => `<button class="btn sec ${E.rotina === r.id ? 'on' : ''}" data-r="${r.id}">${esc(r.nome)}</button>`).join('')}
      </div>
    </section>` : `<section class="card"><h2>Qual semana?</h2>
      <div class="grade" id="rotinas" style="margin-top:10px">
        <button class="btn sec ${E.semana === 'sorteio' ? 'on' : ''}" data-w="sorteio">Sortear uma semana</button>
        ${SEMANAS.map((r) => `<button class="btn sec ${E.semana === r.id ? 'on' : ''}" data-w="${r.id}">${esc(r.nome)}</button>`).join('')}
      </div>
    </section>`}
    <button class="btn ok block" id="vai">${E.escala === 'dia' ? 'Ver a rotina' : 'Ver a semana'}</button>
    <button class="link" id="modos">Trocar de modo</button>`;
  $('#modos').onclick = telaModos;
  $('#tempos').onclick = (e) => { const b = e.target.closest('[data-k]'); if (b) { E.tempo = +b.dataset.k; telaInicio(); } };
  $('#escala').onclick = (e) => { const b = e.target.closest('[data-e]'); if (b) { E.escala = b.dataset.e; telaInicio(); } };
  $('#rotinas').onclick = (e) => { const b = e.target.closest('[data-r],[data-w]'); if (!b) return; if (b.dataset.r) E.rotina = b.dataset.r; else E.semana = b.dataset.w; const y = scrollY; telaInicio(); scrollTo(0, y); };
  $('#vai').onclick = () => {
    const semente = (Date.now() % 100000) + 1;
    if (E.escala === 'semana') { const w = E.semana === 'sorteio' ? SEMANAS[semente % SEMANAS.length] : SEMANAS.find((x) => x.id === E.semana); jogarSemana({ tela, placar, voltar: telaInicio }, w, TEMPOS[E.tempo].perguntas, semente); return; }
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
        <div class="valor glic"><b>${fmt(p.ancora.glicemia, 0)}</b><span>${rotuloGlicemia(r, p.ancora.hora)}, mg/dL</span></div>
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
    ${relogio(q.hora)}
    <section class="card">${linhaDoTempo(p.rotina, q.hora)}</section>
    <section class="card pergunta">
      <div class="rotulo">Estimativa ${E.i + 1} de ${p.perguntas.length}</div>
      <h2>Às ${hhmm(q.hora)}, quanto está <span class="cor-${q.variavel}">${v.nome === 'Cortisol' ? 'o cortisol' : (momentoGlicemia(p.rotina, q.hora) === 'entre refeições' ? 'a glicemia' : `a glicemia ${momentoGlicemia(p.rotina, q.hora)}`)}</span>?</h2>
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
      <div class="rotulo">${x.variavel === 'glicemia' ? rotuloGlicemia(p.rotina, x.hora) : v.nome} às ${hhmm(x.hora)}</div>
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

function telaFim() {
  const p = E.partida, total = somaPontos(), maximo = p.perguntas.length * 100, naFaixa = E.respostas.filter((x) => x.pontos === 100).length;
  const notas = leitura(p.rotina, p.dia);
  if (p.rotina.jornadas.some((j) => j.tipo === 'prova')) notas.push('Em volta da prova o jogo não pediu o cortisol: avaliação diante de outras pessoas costuma elevá-lo, com pico de 20 a 40 minutos depois do início, mas o tamanho varia muito de pessoa para pessoa.');
  placar.hidden = true;
  tela.innerHTML = `
    <section class="card total"><div class="rotulo">Fim do dia</div><b>${total}</b><span class="muted">de ${maximo} pontos · ${naFaixa} de ${p.perguntas.length} dentro da faixa</span></section>
    ${(() => { const c = custoDoDia(p.rotina, p.dia); return cartaoCusto('O que este dia custa', c.numeros, c.frase); })()}
    ${['cortisol', 'glicemia'].map((k) => `<section class="card"><h3 class="cor-${k}">${k === 'glicemia' ? 'Glicemia de jejum e pós-prandial' : VARIAVEIS[k].nome} (${VARIAVEIS[k].unidade})</h3>${grafico(p.dia, k, { palpites: E.respostas.filter((x) => x.variavel === k) })}
      <div class="legenda"><span><i style="background:${CORV[k]}"></i>Esperado</span><span><i style="background:#fff;height:8px;width:8px;border-radius:50%"></i>Seus palpites</span></div></section>`).join('')}
    ${notas.length ? `<section class="card"><div class="rotulo">O que este dia mostra</div><ul class="porque">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}
    <p class="aviso">Modelo médio de adulto saudável. Não é o seu corpo e não serve de diagnóstico.</p>
    <button class="btn ok block" id="de-novo">Jogar outra rotina</button>
    <button class="link" id="modos">Trocar de modo</button>`;
  $('#de-novo').onclick = telaInicio; $('#modos').onclick = telaModos; scrollTo(0, 0);
}

telaModos();
