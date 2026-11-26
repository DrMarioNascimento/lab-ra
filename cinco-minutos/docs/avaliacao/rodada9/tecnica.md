# Mosaico Loop v4 revisão 10 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: PASSA.** Os 10 itens passam. Nenhuma falha bloqueante. Ficam 17 menores: campo interno, documento, decisão já registrada ou frase que não revela nada nem quebra a partida. A seção 4 aceita só "passa limpo", e as menores não impedem.

**O que as revisões 9 e 10 mudaram, e foi olhado de novo:**
- **Peças Q01 (Pátio) e D10 (Coleções):** carregam com 200 nas entradas de sala. Os pontos ficam iguais nas 5 causas e caem dentro da peça (menor distância 48 px no Pátio, 49 px nas Coleções).
- **Pátio reescrito (14 pistas):** nenhuma testemunha, horário, tranca ou rótulo fica diferente entre as causas. A regra da fresta vale nos 9 textos: dá para ver e contar as chaves e ver o cadeado amarelo, mas não para ler as etiquetas.
- **3 pistas novas da inscrição:**
  - as trancas seguram nas 5 causas: sem a tábua não abre, sem o cheiro de verniz não abre, e não abre na volta 1;
  - a inscrição sozinha já serve de prova da cópia: abre o Braga (volta 3), a fala na escada (volta 4), o Revelar e a fita do tempo;
  - `prova_falsa` tem as 6 fontes iguais nos dados, no `loop-central-dados.js`, em `LC_FATO_PISTA`, em `cracha_3`, em `lenz_1` e na tranca;
  - ela não entrega a troca mais cedo que as outras provas (detalhe no item 2).
- **Minijogo de símbolos:**
  - por toque nas 5 causas, em 390×844 e 360×640: 10 de 10 certos. A errada não gasta energia nem fecha a janela; a certa gasta 1 e põe a pista no caderno;
  - a ordem dos 4 botões muda com a semente: em 3.000 sorteios, a certa cai de 717 a 781 vezes em cada posição;
  - a resposta é sempre "5º símbolo" (menor m7).
- **Livro da Conservação:** a tábua vem logo depois do número; 12 símbolos com 44 px, embaixo do livro e no caderno.
- **Giro limitado nos 5 cantos:** pedir 180° ou 120° para.
  - O giro para em ±75° nas 5 salas.
  - Todos os pontos da lista ficam à vista em algum ângulo permitido, nas voltas 1 e 2.
  - Fica igual nas causas.
- **Entrada compacta:** em 360×740 cabe tudo sem rolar, até "Jogar sem turma". Os botões ficam com 52 px ou mais (o campo do código tem 50), sem erro de rede.

**Critério usado.** Bloqueante: quem joga vê, ou a partida quebra. Menor: campo interno, comentário, documento, frase que não revela nem quebra, ou decisão já registrada em "Ficou para decidir".

**Estado auditado (26/11/2026, 00:46 a 02:27).** Os 973 arquivos da pasta ficaram iguais do começo ao fim (md5 em `aud7/snap_ini.txt` e `aud7/snap_fim.txt`, `diff` vazio). Não escrevi nada no repositório: Python rodou com `PYTHONDONTWRITEBYTECODE=1`, e `-I` onde o script não importa nada da pasta. Nenhum `__pycache__` foi criado lá.
- `dados/pistas-v4.json` 00:45:34 (281 pistas, "v4 revisão 10"). `loop-central-dados.js` é idêntico ao JSON.
- `/tmp/roda/sim/validar.py` e `engine.py` são idênticos a `dados/validar.py` e `dados/simulador-texto.py`.
- O `validar.txt` citado no registro (`/tmp/roda/esc/r10/validar.txt`, 00:36) é anterior aos dados finais (00:45). Rodei de novo com os dados finais: `aud7/validar.txt`, APROVADO.

**Como foi conferido (tudo em `/tmp/roda/esc/r9/aud7/`).** Copiei os scripts da rodada 8 (`an/`, `n/`, `n6/`, `pw/`, `pw2/`, `x/`, `y/`, `r7x/`, `r8/`), com os caminhos trocados para `aud7`. Também copiei `r10/insc.mjs` e `r10/pnovo.mjs` e escrevi 8 scripts novos em `z/`.
- **Dados:** `an/dados.py`, `an/pares.py`, `an/palavras.py`, `an/docs.py`, `an/trio.py`, `n6/crono.py`, `n6/citacoes.py` e `n/pal.py`.
  - `z/diff810.py` compara campo a campo a revisão 8 auditada (`_SUBSTITUIDO_2026-11-25l`, mesmo md5 do fim da rodada 8) com a 10.
  - Resultado: 3 pistas novas, 0 saíram, a ordem das antigas é a mesma, 30 campos mudaram em pistas antigas e 4 nas regras e no final.
- **Pontos da peça:**
  - `x/hs2.mjs`: 15 salas × 5 causas;
  - `r8/pontos.mjs dados` e `r8/pontos.mjs tela`: 150 combinações cada, a tela em 390×844 e 360×740;
  - `y/pontos_cheio.mjs`: 3 sementes × 525, total 1.575, com o caderno enchendo;
  - `x/forca.mjs`: 2.760 comparações com a causa trocada;
  - `r8/pecas.mjs`, `r10/pnovo.mjs` e o novo `z/giro.mjs`.
- **Tela real (`individual.html`):** `pw/varre.mjs` fez 10 partidas (2 por causa), com 3.220 telas e 9.610 itens de lista. `n/blocos.mjs` mediu 106.702 blocos no DOM. `n6/man3.mjs` encheu o caderno nas 5 causas.
- **Toque de verdade nas 5 causas** (`hasTouch`; 390×844, 360×740 e 360×640):
  - de antes: `n/trava_all`, `n6/janela`, `n6/mini`, `n6/sons`, `n6/campos`, `n6/torre6`, `r8/r7_torre15` (rodado sozinho), `x/final_tela`, `x/toques7`, `x/hs_toque`, `n/msgclique2`, `n/dura`, `n/mgluz`, `pw2/mgpeca` e `pw2/barra`;
  - novos: `r10/insc.mjs` (2 tamanhos), `z/insc5.mjs` (minijogo de símbolos, 5 causas × 2 tamanhos) e `z/entrada.mjs` (7 tamanhos).
- **Código real:**
  - ordem das listas: `n6/ordem` (600 partidas, 0 de 75), `r7x/ordem` e `r8/r7_ordem` (22.500 comparações cada);
  - partidas: `pw/real_solo`, `n6/real_solo_teo`, `pw/real_par` e `x/real_trio`;
  - sorteios: `pw/sem` (4.000), `pw/andar`, `pw/dist` e o novo `z/dist10.mjs` (3.000, minijogo de símbolos);
  - caminho da inscrição: o novo `z/insc_caminho.mjs`;
  - rede e missões: `y/rede.mjs` (822 pedidos) e `y/ivone.mjs`;
  - outras telas: `pw/extras`, `pw/extra2`, `pw/meu`, `pw/tranca_causa`, `pw/tel`, `pw/reserva`, `pw2/painel`, `pw2/glos`, `pw2/cartoes`, `pw2/paginas`, `pw2/r404`, `n/extra`, `n/entrada`, `n6/glosh` e `n6/salagate`.
- **Sala simulada:** 2 partidas inteiras em `sala/simulador/` com `n6/simrun6.mjs`: 503 e 510 linhas distintas, lidas por `y/simscan.py`. Telão com 40 nomes em `r7x/tl40`. Missões com 8 missões e 40 nomes em `r7x/miss8` e `r8/r7_miss8`.
- **Simulador de texto:** `validar.py 2000` com `LOOP_DATA` no repositório, mais `an/trio.py` (1 a 5 pessoas).
- **Scripts que ficaram para trás** (o jogo está certo; o teste espera o comportamento antigo, como registrado na DECISOES "Revisão 9"):
  - `x/toques7.mjs`: "RUIM missões" (a regra da Ivone mudou na revisão 8);
  - `n6/mini.mjs`: 15 "minijogo não abriu" na segunda sala (o minijogo abre uma vez por atividade e por volta). São os mesmos 15 da rodada 8.

**O que não foi coberto.**
- Não abri a sala de verdade, com Firebase e vários celulares: usei o simulador de sala e, no telão, estado injetado.
- Nas 2 salas simuladas ninguém cumpriu missão (Missões cheia só com estado injetado).
- Não testei em iPhone. O Chrome desenhou por software.
- Não conferi se a textura do modelo GAL_B traz símbolos na testa. A miniatura V11, usada no minijogo, não traz.

## Tabela

| # | Item | Resultado | Bloqueantes | Menores | Evidência |
|---|---|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | 0 | 2 (m1, m2) | **Horários:** 17 pistas com horário, como antes. Nenhum dos 34 campos mudados mexe em `volta_min`, `segundo_min` ou `soNaCausa`, e as 3 pistas novas têm `segundo_min` 0. Nos 9.610 itens de lista, 0 horário fora do dado mais o deslocamento do raio (5 horas sorteadas). **Testemunhas** (`crono.py`): Braga na Central; Seu Dirceu, Nico e Ivone cada um na sua sala; Aurélio só na Galeria; Dra. Sato só por interfone e em papel. **Fechadas:** o Nico não é mais citado no Pátio ("Segundo o Nico", era m4), e o "corredor" saiu do bilhete do armário (0 de 50 telas, era m3). **Novas pistas:** a tábua fica no livro de registro da Conservação, onde está o livro; a testa verdadeira fica nas Coleções, onde está a caixa. No Ouro, o Aurélio fica na Galeria e "a notícia sobe". **Finais:** 35 de 35 certos (30 no celular por toque, 5 no telão). Sirene só com a conversa do interfone; o Téo só acorda se alguém viu ele. O Ouro sem ter visto o Téo vem sem as duas frases, também no código real. |
| 2 | Origem, volta e quem vê | **PASSA** | 0 | 0 | 281 pistas, ids únicos. `quemPodeVer` "todos" nas 281. 88 com `precisaDe`, e as 88 com `porque`. 0 referência quebrada; 0 pista inalcançável nas 5 causas (validador). **Pistas novas, nas 5 causas** (`z/insc_caminho.mjs`): a tábua abre na volta 1; a inscrição da cópia não abre na volta 1, nem sem a tábua, nem sem o cheiro; a testa verdadeira não abre sem a caixa. Com a inscrição como única prova, o Braga (volta 3) e a fala na escada (volta 4) abrem, e o Revelar conta a prova. **Cedo demais? Não.** A inscrição abre na volta 2, como laudo, molde, caixa e foto. Custa 2 de energia no total (tábua 1 + inscrição 1), contra 0 do laudo e do molde, 2 da caixa (1 + 1) e 2 da foto. Além disso pede o minijogo. Na volta 1 a lista da Galeria não mostra o item (8 itens, como antes). A tábua só diz "alguns são quase iguais", e a miniatura da máscara não tem símbolos. **Toque em toda pista travada:** 66 trancas × 5 causas = 330 toques. Os 330 dão a frase certa, com 0 de energia gasta, 0 pista entrando, 0 botão coberto e 0 frase diferente entre causas. Nenhum item preso embaixo da barra (15 salas, 2 tamanhos). |
| 3 | Palavras proibidas e prévias (ordem, pontos, contagem, custo, ícone, altura) | **PASSA** | 0 | 1 (m3) | **Prévias:** 219 chaves de sala e rótulo e 0 diferença por campo entre causas, além das 11 atividades de conserto, que aparecem depois do diagnóstico. Validador (g) e (g2) OK. Contagem por sala igual nas 5 causas, nos dados e na tela (Conservação 11; Galeria e Coleções sem mudança na volta 1). Os 4 rótulos novos da revisão 9 seguem o par: `a_falsa_2x` e `fh_etq_chave` = "Adesivo na porta do quadro". **Ordem:** 600 partidas, 0 de 75; 2 × 22.500 comparações, 0. **Pontos da peça:** 0 de 15 salas com desenho diferente; 0 em 150 + 150 combinações (dados e tela, 2 tamanhos); 0 em 1.575 com o caderno enchendo (186 pistas pela mesma sequência nas 5 causas); os 2 pontos novos ficam no mesmo lugar nas 5 causas. **Causa trocada:** 2.760 comparações, 0 diferença em rótulo, ordem, quantidade, custo, ícone, "ainda não", "travada", altura e largura. **Minijogo de símbolos:** a ordem dos botões não depende da causa (sai da semente do museu); a pergunta é a mesma nas 5. **Palavras:** "Lenz" em 0 das 1.280 telas das voltas 0 a 2 e 0 antes da volta 3 nas 2 salas simuladas; nome do defeito na aba Atividades sem diagnóstico, 0 em 800. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | 0 | 2 (m4, m5) | **Simulador:** `validar.py` com 2.000 bots, "APROVADO nas 5 causas". Ótimo com 1, 2 e 3 pessoas: Ouro na volta 5, com 4 jogos de valores sorteados a mais. `trio.py`: 25 de 25 Ouro (1 a 5 pessoas × 5 causas). Bot aleatório: 0,00% a 0,05%. 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. **Código real:** 1 pessoa, Ouro nas 5. 2 aparelhos: DESFECHO DA TURMA Ouro nas 5. 3 aparelhos: DESFECHO DA TURMA Ouro nas 5. Ouro sem ver o Téo, nas 5. **Prova da cópia:** agora 6 fontes em 3 salas. A inscrição sozinha basta para Braga, escada e Revelar nas 5 causas. Minijogo por toque nas 5 causas: a certa põe a pista no caderno. Missão da Ivone igual à regra da revisão 8, nas 5 causas. |
| 5 | Códigos decoráveis | **PASSA** | 0 | 2 (m6, m7) | **4.000 sementes:** dia de 9 a 25 (17 valores, 217 a 259 cada); hora em 5 valores (743 a 837); registro de 105 a 994 (876 distintos); 6 ordens (627 a 707); 3 chaves (1.290 a 1.383); 5 causas com 793 a 809 cada (19,8% a 20,2%). 0 partida com o trio padrão; 0 marcador `{…}` sobrando nas 3.220 telas e nas 2 salas simuladas. **Posição da resposta certa em 3.000 sorteios:** luz 716 a 785; listas 970 a 1.022; foto 715 a 779; caixa 701 a 786; fita 989 a 1.006; acusação 742 a 760; cópia 968 a 1.024; "antes da luz" 969 a 1.031; **símbolos 717 a 781 (4 ordens que giram).** |
| 6 | Até 60 palavras por bloco | **PASSA** | 0 | 1 (m8) | 106.702 blocos medidos no DOM nas 5 causas: **0 acima de 60.** Maiores: `cracha_3` 58 (era 53, ganhou "ali do lado da limpeza"); "Como funciona" 58; interfone 58 (25 variantes); pendrive 56. Caderno cheio: 1.056 anotações, rótulo em linha própria em todas (por isso `cracha_3`, com 58 + 3 do rótulo, não passa de 60 num bloco). Textos novos: `insc_copia` 50 a 51 (a reticência conta ou não), `insc_tabua` 43, `insc_verdadeira` 41, final Ouro 53, pergunta do minijogo 17. Telão: letra mínima de 1,35% da largura com 40 nomes, 0 corte. Maior linha da sala simulada: 34 palavras. |
| 7 | Documentação × dados × código | **PASSA** | 0 | 2 (m9, m10) | Cabeçalhos "revisão 10" nos dados, no `loop-central-dados.js`, no validador, no simulador de texto e no LOOP-CENTRAL. Versões nas páginas batem com o registro (`loop-central-dados.js?v=35`, `loop-central.js?v=40`, `game.js?v=47`, `minigames.mjs?v=7`, `bancada.css?v=4`). `glifos.svg` com os 14 símbolos que o registro descreve. `LC_INSC` igual ao campo `insc` do minijogo. Os campos mudados nas revisões 9 e 10 estão no LOOP-CENTRAL e na DECISOES, menos `v4_teo` (m12). Checklist: 232/27/9/9/4 = 281; tipos 216/26/21/16/2; ativas 210/211/210/210/215. Itens por sala na volta 1 iguais nos dados, no documento e na tela (15 salas). A fonte nova "Inscrição na máscara" está na tabela de fontes e na escada. **Fechadas da rodada 8:** m10 (ROTEIRO: tampa, cadeado vermelho de aviso, duas fotos e "pra te pagar" corrigidos), m11 (DECISOES: três fotos), m12 (minijogo da caixa: "Na estante, caixas etiquetadas") e m14 (`museu/pontos-pecas.html` no LOOP-CENTRAL). `n6/citacoes.py` acha 33 trechos do ROTEIRO sem correspondência literal (eram 26). Os 7 a mais são resumos das partes 16 e 17; li um por um e nenhum contradiz os dados. |
| 8 | Registro de revisão e checklist | **PASSA** | 0 | 3 (m11, m12, m13) | LOOP-CENTRAL tem "Revisão 9" e "Revisão 10" com o porquê, peças, código arquivo por arquivo, dados, validador, testes e o que não foi aplicado. DECISOES tem as duas seções, com "Decisão do autor", "Escolhas", "Não aplicado" e "Ficou para decidir". Checklist recalculado para a revisão 10, com os números certos (item 7). **Cópias:** os 32 arquivos que mudaram desde o fim da rodada 8 têm cópia `_SUBSTITUIDO_` idêntica (md5) à versão auditada na rodada 8 (0 sem cópia). 1 arquivo novo (`glifos.svg`). A m15 da rodada 8 (registro dizia que nenhum rótulo mudou) está fechada. |
| 9 | Vocabulário de projeto e gênero | **PASSA** | 0 | 2 (m14, m15) | 3.220 telas, 1.013 linhas das 2 salas simuladas e a torre: 0 identificador interno; 0 "solo", "coop", "semente", "rodada", "jogador", "investigador" ou "aluno"; 0 nome de escala ou de revisão; 0 "carga" como recurso. "Escala de crachás" é objeto da história. "Pronto" só para coisa. Textos novos sem marca de gênero ("Você confere com a tábua", "Quem gravou... Quem copiou com pressa, sim", "Vale pôr ao lado"); botões "Nº símbolo". O seletor "Bem-vindo / Bem-vinda / Tanto faz" é decisão do autor e não foi contado. |
| 10 | Tela real sem camada antiga, sem erro de rede, sem 404 | **PASSA** | 0 | 2 (m16, m17) | **Rede:** 822 pedidos (`y/rede.mjs`), 0 resposta ≥ 400, 0 falha, 0 erro de página ou de console. 15 GLB do Loop com 200 (Q01 e D10 novos) e a torre; 32 ícones com 200 ou 304; `ui/glifos.svg` com 200. `r404`: 4 páginas, 0. Entrada em 7 tamanhos: 0 pedido ruim, 0 erro. **Peças:** as 8 do lote 8 dentro da tela; peça inteira e centrada nas 15 salas (`r7_torre15`, sozinho: 0 falha). **Torre `?loop=1`:** 15 salas, 0 de fora, 0 faltando, andar e nome iguais ao jogo, "Sair" volta. **Camada antiga:** 9.610 itens de lista, 0 fora da história (13.215 pistas antigas filtradas); mapa com 15 salas nas 50 telas de mapa. **Novos visuais:** tábua e inscrição com 44 px por símbolo, sem transbordar, em 390 e 360; botões do minijogo com 60 px e sombra 3D. **Telão:** 5 páginas, 0 estouro com 40 nomes; Missões com 8 missões e 40 nomes, 0 corte. |

## Antes | agora | motivo

| # | Rodada 8 | Rodada 9 | Motivo |
|---|---|---|---|
| 1 | passa | passa | Refeito. O Pátio reescrito e as 3 pistas novas não criam testemunha nem horário. Fechadas m3 (corredor) e m4 (Nico no Pátio). |
| 2 | passa | passa | Mais 2 trancas (330 toques). A inscrição segura as trancas e não chega antes das outras provas. |
| 3 | passa | passa | Pontos das peças novas e da inscrição iguais nas 5 causas. O giro limitado não esconde ponto nenhum. |
| 4 | passa | passa | A prova da cópia ganhou a 6ª fonte, conferida como caminho único nas 5 causas. |
| 5 | passa | passa | Ordem do minijogo novo sorteada. A resposta fixa entra na mesma menor do tipo (m6 e m7). |
| 6 | passa | passa | 106.702 blocos; maior 58. |
| 7 | passa | passa | Fechadas m10, m11, m12 e m14 da rodada 8. Entra 1 menor de dado interno (m10). |
| 8 | passa | passa | Fechada m15. Entram 2 menores novas: `v4_teo` mudou sem registro (m12) e a medida da entrada (m13). |
| 9 | passa | passa | Nada novo vazou. |
| 10 | passa | passa | Peças Q01 e D10 e o sprite dos símbolos carregando: 0 erro de rede. |

## Bloqueantes

Nenhuma.

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **m1.** (rodada 8, m1, continua.) Na noite D, quem conserta pelo fusível de reserva pode chegar ao fim sem ter lido nada do Téo ("Você refez o que o Téo desfez"). O "Caso aberto" fala em "cópia" para quem pode não ter achado a troca. Visto de novo na sala simulada: "Na Galeria, a cópia continua na base, cheirando a verniz."
- **m2.** (rodada 8, m2.) `coop_veredito` vai para os dois aparelhos da dupla (decisão registrada).

**Prévias (item 3)**
- **m3.** (rodada 8, m5, preventiva.) O Subsolo continua com 32 rótulos para 32 lugares na peça. Nenhuma pista nova entrou lá. As salas que ganharam rótulo ficaram bem abaixo de 32: Galeria 12, Coleções 16, Conservação 15 (no livro).

**Fontes (item 4)**
- **m4.** (rodada 8, m6.) O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência e no limite de atividades em dupla (registrado). O caminho ótimo dele não usa a inscrição. A inscrição como caminho único foi conferida no código real (`z/insc_caminho.mjs`).
- **m5.** (rodada 8, m7.) Em dupla ou trio, o aparelho que não está no Subsolo termina em "Caso aberto", "Parcial" ou "A verdade apareceu"; o Ouro aparece no DESFECHO DA TURMA (regra escrita).

**Códigos (item 5)**
- **m6.** (rodada 8, m8.) A resposta certa de cada minijogo é sempre a mesma frase (só a posição é sorteada), e errar não custa nada ("Ficou para decidir"). A dica da fita praticamente dá a resposta.
- **m7.** (nova, mesmo tipo) No minijogo de símbolos, a inscrição é a mesma em toda partida (`LC_INSC`: o 5º virado), e a resposta é sempre "5º símbolo". Só a ordem dos 4 botões gira (4 ordens, de 717 a 781 em 3.000 sorteios). Quem já jogou pode tocar no 5º sem conferir. Isso não abre nada antes da hora, porque a pista continua pedindo o cheiro, a tábua, a volta 2 e 1 de energia, e errar já era de graça. O próprio texto da pista também diz "o quinto".

**Palavras (item 6)**
- **m8.** (rodada 8, m9.) O "Dicionário das palavras" ganhou "Peça principal" e "Inscrição". Somado ao cartão aberto, passa de 60 palavras no conjunto (276 no dicionário inteiro); cada bloco fica abaixo (decisão registrada).

**Documentos e texto (item 7)**
- **m9.** (rodada 8, m13, continua.) `GDD.md` com termos antigos; identificadores internos com palavra antiga; `prova_falsa` lista `c_peca` por fora do `grupoFonte`; etiqueta "MANUAL" em 6 grupos (todos registrados).
- **m10.** (nova, interna) `atividades_coop.coop_original_copia.solo_pistas` continua `['foto_solo','falsa_2','falsa_3','c_peca']`, sem `insc_copia`. Na tela não muda nada: a frase "ou junte outra prova de que a peça é cópia" já cobre, e o validador lê só as referências. Mas é a única lista de provas da cópia que não ganhou a fonte nova.
- *(sem número: "tábua" com dois sentidos, o chão de tábuas das Coleções e a tábua da escrita. Está em "Ficou para decidir" da revisão 10; o contexto separa.)*

**Registro (item 8)**
- **m11.** (rodada 8, m16, continua.) Os testes de tela citados no registro ficam fora do repositório (`/tmp/roda/r8/`, `/tmp/roda/r10/insc.mjs`), assim como o resultado do validador (`/tmp/roda/esc/r10/validar.txt`). Esse resultado é 9 minutos anterior aos dados finais; rodado de novo aqui, deu APROVADO.
- **m12.** (nova) `v4_teo` mudou nos dados: "A peça tem **a mesma cara** e pesa diferente" (na revisão 9 era "o mesmo desenho"). Só que a DECISOES "Revisão 10 · Não aplicado" diz "Fala do Téo em `v4_teo`: **não mexida**" e ainda põe a troca em "Ficou para decidir". O LOOP-CENTRAL não lista o campo nem na revisão 9 nem na 10. A frase nova não revela nada nem cria contradição (combina melhor com a inscrição), mas o registro diz o contrário do dado. Ou se registra a troca como aplicada, ou se volta o texto.
- **m13.** (nova, de forma) O registro da revisão 9 diz "os botões continuam com 52 px ou mais" na entrada compacta. É verdade para os botões; o campo do código fica com 50 px em 360×740 (acima dos 44 de toque).

**Vocabulário e gênero (item 9)**
- **m14.** (rodada 8, m17.) "O Professor encerrou a aula. Obrigado por participar!" (padrão de sala dos outros jogos; em "Ficou para decidir").
- **m15.** (rodada 8, m18.) "Simulador" e "Professor" na entrada como nomes do padrão de sala; no telão, "Troca sozinha: sim" fala da troca de página.

**Camada antiga (item 10)**
- **m16.** (rodada 8, m19.) `sala/conteudo.js` e `game.js` ainda carregam as salas e pistas antigas; a tela filtra todas (13.215 filtradas, 0 mostrada).
- **m17.** (rodada 8, m20.) `museu/` e `museu/torre/` sem `?loop=1` mostram o museu antigo para quem digitar o endereço; nenhum botão do jogo leva até lá. O README ainda aponta para `museu/`.

## Fim do ciclo

A conferência técnica **passou**: 10 de 10 itens, 0 bloqueante, 17 menores. Das 20 menores da rodada 8, fecharam 7 (m3, m4, m10, m11, m12, m14 e m15) e entraram 4 novas (m7, m10, m12 e m13).

As revisões 9 e 10 mexeram em texto visível: 14 pistas do Pátio, 3 pistas novas, `v4_teo`, o final Ouro e os minijogos da caixa, da fita e dos símbolos. Pela regra 0.3, a etapa 1 (história) e as seguintes precisam ser conferidas de novo com esse texto, se ainda não foram. Das menores, as que mexem em texto visível são m1, m6, m7 e m12.
