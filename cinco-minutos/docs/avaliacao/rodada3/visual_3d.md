# Loop · Rodada 3 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas. Nenhum arquivo do repositório foi alterado.

Fontes:
- 17 telas novas em `/tmp/roda/esc/r3/visB/` (geradas com `vis3.mjs`), todas olhadas.
- 46 telas em `/tmp/roda/esc/r3/vis_extra/`, regeradas nesta rodada com `extra_r3.mjs`, `tl_r3.mjs`, `mg_r3.mjs` e `est_r3.mjs` (entrada, manual, mapa em 390 e 360 px, sala, cofre, Máquina, caderno, professor, participante, minijogos, telão em todas as páginas e etapas, simulador, entrada no PC).
- Medições: auditoria de alvos de toque e de estouro em 390 e 360 px (dos scripts), deslocamento ao coletar pista (`est_r3.mjs`) e uma medição minha (`/tmp/pwt/medirB.mjs`: relógio, cabeçalho, cartões, aviso, abas, letras pequenas).
- Folha com as 15 miniaturas das salas da história: `/tmp/roda/esc/r3/visB/folha15.png`.
- Código lido: `game.js` (`LOOP_SALAS`, `sala()`, `pontosDaPeca()`, `renderClues()`), `loop-central.js` (`LC_MG`), `dados/pistas-v4.json`, `docs/ICONES-A-GERAR.md`, `docs/PECAS-A-CONSEGUIR.md`.

Limites desta avaliação:
- `mg2_r3.mjs` (resolver a fita da câmera) quebrou porque os nomes dos botões mudaram; a tela da fita foi vista, mas a resolução não foi testada.
- A cena vazia no minijogo da luz e o número do Caderno diferente do conteúdo (ver critérios 3 e 6) podem ser efeito do script de captura; precisam de conferência num aparelho.
- O padrão da entrada foi conferido contra a descrição do critério 9, não lado a lado com a tela do Comitê.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

### Tabela de notas

| # | Critério | Antes (rodada 2) | Agora | Passa? | Justificativa em uma linha (tela) |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 7 | **9** | sim | Botões, cartões de sala, pistas, abas, provas, fechar e barra inferior têm sombra dura, brilho e afundam (04, 06, 08, 10) |
| 2 | Ícones | 5 | **7** | não | Mapa, barra, Máquina e telão já usam miniatura 3D das peças; restam 24 emojis em ficha e 7 ícones copiados de outro jogo (06, 08, 09, 01, t09) |
| 3 | Muito visual | 6 | **8** | não | Entrada, início, pausa, mapa e Máquina ficaram visuais; manual, cofre, área do professor e 3 páginas do telão ainda são só texto (e02, e05, s03, t05, t06, t08) |
| 4 | Paleta coerente | 7 | **8** | não | Azul-noite, dourado e verde-água firmes em todas as telas; os 7 ícones copiados trazem laranja, ciano e rosa de outro jogo (01, 14, t04) |
| 5 | Celular | 6 | **8** | não | Nenhum alvo abaixo de 44 px e nada estoura a tela; mas o cabeçalho fixo come 140 px, só 4 salas cabem na primeira tela e em 360 px o texto vaza do cartão (04, 06, e03_360) |
| 6 | Estabilidade | 6 | **8** | não | Lista de pistas e sinal do museu não se mexem mais; restam o salto da Máquina na aba "Passar pista", o aviso em cima da barra e 7 px no relógio (10_trocar, 07) |
| 7 | Linguagem | 7 | **8** | não | Jogo do aluno em 2ª pessoa, curto e sem gênero; sobram "rodadas" e caixa alta na área do professor, palavras formais no telão final e nos minijogos (s03, t08, t11, m_tombo_2) |
| 8 | Telão | 4 | **8** | não | Páginas por tema com abas, setas e bolinhas, tela cheia sempre visível, nada cortado; letras de apoio pequenas demais e páginas de pausa e desfecho sem desenho (t02, t05, t09) |
| 9 | Entrada | 6 | **9** | sim | Participar com código, roxo com cadeado e "Só o Professor tem a chave", telão e simulador como botões; o roxo abre direto a área do professor (01, s03, s04) |

**Resultado: 2 de 9 critérios atingem 9. Média 8,1 (antes 6,0).**

### Critério 1 · Profundidade 3D — nota 9

Conferido no CSS: `.room:active`, `.clue:active`, `.lc-prova:active`, `.tl-aba:active` existem; a pista registrada desce 3 px e fica "afundada" (medido: só as 2 pistas tocadas mudaram, 3 px cada). As fichas de regra da Máquina ("2 sinais", "1 leitura normal") passaram a ter borda tracejada e sem sombra dura, então não parecem mais botão.

Ajustes para chegar a 10 (não reprovam):
- **Lista "O que você já sabe?" (s01):** as 2 linhas de pista são texto com ícone, sem cartão. Dar o molde das pistas: `border-radius:12px;background:linear-gradient(180deg,#294051,#172633);box-shadow:inset 0 1px 0 #ffffff2b,0 3px 0 #05090d;padding:8px 10px`.
- **Encaixes da foto (m_tombo_2):** os 6 espaços numerados são lisos. `box-shadow:inset 0 2px 6px #000a`.
- **Escolhas da área do professor (s03, `.dr-choice`):** têm borda, quase sem volume. `box-shadow:inset 0 1px 0 #ffffff2b,0 4px 0 #05090d` e `:active{transform:translateY(3px)}`.

### Critério 2 · Ícones — nota 7

O que está certo: o mapa do celular e do telão, a barra inferior (Máquina), os defeitos da Máquina, as Atividades, o Revelar, a pausa e a página Turma do telão usam a miniatura 3D da peça. As 6 miniaturas "de sala errada" da rodada 2 sumiram: cada sala mostra uma peça ligada ao nome.

**Provisórios que restam: 31**, todos declarados em `docs/ICONES-A-GERAR.md`:
- **24 emojis dentro de ficha** (lista B, itens 8 a 31).
- **7 ícones copiados do Mosaico Vila Ética** (lista A): participar, conduzir, telão, simulador, caderno, alvo, dupla.

Os que mais pesam, em ordem:
1. **Tipo de pista 📄 🔍 💬 ✋ (itens 18 a 21).** Aparecem em todo cartão da lista de pistas, em todas as salas (06): é o ícone mais repetido do jogo.
2. **Os 7 copiados da Vila Ética.** São a primeira coisa que se vê (01, 14) e ficam na barra fixa (Caderno) e no telão (t04, alvo). Têm outro estilo (plástico colorido) e outras cores.
3. **Mapa 🗺️ (item 8).** Fica na barra inferior, presente em todas as telas do jogo.
4. **Sinal 🚨, leitura normal ✅, manual 📘 (itens 10 a 12).** São as etiquetas de cor do dossiê (08, 09), o coração da dedução.
5. **Saguão 🚪 (item 9).** Ponto de partida de toda volta, no celular e no telão (04, t02).
6. **Fita do tempo do telão (itens 22 a 31).** Dez emojis de uma vez na página "A noite" (t09).
7. Menores: missão 🕵️, falta ajustar 🎛️, dois defeitos ⚙️, energia ⚡ em ficha, uma tentativa ☝️.

Fora da lista, a corrigir:
- **Miniatura E02 (Oficina elétrica)** parece uma laje cinza vista de cima; não se lê "gerador e fusíveis" (04b, t02). Regerar com a câmera mais baixa e mais perto dos painéis.
- **R02 e N05** ocupam menos de 35% da largura da miniatura (medido: 47 e 56 de 160 px). Já estão na lista de "novo enquadramento"; falta fazer.
- **Cenas dos minijogos** (caixa de banners, moldura, quadros da fita) são blocos chapados sem textura (m_c_esc_1, m_falsa_1, m_traj_1), bem abaixo da qualidade das peças. Usar render das peças reais: V11 na luz de lado, miniaturas das salas nos quadros da fita.

### Critério 3 · Muito visual — nota 8

Telas que passaram a ser visuais: entrada (01), início com relógio no topo e 4 botões com ícone (03), pausa com fichas e 5 bolinhas (12), Máquina com fichas em todas as abas (08, 10), Passar pista em 3 desenhos, caderno com miniatura da sala (11).

O que ainda é parede de texto:
- **Manual / "Antes de começar" (e02, e09, e10):** título, saudação, frase do papel, parágrafo de objetivo e só então o primeiro desenho, que cai abaixo da dobra. Juntar papel e objetivo num bloco só (2 linhas) e subir o quadro "Como jogar · 1 de 6" para a primeira tela; cada passo com 1 frase e 1 miniatura grande (96 px), não um parágrafo de 5 linhas.
- **Cofre do Braga (e05):** só texto e um campo. Pôr a miniatura do cofre (64 px) e trocar o campo único por 3 casas grandes de 56 px, uma por número.
- **Área do professor (s03):** dois cartões de texto em caixa alta. Ícone em cada escolha (relógio para "automático", mão/chave para "com minha liberação").
- **Descrição da sala (05):** frase "Gire a peça e toque nos pontos…" mais "Você pode ir a outra sala…" são dois blocos de texto colados; o segundo pode virar uma ficha pequena com ícone.
- **Minijogo da luz (m_falsa_1_achou):** na posição 4 a cena apareceu vazia, um retângulo liso. Conferir em aparelho; a peça precisa continuar visível em todas as posições.
- **Telão: pausa, desfecho e resultado (t05, t06, t08)** são título e uma frase num cartão vazio. Ver critério 8.

### Critério 4 · Paleta coerente — nota 8

O que está certo: fundo azul-noite e dourado iguais em celular, sala, telão, simulador e minijogos (`bancada.css` agora com fundo `rgb(17,31,45)`); verde-água com papel fixo de "já feito" (Saguão, pista registrada, defeito achado, missão cumprida, volta concluída no telão); roxo só no professor; etiquetas vermelho/verde/azul fixas no dossiê; Georgia só em título, medido.

O que falta:
- **Os 7 ícones copiados** trazem laranja vivo, ciano, rosa e amarelo (TV, celular, pessoas, alvo). São o único ponto fora da paleta em telas inteiras (01, 14, t04). Resolve junto com o critério 2.
- **Peças muito saturadas no mapa:** M03 (vermelho vivo) e L05 (frascos coloridos) saltam do conjunto (04b, t02). Aceitável por serem o objeto real; se incomodar, aplicar `filter:saturate(.8)` nas miniaturas do mapa.
- **Cor da faixa das pistas na sala (06):** azul (registro), branco (observação), dourado (relato). No dossiê as mesmas pistas usam vermelho, verde e azul. São dois códigos de cor diferentes para a mesma pista. Escolher um: ou a faixa da sala já mostra a cor da etiqueta, ou fica neutra e só o ícone indica o tipo.
- **"Entrar" desativado (01):** continua marrom-acinzentado, com cara de erro de cor. `.btn.primary:disabled{filter:grayscale(.6);opacity:.55}`.
- **Botão "Girando" do telão** em verde-água cheio (e11): o verde-água é "já feito"; para "ligado" usar o dourado das abas.

### Critério 5 · Celular — nota 8

Medido em 390 e 360 px, nas 13 telas da auditoria:
- **Estouro de largura: zero** (`scrollWidth` igual à largura em todas).
- **Alvos de toque: todos com 44 px ou mais de área.** Os três que medem menos têm área ampliada: ponto da peça `.hs` 26 px com `::after` de −12 px (50 px), "?" do dicionário `.lc-gi` 22 px com `::after` de −11 px (44 px), caixas de marcar de 28 px dentro de cartão inteiro tocável. Abas da Máquina 155×46, barra inferior 52 de altura, fechar 44.

O que impede o 9:
- **Cabeçalho fixo da sala com 140 px** (354×140 medido): 17% da tela em 844 px e 19% em 740 px. Relógio com 4 linhas. Reduzir para 2 linhas durante a volta: `.playing .clockbox small:last-child{display:none}` e "Volta 2 de 5 · 04:57" numa linha; meta: 84 px.
- **Mapa: só 4 das 15 salas na primeira tela em 390 px e 1 em 360×740.** Título, relógio, "Para onde você vai?" e cartão do Saguão ocupam 370 px; os cartões têm 151 a 168 px de altura e cada andar começa numa linha nova (a Galeria fica sozinha numa linha de 3). Correção: grade única de 4 colunas com a etiqueta do andar dentro do cartão (como o telão já faz), cartão de 84×104 px, miniatura de 48 px e sem a legenda: cabem as 15 salas em 4 linhas.
- **Em 360 px o texto sai do cartão:** "movimentações" passa das duas bordas do cartão "Sala das coleções" (cartão de 79 px) e "LAB-RA" quebra em 2 linhas (e03_360). `.room{min-width:0}` `.room small{overflow-wrap:anywhere;hyphens:auto}` e colunas iguais `grid-template-columns:repeat(3,minmax(0,1fr))` (hoje saem 94, 109 e 79 px).
- **Cartão de pista com 149×96 px:** cabem 8 por tela (06). Com o custo na mesma linha do ícone (`grid-template-columns:auto 1fr auto`) o cartão cai para 64 px e cabem 12.
- **Letras pequenas:** `.kicker` 10,9 px e os rótulos das fichas de estado da Máquina 11 px ("VOLTA", "DEFEITO"). Mínimo 12 px.

### Critério 6 · Estabilidade — nota 8

Medido:
- Coletar pista: das 18 pistas, só as 2 tocadas mudaram, 3 px para baixo (o "afundar"); nenhuma mudou de lugar. A regra `order:1` foi anulada.
- Rótulo da pista: textos curtos fixos ("1 ⚡", "grátis", "ainda não", "travada"), nenhum cortado.
- Sinal do museu: 0 px de empurrão ao aparecer.
- Fichas de estado da Máquina: 111 px de altura nas 4 abas.
- Telão: 0 cartões fora da tela e 0 cortados nas 10 páginas.

O que ainda pula:
- **Máquina, aba "Passar pista":** a janela encolhe de 717 para 574 px e desce de 63 para 135 px (em 360 px: de 56 para 83). As 4 abas mudam de lugar debaixo do dedo. Fixar: `#lcDialog{height:min(717px,calc(100dvh - 120px));top:63px}` ou `min-height` igual nas 4 abas.
- **Aviso "Pista guardada no caderno" em cima da barra:** aviso em 789 a 830 px, barra a partir de 771 px (07, s01). Cobre o botão Máquina enquanto dura, e continua por cima quando a Máquina abre (08, m10). `#toast{bottom:calc(52px + 28px + env(safe-area-inset-bottom))}`.
- **Relógio:** caixa de 126 px na escolha de sala e 119 px durante a volta (cabeçalho 150 → 140). `.clockbox{min-height:126px}` ou status com `min-height:2.4em`.
- **Minijogo da luz:** cena some na posição 4 (se confirmado em aparelho, é piscar de conteúdo).
- **Número do Caderno na barra diferente do conteúdo:** barra "Caderno 7" com caderno "ainda está vazio" (e08). Provável efeito do script (pistas dadas direto à Máquina); conferir se em jogo real os dois números andam juntos.

### Critério 7 · Linguagem — nota 8

O que está certo: "Nesta atividade você vive o papel da única pessoa do museu que lembra das voltas."; sempre "Volta"; "caderno" para o que é do jogador e "dossiê" só na Máquina; "Professor" em todo lugar; "Travou? Você pode pedir até 3 dicas. Pedir dica não tira ponto."; "você ainda não sabe"; texto de projeto ("Bancada experimental") saiu da tela inicial.

Trocas que faltam:

| Onde | Hoje | Sugestão |
|---|---|---|
| s03 (`sala/firebase-room.js`, linha 130) | "COMO AS RODADAS DEVEM AVANÇAR?" | "Como as voltas avançam?" (sem caixa alta) |
| s03 | "AUTOMATICAMENTE · RECOMENDADO / O jogo avança quando todos terminam." | "Sozinho (melhor) · O jogo anda quando a turma termina." |
| s03 | "COM MINHA LIBERAÇÃO / A Sala avisará quando for hora de avançar." | "Eu libero · Você toca para passar de volta." |
| minijogos | "BANCADA DE INVESTIGAÇÃO" | "Olhe de perto" |
| m_tombo_2 | "Escolha ou arraste um fragmento e encaixe pela continuidade da imagem. As posições são numeradas por linha, de cima para baixo." | "Toque num pedaço e depois no lugar dele." |
| m_traj_1 | "Toque nos elementos na ordem correta." | "Toque nas cenas na ordem em que aconteceram." |
| m_falsa_1 | "Posição 4 de 5 · a luz ainda não mostra nada de novo." | "Luz 4 de 5 · ainda não apareceu nada." |
| t08 | "Mínimo" / "O caderno conservou o que foi descoberto." | "Faltou pouco" / "O caderno guardou o que vocês descobriram." |
| t11 | "Previsão", "Intervenção" | "O que ia acontecer", "O conserto" |
| t06 | "Registrem o desfecho no celular." | "Contem no celular como a noite acabou." |
| 05 | "Você pode ir a outra sala quando quiser." | bom; manter |
| 01, 03, telão | "MOSAICO" pequeno em cima e "Loop" grande | conferir com o autor se a marca deve aparecer inteira numa linha, "Mosaico Loop", como nos outros jogos |
| 03 | "LAB-RA" no topo | é nome de projeto; no jogo do aluno pode sair ou virar "Voltar" |

### Critério 8 · Telão — nota 8

O que está certo (medido em 1280×720): 4 páginas durante a volta (Relógio, Mapa, Turma, Máquina), 2 no desfecho e 4 no resultado, com abas, setas, bolinhas e troca automática que o professor trava ("Parado/Girando"); botão "Tela cheia" sempre visível, 46 px; nenhum cartão fora da tela nem cortado; mapa com as 15 salas em grade 6×3 com miniatura 3D e contador; relógio gigante; entrada com QR code grande.

O que impede o 9:
- **Letras de apoio que não se leem de longe.** Nome da sala no mapa: 19,2 px em 1280 (1,5 vw). Andar embaixo do nome ("TÉRREO", "1º ANDAR"): cerca de 11 px. "Quem trouxe: …" na página A noite: cerca de 13 px (t09). Para sala de aula: nome `clamp(1.2rem,1.9vw,2rem)`, andar e "Quem trouxe" no mínimo 1,3 vw.
- **Salas vazias apagadas demais (t02):** fundo cinza e nome cinza; no projetor some. `.tl-sala.vazia{opacity:1;filter:saturate(.7)}` com nome em `#dfe7ee`.
- **Páginas sem desenho:** pausa "O tempo voltou." (t05), "Desfecho" (t06) e resultado "Mínimo" (t08) são um título e uma frase num cartão vazio. Pôr a miniatura da máquina (T01, 18 vw) na pausa, com as 5 bolinhas de volta maiores; no resultado, 3 fichas grandes (defeito achado? máquina consertada? troca revelada?) com ✓ verde-água ou cadeado.
- **Página Turma (t03, t10):** metade direita vazia ("No Saguão · 0"). Quando o Saguão estiver vazio, usar a tela inteira para a turma, com nomes maiores.
- **Página Perguntas (t11):** 8 barras iguais sem ícone e com palavras formais (ver critério 7).
- **"Parado/Girando":** rótulo pouco claro. "Troca sozinha: sim / não".
- **Relógio do cabeçalho na pausa (t05):** mostra "VOLTA 1 DE 5 · 00:30" durante a pausa; esconder ou mostrar "pausa".
- **Simulador em 1280 px (13):** o botão "Telão em tela cheia" cai para a segunda linha e o telão fica com 670 px de largura. `.sim-top{flex-wrap:nowrap}` com rótulos mais curtos, e telão com `width:min(100%,calc((100vh - 260px)*16/9))`.

### Critério 9 · Entrada — nota 9

- `index.html` (01, e01, s04): "Participar com código" com campo e "Entrar"; cartão "Conduzir como professor" com botão roxo, cadeado e "Só o Professor tem a chave"; "Abrir telão" e "Simulador" como dois botões lado a lado, tudo na primeira tela em 390×844; "Jogar sem turma" e "Episódio visual" no fim. No PC os dois cartões ficam lado a lado.
- O roxo vai direto para a área do professor (`sala/index.html?conduzir=1`, s03), sem a tela "Abrir uma mesa".
- `sala/index.html` sem código (02) agora tem o mesmo par de botões e a mesma paleta.
- Simulador (13, e11): telão em cima, turma embaixo, botão de tela cheia no telão e no topo; quadros dos participantes legíveis em 1920 px.

Ajustes que não reprovam: "Entrar" desativado com cor estranha (critério 4); área do professor em caixa alta e com "rodadas" (critério 7); a tela 02 não tem "Abrir telão" nem "Simulador" (se alguém cair nela, fica sem esses dois caminhos: acrescentar ou redirecionar para `index.html`).

---

## PARTE B · Peças 3D das 15 salas da história (Seção 5 das escalas)

Mínimos: Pertencimento, Dedução, Segurança narrativa e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8. Só passa quem atinge todos.

### O que mudou desde a rodada 2

- As 15 salas estão em `LOOP_SALAS` (`game.js`, linha 144) com **uma peça fixa por sala**. No Loop, `sala()` ignora o sorteio A/B/C e apaga `livro` e `capa`, então ninguém mais cai numa versão reprovada por sorteio, e também **nenhuma sala usa o livro de folhear**.
- 11 salas trocaram de peça. Sumiram besouro, borboletas, formigas, fósseis, galho, microscópio, tricerátops e relógio de pulso.
- Não mudou: `pontosDaPeca()` continua espalhando os pontos por sorteio (`hashTxt(clue.id)`) em volta do centro do modelo. O modelo continua parado (`exposure="1.15"` fixo, nada apaga no apagão). Não existe nenhuma composição para o Loop em `museu/pecas-compostas.mjs` (só VEI_A/B/C).
- Os dois minijogos de manuseio continuam: "Abrir a caixa de banners" (deslizar a faixa, mover o fundo, abrir a tampa) e "Remontar a foto antiga" (6 pedaços pela continuidade da imagem).

### Tabela de notas

| Sala | Peça | Pert. (9) | Ded. (9) | Seg. (9) | Cel. (9) | Amb. (8) | Din. (8) | Pers. (8) | Nov. (8) | Viab. (8) | Resultado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 máquina do tempo | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** |
| Central de monitoramento | S01 console de telas | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** |
| Recepção | P01 mesa de recepção | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** |
| Oficina técnica | M03 bancada de ferramentas | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** |
| Oficina elétrica | E02 central de energia | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** |
| Ateliê de descobertas | L06 bancada de projetos | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 7 | 8 | reprova (Nov.) |
| Sala de conservação | I01 fichário | 9 | 9 | 9 | 9 | 6 | 8 | 9 | 7 | 9 | reprova (Amb., Nov.) |
| Galeria especial | V11 máscara de pedra | 8 | 8 | 9 | 9 | 6 | 8 | 9 | 9 | 9 | reprova (Pert., Ded., Amb.) |
| Sala dos relógios | R02 relógio de pêndulo | 8 | 9 | 9 | 9 | 6 | 8 | 8 | 8 | 9 | reprova (Pert., Amb.) |
| Área de descanso | V41 sofá | 8 | 9 | 9 | 9 | 5 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Pátio · Quadro externo | E01 quadro elétrico | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) |
| Base da limpeza | L05 cesto de produtos | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 7 | reprova (Pert., Amb., Viab.) |
| Sala dos sons | N07 rádio portátil | 8 | 9 | 9 | 9 | 5 | 8 | 8 | 7 | 9 | reprova (Pert., Amb., Nov.) |
| Sala da fotografia | N05 câmera de tripé | 9 | 7 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Ded., Amb.) |
| Sala das coleções | V12 cômoda | 6 | 7 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Pert., Ded., Amb.) |

**Passam 5 de 15** (antes 2): Câmara do tempo, Central de monitoramento, Recepção, Oficina técnica, Oficina elétrica. **Reprovam 10.**

### As que passam (com ressalvas)

- **Câmara do tempo · T01.** Peça da história, cadeia de passos, muda com a causa sorteada, recebe objetos de outras salas. Ressalva: os pontos "Os 3 mostradores", "O ponteiro de carga" e "O botão vermelho" caem por sorteio na base da máquina (05), não em cima dos mostradores. 889 KB.
- **Central de monitoramento · S01.** Lugar para explorar, cofre com código justificado no mundo (311: mostradores, luzes, botões), fita da câmera em ordem (exige a história, não destreza), escala de crachás. Ressalva: o cofre não existe no modelo. 860 KB.
- **Recepção · P01.** Mesa com luminária e papéis sobre base: serve a livro de visitas, listas, cartão do Téo, e-mails. Roleta, telefone e relógio de parede ficam só em texto (por isso Amb. 8, no limite).
- **Oficina técnica · M03.** Bancada com painel de ferramentas: serve a gaveta de fusíveis, armário e bilhetes. 840 KB, no limite.
- **Oficina elétrica · E02.** Sala inteira com painéis: lugar para explorar. Ressalva: a miniatura não se lê (critério 2).

### As que reprovam: motivo e saída

**Resolvem sem modelo novo (5)**

- **Ateliê · L06.** A cena é ótima; reprova só em Novidade: 6 páginas do Manual da Câmara viram 6 pontos iguais aos de qualquer sala. Saída: abrir as páginas do manual no livro de folhear (capa "Manual da Câmara"). Hoje `sala()` faz `delete r.livro`; é preciso permitir o livro como segunda peça da sala (botão "Abrir o manual" ao lado da bancada).
- **Sala de conservação · I01.** O fichário é do lugar (registros, laudos, ata), mas é um móvel solto e as 17 pistas são papéis espalhados por sorteio em volta dele. Saída: o livro de folhear como peça (já existe em `PECAS_ALT.conservacao`, capa "Livro do Acervo"), que sobe Amb. para 8 e Nov. para 9; ou gavetas que abrem (3 gavetas = 3 grupos de papéis).
- **Galeria especial · V11.** A máscara é a peça certa, mas está solta no ar: 5 das 14 pistas falam da base ("A base, de perto", "Papel atrás da base", "A base da peça principal") e não existe base. O minijogo da luz é mexer um controle até aparecer: tentativa, não dedução. Saída: compor V11 + V13 (vitrine) ou pedestal em `pecas-compostas.mjs` (GAL_A), com os pontos da base na base; na luz, perguntar antes "o que uma peça de 300 anos deveria mostrar?" e só então confirmar com a luz.
- **Sala dos relógios · R02.** Um relógio só; as pistas falam de "os relógios da sala", "os relógios elétricos" e "um relógio diferente". Saída: compor R02 + R01 (REL_A) e pôr "Pêndulo com a corda à mão" no pêndulo.
- **Área de descanso · V41.** Um sofá solto; nada de porta de serviço, cafeteira, visor repetidor ou recados. Saída: compor V41 + C02 (cortiça de recados com alavancas) (DESC_A).

**Precisam de modelo novo (5)**

- **Pátio · E01.** É um quadro elétrico, mas de parede interna: sem para-raios, sem cadeado vermelho, sem cabo grosso, sem vidro. 9 das 24 pistas ficam sem lugar. Pedido 1 (`Q01.glb`).
- **Sala das coleções · V12.** Uma cômoda de gavetas; a história é de caixas, prateleira, etiqueta de caixa vazia e o Téo no chão. É a pior correspondência das 15. Além disso, "Abrir a caixa de banners" é manuseio (deslizar, mover, abrir): trocar por pergunta de história ("qual caixa pesa demais para ser banner?"). Pedido 2 (`D10.glb`).
- **Base da limpeza · L05.** Cesto de frascos solto, sem o carrinho, o armário com bilhete e o balde com multímetro; e com 1.045 KB é a peça mais pesada das 15, acima da meta de 600 KB. Pedido 3 (`L08.glb`).
- **Sala dos sons · N07.** Rádio moderno solto com "PLAY" escrito; faltam alto-falante de teste, metrônomo e gravador; a sala não tem mecânica própria. Pedido 4 (`N17.glb`), mais tocar a gravação de verdade com legenda.
- **Sala da fotografia · N05.** A câmera é da história, mas está solta (sem fotos na parede, varal, lâmpada do laboratório) e "Remontar a foto" é quebra-cabeça de encaixe por imagem. Trocar o minijogo por comparação (onde está a rachadura? que número está na base?). Pedido 5 (`N18.glb`).

### A lista `docs/PECAS-A-CONSEGUIR.md` cobre as reprovadas?

- **Cobre as 5 que precisam de modelo novo:** Pátio (1), Sala das coleções (2), Base da limpeza (3), Sala dos sons (4), Sala da fotografia (5). O item 6 (roleta da Recepção) é opcional e a Recepção já passa.
- **Não cobre as outras 5** (Ateliê, Conservação, Galeria, Relógios, Área de descanso), porque não pedem modelo novo: pedem composição de peças que já existem e o livro de folhear. Esse trabalho não está anotado em lugar nenhum; convém acrescentar à lista uma seção "Composições e livro a fazer (sem modelo novo)".
- **Frase a corrigir na lista:** "Dez salas já foram trocadas por peças que existem" dá a entender que as dez estão resolvidas; cinco delas ainda reprovam.

### Correções de código que valem para todas

1. **Pontos no lugar certo.** Trocar o sorteio de `pontosDaPeca()` por tabela por peça (`PONTOS = { T01:{ maq_botao:'x y z', … } }`), caindo no sorteio só para pista sem lugar definido. Começar por T01, S01 e V11.
2. **Peça que reage.** No apagão, baixar `exposure` de 1.15 para 0.45 e acender os pontos; na Câmara, mudar o brilho dos pontos conforme o estado da máquina.
3. **Composições** GAL_A (V11 + V13), REL_A (R02 + R01), DESC_A (V41 + C02) em `museu/pecas-compostas.mjs`.
4. **Livro no Loop.** Permitir `livro` em `LOOP_SALAS` para Conservação e para o manual do Ateliê.
5. **Peso.** Recomprimir L05 (1.045 KB), T01, L06, S01 e M03 (840 a 890 KB) para a meta de 600 KB.
6. **Dois minijogos de manuseio** (caixa e foto) trocados por perguntas que exigem a história.
