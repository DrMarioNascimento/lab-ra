import type { Adjunct, AdjunctId, Choice, DoseKind, DoseLevel, Effect } from "./types";

export function needsBuilder(choice: Choice, adjuncts: AdjunctId[], extended: boolean): boolean {
  if (!extended) return false;
  const free = adjuncts.filter((a) => !choice.blocks?.includes(a));
  return Boolean(choice.dose) || free.length > 0;
}

export const ADJUNCTS: Record<AdjunctId, Adjunct> = {
  agua: {
    id: "agua",
    title: "Beber água",
    act: "Meio litro. O volume sobe sem mexer na prostaglandina.",
    effect: { volemia: 10 },
    line: "A água entrou junto: volume sobe, a angiotensina perde parte do pretexto.",
  },
  freio: {
    id: "freio",
    title: "Frear no intervalo",
    act: "Respiração lenta, sair da sala depois. O vago entra no intervalo, não no clique.",
    effect: { brake: true },
    line: "O freio vagal ficou marcado para o intervalo. Ele não muda esta hora: muda a próxima.",
  },
  lanche: {
    id: "lanche",
    title: "Comer algo",
    act: "Carboidrato e proteína. A glicose da próxima hora não depende só do fígado.",
    effect: { glicose: 8, vagal: 2 },
    line: "Comida: a glicose sobe pela boca, não pela neoglicogênese. O simpático não precisa segurar a contrarregulação.",
  },
};

export const DOSE_LEVELS: DoseLevel[] = ["baixa", "media", "alta"];

export const DOSE_FACTOR: Record<DoseLevel, number> = { baixa: 0.6, media: 1, alta: 1.4 };

export const DOSE_LABELS: Record<DoseKind, Record<DoseLevel, string>> = {
  intensidade: { baixa: "Breve", media: "Média", alta: "Sustentada" },
  xicaras: { baixa: "1 xícara", media: "2 xícaras", alta: "3 xícaras" },
  aine: { baixa: "Dose baixa", media: "Dose padrão", alta: "Dose alta" },
};

export const DOSE_LINES: Record<DoseKind, Record<DoseLevel, string>> = {
  intensidade: {
    baixa: "Resposta breve: o mesmo sistema, com amplitude menor. Custa menos e protege menos.",
    media: "",
    alta: "Resposta sustentada: amplitude maior. A meia-vida não muda; o ponto de partida é que sobe.",
  },
  xicaras: {
    baixa: "Uma xícara: o bloqueio é parcial e sai antes da noite.",
    media: "",
    alta: "Três xícaras: o receptor fica ocupado até depois da meia-noite. A meia-vida é a mesma; a carga é que dobra.",
  },
  aine: {
    baixa: "Dose baixa: a COX volta mais cedo. A janela sem prostaglandina encurta.",
    media: "",
    alta: "Dose alta: a COX fica fora por mais horas. A janela em que o rim depende só do fluxo aumenta.",
  },
};

const SCALE_KEYS = ["vagal", "catecol", "pulse", "glicose", "adenosina", "il6", "volemia", "cafeina", "blockPgHours"] as const;

export function scaleEffect(effect: Effect, level: DoseLevel): Effect {
  const factor = DOSE_FACTOR[level];
  if (factor === 1) return effect;
  const next: Effect = { ...effect };
  for (const key of SCALE_KEYS) {
    const value = effect[key];
    if (typeof value === "number") next[key] = Math.round(value * factor * 10) / 10;
  }
  return next;
}

export function mergeEffects(...effects: Effect[]): Effect {
  const merged: Effect = {};
  for (const effect of effects) {
    for (const key of SCALE_KEYS) {
      const value = effect[key];
      if (typeof value === "number") merged[key] = (merged[key] ?? 0) + value;
    }
    if (effect.sleepHours !== undefined) merged.sleepHours = Math.max(merged.sleepHours ?? 0, effect.sleepHours);
    if (effect.curveBroken) merged.curveBroken = true;
    if (effect.brake) merged.brake = true;
  }
  return merged;
}
