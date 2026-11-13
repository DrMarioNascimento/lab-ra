export interface Body {
  vagal: number;
  catecol: number;
  pulse: number;
  glicose: number;
  adenosina: number;
  il6: number;
  volemia: number;
  cafeina: number;
  creat: number;
  pg: boolean;
  pgLeft: number;
  sleepHours: number;
  curveBroken: boolean;
  brake: boolean;
  estresse: number;
  insulina: number;
  melatonina: number;
  linfocitos: number;
  potassio: number;
  carga: number;
  /** Efeito acumulado de cada ligação da rede desde o começo da noite. */
  acc: Record<string, number>;
}

export interface Effect {
  estresse?: number;
  vagal?: number;
  catecol?: number;
  pulse?: number;
  glicose?: number;
  adenosina?: number;
  il6?: number;
  volemia?: number;
  cafeina?: number;
  blockPgHours?: number;
  sleepHours?: number;
  curveBroken?: boolean;
  brake?: boolean;
}

export type RenalWord = "folga" | "carga" | "falha";

export type Mode = "curta" | "estendida";

export type ProfileId = "padrao" | "ieca" | "idoso" | "terceira";

export interface Profile {
  id: ProfileId;
  name: string;
  short: string;
  description: string;
  start: Partial<Body>;
  /** Fluxo renal abaixo do qual a autoregulação não segura a TFG. */
  renalFloor: number;
  /** TFG do modelo quando o fluxo está na faixa. */
  tfgCeiling: number;
  creatBasal: number;
  /** Volume perdido por hora acordado. */
  volemiaDrift: number;
  /** Somado ao basal de cortisol das cenas da tarde e da noite. */
  eveningShift: number;
  morningSet: number;
  morningBroken: number;
  essay: string;
  question: string;
}

export interface Derived {
  cortisol: number;
  ang: number;
  rbf: number;
  tfg: number;
  fc: number;
  pa: number;
  renal: RenalWord;
  renalLine: string;
  fcWord: string;
  paWord: string;
  kLine: string | null;
}

export type DoseKind = "intensidade" | "xicaras" | "aine";
export type DoseLevel = "baixa" | "media" | "alta";
export type AdjunctId = "agua" | "freio" | "lanche";

export interface Adjunct {
  id: AdjunctId;
  title: string;
  act: string;
  effect: Effect;
  line: string;
}

export interface Choice {
  id: string;
  title: string;
  act: string;
  gloss: string;
  effect: Effect;
  dose?: DoseKind;
  blocks?: AdjunctId[];
  now?: string;
  later?: string;
}

export type PredictionKind = "renal-agora" | "adenosina-proxima" | "cortisol-proximo" | "creatinina-quando" | "il6-manha";

export interface Scene {
  id: string;
  hour: string;
  /** Hours since the previous scene. 0 on the first. */
  gap: number;
  setPoint: number;
  kicker: string;
  title: string;
  cause: string;
  demand: string;
  choices: Choice[];
  adjuncts: AdjunctId[];
  prediction: PredictionKind;
}

export interface NightEvent {
  id: string;
  hour: string;
  /** Antes de qual cena (índice) o evento entra. */
  beforeScene: number;
  /** Horas depois da cena anterior. */
  offset: number;
  kicker: string;
  title: string;
  cause: string;
  trigger: (body: Body, derived: Derived, profile: Profile) => boolean;
  choices: Choice[];
}

export interface Trace {
  hour: string;
  id: string;
  title: string;
  detail: string;
  kind: "cena" | "evento";
  renal: RenalWord;
  tfg: number;
  creat: number;
}

export interface Sample {
  t: number;
  cortisol: number;
  catecol: number;
  vagal: number;
  glicose: number;
  adenosina: number;
  il6: number;
  volemia: number;
  cafeina: number;
  tfg: number;
  creat: number;
  estresse?: number;
  insulina?: number;
  melatonina?: number;
  linfocitos?: number;
  potassio?: number;
  carga?: number;
}

export interface Horizon {
  span: string;
  when: string;
  text: string;
}

export interface Report {
  name: string;
  essay: string;
  profileEssay: string | null;
  horizons: [Horizon, Horizon, Horizon];
  questions: string[];
}

export interface PredictionOption {
  id: string;
  label: string;
}

export interface PredictionSpec {
  kind: PredictionKind;
  question: string;
  options: PredictionOption[];
  resolve: "agora" | "depois";
  /** Hora em que a previsão é conferida, quando é "depois". */
  checkAt?: string;
}

export interface Prediction {
  hour: string;
  spec: PredictionSpec;
  picked: string;
  /** Valor de referência no momento da escolha. */
  anchor: number;
  answer?: string;
  correct?: boolean;
  detail?: string;
}

export type Notice = { kind: "info" | "previsao-certa" | "previsao-errada"; text: string };

export interface SavedNight {
  name: string;
  profile: ProfileId;
  mode: Mode;
  timeline: Sample[];
  score: [number, number];
}
