import { simularCalorIntegrado } from './calor-integrado.js';
import { simularCardiovascular } from './cardiovascular.js';
import { fracaoReservaVO2, frequenciaNoEsforco } from './treino.js';

export const FIM_TURNO_MIN = 240;
export const FIM_OBSERVACAO_MIN = 360;
export const TEMPO_PAUSA_MIN = 10;
export const TURNOS_CALOR = Object.freeze({
  pausas: { nome: 'Água nas pausas', bebidas: [[50, 300], [110, 300], [170, 300], [230, 300]] },
  fim: { nome: 'Água no fim', bebidas: [[FIM_TURNO_MIN, 1200]] },
});

export function atividadeNoTurno(min) {
  if (min >= FIM_TURNO_MIN) return 'Recuperação';
  return min % 60 >= 60 - TEMPO_PAUSA_MIN ? 'Pausa' : 'Trabalho';
}

export function simularTurnoCalor(cenario, horaInicio = 14) {
  const turno = TURNOS_CALOR[cenario];
  if (!turno || ![14, 22].includes(horaInicio)) throw new RangeError('Turno fora das opções.');
  // A pessoa permanece acordada durante a atividade e a observação. O relógio é igual entre as duas rotinas.
  const repouso = simularCardiovascular({ sono: horaInicio === 22 ? [480, 960] : [1380, 420] });
  const intensidade = 0.27;
  const fracaoReserva = fracaoReservaVO2(intensidade, 45);
  let resposta = 0;
  return simularCalorIntegrado({
    duracaoMin: FIM_OBSERVACAO_MIN,
    ambienteNoMinuto(min) {
      const atividade = atividadeNoTurno(min);
      if (atividade === 'Trabalho') return { temperatura: 32, umidade: 65, esforco: intensidade };
      return { temperatura: atividade === 'Pausa' ? 26 : 24, umidade: 50, esforco: 0 };
    },
    basalNoMinuto(min, ambiente) {
      const { fc, sis, dia } = repouso[(horaInicio * 60 + min) % 1440];
      const alvo = frequenciaNoEsforco({ idade: 35, fcRepouso: fc, fracReserva: fracaoReserva }).valor;
      const pressaoSistolica = sis + (intensidade * 45 / 3.5 - 1) * 10 * resposta;
      const basal = { fc: fc + (alvo - fc) * resposta, sis: pressaoSistolica, dia,
        pam: (pressaoSistolica + 2 * dia) / 3, vsReferencia: 72 + 60 * intensidade * resposta };
      resposta += ((ambiente.esforco ? 1 : 0) - resposta) * (1 - Math.exp(-1 / 1.5));
      return basal;
    },
    bebidas: turno.bebidas,
  });
}
