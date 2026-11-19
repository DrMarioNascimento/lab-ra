// Mosaico Alostase · sala de aula: as três telas (celular do aluno, telão e painel do professor) como funções do estado.
import { ROTINAS } from '../jogo/rotinas.js';
import { VARIAVEIS, hhmm, rotuloGlicemia } from '../jogo/prognostico.js';
import { relogio } from '../jogo/relogio.js';
import { linhaDoTempo, listaDaRotina } from '../jogo/ui.js';
import { OPCOES_N, partidaDe, perguntaAtual, totalPerguntas, resumoDaPergunta, acertosPorPergunta, mediaDePontos, pontosMaximos, histograma } from './engine.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (v, casas = 1) => Number(v).toFixed(casas).replace('.', ',');
export const rotinaDe = (st) => ROTINAS.find((r) => r.id === st.rotinaId) || ROTINAS[0];

export function tituloDaPergunta(st, q) {
  const rotina = rotinaDe(st), nome = q.variavel === 'glicemia' ? rotuloGlicemia(rotina, q.hora) : VARIAVEIS[q.variavel].nome;
  return { nome, texto: `${nome} às ${hhmm(q.hora)}`, def: VARIAVEIS[q.variavel] };
}
const valorTxt = (def, v) => `${num(v, def.casas)} ${def.unidade}`;

export const MANUAL = `<h2>Seu corpo tem hora marcada</h2>
  <p>O mesmo dia, em horas diferentes, encontra um corpo diferente. A cada pergunta o telão mostra a rotina e a hora; você arrasta o controle até o valor que espera de cortisol ou de glicemia e envia.</p>
  <p>Dentro da faixa do esperado valem 100 pontos; fora, os pontos vão caindo. Dá para trocar a resposta até o professor revelar.</p>
  <p class="muted">Será que a turma inteira concorda com o corpo?</p>`;

/* ------------------------------------------------------------------ celular do aluno */
/** Só redesenha o celular quando algo que o aluno enxerga muda (o controle deslizante não pode ser refeito no meio do arraste). */
export function chaveDoAluno(st, id, loc) {
  const eu = st.alunos[id]; if (!eu) return 'fora';
  return [st.fase, st.qi, st.rotinaId, st.resp[st.qi]?.[id] ?? '', st.ult[id] ?? '', st.pts[id], loc.manual ? 1 : 0, st.ordem.length].join('|');
}

export function renderAluno(st, id, loc) {
  const eu = st.alunos[id];
  if (!eu) return `<div class="al"><div class="card"><h2>Você saiu desta sala</h2><p class="muted">A sala foi reiniciada. Digite o código de novo para voltar.</p><button class="btn block" data-a="sair-sala">Voltar</button></div></div>`;
  const topo = `<div class="al-topo"><b>${esc(eu.nome)}</b><span class="placar mono">${st.pts[id] || 0} pts</span><button class="btn sec sm redondo" data-a="manual" aria-label="Como jogar">i</button></div>`;
  if (loc.manual) return `<div class="al">${topo}<div class="card manual">${MANUAL}<button class="btn ok block" data-a="entendi">Entendi</button></div></div>`;
  const rotina = rotinaDe(st);
  if (st.fase === 'entrada') return `<div class="al">${topo}<div class="card"><h2>Você está na sala</h2><p class="muted">${st.ordem.length} ${st.ordem.length === 1 ? 'pessoa' : 'pessoas'} na sala. Aguarde o professor começar.</p><p><b>${esc(rotina.nome)}</b></p></div></div>`;
  if (st.fase === 'fim') {
    const max = pontosMaximos(st);
    return `<div class="al">${topo}<div class="card"><h2>Fim da rodada</h2><p class="grande mono">${st.pts[id] || 0} <small>de ${max} pontos</small></p><p class="muted">Você ficou dentro da faixa em ${st.acertos[id] || 0} de ${totalPerguntas(st)} perguntas.</p></div></div>`;
  }
  const p = partidaDe(st), q = perguntaAtual(st), t = tituloDaPergunta(st, q), d = t.def, resp = st.resp[st.qi]?.[id];
  const cab = `${relogio(q.hora)}<p class="muted prog">Pergunta ${st.qi + 1} de ${totalPerguntas(st)}</p>`;
  if (st.fase === 'pergunta') {
    const ini = loc.valor?.[st.qi] ?? resp ?? p.ancora[q.variavel];
    return `<div class="al">${topo}${cab}<div class="card"><h2>${esc(t.texto)}</h2>
      <p class="muted">Ao acordar, às ${hhmm(p.ancora.hora)}: cortisol ${num(p.ancora.cortisol)} µg/dL e glicemia ${num(p.ancora.glicemia, 0)} mg/dL.</p>
      <div class="valor mono"><b id="vv">${num(ini, d.casas)}</b> ${d.unidade}</div>
      <input type="range" id="sl" min="${d.min}" max="${d.max}" step="${d.passo}" value="${ini}" aria-label="${esc(t.nome)} em ${d.unidade}">
      <button class="btn ${resp != null ? 'sec' : 'ok'} block" data-a="enviar">${resp != null ? `Enviado: ${num(resp, d.casas)} (mudar)` : 'Enviar resposta'}</button></div></div>`;
  }
  const meu = resp, ok = meu != null && meu >= q.faixa[0] && meu <= q.faixa[1];
  return `<div class="al">${topo}${cab}<div class="card"><h2>${esc(t.texto)}</h2>
    <p>Esperado: <b class="mono">${valorTxt(d, q.valor)}</b> <span class="muted">(faixa ${num(q.faixa[0], d.casas)} a ${num(q.faixa[1], d.casas)})</span></p>
    <p>${meu == null ? 'Você não respondeu.' : `Você: <b class="mono">${valorTxt(d, meu)}</b> · ${ok ? 'dentro da faixa' : 'fora da faixa'}`} · <b>+${st.ult[id] || 0}</b> pontos</p>
    <ul class="racio">${q.raciocinio.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div></div>`;
}

/* ------------------------------------------------------------------ telão */
function graficoDistribuicao(st, q, d) {
  const r = resumoDaPergunta(st);
  if (r.n < 5) return `<p class="tl-aviso">Poucas respostas (${r.n}) para mostrar a distribuição da turma.</p>`;
  const h = histograma(r.valores, q.faixa, q.valor), W = 1000, H = 300, x = (v) => ((v - h.lo) / (h.hi - h.lo)) * W, bw = W / h.cont.length;
  const barras = h.cont.map((c, i) => `<rect x="${i * bw + 3}" y="${H - (c / h.max) * (H - 50)}" width="${bw - 6}" height="${(c / h.max) * (H - 50)}" rx="6" class="tl-barra"/>${c ? `<text x="${i * bw + bw / 2}" y="${H - (c / h.max) * (H - 50) - 10}" class="tl-n" text-anchor="middle">${c}</text>` : ''}`).join('');
  const eixo = [h.lo, (h.lo + h.hi) / 2, h.hi].map((v, i) => `<text x="${i === 0 ? 4 : i === 2 ? W - 4 : W / 2}" y="${H + 34}" class="tl-eixo" text-anchor="${i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}">${num(v, d.casas)}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H + 44}" class="tl-dist" role="img" aria-label="Distribuição das respostas da turma"><rect x="${x(q.faixa[0])}" y="0" width="${Math.max(4, x(q.faixa[1]) - x(q.faixa[0]))}" height="${H}" class="tl-faixa"/>${barras}
    <line x1="${x(q.valor)}" x2="${x(q.valor)}" y1="0" y2="${H}" class="tl-esperado"/><line x1="0" x2="${W}" y1="${H}" y2="${H}" class="tl-base"/>${eixo}</svg>
    <p class="tl-leg"><span class="chip faixa"></span> faixa do esperado <span class="chip esp"></span> valor esperado · ${r.dentro} de ${r.n} dentro da faixa · mediana da turma ${valorTxt(d, r.mediana)}</p>`;
}

export function renderTelao(st) {
  const rotina = rotinaDe(st), cab = `<div class="tl-topo"><b>Mosaico Alostase</b><span>${esc(rotina.nome)}</span><span class="mono">sala ${esc(st.codigo || '')}</span></div>`;
  if (st.fase === 'entrada') return `${cab}<div class="tl-centro"><h1>Entre pelo celular</h1><p class="tl-cod mono">${esc(st.codigo || '')}</p><p class="tl-sub">${st.ordem.length} ${st.ordem.length === 1 ? 'pessoa' : 'pessoas'} na sala</p><p class="tl-sub">${esc(rotina.nome)} · ${st.n} perguntas</p></div>`;
  if (st.fase === 'fim') {
    const lin = acertosPorPergunta(st).map((r) => { const q = partidaDe(st).perguntas[r.qi], t = tituloDaPergunta(st, q); return `<li><span>${esc(t.texto)}</span><span class="mono">${r.dentro} de ${r.n}</span></li>`; }).join('');
    return `${cab}<div class="tl-centro"><h1>Fim da rodada</h1><p class="tl-sub">Média da turma: <b class="mono">${num(mediaDePontos(st), 0)}</b> de ${pontosMaximos(st)} pontos</p><div class="tl-lista"><h3>Quem ficou dentro da faixa, por pergunta</h3><ul>${lin}</ul></div></div>`;
  }
  const p = partidaDe(st), q = perguntaAtual(st), t = tituloDaPergunta(st, q), d = t.def, r = resumoDaPergunta(st);
  const base = `${cab}<div class="tl-grade"><div class="tl-esq">${relogio(q.hora)}<div class="tl-linha">${linhaDoTempo(rotina, q.hora)}</div>${listaDaRotina(rotina)}</div>`;
  if (st.fase === 'pergunta') return `${base}<div class="tl-dir"><p class="tl-prog">Pergunta ${st.qi + 1} de ${totalPerguntas(st)}</p><h1>${esc(t.texto)}</h1>
    <p class="tl-sub">Ao acordar (${hhmm(p.ancora.hora)}): cortisol ${num(p.ancora.cortisol)} µg/dL · glicemia ${num(p.ancora.glicemia, 0)} mg/dL</p>
    <p class="tl-cont"><b class="mono">${r.n}</b> de ${r.total} responderam</p></div></div>`;
  return `${base}<div class="tl-dir"><p class="tl-prog">Pergunta ${st.qi + 1} de ${totalPerguntas(st)}</p><h1>${esc(t.texto)}</h1>
    <p class="tl-sub">Esperado: <b class="mono">${valorTxt(d, q.valor)}</b> · faixa ${num(q.faixa[0], d.casas)} a ${num(q.faixa[1], d.casas)}</p>${graficoDistribuicao(st, q, d)}
    <ul class="tl-racio">${q.raciocinio.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
}

/* ------------------------------------------------------------------ painel do professor */
export function renderProfessor(st) {
  const r = resumoDaPergunta(st);
  if (st.fase === 'entrada') return `<h3>Montar a rodada</h3>
    <label class="campo">Rotina<select data-a="rotina">${ROTINAS.map((x) => `<option value="${x.id}" ${x.id === st.rotinaId ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select></label>
    <div class="campo">Perguntas<div class="row">${OPCOES_N.map((n) => `<button class="btn sm ${n === st.n ? 'on sec' : 'sec'}" data-a="n" data-v="${n}">${n}</button>`).join('')}<button class="btn sm sec" data-a="sorteio">Outro sorteio</button></div></div>
    <p class="muted">${st.ordem.length} ${st.ordem.length === 1 ? 'pessoa' : 'pessoas'} na sala.</p><button class="btn ok block" data-a="comecar">Começar</button>`;
  if (st.fase === 'pergunta') { const q = perguntaAtual(st), t = tituloDaPergunta(st, q); return `<h3>Pergunta ${st.qi + 1} de ${totalPerguntas(st)}</h3><p><b>${esc(t.texto)}</b></p><p class="muted"><b class="mono">${r.n}</b> de ${r.total} responderam.</p><button class="btn ok block" data-a="revelar">Revelar</button>`; }
  if (st.fase === 'revelacao') { const ultima = st.qi + 1 >= totalPerguntas(st); return `<h3>Revelado</h3><p class="muted">${r.dentro} de ${r.n} dentro da faixa.</p><button class="btn ok block" data-a="proxima">${ultima ? 'Ver o fim da rodada' : 'Próxima pergunta'}</button>`; }
  return `<h3>Fim da rodada</h3><p class="muted">Média da turma: ${num(mediaDePontos(st), 0)} de ${pontosMaximos(st)} pontos.</p><button class="btn block" data-a="reiniciar">Jogar de novo com a mesma turma</button>`;
}

/** Ação do painel do professor em eventos do motor da sala. */
export function acaoProfessor(a, el, dispatch, st) {
  if (a === 'comecar' || a === 'revelar' || a === 'proxima' || a === 'reiniciar') dispatch({ t: a });
  else if (a === 'rotina') dispatch({ t: 'config', rotinaId: el.value });
  else if (a === 'n') dispatch({ t: 'config', n: Number(el.dataset.v) });
  else if (a === 'sorteio') dispatch({ t: 'config', semente: (st.semente * 7 + 13) % 9973 });
}
