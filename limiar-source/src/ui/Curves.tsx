import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { failLine } from "../engine";
import { PROFILES } from "../profiles";
import { SCENES } from "../scenes";
import { clock, NIGHT_END, referenceNight, sceneTime } from "../timeline";
import type { Profile, Sample, SavedNight } from "../types";
import { cx, focusRing } from "./styles";

type SeriesKey =
  | "estresse"
  | "cortisol"
  | "catecol"
  | "tfg"
  | "creat"
  | "adenosina"
  | "il6"
  | "volemia"
  | "vagal"
  | "glicose"
  | "insulina"
  | "melatonina"
  | "linfocitos"
  | "potassio"
  | "carga";

const SERIES: { key: SeriesKey; label: string; note: string }[] = [
  { key: "estresse", label: "Estresse", note: "O motor central. Puxa catecolamina e cortisol; o vago puxa de volta." },
  { key: "cortisol", label: "Cortisol", note: "Basal circadiano mais o excesso. A noite deveria descer." },
  { key: "linfocitos", label: "Linfócitos/NK", note: "Caem quando o cortisol sobe e quando o sono falta." },
  { key: "glicose", label: "Glicose", note: "Adrenalina e cortisol sobem; insulina puxa de volta." },
  { key: "insulina", label: "Insulina", note: "Segue a glicose, contida pela adrenalina." },
  { key: "melatonina", label: "Melatonina", note: "Pico noturno, apagado pela luz do plantão." },
  { key: "potassio", label: "Potássio", note: "β2 e insulina empurram para dentro; rim em falha retém." },
  { key: "carga", label: "Carga alostática", note: "Soma do que cada sistema ficou fora do basal, hora a hora." },
  { key: "catecol", label: "Catecolamina", note: "Picos de minutos. O que importa é se volta." },
  { key: "vagal", label: "Vago (HRV)", note: "O freio. Cai com descarga, volta com sono e respiração." },
  { key: "tfg", label: "TFG", note: "A linha tracejada é onde a hora vira falha neste corpo." },
  { key: "creat", label: "Creatinina", note: "Sempre atrasada em relação à TFG." },
  { key: "adenosina", label: "Adenosina", note: "Sobe acordado, só cai dormindo. A cafeína não aparece aqui." },
  { key: "il6", label: "IL-6", note: "Contida sob cortisol, aparece quando ele desce sem sono." },
  { key: "volemia", label: "Volume", note: "Cai acordado e sem beber. É o que segura o rim." },
];

const ACCENT = "#d4654a";
const GHOST = "#8c8278";
const GRID = "#3a322b";
const TICK = "#b3a89c";

const TICKS = [...SCENES.map((_, i) => sceneTime(i)), NIGHT_END];

export function Curves({
  timeline,
  profile,
  previous,
}: {
  timeline: Sample[];
  profile: Profile;
  previous: SavedNight | null;
}) {
  const [ghost, setGhost] = useState<"retorno" | "anterior">("retorno");
  const reference = useMemo(() => referenceNight(profile), [profile]);
  const ghostData = ghost === "anterior" && previous ? previous.timeline : reference;
  const ghostName =
    ghost === "anterior" && previous
      ? `Noite anterior (${previous.name}, ${PROFILES[previous.profile]?.short ?? ""})`
      : "Noite de retorno, mesmo corpo";

  return (
    <section aria-labelledby="curvas">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="curvas" className="font-display text-2xl text-fg">
            As 28 horas, em curva
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-faint">
            Linha cheia: esta noite. Tracejado: {ghostName.toLowerCase()}.
          </p>
        </div>
        <div className="flex gap-2" role="radiogroup" aria-label="Comparar com">
          {(
            [
              ["retorno", "Retorno"],
              ["anterior", "Noite anterior"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={ghost === id}
              disabled={id === "anterior" && !previous}
              onClick={() => setGhost(id)}
              className={cx(
                "min-h-9 rounded-full border px-3 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                ghost === id ? "border-accent bg-accent-dim text-fg" : "border-line text-muted hover:text-fg",
                focusRing,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SERIES.map((series) => (
          <figure key={series.key} className="rounded-card border border-line bg-surface px-3 pt-3 pb-2">
            <figcaption className="px-1">
              <span className="text-xs tracking-widest text-accent uppercase">{series.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-faint">{series.note}</span>
            </figcaption>
            <div className="mt-2 h-36" role="img" aria-label={`Curva de ${series.label} ao longo da noite`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="t"
                    domain={[0, NIGHT_END]}
                    ticks={TICKS}
                    tickFormatter={clock}
                    tick={{ fill: TICK, fontSize: 10 }}
                    stroke={GRID}
                    allowDuplicatedCategory={false}
                  />
                  <YAxis tick={{ fill: TICK, fontSize: 10 }} stroke={GRID} width={42} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ background: "#1e1915", border: `1px solid ${GRID}`, borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: TICK }}
                    labelFormatter={(t) => clock(Number(t))}
                    formatter={(value, name) => [Math.round(Number(value) * 10) / 10, name]}
                  />
                  {series.key === "tfg" ? (
                    <ReferenceLine y={failLine(profile)} stroke={ACCENT} strokeDasharray="4 4" strokeOpacity={0.6} />
                  ) : null}
                  <Line
                    data={ghostData}
                    dataKey={series.key}
                    name="Comparação"
                    type="monotone"
                    stroke={GHOST}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    data={timeline}
                    dataKey={series.key}
                    name="Esta noite"
                    type="linear"
                    stroke={ACCENT}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
