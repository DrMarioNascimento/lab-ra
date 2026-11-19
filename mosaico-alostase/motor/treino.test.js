import test from 'node:test';
import assert from 'node:assert/strict';
import { fcMax, fracaoReservaVO2, frequenciaNoEsforco } from './treino.js';

const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} deveria estar a ${tol} de ${b}`);

test('FCmáx de Tanaka: 208 − 0,7 × idade e as equações por hábito', () => {
  perto(fcMax(20), 194, 1e-9); perto(fcMax(40), 180, 1e-9);
  perto(fcMax(20, 'sedentario'), 195, 1e-9); perto(fcMax(20, 'ativo'), 193, 1e-9); perto(fcMax(20, 'treinado'), 192, 1e-9);
  assert.throws(() => fcMax(20, 'inexistente'));
});

test('fração da reserva de VO2: 0 no repouso, 1 no máximo, e abaixo da fração do VO2máx', () => {
  perto(fracaoReservaVO2(1, 45), 1, 1e-9);
  assert.equal(fracaoReservaVO2(0, 45), 0);
  const f = fracaoReservaVO2(0.6, 45);
  assert.ok(f < 0.6 && f > 0.55, `a 60% do VO2máx a reserva é ${f}`);
});

test('frequência no esforço: repouso na fração 0, FCmáx na fração 1, linear entre eles, faixa de 10 bpm no máximo', () => {
  const r0 = frequenciaNoEsforco({ idade: 20, fracReserva: 0 });
  perto(r0.valor, 54.5, 0.05); assert.deepEqual(r0.faixa, [54.5, 54.5]);
  const r1 = frequenciaNoEsforco({ idade: 20, fracReserva: 1 });
  perto(r1.valor, 194, 0.05); perto(r1.faixa[1] - r1.faixa[0], 20, 0.05);
  const r5 = frequenciaNoEsforco({ idade: 20, fracReserva: 0.5 });
  perto(r5.valor, (54.5 + 194) / 2, 0.1);
});

test('frequência sobe com a intensidade e cai com a idade na mesma fração', () => {
  const a = frequenciaNoEsforco({ idade: 20, fracReserva: 0.4 }).valor, b = frequenciaNoEsforco({ idade: 20, fracReserva: 0.7 }).valor;
  assert.ok(b > a);
  assert.ok(frequenciaNoEsforco({ idade: 50, fracReserva: 0.7 }).valor < b);
});
