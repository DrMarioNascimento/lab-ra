# Loop · Rodada 9 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliação feita do zero sobre capturas novas da revisão 10 (commit `56ad1de`, lote 9: inscrição da máscara; e `bea5fd0`, lote 8: Q01 e D10 novos). Nenhum arquivo do repositório foi alterado (`git status` limpo).

**Nota geral:** Parte A com 8 de 9 critérios no mínimo (média 9,0; antes 8,8). Os critérios 2 e 7 voltam a 9, porque o seletor da entrada com código é decisão do autor. O critério 5 cai para 8, e o motivo são 3 problemas de celular nas telas novas da escrita antiga. Parte B com 14 de 15 salas aprovadas (antes 13). Q01 e D10 passam, mas a Galeria passa a reprovar: a máscara 3D não tem os seis símbolos na testa que as pistas novas descrevem. As escalas ainda **não** passaram. O critério 5 se resolve só com CSS. A Galeria se resolve com uma composição por script, usando os glifos que já existem.

## Fontes (tudo em `/tmp/roda/esc/r9/`)
- `visB/`: 17 telas do `vis3.mjs`.
- `pwB/`: cópia de `r8/pwB` com os caminhos trocados para r9. Rodei de novo `auditA`, `auditB`, `cap`, `tl40`, `fita_pwB`, `tlB`, `torre15`, `torre15_360`, `miss8` e `fins`, com os registros `.log` ao lado. O `torre15` e o `torre15_360` estouraram o tempo na primeira vez, quando rodaram em paralelo com outros testes; sozinhos, deram 0 falha.
- `visB_extra/`: entrada, manual, mapa, salas, lista, Máquina, caderno, pausa, final, resultado, professor, participante e `c_join_*` / `c_conduzir` / `c_telao_gate`, nas duas larguras.
- `capB/`: minijogos, gravador, livro, provas, caderno. `tlB/` e `fitaB/`: telão em 1280 e 1920, com 12 e 40 nomes, "A noite" com 3, 7, 9 e 10 fatos e "Missões" com 8 missões. `simB/`: simulador.
- `insc/`: o teste da revisão 10 (`r10/insc.mjs`, copiado para `scr/`) tocado de verdade: tábua no livro, minijogo dos símbolos (com um erro e um acerto), Revelar e caderno, em 390 e 360. Deu 30 de 30 ok.
- `torreB/` e `torreB360/`: museu 3D, as 15 salas.
- `pecas/peca_*.png`: as 15 peças na sala (390×844, 2x). `angulos/`: as 8 peças de canto e as novas de 4 ângulos, mais `zoom_Q01`, `zoom_D10` e `zoom_GAL_B` de perto.
- `scr/`: scripts novos ou adaptados: `ll.mjs` (caixa de leitura do livro), `mgest.mjs` (medidas do minijogo dos símbolos), `zoom.mjs`, `stats.mjs`, `ang.mjs`, `pecas.mjs` (agora com as 15 salas), `join.mjs` e `gate.mjs`. Os registros estão em `scr/*.log`.

Limites: o Chrome renderiza por software e nenhum aparelho real foi usado. A tela cheia de verdade não abre sem janela; conferi só o botão e a API. Não abri a RA.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

| # | Critério | Antes (r8) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Fichas da tábua, faixa de pedra e botões de resposta com sombra dura (`0 4px 0`) e afundar |
| 2 | Ícones | 8 | **9** | sim | O seletor 👨 👩 👥 é decisão do autor. Os glifos são legíveis a 44 px, num estilo único. Fora isso, só ✕ e 🔒 de apoio |
| 3 | Muito visual | 9 | **9** | sim | Tábua e faixa desenhadas no livro, no caderno e no minijogo. "Missões" do telão agora tem o envelope |
| 4 | Paleta coerente | 9 | **9** | sim | Glifos em latão (#e7b975) sobre pedra cinza-esverdeada, no tom da máscara e do jogo |
| 5 | Celular | 9 | **8** | **não** | Telas novas: rótulos da tábua com 11,2 e 10,9 px; minijogo que rola 70 e 127 px; tábua escondida numa caixa de 166 px no livro |
| 6 | Estabilidade | 9 | **9** | sim | Minijogo dos símbolos: 0 px de pulo ao errar (o aviso tem lugar reservado). Livro, gravador, Máquina e relógio iguais |
| 7 | Linguagem | 8 | **9** | sim | A entrada com código é decisão do autor. Textos novos em 2ª pessoa e curtos ("Um deles não bate. Qual?") |
| 8 | Telão | 9 | **9** | sim | 0 linha cortada em "A noite" (12 e 40 nomes; 3 a 10 fatos; 1280 e 1920); "Missões" com ícone |
| 9 | Entrada | 9 | **9** | sim | Tela-padrão inteira; em 360×740 "Jogar sem turma" agora termina acima da dobra |

**8 de 9 atingem 9. Média 9,0.**

### 1 · Profundidade 3D: 9
O que é novo também tem volume. As 12 fichas da tábua têm fundo de pedra, brilho em cima e sombra embaixo. A faixa "Na testa da máscara" é uma placa de pedra com sombra. Os 4 botões de resposta (60 px de altura) têm sombra dura de 4 px. O resto continua como na rodada 8: abas da Máquina, cartões do mapa, pistas, faixas do gravador, linhas da fita, botões do museu 3D.

### 2 · Ícones: 9
- O seletor da entrada com código não conta, por decisão do autor.
- Censo de emoji (`auditA` e `auditB`, 54 telas): nas telas de jogo sobram só ✕ (fechar) e 🔒 (apoio ao lado de texto). As fichas `.ic3d` usam imagem em 100% dos casos (de 4 a 22 por tela, nenhuma com emoji).
- **Glifos da escrita antiga (conteúdo de pista):** 12 símbolos de traço único em latão, desenhados a 44×44 px nos três lugares (livro, caderno e minijogo). Todos são legíveis no tamanho real. Os pares parecidos de propósito (ver/dizer, ir/voltar) se distinguem bem. O 5º símbolo espelhado ("guardar" virado) se nota quando se compara com a tábua, e é esse o desafio. O estilo é o mesmo nos 12, e casa com o latão dos ícones 3D. O traço tem contorno escuro, que garante contraste sobre a pedra.
- Retoques (não reprovam): o 📺 de apoio na linha "Telão conectado" do Professor; a energia de 18 px na lista (o raio some; 22 px resolve).

### 3 · Muito visual: 9
- A pista "Tábua da escrita antiga" vem desenhada: são 12 fichas com a palavra embaixo, e não só texto. A inscrição aparece no caderno como placa de pedra.
- A página "Missões" do telão agora tem o envelope com lacre em cada missão (`fitaB/missoes8_40_1280.png`). Era retoque da rodada 8.
- O minijogo "Abrir a caixa de banners" mostra a D10 nova, com a poça de tinta.
- Retoque: no livro da Conservação, depois de ler as duas páginas, sobra um vão escuro de 118 px entre o livro e a caixa de leitura (`insc/390x844_1_livro_tabua.png`). É o lugar reservado dos botões "Ler", que somem. No telão, a etiqueta de contagem ainda cobre a ponta de algumas miniaturas do mapa (Fotografia, Sons).

### 4 · Paleta coerente: 9
A pedra das fichas é um cinza-esverdeado escuro, e os glifos são latão. Fica no tom da máscara e do ouro do jogo. Janelas, botões e o roxo do Professor continuam iguais. Sobram o piso bege e as paredes azul-acinzentadas do museu 3D (igual à rodada 8). Detalhe: os rótulos da tábua usam `system-ui` (`bancada.css` linha 122), e o resto do jogo usa a fonte do jogo. No iPhone vira SF, que é parecida, mas não é a mesma.

### 5 · Celular: 8 (reprova)
Fora das telas novas, está tudo como antes. Medido em 390×844 e 360×740:
- 0 estouro de largura em todas as telas e nas 15 salas.
- 0 alvo abaixo de 44 px; as caixas de 28 px ficam dentro de rótulos de 318×88 e 288×88.
- Pontos da peça: 0 par a menos de 44 px nas 15 salas (menor distância de 47 a 69 px) e 0 fora da caixa.
- Letra mínima de 12 px nas telas antigas.

**O que reprova (só nas telas da escrita antiga, revisão 10):**
1. **Rótulos da tábua abaixo de 12 px.** No minijogo, as palavras embaixo dos 12 símbolos têm 11,2 px em 390 e 10,9 px em 360 (`bancada.css` linhas 125 e 134: `.7rem` e `.68rem`). No caderno, em 360, também ficam com 10,9 px. Não é enfeite: é o dicionário que o jogador precisa ler para resolver.
2. **O minijogo não cabe na tela.** A janela tem 743 px de altura útil em 390 e 651 px em 360, e o conteúdo tem 811 e 776 px. "Pedir uma pista" e "Voltar à sala" ficam 70 px (390) e 127 px (360) abaixo da borda (`scr/mgest.log`). Os outros minijogos rolam de 0 a 4 px. As 4 respostas cabem sem rolar.
3. **A tábua some dentro do livro.** A caixa de leitura embaixo do livro tem altura fixa de 166 px, e o texto mais a tábua ocupam 465 px (482 em 360). A tábua começa abaixo da borda da caixa, o texto é cortado no meio da linha, e não há sombra nem seta dizendo que dá para rolar (`scr/ll.log`, `insc/*_1_livro_tabua.png`). Ao mesmo tempo, os 118 px vazios logo acima (item 3) estão sobrando.

**Corrigível com CSS/JS: sim, tudo.**
- Rótulos: subir para `.75rem` (12 px). Cabe: em 360 a ficha mais apertada, "guardar", tem cerca de 46 px de largura. Ou trocar a grade do minijogo de 6 para 4 colunas, como no caderno.
- Minijogo: no minijogo dos símbolos, tirar a miniatura do topo (cerca de 100 px) ou trocar por uma faixa pequena, e juntar "Pedir uma pista" e "Voltar à sala" numa linha fixa no pé da janela (`position:sticky; bottom:0`).
- Livro: quando a página lida tem glifos, dar à caixa de leitura a altura do vão dos botões que sumiram (166 + 118 = 284 px). Ou pôr uma sombra no pé da caixa, como sinal de que rola. Dá para fazer isso sem mexer na estabilidade, porque a altura total continua a mesma.

Retoques que já vinham: o relógio de exemplo do manual (passo 3, 9,9 px); a parede de ferramentas da Oficina técnica passa por cima do título no museu 3D. Resolvido desde a rodada 8: "Jogar sem turma" em 360×740 agora termina acima da dobra (`visB_extra/a01_entrada_360.png`).

### 6 · Estabilidade: 9
- Minijogo dos símbolos: janela, respostas, aviso e botões com a mesma posição antes e depois de errar (51:743 / 596:128 / 730:47 / 788:48 em 390; 44:651 / 559:128 / 691:47 / 749:48 em 360). O aviso "Ainda não fechou..." já tem o lugar reservado.
- Livro: caixa de leitura com 166 px fixos ao trocar entre esquerda e direita. Gravador com 853/534/172 px nas 4 leituras. Máquina com a ficha de estado em 250:112 e 236:112 nas 4 abas. Relógio com 138×62.
- Telão com 40 nomes: 0 estouro em todas as páginas (1280 e 1920).

### 7 · Linguagem: 9
- A entrada com código ("Como quer ser chamado", "Bem-vindo / Bem-vinda / Tanto faz") não conta, por decisão do autor.
- Textos novos: "Confira cada símbolo da máscara com a tábua do livro de registro. Um deles não bate. Qual?", "Ainda não fechou. Olhe de novo o que está na tela e no seu caderno.", "Do seu caderno: a tábua do livro de registro". Estão em 2ª pessoa, curtos e sem gênero.
- Retoque: sobra "Obrigado por participar!" na tela de aula encerrada do participante (`sala/sala-mestre.mjs` linha 281) e do telão (`sala/telao/telao.mjs` linha 209). Marca o gênero de quem fala, não de quem lê; "Valeu por participar!" resolve.
- Coerência: `museu/torre/salas-loop.json` agora bate com `LOOP_DESC` nas 15 salas (conferido por script). Na rodada 8, duas salas estavam diferentes.

### 8 · Telão: 9
- Páginas por tema: 4 durante a volta, 2 no fim, 5 no resultado. Tela cheia sempre à vista, com a API ligada.
- "A noite": 0 linha cortada com 12 e 40 nomes e com 3, 7, 9 e 10 fatos, em 1280 e 1920 (`fita_pwB.log`: `maxCortePx 0`). A ficha "3 fatos ficaram no escuro" mostra a moldura com "?".
- "Missões": 8 missões com envelope, com 12 e 40 nomes, 0 estouro (`miss8.log`).
- Retoque igual ao da rodada 8: no simulador, o telão ocupa 745×419 fixos (58% da largura em 1280).

### 9 · Entrada: 9
"Participar com código", botão roxo com cadeado e "Só o Professor tem a chave", "Abrir telão" e "Simulador" com ícone 3D, e "Jogar sem turma". Em 360×740 a tela compacta cabe inteira, e "Jogar sem turma" termina em cerca de y = 680. Os 7 endereços respondem 200 (`tlB.log`).

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou desde a rodada 8:**
- Q01 novo: porta fechada, cadeado vermelho na trava, 30 mil triângulos, 440 KB.
- D10 novo: poça de tinta, pote virado, meia pegada e marcas de mão na coluna; 36 mil triângulos, 428 KB.
- Miniaturas refeitas com margem (de 10 a 26 px de folga em 160 px).
- Giro limitado a ±75° nas 5 peças de canto (`PECA_CANTO` em `game.js` linha 650).
- `escala-pecas.json` com Q01 a 2,3 m e D10 a 2,1 m (o modelo mede 2,30 e 2,10 m; bate).
- Revisão 10: a inscrição na testa da máscara virou uma das provas ("O que foi feito").

| Sala | Peça (KB) | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (840) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (157) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (821) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (420) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 (866) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 (233) + livro com a tábua | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Sala dos relógios | REL_B (617) | 9 | 9 | 9 | 9 | 8 | 8 | 8 | 8 | 9 | **PASSA** | passa |
| Área de descanso | DESC_B (266) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | **PASSA** | passa |
| Base da limpeza | L08 (636) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala dos sons | N17 (327) + gravador | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Sala da fotografia | N18 (294) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Pátio · Quadro externo | Q01 (440) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 9 | **PASSA** | reprovava (Pert. 8, Seg. 8) |
| Sala das coleções | D10 (428) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | **PASSA** | reprovava (Pert. 8) |
| Galeria especial | GAL_B (722) | **8** | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **reprova** (Pert.) | passava |

**Passam 14 de 15. Reprova 1.**

### O que vi nas peças que mudaram (sala 390×844, museu 3D, 4 ângulos e de perto)

| Sala | O que a peça mostra | Bate com LOOP_DESC e com as pistas? |
|---|---|---|
| Pátio (Q01) | Pilar de tijolo com musgo. Quadro cinza de **porta fechada**, com cadeado vermelho na trava, adesivo amarelo e papel branco colados. Medidor redondo de ponteiro na parede ao lado. Cabo preto desce do para-raios de cobre e entra no topo do quadro | Sim: "porta fechada, presa pelo cadeado da trava" (`quadro_0`), "adesivo amarelo na porta" (`a_falsa_2x`, `fh_etq_chave`), "papel branco colado" (`iso_aviso`), "medidor redondo na parede ao lado" (`a_cheia_2`), "cabo grosso desce pela parede e entra no topo" (`man_pot_3`), "para-raios em cima". As chaves já não aparecem antes da hora. O que era a contradição da rodada 8 sumiu |
| Coleções (D10) | Estante de aço com 11 caixas etiquetadas (uma com adesivo azul), caixote de lâmpadas, caixa aberta tombada, tubo de banner, **pote de tinta virado com poça vermelha**, borrões de sola saindo da poça, marcas de mão arrastada na coluna da estante, um botão escuro no piso | Muito: "mancha vermelha no chão" (LOOP_DESC, `mancha`), "pote de tinta vermelha virado" (`teo_1`), "meia pegada saindo dela" (`mancha`, `lenz_3`), "pó arrastado por mão espalmada" (`empurra_2`), "caixote de lâmpadas" (`dis_lampadas`), "adesivo do patrocinador" (`c_esc_1`), "botão no chão" (`empurra_1`) |
| Galeria (GAL_B) | Máscara de pedra num pedestal de madeira com plaqueta e gaveta, vitrine vazia, quadro torto, rastro branco no piso. **A testa da máscara é lisa** (`angulos/zoom_GAL_B.png`) | Bate com quadro, gesso e base. **Não bate** com a inscrição da revisão 10 |

### Por que a Galeria reprova agora

**Galeria · GAL_B: Pertencimento 8.**
Na revisão 10, a inscrição na testa da máscara passou a ser a prova "O que foi feito". A pista `insc_copia` diz "Na testa da máscara, seis símbolos". O texto de bloqueio dela diz "Na testa da máscara há uma fileira de símbolos". O minijogo se chama "Olhe de perto". No modelo, a testa é pedra lisa, sem nenhum risco. A peça deixa aproximar até 12° de campo de visão (`min-field-of-view="12deg"`, `game.js` linha 722), e o museu 3D e o "Ver no ambiente" também deixam chegar perto. Quem aproxima a câmera "para conferir a inscrição" não acha nada. A peça contradiz a pista central que é dela.
- **Sem arte nova (provisório bom):** compor por script, como já se faz com a GAL_B em `museu/pecas-compostas.mjs`. Os 6 glifos já existem em `museu/icones/ui/glifos.svg`: rasterizar a faixa da cópia (com o 5º espelhado) numa textura e aplicá-la como placa fina e curva na testa da V11, em baixo-relevo escuro. Assim a peça mostra exatamente o que o minijogo desenha. A miniatura do topo do minijogo pode passar a usar esse render.
- **Com arte nova (o certo):** uma variação da V11 com a fileira de seis símbolos entalhada na testa.
- **Só texto não resolve bem:** dizer que os símbolos "só aparecem com luz rasante" ainda deixa a testa lisa na aproximação.

### Observações que não reprovam
- **Q01:** não há chuva na peça, mas a frase da sala começa com "Chove." (Ambiente 8). A pista `a_cheia_4` fala de "barra cheia" num "medidor de potência", e o único medidor do modelo é redondo, de ponteiro (texto: "o ponteiro vai até o fim"). Faltam a luva isolante no chão (`chao_manopla`, volta 2 em diante, cooperação) e o giz na parede (`fh_disjx`); são secundários. As costas são tijolo liso; ninguém espera nada atrás de um pilar.
- **D10:** de costas mostra só a parede cinza lisa, e **não** está em `PECA_CANTO`, então gira 360°. Só JS: incluir `D10:1` (`game.js` linha 650). O Téo caído não está na peça, como Aurélio e Seu Dirceu também não estão nas deles; os personagens ficam no texto.
- **Giro limitado:** N18, N17, DESC_B, REL_B e GAL_B param em ±75°, e quem gira não cai mais na parede vazia.
- **Peso:** GAL_B (722), L08 (636) e REL_B (617) ainda passam da meta de 600 KB. T01, S01, M03 e L06 (820 a 870 KB) são maiores ainda. Todas abrem.
- **Animação e apagão:** nenhuma peça tem animação usada nem reage ao apagão (Dinâmica e Persistência ficam como estavam).
- **Oficina técnica:** "um armário travado e a cadeira vazia do Téo" (LOOP_DESC); a M03 é a bancada vermelha de ferramentas, sem cadeira. Fica igual às rodadas anteriores (Pert. 9), mas é o próximo da fila se o padrão subir.
- **Museu 3D:** as 15 salas com a peça centrada e acima do cartão, nas duas larguras (0 falha). Os textos dos cartões batem com o jogo.

---

## Resumo do que falta

| Item | Só CSS/JS/texto | Depende de arte ou modelo novo |
|---|---|---|
| A5 Celular (8) | **Sim, tudo:** rótulos da tábua ≥ 12 px (`bancada.css` linhas 125 e 134); minijogo dos símbolos sem a miniatura do topo e com os botões fixos no pé; caixa de leitura do livro com a altura do vão vazio (284 px) ou com sinal de rolagem | Não |
| B · Galeria GAL_B (Pert. 8) | Provisório bom: compor a faixa dos 6 glifos (com o 5º espelhado) na testa da V11 por script (`pecas-compostas.mjs` + `glifos.svg`) | **O certo:** V11 com a inscrição entalhada na testa |

Retoques sem reprovação: D10 em `PECA_CANTO`; "Chove." com Q01 sem chuva, e "barra" com medidor de ponteiro (texto); rótulos da tábua na fonte do jogo, e não em `system-ui`; "Obrigado" → "Valeu"; energia de 18 → 22 px; contagem do mapa do telão por cima das miniaturas; parede de ferramentas da Oficina técnica por cima do título no museu 3D; telão do simulador com largura fixa.

**Fim do ciclo:** as escalas **não** passaram. Falta 1 critério da Parte A (5, só CSS) e 1 peça da Parte B (Galeria: composição por script ou arte nova).
