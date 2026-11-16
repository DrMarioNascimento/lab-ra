# Percurso / Limiar Ético · Um dia — avaliação visual e direção artística

16/11/2026 · documento de projeto (não é conteúdo para o aluno)
Interface avaliada: `limiar-etica/um-dia/` · versão visual 0.1 (antes) e 0.2 (depois)

## Como a avaliação foi feita

- **Observado diretamente:** a interface foi aberta e jogada do início ao fim num navegador automatizado, em três tamanhos: celular (390 × 844), computador (1366 × 768) e projeção (1920 × 1080). Trinta telas foram capturadas e conferidas.
- **Testado por interação:** foco pelo teclado, tecla Enter, passar o cursor, pressionar, aba selecionada, seleção de decisão nos gráficos pelo teclado, preferência de movimento reduzido e a informação com tempo contado.
- **Calculado:** as razões de contraste de texto e de componentes (WCAG).
- **Não testado:** iPhone real, projetor real, leitor de tela. A fonte Fraunces foi testada com uma cópia local do mesmo arquivo que o Google Fonts serve.

Limite respeitado: nenhuma imagem, ícone ou ilustração foi criada. O céu, as estrelas e o arco do dia são gradientes e formas geométricas escritos em CSS e SVG. Conteúdo e regras não mudaram.

---

## 1. Primeira impressão e identidade

**Antes (0.1).** Página bege, cartões creme, botão verde. Correta e legível, mas genérica: poderia ser qualquer formulário. Nada na tela dizia "um dia" nem "ética". O que já era bom e foi preservado: a hierarquia simples (um cartão de cena, três alternativas), os botões com volume e a tipografia com serifa nos títulos.

**Depois (0.2).** A primeira coisa que se vê é o céu de amanhecer e o arco do dia com os momentos que virão. A interface passa a ter uma ideia própria: o dia corre, e a luz muda com ele.

## 2. Direção artística

**Conceito: a agenda sob o céu do dia.** Dois planos que trabalham juntos:

- **O céu (fundo)** marca o tempo. Cinco luzes: manhã cedo, manhã, tarde, fim de tarde e noite com estrelas. A troca é um esmaecimento lento. É atmosfera pura, sem texto em cima.
- **O papel (conteúdo)** é a agenda do personagem. Tudo o que se lê está em papel claro, com o mesmo contraste em qualquer hora. Cada cena é uma página, com a aba do período ("Manhã", "Fim de tarde") e a linha de margem.

O **arco do dia** no cabeçalho liga os dois planos: um astro percorre o arco conforme a hora e vira lua à noite. Ele é ao mesmo tempo identidade e indicador de progresso.

## 3. Profundidade, volume e materiais

Uma regra única de leitura:

- **Em relevo:** o que se toca ou é conteúdo principal (cartões, alternativas, abas, botões).
- **Rebaixado:** o que é dado para ler (gráficos, a escolha já feita, o conceito, os sinais).

Materiais: papel de agenda (cartões), tecla de papel com aresta espessa (alternativas), âmbar do sol (ação principal), anil da noite (selecionado e concluído), bilhete amarelo levemente inclinado (a informação conferida).

## 4. Hierarquia e composição

- Grade de 8 px nos espaçamentos principais (8, 16, 24, 32, 40).
- Celular: as três alternativas cabem na primeira tela quando a informação opcional não está aberta (antes cabiam uma ou duas).
- Computador: a cena fica em duas colunas (página à esquerda, alternativas à direita), centralizada na altura da janela. A revelação usa gráfico e decisão lado a lado.
- Todo texto solto sobre o fundo foi levado para uma superfície de papel (etiqueta "O que você faz?", aviso, versão, rodapé).

## 5. Cores, contraste e iluminação

| Par | Antes | Depois | Mínimo |
|---|---|---|---|
| Texto principal sobre papel | 17,1 | 16,5 | 4,5 |
| Texto secundário sobre papel | 7,7 | 8,5 | 4,5 |
| Rótulos pequenos sobre papel | **4,3 (reprovado)** | 5,6 | 4,5 |
| Texto do botão principal | 9,4 | 9,0 | 4,5 |
| Aba selecionada (texto sobre o fundo) | 9,4 | 12,2 | 4,5 |
| Contorno dos controles sobre o papel | **1,9 (reprovado)** | 4,0 | 3,0 |
| Barras "desfecho" sobre o gráfico | 3,1 | 4,2 | 3,0 |
| Barras "margem de escolha" | **2,9 (reprovado)** | 4,3 | 3,0 |
| Linha "emoção" sobre o gráfico | 3,1 | 3,1 | 3,0 |
| Linha "impulso" sobre o gráfico | 2,7 | 2,7 | 3,0 |

A linha "impulso" fica abaixo de 3:1 por ser a cor validada para daltonismo junto das outras duas. A compensação está presente: nome escrito no fim de cada linha, legenda e a aba Decisões com tudo em texto.

O gráfico "o certo ou o desfecho" ganhou cores próprias (violeta e ocre). Antes usava o azul e o laranja de razão e emoção, o que sugeria uma relação que não existe.

## 6. Tipografia

- Títulos e hora: **Fraunces** (serifa com personalidade, numerais marcantes). Texto: **Inter**.
- Antes a combinação Lora + Inter era correta, porém neutra. A hora em Fraunces grande passou a ser um elemento gráfico.
- Corpo: 17 px no celular, 18 px no computador, 24 px na projeção. Linhas de até cerca de 65 caracteres.
- A fonte é carregada por link real no HTML.

## 7. Componentes

| Componente | Situação anterior | Agora |
|---|---|---|
| Alternativas | Botão creme com sombra discreta | Tecla de papel com aresta dupla; sobe 2 px ao passar o cursor e afunda 6 px ao pressionar |
| Botão principal | Verde, sem relação com o tema | Âmbar do sol, com brilho no topo e aresta escura |
| Informação opcional | Faixa bege | Bilhete amarelo inclinado, com canto dobrado, que "cola" ao abrir |
| Progresso | Onze traços finos | Arco do dia com o astro, mais onze contas (feita em anil, atual em âmbar pulsando com contorno, futura rebaixada) |
| Abas da revelação | Botões iguais, selecionada em verde | Selecionada afundada em anil; as outras em relevo |
| Gráficos | Caixa plana | Poço rebaixado dentro do cartão de papel |
| Rodapé | Texto cinza sobre o fundo | Faixa de papel, com contraste constante |

## 8. Heurísticas de Nielsen e ergonomia

- **Estado do sistema:** hora grande, astro no arco e contas mostram onde se está no dia. A informação com tempo contado ganhou uma faixa que se esgota no próprio botão; antes ele desaparecia sem aviso.
- **Consistência:** uma só regra de relevo e rebaixo em todas as telas.
- **Clareza da ação:** uma única ação principal em âmbar por tela.
- **Áreas de toque:** o menor controle tem 46 px de altura (medido); as alternativas têm 56 px ou mais.
- **Foco:** anel branco e anil de alto contraste em qualquer céu (testado pelo teclado).

## 9. Movimento

- Entrada das telas em cascata (cartão, etiqueta, alternativas).
- Troca lenta da luz do céu e deslizamento do astro entre as cenas.
- Estrelas cintilando à noite.
- Na revelação, as linhas se desenham uma vez; ao tocar num ponto nada é reanimado.
- Com a preferência de movimento reduzido, tudo isso é desligado (testado).

## 10. Computador, celular e projeção

- **Celular:** coluna única, cabeçalho fixo, três alternativas visíveis.
- **Computador:** duas colunas, conteúdo centralizado, céu amplo.
- **Projeção:** texto de 24 px, botões de 76 px, hora maior. Na primeira medição o texto estava pequeno para ler à distância; foi corrigido.

## 11. Diagnóstico e propostas

| # | Local | Situação encontrada | Proposta | Resultado esperado | Prioridade | Estado |
|---|---|---|---|---|---|---|
| 1 | Todas as telas | Fundo bege sem relação com o tema | Céu que muda com a hora | Identidade própria e noção de tempo | Alta | Feito |
| 2 | Cabeçalho | Só a hora e traços | Arco do dia com astro e contas | Progresso legível e marcante | Alta | Feito |
| 3 | Cena | Cartão igual aos demais | Página de agenda com aba do período | Material coerente com o tema | Alta | Feito |
| 4 | Rótulos pequenos | Contraste 4,3:1 | Tinta mais escura | Atende WCAG AA | Alta | Feito |
| 5 | Botão principal | Verde sem ligação com o tema | Âmbar do sol | Ação principal inequívoca | Alta | Feito |
| 6 | Alternativas | Resposta ao toque não funcionava depois da animação de entrada | Corrigir o modo da animação | Tecla sobe e afunda de fato | Alta | Feito |
| 7 | Projeção | Texto pequeno | Escala própria acima de 1600 px | Leitura à distância | Alta | Feito |
| 8 | Celular | Uma ou duas alternativas na primeira tela | Espaçamentos mais justos | As três visíveis | Média | Feito |
| 9 | Gráfico certo/desfecho | Mesmas cores de razão/emoção | Violeta e ocre | Sem leitura errada | Média | Feito |
| 10 | Informação com tempo | Sumia sem aviso | Faixa que se esgota no botão | Estado visível | Média | Feito |
| 11 | Gráficos pelo teclado | Foco perdido ao selecionar | Devolver o foco ao mesmo ponto | Uso por teclado sem se perder | Média | Feito |
| 12 | Arco no cabeçalho | Astro deformado e trecho percorrido errado em telas largas | Astro em HTML e trecho como geometria | Arco correto em todo tamanho | Média | Feito |
| 13 | Texto sobre o fundo | Contraste dependia do céu | Tudo em superfícies de papel | Contraste constante | Alta | Feito |
| 14 | Revelação no celular | Tocar nos gráficos de baixo muda o cartão de decisão que está lá em cima, fora da vista | Levar a rolagem ao cartão ou repetir o resumo junto de cada gráfico | Resposta visível ao toque | Média | **Depende de decisão (muda comportamento)** |
| 15 | Gráfico de linhas | Três linhas cruzando onze pontos ficam carregadas | Testar barras empilhadas por decisão | Leitura mais imediata | Média | **Depende de decisão (muda a representação)** |
| 16 | Ícones e ilustrações | Não há nenhum | Personagem ou cena por período, ícones 3D das abas | Mais calor e marca | Média | **Depende de autorização** |
| 17 | Fontes | Vêm do Google Fonts; sem internet caem para a fonte do sistema | Guardar os arquivos na pasta do projeto | Mesma aparência offline e em sala | Baixa | **Depende de autorização (arquivos novos)** |
| 18 | Arco do dia | Vai das 6h à meia-noite, então o ponto mais alto cai às 15h | Manter, ou encurtar para pôr o topo ao meio-dia | Leitura literal de "sol" | Baixa | Em aberto |

## 12. Direção visual adotada

- **Conceito:** a agenda sob o céu do dia.
- **Paleta:** céus (azul claro, dourado, violeta, anil), papel creme, âmbar para agir, anil para o que está feito ou selecionado. Os gráficos usam a paleta validada para daltonismo.
- **Luz:** vem de cima. Todo relevo tem brilho no topo e aresta escura embaixo; todo rebaixo tem sombra interna no topo.
- **Tipografia:** Fraunces nos títulos e na hora, Inter no texto.
- **Movimento:** lento no céu, rápido no toque, único nos gráficos.
- **Adaptação:** uma coluna no celular, duas no computador, escala maior na projeção.

## Ciclos de checagem

| Ciclo | O que apareceu | Correção |
|---|---|---|
| 1 | Astro deformado, hora repetida na aba, poucas estrelas, alternativas fora da primeira tela, abertura sem impacto | Astro em HTML, aba com o período, campo de estrelas, espaçamentos, arco na capa |
| 2 | Contornos e barras abaixo de 3:1; contas futuras pouco visíveis | Contorno 4:1, barras mais escuras, contas com borda |
| 3 | Toque e cursor sem resposta; foco perdido no teclado | Modo da animação; foco devolvido |
| 4 | Texto pequeno na projeção; trecho percorrido do arco errado em telas largas | Escala de projeção; arco como geometria |
| 5 | Nenhuma alteração | Ciclo limpo: 30 telas sem estouro lateral, menor controle com 46 px, sem erros no console, testes do motor passando |
