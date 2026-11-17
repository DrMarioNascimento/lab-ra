import type { Profile, ProfileId } from "./types";

export const PROFILES: Record<ProfileId, Profile> = {
  padrao: {
    id: "padrao",
    name: "Plantonista, 30 anos",
    short: "Padrão",
    description: "Sem medicação, sem dívida de sono antes deste turno. É o corpo do GDD.",
    start: {},
    renalFloor: 47,
    tfgCeiling: 66,
    creatBasal: 8,
    volemiaDrift: 0.4,
    eveningShift: 0,
    morningSet: 52,
    morningBroken: 40,
    essay: "",
    question: "",
  },
  ieca: {
    id: "ieca",
    name: "Hipertenso, 58 anos, IECA e diurético",
    short: "IECA + diurético",
    description:
      "Enalapril e hidroclorotiazida. Começa com menos volume e sem a angiotensina segurando a eferente. A faixa de autoregulação começa mais alta.",
    start: { volemia: 56, vagal: 38 },
    renalFloor: 55,
    tfgCeiling: 62,
    creatBasal: 9,
    volemiaDrift: 0.7,
    eveningShift: 0,
    morningSet: 50,
    morningBroken: 40,
    essay:
      "Com IECA, a angiotensina II não contrai a eferente: a TFG passa a depender só do fluxo que chega. Com diurético, o volume começa curto e cai mais rápido acordado. Um AINE neste corpo é o terceiro golpe — o desenho que a clínica chama de triple whammy. O mesmo gesto que num plantonista de 30 anos é carga, aqui pode ser falha.",
    question:
      "Neste perfil, qual dos três — volume, angiotensina na eferente, prostaglandina na aferente — já estava faltando antes de qualquer escolha?",
  },
  idoso: {
    id: "idoso",
    name: "Idoso, 72 anos",
    short: "Idoso",
    description:
      "Menos massa muscular, menos reserva renal, vago mais baixo. A creatinina basal parece ótima — e é justamente por isso que engana.",
    start: { vagal: 32, volemia: 60 },
    renalFloor: 51,
    tfgCeiling: 56,
    creatBasal: 6.5,
    volemiaDrift: 0.5,
    eveningShift: 2,
    morningSet: 48,
    morningBroken: 38,
    essay:
      "A creatinina basal deste corpo é baixa porque há menos músculo, não porque o rim filtra mais. Um índice “normal” esconde uma TFG de partida menor e uma faixa de autoregulação mais estreita. O vago já começa baixo: o freio existe, mas tem menos para devolver.",
    question: "Por que uma creatinina “normal” num idoso pode esconder uma TFG menor que a de um jovem com o mesmo número?",
  },
  terceira: {
    id: "terceira",
    name: "Terceira noite de plantão na semana",
    short: "3ª noite",
    description:
      "O mesmo plantonista de 30 anos, mas começando devendo: adenosina alta, IL-6 acima do basal, vago gasto e uma curva de cortisol que já não desce tanto à noite.",
    start: { adenosina: 76, il6: 22, vagal: 34, pulse: 12, volemia: 60 },
    renalFloor: 47,
    tfgCeiling: 66,
    creatBasal: 8,
    volemiaDrift: 0.4,
    eveningShift: 6,
    morningSet: 46,
    morningBroken: 38,
    essay:
      "Este corpo não começou às 03:10. Começou três noites antes. A adenosina não zerou, a IL-6 não voltou ao basal e o nadir da noite já estava mais alto. É o “se este passo se repetir” do laudo, só que já acontecido: o set point começou a mudar de lugar.",
    question: "O que nesta noite foi decidido pelas noites anteriores, e não pelas escolhas de hoje?",
  },
};

export const PROFILE_ORDER: ProfileId[] = ["padrao", "ieca", "idoso", "terceira"];
