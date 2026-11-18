// Cada par mantém o conflito e as estratégias de ação, com duas histórias diferentes.
export const PARES = [
  {
    tema: 'Trabalho e estudo',
    lente: {
      titulo: 'Liberdade situada e responsabilidade',
      leituras: [
        "Cumprir o turno protege a continuidade do trabalho e concentra em você o custo de estudar com menos tempo.",
        "Negociar a troca usa a margem que as regras e as relações de trabalho oferecem. A solução depende do acordo de quem cobre o turno.",
        "Priorizar a prova protege a continuidade dos estudos. Avisar abre espaço para reorganizar a escala, com consequências para você e para a equipe."
      ]
    },
    opcoes: ['Cumprir o turno e usar o tempo que sobrar para estudar.', 'Propor uma troca de horário à chefia.', 'Priorizar a prova e avisar que não pode cumprir o turno inteiro.'],
    formas: [
      {
        titulo: 'O fechamento da loja',
        texto: 'Você tem uma prova da qual depende sua aprovação. A loja ficou sem uma pessoa no fechamento e colocou seu nome na escala. Você já recebeu uma advertência por faltar a um turno.',
        urgencia: 'A escala vai ser enviada agora, assim que a encarregada sair da reunião.',
        rotulo: 'Consultar as regras da escala',
        fato: 'Uma troca entre colegas pode ser aprovada pela encarregada e registrada na escala.'
      },
      {
        titulo: 'O inventário do depósito',
        texto: 'A recuperação da manhã seguinte define se você passa na disciplina. A pessoa do inventário faltou e você foi escalado para ficar até mais tarde. Seu supervisor já chamou sua atenção por uma falta.',
        urgencia: 'O supervisor está distribuindo as equipes e pediu que você diga agora se fica.',
        rotulo: 'Consultar o acordo sobre trocas',
        fato: 'Outra pessoa pode assumir o inventário se o supervisor aprovar e registrar a troca.'
      }
    ]
  },
  {
    tema: 'Informação e exposição',
    lente: {
      titulo: 'Juízo de fato, intenção e consequências',
      leituras: [
        "Repassar o relato atende à intenção de alertar, mas o alcance da mensagem pode ampliar a exposição de alguém antes que a informação seja confirmada.",
        "Encaminhar a quem pode verificar preserva a possibilidade de agir e delimita quem recebe uma acusação ainda incerta.",
        "Aguardar confirmação protege a pessoa contra exposição indevida. Se a alteração era real e ainda podia ser corrigida, a espera também pode ter consequências."
      ]
    },
    opcoes: ['Repassar o relato a todo o grupo.', 'Levar o relato à pessoa responsável e dizer o que falta confirmar.', 'Esperar confirmação antes de encaminhar o relato.'],
    formas: [
      {
        titulo: 'A mensagem do campeonato',
        texto: 'Circula a mensagem de que alguém do campeonato alterou a lista de inscritos. A mensagem identifica a pessoa e pede que todos sejam avisados. Você recebeu apenas um recorte da conversa.',
        urgencia: 'A organização vai publicar a lista em seguida, e o grupo pede uma posição antes disso.',
        rotulo: 'Abrir a conversa original',
        fato: 'O recorte não mostra quem fez a última alteração. A coordenação tem acesso ao histórico.'
      },
      {
        titulo: 'A lista da excursão',
        texto: 'Uma captura de tela acusa uma pessoa de trocar os nomes na lista de uma excursão. O grupo quer saber se deve repassar o aviso. Você ainda não viu o documento completo.',
        urgencia: 'Os responsáveis estão prestes a fechar as vagas e pedem uma posição antes da confirmação.',
        rotulo: 'Abrir o histórico do documento',
        fato: 'O histórico de edição está restrito à organização. A captura não mostra quem fez a alteração.'
      }
    ]
  },
  {
    tema: 'Limites e ajuda',
    lente: {
      titulo: 'Ética do cuidado e responsabilidade com os próprios limites',
      leituras: [
        "Assumir o compromisso inteiro acolhe a necessidade da outra pessoa. O custo do descanso recai sobre você.",
        "Oferecer ajuda por um período combina cuidado com a necessidade da outra pessoa e atenção ao seu limite. O acordo depende de a ajuda parcial atender à tarefa.",
        "Manter o período de descanso preserva um compromisso consigo. Avisar com clareza permite que a outra pessoa procure apoio em tempo."
      ]
    },
    opcoes: ['Assumir todo o compromisso.', 'Oferecer ajuda por um período combinado.', 'Manter seu plano e avisar que não pode assumir o compromisso.'],
    formas: [
      {
        titulo: 'A mudança de apartamento',
        texto: 'Um amigo pede ajuda para carregar os móveis. Ele contava com outra pessoa, que desmarcou. O horário coincide com o único período que você reservou para descansar nesta semana.',
        urgencia: 'O motorista chegou e só confirma a mudança se souber agora quantas pessoas estarão lá.',
        rotulo: 'Perguntar o que falta carregar',
        fato: 'Há duas peças grandes. Se alguém ajudar no começo, o amigo consegue terminar com o motorista.'
      },
      {
        titulo: 'A banca da feira',
        texto: 'Uma vizinha pede ajuda para montar e organizar a banca da feira. A pessoa que faria isso desmarcou. O horário coincide com o único período que você reservou para descansar nesta semana.',
        urgencia: 'O portão acaba de abrir e a organização está confirmando quem vai ocupar cada banca.',
        rotulo: 'Perguntar em que parte ela precisa de ajuda',
        fato: 'Ela precisa de outra pessoa para armar a cobertura. Depois consegue atender sem companhia.'
      }
    ]
  },
  {
    tema: 'Consentimento e finalidade',
    lente: {
      titulo: 'Intenção, meio e consequência',
      leituras: [
        "Publicar amplia o alcance da divulgação e também muda o público que verá a pessoa. A finalidade de divulgar precisa ser examinada junto com o meio escolhido.",
        "Pedir nova autorização reconhece que a pessoa pode decidir sobre o uso em um público diferente. A divulgação passa a depender desse acordo.",
        "Usar outro material preserva a finalidade de divulgar e reduz a exposição da pessoa. O conteúdo alternativo pode comunicar a atividade com outro efeito."
      ]
    },
    opcoes: ['Publicar o material identificável no canal aberto.', 'Pedir autorização específica antes de publicar.', 'Divulgar a atividade usando outro material.'],
    formas: [
      {
        titulo: 'O vídeo da oficina',
        texto: 'Uma participante aceitou que seu vídeo fosse exibido durante uma oficina. A equipe quer usá-lo agora no perfil público para divulgar a próxima edição.',
        urgencia: 'A equipe de comunicação está fechando a postagem e quer escolher o vídeo nesta conversa.',
        rotulo: 'Conferir a autorização',
        fato: 'O acordo menciona a exibição na oficina. A equipe também tem imagens do espaço sem pessoas.'
      },
      {
        titulo: 'A foto do ensaio',
        texto: 'Uma pessoa deixou que a foto do ensaio fosse compartilhada no grupo da equipe. Alguém propõe colocá-la na página pública do projeto para convidar novos participantes.',
        urgencia: 'A página vai ser atualizada agora e a pessoa que publica está esperando a foto.',
        rotulo: 'Reler o combinado',
        fato: 'A mensagem menciona o grupo da equipe. Existem fotos dos materiais que podem ser usadas.'
      }
    ]
  }
];

export const EXIGENCIAS = ['Cenário de base', 'Urgência', 'Exigências acumuladas'];

const CONTEXTOS = [
  {
    acrescimo: 'A pessoa que poderia avaliar uma troca está saindo e outra tarefa do turno também ficou sem cobertura.',
    papeis: [
      { papel: 'Colega que pode cobrir', titulo: 'A chave do salão',
        texto: 'Uma colega pede que você cubra parte do fechamento para ela estudar para uma prova decisiva. Você tem um compromisso no mesmo horário.',
        urgencia: 'A escala é fechada nesta reunião.', rotulo: 'Conferir a escala',
        fato: 'O fechamento pode ser dividido em duas partes, se a encarregada aprovar.' },
      { papel: 'Responsável pela escala', titulo: 'A escala do balcão',
        texto: 'Uma pessoa da equipe pede para sair antes do fechamento. Ela tem uma prova decisiva na manhã seguinte. Você precisa garantir a cobertura do balcão.',
        urgencia: 'A equipe está esperando a escala para organizar a volta para casa.', rotulo: 'Conferir as possibilidades de cobertura',
        fato: 'Há duas pessoas disponíveis para dividir o final do turno.' }
    ],
    opcoes: [
      ['Cobrir todo o horário e reorganizar meu compromisso.', 'Oferecer uma parte do horário e negociar a cobertura restante.', 'Manter meu compromisso e avisar que não consigo cobrir.'],
      ['Liberar a pessoa e assumir pessoalmente a cobertura.', 'Autorizar a saída se a equipe combinar a cobertura restante.', 'Manter a escala e explicar a exigência de cobertura.']
    ],
    leituras: [
      ['O apoio à colega tem um custo concreto para você.', 'O cuidado com a colega é negociado junto com o seu próprio compromisso.', 'Você preserva seu compromisso e deixa explícito o limite da ajuda disponível.'],
      ['A chefia assume o custo da exceção para preservar o estudo da pessoa.', 'A chefia usa a margem de negociação e mantém a responsabilidade pela cobertura.', 'A chefia mantém uma regra de cobertura. Vale perguntar que margem a regra deixava para conciliar os compromissos.']
    ]
  },
  {
    acrescimo: 'A pessoa que poderia conferir o histórico está fora, e outra equipe já começou a distribuir a lista.',
    papeis: [{ papel: 'Pessoa nomeada no relato', titulo: 'Seu nome no aviso',
      texto: 'Uma mensagem com seu nome diz que você alterou a ordem de uma lista sem autorização. O grupo pede explicações e você ainda não viu o histórico.',
      urgencia: 'A lista sai ao público em seguida.', rotulo: 'Consultar o canal de revisão',
      fato: 'A organização pode conferir o histórico sem publicar os nomes envolvidos.' }],
    opcoes: [['Responder no grupo com a sua versão.', 'Pedir revisão à organização antes de responder publicamente.', 'Aguardar acesso ao histórico antes de se manifestar.']],
    leituras: [['A resposta permite contestar a acusação em público e pode ampliar a circulação do conflito.', 'A revisão busca estabelecer os fatos e delimita a exposição.', 'A espera preserva o cuidado com os fatos e pode deixar a acusação circulando por mais tempo.']]
  },
  {
    acrescimo: 'Outra pessoa que poderia ajudar desmarcou e parte do material ainda precisa ser retirada.',
    papeis: [{ papel: 'Pessoa que pede ajuda', titulo: 'O fim da montagem',
      texto: 'Você precisa desmontar o espaço de uma atividade. A pessoa a quem você pede ajuda reservou esse período para descansar.',
      urgencia: 'O espaço fecha logo e pediram que você confirme agora quem vai ficar.', rotulo: 'Conferir o que pode esperar',
      fato: 'A organização aceita que parte do material seja guardada no dia seguinte.' }],
    opcoes: [['Pedir ajuda até terminar tudo.', 'Pedir ajuda apenas com as peças que exigem duas pessoas.', 'Reorganizar a tarefa com a equipe e preservar o descanso da pessoa.']],
    leituras: [['O pedido explicita a sua necessidade e transfere parte do custo para a outra pessoa.', 'O pedido delimita a ajuda e considera a necessidade de descanso.', 'A reorganização protege o descanso da outra pessoa e redistribui o trabalho.']]
  },
  {
    acrescimo: 'O material alternativo ainda está com outra equipe e há dois canais aguardando a publicação.',
    papeis: [{ papel: 'Pessoa que aparece na imagem', titulo: 'A imagem do encontro',
      texto: 'Você autorizou uma foto no grupo de uma atividade. Agora pedem que ela seja publicada no canal aberto do projeto.',
      urgencia: 'A equipe de divulgação pede uma resposta antes de fechar a publicação.', rotulo: 'Conferir onde a imagem vai aparecer',
      fato: 'A página é pública e a foto mostra seu rosto com clareza.' }],
    opcoes: [['Autorizar a publicação aberta da foto.', 'Propor uma autorização limitada a outra imagem ou outro público.', 'Manter a autorização restrita ao grupo.']],
    leituras: [['A autorização expressa uma decisão sobre o novo uso; a exposição continua sendo um efeito a considerar.', 'A condição negociada delimita o meio para compatibilizar a divulgação com a sua preferência.', 'Manter o acordo anterior preserva o limite do consentimento que você deu.']]
  }
];

function misturar(itens, sortear) {
  const copia = itens.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(sortear() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function prepararRodadas(sortear = Math.random) {
  const niveis = misturar([0, 1, 2, Math.floor(sortear() * 3)], sortear);
  const primeiraForma = PARES.map(() => Math.floor(sortear() * 2));
  const montar = (par, forma, opcoes, leituras) => ({
    par, forma, opcoes, leituras, nivel: niveis[par],
    acrescimo: CONTEXTOS[par].acrescimo,
    ordem: misturar(opcoes.map((_, i) => i), sortear)
  });
  const [inicio, fim] = [0, 1].map(rodada => misturar(PARES.map((par, i) => {
    const forma = par.formas[rodada === 0 ? primeiraForma[i] : 1 - primeiraForma[i]];
    return montar(i, forma, par.opcoes, par.lente.leituras);
  }), sortear));
  const perspectivas = misturar(CONTEXTOS.flatMap((contexto, i) =>
    contexto.papeis.map((forma, j) => montar(i, forma, contexto.opcoes[j], contexto.leituras[j]))
  ), sortear);
  const colega = perspectivas.findIndex(p => p.forma.papel === 'Colega que pode cobrir');
  const chefia = perspectivas.findIndex(p => p.forma.papel === 'Responsável pela escala');
  if (Math.abs(colega - chefia) === 1) {
    const [cena] = perspectivas.splice(chefia, 1);
    const colegaDepoisDaRemocao = colega - Number(chefia < colega);
    perspectivas.splice(colegaDepoisDaRemocao < 2 ? perspectivas.length : 0, 0, cena);
  }
  return [inicio, perspectivas, fim];
}

export function cruzarRodadas(primeira, segunda) {
  return PARES.map((par, i) => {
    const antes = primeira.find(registro => registro.par === i);
    const depois = segunda.find(registro => registro.par === i);
    return {
      tema: par.tema,
      lente: par.lente,
      nivel: antes.nivel,
      antes,
      depois,
      repetiuEscolha: antes.escolha === depois.escolha,
      repetiuConsulta: antes.consultou === depois.consultou
    };
  });
}
