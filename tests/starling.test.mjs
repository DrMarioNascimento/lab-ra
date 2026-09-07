import assert from "node:assert/strict";
import test from "node:test";
import {
  PADRAO, FOLGA_MMHG, pressaoCapilar, pressaoLiquida, pontoDeVirada,
  mediaLiquida, fluxos, balanco, edemaEm, comCausa, CAUSAS,
} from "../starling/fisica.js";

/* ==========================================================================
   Teste 09 — Forças de Starling

   A física desta bancada é conferível SEM navegador, e por isso os testes
   batem nela e não no desenho. Cada asserção abaixo é uma leitura do livro:
   se o modelo deixar de reproduzi-la, é o modelo que está errado.
   ========================================================================== */

const perto = (v, alvo, folga, oq) =>
  assert.ok(Math.abs(v - alvo) <= folga, `${oq}: ${v.toFixed(2)}, esperado ${alvo} +/- ${folga}`);

test("o capilar normal reproduz os números do livro", async () => {
  /* Guyton: +13 mmHg na ponta arteriolar, -7 na venular. A primeira escolha
     de valores dava +19,9 e reprovou aqui. */
  perto(pressaoLiquida(0), 13, .5, "ponta arteriolar");
  perto(pressaoLiquida(1), -7, .5, "ponta venular");
  perto(mediaLiquida(), 3, .5, "média ao longo do capilar");
});

test("filtra na ponta arteriolar e reabsorve na venular", async () => {
  assert.ok(pressaoLiquida(0) > 0, "a ponta arteriolar tem de filtrar");
  assert.ok(pressaoLiquida(1) < 0, "a ponta venular tem de reabsorver");
  const v = pontoDeVirada();
  assert.ok(v !== null, "tem de haver ponto de virada em tecido normal");
  perto(v, .65, .05, "o ponto de virada");
});

test("TECIDO NORMAL NÃO INCHA", async () => {
  /* A asserção mais importante do arquivo. O primeiro modelo acumulava 2,3 ml
     em meia hora em tecido saudável — plausível na tela, falso na fisiologia,
     e foi este teste que o pegou. */
  assert.equal(balanco().acumula, 0);
  assert.equal(edemaEm(30), 0);
  assert.equal(edemaEm(600), 0);
});

test("a folga contra o edema está em mmHg, e vale 17", async () => {
  /* O fator de segurança é uma grandeza da fisiologia, não um ajuste de
     desenho: a pressão capilar precisa subir ~17 mmHg antes de aparecer
     edema. Guardá-la em ml/min esconderia isso. */
  assert.equal(FOLGA_MMHG, 17);
  const quase = { ...PADRAO, pcArterial: PADRAO.pcArterial + 16, pcVenular: PADRAO.pcVenular + 16 };
  const passou = { ...PADRAO, pcArterial: PADRAO.pcArterial + 19, pcVenular: PADRAO.pcVenular + 19 };
  assert.equal(balanco(quase).acumula, 0, "16 mmHg acima ainda cabe na folga");
  assert.ok(balanco(passou).acumula > 0, "19 mmHg acima tem de vencer a folga");
});

test("a linfa não fica mais forte porque o capilar furou", async () => {
  /* Escrito com o Kf do estado, o teto linfático triplicava junto com a
     permeabilidade e a inflamação deixava de causar edema. */
  const furado = { ...PADRAO, kf: PADRAO.kf * 3 };
  assert.equal(balanco(furado).teto, balanco(PADRAO).teto);
});

test("sem cruzamento o ponto de virada é null, e não 0 nem 1", async () => {
  /* Com albumina no chão o capilar filtra do começo ao fim: devolver 0 ou 1
     esconderia justamente o achado. */
  const { estado } = comCausa("hipoalbuminemia");
  assert.equal(pontoDeVirada(estado), null);
});

test("cada causa mexe numa letra diferente da equação", async () => {
  const nomes = CAUSAS.map(c => c.id);
  for (const id of ["normal", "depe", "cardiaca", "hipoalbuminemia", "inflamacao", "linfatico"]) {
    assert.ok(nomes.includes(id), `falta a causa ${id}`);
  }
  /* a inflamação tem de derrubar sigma: é o que separa "parede furada" de
     "pressão alta", e sem isso as duas causas ficariam iguais */
  assert.ok(comCausa("inflamacao").estado.sigma < PADRAO.sigma);
  /* e não pode subir a pressão: a lição é que dá para inchar sem ela */
  assert.equal(comCausa("inflamacao").estado.pcArterial, PADRAO.pcArterial);
});

test("em pé e parado, a pressão capilar fica acima da venosa do tornozelo", async () => {
  /* liga na bancada 08, que mede 93 mmHg de pressão venosa no tornozelo:
     para haver fluxo, a capilar tem de estar acima disso */
  const { estado } = comCausa("depe");
  assert.ok(estado.pcVenular > 90, `venular ${estado.pcVenular} tem de passar de 90`);
});

test("albumina baixa incha pouco, e isso é achado e não falha", async () => {
  /* A força oncótica inteira vale 20 mmHg: zerá-la não chega a dobrar a folga
     de 17. Por isso o edema da hipoalbuminemia exige albumina MUITO baixa, e
     na clínica vem acompanhado de retenção de sódio. */
  const alb = comCausa("hipoalbuminemia"), inf = comCausa("inflamacao");
  const eAlb = edemaEm(30, alb.estado), eInf = edemaEm(30, inf.estado);
  assert.ok(eAlb > 0, "tem de inchar alguma coisa");
  assert.ok(eInf > eAlb * 5, `inflamação (${eInf.toFixed(1)}) tem de inchar muito mais que albumina (${eAlb.toFixed(1)})`);
});

test("linfático obstruído incha sem nenhuma força mudar", async () => {
  const { estado, semLinfa } = comCausa("linfatico");
  assert.deepEqual(estado, PADRAO, "nenhuma das quatro forças muda");
  assert.ok(balanco(estado, { semLinfa }).acumula > 0);
});

test("o edema satura em vez de crescer para sempre", async () => {
  const { estado } = comCausa("depe");
  const a = edemaEm(30, estado), b = edemaEm(300, estado), c = edemaEm(3000, estado);
  assert.ok(b > a && c > b, "tem de crescer");
  assert.ok(c < 61, "e tem de saturar: o gel do interstício endurece ao encher");
});

test("o fluxo é integrado ao longo do capilar, não tirado das duas pontas", async () => {
  /* Com a virada fora do meio, a média das pontas erra o sinal. Aqui a
     filtração tem de vencer a reabsorção mesmo com as pontas simétricas. */
  const f = fluxos();
  assert.ok(f.filtrado > 0 && f.reabsorvido > 0, "tem de haver os dois");
  perto(f.liquido, PADRAO.kf * 3, .01, "o líquido é Kf vezes a média");
});
