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
}

export interface Effect {
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

export interface Choice {
  id: string;
  title: string;
  act: string;
  gloss: string;
  effect: Effect;
}

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
}

export interface Trace {
  hour: string;
  title: string;
  renal: RenalWord;
  tfg: number;
  creat: number;
}

export interface Horizon {
  span: string;
  when: string;
  text: string;
}

export interface Report {
  name: string;
  essay: string;
  horizons: [Horizon, Horizon, Horizon];
  questions: [string, string, string];
}
