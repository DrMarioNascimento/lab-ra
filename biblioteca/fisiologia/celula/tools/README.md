# Célula Viva completa — versão 3

Modelo fornecido por Mário: `celula-humana2.glb`, 31.929.480 bytes. SHA-256: `bb8dcf1c9ac7322ced2f1dc9f77ffec9085c188af7a71f2fa1cf71e4f5fc8d1b`.

O computador remonta o arquivo original sem perdas a partir das 11 partes de `../visualizador/modelo-original-v3/`, na ordem do manifesto. Celulares usam GLB otimizado; iPhone/iPad abrem USDZ. Ambos preservam a animação `vida_celular`, com 24 segundos e 359 trilhas. Original e versão móvel completa têm 337 instâncias de malha, das quais 327 se movem aos 5 segundos no teste com Three.js AnimationMixer.

## Camadas

A página inicia com a membrana plasmática, o citosol e as 11 membranas mitocondriais presentes. Os controles são independentes:

- Ocultar a membrana celular também oculta o volume translúcido de citosol, para permitir observar as organelas sem essa camada visual.
- Ocultar membranas mitocondriais preserva as 11 cristas, os grupos de transformação e seus movimentos.
- Revelar o núcleo e controlar a velocidade continuam sendo recursos da exploração na página.

São publicados quatro GLBs e quatro USDZs: `completa`, `sem-membrana-celular`, `sem-membranas-mitocondriais` e `sem-membranas`. A escolha das membranas antes de abrir a RA seleciona o arquivo correspondente, sem conversão durante o toque e sem perder a animação. Para mudar a escolha durante uma sessão nativa de RA, retorne à página, altere os controles e abra novamente.

## Reprodução

Reconstrua o original nesta pasta como `celula-humana.glb`. Instale as dependências e execute:

```sh
npm ci
python -m pip install -r requirements.txt
node simplify.mjs
python bake.py
python compress.py
node cleanup.mjs
node tangents.mjs
node fix-tangents.mjs
python mobile-textures.py
node cleanup.mjs
python surface-compress.py
node cleanup.mjs
python variants.py
node validate.mjs celula-v3-completa.glb
node validate.mjs celula-v3-sem-membrana-celular.glb
node validate.mjs celula-v3-sem-membranas-mitocondriais.glb
node validate.mjs celula-v3-sem-membranas.glb
```

Copie os oito arquivos `celula-v3-*.glb/usdz` para `../visualizador/`. Os intermediários v2 são apenas nomes internos da conversão, não são usados pela página v3. A conversão reduz a geometria, converte cores por vértice em texturas e preserva a transparência original das membranas. Todas as variantes conservam as mesmas trilhas de animação; apenas as referências às malhas ocultas são removidas dos nós.

## Verificação

- GLB validado com Khronos glTF Validator; USDZ validado com todos os validadores disponíveis do OpenUSD 26.11.
- Teste de reprodução com AnimationMixer: 24 segundos em todas as variantes; 327, 325, 316 e 314 malhas em movimento, respectivamente.
- 16 testes automatizados de integração, integridade do original, abertura iOS/Android, alternância independente das camadas e seleção das quatro variantes.
- Mário relatou movimento na RA da versão anterior (v2). A projeção da nova versão pela câmera ainda precisa ser confirmada em aparelhos físicos; a inspeção em navegador sem WebGL usa imagens renderizadas dos modelos reais.


## Correção da abertura no Android

Após Mário confirmar a abertura no iPhone e a falha no Android, a célula passou a usar o mesmo fluxo das abas Película/Travessias: preparar o GLB no model-viewer, priorizar `webxr scene-viewer quick-look` e chamar `activateAR()` diretamente no toque, somente depois do carregamento e da confirmação de suporte. No Android, a preparação começa automaticamente; trocar membranas invalida a prontidão anterior até que a nova variante esteja pronta. Falhas de carregamento têm mensagem e nova tentativa; uma sessão WebXR pausa o desenho da cena Three.js de fundo e o retoma ao sair. O caminho direto para o USDZ no iPhone permanece independente da prévia WebGL. Não houve verificação da correção em Android físico.
