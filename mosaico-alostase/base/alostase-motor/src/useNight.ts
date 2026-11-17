import { useState } from "react";
import {
  applyEffect,
  bodyFor,
  derive,
  narrate,
  passHours,
  settleMorning,
  writeReport,
  type ReadingKey,
} from "./engine";
import { eventsBefore } from "./events";
import { ADJUNCTS, DOSE_LABELS, DOSE_LINES, mergeEffects, scaleEffect } from "./options";
import { anchorFor, predictionNotice, PREDICTIONS, resolveLater, resolveNow } from "./predictions";
import { PROFILES } from "./profiles";
import { SCENES } from "./scenes";
import {
  MORNING_HOURS,
  morningSetPoint,
  sampleOf,
  sceneSetPoint,
  spanSamples,
} from "./timeline";
import type {
  AdjunctId,
  Body,
  Choice,
  Derived,
  DoseLevel,
  Mode,
  NightEvent,
  Notice,
  Prediction,
  ProfileId,
  Sample,
  SavedNight,
  Trace,
} from "./types";

export const READING_BUDGET = 6;
const SAVE_KEY = "limiar-ultima-noite";

export type Phase = "intro" | "cena" | "evento" | "laudo";
export type Step = "escolher" | "prever" | "ver";

export interface Selection {
  choiceId: string | null;
  dose: DoseLevel;
  adjuncts: AdjunctId[];
}

export interface Pending {
  choice: Choice;
  title: string;
  before: Body;
  after: Body;
  d0: Derived;
  d1: Derived;
  now: string;
  later: string;
  extras: string[];
}

export interface ActiveEvent {
  event: NightEvent;
  remaining: number;
  setPoint: number;
}

export interface NightState {
  mode: Mode;
  profileId: ProfileId;
  phase: Phase;
  step: Step;
  round: number;
  body: Body;
  t: number;
  selection: Selection;
  pending: Pending | null;
  active: ActiveEvent | null;
  notices: Notice[];
  trace: Trace[];
  timeline: Sample[];
  predictions: Prediction[];
  open: Prediction | null;
  budget: number;
  requested: ReadingKey[];
  morning: Body | null;
  eveningCortisol: number;
  previous: SavedNight | null;
}

const EMPTY_SELECTION: Selection = { choiceId: null, dose: "media", adjuncts: [] };

function initialState(mode: Mode = "curta", profileId: ProfileId = "padrao"): NightState {
  const profile = PROFILES[profileId];
  const body = bodyFor(profile);
  return {
    mode,
    profileId,
    phase: "intro",
    step: "escolher",
    round: 0,
    body,
    t: 0,
    selection: EMPTY_SELECTION,
    pending: null,
    active: null,
    notices: [],
    trace: [],
    timeline: [sampleOf(body, 0, sceneSetPoint(0, profile), profile)],
    predictions: [],
    open: null,
    budget: READING_BUDGET,
    requested: [],
    morning: null,
    eveningCortisol: 12,
    previous: null,
  };
}

function info(texts: string[]): Notice[] {
  return texts.map((text) => ({ kind: "info" as const, text }));
}

function readSaved(): SavedNight | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SavedNight) : null;
  } catch {
    return null;
  }
}

function writeSaved(night: SavedNight) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(night));
  } catch {
    /* modo privado */
  }
}

export function loadPrevious(): SavedNight | null {
  return readSaved();
}

export function useNight() {
  const [s, setS] = useState<NightState>(() => initialState());
  const profile = PROFILES[s.profileId];
  const scene = SCENES[s.round];

  const setPoint =
    s.phase === "evento" && s.active
      ? s.active.setPoint
      : s.phase === "laudo" && s.morning
        ? morningSetPoint(s.morning, profile)
        : sceneSetPoint(s.round, profile);
  const shownBody =
    s.phase === "laudo" && s.morning
      ? s.morning
      : s.step === "prever" && s.pending
        ? s.pending.before
        : s.body;
  const derived = derive(shownBody, setPoint, profile);

  const choices: Choice[] = s.phase === "evento" && s.active ? s.active.event.choices : scene.choices;
  const adjuncts: AdjunctId[] = s.phase === "cena" && s.mode === "estendida" ? scene.adjuncts : [];

  function begin(mode: Mode, profileId: ProfileId) {
    setS({ ...initialState(mode, profileId), phase: "cena", previous: readSaved() });
  }

  function restart() {
    setS((prev) => ({ ...initialState(prev.mode, prev.profileId), previous: prev.previous }));
  }

  function select(choiceId: string) {
    if (s.step !== "escolher") return;
    const choice = choices.find((c) => c.id === choiceId);
    if (!choice) return;
    setS({
      ...s,
      selection: {
        choiceId,
        dose: s.selection.choiceId === choiceId ? s.selection.dose : "media",
        adjuncts: s.selection.adjuncts.filter((a) => !choice.blocks?.includes(a)),
      },
    });
  }

  function setDose(dose: DoseLevel) {
    setS({ ...s, selection: { ...s.selection, dose } });
  }

  function toggleAdjunct(id: AdjunctId) {
    const has = s.selection.adjuncts.includes(id);
    setS({
      ...s,
      selection: {
        ...s.selection,
        adjuncts: has ? s.selection.adjuncts.filter((a) => a !== id) : [...s.selection.adjuncts, id],
      },
    });
  }

  function confirm(choiceIdOverride?: string) {
    if (s.step !== "escolher") return;
    const choiceId = choiceIdOverride ?? s.selection.choiceId;
    const choice = choices.find((c) => c.id === choiceId);
    if (!choice) return;

    const extended = s.mode === "estendida";
    const dose: DoseLevel = extended && choice.dose ? s.selection.dose : "media";
    const picked = extended ? s.selection.adjuncts.filter((a) => !choice.blocks?.includes(a)) : [];
    const effect = mergeEffects(scaleEffect(choice.effect, dose), ...picked.map((a) => ADJUNCTS[a].effect));

    const before = s.body;
    const after = applyEffect(before, effect);
    const d0 = derive(before, setPoint, profile);
    const d1 = derive(after, setPoint, profile);
    const text = narrate(choice, d0, d1, after);

    const extras: string[] = [];
    if (choice.dose && DOSE_LINES[choice.dose][dose]) extras.push(DOSE_LINES[choice.dose][dose]);
    for (const a of picked) extras.push(ADJUNCTS[a].line);

    const detailParts: string[] = [];
    if (choice.dose && dose !== "media") detailParts.push(DOSE_LABELS[choice.dose][dose]);
    for (const a of picked) detailParts.push(ADJUNCTS[a].title.toLowerCase());
    const title = choice.title;

    const isEvent = s.phase === "evento" && s.active;
    const trace: Trace = {
      hour: isEvent ? s.active!.event.hour : scene.hour,
      id: choice.id,
      title,
      detail: detailParts.join(" · "),
      kind: isEvent ? "evento" : "cena",
      renal: d1.renal,
      tfg: d1.tfg,
      creat: after.creat,
    };

    setS({
      ...s,
      body: after,
      step: isEvent ? "ver" : "prever",
      pending: { choice, title, before, after, d0, d1, now: text.now, later: text.later, extras },
      trace: [...s.trace, trace],
      timeline: [...s.timeline, sampleOf(after, s.t, setPoint, profile)],
    });
  }

  function predict(optionId: string) {
    if (s.step !== "prever" || !s.pending) return;
    const spec = PREDICTIONS[scene.prediction];
    const base: Prediction = {
      hour: scene.hour,
      spec,
      picked: optionId,
      anchor: anchorFor(spec.kind, s.pending.after),
    };
    if (spec.resolve === "agora") {
      const resolved = resolveNow(base, s.pending.d1);
      setS({ ...s, step: "ver", predictions: [...s.predictions, resolved] });
    } else {
      setS({ ...s, step: "ver", open: base });
    }
  }

  function request(key: ReadingKey) {
    if (s.budget <= 0 || s.requested.includes(key)) return;
    setS({ ...s, budget: s.budget - 1, requested: [...s.requested, key] });
  }

  function enterScene(
    base: NightState,
    nextIndex: number,
    body: Body,
    notices: string[],
    samples: Sample[],
    t: number,
  ): NightState {
    let predictions = base.predictions;
    const lead: Notice[] = [];
    if (base.open) {
      const resolved = resolveLater(base.open, body);
      predictions = [...predictions, resolved];
      lead.push({ kind: resolved.correct ? "previsao-certa" : "previsao-errada", text: predictionNotice(resolved) });
    }
    return {
      ...base,
      phase: "cena",
      step: "escolher",
      round: nextIndex,
      body,
      t,
      selection: EMPTY_SELECTION,
      pending: null,
      active: null,
      notices: [...lead, ...info(notices)],
      timeline: [...base.timeline, ...samples, sampleOf(body, t, sceneSetPoint(nextIndex, profile), profile)],
      predictions,
      open: null,
      requested: [],
    };
  }

  function advance() {
    if (s.step !== "ver") return;

    if (s.phase === "evento" && s.active) {
      const { remaining, setPoint: sp } = s.active;
      const next = s.round + 1;
      const spNext = sceneSetPoint(next, profile);
      const passage = passHours(s.body, remaining, sp, profile, s.t);
      const samples = spanSamples(s.body, remaining, s.t, sp, spNext, profile);
      setS(enterScene(s, next, passage.body, passage.notices, samples, s.t + remaining));
      return;
    }

    const sp = sceneSetPoint(s.round, profile);

    if (s.round >= SCENES.length - 1) {
      const evening = derive(s.body, sp, profile).cortisol;
      const settled = settleMorning(s.body, sp, profile, s.t);
      const spMorning = morningSetPoint(s.body, profile);
      const samples = spanSamples(s.body, MORNING_HOURS, s.t, sp, spMorning, profile);
      const tEnd = s.t + MORNING_HOURS;
      let predictions = s.predictions;
      const lead: Notice[] = [];
      if (s.open) {
        const resolved = resolveLater(s.open, settled.body);
        predictions = [...predictions, resolved];
        lead.push({ kind: resolved.correct ? "previsao-certa" : "previsao-errada", text: predictionNotice(resolved) });
      }
      const timeline = [...s.timeline, ...samples, sampleOf(settled.body, tEnd, spMorning, profile)];
      const finished: NightState = {
        ...s,
        phase: "laudo",
        step: "escolher",
        body: settled.body,
        morning: settled.body,
        t: tEnd,
        eveningCortisol: evening,
        notices: [...lead, ...info(settled.notices)],
        timeline,
        predictions,
        open: null,
        pending: null,
      };
      return finishAndSave(finished);
    }

    const next = s.round + 1;
    const gap = SCENES[next].gap;
    const spNext = sceneSetPoint(next, profile);

    if (s.mode === "estendida") {
      const candidates = [...eventsBefore(next)].sort((a, b) => a.offset - b.offset);
      for (const event of candidates) {
        const probe = passHours(s.body, event.offset, sp, profile, s.t);
        const spAt = sp + (spNext - sp) * (event.offset / gap);
        const d = derive(probe.body, spAt, profile);
        if (event.trigger(probe.body, d, profile)) {
          const samples = spanSamples(s.body, event.offset, s.t, sp, spAt, profile);
          const t = s.t + event.offset;
          setS({
            ...s,
            phase: "evento",
            step: "escolher",
            body: probe.body,
            t,
            active: { event, remaining: gap - event.offset, setPoint: spAt },
            selection: EMPTY_SELECTION,
            pending: null,
            notices: info(probe.notices),
            timeline: [...s.timeline, ...samples, sampleOf(probe.body, t, spAt, profile)],
            requested: [],
          });
          return;
        }
      }
    }

    const passage = passHours(s.body, gap, sp, profile, s.t);
    const samples = spanSamples(s.body, gap, s.t, sp, spNext, profile);
    setS(enterScene(s, next, passage.body, passage.notices, samples, s.t + gap));
  }

  function finishAndSave(finished: NightState) {
    const previous = readSaved();
    const right = finished.predictions.filter((p) => p.correct).length;
    writeSaved({
      name: reportFor(finished).name,
      profile: finished.profileId,
      mode: finished.mode,
      timeline: finished.timeline,
      score: [right, finished.predictions.length],
    });
    setS({ ...finished, previous });
  }

  return {
    state: s,
    shownBody,
    profile,
    scene,
    choices,
    adjuncts,
    derived,
    setPoint,
    begin,
    restart,
    select,
    setDose,
    toggleAdjunct,
    confirm,
    predict,
    request,
    advance,
  };
}

export function reportFor(state: NightState) {
  const profile = PROFILES[state.profileId];
  const morning = state.morning ?? state.body;
  return writeReport(
    morning,
    state.trace,
    derive(morning, morningSetPoint(morning, profile), profile).cortisol,
    state.eveningCortisol,
    profile,
  );
}
