// Limiar Ético · Um dia na reabilitação cardiovascular.
// Situações do estágio em um programa de reabilitação cardiovascular de um hospital-escola (segurança do exercício,
// sintomas durante o esforço, medicação, informação ao paciente e à família, prontuário, vagas, respeito, supervisão e
// equipamento de emergência), com nomes e detalhes inventados e sem valores clínicos. A pessoa jogadora é estagiária ou estagiário
// e acompanha a equipe: fisioterapeuta, professor de Educação Física e médico.
// Formato igual ao dos outros dias: w = { i, e, r } (somam 1); cd de -1 (desfecho) a +1 (certo);
// cor = U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.

const op = (t, d, w, cd, cor, car) => ({ t, d, w: { i: w[0], e: w[1], r: w[2] }, cd, cor, ef: {}, car });

export const ABERTURA = {
  titulo: 'Um dia na reabilitação cardiovascular',
  texto: [
    'Você faz estágio em um programa de reabilitação cardiovascular de um hospital-escola e acompanha a equipe: fisioterapeuta, professor de Educação Física e médico. Os pacientes estão em recuperação de infarto, de cirurgia no coração e de insuficiência cardíaca. Hoje é dia de sessões de exercício supervisionado, de reunião da equipe e de pacientes novos.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'afericao', hora: '07h30', titulo: 'Antes da sessão', margem: 0.6,
    texto: 'Antes do exercício, você confere os sinais de repouso (os valores do aparelho e a frequência cardíaca) de um paciente que está há seis semanas no programa. Os valores estão acima do limite que o protocolo da equipe define para começar a sessão. Ele diz: “Vim de longe, hoje eu treino de qualquer jeito.”',
    info: { rotulo: 'Medir de novo', texto: 'Depois de cinco minutos sentado, os valores continuam acima do limite, e ele diz que esqueceu de tomar um remédio pela manhã.' },
    opcoes: [
      op('Liberar um treino bem leve: ele já está aqui e a equipe cuida.',
        'Ele treina leve, mas sai pálido e cansado. Ninguém avisa o médico.',
        [0.3, 0.3, 0.4], -0.6, {},
        'ceder à insistência do paciente, deixando o limite do protocolo de lado.'),
      op('Não começar a sessão, avisar o médico e a fisioterapeuta, registrar os valores e combinar com ele o que fazer hoje.',
        'Ele reclama da viagem perdida, mas o médico o examina e ajusta o plano.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'colocar o limite de segurança antes da insistência, com um caminho para o paciente.'),
      op('Mandar o paciente embora e pedir que volte quando estiver melhor.',
        'Ele sai bravo. Ninguém acompanha como ele está até a próxima sessão.',
        [0.3, 0.3, 0.4], 0.0, { I: 1 },
        'cumprir o limite do protocolo, sem avisar a equipe nem cuidar do paciente.')
    ],
    conceito: { titulo: 'Não maleficência e protocolo', texto: 'O protocolo existe para proteger quem está em recuperação. Respeitar o limite de segurança e avisar quem pode avaliar é evitar um dano previsível, e isso vale mesmo quando a pessoa insiste em treinar.' }
  },
  {
    id: 'desconforto', hora: '09h00', titulo: 'O desconforto', margem: 0.8,
    texto: 'Durante a esteira, uma paciente de 68 anos, operada do coração há dois meses, diz que sente um “aperto leve” no peito e fica mais pálida. Ela sorri e diz: “Deve ser o café.” A fisioterapeuta está do outro lado da sala.',
    info: { rotulo: 'Observar o rosto', texto: 'Ela suou frio e passou a respirar mais rápido, mas diz que não quer atrapalhar a sessão.' },
    opcoes: [
      op('Parar a esteira, sentar a paciente, chamar a fisioterapeuta e o médico na hora e ficar com a paciente até a avaliação.',
        'A sala para por alguns minutos. A equipe avalia e decide o encaminhamento.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'agir na hora: interromper, chamar quem pode avaliar e acompanhar.'),
      op('Pedir que ela reduza a velocidade e continue, e avisar a fisioterapeuta no fim da sessão.',
        'Ela termina a sessão mais cansada. Quando a fisioterapeuta é avisada, já passou meia hora.',
        [0.3, 0.3, 0.4], -0.6, {},
        'adiar o aviso, tratando como pequeno um sinal que não cabia a você avaliar.'),
      op('Perguntar de novo se ela quer parar, deixando que ela decida.',
        'Ela diz que está bem e continua por mais três minutos. Você segue ao lado, sem avisar ninguém.',
        [0.3, 0.3, 0.4], -0.4, {},
        'transferir a decisão a quem pode estar minimizando o que sente.')
    ],
    conceito: { titulo: 'Responsabilidade e dever de agir', texto: 'Diante de um sintoma durante o esforço, esperar também é uma decisão. O dever é interromper, chamar quem pode avaliar e acompanhar, sem transferir a decisão a quem pode estar minimizando o que sente.' }
  },
  {
    id: 'remedio', hora: '10h20', titulo: 'Os comprimidos', margem: 0.7,
    texto: 'Um paciente conta que parou o remédio para o coração por conta própria porque “tira a energia” e “o exercício já resolve”. Pede que você não conte ao médico, que “ia brigar”.',
    info: { rotulo: 'Perguntar há quanto tempo', texto: 'Ele parou há duas semanas e diz que se sente melhor no treino, mas você notou que ele fica tonto ao levantar.' },
    opcoes: [
      op('Prometer silêncio e dizer que ele sabe o que é melhor para o corpo.',
        'Ele agradece. Na semana seguinte, passa mal no treino, e só você sabia.',
        [0.3, 0.4, 0.3], -0.6, {},
        'proteger a confiança do paciente, deixando de lado a segurança dele e o seu papel.'),
      op('Contar ao médico sem avisar o paciente, para ele não ficar sabendo.',
        'O médico chama o paciente, que descobre quem contou e deixa de falar com você.',
        [0.3, 0.3, 0.4], 0.2, { I: 1 },
        'levar a informação à equipe, mas escondendo isso de quem confiou em você.'),
      op('Dizer a ele que o remédio é decisão do médico, explicar que isso precisa chegar à equipe e oferecer-se para acompanhá-lo na conversa.',
        'Ele reluta, mas aceita. O médico escuta e ajusta o tratamento sem brigar.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'ser honesto sobre o limite do papel e do sigilo, e acompanhar a conversa.')
    ],
    conceito: { titulo: 'Limites de competência e veracidade', texto: 'Mexer em medicação é decisão de quem trata, e quem acompanha o exercício tem o dever de levar a informação à equipe. Dizer isso ao paciente com clareza respeita a pessoa e evita o engano do segredo.' }
  },
  {
    id: 'filho', hora: '11h40', titulo: 'O pedido do filho', margem: 0.7,
    texto: 'O filho de um paciente de 80 anos pede, na porta da sala: “Não conta ao meu pai o quanto o coração dele está fraco. Ele vai desanimar.” O pai está lúcido e pergunta a você como está indo.',
    info: { rotulo: 'Ouvir o paciente', texto: 'O paciente diz que quer saber a verdade, “para organizar a vida”, e que o filho “se preocupa demais”.' },
    opcoes: [
      op('Dizer ao filho que a informação é do paciente, dizer ao pai o que sabe dentro da sua função e combinar com o médico uma conversa com os dois.',
        'O filho fica incomodado, mas participa. A conversa acontece com o médico, com calma.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'respeitar a autonomia do paciente, dentro do papel, sem abandonar a família.'),
      op('Prometer ao filho que não vai contar nada.',
        'O paciente continua sem saber da gravidade. O filho agradece e pede o mesmo na próxima sessão.',
        [0.3, 0.4, 0.3], -0.4, {},
        'obedecer ao pedido da família, tirando do paciente o que era dele.'),
      op('Responder ao paciente tudo o que ele pergunta, inclusive o que cabe ao médico explicar.',
        'Ele recebe a informação de forma desencontrada, e a equipe precisa corrigir os detalhes.',
        [0.4, 0.3, 0.3], -0.1, {},
        'dizer a verdade, indo além do papel e sem apoio de quem deveria explicar.')
    ],
    conceito: { titulo: 'Autonomia, veracidade e papel', texto: 'A informação sobre a saúde pertence à pessoa, que tem o direito de saber o que quiser saber. Dizer a verdade com cuidado, dentro do papel e com apoio de quem deve explicar, respeita a autonomia sem abandonar a família.' }
  },
  {
    id: 'prontuario', hora: '13h10', titulo: 'O prontuário', margem: 0.7,
    texto: 'Na sessão da manhã, um colega da equipe viu um paciente ficar tonto e pálido e o deitou na maca por alguns minutos. Ele pede a você: “Não anota no prontuário, o paciente já está bem e vai dar trabalho explicar.”',
    info: { rotulo: 'Reler o protocolo', texto: 'O protocolo manda registrar qualquer intercorrência na sessão, com a conduta tomada.' },
    opcoes: [
      op('Anotar só que o paciente “descansou um pouco”, sem detalhar.',
        'O registro existe, mas não mostra o que aconteceu. O médico não sabe da intercorrência.',
        [0.3, 0.3, 0.4], -0.2, {},
        'registrar pela metade, protegendo o colega e a si mesmo.'),
      op('Anotar o que você viu, conversar com o colega sobre o motivo e propor explicar a ele como registrar.',
        'O colega se irrita, mas aceita. O registro entra no prontuário com a conduta.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, C: 1 },
        'veracidade com coleguismo: registrar o que houve e ajudar o colega a fazer o mesmo.'),
      op('Não anotar, como ele pediu.',
        'O prontuário fica sem o episódio. Na sessão seguinte, quem ajusta o exercício não sabe do que houve.',
        [0.4, 0.3, 0.3], -0.7, {},
        'acobertar o colega, deixando o paciente sem o registro de que precisava.')
    ],
    conceito: { titulo: 'Veracidade e coleguismo', texto: 'O prontuário é o que permite a continuidade do cuidado, e o registro fiel protege o paciente e a equipe. Coleguismo é apoiar o colega sem acobertar o que pode causar dano.' }
  },
  {
    id: 'alta', hora: '14h40', titulo: 'A alta antecipada', margem: 0.7,
    texto: 'A coordenação do hospital quer liberar vagas e pede à equipe que dê alta a seis pacientes antes das 36 sessões previstas, “os mais estáveis”. A lista inclui um paciente que tem medo de treinar sozinho e mora longe de qualquer academia.',
    info: { rotulo: 'Ver o prontuário', texto: 'Ele concluiu vinte e quatro sessões e melhorou bem, mas diz que só se sente seguro com a supervisão da equipe.' },
    opcoes: [
      op('Concordar com a lista: a vaga vai ajudar quem está na fila de espera.',
        'Ele recebe a alta e para de ir. Um mês depois, deixa de se exercitar.',
        [0.3, 0.3, 0.4], -0.3, { U: 1 },
        'beneficiar quem espera, sem olhar para quem sai e para o que acontece com ele depois.'),
      op('Propor que a decisão siga critério clínico de cada caso, com o médico, e que cada paciente tenha um plano de continuidade perto de casa antes da alta.',
        'A coordenação hesita, mas aceita revisar a lista. Dois pacientes são liberados com plano, e os outros ficam.',
        [0.1, 0.2, 0.7], 0.6, { V: 2, U: 1 },
        'equidade: olhar para cada caso e garantir continuidade do cuidado.'),
      op('Não opinar: a decisão é da coordenação.',
        'A lista é aprovada como veio. Você passa o dia pensando no paciente.',
        [0.3, 0.4, 0.3], -0.4, {},
        'deixar a decisão a quem manda, sem dizer o que viu.')
    ],
    conceito: { titulo: 'Justiça, utilitarismo e cuidado', texto: 'Liberar uma vaga pode beneficiar quem espera, e isso conta. Mas a decisão precisa olhar para o caso de cada pessoa, e quem sai também merece continuidade do cuidado. Equidade é considerar necessidades diferentes.' }
  },
  {
    id: 'vaga', hora: '15h30', titulo: 'A vaga no programa', margem: 0.8,
    texto: 'Abriu uma vaga no programa. Na lista de espera estão uma mulher de 55 anos, que teve infarto há duas semanas, e um homem de 62, recomendado por um vereador conhecido da diretoria, com problema cardíaco estável.',
    info: { rotulo: 'Ver os encaminhamentos', texto: 'A mulher tem encaminhamento do cardiologista, com indicação de início nas próximas semanas. O homem ainda está em avaliação do risco.' },
    opcoes: [
      op('Sortear entre os dois, para ficar “justo”.',
        'O sorteio dá a vaga ao homem, e a mulher segue esperando sem que ninguém avalie o risco dela.',
        [0.3, 0.3, 0.4], -0.1, {},
        'tratar casos diferentes como iguais, sem olhar para a necessidade.'),
      op('Indicar a mulher por critério clínico, explicar o critério à diretoria e combinar uma data para o homem.',
        'A diretoria reclama. O critério é registrado, e o homem entra na próxima vaga.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'justiça com critério clínico explicado, resistindo à recomendação de alguém influente.'),
      op('Indicar o homem: o apoio da diretoria ajuda o programa a ganhar mais vagas.',
        'O homem entra. A mulher segue esperando, com o risco da fase inicial sem supervisão.',
        [0.3, 0.3, 0.4], -0.7, { U: 1 },
        'trocar o critério pelo apoio de quem tem influência.')
    ],
    conceito: { titulo: 'Justiça e conflito de interesse', texto: 'Vagas escassas pedem critério clínico que se possa explicar a todos. A recomendação de alguém influente não é critério, e tratar casos diferentes como iguais, como no sorteio, também pode ser injusto.' }
  },
  {
    id: 'ritmo', hora: '16h20', titulo: 'O ritmo', margem: 0.7,
    texto: 'Um paciente de 74 anos, de passo lento, é o último da fila. Um colega da equipe diz em voz alta: “Anda logo, vovô, a gente tem horário”, e outros riem. O paciente fica calado e acelera o passo, com ar de cansado.',
    info: { rotulo: 'Observar o paciente', texto: 'Ele respira mais rápido e olha para o chão, e já pediu desculpas duas vezes.' },
    opcoes: [
      op('Pedir calmamente ao colega que pare, ajustar o ritmo ao paciente e conversar com a equipe depois sobre a forma de falar com os pacientes.',
        'O colega fica sem graça. O paciente agradece baixinho.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'defender a dignidade do paciente na hora e levar a conversa à equipe.'),
      op('Rir junto: é só brincadeira.',
        'O paciente força o passo e termina a sessão sem falar com ninguém.',
        [0.4, 0.4, 0.2], -0.6, {},
        'seguir o grupo, deixando o respeito ao paciente de lado.'),
      op('Falar com o paciente depois, dizendo que o colega não quis ofender.',
        'Ele sorri sem jeito. A fala do colega não é corrigida.',
        [0.3, 0.4, 0.3], -0.2, {},
        'consolar o paciente, sem enfrentar o que o feriu.')
    ],
    conceito: { titulo: 'Respeito pela pessoa e dignidade', texto: 'Quem está em recuperação tem o direito de ser tratado com respeito e de treinar no seu ritmo. A pressa do serviço não justifica humilhar, e a equipe forma o clima de segurança em que o paciente se exercita.' }
  },
  {
    id: 'medico', hora: '18h00', titulo: 'O médico atrasou', margem: 0.8,
    texto: 'A sessão das 18h vai começar, e o médico responsável, que deve estar disponível no serviço durante o exercício, está preso em uma emergência no outro prédio. A coordenadora diz: “Começa sem ele, é só uma sessão de manutenção. Você acompanha.”',
    info: { rotulo: 'Ver os pacientes', texto: 'Entre os doze pacientes, dois foram internados por piora do coração no último mês.' },
    opcoes: [
      op('Começar a sessão como a coordenadora mandou.',
        'A sessão corre. Um dos pacientes passa mal no meio, e você chama socorro sem ninguém por perto que saiba conduzir o caso.',
        [0.3, 0.3, 0.4], -0.7, {},
        'assumir sozinho uma supervisão que o protocolo não previa.'),
      op('Dizer à coordenadora que não vai começar sem o médico ou outro responsável habilitado e propor atrasar a sessão até que um chegue.',
        'A coordenadora reclama do atraso. A fisioterapeuta de plantão assume a supervisão, e a sessão começa vinte minutos depois.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'reconhecer o limite do que se pode fazer sozinho, aceitando o custo para o serviço.'),
      op('Começar com um aquecimento bem leve e esperar o médico, com os dois pacientes que foram internados sentados em observação.',
        'A sessão corre sem sustos. O médico chega depois de quarenta minutos e examina os dois.',
        [0.3, 0.3, 0.4], 0.1, { I: 1 },
        'reduzir o risco, mas começando sem a supervisão que o protocolo pedia.')
    ],
    conceito: { titulo: 'Limites de competência e não maleficência', texto: 'Quem acompanha o exercício de pacientes de risco só deve fazê-lo com a supervisão prevista no protocolo. Reconhecer o limite do que se pode fazer sozinho, mesmo contra a pressa do serviço, evita danos previsíveis.' }
  },
  {
    id: 'emergencia', hora: '19h20', titulo: 'O equipamento de emergência', margem: 0.7,
    texto: 'Ao arrumar a sala, você vê que o desfibrilador portátil está com o aviso de bateria baixa e que o carrinho de emergência tem a etiqueta de verificação vencida há duas semanas. Ninguém comentou.',
    info: { rotulo: 'Ver o registro', texto: 'A planilha de verificação do carrinho está há três semanas sem assinatura, e o responsável é um colega que está de licença.' },
    opcoes: [
      op('Avisar a coordenação por escrito, pedir a troca da bateria e a conferência do carrinho e conversar com a equipe sobre quem assume a verificação.',
        'A coordenação providencia a bateria no dia seguinte. A planilha ganha um novo responsável.',
        [0.1, 0.2, 0.7], 0.7, { V: 2, C: 1 },
        'responsabilidade pelo cuidado: avisar por escrito, cobrar e propor responsável.'),
      op('Contar a um colega e deixar que ele resolva.',
        'O colega diz que vai ver. Dois dias depois, o aviso continua.',
        [0.3, 0.3, 0.4], -0.2, {},
        'transferir a responsabilidade sem acompanhar o que aconteceu.'),
      op('Não mexer: o equipamento é de outro setor e ninguém reclamou.',
        'A sessão da manhã segue como de costume. Ninguém se lembra do aviso.',
        [0.4, 0.3, 0.3], -0.6, {},
        'omitir-se diante de um risco conhecido.')
    ],
    conceito: { titulo: 'Responsabilidade e dever de vigilância', texto: 'Cuidar inclui manter as condições de segurança. Ver um risco e deixar para outro é transferir responsabilidade sem acompanhar, e registrar e cobrar por escrito é a forma de garantir que a informação chegue a quem decide.' }
  }
];

export const CONTEXTOS = {
  'afericao': {
    baixo: 'O paciente está calmo, e a sessão do dia tem poucas pessoas.',
    medio: 'A sala está cheia, e o paciente já foi atendido de forma parecida.',
    alto: 'É a terceira vez neste mês que ele chega com os valores acima do limite, a sala está cheia e o médico está em outra enfermaria.'
  },
  desconforto: {
    baixo: 'A paciente sorri e diz que já sentiu algo parecido uma vez, sem importância.',
    medio: 'A sala está cheia, e a paciente diz que não quer atrapalhar os outros.',
    alto: 'É a terceira vez nesta semana que ela fala em “apertos leves”, a sala está cheia e a equipe está dividida entre duas enfermarias.'
  },
  remedio: {
    baixo: 'O paciente fala com tranquilidade, e o médico está na sala ao lado.',
    medio: 'O paciente diz que já ouviu esse conselho de outras pessoas e não gostou.',
    alto: 'É a terceira pessoa do grupo que conta ter parado o remédio, e esse paciente diz que não volta ao médico.'
  },
  filho: {
    baixo: 'O filho fala com educação, e o paciente está tranquilo ao lado.',
    medio: 'O filho insiste, e o paciente está atento à conversa.',
    alto: 'É a terceira vez que o filho pede o mesmo, e o paciente já ouviu e ficou desconfiado.'
  },
  prontuario: {
    baixo: 'O colega pediu de passagem e disse que não via problema.',
    medio: 'O colega está apressado, e a equipe tem várias sessões seguidas.',
    alto: 'É a terceira vez neste mês que esse colega pede para deixar algo sem registro, e o paciente tem consulta com o médico amanhã.'
  },
  alta: {
    baixo: 'A coordenação pediu a lista como uma sugestão e deu duas semanas.',
    medio: 'A coordenação quer a lista até o fim da semana.',
    alto: 'É a terceira vez em seis meses que a lista é pedida com prazo curto, e dessa vez a coordenação quer a resposta hoje.'
  },
  vaga: {
    baixo: 'A diretoria só perguntou sobre a vaga, sem pedido específico.',
    medio: 'A diretoria já deixou claro que gostaria de ajudar o conhecido.',
    alto: 'É a terceira vez neste ano que a diretoria indica alguém para a vaga, e dessa vez o pedido chegou por mensagem, com data para o início.'
  },
  ritmo: {
    baixo: 'O colega falou rindo, e o paciente sorriu sem graça.',
    medio: 'O colega fez o mesmo comentário em outras sessões, e o horário está apertado.',
    alto: 'É a terceira vez nesta semana que o colega fala assim, e o paciente já pediu para não vir mais ao horário da tarde.'
  },
  medico: {
    baixo: 'O atraso é de dez minutos, e os pacientes estão tranquilos, conversando.',
    medio: 'O atraso já passa de meia hora, e os pacientes estão impacientes.',
    alto: 'É a terceira vez neste mês que a sessão da noite começa sem o médico por perto, e a fila de pacientes já está na porta.'
  },
  emergencia: {
    baixo: 'É a primeira vez que o equipamento aparece com aviso, e a coordenação costuma resolver rápido.',
    medio: 'Já é a segunda vez que a bateria fica baixa neste ano.',
    alto: 'É a terceira vez neste ano que a verificação fica sem assinatura, e a coordenação disse da última vez que “não é prioridade”.'
  }
};

export const VALORES = {
  'afericao': [{ p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: [] }, { p: ['profissional'], s: ['vulneraveis', 'confianca'] }],
  desconforto: [{ p: ['vulneraveis', 'profissional', 'verdade'], s: [] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['confianca'], s: ['vulneraveis', 'profissional'] }],
  remedio: [{ p: ['confianca'], s: ['vulneraveis', 'profissional', 'verdade'] }, { p: ['profissional'], s: ['confianca', 'verdade'] }, { p: ['profissional', 'vulneraveis', 'verdade', 'confianca'], s: [] }],
  filho: [{ p: ['verdade', 'vulneraveis', 'profissional', 'confianca'], s: [] }, { p: ['confianca'], s: ['verdade', 'vulneraveis'] }, { p: ['verdade'], s: ['profissional'] }],
  prontuario: [{ p: ['colegas'], s: ['verdade', 'vulneraveis'] }, { p: ['verdade', 'vulneraveis', 'profissional', 'colegas'], s: [] }, { p: ['colegas'], s: ['verdade', 'vulneraveis', 'profissional'] }],
  alta: [{ p: ['instituicao'], s: ['vulneraveis', 'profissional'] }, { p: ['justica', 'vulneraveis', 'profissional', 'instituicao'], s: [] }, { p: [], s: ['vulneraveis', 'profissional'] }],
  vaga: [{ p: ['justica'], s: ['vulneraveis'] }, { p: ['justica', 'vulneraveis', 'verdade', 'profissional', 'instituicao'], s: [] }, { p: ['instituicao'], s: ['justica', 'vulneraveis', 'verdade'] }],
  ritmo: [{ p: ['vulneraveis', 'profissional', 'justica', 'verdade'], s: ['colegas'] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }, { p: ['colegas', 'confianca'], s: ['vulneraveis'] }],
  medico: [{ p: ['instituicao', 'confianca'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional', 'verdade'], s: ['instituicao'] }, { p: ['vulneraveis'], s: ['profissional', 'verdade'] }],
  emergencia: [{ p: ['vulneraveis', 'profissional', 'verdade', 'instituicao'], s: [] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }, { p: ['colegas'], s: ['vulneraveis', 'profissional'] }]
};

export const APLICACAO = {
  titulo: 'Uma foto do grupo',
  situacao: 'Um paciente pede que você tire uma foto do grupo no fim da sessão, para mostrar à família. Todos sorriem, e o paciente autoriza o envio ao grupo dos familiares dele. Depois, a coordenação sugere postar a foto no perfil público do hospital para divulgar o programa.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de divulgar o programa pode ser legítima. A postagem pública é outro meio: muda o público, o alcance e a exposição de pessoas que estão em tratamento, e nem todas autorizaram. A autorização para um uso não vale automaticamente para outro, e a informação de saúde é confidencial. Que efeito cada alternativa teria para os pacientes e para o programa?'
};

export const FECHAMENTO = 'O dia terminou. Cada escolha deixou efeitos em pacientes, colegas e no programa, e eles aparecem ao longo da revelação.';
