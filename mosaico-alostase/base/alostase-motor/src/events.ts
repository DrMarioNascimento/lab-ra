import type { NightEvent } from "./types";

/**
 * Cenas que só aparecem se o corpo pedir. No máximo uma por intervalo,
 * a primeira da lista cujo gatilho bater no instante do evento.
 */
export const EVENTS: NightEvent[] = [
  {
    id: "microssono",
    hour: "05:00",
    beforeScene: 1,
    offset: 1.8,
    kicker: "Sem cena marcada",
    title: "Microssono",
    cause:
      "Revisando a prescrição, as pálpebras caem por dois segundos. Você não percebeu que dormiu. A adenosina está alta e nenhum sistema foi chamado para segurar a vigília. É o processo S cobrando no meio da tarefa.",
    trigger: (body) => body.adenosina >= 66 && body.catecol < 14 && body.cafeina < 18,
    choices: [
      {
        id: "micro-cafe",
        title: "Café agora",
        act: "Bloqueia o receptor. A adenosina fica.",
        gloss: "Às 9h40 a metade ainda estará no receptor.",
        effect: { cafeina: 50, catecol: 6, vagal: -4 },
        now: "Antagonismo de A1 e A2A. O aviso sai, a molécula fica. A pressão de sono que você não sente continua subindo por hora acordado.",
        later: "Cafeína às 5h ainda tem metade no receptor às 10h. A noite seguinte começa com esse resto.",
      },
      {
        id: "micro-andar",
        title: "Levantar e andar",
        act: "Simpático leve. A postura e o frio fazem o resto.",
        gloss: "Dura enquanto dura o movimento.",
        effect: { catecol: 10, vagal: -4 },
        now: "Descarga leve: o simpático segura o córtex por alguns minutos. Nada aqui mexe na adenosina.",
        later: "Catecolamina de movimento some em minutos. Se a tarefa voltar a ser sentada, o microssono volta.",
      },
      {
        id: "micro-cochilo",
        title: "Cochilo de 20 minutos",
        act: "Sono curto, antes de entrar em sono profundo.",
        gloss: "Descarrega um pouco do processo S. Inércia do sono por alguns minutos.",
        effect: { adenosina: -7, vagal: 5, catecol: -4 },
        now: "Vinte minutos não chegam ao sono de ondas lentas. Descarregam um pouco da adenosina sem a inércia de um sono profundo interrompido.",
        later: "É o único gesto desta noite que tira adenosina em vez de esconder. Tira pouco.",
      },
    ],
  },
  {
    id: "fome",
    hour: "06:30",
    beforeScene: 1,
    offset: 3.3,
    kicker: "Sem cena marcada",
    title: "Contrarregulação",
    cause:
      "Doze horas sem comer. Tremor fino, suor frio, irritação. A glicose está descendo e o pulso de cortisol não está ali para empurrar a neoglicogênese. Quem segura agora é glucagon e adrenalina.",
    trigger: (body) => body.glicose < 75 && body.pulse < 10,
    choices: [
      {
        id: "fome-comer",
        title: "Comer",
        act: "Carboidrato e proteína.",
        gloss: "A glicose sobe pela boca. O simpático não precisa segurar.",
        effect: { glicose: 12, vagal: 3, catecol: -4 },
        now: "A glicose volta pela via que não custa simpático. O tremor era adrenalina de contrarregulação; ela some com o motivo.",
        later: "Sem pico de cortisol para empurrar o fígado, comer foi a forma mais barata de segurar a glicose até a manhã.",
      },
      {
        id: "fome-seguir",
        title: "Seguir sem comer",
        act: "Glucagon e adrenalina seguram a glicose.",
        gloss: "A conta vai para o simpático e para o vago.",
        effect: { catecol: 12, glicose: 4, vagal: -6 },
        now: "Contrarregulação: glucagon libera glicogênio, adrenalina soma. A glicose para de cair. O tremor e a taquicardia são o preço visível.",
        later: "Catecolamina de contrarregulação some em minutos. O glicogênio do fígado, não: ele não volta sem comida.",
      },
    ],
  },
  {
    id: "palpitacao",
    hour: "10:50",
    beforeScene: 2,
    offset: 1.1,
    kicker: "Sem cena marcada",
    title: "Palpitação",
    cause:
      "No corredor, o coração aparece. Não é dor. É frequência que não cedeu depois da conversa. O vago está baixo e o simpático não desligou.",
    trigger: (body) => body.catecol > 14 || body.vagal < 28,
    choices: [
      {
        id: "palp-respirar",
        title: "Respirar devagar",
        act: "Seis respirações por minuto, expiração longa.",
        gloss: "Arritmia sinusal respiratória: o vago entra na expiração.",
        effect: { vagal: 10, catecol: -6 },
        now: "A expiração longa recruta o vago cardíaco. A frequência cede em segundos. Não é relaxamento genérico: é o braço rápido do barorreflexo sendo chamado.",
        later: "O freio desta hora não desfaz o cortisol que já subiu. Desfaz a frequência.",
      },
      {
        id: "palp-ignorar",
        title: "Ignorar",
        act: "Seguir para a próxima tarefa.",
        gloss: "O simpático continua até a meia-vida encerrar.",
        effect: { catecol: 4, vagal: -2 },
        now: "Sem freio, a catecolamina segue sua meia-vida. A frequência cai, só que mais tarde, e o vago não teve motivo para voltar.",
        later: "Platô de minutos não é risco. Platô de dias é.",
      },
    ],
  },
  {
    id: "tontura",
    hour: "13:30",
    beforeScene: 3,
    offset: 1.8,
    kicker: "Sem cena marcada",
    title: "Vista escura ao levantar",
    cause:
      "Você levanta rápido da cadeira e a vista escurece por um segundo. Pouco volume: o retorno venoso cai, o barorreflexo corre atrás com frequência e vasoconstrição.",
    trigger: (body) => body.volemia < 56,
    choices: [
      {
        id: "tontura-agua",
        title: "Beber e sentar",
        act: "Meio litro e dois minutos sentado.",
        gloss: "Volume de volta. A angiotensina perde o pretexto.",
        effect: { volemia: 14, vagal: 3, catecol: -4 },
        now: "O volume volta e o barorreflexo para de pedir vasoconstrição. O rim recebe o sangue que a hipotensão postural estava desviando.",
        later: "É o gesto que deixa a tarde chegar com reserva: se vier AINE, o rim ainda tem fluxo.",
      },
      {
        id: "tontura-seguir",
        title: "Seguir em pé",
        act: "O barorreflexo resolve sozinho.",
        gloss: "Resolve com simpático e angiotensina.",
        effect: { catecol: 12, vagal: -6, volemia: -2 },
        now: "O barorreflexo segurou a pressão do jeito caro: simpático e vasoconstrição. A tontura passa. O volume continua curto.",
        later: "A tarde chega com angiotensina alta e pouco volume. Faltam só a prostaglandina para os três estarem juntos.",
      },
    ],
  },
  {
    id: "oliguria",
    hour: "19:30",
    beforeScene: 4,
    offset: 3.2,
    kicker: "Sem cena marcada",
    title: "Pouca urina",
    cause:
      "Desde a tarde, quase nada de urina, e escura. Não é sintoma de doença: é o rim guardando água sob ADH e angiotensina. Ou é a TFG que caiu e ainda não apareceu na creatinina.",
    trigger: (body) => body.volemia < 54 || (!body.pg && body.volemia < 62),
    choices: [
      {
        id: "oliguria-repor",
        title: "Repor volume",
        act: "Água, com tempo para beber.",
        gloss: "Se a falha foi hemodinâmica, este é o desenho que reverte.",
        effect: { volemia: 16, vagal: 2 },
        now: "O volume volta. A angiotensina perde o motivo principal. Se a TFG estava baixa, ela volta antes da creatinina perceber.",
        later: "A creatinina pode ainda subir na próxima leitura: ela descreve a TFG de horas atrás.",
      },
      {
        id: "oliguria-segurar",
        title: "Segurar até o fim do turno",
        act: "Faltam quatro horas.",
        gloss: "Quatro horas a mais acordado e sem beber.",
        effect: { volemia: -3, catecol: 4 },
        now: "O rim segue guardando água. A urina escura é ADH funcionando. O que não se vê é se a filtração já está fora da faixa.",
        later: "A noite chega com pouco volume. O sono repõe um pouco. Não repõe meio litro.",
      },
    ],
  },
];

export function eventsBefore(sceneIndex: number): NightEvent[] {
  return EVENTS.filter((event) => event.beforeScene === sceneIndex);
}
