// Rotinas do modo Prognóstico. Horas em decimal (7.5 = 7h30).
// Refeições sempre com 50 g de carboidrato: é a única dose com dado lido (ficha 03).
export const ROTINAS = [
  {
    id: 'diurna-treino-tarde', nome: 'Dia de trabalho, treino no fim da tarde',
    sono: [{ inicio: 23, fim: 7 }],
    refeicoes: [{ hora: 7.5, carboG: 50, nome: 'Café da manhã' }, { hora: 12.5, carboG: 50, nome: 'Almoço' }, { hora: 19.5, carboG: 50, nome: 'Jantar' }],
    jornadas: [{ tipo: 'trabalho', nome: 'Trabalho', inicio: 8, fim: 17 }, { tipo: 'exercicio', nome: 'Corrida intensa', inicio: 18, fim: 18.5, vo2: 80 }],
  },
  {
    id: 'diurna-treino-manha', nome: 'Treino cedo, estudo o dia todo',
    sono: [{ inicio: 22.5, fim: 6 }],
    refeicoes: [{ hora: 7.5, carboG: 50, nome: 'Café da manhã' }, { hora: 12, carboG: 50, nome: 'Almoço' }, { hora: 19, carboG: 50, nome: 'Jantar' }],
    jornadas: [{ tipo: 'exercicio', nome: 'Bicicleta intensa', inicio: 6.5, fim: 7, vo2: 80 }, { tipo: 'estudo', nome: 'Aulas e estudo', inicio: 8, fim: 17 }],
  },
  {
    id: 'treino-leve', nome: 'Dia tranquilo, caminhada à tarde',
    sono: [{ inicio: 23.5, fim: 7.5 }],
    refeicoes: [{ hora: 8, carboG: 50, nome: 'Café da manhã' }, { hora: 13, carboG: 50, nome: 'Almoço' }, { hora: 20, carboG: 50, nome: 'Jantar' }],
    jornadas: [{ tipo: 'trabalho', nome: 'Trabalho', inicio: 9, fim: 16 }, { tipo: 'exercicio', nome: 'Caminhada leve', inicio: 17, fim: 17.5, vo2: 40 }],
  },
  {
    id: 'jornada-noturna', nome: 'Plantão noturno, primeiras noites',
    sono: [{ inicio: 8, fim: 15 }],
    refeicoes: [{ hora: 16, carboG: 50, nome: 'Refeição ao acordar' }, { hora: 21, carboG: 50, nome: 'Jantar' }, { hora: 3, carboG: 50, nome: 'Lanche da madrugada' }],
    jornadas: [{ tipo: 'trabalho-noturno', nome: 'Plantão', inicio: 22, fim: 6 }],
  },
  {
    id: 'noite-ativa', nome: 'Noite ativa: festa até tarde, aula cedo',
    sono: [{ inicio: 3, fim: 8 }],
    refeicoes: [{ hora: 8.5, carboG: 50, nome: 'Café da manhã' }, { hora: 13, carboG: 50, nome: 'Almoço' }, { hora: 20, carboG: 50, nome: 'Jantar' }],
    jornadas: [{ tipo: 'estudo', nome: 'Aulas', inicio: 9, fim: 17 }, { tipo: 'noite-ativa', nome: 'Festa', inicio: 22, fim: 2.5 }],
    alcoolGkg: 0.75,
  },
  {
    id: 'dia-de-prova', nome: 'Dia de prova oral',
    sono: [{ inicio: 23, fim: 7 }],
    refeicoes: [{ hora: 7.5, carboG: 50, nome: 'Café da manhã' }, { hora: 12.5, carboG: 50, nome: 'Almoço' }, { hora: 19.5, carboG: 50, nome: 'Jantar' }],
    jornadas: [{ tipo: 'estudo', nome: 'Revisão', inicio: 8, fim: 12 }, { tipo: 'prova', nome: 'Prova oral', inicio: 14, fim: 14.5 }],
  },
];
