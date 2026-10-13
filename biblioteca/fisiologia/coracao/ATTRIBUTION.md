# Cópias de atribuição

Ver [LICENSE.md](LICENSE.md) — BodyParts3D CC-BY-SA 2.1 JP e Z-Anatomy CC-BY-SA 4.0.

## Peça A · o scan realista

A referência *Realistic Human Heart* corresponde somente à **Vista Externa**. A **Vista Interna** tem a fonte própria indicada na seção Peça B.

**Crédito do modelo 3D:** *Realistic Human Heart*, de
[neshallads](https://sketchfab.com/neshallads), disponibilizado no
[Sketchfab](https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089)
sob a licença Creative Commons Atribuição 4.0 Internacional —
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br).

**Alterações para este simulador:** ajuste de escala, materiais e animação.

Os batimentos de cada área cardíaca (segmento) foram cuidadosamente calculados pelo Prof. Mário César Nascimento, PhD, e sincronizados ao ciclo cardíaco simulado, com movimentos distintos para átrios, ventrículos, plano valvar e ápice. Essa animação foi desenvolvida para o simulador; não é uma animação fornecida pelo autor do scan.

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
[especificação original](https://github.com/DrMarioNascimento/lab-ra/blob/85d13200078f5201d251c857efde5326cd53daa7/bancadas/11-coracao/SPEC.md) para a esteira que a monta.


## Vista no tórax — 10/10/2026

Terceira vista compartilhada pelos percursos de Educação Física e Fisioterapia. Arquivo `../assets/torax-vasos-encaixe.glb`, fornecido por Mário César Nascimento; SHA-256 `7317d2261a01a662cf445e0fb32075cbf445b3e247e028d4162f0f1e63b96dc5`. Metadados declaram BodyParts3D como fonte e ajuste local do diafragma. O arquivo original é preservado, sem redução das malhas. Normalização de enquadramento e atenuação de materiais ocorrem somente na cena. O modelo não contém animações; não se atribui a ele o batimento das vistas interna e externa.

Carregamento sob demanda, com nova tentativa em caso de falha. A atenuação de pulmões e arcabouço facilita a observação do coração e dos vasos; os rótulos cardíacos A/B não são aplicados ao tórax. A exportação RA conserva a escala anatômica medida do arquivo, separada da escala do coração isolado.
