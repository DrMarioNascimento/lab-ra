// Três rotinas para conferir o motor. Horas em decimal (7.5 = 7h30).
export const ROTINAS = {
  diurna: {
    nome: 'Rotina diurna com treino no fim da tarde',
    sono: [{ inicio: 23, fim: 7 }],
    refeicoes: [{ hora: 7.5, carboG: 50 }, { hora: 12.5, carboG: 50 }, { hora: 19.5, carboG: 50 }],
    jornadas: [{ tipo: 'trabalho', inicio: 8, fim: 17 }, { tipo: 'exercicio', inicio: 18, fim: 18.5, vo2: 80 }],
  },
  noturna: {
    nome: 'Jornada noturna, primeiras noites',
    sono: [{ inicio: 8, fim: 15 }],
    refeicoes: [{ hora: 16, carboG: 50 }, { hora: 21, carboG: 50 }, { hora: 3, carboG: 50 }],
    jornadas: [{ tipo: 'trabalho-noturno', inicio: 22, fim: 6 }],
  },
  noiteAtiva: {
    nome: 'Noite ativa: dormir às 3h, acordar às 8h, com álcool',
    sono: [{ inicio: 3, fim: 8 }],
    refeicoes: [{ hora: 8.5, carboG: 50 }, { hora: 13, carboG: 50 }, { hora: 20, carboG: 50 }],
    jornadas: [{ tipo: 'estudo', inicio: 9, fim: 17 }, { tipo: 'noite-ativa', inicio: 22, fim: 2.5 }],
    alcoolGkg: 0.75,
  },
};
