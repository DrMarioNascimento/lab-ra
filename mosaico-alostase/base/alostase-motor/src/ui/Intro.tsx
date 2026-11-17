import { useState } from "react";
import { PROFILE_ORDER, PROFILES } from "../profiles";
import type { Mode, ProfileId } from "../types";
import { cx, focusRing } from "./styles";

const MODES: { id: Mode; title: string; time: string; text: string }[] = [
  {
    id: "curta",
    title: "Aula curta",
    time: "≈ 8 min",
    text: "As cinco horas do GDD, painel aberto, uma previsão por hora. O corpo de partida é o do plantonista de 30 anos.",
  },
  {
    id: "estendida",
    title: "Estendida",
    time: "≈ 20 min",
    text: "Dose e adjuntos em cada resposta, cenas que só aparecem se o corpo pedir, exames com limite por noite e quatro corpos de partida.",
  },
];

export function Intro({
  lastName,
  onBegin,
}: {
  lastName: string | null;
  onBegin: (mode: Mode, profile: ProfileId) => void;
}) {
  const [mode, setMode] = useState<Mode>("curta");
  const [profile, setProfile] = useState<ProfileId>("padrao");

  return (
    <article>
      <p className="text-xs tracking-widest text-accent uppercase">Fisiologia · a primeira passagem</p>
      <h1 className="mt-4 font-display text-6xl leading-none font-medium text-fg sm:text-7xl">Alostase</h1>
      <p className="mt-6 max-w-xl font-display text-2xl leading-snug font-medium text-fg italic">
        O corpo, sistema por sistema, ao longo de uma jornada.
      </p>
      <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted">
        <p>
          Em cada hora, escolha qual sistema responde e preveja o que acontecerá. Algumas respostas aparecem mais tarde.
        </p>
        <p>
          Cada escolha modifica uma parte do corpo. Observe como os sistemas se relacionam e como as respostas mudam ao longo do tempo.
        </p>
      </div>

      <fieldset className="mt-8">
        <legend className="text-xs tracking-widest text-faint uppercase">Formato</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <label
              key={m.id}
              className={cx(
                "flex cursor-pointer flex-col rounded-card border bg-surface px-4 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                mode === m.id ? "border-accent" : "border-line hover:border-muted",
              )}
            >
              <input
                type="radio"
                name="modo"
                value={m.id}
                checked={mode === m.id}
                onChange={() => setMode(m.id)}
                className="sr-only"
              />
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl text-fg">{m.title}</span>
                <span className="text-xs text-faint">{m.time}</span>
              </span>
              <span className="mt-2 text-sm leading-relaxed text-muted">{m.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {mode === "estendida" ? (
        <fieldset className="mt-6">
          <legend className="text-xs tracking-widest text-faint uppercase">Corpo de partida</legend>
          <div className="mt-3 grid gap-2">
            {PROFILE_ORDER.map((id) => {
              const p = PROFILES[id];
              return (
                <label
                  key={id}
                  className={cx(
                    "flex cursor-pointer flex-col rounded-card border bg-surface px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    profile === id ? "border-accent" : "border-line hover:border-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="perfil"
                    value={id}
                    checked={profile === id}
                    onChange={() => setProfile(id)}
                    className="sr-only"
                  />
                  <span className="text-base text-fg">{p.name}</span>
                  <span className="mt-1 text-sm leading-relaxed text-muted">{p.description}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <button
        type="button"
        onClick={() => onBegin(mode, mode === "curta" ? "padrao" : profile)}
        className={cx(
          "mt-8 min-h-11 rounded-full bg-accent px-6 py-3 text-base font-medium text-bg",
          focusRing,
        )}
      >
        Entrar na noite
      </button>
      <p className="mt-4 text-sm text-faint">Os números são um modelo, não um exame.</p>
      {lastName ? <p className="mt-2 text-sm text-muted">Última leitura deste aparelho: {lastName}.</p> : null}
    </article>
  );
}
