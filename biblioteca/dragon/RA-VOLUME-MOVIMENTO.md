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

O clima usa 72 gotas, camadas leves de nevoeiro e um clarão ocasional. Um botão permite desligá-lo. A preferência de movimento reduzido inicia o clima desligado. O efeito acompanha a pose e a escala da peça e não participa das colisões de toque.

A ambientação não altera os estados do caso, as pistas, os temporizadores ou a pontuação.

## Compatibilidade e verificações

Os motores de rastreamento permanecem WebXR no Android e 8th Wall no iPhone. Os efeitos e os textos são objetos da mesma cena 3D. A saída da câmera e o modo de mesa permanecem disponíveis.

Foram conferidos caminhos, sintaxe, carregamento das maquetes, abertura do farol, textura dinâmica de uma peça, remoção de texto antigo, vínculo à âncora, passagem dos toques e preferência de movimento reduzido. A câmera em aparelhos físicos precisa ser conferida no iPhone e no Android; o teste de navegador não substitui essa etapa.

Na Casa da Costa, o teste de regressão do relevo, da deformação da superfície e do clima pode ser repetido com Playwright e Chromium instalados:

    node tests/ra-volume.browser.cjs
