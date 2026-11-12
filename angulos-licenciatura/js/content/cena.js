// Conteúdo da cena "Escola, 15h30 — último treino antes dos Jogos Escolares" (versão Licenciatura).
// A cena é única e coerente por trás (a "verdade" serve para o confronto e o "duas semanas depois"),
// mas nada aqui é pista: os alunos tiram as conclusões a partir das fotos, do papel e das perguntas.
// Nomes e idades variam a cada sala; {chave} nos textos é trocado pelo nome sorteado.
// Os ids internos (personal, bia, kaua...) vêm da versão da academia; aqui são o técnico, a professora, o aluno etc.

export const NOMES = {
  personal: ["Rafael", "Diego", "Bruno", "Thiago"],
  bia: ["Prof.ª Carla", "Prof.ª Renata", "Prof.ª Juliana", "Prof.ª Patrícia"],
  kaua: ["Kauã", "Enzo", "Davi", "Pedro"],
  joaquim: ["Seu Joaquim", "Seu Antônio", "Seu Lauro", "Seu Valdir"],
  lara: ["Lara", "Isadora", "Manu", "Bruna"],
  dono: ["Marcos", "Ricardo", "Fábio"],
  mae: ["Dona Cláudia", "Dona Rose", "Dona Sueli", "Dona Márcia"],
  recep: ["Paula", "Nanda", "Jéssica"],
  colega: ["Gui", "Léo", "Matheus"],
};
export const IDADES = { bia: [32, 45], kaua: [16, 17], joaquim: [57, 66], lara: [20, 23], personal: [27, 38] };

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
  personal: { desc: "Homem de boné branco e camisa preta", nome: "{personal}, técnico voluntário do time (indicado pela loja patrocinadora)" },
  bia: { desc: "Mulher de camiseta branca e legging rosa", nome: "{bia}, professora de Educação Física da escola" },
  recep: { desc: "Secretária de camisa clara atrás do balcão", nome: "{recep}, secretária da escola" },
  kaua: { desc: "Jovem de camiseta laranja de manga longa na sala de treino", nome: "{kaua}, {kauaIdade} anos, aluno do 2º ano e atleta do time" },
  colega: { desc: "Rapaz de jaqueta azul-clara filmando com o celular", nome: "{colega}, aluno do 3º ano e atleta do time" },
  joaquim: { desc: "Senhor grisalho de jaqueta escura com sacola", nome: "{joaquim}, servente da escola" },
  lara: { desc: "Moça de boné e calça de agasalho azul", nome: "{lara}, estagiária de Licenciatura em Educação Física" },
  turma: { desc: "Crianças da aula na quadra", nome: "Turma do 5º ano" },
  dono: { desc: "Homem de camisa social azul na sala da direção", nome: "{dono}, diretor da escola" },
  homem: { desc: "Homem de camiseta vermelha ao lado do carro de porta-malas aberto", nome: "Fornecedor (não é da escola)" },
  treino: { desc: "Aluno de camiseta roxa treinando com halteres", nome: "Aluno do time, sem relação com o caso" },
  mae: { desc: "Mulher de cabelo crespo e camiseta coral entrando pelo portão", nome: "{mae}, mãe de {kaua}" },
};

// Afetados que não aparecem nas fotos (passo 2).
export const FORA = [
  { id: "familia", t: "A família do aluno" },
  { id: "desafio", t: "Os outros atletas do time e das escolas adversárias" },
  { id: "clientes", t: "A comunidade escolar (alunos, famílias, professores)" },
  { id: "profissao", t: "A profissão docente e a formação dos estagiários" },
  { id: "defesa", t: "Quem está sendo suspeito (direito de se defender)" },
];

// Papéis (grupos). prioridade: ordem de entrada quando há poucos grupos.
// fotos: 1 a 3; cada aluno recebe uma; o grupo vê todas. pessoas = quem aparece em cada foto.
export const PAPEIS = [
  {
    id: "recepcao", nome: "Secretaria da escola", cor: "#10b981", prioridade: 1,
    abertura: "Você trabalha na secretaria. São 15h30, o balcão está cheio com as inscrições dos Jogos Escolares.",
    ancora: { titulo: "Ficha de inscrição nos Jogos", texto: "{kaua} · {kauaIdade} anos · 2º ano · modalidade: atletismo e força · autorização assinada pela responsável: {mae}" },
    fotos: ["R1", "R2"], recebeDe: ["familia"], enviaPara: "gestao",
    gabarito: ["pode_proteger"],
  },
  {
    id: "tecnica", nome: "Professores de Educação Física", cor: "#f43f5e", prioridade: 2,
    abertura: "Você é professor de Educação Física da escola e passa pela sala de Educação Física para pegar material.",
    ancora: { titulo: "Escala da quadra", texto: "15h30 · 5º ano · regente: {bia} · estagiária: {lara} (estágio supervisionado, com acompanhamento previsto no plano de estágio)" },
    fotos: ["T1", "T2", "T3"], recebeDe: ["alunos", "gestao"], enviaPara: "rt",
    gabarito: ["contribui", "pode_proteger"],
  },
  {
    id: "estagiarios", nome: "Estagiários de Licenciatura", cor: "#f59e0b", prioridade: 3,
    abertura: "Você é estagiário de Licenciatura e está com a turma do 5º ano na quadra.",
    ancora: { titulo: "Mensagem da professora regente", texto: "\"Começa a aula sem mim, vou resolver a inscrição dos Jogos na secretaria e já volto.\" — {bia}" },
    fotos: ["E1", "E2"], recebeDe: [], enviaPara: "rt",
    gabarito: ["afetado"],
  },
  {
    id: "gestao", nome: "Direção da escola", cor: "#8b5cf6", prioridade: 4,
    abertura: "Você é da direção e olha a escola pela janela da sala da direção, no primeiro andar.",
    ancora: { titulo: "Mensagem recebida ontem", texto: "\"Tão falando que o técnico do time tá vendendo 'kit' pros alunos. Só pra você saber.\" — número desconhecido" },
    fotos: ["G1", "G2"], recebeDe: ["recepcao", "rt"], enviaPara: "tecnica",
    gabarito: ["contribui", "pode_proteger"],
  },
  {
    id: "rt", nome: "Coordenação pedagógica", cor: "#38bdf8", prioridade: 5,
    abertura: "Você é da coordenação pedagógica, responde pelos estágios e pelo acompanhamento dos alunos, e chega pelo corredor do vestiário.",
    ancora: { titulo: "Lembrete na agenda da coordenação", texto: "Confira os termos de estágio, o acompanhamento previsto e os protocolos de proteção da escola. Avalie a situação e os canais de encaminhamento adequados." },
    fotos: ["V1", "V2"], recebeDe: ["tecnica", "estagiarios"], enviaPara: "gestao",
    gabarito: ["pode_proteger"],
  },
  {
    id: "alunos", nome: "Alunos do time", cor: "#fb7185", prioridade: 6,
    abertura: "Você é aluno do ensino médio, joga no time da escola e está na sala de treino.",
    ancora: { titulo: "Grupo de WhatsApp do time", texto: "\"Quem quiser chegar voando nos Jogos fala comigo no privado 😉\" — mensagem apagada há 2 dias" },
    fotos: ["A1", "A2", "A3"], recebeDe: [], enviaPara: "tecnica",
    gabarito: ["pode_proteger", "testemunha"],
  },
  {
    id: "familia", nome: "Família e comunidade", cor: "#6366f1", prioridade: 7,
    abertura: "Você é da família de um aluno e chega de carro para buscá-lo depois do treino.",
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
    titulo: "Balcão da secretaria", pessoas: ["personal", "bia", "recep"],
    cam: { pos: [-0.35, 1.7, -3.3], alvo: [-0.75, 1.05, -6.6], fov: 48 },
    frases: [
      { t: "A mulher de legging rosa segura um envelope pardo em frente ao homem de boné branco.", tag: "fato", real: true },
      { t: "Sobre o balcão, ao lado deles, há um pote branco sem rótulo.", tag: "fato", real: true },
      { t: "Não é possível ler o valor do recibo nesta imagem.", tag: "incerto", real: true },
      { t: "O pote branco faz parte da venda.", tag: "interp", real: false, sobre: ["bia", "personal"] },
      { t: "O homem de boné está vendendo algo para a mulher.", tag: "interp", real: false, sobre: ["bia", "personal"] },
      { t: "O envelope contém hormônios.", tag: "interp", real: false, sobre: ["bia"] },
      { t: "Não dá para saber o que tem dentro do envelope.", tag: "incerto", real: true },
    ],
  },
  R2: {
    titulo: "Parede da secretaria", pessoas: ["recep"],
    cam: { pos: [1.4, 1.6, -4.4], alvo: [2.6, 1.6, -7.6], fov: 50 },
    frases: [
      { t: "Há um cartaz dos Jogos Escolares com patrocínio de uma loja de suplementos.", tag: "fato", real: true },
      { t: "Ao lado do cartaz há uma prateleira com produtos de suplemento.", tag: "fato", real: true },
      { t: "A escola recebe vantagens da loja patrocinadora.", tag: "interp", real: true, sobre: ["dono"] },
      { t: "A loja vende hormônios para os alunos.", tag: "interp", real: false },
      { t: "Não dá para saber o que a loja recebe em troca do patrocínio.", tag: "incerto", real: true },
    ],
  },
  T1: {
    titulo: "Mesa da sala de Educação Física", pessoas: [],
    cam: { pos: [8.25, 1.4, -5.25], alvo: [8.6, 0.8, -6.3], fov: 44 },
    frases: [
      { t: "Há um papel com carimbo de médico sobre a mesa.", tag: "fato", real: true },
      { t: "O papel é uma receita usada para justificar a venda de hormônios.", tag: "interp", real: false, sobre: ["personal"] },
      { t: "O documento está à vista de quem entra na sala.", tag: "fato", real: true },
      { t: "Não dá para saber de quem é o documento.", tag: "incerto", real: true },
    ],
  },
  T2: {
    titulo: "Quadro de avaliação do time", pessoas: [],
    cam: { pos: [9.7, 1.6, -5.0], alvo: [11.9, 1.6, -5.0], fov: 40 },
    frases: [
      { t: "O quadro mostra nomes e percentual de gordura dos atletas do time.", tag: "fato", real: true },
      { t: "Um atleta perdeu muita gordura em pouco tempo.", tag: "fato", real: true },
      { t: "Quem evoluiu muito rápido está usando hormônio.", tag: "interp", real: false, sobre: ["kaua", "colega"] },
      { t: "Não dá para saber como cada um conseguiu o resultado.", tag: "incerto", real: true },
    ],
  },
  T3: {
    titulo: "Celular esquecido na sala", pessoas: [],
    cam: { pos: [8.6, 1.12, -6.33], alvo: [8.8, 0.8, -6.85], fov: 34 },
    frases: [
      { t: "Há um celular aceso com a mensagem \"chegou o seu ✓\".", tag: "fato", real: true },
      { t: "O celular é do técnico do time.", tag: "interp", real: true, sobre: ["personal"] },
      { t: "A mensagem se refere a uma entrega de hormônio.", tag: "interp", real: true, sobre: ["personal"] },
      { t: "Não dá para saber quem mandou nem o que chegou.", tag: "incerto", real: true },
    ],
  },
  A1: {
    titulo: "Sala de treino do time", pessoas: ["kaua", "colega"],
    cam: { pos: [5.4, 1.6, 4.4], alvo: [8.5, 1.0, 2.3], fov: 50 },
    frases: [
      { t: "Um jovem de camiseta laranja está ao lado do supino enquanto outro o filma com o celular.", tag: "fato", real: true },
      { t: "No banco do supino, outro aluno está deitado, descansando entre as séries.", tag: "fato", real: true },
      { t: "Não há professor da escola na sala de treino.", tag: "fato", real: true },
      { t: "O jovem é menor de idade.", tag: "incerto", real: true, sobre: ["kaua"] },
      { t: "O jovem está usando anabolizante.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "O vídeo vai para as redes sociais.", tag: "interp", real: false },
    ],
  },
  A2: {
    titulo: "Banco ao lado do supino", pessoas: ["kaua"],
    cam: { pos: [6.85, 1.25, 3.45], alvo: [7.6, 0.6, 4.3], fov: 42 },
    frases: [
      { t: "Há uma mochila aberta com um pote branco sem rótulo.", tag: "fato", real: true },
      { t: "O pote é de hormônio.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "A mochila é do jovem de camiseta laranja.", tag: "interp", real: true, sobre: ["kaua"] },
      { t: "Não dá para saber o que tem no pote.", tag: "incerto", real: true },
    ],
  },
  A3: {
    titulo: "Do aparelho da sala de treino, olhando para a secretaria", pessoas: ["personal", "bia", "recep"],
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
    titulo: "Aula na quadra", pessoas: ["lara", "turma"],
    cam: { pos: [-3.6, 1.7, 1.6], alvo: [-7.4, 0.9, 4.8], fov: 54 },
    frases: [
      { t: "Uma mulher conduz uma turma de crianças na quadra.", tag: "fato", real: true },
      { t: "Esta imagem, sozinha, não comprova quem supervisiona a aula.", tag: "incerto", real: true },
      { t: "A estagiária não tem preparo para essa turma.", tag: "interp", real: false, sobre: ["lara"] },
      { t: "Não dá para saber por que a professora regente não está ali.", tag: "incerto", real: true },
    ],
  },
  E2: {
    titulo: "Quadro dos Jogos e a secretaria ao fundo", pessoas: ["personal", "bia"],
    cam: { pos: [-6.0, 1.6, 2.4], alvo: [-1.0, 1.3, -6.0], fov: 46 },
    frases: [
      { t: "Um aluno treinando com halteres fica na frente e tapa parte do balcão.", tag: "fato", real: true },
      { t: "Ao fundo, a professora regente está no balcão da secretaria com um homem de boné.", tag: "fato", real: true },
      { t: "O quadro dos Jogos destaca o time da escola.", tag: "fato", real: true },
      { t: "Não dá para ver o que eles têm nas mãos.", tag: "incerto", real: true },
      { t: "A professora está ocupada com algo mais importante que a aula.", tag: "interp", real: false, sobre: ["bia"] },
      { t: "Não dá para saber o que acontece no balcão.", tag: "incerto", real: true },
    ],
  },
  G1: {
    titulo: "Vista da janela da direção", pessoas: ["personal", "bia", "kaua", "lara", "turma"],
    cam: { pos: [-9.4, 5.2, -5.4], alvo: [1.0, 0.6, 1.0], fov: 62 },
    frases: [
      { t: "Da janela se vê a secretaria, a quadra e a sala de treino.", tag: "fato", real: true },
      { t: "Tudo parece normal numa tarde de treino.", tag: "interp", real: false },
      { t: "A estagiária está sem supervisão.", tag: "fato", real: true, sobre: ["lara"] },
      { t: "Não dá para saber o que cada pessoa está fazendo.", tag: "incerto", real: true },
    ],
  },
  G2: {
    titulo: "Mesa da direção", pessoas: ["dono"],
    cam: { pos: [-9.0, 4.65, -6.85], alvo: [-9.7, 4.05, -7.45], fov: 46 },
    frases: [
      { t: "Há um contrato de patrocínio com uma loja de suplementos e manipulação sobre a mesa.", tag: "fato", real: true },
      { t: "A direção sabe de irregularidades e não age.", tag: "interp", real: true, sobre: ["dono"] },
      { t: "O contrato é ilegal.", tag: "interp", real: false },
      { t: "Não dá para saber o que diz o contrato.", tag: "incerto", real: true },
    ],
  },
  V1: {
    titulo: "Lixeira do corredor do vestiário", pessoas: [],
    cam: { pos: [5.22, 0.98, 6.42], alvo: [5.6, 0.62, 6.9], fov: 34 },
    frases: [
      { t: "Na lixeira há uma caixa de remédio rasgada; dá para ler \"...terona\".", tag: "fato", real: true },
      { t: "A caixa é do jovem de laranja do time.", tag: "interp", real: false, sobre: ["kaua"] },
      { t: "Alguém da escola usa testosterona.", tag: "interp", real: true },
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
    titulo: "Rua em frente à escola", pessoas: ["homem"],
    cam: { pos: [-12.0, 1.6, 1.2], alvo: [-15.0, 1.0, -2.0], fov: 50 },
    frases: [
      { t: "Um homem ao celular está ao lado de um carro com o porta-malas aberto e caixas de isopor.", tag: "fato", real: true },
      { t: "O homem entrega produtos ilegais para alguém da escola.", tag: "interp", real: true, sobre: ["homem"] },
      { t: "O homem é entregador da cantina.", tag: "interp", real: false },
      { t: "Não dá para saber o que há nas caixas.", tag: "incerto", real: true },
    ],
  },
  F2: {
    titulo: "Portão da escola", pessoas: ["mae", "kaua"],
    cam: { pos: [-13.8, 1.7, -1.6], alvo: [-6.0, 1.2, 1.6], fov: 52 },
    frases: [
      { t: "Uma mulher entra pelo portão olhando para dentro da escola.", tag: "fato", real: true },
      { t: "Ao fundo, um jovem de laranja está na sala de treino.", tag: "fato", real: true },
      { t: "A mulher veio reclamar de alguma coisa na escola.", tag: "interp", real: false, sobre: ["mae"] },
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
  kaua: { curto: "O jovem de camiseta laranja", nome: "{kaua} (menor de idade)", inicio: 3, limite: 1, bem: "{kaua} foi acolhido pela escola, a mãe soube a tempo e ele passou por avaliação médica. Os exames mostraram alterações, mas ele parou antes de algo grave.", mal: "Ninguém olhou por {kaua}. Duas semanas depois, a mãe chega à escola com exames alterados do filho e pergunta quem do time orientou o uso." },
  bia: { curto: "A professora de legging rosa", nome: "{bia} (professora com laudo)", inicio: 1, limite: 0, bem: "A receita de {bia} foi recolhida e ninguém falou dela. Ela segue dando aula normalmente.", mal: "{bia} descobriu que a receita dela circulou no grupo dos pais e que foi apontada como quem passava hormônio ao time. Pediu afastamento." },
  joaquim: { curto: "O senhor grisalho", nome: "{joaquim} (servente)", inicio: 1, limite: 0, bem: "A caixa com os dados de {joaquim} foi recolhida. O tratamento dele continua sendo assunto dele.", mal: "A caixa com o nome de {joaquim} virou piada entre os alunos. Ele pediu para trocar de turno." },
  lara: { curto: "A estagiária", nome: "{lara} (estagiária) e a turma do 5º ano", inicio: 2, limite: 0, bem: "A supervisão do estágio foi reorganizada e {lara} voltou a ter a professora regente com ela na quadra.", mal: "{lara} seguiu sozinha com a turma. Na semana seguinte uma criança se machucou na aula, sem professor por perto." },
  venda: { curto: "A suspeita de venda", nome: "A venda para alunos do time", inicio: 3, limite: 1, bem: "A apuração ouviu o técnico, confirmou a venda e ele foi afastado do time. A família e o Conselho Tutelar foram comunicados.", mal: "A venda continuou. Mais dois atletas do time compraram o \"kit\" antes dos Jogos." },
  processo: { curto: "Quem está sendo suspeito", nome: "Justiça com quem é suspeito", inicio: 0, limite: -1, invertido: true, bem: "As suspeitas foram apuradas com escuta das partes, sem exposição pública antes da hora.", mal: "Houve acusação pública antes de apurar. Pessoas inocentes foram expostas e o caso virou boato no grupo dos pais." },
  conflito: { curto: "O patrocínio da loja", nome: "Conflito de interesse da escola", inicio: 2, limite: 1, bem: "O patrocínio da loja e a indicação do técnico foram suspensos para revisão.", mal: "O patrocínio seguiu, e o técnico indicado pela loja continuou com o time." },
};

// Alternativas por papel (passos 5 a 7). efeitos somam nas dimensões (negativo = melhora; em "processo", positivo = melhora).
export const ALTERNATIVAS = {
  recepcao: [
    { id: "r_mae", t: "Avisar a responsável pelo aluno menor da ficha quando ela chegar", ef: { kaua: -2 } },
    { id: "r_gestao", t: "Informar a direção sobre o recibo e a ficha do menor", ef: { venda: -1, kaua: -1 } },
    { id: "r_bia", t: "Perguntar à professora de legging rosa o que havia no envelope", ef: { bia: 1, processo: -1 }, alvo: "bia" },
    { id: "r_nada", t: "Não fazer nada: não é função da secretaria", ef: {} },
  ],
  tecnica: [
    { id: "t_guardar", t: "Recolher e guardar o documento carimbado (sigilo)", ef: { bia: -1 } },
    { id: "t_rt", t: "Levar à coordenação o que se sabe e o que não se sabe", ef: { venda: -1, processo: 1 } },
    { id: "t_publico", t: "Questionar o técnico do time na frente dos alunos", ef: { venda: -1, processo: -2 }, alvo: "personal" },
    { id: "t_bia", t: "Chamar a professora de legging rosa para explicar o envelope", ef: { bia: 2, processo: -1 }, alvo: "bia" },
    { id: "t_nada", t: "Não se meter no trabalho do colega", ef: {} },
  ],
  estagiarios: [
    { id: "e_super", t: "Pedir à coordenação que um professor venha para a quadra agora", ef: { lara: -1 } },
    { id: "e_adaptar", t: "Adaptar a aula para a turma ficar segura até chegar um professor", ef: { lara: -1 } },
    { id: "e_relatar", t: "Relatar à coordenação o que viu, separando visto de suposto", ef: { venda: -1, processo: 1 } },
    { id: "e_nada", t: "Seguir a aula e não comentar nada", ef: {} },
  ],
  gestao: [
    { id: "g_apurar", t: "Abrir apuração: ouvir o técnico e afastá-lo do time enquanto apura", ef: { venda: -2, processo: 1, kaua: -1 } },
    { id: "g_parceria", t: "Suspender o patrocínio da loja e a indicação do técnico até revisão", ef: { conflito: -2 } },
    { id: "g_supervisao", t: "Garantir a supervisão presencial da estagiária", ef: { lara: -2 } },
    { id: "g_demitir", t: "Expulsar o técnico hoje, sem ouvi-lo", ef: { venda: -2, processo: -2 }, alvo: "personal" },
    { id: "g_abafar", t: "Resolver em silêncio para não prejudicar o time nos Jogos", ef: { venda: 1, conflito: 1, processo: -1 } },
  ],
  rt: [
    { id: "v_acolher", t: "Procurar o aluno que pode estar usando hormônio, acolher, chamar a família e encaminhar à saúde", ef: { kaua: -2 } },
    { id: "v_assumir", t: "Ir agora para a quadra ou mandar um professor ficar com a estagiária", ef: { lara: -2 } },
    { id: "v_sigilo", t: "Recolher a caixa com dados da pessoa e preservar o sigilo", ef: { joaquim: -1 } },
    { id: "v_apurar", t: "Levar à direção uma apuração com escuta das partes e avaliar os encaminhamentos de proteção cabíveis", ef: { venda: -2, processo: 1 } },
    { id: "v_denunciar", t: "Chamar a polícia na escola agora, sem apurar", ef: { venda: -1, processo: -1 }, alvo: "personal" },
  ],
  alunos: [
    { id: "a_conversar", t: "Conversar com o colega de laranja, sem expor", ef: { kaua: -1 } },
    { id: "a_contar", t: "Contar a um professor ou à coordenação o que viram", ef: { venda: -1, kaua: -1 } },
    { id: "a_grupo", t: "Comentar no grupo de WhatsApp do time", ef: { bia: 1, joaquim: 1, processo: -1 } },
    { id: "a_nada", t: "Não é problema nosso", ef: {} },
  ],
  familia: [
    { id: "f_filho", t: "Conversar com o filho e buscar avaliação médica", ef: { kaua: -2 } },
    { id: "f_academia", t: "Pedir explicações formais à escola", ef: { venda: -1 } },
    { id: "f_expor", t: "Expor a escola no grupo dos pais e nas redes sociais", ef: { processo: -2, conflito: -1 } },
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

export const ABERTURA = "Escola estadual, 15h30, último treino do time antes dos Jogos Escolares. O uniforme e a premiação dos Jogos são patrocinados por uma loja de suplementos do bairro. Na quadra, a turma do 5º ano tem aula de Educação Física. Cada um de vocês está em um lugar da escola.";
export const CONCLUSAO = "Cada um de vocês vê a escola do lugar onde está, e ninguém vê tudo.";
