/* ── O DIAGRAMA DE WIGGERS ────────────────────────────────────────────────
   Quatro faixas num eixo de tempo só: pressões, volume, traçado elétrico e as
   bulhas. O cursor é a MESMA `fase` que move o coração — é aqui que a
   sincronia deixa de ser promessa e vira coisa que se confere.

   ELE MORAVA DENTRO DA BANCADA ESQUEMÁTICA, e saiu porque a decisão do
   professor foi que as DUAS peças ensinam fisiologia: a esquemática e a
   anatômica. Copiar o desenho para a segunda página seria criar duas réguas
   para a mesma medida — e no dia em que uma fosse corrigida, a outra
   continuaria mentindo em silêncio. É o mesmo motivo pelo qual `fisica.js`
   sempre foi um módulo só: quem lê o ciclo em dois lugares tem de ler o
   MESMO ciclo.

   Nada aqui sabe de três.js nem de qual peça está na tela. Recebe um canvas,
   devolve uma função de desenho, e a função recebe a simulação e a fase. */
import { bulhas } from './fisica.js';

/* A MARGEM ERA DECLARADA DUAS VEZES — uma no desenho dos traços, outra no do
   cursor — e as duas tinham de bater, senão o cursor apontava para um
   instante que não era o de baixo dele. Agora é uma constante só, e o
   desencontro deixa de ser possível. */
const MARGEM = { e: 30, d: 8, t: 8, b: 14 };

const preso = (v, a, b) => Math.max(a, Math.min(b, v));
const emX = (f, W) => MARGEM.e + f * (W - MARGEM.e - MARGEM.d);

export function criarWiggers(canvas) {
  const tela = canvas.getContext('2d');
  const fundo = document.createElement('canvas');
  const pincel = fundo.getContext('2d');
  /* os traços só mudam quando o ciclo é recalculado; o cursor anda sozinho,
     e é por isso que arrastar a fase não custa um redesenho inteiro */
  let quadroNoFundo = null;

  function desenharTracos(sim) {
    const W = canvas.width, H = canvas.height;
    if (fundo.width !== W || fundo.height !== H) { fundo.width = W; fundo.height = H; }
    pincel.clearRect(0, 0, W, H);

    const faixa = (i, n) => {
      const alt = (H - MARGEM.t - MARGEM.b) / n;
      return { topo: MARGEM.t + i * alt, alt: alt - 6 };
    };
    const linha = (dados, y0, alt, min, max, tinta, largura = 1.8) => {
      pincel.beginPath();
      dados.forEach((v, i) => {
        const x = emX(i / (dados.length - 1), W);
        const y = y0 + alt - (preso(v, min, max) - min) / (max - min) * alt;
        i ? pincel.lineTo(x, y) : pincel.moveTo(x, y);
      });
      pincel.strokeStyle = tinta; pincel.lineWidth = largura; pincel.stroke();
    };
    const rotulo = (texto, y) => {
      pincel.fillStyle = '#7f9a80'; pincel.fillText(texto, 2, y + 9);
    };

    const q = sim.quadro;
    pincel.font = '9px "IBM Plex Mono", monospace';

    /* 1 · pressões: ventrículo, aorta e átrio no mesmo eixo — é o cruzamento
       delas que ABRE e FECHA as válvulas, e por isso têm de ficar juntas */
    let fx = faixa(0, 4);
    linha(q.map(x => x.pAo), fx.topo, fx.alt, 0, 140, '#c8363e');
    linha(q.map(x => x.pVE), fx.topo, fx.alt, 0, 140, '#f2f7ec', 2.1);
    linha(q.map(x => x.pAE), fx.topo, fx.alt, 0, 140, '#5fd177', 1.4);
    rotulo('mmHg', fx.topo);

    /* 2 · volume do ventrículo: os patamares são as fases isovolumétricas, e
       eles são o argumento visual de que as válvulas não foram roteirizadas */
    fx = faixa(1, 4);
    linha(q.map(x => x.vVE), fx.topo, fx.alt, 30, 140, '#f5c518', 2.1);
    rotulo('ml', fx.topo);

    /* 3 · o traçado elétrico */
    fx = faixa(2, 4);
    linha(q.map(x => x.ecg), fx.topo, fx.alt, -.35, 1.1, '#9fd8f2', 1.8);
    rotulo('ECG', fx.topo);

    /* 4 · as bulhas: a primeira no fechamento da mitral, a segunda no da
       aórtica. Elas não são desenhadas por tempo — são achadas percorrendo as
       válvulas, então caem sozinhas no lugar certo. O laço dá a volta: a 150
       bpm o B2 cai na emenda do ciclo. */
    fx = faixa(3, 4);
    rotulo('bulhas', fx.topo);
    for (const b of bulhas(q).todas) {
      const x = emX(b.fase, W);
      pincel.beginPath();
      pincel.moveTo(x, fx.topo + fx.alt); pincel.lineTo(x, fx.topo + 2);
      pincel.strokeStyle = '#ff9d2e'; pincel.lineWidth = 2; pincel.stroke();
      pincel.fillStyle = '#ff9d2e'; pincel.fillText(b.nome, x + 3, fx.topo + 9);
    }
    quadroNoFundo = q;
  }

  return function desenhar(sim, fase) {
    if (quadroNoFundo !== sim.quadro) desenharTracos(sim);
    const W = canvas.width, H = canvas.height;
    tela.clearRect(0, 0, W, H);
    tela.drawImage(fundo, 0, 0);
    const x = emX(((fase % 1) + 1) % 1, W);
    tela.beginPath();
    tela.moveTo(x, MARGEM.t); tela.lineTo(x, H - MARGEM.b);
    tela.strokeStyle = 'rgba(245,197,24,.85)'; tela.lineWidth = 1.5; tela.stroke();
  };
}
