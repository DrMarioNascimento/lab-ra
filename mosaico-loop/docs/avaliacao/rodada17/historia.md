# Mosaico Loop v4 revisão 16: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei código, dados, capturas que já existiam e um teste de Node sem navegador.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 21;
- FICHAS.md;
- DECISOES-V4.md, revisões 12 a 16;
- LOOP-CENTRAL.md: cabeçalho, revisões 14 a 16 e checklist;
- as 281 pistas de `pistas_legivel.txt`. Ele foi gerado às 19:13 a partir de `dados/pistas-v4.json` ("v4 revisão 16"). Conferi com `cmp` que esse arquivo tem os mesmos bytes de `/tmp/roda/v4_pistas.json`, que é o que o validador lê;
- de `atividades.txt`: `telaPapel` do Lado a Lado, `finais`, `linha_do_tempo_s` e `salas_em_reforma`.

**Código que conferi:**
- game.js: `PLANTA` (comparada com as versões das revisões 13 e 14, `game.js_SUBSTITUIDO_2026-11-26d` e `-26f`), `LOOP_DESC` e `TOUR`;
- loop-central.js: `LC_MG` e o sorteio da posição da luz (linha 706), `LC_FATO_CURTO` e `lcFatosFinal`;
- ritmo.js: `LOOP_LINHA`;
- `museu/icones/ui/glifos.svg` (os símbolos que existem).

**Teste que rodei:** copiei `/tmp/roda/r15/caminho.mjs` para `rod17/` e rodei sobre o game.js atual, só lendo. Resultado: **TUDO CERTO**, 0 falhas.

**Capturas que vi:**
- `r15/cap`: planta do Térreo, luz antes, luz nas 5 posições e desfecho;
- `r14/cap`: Galeria de perto e Lado a Lado (tela antiga, ainda com "pedra cinza").

**Validador:** `r15/validar.txt` diz "revisão 16" e dá APROVADO nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. O bot aleatório fica em no máximo 0,10%.

Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. PASSOU.** Os oito critérios de mínimo 9,0 estão em 9,0. A Prosa está em 8,5 (mínimo 8,0).

A revisão 16 fechou a única obrigatória da rodada 16, a planta do Térreo. Também fechou três menores antigos:
- a caixa × `c_esc_3`;
- a Sala das esculturas na tabela dos andares e nos "Lugares";
- a rachadura do outro lado, agora com motivo no mundo (`falsa_3`).

Não achei contradição nova que derrube nota. Sobram só menores, listados em (b).

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e só o caderno guarda: `aurelio_2` ("Era medo meu."), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê."). O Desligar cobra um preço diferente em cada noite, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: a queda acontece uns 30 s antes de 0:00, a chave é virada às 4:10 (`traj_3`), a máquina leva 50 s para armar (`raio_contagem`), então ele "errou por menos de um minuto". A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). Menor: a foto impressa ao contrário explica a rachadura, mas não explica um símbolo virado só (ver b3). |
| Estrutura | **9,0** | 9,0 | A escada de voltas segue 232/27/9/9/4, e nenhuma volta, tranca ou rótulo mudou na revisão 16. Os títulos não adiantam virada ("Abrir uma caixa da estante", "Antes de acender a luz", "Fundo de uma caixa"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | A revisão 16 não mexeu em `soNaCausa`, `parDe` nem rótulos. `maq_ver` ficou neutro nas 5 noites. Validador: Ouro nas 5, bot em no máximo 0,10%. |
| Jogo limpo e dedução | **9,0** | 9,0 | As três pistas que abrem a caixa agora falam de banners (`c_esc_1`, `c_esc_2`, `c_esc_3`). "Antes de acender a luz" pede que você entenda a foto ("Arranhada, beiradas roídas" × "riscos finos, bordas gastas"). Luz e testa à vista na volta 1 estão registradas como decisão. Menores: b1 e b2. |
| Personagens e fichas | **9,0** | 9,0 | As 8 fichas estão completas, e a voz bate com a ficha: Braga com "Tá." e café (`c_esc_3`), Lenz com "rapidinho" e "Emprestado", Seu Dirceu com "Eu reparo." (`d_teo_2`, que é o contrário do "Não reparei." que ele nunca diria), Nico com o tropeço (`nico_1`). |
| **Prosa** | **8,5** | **8,0** | `maq_ver` virou cena ("Você tenta os comandos. Nada se mexe."), e `falsa_3` mostra a folha sem explicar. Ficam três fechamentos de narrador: "alguém tentou segurar quem caía." (`empurra_2`), "Se saiu, foi por outra porta." (`coop_catraca_ok`, `catraca_solo`) e "Ela só comenta o que você contar." (`man_3`). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes, e a prova da cópia tem 6. O validador, sobre os mesmos bytes dos dados, dá Ouro com 1, 2 e 3 pessoas nas 5 causas. Errar um minijogo continua sem custo. |
| Consistência do documento | **9,0** | 9,0 | A planta agora bate com os caminhos que as pistas descrevem (conferi abaixo e no teste de grafo). ROTEIRO, DECISOES, LOOP-CENTRAL e o comentário de game.js descrevem a mesma grade. Sobram menores de palavra (b4 a b7). |

### Os caminhos das pistas na planta do Térreo (revisão 16)

A grade é `'ele ate ate desc'`, `'tec col col desc'`, `'esc esc est desc'`, `'hall hall hall hall'`, `'rec cen cen limp'`. A captura `r15/cap/planta_terreo_390.png` mostra o mesmo desenho.

| Caminho ou cena | Pistas | Na planta |
|---|---|---|
| Antes de 0:00, as pegadas saem da Sala das coleções, cruzam a Área de descanso e somem na porta de serviço | `coop_pegadas`, `pegadas_solo`, `traj_4` ("ponta virada para a rua"), `mancha` | **Bate.** Coleções → Área de descanso (porta `col r`) → porta de serviço (`desc r end fora`). |
| 4:00 → 4:02 → 4:05 → 4:10 | `traj_1` (chega de fora), `lenz_0` (Área de descanso), `traj_2` (Seu Dirceu: "rumo à escada do Subsolo"), `traj_3` | **Bate.** Porta de serviço → Área de descanso → porta `desc b` → corredor em frente à Base da limpeza (x 255, dentro de 210–300) → corredor → porta da escada (`esc b`). Não entra na Sala das coleções. |
| A escultura aponta para a escada | `pose` | **Bate.** Vidro `est r` virado para a Área de descanso, e a Sala das esculturas encosta na escada. |
| Duas caixas entram na Sala das coleções e só uma sobe para a Galeria | `c_esc_3` | **Bate.** Coleções → Área de descanso → corredor → escada. |
| Armário da equipe ao lado da Base da limpeza; Central "ali do lado" | `cracha_2`, `cracha_3` | **Bate.** O armário está desenhado na Base da limpeza, colado à Central. |
| A porta de vidro da Ivone "dá para a Área de descanso inteira" | `ivone_red` | **Bate:** vidro `ate r`. Menor b2 sobre o que o Seu Dirceu consegue ver. |
| Luvas e chavinha: Oficina técnica → Oficina elétrica → Pátio | `iso_1`, `acesso_3`, `chao_manopla` | **Bate.** |
| Lenz entra pela frente à tarde | `cracha_4`, `lenz_op_1` | **Bate.** A Recepção tem a entrada principal (`rec b fora`). |
| Noite D: o Téo "passou de mão fechada, indo pra Galeria" diante do Seu Dirceu | `d_teo_2` | **Cabe, mas não é obrigatório.** A caixa de fusíveis fica na Oficina técnica, que dá direto na escada (`tec b`). O caminho mais curto até a Galeria não passa pelo corredor. É menor (b6). |

### Pedido de conferência: revisão 16

| Ponto | Resultado |
|---|---|
| Planta × trajeto 4:02 → 4:05 → 4:10 | **Fechado** (tabela acima e `caminho.mjs`: TUDO CERTO). |
| "A cópia não é de pedra" | **Coerente.** Luz: "até o grão". Tela A: "cor cinza, mais clara". `coop_copia_ok`: "a cor". O "pedra" que sobra é da verdadeira, da frase da máscara ou do Pátio. Menor b5: o checklist da LOOP-CENTRAL ainda diz "cor da pedra". |
| Rachadura × foto ao contrário | **Coerente** para a rachadura. Nenhuma pista conclui por quem joga. Menor b3 para o símbolo. |
| `c_esc_3` | **Fechado.** As três pistas que abrem a caixa falam de banners. |
| Antes de acender a luz | **Coerente.** A resposta "Arranhada, beiradas roídas" pede que você entenda `par_foto`, sem repetir as palavras dela. A captura `luz_antes_390` mostra a pergunta e as 4 opções embaralhadas. |
| Luz de lado na volta 1 | **Registrado** (ROTEIRO 4 e 11, DECISOES 16): fica a desconfiança, sem prova no caderno. Não baixa nota. |
| `maq_ver` sem algarismos | **Fechado.** É neutro nas 5 causas. |
| Miniatura GAL_B no desfecho e na fita | **Coerente.** `LOOP_LINHA.copia.ic = 'GAL_B'`. A captura `desfecho_390` mostra a ficha "A cópia na Galeria" com a peça da Galeria. |
| Minijogos parados | Não é da escala da história. As capturas das 5 posições mostram a linha de estado com a mesma altura. |
| Contradição nova entre dados, telas, planta, peças 3D e os 4 documentos? | **Nenhuma que derrube nota.** Só os menores de (b). |

## 3. Abaixo do mínimo

**Nenhum critério ficou abaixo do mínimo.**

### (a) Obrigatórias

**Nenhuma.**

### (b) Retoques opcionais (não seguram nota sozinhos)

**Jogo limpo**
1. **Luz de lado "de frente".** A posição certa da luz é sorteada de 2 a 5 (`loop-central.js`, linha 706). Quando cai em 3, o facho fica no meio, de frente para a máscara (`r15/cap/luz_5pos_390.png`). Mesmo assim, a dica diz "Luz de frente esconde. Luz de lado mostra a superfície.", e o título é "luz de lado". Em cerca de 1 noite em 4, tela e dica se contradizem.
   - Saída: sortear só 2, 4 ou 5 (código pequeno); ou trocar a 1ª dica por "Mude a luz devagar: numa posição a superfície aparece inteira." (cerca de 10 palavras).
2. **A Ivone manda perguntar ao Seu Dirceu, e ele não responde.** `ivone_red` diz: "Pergunta ao Seu Dirceu quantas vezes eu passei por ela desde o fim da tarde." Nenhuma pista do Seu Dirceu responde isso (`ivone_ali_2` fala do dia 14). Além disso, a ida dela até a cafeteira não passa pela porta que ele vê.
   - Não vira contradição, porque o álibi da Ivone tem outras fontes (`ivone_1x`, `dis_cafeira`, `v5_ivone`).
   - Saída: "Pergunta ao Seu Dirceu se eu saí daqui desde o fim da tarde." (cerca de 6 palavras mudam). Ou deixar como está.

**O oculto**
3. **Foto ao contrário × um símbolo só virado.** A ROTEIRO 21 e a DECISOES 16 dizem que a foto espelhada fez "a rachadura ir parar do outro lado **e o quinto símbolo sair virado**". Só que uma imagem espelhada inverteria os seis símbolos e a ordem deles, e na cópia só o 5º está virado.
   - O texto público não afirma isso: `falsa_3` só mostra a folha. Mas quem for exigente faz a ligação.
   - Saída, só nos documentos: deixar a foto ao contrário explicando a rachadura, e o 5º símbolo como erro de quem riscou com pressa, que é o que a ROTEIRO 1 já diz (cerca de 15 palavras na ROTEIRO 21 e na DECISOES 16).

**Consistência (palavra)**
4. **Chuva × estrada.** A ROTEIRO 2 diz que "ontem" a tempestade fechou a estrada, e `fh_ficha_bc` diz "Saio antes da chuva" (ontem). A 2ª dica da fita diz "Lá fora chove desde o começo da noite". Esse menor vem da rodada 16 e não foi aplicado.
   - Saída: "Lá fora chove desde ontem." (2 palavras).
5. **Checklist da LOOP-CENTRAL.** A tabela "Fontes por fato essencial" ainda diz "Lado a Lado: rachadura, **cor da pedra** e desgaste nas bordas". A revisão 16 tirou "pedra" da cópia.
   - Saída: "a cor" (1 palavra).
6. **`d_teo_2` × planta (só na noite D).** O Seu Dirceu viu o Téo "passar" indo para a Galeria. A caixa de fusíveis fica na Oficina técnica, que dá direto na escada, então o caminho natural não passa pelo corredor. Isso cabe se o Téo veio por outro lado, e não é contradição.
   - Saída, se quiser: "Antes de escurecer, o Téo saiu da escada de mão fechada e subiu pra Galeria" (cerca de 6 palavras). Ou deixar como está.
7. **"Copa".** `nico_0` diz "Tem bolacha na copa", e a ficha do Nico diz que ele vê "a copa". Não existe copa na planta, e a ROTEIRO 3 pede um nome só para a sala da cafeteira (Área de descanso).
   - Saída: "Tem bolacha perto da cafeteira" (2 palavras), e o mesmo na FICHAS.

**Prosa**
8. Cortar "alguém tentou segurar quem caía." (`empurra_2`) e "Ela só comenta o que você contar." (`man_3`), deixando a marca e a fala (cerca de 12 palavras). Isso levaria a Prosa para 9,0.

### Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas de antes:
- a Dra. Sato e as voltas;
- o alarme das 2:40;
- "quem" e "por quê" quase inteiros na volta 1;
- piso de volta;
- Revelar só na volta 5;
- por que quem joga lembra;
- `d_teo_2` sem tranca e `man_cal_3`;
- "tábua" com dois sentidos;
- minijogo sem custo de erro;
- a testa à vista desde a volta 1;
- a luz de lado na volta 1 para quem tem a foto grande.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 16, rev. 14) | Agora (rev. 16) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | O molde × a rachadura ganhou motivo no mundo (`falsa_3`). Entra o menor b3, que está só nos documentos. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Nada mudou por causa. Validador: Ouro nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou `c_esc_3`. A luz na volta 1 foi registrada. Entram os menores b1 (luz de frente em 1 noite em 4) e b2. |
| Personagens e fichas | 9,0 | **9,0** | Só frases (`c_esc_3`, `falsa_3`). A voz se mantém. |
| Prosa | 8,5 | **8,5** | `maq_ver` virou cena. Seguem `empurra_2`, `man_3` e "Se saiu, foi por outra porta.". |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador da revisão 16: APROVADO. |
| Consistência do documento | 8,5 | **9,0** | **Subiu:** a planta do Térreo voltou a ter a porta da Área de descanso para o corredor, em frente à Base da limpeza. O trajeto 4:02 → 4:05 → 4:10 e `pose` cabem no mapa, e o teste de grafo passa. Esculturas citadas na ROTEIRO 3 e na LOOP-CENTRAL. |
| **Geral** | **8,9** (não passou) | **8,9** (**passou**) | A média é a mesma, mas nenhum critério está abaixo do mínimo. |

Nenhuma nota caiu por causa das correções técnicas da revisão 16 (altura dos minijogos, miniatura, grade de 4 colunas).

## 5. Fim do ciclo

**A escala da história (seção 1) PASSOU.** Todos os critérios estão no mínimo ou acima. Obrigatórias (a): nenhuma.
