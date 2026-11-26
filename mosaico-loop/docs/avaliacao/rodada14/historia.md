# Mosaico Loop v4 revisão 14: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação. Não abri navegador: usei código, dados e as capturas que já existiam.

**O que li:**
- ESCALAS_AVALIACAO_JOGOS.md, inteiro.
- ROTEIRO-LOOP.md, inteiro (partes 1 a 20).
- FICHAS.md, inteiro.
- DECISOES-V4.md, revisões 13 e 14.
- LOOP-CENTRAL.md: cabeçalho, revisões 13 e 14, checklist e fontes por fato.
- Pistas (`pistas_legivel.txt`, gerado da revisão 14): todas as que a revisão 14 mexeu, mais as da comparação, da caixa, da inscrição, da chuva e da escultura.
- `atividades.txt`: Lado a Lado (`telaPapel`).

**Código que conferi:**
- `loop-central.js`: `LC_MG` (`falsa_1.antes` com `se:['par_foto']`, `falsa_1.luz`, `c_peca`, `tombo_2`, `insc_copia`), `lcBancada`, `LC_MGA.coop_original_copia`, `LC_FATO_CURTO` e rótulos da Máquina;
- `ritmo.js` (`LOOP_LINHA`, Parcial);
- `game.js` (`PLANTA`, sala `est`, `LOOP_DESC.patio`).

**Capturas que vi:**
- `r14/cap`: planta do Térreo, luz antes e achou, Galeria de perto, Lado a Lado, caixa, desfecho, manual passo 1;
- a imagem `museu/icones/GAL_B_mascara.webp`, ampliada.

**Dados e validador:**
- `dados/pistas-v4.json` tem os mesmos bytes que `/tmp/roda/v4_pistas.json` (`cmp`).
- `loop-central-dados.js` tem o mesmo JSON (só o comentário do topo ainda diz "revisão 13").
- `r14/validar.txt`: "revisão 14", **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes; o bot fica em no máximo 0,05%.

**Varreduras:**
- "Lenz" não aparece em texto de pista de volta 1 ou 2 (só no campo interno `revela.aponta`).
- "chuva fina" não existe mais em código nem em dados.

Nada do repositório foi tocado.

## 1. Nota geral

**9,0 / 10. TODAS PASSARAM: os 9 critérios em 9,0 (mínimos: 9,0, e 8,0 na Prosa).**

A revisão 14 fechou o que a rodada 13 deixou como menor (a):
- a legenda da luz agora bate com a imagem fosca;
- "chuva fina" saiu;
- a rachadura está desenhada no lado certo da peça 3D;
- `conserto_C` e `conserto_D` estão sem conclusão de narrador;
- "já viu o Téo caído".

A Prosa sobe para 9,0 porque saíram os fechamentos e os rótulos de formulário que a seguravam em 8,5.

A revisão 14 criou três desvios novos, todos menores:
1. A pergunta nova do "Antes de acender a luz" põe a comparação com a foto já na volta 1, e o ROTEIRO diz que ela é da volta 2.
2. "O grão da pedra" fala de uma cópia que, no ROTEIRO, é de gesso.
3. O minijogo da caixa pergunta pelo caderno, mas uma das três pistas que abrem a caixa (`c_esc_3`) não diz qual etiqueta procurar.

Nenhum dos três destrava prova, nome ou Revelar antes da hora.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e o caderno guarda (`aurelio_2`, `v4_braga`, `ivone_2`); o Desligar tem preço em cada noite; a pergunta do telão fica com a turma. A revisão 14 não mexeu no enredo. |
| O oculto (motor do mistério) | **9,0** | 9,0 | Conta igual: queda antes de 0:00, `traj_3` às 4:10, 50 s, disparo às 5:00; a Dra. Sato só comenta o que ouve. A luz agora diz o que a imagem mostra ("O verniz cobre tudo por igual, até o grão da pedra"). Menor novo: "pedra" × "cópia de gesso" (ROTEIRO 2). |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4, igual; nenhum título adianta virada ("Abrir uma caixa da estante", "Antes de acender a luz"). A Sala das esculturas fechada não abre caminho nem muda volta. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Nada mudou em causa, rótulo, tranca ou custo; validador com Ouro nas 5 e bot até 0,05%; a planta nova é igual nas 5 noites. |
| Jogo limpo e dedução | **9,0** | 9,0 | Os minijogos agora pedem o caderno (`par_foto` → as 4 combinações; a caixa → as 4 etiquetas), e errar segue sem custo. Menores novos: a comparação com a foto pela tela da luz já cabe na volta 1, e quem abre a caixa só por `c_esc_3` não tem a etiqueta no caderno. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas. Só mudaram `lenz_3` e `teo_cadeira`, que perderam a frase de narrador; as vozes seguem as fichas (Braga com "Tá." e café, Nico com tropeço, Aurélio com "eu sei de cor, nunca mais li"). |
| **Prosa** | **9,0** | **8,0** | Saíram "Você refez o que o Téo desfez", "A máquina entende…", "Alguém ligou.", "Ele não voltou para jantar.", "MEIO CERTO" e "Você não chutou". `lenz_3` fica em cena ("cabe um braço esticado"). Sobra o inventário curto de `maq_ver` ("3 mostradores, 1 ponteiro…"). |
| Robustez por número de jogadores | **9,0** | 9,0 | Nenhuma pista entrou nem saiu. A prova da cópia tem 6 fontes; todo fato essencial tem de 2 a 10 fontes em salas. Validador: Ouro com 1, 2 e 3 pessoas nas 5 causas. |
| Consistência do documento | **9,0** | 9,0 | ROTEIRO 20, DECISOES 14 e LOOP-CENTRAL 14 batem com dados, código e capturas: rachadura à direita na peça 3D e na tela A, foto com a da esquerda, tempestade só, `par_foto` = tela B. Menores: volta 1 × comparação da foto; gesso × "pedra"; cabeçalho de `loop-central-dados.js`. |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto, dado ou imagem, corrigível já. **(b)** = só muda com decisão de regra do autor.

**1. (a) Novo, da revisão 14: a comparação com a foto pode acontecer na volta 1.**
- `par_foto` é de volta 1. Desde a revisão 14, ela diz "pedra escura, riscos finos, bordas gastas".
- `falsa_1`, o cheiro de verniz, também é de volta 1, e `lcBancada` não confere a volta.
- Então quem pegou a foto na volta 1 já responde "Como é a peça de verdade, nessa foto? A luz de lado vai dizer se esta aqui é igual." A luz responde "Nenhuma borda gasta, nenhum risco de uso".
- Na prática, é a comparação de `foto_solo` (2 de energia, volta 2, prova), feita de graça na volta 1.
- O ROTEIRO diz o contrário:
  - parte 4, volta 1: "O que ainda não dá: … a comparação da foto (tudo isso é da volta 2 em diante)";
  - parte 11: "Na volta 1 ninguém sai com prova da cópia".
- Segura-se porque nada disso entra no caderno como prova: o caderno recebe só o cheiro, e o Revelar pede `foto_solo`, o Lado a Lado ou outra prova.
- Além disso, a volta 1 já deixa ler a troca (`data_3`, `v4_teo`), como está em "Ficou para decidir".
- Duas saídas:
  - a pergunta "antes" (ou a luz inteira) só a partir da volta 2, uma condição de volta em `lcBancada`;
  - ou registrar no ROTEIRO, partes 4 e 20, que a tela da luz mostra a diferença sem valer como prova (cerca de 20 palavras).

**2. (a) Novo, da revisão 14: "o grão da pedra" numa cópia de gesso.**
- O ROTEIRO, parte 2, diz que a cópia é "de gesso e verniz". As pistas combinam: molde e raspas de gesso (`falsa_3`), rastro de gesso na Galeria (`dis_gesso`), "Mais leve que no registro".
- A legenda nova da luz diz "até o grão da pedra". O Lado a Lado A já dizia "pedra cinza, mais clara".
- Quem joga não tem como errar por causa disso, porque a cópia imita pedra. Mas é o único lugar em que o texto chama de pedra o material da cópia.
- Saída: "até o grão" ou "até o grão da superfície" (1 a 2 palavras). Ou o ROTEIRO, parte 2, diz que o gesso foi texturizado como pedra (cerca de 8 palavras).

**3. (a) Novo, da revisão 14: minijogo da caixa × `c_esc_3`.**
- `c_peca` abre com o cheiro de verniz mais uma destas: `c_esc_1`, `c_esc_2` ou `c_esc_3`.
- A pergunta agora é "Pelo que o seu caderno diz da caixa do patrocínio, qual você abre?".
- `c_esc_3`, a gravação do Braga, diz só "duas caixas iguais", sem etiqueta e sem patrocínio. A própria DECISOES 14 lista as pistas com a etiqueta (`c_esc_1`, `c_esc_2`, `lenz_meio_1`), e `c_esc_3` não está entre elas.
- Atenua: o rótulo "Uma caixa de banners" está visível na lista da mesma sala, e errar não custa.
- Saída: na fala do Braga, "duas caixas de banners iguais" (2 palavras). Ou tirar `c_esc_3` do `umaDe` de `c_peca` e pôr `lenz_meio_1` (mudaria tranca, então é (b)).

**4. (a) Arte: cor da máscara na imagem da luz.**
- Com a luz quente, `GAL_B_mascara` sai marrom-escura.
- A tela A do Lado a Lado e a peça 3D dizem "pedra cinza, mais clara".
- Fora da dedução: a legenda da luz não fala de cor.

**5. Técnico, não conta para a história.** O comentário do topo de `loop-central-dados.js` ainda diz "revisão 13". O conteúdo é igual ao JSON da revisão 14.

**Antigos, como na rodada 13:**
- (b) `d_teo_2` sem tranca;
- (a) `d_fus_2` × porta aberta;
- (a) `d_fus_2b` × etiqueta molhada;
- "Se saiu, foi por outra porta." (aceitável: é a leitura das duas listas);
- o cabeçalho da LOOP-CENTRAL com "luvas e chavinha" (texto de projeto).

**Observação, não é defeito.** A rachadura da cópia está do lado oposto ao da foto, e o quinto símbolo está virado "como num espelho". As duas coisas combinam com quem copiou a partir de uma imagem invertida, com pressa. Nenhum texto conclui isso por quem joga.

### Pedido de conferência: revisão 14

| Ponto | Resultado |
|---|---|
| Luz × imagem | **Fechado.** A imagem é pedra fosca e granulada, sem brilho, e a legenda fala de verniz fino até o grão, sem borda gasta e sem risco de uso. Sobra "pedra" × gesso (menor 2). |
| Rachadura | **Fechada.** A peça 3D (`galeria_perto_390`) tem a rachadura fina do lado direito de quem olha, da sobrancelha pela bochecha. A imagem da luz também tem, fraca. Tela A: "rachadura fina do lado direito". Tela B: "rachadura do lado esquerdo". `foto_solo`: "do outro lado". `LC_MGA`: "A rachadura está do outro lado". |
| Uma chuva só | **Fechado.** `LOOP_DESC.patio` = "A tempestade não para, e a pedra está toda molhada." em `game.js`, `sala/conteudo.js` e `salas-loop.json`. Combina com `traj_aviso`, a fita ("chove desde o começo da noite") e o registro de quedas ("noite de tempestade"). |
| Prosa e rótulos | **Fechados.** `conserto_C`, `conserto_D`, `lenz_3`, `e_hist_1` e `teo_cadeira` estão sem conclusão. Os rótulos ficaram "Você marcou 3 de 3", "Quase." e "Revelar agora". |
| Minijogo da luz "antes" (`par_foto`) | **Coerente** com `par_foto` e com a tela B. Ressalva de volta (menor 1). |
| Minijogo da caixa | **Coerente** com `c_esc_1`, `c_esc_2` e `lenz_meio_1`; a segunda dica ("entrou leve e agora pesa demais") bate com `lenz_meio_1` e `c_esc_1`. Ressalva sobre `c_esc_3` (menor 3). |
| Fichas do desfecho | **Coerentes:** só aparecem os fatos do caderno daquela pessoa; sem fato, a tela diz "Nenhum fato da noite saiu do seu caderno desta vez". Os rótulos são os mesmos da fita. |
| Sala das esculturas | **Coerente** com `pose`: a porta de vidro dá para a Área de descanso e a escada do Subsolo fica ao lado. A sala é fechada, sem toque, igual nas 5 noites. O validador conta "15 salas abertas (+1 em reforma)". A parte 3 do ROTEIRO não lista a sala, mas a parte 20 vale sobre ela. |
| Manual, passo 1 | Coerente: o jogo começa no Saguão superior, no 2º andar, com a Galeria ao lado. |
| Contradição nova entre os 4 documentos? | **Nenhuma entre eles.** As novas são entre o ROTEIRO e uma tela (menores 1 e 2). |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.** Lista (a) de obrigatórias: **vazia**.

### 3.1 Menores (a) que vale fechar (não são condição para passar)

1. **Luz na volta 1.** Pôr a pergunta "antes" (ou a luz) a partir da volta 2, ou dizer no ROTEIRO, partes 4 e 20, que a tela da luz mostra a diferença sem ser prova. É uma condição em `lcBancada`, ou cerca de 20 palavras.
2. **"Grão da pedra".** Trocar por "até o grão" em `LC_MG.falsa_1.luz.achou` (1 a 2 palavras), ou pôr no ROTEIRO, parte 2, que o gesso foi texturizado como pedra (cerca de 8 palavras).
3. **`c_esc_3`.** Na fala do Braga, "duas caixas de banners iguais" (2 palavras).
4. **Cabeçalho de `loop-central-dados.js`:** "revisão 14" (técnico).

### 3.2 Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

As mesmas da rodada 13, menos os restos de formulário, que já foram aplicados:
- a Dra. Sato e as voltas; o alarme das 2:40;
- "quem" e "por quê" quase inteiros na volta 1;
- piso de volta;
- Revelar só na volta 5;
- por que quem joga lembra;
- `d_teo_2` sem tranca e `man_cal_3`;
- "tábua" com dois sentidos;
- minijogo sem custo de erro.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 13, rev. 13) | Agora (rev. 14) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Luz × imagem fechada e rachadura desenhada. Entra "pedra" × gesso (menor). |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, tranca ou rótulo mudou; a sala em reforma não abre caminho. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Igual nas 5 noites; validador APROVADO. |
| Jogo limpo e dedução | 9,0 | **9,0** | Minijogos decididos pelo caderno. Entram dois menores: a luz na volta 1 e `c_esc_3` na caixa. |
| Personagens e fichas | 9,0 | **9,0** | Só saíram frases de narrador de `lenz_3` e `teo_cadeira`. |
| Prosa | 8,5 | **9,0** | Saíram `conserto_C`, `conserto_D`, `e_hist_1`, `teo_cadeira` e os rótulos de formulário, que seguravam a nota. |
| Robustez por número de jogadores | 9,0 | **9,0** | Nenhuma pista entrou nem saiu; validador igual. |
| Consistência do documento | 9,0 | **9,0** | Fecharam luz × imagem, chuva e rachadura. Entram volta 1 × comparação e gesso × "pedra" (menores). |
| **Geral** | **8,9** (passou) | **9,0** (passou) | Nenhuma nota caiu por causa das correções técnicas. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima** (todos em 9,0). Lista de obrigatórias (a): vazia.

Recomendação honesta: fechar o item 1 de 3.1. É o único desvio que a própria revisão 14 criou na escada de revelações. Não quebra a prova, mas contradiz a frase do ROTEIRO sobre a volta 1.
