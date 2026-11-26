import assert from 'node:assert/strict';
import test from 'node:test';
import { CENARIOS_HIDRICOS, simularHidratacao } from './bancada-hidrica.js';
import { compartimentos, hidratar } from './hidratacao.js';
import { regularRim } from './renal.js';

test('controle renal reproduz o ponto de referência em equilíbrio', () => {
  const estado = hidratar();
  const rim = regularRim(estado, compartimentos(estado), { razaoPressao: 1 }, 5);
  assert.deepEqual(rim.regulacao, { adh: 100, renina: 100, angII: 100, aldosterona: 100, anp: 100 });
  assert.equal(rim.tfg, 120);
  assert.equal(rim.urinaLHora, 0.055);
  assert.equal(rim.sodioUrinaMgHora, 80);
});

test('perda de água concentra o plasma, eleva ADH e reduz excreção de água', () => {
  const estado = { ...hidratar(), aguaL: 41 };
  const rim = regularRim(estado, compartimentos(estado), { razaoPressao: 0.98 }, 5);
  assert.ok(rim.regulacao.adh > 100);
  assert.ok(rim.urinaLHora < 0.055);
  assert.ok(rim.regulacao.renina > 100);
  assert.ok(rim.regulacao.anp < 100);
});

test('o horário da bebida modifica curva de urina e conserva massa', () => {
  const cedo = simularHidratacao(CENARIOS_HIDRICOS.calor, { regular: regularRim });
  const tarde = simularHidratacao(CENARIOS_HIDRICOS.adiada, { regular: regularRim });
  const p = 228;
  assert.ok(cedo.pontos[p].renal.regulacao.adh < tarde.pontos[p].renal.regulacao.adh);
  assert.ok(cedo.pontos[p].renal.urinaLHora > tarde.pontos[p].renal.urinaLHora);
  const { estado, totais } = tarde;
  assert.ok(Math.abs(estado.aguaL + estado.aguaDigestivaL + totais.suorL + totais.urinaL
    + totais.perdaInsensivelL - 42 - totais.aguaMl / 1000) < 1e-8);
  assert.ok(Math.abs(estado.sodioDeltaMg + estado.sodioDigestivoMg + totais.sodioSuorMg
    + totais.sodioUrinaMg - totais.sodioMg) < 1e-8);
});
