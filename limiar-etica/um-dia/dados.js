// Limiar Ético · Um dia — cenas, alternativas, desfechos e leituras.
// Pesos de cada alternativa: w = { i: impulso, e: emoção, r: razão } (somam 1);
// cd = de -1 (busca do desfecho) a +1 (busca do certo);
// cor = pesos nas cinco correntes: U utilitarismo, V virtudes, I intenção, X existencialismo, C complexidade.
// ef = efeitos nas variáveis do dia. margem = quanta escolha real a cena dava (0 a 1).

export const VERSAO = '1.6';

export const CORRENTES = {
  U: 'Utilitarismo',
  V: 'Virtudes',
  I: 'Intenção',
  X: 'Existencialismo',
  C: 'Complexidade'
};

export const ABERTURA = {
  titulo: 'Um dia',
  texto: [
    'Você estuda à noite e trabalha numa empresa de eventos. Entrou há três meses e precisa do emprego para pagar a faculdade.',
    'Hoje a empresa realiza um evento para um cliente, com abertura às 19h. Também hoje, até 23h59, o seu grupo da faculdade entrega um trabalho. A sua parte ainda não está pronta.',
    'Ao longo do dia, escolha com sinceridade o que você realmente faria em cada situação. Não há resposta certa, gabarito ou nota.'
  ]
};

export const CENAS = [
  {
    id: 'mensagem', hora: '06h40', titulo: 'A mensagem', margem: 0.8,
    texto: 'Às 05h52 a chefia escreveu no grupo da equipe: “Preciso do credenciamento resolvido antes das 9. Sem falta dessa vez.” Você cuidou do credenciamento ontem e saiu achando que estava pronto.',
    info: { rotulo: 'Reler a conversa de ontem', texto: 'Às 18h você avisou no grupo que faltava a lista de convidados de um patrocinador. Ninguém respondeu.' },
    opcoes: [
      { t: 'Responder na hora: “O credenciamento ficou pronto ontem. Só falta a lista do patrocinador, que avisei às 18h.”',
        d: 'A chefia responde “ok”. O fato fica registrado, e o tom entre vocês esfria.',
        w: { i: 0.4, e: 0.2, r: 0.4 }, cd: 0.5, cor: { I: 2, V: 1 }, ef: {},
        car: 'um fato usado para se defender: a resposta é correta, mas saiu no calor do tom da mensagem.' },
      { t: 'Não responder e chegar quarenta minutos mais cedo para conferir tudo pessoalmente.',
        d: 'Você encontra a pendência e resolve. A chefia ficou uma hora sem resposta.',
        w: { i: 0.2, e: 0.3, r: 0.5 }, cd: -0.4, cor: { V: 2, U: 1 }, ef: { chefia: -1, cansaco: 1 },
        car: 'impulso contido: em vez de reagir à mensagem, você foi agir sobre o problema.' },
      { t: 'Perguntar: “Bom dia. O que exatamente ficou pendente?”',
        d: 'Ela responde: “A lista do patrocinador.” Você resolve às 8h.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.3, cor: { C: 2, V: 1 }, ef: { chefia: 1 },
        car: 'separar o fato da interpretação: antes de julgar o tom, você foi buscar o que de fato faltava.' }
    ],
    conceito: { titulo: 'Juízo de fato e juízo de valor',
      texto: 'O juízo de fato descreve o que aconteceu; o juízo de valor atribui qualidade ao que aconteceu. A mensagem dizia uma coisa; o tom que você leu nela já era interpretação. A subjetividade explica de onde parte o julgamento, mas não basta para justificá-lo.' }
  },
  {
    id: 'nome', hora: '08h10', titulo: 'O nome no trabalho', margem: 0.9,
    texto: 'No ônibus, o colega do grupo manda um áudio. Não fez a parte dele. Pede que o nome continue no trabalho: “Semana que vem eu compenso.”',
    info: { rotulo: 'Perguntar o que houve', texto: 'A mãe dele ficou internada cinco dias. É a terceira entrega do semestre em que ele não participa.' },
    opcoes: [
      { t: 'Manter o nome e dividir a parte dele entre os outros.',
        d: 'O grupo aceita, reclamando. A sua carga para hoje aumenta.',
        w: { i: 0.2, e: 0.6, r: 0.2 }, cd: -0.6, cor: { I: 2, U: 1 }, ef: { grupo: -1, trabalho: -1, pend: 'nome' },
        car: 'emoção: pesou a situação dele, mais do que a regra do grupo.' },
      { t: 'Dizer que o nome fica se ele entregar a revisão final até as 22h.',
        d: 'Ele aceita. Às 22h a revisão chega, incompleta.',
        w: { i: 0.1, e: 0.3, r: 0.6 }, cd: -0.2, cor: { U: 2, C: 1 }, ef: {},
        car: 'razão voltada ao resultado: você procurou uma saída que servisse a ele e ao grupo.' },
      { t: 'Avisar que o grupo entrega sem o nome e que ele deve conversar com a professora.',
        d: 'Ele responde “beleza” e sai do grupo de mensagens.',
        w: { i: 0.1, e: 0.1, r: 0.8 }, cd: 0.9, cor: { V: 2, I: 1 }, ef: { grupo: 1 },
        car: 'dever: o nome no trabalho afirma uma participação, e você não quis afirmar o que não houve.' }
    ],
    conceito: { titulo: 'Dever, justiça e intenção',
      texto: 'Na ética do dever, importa se a ação respeita um princípio que valeria para todos, e não só o resultado. Mas a intenção de ajudar também conta. Intenção, motivo e consequência são coisas diferentes: uma boa intenção não torna correta qualquer conduta.' }
  },
  {
    id: 'numero', hora: '09h30', titulo: 'O número redondo', margem: 0.6,
    texto: 'Você monta o relatório para o cliente. Inscritos confirmados: 412. Um colega dita: “Põe cerca de 500. Aqui sempre se fez assim, o cliente gosta de número redondo.”',
    info: { rotulo: 'Abrir o contrato', texto: 'O contrato prevê um bônus para a empresa se o público passar de 450.' },
    opcoes: [
      { t: 'Escrever 412 e avisar a equipe que mudou.',
        d: 'O colega bufa. A chefia lê o relatório e não comenta.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.9, cor: { V: 2, I: 1 }, ef: { equipe: -1, chefia: 1 },
        car: 'questionar o costume: você colocou o que podia sustentar, mesmo contra o hábito da equipe.' },
      { t: 'Escrever “cerca de 500”, como a equipe sempre fez.',
        d: 'O relatório segue. Ninguém comenta.',
        w: { i: 0.6, e: 0.2, r: 0.2 }, cd: -0.7, cor: { U: 1, X: 1 }, ef: { equipe: 1, pend: 'numero' },
        car: 'seguir a moral do grupo: pesou pertencer à equipe e não criar atrito.' },
      { t: 'Escrever “412 confirmados, com expectativa de até 500 com inscrições na porta”.',
        d: 'O cliente responde com um joinha. Ninguém reclama.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.3, cor: { C: 2, U: 1 }, ef: {},
        car: 'razão que concilia: você manteve o dado verdadeiro e deu espaço à expectativa da equipe.' }
    ],
    conceito: { titulo: 'Moral e ética',
      texto: 'A moral é o conjunto de regras e costumes de um grupo; a ética é a reflexão sobre eles. “Aqui sempre se fez assim” é moral herdada. Cada pessoa é herdeira dessas normas, mas também pode avaliá-las e confrontá-las. Aceitar só porque é costume leva ao legalismo; decidir só por si leva ao individualismo.' }
  },
  {
    id: 'horario', hora: '11h00', titulo: 'Até que horas', margem: 0.3,
    texto: 'A prova de amanhã às 7h pode definir se você passa no semestre. Você reservou esta noite para estudar e ainda precisa entregar sua parte do trabalho em grupo até 23h59. Uma pessoa avisa que não vem para o turno. A chefia inclui você na escala da desmontagem, que termina por volta de 1h. Você já recebeu um aviso por faltas e, se simplesmente deixar o turno, pode receber outra advertência.',
    info: { rotulo: 'Perguntar ao colega veterano', texto: 'O colega diz que consegue cobrir a última parte da desmontagem se a chefia aprovar a troca até o fim da tarde.' },
    opcoes: [
      { t: 'Ficar até o fim e avisar o grupo da faculdade que alguém precisa fechar a sua parte.',
        d: 'A chefia agradece. O grupo assume a sua parte, contrariado. Você chega em casa depois da 1h e precisa escolher entre revisar para a prova e dormir um pouco mais.',
        w: { i: 0.2, e: 0.2, r: 0.6 }, cd: -0.5, cor: { X: 2, U: 1 }, ef: { evento: 1, grupo: -1, trabalho: -1 },
        car: 'escolha dentro do limite: você aceitou a condição do emprego e assumiu o custo às claras.' },
      { t: 'Propor à chefia ficar até as 22h e combinar quem assume o restante do turno.',
        d: 'A chefia aceita a troca de escala. Você ganha algum tempo para fechar o trabalho e revisar para a prova.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.4, cor: { X: 2, V: 1 }, ef: { chefia: -1, trabalho: 1 },
        car: 'testar a margem real: você verificou se havia mais liberdade do que parecia.' },
      { t: 'Ficar até o fim e usar os intervalos para dividir o tempo entre a entrega e a revisão para a prova.',
        d: 'Você avança na entrega entre uma tarefa e outra. A desmontagem ocupa os últimos intervalos e sobra pouco tempo para revisar.',
        w: { i: 0.6, e: 0.2, r: 0.2 }, cd: -0.6, cor: { I: 1, X: 1 }, ef: { evento: 1, cansaco: 2 },
        car: 'evitar o conflito: a vontade de não desagradar ninguém falou mais alto.' }
    ],
    conceito: { titulo: 'Liberdade situada',
      texto: 'Ninguém escolhe fora de uma situação: há regras, relações de poder, tempo, dinheiro e medo. Para Sartre, mesmo assim escolhemos; para Merleau-Ponty, somos livres graças às possibilidades que o mundo oferece. Reconhecer o condicionamento não retira a responsabilidade: ajuda a ver quais alternativas existiam de fato.' }
  },
  {
    id: 'troca', hora: '12h30', titulo: 'A troca', margem: 0.8,
    texto: 'No almoço, a colega de equipe chora. Está escalada para a entrada, no atendimento ao público, e pede para trocar com você, que ficou nos bastidores. Nos bastidores você conseguiria adiantar o trabalho da faculdade.',
    info: { rotulo: 'Perguntar o que houve', texto: 'Na semana passada ela foi destratada por um convidado. Desde então trava quando precisa atender.' },
    opcoes: [
      { t: 'Trocar com ela.',
        d: 'Ela agradece. Você perde a chance de adiantar o trabalho.',
        w: { i: 0.2, e: 0.7, r: 0.1 }, cd: -0.3, cor: { I: 2, V: 1 }, ef: { equipe: 1, trabalho: -1 },
        car: 'emoção: você respondeu ao sofrimento dela, à custa de um interesse seu.' },
      { t: 'Não trocar, e cobrir a entrada nos dois horários de pico.',
        d: 'Ela aguenta o resto do turno. Você adianta parte do trabalho.',
        w: { i: 0.1, e: 0.45, r: 0.45 }, cd: -0.2, cor: { V: 2, C: 1 }, ef: { equipe: 1, cansaco: 1 },
        car: 'emoção e razão juntas: você atendeu ao que ela sentia sem abrir mão do que precisava.' },
      { t: 'Sugerir que ela fale com a chefia, que decide a escala.',
        d: 'Ela fala. A chefia remaneja outra pessoa e comenta que ela “precisa aprender a lidar”.',
        w: { i: 0.2, e: 0.1, r: 0.7 }, cd: 0.5, cor: { C: 1, X: 1 }, ef: { equipe: -1 },
        car: 'transferência: você encaminhou a decisão a quem tinha autoridade sobre a escala.' }
    ],
    conceito: { titulo: 'Razão, emoção e cuidado',
      texto: 'Na tradição que vem de Platão, a razão deveria conduzir desejos e emoções. Hume lembra que os sentimentos também fundamentam os juízos morais. A ética do cuidado olha para a vulnerabilidade e a relação concreta. Cuidar, porém, não é decidir pelo outro, nem anular a si mesmo.' }
  },
  {
    id: 'verba', hora: '14h00', titulo: 'A verba', margem: 0.5,
    texto: 'Um fornecedor cancelou e ficou um buraco no orçamento. A chefia pede uma proposta para reorganizar os gastos. Dá para cortar a oficina adaptada, que atende doze pessoas com deficiência e custa caro, ou reduzir quinze por cento de tudo, o que piora o lanche e o som para os quatrocentos.',
    info: { rotulo: 'Ligar para a instituição dos doze', texto: 'O transporte deles já está pago e a caminho.' },
    opcoes: [
      { t: 'Propor cortar a oficina.',
        d: 'O evento sai bem para a maioria. Os doze chegam e não há oficina.',
        w: { i: 0.2, e: 0.1, r: 0.7 }, cd: -0.9, cor: { U: 3 }, ef: { evento: 1, pend: 'doze' },
        car: 'cálculo de consequências: o maior benefício para o maior número.' },
      { t: 'Propor reduzir um pouco de tudo.',
        d: 'O som falha em dois momentos e o lanche acaba cedo. A oficina acontece.',
        w: { i: 0.1, e: 0.3, r: 0.6 }, cd: 0.6, cor: { C: 2, V: 1 }, ef: { evento: -1 },
        car: 'equidade: você aceitou um prejuízo espalhado para não excluir quem tinha mais barreiras.' },
      { t: 'Propor manter tudo e cortar a hora extra da equipe, inclusive a sua.',
        d: 'A chefia aceita. A equipe descobre de quem foi a ideia.',
        w: { i: 0.2, e: 0.4, r: 0.4 }, cd: 0.5, cor: { V: 2, I: 1 }, ef: { equipe: -2, evento: 1 },
        car: 'assumir o custo: você preferiu que a conta caísse sobre a equipe, você incluído.' }
    ],
    conceito: { titulo: 'Utilitarismo, igualdade e equidade',
      texto: 'O utilitarismo avalia a decisão pelas consequências: quantas pessoas se beneficiam e quanto. Seu limite é que o benefício da maioria pode violar direitos de poucos. Igualdade é dar a mesma regra a todos; equidade é considerar barreiras diferentes para garantir participação justa.' }
  },
  {
    id: 'figurinha', hora: '15h30', titulo: 'A figurinha', margem: 0.9,
    texto: 'No grupo da turma, a foto de um colega dormindo na aula virou figurinha. Quarenta mensagens rindo. Ele está no grupo e não escreveu nada. Você está sem tempo.',
    info: { rotulo: 'Abrir o perfil dele', texto: 'Ele trabalha de madrugada num posto de combustível.' },
    opcoes: [
      { t: 'Não escrever nada e silenciar o grupo.',
        d: 'As mensagens continuam.',
        w: { i: 0.7, e: 0.1, r: 0.2 }, cd: -0.3, cor: { X: 2 }, ef: { pend: 'exposto' },
        car: 'omissão: você viu, podia agir e deixou passar.' },
      { t: 'Escrever no grupo: “Gente, apaga isso.”',
        d: 'Dois riem de você, três apagam. A figurinha para de circular ali.',
        w: { i: 0.2, e: 0.5, r: 0.3 }, cd: 0.7, cor: { V: 3 }, ef: {},
        car: 'coragem: você se expôs para interromper o que achou errado.' },
      { t: 'Mandar mensagem privada para ele: “Vi aquilo. Tudo bem contigo?”',
        d: 'Ele responde à noite: “Valeu.” A figurinha continua no grupo.',
        w: { i: 0.1, e: 0.6, r: 0.3 }, cd: -0.3, cor: { I: 2, C: 1 }, ef: {},
        car: 'cuidado com a pessoa: você foi até ele, sem enfrentar o grupo.' }
    ],
    conceito: { titulo: 'Ação, omissão e responsabilidade',
      texto: 'A responsabilidade não nasce só de fazer algo. Também pode nascer de deixar de agir quando havia conhecimento e possibilidade razoável de intervir. Vale perguntar: eu sabia? eu podia? havia alternativa menos danosa?' }
  },
  {
    id: 'ligacao', hora: '17h00', titulo: 'A ligação', margem: 0.5,
    texto: 'A sua irmã liga. A mãe de vocês precisa de alguém para acompanhá-la numa consulta às 18h30. “É só hoje. Eu não consigo sair.”',
    info: { rotulo: 'Perguntar se outra pessoa pode', texto: 'Um primo pode, mas mora longe e vai precisar de transporte.' },
    opcoes: [
      { t: 'Dizer que hoje não dá e que amanhã cedo você passa lá.',
        d: 'A sua irmã desliga rápido. A mãe de vocês vai sozinha.',
        w: { i: 0.2, e: 0.1, r: 0.7 }, cd: -0.7, cor: { U: 2, X: 1 }, ef: { familia: 'adiado' },
        car: 'razão voltada ao resultado: o evento e o emprego pesaram mais do que o pedido.' },
      { t: 'Pedir à chefia para sair das 18h às 19h30.',
        d: '',
        w: { i: 0.2, e: 0.6, r: 0.2 }, cd: 0.5, cor: { I: 2, V: 1 }, ef: {}, pedeChefia: true,
        car: 'emoção e cuidado: você tentou estar presente, mesmo com risco para o trabalho.' },
      { t: 'Pedir ao primo e pagar o transporte por aplicativo.',
        d: 'A mãe de vocês vai acompanhada. A sua irmã comenta: “Você resolveu com dinheiro.”',
        w: { i: 0.1, e: 0.3, r: 0.6 }, cd: -0.4, cor: { C: 2, U: 1 }, ef: { familia: 'atendido' },
        car: 'razão que busca saída: você garantiu o cuidado sem estar lá.' }
    ],
    conceito: { titulo: 'O individual e o coletivo',
      texto: 'A ponderação ética envolve a relação entre interesses próprios e dos outros. Considerar o outro não exige anular a si mesmo: trata-se de articular o respeito à própria vida com a consideração pelas demais pessoas.' }
  },
  {
    id: 'fotos', hora: '19h00', titulo: 'As fotos', margem: 0.6,
    texto: 'Evento cheio. O cliente quer postagem ao vivo no perfil da empresa. As melhores fotos mostram rostos, entre eles crianças e os participantes da oficina adaptada.',
    info: { rotulo: 'Abrir o formulário de inscrição', texto: 'A única autorização pedida na inscrição foi “aceito receber e-mails”.' },
    opcoes: [
      { t: 'Postar as melhores fotos agora.',
        d: 'O cliente adora o resultado.',
        w: { i: 0.6, e: 0.2, r: 0.2 }, cd: -0.8, cor: { U: 2 }, ef: { cliente: 1, pend: 'imagem' },
        car: 'vontade de agradar: o pedido do cliente e a pressa decidiram.' },
      { t: 'Postar só o palco e planos gerais, sem rosto identificável.',
        d: 'O cliente acha as fotos “frias”.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.8, cor: { V: 2, I: 1 }, ef: { cliente: -1 },
        car: 'dever: sem autorização, você não expôs ninguém, mesmo contrariando o cliente.' },
      { t: 'Pedir autorização na hora a quem aparece e postar mais tarde as autorizadas.',
        d: 'Você perde vinte minutos e posta seis fotos às 20h. O cliente reclama do atraso.',
        w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.4, cor: { C: 2, V: 1 }, ef: { cliente: -1, cansaco: 1 },
        car: 'razão que concilia: você buscou o consentimento e aceitou pagar com tempo.' }
    ],
    conceito: { titulo: 'Consentimento e meios',
      texto: 'Divulgar o evento é uma finalidade legítima. A pergunta ética é sobre o meio: a imagem de uma pessoa pertence a ela. Uma boa intenção não torna correto qualquer caminho; é preciso examinar os meios escolhidos e os danos previsíveis.' }
  },
  {
    id: 'interprete', hora: '20h30', titulo: 'O que deu errado', margem: 0.7,
    texto: 'Você percebe que esqueceu de confirmar o intérprete de Libras. Ele não veio. A chefia ainda não notou, e a programação segue.',
    info: { rotulo: 'Olhar a plateia', texto: 'Há três pessoas surdas na terceira fila.' },
    opcoes: [
      { t: 'Contar à chefia agora.',
        d: 'Ela fecha a cara e liga para um intérprete conhecido, que chega em meia hora.',
        w: { i: 0.1, e: 0.3, r: 0.6 }, cd: 0.9, cor: { V: 3 }, ef: { evento: 1 },
        car: 'coragem e veracidade: você assumiu o erro quando ainda dava para corrigir.' },
      { t: 'Resolver por conta própria, com legenda no telão e roteiro impresso, e contar no fim.',
        d: 'Funciona pela metade. No fim a chefia diz: “Preferia ter sabido antes.”',
        w: { i: 0.3, e: 0.2, r: 0.5 }, cd: -0.4, cor: { C: 2, U: 1 }, ef: {},
        car: 'reparo sem exposição: você cuidou do efeito, mas adiou assumir a autoria.' },
      { t: 'Não mencionar, a menos que alguém pergunte.',
        d: 'Ninguém pergunta hoje.',
        w: { i: 0.7, e: 0.2, r: 0.1 }, cd: -0.6, cor: { X: 2 }, ef: { evento: -1, pend: 'interprete' },
        car: 'autoproteção: o medo da reação pesou mais do que o efeito sobre quem dependia do intérprete.' }
    ],
    conceito: { titulo: 'Virtude e justo meio',
      texto: 'Para Aristóteles, a virtude está entre dois vícios: a coragem fica entre a covardia e a temeridade; a veracidade, entre esconder e exagerar. Não se trata de um ato isolado, mas de uma disposição que se forma agindo.' }
  }
];

// Cena final: volta a pendência de maior peso.
export const ORDEM_PENDENCIAS = ['numero', 'nome', 'exposto', 'doze', 'imagem', 'interprete'];

export const VOLTAS = {
  numero: 'O cliente escreve: “No telão contei bem menos de 500. Podemos conversar amanhã?”',
  nome: 'A professora responde ao envio do trabalho: “Todos participaram igualmente?”',
  exposto: 'O colega da figurinha saiu do grupo da turma. Alguém pergunta se você sabe por quê.',
  doze: 'A instituição que trouxe os doze participantes manda mensagem pedindo uma explicação.',
  imagem: 'A mãe de uma criança pede a retirada de uma foto e pergunta quem autorizou.',
  interprete: 'Uma das pessoas surdas registrou uma reclamação no perfil da empresa.',
  nenhuma: 'Faltam 59 minutos para a entrega, e a sua parte está pela metade. O grupo pergunta se você consegue.'
};

export const CENA_FINAL = {
  id: 'volta', hora: '23h00', titulo: 'O que voltou', margem: 0.7,
  info: null,
  opcoes: [
    { t: 'Responder agora, dizendo o que você fez e por quê.',
      d: 'Você escreve. A resposta do outro lado só vem amanhã.',
      w: { i: 0.1, e: 0.2, r: 0.7 }, cd: 0.8, cor: { V: 2, C: 1 }, ef: {},
      car: 'responsabilidade assumida: você respondeu pelo que fez.' },
    { t: 'Consertar o que der, sem comentar a sua parte.',
      d: 'Você resolve o que consegue antes de dormir.',
      w: { i: 0.3, e: 0.2, r: 0.5 }, cd: -0.5, cor: { C: 2, U: 1 }, ef: {},
      car: 'reparo sem autoria: você cuidou do efeito, mas não disse de onde ele veio.' },
    { t: 'Deixar para amanhã.',
      d: 'Você silencia o celular.',
      w: { i: 0.7, e: 0.2, r: 0.1 }, cd: -0.3, cor: { X: 2 }, ef: { adiou: true },
      car: 'adiamento: o cansaço e a vontade de encerrar o dia decidiram.' }
  ],
  conceito: { titulo: 'Complexidade e responsabilidade',
    texto: 'Para a ética da complexidade, as decisões têm efeitos indiretos e não intencionais, e boa intenção não garante bom resultado. Por isso acompanhar, corrigir e reparar também faz parte da responsabilidade. A última pergunta do percurso é: o que eu assumo?' }
};

// Subcena: a chefia negou a saída na cena da ligação.
export const CENA_NEGADA = {
  id: 'negada', hora: '17h10', titulo: 'A resposta da chefia', margem: 0.3,
  texto: 'A chefia responde: “Hoje não. Preciso de todo mundo na abertura.”',
  info: null,
  opcoes: [
    { t: 'Ficar no evento e avisar a sua irmã.',
      d: 'A sua irmã responde só “ok”. A mãe de vocês vai sozinha.',
      w: { i: 0.2, e: 0.2, r: 0.6 }, cd: 0.2, cor: { X: 2, U: 1 }, ef: { familia: 'sem resposta' },
      car: 'escolha dentro do limite: diante do não, você ficou com o emprego.' },
    { t: 'Sair assim mesmo e voltar o mais rápido possível.',
      d: 'Você acompanha a consulta e volta às 19h40. A chefia não fala com você o resto da noite.',
      w: { i: 0.3, e: 0.6, r: 0.1 }, cd: -0.2, cor: { I: 2, X: 1 }, ef: { familia: 'atendido', chefia: -2, evento: -1 },
      car: 'emoção: o vínculo com a família pesou mais do que a ordem recebida.' }
  ],
  conceito: { titulo: 'Liberdade situada, de novo',
    texto: 'A resposta que você recebeu dependeu de como o dia tinha corrido até ali. As escolhas anteriores mudam as possibilidades seguintes: a liberdade de agora foi construída, em parte, pelas decisões da manhã.' }
};

export const SINTESE = [
  ['O que estou desejando?', 'Desejo e subjetividade'],
  ['O que compreendi?', 'Consciência'],
  ['O que decidi?', 'Vontade e liberdade'],
  ['O que fiz?', 'Conduta'],
  ['O que pretendia?', 'Intenção'],
  ['O que aconteceu?', 'Consequência'],
  ['O que assumo?', 'Responsabilidade']
];

export const MOTIVOS = [
  'Agi mais pela emoção',
  'Agi mais pela razão',
  'Agi por impulso',
  'Pensei no que era certo',
  'Pensei no resultado'
];

export const APLICACAO = {
  titulo: 'Um vídeo no grupo da turma',
  situacao: 'Em uma aula, alguém grava uma colega fazendo uma pergunta. Ela autoriza o envio ao grupo da turma para retomar a discussão. Depois, uma pessoa sugere postar o vídeo no perfil público do curso para alcançar quem ficou de fora.',
  pergunta: 'O que você faria? Explique o que muda entre os dois usos e aplique à sua decisão a distinção entre intenção, meio e consequência.',
  leitura: 'A intenção de ampliar o acesso pode ser legítima. A postagem pública é outro meio: muda o público, o alcance e a exposição da colega. A autorização para um uso específico não se estende automaticamente ao outro. Que efeito cada alternativa teria para a colega e para quem quer acompanhar a discussão?'
};


// Em cada par, a urgência narrativa aparece em apenas uma cena por sessão.
export const CENAS_COM_URGENCIA = [
  [
    { id: 'numero', trecho: 'A pessoa da recepção avisa que o cliente já está esperando pelo relatório na sala ao lado.' },
    { id: 'verba', trecho: 'A equipe de compras avisa que precisa da proposta agora para fechar os pedidos.' }
  ],
  [
    { id: 'troca', trecho: 'A colega mostra a escala. O atendimento dela é o próximo a começar.' },
    { id: 'ligacao', trecho: 'A sua irmã avisa que o carro que leva sua mãe já está a caminho.' }
  ]
];

// Condições narrativas de cada cena, inspiradas nos temas que a literatura sobre estresse percebido (PSS-10)
// reúne: o inesperado, a pouca margem de controle e o acúmulo de demandas. Descrevem a ficção, não a pessoa.
export const CONDICOES = {
  imprevisto: { nome: 'Imprevisto', texto: 'algo que você não esperava chegou e mudou o plano' },
  controle: { nome: 'Pouco controle', texto: 'prazos ou decisões de outras pessoas limitavam o que você podia mudar' },
  acumulo: { nome: 'Acúmulo de demandas', texto: 'várias obrigações pediam você ao mesmo tempo' }
};

export const COND_CENAS = {
  mensagem: ['imprevisto', 'controle'],
  nome: ['imprevisto', 'acumulo'],
  numero: ['controle'],
  horario: ['controle', 'acumulo'],
  troca: ['imprevisto', 'acumulo'],
  verba: ['imprevisto', 'controle'],
  figurinha: ['acumulo'],
  ligacao: ['imprevisto', 'acumulo'],
  fotos: ['controle', 'acumulo'],
  interprete: ['imprevisto', 'controle'],
  volta: ['acumulo'],
  negada: ['controle']
};

export const BASE_ESTRESSE = {
  titulo: 'Base das condições de pressão',
  texto: 'As condições “imprevisto”, “pouco controle” e “acúmulo de demandas” foram escolhidas a partir dos temas da Escala de Estresse Percebido (PSS-10). A atividade não aplica a escala, não calcula escore e não mede o seu estresse: descreve o que a história colocou no seu caminho.',
  referencias: [
    'Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. Journal of Health and Social Behavior, 24(4), 385-396.',
    'Cohen, S., & Williamson, G. (1988). Perceived stress in a probability sample of the United States. In S. Spacapan & S. Oskamp (Eds.), The social psychology of health. Sage.',
    'Reis, R. S., Hino, A. A. F., & Añez, C. R. R. (2010). Perceived Stress Scale: reliability and validity study in Brazil. Journal of Health Psychology, 15(1), 107-114.'
  ]
};

// ---------------------------------------------------------------------------------------------
// v1.0 · Níveis de estresse por cena.
// Cada cena do dia é sorteada em um nível (baixo, médio, alto). Só o contexto muda; as alternativas são as mesmas.
// O contexto nunca usa palavras de estresse: a diferença está nos fatos e na frequência com que a pressão volta.
// ---------------------------------------------------------------------------------------------
export const NIVEIS = ['baixo', 'medio', 'alto'];
export const NOME_NIVEL = { baixo: 'baixo estresse', medio: 'médio estresse', alto: 'alto estresse' };

export const CONTEXTOS = {
  mensagem: {
    baixo: 'É a primeira vez que a chefia escreve nesse tom, e o dia ainda está calmo.',
    medio: 'Duas vezes neste mês a chefia já cobrou uma entrega logo cedo.',
    alto: 'É a quarta cobrança logo cedo só nesta semana, e o grupo já comenta.'
  },
  nome: {
    baixo: 'É a primeira vez neste semestre que ele deixa de entregar uma parte.',
    medio: 'Já é a segunda entrega em que ele atrasa a parte dele.',
    alto: 'Já é a terceira entrega seguida em que ele some, e o grupo já cobrou duas vezes.'
  },
  numero: {
    baixo: 'O relatório só vai ao cliente amanhã.',
    medio: 'A pessoa da recepção avisa que o cliente já está esperando pelo relatório na sala ao lado.',
    alto: 'O cliente já esperou duas vezes por este relatório, e a chefia está de olho na tela.'
  },
  horario: {
    baixo: 'É a primeira vez que a chefia pede isso, e ela deixou claro que ouve sugestões.',
    medio: 'Na semana passada a chefia já pediu algo parecido.',
    alto: 'É a terceira vez neste mês que a chefia pede para ficar até o fim, e a advertência anterior continua valendo.'
  },
  troca: {
    baixo: 'A entrada só abre em uma hora.',
    medio: 'A colega mostra a escala. O atendimento dela é o próximo a começar.',
    alto: 'É a terceira vez nesta semana que ela precisa sair do atendimento, e a fila já começou a se formar.'
  },
  verba: {
    baixo: 'A chefia deu até amanhã para a proposta.',
    medio: 'A equipe de compras avisa que precisa da proposta agora para fechar os pedidos.',
    alto: 'É o terceiro corte de verba neste mês, e a equipe de compras espera a sua resposta agora.'
  },
  figurinha: {
    baixo: 'A figurinha apareceu hoje pela primeira vez.',
    medio: 'Já é a segunda figurinha do mesmo colega nesta semana.',
    alto: 'Já é a quinta figurinha do mesmo colega nesta semana, e o grupo estranha quem não participa.'
  },
  ligacao: {
    baixo: 'Faltam três horas para a consulta.',
    medio: 'A sua irmã avisa que o carro que leva sua mãe já está a caminho.',
    alto: 'É a quarta consulta da sua mãe neste mês que cai num dia de evento, e o carro já está a caminho.'
  },
  fotos: {
    baixo: 'O cliente disse que a postagem pode esperar até amanhã.',
    medio: 'O cliente pede a postagem agora, e a transmissão já começou.',
    alto: 'É a terceira vez neste evento que o cliente reclama da demora nas postagens.'
  },
  interprete: {
    baixo: 'É a primeira vez que você esquece algo na confirmação dos serviços.',
    medio: 'Já é o segundo esquecimento seu nesta semana.',
    alto: 'Já é o terceiro esquecimento seu neste mês, e a chefia avisou que a próxima falha vai para o seu registro.'
  }
};

// O que cada alternativa protege (p) e o que sacrifica (s), em conceitos éticos. Ordem = ordem das alternativas.
export const ETIQUETAS = {
  profissional: 'a ética profissional (os deveres do ofício)',
  colegas: 'o coleguismo',
  meta: 'a meta pessoal',
  empresa: 'a empresa',
  curso: 'o curso',
  familia: 'a família',
  vulneraveis: 'quem estava mais vulnerável',
  justica: 'a justiça e a equidade',
  verdade: 'a veracidade',
  instituicao: 'a instituição (a escola ou o projeto)',
  confianca: 'a confiança de quem se abriu com você'
};

export const VALORES = {
  mensagem: [{ p: ['verdade'], s: [] }, { p: ['profissional', 'empresa'], s: ['meta'] }, { p: ['profissional', 'verdade'], s: [] }],
  nome: [{ p: ['colegas'], s: ['verdade', 'meta'] }, { p: ['colegas', 'justica'], s: [] }, { p: ['verdade', 'justica', 'curso'], s: ['colegas'] }],
  numero: [{ p: ['verdade', 'profissional'], s: ['colegas'] }, { p: ['colegas', 'empresa'], s: ['verdade', 'profissional'] }, { p: ['verdade', 'profissional', 'empresa'], s: [] }],
  horario: [{ p: ['empresa'], s: ['curso', 'colegas'] }, { p: ['curso', 'justica'], s: ['empresa'] }, { p: ['empresa', 'curso'], s: ['meta'] }],
  troca: [{ p: ['colegas', 'vulneraveis'], s: ['meta', 'curso'] }, { p: ['colegas', 'vulneraveis', 'curso'], s: ['meta'] }, { p: ['profissional', 'meta'], s: ['colegas'] }],
  verba: [{ p: ['empresa'], s: ['vulneraveis', 'justica'] }, { p: ['justica', 'vulneraveis'], s: ['empresa'] }, { p: ['justica', 'vulneraveis', 'empresa'], s: ['colegas'] }],
  figurinha: [{ p: ['meta'], s: ['colegas', 'vulneraveis'] }, { p: ['colegas', 'vulneraveis', 'justica'], s: [] }, { p: ['colegas', 'vulneraveis'], s: [] }],
  ligacao: [{ p: ['empresa', 'meta'], s: ['familia'] }, { p: ['familia'], s: ['empresa'] }, { p: ['familia', 'empresa'], s: ['meta'] }],
  fotos: [{ p: ['empresa'], s: ['vulneraveis', 'profissional'] }, { p: ['vulneraveis', 'profissional'], s: ['empresa'] }, { p: ['vulneraveis', 'profissional', 'justica'], s: ['empresa'] }],
  interprete: [{ p: ['verdade', 'profissional', 'vulneraveis'], s: [] }, { p: ['vulneraveis', 'empresa'], s: ['verdade'] }, { p: ['meta'], s: ['vulneraveis', 'verdade', 'profissional'] }],
  volta: [{ p: ['verdade', 'profissional'], s: [] }, { p: ['profissional'], s: ['verdade'] }, { p: ['meta'], s: ['profissional'] }],
  negada: [{ p: ['empresa'], s: ['familia'] }, { p: ['familia'], s: ['empresa'] }]
};
