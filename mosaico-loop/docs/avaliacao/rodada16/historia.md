# Mosaico Loop v4 revisão 14: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei código, dados e capturas que já existiam.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 20;
- FICHAS.md;
- DECISOES-V4.md, revisões 12 a 14;
- LOOP-CENTRAL.md: cabeçalho, revisões 12 a 14 e checklist;
- as 281 pistas de `pistas_legivel.txt`. Foi gerado às 16:25 de `/tmp/roda/v4_pistas.json`, que tem os mesmos bytes de `dados/pistas-v4.json` ("v4 revisão 14"; conferido com `cmp`);
- de `pistas-v4.json`: `atividades_coop` (as `telaPapel`), `finais`, `linha_do_tempo_s`, `salas_em_reforma` e `salas_nomes`.

**Código que conferi:**
- game.js: `LOOP_DESC`, `TOUR` e a tabela `PLANTA`. Comparei com `game.js_SUBSTITUIDO_2026-11-26d`, a versão da revisão 13;
- loop-central.js: `LC_MG`, `LC_MGA`, as frases de `lcPreConf` e `lcAnexar`, "Revelar agora", `LC_FATO_PISTA`, `LC_FATO_CURTO` e `LC_MISSOES`;
- ritmo.js: `LOOP_LINHA`.

**Capturas que vi:**
- `r14/cap`: luz antes, luz achou, galeria de perto, Lado a Lado, caixa, desfecho, desfecho vazio, manual passo 1 e planta do Térreo, em 390 px.

**Validador:** `r14/validar.txt` diz "revisão 14", APROVADO nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. O bot fica em no máximo 0,05%.

Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. NÃO PASSOU: a Consistência do documento ficou em 8,5 (mínimo 9,0).** Os outros sete critérios de mínimo 9,0 estão em 9,0, e a Prosa está em 8,5 (mínimo 8,0).

A revisão 14 fechou o que a rodada 12 reprovou e os menores da rodada 13:
- a luz de lado agora bate com a imagem: pedra granulada e "verniz cobre tudo por igual, até o grão da pedra";
- a rachadura fina aparece na máscara 3D, do lado direito, como diz a tela A;
- só existe uma chuva, a tempestade;
- `conserto_C`, `conserto_D` e `lenz_3` ficaram sem conclusão de narrador;
- "já viu o Téo caído".

Mas a mesma revisão criou uma contradição nova, na planta do Térreo. Para pôr a Sala das esculturas embaixo da Área de descanso, ela tirou a única porta entre a Área de descanso e o corredor. Por isso o caminho das 4:02 às 4:10 (Área de descanso → Seu Dirceu na Base da limpeza → escada do Subsolo) não se faz mais na planta. Esse caminho é fonte da prova "Por onde passou".

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou, e só o caderno guarda: `aurelio_2` ("Era medo meu."), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê."). O Desligar tem preço em cada noite, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: a queda acontece uns 30 s antes de 0:00, a chave é virada às 4:10 (`traj_3`), a máquina leva 50 s para armar (`raio_contagem`) e dispara às 5:00, então ele "errou por menos de um minuto". A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). Menor: uma cópia tirada de molde deveria repetir a rachadura e o desgaste da verdadeira. |
| Estrutura | **9,0** | 9,0 | A escada de voltas é 232/27/9/9/4, e nenhuma volta, tranca ou rótulo mudou. Nenhum título adianta virada ("Abrir uma caixa da estante", "Antes de acender a luz", "Inscrição na máscara"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | A revisão 14 não mexeu em `soNaCausa`, `parDe` nem rótulos. `c_peca` e a luz valem igual nas 5 noites. Validador: Ouro nas 5, e o bot fica em no máximo 0,05%. |
| Jogo limpo e dedução | **9,0** | 9,0 | A inscrição continua limpa (tábua na volta 1, cópia e verdadeira na volta 2). A luz fala de verniz e bordas sem dar prova. Menores novos: o minijogo da caixa não tem resposta no caderno de quem entrou só por `c_esc_3`; e a luz, para quem tem `par_foto`, já compara com a foto na volta 1. |
| Personagens e fichas | **9,0** | 9,0 | As 8 fichas estão completas. A revisão 14 só encurtou falas: `e_hist_1` (Dra. Sato, "Então ninguém liga isto sem mim. Ninguém.") e `teo_cadeira`. A voz bate com a ficha: Braga com "Tá." e café, Lenz com "rapidinho", Nico com o tropeço. |
| **Prosa** | **8,5** | **8,0** | Saíram as conclusões de `conserto_C`, `conserto_D`, `lenz_3`, `e_hist_1` e `teo_cadeira`, e também "MEIO CERTO" e "Você não chutou". Ficam três fechamentos de narrador: "alguém tentou segurar quem caía." (`empurra_2`), "Se saiu, foi por outra porta." (`coop_catraca_ok`, `catraca_solo`) e "Ela só comenta o que você contar." (`man_3`). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes, e a prova da cópia tem 6. O validador, sobre os mesmos bytes dos dados, dá Ouro com 1, 2 e 3 pessoas nas 5 causas. Errar um minijogo continua sem custo. |
| Consistência do documento | **8,5** | 9,0 | Planta do Térreo da revisão 14: a Área de descanso perdeu a porta para o corredor, então o caminho 4:02 → 4:05 (Base da limpeza) → escada e a fala da Ivone sobre o Seu Dirceu não cabem mais no mapa. A DECISOES 12 dizia que a planta não contradiz as pistas. |

### O que derruba a Consistência (obrigatório)

**Planta do Térreo × trajeto das 4:00 às 4:10. Novo, da revisão 14.**

- **Onde.** Tabela `PLANTA` do Térreo, em `game.js`.
  - Na revisão 13 (`game.js_SUBSTITUIDO_2026-11-26d`), as áreas eram `'esc esc hall'` e havia a porta `['desc','b','center']`: a Área de descanso dava direto no hall, ao lado da Base da limpeza.
  - Na revisão 14, as áreas são `'esc esc est'` e `'hall hall hall'`, e a porta `desc b` saiu. As únicas portas da Área de descanso agora são estas: o vidro do Ateliê, a Sala das coleções, o vidro das Esculturas (sala fechada, de cadeado) e a porta de serviço.
  - A captura `r14/cap/planta_terreo_390.png` mostra exatamente isso.
- **Contra o quê.**
  - ROTEIRO 3: às 4:02 o homem "cruza a Área de descanso", e às 4:05, "Na Base da limpeza, Seu Dirceu aponta com o esfregão: passou alguém [...] rumo à escada do Subsolo".
  - `traj_2`, fonte da prova do trajeto: "Passou um agora, de sapato social, com pressa, rumo à escada do Subsolo."
  - Na planta nova, quem sai da Área de descanso só chega à escada atravessando a Sala das coleções, onde está o Téo caído. A porta de baixo da Sala das coleções dá direto no bloco da escada, sem passar pela Base da limpeza, que fica do outro lado do corredor.
  - Isso também tira o sentido de `ivone_red`: "[a porta de vidro] Dá para a Área de descanso inteira. Pergunta ao Seu Dirceu quantas vezes eu passei por ela". Da Base da limpeza já não se vê a Área de descanso.
  - A DECISOES 12 registrou "Base da limpeza no caminho do hall e da escada do Subsolo" como garantia de que a planta não contradiz as pistas. A DECISOES 14 diz que a sala nova "cabe" e não confere esse caminho.
- **Por que derruba.** O caminho do homem de paletó é uma das 3 provas ("Por onde passou"). A planta é a tela que todo mundo usa a volta inteira, e quem traçar a rota com o dedo acha a contradição.

## 3. Abaixo do mínimo

**Consistência do documento: 8,5 (mínimo 9,0).**

### (a) Obrigatórias

1. **Devolver à Área de descanso uma porta para o corredor, perto da Base da limpeza** (só a tabela `PLANTA` do Térreo; 0 palavras de texto).
   - Sugestão: `areas:['ele ate desc','tec col desc','esc est desc','hall hall hall','rec cen limp']`, com `['desc','b','center']` e as Esculturas com a porta de vidro para a direita (`['est','r','center','vidro']`).
   - Assim a Área de descanso encosta no corredor, a Sala das esculturas fica entre a escada e a Área de descanso, e a pista `pose` continua valendo (pelo vidro, o braço aponta para a escada, ao lado).
   - Depois, conferir de novo em 390 e 360: a planta cabe, nenhum nome é cortado, alvos ≥ 44 px. Atualizar o parágrafo da Planta na DECISOES 14 e na ROTEIRO 20.

### (b) Retoques opcionais (não seguram nota sozinhos)

**Jogo limpo**
1. **Caixa da estante × `c_esc_3`.** `c_peca` abre com `c_esc_1`, `c_esc_2` ou `c_esc_3`. Só que `c_esc_3` ("duas caixas iguais entram") não diz "banners" nem "patrocínio", e a pergunta é "Pelo que o seu caderno diz da caixa do patrocínio, qual você abre?". Quem entrou só por `c_esc_3` tem que chutar (sem custo). Saída: "duas caixas iguais, de banners do patrocínio" em `c_esc_3` (cerca de 4 palavras).
2. **Luz de lado já na volta 1.** Para quem tem `par_foto`, a pergunta "A luz de lado vai dizer se esta aqui é igual" e o resultado "Nenhuma borda gasta" já fazem a comparação com a foto na volta 1. A ROTEIRO 4 diz que "a comparação da foto" é da volta 2 em diante. Não entra prova no caderno, e a volta 1 já deixa ler a troca (decisão do autor). Saída: tirar a segunda frase da pergunta (8 palavras) ou só mostrar o "antes" da volta 2 em diante.

**O oculto**
3. **Molde × rachadura e bordas.** O molde "pegou o rosto". Uma cópia tirada dele teria a rachadura da verdadeira, do lado esquerdo, e as bordas gastas. Na cópia, a rachadura está do outro lado e as bordas estão inteiras. Não muda a prova, que é "não bate com a foto", mas quem for exigente pergunta. Saída: uma frase dizendo que o gesso trincou depois e as bordas foram lixadas sob o verniz, ou deixar como está.

**Prosa**
4. Cortar "alguém tentou segurar quem caía." (`empurra_2`) e "Ela só comenta o que você contar." (`man_3`), deixando a marca e a fala (cerca de 12 palavras).

**Consistência (palavra)**
5. **Chuva × estrada.** A ROTEIRO 2 diz que "ontem" a tempestade fechou a estrada. A dica da fita diz "Lá fora chove desde o começo da noite", e a ficha de ontem diz "Saio antes da chuva". Saída: "chove desde ontem" na dica (2 palavras).
6. A ROTEIRO 3 (tabela dos andares) e o cabeçalho da LOOP-CENTRAL ("Lugares") não citam a Sala das esculturas em reforma. Só a ROTEIRO 20 cita (cerca de 6 palavras em cada).

### Pedido de conferência: revisão 14

| Ponto | Resultado |
|---|---|
| Luz de lado × imagem | **Fechado.** `luz_achou_390`: pedra granulada, com pintas. O texto fala de "grão da pedra", "nenhuma borda gasta" e "nenhum risco de uso". Combina com `falsa_1` (cheiro), `falsa_2` ("Verniz novo") e `c_peca` ("Cheira a pó"). |
| Rachadura | **Fechado.** `galeria_perto_390` mostra a rachadura fina do lado direito de quem olha, longe da inscrição. A tela A diz "rachadura fina do lado direito", a B diz "rachadura do lado esquerdo", e `foto_solo`, `coop_copia_ok` e o minijogo da comparação falam do lado da rachadura. |
| Uma chuva só | **Fechado** no Pátio ("A tempestade não para"). Resta o menor 5 ("desde o começo da noite" × estrada fechada ontem). |
| `par_foto` × tela B × foto antiga | **Coerente:** "pedra escura, riscos finos, bordas gastas" (`par_foto`, minijogo antes da luz), "pedra escura, fosca" (tela B, `tombo_2`). |
| Caixa da estante | **Coerente** com `c_esc_1`, `c_esc_2` e `lenz_meio_1`. Menor 1 com `c_esc_3`. |
| Narrador cortado | **Fechado** em `conserto_C`, `conserto_D`, `lenz_3`, `e_hist_1` e `teo_cadeira`. |
| Telas da Máquina | **Coerentes:** "Você marcou 3 de 3...", "Assim está certo. Falta ver se o defeito é esse.", "Quase.", "Revelar agora". |
| Desfecho no celular | **Coerente:** as fichas (`LC_FATO_CURTO`) usam as mesmas miniaturas e fatos da fita do telão. Só aparecem no fim e não adiantam nada. |
| Manual passo 1 | **Coerente:** a planta do 2º andar, com Saguão e Galeria. Não fala de troca, raio nem cópia. |
| Sala das esculturas | **Contradiz o trajeto** (obrigatória 1). A pista `pose` em si é coerente. |
| Contradição nova entre dados, ROTEIRO, FICHAS, DECISOES e LOOP-CENTRAL? | Entre os textos, **nenhuma**. A nova é entre a planta (tela) e o trajeto do ROTEIRO, `traj_2` e `ivone_red`. |

### Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas de antes, que não baixam nota:
- a Dra. Sato e as voltas;
- o alarme das 2:40;
- "quem" e "por quê" quase inteiros na volta 1;
- piso de volta;
- Revelar só na volta 5;
- por que quem joga lembra;
- `d_teo_2` sem tranca e `man_cal_3`;
- "tábua" com dois sentidos;
- minijogo sem custo de erro;
- a testa à vista desde a volta 1.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 13, rev. 13) | Agora (rev. 14) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Fecharam a luz × imagem e a rachadura invisível. Entra o menor do molde. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Nada mudou por causa. Validador: Ouro nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Luz e caixa agora são decididas pelo caderno. Entram dois menores (`c_esc_3`; comparação pela luz na volta 1). |
| Personagens e fichas | 9,0 | **9,0** | Só cortes de frase. |
| Prosa | 8,5 | **8,5** | Saíram cinco conclusões de narrador e os rótulos de formulário. Ficam `empurra_2`, `man_3` e "Se saiu, foi por outra porta.", então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador da revisão 14: APROVADO. |
| Consistência do documento | 9,0 | **8,5** | **Caiu por causa de uma correção técnica:** a Sala das esculturas fechou a porta da Área de descanso para o corredor, e o trajeto 4:02 → 4:05 (Base da limpeza) → escada não cabe mais na planta. |
| **Geral** | **8,9** (passou) | **8,9** (**não passou**) | A média não mudou, mas a Consistência caiu abaixo do mínimo. |

## 5. Fim do ciclo

**A escala da história (seção 1) NÃO passou.** A Consistência do documento ficou em 8,5, abaixo do mínimo de 9,0. Obrigatória (a): uma, a porta da Área de descanso para o corredor na planta do Térreo. Depois de corrigir, reavaliar do zero.
