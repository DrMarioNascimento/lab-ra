# Loop · Rodada 6 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas da revisão 6. Nenhum arquivo do repositório foi alterado.

**Nota geral:** Parte A com 6 de 9 critérios no mínimo (média 8,7; antes 8,6). Parte B com 7 de 15 salas aprovadas (igual à rodada 5). As escalas ainda **não** passaram.

Fontes (tudo em `/tmp/roda/esc/r6/`):
- `visB/`: 17 telas do `vis3.mjs`.
- `visB_extra/`: 72 telas (entrada, manual, mapa, sala, cofre, Máquina, caderno, professor, participante, minijogos, livros, telão com 6 pessoas, simulador em 1280, 1366 e 1920).
- `cap6/`: minijogos com imagem, luz da Galeria, gravador, livros, provas, telão com 40 nomes (1280 e 1920), fita do tempo com 12 e 40 nomes, "Ver o museu em 3D".
- `visB_pecas/`: as 15 peças dentro da sala, com os pontos.
- `folhasB/`: folhas de contato (todas olhadas).
- `pwB/`: scripts e registros. Reaproveitados: `meu360`, `extra_r3`, `medirB`, `est_r3`, `livro`, `fim5`, `tl5q`, `pecas`, `salas`, `txt`, `shots2`, `cap`, `tl40`, `torre`. Novos: `fita.mjs` (linhas cortadas na fita do tempo), `est6.mjs` (gravador, minijogo no fim da volta, quebras no mapa), `torre2.mjs` (enquadramento de 5 salas no museu 3D).

Limites:
- Chrome com renderização por software; nenhum aparelho real.
- Tela cheia de verdade não abre sem janela: conferi botão, tamanho e API ligada.
- Scripts que quebraram e não entram nas medidas: `meu.mjs` (parou no teste do livro, porque o livro agora só abre no botão; as medidas dele até ali valem e o livro foi medido por `livro.mjs`, `cap.mjs` e `fim5.mjs`), `tl2.mjs` (travou no fim; as medidas de letra dele saíram antes), `mg5.mjs` em 2 dos 5 minijogos (crachá e fita não abrem mais sem pré-requisito; cobertos por `cap.mjs`).
- O museu 3D foi visto em 5 salas, não nas 15.
- A entrada foi comparada com o padrão descrito, não lado a lado com o Comitê.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

| # | Critério | Antes (rodada 5) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões, cartões, abas, faixas do gravador e fichas com sombra dura, brilho e afundar |
| 2 | Ícones | 8 | **8** | não | Continuam os 6 emojis em ficha; o resto é miniatura 3D do projeto |
| 3 | Muito visual | 8 | **9** | sim | Os 5 minijogos ganharam imagem, a luz mostra a máscara, o gravador tem medidor e legenda |
| 4 | Paleta coerente | 9 | **9** | sim | Mesa do livro e janela do minijogo agora em azul-noite; sobra o cartão creme do museu 3D |
| 5 | Celular | 8 | **8** | não | Tudo o que foi apontado foi corrigido; o que reprova é novo: no "Ver o museu em 3D" a peça da sala fica escondida |
| 6 | Estabilidade | 8 | **9** | sim | Livro da Conservação, mensagem de erro do minijogo e gravador: 0 px de pulo |
| 7 | Linguagem | 9 | **9** | sim | Retoques feitos ("Em dupla:", duas frases no telão) |
| 8 | Telão | 9 | **8** | não | Na página "A noite" as linhas cortam texto: 1 fato cortado sempre, 5 a 10 com nomes compridos |
| 9 | Entrada | 9 | **9** | sim | Mesmo padrão; `telao/` agora responde |

**6 de 9 atingem 9 (1, 3, 4, 6, 7, 9). Média 8,7.**

### 1 · Profundidade 3D — 9
Conferido nas telas: abas da Máquina, cartões do mapa, pistas, faixas do gravador, botões "Ler" do livro, fichas das provas, abas do telão. Nada chapado.

### 2 · Ícones — 8
Certo: mapa, barra, entrada, abas, defeitos, Atividades, Revelar, pausa, caderno, resultado, telão, minijogos e gravador usam miniatura 3D das peças do projeto (conta como ícone 3D próprio). Nenhum ícone de outro jogo.

**Provisórios que restam: 6** (censo de emoji em ficha na tela; bate com a lista B de `docs/ICONES-A-GERAR.md`).

| # | Emoji | Onde | Peso |
|---|---|---|---|
| 1 | 🚪 Saguão | Primeiro cartão do mapa (celular e telão), em toda volta | Alto |
| 2 | ⚡ energia | 8 vezes por lista de pistas, ficha Energia da Máquina, faixas do gravador | Alto pela repetição (ao lado de número, vale como apoio) |
| 3 | 🕵️ missão | Topo do Dossiê | Alto |
| 4 | 📘 manual | Etiqueta das pistas de manual | Médio |
| 5 | ☝️ uma tentativa | Aba Revelar | Médio |
| 6 | círculo tracejado | Telão, "A noite", uma ficha | Baixo |

**Se só esses 6 forem trocados por render 3D bom, o critério chega a 9: sim.** Não há outro impedimento. Depende de arte nova (não há peça no acervo que sirva).

Retoques para o 10, sem arte nova: a miniatura `E02` é a única com fundo opaco e quadrado (as outras são objeto recortado); os tipos de pista melhoraram com o novo enquadramento, mas 13 de 16 cartões da Câmara mostram o mesmo gaveteiro verde.

### 3 · Muito visual — 9
- Minijogos: 1 imagem de 96 px em cada um (medido), 44 a 57 palavras. A luz da Galeria mostra a máscara na base, com o facho andando.
- Gravador: ícone, medidor que mexe, legenda que aparece aos poucos, 6 faixas em grade.
- Manual: nomes curtos no mapinha, sem palavra quebrada.
- Resultado: fichas das 3 provas com 40 px e fundo claro.

Retoques (não reprovam): a imagem do minijogo é a da sala, não a da coisa olhada ("Abrir a caixa de banners" mostra uma cômoda); telão com Desfecho final em 34% da área e "Para conversar" em 39% (igual à rodada 5); no mapa do celular três nomes quebram com hífen ("conserva-ção", "monitora-mento", "descober-tas").

### 4 · Paleta coerente — 9
Fundo do livro `rgb(15,28,40)`, janela do minijogo `rgb(17,31,45)`. Sobra: o cartão da sala no museu 3D é creme (`rgb(231,223,202)` a `rgb(185,170,141)`) e as paredes são azul-acinzentado claro; é a única tela fora da paleta. Não reprova por ser tela de apoio.

### 5 · Celular — 8
Medido em 390×844 e 360×740:
- Estouro de largura: 0 em todas as telas.
- Alvos: todos ≥ 44 px (ponto 26 + 12 de folga; "?" 22 + 11; faixas do gravador e "Som" ≥ 44; controle da luz 44; botões dos minijogos 48 a 56).
- Pontos da peça: 0 pares a menos de 44 px nas 15 salas.
- Mapa: 15 salas na primeira tela nas duas larguras. Lista: cartão 149×82 (134×82), 14 por tela (12).
- Letra mínima 12 px; rótulo "OLHE DE PERTO" agora 13 px.
- Selo "✓ no caderno": 0 cortes nas 15 salas. Nomes de pista: 0 cortes.
- Minijogo da luz em 360 px: 606 px, sem rolagem.
- Aviso do fim da volta não cobre mais o botão.

**O que reprova (corrigível só com JS/CSS):** "Ver o museu em 3D" (`museu/torre/?loop=1`, botão da tela inicial). Ao tocar numa sala, a câmera não centra a peça dela. Em 5 salas testadas, só a Sala dos sons aparece. Central: o console fica cortado no canto de baixo, atrás do cartão, e o centro da tela mostra a peça de outra sala. Recepção: a mesa fica atrás do cartão e o centro mostra o cesto da limpeza. Galeria e Subsolo: nenhuma peça à vista, só parede. O cartão ocupa 147 a 168 px no pé e a mira não desconta isso. Ressalva: visto só com renderização por software; conferir num celular.

Observação sem peso: nos minijogos a primeira resposta já abre com o contorno dourado de foco, como se estivesse escolhida.

### 6 · Estabilidade — 9
- Livro da Conservação: altura da página e posição da leitura iguais antes, ao abrir e em 5 pares de folhas (2.353 / 1.435 em 390; 2.374 / 1.456 em 360). Lugar dos botões reservado (118 px).
- Minijogo, resposta errada: 0 px de crescimento nos 4 testados.
- Gravador: posição e altura únicas em 13 leituras (534 px; legenda 172 px, sem rolagem, até a faixa de 50 palavras).
- Minijogo aberto no fim da volta: fecha sozinho, nas duas larguras.
- Lista de pistas 82 px; relógio 138×62; Máquina igual nas 4 abas; dossiê 88 px.
- Telão com 40 nomes: 0 cartões estourados em 42 páginas (1280 e 1920).

### 7 · Linguagem — 9
Feitos: "Em dupla: cada pessoa numa sala, falando"; "Apontem a câmera para o QR code. Ou digitem o código…"; leitura do livro sem título repetido. Marca "Mosaico Loop" por inteiro e frase do papel nas duas entradas. Gravador: "Toque numa faixa para escutar. A legenda aparece aqui.", "ouvir de novo", "Som: não".

Retoque: "Som: não" lê melhor como "Som desligado".

### 8 · Telão — 8
Certo: páginas por tema (4 na volta, 2 no fim, **5 no resultado**: Desfecho, A noite, Para conversar, Missões, Turma); tela cheia sempre visível (144×46; 197×50 em 1920), tecla F; letra mínima 1,35% da largura; com 40 nomes, Turma, Missões e entrada cabem sem corte; nada fora da tela.

**O que reprova (corrigível só com CSS/JS):** página "A noite", coluna "Quem trouxe". Cada linha tem altura fixa (44 px em 1280; 67 em 1920) e esconde o que passa.
- Com 12 nomes curtos (Ana, Bia…): a linha "N pessoas" some pela metade nas 10 linhas (22 px escondidos) e o fato de 3 linhas ("Alguém do patrocínio…") perde o fim da frase ("com o crachá do").
- Com nome e sobrenome (12 ou 40 pessoas): "Quem trouxe" ocupa 3 linhas, empurra o texto e corta o próprio fato pela metade em 5 a 10 das 10 linhas (até 36 px em 1280, 53 em 1920). É a página que conta a história para a turma.
- Conserto: em `ritmo.js`, mostrar só o primeiro nome de até 2 pessoas e "+N" numa linha só (`white-space:nowrap;text-overflow:ellipsis`); em `sala.css`, limitar o fato a 2 linhas com reticências ou encurtar o fato comprido.

Não mudou: no simulador o telão tem 745×419 fixos (58% da largura em 1280, 39% em 1920) e em 1280×720 só 122 px dos celulares aparecem.

### 9 · Entrada — 9
"Participar com código" (320×52), roxo com cadeado e "Só o Professor tem a chave" (320×58), "Abrir telão" e "Simulador" (155×52), "Jogar sem turma". `simulador/`, `telao/`, `sala/telao/` e `sala/simulador/` respondem 200. Em 360×740 "Jogar sem turma" fica 95 px abaixo da dobra (retoque).

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

Mudou desde a rodada 5: gravador na Sala dos sons; cena da luz da Galeria com a máscara; minijogos com imagem. Nenhum GLB foi trocado nem recomprimido (datas de 21 a 25/11 de manhã; pesos iguais); `exposure` 1.15 fixo; lugar dos pontos ainda por sorteio.

| Sala | Peça (KB) | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (839) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (156) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (820) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (421) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Ateliê de descobertas | L06 (865) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 (232) + livro | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Galeria especial | GAL_A (481) | 9 | 9 | 9 | 9 | 7 | 8 | 9 | 9 | 9 | reprova (Amb.) | igual |
| Sala dos relógios | REL_A (804) | 9 | 9 | 9 | 9 | 7 | 8 | 8 | 8 | 8 | reprova (Amb.) | igual |
| Área de descanso | DESC_A (458) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) | igual |
| Pátio · Quadro externo | E01 (146) | 8 | 9 | 9 | 9 | 7 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) | igual |
| Sala das coleções | V12 (747) | 6 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 8 | reprova (Pert., Amb.) | igual |
| Base da limpeza | L05 (1.020) | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 7 | reprova (Pert., Amb., Viab.) | igual |
| Sala dos sons | N07 (175) + gravador | 8 | 9 | 9 | 9 | 6 | 8 | 8 | 8 | 9 | reprova (Pert., Amb.) | Amb. 5, Nov. 7 |
| Sala da fotografia | N05 (569) | 9 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Amb.) | igual |

**Passam 7 de 15. Reprovam 8.** Nenhuma nota caiu; subiram Novidade (7 para 8) e Ambiente (5 para 6) da Sala dos sons.

### Sala dos sons e o gravador
Testado nas duas larguras: tocar numa faixa examina a pista com as regras de sempre (energia 5 para 4, 1 pista no caderno); a legenda entra aos poucos; ouvir de novo não gasta nada; "Som" começa desligado; faixa travada continua travada; alvos ≥ 44 px; nada pula. Há alternativa em texto e nada depende de som (Celular 9). É mecânica própria, que nenhuma outra sala tem: Novidade 8. Continua reprovando porque o modelo é um rádio moderno com "PLAY" escrito, sem alto-falante de teste, metrônomo nem gravador (Pertencimento 8, Ambiente 6). O gravador é um painel ao lado da peça, não parte dela.

### Motivos das reprovadas e o que resolve

| Sala | Reprova em | Só com código | Depende de modelo novo |
|---|---|---|---|
| Galeria | Ambiente 7: máscara em caixa lisa; 2 de 9 pontos à vista | Pontos em lugar fixo ajuda, não basta | **Sim:** `GAL_B` (pedido 8) |
| Relógios | Ambiente 7: 2 relógios para "dezenas"; 804 KB | Juntar N03 e recomprimir ajuda, não basta | **Sim:** `REL_B` (pedido 9) |
| Área de descanso | Pert. 8, Amb. 7: falta a porta de serviço | Não | **Sim:** `DESC_B` (pedido 7) |
| Pátio | Pert. 8, Amb. 7: quadro de parede interna, sem para-raios | Não | **Sim:** `Q01` (pedido 1) |
| Coleções | Pert. 6, Amb. 6: cômoda em vez de caixas; 2 de 15 pontos | Não | **Sim:** `D10` (pedido 2) |
| Limpeza | Pert. 8, Amb. 6, Viab. 7: cesto de frascos; 1.020 KB | Não (a recompressão piora a peça) | **Sim:** `L08` (pedido 3) |
| Sons | Pert. 8, Amb. 6 | Não (a mecânica já foi feita) | **Sim:** `N17` (pedido 4) |
| Fotografia | Ambiente 6: só a câmera; 3 de 5 pontos no ar | Não | **Sim:** `N18` (pedido 5) |

### `docs/PECAS-A-CONSEGUIR.md` cobre as reprovadas?
**Sim, as 8 têm pedido com prompt:** Pátio (1), Coleções (2), Limpeza (3), Sons (4), Fotografia (5), Área de descanso (7), Galeria (8), Relógios (9). A tabela de situação e os pesos conferem com os arquivos. O gravador e a cena da luz estão registrados como feitos. Nada a acrescentar.

Continua para depois (código, vale para todas): pontos em lugar fixo por peça; peça que reage ao apagão; recompressão de T01, L06, S01, M03, REL_A e V12 para 600 KB.

---

## Resumo do que falta

| Item | Só CSS/JS/texto | Depende de arte ou modelo novo |
|---|---|---|
| A2 Ícones (8) | Não | **6 ícones da lista B** |
| A5 Celular (8) | Mira da câmera no museu 3D, descontando o cartão | Não |
| A8 Telão (8) | "Quem trouxe" em uma linha e fato em até 2 linhas na página "A noite" | Não |
| B · 8 salas | Não aprova nenhuma | **GAL_B, REL_B, DESC_B, Q01, D10, L08, N17, N18** |

**Fim do ciclo:** as escalas não passaram. Na Parte A, os critérios 5 e 8 sobem ao mínimo só com CSS/JS; o 2 só fecha com os 6 ícones novos. Na Parte B, as 8 salas reprovadas dependem de modelo novo.
