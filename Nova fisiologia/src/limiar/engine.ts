import type { Body, Choice, Derived, Effect, RenalWord, Report, Trace } from "./types";

export const INITIAL_BODY: Body = {
  vagal: 44,
  catecol: 16,
  pulse: 8,
  glicose: 76,
  adenosina: 62,
  il6: 14,
  volemia: 64,
  cafeina: 0,
  creat: 8,
  pg: true,
  pgLeft: 0,
  sleepHours: 0,
  curveBroken: false,
  brake: false,
};

function clamp(n: number, max = 100): number {
  return Math.max(0, Math.min(max, n));
}

export function applyEffect(body: Body, effect: Effect): Body {
  const next: Body = {
    ...body,
    vagal: clamp(body.vagal + (effect.vagal ?? 0)),
    catecol: clamp(body.catecol + (effect.catecol ?? 0)),
    pulse: clamp(body.pulse + (effect.pulse ?? 0)),
    glicose: clamp(body.glicose + (effect.glicose ?? 0), 160),
    adenosina: clamp(body.adenosina + (effect.adenosina ?? 0)),
    il6: clamp(body.il6 + (effect.il6 ?? 0)),
    volemia: clamp(body.volemia + (effect.volemia ?? 0)),
    cafeina: clamp(body.cafeina + (effect.cafeina ?? 0)),
    sleepHours: effect.sleepHours ?? body.sleepHours,
    curveBroken: effect.curveBroken || body.curveBroken,
    brake: effect.brake ?? body.brake,
  };
  if (effect.blockPgHours) {
    next.pg = false;
    next.pgLeft = effect.blockPgHours;
  }
  return next;
}

export function derive(body: Body, setPoint: number): Derived {
  const cortisol = clamp(setPoint + body.pulse);
  const ang = clamp(body.catecol * 0.48 + Math.max(0, 68 - body.volemia) * 1.05);
  const stressed = ang > 32 || body.catecol > 34;
  const pgHelp = body.pg ? (stressed ? 8 : 5) : 0;
  const rbf = clamp(
    74 - body.catecol * 0.34 - ang * 0.33 + (body.volemia - 55) * 0.32 + pgHelp,
  );
  const tfg = rbf >= 47 ? clamp(66 + (rbf - 47) * 0.18) : clamp(rbf * 0.9);
  const fc = clamp(body.catecol * 0.62 + (100 - body.vagal) * 0.38);
  const pa = clamp(body.catecol * 0.4 + body.pulse * 0.28 + (100 - body.vagal) * 0.24);
  const renal: RenalWord = tfg < 47 ? "falha" : rbf < 58 ? "carga" : "folga";
  const renalLine =
    renal === "falha"
      ? "Fluxo saiu da faixa. A TFG acompanhou. Falha hemodinâmica, não necrose."
      : renal === "carga"
        ? "Fluxo baixo, TFG segura. É carga: a autoregulação ainda segura a filtração."
        : "Fluxo e TFG dentro da faixa. O rim ainda não é o limitante.";
  const fcWord = fc < 28 ? "branda" : fc < 48 ? "de vigília" : fc < 68 ? "alta" : "muito alta";
  const paWord = pa < 32 ? "baixa" : pa < 50 ? "de vigília" : pa < 68 ? "sustentada" : "alta";
  let kLine: string | null = null;
  if (tfg < 47) {
    kLine =
      "TFG baixa: o rim excreta menos potássio. A catecolamina, se alta, empurra K+ para dentro da célula. Os dois efeitos não cabem no mesmo plasma.";
  } else if (body.catecol > 42) {
    kLine = "β2 empurra potássio para dentro da célula. O plasma pode cair sem o rim ter excretado nada.";
  }
  return { cortisol, ang, rbf, tfg, fc, pa, renal, renalLine, fcWord, paWord, kLine };
}

export interface Passage {
  body: Body;
  notices: string[];
}

/** Time between hours. Half-lives live here, not on the click. */
export function passHours(body: Body, hours: number, setPointBefore: number): Passage {
  const before = derive(body, setPointBefore);
  const next: Body = { ...body };

  next.catecol = clamp(body.catecol * 0.5 ** (hours / 0.45));
  next.pulse = clamp(body.pulse * 0.5 ** (hours / 1.5));
  next.cafeina = clamp(body.cafeina * 0.5 ** (hours / 5));

  if (next.pgLeft > 0) {
    next.pgLeft = Math.max(0, body.pgLeft - hours);
    if (next.pgLeft === 0) next.pg = true;
  }

  const sleep = Math.min(hours, body.sleepHours);
  const awake = hours - sleep;
  next.adenosina = clamp(body.adenosina + awake * 1.15 - sleep * 5.2);
  next.sleepHours = 0;
  if (sleep >= 5) next.vagal = clamp(body.vagal + 8 + sleep);
  else next.vagal = clamp(body.vagal - awake * 0.4);

  next.volemia = clamp(body.volemia - awake * 0.4 + sleep * 0.35);
  const glucosePull = body.pulse > 18 ? awake * 0.45 : (78 - body.glicose) * (1 - 0.5 ** (hours / 2));
  next.glicose = clamp(body.glicose + glucosePull, 160);

  if (body.brake) {
    next.vagal = clamp(next.vagal + 14);
    next.catecol = clamp(next.catecol * 0.35);
    next.brake = false;
  }

  const il6Target = (next.pulse < 10 ? 3 : -2) + (next.adenosina > 78 ? 5 : 1) + (sleep >= 5 ? -8 : 2);
  next.il6 = clamp(body.il6 * 0.72 + il6Target);

  const afterProbe = derive({ ...next, creat: body.creat }, setPointBefore);
  const worst = Math.min(before.tfg, afterProbe.tfg);
  const target = worst < 47 ? 8 + (47 - worst) * 0.55 : 8;
  next.creat = clamp(Math.round((body.creat + (target - body.creat) * (worst < 47 ? 0.85 : 0.35)) * 10) / 10, 40);

  const ranked: string[] = [];
  if (next.creat - body.creat >= 2) {
    ranked.push("A creatinina subiu entre as horas. Ela descreve a TFG de antes, não a desta hora.");
  }
  if (next.cafeina > 18) {
    ranked.push("A cafeína ainda ocupa o receptor. A adenosina segue no tecido. A máscara é que não acabou.");
  }
  if (body.pulse > 16 && next.pulse < 8 && next.il6 > body.il6 + 3) {
    ranked.push("O cortisol caiu e a IL-6 apareceu. O hormônio que segurava a inflamação já foi embora, e o sono não veio no lugar.");
  }
  if (body.brake) {
    ranked.push("O freio vagal entrou depois da descarga. Catecolamina foi embora. O fluxo renal voltou com ela.");
  }
  if (sleep >= 5) {
    ranked.push("O sono descarregou parte da adenosina e devolveu vago. Não zerou a dívida. Descarregou o que a noite coube.");
  }
  if (!body.pg && next.pg) {
    ranked.push("O AINE saiu do COX. Se a TFG caiu, quem ainda conta isso é a creatinina, não a dor.");
  }

  return { body: next, notices: ranked.slice(0, 2) };
}

export function settleMorning(body: Body, setPointBefore: number): Passage {
  const night = passHours(body, 8, setPointBefore);
  const next = { ...night.body };
  if (body.curveBroken) {
    next.il6 = clamp(next.il6 + 10);
    next.glicose = clamp(next.glicose + 8, 160);
    next.pulse = clamp(next.pulse + 6);
  }
  const notices = [...night.notices];
  if (body.curveBroken) {
    notices.unshift(
      "Manhã com a curva torta: a noite não desceu e o pico do despertar não é o de um eixo em hora. IL-6 e glicose amanhecem mais altas. É um turno, não diabetes.",
    );
  }
  return { body: next, notices: notices.slice(0, 2) };
}

export function narrate(choice: Choice, before: Derived, after: Derived, bodyAfter: Body): { now: string; later: string } {
  const renal =
    after.renal === "falha"
      ? "O fluxo saiu da faixa e a TFG cedeu."
      : after.renal === "carga"
        ? "O fluxo caiu e a TFG segurou. Carga, sem falha."
        : before.renal !== "folga" && after.renal === "folga"
          ? "O rim voltou para dentro da faixa."
          : "O rim segue dentro da faixa.";

  const byId: Record<string, { now: string; later: string }> = {
    "vigilia-catecol": {
      now: `Medula e simpático em segundos. A glicose subiu por glicogenólise hepática, não porque a triagem “gastou cérebro”. ${renal}`,
      later: "Catecolamina de circulação some em minutos. Adenosina não sai junto: a vigília foi química.",
    },
    "vigilia-hpa": {
      now: "CRH, ACTH, córtex adrenal. O cortisol útil chega em dezenas de minutos: tarde para o minuto da triagem. Segura IL-6 e prepara neoglicogênese. A vigília imediata não foi garantida.",
      later: "Meia-vida do cortisol circulante ~1,5 h. Às 9h40 este pulso já terá caído. O que resta é sono interrompido, não um número ainda alto.",
    },
    "vigilia-silencio": {
      now: "O vago ficou. Sem descarga, não há taquicardia de defesa nem queda de fluxo. O risco desta hora é o microssono, com a adenosina mandando. Folga renal aqui não é vitória do sistema.",
      later: "A pressão de sono só cai dormindo. Empurrar a hora sem montar resposta aumenta a adenosina da manhã.",
    },
    "manha-pulso": {
      now: "Segundo pulso, na hora em que a curva do dia já deveria descer. Um pulso isolado ainda freia CRH e ACTH. O segundo, no mesmo dia, atrasa essa descida.",
      later: "IL-6 segue contida enquanto o cortisol está alto. Aparece quando ele cair, se o sono não entrar no lugar.",
    },
    "manha-vagal": {
      now: `Freio vagal, o braço rápido do barorreflexo. A frequência cede sem precisar que o cortisol zere. ${renal}`,
      later: "Angiotensina não ganhou outro motivo para subir. O pulso que já existia decai pela meia-vida dele, não por este gesto.",
    },
    "manha-sustento": {
      now: `Não foi pico. Foi simpático médio sem desligar. ${renal} Pico curto o corpo devolve. Platô é o que a pressão deixa de ter para onde cair.`,
      later: "Se o platô atravessar a noite, a pressão não faz dipping. Um turno mostra o mecanismo. O risco cardiovascular é o ritmo repetido.",
    },
    "sirene-retorno": {
      now: `Defesa na hora: catecolamina sobe, glicose de glicogenólise, fluxo renal cai. ${renal} O freio vagal entra quando a ameaça passa. Alostase com retorno.`,
      later: "Entre esta hora e a tarde, a catecolamina some. O que se lê depois é se o vago voltou.",
    },
    "sirene-sustenta": {
      now: `A descarga era o certo. O freio não veio. Frequência e pressão seguem como se a escada ainda estivesse cheia. ${renal}`,
      later: "Descarga sem retorno é o caminho do non-dipping: a pressão da noite não desce. Ainda não é diagnóstico. É o passo.",
    },
    "sirene-nao": {
      now: "Ameaça sem descarga. Não é recuperação vagal: é defesa que não montou. Músculo e vigília não receberam o que a saída pedia. O rim ficou folgado. Folga, aqui, é o sistema que não foi chamado.",
      later: "Não há meia-vida para encerrar, porque o eixo não ligou. O custo é a defesa que faltou, não uma creatinina.",
    },
    "tarde-cafe": {
      now: "Antagonismo A1 e A2A. A adenosina continua no tecido. Some o sinal, não a molécula. A catecolamina sobe um pouco. Em quem não habituou, a diurese leve tira volume.",
      later: "Meia-vida da cafeína ~5 h. À noite a máscara ainda está, e a pressão de sono também.",
    },
    "tarde-aine": {
      now: `COX inibida: PGE2 e PGI2 aferentes fora. Elas são a dilatação de reserva quando angiotensina e simpático contraem. ${renal} A creatinina não se move neste minuto.`,
      later:
        "Se a TFG caiu, o índice de creatinina aparece na hora seguinte. Se não caiu, é porque o rim ainda estava perfundido. Um AINE não derruba TFG em rim folgado.",
    },
    "tarde-agua": {
      now: `Volume de volta, prostaglandina intacta, freio vagal. A adenosina segue honesta: você sente o que a cafeína esconderia. ${renal}`,
      later: "Com volume, a angiotensina perde o motivo principal. É esta a condição em que um AINE, se viesse, faria pouco.",
    },
    "noite-eixo": {
      now: "Cortisol no nadir, a hora em que o eixo deveria estar no chão. A curva achata. ADH e o que restar de angiotensina seguram sódio e água. A glicose sobe quando o fígado deveria estar quieto.",
      later: "A manhã não fará um pico de despertar limpo. IL-6 e a tolerância à glicose amanhecem piores. Desenho de restrição de sono, não um laudo de diabetes.",
    },
    "noite-frase": {
      now: "Descarga curta, sem pulso cheio de HPA. O nadir do cortisol ainda é possível. Parte da adenosina descarrega se o sono vier em seguida.",
      later: "Meia recuperação: o eixo não quebrou, e o sono não foi a noite inteira.",
    },
    "noite-sono": {
      now: "Processo S começa a descarregar. O cortisol fica baixo, que é o que a hora pede. O vago tem a noite para voltar. O que ficou sem resposta não é um eixo. É a mensagem.",
      later: "De manhã a adenosina está menor e a IL-6 não teve a noite em claro para subir. A curva circadiana segue inteira.",
    },
  };

  const text = byId[choice.id];
  const k = bodyAfter.catecol > 42 || after.tfg < 47 ? after.kLine : null;
  return { now: k ? `${text.now} ${k}` : text.now, later: text.later };
}

function round(n: number): number {
  return Math.round(n);
}

export interface Reading {
  label: string;
  value: string;
}

export function readings(body: Body, d: Derived, hour: string): Reading[] {
  const masked = body.cafeina > 18;
  const dipping = hour.startsWith("23") && d.pa >= 50 && body.sleepHours === 0;
  return [
    { label: "Autônomo", value: `vago ${round(body.vagal)} · catecolamina ${round(body.catecol)}` },
    { label: "HPA", value: `cortisol ${round(d.cortisol)} · excesso ${round(body.pulse)}` },
    { label: "Metabólico", value: `glicose ${round(body.glicose)}` },
    {
      label: "Sono",
      value: masked ? `adenosina ${round(body.adenosina)} · café mascara` : `adenosina ${round(body.adenosina)}`,
    },
    { label: "Imune", value: `IL-6 ${round(body.il6)}` },
    {
      label: "Pressão",
      value: dipping ? `FC ${d.fcWord} · PA ${d.paWord} · sem dipping` : `FC ${d.fcWord} · PA ${d.paWord}`,
    },
    { label: "Rim", value: `fluxo ${round(d.rbf)} · TFG ${round(d.tfg)} · Cr ${round(body.creat)} · ${d.renal}` },
  ];
}

export function moved(before: Body, after: Body, d0: Derived, d1: Derived, hour: string): Reading[] {
  const a = readings(before, d0, hour);
  const b = readings(after, d1, hour);
  return b.filter((row, i) => row.value !== a[i]?.value);
}

function worstRenal(trace: Trace[]): RenalWord {
  if (trace.some((t) => t.renal === "falha")) return "falha";
  if (trace.some((t) => t.renal === "carga")) return "carga";
  return "folga";
}

export function writeReport(body: Body, trace: Trace[], morningCortisol: number, eveningCortisol: number): Report {
  const choiceIds = new Set(trace.map((t) => t.title));
  const failedDefense = choiceIds.has("Não ligar");
  const held = choiceIds.has("Platô simpático") || choiceIds.has("Ligar e manter") || choiceIds.has("Cortisol no nadir");
  const broken = choiceIds.has("Cortisol no nadir");
  const slept = choiceIds.has("Dormir") || choiceIds.has("Uma frase e dormir");
  const renal = worstRenal(trace);
  const creatUp = trace.some((t, i) => i > 0 && t.creat >= trace[0].creat + 2) || body.creat >= 11;

  let name = "Retorno";
  if (renal === "falha" || creatUp) name = "Falha hemodinâmica";
  else if (broken) name = "Curva quebrada";
  else if (failedDefense) name = "Sem defesa";
  else if (held && !slept) name = "Patamar";
  else if (renal === "carga") name = "Carga renal";
  else if (body.adenosina > 62 || body.volemia < 46 || body.il6 > 32) name = "Dívida";

  return {
    name,
    essay: essayFor(name),
    horizons: horizonsFor(name, { slept, broken, renal, morningCortisol, eveningCortisol }),
    questions: questionsFor({ failedDefense, renal }),
  };
}

function questionsFor(f: { failedDefense: boolean; renal: RenalWord }): [string, string, string] {
  return [
    f.failedDefense
      ? "A sirene sem descarga poupou o rim. Qual sistema falhou no lugar dele?"
      : "Onde a descarga era a defesa certa, e onde o mesmo eixo, à noite, quebrou a curva?",
    f.renal === "falha"
      ? "A TFG caiu nesta tarde. A creatinina de que hora está descrevendo o passado?"
      : "A TFG segurou. O que teria de estar junto — volume, angiotensina, prostaglandina — para ela cair?",
    "Se este passo se repetir três noites por semana, o que deixa de ser episódio e vira set point?",
  ];
}

function essayFor(name: string): string {
  switch (name) {
    case "Falha hemodinâmica":
      return "A TFG saiu da faixa. Não foi necrose: foi hemodinâmica. Simpático e angiotensina contraíram, o volume estava curto e a prostaglandina aferente — a dilatação de reserva — não estava lá. A creatinina sobe depois, porque descreve a TFG que já aconteceu. Com volume e com o COX livre, este desenho reverte. Vira doença se o passo se repetir, não porque a tarde existiu.";
    case "Curva quebrada":
      return "O cortisol subiu perto da meia-noite, quando o eixo deveria estar no nadir. A manhã não recebe um pico de despertar limpo: noite alta, manhã sem inclinação. IL-6 e a glicose amanhecem piores, na direção do que a restrição de sono faz com o dia seguinte. O rim pode ter segurado. A curva, não.";
    case "Sem defesa":
      return "Na sirene o corpo não montou descarga. Frequência, glicose de defesa e redistribuição de fluxo não vieram. O rim ficou folgado porque ninguém pediu vasoconstrição. Folga não repara a defesa que faltou. Alostase com retorno exige os dois tempos: ligar e desligar. Aqui o primeiro não aconteceu.";
    case "Patamar":
      return "Houve simpático sem freio, ou um eixo que não devolveu a noite ao nadir. Pico curto o barorreflexo encerra. Platô é a pressão que deixa de cair. Non-dipping, neste modelo, é isso visto à noite. Um plantão não dá o risco de uma década. Mostra o mecanismo que, repetido, vira o risco.";
    case "Carga renal":
      return "O fluxo caiu e a TFG segurou. É a faixa de autoregulação: o rim filtra quase o mesmo com menos sangue, até sair dela. Carga não é falha. É o quanto a falha está perto. Para cruzar, o modelo exige os três juntos: pouco volume, angiotensina alta e prostaglandina bloqueada.";
    case "Dívida":
      return "Os eixos que ligaram também devolveram, e a TFG não saiu da faixa. A manhã mesmo assim abre devendo: adenosina ainda alta, ou volume curto, ou IL-6 que não voltou ao basal. Meia-vida encerra o hormônio. Não encerra a noite que não foi dormida nem a água que não entrou.";
    default:
      return "Descarga onde a ameaça pedia, freio quando ela passou, e uma noite em que o cortisol pôde ficar baixo. A adenosina descarregou parte. A TFG não saiu da faixa. O custo ficou na hora. É alostase com retorno: sem juros de set point.";
  }
}

function horizonsFor(
  name: string,
  f: { slept: boolean; broken: boolean; renal: RenalWord; morningCortisol: number; eveningCortisol: number },
): Report["horizons"] {
  const flat = f.eveningCortisol > f.morningCortisol - 8;
  const curto = {
    span: "Curto",
    when: "48 horas",
    text:
      name === "Falha hemodinâmica"
        ? "A creatinina de amanhã ainda pode estar descrevendo a TFG da tarde. Com volume e com o COX livre, a falha hemodinâmica deste desenho reverte. Não é lesão estabelecida só porque o índice subiu."
        : f.broken
          ? "A próxima manhã abre com a curva achatada: cortisol da noite alto demais, pico do despertar sem graça, IL-6 e glicose acima do que uma noite dormida deixaria. É a direção do que a restrição de sono faz com a tolerância à glicose no dia seguinte."
          : f.slept
            ? "Uma noite de sono devolve vago e derruba parte da adenosina. Não apaga a semana. O cortisol consegue um pico de despertar. Em 48 h, se o passo não se repetir, os índices voltam para a faixa."
            : "Sem sono, a adenosina segue e a IL-6 da manhã fica mais alta quando o cortisol finalmente baixa. A catecolamina em si já era. O que resta é o que ela não deixou o corpo fazer: dormir.",
  };
  const medio = {
    span: "Médio",
    when: "meses",
    text:
      name === "Retorno"
        ? "Meses neste passo não criam patamar. O cortisol sobe na ameaça e desce depois. A pressão ainda tem noite para cair. O custo continua episódico."
        : name === "Falha hemodinâmica"
          ? "Repetir AINE com pouco volume e simpático alto é a situação em que o episódio hemodinâmico deixa de ser raro. O rim aguenta vários. Não aguenta como método. Pressão que não cai de noite, no mesmo período, soma o outro insulto."
          : "O que se repete vira inclinação: cortisol de fim de dia mais alto, manhã sem pico, pressão sem dipping, IL-6 que não volta ao basal. Carga alostática é esse conjunto, não um hormônio vilão. Três noites por semana bastam para o set point mudar de lugar.",
  };
  const longo = {
    span: "Longo",
    when: "anos",
    text: flat
      ? "Anos de curva achatada, pressão sem dipping e inflamação de baixo grau andam juntos com risco cardiovascular e metabólico. O rim entra nessa conta pela pressão e pela glicose, não porque uma creatinina subiu numa tarde. Um turno não escreve a década. O ritmo escreve."
      : "A década cobra a noite que não teve volta, não a que ligou e desligou. Retorno repetido não é ausência de custo: é custo pago na hora, sem juros de set point. Insuficiência renal crônica não é o desfecho deste plantão. É o desfecho de pressão, glicose e inflamação que deixaram de ser episódio.",
  };
  return [curto, medio, longo];
}

export const BRIDGE = [
  "O modelo faz correr, com meia-vida, sete leituras: vago cardíaco, catecolamina, cortisol acima da curva circadiana, glicose, adenosina, IL-6, e o rim (fluxo, TFG, creatinina). Frequência e pressão são leitura, não um botão. Nada aqui é o seu exame.",
  "Catecolamina de circulação acaba em minutos. Cortisol circulante tem meia-vida de cerca de uma hora e meia. Cafeína, cerca de cinco horas, e só bloqueia o receptor de adenosina: não apaga a adenosina. Creatinina não se move no minuto em que a TFG cai. IL-6 cai sob cortisol agudo e sobe quando o cortisol desce sem sono no lugar.",
  "Angiotensina II, em nível moderado, contrai sobretudo a eferente e ainda segura a TFG, com fração de filtração maior. O modelo não simula esse degrau. Simula o extremo: simpático alto, pouco volume e prostaglandina aferente bloqueada ao mesmo tempo. É nesse extremo que a TFG cai. Um AINE em pessoa hidratada, em repouso, quase não move a filtração. E um turno, mesmo neste extremo, não é doença renal crônica. É uma falha hemodinâmica que reverte se a condição desfaz.",
  "Cortisol alto o bastante para saturar a 11β-HSD2 e agir como mineralocorticoide no rim é excesso sustentado, não um susto. O jogo não finge essa saturação. O potássio que ele menciona é o outro: β2 empurra K+ para a célula na hora; TFG baixa faz o contrário, horas depois. O plasma de um minuto não separa os dois.",
  "Restrição de sono piora a tolerância à glicose no dia seguinte. Isso está medido. O jogo só desloca a glicose e a IL-6 da manhã para você ver a direção. Não calcula um índice glicêmico. E não usa a história, já não sustentada, de que raciocinar esvazia a glicose do sangue.",
  "A passagem de ética ainda não está aqui. Será a mesma noite, com o menu inteiro. A pergunta, então, é se o gesto que você defender cabe no corpo que esta passagem acabou de deixar.",
];
