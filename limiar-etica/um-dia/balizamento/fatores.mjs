// PROJETO APENAS. Não importar em páginas do aluno.
// Camada situacional da régua: quais fatores de risco psicossocial da NOM-035-STPS-2018 (item 7.2)
// cada cena aciona quando é sorteada em nível alto. Complementa as "alavancas" (temas inspirados na PSS-10),
// que descrevem a vivência da pessoa; aqui se descreve a condição da situação.
// Notas de autoria, sem avaliadores independentes; servem para conferir cobertura, não para medir ninguém.

export const FATORES = {
  ambiente:   'Condições no ambiente de trabalho',
  carga:      'Cargas de trabalho',
  controle:   'Falta de controle sobre o trabalho',
  jornada:    'Jornadas e turnos além do previsto',
  familia:    'Interferência trabalho-família',
  lideranca:  'Liderança negativa e relações negativas',
  violencia:  'Violência laboral'
};

export const FATORES_CENA = {
  empresa: {
    mensagem: ['lideranca', 'carga'], nome: ['lideranca'], numero: ['lideranca'],
    horario: ['carga', 'jornada'], troca: ['lideranca', 'carga'], verba: ['controle'],
    figurinha: ['lideranca', 'violencia'], ligacao: ['familia', 'jornada'],
    fotos: ['lideranca', 'carga'], interprete: ['carga', 'controle']
  },
  escola: {
    vaga: ['carga', 'controle', 'jornada'], gol: ['violencia'], halter: ['violencia'], gravacao: ['violencia'],
    quadra: ['ambiente'], verba: ['controle'], convocacao: ['carga', 'lideranca', 'familia'],
    joelho: ['lideranca'], antecessor: ['lideranca'], fotos: ['lideranca']
  },
  bairro: {
    barulho: ['violencia'], piso: ['ambiente', 'controle'], busca: ['violencia'], cansaco: ['carga', 'lideranca', 'jornada', 'familia'], torneio: ['lideranca'],
    briga: ['violencia'], favor: ['lideranca'], convite: ['violencia'], imagens: ['violencia'],
    plano: ['lideranca'], relato: ['violencia']
  },
  academia: {
    triagem: ['carga', 'lideranca'],
    suplemento: ['lideranca'],
    ciclo: ['controle'],
    espelho: ['carga'],
    meta: ['lideranca', 'controle'],
    treino: ['lideranca'],
    bolsa: ['controle'],
    ficha: ['lideranca'],
    antesdepois: ['lideranca'],
    registro: ['lideranca', 'controle']
  },
  pesquisa: {
    termo: ['carga', 'controle'],
    valor: ['carga', 'lideranca'],
    autoria: ['lideranca'],
    hipotese: ['carga', 'controle'],
    planilha: ['carga'],
    saida: ['lideranca', 'carga'],
    equipamento: ['controle', 'carga'],
    texto: ['carga'],
    assentimento: ['controle'],
    malestar: ['lideranca', 'carga']
  },
  clube: {
    tornozelo: ['lideranca', 'violencia'],
    comprimido: ['lideranca', 'violencia'],
    peneira: ['lideranca'],
    extra: ['carga', 'lideranca'],
    vestiario: ['violencia', 'lideranca'],
    agrado: ['lideranca'],
    reporter: ['lideranca'],
    cera: ['lideranca'],
    reserva: ['lideranca'],
    promessa: ['lideranca', 'carga']
  },
  reabilitacao: {
    afericao: ['carga'],
    desconforto: ['carga', 'controle'],
    remedio: ['carga'],
    filho: ['carga'],
    prontuario: ['carga', 'lideranca'],
    alta: ['controle', 'carga'],
    vaga: ['lideranca', 'controle'],
    ritmo: ['violencia', 'lideranca'],
    medico: ['carga', 'controle', 'jornada'],
    emergencia: ['ambiente', 'controle']
  }
};

export function cobertura(dia) {
  const por = Object.fromEntries(Object.keys(FATORES).map(f => [f, []]));
  for (const [cena, fs] of Object.entries(FATORES_CENA[dia])) for (const f of fs) por[f].push(cena);
  return por;
}

export function relatorioFatores() {
  const linhas = [];
  for (const dia of Object.keys(FATORES_CENA)) {
    const c = cobertura(dia);
    linhas.push(`${dia}: ` + Object.entries(c).map(([f, cs]) => `${f}=${cs.length}`).join(' '));
  }
  return linhas.join('\n');
}
