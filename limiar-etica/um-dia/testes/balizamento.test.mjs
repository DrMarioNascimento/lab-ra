// Verificações do balizamento interno. Rodar: node testes/balizamento.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CENAS, CENA_FINAL } from '../dados.js';
import { TEMAS, CARGAS, CARGAS_DIAS, soma, faixa, relatorio, cargaDoNivel } from '../balizamento/cargas.mjs';
import { DIAS } from '../dias.js';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };

ok('toda cena do dia tem dez notas inteiras de 0 a 4', () => {
  assert.equal(TEMAS.length, 10);
  for (const c of [...CENAS, CENA_FINAL]) {
    const notas = CARGAS[c.id];
    assert.ok(notas, 'sem carga: ' + c.id);
    assert.equal(notas.length, 10);
    for (const v of notas) assert.ok(Number.isInteger(v) && v >= 0 && v <= 4, c.id);
    assert.ok(soma(notas) >= 0 && soma(notas) <= 40);
  }
});

ok('o dia sobe até a noite: a última metade pesa mais que a primeira', () => {
  const ids = [...CENAS.map(c => c.id), CENA_FINAL.id];
  const tot = ids.map(id => soma(CARGAS[id]));
  const meio = Math.floor(tot.length / 2);
  const m = a => a.reduce((x, y) => x + y, 0) / a.length;
  assert.ok(m(tot.slice(meio)) > m(tot.slice(0, meio)));
});

ok('o dia tem ao menos uma cena em faixa limite e uma leve', () => {
  const f = relatorio().linhas.map(l => l.faixa);
  assert.ok(f.includes('limite') && f.includes('leve'));
});

for (const d of ['escola', 'bairro', 'academia', 'pesquisa', 'clube', 'reabilitacao']) {
  ok(`[${d}] toda cena tem dez notas inteiras de 0 a 4 e o nível sobe de baixo a alto (diferença de ao menos 4)`, () => {
    for (const c of DIAS[d].CENAS) {
      const notas = CARGAS_DIAS[d][c.id];
      assert.ok(notas && notas.length === 10, 'sem carga: ' + c.id);
      for (const v of notas) assert.ok(Number.isInteger(v) && v >= 0 && v <= 4, c.id);
      const b = soma(cargaDoNivel(c.id, 'baixo', d)), m = soma(cargaDoNivel(c.id, 'medio', d)), a = soma(cargaDoNivel(c.id, 'alto', d));
      assert.ok(b < m && m < a && a - b >= 4, c.id);
    }
    assert.deepEqual(Object.keys(CARGAS_DIAS[d]).sort(), DIAS[d].CENAS.map(c => c.id).sort());
  });
}

ok('o balizamento não é carregado pela página do aluno', () => {
  for (const arq of ['../app.js', '../dados.js', '../motor.js', '../retomadas.js', '../index.html']) {
    assert.ok(!/balizamento|cargas\.mjs/.test(readFileSync(new URL(arq, import.meta.url), 'utf8')), arq);
  }
});

console.log(`\n${n} verificações passaram.`);

// --- NOM-035: camada situacional (projeto apenas) ---
{
  const { FATORES, FATORES_CENA, cobertura } = await import('../balizamento/fatores.mjs');
  const { DIAS, ORDEM_DIAS } = await import('../dias.js');
  for (const k of ORDEM_DIAS) {
    assert.deepEqual(Object.keys(FATORES_CENA[k]).sort(), DIAS[k].CENAS.map(c => c.id).sort(), `fatores: cenas de ${k}`);
    for (const fs of Object.values(FATORES_CENA[k])) for (const f of fs) assert.ok(FATORES[f], f);
  }
  for (const f of Object.keys(FATORES)) {
    const total = ORDEM_DIAS.reduce((a, k) => a + cobertura(k)[f].length, 0);
    assert.ok(total >= 1, `fator ${f} sem nenhuma cena`);
  }
  console.log('ok  fatores NOM-035 cobrem todas as cenas dos dias e os 7 fatores');
}
