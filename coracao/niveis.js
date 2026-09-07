/* ============================================================================
   TESTE 11 — o que cada nível MOSTRA. Sem three.js, sem DOM: a tabela que
   amarra o nome do nível ao que a cena realmente constrói.

   O defeito que isto impede: o nível 03 se chamava "As válvulas" e montava
   o coração INTEIRO, sem corte, sem transparência, com a câmera no mesmo
   enquadramento dos outros quatro. As cúspides ficavam a y≈53–60, raio
   10–15 mm, engolidas pelo miocárdio (raio externo ~35 mm). Quem lia o
   rótulo via "válvulas"; quem olhava a cena via parede.

   `nivelRevelaValvas(i)` é a régua: o nome promete válvulas só se a config
   as expõe de verdade (as tem, E corta / torna o músculo transparente /
   enquadra o plano valvar). No nível das válvulas os grandes vasos entram
   no mesmo vidro — aorta e tronco opacos tapavam as cúspides por cima.
   ========================================================================== */

/* ── PLANO VALVAR (1 unidade = 1 mm, y = 0 na ponta do VE) ───────────────
   O cone do VE chega a ALTURA_VE; as valvas viviam em y≈53–60, 18–25 mm
   abaixo da junção, e o miocárdio cobria cúspides e átrios. O nível 03
   só funcionava no vidro. SUBIR_PLANO sobe anéis, átrios e a origem dos
   vasos até o teto da massa ventricular — o vidro deixa de ser muleta.

   Banda nova (coordenadas locais do corpo, antes da inclinação):
     teto VE          78
     teto VD          76   (ALTURA_VD + VD_Y) — encontra a pulmonar
     mitral           74
     tricúspide       71
     aórtica          78   (via de saída, no teto do VE)
     pulmonar         76   (via de saída, no teto do VD)
   Tolerância do teste: |y_anel − y_teto do ventrículo| ≤ 8 mm. */
export const ALTURA_VE = 78;
export const ALTURA_VD = 73;
export const VD_Y = 3;
export const TOPO_VE = ALTURA_VE;
export const TOPO_VD = ALTURA_VD + VD_Y;
export const SUBIR_PLANO = 18;
export const TOLERANCIA_JUNCAO_MM = 8;
export const PLANO_VALVAR = {
  mitral:     [6,  56 + SUBIR_PLANO, -2],   // 74
  tricuspide: [-16, 53 + SUBIR_PLANO,  6],  // 71
  aortica:    [0,  60 + SUBIR_PLANO,  0],   // 78, no eixo do VE
  pulmonar:   [-13.4, 58 + SUBIR_PLANO, 9.4], // 76, no eixo do VD
};
export const VENTRICULO_DA_VALVA = {
  mitral: 've', tricuspide: 'vd', aortica: 've', pulmonar: 'vd',
};

export const NIVEIS = [
  {
    rotulo: 'O coração',
    comValvas: true,
    comCoronarias: true,
    comConducao: false,
    corte: false,
    revelarValvas: false,
    foco: 'inteiro',
    faseRA: null,
  },
  {
    rotulo: 'Por dentro',
    comValvas: true,
    /* as coronárias correm POR FORA e, com o cunho aberto, cruzavam a
       abertura como grades por cima da cavidade. Elas já têm o nível 01
       inteiro para si; aqui o assunto é o que há dentro. */
    comCoronarias: false,
    comConducao: false,
    corte: true,
    revelarValvas: false,
    foco: 'corte',
    faseRA: null,
  },
  {
    rotulo: 'As válvulas',
    comValvas: true,
    comCoronarias: false,
    comConducao: false,
    corte: true,
    revelarValvas: true,
    /* aorta e tronco pulmonar no mesmo vidro: opacos, sentam na frente
       das cúspides e o corte não as salva — não é ângulo, é oclusão */
    vidrarGrandesVasos: true,
    foco: 'valvas',
    /* diástole média: atrioventriculares abertas, semilunares fechadas —
       o par que o nível existe para ensinar, não um instante ao acaso */
    faseRA: 'enchimento',
  },
  {
    rotulo: 'A condução',
    comValvas: false,
    comCoronarias: false,
    comConducao: true,
    corte: false,
    revelarValvas: false,
    foco: 'inteiro',
    faseRA: null,
  },
  {
    rotulo: 'O ciclo',
    comValvas: true,
    comCoronarias: true,
    comConducao: true,
    corte: false,
    revelarValvas: false,
    foco: 'inteiro',
    faseRA: null,
  },
];

export function nivelRevelaValvas(i) {
  const n = NIVEIS[i];
  if (!n || n.comValvas === false) return false;
  return !!(n.corte || n.revelarValvas || n.foco === 'valvas');
}
