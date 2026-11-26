import assert from 'node:assert/strict';
import test from 'node:test';
import { simularTurnoCalor } from './turno-calor.js';
import { REFERENCIAS_CICLISMO, simularProtocoloCalorHidrico } from './protocolo-calor-hidrico.js';

const aproximar = (a, b, tolerancia = 1e-9) => assert.ok(Math.abs(a - b) <= tolerancia, `${a} ≠ ${b}`);

test('ciclismo: reposição gradual preserva a ordem dos desfechos medidos', () => {
  const series = REFERENCIAS_CICLISMO.map((r) => simularProtocoloCalorHidrico(r.reposicaoPct));
  for (const [i, resultado] of series.entries()) {
    const referencia = REFERENCIAS_CICLISMO[i];
    aproximar(resultado.perdaMassaPct, referencia.perdaMassaPct, 0.15);
    aproximar(resultado.centralC, referencia.centralC, 0.20);
    if (i === 0) continue;
    const anterior = series[i - 1];
    assert.ok(resultado.fc < anterior.fc);
    assert.ok(resultado.volumeSistolico > anterior.volumeSistolico);
    assert.ok(resultado.centralC < anterior.centralC);
  }
});

test('turnos: conservação de água e débito consistente em cada minuto', () => {
  for (const hora of [14, 22]) {
    for (const cenario of ['pausas', 'fim']) {
      const pontos = simularTurnoCalor(cenario, hora);
      assert.equal(pontos.length, 361);
      assert.equal(pontos.at(-1).aguaMl, 1200);
      for (const p of pontos) {
        aproximar(p.perdaMassaPct * 70 / 100, p.suor + p.urina + p.insensivel - p.aguaMl / 1000);
        aproximar(p.debito, p.fc * p.volumeSistolico / 1000);
        aproximar(p.pam, p.debito * p.resistencia);
      }
    }
  }
});

test('turno: ingestão no fim só altera a água disponível a partir do passo seguinte', () => {
  const pausas = simularTurnoCalor('pausas');
  const fim = simularTurnoCalor('fim');
  assert.deepEqual(pausas.slice(0, 50), fim.slice(0, 50));
  assert.equal(fim[240].entradaMl, 1200);
  assert.equal(fim[240].aguaMl, 0);
  assert.equal(fim[241].aguaMl, 1200);
  assert.ok(fim[241].aguaDigestivaL > 1);
  assert.ok(fim[240].osmolalidade > pausas[240].osmolalidade);
  assert.ok(fim[230].centralC > pausas[230].centralC);
  assert.ok(fim[230].volumeSistolico < pausas[230].volumeSistolico);
  assert.ok(fim[240].regulacao.adh > pausas[240].regulacao.adh);
  assert.ok(Math.abs(fim[360].osmolalidade - pausas[360].osmolalidade) < 2);
  assert.notEqual(simularTurnoCalor('fim', 22)[240].fc, fim[240].fc);
});
