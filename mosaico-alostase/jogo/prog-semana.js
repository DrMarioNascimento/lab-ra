// Mosaico Alostase · modo Prognóstico, semana 1: estimativas de hora em dias diferentes e a dívida de sono ao fim do dia.
import { relogio } from './relogio.js';
import { novaPartidaSemana, pontuar, VARIAVEIS, DIVIDA, NOMES_DIAS, hhmm, momentoGlicemia, rotuloGlicemia } from './prognostico.js';
import { $, fmt, esc, linhaDoTempo, listaDaRotina, cartaoCusto, NOTA_SONO } from './ui.js';
import { graficoSemana } from './diagnostico.js';
import { P } from '../motor/parametros.js';

const CURTO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const def = (q) => (q.tipo === 'divida' ? DIVIDA : VARIAVEIS[q.variavel]);
const Dia = (d) => NOMES_DIAS[d][0].toUpperCase() + NOMES_DIAS[d].slice(1);

export function jogarSemana(ctx, semana, nPerguntas, semente) {
  const { tela, placar, voltar } = ctx;
  const p = novaPartidaSemana(semana, nPerguntas, semente), R = [];
  let i = 0;
  const soma = () => R.reduce((t, x) => t + x.pontos, 0);
  const mostraPlacar = () => { placar.hidden = false; placar.textContent = `${Math.min(i + 1, p.perguntas.length)}/${p.perguntas.length} · ${soma()} pts`; };
  const faixaDias = (atual) => `<div class="dias so-leitura">${CURTO.map((n, d) => `<span class="dia ${d === atual ? 'on' : ''}"><b>${n}</b><small>${fmt(p.sem.resumo[d].horasSono, 1)} h</small></span>`).join('')}</div><p class="muted nota" style="margin:6px 0 0">Embaixo de cada dia, o sono da noite anterior.</p>`;

  function abertura() {
    placar.hidden = true;
    tela.innerHTML = `
      <section class="card"><div class="rotulo">Semana de hoje</div><h2>${esc(semana.nome)}</h2><p class="muted">${esc(semana.resumo)}</p>${faixaDias(-1)}</section>
      <section class="card"><div class="rotulo">Segunda-feira · ${esc(semana.dias[0].nome)}</div>${linhaDoTempo(semana.dias[0])}${listaDaRotina(semana.dias[0])}</section>
      <section class="card"><div class="rotulo">Ponto de partida, segunda às ${hhmm(p.ancora.hora)}</div>
        <div class="ancoras"><div class="valor cort"><b>${fmt(p.ancora.cortisol, 1)}</b><span>Cortisol, µg/dL</span></div><div class="valor glic"><b>${fmt(p.ancora.glicemia, 0)}</b><span>${rotuloGlicemia(semana.dias[0], p.ancora.hora)}, mg/dL</span></div></div>
        <p class="nota"><b>Dívida de sono: 0 h.</b> O corpo aguenta cerca de ${fmt(P.dividaSono.vigiliaCriticaH.valor, 2)} horas acordado por dia. O que passa disso vira dívida e soma de um dia para o outro.</p>
        <p class="muted nota">Serão ${p.perguntas.length} estimativas ao longo da semana.</p></section>
      <button class="btn ok block" id="vai">Começar</button><button class="link" id="volta">Trocar de semana</button>`;
    $('#vai').onclick = pergunta; $('#volta').onclick = voltar; scrollTo(0, 0);
  }

  function pergunta() {
    const q = p.perguntas[i], v = def(q), rot = semana.dias[q.dia];
    const ant = R.filter((x) => x.variavel === q.variavel).slice(-1)[0];
    const ref = ant ? { valor: ant.valor, quando: ant.tipo === 'divida' ? `ao fim de ${NOMES_DIAS[ant.dia]}` : `${NOMES_DIAS[ant.dia]}, ${hhmm(ant.hora)}` } : { valor: p.ancora[q.variavel], quando: q.tipo === 'divida' ? 'no começo da semana' : `segunda, ${hhmm(p.ancora.hora)}` };
    const titulo = q.tipo === 'divida' ? `Ao fim de ${NOMES_DIAS[q.dia]}, quanta <span class="cor-divida">dívida de sono</span> acumulada?` : `${Dia(q.dia)}, às ${hhmm(q.hora)}: quanto está <span class="cor-${q.variavel}">${q.variavel === 'cortisol' ? 'o cortisol' : (momentoGlicemia(rot, q.hora) === 'entre refeições' ? 'a glicemia' : `a glicemia ${momentoGlicemia(rot, q.hora)}`)}</span>?`;
    const r = p.sem.resumo[q.dia];
    mostraPlacar();
    tela.innerHTML = `
      ${q.tipo === 'hora' ? relogio(q.hora) : ''}
      <section class="card">${faixaDias(q.dia)}<div style="margin-top:10px">${linhaDoTempo(rot, q.tipo === 'hora' ? q.hora : null)}</div>
        ${q.tipo === 'divida' ? `<p class="nota">${Dia(q.dia)}: <b class="mono">${fmt(r.horasAcordado, 1)} h</b> acordado.</p>` : ''}</section>
      <section class="card pergunta"><div class="rotulo">Estimativa ${i + 1} de ${p.perguntas.length}</div><h2>${titulo}</h2>
        <p class="muted nota">Último valor conhecido: <b class="mono">${fmt(ref.valor, v.casas)} ${v.unidade}</b>, ${ref.quando}.</p>
        <div class="numero"><b id="num" class="cor-${q.variavel}">${fmt(ref.valor, v.casas)}</b><span>${v.unidade}</span></div>
        <input type="range" id="sl" min="${v.min}" max="${v.max}" step="${v.passo}" value="${ref.valor}" aria-label="${v.nome} em ${v.unidade}">
        <div class="limites"><span>${v.min}</span><span>${v.max}</span></div>
        <div class="ajuste"><button class="btn sec sm" id="menos">− ${fmt(v.passo, v.casas)}</button><button class="btn sec sm" id="mais">+ ${fmt(v.passo, v.casas)}</button></div>
        <button class="btn ok block" id="ok">Confirmar</button></section>
      <details class="card"><summary class="rotulo" style="cursor:pointer;margin:0">Rever o dia</summary>${listaDaRotina(rot)}</details>`;
    const sl = $('#sl'), num = $('#num'), mostra = () => { num.textContent = fmt(+sl.value, v.casas); };
    sl.oninput = mostra;
    $('#menos').onclick = () => { sl.value = +sl.value - v.passo; mostra(); };
    $('#mais').onclick = () => { sl.value = +sl.value + v.passo; mostra(); };
    $('#ok').onclick = () => { const palpite = +sl.value; R.push({ ...q, palpite, pontos: pontuar(palpite, q.faixa) }); revelacao(); };
    scrollTo(0, 0);
  }

  function revelacao() {
    const x = R[i], v = def(x), pos = (val) => Math.max(0, Math.min(100, ((val - v.min) / (v.max - v.min)) * 100));
    const cls = x.pontos === 100 ? 'cheio' : x.pontos > 0 ? 'meio' : 'zero';
    const frase = x.pontos === 100 ? 'Dentro da faixa.' : x.pontos > 0 ? (x.palpite < x.valor ? 'Um pouco abaixo da faixa.' : 'Um pouco acima da faixa.') : (x.palpite < x.valor ? 'Bem abaixo do esperado.' : 'Bem acima do esperado.');
    const ultima = i === p.perguntas.length - 1;
    mostraPlacar();
    tela.innerHTML = `
      <section class="card"><div class="rotulo">${x.variavel === 'glicemia' ? rotuloGlicemia(semana.dias[x.dia], x.hora) : v.nome} · ${x.tipo === 'divida' ? `fim de ${NOMES_DIAS[x.dia]}` : `${NOMES_DIAS[x.dia]}, ${hhmm(x.hora)}`}</div>
        <div class="resultado"><h2>${frase}</h2><span class="pontos ${cls}">+${x.pontos}</span></div>
        <div class="regua" role="img" aria-label="Esperado ${fmt(x.valor, v.casas)}, faixa de ${fmt(x.faixa[0], v.casas)} a ${fmt(x.faixa[1], v.casas)}, seu palpite ${fmt(x.palpite, v.casas)} ${v.unidade}">
          <span class="trilho"></span><span class="faixa" style="left:${pos(x.faixa[0])}%;width:${Math.max(1, pos(x.faixa[1]) - pos(x.faixa[0]))}%"></span>
          <span class="m esp" style="left:${pos(x.valor)}%"><i>esperado ${fmt(x.valor, v.casas)}</i></span><span class="m pal" style="left:${pos(x.palpite)}%"><i>você ${fmt(x.palpite, v.casas)}</i></span></div>
        <p class="muted nota">Faixa aceita: <b class="mono">${fmt(x.faixa[0], v.casas)} a ${fmt(x.faixa[1], v.casas)} ${v.unidade}</b>${x.tipo === 'divida' ? ', porque o limite de vigília varia de pessoa para pessoa.' : ', a variação entre pessoas saudáveis.'}</p>
        <div class="rotulo" style="margin-top:12px">Por quê</div><ul class="porque">${x.raciocinio.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <button class="btn ok block" id="prox">${ultima ? 'Ver a semana inteira' : 'Próxima'}</button></section>`;
    $('#prox').onclick = () => { i++; ultima ? fim() : pergunta(); };
    scrollTo(0, 0);
  }

  function fim() {
    const sem = p.sem, total = soma(), naFaixa = R.filter((x) => x.pontos === 100).length, u = sem.resumo[6], notas = [];
    const pal = R.filter((x) => x.tipo === 'divida'), maxD = Math.max(8, ...sem.resumo.map((r) => r.dividaAcumulada), ...pal.map((x) => x.palpite)) * 1.1;
    const noite = P.dividaSono.umaNoiteSemDormirH.valor;
    notas.push(sem.dividaFinal < 0.5 ? 'A semana fecha sem dívida de sono.' : `A semana fecha com ${fmt(sem.dividaFinal, 1)} horas de vigília em excesso: ${fmt(sem.noitesSemDormirEquivalentes * 100, 0)}% do que custa uma noite inteira sem dormir (cerca de ${fmt(noite, 0)} horas).`);
    const pico = Math.max(...sem.resumo.map((r) => r.dividaAcumulada));
    if (pico - sem.dividaFinal > 0.5) notas.push(`No pior dia a dívida chegou a ${fmt(pico, 1)} horas. O descanso abateu parte dela, e na vida real a recuperação costuma ser mais lenta que esta conta.`);
    if (sem.dividaFinal >= 0.5) notas.push('Quem dorme pouco por vários dias sente o sono estabilizar, mas a atenção continua piorando: a sensação engana.');
    if (u.remAcumuladoMin) notas.push(`O álcool tirou cerca de ${fmt(u.remAcumuladoMin, 0)} minutos de sono REM na semana.`);
    const ativos = sem.resumo.filter((r) => r.sonoNaFaseAtiva).length;
    if (ativos) notas.push(`Em ${ativos} de 7 dias o sono começou com o cortisol acima da média do dia: o relógio do corpo não acompanhou a rotina.`);
    placar.hidden = true;
    tela.innerHTML = `
      <section class="card total"><div class="rotulo">Fim da semana</div><b>${total}</b><span class="muted">de ${p.perguntas.length * 100} pontos · ${naFaixa} de ${p.perguntas.length} dentro da faixa</span></section>
      ${cartaoCusto('O que esta semana custa', [{ valor: `${fmt(Math.max(...sem.resumo.map((r) => r.horasAcordado)), 1)} h`, rotulo: 'acordado no dia mais longo' }, { valor: `${fmt(Math.min(...sem.resumo.map((r) => r.horasSono)), 1)} h`, rotulo: 'na noite mais curta' }, { valor: `${fmt(pico, 1)} h`, rotulo: 'de dívida no pior dia', deve: pico >= 0.5 }], notas[0])}
      <section class="card"><h3 class="cor-divida">Dívida de sono acumulada (horas)</h3>${graficoSemana(sem, 'divida', '#fb7185', maxD, 'Dívida de sono por dia e seus palpites', pal)}
        <div class="legenda"><span><i style="background:#fb7185"></i>Esperado</span><span><i style="background:#fff;height:8px;width:8px;border-radius:50%"></i>Seus palpites</span></div></section>
      <section class="card"><h3 style="color:#c4b5fd">Necessidade de sono (de 0 a 1)</h3>${graficoSemana(sem, 'pressaoSono', '#c4b5fd', 1, 'Necessidade de sono ao longo da semana')}${NOTA_SONO}</section>
      <section class="card"><div class="rotulo">O que esta semana mostra</div><ul class="porque">${notas.slice(1).map((n) => `<li>${esc(n)}</li>`).join('') || '<li>Semana sem acúmulo: é a referência para comparar com as outras.</li>'}</ul></section>
      <p class="aviso">Modelo médio de adulto saudável. Não é o seu corpo e não serve de diagnóstico.</p>
      <button class="btn ok block" id="de-novo">Jogar outra semana</button>`;
    $('#de-novo').onclick = voltar; scrollTo(0, 0);
  }
  abertura();
}
