/* Motor da atividade da maquete — A Casa da Costa.

   Sem three.js e sem DOM: este arquivo roda no Node (testes e servidor de
   ensaio), dentro do replay do Firestore e no navegador. Ele decide o que
   cada papel PODE fazer e o que cada papel PODE VER; a cena 3D apenas
   obedece.

   A maquete é uma caixa de segredos: três fechaduras seguram as camadas do
   modelo. Cada chave encaixada solta uma camada — telhado, piso de cima,
   térreo — até o porão aparecer com a passagem que a planta da casa não tem.

   A LEI d'A Casa (Mario, 17/09/2026): cada jogador tem METADE do aparelho, e
   as metades são de naturezas diferentes. Ninguém é avisado do seu papel —
   ele se revela pelo efeito no outro. Em cada camada:

   Ato 1 — os dois procuram ao mesmo tempo. A pista é UMA, idêntica nos dois
           aparelhos, e diz o recorte, não o objeto. Um acha a chave; o outro
           acha a fechadura. O aparelho de cada um só conhece o objeto dele: a
           chave não existe no aparelho de quem tem a fechadura, e a fechadura
           não existe no de quem tem a chave.
   Ato 2 — os dois acharam: chega a segunda pista, também igual. Um arrasta e
           vem; o outro arrasta e não vem (a recusa é da cena, não do motor).
   Ato 3 — quem tem a fixa descreve onde ela está; quem tem a móvel leva.

   Que caminho sobra para terminar sozinho? Nenhum: o encaixe exige a chave
   achada por um E a fechadura achada pelo outro, e só quem tem a chave move
   a chave. */

import './ac-ritmo.js';
const RITMO = globalThis.ACRitmo;

/* Posições das fechaduras no modelo NORMALIZADO (pegada de 1×0,77, base em
   y=0). Saíram medidas do próprio `casa-da-costa-pisos.glb`; o teste
   `ac-maquete.test.mjs` recalcula as três a partir do arquivo e reprova se
   alguém mexer no modelo sem mexer aqui. */
/* Remedidas em 19/09/2026, com o penhasco baixado (ac-maquete-mundo.js). */
/* 11/10/2026 (Tarefa 4): medidas da casa nova, as mesmas d'O Impostor. */
export const FECHADURAS = [
  [-0.23511, 0.30391, -0.10244],  // capitel da chaminé, acima do telhado (portada) · medido em 11/10/2026 no mundo do original
  [-0.21806, 0.21619, -0.10307],  // peito da chaminé, no andar de cima
  [-0.19517, 0.15983, -0.10024]   // peito da chaminé do térreo, na sala do relógio
];

/* Encaixe: distância máxima entre a ponta da chave e a fechadura, na mesma
   escala do modelo normalizado. 0,03 é ~1,2 cm numa maquete de 40 cm. Abaixo
   disso o arrasto no telefone vira sorte; acima, o colega que guia não faz
   falta nenhuma. */
export const TOLERANCIA = 0.03;

/* A segunda pista é a mesma nas três camadas: ela não diz onde, diz COMO. */
export const SEGUNDA_PISTA = 'Uma é fixa que nem a casa, e a outra mexe igual onda.';

/* 11/10/2026 (Tarefa 4): os capítulos da casa nova (CAPITULOS_AC d'O Impostor, remedidos em 01/10), sem a passagem sob a despensa. */
export const CAPITULOS = [
  {
    id: 'portada',
    nome: 'A casa fechada',
    camada: 'telhado',
    chaveiro: 'luz',
    fechadura: 'fechadura-portada',
    fechaduraRotulo: 'O alto da chaminé',
    esconderijo: 'pedra-do-caminho',
    recorte: 'Onde o caminho do portão chega à casa.',
    /* 11/10/2026: a moita e o lajeado saíram dos candidatos: na casa nova a moita é pequena demais (mirar nela não a acerta)
       e o lajeado fica colado no pilar do portão (o toque virava sorteio). Teste da maquete. */
    candidatos: ['pedra-do-caminho', 'pilar-do-portao'],
    rotulos: {
      'pedra-do-caminho': 'A pedra solta do caminho, diante da porta',
      'pilar-do-portao': 'O pilar do portão',
      'moita-do-caminho': 'A moita junto ao caminho', // SUBSTITUIDO (01/10, casa nova): 'A moita ao lado da varanda'
      'laje-de-chegada': 'O lajeado diante da porta'
    },
    achado: {
      chave: 'A pedra estava solta. Debaixo dela havia uma coisa pequena e fria.',
      fechadura: 'No capitel da chaminé, acima do telhado, há um vão de ferro que não é de chaminé.'
    },
    dicas: {
      busca: {
        chave: ['Rente ao chão: nem tudo o que fica no caminho está preso.', 'Diante da porta, no fim do caminho: uma pedra ou uma laje saiu do lugar.'],
        fechadura: ['A casa também tem uma entrada por cima.', 'Olhe o alto da chaminé, acima do telhado.']
      },
      encaixe: {
        chave: ['Pergunte ao colega perto de quê o vão está, e leve a chave até lá.', 'O vão fica no alto da chaminé, acima do telhado.'], // SUBSTITUIDO (01/10): '…embaixo do arco da torre.'
        fechadura: ['Diga ao colega onde está o vão: perto de quê, de que lado da casa.', 'Diga: “no alto da chaminé”. O ponto de luz é a chave dele.']
      }
    },
    porEsconderijo: {
      'pedra-do-caminho': { achado: 'A pedra estava solta. Debaixo dela havia uma coisa pequena e fria.',
        busca: ['Rente ao chão: nem tudo o que fica no caminho está preso.', 'Diante da porta, no fim do caminho: uma pedra ou uma laje saiu do lugar.'] },
      'laje-de-chegada': { achado: 'Uma laje balançou sob o dedo. Debaixo dela havia uma coisa pequena e fria.',
        busca: ['Rente ao chão: nem tudo o que fica no caminho está preso.', 'Diante da porta, no fim do caminho: uma laje ou uma pedra saiu do lugar.'] },
      'pilar-do-portao': { achado: 'Uma pedra do pilar estava solta. Atrás dela havia uma coisa pequena e fria.',
        busca: ['Onde o terreno começa, antes da porta: nem toda pedra está presa.', 'Na entrada: o pilar do portão ou a pedra solta do caminho.'] },
      'moita-do-caminho': { achado: 'Entre as folhas, rente à terra, havia uma coisa pequena e fria.',
        busca: ['Nem tudo o que cresce no caminho é só planta.', 'Perto da entrada: a moita junto ao caminho ou o pilar do portão.'] }
    },
    evidencia: 'chave-exterior',
    fecho: 'O telhado se soltou. Debaixo dele havia um andar de quartos.'
  },
  {
    id: 'quartos',
    nome: 'O andar dos quartos',
    camada: 'piso-2',
    chaveiro: 'conhecimento',
    fechadura: 'fechadura-chamine',
    fechaduraRotulo: 'O peito da chaminé, no corredor dos quartos',
    esconderijo: 'armario-do-quarto-distante',
    recorte: 'No andar que o telhado descobriu.',
    candidatos: ['armario-do-quarto-distante', 'castical-do-quarto-distante', 'armario-do-quarto-vizinho', 'castical-do-quarto-vizinho'],
    rotulos: {
      'armario-do-quarto-distante': 'O armário do quarto mais distante da torre',
      'castical-do-quarto-distante': 'O castiçal do quarto mais distante da torre',
      'armario-do-quarto-vizinho': 'O armário do quarto ao lado',
      'castical-do-quarto-vizinho': 'O castiçal do quarto ao lado'
    },
    achado: {
      chave: 'O armário tinha fundo falso. O que caiu lá dentro não era roupa.',
      fechadura: 'Um tijolo da chaminé está oco. Atrás dele, um vão de metal.'
    },
    dicas: {
      busca: {
        chave: ['Os quartos guardam roupa — e às vezes outra coisa atrás dela.', 'No quarto mais longe da torre: o armário ou o castiçal.'],
        fechadura: ['O que aquece a casa sobe por dentro das paredes.', 'A chaminé atravessa o corredor dos quartos: procure o peito dela.']
      },
      encaixe: {
        chave: ['O vão está numa coisa que sobe por dentro da casa inteira.', 'O vão fica no peito da chaminé, no corredor entre os quartos.'],
        fechadura: ['Descreva ao colega o caminho até o vão, cômodo por cômodo.', 'Diga: “na chaminé, no corredor dos quartos”.']
      }
    },
    porEsconderijo: {
      'armario-do-quarto-distante': { achado: 'O armário tinha fundo falso. O que caiu lá dentro não era roupa.',
        busca: ['Os quartos guardam roupa — e às vezes outra coisa atrás dela.', 'No quarto mais longe da torre: o armário ou o castiçal.'] },
      'castical-do-quarto-distante': { achado: 'O castiçal tinha a base oca. O que estava lá dentro não era vela.',
        busca: ['Nos quartos, o que ilumina também guarda.', 'No quarto mais longe da torre: o castiçal ou o armário.'] },
      'armario-do-quarto-vizinho': { achado: 'O armário tinha fundo falso. O que caiu lá dentro não era roupa.',
        busca: ['Os quartos guardam roupa — e às vezes outra coisa atrás dela.', 'No quarto ao lado: o armário ou o castiçal.'] },
      'castical-do-quarto-vizinho': { achado: 'O castiçal tinha a base oca. O que estava lá dentro não era vela.',
        busca: ['Nos quartos, o que ilumina também guarda.', 'No quarto ao lado: o castiçal ou o armário.'] }
    },
    evidencia: 'chave-dos-quartos',
    /* SUBSTITUIDO (03/10): '... a sala, a biblioteca, o escritório, a cozinha e o quarto de serviço.' — a casa de 01/10 não tem escritório. */
    fecho: 'O andar dos quartos saiu inteiro. Embaixo está o térreo: a sala, a biblioteca, a cozinha e o quarto de serviço.'
  },
  {
    id: 'terreo',
    nome: 'O térreo',
    camada: 'piso-1',
    chaveiro: 'luz',
    fechadura: 'fechadura-lareira',
    fechaduraRotulo: 'O peito da chaminé, na sala',
    esconderijo: 'relogio-caixa-alta',
    recorte: 'No térreo.',
    /* 11/10/2026: a escrivaninha fica no andar de cima (sala de mapas), que já saiu quando este
       capítulo começa; o candidato passou a ser a estante da biblioteca. */
    candidatos: ['relogio-caixa-alta', 'estante-da-biblioteca', 'quadro', 'espelho'],
    rotulos: {
      'relogio-caixa-alta': 'O relógio de caixa alta',
      'estante-da-biblioteca': 'A estante da biblioteca',
      'quadro': 'O quadro emoldurado',
      'espelho': 'O espelho na parede'
    },
    achado: {
      chave: 'Em cima do relógio de caixa alta, atrás do remate, havia outra coisa.',
      fechadura: 'No peito da chaminé da sala, uma placa de ferro com um vão estreito.'
    },
    dicas: {
      busca: {
        chave: ['Na sala, olhe o que é mais alto que todos.', 'O relógio de caixa alta ou o quadro ao lado dele.'],
        fechadura: ['A chaminé desce até o térreo.', 'Na sala, o peito da chaminé tem uma placa de ferro.']
      },
      encaixe: {
        chave: ['O vão está na mesma sala do esconderijo.', 'O vão fica no peito da chaminé da sala.'],
        fechadura: ['Diga ao colega em que parede da sala está o vão.', 'Diga: “no peito da chaminé, na sala”.']
      }
    },
    porEsconderijo: {
      'relogio-caixa-alta': { achado: 'Em cima do relógio de caixa alta, atrás do remate, havia outra coisa.',
        busca: ['Na sala, olhe o que é mais alto que todos.', 'O relógio de caixa alta ou o quadro ao lado dele.'] },
      'estante-da-biblioteca': { achado: 'Atrás de uma fileira de livros da estante havia outra coisa.',
        busca: ['Na biblioteca, nem todo livro está ali para ser lido.', 'A estante da biblioteca ou o relógio de caixa alta.'] },
      'quadro': { achado: 'Presa em cima da moldura do quadro havia outra coisa.',
        busca: ['Na sala, uma moldura guarda mais do que a pintura.', 'O quadro ou o relógio de caixa alta, na sala.'] },
      'espelho': { achado: 'Presa em cima da moldura do espelho havia outra coisa.',
        /* SUBSTITUIDO 03/10: [..., 'O espelho da sala ou a escrivaninha do escritório.'] */
        busca: ['Na sala, uma coisa devolve a sala a quem olha.', 'O espelho da sala ou a estante da biblioteca.'] }
    },
    evidencia: 'passagem-sob-despensa',
    fecho: 'O térreo se ergueu. A casa inteira está aberta, do telhado ao porão.'
  }
];

/* Pontos por chave: 8 se a camada abrir no primeiro minuto, depois perde 1 a
   cada 15 s, nunca menos de 3 — e ZERO para a camada que o tempo total da
   maquete (ac-ritmo.js) alcançar antes. Engano não custa ponto: sem marcas na
   maquete, tocar no que não é faz parte de procurar; o que custa é o tempo
   (Mario, 18/09/2026: "é a corrida que vale pelos pontos"). Vinte e quatro é o
   teto. */
export const PONTOS_POR_CHAVE = RITMO.maquete.max;
export const PISO_POR_CHAVE = RITMO.maquete.min;
export const PRAZO_MAQUETE_MS = RITMO.maquete.total * 1000;
/* Dois toques do MESMO jogador em menos disto contam como um. Por jogador:
   os dois procuram ao mesmo tempo, e uma trava única engolia o toque do
   segundo sem dizer nada. */
export const INTERVALO_ENTRE_TOQUES = 700;
/* A primeira camada começa a contar com a caixa ainda fechada — cada um
   precisa pôr a maquete na mesa antes. Meio minuto de folga, só nela. */
export const FOLGA_DA_PRIMEIRA_S = 30;
function segundosDaCamada(state, now) {
  const t = Math.max(0, (now - (Number.isFinite(state.layerAt) ? state.layerAt : now)) / 1000);
  return state.level === 0 ? Math.max(0, t - FOLGA_DA_PRIMEIRA_S) : t;
}

export function startMaquette(now = Date.now()) {
  return { level: 0, key: false, lock: false, mistakes: 0, score: 0, evidence: [], lastAttempt: {},
    startedAt: now, layerAt: now, bothAt: null, expired: false, layerScores: [] };
}

/* Estado salvo antes dos relógios (checkpoint do Solo): ganha relógio agora. */
function comRelogio(state, now) {
  if (!Number.isFinite(state.startedAt)) state.startedAt = now;
  if (!Number.isFinite(state.layerAt)) state.layerAt = now;
  if (state.key && state.lock && !Number.isFinite(state.bothAt)) state.bothAt = now;
  if (!Array.isArray(state.layerScores)) state.layerScores = [];
  if (typeof state.expired !== 'boolean') state.expired = false;
  return state;
}

/* O relógio parou enquanto a partida esteve pausada: tudo anda junto. */
export function adiarMaquete(state, ms) {
  if (!state || !(ms > 0)) return;
  for (const k of ['startedAt', 'layerAt', 'bothAt']) if (Number.isFinite(state[k])) state[k] += ms;
}

/* Quem NÃO tem a chave no capítulo tem a fechadura. Dois papéis, sempre. */
export function papelDaFechadura(capitulo) {
  return capitulo.chaveiro === 'luz' ? 'conhecimento' : 'luz';
}

/* O que cada lado vasculha. Quem tem a chave procura entre os esconderijos;
   quem tem a fechadura, entre os mesmos pontos E a fechadura — os
   esconderijos são, no aparelho dele, só lugares vazios. A fechadura nunca
   entra na lista de quem tem a chave: no aparelho dele ela não existe. */
export function pontosDoLado(capitulo, lado) {
  const pontos = capitulo.candidatos.slice();
  if (lado === 'fechadura') pontos.push(capitulo.fechadura);
  return pontos;
}

export function actMaquette(state, role, event, now = Date.now()) {
  if (!state || state.level >= CAPITULOS.length) return false;
comRelogio(state, now); if (event.type !== 'maquete_prazo' && now - state.startedAt >= PRAZO_MAQUETE_MS) return false;

  /* O tempo total acabou: as camadas que faltavam se abrem sozinhas, sem
     ponto. Qualquer um dos dois pode avisar; o motor confere o relógio. */
  if (event.type === 'maquete_prazo') {
    if (now - state.startedAt < PRAZO_MAQUETE_MS) return false;
    while (state.level < CAPITULOS.length) {
      state.evidence.push(CAPITULOS[state.level].evidencia);
      state.layerScores.push(0);
      state.level++;
    }
    state.key = false; state.lock = false; state.bothAt = null; state.expired = true;
    return true;
  }

  const capitulo = CAPITULOS[state.level];
  const lado = role === capitulo.chaveiro ? 'chave' : 'fechadura';
  if (!state.lastAttempt || typeof state.lastAttempt !== 'object') state.lastAttempt = {};

  if (event.type === 'maquete_examinar') {
    if (typeof event.object !== 'string' || event.object.length > 40) return false;
    if (lado === 'chave' ? state.key : state.lock) return false;
    if (!pontosDoLado(capitulo, lado).includes(event.object)) return false;
    if (now - (state.lastAttempt[role] || 0) < INTERVALO_ENTRE_TOQUES) return false;
    state.lastAttempt[role] = now;
    if (lado === 'chave' && event.object === capitulo.esconderijo) state.key = true;
    else if (lado === 'fechadura' && event.object === capitulo.fechadura) state.lock = true;
    else state.mistakes++;
    if (state.key && state.lock && !Number.isFinite(state.bothAt)) state.bothAt = now;
    return true;
  }

  if (event.type === 'maquete_encaixar') {
    if (lado !== 'chave' || !state.key || !state.lock) return false;
    const pontos = RITMO.pontos('maquete', segundosDaCamada(state, now), Infinity);
    state.score += pontos;
    state.layerScores.push(pontos);
    state.evidence.push(capitulo.evidencia);
    state.level++;
    state.key = false;
    state.lock = false;
    state.mistakes = 0;
    state.lastAttempt = {};
    state.layerAt = now;
    state.bothAt = null;
    return true;
  }

  return false;
}

/* O relógio e a dica de quem olha. A dica da PROCURA conta desde o começo da
   camada; a do ENCAIXE, desde que os dois acharam. */
function tempoDaVista(state, capitulo, lado, now) {
  const total = RITMO.maquete.total;
  const decorrido = Math.max(0, (now - (Number.isFinite(state.startedAt) ? state.startedAt : now)) / 1000);
  const camada = segundosDaCamada(state, now);
  const ambos = !!(state.key && state.lock);
  const parte = ambos ? 'encaixe' : 'busca';
  const desde = ambos && Number.isFinite(state.bothAt) ? Math.max(0, (now - state.bothAt) / 1000) : camada;
  const nivel = RITMO.nivelDaDica(desde, parte === 'busca' ? RITMO.maquete.dicasBusca : RITMO.maquete.dicasEncaixe);
  const textos = ((capitulo.dicas || {})[parte] || {})[lado === 'fechadura' ? 'fechadura' : 'chave'] || [];
  return {
    tempo: { total, decorrido, restante: Math.max(0, total - decorrido), camada, esgotado: decorrido >= total },
    dica: { nivel, parte, texto: nivel ? textos[nivel - 1] || null : null, textos: textos.slice(0, nivel) },
    pontosAgora: decorrido >= total ? 0 : RITMO.pontos('maquete', camada, Infinity)
  };
}

/* O que cada aparelho recebe. O que não está aqui não existe para aquele
   jogador: quem tem a chave nunca recebe o identificador da fechadura, e quem
   tem a fechadura só a recebe ACESA depois de achá-la. */
export function maquetteView(state, role, now = Date.now()) {
  if (!state) return null;
  const capitulo = CAPITULOS[state.level];
  if (!capitulo) {
    return { ...state, complete: true, layerScores: (state.layerScores || []).slice(), expired: !!state.expired,
      tempo: null, dica: { nivel: 0, parte: null, texto: null, textos: [] }, pontosAgora: 0, name: 'A passagem revelada', chaveiro: null, papel: null,
      capitulo: null, pista: null, ato: null, achou: false, achado: null, alvos: [], fechadura: null,
      candidatos: [], rotulos: {}, camadasAbertas: CAPITULOS.map(c => c.camada) };
  }
  const lado = role === capitulo.chaveiro ? 'chave' : 'fechadura';
  const ambos = !!(state.key && state.lock);
  const achou = lado === 'chave' ? !!state.key : !!state.lock;
  const alvos = pontosDoLado(capitulo, lado);
  const rotulos = { ...capitulo.rotulos };
  if (lado === 'fechadura') rotulos[capitulo.fechadura] = capitulo.fechaduraRotulo;
  return {
    level: state.level,
    key: !!state.key,
    lock: !!state.lock,
    mistakes: state.mistakes,
    score: state.score,
    evidence: state.evidence.slice(),
    complete: false,
    capitulo: capitulo.id,
    name: capitulo.nome,
    chaveiro: capitulo.chaveiro,
    papel: lado,
    /* A pista é a MESMA nos dois aparelhos. */
    pista: ambos ? SEGUNDA_PISTA : capitulo.recorte,
    ato: ambos ? 2 : 1,
    achou,
    achado: achou ? capitulo.achado[lado] : null,
    alvos,
    candidatos: alvos,
    rotulos,
    fechadura: lado === 'fechadura' && state.lock ? capitulo.fechadura : null,
    camadasAbertas: CAPITULOS.slice(0, state.level).map(c => c.camada),
    layerScores: (state.layerScores || []).slice(),
    expired: !!state.expired,
    fechaduraRotulo: lado === 'fechadura' ? capitulo.fechaduraRotulo : null,
    ...tempoDaVista(state, capitulo, lado, now)
  };
}

/* O Solo joga com um PARCEIRO AUTOMÁTICO (Mario, 18/09/2026: "avalie se não
   é melhor colocar uma forma de jogo automático só para preencher a vaga").
   Quem joga sozinho fica sempre com a CHAVE — procura o esconderijo e leva a
   chave; o parceiro fica com a fechadura, acha a dele e guia pela voz (frases
   na tela). É a mesma vista da Mesa, do lado de quem tem a chave. */
export function papelDoSolo(state) {
  const capitulo = state && CAPITULOS[state.level];
  return capitulo ? capitulo.chaveiro : 'luz';
}
export function maquetteViewSolo(state, now = Date.now()) {
  if (!state) return null;
  return maquetteView(state, papelDoSolo(state), now);
}

/* A lista de objetos por nome (a alternativa a tocar na cena) nasceria com a
   verdade sempre em cima, porque o esconderijo é o primeiro item do capítulo.
   Aqui ela é sorteada por partida — nunca reordenada à mão no arquivo.
   Ver a lição repetida do MOSAICO: sortear na hora de mostrar. */
export function ordemDosAlvos(lista, capituloId, semente) {
  lista = lista.slice();
  let h = 2166136261 >>> 0;
  const texto = String(semente == null ? '' : semente) + '|' + capituloId;
  for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  return lista;
}
export function ordemDosCandidatos(capitulo, semente) {
  return ordemDosAlvos(capitulo.candidatos, capitulo.id, semente);
}
