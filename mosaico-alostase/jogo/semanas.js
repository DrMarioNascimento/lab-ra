// Semanas prontas do modo Prognóstico. Cada semana é uma lista de 7 dias (segunda a domingo).
const refe = (cafe, almoco, jantar) => [{ hora: cafe, carboG: 50, nome: 'Café da manhã' }, { hora: almoco, carboG: 50, nome: 'Almoço' }, { hora: jantar, carboG: 50, nome: 'Jantar' }];
const dia = (nome, dormir, acordar, extra = {}) => ({ nome, sono: [{ inicio: dormir, fim: acordar }], refeicoes: refe(acordar + 0.5, 12.5, 19.5), jornadas: [{ tipo: 'estudo', nome: 'Aulas e estudo', inicio: 8, fim: 17 }], ...extra });
const livre = (nome, dormir, acordar, extra = {}) => ({ nome, sono: [{ inicio: dormir, fim: acordar }], refeicoes: refe(acordar + 0.5, 13.5, 20), jornadas: [], ...extra });
const plantao = { nome: 'Plantão noturno', sono: [{ inicio: 8, fim: 15 }], refeicoes: [{ hora: 16, carboG: 50, nome: 'Refeição ao acordar' }, { hora: 21, carboG: 50, nome: 'Jantar' }, { hora: 3, carboG: 50, nome: 'Lanche da madrugada' }], jornadas: [{ tipo: 'trabalho-noturno', nome: 'Plantão', inicio: 22, fim: 6 }] };
const festa = (nome, dormir, acordar) => ({ ...dia(nome, dormir, acordar), jornadas: [{ tipo: 'estudo', nome: 'Aulas e estudo', inicio: 9, fim: 17 }, { tipo: 'noite-ativa', nome: 'Festa', inicio: 22, fim: dormir - 0.5 }], alcoolGkg: 0.75 });

export const SEMANAS = [
  { id: 'regular', nome: 'Semana regular', resumo: 'Oito horas de sono todas as noites.',
    dias: [...Array(5).fill(dia('Dia de aula', 23, 7)), livre('Dia livre', 23.5, 8), livre('Dia livre', 23.5, 8)] },
  { id: 'provas', nome: 'Semana de provas', resumo: 'Cinco noites de 5 horas e um fim de semana para compensar.',
    dias: [...Array(5).fill(dia('Dia de aula, estudo até tarde', 2, 7)), livre('Dia livre', 0, 9), livre('Dia livre', 23, 9)] },
  { id: 'festas', nome: 'Semana com duas festas', resumo: 'Quinta e sexta até tarde, com álcool.',
    dias: [dia('Dia de aula', 23, 7), dia('Dia de aula', 23, 7), dia('Dia de aula', 23, 7), festa('Dia de aula e festa', 3, 7), festa('Dia de aula e festa', 3.5, 8), livre('Dia livre', 0.5, 10), livre('Dia livre', 23, 9)] },
  { id: 'plantoes', nome: 'Semana de plantões noturnos', resumo: 'Sete noites de trabalho, dormindo de dia.',
    dias: Array(7).fill(plantao) },
];
