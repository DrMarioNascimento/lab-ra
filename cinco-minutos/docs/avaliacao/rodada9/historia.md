# Mosaico Loop v4 revisão 10: escala da história (seção 1), avaliada do zero

Avaliei como avaliador independente: não escrevi o texto, então não há desconto de autoavaliação. Li inteiros o ESCALAS_AVALIACAO_JOGOS.md e o ROTEIRO-LOOP.md (partes 1 a 17). Li também FICHAS.md, DECISOES-V4.md e LOOP-CENTRAL.md, as 281 pistas de `pistas_legivel.txt` e o `atividades.txt` inteiro (regras, trancas, grupos, atividades, finais).

Das telas, conferi:
- em game.js: `LOOP_DESC` e `TOUR`;
- em loop-central.js: `LC_MG`, com o minijogo novo `insc_copia`, além de `LC_GLIFOS`, `LC_INSC`, dicionário, `LC_ONDE` e `LC_FATO_PISTA`;
- em ritmo.js: os finais curtos, `LOOP_FINAL_COND` e a fita;
- o ramo `glifos` de reserva/minigames.mjs;
- a frase de entrada das três páginas;
- o sprite `museu/icones/ui/glifos.svg`, desenho por desenho, para conferir que o símbolo virado não existe na tábua.

Vi as capturas da inscrição (livro, tábua, minijogo, erro, Revelar, caderno). Confirmei que `loop-central-dados.js` é igual ao `pistas-v4.json`.

No dado vivo ("v4 revisão 10", 281 pistas) conferi a escada: 232 na volta 1, 27 na volta 2, 9 na 3, 9 na 4 e 4 na 5. Também conferi que "Lenz" não aparece em nenhum texto antes da volta 3.

Rodei o validador (`dados/validar.py`) numa cópia fora do repositório, sem gravar bytecode: **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. Bot com 300 partidas: no máximo 0,33% de Ouro ou Desligar.

Não abri o jogo no navegador. O que digo das telas vem do código e das capturas. Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. TODOS OS CRITÉRIOS PASSARAM: oito ficaram em 9,0 (mínimo 9,0) e a Prosa em 8,5 (mínimo 8,0).**

As revisões 9 e 10 fecharam os sete itens que seguravam a Consistência na rodada 8. O ROTEIRO e a FICHAS agora dizem o mesmo que os dados sobre:
- cadeado amarelo;
- três fotos;
- caixa na estante;
- porta do quadro;
- Aurélio na Galeria;
- armário;
- fresta.

O enigma da inscrição é jogo limpo e a peça principal é a máscara em todos os textos.

Duas contradições novas apareceram, as duas pequenas e fora da dedução:
- **`v4_teo`.** O texto nos dados já está trocado para a frase proposta ("a mesma cara"). A DECISOES, revisão 10, diz que a pista "não foi mexida" e deixa a troca para o autor decidir. A LOOP-CENTRAL não registra a troca.
- **Medidor do Pátio.** Há um segundo medidor do Pátio ("medidor de potência ao lado do quadro de energia") que não entrou no alinhamento da revisão 9.

Cada uma, sozinha, é defeito menor. A Consistência fica em 9,0 no limite: mais um desvio do mesmo tipo e cai.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê") e só o caderno guarda; o Desligar tem preço por noite; a inscrição soma ao tema ("Quem copiou com pressa" é a mesma pressa que trocou a peça); a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: tinta escorrendo em 0:00, `traj_3` às 4:10, 50 s de `raio_contagem`, disparo às 5:00. A Dra. Sato só comenta o que ouve. A Câmara não entra no enigma novo: a inscrição é do mundo (livro de registro, pedra). |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4 conferida. A tábua na volta 1 não revela nada sozinha; a inscrição é mais uma porta da volta 2, ao lado de laudo, molde, caixa e foto. Viradas nas voltas 2, 3 (nome), 4 (`rev_3`, `teo_radio`) e 5; nenhum rótulo adianta virada ("Tábua da escrita antiga", "Inscrição na máscara", "A testa, de perto"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | As 3 pistas novas valem nas 5 noites, com mesmo rótulo e mesma ordem. Os rótulos do Pátio da revisão 9 ("Adesivo na porta do quadro", "Giz na parede") existem nos dois lados de cada par. Validador Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | A inscrição é limpa: a tábua (`insc_tabua`, volta 1) vem antes da cópia (`insc_copia` pede `falsa_1` + tábua). No sprite, o `guardar` virado (aberto para a esquerda) não é igual a nenhum dos 12. Um símbolo só diverge e a frase certa existe na verdadeira (`insc_verdadeira`). O minijogo não traz a resposta no enunciado e a ordem das opções muda com a semente. A fresta tem uma regra só (`fh_vidro` × `man_pot_3`/`fh_disj` resolvido). |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas. As vozes batem (`cracha_3` "Tá.", `ivone_1x` "Eu não perco pote", `aurelio_1` "Peça de acervo não cheira a novo", `traj_2` com o esfregão). O Ouro dá ao Aurélio o motivo de agradecer ("A notícia das 3 provas sobe até a Galeria"), igual em dados, ROTEIRO (parte 8) e FICHAS (exceção). |
| **Prosa** | **8,5** | **8,0** | Curta, em cena e com voz (`quadro_0`, `d_fus_2`, `e_hist_1` "Alguém ligou."). Seguem frases de narrador fechando conta, e entrou mais uma: o fim de `insc_copia` ("Quem gravou a peça não erraria a própria escrita. Quem copiou com pressa, sim."). Ficam também `insc_verdadeira` ("Vale pôr ao lado da máscara da Galeria."), "Você não chutou", `chao_peca`, `conserto_C` e os rótulos de formulário. |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem 2 a 10 fontes em salas, nenhuma presa a quem joga. A prova da cópia passou a 6 fontes. Validador rodado nesta rodada: Ouro com 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | Os sete desvios da rodada 8 foram fechados (ROTEIRO partes 5, 6, 8 e 15 a 17, FICHAS, `cracha_2`, `fh_vidro`, Pendências). Ficam dois menores novos, isolados e fora da dedução: `v4_teo` mudado nos dados × "não mexida" na DECISOES; segundo medidor do Pátio fora do alinhamento da revisão 9. |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra do autor.

**Premissa.** (b) Revelar sem consertar é esquecido às 5:00, e a escolha pesa mais para um lado. Sustenta-se porque o Desligar tem preço escrito.

**O oculto.**
- (a) **Novo, da revisão 10.** A cópia é de gesso e verniz e há um molde de gesso "com o formato da peça principal" (`falsa_3`). Um molde tirado da verdadeira copiaria a inscrição certa, e nenhum texto diz que a frase foi gravada à mão depois. Um aluno atento pode perguntar "se usaram molde, por que o erro?". A prova continua de pé: o erro está lá. Uma frase resolve (em `falsa_3` ou no ROTEIRO, parte 1): "o molde pegou o rosto; a frase, alguém gravou à mão depois".
- (a) **Novo pela definição da peça.** Com a peça fixada como máscara de 4,2 kg, três textos ficam um pouco grandes para ela: "pesa demais pra banner" (`c_esc_1`), o recibo de "carregador de caixas" (`lenz_meio_2`) e "nada daquele tamanho passou pela porta" (`teo_radio_2c`). Não quebra nada; vale uma olhada.
- (b) A Dra. Sato e as voltas; o alarme das 2:40 sem causa. Ver 3.2.

**Estrutura.**
- (b) `data_2`, `motivo_1`, `c_esc_2`, `cracha_1`, `lenz_meio_2` e `traj_3` deixam "o do patrocínio" e o porquê quase inteiros na volta 1. Decisão já tomada.
- (a) A aba Revelar diz onde procurar desde o minuto 0 (`LC_ONDE`). Já estava registrado como não aplicado.

**Rodízio.** C e D têm sinal só deles (`c_anc_1`, `d_fus_1`). (b) `d_teo_2` sem tranca.

**Jogo limpo.**
- (a) Noite D: `quadro_aberto` é igual nas 5 noites. Quem abre a porta com a chavinha na noite D não lê nada sobre o cadeado amarelo pendurado na chave 3, que `d_fus_2` mostra pela fresta. É omissão, não contradição. Proposta: um par só da noite D, com a mesma frase e mais "Na chave 3, um segundo cadeado, amarelo, aberto."
- (a) `d_fus_2b` lê a letra do Téo na etiqueta molhada do cadeado pela fresta, enquanto `fh_vidro` diz que pela fresta não se leem as etiquetas das chaves. O texto se segura ("a letra é a do diário": reconhecer, não ler; e a etiqueta é do cadeado, não da chave), mas fica no fio.
- (a) A fita do telão conta `insc_copia` no fato "cópia", e o texto do fato continua "verniz novo, peso errado". Quem provou pela escrita não vê a escrita citada. Coisa pequena.

**Personagens.**
- (a) `v4_teo` agora diz "a mesma cara", o que casa com a inscrição: o Téo fala do rosto, não da escrita. Ver Consistência, item 1.
- (b) `aurelio_1` na volta 1 só com o cheiro de verniz; `man_cal_3` ("vai que precisa") em toda noite. Um curador que não notou o símbolo virado é aceitável ("alguns são quase iguais"; ele "demorou para acreditar").

**Prosa.** Os da tabela. Mais "Repare: alguns são quase iguais." (`insc_tabua`: voz de sistema dentro de um documento do mundo) e "Tábua" com dois sentidos (chão de tábuas em `mancha_2` × tábua dos símbolos), já em "Ficou para decidir".

**Robustez.** Com 1 pessoa, o Ouro pede jogo quase perfeito (energia [5, 4, 5, 4, 2] na noite E). É dificuldade, não falta de fonte.

**Consistência** (cada item sozinho é menor; os dois juntos deixam o critério em 9,0 no limite):
1. **Novo, da revisão 10.** `v4_teo` nos dados: "A peça tem a mesma cara e pesa diferente". O backup `_SUBSTITUIDO_2026-11-25m` ainda tinha "o mesmo desenho". Sobre isso, a DECISOES, revisão 10:
   - em "Não aplicado", diz "Fala do Téo em `v4_teo` ('A peça tem o mesmo desenho...'): não mexida";
   - em "Ficou para decidir", ainda pergunta ao autor se troca por "a mesma cara".

   A LOOP-CENTRAL, revisão 10, também não põe `v4_teo` em "Mudaram". O texto na tela está melhor, mas a documentação diz o contrário do dado, e uma escolha marcada para o autor foi aplicada sem registro.
2. **Novo, da revisão 9.** A parte 16 do ROTEIRO e a DECISOES, revisão 9, dizem "O medidor é o mostrador redondo da parede (`a_cheia_2`, `fh_med_quadro`)". Só que o Pátio ainda tem um segundo medidor em `a_cheia_4`, `fh_med_pot_bce` e `fh_med_pot_d` ("O medidor de potência ao lado do quadro de energia..."), com o nome antigo "quadro de energia" e sem par na peça `Q01`, que mostra um mostrador só. Na noite D os dois se contradizem de leve: um marca carga cheia e o outro está "desligado". Não muda o diagnóstico, porque o par não conta.
3. (Não conta como defeito.) A DECISOES (revisão 8) e o registro da LOOP-CENTRAL (revisão 8) ainda dizem "porta entreaberta" e "armário no corredor ao lado". Valem as seções mais novas, como a DECISOES declara, e a LOOP-CENTRAL é registro histórico.

### Pedido de conferência: revisões 9 e 10

| Ponto | Resultado |
|---|---|
| Pátio: quadro fechado, cadeado vermelho na trava, fresta | **Coerente em dados, ROTEIRO (partes 5, 15 e 16), DECISOES, LOOP-CENTRAL e `LOOP_DESC`.** `quadro_0`, `quadro_aberto.porque`, `chave_3` (contar a posição), `man_pot_3` e `fh_disj` (aberta ou fechada) contra `fh_vidro` (etiquetas, não). O que se lê fica do lado de fora: `a_falsa_2x`, `fh_etq_chave` e `iso_aviso` na porta, `fh_disjx` a giz na parede, a etiqueta do cabo em `man_pot_3`. O cadeado amarelo de aviso fica lá dentro (`d_fus_2`, `d_fus_2b`, ROTEIRO, parte 6). Menores: segundo medidor (Consistência, item 2), `quadro_aberto` na noite D e a leitura da etiqueta do cadeado (Jogo limpo). |
| Coleções, peça nova | **Coerente.** Estante (`c_esc_1`, `empurra_2`, `falsa_3.porque`), caixa vazia (`tombo_3`), poça e pote (`teo_1`, `mancha`), caixote (`dis_lampadas`), minijogo `c_peca` ("Na estante, caixas etiquetadas"). |
| ROTEIRO e FICHAS alinhados | **Sim**, nos 7 pontos da rodada 8. FICHAS: Aurélio no Ouro, Seu Dirceu de esfregão ou pano, armário ao lado da Base da limpeza, Nico em fala relatada. |
| Inscrição, jogo limpo: a cópia "erra a própria escrita" × a verdadeira | **Limpa.** A tábua é plantada na volta 1 e a tranca garante que ela está no caderno. A cópia é `rosto, pedra, ver, noite, guardar-esp, tempo`; a verdadeira, `... guardar ...`. O virado não existe entre os 12, porque o único par espelhado da tábua é `ir`/`voltar`, e isso até ensina que a direção importa. Diverge um só, a frase da verdadeira fecha e o enunciado do minijogo não diz qual é. Menor: o molde de gesso × o erro feito à mão (O oculto). |
| Peça principal = máscara em todos os textos | **Sim.** `insc_tabua` ("Máscara de pedra, uns 300 anos"), dicionário ("Peça principal", "Inscrição"), ROTEIRO (partes 1 e 17), minijogos (miniatura V11, "Na testa da máscara"). Nenhuma pista descreve a peça de outro jeito: pedra, rachadura, riscos, 300 anos, 4,2 kg. O "Máscara de pedra" em `PECAS_ALT.cera` (game.js) é da camada antiga, fora do Loop. Menor: o tamanho, na parte "O oculto". |
| Seletor "Bem-vindo/Bem-vinda/Tanto faz" | Decisão do autor; não avaliado como defeito. |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.**

### 3.1 Menores (a) que vale fechar (não são condição para passar)

Por ordem de prioridade (todos são texto; nenhuma regra, tranca ou fonte muda):
1. **DECISOES e LOOP-CENTRAL, revisão 10: registrar `v4_teo`.** Tirar `v4_teo` de "Não aplicado" e de "Ficou para decidir" na DECISOES e pôr em "Mudaram" na LOOP-CENTRAL ("`v4_teo`: 'a mesma cara' no lugar de 'o mesmo desenho', para não brigar com a inscrição"). Cerca de 30 palavras. Se o autor preferir a frase antiga, desfazer no dado. **É o item que segura a Consistência no limite.**
2. **Segundo medidor do Pátio** (`a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d`). Ou se diz que é outro objeto da peça (por exemplo "o visor pequeno embaixo do mostrador"), ou se trocam os três para "Na porta do Quadro externo, o visor de potência..." e "quadro de energia" vira "Quadro externo". Cerca de 15 palavras. Conferir com a peça `Q01` na seção 5.
3. **Molde × erro na escrita.** Em `falsa_3` ou no ROTEIRO, parte 1: "o molde pegou o rosto; a frase foi gravada à mão depois". Cerca de 12 palavras.
4. **Noite D, porta aberta.** Um par de `quadro_aberto` só da noite D, com a frase do cadeado amarelo. Cerca de 12 palavras; mexe em dado, então pede o validador de novo.
5. **Prosa.** Cortar a última frase de `insc_copia` ("Quem copiou com pressa, sim.") ou as duas, deixando o jogador concluir. A palavra "Repare" em `insc_tabua` pode sair.

### 3.2 Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

1. **A Dra. Sato e as voltas; o alarme das 2:40.** Não baixam: a sirene só aparece para quem contou do Téo, e o alarme não entra em dedução.
2. **"Quem" e "por quê" quase inteiros na volta 1.** Custam força à virada da volta 3. Não baixam: o que é travado (provas, nome, Revelar) não abre antes.
3. **Piso de volta em `nico_1`, `cracha_3` e `lenz_2`.** Não baixa: a tela não promete nada falso.
4. **Revelar sem consertar é esquecido; Revelar só na volta 5.** Não baixam: a regra é anunciada desde a entrada.
5. **Por que quem joga lembra.** Convenção do gênero.
6. **`d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`.** Pequenos; nenhum quebra a dedução.
7. **"Tábua" com dois sentidos.** Não baixa: o contexto separa. Se o autor trocar, "quadro dos símbolos" evita até o choque com "Quadro externo"; "chave de leitura" choca com as chaves do quadro.
8. **`v4_teo`.** Na prática já foi decidido no dado ("a mesma cara"). O que falta é o autor confirmar e a documentação registrar (3.1, item 1). Não baixa a nota de Personagens; entra só na Consistência.
9. **Minijogo sem custo de erro, entrada por papel nos consertos em dupla, missão do Nico só na volta 4, aviso de aula encerrada.** São de motivação ou de padrão de sala, não desta escala.

Nenhuma nota desta rodada depende dessas decisões.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 8, rev. 8) | Agora (rev. 10) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. A inscrição reforça o tema da pressa. |
| O oculto | 9,0 | **9,0** | `d_fus_2` sem a chave "Circuito da Câmara" fecha um menor. Entra um novo: molde × erro feito à mão. |
| Estrutura | 9,0 | **9,0** | Escada de 278 para 281 pistas, sem mexer em volta antiga; a inscrição fica na volta 2, como as outras provas. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Pistas novas iguais nas 5 noites; rótulos novos do Pátio nos dois lados de cada par. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fecharam a fresta × posição das chaves e as fotos × "ficou para amanhã". A inscrição entrou limpa. Novos menores: `quadro_aberto` na noite D e a leitura da etiqueta do cadeado. |
| Personagens e fichas | 9,0 | **9,0** | O Aurélio do Ouro agora tem motivo para agradecer; Seu Dirceu bate com a peça. |
| Prosa | 8,5 | **8,5** | Sem mudança na nota. Entrou mais uma frase de narrador concluindo (`insc_copia`), compensada pela fala nova do minijogo da fita. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador rodado de novo: APROVADO. A prova da cópia ganhou a 6ª fonte. |
| Consistência do documento | 8,5 | **9,0** | **Subiu.** Os 7 desvios da rodada 8 foram fechados. Entraram 2 menores novos (`v4_teo` × DECISOES; segundo medidor do Pátio), isolados e fora da dedução. Fica no limite. |
| **Geral** | **8,9** (não passou) | **8,9** (passou) | Média igual: Consistência subiu de 8,5 para 9,0 e nenhum critério caiu. |

**As revisões 9 e 10 criaram contradição nova?** Sim, duas pequenas, nenhuma de dedução:
- **DECISOES e LOOP-CENTRAL × dados:** `v4_teo` foi trocado no dado e os documentos dizem que não foi (revisão 10);
- **ROTEIRO (parte 16) e DECISOES (revisão 9) × dados:** "O medidor é o mostrador redondo", mas três pistas ainda falam de um segundo "medidor de potência ao lado do quadro de energia".

A inscrição não criou contradição. A cópia "erra a própria escrita" de um jeito que só a tábua confere, a verdadeira confirma, e "peça principal = máscara" vale em todos os textos.

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima** (oito em 9,0, Prosa em 8,5). Pelo ciclo das escalas, segue-se para a seção 2.

Recomendação honesta: fechar os itens 1 e 2 de 3.1, cerca de 45 palavras só de texto, antes da próxima correção técnica. A Consistência está no limite e qualquer novo desvio de documento a derruba.
