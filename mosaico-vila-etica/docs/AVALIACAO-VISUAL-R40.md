# Avaliação visual e direção artística — R40 (16/11/2026)

Vale para os três Vilas (Mosaico Vila, Mosaico Vila Ética no LAB-RA e a cópia do site de Ética). Só o visual mudou: textos, regras e funcionamento são os mesmos; os testes de partidas continuam passando. Nenhuma imagem nova: céu, morros e texturas são gradientes do CSS.

## Direção: "a maquete da vila ao entardecer"

As peças 3D (casas, árvores, prédios) são miniaturas; a interface passa a ser a mesa onde elas ficam, iluminada por um lampião.

- **Céu**: noite no alto, horizonte quente e três morros em silhueta; o horizonte muda de cor a cada ano (âmbar, laranja, rosa, lilás, índigo).
- **Cor por assunto**: a frase principal de cada tela é uma placa quente; em "Como ficou a vila", cada painel tem a sua cor (aluguel terracota, mercado petróleo, dinheiro verde de feltro, desigualdade ameixa, propostas violeta). O azul fica para a leitura de apoio.
- **Material**: placas com luz de cima, fio claro na borda e base grossa; fichas da barra de estado como peças de jogo; relógio com aro.
- **Mapa**: três terrenos (mata verde, praça índigo, lotes petróleo), lotes vazios visíveis, prédios ainda não construídos em silhueta do próprio ícone 3D, desenho ocupando a placa inteira.
- **Tipografia**: Sora e JetBrains Mono mantidas; título do telão com mais peso; etiqueta da etapa com fio dourado.
- **Capa**: mesmo céu, miniaturas numa rua, passos da partida como fichas.

## O que foi corrigido (além da pintura)

| Onde | Como estava | O que mudou |
|---|---|---|
| Barra de estado com 6 fichas (anos 3 a 5) | no pior caso ("Prosperidade" + variações) o texto encostava na ficha vizinha | fichas mais justas; pior caso testado, cabe |
| Celular, cartão "Conversem na família" | botão cortado em tela estreita | cartão cresce até o botão caber |
| Celular, palpite enviado | as três respostas ficavam cinza, sem mostrar a escolhida | a escolhida segue colorida, com aro |
| Botões desligados | pareciam clicáveis | afundados e foscos |
| Rótulos "faint" no celular, "livres" e "Nada ainda" no mapa | contraste abaixo de 4,5:1 nas placas novas | clareados (4,8:1 ou mais) |
| Números dos prédios no mapa | 1,0% da largura da TV | 1,3% (1,04% no mapa menor do mercado) |

## Conferência (último ciclo, sem alterações)

- 380 capturas nos três projetos: capa (PC, celular, 1920), simulador, telão em tela cheia 1920×1080 em todas as etapas e painéis, dois celulares por etapa.
- Nada fora da tela nem cortado; nenhuma ficha da barra estourada; nenhum erro no console; sem rolagem lateral em 390, 1000, 1366 e 1920 px.
- Letra do telão: mínimo de 1,6% da largura nos rótulos (os números dos prédios no mapa são a exceção). Celular: mínimo de 13 px; alvos de toque de 44 px ou mais.
- Hover, foco por teclado e afundar ao toque conferidos; com "reduzir movimento", só os relógios contam.

## Não verificado

- iPhone, TV e projetor reais; leitor de tela.
- No simulador, o celular tem 280 px de largura: o nome da família aparece cortado ao lado do botão do glossário; num celular real (360 px ou mais) há espaço.

## Pendências que dependem de decisão

- Ícones fora do estilo (árvore de cubos, mercado de lotes, cabana) e símbolos de texto usados como ícone (⛶ ✕ ✓ ▴).
- Painéis com pouco texto ("Mercado", desigualdade do ano 1) ficam com muita área vazia: resolver pede mexer no conteúdo ou no tamanho da letra desses painéis.
- Cabeçalho do simulador em 1366 px: o subtítulo quebra em três linhas.
