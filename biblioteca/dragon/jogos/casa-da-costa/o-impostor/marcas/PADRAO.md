# Padrão Dragon Games — marcas nas peças (O Impostor)

Aprovado em 26/09/2026. Vale para **toda peça de RA e todo documento extra** criado para o jogo.

## As três marcas oficiais

| Marca | Arquivo | Onde vai |
|---|---|---|
| **Medalhão de metal** | `medalhao_metal.png` (recortado, fundo transparente) | Dentro das placas e etiquetas de metal. Não vai solto. |
| **Carimbo de tinta** | `carimbo_tinta.png` (recortado do papel) | Documentos de papel: páginas, plantas, cartas, e-mails impressos. |
| **Placa / etiqueta de aço** | gerada por `ferramenta/marca.py` | Peças de RA (móveis, objetos, construções). |

Texto do medalhão e do carimbo: **ARQUIVO DRAGON GAMES ©** em cima, **Primavera de 2026** embaixo.

## Regras de colocação

- **Discreta, como um fabricante poria.** Etiqueta pequena (≈ 6 × 2,25 cm) em lugar de fabricante: lateral baixa de trás, travessa por baixo do tampo, costas, dentro de porta ou gaveta. **Nunca em cima da mesa ou no meio de uma face nobre.**
- **Placa institucional só onde faz sentido no mundo** (ex.: a placa de aço do farol, ao lado da porta, com os dados do farol). Ela pode carregar informação do jogo.
- **Carimbo em documento:** num canto livre, levemente girado (±10°), sem cobrir texto que o jogador precise ler.
- **Uma marca por peça.** Não repetir etiqueta e carimbo no mesmo objeto.

## Materiais e tipografia

- Aço escovado (letras em relevo mais escuras), medalhão bronze/ouro, carimbo vermelho.
- Placas: **Lora** (serifada). Nada de fontes novas sem atualizar este arquivo.
- Tudo sai como material PBR (cor, normal, ORM) — o relevo aparece com a luz da cena. As páginas de RA usam `ra/ambiente.js` para os metais refletirem.

## Aplicado até agora

| Peça | Marca | Lugar |
|---|---|---|
| Farol | Placa de aço 1,0 × 0,625 m | Na torre, à direita da porta, 2,75 m de altura |
| Relógio de caixa alta | Etiqueta 6 × 2,25 cm | Lateral direita da base, canto baixo de trás |
| Quarto de serviço | Etiqueta 6 × 2,25 cm | Travessa da frente da mesa, junto ao pé direito |
| Quarto de serviço | Carimbo | Canto inferior direito da planta do quarto |
| Livro do farol | Carimbo | Página esquerda, abaixo da rubrica |
| Escrivaninha | Etiqueta 6 × 2,25 cm | Costas do móvel, canto baixo à direita (textura da etiqueta em `marcas/etiqueta_*.png`) |
| Bandeja das sete xícaras | Carimbo (como marca de fábrica da louça) | Fundo das seis xícaras da casa; aparece quando a ordem é resolvida. A sétima, de outro jogo, não tem. Pedido do Mario em 28/09/2026: aqui o carimbo é o próprio emblema da louça, então a bandeja não leva etiqueta |

## Ferramenta

`ferramenta/marca.py` gera placas e etiquetas (`placa(W, H, linhas)`), `aplicar.py` põe as marcas nos GLB, `reposicionar.py` move etiquetas já aplicadas.
