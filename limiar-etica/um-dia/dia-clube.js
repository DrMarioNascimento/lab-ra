// Limiar Ético · Um dia no clube.
// Situações do estágio na comissão técnica das categorias de base de um clube (lesão e decisão de jogar, substâncias,
// seleção de atletas, treino de adolescentes, humilhação no vestiário, conflito de interesse, sigilo, fair play,
// promessas a famílias), com nomes e detalhes inventados. A pessoa jogadora é estagiária ou estagiário e acompanha o preparador físico.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia no clube',
  texto: [
    'Você faz estágio na comissão técnica das categorias de base de um clube e acompanha o preparador físico. Hoje é dia de treino pela manhã, de jogo no fim da tarde e de conversa com a diretoria sobre a temporada.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'tornozelo', hora: '08h00', titulo: 'O tornozelo e a final', margem: 0.8,
    texto: 'O capitão do sub-17 chega ao treino coxeando e diz que “não é nada”. A final é amanhã. O técnico passa por perto e diz: “Ele joga, resolve com gelo.”',
    info: { rotulo: 'Olhar o tornozelo', texto: 'O tornozelo está inchado, e ele evita apoiar o pé. Conta que já sentiu isso há duas semanas.' },
    opcoes: [
      op('Aplicar gelo e liberar para o aquecimento, para ver se ele aguenta.',
        'Ele tenta e para no primeiro sprint. A dor volta pior à noite.',
        [0.3, 0.2, 0.5], -0.5, { U: 1 },
        'seguir o que o técnico queria, esperando que o corpo respondesse.'),
      op('Pedir avaliação do departamento médico antes de qualquer treino e dizer ao técnico que a decisão sobre jogar depende dela.',
        'O técnico reclama. O médico examina e pede repouso, e o capitão não joga.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'colocar a avaliação de quem sabe acima da vontade de ganhar, aceitando o custo.'),
      op('Deixar o atleta decidir se joga: “ele conhece o próprio corpo”.',
        'Ele diz que joga. Ninguém mais avalia o tornozelo.',
        [0.3, 0.3, 0.4], -0.3, {},
        'transferir a decisão a quem estava mais vulnerável, sem acompanhamento.')
    ],
    conceito: { titulo: 'Não maleficência e responsabilidade', texto: 'Quem acompanha atletas tem o dever de evitar danos previsíveis, e a decisão de liberar ou não cabe a quem tem competência para avaliar, não à vontade de ganhar. Deixar a decisão ao mais vulnerável, sem apoio, é transferir responsabilidade.' }
  },
  {
    id: 'comprimido', hora: '09h30', titulo: 'O comprimido', margem: 0.8,
    texto: 'Um colega da comissão oferece aos atletas de 17 anos um comprimido sem rótulo, que “deixa mais forte e aguenta o jogo”. Diz que o adversário já usa e que “é só vitamina”.',
    info: { rotulo: 'Pedir a embalagem', texto: 'A cartela não tem nome, lote nem bula, e o colega diz que “um amigo” trouxe.' },
    opcoes: [
      op('Aceitar: se o adversário usa, ficar de fora seria prejudicar o time.',
        'Os atletas tomam. Um deles passa mal à noite, sem que ninguém saiba o que tomou.',
        [0.4, 0.3, 0.3], -0.8, { U: 1 },
        'seguir o que o outro lado faz, deixando de lado a saúde e a regra.'),
      op('Recusar para você, mas não dizer nada: o colega é mais antigo.',
        'O colega continua oferecendo a outros atletas.',
        [0.3, 0.3, 0.4], -0.3, {},
        'proteger a própria posição, sem proteger quem recebe o comprimido.'),
      op('Impedir o uso, avisar o médico e o coordenador e recusar a prática mesmo que o colega fique contra você.',
        'O colega se irrita e passa a evitá-lo. O coordenador recolhe a cartela e os atletas são orientados.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'colocar a saúde dos adolescentes e a lealdade às regras acima da relação com o colega.')
    ],
    conceito: { titulo: 'Fair play e dever com quem é menor', texto: 'Competir respeitando as regras e a saúde de quem joga é parte do esporte. Quem tem dever de cuidado com adolescentes não pode abrir mão dele porque o outro lado também faz.' }
  },
  {
    id: 'peneira', hora: '10h40', titulo: 'A peneira', margem: 0.8,
    texto: 'Hoje é a peneira: duzentos meninos disputam uma vaga. O técnico manda você cronometrar os testes e diz que “o filho de um conselheiro” deve ser anotado entre os melhores.',
    info: { rotulo: 'Ver a lista', texto: 'O filho do conselheiro ficou entre os últimos no teste de velocidade, mas tem boa técnica. Outro garoto, que correu descalço por não ter chuteira, foi o melhor.' },
    opcoes: [
      op('Anotar o tempo real do filho do conselheiro e o do garoto descalço, sem comentar nada.',
        'A lista sai com os tempos reais. O técnico olha torto e depois decide sozinho.',
        [0.2, 0.3, 0.5], 0.3, { V: 1, I: 1 },
        'registrar a verdade, sem levar a questão a quem decide.'),
      op('Anotar o filho do conselheiro entre os melhores, como pedido.',
        'O menino fica entre os cinco primeiros. O garoto sem chuteira nem entra na conversa.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'ajustar o critério a quem tinha ligação com a diretoria.'),
      op('Anotar os tempos reais, dizer ao técnico que vai registrar tudo como foi e propor um critério público para o último corte.',
        'O técnico reclama, mas a lista é afixada com os critérios. O garoto descalço passa para a fase seguinte.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'justiça com transparência: o mesmo critério, explicado a todos.')
    ],
    conceito: { titulo: 'Justiça e conflito de interesse', texto: 'Justiça é tratar cada candidato por um critério que se possa explicar. Há conflito de interesse quando a ligação com quem decide pesa mais do que o mérito, e registrar o que se viu é parte da veracidade.' }
  },
  {
    id: 'extra', hora: '12h00', titulo: 'O treino extra', margem: 0.7,
    texto: 'O técnico do sub-15 manda repetir o treino de força à tarde, depois do jogo da manhã, em quem “está devagar”. Alguns meninos têm treze anos e ainda estão em fase de crescimento. É você quem acompanha o treino.',
    info: { rotulo: 'Olhar a fila', texto: 'Dois dos meninos reclamaram de dor nas pernas, e um deles pediu para sair.' },
    opcoes: [
      op('Falar com o técnico antes de começar, explicar o motivo de poupar quem reclamou e propor uma versão leve para todos.',
        'O técnico resiste, mas aceita a versão leve. Os meninos terminam o treino sem dor.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'cuidar de quem é menor e dizer o que viu, com respeito, a quem tem poder.'),
      op('Aplicar o treino como o técnico pediu.',
        'O treino sai conforme o planejado. Um dos meninos para de treinar na semana seguinte.',
        [0.3, 0.2, 0.5], -0.6, { U: 1 },
        'obedecer a quem manda, deixando a proteção dos meninos de lado.'),
      op('Reduzir o treino dos que reclamaram, sem avisar o técnico.',
        'Os meninos agradecem. O técnico nota a diferença e reclama de você diante dos outros.',
        [0.3, 0.3, 0.4], 0.2, { I: 1 },
        'proteger os meninos sem dizer a quem decide, por cima do técnico.')
    ],
    conceito: { titulo: 'Cuidado com quem é menor', texto: 'Crianças e adolescentes em crescimento têm limites próprios, e o dever de cuidado é maior quando quem decide é um adulto com poder. Dizer o que se vê, com respeito, protege quem não tem como se defender.' }
  },
  {
    id: 'vestiario', hora: '13h30', titulo: 'O vestiário', margem: 0.7,
    texto: 'No vestiário, três atletas chamam um colega mais lento, o goleiro reserva, por um apelido humilhante e imitam o jeito dele de andar. O treinador está na porta e ri.',
    info: { rotulo: 'Olhar o goleiro', texto: 'O goleiro fica quieto e sai primeiro. Ele já faltou a dois treinos nesta semana.' },
    opcoes: [
      op('Fingir que não viu: é “coisa de vestiário”.',
        'A brincadeira continua nos dias seguintes. O goleiro deixa de ir ao banho coletivo.',
        [0.4, 0.4, 0.2], -0.6, {},
        'omitir-se diante da humilhação de um colega mais fraco.'),
      op('Interromper com firmeza, falar com o treinador e propor uma conversa com todo o grupo sobre respeito, com apoio da psicóloga do clube.',
        'O treinador fica sem graça. A conversa acontece, e a brincadeira muda.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'agir na hora e levar o assunto ao grupo, contrariando quem lidera.'),
      op('Conversar só com o goleiro depois e dizer que ele deve ignorar.',
        'Ele agradece o carinho, mas continua sozinho com a situação.',
        [0.3, 0.4, 0.3], -0.2, {},
        'consolar a vítima, deixando que o problema continue.')
    ],
    conceito: { titulo: 'Omissão e respeito pela pessoa', texto: 'Omitir-se é deixar de agir tendo dever, conhecimento e possibilidade de intervir. A humilhação repetida tem efeito sobre quem a sofre, e a responsabilidade de quem lidera inclui o clima do grupo.' }
  },
  {
    id: 'agrado', hora: '15h00', titulo: 'O agrado', margem: 0.7,
    texto: 'Um empresário de jogadores oferece a você um relógio “de agradecimento” e pede que, quando o técnico montar a lista do jogo, você diga que o atleta dele “está no ponto” e merece jogar.',
    info: { rotulo: 'Rever as avaliações', texto: 'Nos testes, o atleta do empresário está abaixo da média do grupo e tem duas faltas recentes sem justificativa.' },
    opcoes: [
      op('Aceitar o relógio e dizer ao técnico que o atleta “está no ponto”.',
        'O atleta é escalado. Um colega que treinou mais fica no banco, sem saber por quê.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'trocar uma avaliação por uma vantagem pessoal.'),
      op('Recusar o presente e dizer ao técnico o que os testes mostram, sem mencionar o empresário.',
        'O empresário se afasta. O técnico escolhe com base nos dados.',
        [0.2, 0.2, 0.6], 0.3, { V: 1, I: 1 },
        'dizer a verdade sobre os dados, sem levar a oferta a quem coordena.'),
      op('Recusar o presente, dizer ao técnico o que os testes mostram e avisar o coordenador sobre a oferta do empresário.',
        'O empresário perde o acesso à comissão. O coordenador passa a registrar os contatos com empresários.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade e transparência: recusar, informar os dados e comunicar a oferta.')
    ],
    conceito: { titulo: 'Conflito de interesse e veracidade', texto: 'Receber vantagem de quem tem interesse numa decisão compromete a independência de quem avalia. Dizer ao técnico o que os dados mostram, e comunicar a oferta, protege quem merece jogar e protege a você.' }
  },
  {
    id: 'reporter', hora: '16h20', titulo: 'A pergunta do repórter', margem: 0.7,
    texto: 'Um repórter pergunta pelo estado de saúde do atacante do time principal, que machucou o joelho. Um colega da comissão diz: “Fala só um pouquinho, é publicidade para o clube.” O atleta ainda não conversou com a família sobre a gravidade.',
    info: { rotulo: 'Ver o que já foi comunicado', texto: 'O exame saiu hoje, e só o atleta, o médico e dois membros da comissão sabem o resultado.' },
    opcoes: [
      op('Dizer o que sabe sobre a lesão: o clube ganha visibilidade, e o atleta é conhecido.',
        'A notícia sai com detalhes do exame. O atleta lê antes de falar com a família.',
        [0.4, 0.3, 0.3], -0.7, { U: 1 },
        'expor uma informação que pertence ao atleta, em nome da imagem do clube.'),
      op('Dizer que não pode falar sobre o caso e encaminhar o repórter para a assessoria de imprensa do clube.',
        'O repórter agradece e insiste com outra pessoa. A assessoria informa só o que o atleta autorizou.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'sigilo e veracidade: dizer que não cabe a você falar e encaminhar.'),
      op('Dizer que não sabe de nada e pedir que o repórter volte depois.',
        'O repórter vai embora. O atleta não sabe que você sabia e que negou.',
        [0.3, 0.3, 0.4], -0.1, {},
        'proteger o atleta com uma mentira, em vez de dizer que não cabe a você falar.')
    ],
    conceito: { titulo: 'Sigilo e veracidade', texto: 'Informação de saúde pertence à pessoa, e o sigilo protege quem está vulnerável. Negar que sabe é mentir; dizer que não cabe a você falar, e encaminhar, é honesto e protege o atleta.' }
  },
  {
    id: 'cera', hora: '17h20', titulo: 'A cera', margem: 0.7,
    texto: 'No intervalo do jogo da base, o técnico manda os meninos “fazerem cera”: deitar no chão e simular dor para gastar tempo e esfriar o adversário, que está ganhando.',
    info: { rotulo: 'Olhar o banco', texto: 'Um dos meninos, de quinze anos, pergunta baixinho se pode dizer que não quer fazer.' },
    opcoes: [
      op('Repetir a ordem do técnico aos meninos: quem manda é ele.',
        'Os meninos fingem. O juiz dá cartão, e um menino fica incomodado com o que fez.',
        [0.4, 0.3, 0.3], -0.5, { U: 1 },
        'obedecer a quem manda, ensinando a enganar como parte do jogo.'),
      op('Não dizer nada ao técnico nem aos meninos e deixar cada um fazer o que quiser.',
        'Metade finge e a outra metade não. A confusão aparece em campo.',
        [0.3, 0.4, 0.3], -0.2, {},
        'evitar a decisão, deixando o peso do jogo recair sobre os meninos.'),
      op('Dizer ao menino que ele não precisa fingir e conversar com o técnico depois do jogo sobre isso.',
        'O menino fica no banco, aliviado. O técnico reclama e depois aceita conversar.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'fair play: proteger o menino da ordem de enganar e levar o assunto ao técnico em outra hora.')
    ],
    conceito: { titulo: 'Fair play e veracidade', texto: 'Fair play é competir com lealdade ao adversário e às regras. Simular uma lesão é enganar, e quem forma jovens ensina com o exemplo o que é aceitável.' }
  },
  {
    id: 'reserva', hora: '19h00', titulo: 'O reserva', margem: 0.6,
    texto: 'O volante reserva, de dezoito anos, vem conversar depois do jogo. Diz que está triste, sem vontade de treinar desde que perdeu a vaga, e pede: “Não conta pro técnico, nem pra ninguém.”',
    info: { rotulo: 'Perguntar mais', texto: 'Ele conta que dorme mal, pensa em largar o futebol e não fala com a família sobre isso.' },
    opcoes: [
      op('Prometer segredo e dizer que isso passa com o tempo.',
        'Ele agradece. Nas semanas seguintes, o mal-estar continua, e só você sabe.',
        [0.3, 0.4, 0.3], -0.3, {},
        'proteger a confiança do atleta, ficando sozinho com um risco que não cabia a você.'),
      op('Contar ao técnico, para ele dar mais atenção ao garoto.',
        'O técnico reage com rispidez, e o atleta se sente exposto.',
        [0.3, 0.3, 0.4], -0.3, {},
        'avisar quem decide, sem dar voz nem escolha ao atleta.'),
      op('Ouvir com atenção, dizer que não pode prometer segredo se ele estiver em risco e sugerir que a psicóloga do clube o receba, oferecendo-se para acompanhá-lo à primeira conversa.',
        'Ele reluta, mas aceita. A psicóloga o recebe no dia seguinte.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, C: 1 },
        'escutar, ser honesto sobre o limite do sigilo e encaminhar com acompanhamento.')
    ],
    conceito: { titulo: 'Cuidado e limite do sigilo', texto: 'Cuidar é escutar, proteger e encaminhar, sem decidir pelo outro. O sigilo tem limite quando há risco, e dizer isso com clareza é veracidade. Atleta também é pessoa, e não só desempenho.' }
  },
  {
    id: 'promessa', hora: '20h00', titulo: 'A promessa', margem: 0.8,
    texto: 'O pai de um atacante de dezesseis anos, que vem de outra cidade e mora no alojamento do clube, pergunta se o filho vai ser profissionalizado. O diretor já decidiu que não, mas pediu à comissão que diga: “Está tudo encaminhado”, para o menino render até o fim da temporada.',
    info: { rotulo: 'Ver o contrato', texto: 'O contrato do atleta termina no fim do ano, e o clube não pretende renová-lo.' },
    opcoes: [
      op('Dizer que não pode falar de contrato e encaminhar o pai ao diretor, sem confirmar nem negar nada.',
        'O pai insiste e sai com a dúvida. O diretor evita a conversa.',
        [0.2, 0.3, 0.5], 0.2, { I: 1 },
        'não mentir, mas deixar a família sem resposta.'),
      op('Dizer ao pai que está tudo encaminhado, como o diretor pediu.',
        'O pai agradece e fica aliviado. O menino rende mais nos jogos.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'enganar uma família para o atleta render.'),
      op('Dizer ao diretor que a família merece a verdade e pedir que ele converse com o pai, com apoio do serviço social do clube.',
        'O diretor se irrita, mas marca a conversa. O pai sofre, mas tem tempo de procurar outro clube.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'veracidade com quem tem menos poder: a verdade, a tempo de escolher.')
    ],
    conceito: { titulo: 'Veracidade e dever com quem é vulnerável', texto: 'Dizer a verdade também é um dever com quem depende de uma decisão. Enganar uma família para o atleta render viola a confiança, e a quem tem menos poder cabe o direito de saber a tempo de escolher.' }
  }
];

export const CONTEXTOS = {
  tornozelo: {
    baixo: 'A final é só no mês que vem, e o técnico falou de maneira calma.',
    medio: 'A final é amanhã, e o técnico insiste.',
    alto: 'É a final de amanhã, é a terceira vez neste ano que o capitão joga machucado e o técnico já disse que “quem faz drama fica de fora”.'
  },
  comprimido: {
    baixo: 'O colega falou em tom de brincadeira, e os atletas riram.',
    medio: 'O colega diz que já deu a vários jogadores e que “nunca deu nada”.',
    alto: 'É a terceira vez neste mês que o colega traz algo parecido, e hoje os atletas já estão com a cartela na mão.'
  },
  peneira: {
    baixo: 'O técnico fez o pedido de passagem, e a lista só será fechada no fim da semana.',
    medio: 'O técnico quer a lista fechada ainda hoje.',
    alto: 'É a terceira vez em três anos que um indicado da diretoria entra por pedido, e o conselheiro está nas arquibancadas.'
  },
  extra: {
    baixo: 'O jogo da manhã foi leve, e o técnico falou com calma.',
    medio: 'O técnico quer recuperar o jogo perdido e acelerou o treino.',
    alto: 'É o terceiro dia seguido de treino extra, e hoje o técnico avisou que “quem pedir para sair, não viaja”.'
  },
  vestiario: {
    baixo: 'Foi a primeira vez que o apelido apareceu, e o goleiro riu sem graça.',
    medio: 'O apelido já apareceu em outros treinos, e o treinador costuma rir.',
    alto: 'É a terceira vez nesta semana que isso acontece, o apelido já circula em grupos de mensagem e o goleiro faltou de novo.'
  },
  agrado: {
    baixo: 'O empresário foi simpático e disse que não tem pressa.',
    medio: 'O empresário diz que outros clubes “já ajudaram” e quer a resposta hoje.',
    alto: 'É a terceira vez neste ano que ele aparece com um pedido assim, e dessa vez fala diante de outros membros da comissão.'
  },
  reporter: {
    baixo: 'O repórter perguntou de passagem, e o atleta está em exame.',
    medio: 'O repórter insiste e diz que já tem outras fontes.',
    alto: 'É a terceira vez nesta semana que o jornal pergunta, e um colega já deu detalhes do atleta a um grupo de mensagens.'
  },
  cera: {
    baixo: 'O time perde por um gol, e o técnico falou rindo.',
    medio: 'O time perde por dois gols, e o técnico está irritado.',
    alto: 'É a terceira vez nesta temporada que o técnico pede isso e, dessa vez, diz que “quem não fingir, não joga na semana que vem”.'
  },
  reserva: {
    baixo: 'Ele fala com calma e diz que é a primeira vez que se sente assim.',
    medio: 'Ele diz que já se sentiu assim em outras temporadas.',
    alto: 'Ele diz que, pela terceira vez neste ano, perdeu a vaga e que já pensou em largar tudo.'
  },
  promessa: {
    baixo: 'O diretor pediu com delicadeza e disse que o pai só quer notícias.',
    medio: 'O diretor quer que a resposta seja dada hoje e disse que a decisão ainda é sigilosa.',
    alto: 'É a terceira família deste ano a perguntar sobre o mesmo, o jogo mais importante da temporada é amanhã e o diretor já avisou que “quem falar demais, sai da comissão”.'
  }
};

export const VALORES = {
  tornozelo: [{ p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao'] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }],
  comprimido: [{ p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional', 'verdade'] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'justica'], s: ['colegas'] }],
  peneira: [{ p: ['verdade', 'justica'], s: ['instituicao'] }, { p: ['instituicao'], s: ['justica', 'verdade', 'vulneraveis'] }, { p: ['justica', 'verdade', 'vulneraveis', 'instituicao'], s: [] }],
  extra: [{ p: ['vulneraveis', 'profissional', 'verdade', 'colegas'], s: [] }, { p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis'], s: ['colegas', 'verdade'] }],
  vestiario: [{ p: ['colegas'], s: ['vulneraveis', 'profissional', 'justica'] }, { p: ['vulneraveis', 'profissional', 'justica', 'verdade'], s: ['colegas'] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }],
  agrado: [{ p: ['meta'], s: ['verdade', 'justica', 'profissional', 'colegas'] }, { p: ['verdade', 'justica', 'profissional'], s: [] }, { p: ['verdade', 'justica', 'profissional', 'instituicao'], s: [] }],
  reporter: [{ p: ['instituicao'], s: ['vulneraveis', 'confianca', 'profissional'] }, { p: ['vulneraveis', 'confianca', 'profissional', 'verdade'], s: [] }, { p: ['confianca'], s: ['verdade'] }],
  cera: [{ p: ['instituicao', 'meta'], s: ['verdade', 'justica'] }, { p: [], s: ['verdade', 'vulneraveis'] }, { p: ['verdade', 'justica', 'vulneraveis'], s: ['instituicao'] }],
  reserva: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional'], s: ['confianca', 'vulneraveis'] }, { p: ['profissional', 'vulneraveis', 'confianca', 'verdade'], s: [] }],
  promessa: [{ p: ['profissional'], s: ['vulneraveis', 'verdade'] }, { p: ['instituicao', 'meta'], s: ['verdade', 'vulneraveis', 'confianca'] }, { p: ['verdade', 'vulneraveis', 'confianca', 'profissional'], s: ['instituicao'] }]
};

export const APLICACAO = {
  titulo: 'Um vídeo do gol',
  situacao: 'Na base, alguém grava o gol de um atleta de quinze anos, e a família autoriza o envio ao grupo dos responsáveis. Depois, uma pessoa sugere postar o vídeo no perfil do clube e marcar empresários para mostrar o menino.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de dar visibilidade ao atleta pode ser legítima. A postagem pública e a marcação de empresários são outro meio: mudam o público, o alcance e o que pode acontecer com um adolescente. A autorização para um uso não vale automaticamente para o outro. Que efeito cada alternativa teria para o atleta, para a família e para o clube?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em atletas, colegas e no clube, e eles aparecem ao longo da revelação.';
