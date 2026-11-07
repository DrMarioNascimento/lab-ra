"""Atualiza duas araucárias e o centro dos fantasmas no USDZ pronto.
Preserva trilhos, bonde, personagens e sequências de ações.
Uso: python inserir-araucarias-usdz.py /tmp/araucarias [arquivo.usdz]
Depende da saída de araucarias-usdz.mjs e de usd-core.
"""
from pathlib import Path
import sys, json, zipfile, tempfile, struct
from pxr import Usd, UsdGeom, UsdShade, Sdf, Gf

pasta = Path(sys.argv[1])
arquivo = Path(sys.argv[2]) if len(sys.argv)>2 else Path(__file__).parents[1]/'ar/maquete.usdz'
arvores = json.loads((pasta/'araucarias.json').read_text())
with zipfile.ZipFile(arquivo) as src:
    originais = {i.filename: src.read(i) for i in src.infolist()}
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    for nome, dados in originais.items():
        destino = tmp/nome
        destino.parent.mkdir(parents=True,exist_ok=True)
        destino.write_bytes(dados)
    stage = Usd.Stage.Open(str(tmp/'model.usda'))
    maquete = stage.GetPrimAtPath('/Root/Scenes/Scene/Maquete_RA/Maquete')
    fantasmas = [p for p in maquete.GetChildren() if p.GetName().startswith('Fantasmas')]
    assert sorted(len(p.GetChildren()) for p in fantasmas) == [1,3], 'Grupos de fantasmas inesperados'
    for p in fantasmas:
        centro = (4,.27,30) if len(p.GetChildren()) == 1 else (-8,.27,14)
        ops = UsdGeom.Xformable(p).GetOrderedXformOps()
        assert len(ops) == 1 and ops[0].GetOpType() == UsdGeom.XformOp.TypeTransform
        ops[0].Set(Gf.Matrix4d(1).SetTranslate(Gf.Vec3d(*centro)))
    # As ações do Quick Look usam destinos absolutos, irmãos da maquete.
    # Corrigir só o pai faria o primeiro passo da animação voltar ao centro.
    cache = UsdGeom.XformCache()
    cena = maquete.GetParent().GetParent()
    invCena = cache.GetLocalToWorldTransform(cena).GetInverse()
    for grupo in fantasmas:
        for fantasma in grupo.GetChildren():
            indice = fantasma.GetName().removeprefix('rqbMovel_')
            destinos = [p for p in cena.GetChildren() if p.GetName().startswith('rqbAlvo_') and p.GetName().endswith('_'+indice)]
            inicial = cena.GetChild('rqbAlvo_0_0_'+indice)
            assert inicial and len(destinos)>3, 'Percurso do fantasma ausente'
            esperado = (cache.GetLocalToWorldTransform(fantasma)*invCena).ExtractTranslation()
            atual = UsdGeom.Xformable(inicial).GetLocalTransformation().ExtractTranslation()
            delta = esperado-atual
            for alvo in destinos:
                op = UsdGeom.Xformable(alvo).GetOrderedXformOps()[0]
                matriz = op.Get(); matriz.SetTranslateOnly(matriz.ExtractTranslation()+delta); op.Set(matriz)
    raiz = '/Root/Scenes/Scene/Maquete_RA/Maquete/Araucarias'
    # Idempotente: refazer nunca acumula árvores.
    stage.RemovePrim(raiz)
    UsdGeom.Xform.Define(stage,raiz)
    for arv in arvores:
        matpath = '/Materials/Araucarias_RA'
        mat = UsdShade.Material.Define(stage,matpath)
        shader = UsdShade.Shader.Define(stage,matpath+'/Surface')
        shader.CreateIdAttr('UsdPreviewSurface')
        shader.CreateInput('roughness',Sdf.ValueTypeNames.Float).Set(arv['roughness'])
        shader.CreateInput('metallic',Sdf.ValueTypeNames.Float).Set(0)
        mat.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(),'surface')
        tex = UsdShade.Shader.Define(stage,matpath+'/Texture')
        tex.CreateIdAttr('UsdUVTexture')
        tex.CreateInput('file',Sdf.ValueTypeNames.Asset).Set(Sdf.AssetPath('textures/'+arv['textura']))
        tex.CreateInput('sourceColorSpace',Sdf.ValueTypeNames.Token).Set('sRGB')
        tex.CreateInput('scale',Sdf.ValueTypeNames.Float4).Set(Gf.Vec4f(*arv['cor'],1))
        for eixo in ['S','T']:
            tex.CreateInput('wrap'+eixo,Sdf.ValueTypeNames.Token).Set('repeat')
        tex.CreateOutput('rgb',Sdf.ValueTypeNames.Float3)
        reader = UsdShade.Shader.Define(stage,matpath+'/UV')
        reader.CreateIdAttr('UsdPrimvarReader_float2')
        reader.CreateInput('varname',Sdf.ValueTypeNames.String).Set('st')
        reader.CreateOutput('result',Sdf.ValueTypeNames.Float2)
        tex.CreateInput('st',Sdf.ValueTypeNames.Float2).ConnectToSource(reader.ConnectableAPI(),'result')
        shader.CreateInput('diffuseColor',Sdf.ValueTypeNames.Color3f).ConnectToSource(tex.ConnectableAPI(),'rgb')
        mesh = UsdGeom.Mesh.Define(stage,raiz+'/'+arv['nome'])
        mesh.CreatePointsAttr(arv['pontos'])
        mesh.CreateFaceVertexCountsAttr([3]*(len(arv['indices'])//3))
        mesh.CreateFaceVertexIndicesAttr(arv['indices'])
        mesh.CreateNormalsAttr(arv['normais']); mesh.SetNormalsInterpolation('vertex')
        mesh.CreateSubdivisionSchemeAttr('none')
        mesh.CreateExtentAttr(UsdGeom.Mesh.ComputeExtent(mesh.GetPointsAttr().Get()))
        st = UsdGeom.PrimvarsAPI(mesh).CreatePrimvar('st',Sdf.ValueTypeNames.TexCoord2fArray,'vertex')
        st.Set([(u,1-v) for u,v in arv['uv']])
        UsdShade.MaterialBindingAPI.Apply(mesh.GetPrim()).Bind(mat)
        originais['textures/'+arv['textura']] = (pasta/arv['textura']).read_bytes()
    originais['model.usda'] = stage.GetRootLayer().ExportToString().encode()

with zipfile.ZipFile(arquivo,'w',compression=zipfile.ZIP_STORED) as dst:
    for nome,dados in originais.items():
        item=zipfile.ZipInfo(nome)
        base=dst.fp.tell()+30+len(nome.encode())
        if base%64:
            pad=(64-(base+4)%64)%64
            item.extra=struct.pack('<HH',12345,pad)+b'\0'*pad
        dst.writestr(item,dados)
print(f'USDZ atualizado com {len(arvores)} araucárias: {arquivo.stat().st_size} bytes')
