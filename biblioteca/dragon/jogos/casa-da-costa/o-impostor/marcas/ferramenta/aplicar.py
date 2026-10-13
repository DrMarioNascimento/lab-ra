import io, math, numpy as np, trimesh
from PIL import Image, ImageOps, ImageDraw
from glbtool import G, ARRAY, ELEMENT
from pygltflib import TextureInfo, NormalMaterialTexture, OcclusionTextureInfo, Material, PbrMetallicRoughness
RA='/mnt/user-data/outputs/RA/'
def png(img):
    b=io.BytesIO(); img.save(b,'PNG',optimize=True); return b.getvalue()
def jpg(img,q=88):
    b=io.BytesIO(); img.convert('RGB').save(b,'JPEG',quality=q); return b.getvalue()
SELO=Image.open('oficial/carimbo_tinta.png')
def carimbar(img, cx, cy, diam, ang, op=0.9):
    s=SELO.resize((diam,diam),Image.LANCZOS).rotate(ang,resample=Image.BICUBIC,expand=True)
    a=np.array(s).astype(float); a[...,3]*=op
    s=Image.fromarray(np.uint8(a))
    base=img.convert('RGBA'); lay=Image.new('RGBA',base.size,(0,0,0,0))
    lay.paste(s,(int(cx-s.size[0]/2),int(cy-s.size[1]/2)),s)
    # tinta: multiplica sobre o papel
    b=np.array(base).astype(float); l=np.array(lay).astype(float); al=l[...,3:]/255
    mult=b[...,:3]*l[...,:3]/255
    b[...,:3]=b[...,:3]*(1-al)+mult*al
    return Image.fromarray(np.uint8(b)).convert('RGB')
def tem(g,nome): return any(n.name==nome for n in g.g.nodes)
def placa_node(g, nome, centro, normal, cima, larg, alt, img, parent, rough=0.35, metal=0.85):
    n=np.array(normal,float); n/=np.linalg.norm(n); u=np.array(cima,float); u-=n*u.dot(n); u/=np.linalg.norm(u)
    r=np.cross(u,n)   # direita de quem olha de frente
    c=np.array(centro,float)
    p=[c-r*larg/2+u*alt/2, c+r*larg/2+u*alt/2, c-r*larg/2-u*alt/2, c+r*larg/2-u*alt/2]
    pos=np.array(p); nrm=np.array([n]*4); uv=np.array([[0,0],[1,0],[0,1],[1,1]],float)
    idx=np.array([0,2,1,2,3,1])
    f=np.cross(pos[2]-pos[0],pos[1]-pos[0])
    if f.dot(n)<0: idx=np.array([0,1,2,2,1,3])
    cor,nor,orm=img
    tc=g.add_texture_png(png(cor)); tn=g.add_texture_png(png(nor)); to=g.add_texture_png(png(orm))
    g.g.materials.append(Material(name=nome, alphaMode='MASK', alphaCutoff=0.5, doubleSided=False,
        pbrMetallicRoughness=PbrMetallicRoughness(baseColorTexture=TextureInfo(index=tc), metallicRoughnessTexture=TextureInfo(index=to), metallicFactor=1.0, roughnessFactor=1.0),
        normalTexture=NormalMaterialTexture(index=tn), occlusionTexture=OcclusionTextureInfo(index=to)))
    m=len(g.g.materials)-1
    return g.add_mesh_node(nome,pos,nrm,uv,idx,m,parent)
def mundo_para_local(sc, no, pts):
    T=sc.graph.get(no)[0]; Ti=np.linalg.inv(T)
    return [ (Ti@np.r_[p,1])[:3] for p in pts ]
def dir_local(sc,no,v):
    T=sc.graph.get(no)[0]; return np.linalg.inv(T[:3,:3])@np.array(v,float)

def trio(n,w,h): return tuple(Image.open(f'out/{n}_{k}.png').resize((w,h),Image.LANCZOS) for k in ('cor','normal','orm'))
PLACA_FAROL=trio('placa_farol',1024,576); PLACA_ARQ=trio('plaqueta_arquivo',768,288)

# ---------- FAROL: placa de aço ao lado da porta ----------
f=RA+'farol_v2.glb'; g=G(f); sc=trimesh.load(f)
if not tem(g,'placa_farol'):
    mesh=None
    for name in sc.graph.nodes_geometry:
        if name=='torre_faixa_1':
            T,geom=sc.graph[name]; mesh=sc.geometry[geom].copy(); mesh.apply_transform(T)
    th=math.radians(32); y=2.75
    d=np.array([-math.sin(th),0,-math.cos(th)]); o=np.array([math.sin(th)*6,y,math.cos(th)*6])
    loc,_,tri=mesh.ray.intersects_location([o],[d])
    k=np.argmin(np.linalg.norm(loc-o,axis=1)); p=loc[k]; nrm=mesh.face_normals[tri[k]]; nrm=np.array([nrm[0],0,nrm[2]]); nrm/=np.linalg.norm(nrm)
    centro=p+nrm*0.06
    root=[i for i,n in enumerate(g.g.nodes) if n.name==g.g.nodes[g.g.scenes[0].nodes[0]].name][0]
    rootname=g.g.nodes[root].name
    c=mundo_para_local(sc,rootname,[centro])[0]; nl=dir_local(sc,rootname,nrm); ul=dir_local(sc,rootname,[0,1,0])
    placa_node(g,'placa_farol',c,nl,ul,1.0,0.625,PLACA_FAROL,root)
    g.save(f); print('farol ok',p.round(2),nrm.round(2))

# ---------- RELÓGIO: plaqueta de latão na lateral da base ----------
f=RA+'relogio_caixa_alta_v2.glb'; g=G(f); sc=trimesh.load(f)
if not tem(g,'placa_arquivo_relogio'):
    base_i=g.node('base')
    c=mundo_para_local(sc,'base',[[0.2765,0.19,0.0]])[0]
    placa_node(g,'placa_arquivo_relogio',c,dir_local(sc,'base',[1,0,0]),dir_local(sc,'base',[0,1,0]),0.09,0.036,PLACA_ARQ,base_i)
    g.save(f); print('relogio ok')

# ---------- LIVRO: carimbo na página esquerda ----------
f=RA+'livro_do_farol_v2.glb'; g=G(f)
if not getattr(g.g,'extras',None) or not g.g.extras.get('carimbo_dragon'):
    im=ImageOps.flip(Image.open(io.BytesIO(g.chunks[g.g.images[2].bufferView])).convert('RGB'))
    im=carimbar(im, 760, 1190, 250, 11, 0.85)
    g.replace_image(2, png(ImageOps.flip(im)))
    g.g.extras={'carimbo_dragon':True}
    im.resize((512,707)).save('prev_livro_pag.png')
    g.save(f); print('livro ok')

# ---------- QUARTO: carimbo na planta + plaqueta na mesa ----------
f=RA+'quarto_de_servico_v2.glb'; g=G(f); sc=trimesh.load(f)
if not tem(g,'placa_arquivo_quarto'):
    im=ImageOps.flip(Image.open(io.BytesIO(g.chunks[g.g.images[12].bufferView])).convert('RGB'))
    W,H=im.size
    im=carimbar(im, int(W*0.875), int(H*0.83), int(W*0.17), -9, 0.85)
    g.replace_image(12, png(ImageOps.flip(im)))
    im.resize((800,int(800*H/W))).save('prev_planta.png')
    root=g.g.scenes[0].nodes[0]
    placa_node(g,'placa_arquivo_quarto',[1.2,0.7525,-0.985],[0,1,0],[0,0,-1],0.10,0.04,PLACA_ARQ,root)
    g.save(f); print('quarto ok')
