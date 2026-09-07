"""Peças nomeadas da especificação «Coração 3D para a bancada 11».

Não inventa anatomia: cada malha exportada aponta para um FMA / FJ do
BodyParts3D. Peças sem malha ficam status «ausente» e não entram no glb.
"""

# Prioridades da spec (não reordenar de leve):
#   1 nomeação  2 câmaras fechadas com duas superfícies  3 escala/origem  4 cúspides
PRIORIDADES = (
    "1_separacao_nomeada",
    "2_paredes_duas_superficies",
    "3_escala_orientacao_origem",
    "4_valvas_cuspide_a_cuspide",
)

# Convenção de eixos da spec (ensino). O BodyParts3D nativo NÃO está assim.
# Ver TRANSFORMACAO_TODO e o extras do glb WIP.
SPEC_EIXOS = {
    "unidade": "mm",
    "up": "Y",
    "paciente_esquerda": "+X",
    "origem": "apice_do_ventriculo_esquerdo",
    "glb_triangulos_max": 60_000,
}

# BodyParts3D nativo (medido nos OBJ 4.0 PART-OF 99%):
#   +X já é esquerda do paciente (centróide do VE > centróide do VD/AD)
#   +Y é posterior (o VD, anterior, tem Y mais negativo)
#   +Z é superior (átrios têm Z maior que o ápice)
BP3D_NATIVO = {
    "unidade": "mm",
    "x": "esquerda_do_paciente",
    "y": "posterior",
    "z": "superior",
    "origem": "grade_do_corpo_inteiro_nao_o_apice",
}

# Transformação proposta, NÃO validada pelo professor:
#   X' =  X - apice.x           (esquerda permanece +X)
#   Y' =  Z - apice.z           (superior vira up)
#   Z' =  Y - apice.y           (posterior vira +Z; triedro destro)
# Ápice WIP = vértice de menor Z nativo da cavidade do VE (FJ2422).
TRANSFORMACAO_TODO = {
    "status": "proposta_wip_nao_validada",
    "apice_fonte": "min_Z_nativo de FJ2422 (cavity of left ventricle)",
    "matriz_conceito": "X'=X-ax; Y'=Z-az; Z'=Y-ay",
    "faltando": [
        "confirmar o ápice no miocárdio (não só na cavidade sólida)",
        "conferir se +Z' posterior é a convenção de visualização da bancada",
        "glTF oficial é metro; esta bancada usa milímetro, como coracao/modelos.js",
        "decimar para ≤60k triângulos sem fundir peças nomeadas",
    ],
}

# material: miocardio fosco vs vaso lustroso (spec)
MATERIAIS = {
    "miocardio": {"grupo": "fosco", "roughness": 0.74, "metallic": 0.0, "baseColor": [0.56, 0.18, 0.20, 1]},
    "endocardio": {"grupo": "fosco", "roughness": 0.35, "metallic": 0.0, "baseColor": [0.85, 0.71, 0.72, 1]},
    "valva": {"grupo": "valva", "roughness": 0.28, "metallic": 0.0, "baseColor": [0.96, 0.93, 0.90, 1]},
    "vaso": {"grupo": "lustroso", "roughness": 0.28, "metallic": 0.0, "baseColor": [0.89, 0.45, 0.42, 1]},
    "vaso_venoso": {"grupo": "lustroso", "roughness": 0.32, "metallic": 0.0, "baseColor": [0.29, 0.33, 0.63, 1]},
    "coronaria": {"grupo": "lustroso", "roughness": 0.24, "metallic": 0.0, "baseColor": [0.94, 0.27, 0.29, 1]},
    "cavidade": {"grupo": "debug", "roughness": 0.5, "metallic": 0.0, "baseColor": [0.85, 0.2, 0.25, 0.35]},
}

# Cada peça de ensino: nome na hierarquia, FMA preferido (malha = união dos FJ
# ELEMENT desse conceito, sem duplicar FJ já usados por peça mais específica).
# status é preenchido pelo gerador a partir dos catálogos; aqui só a intenção.
#
# papéis:
#   malha     — deve sair no glb se houver FJ
#   grupo     — nó vazio
#   ausente   — exigido pela spec, sem fonte 3D honesta
#   debug     — cavidade sólida (volume), NÃO é parede

PECAS = [
    {"nome": "coracao_WIP", "papel": "grupo", "en": "heart (WIP root)",
     "fma": "FMA7088", "bp": "BP9305", "ta2": "3932"},

    {"nome": "ventriculo_esquerdo", "pai": "coracao_WIP", "papel": "grupo",
     "en": "left ventricle", "fma": "FMA7101", "bp": "BP9448", "ta2": "4056",
     "nota": "No PART-OF o composto do VE inclui cúspides aórticas e folheto mitral — não usar o composto inteiro como malha da câmara."},
    {"nome": "parede_externa_ve", "pai": "ventriculo_esquerdo", "papel": "ausente",
     "en": "epicardial surface of LV wall", "prioridade": 2,
     "nota": "A spec pede DUAS superfícies. O BP3D entrega segmento sólido de miocárdio, não epicárdio separado."},
    {"nome": "parede_interna_ve", "pai": "ventriculo_esquerdo", "papel": "ausente",
     "en": "endocardial surface of LV wall", "prioridade": 2,
     "nota": "Idem: não há malha de endocárdio. A cavidade sólida (FJ2422) é o volume, não a face interna."},
    {"nome": "miocardio_ve", "pai": "ventriculo_esquerdo", "papel": "malha",
     "en": "myocardium of left ventricle (remaining ELEMENT)", "fma": "FMA9558",
     "bp": "BP9851", "material": "miocardio", "prioridade": 2,
     "fj_excluir_nomes": ["cuspide_", "cavidade_"],
     "nota": "⚠️ composto mistura zona/papilar/folheto. Exportamos só FJ que não forem já uma cúspide ou cavidade."},
    {"nome": "cavidade_ve", "pai": "ventriculo_esquerdo", "papel": "debug",
     "en": "cavity of left ventricle", "fma": "FMA9466", "bp": "BP10057",
     "material": "cavidade", "prioridade": 2},
    {"nome": "musculo_papilar_anterolateral_ve", "pai": "ventriculo_esquerdo", "papel": "malha",
     "en": "anterolateral head of lateral papillary muscle of left ventricle",
     "fma": "FMA7265", "bp": "BP9842", "material": "miocardio"},

    {"nome": "ventriculo_direito", "pai": "coracao_WIP", "papel": "grupo",
     "en": "right ventricle", "fma": "FMA7098", "bp": "BP9598", "ta2": "4038",
     "nota": "Composto PART-OF inclui folhetos da tricúspide e cúspides pulmonares."},
    {"nome": "parede_externa_vd", "pai": "ventriculo_direito", "papel": "ausente",
     "en": "epicardial surface of RV wall", "prioridade": 2},
    {"nome": "parede_interna_vd", "pai": "ventriculo_direito", "papel": "ausente",
     "en": "endocardial surface of RV wall", "prioridade": 2},
    {"nome": "miocardio_vd", "pai": "ventriculo_direito", "papel": "malha",
     "en": "myocardium of right ventricle", "fma": "FMA9535", "bp": "BP9603",
     "material": "miocardio", "prioridade": 2},
    {"nome": "cavidade_vd", "pai": "ventriculo_direito", "papel": "debug",
     "en": "cavity of right ventricle", "fma": "FMA9291", "bp": "BP10208",
     "material": "cavidade", "prioridade": 2},
    {"nome": "musculo_papilar_anterior_vd", "pai": "ventriculo_direito", "papel": "malha",
     "en": "anterior papillary muscle of right ventricle",
     "fma": "FMA7260", "bp": "BP10231", "material": "miocardio",
     "nota": "O mesmo FJ2419 também é listado como «anterior wall of right ventricle» — não separamos o que o voxel não separa."},
    {"nome": "musculo_papilar_posterior_vd", "pai": "ventriculo_direito", "papel": "malha",
     "en": "posterior papillary muscle of right ventricle",
     "fma": "FMA7261", "bp": "BP9637", "material": "miocardio",
     "nota": "Mesmo FJ2430 = inferior wall of right ventricle no catálogo."},
    {"nome": "musculo_papilar_septal_vd", "pai": "ventriculo_direito", "papel": "malha",
     "en": "septal papillary muscle of right ventricle",
     "fma": "FMA7262", "bp": "BP9594", "material": "miocardio"},

    {"nome": "atrio_esquerdo", "pai": "coracao_WIP", "papel": "grupo",
     "en": "left atrium", "fma": "FMA7097", "bp": "BP9454", "ta2": "4054"},
    {"nome": "parede_ae", "pai": "atrio_esquerdo", "papel": "malha",
     "en": "wall of left atrium", "fma": "FMA9531", "bp": "BP10221",
     "material": "miocardio", "prioridade": 2},
    {"nome": "cavidade_ae", "pai": "atrio_esquerdo", "papel": "debug",
     "en": "cavity of left atrium", "fma": "FMA9465", "bp": "BP9925",
     "material": "cavidade"},
    {"nome": "auricula_esquerda", "pai": "atrio_esquerdo", "papel": "ausente",
     "en": "left auricle of heart", "ta2": "4055",
     "nota": "TA2 nomeia; BodyParts3D PART-OF/IS-A 4.0 não tem malha de aurícula. Não inventar a orelhinha."},

    {"nome": "atrio_direito", "pai": "coracao_WIP", "papel": "grupo",
     "en": "right atrium", "fma": "FMA7096", "bp": "BP9831", "ta2": "4022"},
    {"nome": "parede_ad", "pai": "atrio_direito", "papel": "malha",
     "en": "wall of right atrium", "fma": "FMA9457", "bp": "BP9921",
     "material": "miocardio", "prioridade": 2},
    {"nome": "cavidade_ad", "pai": "atrio_direito", "papel": "debug",
     "en": "cavity of right atrium", "fma": "FMA11359", "bp": "BP9906",
     "material": "cavidade"},
    {"nome": "auricula_direita", "pai": "atrio_direito", "papel": "ausente",
     "en": "right auricle of heart", "ta2": "4023",
     "nota": "Ausente no BP3D 4.0. Z-Anatomy/TA2 nomeia; malha do blend não foi extraída neste PR."},

    {"nome": "valva_mitral", "pai": "coracao_WIP", "papel": "grupo",
     "en": "mitral valve", "fma": "FMA7235", "bp": "BP9455", "ta2": "3987",
     "prioridade": 4,
     "nota": "O composto PART-OF lista também cúspides aórticas — ignoramos o composto e usamos folheto a folheto."},
    {"nome": "cuspide_anterior_mitral", "pai": "valva_mitral", "papel": "malha",
     "en": "anterior leaflet of mitral valve", "fma": "FMA7242", "bp": "BP9874",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_posterior_mitral", "pai": "valva_mitral", "papel": "malha",
     "en": "posterior leaflet of mitral valve", "fma": "FMA7243", "bp": "BP9998",
     "material": "valva", "prioridade": 4,
     "nota": "⚠️ O mesmo FJ2432 é também «inferior wall of left ventricle» / zona 4. Não fatiamos o voxel."},

    {"nome": "valva_tricuspide", "pai": "coracao_WIP", "papel": "grupo",
     "en": "tricuspid valve", "fma": "FMA7234", "bp": "BP9830", "ta2": "3982",
     "prioridade": 4},
    {"nome": "cuspide_anterior_tricuspide", "pai": "valva_tricuspide", "papel": "malha",
     "en": "anterior leaflet of tricuspid valve", "fma": "FMA7238", "bp": "BP9920",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_posterior_tricuspide", "pai": "valva_tricuspide", "papel": "malha",
     "en": "posterior leaflet of tricuspid valve", "fma": "FMA7239", "bp": "BP9829",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_septal_tricuspide", "pai": "valva_tricuspide", "papel": "malha",
     "en": "septal leaflet of tricuspid valve", "fma": "FMA7240", "bp": "BP9887",
     "material": "valva", "prioridade": 4},

    {"nome": "valva_aortica", "pai": "coracao_WIP", "papel": "grupo",
     "en": "aortic valve", "fma": "FMA7236", "bp": "BP9447", "ta2": "3993",
     "prioridade": 4},
    {"nome": "cuspide_anterior_aortica", "pai": "valva_aortica", "papel": "malha",
     "en": "anterior cusp of aortic valve", "fma": "FMA7253", "bp": "BP9760",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_posterior_direita_aortica", "pai": "valva_aortica", "papel": "malha",
     "en": "right posterior cusp of aortic valve", "fma": "FMA7252", "bp": "BP9446",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_posterior_esquerda_aortica", "pai": "valva_aortica", "papel": "malha",
     "en": "left posterior cusp of aortic valve", "fma": "FMA7254", "bp": "BP9993",
     "material": "valva", "prioridade": 4},

    {"nome": "valva_pulmonar", "pai": "coracao_WIP", "papel": "grupo",
     "en": "pulmonary valve", "fma": "FMA7246", "bp": "BP9868", "ta2": "4008",
     "prioridade": 4},
    {"nome": "cuspide_anterior_esquerda_pulmonar", "pai": "valva_pulmonar", "papel": "malha",
     "en": "left anterior cusp of pulmonary valve", "fma": "FMA7247", "bp": "BP10131",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_anterior_direita_pulmonar", "pai": "valva_pulmonar", "papel": "malha",
     "en": "right anterior cusp of pulmonary valve", "fma": "FMA7249", "bp": "BP10108",
     "material": "valva", "prioridade": 4},
    {"nome": "cuspide_posterior_pulmonar", "pai": "valva_pulmonar", "papel": "malha",
     "en": "posterior cusp of pulmonary valve", "fma": "FMA7250", "bp": "BP9867",
     "material": "valva", "prioridade": 4},

    {"nome": "vasos", "pai": "coracao_WIP", "papel": "grupo", "en": "great vessels"},
    {"nome": "aorta_ascendente", "pai": "vasos", "papel": "malha",
     "en": "ascending aorta", "fma": "FMA3736", "bp": "BP10408",
     "material": "vaso"},
    {"nome": "arco_aortico", "pai": "vasos", "papel": "malha",
     "en": "arch of aorta", "fma": "FMA3768", "bp": "BP10404",
     "material": "vaso"},
    {"nome": "tronco_pulmonar", "pai": "vasos", "papel": "malha",
     "en": "pulmonary trunk", "fma": "FMA8612", "bp": "BP9912",
     "material": "vaso_venoso"},
    {"nome": "veia_cava_superior", "pai": "vasos", "papel": "malha",
     "en": "superior vena cava", "fma": "FMA4720", "bp": "BP10386",
     "material": "vaso_venoso"},
    {"nome": "veia_cava_inferior", "pai": "vasos", "papel": "malha",
     "en": "inferior vena cava", "fma": "FMA10951", "bp": "BP10397",
     "material": "vaso_venoso",
     "nota": "O composto tem 2 FJ e desce pelo abdome — não é só o coto atrial."},
    {"nome": "veia_pulmonar_superior_direita", "pai": "vasos", "papel": "malha",
     "en": "right superior pulmonary vein (extrapulmonary FJ only)",
     "fma": "FMA49914", "bp": "BP9365", "material": "vaso",
     "fj_menos": "FMA68002",
     "nota": "Só os FJ que não estão no composto intrapulmonar."},
    {"nome": "veia_pulmonar_inferior_direita", "pai": "vasos", "papel": "malha",
     "en": "right inferior pulmonary vein (extrapulmonary FJ only)",
     "fma": "FMA49911", "bp": "BP9407", "material": "vaso", "fj_menos": "FMA68003"},
    {"nome": "veia_pulmonar_superior_esquerda", "pai": "vasos", "papel": "malha",
     "en": "left superior pulmonary vein (extrapulmonary FJ only)",
     "fma": "FMA49916", "bp": "BP9499", "material": "vaso", "fj_menos": "FMA68004"},
    {"nome": "veia_pulmonar_inferior_esquerda", "pai": "vasos", "papel": "malha",
     "en": "left inferior pulmonary vein (extrapulmonary FJ only)",
     "fma": "FMA49913", "bp": "BP9712", "material": "vaso", "fj_menos": "FMA68005"},

    {"nome": "coronarias", "pai": "coracao_WIP", "papel": "grupo",
     "en": "coronary arteries and cardiac veins",
     "nota": "Malhas do mesmo corpo; se correm NA superfície é coincidência do voxel, não modelagem de sulco. Verificar interseção com o miocárdio."},
    {"nome": "tronco_coronaria_esquerda", "pai": "coronarias", "papel": "malha",
     "en": "trunk of left coronary artery", "fma": "FMA3855", "bp": "BP10074",
     "material": "coronaria"},
    {"nome": "tronco_descendente_anterior", "pai": "coronarias", "papel": "malha",
     "en": "trunk of anterior interventricular branch of left coronary artery",
     "fma": "FMA74912", "bp": "BP10078", "material": "coronaria"},
    {"nome": "tronco_coronaria_direita", "pai": "coronarias", "papel": "malha",
     "en": "trunk of right coronary artery", "fma": "FMA3802", "bp": "BP9674",
     "material": "coronaria"},
    {"nome": "seio_coronario", "pai": "coronarias", "papel": "malha",
     "en": "coronary sinus", "fma": "FMA4706", "bp": "BP10136",
     "material": "vaso_venoso"},
    {"nome": "ramos_coronarios_nao_nomeados_um_a_um", "pai": "coronarias", "papel": "malha",
     "en": "remaining heart ELEMENT files of the coronary/cardiac-vein trees",
     "fma": "FMA50040", "fma_extra": ["FMA50039", "FMA50308"],
     "material": "coronaria",
     "nota": "Exportados como filhos FJ#### com o menor nome PART-OF disponível — sem batizar ramo que o catálogo não batiza."},

    {"nome": "conducao", "pai": "coracao_WIP", "papel": "grupo",
     "en": "conducting system of heart", "ta2": "3952"},
    {"nome": "no_sinusal", "pai": "conducao", "papel": "ausente",
     "en": "sinu-atrial node", "ta2": "3953"},
    {"nome": "no_atrioventricular", "pai": "conducao", "papel": "ausente",
     "en": "atrioventricular node", "ta2": "3954"},
    {"nome": "feixe_de_his", "pai": "conducao", "papel": "ausente",
     "en": "atrioventricular bundle", "ta2": "3955"},
    {"nome": "ramos_de_his", "pai": "conducao", "papel": "ausente",
     "en": "bundle branches", "ta2": "3956"},
    {"nome": "purkinje", "pai": "conducao", "papel": "ausente",
     "en": "subendocardial branches", "ta2": "3961"},

    {"nome": "cordas_tendineas_mitral", "pai": "valva_mitral", "papel": "ausente",
     "en": "chordae tendineae of left atrioventricular valve", "ta2": "4069"},
    {"nome": "cordas_tendineas_tricuspide", "pai": "valva_tricuspide", "papel": "ausente",
     "en": "chordae tendineae of right atrioventricular valve", "ta2": "4047"},
]


def por_nome():
    return {p["nome"]: p for p in PECAS}
