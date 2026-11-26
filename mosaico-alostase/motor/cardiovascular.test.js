import assert from 'node:assert/strict';
import test from 'node:test';
import { conferirCardiovascular, resumirCardiovascular, simularCardiovascular } from './cardiovascular.js';
import { pressaoArterial } from './hemodinamica.js';

const sono = [23 * 60, 7 * 60];

test('bancada conserva a curva publicada de pressão sem sessão e amostra sono e vigília', () => {
  const dia = simularCardiovascular({ sono });
  assert.equal(dia.length, 1440);
  for (const ponto of dia) {
    const basal = pressaoArterial(ponto.min / 60, [{ inicio: 23, fim: 7 }]);
    assert.deepEqual([ponto.sis, ponto.dia], [basal.sis, basal.dia]);
  }
  assert.equal(dia[20].amostraMAPA, false);
  assert.equal(dia[30].amostraMAPA, true);
  assert.equal(dia[440].amostraMAPA, true);
  const resumo = resumirCardiovascular(dia);
  assert.ok(resumo.sono.sis < resumo.vigilia.sis);
  assert.ok(resumo.sono.fc < resumo.vigilia.fc);
});

test('sessão altera FC e PAS após o início, preserva a hipótese de PAD e recupera para a basal', () => {
  const inicio = 18 * 60;
  const basal = simularCardiovascular({ sono });
  const treino = simularCardiovascular({ sono, exercicio: { inicio, duracao: 15, intensidade: 40 } });
  assert.equal(treino[inicio - 1].fc, basal[inicio - 1].fc);
  assert.equal(treino[inicio].sis, basal[inicio].sis);
  assert.ok(treino[inicio + 10].fc > basal[inicio + 10].fc);
  assert.ok(treino[inicio + 10].sis > basal[inicio + 10].sis);
  assert.equal(treino[inicio + 10].dia, basal[inicio + 10].dia);
  assert.ok(treino[inicio + 15].emRecuperacao);
  assert.ok(treino[inicio + 18].fc < treino[inicio + 15].fc);
  assert.equal(treino[inicio + 60].fc, basal[inicio + 60].fc);
  assert.equal(treino[inicio + 60].sis, basal[inicio + 60].sis);
});

test('exercício atravessa a meia-noite e a validação detecta sobreposição com o sono', () => {
  const exercicio = { inicio: 23 * 60 + 50, duracao: 30, intensidade: 40 };
  assert.match(conferirCardiovascular({ sono, exercicio }), /coincide/);
  assert.throws(() => simularCardiovascular({ sono: [420, 420] }), /3 e 12/);
  const dia = simularCardiovascular({ sono: [60, 540], exercicio });
  assert.ok(dia[0].emEsforco);
  assert.ok(dia[0].calculo.deltaFC > 0);
  assert.ok(dia[20].emRecuperacao);
  assert.equal(dia[0].dormindo, false);
});
