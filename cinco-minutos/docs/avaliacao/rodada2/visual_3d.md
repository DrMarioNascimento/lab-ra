# Loop · Rodada 2 · Avaliação visual (Parte A) e das peças 3D (Parte B)

Data: 25/11/2026. Avaliador: interface de celular e peças 3D. Nenhum arquivo do repositório foi alterado.

Fontes: 17 telas em `/tmp/roda/esc/r2/vis/` (todas lidas), capturas novas em `/tmp/roda/esc/r2/vis_extra/` (entrada inteira, manual, sala da Central, enigma do cofre, fim do dossiê, Mestre, participante, minijogos, telão durante a partida, simulador com Mestre automático, folhas de contato das 93 miniaturas, candidatos do LAB-RA), medição automática de alvos de toque e de estouro de largura em 390 px e 360 px, `style.css`, `sala/sala.css`, `bancada.css`, `game.js`, `loop-central.js`, `sala/telao/telao.mjs`, `dados/pistas-v4.json`.

---

## PARTE A · Padrão visual (9 critérios, mínimo 9)

### Tabela de notas

| # | Critério | Nota | Passa? | Justificativa em uma linha (tela) |
|---|---|---|---|---|
| 1 | Profundidade 3D | 7 | não | Botões, cartões de sala e abas têm volume e afundam; a lista de pistas (06), as provas do Revelar (10), o "×" e os links de texto são chapados e não reagem |
| 2 | Ícones | 5 | não | Só o mapa (04) usa render 3D; a Máquina inteira usa emoji como ícone principal (08, 09, 10), o Saguão e o telão usam glifo chapado (✦ ◈ ▣), e 6 miniaturas do mapa mostram objeto que não é da sala (insetos na Recepção e na Oficina elétrica) |
| 3 | Muito visual | 6 | não | Mapa e sala com peça são ótimos; entrada (01), início (03), pausa (12), caderno (11), Passar pista (10) e lista de pistas (06) são só texto em cartão escuro |
| 4 | Paleta coerente | 7 | não | Azul-noite e dourado estão firmes; o verde-água quase não aparece, `sala/index.html` (02) tem outro visual (botão verde vivo, caixa alta) e os minijogos usam outra paleta |
| 5 | Celular | 6 | não | Nada estoura em 390/360 px, mas há 9 tipos de alvo abaixo de 44 px, a lista de pistas desperdiça tela (1 coluna) e o botão flutuante "Máquina" cobre cartão e rótulo (04, 06) |
| 6 | Estabilidade | 6 | não | Pista coletada pula para o fim da lista (06→07), o rótulo da pista muda de largura e quebra linha, o aviso "Pista guardada" cai em cima da lista e do botão Máquina (07) |
| 7 | Linguagem | 7 | não | 2ª pessoa e papel claro no manual; mas há 3 nomes para a mesma coisa (dossiê/caderno/registro), Loop × Volta, Mestre × Professor, frases formais ("Usá-las não impede a pontuação nesta bancada") e texto de projeto visível ("Bancada experimental do LAB-RA") |
| 8 | Telão | 4 | não | Sem páginas por tema; o mapa estoura o cartão e é cortado embaixo (Térreo pela metade, Subsolo some); nome de sala com ~1 vw não se lê de longe; botão de tela cheia existe mas fica invisível |
| 9 | Entrada | 6 | não | `index.html` (01) segue o padrão (código, roxo com cadeado, telão, simulador), mas o roxo leva a uma segunda entrada fora do padrão (02: "Abrir uma mesa"), o simulador é um link de 15 px e há um botão extra acima do padrão |

**Resultado: 0 de 9 critérios atingem 9. Média 6,0.**

### Critério 1 · Profundidade 3D — nota 7

O que está certo: `.btn`, `.room`, `.lc-aba`, `.lc-causa`, `.lc-fab`, `.text-button.info` têm sombra dura, brilho em cima e `:active` que afunda.

Defeitos e correções:

- **Lista de pistas chapada (06, 07).** `.clue` (style.css, regra `.clue{...}`) não tem sombra dura nem `:active`.
  Acrescentar: `.clue{border-radius:12px;box-shadow:inset 0 1px 0 #ffffff2b,0 4px 0 #05090d;min-height:56px}` e `.clue:active:not(:disabled){transform:translateY(3px);box-shadow:inset 0 1px 0 #ffffff15,0 1px 0 #05090d}`. Para a registrada: `.clue:disabled{box-shadow:inset 0 2px 4px #0008;transform:translateY(2px);opacity:.6}` (fica "afundada", o que também comunica o estado).
- **Provas do Revelar (10_revelar).** `.lc-provas label` é uma caixa de seleção nativa de 20 px com texto. Usar o mesmo molde de `.lc-causa`: `.lc-provas label{display:flex;gap:10px;align-items:center;min-height:56px;padding:10px 12px;border-radius:12px;background:linear-gradient(180deg,#294051,#172633);box-shadow:inset 0 1px 0 #ffffff2b,0 4px 0 #05090d}` e `.lc-provas label:has(input:checked){background:linear-gradient(180deg,#f2d3a0,#be8e4b);color:#1f1b17;transform:translateY(2px);box-shadow:0 2px 0 #05090d}`.
- **Cartões de pista do dossiê (09).** Têm faixa colorida à esquerda, mas a caixa de marcar é nativa e o cartão não afunda ao marcar. Aplicar `:has(input:checked)` com `transform:translateY(2px)` e borda dourada.
- **Fechar (`.close`, `.lc-x`) e links de texto (`.text-button`: "Como jogar", "Dossiê 0", "Ver mapa").** São texto solto. Dar o molde do "i" da sala: `.close,.lc-x{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:linear-gradient(180deg,#294051,#172633);box-shadow:inset 0 1px 0 #ffffff2b,0 3px 0 #05090d}` + `:active{transform:translateY(2px)}`; `.text-button{min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid #d7bd8b55;background:linear-gradient(180deg,#203546,#172b3b);box-shadow:0 3px 0 #05090d}`.
- **Fichas de regra da Máquina (08: "2 sinais", "1 leitura normal", "1 defeito"; 10: "Dupla", "1 de energia").** Parecem botões (têm volume) mas não são tocáveis. Ou tirar a sombra dura delas (`box-shadow:inset 0 1px 0 #ffffff14`, fundo mais plano) ou torná-las tocáveis. Hoje confundem: o aluno toca e nada acontece.
- **Minijogo da foto (e14_mini_tombo_2).** `.lc-banc .foto-grid .encaixe` tem `box-shadow:none`. Trocar por `box-shadow:inset 0 2px 6px #000a` (encaixe fundo) e dar `0 3px 0 #101a1c` aos fragmentos.

### Critério 2 · Ícones — nota 5

- **Emoji como ícone principal em toda a Máquina.** 🧭 no botão e no título, 🚨 ✅ 🎯 nas fichas, 🔢 ⚡ 🏺 🔌 ✌ nas 5 causas, 🗣👂 ⚡ 🔧 nas Atividades, 🏛 📒 ☝ no Revelar, 🕵 na missão, ⚪ no título de cada atividade, 🚨/✅/📘 nas etiquetas. O padrão só aceita emoji como apoio. Trocar por imagens `<img class="ic3d">` de render 3D próprias do Loop (tamanho 40×40 nas causas, 32×32 nas fichas, 22×22 nas etiquetas), em `museu/icones/ui/`. Lista para gerar abaixo.
- **Saguão superior (04): estrela ✦ chapada** dentro de um cartão que é o ponto de partida de todo mundo. Trocar por miniatura 3D do saguão (ou da maquete `museu-andares.glb` já existente, recortada).
- **Telão (e12): cada sala com glifo chapado** (`<i>${r.icon}</i>` em `telao.mjs`, função `mapa()`). O celular já usa `museu/icones/<peca>.webp`; usar o mesmo no telão: `<img src="../../museu/icones/${r.peca}.webp">` com `.tl-sala img{width:3.2vw;height:3.2vw;object-fit:contain}`.
- **Miniatura que não é da sala (04b).** Recepção = borboletas, Oficina elétrica = besouro, Sala das coleções = insetos alfinetados, Sala dos espécimes = formigas, Ateliê = fósseis em fila, Área de descanso = microscópio, Pátio de luz = galho. O ícone é de boa qualidade, mas ensina a coisa errada. Resolve junto com a Parte B.
- **Miniaturas pequenas demais dentro do cartão.** B02 (coleções) e L01 (ateliê) viram pontinhos: a peça ocupa menos de 30% da miniatura. Regerar as miniaturas com enquadramento justo (peça ocupando ≥ 80% do quadro) em `museu/icones/gerar.html`.

Ícones 3D a gerar (um arquivo por ícone, fundo transparente, 256×256, só do Loop). Prompt-base: *"ícone 3D renderizado, estilo miniatura de museu, latão envelhecido e esmalte azul-petróleo, luz quente de cima à esquerda, sombra suave embaixo, fundo transparente, sem texto, objeto único centrado ocupando 85% do quadro:"* + objeto:

1. Máquina (botão e título): bússola de latão com engrenagem no centro.
2. Sinal de defeito: sirene pequena de latão com cúpula âmbar acesa.
3. Leitura normal: mostrador redondo com ponteiro no verde.
4. Defeito escolhido: alvo de latão com um pino no centro.
5. Painel desregulado: três mostradores pequenos com ponteiros em posições diferentes.
6. Falta de potência: bateria de vidro com carga baixa e raio gravado.
7. Peça errada na base: pedestal com peça de pedra torta em cima.
8. Algo desligado de propósito: plugue de tomada solto ao lado da tomada.
9. Dois defeitos juntos: duas engrenagens quebradas encaixadas.
10. Dupla: dois fones de interfone de latão ligados por um fio.
11. Energia: pilha de latão com anel dourado aceso.
12. Conserto: chave inglesa de latão.
13. Recepção (Revelar): balcão pequeno com sineta.
14. Caderno: caderno de capa de couro com fita marcadora.
15. Uma tentativa: carimbo de madeira.
16. Missão secreta: envelope lacrado com cera vermelha.
17. Manual: livro técnico azul com cantoneiras de latão.
18. Saguão superior: porta dupla com grade de segurança.

### Critério 3 · Muito visual — nota 6

- **Entrada (01):** só texto e campos. Colocar acima do título a miniatura da máquina do tempo (`museu/icones/T01.webp`, 120 px) ou o relógio dourado que já existe na tela inicial (e09, fim da página); um ícone 3D em cada cartão (celular com código no "Participar", chave roxa no "Conduzir").
- **Início individual (03):** 4 botões empilhados sem ícone e o relógio bonito fica fora da primeira tela. Subir o relógio para o topo (`.hero-art{grid-row:1;height:200px}` no celular) e pôr os 4 botões em grade 2×2 com ícone.
- **Pausa (12):** parede de texto. Transformar "8 pistas registradas" e "2/5 loops" em duas fichas com ícone e barra de 5 passos (5 bolinhas, 2 acesas); o parágrafo "Volta 3 · Prepare a intervenção…" vira 2 ou 3 fichas de tarefa com ícone (ex.: "Gravar o gesto no Pátio", "Levar a peça verdadeira ao Subsolo").
- **Caderno (11):** texto corrido. Cada pista como cartão com a miniatura da sala de origem à esquerda (48 px), faixa colorida do tipo (a mesma do dossiê da Máquina) e o título em negrito.
- **Lista de pistas (06):** 9 linhas de texto iguais. Pôr um ícone por tipo de objeto (papel, aparelho, pessoa, objeto que se leva) e cor na borda esquerda conforme o custo (sem custo = verde-água; 1 de energia = dourado).
- **Passar pista (10_trocar):** 4 linhas de texto e nada mais. Mostrar o esquema em 3 desenhos: quem passa mostra o código → quem recebe digita → os dois contam com as próprias palavras.
- **Manual (e02, e10):** é texto do começo ao fim e, antes do prólogo, tem 3 parágrafos. Reduzir a 1 frase de papel + 1 de objetivo e dar a cada passo do prólogo um desenho (as miniaturas das salas servem).
- **Telão:** ver critério 8.

### Critério 4 · Paleta coerente — nota 7

- **Verde-água não aparece.** `--green:#83c6ac` existe e quase não é usado; o único verde da tela é o cartão do Saguão, que é oliva (`#33432f`). Dar ao verde-água um papel fixo: "já feito / registrado / confirmado" (pista registrada, ponto da peça já tocado, prova marcada, cartão do Saguão). Trocar `.inicio` e `.tl-sala.inicio` para `background:linear-gradient(145deg,#1f4a44,#12302c);border-color:#83c6ac88`.
- **`sala/index.html` sem código (02) tem outro visual:** selo "DRAGON GAMES · LOOP", botões em caixa alta com espaçamento largo e botão verde vivo (`#6fd08c`). Aplicar `.btn.primary` dourado e `.btn.secondary` do jogo, sem caixa alta.
- **Minijogos (`bancada.css`):** fundo `#162226` esverdeado, `--gold:#f1c27d`, borda `#927b59`, botões `#34474a` e texto todo em Georgia. Alinhar: `.lc-banc{background:#111f2d;border-color:#d0ad7480;--gold:#e7b975}`, `.lc-banc button{background:linear-gradient(180deg,#294051,#172633);border-color:#d7bd8b55;font:700 .9rem system-ui}`.
- **Enigma do cofre (e05):** janela com fundo quase preto e texto em Georgia, diferente das outras janelas (`#111f2d`, system-ui). Igualar ao `dialog` padrão.
- **Barra roxa no prólogo (e02):** o roxo é a cor do professor. No prólogo do aluno usar dourado (`border-left-color:var(--gold)`).
- **Duas famílias de letra misturadas sem regra:** Georgia em títulos, mas também em textos corridos do cartão do Saguão, do enigma e dos minijogos; system-ui no resto. Regra fixa: Georgia só em título; todo texto corrido e botão em system-ui.
- **Cor por tipo:** as etiquetas do dossiê (vermelho = sinal, verde = leitura normal, azul = manual) estão corretas e fixas; levar as mesmas três cores para a lista de pistas da sala e para o caderno, que hoje não têm cor nenhuma.

### Critério 5 · Celular — nota 6

Medição (390 e 360 px): nenhuma tela estoura a largura. Alvos abaixo de 44 px:

| Seletor | Tamanho medido | Correção |
|---|---|---|
| `.lc-aba` (abas da Máquina) | 96×38 | `min-height:46px;padding:12px 8px` |
| `.lc-x` (fechar a Máquina) | 33×33 | `width:44px;height:44px` |
| `.close` (fechar manual/caderno) | 33×41 | `min-width:44px;min-height:44px` |
| `.text-button` ("Como jogar", "Dossiê 0", "Ver mapa", "Jogar em grupo") | 36 de altura | `min-height:44px` |
| `.lc-gi` ("?" do dicionário) | 22×22 | manter o desenho e somar área: `.lc-gi{position:relative}.lc-gi::after{content:"";position:absolute;inset:-11px}` |
| `summary` ("Como funciona", "Dicionário das palavras", "Sem dupla?", "Examinar pela lista") | 20 de altura | `summary{min-height:44px;display:flex;align-items:center}` |
| `.ent-links a` (simulador) e `.ent-sozinho a` | 15 e 16 de altura | virar `.btn secondary` (ver critério 9) |
| `.back` ("LAB-RA") | 73×21 | `padding:12px 0;display:inline-block` |
| Campo "Nome de quem trocou a peça" | 43 | `min-height:48px` |

(Os pontos da peça `.hs` têm 26 px, mas a área de toque sobe para 50 px com o `::after{inset:-12px}`: aprovado. As caixas de marcar de 20 px estão dentro de `label` grande: aprovado.)

Outros defeitos:

- **Botão flutuante "Máquina" cobre conteúdo:** tampa o cartão "Oficina elétrica" e seu subtítulo (04), o rótulo da última pista visível (06) e o título "O que você já sabe?" (05). Dar respiro ao fim da página (`main{padding-bottom:84px}`) e, no mapa, fazer a grade terminar antes dele; melhor ainda, trocar o flutuante por uma barra fixa de 3 botões embaixo (Mapa | Máquina | Caderno), que também tira "Ver mapa" e "Dossiê" do cabeçalho.
- **Cabeçalho fixo da sala (05, 06):** o título "Subsolo · Câmara do tempo" encosta no relógio, e o relógio (4 linhas, 130×100 px) ocupa quase 1/8 da tela. Reduzir o relógio a 2 linhas no modo investigação (`.investigando .timer small{display:none}` + tempo em 1,4 rem) e dar `text-overflow:ellipsis` ao título.
- **Lista de pistas com pouco por tela (06):** 9 linhas de 74 px. Em 2 colunas (`.clue-list{grid-template-columns:1fr 1fr}` com o custo embaixo do nome, cartão de 64 px) cabem 18.
- **Mapa (04):** só 4 salas visíveis antes de rolar, porque título, texto e cartão do Saguão ocupam 500 px. Esconder a frase "Todo mundo começa no Saguão…" (já está no cartão do Saguão) e compactar o cartão do Saguão em uma linha: cabem 9 salas.
- **Texto pequeno demais:** rótulo da pista (`.clue small`, ~12 px), sublinha do cartão de pista do dossiê ("Subsolo · Câmara do tempo", ~11 px) e texto do relógio ("Minuto da volta", ~10 px). Mínimo 13 px.

### Critério 6 · Estabilidade — nota 6

- **Pista coletada pula para o fim (06 → 07).** `style.css`: `.clue-list .clue:disabled{order:1}`. A lista inteira sobe uma posição a cada toque e o dedo do aluno passa a apontar para outra pista. Remover a regra; a pista registrada fica no lugar, afundada e com o selo verde-água.
- **Rótulo da pista muda de tamanho.** `.clue small` não tem largura: "Examinar · 1 de energia" quebra em 2 linhas com recuo diferente em cada linha, "Registrada" cabe em 1, "Disponível em 0:42" muda a cada segundo. Fixar: `.clue{display:grid;grid-template-columns:1fr 7.5rem;align-items:center}` `.clue small{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}` e encurtar o texto ("1 ⚡", "grátis", "em 0:42").
- **Aviso "Pista guardada no caderno" (07)** aparece em cima da lista e encostado no botão Máquina. Reservar faixa própria: `.toast{bottom:84px}` ou mostrar o aviso dentro do cabeçalho fixo, em área de altura fixa.
- **Sinal do museu** (`.museum-signal:not(:empty)`) nasce com `padding` quando o estrondo acontece e empurra a sala para baixo. Reservar a altura: `.museum-signal{min-height:2.9rem}` (o telão já faz isso em `.tl-sinal`).
- **Relógio do cabeçalho:** "aguardando escolha" (2 linhas) × "tempo em andamento" (1 ou 2 linhas conforme a largura) muda a altura da caixa (04 × 05). `.timer{min-height:104px;width:130px}` e status com `min-height:2.2em`.
- **Linha de estado da Máquina** ("Volta 2 de 5 · Diagnóstico aberto · Máquina travada · 4 de energia") quebra em pontos diferentes conforme o valor. Virar 4 fichas de largura fixa em grade (`grid-template-columns:repeat(4,1fr)`).
- **Minijogo da caixa (e14_mini_c_esc_1):** a cena aparece vazia no primeiro passo (retângulo liso de 250 px) e só ganha desenho depois. Mostrar a caixa fechada desde o início.
- **Lembrete `.loop-reserva` e painel `#intervention`** entram e saem do meio da sala; reservar o espaço ou colocá-los depois da lista.

### Critério 7 · Linguagem — nota 7

O que está certo: "Nesta atividade você vive o papel de uma pessoa que investiga o museu do Loop." (afirmação de papel clara, sem gênero); "Gire a peça e toque nos pontos que brilham."; "Falta uma prova? Ache nas salas, peça a alguém na pausa…".

Trocas sugeridas:

| Onde | Hoje | Sugestão |
|---|---|---|
| 03 | "Explore uma sala a cada volta, reúna pistas e antecipe o acontecimento antes que o tempo acabe." | "Você entra numa sala a cada volta, junta pistas e descobre o que vai acontecer antes do tempo acabar." |
| 03 | "Bancada experimental do LAB-RA" | tirar (é nota de projeto) |
| 03 / 01 | "Jogar individualmente" × "Jogar sem sala" | um nome só: "Jogar sem turma" |
| 03 | "Conhecer a experiência" | "Ver como funciona" |
| 04, 05, 12 | "LOOP 2 DE 5", "loops concluídos" × "Volta 2 de 5" | sempre "Volta" (Loop fica só como nome do jogo) |
| 04, 11, 05, 07 | "Dossiê 0", "Dossiê de pistas", "Seu registro", "Pista guardada no caderno", "Abrir dossiê completo" | um nome só: "caderno" para o que é seu; "dossiê" só para o da Máquina |
| 04 | "Informações permanecem no dossiê quando o tempo retorna." | "O que você anota no caderno fica com você quando o tempo volta." |
| 11 | "Peça até três orientações graduais. Usá-las não impede a pontuação nesta bancada." / "Pedir orientação" | "Travou? Você pode pedir até 3 dicas. Pedir dica não tira ponto." / "Pedir dica" |
| 12 | "Prepare a intervenção. Confira o que precisa ser feito em outra sala ou numa volta anterior…" | "Hora de preparar o conserto. Veja o que você precisa deixar pronto em outra sala." |
| 08 | "Diagnóstico aberto · Máquina travada" | "Você ainda não sabe o defeito · A máquina está travada" |
| 08 | "Cumprir rende +1 de energia na volta seguinte." | "Se você cumprir, ganha +1 de energia na próxima volta." |
| 10_trocar | "Contem com as próprias palavras." | "Conte com as suas palavras." (a tela fala com uma pessoa) |
| 02 | "O Mestre abre a mesa neste celular… O telão, se houver, entra pela porta Telão do hub com o mesmo código." | "Você abre a sala neste celular. A turma entra pelo QR code ou pelo código. No PC ou na TV, abra o telão com o mesmo código." |
| 01, 02, barra | "Mestre da sala", "Mestre", "Entrar como Professor" | um nome só: "Professor" (é o do padrão de entrada) |
| 05 | "A caminhada leva 10 segundos." | "Andar até outra sala leva 10 segundos." |
| e05 | "Se faltar uma dica, feche e procure outras pistas desta sala." | bom; só trocar "Decifrar" por "Abrir" (é um cofre) |
| manual | marca escrita "Loop" | conferir se o autor quer "Mosaico Loop" por inteiro, como nos outros jogos |

### Critério 8 · Telão — nota 4

Visto em e12 (telão durante a volta), e13 (simulador) e 14 (entrada do telão).

- **O mapa estoura o cartão e é cortado.** `.tl-meio` tem `min-height:0`, mas `.tl-card` não tem `overflow` e a grade de 6 colunas com 30 salas + 4 títulos de andar passa de 100% da altura: a segunda fileira do Térreo sai do cartão e é cortada pelo fim da tela; o Subsolo (a sala mais importante) não aparece. É defeito funcional.
- **Sem páginas por tema.** `telao.mjs` desenha uma tela única por etapa. O padrão pede páginas navegáveis. Proposta de páginas, com setas ‹ › e bolinhas no rodapé (e troca automática a cada 12 s, que o professor pode travar):
  1. **Relógio**: volta, tempo gigante, sinal do museu.
  2. **Mapa**: um andar por vez ocupando a tela (4 subpáginas) ou as 15 salas da história em grade 5×3 com miniatura 3D de 6 vw e contador de gente.
  3. **Turma**: quem já escolheu sala, quem falta; energia do grupo.
  4. **Máquina**: estado do diagnóstico e do Revelar em 3 fichas grandes (sem mostrar pistas).
  5. **Entrada**: QR code grande e código, sempre a um toque.
- **Não se lê de longe.** `.tl-mapa .tl-sala b{font-size:clamp(.6rem,1vw,.95rem)}`: num telão de 1280 px dá 12,8 px. Mínimo para sala de aula: 1,6 vw (`clamp(1rem,1.6vw,1.6rem)`), o que só cabe com a paginação acima. `.tl-aviso` ("6 de 6 em um ambiente") também está em 1,3 vw: subir para 2 vw.
- **Glifo chapado em cada sala** (critério 2): usar as miniaturas 3D.
- **Salas vazias com `opacity:.5`** ficam ilegíveis no projetor. Usar `.tl-sala.vazia{opacity:1;filter:saturate(.6)}` e destacar as ocupadas com borda dourada grossa (`border:.25vw solid var(--gold)`).
- **Botão de tela cheia:** existe e funciona (`#fs`), mas tem `opacity:0` e só aparece ao mexer o mouse; numa TV comandada pelo celular ninguém o encontra. Deixar sempre visível fora da tela cheia: `.tl-fs{opacity:1}` e `:fullscreen .tl-fs{opacity:0}` (reaparece ao mover o mouse). Pôr também no cartão de entrada do telão (14), ao lado de "Abrir telão".
- **Entrada do telão (14):** cartão pequeno no meio de uma tela vazia; título "Telão da sala" em 24 px. Para TV: cartão com `width:min(60vw,720px)`, campo e botão com 2× o tamanho, botão ocupando a largura.
- **Metade esquerda desperdiçada:** o cartão do relógio ocupa 45% da tela com muito vazio; o sinal do museu fica vazio quase o tempo todo.

### Critério 9 · Entrada — nota 6

- `index.html` (01, e01) tem os dois cartões do padrão, o botão roxo com cadeado, "Só o Professor tem a chave", "Abrir telão" e o simulador. Certo.
- **O botão roxo leva a outra entrada, fora do padrão (02):** `sala/index.html` sem código mostra "Loop / ABRIR UMA MESA / ENTRAR EM UMA MESA", com selo "DRAGON GAMES · LOOP", botão verde, caixa alta, sem cadeado e falando em "mesa" e "hub". O professor vê duas entradas diferentes em dois toques, e o aluno que cair ali vê "Abrir uma mesa". Fazer o roxo já abrir a sala direto (ou pedir a chave), sem tela intermediária; se a tela ficar, aplicar o mesmo cartão "Conduzir" do padrão.
- **Simulador como link de 15 px** (`.ent-links a`). No padrão é um botão. Trocar por `<a class="btn secondary">Simulador</a>` (os dois, "Abrir telão" e "Simulador", lado a lado: `display:grid;grid-template-columns:1fr 1fr;gap:10px`).
- **Botão extra acima do padrão:** "Episódio visual: A peça que o museu esqueceu" fica antes do "Participar" e empurra o cartão do professor para fora da primeira tela (em 390×844 o botão roxo não aparece sem rolar). Levar para o fim, junto de "Jogar sem sala".
- **Rótulos:** "Mestre da sala" → "Conduzir como professor"; "Entrar com o código" → "Participar com código" (texto do padrão).
- **"Entrar" desativado** fica marrom-acinzentado e parece defeito de cor. `.btn.primary:disabled{filter:grayscale(.6);opacity:.55}`.
- **Terceira entrada:** `individual.html` (03) tem "Jogar em grupo", que abre outro caminho para a sala. Apontar esse botão para `index.html`.
- **Simulador (13, e13):** tem telão em cima e turma embaixo, como pede o padrão. Defeitos: os quadros dos participantes ficam com ~175 px de largura e cortam o conteúdo ("LAB-RA" quebra, o relógio aparece "00:2"); o telão do simulador não tem botão de tela cheia próprio; e **os minijogos aparecem sem estilo na sala** (botões cinza do navegador, e13 participantes 4 e 5), porque `loop-central.js` carrega `bancada.css?v=1` com caminho relativo à página e, a partir de `sala/`, isso dá **404** (conferido: `/sala/bancada.css` → 404; `/bancada.css` → 200). Correção: montar o endereço a partir do próprio script, como já é feito com `PECAS_URL`: `l.href = new URL('bancada.css?v=1', document.currentScript?.src || LC_BASE).href` (guardar a base numa constante no topo do arquivo). Para os quadros: `.sim-fone iframe{width:390px;height:844px;transform:scale(.6);transform-origin:0 0}` dentro de caixa de 234×506 px.

---

## PARTE B · Peças 3D das 15 salas da história (Seção 5 das escalas)

Mínimos: Pertencimento, Dedução, Segurança narrativa e Celular ≥ 9; Ambiente, Dinâmica, Persistência, Novidade e Viabilidade ≥ 8. Só passa quem atinge todos.

As 15 salas com pistas em `dados/pistas-v4.json`: prototipo, eletrica, patio, relogios, seguranca, recepcao, conservacao, atelie, deposito, galeria, manutencao, corredor, limpeza, sons, fotografia. A tabela avalia a **peça A** (a de `ROOMS`, que aparece no museu de origem e nas capturas); as versões B e C de `PECAS_ALT` vêm logo depois.

### Como a peça funciona hoje (vale para todas)

- `renderClues()` mostra o GLB num `model-viewer` e cria um ponto dourado por pista; há lista em texto como alternativa ("Examinar pela lista") e a lista abre sozinha se o modelo falhar ou demorar 5 s. Isso garante **Celular** e a saída de **Segurança**.
- **Os pontos não ficam no lugar que a história diz.** `pontosDaPeca()` espalha os pontos por sorteio (`hashTxt(clue.id)`) em volta do centro do modelo. "O botão vermelho" pode cair atrás de um relógio; "Gaveta do Braga" cai no ar ao lado do console. O objeto é da história, mas o ponto não. Por isso nenhum Pertencimento passa de 9, e o Ambiente fica limitado: não há cadeia de passos no modelo, só pontos soltos.
- **O modelo nunca muda.** A dinâmica vem só dos pontos (aparecem na hora certa do minuto da volta, ficam verdes) e da semente (lugar, nome e versão A/B/C). Nenhuma peça pisca, apaga ou abre.
- A mecânica é a mesma em todas as salas (girar e tocar). Só ganha **Novidade** a sala que soma outra coisa: cofre com código, ensaios da máquina, minijogo, livro de folhear, objeto para carregar, encontro com hora marcada.
- Código com razão de existir: o único código (cofre do Braga, 311) é justificado no mundo pelo bilhete "é igual à máquina lá embaixo: quantos mostradores, quantas luzes, quantos botões". Aprovado no princípio central.

### Tabela de notas (peça A de cada sala)

| Sala | Peça A | Pert. (9) | Ded. (9) | Seg. (9) | Cel. (9) | Amb. (8) | Din. (8) | Pers. (8) | Nov. (8) | Viab. (8) | Resultado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Subsolo · Câmara do tempo (prototipo) | T01 máquina do tempo | 9 | 9 | 9 | 9 | 8 | 9 | 9 | 9 | 8 | **PASSA** |
| Central de monitoramento (seguranca) | S01 central de comando | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 8 | **PASSA** |
| Oficina elétrica (eletrica) | B09 besouro verde | 2 | 9 | 9 | 9 | 4 | 8 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Pátio de luz · Quadro externo (patio) | B05 galho com folhas | 3 | 9 | 9 | 9 | 6 | 9 | 9 | 9 | 9 | reprova (Pert., Amb.) |
| Sala dos relógios (relogios) | N03 relógio de pulso moderno | 6 | 9 | 9 | 9 | 5 | 8 | 8 | 8 | 8 | reprova (Pert., Amb.) |
| Recepção (recepcao) | B01 borboletas | 2 | 9 | 9 | 9 | 4 | 8 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Sala dos espécimes / conservação (conservacao) | B04 formigas e besouro | 5 | 9 | 9 | 9 | 4 | 8 | 9 | 7 | 9 | reprova (Pert., Amb., Nov.) |
| Ateliê de descobertas (atelie) | L01 fósseis em fila | 3 | 9 | 9 | 9 | 4 | 8 | 9 | 7 | 9 | reprova (Pert., Amb., Nov.) |
| Sala das coleções (deposito) | B02 insetos alfinetados | 3 | 7 | 9 | 9 | 4 | 8 | 9 | 8 | 9 | reprova (Pert., Ded., Amb.) |
| Galeria especial (galeria) | F01 esqueleto de tricerátops | 5 | 9 | 9 | 9 | 6 | 8 | 9 | 9 | 9 | reprova (Pert., Amb.) |
| Oficina técnica (manutencao) | M01 caixa de ferramentas | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Área de descanso (corredor) | L02 microscópio e placas | 2 | 9 | 9 | 9 | 4 | 9 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Base da limpeza (limpeza) | L03 esfregão e balde | 8 | 9 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Pert., Amb.) |
| Sala dos sons (sons) | N07 rádio portátil | 8 | 9 | 9 | 9 | 5 | 8 | 8 | 7 | 9 | reprova (Pert., Amb., Nov.) |
| Sala da fotografia (fotografia) | N05 câmera de tripé | 9 | 7 | 9 | 9 | 6 | 8 | 9 | 8 | 9 | reprova (Ded., Amb.) |

**Passam 2 de 15** (Câmara do tempo e Central de monitoramento). As outras 13 reprovam; 8 delas se resolvem com peça que já existe.

### Por que cada uma reprova e o que falta

**Passam**

- **Câmara do tempo · T01.** É a peça da história (mostradores, válvulas, base). Tem cadeia de passos (ver, ler painel, ensaios, conserto), muda com a causa sorteada (26 das 37 pistas dependem da causa) e recebe objetos de outras salas (peça verdadeira, luva, chavinha). Ressalvas, sem reprovar: os pontos "Os 3 mostradores", "O botão vermelho" e "O ponteiro de carga" precisam ficar em cima dos mostradores, do botão e do ponteiro; 869 KB é o limite do que carrega bem em 4G. Versões B e C repetem T01 (não há variação de peça).
- **Central de monitoramento · S01.** Console com telas em anel: é um lugar para explorar, tem o cofre com código justificado, a fita da câmera e a escala de crachás. Ressalvas: o cofre do Braga não existe no modelo; o LAB-RA já tem `rec-cofre-balanca.glb` (cofre sobre base, em `biblioteca/dragon/jogos/o-eco-do-amanha/o-impostor/modelos/pecas/`), que pode entrar por composição. Versão B (S02, mesa com um monitor) cai para Pert. 8, porque a sala fala de várias câmeras; versão C (S03, parede de telas) passa.

**Reprovam, mas já existe peça que resolve (não precisa gerar nada)**

- **Oficina elétrica · B09 (besouro).** Sobra do museu de origem; nada a ver com lâmpadas, gerador, painel de fusíveis e gancho de luvas. **Trocar a peça A por E02** (central de energia do subsolo: sala inteira com painéis; Pert. 9, Amb. 9) e deixar E01 (quadro elétrico) como B. Com isso passa.
- **Recepção · B01 (borboletas).** As pistas são relógio, livro de visitas, roleta, telefone, gaveta. **Trocar a peça A por P01** (mesa de recepção com luminária e papéis, com base; Pert. 9, Amb. 8) e P02 como B. Passa. A roleta fica só em texto; se quiser fechar com 10, gerar uma roleta (opcional, prompt 6).
- **Sala dos espécimes · B04 (formigas).** O nome combina com insetos, mas as 15 pistas são papéis (registros, manual, diário, laudo, ata) e o próprio JSON chama a sala de "Sala de conservação". **Usar o livro de folhear como peça A** (`{livro:true}`, hoje versão B): cada pista vira uma página, o que dá Pert. 9, Amb. 8 e Nov. 9. Passa. Acertar também o nome (espécimes × conservação) para ficar um só. A versão C (B07, inseto sob vidro) reprova pelo mesmo motivo de B04.
- **Ateliê de descobertas · L01 (fósseis).** As pistas são fichas de ensaio, as 6 páginas do Manual da Câmara e a bancada da Ivone. **Trocar a peça A por L06** (bancada de projetos, cenário completo; Pert. 9, Amb. 9). Para a Novidade subir de 7 para 9, **mostrar as páginas do manual no livro de folhear** (mesmo mecanismo da sala de espécimes, capa "Manual da Câmara"). L07 (ferramentas espalhadas) fica com Pert. 6: tirar ou deixar só como C.
- **Oficina técnica · M01 (caixa de ferramentas).** Quase: é da oficina, mas é um objeto solto e as pistas são caixa de fusíveis, esquema elétrico, armário que destrava no apagão e bilhete atrás do quadro. **Trocar a peça A por M03** (bancada vermelha com painel de ferramentas; Pert. 9, Amb. 8). Melhor ainda: trazer cópia própria de `rec-armario-servico.glb` do LAB-RA (armário de serviço + quadro de avisos na parede, com base): bate com "O armário destravou" e "Bilhete atrás do quadro" (Pert. 10).
- **Galeria especial · F01 (tricerátops).** A história fala de uma peça de pedra de 300 anos, com rachadura, selo, verniz fresco, número na base e luz embaixo; um esqueleto não tem nada disso, e o jogador não reconhece nele "a peça principal" que foi trocada. **Usar V11 (máscara de pedra) como a peça principal**, composta com V13 (vitrine) ou sobre pedestal, via `museu/pecas-compostas.mjs` (como já foi feito em VEI_A): Pert. 9, Amb. 8. A V11 hoje é versão C da Sala de cera, que está em reforma na história: fica livre. Ganho extra: a mesma V11 pode aparecer dentro da caixa de "banners" nas Coleções como "a verdadeira". V14 (escultura abstrata branca) é a melhor B: lembra gesso, que é a pista do rastro.
- **Área de descanso · L02 (microscópio).** Nada a ver com sofá, cafeteira, recados e porta de serviço. **Compor V41 (sofá) + C02 (cortiça de recados com alavancas)** numa peça só: Pert. 9, Amb. 8. Passa. Sozinhas, V41 (objeto solto, Amb. 5) e C02 (Pert. 8) não chegam.
- **Sala dos relógios · N03 (relógio de pulso tático).** As pistas falam dos relógios da sala, de um relógio diferente, plaquinhas e de um pêndulo com corda; relógio de pulso moderno não tem pêndulo nem plaquinha, e com 973 KB é a peça mais pesada das 15. **Compor R02 (relógio de pêndulo) + R01 (relógio de parede com base)**: Pert. 9, Amb. 8, e o ponto "Pêndulo com a corda à mão" passa a ter onde ficar.

**Reprovam e precisam de modelo novo** (olhei as 93 miniaturas e os GLB do resto do LAB-RA; nada serve)

- **Pátio de luz · B05 (galho).** A sala mais mecânica da história depois da Câmara (quadro externo, cadeado vermelho, chave, disjuntor, cabo grosso, para-raios, medidor) aparece como um galho. As versões B (F03 farol) e C (N10 lanterna de rua) também não têm quadro nem para-raios. E01 é um quadro elétrico, mas de parede interna e sem para-raios (Pert. 8), e já serve à Oficina elétrica. **Prompt 1.**
- **Sala das coleções · B02 (insetos).** As pistas são caixas, prateleira, etiqueta de caixa vazia, a caixa de "banners" e o Téo no chão. I01 (fichário) fica em Pert. 7; o livro (C) em 8. Além disso o minijogo "Abrir a caixa do depósito" (deslizar a faixa, mover o painel, abrir a tampa) é quebra-cabeça de manuseio, reprovação típica da escala: trocar por uma pergunta que exija a história (qual caixa abrir? a de etiqueta "banners" que pesa demais para ser banner). Há um `prateleira.glb` em `angulos-licenciatura/assets/modelos/`, mas é de outro jogo (não consegui abrir aqui: compressão Meshopt) e convém conferir antes de gerar. **Prompt 2.**
- **Base da limpeza · L03 (esfregão e balde).** É do lugar, mas é objeto solto (Amb. 6) e as pistas citam o carrinho de limpeza, o armário com bilhete e o balde com multímetro. L04 e L05 também são objetos soltos. Saída barata: compor L03 + L05 + armário de serviço (Amb. 8). Saída certa: o carrinho, que já estava pedido em `docs/PECAS-A-CONSEGUIR.md` e não chegou. **Prompt 3.**
- **Sala dos sons · N07 (rádio portátil).** O rádio serve (gravador, pendrive, chiado), mas é um objeto solto (Amb. 5) e a sala não tem mecânica própria (Nov. 7). Faltam alto-falante de teste, metrônomo e armário de fusíveis. V44 (gramofone) não aceita pendrive (Pert. 5) e N16 (rádio comunicador) não grava (Pert. 6). **Prompt 4.** Para a Novidade: tocar de verdade a "Gravação no rádio" (áudio curto com legenda em texto) e fazer o metrônomo marcar o tempo da volta.
- **Sala da fotografia · N05 (câmera de tripé).** A câmera é da história (Pert. 9), mas é objeto solto (Amb. 6), e o minijogo "Remontar a foto antiga" é montar 6 pedaços por continuidade da imagem: destreza visual, não entendimento da história (Ded. 7). Trocar o minijogo por comparação (onde está a rachadura? qual o número da base?) e dar um ambiente. Composição N05 + V26 (projetor) ajuda, mas não traz fotos na parede nem a lâmpada do laboratório. **Prompt 5.**

### Versões B e C (resumo do que entra no sorteio)

| Sala | B | C |
|---|---|---|
| prototipo | T01 (igual à A) | T01 (igual à A) |
| eletrica | E01 quadro elétrico: passa | E02 central de energia: passa |
| patio | F03 farol: reprova (Pert. 3) | N10 lanterna de rua: reprova (Pert. 4) |
| relogios | R01 relógio de parede: Pert. 8, Amb. 8 | R02 pêndulo: Pert. 9, Amb. 6 |
| seguranca | S02 mesa com monitor: Pert. 8 | S03 parede de telas: passa |
| recepcao | P01 mesa de recepção: passa | P02 balcão com notebook: Pert. 8 |
| conservacao | livro do acervo: passa | B07 inseto sob vidro: reprova |
| atelie | L06 bancada de projetos: passa em tudo menos Nov. 7 | L07 ferramentas: reprova (Pert. 6) |
| deposito | I01 fichário: Pert. 7 | livro de inventário: Pert. 8 |
| galeria | V13 vitrine: Pert. 8, Amb. 7 | V14 escultura abstrata: Pert. 8, Amb. 6 |
| manutencao | M02 baú de ferramentas: Pert. 8, Amb. 6 | M03 bancada de ferramentas: passa |
| corredor | V41 sofá: Pert. 8, Amb. 5 | C02 cortiça e alavancas: Pert. 8, Amb. 8 |
| limpeza | L04 vassouras e balde: Amb. 6 | L05 cesto de produtos: Amb. 6 |
| sons | N16 rádio comunicador: Pert. 6 | V44 gramofone: Pert. 5 |
| fotografia | V25 câmera de fole: Pert. 9, Amb. 6 | V26 projetor: Pert. 8, Amb. 6 |

Consequência: como a semente sorteia A, B ou C, hoje o aluno cai numa peça reprovada na maior parte das salas, seja qual for o sorteio. Depois das trocas, o melhor é que as salas da história só sorteiem entre versões aprovadas (as outras 15 salas do museu podem continuar com o rodízio livre).

### Correções de código que valem para todas as peças

1. **Pontos no lugar certo.** Trocar o sorteio de `pontosDaPeca()` por uma tabela por peça, `PONTOS = { T01: { maq_botao: '0.12m 0.31m 0.20m', ... } }`, caindo no sorteio só quando a pista não estiver na tabela. Começar pelas 15 salas da história (224 pistas; bastam os pontos das pistas com objeto nomeado).
2. **Peça que reage.** No apagão (minuto 2:00 da volta), baixar `exposure` do `model-viewer` de 1.15 para 0.45 e acender os pontos; na Câmara, trocar a cor do brilho dos pontos conforme o estado da máquina. É mudança de atributo, sem modelo novo.
3. **Composições** em `museu/pecas-compostas.mjs`: REL_A (R02 + R01), GAL_A (V11 + V13), DESC_A (V41 + C02), LIMP_A (L03 + L05 + armário), SEG_A (S01 + cofre).
4. **Dois minijogos de manuseio** (foto em 6 pedaços; caixa de deslizar): trocar por pergunta que dependa da história.

### Modelos GLB a obter (5 obrigatórios + 1 opcional), com prompt pronto

Regras iguais às de `docs/PECAS-A-CONSEGUIR.md`: um conjunto só sobre base, sem pessoa, sem marca nem logotipo, GLB com textura PBR; a compressão (Draco + WebP, 1024 px, alvo ≤ 600 KB) é feita depois.

1. **Pátio de luz · quadro externo com para-raios (arquivo sugerido `Q01.glb`)**
   *"Outdoor electrical service panel in a small museum courtyard, low-poly realistic style: grey metal cabinet mounted on a short brick wall, door half open showing three large labeled breaker switches and one round analog power meter, a red padlock hanging on the door latch, a thick black cable running down the wall to the ground, a tall thin lightning rod with copper tip fixed to the wall beside the cabinet, small square stone floor base, a few wet paving stones, no people, no text, no logos, warm night lighting baked neutral, PBR textures, single object centered, GLB."*

2. **Sala das coleções · estante de depósito com caixas (`D10.glb`)**
   *"Museum storage room corner on a small floor base, low-poly realistic: one tall metal shelving unit with cardboard archive boxes of different sizes, paper tags tied to the boxes, one empty box lying open on the floor, one long box with a blanket corner sticking out, a rolled banner tube, a small crate of burnt light bulbs, dusty concrete floor tile, no people, no text, no logos, PBR textures, single object centered, GLB."*

3. **Base da limpeza · carrinho de limpeza (`L08.glb`)**
   *"Janitor cleaning cart for a museum, low-poly realistic: grey plastic cart with yellow mop bucket and wringer, mop standing in the bucket, shelf with generic unlabeled spray bottles and folded cloths, thick rubber gloves hanging on the handle, a small digital multimeter lying wet on the lower shelf, a paper receipt clipped to the side, small tiled floor base, no people, no brand names, no text, PBR textures, single object centered, GLB."*

4. **Sala dos sons · bancada de som (`N17.glb`)**
   *"Vintage sound test bench in a museum, low-poly realistic: wooden table with an old tube radio that has a built-in tape recorder and a small USB stick plugged in, one round test loudspeaker on a stand, a mechanical metronome, a coil of cable, and on the wall behind a small grey fuse cabinet with closed door, small wooden floor base, warm brass and walnut colors, no people, no text, no logos, PBR textures, single object centered, GLB."*

5. **Sala da fotografia · laboratório fotográfico (`N18.glb`)**
   *"Small photo darkroom corner in a museum, low-poly realistic: antique bellows camera on a wooden tripod, a wall panel with six framed black-and-white photos, a string with three photo prints hanging from clothespins, a developing tray with one wet print, a red safelight lamp on the wall, a photo album on a small table, small floor base, no people in the photos (use abstract shapes), no text, no logos, PBR textures, single object centered, GLB."*

6. *(opcional)* **Recepção · roleta de entrada (`P03.glb`)**
   *"Waist-high tripod turnstile for a museum entrance next to a short reception counter with a guest book, a desk bell and an old telephone, small wall clock above, low-poly realistic, small floor base, brushed steel and dark wood, no people, no text, no logos, PBR textures, single object centered, GLB."*

Antes de gerar: conferir `angulos-licenciatura/assets/modelos/prateleira.glb` (para o item 2) e `balcao.glb`/`recep.glb` (para o item 6), que não abriram aqui por usarem compressão Meshopt.

---

## As 8 correções de maior impacto

1. **Telão:** o mapa estoura o cartão e corta Térreo e Subsolo; dividir em páginas por tema (Relógio, Mapa, Turma, Máquina, Entrada), nomes de sala em ≥ 1,6 vw e botão de tela cheia sempre visível.
2. **Peças erradas em 8 salas da história, com solução já no acervo:** Oficina elétrica → E02, Recepção → P01, Espécimes → livro, Ateliê → L06 + manual no livro, Oficina técnica → M03, Galeria → V11 + V13, Descanso → V41 + C02, Relógios → R02 + R01.
3. **Ícones:** tirar emoji e glifo como ícone principal (Máquina, causas, fichas, Saguão, mapa do telão) e pôr render 3D próprio (lista de 18 com prompt); no telão, usar as miniaturas `museu/icones/*.webp`.
4. **Minijogos sem estilo na sala:** `bancada.css` dá 404 a partir de `sala/`; montar o endereço pela URL do script em `loop-central.js`.
5. **Lista de pistas:** tirar `.clue-list .clue:disabled{order:1}` (a pista pula), fixar a coluna do rótulo em 7,5 rem, dar volume e `:active` a `.clue`, e pôr em 2 colunas com ícone e cor por tipo.
6. **Entrada única:** o botão roxo não pode cair em `sala/index.html` "Abrir uma mesa" (outro visual, outro vocabulário); simulador como botão ao lado de "Abrir telão"; "Episódio visual" para o fim.
7. **Alvos de toque:** abas da Máquina (38 px), fechar (33 px), links de texto (36 px), "?" do dicionário (22 px), `summary` (20 px) e links do simulador (15 px) para ≥ 44 px; e tirar o botão flutuante "Máquina" de cima do conteúdo.
8. **Pontos da peça com sentido + 5 modelos novos:** trocar o sorteio de `pontosDaPeca()` por posições por peça e obter os GLB do Pátio, Coleções, Limpeza, Sons e Fotografia (prompts prontos), trocando os dois minijogos de manuseio (foto em pedaços, caixa de deslizar) por perguntas da história.
