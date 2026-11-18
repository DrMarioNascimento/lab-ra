// Limiar Ético · Um dia no estágio.
// Situações da relação do estagiário com a escola, o professor supervisor e a faculdade (presença, tarefas fora do plano,
// relatório, família no portão, redes sociais, adaptação de prova, atestado, castigo físico, pesquisa com crianças e limites
// de contato), com nomes e detalhes inventados. A pessoa jogadora é estagiária ou estagiário de uma escola.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia no estágio',
  texto: [
    'Você faz estágio em uma escola, acompanha o professor supervisor e responde também à coordenação de estágio da sua faculdade. Hoje é dia de aulas, de relatório e de decisões pequenas que dependem só de você.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'presenca', hora: '07h30', titulo: 'A presença do colega', margem: 0.5,
    texto: 'Um colega de estágio, que está atrasado, pede por mensagem que você assine a folha de presença por ele: “O supervisor nem confere, e eu te devo uma.”',
    info: { rotulo: 'Ver a folha', texto: 'A folha vale para a nota do estágio e exige assinatura própria, com horário de chegada.' },
    opcoes: [
      op('Assinar por ele: é só uma vez, e ele já te ajudou antes.',
        'O colega agradece. Na semana seguinte, ele pede de novo.',
        [0.3, 0.4, 0.3], -0.5, {},
        'assinar por outro, em nome da amizade.'),
      op('Dizer que não assina por ele, mas oferecer ajuda para explicar o atraso ao supervisor quando ele chegar.',
        'O colega fica chateado e chega uma hora depois. O supervisor aceita a justificativa.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'coleguismo sem mentira: recusar a assinatura e ajudar de outro jeito.'),
      op('Não responder à mensagem e deixar a folha em branco no lugar dele.',
        'Ele chega e encontra a folha vazia, sem saber o que você pensa.',
        [0.3, 0.3, 0.4], 0.1, { I: 1 },
        'não mentir, mas sem dizer ao colega o que pensava.')
    ],
    conceito: { titulo: 'Veracidade e coleguismo', texto: 'Assinar por outro é atestar algo que não aconteceu. Coleguismo é ajudar sem mentir, e dizer não com respeito, oferecendo outro caminho, protege a relação e a verdade.' }
  },
  {
    id: 'favores', hora: '08h40', titulo: 'Os favores', margem: 0.7,
    texto: 'O professor supervisor pede que você corrija as provas dele e preencha o diário de classe de três turmas. Diz: “Isso conta como experiência, e a sua nota no relatório é minha.”',
    info: { rotulo: 'Ver o que é permitido', texto: 'O plano de estágio da faculdade só prevê observação, planejamento acompanhado e regência supervisionada.' },
    opcoes: [
      op('Fazer o que ele pediu, mas anotar tudo para contar à faculdade se algo der errado.',
        'Você faz tudo e guarda as anotações. Ninguém da faculdade sabe do que acontece.',
        [0.3, 0.4, 0.3], -0.2, {},
        'aceitar a tarefa por medo da nota, guardando só para si o registro.'),
      op('Fazer tudo: a nota depende dele.',
        'Você passa a manhã corrigindo e preenchendo. Não sobra tempo para as aulas que devia acompanhar.',
        [0.3, 0.4, 0.3], -0.6, { U: 1 },
        'ceder ao poder de quem dá a nota, abrindo mão do próprio plano de estágio.'),
      op('Dizer que corrige as provas como exercício, com ele conferindo, e que o diário é dele; se ele insistir, falar com a coordenação do estágio.',
        'O supervisor se irrita, mas aceita só a correção acompanhada. A conversa fica seca.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'limitar o papel ao previsto e recorrer à coordenação, sem abusar nem se submeter.')
    ],
    conceito: { titulo: 'Papel e abuso de poder', texto: 'Quem tem poder sobre a nota de outra pessoa precisa de cuidado extra para não abusar dele. O plano de estágio define o que o estagiário faz, e aceitar tarefas fora dele, por medo da nota, alimenta a dependência.' }
  },
  {
    id: 'relatorio', hora: '10h00', titulo: 'O que a escola não quer no relatório', margem: 0.7,
    texto: 'Você precisa entregar o relatório de estágio à faculdade. A direção pede que você não cite a falta de materiais e a quadra interditada: “Isso só prejudica a escola.”',
    info: { rotulo: 'Reler a orientação da faculdade', texto: 'O roteiro do relatório pede a descrição das condições de trabalho e das dificuldades observadas.' },
    opcoes: [
      op('Descrever as condições com fatos e sem acusar pessoas, dizer à direção o que vai constar e entregar a versão completa à faculdade.',
        'A direção reclama, mas aceita ler o texto. O relatório vai completo, com sugestões.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade com lealdade: dizer a verdade, com respeito e avisando a direção.'),
      op('Omitir o que a direção pediu: a escola está te acolhendo.',
        'O relatório fica bom e sem problemas. A faculdade não fica sabendo das condições.',
        [0.3, 0.4, 0.3], -0.5, {},
        'omitir fatos em nome da gratidão pela escola.'),
      op('Escrever tudo e entregar à faculdade sem avisar a direção.',
        'A faculdade recebe o relatório completo. A direção descobre depois e se sente traída.',
        [0.3, 0.3, 0.4], 0.2, { I: 1 },
        'dizer a verdade, sem dialogar com quem seria citado.')
    ],
    conceito: { titulo: 'Veracidade e lealdade', texto: 'Relatar a realidade observada é dever com quem forma e com quem virá depois. Lealdade à instituição que acolhe não exige esconder fatos, e dialogar com quem será citado é uma forma de respeito.' }
  },
  {
    id: 'mae', hora: '11h00', titulo: 'A mãe no portão', margem: 0.7,
    texto: 'Uma mãe te espera no portão e pergunta se o filho sofre agressão dos colegas. Você viu a cena na semana passada, mas a professora titular pediu que ninguém comentasse até a escola resolver.',
    info: { rotulo: 'Lembrar do que você viu', texto: 'Você viu dois colegas empurrarem o menino na fila e ele ficar sozinho, sem brincar, no recreio.' },
    opcoes: [
      op('Dizer que não sabe de nada, para não comprometer a professora.',
        'A mãe agradece e vai embora sem informação. O menino continua sozinho no recreio.',
        [0.3, 0.4, 0.3], -0.6, {},
        'mentir para evitar conflito, deixando o menino sem proteção.'),
      op('Dizer à mãe que viu algo preocupante, que a conversa deve ser com a coordenação, e levar o assunto à professora e à coordenação ainda hoje.',
        'A mãe pergunta mais, mas aceita. A coordenação a recebe no mesmo dia.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade dentro do papel: não esconder o que viu e encaminhar a quem decide.'),
      op('Contar tudo o que viu, com detalhes, e dizer que a escola está errada.',
        'A mãe fica abalada e vai à secretaria exigindo respostas. A professora titular se queixa de você.',
        [0.4, 0.4, 0.2], 0.1, { I: 1 },
        'dizer a verdade, indo além do papel e sem passar pela coordenação.')
    ],
    conceito: { titulo: 'Veracidade, papel e proteção da criança', texto: 'Dizer a verdade não exige ir além do papel. O estagiário não omite o que viu e nem decide sozinho o que contar: leva à coordenação e à família o que protege a criança, e mentir para evitar conflito tem efeitos sobre quem sofre.' }
  },
  {
    id: 'rede', hora: '12h00', titulo: 'O perfil do colega', margem: 0.7,
    texto: 'Um colega de estágio posta, no perfil dele, a foto da turma com os rostos à mostra e uma legenda irônica sobre um aluno: “esse aí não aprende nem com reza”. Vários riem e comentam.',
    info: { rotulo: 'Ver o perfil', texto: 'O perfil é aberto e tem mais de duzentos seguidores, incluindo familiares de alunos.' },
    opcoes: [
      op('Não fazer nada: o perfil é dele, e você não tem nada a ver com isso.',
        'A foto fica no ar por semanas. O aluno e a família acabam vendo.',
        [0.4, 0.3, 0.3], -0.3, {},
        'deixar passar, com o aluno exposto.'),
      op('Pedir ao colega, em particular, que apague a foto, explicar o motivo e avisar o supervisor se ele não apagar.',
        'O colega apaga e se desculpa meio sem graça. O supervisor é informado só de que houve um problema.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'proteger o aluno corrigindo o colega com respeito, sem expô-lo.'),
      op('Curtir e comentar: é brincadeira entre colegas.',
        'A postagem se espalha. Um familiar reconhece o aluno e comenta na escola.',
        [0.4, 0.4, 0.2], -0.7, {},
        'entrar na brincadeira, expondo um aluno.')
    ],
    conceito: { titulo: 'Dignidade, privacidade e responsabilidade nas redes', texto: 'Imagem de criança e comentários humilhantes não são brincadeira, mesmo em perfil pessoal. O estagiário representa a escola e a faculdade também fora delas, e corrigir um colega com respeito protege quem foi exposto.' }
  },
  {
    id: 'prova', hora: '13h30', titulo: 'A prova adaptada', margem: 0.7,
    texto: 'O professor titular pede que você corrija a prova da turma com o mesmo gabarito para todos. Um aluno tem laudo de dislexia, e a escola combinou prova adaptada e tempo extra, mas isso não foi feito.',
    info: { rotulo: 'Ver a prova dele', texto: 'O aluno deixou mais da metade em branco e escreveu na margem que “não deu tempo”.' },
    opcoes: [
      op('Corrigir como pedido: a regra vale para todos.',
        'O aluno tira nota baixa e passa a evitar as aulas.',
        [0.3, 0.3, 0.4], -0.6, {},
        'aplicar a mesma regra a todos, sem olhar para a necessidade dele.'),
      op('Dar uma nota um pouco maior ao aluno, sem avisar ninguém, para compensar.',
        'A nota sobe. A adaptação continua sem acontecer, e os colegas estranham a diferença.',
        [0.3, 0.4, 0.3], -0.2, {},
        'compensar com a nota, deixando de dizer que o combinado não foi cumprido.'),
      op('Corrigir, mas avisar o professor e a coordenação de que a adaptação combinada não aconteceu e pedir que a prova seja refeita com o apoio previsto.',
        'O professor se incomoda, mas concorda em refazer. O aluno refaz com tempo extra.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'equidade: garantir o apoio combinado, em vez de só aplicar a regra.')
    ],
    conceito: { titulo: 'Equidade e inclusão', texto: 'Igualdade é a mesma regra para todos, e equidade é garantir o apoio necessário para que todos participem de forma justa. Compensar com nota sem garantir o apoio combinado esconde o problema em vez de resolvê-lo.' }
  },
  {
    id: 'atestado', hora: '14h20', titulo: 'O atestado', margem: 0.8,
    texto: 'Uma aluna tem atestado de dispensa das aulas de Educação Física, mas você a vê jogando bola no recreio. O professor titular, ao saber, diz: “Mentirosa. Vou chamar a mãe e reprovar ela.”',
    info: { rotulo: 'Ler o atestado', texto: 'O atestado diz que ela pode participar de atividades leves, mas não de esforço intenso, e não explica o motivo.' },
    opcoes: [
      op('Dizer ao professor que o atestado permite atividade leve, propor conversar com a aluna e com a família para entender o que ela pode fazer e adaptar a aula.',
        'O professor resiste, mas conversa. A aluna participa de atividades leves, sem exposição.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'presumir boa-fé, ouvir a pessoa e adaptar, sem expor a aluna.'),
      op('Perguntar à aluna, na frente da turma, por que ela joga se tem atestado.',
        'Ela fica vermelha e diz que não é da conta de ninguém. Os colegas riem.',
        [0.4, 0.4, 0.2], -0.4, {},
        'cobrar uma explicação, expondo a aluna diante dos colegas.'),
      op('Apoiar o professor: ela mentiu e precisa ser corrigida.',
        'A mãe é chamada em tom de acusação. A aluna passa a faltar às aulas.',
        [0.3, 0.3, 0.4], -0.6, {},
        'acusar antes de entender o que o documento permitia.')
    ],
    conceito: { titulo: 'Respeito pela pessoa e presunção de boa-fé', texto: 'Antes de acusar, é preciso conhecer o que o documento permite e ouvir a pessoa, sem expô-la. Dados de saúde são sigilosos, e a escola adapta a atividade sem constranger quem tem restrição.' }
  },
  {
    id: 'castigo', hora: '15h20', titulo: 'O castigo', margem: 0.8,
    texto: 'Como castigo por conversa, o professor supervisor manda um aluno de onze anos fazer flexões “até aprender”. O aluno já está cansado e ri sem graça, e a turma observa em silêncio.',
    info: { rotulo: 'Olhar o aluno', texto: 'O menino treme os braços e olha para você, pedindo ajuda sem falar.' },
    opcoes: [
      op('Ficar em silêncio: o professor é seu supervisor, e a sua nota depende dele.',
        'O aluno termina as flexões chorando. Você sai da quadra evitando o olhar dele.',
        [0.4, 0.4, 0.2], -0.6, {},
        'omitir-se, protegendo a própria nota.'),
      op('Pedir ao professor, com respeito, um minuto fora da quadra, dizer que o aluno precisa parar e, depois, levar o assunto à coordenação do estágio e da escola.',
        'O professor reluta, mas libera o aluno. A coordenação ouve você no mesmo dia.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'proteger a criança na hora, com respeito, e levar o fato a quem pode agir.'),
      op('Interromper na hora, na frente da turma, dizendo que o professor está errado.',
        'O professor se irrita e te manda sair da quadra. O aluno é liberado, mas o clima da aula muda.',
        [0.5, 0.4, 0.1], 0.2, { I: 1 },
        'proteger o aluno de imediato, confrontando o supervisor diante da turma.')
    ],
    conceito: { titulo: 'Cuidado, omissão e abuso de autoridade', texto: 'Castigo físico em criança é violação, e quem vê e se cala porque depende do supervisor se omite. Proteger a criança na hora, com respeito, e levar o fato a quem pode agir é o dever de quem presencia.' }
  },
  {
    id: 'tcc', hora: '16h20', titulo: 'A pesquisa do TCC', margem: 0.8,
    texto: 'Você quer usar medidas e questionários dos alunos no seu trabalho de conclusão de curso. A diretora diz: “Pode usar, eu autorizo.” Os responsáveis não foram consultados, e o projeto ainda não passou pelo comitê de ética.',
    info: { rotulo: 'Ver o regulamento', texto: 'O comitê da faculdade exige a aprovação do projeto e o termo dos responsáveis antes de qualquer coleta com menores.' },
    opcoes: [
      op('Coletar só as medidas, que “não identificam ninguém”, e deixar os questionários para depois.',
        'Você coleta as medidas com os nomes anotados. O comitê pergunta por elas.',
        [0.3, 0.3, 0.4], -0.2, {},
        'reduzir a coleta, sem tratar o que faltava: aprovação e termo.'),
      op('Coletar os dados: a diretora autorizou, e é só um trabalho de faculdade.',
        'Você coleta tudo. Meses depois, a faculdade recusa o trabalho por falta de aprovação.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'usar a autorização da direção como se fosse a dos responsáveis.'),
      op('Agradecer, mas aguardar a aprovação do comitê, enviar o termo aos responsáveis e coletar só dos alunos com termo e assentimento.',
        'A coleta atrasa um mês. Parte dos responsáveis não autoriza, e a amostra fica menor.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'consentimento e etapas cumpridas, aceitando o custo para o trabalho.')
    ],
    conceito: { titulo: 'Consentimento e pesquisa com crianças', texto: 'Pesquisa com crianças exige aprovação do comitê, termo dos responsáveis e assentimento da própria criança. A autorização da direção não substitui o consentimento de quem responde pela criança, e pressa do trabalho não justifica pular etapas.' }
  },
  {
    id: 'contato', hora: '17h30', titulo: 'O contato dos alunos', margem: 0.7,
    texto: 'No último dia, os alunos de uma turma pedem o seu número pessoal e querem te adicionar nas redes: “Professor, fica com a gente!” Uma aluna de treze anos te entrega uma carta dizendo que você é a única pessoa que a ouve.',
    info: { rotulo: 'Ler a carta', texto: 'A carta fala de solidão e de brigas em casa, e termina com “não conta pra ninguém”.' },
    opcoes: [
      op('Guardar a carta em segredo e dizer à aluna que ela pode contar com você.',
        'A aluna se sente acolhida. Ninguém da escola fica sabendo do que ela vive.',
        [0.3, 0.4, 0.3], -0.3, {},
        'prometer segredo, deixando a aluna sem a rede de que precisava.'),
      op('Agradecer, não passar o contato pessoal, explicar que continua disponível pelos canais da escola e levar a carta à coordenação ou ao serviço de orientação, contando isso à aluna.',
        'A aluna fica chateada, mas ouve. A orientadora a recebe nos dias seguintes.',
        [0.1, 0.3, 0.6], 0.7, { V: 2, C: 1 },
        'acolher dentro dos limites do papel e encaminhar, sem esconder dela o que fará.'),
      op('Passar o número e aceitar as redes: é um jeito de manter o vínculo.',
        'Os alunos escrevem à noite. A aluna da carta passa a falar só com você.',
        [0.4, 0.4, 0.2], -0.5, {},
        'manter o vínculo por fora da escola, perdendo os limites do papel.')
    ],
    conceito: { titulo: 'Limites profissionais e cuidado', texto: 'A relação entre professor e aluno é assimétrica, e manter limites protege os dois. Acolher é escutar e encaminhar a quem pode ajudar, e prometer segredo sobre situações de risco deixa a criança sem a rede de que precisa.' }
  }
];

export const CONTEXTOS = {
  presenca: {
    baixo: 'O colega pediu com leveza, e o supervisor ainda nem chegou.',
    medio: 'O supervisor já comentou que vai conferir as folhas.',
    alto: 'É a terceira vez neste mês que o colega pede isso, e o supervisor disse que vai conferir hoje.'
  },
  favores: {
    baixo: 'O supervisor pediu como sugestão e disse que entende se você não puder.',
    medio: 'O supervisor falou que vai fechar as notas do estágio na próxima semana.',
    alto: 'É a terceira semana em que ele acumula tarefas suas, e hoje avisou que a nota dependeria de “quem colabora”.'
  },
  relatorio: {
    baixo: 'A direção falou de passagem, e o prazo do relatório é só no fim do semestre.',
    medio: 'A direção pediu de novo e avisou que lerá o relatório antes.',
    alto: 'É a terceira vez que a direção pede para tirar um trecho do seu texto, e o prazo da faculdade é amanhã.'
  },
  mae: {
    baixo: 'A mãe pergunta com educação, e a coordenadora está na sala ao lado.',
    medio: 'A mãe está aflita, e a professora titular está por perto.',
    alto: 'É a terceira vez que a mãe vem perguntar, e hoje a professora titular reforçou que “ninguém comenta”.'
  },
  rede: {
    baixo: 'A foto foi postada agora há pouco, e só dois colegas comentaram.',
    medio: 'A foto já tem várias curtidas e comentários.',
    alto: 'É a terceira postagem do colega com alunos neste mês, e dessa vez um familiar já curtiu.'
  },
  prova: {
    baixo: 'O professor falou com tranquilidade, e a coordenação está disponível.',
    medio: 'O professor quer as notas lançadas hoje.',
    alto: 'É a terceira avaliação em que a adaptação não acontece, e o professor avisou que as notas fecham hoje.'
  },
  atestado: {
    baixo: 'O professor comentou rindo, e a aluna não percebeu.',
    medio: 'O professor falou alto no pátio, e alguns alunos ouviram.',
    alto: 'É a terceira vez neste ano que o professor acusa alunos com atestado, e dessa vez a turma toda ouviu.'
  },
  castigo: {
    baixo: 'O professor falou em tom de brincadeira, e o aluno ainda sorri.',
    medio: 'O professor insiste, e o aluno já está cansado.',
    alto: 'É a terceira vez neste mês que o professor usa esse castigo, e hoje o aluno está quase sem forças.'
  },
  tcc: {
    baixo: 'O prazo do trabalho só termina no fim do ano, e a diretora está disponível.',
    medio: 'O prazo do trabalho termina em dois meses.',
    alto: 'É a terceira vez que você adia a coleta, e o orientador avisou que o prazo termina em duas semanas.'
  },
  contato: {
    baixo: 'Os alunos pedem com alegria, e a coordenadora está por perto.',
    medio: 'Os alunos insistem, e o horário de saída está chegando.',
    alto: 'É a terceira turma que pede seu contato hoje, e a aluna da carta espera sozinha no corredor.'
  }
};

export const VALORES = {
  presenca: [{ p: ['colegas'], s: ['verdade', 'profissional'] }, { p: ['verdade', 'profissional', 'colegas'], s: [] }, { p: ['verdade'], s: ['colegas'] }],
  favores: [{ p: ['instituicao'], s: ['profissional', 'verdade'] }, { p: ['instituicao'], s: ['profissional', 'justica'] }, { p: ['profissional', 'justica', 'verdade'], s: ['instituicao'] }],
  relatorio: [{ p: ['verdade', 'profissional', 'confianca'], s: [] }, { p: ['instituicao'], s: ['verdade', 'profissional'] }, { p: ['verdade', 'profissional'], s: ['confianca', 'instituicao'] }],
  mae: [{ p: ['colegas', 'instituicao'], s: ['verdade', 'vulneraveis', 'confianca'] }, { p: ['verdade', 'vulneraveis', 'profissional', 'confianca'], s: [] }, { p: ['verdade', 'vulneraveis'], s: ['colegas', 'profissional'] }],
  rede: [{ p: ['colegas'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional', 'confianca'] }],
  prova: [{ p: ['instituicao'], s: ['justica', 'vulneraveis'] }, { p: ['vulneraveis'], s: ['verdade', 'justica'] }, { p: ['justica', 'vulneraveis', 'profissional', 'verdade', 'instituicao'], s: [] }],
  atestado: [{ p: ['vulneraveis', 'profissional', 'verdade', 'justica'], s: ['colegas'] }, { p: [], s: ['vulneraveis', 'profissional'] }, { p: ['colegas'], s: ['vulneraveis', 'verdade', 'justica'] }],
  castigo: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional', 'justica'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'justica'], s: ['colegas'] }, { p: ['vulneraveis'], s: ['colegas', 'instituicao'] }],
  tcc: [{ p: ['meta'], s: ['vulneraveis', 'verdade'] }, { p: ['meta', 'instituicao'], s: ['vulneraveis', 'verdade', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: ['meta'] }],
  contato: [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade', 'confianca'], s: [] }, { p: ['colegas'], s: ['profissional', 'vulneraveis'] }]
};

export const APLICACAO = {
  titulo: 'Uma aula filmada',
  situacao: 'A faculdade pede que você grave um trecho da sua aula para avaliação do estágio. A escola autoriza, e as famílias assinaram o uso das imagens apenas para essa avaliação. Depois, a faculdade sugere publicar o vídeo no canal público do curso como exemplo de boa prática.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de compartilhar uma boa prática pode ser legítima. O canal público é outro meio: muda o público, o alcance e a exposição de crianças que não escolheram aparecer. A autorização para um uso não vale para outro. Que efeito cada alternativa teria para os alunos, para as famílias, para a escola e para a sua formação?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em alunos, colegas, na escola e na sua formação, e eles aparecem ao longo da revelação.';
