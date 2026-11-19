import test from 'node:test';
import assert from 'node:assert/strict';
import { horaRelogio, faseDoCeu, posicaoAstro, relogio } from './relogio.js';

test('horaRelogio: duas casas, como no Limiar Ético', () => {
  assert.equal(horaRelogio(8), '08h00'); assert.equal(horaRelogio(13.5), '13h30'); assert.equal(horaRelogio(24), '00h00'); assert.equal(horaRelogio(23.999), '00h00');
});
test('faseDoCeu: madrugada e noite escuras, dia em quatro fases', () => {
  assert.deepEqual([3, 7, 10, 14, 17, 21].map(faseDoCeu), ['noite', 'alvorada', 'manha', 'tarde', 'poente', 'noite']);
});
test('astro: começa à esquerda, topo ao meio-dia, termina à direita', () => {
  const a = posicaoAstro(0), m = posicaoAstro(12), z = posicaoAstro(23.99);
  assert.ok(Math.abs(a.x - 8) < 0.01 && Math.abs(a.y - 36) < 0.01);
  assert.ok(Math.abs(m.x - 100) < 0.01 && m.y < 5);
  assert.ok(z.x > 190 && z.y > 30);
});
test('relogio: traz hora e fase', () => assert.match(relogio(18.5, 'acordado'), /data-fase="poente"[\s\S]*18h30[\s\S]*acordado/));
