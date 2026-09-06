/* ============================================================================
   TESTE 09 — FORÇAS DE STARLING NA MICROCIRCULAÇÃO
   A física, separada da geometria e do painel de propósito: é ela que os
   testes conferem, e é ela que tem de poder ser lida sem abrir um navegador.

   O QUE ESTA BANCADA EXISTE PARA DESFAZER: o aluno decora "quatro forças" e
   guarda quatro números soltos. O que decide não é nenhum deles — é a SOMA,
   e a soma troca de sinal no meio do capilar. Por isso aqui nada é chumbado:
   os quatro valores entram, a soma sai, e o ponto onde ela cruza o zero se
   move sozinho quando se puxa qualquer alavanca.

   A EQUAÇÃO, e cada letra com o seu lugar:

     Jv = Kf · [ (Pc − Pi) − σ·(πc − πi) ]

   • Pc  pressão hidrostática do capilar: EMPURRA para fora. Cai ao longo do
         capilar, e é ela que a bancada 08 levanta quando alguém fica em pé.
   • Pi  pressão hidrostática do interstício: empurra de volta. Perto de zero,
         e ligeiramente NEGATIVA em tecido normal — o interstício é sugado.
   • πc  pressão oncótica do plasma: PUXA para dentro. É a albumina, e é a
         alavanca que encharca o interstício quando falta.
   • πi  pressão oncótica do interstício: puxa para fora. Pequena, porque o
         endotélio deixa passar pouca proteína.
   • σ   coeficiente de reflexão: o quanto a parede REALMENTE segura proteína.
         Vale 1 no capilar contínuo saudável, que é o caso do livro. Ele existe
         aqui porque a INFLAMAÇÃO o derruba — e sem σ não haveria como mostrar
         que a parede furada some com a força que puxa para dentro.
   ========================================================================== */

/* Os valores clássicos de capilar sistêmico, em mmHg — os de Guyton, porque
   são os que o aluno vai reencontrar no livro. A primeira escolha que fiz
   (35/15, onc 25/6, sigma 0,9) parecia razoável e REPROVOU no teste: dava
   +19,9 na ponta arteriolar contra os +13 do livro, e fazia tecido normal
   acumular 2,3 ml em meia hora. Tecido saudável não incha. */
export const PADRAO = {
  pcArterial: 30,     // ponta arteriolar
  pcVenular: 10,      // ponta venular
  pi: -3,             // interstício, subatmosférico em tecido normal
  oncPlasma: 28,      // albumina do plasma
  oncInter: 8,        // proteína que escapou para o interstício
  sigma: 1,
  kf: 0.02,           // ml/min por mmHg, no leito desenhado
};

/* A pressão hidrostática cai ao longo do capilar. Não é reta perfeita — o
   capilar não tem calibre constante —, mas a curvatura é pequena e a reta é
   a leitura que o livro traz. `u` vai de 0 (arteriolar) a 1 (venular). */
export function pressaoCapilar(u, e = PADRAO) {
  return e.pcArterial + (e.pcVenular - e.pcArterial) * u;
}

/* A pressão de filtração LÍQUIDA no ponto u. Positiva = sai água do capilar. */
export function pressaoLiquida(u, e = PADRAO) {
  const pc = pressaoCapilar(u, e);
  return (pc - e.pi) - e.sigma * (e.oncPlasma - e.oncInter);
}

/* Onde a soma troca de sinal — o ponto em que filtrar vira reabsorver.
   Devolve null quando não há cruzamento: com albumina muito baixa o capilar
   filtra do começo ao fim, e é ISSO que produz edema. Devolver 0 ou 1 nesse
   caso esconderia justamente o achado. */
export function pontoDeVirada(e = PADRAO) {
  const a = pressaoLiquida(0, e), b = pressaoLiquida(1, e);
  if (a === b) return null;
  if ((a > 0) === (b > 0)) return null;
  return a / (a - b);
}

/* Fluxo através da parede, ml/min. Positivo sai, negativo volta.
   Integra a pressão líquida ao longo do capilar em vez de usar as duas
   pontas: com a virada fora do meio, a média das pontas erra o sinal. */
export function fluxos(e = PADRAO, n = 200) {
  let sai = 0, volta = 0;
  for (let i = 0; i < n; i++) {
    const p = pressaoLiquida((i + .5) / n, e) * e.kf / n;
    p > 0 ? sai += p : volta -= p;
  }
  return { filtrado: sai, reabsorvido: volta, liquido: sai - volta };
}

/* ── O QUE SOBRA VAI PELO LINFÁTICO, e é aqui que a conta se fecha.
   Em tecido normal filtra-se um pouco mais do que se reabsorve — a média das
   quatro forças ao longo do capilar dá cerca de +0,3 a +3 mmHg, não zero — e a
   diferença volta pela linfa. EDEMA NÃO É "FILTRAR DEMAIS": é filtrar mais do
   que a linfa dá conta de levar.

   O TETO LINFÁTICO ESTÁ ESCRITO EM mmHg, E NÃO EM ml/min, de propósito. O que
   a fisiologia mede é um FATOR DE SEGURANÇA: a pressão capilar precisa subir
   cerca de 17 mmHg acima do normal antes de aparecer edema, e essa folga é a
   soma do linfático que acelera, da proteína do interstício que se dilui e da
   complacência do gel. Guardar 17 mmHg deixa a grandeza visível e confere-se
   contra o livro; guardar "0,4 ml/min" esconderia a mesma coisa atrás de um
   número que só faz sentido neste desenho. */
export const FOLGA_MMHG = 17;

/* média da pressão líquida ao longo do capilar */
export function mediaLiquida(e = PADRAO, n = 200) {
  let soma = 0;
  for (let i = 0; i < n; i++) soma += pressaoLiquida((i + .5) / n, e);
  return soma / n;
}
const mediaLiquidaNormal = () => mediaLiquida(PADRAO);

export function balanco(e = PADRAO, { semLinfa = false } = {}) {
  const f = fluxos(e);
  /* A CAPACIDADE DA LINFA É ABSOLUTA, e por isso sai do Kf NORMAL e não do Kf
     do estado. Escrita com `e.kf`, ela crescia junto com a permeabilidade — e
     a inflamação, que triplica o Kf, ganhava um linfático três vezes mais
     forte e deixava de causar edema. A linfa não fica mais potente porque o
     capilar furou. */
  const teto = semLinfa ? 0 : PADRAO.kf * (mediaLiquidaNormal() + FOLGA_MMHG);
  const linfa = Math.min(teto, Math.max(0, f.liquido));
  return { ...f, media: mediaLiquida(e), teto, linfa, acumula: Math.max(0, f.liquido - linfa) };
}

/* Volume acumulado no interstício, em ml, depois de `minutos`. Satura: o
   interstício é um gel que endurece ao encher, e a pressão dele sobe e freia
   a filtração. Sem essa freada o modelo encheria para sempre e diria que
   qualquer desequilíbrio mata — o que é falso e assustaria à toa. */
export function edemaEm(minutos, e = PADRAO, { teto = 60, semLinfa = false } = {}) {
  const b = balanco(e, { semLinfa });
  if (b.acumula <= 0) return 0;
  const tau = teto / b.acumula;
  return teto * (1 - Math.exp(-minutos / tau));
}

/* ── AS CAUSAS CLÁSSICAS DE EDEMA, cada uma mexendo numa letra diferente.
   Estão aqui, e não no painel, porque são conteúdo: a lista é a lição. */
export const CAUSAS = [
  { id: 'normal', nome: 'Normal', ajuste: {} },
  /* LIGA NA BANCADA 08: em pé e parado, a pressão venosa do tornozelo chega a
     90 mmHg, e a capilar tem de ficar ACIMA dela para haver fluxo. É por isso
     que o pé incha de ficar parado, e não de ficar em pé — a bomba muscular
     derruba essa coluna a cada passo. */
  { id: 'depe', nome: 'Em pé, parado', ajuste: { pcArterial: 100, pcVenular: 92 } },
  { id: 'cardiaca', nome: 'Insuficiência cardíaca', ajuste: { pcArterial: 50, pcVenular: 35 } },
  /* albumina LEVE não faz edema, e isso é achado, não falha do modelo: a folga
     de 17 mmHg absorve. Só albumina muito baixa vence a folga. */
  { id: 'hipoalbuminemia', nome: 'Albumina baixa', ajuste: { oncPlasma: 10 } },
  /* a parede deixa passar proteína: sigma cai, o interstício fica oncótico e
     o Kf sobe junto */
  { id: 'inflamacao', nome: 'Inflamação', ajuste: { sigma: 0.5, oncInter: 16, kf: 0.06 } },
  { id: 'linfatico', nome: 'Linfático obstruído', ajuste: {}, semLinfa: true },
];

export function comCausa(id) {
  const c = CAUSAS.find(x => x.id === id) || CAUSAS[0];
  return { estado: { ...PADRAO, ...c.ajuste }, semLinfa: !!c.semLinfa, nome: c.nome };
}
