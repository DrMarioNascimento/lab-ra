import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  PULMAO, PPL_MEDIA_FRC, GRADIENTE_PLEURAL, CMH2O_EM_MMHG, VOLUMES, VASOS,
  alturaEfetiva, pressaoPleural, transpulmonar, volumeRelativo, ventilacaoRelativa,
  pressoesEm, zonaEm, fluxoEm, perfilDeZonas, estadoDoPneumotorax, comCenario, CENARIOS, eixoDependente,
  cicloPleural, cicloAlveolar, retornoVenosoRelativo, AMPLITUDE_PPL, FRACAO_INSPIRATORIA,
} from "../pleura/fisica.js";

const texto = p => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const perto = (v, alvo, folga, oq) =>
  assert.ok(Math.abs(v - alvo) <= folga, `${oq}: ${v.toFixed(2)}, esperado ${alvo} +/- ${folga}`);

/* ==========================================================================
   Teste 10 — O espaço pleural e as zonas de West
   ========================================================================== */

test("de pé, a pleura puxa -10 no ápice e -2,5 na base", async () => {
  /* é este PAR que ensina, e é dele que a média sai — não o contrário */
  perto(pressaoPleural(1, 90), -10, .2, "ápice");
  perto(pressaoPleural(0, 90), -2.5, .2, "base");
  perto(GRADIENTE_PLEURAL * PULMAO.altura, 7.5, .1, "a diferença ápice-base");
});

test("deitado o gradiente sai do eixo ápice-base, e vai para o dorso", async () => {
  /* A primeira versão somava as projeções dos dois eixos e dava 35 cm a 45
     graus — MAIS do que em pé. Nenhum gradiente ao longo de um eixo pode
     crescer ao inclinar; era a projeção da caixa inteira, não a queda. */
  perto(alturaEfetiva(90), PULMAO.altura, .1, "em pé");
  perto(alturaEfetiva(0), 0, .1, "deitado, ao longo do ápice-base");
  for (let g = 0; g <= 90; g += 5) {
    assert.ok(alturaEfetiva(g) <= PULMAO.altura + .001,
      `a queda a ${g} graus passou da altura do pulmão`);
  }
  assert.equal(pressaoPleural(1, 0), pressaoPleural(0, 0), "deitado, ápice e base na mesma pressão");

  /* mas o gradiente NÃO some: muda de eixo, e o modelo tem de saber dizer */
  assert.equal(eixoDependente(90).nome, "do ápice à base");
  assert.equal(eixoDependente(0).nome, "do esterno ao dorso");
  perto(eixoDependente(0).atravessando, PULMAO.profundidade, .1, "o eixo dorsal deitado");
});

test("O ÁPICE É MAIOR E VENTILA MENOS", async () => {
  /* O paradoxo é a bancada inteira. Ele tem de CAIR da curva — se algum dia
     este teste falhar, o modelo passou a ensinar o erro. */
  const vApice = volumeRelativo(transpulmonar(1, 90));
  const vBase = volumeRelativo(transpulmonar(0, 90));
  assert.ok(vApice > vBase, "o alvéolo do ápice tem de ser MAIOR");
  perto(vApice, .63, .04, "volume do ápice");
  perto(vBase, .22, .04, "volume da base");

  const nApice = ventilacaoRelativa(1, 90), nBase = ventilacaoRelativa(0, 90);
  assert.ok(nBase > nApice, "e mesmo assim a base tem de ventilar MAIS");
  perto(nBase / nApice, 2.1, .3, "quantas vezes a base ventila mais");
});

test("a complacência cai monotonicamente, e é isso que faz o paradoxo", async () => {
  /* Uma sigmoide simétrica REPROVA aqui: nela a inclinação é máxima no meio,
     e o ápice (63% do volume) fica mais complacente que a base (22%). O
     modelo passaria a prever o ápice ventilando mais. */
  let anterior = Infinity;
  for (let p = 1; p <= 20; p += 1) {
    const inclinacao = volumeRelativo(p + .5) - volumeRelativo(p - .5);
    assert.ok(inclinacao < anterior, `a complacência subiu em P=${p}`);
    anterior = inclinacao;
  }
});

test("sem pressão transpulmonar o alvéolo está FECHADO, e não pequeno", async () => {
  assert.equal(volumeRelativo(0), 0);
  assert.equal(volumeRelativo(-3), 0);
});

test("no pneumotórax aberto a pleural vira zero e o alvéolo fecha", async () => {
  assert.equal(pressaoPleural(.5, 90, { pneumo: "aberto" }), 0);
  assert.equal(volumeRelativo(transpulmonar(.5, 90, { pneumo: "aberto" })), 0);
});

test("as duas molas vão cada uma para o seu volume de repouso", async () => {
  /* é o empate delas que deixa a pressão negativa; desfeito o empate, o
     pulmão colapsa e a caixa ABRE — a caixa aumentar é a parte que ninguém
     espera, e é o que se vê na radiografia */
  const antes = estadoDoPneumotorax("nenhum"), depois = estadoDoPneumotorax("aberto");
  assert.equal(antes.pulmao, antes.caixa, "em repouso as duas estão no mesmo volume");
  assert.ok(depois.pulmao < antes.pulmao, "o pulmão tem de colapsar");
  assert.ok(depois.caixa > antes.caixa, "e a caixa tem de ABRIR");
  perto(depois.pulmao, VOLUMES.pulmaoSozinho, .001, "pulmão sozinho");
  perto(depois.caixa, VOLUMES.caixaSozinha, .001, "caixa sozinha");
});

test("o hipertensivo empurra o mediastino, e o aberto não", async () => {
  assert.equal(estadoDoPneumotorax("aberto").desvio, 0);
  assert.ok(estadoDoPneumotorax("hipertensivo").desvio > 0);
  assert.ok(estadoDoPneumotorax("hipertensivo").ppl > 0, "a pressão tem de passar de zero");
});

test("as duas unidades se encontram, e a conversão está na fronteira", async () => {
  /* pressões respiratórias em cmH2O, vasculares em mmHg. Comparar as duas
     cruas erra as zonas por uns 30%. */
  perto(CMH2O_EM_MMHG, .7355, .001, "a constante");
  const p = pressoesEm(.5, 90, { palveolar: 10 });
  perto(p.palv, 7.355, .01, "10 cmH2O em mmHg");
});

test("em repouso NÃO existe zona 1", async () => {
  /* ela aparece só quando a arterial cai ou a alveolar sobe; devolvê-la no
     repouso seria ensinar errado */
  const zonas = perfilDeZonas(90, {}, 9).map(l => l.zona);
  assert.ok(!zonas.includes(1), `zonas de pé em repouso: ${zonas.join("")}`);
  assert.equal(zonas[0], 2, "o ápice em repouso é zona 2");
  assert.equal(zonas[zonas.length - 1], 3, "a base é zona 3");
});

test("hemorragia e ventilação com pressão criam zona 1 por caminhos opostos", async () => {
  const hem = perfilDeZonas(90, comCenario("hemorragia").ajuste).map(l => l.zona);
  const vent = perfilDeZonas(90, comCenario("ventilacao").ajuste).map(l => l.zona);
  assert.ok(hem.includes(1), "hemorragia tem de criar zona 1");
  assert.ok(vent.includes(1), "ventilação com pressão também");
  /* e por causas diferentes: uma derruba a arterial, a outra sobe a alveolar */
  assert.ok(comCenario("hemorragia").ajuste.pa < VASOS.pa);
  assert.equal(comCenario("hemorragia").ajuste.palveolar, undefined);
  assert.ok(comCenario("ventilacao").ajuste.palveolar > 0);
  assert.equal(comCenario("ventilacao").ajuste.pa, undefined);
});

test("deitado a perfusão fica mais uniforme", async () => {
  /* Contar FAIXAS reprovava por amostragem: com nove pontos eles caem dos
     mesmos lados e o empate não diz nada. O que se afirma é contínuo — a
     fronteira entre as zonas sobe e a diferença de fluxo entre ápice e base
     encolhe —, então a medida também tem de ser contínua. */
  const fracaoZona3 = grau => {
    let n = 0;
    for (let i = 0; i <= 200; i++) if (zonaEm(i / 200, grau, {}) === 3) n++;
    return n / 201;
  };
  assert.ok(fracaoZona3(0) > fracaoZona3(90),
    `de pé ${fracaoZona3(90).toFixed(3)} do pulmão em zona 3, deitado ${fracaoZona3(0).toFixed(3)}`);

  const espalha = grau => fluxoEm(0, grau, {}) / Math.max(.001, fluxoEm(1, grau, {}));
  assert.ok(espalha(0) < espalha(90),
    `de pé a base recebe ${espalha(90).toFixed(2)}x o ápice, deitado ${espalha(0).toFixed(2)}x`);
});

test("na zona 2 quem manda é a ALVEOLAR, e a venosa não conta", async () => {
  /* é a cachoeira: abaixo da queda, subir o nível do rio não muda a vazão */
  const alto = { pa: 15, pv: 5, palveolar: 6 };
  const f1 = fluxoEm(1, 90, alto);
  const f2 = fluxoEm(1, 90, { ...alto, pv: 1 });
  assert.equal(zonaEm(1, 90, alto), 2, "o cenário tem de ser zona 2");
  assert.equal(f1, f2, "mexer na venosa não pode mudar o fluxo na zona 2");
});

test("a bancada abre parada, e o card existe", async () => {
  const app = await texto("pleura/app.js");
  for (const chave of ["nivel", "grau", "pneumo", "cenario"]) {
    assert.ok(app.includes(`busca.get('${chave}')`), `falta ?${chave}=`);
  }
  const hub = await texto("bancadas.html");
  assert.ok(hub.includes('data-number="10"'));
  assert.ok(hub.includes('href="pleura/"'));
});

/* ==========================================================================
   O ciclo respiratório, e a pleura que aperta o retorno venoso
   ========================================================================== */

test("o ciclo comeca e acaba no fim da expiracao, sem fluxo", async () => {
  /* é o único instante em que a transpulmonar é o simétrico da pleural, e é
     por isso que todos os números clássicos são medidos ali */
  perto(cicloPleural(0), 0, .001, "deslocamento no início");
  perto(cicloPleural(1), 0, .001, "deslocamento no fim");
  perto(cicloAlveolar(0), 0, .02, "fluxo no fim da expiração");
  perto(cicloAlveolar(FRACAO_INSPIRATORIA), 0, .02, "fluxo no fim da inspiração");
});

test("a pleural desce ate a amplitude e volta", async () => {
  perto(cicloPleural(FRACAO_INSPIRATORIA), -AMPLITUDE_PPL, .01, "o fundo da inspiração");
  /* a amplitude não é escolha de desenho: na respiração tranquila a pleural
     vai de -5 a -8, e são esses 3 */
  assert.equal(AMPLITUDE_PPL, 3);
});

test("expirar em repouso e PASSIVO, e a curva tem de dizer isso", async () => {
  /* inspiração ocupa 40% do ciclo e expiração 60%: com uma senoide simétrica
     o desenho diria que expirar custa o mesmo, e não custa */
  assert.ok(FRACAO_INSPIRATORIA < .5);
  const picoInsp = Math.min(...[...Array(40)].map((_, i) => cicloAlveolar(i / 100)));
  const picoExp = Math.max(...[...Array(60)].map((_, i) => cicloAlveolar(.4 + i / 150)));
  assert.ok(Math.abs(picoInsp) > picoExp,
    `o fluxo inspiratório (${picoInsp.toFixed(2)}) tem de ser maior que o expiratório (${picoExp.toFixed(2)})`);
});

test("NUMA RESPIRACAO A BASE GANHA O DOBRO DO APICE", async () => {
  /* o paradoxo agora ANIMADO: é o mesmo achado do teste estático, mas medido
     no ciclo em vez de num delta escolhido a dedo */
  const vol = (f, fase) => volumeRelativo(transpulmonar(f, 90) - cicloPleural(fase));
  const ganhoBase = vol(0, FRACAO_INSPIRATORIA) - vol(0, 0);
  const ganhoApice = vol(1, FRACAO_INSPIRATORIA) - vol(1, 0);
  assert.ok(ganhoBase > ganhoApice, "a base tem de ganhar mais");
  perto(ganhoBase / ganhoApice, 2.1, .3, "quantas vezes a base ganha mais");
});

test("pleura positiva ESMAGA o retorno venoso, negativa ajuda", async () => {
  /* a correção que o simulador de ventilação do Mario trouxe: o hipertensivo
     mata por choque obstrutivo, e o desvio do mediastino é o sinal */
  const normal = estadoDoPneumotorax("nenhum").retorno;
  const aberto = estadoDoPneumotorax("aberto").retorno;
  const tenso = estadoDoPneumotorax("hipertensivo").retorno;
  assert.ok(tenso < .7, `hipertensivo devolve ${(tenso * 100).toFixed(0)}%, tinha de ser bem menos que o normal`);
  assert.ok(aberto < normal, "furado perde a ajuda da pleura negativa");
  assert.ok(retornoVenosoRelativo(-12) > 1.2, "inspiração profunda tem de ajudar o retorno");
  assert.ok(retornoVenosoRelativo(0) === 1, "pleural zero é a referência");
});

test("a bancada abre parada tambem no meio do ciclo", async () => {
  const app = await texto("pleura/app.js");
  assert.ok(app.includes("busca.get('fase')"), "falta ?fase=");
});
