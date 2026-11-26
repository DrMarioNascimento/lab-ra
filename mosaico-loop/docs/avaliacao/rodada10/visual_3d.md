# Loop · Rodada 10 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 26/11/2026. Avaliei do zero, com capturas novas da revisão 11 (commit `5826fd0`, lote 10: inscrição gravada na testa da máscara 3D, tábua e minijogo ajustados para celular, medidor único no Pátio). Não alterei nenhum arquivo do repositório.

**Nota geral:** na Parte A, os 9 critérios estão no mínimo (média 9,0; antes 9,0 com o critério 5 em 8). Na Parte B, as 15 salas passam (antes 14). Considerando só visual e peças 3D, as duas escalas desta avaliação **passaram nesta rodada**. Isso é uma rodada limpa, não o fim da contagem: pela regra do autor, ainda faltam rodadas limpas seguidas.

## Fontes (tudo em `/tmp/roda/esc/r10/`)
- `visB/`: as 17 telas do `vis3.mjs`, todas olhadas.
- `pwB/`: cópia de `r9/pwB` com os caminhos trocados para r10. Rodei de novo `auditA`, `auditB`, `cap`, `tl40`, `tlB`, `fita_pwB`, `miss8`, `fins`, `torre15` e `torre15_360`, cada um com o registro `.log` ao lado. Na primeira vez, o `torre15` e o `torre15_360` estouraram o tempo porque rodaram junto com outros testes. Sozinhos, deram 15 salas e 0 falha nas duas larguras.
- `scr/`: `mgest` (medidas do minijogo dos símbolos), `ll` e `ll2` (caixa de leitura do livro e rótulos da tábua), `insc` (30 de 30 ok, tocado de verdade), `join`, `gate`, `stats`, `pecas` (15 salas), `ang`, `torre_testa` e `torre_testa2` (museu 3D de perto). A testa no jogo usa `r11/gal/testa_jogo.mjs`, com saída em `gal/`.
- `visB_extra/`, `capB/`, `insc/`, `fitaB/`, `tlB/`, `simB/`, `torre/`, `torreB360/`, `pecas/`, `angulos/` e `gal/`. Folhas de contato: `folha_pecas.png`, `folha_cap.png`, `folha_extra.png` e `cmp_galeria.png`.
- Efeito colateral: o `tl40.mjs` grava por padrão em `/tmp/roda/r6/`. Lá ele regravou as próprias capturas `tl40_*.png`, que copiei para `tlB/`. Fora isso, só escrevi em r10.

Limites: o Chrome renderiza por software e nenhum aparelho real foi usado. A tela cheia não abre sem janela; conferi só o botão e a API. Não abri a RA.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

| # | Critério | Antes (r9) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Fichas da tábua, faixa de pedra, respostas e botões com sombra dura e afundar; nada novo chapado |
| 2 | Ícones | 9 | **9** | sim | Censo de emoji (54 telas): só ✕ e 🔒 de apoio. Fichas `.ic3d` 100% imagem. Glifos são conteúdo de pista |
| 3 | Muito visual | 9 | **9** | sim | O vão escuro do livro sumiu: a tábua 6×2 aparece inteira. A contagem do mapa do telão não cobre mais as miniaturas |
| 4 | Paleta coerente | 9 | **9** | sim | Rótulos da tábua agora na serifa do jogo (Georgia), não mais `system-ui`. Latão sobre pedra igual nos 3 lugares |
| 5 | Celular | 8 | **9** | sim | Os 3 problemas da r9 se resolveram: rótulos com 12 a 12,8 px, minijogo sem rolar (390 e 360), tábua inteira no livro sem rolar |
| 6 | Estabilidade | 9 | **9** | sim | Minijogo com 0 px de pulo ao errar. Caixa do livro fixa em 316 px. Máquina 236:112 nas 4 abas |
| 7 | Linguagem | 9 | **9** | sim | "A tábua, do seu caderno", "Um deles não bate. Qual?": 2ª pessoa, curto, sem gênero |
| 8 | Telão | 9 | **9** | sim | 0 linha cortada em "A noite" (3 a 10 fatos; 12 e 40 nomes; 1280 e 1920). "Missões" 8×40 sem estouro. Mapa com contagem fora da miniatura |
| 9 | Entrada | 9 | **9** | sim | Tela-padrão inteira. Em 360×740 "Jogar sem turma" termina em y = 680. Os 7 endereços respondem 200 |

**9 de 9 atingem 9. Média 9,0.**

### 1 · Profundidade 3D: 9
Os botões "Nº símbolo" (52 px) têm brilho em cima e sombra de 4 px (`0 1px 0 inset` + `0 4px 0`). As fichas da tábua são pedra com volume. A faixa "Na testa da máscara" é uma placa. As abas da Máquina, os cartões do mapa, as faixas do gravador e os botões do museu 3D continuam iguais à rodada 9.

### 2 · Ícones: 9
- O seletor da entrada com código e os glifos não contam, por decisão do autor.
- `auditA` e `auditB`: em 54 telas, as de jogo só têm ✕ (fechar) e 🔒 (apoio ao lado de texto). Não sobra nenhum glifo de interface chapado.
- A miniatura da GAL_B foi refeita (`museu/icones/GAL_B.webp`). Em 160 px a inscrição não aparece, o que é esperado nesse tamanho.
- Retoque que já vinha: 📺 de apoio na linha "Telão conectado" do Professor.

### 3 · Muito visual: 9
- Livro da Conservação: depois de ler, a caixa de leitura ganha a classe `grande` (316 px), ocupando o vão que sobrava, e a tábua aparece em 6×2 logo embaixo do texto (`insc/*_1_livro_tabua.png`).
- Telão, mapa: a contagem fica no canto e a miniatura desce (`tlB/tl40_jogando_1_1280.png`). Era o retoque da r8 e da r9.
- Novo retoque: na sala da Galeria (390×844), a peça ficou baixa na caixa, com cerca de 100 px vazios em cima (`cmp_galeria.png`). O motivo é o `camera-target` novo, na altura da máscara. Não reprova; um alvo na metade da altura, ou o raio um pouco maior, centraliza.

### 4 · Paleta coerente: 9
A pedra das fichas é cinza-esverdeada, os glifos são latão e o roxo do Professor continua igual. Os rótulos da tábua agora usam Georgia, que é a serifa dos títulos do jogo; o detalhe da r9 está resolvido. Sobram o piso bege e as paredes azul-acinzentadas do museu 3D (igual às rodadas anteriores).

### 5 · Celular: 9 (antes 8)
Medido em 390×844 e 360×740:
- **Rótulos da tábua:** 12,8 px em 390 e 12 px em 360, no minijogo, no livro e no caderno (`scr/ll2.log`, `scr/mgest.log` letraMin 12).
- **Minijogo dos símbolos:** a janela mede 670 px e o conteúdo 668 px em 390 (650 e 648 em 360). Não rola. "Pedir uma pista" e "Voltar à sala" ficam em y 681 e y 622, dentro da tela. A miniatura do topo saiu.
- **Livro:** a caixa de leitura tem 316 px e o conteúdo também 316 px. A tábua inteira cabe sem rolar nas duas larguras.
- 0 estouro de largura nas telas e nas 15 salas. 0 alvo abaixo de 44 px (as caixas de 28 px ficam dentro de rótulos de 318×88). Pontos da peça: 0 par a menos de 44 px (menor distância de 47 a 72 px) e 0 fora da caixa (`scr/pecas.log`, `pwB/auditA.log`).
- Retoques (não reprovam): no livro em 360, o rótulo "guardar" tem 35 px numa ficha de 39 px e encosta na borda direita (`ll2.log` marca FORA por menos de 1 px de folga). Basta `letter-spacing:-.02em` ou `.72rem` só nele. O relógio de exemplo do manual (passo 3) segue com 9,9 px. A Galeria baixa na caixa (item 3).

### 6 · Estabilidade: 9
Minijogo dos símbolos antes e depois de errar: janela 87:670, respostas 505:112, aviso 622:47, botões 681:48 em 390; em 360, 45:650 / 448:112 / 564:47 / 622:48. São idênticos, porque o aviso já tem lugar reservado. O livro fica com 316 px fixos ao trocar entre esquerda e direita. Máquina com 236:112 e janela 48:644 nas 4 abas. Telão com 40 nomes sem estouro.

### 7 · Linguagem: 9
Textos novos e alterados: "A tábua, do seu caderno", "Nº símbolo", "Chuva fina na pedra molhada.", "O medidor do quadro". São curtos e sem marca de gênero. "Obrigado por participar!" é padrão dos jogos de sala e não conta.

### 8 · Telão: 9
4 páginas na volta, 2 no fim e 5 no resultado, com "Tela cheia" sempre à vista. `fita_pwB`: `maxCortePx 0` em todos os casos. `miss8`: 8 missões, 0 falha. `tl40`: "paginas com estouro: 0". Retoque igual: no simulador, o telão ocupa 745×419 fixos (58% da largura em 1280; 39% em 1920).

### 9 · Entrada: 9
"Participar com código", botão roxo com cadeado e "Só o Professor tem a chave", "Abrir telão" e "Simulador" com ícone 3D, e "Jogar sem turma" (324×52, termina em y = 680 em 360×740).

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou desde a rodada 9:** a GAL_B ganhou a inscrição de 6 símbolos na testa da V11 (`pecas-compostas.mjs`, 797 KB) e passou a aproximar até 5° de campo de visão, com o alvo na testa (`PECA_PERTO`, `game.js` linha 655). O ponto do "quadro torto" saiu da testa e foi para o quadro. A D10 entrou em `PECA_CANTO` (±75°). O Pátio agora começa com "Chuva fina na pedra molhada." e tem um medidor só (redondo, de ponteiro) nas pistas.

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
| Pátio · Quadro externo | Q01 (440) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 9 | **PASSA** | passa |
| Sala das coleções | D10 (428) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | **PASSA** | passa |
| Galeria especial | GAL_B (797) | **9** | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **PASSA** | reprovava (Pert. 8) |

**Passam 15 de 15.**

### Galeria (GAL_B): a testa de perto
- **Na sala (390×844 e 360×740, `gal/testa_*`):** no zoom máximo (5°, ou 5,5° em 360) os seis símbolos se leem um a um, cada um com cerca de 15 px de tela. São máscara-rosto, pedra, olho, lua, o C virado e a ampulheta, na mesma ordem e com o mesmo desenho da faixa do minijogo. **O 5º espelhado se distingue** do "guardar" da tábua. Em 12° a fileira aparece, mas pequena (cerca de 7 px por símbolo); por isso o zoom foi a 5°. De lado (40°) a inscrição acompanha a curva da testa sem se deformar. O alvo da câmera já começa na testa, então não precisa arrastar.
- **Parece entalhe?** Em parte. O traço tem a cor do latão, com uma borda escura deslocada, e lê como risco preenchido (incisão com douração) mais do que como sulco fundo na pedra (`gal/crop_testa.png`). Para a cópia isso funciona: a pista diz "riscados à mão, de traço novo", e o contraste com "gastos pelo tempo" da verdadeira fica bom. Um entalhe de verdade (sulco escuro, sem cor) seria mais fiel a "pedra"; é melhoria, não reprovação.
- **Bate com as pistas:** `insc_copia` ("seis símbolos riscados à mão, de traço novo... o quinto está virado") bate. O texto de bloqueio ("há uma fileira de símbolos") também. O ponto da inscrição agora fica na testa e o do quadro torto, no quadro: a contradição da r9 sumiu.
- **Museu 3D (`gal/torre_zoom_*`):** na aproximação máxima (`OC.minDistance` 0,12), a fileira aparece na testa, mas cada símbolo tem cerca de 7 px, e não dá para identificar o 5º. Não reprova, porque o museu 3D é passeio e quem joga lê na sala. Retoque só de JS: deixar a câmera chegar mais perto na Galeria (`minDistance` próximo de 0,05).
- **Retoques:** o minijogo "Olhar a peça com luz de lado" (`falsa_1`, `luz.img:'V11'`, `loop-central.js` linha 686) usa a imagem da V11 **sem** a inscrição, ou seja, a máscara do minijogo tem a testa lisa. Dá para resolver sem arte nova: renderizar a GAL_B composta (testa com glifos) e usar essa imagem. A peça ficou baixa na caixa da sala (ver A3). O peso subiu para 797 KB, acima da meta de 600 (Viab. 8, como antes).

### Outras peças
- **D10:** agora para em ±75°; quem gira não cai mais na parede cinza do fundo. Continua batendo com a poça, o pote virado, a meia pegada, a mão espalmada, o caixote, o adesivo e o botão no chão.
- **Q01:** a pista "barra cheia" virou "medidor redondo", que bate com o modelo. O texto "Chuva fina na pedra molhada." combina com a base de pedra, mas o piso do modelo parece seco e não tem chuva (Ambiente 8, como antes). Seguem faltando a luva no chão e o giz na parede (secundários).
- **Oficina técnica:** LOOP_DESC diz "a cadeira vazia do Téo", e a M03 não tem cadeira (igual às rodadas anteriores). É o próximo da fila se o padrão subir. O título no museu 3D agora fica numa plaqueta e não some mais contra a parede de ferramentas.
- **Museu 3D:** 15 salas com a peça centrada e acima do cartão, nas duas larguras (0 falha).
- **Animação e apagão:** nenhuma peça tem animação usada nem reage ao apagão (Dinâmica e Persistência ficam como estavam).
- **Peso:** T01, S01, M03, L06 e GAL_B ficam entre 797 e 890 KB; L08 e REL_B, entre 600 e 650 KB. Todas abrem.

---

## Resumo do que falta

Nenhum critério ficou abaixo do mínimo. Retoques que não reprovam, separados pelo tipo de correção:

| Retoque | Só CSS/JS/texto | Depende de arte ou render |
|---|---|---|
| Galeria baixa na caixa da sala (cerca de 100 px vazios em cima) | `camera-target` ou raio do `PECA_PERTO` | — |
| Museu 3D não lê a inscrição (cerca de 7 px por símbolo) | `OC.minDistance` menor na Galeria | — |
| Minijogo "luz de lado" com a máscara de testa lisa | — | Render da GAL_B composta (por script, sem arte nova) |
| Inscrição com cara de douração, não de sulco | — | Variação da textura (normal mais funda e cor escura) |
| "guardar" encostando na ficha do livro em 360 | `letter-spacing` ou `.72rem` nesse rótulo | — |
| Relógio do manual com 9,9 px; telão do simulador com largura fixa; 📺 do Professor | CSS | — |
| Q01 sem chuva ou pedra molhada; M03 sem a cadeira do Téo | Texto (LOOP_DESC) | Ou arte nova |

**Fim do ciclo desta avaliação:** as escalas de visual e de peças 3D **passaram nesta rodada** (A: 9 de 9 no mínimo; B: 15 de 15). Pela regra das rodadas limpas, esta conta como uma rodada limpa, e a contagem continua.
