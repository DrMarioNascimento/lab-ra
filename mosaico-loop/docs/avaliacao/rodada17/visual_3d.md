# Loop · Rodada 17 (v4 revisão 16) · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliação do zero sobre o commit `f10de0b` (lote 13, revisão 16). Não alterei nada em `/home/claude/lab-ra`. Scripts em `/tmp/roda/esc/rod17/pw/` (copiados de `rod14/pw`, com `cinco-minutos` trocado por `mosaico-loop`, mais os testes do autor `r15_caminho`, `r15_luzalt`, `r15_cap` e `r15_planta_cap`, e um teste novo meu, `mg17.mjs`). Capturas em `/tmp/roda/esc/rod17/vis/`. Rodei um navegador por vez, em sequência (`pw/rodar.sh`; resumo em `pw/logs/_resumo.txt`). Todos os testes saíram com código 0.

**Nota geral:** Parte A: **9 de 9 critérios no mínimo (9)**. A Estabilidade volta de 8 para 9: medi a janela de todos os minijogos em cada estado, e nada cresce nem pula. Parte B: **15 de 15 salas passam**. Nenhuma peça mudou desde a r14. Os textos novos (luz "até o grão", "cor cinza, mais clara", `falsa_3`, `maq_ver`) batem com o que a peça mostra.

## Fontes
- **Planta:** `pw/planta.mjs` e `pw/caminha.mjs` geram `vis/planta/`: as 4 orelhas nas duas larguras, o Térreo, a caminhada da Recepção ao Subsolo (`c1`–`c4`, `3_*`) e a chegada. Há também `pw/r15_caminho.mjs` (a planta como grafo: TUDO CERTO) e `pw/r15_planta_cap.mjs` (`vis/r15cap/`).
- **Minijogos:**
  - `pw/mg17.mjs` (novo) gera `vis/mg/` e `logs/mg17.log`. Ele cobre os 9 minijogos (`tombo_2`, `traj_1`, `insc_copia`, `c_peca`, `falsa_1.antes`, a luz de lado e as 3 duplas), as sementes 0 e 1 e as duas larguras. Em cada estado, mede o topo, a altura e a posição de cada elemento: início, erro (toque real numa opção errada), dica 1, dica 2, luz 1 a 5, antes de anotar e acerto. Confere também se o texto visível cabe na caixa reservada e se a janela rola.
  - `pw/r15_luzalt.mjs` gera `vis/luzalt/` (4 sementes na luz): TUDO CERTO.
  - `pw/cap14.mjs` gera `vis/cap14/`: minijogos, luz, livro, gravador, caderno e desfecho com 6 fatos e vazio.
- **Escrita antiga:** `pw/insc.mjs` gera `vis/insc/`: livro com a tábua, minijogo, erro, Revelar e caderno. OK nas duas larguras.
- **Celular geral:** `pw/auditA.mjs` gera `vis/visB_extra/` e `vis/visB_pecas/`: entrada, sala de entrada, manual (6 passos), mapa, 3 salas, lista, as 4 abas da Máquina, caderno, pausa e as 15 peças na sala, com censo de emoji, alvos, estouro, corte e letra. As folhas das peças estão em `vis/folha_pecas_390.png` e `vis/folha_pecas_360.png`.
- **Telão:**
  - `pw/tl40.mjs` gera `vis/r6/tl40_*`: 7 estados, com 12 e 40 nomes, em 1280 e 1920. Agora também grava as capturas de 1920 de entrada, jogo e resultado.
  - `pw/fita_pwB.mjs`, `pw/tlB.mjs` e `pw/miss8.mjs` geram `vis/fitaB/`.
- **Simulador:** `pw/sim.mjs` gera `vis/r6/sim_*` (partida inteira até o resultado). `tlB` gera `vis/simB/` (1280, 1366 e 1920) e confere os 7 endereços.
- **Museu 3D:**
  - `pw/torre15.mjs` (390) gera `vis/torre/` e `vis/folha_torre_390.png`; `pw/torre15_360.mjs` gera `vis/torreB360/` e `vis/folha_torre_360.png`. Deu 15 de 15 nas duas larguras, com 0 erro de página.
  - Galeria de perto: `pw/gal14.mjs` e `pw/gal14b.mjs` geram `vis/gal/` (`g_testa_*`, `g_rachadura_*`, `gb3_390`, e o recorte `crop_testa_390_r17.png`).

---

## PARTE A · Padrão visual (mínimo 9)

| # | Critério | Antes (r14) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões com sombra dura (`0 4px 0`) e brilho em cima nos minijogos e na bancada; salas da planta em relevo; escada do Térreo em 2 botões com volume; Esculturas chapada de propósito (sem toque) |
| 2 | Ícones | 9 | **9** | sim | Miniaturas 3D em toda tela (mg-foto 72/86 px, fichas do desfecho, fita); censo: só 🔒 (botão do professor e item travado) e ✕ de apoio; a cópia agora usa a miniatura `GAL_B` (fita e desfecho) |
| 3 | Muito visual | 9 | **9** | sim | Planta com hachura, fita, cadeado e carimbo na reforma; minijogos com imagem da peça; tábua desenhada; manual passo 1 é a planta |
| 4 | Paleta coerente | 9 | **9** | sim | Azul-noite, dourado e verde-água iguais em todas as telas; planta em papel (decisão); vermelho-tijolo só no carimbo "em reforma"; dica e erro em dourado |
| 5 | Celular | 9 | **9** | sim | Térreo de 4 colunas inteiro acima da barra (folha até y 752, barra em 771 com 390; 654 contra 667 com 360); 0 alvo < 44 px; 0 estouro; 0 nome cortado; opções de 48 a 52 px; nenhuma janela de minijogo rola |
| 6 | Estabilidade | **8** | **9** | sim | `mg17`: em 9 minijogos × 2 sementes × 2 larguras, a janela tem a mesma altura e o mesmo topo no início, no erro, na dica 1, na dica 2 e nas luzes 1 a 5. O texto visível cabe sempre na caixa reservada |
| 7 | Linguagem | 9 | **9** | sim | "Confira uma coisa de cada vez: primeiro a superfície, depois as beiradas.", "No caderno, procure o que se diz de uma caixa do patrocínio.": 2ª pessoa, curtas, sem marca de gênero |
| 8 | Telão | 9 | **9** | sim | `tl40`: 0 página com estouro (1280 e 1920; 12 e 40 nomes); `fita_pwB` com `maxCortePx` 0; `miss8` com 0 falha; "Tela cheia" sempre à vista (144×46 em 1280) |
| 9 | Entrada | 9 | **9** | sim | Tela-padrão inteira (código, professor roxo com 🔒 e "Só o Professor tem a chave", telão, simulador, jogar sem turma); os 7 endereços respondem 200 |

**9 de 9 no mínimo. Parte A passa.**

### O que medi e vi
- **Altura dos minijogos (A6, a correção da revisão 16)** (`logs/mg17.log`):
  - **Luz de lado:** a janela tem 697 px em 390 (topo 73,5) e 638,5 px em 360 (topo 50,5), igual nas 5 posições, também na posição certa, e igual com a dica 1 e a dica 2.
    - A linha de estado já nasce com 3 linhas: na posição 1, sobra um espaço vazio entre "Luz 1 de 5…" e "Anotar" (`luzalt/luz_pos1_360.png` contra `luz_pos5_360.png`). Antes de "Anotar" fica o mesmo valor.
    - Tocar na imagem avança a luz (alternativa ao arraste).
  - **Escolhas (`tombo_2`, `traj_1`, `insc_copia`, `c_peca`, `falsa_1.antes` e as 3 duplas):** a altura fica igual no erro (toque real), na dica 1 e na dica 2.
    - Em 390: 641,5 · 627 · 669,5 · 664,5 · 641,5 · 584,5 · 647,5 · 558,5.
    - Em 360: 609,5 · 595 · 650,5 · 632,5 · 631 · 549,5 · 615,5 · 526,5.
    - O texto visível cabe na caixa nos 72 estados medidos.
  - **Acerto:** a janela fecha, e nada cresce antes.
  - **Menor:** quando a pessoa acerta o `antes`, a mesma janela troca de conteúdo para a luz e passa de 641,5 para 697 px em 390 (o topo sobe 28 px) e de 631 para 638,5 px em 360. É a troca de um minijogo por outro, com título e cena novos, e não um salto dentro de um estado. Não baixa nota.
  - `r15_luzalt` confirma o mesmo com 4 sementes: TUDO CERTO.
- **Planta do Térreo (revisão 16)** (`planta/orelha_2_terreo_*`, `planta/c2_andando_terreo_390.png`):
  - 4 colunas: Oficina elétrica, Ateliê (2 colunas) e Área de descanso, que ocupa 3 linhas na coluna da direita.
  - A Área de descanso tem a porta para o corredor no meio da parede de baixo, alinhada com a porta da Base da limpeza. Ela também tem porta de vidro para o Ateliê (verde-água), porta para a Sala das coleções e a porta de serviço para fora, no fim da parede direita.
  - A Sala das esculturas fica entre a escada e a Área de descanso: hachura, carimbo "em reforma", fita e cadeado na porta de baixo, e vidro verde-água virado para a Área de descanso.
  - A escada mostra seta em cima e nome embaixo ("▲ 1º andar", "▼ Subsolo"), em 2 botões ≥ 44 px.
  - Cabe sem rolar, com 0 corte e letra ≥ 12. O "N" de 6 px e a seta de 10 px são decisões já registradas.
- **Caminhada:** a origem fica com o alfinete (Recepção), e o destino fica tracejado (orelha Subsolo e Câmara). O aviso diz "Você vai para Subsolo · Câmara do tempo. Andar até lá leva 10 segundos." e o leitor de tela diz "Você está indo para…". Depois de 10 s, chega.
- **Livro com a tábua:** 12 símbolos de 44 px, botões "esquerda/direita" e leitura fixa em 6 estados (`doc` 2365/2386 px, igual).
- **Gravador:** 6 faixas de 138×64 (390) e 126×64 (360); a faixa que toca ganha moldura verde-água; 0 estouro.
- **Máquina:** 250:112 nas 4 abas (390) e 236:112 (360), sem pulo.
- **Caderno e desfecho:** 6 fichas de fato (113×96 com 390; 103×96 com 360; a 1ª com 102 px, retoque antigo). A ficha "A cópia na Galeria" e a prova "O que foi feito" agora mostram a `GAL_B`.
- **Manual passo 1:** "Nesta atividade você vive o papel de quem lembra das voltas.", com a planta (orelhas, Saguão, Galeria) e "Entendi" sempre à vista.

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou para as peças desde a r14:**
- Nenhum modelo, `LOOP_PONTOS`, `PECA_PERTO` ou `LOOP_DESC` mudou (diff `d66b7b3..f10de0b`).
- Só mudaram textos de pista: `maq_ver`, `falsa_3`, `c_esc_3`, `coop_copia_ok`, a tela A ("cor cinza, mais clara") e a luz ("até o grão").
- A planta mudou (porta da Área de descanso).

Abri cada peça na sala (`visB_pecas/*`, nas duas larguras) e no museu 3D (`torre/`, `torreB360/`). Comparei com o LOOP_DESC (que também é o cartão do museu 3D) e com as pistas da sala (`pistas_legivel.txt`).

| Sala | Peça | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes (r14) |
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
| Galeria especial | GAL_B | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **PASSA** | passa |

**Passam 15 de 15.**
- **Na sala** (`auditA.log`), nas 15 peças e nas duas larguras: 0 par de pontos a menos de 44 px (mínimo de 47 a 72 px), 0 ponto fora da caixa e todos os modelos carregados.
- **No museu 3D:** 15 de 15 centradas acima do cartão, em 390 e em 360, com 0 erro de página.

### Galeria (GAL_B)
- **Museu 3D, de perto** (`gal/crop_testa_390_r17.png`, câmera a 0,152; `gb3_390` a 0,119):
  - A fileira de 6 símbolos se lê (rosto, pedra, ver, noite, guardar, tempo), e o 5º ("guardar") abre para o lado contrário ao da tábua (`insc/…_1b_livro_tabua_rolada.png`).
  - A rachadura aparece como um traço fino na bochecha, do lado direito de quem olha. Isso bate com a tela A ("rachadura fina do lado direito") e com `coop_original_copia` ("A rachadura está do outro lado").
- **Cor:** a máscara é cinza-clara e granulada. Bate com "cor cinza, mais clara" (tela A) e com a luz de lado: "O verniz cobre tudo por igual, até o grão. Nenhuma borda gasta, nenhum risco de uso." Bordas inteiras na imagem.
- **`falsa_3` (Sala das coleções):** a folha "impressa ao contrário" fica só no texto. Ela não contradiz nada do modelo, porque a D10 mostra a estante e as caixas fechadas.
- **Miniatura da cópia** (fita e desfecho): a `GAL_B` se reconhece como "a Galeria" (base, quadro, vitrine). Com 37 px, a máscara é pequena, e não dá para ver a inscrição nem a rachadura (ROTEIRO, parte 21: "com a inscrição e a rachadura"). Menor: a ficha funciona como sinal da Galeria.
- **Retoque mantido:** a peça fica baixa na caixa da sala, com cerca de 100 px vazios em cima (`visB_extra/a06_sala_galeria_390.png`).

### Outras
- **Área de descanso (DESC_B) e a planta nova:**
  - As pegadas "saem da Sala das coleções, cruzam a Área de descanso e somem na porta de serviço": a planta tem a porta Coleções → Área de descanso e a porta de serviço para fora. A peça mostra a porta de serviço com leitor de crachá, a cafeteira e o mural, como no LOOP_DESC.
  - `ivone_red` ("a porta de vidro dá para a Área de descanso inteira", "pergunta ao Seu Dirceu"): fecha com o vidro Ateliê → Área de descanso e com a porta para o corredor em frente à Base da limpeza.
  - `pose` ("pela porta de vidro da Sala das esculturas… o braço aponta para a escada do Subsolo"): a Sala das esculturas fica colada à escada na planta, com o vidro virado para a Área de descanso.
  - A porta de vidro e a porta para o corredor não estão na peça (que mostra um canto). Menor, como antes.
- **Câmara (T01) e `maq_ver`:** "mostradores, um ponteiro de carga, a luz da peça": a peça tem mostradores, ponteiros e o globo aceso. O botão vermelho sob tampa de vidro (`loop_reset`) não se distingue na peça. Menor e antigo (a pista já citava o botão antes).
- **Central (S01) e `c_esc_3`:** "duas caixas de banners" é imagem de câmera (texto), e os monitores da peça comportam isso.
- **Oficina elétrica (E02) no museu 3D:** a vista inicial é de cima, e o gerador quase não aparece até girar ("Arraste para girar"). Na sala, a peça aparece de frente. Igual à r14; retoque opcional.
- **Nenhuma peça tem animação nem reage ao apagão.** Dinâmica e Persistência ficam como estavam.

---

## (a) OBRIGATÓRIO para o mínimo
Nada. As duas partes passam: o padrão visual tem 9 de 9 critérios em 9, e as peças 3D passam 15 de 15. A pendência da r14 (a luz de lado crescia 45 px) está resolvida e foi medida em todos os estados.

## (b) Retoques opcionais
| Retoque | Onde | Tipo |
|---|---|---|
| Ao acertar o "Antes de acender a luz", a janela troca para a luz e cresce 55,5 px em 390 (topo sobe 28 px) e 7,5 px em 360 | `bancada.css` (`min-height` comum para a janela da Galeria) | CSS |
| Miniatura `GAL_B` de 37 px não mostra a inscrição nem a rachadura, que a ROTEIRO diz que se veem | ícone próprio da máscara (ex.: `GAL_B_mascara`) em `LOOP_LINHA.copia` e `LC_PV_IC` | ícone |
| Galeria baixa na caixa da sala (cerca de 100 px vazios em cima) | `PECA_PERTO.GAL_B` | JS |
| 1ª ficha de fato com 102 px e as outras 96 no desfecho | `.lc-fim-fatos` | CSS |
| "guardar" encosta nas bordas da célula da tábua em 360 | `.lc-gl.tabua` | CSS |
| E02 no museu 3D abre vista de cima (gerador escondido até girar) | ângulo inicial da peça no museu | JS |
| Porta de vidro da Sala das esculturas e porta para o corredor fora da DESC_B; botão vermelho pouco visível na T01 | modelos | arte |
| Q01 sem a luva no chão e o giz; nenhuma peça reage ao apagão | modelos | arte |
| Setas ▲▼ da escada como glifo de texto | planta | CSS ou ícone |

**Fim:** rodada limpa para o visual e as peças 3D. Todos os critérios ficam no mínimo ou acima, e não há correção obrigatória.
