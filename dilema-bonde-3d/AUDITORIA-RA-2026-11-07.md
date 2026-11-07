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

## Complemento: tamanho, posição, controles e araucárias (ra3)

- Quick Look continua sendo a entrada padrão no iPhone, com escala explicitamente habilitada (`allowsContentScaling=1`) no arquivo pronto e nas rodadas geradas. Seus gestos de posição/tamanho continuam sob controle do iOS.
- Opção “RA com botões fixos na tela”: abre também no iPhone o modo interativo com controles semitransparentes. Nesse modo o Safari pode exibir suas barras; a opção nativa permanece disponível. Uma imagem transparente na maquete não se torna um controle fixo da tela. Banners de ações do Quick Look encerram o visualizador ao serem acionados, por isso não substituem os controles do jogo.
- No modo interativo, um dedo desloca a âncora no plano; dois dedos ampliam/reduzem, giram e deslocam. “Recolocar” aceita uma nova superfície. Botões −/+/100% ajustam somente o tamanho, preservando lugar e rotação. A rodada e as animações não são reiniciadas por esses gestos. Proteções numéricas cobrem 0,01–100 vezes a escala inicial (largura 8 mm–80 m).
- Duas araucárias do GLB original, com textura, em (-54, -41) e (56, 43). Ambas ficam fora do anel, com distância do tronco aos trilhos superior a 12 unidades e fora das áreas de oficina, personagens e alavanca. Copas permanecem dentro do terreno. A exportação nativa não as remove mais; não se alterou a vegetação da versão de tela.
- Arquivo pronto: 39.129.418 bytes, crescimento de 1.646.236 bytes (4,4%). SHA-256: `721f12c98ccfaeb539f774c9dc3ad459eb95386c294598734bc699ec1b86d0af`.

Nova auditoria local:

- 57 testes aprovados, incluindo movimento, pinça, rotação, transição de dois dedos para um, cancelamento, retorno ao tamanho inicial sem mudar posição, supressão de seleção XR duplicada, entrada interativa no iPhone e afastamento das duas árvores dos trilhos.
- Todos os valores de atributos e alvos de relacionamentos dos 7.372 prims anteriores do USDZ preservados (comparação semântica; caminhos de texturas comparados sem a parte resolvida dependente do diretório).
- Nova validação OpenUSD: 30 validadores sem falhas; exatamente duas araucárias; três comportamentos nativos mantidos. Repetir a geração das árvores resulta no mesmo SHA-256.
- Inspeção do layout dos controles em 390 × 844 e 844 × 390: todos os nove botões dentro da tela, sem rolagem horizontal. Essa inspeção visual não simula câmera nem rastreamento real.
- Dependências alteradas versionadas com `20261107-ra3` para evitar reaproveitar o código anterior em cache.

Referência para a limitação dos controles nativos: [Apple, WWDC20 — Shop online with AR Quick Look](https://developer.apple.com/videos/play/wwdc2020/10604/). Os limites de validação em aparelho físico descritos acima continuam válidos.

## Complemento: barras do Safari e área útil (ra4)

As capturas enviadas mostram duas faixas do Safari (endereço e abas), além do aviso persistente da RA. A página não controla essas faixas do navegador. A abertura como app da web pela Tela de Início é o caminho para manter os controles interativos sem as barras do Safari; adicionar o ícone e continuar na aba não muda a visualização.

- Manifesto com identidade e escopo próprios em `/dilema-bonde-3d/ar/`, início no modo interativo e `display: standalone`. Metadados da Tela de Início e ícone existente do professor; sem novos assets ou cache de modelos.
- Detecção de abertura pela Tela de Início (`navigator.standalone` e media query) entra no modo interativo mesmo sem query string. A escolha explícita `modo=nativo` continua disponível.
- Orientação de instalação no Safari, recolhida na entrada nativa e aberta na interativa. Some ao iniciar pelo ícone.
- Zoom recolhido em “Ajustes”; “Sair” compacto; controles inferiores menores. Aviso de movimento some após 4,5 segundos, com ajuda recuperável em Ajustes. Procura de superfície e carregamento continuam com instrução visível.
- 63 testes locais aprovados, incluindo os fluxos de abertura instalada, retorno ao nativo, início dentro do escopo e ciclo dos avisos. Layout inspecionado em 768 × 250 (área reduzida em paisagem) e 390 × 844; verificados abrir/fechar Ajustes e desaparecimento do aviso. Recolocar fica oculto enquanto o menu está aberto para não ficar encoberto pelo painel.

Referências: [Apple: abrir um site como app](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/27/ios/27), [WebKit: apps da Tela de Início no Safari 26](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/#every-site-can-be-a-web-app-on-ios-and-ipados). A instalação e a câmera no iPhone real ainda dependem da conferência no aparelho; esta auditoria não simula a interface do sistema.
