// Casos: 2 por curso. As pistas de cada posto são qualitativas; a âncora (quando existe) é um único número
// calculado pelo modelo a partir do atleta real, então sempre coincide com o que a simulação mostra.
// papel = gabarito do papel daquele posto no caso: origem | compensa | consequencia | normal.
import { PARAMS } from "./params-casos.js";

export const CURSOS = {
  bach: "Educação Física — Bacharelado",
  lic: "Educação Física — Licenciatura",
  fisio: "Fisioterapia",
};

export const PAPEIS = {
  origem: "É onde o problema começa",
  compensa: "Está compensando o problema",
  consequencia: "Sofre a consequência",
  normal: "Está funcionando como esperado",
};

export const CASOS = [
  {
    id: "B1", curso: "bach", titulo: "O ritmo que não volta", personagem: "Carla, 27 anos, corredora de meia maratona",
    abertura: "Carla corre meias maratonas há quatro anos e participa de um estudo do laboratório da faculdade: corre com analisador de gases portátil e sensores. Virou vegetariana há um ano e conta que anda cansada nas últimas semanas, mas atribui ao trabalho. Na prova de hoje, no km 14, no mesmo ritmo do ano passado, ela não consegue acompanhar o pelotão. Diz que \"a perna não responde\" e que \"o coração está a mil\".",
    mecanismo: "hb", aceitos: ["hb"], leis: ["curva", "fickVO2"],
    postos: {
      ventilacao: { pista: "Respira forte, no mesmo padrão das colegas de pelotão. Não há chiado nem tosse.", ancora: { v: "ve", fonte: "analisador de gases" }, papel: "normal" },
      difusao: { pista: "A equipe do laboratório colheu gasometria arterial logo ao parar. Lábios e língua estão rosados, sem sinal de cianose.", ancora: { v: "pao2", fonte: "gasometria arterial" }, papel: "normal" },
      arterial: { pista: "Unhas e a parte interna das pálpebras parecem mais pálidas que as das outras atletas do estudo.", ancora: { v: "sao2", fonte: "oxímetro de dedo" }, papel: "origem" },
      coracao: { pista: "O relógio mostra a frequência bem acima do que ela costuma ter nesse mesmo ritmo nos treinos.", ancora: { v: "fc", fonte: "cinta cardíaca" }, papel: "compensa" },
      distribuicao: { pista: "Pressão medida no posto de apoio sem nada fora do comum para o exercício. Pele corada pelo esforço, sem palidez fria.", ancora: { v: "pam", fonte: "esfigmomanômetro" }, papel: "normal" },
      tecido: { pista: "Queimação nas coxas muito antes do habitual e queda do ritmo. A amostra capilar foi colhida aos 15 km.", ancora: { v: "lactate", fonte: "lactímetro portátil" }, papel: "consequencia" },
      retorno: { pista: "A amostra venosa colhida no fim tem cor bem escura, mais do que a das colegas no mesmo esforço.", ancora: null, papel: "consequencia" },
    },
    desfecho: "Exames da semana seguinte mostraram anemia por deficiência de ferro (Hb 10,6 g/dL; o esperado para ela seria ~13,8). A saturação estava normal porque o pulmão e a membrana funcionavam bem: o que faltava era hemoglobina para carregar O₂. O conteúdo arterial caiu cerca de um quarto. O coração compensou subindo a frequência, mas o produto débito × conteúdo não fechou a demanda. Pelo princípio de Fick, o músculo já extraía quase tudo o que podia, então o consumo caiu, o lactato subiu e o ritmo despencou.",
  },
  {
    id: "B2", curso: "bach", titulo: "Dois dias a 3.600 metros", personagem: "Rafael, 31 anos, corredor de trilha",
    abertura: "Rafael chegou a La Paz há dois dias para uma prova de montanha. No primeiro treino forte, numa subida que ele faz com folga ao nível do mar, sente falta de ar desproporcional e o ritmo fica muito abaixo do esperado. Tem dor de cabeça leve e dormiu mal. O treinador leva sensores e um oxímetro na mochila.",
    mecanismo: "pio2", aceitos: ["pio2", "difusao"], leis: ["dalton", "curva"],
    postos: {
      ventilacao: { pista: "Respira muito mais do que o esforço justificaria ao nível do mar, com frequência e profundidade aumentadas.", ancora: { v: "ve", fonte: "analisador de gases" }, papel: "origem" },
      difusao: { pista: "Nada sugere doença pulmonar: sem tosse, sem secreção. Mas a gasometria colhida na chegada ao topo chama atenção.", ancora: { v: "pao2", fonte: "gasometria arterial" }, papel: "consequencia" },
      arterial: { pista: "Lábios levemente arroxeados no topo da subida. A hemoglobina dele é normal.", ancora: { v: "sao2", fonte: "oxímetro de dedo" }, papel: "consequencia" },
      coracao: { pista: "Frequência um pouco acima do habitual para o mesmo ritmo, mas nada muito diferente.", ancora: { v: "fc", fonte: "cinta cardíaca" }, papel: "compensa" },
      distribuicao: { pista: "Pressão dentro do esperado para o exercício. Extremidades quentes.", ancora: { v: "pam", fonte: "esfigmomanômetro" }, papel: "normal" },
      tecido: { pista: "As pernas pesam mais cedo do que ao nível do mar, embora o ritmo seja mais lento.", ancora: { v: "lactate", fonte: "lactímetro portátil" }, papel: "consequencia" },
      retorno: { pista: "O treinador estranha o formigamento nas mãos e ao redor da boca que Rafael relata.", ancora: null, papel: "consequencia" },
    },
    desfecho: "A 3.600 m a pressão atmosférica é cerca de 495 mmHg. A fração de O₂ continua 21%, mas a PO₂ inspirada cai para ~94 mmHg (Dalton). Os quimiorreceptores periféricos dispararam a hiperventilação, que baixa a PaCO₂ e recupera parte da PAO₂ (gás alveolar), mas causa alcalose (o formigamento). No exercício, com o trânsito capilar curto e o gradiente pequeno, a difusão não dá conta e a saturação despenca para a parte íngreme da curva. O conteúdo arterial caiu mesmo com hemoglobina normal. A adaptação (mais 2,3-DPG, ajuste renal do bicarbonato e, em semanas, mais hemoglobina) começa, mas dois dias é pouco.",
  },
  {
    id: "L1", curso: "lic", titulo: "O teste dos 12 minutos ao meio-dia", personagem: "Lucas, 15 anos, aluno do 1º ano do ensino médio",
    abertura: "Aula de Educação Física ao meio-dia, 33 °C, teste de corrida de 12 minutos na quadra descoberta. Lucas veio de moletom porque estava frio de manhã, e a garrafa dele está vazia desde o recreio. Ele é ativo e costuma ir bem no teste. No 9º minuto diminui o ritmo, diz que está tonto e senta no chão. O rosto está muito vermelho e ele reclama de cãibra na panturrilha.",
    mecanismo: "vs", aceitos: ["vs", "dist"], leis: ["starling", "paRes"],
    postos: {
      ventilacao: { pista: "Ofegante, mas sem chiado. Consegue falar frases curtas.", ancora: null, papel: "normal" },
      difusao: { pista: "Nenhum sinal de problema na troca: sem tosse, lábios sem cianose.", ancora: null, papel: "normal" },
      arterial: { pista: "O professor mediu com o oxímetro da escola logo que ele sentou.", ancora: { v: "sao2", fonte: "oxímetro da escola" }, papel: "normal" },
      coracao: { pista: "O cardiofrequencímetro da turma mostrou a frequência dele no topo da tabela, maior que a dos colegas mais lentos.", ancora: { v: "fc", fonte: "cardiofrequencímetro" }, papel: "compensa" },
      distribuicao: { pista: "Pele quente e muito vermelha. Ao levantar rápido, a tontura piora.", ancora: { v: "pam", fonte: "aparelho de pressão da escola" }, papel: "origem" },
      tecido: { pista: "Cãibra e pernas \"travando\" antes do fim do teste, coisa que nunca tinha acontecido.", ancora: null, papel: "consequencia" },
      retorno: { pista: "Muito suor desde o início e a camiseta encharcada. As veias do dorso da mão, que costumam aparecer depois da corrida, hoje quase não se veem.", ancora: null, papel: "origem" },
    },
    desfecho: "Desidratação com estresse térmico. A perda de suor reduziu o volume plasmático: menos enchimento, menos volume sistólico (Frank-Starling). A frequência subiu quase ao máximo para compensar, mas o débito ficou abaixo do esperado. Ao mesmo tempo, a pele dilatou para perder calor, a resistência periférica caiu e a pele passou a disputar o débito com o músculo (PA = DC × RPT). A pressão caiu (tontura), o fluxo para as pernas diminuiu e o músculo, quente e com menos O₂, entrou em fadiga. O pulmão e o sangue arterial estavam normais.",
  },
  {
    id: "L2", curso: "lic", titulo: "Queimada numa manhã fria", personagem: "Júlia, 13 anos, aluna do 8º ano",
    abertura: "Manhã fria e seca, 12 °C. A turma joga queimada com muitas corridas curtas. Júlia tem asma diagnosticada na infância, mas há meses não tem crises e hoje esqueceu a bombinha em casa. Depois de uns 8 minutos de jogo ela para, tosse, diz que o peito está apertado e que \"o ar não sai\".",
    mecanismo: "hipovent", aceitos: ["hipovent"], leis: ["gasAlv", "hh"],
    postos: {
      ventilacao: { pista: "Expiração longa e chiada, tosse seca, ombros subindo a cada inspiração. Respira rápido e curto.", ancora: null, papel: "origem" },
      difusao: { pista: "Parte do pulmão parece ventilar menos que o resto: o sangue continua passando por áreas mal ventiladas.", ancora: null, papel: "consequencia" },
      arterial: { pista: "O professor colocou o oxímetro da escola assim que ela parou.", ancora: { v: "sao2", fonte: "oxímetro da escola" }, papel: "consequencia" },
      coracao: { pista: "Coração acelerado, mais do que o das colegas que continuaram jogando.", ancora: { v: "fc", fonte: "oxímetro da escola" }, papel: "compensa" },
      distribuicao: { pista: "Mãos frias por causa do tempo, mas pressão sem nada fora do comum.", ancora: null, papel: "normal" },
      tecido: { pista: "As pernas não são o problema: ela parou por causa da respiração, não por cansaço muscular.", ancora: null, papel: "normal" },
      retorno: { pista: "Ela está agitada e sonolenta ao mesmo tempo, com dor de cabeça.", ancora: null, papel: "consequencia" },
    },
    desfecho: "Broncoconstrição induzida pelo exercício, desencadeada pelo ar frio e seco. As vias aéreas estreitas aumentam a resistência e prendem o ar: a ventilação alveolar efetiva caiu e o espaço morto aumentou. Com menos ventilação, o CO₂ acumulou (PaCO₂ alta), e pela equação do gás alveolar a PAO₂ caiu. Áreas mal ventiladas ainda recebendo sangue (V/Q baixo) aumentaram o gradiente A-a. Resultado: hipoxemia e acidose respiratória (Henderson-Hasselbalch: mais PCO₂, pH menor). O coração acelerou para compensar; o músculo não era o limite.",
  },
  {
    id: "F1", curso: "fisio", titulo: "Espuma rosada na transição", personagem: "Marina, 41 anos, triatleta amadora",
    abertura: "Marina faz triatlo há seis anos. Na natação de 1.900 m em mar a 18 °C, com um neoprene novo e apertado, ela sente falta de ar crescente a partir dos 1.200 m. Termina a natação com dificuldade e, na transição, tosse com uma secreção espumosa levemente rosada. A equipe de fisioterapia do evento a atende.",
    mecanismo: "difusao", aceitos: ["difusao"], leis: ["fickDif", "curva"],
    postos: {
      ventilacao: { pista: "Respira rápido, com esforço, mas o ar entra e sai sem chiado. Tosse com secreção espumosa.", ancora: { v: "ve", fonte: "estimativa pela frequência e volume" }, papel: "compensa" },
      difusao: { pista: "Na ausculta, estertores nas bases dos dois pulmões. Algo está ocupando o espaço entre o alvéolo e o capilar.", ancora: { v: "pao2", fonte: "gasometria do posto médico" }, papel: "origem" },
      arterial: { pista: "O oxímetro da equipe de fisioterapia acende o alerta.", ancora: { v: "sao2", fonte: "oxímetro" }, papel: "consequencia" },
      coracao: { pista: "Frequência um pouco acima do esperado para o esforço da natação.", ancora: { v: "fc", fonte: "relógio" }, papel: "compensa" },
      distribuicao: { pista: "Pressão normal a levemente alta. A imersão em água fria contrai os vasos da pele e empurra sangue para o tórax.", ancora: { v: "pam", fonte: "esfigmomanômetro" }, papel: "normal" },
      tecido: { pista: "Ela não se queixa das pernas nem dos braços: o limite é a respiração.", ancora: null, papel: "normal" },
      retorno: { pista: "Sangue venoso sem nada muito diferente do esperado para o esforço.", ancora: null, papel: "normal" },
    },
    desfecho: "Edema pulmonar induzido pela natação (SIPE). A imersão em água fria e o neoprene apertado deslocaram sangue para o tórax e aumentaram a pressão nos capilares pulmonares; com o esforço, líquido extravasou para o interstício e para os alvéolos. Pela lei de Fick da difusão, a barreira mais espessa e os alvéolos inundados reduziram a troca, e o sangue passou a cruzar áreas sem ventilação (shunt): o gradiente A-a disparou. A PaO₂ caiu para a parte íngreme da curva e a saturação despencou, mesmo com ventilação aumentada e hemoglobina normal. Costuma regredir em horas a dois dias, mas exige avaliação antes de voltar a nadar.",
  },
  {
    id: "F2", curso: "fisio", titulo: "A carga que não fecha", personagem: "Seu Antônio, 62 anos, em reabilitação cardíaca",
    abertura: "Seu Antônio teve um infarto há dez semanas e está na fase 2 da reabilitação cardíaca. Usa betabloqueador desde a alta. Hoje o fisioterapeuta subiu a carga da esteira para o que seria esperado para a idade e o peso dele. Depois de 6 minutos ele relata pernas muito pesadas, esforço percebido alto (Borg 16) e pede para diminuir. O monitor mostra a frequência bem abaixo do que a fórmula da idade previa.",
    mecanismo: "vs", aceitos: ["vs", "fc"], leis: ["dcFcVs", "fickVO2"],
    postos: {
      ventilacao: { pista: "Respira um pouco mais rápido, sem chiado. Consegue conversar com frases curtas.", ancora: null, papel: "normal" },
      difusao: { pista: "Sem estertores na ausculta, sem tosse.", ancora: null, papel: "normal" },
      arterial: { pista: "O oxímetro da sala de reabilitação está dentro do normal o tempo todo.", ancora: { v: "sao2", fonte: "oxímetro" }, papel: "normal" },
      coracao: { pista: "O ecocardiograma da alta mostrou uma área da parede que contrai pouco. A frequência sobe devagar e para num platô baixo.", ancora: { v: "fc", fonte: "monitor cardíaco" }, papel: "origem" },
      distribuicao: { pista: "Pressão subindo menos do que o esperado com a carga; mãos um pouco frias.", ancora: { v: "pam", fonte: "esfigmomanômetro" }, papel: "compensa" },
      tecido: { pista: "Pernas pesadas e queimação, mesmo numa velocidade de caminhada.", ancora: { v: "lactate", fonte: "lactímetro do laboratório" }, papel: "consequencia" },
      retorno: { pista: "A amostra venosa colhida no fim da sessão está bem escura.", ancora: null, papel: "consequencia" },
    },
    desfecho: "Débito cardíaco limitado. A área do infarto reduziu o volume sistólico, e o betabloqueador limita de propósito a resposta da frequência. Com DC = FC × VS baixo, a oferta de O₂ não acompanhou a carga, embora o conteúdo arterial estivesse normal (por isso a saturação normal enganava). Pelo princípio de Fick, o músculo extraiu quase tudo o que podia, a diferença arteriovenosa foi ao máximo e o consumo ainda não fechou a demanda: lactato, pernas pesadas e Borg alto. A vasoconstrição em territórios não ativos ajudou a sustentar a pressão. A prescrição precisa se basear no esforço percebido e no teste ergométrico com o remédio, não na fórmula da idade.",
  },
];

export function casoById(id) {
  return CASOS.find((c) => c.id === id);
}

export function paramsDoCaso(id) {
  return PARAMS[id];
}
