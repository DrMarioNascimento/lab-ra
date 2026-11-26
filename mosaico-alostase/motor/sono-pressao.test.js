import assert from 'node:assert/strict';
import test from 'node:test';
import { conferirMorris2016, simularSonoPressao } from './sono-pressao.js';

for (const janela of ['noturna', 'diurna']) {
  test(`fragmentação em janela ${janela} preserva a vigília externa e distingue a janela do sono efetivo`, () => {
    const continuo = simularSonoPressao({ janela });
    const pulsos = simularSonoPressao({ janela, despertares: 4 });
    const fragmentado = simularSonoPressao({ janela, despertares: 4, duracaoMin: 5 });
    assert.equal(fragmentado.pontos.filter((p) => p.naJanela).length, 480);
    assert.deepEqual(fragmentado.pontos.filter((p) => !p.naJanela), continuo.pontos.filter((p) => !p.naJanela));
    assert.equal(pulsos.resumo.sonoEfetivoMin, 480);
    assert.equal(fragmentado.resumo.sonoEfetivoMin, 460);
    assert.equal(fragmentado.resumo.tempoAcordadoNaJanela, 20);
    assert.deepEqual(fragmentado.minutosDespertares, fragmentado.minutosDespertares.filter((min) => fragmentado.pontos[min].evento));
    assert.equal(fragmentado.resumo.pasVigilia, continuo.resumo.pasVigilia);
    assert.ok(fragmentado.resumo.pasJanela > fragmentado.resumo.pasSono);
    assert.ok(fragmentado.resumo.pasJanela > pulsos.resumo.pasJanela);
    assert.ok(pulsos.resumo.pasJanela > continuo.resumo.pasJanela);
    assert.ok(fragmentado.resumo.quedaJanelaPct < continuo.resumo.quedaJanelaPct);
  });
}

test('conferência de Morris separa a vigília e o efeito da fragmentação na janela invertida', () => {
  const [vigilia, sono, inteira, queda] = conferirMorris2016();
  assert.equal(vigilia.continuo, vigilia.fragmentado);
  assert.ok(sono.fragmentado > sono.continuo);
  assert.ok(inteira.fragmentado > inteira.continuo);
  assert.ok(queda.fragmentado > queda.continuo);
  assert.throws(() => simularSonoPressao({ janela: 'inexistente' }), RangeError);
});
