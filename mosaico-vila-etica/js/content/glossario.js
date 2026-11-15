// Mosaico Vila Ética · glossário técnico (dicionário de ética e deontologia).
// Base: os slides de Ética e Deontologia da Educação Física (UDESC/CEFID, 2026/2), que seguem Aranha e Martins (2003, 2016)
// e Chaui (2004), e o texto de apoio da disciplina; complementos: utilitarismo, Rawls, Hardin, ética do cuidado e o
// Código de Ética do CONFEF. As definições são resumos curtos, em palavras próprias.
//
// Campos: id, termo, autor (opcional), def (a definição do acordeão), pista (o outro lado da carta da memória, até 34
// caracteres), cat (categoria: a cor fixa do botão no Acerte a sequência) e ano (quando o verbete se desbloqueia: 0 = formação das
// famílias, 1 a 5 = abertura do ano, 3.5 = Momento do Lazer, 6 = fechamento).

export const CATEGORIAS = {
  fundamentos: { nome: "Fundamentos", cor: "#3b82f6", cor2: "#1d4ed8" },
  ato: { nome: "Ato moral", cor: "#22d3ee", cor2: "#0e7490" },
  virtudes: { nome: "Virtudes", cor: "#22c55e", cor2: "#15803d" },
  vicios: { nome: "Vícios", cor: "#f43f5e", cor2: "#9f1239" },
  autores: { nome: "Autores", cor: "#f59e0b", cor2: "#b45309" },
  dever: { nome: "Kant e o dever", cor: "#a78bfa", cor2: "#6d28d9" },
  justica: { nome: "Consequências e justiça", cor: "#fb923c", cor2: "#c2410c" },
  afetos: { nome: "Afetos e liberdade", cor: "#ec4899", cor2: "#9d174d" },
};
export const ORDEM_CATEGORIAS = Object.keys(CATEGORIAS);

export const GLOSSARIO = [
  // 0 · formação das famílias: o que é ética e o que é moral
  { id: "etica", termo: "Ética", def: "Ramo da filosofia que reflete sobre a conduta humana, os valores e os critérios que a orientam. Também chamada de filosofia moral. Do grego ethos.", pista: "Reflexão sobre os valores", cat: "fundamentos", ano: 0 },
  { id: "moral", termo: "Moral", def: "Conjunto de costumes, normas e formas de conduta aceitas por um grupo numa época. Do latim mos, moris (costume). A ética reflete sobre ela.", pista: "Normas e costumes de um grupo", cat: "fundamentos", ano: 0 },
  { id: "ethos", termo: "Ethos", def: "Palavra grega na origem de 'ética': o modo de ser, o caráter, a morada habitual de uma pessoa ou de um povo.", pista: "Caráter, modo de ser (grego)", cat: "fundamentos", ano: 0 },
  { id: "valor", termo: "Valor", def: "Qualidade que atribuímos às coisas, às ações e às pessoas: útil, belo, bom, justo. Os valores orientam as escolhas.", pista: "Qualidade atribuída à ação", cat: "fundamentos", ano: 0 },
  { id: "axiologia", termo: "Axiologia", def: "Teoria dos valores (do grego axios, valor): estuda a relação entre as coisas e o sujeito que as aprecia. Surgiu no século XIX.", pista: "Teoria dos valores", cat: "fundamentos", ano: 0 },
  { id: "juizo-fato", termo: "Juízo de fato", def: "Descreve o que existe ou acontece, sem avaliar. Ex.: 'a família Azul começou sem lote'.", pista: "Descreve o que acontece", cat: "fundamentos", ano: 0 },
  { id: "juizo-valor", termo: "Juízo de valor", def: "Atribui qualidade ou importância ao fato: bom, mau, justo, injusto. Ex.: 'é injusto começar sem lote'.", pista: "Avalia: justo, injusto, bom", cat: "fundamentos", ano: 0 },
  { id: "veu", termo: "Véu da ignorância", autor: "Rawls", def: "Escolher as regras de uma sociedade sem saber que lugar se vai ocupar nela. Na vila, a família de cada um saiu por sorteio, não por mérito.", pista: "Escolher sem saber o seu lugar", cat: "justica", ano: 0 },

  // 1 · o bem público
  { id: "bem-comum", termo: "Bem comum", def: "O que é de todos e serve a todos, como o bem público e a mata da vila. Cuidar dele pede considerar o outro sem anular a si mesmo.", pista: "O que é de todos e serve a todos", cat: "justica", ano: 1 },
  { id: "carona", termo: "Carona (free rider)", def: "Quem usufrui do bem comum sem contribuir para ele. Na vila: quem não põe nada no bem público e ganha o nível novo igual.", pista: "Usa o comum sem contribuir", cat: "justica", ano: 1 },
  { id: "sujeito-moral", termo: "Sujeito moral", def: "Quem age moralmente: consciente de si e dos outros, dotado de vontade, responsável pelo que faz e livre para deliberar (Aranha e Martins).", pista: "Consciente, livre e responsável", cat: "ato", ano: 1 },
  { id: "consciencia", termo: "Consciência", def: "Dimensão interior: perceber a situação, os sentimentos e os outros, e avaliar o que está em jogo antes de agir.", pista: "Perceber e avaliar por dentro", cat: "ato", ano: 1 },
  { id: "liberdade", termo: "Liberdade", def: "Capacidade de deliberar e escolher entre alternativas, reconhecendo as condições internas e externas que pesam na decisão.", pista: "Deliberar e escolher", cat: "afetos", ano: 1 },
  { id: "socrates", termo: "Sócrates", autor: "470–399 a.C.", def: "O incansável perguntador: examinar a própria vida e os valores aceitos, pelo diálogo, é o começo da ética.", pista: "O incansável perguntador", cat: "autores", ano: 1 },

  // 2 · a mata e a proposta pequena
  { id: "tragedia", termo: "Tragédia dos comuns", autor: "Hardin", def: "Quando cada um tira um pouco do que é de todos, pelo próprio bolso, o recurso comum se esgota para todos. A mata da vila.", pista: "Cada um tira, o comum acaba", cat: "justica", ano: 2 },
  { id: "imperativo", termo: "Imperativo categórico", autor: "Kant", def: "Lei moral incondicional da razão prática: agir por dever, não por interesse. Tem três formulações (universalização, humanidade como fim, reino dos fins).", pista: "Dever incondicional da razão", cat: "dever", ano: 2 },
  { id: "universalizacao", termo: "Universalização", autor: "Kant", def: "1ª formulação: aja como se a sua máxima devesse virar lei universal. Na vila: 'e se a turma inteira aceitasse a proposta?'", pista: "E se todos fizessem o mesmo?", cat: "dever", ano: 2 },
  { id: "dever", termo: "Dever", def: "O que a norma moral ordena, o 'dever ser'. Para Kant, o valor moral está em agir por dever, e não só conforme o dever.", pista: "O 'dever ser' da norma", cat: "dever", ano: 2 },
  { id: "ato-moral", termo: "Ato moral", def: "Ação livre, consciente, intencional e solidária, que se refere a uma norma. A responsabilidade cresce com o efeito sobre os outros.", pista: "Livre, consciente, intencional", cat: "ato", ano: 2 },
  { id: "imoral", termo: "Ato imoral", def: "Ação que conhece a norma e vai contra ela.", pista: "Conhece a norma e a contraria", cat: "ato", ano: 2 },
  { id: "amoral", termo: "Ato amoral", def: "Ação sem referência a norma moral: fora do campo da moral (ex.: um fenômeno natural, ou quem não tem consciência da norma).", pista: "Fora do campo da moral", cat: "ato", ano: 2 },
  { id: "normativo", termo: "Normativo", def: "Na estrutura do ato moral: as normas e os imperativos que dizem o que deve ser feito.", pista: "As normas: o que deve ser", cat: "ato", ano: 2 },
  { id: "fatual", termo: "Fatual", def: "Na estrutura do ato moral: os atos que de fato acontecem. A norma só tem sentido na prática, e o fato só ganha contorno moral diante da norma.", pista: "Os atos que de fato ocorrem", cat: "ato", ano: 2 },
  { id: "corrupcao", termo: "Corrupção", def: "Trocar um dever ou uma função pública por vantagem pessoal (propina, 'presente em troca de'). O carimbo vai na proposta, não na pessoa.", pista: "Trocar o dever por vantagem", cat: "justica", ano: 2 },

  // 3 · aluguel, desigualdade e o voto
  { id: "justica-distributiva", termo: "Justiça distributiva", def: "Como repartir bens, custos e oportunidades entre as pessoas. Na vila: quem paga aluguel, quem recebe, quem tem lote.", pista: "Como repartir bens e custos", cat: "justica", ano: 3 },
  { id: "diferenca", termo: "Princípio da diferença", autor: "Rawls", def: "Desigualdades só se justificam se melhorarem a situação dos que estão pior. É a meta da Prosperidade: a família mais pobre perto da média.", pista: "Desigual só se ajuda o pior", cat: "justica", ano: 3 },
  { id: "contrato", termo: "Contrato social", def: "As regras da vida em comum como acordo entre os membros (Hobbes, Locke, Rousseau). Na vila: o voto da regra.", pista: "Regras como acordo de todos", cat: "justica", ano: 3 },
  { id: "constituida", termo: "Moral constituída", def: "A moral que herdamos do grupo, já pronta: as normas em vigor (Aranha e Martins).", pista: "A moral herdada, já pronta", cat: "ato", ano: 3 },
  { id: "constituinte", termo: "Moral constituinte", def: "A moral que criamos a cada experiência, quando avaliamos a herdada e propomos outra. Somos herdeiros e criadores.", pista: "A moral criada na experiência", cat: "ato", ano: 3 },
  { id: "moral-fechada", termo: "Moral fechada", autor: "Bergson", def: "Hábitos, regras e costumes que mantêm a coesão do grupo e preservam a ordem existente.", pista: "Mantém a ordem do grupo", cat: "afetos", ano: 3 },
  { id: "moral-aberta", termo: "Moral aberta", autor: "Bergson", def: "Criação de novos valores e formas de agir, ampliando a solidariedade; nasce de criadores morais.", pista: "Novos valores, mais solidariedade", cat: "afetos", ano: 3 },
  { id: "autonomia", termo: "Autonomia", autor: "Kant", def: "Dar a si mesmo a lei moral, pela razão: o contrário de agir só por medo, costume ou interesse.", pista: "Dar a si a lei moral", cat: "dever", ano: 3 },
  { id: "heteronomia", termo: "Heteronomia", autor: "Kant", def: "Agir por uma lei vinda de fora (medo da punição, costume, interesse), e não pela própria razão.", pista: "Agir por lei vinda de fora", cat: "dever", ano: 3 },
  { id: "legalismo", termo: "Dogmatismo e legalismo", def: "O risco de considerar só o caráter social da moral: obedecer por medo das consequências ou da lei (Aranha e Martins).", pista: "Obedecer só por medo da lei", cat: "fundamentos", ano: 3 },
  { id: "individualismo", termo: "Individualismo", def: "O risco oposto: considerar só a interrogação do indivíduo e destruir a moral comum, a 'tirania da intimidade'.", pista: "Só o indivíduo: a moral se perde", cat: "fundamentos", ano: 3 },
  { id: "hegel", termo: "Hegel", autor: "1770–1831", def: "Somos seres históricos e culturais: a vida ética é o acordo entre a vontade subjetiva e as instituições (família, sociedade civil, Estado).", pista: "Seres históricos e culturais", cat: "autores", ano: 3 },

  // 3,5 · Momento do Lazer
  { id: "ocio", termo: "Ócio e lazer", def: "Na Idade Média, o trabalho virou virtude e o ócio, vício (a preguiça). Daí a dificuldade de aceitar o lazer, que também tem valor.", pista: "Do vício da preguiça ao valor", cat: "virtudes", ano: 3.5 },

  // 4 · honestidade, confiança e mercado
  { id: "virtude", termo: "Virtude", def: "Do latim virtus (poder, potência): disposição permanente para querer o bem, com coragem para enfrentar o que dificulta a ação.", pista: "Disposição permanente para o bem", cat: "virtudes", ano: 4 },
  { id: "justo-meio", termo: "Justo meio", autor: "Aristóteles", def: "A virtude fica entre dois vícios, um por falta e outro por excesso. Ex.: a coragem, entre a covardia e a temeridade.", pista: "Entre a falta e o excesso", cat: "virtudes", ano: 4 },
  { id: "aristoteles", termo: "Aristóteles", autor: "384–322 a.C.", def: "A felicidade é a finalidade da vida humana e a virtude é o caminho para ela; a ética é saber prático (práxis), inseparável da política.", pista: "Felicidade pela virtude", cat: "autores", ano: 4 },
  { id: "praxis", termo: "Práxis", autor: "Aristóteles", def: "Saber prático em que a ação e a finalidade são inseparáveis de quem age (diferente da técnica, em que o produto se separa).", pista: "Ação inseparável de quem age", cat: "ato", ano: 4 },
  { id: "coragem", termo: "Coragem", def: "Virtude entre a covardia (falta) e a temeridade (excesso).", pista: "Entre covardia e temeridade", cat: "virtudes", ano: 4 },
  { id: "temperanca", termo: "Temperança", def: "Virtude entre a insensibilidade (falta) e a libidinagem (excesso): moderação nos prazeres.", pista: "Moderação nos prazeres", cat: "virtudes", ano: 4 },
  { id: "liberalidade", termo: "Liberalidade", def: "Virtude entre a avareza (falta) e a prodigalidade (excesso): dar e gastar na medida.", pista: "Dar e gastar na medida", cat: "virtudes", ano: 4 },
  { id: "veracidade", termo: "Veracidade", def: "Virtude entre o descrédito próprio (falta) e a vaidade (excesso): dizer a verdade sobre si.", pista: "Dizer a verdade sobre si", cat: "virtudes", ano: 4 },
  { id: "prudencia", termo: "Prudência", def: "Uma das virtudes cardeais (com coragem, justiça e temperança): deliberar bem sobre o que fazer em cada situação.", pista: "Deliberar bem em cada caso", cat: "virtudes", ano: 4 },
  { id: "justica-virtude", termo: "Justiça (virtude)", def: "Virtude cardeal: dar a cada um o que lhe é devido. Para Aristóteles, a virtude completa, porque se refere ao outro.", pista: "Dar a cada um o que é devido", cat: "virtudes", ano: 4 },
  { id: "covardia", termo: "Covardia", def: "Vício por falta, oposto à coragem.", pista: "Falta de coragem", cat: "vicios", ano: 4 },
  { id: "temeridade", termo: "Temeridade", def: "Vício por excesso de ousadia, oposto à covardia; a coragem fica no meio.", pista: "Excesso de ousadia", cat: "vicios", ano: 4 },
  { id: "avareza", termo: "Avareza", def: "Vício por falta, oposto à prodigalidade; a liberalidade fica no meio. Também um dos sete pecados capitais.", pista: "Falta de generosidade", cat: "vicios", ano: 4 },
  { id: "prodigalidade", termo: "Prodigalidade", def: "Vício por excesso: gastar e dar sem medida.", pista: "Gastar e dar sem medida", cat: "vicios", ano: 4 },
  { id: "vaidade", termo: "Vaidade", def: "Vício por excesso, oposto ao descrédito próprio; a veracidade fica no meio.", pista: "Excesso de estima de si", cat: "vicios", ano: 4 },
  { id: "inveja", termo: "Inveja", def: "Vício por excesso, oposto à malevolência; a justa indignação fica no meio. Também pecado capital.", pista: "Sofrer com o bem do outro", cat: "vicios", ano: 4 },
  { id: "rousseau", termo: "Rousseau", autor: "1712–1778", def: "Moral do sentimento, ou do coração: a consciência e o sentimento do dever são inatos, 'a voz da natureza'; defende o livre-arbítrio.", pista: "A moral do coração", cat: "autores", ano: 4 },
  { id: "cuidado", termo: "Ética do cuidado", autor: "Gilligan, Noddings", def: "A ética que parte das relações, da atenção e da responsabilidade por quem depende de nós, e não só de regras gerais.", pista: "Responder por quem depende de nós", cat: "afetos", ano: 4 },
  { id: "confianca", termo: "Confiança", def: "Apostar na boa-fé do outro sem garantia. Sem ela, a vida em comum fica mais cara; com ela demais, cresce o risco do golpe.", pista: "Apostar na boa-fé do outro", cat: "justica", ano: 4 },

  // 5 · a proposta grande
  { id: "consequencialismo", termo: "Consequencialismo", def: "Julgar uma ação pelas suas consequências, e não pela intenção ou pelo dever.", pista: "Julgar pelas consequências", cat: "justica", ano: 5 },
  { id: "utilitarismo", termo: "Utilitarismo", autor: "Bentham, Mill", def: "A ação certa é a que produz a maior felicidade para o maior número de pessoas.", pista: "Maior bem para o maior número", cat: "justica", ano: 5 },
  { id: "humanidade-fim", termo: "Humanidade como fim", autor: "Kant", def: "2ª formulação: trate a humanidade, em você e nos outros, sempre como fim e nunca só como meio.", pista: "Pessoa como fim, nunca só meio", cat: "dever", ano: 5 },
  { id: "reino-fins", termo: "Reino dos fins", autor: "Kant", def: "3ª formulação: aja como membro legislador de uma comunidade em que todos são fins em si mesmos.", pista: "Legislar para todos como fins", cat: "dever", ano: 5 },
  { id: "responsabilidade", termo: "Responsabilidade", def: "Reconhecer-se autor da ação e responder pelas consequências previsíveis dela.", pista: "Responder pelas consequências", cat: "ato", ano: 5 },
  { id: "desejo", termo: "Desejo", def: "Impulso ou inclinação que surge espontaneamente e nem sempre está sob controle imediato (Chaui).", pista: "Impulso espontâneo", cat: "ato", ano: 5 },
  { id: "vontade", termo: "Vontade", def: "Capacidade de avaliar possibilidades e decidir como agir diante dos desejos (Chaui). O ato moral é um ato voluntário.", pista: "Decidir diante dos desejos", cat: "ato", ano: 5 },
  { id: "sartre", termo: "Sartre", autor: "1905–1980", def: "A existência precede a essência: não há finalidade humana pronta; construímos sentido pelas escolhas. 'Estamos condenados a ser livres.'", pista: "Condenados a ser livres", cat: "autores", ano: 5 },
  { id: "existencia", termo: "Existência precede a essência", autor: "Sartre", def: "Não nascemos com natureza ou finalidade definidas: nossa identidade e nossos valores se fazem pelas escolhas.", pista: "Somos o que escolhemos", cat: "afetos", ano: 5 },
  { id: "angustia", termo: "Angústia", autor: "Sartre", def: "O peso de saber que a escolha é nossa e que não escolher também é uma escolha.", pista: "O peso de ter de escolher", cat: "afetos", ano: 5 },
  { id: "situada", termo: "Liberdade situada", autor: "Merleau-Ponty", def: "Não somos livres apesar do mundo, mas graças às possibilidades que ele oferece: escolhemos dentro de condições concretas.", pista: "Livres graças às possibilidades", cat: "afetos", ano: 5 },
  { id: "possibilidade", termo: "Possibilidade × probabilidade", autor: "Merleau-Ponty", def: "Probabilidade é o que se prevê pelas tendências; possibilidade é o que a ação humana pode criar e mudar.", pista: "O que a ação pode criar", cat: "afetos", ano: 5 },

  // 6 · fechamento
  { id: "alma", termo: "Alma tripartite", autor: "Platão", def: "A alma tem três partes: desejos e impulsos, emoções (ânimo) e razão. Para Platão, a razão deve orientar as outras duas.", pista: "Desejo, emoção e razão", cat: "afetos", ano: 6 },
  { id: "platao", termo: "Platão", autor: "427–347 a.C.", def: "Valorizou a razão como guia da ação. Cuidado: valorizar a razão não dá a ninguém mais valor ético por condição ou estudo.", pista: "A razão guia a alma", cat: "autores", ano: 6 },
  { id: "hume", termo: "Hume", autor: "1711–1776", def: "A razão sozinha não move a ação: emoções e sentimentos participam do juízo moral. Abre caminho para a ética do afeto.", pista: "Sentimento no juízo moral", cat: "autores", ano: 6 },
  { id: "espinosa", termo: "Espinosa", autor: "1632–1677", def: "Bom é o que aumenta a nossa potência de agir; mau, o que a diminui. Liberdade é compreender as causas que nos determinam.", pista: "Potência de agir e afetos", cat: "autores", ano: 6 },
  { id: "afetos", termo: "Afetos", autor: "Espinosa", def: "Somos afetados e afetamos outros corpos; os afetos alegres aumentam e os tristes diminuem a nossa potência de agir.", pista: "Aumentam ou diminuem a potência", cat: "afetos", ano: 6 },
  { id: "freud", termo: "Id, ego e superego", autor: "Freud", def: "Id: os impulsos; ego: a mediação com a realidade, onde entram valores e fins; superego: a censura moral interiorizada.", pista: "Impulso, mediação e censura", cat: "afetos", ano: 6 },
  { id: "racionalismo", termo: "Racionalismo ético", def: "A razão no centro da vida ética: corrente intelectualista (o mal vem da ignorância) e voluntarista (o dever educa a vontade).", pista: "A razão no centro da ética", cat: "fundamentos", ano: 6 },
  { id: "macintyre", termo: "MacIntyre", autor: "1929–2025", def: "Em Depois da virtude: vivemos em muitas instituições (família, escola, profissão); a unidade ética da vida é como uma narrativa.", pista: "A vida como narrativa", cat: "autores", ano: 6 },
  { id: "kant", termo: "Kant", autor: "1724–1804", def: "Moral da razão prática: o valor moral depende da autonomia e de agir por dever; criou o imperativo categórico.", pista: "Moral da razão prática", cat: "autores", ano: 6 },
  { id: "deontologia", termo: "Deontologia", def: "Estudo dos deveres (do grego deon, dever). Na profissão: o conjunto de deveres de quem exerce um ofício.", pista: "Estudo dos deveres (deon)", cat: "dever", ano: 6 },
  { id: "codigo-confef", termo: "Código de Ética (CONFEF)", def: "A deontologia da Educação Física: os deveres do profissional com quem atende, com os colegas e com a sociedade.", pista: "Deveres do profissional de EF", cat: "dever", ano: 6 },
  { id: "estetica", termo: "Estética", def: "Reflexão sobre a arte, a beleza e o gosto, com suas dimensões emocionais e sensoriais; vizinha da ética no campo dos valores.", pista: "Arte, beleza e gosto", cat: "fundamentos", ano: 6 },
];

const POR_ID = Object.fromEntries(GLOSSARIO.map((v) => [v.id, v]));
export const verbete = (id) => POR_ID[id];

// Até onde a partida já chegou, na escala dos verbetes (0 = famílias, 1..5 = anos, 3,5 = lazer, 6 = fechamento)
export function marcoDe(st) {
  if (!st || st.fase === "entrada") return -1;
  if (st.fase === "familias") return 0;
  if (st.fase === "fechamento") return 6;
  if (st.fase === "lazer") return 3.5;
  if (st.ano === 4 && st.lazerFeito) return 4;
  return st.ano || 0;
}
export const desbloqueados = (st) => GLOSSARIO.filter((v) => v.ano <= marcoDe(st));
export const novosAgora = (st) => GLOSSARIO.filter((v) => v.ano === marcoDe(st));

// Os conceitos que o telão mostra em cada momento (etiqueta "conceito · autor"), na ordem em que aparecem
export const CONCEITOS_DO_MOMENTO = {
  familias: ["etica", "moral", "veu"],
  abertura1: ["bem-comum", "carona", "sujeito-moral"],
  abertura2: ["tragedia", "universalizacao", "ato-moral"],
  abertura3: ["justica-distributiva", "diferenca", "constituida"],
  conversa: ["contrato", "constituinte", "moral-aberta"],
  lazer: ["ocio"],
  abertura4: ["virtude", "justo-meio", "cuidado"],
  abertura5: ["consequencialismo", "humanidade-fim", "responsabilidade"],
};
export const etiqueta = (id) => { const v = POR_ID[id]; return v ? (v.autor && !/^\d|–/.test(v.autor) ? `${v.termo} · ${v.autor}` : v.termo) : ""; };
