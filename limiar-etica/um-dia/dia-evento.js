// Limiar Ético · Um dia no evento da escola.
// Situações de um passeio e festival esportivo de encerramento do ano (autorização das famílias, transporte, calor,
// formação de times, regras e premiação, patrocínio, primeiros socorros, resultado, entrega de crianças e relatório),
// com nomes e detalhes inventados. A pessoa jogadora é estagiária ou estagiário e acompanha o professor responsável.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia no evento da escola',
  texto: [
    'Você faz estágio em uma escola e acompanha o professor responsável pelo festival esportivo de encerramento do ano, que começa com uma saída de ônibus para um campo fora da escola. Hoje é dia de autorizações, de provas e gincanas, de premiação e de volta para casa.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'autorizacao', hora: '07h00', titulo: 'As autorizações', margem: 0.7,
    texto: 'Na saída para o festival, oito alunos não trouxeram a autorização assinada. A diretora diz: “Leva todos, eles choram se ficarem, e eu assumo.”',
    info: { rotulo: 'Conferir a lista', texto: 'Entre os oito há duas crianças com restrição alimentar anotada na ficha e uma que mora com a avó, que talvez nem saiba do passeio.' },
    opcoes: [
      op('Tentar falar com cada responsável pelo telefone da escola, registrar a confirmação e deixar na escola, com atividade, quem não for confirmado.',
        'Seis famílias confirmam. Duas crianças ficam na escola, e uma chora ao ver o ônibus sair.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'consentimento dos responsáveis para cada criança, aceitando o custo.'),
      op('Levar todos: a diretora assumiu a responsabilidade.',
        'O ônibus sai cheio e animado. Uma das crianças com restrição come o que não devia, e ninguém sabe como avisar a família.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'seguir a ordem da direção, deixando os responsáveis de fora da decisão.'),
      op('Aceitar o recado de uma colega: “a mãe disse por mensagem que deixa”.',
        'Quatro crianças vão com base em recados de terceiros. Nenhum é registrado.',
        [0.3, 0.3, 0.4], -0.2, {},
        'aceitar uma confirmação informal, sem registro nem conferência.')
    ],
    conceito: { titulo: 'Responsabilidade e consentimento dos responsáveis', texto: 'Levar uma criança para fora da escola exige a autorização de quem responde por ela, e ordem de superior não substitui isso. O consentimento precisa ser conferido e registrado, e quem tem restrição de saúde anotada merece cuidado ainda maior.' }
  },
  {
    id: 'onibus', hora: '08h00', titulo: 'O ônibus', margem: 0.8,
    texto: 'O ônibus contratado é menor do que o combinado e não tem cinto para todos: são quarenta e dois alunos e vinte e oito lugares com cinto. O motorista diz que “sempre fez assim”.',
    info: { rotulo: 'Olhar o ônibus', texto: 'O corredor é estreito, e quatro lugares têm o cinto quebrado.' },
    opcoes: [
      op('Embarcar todos e pedir que os maiores segurem os menores no colo.',
        'O ônibus sai. A viagem corre sem acidente, e a prática fica como exemplo para os próximos passeios.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'resolver na hora, aceitando um risco que se podia evitar.'),
      op('Não sair com o ônibus assim: pedir à coordenação outro veículo ou duas viagens, mesmo atrasando.',
        'A diretora reclama do atraso. Chega outro ônibus em quarenta minutos, e todos viajam com cinto.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'não maleficência: recusar o risco previsível e propor outro caminho.'),
      op('Levar neste ônibus só os alunos mais velhos e deixar os menores para depois, sem avisar as famílias.',
        'Os menores esperam sem saber o que acontece. As famílias descobrem pelo grupo de mensagens.',
        [0.3, 0.3, 0.4], 0.0, {},
        'reduzir o risco, mas sem avisar quem responde pelas crianças.')
    ],
    conceito: { titulo: 'Não maleficência e imprudência', texto: 'Não maleficência é evitar danos previsíveis. Imprudência é agir sem a cautela exigida, mesmo quando “sempre foi assim”.' }
  },
  {
    id: 'calor', hora: '10h30', titulo: 'O calor', margem: 0.8,
    texto: 'O festival acontece em um campo aberto, sem sombra, e a gincana de corrida está marcada para o meio do dia. Alguns alunos estão vermelhos e pedem água. O coordenador do evento diz que “o cronograma é esse e acabou”.',
    info: { rotulo: 'Olhar os alunos', texto: 'Dois alunos estão tontos, e há uma só torneira para mais de quatrocentas pessoas.' },
    opcoes: [
      op('Dispensar das corridas só os alunos que reclamarem de tontura e manter o restante.',
        'Os que reclamaram descansam. Outros, que não dizem nada, seguem correndo.',
        [0.3, 0.3, 0.4], 0.1, { I: 1 },
        'proteger quem pede, deixando sem proteção quem não consegue pedir.'),
      op('Propor ao coordenador pausar a gincana, levar os alunos à sombra com água e mover as corridas para o fim da tarde, avisando o professor responsável.',
        'O coordenador reclama, mas aceita mudar o horário. Os alunos descansam, e o cronograma é refeito.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'evitar o dano previsível mudando as condições, não só os alunos.'),
      op('Seguir o cronograma: quem passar mal, descansa depois.',
        'A corrida acontece. Dois alunos precisam ser levados à sombra e recebem atendimento.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'cumprir o horário, deixando a proteção dos alunos para depois do problema.')
    ],
    conceito: { titulo: 'Não maleficência e dever de cuidado', texto: 'Quem organiza atividade física ao ar livre responde pelas condições em que ela acontece. Evitar danos previsíveis inclui adaptar horário, sombra e água, mesmo que o cronograma precise mudar, e não depender de quem consegue pedir ajuda.' }
  },
  {
    id: 'times', hora: '11h30', titulo: 'A escolha dos times', margem: 0.7,
    texto: 'Para a gincana, dois capitães montam os times escolhendo um colega por vez, na frente de todos. Um menino com sobrepeso e uma menina de óculos grossos vão ficando por último. Eles já olham para o chão.',
    info: { rotulo: 'Olhar a turma', texto: 'Alguns colegas começam a rir, e o professor do evento está do outro lado do campo.' },
    opcoes: [
      op('Deixar como está: sempre foi assim, e é parte do jogo.',
        'Os dois são escolhidos por último, e alguns colegas riem. A menina diz que prefere ficar sentada.',
        [0.4, 0.4, 0.2], -0.6, {},
        'aceitar o costume, deixando a exposição dos dois de lado.'),
      op('Chamar os dois para ficar de ajudantes de arbitragem, para “poupá-los”.',
        'Eles aceitam, aliviados. Os colegas entendem que os dois não servem para jogar.',
        [0.3, 0.4, 0.3], -0.2, {},
        'poupar quem era excluído, reforçando a exclusão.'),
      op('Interromper e fazer os times por sorteio equilibrado, explicando que todos jogam e que ninguém será escolhido na frente dos outros.',
        'Alguns reclamam, mas os times saem equilibrados. O menino e a menina jogam sem constrangimento.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'justiça e respeito: critério claro, e ninguém exposto.')
    ],
    conceito: { titulo: 'Respeito pela pessoa e justiça', texto: 'Respeitar a pessoa é evitar que alguém seja exposto e excluído diante dos outros. Justiça na atividade é garantir participação com critério claro, e poupar quem é excluído também pode reforçar a exclusão.' }
  },
  {
    id: 'serie', hora: '12h40', titulo: 'O corredor de outra série', margem: 0.7,
    texto: 'A equipe do 9º ano vence a prova de revezamento. Você percebe que um dos corredores é aluno do 1º ano do ensino médio, que foi “emprestado” pelo professor deles para completar o time. O regulamento do evento proíbe isso.',
    info: { rotulo: 'Conferir o regulamento', texto: 'O regulamento diz que só competem alunos da série da equipe, e a equipe que ficou em segundo perdeu por meio segundo.' },
    opcoes: [
      op('Ficar quieto: o evento é festivo, e a prova já terminou.',
        'A equipe recebe a medalha. A equipe do segundo lugar sai sem saber.',
        [0.4, 0.3, 0.3], -0.5, {},
        'calar diante de uma infração, para não estragar o clima.'),
      op('Avisar o coordenador do evento, mostrar o regulamento e sugerir revisar o resultado com a participação dos professores.',
        'O professor da equipe vencedora fica constrangido. O coordenador revê o resultado, e a medalha muda de mãos.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'fair play: levar a quem decide a infração que viu, em nome de quem competiu direito.'),
      op('Conversar com o professor da equipe e pedir que ele mesmo conte ao coordenador.',
        'O professor diz que vai ver. Nada acontece até o fim do evento.',
        [0.3, 0.3, 0.4], 0.1, { I: 1 },
        'dar a chance ao professor, sem garantir que o problema chegue a quem decide.')
    ],
    conceito: { titulo: 'Fair play e justiça', texto: 'Fair play é competir pelas mesmas regras. Quem percebe a infração e se cala participa dela, e dizer a quem decide, com respeito, é parte da justiça com quem competiu direito.' }
  },
  {
    id: 'patrocinador', hora: '13h30', titulo: 'O patrocinador', margem: 0.7,
    texto: 'Uma marca de bebida energética patrocina o evento e quer distribuir latinhas e panfletos aos alunos, que têm de 8 a 14 anos. A diretora aceitou: “É a única forma de pagar as medalhas.”',
    info: { rotulo: 'Ver o material', texto: 'O panfleto diz que a bebida “dá energia para vencer” e promete um brinde a quem postar foto com a lata.' },
    opcoes: [
      op('Dizer à diretora que a bebida e a publicidade não são adequadas para crianças e propor aceitar o apoio só para as medalhas, sem distribuir produto.',
        'A diretora hesita, mas negocia com a marca: o apoio fica só nas medalhas.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'proteger as crianças da publicidade, sem romper com quem ajuda a escola.'),
      op('Distribuir como a diretora combinou.',
        'Os alunos recebem as latas e os panfletos. Vários postam fotos com o produto.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'aceitar o apoio da marca, deixando as crianças expostas à publicidade.'),
      op('Distribuir só aos maiores de 12 anos e reter as latas dos menores.',
        'Os maiores recebem. Alguns menores reclamam e pedem aos maiores.',
        [0.3, 0.3, 0.4], -0.1, {},
        'limitar o dano, sem questionar a decisão de distribuir.')
    ],
    conceito: { titulo: 'Conflito de interesse e proteção de quem é criança', texto: 'Aceitar apoio de quem tem interesse comercial pode comprometer o cuidado com quem a escola protege. Crianças são mais vulneráveis à publicidade, e custear o evento não justifica expô-las a ela.' }
  },
  {
    id: 'joelho', hora: '14h20', titulo: 'O joelho', margem: 0.8,
    texto: 'Uma aluna cai na corrida e diz que o joelho dói muito e que não consegue dobrá-lo. O professor que coordena a prova diz: “É manha, levanta e volta pro jogo.” Ele tem muita experiência.',
    info: { rotulo: 'Olhar o joelho', texto: 'O joelho está inchando, e ela chora baixinho e pede para ligar para a mãe.' },
    opcoes: [
      op('Dar a ela um analgésico da bolsa de primeiros socorros para ela aguentar o resto do evento.',
        'A dor diminui por um tempo. Ninguém sabe o que ela tem, e ela volta a pisar.',
        [0.4, 0.3, 0.3], -0.5, {},
        'medicar e esconder a dor, passando por cima do que o corpo dizia.'),
      op('Manter a aluna parada, avisar o professor com respeito de que ela precisa de avaliação, chamar a enfermagem e ligar para a família.',
        'O professor se irrita, mas a enfermagem a atende. A mãe chega e leva a aluna ao hospital.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'dever de cuidado: parar, chamar quem pode avaliar e avisar a família.'),
      op('Dizer à aluna que o professor sabe o que diz e ajudá-la a levantar.',
        'Ela tenta andar e cai de novo. Duas horas depois, a família a leva ao pronto-socorro.',
        [0.3, 0.3, 0.4], -0.6, {},
        'confiar na experiência do colega, deixando a queixa da aluna de lado.')
    ],
    conceito: { titulo: 'Limites de competência e dever de cuidado', texto: 'Quem atende uma criança machucada deve evitar mais dano e chamar quem pode avaliar. Medicar ou minimizar a queixa não cabe ao estagiário, e a experiência de um colega não substitui a avaliação de quem sabe.' }
  },
  {
    id: 'placar', hora: '15h30', titulo: 'O placar', margem: 0.7,
    texto: 'Ao somar os pontos, você percebe um erro: duas provas foram somadas para a equipe errada. Com a soma correta, a equipe que recebeu o troféu ficaria em segundo lugar. A diretora já anunciou o resultado e diz: “Deixa assim, não vamos estragar a festa.”',
    info: { rotulo: 'Refazer a soma', texto: 'A diferença é de quatro pontos, e a equipe que perderia o troféu é a da turma que mais treinou durante o ano.' },
    opcoes: [
      op('Corrigir a planilha em silêncio e entregar a versão certa à secretaria, sem avisar ninguém.',
        'A secretaria registra o resultado certo. Os alunos e a diretora continuam com a versão errada.',
        [0.3, 0.3, 0.4], 0.1, { I: 1 },
        'acertar o registro, sem dizer a quem decidiu nem a quem merecia.'),
      op('Deixar assim: o erro é pequeno, e a festa já aconteceu.',
        'O troféu fica com a equipe errada. A turma que ganhou de verdade nunca fica sabendo.',
        [0.4, 0.3, 0.3], -0.7, { U: 1 },
        'preservar o clima da festa, deixando de lado quem merecia o resultado.'),
      op('Mostrar a soma à diretora, defender que o resultado seja corrigido e propor explicar o erro aos alunos como parte do aprendizado.',
        'A diretora fica contrariada, mas corrige. Os alunos aplaudem as duas equipes.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade e justiça: corrigir o erro, de forma aberta.')
    ],
    conceito: { titulo: 'Veracidade e justiça', texto: 'Corrigir um erro que se descobre é parte da honestidade, mesmo quando isso incomoda. Esconder ou corrigir em silêncio deixa quem perdeu sem o que merecia e quem decidiu sem a informação.' }
  },
  {
    id: 'tio', hora: '16h20', titulo: 'O tio', margem: 0.8,
    texto: 'Um menino de nove anos chora e quer ir para casa. A mãe não atende o telefone. Um homem se aproxima e diz que é tio dele e que veio buscá-lo. O menino diz que o conhece, mas não parece à vontade. O nome do tio não consta na lista de pessoas autorizadas.',
    info: { rotulo: 'Perguntar ao menino', texto: 'Ele baixa a voz e pergunta se pode ficar com você.' },
    opcoes: [
      op('Manter o menino com você, avisar a coordenação, tentar os outros contatos da ficha e liberar só a pessoa que a família confirmar.',
        'O homem reclama, mas aceita esperar. A mãe retorna a ligação e confirma quem pode buscar.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'dever de proteção: seguir o procedimento e ouvir o sinal que a criança deu.'),
      op('Entregar o menino ao homem: ele diz ser tio, e o menino quer ir para casa.',
        'O homem sai com o menino. Mais tarde, a mãe liga assustada, sem saber onde ele está.',
        [0.4, 0.3, 0.3], -0.8, {},
        'confiar em quem se apresentou, deixando de lado o procedimento e o sinal da criança.'),
      op('Pedir ao homem um documento e liberar o menino se o sobrenome for igual ao da família.',
        'O documento mostra o sobrenome. Ninguém liga para a família, e o menino sai.',
        [0.3, 0.3, 0.4], -0.3, {},
        'conferir um detalhe, sem confirmar com quem responde pela criança.')
    ],
    conceito: { titulo: 'Dever de proteção da criança', texto: 'A escola responde pela criança até a entrega a quem a família autorizou. Proteger quem não pode se defender exige seguir o procedimento, mesmo diante de quem parece conhecido, e ouvir o sinal que a criança dá.' }
  },
  {
    id: 'relatorio', hora: '17h30', titulo: 'O relatório do evento', margem: 0.7,
    texto: 'No fim do dia, a diretoria pede que você e o professor responsável preencham o relatório para a secretaria de educação com a frase “evento sem intercorrências”. Houve o calor, a queda da aluna e a criança que quase saiu com quem não estava autorizado.',
    info: { rotulo: 'Reler o formulário', texto: 'O formulário tem um campo para descrever intercorrências e outro para sugestões de melhoria, e a secretaria usa o relatório para liberar a verba do próximo evento.' },
    opcoes: [
      op('Descrever só a queda da aluna, que foi a mais grave.',
        'O relatório registra a queda. O calor e a situação do menino não aparecem.',
        [0.3, 0.3, 0.4], -0.1, {},
        'registrar uma parte, deixando o resto sem registro.'),
      op('Descrever o que ocorreu, o que foi feito e o que precisa mudar no próximo evento, e entregar à diretora antes de enviar.',
        'A diretora reclama que “complica”, mas o relatório sai completo, com sugestões.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade e responsabilidade institucional: registrar tudo, inclusive o que precisa mudar.'),
      op('Preencher “sem intercorrências”, como pedido.',
        'O relatório é enviado. Nada fica registrado sobre o que aconteceu.',
        [0.4, 0.3, 0.3], -0.7, { U: 1 },
        'cumprir o pedido da direção, apagando o que podia proteger as próximas turmas.')
    ],
    conceito: { titulo: 'Veracidade e responsabilidade institucional', texto: 'Registrar o que aconteceu, inclusive o que deu errado, é o que permite corrigir e proteger as próximas turmas. Documento oficial que omite fatos engana quem decide e deixa os riscos como estavam.' }
  }
];

export const CONTEXTOS = {
  autorizacao: {
    baixo: 'A diretora falou com tranquilidade, e o ônibus só sai em uma hora.',
    medio: 'O ônibus já está no portão, e as outras turmas estão embarcando.',
    alto: 'É a terceira vez neste ano que saem crianças sem autorização completa, e hoje o ônibus já está atrasado.'
  },
  onibus: {
    baixo: 'O ônibus chegou cedo, e a saída só é daqui a uma hora.',
    medio: 'O ônibus chegou atrasado, e a diretora já pediu pressa.',
    alto: 'É a terceira vez neste ano que o transporte do passeio não é como o combinado, e as famílias já estão no portão.'
  },
  calor: {
    baixo: 'O dia está ameno, e só uma criança pediu água.',
    medio: 'O sol está forte, e a fila da água já é grande.',
    alto: 'É o terceiro evento seguido em que a gincana acontece ao meio-dia, e hoje alguns alunos já estão tontos.'
  },
  times: {
    baixo: 'Os capitães são amigos dos dois e escolhem rindo.',
    medio: 'Os capitães escolhem rápido, e a turma começa a comentar.',
    alto: 'É a terceira vez neste ano que os dois são os últimos, e hoje a turma toda assiste.'
  },
  serie: {
    baixo: 'O resultado só será oficial amanhã, e o coordenador está por perto.',
    medio: 'A cerimônia de entrega começa em dez minutos.',
    alto: 'É a terceira edição em que uma equipe usa aluno de outra série, e hoje a diretora já anunciou a vencedora no microfone.'
  },
  patrocinador: {
    baixo: 'A marca só quer colocar uma faixa no campo.',
    medio: 'A marca já entregou as caixas e quer ver a distribuição.',
    alto: 'É a terceira vez neste ano que a escola aceita apoio de uma marca com publicidade para as crianças, e os representantes estão no pátio, de câmera.'
  },
  joelho: {
    baixo: 'A aluna ri um pouco e diz que está só assustada.',
    medio: 'A aluna chora, e as colegas ao redor pedem ajuda.',
    alto: 'É a terceira queda do dia no mesmo trecho da pista, e a aluna não consegue apoiar a perna.'
  },
  placar: {
    baixo: 'A diretora está de bom humor, e a planilha ainda pode ser conferida com calma.',
    medio: 'A diretora anunciou o resultado no microfone.',
    alto: 'É a terceira vez neste ano que a soma dos pontos precisa de correção, e o troféu já foi entregue diante de todos.'
  },
  tio: {
    baixo: 'O homem é educado, e a ficha tem três contatos para tentar.',
    medio: 'O homem diz que tem pressa e que outros estão esperando.',
    alto: 'É a terceira vez neste ano que alguém fora da lista aparece para buscar um aluno, e o homem agora fala mais alto.'
  },
  relatorio: {
    baixo: 'A diretora pediu a frase com leveza e disse que podem acrescentar o que quiserem.',
    medio: 'A secretaria cobra o relatório até hoje à noite.',
    alto: 'É a terceira vez neste ano que o relatório do evento é entregue “sem intercorrências”, e a secretaria vai analisá-lo para liberar a verba.'
  }
};

export const VALORES = {
  autorizacao: [{ p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: ['meta'] }, { p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional', 'confianca'] }, { p: ['meta'], s: ['vulneraveis', 'verdade'] }],
  onibus: [{ p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao'] }, { p: ['vulneraveis'], s: ['confianca', 'verdade'] }],
  calor: [{ p: ['vulneraveis'], s: ['profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao'] }, { p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional'] }],
  times: [{ p: ['colegas'], s: ['vulneraveis', 'justica'] }, { p: ['vulneraveis'], s: ['justica'] }, { p: ['justica', 'vulneraveis', 'profissional', 'verdade'], s: [] }],
  serie: [{ p: ['colegas', 'instituicao'], s: ['justica', 'verdade'] }, { p: ['justica', 'verdade', 'profissional', 'instituicao'], s: ['colegas'] }, { p: ['colegas'], s: ['justica'] }],
  patrocinador: [{ p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao', 'meta'] }, { p: ['instituicao', 'meta'], s: ['vulneraveis', 'profissional'] }, { p: ['meta'], s: ['vulneraveis', 'justica'] }],
  joelho: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: ['colegas'] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }],
  placar: [{ p: ['verdade'], s: ['justica', 'confianca'] }, { p: ['instituicao'], s: ['justica', 'verdade'] }, { p: ['justica', 'verdade', 'profissional', 'instituicao'], s: [] }],
  tio: [{ p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: [] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }],
  relatorio: [{ p: ['verdade', 'instituicao'], s: ['vulneraveis', 'justica'] }, { p: ['verdade', 'profissional', 'vulneraveis', 'instituicao'], s: [] }, { p: ['instituicao'], s: ['verdade', 'vulneraveis', 'profissional'] }]
};

export const APLICACAO = {
  titulo: 'Uma foto do pódio',
  situacao: 'Uma professora fotografa o pódio da gincana e envia a foto ao grupo das famílias, com a autorização das famílias das crianças que aparecem. Depois, a diretoria sugere postar a foto no perfil público da escola e entregá-la à marca patrocinadora para divulgação.',
  pergunta: 'O que você faria? Explique o que muda entre os usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de valorizar os alunos pode ser legítima. O perfil público e a entrega à marca são outro meio: mudam o público, o alcance e o uso da imagem de crianças. A autorização para um uso não vale para outro, e o uso comercial pede ainda mais cuidado. Que efeito cada alternativa teria para as crianças, para as famílias e para a escola?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em alunos, colegas e na escola, e eles aparecem ao longo da revelação.';
