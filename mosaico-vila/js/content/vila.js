// Mosaico Vila · textos, famílias e eventos (tudo o que é conteúdo, separado do motor).

// Cada família: cor, forma e casa próprias (ícones 3D em assets/icones: casa-<casa>.webp e forma-<forma>.webp).
export const FAMILIAS = [
  { nome: "Família Verde", cor: "#22c55e", cor2: "#15803d", forma: "circulo", casa: "verde" },
  { nome: "Família Azul", cor: "#3b82f6", cor2: "#1d4ed8", forma: "triangulo", casa: "azul" },
  { nome: "Família Âmbar", cor: "#f59e0b", cor2: "#b45309", forma: "quadrado", casa: "ambar" },
  { nome: "Família Rubi", cor: "#f43f5e", cor2: "#9f1239", forma: "losango", casa: "rubi" },
  { nome: "Família Violeta", cor: "#a78bfa", cor2: "#6d28d9", forma: "hexagono", casa: "violeta" },
  { nome: "Família Ciano", cor: "#22d3ee", cor2: "#0e7490", forma: "estrela", casa: "ciano" },
  { nome: "Família Coral", cor: "#fb923c", cor2: "#c2410c", forma: "gota", casa: "coral" },
  { nome: "Família Lima", cor: "#a3e635", cor2: "#4d7c0f", forma: "coracao", casa: "lima" },
];

export const NIVEIS_PUBLICO = ["Nada ainda", "Praça", "Posto de saúde", "Academia ao ar livre", "Escola de esportes", "Centro comunitário"];

// Uma regra nova por ano (tutorial progressivo); os acontecimentos chegam depois das mecânicas.
export const NOVIDADE_DO_ANO = {
  1: { titulo: "A vila começa", telao: "Cada família recebe renda. Quanto vai para o bem público? Cada nível novo aumenta a renda de todos.", texto: "Cada família recebe renda. Vocês decidem quanto da renda do ano vai para o bem público: cada nível novo aumenta a renda de todas as famílias. O resto fica no caixa. A vila começa no Monopólio, e a meta dele já vale: patrimônio médio de 54 por pessoa no fim, com a mata acima de 30%." },
  2: { titulo: "A mata entra no jogo", telao: "Madeira rende agora. Mata em 50% ou mais: +2 de renda por pessoa. Abaixo de 30%: −4 por pessoa, para todos.", texto: "A mata da vila se regenera um pouco a cada ano. Cada carga de madeira rende 6 pontos à família e tira mata de todos; replantar devolve. Com a mata em 50% ou mais, cada pessoa ganha +2 de renda por ano (esse bônus já valia no ano 1). Abaixo de 30%, ela colapsa: −4 por pessoa, para todos, até ela voltar." },
  3: { titulo: "Moradia", telao: "Cada família precisa de 1 lote a cada 3 pessoas. Quem não tem paga aluguel. No fim do ano, a turma vota a regra.", texto: "A partir de agora, cada família precisa de 1 lote a cada 3 pessoas. Quem não tem paga aluguel a quem tem lotes sobrando. No fim deste ano, a turma vota a regra dos anos 4 e 5." },
  4: { titulo: "Abre o mercado de lotes", telao: "Até 3 lotes livres vão a lance fechado por ano. O maior lance leva.", texto: "A cada ano, até 3 lotes livres vão a lance fechado. O maior lance leva e paga o próprio lance ao banco da vila (o lote não tinha dono; o dinheiro sai do jogo). Lote também é patrimônio: vale 10 + 2 por nível do bem público." },
  5: { titulo: "O último ano", telao: "Último ano. Antes de fechar as contas, chega uma proposta grande. No celular: a desigualdade vai subir ou descer?", texto: "As contas fecham no fim deste ano. Antes, chega uma proposta grande." },
};

// Exemplo resolvido de cada regra nova (telão) e pergunta de controle (celular, com explicação para quem errar).
export const EXEMPLO_DO_ANO = {
  1: { linhas: ["Família de 4, bem público no nível 0: 4 × 8 = 32, mais 4 × 2 = 8 (mata acima de 50%). Renda: 40.", "Pondo 25% no bem público: 10 vão para ele e 30 ficam no caixa.", "Cada nível novo do bem público dá +2 por pessoa, por ano, a todas as famílias.", "Meta (Monopólio): patrimônio médio de 54 por pessoa no fim, com a mata acima de 30%."],
       pergunta: "O bem público subiu de nível. Quem ganha mais renda?", opcoes: ["Só a família que mais pôs", "Todas as famílias", "Ninguém, só o professor"], certa: 1,
       explica: "Todas: o nível novo dá +2 por pessoa, por ano, a todas as famílias, inclusive às que não puseram nada." },
  // R13: a mata em % da vila (a conta depende do número de famílias, por isso as linhas saem do próprio jogo)
  2: { linhas: (st) => { const pc = (x) => (Math.round((1000 * x) / (st.teto || 1)) / 10).toLocaleString("pt-BR"); return [
         `Mata em 70%. Uma família tira 2 cargas: +12 no caixa dela, −${pc(4)}% na mata de todos.`, `Replantar 10 pontos devolve ${pc(4)}% à mata.`,
         "Mata em 50% ou mais: +2 por pessoa. Abaixo de 30%: −4 por pessoa, até ela voltar.", "Todas tirando 3 cargas por ano: a mata cai abaixo de 30% em dois anos."]; },
       pergunta: "Duas cargas de madeira fazem o quê?", opcoes: ["+12 para a família e a mata de todos cai", "+12 para todas as famílias", "Nada acontece com a mata"], certa: 0,
       explica: "Cada carga rende 6 à sua família e tira um pedaço da mata, que é de todos." },
  3: { linhas: ["Família de 5 pessoas precisa de 2 lotes (1 a cada 3 pessoas). Se tem 1, falta 1.", "No Monopólio, cada lote que falta custa 8 por ano, pagos a quem tem lote sobrando.", "Quem tem lote sobrando recebe esse aluguel sem fazer nada a mais."],
       pergunta: "Família de 5 pessoas com 1 lote, no Monopólio. Quanto paga de aluguel por ano?", opcoes: ["Nada", "8", "16"], certa: 1,
       explica: "Precisa de 2 lotes e tem 1: falta 1 lote, que custa 8 por ano no Monopólio." },
  4: { linhas: ["Lance mínimo: 14 (6 + 2 × 4). Cada um propõe quanto do caixa pôr além dele; vale a mediana.", "O maior leva e paga ao banco. Na Prosperidade, conta metade; quem já levou oferece metade do que ia além do mínimo.", "Lote vale 10 + 2 por nível do bem público e pode render aluguel."],
       pergunta: "Duas famílias oferecem 30 e 22 pelo mesmo lote. O que acontece?", opcoes: ["Leva quem ofereceu 30", "O lote é dividido", "Leva quem tem mais gente"], certa: 0,
       explica: "Lance fechado: o maior lance leva. Empate se decide no sorteio." },
};

export const REGRAS_TXT = {
  monopolio: { nome: "Monopólio", telao: "Aluguel de 8 · meta: patrimônio médio de 54 por pessoa (eficiência)", curto: "Aluguel de 8 por lote que falta, pago a quem tem lotes sobrando. Meta da vila: patrimônio médio de 54 por pessoa e mata acima de 30% (eficiência)." },
  prosperidade: { nome: "Prosperidade", telao: "Aluguel de 2 + imposto para o bem público · meta: a família mais pobre com 70% da média (equidade)", curto: "Aluguel de 2; cada lote paga 1,5 e cada pessoa paga 1 ao bem público. Meta da vila: a família mais pobre com pelo menos 70% do patrimônio médio, por pessoa, e mata acima de 30% (equidade)." },
};

// Exemplo resolvido e pergunta de controle das duas regras, antes do voto (R8).
export const EXEMPLO_VOTO = {
  linhas: ["Monopólio: quem falta paga 8 por lote. Meta: patrimônio médio de 54 por pessoa.", "Prosperidade: família de 4 com 2 lotes paga 1,5 × 2 + 1 × 4 = 7 ao bem público; aluguel de 2.", "Meta da Prosperidade: a mais pobre com 70% da média, por pessoa. Nas duas, mata acima de 30%."],
  pergunta: "Na Prosperidade, quanto uma família de 4 pessoas com 2 lotes paga ao bem público por ano?", opcoes: ["Nada", "7", "16"], certa: 1,
  explica: "1,5 por lote (2 × 1,5 = 3) mais 1 por pessoa (4 × 1 = 4): 7 por ano, que voltam a todos pelo bem público.",
};

// R13: as etapas de acontecimento; o texto vem da carta sorteada na partida (content/cartas.js).
export const EVENTOS = {
  2: { id: "pequena" },
  4: { id: "mente", opcional: true },
  5: { id: "alvara" },
};
export const EVENTO_POR_ID = Object.fromEntries(Object.entries(EVENTOS).map(([ano, e]) => [e.id, { ...e, ano: +ano }]));

export const MOTIVOS = ["Ganho", "Carreira", "Relações", "O que é certo", "Como me vejo"];
export const GUIAS = ["Impulso", "Emoção", "Razão"];

