import test from 'node:test';
import assert from 'node:assert/strict';
import { estadoInicial, reduzir, partidaDe, perguntaAtual, totalPerguntas, resumoDaPergunta, histograma, mediaDePontos } from './engine.js';

const comTurma = (n = 3) => { let s = estadoInicial(); for (let i = 1; i <= n; i++) s = reduzir(s, { t: 'entrar', id: `a${i}`, nome: `Aluno ${i}` }); return s; };

test('config só vale na entrada e só com rotina e número conhecidos', () => {
  let s = reduzir(estadoInicial(), { t: 'config', rotinaId: 'treino-leve', n: 3, semente: 7 });
  assert.equal(s.rotinaId, 'treino-leve'); assert.equal(s.n, 3); assert.equal(s.semente, 7);
  s = reduzir(s, { t: 'config', rotinaId: 'não existe', n: 4 }); assert.equal(s.rotinaId, 'treino-leve'); assert.equal(s.n, 3);
  s = reduzir(reduzir(s, { t: 'entrar', id: 'a1', nome: 'A' }), { t: 'comecar' });
  assert.equal(reduzir(s, { t: 'config', n: 8 }).n, 3);
});

test('a partida é a mesma em qualquer aparelho (mesma rotina, número e semente)', () => {
  const s = reduzir(estadoInicial(), { t: 'config', rotinaId: 'dia-de-prova', n: 5, semente: 42 });
  assert.deepEqual(partidaDe(s).perguntas.map((q) => [q.hora, q.variavel]), partidaDe(JSON.parse(JSON.stringify(s))).perguntas.map((q) => [q.hora, q.variavel]));
  assert.equal(totalPerguntas(s), 5);
});

test('rodada completa: responder, revelar, pontuar, seguir até o fim', () => {
  let s = reduzir(comTurma(3), { t: 'config', n: 3 });
  s = reduzir(s, { t: 'comecar' }); assert.equal(s.fase, 'pergunta');
  for (let k = 0; k < 3; k++) {
    const q = perguntaAtual(s);
    s = reduzir(s, { t: 'responder', id: 'a1', valor: q.valor });                  // no esperado
    s = reduzir(s, { t: 'responder', id: 'a2', valor: q.faixa[1] + (q.faixa[1] - q.faixa[0]) * 5 });   // muito fora
    s = reduzir(s, { t: 'revelar' });                                              // a3 não respondeu
    assert.equal(s.fase, 'revelacao');
    assert.equal(s.ult.a1, 100); assert.equal(s.ult.a2, 0); assert.equal(s.ult.a3, 0);
    s = reduzir(s, { t: 'proxima' });
  }
  assert.equal(s.fase, 'fim'); assert.equal(s.pts.a1, 300); assert.equal(s.acertos.a1, 3); assert.equal(s.pts.a3, 0);
  assert.equal(mediaDePontos(s), 100);
});

test('resposta fora de hora, de quem não entrou ou inválida é ignorada; valor é limitado ao intervalo da variável', () => {
  let s = comTurma(1);
  assert.equal(reduzir(s, { t: 'responder', id: 'a1', valor: 10 }), s, 'ainda na entrada');
  s = reduzir(s, { t: 'comecar' });
  assert.equal(reduzir(s, { t: 'responder', id: 'zz', valor: 10 }), s);
  assert.equal(reduzir(s, { t: 'responder', id: 'a1', valor: 'abc' }), s);
  const q = perguntaAtual(s), s2 = reduzir(s, { t: 'responder', id: 'a1', valor: 1e6 });
  assert.ok(s2.resp[0].a1 <= (q.variavel === 'cortisol' ? 30 : 200));
  const s3 = reduzir(reduzir(s2, { t: 'responder', id: 'a1', valor: q.valor }), { t: 'revelar' });
  assert.equal(reduzir(s3, { t: 'responder', id: 'a1', valor: 0 }), s3, 'depois da revelação não muda');
});

test('quem tenta entrar duas vezes com o mesmo id não duplica', () => {
  const s = comTurma(1); assert.equal(reduzir(s, { t: 'entrar', id: 'a1', nome: 'Outro' }), s); assert.deepEqual(s.ordem, ['a1']);
});

test('reiniciar volta à entrada mantendo a turma e zerando pontos', () => {
  let s = reduzir(reduzir(comTurma(2), { t: 'comecar' }), { t: 'responder', id: 'a1', valor: perguntaAtual(reduzir(comTurma(2), { t: 'comecar' })).valor });
  s = reduzir(reduzir(s, { t: 'revelar' }), { t: 'reiniciar' });
  assert.equal(s.fase, 'entrada'); assert.equal(s.ordem.length, 2); assert.equal(s.pts.a1, 0);
});

test('resumo e histograma: contagem, mediana e classes cobrem tudo', () => {
  let s = reduzir(comTurma(4), { t: 'comecar' }); const q = perguntaAtual(s);
  [0.9, 1, 1.1, 2].forEach((m, i) => { s = reduzir(s, { t: 'responder', id: `a${i + 1}`, valor: q.valor * m }); });
  const r = resumoDaPergunta(s); assert.equal(r.n, 4); assert.equal(r.total, 4);
  const h = histograma(r.valores, q.faixa, q.valor); assert.equal(h.cont.reduce((a, b) => a + b, 0), 4); assert.ok(h.lo < q.faixa[0] && h.hi > Math.max(...r.valores));
});
