// Modelo fisiológico em cadeia da Viagem do O2.
// Ventilação → gás alveolar → gradiente A-a → curva de dissociação (Severinghaus + Bohr/temperatura/2,3-DPG)
// → CaO2 → débito e distribuição (resistência arteriolar / esfíncteres pré-capilares) → extração muscular (Pcrit)
// → sangue venoso misto → CO2 e pH.
// Unidades: pressões em mmHg, fluxos em L/min, VO2/VCO2 em mL/min, conteúdos em mL O2/dL.

export const PARAM_META = {
  patm:       { label: "Pressão atmosférica", unit: "mmHg", min: 380, max: 780, step: 5 },
  fio2:       { label: "FiO₂", unit: "", min: 0.15, max: 0.6, step: 0.01 },
  vgain:      { label: "Capacidade ventilatória (vias aéreas e controle)", unit: "×", min: 0.3, max: 1.6, step: 0.05 },
  vdvt:       { label: "Espaço morto (VD/VT)", unit: "", min: 0.1, max: 0.6, step: 0.01 },
  aa:         { label: "Gradiente alvéolo-arterial", unit: "mmHg", min: 2, max: 70, step: 1 },
  hb:         { label: "Hemoglobina", unit: "g/dL", min: 6, max: 20, step: 0.1 },
  dpg:        { label: "2,3-DPG", unit: "mmol/L", min: 3, max: 8, step: 0.1 },
  fc:         { label: "Frequência cardíaca", unit: "bpm", min: 40, max: 210, step: 1 },
  vs:         { label: "Volume sistólico", unit: "mL", min: 30, max: 200, step: 1 },
  rpt:        { label: "Resistência periférica total", unit: "mmHg·min/L", min: 2.5, max: 25, step: 0.1 },
  fm:         { label: "Fração do débito para o músculo ativo", unit: "", min: 0.15, max: 0.9, step: 0.01 },
  vo2dem:     { label: "Demanda de O₂", unit: "mL/min", min: 250, max: 5000, step: 10 },
  rq:         { label: "Quociente respiratório", unit: "", min: 0.7, max: 1.1, step: 0.01 },
  tcore:      { label: "Temperatura central", unit: "°C", min: 36, max: 41, step: 0.1 },
  tmus:       { label: "Temperatura muscular", unit: "°C", min: 35, max: 42, step: 0.1 },
  lacbase:    { label: "Lactato pela intensidade", unit: "mmol/L", min: 0.5, max: 12, step: 0.1 },
  pcrit:      { label: "PO₂ crítica do tecido", unit: "mmHg", min: 5, max: 30, step: 1 },
  hco3d:      { label: "Ajuste renal de bicarbonato", unit: "mmol/L", min: -8, max: 4, step: 0.5 },
};


export function p50(pH, temp, dpg) {
  return 26.8 * Math.pow(10, 0.48 * (7.4 - pH) + 0.024 * (temp - 37)) + 0.6 * (dpg - 5);
}

// Severinghaus (1979) sobre a PO2 "virtual" corrigida pelo desvio da curva.
export function sat(po2, p50v = 26.8) {
  const p = Math.max(0.1, po2 * (26.8 / p50v));
  return 1 / (23400 / (p * p * p + 150 * p) + 1);
}

export function content(hb, po2, p50v) {
  return 1.34 * hb * sat(po2, p50v) + 0.003 * po2;
}

function po2FromContent(c, hb, p50v) {
  let lo = 0.5, hi = 700;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (content(hb, mid, p50v) < c) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export function compute(input) {
  const p = { ...input };
  const pio2 = (p.patm - 47) * p.fio2;
  const dc = (p.fc * p.vs) / 1000;
  const qm = Math.max(0.2, dc * p.fm);
  const qo = Math.max(0.5, dc - qm);
  const VO2_ORGANS = Math.min(220, 0.8 * p.vo2dem); // tecidos não musculares
  const vo2mDem = Math.max(0, p.vo2dem - VO2_ORGANS);

  let vo2 = p.vo2dem;
  let lactate = p.lacbase;
  let pao2Prev = 95;
  let r = {};
  for (let it = 0; it < 40; it++) {
    const vco2 = p.rq * vo2;
    // Controle da ventilação: alvo de PaCO2 cai com o lactato (compensação), com a hipoxemia (quimiorreceptores
    // periféricos) e com a hipertermia. A capacidade ventilatória (vgain) limita quanto do alvo é atingido.
    const alvo = Math.max(18, 40 - 1.5 * (lactate - 1)
      - (pao2Prev < 70 ? 0.35 * (70 - pao2Prev) : 0)
      - (p.tcore > 38.5 ? 0.8 * (p.tcore - 38.5) : 0));
    const va = (p.vgain * 0.863 * vco2) / alvo;
    const paco2 = (0.863 * vco2) / va;
    const pAo2 = pio2 - paco2 * (p.fio2 + (1 - p.fio2) / p.rq);
    const pao2 = Math.max(18, pAo2 - p.aa);
    const hco3 = Math.max(8, 24 + (p.hco3d || 0) - (lactate - 1));
    const pHa = 6.1 + Math.log10(hco3 / (0.03 * paco2));
    const p50a = p50(pHa, p.tcore, p.dpg);
    const sao2 = sat(pao2, p50a);
    const cao2 = content(p.hb, pao2, p50a);

    const pHm = pHa - 0.08 - 0.02 * lactate;
    const p50m = p50(pHm, p.tmus, p.dpg);
    const cvMin = content(p.hb, p.pcrit, p50m);
    const vo2mMax = Math.max(0, qm * 10 * (cao2 - cvMin));
    const vo2m = Math.min(vo2mDem, vo2mMax);
    const cvm = cao2 - vo2m / (qm * 10);
    const cvo = Math.max(cvMin, cao2 - VO2_ORGANS / (qo * 10));
    const cvMix = (qm * cvm + qo * cvo) / (qm + qo);
    const deficit = vo2mDem - vo2m;

    const newVo2 = vo2m + VO2_ORGANS;
    const newLac = p.lacbase + Math.min(14, deficit / 120);

    const tv = p.tcore + p.fm * (p.tmus - p.tcore) * 0.5;
    const pHv = pHa - 0.04 - 0.015 * lactate;
    const p50v = p50(pHv, tv, p.dpg);
    const pvo2 = po2FromContent(cvMix, p.hb, p50v);
    const svo2 = sat(pvo2, p50v);
    const pvm = po2FromContent(cvm, p.hb, p50m);

    const vc = Math.min(0.2, Math.max(0.06, 0.0625 + 0.0045 * (dc - 5)));
    const transit = vc / (dc / 60);
    const pvco2 = paco2 + 2 * (vco2 / (dc * 10));
    const ve = va / (1 - p.vdvt);

    r = {
      pio2, pAo2, pao2, paco2, aa: pAo2 - pao2, ve, va, vdvt: p.vdvt,
      sao2, cao2, hb: p.hb, p50a, pHa, hco3, lactate,
      dc, fc: p.fc, vs: p.vs, pam: dc * p.rpt, rpt: p.rpt, fm: p.fm, qm, qo,
      do2: dc * cao2 * 10, vo2, vo2dem: p.vo2dem, deficit, vco2,
      cvMix, cvm, avdiff: cao2 - cvMix, extracao: (cao2 - cvMix) / cao2, extracaoMus: (cao2 - cvm) / cao2,
      pvo2, svo2, pvm, p50m, pHm, pHv, pvco2, transit, tcore: p.tcore, tmus: p.tmus,
      atendido: vo2mDem > 0 ? vo2m / vo2mDem : 1,
    };
    if (it > 3 && Math.abs(newVo2 - vo2) < 0.5 && Math.abs(newLac - lactate) < 0.01 && Math.abs(pao2 - pao2Prev) < 0.05) break;
    vo2 = (vo2 + newVo2) / 2;
    lactate = (lactate + newLac) / 2;
    pao2Prev = (pao2Prev + pao2) / 2;
  }
  return r;
}

// Variáveis exibidas, com formato. "dir" = variável usada nas previsões de memória.
export const VAR_META = {
  ve:      { label: "Ventilação minuto", unit: "L/min", d: 0 },
  paco2:   { label: "PaCO₂", unit: "mmHg", d: 0 },
  pAo2:    { label: "PAO₂ (alveolar)", unit: "mmHg", d: 0 },
  pio2:    { label: "PO₂ inspirada", unit: "mmHg", d: 0 },
  pao2:    { label: "PaO₂", unit: "mmHg", d: 0 },
  aa:      { label: "Gradiente A-a", unit: "mmHg", d: 0 },
  transit: { label: "Tempo de trânsito capilar", unit: "s", d: 2 },
  sao2:    { label: "SaO₂", unit: "%", d: 0, pct: true },
  cao2:    { label: "CaO₂", unit: "mL/dL", d: 1 },
  hb:      { label: "Hemoglobina", unit: "g/dL", d: 1 },
  fc:      { label: "Frequência cardíaca", unit: "bpm", d: 0 },
  vs:      { label: "Volume sistólico", unit: "mL", d: 0 },
  dc:      { label: "Débito cardíaco", unit: "L/min", d: 1 },
  pam:     { label: "Pressão arterial média", unit: "mmHg", d: 0 },
  rpt:     { label: "Resistência periférica", unit: "mmHg·min/L", d: 1 },
  qm:      { label: "Fluxo para o músculo ativo", unit: "L/min", d: 1 },
  avdiff:  { label: "Diferença a-v de O₂", unit: "mL/dL", d: 1 },
  extracaoMus: { label: "Extração no músculo", unit: "%", d: 0, pct: true },
  lactate: { label: "Lactato", unit: "mmol/L", d: 1 },
  pvm:     { label: "PO₂ venosa do músculo", unit: "mmHg", d: 0 },
  pvo2:    { label: "PvO₂ (venoso misto)", unit: "mmHg", d: 0 },
  svo2:    { label: "SvO₂", unit: "%", d: 0, pct: true },
  pHa:     { label: "pH arterial", unit: "", d: 2 },
  pvco2:   { label: "PvCO₂", unit: "mmHg", d: 0 },
  vo2:     { label: "VO₂ atingido", unit: "mL/min", d: 0 },
  do2:     { label: "Oferta de O₂ (DO₂)", unit: "mL/min", d: 0 },
};

export const CURTO = { ve: "VE", paco2: "PaCO₂", pAo2: "PAO₂", pio2: "PIO₂", pao2: "PaO₂", aa: "A-a", transit: "Trânsito", sao2: "SaO₂", cao2: "CaO₂", hb: "Hb", fc: "FC", vs: "VS", dc: "DC", pam: "PAM", rpt: "RPT", qm: "Fluxo muscular", avdiff: "a-v O₂", extracaoMus: "Extração", lactate: "Lactato", pvm: "PvO₂ músculo", pvo2: "PvO₂", svo2: "SvO₂", pHa: "pH", pvco2: "PvCO₂", vo2: "VO₂", do2: "DO₂" };

export function fmtVar(key, value) {
  const m = VAR_META[key];
  if (!m || value == null || Number.isNaN(value)) return "—";
  const v = m.pct ? value * 100 : value;
  return v.toFixed(m.d).replace(".", ",");
}

// Faixas para corrigir a previsão de memória: tolerância relativa da "faixa aproximada".
export function sameBand(key, predicted, real) {
  const m = VAR_META[key];
  const r = m.pct ? real * 100 : real;
  if (r === 0) return Math.abs(predicted) < 1;
  const tol = key === "pHa" ? 0.05 : key === "transit" ? 0.12 : Math.max(Math.abs(r) * 0.15, 2);
  return Math.abs(predicted - r) <= tol;
}

export function direction(key, base, real) {
  const b = base, r = real;
  const rel = Math.abs(r - b) / Math.max(Math.abs(b), 1e-6);
  const thr = key === "pHa" ? 0.002 : 0.05;
  if (rel < thr) return "=";
  return r > b ? "↑" : "↓";
}
