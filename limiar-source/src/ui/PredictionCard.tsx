import type { PredictionSpec } from "../types";
import { cx, focusRing } from "./styles";

export function PredictionCard({
  spec,
  choiceTitle,
  onPick,
}: {
  spec: PredictionSpec;
  choiceTitle: string;
  onPick: (id: string) => void;
}) {
  return (
    <section className="mt-6 rounded-card border border-accent bg-surface px-4 py-5 sm:px-5" aria-labelledby="previsao">
      <p className="text-xs tracking-widest text-accent uppercase">Antes de ver · {choiceTitle}</p>
      <h2 id="previsao" className="mt-2 font-display text-3xl leading-tight text-fg">
        {spec.question}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {spec.resolve === "agora"
          ? "O modelo confere assim que você responder."
          : `O modelo confere ${spec.checkAt === "manhã" ? "de manhã" : `às ${spec.checkAt}`}, depois das horas correrem.`}
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {spec.options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onPick(option.id)}
            className={cx(
              "flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line bg-raise px-4 py-3 text-left text-sm text-fg transition-colors hover:border-accent",
              focusRing,
            )}
          >
            <span>{option.label}</span>
            <span className="text-xs text-faint" aria-hidden="true">
              {index + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
