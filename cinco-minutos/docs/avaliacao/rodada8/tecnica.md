# Mosaico Loop v4 revisão 8 — Conferência técnica (seção 4 das escalas), do zero

**Resultado: PASSA.** Os 10 itens passam. Nenhuma falha bloqueante. Ficam 20 menores (campo interno, documento, decisão já registrada ou frase que não revela nada nem quebra a partida). A seção 4 aceita só "passa limpo", e as menores não impedem.

**A bloqueante da rodada 7 está fechada.** Os pontos que brilham na peça 3D agora ficam iguais nas 5 causas: no mesmo lugar, na mesma quantidade, na mesma ordem e com a mesma aparência. Conferi de cinco jeitos:
- desenho na tela, mesma semente, volta 1, 0:00: **0 de 15 salas** mudam com o defeito (na rodada 7 eram 13);
- todos os pontos, 15 salas × 5 voltas × 2 minutos: 0 diferenças;
- o que fica à vista em 2 tamanhos de tela: 0 diferenças;
- **teste novo, com o caderno enchendo:** 4 sementes × 5 voltas × 7 minutos × 15 salas = 2.100 comparações, 185 pistas coletadas pela mesma sequência de rótulos: 0 diferença;
- tela inteira com a causa trocada: 2.760 comparações, 0 diferença.

**O que a revisão 8 mudou e foi olhado de novo:**
- 8 peças novas: as 15 salas carregam a peça, sem erro de rede;
- 6 ícones novos: 32 ícones pedidos, todos com resposta 200;
- 38 campos dos dados (22 textos, 8 rótulos, 4 frases de tranca, 1 papel, 1 resposta do interfone, 1 pergunta de tranca, a versão): nenhum cria testemunha, horário, tranca ou rótulo diferente entre as causas;
- missão da Ivone: segue a regra nova nas 5 causas;
- cópias `_SUBSTITUIDO_` de todos os 26 arquivos mexidos: existem (a menor m13 da rodada 7 está fechada).

**Critério usado.** Bloqueante: quem joga vê, ou a partida quebra. Menor: campo interno, comentário, bloco escondido, documento, frase que não revela nem quebra, decisão já registrada em "Ficou para decidir".

**Estado auditado (25/11/2026, 20:44 a 22:23).** Os 927 arquivos da pasta ficaram iguais do começo ao fim (md5 em `aud6/snap_ini.txt` e `aud6/snap_fim.txt`, `diff` vazio). Não escrevi nada no repositório: Python rodou com `PYTHONDONTWRITEBYTECODE=1 -I`.
- `dados/pistas-v4.json` 20:31:55 (278 pistas, "v4 revisão 8") · `loop-central-dados.js` 20:31:55, idêntico ao JSON · `game.js` 20:31:49 · `loop-central.js` 20:10:35 · `individual.html` 18:46:00 · `docs/LOOP-CENTRAL.md` 20:37:56 · `docs/DECISOES-V4.md` 20:38:05 · `docs/ROTEIRO-LOOP.md` 19:45:54.
- `/tmp/roda/sim/validar.py` e `engine.py` são idênticos a `dados/validar.py` e `dados/simulador-texto.py`.

**Como foi conferido (tudo em `/tmp/roda/esc/r8/aud6/`).** São os scripts da rodada 7 copiados (`an/`, `n/`, `n6/`, `pw/`, `pw2/`, `x/`, `r7x/`), os testes do registro (`r8/pontos.mjs`, `r8/pecas.mjs`, `r8/r7_ordem.mjs`, `r8/r7_torre15.mjs`, `r7x/miss8.mjs`) e 4 scripts novos em `y/`.
- **Dados:** `an/dados.py`, `an/pares.py`, `an/palavras.py`, `an/docs.py`, `an/trio.py`, `n6/crono.py`, `n6/citacoes.py`, `n/pal.py`. `x/diffdados8.txt` compara a revisão 7 (`_SUBSTITUIDO_2026-11-25j`) com a 8 campo a campo: 38 campos, 0 pista mudou de posição, os mesmos ids.
- **Pontos da peça (item 3):**
  - `x/hs2.mjs`: desenho à vista, 15 salas × 5 causas;
  - `r8/pontos.mjs dados`: 150 combinações;
  - `r8/pontos.mjs tela`: 150 combinações, 390×844 e 360×740;
  - `x/hs_toque.mjs`: tocar num ponto examina a pista;
  - **novo `y/pontos_cheio.mjs`**: caderno enchendo, 2.100 comparações.
- **Tela real (`individual.html`):** `pw/varre.mjs`, 10 partidas (2 por causa), 3.220 telas, 9.480 itens de lista. `x/forca.mjs`: 4 sementes, causa trocada, 2.760 comparações. `n/blocos.mjs`: 105.847 blocos medidos no DOM. `n6/man3.mjs`: caderno cheio nas 5 causas.
- **Toque de verdade, nas 5 causas** (390×844 e 360×640, `hasTouch`): `n/trava_all.mjs`, `n6/janela.mjs`, `n6/mini.mjs`, `n6/sons.mjs`, `n6/campos.mjs`, `n6/torre6.mjs`, `r7x/torre15.mjs` e `r8/r7_torre15.mjs`, `x/final_tela.mjs`, `x/toques7.mjs`, `n/msgclique2.mjs`, `n/dura.mjs`, `n/mgluz.mjs`, `pw2/mgpeca.mjs`, `pw2/barra.mjs`.
- **Código real:**
  - ordem das listas: `n6/ordem.mjs` (600 sementes), `r7x/ordem.mjs` e `r8/r7_ordem.mjs` (22.500 comparações cada);
  - partidas: `pw/real_solo.mjs`, `n6/real_solo_teo.mjs`, `pw/real_par.mjs` (2 aparelhos), `x/real_trio.mjs` (3 aparelhos);
  - sorteios: `pw/sem.mjs` (4.000 sementes), `pw/andar.mjs` (3.000), `pw/dist.mjs` (3.000);
  - outras telas: `pw/extras`, `pw/extra2`, `pw/meu`, `pw/tranca_causa`, `pw/tel`, `pw/reserva`, `pw2/painel`, `pw2/glos`, `pw2/cartoes`, `pw2/paginas`, `pw2/r404`, `n/extra`, `n/entrada`, `n6/glosh`, `n6/salagate`;
  - **novos:** `y/rede.mjs` (15 salas × 2 causas com a peça carregada, 4 abas da Máquina, pausa, final, torre `?loop=1`, sala, telão, simulador, entrada e reserva: 794 pedidos de rede) e `y/ivone.mjs` (missão da Ivone, 6 casos × 5 causas).
- **Sala simulada:** `n6/simrun6.mjs`, 2 partidas inteiras em `sala/simulador/` (3 participantes, Professor automático, as 5 páginas do resultado): 485 e 504 linhas distintas, lidas por `y/simscan.py`. Telão com 40 nomes: `r7x/tl40.mjs`. Missões com 8 missões e 40 nomes: `r7x/miss8.mjs`.
- **Simulador de texto:** `validar.py 2000`, com `LOOP_DATA` apontando para o repositório (`/tmp/roda/esc/r8/validar.txt`).
- **Scripts que ficaram para trás** (o jogo está certo, o teste é que esperava o comportamento antigo):
  - `x/toques7.mjs` acusa "RUIM missões": ele espera que a conversa do Seu Dirceu (`ivone_ali_2`) feche a missão da Ivone, regra que a revisão 8 tirou. A regra nova está conferida em `y/ivone.mjs`.
  - `n6/mini.mjs` conta 15 "minijogo não abriu" na segunda sala da dupla: é o comportamento escrito desde a revisão 7 (abre uma vez por atividade e por volta). São os mesmos 15 da rodada 7.

**O que não foi coberto.**
- Não abri a sala de verdade, com Firebase e vários celulares: usei o simulador de sala e, no telão, estado injetado.
- Nas 2 salas simuladas ninguém cumpriu missão (Missões cheia só com estado injetado).
- Os pontos da peça foram medidos no Chrome com desenho por software, em 390×844 e 360×740. O lugar sai agora da sala e do rótulo, que não dependem do aparelho.
- Não testei em iPhone.
- O teste com caderno cheio coleta tudo o que está livre (sem limite de energia e sem os minijogos de tranca). Os minijogos foram conferidos à parte, por toque.

## Tabela

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Cronologia e testemunhas | **PASSA** | **Horários e voltas:** nenhum dos 38 campos mexe em `volta_min`, `segundo_min`, `precisaDe` ou `soNaCausa`. Andares fixos: 0 contradição em 3.000 sementes. Nos 9.480 itens de lista, 0 horário fora do dado mais o deslocamento do raio. **Testemunhas:** Braga só na Central, Seu Dirceu só na Base da limpeza, Ivone só no Ateliê, Aurélio só na Galeria, Dra. Sato só por interfone, Téo só caído, em papel e em gravação. **O que a revisão 8 mudou:** o Nico passa a ser citado no Pátio, em fala relatada ("O Nico diz que é do Fusível"). Ele não está lá; antes já era citado ("O Nico chama de Fusível"). O Aurélio do Ouro agora olha para a base, na Galeria, onde ele está (antes olhava para o telão, que fica na Recepção). **Finais:** 30 de 30 certos no celular, por toque (5 causas × Desligar e Ouro × 3 cadernos), e 5 de 5 no telão. Sem a conversa do interfone não há sirene; sem ter visto o Téo, ele não acorda; de 32 a 45 palavras no Ouro. No código real, o Ouro sem ver o Téo vem sem as duas frases. Menores m1 a m4. |
| 2 | Origem, volta e quem vê | **PASSA** | 278 pistas, ids únicos, 15 salas. `quemPodeVer` "todos" nas 278. 86 com `precisaDe`, e as 86 com `porque`. 0 referência quebrada. 0 pista inalcançável nas 5 causas (validador). As 4 frases de tranca reescritas continuam batendo com a tranca: `nico_1` pede `falsa_2` (o laudo), e a frase diz "depois que o curador puser o laudo no papel". **Toque em toda pista travada:** 64 trancas × 5 causas = 320 toques; 320 com a frase certa, 0 de energia gasta, 0 pista entrou, 0 botão coberto, 0 frase diferente entre causas. Nenhum item preso embaixo da barra (15 salas, 2 tamanhos). |
| 3 | Palavras proibidas por volta e prévias (ordem, pontos da peça, contagem, custo, ícone, altura) | **PASSA** | **Bloqueante B1 da rodada 7 fechada.** Pontos da peça: 0 de 15 salas com desenho diferente; 0 em 150 combinações (lugar, direção, aceso, no caderno, ordem, largura); 0 em 150 combinações à vista, em 2 tamanhos (contagem igual, posição igual com 1 px de tolerância, menor distância entre pontos de 48 px, 0 fora da peça, 0 ponto sem lugar). **Com o caderno enchendo:** 2.100 comparações, 0 diferença em ponto aceso, apagado, no caderno, travado ou na lista. O lugar sai da sala e do rótulo, calculado sobre todas as pistas da sala em qualquer noite. Lugares por sala: 7 a 32, nunca dois rótulos no mesmo lugar. **Tela inteira com a causa trocada:** 2.760 comparações (mapa, 15 salas em 5 minutos, 4 abas da Máquina, pausa, Passar pista), 0 diferença em rótulo, ordem, quantidade, custo, ícone, "ainda não", "travada", altura e largura de cada botão e altura da lista. **Ordem:** 600 sementes, 0 de 75; 22.500 comparações, 0; validador (g) e (g2) OK. **Rótulos:** os 8 reescritos continuam iguais entre o sinal e o par inocente (`d_fus_2` e `fh_vidro` = "Pela fresta do quadro"; `b_luz_4` e `fh_lamp_lab` = "Luminária do varal"). 216 chaves de sala e rótulo, 0 diferença entre causas além das 11 atividades de conserto (aparecem depois do diagnóstico, como antes). Listas: 15 salas, mesma contagem nas 5 causas. **Palavras:** "Lenz" em 0 das 1.280 telas das voltas 0 a 2 e 0 antes da volta 3 nas 2 salas simuladas. Nome do defeito na aba Atividades sem diagnóstico: 0 em 800 telas. Toque num ponto: examina a pista e gasta 1 de energia, como a lista. Menor m5. |
| 4 | Fonte para cada fato essencial (1, 2 e 3 pessoas, 5 causas, simulador e código) | **PASSA** | **Simulador:** `validar.py` com 2.000 bots, "APROVADO nas 5 causas". O caminho ótimo com 1, 2 e 3 pessoas chega ao Ouro na volta 5, com 5 jogos de valores sorteados. `trio.py` repete com 4 e 5 pessoas: Ouro. Bot aleatório: 0,00% a 0,05% de Ouro ou Desligar. 0 essencial sem 2 caminhos; 0 sala que fecha o diagnóstico sozinha. **Código real:** 1 pessoa, com `collect()` de verdade e 5 de energia por volta: Ouro nas 5 causas. 2 aparelhos, mesma semente: DESFECHO DA TURMA Ouro nas 5. 3 aparelhos (o terceiro só com as 3 provas, sem diagnóstico): DESFECHO DA TURMA Ouro nas 5. Minijogos por toque nas 5 causas: a resposta certa põe a pista no caderno. A missão da Ivone segue a regra nova nas 5 causas: a fala da tinta junto do pote ou do bilhete da cafeteira fecha; só a conversa do Seu Dirceu, só a fala ou só o pote não fecham. Menores m6, m7. |
| 5 | Códigos decoráveis | **PASSA** | 4.000 sementes: dia de 9 a 25 (17 valores, 208 a 263 cada); hora em 5 valores (752 a 857); registro de 105 a 994 (879 distintos); 6 ordens (637 a 692); 3 chaves; 5 causas entre 19,4% e 21,1%. 0 partida com o trio padrão; 0 marcador `{…}` sobrando nas 3.220 telas e nas 2 salas simuladas. Posição da resposta certa em 3.000 sorteios: listas 982 a 1.016; foto (4 opções) 739 a 761; caixa (4) 738 a 763; fita (3) 955 a 1.035; acusação (4) 706 a 781; cópia 975 a 1.017; "antes da luz" 973 a 1.014; luz nas posições 2 a 5, 729 a 780. Código de Passar pista e palavra da dupla saem da semente. Menor m8. |
| 6 | Contagem de palavras (até 60 por bloco) | **PASSA** | 105.847 blocos medidos no DOM nas 5 causas: **0 acima de 60**. Maiores: "Como funciona" 58; interfone da Dra. Sato 58 (25 variantes, incluindo a fala nova dos mostradores piscando, com 56); pendrive no rádio 56 (era 57); `coop_veredito` 55. Caderno cheio: 1.041 anotações, rótulo em linha própria em todas. Textos novos da revisão 8: 2 a 46 palavras (o maior é o manual, página 3). Telão até 29 por bloco; maior linha da sala simulada, 41. Menor m9. |
| 7 | Documentação × dados × código | **PASSA** | Cabeçalhos dos dados, do `loop-central-dados.js`, do validador, do simulador de texto e do LOOP-CENTRAL dizem "revisão 8". Os 38 campos que mudaram estão descritos no LOOP-CENTRAL e no DECISOES "Revisão 8". Itens por sala na volta 1 iguais nas 3 fontes (doc, dados e tela) nas 15 salas. A missão da Ivone bate com DECISOES e ROTEIRO. A entrada "Cinco minutos. A mesma noite. O museu recomeça. Você não." aparece em `index.html`, `reserva/` e `individual.html`. 0 termo trocado na revisão 8 sobrando nas 3.220 telas e nas 989 linhas de sala ("pelo vidro", "tampa do quadro", "lâmpada vermelha", "geladeira", "duas fotos"). Por toque, nas 5 causas: 137 botões de ação, 0 sem resposta à vista; "Liga." no Fio a Fio sem dupla; dicionário com "Base da peça"; 0 marca no meio de palavra composta em 556 textos. Menores da rodada 7 fechadas: m7 (parte 4), m8, m9, m10 e m12, além do cabeçalho "revisao 3" do simulador (parte de m11). Menores m10 a m14. |
| 8 | Registro de revisão e checklist | **PASSA** | LOOP-CENTRAL tem "Revisão 8 — 25/11/2026" com o porquê, as peças e ícones, o código arquivo por arquivo, os dados, o validador, os testes e o que não foi aplicado. Os 38 campos que mudaram estão todos no registro. Checklist: 231/25/9/9/4 = 278 e ativas 207/208/207/207/212, iguais aos dados; horários da tabela iguais a `segundo_min`; itens por sala iguais à tela. DECISOES tem "Revisão 8" com as escolhas, o que não foi aplicado e "Ficou para decidir". **Cópias:** os 26 arquivos que mudaram desde o fim da rodada 7 têm cópia `_SUBSTITUIDO_2026-11-25j` idêntica (md5) à versão auditada na rodada 7. Menores m15, m16. |
| 9 | Vocabulário de projeto e gênero no texto visível | **PASSA** | 3.220 telas, 989 linhas das 2 salas simuladas (telão, Professor, participantes) e torre: 0 identificador interno; 0 "solo", "coop", "semente", "rodada", "jogador", "investigador", "aluno"; 0 nome de escala ou de revisão; 0 "carga" como recurso; 0 "Mão A/B". "Pronto" só para coisa ("a mão pronta", "deixar pronto o que o conserto pede"). Textos novos: segunda pessoa sem marca de gênero ("Você volta ao cadeado amarelo", "Você conta dos mostradores piscando"); o "Obrigado" do Ouro é fala do Aurélio. Menores m17, m18. |
| 10 | Tela real sem camada antiga (peças sem erro de rede, ícones sem 404) | **PASSA** | **Rede:** 794 pedidos em `y/rede.mjs`, 0 resposta ≥ 400, 0 pedido que falhou, 0 erro de página ou de console. **Peças:** 30 de 30 entradas de sala com a peça carregada; as 15 peças do Loop vêm com 200 (as 8 novas são Q01, D10, L08, N18, N17, DESC_B, REL_B e GAL_B). **Ícones:** 32 pedidos, todos com 200, entre eles os novos `ui/saguao`, `ui/missao`, `ui/energia` e `ui/uma-tentativa`. Os outros 2 novos (`ui/manual`, `ui/fato-falta`) e `ui/dois-defeitos` existem na pasta. 0 emoji provisório no lugar de ícone (só um comentário em `loop-central.js` cita "ui/nome"). **Telas:** mapa com as 15 salas nas 50 telas de mapa; 9.480 itens de lista, 0 fora da história (13.240 pistas antigas filtradas); `reserva/` leva para a entrada; 0 erro de página em todos os testes. **Torre "Ver o museu em 3D", por toque, 2 tamanhos:** `museu/torre/?loop=1`, 15 salas, 0 de fora, 0 faltando, andar e nome iguais ao jogo, "Sair" volta. **Peça no meio da tela:** as 15 salas, com as 8 peças novas, ficam inteiras, centradas e acima do cartão (2 rodadas do teste, 0 falha). **Gravador:** por toque, nas 5 causas e voltas 1 a 5, 0 falha; não muda de altura. **Minijogos:** as imagens novas carregam (GAL_B, N18, L08, D10). **Telão:** 5 páginas; com 40 nomes em 1.280 e 1.920 de largura, 0 corte e letra mínima de 1,40% da largura; Missões com 8 missões e 40 nomes: 0 corte. Menores m19 e m20 (as m17 e m18 da rodada 7). |

## Antes | agora | motivo

| # | Rodada 7 | Rodada 8 | Motivo |
|---|---|---|---|
| 1 | passa | passa | Refeito. Os 38 campos novos não criam testemunha nem horário; o Aurélio do Ouro agora está na sala certa. |
| 2 | passa | passa | Mais 320 toques; as 4 frases de tranca reescritas batem com a tranca. |
| 3 | **não passa (1)** | **passa** | Os pontos da peça saem da sala e do rótulo: 0 de 15 salas diferentes (eram 13). Entrou o teste com o caderno enchendo: 2.100 comparações, 0 diferença. |
| 4 | passa | passa | Refeito: simulador e código real com 1, 2 e 3 pessoas; missão da Ivone conferida com a regra nova. |
| 5 | passa | passa | Refeito com as opções novas (fita com 3, caixa com 4 cheiros, foto com 4). |
| 6 | passa | passa | 105.847 blocos; os textos novos ficam em até 58. |
| 7 | passa | passa | Corrigidas as menores m7 (parte 4), m8, m9, m10, m12 e o cabeçalho do simulador. Entram 2 menores novas de documento (m10, m11) e 1 de texto visível (m12). |
| 8 | passa | passa | Fechada a m13 (cópias). Entra 1 menor nova (m15): o registro diz que nenhum rótulo mudou, mas mudaram 8. |
| 9 | passa | passa | Nada novo vazou. |
| 10 | passa | passa | 8 peças e 6 ícones novos carregando: 0 erro de rede. |

## Bloqueantes

Nenhuma.

## Menores (não bloqueiam)

**Cronologia (item 1)**
- **m1.** (rodada 7, m1, continua.) Na noite D, quem conserta pelo fusível de reserva pode chegar ao fim sem ter lido nada do Téo. O conserto diz "Você refez o que o Téo desfez". Do mesmo tipo: o "Caso aberto" e os Desligar das noites B e C falam em "cópia" para quem pode não ter achado a troca.
- **m2.** (rodada 7, m2.) `coop_veredito` vai para os dois aparelhos da dupla (decisão registrada).
- **m3.** (nova) `cracha_2`: "No armário da equipe, **no corredor** ao lado da Base da limpeza". Nenhuma sala do jogo se chama corredor, e a Área de descanso tem o identificador interno `corredor`. A pista fica na lista da Base da limpeza; não contradiz nada, mas pode fazer alguém procurar uma sala Corredor.
- **m4.** (nova) `dis_gato`, no Pátio: "O Nico diz que é do Fusível". É fala relatada (o Nico fica na Base da limpeza), mas o presente "diz" pode dar a impressão de que ele está no Pátio. Antes era "O Nico chama de Fusível".

**Prévias (item 3)**
- **m5.** (nova, preventiva) O Subsolo tem exatamente 32 rótulos no total, para 32 lugares na peça. Se entrar mais uma pista com rótulo novo, dois rótulos passam a dividir o mesmo lugar (`vaga % 32`). Continuaria igual nas 5 causas, mas os pontos se empilhariam. Hoje: 0 lugar repetido.

**Fontes (item 4)**
- **m6.** (rodada 7, m3.) O simulador de texto continua diferente do jogo no dossiê do grupo, na pré-conferência e no limite de atividades em dupla (registrado).
- **m7.** (rodada 7, m4.) Em dupla ou trio, o aparelho que não está no Subsolo termina em "Caso aberto" ou "A verdade apareceu"; o Ouro aparece no DESFECHO DA TURMA (regra escrita).

**Códigos (item 5)**
- **m8.** (rodada 7, m5.) A resposta certa de cada minijogo é sempre a mesma frase (só a posição é sorteada), e errar não custa nada ("Ficou para decidir"). A dica nova da fita ("Quem está saindo do museu ainda está de roupa seca.") praticamente dá a resposta.

**Palavras (item 6)**
- **m9.** (rodada 7, m6.) O cartão de atividade aberto e o "Dicionário das palavras" somam mais de 60 palavras no conjunto; cada bloco fica abaixo (decisão registrada).

**Documentos e texto (item 7)**
- **m10.** (nova) ROTEIRO-LOOP ficou para trás do "ajuste de texto às peças novas".
  - Parte 15, linha 442: o Apagão Combinado é "do lado de fora da **tampa** do Quadro externo (a tampa com cadeado continua fechada)". Nos dados é "do lado de fora da **porta**".
  - A parte 15 não traz a porta entreaberta e a fresta, o cadeado de aviso amarelo, as 3 fotos, a luminária do varal, o armário no corredor, o multímetro no carrinho, a caixa na estante, nem a cafeteira no lugar da geladeira (LOOP-CENTRAL e DECISOES trazem).
  - As partes 9 a 14 ainda dizem "cadeado vermelho de aviso" (linhas 192, 229 e 233) e "duas fotos" (linha 233).
  - `n6/citacoes.py` acha 26 trechos citados sem correspondência nos dados (eram 24). Os da `teo_radio` (L171), do Ouro (L291) e da entrada (L375) estão cobertos pela parte 15.
  - Na parte 1 (L56) continua "ou eu não tenho mais empresa"; nos dados é "...mais empresa pra te pagar".
- **m11.** (nova) DECISOES, linha 118, ainda diz "duas fotos de conferência no varal". A seção "Revisão 8" diz que vale a nova, mas não cita as 3 fotos.
- **m12.** (nova, texto visível) O minijogo `c_peca` ("Abrir a caixa de banners") ainda diz "Três caixas de transporte empilhadas; só uma tem o adesivo do patrocínio". A pista `c_esc_1` agora diz "Numa das caixas etiquetadas da estante..., com o adesivo do patrocinador por baixo". Não revela nada e não quebra, mas descreve a sala de dois jeitos.
- **m13.** (rodada 7, m11, em parte.) Sobram: `GDD.md` com termos antigos; identificadores internos com palavra antiga; `prova_falsa` lista `c_peca` por fora do `grupoFonte`; etiqueta "MANUAL" em 6 grupos (todos registrados). O cabeçalho do simulador foi corrigido.
- **m14.** (nova, interna) `museu/pontos-pecas.html` (ferramenta interna que gera `LOOP_PONTOS`, sem link no jogo) está no DECISOES, mas não na lista arquivo por arquivo do LOOP-CENTRAL.

**Registro (item 8)**
- **m15.** (nova) LOOP-CENTRAL, "O que mudou nos dados": "Nenhuma volta, tranca ou rótulo mudou". Mudaram 8 rótulos (`chave_3`, `quadro_0`, `d_fus_2`, `fh_vidro`, `dis_balde`, `dis_gato`, `b_luz_4`, `fh_lamp_lab`) e a pergunta da tranca `abrir_o_quadro`. O item logo abaixo descreve essas mudanças ("Rótulos novos nos pares..."); as duas frases se contradizem. A regra das trancas não mudou.
- **m16.** (rodada 7, m14.) Os testes de tela citados no registro ficam em `/tmp/roda/r8/`, fora do repositório; o `r8/pontos.mjs`, que guarda a correção B1, inclusive.

**Vocabulário e gênero (item 9)**
- **m17.** (rodada 7, m15.) "O Professor encerrou a aula. Obrigado por participar!" (padrão de sala dos outros jogos; em "Ficou para decidir").
- **m18.** (rodada 7, m16.) "Simulador" e "Professor" na entrada como nomes do padrão de sala; no telão, "Troca sozinha: sim" fala da troca de página.

**Camada antiga (item 10)**
- **m19.** (rodada 7, m17.) `sala/conteudo.js` e `game.js` ainda carregam as salas e pistas antigas; a tela filtra todas (13.240 filtradas, 0 mostrada).
- **m20.** (rodada 7, m18.) `museu/` e `museu/torre/` sem `?loop=1` mostram o museu antigo para quem digitar o endereço; nenhum botão do jogo leva até lá. O README ainda aponta para `museu/`.

## Fim do ciclo

A conferência técnica **passou**: 10 de 10 itens, 0 bloqueante. A correção B1 da rodada 7 está aplicada e conferida com caderno vazio, com caderno enchendo, em 2 tamanhos de tela e por toque.

A revisão 8 mexeu em texto (22 textos, 8 rótulos, frases de tranca e o final Ouro). Pela regra 0.3 das escalas, a etapa 1 (história) e as seguintes precisam ser conferidas de novo com esse texto, se ainda não foram. Das menores, as que mexem em texto visível são m3, m4, m8 e m12; as outras são de documento ou registro.
