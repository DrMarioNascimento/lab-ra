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
  1: { titulo: "A vila começa", texto: "Cada família recebe renda. Vocês decidem quanto da renda do ano vai para o bem público: cada nível novo aumenta a renda de todas as famílias. O resto fica no caixa. A vila começa no Monopólio, e a meta dele já vale: patrimônio médio de 42 por pessoa no fim, com a mata acima de 30%." },
  2: { titulo: "A mata entra no jogo", texto: "A mata da vila se regenera um pouco a cada ano. Cada carga de madeira rende 6 pontos à família e tira 2 da mata. Replantar devolve. Abaixo de 30%, ela colapsa e a renda de todos cai até ela voltar." },
  3: { titulo: "Moradia", texto: "A partir de agora, cada família precisa de 1 lote a cada 3 pessoas. Quem não tem paga aluguel a quem tem lotes sobrando. No fim deste ano, a turma vota a regra dos anos 4 e 5." },
  4: { titulo: "Abre o mercado de lotes", texto: "A cada ano, até 3 lotes livres vão a lance fechado. O maior lance leva e paga o próprio lance ao banco da vila (o lote não tinha dono; o dinheiro sai do jogo). Lote também é patrimônio: vale 10 + 2 por nível do bem público." },
  5: { titulo: "O último ano", texto: "As contas fecham no fim deste ano. Antes, uma construtora faz uma oferta." },
};

// Exemplo resolvido de cada regra nova (telão) e pergunta de controle (celular, com explicação para quem errar).
export const EXEMPLO_DO_ANO = {
  1: { linhas: ["Família de 4 pessoas, bem público no nível 0: renda = 4 × 8 = 32.", "Se a família põe 25% no bem público: 8 vão para o bem público e 24 ficam no caixa.", "Quando o bem público sobe um nível, cada pessoa de todas as famílias ganha +2 por ano.", "Meta da vila (Monopólio): patrimônio médio de 42 por pessoa no fim do ano 5, com a mata acima de 30%. A barra aparece a cada ano."],
       pergunta: "O bem público subiu de nível. Quem ganha mais renda?", opcoes: ["Só a família que mais pôs", "Todas as famílias", "Ninguém, só o professor"], certa: 1,
       explica: "Todas: o nível novo dá +2 por pessoa, por ano, a todas as famílias, inclusive às que não puseram nada." },
  2: { linhas: ["Mata em 14 de 20 (70%). A família tira 2 cargas: +12 pontos no caixa, −4 na mata.", "Replantar 10 pontos devolve 4 à mata.", "Abaixo de 30% (6 de 20), a mata colapsa: −4 de renda por pessoa, para todos, enquanto ela não voltar. Replantando, ela volta a crescer e o −4 acaba."],
       pergunta: "Duas cargas de madeira fazem o quê?", opcoes: ["+12 para a família e −4 na mata", "+12 para todas as famílias", "Nada acontece com a mata"], certa: 0,
       explica: "Cada carga rende 6 à sua família e tira 2 da mata, que é de todos." },
  3: { linhas: ["Família de 5 pessoas precisa de 2 lotes (1 a cada 3 pessoas). Se tem 1, falta 1.", "No Monopólio, cada lote que falta custa 8 por ano, pagos a quem tem lote sobrando.", "Quem tem lote sobrando recebe esse aluguel sem fazer nada a mais."],
       pergunta: "Família de 5 pessoas com 1 lote, no Monopólio. Quanto paga de aluguel por ano?", opcoes: ["Nada", "8", "16"], certa: 1,
       explica: "Precisa de 2 lotes e tem 1: falta 1 lote, que custa 8 por ano no Monopólio." },
  4: { linhas: ["Neste ano, o lance mínimo é 14 (6 + 2 × 4).", "Cada pessoa propõe quanto do caixa da família oferecer além do mínimo; vale a mediana. O maior lance leva.", "Lote é patrimônio: vale 10 + 2 por nível do bem público, e ainda pode render aluguel."],
       pergunta: "Duas famílias oferecem 30 e 22 pelo mesmo lote. O que acontece?", opcoes: ["Leva quem ofereceu 30", "O lote é dividido", "Leva quem tem mais gente"], certa: 0,
       explica: "Lance fechado: o maior lance leva. Empate se decide no sorteio." },
};

export const REGRAS_TXT = {
  monopolio: { nome: "Monopólio", curto: "Aluguel de 8 por lote que falta, pago a quem tem lotes sobrando. Meta da vila: patrimônio médio de 42 por pessoa e mata acima de 30% (eficiência)." },
  prosperidade: { nome: "Prosperidade", curto: "Aluguel de 2; cada lote paga 1,5 e cada pessoa paga 1 ao bem público. Meta da vila: a família mais pobre com pelo menos 60% do patrimônio médio, por pessoa, e mata acima de 30% (equidade)." },
};

// Exemplo resolvido e pergunta de controle das duas regras, antes do voto (R8).
export const EXEMPLO_VOTO = {
  linhas: ["Monopólio: quem falta paga 8 por lote; meta da vila = patrimônio médio de 42 por pessoa e mata acima de 30%.", "Prosperidade: família de 4 com 2 lotes paga 1,5 × 2 + 1 × 4 = 7 ao bem público; quem falta paga só 2 de aluguel.", "Meta da Prosperidade: o patrimônio por pessoa da família mais pobre chega a pelo menos 60% da média por pessoa, e a mata fica acima de 30%."],
  pergunta: "Na Prosperidade, quanto uma família de 4 pessoas com 2 lotes paga ao bem público por ano?", opcoes: ["Nada", "7", "16"], certa: 1,
  explica: "1,5 por lote (2 × 1,5 = 3) mais 1 por pessoa (4 × 1 = 4): 7 por ano, que voltam a todos pelo bem público.",
};

export const EVENTOS = {
  4: { id: "mente", titulo: "O troco do mercado", texto: "Pense num número de 1 a 6. Não digite. O celular vai rolar um dado. Se você acertar, ganha 3 pontos pessoais (não vão para a família).", opcional: true },
  5: { id: "alvara", titulo: "O alvará", texto: "Uma construtora oferece 8 pontos pessoais a quem aprovar uma obra sem a vistoria. Se for aprovada, o bem público de todos perde um nível. Cada um responde se aceitaria; vale a resposta de uma pessoa sorteada, que ninguém vai saber quem é." },
};
export const EVENTO_POR_ID = Object.fromEntries(Object.entries(EVENTOS).map(([ano, e]) => [e.id, { ...e, ano: +ano }]));

export const MOTIVOS = ["Ganho", "Carreira", "Relações", "O que é certo", "Como me vejo"];
export const GUIAS = ["Impulso", "Emoção", "Razão"];

