# Mosaico Loop v4 revisão 11: escala da história (seção 1), avaliada do zero

Avaliador independente: não escrevi o texto, então não há desconto de autoavaliação.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 18;
- FICHAS.md;
- DECISOES-V4.md, até a revisão 11;
- LOOP-CENTRAL.md: cabeçalho, revisões 9 a 11, checklist e pendências;
- as 281 pistas de `pistas_legivel.txt`;
- de `atividades.txt`: regras, trancas e finais.

**Telas que conferi:**
- game.js: `LOOP_DESC`, `TOUR`, `PECA_PERTO` e livro;
- loop-central.js: `LC_MG.insc_copia`, `LC_INSC`, dicionário, missões, `LC_FATO_PISTA`, Revelar e Anexar;
- ritmo.js: a fita;
- o ramo `glifos` de reserva/minigames.mjs;
- `textoPorCausa` em loop-central.js (linha 135): o texto da causa é **somado** ao texto de base, não o substitui.

**Capturas.** Vi as de `r11/insc/`: testa a 12° e a 5°, minijogo, livro com a tábua.

**Dados.** `loop-central-dados.js` é igual ao `pistas-v4.json` ("v4 revisão 11", 281 pistas). A escada é 232/27/9/9/4. "Lenz" não aparece antes da volta 3.

**Validador.** Rodei `validar.py` numa cópia em `/tmp/roda/esc/r10/val/`, sem gravar bytecode. Saída em `/tmp/roda/esc/r10/validar.txt`:
- **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes;
- bot com 2000 partidas: no máximo 0,05% de Ouro ou Desligar.

Não abri o jogo no navegador. Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. TODOS OS CRITÉRIOS PASSARAM: oito em 9,0 (mínimo 9,0) e a Prosa em 8,5 (mínimo 8,0).**

A revisão 11 fechou os cinco menores (a) da rodada 9:
- `v4_teo` registrado;
- medidor do Pátio unificado;
- molde de testa lisa e inscrição "riscados à mão";
- cadeado amarelo à vista com a porta aberta na noite D;
- conclusão de narrador tirada de `insc_copia`.

Também fechou o tamanho da peça (caixa de transporte com espuma).

A peça 3D bate com as pistas no que importa para a dedução. Na testa estão os seis símbolos na ordem `rosto, pedra, ver, noite, guardar virado, tempo`, iguais aos do minijogo e de `LC_INSC.copia`. O 5º abre para a esquerda e não existe na tábua.

Entraram três desvios novos, todos pequenos e fora da dedução (ver Consistência e O oculto). A Consistência continua em 9,0, agora com folga maior que na rodada 9: os desvios que a seguravam no limite fecharam, e os novos são de palavra.

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e só o caderno guarda (`aurelio_2` "Era medo meu", `v4_braga` "Tive medo de perder o emprego", `ivone_2` "Devia ter perguntado por quê"). Agora o Aurélio sabe a frase "de cor, nunca mais li" (`aurelio_1`): é a mesma fuga da lacuna. O Desligar tem preço por noite e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: queda antes de 0:00, `traj_3` às 4:10, 50 s de `raio_contagem`, disparo às 5:00. A Dra. Sato só comenta o que ouve. O molde × erro foi resolvido no mundo: `falsa_3` diz "A testa do molde é lisa" e `insc_copia` fala em "riscados à mão, de traço novo". |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4, sem mudança de volta ou tranca. A tábua (volta 1) não revela nada sozinha; a inscrição fica na volta 2, ao lado das outras provas da cópia. Nenhum rótulo adianta virada ("Tábua da escrita antiga", "Inscrição na máscara", "A testa, de perto", "Embaixo do medidor"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | O rótulo novo "Embaixo do medidor" existe nas 5 noites (`a_cheia_4` em A, `fh_med_pot_bce` em B, C e E, `fh_med_pot_d` em D). O texto só da noite D (`quadro_aberto`) entra somado, com rótulo, custo e tranca iguais. Validador: Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | A inscrição é limpa: a tábua (`insc_tabua`, volta 1) é exigida por `insc_copia`; o virado não é nenhum dos 12; o minijogo responde só com a posição, e a ordem das opções muda com a semente. A peça 3D mostra a mesma faixa. Na noite D, quem abre a porta lê o cadeado amarelo, o que fecha a omissão da rodada 9. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas. As falas novas seguem a ficha: `nico_1.porque` ("Ele pediu... espera.", "E... o laudo!", "Desculpa.") e `aurelio_1` ("eu sei de cor, nunca mais li"), que explica por que o curador não viu o símbolo virado. `v4_teo` ("a mesma cara") é igual em dados, FICHAS, DECISOES e LOOP-CENTRAL. |
| **Prosa** | **8,5** | **8,0** | Melhorou um pouco: saíram "Quem copiou com pressa, sim." (`insc_copia`) e "Repare" (`insc_tabua`). Ficam frases de narrador fechando conta: `insc_verdadeira` ("Vale pôr ao lado da máscara da Galeria."), `chao_peca` ("O museu esqueceu. O chão guardou."), `mancha_2` ("O museu não guardou nada."), `conserto_C`, "Você não chutou", "MEIO CERTO", "Marcadas: 3 de 3…" e "Registrar revelação". |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem 2 a 10 fontes em salas; a prova da cópia tem 6. Nenhuma fonte depende de um personagem que falte em alguma configuração. Validador desta rodada: Ouro com 1, 2 e 3 pessoas nas 5 causas e 5 sementes. |
| Consistência do documento | **9,0** | 9,0 | Os dois desvios da rodada 9 estão fechados (`v4_teo` em DECISOES rev. 10 e 11, LOOP-CENTRAL rev. 11, FICHAS e ROTEIRO 18; medidor único em ROTEIRO 16 e 18, DECISOES 9 e 11 e nos dados). Entram dois menores de palavra, isolados: "sulco dourado gasto" (DECISOES rev. 11) × "de traço novo" (`insc_copia`); e "chavinha" com dois sentidos no Pátio. |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto ou dado, corrigível já. **(b)** = só muda com decisão de regra do autor.

**Premissa.** (b) Revelar sem consertar é esquecido às 5:00. Sustenta-se porque o Desligar tem preço escrito.

**O oculto.**
- (a) **Novo; peça 3D × pistas da comparação.** Nas capturas a 5° e a 12°, a máscara da Galeria é fosca e granulada, com pintas e riscos escuros, e não se vê rachadura. As pistas dizem que a peça exposta "brilha lisa" (`foto_solo`), que não tem "os riscos do tempo" (`coop_copia_ok`) e que cheira a verniz fresco (`falsa_1`). Quem olhar a peça 3D com atenção vê o contrário do texto da comparação. Não quebra a dedução: a prova vem do texto, e a inscrição bate. Vale da GAL_B desde a revisão 8; é assunto da seção 5 (Pertencimento). Saída de texto, se a arte não mudar: "a pedra, fosca e riscada na foto, aqui tem um brilho de verniz por igual". Cerca de 10 palavras.
- (a) `dicionário · Inscrição` diz "Frase gravada na pedra". A da cópia é de gesso e riscada à mão. Muito pequeno.
- (b) A Dra. Sato e as voltas; o alarme das 2:40 sem causa. Ver 3.2.

**Estrutura.**
- (b) `data_2`, `motivo_1`, `c_esc_2`, `cracha_1`, `lenz_meio_2` e `traj_3` deixam "o do patrocínio" e o porquê quase inteiros na volta 1. Decisão já tomada.
- (a) A aba Revelar diz onde procurar desde o minuto 0. Já registrado como não aplicado.

**Rodízio.** C e D têm sinal só deles (`c_anc_1`, `d_fus_1`). (b) `d_teo_2` sem tranca.

**Jogo limpo.**
- (a) **Novo; noite D, porta aberta.** O texto somado diz "O cabo grosso do para-raios está preso na chave 3. Na chave do cabo da Câmara, um segundo cadeado…". São dois nomes para o mesmo cabo, em frases seguidas, e dá para ler como dois cabos. A etiqueta "Para-raios → Câmara" (`man_pot_3`) liga os dois nomes, mas só para quem a leu. Trocar por "Na mesma chave, um segundo cadeado, amarelo, pendurado aberto." (cerca de 3 palavras).
- (a) Ver o cadeado com a porta aberta não conta como sinal (o sinal é `d_fus_2`, "Pela fresta do quadro"), e a releitura da assinatura (`d_fus_2b`) pede `d_fus_2`. Quem abriu a porta precisa ainda espiar pela fresta. A pista está sempre na lista do Pátio, então não tranca ninguém; é só estranho.
- (a) `d_fus_2b` reconhece a letra na etiqueta molhada, enquanto `fh_vidro` diz que pela fresta não se leem as etiquetas das chaves. Segura-se ("a letra é a do diário": reconhecer não é ler; e a etiqueta é do cadeado, não da chave).
- (a) A fita do telão (`ritmo.js`, fato "copia") continua "verniz novo, peso errado", mesmo quando a prova foi a inscrição.

**Personagens.** (b) `man_cal_3` ("vai que precisa") em toda noite. O Aurélio que sabe a frase de cor e "nunca mais leu" é aceitável e coerente com a ficha (Privação baixa).

**Prosa.** Os da tabela. "Tábua" com dois sentidos (chão de tábuas × tábua dos símbolos) continua em "Ficou para decidir".

**Robustez.** Com 1 pessoa, o Ouro na noite E pede jogo quase perfeito: energia [5, 4, 5, 4, 2]. É dificuldade, não falta de fonte.

**Consistência** (cada item sozinho é menor):
1. **Novo, da revisão 11.** A DECISOES, revisão 11 ("A testa da máscara"), descreve a textura da inscrição na peça 3D como "sulco dourado gasto". Os dados dizem outra coisa:
   - na cópia, os símbolos são "riscados à mão, de traço novo" (`insc_copia`);
   - "gastos pelo tempo" é justamente o que marca a peça **verdadeira** (`insc_verdadeira`).

   Na captura, a faixa da peça 3D parece nítida e nova, então o problema é a palavra do documento, não a peça. Também o ROTEIRO, parte 18, diz "entalhados", e a pista diz "riscados". Trocar "gasto" por "de traço novo" na DECISOES (1 palavra) e "entalhados" por "riscados" no ROTEIRO, parte 18 (1 palavra).
2. **Novo, da revisão 11.** "Chavinha" agora tem dois sentidos na mesma sala:
   - a chave que abre o cadeado da porta (`quadro_0`: "Sem a chavinha, ela não abre"; `acesso_1` a `acesso_3`; tranca `abrir_o_quadro`; papel do Raio);
   - o interruptor do ponteiro de potência, embaixo do medidor (`a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d`).

   No Pátio, quem lê "a chavinha… está desligada" pode achar que é a chave da porta. Trocar a do medidor por "o botãozinho do ponteiro de potência" ou "o interruptor do ponteiro de potência" nas três pistas e no ROTEIRO, parte 18, e na DECISOES, revisões 9 e 11 (cerca de 6 palavras).
3. (Não conta como defeito.) A LOOP-CENTRAL, revisão 10, ainda descreve o minijogo com `img:['V11']` e botões com o símbolo. É registro histórico, e a revisão 11 diz o que mudou. O cabeçalho da LOOP-CENTRAL chama o quadro de "quadro de energia". Os jogadores não veem isso.

### Pedido de conferência: revisão 11

| Ponto | Resultado |
|---|---|
| Inscrição gravada na testa da máscara 3D | **Bate.** Nas capturas (`testa_390_zoom_max`, `testa_390_zoom_12`), a faixa tem 6 símbolos na ordem de `LC_INSC.copia`, com o 5º (guardar) aberto para a esquerda. A tábua do livro e do minijogo tem `guardar` aberto para a direita. A peça verdadeira não aparece em 3D, como diz o ROTEIRO, parte 18. Menor: a superfície da máscara contradiz "brilha lisa" e "sem riscos do tempo" (O oculto). |
| Medidor do Pátio unificado | **Coerente.** É um objeto só ("O medidor do quadro": `a_cheia_2` e `fh_med_quadro`, mostrador redondo) e uma segunda leitura com rótulo próprio, igual nas 5 noites ("Embaixo do medidor"). Na noite D já não há choque: o mostrador marca carga cheia e o que está desligado é só o ponteiro pequeno de potência. ROTEIRO (16, 18), DECISOES (9, 11) e LOOP-CENTRAL (11) dizem o mesmo. Menor: o duplo sentido de "chavinha". |
| "Riscados à mão, de traço novo" e molde de testa lisa | **Coerente** entre `falsa_3`, `insc_copia`, ROTEIRO (1, 17, 18), DECISOES (11) e LOOP-CENTRAL (11). A pergunta "se usaram molde, por que o erro?" agora tem resposta no mundo. Menor: "sulco dourado gasto" na DECISOES. |
| Cadeado amarelo à vista ao abrir o quadro, só na noite D | **Coerente.** Está em `textoPorCausa` só de `D_fusivel`, somado ao texto de base (loop-central.js:135 e simulador-texto.py:90), com rótulo, custo e tranca iguais nas 5 noites. Bate com o ROTEIRO, parte 5 ("Quem abre a porta com a chavinha também vê o cadeado amarelo. Não dá para ler.") e parte 18. Menor: "cabo do para-raios" e "cabo da Câmara" lado a lado. |
| Caixa de transporte com espuma | **Coerente** (`lenz_meio_2`, DECISOES 11, ROTEIRO 18). "Pesa demais pra banner" continua fazendo sentido (banner é leve). |
| Nico com tropeço | **Coerente** (`nico_1.porque`, FICHAS, cena e revisão 11, ROTEIRO 15 e 18). |
| Aurélio sabe a frase de cor | **Coerente** (`aurelio_1`, FICHAS, ROTEIRO 18, DECISOES 11). A tranca e o que a pista prova não mudaram. |
| `v4_teo` "a mesma cara" | **Registrado e igual** nos dados, na DECISOES (rev. 10 corrigida, rev. 11), na LOOP-CENTRAL (rev. 11), na FICHAS (rev. 11) e no ROTEIRO (18). Saiu de "Ficou para decidir". |
| Contradição nova entre dados, ROTEIRO, FICHAS, DECISOES e LOOP-CENTRAL? | **Duas, de palavra:** "gasto" × "traço novo" (e "entalhados" × "riscados"); "chavinha" com dois sentidos. Nenhuma de dedução, de tranca ou de fonte. |
| Seletor "Bem-vindo/Bem-vinda/Tanto faz" | Decisão do autor; não avaliado como defeito. |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.**

### 3.1 Menores (a) que vale fechar (não são condição para passar)

Por ordem de prioridade. Todos são texto: nenhuma regra, tranca ou fonte muda.
1. **"Chavinha" do medidor** → "botãozinho" ou "interruptor" do ponteiro de potência, em `a_cheia_4`, `fh_med_pot_bce`, `fh_med_pot_d`, ROTEIRO 16 e 18 e DECISOES 9 e 11. Cerca de 6 palavras. Mexe em dado, então pede o validador de novo (o rótulo não muda).
2. **"Gasto" → "de traço novo"** na DECISOES, revisão 11, e "entalhados" → "riscados" no ROTEIRO, parte 18. Duas palavras.
3. **Noite D:** "Na chave do cabo da Câmara" → "Na mesma chave" (`quadro_aberto.textoPorCausa.D_fusivel`). Cerca de 3 palavras.
4. **Comparação × peça 3D:** levar à seção 5. Se a arte da GAL_B não ganhar brilho de verniz e uma rachadura, ajustar `foto_solo` e `coop_copia_ok` ao que a peça mostra. Cerca de 10 palavras.
5. **Prosa:** cortar "Vale pôr ao lado da máscara da Galeria." (`insc_verdadeira`) e trocar o fato "copia" da fita por "A peça da Galeria é cópia: verniz novo, peso e escrita errados" (cerca de 3 palavras).

### 3.2 Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

1. A Dra. Sato e as voltas; o alarme das 2:40. Não baixam: a sirene só aparece para quem contou do Téo, e o alarme não entra em dedução.
2. "Quem" e "por quê" quase inteiros na volta 1. Custam força à virada da volta 3, mas o que é travado (provas, nome, Revelar) não abre antes.
3. Piso de volta em `nico_1`, `cracha_3` e `lenz_2`.
4. Revelar sem consertar é esquecido; Revelar só na volta 5. A regra é anunciada desde a entrada.
5. Por que quem joga lembra: convenção do gênero.
6. `d_teo_2` sem tranca e `man_cal_3`.
7. "Tábua" com dois sentidos. Se o autor trocar, "quadro dos símbolos" agora também choca com "Quadro externo", e "chave de leitura" choca com chave e chavinha. "Página dos símbolos" evita os dois.
8. Minijogo sem custo de erro, entrada por papel nos consertos em dupla, missão do Nico só na volta 4, aviso de aula encerrada. São de motivação ou de padrão de sala, não desta escala.

Nenhuma nota desta rodada depende dessas decisões.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 9, rev. 10) | Agora (rev. 11) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança. `aurelio_1` reforça o "calou por medo". |
| O oculto | 9,0 | **9,0** | Fecharam molde × erro (testa lisa, riscado à mão) e o tamanho da peça (caixa com espuma). Entram dois menores: peça 3D fosca e granulada × "brilha lisa"; "gravada na pedra" no dicionário. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, horário ou tranca mudou. |
| Rodízio (causas A–E) | 9,0 | **9,0** | Rótulo novo nas 5 noites; texto da noite D somado, sem mudar a lista. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou `quadro_aberto` na noite D. Entra o menor "cabo do para-raios" × "cabo da Câmara". A peça 3D confirma a inscrição. |
| Personagens e fichas | 9,0 | **9,0** | Nico ganhou o tropeço da ficha; Aurélio ganhou motivo para não ter visto o símbolo virado. |
| Prosa | 8,5 | **8,5** | Saíram "Quem copiou com pressa, sim." e "Repare". Os outros fechamentos de narrador e rótulos de formulário ficam, então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador de novo: APROVADO, bot até 0,05%. |
| Consistência do documento | 9,0 (no limite) | **9,0** | Os dois desvios da rodada 9 fecharam. Entraram dois de palavra ("gasto" × "traço novo"; "chavinha" em dois sentidos). Saiu do limite: os novos são menores que os antigos. |
| **Geral** | **8,9** (passou) | **8,9** (passou) | Nenhuma nota caiu por causa das correções técnicas. |

**A revisão 11 criou contradição nova?** Sim, duas pequenas e só de palavra:
- **DECISOES (rev. 11) × dados:** "sulco dourado gasto" × "de traço novo";
- **"chavinha"** usada para a chave da porta e para o interruptor do medidor.

Nenhuma toca dedução, tranca, fonte ou rodízio.

**A peça 3D bate com as pistas?** Na inscrição, sim, símbolo por símbolo. Na superfície, não por inteiro: fosca, riscada e sem rachadura à vista, contra "brilha lisa" e "sem os riscos do tempo". Fica para a seção 5.

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima** (oito em 9,0, Prosa em 8,5). Pelo ciclo das escalas, segue-se para a seção 2.

Recomendação honesta: fechar os itens 1 a 3 de 3.1 (cerca de 11 palavras, só texto) e levar o item 4 à seção 5, junto com a peça da Galeria.
