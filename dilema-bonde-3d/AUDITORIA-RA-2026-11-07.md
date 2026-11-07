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

## Complemento: fixação espacial, araucárias e fantasmas (RA5)

O usuário aprovou a interface RA4 depois de recolher as barras do Safari. Seu relato de maquete acompanhando o aparelho foi tratado como defeito de rastreamento/interação, não como prova de cache antigo. O CSS e a distribuição dos controles aprovados foram preservados.

Achados e correções:

- O arraste subtraía um ponto projetado com a câmera do início do gesto de outro projetado com a câmera atual. Depois de arrastar/pinçar, manter o dedo parado e aproximar o aparelho podia transportar a âncora. Agora ambos os pontos são projetados com a mesma pose atual; somente o deslocamento dos dedos move a maquete.
- A colocação aceitava hit-test durante rastreio limitado e até pontos isolados. O caminho SLAM agora usa escala absoluta em metros e só libera colocação com pose completa, estado `NORMAL`, pelo menos 750 ms estáveis e translação medida de 2,5 cm. Requer superfície detectada/estimada; não aceita `FEATURE_POINT` ou coordenadas inválidas. A ajuda orienta mover o aparelho para os lados.
- Durante perda de rastreamento, a cena e a simulação pausam e os gestos são cancelados. A transformação da maquete é preservada; ela reaparece após recuperação sem ser recolocada automaticamente à frente da câmera. Isso impede apresentar uma imagem congelada como se estivesse fixada no mundo. A deriva residual do SLAM e a estabilidade física continuam dependentes do teste no aparelho.
- As duas araucárias estavam nos cantos externos, fora de enquadramentos aproximados. Foram trazidas para (-24, -44) e (42, 44), mantendo as malhas/texturas existentes, copas dentro da base, troncos a mais de 12 unidades de ambos os trilhos e fora das zonas de interação. A conferência geométrica confirma duas árvores; não certifica a visibilidade em todo enquadramento possível.
- Erro confirmado dos fantasmas: o grupo era irmão das pessoas e não recebia seu deslocamento. A animação surgia no centro da maquete em vez do local do impacto. Corrigidos grupos principal/ramal no JavaScript. No USDZ pronto foram corrigidos também todos os destinos absolutos das animações; mudar só o pai não bastava. As três ações e as trajetórias do bonde permanecem intactas.
- Entrada, cena, rastreador, gestos, vegetação, troca de personagens e arquivo nativo recebem a versão `20261107-ra5`. A tela inicial mostra “Versão 07/11 · RA5”, sem ocupar o campo da câmera.

Auditoria após a correção:

- `npm test`: **73 testes aprovados**. Foram acrescentados testes de câmera transladando durante gesto, inicialização/perda/recuperação de SLAM, aproximação da câmera com aumento da projeção sem deslocar a âncora, três sessões consecutivas e quatro percursos alternando os trilhos.
- O teste de cena lê as geometrias GLB reais sem GPU. Confirma a altura/copa das duas araucárias, os fantasmas saindo junto aos personagens atingidos, subindo, desaparecendo e sendo limpos ao reiniciar. Texturas, câmera física e aparência renderizada não são validadas por esse teste.
- USDZ: 30 validadores OpenUSD sem falhas; três comportamentos, dois modelos de araucária e destinos de repouso/reinício dos quatro fantasmas nas coordenadas corretas. Repetir o gerador produz o mesmo SHA-256: `0c9d5bb21cd3ed49ab4742b3e50be46325c33ec4416224ffe2cfb92dc2c39e03` (39.136.938 bytes).
- A tentativa de instalar o navegador local para renderização retornou um pacote vazio/inválido; o navegador remoto anteriormente não disponibilizou WebGL. Nenhum desses testes equivale a uma sessão ARKit/ARCore nem a confirmação física de fixação no iPhone.

Fontes do contrato do rastreador: [escala absoluta](https://8thwall.org/docs/api/engine/xrcontroller/configure), [pose e trackingStatus](https://8thwall.org/docs/api/engine/xrcontroller/pipelinemodule), [limitações de rastreamento de superfícies](https://8thwall.org/docs/troubleshooting/world-tracking-issues).

## Correção de regressão: câmera aberta, botão bloqueado (RA6)

O teste real do usuário mostrou que a RA5 permanecia na câmera sem habilitar “Colocar aqui”. Isso invalida qualquer interpretação de que os testes anteriores certificavam a entrada no aparelho.

- Inspecionado o JavaScript distribuído **`@8thwall/engine-binary@1.0.0/dist/xr-slam.js`**, não apenas a documentação. A configuração interna desativa a detecção de superfícies (`setSurfaces(false)` e `setVerticalSurfaces(false)`) e a API de hit-test retorna também `FEATURE_POINT`. A RA5 excluía justamente esse tipo da consulta e da seleção.
- Restaurado `FEATURE_POINT`, mantendo preferência por superfícies quando disponíveis. Continua obrigatório receber pose válida e rastreio `NORMAL`; posições ausentes ou não finitas continuam recusadas. Não se cria ponto fictício na frente da câmera.
- Restabelecida a escala `responsive`, usada nas RAs interativas do Mosaico. A escala `absolute` introduzida na RA5 exige coleta adicional de movimento para estimar metros; a orientação lateral da página não correspondia ao avanço/recuo recomendado. Não há necessidade dessa calibração métrica para uma maquete com escala livre. Referência: https://8thwall.org/docs/engine/guides/coaching-overlays.
- Removida a calibração adicional própria de 750 ms/2,5 cm. A decisão de prontidão usa o estado do motor, sem impor uma segunda condição de movimento ao usuário. Esta seção substitui essa parte do comportamento descrito na RA5.
- O teste do motor agora respeita os tipos solicitados e fornece pontos visuais, corrigindo a lacuna do mock anterior. Um novo teste integra o rastreador e o `web.js` de produção: câmera → ponto visual → habilitar o botão → colocar → mover câmera → perda/recuperação → sair. DOM/GPU/câmera/modelo são substituídos nesse teste; não é uma sessão física.
- Prova de regressão: executar o teste novo sobre o rastreador publicado da RA5 falha em “FEATURE_POINT deve habilitar o botão real”. Sobre a RA6, passa.
- `npm test`: 74 testes aprovados. Layout, gesto corrigido, posições das árvores, fantasmas e USDZ da RA5 preservados. Versionados apenas os arquivos necessários para o reparo; o modelo nativo não precisa ser baixado novamente por causa desta mudança.

Fonte inspecionada: https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1.0.0/dist/xr-slam.js — SHA-256 `398f675c920892afd4521d5196df2b6b8a1b8a90b6a5c749cf5ad1a6e0a85270`. A validação física de estabilidade e reconhecimento do ambiente continua dependendo do iPhone; a fotografia identifica a etapa travada, mas não fornece o estado interno dos sensores.
