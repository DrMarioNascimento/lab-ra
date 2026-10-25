# RA — revisão de volume e movimento — 25/10/2026

## Rastreamento e decisões

| Cena ou conjunto | Decisão |
| --- | --- |
| Casa da Costa — maquete de A Mesa | Acrescentar nevoeiro leve, chuva e relâmpago ocasional, ligados à mesma âncora da casa. Preservar abertura por camadas, chave, cooperação e pontuação. |
| Casa da Costa — maquete de O Impostor | Aplicar o mesmo clima, preservando a mecânica própria do jogo. |
| Farol e livro | Acrescentar clima leve. Preservar o giro de 20 s do feixe, porta, cadeado, páginas e fotografias. O clima é ambientação e não informa horários nem pistas. |
| Bandeja, escrivaninha, jardim, quarto e relógio | Preservar os movimentos de investigação já existentes. Acrescentar relevo aos textos dinâmicos, sem agitar papéis ou objetos de leitura. |
| Eco do Amanhã — Torre de Continuidade | Preservar gavetas dos andares, aproximação, marcadores e rotação. Acrescentar clima externo, coerente com a chuva da narrativa. O clima fica oculto ao entrar em um andar. |
| Eco do Amanhã — objetos dos capítulos | Preservar portas, gavetas, ponteiros e demais poses de estado. Acrescentar relevo aos textos variáveis das áreas próprias dos modelos. |
| Carro Forte — agência, malote e peças | Preservar movimentos de investigação e marcadores. Acrescentar relevo aos textos dinâmicos. Chuva e nevoeiro não ajudam a leitura da agência nem do malote. |

## Textos

O texto desenhado nas texturas Canvas passa a ter uma malha extrudada sobre a superfície correspondente. O contorno vem do próprio desenho, preservando palavras, sinais, números e a tipografia usada pela atividade.

O relevo acompanha a transformação do objeto e as deformações da superfície. Ao trocar ou limpar o documento, a geometria anterior é removida. O relevo não recebe toques destinados às pistas. Máscaras auxiliares têm resolução máxima de 512 pixels para limitar o uso de memória no celular; as texturas originais conservam a resolução existente.

## Clima e acessibilidade

O clima usa chuva, nevoeiro, relâmpago e trovão (revisão de 26/10, abaixo). Um botão permite desligá-lo. A preferência de movimento reduzido inicia o clima desligado. O efeito acompanha a pose e a escala da peça e não participa das colisões de toque.

A ambientação não altera os estados do caso, as pistas, os temporizadores ou a pontuação.

## Compatibilidade e verificações

Os motores de rastreamento permanecem WebXR no Android e 8th Wall no iPhone. Os efeitos e os textos são objetos da mesma cena 3D. A saída da câmera e o modo de mesa permanecem disponíveis.

Foram conferidos caminhos, sintaxe, carregamento das maquetes, abertura do farol, textura dinâmica de uma peça, remoção de texto antigo, vínculo à âncora, passagem dos toques e preferência de movimento reduzido. A câmera em aparelhos físicos precisa ser conferida no iPhone e no Android; o teste de navegador não substitui essa etapa.

Na Casa da Costa, o teste de regressão do relevo, da deformação da superfície e do clima pode ser repetido com Playwright e Chromium instalados:

    node tests/ra-volume.browser.cjs

## Auditoria da implantação — 25/10/2026

A auditoria identificou e corrigiu uma lacuna do relevo em malhas com vários materiais, como a etiqueta do rádio do farol. Cada grupo de faces com texto agora recebe seu próprio relevo, com remoção ao limpar a textura. Os arquivos carregados receberam nova versão de cache. Na Casa da Costa, os módulos compartilhados da mesa e das atividades sensoriais voltaram a usar o mesmo carimbo de versão.

## Tempestade, vida e obras — 25/10/2026 (tarde)

Pedido do Mario: movimento e ação onde couber, ligados à história; atenção à maquete d'A Casa (trovões, nevoeiro, chuva) e ao farol; as obras dele no jogo; a assistência de primeira vez conferida.

**Clima (`ra-clima.js` / `ra/clima.js`, as quatro cópias iguais).** Chuva de até 420 gotas com vento em rajadas, que pousa onde a peça está e respinga ali; nevoeiro em bancos baixos e fiapos; relâmpago ramificado que ilumina a peça, com no máximo dois pulsos por descarga; chuva e trovão sintetizados (sem arquivo), depois do primeiro toque e respeitando a chave de silêncio do iPhone. Novos: `aoClarao` (avisa o brilho a cada quadro), `vento(t)` e o modo `interno` (cômodo: clarão pela janela e trovão, sem chuva dentro). Custo medido: 1,6 ms por quadro no computador. Continua sem toque, com botão e começando desligado com movimento reduzido.

**A Casa — maquetes da Mesa e do Impostor (`ra-vida-casa.js`).** Vidros que devolvem o clarão (azul-frio, nunca o verde-água de "tocável"), jasmim do pátio ao vento, fonte com anéis tênues, fumaça das chaminés da cozinha e menor, mar de resina ondulando. A chaminé maciça fica fria: capitel e peitos são fechaduras. Relógio, velas, castiçais, luz da fresta, lareira acesa e luzes das janelas ficam parados.

**A Casa — farol (`ra/farol-vida.js`).** Mar num fosso em volta do rochedo, com espuma e borrifo (o livro e o rádio saem para a mesa ao lado e não caem na água), janelas e lanterna no clarão, LED do rádio do Faroleiro. O giro de 20 s do feixe não muda.

**A Casa — quarto, relógio e jardim.** Clima interno: o clarão entra pela janela (no quarto, o vidro do jasmim acende) e o trovão vem depois. O jardim mantém a chuva própria e não ganha nevoeiro, que esconderia as pegadas.

**Eco do Amanhã (`torre-viva.js`, `obra-projecao.js`).** A cada raio as luzes da torre falham e gaguejam e o vidro da Câmara Branca fica opaco; a cabine do elevador respira em âmbar sem se mover; heliponto, balizamento e navegação piscam; as pás do helicóptero travado balançam; cadeiras, balanço e copas seguem o vento. No −1, emergência e baterias em carga. No +8, a transmissão das 06h00 tremula e os três projetores mostram as obras de Mário César Nascimento — a moeda da IA, a anatomia sintética e o corpo com a circulação —, com placa de autoria; carregam só ao entrar no andar.

**Carro-Forte (`agencia-viva.js`).** Carro-forte com o motor ligado (pisca-alerta, faróis, tremor), a lâmpada que pisca na vitrine da farmácia e a cruz verde, o vapor da padaria e pombos sob os toldos. Sem chuva na maquete (a lingueta da porta lateral é pista de dia de chuva); câmeras, telas, LEDs, porta giratória, cofre e relógio ficam parados.

**Assistência.** `guia-ra.js` ensina a tela na primeira visita de cada aparelho às peças do Impostor d'A Casa e às maquetes do Eco e do Carro-Forte: gesto, botão de RA, clima e saída — nunca a solução. Sem botão de fechar; um toque passa e some sozinho; `?guia=1` reabre. A maquete da Mesa d'A Casa já tinha "Como jogar" e o sistema de janelas e não recebeu o guia, para não criar um segundo controle. No Carro-Forte, `aprendizado-carro.js` não reconhecia `/a-noite/` (procurava `/noite/`) e A Noite rodava os passos da Mesa; corrigido.

A câmera em aparelho físico ainda precisa ser conferida no iPhone e no Android.
