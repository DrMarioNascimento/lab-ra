# Identidade visual da Viagem do O₂

Implementada em 09/11/2026, somente no diretório `viagem-o2/`.

## Artes de fundo

- `assets/hemacias.webp`: hemácias em ambiente microscópico, usada na capa e no embarque do telão. Imagem gerada com a ferramenta nativa de imagens, em composição horizontal, iluminação ciano e células rubras nas bordas, centro livre para texto. Sem texto incorporado. 90.430 bytes.
- `assets/moleculas-parede.webp`: papel de parede vertical com pares de esferas, brilho suave, atmosfera molecular e espaço central livre. Imagem gerada com a ferramenta nativa de imagens, em tons neutros para receber as cores das equipes por CSS. 23.060 bytes.

As imagens foram convertidas para WebP. As variações de cor usam a mesma imagem, sem sete downloads diferentes. A técnica de camada de cor segue a referência da Casa da Costa. No simulador, o papel fica preso à área visível do celular enquanto o conteúdo rola.

## Equipes

| Número | Nome | Cor |
| --- | --- | --- |
| 1 | Celeste | #38bdf8 |
| 2 | Rubi | #f43f5e |
| 3 | Âmbar | #f59e0b |
| 4 | Esmeralda | #10b981 |
| 5 | Violeta | #8b5cf6 |
| 6 | Coral | #fb7185 |
| 7 | Índigo | #6366f1 |

Cor, nome e número permanecem disponíveis ao longo das fases. As cores identificam equipes, não saturação, tipo de sangue ou condição fisiológica. O ícone identifica o posto atribuído; ele não depende da posição da cor na lista.

## Ícones autorais em SVG

Ventilação (pulmões), difusão (alvéolos e capilar), arterial (vaso com hemácias), coração, distribuição (ramificação vascular), tecido (mitocôndria), retorno (veia e valvas), molécula de O₂ e mochila. Os SVGs possuem gradientes e sombras discretas, sem biblioteca externa. São representações esquemáticas, não modelos anatômicos.

## Movimento e leitura

Molécula com dois átomos na capa e no circuito. O mapa mantém a sequência de estações do protótipo. Fundos decorativos não interceptam toque. Conteúdo sobre superfícies escuras, foco de teclado visível, contraste de números adaptado à cor do grupo e layout responsivo. `prefers-reduced-motion` desativa o movimento decorativo.

A entrada em salas reais permanece em preparação; esta entrega não acrescenta autenticação ou sincronização Firebase.
