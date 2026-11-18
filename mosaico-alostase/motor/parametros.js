// Mosaico Alostase · parâmetros do motor de um dia (primeiro lote).
// Versão de projeto: este arquivo não é conteúdo para o aluno.
//
// Cada parâmetro traz de onde veio. Campo "leitura":
//   "completo"  = tirado de artigo lido inteiro (pode ser usado como está);
//   "resumo"    = tirado só de resumo ou trecho (provisório, falta ler o artigo);
//   "modelagem" = escolha deste projeto, sem número direto na literatura lida.
// As fichas ficam em ../docs/fichas/.

export const P = {
  cortisol: {
    unidade: 'µg/dL (total no soro)',
    pico:        { valor: 15.5,  hora: 8 + 32 / 60,  leitura: 'completo', fonte: 'Debono 2009', nota: 'faixa de referência de 95%: 11,7 a 20,6' },
    nadir:       { valor: 2.0,   hora: 0 + 18 / 60,  leitura: 'completo', fonte: 'Debono 2009', nota: 'texto: menor que 2,0 (1,5 a 2,5); a tabela 1 traz 2,5' },
    mesor:       { valor: 5.2,                       leitura: 'completo', fonte: 'Debono 2009' },
    repousoIni:  { hora: 19 + 43 / 60,               leitura: 'completo', fonte: 'Debono 2009', nota: 'início da fase de repouso (abaixo do mesor)' },
    repousoFim:  { hora: 5 + 31 / 60,                leitura: 'completo', fonte: 'Debono 2009', nota: 'fim da fase de repouso' },
    auc24:       { valor: 160.2, min: 148.6, max: 171.6, leitura: 'completo', fonte: 'Debono 2009', nota: 'h·µg/dL; usada para calibrar e testar a forma da curva' },
    formaQueda:  { valor: 2.55,  leitura: 'modelagem', nota: 'constante da queda exponencial do pico até o mesor, ajustado para a área de 24 h bater com a de Debono' },
    formaNoite:  { valor: 1.6,   leitura: 'modelagem', nota: 'expoente da queda do mesor até o nadir' },
    faixaTolerancia: { abaixo: 11.7 / 15.5, acima: 20.6 / 15.5, leitura: 'modelagem', nota: 'proporção da faixa de referência do pico, aplicada à curva toda' },
    exercicio: {
      // fator = cortisol ao fim de 30 min de exercício ÷ valor esperado no mesmo horário
      fatorPorIntensidade: [
        { vo2: 40, fator: 1.00, leitura: 'completo', fonte: 'VanBruggen 2010; Hill 2008 (resumo)', nota: 'sem aumento a 40%' },
        { vo2: 60, fator: 1.28, leitura: 'modelagem', fonte: 'VanBruggen 2010 (+16%, não significativo) e Hill 2008 (+39,9%, resumo)', nota: 'ponto médio entre os dois estudos' },
        { vo2: 80, fator: 1.75, leitura: 'modelagem', fonte: 'VanBruggen 2010 (+68%) e Hill 2008 (+83,1%, resumo)', nota: 'ponto médio entre os dois estudos' },
      ],
      duracaoMinimaMin: { valor: 10, leitura: 'completo', fonte: 'Budde 2015, citando Kirschbaum e Hellhammer 1994', nota: '10 a 15 min' },
      duracaoPlenaMin:  { valor: 30, leitura: 'completo', fonte: 'VanBruggen 2010; Hill 2008', nota: 'os dois estudos usam 30 min; acima disso o motor não aumenta o efeito (sem dado lido)' },
      platoPosMin:      { valor: 30, leitura: 'completo', fonte: 'VanBruggen 2010', nota: 'a 80% o valor aos 30 min de recuperação é igual ao do fim; a 60% já voltou. O motor interpola entre 60% e 80%' },
      meiaVidaVoltaMin: { valor: 60, leitura: 'modelagem', nota: 'tempo de volta à curva depois do platô; sem dado lido' },
    },
  },

  glicemia: {
    unidade: 'mg/dL (monitor contínuo, líquido intersticial)',
    base:        { valor: 92.8, dp: 9.4,  leitura: 'completo', fonte: 'Freckmann 2022', nota: 'média antes das refeições, 36 adultos sem diabetes, 23,7 anos em média' },
    subidaPor50g:{ valor: 50.9, dp: 23.6, leitura: 'completo', fonte: 'Freckmann 2022', nota: 'aumento médio; café e almoço padronizados em 50 g de carboidrato, jantar livre' },
    tempoPicoMin:{ valor: 50,   dp: 19,   leitura: 'completo', fonte: 'Freckmann 2022' },
    subidaMax:   { valor: 81.4, leitura: 'modelagem', nota: 'teto da subida: percentil 90 do pico (174,2) menos a base' },
    escalaCarbo: { leitura: 'modelagem', nota: 'subida proporcional aos gramas de carboidrato; só 50 g tem dado lido' },
    formaVolta:  { leitura: 'modelagem', nota: 'curva (t/tp)·exp(1 − t/tp); a volta em cerca de 3 h confere com tabela vista só em trecho' },
    madrugada:   { leitura: 'completo', fonte: 'Freckmann 2022', nota: 'sem fenômeno do alvorecer entre 1h e 5h: a base fica plana' },
    jejum:       { leitura: 'modelagem', nota: 'sem queda por horas sem comer: a glicemia do saudável é defendida (ponto de rigor do GDD)' },
  },

  pressaoSono: {
    unidade: 'Processo S, de 0 a 1 (sem unidade clínica)',
    tauSubidaH: { valor: 18.18, leitura: 'resumo', fonte: 'Daan 1984, citado em revisão', nota: 'constante de tempo acordado' },
    tauQuedaH:  { valor: 4.2,   leitura: 'resumo', fonte: 'Daan 1984, citado em revisão', nota: 'constante de tempo dormindo' },
  },

  dividaSono: {
    unidade: 'horas de vigília em excesso, acumuladas',
    vigiliaCriticaH: { valor: 15.84, ep: 0.73, leitura: 'completo', fonte: 'Van Dongen 2003', nota: 'acima disso, cada hora acordado acumula; equivale a 8,16 h de sono por dia' },
    umaNoiteSemDormirH: { valor: 24.2, leitura: 'modelagem', fonte: 'Van Dongen 2003', nota: 'conta desta base: 40 h acordado menos 15,84. Confere com o artigo: 14 dias de 6 h na cama (cerca de 30 h de excesso) equivalem a 1 noite sem dormir, e 14 dias de 4 h (cerca de 58 h), a 2 noites' },
    pagamento: { leitura: 'modelagem', nota: 'dia com menos de 15,84 h acordado abate a dívida hora por hora. O artigo não mede a recuperação; Belenky 2003 sugere que ela é mais lenta do que isso' },
  },

  pressaoArterial: {
    unidade: 'mmHg (monitorização ambulatorial, adultos normotensos)',
    sistolica:  { vigilia: 125, sono: 108, leitura: 'resumo', fonte: 'amostra de 1.057 pessoas (revisão What is a normal blood pressure); meta-análise de 22 estudos dá 120-125 e 105-110', nota: 'não é de adultos de 18 a 30 anos em particular' },
    diastolica: { vigilia: 77,  sono: 62,  leitura: 'resumo', fonte: 'mesma amostra; meta-análise dá 75-80 e 60-65' },
    partePostura: { valor: 0.70, leitura: 'resumo', fonte: 'Degaute 1991', nota: 'deitar e dormir explicam 65 a 75% da queda noturna da pressão; o restante é ritmo do relógio' },
    formaRelogio: { leitura: 'resumo', fonte: 'Degaute 1991', nota: 'picos perto das 10 h e das 20 h, queda pequena perto das 15 h, vale perto das 3 h; só o horário vem da fonte, a forma entre os pontos é modelagem' },
    pontosRelogio: [ { hora: 3, v: 1, leitura: 'resumo', fonte: 'Degaute 1991', nota: 'vale' }, { hora: 10, v: 0, leitura: 'resumo', fonte: 'Degaute 1991', nota: 'pico da manhã' }, { hora: 15, v: 0.2, leitura: 'modelagem', fonte: 'Degaute 1991', nota: 'o horário (queda pequena) vem da fonte; o 0,2 é escolha deste projeto' }, { hora: 20, v: 0, leitura: 'resumo', fonte: 'Degaute 1991', nota: 'pico da noite' } ],
    rampaSonoH: { valor: 1, leitura: 'modelagem', nota: 'tempo para a pressão descer ao dormir e subir ao acordar; Degaute mostra subida já antes de acordar' },
    sonoDiurno: { leitura: 'modelagem', nota: 'o componente de sono vale em qualquer hora; o do relógio fica no horário biológico. Extrapolação: Degaute não estudou sono diurno, e Patterson 2020 acha a evidência de baixa qualidade' },
    efeitoCronicoNoturnoSistolica: { valor: 2.52, ic95: [0.75, 4.29], leitura: 'resumo', fonte: 'meta-análise de 45 estudos, 2021', nota: 'trabalhadores noturnos permanentes; observacional' },
    efeitoCronicoNoturnoDiastolica: { valor: 1.76, ic95: [0.41, 3.12], leitura: 'resumo', fonte: 'meta-análise de 45 estudos, 2021' },
  },

  alcool: {
    remPerdidoMinPorGkg: { valor: 40.4, leitura: 'completo', fonte: 'Gardiner 2025' },
    atrasoRemMinPorGkg:  { valor: 30.1, leitura: 'completo', fonte: 'Gardiner 2025' },
    doseMinimaGkg:       { valor: 0.35, leitura: 'completo', fonte: 'Gardiner 2025', nota: 'atraso do REM significativo a partir daqui; duração a partir de 0,50' },
  },
};

// O que o motor ainda NÃO calcula, por falta de ficha com número lido.
export const PENDENCIAS = [
  'Estresse psicológico (prova, apresentação) sobre o cortisol: direção, condições e tempo lidos (ficha 06); falta tamanho em soro. O jogo não pede o cortisol em volta da prova.',
  'Refeição sobre o cortisol: aumento observado depois do almoço, não quantificado.',
  'Exercício sobre a glicemia.',
  'Exercício com mais de 30 min ou acima de 80% do VO2máx sobre o cortisol.',
  'Jornada noturna sobre a glicemia (+6% no laboratório, lido só no resumo).',
  'Sono curto sobre a sensibilidade à insulina no dia seguinte.',
  'Deslocamento do relógio depois de várias noites seguidas.',
  'Dívida de sono sobre o cortisol e a glicemia do dia seguinte: direção lida (Spiegel 1999, só resumo), sem número para o motor.',
  'Lapsos de atenção por hora de dívida: o artigo dá a forma da curva (expoente 0,67), não o coeficiente.',
  'Virada de turno (do dia para a noite) dentro da mesma semana.',
  'Frequência cardíaca: só há forma e amplitude de 24 h (Degaute) e a frequência de repouso (54,5 dia / 50,5 noite, pulseira); falta a média absoluta de 24 h em adultos jovens.',
  'Pressão depois do exercício (queda de cerca de 5 a 10 mmHg na sistólica) e efeito agudo do trabalho noturno sobre a pressão: ficha 08, fora do motor.',
];
