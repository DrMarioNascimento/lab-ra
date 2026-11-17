// Mosaico Alostase · peças de tela usadas pelos dois modos.
import { VARIAVEIS, hhmm } from './prognostico.js';

export const $ = (s) => document.querySelector(s);
export const fmt = (v, casas) => v.toFixed(casas).replace('.', ',');
export const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const VARS = { ...VARIAVEIS, pressaoSono: { nome: 'Pressão de sono', unidade: 'de 0 a 1', min: 0, max: 1, casas: 2 } };
export const CORV = { cortisol: '#f59e0b', glicemia: '#38bdf8', pressaoSono: '#c4b5fd' };

export const CLASSE = { trabalho: 'trab', estudo: 'trab', 'trabalho-noturno': 'trab', exercicio: 'ex', 'noite-ativa': 'noite', prova: 'prova', compromisso: 'fixo' };
export const COR = { sono: '#4c1d95', trab: '#1e40af', ex: '#b45309', noite: '#9d174d', prova: '#b91c1c', fixo: '#475569', ref: '#34d399' };

function blocos(ini, fim, cls) {                       // parte o bloco que atravessa a meia-noite
  const a = ((ini % 24) + 24) % 24, b = ((fim % 24) + 24) % 24;
  const um = (x, y) => `<span class="bl ${cls}" style="left:${(x / 24) * 100}%;width:${Math.max(0.8, ((y - x) / 24) * 100)}%"></span>`;
  return a < b ? um(a, b) : um(a, 24) + (b > 0 ? um(0, b) : '');
}
export function linhaDoTempo(r, agora) {
  let h = '';
  for (const s of r.sono) h += blocos(s.inicio, s.fim, 'sono');
  for (const j of r.jornadas) h += blocos(j.inicio, j.fim, CLASSE[j.tipo] || 'trab');
  for (const m of r.refeicoes) h += `<span class="ref" style="left:${(m.hora / 24) * 100}%"></span>`;
  if (agora != null) h += `<span class="agora" style="left:${(agora / 24) * 100}%"></span>`;
  return `<div class="linha" role="img" aria-label="Linha do tempo de 24 horas da rotina">${h}</div><div class="horas"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>`;
}
export function listaDaRotina(r) {
  const it = [];
  for (const s of r.sono) it.push({ h: s.inicio, t: `${hhmm(s.inicio)} a ${hhmm(s.fim)}`, n: 'Sono', c: 'sono' });
  for (const j of r.jornadas) it.push({ h: j.inicio, t: `${hhmm(j.inicio)} a ${hhmm(j.fim)}`, c: CLASSE[j.tipo] || 'trab',
    n: j.tipo === 'exercicio' ? `${j.nome} (${Math.round((((j.fim - j.inicio) % 24) + 24) % 24 * 60)} min, ${j.vo2}% do VO2máx)` : j.nome });
  for (const m of r.refeicoes) it.push({ h: m.hora, t: hhmm(m.hora), n: `${m.nome} (${m.carboG} g de carboidrato)`, c: 'ref' });
  if (r.alcoolGkg) it.push({ h: 23.9, t: 'Na festa', n: `Álcool: ${fmt(r.alcoolGkg, 2)} g por kg de peso`, c: 'noite' });
  it.sort((a, b) => a.h - b.h);
  return `<ul class="itens">${it.map((x) => `<li><span class="pt" style="background:${COR[x.c]}"></span><span class="h">${x.t}</span><span>${esc(x.n)}</span></li>`).join('')}</ul>`;
}


/** Curva do dia. opcoes: { palpites: [{hora, palpite, valor}], hora: marcador } */
export function grafico(dia, variavel, opcoes = {}) {
  const v = VARS[variavel], W = 340, H = 150, L = 34, R = 8, T = 8, B = 22;
  const pts = dia.pontos, vals = pts.map((q) => q[variavel]), pal = opcoes.palpites || [];
  const max = variavel === 'pressaoSono' ? 1 : Math.max(...vals, ...pal.map((x) => x.palpite)) * 1.1;
  const min = variavel === 'glicemia' ? Math.min(70, ...pal.map((x) => x.palpite)) : 0;
  const X = (h) => L + (h / 24) * (W - L - R), Y = (val) => T + (1 - (val - min) / (max - min)) * (H - T - B);
  const linha = pts.map((q, i) => `${i ? 'L' : 'M'}${X(q.hora).toFixed(1)},${Y(q[variavel]).toFixed(1)}`).join('');
  const casasEixo = variavel === 'pressaoSono' ? 1 : 0;
  const ticks = [min, (min + max) / 2, max].map((t) => `<text x="${L - 5}" y="${Y(t) + 4}" text-anchor="end" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${fmt(t, casasEixo)}</text><line x1="${L}" x2="${W - R}" y1="${Y(t)}" y2="${Y(t)}" stroke="#23415f" stroke-width="1"/>`).join('');
  const hx = [0, 6, 12, 18, 24].map((h) => `<text x="${X(h)}" y="${H - 6}" text-anchor="${h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}" font-size="10" fill="#a9bfd6" font-family="JetBrains Mono, monospace">${h}h</text>`).join('');
  const bolas = pal.map((x) => `<circle cx="${X(x.hora)}" cy="${Y(x.palpite)}" r="5" fill="#fff" stroke="#07111f" stroke-width="2"><title>${hhmm(x.hora)}: você ${fmt(x.palpite, v.casas)}, esperado ${fmt(x.valor, v.casas)}</title></circle>`).join('');
  let marca = '';
  if (opcoes.hora != null) {
    const p = pts.reduce((a, b) => (Math.abs(b.hora - opcoes.hora) < Math.abs(a.hora - opcoes.hora) ? b : a));
    marca = `<line x1="${X(p.hora)}" x2="${X(p.hora)}" y1="${T}" y2="${H - B}" stroke="#fff" stroke-width="1.5" opacity=".7"/><circle cx="${X(p.hora)}" cy="${Y(p[variavel])}" r="5" fill="${CORV[variavel]}" stroke="#fff" stroke-width="2"/>`;
  }
  return `<svg class="graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva esperada de ${v.nome} ao longo do dia">${ticks}${hx}<path d="${linha}" fill="none" stroke="${CORV[variavel]}" stroke-width="2.5" stroke-linejoin="round"/>${marca}${bolas}</svg>`;
}
