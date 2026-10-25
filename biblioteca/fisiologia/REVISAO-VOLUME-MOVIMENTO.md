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

Executar construir.mjs de Película/Travessias, scripts/construir-portateis.cjs, celula/membrana/tools/ios.py, scripts/converter-ciclos.py, scripts/verificar-portateis.cjs e scripts/atualizar-manifesto.cjs.

O workflow ra-portatil.yml realiza a construção e registra os arquivos gerados.

