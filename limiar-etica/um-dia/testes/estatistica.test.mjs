// Verificações da estatística da turma. Rodar: node testes/estatistica.test.mjs
import assert from 'node:assert/strict';
import { DIAS, ORDEM_DIAS } from '../dias.js';
import { novoEstado, sortearNiveis, cenaAtual, decidir, terminou, resumo } from '../motor.js';
import { agregar, enviosDoDia, MIN_TURMA } from '../estatistica.js';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };
const semente = s => () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };

function aluno(dia, k, texto = 'Eu ouviria os dois lados antes de decidir.') {
  const r = semente(k * 7919 + 13);
  const est = novoEstado(sortearNiveis(r, dia), dia);
  let guarda = 0;
  while (!terminou(est) && guarda++ < 40) { const c = cenaAtual(est); decidir(est, Math.floor(r() * c.opcoes.length), { tempoMs: 4000 + k * 300, abriuInfo: r() < .5 }); }
  return { id: 'a' + k, nome: 'Aluno ' + k, avatar: '🦊', dia, enviado: true, dadosJson: JSON.stringify(resumo(est)), aplicacao: texto };
}

for (const dia of ['escola', 'bairro', 'academia', 'pesquisa', 'clube', 'reabilitacao', 'evento', 'estagio']) {
  const D = DIAS[dia];
  ok(`[${dia}] com menos de ${MIN_TURMA} envios nada é liberado`, () => {
    const a = agregar([1, 2, 3, 4].map(k => aluno(dia, k)), D, dia);
    assert.equal(a.liberado, false); assert.equal(a.n, 4); assert.equal(a.cenas.length, 0); assert.deepEqual(a.aplicacoes, []);
  });
  ok(`[${dia}] com 12 envios: cenas, opções, médias e lentes batem`, () => {
    const lista = Array.from({ length: 12 }, (_, k) => aluno(dia, k + 1));
    const a = agregar(lista, D, dia);
    assert.equal(a.liberado, true); assert.equal(a.n, 12);
    assert.equal(a.cenas.length, D.CENAS.length);
    for (const c of a.cenas) {
      assert.equal(c.n, 12);
      assert.equal(c.opcoes.reduce((s, o) => s + o.n, 0), 12, 'toda resposta cai numa opção');
      assert.ok(Math.abs(c.opcoes.reduce((s, o) => s + o.pct, 0) - 1) < 1e-9);
      for (const v of Object.values(c.medias)) assert.ok(Number.isFinite(v));
    }
    assert.ok(Math.abs(a.escala.reduce((s, e) => s + e.parte, 0) - 1) < 1e-6, 'lentes somam 100%');
    assert.equal(a.aplicacoes.length, 12);
    assert.equal(a.niveis.baixo + a.niveis.medio + a.niveis.alto, 12 * D.CENAS.length);
  });
}

ok('envios de outro dia, sem envio ou corrompidos não entram', () => {
  const l = [aluno('escola', 1), { ...aluno('escola', 2), enviado: false }, { ...aluno('escola', 3), dadosJson: '{x' }, aluno('bairro', 4)];
  assert.equal(enviosDoDia(l, 'escola').length, 1);
});
ok('uma cena com menos de 5 respostas fica oculta (empresa tem cenas condicionais)', () => {
  const D = DIAS.empresa;
  const lista = Array.from({ length: 6 }, (_, k) => aluno('empresa', k + 1));
  const a = agregar(lista, D, 'empresa');
  assert.equal(a.liberado, true);
  for (const c of a.cenas) assert.ok(c.oculta ? c.n < MIN_TURMA : c.n >= MIN_TURMA);
});
console.log(`\n${n} verificações passaram.`);
