import { fullReadings, readings, type ReadingKey } from "../engine";
import type { Body, Derived, Profile } from "../types";
import { cx, focusRing } from "./styles";

export function Panel({
  body,
  derived,
  hour,
  profile,
  open,
  requested = [],
  budget = 0,
  onRequest,
}: {
  body: Body;
  derived: Derived;
  hour: string;
  profile: Profile;
  /** Painel inteiro visível (aula curta e laudo). */
  open: boolean;
  requested?: ReadingKey[];
  budget?: number;
  onRequest?: (key: ReadingKey) => void;
}) {
  const rows = open ? fullReadings(body, derived, hour, profile) : readings(body, derived, hour, profile);

  return (
    <section aria-label="Leituras do corpo" className="rounded-card border border-line bg-surface px-4 py-3">
      {!open ? (
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
          <span className="text-xs tracking-widest text-faint uppercase">À beira do leito</span>
          <span className="text-xs text-muted" aria-live="polite">
            {budget} {budget === 1 ? "pedido restante" : "pedidos restantes"} nesta noite
          </span>
        </div>
      ) : null}
      <ul className="grid sm:grid-cols-2 sm:gap-x-6">
        {rows.map((row) => {
          const visible = open || row.access === "leito" || requested.includes(row.key);
          return (
            <li key={row.key} className="flex min-h-10 items-center justify-between gap-4 border-b border-line py-2">
              <span className="flex flex-col">
                <span className="text-xs tracking-wide text-faint uppercase">{row.label}</span>
                {!open && row.access !== "leito" ? <span className="text-xs text-faint">{row.source}</span> : null}
              </span>
              {visible ? (
                <span className="text-right text-sm text-fg">{row.value}</span>
              ) : row.access === "modelo" ? (
                <span className="text-right text-xs text-faint">Só no laudo</span>
              ) : (
                <button
                  type="button"
                  disabled={budget <= 0}
                  onClick={() => onRequest?.(row.key)}
                  className={cx(
                    "min-h-9 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-accent hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",
                    focusRing,
                  )}
                >
                  Pedir
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {open ? <p className="pt-3 text-sm leading-relaxed text-muted">{derived.renalLine}</p> : null}
    </section>
  );
}
