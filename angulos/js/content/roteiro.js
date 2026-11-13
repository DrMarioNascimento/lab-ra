// Viagem pelo roteiro de deliberação ética (revisão individual). Cada parada é um passo do roteiro,
// com as cartas-conceito ligadas a ele. O aluno leva só 3 cartas na mochila.
export const PARADAS = [
  {
    id: "p1", titulo: "1. Fatos conhecidos e incertezas", cartas: ["complexidade"],
    texto: "Antes de julgar, separe o que se sabe do que se supõe. Descrever é dizer o que está presente; interpretar é atribuir sentido. Reconhecer a incerteza não paralisa a decisão: muda o cuidado com que se decide.",
    pergunta: { q: "\"O personal estava vendendo algo para a aluna.\" Diante de uma foto em que aparecem próximos a um envelope, essa frase é…", op: ["um fato", "uma interpretação", "uma incerteza"], certa: 1, fb: "A foto mostra duas pessoas e um envelope. \"Vender\" é o sentido que atribuímos à cena." },
  },
  {
    id: "p2", titulo: "2. Envolvidos e afetados", cartas: ["utilitarismo"],
    texto: "Quem está na cena não é todo mundo que a decisão atinge. Pense em quem não aparece: famílias, outros clientes, a instituição, a profissão e quem está sendo suspeito.",
    pergunta: { q: "Quem também é afetado por uma decisão tomada dentro de uma academia?", op: ["Só quem estava presente", "Também quem não aparece, como família, clientes e profissão", "Só o dono"], certa: 1, fb: "As consequências passam de quem estava na cena." },
  },
  {
    id: "p3", titulo: "3. Vulnerabilidades e relações de poder", cartas: ["cuidado", "justica"],
    texto: "Vulnerável é quem tem menos condições de se proteger: por idade, dependência, informação, posição ou necessidade. Poder é quem decide, avalia, contrata ou supervisiona. A ética do cuidado olha para quem depende de alguém.",
    pergunta: { q: "Um estagiário sozinho numa aula, porque o supervisor está ocupado, é…", op: ["só um problema de escala", "alguém em situação de vulnerabilidade e de risco para a turma", "plenamente responsável por tudo"], certa: 1, fb: "Ele depende de supervisão, e quem tem o poder de supervisionar não está ali." },
  },
  {
    id: "p4", titulo: "4. Direitos, deveres e salvaguardas", cartas: ["deontologia", "informacao", "vigilancia", "sigilo", "competencia", "abuso", "salvaguardas"],
    texto: "Os deveres fundamentais do profissional: informação, atualização, vigilância, abstenção de abuso, consentimento e sigilo, limites de competência e salvaguardas. Salvaguardas não são preferências: são limites mínimos de dignidade, segurança e direitos.",
    pergunta: { q: "Um laudo de aluno esquecido sobre a mesa da sala de avaliação fere principalmente…", op: ["o dever de atualização", "o consentimento, a privacidade e o sigilo", "os limites de competência"], certa: 1, fb: "Informação de saúde de alguém exposta a quem passa." },
  },
  {
    id: "p5", titulo: "5. Alternativas, inclusive não agir ou encaminhar", cartas: ["omissao"],
    texto: "Toda situação tem mais de uma saída. Não agir também é uma escolha, e a omissão gera responsabilidade quando há dever de cuidado. Encaminhar pode ser responsável ou pode ser fuga da decisão.",
    pergunta: { q: "A omissão gera responsabilidade quando…", op: ["nunca, porque não houve ação", "existe dever, conhecimento e possibilidade de agir", "só se houver testemunhas"], certa: 1, fb: "Havia dever, o resultado era previsível e era possível agir." },
  },
  {
    id: "p6", titulo: "6. Consequências de cada alternativa", cartas: ["beneficencia", "naoMaleficencia", "duploEfeito", "negligencia"],
    texto: "Analise cada alternativa: quem ganha, quem perde, com que intensidade e duração. Uma ação pode ter efeito bom e ruim ao mesmo tempo (duplo efeito): conta a intenção, o meio e a proporcionalidade.",
    pergunta: { q: "Expor publicamente um suspeito para \"proteger os outros\" pode…", op: ["ser sempre justificável", "produzir dano desproporcional se a suspeita estiver errada", "não ter consequências"], certa: 1, fb: "Prever um dano não é desejá-lo, mas é preciso proporcionalidade e alternativa menos danosa." },
  },
  {
    id: "p7", titulo: "7. Escolha e acompanhe", cartas: ["autonomia"],
    texto: "Escolha a alternativa mais justificável e acompanhe os resultados. Deliberar não é achar resposta automática: é justificar uma decisão responsável e estar pronto para corrigi-la.",
    pergunta: { q: "Depois de decidir, o que falta?", op: ["Nada, a decisão está tomada", "Acompanhar, revisar e corrigir se for preciso", "Esperar alguém reclamar"], certa: 1, fb: "Boa intenção não garante bom resultado: monitorar e reparar também é responsabilidade." },
  },
];
