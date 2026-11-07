# Checklist RA8 — implementação e testes locais

- [x] Remover bolas verdes espalhadas e incorporadas à estação e à oficina.
- [x] Ampliar novamente o bonde sem alterar largura, rodas ou bitola.
- [x] Aumentar e destacar o operador, com espaço junto à alavanca.
- [x] Ampliar a oficina e medir a passagem do bonde nas duas rotas.
- [x] Ajustar o desvio para acomodar a oficina sem cruzar trilhos.
- [x] Aplicar textura às paredes e coberturas da cidade.
- [x] Criar janelas nas quatro fachadas, inclusive fundos e laterais.
- [x] Afastar árvores dos edifícios, incluindo as duas próximas à direita.
- [x] Melhorar navegação no PC: girar, mover, zoom, vistas e retorno à visão geral.
- [x] Verificar mouse, teclado, tamanho de tela e preservação dos controles móveis.
- [x] Repetir percursos principal/ramal, impacto, fantasmas, reinício e relógio.
- [x] Reconstruir USDZ e auditar geometria, referências e ações nativas.

Publicação: o pull request deve registrar o resultado da suíte completa, da revisão
final e da conferência dos arquivos servidos pelo site. Estes resultados ficam
na descrição do PR e nos registros do workflow `Auditar RA do Bonde`.

Medidas em relação à RA7: bonde aproximadamente 25% mais alto, mantendo
largura e rodeiros; operador 35% maior; oficina 40% maior. Ramal interno
reposicionado para ampliar o corredor da oficina, com verificação de colisão
em 801 posições de cada percurso.

Navegação: arraste para girar; selecione Mover ou use o botão direito para
deslocar; roda ou botões para zoom; setas para deslocar; R para visão geral.
O painel também oferece foco no bonde, operador, oficina, estação e vista superior.

O rastreio físico e a execução dos comportamentos Quick Look precisam ser
confirmados no iPhone. Testes de código, renderização e validação USDZ não
substituem essa etapa no aparelho.
