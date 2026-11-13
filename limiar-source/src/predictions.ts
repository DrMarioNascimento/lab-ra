import type { Body, Derived, Prediction, PredictionKind, PredictionSpec } from "./types";

const COMPARE = [
  { id: "maior", label: "Maior que agora" },
  { id: "parecida", label: "Parecida" },
  { id: "menor", label: "Menor que agora" },
];

export const PREDICTIONS: Record<PredictionKind, PredictionSpec> = {
  "adenosina-proxima": {
    kind: "adenosina-proxima",
    question: "Às 09:40, a adenosina estará:",
    options: COMPARE,
    resolve: "depois",
    checkAt: "09:40",
  },
  "cortisol-proximo": {
    kind: "cortisol-proximo",
    question: "Às 11:41, o excesso de cortisol estará:",
    options: COMPARE,
    resolve: "depois",
    checkAt: "11:41",
  },
  "renal-agora": {
    kind: "renal-agora",
    question: "Depois desta resposta, o rim fica em:",
    options: [
      { id: "folga", label: "Folga" },
      { id: "carga", label: "Carga" },
      { id: "falha", label: "Falha" },
    ],
    resolve: "agora",
  },
  "creatinina-quando": {
    kind: "creatinina-quando",
    question: "A creatinina:",
    options: [
      { id: "agora", label: "Sobe nesta hora" },
      { id: "depois", label: "Sobe só no intervalo seguinte" },
      { id: "nao", label: "Não sobe" },
    ],
    resolve: "depois",
    checkAt: "23:48",
  },
  "il6-manha": {
    kind: "il6-manha",
    question: "Ao acordar, a IL-6 estará:",
    options: COMPARE,
    resolve: "depois",
    checkAt: "manhã",
  },
};

/** Valor guardado no instante da escolha para comparar depois. */
export function anchorFor(kind: PredictionKind, after: Body): number {
  switch (kind) {
    case "adenosina-proxima":
      return after.adenosina;
    case "cortisol-proximo":
      return after.pulse;
    case "creatinina-quando":
      return after.creat;
    case "il6-manha":
      return after.il6;
    default:
      return 0;
  }
}

function compare(from: number, to: number, margin = 3): string {
  if (to > from + margin) return "maior";
  if (to < from - margin) return "menor";
  return "parecida";
}

function label(spec: PredictionSpec, id: string): string {
  return spec.options.find((o) => o.id === id)?.label ?? id;
}

const r = Math.round;

export function resolveNow(prediction: Prediction, derived: Derived): Prediction {
  const answer = derived.renal;
  return {
    ...prediction,
    answer,
    correct: prediction.picked === answer,
    detail: `Fluxo ${r(derived.rbf)}, TFG ${r(derived.tfg)}. ${
      answer === "carga"
        ? "Fluxo baixo com TFG segura: a autoregulação ainda dá conta."
        : answer === "falha"
          ? "O fluxo saiu da faixa de autoregulação e a TFG acompanhou."
          : "Fluxo na faixa. Ninguém pediu ao rim o que ele não tinha."
    }`,
  };
}

export function resolveLater(prediction: Prediction, body: Body): Prediction {
  const { spec, anchor } = prediction;
  let answer = "";
  let detail = "";
  switch (spec.kind) {
    case "adenosina-proxima":
      answer = compare(anchor, body.adenosina);
      detail = `Adenosina ${r(anchor)} → ${r(body.adenosina)}. Ela sobe a cada hora acordado e só cai dormindo. Catecolamina e cafeína escondem o sinal, não tiram a molécula.`;
      break;
    case "cortisol-proximo":
      answer = compare(anchor, body.pulse);
      detail = `Excesso de cortisol ${r(anchor)} → ${r(body.pulse)}. Meia-vida de ~1,5 h: em duas horas sobra cerca de 40% do pulso.`;
      break;
    case "creatinina-quando":
      answer = body.creat >= anchor + 1 ? "depois" : "nao";
      detail =
        answer === "depois"
          ? `Creatinina ${anchor.toFixed(1)} → ${body.creat.toFixed(1)}, no intervalo. Ela não se move no minuto em que a TFG cai: descreve a filtração de horas atrás.`
          : `Creatinina ${anchor.toFixed(1)} → ${body.creat.toFixed(1)}. A TFG não saiu da faixa por tempo suficiente para o índice contar. E nunca sobe no mesmo minuto da queda.`;
      break;
    case "il6-manha":
      answer = compare(anchor, body.il6);
      detail = `IL-6 ${r(anchor)} → ${r(body.il6)}. Ela fica contida sob cortisol agudo e aparece quando ele desce sem sono no lugar. Uma noite dormida puxa para baixo.`;
      break;
    default:
      break;
  }
  return { ...prediction, answer, correct: prediction.picked === answer, detail };
}

export function predictionNotice(p: Prediction): string {
  const picked = label(p.spec, p.picked);
  const answer = p.answer ? label(p.spec, p.answer) : "";
  return p.correct
    ? `Previsão das ${p.hour} conferida: “${picked}”. Certo. ${p.detail ?? ""}`
    : `Previsão das ${p.hour} conferida: você disse “${picked}”, o modelo deu “${answer}”. ${p.detail ?? ""}`;
}

export function optionLabel(p: Prediction, id: string | undefined): string {
  return id ? label(p.spec, id) : "";
}
