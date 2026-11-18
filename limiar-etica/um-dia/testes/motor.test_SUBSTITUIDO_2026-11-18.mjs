// Verificações do motor do dia. Rodar: node testes/motor.test.mjs
import assert from 'node:assert/strict';
import { CENAS, CENA_FINAL, CENA_NEGADA, CORRENTES, VOLTAS, ORDEM_PENDENCIAS } from '../dados.js';
import { novoEstado, cenaAtual, decidir, terminou, resumo, janelaInfo, pendenciaPrincipal } from '../motor.js';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };

ok('dados: pesos, limites e textos de todas as alternativas', () => {
  for (const c of [...CENAS, CENA_FINAL, CENA_NEGADA]) {
    assert.ok(c.opcoes.length >= 2, c.id);
    assert.ok(c.margem >= 0 && c.margem <= 1, c.id);
    assert.ok(c.conceito.titulo && c.conceito.texto, c.id);
    for (const o of c.opcoes) {
      const s = o.w.i + o.w.e + o.w.r;
      assert.ok(Math.abs(s - 1) < 1e-9, `${c.id}: pesos somam ${s}`);
      assert.ok(o.cd >= -1 && o.cd <= 1, c.id);
      assert.ok(o.t && o.car, c.id);
      assert.ok(o.pedeChefia || o.d, `${c.id}: desfecho vazio`);
      for (const k of Object.keys(o.cor)) assert.ok(k in CORRENTES, `${c.id}: corrente ${k}`);
      assert.ok(!/racional|emocional|certa|errada/i.test(o.t), `${c.id}: alternativa se denuncia`);
    }
  }
  for (const p of [...ORDEM_PENDENCIAS, 'nenhuma']) assert.ok(VOLTAS[p], p);
});

ok('todos os caminhos do dia terminam e geram resumo válido', () => {
  let caminhos = 0, comNegada = 0;
  const pendVistas = new Set();
  const andar = (est) => {
    if (terminou(est)) {
      caminhos++;
      const r = resumo(est);
      assert.ok(r.pontos.length === 11 || r.pontos.length === 12);
      if (r.pontos.length === 12) comNegada++;
      for (const p of r.pontos) assert.ok(Math.abs(p.impulso + p.emocao + p.razao - 1) < 1e-9);
      assert.ok(Math.abs(r.escala.reduce((a, e) => a + e.parte, 0) - 1) < 1e-9);
      assert.ok(r.metas.evento && r.metas.trabalho && r.metas.familia);
      return;
    }
    const cena = cenaAtual(est);
    if (cena.id === 'volta') { pendVistas.add(pendenciaPrincipal(est)); assert.ok(cena.texto); }
    for (let i = 0; i < cena.opcoes.length; i++) {
      const copia = structuredClone(est);
      const d = decidir(copia, i, { tempoMs: 1000, abriuInfo: false });
      assert.ok(d && d.length > 5, cena.id);
      andar(copia);
    }
  };
  andar(novoEstado());
  assert.ok(caminhos > 100000, 'caminhos: ' + caminhos);
  assert.ok(comNegada > 0, 'a chefia nunca nega');
  for (const p of [...ORDEM_PENDENCIAS, 'nenhuma']) assert.ok(pendVistas.has(p), 'pendência nunca volta: ' + p);
  console.log(`    ${caminhos} caminhos, ${comNegada} com a saída negada`);
});

ok('a saída só é liberada com a confiança da chefia alta', () => {
  const jogar = (escolhas) => { const e = novoEstado(); for (const i of escolhas) decidir(e, i); return e; };
  const alta = jogar([2, 1, 2, 0, 1, 1, 1]);     // cena 1: perguntar (+1)
  decidir(alta, 1);
  assert.equal(cenaAtual(alta).id, 'fotos');
  assert.equal(alta.familia, 'atendido');
  const baixa = jogar([1, 1, 2, 0, 1, 1, 1]);    // cena 1: não responder (-1)
  decidir(baixa, 1);
  assert.equal(cenaAtual(baixa).id, 'negada');
});

ok('com cansaço alto, a informação da noite some', () => {
  const e = novoEstado();
  const fotos = CENAS.find(c => c.id === 'fotos'), manha = CENAS[0];
  assert.equal(janelaInfo(e, fotos), Infinity);
  e.cansaco = 2; assert.equal(janelaInfo(e, fotos), 15);
  e.cansaco = 3; assert.equal(janelaInfo(e, fotos), 0);
  assert.equal(janelaInfo(e, manha), Infinity);
});

ok('a confiança da equipe muda o desfecho da mesma escolha de reparo', () => {
  const desfechoCom = (escolhaNaEquipe) => {
    const e = novoEstado();
    for (const i of [2, 1, escolhaNaEquipe, 0, 1, 1, 1, 0, 0]) decidir(e, i);
    assert.equal(cenaAtual(e).id, 'interprete');
    const desfecho = decidir(e, 1);
    assert.equal(resumo(e).pontos.at(-1).desfecho, desfecho);
    return desfecho;
  };
  assert.match(desfechoCom(1), /colega da equipe ajuda.*ausência de Libras/);
  assert.match(desfechoCom(2), /Funciona pela metade/);
});

console.log(`\n${n} verificações passaram.`);
