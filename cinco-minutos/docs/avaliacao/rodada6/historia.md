# Mosaico Loop v4 revisão 6 — Escala da história (seção 1) — rodada 6, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md, FICHAS.md, LOOP-CENTRAL.md, DECISOES-V4.md, as 278 pistas de pistas_legivel.txt e o arquivo atividades.txt (regras, trancas, grupos, atividades, finais, papéis). Das telas, li o texto visível de individual.html e sala/index.html e, no código, o que quem joga lê: game.js (descrição das salas, passo a passo, textos entre voltas, dicas, pausa), loop-central.js inteiro (as 4 abas da Máquina, respostas do Anexar, mensagens das atividades, minijogos, missões, papéis), ritmo.js (finais do telão e fita da noite) e os textos de sala/telao/telao.mjs. Conferi no dado vivo (dados/pistas-v4.json) os pontos em que o resumo legível podia estar velho. Não rodei o jogo no navegador: o que digo das telas vem da leitura do código.

Validador: o resultado guardado (r6/validar.txt) e uma nova execução minha dizem a mesma coisa: APROVADO nas 5 causas, com 1, 2 e 3 pessoas, 5 sementes. Ao rodar, o Python criou a pasta `dados/__pycache__/`; apaguei em seguida e o `git status` do repositório voltou a ficar limpo. Nada mais foi tocado.

## 1. Nota geral

**8,9 / 10 — NÃO PASSOU AINDA, por um critério só. 8 critérios passaram; Jogo limpo e dedução ficou em 8,5.**

Tudo o que a rodada 5 pediu de texto e dado está aplicado e conferido (lista no fim da parte 2). O que segura é uma contradição que a própria correção da revisão 6 deixou na noite do fusível (causa D): a comparação da foto olha embaixo da base e diz "só tem feltro novo", e é embaixo dessa base que está o fusível F2 colado com fita. Somam-se dois minijogos que perguntam o que a tranca da pista não garante no caderno. São cerca de 60 palavras em 6 textos.

Nenhum ponto de regra do autor (lista "Revisão 6 · Ficou para decidir") baixa nota abaixo de 9 nesta rodada. Um deles ficou mais pesado por causa da revisão 6 e merece ser decidido primeiro (parte 3.3-1).

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê") e só o caderno guarda; `data_3` dá preço ao Desligar sem Revelar e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha em todos os textos: queda uns 30 s antes de 0:00, chave às 4:10 (`traj_3`), 50 s para armar (`raio_contagem`), disparo às 5:00; a Dra. Sato só comenta o que ouve (`man_3`) e o Téo nada sabe depois da queda. |
| Estrutura | **9,0** | 9,0 | Escada 231/25/9/9/4 conferida no dado; viradas na volta 2 (`c_peca`), 3 (o nome, `lenz_2`/`cracha_3`/`coop_veredito`), 4 (`rev_3`, `teo_radio`) e 5 (a escolha); a volta 4 converge sem fechar; nenhum rótulo de volta 2+ aparece na lista da volta 1. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Mesmos rótulos e mesmas trancas nas 5 noites (pares `parDe`), 3 pistas para anexar em todas, cena própria em A, B, D e E, um Desligar por causa e Ouro no validador nas 5. |
| Jogo limpo e dedução | 8,5 | 9,0 | Na noite D, `foto_solo` ("embaixo da base... só tem feltro novo") e a tela do Lado a Lado desmentem `d_f2_1` (F2 colado embaixo da base) e pulam a tranca "você não tem motivo para mexer nela"; os minijogos de `c_peca` e `tombo_2` pedem papel que a tranca não exige. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas e exceções registradas; falas batem com a ficha (`cracha_3` "Tá.", `ivone_1x` "Eu não perco pote", `nico_0b`, `lenz_2` "Eu devolvo tudo que eu pego", `d_teo_2` "Eu reparo"); a Dra. Sato não diz mais "Tá.". |
| **Prosa** | **8,5** | **8,0** | Texto curto, em cena e com voz (`e_hist_1` "Alguém ligou."); sobram frases do narrador fechando a conta ("Você não chutou: dois sinais diferentes..." no Anexar, `mancha_2`, `conserto_D`, `lenz_3`) e rótulos de formulário ("MEIO CERTO", "ATIVIDADE FEITA"). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes em salas, nenhuma presa a personagem de quem joga; o nome tem dois caminhos sem dupla (`cracha_3`, `lenz_2`); validador com Ouro para 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | ROTEIRO (partes 2 a 13), dados, finais, fita do telão e LOOP-CENTRAL contam a mesma noite e as 10 divergências da rodada 5 fecharam; restam desvios pequenos e soltos (lista abaixo). A contradição da noite D foi contada em Jogo limpo, não aqui, para não pesar duas vezes. |

### Defeitos menores (não seguram nota; ficam anotados)

Todos são (a), de texto ou dado, salvo quando digo (b).

- **Premissa.** A sirene nos 6 textos do Desligar ("o socorro do Téo") deixa o Desligar mais barato: com o Téo socorrido e o caderno cheio, "ninguém viu o que você viu" pesa menos. A pergunta do telão ainda se sustenta (a caixa sai cedo, antes de alguém falar).
- **O oculto.** (b) A sirene do Ouro e do Desligar existe mesmo para quem nunca contou do Téo pelo interfone (`sato_teo`), e nenhum texto diz se a Dra. Sato, fora do prédio, é levada pelas voltas (ver 3.3-1). (b) O alarme das 2:40 toca sem causa escrita. (a) A doutora está "presa na estrada" e fala por um interfone do Subsolo; a ficha diz "interfone ou rádio" e, na coluna "O que vê", "nada", enquanto a exceção diz que ela vê o céu.
- **Estrutura.** (b) `data_2`, `motivo_1`, `c_esc_2`, `cracha_1` com o visto do patrocínio e `traj_3` deixam "quem" e "por quê" quase inteiros na volta 1; a volta 3 entrega um sobrenome (decisão já tomada). (a) A aba Revelar, desde o minuto 0, diz onde procurar ("olhe a peça da Galeria de perto, com alguma coisa para comparar"; "quem usou o crachá que abre a porta de serviço"). (a) `teo_d3` usa "cópia" na volta 1 (palavra do Téo, não prova).
- **Rodízio.** C e D têm sinal só delas (`c_anc_1`, `d_fus_1`): com `man_1`, uma pista já dá nome ao defeito; A, B e E pedem cruzar duas. O custo de anexar é igual, por isso não pesa. (b) `d_teo_2` sem tranca.
- **Personagens.** (a) Em `coop_veredito` o Braga dá o nome de pronto, e a tranca de `cracha_3` diz que "ele só fala" com a prova da cópia na frente; dá para defender (reconhecer uma rubrica não é confessar), mas a FICHAS.md não ganhou linha da revisão 6 e a exceção do Lenz ainda diz que o nome sai só quando ele atende o telefone. (b) `man_cal_3` e `aurelio_1`, já registrados.
- **Prosa.** Listados na tabela. Mais: "Registrar revelação" (botão), "Marcadas: 3 de 3 · sinais: 2 (2 tipos)..." (já na lista do autor).
- **Robustez.** Com 1 pessoa o Ouro pede jogo quase perfeito: é dificuldade, não falta de fonte.
- **Consistência.** (a) ROTEIRO, parte 5, cena do diagnóstico: diz que no acerto a resposta vem "pista por pista"; a tela só mostra as linhas quando recusa (no acerto vem o placar e a frase). (a) ROTEIRO, parte 13, "Embaixo da base... igual ao que se acha na volta 1": na noite D o que se acha é o fusível. (a) Dicionário da Máquina: "Luz da peça: mostra se a peça da base é a registrada"; nas noites A, B, D e E a luz está verde com a cópia na base (ela só confere quando está presa à peça). (a) Minijogo de `tombo_2`: foto "cor de pó"; Lado a Lado: "pedra escura, fosca". (a) DECISOES, revisão 6: a frase '"Tem força chegando", na leitura completa, ficou: o ponteiro treme' pode ser lida como "foi trocada" (não foi: `coop_painel_D` continua "tem força chegando") ou como "ficou como estava"; escrever por extenso. (a) Campos internos com palavra velha ("gira", "Símbolos embaralhados", "Cores embaralhadas", "peça falsa"): não vão para a tela.

### O que conferi da rodada 5 (aplicado de fato nos textos atuais)

`coop_veredito` com o nome na boca do Braga; Lado a Lado e `foto_solo` com o feltro; minijogo da caixa com uma caixa só de adesivo e 4 opções; `coop_catraca_ok` sem a frase do crachá; dica do crachá na aba Revelar; ROTEIRO, parte 6, A e D, com ditar e digitar; "uns trinta segundos antes de 0:00" em LOOP-CENTRAL e DECISOES; cabeçalhos "revisão 6"; missões com a redação do jogo na DECISOES; painel da noite D com a etiqueta de papel (tela e opção); `hora_5` "gerador assumiu a luz"; "Noite de véspera no museu." nas duas entradas; cena do Raio sem "na quinta você entende"; Desligar com o Téo; nenhum "só você lembra"; "Quem opera" e "Quem apoia". Nenhuma voltou atrás.

## 3. Abaixo do mínimo — o que corrigir

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra do autor. Palavras: contagem aproximada. Depois de mexer em dado, rodar o validador de novo.

### 3.1 Jogo limpo e dedução (8,5) — tudo (a), cerca de 60 palavras

1. **Noite D: a comparação olha embaixo da base e não vê o fusível.** `d_f2_1`: "Colado com fita embaixo da base, por cima de um feltro novo: um fusível de vidro. F2." `foto_solo` (toda noite, volta 2): "embaixo da base, onde a foto mostra o número, só tem feltro novo." Lado a Lado, tela da Galeria: "feltro novo embaixo da base, sem número à vista". Na noite D os dois textos ficam no mesmo caderno e se desmentem, justo sobre o esconderijo da peça de que o conserto precisa. Além disso, em toda noite a comparação levanta a peça sem o motivo que `fh_base_perto` e `d_f2_1` exigem. A saída mais simples é tirar o "embaixo da base" da comparação (a falta do número continua com `fh_base_perto`, e o número gravado continua em `c_peca`):
   - Lado a Lado, tela A, item 3: *"superfície lisa, sem um risco"*; tela B, item 3: *"riscos finos e desgaste nas bordas"* (9 palavras).
   - `coop_copia_ok`: *"Vocês acham 3 diferenças: o lado da rachadura, a cor da pedra e os riscos do tempo, que a peça exposta não tem."* (~10 palavras trocadas).
   - `foto_solo`: *"...a rachadura está do outro lado e a pedra, fosca e riscada na foto, aqui brilha lisa."* (~14 palavras).
   - ROTEIRO, parte 13, linha "Embaixo da base", e a linha igual em LOOP-CENTRAL: acompanhar (~15 palavras).
   - Se preferir manter o número na comparação, a outra saída é um texto próprio da noite D; não recomendo, porque entrega o F2 a quem não seguiu o recado do Téo.
2. **Minijogo de `c_peca`.** Pergunta "o que a lista de entregas anotou sobre ela?" (`lenz_meio_1`), e a tranca pede o cheiro de verniz mais UMA de três pistas (`c_esc_1`, `c_esc_2`, `c_esc_3`); a lista de entregas não é nenhuma delas. Ou a pergunta passa a pedir o que a tranca garante, ou a lista entra na tranca. Texto que pede o garantido: *"Agora você tem motivo. Três caixas de transporte empilhadas; só uma tem o adesivo do patrocínio. O que você sentiu diante da peça da Galeria que faz você abrir esta?"* com *"Cheiro de verniz fresco" / "Cheiro de mofo" / "Cheiro de tinta vermelha" / "Nenhum cheiro"* (~25 palavras).
3. **Minijogo de `tombo_2`** (uma das 3 fontes do número de registro, volta 1): pergunta "o que você anotou diante da peça da Galeria", e a pista não pede `falsa_1`. Quem passa primeiro pela Sala da fotografia responde no chute. Perguntar pelo que a própria foto mostra: *"A foto foi tirada de baixo. O que aparece gravado na base?"* com opções *"Um número de três algarismos" / "O nome do museu" / "Uma data" / "Nada"* (~20 palavras). Aproveitar e trocar "cor de pó" por "escura, fosca".
4. **Dicionário, "Luz da peça"**: *"A luz do painel que acende amarela quando a Câmara está presa a uma peça e a peça da base não é a registrada."* (~12 palavras trocadas). Sem isso, luz verde nas noites A, B, D e E lê-se como "a peça é a verdadeira".

### 3.2 Menores de Consistência que vale fechar junto (não seguram nota), cerca de 45 palavras

ROTEIRO, parte 5 (no acerto: placar e frase, sem as linhas); FICHAS.md com uma linha "Revisão 6" (o Braga reconhece a rubrica em Acusação e Defesa; a Dra. Sato vê o céu, não o prédio); DECISOES, frase do "tem força chegando" por extenso.

### 3.3 Pontos que só mudam com decisão de regra do autor (nenhum baixa nota nesta rodada)

O jogo é coerente como está em todos; digo o que cada um custa. Todos já estão em "Revisão 6 · Ficou para decidir", menos a metade nova do primeiro.

1. **A Dra. Sato e as voltas, mais a sirene.** É o que eu decidiria primeiro. A revisão 6 pôs "Lá fora, uma sirene: o socorro do Téo" no Ouro e nos 6 textos do Desligar; o socorro só é pedido quando alguém conta do Téo (`sato_teo`), e ninguém diz se ela lembra de uma volta para a outra. Hoje dá para acabar com sirene sem nunca ter falado com ela. Não baixa porque a pista é grátis, fica na sala da máquina e quase toda partida passa por ela; mas agora sete textos se apoiam num fato que não está escrito. Uma frase resolve (ela fica fora do alcance da Câmara e lembra; ou o pedido vale na volta em que é feito).
2. **"Quem" e "por quê" quase inteiros na volta 1.** Custa a força da virada da volta 3. Não baixa: nada do que é travado (provas, nome, Revelar) abre mais cedo.
3. **Piso de volta em `nico_1`, `cracha_3` e `lenz_2`.** Quem já tem tudo vê "ainda não". Não baixa: a tela não promete nada falso.
4. **Revelar sem consertar é esquecido às 5:00** e **Revelar só na volta 5 sem motivo no mundo.** Não baixam: regra anunciada desde a entrada; `data_3` segura o outro lado da escolha.
5. **Por que quem joga lembra.** Convenção do gênero; o lema segura.
6. **`d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, alarme das 2:40.** Pequenos; nenhum quebra dedução.
7. **Minijogo sem custo de erro** e **entrada por papel nos consertos em dupla.** São de motivação (seção 3 das escalas), não desta escala.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 5) | Agora (rodada 6) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de nota. Desligar agora diz o que acontece com o Téo; "só você lembra" saiu. |
| O oculto | 9,0 | **9,0** | `hora_5` e o lacre cortado acertados. A sirene passou a aparecer em mais textos sem fonte garantida (ponto do autor). |
| Estrutura | 9,0 | **9,0** | Dica do crachá na aba Revelar aponta a pergunta, não o caminho. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Sem mudança. |
| Jogo limpo e dedução | 8,5 | 8,5 | Os 5 itens da rodada 5 fecharam (nome com fonte, uma caixa, listas sem o crachá). Ficou um, nascido da própria correção: o feltro "embaixo da base" entrou na comparação e bate de frente com o F2 da noite D; e dois minijogos reescritos pedem papel fora da tranca. |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança; "Tá." devolvido ao Braga. |
| Prosa | 8,5 | **8,5** | `coop_veredito`, `coop_catraca_ok`, `c_peca`, `iso_1` e `traj_4` acertados; restam o Anexar e rótulos de formulário. |
| Robustez por número de jogadores | 9,0 | **9,0** | Sem mudança; validador aprovado de novo. |
| Consistência do documento | 8,5 | **9,0** | ROTEIRO parte 6, LOOP-CENTRAL, DECISOES e os textos de tela apontados foram alinhados. Restam desvios pequenos e soltos. |
| **Geral** | **8,8** | **8,9** | Nenhuma nota caiu. |

**As correções da revisão 6 criaram contradição nova?** Uma que pesa e duas pequenas:
- pesa: feltro "embaixo da base" em `foto_solo` e no Lado a Lado contra `d_f2_1` (noite D) — item 3.1-1;
- pequena: pergunta nova da caixa pede a lista de entregas, que a tranca não garante — item 3.1-2;
- pequena: a sirene levada para o Desligar aumentou o peso de um fato sem fonte — item 3.3-1.

As demais correções (o nome em `coop_veredito`, `coop_catraca_ok`, painel da noite D, `hora_5`, papéis, finais sem "só você", Sala dos sons como gravador, telão com 5 páginas) não criaram contradição que eu tenha achado.

## 5. Fim do ciclo

**Ainda não passou.** Falta 0,5 em Jogo limpo e dedução. As correções (a) da parte 3.1 somam cerca de 60 palavras e, a meu ver, bastam para o 9,0 sem decisão nova do autor. Depois de corrigir, rodar o validador e reavaliar a seção 1 do zero antes de seguir para a seção 2.
