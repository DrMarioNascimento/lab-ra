// Verificações do conteúdo programático. Rodar: node testes/programa.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DIAS, ORDEM_DIAS } from '../dias.js';
import { GLOSSARIO } from '../glossario.js';
import { EIXOS, CENA_EIXOS, mapaDoDia } from '../programa.js';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };

ok('todas as 30 cenas têm eixo principal válido, e cada eixo aparece em pelo menos 2 cenas principais', () => {
  const cont = Object.fromEntries(Object.keys(EIXOS).map(e => [e, 0]));
  for (const k of ORDEM_DIAS) {
    const ids = DIAS[k].CENAS.map(c => c.id).sort();
    assert.deepEqual(Object.keys(CENA_EIXOS[k]).sort(), ids, `cenas do dia ${k} sem mapa`);
    for (const e of Object.values(CENA_EIXOS[k])) {
      assert.ok(e.length >= 1 && e.length <= 3);
      for (const x of e) assert.ok(EIXOS[x], `eixo inexistente ${x}`);
      assert.equal(new Set(e).size, e.length);
    }
    for (const e of Object.values(CENA_EIXOS[k])) cont[e[0]]++;
  }
  for (const [e, c] of Object.entries(cont)) assert.ok(c >= 2, `eixo ${e} com ${c} cena(s) principal(is)`);
});

ok('cada eixo tem competência, pergunta e verbetes existentes no glossário', () => {
  for (const [id, e] of Object.entries(EIXOS)) {
    assert.ok(e.titulo && e.competencia && e.pergunta, id);
    assert.ok(e.verbetes.length >= 3, id);
    for (const v of e.verbetes) assert.ok(GLOSSARIO[v], `${id}: verbete ${v} não existe`);
  }
});

ok('cada dia cobre ao menos 5 eixos diferentes', () => {
  for (const k of ORDEM_DIAS) {
    const eixos = new Set(Object.values(CENA_EIXOS[k]).flat());
    assert.ok(eixos.size >= 5, `${k}: ${eixos.size}`);
  }
});

ok('o dia do bairro mantém a violência como fio: cuidado, responsabilidade ou papel em 7+ das 10 cenas', () => {
  const k = Object.values(CENA_EIXOS.bairro).filter(e => e.some(x => ['cuidado', 'responsabilidade', 'papel'].includes(x))).length;
  assert.ok(k >= 7, String(k));
});

ok('mapaDoDia lista só os eixos das cenas jogadas', () => {
  const m = mapaDoDia('escola', [{ cenaId: 'halter', titulo: 'O halter' }, { cenaId: 'verba', titulo: 'A verba' }]);
  const ids = m.map(x => x.id);
  assert.ok(ids.includes('cuidado') && ids.includes('justica') && ids.includes('privacidade'));
  assert.ok(!ids.includes('coleguismo'));
  assert.deepEqual(mapaDoDia('empresa', []), []);
});

ok('páginas do aluno não citam documentos de projeto', () => {
  for (const f of ['../programa.js', '../app.js']) {
    const t = readFileSync(new URL(f, import.meta.url), 'utf8');
    assert.ok(!/balizamento\/|cargas\.mjs|ALAVANCAS|FAIXAS|NOM-035|PSS/.test(t.replace(/\/\/.*$/gm, '')), f);
  }
});

console.log(`\n${n} verificações passaram.`);
