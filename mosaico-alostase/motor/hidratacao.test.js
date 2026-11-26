import assert from 'node:assert/strict';
import test from 'node:test';
import { CENARIOS_HIDRICOS, simularHidratacao } from './bancada-hidrica.js';
import { acoplarCirculacao, compartimentos, hidratar, passoHidrico } from './hidratacao.js';

const perto = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} ≠ ${b}`);

test('compartimentos começam nos valores de referência e perda de água concentra os solutos', () => {
  const estado = hidratar();
  assert.equal(compartimentos(estado).plasmaL, 3);
  assert.equal(compartimentos(estado).osmolalidade, 285);
  assert.ok(compartimentos({ ...estado, aguaL: 41 }).osmolalidade > 285);
});

test('passo conserva água e sódio mesmo com absorção ainda incompleta', () => {
  const inicial = hidratar();
  const { estado, fluxos } = passoHidrico(inicial, { aguaMl: 400, sodioMg: 160, temperatura: 34, umidade: 60, esforco: 0.4 }, 5);
  perto(estado.aguaL + estado.aguaDigestivaL + fluxos.suorL + fluxos.urinaL + fluxos.perdaInsensivelL, 42.4);
  perto(estado.sodioDeltaMg + estado.sodioDigestivoMg + fluxos.sodioSuorMg + fluxos.sodioUrinaMg, 160);
});

test('trocar somente o calor muda suor e volume, sem deslocar as curvas antes do evento', () => {
  const fresco = simularHidratacao(CENARIOS_HIDRICOS.fresco);
  const calor = simularHidratacao(CENARIOS_HIDRICOS.calor);
  assert.deepEqual(fresco.pontos[200], calor.pontos[200]);
  assert.ok(calor.totais.suorL > fresco.totais.suorL);
  assert.ok(calor.pontos[219].plasmaL < fresco.pontos[219].plasmaL);
  perto(calor.estado.aguaL + calor.estado.aguaDigestivaL + calor.totais.urinaL + calor.totais.suorL + calor.totais.perdaInsensivelL, 42 + calor.totais.aguaMl / 1000);
});

test('a compensação cardiovascular reduz VS, eleva FC e mantém as identidades do modelo', () => {
  const basal = { fc: 70, sis: 120, dia: 75, pam: 90 };
  const a = acoplarCirculacao(basal, 3, 0);
  const b = acoplarCirculacao(basal, 2.85, 0);
  assert.ok(b.volumeSistolico < a.volumeSistolico);
  assert.ok(b.fc > a.fc);
  perto(b.pam, b.debito * b.resistencia);
  perto(b.pam, b.dia + (b.sis - b.dia) / 3);
});

test('a angiotensina II do intervalo anterior altera a resistência e a pressão atuais', () => {
  const basal = { fc: 70, sis: 120, dia: 75, pam: 90 };
  const a = acoplarCirculacao(basal, 3, 0, 100);
  const b = acoplarCirculacao(basal, 3, 0, 125);
  assert.ok(b.resistencia > a.resistencia);
  assert.ok(b.pam > a.pam);
  assert.equal(b.debito, a.debito);
});
