// Paradas da viagem (revisão da fisiologia geral) e postos das equipes.
// Os valores de cada parada são calculados pelo modelo em repouso e em exercício intenso (ver params-casos.js).

export const LEIS = {
  dalton:    { nome: "Lei de Dalton", curto: "Pressões parciais somam a pressão total" },
  gasAlv:    { nome: "Equação do gás alveolar", curto: "PAO₂ = PIO₂ − PaCO₂/R" },
  bohrVD:    { nome: "Espaço morto (Bohr)", curto: "Parte do ar não troca gás" },
  laplace:   { nome: "Lei de Laplace", curto: "P = 2T/r; surfactante estabiliza o alvéolo" },
  fickDif:   { nome: "Lei de Fick da difusão", curto: "Fluxo ∝ área × gradiente ÷ espessura" },
  henry:     { nome: "Lei de Henry", curto: "Gás dissolvido ∝ pressão parcial" },
  curva:     { nome: "Curva de dissociação e CaO₂", curto: "CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂" },
  bohr:      { nome: "Efeito Bohr", curto: "CO₂, H⁺, calor e 2,3-DPG desviam a curva à direita" },
  dcFcVs:    { nome: "DC = FC × VS", curto: "Débito é frequência vezes volume sistólico" },
  starling:  { nome: "Frank-Starling", curto: "Mais enchimento, mais volume ejetado" },
  paRes:     { nome: "PA = DC × RPT e Poiseuille", curto: "Resistência arteriolar e esfíncteres decidem pressão e destino do fluxo" },
  fickVO2:   { nome: "Princípio de Fick", curto: "VO₂ = DC × (CaO₂ − CvO₂)" },
  haldane:   { nome: "Efeito Haldane", curto: "Hb desoxigenada carrega mais CO₂" },
  hh:        { nome: "Henderson-Hasselbalch", curto: "pH depende de HCO₃⁻ e PaCO₂" },
};

export const PARADAS = [
  {
    id: "ar", titulo: "Ar inspirado e vias aéreas", leis: ["dalton", "bohrVD"],
    texto: "O ar entra com 21% de O₂, mas o que importa para a difusão é a pressão parcial. Nas vias aéreas ele é aquecido e saturado de vapor d'água (47 mmHg a 37 °C), que ocupa parte da pressão total. Cerca de 150 mL de cada respiração ficam nas vias de condução e não chegam à troca: é o espaço morto anatômico.",
    calc: "PIO₂ = (760 − 47) × 0,21 ≈ 150 mmHg",
    valores: ["pio2", "ve"],
    exercicio: "No exercício a ventilação minuto sobe mais de dez vezes, principalmente por volume corrente maior, o que reduz a fração de espaço morto (VD/VT).",
    pergunta: { q: "Subindo para 3.600 m, a fração de O₂ do ar continua 21%. O que muda?", op: ["Nada, porque a fração é a mesma", "A PO₂ inspirada cai, porque a pressão total cai", "Só a umidade do ar muda"], certa: 1, fb: "Dalton: com pressão total menor, a mesma fração dá uma pressão parcial menor." },
  },
  {
    id: "alveolo", titulo: "Alvéolo", leis: ["gasAlv", "laplace"],
    texto: "No alvéolo o O₂ que chega se mistura com o CO₂ que sai do sangue. Quanto mais CO₂ no alvéolo, menos espaço para o O₂: é a equação do gás alveolar. O surfactante reduz a tensão superficial e impede que alvéolos pequenos colapsem (Laplace).",
    calc: "PAO₂ ≈ 150 − 40/0,8 ≈ 100 mmHg",
    valores: ["pAo2", "paco2"],
    exercicio: "Ventilando mais do que a produção de CO₂ exige, a PaCO₂ cai um pouco e a PAO₂ sobe acima de 100 mmHg.",
    pergunta: { q: "Se a pessoa hipoventila e a PaCO₂ sobe para 60 mmHg, a PAO₂…", op: ["sobe", "cai", "não muda"], certa: 1, fb: "Mais CO₂ alveolar ocupa o lugar do O₂: PAO₂ ≈ 150 − 60/0,8 = 75 mmHg." },
  },
  {
    id: "membrana", titulo: "Membrana alvéolo-capilar", leis: ["fickDif", "henry"],
    texto: "O O₂ atravessa a barreira por difusão: o fluxo é proporcional à área e ao gradiente de pressão e inversamente proporcional à espessura (Fick). Dissolvido no plasma, ele obedece a Henry: só 0,003 mL por dL para cada mmHg. Quase todo o resto viaja na hemoglobina.",
    calc: "O₂ dissolvido a 100 mmHg = 0,3 mL/dL",
    valores: ["pao2", "aa"],
    exercicio: "No exercício a área efetiva cresce (recrutamento de capilares), mas o gradiente alvéolo-arterial aumenta, mesmo em pessoas saudáveis.",
    pergunta: { q: "Um edema que espessa a barreira afeta mais…", op: ["a difusão, pelo aumento da espessura", "a fração de O₂ do ar", "a hemoglobina"], certa: 0, fb: "Fick: mais espessura, menos difusão por unidade de tempo." },
  },
  {
    id: "capilar", titulo: "Capilar pulmonar", leis: ["fickDif"],
    texto: "A hemácia passa cerca de 0,75 s no capilar pulmonar em repouso, mas a PO₂ se equilibra com a do alvéolo em cerca de 0,25 s. Essa sobra é a reserva de tempo da difusão. Ventilação e perfusão precisam combinar: alvéolo ventilado sem sangue é espaço morto; sangue passando por alvéolo sem ar é shunt.",
    calc: "Tempo de trânsito ≈ volume capilar ÷ débito",
    valores: ["transit", "pao2"],
    exercicio: "Com o débito alto, o tempo de trânsito cai para perto de 0,4 s. Se a difusão estiver prejudicada (ou a PAO₂ baixa, como na altitude), a reserva acaba e o sangue sai sem se equilibrar.",
    pergunta: { q: "Por que a altitude favorece a dessaturação durante o exercício?", op: ["O débito cai na altitude", "Gradiente menor + trânsito curto: não dá tempo de equilibrar", "A hemoglobina perde afinidade pelo frio"], certa: 1, fb: "Com PAO₂ baixa o gradiente é menor e a difusão é mais lenta; com o trânsito encurtado, falta tempo." },
  },
  {
    id: "hemoglobina", titulo: "Hemoglobina e sangue arterial", leis: ["curva"],
    texto: "Cada grama de hemoglobina carrega até 1,34 mL de O₂. A curva de dissociação é sigmoide: acima de ~60 mmHg ela é plana (segurança na captação); abaixo, é íngreme (facilidade para entregar). Saturação é proporção, conteúdo é quantidade: saturação normal com pouca hemoglobina ainda é pouco O₂.",
    calc: "CaO₂ = 1,34 × 15 × 0,97 + 0,003 × 95 ≈ 20 mL/dL",
    valores: ["sao2", "cao2", "hb"],
    exercicio: "No exercício a SaO₂ quase não muda em pessoas saudáveis; a hemoconcentração pode subir um pouco a hemoglobina.",
    pergunta: { q: "Hb 10 g/dL e SaO₂ 98%. O conteúdo arterial está…", op: ["normal, porque a saturação é normal", "baixo, porque há menos hemoglobina para saturar", "alto"], certa: 1, fb: "1,34 × 10 × 0,98 ≈ 13 mL/dL, contra ~20 do normal." },
  },
  {
    id: "coracao", titulo: "Coração", leis: ["dcFcVs", "starling"],
    texto: "O coração esquerdo bombeia o sangue oxigenado. O débito é frequência vezes volume sistólico. O volume sistólico depende do enchimento (pré-carga, Frank-Starling), da contratilidade e da pós-carga.",
    calc: "DC = 70 × 72 mL ≈ 5 L/min",
    valores: ["fc", "vs", "dc"],
    exercicio: "No exercício o débito chega a 4–5 vezes o de repouso. A FC sobe quase linearmente com a intensidade; o VS sobe no início e tende a estabilizar. Se o volume plasmático cai (desidratação), o VS cai e a FC sobe para compensar.",
    pergunta: { q: "Um atleta desidratado mantém o mesmo ritmo. O que se espera?", op: ["VS cai e FC sobe", "VS sobe e FC cai", "Nada muda"], certa: 0, fb: "Menos volume, menos enchimento (Starling), menos VS; a FC compensa até o limite." },
  },
  {
    id: "arteriolas", titulo: "Arteríolas e distribuição do fluxo", leis: ["paRes"],
    texto: "A pressão arterial média é débito vezes resistência periférica total. As arteríolas são o principal ponto de resistência e, pelo raio (Poiseuille), controlam a pressão a montante e quanto fluxo cada órgão recebe. Os esfíncteres pré-capilares abrem ou fecham leitos capilares, decidindo quantos capilares participam da troca. Simpático, metabólitos locais (CO₂, H⁺, K⁺, adenosina), temperatura e NO ajustam esse controle.",
    calc: "PAM = 5 L/min × 18 ≈ 90 mmHg",
    valores: ["pam", "rpt", "qm"],
    exercicio: "No músculo ativo a vasodilatação metabólica e a abertura de esfíncteres recrutam capilares; em vísceras e rins o simpático contrai. A RPT cai muito, o débito sobe e a PAM sobe pouco. No calor, a pele passa a disputar o débito com o músculo.",
    pergunta: { q: "Se a pele dilata no calor e o débito não aumenta, o que acontece?", op: ["A PAM e o fluxo para o músculo tendem a cair", "Só a temperatura muda", "O músculo recebe mais fluxo"], certa: 0, fb: "Menos resistência com o mesmo débito baixa a pressão, e o fluxo é dividido com a pele." },
  },
  {
    id: "tecido", titulo: "Capilar muscular e mitocôndria", leis: ["bohr", "fickVO2"],
    texto: "No músculo o gradiente se inverte: a PO₂ da mitocôndria é de poucos mmHg. CO₂, H⁺, calor e 2,3-DPG desviam a curva para a direita (Bohr), e a hemoglobina solta mais O₂ na mesma PO₂. O consumo segue o princípio de Fick: fluxo vezes a diferença arteriovenosa.",
    calc: "VO₂ = 5 L/min × (20 − 15) mL/dL ≈ 250 mL/min",
    valores: ["extracaoMus", "pvm", "lactate"],
    exercicio: "No exercício o músculo extrai até ~80–90% do O₂ que recebe. Quando oferta ou extração não acompanham a demanda, a glicólise anaeróbia e o lactato ganham peso.",
    pergunta: { q: "Músculo quente e ácido. A afinidade da Hb pelo O₂…", op: ["aumenta", "diminui, facilitando a entrega", "não muda"], certa: 1, fb: "Efeito Bohr: curva à direita, P50 maior, mais O₂ liberado." },
  },
  {
    id: "retorno", titulo: "Retorno venoso e CO₂", leis: ["haldane", "hh"],
    texto: "O sangue volta com menos O₂ e mais CO₂. Cerca de 70% do CO₂ viaja como bicarbonato (anidrase carbônica na hemácia, com desvio de cloreto), ~20% ligado à hemoglobina e ~10% dissolvido. Hemoglobina desoxigenada carrega mais CO₂ (Haldane). O pH depende da relação bicarbonato/PCO₂.",
    calc: "pH = 6,1 + log(24 ÷ (0,03 × 40)) ≈ 7,40",
    valores: ["svo2", "pvo2", "pvco2"],
    exercicio: "No exercício a SvO₂ despenca (venoso misto pode ficar abaixo de 30%) e a PvCO₂ sobe muito. O lactato consome bicarbonato, e a ventilação compensa baixando a PaCO₂.",
    pergunta: { q: "SvO₂ muito baixa no exercício indica principalmente…", op: ["extração alta de O₂ pelos tecidos", "pulmão doente", "excesso de O₂"], certa: 0, fb: "Pelo Fick, venoso baixo é muito O₂ retirado no caminho." },
  },
];

// Postos das equipes (fase de memória e laboratório).
export const POSTOS = [
  { id: "ventilacao", nome: "Vias aéreas e alvéolo", curto: "Ventilação", vars: ["ve", "paco2", "pAo2"], params: ["vgain", "vdvt", "patm"], cor: "#38bdf8" },
  { id: "difusao", nome: "Membrana e capilar pulmonar", curto: "Difusão", vars: ["pao2", "aa", "transit"], params: ["aa", "patm"], cor: "#22d3ee" },
  { id: "arterial", nome: "Sangue arterial e hemoglobina", curto: "Arterial", vars: ["sao2", "cao2", "hb"], params: ["hb", "dpg"], cor: "#f43f5e" },
  { id: "coracao", nome: "Coração", curto: "Coração", vars: ["fc", "vs", "dc"], params: ["fc", "vs"], cor: "#ef4444" },
  { id: "distribuicao", nome: "Arteríolas e distribuição", curto: "Distribuição", vars: ["pam", "rpt", "qm"], params: ["rpt", "fm"], cor: "#f97316" },
  { id: "tecido", nome: "Capilar muscular e mitocôndria", curto: "Tecido", vars: ["extracaoMus", "pvm", "lactate"], params: ["tmus", "pcrit", "vo2dem"], cor: "#a855f7" },
  { id: "retorno", nome: "Retorno venoso e CO₂", curto: "Retorno", vars: ["svo2", "pvo2", "pvco2"], params: ["tcore", "hco3d"], cor: "#6366f1" },
];

// Mecanismos que a equipe pode propor. "aplica" perturba o atleta esperado (base) para gerar a
// linha do tempo alternativa: o que se veria se esse mecanismo fosse a explicação.
export const MECANISMOS = [
  { id: "pio2", nome: "PO₂ inspirada baixa", aplica: (p) => ({ ...p, patm: p.patm * 0.68 }) },
  { id: "hipovent", nome: "Ventilação insuficiente (obstrução ou controle)", aplica: (p) => ({ ...p, vgain: p.vgain * 0.65, vdvt: p.vdvt + 0.12 }) },
  { id: "difusao", nome: "Difusão prejudicada / desequilíbrio V/Q", aplica: (p) => ({ ...p, aa: p.aa + 40 }) },
  { id: "hb", nome: "Pouca hemoglobina", aplica: (p) => ({ ...p, hb: p.hb * 0.76 }) },
  { id: "vs", nome: "Volume sistólico baixo (enchimento ou bomba)", aplica: (p) => ({ ...p, vs: p.vs * 0.75, fc: Math.min(205, p.fc * 1.08) }) },
  { id: "fc", nome: "Frequência cardíaca limitada", aplica: (p) => ({ ...p, fc: p.fc * 0.78 }) },
  { id: "dist", nome: "Fluxo desviado do músculo (pele, vísceras)", aplica: (p) => ({ ...p, fm: Math.max(0.3, p.fm - 0.2), rpt: p.rpt * 0.9 }) },
  { id: "extracao", nome: "Músculo extrai pouco O₂", aplica: (p) => ({ ...p, pcrit: p.pcrit + 12 }) },
  { id: "demanda", nome: "Demanda de O₂ maior que o esperado", aplica: (p) => ({ ...p, vo2dem: p.vo2dem * 1.2 }) },
  { id: "nenhum", nome: "O problema não está no nosso posto", aplica: (p) => ({ ...p }) },
];
