# Mosaico Loop v4 revisão 13: escala da história (seção 1), avaliada do zero

Avaliador independente. Não escrevi o texto, então não há desconto de autoavaliação.

**O que li inteiro:**
- ESCALAS_AVALIACAO_JOGOS.md;
- ROTEIRO-LOOP.md, partes 1 a 19;
- FICHAS.md;
- DECISOES-V4.md, revisões 10 a 13;
- LOOP-CENTRAL.md: cabeçalho, revisões 11 a 13, checklist e pendências;
- as 281 pistas de `pistas_legivel.txt`, gerado da revisão 13 e conferido com os dados;
- de `atividades.txt`: as atividades em dupla (com `telaPapel`), os finais, a linha do tempo e o mapa da história.

**Telas que conferi no código:**
- game.js: `LOOP_DESC`;
- loop-central.js: `LC_MG` (luz, caixa, inscrição, foto antiga), dicionário `LC_GLOS_LISTA` e missões;
- ritmo.js: a fita (`LOOP_LINHA`).

**Capturas que vi:**
- `r12/extra`: Galeria 390, museu 3D com zoom na Galeria, minijogo da luz antes, no escuro e no achado, manual 3;
- `r12/vis`: mapa, lista de pistas, Revelar, telão;
- `/tmp/roda/planta/final/orelha_2_terreo_390.png`.

**Dados e validador:**
- `dados/pistas-v4.json` tem os mesmos bytes que `/tmp/roda/v4_pistas.json`, o arquivo que o validador leu (`cmp`);
- `loop-central-dados.js` é igual ao JSON;
- a saída `r12/validar.txt` diz: "revisão 13", **APROVADO** nas 5 causas, com 1, 2 e 3 pessoas e 5 sementes, e o bot fica em no máximo 0,05%.

**Varreduras:**
- "Lenz" não aparece em nenhuma pista de volta 1 ou 2.
- Nenhuma pista de volta 1 traz "cópia" ou "falsa" ligada à peça. O manual fala em "peça trocada" e "dia em que foi trocada" de forma genérica, como nas rodadas anteriores.

Nada do repositório foi tocado.

## 1. Nota geral

**8,9 / 10. TODAS PASSARAM: oito critérios em 9,0 (mínimo 9,0) e a Prosa em 8,5 (mínimo 8,0).**

A revisão 13 fechou os cinco menores (a) que a rodada 10 recomendou:
- "chavinha" tem agora um sentido só;
- "Na mesma chave" na noite D;
- desgaste nas bordas no lugar de "brilha lisa" e "riscos do tempo";
- três frases de narrador cortadas;
- a fita do telão diz "peso e escrita errados".

Também fechou "gravada na pedra", no dicionário.

Entrou um desvio novo, da própria revisão 13. A imagem do minijogo da luz agora é a máscara 3D. Na luz mais forte, ela aparece granulada e pintada, com cara de pedra velha, e a legenda diz "O verniz brilha por igual, de ponta a ponta." É menor e fora da dedução: a pista é suspeita, não prova, e a tela não mente sobre nenhum fato. Mas é a contradição mais visível desta versão (ver O oculto e Consistência).

## 2. Tabela por critério

| Critério | Nota | Mínimo | Justificativa (uma linha) |
|---|---|---|---|
| Premissa, tema e pergunta de valor | **9,0** | 9,0 | Quem viu calou e só o caderno guarda: `aurelio_2` ("Era medo meu."), `v4_braga` ("Tive medo de perder o emprego"), `ivone_2` ("Devia ter perguntado por quê."). O Desligar tem preço por noite, e a pergunta do telão fica com a turma. |
| O oculto (motor do mistério) | **9,0** | 9,0 | A conta fecha: queda antes de 0:00, `traj_3` às 4:10, 50 s de `raio_contagem`, disparo às 5:00. A Dra. Sato só comenta o que ouve (`man_3`, `sato_teo`). A comparação agora casa com a peça fosca: "bordas inteiras, sem desgaste" (`foto_solo`, `coop_copia_ok`, Lado a Lado A). |
| Estrutura | **9,0** | 9,0 | Escada 232/27/9/9/4; nenhuma volta, tranca ou rótulo mudou. Nenhum título adianta virada ("Embaixo do medidor", "Inscrição na máscara", "A testa, de perto"). |
| Rodízio e regras do culpado (causas A–E) | **9,0** | 9,0 | "Embaixo do medidor" igual nas 5 noites. O texto só da noite D (`quadro_aberto`: "Na mesma chave, um segundo cadeado...") entra somado, com rótulo, custo e tranca iguais. Validador: Ouro nas 5. |
| Jogo limpo e dedução | **9,0** | 9,0 | A inscrição é limpa: tábua na volta 1, `insc_copia` na volta 2, e o símbolo virado não existe na tábua. A noite D ficou sem os dois nomes para o mesmo cabo. Menor novo: a imagem do minijogo da luz (`falsa_1`, `GAL_B_mascara`) mostra pedra granulada, e a legenda diz verniz por igual. |
| Personagens e fichas | **9,0** | 9,0 | 8 fichas completas. As falas batem com a ficha: `nico_1.porque` com tropeço, `aurelio_1` com "eu sei de cor, nunca mais li", Braga com "Tá." e café, Lenz com "rapidinho" e "Eu devolvo tudo que eu pego". A revisão 13 não mexeu em fala de personagem. |
| **Prosa** | **8,5** | **8,0** | Saíram "Vale pôr ao lado...", "O museu esqueceu. O chão guardou." e "O museu não guardou nada.". Ficam fechamentos de narrador: `conserto_D` ("Você refez o que o Téo desfez..."), `conserto_C` ("A máquina entende..."), `lenz_3` ("a um braço de distância"). Ficam também rótulos de formulário em loop-central.js ("MEIO CERTO", "Você não chutou", "Marcadas:", "Registrar revelação"). |
| Robustez por número de jogadores | **9,0** | 9,0 | Todo fato essencial tem de 2 a 10 fontes em salas. A prova da cópia tem 6. Nenhuma fonte depende de personagem ausente. Validador, sobre os mesmos dados: Ouro com 1, 2 e 3 pessoas nas 5 causas e 5 sementes. |
| Consistência do documento | **9,0** | 9,0 | Os dois desvios da rodada 10 fecharam ("chavinha", "gasto/entalhados"). ROTEIRO 19, DECISOES 13 e LOOP-CENTRAL 13 dizem o mesmo que os dados e o código. Ficam menores de arte e palavra: luz × imagem, rachadura invisível na peça 3D, "chuva fina" × tempestade. |

### Defeitos menores (não seguram nota sozinhos)

**(a)** = texto, dado ou imagem, corrigível já. **(b)** = só muda com decisão de regra do autor.

**O oculto / Jogo limpo**

1. **(a) Novo, da revisão 13: minijogo da luz.**
   - Onde: `LC_MG.falsa_1.luz`, com `img:'GAL_B_mascara'`.
   - Na posição certa da luz (captura `luz_achou_390`), a máscara aparece granulada, com pintas escuras e grão de pedra antiga. É justamente o que a resposta certa do "Antes de acender a luz" prevê ("Riscos, poeira e desgaste por toda parte").
   - A legenda diz o contrário: "O verniz brilha por igual, de ponta a ponta."
   - A DECISOES 13 manteve o brilho como "efeito de luz rasante". Com a imagem nova, a luz rasante não mostra brilho nenhum.
   - Não quebra nada: `falsa_1` é suspeita, as provas vêm de outras pistas e o resultado não depende de interpretar a imagem.
   - Duas saídas:
     - trocar a frase por algo que a imagem mostra, por exemplo "Nenhum risco de uso, nenhuma poeira nos cantos: o grão é igual de ponta a ponta, como de fôrma." (cerca de 15 palavras);
     - dar à imagem da posição certa um reflexo de verniz por igual.
2. **(a) Antigo, registrado como arte: a rachadura.**
   - O Lado a Lado A diz "rachadura do lado direito", e `foto_solo` diz "a rachadura está do outro lado".
   - Na peça 3D (`torre_gal_zoom`, `galeria_sala_390`) não se vê rachadura nenhuma.
   - Já está em DECISOES 13, "Não aplicado" (arte). Não muda a prova, que vem do texto.
3. **(a)** `insc_copia` diz "riscados à mão". Na peça 3D os símbolos são dourados e regulares, mais de entalhe que de risco. É de arte, coerente com "sulco dourado de traço novo" na DECISOES 11.

**Estrutura.**
- (b) Na volta 1, `data_3`, `v4_teo`, `c_esc_3`, `lenz_meio_1`, `motivo_1` e `c_esc_2` já deixam ler a troca, o esconderijo e o porquê.
- (b) A testa da máscara aparece desde a volta 1 (decisão do autor).
- Nada disso destrava prova, nome ou Revelar antes da hora. Está em "Ficou para decidir".

**Rodízio.**
- C e D têm sinal só deles (`c_anc_1`, `d_fus_1`), como antes.
- (b) `d_teo_2` não tem tranca.

**Jogo limpo** (antigos, "não aplicado" na DECISOES 13):
- (a) Na noite D, ver o cadeado com a porta aberta não conta como sinal: o sinal continua sendo `d_fus_2`.
- (a) `d_fus_2b` lê a letra na etiqueta molhada, enquanto `fh_vidro` diz que pela fresta não se leem as etiquetas. Segura-se: é reconhecer, não ler.

**Personagens.**
- (a) A ROTEIRO, parte 2, diz que Nico entrega a quem "já contou do Téo caído". A tranca pede `teo_1`, ter visto o Téo, não ter contado. É detalhe de palavra.

**Prosa.** Os itens da tabela, mais "Se saiu, foi por outra porta." (`coop_catraca_ok`, `catraca_solo`). Este último é aceitável, porque é a própria leitura das duas listas.

**Consistência:**
1. (a) Luz × imagem (item 1 acima).
2. (a) Rachadura sem arte (item 2 acima).
3. (a) **Chuva.** `LOOP_DESC.patio` diz "Dá para ouvir a chuva fina." Outros textos falam em tempestade: a estrada fechada pela tempestade, "Chuva feia, hein?" (`traj_aviso`), raio, céu carregado (`ceu`). É palavra: trocar "fina" por "forte" ou tirar o adjetivo (1 palavra).
4. Não conta como defeito: o cabeçalho da LOOP-CENTRAL ainda diz "quadro de energia" e "luvas e chavinha". É texto de projeto, e "chavinha" ali é a reserva do quadro, no sentido certo.

### Pedido de conferência: revisão 13

| Ponto | Resultado |
|---|---|
| "Chavinha" com um sentido só | **Fechado.** `a_cheia_4`, `fh_med_pot_bce` e `fh_med_pot_d` dizem "o interruptor do ponteiro de potência". "Chavinha" sobra só para a chave do cadeado (`quadro_0`, `quadro_aberto`, `acesso_1` a `acesso_3`, papel B do Raio, ROTEIRO 5 e 6). |
| Noite D, "Na mesma chave" | **Fechado.** O texto de base nomeia a chave do cabo do para-raios, e a frase da noite D continua nela. Bate com `d_fus_2` ("chave onde chega o cabo da Câmara"), com `man_pot_3` ("Para-raios → Câmara") e com a ROTEIRO, partes 5, 18 e 19. |
| Desgaste nas bordas × peça 3D | **Fechado no essencial.** A peça é cinza clara e fosca, de bordas lisas e inteiras: bate com Lado a Lado A ("pedra cinza, mais clara", "bordas inteiras, sem desgaste"). A foto (Lado a Lado B, minijogo da foto antiga) é "escura, fosca", com "desgaste nas bordas". A verdadeira tem símbolos "gastos pelo tempo". Sobra a rachadura, que não aparece (arte). |
| Frases de narrador cortadas | **Fechado.** `insc_verdadeira`, `chao_peca` e `mancha_2` ficaram só com o fato. |
| Fita do telão | **Coerente:** "verniz novo, peso e escrita errados". |
| Chuva ouvida; cadeira longe da bancada | **Coerente com as peças.** A cadeira tem pista própria (`teo_cadeira`). Menor: "chuva fina" × tempestade. |
| Dicas de minijogo | **Coerentes.** A da caixa aponta para a pista "A peça principal" sem dar a resposta. A da luz aponta para o Dicionário, que dá a idade. |
| Imagem da luz com a inscrição | **Contradiz a legenda** (menor novo; ver item 1). |
| Zoom do museu 3D na Galeria | A 5° os 6 símbolos se leem na testa, com o 5º virado (`torre_gal_zoom`). |
| Dicionário "Inscrição" | **Fechado:** "frase escrita na própria peça, com símbolos". |
| Planta (revisão 12) × pistas | **Coerente.** No Térreo, a porta de vidro do Ateliê dá para a Área de descanso. A Área de descanso tem a porta de serviço na parede de fora. As coleções dão para a Área de descanso. A Base da limpeza fica no caminho do hall e da escada do Subsolo (fala de Seu Dirceu às 4:05). |
| Contradição nova entre dados, ROTEIRO, FICHAS, DECISOES e LOOP-CENTRAL? | **Nenhuma entre os documentos.** A única nova é entre a tela (imagem da luz) e o texto da mesma tela. |

## 3. Abaixo do mínimo

**Nenhum critério abaixo do mínimo.** Lista (a) de obrigatórias: **vazia**.

### 3.1 Menores (a) que vale fechar (não são condição para passar)

1. **Minijogo da luz:** fazer a legenda `LC_MG.falsa_1.luz.achou` bater com a imagem `GAL_B_mascara`, ou a imagem bater com a legenda. Cerca de 15 palavras, ou uma imagem. É o item mais visível.
2. **"Chuva fina"** em `LOOP_DESC.patio` → "forte", ou sem adjetivo (1 palavra; gera de novo `sala/conteudo.js` e `salas-loop.json`).
3. **Rachadura:** quando a GAL_B for retocada, pôr a rachadura do lado direito. Se não, tirar "o lado da rachadura" das três telas da comparação (cerca de 10 palavras; a prova continua com cor e bordas).
4. **Prosa:** cortar "Você refez o que o Téo desfez, do jeito que ele pediu." (`conserto_D`) e "A máquina entende há quantos dias segurava a peça errada e solta." (`conserto_C`), deixando o gesto e o resultado (cerca de 25 palavras).
5. **ROTEIRO 2:** "já contou do Téo caído" → "já viu o Téo caído", junto do Nico (2 palavras).

### 3.2 Decisões de regra do autor ("Ficou para decidir"; nenhuma baixa nota)

Iguais às da rodada 10:
- a Dra. Sato e as voltas; o alarme das 2:40;
- "quem" e "por quê" quase inteiros na volta 1;
- piso de volta;
- Revelar só na volta 5;
- por que quem joga lembra;
- `d_teo_2` sem tranca e `man_cal_3`;
- "tábua" com dois sentidos;
- minijogo sem custo de erro.

## 4. Antes | agora | motivo

| Critério | Antes (rodada 10, rev. 11) | Agora (rev. 13) | Motivo |
|---|---|---|---|
| Premissa, tema e pergunta de valor | 9,0 | **9,0** | Sem mudança de enredo. |
| O oculto | 9,0 | **9,0** | Saíram "brilha lisa", "riscos do tempo" e "gravada na pedra". Entra a imagem da luz contra a legenda; a rachadura invisível continua. |
| Estrutura | 9,0 | **9,0** | Nenhuma volta, horário, tranca ou rótulo mudou (checklist da LOOP-CENTRAL 13). |
| Rodízio (causas A–E) | 9,0 | **9,0** | Noite D sem dois nomes para o mesmo cabo; rótulos iguais nas 5. |
| Jogo limpo e dedução | 9,0 | **9,0** | Fechou o cabo da noite D. Entra um menor fora da dedução (imagem da luz). |
| Personagens e fichas | 9,0 | **9,0** | Nenhuma fala mudou. |
| Prosa | 8,5 | **8,5** | Saíram três fechamentos de narrador. Ficam `conserto_C`, `conserto_D` e os rótulos de formulário, então a nota não sobe. |
| Robustez por número de jogadores | 9,0 | **9,0** | Validador sobre os mesmos dados: APROVADO, bot até 0,05%. |
| Consistência do documento | 9,0 | **9,0** | Os dois desvios de palavra fecharam. Entram luz × imagem e "chuva fina" (menores). |
| **Geral** | **8,9** (passou) | **8,9** (passou) | Nenhuma nota caiu por causa das correções técnicas. |

## 5. Fim do ciclo

**A escala da história (seção 1) passou: os 9 critérios estão no mínimo ou acima** (oito em 9,0, Prosa em 8,5). Lista de obrigatórias (a): vazia.

Recomendação honesta: fechar o item 1 de 3.1 (legenda da luz × imagem). Foi a única contradição que a própria revisão 13 criou, e fica na tela que pede "veja o que a peça mostra de verdade".
