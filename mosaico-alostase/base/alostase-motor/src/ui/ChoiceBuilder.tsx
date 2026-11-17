import { ADJUNCTS, DOSE_LABELS, DOSE_LEVELS, needsBuilder } from "../options";
import type { AdjunctId, Choice, DoseLevel } from "../types";
import type { Selection } from "../useNight";
import { cx, focusRing, primaryButton } from "./styles";

export function ChoiceBuilder({
  choices,
  selection,
  adjuncts,
  extended,
  onSelect,
  onDose,
  onToggle,
  onConfirm,
}: {
  choices: Choice[];
  selection: Selection;
  adjuncts: AdjunctId[];
  extended: boolean;
  onSelect: (id: string) => void;
  onDose: (dose: DoseLevel) => void;
  onToggle: (id: AdjunctId) => void;
  onConfirm: (id?: string) => void;
}) {
  return (
    <div className="mt-6 grid gap-3">
      {choices.map((choice, index) => {
        const selected = selection.choiceId === choice.id;
        const builder = needsBuilder(choice, adjuncts, extended);
        const free = adjuncts.filter((a) => !choice.blocks?.includes(a));
        return (
          <div
            key={choice.id}
            className={cx(
              "rounded-card border bg-surface transition-colors duration-200",
              selected ? "border-accent" : "border-line hover:border-muted",
            )}
          >
            <button
              type="button"
              aria-expanded={builder ? selected : undefined}
              onClick={() => (builder ? onSelect(choice.id) : onConfirm(choice.id))}
              className={cx("w-full rounded-card px-4 py-4 text-left", focusRing)}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl leading-tight text-fg">{choice.title}</span>
                <span className="text-xs text-faint" aria-hidden="true">
                  {index + 1}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">{choice.act}</span>
              <span className="mt-3 block text-xs leading-relaxed text-faint">{choice.gloss}</span>
            </button>

            {builder && selected ? (
              <div className="border-t border-line px-4 pt-4 pb-4">
                {choice.dose ? (
                  <fieldset>
                    <legend className="text-xs tracking-widest text-faint uppercase">Dose</legend>
                    <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
                      {DOSE_LEVELS.map((level) => {
                        const on = selection.dose === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => onDose(level)}
                            className={cx(
                              "min-h-10 rounded-full border px-4 text-sm transition-colors",
                              on ? "border-accent bg-accent-dim text-fg" : "border-line text-muted hover:text-fg",
                              focusRing,
                            )}
                          >
                            {DOSE_LABELS[choice.dose!][level]}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                {free.length > 0 ? (
                  <fieldset className={choice.dose ? "mt-4" : ""}>
                    <legend className="text-xs tracking-widest text-faint uppercase">Junto, nesta hora</legend>
                    <div className="mt-2 grid gap-2">
                      {free.map((id) => {
                        const adj = ADJUNCTS[id];
                        const on = selection.adjuncts.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => onToggle(id)}
                            className={cx(
                              "flex min-h-11 items-start gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                              on ? "border-accent bg-accent-dim" : "border-line hover:border-muted",
                              focusRing,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cx(
                                "mt-1 size-3.5 shrink-0 rounded-sm border",
                                on ? "border-accent bg-accent" : "border-muted",
                              )}
                            />
                            <span>
                              <span className="block text-sm text-fg">{adj.title}</span>
                              <span className="block text-xs leading-relaxed text-muted">{adj.act}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                <button type="button" onClick={() => onConfirm()} className={cx(primaryButton, "mt-4")}>
                  Responder com {choice.title.toLowerCase()}
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
