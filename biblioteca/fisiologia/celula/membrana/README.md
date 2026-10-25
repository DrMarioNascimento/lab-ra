# Película e Travessias em movimento

As duas abas de Célula Viva usam o mesmo modelo animado na página e na RA. Cada experiência tem um ciclo de 16 segundos, 100 trilhas de animação e arquivos públicos GLB (Android/WebXR/Scene Viewer) e USDZ com quadros-chave (Quick Look no iPhone). O iPhone abre o USDZ diretamente no gesto do usuário; o Android aguarda o carregamento e chama `activateAR()` sem espera intermediária, priorizando WebXR. A técnica é a mesma validada pelo professor na Célula Viva.

A confirmação física anterior refere-se à Célula Viva. Estes dois novos modelos precisam de confirmação de câmera nos aparelhos; testes de formato e fluxo não substituem esse teste.

## Experiências

- Película: repouso ilustrativo a −70 mV, inversão até +35 mV e retorno. Agitação tangencial e redistribuição de cargas em cada face, sem fazer partículas cruzarem o lipídio nessa vista. Amostragem reduzida para leitura, sem correspondência entre número de esferas e concentração.
- Travessias: O₂/CO₂ pelo lipídio; K⁺ e Na⁺ por canais abertos; glicose por acesso alternado, com fase ocluída; bomba com três Na⁺ para fora, dois K⁺ para dentro e participação de ATP. As partículas desaparecem no reservatório antes de reiniciar a trajetória, evitando uma falsa passagem de volta.
- O tempo é didático. Não representa cinética molecular nem uma simulação de Hodgkin–Huxley. A bomba mantém gradientes, mas não produz a repolarização rápida do potencial de ação.
- Pausa, velocidade, instante e restauração de vista na página. Os visualizadores nativos executam o ciclo gravado em velocidade original.
- “Investigar a membrana” conserva os controles anteriores de Goldman/permeabilidade em `../laboratorio-membrana.html`, carregados sob demanda. Seus ajustes não são transferidos para o ciclo demonstrativo de RA. Neurônio/Comunicação/Interior/A onda mantêm código e modelos originais.
- Prévia WebP renderizada a partir do próprio GLB. Nenhuma imagem sintética substitui o modelo.

## Reproduzir os arquivos

Na raiz do repositório:

```sh
npm install --prefix ra --no-save --package-lock=false three@0.180.0 @napi-rs/canvas@0.1.80 gltf-validator@2.0.0-dev.3.10
node ra/celula/membrana/tools/construir.mjs
python ra/celula/membrana/tools/ios.py
node ra/celula/tools/validate.mjs ra/celula/membrana/assets/pelicula-v1.glb
node ra/celula/tools/validate.mjs ra/celula/membrana/assets/travessias-v1.glb
node --test ra/tests/membrana-movimento.test.mjs ra/tests/celula-transferencia.test.mjs ra/tests/celula-nova-ra.test.mjs
```

Dependências Python da conversão: `ra/celula/tools/requirements.txt`. Fonte para placas: DejaVu Sans em `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`. O construtor usa a biblioteca procedural original por um adaptador de autoria em memória e mantém `potencial-membrana/modelos.js` byte a byte. A semente fixa permite reproduzir posições, cores e texturas.

As prévias podem ser reproduzidas com `tools/preview.py entrada.glb saida.webp` (dependências adicionais: trimesh, pyrender e contexto EGL).

A conversão usa `celula/tools/usdz.py`, com tempos e transformações gravados diretamente no USD, sem depender da geração automática de USDZ do navegador, que não mantém essa animação. Rótulos de etapa e interior/exterior fazem parte dos arquivos 3D.

## Validação

29 testes específicos: ciclo, acesso alternado, proporção 3:2, trajetórias, arquivo portátil, abertura síncrona, iOS sem WebGL, troca de abas, carregamento antigo, pausa, velocidade e erros. GLB: zero erros e avisos no Khronos Validator. USDZ: zero erros no OpenUSD, com 100 trilhas e duração de 16 s em cada arquivo. Os relatórios ficam junto aos arquivos.

A suíte completa ainda registra uma divergência histórica de hash de `README.md` no teste de instalação de Pleura; não corresponde a um defeito destes modelos. A biblioteca celular aprovada e os cálculos fisiológicos continuam com seus hashes originais.
