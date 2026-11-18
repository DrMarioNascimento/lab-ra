// Limiar Ético · Um dia no projeto do bairro.
// Projeto de iniciação esportiva com crianças e adolescentes em uma comunidade, onde a violência do entorno
// aparece na rotina. Situações inventadas, apoiadas nos textos de apoio da disciplina (deveres de conduta,
// limites de competência, coleguismo, bioética) e no Código de Ética do CONFEF.
// A pessoa jogadora é estagiária ou estagiário, acompanhando o coordenador do projeto.
// Formato igual ao do dia da empresa (w = { i, e, r }; cd de -1 a +1; cor = U, V, I, X, C).

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia no projeto do bairro',
  texto: [
    'Você faz estágio em um projeto de iniciação esportiva que atende crianças e adolescentes de um bairro, numa quadra comunitária. O projeto é coordenado por uma pessoa experiente, e hoje há treino à tarde, preparação para um torneio e conversa com as famílias.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'barulho', hora: '14h10', titulo: 'O barulho', margem: 0.5,
    texto: 'As crianças estão chegando para o treino quando se ouvem estouros na rua ao lado. Algumas ainda estão no portão, e outras vêm correndo pela calçada. O coordenador ainda não chegou.',
    info: { rotulo: 'Olhar a rua pelo portão', texto: 'Há pessoas correndo na esquina, mas ninguém na rua da quadra. Quatro crianças ainda estão a menos de cinquenta metros do portão.' },
    opcoes: [
      op('Manter o portão aberto e começar o treino para as crianças se distraírem.',
        'O treino começa, mas as crianças olham o tempo todo para a rua. Duas crianças saem pelo portão em direção ao barulho.',
        [0.3, 0.3, 0.4], -0.5, { U: 1 },
        'manter a rotina para acalmar, deixando a segurança das crianças em segundo plano.'),
      op('Recolher as crianças para dentro da quadra, fechar o portão, avisar os responsáveis e o coordenador e esperar o sinal de que a rua está livre.',
        'Todas as crianças ficam dentro. A espera é longa, e algumas famílias reclamam do atraso depois.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, C: 1 },
        'proteger quem estava sob sua responsabilidade e comunicar às famílias.'),
      op('Mandar todos para casa imediatamente.',
        'Algumas crianças voltam correndo pelo caminho onde ouviram os estouros. Uma delas não chega em casa até a noite.',
        [0.5, 0.4, 0.1], -0.5, {},
        'dispensar o risco pela porta, sem considerar o caminho das crianças.')
    ],
    conceito: { titulo: 'Dever de vigilância', texto: 'Dever de vigilância é a atenção e o acompanhamento contínuos de quem está sob a sua responsabilidade. A omissão gera responsabilidade quando existe dever de cuidado, conhecimento e possibilidade razoável de agir.' }
  },
  {
    id: 'busca', hora: '15h20', titulo: 'Quem busca', margem: 0.7,
    texto: 'Um homem que você nunca viu chega ao portão para buscar uma menina de nove anos. Ele diz que a mãe pediu, e a menina fica em silêncio atrás do seu braço.',
    info: { rotulo: 'Olhar a ficha da menina', texto: 'Na ficha, só a mãe e a avó constam como autorizadas a buscar. A menina não reconhece o homem.' },
    opcoes: [
      op('Entregar a menina: ele parece conhecer a família.',
        'A menina vai com ele. À noite, a mãe liga procurando por ela.',
        [0.4, 0.3, 0.3], -0.9, {},
        'confiar na aparência, deixando de lado o dever de proteção.'),
      op('Não entregar, manter a menina com você e ligar para a mãe ou a avó para confirmar.',
        'O homem se irrita e diz que vai reclamar. A mãe confirma que o tio ia buscar, e a menina vai com ele depois da conferência.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, I: 1 },
        'conferir a autorização antes de entregar, aceitando o desconforto.'),
      op('Pedir que ele espere do lado de fora e mandar a menina embora pelos fundos da quadra.',
        'A menina sai por um beco escuro. O homem percebe e vai atrás dela.',
        [0.5, 0.4, 0.1], -0.7, {},
        'evitar o confronto e criar outro risco para quem devia ser protegido.')
    ],
    conceito: { titulo: 'Salvaguardas', texto: 'Salvaguardas são condições mínimas de dignidade, segurança e direitos. Não são preferências pessoais: são limites éticos e profissionais da decisão.' }
  },
  {
    id: 'cansaco', hora: '16h00', titulo: 'O cansaço', margem: 0.6,
    texto: 'Um menino de doze anos passa mal no treino: tontura, suor frio e uma dor no peito que ele diz ser “só cansaço”. O festival do bairro é no sábado, e o coordenador diz que ele é “peça-chave”.',
    info: { rotulo: 'Perguntar ao menino', texto: 'Ele conta que já sentiu isso na semana passada e que não quis dizer em casa para não ser tirado do time.' },
    opcoes: [
      op('Deixá-lo voltar ao jogo: ele conhece o próprio corpo.',
        'Ele joga mais dez minutos e precisa ser retirado de novo, pior do que antes.',
        [0.3, 0.3, 0.4], -0.7, {},
        'atender ao desejo do menino e do time, mesmo com sinais de risco.'),
      op('Tirá-lo do treino, observar, avisar a família e recomendar avaliação de saúde antes de qualquer esforço.',
        'O menino fica chateado e a família agradece. Ele fica fora do festival até ser avaliado.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, C: 1 },
        'proteger a saúde do menino, aceitando o custo para o time e para ele.'),
      op('Dizer ao menino que ele decide se continua ou não.',
        'Ele diz que continua. Você acompanha de longe e ninguém mais é avisado.',
        [0.3, 0.4, 0.3], -0.4, {},
        'transferir a decisão a quem tem menos informação e mais interesse em jogar.')
    ],
    conceito: { titulo: 'Beneficência e não maleficência', texto: 'Beneficência é promover benefícios e bem-estar, maximizando ganhos e minimizando danos. Não maleficência é evitar ou reduzir danos previsíveis. Quando há sinais de risco, a decisão não pode depender só do desejo de quem está jogando.' }
  },
  {
    id: 'torneio', hora: '16h40', titulo: 'O torneio', margem: 0.8,
    texto: 'O projeto foi convidado a um torneio em outro bairro, com dez vagas. Mais de vinte crianças querem ir. O coordenador pede que você proponha como escolher.',
    info: { rotulo: 'Olhar quem já foi a torneios', texto: 'Sete crianças já foram a torneios do projeto. Muitas das que nunca foram são as que mais faltam por dificuldade de transporte.' },
    opcoes: [
      op('Levar só as dez melhores.',
        'A equipe é forte, e as outras crianças ficam sabendo pelos colegas.',
        [0.2, 0.2, 0.6], -0.2, { U: 1 },
        'priorizar o rendimento, deixando de fora quem mais precisava da oportunidade.'),
      op('Sortear as dez vagas entre todas.',
        'Todas têm a mesma chance. A equipe sorteada é mais fraca, e o resultado decepciona alguns.',
        [0.2, 0.2, 0.6], 0.2, { I: 1 },
        'igualdade formal: a mesma regra para todos, sem olhar para as barreiras de cada um.'),
      op('Montar duas equipes, explicar os critérios às famílias e organizar o transporte para quem tem dificuldade.',
        'A organização dá trabalho, mas as famílias participam e mais crianças vão ao torneio.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'equidade: considerar as barreiras diferentes e explicar o critério.')
    ],
    conceito: { titulo: 'Equidade', texto: 'Equidade é considerar necessidades e barreiras diferentes para garantir participação justa. Perguntar quem enfrenta as maiores barreiras e se a regra igual acaba excluindo alguém ajuda a decidir.' }
  },
  {
    id: 'briga', hora: '17h20', titulo: 'A briga', margem: 0.8,
    texto: 'Dois adolescentes do projeto começam a brigar por causa de uma falta no jogo. Um deles grita que vai “chamar os caras” para resolver depois do treino.',
    info: { rotulo: 'Perguntar ao coordenador', texto: 'Ele conta que os dois vêm de ruas que têm disputa entre grupos e que já houve uma briga parecida há um mês, que terminou na rua.' },
    opcoes: [
      op('Expulsar os dois do projeto na hora.',
        'Os dois saem, e a ameaça continua fora da quadra, onde ninguém do projeto pode acompanhar.',
        [0.4, 0.4, 0.2], -0.5, {},
        'conter o conflito afastando as pessoas, tirando do projeto quem mais precisava dele.'),
      op('Separar, conversar com cada um, chamar os responsáveis e o coordenador e combinar uma mediação antes de liberar os dois.',
        'A mediação toma mais de uma hora. Os dois saem em horários diferentes e acompanhados pelas famílias.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, C: 1 },
        'agir sobre o conflito e sobre o risco de depois, com as famílias e a coordenação.'),
      op('Deixar que resolvam sozinhos: “é coisa de adolescente”.',
        'Depois do treino, um dos dois é cercado na esquina. Você fica sabendo no dia seguinte.',
        [0.4, 0.4, 0.2], -0.8, {},
        'omitir-se diante de um risco previsível.')
    ],
    conceito: { titulo: 'Negligência e omissão', texto: 'Negligência é deixar de cumprir um dever de cuidado por descuido ou omissão. A omissão gera responsabilidade quando existe dever, conhecimento e possibilidade razoável de intervir.' }
  },
  {
    id: 'favor', hora: '17h50', titulo: 'O favor', margem: 0.6,
    texto: 'Um morador influente do bairro procura você e pede uma vaga no torneio para o sobrinho. Em troca, diz que “ajuda o projeto”: conseguiria bolas novas e que “ninguém mexa” com o pessoal da quadra.',
    info: { rotulo: 'Ver quem está na lista de espera', texto: 'O sobrinho dele não frequenta o projeto desde o começo do mês. Três crianças que frequentam todos os dias estão na lista de espera.' },
    opcoes: [
      op('Dar a vaga: o projeto precisa das bolas e da proteção.',
        'As bolas chegam e a vaga é dada. Uma criança que frequentava todos os dias descobre e deixa de ir ao projeto.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'trocar uma vaga por benefício ao projeto, deixando a justiça de lado.'),
      op('Explicar que o critério é igual para todos e levar o pedido ao coordenador, sem aceitar nada em troca.',
        'O morador se irrita e diz que vai lembrar disso. O coordenador agradece o cuidado e registra o caso.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'manter o critério e levar a situação a quem tem autoridade, aceitando o custo.'),
      op('Aceitar as bolas e dizer que vai ver o que dá para fazer, sem registrar nada.',
        'As bolas chegam. O morador entende que a vaga está garantida e cobra uma resposta na semana seguinte.',
        [0.3, 0.3, 0.4], -0.5, {},
        'adiar a decisão enquanto aceitava o benefício, criando um compromisso sem dizer.')
    ],
    conceito: { titulo: 'Conflito de interesse e justiça', texto: 'Trocar um dever ou uma função por vantagem, ainda que para o bem do projeto, compromete a justiça e a confiança. Justiça é distribuir benefícios, riscos e oportunidades de forma justa.' }
  },
  {
    id: 'convite', hora: '18h20', titulo: 'O convite', margem: 0.7,
    texto: 'Um adolescente de quinze anos do projeto conta que um grupo da região o convidou para “ajudar” levando recados e pacotes, em troca de dinheiro. Ele diz que está pensando em aceitar e pede: “Não conta pra ninguém.”',
    info: { rotulo: 'Perguntar por que está pensando em aceitar', texto: 'A mãe perdeu o emprego, e ele quer ajudar em casa. Diz que sabe dos riscos, mas “não tem outro jeito”.' },
    opcoes: [
      op('Prometer segredo e aconselhar o adolescente a não aceitar.',
        'Ele diz que vai pensar. Na semana seguinte, ele some do projeto, e só você sabia.',
        [0.3, 0.5, 0.2], -0.4, {},
        'proteger a confiança e ficar sozinho com um risco que não cabia a você.'),
      op('Contar ao coordenador e à família sem falar com ele antes.',
        'A família é chamada, e o adolescente descobre que foi você. Ele para de falar com você e fica mais próximo do grupo.',
        [0.3, 0.3, 0.4], 0.1, { U: 1, I: 1 },
        'proteger quem estava em risco, ao custo da confiança de quem se abriu.'),
      op('Dizer que não pode prometer segredo diante desse risco e procurar com ele o coordenador, a família e a rede de apoio.',
        'Ele reluta, mas aceita. O coordenador consegue uma vaga de trabalho para o adolescente e uma conversa com a mãe.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'ser honesto sobre o limite do sigilo e encaminhar com acompanhamento.')
    ],
    conceito: { titulo: 'Ética do cuidado', texto: 'A ética do cuidado olha para as relações, a vulnerabilidade e a responsabilidade concreta diante de quem é atendido. Cuidar não é decidir pelo outro: combina proteção, escuta, participação e autonomia.' }
  },
  {
    id: 'imagens', hora: '19h00', titulo: 'As imagens', margem: 0.8,
    texto: 'O perfil do projeto quer postar as fotos do treino de hoje. No bairro há conflitos entre grupos, e alguns responsáveis já pediram que seus filhos não apareçam em redes.',
    info: { rotulo: 'Ver a lista de autorizações', texto: 'Seis dos catorze responsáveis assinaram a autorização de imagem. Duas famílias pediram, por escrito, que as fotos não circulem.' },
    opcoes: [
      op('Postar todas as fotos: é divulgação para o projeto.',
        'O projeto ganha seguidores. Uma das famílias que tinha pedido para não circular reclama e retira o filho.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'priorizar a divulgação do projeto, passando por cima de quem não autorizou.'),
      op('Postar só as fotos de quem autorizou, sem mostrar rostos e sem marcar o local.',
        'A divulgação é menor, mas ninguém é exposto. As famílias confiam mais no projeto.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, I: 1 },
        'respeitar o consentimento de cada um e a vulnerabilidade de quem vive no bairro.'),
      op('Não postar nada e não explicar o motivo ao coordenador.',
        'O coordenador cobra as fotos no dia seguinte e não entende o atraso.',
        [0.4, 0.3, 0.3], 0.0, {},
        'evitar a exposição sem comunicar a decisão a quem coordena.')
    ],
    conceito: { titulo: 'Privacidade e consentimento', texto: 'Respeitar consentimento, privacidade e confidencialidade é um dever fundamental. A divulgação de imagens de crianças em contexto de conflito aumenta o risco de exposição.' }
  },
  {
    id: 'plano', hora: '19h30', titulo: 'O plano de treino', margem: 0.9,
    texto: 'Você assumiu o treino da turma que era de uma colega que saiu do projeto. Ela deixou um plano de treino completo. O coordenador elogia o planejamento e pergunta: “Foi você que fez?”',
    info: { rotulo: 'Olhar o plano', texto: 'O plano tem a letra da colega e as anotações dela nas margens. Algumas atividades dependem de material que o projeto não tem mais.' },
    opcoes: [
      op('Dizer que sim e aceitar o elogio.',
        'O coordenador te dá mais responsabilidades. A colega fica sabendo e se sente desrespeitada.',
        [0.3, 0.3, 0.4], -0.6, {},
        'aceitar o mérito pelo trabalho de outra pessoa.'),
      op('Dizer que o plano é da colega e que você adaptou algumas partes.',
        'O coordenador agradece a transparência e passa a pedir sua opinião também.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, I: 1 },
        'coleguismo e veracidade: dar o crédito a quem fez.'),
      op('Sorrir e mudar de assunto sem confirmar nem negar.',
        'O coordenador entende que foi você. Você fica sem saber se corrige depois.',
        [0.4, 0.3, 0.3], -0.3, {},
        'deixar a dúvida passar, sem corrigir o crédito.')
    ],
    conceito: { titulo: 'Coleguismo e veracidade', texto: 'Coleguismo é o sentimento de solidariedade que une os colegas. Não se apropriar de ideias ou trabalhos alheios e evitar depreciar quem veio antes fazem parte dele. Veracidade é dizer a verdade sobre si.' }
  },
  {
    id: 'relato', hora: '20h10', titulo: 'O relato', margem: 0.5,
    texto: 'No fim do dia, uma menina de dez anos fica por último e conta que o padrasto bate nela quando bebe. Ela diz: “Não conta pra minha mãe. Ele disse que se eu contar, vai ser pior.”',
    info: { rotulo: 'Perguntar se ela está segura hoje', texto: 'Ela diz que o padrasto está em casa hoje e que a mãe trabalha à noite. Há marcas antigas no braço dela.' },
    opcoes: [
      op('Prometer segredo e dizer que vai ficar tudo bem.',
        'Ela volta para casa. Nenhum adulto de confiança fica sabendo, e a situação continua.',
        [0.3, 0.5, 0.2], -0.8, {},
        'proteger a confiança da menina, deixando-a sem proteção.'),
      op('Ouvir com cuidado, não prometer segredo, registrar o que ela disse e levar ao coordenador para acionar a rede de proteção.',
        'O coordenador aciona o conselho tutelar naquela noite. A menina é acompanhada, e você continua a ser a pessoa de confiança dela no projeto.',
        [0.1, 0.3, 0.6], 0.8, { V: 2, C: 1 },
        'acolher, ser honesto sobre o limite do sigilo e encaminhar com acompanhamento.'),
      op('Ligar para a mãe imediatamente e contar o que a menina disse.',
        'A mãe discute com o padrasto na frente da menina. A situação piora naquela noite.',
        [0.4, 0.4, 0.2], -0.3, {},
        'encaminhar rápido para quem tinha vínculo com a menina, sem avaliar o risco do encaminhamento.')
    ],
    conceito: { titulo: 'Transferência de responsabilidade', texto: 'Encaminhar pode ser decisão responsável; transferir sem acompanhamento pode ser fuga da própria responsabilidade. Para avaliar: havia dever de agir, o resultado era previsível, havia competência e autoridade, o encaminhamento foi adequado e acompanhado?' }
  }
];

export const CONTEXTOS = {
  barulho: {
    baixo: 'É a primeira vez que se ouve algo assim perto da quadra neste ano.',
    medio: 'Já é a segunda vez neste mês que se ouvem estouros perto da quadra.',
    alto: 'É a terceira vez neste mês que se ouvem estouros perto da quadra, e na última o treino ficou suspenso.'
  },
  busca: {
    baixo: 'É a primeira vez que alguém desconhecido pede uma criança, e o portão está cheio de gente.',
    medio: 'Já é a segunda vez neste mês que alguém desconhecido pede uma criança.',
    alto: 'É a terceira vez neste mês que um adulto desconhecido vem pedir uma criança, e dessa vez o homem fala alto.'
  },
  cansaco: {
    baixo: 'O festival é só daqui a um mês.',
    medio: 'O festival é no sábado.',
    alto: 'É o segundo menino que passa mal neste mês, o festival é amanhã, você já cobriu três fins de semana seguidos e o coordenador disse que não há reservas.'
  },
  torneio: {
    baixo: 'A inscrição fecha no fim do mês.',
    medio: 'A inscrição fecha amanhã.',
    alto: 'É a terceira vez neste ano que a escolha das vagas gera discussão entre as famílias, e a inscrição fecha hoje.'
  },
  briga: {
    baixo: 'É a primeira vez que esses dois discutem.',
    medio: 'Já é a segunda vez que esses dois discutem nesta semana.',
    alto: 'É a terceira briga entre esses dois neste mês, e na última um deles foi cercado na saída.'
  },
  favor: {
    baixo: 'O morador pede com educação e diz que não tem pressa para a resposta.',
    medio: 'O morador pede uma resposta ainda hoje.',
    alto: 'É a terceira vez neste mês que o morador procura você, e dessa vez fala em “lembrar quem ajudou”.'
  },
  convite: {
    baixo: 'O adolescente diz que foi a primeira vez que alguém o procurou.',
    medio: 'O adolescente diz que já foi procurado duas semanas atrás.',
    alto: 'É a terceira vez neste mês que o grupo procura o adolescente, e ele já recusou duas vezes.'
  },
  imagens: {
    baixo: 'O perfil do projeto só posta fotos de vez em quando.',
    medio: 'O coordenador pediu as fotos para hoje à noite.',
    alto: 'É a terceira vez neste mês que o coordenador cobra as fotos, e a prefeitura pediu material para o relatório.'
  },
  plano: {
    baixo: 'O coordenador fez a pergunta com tranquilidade, sem cobrança.',
    medio: 'O coordenador fez a pergunta na frente de outros colegas.',
    alto: 'É a terceira vez neste mês que o coordenador elogia você na frente de todos, e hoje a colega que saiu está presente.'
  },
  relato: {
    baixo: 'A menina conta com calma, parece segura de que pode falar.',
    medio: 'A menina conta chorando e pede segredo.',
    alto: 'É a terceira vez nesta semana que a menina fica por último e hoje diz que tem medo de voltar para casa.'
  }
};

export const VALORES = {
  barulho: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: [] }, { p: [], s: ['vulneraveis', 'profissional'] }],
  busca: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }],
  cansaco: [{ p: ['meta', 'instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['meta'] }, { p: ['confianca'], s: ['profissional'] }],
  torneio: [{ p: ['meta', 'instituicao'], s: ['justica', 'vulneraveis'] }, { p: ['justica'], s: ['meta'] }, { p: ['justica', 'vulneraveis', 'verdade', 'instituicao'], s: [] }],
  briga: [{ p: ['instituicao'], s: ['vulneraveis', 'justica'] }, { p: ['profissional', 'vulneraveis', 'justica', 'verdade'], s: [] }, { p: [], s: ['profissional', 'vulneraveis'] }],
  favor: [{ p: ['instituicao'], s: ['justica', 'vulneraveis', 'profissional'] }, { p: ['justica', 'profissional', 'verdade'], s: [] }, { p: ['instituicao'], s: ['verdade', 'profissional', 'justica'] }],
  convite: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis'], s: ['confianca'] }, { p: ['profissional', 'vulneraveis', 'confianca', 'verdade'], s: [] }],
  imagens: [{ p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis', 'verdade'], s: ['meta'] }, { p: ['vulneraveis'], s: ['verdade', 'colegas'] }],
  plano: [{ p: ['meta'], s: ['colegas', 'verdade'] }, { p: ['colegas', 'verdade', 'profissional'], s: [] }, { p: ['meta'], s: ['verdade', 'colegas'] }],
  relato: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis', 'confianca', 'verdade'], s: [] }, { p: ['familia'], s: ['vulneraveis'] }]
};

export const APLICACAO = {
  titulo: 'Um vídeo da quadra',
  situacao: 'Alguém grava uma criança driblando na quadra do projeto e a família autoriza o envio ao grupo de famílias. Depois, uma pessoa sugere postar o vídeo no perfil público do projeto para atrair mais crianças.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência, considerando que o bairro tem conflitos.',
  leitura: 'A intenção de atrair mais crianças pode ser legítima. A postagem pública é outro meio: muda o público, o alcance e a exposição da criança e da família num bairro com conflitos. A autorização para um uso específico não se estende automaticamente ao outro. Que efeito cada alternativa teria para a criança e para o projeto?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos nas crianças, nas famílias e no projeto, e eles aparecem ao longo da revelação.';
