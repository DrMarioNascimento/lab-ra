# Mosaico Loop v4 revisão 7 — Escala da história (seção 1) — rodada 7, avaliada do zero

Avaliador independente (não escrevi o texto; sem desconto de autoavaliação). Li por inteiro: ESCALAS_AVALIACAO_JOGOS.md, ROTEIRO-LOOP.md (partes 1 a 14), FICHAS.md, DECISOES-V4.md, as 278 pistas de pistas_legivel.txt e o arquivo atividades.txt (regras, trancas, grupos, atividades, finais, papéis). De LOOP-CENTRAL.md li o cabeçalho, as seções até o vocabulário, as revisões 6 e 7 e o checklist por volta; as revisões 2 a 5 não reli linha a linha. Das telas, li o texto visível de index.html, individual.html e sala/index.html e, no código, o que quem joga lê: game.js (TOUR, descrição das salas, textos entre voltas, dicas), loop-central.js (as 4 abas da Máquina, respostas do Anexar, cartões das atividades, LC_MG, LC_MGA, LC_MISSOES, dicionário, aba Revelar, papéis), ritmo.js inteiro (finais do telão, frases condicionais, fita da noite) e os textos de sala/telao/telao.mjs. Conferi no dado vivo (dados/pistas-v4.json, "v4 revisão 7", 278 pistas) a escada de voltas e as palavras que não podem aparecer cedo. Não rodei o jogo no navegador: o que digo das telas vem da leitura do código.

Validador: não rodei de novo. Usei o resultado guardado em r7/validar.txt, gravado depois da última mudança nos dados: APROVADO nas 5 causas, com 1, 2 e 3 pessoas, 5 sementes. Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10 — PASSOU. Os 9 critérios estão no mínimo ou acima.**

O que segurava a rodada 6 fechou: a comparação da foto não olha mais embaixo da base (some a contradição com o F2 na noite do fusível) e os dois minijogos apontados perguntam o que a tranca garante ou o que a própria foto mostra. As correções da revisão 7 não criaram contradição nova que pese. A cronologia do crachá do Braga está numa versão só, em todos os textos (parte 4).

Sobram defeitos pequenos e soltos, listados abaixo como "menores". Nenhum ponto de regra do autor (lista "Revisão 7 · Ficou para decidir") baixa nota abaixo de 9.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê") e só o caderno guarda; `data_3` e o Desligar ("Ninguém viu o que você viu") dão preço à escolha, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: tinta ainda escorrendo em 0:00 (`teo_1`), chave às 4:10 (`traj_3`), 50 s para armar (`raio_contagem`), disparo às 5:00, por isso a volta cai depois da queda; a Dra. Sato só comenta o que ouve (`man_3`) e o Téo nada sabe depois de cair. |
| Estrutura | **9,0** | 9,0 | Escada 231/25/9/9/4 conferida no dado; viradas na volta 2 (`c_peca`, `falsa_2`), 3 (o nome: `cracha_3`, `lenz_2`, `coop_veredito`), 4 (`rev_3`, `teo_radio`) e 5 (a escolha); a 4 converge sem fechar; "Lenz" não aparece antes da volta 3 e nenhum rótulo adianta virada. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Mesmos rótulos, mesma ordem e mesmas trancas nas 5 noites (pares `parDe`), 3 pistas para anexar em todas, cena própria em A, B, D e E, um Desligar por causa e Ouro no validador nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | `foto_solo`, `coop_copia_ok` e as telas do Lado a Lado comparam rachadura, cor e riscos, sem a base; `d_f2_1` e `fh_base_perto` continuam atrás do motivo; `tombo_2` e `c_peca` perguntam o que está garantido; todo valor do conserto tem 2 a 5 fontes desde a volta 1. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas, com exceções registradas e linha das revisões 6 e 7; as falas batem com a ficha (`coop_veredito` e `cracha_3` começam com "Tá.", `ivone_1x` "Eu não perco pote", `d_teo_2` "Eu reparo", `lenz_2` "Eu devolvo tudo que eu pego"). |
| **Prosa** | **8,5** | **8,0** | Texto curto, em cena e com voz (`e_hist_1` "Alguém ligou.", `nico_0`); sobram frases do narrador fechando a conta ("Você não chutou: dois sinais diferentes..." no Anexar, `mancha_2`, `conserto_D`, `empurra_2`) e rótulos de formulário ("MEIO CERTO", "ATIVIDADE FEITA", "Registrar revelação"). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes em salas, nenhuma presa a personagem de quem joga; o nome tem dois caminhos sem dupla (`cracha_3`, `lenz_2`); validador com Ouro para 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | ROTEIRO (partes 2 a 14), dados, finais, fita do telão, FICHAS, DECISOES e LOOP-CENTRAL contam a mesma noite; os 3 desvios da rodada 6 fecharam (cena do diagnóstico, linha das fichas, frase do "tem força chegando"); restam desvios pequenos (lista abaixo). |

### Defeitos menores (não seguram nota; ficam anotados)

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra do autor.

- **Premissa.** (b) Revelar sem consertar é esquecido às 5:00: a escolha pesa mais para um lado. A pergunta do telão se sustenta porque o Desligar tem preço escrito.
- **O oculto.**
  - (b) Nenhum texto diz se a Dra. Sato, fora do prédio, é levada pelas voltas. Pesa menos que na rodada 6: a sirene só aparece para quem tem `sato_teo`.
  - (b) O alarme das 2:40 toca sem causa escrita.
  - (a) Nas noites A e E a doutora zerou os mostradores de propósito (`a_hist_1`), mas no interfone responde aos mostradores piscando como se não soubesse ("Ou ela perdeu os números, ou perdeu um pedaço"). Ela sabe menos do que o mundo permite. Uma frase resolve, sem dar o diagnóstico.
  - (a) O manual diz que a Câmara puxa "só do gerador, nunca da rede do museu" (`man_pot_1`), e os sinais de luz fraca (`b_luz_1` a `b_luz_4`) mostram as lâmpadas do museu caindo a cada tentativa, antes do apagão. Não quebra o diagnóstico (a etiqueta resolve), mas quem pensa na parte elétrica estranha.
- **Estrutura.**
  - (b) `data_2`, `motivo_1`, `c_esc_2`, `cracha_1`, `lenz_meio_2` e `traj_3` deixam "o do patrocínio" e o porquê quase inteiros na volta 1; a volta 3 entrega um sobrenome. Decisão já tomada.
  - (a) A aba Revelar, desde o minuto 0, diz onde procurar ("olhe a peça da Galeria de perto, com alguma coisa para comparar"; "descubra quem usou o crachá que abre a porta de serviço").
  - (a) O minijogo de `falsa_1` mostra na volta 1 "O verniz brilha por igual, sem um risco", que é a terceira diferença do Lado a Lado (volta 2). Não vale como prova, só adianta a certeza.
- **Rodízio.** C e D têm sinal só delas (`c_anc_1`, `d_fus_1`): com `man_1`, uma pista já dá nome ao defeito; A, B e E pedem cruzar duas. O custo de anexar é igual. (b) `d_teo_2` sem tranca.
- **Jogo limpo.**
  - (a) Minijogo de `traj_1`: pergunta "pela escala de hoje, de quem é o crachá", e a pista não pede a escala (`cracha_1`). Pesa pouco: a escala está na mesma sala e a primeira dica diz isso.
  - (a) Apagão Combinado: quem está no Pátio "segura a chave geral do térreo no Quadro externo" sem a chavinha, e `quadro_0` diz que a tampa tem cadeado e que "sem a chavinha, você só olha pelo vidro". Falta dizer que a chave geral fica do lado de fora da tampa.
  - (a) `nico_1`: a tranca pede o laudo (`falsa_2`), e a frase do Nico só fala de "se ele não aparecer" e do "número certo". Quem tem a peça verdadeira na mão e não leu o laudo fica travado sem motivo dito (a tela mostra a sala, não o porquê).
  - (a) `teo_radio`: "Se você achou o número, sabe que a da Galeria é cópia." O número também está no livro de registro e na etiqueta da caixa vazia; achar o número não prova a cópia.
- **Personagens.** (b) `aurelio_1`: o curador, que foge do assunto, admite o aviso do Téo na volta 1 só com o cheiro de verniz. (b) `man_cal_3`: o Téo copia a receita do ajuste "vai que precisa" em toda noite.
- **Prosa.** Os da tabela. Mais: `chao_peca` ("O museu esqueceu. O chão guardou."), `conserto_C` ("A máquina entende há quantos dias..."), "Marcadas: 3 de 3 · sinais: 2..." (já na lista do autor).
- **Robustez.** Com 1 pessoa o Ouro pede jogo quase perfeito: é dificuldade, não falta de fonte.
- **Consistência.**
  - (a) Frase da entrada: index.html diz "Cinco minutos. A mesma noite. O museu recomeça. Você não." (igual ao ROTEIRO, parte 14); individual.html e sala/index.html dizem "Cinco minutos. O museu recomeça. Você não."
  - (a) Telão, final "A noite andou": um texto só, com "uma caixa de 'banners' sai pela porta da frente". Na noite C o celular diz outra coisa (a peça verdadeira está no apoio; "a cópia continua na base").
  - (a) "Base" tem dois sentidos sem aviso: o suporte com sensor (`fh_pedestal`, dicionário: "o suporte onde a peça fica apoiada") e o fundo da própria peça (`tombo_1` "gravado embaixo da base", `fh_base_perto`, `v5_lenz`). Cada frase se entende pelo contexto; o dicionário só explica um.
  - (a) Leitura completa da noite D diz "tem força chegando", e a tela do painel mostra o ponteiro "atrás de uma etiqueta de papel, tremendo" (escolha registrada na DECISOES, revisão 6).
  - (a) Ouro: "Aurélio olha para o telão": ele passa a volta inteira na Galeria e o telão fica na Recepção.

### O que conferi da rodada 6 (aplicado de fato nos textos atuais)

Lado a Lado, telas A e B ("superfície lisa, sem um risco" / "riscos finos e desgaste nas bordas"); `coop_copia_ok` e `foto_solo` sem "embaixo da base"; minijogo de `c_peca` com o cheiro de verniz; minijogo de `tombo_2` com o que a foto mostra, sem "cor de pó"; dicionário, "Luz da peça"; ROTEIRO, parte 5 (no acerto, placar e frase); FICHAS com a linha das revisões 6 e 7; DECISOES com a frase do "tem força chegando" por extenso; `teo_d3` sem "cópia"; `coop_veredito` com "Tá."; sirene e Téo condicionais nos dados (`regras.final_frases`), no celular (`lcFinalFrases`) e no telão (`LOOP_FINAL_COND`). Nenhuma voltou atrás.

## 3. Abaixo do mínimo — o que corrigir

**Nenhum critério ficou abaixo do mínimo.**

### 3.1 Menores (a) que vale fechar quando houver outra mexida de texto (cerca de 70 palavras; não são condição para passar)

1. `traj_1`, minijogo: trocar a pergunta por algo que a fita mostra e o caderno separa, ou pôr `cracha_1` na tranca (aí é tranca, decisão do autor). ~15 palavras.
2. Apagão Combinado, `papelA`: "…você segura a chave geral do térreo, do lado de fora da tampa do Quadro externo." 6 palavras.
3. `nico_1`, campo `porque`: acrescentar o que falta ("…e só depois que o curador puser no papel"). ~8 palavras.
4. Entrada: a mesma frase nas três páginas. 3 palavras em 2 arquivos.
5. Telão, Desligar: tirar a caixa do texto curto ou ter a variante da noite C. ~10 palavras.
6. `man_3`, resposta aos mostradores piscando: a doutora lembrar que zerou ("Zerados eu deixei. Piscando, não."), sem dar nome ao defeito. Como a resposta é a mesma nas noites A, D e E, precisa de texto que sirva às três ou de variante por noite. ~12 palavras.
7. Dicionário: "Base" com os dois sentidos. ~10 palavras.

### 3.2 Pontos que só mudam com decisão de regra do autor (nenhum baixa nota)

Todos já estão em "Revisão 7 · Ficou para decidir". O jogo é coerente como está em cada um.

1. **A Dra. Sato e as voltas.** Não baixa: a sirene agora só aparece para quem contou do Téo, e o texto dela ("só chega se a noite andar") basta para o final fazer sentido. Continua sendo o primeiro a decidir, porque o caminho "com a Dra. Sato na linha" a põe contando o raio ao vivo em toda volta.
2. **"Quem" e "por quê" quase inteiros na volta 1.** Custa força à virada da volta 3. Não baixa: nada do que é travado (provas, nome, Revelar) abre mais cedo, e o mistério central da volta 1 é a máquina.
3. **Piso de volta em `nico_1`, `cracha_3` e `lenz_2`.** Quem já tem tudo vê "ainda não". Não baixa: a tela não promete nada falso.
4. **Revelar sem consertar é esquecido às 5:00** e **Revelar só na volta 5 sem motivo no mundo.** Não baixam: regra anunciada desde a entrada.
5. **Por que quem joga lembra.** Convenção do gênero; o lema segura.
6. **`d_teo_2` sem tranca, `aurelio_1` na volta 1, `man_cal_3`, alarme das 2:40.** Pequenos; nenhum quebra dedução.
7. **Minijogo sem custo de erro, entrada por papel nos consertos em dupla, missão do Nico só na volta 4.** São de motivação (seção 3 das escalas), não desta escala.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 6) | Agora (rodada 7) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de nota. A sirene condicional devolve peso ao Desligar de quem nunca falou do Téo. |
| O oculto | 9,0 | **9,0** | A sirene deixou de depender de fato não escrito. Anotei dois menores novos (a doutora e a própria tranca; luz fraca e "só do gerador"). |
| Estrutura | 9,0 | **9,0** | Sem mudança. `teo_d3` sem "cópia" na volta 1. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Ordem das listas agora igual nas 5 noites. |
| Jogo limpo e dedução | 8,5 | **9,0** | Fechou a contradição da noite D (feltro contra F2) e os dois minijogos fora da tranca. Restam quatro menores, soltos. |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança; FICHAS ganhou a linha que faltava. |
| Prosa | 8,5 | **8,5** | Sem mudança: os restos de formulário e do narrador continuam (lista do autor). |
| Robustez por número de jogadores | 9,0 | **9,0** | Sem mudança; validador aprovado na revisão 7. |
| Consistência do documento | 9,0 | **9,0** | Os três desvios da rodada 6 fecharam; entraram dois pequenos (frase da entrada em três páginas; Desligar do telão na noite C). |
| **Geral** | **8,9** | **8,9** | Nenhuma nota caiu. Jogo limpo subiu meio ponto; a média arredondada não muda. |

**As correções da revisão 7 criaram contradição nova?** Nenhuma que pese. O que achei:
- pequena: a frase nova da entrada entrou em index.html e não nas outras duas páginas;
- nenhuma nas pistas relidas da base (`falsa_1`, `fh_base_perto`, `d_f2_1`, `d_teo_1`, `d_teo_2`, `dirceu_0`, `teo_d1`, `teo_d3`, `tombo_1` a `tombo_3`, `c_peca`, `nico_1`, `v5_lenz`, `coop_copia_ok`, `foto_solo`, Lado a Lado, minijogos);
- nenhuma nos finais condicionais: `sato_teo` pede `teo_1`, então ninguém vê a sirene "do Téo" sem ter visto o Téo; tirar cada frase deixa o texto inteiro.

**Cronologia do crachá do Braga (pedido de conferência): uma versão só.**
- Ontem: o Lenz ronda o armário, leva o crachá e deixa o bilhete (`cracha_2` "Devolvo amanhã", `cracha_3` "não tá comigo desde ontem", `v4_braga` "Ontem o Lenz levou meu crachá e deixou bilhete").
- Hoje à tarde: entra pela frente (`cracha_4`, `lenz_op_1`); a foto de divulgação pega o paletó "com um crachá da casa pendurado na cintura" (`lenz_op_2`), o que só é possível porque o crachá saiu do armário ontem; não passa pela roleta da saída (`coop_catraca_ok`).
- Hoje, a escala "de hoje" ainda dá o crachá BRAGA para a porta de serviço, com o Braga de cinto vazio (`cracha_1`, `braga_red`, `nico_0b`).
- Começo da noite: volta pela porta de serviço "com crachá da casa" (`cofre_ronda`, `assim_par`).
- Uns trinta segundos antes de 0:00: sai por ela (`traj_4`, pegadas). 4:00: volta por ela, de crachá na mão (`traj_1`); 4:02, crachá na cintura com a foto do Braga (`lenz_2`).
- ROTEIRO (partes 2 e 12), DECISOES (revisão 5), `linha_do_tempo_s`, FICHAS (segredo do Braga) e a fita do telão dizem o mesmo. Não achei texto que ponha o crachá com o Braga depois de ontem, nem segunda versão da entrada.

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima.** Pode seguir para a seção 2. Isto vale só para a seção 1; as outras escalas não foram avaliadas aqui.
