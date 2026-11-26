# Mosaico Loop v4 revisão 5 — Escala da história (seção 1) — rodada 5, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md, FICHAS.md, LOOP-CENTRAL.md, DECISOES-V4.md, as 278 pistas de pistas_legivel.txt e atividades, finais, regras e grupos de atividades.txt. Das telas, li o texto visível de individual.html e sala/index.html e, no código, os trechos que quem joga lê: game.js (passo a passo, descrição das salas, textos entre voltas, dicas, pausa), loop-central.js (as 4 abas da Máquina, respostas do Anexar, mensagens das atividades, minijogos, missões), ritmo.js (finais do telão e fita da noite) e sala/telao/telao.mjs. Conferi a saída do validador (r5/validar.txt: aprovado nas 5 causas com 1, 2 e 3 pessoas). Não rodei o jogo no navegador: o que digo das telas vem da leitura do código. Nada foi editado no repositório.

## 1. Nota geral

**8,8 / 10 — NÃO PASSOU AINDA. 7 critérios passaram (Premissa, O oculto, Estrutura, Rodízio, Personagens, Prosa, Robustez); 2 ficaram em 8,5 (Jogo limpo e Consistência).** Tudo o que a rodada 4 pediu de texto e dado está aplicado nos textos atuais (lista no fim da parte 2). O que segura agora é pouco e é só texto e dado (cerca de 230 palavras no total):

1. no caminho de sala, o nome "Lenz" nasce de uma rubrica que "vira letra" (`coop_veredito`): nenhum dos dois papéis lidos traz o nome, e ninguém em cena o diz;
2. três textos de prova não batem com o que a pessoa já viu: a base "lisa, sem número" (Lado a Lado) contra o feltro colado de ponta a ponta (`fh_base_perto`); "três caixas com adesivo do patrocínio" (minijogo de `c_peca`) contra uma caixa só (`c_esc_1`, `c_esc_2`); a porta de serviço aberta com o crachá do Braga dentro do resultado das Duas Listas, que não tem essa informação;
3. o ROTEIRO, parte 6, ainda descreve telas que não existem (símbolos nos mostradores, fios de cores e esquema), e LOOP-CENTRAL e DECISOES guardam meia dúzia de frases velhas (queda "minutos antes de 0:00", cabeçalho "revisão 4", missões antigas).

Nenhum ponto de regra do autor baixa nota abaixo de 9 nesta rodada (estão listados na parte 3.3, com o motivo).

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | O tema move o mistério: quem viu calou (`aurelio_1`, `aurelio_2` "Era medo meu", `v4_braga`, `ivone_2`) e só o caderno guarda; `data_3` ("Se ninguém provar, quem fez isso sai pela porta da frente") dá peso ao Desligar sem Revelar e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | Fecha agora: chave às 4:10 + 50 s para armar (`raio_contagem`) = 5:00, queda uns 30 s antes de 0:00, "errou por menos de um minuto"; Câmara só no gerador (`man_pot_1`); a Dra. Sato só pede socorro depois de ouvir (`sato_teo`); Téo nada sabe depois da queda. |
| Estrutura | **9,0** | 9,0 | Escada 231/25/9/9/4 cumprida nos dados; viradas na volta 2 (a verdadeira na caixa, `c_peca`), 3 (o nome em cena, `lenz_2`, `cracha_3`), 4 (ata `rev_3`, voz do Téo) e 5 (a escolha); a volta 4 converge sem fechar; a aba Revelar só mostra o nome do final. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Listas com os mesmos rótulos nas 5 noites, trancas iguais, cena própria em A, B, D e E, final Desligar com um texto por causa, mesmo custo de diagnóstico (3 pistas, da volta 2) e validador com Ouro nas 5. |
| Jogo limpo e dedução | 8,5 | 9,0 | Valores, sinais e provas têm fonte e tranca certas, mas no caminho de dupla o nome aparece do nada (`coop_veredito`: "a rubrica vira letra: Lenz") e três textos de prova trazem fato que não bate ou não tem origem (Lado a Lado "base lisa", minijogo "três caixas", `coop_catraca_ok`). |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas, exceções registradas, falas coerentes com a ficha (`cracha_3` "Tá.", `ivone_1x` "Eu não perco pote", `nico_0b`, `lenz_2` "Eu devolvo tudo que eu pego", `d_teo_2` "Eu reparo"). |
| **Prosa** | **8,5** | **8,0** | Texto curto, em cena, com voz; sobram poucas frases em que o narrador fecha a conta (`coop_veredito`, `coop_catraca_ok`, "Você não chutou: dois sinais diferentes..." no Anexar) e o rótulo "MEIO CERTO". |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes em salas, nenhuma presa a personagem de quem joga; o nome tem dois caminhos sem dupla (`cracha_3`, `lenz_2`); validador chega ao Ouro com 1, 2 e 3 pessoas nas 5 causas; papéis de 2 a 5. |
| Consistência do documento | 8,5 | 9,0 | Roteiro, dados e finais batem no enredo, mas ROTEIRO §6-A/§6-D descrevem telas que não existem, LOOP-CENTRAL e DECISOES ainda dizem "minutos antes de 0:00", "revisão 4" e as missões antigas, e três textos de tela se desmentem (feltro x base lisa; uma caixa x três; ponteiro da noite D). |

### Defeitos menores (não seguram nota; ficam anotados)

- **Premissa.** (a) Os textos do Desligar não dizem o que acontece com o Téo (a sirene e "o Téo abre os olhos" só aparecem no Ouro). (a) "A única pessoa que lembra" / "Só você lembra" (ROTEIRO topo, passo a passo, final Mínimo) não combina com a sala, onde todo mundo lembra; o telão já usa o plural.
- **O oculto.** (a) `hora_5` diz "gerador ligou 1:13", e a Câmara "puxa só do gerador" desde o minuto 0 (`man_pot_1`; "O gerador ronca baixo" na descrição da sala). (a) Não está escrito se a Dra. Sato, fora do prédio, é levada pelas voltas; a sirene do Ouro depende disso e existe mesmo para quem nunca contou do Téo. (a) Na resposta ao lacre cortado (`man_3`), ela afirma em vez de devolver pergunta ("não é defeito. É decisão de alguém"). (a) O alarme das 2:40 toca em toda volta (jogo e telão) e nenhuma pista diz o que o dispara.
- **Estrutura.** (a) A aba Revelar mostra desde o minuto 0 onde achar cada prova ("junte a escala e o bilhete do armário e mostre a quem pode explicar"): é o caminho do nome dado de graça. (a) `teo_d3` usa "cópia" na volta 1 (é a palavra do Téo, não prova).
- **Rodízio.** (a) C e D têm sinal só delas (`c_anc_1`, `d_fus_1`); com a página 1 do manual (`man_1`), uma pista já dá nome ao defeito, enquanto A, B e E pedem cruzar duas. O custo de anexar é igual, por isso não pesa. (a) `d_teo_2` não tem tranca e abre o fusível embaixo da base (`d_f2_1`) na volta 1, enquanto `d_teo_1` e `d_ord_1` pedem um sinal antes.
- **Personagens.** (a) A Dra. Sato diz "Tá. Desta vez eu confio" (loop-central.js, linha 498): "Tá." é a marca do Braga. (a) `man_cal_3`: o Téo copia a receita do ajuste "vai que precisa" em toda noite, e a ficha diz que só na noite do fusível ele sabe do risco. (a) `aurelio_1` entrega o segredo dele na volta 1, só com o cheiro de verniz.
- **Prosa.** (a) `c_peca` e `iso_1` terminam com "Ela está na sua mão" (estado de jogo dentro da cena). (a) `traj_4` conclui "de quem saiu por ela". (a) ROTEIRO §2 repete a regra do pendrive em dois parágrafos seguidos.
- **Robustez.** Com 1 pessoa, o Ouro pede jogo quase perfeito (20 a 21 de 25 de energia no validador): é dificuldade, não falta de fonte.

### O que conferi da rodada 4 (aplicado de fato nos textos atuais)

Aba Revelar só com o nome do final e "O museu esqueceu"; missão "o que aconteceu com o Téo"; entrada do Lenz numa versão só (ROTEIRO §2, `lenz_op_1`, `cracha_4`, `lenz_op_2`, fita do telão); `man_pot_1` e ROTEIRO §6-B/§6-E com a Câmara só no gerador; `sato_teo` com "Peço socorro agora"; plaquinha dos 50 segundos em `raio_contagem` e a conta no ROTEIRO §2; "o manual não sabe desta noite"; `fh_base_perto` e `d_f2_1` com feltro e `dirceu_0` dando motivo; `fh_pont_d`; "MEIO CERTO" sem dizer a opção; missões do Braga e do dinheiro; `coop_veredito` comparando com o visto da escala; `d_teo_1` sem a pergunta do "desfaz"; trancas de `nico_1`, `cracha_3` e `lenz_2` com motivo no mundo; "Dra. Sato na linha" só para informação; cena do diagnóstico do ROTEIRO §5 igual à tela; LOOP-CENTRAL com o cofre de volta e as 8 missões; individual.html ("anda pelas salas com o próprio caderno"); "Noite de véspera" no passo a passo; Saguão no ROTEIRO §3; nomes de tela dos finais no ROTEIRO §8. Não achei nenhuma dessas pendências de volta. Ficou sem aplicar só a troca das missões antigas na DECISOES (ver 3.2-5).

## 3. Abaixo do mínimo — o que corrigir

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra (ou de enredo já fixado) do autor. Palavras: contagem aproximada. Depois de mexer em dado de pista ou de atividade, rodar o validador de novo.

### 3.1 Jogo limpo e dedução (8,5) — tudo (a), cerca de 95 palavras

1. **O nome em Acusação e Defesa (`coop_veredito`).** A escala traz uma rubrica, o bilhete não tem assinatura, e o resultado diz "a rubrica vira letra: Lenz". É o caminho mais usado em sala, e o nome sai sem fonte. Pôr o nome na boca de quem está na sala (o Braga está na Central, onde fica a escala):
   - texto novo do fim: *"...o visto de quem conferiu os crachás pelo patrocínio deita igual. Braga espia por cima do seu ombro e engole seco: 'Essa rubrica? É do Lenz, do patrocínio. Ele assina tudo assim.'"* Saem "a rubrica vira letra: Lenz. O crachá era do Braga. A mão, não." (~30 palavras trocadas; continua só da volta 3.)
2. **Base "lisa, sem número" x feltro.** Na volta 1 a pessoa acha "um feltro novo, colado de ponta a ponta" (`fh_base_perto`; na noite D, `d_f2_1`). Na volta 2, a tela da Galeria no Lado a Lado lista "base lisa, sem número" e `foto_solo` diz "falta o número na base".
   - Lado a Lado, tela A, terceiro item: *"feltro novo embaixo da base, sem número à vista"* (7 palavras).
   - `foto_solo`: *"...a rachadura está do outro lado e, embaixo da base, onde a foto mostra o número, só tem feltro novo."* (~12 palavras).
   - `coop_copia_ok` pode ficar ("o número da base").
3. **Minijogo de `c_peca`** (loop-central.js, linha 642): "Três caixas com adesivo do patrocínio. Qual você abre?" contra uma caixa só (`c_esc_1`; guia "1 caixa de banners"). Texto: *"Agora você tem motivo. Três caixas de transporte empilhadas; só uma tem o adesivo do patrocínio. O que a lista de entregas anotou sobre ela?"* Opções: *"Entrou leve no dia da troca e hoje pesa" / "Chegou hoje, ainda com fita" / "Está em cima das outras"* (~30 palavras).
4. **`coop_catraca_ok`**: a última frase ("E alguém abriu a porta de serviço com o crachá do Braga.") não está em nenhuma das duas listas. Cortar (12 palavras a menos); o fato já tem fonte própria (`traj_1`, `cofre_ronda`).
5. **Onde achar cada prova, na aba Revelar** (loop-central.js, linha 540, `LC_ONDE.cracha`): trocar "junte a escala e o bilhete do armário e mostre a quem pode explicar" por *"descubra quem usou o crachá que abre a porta de serviço"* (~10 palavras). Assim a aba aponta a pergunta, não o caminho.

### 3.2 Consistência do documento (8,5) — tudo (a), cerca de 135 palavras

1. **ROTEIRO §6-A, "Três Números".** "Uma pessoa gira os mostradores no Subsolo e só vê símbolos. Outra, no Ateliê, tem a legenda e dita." A tela não tem símbolos (a própria parte 12 e a DECISOES, revisão 5, dizem isso). Texto: *"Uma pessoa, no Ateliê, dita os três valores que tem no caderno. Outra, no Subsolo, digita nos mostradores e repete em voz alta."* (~25 palavras).
2. **ROTEIRO §6-D, "Fio a Fio".** "...vê três fios de cores diferentes, sem número. Outra, na Oficina elétrica, tem o esquema que diz qual cor é qual número. Ela dita a ordem..." Texto: *"Uma pessoa no Subsolo, de luva isolante, encaixa o F2 e digita a ordem dos três pontos do jeito que ouvir. Outra, na Oficina elétrica, dita a ordem que tem no caderno (três números com hífen, do jeito 0-0-0) e arma o disjuntor quando ouvir 'liguei'."* (~45 palavras).
3. **Queda do Téo.** LOOP-CENTRAL (Registro de revisão, "Mundo e história") e DECISOES ("Mundo") dizem "minutos antes de 0:00"; o ROTEIRO §2 diz "uns trinta segundos antes de 0:00", e a conta das 4:10 depende disso. Nos dois arquivos: *"uns trinta segundos antes de 0:00"* (2 trocas, 5 palavras cada).
4. **LOOP-CENTRAL, cabeçalho e linha "Cada aparelho por si".** "revisão 4 de 25/11/2026" vira *"revisão 5"*; "o aparelho precisa do diagnóstico e das fontes de entrada" vira *"o aparelho precisa das fontes de entrada no próprio caderno; só os consertos pedem também o diagnóstico"* (~18 palavras). Na DECISOES, a primeira linha cita só as revisões 2, 3 e 4: acrescentar a 5.
5. **DECISOES, "Regras e códigos" e "Revisão 3 · Textos".** Ainda trazem "o que derrubou o Téo", "por que a Ivone não pode ter trocado" e "onde a peça verdadeira está" (pedido da rodada 4, não aplicado aqui). Copiar a redação do jogo: *"o que aconteceu com o Téo"*, *"por que a tinta da Ivone não faz dela culpada"*, *"o que tem na caixa que pesa demais"* (~20 palavras).
6. **Ponteiro da noite D.** `fh_pont_d` ("a etiqueta tampa os números") e `fh_cam_agulha_d` ("Não dá para ler") contra a tela de Painel e Manual da noite D ("ponteiro: balançando no meio") e `coop_painel_D` ("tem força chegando"). Mais simples: tela do painel, noite D: *"ponteiro: atrás de uma etiqueta de papel, tremendo"* e acrescentar essa opção à pergunta do Ateliê (8 palavras; conferir `perguntaB.opcoes` e `certo`).
7. **`hora_5`**: "gerador ligou 1:13" vira *"gerador assumiu a luz 1:13"* (3 palavras), para não brigar com `man_pot_1`.
8. **Entrada (individual.html e sala/index.html)**: "O museu está prestes a fechar." vira *"Noite de véspera no museu."* (5 palavras; é a frase do passo a passo).
9. **ROTEIRO §5, Cena do Raio**: "Na quinta você entende que o apagão é o raio" contra o §4 ("Volta 1: você descobre que o apagão é um raio"). Texto: *"Na quinta, o raio que você só anotava vira a força que faltava."* (~12 palavras).
10. Os itens 3.1-2 e 3.1-3 (feltro; uma caixa) também contam aqui.

### 3.3 Pontos que só mudam com decisão de regra do autor (não baixam nota nesta rodada)

O jogo é coerente como está em todos eles; digo o que cada um custa.

1. **"Quem" e "por quê" já na volta 1.** `data_2` ("Pedido do patrocinador"), `motivo_1` (contrato), `c_esc_2` (guia "retira: patrocínio") e `traj_3` ("Só preciso de cinco minutos de volta", de graça às 4:10) deixam a história quase inteira na primeira volta; a volta 3 entrega um sobrenome e a confissão do Braga, não uma surpresa. Não baixa porque o jogo se apresenta como "provas, não palpite" (passo a passo) e nada do que é travado (provas, nome, Revelar) abre mais cedo por isso. Custo: a virada da volta 3 fica mais fraca. Decisão já tomada na revisão 5 ("ficam como estão").
2. **Piso de volta em `nico_1`, `cracha_3` e `lenz_2`.** Quem já tem tudo o que a frase pede na volta 2 ainda vê "ainda não". A tela não promete nada falso (a frase do mundo só aparece quando falta pista), por isso não baixa.
3. **Revelar sem consertar é esquecido às 5:00.** A pergunta "se só desse uma, qual vocês escolhiam" pende para o conserto. Não baixa: `data_3` e `v4_teo` sustentam que consertar sem provar deixa quem trocou sair pela porta da frente.
4. **Revelar só na volta 5** ("o telão da Recepção só aceita na última") não tem motivo no mundo, ao contrário do botão "Loop Reset", que tem (`loop_reset`). Não baixa: é regra anunciada desde a entrada.
5. **Por que quem joga lembra** não é dito em lugar nenhum. É convenção do gênero e o lema ("O caderno lembra") segura.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 4) | Agora (rodada 5) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. |
| O oculto | 8,5 | **9,0** | Fechados os três furos: força da noite B (`man_pot_1`), socorro pedido só depois de ouvir (`sato_teo`), os 50 segundos entre 4:10 e 5:00 (`raio_contagem`). Sobram só menores. |
| Estrutura | 8,5 | **9,0** | Aba Revelar sem o texto do final; missão do Téo reescrita; `d_teo_1` sem adiantar o engano. O que resta é ponto do autor (3.3-1 e 3.3-2). |
| Rodízio (causas A–E) | 9,0 | **9,0** | Sem mudança; "MEIO CERTO" não diz mais a opção. |
| Jogo limpo e dedução | 8,5 | 8,5 | As duas entradas do Lenz e a base "sem número" na volta 1 foram resolvidas. Achados desta rodada: o nome sem fonte em `coop_veredito` e três textos de prova que não batem. |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança; bilhetes do Téo assinados, Nico e Braga com motivo para calar. |
| Prosa | 8,5 | **8,5** | `foto_solo` e `lenz_mot_3` acertados; restam poucas conclusões do narrador. |
| Robustez por número de jogadores | 9,0 | **9,0** | Sem mudança; validador aprovado de novo. |
| Consistência do documento | 8,5 | 8,5 | As 10 divergências da rodada 4 fechadas, menos as missões antigas na DECISOES. Restam o ROTEIRO §6-A/§6-D, frases velhas em LOOP-CENTRAL e DECISOES e três textos de tela. |
| **Geral** | **8,7** | **8,8** | Nenhuma nota caiu. |

**Achados que vieram de correção da revisão 5** (nenhum derrubou nota, mas três estão nas listas acima): o feltro de `fh_base_perto` passou a brigar com "base lisa" do Lado a Lado (3.1-2); "a Câmara puxa só do gerador" passou a brigar com "gerador ligou 1:13" (3.2-7); as telas de Três Números e Fio a Fio foram acertadas nos papéis e na parte 12 do ROTEIRO, mas a parte 6 ficou com a descrição antiga (3.2-1 e 3.2-2).

## 5. Fim do ciclo

**Ainda não passou.** Faltam 0,5 em Jogo limpo e 0,5 em Consistência. As correções (a) somam cerca de 230 palavras e, a meu ver, bastam para os dois chegarem a 9,0 sem decisão nova; os pontos (b) da parte 3.3 são do autor e não seguram a nota. Depois de corrigir, reavaliar a seção 1 do zero antes de seguir para a seção 2.
