import { efeitoRefeicaoGlicemia } from './motor.js';
import { P } from './parametros.js';
import { CONDICOES_REFEICAO, NOITES_PROTOCOLO } from './refeicoes-plantao.js';

export const JANELA_MIN = 1440;
export const INICIO_MIN = 17 * 60;
export const PASSO_MIN = 5;
export const HORIZONTES = [5, 7, 28];
export const ROTINAS = Object.freeze({
  trabalhoDia: { nome: 'Trabalho diurno', atividade: 'Trabalho', escala: 'dia' },
  lazerDia: { nome: 'Lazer diurno', atividade: 'Lazer', escala: 'dia' },
  trabalhoNoite: { nome: 'Trabalho noturno fixo', atividade: 'Trabalho', escala: 'noite' },
  lazerNoite: { nome: 'Lazer de madrugada', atividade: 'Lazer', escala: 'noite' },
  alternada: { nome: 'Trabalho em escala alternada', atividade: 'Trabalho', escala: 'alternada' },
});

const CARBO_DIA_G = 200;
export const FIM_MADRUGADA_GLICEMIA = 6 * 60;
export const MEIA_VIDA_GLICEMIA_H = 24; // Hipótese didática.
const FATOR_RECUPERACAO = 0.5;
export const HORA_CAFE_GLICEMIA = 390;
const CAFE = HORA_CAFE_GLICEMIA;
const CAFE_PCT = 30;
const tabela3 = {
  0: { media: 0.63, ic: [0.25, 1.02] },
  10: { media: 0.81, ic: [0.41, 1.22] },
  30: { media: 1.45, ic: [1.03, 1.87] },
};
const tabela2 = { 0: CONDICOES_REFEICAO.semRefeicao, 10: CONDICOES_REFEICAO.lanche, 30: CONDICOES_REFEICAO.refeicao };
export const PORCOES = [0, 10, 30];

const local = (relogio) => (relogio - INICIO_MIN + JANELA_MIN) % JANELA_MIN;
const intervalo = (inicio, fim) => [local(inicio), local(fim) || JANELA_MIN];
const horaEm = (min, [inicio, fim]) => min >= inicio && min < fim;
const ogttEm = ({ vigilia, alimentacao }) =>
  (tabela2[0].observado * vigilia + (tabela2[30].observado - tabela2[0].observado) * alimentacao)
    / (NOITES_PROTOCOLO * FATOR_RECUPERACAO);

function agenda(rotina, dia, horizonte, porcao, horasSono) {
  const recuperacao = dia === NOITES_PROTOCOLO && horizonte === 5;
  const noturna = !recuperacao && (rotina.escala === 'noite' || (rotina.escala === 'alternada' && dia % 7 < 4));
  const atividade = recuperacao ? null : noturna ? intervalo(0, 360) : intervalo(600, 960);
  const fimSono = noturna ? 990 : 360;
  const sono = intervalo(fimSono - (recuperacao ? 8 : horasSono) * 60, fimSono);
  const energiaMadrugada = noturna ? porcao : 0;
  // A mesma porção sai da refeição das 19h. O café e o total em 24 h permanecem iguais.
  const refeicoes = [[1020, 30], [1140, 40 - energiaMadrugada], [30, energiaMadrugada], [CAFE, CAFE_PCT]]
    .filter(([, pct]) => pct > 0)
    .map(([hora, pct]) => ({ hora, pct, min: local(hora), carboG: CARBO_DIA_G * pct / 100 }));
  return { noturna, recuperacao, atividade, sono, refeicoes, energiaMadrugada };
}

export const ESTADO_GLICEMICO_INICIAL = Object.freeze({ vigilia: 0, alimentacao: 0 });

export function retencaoGlicemiaAcumulada(minutosAcordado, meiaVidaH = MEIA_VIDA_GLICEMIA_H) {
  return FATOR_RECUPERACAO ** ((MEIA_VIDA_GLICEMIA_H / meiaVidaH) * (1 - minutosAcordado / FIM_MADRUGADA_GLICEMIA));
}

export function passoGlicemiaAcumulada(estado, minutosAcordado, fracaoCarboMadrugada, meiaVidaH = MEIA_VIDA_GLICEMIA_H) {
  const exposicao = minutosAcordado / FIM_MADRUGADA_GLICEMIA;
  const retencao = retencaoGlicemiaAcumulada(minutosAcordado, meiaVidaH);
  const exposicaoAlimentar = Math.min(1, fracaoCarboMadrugada / 0.30);
  return {
    vigilia: Math.min(NOITES_PROTOCOLO, estado.vigilia * retencao + exposicao),
    alimentacao: Math.min(NOITES_PROTOCOLO, estado.alimentacao * retencao + exposicaoAlimentar),
  };
}

function termosCafe({ vigilia, alimentacao }) {
  return {
    vigilia: tabela3[0].media * vigilia,
    alimentacao: (tabela3[30].media - tabela3[0].media) * alimentacao,
  };
}

export function parcelasAucCafe(estado) {
  const { vigilia, alimentacao } = termosCafe(estado);
  return { vigilia: vigilia / (NOITES_PROTOCOLO - 1), alimentacao: alimentacao / (NOITES_PROTOCOLO - 1) };
}

export function aucCafeEstimado(estado) {
  const { vigilia, alimentacao } = termosCafe(estado);
  return (vigilia + alimentacao) / (NOITES_PROTOCOLO - 1);
}

function atualizarEstado(estado, plano) {
  let minutosAcordado = 0;
  for (let hora = 0; hora < FIM_MADRUGADA_GLICEMIA; hora += PASSO_MIN) {
    if (!horaEm(local(hora), plano.sono)) minutosAcordado += PASSO_MIN;
  }
  return passoGlicemiaAcumulada(estado, minutosAcordado, plano.energiaMadrugada / 100);
}

function pressaoSonoNaJanela(pressao, sono) {
  const { tauQuedaH, tauSubidaH } = P.pressaoSono;
  const acordado = (h) => 1 - (1 - pressao) * Math.exp(-h / tauSubidaH.valor);
  const dormindo = (h) => pressao * Math.exp(-h / tauQuedaH.valor);
  const [inicio, fim] = sono;
  const cafe = local(CAFE);
  pressao = acordado(Math.min(inicio, cafe) / 60);
  if (inicio < cafe) pressao = dormindo((Math.min(fim, cafe) - inicio) / 60);
  if (fim < cafe) pressao = acordado((cafe - fim) / 60);
  const noCafe = pressao;
  if (cafe < inicio) pressao = acordado((inicio - cafe) / 60);
  if (cafe < fim) pressao = dormindo((fim - Math.max(inicio, cafe)) / 60);
  pressao = acordado((JANELA_MIN - Math.max(fim, cafe)) / 60);
  return { noCafe, final: pressao };
}

export function simularGlicemiaRotina(id, horizonte, porcao, horasSono = 8) {
  if (!Object.hasOwn(ROTINAS, id) || !HORIZONTES.includes(horizonte)
    || !PORCOES.includes(porcao) || ![6, 8].includes(horasSono)) {
    throw new RangeError('Confira a rotina, o horizonte, a porção e o horário de sono.');
  }
  const rotina = ROTINAS[id];
  let estado = ESTADO_GLICEMICO_INICIAL;
  let referencia;
  let pressaoSono = 0.5;
  const dias = Array.from({ length: horizonte }, (_, dia) => {
    const plano = agenda(rotina, dia, horizonte, porcao, horasSono);
    estado = atualizarEstado(estado, plano);
    referencia ??= aucCafeEstimado(estado);
    const pressao = pressaoSonoNaJanela(pressaoSono, plano.sono);
    pressaoSono = pressao.final;
    return { ...plano, estado, pressaoSonoNoCafe: pressao.noCafe, deltaCafe: aucCafeEstimado(estado) - referencia,
      deltaOgtt: plano.recuperacao && rotina.escala !== 'dia' && horasSono === 8 ? ogttEm(estado) : null,
      rotuloAtividade: plano.atividade ? rotina.atividade : 'Recuperação' };
  });
  return { nome: rotina.nome, dias };
}

export function curvaGlicemiaDia({ dias }, indice) {
  const dia = dias[indice];
  const anterior = dias[indice - 1];
  const refeicoes = [...dia.refeicoes];
  if (anterior) refeicoes.push(...anterior.refeicoes.map((r) => ({ ...r, min: r.min - JANELA_MIN })));
  const g = P.glicemia;
  return Array.from({ length: JANELA_MIN / PASSO_MIN + 1 }, (_, i) => {
    const min = i * PASSO_MIN;
    const subida = refeicoes.reduce((total, r) => total + efeitoRefeicaoGlicemia(r, min - r.min), 0);
    return g.base.valor + Math.min(subida, g.subidaMax.valor);
  });
}

export function conferirGlicemiaRotinas() {
  return PORCOES.map((porcao) => {
    const { dias } = simularGlicemiaRotina('trabalhoNoite', 5, porcao);
    return {
      porcao, calibrado: porcao !== 10,
      cafe: { ...tabela3[porcao], modelo: dias[3].deltaCafe },
      ogtt: { media: tabela2[porcao].observado, ic: tabela2[porcao].ic, modelo: dias[4].deltaOgtt },
    };
  });
}

/** A semana editável replica os cinco dias da bancada e inclui duas rotinas diurnas. */
export function agendaCompararLanche(porcao) {
  if (!PORCOES.includes(porcao)) throw new RangeError('Escolha uma porção da bancada.');
  return montarAgendaSemanal((dia) => agenda(dia < 5 ? ROTINAS.trabalhoNoite : ROTINAS.trabalhoDia, dia, 5, porcao, 8));
}

export function agendaEscalaGlicemica(distribuida) {
  const noites = distribuida ? [0, 1, 3, 5] : [0, 1, 2, 3];
  return montarAgendaSemanal((dia) => {
    const plano = agenda(noites.includes(dia) ? ROTINAS.trabalhoNoite : ROTINAS.trabalhoDia, dia, 7, 10, 8);
    return [4, 6].includes(dia) ? { ...plano, atividade: null } : plano;
  });
}

function montarAgendaSemanal(planoDoDia) {
  const eventos = new Map();
  function adicionar(dia, min, dados) {
    const absoluto = (dia - 1) * JANELA_MIN + INICIO_MIN + min;
    const diaSemana = (Math.floor(absoluto / JANELA_MIN) + 7) % 7;
    const inicio = (absoluto + JANELA_MIN) % JANELA_MIN;
    const evento = { ...dados, inicio };
    const chave = JSON.stringify(evento);
    if (!eventos.has(chave)) eventos.set(chave, { ...evento, dias: [] });
    eventos.get(chave).dias.push(diaSemana);
  }
  for (let dia = 0; dia < 7; dia++) {
    const plano = planoDoDia(dia);
    for (const [tipo, faixa] of [['dormir', plano.sono], ['trabalho', plano.atividade]]) {
      if (faixa) adicionar(dia, faixa[0], { tipo, fim: (INICIO_MIN + faixa[1]) % JANELA_MIN });
    }
    for (const r of plano.refeicoes) adicionar(dia, r.min, { tipo: 'refeicao', carboG: r.carboG });
  }
  const bebidas = [[390, 450, 300], [1005, 450, 300], [1020, 350, 600], [1140, 500, 550], [1260, 450, 550]]
    .map(([inicio, aguaMl, sodioMg]) => ({ tipo: 'bebida', inicio, aguaMl, sodioMg }));
  return [...eventos.values(), ...bebidas];
}
