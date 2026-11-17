import type { Body, Derived } from "./types";

/**
 * Rede de modulação.
 *
 * Cada variável "alvo" corre atrás de um valor-alvo com a sua meia-vida:
 *   alvo = basal + Σ (termo de cada ligação que chega nela)
 * Cada variável "taxa" (adenosina, volume, carga) soma por hora o que as ligações mandam.
 * As mesmas ligações que o integrador usa são as que a interface mostra:
 * o que aparece em “quem puxa quem” é exatamente o que entrou na conta.
 */

export type NetKey =
  | "estresse"
  | "catecol"
  | "pulse"
  | "vagal"
  | "glicose"
  | "insulina"
  | "adenosina"
  | "melatonina"
  | "il6"
  | "linfocitos"
  | "volemia"
  | "potassio"
  | "carga";

export type SourceKey = NetKey | "cafeina" | "cortisol" | "ang" | "tfg" | "sono" | "luz";

export interface NetContext {
  awake: boolean;
  /** Hora do relógio, 0–24. */
  clockHour: number;
  setPoint: number;
  failLine: number;
  volemiaDrift: number;
}

interface VarSpec {
  key: NetKey;
  label: string;
  kind: "alvo" | "taxa";
  halfLife?: number;
  max: number;
  base?: (c: NetContext) => number;
}

export interface Link {
  id: string;
  from: SourceKey;
  to: NetKey;
  /** Sinal esperado: +1 estimula, −1 inibe. Só para leitura. */
  sign: 1 | -1;
  mech: string;
  term: (b: Body, d: Derived, c: NetContext) => number;
}

const pos = (n: number) => Math.max(0, n);

export const SOURCE_LABEL: Record<SourceKey, string> = {
  estresse: "Estresse",
  catecol: "Catecolamina",
  pulse: "Cortisol",
  cortisol: "Cortisol",
  vagal: "Vago",
  glicose: "Glicose",
  insulina: "Insulina",
  adenosina: "Adenosina",
  melatonina: "Melatonina",
  il6: "IL-6",
  linfocitos: "Linfócitos/NK",
  volemia: "Volume",
  potassio: "Potássio",
  carga: "Carga alostática",
  cafeina: "Cafeína",
  ang: "Angiotensina",
  tfg: "TFG",
  sono: "Sono",
  luz: "Luz acordado",
};

/** Melatonina circadiana: pico perto das 3h, chão de dia. */
export function circadianMelatonin(clockHour: number): number {
  const c = Math.cos((2 * Math.PI * (clockHour - 3)) / 24);
  return 5 + 60 * Math.pow(pos(c), 1.4);
}

export const VARS: VarSpec[] = [
  { key: "estresse", label: "Estresse", kind: "alvo", halfLife: 0.8, max: 100, base: (c) => (c.awake ? 10 : 4) },
  { key: "catecol", label: "Catecolamina", kind: "alvo", halfLife: 0.45, max: 100, base: (c) => (c.awake ? 8 : 3) },
  { key: "pulse", label: "Excesso de cortisol", kind: "alvo", halfLife: 1.5, max: 100, base: () => 0 },
  { key: "vagal", label: "Vago", kind: "alvo", halfLife: 1.2, max: 100, base: (c) => (c.awake ? 44 : 58) },
  { key: "glicose", label: "Glicose", kind: "alvo", halfLife: 1.2, max: 160, base: () => 78 },
  { key: "insulina", label: "Insulina", kind: "alvo", halfLife: 0.7, max: 100, base: () => 18 },
  { key: "melatonina", label: "Melatonina", kind: "alvo", halfLife: 0.7, max: 100, base: () => 0 },
  { key: "il6", label: "IL-6", kind: "alvo", halfLife: 3, max: 100, base: () => 12 },
  { key: "linfocitos", label: "Linfócitos/NK", kind: "alvo", halfLife: 2, max: 100, base: () => 60 },
  { key: "potassio", label: "Potássio", kind: "alvo", halfLife: 0.8, max: 100, base: () => 50 },
  { key: "adenosina", label: "Adenosina", kind: "taxa", max: 100 },
  { key: "volemia", label: "Volume", kind: "taxa", max: 100 },
  { key: "carga", label: "Carga alostática", kind: "taxa", max: 400 },
];

export const LINKS: Link[] = [
  // Estresse central (amígdala, locus coeruleus, PVN)
  {
    id: "aden-estresse",
    from: "adenosina",
    to: "estresse",
    sign: 1,
    mech: "Privação de sono deixa a amígdala mais reativa ao mesmo estímulo.",
    term: (b) => 0.3 * pos(b.adenosina - 65),
  },
  {
    id: "il6-estresse",
    from: "il6",
    to: "estresse",
    sign: 1,
    mech: "Comportamento de doença: citocina chega ao hipotálamo e vira mal-estar.",
    term: (b) => 0.25 * pos(b.il6 - 20),
  },
  {
    id: "glic-estresse",
    from: "glicose",
    to: "estresse",
    sign: 1,
    mech: "Glicose baixa é ameaça para o cérebro: alerta sobe.",
    term: (b) => 0.35 * pos(72 - b.glicose),
  },
  {
    id: "vago-estresse",
    from: "vagal",
    to: "estresse",
    sign: -1,
    mech: "Aferência vagal acalma o tronco cerebral e o córtex pré-frontal retoma o controle.",
    term: (b) => -0.25 * (b.vagal - 44),
  },
  // Simpático
  {
    id: "estresse-catecol",
    from: "estresse",
    to: "catecol",
    sign: 1,
    mech: "Locus coeruleus e medula adrenal: estresse vira noradrenalina e adrenalina em segundos.",
    term: (b) => 0.45 * (b.estresse - 10),
  },
  {
    id: "cafe-catecol",
    from: "cafeina",
    to: "catecol",
    sign: 1,
    mech: "Bloqueio A1 tira o freio pré-sináptico da noradrenalina.",
    term: (b) => 0.25 * b.cafeina,
  },
  {
    id: "glic-catecol",
    from: "glicose",
    to: "catecol",
    sign: 1,
    mech: "Contrarregulação: hipoglicemia relativa chama adrenalina.",
    term: (b) => 0.6 * pos(72 - b.glicose),
  },
  {
    id: "vol-catecol",
    from: "volemia",
    to: "catecol",
    sign: 1,
    mech: "Barorreflexo: menos volume, menos estiramento, mais simpático.",
    term: (b) => 0.5 * pos(60 - b.volemia),
  },
  {
    id: "vago-catecol",
    from: "vagal",
    to: "catecol",
    sign: -1,
    mech: "Balanço autonômico: o vago alto puxa o simpático para baixo.",
    term: (b) => -0.15 * (b.vagal - 44),
  },
  // Eixo HPA
  {
    id: "estresse-hpa",
    from: "estresse",
    to: "pulse",
    sign: 1,
    mech: "CRH → ACTH → cortisol. Mais lento que a catecolamina, dura mais.",
    term: (b) => 0.35 * (b.estresse - 10),
  },
  {
    id: "il6-hpa",
    from: "il6",
    to: "pulse",
    sign: 1,
    mech: "IL-6 estimula CRH: a inflamação chama o hormônio que vai contê-la.",
    term: (b) => 0.3 * pos(b.il6 - 14),
  },
  {
    id: "glic-hpa",
    from: "glicose",
    to: "pulse",
    sign: 1,
    mech: "Glicose baixa também chama cortisol, para neoglicogênese.",
    term: (b) => 0.4 * pos(72 - b.glicose),
  },
  // Vago
  {
    id: "catecol-vago",
    from: "catecol",
    to: "vagal",
    sign: -1,
    mech: "Simpático alto, HRV baixa: os dois braços não sobem juntos.",
    term: (b) => -0.4 * (b.catecol - 8),
  },
  {
    id: "cort-vago",
    from: "cortisol",
    to: "vagal",
    sign: -1,
    mech: "Cortisol sustentado reduz o tônus vagal e a HRV.",
    term: (b) => -0.15 * b.pulse,
  },
  {
    id: "il6-vago",
    from: "il6",
    to: "vagal",
    sign: -1,
    mech: "Inflamação de baixo grau anda junto com HRV menor.",
    term: (b) => -0.25 * pos(b.il6 - 14),
  },
  {
    id: "mel-vago",
    from: "melatonina",
    to: "vagal",
    sign: 1,
    mech: "Noite fisiológica: melatonina alta, tônus vagal sobe.",
    term: (b) => 0.12 * (b.melatonina - 30),
  },
  // Glicose e insulina
  {
    id: "catecol-glic",
    from: "catecol",
    to: "glicose",
    sign: 1,
    mech: "Glicogenólise hepática por adrenalina: glicose em minutos.",
    term: (b) => 0.45 * (b.catecol - 8),
  },
  {
    id: "cort-glic",
    from: "cortisol",
    to: "glicose",
    sign: 1,
    mech: "Neoglicogênese e resistência periférica à insulina.",
    term: (b) => 0.35 * b.pulse,
  },
  {
    id: "il6-glic",
    from: "il6",
    to: "glicose",
    sign: 1,
    mech: "Citocina piora a sinalização do receptor de insulina.",
    term: (b) => 0.2 * pos(b.il6 - 14),
  },
  {
    id: "ins-glic",
    from: "insulina",
    to: "glicose",
    sign: -1,
    mech: "Insulina leva glicose para músculo e fígado.",
    term: (b) => -0.5 * (b.insulina - 18),
  },
  {
    id: "glic-ins",
    from: "glicose",
    to: "insulina",
    sign: 1,
    mech: "Célula β responde à glicose.",
    term: (b) => 0.6 * (b.glicose - 78),
  },
  {
    id: "catecol-ins",
    from: "catecol",
    to: "insulina",
    sign: -1,
    mech: "α2 na célula β: adrenalina segura a insulina para a glicose ficar no sangue.",
    term: (b) => -0.25 * (b.catecol - 8),
  },
  {
    id: "cort-ins",
    from: "cortisol",
    to: "insulina",
    sign: 1,
    mech: "Resistência à insulina obriga o pâncreas a secretar mais.",
    term: (b) => 0.15 * b.pulse,
  },
  // Melatonina
  {
    id: "luz-mel",
    from: "luz",
    to: "melatonina",
    sign: -1,
    mech: "Luz de plantão na retina suprime a glândula pineal.",
    term: (_b, _d, c) => (c.awake ? -0.6 * circadianMelatonin(c.clockHour) : 0),
  },
  {
    id: "catecol-mel",
    from: "catecol",
    to: "melatonina",
    sign: -1,
    mech: "Descarga simpática aguda desorganiza o sinal noturno.",
    term: (b) => -0.2 * pos(b.catecol - 8),
  },
  // Imune
  {
    id: "cort-il6",
    from: "cortisol",
    to: "il6",
    sign: -1,
    mech: "Cortisol inibe NF-κB: segura a transcrição de IL-6 enquanto está alto.",
    term: (b) => -0.45 * b.pulse,
  },
  {
    id: "catecol-il6",
    from: "catecol",
    to: "il6",
    sign: 1,
    mech: "β2 em macrófago e adipócito: estresse agudo libera IL-6.",
    term: (b) => 0.3 * pos(b.catecol - 8),
  },
  {
    id: "aden-il6",
    from: "adenosina",
    to: "il6",
    sign: 1,
    mech: "Privação de sono eleva IL-6 no dia seguinte.",
    term: (b) => 0.35 * pos(b.adenosina - 65),
  },
  {
    id: "glic-il6",
    from: "glicose",
    to: "il6",
    sign: 1,
    mech: "Hiperglicemia ativa resposta inflamatória.",
    term: (b) => 0.25 * pos(b.glicose - 110),
  },
  {
    id: "sono-il6",
    from: "sono",
    to: "il6",
    sign: -1,
    mech: "Sono profundo puxa a inflamação para o basal.",
    term: (_b, _d, c) => (c.awake ? 0 : -6),
  },
  {
    id: "cort-linf",
    from: "cortisol",
    to: "linfocitos",
    sign: -1,
    mech: "Cortisol tira linfócitos do sangue e reduz a atividade NK.",
    term: (b) => -0.7 * b.pulse,
  },
  {
    id: "catecol-linf",
    from: "catecol",
    to: "linfocitos",
    sign: -1,
    mech: "Catecolamina sustentada reduz a função citotóxica (o pico agudo não conta aqui).",
    term: (b) => -0.2 * pos(b.catecol - 20),
  },
  {
    id: "aden-linf",
    from: "adenosina",
    to: "linfocitos",
    sign: -1,
    mech: "Uma noite sem sono derruba a atividade NK.",
    term: (b) => -0.3 * pos(b.adenosina - 65),
  },
  {
    id: "il6-linf",
    from: "il6",
    to: "linfocitos",
    sign: -1,
    mech: "Inflamação crônica de baixo grau desvia a resposta celular.",
    term: (b) => -0.15 * pos(b.il6 - 20),
  },
  {
    id: "mel-linf",
    from: "melatonina",
    to: "linfocitos",
    sign: 1,
    mech: "Melatonina sustenta a imunidade celular noturna.",
    term: (b) => 0.15 * (b.melatonina - 30),
  },
  {
    id: "sono-linf",
    from: "sono",
    to: "linfocitos",
    sign: 1,
    mech: "Sono é quando a resposta adaptativa se consolida.",
    term: (_b, _d, c) => (c.awake ? 0 : 6),
  },
  // Potássio
  {
    id: "catecol-k",
    from: "catecol",
    to: "potassio",
    sign: -1,
    mech: "β2 ativa a Na/K-ATPase: K+ entra na célula, o plasma cai.",
    term: (b) => -0.35 * (b.catecol - 8),
  },
  {
    id: "ins-k",
    from: "insulina",
    to: "potassio",
    sign: -1,
    mech: "Insulina também empurra K+ para dentro da célula.",
    term: (b) => -0.3 * (b.insulina - 18),
  },
  {
    id: "tfg-k",
    from: "tfg",
    to: "potassio",
    sign: -1,
    mech: "TFG baixa: o rim excreta menos K+, o plasma sobe.",
    term: (_b, d, c) => 0.8 * pos(c.failLine - d.tfg),
  },
  {
    id: "ang-k",
    from: "ang",
    to: "potassio",
    sign: -1,
    mech: "Angiotensina → aldosterona → mais K+ na urina.",
    term: (_b, d) => -0.1 * pos(d.ang - 20),
  },
  // Taxas por hora
  {
    id: "vigilia-aden",
    from: "luz",
    to: "adenosina",
    sign: 1,
    mech: "Processo S: cada hora acordado acumula adenosina.",
    term: (_b, _d, c) => (c.awake ? 1.15 : 0),
  },
  {
    id: "sono-aden",
    from: "sono",
    to: "adenosina",
    sign: -1,
    mech: "Só dormir descarrega a adenosina.",
    term: (_b, _d, c) => (c.awake ? 0 : -5.2),
  },
  {
    id: "il6-aden",
    from: "il6",
    to: "adenosina",
    sign: 1,
    mech: "Citocina aumenta a pressão de sono.",
    term: (b) => 0.04 * pos(b.il6 - 14),
  },
  {
    id: "perda-vol",
    from: "luz",
    to: "volemia",
    sign: -1,
    mech: "Acordado, sem beber: perda insensível e urina.",
    term: (_b, _d, c) => (c.awake ? -c.volemiaDrift : 0.35),
  },
  {
    id: "cafe-vol",
    from: "cafeina",
    to: "volemia",
    sign: -1,
    mech: "Diurese leve da cafeína.",
    term: (b) => -0.02 * b.cafeina,
  },
  {
    id: "catecol-vol",
    from: "catecol",
    to: "volemia",
    sign: -1,
    mech: "Sudorese do simpático alto.",
    term: (b) => -0.02 * pos(b.catecol - 20),
  },
  {
    id: "ang-vol",
    from: "ang",
    to: "volemia",
    sign: 1,
    mech: "Angiotensina, aldosterona e ADH seguram sódio e água.",
    term: (_b, d) => 0.008 * pos(d.ang - 20),
  },
  // Carga alostática: quanto cada sistema ficou fora do basal, por hora
  {
    id: "carga-cort",
    from: "cortisol",
    to: "carga",
    sign: 1,
    mech: "Cortisol acima da curva circadiana.",
    term: (b) => 0.04 * b.pulse,
  },
  {
    id: "carga-catecol",
    from: "catecol",
    to: "carga",
    sign: 1,
    mech: "Simpático acima do basal.",
    term: (b) => 0.03 * pos(b.catecol - 10),
  },
  {
    id: "carga-il6",
    from: "il6",
    to: "carga",
    sign: 1,
    mech: "Inflamação acima do basal.",
    term: (b) => 0.04 * pos(b.il6 - 14),
  },
  {
    id: "carga-aden",
    from: "adenosina",
    to: "carga",
    sign: 1,
    mech: "Dívida de sono.",
    term: (b) => 0.04 * pos(b.adenosina - 65),
  },
  {
    id: "carga-linf",
    from: "linfocitos",
    to: "carga",
    sign: 1,
    mech: "Imunidade celular abaixo do basal.",
    term: (b) => 0.04 * pos(56 - b.linfocitos),
  },
  {
    id: "carga-glic",
    from: "glicose",
    to: "carga",
    sign: 1,
    mech: "Glicose fora da faixa.",
    term: (b) => 0.02 * Math.abs(b.glicose - 80),
  },
  {
    id: "carga-vago",
    from: "vagal",
    to: "carga",
    sign: 1,
    mech: "Vago abaixo do basal.",
    term: (b) => 0.03 * pos(40 - b.vagal),
  },
  {
    id: "carga-tfg",
    from: "tfg",
    to: "carga",
    sign: 1,
    mech: "Rim fora da autoregulação.",
    term: (_b, d, c) => 0.08 * pos(c.failLine - d.tfg),
  },
];

const LINKS_TO: Record<NetKey, Link[]> = Object.fromEntries(
  VARS.map((v) => [v.key, LINKS.filter((l) => l.to === v.key)]),
) as Record<NetKey, Link[]>;

export const LINK_BY_ID: Record<string, Link> = Object.fromEntries(LINKS.map((l) => [l.id, l]));

function clampTo(n: number, max: number): number {
  return Math.max(0, Math.min(max, n));
}

/** Um passo de integração. `acc` soma o efeito de cada ligação, ponderado pelo tempo. */
export function step(body: Body, d: Derived, c: NetContext, dt: number, acc: Record<string, number>): Body {
  const next: Body = { ...body };
  for (const spec of VARS) {
    const links = LINKS_TO[spec.key];
    let sum = 0;
    for (const link of links) {
      const v = link.term(body, d, c);
      sum += v;
      if (v !== 0) acc[link.id] = (acc[link.id] ?? 0) + v * dt;
    }
    const current = body[spec.key];
    if (spec.kind === "taxa") {
      next[spec.key] = clampTo(current + sum * dt, spec.max);
    } else {
      const base =
        spec.key === "melatonina" ? circadianMelatonin(c.clockHour) : (spec.base?.(c) ?? 0);
      const target = clampTo(base + sum, spec.max);
      const k = Math.LN2 / (spec.halfLife ?? 1);
      next[spec.key] = clampTo(current + (target - current) * (1 - Math.exp(-k * dt)), spec.max);
    }
  }
  return next;
}

export interface Pull {
  link: Link;
  value: number;
}

/** O que cada ligação está empurrando agora, no alvo de cada variável. */
export function pullsNow(body: Body, d: Derived, c: NetContext): Pull[] {
  return LINKS.filter((l) => l.to !== "carga" && l.from !== "luz")
    .map((link) => ({ link, value: link.term(body, d, c) }))
    .filter((p) => Math.abs(p.value) >= 0.5)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}
