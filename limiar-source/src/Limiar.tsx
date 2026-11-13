import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BRIDGE,
  INITIAL_BODY,
  applyEffect,
  derive,
  moved,
  narrate,
  passHours,
  readings,
  settleMorning,
  writeReport,
} from "./engine";
import { SCENES } from "./scenes";
import type { Body, Choice, Derived, Trace } from "./types";

const STORE_KEY = "limiar-perfil";
const MORNING_SET = 52;
const MORNING_BROKEN = 40;

type Pending = {
  choice: Choice;
  before: Body;
  after: Body;
  d0: Derived;
  d1: Derived;
  now: string;
  later: string;
};

export function Limiar() {
  const [phase, setPhase] = useState<"intro" | "night" | "laudo">("intro");
  const [round, setRound] = useState(0);
  const [body, setBody] = useState<Body>(INITIAL_BODY);
  const [trace, setTrace] = useState<Trace[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [notices, setNotices] = useState<string[]>([]);
  const [morning, setMorning] = useState<Body>(INITIAL_BODY);
  const [eveningCortisol, setEveningCortisol] = useState(12);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [lastProfile, setLastProfile] = useState<string | null>(null);
  const lock = useRef(false);
  const visibleRef = useRef<Choice[]>([]);

  useEffect(() => {
    try {
      setLastProfile(localStorage.getItem(STORE_KEY));
    } catch {
      /* private mode */
    }
  }, []);

  const scene = SCENES[round];
  const derived = derive(body, phase === "laudo" ? (morning.curveBroken ? MORNING_BROKEN : MORNING_SET) : scene.setPoint);
  visibleRef.current = scene.choices;

  useEffect(() => {
    if (phase !== "night") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" && pending) {
        advance();
        return;
      }
      const index = Number(event.key);
      const choice = visibleRef.current[index - 1];
      if (!pending && choice) choose(choice);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function begin() {
    lock.current = false;
    setBody(INITIAL_BODY);
    setMorning(INITIAL_BODY);
    setTrace([]);
    setRound(0);
    setPending(null);
    setNotices([]);
    setBridgeOpen(false);
    setPhase("night");
  }

  function choose(choice: Choice) {
    if (lock.current || pending) return;
    lock.current = true;
    const before = body;
    const after = applyEffect(before, choice.effect);
    const d0 = derive(before, scene.setPoint);
    const d1 = derive(after, scene.setPoint);
    const text = narrate(choice, d0, d1, after);
    setPending({ choice, before, after, d0, d1, now: text.now, later: text.later });
    setBody(after);
    setTrace((prev) => [
      ...prev,
      {
        hour: scene.hour,
        title: choice.title,
        renal: d1.renal,
        tfg: d1.tfg,
        creat: after.creat,
      },
    ]);
  }

  function advance() {
    lock.current = false;
    if (!pending) return;
    if (round >= SCENES.length - 1) {
      const evening = derive(body, scene.setPoint).cortisol;
      const settled = settleMorning(body, scene.setPoint);
      const report = writeReport(
        settled.body,
        trace,
        derive(settled.body, settled.body.curveBroken ? MORNING_BROKEN : MORNING_SET).cortisol,
        evening,
      );
      try {
        localStorage.setItem(STORE_KEY, report.name);
      } catch {
        /* ignore */
      }
      setLastProfile(report.name);
      setEveningCortisol(evening);
      setMorning(settled.body);
      setNotices(settled.notices);
      setPending(null);
      setPhase("laudo");
      return;
    }
    const nextScene = SCENES[round + 1];
    const passed = passHours(body, nextScene.gap, scene.setPoint);
    setBody(passed.body);
    setNotices(passed.notices);
    setRound((n) => n + 1);
    setPending(null);
  }

  if (phase === "intro") {
    return (
      <Shell>
        <Intro lastProfile={lastProfile} onBegin={begin} />
      </Shell>
    );
  }

  if (phase === "laudo") {
    const report = writeReport(
      morning,
      trace,
      derive(morning, morning.curveBroken ? MORNING_BROKEN : MORNING_SET).cortisol,
      eveningCortisol,
    );
    const morningDerived = derive(morning, morning.curveBroken ? MORNING_BROKEN : MORNING_SET);
    return (
      <Shell>
        <Laudo
          report={report}
          trace={trace}
          morning={morning}
          derived={morningDerived}
          notices={notices}
          bridgeOpen={bridgeOpen}
          onToggleBridge={() => setBridgeOpen((v) => !v)}
          onAgain={begin}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="mb-5 flex items-baseline justify-between gap-4">
        <p className="font-display text-lg tracking-wide text-fg">Limiar</p>
        <p className="text-sm text-muted">
          {scene.hour}
          <span className="text-faint">
            {" "}
            · {round + 1} de {SCENES.length}
          </span>
        </p>
      </header>

      {notices.length > 0 ? (
        <div className="mb-5 grid gap-2">
          {notices.map((notice) => (
            <p key={notice} className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg">
              {notice}
            </p>
          ))}
        </div>
      ) : null}

      <Systems body={body} derived={derived} hour={scene.hour} line={derived.renalLine} />

      <section className="mt-6">
        <p className="text-xs tracking-widest text-accent uppercase">{scene.kicker}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight font-medium text-fg">{scene.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{scene.cause}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg">{scene.demand}</p>
      </section>

      {pending ? (
        <Aftermath pending={pending} last={round >= SCENES.length - 1} onNext={advance} />
      ) : (
        <div className="mt-6 grid gap-3">
          {scene.choices.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice)}
              className="min-h-11 rounded-card border border-line bg-surface px-4 py-4 text-left transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl leading-tight text-fg">{choice.title}</span>
                <span className="text-xs text-faint">{index + 1}</span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">{choice.act}</span>
              <span className="mt-3 block text-xs leading-relaxed text-faint">{choice.gloss}</span>
            </button>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">{children}</main>;
}

function Intro({ lastProfile, onBegin }: { lastProfile: string | null; onBegin: () => void }) {
  return (
    <article>
      <p className="text-xs tracking-widest text-accent uppercase">Fisiologia · a primeira passagem</p>
      <h1 className="mt-4 font-display text-6xl leading-none font-medium text-fg sm:text-7xl">Limiar</h1>
      <p className="mt-6 max-w-xl font-display text-2xl leading-snug font-medium text-fg italic">
        O corpo, sistema por sistema. A ética fica para a outra passagem, com esta mesma noite.
      </p>
      <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted">
        <p>
          Cinco horas. Em cada uma você não escolhe o certo moral: escolhe qual sistema responde. Autônomo, HPA, glicose, adenosina, IL-6, pressão, rim.
        </p>
        <p>
          O tempo é o jogo. Catecolamina acaba em minutos. Cortisol, em horas. Cafeína, na outra metade do dia. Creatinina só no compasso seguinte. IL-6 quando o cortisol já foi embora.
        </p>
        <p className="text-fg">
          Um turno não dá insuficiência renal crônica. A falha que pode aparecer é hemodinâmica: pouco volume, angiotensina, sem prostaglandina. Carga é o fluxo cair e a TFG segurar.
        </p>
      </div>
      <button
        type="button"
        onClick={onBegin}
        className="mt-8 min-h-11 rounded-full bg-accent px-6 py-3 text-base font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Entrar na noite
      </button>
      <p className="mt-4 text-sm text-faint">Cerca de oito minutos. Os números são um modelo, não um exame.</p>
      {lastProfile ? <p className="mt-2 text-sm text-muted">Última leitura desta sala: {lastProfile}.</p> : null}
    </article>
  );
}

function Systems({
  body,
  derived,
  hour,
  line,
}: {
  body: Body;
  derived: Derived;
  hour: string;
  line: string;
}) {
  return (
    <section className="rounded-card border border-line bg-surface px-4 py-3">
      <ul className="divide-y divide-line">
        {readings(body, derived, hour).map((row) => (
          <li key={row.label} className="flex items-baseline justify-between gap-4 py-2">
            <span className="text-xs tracking-wide text-faint uppercase">{row.label}</span>
            <span className="text-right text-sm text-fg">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line pt-3 text-sm leading-relaxed text-muted">{line}</p>
    </section>
  );
}

function Aftermath({ pending, last, onNext }: { pending: Pending; last: boolean; onNext: () => void }) {
  const rows = moved(pending.before, pending.after, pending.d0, pending.d1, "agora");
  return (
    <section className="mt-6 rounded-card border border-line bg-surface px-4 py-5 sm:px-5">
      <p className="text-xs tracking-widest text-accent uppercase">Nesta hora</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-fg">{pending.choice.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{pending.now}</p>
      <p className="mt-3 text-sm leading-relaxed text-fg">{pending.later}</p>
      {rows.length > 0 ? (
        <ul className="mt-4 grid gap-1">
          {rows.map((row) => (
            <li key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted">{row.label}</span>
              <span className="text-right text-fg">{row.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={onNext}
        className="mt-5 min-h-11 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {last ? "Ver a manhã" : "Avançar as horas"}
      </button>
    </section>
  );
}

function Laudo({
  report,
  trace,
  morning,
  derived,
  notices,
  bridgeOpen,
  onToggleBridge,
  onAgain,
}: {
  report: ReturnType<typeof writeReport>;
  trace: Trace[];
  morning: Body;
  derived: Derived;
  notices: string[];
  bridgeOpen: boolean;
  onToggleBridge: () => void;
  onAgain: () => void;
}) {
  return (
    <article>
      <p className="text-xs tracking-widest text-accent uppercase">Manhã seguinte · fisiologia</p>
      <h1 className="mt-3 font-display text-5xl leading-none font-medium text-fg">{report.name}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{report.essay}</p>

      {notices.length > 0 ? (
        <div className="mt-6 grid gap-2">
          {notices.map((notice) => (
            <p key={notice} className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg">
              {notice}
            </p>
          ))}
        </div>
      ) : null}

      <h2 className="mt-8 font-display text-2xl text-fg">O corpo ao acordar</h2>
      <div className="mt-3">
        <Systems body={morning} derived={derived} hour="07:10" line={derived.renalLine} />
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
          <li key={step.hour} className="flex items-baseline justify-between gap-4 py-3">
            <span>
              <span className="mr-3 text-xs text-faint">{step.hour}</span>
              <span className="text-sm text-fg">{step.title}</span>
            </span>
            <span className="shrink-0 text-xs tracking-wide text-muted uppercase">{step.renal}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-2xl text-fg">Três perguntas para a sala</h2>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-muted">
        {report.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>

      <button
        type="button"
        aria-expanded={bridgeOpen}
        onClick={onToggleBridge}
        className="mt-8 min-h-11 text-left text-sm text-accent underline decoration-line underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

      <button
        type="button"
        onClick={onAgain}
        className="mt-8 min-h-11 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Outra noite
      </button>
    </article>
  );
}
