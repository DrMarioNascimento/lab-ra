# Loop · Rodada 7 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas da revisão 7. Nenhum arquivo do repositório foi alterado.

**Nota geral:** Parte A com 8 de 9 critérios no mínimo (média 8,9; antes 8,7). Parte B com 7 de 15 salas aprovadas (igual à rodada 6). As escalas ainda **não** passaram: falta o critério 2 (ícones) e as 8 salas reprovadas, e as duas coisas dependem de arte ou modelo novo.

Fontes (tudo em `/tmp/roda/esc/r7/`):
- `visB/`: 17 telas do `vis3.mjs`.
- `visB_extra/`: 90 telas em 390×844 e 360×740 (entrada, manual nos 6 passos, mapa, salas, lista, Máquina nas 4 abas, caderno, pausa, final, resultado, professor, participante, livros).
- `visB_pecas/`: as 15 peças dentro da sala, com os pontos, nas duas larguras.
- `capB/`: minijogos, luz da Galeria, gravador, livro, provas.
- `tlB/` e `fitaB/`: telão em 1280 e 1920 com 12 e 40 nomes; "A noite" com 3, 7, 9 e 10 fatos; "Missões" com as 8 missões.
- `torreB/` e `torreB360/`: museu 3D, as 15 salas, em 390×844 e em 360×740.
- `simB/`: simulador em 1280, 1366 e 1920.
- `folhasB/`: folhas de contato (todas olhadas).
- `pwB/`: scripts e registros. Reaproveitados: `cap`, `tl40`, `miss8`, `fita_pwB`, `torre15`, `livro`. Novos: `auditA.mjs` (censo de emoji, alvos, estouro, texto cortado, letra, pontos das 15 salas), `auditB.mjs` (relógio, gravador, minijogo, final, resultado, professor, participante), `tlB.mjs` (fita linha a linha com nomes compridos, tela cheia, simulador, endereços), `torre15_360.mjs`.

Limites:
- Chrome com renderização por software; nenhum aparelho real.
- Tela cheia de verdade não abre sem janela: conferi botão, tamanho e API ligada.
- Na primeira tentativa o `torre15.mjs` estourou o tempo (rodava junto com outros testes); sozinho, passou nas 15 salas. No `cap.mjs` o minijogo "Abrir a caixa de banners" não abriu em 390; no `auditB.mjs`, com o mesmo preparo, abriu nas duas larguras. Tratei como falha do teste, não do jogo.
- O minijogo do crachá não abriu sem pré-requisito e ficou de fora; os outros 4 e a cena da luz foram medidos.
- A entrada foi comparada com o padrão descrito, não lado a lado com o Comitê.
- A RA ("Ver no ambiente") não foi aberta; só li o tamanho real dos modelos.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

| # | Critério | Antes (rodada 6) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões, cartões, abas, faixas do gravador, fichas e linhas da fita com sombra dura, brilho e afundar |
| 2 | Ícones | 8 | **8** | não | Continuam os 6 emojis em ficha; o resto é miniatura 3D do projeto |
| 3 | Muito visual | 9 | **9** | sim | Imagem em todo minijogo, gravador com medidor, fita com miniatura por linha, mapa com 15 miniaturas |
| 4 | Paleta coerente | 9 | **9** | sim | O cartão do museu 3D saiu do creme e entrou no azul-noite |
| 5 | Celular | 8 | **9** | sim | Museu 3D centra a peça nas 15 salas, nas duas larguras; 0 alvo abaixo de 44 px; 0 estouro |
| 6 | Estabilidade | 9 | **9** | sim | Livro, gravador, minijogo, Máquina e relógio: 0 px de pulo |
| 7 | Linguagem | 9 | **9** | sim | 2ª pessoa, frases curtas, sem marca de gênero nas telas do Loop |
| 8 | Telão | 8 | **9** | sim | "A noite": 0 linha cortada em 16 combinações; "Quem trouxe" numa linha só |
| 9 | Entrada | 9 | **9** | sim | Mesmo padrão; os 4 endereços respondem |

**8 de 9 atingem 9. Média 8,9.** Nenhuma nota caiu.

### 1 · Profundidade 3D — 9
Visto nas telas: abas da Máquina, cartões do mapa, pistas, faixas do gravador, botões "Ler" do livro, fichas das provas, abas e linhas da fita do telão, botões do museu 3D. Nada chapado.

### 2 · Ícones — 8
Certo: mapa, barra, entrada, abas, defeitos, Atividades, Revelar, pausa, caderno, resultado, telão, minijogos e gravador usam miniatura 3D das peças do projeto. Nenhum ícone de outro jogo.

**Provisórios que restam: 6** (censo de emoji na tela, nas duas larguras; bate com a lista B de `docs/ICONES-A-GERAR.md`).

| # | Emoji | Onde vi | Peso |
|---|---|---|---|
| 1 | 🚪 | Cartão do Saguão no mapa (celular e telão), em toda volta | Alto |
| 2 | ⚡ | "Energia" da sala, 10 vezes na lista da Central, ficha Energia da Máquina, faixas do gravador | Alto pela repetição |
| 3 | 🕵️ | Cartão "Sua missão secreta" no Dossiê | Alto |
| 4 | 📘 | Etiqueta "MANUAL" no Dossiê | Médio |
| 5 | ☝️ | Aba Revelar, "Uma tentativa na noite inteira" | Médio |
| 6 | círculo tracejado | Telão, "A noite", ficha "N fatos ficaram no escuro" | Baixo |

**Se só esses 6 forem trocados por render 3D bom, o critério chega a 9: sim.** Não há outro impedimento. **Depende de arte nova** (os prompts estão na lista B).

Retoques para o 10, sem arte nova: na lista da sala os tipos de pista ainda leem como dois objetos só (gaveteiro verde e câmera laranja); a miniatura do minijogo "Abrir a caixa de banners" mostra uma cômoda.

### 3 · Muito visual — 9
- Minijogos: 1 imagem em cada um, 40 a 54 palavras.
- Gravador: ícone, medidor, legenda que entra aos poucos, 6 faixas em grade.
- Telão: mapa com 15 miniaturas e contagem; Turma com miniatura da sala ao lado do nome; fita com miniatura por linha.
- Resultado no celular: 3 fichas de meta, 3 fichas de prova, 91 palavras.

Retoques (não reprovam): a página "Missões" do telão é a única só com texto e etiquetas de nome, e com 2 ou 4 missões sobra metade da tela vazia; o manual tem 6 passos e, no primeiro, o texto da história fica atrás do botão "Entendi"; na sala, há uma faixa vazia entre o cabeçalho e o cartão "Investigação".

### 4 · Paleta coerente — 9
Janela do minijogo `rgb(17,31,45)`. Cartão do museu 3D agora em `rgb(41,64,81)` a `rgb(23,38,51)`, com botão dourado. Sobra: paredes azul-acinzentado claro e piso bege do museu 3D (tela de apoio; não reprova).

### 5 · Celular — 9
Medido em 390×844 e 360×740:
- Estouro de largura: 0 em todas as telas (26 telas por largura, mais as 15 salas).
- Alvos abaixo de 44 px: 0. As caixas de marcar do Dossiê têm 28 px, mas ficam dentro de um rótulo de 318×88 (288×88). Ponto da peça: 26 + 12 de folga.
- Pontos da peça: 0 pares a menos de 44 px nas 15 salas (menor distância 47 a 50 px); 0 pontos fora da caixa.
- Mapa: 15 salas inteiras na primeira tela nas duas larguras (cartão 78×96/106 e 70×96/106).
- Lista: cartão 149×82 (134×82), todas as alturas iguais, 0 nome ou selo cortado nas 15 salas.
- Letra mínima 12 px nas telas de jogo.
- Texto cortado: 0.
- **Museu 3D (`museu/torre/?loop=1`), o que reprovava na rodada 6:** nas 15 salas a peça fica centrada (desvio 0 px na horizontal) e inteira acima do cartão, em 390×844 e em 360×740. Botões "Sair" 57×44, andares 75 a 88×44, "Voltar ao museu" 139×44.

Retoques (não reprovam; todos só CSS/JS):
- Entrada em 360×740: "Jogar sem turma" termina 110 px abaixo da dobra.
- Manual, passo 3: o relógio de exemplo traz "VOLTA 2 DE 5" com 9,9 px.
- Museu 3D em 360: na abertura a torre passa da borda direita; na Oficina técnica o painel de ferramentas da parede passa por cima do título.
- "Abrir a caixa de banners" em 360: a janela rola 4 px.
- RA: três modelos têm tamanho real errado (rádio N07 com 2 cm; câmera N05 com 7,2 m; Oficina elétrica E02 com 15 m). No modo 3D não aparece; no "Ver no ambiente" aparece. Falta o atributo de escala.

### 6 · Estabilidade — 9
- Livro da Conservação: altura da página e posição da leitura iguais antes, ao abrir e em 5 pares de folhas (2.353 / 1.435 em 390; 2.374 / 1.456 em 360). Ateliê: painel cresceu 0 px ao abrir.
- Gravador: posição e altura únicas em 13 leituras (841 / 534 px; legenda 172 px, sem rolagem). A página cresce só embaixo, na lista do caderno.
- Minijogo, resposta errada: 0 px nos 4 testados.
- Máquina: ficha de estado no mesmo lugar e tamanho nas 4 abas (250 / 112 em 390).
- Relógio: 138×62 em 6 leituras, nas duas larguras.
- Telão com 40 nomes: 0 cartão estourado em 52 páginas (1280 e 1920).

### 7 · Linguagem — 9
"Nesta atividade você vive o papel de quem lembra das voltas." nas duas entradas e no manual; marca "Mosaico Loop" por inteiro; "Som desligado" (era "Som: não"). Busca por marca de gênero nos arquivos de tela: o que aparece é de código ou dos casos antigos. Fica "Obrigado por participar!" no telão de aula encerrada (retoque: "Valeu por participar!").

### 8 · Telão — 9
- Páginas por tema: 4 na volta, 2 no fim, 5 no resultado.
- Tela cheia sempre visível (144×46; 197×50 em 1920), API ligada.
- Letra mínima 1,35% da largura.
- **"A noite", o que reprovava:** 0 linha cortada com 12 nomes curtos, 12 com sobrenome, 40 alternados e 40 completos (script da casa), e também no meu teste com nomes compridos ("Wellington, Washington +38", "Washington, Maximiliano +24") e 3, 7 e 9 fatos, em 1280 e 1920. O fato mais comprido quebra em 2 linhas e cabe (linha de 57 px com 7 fatos). Em 1920 o medidor acusa 2 px de sobra de altura de linha; olhei o recorte ampliado e nenhuma letra é cortada.
- "Missões" com as 8 missões e 40 nomes: 0 corte, letra 1,40%.
- Nada fora da tela.

Não mudou (retoque): no simulador o telão tem 745×419 fixos (58% da largura em 1280, 39% em 1920) e em 1280×720 só 122 px dos celulares aparecem.

### 9 · Entrada — 9
"Participar com código" (320×52), roxo com cadeado e "Só o Professor tem a chave" (320×58), "Abrir telão" e "Simulador" (155×52), "Jogar sem turma". `simulador/`, `telao/`, `sala/telao/` e `sala/simulador/` respondem 200.

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

Mudou desde a rodada 6: só código (museu 3D centra a peça). Nenhum GLB foi trocado (datas de 21 a 25/11 de manhã; pesos iguais); `exposure` 1.15 fixo; lugar dos pontos ainda por sorteio; nenhuma peça tem animação usada nem reage ao apagão.

| Sala | Peça (KB) | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (839) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (156) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (820) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (421) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | Viab. 9 |
| Ateliê de descobertas | L06 (865) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 (232) + livro | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Galeria especial | GAL_A (481) | 9 | 9 | 9 | 9 | 7 | 8 | 9 | 9 | 9 | reprova (Amb.) | igual |
| Sala dos relógios | REL_A (804) | 9 | 9 | 9 | 9 | 7 | 8 | 8 | 8 | 8 | reprova (Amb.) | igual |
| Área de descanso | DESC_A (458) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) | igual |
| Pátio · Quadro externo | E01 (146) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) | igual |
| Sala das coleções | V12 (747) | 6 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Pert., Amb.) | igual |
| Base da limpeza | L05 (1.020) | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 7 | reprova (Pert., Amb., Viab.) | igual |
| Sala dos sons | N07 (175) + gravador | 8 | 9 | 9 | 9 | 6 | 8 | 8 | 8 | 8 | reprova (Pert., Amb.) | Viab. 9 |
| Sala da fotografia | N05 (569) | 9 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Amb.) | Viab. 9 |

**Passam 7 de 15. Reprovam 8.** As mesmas da rodada 6.

Três notas de Viabilidade desceram de 9 para 8 (continuam no mínimo). O motivo não é mudança no jogo: é uma medida que a rodada 6 não fez. O tamanho real do modelo, que a RA usa, está errado em N07 (2 cm), N05 (7,2 m de altura) e E02 (15 m de lado). No modo 3D, que é o que conta, as três funcionam.

### O que vi em cada reprovada

| Sala | Reprova em | O que a imagem mostra | Só com código | Depende de modelo novo |
|---|---|---|---|---|
| Galeria | Ambiente 7 | Máscara em caixa lisa marrom; 2 de 6 pontos acesos à vista | Pontos em lugar fixo ajuda, não basta | **Sim:** `GAL_B` (pedido 8) |
| Relógios | Ambiente 7 | 2 relógios para uma sala de "dezenas"; 804 KB | Juntar N03 e recomprimir ajuda, não basta | **Sim:** `REL_B` (pedido 9) |
| Área de descanso | Pert. 8, Amb. 7 | Sofá e cortiça; falta a porta de serviço, que é o centro da sala | Não | **Sim:** `DESC_B` (pedido 7) |
| Pátio | Pert. 8, Amb. 7 | Quadro de parede interna, sem para-raios; 3 de 14 pontos à vista | Não | **Sim:** `Q01` (pedido 1) |
| Coleções | Pert. 6, Amb. 6 | Cômoda no lugar das caixas; 2 de 7 pontos à vista; 153 mil triângulos | Não | **Sim:** `D10` (pedido 2) |
| Limpeza | Pert. 8, Amb. 6, Viab. 7 | Cesto de frascos, sem armário nem carrinho; 1.020 KB | Não | **Sim:** `L08` (pedido 3) |
| Sons | Pert. 8, Amb. 6 | Rádio moderno com "PLAY" escrito; o gravador é painel ao lado, não parte da peça | Não (a mecânica já existe) | **Sim:** `N17` (pedido 4) |
| Fotografia | Ambiente 6 | Só a câmera no tripé; 4 de 5 pontos à vista flutuam ao lado do tripé | Não | **Sim:** `N18` (pedido 5) |

### `docs/PECAS-A-CONSEGUIR.md` cobre as reprovadas?
**Sim, as 8 têm pedido com prompt:** Pátio (1), Coleções (2), Limpeza (3), Sons (4), Fotografia (5), Área de descanso (7), Galeria (8), Relógios (9). A tabela de situação e os pesos conferem com os arquivos (L05 medido 1.020 KB; T01 868; S01 839). O texto da revisão 7 registra a correção do museu 3D. A acrescentar: a linha da escala real de N07, N05 e E02 (não está no documento).

Continua para depois (código, vale para todas): pontos em lugar fixo por peça; peça que reage ao apagão; recompressão de T01, L06, S01, M03, REL_A e V12 para 600 KB; escala real para a RA.

---

## Resumo do que falta

| Item | Só CSS/JS/texto | Depende de arte ou modelo novo |
|---|---|---|
| A2 Ícones (8) | Não | **6 ícones da lista B** |
| B · 8 salas | Não aprova nenhuma | **GAL_B, REL_B, DESC_B, Q01, D10, L08, N17, N18** |

**Fim do ciclo:** as escalas não passaram. Tudo o que era corrigível só com CSS/JS na rodada 6 (museu 3D e fita do telão) foi corrigido e medido. O que resta abaixo do mínimo depende de arte nova: 6 ícones e 8 modelos.
