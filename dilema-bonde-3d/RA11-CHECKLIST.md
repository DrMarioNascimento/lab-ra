# RA11 — menu, vegetação e desempenho

## Implementação

- [x] Vegetação otimizada com normais e UVs consideradas; imagens das texturas preservadas byte a byte.
- [x] 27 árvores comuns no perfil Equilibrado/Detalhado (antes: 36) e 18 no Econômico; duas araucárias em ambos.
- [x] Escolha de qualidade antes de qualquer GLB: Automática, Econômica, Equilibrada e Detalhada.
- [x] Resolução limitada por perfil, framebuffer WebXR configurado antes da sessão e redução gradual de resolução em Auto fora do WebXR.
- [x] Menu compartilhado no PC e na RA interativa, com pausa da rodada sem alterar a âncora.
- [x] Cenários livre/clássico, nove papéis, quantidades, tempo, pressão, velocidade, continuação, som/volume, sons lúdicos, rótulos e movimento reduzido.
- [x] Navegação PC (giro, pan, zoom, teclado e seis vistas), zoom/restauração/recolocação RA dentro do Menu.
- [x] Uma placa junto à estação, fora das vias, com atalhos Como jogar, Cenários e Reflexão.
- [x] Controles principais fixos: manter/desviar, iniciar/pausar e tempo. Nova rodada no Menu/reflexão.
- [x] Resultado e cinco indicadores ilustrativos, com aviso de que não são uma medida moral validada; fórmulas correspondentes à versão 2D.
- [x] Configurações nativas do iPhone antes da geração do USDZ: personagens, quantidades, velocidade e qualidade.
- [x] Falha ao carregar personagens preserva a rodada anterior; troca de cenário libera as geometrias exclusivas dos fantasmas anteriores.

## Medidas finais

Configuração inicial: 1 trabalhador no principal e 3 desconhecidos no ramal. Contagem de triângulos da cena potencialmente desenhável, incluindo instâncias; não equivale a FPS ou aos triângulos realmente desenhados após recorte da câmera.

| Medida | RA10 | RA11 Equilibrada | RA11 Econômica |
|---|---:|---:|---:|
| Árvores comuns | 36 | 27 | 18 |
| Araucárias | 2 | 2 | 2 |
| Triângulos da cena | 1.191.481 | 539.215 | 355.003 |
| Redução da cena | — | 54,7% | 70,2% |
| Nove GLBs iniciais, bytes | 7.630.832 | 7.169.984 | 6.983.140 |

USDZ nativo padrão: 40.871.503 → 38.605.214 bytes. O Android interativo não baixa esse USDZ. Os totais de GLB não incluem bibliotecas, motor de rastreamento nem texturas externas.

A primeira simplificação foi revista visualmente: malhas um pouco mais detalhadas foram mantidas no perfil Equilibrado para preservar melhor as folhas. As imagens das texturas são as mesmas dos modelos originais. Nenhum áudio externo é obrigatório: os sons são sintetizados após interação.

## Verificação

- [x] Testes de controlador: pausas independentes, perda/retorno do rastreamento, contagem fracionária, trava na agulha, erro de carregamento, concorrência, quantidades e resultados.
- [x] Geometria real: passagem do bonde em todas as curvas, bitola, estação, oficina, cinco personagens, araucárias, placas e orçamento por perfil.
- [x] Comparação visual das árvores originais/otimizadas/econômicas e da maquete.
- [x] Chromium: carregamento sob demanda, navegação PC, quatro tamanhos de tela, Menu, configuração 2/0, rodada completa, reflexão e nova rodada.
- [x] RA com rastreador simulado no navegador: preparo econômico, colocação, menu, âncora estável, câmera aproximando, perda/retorno, zoom e saída/reentrada.
- [x] USDZ: três percursos/botões, relógio independente, malhas/texturas/alvos e 30 validadores OpenUSD.
- [ ] Revisão automatizada do commit final, CI completo e conferência após publicação.

## Limites e diferenças entre os caminhos

Não há Galaxy A56 físico nem iPhone com câmera real neste ambiente. As verificações de navegador com rastreador simulado não medem FPS, temperatura, memória gráfica real ou estabilidade do rastreamento nesses aparelhos. O travamento relatado no A56 não foi reproduzido fisicamente.

A RA interativa tem o jogo e o Menu completos. No visualizador nativo do iPhone, os ajustes são feitos antes de abrir; ele mantém as três placas de decisão da maquete. Não executa o Menu HTML, os sons sintetizados, o cronômetro ou a reflexão interativa. Por isso a placa com atalhos do Menu é exclusiva do PC/RA interativa.

Mudar apenas a qualidade no Menu a salva para a próxima abertura, sem reconstruir a maquete nem perder a âncora durante a sessão. Som, rótulos e qualidade não reiniciam a rodada. Alterar cenário, personagens, tempo, pressão ou velocidade prepara uma nova rodada no mesmo lugar. As barras do Safari continuam sob controle do navegador; a entrada por Tela de Início permanece disponível.
