# Loop · Rodada 4 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas. Nenhum arquivo do repositório foi alterado.

**Nota geral:** Parte A com 4 de 9 critérios no mínimo (média 8,4; antes 8,1). Parte B com 7 de 15 salas aprovadas (antes 5). As escalas ainda **não** passaram.

Fontes:
- 17 telas novas em `/tmp/roda/esc/r4/visB/` (`vis3.mjs`), mais as folhas `folha15.png` (15 miniaturas das salas) e `folha_ui.png` (16 ícones de `museu/icones/ui`).
- 69 telas em `/tmp/roda/esc/r4/visB_extra/`: entrada, manual, mapa em 390 e 360 px, sala, cofre, Máquina, caderno, professor, participante, minijogos, livros de folhear, telão em todas as páginas (1280 e 1920 px), simulador, entrada no PC, resultado no celular.
- 15 capturas das peças dentro da sala, com os pontos, em `/tmp/roda/esc/r4/visB_pecas/`.
- Scripts em `/tmp/roda/esc/r4/pwB/`: cópias de `extra_r3`, `tl_r3`, `mg_r3`, `mg2_r3`, `est_r3`, `medirB`, `r4` com a pasta de saída trocada, e os meus `meu.mjs`, `meu360.mjs`, `livro.mjs`, `pecas.mjs`, `tl2.mjs`, `txt.mjs`, `shots2.mjs`.
- Todas as imagens foram olhadas (em folhas de contato em `/tmp/roda/esc/r4/folhas/`).

Limites desta avaliação:
- `mg2_r3.mjs` (resolver a fita da câmera) continua quebrando: os nomes das cenas mudaram. A fita foi vista aberta; a resolução não foi testada.
- A entrada foi conferida contra a descrição do critério 9, não lado a lado com a tela do Comitê.
- O simulador foi medido depois de redimensionar a janela; o tamanho do telão dentro dele (672 px) pode ser efeito disso.
- Tudo rodou em Chrome com renderização por software; nenhum aparelho real.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

### Tabela de notas

| # | Critério | Antes (rodada 3) | Agora | Passa? | Justificativa em uma linha (tela) |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões, cartões, abas, pistas, escolhas do professor e a lista "O que você já sabe?" têm sombra dura, brilho e afundam (04, 06, 08, s01, s03) |
| 2 | Ícones | 7 | **8** | não | Os 7 copiados de outro jogo saíram e tudo virou miniatura 3D do acervo; restam 6 emojis em ficha, 3 deles em telas de todo instante (04, 08, 10_revelar) |
| 3 | Muito visual | 8 | **8** | não | Cofre, professor, pausa e desfecho do telão ganharam desenho; o resultado no celular, o manual, a aba Atividades e as cenas dos minijogos ainda são texto ou bloco chapado (y_resultado, e02, y_atividades, m_traj_1) |
| 4 | Paleta coerente | 8 | **9** | sim | Azul-noite, dourado e verde-água em todas as telas, faixa da pista neutra na sala, sem ícone de outra paleta; sobra o fundo marrom do livro (x02) |
| 5 | Celular | 8 | **8** | não | Nada estoura e todo alvo tem 44 px; mas os pontos da peça ficam uns em cima dos outros e em 360 px só 8 das 15 salas cabem (visB_pecas, e03_360) |
| 6 | Estabilidade | 8 | **8** | não | Lista, relógio, Máquina e aviso não pulam mais; o minijogo fica aberto por cima da pausa e do resultado (x01, t12) |
| 7 | Linguagem | 8 | **9** | sim | Segunda pessoa, curto, sem gênero, com dicionário das palavras difíceis; sobram poucas frases longas e a marca escrita de três jeitos (txt.mjs) |
| 8 | Telão | 8 | **8** | não | Páginas por tema, tela cheia sempre visível, nome da sala grande; o andar, "Quem trouxe" e as horas ficam abaixo de 1,3% da largura e sobra muito vazio (u_mapa_1920, u_res_noite_1920, t03) |
| 9 | Entrada | 9 | **9** | sim | Participar com código, roxo com cadeado e "Só o Professor tem a chave", telão e simulador na primeira tela (01, s04, s03) |

**Resultado: 4 de 9 critérios atingem 9 (1, 4, 7, 9). Média 8,4.** Nenhuma nota caiu.

### Antes | agora | motivo

| # | Antes | Agora | Motivo |
|---|---|---|---|
| 1 | 9 | 9 | Mantido; os três ajustes pedidos foram feitos |
| 2 | 7 | 8 | 31 provisórios viraram 6; a cópia de outro jogo acabou |
| 3 | 8 | 8 | Quatro telas melhoraram, mas o resultado no celular (não visto antes) é só texto |
| 4 | 8 | 9 | Os ícones de outra paleta saíram; faixa da pista deixou de ter dois códigos de cor |
| 5 | 8 | 8 | Cabeçalho caiu de 140 para 74 px e o mapa foi para 4 colunas; apareceu o problema dos pontos colados |
| 6 | 8 | 8 | Os três saltos medidos sumiram; apareceu o minijogo preso na troca de etapa |
| 7 | 8 | 9 | Das 12 trocas pedidas, 11 foram feitas |
| 8 | 8 | 8 | Desenho na pausa e no desfecho, fichas no resultado; letras de apoio continuam pequenas |
| 9 | 9 | 9 | Mantido |

### Critério 1 · Profundidade 3D — nota 9

Conferido no CSS: `:active` com `translateY` em `.room`, `.clue`, `.lc-aba`, `.lc-causa`, `.lc-prova`, `.lc-barra button`, `.close`, `summary`, `.text-button`, `.hs` (style.css, linhas 43 a 414), mais 6 regras em `sala.css` e 2 em `bancada.css`. A aba ativa da Máquina fica 2 px mais baixa (afundada).

Ajustes para o 10 (não reprovam):
- **Resultado no celular (y_resultado):** os 4 itens são marcadores de lista sem cartão. Ver critério 3.
- **Moldura do minijogo da luz (m_falsa_1):** bloco laranja liso, sem brilho nem sombra. Ver critério 3.
- **Linhas da fita do tempo no telão (t09):** texto solto com miniatura de 31 px; dar a cada fato achado um cartão `background:linear-gradient(180deg,#294051,#172633);box-shadow:inset 0 1px 0 #ffffff2b,0 .3vw 0 #05090d;border-radius:.8vw`.

### Critério 2 · Ícones — nota 8

O que está certo: mapa (celular e telão), barra inferior, entrada, abas da Máquina, defeitos, Atividades, Revelar, pausa, caderno, tipos de pista e telão usam miniatura 3D renderizada das peças do projeto (`museu/icones/*.webp` e `ui/*.webp`), que contam como ícone 3D próprio. Nenhum ícone de outro jogo.

**Provisórios que restam: 6**, todos declarados na lista B de `docs/ICONES-A-GERAR.md` (medidos na tela: fichas com emoji no lugar da imagem). Peso, do maior para o menor:

| # | Emoji | Onde | Peso |
|---|---|---|---|
| 1 | 🚪 Saguão | Primeiro cartão do mapa do celular, em toda volta, e primeiro cartão do mapa do telão (04, t02) | Alto: é o maior ícone do mapa e o ponto de partida |
| 2 | ⚡ energia | Em toda pista com custo (8 vezes numa lista), na ficha Energia e na linha de energia da sala (06, 08) | Alto pela repetição; ao lado de número o padrão aceita como apoio |
| 3 | 🕵️ missão | Topo do Dossiê, toda vez que a Máquina abre (08) | Alto: ficha de 32 px em destaque |
| 4 | 📘 manual | Etiqueta das pistas de manual no dossiê e no caderno (09) | Médio: é uma das 4 cores de etiqueta; as outras 3 já têm miniatura |
| 5 | ☝️ uma tentativa | Aba Revelar, terceira ficha (10_revelar) | Médio: uma tela só |
| 6 | círculo tracejado | Telão, página "A noite", fato que ninguém achou (t09) | Baixo: aparece 6 vezes, mas representa "vazio" |

O que mais falta para o 9, fora os 6 emojis:
- **Ícone de tipo de pista com 24 px (06):** fichário, câmera de fole, gramofone e caixa de ferramentas viram manchas escuras parecidas; em 16 cartões só se distinguem "esverdeado" e "marrom". Subir para 32 px (`.clue .ic3d.sm{width:32px;height:32px}`) e reenquadrar as 4 miniaturas mais perto, com fundo claro na ficha (`background:#3a5568`).
- **E02 (Oficina elétrica)** continua uma laje cinza no mapa de 48 px (04, t02). O documento já reconhece. Usar um recorte do painel de fusíveis em vez da sala inteira.
- **DESC_A** (sofá + cortiça): a peça tem 3,8 m de largura e na miniatura de 48 px são dois traços (04). Enquadrar só a cortiça com as alavancas.
- **Estilos misturados em `ui/`** (folha_ui): móveis brancos lisos (`participar`, `telao`), farol de desenho animado (`sinal`), figuras de cera coloridas (`simulador`) e peças de latão escuro (`dois-defeitos`, `pista-relato`). Lado a lado na entrada (01) o conjunto não parece da mesma família. Os prompts de latão e esmalte do documento resolveriam; prioridade para `participar`, `telao`, `sinal` e `simulador`.

### Critério 3 · Muito visual — nota 8

Passaram a ser visuais desde a rodada 3: cofre com miniatura (e05), área do professor com ícone em cada escolha (s03), pausa do telão com a máquina e as 5 bolinhas (t05), desfecho com o caderno (t06), resultado do telão com 3 fichas (t08), "Para conversar" com o rádio (t10).

O que ainda é texto ou bloco chapado:
- **Resultado no celular (`#result`, y_resultado):** título, um parágrafo e 4 marcadores de lista; nenhuma ficha, nenhuma miniatura. É a última tela do jogo. Repetir aqui as 3 fichas do telão (defeito achado, máquina consertada, noite revelada) com miniatura de 56 px e selo verde-água ou "ficou aberto".
- **Tela "Reconstrua a noite." (`#final`, y_final):** título, uma frase e 2 botões em 844 px de altura. Pôr a miniatura do caderno (96 px) e o resumo em 3 fichas.
- **Manual (e02, y_manual):** 163 palavras, 1.358 px de rolagem, e o botão "Entendi" só aparece em 1.345 px. O desenho do passo começa abaixo de três blocos de texto. Subir o quadro "Como jogar" para logo depois da frase do papel, tirar "Seu objetivo" (já está nos passos) e o bloco "Ritmo da partida" de dentro dos passos, e deixar "Entendi" fixo no pé (`position:sticky;bottom:0`).
- **Aba Atividades (y_atividades):** cada cartão tem nome, 2 salas, 2 frases e "Falta: …". São 6 cartões seguidos. Deixar aberto só o nome e as 2 miniaturas de sala (48 px, lado a lado, com uma seta entre elas); a frase entra ao tocar.
- **Minijogos (m_traj_1, m_falsa_1, m_cracha_1):** os 4 quadros da fita são retângulos cinza iguais; a "peça com luz de lado" é uma moldura laranja lisa; a escala de crachás é só pergunta e 3 botões. Usar as miniaturas reais: na fita, `S01`, `DESC_A` e a porta; na luz, o render de `GAL_A` com 5 iluminações (`gerar.html` já aceita luz por parâmetro); nos crachás, a miniatura da sala ao lado de cada resposta.
- **Livros de folhear (x02, x03):** a página aparece inclinada e o texto fica com cerca de 4 px de altura: não se lê nada, vê-se só que há linhas. O livro vale como objeto, não como leitura. Câmera mais de cima e mais perto (o livro ocupa metade de um quadro de 304×460) e título da página em letra 3 vezes maior.
- **`sala/index.html` sem código (02):** cartão com 2 botões e nenhum desenho; a entrada principal já tem.
- **Telão:** páginas Turma com 61% a 67% de área vazia (t03, t07, t11). Ver critério 8.

### Critério 4 · Paleta coerente — nota 9

Conferido: fundo azul-noite em celular, sala, telão, simulador e minijogos (`bancada.css` com `rgb(17,31,45)`); dourado para ação principal e aba ativa; verde-água só para "feito" (Saguão, pista no caderno, defeito achado, volta concluída); roxo só no professor; vermelho, verde e azul só nas etiquetas do dossiê; faixa do cartão de pista neutra na sala; "Entrar" desativado em cinza-azulado.

Ajustes que não reprovam:
- **Fundo do livro de folhear (x02):** retângulo marrom liso de 304×460 px, a maior mancha fora da paleta do jogo. No `museu/livro/index.html` em modo `embed`, fundo `#0f1c28` com luz radial, igual ao da peça.
- **Moldura laranja do minijogo da luz (m_falsa_1).** Sai com a troca pelo render da peça.
- **Peças muito saturadas no mapa:** M03 (vermelho vivo) e L05 (frascos coloridos). `filter:saturate(.8)` nas miniaturas do mapa, se incomodar.
- **"Encerrar a aula" (m00)** em vermelho-alaranjado: é o único botão de perigo, pode ficar.

### Critério 5 · Celular — nota 8

Medido em 390×844 e 360×740:
- **Estouro de largura: zero** nas 13 telas, nas duas larguras.
- **Alvos de toque: todos com 44 px ou mais.** Os três que medem menos têm área ampliada por `::after`: ponto da peça 26 px (+12 de cada lado), "?" do dicionário 22 px (+11), caixa de marcar de 28 px dentro de cartão inteiro tocável. Abas 155×46 (140×46 em 360), barra inferior 52 de altura, botões dos minijogos 48.
- **Cabeçalho fixo da sala: 74 px** (antes 140).
- **Mapa em 4 colunas:** cartões de 77×122 (69×122 em 360), miniatura de 48 px. Cabem 12 das 15 salas na primeira tela em 390×844 e **8 das 15 em 360×740**.
- **Lista de pistas:** cartão de 149×72 (134×72 em 360); cabem 14 por tela (12 em 360). Nenhum texto cortado em 390; 1 em 360 ("Câmera do Subsolo, os mostradores").

O que impede o 9:
- **Pontos da peça colados uns nos outros.** Contei os pares de pontos visíveis a menos de 44 px de distância na tela: Ateliê 16 pares (9 pontos), Câmara do tempo 14 (9), Área de descanso 8 (7), Conservação 7 (6), Central 7 (7), Relógios 6 (5), Fotografia 5 (5). Com a área de toque de 50 px, o dedo pega o vizinho. É a ação principal da sala ("toque nos pontos que brilham"); a lista salva, mas o toque na peça falha. Correção em `pontosDaPeca()` (game.js, linha 628): trocar o sorteio livre por distribuição por índice, `ang = (i + hashTxt(id)*0.4) / n * 2π` e `alt` em 3 faixas alternadas (`[0.2, 0.5, 0.8][i % 3]`), e mostrar no máximo 6 pontos por vez (os demais entram quando um é coletado). Melhor ainda, a tabela de posição por peça pedida na Parte B.
- **Mapa em 360×740:** o cabeçalho ocupa 141 px (o título quebra em 2 linhas) e a primeira sala começa em 353 px. Título em uma linha (`.game-head h2{font-size:1.2rem;white-space:nowrap}`), tirar o "Para onde você vai?" (o rótulo "Mapa do museu" basta) e baixar o cartão para 100 px com miniatura de 40 px: as 15 salas cabem em 4 linhas.
- **Letras abaixo de 12 px na tela inicial (03):** "UM MISTÉRIO A CADA VOLTA" com 10,9 px (`.eyebrow`) e "O TEMPO RECOMEÇA" com 9,3 px (dentro do relógio). Mínimo 12 px.
- **Manual:** "Entendi" a 1.345 px do topo, dois gestos de rolagem para sair. Ver critério 3.
- **Etiquetas do dossiê (09):** a etiqueta ocupa um terço da linha e o nome da pista quebra em 3 linhas ("Os 3 / mostradores"); cartões com 58, 69 e 101 px (85 em 360). Etiqueta embaixo do nome, em linha própria: todos os cartões ficam com 69 px.

### Critério 6 · Estabilidade — nota 8

Medido:
- Coletar pista: das 18, só as 2 tocadas mudaram, 3 px para baixo (o afundar). Nenhuma mudou de lugar.
- Relógio da sala: caixa de 138×62 e cabeçalho de 74 px em 5 leituras seguidas, com números de largura fixa.
- Máquina: mesma posição e altura nas 4 abas (topo 62, altura 720 em 390; topo 48, altura 644 em 360). Fichas de estado com 112 px em todas.
- Aviso "Pista guardada no caderno": de 723 a 764 px, barra a partir de 771. Não cobre mais a barra.
- Sinal do museu: 0 px de empurrão.
- Número do Caderno na barra igual ao conteúdo em jogo real (4 pistas coletadas, 4 itens, "Caderno 4"). A diferença vista antes era do script.
- Telão: 0 cartões fora da tela nas 10 páginas, em 1280 e 1920.

O que ainda falha:
- **Minijogo aberto por cima da etapa seguinte.** Com "Ler a escala de crachás" aberto, a volta acaba e a janela continua na frente da pausa (x01). No simulador, no fim da partida, 2 dos 6 celulares estavam com `#lcBancada` aberto por cima do resultado (t12, medido). `finishLoop()` (game.js, linha 939) e a troca de etapa do modo sala não fecham nada. Correção: no começo de `finishLoop()` e de `renderBetween()`, `document.querySelectorAll('#lcBancada[open], #lcDialog[open], #journalDialog[open]').forEach(d => d.close())`, com o aviso "A volta acabou. A pista fica para a próxima.".
- **Livro de folhear:** ao tocar em "Abrir o manual" o painel cresce 394 px (516 px na Conservação) e empurra o resto. Reservar o espaço: o botão já dentro de uma caixa de 460 px com a capa do livro desenhada, e o livro abre no mesmo lugar.
- **Cartões do dossiê com 3 alturas** (58, 69, 101 px): a lista muda de passo conforme a etiqueta. Ver critério 5.
- **Telão, mapa em 1280 px:** "Central de monitorament / o" quebra no meio da palavra e deixa esse cartão com 4 linhas (t02). Ver critério 8.

### Critério 7 · Linguagem — nota 9

Feito desde a rodada 3: "Como as voltas avançam?", "Eu libero · Você toca para passar de volta.", "Olhe de perto" no lugar de "Bancada de investigação", "Toque nas cenas na ordem em que aconteceram.", "Luz 1 de 5", "Faltou pouco", "Contem no celular como a noite acabou.", "Troca sozinha: sim / não", "Voltar" no lugar de "LAB-RA". O dicionário com "?" explica dossiê, fusível, disjuntor, patrocinador, restauro e outras 11 palavras em linguagem de conversa.

Retoques (não reprovam):

| Onde | Hoje | Sugestão |
|---|---|---|
| Aba Atividades, "Painel e Manual" | "Vá a Subsolo · Câmara do tempo ou Ateliê de descobertas para fazer a sua parte." | "Vá ao Subsolo ou ao Ateliê para fazer a sua parte." |
| Aba Atividades, papel da Central | "Você fica na Central de monitoramento, não mexe no museu, escuta as duas pessoas, marca o que já foi dito e confirma em voz alta." (25 palavras) | "Você fica na Central. Escute as duas pessoas e confirme em voz alta." |
| Aba Atividades | "Aparece quando o diagnóstico estiver anexado (aba Dossiê)." | "Aparece depois que você achar o defeito, na aba Dossiê." |
| Recusa do dossiê | "O dossiê não aceita: 1 de 2 sinais e 1 de 1 leitura normal. Faltam sinais. "O ponteiro de carga": contou, sinal. …" | "Ainda não. Você tem 1 sinal; precisa de 2 diferentes." e a lista por pista embaixo, uma por linha |
| s03 | "Sozinho (melhor)" | "Automático (melhor)": "sozinho" tem marca de gênero para quem lê como se fosse a pessoa |
| Telão, desfecho (t06, t07) | "já contaram" numa página e "JÁ REGISTRARAM / FALTA REGISTRAR" na outra | "Já contaram / Falta contar" nas duas |
| Campo de anotação (05) | "Suas hipóteses" | "Seus palpites" |
| Marca | "Mosaico Loop" na entrada (01); "MOSAICO" pequeno e "Loop" grande no telão; "MOSAICO · LOOP" e "Loop" em `sala/index.html` (02); só "Loop" na tela inicial (03) | "Mosaico Loop" por inteiro, numa linha, em todas |
| Frase do papel | "…da única pessoa do museu que lembra das voltas." no jogo sem turma e "…de quem lembra das voltas. O museu esquece. Você e o seu caderno, não." no jogo em turma | Uma frase só nas duas entradas |

### Critério 8 · Telão — nota 8

O que está certo (medido em 1280×720 e 1920×1080): 4 páginas durante a volta (Relógio, Mapa, Turma, Máquina), 2 no desfecho e 4 no resultado, com abas, setas, bolinhas e "Troca sozinha: sim / não"; botão "Tela cheia" sempre visível (140×46; 166×46 em 1920); nada fora da tela nem cortado, sem barra de rolagem; mapa com as 15 salas em grade 6×3; nome da sala com 24 px em 1280 (1,9% da largura); relógio gigante; cabeçalho mostra "pausa" na pausa; pausa, desfecho e conversa com miniatura grande (230 px em 1280).

O que impede o 9:
- **Letras de apoio abaixo de 1,3% da largura** (em 1920 px): andar embaixo do nome da sala 17,6 px (0,92%); "MOSAICO" 17,6 px; "Quem trouxe: …" e "2 pessoas" 21,8 px (1,13%); hora do fato ("Dias antes", "4:10") 22,3 px (1,16%); "Troca sozinha" 19,2 px (1,0%); abas 24 px (1,25%). Correção em `sala/sala.css`: `.tl-mapa .tl-sala small{font-size:clamp(.9rem,1.35vw,1.6rem)}`; na fita do tempo, hora e "Quem trouxe" com `font-size:1.4vw`; `.tl-aba{font-size:clamp(1rem,1.5vw,1.8rem)}`.
- **Palavra quebrada no mapa em 1280 px (t02):** "monitorament / o". `.tl-mapa .tl-sala b{overflow-wrap:normal;hyphens:auto;font-size:clamp(.9rem,1.7vw,1.9rem)}` com `lang="pt-BR"` no elemento, ou o nome curto "Central" no mapa.
- **Miniatura pequena dentro do cartão do mapa:** 52 px em 1280 e 78 px em 1920, num cartão de cerca de 185×180 (u_mapa_1920). De longe o que se vê é o nome. Miniatura com 45% da altura do cartão (`.tl-mapa .tl-sala img{height:9vh;width:auto}`).
- **Área vazia:** Turma 61% a 67%, resultado/Turma 55% a 63%, Máquina 24% a 39%, A noite 12% a 20% (medido). Na Turma, crescer os nomes para ocupar a tela (`font-size:clamp(1.4rem, calc(60vh / var(--linhas)), 4rem)`) e, quando o Saguão estiver vazio, usar as duas colunas. Na A noite, linhas com `flex:1` para encher a altura, com miniatura de 4 vw.
- **A noite (t09):** 6 de 10 linhas iguais, "Ninguém achou ainda", com o círculo tracejado. Juntar as vazias numa ficha só ("6 fatos ficaram no escuro") e dar o espaço aos fatos achados.
- **Simulador em 1280×720 (13, medido):** telão com 672×378 (52% da largura) e os celulares começam em 529 px, só o topo deles aparece. `#tl{width:min(100%,calc((100vh - 300px)*16/9))}` e celulares em escala (`zoom:.6`) para caberem embaixo; refazer a conta ao redimensionar a janela.

### Critério 9 · Entrada — nota 9

- `index.html` (01, e01, s04): "Participar com código" com campo e "Entrar" (320×52); cartão "Conduzir como professor" com botão roxo (320×58), cadeado e "Só o Professor tem a chave"; "Abrir telão" e "Simulador" lado a lado (155×52 cada); "Jogar sem turma" no fim. Tudo acima de 821 px, numa tela de 844. No PC os dois cartões ficam lado a lado.
- O roxo abre direto a área do professor (`sala/index.html?conduzir=1`, s03), com "Abrir com Google" e "Cancelar".
- Entrada do telão (14): miniatura, campo de código, "Abrir telão" e "Tela cheia".
- Simulador (13, e11): telão em cima, turma embaixo, "Tela cheia" no telão e no topo.

Ajustes que não reprovam:
- **Endereço do simulador:** existe em `sala/simulador/`; `cinco-minutos/simulador/` devolve 404. Se o padrão é entrar por "/simulador", falta uma página `simulador/index.html` que redirecione (o mesmo vale para `telao/`).
- **`sala/index.html` sem código (02):** tem os dois botões, mas não tem "Abrir telão" nem "Simulador", nem ícones. Acrescentar ou redirecionar para `index.html`.
- **Marca** escrita de três jeitos (critério 7).

---

## PARTE B · Peças 3D das 15 salas da história (Seção 5 das escalas)

Mínimos: Pertencimento, Dedução, Segurança narrativa e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8. Só passa quem atinge todos.

### O que mudou desde a rodada 3

- **Livro de folhear no Loop:** Ateliê ("Abrir o manual", 7 páginas) e Conservação ("Abrir o livro de registro", 9 páginas) têm o livro como segunda peça. Testado: arrastar vira a folha; página sem custo entra no caderno ao ser virada (6 páginas do manual em 2 viradas); página com custo fica fechada e aparece o botão "Ler … · 1 de energia", que gasta 1.
- **Três peças compostas:** `GAL_A` (máscara sobre base), `REL_A` (relógio de caixa alta + relógio de parede), `DESC_A` (sofá + cortiça de recados), com miniatura própria.
- **Dois minijogos de manuseio viraram pergunta de história:** "Abrir a caixa de banners" (qual caixa pesa demais para banner?) e "Ler a foto antiga do catálogo" (em que parte da peça procurar o número?).
- **Não mudou:** `pontosDaPeca()` (game.js, linha 628) continua espalhando os pontos por sorteio; `exposure="1.15"` fixo em todas as salas, nada reage ao apagão; o minijogo da luz continua sendo mexer o controle até aparecer; nenhuma peça foi recomprimida.

### Tabela de notas

| Sala | Peça (KB) | Pert. (9) | Ded. (9) | Seg. (9) | Cel. (9) | Amb. (8) | Din. (8) | Pers. (8) | Nov. (8) | Viab. (8) | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (839) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (156) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (820) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (421) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 (865) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | reprova (Nov. 7) |
| Sala de conservação | I01 (232) + livro | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | reprova (Amb. 6, Nov. 7) |
| Galeria especial | GAL_A (481) | 9 | 8 | 9 | 9 | 7 | 8 | 9 | 9 | 9 | reprova (Ded., Amb.) | reprova (Pert. 8, Ded. 8, Amb. 6) |
| Sala dos relógios | REL_A (804) | 9 | 9 | 9 | 9 | 7 | 8 | 8 | 8 | 8 | reprova (Amb.) | reprova (Pert. 8, Amb. 6) |
| Área de descanso | DESC_A (458) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) | reprova (Pert. 8, Amb. 5) |
| Pátio · Quadro externo | E01 (146) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) | igual |
| Sala das coleções | V12 (747) | 6 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Pert., Amb.) | reprova (Pert. 6, Ded. 7, Amb. 6) |
| Base da limpeza | L05 (1.020) | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 7 | reprova (Pert., Amb., Viab.) | igual |
| Sala dos sons | N07 (175) | 8 | 9 | 9 | 9 | 5 | 8 | 8 | 7 | 9 | reprova (Pert., Amb., Nov.) | igual |
| Sala da fotografia | N05 (569) | 9 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Amb.) | reprova (Ded. 7, Amb. 6) |

**Passam 7 de 15** (antes 5). **Reprovam 8.** Nenhuma nota caiu.

### As que passam

- **Câmara do tempo · T01.** Peça da história, cadeia de passos, muda com o defeito sorteado, recebe objetos de outras salas (4 consertos passam por ela). Ressalva: 9 pontos visíveis com 14 pares colados; "Os 3 mostradores" e "O ponteiro de carga" caem na base, não nos mostradores. 868 KB, acima da meta de 600.
- **Central de monitoramento · S01.** Lugar para explorar, cofre com código do mundo, fita em ordem (pede a história), escala de crachás (pergunta de história). Ressalva: os quadros da fita são retângulos; 839 KB.
- **Recepção · P01.** Mesa com luminária e papéis: serve a livro de visitas, contrato, cartão do Téo. Roleta, telefone e relógio de parede só em texto (Amb. 8, no limite).
- **Oficina técnica · M03.** Bancada com painel de ferramentas. 820 KB, no limite.
- **Oficina elétrica · E02.** Sala inteira com painéis. A miniatura continua difícil de ler.
- **Ateliê · L06 + livro (novo).** A cena já era boa; o manual agora se folheia, e virar a folha é o que registra a página. Ressalvas: o texto na folha não se lê no celular (cerca de 4 px; o caderno guarda o texto inteiro); a mesma mecânica aparece na Conservação, por isso Novidade 8 e não 9; 9 pontos com 16 pares colados na bancada.
- **Sala de conservação · I01 + livro (novo).** O livro de registro dá à sala um objeto com passos (abrir, virar, decidir se gasta energia para ler). Ambiente 8, no limite: o fichário continua um móvel solto e as 4 pistas fora do livro caem nele por sorteio.

### As que reprovam: motivo e saída

**Compostas na revisão 4, ainda abaixo do mínimo (3)**

- **Galeria especial · GAL_A.** A base agora existe e o objeto é o certo (Pert. 9). Reprova em Dedução: "Olhar a peça com luz de lado" é mexer o controle por 5 posições até aparecer; a posição certa é sorteada e a dica manda ir "uma posição por vez". É tentativa, não entendimento. Saída: antes da luz, uma pergunta ("uma peça de 300 anos mostraria o quê, com a luz de lado?"), e a luz só confirma. Reprova em Ambiente (7): máscara em cima de uma caixa lisa, sem vitrine, sem o quadro torto nem o rastro de gesso que as pistas citam; 3 pistas falam da base e caem nela só por sorte. Saída: usar a vitrine do acervo (V13) em volta, base com gaveta ou placa modelada, e pontos fixos na base.
- **Sala dos relógios · REL_A.** Dois relógios resolvem "um relógio diferente" e o pêndulo (Pert. 9). Ambiente 7: dois objetos lado a lado sobre um painel, para uma sala descrita como "dezenas de relógios"; 5 pontos com 6 pares colados no meio; nenhum passo encadeado. Saída: terceiro relógio do acervo (N03) e parede de fundo; "Pêndulo com a corda à mão" preso no pêndulo; recomprimir (804 KB).
- **Área de descanso · DESC_A.** Sofá e cortiça com alavancas. Pertencimento 8: o objeto central da sala na história é a porta de serviço (4 pistas), e ela não existe no modelo; cafeteira, visor repetidor, caixa de passagem e escultura de bronze também só em texto. Ambiente 7: o conjunto tem 3,8 m de largura e no celular cada parte ocupa cerca de 140 px. Saída: modelo novo (porta de serviço com caixa de passagem e mesa da cafeteira) ou a porta feita por código ao lado da cortiça, tirando o sofá.

**Precisam de modelo novo (5), sem mudança de peça desde a rodada 3**

- **Pátio · E01.** Quadro de parede interna: sem para-raios, cadeado, cabo grosso nem vidro; 9 das 16 pistas sem lugar. Pedido 1 (`Q01.glb`).
- **Sala das coleções · V12.** Cômoda de gavetas numa história de caixas, prateleira e o Téo no chão: pior correspondência das 15 (Pert. 6). A Dedução subiu para 9 com a pergunta da caixa. Pedido 2 (`D10.glb`).
- **Base da limpeza · L05.** Cesto de frascos solto, sem carrinho, armário nem balde com multímetro; 1.020 KB, a mais pesada (Viab. 7). Pedido 3 (`L08.glb`).
- **Sala dos sons · N07.** Rádio moderno com "PLAY" escrito, sem alto-falante de teste, metrônomo nem gravador; sem mecânica própria (Nov. 7). Pedido 4 (`N17.glb`), mais tocar a gravação com legenda.
- **Sala da fotografia · N05.** Câmera certa (Pert. 9) e a Dedução subiu para 9 com a pergunta da foto; reprova só em Ambiente (6): sem fotos na parede, varal, lâmpada do laboratório nem álbum, que são 7 das 10 pistas. Pedido 5 (`N18.glb`).

### `docs/PECAS-A-CONSEGUIR.md` cobre as reprovadas?

- **Cobre as 5 de modelo novo:** Pátio (1), Sala das coleções (2), Base da limpeza (3), Sala dos sons (4), Sala da fotografia (5), com prompt pronto.
- **Cobre só pela metade as 3 compostas.** A tabela "Composições e livro" anota o que falta em cada uma (pontos por sorteio, base lisa, REL_A acima de 600 KB, Descanso sem porta nem cafeteira), mas como observação, não como pedido. Faltam três itens:
  1. Área de descanso: pedido de modelo (porta de serviço com caixa de passagem, cafeteira e visor), com prompt.
  2. Galeria: base modelada ou vitrine (conferir a V13 do acervo antes de pedir).
  3. Sala dos relógios: terceiro relógio do acervo e parede; recompressão.
- **Não está em lugar nenhum:** a troca do minijogo da luz por pergunta com confirmação (é o que reprova a Galeria em Dedução).
- **Frase a atualizar:** "5 foram tratadas na revisão 4 sem modelo novo e esperam nova avaliação". Resultado: 2 passaram (Ateliê, Conservação) e 3 continuam reprovadas (Galeria, Relógios, Área de descanso).
- **Peso a corrigir na lista:** L05 mede 1.020 KB (a lista diz 1.045) e REL_A 804 KB (a lista diz 823).

### Correções de código que valem para todas

1. **Pontos no lugar certo e separados.** Tabela por peça em `pontosDaPeca()` (`PONTOS = { T01:{ maq_mostradores:'x y z', … } }`), com o sorteio só para pista sem lugar, e separação mínima de 44 px na tela. Começar por T01, L06, DESC_A, S01 e GAL_A (as de mais pares colados).
2. **Peça que reage.** No apagão, `exposure` de 1.15 para 0.45 e pontos acesos; na Câmara, brilho conforme o estado da máquina.
3. **Minijogo da luz** com pergunta antes do controle.
4. **Peso.** Recomprimir L05 (1.020 KB), T01, L06, S01, M03 e REL_A (804 a 868 KB) e V12 (747 KB) para a meta de 600 KB.
5. **Livro de folhear:** câmera mais de cima, título da página maior, fundo azul-noite no modo embutido.
