import { MINUTOS_DIA, simularCardiovascular } from './cardiovascular.js';

const SONO_CONTROLE = [22 * 60, 7 * 60];
const SONO_RESTRITO = [30, 4 * 60 + 30];
const INICIO_RESTRICAO = 5;
const FIM_RESTRICAO = 13;
const FIM_PROTOCOLO = 16;
const DIA_AJUSTE = 12;
const MEIA_VIDA_EXPOSICAO_DIAS = 2;
export const MEIAS_VIDAS_RECUPERACAO = [1, 2, 4];
export const METRICAS_RESTRICAO = Object.freeze({
  pas24h: 'Sistólica de 24 horas',
  pasSono: 'Sistólica no sono comparável',
  pasVigilia: 'Sistólica na vigília comparável',
});
// Diferenças ajustadas restrição − controle. Covassin et al., tabela 2, figura 2 e texto de resultados.
export const REFERENCIAS_RESTRICAO = Object.freeze({
  pas24h: [
    { dia: 6, valor: 4.2, ic: [2.1, 6.4] },
    { dia: 9, valor: 4.2, ic: [2.0, 6.3] },
    { dia: 12, valor: 3.1, ic: [0.9, 5.3] },
    { dia: 15, valor: 1.2, ic: [-1.0, 3.3] },
  ],
  pasSono: [
    { dia: 12, valor: 3.9, ic: [0.8, 6.9], ajuste: true },
    { dia: 15, valor: 3.3, ic: [0.3, 6.3] },
  ],
  pasVigilia: [],
});

const curvaControle = simularCardiovascular({ sono: SONO_CONTROLE });
const curvaRestrita = simularCardiovascular({ sono: SONO_RESTRITO });
const media = (pontos, campo, inicio = 0, fim = MINUTOS_DIA) => {
  let soma = 0;
  for (let min = inicio; min < fim; min++) soma += campo(pontos[min]);
  return soma / (fim - inicio);
};
const pesoSonoComparavel = media(curvaRestrita, (p) => p.calculo.peso, ...SONO_RESTRITO);
const cargaAjuste = 1 - 2 ** (-(DIA_AJUSTE - INICIO_RESTRICAO + 1) / MEIA_VIDA_EXPOSICAO_DIAS);
const alvo = REFERENCIAS_RESTRICAO.pasSono.find(({ ajuste }) => ajuste).valor;
const deltaAgenda = media(curvaRestrita, (p) => p.sis, ...SONO_RESTRITO)
  - media(curvaControle, (p) => p.sis, ...SONO_RESTRITO);
const ganho = (alvo - deltaAgenda) / (pesoSonoComparavel * cargaAjuste);

// Usa o ganho já calibrado em Covassin, inclusive em outros protocolos.
export function proximaCargaRestricao(carga, duracaoSonoMin, meiaVidaRecuperacao = 2, referenciaSonoMin = 540) {
  const alvoCarga = Math.max(0, Math.min(1, (referenciaSonoMin - duracaoSonoMin) / (referenciaSonoMin - 240)));
  const meiaVida = alvoCarga > 0 ? MEIA_VIDA_EXPOSICAO_DIAS : meiaVidaRecuperacao;
  return alvoCarga + (carga - alvoCarga) * 2 ** (-1 / meiaVida);
}

export function aplicarCargaRestricao(curva, carga) {
  return curva.map((p) => ({ ...p, sis: p.sis + ganho * carga * p.calculo.peso }));
}

function resumo(curva) {
  const pas = (p) => p.sis;
  return {
    pas24h: media(curva, pas),
    pasSono: media(curva, pas, ...SONO_RESTRITO),
    pasVigilia: media(curva, pas, SONO_CONTROLE[1], SONO_CONTROLE[0]),
  };
}
const controle = resumo(curvaControle);
const delta = (res) => Object.fromEntries(Object.entries(res).map(([key, valor]) => [key, valor - controle[key]]));

export function simularRestricaoSono({ meiaVidaRecuperacao = 2 } = {}) {
  if (!MEIAS_VIDAS_RECUPERACAO.includes(meiaVidaRecuperacao)) throw new RangeError('Escolha uma meia-vida de recuperação disponível.');
  const dias = [];
  let carga = 0;
  for (let dia = 1; dia <= FIM_PROTOCOLO; dia++) {
    const restrito = dia >= INICIO_RESTRICAO && dia <= FIM_RESTRICAO;
    carga = proximaCargaRestricao(carga, restrito ? 240 : 540, meiaVidaRecuperacao);
    const basal = restrito ? curvaRestrita : curvaControle;
    const curva = aplicarCargaRestricao(basal, carga);
    dias.push({
      dia, fase: dia < INICIO_RESTRICAO ? 'Adaptação' : restrito ? 'Restrição' : 'Recuperação',
      janela: restrito ? SONO_RESTRITO : SONO_CONTROLE, controle, agenda: delta(resumo(basal)),
      comEfeito: delta(resumo(curva)), carga,
    });
  }
  return dias;
}
