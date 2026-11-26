# Mosaico Loop v4 revisão 11 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: PASSA.** Os 10 itens passam, sem nenhuma falha bloqueante. Ficam 17 menores: campo interno, documento, decisão já registrada ou frase que não revela nada nem quebra a partida. A seção 4 só aceita "passa limpo", e as menores não impedem isso.

**Critério usado.** Bloqueante: quem joga vê, ou a partida quebra. Menor: campo interno, comentário, documento, frase que não revela nem quebra, ou decisão já registrada em "Ficou para decidir".

## Aviso sobre o estado auditado (ler antes)

- **A pasta mudou durante a auditoria.** Entre 09:42 e 09:45, alguém começou uma "revisão 12" (planta do museu). Mudaram `game.js` (`PLANTA`, `plantaLoop`, `marcarCaminhada`), `style.css`, `individual.html`, `sala/index.html` e `sala/simulador/index.html`. Apareceram também cópias `_SUBSTITUIDO_2026-11-26b` desses arquivos, de `DECISOES-V4.md` e de `LOOP-CENTRAL.md`.
  - **O que foi auditado é a revisão 11:** o retrato de 08:09 (`aud8/snap_ini.txt`, 1.002 arquivos).
  - Os testes que rodaram depois de 09:42:31 foram rodados de novo numa cópia idêntica à revisão 11, servida em `localhost:8766`. Essa cópia tem o md5 igual ao do retrato, arquivo por arquivo (`aud8/snap_rev11copia.txt`, `diff` vazio). São eles: `miss8`, `r7_miss8`, `tl40`, `sem`, `andar`, `dist`, `ivone`, `rede`, `torre15` e `hs2`. Saídas em `aud8/re/`.
  - Nada da revisão 12 foi avaliado.
- **Escrita minha no repositório (já desfeita).**
  - O validador rodou com `python3 -I`, e o `-I` faz o Python ignorar `PYTHONDONTWRITEBYTECODE`. Por isso ele criou `dados/__pycache__/simulador-texto.cpython-313.pyc` às 08:09:59.
  - Apaguei a pasta às 09:50. Não escrevi mais nada no repositório; os demais Python rodaram com a variável e sem `-I`, fora da pasta.
- **Datas.** Todos os arquivos da pasta estão com 08:07:44 (cópia em bloco). `dados/pistas-v4.json` tem o mesmo md5 de `/tmp/roda/v4_pistas.json` (03:02), que é o arquivo lido pelo `/tmp/roda/esc/r11/validar.txt` (07:41). `/tmp/roda/sim/validar.py` e `engine.py` são idênticos a `dados/validar.py` e `dados/simulador-texto.py`.

## O que a revisão 11 mudou, e foi olhado de novo

- **GAL_B com película da inscrição.** Carrega com 200. Na tela, a 5°, os 6 símbolos ficam legíveis: rosto, pedra, ver, noite, guardar virado e tempo. Batem com `LC_INSC` e com a faixa do minijogo (`aud8/g/testa_390_zoom_max.png`).
- **Zoom de 5° e alvo da câmera.** `min-field-of-view` 5deg e alvo `-0.12m 1.3m 0.03m`, iguais nas 5 causas.
  - Pedir 1° para em 5,0° em 390 e em 5,5° em 360 (proporção da tela).
  - Pedir 180° de giro para em 75°: `PECA_CANTO` continua valendo na Galeria.
- **2 lugares de ponto da GAL_B.** O lugar 2 (o terceiro da lista), "Inscrição na máscara", fica no alto da testa: aceso, à vista, 49 px do vizinho, dentro da caixa, igual nas 5 causas (`pnovo`). O lugar 7, "Um quadro torto", fica no quadro. Peça inteira e centrada (`torre15`).
- **D10 em `PECA_CANTO`.** O giro para em ±75°. Nenhum ponto fica fora de vista nas voltas 1 e 2 (Coleções: 12/7 e 16/13), igual nas causas (`giro`).
- **Minijogo sem desenho nos botões.** Os botões dizem só "5º/4º/3º/2º símbolo". Por toque: 10 de 10 certos (5 causas × 360×640 e 390×844).
  - A errada não entra no caderno e não gasta energia; a certa entra e gasta 1.
  - Sem rolar em 390×844 e 360×740 (`scrollHeight` = `clientHeight`).
- **Livro com caixa maior quando há tábua.** Classe `grande`, 318 px de caixa e o vão dos botões escondido. A tábua cabe inteira em 390 e 360, sem rolar dentro (`ll`).
- **Medidor único do Pátio.** "O medidor do quadro" e "Embaixo do medidor" aparecem nas 5 causas, cada uma com uma pista ativa:
  - A: `a_cheia_4`;
  - B, C e E: `fh_med_pot_bce`;
  - D: `fh_med_pot_d`.
- **`textoPorCausa` no `quadro_aberto`.** Só na noite D, e só depois de abrir: aparece no caderno em 10 de 10 telas da causa D e em 0 das outras. A frase fica no mesmo parágrafo (31 → 43 palavras). Rótulo, custo, tranca e frase de tranca ficam iguais nas 5. Não antecipa nada: a mesma informação já estava em `d_fus_2`, pista da noite D com o mesmo rótulo de `fh_vidro` nas outras noites.
- **Pistas reescritas.** 13 campos em 10 pistas, mais `solo_pistas` (detalhe nos itens 1, 6 e 7). Nenhuma entrou ou saiu, a ordem é a mesma, e nenhuma volta, horário, tranca, `precisaDe`, `soNaCausa` ou fonte mudou (`z/diff1011.txt`).

## Como foi conferido (tudo em `/tmp/roda/esc/r10/aud8/`)

- Copiei os scripts da rodada 9 (`aud7`), com os caminhos trocados, e escrevi 4 novos: `g/testa_jogo.mjs`, `z/sub5.mjs`, `z/vagas_patio.mjs` e `z/diff1011.py`.
- Rodei também os testes da revisão 11 (`s/mgest`, `s/ll` e `s/energia`).
- **Dados:** `an/dados`, `an/pares`, `an/palavras`, `an/docs`, `an/trio`, `n6/crono`, `n6/citacoes`, `n/pal` e `z/diff1011`.
- **Tela real:**
  - `pw/varre`: 10 partidas, 3.220 telas e 9.610 itens de lista;
  - `n/blocos`: 106.702 blocos;
  - `n6/man3`: 1.056 anotações;
  - `an/tela`, `an/lista_tela`, `an/vocab`, `an/conta_tela` e `n6/tela6`.
- **Pontos da peça:**
  - `x/hs2`: 15 salas × 5 causas, refeito em `re/hs2`;
  - `r8/pontos` (dados e tela): 150 combinações cada;
  - `y/pontos_cheio`: 1.575 combinações;
  - `x/forca`: 2.760 combinações;
  - `r8/pecas`, `r10/pnovo`, `z/giro` e `z/sub5`.
- **Toque de verdade nas 5 causas:** `n/trava_all`, `n6/janela`, `n6/mini`, `n6/sons`, `n6/campos`, `x/hs_toque`, `x/toques7`, `x/final_tela`, `n/mgluz`, `n/msgclique2`, `n/dura`, `pw2/mgpeca`, `pw2/barra`, `r10/insc`, `z/insc5` e `z/entrada`.
- **Código real:**
  - ordem: `n6/ordem`, `r7x/ordem` e `r8/r7_ordem`;
  - partidas: `pw/real_solo`, `n6/real_solo_teo`, `pw/real_par` e `x/real_trio`;
  - caminho da inscrição: `z/insc_caminho`;
  - sorteios: `re/pw_sem`, `re/pw_dist` e `z/dist10`;
  - rede e missões: `re/y_rede` e `re/y_ivone`;
  - outras telas: `pw/extras`, `pw/extra2`, `pw/meu`, `pw/tranca_causa`, `pw/tel`, `pw/reserva`, `pw2/painel`, `pw2/glos`, `pw2/cartoes`, `pw2/paginas`, `pw2/r404`, `n/extra`, `n/entrada`, `n6/glosh`, `n6/salagate` e `n6/torre6`.
- **Sala simulada:** 2 partidas inteiras (`n6/simrun6`), com 484 e 489 linhas distintas, lidas por `y/simscan.py`. Telão com 40 nomes (`re/r7x_tl40`); Missões com 8 missões e 40 nomes (`re/r7x_miss8` e `re/r8_r7_miss8`).
- **Simulador de texto:** `validar.py 2000` (`aud8/validar.txt`, APROVADO) e `an/trio.py`, com 1 a 5 pessoas × 5 causas.
- **Scripts que ficaram para trás** (o jogo está certo; o teste espera o comportamento antigo):
  - `n6/mini`: os mesmos 15 "minijogo não abriu" das rodadas 8 e 9;
  - `x/toques7`: "RUIM missões" (regra da Ivone da revisão 8).
- **Falso alarme resolvido:** na primeira passada, `x/hs2` mostrou o Subsolo com desenho diferente na causa A. Era a primeira peça carregada, com a câmera ainda andando enquanto outros testes ocupavam a máquina.
  - Prova: em `z/sub5`, 6 carregamentos (A, B, C, D, E e A de novo) dão posições 3D, câmera e campo de visão idênticos.
  - Em `re/hs2`, rodado sozinho, dá 0 de 15.

**O que não foi coberto.** A sala de verdade, com Firebase e vários celulares (usei o simulador de sala). iPhone (o Chrome desenhou por software). O pinça de zoom real: o limite de 5° foi conferido pela propriedade `fieldOfView`, que é o que o gesto altera.

## Tabela

| # | Item | Resultado | Bloqueantes | Menores | Evidência |
|---|---|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | 0 | 2 (m1, m2) | **Horários:** 17 pistas com horário, iguais à revisão 10. Nenhum campo mudado mexe em `volta_min`, `segundo_min` ou `soNaCausa`. Nos 9.610 itens de lista, 0 horário fora do dado. **Testemunhas** (`crono.py`, igual à rodada 9): Braga na Central; Seu Dirceu, Nico e Ivone cada um na sua sala; Aurélio só na Galeria (a fala nova "Na testa dela tem uma frase; eu sei de cor, nunca mais li" é na Galeria); Dra. Sato só por interfone e em papel. **Coerência dos textos novos:** "A testa do molde é lisa" (`falsa_3`) × "riscados à mão, de traço novo" (`insc_copia`): sem conflito. `quadro_aberto` na noite D repete `d_fus_2` ("segundo cadeado, amarelo, pendurado aberto"), e `d_fus_2b` volta ao mesmo cadeado. O medidor redondo e a chavinha embaixo dele ficam coerentes nas 5 noites: A ligada e cheia; D com carga cheia e chavinha desligada; B, C e E com vidro embaçado e chavinha desligada. "Caixa de transporte com espuma" combina com a peça de 4,2 kg. "Chuva fina na pedra molhada" combina com a chuva das pistas. **Finais:** real e telão como antes (sirene só com o interfone; Téo acorda só se alguém viu). |
| 2 | Origem, volta e quem vê | **PASSA** | 0 | 0 | 281 pistas, ids únicos; `quemPodeVer` "todos" nas 281. 88 com `precisaDe`, e as 88 com `porque`. 0 referência quebrada; 0 pista inalcançável (validador). **Caminho da inscrição, nas 5 causas** (`insc_caminho`): a tábua abre na volta 1. A inscrição não abre na volta 1, sem a tábua ou sem o cheiro; abre na volta 2. A testa verdadeira não abre sem a caixa. Só com a inscrição, Braga e escada abrem e o grupo e o fato contam. **Toque em toda pista travada:** 66 trancas × 5 causas = 330 toques. Todos dão a frase certa, com 0 energia gasta, 0 pista entrando, 0 botão coberto e 0 frase diferente entre causas. 137 botões de janela: 0 vazio, 0 escondido, 0 sumido. |
| 3 | Palavras proibidas e prévias (ordem, pontos, contagem, custo, ícone, altura, `textoPorCausa`, sinal da causa) | **PASSA** | 0 | 2 (m3, m4) | **Prévias:** 219 chaves de sala e rótulo, 0 diferença por campo entre causas. As 11 atividades de conserto aparecem só depois do diagnóstico. Contagem por sala igual nas 5 causas, nos dados e na tela (Pátio 16; Galeria 8; Coleções 12). O rótulo novo "Embaixo do medidor" existe nas 5 causas. **Ordem:** 0 de 75; 2 × 22.500 comparações, 0. **Pontos:** 0 de 15 salas diferentes (`re/hs2`); 0 em 150 + 150 (dados e tela, menor distância 49 px); 0 em 1.575 com o caderno enchendo; os 8 pontos da Galeria na volta 1 têm a mesma posição 3D nas 5 causas. A troca do rótulo do Pátio deslocou 13 dos 18 rótulos para o lugar vizinho, igual em todas as causas (`z/vagas_patio`). **Causa trocada:** 2.760 combinações, 0 diferença em rótulo, ordem, quantidade, custo, ícone, "ainda não", "travada", altura e largura. **`textoPorCausa`:** só no caderno, depois de abrir, e na noite D (detalhe acima). **Minijogo:** a pergunta é a mesma nas 5 (1 texto); a ordem dos botões sai da semente. **Palavras:** "Lenz" em 0 telas das voltas 0 a 2 e 0 antes da volta 3 nas 2 salas simuladas. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | 0 | 2 (m5, m6) | **Simulador:** `validar.py` com 2.000 bots, APROVADO nas 5 causas. Ótimo com 1, 2 e 3 pessoas chega ao Ouro na volta 5, com mais 4 jogos de valores sorteados (todos Ouro). Bot aleatório de 0,00% a 0,05%. 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. `trio.py`: 25 de 25 Ouro (1 a 5 pessoas × 5 causas). **Código real:** sem dupla, Ouro nas 5; também Ouro nas 5 sem revelar o Téo. 2 aparelhos e 3 aparelhos: DESFECHO DA TURMA Ouro nas 5. **Prova da cópia:** 6 fontes; a inscrição sozinha basta nas 5 causas (`insc_caminho`, `insc5`). `solo_pistas` agora tem `insc_copia`. Missão da Ivone igual à regra da revisão 8. |
| 5 | Códigos decoráveis | **PASSA** | 0 | 2 (m7, m8) | **4.000 sementes** (`re/pw_sem`): dia com 17 valores (217 a 274 cada); hora com 5 (755 a 818); 6 ordens (636 a 694); 3 chaves (1.301 a 1.363); 5 causas (760 a 851, 19,0% a 21,3%); registro de 105 a 994, com 881 valores distintos. 0 partida com o trio padrão; 0 marcador `{…}` sobrando. **Posição da resposta certa em 3.000 sorteios** (`re/pw_dist`): luz 690 a 792; listas 964 a 1.024; foto 730 a 778; caixa 716 a 799; fita 987 a 1.015; acusação 726 a 787; cópia 963 a 1.043; "antes da luz" 972 a 1.028; símbolos 717 a 770 (4 ordens). |
| 6 | Até 60 palavras por bloco | **PASSA** | 0 | 1 (m9) | 106.702 blocos no DOM, nas 5 causas: **0 acima de 60.** Maiores: `cracha_3` com 58, "Como funciona" com 58, interfone com 58 (25 variantes), pendrive com 56, final Ouro com 53. Caderno cheio: 1.056 anotações, com o rótulo em linha própria em todas. **Textos novos:** `insc_copia` 42 (eram 50); `insc_tabua` 39; `aurelio_1` 38; `nico_1.porque` 38; `quadro_aberto` 31, ou 43 com a frase da noite D; `a_cheia_4` 25. Telão: letra mínima de 1,35% da largura com 40 nomes, 0 corte. Maior linha da sala simulada: 37 palavras (a tranca do quadro). |
| 7 | Documentação × dados × código | **PASSA** | 0 | 2 (m10, m11) | Os dados e o `loop-central-dados.js` dizem "v4 revisão 11 (26/11/2026)" (idênticos). O comentário de `validar.py` e `simulador-texto.py` também diz "revisão 11", mas a linha que o validador imprime não diz (m11). Versões nas páginas batem com o registro: `style.css?v=24`, `loop-central-dados.js?v=36`, `loop-central.js?v=41`, `game.js?v=48`, `sala.css?v=7`, `bancada.css?v=5` e `minigames.mjs?v=8`, sem nenhuma referência velha nas páginas carregadas. `LC_MG.insc_copia` está sem `img`, e o ramo `glifos` sem desenho, como registrado. Os 13 campos mudados e `solo_pistas` estão listados no LOOP-CENTRAL e na DECISOES. O ROTEIRO (parte 18) e as FICHAS contam a mesma coisa, inclusive `v4_teo`. Checklist recalculado: 232/27/9/9/4 = 281; tipos 216/26/21/16/2; ativas 210/211/210/210/215; itens por sala na volta 1 iguais nos dados, no documento e na tela (15 salas). `n6/citacoes.py`: 37 trechos do ROTEIRO sem correspondência literal (eram 33). Os 4 novos são resumos da parte 18; li um por um, e nenhum contradiz os dados. **Fechada:** m10 da rodada 9 (`solo_pistas` sem a inscrição). |
| 8 | Registro de revisão e checklist | **PASSA** | 0 | 2 (m12, m13) | LOOP-CENTRAL "Revisão 11" tem o porquê, a peça e a miniatura, o código arquivo por arquivo, os dados (com "Rótulos que mudaram: 3", que confere), o validador, os testes e o não aplicado. DECISOES "Revisão 11" tem "Escolhas", "Não aplicado" e "Ficou para decidir". Checklist com o cabeçalho "revisão 11: nenhuma pista entrou ou saiu", que confere. **Cópias:** os 25 arquivos que mudaram desde o fim da rodada 9 têm cópia `_SUBSTITUIDO_2026-11-26a` idêntica (md5) à versão auditada na rodada 9. 0 sem cópia; 0 arquivo apagado. **Fechada:** m12 da rodada 9 (a troca de `v4_teo` agora está registrada, na DECISOES e nas FICHAS). |
| 9 | Vocabulário de projeto e gênero | **PASSA** | 0 | 2 (m14, m15) | 3.220 telas, 973 linhas das 2 salas simuladas e a torre: 0 identificador interno; 0 "jogador", "investigador", "aluno" ou nome de escala ou revisão; 0 "carga" como recurso. "Escala de crachás" é objeto da história. "Pronto" só aparece para coisa ("deixar pronto o que o conserto pede"). Textos novos sem marca de gênero ("Você confere com a tábua", "Ele pediu... espera.", "A tábua, do seu caderno"). O seletor "Bem-vindo / Bem-vinda / Tanto faz" é decisão do autor e não foi contado. |
| 10 | Tela real sem camada antiga, sem erro de rede, sem 404 | **PASSA** | 0 | 2 (m16, m17) | **Rede** (`re/y_rede`, revisão 11): 843 pedidos, 0 resposta ≥ 400, 0 falha, 0 erro de página ou de console. Os 15 GLB com 200, inclusive a GAL_B nova (797 KB). `r404`: 4 páginas, 0. Entrada em 7 tamanhos: 0 pedido ruim. **Peças:** inteiras e centradas nas 15 salas (`re/r8_r7_torre15`, rodado sozinho, 0 falha); pontos das peças dentro da tela (`pecas`, Galeria com 72 px de folga). **Torre `?loop=1`:** 15 salas, 0 de fora, 0 faltando, andares iguais; "Sair" volta a `individual.html` e a `index.html`. **Camada antiga:** 9.610 itens de lista, 0 fora da história (13.270 antigas filtradas); mapa com 15 salas nas 50 telas. **Visual novo:** tábua e inscrição com 44 px por símbolo, sem transbordar; minijogo e livro sem rolar; energia 22 px. **Telão:** 0 estouro com 40 nomes; Missões com 8 missões e 40 nomes, 0 corte. |

## Antes | agora | motivo

| # | Rodada 9 (rev. 10) | Rodada 10 (rev. 11) | Motivo |
|---|---|---|---|
| 1 | passa | passa | Refeito. Textos novos sem testemunha nem horário novo; o medidor virou um objeto só e ficou coerente nas 5 noites. |
| 2 | passa | passa | Nenhuma tranca mudou: os mesmos 330 toques, 0 diferença. |
| 3 | passa | passa | `textoPorCausa` da noite D só depois de abrir. Os pontos novos da Galeria e o giro da D10 ficam iguais nas causas. Entra a m4 (a testa 3D à vista desde a volta 1). |
| 4 | passa | passa | Sem mudança de regra; o código real e o simulador continuam Ouro nas 5. |
| 5 | passa | passa | Os botões sem desenho não mudam o sorteio da ordem. |
| 6 | passa | passa | `insc_copia` ficou menor (50 → 42); maior bloco continua 58. |
| 7 | passa | passa | Fechada a m10 da rodada 9. Entra a m11 (linha impressa pelo validador). |
| 8 | passa | passa | Fechada a m12 da rodada 9 (`v4_teo` registrado). |
| 9 | passa | passa | Nada novo. |
| 10 | passa | passa | GAL_B nova carregando, 0 erro de rede. |

## Bloqueantes

Nenhuma.

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **m1.** (rodada 9, m1.) Na noite D, quem conserta pelo fusível de reserva pode chegar ao fim sem ter lido nada do Téo. O "Caso aberto" fala em "cópia" para quem pode não ter achado a troca.
- **m2.** (rodada 9, m2.) `coop_veredito` vai para os dois aparelhos da dupla (decisão registrada).

**Prévias (item 3)**
- **m3.** (rodada 9, m3, preventiva.) O Subsolo continua com 32 rótulos para 32 lugares na peça. O Pátio passou de 17 para 18 rótulos (com 16 na lista da volta 1), bem abaixo de 32.
- **m4.** (nova, preventiva.) A testa da máscara 3D mostra os 6 símbolos, com o 5º virado, desde a volta 1 e em todas as causas. Quem já pegou a tábua na volta 1 pode comparar e desconfiar da cópia uma volta antes da pista `insc_copia` (volta 2).
  - Não é sinal da causa: a máscara é a mesma nas 5.
  - Nada entra no caderno sem a pista, e o Revelar continua pedindo as provas no caderno.
  - É a mesma natureza do "cheiro de verniz" da volta 1, mas fica registrado.

**Fontes (item 4)**
- **m5.** (rodada 9, m4.) O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência e no limite de atividades em dupla (registrado). O caminho ótimo dele não usa a inscrição; isso foi conferido no código real.
- **m6.** (rodada 9, m5.) Em dupla ou trio, o aparelho que não está no Subsolo termina em "Caso aberto", "Parcial", "Desligar" ou "A verdade apareceu". O Ouro aparece no DESFECHO DA TURMA (regra escrita).

**Códigos (item 5)**
- **m7.** (rodada 9, m6.) A resposta certa de cada minijogo é sempre a mesma frase (só a posição é sorteada), e errar não custa nada ("Ficou para decidir").
- **m8.** (rodada 9, m7.) No minijogo de símbolos, a resposta é sempre "5º símbolo". Agora os botões não têm desenho, mas quem já jogou ainda pode tocar no 5º sem conferir. Não abre nada antes da hora: a pista continua pedindo o cheiro, a tábua, a volta 2 e 1 de energia.

**Palavras (item 6)**
- **m9.** (rodada 9, m8.) O "Dicionário das palavras", somado ao cartão aberto, passa de 60 palavras no conjunto; cada bloco fica abaixo (decisão registrada).

**Documentos (item 7)**
- **m10.** (rodada 9, m9.) `GDD.md` com termos antigos; identificadores internos com palavra antiga; `prova_falsa` lista `c_peca` por fora do `grupoFonte`; etiqueta "MANUAL" em 6 grupos (todos registrados).
- **m11.** (nova, interna.) A linha que o validador imprime continua "VALIDADOR LOOP v4 revisão 10" (`dados/validar.py`, linha 589), inclusive no `/tmp/roda/esc/r11/validar.txt` citado no registro. Só o comentário da linha 2 diz "revisão 11". O LOOP-CENTRAL diz "Só o cabeçalho (revisão 11)". Ninguém que joga vê isso.

**Registro (item 8)**
- **m12.** (rodada 9, m11.) Os testes e o resultado do validador citados no registro ficam fora do repositório (`/tmp/roda/esc/r11/...`).
- **m13.** (rodada 9, m13.) O registro da revisão 9 diz "52 px ou mais" na entrada compacta. O campo do código continua com 50 px em 360×740 e 720×780 (acima dos 44 de toque).

**Vocabulário (item 9)**
- **m14.** (rodada 9, m14.) "O Professor encerrou a aula. Obrigado por participar!" (padrão dos jogos de sala; "Ficou para decidir").
- **m15.** (rodada 9, m15.) "Simulador" e "Professor" na entrada como nomes do padrão de sala; no telão, "Troca sozinha: sim/não" fala da troca de página.

**Camada antiga (item 10)**
- **m16.** (rodada 9, m16.) `sala/conteudo.js` e `game.js` ainda carregam as salas e pistas antigas; a tela filtra todas (13.270 filtradas, 0 mostrada).
- **m17.** (rodada 9, m17.) `museu/` e `museu/torre/` sem `?loop=1` mostram o museu antigo para quem digitar o endereço; nenhum botão do jogo leva até lá.

*Fora da seção 4 (para a escala visual):* no livro da Conservação, em 360 de largura, a palavra "guardar" da tábua encosta na borda do quadradinho (`aud8/s/livro_tabua_360.png`).

## Fim do ciclo

A conferência técnica **passou**: 10 de 10 itens, 0 bloqueante, 17 menores. Das 17 menores da rodada 9, fecharam 2 (m10 `solo_pistas` e m12 `v4_teo`); entraram 2 novas (m4 testa 3D à vista desde a volta 1; m11 linha impressa pelo validador).

A revisão 11 mexeu em texto visível (10 pistas, o minijogo, o livro e a peça da Galeria). Pela regra 0.3, a etapa 1 (história) e as seguintes precisam ser conferidas com esse texto, se ainda não foram. Das menores, as que tocam texto ou tela visível são m1, m4, m7, m8 e m14.

**Atenção para a próxima rodada:** a pasta já tem trabalho da "revisão 12" em andamento (planta do museu, desde 09:42). Este relatório vale só para a revisão 11 (retrato de 08:09).
