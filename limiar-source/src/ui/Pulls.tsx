import { SOURCE_LABEL, type Pull } from "../network";
import { cx } from "./styles";

export function Pulls({
  pulls,
  title,
  note,
  limit = 6,
  className,
}: {
  pulls: Pull[];
  title: string;
  note?: string;
  limit?: number;
  className?: string;
}) {
  const shown = pulls.slice(0, limit);
  if (shown.length === 0) return null;
  const max = Math.max(...shown.map((p) => Math.abs(p.value)), 1);

  return (
    <section className={cx("rounded-card border border-line bg-surface px-4 py-4", className)}>
      <h2 className="text-xs tracking-widest text-accent uppercase">{title}</h2>
      {note ? <p className="mt-1 text-xs leading-relaxed text-faint">{note}</p> : null}
      <ul className="mt-3 grid gap-3">
        {shown.map(({ link, value }) => {
          const up = value > 0;
          const width = `${Math.max(6, (Math.abs(value) / max) * 100)}%`;
          return (
            <li key={link.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-fg">
                  {SOURCE_LABEL[link.from]}
                  <span className="mx-1.5 text-faint" aria-hidden="true">
                    →
                  </span>
                  {SOURCE_LABEL[link.to]}
                </span>
                <span className={cx("shrink-0 text-xs tabular-nums", up ? "text-accent" : "text-cool")}>
                  {up ? "puxa para cima" : "puxa para baixo"} {Math.abs(Math.round(value))}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-raise" aria-hidden="true">
                <div className={cx("h-1 rounded-full", up ? "bg-accent" : "bg-cool")} style={{ width }} />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{link.mech}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
