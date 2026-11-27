import assert from 'node:assert/strict';
import test from 'node:test';
import { glicogenioAposRefeicao, variacaoGlicogenioEmJejum, fluxoHepaticoAposRefeicao, simularFluxoHepatico, simularRegulacaoHepatica, efeitoHepaticoNaGlicemia, CONFERENCIA_GLICOGENIO_120 } from './glicogenio.js';

test('a curva pós-prandial reproduz a concentração inicial e o pico publicado', () => {
  assert.equal(glicogenioAposRefeicao(0), 207);
  assert.equal(glicogenioAposRefeicao(318), 316);
  assert.ok(glicogenioAposRefeicao(317) < glicogenioAposRefeicao(318));
  assert.equal(glicogenioAposRefeicao(360), 316 - 42 * 0.26);
  assert.throws(() => glicogenioAposRefeicao(361), RangeError);
});

test('o jejum mantém a referência às 20h e reproduz a perda às 07h', () => {
  assert.equal(variacaoGlicogenioEmJejum(0), 0);
  assert.equal(variacaoGlicogenioEmJejum(330), -40.3);
  assert.equal(variacaoGlicogenioEmJejum(660), -80.6);
  assert.throws(() => variacaoGlicogenioEmJejum(-1), RangeError);
});

test('produção hepática reproduz as referências sem confundir retorno e nadir', () => {
  for (const [min, taxa] of [[0, 1.90], [10, 0.627], [30, 0], [60, 0.31], [255, 0.49], [380, 1.90]]) {
    assert.ok(Math.abs(fluxoHepaticoAposRefeicao(min) - taxa) < 1e-12);
  }
  assert.throws(() => fluxoHepaticoAposRefeicao(381), RangeError);
});

test('a liberação acumulada integra a taxa, mesmo enquanto o estoque sobe', () => {
  const pontos = simularFluxoHepatico();
  assert.equal(pontos.length, 361);
  assert.equal(pontos[0].liberadoMgKg, 0);
  assert.ok(Math.abs(pontos[10].liberadoMgKg - (1.90 + 0.627) * 10 / 2) < 1e-12);
  assert.ok(pontos.every((p, i) => i === 0 || p.liberadoMgKg >= pontos[i - 1].liberadoMgKg));
  const { minuto, variacao } = CONFERENCIA_GLICOGENIO_120;
  assert.ok(Math.abs(glicogenioAposRefeicao(minuto) - glicogenioAposRefeicao(0) - variacao) < 1);
});

test('regulação hormonal usa as duas âncoras e responde à perturbação dos sinais', () => {
  const base = simularRegulacaoHepatica();
  const maisInsulina = simularRegulacaoHepatica(1.2, 1);
  const maisGlucagon = simularRegulacaoHepatica(1, 1.2);
  assert.equal(base.length, 361);
  assert.equal(base[0].taxa, 1.9);
  assert.ok(Math.abs(base[60].taxa - 0.31) < 1e-12);
  assert.ok(maisInsulina[60].taxa < base[60].taxa && maisGlucagon[60].taxa > base[60].taxa);
  assert.ok(base[30].taxa > fluxoHepaticoAposRefeicao(30));
  for (const serie of [base, maisInsulina, maisGlucagon]) {
    assert.ok(serie.every(({ taxa }) => taxa >= 0 && taxa <= 1.9));
  }
  assert.throws(() => simularRegulacaoHepatica(0), RangeError);
});

test('balanço glicêmico mantém a referência e conserva o desvio de massa', () => {
  const referencia = simularRegulacaoHepatica();
  assert.ok(efeitoHepaticoNaGlicemia(referencia, referencia).every((p) => p.deltaGlicemiaMgDl === 0));
  for (const [insulina, glucagon, sinal] of [[1.2, 1, -1], [1, 1.2, 1]]) {
    const serie = efeitoHepaticoNaGlicemia(simularRegulacaoHepatica(insulina, glucagon), referencia);
    assert.equal(serie[0].deltaGlicemiaMgDl, 0);
    assert.equal(Math.sign(serie[60].deltaGlicemiaMgDl), sinal);
    for (const p of serie) {
      assert.ok(Math.abs(p.liberacaoAcumuladaMgKg - p.remocaoAcumuladaMgKg - p.saldoMgKg) < 1e-10);
    }
  }
});

test('a integração reproduz a solução para fonte constante e a conversão de unidades', () => {
  const entrada = Array.from({ length: 31 }, () => ({ taxa: 1 }));
  const referencia = entrada.map(() => ({ taxa: 0 }));
  const { deltaGlicemiaMgDl, liberacaoAcumuladaMgKg } = efeitoHepaticoNaGlicemia(entrada, referencia).at(-1);
  assert.equal(liberacaoAcumuladaMgKg, 30);
  assert.ok(Math.abs(deltaGlicemiaMgDl - 0.5 * 30 / Math.log(2) / 1.3) < 1e-10);
});
