# Coração 3D para a bancada 11

Documento técnico da malha de ensino. **Isto não é o coração acabado.**
A bancada que o aluno abre hoje (`coracao/`) continua sendo o modelo
esquemático afinado contra o livro. Este arquivo define o que a malha
anatômica precisa ser para um dia substituí-lo sem mentir.

Prioridades, nesta ordem — não pular a 2 para polir a 4:

1. **Separação nomeada** — cada peça que o professor aponta tem um nó
2. **Câmaras fechadas com parede de verdade** — duas superfícies, não casca
3. **Escala, orientação, origem** — milímetro, Y-up, ápice do VE na origem
4. **Válvulas cúspide a cúspide** — folheto que abre, não tampa única

## Hierarquia de nomes

Nós em `snake_case` português. O glb de ensino (quando existir) usa
exatamente estes nomes — a bancada liga física a geometria pelo nome,
não por índice.

```
coracao
├── ventriculo_esquerdo
│   ├── parede_externa_ve          # epicárdio
│   ├── parede_interna_ve          # endocárdio (normais para dentro)
│   └── musculo_papilar_*_ve
├── ventriculo_direito
│   ├── parede_externa_vd
│   ├── parede_interna_vd
│   └── musculo_papilar_*_vd
├── atrio_esquerdo
│   ├── parede_ae                  # também duas superfícies, quando houver
│   └── auricula_esquerda
├── atrio_direito
│   ├── parede_ad
│   └── auricula_direita
├── valva_mitral
│   ├── cuspide_anterior_mitral
│   ├── cuspide_posterior_mitral
│   └── cordas_tendineas_mitral
├── valva_tricuspide
│   ├── cuspide_anterior_tricuspide
│   ├── cuspide_posterior_tricuspide
│   ├── cuspide_septal_tricuspide
│   └── cordas_tendineas_tricuspide
├── valva_aortica
│   ├── cuspide_anterior_aortica
│   ├── cuspide_posterior_direita_aortica
│   └── cuspide_posterior_esquerda_aortica
├── valva_pulmonar
│   ├── cuspide_anterior_esquerda_pulmonar
│   ├── cuspide_anterior_direita_pulmonar
│   └── cuspide_posterior_pulmonar
├── vasos
│   ├── aorta_ascendente
│   ├── arco_aortico
│   ├── tronco_pulmonar
│   ├── veia_cava_superior
│   ├── veia_cava_inferior
│   └── veia_pulmonar_{superior,inferior}_{direita,esquerda}
├── coronarias                     # na superfície, nos sulcos
└── conducao
    ├── no_sinusal
    ├── no_atrioventricular
    ├── feixe_de_his
    ├── ramos_de_his
    └── purkinje
```

Grupos extras no export WIP (`cavidade_*`, `miocardio_*` sólido,
`coracao_WIP`) são **instrumentos de inventário**, não nomes de ensino.
A cavidade sólida do BodyParts3D mede volume; não é a parede interna.

## Unidades, eixos, origem

| | Valor |
|---|---|
| Unidade | **1 unidade = 1 mm** (igual a `coracao/modelos.js`) |
| Up | **+Y** |
| Esquerda do paciente | **+X** |
| Origem | **ápice do ventrículo esquerdo** |
| Orçamento | **≤ 60 000 triângulos** no glb de ensino |

O BodyParts3D 4.0 nativo **não** está nesse quadro: a origem é a grade do
corpo, +Y é posterior, +Z é superior. A transformação está documentada
em `scripts/pecas.py` (`TRANSFORMACAO_TODO`) e nos `extras` do glb WIP.
**Não está validada.** O ápice candidato deste PR é o vértice de menor Z
nativo da cavidade do VE (FJ2422).

O glTF oficial conta em metros. Esta bancada, como as irmãs, conta em
milímetros. O visualizador tem de saber disso.

## Parede = duas superfícies

A espessura é a informação: ~10 mm à esquerda contra ~3 mm à direita é
a resposta à diferença de pressão. Por isso a câmara **não** é uma casca
com `solidify` decorativo.

- Superfície externa (epicárdio), normais para fora
- Superfície interna (endocárdio), normais para dentro **na geometria**,
  nunca via `side: BackSide` — o glTF descarta isso e o USDZ do iPhone
  descarta até o `doubleSided`
- A face do corte liga as duas e é o que mostra a espessura

O BodyParts3D entrega um segmento sólido de miocárdio + um sólido da
cavidade. Isso **não** cumpre este item. Ver `INVENTORY.md`.

Câmaras fechadas: o volume interno tem de ser mensurável (ml) e bater,
na ordem de grandeza, com o livro (VE ~120 ml no fim da diástole no
vivo; o voxel de cadáver/modelo masculino do BP3D **não** é um VE de
120 ml — o cabeçalho do FJ2422 declara 97 cm³). O professor valida;
o pipeline não “corrige” o volume.

## Válvulas, cúspide a cúspide

Cada folheto é um nó. A mitral tem dois; as semilunares e a tricúspide,
três. Cúspide é bolsa, não tampa: prende no anel, solta na borda.

Morphs (abertura 0–1) são **opcionais** neste começo. A bancada 11 hoje
molda as cúspides no procedural. Quando a malha anatômica tiver morphs,
o motor em `coracao/fisica.js` continua mandando — geometria não decide
número.

## Materiais

- **Miocárdio:** fosco, pardo-avermelhado de músculo — não vermelho-sangue
- **Vasos e coronárias:** lustrosos (lisos, molhados)
- A diferença fosco/lustroso separa as peças mesmo quando o ACES comprime o matiz

Não usar a paleta verde-amarela da marca dentro do órgão.

## Coronárias

Correm **na superfície**, nos sulcos (descendente anterior no
interventricular; circunflexa e direita no atrioventricular).
Artéria desenhada solta some dentro da carne. Sem sulco, não se ensina
território de oclusão.

## Condução

Cada peça acende na sua vez. Sem malha anatômica, a bancada usa o
esquema. **Não inventar** nó sinusal “no lugar certo”.

## Licença do derivado

O glb de ensino, quando for derivado de BodyParts3D / Z-Anatomy, sai
**CC-BY-SA** (ShareAlike do original japonês + do Z-Anatomy). Ver
`LICENSE.md`. Atribuição no arquivo e na bancada.

## O que este PR entrega e o que não entrega

Entrega: spec, atribuição, inventário honesto, catálogo + OBJ do coração,
esqueleto de pipeline, glb **WIP** hierárquico.

Não entrega: coração de ensino, paredes de duas superfícies, aurículas,
condução, cordas, orçamento de 60k, origem validada pelo professor.
