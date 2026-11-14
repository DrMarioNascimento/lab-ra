import { useEffect, useRef, useState, type ReactNode } from "react";
import { PREDICTIONS } from "./predictions";
import { SCENES } from "./scenes";
import { Aftermath } from "./ui/Aftermath";
import { needsBuilder } from "./options";
import { ChoiceBuilder } from "./ui/ChoiceBuilder";
import { Pulls } from "./ui/Pulls";
import { pullsNow } from "./network";
import { contextAt } from "./engine";
import { Intro } from "./ui/Intro";
import { Laudo } from "./ui/Laudo";
import { Notices } from "./ui/Notices";
import { Panel } from "./ui/Panel";
import { PredictionCard } from "./ui/PredictionCard";
import { loadPrevious, reportFor, useNight } from "./useNight";

export function Limiar() {
  const night = useNight();
  const { state: s, profile, scene, choices, adjuncts, derived } = night;
  const [lastName, setLastName] = useState<string | null>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const extended = s.mode === "estendida";

  useEffect(() => {
    if (s.phase === "intro") setLastName(loadPrevious()?.name ?? null);
  }, [s.phase]);

  useEffect(() => {
    if (s.step === "escolher") window.scrollTo({ top: 0 });
    else actionRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [s.step, s.round, s.phase]);

  useEffect(() => {
    if (s.phase !== "cena" && s.phase !== "evento") return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const index = Number(event.key) - 1;
      if (s.step === "ver" && event.key === "Enter") {
        event.preventDefault();
        night.advance();
        return;
      }
      if (s.step === "prever") {
        const option = PREDICTIONS[scene.prediction].options[index];
        if (option) night.predict(option.id);
        return;
      }
      if (s.step === "escolher") {
        const choice = choices[index];
        if (choice) {
          if (needsBuilder(choice, adjuncts, extended)) night.select(choice.id);
          else night.confirm(choice.id);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (s.phase === "intro") {
    return (
      <Shell>
        <Intro lastName={lastName} onBegin={night.begin} />
      </Shell>
    );
  }

  if (s.phase === "laudo" && s.morning) {
    return (
      <Shell>
        <Laudo
          report={reportFor(s)}
          trace={s.trace}
          morning={s.morning}
          derived={derived}
          notices={s.notices}
          predictions={s.predictions}
          timeline={s.timeline}
          profile={profile}
          previous={s.previous}
          onAgain={() => night.begin(s.mode, s.profileId)}
          onMenu={night.restart}
        />
      </Shell>
    );
  }

  const isEvent = s.phase === "evento" && s.active;
  const hour = isEvent ? s.active!.event.hour : scene.hour;
  const last = !isEvent && s.round >= SCENES.length - 1;
  const lastPrediction = s.predictions[s.predictions.length - 1];
  const resolvedNow =
    !isEvent && s.step === "ver" && lastPrediction?.hour === scene.hour && lastPrediction.spec.resolve === "agora"
      ? lastPrediction
      : null;
  const waiting = !isEvent && s.step === "ver" ? s.open : null;

  return (
    <Shell>
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-display text-lg tracking-wide text-fg">
          Alostase
          <span className="ml-2 font-sans text-xs tracking-widest text-faint uppercase">
            {extended ? `estendida · ${profile.short}` : "aula curta"}
          </span>
        </p>
        <p className="text-sm text-muted">
          {hour}
          <span className="text-faint">
            {" "}
            · {isEvent ? `entre ${s.round + 1} e ${s.round + 2}` : `${s.round + 1} de ${SCENES.length}`}
          </span>
        </p>
      </header>

      <Notices notices={s.notices} className="mb-5" />

      <Panel
        body={night.shownBody}
        derived={derived}
        hour={hour}
        profile={profile}
        open={!extended}
        requested={s.requested}
        budget={s.budget}
        onRequest={night.request}
      />

      {s.step === "escolher" ? (
        <Pulls
          pulls={pullsNow(night.shownBody, derived, contextAt(s.t, night.setPoint, profile))}
          title="Agora, quem puxa quem"
          note="Cada variável corre atrás de um alvo. Estes são os empurrões mais fortes sobre esses alvos neste momento."
          limit={4}
          className="mt-3"
        />
      ) : null}

      <section className="mt-6">
        <p className="text-xs tracking-widest text-accent uppercase">{isEvent ? s.active!.event.kicker : scene.kicker}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight font-medium text-fg">
          {isEvent ? s.active!.event.title : scene.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {isEvent ? s.active!.event.cause : scene.cause}
        </p>
        {!isEvent ? <p className="mt-3 text-sm leading-relaxed text-fg">{scene.demand}</p> : null}
      </section>

      <div ref={actionRef} className="scroll-mt-4" />

      {s.step === "escolher" ? (
        <ChoiceBuilder
          choices={choices}
          selection={s.selection}
          adjuncts={adjuncts}
          extended={extended}
          onSelect={night.select}
          onDose={night.setDose}
          onToggle={night.toggleAdjunct}
          onConfirm={night.confirm}
        />
      ) : null}

      {s.step === "prever" && s.pending ? (
        <PredictionCard spec={PREDICTIONS[scene.prediction]} choiceTitle={s.pending.title} onPick={night.predict} />
      ) : null}

      {s.step === "ver" && s.pending ? (
        <Aftermath
          pending={s.pending}
          profile={profile}
          extended={extended}
          requested={s.requested}
          resolved={resolvedNow}
          waiting={waiting}
          pulls={pullsNow(s.pending.after, s.pending.d1, contextAt(s.t, night.setPoint, profile))}
          nextLabel={last ? "Ver a manhã" : "Avançar as horas"}
          onNext={night.advance}
        />
      ) : null}
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">{children}</main>;
}
