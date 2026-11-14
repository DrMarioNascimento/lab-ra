# Ícones 3D

## Já no jogo (13/11/2026)
- **Casas das famílias** (`casa-<cor>.webp`) e **casa neutra** dos lotes: a casa 3D da pasta Cell do autor, sem fundo e com as paredes na cor de cada família.
- **Árvores da mata** (`arvore-dourada.webp`, `arvore-redonda.webp`) e **toco** (`toco.webp`): R25: toco desenhado à parte (topo com anéis, casca e raízes), provisório; o anterior, que parecia um sino de bronze, ficou em `toco_SUBSTITUIDO_2026-11-14.webp`. As árvores vêm da pasta Cell.
- **Mercado e moradia** (segunda leva da pasta Cell): `lote-venda.webp` (casinha numa ilha de grama) marca no mapa os lotes à venda no mercado e o ano 4; `lote-sobrado.webp` é o ícone do mercado de lotes no telão e no celular; `sobrado.webp` (casa de dois andares) marca a moradia e o aluguel do ano 3; `arvore-cubos.webp` marca o replantio.
- **Formas das famílias** (`forma-*.webp`, no canto da casa) e **ícones de apoio** (balança, meta, troféu, alvará, ideia, economia, grupos, participar, conduzir, simulador, telão): cópias próprias dos ícones 3D do MOSAICO Sala. A Família Lima passou da folha para o coração, que já existe em 3D.
- **Ícone do app** (`app-mosaico-vila.webp`): montagem da casa azul com as duas árvores.
- Origem de cada arquivo: `assets/icones/origens.json`.

## Leva de 14/11/2026 (R32, pasta Cell)
- **Moeda** (`moeda.webp`): a moeda dourada substitui a provisória em SVG (`moeda_SUBSTITUIDO_2026-11-14.svg`) no aluguel e no dinheiro do telão.
- **Mercado de lotes** (`mercado-lotes.webp`, a barraca com dois lotes cercados) e **lote à venda** (`lote-alfinete.webp`, o piso de lotes com alfinete): substituem os dois ícones de pixel (`lote-sobrado_SUBSTITUIDO_2026-11-14.webp` e `lote-venda_SUBSTITUIDO_2026-11-14.webp`).
- **Bem público, níveis 4 e 5** (`publico-4-escola.webp`, `publico-5-centro.webp`): a escola com relógio e a casa com sino, com as paredes em creme para não parecerem a casa da Família Azul.
- **Moradia no celular da própria família** (`moradia-*.webp`): sem lote, a cabana; com o que precisa, a casa (1 lote) ou o sobrado (2); com um lote a mais, as geminadas térreas (precisa de 1) ou o sobrado com anexo (precisa de 2); 3 lotes precisando de 1, as geminadas. As casas são recoloridas na cor de cada família. O telão continua com a mesma casa para todas, para não marcar quem tem herança ou começou sem lote.
- Ficaram guardados, sem uso no jogo: a capela (o bem público da vila é laico: praça, posto, academia, escola, centro comunitário), a cédula (o jogo usa uma moeda só, de 10 pontos, do começo ao fim) e o "sobrado + casa" (o sobrado com anexo já faz esse papel).

- R33: **meta** com o alvo com dardo enviado pelo professor (`meta.webp`; o anterior, cópia do MOSAICO Sala, em `meta_SUBSTITUIDO_2026-11-14.webp`); **sobrado** do aluguel no cinza-azulado da casa neutra (o azul parecia a Família Azul; anterior em `sobrado_SUBSTITUIDO_2026-11-14.webp`); a **cédula** (`cedula.webp`) entrou na carta *O achado da praça* e a moeda na *A taxa da praça*, no lugar das mãos repetidas. A moradia saiu do cabeçalho do celular e aparece só nas telas do mercado de lotes.

### Para completar o bem público (mesmo estilo dos níveis 4 e 5)
Estilo: ícone 3D brilhante, como as casas da vila: paredes creme lisas, acabamento dourado, telhado laranja-terracota, vista isométrica levemente de cima, iluminação suave de estúdio, fundo branco liso, sem texto, 1024 × 1024.
- `publico-1-praca.webp` · Praça: canteiro redondo de grama com uma árvore pequena, um banco de praça de madeira laranja-terracota com pés dourados e um poste de luz dourado, sobre uma base de pedra creme.
- `publico-2-posto.webp` · Posto de saúde: prédio térreo de paredes creme e telhado laranja-terracota, com uma cruz verde na fachada e porta dourada.
- `publico-3-academia.webp` · Academia ao ar livre: dois aparelhos de ginástica de praça (simulador de caminhada e barra) verdes com detalhes dourados, sobre uma base de piso creme.
Ao salvar, acrescentar o nível em `PREDIO_3D` (`js/views/desenho.js`).

## Ainda provisórios (SVG no código)
Os prédios dos níveis 1 a 3 do bem público (itens 9 a 11 abaixo) continuam desenhados em SVG no mapa; os níveis 4 e 5 já são 3D (R32). A moeda já está em 3D (R32). Os itens 1 a 8, 14 a 16 e 20 já foram resolvidos acima; 17 a 19 estão cobertos pelos ícones de apoio (alvará e balança), e o troco do mercado usa o dado do próprio celular.

## Cartas sorteadas (R13, 14/11/2026): provisórias, com prompts para os definitivos
Por ora, cada carta usa uma cópia de um ícone 3D que o jogo já tem (entre parênteses). Estilo comum: o da lista original abaixo (ícone 3D brilhante, iluminação suave de estúdio, levemente de cima, cores saturadas, fundo branco liso para recortar, sem texto, 1024 × 1024). Salvar em `assets/icones/` com o nome indicado e trocar o campo `icone` da carta em `js/content/cartas.js`.

Propostas pequenas (ano 2)
21. `carta-fiscal.webp` (hoje `toco`) · O fiscal da mata: prancheta de fiscal com um carimbo levantado e duas toras de madeira ao lado, uma moeda dourada escorregando por baixo da prancheta.
22. `carta-vizinho.webp` (hoje `grupos`) · A carga do vizinho: caderno de anotações aberto com uma linha em branco e uma carroça pequena de toras ao fundo.
23. `carta-serraria.webp` (hoje `arvore-dourada`) · A madeira sem nota: pilha de tábuas recém-serradas com uma nota fiscal rasgada ao meio no chão.
24. `carta-taxa.webp` (hoje `economia`) · A taxa da praça: banco de praça com um envelope de cobrança e uma moeda saindo pela lateral.

Propostas grandes (ano 5)
25. `carta-alvara.webp` (hoje `alvara`) · O alvará: prancheta com carimbo "aprovado" e um capacete de obra ao lado (o item 18 da lista original).
26. `carta-madeireira.webp` (hoje `alvara`) · A licença da madeireira: papel de licença enrolado com fita vermelha, encostado num tronco grosso com uma motosserra estilizada (sem lâmina à mostra, tom de brinquedo).
27. `carta-escola.webp` (hoje `alvara`) · O contrato da escola: prédio escolar pequeno com andaime e um contrato com duas assinaturas em cima de uma pilha de moedas.

Honestidade (ano 4)
28. `carta-dado.webp` (hoje `ideia`) · O troco do mercado: dado branco ao lado de um punhado de moedas (o item 17 da lista original).
29. `carta-extrato.webp` (hoje `participar`) · O extrato a mais: celular mostrando um extrato com uma linha destacada em verde e três moedas saltando da tela.
30. `carta-achado.webp` (hoje `economia`) · O achado da praça: três moedas douradas no chão de pedra da praça, com uma caixinha de achados e perdidos ao lado.

Confiança (ano 4)
31. `carta-pedido.webp` (hoje `economia`) · O pedido na estrada: duas mãos se encontrando, uma oferecendo duas moedas, sobre uma estrada de terra; sem rosto, roupa ou sinal de pobreza (para não retratar ninguém).
32. `carta-fiado.webp` (hoje `grupos`) · A venda fiado: carrinho de toras de madeira com uma caderneta de fiado aberta em cima.
33. `carta-sinal.webp` (hoje `participar`) · O sinal adiantado: ferramenta (enxada ou serrote) numa banca de feira, com duas moedas na frente e uma etiqueta de "sinal" sem texto legível.
34. `carta-carroca.webp` (hoje `grupos`) · A carroça dividida: carroça de madeira com duas pilhas iguais de moedas, uma em cada lado do banco.

## Lista original

Estilo comum: ícone 3D brilhante, cantos arredondados, iluminação suave de estúdio, fundo transparente, levemente de cima, cores saturadas, 1024×1024, sem texto.

## Famílias (a forma é a mesma do provisório, para ninguém depender só da cor)
1. `familia-verde.png` · Família Verde (#22c55e): casinha de telhado verde apoiada sobre uma esfera verde lisa.
2. `familia-azul.png` · Família Azul (#3b82f6): casinha de telhado azul apoiada sobre uma pirâmide azul de três faces.
3. `familia-ambar.png` · Família Âmbar (#f59e0b): casinha de telhado âmbar apoiada sobre um cubo âmbar.
4. `familia-rubi.png` · Família Rubi (#f43f5e): casinha de telhado rubi apoiada sobre um losango facetado, como uma pedra preciosa.
5. `familia-violeta.png` · Família Violeta (#a78bfa): casinha de telhado violeta apoiada sobre um prisma hexagonal.
6. `familia-ciano.png` · Família Ciano (#22d3ee): casinha de telhado ciano apoiada sobre uma estrela de cinco pontas com volume.
7. `familia-coral.png` · Família Coral (#fb923c): casinha de telhado coral apoiada sobre uma gota.
8. `familia-lima.png` · Família Lima (#a3e635): casinha de telhado verde-limão apoiada sobre uma folha.

## Bem público (um por nível, ficam no mapa da vila)
9. `publico-1-praca.png` · Praça: banco de praça com um poste de luz e um canteiro redondo.
10. `publico-2-posto.png` · Posto de saúde: prédio baixo branco com cruz verde na fachada.
11. `publico-3-academia.png` · Academia ao ar livre: dois aparelhos verdes de praça (simulador de caminhada e barra).
12. `publico-4-escola.png` · Escola de esportes: quadra pequena com trave e bola.
13. `publico-5-centro.png` · Centro comunitário: prédio de dois andares com toldo colorido e porta aberta.

## Paisagem e mercado
14. `mata-arvore.png` · Árvore da mata comum: copa redonda verde-escura, tronco curto.
15. `mata-toco.png` · Toco de árvore cortada, com machado leve encostado (mata explorada).
16. `lote-livre.png` · Lote vazio cercado, com placa em branco.

## Acontecimentos
17. `evento-troco.png` · O troco do mercado: dado branco ao lado de um punhado de moedas.
18. `evento-alvara.png` · O alvará: prancheta com carimbo e um capacete de obra ao lado.
19. `evento-voto.png` · A votação: urna transparente com uma cédula entrando.

## App
20. `app-mosaico-vila.png` · Ícone do app "Mosaico Vila": três casinhas de cores diferentes em volta de uma árvore, sobre uma base redonda de grama, em verde e dourado.
