# Revisão de RA — volume e movimento — 25/10/2026

As placas e letras são geometria extrudada. Noto Sans conserva acentos e sinais químicos; licença SIL OFL em fonte-ra-LICENSE.txt. A geometria faz parte dos GLB e USDZ, e não depende de uma sobreposição da página.

| Experiência | Decisão |
| --- | --- |
| Célula viva | Preservar o movimento original e as quatro combinações de membranas; acrescentar placa com relevo. |
| Película e Travessias | Preservar o ciclo de 16 s e as cargas/fluxos; substituir placas planas por placas e letras sólidas. |
| Junção neuromuscular | Novos arquivos animados nos cinco níveis, derivados do ensaio e do mesmo motor visual. O ciclo de 320 ms é apresentado em 8 s para observação. |
| Osso vivo | Novos arquivos dos cinco níveis. Deformações ampliadas, reabsorção e formação derivadas da bancada. As sequências celulares desaparecem ao reiniciar, para não sugerir reversão da matriz. |
| Músculo | Acrescentar deslizamento contínuo no sarcômero. Preservar as vistas anatômicas dos outros níveis e os botões Contrair/Relaxar do iPhone. |
| Retorno venoso | Acrescentar ciclos de válvulas e bomba da panturrilha em ortostatismo. Preservar a exportação da postura escolhida. |
| Starling | Novos ciclos dos cinco níveis: microcirculação, trocas, forças, glicocálix e linfa. Cenário de referência revisado, sem edema. |
| Pleura | Ciclo respiratório no modelo esquemático da bancada, em repouso. Preservar os modelos anatômicos aprovados e as exportações dos estados patológicos. |
| Coração | Arquivos públicos das vistas externa e interna, usando a amostragem do motor já existente. A vista no tórax permanece anatômica. |
| Comunicação celular | Preservar o impulso gravado e o botão Disparar do iPhone, agora com texto e placa extrudados. |

## Abertura e limites

A opção Ciclo em movimento mantém a exportação do estado escolhido na bancada. Os arquivos animados usam parâmetros de referência, explicitados no painel. Ajustes feitos na página não modificam esses arquivos.

O Safari do iPhone abre um USDZ público diretamente pelo gesto do usuário, inclusive quando a prévia não oferece WebGL. O Android usa WebXR no Chrome compatível. As deformações dos ciclos usam morph targets: a nova opção não oferece o Scene Viewer para esses arquivos. A rota anterior de RA permanece disponível.

GLB e USDZ contêm as animações; a conversão para o iPhone inclui transformações e pontos deformados ao longo do tempo. As taxas e amplitudes são as da bancada ou uma reprodução didática em câmera lenta, e não uma medição clínica.

Há validação de formato, integridade e fisiologia e inspeção visual no navegador. A abertura com câmera em aparelhos físicos precisa ser conferida no iPhone e no Android; o teste de navegador não substitui essa conferência.

## Reprodução

Instalar three 0.180.0, @napi-rs/canvas, playwright, gltf-validator e o Chromium; Python com numpy, Pillow e usd-core.

Executar construir.mjs de Película/Travessias, scripts/construir-portateis.cjs, celula/membrana/tools/ios.py, scripts/converter-ciclos.py, scripts/comprimir-ciclos.mjs, scripts/verificar-portateis.cjs e scripts/atualizar-manifesto.cjs. A compressão vem depois do USDZ, porque o conversor lê o GLB cru.

O workflow ra-portatil.yml realiza a construção e registra os arquivos gerados.


## Piloto Starling — textura e compressão

Os cinco ciclos do Starling ganharam superfície de tecido (starling/texturas.js): cor, relevo e aspereza procedurais para vasos, endotélio, membrana basal, núcleo, citoplasma, colágeno e hemácia. Glicocálix, proteínas, água e setas continuam lisos, por serem moléculas ou esquemas. A textura entra só na cópia exportada; a bancada na tela conserva os materiais aprovados.

Os GLB passam por dedup e Draco (scripts/comprimir-ciclos.mjs): 14,3 MB → 2,9 MB nos cinco níveis, com as mesmas trilhas, nós e placas. O USDZ não é comprimido e cresce de 0,2 a 0,3 MB por nível com as texturas.

## Todas as experiências — peso, relevo e movimento (25/10/2026)

- Deformações em poucas formas básicas (scripts/formas-reduzidas.js): cada instante deixa de ser uma cópia da malha. No compilador vale para todos os ciclos; no coração, gerado pela própria bancada, entra por scripts/reduzir-deformacoes.mjs sobre o arquivo pronto. Coração interno 37,0 → 4,2 MB (GLB) e 34,6 → 6,1 MB (USDZ); externo 20,5 → 8,4 MB.
- Draco em todos os GLB dos ciclos (dedup + Draco): osso 10–18 MB → 0,6–3,6 MB; junção 2,7–10 MB → 0,4–1,2 MB; pleura 22,9 → 8,3 MB.
- Osso vivo e Junção neuromuscular recebiam uma cor lisa de 64 px no lugar da textura da bancada; agora levam a mesma textura da tela (scripts/texturas-das-bancadas.js). O relevo (bumpMap) vira mapa normal, que o USDZ carrega.
- Textura de tecido (texturas-tecido.js) também na pleura (costelas, cartilagens, diafragma, intercostais) e nas válvulas do retorno venoso. Coração, sarcômero e cores de pressão ficam como estavam.
- Starling: nível 1 com vasomoção, linfângions e hemácias visíveis; níveis 2 a 5 com o glicocálix que se curva com o fluxo e as abas do linfático inicial. Velocidades em voltas inteiras por ciclo, sem salto ao recomeçar.
- Página: "Ver em 3D · tela cheia" em todos os visualizadores, e aviso no Android sem RA do Google.
