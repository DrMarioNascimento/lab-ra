// Verificações dos níveis de estresse, das etiquetas éticas e do retorno. Rodar: node testes/niveis.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CENAS, CENA_FINAL, CENA_NEGADA, NIVEIS, CONTEXTOS, VALORES, ETIQUETAS } from '../dados.js';
import { GLOSSARIO, CONCEITOS_DA_LEITURA } from '../glossario.js';
import { novoEstado, sortearNiveis, cenaAtual, decidir, terminou, resumo } from '../motor.js';
import { gerarRetorno } from '../retorno.js';
import { cargaDoNivel, soma } from '../balizamento/cargas.mjs';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };
const PALAVRAS = /estress|press[ãa]o|tens[ãa]o|nervos|ansied|sobrecarreg|esgot/i;

// gerador com semente, para o sorteio ser reproduzível no teste
const semente = s => () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };

ok('todas as dez cenas têm contexto nos três níveis, sem palavras de estresse', () => {
  const ids = CENAS.map(c => c.id);
  assert.deepEqual(Object.keys(CONTEXTOS).sort(), [...ids].sort());
  for (const id of ids) for (const nv of NIVEIS) {
    const t = CONTEXTOS[id][nv];
    assert.ok(typeof t === 'string' && t.length > 10, `${id}/${nv}`);
    assert.ok(!PALAVRAS.test(t), `palavra de estresse em ${id}/${nv}`);
  }
  for (const c of [...CENAS, CENA_FINAL, CENA_NEGADA]) for (const o of c.opcoes) assert.ok(!PALAVRAS.test(o.t), `alternativa: ${c.id}`);
});

ok('o nível alto fala de repetição ("pela terceira vez" e semelhantes) e o baixo não', () => {
  const freq = /(segund|terceir|quart|quint|duas vezes|tr[eê]s vezes)/i;
  for (const id of Object.keys(CONTEXTOS)) {
    assert.ok(freq.test(CONTEXTOS[id].alto), 'alto sem frequência: ' + id);
    assert.ok(!freq.test(CONTEXTOS[id].baixo), 'baixo com frequência: ' + id);
  }
});

ok('as etiquetas éticas cobrem todas as alternativas, com códigos válidos', () => {
  for (const c of [...CENAS, CENA_FINAL, CENA_NEGADA]) {
    const v = VALORES[c.id];
    assert.ok(v && v.length === c.opcoes.length, 'etiquetas: ' + c.id);
    for (const x of v) for (const k of [...x.p, ...x.s]) assert.ok(ETIQUETAS[k], 'código inválido: ' + k);
    for (const x of v) assert.ok(!x.p.some(k => x.s.includes(k)), 'mesmo código protegido e sacrificado: ' + c.id);
  }
});

ok('todo conceito do retorno existe no glossário, com definição', () => {
  for (const [leitura, ids] of Object.entries(CONCEITOS_DA_LEITURA)) for (const id of ids) {
    assert.ok(GLOSSARIO[id] && GLOSSARIO[id].def.length > 20, `${leitura}: ${id}`);
  }
});

ok('o sorteio é equilibrado: 3/3/3 mais uma, e nunca três altas seguidas', () => {
  const ids = CENAS.map(c => c.id);
  for (let s = 1; s <= 2000; s++) {
    const sorteio = sortearNiveis(semente(s));
    const lista = ids.map(id => sorteio[id]);
    const cont = Object.fromEntries(NIVEIS.map(nv => [nv, lista.filter(x => x === nv).length]));
    assert.deepEqual(Object.values(cont).sort(), [3, 3, 4]);
    for (let i = 2; i < lista.length; i++) assert.ok(!(lista[i] === 'alto' && lista[i - 1] === 'alto' && lista[i - 2] === 'alto'), 'três altas seguidas');
  }
});

ok('cada cena aparece nos três níveis ao longo dos sorteios', () => {
  const visto = Object.fromEntries(CENAS.map(c => [c.id, new Set()]));
  for (let s = 1; s <= 300; s++) { const so = sortearNiveis(semente(s)); for (const id of Object.keys(so)) visto[id].add(so[id]); }
  for (const id of Object.keys(visto)) assert.equal(visto[id].size, 3, id);
});

ok('a cena mostra o contexto do nível sorteado e o log guarda nível e etiquetas', () => {
  const niveis = Object.fromEntries(CENAS.map(c => [c.id, 'alto']));
  const e = novoEstado(niveis);
  const cena = cenaAtual(e);
  assert.ok(cena.texto.includes(CONTEXTOS[cena.id].alto) && cena.nivel === 'alto');
  decidir(e, 0);
  const r = resumo(e);
  assert.equal(r.pontos[0].nivel, 'alto');
  assert.deepEqual(r.pontos[0].prot, VALORES[cena.id][0].p);
});

ok('o retorno gera leituras com conceitos do glossário e frases sem rótulo de pessoa', () => {
  const e = novoEstado(sortearNiveis(semente(7)));
  let i = 0;
  while (!terminou(e)) { const c = cenaAtual(e); decidir(e, (i++) % c.opcoes.length); }
  const r = gerarRetorno(resumo(e).pontos);
  assert.equal(r.porNivel.reduce((a, x) => a + x.total, 0), 10);
  assert.ok(r.achados.length >= 3);
  for (const a of r.achados) {
    assert.ok(a.texto.length > 20 && a.conceitos.length >= 1, a.id);
    assert.ok(!/você é (uma pessoa|um )/i.test(a.texto) && !PALAVRAS.test(a.texto.replace(/estresse/g, '')), a.texto);
  }
});

ok('o retorno traz, nas escolhas certas, coleguismo sacrificado por meta pessoal e justiça com a empresa preservada', () => {
  // nome(2): sacrifica colegas; figurinha(0): meta no lugar de colegas; verba(2): justiça e empresa
  const niveis = Object.fromEntries(CENAS.map(c => [c.id, 'alto']));
  const e = novoEstado(niveis);
  const escolha = { mensagem: 0, nome: 2, numero: 2, horario: 2, troca: 2, verba: 2, figurinha: 0, ligacao: 1, fotos: 2, interprete: 0 };
  while (!terminou(e)) { const c = cenaAtual(e); decidir(e, escolha[c.id] ?? 0); }
  const ids = gerarRetorno(resumo(e).pontos).achados.map(a => a.id);
  assert.ok(ids.includes('meta-colegas-alto'));
  assert.ok(ids.includes('justica-alto'));
});

ok('o balizamento por nível sobe do baixo ao alto em todas as cenas', () => {
  for (const c of CENAS) {
    const b = soma(cargaDoNivel(c.id, 'baixo')), m = soma(cargaDoNivel(c.id, 'medio')), a = soma(cargaDoNivel(c.id, 'alto'));
    assert.ok(b < m && m < a && a - b >= 4, c.id);
    for (const v of [...cargaDoNivel(c.id, 'baixo'), ...cargaDoNivel(c.id, 'alto')]) assert.ok(v >= 0 && v <= 4);
  }
});

ok('o aluno não carrega o balizamento (a citação da fonte PSS-10 na base das condições é permitida)', () => {
  for (const arq of ['../app.js', '../dados.js', '../motor.js', '../retorno.js', '../retomadas.js', '../glossario.js', '../index.html']) {
    assert.ok(!/balizamento|cargas\.mjs|ALAVANCAS|FAIXAS/i.test(readFileSync(new URL(arq, import.meta.url), 'utf8')), arq);
  }
});

console.log(`\n${n} verificações passaram.`);
