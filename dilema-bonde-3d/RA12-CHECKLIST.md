# RA12 — placas, personagens e fantasmas na RA

- [x] Placa de atalhos no gramado frontal (28, 44), fora das vias e da oficina.
- [x] Madeira com as texturas existentes, bordas chanfradas, postes de madeira e ferragens.
- [x] Singular/plural dos nove papéis e texto próprio para ramal vazio.
- [x] Grupo principal à esquerda da oficina; ramal com folga também para cinco pessoas.
- [x] Rótulos baixos, em pé, junto à lateral da via e à esquerda do grupo; largura calculada pelo texto.
- [x] Rótulos também no USDZ, sem depender do tamanho ou giro da maquete.
- [x] Novas entradas variam os dois papéis e as duas quantidades; preferências de qualidade, som e tempo permanecem. O cenário Clássico preserva 3/1.
- [x] Retorno à RA interativa prepara a próxima combinação antes de pedir a câmera no gesto seguinte.
- [x] No iPhone nativo, primeiro toque prepara a combinação e segundo toque abre o arquivo pronto; sem carregar 3D antecipadamente.
- [x] Fantasmas nativos começam com volume dentro da base opaca; as poses visíveis vêm da animação já usada no PC. A base não ganha novos limites nem muda sua altura de apoio.
- [x] Menu, cartões, entradas e controles com relevo, sombras, madeira, creme, azul da estação e âmbar.

## Verificação

A PR desta versão registra os resultados da execução em Chromium, dos testes do repositório, da validação OpenUSD, da revisão do commit final e da publicação.

A auditoria cobre singular/plural, entradas sucessivas, preparo nativo sob demanda, falhas de carga, pausas, foco, quatro tamanhos de tela, navegação, posição dos grupos, placas fora das vias, estabilidade dos rótulos sob escala/giro, fantasmas no PC e na RA interativa simulada, geometria e alvos animados no USDZ.

Não houve teste físico do Quick Look no iPhone nem no Galaxy A56. A validação de um arquivo USDZ e do rastreador simulado não comprova o comportamento da câmera ou do visualizador nativo num aparelho real.
