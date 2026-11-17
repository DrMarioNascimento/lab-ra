// Mosaico Alostase · modo Diagnóstico: da escolha do aluno à rotina que o motor entende (sem tela).
import { simularDia } from '../motor/motor.js';

const mod24 = (h) => ((h % 24) + 24) % 24;
const dentro = (h, ini, fim) => (ini <= fim ? h >= ini && h < fim : h >= ini || h < fim);
const dur = (ini, fim) => mod24(fim - ini) || 24;

export const NIVEIS = [
  { id: 'nenhum', nome: 'Nenhum', vo2: 0 },
  { id: 'leve', nome: 'Leve', vo2: 40 },
  { id: 'moderado', nome: 'Moderado', vo2: 60 },
  { id: 'intenso', nome: 'Intenso', vo2: 80 },
];
export const DURACOES = [15, 30];                       // acima de 30 min o motor não tem dado lido
export const ALCOOL = [
  { id: 'nao', nome: 'Não', gkg: 0 },
  { id: 'pouco', nome: 'Pouco', gkg: 0.5 },
  { id: 'muito', nome: 'Muito', gkg: 0.85 },
];
export const SONO_MIN = 3, SONO_MAX = 12;

export function escolhasPadrao() {
  return {
    dormir: 23, acordar: 7,
    cafe: { on: true, hora: 7.5 }, almoco: { on: true, hora: 12.5 }, jantar: { on: true, hora: 19.5 }, lanche: { on: false, hora: 16 },
    trabalho: { on: true, inicio: 8, fim: 17 },
    exercicio: { nivel: 'nenhum', hora: 18, dur: 30 },
    alcool: 'nao',
  };
}

/** Ajusta uma hora em passos de 30 min, dando a volta em 24 h. */
export const passo = (h, d) => mod24(Math.round((h + d * 0.5) * 2) / 2);

/** Confere a rotina. Devolve a lista de impedimentos (vazia = pode simular). */
export function conferir(e) {
  const erros = [], horas = dur(e.dormir, e.acordar);
  if (horas < SONO_MIN) erros.push(`O sono precisa ter pelo menos ${SONO_MIN} horas.`);
  if (horas > SONO_MAX) erros.push(`O sono não pode passar de ${SONO_MAX} horas.`);
  const dorme = (h) => dentro(mod24(h), e.dormir, e.acordar);
  const nomes = { cafe: 'O café da manhã', almoco: 'O almoço', jantar: 'O jantar', lanche: 'O lanche' };
  for (const k of Object.keys(nomes)) if (e[k].on && dorme(e[k].hora)) erros.push(`${nomes[k]} está em hora de sono.`);
  if (e.exercicio.nivel !== 'nenhum') {
    const ini = e.exercicio.hora, fim = ini + e.exercicio.dur / 60;
    if (dorme(ini) || dorme(fim - 0.01)) erros.push('O exercício está em hora de sono.');
  }
  const fixos = e.fixos || [], flex = (e.rotuloFlex || 'O trabalho ou estudo');
  const emFixo = (h) => fixos.find((f) => dentro(mod24(h), mod24(f.inicio), mod24(f.fim)));
  for (const f of fixos) for (let h = f.inicio, k = 0; k < dur(f.inicio, f.fim) * 2; k++, h += 0.5) if (dorme(h)) { erros.push(`O sono está em cima de um compromisso (${f.nome.toLowerCase()}).`); break; }
  if (e.exercicio.nivel !== 'nenhum') { const f = emFixo(e.exercicio.hora) || emFixo(e.exercicio.hora + e.exercicio.dur / 60 - 0.01); if (f) erros.push(`O exercício está em cima de um compromisso (${f.nome.toLowerCase()}).`); }
  if (e.trabalho.on) for (let h = e.trabalho.inicio, k = 0; k < dur(e.trabalho.inicio, e.trabalho.fim) * 2; k++, h += 0.5) { const f = emFixo(h); if (f) { erros.push(`${flex === 'Estudo' ? 'O estudo' : flex} está em cima de um compromisso (${f.nome.toLowerCase()}).`); break; } }
  if (e.trabalho.on && e.exercicio.nivel !== 'nenhum') { const a = e.exercicio.hora, b = a + e.exercicio.dur / 60 - 0.01; if (dentro(mod24(a), e.trabalho.inicio, e.trabalho.fim) || dentro(mod24(b), e.trabalho.inicio, e.trabalho.fim)) { if (fixos.length) erros.push('O exercício está em cima do estudo.'); } }
  if (e.trabalho.on) {
    if (dur(e.trabalho.inicio, e.trabalho.fim) > 16) erros.push('O trabalho ou estudo não pode passar de 16 horas.');
    for (let h = e.trabalho.inicio, k = 0; k < dur(e.trabalho.inicio, e.trabalho.fim) * 2; k++, h += 0.5) if (dorme(h)) { erros.push('O trabalho ou estudo está em hora de sono.'); break; }
  }
  return erros;
}

/** Monta a rotina no formato do motor. */
export function montarRotina(e) {
  const refeicoes = [];
  const nomes = { cafe: 'Café da manhã', almoco: 'Almoço', jantar: 'Jantar', lanche: 'Lanche' };
  for (const k of Object.keys(nomes)) if (e[k].on) refeicoes.push({ hora: mod24(e[k].hora), carboG: 50, nome: nomes[k] });
  refeicoes.sort((a, b) => a.hora - b.hora);
  const jornadas = (e.fixos || []).map((f) => ({ tipo: 'compromisso', nome: f.nome, inicio: f.inicio, fim: f.fim }));
  if (e.trabalho.on) {
    const { inicio, fim } = e.trabalho, noturno = inicio > fim || inicio >= 20 || fim <= 6;
    jornadas.push({ tipo: noturno ? 'trabalho-noturno' : 'trabalho', nome: noturno ? 'Trabalho noturno' : (e.rotuloFlex || 'Trabalho ou estudo'), inicio, fim });
  }
  const nv = NIVEIS.find((n) => n.id === e.exercicio.nivel);
  if (nv.vo2) jornadas.push({ tipo: 'exercicio', nome: `Exercício ${nv.nome.toLowerCase()}`, inicio: e.exercicio.hora, fim: mod24(e.exercicio.hora + e.exercicio.dur / 60), vo2: nv.vo2 });
  return { id: 'montada', nome: 'Minha rotina', sono: [{ inicio: e.dormir, fim: e.acordar }], refeicoes, jornadas, alcoolGkg: ALCOOL.find((a) => a.id === e.alcool).gkg };
}

/** Necessidade de sono ao acordar, comparada com a mesma rotina dormindo 8 horas. */
export function residuoSono(rotina, dia = simularDia(rotina)) {
  const s = rotina.sono[rotina.sono.length - 1], em = (d, h) => d.pontos.find((p) => Math.abs(p.hora - mod24(h)) < 1e-6).pressaoSono;
  const ref = simularDia({ ...rotina, sono: [{ inicio: mod24(s.fim - 8), fim: s.fim }], alcoolGkg: 0 });
  return { aoAcordar: em(dia, s.fim), comOitoHoras: em(ref, s.fim), aoDeitar: em(dia, s.inicio), horas: dia.sonoQualidade.horas };
}

/** O que este dia custa em sono: horas acordado, horas de sono e o saldo contra o limite de 15,84 h. */
export function custoDoDia(rotina, dia = simularDia(rotina)) {
  const sono = dia.sonoQualidade.horas, acordado = 24 - sono, saldo = acordado - 15.84, f = (v, c = 1) => v.toFixed(c).replace('.', ',');
  const frase = saldo < 0.25 ? `Com ${f(acordado)} horas acordado, este dia cabe no limite de 15,84 horas: repetido a semana toda, não deixa dívida de sono.`
    : `São ${f(acordado)} horas acordado e ${f(sono)} de sono. Este dia sozinho deixa ${f(saldo)} horas de dívida; cinco dias iguais somam ${f(saldo * 5)} horas.`;
  return { sono, acordado, saldo, frase,
    numeros: [{ valor: `${f(acordado)} h`, rotulo: 'acordado' }, { valor: `${f(sono)} h`, rotulo: 'de sono' }, { valor: `${saldo > 0 ? '+' : ''}${f(Math.max(0, saldo))} h`, rotulo: 'de dívida neste dia', deve: saldo >= 0.25 }] };
}

/** O que a rotina mostra: só fatos que saem do motor. */
export function leitura(rotina, dia = simularDia(rotina)) {
  const notas = [], f = (v, c = 1) => v.toFixed(c).replace('.', ',');
  for (const a of dia.alertas) notas.push(a.texto);
  const q = dia.sonoQualidade;
  if (q.remPerdidoMin) notas.push(`O álcool tirou cerca de ${f(q.remPerdidoMin, 0)} minutos de sono REM e atrasou o primeiro REM em ${f(q.atrasoRemMin, 0)} minutos.`);
  const r = residuoSono(rotina, dia);
  if (r.aoAcordar - r.comOitoHoras > 0.05) notas.push(`Com ${f(r.horas, r.horas % 1 ? 1 : 0)} horas de sono, a necessidade de sono ao acordar fica em ${f(r.aoAcordar, 2)}; com 8 horas ficaria em ${f(r.comOitoHoras, 2)}.`);
  for (const j of rotina.jornadas.filter((x) => x.tipo === 'exercicio')) {
    const p = dia.pontos.find((x) => Math.abs(x.hora - mod24(j.fim)) < 1e-6), pct = Math.round((p.cortisol / p.cortisolBase - 1) * 100);
    notas.push(pct > 0 ? `Ao fim do exercício o cortisol fica ${pct}% acima do esperado para o horário (${f(p.cortisol)} contra ${f(p.cortisolBase)} µg/dL).` : 'O exercício leve não tira o cortisol da curva do horário.');
  }
  const picoG = Math.max(...dia.pontos.map((p) => p.glicemia));
  notas.push(rotina.refeicoes.length ? `A glicemia pós-prandial sobe e volta em cerca de 3 horas; o maior pico do dia chega a ${f(picoG, 0)} mg/dL. Passar de 140 logo depois de comer é esperado em pessoa saudável: o que conta é voltar à base.` : 'Sem refeições, a glicemia fica na base o dia todo: o modelo não derruba a glicemia de pessoa saudável por horas sem comer.');
  if (rotina.jornadas.some((j) => j.tipo === 'trabalho-noturno')) notas.push('Nas primeiras noites de trabalho noturno a curva do cortisol não acompanha a rotina nova.');
  return notas;
}
