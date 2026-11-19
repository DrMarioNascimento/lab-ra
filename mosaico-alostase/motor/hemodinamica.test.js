import test from 'node:test';
import assert from 'node:assert/strict';
import { P } from './parametros.js';
import { pressaoArterial, formaRelogio, pesoSono } from './hemodinamica.js';

const SONO = [{ inicio: 23, fim: 7 }];
const perto = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} deveria estar a ${tol} de ${b}`);
function medias(sono, opc) {
  const v = { sis: 0, dia: 0, n: 0 }, d = { sis: 0, dia: 0, n: 0 };
  for (let m = 0; m < 1440; m += 10) {
    const h = m / 60, x = pressaoArterial(h, sono, opc), alvo = pesoSono(h, sono) === 1 ? d : pesoSono(h, sono) === 0 ? v : null;
    if (alvo) { alvo.sis += x.sis; alvo.dia += x.dia; alvo.n++; }
  }
  return { vig: [v.sis / v.n, v.dia / v.n], sono: [d.sis / d.n, d.dia / d.n] };
}

test('forma do relógio: vale às 3 h, zero às 10 h e às 20 h, queda pequena às 15 h', () => {
  perto(formaRelogio(3), 1, 1e-9); perto(formaRelogio(10), 0, 1e-9); perto(formaRelogio(20), 0, 1e-9); perto(formaRelogio(15), 0.2, 1e-9);
  for (let m = 0; m <= 1440; m += 10) { const v = formaRelogio(m / 60); assert.ok(v >= -1e-9 && v <= 1 + 1e-9); }
});

test('rotina padrão: médias de vigília e de sono batem com a fonte (1 mmHg)', () => {
  const r = medias(SONO), p = P.pressaoArterial;
  perto(r.vig[0], p.sistolica.vigilia, 1); perto(r.vig[1], p.diastolica.vigilia, 1);
  perto(r.sono[0], p.sistolica.sono, 2.5); perto(r.sono[1], p.diastolica.sono, 2.5);
});

test('às 3 h dormindo a pressão é a menor do dia; às 10 h acordado, a maior', () => {
  const pts = []; for (let m = 0; m < 1440; m += 10) pts.push(pressaoArterial(m / 60, SONO).sis);
  const min = Math.min(...pts), max = Math.max(...pts);
  perto(pressaoArterial(3, SONO).sis, min, 1); perto(pressaoArterial(10, SONO).sis, max, 3);
});

test('quem dorme de dia: a queda por sono aparece, mas menor que a noturna (o relógio fica fora de fase)', () => {
  const noite = pressaoArterial(3, SONO).sis, dia = pressaoArterial(12, [{ inicio: 8, fim: 16 }]).sis, acordadoMeioDia = pressaoArterial(12, SONO).sis;
  assert.ok(dia < acordadoMeioDia, 'dormir de dia derruba a pressão');
  assert.ok(dia > noite, 'mas não tanto quanto dormir de noite');
});

test('trabalho noturno crônico soma o efeito da meta-análise', () => {
  const a = pressaoArterial(12, SONO), b = pressaoArterial(12, SONO, { trabalhoNoturnoCronico: true });
  perto(b.sis - a.sis, 2.52, 0.11); perto(b.dia - a.dia, 1.76, 0.11);
});
