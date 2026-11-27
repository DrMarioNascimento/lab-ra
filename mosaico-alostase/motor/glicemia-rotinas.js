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
const NOITE_REF = 6 * 60;
const FATOR_RECUPERACAO = 0.5; // Hipótese didática: meia-vida de um dia.
const CAFE = 390;
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
const cafeEm = ({ vigilia, alimentacao }) =>
  (tabela3[0].media * vigilia + (tabela3[30].media - tabela3[0].media) * alimentacao) / (NOITES_PROTOCOLO - 1);
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

function atualizarEstado(estado, plano) {
  let minutosAcordado = 0;
  for (let hora = 0; hora < NOITE_REF; hora += PASSO_MIN) {
    if (!horaEm(local(hora), plano.sono)) minutosAcordado += PASSO_MIN;
  }
  const exposicao = minutosAcordado / NOITE_REF;
  const retencao = FATOR_RECUPERACAO ** (1 - exposicao);
  return {
    vigilia: Math.min(NOITES_PROTOCOLO, estado.vigilia * retencao + exposicao),
    alimentacao: Math.min(NOITES_PROTOCOLO, estado.alimentacao * retencao + plano.energiaMadrugada / 30),
  };
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
  let estado = { vigilia: 0, alimentacao: 0 };
  let referencia;
  let pressaoSono = 0.5;
  const dias = Array.from({ length: horizonte }, (_, dia) => {
    const plano = agenda(rotina, dia, horizonte, porcao, horasSono);
    estado = atualizarEstado(estado, plano);
    referencia ??= cafeEm(estado);
    const pressao = pressaoSonoNaJanela(pressaoSono, plano.sono);
    pressaoSono = pressao.final;
    return { ...plano, estado, pressaoSonoNoCafe: pressao.noCafe, deltaCafe: cafeEm(estado) - referencia,
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
