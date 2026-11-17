// Mosaico Alostase · tela do modo Diagnóstico: o aluno monta a rotina, o jogo mostra o esperado.
import { simularDia } from '../motor/motor.js';
import { explicar, hhmm } from './prognostico.js';
import { escolhasPadrao, conferir, montarRotina, leitura, passo, NIVEIS, DURACOES, ALCOOL } from './rotina-montada.js';
import { $, fmt, esc, linhaDoTempo, grafico, VARS, CORV } from './ui.js';

let E = escolhasPadrao();
const pega = (caminho) => caminho.split('.').reduce((o, k) => o[k], E);
const poe = (caminho, v) => { const ks = caminho.split('.'); const u = ks.pop(); ks.reduce((o, k) => o[k], E)[u] = v; };

const hora = (rot, caminho) => `<div class="lin"><span>${rot}</span><span class="passo"><button class="btn sec sm" data-h="${caminho}" data-d="-1" aria-label="${rot}: 30 minutos antes">−</button><b class="mono">${hhmm(pega(caminho))}</b><button class="btn sec sm" data-h="${caminho}" data-d="1" aria-label="${rot}: 30 minutos depois">+</button></span></div>`;
const liga = (rot, caminho) => `<button class="btn sec sm chave ${pega(caminho) ? 'on' : ''}" data-l="${caminho}" aria-pressed="${pega(caminho)}">${rot}</button>`;
const seg = (caminho, lista, rotulo) => `<div class="seg" role="group" aria-label="${rotulo}">${lista.map((o) => `<button class="btn sec sm ${String(pega(caminho)) === String(o.id) ? 'on' : ''}" data-s="${caminho}" data-v="${o.id}" aria-pressed="${String(pega(caminho)) === String(o.id)}">${o.nome}</button>`).join('')}</div>`;
const refeicao = (rot, k) => `<div class="lin"><span>${liga(rot, `${k}.on`)}</span>${E[k].on ? `<span class="passo"><button class="btn sec sm" data-h="${k}.hora" data-d="-1" aria-label="${rot}: antes">−</button><b class="mono">${hhmm(E[k].hora)}</b><button class="btn sec sm" data-h="${k}.hora" data-d="1" aria-label="${rot}: depois">+</button></span>` : '<span class="muted">fora</span>'}</div>`;

export function telaMontar(tela, voltar) {
  const desenha = () => {
    const erros = conferir(E), horasSono = ((E.acordar - E.dormir) % 24 + 24) % 24 || 24;
    const previa = erros.length ? null : montarRotina(E);
    tela.innerHTML = `
      <section class="card">${previa ? linhaDoTempo(previa) : '<p class="aviso">Acerte os horários para ver a linha do tempo.</p>'}</section>
      <section class="card"><div class="rotulo">Sono · ${fmt(horasSono, horasSono % 1 ? 1 : 0)} h</div>${hora('Dormir', 'dormir')}${hora('Acordar', 'acordar')}</section>
      <section class="card"><div class="rotulo">Refeições · 50 g de carboidrato cada</div>${refeicao('Café', 'cafe')}${refeicao('Almoço', 'almoco')}${refeicao('Jantar', 'jantar')}${refeicao('Lanche', 'lanche')}</section>
      <section class="card"><div class="rotulo">Trabalho ou estudo</div><div class="lin"><span>${liga('Tem jornada', 'trabalho.on')}</span><span class="muted">${E.trabalho.on ? '' : 'dia livre'}</span></div>${E.trabalho.on ? hora('Começa', 'trabalho.inicio') + hora('Termina', 'trabalho.fim') : ''}</section>
      <section class="card"><div class="rotulo">Exercício</div>${seg('exercicio.nivel', NIVEIS, 'Intensidade do exercício')}
        ${E.exercicio.nivel !== 'nenhum' ? hora('Começa', 'exercicio.hora') + `<div class="lin"><span>Duração</span>${seg('exercicio.dur', DURACOES.map((d) => ({ id: d, nome: `${d} min` })), 'Duração do exercício')}</div>` : ''}</section>
      <section class="card"><div class="rotulo">Álcool antes de dormir</div>${seg('alcool', ALCOOL, 'Álcool antes de dormir')}</section>
      ${erros.length ? `<div class="aviso">${erros.map(esc).join('<br>')}</div>` : ''}
      <button class="btn ok block" id="ver" ${erros.length ? 'disabled' : ''}>Ver o dia</button>
      <button class="link" id="zera">Voltar à rotina padrão</button>
      <button class="link" id="sai">Trocar de modo</button>`;
    $('#ver').onclick = () => telaDia(tela, voltar);
    $('#zera').onclick = () => { E = escolhasPadrao(); desenha(); };
    $('#sai').onclick = voltar;
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

function telaDia(tela, voltar) {
  const rotina = montarRotina(E), dia = simularDia(rotina), notas = leitura(rotina, dia);
  let h = E.acordar;
  tela.innerHTML = `
    <p class="aviso">Aqui, diagnóstico é a leitura que o modelo faz da rotina. Não é diagnóstico clínico nem o seu corpo.</p>
    <section class="card fixo"><div id="lt"></div>
      <input type="range" id="hr" min="0" max="23.5" step="0.5" value="${h}" aria-label="Hora do dia">
      <div class="leitura" id="vals"></div></section>
    <section class="card"><div class="rotulo">Por quê, nesta hora</div><ul class="porque" id="pq"></ul></section>
    ${['cortisol', 'glicemia', 'pressaoSono'].map((k) => `<section class="card"><h3 style="color:${CORV[k]}">${VARS[k].nome} (${VARS[k].unidade})</h3><div id="g-${k}"></div></section>`).join('')}
    <section class="card"><div class="rotulo">O que esta rotina mostra</div><ul class="porque">${notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></section>
    <button class="btn ok block" id="ajusta">Ajustar a rotina</button>
    <button class="link" id="sai">Trocar de modo</button>`;
  const pinta = () => {
    const p = dia.pontos.find((x) => Math.abs(x.hora - h) < 1e-6);
    $('#lt').innerHTML = linhaDoTempo(rotina, h);
    $('#vals').innerHTML = `<div class="hora-atual"><b class="mono">${hhmm(h)}</b><span>${p.dormindo ? 'dormindo' : 'acordado'}</span></div>
      <div class="valor cort"><b>${fmt(p.cortisol, 1)}</b><span>Cortisol, µg/dL</span></div>
      <div class="valor glic"><b>${fmt(p.glicemia, 0)}</b><span>Glicemia, mg/dL</span></div>
      <div class="valor sono"><b>${fmt(p.pressaoSono, 2)}</b><span>Pressão de sono</span></div>`;
    $('#pq').innerHTML = [...explicar(rotina, h, 'cortisol'), ...explicar(rotina, h, 'glicemia')].map((f) => `<li>${esc(f)}</li>`).join('');
    for (const k of ['cortisol', 'glicemia', 'pressaoSono']) $(`#g-${k}`).innerHTML = grafico(dia, k, { hora: h });
  };
  tela.onclick = null;
  $('#hr').oninput = (ev) => { h = +ev.target.value; pinta(); };
  $('#ajusta').onclick = () => telaMontar(tela, voltar);
  $('#sai').onclick = voltar;
  pinta(); scrollTo(0, 0);
}
