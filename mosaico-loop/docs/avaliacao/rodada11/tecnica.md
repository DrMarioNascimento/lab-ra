# Mosaico Loop v4 revisão 13: conferência técnica (seção 4 das escalas), refeita do zero

**Resultado: PASSA.** Os 10 itens passam, com 0 falha bloqueante e 14 menores.

**Critério.** Bloqueante é o que quem joga vê ou o que quebra a partida. Menor é campo interno, documento, decisão já registrada, ou frase que não revela nada nem quebra a partida.

## Estado auditado e limites

- **Retrato do repositório às 12:40.** São 1.033 arquivos, listados em `aud/snap_ini.txt`.
  - Conferi de novo às 15:10, depois que a sessão caiu: md5 igual, arquivo por arquivo.
  - Não escrevi nada no repositório. Rodei Python com `PYTHONDONTWRITEBYTECODE=1`, sem `-I`.
- **A máquina ficou sobrecarregada.** Rodavam 4 avaliações ao mesmo tempo, a carga chegou a 60 e houve 13 mortes por falta de memória (OOM).
  - Vários testes caíram por "Target crashed" ou por tempo estourado ao abrir a página.
  - Rodei de novo, sozinhos e com a máquina livre, todos os que serviam para fechar algum item: `t13`, `rede`, `real_par`, `real_trio`, `mgluz`, `forca`, `insc5`, `trava_all` e `blocos`. Todos passaram.
- **Não refeitos** (parados por falha de máquina ou porque a sessão caiu): `r7x/ordem` (coberto por `n6/ordem`, `r8/r7_ordem` e o validador g2), `pw/tranca_causa` (coberto por `trava_all`), `x/final_tela` e `pw2/mgpeca`. A fila também não chegou a rodar estes: `varre`, `man3`, `simrun6`, `hs2`, `janela`, `sons`, `torre15`, `testa_jogo`, `giro`, `pontos_cheio`, `torre6` e os `r12/*`.
  - Nenhum deles cobre algo que a revisão 12 ou a 13 tenha mudado, a não ser `torre15`, que olharia o zoom da Galeria. Esse ponto ficou só na leitura do código.
  - Para esses testes, vale a evidência da rodada 10 (revisão 11). Isso fica dito item por item.
- **Três testes antigos falham por estarem desatualizados, não por defeito do jogo:** `pw2/painel`, `n/extra` e `pw/meu`.
  - Eles clicam `#roomGrid [data-room="atelie"]` com a folha do Térreo escondida. Na planta da revisão 12, só a folha do andar escolhido fica à vista.
  - O caminho de verdade (Mapa, orelha, sala) foi conferido por toque no `t13`.

## O que é novo nesta rodada

- **`t13/t13.mjs`, toque de verdade nas 5 causas, em 390×844 e 360×740 (10 de 10 passaram).**
  - **(A) Planta.** O botão Mapa mostra a planta, que abre na orelha do Térreo para quem está na Recepção.
    - Trocar entre as 4 orelhas não gasta energia (4→4).
    - A folha tem a mesma altura nos 4 andares: 520 px em 390 e 422 px em 360.
    - Salas por andar: 1, 4, 9 e 1, ou seja, as 15.
    - Nenhum alvo de toque menor que 44 px, nenhum nome cortado e nada saindo da folha.
    - Da Recepção, tocar na Câmara do tempo dá 10 s de caminhada, com o alfinete na sala de saída e o tracejado no destino e na orelha do Subsolo.
    - O HTML da planta é **idêntico nas 5 causas e nas voltas 1, 3 e 5**: 1 versão por largura.
  - **(B) Luz de lado.** A pergunta "antes" é a mesma nas 5 causas (1 texto).
    - A dica 1 manda para "Na Máquina, aba Dossiê, o Dicionário das palavras". A aba existe, e lá aparece "Peça principal: A máscara de pedra de uns 300 anos…".
    - Fechar o minijogo, abrir a Máquina e voltar não gasta energia.
    - A imagem `GAL_B_mascara.webp` carrega (320 px) e fica inteira na cena e na janela, sem rolar.
  - **(C) Caixa de banners.** As dicas novas aparecem por toque, e a pista "A peça principal" está no caderno quando a caixa abre.
- **Diferença de dados entre a revisão 11 e a 13** (`z/diff1113.txt`).
  - Mudaram 9 campos de pista, a `telaPapel.A` do Lado a Lado e a versão.
  - Nenhuma pista entrou ou saiu, e a ordem é a mesma.
  - Nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa`, custo ou rótulo mudou. Isso bate com o registro.
- **`an/espaco.txt`.** As 110 frases de pista que falam de lugar foram conferidas contra a tabela `PLANTA`.

## Tabela

| # | Item | Resultado | Bloqueantes | Menores | Evidência |
|---|---|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | 0 | 2 (m1, m2) | **Horários e testemunhas** (`n6/crono.txt`): igual à revisão 11, `diff` vazio. **Planta × pistas:** Coleções e Ateliê (porta de vidro) dão para a Área de descanso; a porta de serviço fica na parede de fora; as pegadas vão das Coleções à porta de serviço; o armário fica colado na Base da limpeza; Seu Dirceu vê pelo hall a escada do Subsolo; a Recepção fica ao lado da Central; a Oficina elétrica tem porta para o Pátio. Tudo coerente. **Textos novos coerentes:** "Na mesma chave" (`quadro_aberto`, noite D) é a chave do cabo "Para-raios → Câmara" (`man_pot_3`, `chave_3`), a mesma de `d_fus_2`; "chavinha" ficou só para a chave do cadeado da porta do quadro; o interruptor fica embaixo do medidor; "longe da bancada" (Oficina técnica) não briga com "Na mesa, a marmita" (`teo_cadeira`); a chuva fina aparece em todas as noites. **Finais** sem mudança. |
| 2 | Origem, volta e quem vê | **PASSA** | 0 | 0 | São 281 pistas, ids únicos, `quemPodeVer` "todos" nas 281. Das 88 com `precisaDe`, todas têm `porque`. O validador dá 0 referência quebrada e 0 pista inalcançável. `trava_all`: 66 trancas × 5 causas = 330 toques, todos com a frase certa, 0 energia gasta, 0 pista entrando, 0 botão coberto e 0 frase diferente entre causas. `insc_caminho`: caminho da inscrição OK nas 5 causas. |
| 3 | Palavras proibidas e prévias (ordem, pontos, contagem, custo, ícone, altura, `textoPorCausa`, planta) | **PASSA** | 0 | 3 (m3, m4, m5) | **Planta:** HTML idêntico nas 5 causas e nas 3 voltas testadas; mesma altura; nada depende da causa (`t13`). **Prévias:** 219 chaves de sala e rótulo, 0 diferença por campo (`pares`). Validador g e g2: 0 em causa única, 0 de 75 com ordem diferente. `n6/ordem` e `r8/r7_ordem`: 0 de 75, também com o conserto. **Causa trocada** (`forca`): 2.760 combinações, 0 diferença. **Pontos:** `r10/pnovo` OK. `hs2` não foi refeito, mas nenhum rótulo, peça ou ponto mudou desde a revisão 11 (rodada 10: 0 de 15). **`textoPorCausa`:** só a frase da noite D mudou ("Na mesma chave"). Continua igual: só depois de abrir e com rótulo igual. **Minijogos:** pergunta "antes" igual nas 5; a posição sai da semente (as opções aparecem em ordens diferentes entre as causas). **"Lenz"** não aparece antes da volta 3 (dados sem mudança de volta). |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | 0 | 1 (m6) | **Simulador:** `validar.py 2000`, semente 9264, APROVADO nas 5 causas (`aud/val/validar.txt`). Ótimo com 1, 2 e 3 pessoas chega ao Ouro na volta 5, mais 4 sementes extras (todas Ouro). Bot de 0,00% a 0,05%. 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. `trio.py`: 25 de 25 Ouro (1 a 5 pessoas × 5 causas). **Código real:** `real_solo` e `real_solo_teo` passam; `real_par` dá Ouro no DESFECHO DA TURMA nas 5; `real_trio` também, nas 5. `ivone` OK. |
| 5 | Códigos decoráveis | **PASSA** | 0 | 2 (m7, m8) | `pw/sem`, `pw/dist` e `z/dist10` passam: valores e posição da resposta certa sorteados, nenhum trio padrão. A luz e as perguntas "antes" mudam a ordem das opções com a semente (`t13`). Nenhum sorteio mudou desde a revisão 11. |
| 6 | Até 60 palavras por bloco | **PASSA** | 0 | 1 (m9) | `blocos`: 106.612 blocos no DOM, nas 5 causas, **0 acima de 60**. Maiores: `cracha_3` com 58, "Como funciona" com 58, final Ouro com 53. Textos novos: `foto_solo` 31, `coop_copia_ok` 22, `quadro_aberto` 31, ou 41 com a frase da noite D. Planta: no máximo 4 palavras ("Toda volta começa aqui."). |
| 7 | Documentação × dados × código | **PASSA** | 0 | 3 (m10, m11, m12) | O `loop-central-dados.js` é igual ao `pistas-v4.json` ("v4 revisão 13"). O validador imprime "revisão 13" (a m11 da rodada 10 fechou). As versões nas páginas batem com o registro: `style.css?v=26`, `loop-central-dados.js?v=37`, `loop-central.js?v=42`, `game.js?v=50`, `ritmo.js?v=10`, `bancada.css?v=6`, `conteudo.js?v=5`. `salas-loop.json` e `sala/conteudo.js` trazem as 2 frases novas. O LOOP-CENTRAL, a DECISOES e o ROTEIRO (parte 19) listam as mesmas mudanças do `diff`. Checklist recalculado igual: 232/27/9/9/4, ativas 210/211/210/210/215. |
| 8 | Registro de revisão e checklist | **PASSA** | 0 | 1 (m13) | As revisões 12 e 13 estão registradas no LOOP-CENTRAL e na DECISOES, com porquê, código, dados, testes e o que não foi aplicado. **Cópias:** os 19 arquivos que mudaram desde a revisão 11 têm cópia `_SUBSTITUIDO_` idêntica (md5) à versão da revisão 11: a cópia `26b` para quem mudou na revisão 12, a `26c` para os outros. 0 arquivo apagado, 0 cópia alterada (`an/copias.txt`). |
| 9 | Vocabulário de projeto e gênero | **PASSA** | 0 | 1 (m14) | Textos novos e planta: "Você está aqui", "Para onde você vai", "Museu · planta", "Toda volta começa aqui.", "Dá para ouvir a chuva fina.", "procure a pista". Sem identificador interno, sem "jogador" ou "aluno", sem marca de gênero. "Chavinha" agora tem um sentido só. O seletor de entrada é decisão do autor. `varre` não foi refeito (rodada 10: 0 em 3.220 telas). |
| 10 | Tela real sem camada antiga, sem erro de rede, sem 404 | **PASSA** | 0 | 2 (m15, m16) | **Rede** (`y/rede`, refeito sozinho): 848 pedidos, 0 resposta ≥ 400, 0 falha, 0 erro de página ou de console. `r404` OK. `z/entrada` OK. No `t13`, 0 pedido ruim e 0 erro em 10 partidas. A planta usa só as salas do Loop (15 botões `data-room`). `tl40`, `miss8` e `r7_miss8` passam (telão com 40 nomes, 8 missões). `torre15` e `varre` não foram refeitos; zoom da Galeria só pela leitura do código (`minDistance` 0,045 e `zoomToCursor` só na GAL_B, voltando a 0,12 nas outras). |

## Bloqueantes

Nenhuma.

## Menores (não bloqueiam)

**Item 1**
- **m1.** (Vem da rodada 10.) Na noite D, quem conserta pelo fusível de reserva pode chegar ao fim sem ter lido nada do Téo.
- **m2.** (Vem da rodada 10.) `coop_veredito` vai para os dois aparelhos da dupla. É decisão registrada.

**Item 3**
- **m3.** **Nova.** A planta não desenha a **Sala das esculturas (em reforma)**.
  - A pista `pose` (Área de descanso, volta 2) diz: "Pela porta de vidro da Sala das esculturas, em reforma, a escultura… aponta para a escada do Subsolo."
  - No Térreo da planta, a Área de descanso tem só a porta de vidro do Ateliê. Não existe sala de esculturas.
  - Não revela nada e não quebra a partida. Mas a planta e o texto discordam numa linha de visão.
  - A DECISOES (revisão 12) diz que "nada disso contradiz as pistas" sem citar `pose`.
  - Correção sugerida: uma área "Esculturas · em reforma", sem toque, com porta de vidro para a Área de descanso, perto do hall da escada.
- **m4.** (Vem da rodada 10, m3, preventiva.) O Subsolo tem 32 rótulos para 32 lugares na peça.
- **m5.** (Vem da rodada 10, m4.) A testa da máscara 3D fica à vista desde a volta 1. A revisão 13 registrou isso como intencional.

**Item 4**
- **m6.** (Vem da rodada 10, m5 e m6.) O simulador de texto é diferente do jogo no dossiê do grupo. Em dupla ou trio, o Ouro aparece só no DESFECHO DA TURMA (regra escrita).

**Item 5**
- **m7.** (Vem da rodada 10, m7.) A resposta certa de cada minijogo é sempre a mesma frase; só a posição muda.
- **m8.** (Vem da rodada 10, m8.) No minijogo de símbolos, a resposta é sempre "5º símbolo".

**Item 6**
- **m9.** (Vem da rodada 10, m9.) O "Dicionário das palavras" aberto passa de 60 palavras no conjunto; cada bloco fica abaixo.

**Item 7**
- **m10.** **Nova.** A DECISOES, revisão 13, "Não aplicado", diz: "Telão do simulador com largura fixa: ver `LOOP-CENTRAL.md`, 'Revisão 13'". O LOOP-CENTRAL, revisão 13, não fala do telão do simulador. A referência fica sem a explicação.
- **m11.** **Nova, de cache.** `index.html` e `sala/telao/index.html` continuam com `style.css?v=24`; as outras páginas já usam `v=26`.
  - O que mudou no CSS (planta, livro e `.tv-clock`) só vale no celular. Nada nessas duas páginas muda.
  - Basta subir o número para não sobrar cópia velha no navegador.
- **m12.** (Vem da rodada 10, m10.) O `GDD.md` usa termos antigos, há identificadores internos com palavra antiga e a etiqueta "MANUAL" aparece em 6 grupos. O comentário do `simulador-texto.py` ainda diz "revisão 11", e o motor está certo, sem mudança de regra.

**Item 8**
- **m13.** (Vem da rodada 10, m12 e m13.) Os testes e o resultado do validador citados no registro ficam fora do repositório (`/tmp/roda/...`). O registro da revisão 9 diz "52 px", mas o campo do código mede 50 px.

**Item 9**
- **m14.** (Vem da rodada 10, m14 e m15.) "Obrigado por participar!", "Simulador" e "Professor" na entrada, e "Troca sozinha" no telão. Padrão de sala, já registrado.

**Item 10**
- **m15.** (Vem da rodada 10, m16.) `sala/conteudo.js` e `game.js` ainda carregam as salas antigas. A tela filtra todas.
- **m16.** (Vem da rodada 10, m17.) `museu/` e `museu/torre/` sem `?loop=1` mostram o museu antigo para quem digita o endereço.

**Para quem mantém os testes:** `pw2/painel`, `n/extra`, `pw/meu` e `pl/jogo` (na captura "caminhando", quando a máquina está lenta) precisam ser atualizados para a planta. Antes de tocar na sala, eles têm que tocar na orelha do andar.

## Antes | agora | motivo

| # | Rodada 10 (rev. 11) | Rodada 11 (rev. 13) | Motivo |
|---|---|---|---|
| 1 | passa | passa | Planta conferida contra as pistas. Textos novos coerentes. |
| 2 | passa | passa | Nenhuma tranca mudou; os mesmos 330 toques. |
| 3 | passa | passa | Planta igual nas causas. Entra a m3 (sala de esculturas fora da planta). |
| 4 | passa | passa | Validador e código real continuam Ouro nas 5. |
| 5 | passa | passa | Sem mudança. |
| 6 | passa | passa | 0 bloco acima de 60. |
| 7 | passa | passa | Fechou a m11 antiga (linha do validador). Entram a m10 (referência sem conteúdo) e a m11 (`v=24`). |
| 8 | passa | passa | Cópias completas. |
| 9 | passa | passa | Textos novos limpos. |
| 10 | passa | passa | 848 pedidos e 0 erro; GLB, webp e páginas com 200. |

## Fim do ciclo

A conferência técnica **passou**: 10 de 10 itens, 0 bloqueante, 14 menores (3 novas: m3, m10 e m11). Para o próximo lote, a única nova que toca algo que quem joga vê é a **m3**: pôr a Sala das esculturas na planta.
