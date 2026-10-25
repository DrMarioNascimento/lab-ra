import os
os.environ['PYOPENGL_PLATFORM']='egl'
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'tools'))
from bake import GLB,ROOT
from pathlib import Path
import numpy as np, trimesh,pyrender
from PIL import Image
from scipy.spatial.transform import Rotation

def render(path,out):
 glb=GLB(path);g=glb.g;s=trimesh.load(path,force='scene',process=False);center=s.bounds.mean(0);scale=2/np.ptp(s.bounds,axis=0).max();normalize=np.eye(4);normalize[:3,:3]*=scale;normalize[:3,3]=-center*scale
 scene=pyrender.Scene(bg_color=[.025,.055,.09,1],ambient_light=[.25,.25,.25]);materials={};meshes={}
 for i,m in enumerate(g['materials']):
  p=m.get('pbrMetallicRoughness',{});args=dict(baseColorFactor=np.array(p.get('baseColorFactor',[1,1,1,1]),dtype=float),metallicFactor=p.get('metallicFactor',1),roughnessFactor=p.get('roughnessFactor',1),doubleSided=m.get('doubleSided',False),alphaMode=m.get('alphaMode','OPAQUE'))
  for key,info in [('baseColorTexture',p.get('baseColorTexture')),('metallicRoughnessTexture',p.get('metallicRoughnessTexture')),('normalTexture',m.get('normalTexture'))]:
   if info:args[key]=pyrender.Texture(source=np.rint(glb.image(info)*255).astype(np.uint8),source_channels='RGB')
  materials[i]=pyrender.MetallicRoughnessMaterial(**args)
 for i,m in enumerate(g['meshes']):
  prims=[]
  for p in m['primitives']:
   a=p['attributes'];uv=glb.arr(a['TEXCOORD_0']) if 'TEXCOORD_0' in a else None
   if uv is not None:uv[:,1]=1-uv[:,1]
   colors=glb.arr(a['COLOR_0']) if 'COLOR_0' in a else None
   prim=pyrender.Primitive(positions=glb.arr(a['POSITION']),normals=glb.arr(a['NORMAL']) if 'NORMAL' in a else None,texcoord_0=uv,indices=glb.arr(p['indices']).flatten(),material=materials[p['material']])
   if colors is not None:
    if colors.shape[1]==3:colors=np.column_stack([colors,np.ones(len(colors))])
    prim._color_0=np.ascontiguousarray(colors.astype(np.float32))
   prims.append(prim)
  meshes[i]=pyrender.Mesh(prims)
 def node(i,parent):
  n=g['nodes'][i];local=np.eye(4)
  if 'matrix' in n:local=np.array(n['matrix']).reshape(4,4).T
  else:local[:3,:3]=Rotation.from_quat(n.get('rotation',[0,0,0,1])).as_matrix()@np.diag(n.get('scale',[1,1,1]));local[:3,3]=n.get('translation',[0,0,0])
  world=parent@local
  if 'mesh' in n:scene.add(meshes[n['mesh']],pose=normalize@world)
  for c in n.get('children',[]):node(c,world)
 for n in g['scenes'][g.get('scene',0)]['nodes']:node(n,np.eye(4))
 def pose(position):
  position=np.array(position,float);z=position/np.linalg.norm(position);x=np.cross([0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x);result=np.eye(4);result[:3,:3]=np.column_stack([x,y,z]);result[:3,3]=position;return result
 view=np.array([.25,.20,3.5]);view=view/np.linalg.norm(view)*3.5
 scene.add(pyrender.PerspectiveCamera(yfov=np.deg2rad(38),znear=.01,zfar=100),pose=pose(view))
 for power,pos in [(2.5,[3,4,4]),(1.,[-3,1,2]),(1.5,[1,2,-3])]:scene.add(pyrender.DirectionalLight(color=[1.,1.,1.],intensity=power),pose=pose(pos))
 r=pyrender.OffscreenRenderer(1400,1000);color,depth=r.render(scene,flags=pyrender.RenderFlags.RGBA);Image.fromarray(color).save(out);r.delete();print('rendered',out,flush=True)

import sys
render(Path(sys.argv[1]),Path(sys.argv[2]))
