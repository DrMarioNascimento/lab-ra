import { moved, type ReadingKey } from "../engine";
import { optionLabel } from "../predictions";
import type { Prediction, Profile } from "../types";
import type { Pull } from "../network";
import type { Pending } from "../useNight";
import { Pulls } from "./Pulls";
import { cx, primaryButton } from "./styles";

export function Aftermath({
  pending,
  profile,
  extended,
  requested,
  resolved,
  waiting,
  pulls,
  nextLabel,
  onNext,
}: {
  pending: Pending;
  profile: Profile;
  extended: boolean;
  requested: ReadingKey[];
  resolved: Prediction | null;
  waiting: Prediction | null;
  pulls: Pull[];
  nextLabel: string;
  onNext: () => void;
}) {
  const rows = moved(pending.before, pending.after, pending.d0, pending.d1, "agora", profile);
  const visible = extended ? rows.filter((r) => r.access === "leito" || requested.includes(r.key)) : rows;
  const hidden = rows.length - visible.length;

  return (
    <section className="mt-6 rounded-card border border-line bg-surface px-4 py-5 sm:px-5" aria-live="polite">
      {resolved ? (
        <div
          className={cx(
            "mb-5 rounded-xl border px-4 py-3",
            resolved.correct ? "border-fg/40" : "border-accent bg-accent-dim",
          )}
        >
          <p className="text-xs tracking-widest text-muted uppercase">
            Sua previsão · {resolved.correct ? "conferiu" : "não conferiu"}
          </p>
          <p className="mt-1 text-sm text-fg">
            Você disse “{optionLabel(resolved, resolved.picked)}”. O modelo deu “{optionLabel(resolved, resolved.answer)}”.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{resolved.detail}</p>
        </div>
      ) : null}
      {waiting ? (
        <p className="mb-5 border-l-2 border-line pl-3 text-sm leading-relaxed text-muted">
          Previsão guardada: “{optionLabel(waiting, waiting.picked)}”. Confere{" "}
          {waiting.spec.checkAt === "manhã" ? "de manhã" : `às ${waiting.spec.checkAt}`}.
        </p>
      ) : null}

      <p className="text-xs tracking-widest text-accent uppercase">Nesta hora</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-fg">{pending.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{pending.now}</p>
      {pending.extras.length > 0 ? (
        <ul className="mt-3 grid gap-1">
          {pending.extras.map((line) => (
            <li key={line} className="text-sm leading-relaxed text-muted">
              {line}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-fg">{pending.later}</p>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-1">
          {visible.map((row) => (
            <li key={row.key} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted">{row.label}</span>
              <span className="text-right text-fg">{row.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {hidden > 0 ? (
        <p className="mt-2 text-xs text-faint">
          {hidden === 1 ? "Mais uma leitura mudou" : `Mais ${hidden} leituras mudaram`} fora da sua vista.
        </p>
      ) : null}

      <Pulls
        pulls={pulls}
        title="Depois desta resposta, quem puxa quem"
        note="É isto que vai mover o corpo nas próximas horas, cada um com a sua meia-vida."
        limit={6}
        className="mt-5 bg-raise"
      />

      <button type="button" onClick={onNext} className={cx(primaryButton, "mt-5")}>
        {nextLabel}
      </button>
    </section>
  );
}
