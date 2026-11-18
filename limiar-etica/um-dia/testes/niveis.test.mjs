// Verificações dos níveis de estresse, das etiquetas éticas e do retorno, nos três dias. Rodar: node testes/niveis.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CENA_FINAL, CENA_NEGADA, NIVEIS, ETIQUETAS } from '../dados.js';
import { DIAS, ORDEM_DIAS } from '../dias.js';
import { GLOSSARIO, CONCEITOS_DA_LEITURA } from '../glossario.js';
import { novoEstado, sortearNiveis, cenaAtual, decidir, terminou, resumo } from '../motor.js';
import { gerarRetorno } from '../retorno.js';
import { cargaDoNivel, soma } from '../balizamento/cargas.mjs';

let n = 0;
const ok = (nome, f) => { f(); n++; console.log('ok  ' + nome); };
const PALAVRAS = /estress|press[ãa]o|tens[ãa]o|nervos|ansied|sobrecarreg|esgot/i;
const FREQ = /(segund|terceir|quart|quint|duas vezes|tr[eê]s vezes)/i;

// gerador com semente, para o sorteio ser reproduzível no teste
const semente = s => () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };

for (const k of ORDEM_DIAS) {
  const D = DIAS[k];
  const todas = [...D.CENAS, ...(D.completo ? [CENA_FINAL, CENA_NEGADA] : [])];

  const N = { empresa: 10, escola: 10, bairro: 11, academia: 10, pesquisa: 10, clube: 10, reabilitacao: 10, evento: 10, estagio: 10 }[k];
  ok(`[${k}] ${N} cenas, com contexto nos três níveis e sem palavras de estresse`, () => {
    const ids = D.CENAS.map(c => c.id);
    assert.equal(ids.length, N);
    assert.deepEqual(Object.keys(D.CONTEXTOS).sort(), [...ids].sort());
    for (const id of ids) for (const nv of NIVEIS) {
      const t = D.CONTEXTOS[id][nv];
      assert.ok(typeof t === 'string' && t.length > 10, `${id}/${nv}`);
      assert.ok(!PALAVRAS.test(t), `palavra de estresse em ${id}/${nv}`);
    }
    for (const c of todas) for (const o of c.opcoes) assert.ok(!PALAVRAS.test(o.t), `alternativa: ${c.id}`);
  });

  ok(`[${k}] o nível alto fala de repetição e o baixo não`, () => {
    for (const id of Object.keys(D.CONTEXTOS)) {
      assert.ok(FREQ.test(D.CONTEXTOS[id].alto), 'alto sem frequência: ' + id);
      assert.ok(!FREQ.test(D.CONTEXTOS[id].baixo), 'baixo com frequência: ' + id);
    }
  });

  ok(`[${k}] as etiquetas éticas cobrem todas as alternativas, com códigos válidos`, () => {
    for (const c of todas) {
      const v = D.VALORES[c.id] || (D.completo ? null : null);
      if (!D.completo || D.VALORES[c.id]) {
        assert.ok(v && v.length === c.opcoes.length, 'etiquetas: ' + c.id);
        for (const x of v) {
          for (const e of [...x.p, ...x.s]) assert.ok(ETIQUETAS[e], 'código inválido: ' + e);
          assert.ok(!x.p.some(e => x.s.includes(e)), 'mesmo código protegido e sacrificado: ' + c.id);
        }
      }
    }
  });

  ok(`[${k}] cada cena tem três alternativas com pesos válidos e conceito`, () => {
    for (const c of D.CENAS) {
      assert.ok(c.titulo && c.texto && c.hora && c.conceito && c.conceito.titulo, c.id);
      if (!D.completo || true) assert.ok(c.opcoes.length >= 2 && c.opcoes.length <= 3, c.id);
      for (const o of c.opcoes) {
        assert.ok(Math.abs(o.w.i + o.w.e + o.w.r - 1) < 1e-9, `pesos de ${c.id}`);
        assert.ok(o.cd >= -1 && o.cd <= 1 && o.t && (o.d || o.pedeChefia) && (D.completo || o.car), `campos de ${c.id}`);
      }
    }
  });

  ok(`[${k}] o sorteio é equilibrado: níveis equilibrados (diferença máxima de uma cena), e nunca três altas seguidas`, () => {
    const ids = D.CENAS.map(c => c.id);
    for (let s = 1; s <= 1000; s++) {
      const sorteio = sortearNiveis(semente(s), k);
      const lista = ids.map(id => sorteio[id]);
      const cont = Object.fromEntries(NIVEIS.map(nv => [nv, lista.filter(x => x === nv).length]));
      const q = Object.values(cont);
      assert.ok(Math.max(...q) - Math.min(...q) <= 1 && q.reduce((a, b) => a + b) === ids.length, JSON.stringify(cont));
      for (let i = 2; i < lista.length; i++) assert.ok(!(lista[i] === 'alto' && lista[i - 1] === 'alto' && lista[i - 2] === 'alto'), 'três altas seguidas');
    }
  });

  ok(`[${k}] um dia inteiro corre do começo ao fim e o retorno usa os verbetes do glossário`, () => {
    const e = novoEstado(sortearNiveis(semente(7), k), k);
    let i = 0;
    while (!terminou(e)) { const c = cenaAtual(e); assert.ok(c.texto.includes(D.CONTEXTOS[c.id]?.[c.nivel] ?? '')); decidir(e, (i++) % c.opcoes.length); }
    const r = resumo(e);
    assert.equal(r.pontos.filter(p => p.nivel).length, N);
    const g = gerarRetorno(r.pontos, { instituicao: D.instituicao });
    assert.ok(g.achados.length >= 3);
    for (const a of g.achados) {
      assert.ok(a.texto.length > 20 && a.conceitos.length >= 1, a.id);
      assert.ok(!/você é (uma pessoa|um )/i.test(a.texto) && !PALAVRAS.test(a.texto.replace(/estresse/g, '')), a.texto);
    }
  });

  ok(`[${k}] as escolhas mais éticas geram leitura de justiça com a instituição preservada em nível alto`, () => {
    const niveis = Object.fromEntries(D.CENAS.map(c => [c.id, 'alto']));
    const e = novoEstado(niveis, k);
    // escolhe, em cada cena, a alternativa que mais protege coisas e menos sacrifica
    while (!terminou(e)) {
      const c = cenaAtual(e);
      const v = D.VALORES[c.id];
      let melhor = 0, nota = -99;
      v.forEach((x, idx) => { const s = x.p.length - x.s.length + (x.p.includes('justica') ? 2 : 0); if (s > nota) { nota = s; melhor = idx; } });
      decidir(e, melhor);
    }
    const ids = gerarRetorno(resumo(e).pontos, { instituicao: D.instituicao }).achados.map(a => a.id);
    assert.ok(ids.includes('justica-alto'), 'sem leitura de justiça: ' + ids.join(', '));
  });
}

ok('o dia da empresa continua com retomada e volta (11 decisões), o bairro tem 11 e os demais dias têm 10', () => {
  assert.equal(novoEstado(null, 'empresa').fila.length, 11);
  assert.equal(novoEstado(null, 'escola').fila.length, 10);
  assert.equal(novoEstado(null, 'bairro').fila.length, 11);
  for (const k of ['academia', 'pesquisa', 'clube', 'reabilitacao', 'evento', 'estagio']) assert.equal(novoEstado(null, k).fila.length, 10, k);
});

ok('todo conceito do retorno existe no glossário, com definição', () => {
  for (const [leitura, ids] of Object.entries(CONCEITOS_DA_LEITURA)) for (const id of ids) {
    assert.ok(GLOSSARIO[id] && GLOSSARIO[id].def.length > 20, `${leitura}: ${id}`);
  }
});

ok('o balizamento por nível do dia da empresa sobe do baixo ao alto em todas as cenas', () => {
  for (const c of DIAS.empresa.CENAS) {
    const b = soma(cargaDoNivel(c.id, 'baixo')), m = soma(cargaDoNivel(c.id, 'medio')), a = soma(cargaDoNivel(c.id, 'alto'));
    assert.ok(b < m && m < a && a - b >= 4, c.id);
  }
});

ok('o aluno não carrega o balizamento nem usa nomes da régua nas páginas', () => {
  for (const arq of ['../app.js', '../dados.js', '../motor.js', '../retorno.js', '../retomadas.js', '../glossario.js', '../dias.js', '../dia-escola.js', '../dia-bairro.js', '../dia-academia.js', '../dia-pesquisa.js', '../dia-clube.js', '../dia-reabilitacao.js', '../dia-evento.js', '../dia-estagio.js', '../index.html']) {
    assert.ok(!/balizamento|cargas\.mjs|ALAVANCAS|FAIXAS/i.test(readFileSync(new URL(arq, import.meta.url), 'utf8')), arq);
  }
});

console.log(`\n${n} verificações passaram.`);
