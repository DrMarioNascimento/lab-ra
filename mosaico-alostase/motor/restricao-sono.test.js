import assert from 'node:assert/strict';
import test from 'node:test';
import { REFERENCIAS_RESTRICAO, simularRestricaoSono } from './restricao-sono.js';

test('ensaio conserva nove noites de restrição, três de recuperação e o ponto médio do sono', () => {
  const dias = simularRestricaoSono();
  assert.equal(dias.length, 16);
  assert.equal(dias.filter((p) => p.fase === 'Restrição').length, 9);
  assert.equal(dias.filter((p) => p.fase === 'Recuperação').length, 3);
  for (const p of dias) {
    const [inicio, fim] = p.janela;
    const duracao = (fim - inicio + 1440) % 1440;
    assert.equal((inicio + duracao / 2) % 1440, 150);
    assert.equal(duracao, p.fase === 'Restrição' ? 240 : 540);
    assert.equal(p.agenda.pasVigilia, 0);
    assert.equal(p.comEfeito.pasVigilia, 0);
  }
});

test('alterar a recuperação preserva o ponto de ajuste e só muda as noites posteriores à restrição', () => {
  const rapida = simularRestricaoSono({ meiaVidaRecuperacao: 1 });
  const lenta = simularRestricaoSono({ meiaVidaRecuperacao: 4 });
  const ajuste = REFERENCIAS_RESTRICAO.pasSono.find((r) => r.ajuste);
  assert.deepEqual(rapida.slice(0, 13), lenta.slice(0, 13));
  assert.ok(Math.abs(rapida[ajuste.dia - 1].comEfeito.pasSono - ajuste.valor) < 1e-9);
  assert.ok(lenta[14].comEfeito.pasSono > rapida[14].comEfeito.pasSono);
  assert.ok(rapida[14].comEfeito.pasSono > rapida[14].agenda.pasSono);
});
