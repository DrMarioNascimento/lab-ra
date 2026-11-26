import assert from 'node:assert/strict';
import test from 'node:test';
import { simularProtocoloYang } from './conferencia-yang.js';
import { simularEscalaCalor } from './escala-calor.js';

test('quatro blocos de três noites curtas, com uma recuperação por bloco e duas ao final', () => {
  const dias = simularProtocoloYang();
  assert.equal(dias.length, 21);
  assert.equal(dias[2].fase, 'Basal');
  for (let i = 3; i < 19; i += 4) {
    assert.deepEqual(dias.slice(i, i + 4).map((x) => x.curta), [true, true, true, false]);
  }
  for (const d of dias) {
    const queda = 100 * (1 - d.padSono / d.padVigilia);
    assert.equal(d.quedaPad, queda);
  }
  assert.equal(dias[12].pad20, dias[4].pad20);
  assert.equal(dias.at(-1).pad20, dias[2].pad20);
});

test('recuperação pareada conserva trabalho, fase e água e isola o sono na segunda folga', () => {
  for (const escala of ['diurna', 'noturna', 'alternada']) {
    const [uma, duas] = [1, 2].map((noitesRecuperacao) => simularEscalaCalor(escala, { noitesRecuperacao, dias: 8 }));
    assert.deepEqual(uma.slice(0, 6), duas.slice(0, 6));
    for (let i = 0; i < 8; i++) {
      assert.equal(uma[i].faseH, duas[i].faseH);
      assert.equal(uma[i].aguaL, duas[i].aguaL);
      assert.equal(uma[i].plano.inicioTrabalho, duas[i].plano.inicioTrabalho);
    }
    assert.equal(uma[6].sonoEfetivoMin, 360);
    assert.equal(duas[6].sonoEfetivoMin, 480);
    assert.ok(Math.abs(uma[7].dividaSono7dH - duas[7].dividaSono7dH - 2) < 1e-9);
    assert.ok(Number.isFinite(uma[7].pasPreTurno));
  }
});
