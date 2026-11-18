// Limiar Ético · Um dia na escola.
// Situações inspiradas nos três temas do livro de estágio "Eu não estudei para isso!" (violência na escola,
// infraestrutura e materiais, jogos escolares), com nomes e detalhes trocados, e nos textos de apoio da disciplina.
// A pessoa jogadora é estagiária ou estagiário, acompanhando o professor colaborador.
// Formato igual ao do dia da empresa: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia na escola',
  texto: [
    'Você faz estágio em uma escola pública e acompanha o professor colaborador de Educação Física. Hoje é dia de aulas, de uma reunião sobre os jogos escolares da semana que vem e de recolher material para o seu projeto de estágio.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'vaga', hora: '07h20', titulo: 'A turma sem professor', margem: 0.5,
    texto: 'Faltou um professor, e a turma dele, com 35 alunos, foi mandada para a quadra, onde a sua turma já está em aula. O professor colaborador é chamado pela coordenação e diz, saindo: “Fica de olho nas duas turmas, volto já.”',
    info: { rotulo: 'Olhar a lista de presença', texto: 'Há 62 alunos na quadra para dois adultos, e o professor colaborador é um deles. Um aluno da turma que chegou tem restrição de esforço registrada na ficha.' },
    opcoes: [
      op('Assumir as duas turmas e seguir a aula do jeito que estava planejada.',
        'A aula segue, mas você perde de vista o fundo da quadra. Duas bolas passam perto de quem estava sentado.',
        [0.3, 0.2, 0.5], -0.4, { U: 1 },
        'assumir mais do que cabe: a boa vontade ocupou o lugar do limite de competência.'),
      op('Manter só a sua turma na aula e pedir que a outra fique sentada na arquibancada até o professor voltar.',
        'A arquibancada fica sem ninguém olhando por dez minutos, e dois alunos descem para o meio da quadra.',
        [0.2, 0.2, 0.6], 0.1, { V: 1, I: 1 },
        'dividir o que dava para cuidar, mas sem prever quem ficava sem vigilância.'),
      op('Pedir ajuda à coordenação e passar uma atividade simples e segura para as duas turmas até chegar mais um adulto.',
        'A coordenação manda uma pessoa em cinco minutos. A aula perde o ritmo, e ninguém se machuca.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'reconhecer o limite: pedir apoio e reduzir o risco antes de continuar.')
    ],
    conceito: { titulo: 'Limites de competência e dever de vigilância', texto: 'Reconhecer o que a formação permite fazer e encaminhar quando necessário faz parte da ética profissional. O dever de vigilância pede atenção e acompanhamento contínuos de quem está sob a sua responsabilidade.' }
  },
  {
    id: 'gol', hora: '08h40', titulo: 'O gol e a linha', margem: 0.8,
    texto: 'No futsal, dois alunos discutem sobre quem vai para o gol e quem fica na linha. Um deles empurra o outro, e a turma para de jogar para olhar.',
    info: { rotulo: 'Perguntar ao professor colaborador', texto: 'Ele diz que os dois já tiveram atrito antes e que um deles comentou que “ia resolver na saída”.' },
    opcoes: [
      op('Apitar, separar os dois e mandá-los para o banco, sem ouvir ninguém.',
        'A discussão para na hora. Um dos alunos sai dizendo que “nunca é ouvido” e fica emburrado até o fim da aula.',
        [0.4, 0.3, 0.3], -0.1, { I: 1 },
        'agir rápido para conter o conflito, sem ouvir os envolvidos.'),
      op('Deixar que resolvam entre eles: “são coisas de jogo”.',
        'Os dois voltam a se empurrar e a turma toma partido. Você precisa intervir depois, com a situação pior.',
        [0.4, 0.4, 0.2], -0.5, {},
        'omitir-se: a decisão de não agir também tem consequências.'),
      op('Parar o jogo, separar com calma, ouvir cada um e combinar com a turma uma regra de revezamento.',
        'A aula perde alguns minutos, mas a regra fica combinada e os dois voltam a jogar.',
        [0.1, 0.2, 0.7], 0.5, { V: 2, C: 1 },
        'ouvir antes de julgar e transformar o conflito em regra combinada.')
    ],
    conceito: { titulo: 'Omissão', texto: 'Omitir-se é deixar de agir tendo dever, conhecimento e possibilidade razoável de intervir. A omissão gera responsabilidade quando existe dever de cuidado.' }
  },
  {
    id: 'halter', hora: '10h10', titulo: 'O halter', margem: 0.7,
    texto: 'No intervalo, um aluno se aproxima de você e conta que ontem levou um halter de cimento da escola para a saída, “para se defender” de outro aluno. Diz que já devolveu e pede: “Não conta pra ninguém.”',
    info: { rotulo: 'Perguntar o que aconteceu na saída', texto: 'Segundo ele, o outro aluno o ameaçou depois de uma discussão num jogo e disse que ia esperá-lo no ponto de ônibus.' },
    opcoes: [
      op('Prometer segredo e aconselhar o aluno a evitar o outro.',
        'Ele agradece. Na semana seguinte, a ameaça continua e só você sabe.',
        [0.3, 0.5, 0.2], -0.3, {},
        'proteger a confiança do aluno, ficando sozinho com um risco que não cabia a você.'),
      op('Avisar a coordenação na hora, sem falar com o aluno antes.',
        'A coordenação chama os dois. O aluno descobre que foi você e deixa de procurá-lo.',
        [0.3, 0.3, 0.4], 0.1, { U: 1, I: 1 },
        'proteger quem estava em risco, ao custo da confiança de quem se abriu com você.'),
      op('Dizer ao aluno que não pode prometer segredo diante de um risco e levar o caso à coordenação junto com ele.',
        'Ele reluta, mas aceita. A coordenação organiza uma conversa com os dois e com as famílias.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'ser honesto sobre o limite do sigilo e encaminhar com acompanhamento.')
    ],
    conceito: { titulo: 'Ética do cuidado e limite do sigilo', texto: 'Cuidar não é decidir pelo outro: combina proteção, escuta, participação e autonomia. O sigilo tem limite quando há risco a alguém, e dizer isso com clareza também é veracidade.' }
  },
  {
    id: 'gravacao', hora: '11h30', titulo: 'A gravação', margem: 0.8,
    texto: 'Para o projeto de estágio, você quer gravar o relato de um aluno que passou por uma situação de violência perto da escola. O aluno topa conversar, e o seu celular está no bolso.',
    info: { rotulo: 'Reler as regras do projeto', texto: 'O roteiro do estágio pede autorização por escrito do aluno e dos responsáveis, e o cuidado de não identificar quem fala.' },
    opcoes: [
      op('Gravar o áudio sem avisar, para não perder a espontaneidade.',
        'O relato é rico. Depois, o aluno descobre que foi gravado e a família pede que o áudio seja apagado.',
        [0.3, 0.3, 0.4], -0.6, {},
        'priorizar o resultado do trabalho, deixando de lado o consentimento de quem fala.'),
      op('Explicar o uso, pedir autorização por escrito ao aluno e aos responsáveis e gravar sem identificar o nome.',
        'O relato demora um dia a mais, mas fica autorizado. O aluno sabe quem vai ouvir e para quê.',
        [0.1, 0.2, 0.7], 0.7, { I: 1, V: 2 },
        'consentimento livre e esclarecido: o trabalho esperou o tempo da autorização.'),
      op('Desistir da gravação e anotar só os temas gerais, sem relatos pessoais.',
        'O aluno nem soube que você pensou em gravar. O projeto ganha pouco material.',
        [0.2, 0.3, 0.5], 0.2, { V: 1 },
        'proteger a privacidade do aluno, abrindo mão de parte do trabalho.')
    ],
    conceito: { titulo: 'Respeito pela pessoa e consentimento', texto: 'Respeitar a pessoa é permitir que participe das decisões que a envolvem, com consentimento livre e esclarecido, e proteger quem está mais vulnerável.' }
  },
  {
    id: 'quadra', hora: '13h20', titulo: 'A quadra', margem: 0.7,
    texto: 'A aula da tarde está marcada para a quadra. O piso tem um buraco perto da linha de fundo e as bolas estão murchas. Faltam dez minutos para a turma chegar.',
    info: { rotulo: 'Ver o piso de perto', texto: 'O buraco tem uns quinze centímetros de largura e uma borda solta de cimento. A área fica no caminho de quem corre para o gol.' },
    opcoes: [
      op('Dar a aula assim mesmo, pedindo que a turma tenha cuidado.',
        'Um aluno tropeça na borda e torce o tornozelo. A aula acaba mais cedo.',
        [0.3, 0.2, 0.5], -0.5, {},
        'seguir o planejado, assumindo um risco que podia ser evitado.'),
      op('Suspender a atividade na quadra, levar a turma ao pátio com uma alternativa e registrar o problema por escrito para a direção.',
        'A aula é menos animada, mas ninguém se machuca. O registro chega à direção no mesmo dia.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'evitar o dano previsível e transformar o problema em um pedido formal.'),
      op('Reclamar do estado da quadra na sala dos professores e dar a aula do mesmo jeito.',
        'Os colegas concordam com você. A quadra continua como estava, e um aluno quase cai.',
        [0.3, 0.5, 0.2], -0.3, {},
        'desabafar sem agir: a queixa ocupou o lugar da decisão.')
    ],
    conceito: { titulo: 'Não maleficência e imprudência', texto: 'Não maleficência é evitar ou reduzir danos previsíveis. Imprudência é agir precipitadamente, sem a cautela exigida ou sem considerar as possíveis consequências.' }
  },
  {
    id: 'verba', hora: '14h40', titulo: 'A verba', margem: 0.5,
    texto: 'Na reunião, a direção propõe usar toda a verba de materiais com o time que vai aos jogos escolares: “Ele representa a escola.” Muitas turmas estão sem bolas e sem cones.',
    info: { rotulo: 'Olhar a lista de materiais', texto: 'A lista mostra quatro turmas sem nenhuma bola em condições, e o time já tem uniforme e bolas.' },
    opcoes: [
      op('Concordar: o time é a vitrine da escola.',
        'A proposta passa sem discussão. As turmas continuam sem material.',
        [0.2, 0.2, 0.6], -0.3, { U: 1 },
        'apoiar o que fortalece a imagem da escola, sem olhar para quem ficou sem recurso.'),
      op('Propor dividir por necessidade: material básico para todas as turmas e uma parte para o time.',
        'A direção hesita, mas aceita. O time recebe menos, e as turmas passam a ter o que precisam.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, U: 1 },
        'equidade: distribuir considerando as necessidades diferentes.'),
      op('Defender sozinho que o time fique sem verba até todas as turmas terem material.',
        'A proposta gera um desconforto na reunião e os colegas do time ficam contrariados.',
        [0.3, 0.4, 0.3], 0.2, { I: 1, V: 1 },
        'sustentar um princípio de justiça sem buscar caminho que preservasse também o time.')
    ],
    conceito: { titulo: 'Justiça e equidade', texto: 'Igualdade é oferecer a mesma regra a todos; equidade é considerar necessidades e barreiras diferentes para garantir participação justa. Tratar todos igual nem sempre produz justiça.' }
  },
  {
    id: 'convocacao', hora: '15h30', titulo: 'A convocação', margem: 0.8,
    texto: 'Para os jogos escolares há vagas para doze alunos, e mais de trinta querem ir. O professor colaborador pede que você proponha como escolher.',
    info: { rotulo: 'Ver quem tentou na seleção', texto: 'Dos mais de trinta, quinze nunca participaram de nenhuma equipe da escola, e alguns são alunos que o professor colaborador descreve como “tímidos”.' },
    opcoes: [
      op('Convocar só os doze mais habilidosos.',
        'A equipe fica forte, e dezoito alunos ficam de fora sem explicação.',
        [0.2, 0.2, 0.6], -0.2, { U: 1 },
        'priorizar o rendimento da equipe, deixando para trás quem mais precisava participar.'),
      op('Sortear os doze entre todos que quiseram ir.',
        'Todos têm a mesma chance. Alguns dos sorteados nunca jogaram, e a equipe rende menos.',
        [0.2, 0.2, 0.6], 0.2, { I: 1 },
        'igualdade formal: a mesma regra para todos, sem olhar para as diferenças.'),
      op('Montar duas equipes, explicar os critérios à turma e combinar um jogo extra na escola para quem não for aos jogos.',
        'A explicação gera discussão, mas a maioria entende. O jogo extra é marcado para o mês seguinte.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'equidade: ampliar a participação e explicar publicamente o critério.')
    ],
    conceito: { titulo: 'Igualdade e equidade', texto: 'Perguntar quem se beneficia, quem assume os riscos e quem enfrenta as maiores barreiras ajuda a ver quando a regra igual acaba excluindo alguém.' }
  },
  {
    id: 'joelho', hora: '16h10', titulo: 'O joelho', margem: 0.6,
    texto: 'Uma aluna da equipe machucou o joelho no treino e disfarça a dor. O colega professor da equipe pede a você: “Não conta pra coordenação, ela é essencial no jogo de amanhã.”',
    info: { rotulo: 'Olhar o joelho da aluna', texto: 'O joelho está inchado e quente, e ela evita apoiar a perna. Ela diz que “só está pesado”.' },
    opcoes: [
      op('Calar e deixar que ela jogue com uma faixa no joelho.',
        'No jogo, o joelho cede no primeiro minuto. A aluna sai de maca e a equipe perde.',
        [0.3, 0.3, 0.4], -0.8, {},
        'proteger o colega e o resultado, deixando de proteger a aluna.'),
      op('Conversar com o colega, avisar os responsáveis e a coordenação e sugerir avaliação antes de qualquer jogo.',
        'O colega fica chateado. A aluna é avaliada, não joga, e a equipe tem que se reorganizar.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, I: 1 },
        'colocar a proteção da aluna à frente do resultado, aceitando o custo na relação.'),
      op('Contar só para a aluna e deixar que ela decida se joga.',
        'Ela diz que joga. Ninguém mais sabe, e você passa a noite preocupado.',
        [0.3, 0.4, 0.3], -0.3, {},
        'transferir a decisão a quem estava mais vulnerável, sem acompanhamento.')
    ],
    conceito: { titulo: 'Transferência de responsabilidade', texto: 'Encaminhar pode ser uma decisão responsável; transferir sem acompanhamento pode ser fuga da própria responsabilidade. Prever um dano não é o mesmo que desejá-lo, mas quem prevê tem dever de evitá-lo.' }
  },
  {
    id: 'antecessor', hora: '16h50', titulo: 'O antecessor', margem: 0.9,
    texto: 'Você vai usar o plano de aula que o professor anterior deixou. Na sala dos professores, um colega comenta: “Aquele ali nunca soube planejar.” Ninguém na sala conhece o plano que você tem em mãos.',
    info: { rotulo: 'Reler o plano', texto: 'O plano é bem estruturado e tem a assinatura do professor anterior no rodapé.' },
    opcoes: [
      op('Usar o plano como se fosse seu e concordar com o comentário.',
        'Você é elogiado pelo plano. O colega passa a confiar em você para falar mal dos outros.',
        [0.3, 0.3, 0.4], -0.4, { U: 1 },
        'colher o mérito e ficar bem com o grupo, deixando a verdade e o colega ausente de lado.'),
      op('Usar o plano e citar a autoria, sem entrar no comentário.',
        'O crédito fica com quem fez o plano. O comentário passa sem resposta.',
        [0.2, 0.2, 0.6], 0.3, { V: 1, I: 1 },
        'dar o crédito, mas sem enfrentar o comentário depreciativo.'),
      op('Usar o plano, citar a autoria e dizer que prefere não falar mal de quem não está presente; se houver dúvida sobre o plano, perguntar ao professor anterior.',
        'O colega se cala e a conversa muda. Você marca de falar com o professor anterior.',
        [0.1, 0.2, 0.7], 0.5, { V: 2, C: 1 },
        'coleguismo: crédito, defesa de quem não estava e vontade de aprender com ele.')
    ],
    conceito: { titulo: 'Coleguismo', texto: 'Coleguismo é o sentimento de solidariedade que une os colegas. Inclui não se apropriar de ideias ou trabalhos alheios, não depreciar o trabalho de quem veio antes e não ser complacente com atitudes imorais.' }
  },
  {
    id: 'fotos', hora: '17h30', titulo: 'As fotos', margem: 0.8,
    texto: 'No fim dos jogos, você fez fotos da equipe. No grupo da escola com os responsáveis, uma mãe pede: “Posta aí as fotos!” Nem todos os alunos entregaram a autorização específica de uso de imagem.',
    info: { rotulo: 'Conferir as autorizações', texto: 'Há autorização de uso de imagem para sete dos doze alunos. Uma das mães já pediu que a foto do filho não circule.' },
    opcoes: [
      op('Postar todas no grupo dos responsáveis.',
        'A turma comemora. Uma das mães que tinha pedido para não circular reclama na hora.',
        [0.3, 0.3, 0.4], -0.6, {},
        'atender ao pedido do grupo e à vontade de divulgar, passando por cima de quem não autorizou.'),
      op('Postar só as fotos dos alunos autorizados e avisar os demais responsáveis que as outras seguem a conversa individual.',
        'O grupo estranha a demora, mas a situação fica clara. Duas autorizações chegam no dia seguinte.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, I: 1 },
        'respeitar o consentimento de cada um, aceitando a frustração do grupo.'),
      op('Não postar nada e deixar o assunto para depois.',
        'Os pais cobram a foto nos dias seguintes, e a conversa sobre autorização não acontece.',
        [0.4, 0.3, 0.3], -0.1, {},
        'evitar o problema sem resolvê-lo: ninguém é exposto, mas ninguém é informado.')
    ],
    conceito: { titulo: 'Consentimento, privacidade e confidencialidade', texto: 'Respeitar consentimento, privacidade e confidencialidade é um dever fundamental. A autorização para um uso específico não se estende automaticamente a outro.' }
  }
];

export const CONTEXTOS = {
  vaga: {
    baixo: 'É a primeira vez que isso acontece neste ano, e a coordenação costuma ajudar rápido.',
    medio: 'Já é a segunda vez neste mês que uma turma sem professor é mandada para a quadra.',
    alto: 'É a terceira vez neste mês que uma turma sem professor vem para a quadra, ninguém da coordenação atendeu da última vez e você já ficou além do horário nas duas anteriores.'
  },
  gol: {
    baixo: 'A turma estava animada e é a primeira discussão do dia.',
    medio: 'Já é a segunda discussão nesta aula.',
    alto: 'É a terceira discussão neste mês entre esses mesmos dois, e a turma já escolheu lado.'
  },
  halter: {
    baixo: 'O aluno parece calmo e diz que aconteceu uma vez só.',
    medio: 'O aluno parece inquieto e diz que não foi a primeira vez que o outro o ameaçou.',
    alto: 'É a terceira ameaça do mesmo aluno só neste mês, e ele diz que já pediu ajuda a alguém antes.'
  },
  gravacao: {
    baixo: 'O aluno está tranquilo e já conversou sobre isso com a família.',
    medio: 'O aluno mostra receio de falar e pergunta quem vai ouvir.',
    alto: 'É o segundo aluno do projeto que se oferece a falar, e o primeiro já pediu para tirar o relato do trabalho.'
  },
  quadra: {
    baixo: 'É a primeira vez que o piso aparece assim, e o buraco é pequeno.',
    medio: 'Já é a segunda semana com o buraco no piso, e o pedido de conserto está sem resposta.',
    alto: 'Já é a terceira semana com o buraco no piso, houve outro escorregão na semana passada e a direção ainda não respondeu aos pedidos.'
  },
  verba: {
    baixo: 'A direção deixou claro que a decisão ainda pode ser conversada.',
    medio: 'A direção quer fechar a decisão ainda hoje.',
    alto: 'É a terceira vez neste ano que a verba vai quase toda para o time, e a direção quer fechar a proposta hoje.'
  },
  convocacao: {
    baixo: 'A lista só precisa ser entregue no fim do mês.',
    medio: 'A lista precisa ser entregue até amanhã.',
    alto: 'É a terceira vez em três anos que a convocação gera discussão entre as famílias, e agora a lista precisa ser entregue hoje, justo no horário em que você tinha combinado estar em casa.'
  },
  joelho: {
    baixo: 'O jogo de amanhã é amistoso, e o colega só sugeriu discretamente que não se falasse.',
    medio: 'O jogo de amanhã é a semifinal, e o colega insiste.',
    alto: 'É a semifinal de amanhã, o colega já pediu o mesmo silêncio duas vezes neste mês e você não sabe se a aluna já se machucou antes.'
  },
  antecessor: {
    baixo: 'É a primeira vez que o colega faz um comentário assim.',
    medio: 'Já é a segunda vez que o colega comenta mal do professor anterior.',
    alto: 'É a terceira vez neste mês que o colega faz esse tipo de comentário, e dessa vez outros riem.'
  },
  fotos: {
    baixo: 'Só uma mãe cobrou as fotos, e foi de forma educada.',
    medio: 'Várias mães cobram as fotos no grupo.',
    alto: 'É a terceira vez neste ano que o grupo cobra as fotos antes da hora e a direção já comentou que deseja divulgar tudo.'
  }
};

export const VALORES = {
  vaga: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional'], s: ['vulneraveis'] }, { p: ['profissional', 'vulneraveis', 'verdade'], s: [] }],
  gol: [{ p: ['profissional'], s: ['justica'] }, { p: [], s: ['profissional', 'vulneraveis'] }, { p: ['profissional', 'justica', 'vulneraveis'], s: [] }],
  halter: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis'], s: ['confianca'] }, { p: ['profissional', 'vulneraveis', 'confianca', 'verdade'], s: [] }],
  gravacao: [{ p: ['meta'], s: ['verdade', 'confianca', 'vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis', 'verdade', 'meta'], s: [] }, { p: ['vulneraveis'], s: ['meta'] }],
  quadra: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis', 'verdade', 'instituicao'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }],
  verba: [{ p: ['instituicao'], s: ['vulneraveis', 'justica'] }, { p: ['justica', 'vulneraveis', 'instituicao'], s: [] }, { p: ['justica', 'vulneraveis'], s: ['instituicao', 'colegas'] }],
  convocacao: [{ p: ['meta', 'instituicao'], s: ['justica', 'vulneraveis'] }, { p: ['justica'], s: ['meta'] }, { p: ['justica', 'vulneraveis', 'verdade', 'instituicao'], s: [] }],
  joelho: [{ p: ['colegas', 'instituicao', 'meta'], s: ['vulneraveis', 'verdade', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['colegas'] }, { p: ['confianca'], s: ['profissional'] }],
  antecessor: [{ p: ['meta'], s: ['colegas', 'verdade'] }, { p: ['colegas', 'verdade'], s: ['profissional'] }, { p: ['colegas', 'verdade', 'profissional'], s: [] }],
  fotos: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis'], s: [] }, { p: ['vulneraveis'], s: ['instituicao'] }]
};

export const APLICACAO = {
  titulo: 'Um vídeo do jogo',
  situacao: 'Na aula, alguém grava um aluno fazendo um gol e autoriza o envio ao grupo da turma. Depois, uma pessoa sugere postar o vídeo no perfil público da escola para mostrar o trabalho a quem não estava.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de valorizar o trabalho pode ser legítima. A postagem pública é outro meio: muda o público, o alcance e a exposição do aluno. A autorização para um uso específico não se estende automaticamente ao outro. Que efeito cada alternativa teria para o aluno e para a escola?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em alunos, colegas e na escola, e eles aparecem ao longo da revelação.';
