import assert from 'node:assert/strict';
import test from 'node:test';
import { faseEmPerfil, perfilDeFaseComLuz, respostaLuz } from './fase-circadiana.js';

test('a luz antes do mínimo atrasa, depois adianta e a mesma hora depende da fase', () => {
  assert.ok(respostaLuz(2500, 180, 0) > 0);
  assert.ok(respostaLuz(2500, 420, 0) < 0);
  assert.ok(respostaLuz(2500, 420, 4) > 0);
  assert.equal(respostaLuz(2500, 300, 0), 0);
});

test('a intensidade satura, a escuridão conserva a fase e a exposição só afeta momentos posteriores', () => {
  assert.equal(respostaLuz(0, 180, 0), 0);
  assert.ok(respostaLuz(2500, 180, 0) > respostaLuz(100, 180, 0));
  assert.ok(respostaLuz(2500, 180, 0) * 1.1 > respostaLuz(10000, 180, 0));
  const escuro = perfilDeFaseComLuz(1, () => 0, 5);
  assert.equal(faseEmPerfil(escuro, 1440), 1);
  const perfil = perfilDeFaseComLuz(0, (min) => min >= 180 && min < 240 ? 2500 : 0, 5);
  assert.equal(faseEmPerfil(perfil, 179), 0);
  assert.equal(faseEmPerfil(perfil, 180), 0);
  assert.ok(faseEmPerfil(perfil, 182) > 0);
});
