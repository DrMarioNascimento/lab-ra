// Verificações do balizamento interno. Rodar: node testes/balizamento.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CENAS, CENA_FINAL } from '../dados.js';
import { TEMAS, CARGAS, soma, faixa, relatorio } from '../balizamento/cargas.mjs';

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

ok('o balizamento não é carregado pela página do aluno', () => {
  for (const arq of ['../app.js', '../dados.js', '../motor.js', '../retomadas.js', '../index.html']) {
    assert.ok(!/balizamento|cargas\.mjs/.test(readFileSync(new URL(arq, import.meta.url), 'utf8')), arq);
  }
});

console.log(`\n${n} verificações passaram.`);
