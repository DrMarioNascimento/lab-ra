import { useMemo } from "react";
import { LINKS, SOURCE_LABEL } from "../network";
import { referenceNight } from "../timeline";
import type { Body, Profile } from "../types";

function verdict(carga: number, ref: number): string {
  const ratio = carga / Math.max(ref, 1);
  if (ratio < 1.2) return "Perto da noite de retorno. Os sistemas saíram do basal e voltaram.";
  if (ratio < 1.8) return "Acima do retorno. Mais horas fora do basal, mas sem um sistema dominando a conta.";
  if (ratio < 2.6) return "Quase o dobro da noite de retorno. A rede passou o período puxando na mesma direção.";
  return "Muito acima do retorno. Um eixo alimentou o outro e a noite não teve como devolver.";
}

export function Outcome({ morning, profile }: { morning: Body; profile: Profile }) {
  const ref = useMemo(() => referenceNight(profile).at(-1)?.carga ?? 0, [profile]);
  const parts = LINKS.filter((l) => l.to === "carga")
    .map((l) => ({ label: SOURCE_LABEL[l.from], mech: l.mech, value: morning.acc[l.id] ?? 0 }))
    .sort((a, b) => b.value - a.value);
  const total = Math.max(1, parts.reduce((sum, p) => sum + p.value, 0));
  const scale = Math.max(morning.carga, ref, 1);

  return (
    <section aria-labelledby="desfecho" className="rounded-card border border-line bg-surface px-4 py-5 sm:px-5">
      <p className="text-xs tracking-widest text-accent uppercase">Desfecho do período</p>
      <h2 id="desfecho" className="mt-2 font-display text-3xl text-fg">
        Carga alostática {Math.round(morning.carga)}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{verdict(morning.carga, ref)}</p>

      <div className="mt-4 grid gap-2" aria-hidden="true">
        <div className="flex items-center gap-3 text-xs">
          <span className="w-28 shrink-0 text-muted">Esta noite</span>
          <div className="h-2 flex-1 rounded-full bg-raise">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${(morning.carga / scale) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="w-28 shrink-0 text-muted">Retorno · {Math.round(ref)}</span>
          <div className="h-2 flex-1 rounded-full bg-raise">
            <div className="h-2 rounded-full bg-faint" style={{ width: `${(ref / scale) * 100}%` }} />
          </div>
        </div>
      </div>

      <h3 className="mt-6 text-xs tracking-widest text-faint uppercase">De onde veio a carga</h3>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 sm:gap-x-6">
        {parts.map((p) => (
          <li key={p.label} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-fg">{p.label}</span>
              <span className="text-xs text-muted tabular-nums">{Math.round((p.value / total) * 100)}%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-raise" aria-hidden="true">
              <div className="h-1 rounded-full bg-accent" style={{ width: `${(p.value / total) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-faint">{p.mech}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
