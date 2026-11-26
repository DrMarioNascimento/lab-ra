// Agenda de 24 h que se repete. Intervalos podem atravessar a meia-noite.
export const TIPOS_AGENDA = Object.freeze({
  dormir: 'Sono', trabalho: 'Trabalho', lazer: 'Lazer', estudo: 'Estudo',
  exercicio: 'Exercício', refeicao: 'Refeição', bebida: 'Líquidos',
});
const DIA = 1440;
const mod = (m) => (m % DIA + DIA) % DIA;
const minutoValido = (m) => Number.isInteger(m) && m >= 0 && m < DIA && m % 5 === 0;
const dentroFaixa = (x, min, max) => Number.isFinite(x) && x >= min && x <= max;
const tipoIntervalo = (t) => ['dormir', 'trabalho', 'lazer', 'estudo'].includes(t);
const em = (m, inicio, fim) => mod(m - inicio) < mod(fim - inicio);

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

export function conferirAgenda(eventos) {
  if (!Array.isArray(eventos) || eventos.length > 48) throw new RangeError('Use até 48 eventos em cada agenda.');
  const sono = new Set();
  const exercicio = new Set();
  eventos.forEach((e, i) => {
    const prefixo = `Evento ${i + 1}`;
    if (!Object.hasOwn(TIPOS_AGENDA, e.tipo) || !minutoValido(e.inicio)) throw new RangeError(`${prefixo}. Confira a atividade e o início em intervalos de 5 min.`);
    if (tipoIntervalo(e.tipo) && (!minutoValido(e.fim) || e.inicio === e.fim)) {
      throw new RangeError(`${prefixo}. O fim precisa ser diferente do início e seguir os intervalos de 5 min.`);
    }
    if (e.tipo === 'exercicio' && (![15, 30, 45].includes(e.duracao) || ![30, 40, 60].includes(e.intensidade))) {
      throw new RangeError(`${prefixo}. Confira a duração e a intensidade do exercício.`);
    }
    if (e.tipo === 'refeicao' && !dentroFaixa(e.carboG, 0, 100)) throw new RangeError(`${prefixo}. Use de 0 a 100 g de carboidrato.`);
    if (e.tipo === 'bebida' && (!dentroFaixa(e.aguaMl, 0, 1000) || !dentroFaixa(e.sodioMg, 0, 1500))) {
      throw new RangeError(`${prefixo}. Use de 0 a 1.000 mL de água e de 0 a 1.500 mg de sódio no evento.`);
    }
    if (e.tipo !== 'dormir' && e.tipo !== 'exercicio') return;
    const destino = e.tipo === 'dormir' ? sono : exercicio;
    const duracao = e.tipo === 'dormir' ? mod(e.fim - e.inicio) : e.duracao;
    for (let m = e.inicio; m < e.inicio + duracao; m += 5) {
      const local = mod(m);
      if (destino.has(local)) throw new RangeError(`${prefixo}. Há dois intervalos do mesmo tipo no mesmo horário.`);
      destino.add(local);
    }
  });
  for (const e of eventos) {
    if (e.tipo === 'dormir') continue;
    const intervalar = tipoIntervalo(e.tipo) || e.tipo === 'exercicio';
    const fim = intervalar ? e.inicio + (e.tipo === 'exercicio' ? e.duracao : mod(e.fim - e.inicio)) : e.inicio + 5;
    for (let m = e.inicio; m < fim; m += 5) if (sono.has(mod(m))) {
      throw new RangeError(`${TIPOS_AGENDA[e.tipo]} às ${relogio(e.inicio)} coincide com o sono.`);
    }
  }
}

export const relogio = (min) => [Math.floor(mod(min) / 60), mod(min) % 60].map((v) => String(v).padStart(2, '0')).join(':');

export function prepararAgenda(eventos) {
  conferirAgenda(eventos);
  const janelasSono = eventos.filter((e) => e.tipo === 'dormir').flatMap(({ inicio, fim }) => inicio < fim
    ? [[inicio, fim]] : [[inicio - DIA, fim], [inicio, fim + DIA]].filter((j) => j[1] > 0));
  const sessoes = eventos.filter((e) => e.tipo === 'exercicio').map(({ inicio, duracao, intensidade }) => ({ inicio, duracao, intensidade }));
  const refeicoes = eventos.filter((e) => e.tipo === 'refeicao').map((e) => ({ hora: e.inicio / 60, carboG: e.carboG }));
  const bebidas = eventos.filter((e) => e.tipo === 'bebida').map((e) => [e.inicio, e.aguaMl, e.sodioMg]);
  const atividades = ['trabalho', 'estudo', 'lazer'].flatMap((tipo) => eventos.filter((e) => e.tipo === tipo));
  const atividadeEm = (min) => atividades.find((e) => em(min, e.inicio, e.fim))?.tipo;
  return { janelasSono, sessoes, refeicoes, bebidas, atividadeEm };
}
