import { applyEffect, bodyFor, derive, integrate, passHours, settleMorning } from "./engine";
import { SCENES } from "./scenes";
import type { Body, Profile, Sample } from "./types";

export const START_MINUTES = 3 * 60 + 10;
export const MORNING_HOURS = 8;

export function sceneSetPoint(index: number, profile: Profile): number {
  const scene = SCENES[index];
  return scene.setPoint + (index >= 3 ? profile.eveningShift : 0);
}

export function sceneTime(index: number): number {
  return SCENES.slice(0, index + 1).reduce((sum, s) => sum + s.gap, 0);
}

export const NIGHT_END = sceneTime(SCENES.length - 1) + MORNING_HOURS;

export function clock(t: number): string {
  const minutes = Math.round(START_MINUTES + t * 60) % (24 * 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function morningSetPoint(body: Body, profile: Profile): number {
  return body.curveBroken ? profile.morningBroken : profile.morningSet;
}

export function sampleOf(body: Body, t: number, setPoint: number, profile: Profile): Sample {
  const d = derive(body, setPoint, profile);
  return {
    t: Math.round(t * 100) / 100,
    cortisol: d.cortisol,
    catecol: body.catecol,
    vagal: body.vagal,
    glicose: body.glicose,
    adenosina: body.adenosina,
    il6: body.il6,
    volemia: body.volemia,
    cafeina: body.cafeina,
    tfg: d.tfg,
    creat: body.creat,
    estresse: body.estresse,
    insulina: body.insulina,
    melatonina: body.melatonina,
    linfocitos: body.linfocitos,
    potassio: body.potassio,
    carga: body.carga,
  };
}

/**
 * Amostras dentro de um intervalo, só para o gráfico.
 * Cada ponto é o intervalo inteiro calculado do começo, como o motor faz.
 */
export function spanSamples(
  body: Body,
  hours: number,
  t0: number,
  spFrom: number,
  spTo: number,
  profile: Profile,
): Sample[] {
  const out: Sample[] = [];
  let next = 0.25;
  integrate(body, hours, spFrom, profile, t0, (b, elapsed) => {
    if (elapsed + 1e-6 < next || elapsed >= hours - 1e-6) return;
    next += 0.25;
    const sp = spFrom + (spTo - spFrom) * (elapsed / hours);
    out.push(sampleOf(b, t0 + elapsed, sp, profile));
  });
  return out;
}

/** A noite de retorno do GDD, no mesmo corpo de partida. Fundo dos gráficos. */
const REFERENCE_PATH = ["vigilia-silencio", "manha-vagal", "sirene-retorno", "tarde-agua", "noite-sono"];

export function referenceNight(profile: Profile): Sample[] {
  let body = bodyFor(profile);
  let t = 0;
  const out: Sample[] = [sampleOf(body, 0, sceneSetPoint(0, profile), profile)];
  SCENES.forEach((scene, i) => {
    const sp = sceneSetPoint(i, profile);
    const choice = scene.choices.find((c) => c.id === REFERENCE_PATH[i]) ?? scene.choices[0];
    body = applyEffect(body, choice.effect);
    out.push(sampleOf(body, t, sp, profile));
    const last = i === SCENES.length - 1;
    const hours = last ? MORNING_HOURS : SCENES[i + 1].gap;
    const spTo = last ? morningSetPoint(body, profile) : sceneSetPoint(i + 1, profile);
    out.push(...spanSamples(body, hours, t, sp, spTo, profile));
    body = last ? settleMorning(body, sp, profile, t).body : passHours(body, hours, sp, profile, t).body;
    t += hours;
    out.push(sampleOf(body, t, spTo, profile));
  });
  return out;
}
