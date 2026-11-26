# Mosaico Loop v4 revisão 8 — Escala da história (seção 1) — rodada 8, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md (partes 1 a 15), FICHAS.md, DECISOES-V4.md, LOOP-CENTRAL.md, as 278 pistas de `pistas_legivel.txt` e `atividades.txt` (regras, grupos, atividades, papéis, finais). Das telas: `LOOP_SALAS`, `LOOP_DESC` e `TOUR` de game.js; em loop-central.js, dicionário, Anexar, aba Revelar, `LC_MG`, `LC_MGA`, `LC_MISSOES`; ritmo.js (finais do telão, `LOOP_FINAL_COND`, fita); o texto de telao.mjs; a frase de entrada das três páginas. Olhei as capturas das peças do Pátio, Coleções, Fotografia e Limpeza. Conferi no dado vivo ("v4 revisão 8", 278 pistas): escada 231/25/9/9/4 e "Lenz" fora de todo texto antes da volta 3 (só aparece em campos internos `revela.aponta`). Rodei o validador (`dados/validar.py`, só leitura, fora do repositório): **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas, 5 sementes. Não abri o jogo no navegador: o que digo das telas vem do código. Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10 — NÃO PASSOU: Consistência do documento ficou em 8,5 (mínimo 9,0). Os outros 8 critérios estão no mínimo ou acima.**

Os menores (a) da rodada 7 foram fechados de fato (Dra. Sato e os mostradores, gerador e luzes, fita da porta, Apagão Combinado, Nico, pendrive, entrada nas 3 páginas, telão do Desligar, dicionário). O que derruba agora é o ajuste de texto às peças 3D: entrou nos dados, na DECISOES e na LOOP-CENTRAL, mas **não chegou ao ROTEIRO (a fonte da verdade do enredo) nem à FICHAS**. Além disso deixou dois choques pequenos no texto que quem joga lê (minijogo da caixa; fresta do quadro). Nenhum desses choques quebra dedução. O conserto é texto, cerca de 120 palavras.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê") e só o caderno guarda; o Desligar tem preço escrito por noite ("Ninguém viu o que você viu") e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha (tinta escorrendo em 0:00, `traj_3` às 4:10, `raio_contagem` 50 s, disparo às 5:00); a Dra. Sato só comenta o que ouve e agora sabe o que o mundo deixa ("Do jeito que eu deixei, eles não piscam"); `man_pot_1` explica as luzes no mesmo gerador. |
| Estrutura | **9,0** | 9,0 | Escada 231/25/9/9/4 conferida; viradas na volta 2 (`c_peca`, `falsa_2`), 3 (nome: `cracha_3`, `lenz_2`, `coop_veredito`), 4 (`rev_3`, `teo_radio`), 5 (a escolha); a 4 converge sem fechar; nenhum rótulo adianta virada. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Mesmos rótulos e mesma ordem nas 5 noites (pares `parDe`; os rótulos novos da revisão 8, como "Pela fresta do quadro" e "Luminária do varal", existem nos dois lados); 3 pistas para anexar em todas; cena própria em A, B, D, E; validador Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | `traj_1` pergunta o que a fita mostra (ombro molhado), `nico_1.porque` diz o que falta, `teo_radio` não faz o número provar a cópia; todo valor do conserto tem 2 a 5 fontes desde a volta 1; os choques novos (fresta, caixas) não mexem em nenhuma dedução. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas; vozes batem (`cracha_3` e `coop_veredito` com "Tá.", `ivone_1x` "Eu não perco pote", `aurelio_1` agora com "Eu demorei para acreditar", `dis_balde` "Compro outro. — Dirceu"); menor: o Ouro tirou do Aurélio o motivo de agradecer. |
| **Prosa** | **8,5** | **8,0** | Curta, em cena e com voz (`quadro_0`, `d_fus_2`, `e_hist_1` "Alguém ligou."); seguem frases de narrador fechando conta ("Você não chutou: dois sinais diferentes...", `chao_peca`, `conserto_C`, `empurra_2`) e rótulos de formulário ("MEIO CERTO", "Registrar revelação"). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial com 2 a 10 fontes em salas, nenhuma presa a personagem de quem joga; validador rodado nesta rodada: Ouro com 1, 2 e 3 pessoas nas 5 causas, bot abaixo de 2%. |
| Consistência do documento | **8,5** | 9,0 | O ajuste da revisão 8 às peças não foi levado ao ROTEIRO nem à FICHAS: ROTEIRO diz cadeado de aviso **vermelho** em 3 lugares (dados: amarelo; o vermelho do modelo é o da trava), "duas fotos", "empurra com o pé", "tampa fechada"; FICHAS e ROTEIRO, parte 8, ainda põem o Aurélio vendo o telão; e o minijogo de `c_peca` diz "três caixas empilhadas" contra a estante de `c_esc_1`. |

### Defeitos menores (não seguram nota sozinhos; ficam anotados)

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra do autor.

- **Premissa.** (b) Revelar sem consertar é esquecido às 5:00: a escolha pesa mais para um lado. Sustenta-se porque o Desligar tem preço escrito.
- **O oculto.**
  - (b) Nenhum texto diz se a Dra. Sato, fora do prédio, é levada pelas voltas.
  - (b) O alarme das 2:40 continua sem causa escrita.
  - (a) Chave "Circuito da Câmara" (`d_fus_2`) não é nenhuma das três chaves numeradas de `quadro_aberto`/`chave_1` (1 café, 2 gerador, 3 para-raios). Vinha de antes; só fica mais visível agora que o quadro tem fresta.
- **Estrutura.**
  - (b) `data_2`, `motivo_1`, `c_esc_2`, `cracha_1`, `lenz_meio_2`, `traj_3` deixam "o do patrocínio" e o porquê quase inteiros na volta 1. Decisão já tomada.
  - (a) A aba Revelar, desde o minuto 0, diz onde procurar (`LC_ONDE`). Registrado como não aplicado na revisão 7.
- **Rodízio.** C e D têm sinal só deles (`c_anc_1`, `d_fus_1`); com `man_1` uma pista já dá nome ao defeito. O custo de anexar é igual. (b) `d_teo_2` sem tranca.
- **Jogo limpo.**
  - (a) **Novo, da revisão 8.** `fh_vidro` (noites A, B, C, E): pela fresta "dá para ver que tem chaves, não a posição delas". Na mesma lista, `man_pot_3` diz "A chave dele está aberta" e `fh_disj` diz "Um disjuntor do Quadro externo está caído". Ou a fresta deixa ver a posição, ou não deixa. Nenhum valor de conserto depende disso.
  - (a) **Novo, da revisão 8 (fica para a seção 5).** O modelo do Pátio mostra a porta aberta bem mais que uma fresta, com as chaves à vista, e o cadeado fechado na trava com a porta aberta. O texto ("não abre mais que uma fresta", "está escuro") pede um vão menor.
  - (a) Noite D: `d_fus_3` tem a foto de conferência "de hoje" da caixa de fusíveis, e `fh_folha_d` diz que a conferência dos fusíveis de hoje "ficou para amanhã". Duas salas, dois papéis; a tensão já existia com duas fotos e não foi apontada antes.
- **Personagens.**
  - (a) **Novo, da revisão 8.** Ouro: "Na Galeria, Aurélio olha para a base, depois para você". Quem revela está na Recepção (o Revelar só existe lá) e o Aurélio não sai da Galeria. Ele agradece "por não esquecer" sem ter visto as provas. Antes o motivo era o telão; agora nada no texto diz por que ele sabe.
  - (b) `aurelio_1` na volta 1 só com o cheiro de verniz; `man_cal_3` ("vai que precisa") em toda noite.
- **Prosa.** Os da tabela. Mais: `chao_peca` ("O museu esqueceu. O chão guardou."), `conserto_C` ("A máquina entende há quantos dias..."), "Marcadas: 3 de 3 · sinais: 2..." (lista do autor).
- **Robustez.** Com 1 pessoa o Ouro pede jogo quase perfeito (energia [5, 4, 5, 4, 2] de 5): é dificuldade, não falta de fonte.
- **Consistência** (o que soma o 8,5; cada item sozinho seria menor):
  1. ROTEIRO, parte 5 ("Cena do cadeado") e parte 6, noite D (história e sinais): "cadeado vermelho" de aviso. Dados (`d_fus_2`, `d_fus_2b`): amarelo, trocado de propósito para não confundir com o vermelho da trava, que é o que o modelo do Pátio mostra. A fonte da verdade diz o contrário do que a revisão quis resolver.
  2. ROTEIRO, parte 6, noite D: "duas fotos de conferência ... a de ontem com o lacre inteiro". Dados (`d_fus_3`): três fotos (anteontem, ontem, hoje). A cronologia das três fotos em si está certa: o lacre inteiro até ontem, cortado hoje, depois que o Téo passou de mão fechada "antes de escurecer" (`d_teo_2`).
  3. ROTEIRO, parte 5 ("Cena da caixa") e parte 11: "você empurra com o pé". Dados (`c_esc_1`) e `LOOP_DESC`: a caixa é "uma das caixas etiquetadas da estante". E o minijogo de `c_peca` (texto de tela) diz "Três caixas de transporte empilhadas; só uma tem o adesivo do patrocínio", contra a estante cheia do modelo e de `c_esc_1`. `lenz_meio_1` ("entrou leve no dia 14 ... 'pesada?'") e `c_esc_2` ("1 caixa de banners · Sala das coleções") não brigam com nada.
  4. ROTEIRO, parte 15: "a tampa com cadeado continua fechada". Dados: porta entreaberta, presa pelo cadeado na trava (`quadro_0`; `coop_apagao_combinado.papelA` já diz "porta"). A parte 15 não traz a linha "ajuste de texto às peças novas" que está na DECISOES e na LOOP-CENTRAL.
  5. FICHAS, exceção do Aurélio ("fala do que acabou de ver no telão") e ROTEIRO, parte 8, nota do Ouro (mesma frase): o Ouro novo põe o Aurélio na Galeria, olhando a base.
  6. `cracha_2`: "No armário da equipe, no corredor ao lado da Base da limpeza". "Corredor" é o identificador interno da Área de descanso, e o ROTEIRO, parte 3, pede um nome só para ela; a "caixa da equipe" (`acesso_1`) fica justamente na Área de descanso. Quem lê pode procurar o armário na sala errada.
  7. LOOP-CENTRAL, "Pendências": ainda diz "Nenhuma ... (revisão 7)".

### Pedido de conferência da revisão 8: os cinco pontos

| Ponto | Resultado |
|---|---|
| Cadeados do quadro (vermelho da trava × amarelo de aviso) | **Nos dados está certo**: `quadro_0`, `quadro_aberto` e a tranca dão "um cadeado pequeno" na trava; `d_fus_2` dá "um segundo cadeado, amarelo"; `d_fus_2b` "Você volta ao cadeado amarelo". **Contradição nova no ROTEIRO** (3 vezes "vermelho", item 1 acima). |
| Fresta × o que se vê | **Contradição nova pequena**: `fh_vidro` (não se vê posição) × `man_pot_3` e `fh_disj` (posição vista); e o modelo mostra vão largo. `chave_3` (seguir o cabo pela fresta até a chave 3) e `d_fus_2` (ler o cadeado pela fresta) são coerentes. |
| Cronologia das fotos do lacre | **Coerente nos dados** (anteontem e ontem inteiro, hoje cortado e ainda úmida, depois da passagem do Téo antes de escurecer). ROTEIRO desatualizado ("duas fotos"). Tensão antiga com `fh_folha_d` (menor). |
| Armário da equipe | Uma versão só da história (`cracha_2`, `cracha_3`, `v4_braga`: o Lenz rondou o armário, levou o crachá ontem, deixou o bilhete). Só a palavra "corredor" confunde (item 6). |
| Caixa BANNERS × `c_peca` / `lenz_meio_1` / `c_esc_2` | `c_esc_1`, `lenz_meio_1`, `c_esc_2`, `c_esc_3`, `c_peca` (pista) e `LOOP_DESC` contam a mesma caixa. **Contradição nova no minijogo de `c_peca`** ("três caixas empilhadas") e no ROTEIRO ("com o pé"). |

## 3. Abaixo do mínimo — o que corrigir

**Consistência do documento (8,5 → 9,0).** Tudo é texto; nenhuma regra, tranca ou fonte muda. Cerca de 120 palavras, a maior parte copiando a DECISOES para o ROTEIRO.

1. ROTEIRO, parte 5 ("Cena do cadeado") e parte 6, noite D (história e sinais): "vermelho" → "amarelo"; na cena, acrescentar "(o vermelho, pequeno, é o da trava da porta)". ~12 palavras.
2. ROTEIRO, parte 6, noite D: "duas fotos de conferência ... a de ontem com o lacre inteiro, a de hoje com o lacre cortado" → "três fotos de conferência ... as de anteontem e de ontem com o lacre inteiro, a de hoje com o lacre cortado". ~8 palavras.
3. Caixa: no minijogo de `c_peca` (loop-central.js, `LC_MG.c_peca.texto`), trocar "Três caixas de transporte empilhadas; só uma tem o adesivo do patrocínio." por "Na estante, caixas etiquetadas; só uma tem o adesivo do patrocínio." No ROTEIRO, partes 5 e 11, "empurra com o pé" → "empurra na estante". ~15 palavras.
4. ROTEIRO, parte 15: "a tampa com cadeado continua fechada" → "a porta, presa pelo cadeado da trava, continua só numa fresta"; e acrescentar a linha "ajuste de texto às peças novas" (copiar a da DECISOES, revisão 8). ~70 palavras, quase toda cópia.
5. Ouro: escolher uma versão e pôr nos três lugares. Proposta: "Na Galeria, Aurélio olha para a base, depois para quem chega, e só consegue dizer: ..." mais, em FICHAS e na nota da parte 8, "ele não lembra das voltas; fala do que a noite mostrou: o relógio passou de 5:00 e alguém viu a verdade". ~25 palavras.
6. `fh_vidro`: "Dá para ver que tem chaves, não o que está escrito nelas." (aí `man_pot_3` e `fh_disj` continuam valendo). ~8 palavras.
7. `cracha_2`: "No armário da equipe, ao lado da Base da limpeza". −1 palavra. LOOP-CENTRAL, "Pendências": "(revisão 8)". 1 palavra.

Com 1 a 5 a nota volta a 9,0; 6 e 7 fecham os menores que sobram.

### 3.1 Menores (a) que vale fechar junto (não são condição para passar)

- Noite D: `fh_folha_d` dizer só "a linha da iluminação da fachada está preenchida; a dos fusíveis, com outra letra, só diz 'ver foto'", ou tirar "o resto ficou para amanhã". ~8 palavras.
- `d_fus_2`: dizer qual das três chaves numeradas é o "Circuito da Câmara" (ou dar a ela uma etiqueta, não um número). ~6 palavras.
- Pátio, modelo × texto (vão da porta): levar à escala das peças (seção 5).

### 3.2 Decisões de regra do autor (já em "Ficou para decidir" da DECISOES; nenhuma baixa nota)

1. **A Dra. Sato e as voltas.** Não baixa: a sirene só aparece para quem contou do Téo. Continua sendo o primeiro a decidir.
2. **"Quem" e "por quê" quase inteiros na volta 1.** Custa força à virada da volta 3. Não baixa: o que é travado (provas, nome, Revelar) não abre mais cedo.
3. **Piso de volta em `nico_1`, `cracha_3`, `lenz_2`.** Não baixa: a tela não promete nada falso.
4. **Revelar sem consertar é esquecido às 5:00; Revelar só na volta 5 sem motivo no mundo.** Não baixam: regra anunciada desde a entrada.
5. **Por que quem joga lembra.** Convenção do gênero; o lema segura.
6. **`d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, alarme das 2:40.** Pequenos; nenhum quebra dedução.
7. **Minijogo sem custo de erro, entrada por papel nos consertos em dupla, missão do Nico só na volta 4, aviso de aula encerrada.** São de motivação ou de padrão de sala, não desta escala.

O 8,5 de Consistência é todo (a): não depende de nenhuma dessas decisões.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 7) | Agora (rodada 8) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. |
| O oculto | 9,0 | **9,0** | Fecharam os dois menores (Dra. Sato e a própria tranca; gerador e luzes). |
| Estrutura | 9,0 | **9,0** | Sem mudança; minijogo da luz não adianta mais "sem um risco". |
| Rodízio (causas A–E) | 9,0 | **9,0** | Rótulos novos da revisão 8 entraram nos dois lados de cada par. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fecharam os quatro menores (`traj_1`, Apagão, `nico_1`, `teo_radio`); entrou um novo, pequeno (fresta × posição das chaves). |
| Personagens e fichas | 9,0 | **9,0** | `aurelio_1` melhorou; entrou um menor (o Aurélio do Ouro agradece sem ter visto). |
| Prosa | 8,5 | **8,5** | Sem mudança: restos de formulário e de narrador continuam (lista do autor). |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador rodado de novo nesta rodada: APROVADO. |
| Consistência do documento | 9,0 | **8,5** | **Caiu por causa da revisão 8.** Fecharam os desvios da rodada 7 (entrada, telão do Desligar, dicionário, Ouro no telão), mas o ajuste de texto às peças ficou fora do ROTEIRO e da FICHAS (cadeado, fotos, caixa, porta, Aurélio) e deixou o minijogo da caixa contra a estante. |
| **Geral** | **8,9** | **8,9** | Média igual; um critério abaixo do mínimo. |

**Os ajustes da revisão 8 criaram contradição nova?** Sim, nenhuma de dedução:
- no ROTEIRO (fonte da verdade): cadeado de aviso vermelho (3 vezes), duas fotos, empurrar com o pé, tampa fechada, sem a linha do ajuste às peças;
- na FICHAS e na nota do Ouro do ROTEIRO: Aurélio diante do telão;
- no texto de tela: minijogo de `c_peca` ("três caixas empilhadas") contra a estante; `fh_vidro` contra `man_pot_3` e `fh_disj`;
- no Ouro: o Aurélio, na Galeria, olha "para você" e agradece sem ter visto o Revelar.

## 5. Fim do ciclo

**A escala da história (seção 1) não passou: Consistência do documento ficou em 8,5 (mínimo 9,0).** Os outros 8 critérios passaram. Pelo ciclo das escalas: aplicar os itens 1 a 5 da parte 3 (texto, cerca de 120 palavras, sem decisão de regra) e reavaliar a seção 1 do zero antes de seguir para a seção 2.
