// Mosaico Alostase · sala de aula: o estado da partida e as regras, sem tela.
// O professor roda isto; telão e celulares só leem o estado publicado e mandam a resposta.
import { ROTINAS } from '../jogo/rotinas.js';
import { novaPartida, pontuar, VARIAVEIS } from '../jogo/prognostico.js';

export const OPCOES_N = [3, 5, 8];
const clona = (x) => JSON.parse(JSON.stringify(x));

export function estadoInicial() {
  return { fase: 'entrada', rotinaId: ROTINAS[0].id, n: 5, semente: 1, qi: 0, ordem: [], alunos: {}, resp: {}, ult: {}, pts: {}, acertos: {} };
}

const cache = new Map();
/** A partida sai da rotina, do número de perguntas e da semente: celular, telão e professor chegam ao mesmo resultado. */
export function partidaDe(st) {
  const rotina = ROTINAS.find((r) => r.id === st.rotinaId) || ROTINAS[0], chave = `${rotina.id}|${st.n}|${st.semente}`;
  if (!cache.has(chave)) cache.set(chave, novaPartida(rotina, st.n, st.semente));
  return cache.get(chave);
}
export const perguntaAtual = (st) => partidaDe(st).perguntas[st.qi] || null;
export const totalPerguntas = (st) => partidaDe(st).perguntas.length;
export const pontosMaximos = (st) => 100 * totalPerguntas(st);

export function reduzir(st, a) {
  const s = clona(st);
  switch (a.t) {
    case 'config':
      if (s.fase !== 'entrada') return st;
      if (a.rotinaId && ROTINAS.some((r) => r.id === a.rotinaId)) s.rotinaId = a.rotinaId;
      if (OPCOES_N.includes(a.n)) s.n = a.n;
      if (Number.isFinite(a.semente)) s.semente = a.semente >>> 0;
      return s;
    case 'entrar':
      if (!a.id || s.alunos[a.id]) return st;
      s.alunos[a.id] = { nome: String(a.nome || 'Aluno').slice(0, 24), ...(a.auto ? { auto: true } : {}) };
      s.ordem.push(a.id); s.pts[a.id] = 0; s.acertos[a.id] = 0;
      return s;
    case 'comecar':
      if (s.fase !== 'entrada') return st;
      s.fase = 'pergunta'; s.qi = 0; s.resp = {}; s.ult = {};
      return s;
    case 'responder': {
      const q = perguntaAtual(s), v = Number(a.valor);
      if (s.fase !== 'pergunta' || !q || !s.alunos[a.id] || !Number.isFinite(v)) return st;
      const def = VARIAVEIS[q.variavel];
      (s.resp[s.qi] ??= {})[a.id] = Math.min(def.max, Math.max(def.min, v));
      return s;
    }
    case 'revelar': {
      const q = perguntaAtual(s);
      if (s.fase !== 'pergunta' || !q) return st;
      s.ult = {};
      for (const id of s.ordem) {
        const v = s.resp[s.qi]?.[id], p = v == null ? 0 : pontuar(v, q.faixa);
        s.ult[id] = p; s.pts[id] = (s.pts[id] || 0) + p;
        if (v != null && v >= q.faixa[0] && v <= q.faixa[1]) s.acertos[id] = (s.acertos[id] || 0) + 1;
      }
      s.fase = 'revelacao';
      return s;
    }
    case 'proxima':
      if (s.fase !== 'revelacao') return st;
      if (s.qi + 1 >= totalPerguntas(s)) s.fase = 'fim'; else { s.qi += 1; s.fase = 'pergunta'; s.ult = {}; }
      return s;
    case 'reiniciar':
      for (const id of s.ordem) { s.pts[id] = 0; s.acertos[id] = 0; }
      return { ...s, fase: 'entrada', qi: 0, resp: {}, ult: {} };
    default: return st;
  }
}

/** Números da pergunta atual: quantos responderam e, na revelação, a distribuição. */
export function resumoDaPergunta(st, qi = st.qi) {
  const q = partidaDe(st).perguntas[qi], respostas = Object.values(st.resp[qi] || {});
  const dentro = q ? respostas.filter((v) => v >= q.faixa[0] && v <= q.faixa[1]).length : 0;
  const ord = [...respostas].sort((a, b) => a - b);
  const mediana = ord.length ? (ord.length % 2 ? ord[(ord.length - 1) / 2] : (ord[ord.length / 2 - 1] + ord[ord.length / 2]) / 2) : null;
  return { n: respostas.length, total: st.ordem.length, valores: respostas, dentro, mediana };
}

/** Quantos acertaram (dentro da faixa) em cada pergunta já revelada. */
export function acertosPorPergunta(st) {
  const ate = st.fase === 'revelacao' || st.fase === 'fim' ? st.qi : st.qi - 1, saida = [];
  for (let i = 0; i <= ate; i++) { const r = resumoDaPergunta(st, i); saida.push({ qi: i, ...r }); }
  return saida;
}

export const mediaDePontos = (st) => (st.ordem.length ? st.ordem.reduce((t, id) => t + (st.pts[id] || 0), 0) / st.ordem.length : 0);

/** Histograma: classes de mesma largura cobrindo as respostas, a faixa e o valor esperado. */
export function histograma(valores, faixa, esperado, classes = 12) {
  const lo0 = Math.min(faixa[0], esperado, ...valores), hi0 = Math.max(faixa[1], esperado, ...valores), pad = (hi0 - lo0) * 0.08 || 1;
  const lo = lo0 - pad, hi = hi0 + pad, larg = (hi - lo) / classes, cont = Array(classes).fill(0);
  for (const v of valores) cont[Math.min(classes - 1, Math.floor((v - lo) / larg))]++;
  return { lo, hi, larg, cont, max: Math.max(1, ...cont) };
}
