# Cópias de atribuição

Ver [LICENSE.md](LICENSE.md) — BodyParts3D CC-BY-SA 2.1 JP e Z-Anatomy CC-BY-SA 4.0.

## Peça A · o scan realista

**Crédito do modelo 3D:** *Realistic Human Heart*, de
[neshallads](https://sketchfab.com/neshallads), disponibilizado no
[Sketchfab](https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089)
sob a licença Creative Commons Atribuição 4.0 Internacional —
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br).

**Alterações para este simulador:** ajuste de escala, materiais e animação.

Em detalhe, porque a CC BY pede que as alterações sejam indicadas e porque
quem vier depois precisa saber o que é do autor e o que é nosso:

- **escala** — a peça é normalizada para a mesma altura da peça B, para que as
  duas possam ser comparadas lado a lado e postas na mesa no mesmo tamanho;
- **materiais** — o mapa de aspereza foi desligado, o fator metálico forçado a
  zero (o glTF não o declara, e o padrão do formato é 1,0) e acrescentada uma
  emissiva chapada de baixa intensidade para levantar o ápice, cujo escuro é
  pigmento assado na textura de cor, não sombra. As texturas do autor
  permanecem;
- **animação** — a malha é deformada por vértice a cada quadro, a partir do
  ciclo cardíaco simulado em `coracao/fisica.js`. Nenhuma animação foi
  embutida no arquivo, que continua sendo o do autor.

O crédito aparece **na própria página** onde a peça é mostrada, e não apenas
aqui: é o que a licença pede, e é onde o aluno o vê.

## Peça B · a montagem

Derivada do **BodyParts3D** (© The Database Center for Life Science,
CC-BY-SA 2.1 JP). Ver [LICENSE.md](LICENSE.md) e
[SPEC.md](SPEC.md) para a esteira que a monta.
