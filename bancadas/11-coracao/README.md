# Pipeline do coração 3D — bancada 11

**Isto é o começo, não o coração de ensino.**

A bancada que o aluno abre — [coracao/](../../coracao/) — continua sendo
o modelo esquemático (paredes duplas desenhadas, válvulas por pressão,
um relógio só). Este diretório é a esteira que tenta trazer malha
anatômica **sem inventar peça**.

| | |
|---|---|
| Spec | [SPEC.md](SPEC.md) |
| Inventário | [INVENTORY.md](INVENTORY.md) |
| Licença | [LICENSE.md](LICENSE.md) |
| glb WIP | [export/coracao-bancada11-WIP.glb](export/coracao-bancada11-WIP.glb) |

O glb chama-se `coracao-bancada11-WIP.glb` de propósito. Não ligar na
bancada 11 como se já ensinasse.

## Como validar volumes e espessura (professor)

Os OBJ do BodyParts3D trazem no cabeçalho `Volume(cm3)` e `Bounds(mm)`.
Não são número nosso.

1. Abra `fontes/bodyparts3d/obj/FJ2422.obj` (cavidade do VE). O
   cabeçalho declara **97,05 cm³**. No vivo, o volume diastólico final
   do livro que a bancada afina é **120 ml**. Os 23 ml de diferença são
   do modelo (homem adulto do voxel, fase não declarada como telediástole
   de ensino) — **não “corrigir” o volume no Blender para bater 120**.
2. Cavidade do VD: `FJ2423.obj`. Compare a ordem de grandeza com o VD
   do livro; o direito no voxel **não** é o gêmeo do esquerdo.
3. Espessura: o BP3D **não** entrega duas superfícies. Para medir o que
   há, abra o glb WIP, corte o `miocardio_ve` e o `miocardio_vd` e use
   uma régua em mm (1 unidade = 1 mm). Se a parede esquerda não for
   claramente mais grosso que a direita, o sólido voxel não está
   ensinando — e a spec (prioridade 2) continua aberta.
4. Átrios: `parede_ae` / `parede_ad` são uma casca só. Aurículas: **não
   estão**. Se alguém desenhou uma orelhinha neste PR, é erro.
5. Válvulas: cada `cuspide_*` deve ser um folheto. A exceção honesta é
   `cuspide_posterior_mitral` = `FJ2432`, o mesmo arquivo que o catálogo
   também chama de parede inferior do VE. Não separe o que o voxel uniu.
6. Eixos: no glb WIP a origem foi para o menor Z nativo da cavidade do
   VE e o Y foi para cima **por proposta**. Confira: ápice em (0,0,0),
   base para +Y, esquerda do paciente para +X. Se o ápice estiver no
   sítio errado, desligar a transformação — o interruptor no Blender é
   `APLICAR_TRANSFORMACAO = False` em `scripts/blender_montar_coracao.py`.
   O Python `montar_wip.py` aplica e declara nos `extras` do nó raiz.
7. Orçamento: o JSON em `export/coracao-bancada11-WIP.json` diz quantos
   triângulos saíram. A spec pede ≤ 60 000. Se passou, o glb continua
   WIP — não decimar fundindo cúspide com parede.

Abrir o glb: Blender, ou um viewer glTF (Don McCurdy). Não precisa da
bancada autenticada.

## Como remontar

```bash
python3 bancadas/11-coracao/scripts/baixar_bodyparts3d.py
python3 bancadas/11-coracao/scripts/gerar_inventario.py
python3 bancadas/11-coracao/scripts/montar_wip.py
# se houver Blender:
blender --background --python bancadas/11-coracao/scripts/blender_montar_coracao.py
```

O zip oficial (~62 MB) não vai no git. Os OBJ do coração (~7 MB) vão,
para o inventário ser reproduzível sem o pacote inteiro.

## Lacunas de modelagem (na ordem da spec)

1. **Nomeação** — os nós da spec existem no glb. Peças ❌ são nós vazios
   de propósito, para ninguém preencher com esfera.
2. **Duas superfícies** — maior buraco. Extrair epicárdio/endocárdio do
   sólido, ou remodelar, sem inventar espessura. A face do corte ainda
   não existe na malha anatômica.
3. **Origem / eixos** — proposta feita, não assinada. glTF-metros vs
   mm da bancada: decidir e documentar no viewer.
4. **Cúspides** — 11 malhas estão. Falta: morph de abertura, anel
   fibroso separado, cordas. `FJ2432` precisa de decisão do professor
   (folheto ou parede inferior?).
5. Aurículas, condução, cordas: só entram com fonte (Z-Anatomy
   conferido no blend, ou outro CC-BY-SA). Sem fonte, ficam no esquema.

## Relação com a bancada ao vivo

`coracao/modelos.js` já faz paredes duplas, cúspides-bolsa, coronária
na superfície e condução em peças. É desenho, não cadáver. O motor em
`coracao/fisica.js` não importa geometria — essa separação permanece
quando a malha anatômica estiver pronta.
