import { LINK_BY_ID, SOURCE_LABEL, step, type NetContext, type Pull } from "./network";
import { PROFILES } from "./profiles";
import type { Body, Choice, Derived, Effect, Profile, RenalWord, Report, Trace } from "./types";

export const INITIAL_BODY: Body = {
  estresse: 12,
  insulina: 18,
  melatonina: 24,
  linfocitos: 60,
  potassio: 50,
  carga: 0,
  acc: {},
  vagal: 44,
  catecol: 16,
  pulse: 8,
  glicose: 76,
  adenosina: 62,
  il6: 14,
  volemia: 64,
  cafeina: 0,
  creat: 8,
  pg: true,
  pgLeft: 0,
  sleepHours: 0,
  curveBroken: false,
  brake: false,
};

function clamp(n: number, max = 100): number {
  return Math.max(0, Math.min(max, n));
}

export function applyEffect(body: Body, effect: Effect): Body {
  const stressBolus =
    effect.estresse ??
    0.5 * Math.max(0, effect.catecol ?? 0) + 0.6 * Math.max(0, effect.pulse ?? 0) - 0.3 * Math.max(0, effect.vagal ?? 0);
  const next: Body = {
    ...body,
    estresse: clamp(body.estresse + stressBolus),
    vagal: clamp(body.vagal + (effect.vagal ?? 0)),
    catecol: clamp(body.catecol + (effect.catecol ?? 0)),
    pulse: clamp(body.pulse + (effect.pulse ?? 0)),
    glicose: clamp(body.glicose + (effect.glicose ?? 0), 160),
    adenosina: clamp(body.adenosina + (effect.adenosina ?? 0)),
    il6: clamp(body.il6 + (effect.il6 ?? 0)),
    volemia: clamp(body.volemia + (effect.volemia ?? 0)),
    cafeina: clamp(body.cafeina + (effect.cafeina ?? 0)),
    sleepHours: effect.sleepHours ?? body.sleepHours,
    curveBroken: effect.curveBroken || body.curveBroken,
    brake: effect.brake ?? body.brake,
  };
  if (effect.blockPgHours) {
    next.pg = false;
    next.pgLeft = effect.blockPgHours;
  }
  return next;
}

export function bodyFor(profile: Profile): Body {
  return { ...INITIAL_BODY, ...profile.start, creat: profile.creatBasal };
}

/** TFG abaixo da qual a hora conta como falha, na escala deste perfil. */
export function failLine(profile: Profile): number {
  return profile.tfgCeiling * (47 / 66);
}

export function derive(body: Body, setPoint: number, profile: Profile = PROFILES.padrao): Derived {
  const cortisol = clamp(setPoint + body.pulse);
  const ang = clamp(body.catecol * 0.48 + Math.max(0, 68 - body.volemia) * 1.05);
  const stressed = ang > 32 || body.catecol > 34;
  const pgHelp = body.pg ? (stressed ? 8 : 5) : 0;
  const rbf = clamp(
    74 - body.catecol * 0.34 - ang * 0.33 + (body.volemia - 55) * 0.32 + pgHelp,
  );
  const floor = profile.renalFloor;
  const tfg =
    rbf >= floor
      ? clamp(profile.tfgCeiling + (rbf - floor) * 0.18)
      : clamp(profile.tfgCeiling * 0.641 * (rbf / floor));
  const fc = clamp(body.catecol * 0.62 + (100 - body.vagal) * 0.38);
  const pa = clamp(body.catecol * 0.4 + body.pulse * 0.28 + (100 - body.vagal) * 0.24);
  const renal: RenalWord = rbf < floor ? "falha" : rbf < floor + 11 ? "carga" : "folga";
  const renalLine =
    renal === "falha"
      ? "Fluxo saiu da faixa. A TFG acompanhou. Falha hemodinâmica, não necrose."
      : renal === "carga"
        ? "Fluxo baixo, TFG segura. É carga: a autoregulação ainda segura a filtração."
        : "Fluxo e TFG dentro da faixa. O rim ainda não é o limitante.";
  const fcWord = fc < 28 ? "branda" : fc < 48 ? "de vigília" : fc < 68 ? "alta" : "muito alta";
  const paWord = pa < 32 ? "baixa" : pa < 50 ? "de vigília" : pa < 68 ? "sustentada" : "alta";
  let kLine: string | null = null;
  if (renal === "falha") {
    kLine =
      "TFG baixa: o rim excreta menos potássio. A catecolamina, se alta, empurra K+ para dentro da célula. Os dois efeitos não cabem no mesmo plasma.";
  } else if (body.catecol > 42 || body.potassio < 40) {
    kLine = "β2 e insulina empurram potássio para dentro da célula. O plasma pode cair sem o rim ter excretado nada.";
  }
  return { cortisol, ang, rbf, tfg, fc, pa, renal, renalLine, fcWord, paWord, kLine };
}

export interface Passage {
  body: Body;
  notices: string[];
}

const DT = 0.05;
const START_CLOCK = 3 + 10 / 60;

export function clockHourAt(t: number): number {
  return (((START_CLOCK + t) % 24) + 24) % 24;
}

export function contextAt(t: number, setPoint: number, profile: Profile, awake = true): NetContext {
  return {
    awake,
    clockHour: clockHourAt(t),
    setPoint,
    failLine: failLine(profile),
    volemiaDrift: profile.volemiaDrift,
  };
}

/**
 * Integra a rede por `hours`, em passos de 3 minutos.
 * `onStep` recebe o corpo a cada passo, para as curvas.
 */
export function integrate(
  body: Body,
  hours: number,
  setPoint: number,
  profile: Profile,
  t0: number,
  onStep?: (b: Body, elapsed: number) => void,
): { body: Body; worstTfg: number; sleep: number } {
  const sleep = Math.min(hours, body.sleepHours);
  let b: Body = { ...body, acc: { ...body.acc } };
  if (b.brake) {
    b.vagal = clamp(b.vagal + 14);
    b.catecol = clamp(b.catecol * 0.35);
    b.estresse = clamp(b.estresse * 0.6);
    b.brake = false;
  }
  let worstTfg = derive(b, setPoint, profile).tfg;
  const steps = Math.max(1, Math.round(hours / DT));
  const dt = hours / steps;
  for (let i = 0; i < steps; i++) {
    const elapsed = i * dt;
    const awake = elapsed >= sleep;
    const d = derive(b, setPoint, profile);
    worstTfg = Math.min(worstTfg, d.tfg);
    const c = contextAt(t0 + elapsed, setPoint, profile, awake);
    b = step(b, d, c, dt, b.acc);
    b.cafeina = clamp(b.cafeina * 0.5 ** (dt / 5));
    if (b.pgLeft > 0) {
      b.pgLeft = Math.max(0, b.pgLeft - dt);
      if (b.pgLeft === 0) b.pg = true;
    }
    onStep?.(b, elapsed + dt);
  }
  worstTfg = Math.min(worstTfg, derive(b, setPoint, profile).tfg);
  b.sleepHours = 0;
  return { body: b, worstTfg, sleep };
}

/** Time between hours. Half-lives and couplings live here, not on the click. */
export function passHours(
  body: Body,
  hours: number,
  setPointBefore: number,
  profile: Profile = PROFILES.padrao,
  t0 = 0,
): Passage {
  const run = integrate(body, hours, setPointBefore, profile, t0);
  const next = run.body;
  const sleep = run.sleep;

  const worst = run.worstTfg;
  const line = failLine(profile);
  const failed = worst < line;
  const basal = profile.creatBasal;
  const target = failed ? basal + (line - worst) * 0.55 : basal;
  next.creat = clamp(Math.round((body.creat + (target - body.creat) * (failed ? 0.85 : 0.35)) * 10) / 10, 40);

  const ranked: string[] = [];
  const top = topPullsBetween(body.acc, next.acc, 1)[0];
  if (top) {
    ranked.push(
      `Neste intervalo, quem mais puxou: ${SOURCE_LABEL[top.link.from]} ${top.value > 0 ? "→ subiu" : "→ desceu"} ${SOURCE_LABEL[top.link.to].toLowerCase()}. ${top.link.mech}`,
    );
  }
  if (body.pulse > 12 && next.linfocitos < body.linfocitos - 4) {
    ranked.push(
      `Cortisol alto, imunidade celular caiu: linfócitos/NK ${Math.round(body.linfocitos)} → ${Math.round(next.linfocitos)}.`,
    );
  }
  if (next.creat - body.creat >= 2) {
    ranked.push("A creatinina subiu entre as horas. Ela descreve a TFG de antes, não a desta hora.");
  }
  if (next.cafeina > 18) {
    ranked.push("A cafeína ainda ocupa o receptor. A adenosina segue no tecido. A máscara é que não acabou.");
  }
  if (body.pulse > 16 && next.pulse < 8 && next.il6 > body.il6 + 3) {
    ranked.push("O cortisol caiu e a IL-6 apareceu. O hormônio que segurava a inflamação já foi embora, e o sono não veio no lugar.");
  }
  if (body.brake) {
    ranked.push("O freio vagal entrou depois da descarga. Catecolamina foi embora. O fluxo renal voltou com ela.");
  }
  if (sleep >= 5) {
    ranked.push("O sono descarregou parte da adenosina e devolveu vago. Não zerou a dívida. Descarregou o que a noite coube.");
  }
  if (!body.pg && next.pg) {
    ranked.push("O AINE saiu do COX. Se a TFG caiu, quem ainda conta isso é a creatinina, não a dor.");
  }

  return { body: next, notices: ranked.slice(0, 3) };
}

/** Ligações que mais pesaram entre dois acumulados. */
export function topPullsBetween(
  from: Record<string, number>,
  to: Record<string, number>,
  n: number,
): Pull[] {
  return Object.keys(to)
    .map((id) => ({ link: LINK_BY_ID[id], value: (to[id] ?? 0) - (from[id] ?? 0) }))
    .filter((p) => p.link && p.link.from !== "luz" && p.link.from !== "sono" && p.link.to !== "carga")
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, n);
}

export function settleMorning(
  body: Body,
  setPointBefore: number,
  profile: Profile = PROFILES.padrao,
  t0 = 0,
): Passage {
  const night = passHours(body, 8, setPointBefore, profile, t0);
  const next = { ...night.body };
  if (body.curveBroken) {
    next.il6 = clamp(next.il6 + 10);
    next.glicose = clamp(next.glicose + 8, 160);
    next.pulse = clamp(next.pulse + 6);
  }
  const notices = [...night.notices];
  if (body.curveBroken) {
    notices.unshift(
      "Manhã com a curva torta: a noite não desceu e o pico do despertar não é o de um eixo em hora. IL-6 e glicose amanhecem mais altas. É um turno, não diabetes.",
    );
  }
  return { body: next, notices: notices.slice(0, 2) };
}

export function narrate(choice: Choice, before: Derived, after: Derived, bodyAfter: Body): { now: string; later: string } {
  const renal =
    after.renal === "falha"
      ? "O fluxo saiu da faixa e a TFG cedeu."
      : after.renal === "carga"
        ? "O fluxo caiu e a TFG segurou. Carga, sem falha."
        : before.renal !== "folga" && after.renal === "folga"
          ? "O rim voltou para dentro da faixa."
          : "O rim segue dentro da faixa.";

  const byId: Record<string, { now: string; later: string }> = {
    "vigilia-catecol": {
      now: `Medula e simpático em segundos. A glicose subiu por glicogenólise hepática, não porque a triagem “gastou cérebro”. ${renal}`,
      later: "Catecolamina de circulação some em minutos. Adenosina não sai junto: a vigília foi química.",
    },
    "vigilia-hpa": {
      now: "CRH, ACTH, córtex adrenal. O cortisol útil chega em dezenas de minutos: tarde para o minuto da triagem. Segura IL-6 e prepara neoglicogênese. A vigília imediata não foi garantida.",
      later: "Meia-vida do cortisol circulante ~1,5 h. Às 9h40 este pulso já terá caído. O que resta é sono interrompido, não um número ainda alto.",
    },
    "vigilia-silencio": {
      now: "O vago ficou. Sem descarga, não há taquicardia de defesa nem queda de fluxo. O risco desta hora é o microssono, com a adenosina mandando. Folga renal aqui não é vitória do sistema.",
      later: "A pressão de sono só cai dormindo. Empurrar a hora sem montar resposta aumenta a adenosina da manhã.",
    },
    "manha-pulso": {
      now: "Segundo pulso, na hora em que a curva do dia já deveria descer. Um pulso isolado ainda freia CRH e ACTH. O segundo, no mesmo dia, atrasa essa descida.",
      later: "IL-6 segue contida enquanto o cortisol está alto. Aparece quando ele cair, se o sono não entrar no lugar.",
    },
    "manha-vagal": {
      now: `Freio vagal, o braço rápido do barorreflexo. A frequência cede sem precisar que o cortisol zere. ${renal}`,
      later: "Angiotensina não ganhou outro motivo para subir. O pulso que já existia decai pela meia-vida dele, não por este gesto.",
    },
    "manha-sustento": {
      now: `Não foi pico. Foi simpático médio sem desligar. ${renal} Pico curto o corpo devolve. Platô é o que a pressão deixa de ter para onde cair.`,
      later: "Se o platô atravessar a noite, a pressão não faz dipping. Um turno mostra o mecanismo. O risco cardiovascular é o ritmo repetido.",
    },
    "sirene-retorno": {
      now: `Defesa na hora: catecolamina sobe, glicose de glicogenólise, fluxo renal cai. ${renal} O freio vagal entra quando a ameaça passa. Alostase com retorno.`,
      later: "Entre esta hora e a tarde, a catecolamina some. O que se lê depois é se o vago voltou.",
    },
    "sirene-sustenta": {
      now: `A descarga era o certo. O freio não veio. Frequência e pressão seguem como se a escada ainda estivesse cheia. ${renal}`,
      later: "Descarga sem retorno é o caminho do non-dipping: a pressão da noite não desce. Ainda não é diagnóstico. É o passo.",
    },
    "sirene-nao": {
      now: "Ameaça sem descarga. Não é recuperação vagal: é defesa que não montou. Músculo e vigília não receberam o que a saída pedia. O rim ficou folgado. Folga, aqui, é o sistema que não foi chamado.",
      later: "Não há meia-vida para encerrar, porque o eixo não ligou. O custo é a defesa que faltou, não uma creatinina.",
    },
    "tarde-cafe": {
      now: "Antagonismo A1 e A2A. A adenosina continua no tecido. Some o sinal, não a molécula. A catecolamina sobe um pouco. Em quem não habituou, a diurese leve tira volume.",
      later: "Meia-vida da cafeína ~5 h. À noite a máscara ainda está, e a pressão de sono também.",
    },
    "tarde-aine": {
      now: `COX inibida: PGE2 e PGI2 aferentes fora. Elas são a dilatação de reserva quando angiotensina e simpático contraem. ${renal} A creatinina não se move neste minuto.`,
      later:
        "Se a TFG caiu, o índice de creatinina aparece na hora seguinte. Se não caiu, é porque o rim ainda estava perfundido. Um AINE não derruba TFG em rim folgado.",
    },
    "tarde-agua": {
      now: `Volume de volta, prostaglandina intacta, freio vagal. A adenosina segue honesta: você sente o que a cafeína esconderia. ${renal}`,
      later: "Com volume, a angiotensina perde o motivo principal. É esta a condição em que um AINE, se viesse, faria pouco.",
    },
    "noite-eixo": {
      now: "Cortisol no nadir, a hora em que o eixo deveria estar no chão. A curva achata. ADH e o que restar de angiotensina seguram sódio e água. A glicose sobe quando o fígado deveria estar quieto.",
      later: "A manhã não fará um pico de despertar limpo. IL-6 e a tolerância à glicose amanhecem piores. Desenho de restrição de sono, não um laudo de diabetes.",
    },
    "noite-frase": {
      now: "Descarga curta, sem pulso cheio de HPA. O nadir do cortisol ainda é possível. Parte da adenosina descarrega se o sono vier em seguida.",
      later: "Meia recuperação: o eixo não quebrou, e o sono não foi a noite inteira.",
    },
    "noite-sono": {
      now: "Processo S começa a descarregar. O cortisol fica baixo, que é o que a hora pede. O vago tem a noite para voltar. O que ficou sem resposta não é um eixo. É a mensagem.",
      later: "De manhã a adenosina está menor e a IL-6 não teve a noite em claro para subir. A curva circadiana segue inteira.",
    },
  };

  const text = byId[choice.id] ?? {
    now: `${choice.now ?? choice.act} ${renal}`,
    later: choice.later ?? choice.gloss,
  };
  const k = bodyAfter.catecol > 42 || after.renal === "falha" ? after.kLine : null;
  return { now: k ? `${text.now} ${k}` : text.now, later: text.later };
}

function round(n: number): number {
  return Math.round(n);
}

export type ReadingKey =
  | "pressao"
  | "hrv"
  | "glicemia"
  | "cortisol"
  | "catecol"
  | "il6"
  | "creat"
  | "volume"
  | "sono"
  | "estresse"
  | "linfocitos"
  | "potassio"
  | "insulina"
  | "melatonina"
  | "carga"
  | "rim";

export type ReadingAccess = "leito" | "pedido" | "modelo";

export interface Reading {
  key: ReadingKey;
  label: string;
  value: string;
  access: ReadingAccess;
  /** O que este pedido é, na vida real. */
  source: string;
}

export function readings(body: Body, d: Derived, hour: string, profile: Profile = PROFILES.padrao): Reading[] {
  const masked = body.cafeina > 18;
  const dipping = hour.startsWith("23") && d.pa >= 50 && body.sleepHours === 0;
  const perceived = clamp(body.adenosina - body.cafeina * 0.35);
  const tfgFromCr = profile.tfgCeiling * (profile.creatBasal / Math.max(body.creat, 1));
  return [
    {
      key: "pressao",
      label: "Pressão",
      value: dipping ? `FC ${d.fcWord} · PA ${d.paWord} · sem dipping` : `FC ${d.fcWord} · PA ${d.paWord}`,
      access: "leito",
      source: "Monitor",
    },
    { key: "hrv", label: "Vago", value: `HRV ${round(body.vagal)}`, access: "leito", source: "Variabilidade da FC" },
    { key: "glicemia", label: "Glicemia", value: `capilar ${round(body.glicose)}`, access: "leito", source: "Ponta de dedo" },
    {
      key: "cortisol",
      label: "HPA",
      value: `cortisol ${round(d.cortisol)} · excesso ${round(body.pulse)}`,
      access: "pedido",
      source: "Cortisol sérico",
    },
    {
      key: "catecol",
      label: "Simpático",
      value: `catecolamina ${round(body.catecol)}`,
      access: "pedido",
      source: "Catecolaminas plasmáticas",
    },
    {
      key: "estresse",
      label: "Estresse",
      value: `percebido ${round(body.estresse)}`,
      access: "leito",
      source: "Relato do próprio plantonista",
    },
    { key: "il6", label: "Inflamação", value: `IL-6 ${round(body.il6)}`, access: "pedido", source: "Interleucina-6" },
    {
      key: "linfocitos",
      label: "Imunidade celular",
      value: `linfócitos/NK ${round(body.linfocitos)}`,
      access: "pedido",
      source: "Hemograma com contagem de linfócitos",
    },
    {
      key: "insulina",
      label: "Insulina",
      value: `insulina ${round(body.insulina)}`,
      access: "pedido",
      source: "Insulina sérica",
    },
    {
      key: "potassio",
      label: "Potássio",
      value: `K+ ${round(body.potassio)}${body.potassio < 42 ? " · baixo" : body.potassio > 58 ? " · alto" : ""}`,
      access: "pedido",
      source: "Eletrólitos",
    },
    {
      key: "creat",
      label: "Creatinina",
      value: `Cr ${round(body.creat)} · TFG estimada ${round(tfgFromCr)}`,
      access: "pedido",
      source: "Creatinina sérica",
    },
    { key: "volume", label: "Volume", value: `volemia ${round(body.volemia)}`, access: "pedido", source: "USG de veia cava" },
    {
      key: "sono",
      label: "Sono",
      value: masked
        ? `sonolência ${round(perceived)} · café mascara`
        : `sonolência ${round(perceived)}`,
      access: "pedido",
      source: "Escala de sonolência",
    },
    {
      key: "melatonina",
      label: "Melatonina",
      value: `melatonina ${round(body.melatonina)}`,
      access: "modelo",
      source: "Não se dosa no plantão",
    },
    {
      key: "carga",
      label: "Carga alostática",
      value: `acumulada ${round(body.carga)}`,
      access: "modelo",
      source: "Soma do que ficou fora do basal",
    },
    {
      key: "rim",
      label: "Rim real",
      value: `fluxo ${round(d.rbf)} · TFG ${round(d.tfg)} · ${d.renal}`,
      access: "modelo",
      source: "Não se mede no plantão",
    },
  ];
}

/** Leituras completas, sem esconder nada. Usadas na aula curta e no laudo. */
export function fullReadings(body: Body, d: Derived, hour: string, profile: Profile = PROFILES.padrao): Reading[] {
  return readings(body, d, hour, profile).map((row) =>
    row.key === "sono" ? { ...row, value: `${row.value} · adenosina ${round(body.adenosina)}` } : row,
  );
}

export function moved(
  before: Body,
  after: Body,
  d0: Derived,
  d1: Derived,
  hour: string,
  profile: Profile = PROFILES.padrao,
): Reading[] {
  const a = fullReadings(before, d0, hour, profile);
  const b = fullReadings(after, d1, hour, profile);
  return b.filter((row, i) => row.value !== a[i]?.value);
}

function worstRenal(trace: Trace[]): RenalWord {
  if (trace.some((t) => t.renal === "falha")) return "falha";
  if (trace.some((t) => t.renal === "carga")) return "carga";
  return "folga";
}

export function writeReport(
  body: Body,
  trace: Trace[],
  morningCortisol: number,
  eveningCortisol: number,
  profile: Profile = PROFILES.padrao,
): Report {
  const ids = new Set(trace.map((t) => t.id));
  const failedDefense = ids.has("sirene-nao");
  const held = ids.has("manha-sustento") || ids.has("sirene-sustenta") || ids.has("noite-eixo");
  const broken = ids.has("noite-eixo");
  const slept = ids.has("noite-sono") || ids.has("noite-frase");
  const renal = worstRenal(trace);
  const basal = profile.creatBasal;
  const creatUp = trace.some((t) => t.creat >= basal + 2) || body.creat >= basal + 3;

  let name = "Retorno";
  if (renal === "falha" || creatUp) name = "Falha hemodinâmica";
  else if (broken) name = "Curva quebrada";
  else if (failedDefense) name = "Sem defesa";
  else if (held && !slept) name = "Patamar";
  else if (renal === "carga") name = "Carga renal";
  else if (body.adenosina > 62 || body.volemia < 46 || body.il6 > 32) name = "Dívida";

  const questions: string[] = questionsFor({ failedDefense, renal });
  if (profile.question) questions.push(profile.question);

  return {
    name,
    essay: essayFor(name),
    profileEssay: profile.essay || null,
    horizons: horizonsFor(name, { slept, broken, renal, morningCortisol, eveningCortisol }),
    questions,
  };
}

function questionsFor(f: { failedDefense: boolean; renal: RenalWord }): [string, string, string] {
  return [
    f.failedDefense
      ? "A sirene sem descarga poupou o rim. Qual sistema falhou no lugar dele?"
      : "Onde a descarga era a defesa certa, e onde o mesmo eixo, à noite, quebrou a curva?",
    f.renal === "falha"
      ? "A TFG caiu nesta tarde. A creatinina de que hora está descrevendo o passado?"
      : "A TFG segurou. O que teria de estar junto — volume, angiotensina, prostaglandina — para ela cair?",
    "Se este passo se repetir três noites por semana, o que deixa de ser episódio e vira set point?",
  ];
}

function essayFor(name: string): string {
  switch (name) {
    case "Falha hemodinâmica":
      return "A TFG saiu da faixa. Não foi necrose: foi hemodinâmica. Simpático e angiotensina contraíram, o volume estava curto e a prostaglandina aferente — a dilatação de reserva — não estava lá. A creatinina sobe depois, porque descreve a TFG que já aconteceu. Com volume e com o COX livre, este desenho reverte. Vira doença se o passo se repetir, não porque a tarde existiu.";
    case "Curva quebrada":
      return "O cortisol subiu perto da meia-noite, quando o eixo deveria estar no nadir. A manhã não recebe um pico de despertar limpo: noite alta, manhã sem inclinação. IL-6 e a glicose amanhecem piores, na direção do que a restrição de sono faz com o dia seguinte. O rim pode ter segurado. A curva, não.";
    case "Sem defesa":
      return "Na sirene o corpo não montou descarga. Frequência, glicose de defesa e redistribuição de fluxo não vieram. O rim ficou folgado porque ninguém pediu vasoconstrição. Folga não repara a defesa que faltou. Alostase com retorno exige os dois tempos: ligar e desligar. Aqui o primeiro não aconteceu.";
    case "Patamar":
      return "Houve simpático sem freio, ou um eixo que não devolveu a noite ao nadir. Pico curto o barorreflexo encerra. Platô é a pressão que deixa de cair. Non-dipping, neste modelo, é isso visto à noite. Um plantão não dá o risco de uma década. Mostra o mecanismo que, repetido, vira o risco.";
    case "Carga renal":
      return "O fluxo caiu e a TFG segurou. É a faixa de autoregulação: o rim filtra quase o mesmo com menos sangue, até sair dela. Carga não é falha. É o quanto a falha está perto. Para cruzar, o modelo exige os três juntos: pouco volume, angiotensina alta e prostaglandina bloqueada.";
    case "Dívida":
      return "Os eixos que ligaram também devolveram, e a TFG não saiu da faixa. A manhã mesmo assim abre devendo: adenosina ainda alta, ou volume curto, ou IL-6 que não voltou ao basal. Meia-vida encerra o hormônio. Não encerra a noite que não foi dormida nem a água que não entrou.";
    default:
      return "Descarga onde a ameaça pedia, freio quando ela passou, e uma noite em que o cortisol pôde ficar baixo. A adenosina descarregou parte. A TFG não saiu da faixa. O custo ficou na hora. É alostase com retorno: sem juros de set point.";
  }
}

function horizonsFor(
  name: string,
  f: { slept: boolean; broken: boolean; renal: RenalWord; morningCortisol: number; eveningCortisol: number },
): Report["horizons"] {
  const flat = f.eveningCortisol > f.morningCortisol - 8;
  const curto = {
    span: "Curto",
    when: "48 horas",
    text:
      name === "Falha hemodinâmica"
        ? "A creatinina de amanhã ainda pode estar descrevendo a TFG da tarde. Com volume e com o COX livre, a falha hemodinâmica deste desenho reverte. Não é lesão estabelecida só porque o índice subiu."
        : f.broken
          ? "A próxima manhã abre com a curva achatada: cortisol da noite alto demais, pico do despertar sem graça, IL-6 e glicose acima do que uma noite dormida deixaria. É a direção do que a restrição de sono faz com a tolerância à glicose no dia seguinte."
          : f.slept
            ? "Uma noite de sono devolve vago e derruba parte da adenosina. Não apaga a semana. O cortisol consegue um pico de despertar. Em 48 h, se o passo não se repetir, os índices voltam para a faixa."
            : "Sem sono, a adenosina segue e a IL-6 da manhã fica mais alta quando o cortisol finalmente baixa. A catecolamina em si já era. O que resta é o que ela não deixou o corpo fazer: dormir.",
  };
  const medio = {
    span: "Médio",
    when: "meses",
    text:
      name === "Retorno"
        ? "Meses neste passo não criam patamar. O cortisol sobe na ameaça e desce depois. A pressão ainda tem noite para cair. O custo continua episódico."
        : name === "Falha hemodinâmica"
          ? "Repetir AINE com pouco volume e simpático alto é a situação em que o episódio hemodinâmico deixa de ser raro. O rim aguenta vários. Não aguenta como método. Pressão que não cai de noite, no mesmo período, soma o outro insulto."
          : "O que se repete vira inclinação: cortisol de fim de dia mais alto, manhã sem pico, pressão sem dipping, IL-6 que não volta ao basal. Carga alostática é esse conjunto, não um hormônio vilão. Três noites por semana bastam para o set point mudar de lugar.",
  };
  const longo = {
    span: "Longo",
    when: "anos",
    text: flat
      ? "Anos de curva achatada, pressão sem dipping e inflamação de baixo grau andam juntos com risco cardiovascular e metabólico. O rim entra nessa conta pela pressão e pela glicose, não porque uma creatinina subiu numa tarde. Um turno não escreve a década. O ritmo escreve."
      : "A década cobra a noite que não teve volta, não a que ligou e desligou. Retorno repetido não é ausência de custo: é custo pago na hora, sem juros de set point. Insuficiência renal crônica não é o desfecho deste plantão. É o desfecho de pressão, glicose e inflamação que deixaram de ser episódio.",
  };
  return [curto, medio, longo];
}

export const BRIDGE = [
  "O modelo faz correr, com meia-vida, sete leituras: vago cardíaco, catecolamina, cortisol acima da curva circadiana, glicose, adenosina, IL-6, e o rim (fluxo, TFG, creatinina). Frequência e pressão são leitura, não um botão. Nada aqui é o seu exame.",
  "Catecolamina de circulação acaba em minutos. Cortisol circulante tem meia-vida de cerca de uma hora e meia. Cafeína, cerca de cinco horas, e só bloqueia o receptor de adenosina: não apaga a adenosina. Creatinina não se move no minuto em que a TFG cai. IL-6 cai sob cortisol agudo e sobe quando o cortisol desce sem sono no lugar.",
  "Angiotensina II, em nível moderado, contrai sobretudo a eferente e ainda segura a TFG, com fração de filtração maior. O modelo não simula esse degrau. Simula o extremo: simpático alto, pouco volume e prostaglandina aferente bloqueada ao mesmo tempo. É nesse extremo que a TFG cai. Um AINE em pessoa hidratada, em repouso, quase não move a filtração. E um turno, mesmo neste extremo, não é doença renal crônica. É uma falha hemodinâmica que reverte se a condição desfaz.",
  "Cortisol alto o bastante para saturar a 11β-HSD2 e agir como mineralocorticoide no rim é excesso sustentado, não um susto. O jogo não finge essa saturação. O potássio que ele menciona é o outro: β2 empurra K+ para a célula na hora; TFG baixa faz o contrário, horas depois. O plasma de um minuto não separa os dois.",
  "Restrição de sono piora a tolerância à glicose no dia seguinte. Isso está medido. O jogo só desloca a glicose e a IL-6 da manhã para você ver a direção. Não calcula um índice glicêmico. E não usa a história, já não sustentada, de que raciocinar esvazia a glicose do sangue.",
  "O corpo é uma rede. Treze variáveis — estresse, catecolamina, cortisol, vago, glicose, insulina, adenosina, melatonina, IL-6, linfócitos/NK, potássio, volume e carga alostática — correm atrás de um alvo com a sua meia-vida, integradas a cada 3 minutos. O alvo de cada uma é o basal mais a soma das ligações que chegam nela: o estresse puxa catecolamina e cortisol; o cortisol segura a IL-6 e derruba linfócitos; a adenosina sem sono sobe IL-6 e estresse; a insulina puxa a glicose de volta; o vago freia o simpático. São mais de 50 ligações, e são as mesmas que aparecem no mapa do laudo.",
  "Na versão estendida, a maior parte do corpo fica escondida. À beira do leito há monitor, HRV e glicemia capilar. O resto se pede, com limite por noite. Fluxo renal e TFG real não se medem no plantão: o que se pede é a creatinina, e a TFG estimada a partir dela descreve o passado. A sonolência relatada é a adenosina menos o que a cafeína esconde.",
  "Os perfis mudam o corpo de partida, não as regras. IECA estreita a faixa de autoregulação, porque a angiotensina deixa de segurar a eferente; o diurético encurta o volume. No idoso, a creatinina basal é baixa por menos massa muscular e a TFG de partida é menor. Na terceira noite, a adenosina e a IL-6 já começam altas e o nadir da noite já não desce tanto. Doses escalam a amplitude da resposta; a meia-vida não muda com a dose.",
  "A passagem de ética ainda não está aqui. Será a mesma noite, com o menu inteiro. A pergunta, então, é se o gesto que você defender cabe no corpo que esta passagem acabou de deixar.",
];
