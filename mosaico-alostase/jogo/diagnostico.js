// Mosaico Alostase · tela do modo Diagnóstico: o aluno monta a rotina, o jogo mostra o esperado.
import { simularDia } from '../motor/motor.js';
import { explicar, hhmm, rotuloGlicemia } from './prognostico.js';
import { escolhasPadrao, conferir, montarRotina, leitura, passo, NIVEIS, DURACOES, ALCOOL } from './rotina-montada.js';
import { simularSemana, conferirSemana, diaDaSemana } from '../motor/semana.js';
import { P } from '../motor/parametros.js';
import { PERFIS, iniciar, metas, pisoDosCompromissos } from './perfis.js';
import { $, fmt, esc, linhaDoTempo, grafico, VARS, CORV } from './ui.js';

const livrePadrao = () => { const e = escolhasPadrao(); e.dormir = 0.5; e.acordar = 9; e.cafe.hora = 9.5; e.almoco.hora = 13.5; e.jantar.hora = 20; e.trabalho.on = false; return e; };
const TIPOS = { A: { nome: 'Dia útil', e: escolhasPadrao() }, B: { nome: 'Dia livre', e: livrePadrao() } };
const SEMANA = ['A', 'A', 'A', 'A', 'A', 'B', 'B'];
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
let alvo = 'A', E = TIPOS.A.e, perfil = null;

/** Entrada do modo: rotina livre ou desafio com perfil. */
export function telaEntradaDiag(tela, voltar) {
  tela.onclick = null;
  tela.innerHTML = `
    <section class="card modo"><div class="rotulo">Rotina livre</div><h2>Monte o dia do seu jeito</h2><p class="muted">Sem compromissos fixos e sem meta. Bom para explorar.</p><button class="btn block" id="livre">Montar uma rotina</button></section>
    <section class="card modo"><div class="rotulo">Desafio da semana</div><h2>Cumpra a meta devendo o mínimo de sono</h2><p class="muted">Escolha um perfil. O dia já vem com compromissos; você decide o resto.</p>
      <div class="grade" style="margin-top:10px">${PERFIS.map((p) => { const c = pisoDosCompromissos(p), h = Math.max(c.horasDePeUtil, c.horasDePeLivre); return `<button class="btn sec perfil" data-p="${p.id}"><b>${esc(p.nome)}</b><small>Compromissos: até ${fmt(h, 1)} h de pé por dia</small></button>`; }).join('')}</div></section>
    <button class="link" id="sai">Trocar de modo</button>`;
  $('#livre').onclick = () => { perfil = null; TIPOS.A.e = escolhasPadrao(); TIPOS.B.e = livrePadrao(); telaMontar(tela, voltar, 'A'); };
  $('#sai').onclick = voltar;
  tela.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => { perfil = PERFIS.find((x) => x.id === b.dataset.p); const t = iniciar(perfil); TIPOS.A.e = t.A; TIPOS.B.e = t.B; telaSemana(tela, voltar); }; });
  scrollTo(0, 0);
}
const pega = (caminho) => caminho.split('.').reduce((o, k) => o[k], E);
const poe = (caminho, v) => { const ks = caminho.split('.'); const u = ks.pop(); ks.reduce((o, k) => o[k], E)[u] = v; };

const hora = (rot, caminho) => `<div class="lin"><span>${rot}</span><span class="passo"><button class="btn sec sm" data-h="${caminho}" data-d="-1" aria-label="${rot}: 30 minutos antes">−</button><b class="mono">${hhmm(pega(caminho))}</b><button class="btn sec sm" data-h="${caminho}" data-d="1" aria-label="${rot}: 30 minutos depois">+</button></span></div>`;
const liga = (rot, caminho) => `<button class="btn sec sm chave ${pega(caminho) ? 'on' : ''}" data-l="${caminho}" aria-pressed="${pega(caminho)}">${rot}</button>`;
const seg = (caminho, lista, rotulo) => `<div class="seg" role="group" aria-label="${rotulo}">${lista.map((o) => `<button class="btn sec sm ${String(pega(caminho)) === String(o.id) ? 'on' : ''}" data-s="${caminho}" data-v="${o.id}" aria-pressed="${String(pega(caminho)) === String(o.id)}">${o.nome}</button>`).join('')}</div>`;
const refeicao = (rot, k) => `<div class="lin"><span>${liga(rot, `${k}.on`)}</span>${E[k].on ? `<span class="passo"><button class="btn sec sm" data-h="${k}.hora" data-d="-1" aria-label="${rot}: antes">−</button><b class="mono">${hhmm(E[k].hora)}</b><button class="btn sec sm" data-h="${k}.hora" data-d="1" aria-label="${rot}: depois">+</button></span>` : '<span class="muted">fora</span>'}</div>`;

export function telaMontar(tela, voltar, qual = 'A', depois = null) {
  alvo = qual; E = TIPOS[alvo].e;
  const desenha = () => {
    const erros = conferir(E), horasSono = ((E.acordar - E.dormir) % 24 + 24) % 24 || 24;
    const previa = erros.length ? null : montarRotina(E);
    tela.innerHTML = `
      <section class="card"><div class="rotulo">Montando: ${TIPOS[alvo].nome.toLowerCase()}</div>${previa ? linhaDoTempo(previa) : '<p class="aviso">Acerte os horários para ver a linha do tempo.</p>'}</section>
      <section class="card"><div class="rotulo">Sono · ${fmt(horasSono, horasSono % 1 ? 1 : 0)} h</div>${hora('Dormir', 'dormir')}${hora('Acordar', 'acordar')}</section>
      <section class="card"><div class="rotulo">Refeições · 50 g de carboidrato cada</div>${refeicao('Café', 'cafe')}${refeicao('Almoço', 'almoco')}${refeicao('Jantar', 'jantar')}${refeicao('Lanche', 'lanche')}</section>
      ${(E.fixos || []).length ? `<section class="card"><div class="rotulo">Compromissos fixos deste dia</div><ul class="fixos">${E.fixos.map((f) => `<li><span class="h">${hhmm(f.inicio)} a ${hhmm(f.fim)}</span><span>${esc(f.nome)}</span></li>`).join('')}</ul></section>` : ''}
      <section class="card"><div class="rotulo">${perfil ? 'Estudo · conta para a meta' : 'Trabalho ou estudo'}</div><div class="lin"><span>${liga(perfil ? 'Tem estudo' : 'Tem jornada', 'trabalho.on')}</span><span class="muted">${E.trabalho.on ? '' : (perfil ? 'sem estudo' : 'dia livre')}</span></div>${E.trabalho.on ? hora('Começa', 'trabalho.inicio') + hora('Termina', 'trabalho.fim') : ''}</section>
      <section class="card"><div class="rotulo">Exercício</div>${seg('exercicio.nivel', NIVEIS, 'Intensidade do exercício')}
        ${E.exercicio.nivel !== 'nenhum' ? hora('Começa', 'exercicio.hora') + `<div class="lin"><span>Duração</span>${seg('exercicio.dur', DURACOES.map((d) => ({ id: d, nome: `${d} min` })), 'Duração do exercício')}</div>` : ''}</section>
      <section class="card"><div class="rotulo">Álcool antes de dormir</div>${seg('alcool', ALCOOL, 'Álcool antes de dormir')}</section>
      ${erros.length ? `<div class="aviso">${erros.map(esc).join('<br>')}</div>` : ''}
      <button class="btn ok block" id="ver" ${erros.length ? 'disabled' : ''}>${depois ? 'Voltar à semana' : 'Ver o dia'}</button>
      <button class="link" id="zera">Voltar à rotina padrão</button>
      <button class="link" id="sai">Trocar de modo</button>`;
    $('#ver').onclick = () => (depois ? depois() : telaDia(tela, voltar));
    $('#zera').onclick = () => { TIPOS[alvo].e = E = perfil ? iniciar(perfil)[alvo] : (alvo === 'A' ? escolhasPadrao() : livrePadrao()); desenha(); };
    $('#sai').onclick = () => telaEntradaDiag(tela, voltar);
  };
  tela.onclick = (ev) => {
    const b = ev.target.closest('[data-h],[data-l],[data-s]'); if (!b || !tela.querySelector('#ver')) return;
    const y = scrollY;
    if (b.dataset.h) poe(b.dataset.h, passo(pega(b.dataset.h), +b.dataset.d));
    else if (b.dataset.l) poe(b.dataset.l, !pega(b.dataset.l));
    else poe(b.dataset.s, typeof pega(b.dataset.s) === 'number' ? +b.dataset.v : b.dataset.v);
    desenha(); scrollTo(0, y);
  };
  desenha(); scrollTo(0, 0);
}

function telaDia(tela, voltar, opc = null) {
  const rotina = opc ? opc.rotina : montarRotina(E), dia = opc ? opc.dia : simularDia(rotina), notas = opc ? opc.notas : leitura(rotina, dia);
  let h = rotina.sono[0].fim;
  tela.innerHTML = `
    <p class="aviso">Aqui, diagnóstico é a leitura que o modelo faz da rotina. Não é diagnóstico clínico nem o seu corpo.</p>
    ${opc ? `<h2>${esc(opc.titulo)}</h2>` : ''}
    <section class="card fixo"><div id="lt"></div>
      <input type="range" id="hr" min="0" max="23.5" step="0.5" value="${h}" aria-label="Hora do dia">
      <div class="leitura" id="vals"></div></section>
    <section class="card"><div class="rotulo">Por quê, nesta hora</div><ul class="porque" id="pq"></ul></section>
    ${['cortisol', 'glicemia', 'pressaoSono'].map((k) => `<section class="card"><h3 style="color:${CORV[k]}">${k === 'glicemia' ? 'Glicemia de jejum e pós-prandial' : VARS[k].nome} (${VARS[k].unidade})</h3><div id="g-${k}"></div></section>`).join('')}
    <section class="card"><div class="rotulo">O que esta rotina mostra</div><ul class="porque">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>
    ${opc ? '<button class="btn ok block" id="semana">Voltar à semana</button>' : '<button class="btn ok block" id="semana">Ver a semana inteira</button><button class="btn sec block" id="ajusta">Ajustar a rotina</button>'}
    <button class="link" id="sai">Trocar de modo</button>`;
  const pinta = () => {
    const p = dia.pontos.find((x) => Math.abs(x.hora - h) < 1e-6);
    $('#lt').innerHTML = linhaDoTempo(rotina, h);
    $('#vals').innerHTML = `<div class="hora-atual"><b class="mono">${hhmm(h)}</b><span>${p.dormindo ? 'dormindo' : 'acordado'}</span></div>
      <div class="valor cort"><b>${fmt(p.cortisol, 1)}</b><span>Cortisol, µg/dL</span></div>
      <div class="valor glic"><b>${fmt(p.glicemia, 0)}</b><span>${rotuloGlicemia(rotina, h)}, mg/dL</span></div>
      <div class="valor sono"><b>${fmt(p.pressaoSono, 2)}</b><span>Pressão de sono</span></div>`;
    $('#pq').innerHTML = [...explicar(rotina, h, 'cortisol'), ...explicar(rotina, h, 'glicemia')].map((f) => `<li>${esc(f)}</li>`).join('');
    for (const k of ['cortisol', 'glicemia', 'pressaoSono']) $(`#g-${k}`).innerHTML = grafico(dia, k, { hora: h });
  };
  tela.onclick = null;
  $('#hr').oninput = (ev) => { h = +ev.target.value; pinta(); };
  if ($('#ajusta')) $('#ajusta').onclick = () => telaMontar(tela, voltar, 'A');
  $('#semana').onclick = () => telaSemana(tela, voltar);
  $('#sai').onclick = voltar;
  pinta(); scrollTo(0, 0);
}

export function graficoSemana(sem, chave, cor, max, rot, palpites = []) {
  const W = 340, H = 130, L = 34, R = 8, T = 8, B = 22, X = (t) => L + (t / 168) * (W - L - R), Y = (v) => T + (1 - v / max) * (H - T - B);
  const linha = chave === 'divida'
    ? sem.resumo.map((r, d) => { const y = Y(r.dividaAcumulada), w = (W - L - R) / 7; return `<rect x="${(X(d * 24) + 3).toFixed(1)}" y="${y.toFixed(1)}" width="${(w - 6).toFixed(1)}" height="${(H - B - y).toFixed(1)}" rx="3" fill="${cor}"/>`; }).join('')
    : `<path d="${sem.pontos.filter((_, i) => i % 3 === 0).map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)},${Y(p[chave]).toFixed(1)}`).join('')}" fill="none" stroke="${cor}" stroke-width="2" stroke-linejoin="round"/>`;
  const dias = DIAS.map((n, d) => `<text x="${X(d * 24 + 12)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${n}</text>${d ? `<line x1="${X(d * 24)}" x2="${X(d * 24)}" y1="${T}" y2="${H - B}" stroke="#23415f"/>` : ''}`).join('');
  const ticks = [0, max / 2, max].map((v) => `<text x="${L - 5}" y="${Y(v) + 4}" text-anchor="end" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${fmt(v, max <= 1 ? 1 : 0)}</text><line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#23415f"/>`).join('');
  const bolas = palpites.map((x) => `<circle cx="${X(x.dia * 24 + 12)}" cy="${Y(Math.min(max, x.palpite))}" r="5" fill="#fff" stroke="#07111f" stroke-width="2"/>`).join('');
  return `<svg class="graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="${rot}">${ticks}${dias}${linha}${bolas}</svg>`;
}

function telaSemana(tela, voltar) {
  tela.onclick = null;
  const desenha = () => {
    const errosTipo = { A: conferir(TIPOS.A.e), B: conferir(TIPOS.B.e) };
    const rotinas = SEMANA.map((k) => ({ ...montarRotina(TIPOS[k].e), nome: TIPOS[k].nome }));
    const erros = [...(errosTipo.A.length ? ['O dia útil tem horários a acertar.'] : []), ...(errosTipo.B.length ? ['O dia livre tem horários a acertar.'] : [])];
    if (!erros.length) erros.push(...conferirSemana(rotinas));
    const sem = erros.length ? null : simularSemana(rotinas);
    const noite = P.dividaSono.umaNoiteSemDormirH.valor;
    let corpo = `<div class="aviso">${erros.map(esc).join('<br>')}</div>`;
    if (sem) {
      const maxD = Math.max(8, sem.dividaFinal, ...sem.resumo.map((r) => r.dividaAcumulada)) * 1.1, u = sem.resumo[6], notas = [];
      notas.push(sem.dividaFinal < 0.5 ? 'A semana fecha sem dívida de sono: os dias acordados não passam de 15,84 horas, o limite acima do qual a vigília acumula.' : `A semana fecha com ${fmt(sem.dividaFinal, 1)} horas de vigília em excesso. Uma noite inteira sem dormir equivale a cerca de ${fmt(noite, 0)} horas: você chegou a ${fmt(sem.noitesSemDormirEquivalentes * 100, 0)}% disso.`);
      if (sem.dividaFinal >= 0.5) notas.push('Em laboratório, quem dorme pouco por vários dias sente o sono estabilizar, mas a atenção continua piorando: a sensação engana.');
      if (u.remAcumuladoMin) notas.push(`O álcool tirou cerca de ${fmt(u.remAcumuladoMin, 0)} minutos de sono REM na semana.`);
      const ativos = sem.resumo.filter((r) => r.sonoNaFaseAtiva).length;
      if (ativos) notas.push(`Em ${ativos} de 7 dias o sono começa com o cortisol acima da média do dia. Em estudos de campo, duas noites seguidas de trabalho noturno não bastam para o relógio se ajustar.`);
      notas.push('As curvas de cortisol e glicemia de cada dia ainda não mudam com a dívida: sabe-se a direção (pior tolerância à glicose, cortisol mais alto à noite), mas falta número para o modelo.');
      const uteis = sem.resumo.filter((_, d) => SEMANA[d] === 'A'), maisLongo = Math.max(...sem.resumo.map((r) => r.horasAcordado)), sexta = sem.resumo[4].dividaAcumulada;
      const semEstudo = perfil && SEMANA.every((k) => !TIPOS[k].e.trabalho.on), piso = perfil ? pisoDosCompromissos(perfil, SEMANA) : null;
      const mediaSono = uteis.length ? uteis.reduce((t, r) => t + r.horasSono, 0) / uteis.length : sem.resumo.reduce((t, r) => t + r.horasSono, 0) / 7;
      let frase = sexta < 0.5 && sem.dividaFinal < 0.5 ? 'Esta semana cabe no corpo: nenhum dia passa do limite de 15,84 horas acordado.'
        : `Com até ${fmt(maisLongo, 1)} horas acordado por dia, a sexta chega com ${fmt(sexta, 1)} horas de dívida de sono${semEstudo ? ', antes de estudar um minuto' : ''}.`;
      if (piso && piso.pisoNaSexta >= 0.5) frase += ` Só os compromissos já deixam ${fmt(piso.horasDePeUtil, 1)} horas de pé por dia útil: mesmo dormindo no minuto em que o último acaba, ${fmt(piso.pisoNaSexta, 1)} horas dessa dívida são inevitáveis.`;
      else if (piso && sexta >= 0.5) frase += ' Os compromissos sozinhos caberiam no dia: esta dívida vem das escolhas de horário.';
      const destaque = `<section class="card destaque"><div class="rotulo">O que esta semana custa</div>
        <div class="tres"><div class="valor"><b>${fmt(maisLongo, 1)} h</b><span>acordado no dia mais longo</span></div><div class="valor"><b>${fmt(mediaSono, 1)} h</b><span>de sono por noite útil</span></div><div class="valor ${sexta >= 0.5 ? 'deve' : ''}"><b>${fmt(sexta, 1)} h</b><span>de dívida na sexta</span></div></div>
        <p class="frase">${esc(frase)}</p></section>`;
      corpo = `${destaque}
        <section class="card"><div class="rotulo">Dia a dia · toque para ver hora a hora</div>
          <div class="tabela"><div class="cab"><span>Dia</span><span>Sono</span><span>Acordado</span><span>Dívida</span></div>
          ${sem.resumo.map((r, d) => `<button class="lin-dia" data-dia="${d}"><span><b>${DIAS[d]}</b></span><span class="mono">${fmt(r.horasSono, 1)} h</span><span class="mono">${fmt(r.horasAcordado, 1)} h</span><span class="mono ${r.dividaAcumulada >= 0.5 ? 'deve' : ''}">${fmt(r.dividaAcumulada, 1)} h</span></button>`).join('')}</div></section>
        <section class="card"><h3 style="color:#fb7185">Dívida de sono acumulada (horas)</h3>${graficoSemana(sem, 'divida', '#fb7185', maxD, 'Dívida de sono acumulada por dia')}</section>
        <section class="card"><h3 style="color:${CORV.pressaoSono}">Pressão de sono (de 0 a 1)</h3>${graficoSemana(sem, 'pressaoSono', CORV.pressaoSono, 1, 'Pressão de sono ao longo da semana')}</section>
        <section class="card"><div class="rotulo">O que esta semana mostra</div><ul class="porque">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>`;
      tela._sem = { sem, rotinas };
    }
    let painel = '';
    if (perfil) {
      const m = metas(perfil, SEMANA.map((k) => TIPOS[k].e)), pc = (a, b) => Math.min(100, (a / b) * 100);
      painel = `<section class="card"><div class="rotulo">Desafio · ${esc(perfil.nome)}</div><p class="muted nota" style="margin-top:0">${esc(perfil.resumo)}</p>
        <div class="meta">
          <div class="item ${m.estudoOk ? 'ok' : ''}"><span>Estudo na semana</span><b>${fmt(m.estudoH, 1)} de ${perfil.metaEstudoH} h</b><span class="barra"><i style="width:${pc(m.estudoH, perfil.metaEstudoH)}%"></i></span></div>
          <div class="item ${m.ativOk ? 'ok' : ''}"><span>Atividade física (intensa vale o dobro)</span><b>${m.ativMin} de ${m.metaAtivMin} min</b><span class="barra"><i style="width:${pc(m.ativMin, m.metaAtivMin)}%"></i></span></div>
        </div>
        <p style="margin:10px 0 0"><span class="selo-meta ${m.cumpriu ? 'ok' : ''}">${m.cumpriu ? 'Meta cumprida' : 'Meta em aberto'}</span> ${sem ? `<span class="nota" style="white-space:nowrap">Dívida ao fim: <b class="mono">${fmt(sem.dividaFinal, 1)} h</b></span>` : ''}</p>
        ${m.cumpriu && sem ? `<p class="muted nota">${sem.dividaFinal < 0.5 ? 'Você fechou a semana sem dever sono. Confira o que ficou de fora do dia para isso caber.' : 'Agora tente cumprir a mesma meta com menos dívida.'}</p>` : ''}</section>`;
    }
    tela.innerHTML = `${painel}
      <section class="card"><div class="rotulo">Semana 1 · toque num dia para trocar o tipo</div>
        <div class="dias">${SEMANA.map((k, d) => `<button class="btn sec sm ${k === 'B' ? 'livre' : ''}" data-troca="${d}" aria-label="${DIAS[d]}: ${TIPOS[k].nome}. Tocar para trocar"><b>${DIAS[d]}</b><small>${k === 'A' ? 'útil' : 'livre'}</small></button>`).join('')}</div>
        <div class="grade c2" style="margin-top:12px"><button class="btn sec sm" id="ed-a">Editar dia útil</button><button class="btn sec sm" id="ed-b">Editar dia livre</button></div>
      </section>${corpo}
      <button class="link" id="sai">Trocar de modo</button>`;
    $('#ed-a').onclick = () => telaMontar(tela, voltar, 'A', () => telaSemana(tela, voltar));
    $('#ed-b').onclick = () => telaMontar(tela, voltar, 'B', () => telaSemana(tela, voltar));
    $('#sai').onclick = () => telaEntradaDiag(tela, voltar);
  };
  tela.onclick = (ev) => {
    const t = ev.target.closest('[data-troca]'), d = ev.target.closest('[data-dia]');
    if (t) { const y = scrollY; SEMANA[+t.dataset.troca] = SEMANA[+t.dataset.troca] === 'A' ? 'B' : 'A'; desenha(); scrollTo(0, y); }
    else if (d && tela._sem) {
      const i = +d.dataset.dia, { sem, rotinas } = tela._sem, r = sem.resumo[i], dia = diaDaSemana(sem, i);
      const notas = [`Sono da noite anterior: ${fmt(r.horasSono, 1)} h. Tempo acordado neste dia: ${fmt(r.horasAcordado, 1)} h.`, `Dívida de sono acumulada até aqui: ${fmt(r.dividaAcumulada, 1)} h.`, `Pressão de sono ao acordar: ${fmt(r.pressaoAoAcordar, 2)}.`];
      if (r.remPerdidoMin) notas.push(`Álcool nesta noite: cerca de ${fmt(r.remPerdidoMin, 0)} minutos de sono REM a menos.`);
      telaDia(tela, voltar, { rotina: rotinas[i], dia, notas, titulo: `${DIAS[i]} · ${rotinas[i].nome}` });
    }
  };
  desenha(); scrollTo(0, 0);
}
