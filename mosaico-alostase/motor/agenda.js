// Agenda semanal que se repete. Intervalos podem atravessar a meia-noite.
export const TIPOS_AGENDA = Object.freeze({
  dormir: 'Sono', trabalho: 'Trabalho', lazer: 'Lazer', estudo: 'Estudo',
  exercicio: 'Exercício', refeicao: 'Refeição', bebida: 'Líquidos',
  meditacao: 'Meditação', oracao: 'Oração', biofeedback: 'Biofeedback respiratório', luz: 'Exposição à luz',
});
const DIA = 1440;
const mod = (m) => (m % DIA + DIA) % DIA;
const minutoValido = (m) => Number.isInteger(m) && m >= 0 && m < DIA && m % 5 === 0;
const dentroFaixa = (x, min, max) => Number.isFinite(x) && x >= min && x <= max;
export const DIAS_AGENDA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
export const TODOS_DIAS = [0, 1, 2, 3, 4, 5, 6];
export const TIPOS_PAUSA = ['meditacao', 'oracao', 'biofeedback'];
export const tipoIntervalo = (t) => ['dormir', 'trabalho', 'lazer', 'estudo', 'luz', ...TIPOS_PAUSA].includes(t);
const duracao = (e) => tipoIntervalo(e.tipo) ? mod(e.fim - e.inicio) : (e.tipo === 'exercicio' ? e.duracao : 5);
const SEMANA = DIA * 7;
const ciclo = (m) => (m % SEMANA + SEMANA) % SEMANA;
const diasDe = (e) => e.dias ?? TODOS_DIAS;


export function agendaInicial(turno = false) {
  return turno ? [
    { tipo: 'trabalho', inicio: 1320, fim: 420 }, { tipo: 'dormir', inicio: 480, fim: 840 },
    { tipo: 'refeicao', inicio: 450, carboG: 50 }, { tipo: 'refeicao', inicio: 900, carboG: 50 },
    { tipo: 'refeicao', inicio: 1140, carboG: 50 },
    { tipo: 'bebida', inicio: 330, aguaMl: 500, sodioMg: 300 }, { tipo: 'bebida', inicio: 450, aguaMl: 450, sodioMg: 300 },
    { tipo: 'bebida', inicio: 900, aguaMl: 500, sodioMg: 600 }, { tipo: 'bebida', inicio: 1020, aguaMl: 350, sodioMg: 350 },
    { tipo: 'bebida', inicio: 1170, aguaMl: 400, sodioMg: 750 },
  ] : [
    { tipo: 'dormir', inicio: 1380, fim: 420 }, { tipo: 'trabalho', inicio: 480, fim: 1020 },
    { tipo: 'refeicao', inicio: 450, carboG: 50 }, { tipo: 'refeicao', inicio: 780, carboG: 50 },
    { tipo: 'refeicao', inicio: 1200, carboG: 50 },
    { tipo: 'bebida', inicio: 450, aguaMl: 400, sodioMg: 300 }, { tipo: 'bebida', inicio: 660, aguaMl: 350, sodioMg: 300 },
    { tipo: 'bebida', inicio: 780, aguaMl: 500, sodioMg: 770 }, { tipo: 'bebida', inicio: 960, aguaMl: 350, sodioMg: 150 },
    { tipo: 'bebida', inicio: 1200, aguaMl: 500, sodioMg: 780 },
  ];
}

// As escalas controlam a carga (40 h de trabalho e 56 h de sono por semana).
export function agendaEscala(tipo = 'diurno') {
  const uteis = [0, 1, 2, 3, 4];
  const turno = tipo !== 'diurno';
  const trabalho = { tipo: 'trabalho', inicio: turno ? 1320 : 540, fim: turno ? 360 : 1020, dias: uteis };
  const sono = tipo === 'folgas' ? [
    { tipo: 'dormir', inicio: 1080, fim: 1320, dias: [0] },
    { tipo: 'dormir', inicio: 480, fim: 960, dias: [1, 2, 3, 4] },
    { tipo: 'dormir', inicio: 480, fim: 720, dias: [5] },
    { tipo: 'dormir', inicio: 1380, fim: 420, dias: [5, 6] },
  ] : [{ tipo: 'dormir', inicio: turno ? 480 : 1380, fim: turno ? 960 : 420 }];
  const refeicoes = [450, 960, 1335].map((inicio) => ({ tipo: 'refeicao', inicio, carboG: 50 }));
  const bebidas = [[445, 400, 300], [960, 350, 300], [1020, 500, 770], [1060, 350, 150], [1335, 500, 780]]
    .map(([inicio, aguaMl, sodioMg]) => ({ tipo: 'bebida', inicio, aguaMl, sodioMg }));
  return [...sono, trabalho, ...refeicoes, ...bebidas];
}

export function agendaLuzPlantao(luzPlantaoLux) {
  return [...agendaEscala('folgas'),
    { tipo: 'luz', inicio: 0, fim: 120, lux: luzPlantaoLux, dias: [1, 2, 3, 4, 5] },
    { tipo: 'luz', inicio: 360, fim: 390, lux: 300, dias: [1, 2, 3, 4, 5] },
    { tipo: 'luz', inicio: 480, fim: 540, lux: 2000, dias: [0, 6] },
    { tipo: 'luz', inicio: 780, fim: 840, lux: 2000, dias: [5] },
  ];
}

export function agendaComPausa(tipo) {
  const escala = agendaEscala('folgas');
  return TIPOS_PAUSA.includes(tipo) ? [...escala, { tipo, inicio: 180, fim: 190, ritmo: 6, dias: [1] }] : escala;
}

export function conferirAgenda(eventos) {
  if (!Array.isArray(eventos) || eventos.length > 48) throw new RangeError('Use até 48 eventos em cada agenda.');
  const sono = new Set(), exercicio = new Set(), pausas = new Set(), luz = new Set();
  eventos.forEach((e, i) => {
    const prefixo = `Evento ${i + 1}`;
    if (!Object.hasOwn(TIPOS_AGENDA, e.tipo) || !minutoValido(e.inicio)) throw new RangeError(`${prefixo}. Confira a atividade e o início em intervalos de 5 min.`);
    const dias = diasDe(e);
    if (!Array.isArray(dias) || !dias.length || new Set(dias).size !== dias.length
      || dias.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) throw new RangeError(`${prefixo}. Selecione pelo menos um dia válido da semana.`);
    if (tipoIntervalo(e.tipo) && (!minutoValido(e.fim) || e.inicio === e.fim)) {
      throw new RangeError(`${prefixo}. O fim precisa ser diferente do início e seguir os intervalos de 5 min.`);
    }
    if (e.tipo === 'exercicio' && (![15, 30, 45].includes(e.duracao) || ![30, 40, 60].includes(e.intensidade))) {
      throw new RangeError(`${prefixo}. Confira a duração e a intensidade do exercício.`);
    }
    if (e.tipo === 'luz' && !dentroFaixa(e.lux, 0, 10000)) throw new RangeError(`${prefixo}. Use de 0 a 10.000 lux.`);
    if (e.tipo === 'biofeedback' && ![5, 6, 7].includes(e.ritmo ?? 6)) throw new RangeError(`${prefixo}. Escolha um dos ritmos disponíveis.`);
    if (e.tipo === 'refeicao' && !dentroFaixa(e.carboG, 0, 100)) throw new RangeError(`${prefixo}. Use de 0 a 100 g de carboidrato.`);
    if (e.tipo === 'bebida' && (!dentroFaixa(e.aguaMl, 0, 1000) || !dentroFaixa(e.sodioMg, 0, 1500))) {
      throw new RangeError(`${prefixo}. Use de 0 a 1.000 mL de água e de 0 a 1.500 mg de sódio no evento.`);
    }
    const destino = e.tipo === 'dormir' ? sono : e.tipo === 'exercicio' ? exercicio : TIPOS_PAUSA.includes(e.tipo) ? pausas : e.tipo === 'luz' ? luz : null;
    if (!destino) return;
    for (const dia of dias) for (let passo = 0; passo < duracao(e); passo += 5) {
      const local = ciclo(dia * DIA + e.inicio + passo);
      if (destino.has(local)) throw new RangeError(`${prefixo}. Há dois intervalos do mesmo grupo no mesmo horário.`);
      destino.add(local);
    }
  });
  for (const e of eventos) {
    if (e.tipo === 'dormir' || (e.tipo === 'luz' && e.lux === 0)) continue;
    for (const dia of diasDe(e)) for (let passo = 0; passo < duracao(e); passo += 5) {
      const m = ciclo(dia * DIA + e.inicio + passo);
      if (sono.has(m)) throw new RangeError(`${TIPOS_AGENDA[e.tipo]} às ${relogio(e.inicio)} coincide com o sono (${DIAS_AGENDA[dia]}).`);
      if (TIPOS_PAUSA.includes(e.tipo) && exercicio.has(m)) {
        throw new RangeError(`${TIPOS_AGENDA[e.tipo]} às ${relogio(e.inicio)} coincide com exercício (${DIAS_AGENDA[dia]}).`);
      }
    }
  }
}

export const relogio = (min) => [Math.floor(mod(min) / 60), mod(min) % 60].map((v) => String(v).padStart(2, '0')).join(':');

export function prepararAgenda(eventos) {
  conferirAgenda(eventos);
  const semana = TODOS_DIAS.map((dia) => {
    const daqui = eventos.filter((e) => diasDe(e).includes(dia));
    const anteriores = eventos.filter((e) => diasDe(e).includes((dia + 6) % 7)
      && (e.inicio + duracao(e) > DIA || (e.tipo === 'exercicio' && e.inicio + duracao(e) + 25 > DIA)))
      .map((e) => ({ ...e, inicio: e.inicio - DIA }));
    const locais = [...anteriores, ...daqui];
    const janelasSono = locais.filter((e) => e.tipo === 'dormir').map((e) => [e.inicio, e.inicio + duracao(e)]);
    const sessoes = daqui.filter((e) => e.tipo === 'exercicio');
    const sessoesCardio = locais.filter((e) => e.tipo === 'exercicio');
    const refeicoes = daqui.filter((e) => e.tipo === 'refeicao').map((e) => ({ hora: e.inicio / 60, carboG: e.carboG }));
    const bebidas = daqui.filter((e) => e.tipo === 'bebida').map((e) => [e.inicio, e.aguaMl, e.sodioMg]);
    const atividades = ['trabalho', 'estudo', 'lazer'].flatMap((tipo) => locais.filter((e) => e.tipo === tipo));
    const pausas = locais.filter((e) => TIPOS_PAUSA.includes(e.tipo));
    const luzes = locais.filter((e) => e.tipo === 'luz');
    const ativo = (e, min) => min >= e.inicio && min < e.inicio + duracao(e);
    return { janelasSono, sessoes, sessoesCardio, refeicoes, bebidas,
      atividadeEm: (min) => atividades.find((e) => ativo(e, min))?.tipo,
      pausaEm: (min) => pausas.find((e) => ativo(e, min)),
      luxEm: (min) => luzes.find((e) => ativo(e, min))?.lux ?? 0,
    };
  });
  return { ...semana[0], temLuz: eventos.some((e) => e.tipo === 'luz'), dia: (indice) => semana[(indice % 7 + 7) % 7] };
}
