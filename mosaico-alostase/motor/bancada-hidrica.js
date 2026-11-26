import { simularCardiovascular } from './cardiovascular.js';
import { acoplarCirculacao, compartimentos, hidratar, passoHidrico } from './hidratacao.js?v=3';
import { INICIAL_TERMICO, passoTermico } from './termorregulacao.js';

export const PASSO_INTEGRADO = 5;
export const SESSAO = Object.freeze({ inicio: 17 * 60 + 30, duracao: 45, intensidade: 40 });
const SONO = Object.freeze([23 * 60, 7 * 60]);
export const BEBIDAS_BASE = Object.freeze([
  [450, 400, 300], [660, 350, 300], [780, 500, 770], [960, 350, 150], [1200, 500, 780],
]);
export const CENARIOS_HIDRICOS = Object.freeze({
  fresco: { nome: 'Exercício em ambiente fresco', temperatura: 21, umidade: 45, bebidaMl: 300, sodioMg: 0, bebidaDepoisMin: 0 },
  calor: { nome: 'Exercício no calor', temperatura: 34, umidade: 65, bebidaMl: 300, sodioMg: 0, bebidaDepoisMin: 0 },
  adiada: { nome: 'Água 60 min depois', temperatura: 34, umidade: 65, bebidaMl: 300, sodioMg: 0, bebidaDepoisMin: 60 },
  arSeco: { nome: 'Caminhada a 31 °C · umidade de 25%', temperatura: 31, umidade: 25, termico: true,
    bebidaMl: 300, sodioMg: 0, bebidaDepoisMin: 0 },
  arUmido: { nome: 'Caminhada a 31 °C · umidade de 75%', temperatura: 31, umidade: 75, termico: true,
    bebidaMl: 300, sodioMg: 0, bebidaDepoisMin: 0 },
  sodio: { nome: 'Bebida com sódio no calor', temperatura: 34, umidade: 65, bebidaMl: 300, sodioMg: 150, bebidaDepoisMin: 0 },
});

export function simularHidratacao(cenario, {
  estado = hidratar(), cardio = simularCardiovascular({ sono: SONO, exercicio: SESSAO }), sessao = SESSAO,
  bebidas = BEBIDAS_BASE, guardarPontos = true, estadoTermico = INICIAL_TERMICO, regular, reposicaoAposSessao = true, limitarDominio = false,
} = {}) {
  const pontos = [];
  const totais = { suorL: 0, urinaL: 0, perdaInsensivelL: 0, sodioSuorMg: 0, sodioUrinaMg: 0, aguaMl: 0, sodioMg: 0 };
  const agenda = new Map();
  let picoCentralC = estadoTermico.centralC, suorEvaporadoL = 0, calorSessaoKJ = 0;
  function agendar(min, agua, sodio) {
    const [a, s] = agenda.get(min) ?? [0, 0];
    agenda.set(min, [a + agua, s + sodio]);
  }
  for (const [min, agua, sodio] of bebidas) agendar(min, agua, sodio);
  if (sessao && reposicaoAposSessao) agendar(sessao.inicio + sessao.duracao + cenario.bebidaDepoisMin, cenario.bebidaMl, cenario.sodioMg);

  let maxFC = 0, minPlasma = Infinity, maxOsm = 0, somaPA = 0, somaFC = 0;
  for (let min = 0; min < 1440; min += PASSO_INTEGRADO) {
    const [aguaMl, sodioMg] = agenda.get(min) ?? [0, 0];
    const exercicio = cardio[min].emEsforco;
    const intensidade = exercicio ? cardio[min].intensidadeAtiva ?? (sessao.intensidade / 100) : 0;
    const comp = compartimentos(estado);
    if (limitarDominio && (comp.osmolalidade < 270 || comp.osmolalidade > 300 || comp.plasmaL < 2.5 || comp.plasmaL > 3.5)) {
      throw new RangeError('A rotina saiu do domínio hídrico desta simulação. Confira a ingestão e o esforço.');
    }
    const circulacao = acoplarCirculacao(cardio[min], comp.plasmaL, intensidade, estado.regulacao?.angII);
    const renal = regular?.(estado, comp, circulacao, PASSO_INTEGRADO);
    const recuperando = sessao && min >= sessao.inicio + sessao.duracao && min < sessao.inicio + sessao.duracao + 60;
    const clima = { temperatura: exercicio ? cenario.temperatura : (recuperando ? 24 : 22),
      umidade: exercicio ? cenario.umidade : 45, esforco: intensidade };
    const termo = cenario.termico ? passoTermico(estadoTermico, clima, PASSO_INTEGRADO) : null;
    if (termo) {
      estadoTermico = termo.estado;
      picoCentralC = Math.max(picoCentralC, estadoTermico.centralC);
      suorEvaporadoL += termo.suorEvaporadoL;
      if (exercicio) calorSessaoKJ += termo.detalhe.calorRetidoKJ;
    }
    const proximo = passoHidrico(estado, termo
      ? { aguaMl, sodioMg, suorL: termo.suorL }
      : { aguaMl, sodioMg, temperatura: exercicio ? cenario.temperatura : 22, umidade: cenario.umidade, esforco: intensidade },
    PASSO_INTEGRADO, renal);
    estado = proximo.estado;
    if (renal) estado.regulacao = renal.regulacao;
    totais.aguaMl += aguaMl;
    totais.sodioMg += sodioMg;
    for (const chave of ['suorL', 'urinaL', 'perdaInsensivelL', 'sodioSuorMg', 'sodioUrinaMg']) totais[chave] += proximo.fluxos[chave];
    maxFC = Math.max(maxFC, circulacao.fc);
    minPlasma = Math.min(minPlasma, comp.plasmaL);
    maxOsm = Math.max(maxOsm, comp.osmolalidade);
    somaPA += circulacao.pam;
    somaFC += circulacao.fc;
    if (guardarPontos) pontos.push({
      min, ...comp, ...circulacao, exercicio, entradaAguaMl: aguaMl, entradaSodioMg: sodioMg,
      suorMl: totais.suorL * 1000, urinaMl: totais.urinaL * 1000,
      ...proximo.fluxos, renal, ...(termo ? { termorregulacao: termo.detalhe } : {}),
    });
  }
  const fim = compartimentos(estado);
  return {
    estado, pontos, totais, estadoTermico,
    resumo: { ...fim, maxFC, minPlasma, maxOsm, pamMedia: somaPA / 288, fcMedia: somaFC / 288,
      ...(cenario.termico ? { picoCentralC, suorEvaporadoL, calorSessaoKJ } : {}) },
  };
}
