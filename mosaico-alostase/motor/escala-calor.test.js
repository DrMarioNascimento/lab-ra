import assert from 'node:assert/strict';
import test from 'node:test';
import { ESCALAS_CALOR, planoEscalaCalor, simularEscalaCalor } from './escala-calor.js';
import { conferirEscalaComMorris, conferirEscalaComShafer } from './conferencia-escala.js';
import { simularCardiovascular } from './cardiovascular.js';
import { ajustarPressaoDaRotina, atualizarCargaSono, mediasPressao, variabilidadeInicioSono } from './pressao-desalinhamento.js';
import { atualizarAclimatacao, MEIA_VIDA_SUOR_DIAS } from './aclimatacao.js';

const cenarios = Object.keys(ESCALAS_CALOR).map((escala) => simularEscalaCalor(escala));

test('as três escalas mantêm o mesmo trabalho, sono e água no controle de 28 dias', () => {
  for (const dias of cenarios) {
    assert.equal(dias.length, 28);
    assert.equal(dias.filter(({ plano }) => plano.tipo !== 'Folga').length, 20);
    assert.equal(dias.reduce((total, d) => total + d.plano.duracaoSono, 0), 28 * 480);
    assert.ok(Math.abs(dias.reduce((total, d) => total + d.aguaL, 0) - 85.6) < 1e-9);
  }
  assert.deepEqual(cenarios[0].slice(0, 5), cenarios[2].slice(0, 5));
  assert.equal(cenarios[1][0].detalhe[0].dormindo, true);
  assert.equal(cenarios[1][0].detalhe[56].emTurno, true);
  assert.equal(cenarios[1][0].detalhe[71].emTurno, true);
  assert.equal(cenarios[1][0].detalhe[72].emTurno, false);
  assert.equal(cenarios[1][0].detalhe[48].dormindo, false);
  assert.equal(cenarios[2][7].plano.tipo, 'Noturno');
  assert.equal(cenarios[2][14].plano.tipo, 'Diurno');
});

test('estado hídrico atravessa dias e a folga reduz osmolalidade sem zerar a aclimatação', () => {
  for (const dias of cenarios) {
    for (const [i, d] of dias.entries()) {
      if (i) assert.equal(d.osmInicial, dias[i - 1].osmFinal);
      assert.ok(d.detalhe.every(({ sis, dia, osmolalidade }) => Number.isFinite(sis) && Number.isFinite(dia)
        && osmolalidade > 275 && osmolalidade < 300));
    }
    assert.ok(dias[4].osmPosTurno > dias[4].osmPreTurno);
    assert.ok(dias[7].osmPreTurno < dias[4].osmPreTurno);
    assert.ok(dias[5].indiceAclima > dias[6].indiceAclima);
    assert.ok(dias[7].indiceAclima > 0);
    assert.ok(dias[5].indiceSuorAclima > dias[6].indiceSuorAclima);
    assert.ok(dias[7].indiceSuorAclima > 0);
  }
  assert.deepEqual(simularEscalaCalor('noturna', { dias: 3 }), cenarios[1].slice(0, 3));
});

test('controle de sono mantém horário e isola duas horas a menos nos dias de trabalho noturno', () => {
  const controle = cenarios[2];
  const curta = simularEscalaCalor('alternada', { encurtarSonoNoturno: true });
  assert.deepEqual(curta.slice(0, 7), controle.slice(0, 7));
  assert.equal(planoEscalaCalor('alternada', 7, true).duracaoSono, 360);
  assert.equal(curta[12].plano.duracaoSono, 480);
  assert.equal(curta[7].aguaL, controle[7].aguaL);
  assert.ok(Math.abs(curta[11].dividaSono7dH - controle[11].dividaSono7dH - 10) < 1e-9);
  assert.ok(curta[11].pressaoSonoInicio > controle[11].pressaoSonoInicio);
});

test('o ajuste de aclimatação preserva a FC de repouso ao iniciar o turno', () => {
  for (const dias of cenarios) {
    const d = dias[11];
    assert.ok(d.indiceAclima > 90);
    const inicio = d.plano.inicioTrabalho / 15;
    const fcAntes = d.detalhe[inicio - 1].fc;
    const fcInicial = d.detalhe[inicio].fc;
    assert.ok(Math.abs(fcInicial - fcAntes) < 2);
    assert.ok(d.detalhe[inicio + 1].fc > fcInicial);
  }
});

test('a aclimatação da sudorese cai à metade após a meia-vida sem exposição', () => {
  let estado = { cardiovascular: 0.8, suor: 0.8 };
  for (let dia = 0; dia < MEIA_VIDA_SUOR_DIAS; dia++) estado = atualizarAclimatacao(estado, 0);
  assert.ok(Math.abs(estado.suor - 0.4) < 1e-9);
  assert.ok(atualizarAclimatacao(estado, 90).suor > estado.suor);
});

test('carga persistente se acumula e reduz a queda sistólica sem alterar a pressão em vigília', () => {
  const curva = simularCardiovascular({ sono: [1380, 420] });
  const agudo = mediasPressao(ajustarPressaoDaRotina(curva, 0));
  let carga = 0;
  for (let dia = 0; dia < 14; dia++) carga = atualizarCargaSono(carga, 1);
  assert.ok(Math.abs(carga - 0.5) < 1e-9);
  const persistente = mediasPressao(ajustarPressaoDaRotina(curva, 0, carga));
  assert.equal(persistente.pasVigilia, agudo.pasVigilia);
  assert.ok(persistente.quedaPasPct < agudo.quedaPasPct);
  assert.ok(atualizarCargaSono(carga, 0) < carga);
  assert.ok(Math.abs(variabilidadeInicioSono([23, 1]) - variabilidadeInicioSono([11, 13])) < 1e-9);
});

test('Morris reproduz os quatro alvos e a conferência externa preserva o contraste de Shafer', () => {
  for (const { motor, estudo } of conferirEscalaComMorris()) assert.ok(Math.abs(motor - estudo) < 1e-9);
  const [diurno, noturno] = conferirEscalaComShafer();
  const contraste = diurno.motor - noturno.motor;
  assert.ok(contraste > 0 && Math.abs(contraste - (diurno.estudo - noturno.estudo)) < 1.5);
});
