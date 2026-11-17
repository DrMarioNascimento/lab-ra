import test from 'node:test';
import assert from 'node:assert/strict';
import { ROTINAS } from './rotinas.js';
import { novaPartida, sortearPerguntas, pontuar, TEMPOS, VARIAVEIS, cortisolForaDoJogo, horaDeAcordar, hhmm } from './prognostico.js';

test('sorteio: sem repetir par, sem hora de sono, sem a hora de acordar, em ordem a partir do despertar', () => {
  for (const r of ROTINAS) for (const t of TEMPOS) for (const s of [1, 2, 3, 99]) {
    const q = sortearPerguntas(r, t.perguntas, s);
    const chaves = new Set(q.map((x) => `${x.hora}-${x.variavel}`));
    assert.equal(chaves.size, q.length, `${r.id}: par repetido`);
    assert.ok(q.length === t.perguntas || t.perguntas > 20, `${r.id}: ${q.length} de ${t.perguntas}`);
    for (let i = 1; i < q.length; i++) assert.ok(q[i].ordem >= q[i - 1].ordem);
    for (const x of q) {
      assert.notEqual(x.hora, horaDeAcordar(r));
      assert.ok(!r.sono.some((b) => (b.inicio <= b.fim ? x.hora >= b.inicio && x.hora < b.fim : x.hora >= b.inicio || x.hora < b.fim)), `${r.id}: pergunta às ${x.hora} dormindo`);
      assert.ok(!(x.variavel === 'cortisol' && cortisolForaDoJogo(r, x.hora)));
    }
  }
});

test('sorteio: mesma semente dá a mesma partida; sementes diferentes variam', () => {
  const a = sortearPerguntas(ROTINAS[0], 10, 7), b = sortearPerguntas(ROTINAS[0], 10, 7), c = sortearPerguntas(ROTINAS[0], 10, 8);
  assert.deepEqual(a, b); assert.notDeepEqual(a, c);
});

test('sorteio curto alterna as variáveis', () => {
  const q = sortearPerguntas(ROTINAS[0], 10, 3);
  for (let i = 1; i < q.length; i++) assert.notEqual(q[i].variavel, q[i - 1].variavel);
});

test('dia de prova: o cortisol não é pedido em volta da prova', () => {
  const r = ROTINAS.find((x) => x.id === 'dia-de-prova');
  const q = sortearPerguntas(r, 36, 1);
  assert.ok(!q.some((x) => x.variavel === 'cortisol' && x.hora >= 13 && x.hora < 16));
  assert.ok(q.some((x) => x.variavel === 'glicemia' && x.hora >= 13 && x.hora < 16));
});

test('pontuação: cheia na faixa, cai em linha reta, zera a uma largura de faixa', () => {
  assert.equal(pontuar(10, [8, 12]), 100); assert.equal(pontuar(8, [8, 12]), 100);
  assert.equal(pontuar(14, [8, 12]), 50); assert.equal(pontuar(6, [8, 12]), 50);
  assert.equal(pontuar(16, [8, 12]), 0); assert.equal(pontuar(30, [8, 12]), 0);
});

test('partida: valor do motor dentro da própria faixa e dentro do slider; raciocínio sempre presente', () => {
  for (const r of ROTINAS) {
    const p = novaPartida(r, 36, 5);
    assert.ok(p.ancora.cortisol > 0 && p.ancora.glicemia > 60);
    for (const q of p.perguntas) {
      const v = VARIAVEIS[q.variavel];
      assert.ok(q.valor >= q.faixa[0] && q.valor <= q.faixa[1]);
      assert.ok(q.valor >= v.min && q.valor <= v.max, `${r.id} ${q.variavel} ${q.valor}`);
      assert.ok(q.faixa[1] <= v.max + 1e-9 || q.variavel === 'cortisol');
      assert.ok(q.raciocinio.length >= 1 && q.raciocinio.every((f) => f.length > 10));
    }
  }
});

test('hora por extenso', () => { assert.equal(hhmm(7.5), '7h30'); assert.equal(hhmm(18), '18h'); assert.equal(hhmm(24.5), '0h30'); });

test('glicemia: o jogo diz se é pós-prandial, de jejum ou entre refeições', async () => {
  const { momentoGlicemia, rotuloGlicemia, explicar } = await import('./prognostico.js');
  const r = ROTINAS[0];                                  // café 7h30, almoço 12h30, jantar 19h30
  assert.equal(momentoGlicemia(r, 8.5), 'pós-prandial'); assert.equal(momentoGlicemia(r, 11.5), 'entre refeições');
  assert.equal(momentoGlicemia(r, 7), 'de jejum'); assert.equal(rotuloGlicemia(r, 13), 'Glicemia pós-prandial'); assert.equal(rotuloGlicemia(r, 17), 'Glicemia');
  assert.ok(explicar(r, 8.5, 'glicemia').join(' ').includes('2 horas depois da sobrecarga'));
  assert.ok(explicar(r, 7, 'glicemia').join(' ').includes('jejum'));
});
