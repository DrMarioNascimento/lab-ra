import { aplicarCargaRestricao, proximaCargaRestricao } from './restricao-sono.js?v=2';
import { aplicarDespertaresPressao, vigiliaEquivalente } from './sono-pressao.js?v=2';
import { INICIAL_ACLIMATACAO, atualizarAclimatacao } from './aclimatacao.js?v=2';
import { calcularIntervaloCalor } from './calor-integrado.js?v=3';
import { simularCardiovascular } from './cardiovascular.js';
import { faseNoMinuto, passoFaseCircadiana } from './fase-circadiana.js';
import { P } from './parametros.js';
import { ajustarPressaoDaRotina, atualizarCargaSono, desafioSonoPersistente, fracaoSonoForaDaFase, mediasPressao, variabilidadeInicioSono } from './pressao-desalinhamento.js?v=2';
import { ambienteTurnoCalor, FIM_TURNO_MIN, respostaCardioTurno, TURNOS_CALOR } from './turno-calor.js?v=3';

export const ESCALAS_CALOR = Object.freeze({ diurna: 'Diurna fixa', noturna: 'Noturna fixa', alternada: 'Alternada' });
export const DIAS_ESCALA_CALOR = 28;
export const PASSO_LEITURA_MIN = 15;
const DIA = 1440;
const ORIGEM = 8 * 60;
const DURACAO_SONO_H = 8;
const INICIO_SONO_DIURNO = 23 * 60 - ORIGEM;
const DESCONTO_TURNO_CURTO_H = 2;
export const horaCivilDaEscala = (min) => (min + ORIGEM) % DIA;

export function planoEscalaCalor(escala, indice, encurtarSonoNoturno = false) {
  const semana = Math.floor(indice / 7);
  const diaNaSemana = indice % 7;
  const folga = diaNaSemana >= 5;
  const noturno = escala === 'noturna' || (escala === 'alternada' && semana % 2 === 1);
  let inicioSono = noturno ? 0 : INICIO_SONO_DIURNO;
  if (escala === 'alternada' && folga) {
    // Antecipa/atrasa o sono em duas folgas entre blocos. Cada dia conserva um único episódio.
    inicioSono = (noturno ? diaNaSemana - 4 : 7 - diaNaSemana) * 300;
  }
  const sonoH = DURACAO_SONO_H - (encurtarSonoNoturno && noturno && !folga ? DESCONTO_TURNO_CURTO_H : 0);
  const duracaoSono = sonoH * 60;
  const inicioTrabalho = folga ? null : (noturno ? 22 : 14) * 60 - ORIGEM;
  return { inicioSono, duracaoSono, inicioTrabalho, tipo: folga ? 'Folga' : noturno ? 'Noturno' : 'Diurno' };
}

function bebidasDoDia({ inicioSono, duracaoSono, inicioTrabalho }) {
  if (inicioTrabalho !== null) {
    const base = [-360, -180, -60, 300, 420].map((offset) => [inicioTrabalho + offset, 440, 480]);
    return [...base, ...TURNOS_CALOR.pausas.bebidas.map(([min, ml]) => [inicioTrabalho + min, ml, 0])];
  }
  const vigiliaMin = DIA - duracaoSono;
  return [0.10, 0.30, 0.50, 0.70, 0.90].map((p) => {
    const min = Math.floor(p * vigiliaMin);
    return [min < inicioSono ? min : min + duracaoSono, 440, 480];
  });
}

function sonoCivil(inicio, duracao) {
  const min = horaCivilDaEscala(inicio);
  return [[min, Math.min(min + duracao, DIA)], ...(min + duracao > DIA ? [[0, min + duracao - DIA]] : [])];
}

export const DURACAO_DESPERTAR_ESCALA_MIN = 5;
export function simularEscalaCalor(escala, { dias = DIAS_ESCALA_CALOR, encurtarSonoNoturno = false, despertares = 0, noitesRecuperacao = null } = {}) {
  if (!Object.hasOwn(ESCALAS_CALOR, escala) || !Number.isInteger(dias) || dias < 1 || dias > DIAS_ESCALA_CALOR) {
    throw new RangeError('Informe uma escala e um horizonte entre 1 e 28 dias.');
  }
  if (!Number.isInteger(despertares) || despertares < 0 || despertares > 12) {
    throw new RangeError('Escolha até 12 despertares por janela de sono.');
  }
  if (![null, 1, 2].includes(noitesRecuperacao)) throw new RangeError('Escolha uma ou duas noites de recuperação.');
  const resultado = [];
  let cargaRestricao = 0;
  let estado, faseH = 0, aclimatacao = INICIAL_ACLIMATACAO, pressaoSono = 0.5, vigiliaMin = 0;
  const saldos = [];
  const iniciosSono = [];
  let cargaSono = 0;
  const fatorSono = Math.exp(-1 / (60 * P.pressaoSono.tauQuedaH.valor));
  const fatorVigilia = Math.exp(-1 / (60 * P.pressaoSono.tauSubidaH.valor));
  for (let indice = 0; indice < dias; indice++) {
    const planoBase = planoEscalaCalor(escala, indice, noitesRecuperacao === null && encurtarSonoNoturno);
    // Dias 3–5: 6 h nos dois cenários. Primeira folga: 8 h em ambos.
    // Segunda folga: 6 h no cenário de uma noite de recuperação, 8 h no outro.
    const diaSemana = indice % 7;
    const curto = noitesRecuperacao !== null && ((diaSemana >= 2 && diaSemana <= 4)
      || (diaSemana === 6 && noitesRecuperacao === 1));
    const fimSonoBase = planoBase.inicioSono + planoBase.duracaoSono;
    const plano = curto ? { ...planoBase, inicioSono: fimSonoBase - 360, duracaoSono: 360 } : planoBase;
    const { inicioSono, duracaoSono, inicioTrabalho } = plano;
    const fimSono = inicioSono + duracaoSono;
    const naJanela = (min) => min >= inicioSono && min < fimSono;
    const faseFinal = passoFaseCircadiana(faseH, sonoCivil(planoBase.inicioSono, planoBase.duracaoSono), true);
    const faseEm = (min) => faseNoMinuto(faseH, faseFinal, min);
    const foraDaFase = fracaoSonoForaDaFase(ORIGEM + inicioSono, duracaoSono, (min) => faseEm(min - ORIGEM));
    // A bancada usa a rampa de sono com o bloco inteiro, inclusive quando cruza a meia-noite.
    const sono = [horaCivilDaEscala(inicioSono), horaCivilDaEscala(fimSono)];
    const fasePorHorario = Array.from({ length: DIA + 1 }, (_, min) => faseEm((min + DIA - ORIGEM) % DIA));
    const perfilFase = { passoMin: 1, pontos: fasePorHorario };
    const repouso = simularCardiovascular({ sono, perfilFase });
    const pressaoAjustada = ajustarPressaoDaRotina(repouso, foraDaFase, cargaSono);
    if (noitesRecuperacao !== null) cargaRestricao = proximaCargaRestricao(cargaRestricao,
      duracaoSono - despertares * DURACAO_DESPERTAR_ESCALA_MIN, 2, 480);
    let curva = noitesRecuperacao === null ? pressaoAjustada : aplicarCargaRestricao(pressaoAjustada, cargaRestricao);
    if (despertares) {
      const acordado = vigiliaEquivalente(simularCardiovascular({ janelasSono: [], perfilFase }), repouso, curva);
      curva = aplicarDespertaresPressao(curva, acordado, {
        inicio: sono[0], duracaoJanela: duracaoSono, despertares, duracaoMin: DURACAO_DESPERTAR_ESCALA_MIN,
      }).pontos;
    }
    const estadoSono = (min) => curva[horaCivilDaEscala(min)];
    const resposta = respostaCardioTurno(estadoSono, aclimatacao);
    const ateFimTrabalho = inicioTrabalho === null ? 0 : inicioTrabalho + FIM_TURNO_MIN;
    const emTurno = (min) => inicioTrabalho !== null && min >= inicioTrabalho && min < ateFimTrabalho;
    const integrar = calcularIntervaloCalor({ duracaoMin: DIA, estadoInicial: estado, bebidas: bebidasDoDia(planoBase),
      ambienteNoMinuto(min) {
        if (emTurno(min)) return { ...ambienteTurnoCalor(min - inicioTrabalho), aclimatacao };
        return { temperatura: naJanela(min) ? 22 : 24, umidade: 50, esforco: 0 };
      },
      basalNoMinuto: resposta,
    });
    const minutos = integrar.pontos.slice(0, DIA);
    let vigiliaMax = 0;
    const detalhe = [];
    for (const p of minutos) {
      const sonoAtual = estadoSono(p.min);
      p.dormindo = sonoAtual.dormindo;
      vigiliaMin = p.dormindo ? 0 : vigiliaMin + 1;
      vigiliaMax = Math.max(vigiliaMin, vigiliaMax);
      if (p.min % PASSO_LEITURA_MIN === 0) {
        detalhe.push({ min: p.min, sis: p.sis, dia: p.dia, fc: p.fc, osmolalidade: p.osmolalidade,
          centralC: p.centralC, pressaoSono, faseH: faseEm(p.min), plasmaL: p.plasmaL, renina: p.regulacao.renina,
          dormindo: p.dormindo, desperto: Boolean(sonoAtual.desperto), emTurno: emTurno(p.min) });
      }
      pressaoSono = p.dormindo ? pressaoSono * fatorSono : 1 - (1 - pressaoSono) * fatorVigilia;
    }
    const fim = integrar.pontos.at(-1);
    const inicio = integrar.pontos[0];
    const preTurno = inicioTrabalho === null ? null : minutos[inicioTrabalho];
    const posTurno = inicioTrabalho === null ? null : minutos[ateFimTrabalho];
    const picoTemperaturaC = minutos.reduce((pico, p) => Math.max(pico, p.centralC), fim.centralC);
    const acordadoNaJanelaMin = despertares * DURACAO_DESPERTAR_ESCALA_MIN;
    const sonoEfetivoMin = duracaoSono - acordadoNaJanelaMin;
    const pressao = mediasPressao(minutos);
    const pressaoJanela = despertares
      ? mediasPressao(minutos.map((p) => ({ ...p, dormindo: naJanela(p.min) }))) : pressao;
    saldos.push(24 - sonoEfetivoMin / 60 - P.dividaSono.vigiliaCriticaH.valor);
    resultado.push({ dia: indice + 1, plano, ...pressao, faseH: faseFinal,
      quedaPasJanelaPct: pressaoJanela.quedaPasPct, sonoEfetivoMin, acordadoNaJanelaMin,
      pasPreTurno: preTurno?.sis ?? null, padPreTurno: preTurno?.dia ?? null,
      sonoForaDaFaseH: foraDaFase * duracaoSono / 60,
      dividaSono7dH: Math.max(0, saldos.slice(-7).reduce((soma, saldo) => soma + saldo, 0)),
      indiceAclima: aclimatacao.cardiovascular * 100, indiceSuorAclima: aclimatacao.suor * 100,
      cargaSono: cargaSono * 100, minutosQuentes: integrar.minutosQuentes,
      osmInicial: inicio.osmolalidade, osmFinal: fim.osmolalidade, osmPreTurno: preTurno?.osmolalidade ?? null,
      osmPosTurno: posTurno?.osmolalidade ?? null, pressaoSonoInicio: inicioTrabalho === null ? null : detalhe[inicioTrabalho / PASSO_LEITURA_MIN].pressaoSono,
      aguaL: fim.aguaMl / 1000, suorL: fim.suor, picoTemperaturaC, vigiliaMaxH: vigiliaMax / 60, detalhe });
    // O efeito persistente do dia só entra nos cálculos a partir do dia seguinte.
    iniciosSono.push(planoBase.inicioSono / 60);
    if (iniciosSono.length > 7) iniciosSono.shift();
    cargaSono = atualizarCargaSono(cargaSono, desafioSonoPersistente(foraDaFase, variabilidadeInicioSono(iniciosSono)));
    estado = integrar.estadoFinal;
    aclimatacao = atualizarAclimatacao(aclimatacao, integrar.minutosQuentes);
    faseH = faseFinal;
  }
  return resultado;
}
