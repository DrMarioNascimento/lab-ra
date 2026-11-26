import assert from 'node:assert/strict';
import test from 'node:test';
import { calorEntreEstados, INICIAL_TERMICO, passoTermico } from './termorregulacao.js';
import { simularTrajetoria } from './trajetoria.js';

const perto = (a, b, erro = 1e-9) => assert.ok(Math.abs(a - b) < erro, `${a} fora de ${b} ± ${erro}`);

test('a energia dos dois compartimentos equivale ao calor líquido em cada intervalo', () => {
  const antes = { centralC: 37.9, peleC: 34 };
  const { estado, detalhe: d } = passoTermico(antes, { temperatura: 31, umidade: 75, esforco: 0.4 }, 5);
  perto(d.armazenamentoW, d.calorMetabolicoW - d.perdaSecaW - d.perdaRespiratoriaW - d.evaporacaoW);
  perto(calorEntreEstados(antes, estado), d.armazenamentoW * 300 / 1000);
  perto(d.suorProduzidoMl, d.suorEvaporadoMl + d.suorEscorridoMl);
});

test('com o mesmo corpo, a umidade reduz a capacidade de evaporar e eleva a retenção de calor', () => {
  const estado = { centralC: 38, peleC: 35 };
  const a = passoTermico(estado, { temperatura: 31, umidade: 25, esforco: 0.4 }, 5);
  const b = passoTermico(estado, { temperatura: 31, umidade: 75, esforco: 0.4 }, 5);
  assert.ok(b.detalhe.capacidadeEvaporativaW < a.detalhe.capacidadeEvaporativaW);
  assert.ok(b.suorEvaporadoL < a.suorEvaporadoL);
  assert.ok(b.detalhe.calorRetidoKJ > a.detalhe.calorRetidoKJ);
  const repouso = passoTermico(INICIAL_TERMICO, { temperatura: 22, umidade: 45, esforco: 0 }, 5);
  assert.equal(repouso.suorEvaporadoL, 0);
});

test('as caminhadas mantêm o controle e ligam o total de suor ao balanço hídrico', () => {
  const [seco, umido] = ['arSeco', 'arUmido'].map((id) => simularTrajetoria(id, 1, { detalharDia: 0 }));
  const inicio = 210, fim = 219, recuperacao = 222;
  assert.deepEqual(seco.leitura[inicio - 1], umido.leitura[inicio - 1]);
  assert.equal(seco.dias[0].treinoMin, 45);
  assert.equal(umido.dias[0].treinoMin, 45);
  const a = seco.leitura[fim], b = umido.leitura[fim];
  assert.ok(b.termorregulacao.centralC > a.termorregulacao.centralC);
  assert.ok(b.plasmaL < a.plasmaL);
  assert.ok(umido.leitura[recuperacao].termorregulacao.centralC < b.termorregulacao.centralC);
  for (const resultado of [seco, umido]) {
    const janela = resultado.leitura.slice(inicio, fim);
    perto(janela.reduce((s, p) => s + p.suorL, 0) * 1000, janela.reduce((s, p) => s + p.termorregulacao.suorProduzidoMl, 0));
    perto(janela.reduce((s, p) => s + p.entradaAguaMl, 0), 0);
    assert.equal(resultado.leitura[fim].entradaAguaMl, 300);
  }
  assert.equal(simularTrajetoria('calor', 1, { detalharDia: 0 }).leitura[fim].termorregulacao, undefined);
});
