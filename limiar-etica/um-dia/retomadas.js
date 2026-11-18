// Cada par mantém o conflito e as estratégias de ação, com duas histórias diferentes.
export const PARES = [
  {
    tema: 'Trabalho e estudo',
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

function misturar(itens, sortear) {
  const copia = itens.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(sortear() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function prepararRodadas(sortear = Math.random) {
  const urgentes = new Set(misturar(PARES.map((_, i) => i), sortear).slice(0, 2));
  const primeiraForma = PARES.map(() => Math.floor(sortear() * 2));
  return [0, 1].map(rodada => misturar(PARES.map((par, i) => ({
    par: i,
    urgente: urgentes.has(i),
    forma: par.formas[rodada === 0 ? primeiraForma[i] : 1 - primeiraForma[i]],
    ordem: misturar(par.opcoes.map((_, j) => j), sortear)
  })), sortear));
}

export function cruzarRodadas(primeira, segunda) {
  return PARES.map((par, i) => {
    const antes = primeira.find(registro => registro.par === i);
    const depois = segunda.find(registro => registro.par === i);
    return {
      tema: par.tema,
      urgente: antes.urgente,
      antes,
      depois,
      repetiuEscolha: antes.escolha === depois.escolha,
      repetiuConsulta: antes.consultou === depois.consultou
    };
  });
}
