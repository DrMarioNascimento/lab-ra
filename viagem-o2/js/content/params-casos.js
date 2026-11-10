// Parâmetros de cada caso: "base" = mesma pessoa/esforço sem a alteração; "real" = o que aconteceu.
export const REPOUSO = { patm: 760, fio2: 0.21, vgain: 1, hco3d: 0, vdvt: 0.3, aa: 8, hb: 15, dpg: 5, fc: 70, vs: 72, rpt: 18, fm: 0.2, vo2dem: 250, rq: 0.8, tcore: 37, tmus: 36, lacbase: 1, pcrit: 10 };
export const EXERCICIO = { ...REPOUSO, vdvt: 0.15, aa: 18, fc: 175, vs: 115, rpt: 5, fm: 0.82, vo2dem: 3000, rq: 0.98, tcore: 38.5, tmus: 39.5, lacbase: 3 };

const corridaF = { ...EXERCICIO, hb: 13.8, fc: 172, vs: 96, rpt: 5.8, fm: 0.8, vo2dem: 2250, rq: 0.96, tcore: 38.6, tmus: 39.4, lacbase: 2.5 };
const trail = { ...EXERCICIO, hb: 15.2, fc: 165, vs: 112, rpt: 5.4, fm: 0.8, vo2dem: 2450, rq: 0.95, tcore: 38.4, tmus: 39.3, lacbase: 2.2 };
const cooper = { ...EXERCICIO, hb: 14.2, fc: 178, vs: 85, rpt: 6.0, fm: 0.78, vo2dem: 1900, rq: 0.97, tcore: 38.3, tmus: 39.2, lacbase: 3.2 };
const queimada = { ...EXERCICIO, hb: 13.2, vdvt: 0.18, aa: 15, fc: 168, vs: 70, rpt: 7.2, fm: 0.75, vo2dem: 1350, rq: 0.95, tcore: 38.0, tmus: 38.8, lacbase: 2.8 };
const natacao = { ...EXERCICIO, hb: 14.0, fc: 160, vs: 105, rpt: 6.0, fm: 0.78, vo2dem: 2100, rq: 0.95, tcore: 37.8, tmus: 38.6, lacbase: 2.5 };
const esteira = { ...REPOUSO, hb: 13.8, vdvt: 0.22, aa: 12, fc: 128, vs: 82, rpt: 11, fm: 0.65, vo2dem: 1150, rq: 0.92, tcore: 37.6, tmus: 38.2, lacbase: 1.8 };

export const PARAMS = {
  B1: { base: corridaF, real: { ...corridaF, hb: 10.6, dpg: 5.9, fc: 186, vs: 98 } },
  B2: { base: trail, real: { ...trail, patm: 495, dpg: 5.6, aa: 24, fc: 172, hco3d: -3 } },
  L1: { base: cooper, real: { ...cooper, vs: 70, fc: 196, fm: 0.64, rpt: 5.3, tcore: 39.4, tmus: 40.3, lacbase: 3.8 } },
  L2: { base: queimada, real: { ...queimada, vgain: 0.68, vdvt: 0.32, aa: 20, fc: 182 } },
  F1: { base: natacao, real: { ...natacao, aa: 62, fc: 168 } },
  F2: { base: esteira, real: { ...esteira, fc: 104, vs: 68, rpt: 13.5, fm: 0.62 } },
};
