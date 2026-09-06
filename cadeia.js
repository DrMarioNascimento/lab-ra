/* Lab RA — a cadeia de três telas.
   ==========================================================================

   A escrivaninha, a janela e a parede são três páginas porque são três
   lugares: uma mesa que se roda, um vidro que se limpa e um quarto onde se
   está dentro. Tentar as três no mesmo motor seria escolher o pior de cada um
   — `model-viewer` posiciona coisas, ele não põe ninguém dentro de um lugar.

   O QUE VIAJA ENTRE ELAS É A SEMENTE, e não a resposta. `?s=` diz de que
   partida isto é; o que já foi descoberto fica no sessionStorage deste
   navegador, sob essa semente. Passar a resposta na URL seria publicá-la na
   barra de endereço — e a barra de endereço é a primeira coisa que um jogador
   curioso lê. */
const P = new URLSearchParams(location.search);

export const SEMENTE = (P.get("s") || "LAB").toUpperCase();
export const DEV = P.get("dev") === "1";

const CHAVE = "dragon.cadeia." + SEMENTE;

export function estado() {
  try { return JSON.parse(sessionStorage.getItem(CHAVE)) || {}; }
  catch (e) { return {}; }
}
export function marca(campo, valor = true) {
  const e = estado();
  e[campo] = valor;
  try { sessionStorage.setItem(CHAVE, JSON.stringify(e)); } catch (err) {}
}
export function esquece() {
  try { sessionStorage.removeItem(CHAVE); } catch (e) {}
}

/* Ir para a próxima tela levando semente e modo. Em `dev` nada tranca: é
   bancada, e bancada em que só se entra pela ordem certa custa dez minutos por
   teste de uma coisa que fica no fim. */
export function vai(pagina) {
  location.href = pagina + "?s=" + encodeURIComponent(SEMENTE) + (DEV ? "&dev=1" : "");
}

/* A porta de cada tela: quem chega sem ter passado pela anterior é mandado de
   volta, a não ser em dev. */
export function exige(campo, anterior) {
  if (DEV || estado()[campo]) return true;
  vai(anterior);
  return false;
}

/* Os números da cadeia, num lugar só. Estão no código-fonte, e isso é honesto
   enquanto for bancada: puzzle resolvido no navegador tem a resposta no
   navegador, sempre — o que dá para evitar é a barra de endereço, e é o que se
   evita acima. Numa atividade de verdade a conferência muda de lado: vai para
   as Regras do Firestore, como já acontece nas salas. */
export const FRASE = "se você der cinco passos mais altos você estará mais perto do céu, e o céu te mostrará o caminho";
export const HORA = { h: 21, m: 29 };
export const GRAU = 26;          /* o quinto degrau */
export const AZIMUTE = 214;      /* onde o farol fica, a sudoeste */
export const ALTURA_OLHOS = 1.55;
