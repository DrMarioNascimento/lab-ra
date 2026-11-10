# Modelo fisiológico (versão de projeto, não aparece para o aluno)

Cadeia em `js/model.js`, resolvida por iteração até convergir:

1. PIO₂ = (Patm − 47) × FiO₂ (Dalton, vapor a 37 °C).
2. Controle ventilatório: alvo de PaCO₂ = 40 − 1,5 × (lactato − 1) − 0,35 × (70 − PaO₂, se PaO₂ < 70) − 0,8 × (Tcentral − 38,5, se > 38,5). VA = capacidade × 0,863 × VCO₂ / alvo.
3. PAO₂ = PIO₂ − PaCO₂ × [FiO₂ + (1 − FiO₂)/R]; PaO₂ = PAO₂ − gradiente A-a.
4. Curva: Severinghaus (1979) sobre PO₂ virtual = PO₂ × 26,8/P50. P50 = 26,8 × 10^(0,48 × (7,4 − pH) + 0,024 × (T − 37)) + 0,6 × (2,3-DPG − 5). O coeficiente do 2,3-DPG é aproximado.
5. CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂.
6. DC = FC × VS; PAM = DC × RPT; fluxo muscular = DC × fração muscular (resistência arteriolar e esfíncteres pré-capilares representados pela fração e pela RPT).
7. Músculo: VO₂ máximo = Qm × 10 × (CaO₂ − CvO₂ na PO₂ crítica), com curva desviada por pH e temperatura musculares (Bohr). Déficit de O₂ → lactato (+1 mmol/L por ~120 mL/min de déficit).
8. Tecidos não musculares: ~220 mL/min. Venoso misto ponderado pelo fluxo; PvO₂ por inversão da curva.
9. pH arterial por Henderson-Hasselbalch; HCO₃⁻ = 24 + ajuste renal − (lactato − 1).
10. Tempo de trânsito pulmonar = volume capilar (62,5 → 200 mL, recrutamento com o débito) ÷ fluxo.

Valores de controle (repouso e exercício), conferidos: PaO₂ 94 / 94 mmHg, SaO₂ 97 / 97%, CaO₂ 19,8 / 19,7 mL/dL, DC 5 / 20 L/min, SvO₂ 73 / 23%, PvO₂ 41 / 20 mmHg, trânsito 0,75 / 0,39 s.

Simplificações conhecidas: sem cinética (estado estável), shunt e V/Q resumidos no gradiente A-a, tampões além do bicarbonato não modelados, temperatura e pH musculares impostos pelo caso.
