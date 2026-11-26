import { MINUTOS_DIA, simularCardiovascular } from './cardiovascular.js';
import { mediaMinutoDoPulso } from './pulso-despertar.js';
import { ajustarPressaoDaRotina, fracaoSonoForaDaFase, mediasPressao } from './pressao-desalinhamento.js?v=2';

export const JANELAS_SONO_PRESSAO = Object.freeze({ noturna: [1380, 420], diurna: [660, 1140] });
const DURACAO_JANELA_MIN = 480;
const MAX_DESPERTARES = 12;
const MAX_DURACAO_MIN = 10;
const modDia = (min) => (min + MINUTOS_DIA) % MINUTOS_DIA;

const ascensaoAcordadoMin = 1;
const retornoAoSonoMin = 3;

function resumo(pontos) {
  const janela = mediasPressao(pontos.map((p) => ({ ...p, dormindo: p.naJanela })));
  const sonoEfetivo = mediasPressao(pontos);
  const tempoAcordadoNaJanela = pontos.filter((p) => p.desperto).length;
  return {
    pas24h: janela.pas24h, pasVigilia: janela.pasVigilia, pasJanela: janela.pasSono,
    pasSono: sonoEfetivo.pasSono, pasVigiliaTotal: sonoEfetivo.pasVigilia,
    diferencaJanela: janela.pasVigilia - janela.pasSono,
    diferencaSono: sonoEfetivo.pasVigilia - sonoEfetivo.pasSono,
    quedaJanelaPct: janela.quedaPasPct, quedaSonoPct: sonoEfetivo.quedaPasPct,
    tempoAcordadoNaJanela, sonoEfetivoMin: DURACAO_JANELA_MIN - tempoAcordadoNaJanela,
  };
}

export function aplicarDespertaresPressao(curva, acordado, { inicio, duracaoJanela, despertares, duracaoMin }) {
  const pontos = curva.map((p) => ({ ...p, naJanela: p.dormindo, desperto: false, evento: false }));
  const eventos = Array.from({ length: despertares }, (_, i) =>
    Math.round(duracaoJanela * (i + 1) / (despertares + 1)));
  let proximo = 0, acordadoAte = 0, residuo = 0;
  for (let desdeInicio = 0; desdeInicio < duracaoJanela && despertares; desdeInicio++) {
    const p = pontos[modDia(inicio + desdeInicio)];
    const evento = desdeInicio === eventos[proximo];
    if (evento) {
      acordadoAte = desdeInicio + duracaoMin;
      proximo++;
    }
    const desperto = desdeInicio < acordadoAte;
    const alvo = Number(desperto), tau = desperto ? ascensaoAcordadoMin : retornoAoSonoMin;
    const fator = Math.exp(-1 / tau);
    const peso = alvo + (residuo - alvo) * tau * (1 - fator);
    residuo = alvo + (residuo - alvo) * fator;
    const v = acordado[p.min];
    p.sis += peso * (v.sis - p.sis) + (evento ? mediaMinutoDoPulso('sis') : 0);
    p.dia += peso * (v.dia - p.dia);
    p.fc += peso * (v.fc - p.fc) + (evento ? mediaMinutoDoPulso('fc') : 0);
    p.dormindo = !desperto;
    p.desperto = desperto;
    p.evento = evento;
  }
  return { pontos, minutosDespertares: eventos.map((m) => modDia(inicio + m)) };
}

export function vigiliaEquivalente(acordado, basal, curva) {
  const inicio = curva.findIndex((p) => !p.dormindo);
  const sis = curva[inicio].sis - basal[inicio].sis;
  const dia = curva[inicio].dia - basal[inicio].dia;
  return acordado.map((p) => ({ ...p, sis: p.sis + sis, dia: p.dia + dia }));
}

export function simularSonoPressao({ janela = 'noturna', despertares = 0, duracaoMin = 0, faseH = 0,
  comDesalinhamento = false } = {}) {
  if (!Object.hasOwn(JANELAS_SONO_PRESSAO, janela) || !Number.isInteger(despertares) || despertares < 0 || despertares > MAX_DESPERTARES
    || !Number.isInteger(duracaoMin) || duracaoMin < 0 || duracaoMin > MAX_DURACAO_MIN || !Number.isFinite(faseH)) {
    throw new RangeError('Escolha a janela e informe até 12 despertares de até 10 minutos.');
  }
  const sono = JANELAS_SONO_PRESSAO[janela];
  const [inicio] = sono;
  const basal = simularCardiovascular({ sono, faseInicialH: faseH });
  const fora = fracaoSonoForaDaFase(inicio, DURACAO_JANELA_MIN, () => faseH);
  const curva = comDesalinhamento ? ajustarPressaoDaRotina(basal, fora) : basal;
  const acordado = despertares ? vigiliaEquivalente(simularCardiovascular({ janelasSono: [], faseInicialH: faseH }), basal, curva) : null;
  const { pontos, minutosDespertares } = aplicarDespertaresPressao(curva, acordado, {
    inicio, duracaoJanela: DURACAO_JANELA_MIN, despertares, duracaoMin,
  });
  return { pontos, minutosDespertares, resumo: resumo(pontos) };
}

export function conferirMorris2016() {
  const alinhada = simularSonoPressao({ comDesalinhamento: true }).resumo;
  const invertida = simularSonoPressao({ janela: 'diurna', comDesalinhamento: true }).resumo;
  // Os 56 minutos a menos foram medidos por PSG. Sua distribuição em 8 períodos
  // é uma hipótese deste ensaio, não uma reconstrução dos despertares do estudo.
  const fragmentada = simularSonoPressao({
    janela: 'diurna', comDesalinhamento: true, despertares: 8, duracaoMin: 7,
  }).resumo;
  const residual = (chave, estudo) => ({ estudo, continuo: invertida[chave] - alinhada[chave],
    fragmentado: fragmentada[chave] - alinhada[chave] });
  const reducaoRelativa = (perfil) => 100 * (1 - perfil.quedaJanelaPct / alinhada.quedaJanelaPct);
  return [
    { nome: 'Sistólica em vigília', unidade: 'mmHg', ...residual('pasVigilia', 1.6) },
    { nome: 'Sistólica na janela de sono', unidade: 'mmHg', ...residual('pasJanela', 5.6) },
    { nome: 'Sistólica em 24 horas', unidade: 'mmHg', ...residual('pas24h', 3.0) },
    { nome: 'Redução relativa da queda sistólica', unidade: '%', estudo: 21,
      continuo: reducaoRelativa(invertida), fragmentado: reducaoRelativa(fragmentada) },
  ];
}
