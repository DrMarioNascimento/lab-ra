/* ============================================================================
   TESTE 10 — O ESPAÇO PLEURAL E AS ZONAS DE WEST (Unidade V)
   Física pura: sem DOM, sem three.js. É ela que os testes conferem.

   O QUE ESTA BANCADA EXISTE PARA DESFAZER, e são dois erros irmãos:

   1. "O ESPAÇO PLEURAL É UM ESPAÇO." Não é — é uma fresta com poucos
      mililitros de líquido, e o que a mantém fechada é PRESSÃO NEGATIVA. Ela
      só vira espaço de verdade quando alguém fura a parede. O pneumotórax não
      abre um espaço novo: ele revela que o antigo estava sob sucção.

   2. "A PRESSÃO PLEURAL É UM NÚMERO." Não é — é um GRADIENTE, e ele existe
      porque o pulmão tem peso. No ápice a pleura puxa mais (−10 cmH2O), na
      base menos (−2,5). Daí sai o paradoxo que o aluno nunca entende sozinho:
      o alvéolo do ápice é MAIOR e ventila MENOS.

   DUAS UNIDADES CONVIVEM AQUI, E ISSO É DA FISIOLOGIA, NÃO DESLEIXO:
   pressões respiratórias em cmH2O, vasculares em mmHg. Elas se encontram nas
   zonas de West, onde a pressão ALVEOLAR (cmH2O) tem de ser comparada com a
   arterial (mmHg). Converter na fronteira, e só ali: 1 cmH2O = 0,7355 mmHg.
   Misturar as duas caladamente erra as zonas por uns 30%.
   ========================================================================== */

export const CMH2O_EM_MMHG = 0.7355;

/* ── GEOMETRIA DO PULMÃO, em cm ─────────────────────────────────────────── */
export const PULMAO = {
  altura: 30,          // ápice à base, de pé
  profundidade: 20,    // esterno ao dorso, que é o eixo da gravidade DEITADO
  hilo: 0.55,          // o hilo fica a 55% da altura, contado da base
};

/* O gradiente pleural: a pleura puxa mais em cima porque o pulmão pesa e
   pende. 0,25 cmH2O por centímetro é o valor clássico. */
export const GRADIENTE_PLEURAL = 0.25;   // cmH2O por cm de altura
/* A MÉDIA SAI DAS PONTAS, e não o contrário. O número que todo mundo decora é
   "a pressão pleural é −5 cmH2O", mas o par que ENSINA é −10 no ápice e −2,5
   na base; com média −5 as pontas davam −8,8 e −1,3 e nenhuma das duas era o
   número do livro. Ancorando as pontas, a média cai em −6,25 — que é o valor
   no meio geométrico do pulmão, e não no nível em que se costuma medir. */
export const PPL_MEDIA_FRC = -6.25;      // cmH2O, no meio do pulmão, em repouso

/* ── A ALTURA QUE A GRAVIDADE ENXERGA ──────────────────────────────────────
   O gradiente corre ao longo do eixo que a bancada desenha — do ápice à base
   —, e o que conta é a QUEDA VERTICAL desse eixo: 30 cm de pé, zero deitado.

   ESCREVI ISTO ERRADO NA PRIMEIRA VOLTA e o número denunciou: somando as
   projeções dos dois eixos (30·sen + 20·cos), a 45° dava 35 cm — mais do que
   em pé. É a projeção da CAIXA inteira sobre a vertical, não a queda ao longo
   do eixo, e nenhum gradiente ao longo de f pode crescer ao inclinar.

   E deitado o gradiente não some de verdade: ele MUDA DE EIXO, e passa a
   correr do esterno ao dorso, sobre uns 20 cm — é por isso que quem está
   deitado ventila e perfunde melhor as regiões dorsais. Esse eixo é outro, a
   bancada não o desenha, e fingir que ele é o mesmo seria o erro que acabou
   de ser consertado. `eixoDependente` existe para o painel poder DIZER isso
   em palavras em vez de mentir em número. */
export function alturaEfetiva(grau) {
  return PULMAO.altura * Math.sin(grau * Math.PI / 180);
}

export function eixoDependente(grau) {
  const aoLongo = alturaEfetiva(grau);
  const atravessando = PULMAO.profundidade * Math.cos(grau * Math.PI / 180);
  return {
    aoLongo, atravessando,
    nome: aoLongo >= atravessando ? 'do ápice à base' : 'do esterno ao dorso',
  };
}

/* Pressão pleural em cmH2O na fração `f` de altura (0 = base, 1 = ápice). */
export function pressaoPleural(f, grau, { pneumo = 'nenhum' } = {}) {
  if (pneumo === 'aberto') return 0;            // a fresta virou espaço
  if (pneumo === 'hipertensivo') return 12;     // e o espaço passou a empurrar
  const h = alturaEfetiva(grau);
  return PPL_MEDIA_FRC - (f - .5) * h * GRADIENTE_PLEURAL;
}

/* Pressão TRANSPULMONAR: é ela que mantém o alvéolo aberto, e é a diferença
   entre a pressão de dentro e a de fora. Em repouso não há fluxo, então a
   alveolar é zero e a transpulmonar é o simétrico da pleural. */
export function transpulmonar(f, grau, opc = {}) {
  const palv = opc.palveolar ?? 0;
  return palv - pressaoPleural(f, grau, opc);
}

/* ── O ALVÉOLO NA CURVA DE COMPLACÊNCIA ────────────────────────────────────
   V = 1 − exp(−K·P), a forma exponencial da mecânica respiratória. A escolha
   não é estética: A COMPLACÊNCIA TEM DE CAIR MONOTONICAMENTE com a pressão,
   senão o modelo diz o contrário da fisiologia.

   Tentei primeiro uma sigmoide, que é o desenho que se vê nos livros, e ela
   REPROVOU. Numa sigmoide simétrica a inclinação é máxima no meio, então o
   ápice — que está a 63% do volume — ficava mais complacente que a base, a
   22%. O modelo previa o ápice ventilando MAIS, que é exatamente o erro que
   esta bancada existe para desfazer. Não há como consertar isso escolhendo
   melhor os parâmetros: é a simetria da curva que está errada.

   Com a exponencial, K = 0,10 põe a base em 22% e o ápice em 63% do volume —
   os números da figura de West — e a inclinação cai o tempo todo. Resultado:
   A BASE VENTILA 2,1 VEZES MAIS que o ápice, sendo menor. É o paradoxo, e ele
   agora CAI da curva em vez de ser afirmado por um comentário.

   Pressão transpulmonar nula ou negativa = alvéolo fechado. É o que acontece
   no pneumotórax, e por isso a conta tem de dar zero e não um número pequeno. */
export const K_COMPLACENCIA = 0.10;

export function volumeRelativo(pl) {
  if (pl <= 0) return 0;
  return 1 - Math.exp(-K_COMPLACENCIA * pl);
}

/* Quanto AR ENTRA num alvéolo quando a pressão pleural varia de `delta`.
   É a inclinação da curva no ponto — a complacência local. */
export function ventilacaoRelativa(f, grau, { delta = AMPLITUDE_PPL, ...opc } = {}) {
  const pl = transpulmonar(f, grau, opc);
  return volumeRelativo(pl + delta) - volumeRelativo(pl);
}

/* ── AS ZONAS DE WEST ──────────────────────────────────────────────────────
   Três pressões disputam o capilar alveolar: a arterial pulmonar, a venosa e
   a ALVEOLAR, que aperta o capilar por fora. Quem ganha decide se corre
   sangue e quanto.

   As vasculares são medidas no HILO e mudam com a altura: 1 cm de sangue vale
   0,74 mmHg, a mesma constante da bancada 08. É literalmente a mesma coluna. */
export const MMHG_POR_CM = 1060 * 9.81 * 0.01 / 133.3;
export const VASOS = { pa: 15, pv: 5 };     // mmHg, no hilo, em repouso

export function pressoesEm(f, grau, e = {}) {
  const pa0 = e.pa ?? VASOS.pa, pv0 = e.pv ?? VASOS.pv;
  const palvCm = e.palveolar ?? 0;
  const h = alturaEfetiva(grau);
  /* distância vertical do hilo até este ponto, em cm */
  const dcm = (f - PULMAO.hilo) * h;
  return {
    pa: pa0 - dcm * MMHG_POR_CM,
    pv: pv0 - dcm * MMHG_POR_CM,
    palv: palvCm * CMH2O_EM_MMHG,           // a fronteira das duas unidades
  };
}

/* 1, 2 ou 3. A zona 1 não existe em gente saudável: ela aparece quando a
   arterial cai (hemorragia) ou quando a alveolar sobe (ventilação com pressão
   positiva). Devolver zona 1 no repouso seria ensinar errado. */
export function zonaEm(f, grau, e = {}) {
  const p = pressoesEm(f, grau, e);
  if (p.palv >= p.pa) return 1;
  if (p.palv >= p.pv) return 2;
  return 3;
}

/* Fluxo relativo: na zona 1 não corre nada; na 2 o que manda é arterial menos
   ALVEOLAR (o capilar funciona como cachoeira, e a venosa não conta); na 3, o
   clássico arterial menos venosa. */
export function fluxoEm(f, grau, e = {}) {
  const p = pressoesEm(f, grau, e);
  if (p.palv >= p.pa) return 0;
  const motriz = p.palv >= p.pv ? p.pa - p.palv : p.pa - p.pv;
  return Math.max(0, motriz);
}

/* ── O CICLO RESPIRATÓRIO ─────────────────────────────────────────────────
   Até aqui a bancada estava congelada na CRF: pressão alveolar zero e um
   delta de pressão pleural CHUMBADO em 3 cmH2O para calcular ventilação. O
   número estava certo por acaso — na respiração tranquila a pleural vai de
   −5 a −8, e são esses 3 —, mas ele era uma escolha minha, não uma conta.
   Agora ele vem do ciclo, e o ciclo se pode ver.

   A FORMA É ASSIMÉTRICA de propósito: inspiração ocupa 40% do ciclo e
   expiração 60%, que é a relação I:E de quem respira em repouso. Com uma
   senoide simétrica o desenho ficaria bonito e diria que expirar custa o
   mesmo que inspirar — e expirar em repouso é PASSIVO, não custa nada.

   A pressão alveolar é a DERIVADA disso, e não uma segunda curva inventada:
   ela é negativa enquanto o pulmão enche, positiva enquanto esvazia, e passa
   por zero nos dois extremos, que é quando não há fluxo. É por isso que a
   transpulmonar em repouso é o simétrico da pleural: naquele instante, e só
   nele, a alveolar vale zero. */
export const AMPLITUDE_PPL = 3;      // cmH2O, de -5 a -8 na respiração tranquila
export const FRACAO_INSPIRATORIA = 0.4;

function formaDoCiclo(fase) {
  const f = ((fase % 1) + 1) % 1, FI = FRACAO_INSPIRATORIA;
  return f < FI
    ? .5 - .5 * Math.cos(Math.PI * f / FI)
    : .5 + .5 * Math.cos(Math.PI * (f - FI) / (1 - FI));
}

/* quanto a pleural fica MAIS negativa neste ponto do ciclo */
export function cicloPleural(fase, amplitude = AMPLITUDE_PPL) {
  return -amplitude * formaDoCiclo(fase);
}

/* a alveolar: proporcional à velocidade de encher, com sinal trocado */
export function cicloAlveolar(fase, pico = 1) {
  const h = .004;
  const d = (formaDoCiclo(fase + h) - formaDoCiclo(fase - h)) / (2 * h);
  /* o pico da derivada da forma vale pi/(2·FI) na inspiração; normalizar por
     ele deixa `pico` significar mesmo o pico em cmH2O */
  return -pico * d / (Math.PI / (2 * FRACAO_INSPIRATORIA));
}

/* ── A PLEURA E O RETORNO VENOSO ──────────────────────────────────────────
   O nível 03 dizia que no pneumotórax hipertensivo "o mediastino desvia, e é
   isso que mata". O desvio é o SINAL; a causa é outra, e é hemodinâmica:
   PRESSÃO PLEURAL POSITIVA ESMAGA O RETORNO VENOSO. Choque obstrutivo.

   E o outro lado da mesma moeda: pleural mais negativa AJUDA o retorno — é a
   bomba torácica, e é por isso que quem inspira fundo enche mais o coração
   direito. As duas metades saem da mesma conta, com sinais opostos.

   Os coeficientes vêm do simulador de ventilação do Mario, onde estão
   calibrados contra o comportamento de quem está em ventilação mecânica.
   Isto liga esta bancada à 08 do mesmo jeito que a 09 já se liga. */
export function retornoVenosoRelativo(ppl) {
  if (ppl <= 0) return Math.min(1.35, 1 + Math.max(0, -ppl - 5) * 0.045);
  return Math.max(0.42, 1 - ppl * 0.030);
}

/* ── O PNEUMOTÓRAX ────────────────────────────────────────────────────────
   As duas molas: o pulmão puxa para dentro, a caixa torácica empurra para
   fora, e no repouso elas se anulam — é ESSE empate que deixa a pressão entre
   as duas negativa. Furada a parede, o empate acaba: cada uma vai para o seu
   volume de repouso próprio.

   Os números são os da curva pressão-volume do sistema respiratório: o pulmão
   sozinho colapsa a cerca de 10% da capacidade total, a caixa sozinha abre
   até uns 60%, e o encontro das duas é a CRF, perto de 40%. */
export const VOLUMES = { crf: .40, pulmaoSozinho: .10, caixaSozinha: .60 };

export function estadoDoPneumotorax(pneumo) {
  if (pneumo === 'nenhum') {
    return { pulmao: VOLUMES.crf, caixa: VOLUMES.crf, ppl: PPL_MEDIA_FRC, desvio: 0,
             retorno: retornoVenosoRelativo(PPL_MEDIA_FRC) };
  }
  if (pneumo === 'aberto') {
    return { pulmao: VOLUMES.pulmaoSozinho, caixa: VOLUMES.caixaSozinha, ppl: 0, desvio: 0,
             retorno: retornoVenosoRelativo(0) };
  }
  /* hipertensivo: o ar entra e não sai, a pressão passa de zero e o
     mediastino é EMPURRADO para o lado bom — é isso que mata, e não o
     colapso do pulmão de um lado só */
  return { pulmao: VOLUMES.pulmaoSozinho * .6, caixa: VOLUMES.caixaSozinha * 1.08, ppl: 12, desvio: 1,
           retorno: retornoVenosoRelativo(12) };
}

/* ── OS CENÁRIOS ──────────────────────────────────────────────────────────
   Cada um mexe numa peça diferente, e a lista é a lição. */
export const CENARIOS = [
  { id: 'repouso', nome: 'Repouso', ajuste: {} },
  { id: 'hemorragia', nome: 'Hemorragia', ajuste: { pa: 8, pv: 2 },
    nota: 'a arterial cai e o ápice deixa de receber: aparece a zona 1' },
  { id: 'ventilacao', nome: 'Ventilação com pressão', ajuste: { palveolar: 12 },
    nota: 'a alveolar sobe e aperta o capilar por fora: zona 1 sem perder sangue' },
  { id: 'exercicio', nome: 'Exercício', ajuste: { pa: 25, pv: 9 },
    nota: 'a arterial sobe e o pulmão inteiro vira zona 3' },
];

export function comCenario(id) {
  const c = CENARIOS.find(x => x.id === id) || CENARIOS[0];
  return { ajuste: { ...c.ajuste }, nome: c.nome, nota: c.nota || '' };
}

/* Perfil de zonas do ápice à base, para o painel e para os testes. */
export function perfilDeZonas(grau, e = {}, n = 9) {
  const linhas = [];
  for (let i = n - 1; i >= 0; i--) {
    const f = i / (n - 1);
    linhas.push({ f, zona: zonaEm(f, grau, e), fluxo: fluxoEm(f, grau, e),
                  ppl: pressaoPleural(f, grau, e), vent: ventilacaoRelativa(f, grau, e) });
  }
  return linhas;
}
