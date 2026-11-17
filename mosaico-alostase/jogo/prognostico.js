// Mosaico Alostase · regras do modo Prognóstico (sem tela).
import { simularDia, faixaCortisol, faixaGlicemia } from '../motor/motor.js';
import { P } from '../motor/parametros.js';

export const VARIAVEIS = {
  cortisol: { nome: 'Cortisol', unidade: 'µg/dL', min: 0, max: 30, passo: 0.1, casas: 1 },
  glicemia: { nome: 'Glicemia', unidade: 'mg/dL', min: 60, max: 200, passo: 1, casas: 0 },
};
export const TEMPOS = [{ min: 5, perguntas: 5 }, { min: 10, perguntas: 10 }, { min: 20, perguntas: 19 }, { min: 40, perguntas: 36 }];

const mod24 = (h) => ((h % 24) + 24) % 24;
const dentro = (h, ini, fim) => (ini <= fim ? h >= ini && h < fim : h >= ini || h < fim);
export const hhmm = (h) => { const m = Math.round(mod24(h) * 60); return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`.replace('h00', 'h'); };

export function gerador(semente) {                      // mulberry32: mesma semente, mesma partida
  let a = semente >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const horaDeAcordar = (rotina) => mod24(rotina.sono[rotina.sono.length - 1].fim);
const dormindo = (rotina, h) => rotina.sono.some((b) => dentro(mod24(h), mod24(b.inicio), mod24(b.fim)));

/** Janela em que o cortisol não é pedido: estresse psicológico ainda sem tamanho lido (ficha 06). */
export function cortisolForaDoJogo(rotina, h) {
  return rotina.jornadas.some((j) => j.tipo === 'prova' && dentro(mod24(h), mod24(j.inicio - 1), mod24(j.fim + 1.5)));
}

export function pontoEm(dia, h) { return dia.pontos.find((p) => Math.abs(p.hora - mod24(h)) < 1e-6); }

/** Valor ao acordar, mostrado antes da primeira estimativa. */
export function ancora(rotina, dia = simularDia(rotina)) {
  const h = horaDeAcordar(rotina), p = pontoEm(dia, h);
  return { hora: h, cortisol: p.cortisol, glicemia: p.glicemia };
}

/** Sorteia pares de hora e variável, sem repetir, em ordem do dia a partir do despertar, alternando a variável. */
export function sortearPerguntas(rotina, n, semente = 1) {
  const rnd = gerador(semente), acordar = horaDeAcordar(rotina);
  const horas = [];
  for (let k = 1; k < 24; k++) { const h = mod24(Math.ceil(acordar) + k - (Number.isInteger(acordar) ? 0 : 1) ); if (!dormindo(rotina, h) && h !== acordar) horas.push({ h, k }); }
  const pares = [];
  for (const { h, k } of horas) for (const v of ['cortisol', 'glicemia']) if (!(v === 'cortisol' && cortisolForaDoJogo(rotina, h))) pares.push({ hora: h, ordem: k, variavel: v });
  const total = Math.min(n, pares.length);
  // 1ª passada: no máximo um par por hora, alternando; 2ª passada: completa com o que sobrou
  const embaralha = (l) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const escolhidasH = embaralha(horas).slice(0, Math.min(total, horas.length)).sort((a, b) => a.k - b.k);
  const escolhidos = []; let vez = rnd() < 0.5 ? 'cortisol' : 'glicemia';
  for (const { h } of escolhidasH) {
    let v = vez; if (v === 'cortisol' && cortisolForaDoJogo(rotina, h)) v = 'glicemia';
    escolhidos.push(pares.find((p) => p.hora === h && p.variavel === v));
    vez = v === 'cortisol' ? 'glicemia' : 'cortisol';
  }
  const resto = embaralha(pares.filter((p) => !escolhidos.includes(p)));
  while (escolhidos.length < total) escolhidos.push(resto.pop());
  return escolhidos.sort((a, b) => a.ordem - b.ordem || (a.variavel < b.variavel ? -1 : 1));
}

export function faixa(variavel, valor) { return variavel === 'cortisol' ? faixaCortisol(valor) : faixaGlicemia(valor); }

/** 100 pontos dentro da faixa; fora, cai em linha reta até zero a uma largura de faixa de distância. */
export function pontuar(palpite, [min, max]) {
  if (palpite >= min && palpite <= max) return 100;
  const fora = palpite < min ? min - palpite : palpite - max;
  return Math.max(0, Math.round(100 * (1 - fora / (max - min))));
}

/** Raciocínio mostrado na revelação: o que aconteceu antes, há quanto tempo, o que se espera. */
export function explicar(rotina, h, variavel) {
  const frases = [], c = P.cortisol, hr = mod24(h);
  const haMin = (ev) => Math.round(mod24(hr - mod24(ev)) * 60);
  if (variavel === 'glicemia') {
    const ult = rotina.refeicoes.map((m) => ({ m, min: haMin(m.hora) })).filter((x) => x.min > 0).sort((a, b) => a.min - b.min)[0];
    if (ult && ult.min <= 240) {
      frases.push(`${ult.m.nome} foi há ${ult.min >= 60 ? `${Math.floor(ult.min / 60)} h${ult.min % 60 ? ` ${ult.min % 60} min` : ''}` : `${ult.min} min`}.`);
      frases.push(ult.min <= 80 ? 'A glicemia chega ao pico perto de 50 minutos depois de comer.' : ult.min <= 180 ? 'O pico já passou: a glicemia está voltando para o valor de antes da refeição.' : 'Passadas umas 3 horas, a glicemia está quase de volta à base.');
    } else {
      frases.push('Não houve refeição nas últimas horas.');
      frases.push('Em pessoa saudável a glicemia é bem defendida: fica perto da base mesmo sem comer por algumas horas.');
    }
    return frases;
  }
  const dAnt = mod24(hr - c.nadir.hora);
  if (hr >= c.repousoFim.hora && hr < c.pico.hora) frases.push('É a fase de subida da manhã: o cortisol sobe rápido rumo ao pico, perto das 8h30.');
  else if (hr >= c.pico.hora && hr < 12) frases.push('O pico da manhã acabou de passar e o cortisol começa a cair.');
  else if (hr >= 12 && hr < c.repousoIni.hora) frases.push('À tarde o cortisol segue caindo devagar.');
  else if (dAnt < mod24(c.repousoFim.hora - c.nadir.hora)) frases.push('É madrugada: o cortisol saiu do ponto mais baixo, perto da meia-noite, e começa a subir.');
  else frases.push('É a fase de repouso: o cortisol está abaixo da média do dia e vai ao ponto mais baixo perto da meia-noite.');
  const ex = rotina.jornadas.filter((j) => j.tipo === 'exercicio').map((j) => ({ j, min: haMin(j.fim) })).filter((x) => x.min >= 0 && x.min <= 180).sort((a, b) => a.min - b.min)[0];
  if (ex) {
    if (ex.j.vo2 <= 40) frases.push(`${ex.j.nome}: exercício leve não eleva o cortisol.`);
    else frases.push(`${ex.j.nome} ${ex.min < 5 ? 'acabou de terminar' : `terminou há ${ex.min} min`}. Exercício acima de 60% do VO2máx eleva o cortisol além do esperado para o horário, e o efeito ainda não passou.`);
  }
  if (rotina.jornadas.some((j) => j.tipo === 'trabalho-noturno')) frases.push('Nas primeiras noites de plantão o relógio do corpo não muda: a curva segue o horário antigo.');
  return frases;
}

/** Prepara uma partida completa. */
export function novaPartida(rotina, nPerguntas, semente = 1) {
  const dia = simularDia(rotina);
  const perguntas = sortearPerguntas(rotina, nPerguntas, semente).map((q) => {
    const valor = pontoEm(dia, q.hora)[q.variavel];
    return { ...q, valor, faixa: faixa(q.variavel, valor), raciocinio: explicar(rotina, q.hora, q.variavel) };
  });
  return { rotina, dia, ancora: ancora(rotina, dia), perguntas };
}
