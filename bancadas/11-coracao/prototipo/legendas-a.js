/* ── AS MARCAÇÕES DA VISTA EXTERNA ──────────────────────────────────────
   Seis pontos sobre o scan, nos mesmos dois grupos da Vista Interna. Na
   externa o grupo verde muda de nome e de sentido: não é "valva", é SAÍDA —
   marca por onde o sangue deixa o coração, que é onde a valva está por
   dentro. O aluno vê a saída por fora e troca de peça para ver a valva que a
   comanda. Ideia do professor.

   ESTES PONTOS SÃO DE OUTRA NATUREZA que os da Vista Interna, e a diferença
   importa. Lá cada rótulo saía do catálogo do BodyParts3D: eu cruzava o
   código FJ com o `partof_element_parts.txt` e o nome era o que o ARQUIVO
   declarava. Aqui o scan é uma malha fechada sem nome nenhum, e as
   coordenadas foram escolhidas OLHANDO. Não há régua para conferir.

   Por isso a nota da tela diz que são aproximados.

   A CORRESPONDÊNCIA AORTA / TRONCO PULMONAR É DO PROFESSOR, e está aqui
   registrada como tal. Eu tentei confirmá-la sozinho e NÃO consegui: medi a
   distância dos ramos do arco até as duas âncoras, e a régua não servia — as
   duas âncoras estão a 6 mm uma da outra, então "qual está mais perto" só
   divide o espaço ao meio e não enxerga a qual tubo o ramo pertence. Ele
   conferiu na tela e devolveu as seis coordenadas, que batem com estas.

   Quem mexer aqui depois precisa saber disso: estes números não têm prova no
   repositório. A prova foi o olho de quem ensina anatomia, e é a única que
   este scan admite.

   O ponto é o vértice mais próximo da coordenada — assim ele gruda na malha
   e acompanha a deformação, como na outra peça. */
export const MARCAS_EXTERNAS = [
  ['Aorta · saída do VE',        'valvas', [-0.188,  0.794,  0.545]],
  ['Tronco pulmonar · saída do VD', 'valvas', [ 0.396,  0.742,  0.503]],
  ['Coronária direita',          'vasos',  [-0.467,  0.099,  0.715]],
  ['Coronária esquerda',         'vasos',  [ 0.217,  0.246,  0.619]],
  ['Descendente anterior',       'vasos',  [ 0.334, -0.280,  0.755]],
  ['Circunflexa',                'vasos',  [ 0.887, -0.041, -0.103]],
];

/* O QUE A TELA PRECISA DIZER, e que não cabe no rótulo. A caixinha é pílula
   de uma linha só — enfiar "região aproximada" dentro dela a transforma num
   retângulo de duas linhas e quebra a gramática que já estava fechada. A
   ressalva não some: muda de lugar, para a nota, onde cabe inteira. */
export const RESSALVA_EXTERNA =
  'Pontos aproximados: marcam a região do vaso na superfície, não o óstio. ' +
  'O tronco da coronária esquerda fica encoberto. Verde marca a saída do ' +
  'sangue — a valva em si só aparece na Vista Interna.';
