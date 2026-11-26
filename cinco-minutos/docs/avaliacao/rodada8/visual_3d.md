# Loop · Rodada 8 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliação feita do zero, sobre capturas novas da revisão 8 (commits `ab89c22` e `ea6df7b`). Nenhum arquivo do repositório foi alterado.

**Nota geral:** Parte A com 7 de 9 critérios no mínimo (média 8,8; antes 8,9). Os 6 ícones novos resolveram o que reprovava na rodada 7, mas apareceu uma tela que as rodadas anteriores nunca abriram: a de quem entra com código numa sala de verdade. Ela tem 3 emojis no papel de ícone e marca de gênero. Parte B com 13 de 15 salas aprovadas (antes 7). As escalas ainda **não** passaram. Tudo o que falta na Parte A se resolve com JS e texto. Na Parte B, Q01 se resolve com texto e D10 pede composição ou arte.

Fontes (tudo em `/tmp/roda/esc/r8/`):
- `visB/`: 17 telas do `vis3.mjs`.
- `visB_extra/`: entrada, manual (6 passos), mapa, salas, lista, Máquina (4 abas), caderno, pausa, final, resultado, professor, participante, nas duas larguras. Mais as telas `c_join_*` (entrada com código numa sala de verdade), `c_conduzir_390` e `c_telao_gate_1280`.
- `visB_pecas/`: as 15 peças dentro da sala, com os pontos, em 390 e 360. `visB_pecas2x/`: as 8 peças novas na tela inteira em 2x, mais o mapa.
- `angulos/`: as 8 peças novas vistas de 4 ângulos (frente, lado, costas, lado de cima).
- `capB/`: minijogos, luz da Galeria, gravador, livro, provas, caderno.
- `tlB/` e `fitaB/`: telão em 1280 e 1920 com 12 e 40 nomes; "A noite" com 3, 7, 9 e 10 fatos.
- `torreB/` e `torreB360/`: museu 3D, as 15 salas, em 390×844 e 360×740.
- `simB/`: simulador em 1280, 1366 e 1920.
- Folhas de contato: `folha_*.png`. Ícones: `ui_icones_256.png`, `ui_icones_pequenos_x3.png`, `ui_borda_zoom.png`, `miniaturas_novas_vs_antigas.png`, `zoom_*.png`.
- `pwB/`: cópia de `r7/pwB` com os caminhos trocados para r8 (`auditA`, `auditB`, `cap`, `tl40`, `fita_pwB`, `tlB`, `torre15`, `torre15_360`) e registros `.log`. `scr/`: scripts novos (`ang.mjs`, `stats.mjs`, `join.mjs`, `gate.mjs`). Também usei `/tmp/roda/r8/pecas.mjs`.

Limites:
- O Chrome renderiza por software, e nenhum aparelho real foi usado.
- A tela cheia de verdade não abre sem janela. Conferi o botão, o tamanho e se a API está ligada.
- Abri a tela de entrar com código sem Firebase. Ela aparece porque é desenhada antes da conexão, mas não segui o fluxo depois de "Entrar".
- Não abri a RA ("Ver no ambiente"). Só li o tamanho real gravado nos modelos.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

| # | Critério | Antes (rodada 7) | Agora | Passa? | Motivo em uma linha |
|---|---|---|---|---|---|
| 1 | Profundidade 3D | 9 | **9** | sim | Botões, cartões, abas, fichas, faixas e linhas da fita com sombra dura, brilho e afundar |
| 2 | Ícones | 8 | **8** | não | Os 6 ícones novos estão ótimos e nenhum emoji sobrou nas telas de jogo. Mas a entrada com código tem 👨 👩 👥 como ícone de cartão |
| 3 | Muito visual | 9 | **9** | sim | Miniatura em todo lugar; a miniatura da caixa de banners agora é a estante (D10) |
| 4 | Paleta coerente | 9 | **9** | sim | Azul-noite, dourado e verde-água iguais; ícones novos em latão e madeira, no tom do jogo |
| 5 | Celular | 9 | **9** | sim | 0 estouro; 0 alvo abaixo de 44 px; pontos a 47 px ou mais nas 15 salas |
| 6 | Estabilidade | 9 | **9** | sim | Livro, gravador, minijogo, Máquina e relógio: 0 px de pulo |
| 7 | Linguagem | 9 | **8** | não | Entrada com código: "Como quer ser chamado" e "Bem-vindo" marcado de saída |
| 8 | Telão | 9 | **9** | sim | 0 linha cortada em "A noite"; ficha "fatos no escuro" com o ícone novo |
| 9 | Entrada | 9 | **9** | sim | A entrada é a mesma de antes; Professor e telão com ícone 3D; os 7 endereços respondem 200 |

**7 de 9 atingem 9. Média 8,8.**

Sobre a queda no 7 (e o 8 que continua no 2): o jogo não piorou. A tela do participante numa sala de verdade (`sala/index.html?sala=CÓDIGO`, desenhada por `sala/firebase-room.js`) já era assim na revisão 7. As rodadas anteriores usaram só `?falsa=1` e nunca a abriram. Para cada aluno que chega pelo QR code, é a primeira tela.

### 1 · Profundidade 3D: 9
Vi abas da Máquina, cartões do mapa, pistas, faixas do gravador, botões do livro, fichas, linhas da fita, botões do museu 3D e cartões de escolha do Professor. Nada está chapado. Os cartões "Bem-vindo / Bem-vinda / Tanto faz" têm borda e fundo, mas um volume menor que o resto (retoque).

### 2 · Ícones: 8
**O que melhorou (lista B inteira trocada):**

| Ícone | Arquivo | Onde vi | Leitura no tamanho real |
|---|---|---|---|
| Saguão | `ui/saguao.webp` (porta de elevador com grade) | Mapa no celular (40 px) e no telão | Boa; no cartão verde-escuro o contraste é baixo, mas dá para ler |
| Manual | `ui/manual.webp` (livro verde com engrenagem) | Etiqueta MANUAL no dossiê (~16 px) | Bom: dá para ver livro azul-esverdeado |
| Uma tentativa | `ui/uma-tentativa.webp` (carimbo e almofada) | Aba Revelar | Bom; a metáfora "carimbo = uma vez só" é razoável |
| Missão | `ui/missao.webp` (envelope com lacre) | Cartão "Sua missão secreta" | Muito bom, lê de longe |
| Energia | `ui/energia.webp` (pilha de latão com raio) | Linha de energia, ficha Energia, lista (18 px), gravador | Em 44 px ótimo; em 18 px vira um cilindro dourado (o raio some), mas fica claro ao lado do número |
| Fato que falta | `ui/fato-falta.webp` (moldura com ?) | Telão, "A noite", ficha "3 fatos ficaram no escuro" | Muito bom |

- Fundo: transparente de verdade (alfa 0 a 255, cerca de 2 a 6 mil pixels de borda suave). Recorte limpo sobre o creme e sobre o escuro, sem halo (`ui_borda_zoom.png`).
- Estilo: render 3D em latão, madeira, couro e esmalte verde-água, coerente com as miniaturas das peças e com a T01.
- Censo de emoji (`auditA`/`auditB`, 54 telas): nas telas de jogo restam só ✕ (fechar) e 🔒 (apoio ao lado de texto). Nenhuma ficha `.ic3d` usa emoji (0 de 0 a 22 fichas por tela).

**O que reprova:** na entrada com código (`visB_extra/c_join_390_cod.png`) há 3 cartões com 👨, 👩 e 👥 grandes, no papel de ícone (`FORMAS` em `sala/firebase-room.js`, linha 43). Também sobra 📺 na linha de estado do Professor ("📺 Telão conectado", linhas 287 a 289). Ali é apoio ao lado de texto e é permitido, mas destoa.

**Corrigível com CSS/JS/texto: sim.** O Loop não usa a forma de tratamento em nenhum texto (tudo é 2ª pessoa sem gênero). Tirar o seletor `formas()` da tela de entrar resolve os critérios 2 e 7 juntos, sem arte nova. A outra saída, manter o seletor com 3 ícones 3D, depende de arte nova.

Retoques para o 10 (não reprovam):
- As miniaturas novas (Q01, D10, L08, N18, N17, DESC_B, REL_B, GAL_B) vêm em recorte justo, cortadas nas bordas. As antigas mostram o objeto inteiro com margem (`miniaturas_novas_vs_antigas.png`). Em 40 px quase não se nota (regerar o enquadramento: só script).
- A energia em 18 px poderia ir para 22 px, para o raio aparecer (CSS).
- A página "Missões" do telão continua só com texto: dá para pôr `missao.webp` ao lado de cada missão (JS).

### 3 · Muito visual: 9
O mapa tem 15 miniaturas (8 novas, mais fiéis à sala). O telão tem miniatura por linha da fita, e a noite usa Q01, D10 e DESC_B. O minijogo "Abrir a caixa de banners" agora mostra a estante (D10) no lugar da cômoda. O gravador tem medidor e faixas, e o resultado tem 6 imagens e 91 palavras.
Retoques: "Missões" do telão só com texto; no telão, a etiqueta de contagem cobre a ponta de algumas miniaturas (Fotografia, Relógios).

### 4 · Paleta coerente: 9
Janela do minijogo em `rgb(17,31,45)`, botões em gradiente `rgb(41,64,81)` a `rgb(23,38,51)`, dourado e roxo do Professor iguais. Os ícones novos ficaram no tom latão do jogo. Sobra o que já sobrava: paredes azul-acinzentadas e piso bege do museu 3D.

### 5 · Celular: 9
Medido em 390×844 e 360×740:
- Estouro de largura: 0 em todas as telas e nas 15 salas.
- Alvos abaixo de 44 px: 0. As caixas de marcar do dossiê (28 px) ficam dentro de um rótulo de 318×88 (288×88).
- Pontos da peça: 0 pares a menos de 44 px nas 15 salas (menor distância de 47 a 65 px) e 0 pontos fora da caixa. Pontos visíveis no ângulo de entrada: de 4 (Galeria) a 15 (Subsolo).
- Mapa: 15 salas inteiras acima da barra, nas duas larguras (78×96/106 e 70×96/106).
- Lista: cartões de 149×82 (134×82), 0 corte.
- Letra mínima de 12 px nas telas de jogo. A exceção é o relógio de exemplo do manual, passo 3 (9,9 px), que já vinha da rodada 7.
- Museu 3D: as 15 salas com a peça centrada e acima do cartão, nas duas larguras (`torre15`: 0 falha).

Retoques (só CSS/JS): "Jogar sem turma" termina em y = 850 em 360×740 (abaixo da dobra); "Abrir a caixa de banners" em 360 rola 4 px; no museu 3D, a parede de ferramentas da Oficina técnica passa por cima do título.

### 6 · Estabilidade: 9
- Livro: documento de 2.386 px e leitura de 1.468 px iguais antes, ao abrir e em 5 pares de folhas (360).
- Gravador: 853/534/172 px e 0 de rolagem em 4 leituras (a página cresce só embaixo, na lista do caderno).
- Minijogo com resposta errada: 0 px de pulo nos 4 testados. Máquina: ficha de estado em 250:112 (236:112) nas 4 abas. Relógio: 138×62 nas duas larguras.
- Telão com 40 nomes: 0 estouro em todas as páginas (1280 e 1920).

### 7 · Linguagem: 8
Nas telas do jogo segue tudo certo: "Nesta atividade você vive o papel de quem lembra das voltas.", "Mosaico Loop" escrito por inteiro, 2ª pessoa e frases curtas.

**Reprova** na entrada com código (`c_join_390_cod.png`):
- o campo tem o texto de exemplo "Como quer ser chamado" (masculino);
- há a escolha "Bem-vindo / Bem-vinda / Tanto faz", com "Bem-vindo" marcado de saída;
- os rótulos estão em letra serifada, diferente do resto do jogo.

**Corrigível com texto/JS: sim.** Basta trocar o exemplo por "Seu nome nesta partida" e tirar o seletor (umas 10 palavras). Fica também "Obrigado por participar!" no telão de aula encerrada ("Valeu por participar!").

Coerência de texto no museu 3D: `museu/torre/salas-loop.json` não foi gerado de novo depois do commit `ea6df7b`. Duas salas mostram a frase antiga: Limpeza ("O armário da equipe, o carrinho e Seu Dirceu de rodo na mão.") e Coleções ("Caixas empilhadas e uma mancha vermelha no chão."). No jogo, as frases já são as novas. É só gerar o JSON de novo (texto).

### 8 · Telão: 9
- Páginas por tema: 4 durante a volta, 2 no fim, 5 no resultado. Tela cheia sempre à vista (144×46; 197×50 em 1920), com a API ligada.
- "A noite": 0 linha cortada com 12 e 40 nomes, curtos e compridos, e com 3, 7, 9 e 10 fatos, em 1280 e 1920. Em 1920 o medidor acusa 2 px de sobra na altura da linha; olhei ampliado e nenhuma letra é cortada (igual à rodada 7).
- Ficha "N fatos ficaram no escuro" com `fato-falta.webp` (`fitaB/meu_12_7fatos_1920.png`).
- Mapa do telão: o Saguão usa `saguao.webp`; as 8 salas novas aparecem com miniatura nova.
- Retoque (igual à rodada 7): no simulador, o telão tem 745×419 fixos (58% da largura em 1280, 39% em 1920), e em 1280×720 só 122 px dos celulares aparecem.

### 9 · Entrada: 9
"Participar com código" (320×52/54), botão roxo com cadeado e "Só o Professor tem a chave" (320×58), "Abrir telão" e "Simulador" (155×52), "Jogar sem turma". Na área do Professor, os cartões de escolha agora têm miniatura 3D, e o portão do telão tem ícone 3D e botão de tela cheia. `simulador/`, `telao/`, `sala/telao/`, `sala/simulador/`, `museu/torre/?loop=1`, `sala/` e `individual.html` respondem 200. A tela de nome e forma de tratamento, depois do código, é a que pesa nos critérios 2 e 7.

---

## PARTE B · Peças 3D das 15 salas (Seção 5)

Mínimos: Pertencimento, Dedução, Segurança e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8.

**O que mudou desde a rodada 7:**
- 8 GLB novos, todos com Draco e WebP a 1024 px: Q01, D10, L08, N18, N17, DESC_B, REL_B e GAL_B (base nova + máscara V11).
- Pontos em lugar fixo na superfície de cada peça (`LOOP_PONTOS`), iguais nas 5 causas.
- Tamanho real gravado nos modelos (`escala_real`).
- Texto das pistas alinhado às peças.

Continua igual: nenhuma peça tem animação usada nem reage ao apagão; `exposure` 1,15 fixo; nenhum limite de giro da câmera.

Medidas dos modelos novos (`scr/stats.mjs`):

| Peça | Peso | Triângulos | Medidas (m) | Texturas |
|---|---|---|---|---|
| Q01 | 587 KB | 43.770 | 1,44 × 2,30 × 1,22 | 3 × 1024 |
| D10 | 576 KB | 58.314 | 2,08 × 2,10 × 1,74 | 3 × 1024 |
| L08 | 636 KB | 48.788 | 1,60 × 1,57 × 1,24 | 3 × 1024 |
| N18 | 294 KB | 24.942 | 3,20 × 2,42 × 3,18 | 3 × 1024 |
| N17 | 327 KB | 27.304 | 1,90 × 1,59 × 1,13 | 3 × 1024 |
| DESC_B | 266 KB | 22.412 | 3,30 × 2,48 × 3,29 | 3 × 1024 |
| REL_B | 617 KB | 68.394 | 3,60 × 3,45 × 1,54 | 3 × 1024 |
| GAL_B | 722 KB | 40.648 | 2,05 × 1,82 × 2,30 | 6 × 1024 (2 materiais) |

| Sala | Peça (KB) | Pert. | Ded. | Seg. | Cel. | Amb. | Din. | Pers. | Nov. | Viab. | Resultado | Antes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo | T01 (868) | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Central de monitoramento | S01 (840) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** | passa |
| Recepção | P01 (157) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Oficina técnica | M03 (821) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Oficina elétrica | E02 (420) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | passa (Viab. 8) |
| Ateliê de descobertas | L06 (866) + livro | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 8 | **PASSA** | passa |
| Sala de conservação | I01 (233) + livro | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **PASSA** | passa |
| Galeria especial | GAL_B (722) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 8 | **PASSA** | reprovava (Amb. 7) |
| Sala dos relógios | REL_B (617) | 9 | 9 | 9 | 9 | 8 | 8 | 8 | 8 | 9 | **PASSA** | reprovava (Amb. 7) |
| Área de descanso | DESC_B (266) | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | **PASSA** | reprovava (Pert. 8, Amb. 7) |
| Base da limpeza | L08 (636) | 9 | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 8 | **PASSA** | reprovava (Pert. 8, Amb. 6, Viab. 7) |
| Sala dos sons | N17 (327) + gravador | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | reprovava (Pert. 8, Amb. 6) |
| Sala da fotografia | N18 (294) | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8 | 9 | **PASSA** | reprovava (Amb. 6) |
| Pátio · Quadro externo | Q01 (587) | **8** | 9 | **8** | 9 | 8 | 9 | 9 | 9 | 9 | **reprova** (Pert., Seg.) | reprovava (Pert. 8, Amb. 7) |
| Sala das coleções | D10 (576) | **8** | 9 | 9 | 9 | 8 | 8 | 9 | 8 | 9 | **reprova** (Pert.) | reprovava (Pert. 6, Amb. 6) |

**Passam 13 de 15. Reprovam 2.** Nenhuma nota caiu nas 7 que já passavam. A Viabilidade da E02 voltou a 9, porque o tamanho real foi corrigido (1,5 m, como maquete).

### O que vi em cada peça nova (sala 390×844, museu 3D e 4 ângulos)

| Sala | O que a peça mostra | Bate com LOOP_DESC e com as pistas? |
|---|---|---|
| Galeria (GAL_B) | Máscara de pedra num pedestal de madeira com plaqueta, vitrine de vidro vazia, quadro torto na parede, rastro branco no piso | Sim: "quadro torto", "rastro de gesso", "a base", "papel atrás da base". Só 4 de 10 pontos à vista na entrada |
| Relógios (REL_B) | Parede com 11 relógios e plaquinhas, um elétrico branco com fio, relógio de pêndulo de caixa alta | Sim: "parede de relógios", "relógios elétricos param", "plaquinha", "pêndulo com a corda" |
| Área de descanso (DESC_B) | Porta de serviço com leitor de crachá, visor verde em cima da porta, caixa de passagem na parede, mural com recados e foto, cafeteira com xícaras, marcas de sola no piso | Muito: visor repetidor, caixa de passagem, mural/legenda, cafeteira, porta de serviço, sola lisa. Falta o guarda-chuva (secundário) |
| Limpeza (L08) | Carrinho com frascos, luvas amarelas, saco, balde com espremedor, esfregão, multímetro na prateleira de baixo, papel (recibo) | Sim: "carrinho", "balde do esfregão", "luvas", "multímetro molhado na prateleira de baixo", "recibo no carrinho" |
| Sons (N17) | Mesa com rádio de válvulas, gravador de rolo, alto-falante redondo, metrônomo, fios, caixa na parede | Sim: rádio, gravador, alto-falante de teste, metrônomo, caixa de fusíveis. O gravador agora faz parte da peça |
| Fotografia (N18) | Canto escuro com câmera de fole no tripé, 6 fotos na parede, varal com 3 fotos, luminária em cima do varal, bandeja de revelação, álbum na mesinha | Muito: "fotos da parede", "três fotos no varal", "luminária do varal", "câmera antiga", "álbum" |
| Pátio (Q01) | Pilar de tijolo com musgo, quadro cinza **de porta escancarada**, 3 chaves e medidor à vista, cadeado vermelho pendurado na porta aberta, para-raios de cobre com cabo descendo | O objeto é o certo. A cena contradiz 3 pistas, como explicado abaixo |
| Coleções (D10) | Estante de aço com caixas etiquetadas, caixa aberta, caixote, tubo encostado, caixas no chão | Estante e etiquetas batem ("caixa de banners", "etiqueta", "lista de entregas"). **Não há mancha vermelha nem pote de tinta** em nenhum ângulo |

### Por que as 2 reprovam

**Pátio · Q01: Pertencimento 8 e Segurança narrativa 8.**
Três pistas dizem que a porta do Quadro externo "está entreaberta, mas um cadeado pequeno prende a trava: ela não abre mais que uma fresta". Também dizem que, "com a chavinha, ... a porta abre inteira. Por dentro, três chaves numeradas".

No modelo, a porta está aberta a uns 100° e as 3 chaves e o medidor já aparecem antes de o jogador achar a chavinha. Isso tira a razão de ser da fechadura (princípio central da seção 5) e mostra antes da hora o que a chave deveria abrir. O cadeado do modelo é vermelho e está na porta; a pista "Pela fresta" fala de um segundo cadeado, amarelo, pendurado na chave. Não há chuva, mas isso fica no Ambiente 8 e não reprova.
- **Corrigível com texto: sim** (cerca de 60 a 80 palavras em `dados/pistas-v4.json`, ids "A porta do quadro", "Pela fresta do quadro", "Abrir o quadro", "Seguir o cabo pela fresta"). A porta pode ficar aberta e o cadeado passar a trancar a tampa de acrílico das chaves; ou o texto passa a dizer que a porta foi forçada e a tampa interna é que está presa. Depois, é preciso reavaliar a história (etapa 1 das escalas).
- **Com arte nova:** a alternativa é uma variação do Q01 com a porta quase fechada e o cadeado na trava. O pedido 1 de `PECAS-A-CONSEGUIR.md` precisaria dizer "porta entreaberta presa por cadeado".

**Coleções · D10: Pertencimento 8.**
A frase da sala, logo acima da peça, é "Uma estante de caixas etiquetadas e uma mancha vermelha no chão". Quatro pistas giram em torno da mancha: "A mancha no chão", "A mancha, medida com o pé", "A primeira pegada" e "Um vulto no chão" (pote de tinta vermelha virado). A peça não tem mancha, pote nem pegada. O que fecha a cena do crime da sala não está no objeto.
- **Corrigível sem arte nova, como provisório:** dá para compor por script, como já se fez com a base da GAL_A em `museu/pecas-compostas.mjs`. A composição põe um disco vermelho achatado no piso da D10 e, se o acervo tiver, um pote virado ao lado. Fica pobre perto do resto, mas aprova o pertencimento.
- **Com arte nova (o certo):** pedir uma variação do D10 com a poça de tinta vermelha, o pote virado e meia pegada saindo dela.
- Não dá para resolver com texto: a mancha é peça central do enredo.

### Observações que valem para as peças em diorama (não reprovam)
- N18, N17, DESC_B, REL_B e GAL_B são cantos de sala. De costas, mostram só parede lisa (`angulos/*.png`), e o jogo não limita o giro (`<model-viewer>` sem `min-camera-orbit`/`max-camera-orbit`). Quem gira a peça "procurando pontos" passa metade do giro olhando para uma parede vazia. **Só JS:** limitar o giro por peça (por exemplo, ±75° na horizontal) para as de canto ou parede.
- DESC_B mostra as marcas de sola no piso sempre. A pista "Pegadas no escuro" diz que elas só brilham no escuro, mas a marca à vista bate com "A porta de serviço" e com "Foto sem legenda", que estão sempre disponíveis. Mantive Segurança 9.
- Peso: GAL_B (722 KB), L08 (636 KB) e REL_B (617 KB) passam da meta de 600 KB. Todas abrem no modo 3D, em todas as salas, e os pesos de T01, S01, M03 e L06 (820 a 870 KB) continuam maiores.
- RA: as 8 novas e a E02 têm `escala_real` e medidas plausíveis (de 1,6 a 3,6 m; GAL_B já sai em metros). N18 e DESC_B giram 40 a 45° para ficar de frente.
- No museu 3D, o texto do cartão de Limpeza e Coleções está velho (`museu/torre/salas-loop.json`). Na Limpeza, o texto fala de "armário da equipe" e o L08 não tem armário. É só gerar o JSON de novo (texto).

---

## Resumo do que falta

| Item | Só CSS/JS/texto | Depende de arte ou modelo novo |
|---|---|---|
| A2 Ícones (8) | **Sim:** tirar o seletor "Bem-vindo/Bem-vinda/Tanto faz" (👨 👩 👥) da entrada com código, em `sala/firebase-room.js` | Só se quiser manter o seletor: 3 ícones 3D |
| A7 Linguagem (8) | **Sim:** "Como quer ser chamado" → "Seu nome nesta partida" e o mesmo seletor; de quebra, "Obrigado" → "Valeu" | Não |
| B · Pátio Q01 (Pert. 8, Seg. 8) | **Sim:** reescrever as 4 pistas da porta e do cadeado para combinar com a porta aberta do modelo (60 a 80 palavras) e reavaliar a história | Alternativa: Q01 com a porta presa por cadeado |
| B · Coleções D10 (Pert. 8) | Provisório: compor uma mancha vermelha e um pote por script (`pecas-compostas.mjs`) | **O certo:** D10 com poça de tinta, pote virado e meia pegada |

Retoques sem reprovação: limitar o giro dos dioramas; gerar de novo `museu/torre/salas-loop.json`; ícone da missão na página "Missões" do telão; energia de 18 → 22 px; enquadramento das 8 miniaturas novas; "Jogar sem turma" acima da dobra em 360.

**Fim do ciclo:** as escalas **não** passaram. Faltam 2 critérios da Parte A (2 e 7, os dois resolvíveis no mesmo ajuste de JS/texto na entrada com código) e 2 peças da Parte B (Q01 resolvível com texto; D10 pede composição provisória ou arte nova).
