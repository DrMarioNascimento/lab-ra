// Mosaico Alostase · pressão arterial ao longo do dia (ficha 08).
// Duas partes, como em Degaute 1991: o que vem de deitar e dormir (segue o sono) e o que vem do relógio.
import { P } from './parametros.js';

const mod24 = (h) => ((h % 24) + 24) % 24;
const dentro = (h, ini, fim) => (ini <= fim ? h >= ini && h < fim : h >= ini || h < fim);

/** Componente do relógio: 1 no vale (3 h), 0 nos picos, interpolação em cosseno entre os pontos da fonte. */
export function formaRelogio(hora) {
  const pts = P.pressaoArterial.pontosRelogio;
  const h = mod24(hora);
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const ha = a.hora, hb = b.hora + (i === n - 1 ? 24 : 0);
    const x = h < ha ? h + 24 : h;
    if (x >= ha && x <= hb) {
      const u = (x - ha) / (hb - ha);
      return a.v + (b.v - a.v) * (1 - Math.cos(Math.PI * u)) / 2;
    }
  }
  return 0;
}

/** Peso do sono, de 0 (acordado) a 1 (dormindo), com rampa de descida e de subida. */
export function pesoSono(hora, sono) {
  const r = P.pressaoArterial.rampaSonoH.valor;
  const h = mod24(hora);
  let w = 0;
  for (const b of sono) {
    const ini = mod24(b.inicio), fim = mod24(b.fim);
    if (dentro(h, ini, fim)) {
      const desde = mod24(h - ini), ate = mod24(fim - h);
      w = Math.max(w, Math.min(1, desde / r, ate / r));
    }
  }
  return w;
}

// Linha de base acordado: calibrada para que a média da vigília e a do sono de uma rotina padrão (23 h às 7 h)
// batam com as médias da fonte, dado o peso de cada componente.
const PADRAO = [{ inicio: 23, fim: 7 }];
function calibrar(par) {
  const { partePostura } = P.pressaoArterial;
  const queda = par.vigilia - par.sono;
  let somaV = 0, nV = 0;
  for (let m = 0; m < 1440; m += 10) {
    const h = m / 60;
    if (pesoSono(h, PADRAO) === 0) { somaV += (1 - partePostura.valor) * queda * formaRelogio(h); nV++; }
  }
  return par.vigilia + somaV / nV;
}
const BASE = { sis: calibrar(P.pressaoArterial.sistolica), dia: calibrar(P.pressaoArterial.diastolica) };

/**
 * Pressão esperada numa hora do dia, para uma pessoa normotensa.
 * @param {number} hora hora do relógio (0 a 24)
 * @param {Array} sono blocos { inicio, fim }
 * @param {object} [opc] { deslocamentoRelogioH, trabalhoNoturnoCronico }
 */
export function pressaoArterial(hora, sono, opc = {}) {
  const { sistolica, diastolica, partePostura, efeitoCronicoNoturnoSistolica: es, efeitoCronicoNoturnoDiastolica: ed } = P.pressaoArterial;
  const desloc = opc.deslocamentoRelogioH || 0;
  const w = pesoSono(hora, sono);
  const c = formaRelogio(hora - desloc);
  const cron = opc.trabalhoNoturnoCronico ? 1 : 0;
  const f = (par, base, efeito) => base - partePostura.valor * (par.vigilia - par.sono) * w - (1 - partePostura.valor) * (par.vigilia - par.sono) * c + cron * efeito.valor;
  return { sis: +f(sistolica, BASE.sis, es).toFixed(1), dia: +f(diastolica, BASE.dia, ed).toFixed(1) };
}
