import test from 'node:test';
import assert from 'node:assert/strict';
import { P } from './parametros.js';
import { cortisolBase, fatorExercicio, simularDia, faixaCortisol, PASSO_MIN } from './motor.js';
import { ROTINAS } from './rotinas-exemplo.js';

const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} deveria estar a ${tol} de ${b}`);

test('cortisol: pico, nadir e cruzamentos do mesor nos horários de Debono', () => {
  const c = P.cortisol;
  perto(cortisolBase(c.pico.hora), 15.5, 0.01);
  perto(cortisolBase(c.nadir.hora), 2.0, 0.01);
  perto(cortisolBase(c.repousoFim.hora), 5.2, 0.01);
  perto(cortisolBase(c.repousoIni.hora), 5.2, 0.01);
});

test('cortisol: curva contínua, com um pico e um nadir, e abaixo do mesor na fase de repouso', () => {
  let max = -1, min = 99, salto = 0, ant = cortisolBase(0);
  for (let m = 0; m <= 1440; m += 5) {
    const v = cortisolBase(m / 60);
    max = Math.max(max, v); min = Math.min(min, v); salto = Math.max(salto, Math.abs(v - ant)); ant = v;
  }
  perto(max, 15.5, 0.02); perto(min, 2.0, 0.02);
  assert.ok(salto < 0.6, `salto de ${salto} em 5 min`);
  for (const h of [20.5, 22, 23.5, 1, 3, 5]) assert.ok(cortisolBase(h) < 5.2, `às ${h}h deveria estar abaixo do mesor`);
  for (const h of [6.5, 9, 12, 15, 19]) assert.ok(cortisolBase(h) > 5.2, `às ${h}h deveria estar acima do mesor`);
});

test('cortisol: área de 24 h e média dentro do intervalo de Debono', () => {
  let area = 0;
  for (let m = 0; m < 1440; m++) area += cortisolBase((m + 0.5) / 60) / 60;
  assert.ok(area >= P.cortisol.auc24.min && area <= P.cortisol.auc24.max, `área ${area.toFixed(1)}`);
  perto(area, 160.2, 2);
  const media = area / 24;
  assert.ok(media >= 5.9 && media <= 7.5, `média ${media.toFixed(2)}`);
});

test('exercício: sem efeito a 40%, efeito crescente até 80%, nada abaixo de 10 min', () => {
  assert.equal(fatorExercicio(40, 30), 1);
  assert.equal(fatorExercicio(80, 5), 1);
  assert.ok(fatorExercicio(60, 30) > 1 && fatorExercicio(60, 30) < fatorExercicio(80, 30));
  perto(fatorExercicio(80, 30), 1.75, 1e-9);
  perto(fatorExercicio(80, 90), 1.75, 1e-9);          // acima de 30 min não cresce: sem dado lido
});

test('exercício: o mesmo treino parte de bases diferentes de manhã e à noite', () => {
  const dia = (ini) => simularDia({ sono: [{ inicio: 23, fim: 7 }], jornadas: [{ tipo: 'exercicio', inicio: ini, fim: ini + 0.5, vo2: 80 }] });
  const em = (r, h) => r.pontos.find((p) => Math.abs(p.hora - h) < 1e-6);
  const manha = em(dia(8), 8.5), noite = em(dia(19), 19.5);
  perto(manha.cortisol / manha.cortisolBase, 1.75, 0.01);
  perto(noite.cortisol / noite.cortisolBase, 1.75, 0.01);
  assert.ok(manha.cortisol - manha.cortisolBase > 2 * (noite.cortisol - noite.cortisolBase));
  // a 80% o valor se mantém 30 min depois do fim (VanBruggen)
  perto(em(dia(19), 20).cortisol - em(dia(19), 20).cortisolBase, noite.cortisol - noite.cortisolBase, 0.3);
});

test('glicemia: base, pico e tempo do pico conforme Freckmann; fica na faixa de 70 a 180', () => {
  const r = simularDia(ROTINAS.diurna);
  const antes = r.pontos.find((p) => Math.abs(p.hora - 7.5) < 1e-6);
  perto(antes.glicemia, 92.8, 1.5);
  const janela = r.pontos.filter((p) => p.hora > 7.5 && p.hora < 10);
  const pico = janela.reduce((a, b) => (b.glicemia > a.glicemia ? b : a));
  perto(pico.glicemia, 92.8 + 50.9, 1.5);
  perto((pico.hora - 7.5) * 60, 50, PASSO_MIN);
  for (const p of r.pontos) assert.ok(p.glicemia >= 70 && p.glicemia <= 180);
  const madrugada = r.pontos.filter((p) => p.hora >= 2 && p.hora <= 5);
  for (const p of madrugada) perto(p.glicemia, 92.8, 1);
});

test('pressão de sono: sobe acordado, cai dormindo, fica entre 0 e 1', () => {
  const r = simularDia(ROTINAS.diurna);
  const em = (h) => r.pontos.find((p) => Math.abs(p.hora - h) < 1e-6).pressaoSono;
  assert.ok(em(22.5) > em(12) && em(12) > em(7.5));
  assert.ok(em(6.5) < em(1));
  for (const p of r.pontos) assert.ok(p.pressaoSono > 0 && p.pressaoSono < 1);
  const curta = simularDia(ROTINAS.noiteAtiva);
  assert.ok(Math.min(...curta.pontos.map((p) => p.pressaoSono)) > Math.min(...r.pontos.map((p) => p.pressaoSono)), 'com 5 h de sono a pressão não zera tanto');
});

test('jornada noturna: nas primeiras noites o cortisol não se desloca e o sono cai na fase ativa', () => {
  const r = simularDia(ROTINAS.noturna);
  for (const p of r.pontos) assert.equal(p.cortisol, p.cortisolBase);
  const pico = r.pontos.reduce((a, b) => (b.cortisol > a.cortisol ? b : a));
  perto(pico.hora, 8.5, 0.2);
  assert.ok(pico.dormindo);
  assert.ok(r.alertas.some((a) => a.tipo === 'sono-na-fase-ativa'));
  assert.ok(!simularDia(ROTINAS.diurna).alertas.some((a) => a.tipo === 'sono-na-fase-ativa'));
});

test('noite ativa: o álcool tira REM, não horas', () => {
  const r = simularDia(ROTINAS.noiteAtiva);
  assert.equal(r.sonoQualidade.horas, 5);
  perto(r.sonoQualidade.remPerdidoMin, 40.4 * 0.75, 0.1);
  assert.equal(simularDia({ ...ROTINAS.noiteAtiva, alcoolGkg: 0.2 }).sonoQualidade.remPerdidoMin, 0);
});

test('saída: 144 pontos de 10 min e 24 pontos de hora cheia; faixa de tolerância contém o valor', () => {
  const r = simularDia(ROTINAS.diurna);
  assert.equal(r.pontos.length, 144);
  assert.equal(r.porHora.length, 24);
  const [a, b] = faixaCortisol(15.5);
  perto(a, 11.7, 0.01); perto(b, 20.6, 0.01);
});

test('todo parâmetro numérico declara a leitura', () => {
  const ok = new Set(['completo', 'resumo', 'modelagem']);
  const anda = (o, caminho) => {
    if (Array.isArray(o)) return o.forEach((x, i) => anda(x, `${caminho}[${i}]`));
    if (o && typeof o === 'object') {
      if ('valor' in o || 'fator' in o || 'hora' in o) assert.ok(ok.has(o.leitura), `${caminho} sem leitura`);
      for (const [k, v] of Object.entries(o)) anda(v, `${caminho}.${k}`);
    }
  };
  anda(P, 'P');
});
