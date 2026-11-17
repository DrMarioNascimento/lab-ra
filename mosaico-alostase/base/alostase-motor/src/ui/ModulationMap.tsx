import { useState } from "react";
import { LINKS, SOURCE_LABEL, type NetKey, type SourceKey } from "../network";
import { cx, focusRing } from "./styles";

const SOURCES: SourceKey[] = [
  "estresse",
  "catecol",
  "cortisol",
  "vagal",
  "glicose",
  "insulina",
  "adenosina",
  "melatonina",
  "il6",
  "linfocitos",
  "volemia",
  "cafeina",
  "ang",
  "tfg",
  "sono",
  "luz",
];

const TARGETS: NetKey[] = [
  "estresse",
  "catecol",
  "pulse",
  "vagal",
  "glicose",
  "insulina",
  "melatonina",
  "il6",
  "linfocitos",
  "potassio",
  "adenosina",
  "volemia",
  "carga",
];

const SHORT: Partial<Record<SourceKey, string>> = {
  estresse: "Estr",
  catecol: "Cat",
  pulse: "Cort",
  cortisol: "Cort",
  vagal: "Vago",
  glicose: "Glic",
  insulina: "Ins",
  adenosina: "Aden",
  melatonina: "Mel",
  il6: "IL-6",
  linfocitos: "Linf",
  potassio: "K+",
  volemia: "Vol",
  carga: "Carga",
};

export function ModulationMap({ acc }: { acc: Record<string, number> }) {
  const [focus, setFocus] = useState<string | null>(null);

  const cell = new Map<string, { value: number; ids: string[] }>();
  for (const link of LINKS) {
    const key = `${link.from}|${link.to}`;
    const v = acc[link.id] ?? 0;
    const prev = cell.get(key) ?? { value: 0, ids: [] };
    cell.set(key, { value: prev.value + v, ids: [...prev.ids, link.id] });
  }
  const rows = SOURCES.filter((s) => TARGETS.some((t) => cell.has(`${s}|${t}`)));
  const max = Math.max(
    1,
    ...[...cell.entries()].filter(([k]) => !k.endsWith("|carga")).map(([, c]) => Math.abs(c.value)),
  );
  const maxCarga = Math.max(
    1,
    ...[...cell.entries()].filter(([k]) => k.endsWith("|carga")).map(([, c]) => Math.abs(c.value)),
  );

  const focused = focus ? cell.get(focus) : null;
  const focusLinks = focused ? LINKS.filter((l) => focused.ids.includes(l.id)) : [];

  return (
    <section aria-labelledby="mapa">
      <h2 id="mapa" className="font-display text-2xl text-fg">
        Quem modulou quem, na noite inteira
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-faint">
        Linha: quem age. Coluna: quem recebe. Cada quadrado é o empurrão somado ao longo das 28 horas, em
        unidade de índice × hora. <span className="text-accent">Quente</span> estimula,{" "}
        <span className="text-cool">frio</span> inibe. A última coluna é o quanto cada sistema somou na carga
        alostática.
      </p>

      <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface p-3">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-xs">
          <caption className="sr-only">Matriz de modulação acumulada entre variáveis</caption>
          <thead>
            <tr>
              <th scope="col" className="w-24" />
              {TARGETS.map((t) => (
                <th key={t} scope="col" className="px-1 pb-1 text-center font-normal text-muted">
                  {SHORT[t] ?? SOURCE_LABEL[t]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s}>
                <th scope="row" className="pr-2 text-right font-normal whitespace-nowrap text-muted">
                  {SOURCE_LABEL[s]}
                </th>
                {TARGETS.map((t) => {
                  const key = `${s}|${t}`;
                  const c = cell.get(key);
                  if (!c) return <td key={t} className="h-7 rounded-sm bg-bg/40" />;
                  const scale = t === "carga" ? maxCarga : max;
                  const alpha = Math.min(1, 0.12 + (Math.abs(c.value) / scale) * 0.88);
                  const up = c.value >= 0;
                  const label = `${SOURCE_LABEL[s]} sobre ${SOURCE_LABEL[t]}: ${Math.round(c.value)}`;
                  return (
                    <td key={t} className="h-7 p-0">
                      <button
                        type="button"
                        aria-label={label}
                        aria-pressed={focus === key}
                        title={label}
                        onClick={() => setFocus(focus === key ? null : key)}
                        className={cx(
                          "h-7 w-full rounded-sm text-[10px] tabular-nums transition-[outline]",
                          focus === key && "outline outline-2 outline-fg",
                          focusRing,
                        )}
                        style={{
                          backgroundColor: up
                            ? `rgba(212, 101, 74, ${alpha})`
                            : `rgba(143, 179, 207, ${alpha})`,
                          color: alpha > 0.55 ? "#14110e" : "#f4eee6",
                        }}
                      >
                        {Math.abs(c.value) >= 1 ? Math.round(c.value) : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 min-h-16 text-sm leading-relaxed" aria-live="polite">
        {focusLinks.length > 0 ? (
          focusLinks.map((l) => (
            <p key={l.id} className="text-muted">
              <span className="text-fg">
                {SOURCE_LABEL[l.from]} → {SOURCE_LABEL[l.to]}
              </span>{" "}
              · {Math.round(acc[l.id] ?? 0)}. {l.mech}
            </p>
          ))
        ) : (
          <p className="text-faint">Toque num quadrado para ver o mecanismo.</p>
        )}
      </div>
    </section>
  );
}
