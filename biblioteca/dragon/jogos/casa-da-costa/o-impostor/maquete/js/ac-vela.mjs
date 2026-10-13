/* A vela da escrivaninha — A Casa da Costa.

   Mesma lei da maquete: cada um tem METADE do aparelho. Quem põe a vela no
   castiçal acende a luz — e quem sai do escuro é o OUTRO. Depois de um tempo
   a vela apaga sozinha, como o farol d'A Janela do Norte, e os dois percebem
   que aquilo era alguma coisa. O fósforo está com o outro: ele risca, a vela
   volta, e o primeiro vê. Ninguém explicou nada.

   Puro, sem DOM: roda no servidor de ensaio, no replay do Firestore e no
   Solo. */

/* Quanto a vela queima antes de apagar. Longo o bastante para uma procura
   inteira sob as gavetas; curto o bastante para apagar pelo menos uma vez
   numa partida normal — é o apagar que ensina de quem é o fósforo. */
export const VELA_MS = 25000;

/* Em que estágio a vela existe acesa ou apagada. Antes do castiçal não há
   vela; depois da descoberta ela já cumpriu o papel e fica acesa. */
const QUEIMANDO = ['iluminar'];
const CUMPRIDA = ['encontrado', 'registrado'];

export function acenderVela(now) { return { ate: now + VELA_MS }; }

export function velaAcesa(vela, stage, now) {
  if (CUMPRIDA.includes(stage)) return true;
  if (!QUEIMANDO.includes(stage) || !vela) return false;
  return now < vela.ate;
}

export function vistaDaVela(vela, stage, now) {
  const existe = QUEIMANDO.includes(stage) || CUMPRIDA.includes(stage);
  const acesa = velaAcesa(vela, stage, now);
  return { existe, acesa, resta: acesa && vela && QUEIMANDO.includes(stage) ? Math.max(0, vela.ate - now) : 0 };
}

/* Só se reacende o que apagou. */
export function podeReacender(vela, stage, now) {
  return QUEIMANDO.includes(stage) && !!vela && now >= vela.ate;
}
