// Limiar Ético · Um dia na academia.
// Situações do estágio em academia e personal training (triagem, suplementos, imagem corporal, metas de venda,
// confidencialidade, registro profissional), com nomes e detalhes inventados. A pessoa jogadora é estagiária ou estagiário
// e acompanha o professor responsável pela sala de musculação.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia na academia',
  texto: [
    'Você faz estágio em uma academia de bairro e acompanha o professor responsável pela sala de musculação. Hoje é dia de avaliações novas, de sala cheia no fim da tarde e de reunião com a gerência sobre as metas do mês.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'triagem', hora: '06h30', titulo: 'A primeira avaliação', margem: 0.5,
    texto: 'Um aluno novo, de 52 anos, chega para a avaliação física. Nunca fez exercício e quer começar hoje, mas deixou em branco as perguntas da ficha sobre a saúde do coração. A gerência pediu que as matrículas do dia “saiam rápido”.',
    info: { rotulo: 'Reler a ficha de triagem', texto: 'Ele marcou que fuma e que o pai teve problema no coração. Deixou em branco a pergunta sobre exames recentes.' },
    opcoes: [
      op('Fazer a avaliação e liberar um treino leve hoje, deixando o pedido de exames para depois.',
        'Ele treina animado. Nos dias seguintes, ninguém retoma o pedido de exames.',
        [0.3, 0.2, 0.5], -0.3, { U: 1 },
        'agilizar a matrícula, deixando a triagem de saúde para depois.'),
      op('Explicar que a triagem precisa ser completada, pedir a liberação de um médico e conversar sobre o início do treino enquanto isso.',
        'Ele reclama do atraso, mas aceita. A liberação chega em uma semana.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'colocar a segurança da pessoa antes da pressa da matrícula, com um caminho para começar.'),
      op('Pedir que ele complete a ficha ali mesmo e, se tudo estiver preenchido, seguir com a avaliação sem pedir mais nada.',
        'Ele marca que “não sabe” sobre os exames. A avaliação segue, e a dúvida fica só no papel.',
        [0.2, 0.2, 0.6], 0.1, { I: 1 },
        'cumprir o procedimento no papel, sem tratar o que a resposta “não sei” indicava.')
    ],
    conceito: { titulo: 'Triagem, não maleficência e limites de competência', texto: 'Antes de prescrever esforço, é preciso conhecer os riscos da pessoa. Não maleficência é evitar danos previsíveis, e reconhecer o que cabe a quem avalia e pedir a liberação de quem pode dá-la faz parte da ética profissional.' }
  },
  {
    id: 'suplemento', hora: '08h00', titulo: 'O pré-treino', margem: 0.6,
    texto: 'Uma aluna de 19 anos pergunta se pode tomar o “pré-treino” e o emagrecedor que uma amiga vende, e pede que você diga quanto tomar. Ela comenta que, às vezes, sente o coração acelerado depois.',
    info: { rotulo: 'Olhar o rótulo', texto: 'O pote não tem registro visível nem lista completa dos ingredientes.' },
    opcoes: [
      op('Dizer quanto você acha que ela pode tomar, já que é só um suplemento.',
        'Ela agradece e passa a seguir a sua orientação como se fosse da academia. Você não sabe o que há no pote.',
        [0.4, 0.2, 0.4], -0.6, {},
        'responder além da formação, para ser útil.'),
      op('Não comentar o produto e dizer que treino e sono ajudam mais do que qualquer pote.',
        'A conversa termina bem, mas ela continua tomando, e ninguém fica sabendo do coração acelerado.',
        [0.2, 0.3, 0.5], -0.2, {},
        'evitar o assunto, deixando de lado um sinal que ela contou.'),
      op('Dizer que indicar suplemento não é com você, pedir que ela pare até falar com uma nutricionista e contar ao médico o que sentiu.',
        'Ela fica contrariada, mas marca consulta. A amiga que vende o produto reclama na academia.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'reconhecer o limite da própria formação e encaminhar, sem abandonar a aluna.')
    ],
    conceito: { titulo: 'Limites de competência', texto: 'Reconhecer o que a formação permite fazer e encaminhar quando necessário faz parte da ética profissional. Indicar suplemento e quantidade cabe ao nutricionista e ao médico, e ignorar um sinal de risco que a pessoa conta é imprudência.' }
  },
  {
    id: 'ciclo', hora: '10h00', titulo: 'O ciclo', margem: 0.8,
    texto: 'Um aluno de 22 anos, que treina há dois anos, pede que você “passe um ciclo” de esteroide anabolizante. Diz que vai usar de qualquer jeito, que já comprou de um conhecido e que só quer “fazer certo”.',
    info: { rotulo: 'Perguntar o que ele sabe', texto: 'Ele não fez exames de sangue, não conversou com nenhum médico e diz que “todo mundo da academia usa”.' },
    opcoes: [
      op('Dizer que não pode indicar nem orientar o uso, explicar com franqueza os riscos que conhece, pedir que ele procure um médico antes de qualquer decisão e avisar o professor responsável.',
        'Ele ouve com cara de desagrado, mas marca uma consulta. O professor responsável conversa com ele no dia seguinte.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'recusar o que não cabe a você sem abandonar quem pediu: franqueza, encaminhamento e equipe.'),
      op('Recusar e encerrar a conversa: “isso é proibido, não quero saber”.',
        'Ele diz que vai pedir a outra pessoa. Você não fica sabendo do que acontece depois.',
        [0.4, 0.3, 0.3], 0.1, { I: 1 },
        'cumprir o dever de não indicar, deixando o aluno sozinho com o risco.'),
      op('Passar só o que “reduz o dano”, já que ele vai usar de qualquer jeito.',
        'Ele agradece e passa a confiar mais em você do que em um médico. Você assumiu uma orientação que não é sua.',
        [0.3, 0.2, 0.5], -0.7, { U: 1 },
        'tentar diminuir o dano, assumindo um papel que não é da sua formação.')
    ],
    conceito: { titulo: 'Beneficência, não maleficência e limites de competência', texto: 'Não maleficência é evitar ou reduzir danos previsíveis. Isso não autoriza orientar o que está fora da sua formação: o cuidado combina franqueza sobre os riscos, encaminhamento a quem pode orientar e acompanhamento.' }
  },
  {
    id: 'espelho', hora: '11h30', titulo: 'O espelho', margem: 0.7,
    texto: 'Uma aluna que treina todos os dias pede que você aumente o treino para duas vezes por dia e que a ajude a cortar quase tudo o que come “até o casamento da prima”. Ela olha o corpo no espelho com insatisfação, mesmo com tudo o que já conquistou.',
    info: { rotulo: 'Olhar o histórico dela', texto: 'Em dois meses ela perdeu peso rápido, treina mesmo quando está com dor e já faltou ao trabalho para não perder o treino.' },
    opcoes: [
      op('Atender: ela é maior de idade e sabe o que quer.',
        'Ela segue o plano e agradece. Semanas depois, você a vê tonta no meio do treino.',
        [0.3, 0.2, 0.5], -0.6, {},
        'respeitar o pedido da aluna, deixando de olhar para os sinais de risco.'),
      op('Ouvir como ela está se sentindo, dizer que não vai aumentar o treino e sugerir uma conversa com um profissional de saúde, avisando o professor responsável.',
        'Ela chora um pouco, resiste e diz que vai pensar. O professor responsável passa a acompanhá-la de perto.',
        [0.1, 0.3, 0.6], 0.6, { V: 2, C: 1 },
        'escutar, limitar o dano e encaminhar, sem decidir pela pessoa.'),
      op('Dizer que não vai aumentar nada, sem explicar, e passar para o próximo aluno.',
        'Ela sai calada e treina sozinha em outro horário.',
        [0.4, 0.2, 0.4], 0.0, { I: 1 },
        'recusar o pedido, sem escuta e sem caminho.')
    ],
    conceito: { titulo: 'Ética do cuidado e pessoa integral', texto: 'Cuidar não é decidir pelo outro: combina escuta, proteção e participação. Quem treina olha para a pessoa inteira, e não só para o desempenho, e sinais de sofrimento pedem encaminhamento a quem pode tratar.' }
  },
  {
    id: 'meta', hora: '14h00', titulo: 'A meta do mês', margem: 0.5,
    texto: 'Na reunião, a gerência pede que cada estagiário e professor venda pacotes de vinte sessões de personal neste mês. O próximo aluno da sua lista treina bem sozinho e conta que está com o orçamento apertado.',
    info: { rotulo: 'Ver o histórico do aluno', texto: 'Ele treina três vezes por semana, tem boa técnica e só pediu uma revisão do treino a cada mês.' },
    opcoes: [
      op('Oferecer o pacote completo: a meta é do grupo e ele pode precisar.',
        'Ele fecha para não parecer mesquinho e atrasa outra conta. A sua meta fica em dia.',
        [0.3, 0.3, 0.4], -0.5, { U: 1 },
        'bater a meta, vendendo o que a pessoa não pedia.'),
      op('Não oferecer nada, para não correr o risco de empurrar.',
        'O aluno segue como estava, e você não diz nada à gerência.',
        [0.3, 0.3, 0.4], 0.0, {},
        'evitar o dilema, sem dizer nem ao aluno nem à gerência o que pensava.'),
      op('Contar a ele que o que precisa é de uma revisão mensal, oferecer só isso e avisar a gerência de que a meta não vai fechar com ele.',
        'A gerência fica contrariada, mas aceita. O aluno agradece a franqueza.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'dizer a verdade sobre o que a pessoa precisa, aceitando o custo na meta.')
    ],
    conceito: { titulo: 'Veracidade e conflito de interesse', texto: 'Veracidade é dizer o que é, mesmo quando isso custa. Há conflito de interesse quando a vantagem de quem atende, como a meta ou a comissão, pode pesar mais do que a necessidade de quem é atendido.' }
  },
  {
    id: 'treino', hora: '15h20', titulo: 'O treino do colega', margem: 0.7,
    texto: 'Um aluno com dor no ombro conta que o personal dele, seu colega mais experiente, passou uma carga que “vai com dor mesmo”. Você viu a ficha, e a carga está muito acima do que ele consegue fazer com boa técnica.',
    info: { rotulo: 'Ver o exercício', texto: 'Ele faz o movimento com o tronco jogado para trás, e o ombro dói no fim de cada série.' },
    opcoes: [
      op('Pedir ao aluno que pare o exercício, dizer que vai conversar com o colega e levar o caso ao professor responsável se a carga não mudar.',
        'O colega se incomoda, mas reconhece que a carga estava alta. O professor responsável revê o plano com os dois.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'defender o aluno e dar chance ao colega de corrigir antes de escalar.'),
      op('Dizer ao aluno que o seu colega sabe o que faz e que a dor passa.',
        'O aluno continua. Duas semanas depois, para de treinar por causa do ombro.',
        [0.3, 0.3, 0.4], -0.6, {},
        'proteger o colega, deixando o aluno com o risco.'),
      op('Reduzir a carga do aluno na sua frente e não dizer nada ao colega.',
        'O aluno melhora hoje, mas o colega mantém a carga na próxima aula e o aluno fica sem saber em quem confiar.',
        [0.3, 0.2, 0.5], 0.1, { I: 1 },
        'proteger o aluno de imediato, sem enfrentar a origem do problema.')
    ],
    conceito: { titulo: 'Coleguismo e complacência', texto: 'Coleguismo é a solidariedade entre colegas, e inclui dizer com respeito o que está errado. Complacência é aceitar o erro do colega para evitar conflito, mesmo quando alguém pode se machucar.' }
  },
  {
    id: 'bolsa', hora: '16h30', titulo: 'As bolsas', margem: 0.8,
    texto: 'A academia tem cinco bolsas sociais de mensalidade, e vinte e duas pessoas pediram. A gerência pede a você e ao professor responsável uma proposta de critério.',
    info: { rotulo: 'Ver os pedidos', texto: 'Há duas pessoas com doença crônica indicada por médico, dois idosos de renda baixa e um sobrinho de um conhecido da gerência.' },
    opcoes: [
      op('Dar as bolsas por ordem de chegada dos pedidos.',
        'O critério é fácil de explicar. As cinco primeiras vagas vão para quem tinha mais tempo livre para vir cedo.',
        [0.2, 0.2, 0.6], 0.1, { I: 1 },
        'igualdade formal: a mesma regra para todos, sem olhar para as diferenças.'),
      op('Propor um critério por necessidade, com indicação de saúde e renda, divulgado a todos, e dizer que o pedido do sobrinho entra na mesma regra.',
        'A gerência hesita, mas aceita. Alguns pedidos ficam de fora, e todos sabem por quê.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, U: 1 },
        'equidade: critério público, que considera necessidades diferentes e não abre exceção.'),
      op('Dar uma bolsa ao sobrinho do conhecido da gerência e sortear as outras.',
        'A gerência fica satisfeita. Os outros pedidos ficam sem explicação.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'favor: o critério foi ajustado ao conhecido de quem decide.')
    ],
    conceito: { titulo: 'Justiça e equidade', texto: 'Igualdade é a mesma regra para todos, e equidade considera necessidades e barreiras diferentes. Um critério justo pode ser explicado em público, sem exceção para quem é conhecido de quem decide.' }
  },
  {
    id: 'ficha', hora: '17h40', titulo: 'A ficha no grupo', margem: 0.7,
    texto: 'No grupo de mensagens dos professores, um colega posta a foto da ficha de avaliação de um aluno, com peso, medidas e uma piada sobre o resultado. Vários riem.',
    info: { rotulo: 'Ver quem está no grupo', texto: 'Estão no grupo dezoito pessoas, incluindo a recepção e dois estagiários de outra faculdade. O aluno é vizinho de uma das recepcionistas.' },
    opcoes: [
      op('Pedir no grupo que a foto seja apagada, lembrar que a ficha é confidencial e avisar o professor responsável.',
        'O clima fica pesado por algumas horas. A foto é apagada, e a gerência passa a orientar o uso do grupo.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'defender o aluno ausente e levar a regra à instituição.'),
      op('Escrever ao colega em particular, pedir que apague a foto e explicar o motivo.',
        'O colega apaga a foto e diz que “era brincadeira”. O grupo não fica sabendo, e quem coordena também não.',
        [0.2, 0.3, 0.5], 0.4, { V: 1, I: 1 },
        'corrigir sem expor o colega, mas sem avisar quem coordena.'),
      op('Rir também, para não ficar de fora.',
        'A piada ganha mais três respostas. No dia seguinte, a recepcionista faz um comentário ao aluno.',
        [0.4, 0.4, 0.2], -0.7, {},
        'seguir a turma, deixando a dignidade e a confidencialidade do aluno de lado.')
    ],
    conceito: { titulo: 'Confidencialidade e respeito pela pessoa', texto: 'Dados de saúde e de corpo são confidenciais, e a pessoa tem o direito de não ser exposta nem ridicularizada. O dever de sigilo vale também nas conversas informais entre colegas.' }
  },
  {
    id: 'antesdepois', hora: '18h30', titulo: 'O antes e depois', margem: 0.8,
    texto: 'A gerência pede que você poste no perfil da academia as fotos de “antes e depois” de uma aluna que emagreceu muito. Ela autorizou o uso no ano passado, para o álbum interno. Hoje está de licença e não respondeu à sua mensagem.',
    info: { rotulo: 'Reler a autorização', texto: 'O termo assinado diz “uso interno da academia” e não cita redes sociais.' },
    opcoes: [
      op('Postar: ela autorizou e está feliz com o resultado.',
        'A postagem se espalha pelo bairro. Ela vê pelo celular de uma amiga e pede que seja apagada.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'tratar a autorização de um uso como se valesse para outro.'),
      op('Postar sem o rosto e sem o nome dela, para reduzir o risco.',
        'A aluna ainda é reconhecida pelas tatuagens, e a academia passa a ter o corpo dela como propaganda.',
        [0.3, 0.2, 0.5], -0.2, {},
        'diminuir a exposição sem pedir autorização para o novo uso.'),
      op('Dizer à gerência que o termo não cobre as redes e esperar a resposta dela, sem postar até lá.',
        'A gerência reclama do atraso. A resposta chega dias depois, e ela autoriza só uma das fotos.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'respeitar o consentimento para cada uso, aceitando a demora.')
    ],
    conceito: { titulo: 'Consentimento e privacidade', texto: 'A autorização para um uso específico não se estende automaticamente a outro. Mostrar o corpo e a imagem de alguém em público muda o alcance e a exposição, e o consentimento precisa ser livre e esclarecido para cada uso.' }
  },
  {
    id: 'registro', hora: '19h30', titulo: 'Sem registro', margem: 0.7,
    texto: 'Na sala de musculação há um instrutor muito querido pelos alunos, que monta treinos individuais e se apresenta como “professor”. Você descobre que ele não tem a formação nem o registro no conselho da profissão. O dono da academia pede que você “não comente isso com ninguém”.',
    info: { rotulo: 'Ver a escala', texto: 'Ele cuida sozinho da sala em três horários por semana, e dois alunos dele têm restrições de saúde registradas.' },
    opcoes: [
      op('Concordar em ficar quieto: ele é bom e os alunos gostam.',
        'Tudo segue como estava. Você passa a evitar o assunto quando o professor responsável pergunta.',
        [0.3, 0.4, 0.3], -0.4, {},
        'aceitar pelo costume o que a norma não permite.'),
      op('Contar ao professor responsável e à coordenação do estágio e pedir que os alunos com restrições sejam atendidos por quem tem formação.',
        'O dono se irrita com você. O professor responsável reorganiza a escala, e o instrutor é orientado a se regularizar.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'distinguir o que é costume, o que é legal e o que é ético, e proteger quem corre mais risco.'),
      op('Falar com o instrutor e sugerir que ele regularize a situação, sem levar o caso adiante.',
        'Ele diz que vai ver. Nada muda nos meses seguintes.',
        [0.2, 0.3, 0.5], 0.1, { I: 1, V: 1 },
        'agir como colega, sem acionar quem responde pela academia.')
    ],
    conceito: { titulo: 'Legal, ético e costume', texto: 'Nem tudo o que é costume é ético, e nem tudo o que é permitido é correto. O exercício da profissão exige formação e registro justamente para proteger quem é atendido, e isso se une ao dever de veracidade.' }
  }
];

export const CONTEXTOS = {
  triagem: {
    baixo: 'É o primeiro aluno do dia, e a gerência não fez nenhuma cobrança.',
    medio: 'A gerência já comentou duas vezes hoje que a matrícula precisa sair rápido.',
    alto: 'Pela terceira vez nesta semana a gerência cobra matrículas sem demora, e o aluno diz que só consegue vir hoje.'
  },
  suplemento: {
    baixo: 'A aluna pergunta com curiosidade, em um horário tranquilo da sala.',
    medio: 'Ela pergunta com a sala cheia e já mostrou o pote a outras alunas.',
    alto: 'É a terceira aluna desta semana que pergunta sobre o mesmo produto, e a amiga que o vende costuma ficar por perto da sala.'
  },
  ciclo: {
    baixo: 'Ele pergunta em voz baixa, num horário vazio, e diz que ainda está só pensando.',
    medio: 'Ele diz que já comprou e que pretende começar na semana que vem.',
    alto: 'É a terceira pessoa deste mês que pede isso a você, e esse aluno diz que já começou por conta própria.'
  },
  espelho: {
    baixo: 'Ela fala com leveza e diz que é só para uma ocasião.',
    medio: 'Ela já pediu a mesma coisa a outro professor e disse que vai fazer por conta própria.',
    alto: 'É a terceira vez que ela pede e, dessa vez, diz que vai treinar mesmo com dor.'
  },
  meta: {
    baixo: 'A gerência pediu a meta com tranquilidade e disse que cada um faz o que puder.',
    medio: 'A gerência avisou que quem não bater a meta perde o horário preferido.',
    alto: 'Pela terceira vez neste ano a gerência cobra a meta de vendas na frente dos colegas, e o seu nome ainda não está na lista de quem vendeu.'
  },
  treino: {
    baixo: 'O colega é simpático e aberto a conversas, e o aluno só reclamou de leve.',
    medio: 'O colega costuma dizer que não gosta de ser corrigido por estagiário.',
    alto: 'Pela terceira vez neste mês um aluno do mesmo colega se queixa de dor, e ele já disse que “estagiário não tem que opinar”.'
  },
  bolsa: {
    baixo: 'O prazo da lista é só no fim do mês, e a gerência aceita sugestões.',
    medio: 'A gerência quer a lista pronta até amanhã.',
    alto: 'É a terceira vez em dois anos que a lista das bolsas gera reclamação, e dessa vez a gerência pede o resultado hoje.'
  },
  ficha: {
    baixo: 'A foto foi postada em um grupo pequeno, só com professores.',
    medio: 'O grupo tem recepção e estagiários, e a piada já recebeu várias respostas.',
    alto: 'É a terceira ficha que aparece no grupo neste mês, e o aluno da foto já foi reconhecido por quem estava na recepção.'
  },
  antesdepois: {
    baixo: 'A aluna é tranquila com fotos e já posou outras vezes para a academia.',
    medio: 'A gerência quer postar ainda hoje, aproveitando a campanha do mês.',
    alto: 'É a terceira vez neste ano que a gerência pede fotos de alunos sem que o termo cubra o uso, e dessa vez a campanha já foi anunciada.'
  },
  registro: {
    baixo: 'O dono falou de passagem, sem insistir, e o instrutor está de folga hoje.',
    medio: 'O dono repetiu o pedido durante a reunião, e o instrutor está na sala.',
    alto: 'É a terceira vez que o dono pede esse silêncio, e hoje o instrutor assumiu sozinho a sala cheia.'
  }
};

export const VALORES = {
  triagem: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: [] }, { p: ['profissional'], s: ['vulneraveis'] }],
  suplemento: [{ p: ['confianca'], s: ['profissional', 'vulneraveis'] }, { p: [], s: ['vulneraveis', 'verdade'] }, { p: ['profissional', 'vulneraveis', 'verdade'], s: [] }],
  ciclo: [{ p: ['profissional', 'vulneraveis', 'verdade', 'confianca'], s: [] }, { p: ['profissional'], s: ['vulneraveis', 'confianca'] }, { p: ['confianca'], s: ['profissional', 'verdade'] }],
  espelho: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['profissional', 'vulneraveis', 'confianca', 'verdade'], s: [] }, { p: ['profissional'], s: ['vulneraveis', 'confianca'] }],
  meta: [{ p: ['instituicao', 'meta'], s: ['verdade', 'vulneraveis'] }, { p: ['vulneraveis'], s: ['verdade', 'instituicao'] }, { p: ['verdade', 'profissional', 'vulneraveis'], s: ['meta', 'instituicao'] }],
  treino: [{ p: ['vulneraveis', 'profissional', 'colegas', 'verdade'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional', 'verdade'] }, { p: ['vulneraveis'], s: ['colegas'] }],
  bolsa: [{ p: ['justica'], s: ['vulneraveis'] }, { p: ['justica', 'vulneraveis', 'verdade', 'instituicao'], s: [] }, { p: ['instituicao'], s: ['justica', 'vulneraveis', 'verdade'] }],
  ficha: [{ p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: ['colegas'] }, { p: ['vulneraveis', 'colegas'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional', 'confianca'] }],
  antesdepois: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional', 'verdade'] }, { p: ['instituicao'], s: ['vulneraveis', 'verdade'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao'] }],
  registro: [{ p: ['instituicao', 'colegas'], s: ['vulneraveis', 'profissional', 'verdade'] }, { p: ['profissional', 'vulneraveis', 'verdade'], s: ['colegas', 'instituicao'] }, { p: ['colegas', 'verdade'], s: ['vulneraveis'] }]
};

export const APLICACAO = {
  titulo: 'Um vídeo do treino',
  situacao: 'Um aluno grava um colega fazendo um exercício difícil e envia ao grupo da turma, com o consentimento dele. Depois, alguém propõe postar o vídeo no perfil público da academia para atrair novos alunos.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de atrair novos alunos pode ser legítima. A postagem pública é outro meio: muda o público, o alcance e a exposição da pessoa, que pode ser reconhecida e comentada por quem ela não conhece. A autorização para um uso específico não se estende automaticamente ao outro. Que efeito cada alternativa teria para o aluno e para a academia?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em alunos, colegas e na academia, e eles aparecem ao longo da revelação.';
