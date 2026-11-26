# Mosaico Loop v4 revisão 13: escala da história (seção 1), avaliada do zero

Avaliador independente: não escrevi o texto, então não há desconto de autoavaliação.

**O que li inteiro:** ESCALAS_AVALIACAO_JOGOS.md; ROTEIRO-LOOP.md (partes 1 a 19); FICHAS.md; DECISOES-V4.md (cabeçalho e revisões 10 a 13); LOOP-CENTRAL.md (cabeçalho, revisões 11 a 13, checklist e pendências); as 281 pistas de `pistas_legivel.txt`; regras, trancas, finais, linha do tempo e papéis dos dados.

**Telas conferidas no código:** `LOOP_DESC`, `TOUR` e `PLANTA` (game.js); `LC_MG`, `LC_MGA`, `LC_GLOS_LISTA`, `LC_INSC`, `LC_MISSOES`, `LC_FATO_PISTA`, Anexar e Revelar (loop-central.js); fita e finais do telão (ritmo.js); `telaPapel` do Lado a Lado; o ramo `luz` de reserva/minigames.mjs e `.cena-peca` de bancada.css.

**Capturas vistas:** `r12/vis` (entrada, planta, peça 3D, lista, Máquina, Revelar) e `r12/extra` (luz antes, luz no escuro e luz achada; Galeria na sala; museu 3D com zoom na testa). Também abri `museu/icones/GAL_B_mascara.webp`.

**Dados:** `loop-central-dados.js` é igual a `dados/pistas-v4.json` ("v4 revisão 13", 281 pistas). O md5 é o mesmo da cópia que o validador rodou (`/tmp/roda/v4_pistas.json`). "Lenz" não aparece em pista antes da volta 3. Nas telas, só aparece na fita do telão, que é do fim.

**Validador** (`r12/validar.txt`, sobre esses mesmos dados): **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes. O bot ficou entre 0,00% e 0,05%.

Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. NÃO PASSOU.**
- **Consistência do documento: 8,5** (mínimo 9,0).
- Prosa: 8,5 (mínimo 8,0).
- Os outros sete critérios: 9,0.

A revisão 13 fechou o que prometia nos textos:
- "chavinha" passou a ter um sentido só;
- "Na mesma chave";
- saíram as três frases de narrador;
- a fita diz "escrita errados";
- o dicionário diz "frase escrita";
- desgaste nas bordas na comparação.

Mas a revisão trocou a imagem do minijogo da luz pela máscara 3D de verdade (`GAL_B_mascara.webp`). A imagem é de pedra fosca, granulada, com pintas e riscos escuros. O texto da mesma tela continua dizendo "O verniz brilha por igual, de ponta a ponta".

É contradição nova entre tela e texto, na pista que abre toda a prova da cópia (`falsa_1`), e todo mundo passa por ela. Somada à rachadura que a peça 3D não tem ("rachadura do lado direito" no Lado a Lado), a afirmação do ROTEIRO 19 ("A comparação bate com a peça 3D") não se sustenta.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e só o caderno guarda (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê"). O Desligar tem preço por noite (D: "A manhã chega, limpa demais"), e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: queda uns 30 s antes de 0:00, `traj_3` às 4:10, 50 s de `raio_contagem`, disparo às 5:00. `rev_3` ("então apaga?") planta o engano. A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4, sem mudança na revisão 13. A tábua (volta 1) não prova nada sozinha; `insc_copia` fica na volta 2. Nenhum rótulo adianta virada ("Embaixo do medidor", "A testa, de perto", "Abrir o quadro"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | Os retoques valem nas 5 noites. O texto da noite D ("Na mesma chave...") é somado, com rótulo, custo e tranca iguais. Validador: prévias e ordem iguais nas 5 causas; Ouro em todas. |
| Jogo limpo e dedução | **9,0** | 9,0 | Toda prova vem de pista plantada antes (`insc_tabua` na volta 1 para `insc_copia` na volta 2; `motivo_1` para `lenz_mot_2`). A noite D ficou limpa ("Na mesma chave"). A imagem da luz contradiz o texto, mas a dedução segue pelo texto: o defeito vai para a Consistência. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas; nenhuma fala mudou na revisão 13. O "Tá." do Braga (`cracha_3`, `coop_veredito`), o tropeço do Nico (`nico_1.porque`) e o "Eu reparo." do Seu Dirceu (`d_teo_2`, contra o "Não reparei" que ele nunca diria) seguem a ficha. |
| **Prosa** | **8,5** | **8,0** | Saíram `insc_verdadeira` "Vale pôr ao lado...", `chao_peca` "O chão guardou." e `mancha_2` "O museu não guardou nada.". Ficam fechamentos de narrador e voz de sistema: `conserto_C` ("A máquina entende há quantos dias..."), `e_hist_1` "Alguém ligou.", `teo_cadeira` "Ele não voltou para jantar.", "Você não chutou", "MEIO CERTO", "Marcadas: 3 de 3", "Registrar revelação". |
| Robustez por número de jogadores | **9,0** | 9,0 | A prova da cópia tem 6 fontes em salas; nenhum fato essencial depende de personagem ausente. Validador: Ouro com 1, 2 e 3 pessoas nas 5 causas e em 5 sementes. A noite D sem dupla gasta [5, 5, 5, 3, 3]: é apertado, mas cabe. |
| Consistência do documento | **8,5** | 9,0 | Minijogo da luz (`LC_MG.falsa_1.luz`): a imagem `GAL_B_mascara` mostra pedra fosca, granulada e riscada, que é o "Riscos, poeira e desgaste" da pergunta de antes. Abaixo dela, o texto diz "O verniz brilha por igual, de ponta a ponta". O Lado a Lado diz "rachadura do lado direito", e a peça 3D não tem rachadura. O ROTEIRO 19 afirma "A comparação bate com a peça 3D". |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra ou arte.

**Consistência.**
- (b) **Rachadura** que a peça 3D não mostra:
  - aparece em `foto_solo` ("a rachadura está do outro lado"), em `coop_copia_ok` ("o lado da rachadura"), na tela A do Lado a Lado ("rachadura do lado direito") e na resposta de `LC_MGA.coop_original_copia`;
  - a DECISOES 13 deixa a rachadura para a arte. Sozinha, seria um menor; junto com a imagem da luz, derruba a nota;
  - saída só de texto, se a arte não vier: "uma rachadura fina, quase invisível, do lado direito" no Lado a Lado e "do outro lado, e fininha" em `foto_solo`. São umas 8 palavras.
- (a) A tela B do Lado a Lado diz "pedra escura, fosca" para a foto. Isso sugere que a peça exposta não é fosca, mas ela é. Muito pequeno: a diferença dita é a cor.
- (a) O cabeçalho da LOOP-CENTRAL ainda chama o quadro de "quadro de energia". É documento interno; quem joga não vê.

**Jogo limpo.**
- (a) Ver o cadeado amarelo com a porta aberta não conta como sinal (`d_fus_2` pede a fresta). Já registrado.
- (a) `d_fus_2b` reconhece a letra × `fh_vidro` "não ler as etiquetas". Segura-se: reconhecer não é ler.
- (a) A segunda dica de `LC_MG.c_peca` aponta a pista que contém a resposta. É dica, aceitável.

**Estrutura.** (b) "O do patrocínio" e o porquê já aparecem quase inteiros na volta 1 (`data_2`, `motivo_1`, `c_esc_2`, `cracha_1`, `lenz_meio_2`, `traj_3`). Está em "Ficou para decidir".

**Rodízio.** (b) `d_teo_2` sem tranca, na noite D.

**Decisões do autor, sem desconto:**
- a testa à vista desde a volta 1;
- o seletor de entrada;
- a planta (a disposição do Térreo bate com as pistas: Coleções e Ateliê pela porta de vidro para a Área de descanso, porta de serviço na parede de fora, Base da limpeza abrindo no hall da escada, como pede `traj_2`).

## 3. Abaixo do mínimo

**Consistência do documento: 8,5 (mínimo 9,0).** Uma correção basta; a rachadura fica opcional.

1. **Minijogo da luz: a imagem e o texto têm de dizer a mesma coisa** (OBRIGATÓRIO). Duas saídas:
   - **Só texto**, em `loop-central.js`, `LC_MG.falsa_1.luz.achou` (cerca de 15 palavras). Por exemplo: "O verniz cobre tudo por igual, até o grão da pedra. Nenhuma borda gasta, nenhum risco fundo." Isso concorda com a imagem (grão visível sob verniz, bordas inteiras) e com `foto_solo`. Na mesma passada, alinhar a frase do ROTEIRO 15 e da DECISOES 13 ("O verniz brilha por igual...").
   - **Ou imagem**: um render da GAL_B com brilho de verniz no estado "achou". É arte; não depende só de texto.

   A pista `falsa_1`, a tranca e as opções da pergunta de antes não mudam. Não precisa de validador: o minijogo não é dado.

2. **Opcional, junto:** ajustar o ROTEIRO 19 para "A comparação bate com a peça 3D na cor e nas bordas; a rachadura fica na conta da arte". Ou adotar a rachadura "fina, quase invisível" (cerca de 8 palavras em `telaPapel.A`, `foto_solo` e `coop_copia_ok`). Isso mexe em dado, então pede o validador.

### Retoques opcionais (b, não são condição para passar)
- Prosa: cortar "Alguém ligou." (`e_hist_1`) e a explicação de `conserto_C` ("A máquina entende há quantos dias..."). Cerca de 12 palavras.
- Os pontos de regra em "Ficou para decidir" na DECISOES continuam como estão. Nenhuma nota desta rodada depende deles.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 10, rev. 11) | Agora (rev. 13) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. |
| O oculto | 9,0 | **9,0** | O dicionário diz "frase escrita na própria peça" (fechou o "gravada na pedra"). |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, horário ou tranca mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Retoques iguais nas 5 noites; validador aprovado. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou "cabo do para-raios" × "cabo da Câmara" ("Na mesma chave"). |
| Personagens e fichas | 9,0 | **9,0** | Nenhuma fala mudou. |
| Prosa | 8,5 | **8,5** | Saíram três fechamentos de narrador. Ficam outros e a voz de sistema, então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador de novo: APROVADO. |
| Consistência do documento | 9,0 | **8,5** | **Caiu por causa da revisão 13.** Fecharam "chavinha" e "gasto" × "traço novo". Mas a imagem nova do minijogo da luz (a máscara 3D, fosca e granulada) contradiz "O verniz brilha por igual" na mesma tela. Com a rachadura ausente na peça 3D, o ROTEIRO 19 diz "A comparação bate com a peça 3D" sem que isso seja inteiro. |
| **Geral** | **8,9** (passou) | **8,9** (não passou) | Uma nota caiu abaixo do mínimo por causa de uma correção de tela. |

## 5. Fim do ciclo

**A escala da história (seção 1) NÃO passou.** A Consistência do documento ficou em 8,5, com mínimo de 9,0.

Pelo ciclo das escalas:
- corrigir o item 1 de "Abaixo do mínimo" (cerca de 15 palavras de texto de tela, mais a frase igual no ROTEIRO 15 e na DECISOES 13);
- reavaliar do zero.
