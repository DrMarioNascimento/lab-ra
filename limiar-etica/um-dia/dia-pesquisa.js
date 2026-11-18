// Limiar Ético · Um dia no laboratório.
// Situações da iniciação científica (consentimento, integridade dos dados, autoria, privacidade, assentimento de crianças,
// eventos adversos), com nomes e detalhes inventados. A pessoa jogadora é estagiária ou estagiário de iniciação científica
// e acompanha a orientadora e uma doutoranda.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia no laboratório',
  texto: [
    'Você faz iniciação científica em um laboratório de uma universidade e acompanha a orientadora e uma doutoranda. Hoje é dia de coleta com voluntários, de análise de dados e de reunião do grupo sobre o artigo que será enviado.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'termo', hora: '08h00', titulo: 'A assinatura', margem: 0.7,
    texto: 'O primeiro voluntário do dia chega atrasado, diz que tem um compromisso em quarenta minutos e pede para “assinar o termo depois”, para começar o teste já.',
    info: { rotulo: 'Reler o protocolo', texto: 'O protocolo aprovado exige o termo assinado antes de qualquer medida, e o teste leva cerca de uma hora.' },
    opcoes: [
      op('Começar o teste e deixar o termo para o fim, para não perder o voluntário.',
        'O teste vai bem. No fim, o voluntário assina às pressas e sem ler.',
        [0.3, 0.2, 0.5], -0.6, { U: 1 },
        'cumprir a meta de coleta, deixando o consentimento para depois.'),
      op('Aplicar uma versão curta do teste, de vinte minutos, com o termo assinado na hora.',
        'O teste sai incompleto, e os dados não entram na análise principal. A orientadora precisa decidir o que fazer com eles.',
        [0.2, 0.2, 0.6], 0.1, { V: 1 },
        'respeitar o termo, mas mudando o protocolo sem autorização do comitê.'),
      op('Explicar o termo ali mesmo, tirar as dúvidas, colher a assinatura e propor remarcar o teste para outro horário.',
        'O voluntário ouve tudo e assina. O teste fica para a manhã seguinte.',
        [0.1, 0.2, 0.7], 0.7, { I: 1, V: 2 },
        'consentimento livre e esclarecido antes de qualquer procedimento, aceitando o atraso.')
    ],
    conceito: { titulo: 'Consentimento livre e esclarecido', texto: 'A pessoa precisa entender o que vai acontecer, os riscos e o direito de desistir antes de decidir participar. O termo vem antes de qualquer medida, e mudar o protocolo exige nova aprovação.' }
  },
  {
    id: 'valor', hora: '10h00', titulo: 'O valor fora da curva', margem: 0.8,
    texto: 'Ao analisar os dados, você vê um participante com valores muito diferentes dos outros, e eles deixam a diferença entre os grupos “quase significativa”. A doutoranda diz: “Tira esse aí, é erro.” Você não encontrou nenhum erro nos registros.',
    info: { rotulo: 'Reconferir o registro', texto: 'A coleta desse participante seguiu o protocolo, e não há anotação de problema no equipamento nem no dia.' },
    opcoes: [
      op('Retirar o participante e seguir com a análise.',
        'O resultado fecha como esperado. Ninguém registra que um dado foi retirado.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'ajustar o dado ao resultado, em vez de explicar o que apareceu.'),
      op('Manter todos os dados na análise principal, apresentar também uma análise sem esse participante e descrever a diferença no relatório.',
        'O resultado fica menos limpo. A doutoranda reclama, mas concorda em registrar tudo.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade: mostrar o que apareceu, inclusive o que atrapalha.'),
      op('Deixar a decisão com a doutoranda e fazer o que ela mandar, já que ela tem mais experiência.',
        'Ela retira o dado. Você registra na planilha só que foi “por orientação”.',
        [0.3, 0.3, 0.4], -0.3, {},
        'transferir a decisão a quem tem mais cargo, sem questionar o critério.')
    ],
    conceito: { titulo: 'Veracidade e integridade na pesquisa', texto: 'Retirar dados porque atrapalham o resultado é manipulação, mesmo quando parece detalhe. A integridade pede critérios definidos antes, transparência sobre o que foi excluído e respeito ao que os dados mostram.' }
  },
  {
    id: 'autoria', hora: '11h30', titulo: 'A ordem dos autores', margem: 0.8,
    texto: 'O artigo ficou pronto. Você escreveu a maior parte da revisão e fez a análise. A orientadora propõe incluir como primeiro autor o chefe do departamento, que não participou, “para ajudar na aceitação”. Você ficaria como terceiro autor.',
    info: { rotulo: 'Reler as regras da revista', texto: 'A revista pede que cada autor declare o que fez e que a autoria seja só de quem contribuiu de forma substancial.' },
    opcoes: [
      op('Pedir que a autoria siga as contribuições de cada um, citando as regras da revista, e propor agradecer ao chefe na seção de agradecimentos.',
        'A orientadora se incomoda, mas pensa no assunto. No fim, o chefe entra nos agradecimentos.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'justiça na autoria: crédito a quem fez, sem romper a relação.'),
      op('Aceitar: a orientadora conhece o meio e sabe o que é melhor.',
        'O artigo é enviado. Você fica em terceiro lugar e recebe um agradecimento.',
        [0.3, 0.3, 0.4], -0.4, { U: 1 },
        'aceitar uma autoria que não corresponde ao trabalho, por causa da hierarquia.'),
      op('Aceitar, mas contar o que aconteceu ao colega de laboratório que ajudou na revisão.',
        'O colega concorda que é injusto, mas ninguém fala com a orientadora.',
        [0.3, 0.4, 0.3], -0.1, {},
        'queixa entre colegas, sem levar o assunto a quem decide.')
    ],
    conceito: { titulo: 'Justiça e crédito', texto: 'Dar crédito a quem contribuiu é uma forma de justiça. A autoria honorária, em que alguém entra sem ter trabalhado, engana quem lê e retira o mérito de quem fez, e a hierarquia não muda isso.' }
  },
  {
    id: 'hipotese', hora: '13h30', titulo: 'O resultado que não veio', margem: 0.7,
    texto: 'A hipótese principal do projeto não se confirmou. A doutoranda sugere reescrever a introdução como se o objetivo fosse o que apareceu, “para o artigo ter história”.',
    info: { rotulo: 'Ver o plano registrado', texto: 'O projeto foi registrado em uma plataforma pública, com a hipótese e a análise descritas antes da coleta.' },
    opcoes: [
      op('Concordar: o que importa é publicar algo que as pessoas queiram ler.',
        'O texto fica mais atraente. Quem comparar com o registro vai ver que a história mudou.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'ajustar a história ao resultado, apagando o que foi planejado.'),
      op('Sugerir não escrever o artigo, já que o resultado principal não saiu.',
        'O grupo fica parado. Os dados ficam guardados, e ninguém conhece o que foi encontrado.',
        [0.3, 0.3, 0.4], 0.0, {},
        'retirar o que incomodava, mas guardando o que também podia ensinar.'),
      op('Defender que o artigo conte o que foi planejado e o que apareceu, deixando claro o que é achado exploratório.',
        'A doutoranda reclama que “ninguém publica resultado nulo”. A orientadora aceita escrever assim.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'veracidade: contar o resultado que não veio e o que veio por acaso.')
    ],
    conceito: { titulo: 'Integridade e transparência', texto: 'Dizer o que foi planejado e o que apareceu depois é parte da honestidade científica. Resultados que não confirmam a hipótese também informam, e esconder o planejamento engana quem lê.' }
  },
  {
    id: 'planilha', hora: '15h00', titulo: 'A planilha no grupo', margem: 0.7,
    texto: 'Para adiantar a análise, a doutoranda pede que você mande a planilha com os dados dos voluntários para o grupo do laboratório no celular. Ela tem nome completo, telefone e data de nascimento.',
    info: { rotulo: 'Ver a planilha', texto: 'Estão no grupo oito pessoas, incluindo duas que já saíram do projeto, e a planilha tem uma coluna com a condição de saúde de cada voluntário.' },
    opcoes: [
      op('Enviar a planilha como está: é rápido e todos são do laboratório.',
        'O arquivo circula, e um colega o salva no celular. Dias depois, ele aparece em outro grupo.',
        [0.4, 0.3, 0.3], -0.7, {},
        'priorizar a rapidez, expondo dados que identificam pessoas.'),
      op('Trocar os nomes por códigos, tirar o telefone e a data de nascimento e enviar só o que a análise precisa, por um canal do laboratório.',
        'Demora vinte minutos a mais. A doutoranda diz que é “exagero”, mas usa a planilha.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, I: 1 },
        'proteger a identidade, entregando só o necessário.'),
      op('Não enviar nada e dizer que, sem autorização do comitê, isso não pode sair do computador.',
        'A análise atrasa, e a doutoranda fica irritada. Ninguém conversa sobre uma versão segura.',
        [0.3, 0.3, 0.4], 0.2, { I: 1 },
        'proteger os dados, sem propor um caminho de trabalho.')
    ],
    conceito: { titulo: 'Privacidade e confidencialidade', texto: 'Dados que identificam voluntários só podem ser usados para o que foi autorizado e por poucas pessoas. Usar códigos, tirar o que não é necessário e guardar em local protegido são formas de cumprir a promessa feita no termo.' }
  },
  {
    id: 'saida', hora: '16h00', titulo: 'O voluntário que quer sair', margem: 0.7,
    texto: 'No meio da segunda sessão, um voluntário diz que não quer continuar. Faltam três sessões, e a orientadora, que passa pela sala, diz baixinho: “Convence ele, sem esse dado perdemos o grupo inteiro.”',
    info: { rotulo: 'Perguntar o motivo', texto: 'Ele diz que o horário está atrapalhando o trabalho e que se sente “cobrado”.' },
    opcoes: [
      op('Dizer que, se ele desistir, a pesquisa perde um dado importante, e pedir que reconsidere.',
        'Ele aceita continuar, mas sai da sessão incomodado e não volta na seguinte.',
        [0.3, 0.3, 0.4], -0.6, { U: 1 },
        'usar o peso do pedido para segurar a participação.'),
      op('Propor uma pausa de uma semana para ele pensar, sem pedir nada além disso.',
        'Ele aceita a pausa e volta ou não, conforme quiser. O dado fica em suspenso.',
        [0.2, 0.2, 0.6], 0.4, { V: 1 },
        'abrir uma alternativa sem insistir, mas sem dizer com todas as letras que desistir é um direito.'),
      op('Reafirmar que ele pode desistir sem justificar nem ter prejuízo, agradecer e conversar com a orientadora sobre o dado.',
        'Ele agradece e sai tranquilo. A orientadora fica contrariada, mas aceita.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, I: 1 },
        'respeito à autonomia: a pessoa decide, e o trabalho se ajusta.')
    ],
    conceito: { titulo: 'Autonomia e direito de desistir', texto: 'A pessoa pode retirar o consentimento a qualquer momento, sem explicar e sem prejuízo. Pressionar quem quer sair, mesmo com boa intenção, tira a liberdade que o termo prometeu.' }
  },
  {
    id: 'equipamento', hora: '17h20', titulo: 'O equipamento', margem: 0.6,
    texto: 'O laboratório tem um só analisador de gases, e quatro grupos querem usá-lo nesta semana: o seu, dois de mestrado e um de graduação. A orientadora diz que o seu grupo “tem prioridade, por causa do prazo”.',
    info: { rotulo: 'Ver a agenda', texto: 'O grupo de graduação nunca conseguiu uma vaga, e a apresentação final do trabalho deles é daqui a dez dias.' },
    opcoes: [
      op('Ficar com todos os horários da semana: o prazo é nosso, e a orientadora deixou claro.',
        'O seu grupo coleta tudo. Os outros três grupos perdem a semana.',
        [0.3, 0.3, 0.4], -0.4, { U: 1 },
        'usar a prioridade que o cargo deu, sem olhar para quem ficou sem acesso.'),
      op('Propor um revezamento por prazo e necessidade, divulgado a todos, e abrir mão de metade dos horários.',
        'Os grupos aceitam o quadro de horários. A sua coleta vai para a semana seguinte.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, U: 1 },
        'justiça distributiva: critério explicado a todos, com custo para o próprio grupo.'),
      op('Trocar horários com o grupo de mestrado em troca de ajuda na análise deles.',
        'O seu grupo ganha horários, e o grupo de graduação continua sem vaga.',
        [0.3, 0.3, 0.4], -0.1, {},
        'resolver entre os grupos mais fortes, sem incluir quem tinha menos acesso.')
    ],
    conceito: { titulo: 'Justiça distributiva', texto: 'Distribuir um recurso escasso exige critério que se possa explicar a todos. Prazo e necessidade contam, mas quem tem menos poder também precisa ser ouvido.' }
  },
  {
    id: 'texto', hora: '18h20', titulo: 'O texto pronto', margem: 0.7,
    texto: 'Para adiantar o relatório, uma colega de laboratório usou um assistente de inteligência artificial para escrever a revisão de literatura. Ela cola o texto no documento do grupo e diz: “Ninguém precisa saber, ficou ótimo.” Você percebe que algumas referências nem existem.',
    info: { rotulo: 'Conferir as referências', texto: 'Três das doze referências não aparecem em nenhuma base de dados, e alguns trechos parecem copiados de outras fontes.' },
    opcoes: [
      op('Contar à colega o que encontrou, propor refazerem as referências juntas e declarar o uso da ferramenta no relatório.',
        'Ela se incomoda, mas confere as fontes com você, e o relatório registra o uso da ferramenta.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'coleguismo com franqueza: corrigir junto, sem acobertar nem expor.'),
      op('Apagar as referências erradas e deixar o resto, sem comentar nada.',
        'O texto fica mais curto e sem erro visível. A colega nunca soube e continua usando a ferramenta do mesmo jeito.',
        [0.3, 0.3, 0.4], -0.1, {},
        'esconder o erro sem enfrentar a origem, deixando de lado a verdade e a colega.'),
      op('Ficar quieto: o texto está bom e o trabalho é dela.',
        'O texto vai para a orientadora. Meses depois, um revisor da revista pergunta pelas referências.',
        [0.3, 0.4, 0.3], -0.5, {},
        'proteger a colega, deixando de lado a veracidade do trabalho.')
    ],
    conceito: { titulo: 'Integridade e coleguismo', texto: 'Coleguismo não é acobertar. Declarar a origem do texto e das fontes é parte da honestidade acadêmica, e corrigir com a pessoa, de forma franca, protege tanto o trabalho quanto a colega.' }
  },
  {
    id: 'assentimento', hora: '19h10', titulo: 'O assentimento', margem: 0.8,
    texto: 'O projeto vai coletar medidas em crianças de uma escola. A direção autorizou e os responsáveis assinaram, mas uma menina de nove anos, na hora, diz que não quer subir na balança. Os pais estão ali e dizem: “Ela só está com vergonha, pode fazer.”',
    info: { rotulo: 'Rever o protocolo', texto: 'O protocolo exige o termo dos responsáveis e também o assentimento da criança, que pode recusar a qualquer momento.' },
    opcoes: [
      op('Respeitar a recusa, agradecer e propor que ela ajude a anotar os valores dos colegas, sem ser medida.',
        'Ela sorri e participa de outro jeito. Os pais ficam sem entender, e você explica o protocolo.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, I: 1 },
        'respeito pela criança: o “não” dela vale, mesmo com a autorização dos pais.'),
      op('Seguir com a medida: os pais autorizaram e ela vai se acostumar.',
        'A menina sobe na balança chorando. O resultado entra na planilha.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'priorizar a coleta e a autorização dos adultos, deixando de lado a recusa da criança.'),
      op('Dizer a ela que é só um instante e que, se doer, ela avisa.',
        'Ela cede, mas fica de cabeça baixa. Nenhuma recusa é registrada.',
        [0.3, 0.3, 0.4], -0.3, {},
        'convencer a criança em vez de ouvi-la.')
    ],
    conceito: { titulo: 'Respeito pela pessoa e assentimento', texto: 'Quem é criança ou adolescente tem o direito de ser ouvido e de dizer não, mesmo com a autorização dos responsáveis. O assentimento é uma forma de respeito pela pessoa e protege quem é mais vulnerável.' }
  },
  {
    id: 'malestar', hora: '20h00', titulo: 'O mal-estar', margem: 0.7,
    texto: 'No teste de esforço da tarde, um voluntário passou mal por um minuto, ficou pálido, sentou e depois disse que estava bem. Quando você conta à orientadora, ela diz: “Não registra como evento adverso, senão o comitê de ética suspende a coleta.”',
    info: { rotulo: 'Rever o protocolo', texto: 'O protocolo manda registrar qualquer mal-estar durante o teste e avisar o comitê de ética dentro de um prazo definido.' },
    opcoes: [
      op('Não registrar, como ela pediu: o voluntário está bem.',
        'A coleta continua. O voluntário volta na semana seguinte, e ninguém acompanha como ele está.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'proteger a coleta, escondendo um evento que o protocolo mandava registrar.'),
      op('Registrar o evento, acompanhar o voluntário por telefone e avisar a orientadora de que o comitê precisa ser informado.',
        'A orientadora fica muito contrariada. O comitê é avisado, a coleta é revisada por uma semana e o voluntário recebe acompanhamento.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'responsabilidade e veracidade: registrar, acompanhar e comunicar, aceitando o custo.'),
      op('Registrar só no seu caderno e deixar a decisão para a orientadora.',
        'O caderno guarda o fato, mas o comitê nunca é informado. Você passa dias pensando nisso.',
        [0.3, 0.4, 0.3], -0.2, {},
        'guardar a informação para si, deixando a decisão com quem pediu o silêncio.')
    ],
    conceito: { titulo: 'Responsabilidade e veracidade em pesquisa', texto: 'Quem coleta dados responde pela segurança de quem participa. Registrar e comunicar eventos adversos é um dever, e adiar ou esconder uma informação também é uma decisão, com consequências.' }
  }
];

export const CONTEXTOS = {
  termo: {
    baixo: 'O voluntário é tranquilo, só está com horário apertado, e a agenda do dia tem folga.',
    medio: 'A agenda do dia está cheia e há outro voluntário esperando.',
    alto: 'É a terceira vez nesta semana que um voluntário pede para assinar depois, e o prazo da coleta termina amanhã.'
  },
  valor: {
    baixo: 'A doutoranda sugeriu a retirada com leveza e disse que podem conversar sobre isso.',
    medio: 'O resumo para o congresso precisa ser enviado em dois dias.',
    alto: 'Pela terceira vez neste semestre um resultado aparece “quase significativo”, e o resumo do congresso precisa ser enviado hoje.'
  },
  autoria: {
    baixo: 'A orientadora disse que a ordem ainda pode ser conversada com calma.',
    medio: 'A orientadora quer fechar a lista de autores até amanhã.',
    alto: 'É a terceira vez em dois anos que o chefe entra como autor sem participar, e a orientadora quer fechar a lista hoje.'
  },
  hipotese: {
    baixo: 'A orientadora disse que não há pressa e que o grupo pode pensar com calma.',
    medio: 'O prazo da bolsa termina no fim do mês.',
    alto: 'É a terceira vez neste ano que o grupo adia a decisão sobre este artigo, e a renovação da bolsa depende dele hoje.'
  },
  planilha: {
    baixo: 'A doutoranda pediu com calma e disse que não tem urgência.',
    medio: 'A doutoranda quer a análise hoje para a reunião da tarde.',
    alto: 'É a terceira vez nesta semana que dados circulam pelo celular do grupo, e a reunião começa em meia hora.'
  },
  saida: {
    baixo: 'O voluntário está tranquilo e conversa com você enquanto guarda as coisas.',
    medio: 'O voluntário parece incomodado, e a orientadora está à porta, esperando.',
    alto: 'É o terceiro voluntário que quer sair neste mês, e a orientadora diz que o grupo não fecha sem ele.'
  },
  equipamento: {
    baixo: 'A agenda do equipamento ainda tem horários livres no fim da semana.',
    medio: 'A agenda está quase cheia, e os grupos já pediram os seus horários.',
    alto: 'É a terceira semana seguida em que o seu grupo fica com os melhores horários, e o grupo de graduação já reclamou duas vezes.'
  },
  texto: {
    baixo: 'A colega mostrou o texto com orgulho, e o relatório só vence no mês que vem.',
    medio: 'O relatório vence em dois dias, e a colega pediu que o grupo revise rápido.',
    alto: 'É a terceira vez nesta semana que ela cola textos prontos no documento do grupo, e o relatório vence hoje.'
  },
  assentimento: {
    baixo: 'A menina está tranquila e só fez uma careta, e a fila anda sem pressa.',
    medio: 'A fila está longa, e a professora comenta que o tempo está acabando.',
    alto: 'É a terceira criança que recusa hoje, e a diretora lembra que a escola cedeu a manhã inteira por causa do projeto.'
  },
  malestar: {
    baixo: 'O voluntário já voltou ao normal, e a orientadora fala de forma leve.',
    medio: 'A orientadora diz que o comitê costuma demorar e que a coleta pode parar.',
    alto: 'É o terceiro mal-estar neste mês, e a orientadora lembra que a renovação do projeto depende dessa coleta.'
  }
};

export const VALORES = {
  termo: [{ p: ['meta', 'instituicao'], s: ['vulneraveis', 'verdade', 'profissional'] }, { p: ['vulneraveis'], s: ['profissional', 'instituicao'] }, { p: ['profissional', 'vulneraveis', 'verdade'], s: ['meta'] }],
  valor: [{ p: ['instituicao', 'meta'], s: ['verdade', 'profissional'] }, { p: ['verdade', 'profissional'], s: ['meta'] }, { p: ['colegas'], s: ['verdade', 'profissional'] }],
  autoria: [{ p: ['justica', 'verdade', 'profissional', 'instituicao'], s: [] }, { p: ['instituicao'], s: ['justica', 'verdade'] }, { p: ['colegas'], s: ['justica'] }],
  hipotese: [{ p: ['meta', 'instituicao'], s: ['verdade', 'profissional'] }, { p: ['verdade'], s: ['profissional'] }, { p: ['verdade', 'profissional'], s: ['meta'] }],
  planilha: [{ p: ['colegas', 'instituicao'], s: ['vulneraveis', 'profissional', 'confianca'] }, { p: ['vulneraveis', 'profissional', 'confianca', 'verdade'], s: [] }, { p: ['vulneraveis', 'confianca'], s: ['colegas'] }],
  saida: [{ p: ['instituicao'], s: ['vulneraveis', 'verdade', 'confianca'] }, { p: ['vulneraveis'], s: ['verdade'] }, { p: ['vulneraveis', 'verdade', 'confianca', 'profissional'], s: ['instituicao'] }],
  equipamento: [{ p: ['meta', 'instituicao'], s: ['justica', 'vulneraveis'] }, { p: ['justica', 'vulneraveis', 'instituicao'], s: ['meta'] }, { p: ['meta', 'colegas'], s: ['justica', 'vulneraveis'] }],
  texto: [{ p: ['verdade', 'profissional', 'colegas'], s: [] }, { p: ['verdade'], s: ['colegas', 'profissional'] }, { p: ['colegas'], s: ['verdade', 'profissional'] }],
  assentimento: [{ p: ['vulneraveis', 'confianca', 'profissional', 'verdade'], s: ['meta'] }, { p: ['meta', 'instituicao'], s: ['vulneraveis', 'confianca', 'profissional'] }, { p: ['meta'], s: ['vulneraveis', 'confianca'] }],
  malestar: [{ p: ['instituicao', 'meta'], s: ['vulneraveis', 'verdade', 'profissional'] }, { p: ['vulneraveis', 'verdade', 'profissional'], s: ['instituicao'] }, { p: ['verdade'], s: ['vulneraveis', 'profissional'] }]
};

export const APLICACAO = {
  titulo: 'Um slide do congresso',
  situacao: 'Na reunião, a orientadora mostra um gráfico com os dados do grupo, e um voluntário autorizou o uso dos dados dele no artigo. Depois, alguém sugere colocar a foto dele fazendo o teste no slide do congresso e no perfil público do laboratório.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de divulgar o trabalho pode ser legítima. A foto e o perfil público são outro meio: mudam o público, o alcance e o risco de identificar o voluntário. A autorização para um uso, os dados no artigo, não vale automaticamente para o outro. Que efeito cada alternativa teria para o voluntário e para o laboratório?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em voluntários, colegas e no laboratório, e eles aparecem ao longo da revelação.';
