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
   enquadra o plano valvar).
   ========================================================================== */

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
    comCoronarias: true,
    comConducao: false,
    corte: true,
    revelarValvas: false,
    foco: 'inteiro',
    faseRA: null,
  },
  {
    rotulo: 'As válvulas',
    comValvas: true,
    comCoronarias: false,
    comConducao: false,
    corte: true,
    revelarValvas: true,
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
