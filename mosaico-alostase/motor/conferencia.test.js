import assert from 'node:assert/strict';
import test from 'node:test';
import { simularCardiovascular, resumirCardiovascular } from './cardiovascular.js';
import { CENARIOS_HIDRICOS, simularHidratacao } from './bancada-hidrica.js';
import { regularRim } from './renal.js';

const dentro = (v, min, max) => assert.ok(v >= min && v <= max, `${v} fora de ${min}–${max}`);

test('tabela Staessen: PA de 24 h e em vigília na faixa, sono a até 0,5 mmHg da faixa', () => {
  const { dia, vigilia, sono } = resumirCardiovascular(simularCardiovascular({ sono: [1380, 420] }));
  dentro(dia.sis, 115, 120);
  dentro(dia.dia, 70, 75);
  dentro(vigilia.sis, 120, 125);
  dentro(vigilia.dia, 75, 80);
  dentro(sono.sis, 105 - 0.5, 110 + 0.5);
  dentro(sono.dia, 60 - 0.5, 65 + 0.5);
});

test('tabela hídrica: ordem de grandeza do suor, da osmolalidade e da urina no calor', () => {
  const { pontos, totais } = simularHidratacao(CENARIOS_HIDRICOS.calor, { regular: regularRim });
  dentro(totais.suorL / 0.75, 0.5, 2);
  dentro(totais.urinaL, 0.8, 2);
  for (const p of pontos) dentro(p.osmolalidade, 275, 295);
});
