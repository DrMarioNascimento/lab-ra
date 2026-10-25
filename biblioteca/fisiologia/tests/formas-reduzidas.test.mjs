import test from 'node:test';
import assert from 'node:assert/strict';

import { formasReduzidas } from '../scripts/formas-reduzidas.js';

function reconstruir(r, i) {
  const k = r.alvos.length, out = Float64Array.from(r.base);
  r.alvos.forEach((a, j) => { const w = r.pesos[i * k + j]; for (let q = 0; q < out.length; q++) out[q] += w * a[q]; });
  return out;
}

test('uma ondulação senoidal cabe em duas formas, com pesos entre 0 e 1', () => {
  const m = 600, n = 17, base = Float32Array.from({ length: m }, (_, q) => Math.sin(q) * 3);
  const formas = Array.from({ length: n }, (_, i) => Float32Array.from(base, (v, q) => v + .4 * Math.sin(2 * Math.PI * i / (n - 1) + .3 * q) * (q % 3 === 0 ? 1 : 0)));
  const r = formasReduzidas(base, formas);
  assert.ok(r.alvos.length <= 2, `${r.alvos.length} formas`);
  for (const w of r.pesos) assert.ok(w >= -1e-6 && w <= 1 + 1e-6, `peso ${w}`);
  for (let i = 0; i < n; i++) { const x = reconstruir(r, i); for (let q = 0; q < m; q++) assert.ok(Math.abs(x[q] - formas[i][q]) < 6e-3, `instante ${i}`); }
});

test('uma dilatação é uma forma só', () => {
  const base = Float32Array.from({ length: 300 }, (_, q) => (q % 7) - 3);
  const formas = Array.from({ length: 9 }, (_, i) => Float32Array.from(base, v => v * (1 + .2 * Math.sin(i))));
  assert.equal(formasReduzidas(base, formas).alvos.length, 1);
});
