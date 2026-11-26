// Motor contínuo da bancada integrada. Estado hídrico, excreção e pressão de sono atravessam a meia-noite.
import { BEBIDAS_BASE, CENARIOS_HIDRICOS, PASSO_INTEGRADO, SESSAO, simularHidratacao } from './bancada-hidrica.js?v=2';
import { simularCardiovascular } from './cardiovascular.js';
import { hidratar } from './hidratacao.js';
import { cortisolBase, efeitoExercicioCortisol, efeitoRefeicaoGlicemia } from './motor.js';
import { P } from './parametros.js';
import { regularRim } from './renal.js';

export const HORIZONTES = [1, 2, 7, 28, 56, 90, 180, 365];
export const PERFIS_TRAJETORIA = Object.freeze({
  regular: { nome: 'Rotina sem sessão programada', treino: false, sonoCurto: false, ambiente: 'fresco' },
  treino: { nome: 'Três sessões semanais em ambiente fresco', treino: true, sonoCurto: false, ambiente: 'fresco' },
  calor: { nome: 'As mesmas sessões no calor', treino: true, sonoCurto: false, ambiente: 'calor' },
  adiada: { nome: 'No calor, com água 60 min depois', treino: true, sonoCurto: false, ambiente: 'adiada' },
  sono: { nome: 'Treino com cinco noites de 6 h', treino: true, sonoCurto: true, ambiente: 'fresco' },
});
const REFEICOES = Object.freeze([7.5, 13, 20].map((hora) => ({ hora, carboG: 50 })));
const MODULO_DIA = 1440;
const PASSOS_DIA = MODULO_DIA / PASSO_INTEGRADO;
const N_MESES = 10;

// Reimers et al. 2018: reduções médias de repouso 2,7–5,8 bpm após endurance.
// Meta de 4 bpm e meia-vida de 28 dias são aproximações para o perfil de três sessões semanais.
export const ADAPTACAO_FC = Object.freeze({ alvoBpm: 4, meiaVidaDias: 28 });

export function passoAdaptacaoFC(antes, treina) {
  const alvo = treina ? ADAPTACAO_FC.alvoBpm : 0;
  return alvo + (antes - alvo) * 2 ** (-1 / ADAPTACAO_FC.meiaVidaDias);
}

function plano(dia, perfil) {
  const semana = dia % 7;
  const dorme = perfil.sonoCurto && semana < 5 ? 60 : 1380;
  const sessao = perfil.treino && [0, 2, 4].includes(semana) ? SESSAO : null;
  return { sono: [dorme, 420], sessao };
}

function atualizaSono(antes, dorme) {
  const { tauQuedaH, tauSubidaH } = P.pressaoSono;
  const h = PASSO_INTEGRADO / 60;
  return dorme ? antes * Math.exp(-h / tauQuedaH.valor) : 1 - (1 - antes) * Math.exp(-h / tauSubidaH.valor);
}

function refeicao(hora, m, diaAnterior) {
  return efeitoRefeicaoGlicemia(m, (hora - m.hora + (diaAnterior ? 24 : 0)) * 60);
}

function pulsoCortisol(hora, sessao, diaAnterior) {
  if (!sessao) return 0;
  const inicio = sessao.inicio / 60;
  return efeitoExercicioCortisol({ inicio, fim: inicio + sessao.duracao / 60, vo2: sessao.intensidade },
    (hora - inicio + (diaAnterior ? 24 : 0)) * 60);
}

function ajustarFCBasal(pontos, queda) {
  return pontos.map((p) => {
    const { deltaFC, fcMax, fcBasal } = p.calculo;
    const fracaoReservaUsada = fcMax ? deltaFC / (fcMax - fcBasal) : 0;
    return { ...p, fc: p.fc - queda * (1 - fracaoReservaUsada) };
  });
}

/** O mesmo horizonte compartilha o mesmo estado inicial, independentemente do número de dias exibido. */
export function simularTrajetoria(perfilId, dias, { detalharDia = -1 } = {}) {
  if (!Object.hasOwn(PERFIS_TRAJETORIA, perfilId) || !Number.isInteger(dias) || dias < 1 || dias > 365) throw new RangeError('Escolha um cenário e um horizonte de 1 a 365 dias.');
  const perfil = PERFIS_TRAJETORIA[perfilId];
  const saida = [];
  const baseCardio = new Map();
  let agua = hidratar();
  let pressaoSono = 0.5, quedaFC = 0, sessaoAnterior = null;
  let leitura = [];
  const saldosSono = [];

  for (let dia = 0; dia < dias; dia++) {
    const { sono, sessao } = plano(dia, perfil);
    const cache = `${sono[0]}:${sessao ? 'ex' : 'sem'}`;
    if (!baseCardio.has(cache)) baseCardio.set(cache, simularCardiovascular({ sono, exercicio: sessao }));
    // O ganho no fim do dia passa a valer na manhã seguinte.
    const cardio = ajustarFCBasal(baseCardio.get(cache), quedaFC);
    const cenario = CENARIOS_HIDRICOS[perfil.ambiente];
    const faseHidrica = simularHidratacao(cenario, { estado: agua, cardio, sessao, bebidas: BEBIDAS_BASE,
      guardarPontos: dia === detalharDia, regular: regularRim });
    agua = faseHidrica.estado;
    const horasSono = ((sono[1] - sono[0] + MODULO_DIA) % MODULO_DIA) / 60;
    saldosSono.push(24 - horasSono - P.dividaSono.vigiliaCriticaH.valor);
    const saldoSono7d = Math.max(0, saldosSono.slice(-7).reduce((a, b) => a + b, 0));
    let picoGlicemia = 0, mediaCortisol = 0, pressaoAoAcordar = 0;
    for (let i = 0; i < PASSOS_DIA; i++) {
      const min = i * PASSO_INTEGRADO, hora = min / 60;
      if (min === sono[1]) pressaoAoAcordar = pressaoSono;
      const { dormindo } = cardio[min];
      const subida = REFEICOES.reduce((soma, m) => soma + refeicao(hora, m, false) + refeicao(hora, m, true), 0);
      const glicemia = P.glicemia.base.valor + Math.min(subida, P.glicemia.subidaMax.valor);
      const cortisol = cortisolBase(hora) + pulsoCortisol(hora, sessao, false) + pulsoCortisol(hora, sessaoAnterior, true);
      picoGlicemia = Math.max(picoGlicemia, glicemia);
      mediaCortisol += cortisol / PASSOS_DIA;
      if (dia === detalharDia) leitura.push({ ...faseHidrica.pontos[i], glicemia, cortisol, pressaoSono });
      pressaoSono = atualizaSono(pressaoSono, dormindo);
    }
    saida.push({
      dia: dia + 1, horasSono, saldoSono7d, pressaoAoAcordar, quedaFC, picoGlicemia, mediaCortisol,
      ureseL: faseHidrica.totais.urinaL, suorL: faseHidrica.totais.suorL, treinoMin: sessao?.duracao ?? 0,
      ...faseHidrica.resumo,
    });
    sessaoAnterior = sessao;
    quedaFC = passoAdaptacaoFC(quedaFC, perfil.treino);
  }

  return { dias: saida, leitura, estadoFinal: { agua, pressaoSono, quedaFC } };
}

export function agruparTrajetoria(dias) {
  const periodos = [];
  const limite = dias.length;
  function adicionar(inicio, fim, nome, nomeCurto) {
    if (inicio >= limite) return;
    const ate = Math.min(fim, limite);
    const trecho = dias.slice(inicio, ate);
    const tipico = trecho[trecho.length - 1];
    const media = (chave) => trecho.reduce((s, p) => s + p[chave], 0) / trecho.length;
    periodos.push({
      ...tipico, inicio: inicio + 1, fim: ate, nome, nomeCurto, parcial: ate < fim,
      horasSono: media('horasSono'), fcMedia: media('fcMedia'), pamMedia: media('pamMedia'),
      ureseL: media('ureseL'), suorL: media('suorL'),
      picoGlicemia: Math.max(...trecho.map((p) => p.picoGlicemia)),
      maxOsm: Math.max(...trecho.map((p) => p.maxOsm)),
      mediaCortisol: media('mediaCortisol'), minPlasma: Math.min(...trecho.map((p) => p.minPlasma)),
      treinoMin: trecho.reduce((s, p) => s + p.treinoMin, 0),
    });
  }
  for (let i = 0; i < 7; i++) adicionar(i, i + 1, `Dia ${i + 1}`, `D${i + 1}`);
  for (let s = 1; s < 8; s++) adicionar(s * 7, (s + 1) * 7, `Semana ${s + 1}`, `S${s + 1}`);
  for (let m = 0; m < N_MESES; m++) {
    const fronteira = (i) => 56 + Math.round((365 - 56) * i / N_MESES);
    adicionar(fronteira(m), fronteira(m + 1), `Mês ${m + 3}`, `M${m + 3}`);
  }
  return periodos;
}
