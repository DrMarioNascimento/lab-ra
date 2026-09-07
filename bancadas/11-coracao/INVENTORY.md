# Inventário — Coração 3D · bancada 11

Mapeamento das peças da spec para BodyParts3D 4.0 (PART-OF) e para nomes do TA2 usados pelo Z-Anatomy.
**Não inventa anatomia.** Peça sem malha fica ❌. Composto que mistura estruturas fica ⚠️.

| | n |
|---|---:|
| ✅ presente (malha ELEMENT no disco, nome bate) | 30 |
| ⚠️ parcial (malha existe mas não é o que a spec pede, ou o voxel alia duas coisas) | 7 |
| ❌ ausente no BodyParts3D 4.0 | 13 |
| · grupo (só hierarquia) | 12 |

Z-Anatomy: o atlas Blender **não foi extraído** neste PR (template de 86 MB).
A coluna TA2 diz se o termo existe na nomenclatura do projeto; isso **não** prova malha no `.blend`.

| Spec | EN / FMA / BP | FJ | BP3D | Z-Anatomy / TA2 | Nota |
|---|---|---|---|---|---|
| `parede_externa_ve` | epicardial surface of LV wall | — | ❌ ausente | — | A spec pede DUAS superfícies. O BP3D entrega segmento sólido de miocárdio, não epicárdio separado. |
| `parede_interna_ve` | endocardial surface of LV wall | — | ❌ ausente | — | Idem: não há malha de endocárdio. A cavidade sólida (FJ2422) é o volume, não a face interna. |
| `miocardio_ve` | myocardium of left ventricle (remaining ELEMENT) / FMA9558 / BP9851 | FJ2418, FJ2429, FJ2432 | ⚠️ parcial | — | ⚠️ composto mistura zona/papilar/folheto. Exportamos só FJ que não forem já uma cúspide ou cavidade. |
| `cavidade_ve` | cavity of left ventricle / FMA9466 / BP10057 | FJ2422 | ✅ presente | — | cavidade sólida (volume). Não é parede de duas superfícies. |
| `musculo_papilar_anterolateral_ve` | anterolateral head of lateral papillary muscle of left ventricle / FMA7265 / BP9842 | FJ2418 | ✅ presente | — |  |
| `parede_externa_vd` | epicardial surface of RV wall | — | ❌ ausente | — | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `parede_interna_vd` | endocardial surface of RV wall | — | ❌ ausente | — | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `miocardio_vd` | myocardium of right ventricle / FMA9535 / BP9603 | FJ2419, FJ2430, FJ2437 | ⚠️ parcial | — | 3/3 FJ no disco; composto PART-OF pode misturar peças |
| `cavidade_vd` | cavity of right ventricle / FMA9291 / BP10208 | FJ2423 | ✅ presente | — | cavidade sólida (volume). Não é parede de duas superfícies. |
| `musculo_papilar_anterior_vd` | anterior papillary muscle of right ventricle / FMA7260 / BP10231 | FJ2419 | ✅ presente | — | O mesmo FJ2419 também é listado como «anterior wall of right ventricle» — não separamos o que o voxel não separa. |
| `musculo_papilar_posterior_vd` | posterior papillary muscle of right ventricle / FMA7261 / BP9637 | FJ2430 | ✅ presente | — | Mesmo FJ2430 = inferior wall of right ventricle no catálogo. |
| `musculo_papilar_septal_vd` | septal papillary muscle of right ventricle / FMA7262 / BP9594 | FJ2437 | ✅ presente | — |  |
| `parede_ae` | wall of left atrium / FMA9531 / BP10221 | FJ2438 | ✅ presente | — |  |
| `cavidade_ae` | cavity of left atrium / FMA9465 / BP9925 | FJ2425 | ✅ presente | — | cavidade sólida (volume). Não é parede de duas superfícies. |
| `auricula_esquerda` | left auricle of heart | — | ❌ ausente | TA2 4055 (nome; malha do blend não conferida) | TA2 nomeia; BodyParts3D PART-OF/IS-A 4.0 não tem malha de aurícula. Não inventar a orelhinha. |
| `parede_ad` | wall of right atrium / FMA9457 / BP9921 | FJ2439 | ✅ presente | — |  |
| `cavidade_ad` | cavity of right atrium / FMA11359 / BP9906 | FJ2424 | ✅ presente | — | cavidade sólida (volume). Não é parede de duas superfícies. |
| `auricula_direita` | right auricle of heart | — | ❌ ausente | TA2 4023 (nome; malha do blend não conferida) | Ausente no BP3D 4.0. Z-Anatomy/TA2 nomeia; malha do blend não foi extraída neste PR. |
| `cuspide_anterior_mitral` | anterior leaflet of mitral valve / FMA7242 / BP9874 | FJ2420 | ✅ presente | — |  |
| `cuspide_posterior_mitral` | posterior leaflet of mitral valve / FMA7243 / BP9998 | FJ2432 | ⚠️ parcial | — | ⚠️ O mesmo FJ2432 é também «inferior wall of left ventricle» / zona 4. Não fatiamos o voxel. |
| `cuspide_anterior_tricuspide` | anterior leaflet of tricuspid valve / FMA7238 / BP9920 | FJ2421 | ✅ presente | — |  |
| `cuspide_posterior_tricuspide` | posterior leaflet of tricuspid valve / FMA7239 / BP9829 | FJ2433 | ✅ presente | — |  |
| `cuspide_septal_tricuspide` | septal leaflet of tricuspid valve / FMA7240 / BP9887 | FJ2436 | ✅ presente | — |  |
| `cuspide_anterior_aortica` | anterior cusp of aortic valve / FMA7253 / BP9760 | FJ2435 | ✅ presente | — |  |
| `cuspide_posterior_direita_aortica` | right posterior cusp of aortic valve / FMA7252 / BP9446 | FJ2431 | ✅ presente | — |  |
| `cuspide_posterior_esquerda_aortica` | left posterior cusp of aortic valve / FMA7254 / BP9993 | FJ2426 | ✅ presente | — |  |
| `cuspide_anterior_esquerda_pulmonar` | left anterior cusp of pulmonary valve / FMA7247 / BP10131 | FJ2417 | ✅ presente | — |  |
| `cuspide_anterior_direita_pulmonar` | right anterior cusp of pulmonary valve / FMA7249 / BP10108 | FJ2434 | ✅ presente | — |  |
| `cuspide_posterior_pulmonar` | posterior cusp of pulmonary valve / FMA7250 / BP9867 | FJ2427 | ✅ presente | — |  |
| `aorta_ascendente` | ascending aorta / FMA3736 / BP10408 | FJ3413 | ✅ presente | — |  |
| `arco_aortico` | arch of aorta / FMA3768 / BP10404 | FJ3411 | ✅ presente | — |  |
| `tronco_pulmonar` | pulmonary trunk / FMA8612 / BP9912 | FJ2966 | ✅ presente | — |  |
| `veia_cava_superior` | superior vena cava / FMA4720 / BP10386 | FJ3645 | ✅ presente | — |  |
| `veia_cava_inferior` | inferior vena cava / FMA10951 / BP10397 | FJ3441, FJ3659 | ⚠️ parcial | — | 2/2 FJ no disco; composto PART-OF pode misturar peças |
| `veia_pulmonar_superior_direita` | right superior pulmonary vein (extrapulmonary FJ only) / FMA49914 / BP9365 | FJ3020 | ✅ presente | — | Só os FJ que não estão no composto intrapulmonar. |
| `veia_pulmonar_inferior_direita` | right inferior pulmonary vein (extrapulmonary FJ only) / FMA49911 / BP9407 | FJ3040 | ✅ presente | — |  |
| `veia_pulmonar_superior_esquerda` | left superior pulmonary vein (extrapulmonary FJ only) / FMA49916 / BP9499 | FJ2925, FJ2933 | ⚠️ parcial | — | 2/2 FJ no disco; composto PART-OF pode misturar peças |
| `veia_pulmonar_inferior_esquerda` | left inferior pulmonary vein (extrapulmonary FJ only) / FMA49913 / BP9712 | FJ2944, FJ2950, FJ2955 | ⚠️ parcial | — | 3/3 FJ no disco; composto PART-OF pode misturar peças |
| `tronco_coronaria_esquerda` | trunk of left coronary artery / FMA3855 / BP10074 | FJ2737 | ✅ presente | — |  |
| `tronco_descendente_anterior` | trunk of anterior interventricular branch of left coronary artery / FMA74912 / BP10078 | FJ2631 | ✅ presente | — |  |
| `tronco_coronaria_direita` | trunk of right coronary artery / FMA3802 / BP9674 | FJ2723 | ✅ presente | — |  |
| `seio_coronario` | coronary sinus / FMA4706 / BP10136 | FJ2655 | ✅ presente | — |  |
| `ramos_coronarios_nao_nomeados_um_a_um` | remaining heart ELEMENT files of the coronary/cardiac-vein trees / FMA50040 / BP9549 | FJ2631, FJ2632, FJ2633, FJ2634, FJ2635, FJ2636, FJ2637, FJ2638… | ⚠️ parcial | — | 25/25 FJ no disco; composto PART-OF pode misturar peças |
| `no_sinusal` | sinu-atrial node | — | ❌ ausente | TA2 3953 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `no_atrioventricular` | atrioventricular node | — | ❌ ausente | TA2 3954 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `feixe_de_his` | atrioventricular bundle | — | ❌ ausente | TA2 3955 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `ramos_de_his` | bundle branches | — | ❌ ausente | TA2 3956 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `purkinje` | subendocardial branches | — | ❌ ausente | TA2 3961 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `cordas_tendineas_mitral` | chordae tendineae of left atrioventricular valve | — | ❌ ausente | TA2 4069 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |
| `cordas_tendineas_tricuspide` | chordae tendineae of right atrioventricular valve | — | ❌ ausente | TA2 4047 (nome; malha do blend não conferida) | sem malha no BodyParts3D 4.0 PART-OF/IS-A |

## O que a spec pede e o voxel não entrega

### Paredes como duas superfícies (prioridade 2) — ❌

BodyParts3D segmenta **miocárdio sólido** + **cavidade sólida** (o volume de sangue).
Não há `parede_externa_*` / `parede_interna_*` como duas faces.
Usar a cavidade como «endocárdio» seria mentir: é um preenchimento, não a face interna.
A bancada esquemática em `coracao/modelos.js` já constrói as duas superfícies *proceduralmente* — isso não é anatomia de cadáver.

### Aurículas — ❌

Nem PART-OF nem IS-A 4.0 listam *left/right auricle*. TA2 4023 e 4055 nomeiam.
Z-Anatomy pode ter no blend (não conferido). **Não modelar de cabeça.**

### Cúspides — ✅ com um ⚠️

As 11 cúspides/folhetos têm FJ próprios. Exceção: `FJ2432` é ao mesmo tempo
*posterior leaflet of mitral valve* e *inferior wall of left ventricle*.
O inventário não fatiou o voxel.

### Coronárias na superfície — ⚠️

Os ramos existem no mesmo corpo (FMA50039 / FMA50040 / FMA50308 estão *dentro* de FMA7088).
Isso não prova que correm no sulco por cima do epicárdio — o voxel pode atravessar carne.
Conferir no glb WIP antes de ensinar território de oclusão.

### Condução — ❌

Nó sinusal, nó AV, His, ramos, Purkinje: zero hits no PART-OF e no IS-A 4.0.
TA2 3952–3961 nomeia. Sem malha, a bancada 11 continua usando o desenho esquemático de `coracao/modelos.js`.

### Cordas tendíneas — ❌

Ausentes no BP3D. TA2 4047 / 4069 nomeia.

## Como este arquivo é gerado

```
python3 bancadas/11-coracao/scripts/gerar_inventario.py
```

