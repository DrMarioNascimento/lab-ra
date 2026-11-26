# Loop · Rodada 14 (v4 revisão 14) · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliei do zero sobre o commit `75f4258` (lote 12, revisão 14). Não alterei nada em `/home/claude/lab-ra` (scripts e capturas só em `/tmp/roda/esc/rod14/`). Abri um navegador por vez e fechei cada um ao terminar (havia navegadores de outra avaliação rodando ao mesmo tempo; não mexi neles).

**Nota geral:** na Parte A, 8 dos 9 critérios ficam no mínimo (9). **A Estabilidade (6) cai para 8** por causa de um salto novo, medido, no minijogo da luz de lado: o texto da revisão 14 é mais longo e a janela cresce 45 px justo na posição certa da luz. Na Parte B, as 15 salas passam. A rachadura nova da Galeria aparece no museu 3D, do lado direito, como dizem a tela A e as pistas.

## Fontes (tudo em `/tmp/roda/esc/rod14/`)
- `pw/auditA.mjs` → `vis/visB_extra/` e `vis/visB_pecas/` (`pw/auditA.log`), em 390×844 e 360×740: entrada, sala de entrada, manual (6 passos), planta, 3 salas, lista, as 4 abas da Máquina, caderno, pausa, as 15 peças na sala (pontos, distâncias, caixa) e o censo de emoji, alvos, estouro e letra. Folha das peças: `vis/folha_pecas_390.png`.
- `pw/planta.mjs` + `pw/caminha.mjs` → `vis/planta/`: as 4 orelhas nas duas larguras (`orelha_*`); o Térreo com a Sala das esculturas em reforma (`orelha_2_terreo_*`); a caminhada da Recepção ao Subsolo (`3_*`, `c1`–`c4`).
- `pw/cap14.mjs` (novo) → `vis/cap14/` (`pw/cap14.log`): os minijogos `tombo_2`, `traj_1`, `c_peca` (errar e acertar), `falsa_1` com `par_foto` (a pergunta "Antes de acender a luz", depois a luz) e sem `par_foto` (vai direto para a luz); a luz no escuro, no meio e quando acha; o livro; o gravador (parado e tocando); o caderno; e o desfecho do celular com "O que o seu caderno trouxe" (com 6 fatos e vazio).
- `pw/luzpula.mjs` (novo, `pw/luzpula.log`): mede a posição da janela, da imagem, do controle deslizante e do botão nas 5 posições da luz, com 4 sementes, nas duas larguras.
- `pw/insc.mjs` (ajustado para o novo `c_peca`, `BANNERS`) → `vis/insc/`: livro com a tábua, minijogo dos símbolos, erro, Revelar e caderno com as 3 escritas. Deu **OK nas duas larguras**.
- Telão: `pw/tl40.mjs` → `vis/r6/tl40_*` (1280; 7 estados com 12 e 40 nomes; as medições valem para 1280 e 1920). `pw/fita_pwB.mjs`, `pw/tlB.mjs` e `pw/miss8.mjs` → `vis/fitaB/`: "A noite" e "Missões" com 12 e 40 nomes, em 1280 e 1920.
- Simulador: `pw/sim.mjs` → `vis/r6/sim_*` (partida inteira, 4 participantes, até o resultado); `vis/simB/` (1280, 1366 e 1920).
- Museu 3D: `pw/torre15.mjs` (390) → `vis/torre/` e `vis/folha_torre_390.png`; `pw/torre15_360.mjs` → `vis/torreB360/`. A Galeria de perto: `pw/gal14.mjs` e `pw/gal14b.mjs` → `vis/gal/` (`g_testa_390`, `gb3_390` e os recortes `crop_testa_390.png` e `crop_gb3_390.png`).
- Limites:
  - O `gal14` em 360 estourou o tempo ao carregar o museu, depois de terminar o de 390. A Galeria em 360 aparece no `torreB360` (centrada, 15 de 15 ok).
  - O Chrome renderiza por software. Não usei aparelho real e não abri a RA.

---

## PARTE A · Padrão visual (mínimo 9)

| # | Critério | Antes (r11) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões da bancada com sombra dura (`0 4px 0`), salas da planta em relevo, Esculturas como área chapada de propósito (sem toque); fichas do desfecho com borda e volume |
| 2 | Ícones | 9 | **9** | sim | Fichas "O que o seu caderno trouxe" com a miniatura 3D da fita do telão; ficha "nenhum fato" com o quadro 3D; censo: só 🔒 e ✕ de apoio. Cadeado da reforma desenhado em CSS dentro da planta (é desenho, não ícone) |
| 3 | Muito visual | 9 | **9** | sim | O passo 1 do manual agora é a planta (orelhas, escada, Saguão, Galeria): o retoque da r11 está resolvido. Reforma com hachura, fita listrada, cadeado e carimbo |
| 4 | Paleta coerente | 9 | **9** | sim | Planta em papel com a paleta do Limiar (decisão do autor); "em reforma" num carimbo vermelho-tijolo, cor de aviso só ali; fichas de fato em verde-água, como o "tem" das provas |
| 5 | Celular | 9 | **9** | sim | Térreo inteiro acima da barra (folha até y 752 contra a barra em 771 com 390; 654 contra 667 com 360); 0 alvo < 44 px, 0 estouro, nomes inteiros; opções dos minijogos com 48 a 56 px |
| 6 | Estabilidade | 9 | **8** | **não** | Na luz de lado, na posição certa, a janela vai de 655 para 700 px (390) e de 606 para 651 px (360): imagem e controle sobem 23 px e "Anotar" desce 23 px, e tudo volta quando passa da posição. O resto está estável |
| 7 | Linguagem | 9 | **9** | sim | "Quase.", "Revelar agora", "Agora você tem motivo.", "Nenhum fato da noite saiu do seu caderno desta vez.": 2ª pessoa, curtas, sem marca de gênero |
| 8 | Telão | 9 | **9** | sim | `tl40`: 52 páginas, 0 estouro (1280 e 1920; 12 e 40 nomes); `miss8` com 0 falha; `fita_pwB` com `maxCortePx` 0; "Tela cheia" sempre à vista |
| 9 | Entrada | 9 | **9** | sim | Tela-padrão inteira (código, professor roxo com 🔒 e "Só o Professor tem a chave", telão, simulador, jogar sem turma); os 7 endereços respondem 200 |

**8 de 9 no mínimo. A Estabilidade está abaixo (8).**

### O que medi e vi
- **Luz de lado (A6, novo e obrigatório)** (`pw/luzpula.log`, `cap14/luz_meio_*` contra `luz_achou_*`):
  - Medi nas 5 posições, com 4 sementes, nas duas larguras. Em todas, a posição certa troca "Luz N de 5 · ainda não apareceu nada." (1 linha) por "O verniz cobre tudo por igual, até o grão da pedra. Nenhuma borda gasta, nenhum risco de uso." (3 linhas). A janela é centrada e cresce 45 px.
  - Resultado em 390: a imagem passa de y 239 para 216, o controle de 460 para 437 e "Anotar" de 552 para 575. Em 360 os números são parecidos (imagem 199 → 176, controle 394 → 371).
  - Isso acontece enquanto o dedo está arrastando, e o salto ainda denuncia a posição certa pelo layout.
  - Na r11 já havia +22 px em 360 (11 px de salto) e 0 em 390. Com o texto novo, o salto dobrou e chegou às duas larguras.
  - Correção: reservar 3 linhas para a linha de estado da luz (uma `min-height` em `bancada.css`, ou a mesma caixa com altura fixa), ou dar à janela a altura do estado "achou" desde o começo.
- **Planta, Térreo (revisão 14):**
  - A Sala das esculturas fica embaixo da Área de descanso, ao lado da escada. Tem hachura, fita listrada na porta de baixo, cadeado, carimbo "em reforma" e a porta de vidro verde-água em cima, para a Área de descanso.
  - Não é botão: não entra na contagem de alvos, e o leitor de tela diz "Sala das esculturas, em reforma: fechada".
  - O corredor estreito liga a escada à Recepção, à Central e à Base da limpeza.
  - Nas duas larguras, cabe sem rolar, com 0 corte e letra ≥ 12 (fora o "N" de 6 px, mantido por decisão).
- **Caminhada:** a origem fica com o alfinete (Recepção, orelha Térreo), o destino fica tracejado (Subsolo), e o leitor de tela diz "Você está indo para Subsolo · Câmara do tempo.". O cabeçalho e o painel já mostram a sala de destino durante os 10 s (retoque da r11, não aplicado por decisão).
- **Minijogos pelo caderno:**
  - `c_peca`: 4 etiquetas com aviso, e a imagem D10 com 72 px.
  - `falsa_1.antes`: aparece só com `par_foto`; sem ela, o jogo abre direto a luz (conferido). Tem 4 combinações em botões de 48 a 56 px.
  - Errar não mexe em nada: altura e posição das opções ficam iguais (dh 0, dy 0 nos 4 minijogos de escolha).
  - Acertar o `antes` abre a luz em seguida.
- **Desfecho do celular:**
  - Com 6 fatos: "O QUE O SEU CADERNO TROUXE · 6 DE 9 FATOS", em 6 fichas de 3 colunas (113×96 em 390, 103×96 em 360), com a miniatura 3D de 37 px, rótulos inteiros e 0 estouro.
  - Vazio: uma ficha larga "Nenhum fato da noite saiu do seu caderno desta vez." (324×62).
  - No modo sala (simulador), o resultado do celular põe "DESFECHO DA TURMA" em cima e o resumo pessoal embaixo (`sala-mestre.mjs`).
  - Menor: a 1ª ficha tem 102 px de altura e as outras 96 (a linha de cima tem um rótulo de 1 linha e dois de 2). Quase não se nota.
- **Inalterados e estáveis:** Máquina 250:112 nas 4 abas (390) e 236:112 (360); livro com `doc` e leitura fixos em 6 estados; gravador com 6 faixas de 126×64 (360); caixas de marcar do dossiê com 28 px, mas dentro de um cartão-rótulo inteiro de 60 px ou mais (o toque vale no cartão).

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou para as peças desde a r11:**
- GAL_B ganhou uma rachadura fina do lado direito, por script. Miniatura e imagem da luz foram refeitas.
- A frase da luz agora é "verniz cobre tudo por igual, até o grão da pedra" (combina com a pedra fosca e granulada).
- `LOOP_DESC.patio` virou "A tempestade não para, e a pedra está toda molhada.".
- A Sala das esculturas entrou na planta, para a pista `pose`.
- Nenhum `LOOP_PONTOS` mudou de lugar.

Abri cada peça na sala (`visB_pecas/*`, nas duas larguras) e no museu 3D (`torre/`, `torreB360/`) e comparei com o LOOP_DESC (que também é o cartão do museu 3D) e com as pistas da sala.

| Sala | Peça | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes (r11) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 + manual | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 + livro com a tábua | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Sala dos relógios | REL_B | 9 | 9 | 9 | 9 | 8 | 8 | 8 | 8 | 9 | **PASSA** | passa |
| Área de descanso | DESC_B | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | **PASSA** | passa |
| Base da limpeza | L08 | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala dos sons | N17 + gravador | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Sala da fotografia | N18 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Pátio · Quadro externo | Q01 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 9 | **PASSA** | passa |
| Sala das coleções | D10 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Galeria especial | GAL_B | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **PASSA** | passa (a pendência da luz caiu) |

**Passam 15 de 15.**
- Na sala, nas 15 peças e nas duas larguras: 0 par de pontos a menos de 44 px (mínimo de 47 a 72 px), 0 ponto fora da caixa, 0 estouro e todos os modelos carregados (`auditA.log`).
- No museu 3D: 15 de 15 centradas acima do cartão, em 390 e em 360, com 0 erro de página.

### Galeria (GAL_B)
- **Museu 3D, de perto** (`gal/crop_gb3_390.png`, câmera a 0,119; `minDistance` 0,045 e zoom até o cursor ligados):
  - A fileira de 6 símbolos da testa se lê, e o 5º ("guardar") está virado, como num espelho.
  - A **rachadura** aparece como um traço escuro e fino, do lado direito de quem olha. Ela desce da ponta da sobrancelha pela bochecha, com um galho curto, longe da inscrição.
  - Isso bate com a tela A ("rachadura fina do lado direito") e com `foto_solo` e `coop_copia_ok` ("a rachadura está do outro lado", porque a foto B tem a rachadura à esquerda).
  - A pedra cinza-clara de bordas inteiras bate com "pedra cinza, mais clara" e "bordas inteiras, sem desgaste".
- **Luz de lado:** a imagem continua fosca e granulada, e agora o texto ("até o grão da pedra") combina com ela. A divergência que reprovou a história na r12 sumiu do lado visual. Fica só o salto de layout da Parte A, critério 6.
- **"Antes de acender a luz":** a miniatura mostrada é a cena da GAL_B (a peça exposta), e a pergunta é sobre a foto. O texto separa as duas coisas ("se esta aqui é igual"), então não há contradição.
- **Retoque mantido:** a peça fica baixa na caixa da sala, com cerca de 100 px vazios em cima (`visB_extra/a06_sala_galeria_*`).

### Outras
- **Pátio (Q01):**
  - "A tempestade não para, e a pedra está toda molhada.": a peça mostra a pedra molhada.
  - "Embaixo do para-raios": a haste aparece em cima do muro.
  - "Fechado a cadeado": o cadeado é pequeno, à esquerda da caixa.
  - Não há chuva caindo, mas a frase não promete chuva visível. O cartão do museu 3D já mostra a frase nova.
- **Área de descanso (DESC_B) e Sala das esculturas:**
  - A pista `pose` fala da porta de vidro da Sala das esculturas, e ela não está na peça (a peça mostra o canto da cafeteira, do mural e da porta de serviço).
  - A planta agora mostra essa porta de vidro na parede da Área de descanso, e a escultura aponta "para a escada do Subsolo", que fica ao lado na planta. O conjunto fecha.
  - A porta fora da peça é menor, do mesmo tipo da cadeira da M03.
- **Oficina técnica (M03):** igual à r11 ("num canto, longe da bancada" explica a cadeira fora da peça).
- **Nenhuma peça tem animação nem reage ao apagão.** Dinâmica e Persistência ficam como estavam.

---

## (a) OBRIGATÓRIO para o mínimo
| O que | Onde | Quanto mexe |
|---|---|---|
| **Luz de lado: a janela cresce 45 px na posição certa** (imagem e controle sobem 23 px, "Anotar" desce 23 px, nas duas larguras e em todas as sementes). Isso derruba a Estabilidade para 8 | `bancada.css` (linha de estado da luz em `reserva/minigames.mjs`): reservar a altura de 3 linhas desde o começo ou fixar a altura da janela no estado "achou" | 1 regra de CSS, sem texto |

## (b) Retoques opcionais
| Retoque | Onde | Tipo |
|---|---|---|
| Galeria baixa na caixa da sala (cerca de 100 px vazios em cima) | `PECA_PERTO.GAL_B` | JS |
| Sem aviso visível de "andando" no painel durante os 10 s (só a planta e o aviso mostram) | painel da sala | JS/CSS |
| 1ª ficha de fato com 102 px e as outras 96 no desfecho | `.lc-fim-fatos` (`align-items`/altura fixa) | CSS |
| "guardar" encosta nas bordas da célula da tábua em 360 | `.lc-gl.tabua` | CSS |
| Porta de vidro da Sala das esculturas fora da DESC_B (`pose`) | modelo ou meia frase no LOOP_DESC | arte ou texto |
| Q01 sem a luva no chão e o giz; nenhuma peça reage ao apagão | modelos | arte |
| Setas ▲▼ da escada como glifo de texto | planta | CSS ou ícone |

**Fim:** nesta rodada, as peças 3D passam (15 de 15). O padrão visual **não passa**: a Estabilidade fica em 8, por causa do salto da luz de lado. Depois da correção, a contagem de rodadas limpas recomeça.
