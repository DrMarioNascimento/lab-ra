// Bancada de 24 h. As rotinas dos outros modos continuam usando seus próprios motores.
import { formaRelogio, pesoSono, pressaoArterial } from './hemodinamica.js?v=2';
import { P } from './parametros.js';
import { fracaoReservaVO2, frequenciaNoEsforco } from './treino.js';

export const MINUTOS_DIA = 1440;
export const MODELO_CARDIO = {
  // Degaute 1991: cerca de metade da queda noturna da FC acompanha sono e postura.
  pesoSonoFC: 0.5,
  // Diretriz Brasileira de Ergometria, 2024. Referência de teste dinâmico até 10 MET.
  pasPorMET: 10,
  // Constantes didáticas que aproximam a estabilização e recuperação, em minutos.
  tauEsforco: 0.8,
  tauRecuperacaoFC: 1.5,
  tauRecuperacaoPAS: 2,
};

const moduloDia = (min) => (min % MINUTOS_DIA + MINUTOS_DIA) % MINUTOS_DIA;
const horaInteiraValida = (min) => Number.isInteger(min) && min >= 0 && min < MINUTOS_DIA;
const arredondar = (valor) => Math.round(valor * 10) / 10;

function estaDormindo(min, [inicio, fim]) {
  return moduloDia(min - inicio) < moduloDia(fim - inicio);
}

function emJanela(min, janelasSono) {
  return janelasSono.find(([inicio, fim]) => min >= inicio && min < fim);
}

export function conferirCardiovascular({ sono, exercicio, janelasSono }) {
  const duracaoSono = sono ? moduloDia(sono[1] - sono[0]) : 0;
  if (janelasSono !== undefined && (!Array.isArray(janelasSono) || janelasSono.some((janela) => {
    if (!Array.isArray(janela) || janela.length !== 2 || !janela.every(Number.isInteger)) return true;
    const [inicio, fim] = janela;
    return inicio >= fim || fim <= 0 || inicio >= MINUTOS_DIA;
  }))) return 'Os intervalos de sono precisam cruzar ou ocorrer no dia calculado.';
  if (janelasSono === undefined && (!sono || sono.length !== 2 || !sono.every(horaInteiraValida) || duracaoSono < 180 || duracaoSono > 720)) {
    return 'Escolha entre 3 e 12 horas de sono.';
  }
  if (!exercicio) return '';
  const { inicio, duracao, intensidade } = exercicio;
  if (!horaInteiraValida(inicio) || ![15, 30, 45].includes(duracao) || ![30, 40, 60].includes(intensidade)) {
    return 'Escolha um horário, uma duração e uma intensidade disponíveis.';
  }
  // Intervalos semiabertos: é possível começar a caminhar no minuto em que o sono termina.
  for (let min = inicio; min < inicio + duracao; min++) {
    if (janelasSono ? emJanela(min, janelasSono) : estaDormindo(min, sono)) return 'A sessão de exercício coincide com o sono.';
  }
  return '';
}

function respostaAoExercicio(idadeSessao, duracao, tauRecuperacao) {
  const entrada = 1 - Math.exp(-Math.min(idadeSessao, duracao) / MODELO_CARDIO.tauEsforco);
  return entrada * Math.exp(-Math.max(0, idadeSessao - duracao) / tauRecuperacao);
}

export function simularCardiovascular(rotina) {
  const erro = conferirCardiovascular(rotina);
  if (erro) throw new RangeError(erro);

  const { sono, exercicio, janelasSono } = rotina;
  const blocosSono = janelasSono ? [] : [{ inicio: sono[0] / 60, fim: sono[1] / 60 }];
  const rampaSonoMin = P.pressaoArterial.rampaSonoH.valor * 60;
  const { perfilPadrao, repousoDiurno, repousoNoturno, vo2Repouso } = P.treino;
  const idade = perfilPadrao.idade;
  const vo2max = perfilPadrao.vo2max;
  const quedaFC = repousoDiurno.valor - repousoNoturno.valor;
  const fracVO2 = exercicio ? exercicio.intensidade / 100 : 0;
  const fracReserva = fracaoReservaVO2(fracVO2, vo2max);
  const mets = fracVO2 * vo2max / vo2Repouso.valor;
  const deltaAlvoPAS = Math.max(0, Math.min(10, mets) - 1) * MODELO_CARDIO.pasPorMET;

  const pontos = Array.from({ length: MINUTOS_DIA }, (_, min) => {
    const hora = min / 60;
    const janela = janelasSono && emJanela(min, janelasSono);
    const dormindo = janelasSono ? Boolean(janela) : estaDormindo(min, sono);
    const peso = janelasSono
      ? (janela ? Math.min(1, (min - janela[0]) / rampaSonoMin, (janela[1] - min) / rampaSonoMin) : 0)
      : pesoSono(hora, blocosSono);
    const relogio = formaRelogio(hora);
    const quedaSonoFC = quedaFC * MODELO_CARDIO.pesoSonoFC * peso;
    const quedaRelogioFC = quedaFC * (1 - MODELO_CARDIO.pesoSonoFC) * relogio;
    const fcBasal = repousoDiurno.valor - quedaSonoFC - quedaRelogioFC;
    const paBasal = pressaoArterial(hora, blocosSono, { pesoSono: peso });
    const decorrido = exercicio ? moduloDia(min - exercicio.inicio) : 0;
    const emEsforco = !!exercicio && decorrido < exercicio.duracao;
    const emRecuperacao = !!exercicio && !emEsforco && decorrido < exercicio.duracao + 10;
    const alvoFC = exercicio ? frequenciaNoEsforco({
      idade, grupo: perfilPadrao.grupo, fcRepouso: fcBasal, fracReserva,
    }) : null;
    const deltaFC = exercicio
      ? (alvoFC.valor - fcBasal) * respostaAoExercicio(decorrido, exercicio.duracao, MODELO_CARDIO.tauRecuperacaoFC)
      : 0;
    const deltaPAS = exercicio
      ? deltaAlvoPAS * respostaAoExercicio(decorrido, exercicio.duracao, MODELO_CARDIO.tauRecuperacaoPAS)
      : 0;
    const sis = paBasal.sis + deltaPAS;
    const dia = paBasal.dia;
    return {
      min, dormindo, emEsforco, emRecuperacao,
      fc: arredondar(fcBasal + deltaFC), sis: arredondar(sis), dia,
      pam: arredondar(dia + (sis - dia) / 3),
      // Instantes de uma MAPA simulada. As médias usam toda a série de 1 minuto.
      amostraMAPA: min % (dormindo ? 30 : 20) === 0,
      calculo: {
        peso, relogio, quedaSonoFC, quedaRelogioFC, fcBasal, deltaFC, paBasal,
        deltaPAS, deltaAlvoPAS, alvoFC: alvoFC?.valor, fcMax: alvoFC?.fcMax,
        mets, fracReserva, decorrido,
      },
    };
  });
  return pontos;
}

export function resumirCardiovascular(pontos) {
  const medias = (periodo) => Object.fromEntries(['sis', 'dia', 'fc'].map((chave) => [
    chave, arredondar(periodo.reduce((total, ponto) => total + ponto[chave], 0) / periodo.length),
  ]));
  return {
    dia: medias(pontos),
    vigilia: medias(pontos.filter((ponto) => !ponto.dormindo)),
    sono: medias(pontos.filter((ponto) => ponto.dormindo)),
  };
}
