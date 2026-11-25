# Loop · Ícones 3D a gerar

Documento de projeto (25/11/2026). Nada daqui aparece para quem joga.

Regra do projeto: ícone só em render 3D, próprio do Loop. Onde existe objeto da história, a tela já usa a miniatura 3D da peça (`museu/icones/<PEÇA>.webp`). O que está nesta lista ainda é **provisório**: ou um emoji dentro de uma ficha com volume, ou uma cópia de ícone do Mosaico Vila Ética (boa qualidade, mas com a cara e as cores de outro jogo).

## Como gerar

- Um arquivo por ícone, 256 × 256 px, fundo transparente, formato `.webp`.
- Salvar em `cinco-minutos/museu/icones/ui/<nome>.webp`.
- Prompt-base (colar antes do objeto):

> ícone 3D renderizado, estilo miniatura de museu, latão envelhecido e esmalte azul-petróleo, detalhes em dourado quente (#e7b975) e verde-água (#83c6ac), luz quente de cima à esquerda, sombra suave embaixo, fundo transparente, sem texto, sem letras, objeto único centrado ocupando 85% do quadro:

## Como trocar depois de gerar

- Lista A (cópias): é só salvar o arquivo novo por cima, com o mesmo nome. Nenhum código muda.
- Lista B (emoji em ficha): salvar o arquivo e trocar o emoji pelo nome indicado na coluna "Troca no código". Em `loop-central.js` a ficha aceita `'img:ui/<nome>'` no lugar do emoji; em `game.js` e `telao.mjs` basta pôr `<img src=".../ui/<nome>.webp">` dentro da ficha `.ic3d`.

## Lista A · cópias provisórias do Mosaico Vila Ética (substituir pelo estilo do Loop)

| # | Arquivo (`museu/icones/ui/`) | Onde aparece | Prompt (depois do prompt-base) |
|---|---|---|---|
| 1 | `participar.webp` | Entrada (cartão Participar); Máquina, aba Passar pista ("Quem recebe digita") | um celular antigo de latão com a tela azul acesa mostrando quatro quadradinhos de código |
| 2 | `conduzir.webp` | Entrada (cartão Conduzir) | uma chave grande de latão com cabeça redonda de esmalte roxo, presa a um cadeado pequeno aberto |
| 3 | `telao.webp` | Entrada (Abrir telão); entrada do telão | uma televisão de tubo antiga com moldura de latão e tela azul-petróleo acesa, com dois botões dourados |
| 4 | `simulador.webp` | Entrada (Simulador) | uma televisão pequena de latão em cima e três celulares de latão em fila embaixo, todos com a tela azul acesa |
| 5 | `caderno.webp` | Barra inferior (Caderno), título "Meu caderno", pausa, Revelar ("3 provas no seu caderno"), início ("Ver como funciona") | um caderno de capa de couro marrom com cantoneiras de latão e fita marcadora verde-água |
| 6 | `alvo.webp` | Máquina, aba Dossiê ("1 defeito"); pausa; telão, página Máquina ("Achar o defeito") | um alvo redondo de latão com anéis de esmalte azul-petróleo e um pino dourado cravado no centro |
| 7 | `dupla.webp` | Máquina, aba Atividades ("Dupla"); aba Passar pista; início ("Jogar em grupo") | dois fones de interfone de latão ligados por um fio enrolado verde-água |

## Lista B · emoji provisório dentro de ficha (gerar e trocar)

| # | Nome sugerido | Emoji de hoje | Onde aparece | Troca no código | Prompt (depois do prompt-base) |
|---|---|---|---|---|---|
| 8 | `mapa.webp` | 🗺️ | Barra inferior (Mapa) | `loop-central.js`, `lcBotao()` | uma maquete pequena de museu de três andares, em corte, com as salas à mostra e luzes quentes acesas |
| 9 | `saguao.webp` | 🚪 | Cartão do Saguão superior no mapa do celular e no mapa do telão | `game.js`, `renderGame()`; `telao.mjs`, `pgMapa()` | uma porta dupla de madeira escura com grade de segurança de latão meio abaixada |
| 10 | `sinal.webp` | 🚨 | Máquina, aba Dossiê ("2 sinais"); etiqueta das pistas de sinal | `loop-central.js`, `lcPainelHtml()` e `lcEtqIcone` | uma sirene pequena de latão com cúpula de vidro âmbar acesa |
| 11 | `leitura-normal.webp` | ✅ | Máquina, aba Dossiê ("1 leitura normal"); etiqueta das pistas de leitura normal | idem | um mostrador redondo de latão com o ponteiro parado na faixa verde-água |
| 12 | `manual.webp` | 📘 | Etiqueta das pistas de manual no dossiê | `loop-central.js`, `lcEtqIcone` | um livro técnico de capa azul-petróleo com cantoneiras de latão e uma engrenagem gravada na capa |
| 13 | `falta-ajustar.webp` | 🎛️ | Máquina, defeito "Falta ajustar" | `loop-central.js`, `LC_ICONE.A_calibrar` | um painel pequeno de latão com três mostradores redondos, cada um com o ponteiro numa posição diferente |
| 14 | `dois-defeitos.webp` | ⚙️ | Máquina, defeito "Dois defeitos juntos" | `loop-central.js`, `LC_ICONE.E_dois` | duas engrenagens de latão encaixadas, cada uma com um dente quebrado |
| 15 | `energia.webp` | ⚡ | Máquina, aba Atividades ("1 de energia"); rótulo "1 ⚡" das pistas e ficha "Energia" (aqui fica como apoio ao lado do número) | `loop-central.js`, `lcPainelHtml()` | uma pilha de latão com um anel dourado aceso e um raio pequeno gravado |
| 16 | `uma-tentativa.webp` | ☝️ | Máquina, aba Revelar ("Uma tentativa na noite inteira") | `loop-central.js`, `lcPainelHtml()` | um carimbo de madeira com base de latão, de pé, com a almofada vermelha ao lado |
| 17 | `missao.webp` | 🕵️ | Máquina, cartão "Sua missão secreta" | `loop-central.js`, `lcMissaoHtml()` | um envelope de papel pardo fechado com lacre de cera vermelha |
| 18 | `pista-registro.webp` | 📄 | Lista de pistas da sala: pista escrita (papel, placa, livro) | `game.js`, `TIPO_PISTA.Registro` | uma folha de papel amarelado presa numa prancheta de latão |
| 19 | `pista-observacao.webp` | 🔍 | Lista de pistas da sala: coisa que se vê | `game.js`, `TIPO_PISTA.Observação` | uma lupa de latão com cabo de madeira escura e lente azulada |
| 20 | `pista-relato.webp` | 💬 | Lista de pistas da sala: o que alguém conta | `game.js`, `TIPO_PISTA.Relato` | um interfone de parede antigo, de latão, com o fone fora do gancho |
| 21 | `pista-objeto.webp` | ✋ | Lista de pistas da sala: objeto que se leva na mão | `game.js`, `tipoDaPista()` | uma luva de couro aberta segurando uma pequena peça de pedra |
| 22 | `fato-copia.webp` | 🖼️ | Telão, página "A noite" (fita do tempo) | `ritmo.js`, `LOOP_LINHA` | uma máscara de pedra sobre um pedestal, com uma etiqueta em branco pendurada |
| 23 | `fato-troca.webp` | 🗓️ | idem | idem | um calendário de mesa de latão com uma folha dobrada |
| 24 | `fato-entrada.webp` | 🚪 | idem | idem | uma roleta de entrada de latão com três braços |
| 25 | `fato-raio.webp` | ⚡ | idem | idem | um para-raios de latão com um raio dourado tocando a ponta |
| 26 | `fato-camera.webp` | 📷 | idem | idem | uma câmera de segurança de latão com a lente apagada |
| 27 | `fato-teo.webp` | 🩸 | idem | idem | um pote de tinta vermelha tombado, com a tinta escorrendo e uma pegada de sola lisa ao lado |
| 28 | `fato-paleto.webp` | 🧥 | idem | idem | um paletó azul-escuro dobrado sobre um cabide de latão |
| 29 | `fato-cracha.webp` | 🪪 | idem | idem | um crachá de funcionário com cordão verde-água e presilha de latão, sem texto |
| 30 | `fato-botao.webp` | 🔘 | idem | idem | um botão redondo vermelho numa base de latão, com um anel dourado aceso em volta |
| 31 | `fato-falta.webp` | ❔ | Telão, fita do tempo: fato que ninguém achou | `ritmo.js`, `loopFitaHtml()` | uma moldura de latão vazia com um ponto de interrogação em relevo no centro |

## Apoios pequenos que continuam como emoji (permitido pelo padrão)

Ao lado de texto, sem papel de ícone principal: 🔒 no botão "Conduzir como professor", 📞 nos botões "Com a Dra. Sato", 💡 na dica de tela das atividades, ⚡ depois do número de energia, ✓ nos selos "no caderno" e "tem".

## Miniaturas de peça que precisam de novo enquadramento

Não são ícones novos: são as miniaturas das peças que já existem, regeradas em `museu/icones/gerar.html` com a peça ocupando 80% ou mais do quadro. Hoje ficam pequenas dentro do cartão: `R02` (Sala dos relógios), `N05` (Sala da fotografia), `V41` (Corredor de serviço e descanso), `T01` no mapa do telão.
