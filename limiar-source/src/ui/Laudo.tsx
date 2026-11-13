import { useState } from "react";
import { BRIDGE } from "../engine";
import { optionLabel } from "../predictions";
import type { Body, Derived, Notice, Prediction, Profile, Report, Sample, SavedNight, Trace } from "../types";
import { Curves } from "./Curves";
import { ModulationMap } from "./ModulationMap";
import { Outcome } from "./Outcome";
import { Notices } from "./Notices";
import { Panel } from "./Panel";
import { cx, focusRing, primaryButton } from "./styles";

export function Laudo({
  report,
  trace,
  morning,
  derived,
  notices,
  predictions,
  timeline,
  profile,
  previous,
  onAgain,
  onMenu,
}: {
  report: Report;
  trace: Trace[];
  morning: Body;
  derived: Derived;
  notices: Notice[];
  predictions: Prediction[];
  timeline: Sample[];
  profile: Profile;
  previous: SavedNight | null;
  onAgain: () => void;
  onMenu: () => void;
}) {
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const right = predictions.filter((p) => p.correct).length;

  return (
    <article>
      <p className="text-xs tracking-widest text-accent uppercase">
        Manhã seguinte · fisiologia · {profile.short}
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none font-medium text-fg">{report.name}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{report.essay}</p>
      {report.profileEssay ? (
        <p className="mt-4 max-w-2xl border-l-2 border-accent pl-3 text-base leading-relaxed text-fg">
          {report.profileEssay}
        </p>
      ) : null}

      <Notices notices={notices} className="mt-6" />

      <div className="mt-8">
        <Outcome morning={morning} profile={profile} />
      </div>

      <div className="mt-10">
        <Curves timeline={timeline} profile={profile} previous={previous} />
      </div>

      <div className="mt-10">
        <ModulationMap acc={morning.acc} />
      </div>

      <h2 className="mt-10 font-display text-2xl text-fg">Suas previsões</h2>
      <p className="mt-1 text-sm text-faint">
        {right} de {predictions.length} conferiram com o modelo. Não é nota: é onde o raciocínio e o cálculo se
        separaram.
      </p>
      <ol className="mt-3 grid gap-2">
        {predictions.map((p) => (
          <li
            key={p.hour + p.spec.kind}
            className={cx(
              "rounded-card border px-4 py-3",
              p.correct ? "border-line bg-surface" : "border-accent bg-accent-dim",
            )}
          >
            <p className="text-xs tracking-widest text-muted uppercase">
              {p.hour} · {p.correct ? "conferiu" : "não conferiu"}
            </p>
            <p className="mt-1 text-sm text-fg">
              {p.spec.question} você disse “{optionLabel(p, p.picked)}”, o modelo deu “{optionLabel(p, p.answer)}”.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{p.detail}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-2xl text-fg">O corpo ao acordar</h2>
      <div className="mt-3">
        <Panel body={morning} derived={derived} hour="07:10" profile={profile} open />
      </div>

      <h2 className="mt-10 font-display text-2xl text-fg">Se o ritmo ficar</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-faint">
        O mesmo passo, repetido. Não é sentença. É a curva de quem não muda a noite.
      </p>
      <ol className="mt-4 grid gap-3">
        {report.horizons.map((horizon) => (
          <li key={horizon.span} className="rounded-card border border-line bg-surface px-4 py-4">
            <p className="text-xs tracking-widest text-accent uppercase">
              {horizon.span}
              <span className="text-faint"> · {horizon.when}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{horizon.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-2xl text-fg">O que cada hora fez</h2>
      <ol className="mt-3 divide-y divide-line border-y border-line">
        {trace.map((step) => (
          <li key={step.hour + step.id} className="flex items-baseline justify-between gap-4 py-3">
            <span>
              <span className="mr-3 text-xs text-faint">{step.hour}</span>
              <span className={cx("text-sm", step.kind === "evento" ? "text-muted italic" : "text-fg")}>
                {step.title}
              </span>
              {step.detail ? <span className="ml-2 text-xs text-faint">{step.detail}</span> : null}
            </span>
            <span className="shrink-0 text-xs tracking-wide text-muted uppercase">{step.renal}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-2xl text-fg">Perguntas para a sala</h2>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-muted">
        {report.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>

      <button
        type="button"
        aria-expanded={bridgeOpen}
        onClick={() => setBridgeOpen((v) => !v)}
        className={cx(
          "mt-8 min-h-11 text-left text-sm text-accent underline decoration-line underline-offset-4",
          focusRing,
        )}
      >
        {bridgeOpen ? "Fechar o modelo" : "Abrir o modelo — o que está calculado, e o que não está"}
      </button>
      {bridgeOpen ? (
        <div className="mt-4 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
          {BRIDGE.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onAgain} className={primaryButton}>
          Outra noite, mesmo corpo
        </button>
        <button
          type="button"
          onClick={onMenu}
          className={cx("min-h-11 rounded-full border border-line px-5 py-3 text-sm text-fg hover:border-accent", focusRing)}
        >
          Trocar formato ou corpo
        </button>
      </div>
    </article>
  );
}
