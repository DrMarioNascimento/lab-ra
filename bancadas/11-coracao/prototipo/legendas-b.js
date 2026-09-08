/* ── AS LEGENDAS DA VISTA INTERNA ───────────────────────────────────────
   DEZ rótulos, em dois grupos independentes — não é um seletor de três
   estados: são dois interruptores, e o aluno vê um, o outro ou os dois.

   ELES ERAM TRINTA E TRÊS, e a primeira versão nomeava cada folheto e cada
   ramo: "cúspide posterior esquerda da aórtica", "3º ramo anterior direito
   da interventricular anterior". Na tela virou um muro de texto sobreposto,
   ilegível, e o professor cortou com uma frase: *"sem condição assim com
   esse detalhamento todo — só o genérico"*. Ele tem razão, e a razão é
   pedagógica antes de ser visual: aquilo é nome de dissecção, não de aula.
   Quem está aprendendo o ciclo cardíaco precisa saber ONDE ESTÁ A MITRAL,
   não qual dos dois folhetos dela é o posterior.

   E as valvas ficaram nos QUATRO NOMES que importam — mitral, tricúspide,
   aórtica, pulmonar —, sem os músculos papilares: o professor confirmou que
   isso basta. Os papilares continuam desenhados e continuam se mexendo com o
   campo ventricular; só não são anunciados.

   As três paredes e os papilares ficam sem rótulo; o resto está coberto.

   O nível de dissecção continua existindo e está em
   `bancadas/11-coracao/LEGENDAS-CORACAO-B.md`, com os 33 nomes e a
   correspondência de cada código FJ. Se um dia fizer sentido um interruptor
   "detalhado", os dados estão lá — mas o padrão é este.

   AS TRÊS PAREDES FICAM DE FORA, e é decisão, não esquecimento. Medido:
   `parede_ae` põe 86 cm² ABAIXO do anel mitral e `parede_ad` desce a 1 mm do
   ápice. Nenhuma das duas é parede de átrio — são paredes do LADO inteiro do
   coração, e o catálogo lista o FJ2439 como as duas coisas. Rotular qualquer
   uma como "átrio" ensinaria errado, e ensinar errado é pior que não
   rotular. */
export const LEGENDAS = {
  valvas: [
    ['Valva mitral', ['cuspide_anterior_mitral', 'cuspide_posterior_mitral']],
    ['Valva tricúspide', [
      'cuspide_anterior_tricuspide',
      'cuspide_posterior_tricuspide',
      'cuspide_septal_tricuspide',
    ]],
    ['Valva aórtica', [
      'cuspide_anterior_aortica',
      'cuspide_posterior_direita_aortica',
      'cuspide_posterior_esquerda_aortica',
    ]],
    ['Valva pulmonar', [
      'cuspide_anterior_esquerda_pulmonar',
      'cuspide_anterior_direita_pulmonar',
      'cuspide_posterior_pulmonar',
    ]],
  ],
  vasos: [
    ['Coronária esquerda', ['tronco_coronaria_esquerda']],
    ['Interventricular anterior', [
      'tronco_descendente_anterior',
      'FJ2632',
      'FJ2633',
      'FJ2634',
      'FJ2635',
      'FJ2636',
      'FJ2637',
      'FJ2638',
      'FJ2639',
      'FJ2640',
      'FJ2641',
      'FJ2642',
      'FJ2643',
      'FJ2644',
      'FJ2645',
      'FJ2646',
      'FJ2647',
      'FJ2648',
    ]],
    ['Artéria circunflexa', ['FJ2649', 'FJ2650', 'FJ2651', 'FJ2652', 'FJ2653', 'FJ2654']],
    ['Coronária direita', [
      'tronco_coronaria_direita',
      'FJ2667',
      'FJ2668',
      'FJ2670',
      'FJ2671',
      'FJ2672',
      'FJ2673',
      'FJ2674',
      'FJ2675',
      'FJ2676',
      'FJ2677',
      'FJ2692',
      'FJ2693',
      'FJ2694',
      'FJ2695',
      'FJ2696',
      'FJ2697',
      'FJ2698',
      'FJ2699',
      'FJ2700',
      'FJ2714',
      'FJ2715',
      'FJ2716',
      'FJ2717',
      'FJ2718',
      'FJ2719',
      'FJ2720',
      'FJ2721',
      'FJ2722',
    ]],
    ['Seio coronário', ['seio_coronario']],
    ['Veias cardíacas', ['FJ2656', 'FJ2724', 'FJ2727', 'FJ2728', 'FJ2729', 'FJ2731']],
  ],
};
