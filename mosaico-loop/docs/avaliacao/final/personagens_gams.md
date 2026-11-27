# Mosaico Loop v4 (revisão 17): rodada final, seções 2 e 3 (fichas, Big Five do conteúdo, GAMS)

Documento de projeto. Nada daqui aparece para quem joga.

Avaliei do zero sobre a revisão 17 (`dados/pistas-v4.json`: "v4 revisão 17 (26/11/2026) · lotes 14 e 15", 281 pistas). Não abri navegador e não editei nada no repositório. Escrevi só em `/tmp/roda/esc/final/` (scripts e saídas em `final/pg/`).

**O que li:** ESCALAS_AVALIACAO_JOGOS.md (inteiro); FICHAS.md (inteiro); DECISOES-V4.md, revisões 16 e 17 (lotes 14 e 15, com "Não aplicado" e "Ficou para decidir"); ROTEIRO parte 3 ("Procurar na peça") e parte 4; `game.js` da investigação nova (`ACHAR`, `LC_ACHAR`, `revelarPontos`, `controlesDaPeca`, `renderClues`, `bloqueioPista`, manual passo 2); `loop-central.js` (`lcBloqueio`, Atividades com "porque" e "Falta:", Revelar com `LC_ONDE`); diferenças de código desde a revisão 16 (`git diff f10de0b HEAD`: `loop-central.js`, `ritmo.js`, `game.js`); frase do papel em `individual.html` e `sala/index.html`; textos "Curador da sala" em `sala/sala-mestre.mjs`.

**O que mudou no texto desde a revisão 16** (`pg/diff.py`, saída `pg/diff.txt`, contra `pistas-v4.json_SUBSTITUIDO_2026-11-26g`): nenhuma pista entrou ou saiu; 6 textos: `traj_2` (Seu Dirceu responde pela Ivone), `nico_0` ("perto da cafeteira", sem "copa"), `man_3` (termina na fala da Dra. Sato), `empurra_2`, `catraca_solo` e `coop_catraca_ok` (cortes de narrador); mais a regra nova `regras.achar`. Fora dos dados: dica da fita "Lá fora chove desde ontem.", luz certa só de lado, miniaturas novas, passo 1 do manual com "o curador Aurélio", passo 2 com "Gire e chegue perto".

**O que conferi por script** (`pg/checa.py`, saída `pg/checa.txt`): os 34 ids da tabela "Onde cada traço extremo aparece" existem (nenhum falta); 18 traços extremos em negrito. "Tá." só em `c_esc_3`, `cracha_3`, `coop_veredito` (Braga). "Desculpa" só em `d_teo_1` (Téo, escrito), `nico_0`, `nico_0b`, `nico_1`, `dis_balde`. Das 8 frases de "nunca diria", só "Fui eu" aparece, nas duas pistas do Téo (`teo_radio_2d`, `d_fus_2b`); "Tenho certeza" só existe em `game.js` como rótulo de grau de certeza de outro modo, não na boca do Nico. Os 11 textos com a letra do Téo terminam em `— T."`. "Lenz" só a partir da volta 3 (`coop_veredito`, `cracha_3`, `lenz_2`, `v4_braga`). "copa" não aparece mais em lugar nenhum. "Professor" só em comentários de `sala-mestre.mjs`. Varri 117 arquivos públicos (fora de docs/, sem modelos e imagens) atrás de nomes de escala e de traço: 0 achados.

**Capturas vistas (sem navegador):** `r17/cap/eletrica_entrar_390` (lista vazia, "Nada achado ainda nesta sala.", "Gire e chegue perto: os detalhes só aparecem de perto.", botões + − ⟲), `eletrica_perto_achado_390` (brilho na lâmpada de perto, 2 achados na lista), `eletrica_lista_1_390`, `eletrica_lista_3_390/360`, `fotografia_lista_3_390`; `r17/entrada/loop_depois_manual_390` (frase do papel e passo 1).

Aviso de autoavaliação: não escrevi nenhum texto do jogo. Como 8 de 8 personagens saem com 5, reli cada fala que mudou procurando motivo para tirar ponto.

---

## 1. Nota geral

**PASSA.** Seção 2: 5 de 5 itens. Seção 3.1: **5,0** (mínimo 4,5), ninguém abaixo de 4. Seção 3.2: **4,7** (mínimo 4,5). A investigação nova sustenta a Intrínseca, mas tira da sala o aviso de "por que ainda não" (ver 3.2, Amotivação): cai 0,1 em relação à rodada 18, sem chegar perto do mínimo.

---

## 2. Tabela por critério

### 2.A Seção 2: checklist 2.4

| Item | Resultado | Mínimo | Justificativa (evidência) |
|---|---|---|---|
| Todo personagem tem perfil e traços nas três escalas | **Passa** | completo | FICHAS.md: os 8 com papel, 5 traços, honestidade-humildade e as 5 dimensões da curiosidade (11 colunas), mais desejo, necessidade, segredo, voz, "nunca diria", "o que vê". Seu Dirceu registrado como figurante. "Curador da sala" é a função de quem conduz, não personagem (decisão do autor); o personagem segue "o curador Aurélio". |
| Cada traço extremo aparece em ao menos uma cena | **Passa** | completo | 18 de 18 com cena; os 34 ids existem (tabela 2.B). |
| Falas e ações não contradizem a ficha | **Passa** | coerente | `traj_2` novo é Seu Dirceu puro (conta o que viu, com número: "passou uma vez só, até a cafeteira e de volta"), e bate com "quem passa com pressa" do "o que vê". `nico_0` com a cafeteira bate com a Área de descanso da ficha. `man_3` ficou só na fala dela ("Me conta o que você viu com os seus olhos."). Ninguém diz o próprio "nunca diria"; a Dra. Sato não diz "Tá." e não vê o prédio. Ressalva menor em 2.C. |
| Exceções registradas na ficha | **Passa** | completo | As 10 exceções batem com os dados (Téo só escrito; Nico e o número da volta 4; Dra. Sato no interfone e confiança só para informação; ninguém lembra; "desde ontem" do Seu Dirceu; Aurélio no Ouro; Téo não prevê o reinício; Lenz da volta 3; Seu Dirceu na noite do fusível). O "lembrar o que achou" da investigação é do caderno de quem joga, como diz a exceção "Ninguém do museu lembra das voltas". |
| Nenhum nome de escala ou traço no texto público | **Passa** | limpo | Varredura de 117 arquivos: 0 achados. Telas novas (dica de achar, "Examinar o que você achou", "Curador da sala", "Sala encerrada") só usam palavras do mundo ou de jogo. |

### 2.B Traço extremo e cena

| Pessoa | Traço extremo | Cena | Ok? |
|---|---|---|---|
| Aurélio | Neuroticismo alto | `aurelio_0` ("Está linda, não está?" sem certeza) | sim |
| Aurélio | Sensibilidade à privação baixa | `aurelio_1` ("eu sei de cor, nunca mais li.") | sim |
| Aurélio | Tolerância ao estresse baixa | `aurelio_2` ("Era medo meu.") | sim |
| Téo | Honestidade alta | `data_3`, `d_fus_2b` ("Fui eu. — T."), `teo_radio` | sim |
| Téo | Sensibilidade à privação alta | `teo_d3` ("Tinta não mente."), `v4_teo` | sim |
| Téo | Busca de emoção alta | `teo_radio` ("cara a cara") | sim |
| Ivone | Conscienciosidade alta | `ivone_1x` ("Eu não perco pote."), `v5_ivone` (4,2 kg) | sim |
| Ivone | Curiosidade social baixa | `ivone_2`, `ivone_red` (aponta sem olhar) | sim |
| Braga | Amabilidade alta | `traj_aviso`, `c_esc_3`, `cracha_3` (o café), `dis_cafe` | sim |
| Braga | Tolerância ao estresse baixa | `braga_1`, `v4_braga`, `coop_veredito` | sim |
| Lenz | Amabilidade baixa | `lenz_0`, `lenz_1` ("Nem você."), `traj_3` | sim |
| Lenz | Honestidade baixa | `lenz_2` ("Eu devolvo tudo que eu pego.") | sim |
| Lenz | Tolerância ao estresse baixa | `traj_3`, `lenz_mot_3` | sim |
| Lenz | Busca de emoção alta | `v5_lenz` | sim |
| Dra. Sato | Abertura alta | `man_anc_2` ("vai que"), `man_2` ("Ou não.") | sim |
| Dra. Sato | Sensibilidade à privação alta | `man_3`, `a_hist_1`, `e_hist_1` ("Ninguém.") | sim |
| Nico | Conscienciosidade baixa | `nico_0b`, `nico_1.porque`, `fh_fusivelx` | sim |
| Nico | Curiosidade social alta | `nico_0` ("cara de quem não jantou"), `nico_0b` | sim |

### 2.C Ressalvas (nenhuma derruba item)

| # | Onde | Problema | Peso |
|---|---|---|---|
| 1 | Respostas do interfone (`sint_carga`, `sint_luz` e a do par) | O molde "ou isto, ou aquilo" segue em três falas seguidas da Dra. Sato (não aplicado no lote 14, de propósito). Combina com "não aceita palpite", mas se repete. | menor |

### 3.1 Big Five do conteúdo

| Personagem | Nota | Mínimo | Justificativa (ids) |
|---|---|---|---|
| Téo | 5,0 | 4 | Só escrito, peso e medida, ordem curta, sempre "— T." (`v4_teo` "Eu sei o que eu carrego.", `teo_d3`, `man_cal_3` "Nessa ordem, sem inverter."). |
| Lenz | 5,0 | 4 | Pressa, favor, prazo e ameaça educada (`lenz_0`, `lenz_2` "Lenz. Agora não.", `lenz_mot_3`); nunca fala da peça como arte. |
| Ivone | 5,0 | 4 | Seca e com número (`ivone_1x`, `ivone_red` "O pote saiu daqui. Eu, não.", `v5_ivone`). |
| Dra. Sato | 5,0 | 4 | Frase de rádio, a máquina é "ela", devolve a pergunta, humor seco; `man_3` ficou mais limpo sem o narrador. O molde de 2.C-1 não chega a meio ponto. |
| Seu Dirceu | 5,0 | 4 | Esfregão na mão e conta o que viu; o acréscimo de `traj_2` ("A Ivone, não: ... passou uma vez só, até a cafeteira e de volta.") é curto, com contagem, e soa dele, não do narrador. |
| Braga | 5,0 | 4 | Fala muito, foge para chuva, cunhado e café; a verdade começa com "Tá."; "Tive medo de perder o emprego" sem o "nunca diria". |
| Aurélio | 5,0 | 4 | Pergunta em vez de afirmar, palavra de acervo, foge da lacuna, desculpa sem a palavra. O passo 1 do manual ("o curador Aurélio") separa bem do "Curador da sala". |
| Nico | 5,0 | 4 | Repara nas pessoas antes de si, perde o fio, "eu já te disse isso?"; "perto da cafeteira" não muda a voz. |
| **Média (8 com fala)** | **5,0** | **4,5** | 40 ÷ 8 = 5,0. **Passa.** |

**Abaixo de 4:** ninguém.

### 3.2 GAMS do conteúdo

| Subescala | Nota | Justificativa |
|---|---|---|
| Intrínseca | 5,0 | A investigação nova é procurar de verdade: sala sem nada aceso, lista vazia ("Nada achado ainda nesta sala."), o brilho cresce só de perto e apontado, some ao se afastar, sem contador (a quantidade não é entregue), e quem achou numa volta lembra na outra. O toque que mira e aproxima e os botões + − ⟲ tiram a destreza do caminho (o achar.mjs achou tudo o que estava aceso só com toque e "+" em 15 salas). Some-se o que já puxava: museu que esquece, falas que mudam com o caderno, escrita antiga na testa da máscara, previsão antes da luz confirmada ou desmentida pela luz. Desconto considerado: em `eletrica_perto_achado_390` dois rótulos entram de uma vez ao chegar perto de um lugar só (pontos que dividem lugar); não tira ponto, é o mesmo objeto. |
| Integrada | 5,0 | Papel numa frase clara na entrada ("Nesta atividade você vive o papel de quem lembra das voltas. O museu esquece. Você e o seu caderno, não."); missões secretas; papéis da volta 5 em segunda pessoa; quem conduz agora também joga (Curador da sala), o que põe o professor dentro da mesma experiência. |
| Identificada | 5,0 | Diagnóstico com 2 sinais de tipos diferentes e 1 leitura normal, erro que volta com o motivo, finais que cobram a escolha, inscrição conferida com a fonte, "O que o seu caderno trouxe". Procurar antes de examinar reforça o valor de olhar com método (o que importa "quase nunca está de frente"). |
| Externa (menos é melhor) | bruta 1,5, invertida 4,5 | Sem pontos nem ranking; +1 de energia da missão, nome no telão e o final. Achar não dá prêmio: só põe o rótulo na lista. |
| Amotivação (menos é melhor) | bruta 2,0, invertida 4,0 | Antes, a sala dizia o que faltava: a lista mostrava "travada" com a frase do mundo ("Na mesa do curador, papéis virados para baixo. Você não sabe qual virar.") e "ainda não". Agora o ponto só existe para achar quando já está livre: `hs.on` exige `wait <= 0 && !bl` (`game.js`, linha 940), `revelarPontos` sai sem mostrar o que não está `on` (linha 832) e a lista só mostra o que foi achado (linha 941). Resultado: as 88 frases "porque" das pistas com tranca (19 essenciais, entre elas `falsa_2`, `falsa_3`, `c_peca`, `insc_copia`, `quadro_aberto`, `d_f2_1`) nunca aparecem na sala, e os 17 detalhes que surgem mais tarde na volta não dão sinal. Quem varre uma sala e não acha nada novo não sabe se ali não tem mais nada ou se falta motivo. O que segura a nota em 2,0 (e não pior): a aba Atividades continua com a frase do mundo e "Falta: ..." (`loop-central.js`, linha 366), o Revelar diz onde procurar cada prova (`LC_ONDE`), as provas têm várias fontes, e quem já achou um ponto lembra dele nas voltas seguintes (aí sim aparece "ainda não"/"travada"). Continua também a muita palavra de regra junta no Dossiê. |
| **Nota da escala** | **4,7** | (5,0 + 5,0 + 5,0 + 4,5 + 4,0) ÷ 5 = 23,5 ÷ 5 = 4,7. Mínimo 4,5. **Passa.** |

Introjetada: neutra, não pontua.

#### O que segura a 3.2: texto ou dado × mecânica

| O que segura | Tipo | Subescala |
|---|---|---|
| Ponto travado ou cedo não pode ser achado; a frase do mundo da tranca não aparece mais na sala | (b) mecânica | Amotivação (meio ponto) |
| Muita palavra de regra junta no Dossiê | (a) texto | Amotivação (sozinha, não tira meio ponto) |
| Recompensa fora do entendimento (+1 de energia da missão) | (b) mecânica, de propósito | Externa (já baixa; não é defeito) |

**O que só jogadores reais mostrariam (não puni):**
- se procurar em 15 salas dá prazer ou cansa, e se os limites de achar (45%, 60%, círculo de 30%) estão no ponto (está em "Ficou para decidir");
- se a turma volta a uma sala já varrida depois de ganhar o motivo (ex.: Coleções depois do cheiro de verniz) ou desiste dela;
- se 5 de energia para o que se acha dá gosto de escolha ou sensação de falta;
- se a turma liga a tábua da Conservação à testa da máscara, e se a previsão antes da luz soa como hipótese;
- se o pêndulo, os 10 segundos de caminhada, falar em voz alta entre salas e o blefe da missão funcionam numa sala cheia;
- se quem conduz consegue jogar e gerenciar ao mesmo tempo pelo botão Sala.

**Decisões do autor ou em "Ficou para decidir" (não pesaram):** pontos escondidos e ausência de contador; toque que mira e aproxima; "Curador da sala"; "Encerrar sala"; seletor de entrada e "Obrigado por participar!"; resposta errada em minijogo sem custo; piso de volta em `nico_1`, `cracha_3`, `lenz_2`; voz de sistema; Revelar só na volta 5; testa da máscara à vista desde a volta 1; Recepção e Central como salas inteiras.

---

## 3. Abaixo do mínimo: o que corrigir, onde e quanto

### (a) Obrigatórias

**Nenhuma.** Nada ficou abaixo do mínimo e não há falha bloqueante nestas seções.

### (b) Opcionais

**B1. Deixar o ponto travado ou cedo ser achado (mecânica, `game.js`, umas 3 linhas; 0 palavras de texto).** Hoje, no modo de achar, o ponto travado (`bloqueioPista`) ou o que ainda não chegou na hora não aparece nunca, e a lista só mostra achados: as 88 frases "porque" e o "ainda não" sumiram da sala, apesar de a DECISOES (lote 15) prometer "mesma tranca". Sugestão: em `revelarPontos` (linha 832), deixar achar o ponto que não está `on` (o brilho pode ser mais fraco); ao achar, ele entra na lista como hoje entraria um ponto lembrado ("travada", com a frase do mundo ao tocar, ou "ainda não"). Examinar continua bloqueado como antes. Não cria contador (só o que a pessoa achou aparece) e não muda pista, tranca, hora nem fonte. Resolve a meia unidade de Amotivação e devolve o "dúvida no ar" das trancas.

**B2. Dica embaixo da peça (conferir, seção técnica).** Nas capturas `eletrica_perto_achado_390` e `eletrica_lista_1_390`, com 2 achados na lista, a dica ainda diz "Gire e chegue perto: os detalhes só aparecem de perto." em vez de "Gire e chegue perto. Toque no que achar para examinar." (DECISOES, lote 15). Pode ser só o momento da captura. Se for real, quem joga não fica sabendo que pode tocar no brilho.

**B3. ROTEIRO, parte 3 (umas 15 palavras).** "A lista nunca diz quanto falta para algo aparecer: só 'ainda não'." Com os pontos escondidos, "ainda não" só aparece para o que a pessoa já achou numa volta anterior. Ajustar a frase (ou deixar como está, se B1 for aplicada).

**B4. Dossiê (sem estimativa fechada).** Juntar as frases de regra repetidas numa ficha só. Sozinho, não muda nota.

**B5. Interfone, `sint_luz` ou `sint_carga` (10 a 15 palavras).** Tirar o molde "ou isto, ou aquilo" de uma das duas respostas (a do par pode ficar). Exemplo para `sint_luz`: "Luz caindo a cada tentativa? Então alguma coisa mexeu no circuito. Vai até a caixa de fusíveis e me conta o que tem lá." Não muda o que a pista prova.

---

## 4. Reavaliação: antes | agora | motivo

| Critério | Antes (rodada 18, rev. 16) | Agora (final, rev. 17) | Motivo |
|---|---|---|---|
| 2.4 perfil e traços nas três escalas | Passa | Passa | Sem personagem novo; "Curador da sala" é função, não personagem. |
| 2.4 traço extremo com cena | Passa (18 de 18) | Passa (18 de 18) | 34 ids conferidos por script. |
| 2.4 falas não contradizem a ficha | Passa (1 ressalva) | Passa (1 ressalva) | `traj_2`, `nico_0` e `man_3` mantiveram a voz; continua o molde do interfone. |
| 2.4 exceções registradas | Passa | Passa | Nada pede registro novo. |
| 2.4 sem nome de escala no texto público | Passa | Passa | 117 arquivos, 0 achados. |
| Téo | 5,0 | 5,0 | Sem mudança. |
| Lenz | 5,0 | 5,0 | Sem mudança. |
| Ivone | 5,0 | 5,0 | Sem mudança. |
| Dra. Sato | 5,0 | 5,0 | `man_3` sem o narrador (melhor, mesma nota). |
| Seu Dirceu | 5,0 | 5,0 | `traj_2` ganhou fala própria, na voz dele. |
| Braga | 5,0 | 5,0 | Sem mudança. |
| Aurélio | 5,0 | 5,0 | Sem mudança. |
| Nico | 5,0 | 5,0 | "perto da cafeteira" no lugar de "na copa". |
| **3.1 média** | **5,0** | **5,0** | Passa. |
| Intrínseca | 5,0 | 5,0 | Pontos escondidos reforçam; já estava no teto. |
| Integrada | 5,0 | 5,0 | Curador da sala joga junto. |
| Identificada | 5,0 | 5,0 | Sem mudança. |
| Externa (bruta) | 1,5 | 1,5 | Achar não dá prêmio. |
| Amotivação (bruta) | 1,5 | 2,0 | Ponto travado ou cedo não pode ser achado: a frase "porque" e o "ainda não" sumiram da sala (B1). |
| **3.2 nota** | **4,8** | **4,7** | Passa. |

A única nota que caiu (Amotivação, meio ponto bruto) caiu por causa da mecânica nova de achar, não por correção de texto, e não leva a escala abaixo do mínimo.

## 5. Fim do ciclo

**As escalas das seções 2 e 3 passaram.** Seção 2: 5 de 5. Seção 3.1: 5,0. Seção 3.2: 4,7. Nenhuma obrigatória. As outras seções (história, conferência técnica, peças) não fazem parte desta avaliação.
