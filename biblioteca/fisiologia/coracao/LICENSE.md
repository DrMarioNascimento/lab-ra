# Licença e atribuição — malhas do coração

Esta experiência usa três modelos com fontes e licenças distintas:

- **Somente Vista Externa:** `../assets/coracao.glb`, *Realistic Human Heart*, de [neshallads](https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089), sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br). Não é derivado do BodyParts3D. Escala, materiais e animação foram adaptados; as texturas do autor permanecem.
- **Vista Interna:** `../assets/coracao-interno.glb`, derivado do BodyParts3D com 79 malhas, sob **CC BY-SA 2.1 JP**, conforme a licença preservada nos arquivos usados na origem. A procedência histórica está documentada abaixo.

Os batimentos de cada área cardíaca (segmento) foram cuidadosamente calculados pelo **Prof. Mário César Nascimento, PhD**, e sincronizados ao ciclo cardíaco simulado. Essa atribuição ao trabalho do simulador não substitui os créditos dos modelos de terceiros. Consulte [ATTRIBUTION.md](ATTRIBUTION.md).

Os componentes originais do projeto seguem [a licença principal](../../LICENSE.md); os modelos acima conservam suas licenças próprias. A migração não inclui o catálogo PART-OF, os OBJ originais ou arquivos `.blend` de Z-Anatomy.

## BodyParts3D

- **Nome:** BodyParts3D / Anatomography
- **Autores:** Kousaku Okubo e colaboradores; Database Center for Life Science (DBCLS), ROIS
- **Artigo:** Mitsuhashi N et al. *Nucleic Acids Res.* 2008. PMID 18835852. DOI dos dados: 10.18908/lsdba.nbdc00837-000
- **Arquivo usado:** `partof_BP3D_4.0_obj_99.zip` (Release 4.0, redução 99%)
- **Catálogo:** `partof_parts_list_e.txt`
- **Download oficial:** https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html

### Duas formulações de licença, as duas documentadas

Os **cabeçalhos dos próprios OBJ 4.0** (2013) dizem:

> BodyParts3D, (c) The Database Center for Life Science licensed under
> **CC Attribution-Share Alike 2.1 Japan**.

O Z-Anatomy atribui exatamente isso: *«BodyParts3D — The Database Center
for Life Science — CC-BY-SA 2.1 Japan»*.

A página do arquivo LSDB, atualizada em **2025-02-27**, passou a
declarar **Creative Commons Attribution 4.0 International**, com o texto
de atribuição:

> BodyParts3D, © The Database Center for Life Science licensed under
> CC Attribution 4.0 International.

Este laboratório **trata o derivado como CC-BY-SA 2.1 JP** (o que está
dentro do arquivo que copiámos, e o que o Z-Anatomy exige na cadeia).
Não se publica um glb “só CC-BY” a partir destas malhas.

Texto CC-BY-SA 2.1 JP: https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en

## Z-Anatomy

- **Nome:** Z-Anatomy — The libre 3D atlas of anatomy
- **Autores:** Gauthier Kervyn (design, 3D, anatomia), Marcin Zielinski (script Blender), Lluis Vinent (app)
- **Licença:** [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **Repositório:** https://github.com/Z-Anatomy/Models-of-human-anatomy
- **Atribuição pedida pelo projeto:**
  - *«BodyParts3D - The Database Center for Life Science - CC-BY-SA 2.1 Japan»*
  - *«Z-Anatomy - The libre 3D atlas of anatomy - CC-BY-SA 4.0»*

Neste PR o `.blend` / `Z-Anatomy.zip` **não foi extraído** (template de
~86 MB). Usámos só a nomenclatura TA2 e o `License.txt` para o inventário.
Quando uma malha do Z-Anatomy entrar no glb, a atribuição acima vai no
arquivo e na bancada.

## O que se pode e não se pode

- Pode: estudar, remixar, republicar **com atribuição e a mesma liberdade**.
- Não pode: tirar o ShareAlike, vender o glb como se fosse anatomia original
  deste laboratório, ou inventar uma aurícula e chamá-la BodyParts3D.

## Atribuição curta (para o glb e para a página)

> Coração WIP a partir de BodyParts3D © Database Center for Life Science,
> CC-BY-SA 2.1 JP. Nomenclatura conferida com Z-Anatomy, CC-BY-SA 4.0.
> Não é um coração de ensino acabado.

## Arquivos distribuídos nesta migração

| Caminho | Origem |
|---|---|
| `../assets/coracao.glb` | Scan *Realistic Human Heart*, somente Vista Externa; CC BY 4.0 |
| `../assets/coracao-interno.glb` | Cópia do `export/coracao-bancada11-WIP.glb` da origem; BodyParts3D, CC BY-SA 2.1 JP |
| `MODELO-INTERNO.json` | Metadados e limitações do modelo interno preservados da origem |
| `ATTRIBUTION.md` | Créditos e adaptações das duas vistas |


## Vista no tórax

`../assets/torax-vasos-encaixe.glb` conserva as 99 malhas e os atributos POSITION do tórax BodyParts3D já atribuído em [../assets/ATRIBUICAO.md](../assets/ATRIBUICAO.md), sob CC BY 4.0. O arquivo fornecido pelo autor é preservado integralmente. As transformações de encaixe permanecem as do arquivo enviado; normalização de enquadramento e atenuação são aplicadas na cena. Não é o modelo de neshallads nem a Vista Interna de 79 malhas.
