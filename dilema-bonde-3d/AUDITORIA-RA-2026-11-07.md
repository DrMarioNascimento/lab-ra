# Correção da RA do Dilema do Bonde

## Diagnóstico e comparação

| Referência | Fluxo observado no código | Aplicação no bonde |
| --- | --- | --- |
| Célula Viva | USDZ público; link `rel=ar` aberto no gesto; documento superior quando necessário | Link nativo estático, disponível antes de carregar JavaScript ou WebGL |
| Músculo/sarcômero | Preparo anterior ao toque; USDZ com comportamentos; orientação sobre seletor AR/Objeto | Mantidos três comportamentos, preparo separado e instrução correta para o iPhone |
| Mosaico / O Impostor | WebXR ou rastreamento 6DoF com 8th Wall; hit-test e saída | Cópia isolada do motor, em módulo próprio; elimina câmera com giroscópio como substituto de rastreamento |

Problemas encontrados:

1. O WebGL era criado antes de configurar o iPhone. Uma falha de contexto interrompia tudo. Reproduzido no navegador de auditoria.
2. O link nativo era criado por JavaScript, misturava imagem e texto e perdia `rel=ar` quando a detecção devolvia falso. A estrutura agora contém uma única imagem; o texto fica fora.
3. A alternativa por giroscópio mantinha a câmera na página, com barras, sem medir deslocamento real. O iPhone usa Quick Look; o fluxo web usa rastreamento de posição.
4. Falhas após remover a tela inicial deixavam a página sem recuperação. Agora preparo, abertura, saída e tentativa seguinte mantêm controles utilizáveis.
5. Trocar personagens podia abrir a rodada anterior durante o preparo; blobs não declaravam extensão; falhas podiam deixar a descrição divergente. A última rodada válida é preservada e o toque espera o fim do preparo.
6. O USDZ continha 76 incompatibilidades de tipos dos shaders (`token` em lugar de `float2`/`string`). Normalizados tanto o arquivo publicado quanto o gerador, sem mudar geometria, texturas ou trajetórias.
7. O catálogo ainda pedia marcador e a validação antiga esperava apenas dois cards. Catálogo e expectativa atualizados para a RA sem marcador e as três áreas existentes.

## Verificações

- `npm test`: 50 testes aprovados na primeira rodada completa após os reparos, incluindo 11 novos testes do bonde.
- Simulação de três sessões WebXR consecutivas: chamada no gesto, mira, saída, cancelamento da fonte de hit-test e reentrada.
- Testes de iPhone, iPad, iPad com identificação de desktop, iframe, falha de rede, permissão recusada, preparo concorrente e retorno pelo cache.
- Verificação de 46 referências de módulos: nenhum arquivo ausente.
- OpenUSD: 30 validadores, zero falhas; pacote sem compressão e com alinhamento de 64 bytes; texturas e referências presentes; três comportamentos e todos os alvos resolvidos.
- Navegador: entrada nativa disponível mesmo sem WebGL; troca real de personagens produz um novo USDZ e reabilita o link.
- A execução automática `Auditar RA do Bonde` conserva a validação de código e do arquivo nativo nos próximos commits.

## Limites da auditoria

O navegador remoto não dispõe de câmera ARKit/ARCore nem de contexto WebGL utilizável. A renderização da câmera, a estabilidade física sobre a mesa, os toques nas placas dentro do Quick Look e a ausência das barras após abrir a sessão precisam de validação em aparelho real. Não se considera emulação de identificação do iPhone uma validação de Quick Look.

A tela inicial permanece uma página web. O visualizador nativo abre depois do toque; se abrir no modo Objeto, selecionar AR. Em navegadores internos de aplicativos, abrir o endereço no Safari. O arquivo nativo tem aproximadamente 37,5 MB; a correção preserva sua qualidade visual e não tenta reduzir a malha.

Referências técnicas: [WebKit: links AR](https://webkit.org/blog/8421/viewing-augmented-reality-assets-in-safari-for-ios/), [Apple: Quick Look](https://developer.apple.com/quick-look-gallery/).
