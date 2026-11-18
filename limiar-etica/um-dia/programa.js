// Limiar Ético · conteúdo programático.
// Oito eixos de competência ética. Cada cena dos três dias exercita um eixo principal e, às vezes, um secundário.
// O que o aluno vê no retorno é só o "mapa do dia": que eixos foram postos à prova e em quais cenas.
// A base teórica de cada eixo está em docs/PROGRAMA-limiar-etico-v0.1.md. Nada aqui calcula nota ou nível de estresse.

export const EIXOS = {
  veracidade: {
    titulo: 'Veracidade e integridade profissional',
    competencia: 'Dizer o que é, assumir o erro e não maquiar dados, mesmo quando o hábito do grupo manda o contrário.',
    pergunta: 'Eu diria isto do mesmo jeito se quem confia em mim estivesse vendo?',
    verbetes: ['honestidade', 'veracidade', 'zelo', 'competencia', 'justo-meio']
  },
  coleguismo: {
    titulo: 'Coleguismo e complacência',
    competencia: 'Apoiar colegas sem acobertar o que está errado, e sem desmerecer quem não está presente.',
    pergunta: 'Proteger meu colega, aqui, é solidariedade ou é complacência com o mal?',
    verbetes: ['coleguismo', 'complacencia', 'carona', 'bem-comum', 'duplo-padrao', 'fair-play']
  },
  justica: {
    titulo: 'Justiça e equidade',
    competencia: 'Distribuir recursos e oportunidades com critério que se possa explicar a todos, sem favor e sem ignorar quem precisa mais.',
    pergunta: 'Eu defenderia este critério diante de quem ficou de fora?',
    verbetes: ['justica-distributiva', 'equidade', 'veu', 'diferenca', 'utilitarismo']
  },
  cuidado: {
    titulo: 'Cuidado e proteção de quem é vulnerável',
    competencia: 'Perceber quem está em risco, não causar dano e acionar as salvaguardas e a rede de proteção.',
    pergunta: 'Quem aqui é mais vulnerável, e o que o meu papel me obriga a fazer por essa pessoa?',
    verbetes: ['cuidado', 'beneficencia', 'nao-maleficencia', 'salvaguardas', 'dever-vigilancia', 'rede-protecao', 'violencia-escola', 'bullying']
  },
  responsabilidade: {
    titulo: 'Responsabilidade: agir, omitir, transferir',
    competencia: 'Reconhecer quando o silêncio ou o adiamento também é uma decisão, e encaminhar sem abandonar.',
    pergunta: 'Se eu não fizer nada, quem responde por isso? E se eu repassar, quem acompanha?',
    verbetes: ['responsabilidade', 'omissao', 'transferencia', 'negligencia', 'imprudencia', 'responsabilidade-equipe']
  },
  privacidade: {
    titulo: 'Privacidade, consentimento e sigilo',
    competencia: 'Usar imagem e informação de terceiros só com autorização, e saber que o sigilo tem limite quando há risco.',
    pergunta: 'Quem autorizou isto, e o que pode acontecer com essa pessoa depois que sair daqui?',
    verbetes: ['sigilo', 'autonomia-pessoa', 'confianca', 'salvaguardas']
  },
  papel: {
    titulo: 'Papel, competência e norma',
    competencia: 'Reconhecer os limites da própria formação e do cargo, e distinguir o que é legal, o que é ético e o que é costume.',
    pergunta: 'Isto cabe a mim? Se não, a quem encaminho, e como?',
    verbetes: ['limites-competencia', 'impericia', 'etica-profissional', 'codigo-confef', 'legal-etico', 'deontologia']
  },
  decisao: {
    titulo: 'Razão, emoção e liberdade situada',
    competencia: 'Decidir sob pressão e entre lealdades, percebendo o peso das emoções, do dever e das consequências.',
    pergunta: 'Que parte desta decisão veio do dever, que parte da emoção e que parte do medo das consequências?',
    verbetes: ['kohlberg', 'liberdade-situada', 'afetos', 'racionalismo', 'intencao-motivo', 'consequencialismo', 'dever']
  }
};

// cena → [eixo principal, ...secundários], por dia.
export const CENA_EIXOS = {
  empresa: {
    mensagem: ['veracidade', 'decisao'],
    nome: ['coleguismo', 'veracidade'],
    numero: ['veracidade', 'coleguismo'],
    horario: ['decisao'],
    troca: ['cuidado', 'decisao'],
    verba: ['justica', 'cuidado'],
    figurinha: ['responsabilidade', 'coleguismo'],
    ligacao: ['decisao'],
    fotos: ['privacidade', 'cuidado'],
    interprete: ['veracidade', 'cuidado']
  },
  escola: {
    vaga: ['papel', 'cuidado'],
    gol: ['responsabilidade', 'cuidado'],
    halter: ['cuidado', 'privacidade'],
    gravacao: ['privacidade', 'cuidado'],
    quadra: ['cuidado', 'responsabilidade'],
    verba: ['justica'],
    convocacao: ['justica'],
    joelho: ['responsabilidade', 'coleguismo'],
    antecessor: ['coleguismo', 'veracidade'],
    fotos: ['privacidade']
  },
  bairro: {
    barulho: ['cuidado', 'responsabilidade'],
    busca: ['cuidado', 'papel'],
    cansaco: ['papel', 'cuidado'],
    torneio: ['justica'],
    briga: ['responsabilidade', 'papel'],
    favor: ['justica', 'veracidade'],
    convite: ['cuidado', 'papel'],
    imagens: ['privacidade', 'cuidado'],
    plano: ['coleguismo', 'veracidade'],
    relato: ['privacidade', 'cuidado', 'papel']
  }
};

// Mapa do dia: para cada eixo, as cenas jogadas que o tocaram (principal primeiro).
export function mapaDoDia(dia, pontos) {
  const mapa = CENA_EIXOS[dia] || {};
  const por = {};
  for (const p of pontos) {
    const eixos = mapa[p.cenaId];
    if (!eixos) continue;
    eixos.forEach((e, i) => {
      (por[e] = por[e] || []).push({ titulo: p.titulo, principal: i === 0 });
    });
  }
  return Object.keys(EIXOS)
    .filter(e => por[e])
    .map(e => ({
      id: e, ...EIXOS[e],
      cenas: por[e].sort((a, b) => b.principal - a.principal).map(c => c.titulo),
      principais: por[e].filter(c => c.principal).length
    }))
    .sort((a, b) => b.principais - a.principais || b.cenas.length - a.cenas.length);
}
