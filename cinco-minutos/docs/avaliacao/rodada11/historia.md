# Mosaico Loop v4 revisão 13: escala da história (seção 1), do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação.

**O que li:**
- ESCALAS_AVALIACAO_JOGOS.md e BRIEF_REV13;
- ROTEIRO-LOOP.md inteiro (partes 1 a 19);
- FICHAS.md;
- DECISOES-V4.md: início, revisões 10 a 13;
- LOOP-CENTRAL.md: cabeçalho, revisões 11 a 13 e checklist;
- as 281 pistas de `pistas_legivel.txt`.

**No código:**
- `atividades_coop` e `finais` dos dados;
- `LC_MG` e dicionário em loop-central.js;
- `LOOP_DESC` em game.js;
- a fita do telão em ritmo.js.

**Dados.** `loop-central-dados.js` é igual ao `pistas-v4.json`: "v4 revisão 13", 281 pistas.

**Capturas:**
- todas de `r12/vis`;
- de `r12/extra`: luz antes, luz achou, Galeria na sala, torre com zoom.

**Validador.** Rodei de novo numa cópia (`rod11/val/`), porque o JSON tem hora posterior à saída da r12. Saída em `/tmp/roda/esc/rod11/validar.txt`:
- **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes;
- bot no máximo em 0,05%.

Nada no repositório foi tocado.

## 1. Nota geral

**8,9 / 10. TODOS OS CRITÉRIOS PASSARAM: oito em 9,0 (mínimo 9,0) e a Prosa em 8,5 (mínimo 8,0).**

A revisão 13 fechou os retoques da rodada 10:
- "chavinha" tem um sentido só;
- "Na mesma chave";
- "gasto" virou "de traço novo";
- desgaste nas bordas no lugar de "brilha lisa" e "riscos do tempo";
- saíram três frases de narrador;
- dicionário e fita foram corrigidos.

Nenhuma regra, tranca, volta ou fonte mudou, e a dedução continua limpa.

Entrou uma contradição nova, pequena e fora da dedução: o minijogo da luz agora mostra a máscara 3D (fosca e granulada) ao lado da frase "O verniz brilha por igual". Também continua um desvio antigo de arte: a rachadura da comparação não aparece na peça 3D.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu e calou: `aurelio_2` ("Era medo meu"), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê"). O Desligar tem preço em cada noite; a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: queda ~0:00−30 s, `traj_3` às 4:10, plaquinha de 50 s em `raio_contagem`, disparo às 5:00. A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). Menor novo: no minijogo da luz, a imagem da máscara fosca está ao lado de "O verniz brilha por igual" (`LC_MG.falsa_1.luz`). |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4, sem mudança. Tábua na volta 1 e inscrição na volta 2. A testa à vista desde a volta 1 é decisão do autor. Nenhum rótulo adianta virada. |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | "Embaixo do medidor" existe nas 5 noites com textos de mesmo peso (`a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d`). `quadro_aberto` só soma texto na noite D. Validador: Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | `insc_copia` pede `insc_tabua` (volta 1); a prova da cópia tem 6 fontes. A noite D ficou sem ambiguidade ("Na mesma chave"). Não achei fato essencial sem fonte; "Lenz" só aparece da volta 3 em diante. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas, e as falas seguem a ficha: `nico_1.porque` tropeça; `aurelio_1` "sei de cor, nunca mais li"; Braga com "Tá." e café; Dirceu de esfregão e pano. Nada mudou em personagem na revisão 13. |
| **Prosa** | **8,5** | **8,0** | Melhorou: saíram os fechos de `insc_verdadeira`, `chao_peca` e `mancha_2`. Ficam: `conserto_C` ("A máquina entende há quantos dias..."), `e_hist_1` ("Alguém ligou."), e as frases de formulário "Você não chutou", "MEIO CERTO", "Marcadas: 3 de 3…" e "Registrar revelação" (loop-central.js:92, 211, 215, 369). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem 2 ou mais fontes em salas. O nome tem 3 caminhos (`cracha_3`, `lenz_2`, `coop_veredito`). Validador de agora: Ouro com 1, 2 e 3 pessoas nas 5 causas e 5 sementes. |
| Consistência do documento | **9,0** | 9,0 | Fecharam os três desvios de palavra da rodada 10 (chavinha, gasto, cabo); dados = JS; ROTEIRO 19, DECISOES 13 e LOOP-CENTRAL 13 dizem o mesmo. Ficam dois menores com a peça 3D: luz × "brilha por igual"; e a rachadura de `telaPapel.A` não aparece na peça. |

### Defeitos menores (nenhum segura nota sozinho)

**(a)** = texto, dado ou imagem, corrigível já. **(b)** = depende de decisão de regra ou de arte do autor.

**O oculto e Consistência**
1. **(a) Novo, da revisão 13: imagem da luz × texto.**
   - A tela "Olhar a peça com luz de lado" agora usa `GAL_B_mascara.webp`: pedra fosca, granulada, com pintas escuras (captura `r12/extra/luz_achou_390.png`).
   - A frase que aparece embaixo é "O verniz brilha por igual, de ponta a ponta."
   - A DECISOES (rev. 13) chama isso de "efeito de luz rasante", mas a imagem não mostra brilho nenhum na máscara (o facho de luz fica no fundo, à direita).
   - Quem acabou de escolher "Riscos, poeira e desgaste" (o que a peça antiga mostraria) vê uma máscara que parece ter exatamente pintas e riscos.
   - Não quebra a dedução: `falsa_1` é suspeita, e a prova da cópia vem de outras 6 fontes.
   - Saída de texto, sem mexer na arte: "A luz passa de lado e não acha borda gasta nem marca de mão: tudo por igual, como coisa nova." (cerca de 20 palavras).
2. **(a/b) Rachadura.** `coop_copia_ok`, `foto_solo` e `telaPapel.A` ("rachadura do lado direito") dizem que a peça exposta tem uma rachadura. Na peça 3D (torre com zoom, Galeria na sala) não se vê rachadura.
   - A DECISOES (rev. 13) já registra que é arte não aplicada.
   - O ROTEIRO, parte 19, tem o título "A comparação bate com a peça 3D", o que promete mais do que a peça mostra.
   - Saída de texto, se a arte não vier: trocar o item da rachadura por um que a peça mostra, como a cor ou as pintas. Cerca de 6 palavras em 3 lugares.
3. **(a) Lógica do molde, muito pequeno.** A cópia saiu de molde ("o molde pegou só o rosto"), mas a rachadura dela está do lado oposto ao da foto. Um molde copiaria a rachadura do mesmo lado. Ninguém explica, e ninguém em jogo pergunta.
4. (b) A Dra. Sato e as voltas; o alarme das 2:40 sem causa. Já está em "Ficou para decidir".

**Estrutura.** (b) "O do patrocínio" e o porquê ficam quase inteiros na volta 1 (`data_2`, `motivo_1`, `c_esc_2`, `cracha_1` + `cracha_2`, `lenz_meio_2`, `traj_3`). Decisão já tomada: o nome e as provas continuam travados.

**Rodízio.** C e D têm sinal só deles (`c_anc_1`, `d_fus_1`), com par de mesmo rótulo. (b) `d_teo_2` sem tranca.

**Jogo limpo** (de antes, sem mudança):
- (a) Na noite D, ver o cadeado com a porta aberta não conta como sinal (`d_fus_2b` pede `d_fus_2`, pela fresta);
- (a) `d_fus_2b` reconhece a letra na etiqueta, e `fh_vidro` diz que não se leem as etiquetas das chaves. Segura-se: a etiqueta é do cadeado, e reconhecer não é ler.

**Personagens.** (b) `man_cal_3` ("vai que precisa") em toda noite.

**Prosa.** Os da tabela, mais inferências curtas de narrador que ainda se aceitam por estarem dentro da cena:
- `empurra_2`: "alguém tentou segurar quem caía";
- `lenz_3`: "a um braço de distância";
- `coop_catraca_ok`: "Se saiu, foi por outra porta".

**Robustez.** Com 1 pessoa, a noite E pede jogo quase perfeito: energia [5, 4, 5, 4, 2] na rodada anterior. É dificuldade, não falta de fonte.

**Consistência: documentos** (não contam como defeito):
- o ROTEIRO, parte 5, mostra a Central "vendo pelas câmeras" na cena do Raio, e a parte 10 diz que a Central é papel falado. A cena é descrição e a regra vale sobre ela;
- a parte 17 descreve os símbolos como "entalhe dourado" (estilo do desenho), e a cópia é "riscada à mão". A DECISOES (rev. 11) já resolve isso com "sulco dourado de traço novo".

### Pedido de conferência: revisão 13

| Ponto | Resultado |
|---|---|
| "Chavinha" com um sentido só | **Coerente.** Agora "chavinha" é só a chave do cadeado (`quadro_0`, `acesso_1-3`, `quadro_aberto`, papel do Raio). O medidor usa "interruptor do ponteiro de potência" nas três pistas, no ROTEIRO 16, 18 e 19 e na DECISOES 11 e 13. |
| "Na mesma chave" (noite D) | **Coerente.** Vem logo depois de "O cabo grosso do para-raios está preso na chave {ch}", que bate com `d_fus_2` ("chave onde chega o cabo da Câmara") e com `man_pot_3` ("Para-raios → Câmara"). |
| Desgaste nas bordas × peça 3D | **Bate nas bordas e na cor.** A máscara 3D tem bordas inteiras e é cinza-clara, contra a foto, que é "escura, fosca" (`LC_MG.tombo_2`). **Não bate na rachadura**, que não aparece (menor 2). |
| Frases de narrador cortadas | **Feito** em `insc_verdadeira`, `chao_peca` e `mancha_2`. O fato de cada pista ficou. |
| Fita do telão | **Feito.** "verniz novo, peso e escrita errados". |
| Dicionário "Inscrição" | **Feito.** "Frase escrita na própria peça". |
| Dicas de minijogo | **Coerentes.** A dica de `c_peca` aponta para o caderno sem dar a resposta. `falsa_1.antes` manda ao Dicionário (idade da peça). |
| Imagem da luz com a inscrição | **Contradição nova, pequena** (menor 1): a máscara fosca aparece ao lado de "O verniz brilha por igual". |
| Chuva ouvida, cadeira longe da bancada | **Coerentes** com `LOOP_DESC`, `ceu` e `teo_cadeira`. |
| Planta (revisão 12) × pistas | **Coerente.** Pegadas da Sala das coleções pela Área de descanso até a porta de serviço; Ateliê com porta de vidro para a Área de descanso (`ivone_red`); Base da limpeza junto do corredor da escada do Subsolo (`traj_2`); Pátio fora, ligado à Oficina elétrica. |
| Contradição nova entre dados, ROTEIRO, FICHAS, DECISOES e LOOP-CENTRAL? | **Nenhuma entre os documentos.** As duas que há são de tela ou peça × texto (menores 1 e 2). |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.**

### (a) Obrigatório para o mínimo

Nada.

### (b) Retoques opcionais, por prioridade

Nenhum muda regra, tranca ou fonte.
1. **Luz de lado:** trocar `LC_MG.falsa_1.luz.achou` por uma frase que a imagem sustente (cerca de 20 palavras). A outra saída é uma imagem com reflexo de verniz.
2. **Rachadura:** vir a arte da GAL_B com uma rachadura à direita. Se não vier, trocar o item em `telaPapel.A`, `coop_copia_ok` e `foto_solo` (cerca de 6 palavras) e ajustar o título da parte 19 do ROTEIRO.
3. **Prosa:**
   - cortar "A máquina entende há quantos dias segurava a peça errada e solta." (`conserto_C`);
   - trocar "Você não chutou" e "MEIO CERTO" por frases do mundo;
   - trocar "Registrar revelação" por algo como "Dizer o nome" (cerca de 25 palavras ao todo).

## 4. Antes | agora | motivo

| Critério | Antes (rodada 10, rev. 11) | Agora (rev. 13) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Saíram "brilha lisa" e "riscos do tempo", e o dicionário já não diz "gravada na pedra". Entrou a imagem da luz × "brilha por igual". |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, horário ou tranca mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Só troca de palavra, igual nas 5 noites. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou "cabo do para-raios" × "cabo da Câmara". |
| Personagens e fichas | 9,0 | **9,0** | Sem mudança. |
| Prosa | 8,5 | **8,5** | Três fechos de narrador a menos. Ficam `conserto_C`, `e_hist_1` e as frases de formulário, então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador de novo: APROVADO, bot até 0,05%. |
| Consistência do documento | 9,0 | **9,0** | Fecharam "chavinha", "gasto" e "entalhados". Entrou um menor de tela (luz), e o da rachadura continua. |
| **Geral** | **8,9** | **8,9** | Nenhuma nota caiu por causa das correções. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima.** Oito estão em 9,0 e a Prosa está em 8,5. Pelo ciclo, segue-se para a seção 2.
