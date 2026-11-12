// Conteúdo da cena "Academia, 19h — última semana do Desafio 90 dias".
// A cena é única e coerente por trás (a "verdade" serve para o confronto e o "duas semanas depois"),
// mas nada aqui é pista: os alunos tiram as conclusões a partir das fotos, do papel e das perguntas.
// Nomes e idades variam a cada sala; {chave} nos textos é trocado pelo nome sorteado.

export const NOMES = {
  personal: ["Rafael", "Diego", "Bruno", "Thiago"],
  bia: ["Bia", "Carol", "Fernanda", "Lívia"],
  kaua: ["Kauã", "Enzo", "Davi", "Pedro"],
  joaquim: ["Seu Joaquim", "Seu Antônio", "Seu Lauro", "Seu Valdir"],
  lara: ["Lara", "Isadora", "Manu", "Bruna"],
  dono: ["Marcos", "Ricardo", "Fábio"],
  mae: ["Dona Cláudia", "Dona Rose", "Dona Sueli", "Dona Márcia"],
  recep: ["Paula", "Nanda", "Jéssica"],
  colega: ["Gui", "Léo", "Matheus"],
};
export const IDADES = { bia: [25, 35], kaua: [16, 17], joaquim: [57, 66], lara: [20, 23], personal: [27, 38] };

export function sortearPersonagens(rand) {
  const n = {};
  for (const [k, lista] of Object.entries(NOMES)) n[k] = lista[Math.floor(rand() * lista.length)];
  const i = {};
  for (const [k, [a, b]] of Object.entries(IDADES)) i[k] = a + Math.floor(rand() * (b - a + 1));
  return { n, i };
}

export function txt(s, pers) {
  if (!pers) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => pers.n[k] ?? (k.endsWith("Idade") ? pers.i[k.replace("Idade", "")] : `{${k}}`));
}

// Pessoas da cena. O aluno não sabe os nomes: escolhe pela descrição. O nome aparece no confronto.
export const PESSOAS = {
  personal: { desc: "Homem de boné branco e camisa preta", nome: "{personal}, personal" },
  bia: { desc: "Mulher de camiseta branca e legging rosa", nome: "{bia}, aluna" },
  recep: { desc: "Recepcionista de camisa clara atrás do balcão", nome: "{recep}, recepcionista" },
  kaua: { desc: "Jovem de camiseta laranja de manga longa na área do supino", nome: "{kaua}, {kauaIdade} anos, aluno" },
  colega: { desc: "Rapaz de jaqueta azul-clara filmando com o celular", nome: "{colega}, aluno" },
  joaquim: { desc: "Senhor grisalho de jaqueta escura com sacola", nome: "{joaquim}, aluno" },
  lara: { desc: "Moça de boné e calça de agasalho azul", nome: "{lara}, estagiária" },
  turma: { desc: "Alunos da aula funcional", nome: "Turma da aula funcional" },
  dono: { desc: "Homem de camisa social azul no mezanino", nome: "{dono}, dono da academia" },
  homem: { desc: "Homem de camiseta vermelha ao lado do carro de porta-malas aberto", nome: "Fornecedor (não é aluno)" },
  treino: { desc: "Aluno de camiseta roxa treinando com halteres", nome: "Aluno do horário, sem relação com o caso" },
  mae: { desc: "Mulher de cabelo crespo e camiseta coral entrando pela porta de vidro", nome: "{mae}, mãe de {kaua}" },
};

// Afetados que não aparecem nas fotos (passo 2).
export const FORA = [
  { id: "familia", t: "A família do jovem" },
  { id: "desafio", t: "Os outros participantes do desafio" },
  { id: "clientes", t: "Os clientes da academia" },
  { id: "profissao", t: "A profissão e o CREF" },
  { id: "defesa", t: "Quem está sendo suspeito (direito de se defender)" },
];

// Papéis (grupos). prioridade: ordem de entrada quando há poucos grupos.
// fotos: 1 a 3; cada aluno recebe uma; o grupo vê todas. pessoas = quem aparece em cada foto.
export const PAPEIS = [
  {
    id: "recepcao", nome: "Recepção e atendimento", cor: "#10b981", prioridade: 1,
    abertura: "Você trabalha na recepção. São 19h, horário de pico, e o balcão está cheio.",
    ancora: { titulo: "Ficha de matrícula", texto: "{kaua} · {kauaIdade} anos · plano Desafio 90 dias · autorização assinada pela responsável: {mae}" },
    fotos: ["R1", "R2"], recebeDe: ["familia"], enviaPara: "gestao",
    gabarito: ["pode_proteger"],
  },
  {
    id: "tecnica", nome: "Equipe técnica (professores e personais)", cor: "#f43f5e", prioridade: 2,
    abertura: "Você é professor da academia e passa pela sala de avaliação para pegar uma ficha.",
    ancora: { titulo: "Escala de supervisão de estágio", texto: "Segunda a sexta, 18h–21h · supervisor: {personal} · estagiária: {lara}" },
    fotos: ["T1", "T2", "T3"], recebeDe: ["alunos", "gestao"], enviaPara: "rt",
    gabarito: ["contribui", "pode_proteger"],
  },
  {
    id: "estagiarios", nome: "Estagiários", cor: "#f59e0b", prioridade: 3,
    abertura: "Você é estagiário e está conduzindo a aula funcional das 19h.",
    ancora: { titulo: "Mensagem no grupo dos estagiários", texto: "\"Hoje cada um se vira na sua aula, a supervisão tá corrida. Qualquer coisa me chama.\" — {personal}" },
    fotos: ["E1", "E2"], recebeDe: [], enviaPara: "rt",
    gabarito: ["afetado"],
  },
  {
    id: "gestao", nome: "Gestão e direção", cor: "#8b5cf6", prioridade: 4,
    abertura: "Você é da gestão e observa a academia do mezanino.",
    ancora: { titulo: "Mensagem recebida ontem", texto: "\"Tão falando que tem personal vendendo 'protocolo' aqui dentro. Só pra você saber.\" — número desconhecido" },
    fotos: ["G1", "G2"], recebeDe: ["recepcao", "rt"], enviaPara: "tecnica",
    gabarito: ["contribui", "pode_proteger"],
  },
  {
    id: "rt", nome: "Responsável técnico", cor: "#38bdf8", prioridade: 5,
    abertura: "Você é o responsável técnico da academia e acaba de chegar para o turno da noite, pelo corredor do vestiário.",
    ancora: { titulo: "Registro no CREF", texto: "Responsável técnico pela academia e pela supervisão dos estágios perante o conselho." },
    fotos: ["V1", "V2"], recebeDe: ["tecnica", "estagiarios"], enviaPara: "gestao",
    gabarito: ["pode_proteger"],
  },
  {
    id: "alunos", nome: "Alunos da academia", cor: "#fb7185", prioridade: 6,
    abertura: "Você treina nessa academia há dois anos e está na área de pesos livres.",
    ancora: { titulo: "Grupo de WhatsApp do Desafio", texto: "\"Quem quiser acelerar o resultado fala comigo no privado 😉\" — mensagem apagada há 2 dias" },
    fotos: ["A1", "A2", "A3"], recebeDe: [], enviaPara: "tecnica",
    gabarito: ["pode_proteger", "testemunha"],
  },
  {
    id: "familia", nome: "Família e comunidade", cor: "#6366f1", prioridade: 7,
    abertura: "Você é a família de um aluno e chega de carro para buscá-lo no fim do treino.",
    ancora: { titulo: "Extrato do cartão do filho", texto: "Pix de R$ 350,00 para pessoa física · descrição: \"kit\" · há 5 dias" },
    fotos: ["F1", "F2"], recebeDe: [], enviaPara: "recepcao",
    gabarito: ["afetado", "pode_proteger"],
  },
];

export const PAPEL_NA_SITUACAO = {
  pode_proteger: "Meu papel pode proteger alguém aqui",
  contribui: "Meu papel contribui para o problema",
  afetado: "Meu papel é afetado pela situação",
  testemunha: "Meu papel é só de testemunha",
};

// Fotos: câmera (posição, alvo, campo de visão) e frases para classificar.
// tag = o que a frase é diante da imagem: fato (está na imagem), interp (interpretação), incerto (não dá para saber).
// real = se a frase corresponde ao que de fato aconteceu (usado só no confronto).
export const FOTOS = {
  R1: {
    titulo: "Balcão da recepção", pessoas: ["personal", "bia", "recep"],
    cam: { pos: [-0.35, 1.7, -3.3], alvo: [-0.75, 1.05, -6.6], fov: 48 },
    frases: [
      { t: "O homem de boné branco e a mulher de legging rosa seguram um envelope pardo.", tag: "fato", real: true },
      { t: "Sobre o balcão, ao lado deles, há um pote branco sem rótulo.", tag: "fato", real: true },
      { t: "A maquininha de cartão mostra R$ 480,00.", tag: "fato", real: true },
      { t: "O pote branco faz parte da venda.", tag: "interp", real: false, sobre: ["bia", "personal"] },
      { t: "O personal está vendendo algo para a mulher.", tag: "interp", real: false, sobre: ["bia", "personal"] },
      { t: "O envelope contém hormônios.", tag: "interp", real: false, sobre: ["bia"] },
      { t: "Não dá para saber o que tem dentro do envelope.", tag: "incerto", real: true },
    ],
  },
  R2: {
    titulo: "Parede e mesa da recepção", pessoas: ["recep"],
    cam: { pos: [1.4, 1.6, -4.4], alvo: [2.6, 1.6, -7.6], fov: 50 },
    frases: [
      { t: "Há um cartaz do Desafio 90 dias com prêmio de uma farmácia parceira.", tag: "fato", real: true },
      { t: "A academia lucra com a venda de produtos da farmácia.", tag: "interp", real: true, sobre: ["dono"] },
      { t: "A farmácia parceira vende hormônios para os alunos.", tag: "interp", real: false },
      { t: "Não dá para saber o que vem no kit do prêmio.", tag: "incerto", real: true },
    ],
  },
  T1: {
    titulo: "Mesa da sala de avaliação", pessoas: [],
    cam: { pos: [8.25, 1.4, -5.25], alvo: [8.6, 0.8, -6.3], fov: 44 },
    frases: [
      { t: "Há um papel com carimbo de médico sobre a mesa.", tag: "fato", real: true },
      { t: "O papel é uma receita usada para justificar a venda de hormônios.", tag: "interp", real: false, sobre: ["personal"] },
      { t: "O documento está à vista de quem entra na sala.", tag: "fato", real: true },
      { t: "Não dá para saber de quem é o documento.", tag: "incerto", real: true },
    ],
  },
  T2: {
    titulo: "Planilha do desafio na parede", pessoas: [],
    cam: { pos: [9.7, 1.6, -5.0], alvo: [11.9, 1.6, -5.0], fov: 40 },
    frases: [
      { t: "A planilha mostra nomes e percentual de gordura de todos os participantes.", tag: "fato", real: true },
      { t: "Um participante perdeu muita gordura em pouco tempo.", tag: "fato", real: true },
      { t: "Quem evoluiu muito rápido está usando hormônio.", tag: "interp", real: false, sobre: ["bia", "kaua"] },
      { t: "Não dá para saber como cada um conseguiu o resultado.", tag: "incerto", real: true },
    ],
  },
  T3: {
    titulo: "Celular esquecido na sala", pessoas: [],
    cam: { pos: [9.1, 1.12, -5.68], alvo: [9.3, 0.8, -6.2], fov: 34 },
    frases: [
      { t: "Há um celular aceso com a mensagem \"chegou o seu ✓\".", tag: "fato", real: true },
      { t: "O celular é do personal.", tag: "interp", real: true, sobre: ["personal"] },
      { t: "A mensagem se refere a uma entrega de hormônio.", tag: "interp", real: true, sobre: ["personal"] },
      { t: "Não dá para saber quem mandou nem o que chegou.", tag: "incerto", real: true },
    ],
  },
  A1: {
    titulo: "Área de pesos livres", pessoas: ["kaua", "colega"],
    cam: { pos: [5.4, 1.6, 4.4], alvo: [8.5, 1.0, 2.3], fov: 50 },
    frases: [
      { t: "Um jovem de camiseta laranja está ao lado do supino enquanto outro o filma com o celular.", tag: "fato", real: true },
      { t: "No banco do supino, outro aluno está deitado, descansando entre as séries.", tag: "fato", real: true },
      { t: "O jovem é menor de idade.", tag: "incerto", real: true, sobre: ["kaua"] },
      { t: "O jovem está usando anabolizante.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "O vídeo vai para as redes sociais.", tag: "interp", real: false },
    ],
  },
  A2: {
    titulo: "Banco ao lado do supino", pessoas: ["kaua"],
    cam: { pos: [7.0, 1.1, 3.6], alvo: [7.6, 0.45, 4.3], fov: 42 },
    frases: [
      { t: "Há uma mochila aberta com um pote branco sem rótulo.", tag: "fato", real: true },
      { t: "O pote é de hormônio.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "A mochila é do jovem de camiseta laranja.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "Não dá para saber o que tem no pote.", tag: "incerto", real: true },
    ],
  },
  A3: {
    titulo: "Do aparelho de peito, olhando para a recepção", pessoas: ["personal", "bia", "recep"],
    cam: { pos: [3.4, 1.45, -2.2], alvo: [-0.85, 1.0, -6.4], fov: 36 },
    frases: [
      { t: "A estrutura do aparelho tapa parte do balcão e do homem de boné branco.", tag: "fato", real: true },
      { t: "A mulher de legging rosa está de frente para o homem de boné, junto ao balcão.", tag: "fato", real: true },
      { t: "O homem de boné está escondendo alguma coisa.", tag: "interp", real: false, sobre: ["personal"] },
      { t: "A mulher de legging rosa está comprando alguma coisa dele.", tag: "interp", real: false, sobre: ["bia"] },
      { t: "Não dá para ver o que acontece entre os dois.", tag: "incerto", real: true },
    ],
  },
  E1: {
    titulo: "Aula funcional", pessoas: ["lara", "turma"],
    cam: { pos: [-3.6, 1.7, 1.6], alvo: [-7.4, 0.9, 4.8], fov: 54 },
    frases: [
      { t: "Uma estagiária conduz sozinha uma turma grande.", tag: "fato", real: true },
      { t: "Não há professor supervisionando a aula.", tag: "fato", real: true },
      { t: "A estagiária não tem preparo para essa turma.", tag: "interp", real: false, sobre: ["lara"] },
      { t: "Não dá para saber por que o supervisor não está ali.", tag: "incerto", real: true },
    ],
  },
  E2: {
    titulo: "Quadro do ranking e a recepção ao fundo", pessoas: ["personal", "bia"],
    cam: { pos: [-6.0, 1.6, 2.4], alvo: [-1.0, 1.3, -6.0], fov: 46 },
    frases: [
      { t: "Um aluno treinando com halteres fica na frente e tapa parte do balcão.", tag: "fato", real: true },
      { t: "Ao fundo, o supervisor está no balcão da recepção com uma aluna.", tag: "fato", real: true },
      { t: "O ranking do desafio destaca os primeiros colocados.", tag: "fato", real: true },
      { t: "Não dá para ver o que eles têm nas mãos.", tag: "incerto", real: true },
      { t: "O supervisor está ocupado com algo mais importante que a aula.", tag: "interp", real: false, sobre: ["personal"] },
      { t: "Não dá para saber o que acontece no balcão.", tag: "incerto", real: true },
    ],
  },
  G1: {
    titulo: "Vista do mezanino", pessoas: ["personal", "bia", "kaua", "lara", "turma"],
    cam: { pos: [-9.4, 5.2, -5.4], alvo: [1.0, 0.6, 1.0], fov: 62 },
    frases: [
      { t: "Do alto se vê o balcão, a aula funcional e a área de pesos.", tag: "fato", real: true },
      { t: "Tudo parece normal num horário de pico.", tag: "interp", real: false },
      { t: "A estagiária está sem supervisão.", tag: "fato", real: true, sobre: ["lara"] },
      { t: "Não dá para saber o que cada pessoa está fazendo.", tag: "incerto", real: true },
    ],
  },
  G2: {
    titulo: "Mesa do escritório", pessoas: ["dono"],
    cam: { pos: [-9.0, 4.65, -6.85], alvo: [-9.7, 4.05, -7.45], fov: 46 },
    frases: [
      { t: "Há um contrato de parceria com uma farmácia de manipulação sobre a mesa.", tag: "fato", real: true },
      { t: "A gestão sabe de irregularidades e não age.", tag: "interp", real: true, sobre: ["dono"] },
      { t: "O contrato é ilegal.", tag: "interp", real: false },
      { t: "Não dá para saber o que diz o contrato.", tag: "incerto", real: true },
    ],
  },
  V1: {
    titulo: "Lixeira do corredor", pessoas: [],
    cam: { pos: [5.22, 0.98, 6.42], alvo: [5.6, 0.62, 6.9], fov: 34 },
    frases: [
      { t: "Na lixeira há uma caixa de remédio rasgada; dá para ler \"...terona\".", tag: "fato", real: true },
      { t: "A caixa é do jovem de laranja da área de pesos.", tag: "interp", real: false, sobre: ["kaua"] },
      { t: "Alguém da academia usa testosterona.", tag: "interp", real: true },
      { t: "Não dá para saber se o remédio foi receitado.", tag: "incerto", real: true },
    ],
  },
  V2: {
    titulo: "Saída do vestiário", pessoas: ["joaquim"],
    cam: { pos: [3.4, 1.6, 4.2], alvo: [6.4, 1.2, 7.2], fov: 50 },
    frases: [
      { t: "Um senhor sai do vestiário com uma sacola de farmácia.", tag: "fato", real: true },
      { t: "A caixa da lixeira é desse senhor.", tag: "interp", real: true, sobre: ["joaquim"] },
      { t: "O senhor usa hormônio para ganhar músculo.", tag: "interp", real: false, sobre: ["joaquim"] },
      { t: "Não dá para saber o que tem na sacola.", tag: "incerto", real: true },
    ],
  },
  F1: {
    titulo: "Estacionamento", pessoas: ["homem"],
    cam: { pos: [-12.0, 1.6, 1.2], alvo: [-15.0, 1.0, -2.0], fov: 50 },
    frases: [
      { t: "Um homem ao celular está ao lado de um carro com o porta-malas aberto e caixas de isopor.", tag: "fato", real: true },
      { t: "O homem entrega produtos ilegais na academia.", tag: "interp", real: true, sobre: ["homem"] },
      { t: "O homem é entregador de comida.", tag: "interp", real: false },
      { t: "Não dá para saber o que há nas caixas.", tag: "incerto", real: true },
    ],
  },
  F2: {
    titulo: "Porta de vidro da entrada", pessoas: ["mae", "kaua"],
    cam: { pos: [-13.8, 1.7, -1.6], alvo: [-6.0, 1.2, 1.6], fov: 52 },
    frases: [
      { t: "Uma mulher entra pela porta de vidro olhando para a área de treino.", tag: "fato", real: true },
      { t: "Ao fundo, um jovem de laranja está na área de pesos.", tag: "fato", real: true },
      { t: "A mulher veio cobrar a academia por alguma coisa.", tag: "interp", real: false, sobre: ["mae"] },
      { t: "Não dá para saber quem ela veio buscar.", tag: "incerto", real: true },
    ],
  },
};

// Cartas-conceito da mochila (aula: princípios, teorias, responsabilidade e deveres).
export const CARTAS = {
  autonomia: { nome: "Respeito à pessoa / autonomia", grupo: "Princípios" },
  beneficencia: { nome: "Beneficência", grupo: "Princípios" },
  naoMaleficencia: { nome: "Não maleficência", grupo: "Princípios" },
  justica: { nome: "Justiça e equidade", grupo: "Princípios" },
  utilitarismo: { nome: "Utilitarismo (consequências)", grupo: "Teorias" },
  deontologia: { nome: "Deontologia (deveres)", grupo: "Teorias" },
  cuidado: { nome: "Ética do cuidado", grupo: "Teorias" },
  complexidade: { nome: "Ética da complexidade", grupo: "Teorias" },
  omissao: { nome: "Ação, omissão e transferência", grupo: "Responsabilidade" },
  duploEfeito: { nome: "Duplo efeito", grupo: "Responsabilidade" },
  negligencia: { nome: "Imperícia, imprudência, negligência", grupo: "Responsabilidade" },
  informacao: { nome: "Dever de informação", grupo: "Deveres" },
  vigilancia: { nome: "Dever de vigilância", grupo: "Deveres" },
  abuso: { nome: "Abstenção de abuso", grupo: "Deveres" },
  sigilo: { nome: "Consentimento, privacidade e sigilo", grupo: "Deveres" },
  competencia: { nome: "Limites de competência", grupo: "Deveres" },
  salvaguardas: { nome: "Salvaguardas", grupo: "Deveres" },
};

// Pessoas acompanhadas no "duas semanas depois". inicio = situação de partida (0 = bem; maior = pior).
export const DIMENSOES = {
  kaua: { curto: "O jovem de camiseta laranja", nome: "{kaua} (menor de idade)", inicio: 3, limite: 1, bem: "{kaua} foi acolhido, a mãe soube a tempo e ele passou por avaliação médica. Os exames mostraram alterações, mas ele parou antes de algo grave.", mal: "Ninguém olhou por {kaua}. Duas semanas depois, a mãe chega à academia com exames alterados do filho e pergunta quem orientou o uso." },
  bia: { curto: "A mulher de legging rosa", nome: "{bia} (aluna com laudo)", inicio: 1, limite: 0, bem: "O laudo de {bia} foi recolhido e ninguém falou dele. Ela segue treinando com o treino adaptado.", mal: "{bia} descobriu que o laudo dela circulou e que foi apontada como compradora de hormônio. Cancelou o plano." },
  joaquim: { curto: "O senhor grisalho", nome: "{joaquim}", inicio: 1, limite: 0, bem: "A caixa com os dados de {joaquim} foi recolhida. O tratamento dele continua sendo assunto dele.", mal: "A caixa com o nome de {joaquim} virou piada no vestiário. Ele deixou de frequentar o horário da noite." },
  lara: { curto: "A estagiária", nome: "{lara} (estagiária)", inicio: 2, limite: 0, bem: "A supervisão do estágio foi reorganizada e {lara} voltou a ter um professor com ela.", mal: "{lara} seguiu sozinha com turmas cheias. Na semana seguinte um aluno se machucou na aula dela, sem supervisor por perto." },
  venda: { curto: "A suspeita de venda", nome: "A venda dentro da academia", inicio: 3, limite: 1, bem: "A apuração ouviu o personal, confirmou a venda e ele foi afastado. O caso foi comunicado ao CREF.", mal: "A venda continuou. Mais dois participantes do desafio compraram o \"kit\"." },
  processo: { curto: "Quem está sendo suspeito", nome: "Justiça com quem é suspeito", inicio: 0, limite: -1, invertido: true, bem: "As suspeitas foram apuradas com escuta das partes, sem exposição pública antes da hora.", mal: "Houve acusação pública antes de apurar. Pessoas inocentes foram expostas e o caso virou boato." },
  conflito: { curto: "A parceria com a farmácia", nome: "Conflito de interesse da academia", inicio: 2, limite: 1, bem: "A parceria com a farmácia e o prêmio foram suspensos para revisão.", mal: "A parceria seguiu, e o prêmio do desafio continuou vindo da farmácia." },
};

// Alternativas por papel (passos 5 a 7). efeitos somam nas dimensões (negativo = melhora; em "processo", positivo = melhora).
export const ALTERNATIVAS = {
  recepcao: [
    { id: "r_mae", t: "Avisar a responsável pelo aluno menor da ficha quando ela chegar", ef: { kaua: -2 } },
    { id: "r_gestao", t: "Informar a gestão sobre o pagamento e a ficha do menor", ef: { venda: -1, kaua: -1 } },
    { id: "r_bia", t: "Perguntar à mulher de rosa o que havia no envelope", ef: { bia: 1, processo: -1 }, alvo: "bia" },
    { id: "r_nada", t: "Não fazer nada: não é função da recepção", ef: {} },
  ],
  tecnica: [
    { id: "t_guardar", t: "Recolher e guardar o documento carimbado (sigilo)", ef: { bia: -1 } },
    { id: "t_rt", t: "Levar ao responsável técnico o que se sabe e o que não se sabe", ef: { venda: -1, processo: 1 } },
    { id: "t_publico", t: "Questionar o colega personal na frente de todos", ef: { venda: -1, processo: -2 }, alvo: "personal" },
    { id: "t_bia", t: "Chamar a mulher de rosa para explicar o envelope", ef: { bia: 2, processo: -1 }, alvo: "bia" },
    { id: "t_nada", t: "Não se meter no trabalho do colega", ef: {} },
  ],
  estagiarios: [
    { id: "e_super", t: "Pedir supervisão ao responsável técnico agora", ef: { lara: -1 } },
    { id: "e_adaptar", t: "Adaptar a aula para a turma ficar segura até chegar supervisão", ef: { lara: -1 } },
    { id: "e_relatar", t: "Relatar ao responsável técnico o que viu, separando visto de suposto", ef: { venda: -1, processo: 1 } },
    { id: "e_nada", t: "Seguir a aula e não comentar nada", ef: {} },
  ],
  gestao: [
    { id: "g_apurar", t: "Abrir apuração: ouvir o personal e afastá-lo das turmas enquanto apura", ef: { venda: -2, processo: 1, kaua: -1 } },
    { id: "g_parceria", t: "Suspender a parceria e o prêmio da farmácia até revisão", ef: { conflito: -2 } },
    { id: "g_supervisao", t: "Reorganizar a supervisão dos estagiários", ef: { lara: -2 } },
    { id: "g_demitir", t: "Demitir o personal hoje, sem ouvi-lo", ef: { venda: -2, processo: -2 }, alvo: "personal" },
    { id: "g_abafar", t: "Resolver em silêncio para não manchar a academia", ef: { venda: 1, conflito: 1, processo: -1 } },
  ],
  rt: [
    { id: "v_acolher", t: "Procurar o aluno que pode estar usando hormônio, acolher, falar com a família e orientar avaliação médica", ef: { kaua: -2 } },
    { id: "v_assumir", t: "Assumir agora a supervisão da estagiária", ef: { lara: -2 } },
    { id: "v_sigilo", t: "Recolher a caixa com dados do aluno e preservar o sigilo", ef: { joaquim: -1 } },
    { id: "v_apurar", t: "Levar à gestão uma apuração com escuta das partes e, se confirmado, comunicar ao CREF", ef: { venda: -2, processo: 1 } },
    { id: "v_denunciar", t: "Denunciar já ao CREF e à polícia, sem apurar", ef: { venda: -1, processo: -1 }, alvo: "personal" },
  ],
  alunos: [
    { id: "a_conversar", t: "Conversar com o jovem de laranja, sem expor", ef: { kaua: -1 } },
    { id: "a_contar", t: "Contar a um professor ou ao responsável técnico o que viram", ef: { venda: -1, kaua: -1 } },
    { id: "a_grupo", t: "Comentar no grupo de WhatsApp do desafio", ef: { bia: 1, joaquim: 1, processo: -1 } },
    { id: "a_nada", t: "Não é problema nosso", ef: {} },
  ],
  familia: [
    { id: "f_filho", t: "Conversar com o filho e buscar avaliação médica", ef: { kaua: -2 } },
    { id: "f_academia", t: "Pedir explicações formais à academia", ef: { venda: -1 } },
    { id: "f_expor", t: "Expor a academia nas redes sociais", ef: { processo: -2, conflito: -1 } },
    { id: "f_nada", t: "Esperar para ver se é verdade", ef: {} },
  ],
};

export const LENTES = [
  { id: "utilitarismo", nome: "Consequências", q: "Quem se beneficia e quem é prejudicado? Há alternativa com melhores consequências?" },
  { id: "deontologia", nome: "Deveres", q: "Que deveres e direitos são respeitados ou violados, independentemente do resultado?" },
  { id: "cuidado", nome: "Cuidado", q: "Quem está vulnerável e depende de alguém aqui? A relação de confiança é preservada?" },
  { id: "justica", nome: "Justiça e equidade", q: "Quem assume os riscos? Alguém é tratado de forma injusta?" },
  { id: "complexidade", nome: "Complexidade", q: "Que efeitos indiretos podem aparecer? Como acompanhar e corrigir?" },
];

export const ABERTURA = "Academia de bairro, 19h, horário de pico na última semana do Desafio 90 dias. O prêmio do desafio é patrocinado por uma farmácia parceira. Cada um de vocês está em um lugar da academia.";
export const CONCLUSAO = "Cada um de vocês vê a academia do lugar onde está, e ninguém vê tudo.";
