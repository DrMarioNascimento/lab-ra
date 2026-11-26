import { simularCardiovascular } from './cardiovascular.js';
import { JANELAS_SONO_PRESSAO } from './sono-pressao.js?v=2';
import { DURACAO_PULSO_S, respostaPulsoDespertar } from './pulso-despertar.js';

export const FASE_ESTAVEL_S = 20 * 60;
// Figura 4: média da fase menos média pré-despertar em pontos percentuais da referência noturna.
// Duração média do despertar e picos sistólicos iniciais no texto de resultados.
export const CONDICOES_CARRINGTON = Object.freeze({
  controle: { nome: 'Controle', intervaloSonoS: 0, duracaoDespertarS: 0, observado: 0 },
  s120: { nome: 'Após 120 s de sono', intervaloSonoS: 120, duracaoDespertarS: 16, observado: 2.7, picoInicialEstudo: 22.37 },
  s60: { nome: 'Após 60 s de sono', intervaloSonoS: 60, duracaoDespertarS: 17, observado: 3.0, picoInicialEstudo: 20.02 },
  s30: { nome: 'Após 30 s de sono', intervaloSonoS: 30, duracaoDespertarS: 15, observado: 3.9, picoInicialEstudo: 17.17 },
});

const sono = JANELAS_SONO_PRESSAO.noturna;
const [inicioSono] = sono;
const basal = simularCardiovascular({ sono });
const sisEstavel = basal[(inicioSono + 60) % 1440].sis;
const mediaAproximadaDaNoite = (condicao) => {
  const ciclo = condicao.intervaloSonoS + condicao.duracaoDespertarS;
  let soma = 0;
  // O artigo normaliza pela média da sessão; aproximação com 30 min antes e 90 min após o início do sono.
  for (let s = -30 * 60; s < 90 * 60; s++) {
    const min = (inicioSono + Math.floor(s / 60) + 1440) % 1440;
    const pulso = ciclo && s >= condicao.intervaloSonoS
      ? respostaPulsoDespertar('sis', (s - condicao.intervaloSonoS) % ciclo + 0.5) : 0;
    soma += basal[min].sis + pulso;
  }
  return soma / (120 * 60);
};

export function simularCarrington(condicaoId) {
  if (!Object.hasOwn(CONDICOES_CARRINGTON, condicaoId)) throw new RangeError('Escolha uma das condições do estudo.');
  const condicao = CONDICOES_CARRINGTON[condicaoId];
  const ciclo = condicao.intervaloSonoS + condicao.duracaoDespertarS;
  const pontos = Array.from({ length: FASE_ESTAVEL_S }, (_, s) => {
    const desdeDespertar = ciclo && s >= condicao.intervaloSonoS ? (s - condicao.intervaloSonoS) % ciclo : -1;
    const pulso = respostaPulsoDespertar('sis', desdeDespertar + 0.5);
    return { s, sis: sisEstavel + pulso, pulso, emAtivacao: desdeDespertar >= 0 && desdeDespertar < DURACAO_PULSO_S };
  });
  const sisMedia = pontos.reduce((soma, p) => soma + p.sis, 0) / pontos.length;
  const acrescimoPct = 100 * (sisMedia - sisEstavel) / mediaAproximadaDaNoite(condicao);
  return { pontos, sisMedia, sisEstavel, acrescimoPct, condicao };
}
