# Loop · Rodada 5 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas. Nenhum arquivo do repositório foi alterado.

**Nota geral:** Parte A com 5 de 9 critérios no mínimo (média 8,6; antes 8,4). Parte B com 7 de 15 salas aprovadas (igual à rodada 4; a Galeria agora reprova em um critério só). As escalas ainda **não** passaram.

Fontes:
- 17 telas novas em `/tmp/roda/esc/r5/visB/` (`vis3.mjs`).
- 108 telas em `/tmp/roda/esc/r5/visB_extra/`: entrada, manual, mapa, sala, cofre, Máquina (4 abas), caderno, professor, participante, 5 minijogos em 390 e 360 px, livros de folhear, pausa, resultado, telão em todas as páginas (1280 e 1920 px), simulador em 1280, 1366 e 1920 px, entrada no PC, entrada do Mosaico Vila para comparar lado a lado.
- 15 capturas das peças dentro da sala, com os pontos, em `/tmp/roda/esc/r5/visB_pecas/`.
- Folhas de contato (todas olhadas) em `/tmp/roda/esc/r5/folhasB/`.
- Scripts em `/tmp/roda/esc/r5/pwB/`. Reaproveitados da rodada 4 com a pasta trocada: `meu`, `meu360`, `extra_r3`, `medirB`, `est_r3`, `livro`, `r4`, `tl_r3`, `tl2`, `pecas`, `shots2`, `txt`. Novos: `mg5.mjs` (minijogos, no lugar de `mg_r3` e `mg2_r3`, que quebraram porque a fita virou pergunta e a luz ganhou uma pergunta antes), `fim5.mjs` (simulador, selo da pista, livro), `tl5q.mjs` (telão: letra mínima, área ocupada, sobra dentro do cartão), `salas.mjs`, `vila.mjs`, `turma12.mjs`.

Limites desta avaliação:
- Tudo rodou em Chrome com renderização por software; nenhum aparelho real.
- O telão foi testado com 6 e com 12 participantes (o máximo do simulador). Turma de 30 ou 40 não foi testada.
- A tela cheia de verdade (API do navegador) não abre no modo sem janela; conferi só que o botão existe, o tamanho dele e que a API está ligada.
- No `fim5.mjs` o arrasto não virou a folha do livro; a medida das viradas vem do `livro.mjs`, onde virou.
- A entrada foi comparada lado a lado com a do Mosaico Vila (mesmo padrão), não com a do Comitê, que não está neste repositório.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

### Tabela de notas

| # | Critério | Antes (rodada 4) | Agora | Passa? | Justificativa em uma linha (tela) |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões, cartões, abas, pistas, capa do livro e fichas do resultado têm sombra dura, brilho e afundam (a1, a2, c1) |
| 2 | Ícones | 8 | **8** | não | Continuam 6 emojis em ficha (porta do Saguão, raio, detetive, livro azul, dedo, círculo tracejado); 3 deles em telas de todo instante (04, 06, 08) |
| 3 | Muito visual | 8 | **8** | não | Resultado, manual, Atividades e pausa ganharam desenho; os 5 minijogos "Olhe de perto" continuam sem imagem nenhuma, e o da luz mostra um quadro-negro, não a peça (b3, b4) |
| 4 | Paleta coerente | 9 | **9** | sim | Azul-noite, dourado e verde-água em todas as telas; sobram a mesa marrom do livro e a moldura laranja do minijogo da luz (b5, b4) |
| 5 | Celular | 8 | **8** | não | Nada estoura, todo alvo tem 44 px, pontos separados e as 15 salas cabem em 360 px; mas o selo da pista coletada aparece cortado, "✓ no cade…", nas duas larguras (z_selo_390) |
| 6 | Estabilidade | 8 | **8** | não | Minijogo fecha no fim da volta e o dossiê tem altura única; o livro da Conservação ainda empurra a tela 70 px ao abrir e uns 60 px ao virar folha (livro.log) |
| 7 | Linguagem | 9 | **9** | sim | Os 9 retoques pedidos foram feitos; marca "Mosaico Loop" por inteiro e frase do papel igual nas duas entradas |
| 8 | Telão | 8 | **9** | sim | Nenhuma letra abaixo de 1,35% da largura nas páginas do jogo, palavra inteira no mapa, miniatura maior, tela cheia sempre visível (t1 a t4) |
| 9 | Entrada | 9 | **9** | sim | Mesmo desenho do Mosaico Vila: Participar com código, roxo com cadeado e "Só o Professor tem a chave", telão e simulador; `/simulador` agora existe (d1) |

**Resultado: 5 de 9 critérios atingem 9 (1, 4, 7, 8, 9). Média 8,6.** Nenhuma nota caiu.

### Antes | agora | motivo

| # | Antes | Agora | Motivo |
|---|---|---|---|
| 1 | 9 | 9 | Mantido |
| 2 | 8 | 8 | Ícone de tipo de pista subiu para 32 px em ficha clara e o tracejado aparece uma vez só; os 6 provisórios continuam |
| 3 | 8 | 8 | Quatro telas resolvidas (resultado, "Reconstrua a noite", manual, Atividades); os minijogos ficaram só com texto e botão |
| 4 | 9 | 9 | Mantido |
| 5 | 8 | 8 | Pontos colados, mapa em 360 px, letra de 9 px e "Entendi" longe: tudo resolvido; apareceu o selo cortado |
| 6 | 8 | 8 | Minijogo preso e as 3 alturas do dossiê resolvidos; o livro da Conservação ainda pula |
| 7 | 9 | 9 | Mantido, com os retoques feitos |
| 8 | 8 | 9 | Letras de apoio, palavra quebrada, miniatura do mapa e as 6 linhas vazias da fita: tudo resolvido |
| 9 | 9 | 9 | Mantido; `/simulador` e a entrada de `sala/index.html` foram completados |

### Critério 1 · Profundidade 3D — nota 9

Conferido no CSS: 22 regras `:active` em `style.css`, 9 em `sala/sala.css`, 2 em `bancada.css`. A capa do livro (`.livro-capa`) afunda 3 px; as fichas do resultado e de "Reconstrua a noite" têm sombra dura.

Ajustes para o 10 (não reprovam):
- **Janela do minijogo (b3):** o cartão de fora é liso, sem brilho em cima. `box-shadow:inset 0 1px 0 #ffffff22,0 6px 0 #05090d` em `.lc-banc`.
- **Linhas "As 3 provas no seu caderno" (c1):** ficha de 28 px tão escura que não se vê o que é. Ver critério 2.

### Critério 2 · Ícones — nota 8

O que está certo: mapa, barra inferior, entrada, abas, defeitos, Atividades (miniaturas das duas salas com 48 px), Revelar, pausa, caderno, resultado, telão e tipos de pista usam miniatura 3D renderizada das peças do projeto. Nenhum ícone de outro jogo. O ícone de tipo de pista tem agora 32 px em ficha clara.

**Provisórios que restam: 6**, os mesmos da lista B de `docs/ICONES-A-GERAR.md` (contados na tela pelo censo de emoji dentro de ficha). A lista do documento bate com a tela.

| # | Emoji | Onde | Peso |
|---|---|---|---|
| 1 | 🚪 Saguão | Primeiro cartão do mapa do celular, em toda volta, e do mapa do telão | Alto: é o ponto de partida e o único cartão do mapa sem miniatura |
| 2 | ⚡ energia | 8 vezes numa lista de pistas, ficha Energia da Máquina, linha de energia da sala | Alto pela repetição; ao lado de número o padrão aceita como apoio |
| 3 | 🕵️ missão | Topo do Dossiê, toda vez que a Máquina abre | Alto: ficha em destaque |
| 4 | 📘 manual | Etiqueta das pistas de manual no dossiê e no caderno | Médio: é a única das 4 etiquetas sem miniatura |
| 5 | ☝️ uma tentativa | Aba Revelar, terceira ficha | Médio: uma tela só |
| 6 | círculo tracejado | Telão, "A noite": uma ficha só ("5 fatos ficaram no escuro") | Baixo: caiu de 6 aparições para 1 |

**Depende de arte nova:** os 6 acima (não há peça no acervo que sirva) e a lista C do documento (`E02`, `DESC_A`, os 4 tipos de pista, os 4 da entrada). Sem os 6, este critério não chega ao 9.

**Corrigível sem arte nova (CSS ou novo enquadramento em `gerar.html`):**
- **Fichas de "As 3 provas no seu caderno" (c1, resultado):** 28 px, escuras, não se lê. Subir para 40 px com fundo claro (`background:#3a5568`), como foi feito com os tipos de pista.
- **Tipos de pista (a1):** melhoraram, mas fichário verde, câmera e gramofone ainda são duas manchas (verde e marrom) em 16 cartões. Novo enquadramento mais perto.
- **`E02` e `DESC_A` no mapa:** continuam laje cinza e dois traços (04). Reenquadrar no painel de fusíveis e na cortiça.
- **Cadeado do professor:** emoji 🔒; o Mosaico Vila usa cadeado em render 3D. É apoio permitido; fica como sugestão.

### Critério 3 · Muito visual — nota 8

Resolvido desde a rodada 4: resultado no celular com 3 fichas e miniaturas (c1); "Reconstrua a noite" com o caderno e 3 fichas; manual em 6 passos desenhados, 104 palavras, "Entendi" fixo no pé (visível em 714 px, antes 1.345); Atividades com as duas salas em miniatura e uma seta; leitura do livro em letra de tela embaixo do livro; `sala/index.html` com ícone, telão e simulador.

O que ainda é texto ou desenho errado:
- **Minijogos "Olhe de perto" (b3):** crachás, fita da porta, caixa de banners, foto do catálogo e "Antes de acender a luz" são título, pergunta e 3 botões; medido: 0 imagens em cada um, 42 a 55 palavras. O nome manda olhar de perto e não há nada para olhar. **Sem arte nova:** pôr no topo da janela a miniatura que já existe (`S01` nos crachás e na fita, `V12` na caixa, `N05` na foto, `GAL_A` na luz), com 96 px, e uma ficha de 32 px ao lado de cada resposta quando houver (as 3 pessoas da fita não têm retrato: aí só a miniatura da sala).
- **Minijogo da luz (b4):** a "peça" é um quadro verde de moldura laranja, não a máscara da Galeria; e de "Luz 1" a "Luz 5" a imagem quase não muda, só a frase. **Sem arte nova:** trocar a cena pela miniatura `GAL_A` com brilho por CSS (`filter:brightness()` e um reflexo em gradiente que anda com o controle). Com render de verdade em 5 luzes (`gerar.html` aceita luz por parâmetro) fica melhor, e também não pede modelo novo.
- **Livro de folhear (b5):** o título da página agora se lê; o corpo da página continua ilegível (a caixa de leitura embaixo resolve). O texto da caixa repete o título ("Manual da Câmara, página 1" e logo abaixo "Manual da Câmara, página 1: …"). Tirar o título de dentro do texto.
- **Telão:** Desfecho final ocupa 34% da área, "Para conversar" 39% e o Relógio 51% (medido). Ver critério 8.
- **Manual, passo 1 (b1):** no mapinha, "Recepçã / o" e "monitora / mento" quebram no meio. `hyphens:auto` ou os nomes curtos "Recepção" e "Central".

### Critério 4 · Paleta coerente — nota 9

Conferido: fundo azul-noite em celular, sala, minijogos (`rgb(17,31,45)`), telão e simulador; dourado para ação principal e aba ativa; verde-água só para "feito"; roxo só no professor; vermelho, verde e azul só nas etiquetas do dossiê.

Ajustes que não reprovam:
- **Livro de folhear (b5):** o fundo da página do livro já é azul-noite (`rgb(15,28,40)`), mas a mesa da cena 3D é marrom e enche 306×460 px. Trocar a cor do material da mesa em `museu/livro` para `#14222e`.
- **Moldura laranja do minijogo da luz (b4).** Sai com a troca pela peça.
- **Janela do minijogo:** fundo `#162226` e borda `#927b59`, um tom mais verde que o resto. Alinhar com `#111f2d`.

### Critério 5 · Celular — nota 8

Medido em 390×844 e 360×740:
- **Estouro de largura: zero** em todas as telas, nas duas larguras.
- **Alvos de toque: todos com 44 px ou mais.** Ponto da peça 26 px com 12 de folga de cada lado (50), "?" do dicionário 22 + 11, caixa de marcar de 28 dentro de cartão inteiro tocável. Abas 155×46, barra inferior 52, botões dos minijogos 48 a 56, controle da luz 44.
- **Pontos da peça: 0 pares a menos de 44 px nas 15 salas** (antes até 16 pares no Ateliê). A separação funciona.
- **Mapa: as 15 salas cabem inteiras na primeira tela, em 390 e em 360** (antes 12 e 8). Cartão de 78×106 (70×106), miniatura de 40 px.
- **Lista de pistas:** cartão de 149×82 (134×82); cabem 14 por tela (12 em 360).
- **Letra mínima: 12 px** em todas as telas do jogo (a tela inicial foi corrigida).

O que impede o 9 (tudo corrigível só com CSS):
- **Selo "✓ no caderno" cortado.** Em toda pista coletada o selo aparece como "✓ no cade…": a caixa tem 90 px e o texto pede 96 (em 360 px, 75 contra 96). É a tela mais usada do jogo e o corte aparece a cada toque. Trocar o texto por "✓ guardada" ou `font-size:.6875rem;letter-spacing:0;padding-inline:4px` no selo, ou esconder a ficha do tipo quando a pista já está no caderno.
- **Em 360 px:** 1 nome de pista cortado ("Câmera do Subsolo, os mostradores") e a janela do minijogo da luz passa da altura da tela e rola por dentro (651 px). Cena com `height:clamp(110px,26vh,250px)`.
- **Rótulo "OLHE DE PERTO" dos minijogos: 11,5 px** (`.lc-banc .kicker{font-size:.72rem}`). Subir para `.75rem`.
- **Aviso em cima do botão:** "A volta acabou. A pista fica para a próxima." cobre a parte de baixo de "Escolher a próxima sala" por uns segundos (c3).

Observação, sem peso na nota: com os pontos separados, algumas peças mostram poucos de cada vez (Galeria 2 das 9 pistas, Coleções 2 de 15, Pátio 3 de 16); os outros aparecem ao girar. A lista continua sendo a saída.

### Critério 6 · Estabilidade — nota 8

Medido e estável:
- Coletar pista: das 18, só as 2 tocadas mexem, 3 px (o afundar). Lista com altura única de 82 px.
- Relógio da sala: 138×62 e cabeçalho de 74 px em 5 leituras.
- Máquina: mesma posição e altura nas 4 abas (topo 62, altura 720).
- Dossiê: os 10 cartões com 88 px (antes 58, 69 e 101).
- **Minijogo no fim da volta: fecha sozinho** e avisa "A volta acabou. A pista fica para a próxima." (390 e 360). No simulador, nenhum celular terminou com janela aberta por cima do resultado.
- Livro do Ateliê: o lugar já vem reservado; abrir não muda a altura da tela (0 px).
- Telão: 0 cartões fora da tela em 10 páginas, 1280 e 1920.

O que ainda pula (tudo corrigível só com CSS/JS):
- **Livro da Conservação.** Ao abrir, a tela cresce 70 px (79 em 360) porque os botões "Ler … · 1 de energia" entram em cima da caixa de leitura. Ao virar a folha, a quantidade muda (2 botões de 64 e 52 px, depois 1), e a caixa de leitura sobe e desce uns 60 px. `.livro-acoes{min-height:52px}` não cobre dois botões. Reservar `min-height:132px` (dois botões de 2 linhas) ou pôr os dois botões lado a lado numa linha de altura fixa (64 px).
- **Resposta errada no minijogo:** a frase "Ainda não. Pense no que o tempo faz com uma peça." entra e a janela cresce 22 px, empurrando "Pedir uma pista" e "Voltar à sala" (b4). Deixar a linha da mensagem sempre lá, com `min-height:2.9em`.
- **Telão:** em 4 páginas o conteúdo de um cartão passa 12 a 37 px da caixa, com `overflow:hidden` (Turma, Já contaram, Desfecho, Missões). Com 6 e com 12 pessoas nada aparece cortado; com turma grande pode cortar nome. Conferir com 40 nomes de mentira.

### Critério 7 · Linguagem — nota 9

Feito desde a rodada 4: "Automático (melhor)" no lugar de "Sozinho"; "Já contaram / Falta contar" nas duas páginas do telão; "Um palpite, uma dúvida, um detalhe…"; "Aparece depois que você achar o defeito, na aba Dossiê."; "Mosaico Loop" por inteiro na entrada, no jogo, na sala, no telão e no simulador; a mesma frase do papel ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não.") nas duas entradas.

Retoques (não reprovam):

| Onde | Hoje | Sugestão |
|---|---|---|
| Caixa de leitura do livro | "Manual da Câmara, página 1: "Mostradores piscando…" embaixo do título igual | Só o texto da página |
| Missão secreta | "Na pausa, conte (ou blefe) para a turma." | "Na pausa, conte para a turma. Pode blefar." |
| Fichas da aba Atividades | "Dupla: cada pessoa numa sala, falando" | "Em dupla: cada pessoa numa sala, falando" |
| Telão, entrada | "Apontem a câmera do celular para o QR code ou digitem o código SIMUL." | Duas frases: "Apontem a câmera para o QR code. Ou digitem o código SIMUL." |

### Critério 8 · Telão — nota 9

Medido em 1280×720 e 1920×1080:
- **Páginas por tema:** Relógio, Mapa, Turma, Máquina durante a volta; Desfecho e Turma no fim; Desfecho, A noite, Para conversar e Turma no resultado. Abas, setas, bolinhas e "Troca sozinha: sim / não".
- **Tela cheia:** botão sempre visível, 144×46 (197×50 em 1920), com a API ligada e atalho na tecla F.
- **Letra mínima nas páginas do jogo: 1,35% da largura** (17 px em 1280, 26 px em 1920). Antes havia textos com 0,92%. Nome da sala no mapa com 1,6%.
- **Mapa:** 16 cartões em grade 6×3, miniatura de 83 px (124 em 1920; antes 52 e 78), "Central de monitoramento" sem quebrar palavra, contador de pessoas em cada sala.
- **A noite:** as linhas vazias viraram uma ficha só ("5 fatos ficaram no escuro").
- Nada fora da tela, sem barra de rolagem.

Ajustes para o 10 (não reprovam):
- **Área ocupada pelo conteúdo:** Desfecho final 34%, "Para conversar" 39%, Relógio 51%, Máquina 66% (medido). No Desfecho, caderno com 30 vh e o "6 de 6" maior; em "Para conversar", pergunta com `font-size:3.2vw`.
- **Entrada do telão:** o rótulo "MOSAICO LOOP" tem 12 px fixos (0,63% em 1920). `font-size:max(12px,1.2vw)`.
- **Simulador:** o telão tem sempre 745×419 px, em qualquer janela: 58% da largura em 1280 e só 39% em 1920. Em 1280×720 os celulares começam em 598 px e só 122 px deles aparecem; em 1920×1080 aparecem 482 de 507. Telão em cima e turma embaixo está certo, mas em notebook a turma fica quase toda fora da tela. `#tl{width:min(100%,calc((100vh - 330px)*16/9))}` em janela alta e celulares com `zoom:.6` em janela baixa.

### Critério 9 · Entrada — nota 9

- `index.html` (01, d1): "Participar com código" com campo e "Entrar" (320×52); "Conduzir como professor" em roxo (320×58), cadeado e "Só o Professor tem a chave"; "Abrir telão" e "Simulador" lado a lado (155×52); "Jogar sem turma" no fim. Tudo acima de 821 px numa tela de 844 (835 de 740 em 360 px: "Jogar sem turma" pede rolagem). Posto ao lado do Mosaico Vila, é a mesma tela com a paleta do Loop.
- O roxo abre a área do professor (`sala/index.html?conduzir=1`), com "Automático (melhor)", "Eu libero", "Abrir com Google" e "Cancelar".
- `sala/index.html` sem código (a3): agora tem ícone, "Participar com código", o roxo com cadeado, "Abrir telão" e "Simulador".
- **`/simulador` responde** (200) e leva a `sala/simulador/`. Telão em cima, turma embaixo, "Tela cheia" no topo e no telão.
- Entrada do telão: miniatura, campo de código, "Abrir telão" e "Tela cheia".

Ajustes que não reprovam:
- `cinco-minutos/telao/` devolve 404 (o botão da entrada aponta para `sala/telao/`, que funciona). Se quiser o par completo, uma página de redirecionamento igual à de `simulador/`.
- Em 360×740, "Jogar sem turma" fica 95 px abaixo da dobra.

---

## PARTE B · Peças 3D das 15 salas da história (Seção 5 das escalas)

Mínimos: Pertencimento, Dedução, Segurança narrativa e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8. Só passa quem atinge todos.

### O que mudou desde a rodada 4

- **Pontos separados:** `separarPontos()` (game.js, linha 647) afasta o desenho dos pontos à vista até 48 px. Medido: 0 pares colados nas 15 salas. O lugar de cada pista na peça continua por sorteio (`pontosDaPeca()`, linha 630): vários pontos ficam no ar, ao lado da peça (fichário, tripé da câmera, relógios).
- **Minijogo da luz da Galeria:** antes do controle há uma pergunta de história ("A peça principal tem 300 anos. Com a luz de lado, o que uma peça dessa idade mostraria?"). Testado: resposta errada devolve "Ainda não. Pense no que o tempo faz com uma peça."; a certa abre o controle, que só confirma.
- **A fita da porta de serviço virou pergunta** ("de quem é o crachá que abre essa porta?"); não há mais cenas para pôr em ordem.
- **Livro de folhear:** lugar reservado com capa desenhada e caixa de leitura embaixo.
- **Não mudou:** nenhum modelo foi trocado, composto de novo ou recomprimido; `exposure="1.15"` fixo em todas as salas (nada reage ao apagão); os pesos são os mesmos.

### Tabela de notas

| Sala | Peça (KB) | Pert. (9) | Ded. (9) | Seg. (9) | Cel. (9) | Amb. (8) | Din. (8) | Pers. (8) | Nov. (8) | Viab. (8) | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (840) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (157) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (821) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (422) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 (866) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 (233) + livro | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Galeria especial | GAL_A (482) | 9 | 9 | 9 | 9 | 7 | 8 | 9 | 9 | 9 | reprova (Amb.) | reprova (Ded. 8, Amb. 7) |
| Sala dos relógios | REL_A (804) | 9 | 9 | 9 | 9 | 7 | 8 | 8 | 8 | 8 | reprova (Amb.) | igual |
| Área de descanso | DESC_A (459) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) | igual |
| Pátio · Quadro externo | E01 (146) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) | igual |
| Sala das coleções | V12 (747) | 6 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Pert., Amb.) | igual |
| Base da limpeza | L05 (1.021) | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 7 | reprova (Pert., Amb., Viab.) | igual |
| Sala dos sons | N07 (176) | 8 | 9 | 9 | 9 | 5 | 8 | 8 | 7 | 9 | reprova (Pert., Amb., Nov.) | igual |
| Sala da fotografia | N05 (570) | 9 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Amb.) | igual |

**Passam 7 de 15** (igual à rodada 4). **Reprovam 8.** Nenhuma nota caiu; a única que subiu foi a Dedução da Galeria (8 para 9).

### As que passam

- **Câmara do tempo · T01.** Peça da história, cadeia de passos, muda com o defeito sorteado, recebe objetos de outras salas. 9 pontos à vista, agora sem nenhum colado. Ressalva: 868 KB, acima da meta de 600.
- **Central de monitoramento · S01.** Lugar para explorar, cofre com código do mundo, duas perguntas de história (crachá e fita). Ressalva: 840 KB.
- **Recepção · P01.** Mesa com luminária e papéis. Roleta, telefone e relógio só em texto (Amb. 8, no limite).
- **Oficina técnica · M03.** Bancada com painel de ferramentas. 821 KB, no limite.
- **Oficina elétrica · E02.** Sala inteira com painéis. A miniatura continua difícil de ler.
- **Ateliê · L06 + livro.** Virar a folha registra a página; leitura embaixo, em letra de tela.
- **Sala de conservação · I01 + livro.** Abrir, virar e decidir se gasta energia para ler. Ambiente 8, no limite: o fichário é um móvel solto e as pistas fora do livro caem nele (ou no ar ao lado) por sorteio.

### As que reprovam: motivo e o que resolve

| Sala | Reprova em | Resolve só com código | Depende de modelo novo |
|---|---|---|---|
| Galeria especial | Ambiente 7 | Pontos fixos na base (tabela por peça); trocar o quadro-negro do minijogo da luz pela máscara | **Sim:** base com vitrine, gaveta e placa (pedido 8, `GAL_B.glb`) |
| Sala dos relógios | Ambiente 7 | Juntar o terceiro relógio do acervo (N03) e recomprimir: ajuda, não basta para "dezenas de relógios" | **Sim:** parede de relógios (pedido 9, `REL_B.glb`) |
| Área de descanso | Pertencimento 8, Ambiente 7 | Não | **Sim:** porta de serviço com cafeteira e mural (pedido 7, `DESC_B.glb`) |
| Pátio · Quadro externo | Pertencimento 8, Ambiente 7 | Não | **Sim:** quadro externo com para-raios (pedido 1, `Q01.glb`) |
| Sala das coleções | Pertencimento 6, Ambiente 6 | Não | **Sim:** estante com caixas (pedido 2, `D10.glb`) |
| Base da limpeza | Pertencimento 8, Ambiente 6, Viabilidade 7 | Viabilidade: recomprimir (1.021 KB) | **Sim:** carrinho de limpeza (pedido 3, `L08.glb`), que também resolve o peso |
| Sala dos sons | Pertencimento 8, Ambiente 5, Novidade 7 | Novidade: mecânica própria (tocar a gravação com legenda e escolher o que se ouve) | **Sim:** bancada de som (pedido 4, `N17.glb`) |
| Sala da fotografia | Ambiente 6 | Não | **Sim:** laboratório fotográfico (pedido 5, `N18.glb`) |

Motivos, em uma linha cada:
- **Galeria · GAL_A.** A Dedução passou: a pessoa precisa saber o que o tempo faz com uma peça antes de mexer na luz. Fica o Ambiente: máscara em cima de uma caixa lisa, sem vitrine, quadro torto nem rastro de gesso; só 2 das 9 pistas aparecem de cada vez e nenhuma no lugar de que fala. A cena do minijogo da luz mostra um quadro verde de moldura laranja, não a máscara.
- **Relógios · REL_A.** Dois relógios para uma sala de "dezenas"; os 5 pontos ficam em volta do relógio de parede, sem ligação com o que dizem; 804 KB.
- **Área de descanso · DESC_A.** A porta de serviço, objeto central da sala (4 pistas), não existe no modelo; o conjunto de 3,8 m fica com cerca de 140 px por parte no celular.
- **Pátio · E01.** Quadro de parede interna, sem para-raios, cadeado, cabo nem vidro; 9 das 16 pistas sem lugar; 3 pontos à vista.
- **Coleções · V12.** Cômoda de gavetas numa história de caixas, prateleira e o Téo no chão; 2 pontos à vista para 15 pistas.
- **Limpeza · L05.** Cesto de frascos, sem carrinho, armário nem balde com multímetro; a mais pesada.
- **Sons · N07.** Rádio moderno com "PLAY" escrito; sem alto-falante de teste, metrônomo nem gravador; nenhuma mecânica própria.
- **Fotografia · N05.** Câmera certa; faltam parede de fotos, varal, lâmpada e álbum (7 das 10 pistas); 3 dos 5 pontos ficam no ar, ao lado do tripé.

### `docs/PECAS-A-CONSEGUIR.md` cobre as reprovadas?

**Sim, as 8 têm pedido com prompt pronto:** Pátio (1), Coleções (2), Limpeza (3), Sons (4), Fotografia (5), Área de descanso (7), Galeria (8), Relógios (9). O pedido 6 (Recepção) é opcional e a sala já passa. Os três que faltavam na rodada 4 (7, 8 e 9) entraram. A tabela de situação (7 aprovadas, 8 reprovadas, com os critérios) confere com esta avaliação, e os pesos conferem com os arquivos.

O que falta no documento:
1. **Sala dos sons, Novidade 7:** o pedido 4 traz o modelo, mas a mecânica própria da sala (tocar a gravação com legenda) não está no pedido nem em "Continua para depois". Sem ela a sala reprova mesmo com o modelo novo.
2. **Galeria, linha da tabela:** já diz "reprovada (ambiente)", certo. Acrescentar que a cena do minijogo da luz mostra um quadro, não a máscara.
3. **"Continua para depois"** (pontos em lugar fixo, peça que reage ao apagão, recompressão, cenas dos minijogos com as peças reais): continua valendo, nada disso foi feito.

### Correções de código que valem para todas (sem modelo novo)

1. **Pontos no lugar certo.** Tabela por peça em `pontosDaPeca()`, com sorteio só para pista sem lugar. A separação já funciona; falta o ponto ficar em cima do que a pista descreve. Começar por T01, S01, GAL_A e REL_A.
2. **Peça que reage.** No apagão, `exposure` de 1.15 para 0.45 e pontos acesos.
3. **Peso.** Recomprimir L05 (1.021 KB), T01, L06, S01, M03 e REL_A (804 a 868 KB) e V12 (747 KB) para a meta de 600 KB.
4. **Minijogo da luz** com a máscara `GAL_A` no lugar do quadro.
5. **Sala dos sons** com mecânica própria.

---

## Resumo do que falta para as escalas passarem

| Item | Só CSS/JS/texto | Depende de arte ou modelo novo |
|---|---|---|
| A2 Ícones (8) | Fichas das 3 provas maiores e claras; reenquadrar `E02`, `DESC_A` e os 4 tipos de pista | **6 ícones da lista B** (saguão, energia, missão, manual, uma tentativa, fato que falta) |
| A3 Muito visual (8) | Miniatura da sala em cada minijogo; máscara no minijogo da luz; título repetido na leitura do livro; quebra de palavra no manual | Não |
| A5 Celular (8) | Selo "✓ no caderno" cortado; rótulo de 11,5 px; minijogo da luz em 360 px; aviso em cima do botão | Não |
| A6 Estabilidade (8) | Altura reservada para os botões "Ler" do livro; linha fixa para a mensagem de erro do minijogo; conferir telão com 40 nomes | Não |
| B Galeria | Pontos fixos, cena da luz | **GAL_B** (pedido 8) |
| B Relógios | N03 na composição, recompressão | **REL_B** (pedido 9) |
| B Área de descanso | Não | **DESC_B** (pedido 7) |
| B Pátio | Não | **Q01** (pedido 1) |
| B Coleções | Não | **D10** (pedido 2) |
| B Limpeza | Recompressão | **L08** (pedido 3) |
| B Sons | Mecânica própria | **N17** (pedido 4) |
| B Fotografia | Não | **N18** (pedido 5) |

**Fim do ciclo:** as escalas não passaram. Na Parte A, três critérios (3, 5 e 6) sobem ao mínimo só com CSS e JS; o 2 só fecha com os 6 ícones novos. Na Parte B, as 8 salas reprovadas dependem de modelo novo; código sozinho não aprova nenhuma delas.
