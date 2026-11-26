// Motor contínuo da bancada integrada. Estado hídrico, excreção e pressão de sono atravessam a meia-noite.
import { BEBIDAS_BASE, CENARIOS_HIDRICOS, PASSO_INTEGRADO, SESSAO, simularHidratacao } from './bancada-hidrica.js?v=3';
import { simularCardiovascular } from './cardiovascular.js?v=2';
import { hidratar } from './hidratacao.js';
import { cortisolBase, efeitoExercicioCortisol, efeitoRefeicaoGlicemia } from './motor.js';
import { P } from './parametros.js';
import { regularRim } from './renal.js';
import { agendaInicial, prepararAgenda, TIPOS_AGENDA } from './agenda.js';

export const HORIZONTES = [1, 2, 7, 28, 56, 90, 180, 365];
export const PERFIS_TRAJETORIA = Object.freeze({
  regular: { nome: 'Rotina sem sessão programada', treino: false, sonoCurto: false, ambiente: 'fresco' },
  treino: { nome: 'Três sessões semanais em ambiente fresco', treino: true, sonoCurto: false, ambiente: 'fresco' },
  calor: { nome: 'As mesmas sessões no calor', treino: true, sonoCurto: false, ambiente: 'calor' },
  adiada: { nome: 'No calor, com água 60 min depois', treino: true, sonoCurto: false, ambiente: 'adiada' },
  sono: { nome: 'Treino com cinco noites de 6 h', treino: true, sonoCurto: true, ambiente: 'fresco' },
  plantao: { nome: 'Trabalho noturno (22h–07h)', noite: { inicio: 1320, atividade: 'Plantão' }, ambiente: 'fresco' },
  lazer: { nome: 'Lazer noturno (23h–07h)', noite: { inicio: 1380, atividade: 'Lazer' }, ambiente: 'fresco' },
  turno: { nome: 'Turno noturno permanente (22h–07h, sono 08h–14h)', agenda: agendaInicial(true), ambiente: 'fresco' },
  personalizada: { nome: 'Agenda personalizada', ambiente: 'fresco' },
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

const FIM_NOITE = 420;
const INICIO_SONO_HABITUAL = 1380;
const SONO_DIURNO = [480, 720];

function agendaNoturna(dia, perfil, frequencia, recuperar) {
  const ocorre = (indice) => indice >= 0 && (frequencia === 'semanal' ? indice % 7 === 0 : indice === 0);
  const anterior = ocorre(dia - 1), atual = ocorre(dia);
  const janelasSono = [];
  if (!anterior) janelasSono.push([INICIO_SONO_HABITUAL - MODULO_DIA, FIM_NOITE]);
  if (anterior && recuperar) janelasSono.push(SONO_DIURNO);
  if (!atual) janelasSono.push([INICIO_SONO_HABITUAL, MODULO_DIA + FIM_NOITE]);
  const atividadeNaHora = (min) => ((anterior && min < FIM_NOITE) || (atual && min >= perfil.noite.inicio))
    ? perfil.noite.atividade : '';
  return { janelasSono, atividadeNaHora };
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

function cardioDaAgenda(janelasSono, sessoes) {
  const basal = simularCardiovascular({ janelasSono });
  if (!sessoes.length) return basal;
  const series = sessoes.map((exercicio) => ({
    exercicio, pontos: simularCardiovascular({ janelasSono, exercicio }),
  }));
  return basal.map((p, min) => {
    let fc = p.fc, sis = p.sis, intensidadeAtiva = 0;
    for (const serie of series) {
      const q = serie.pontos[min];
      fc += q.calculo.deltaFC;
      sis += q.calculo.deltaPAS;
      if (q.emEsforco) intensidadeAtiva = serie.exercicio.intensidade / 100;
    }
    return { ...p, fc, sis, intensidadeAtiva, emEsforco: intensidadeAtiva > 0, pam: p.dia + (sis - p.dia) / 3 };
  });
}

function ajustarFCBasal(pontos, queda) {
  return pontos.map((p) => {
    const { deltaFC, fcMax, fcBasal } = p.calculo;
    const fracaoReservaUsada = fcMax ? deltaFC / (fcMax - fcBasal) : 0;
    return { ...p, fc: p.fc - queda * (1 - fracaoReservaUsada) };
  });
}

/** O mesmo horizonte compartilha o mesmo estado inicial, independentemente do número de dias exibido. */
export function simularTrajetoria(perfilId, dias, { detalharDia = -1, frequenciaNoturna = 'uma', sonoDiurno = false, eventos = null } = {}) {
  if (!Object.hasOwn(PERFIS_TRAJETORIA, perfilId) || !Number.isInteger(dias) || dias < 1 || dias > 365) throw new RangeError('Escolha um cenário e um horizonte de 1 a 365 dias.');
  const perfil = PERFIS_TRAJETORIA[perfilId];
  const agendaLivre = perfilId === 'personalizada' || perfil.agenda ? prepararAgenda(eventos ?? perfil.agenda ?? agendaInicial()) : null;
  const saida = [];
  const baseCardio = new Map();
  let agua = hidratar();
  let pressaoSono = 0.5, quedaFC = 0, sessoesAnteriores = agendaLivre?.sessoes ?? [], vigiliaMin = 0;
  let leitura = [];
  const saldosSono = [];
  let refeicoesAnteriores = agendaLivre?.refeicoes ?? REFEICOES;
  let sonoNaNoiteMin = 0;

  for (let dia = 0; dia < dias; dia++) {
    const { sono, sessao } = plano(dia, perfil);
    const agenda = perfil.noite ? agendaNoturna(dia, perfil, frequenciaNoturna, sonoDiurno) : null;
    const janelasSono = agendaLivre?.janelasSono ?? agenda?.janelasSono;
    const sessoes = agendaLivre?.sessoes ?? (sessao ? [sessao] : []);
    const cache = agendaLivre ? 'agenda' : JSON.stringify([sono, Boolean(sessao), janelasSono]);
    if (!baseCardio.has(cache)) baseCardio.set(cache, agendaLivre
      ? cardioDaAgenda(janelasSono, sessoes)
      : simularCardiovascular({ sono, exercicio: sessao, janelasSono }));
    // O ganho no fim do dia passa a valer na manhã seguinte.
    const cardio = ajustarFCBasal(baseCardio.get(cache), quedaFC);
    const cenario = CENARIOS_HIDRICOS[perfil.ambiente];
    // O cenário adia o evento de ingestão que cai no sono diurno até o horário de acordar.
    const primeiraVigilia = (min) => janelasSono?.find(([inicio, fim]) => min >= inicio && min < fim)?.[1] ?? min;
    const bebidas = agendaLivre?.bebidas ?? (agenda ? BEBIDAS_BASE.map(([min, a, s]) => [primeiraVigilia(min), a, s]) : BEBIDAS_BASE);
    const refeicoes = agendaLivre?.refeicoes ?? (agenda ? REFEICOES.map((m) => ({ ...m, hora: primeiraVigilia(m.hora * 60) / 60 })) : REFEICOES);
    const faseHidrica = simularHidratacao(cenario, { estado: agua, cardio, sessao, bebidas,
      guardarPontos: dia === detalharDia, regular: regularRim, reposicaoAposSessao: !agendaLivre, limitarDominio: perfilId === 'personalizada' });
    agua = faseHidrica.estado;
    let picoGlicemia = 0, mediaCortisol = 0, pressaoAoAcordar = 0;
    let sonoMin = 0, vigiliaMaxMin = 0, atividadeNoturnaMin = 0, sonoDiurnoMin = 0, trabalhoNoturnoMin = 0, noitesEmClaro = 0;
    for (let i = 0; i < PASSOS_DIA; i++) {
      const min = i * PASSO_INTEGRADO, hora = min / 60;
      if (min === FIM_NOITE) {
        pressaoAoAcordar = pressaoSono;
        noitesEmClaro = Number(dia > 0 && !sonoNaNoiteMin);
        sonoNaNoiteMin = 0;
      }
      const { dormindo } = cardio[min];
      const tipoAgenda = agendaLivre?.atividadeEm(min);
      const atividade = agenda?.atividadeNaHora(min) || TIPOS_AGENDA[tipoAgenda] || '';
      const madrugada = min < FIM_NOITE || min >= 1320;
      if (atividade && madrugada) atividadeNoturnaMin += PASSO_INTEGRADO;
      if ((tipoAgenda === 'trabalho' || atividade === 'Plantão') && madrugada) trabalhoNoturnoMin += PASSO_INTEGRADO;
      if (dormindo) {
        sonoMin += PASSO_INTEGRADO;
        if (min < FIM_NOITE || min >= INICIO_SONO_HABITUAL) sonoNaNoiteMin += PASSO_INTEGRADO;
        if (min >= 420 && min < 1320) sonoDiurnoMin += PASSO_INTEGRADO;
        vigiliaMin = 0;
      }
      const subida = refeicoes.reduce((soma, m, j) => soma + refeicao(hora, m, false)
        + refeicao(hora, refeicoesAnteriores[j], true), 0);
      const glicemia = P.glicemia.base.valor + Math.min(subida, P.glicemia.subidaMax.valor);
      const cortisol = cortisolBase(hora)
        + sessoes.reduce((soma, j) => soma + pulsoCortisol(hora, j, false), 0)
        + sessoesAnteriores.reduce((soma, j) => soma + pulsoCortisol(hora, j, true), 0);
      picoGlicemia = Math.max(picoGlicemia, glicemia);
      mediaCortisol += cortisol / PASSOS_DIA;
      if (dia === detalharDia) leitura.push({
        ...faseHidrica.pontos[i], glicemia, cortisol, pressaoSono, dormindo, atividade, vigiliaContinua: vigiliaMin / 60,
      });
      if (!dormindo) vigiliaMin += PASSO_INTEGRADO;
      if (perfilId === 'personalizada' && vigiliaMin > 48 * 60) {
        throw new RangeError('A agenda ultrapassa 48 h seguidas em vigília. Inclua sono ou escolha um horizonte menor.');
      }
      vigiliaMaxMin = Math.max(vigiliaMaxMin, vigiliaMin);
      pressaoSono = atualizaSono(pressaoSono, dormindo);
    }
    const horasSono = sonoMin / 60;
    saldosSono.push(24 - horasSono - P.dividaSono.vigiliaCriticaH.valor);
    const saldoSono7d = Math.max(0, saldosSono.slice(-7).reduce((a, b) => a + b, 0));
    saida.push({
      dia: dia + 1, horasSono, saldoSono7d, pressaoAoAcordar, quedaFC, picoGlicemia, mediaCortisol,
      vigiliaMaxH: vigiliaMaxMin / 60, atividadeNoturnaH: atividadeNoturnaMin / 60,
      sonoDiurnoH: sonoDiurnoMin / 60, trabalhoNoturnoH: trabalhoNoturnoMin / 60, noitesEmClaro,
      ureseL: faseHidrica.totais.urinaL, suorL: faseHidrica.totais.suorL, treinoMin: sessoes.reduce((soma, e) => soma + e.duracao, 0),
      ...faseHidrica.resumo,
    });
    refeicoesAnteriores = refeicoes;
    sessoesAnteriores = sessoes;
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
      vigiliaMaxH: Math.max(...trecho.map((p) => p.vigiliaMaxH)),
      atividadeNoturnaH: trecho.reduce((s, p) => s + p.atividadeNoturnaH, 0),
      sonoDiurnoH: media('sonoDiurnoH'), trabalhoNoturnoH: trecho.reduce((s, p) => s + p.trabalhoNoturnoH, 0),
      noitesEmClaro: trecho.reduce((s, p) => s + p.noitesEmClaro, 0),
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
