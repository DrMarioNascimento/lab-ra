/* ============================================================================
   TESTE 11 — CORAÇÃO EM AÇÃO: DO IMPULSO ELÉTRICO AO BOMBEAMENTO (Unidade IV)
   O motor. Sem DOM, sem three.js — é ele que os testes conferem.

   ── A DECISÃO QUE SUSTENTA A BANCADA INTEIRA ──────────────────────────────
   AS VÁLVULAS NÃO SÃO ANIMADAS. Elas obedecem às pressões: a mitral está
   aberta quando o átrio tem mais pressão que o ventrículo, e a aórtica quando
   o ventrículo tem mais que a aorta. Ponto.

   Isso não é preciosismo — é o que separa esta bancada de um desenho animado.
   O pedido é sincronizar TRÊS leituras num relógio só (condução elétrica,
   válvulas e fluxo). Se eu roteirizasse a abertura das válvulas por tempo, a
   sincronia seria ENCENAÇÃO: três animações combinadas por mim. Derivando da
   pressão, ela é CONSEQUÊNCIA, e as duas fases isovolumétricas — que são o
   assunto mais difícil do ciclo — aparecem sozinhas, sem ninguém as escrever.
   Quem quiser conferir, feche a aórtica e veja a fase isovolumétrica crescer.

   ── COMO O CICLO É CALCULADO ──────────────────────────────────────────────
   Modelo de ELASTÂNCIA VARIÁVEL, que é o modelo padrão da mecânica cardíaca:

     P(t) = E(t) · (V(t) − V0)

   O músculo não gera pressão: gera RIGIDEZ. E(t) vai de mole (diástole) a
   duro (sístole), e a pressão que aparece depende de quanto sangue está lá
   dentro. É por isso que um ventrículo vazio bate com pressão baixa, e é a
   base de Frank-Starling.

   O volume muda pelo que entra e sai pelas válvulas; com as duas fechadas
   ele não muda, e a fase isovolumétrica existe sem ter sido programada.

   A aorta é um WINDKESSEL: um tubo elástico que enche na sístole e devolve na
   diástole. É ele que faz a pressão arterial não cair a zero entre batimentos
   e é ele que produz a incisura dicrótica no fechamento da valva.

   ── A CONSEQUÊNCIA QUE O ALUNO PRECISA VER ────────────────────────────────
   Ao subir a frequência, A DIÁSTOLE ENCURTA MUITO MAIS QUE A SÍSTOLE. A
   sístole mecânica segue 0,35·√RR (Weissler); o resto é diástole. A 75 bpm a
   diástole tem 487 ms; a 180, sobra pouco mais de 100. Encher fica difícil —
   e a coronária esquerda, que só enche NA DIÁSTOLE, perde o tempo dela.
   ========================================================================== */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ── DURAÇÕES ─────────────────────────────────────────────────────────────
   A sístole mecânica encurta com a frequência, mas devagar: vai com a raiz do
   intervalo. É a fórmula de Weissler, e é ela que produz o achado. */
export function duracoes(fc) {
  const rr = 60 / fc;
  const sistole = Math.min(rr * .85, 0.35 * Math.sqrt(rr));
  return { rr, sistole, diastole: rr - sistole, fc };
}

/* ── A ATIVAÇÃO ───────────────────────────────────────────────────────────
   e(t) de 0 a 1: quanto o músculo está contraído. Sobe rápido e relaxa mais
   devagar, que é o formato da curva de força do miocárdio. Fora da sístole
   vale zero — e é isso que faz o ventrículo aceitar sangue sem resistir. */
function ativacao(t, dur) {
  if (t < 0 || t >= dur) return 0;
  const u = t / dur, S = P.subida, Pl = P.platô;
  /* TRÊS TRECHOS: sobe, FICA e desce.

     Sem o platô a curva desabava logo depois do pico, o ventrículo perdia
     pressão com pouco volume ejetado e a valva aórtica fechava aos 87 ms
     contra os 220 do livro. O afinador então engrossava a valva para segurar
     a ejeção — e isso não é valva normal, é ESTENOSE: o pico do ventrículo
     ia a 253 mmHg contra a aorta em 120. Quem sustenta a ejeção é o músculo
     continuar contraído, não o furo apertar.

     Sobe íngreme (derivada máxima na origem), FICA no alto durante a ejeção,
     e desce devagar — contrair é rápido, relaxar é lento. */
  /* A SUBIDA TEM UM PÉ. Em seno puro ela arranca da origem com derivada
     máxima, o ventrículo alcança a pressão da aorta em 20 ms e a contração
     isovolumétrica fica com menos da metade dos 50 ms do livro — o modelo
     desenvolveria 3500 mmHg/s contra os 1600 do miocárdio. Em potência há um
     começo lento e depois a aceleração, que é o formato do cálcio subindo. */
  if (u < S) return Math.pow(u / S, 1.7);
  if (u < Pl) return 1;
  return .5 + .5 * Math.cos(Math.PI * (u - Pl) / (1 - Pl));
}

/* ── OS TEMPOS DA CONDUÇÃO ────────────────────────────────────────────────
   Em segundos desde o nó sinusal. Estes NÃO encolhem com a frequência do
   mesmo jeito que a diástole: o PR encurta um pouco, o QRS quase nada. É
   outra parte do achado — o que a taquicardia come é o tempo de encher, não
   o de conduzir. */
export const CONDUCAO = [
  { id: 'sinusal', nome: 'Nó sinusal', de: 0.000, ate: 0.015 },
  { id: 'atrios', nome: 'Átrios', de: 0.010, ate: 0.090 },
  { id: 'av', nome: 'Nó atrioventricular', de: 0.050, ate: 0.150 },
  { id: 'his', nome: 'Feixe de His', de: 0.150, ate: 0.170 },
  { id: 'ramos', nome: 'Ramos', de: 0.170, ate: 0.195 },
  { id: 'purkinje', nome: 'Purkinje', de: 0.195, ate: 0.215 },
  { id: 'ventriculos', nome: 'Ventrículos', de: 0.205, ate: 0.290 },
];
/* o atraso do nó AV é o item mais importante da lista: sem ele o átrio e o
   ventrículo bateriam juntos e o enchimento perderia a sístole atrial */
export const ATRASO_AV = 0.100;
/* o acoplamento eletromecânico: o músculo contrai um pouco DEPOIS de
   despolarizar, e é essa defasagem que a bancada existe para mostrar */
export const ATRASO_ELETROMECANICO = 0.030;

export function estruturaAtiva(t) {
  return CONDUCAO.filter(c => t >= c.de && t < c.ate).map(c => c.id);
}

/* ── O ELETROCARDIOGRAMA ──────────────────────────────────────────────────
   Soma de ondas, cada uma no seu tempo. Não é um traçado decorativo: as
   ondas caem exatamente onde a condução está passando, porque usam os mesmos
   tempos da tabela acima. */
const gauss = (t, centro, largura) => Math.exp(-Math.pow((t - centro) / largura, 2));
export function ecg(t) {
  const p = 0.13 * gauss(t, 0.050, 0.028);
  const q = -0.10 * gauss(t, 0.165, 0.010);
  const r = 1.00 * gauss(t, 0.190, 0.014);
  const s = -0.22 * gauss(t, 0.215, 0.013);
  const onda = 0.28 * gauss(t, 0.390, 0.052);
  return p + q + r + s + onda;
}

/* ── PARÂMETROS DO MODELO ─────────────────────────────────────────────────
   Calibrados contra o que o livro traz: 120/80 na aorta, VDF 120 ml, VSF 50,
   ejeção de 70 ml, fração de 58%, débito de 5,2 L/min a 75 bpm. */
export const P = {
  /* ESTES NÚMEROS NÃO FORAM ESCOLHIDOS: FORAM AFINADOS contra os alvos do
     livro por um laço que ajusta um parâmetro por vez e mede o resultado.
     A primeira tentativa, com valores "razoáveis" tirados de cabeça, dava
     155/99 de pressão, VDF 172 e débito 7,4 L/min — plausível na tela e
     errado em tudo. O afinado devolve 120/80, VDF 120, VSF 50, ejeção 70 ml,
     fração 58% e 5,25 L/min a 75 bpm, que é a página inteira do Guyton. */
  emaxVE: 2.946,     // mmHg/ml, elastância máxima do ventrículo esquerdo
  eminVE: 0.0625,    // mmHg/ml, na diástole
  v0VE: 12,          // ml, volume sem pressão
  emaxVD: 0.68, eminVD: 0.032, v0VD: 12,
  /* A MITRAL PRECISA DE RESISTÊNCIA DE VERDADE. Com ela quase nula o
     ventrículo EQUILIBRA com o átrio e enche até 172 ml: o enchimento real é
     limitado por FLUXO, não por equilíbrio, e é por isso que encurtar a
     diástole prejudica encher. Sem resistência, taquicardia não faria mal
     nenhum ao volume — e faz. */
  rMitral: 0.020,    // mmHg·s/ml
  rAortica: 0.005,   // valva normal quase não tem gradiente
  rTricuspide: 0.018,
  rPulmonar: 0.004,
  cArterial: 1.520,  // ml/mmHg, complacência da aorta
  rPeriferica: 1.140,// mmHg·s/ml
  cPulmonar: 4.2, rPulmonarTotal: 0.16,
  /* O ÁTRIO É CÂMARA, NÃO NÚMERO. Ele era uma pressão fixa mais uma onda, e
     isso quebrava em frequência baixa: cheio, o ventrículo ficava com pressão
     ACIMA do átrio parado, a mitral fechava logo depois da sístole atrial e a
     "contração isovolumétrica" media 185 ms a 50 bpm — quase quatro vezes o
     valor real. Com a mesma lei de elastância dos ventrículos os dois se
     equilibram na diástase, a valva só fecha quando o ventrículo contrai, e
     as ondas a, c e v aparecem sozinhas. */
  /* A ELASTÂNCIA DIASTÓLICA DO ÁTRIO É CRÍTICA, e por um fio. Com 0,088 a
     pressão atrial caía 0,3 mmHg ABAIXO da do ventrículo cheio logo depois da
     sístole atrial: a mitral fechava aos 94 ms, o ventrículo só contrai aos
     235, e sobravam 193 ms de válvulas fechadas SEM contração nenhuma — uma
     fase isovolumétrica fantasma de quase 200 ms. Com o átrio um pouco mais
     firme ele se mantém acima do ventrículo até a contração começar, que é
     quando a mitral tem de fechar de verdade: é esse fechamento que faz a
     primeira bulha. */
  emaxAE: 0.300, eminAE: 0.130, v0AE: 12,
  emaxAD: 0.215, eminAD: 0.094, v0AD: 12,
  pVeiasPulmonares: 10,   // mmHg, o reservatório que enche o átrio esquerdo
  pVeiasSistemicas: 5,
  rVeiasPulmonares: 0.020,
  rVeiasSistemicas: 0.022,
  duracaoAtrial: 0.10,
  /* A VALVA TEM INÉRCIA. Comparar as pressões cruas faz a mitral TREMER na
     diástase: os dois lados ficam a 0,1 mmHg um do outro e ela abre e fecha
     dezenas de vezes, criando uma "fase isovolumétrica" de 87 ms que não
     existe. Folheto tem massa e o sangue tem quantidade de movimento: é
     preciso um empurrão mínimo para mover, e o estado se mantém enquanto o
     gradiente não vira de verdade. */
  limiarValva: 0.20,   // mmHg
  /* fração da sístole em que a ativação sobe. Ela é o relógio da CONTRAÇÃO
     ISOVOLUMÉTRICA: quanto mais íngreme, mais depressa o ventrículo alcança
     a pressão da aorta e menos tempo fica de válvulas fechadas. */
  subida: 0.382,
  /* onde a ativação começa a cair. É ele o relógio da EJEÇÃO. */
  platô: 0.864,
};

/* ── O CICLO ──────────────────────────────────────────────────────────────
   Integra um ciclo em passos pequenos. Roda alguns ciclos antes de guardar,
   porque o windkessel precisa de algumas voltas para chegar ao regime — sem
   isso a primeira diástole começa com a aorta vazia e a pressão sai errada. */
export function simular(fc, { passos = 900, ciclos = 14 } = {}) {
  const d = duracoes(fc);
  const dt = d.rr / passos;
  let vVE = 120, vVD = 120, pAo = 80, pAP = 15, vAE = 55, vAD = 55;
  let mitral = true, aortica = false, tricuspide = true, pulmonar = false;
  const decide = (aberta, gradiente) =>
    gradiente > P.limiarValva ? true : gradiente < -P.limiarValva ? false : aberta;

  const quadro = [];
  for (let ciclo = 0; ciclo < ciclos; ciclo++) {
    const guardar = ciclo === ciclos - 1;
    if (guardar) quadro.length = 0;
    for (let i = 0; i < passos; i++) {
      const t = i * dt;

      /* o átrio contrai ANTES do ventrículo, e é esse desencontro que dá o
         empurrão final do enchimento — a sístole atrial */
      const aAtrio = ativacao(t, P.duracaoAtrial);
      const eAE = P.eminAE + (P.emaxAE - P.eminAE) * aAtrio;
      const eAD = P.eminAD + (P.emaxAD - P.eminAD) * aAtrio;
      const pAE = eAE * (vAE - P.v0AE);
      const pAD = eAD * (vAD - P.v0AD);

      /* o ventrículo contrai depois do QRS, com o atraso eletromecânico */
      const tv = t - (CONDUCAO.find(c => c.id === 'ventriculos').de + ATRASO_ELETROMECANICO);
      const aVent = ativacao(tv, d.sistole);
      const eVE = P.eminVE + (P.emaxVE - P.eminVE) * aVent;
      const eVD = P.eminVD + (P.emaxVD - P.eminVD) * aVent;

      const pVE = eVE * (vVE - P.v0VE);
      const pVD = eVD * (vVD - P.v0VD);

      /* AS VÁLVULAS SÃO COMPARAÇÕES, NÃO UM ROTEIRO — com a folga da inércia
         do folheto, que é o que impede o tremor numérico na diástase. */
      mitral = decide(mitral, pAE - pVE);
      aortica = decide(aortica, pVE - pAo);
      tricuspide = decide(tricuspide, pAD - pVD);
      pulmonar = decide(pulmonar, pVD - pAP);

      const qMitral = mitral ? (pAE - pVE) / P.rMitral : 0;
      const qAortica = aortica ? (pVE - pAo) / P.rAortica : 0;
      const qTri = tricuspide ? (pAD - pVD) / P.rTricuspide : 0;
      const qPulm = pulmonar ? (pVD - pAP) / P.rPulmonar : 0;
      /* as veias enchem o átrio o tempo todo, inclusive com a valva fechada —
         é isso que produz a onda v durante a sístole ventricular */
      const qVeiasP = (P.pVeiasPulmonares - pAE) / P.rVeiasPulmonares;
      const qVeiasS = (P.pVeiasSistemicas - pAD) / P.rVeiasSistemicas;

      if (guardar) {
        quadro.push({ t, fase: t / d.rr, pVE, pAo, pAE, pVD, pAP, pAD,
                      vVE, vVD, vAE, vAD, mitral, aortica, tricuspide, pulmonar,
                      qMitral, qAortica, ecg: ecg(t), ativacao: aVent, ativacaoAtrio: aAtrio });
      }

      vVE += (qMitral - qAortica) * dt;
      vVD += (qTri - qPulm) * dt;
      vAE += (qVeiasP - qMitral) * dt;
      vAD += (qVeiasS - qTri) * dt;
      /* windkessel: o que entra menos o que escoa pela periferia */
      pAo += (qAortica - pAo / P.rPeriferica) / P.cArterial * dt;
      pAP += (qPulm - (pAP - 5) / P.rPulmonarTotal) / P.cPulmonar * dt;
    }
  }

  const vs = quadro.map(q => q.vVE);
  const vdf = Math.max(...vs), vsf = Math.min(...vs);
  const pAos = quadro.map(q => q.pAo);
  const pAEs = quadro.map(q => q.pAE);
  return {
    quadro, duracoes: d,
    vdf, vsf,
    ejecao: vdf - vsf,
    fracao: (vdf - vsf) / vdf,
    debito: (vdf - vsf) * fc / 1000,          // L/min
    sistolica: Math.max(...pAos),
    diastolica: Math.min(...pAos),
    picoVE: Math.max(...quadro.map(q => q.pVE)),
    atrioMax: Math.max(...pAEs), atrioMin: Math.min(...pAEs),
  };
}

/* Lê o ciclo num instante, interpolando o quadro guardado. */
export function em(sim, fase) {
  const n = sim.quadro.length;
  const f = ((fase % 1) + 1) % 1;
  return sim.quadro[Math.min(n - 1, Math.floor(f * n))];
}

/* ── AS SEIS FASES, DERIVADAS DAS VÁLVULAS ───────────────────────────────
   Nenhuma delas é declarada por tempo: cada uma é uma combinação de válvulas
   abertas e fechadas, e é por isso que elas mudam sozinhas de duração quando
   a frequência muda. */
export function faseDe(q, anterior) {
  if (q.aortica) return 'ejecao';
  if (q.mitral) return q.ativacaoAtrio > .15 ? 'sistole atrial' : 'enchimento';
  /* AS DUAS FECHADAS: isovolumétrica. Qual delas, decide o SINAL DA VARIAÇÃO
     DE PRESSÃO — subindo é contração, caindo é relaxamento.

     Eu separava as duas pelo nível de ativação, e estava errado: na relaxação
     isovolumétrica a ativação ainda está alta, porque relaxar é lento. O
     relógio dizia 170 ms de contração isovolumétrica contra os ~50 do livro,
     e o motor não tinha culpa nenhuma — quem media errado era eu. */
  /* SEM CONTRAÇÃO NENHUMA, não é fase isovolumétrica: é DIÁSTASE, o fim
     tranquilo da diástole. Depois da sístole atrial a pressão do átrio cai — a
     descida x — e a valva começa a derivar para fechada antes de o ventrículo
     contrair. Isso é fisiologia, não defeito do modelo; quem estava errado era
     eu, chamando de "contração isovolumétrica" um trecho em que nada contrai.
     Foram três diagnósticos até entender que o motor estava certo e a régua
     torta. */
  if (q.ativacao <= 0.002) return 'diastase';
  if (!anterior) return 'contracao isovolumetrica';
  return q.pVE >= anterior.pVE ? 'contracao isovolumetrica' : 'relaxamento isovolumetrico';
}

export function tempoPorFase(sim) {
  const conta = {};
  const dt = sim.duracoes.rr / sim.quadro.length;
  sim.quadro.forEach((q, i) => {
    const f = faseDe(q, i ? sim.quadro[i - 1] : sim.quadro[sim.quadro.length - 1]);
    conta[f] = (conta[f] || 0) + dt;
  });
  return conta;
}

/* ── A CORONÁRIA ─────────────────────────────────────────────────────────
   A esquerda só enche na DIÁSTOLE: na sístole o próprio músculo aperta os
   vasos que o alimentam. Por isso o tempo diastólico não é curiosidade — é
   o tempo de perfusão do coração, e é o primeiro a sumir na taquicardia. */
export function tempoDiastolicoPorMinuto(fc) {
  return duracoes(fc).diastole * fc;      // segundos de diástole por minuto
}
