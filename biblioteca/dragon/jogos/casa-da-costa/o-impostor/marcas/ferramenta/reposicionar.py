"""Etiquetas discretas, como um fabricante poria no móvel (Mario, 26/09/2026)."""
import numpy as np, trimesh
from glbtool import G
RA='/mnt/user-data/outputs/RA/'
def quad(centro, n, cima, larg, alt):
    n=np.array(n,float); n/=np.linalg.norm(n); u=np.array(cima,float); u-=n*u.dot(n); u/=np.linalg.norm(u); r=np.cross(u,n); c=np.array(centro,float)
    return np.array([c-r*larg/2+u*alt/2, c+r*larg/2+u*alt/2, c-r*larg/2-u*alt/2, c+r*larg/2-u*alt/2],np.float32), np.array([n]*4,np.float32)
def mover(arq, nome, pai, centro_mundo, n_mundo, cima_mundo, larg, alt):
    g=G(arq); sc=trimesh.load(arq)
    T=sc.graph.get(pai)[0]; Ti=np.linalg.inv(T); R=np.linalg.inv(T[:3,:3])
    c=(Ti@np.r_[centro_mundo,1])[:3]; n=R@np.array(n_mundo,float); u=R@np.array(cima_mundo,float)
    pos,nrm=quad(c,n,u,larg,alt)
    i=g.node(nome); p=g.g.meshes[g.g.nodes[i].mesh].primitives[0]
    for acc,arr in ((p.attributes.POSITION,pos),(p.attributes.NORMAL,nrm)):
        a=g.g.accessors[acc]; g.chunks[a.bufferView]=arr.tobytes()
        if acc==p.attributes.POSITION: a.min=[float(x) for x in arr.min(0)]; a.max=[float(x) for x in arr.max(0)]
    # a orientação dos triângulos acompanha a nova normal
    idx=g.g.accessors[p.indices]; I=np.frombuffer(g.chunks[idx.bufferView],np.uint32).reshape(-1,3).copy()
    f=np.cross(pos[I[0,1]]-pos[I[0,0]],pos[I[0,2]]-pos[I[0,0]])
    if f.dot(nrm[0])<0: I=I[:,[0,2,1]]
    g.chunks[idx.bufferView]=I.astype(np.uint32).tobytes()
    g.save(arq); print(nome,'->',np.round(centro_mundo,3))
# relógio: plaqueta pequena (6 x 2,25 cm) na lateral direita da base, canto baixo de trás
mover(RA+'relogio_caixa_alta_v2.glb','placa_arquivo_relogio','base',[0.2765,0.125,-0.085],[1,0,0],[0,1,0],0.06,0.0225)
# quarto: plaqueta do fabricante na travessa da frente da mesa, junto ao pé direito (não em cima)
mover(RA+'quarto_de_servico_v2.glb','placa_arquivo_quarto','quarto_de_servico',[1.285,0.68,-0.8493],[0,0,1],[0,1,0],0.06,0.0225)
