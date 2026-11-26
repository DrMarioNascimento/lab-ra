# Loop · Ícones 3D a gerar

Documento de projeto (25/11/2026). Nada daqui aparece para quem joga.

Regra do projeto: ícone só em render 3D, próprio do Loop. Onde existe objeto da história, a tela já usa a miniatura 3D da peça (`museu/icones/<PEÇA>.webp`). O que está na lista B ainda é **provisório**: um emoji dentro de uma ficha com volume.

## Como gerar

- Um arquivo por ícone, 256 × 256 px, fundo transparente, formato `.webp`.
- Salvar em `cinco-minutos/museu/icones/ui/<nome>.webp`.
- Prompt-base (colar antes do objeto):

> ícone 3D renderizado, estilo miniatura de museu, latão envelhecido e esmalte azul-petróleo, detalhes em dourado quente (#e7b975) e verde-água (#83c6ac), luz quente de cima à esquerda, sombra suave embaixo, fundo transparente, sem texto, sem letras, objeto único centrado ocupando 85% do quadro:

## Como trocar depois de gerar

- Ícone já trocado por miniatura: é só salvar o arquivo novo por cima, com o mesmo nome. Nenhum código muda.
- Lista B (emoji em ficha): salvar o arquivo e trocar o emoji pelo nome indicado na coluna "Troca no código". Em `loop-central.js` a ficha aceita `'img:ui/<nome>'` no lugar do emoji; em `game.js` e `telao.mjs` basta pôr `<img src=".../ui/<nome>.webp">` dentro da ficha `.ic3d`.

## Situação em 25/11/2026 (revisão 7)

Revisão 7: nada mudou nesta lista. Os 6 provisórios da lista B continuam (a rodada 6 confirma que, trocados por render 3D bom, o critério de ícones passa). As páginas ganharam ícone de aba com a miniatura `T01`, que já existia (sem arte nova).

- **Trocados por miniatura 3D do próprio acervo: 20.** Os 7 que eram cópia do Mosaico Vila Ética e 13 emojis.
- **Continuam provisórios (emoji em ficha): 6.** Não há peça adequada em `museu/pecas`. Estão na lista B, abaixo.
- As miniaturas saem de `museu/icones/gerar.html` (render da peça, com ângulo, aproximação e luz por parâmetro).
- **Revisão 6, sem arte nova:** seis miniaturas refeitas em `gerar.html` com novo enquadramento (o gerador ganhou os parâmetros `alvoX` e `alvoZ`, para olhar para um canto da peça): `E02` (só a estante de baterias, com a placa de perigo), `DESC_A` (só a cortiça com as alavancas) e os 4 tipos de pista (fichário, câmera, gramofone e caixa de ferramentas mais perto e com mais luz). As versões anteriores ficaram ao lado, com o sufixo `_SUBSTITUIDO_2026-11-25h`. Os 5 minijogos "Olhe de perto" mostram a miniatura da sala ou da peça de que a pergunta fala, e a cena da luz mostra a máscara da Galeria (`GAL_A`). No resultado, as fichas das 3 provas têm 40 px e fundo claro.
- **Revisão 5, sem arte nova:** o ícone de tipo de pista passou para 32 px, em ficha clara e com a miniatura aproximada por CSS (20%); no telão, o círculo tracejado aparece uma vez só (ficha "N fatos ficaram no escuro"); a aba Atividades mostra as miniaturas das duas salas com 48 px.

### O que já foi trocado (nada a fazer)

| Ícone | Onde aparece | Peça usada |
|---|---|---|
| `ui/participar.webp` | Entrada; aba Passar pista | P02, balcão de entrada |
| `ui/conduzir.webp` | Entrada; área do professor ("Eu libero") | S01, console de comando |
| `ui/telao.webp` | Entrada; entrada do telão | S02, mesa com monitor |
| `ui/simulador.webp` | Entrada | CERA, figuras de cera (a turma de mentira) |
| `ui/caderno.webp` | Barra, caderno, pausa, Revelar, livros de folhear | livro do acervo (`museu/livro/modelos`) |
| `ui/alvo.webp` | Dossiê ("1 defeito"); pausa; telão | L02, microscópio |
| `ui/dupla.webp` | Atividades; Passar pista; início; telão ("Para conversar") | N16, rádio comunicador |
| `ui/mapa.webp` | Barra inferior (Mapa) | maquete do museu (`museu/museu.glb`) |
| `ui/sinal.webp` | Dossiê ("2 sinais"); etiqueta de sinal | F03, farol de luz |
| `ui/leitura-normal.webp` | Dossiê ("1 leitura normal"); etiqueta de leitura normal | R01, mostrador de parede |
| `ui/falta-ajustar.webp` | Defeito "Falta ajustar" | N03, relógio com mostradores |
| `ui/dois-defeitos.webp` | Defeito "Dois defeitos juntos" | V27, motor de engrenagens |
| `ui/pista-registro.webp` | Lista da sala: pista escrita | I01, fichário |
| `ui/pista-observacao.webp` | Lista da sala: coisa que se vê | V25, câmera de fole |
| `ui/pista-relato.webp` | Lista da sala: o que alguém conta | V44, gramofone |
| `ui/pista-objeto.webp` | Lista da sala: objeto que se leva | M01, caixa de ferramentas |
| fita do tempo (10 linhas) | Telão, página "A noite" | miniatura da sala onde o fato aconteceu (V13, P01, V11, DESC_A, V12, E01, S01, L05, T01, M03) |
| energia nas Atividades | Aba Atividades ("1 de energia") | E01, quadro elétrico |
| etiqueta "leitura completa" | Dossiê e caderno | T01, a Câmara |
| escolhas do professor | Área do professor | R02 (sozinho) e `ui/conduzir` (eu libero) |

Se quiser ícones desenhados no estilo latão e esmalte no lugar dessas miniaturas, os prompts antigos continuam valendo: é só salvar o arquivo novo por cima, com o mesmo nome.

## Lista B · continuam provisórios (emoji em ficha): gerar e trocar

| # | Nome sugerido | Emoji de hoje | Onde aparece | Troca no código | Prompt (depois do prompt-base) |
|---|---|---|---|---|---|
| 1 | `saguao.webp` | 🚪 | Cartão do Saguão no mapa do celular e do telão | `game.js`, `renderGame()`; `telao.mjs`, `pgMapa()` | uma porta dupla de madeira escura com grade de segurança de latão meio abaixada |
| 2 | `manual.webp` | 📘 | Etiqueta das pistas de manual no dossiê | `loop-central.js`, `lcEtqIcone` | um livro técnico de capa azul-petróleo com cantoneiras de latão e uma engrenagem gravada na capa |
| 3 | `uma-tentativa.webp` | ☝️ | Aba Revelar ("Uma tentativa na noite inteira") | `loop-central.js`, `lcPainelHtml()` | um carimbo de madeira com base de latão, de pé, com a almofada vermelha ao lado |
| 4 | `missao.webp` | 🕵️ | Cartão "Sua missão secreta" | `loop-central.js`, `lcMissaoHtml()` | um envelope de papel pardo fechado com lacre de cera vermelha |
| 5 | `energia.webp` | ⚡ | Ao lado do número de energia (ficha "Energia", rótulo "1 ⚡" das pistas, linha de energia da sala) | `loop-central.js`; `game.js`; `noites-motor.js` | uma pilha de latão com um anel dourado aceso e um raio pequeno gravado |
| 6 | `fato-falta.webp` | círculo tracejado | Telão, fita do tempo: ficha única dos fatos que ninguém achou | `ritmo.js`, `loopFitaHtml()` (classe `tl-vago`) | uma moldura de latão vazia com um ponto de interrogação em relevo no centro |

## Apoios pequenos que continuam como emoji (permitido pelo padrão)

Ao lado de texto, sem papel de ícone principal: 🔒 no botão "Conduzir como professor", ⚡ depois do número de energia, ✓ nos selos "no caderno" e "feito".

## Miniaturas de peça com novo enquadramento (feito na revisão 4)

`E02` (Oficina elétrica: câmera mais baixa e mais perto dos painéis), `R02` e `N05` (aproximadas na parte de cima, que é o que se reconhece) e `V41`. As salas da Galeria, dos relógios e da Área de descanso usam agora as peças compostas `GAL_A`, `REL_A` e `DESC_A`, com miniatura própria. Ainda vale conferir a `E02` no mapa: melhorou, mas "gerador e fusíveis" continua difícil de ler num quadro de 48 px.

## Lista C · miniaturas a refazer (pedido da rodada 4; nenhuma é provisória)

**Revisão 6:** os itens 1, 2 e 3 foram refeitos por novo enquadramento, sem arte nova (ver "Situação"). Continuam na lista só para quem quiser trocar por ícone desenhado: os prompts valem. O item 1 mostra a estante de baterias, porque o modelo `E02` não tem painel de fusíveis; para o painel, só com arte nova. O item 4 continua como está.

São miniaturas 3D do acervo que já estão no ar, mas leem mal no tamanho em que aparecem. Refazer em `museu/icones/gerar.html` (novo enquadramento) ou gerar com o prompt-base, e salvar por cima, com o mesmo nome.

| # | Arquivo | Onde aparece | Problema | O que fazer / prompt (depois do prompt-base) |
|---|---|---|---|---|
| 1 | `E02.webp` | Oficina elétrica no mapa (40 a 48 px) e no telão | A sala inteira vira uma laje cinza | Enquadrar só o painel de fusíveis. Prompt: um painel de fusíveis de parede com porta aberta, três fileiras de fusíveis de vidro e um par de luvas de borracha pendurado ao lado |
| 2 | `DESC_A.webp` | Área de descanso no mapa e na fita do telão | Sofá e cortiça têm 3,8 m de largura: viram dois traços | Enquadrar só a cortiça com as alavancas. Prompt: um quadro de cortiça com recados presos e uma fileira de alavancas de latão embaixo |
| 3 | `ui/pista-registro.webp`, `ui/pista-observacao.webp`, `ui/pista-relato.webp`, `ui/pista-objeto.webp` | Lista da sala, 32 px | Quatro objetos escuros e parecidos | Fundo claro e silhueta forte. Prompts: uma ficha de arquivo de papel creme com um clipe de latão; um olho de vidro dentro de uma lupa de latão; um balão de fala esmaltado azul-petróleo com borda de latão; uma chave antiga de latão com etiqueta de papel |
| 4 | `ui/participar.webp`, `ui/telao.webp`, `ui/sinal.webp`, `ui/simulador.webp` | Entrada; dossiê | Estilos misturados (móvel branco liso, farol de desenho, figuras de cera) ao lado de peças de latão escuro | Prompts: um balcão de entrada de madeira escura com sineta de latão; uma tela de projeção em moldura de latão sobre tripé; uma luz de aviso de latão com cúpula vermelha acesa; três celulares de latão em pé, lado a lado, com a tela acesa em verde-água |
