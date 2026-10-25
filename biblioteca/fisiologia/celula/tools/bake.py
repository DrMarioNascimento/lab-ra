import json,struct,io,copy,math
from pathlib import Path
import numpy as np
from PIL import Image
import xatlas
from numba import njit
from scipy.ndimage import distance_transform_edt
ROOT=Path(__file__).parent
class GLB:
 def __init__(self,path):
  b=Path(path).read_bytes();l=struct.unpack_from('<I',b,12)[0];self.g=json.loads(b[20:20+l]);self.bin=bytearray(b[28+l:])
 def arr(self,i):
  a=self.g['accessors'][i];v=self.g['bufferViews'][a['bufferView']];dtype=np.dtype({5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1',5122:'<i2',5120:'i1'}[a['componentType']]);n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
  ar=np.ndarray((a['count'],n),dtype,self.bin,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dtype.itemsize*n),dtype.itemsize)).copy()
  if a.get('normalized'):ar=ar.astype(np.float32)/np.iinfo(dtype).max
  return ar
 def view(self,data):
  while len(self.bin)%4:self.bin.append(0)
  v={'buffer':0,'byteOffset':len(self.bin),'byteLength':len(data)};self.bin.extend(data);self.g['bufferViews'].append(v);return len(self.g['bufferViews'])-1
 def accessor(self,a,indices=False):
  a=np.asarray(a);a=a.reshape(-1,1) if a.ndim==1 else a
  typ=5123 if indices and a.max()<65536 else 5125 if indices else 5126
  a=a.astype({5123:'<u2',5125:'<u4',5126:'<f4'}[typ]);acc={'bufferView':self.view(a.tobytes()),'componentType':typ,'count':len(a),'type':{1:'SCALAR',2:'VEC2',3:'VEC3',4:'VEC4'}[a.shape[1]],'min':a.min(0).tolist(),'max':a.max(0).tolist()};self.g['accessors'].append(acc);return len(self.g['accessors'])-1
 def image(self,info):
  i=self.g['images'][self.g['textures'][info['index']]['source']];v=self.g['bufferViews'][i['bufferView']];return np.array(Image.open(io.BytesIO(self.bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB'),dtype=np.float32)/255
 def texture(self,a,name):
  mem=io.BytesIO();Image.fromarray(a).save(mem,format='PNG',optimize=True);images=self.g.setdefault('images',[]);images.append({'name':name,'mimeType':'image/png','bufferView':self.view(mem.getvalue())});textures=self.g.setdefault('textures',[]);samplers=self.g.setdefault('samplers',[])
  if not hasattr(self,'sampler'):samplers.append({'magFilter':9729,'minFilter':9987,'wrapS':33071,'wrapT':33071});self.sampler=len(samplers)-1
  textures.append({'source':len(images)-1,'sampler':self.sampler});return {'index':len(textures)-1}
 def write(self,path):
  # Compact unreachable accessors and buffer data left by replacement meshes.
  g=self.g;used=set()
  for m in g['meshes']:
   for p in m['primitives']:used.update(p['attributes'].values());used.add(p['indices'])
  for a in g.get('animations',[]):
   for s in a['samplers']:used.update([s['input'],s['output']])
  amap={old:i for i,old in enumerate(sorted(used))};g['accessors']=[g['accessors'][i] for i in sorted(used)]
  for m in g['meshes']:
   for p in m['primitives']:p['attributes']={k:amap[v] for k,v in p['attributes'].items()};p['indices']=amap[p['indices']]
  for a in g.get('animations',[]):
   for s in a['samplers']:s['input']=amap[s['input']];s['output']=amap[s['output']]
  usedv=set(a['bufferView'] for a in g['accessors'])|set(i['bufferView'] for i in g.get('images',[]));newbin=bytearray();views=[];vmap={}
  for old in sorted(usedv):
   v=copy.deepcopy(g['bufferViews'][old]);start=v.get('byteOffset',0);chunk=self.bin[start:start+v['byteLength']]
   while len(newbin)%4:newbin.append(0)
   v['byteOffset']=len(newbin);newbin.extend(chunk);vmap[old]=len(views);views.append(v)
  for a in g['accessors']:a['bufferView']=vmap[a['bufferView']]
  for i in g.get('images',[]):i['bufferView']=vmap[i['bufferView']]
  g['bufferViews']=views;g['buffers']=[{'byteLength':len(newbin)}]
  js=json.dumps(g,separators=(',',':')).encode();js+=b' '*((-len(js))%4);newbin+=b'\0'*((-len(newbin))%4)
  out=struct.pack('<III',0x46546c67,2,28+len(js)+len(newbin))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(newbin),0x004e4942)+newbin;Path(path).write_bytes(out)
@njit
def sample(im,u,v):
 h,w,_=im.shape;x=(u%1)*w-.5;y=(v%1)*h-.5;x0=int(math.floor(x));y0=int(math.floor(y));fx=x-x0;fy=y-y0
 return im[y0%h,x0%w]*(1-fx)*(1-fy)+im[y0%h,(x0+1)%w]*fx*(1-fy)+im[(y0+1)%h,x0%w]*(1-fx)*fy+im[(y0+1)%h,(x0+1)%w]*fx*fy
@njit
def basis(p,uv,n):
 e1=p[1]-p[0];e2=p[2]-p[0];d1=uv[1]-uv[0];d2=uv[2]-uv[0];det=d1[0]*d2[1]-d1[1]*d2[0]
 if abs(det)<1e-12:return np.zeros(3),np.zeros(3)
 t=(e1*d2[1]-e2*d1[1])/det;t=t-n*np.dot(n,t);t/=max(np.linalg.norm(t),1e-12);b=np.cross(n,t);rawb=(e2*d1[0]-e1*d2[0])/det
 if np.dot(b,rawb)<0:b=-b
 return t,b
@njit
def raster(pos,norm,uv,oldUv,col,faces,res,normalIm,normalScale,roughIm,roughFactor,metalFactor):
 colors=np.zeros((res,res,3),np.float32);normals=np.zeros_like(colors);mr=np.zeros_like(colors);mask=np.zeros((res,res),np.uint8)
 for face in faces:
  p=pos[face];tuv=uv[face];ouv=oldUv[face];xy=tuv*(res-1);a,b,c=xy;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
  if abs(den)<1e-10:continue
  minx=max(0,int(math.floor(xy[:,0].min())));maxx=min(res-1,int(math.ceil(xy[:,0].max())));miny=max(0,int(math.floor(xy[:,1].min())));maxy=min(res-1,int(math.ceil(xy[:,1].max())))
  for y in range(miny,maxy+1):
   for x in range(minx,maxx+1):
    w0=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den;w1=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;w2=1-w0-w1
    if min(w0,w1,w2)<-.005:continue
    colors[y,x]=col[face[0],:3]*w0+col[face[1],:3]*w1+col[face[2],:3]*w2
    old=ouv[0]*w0+ouv[1]*w1+ouv[2]*w2;n=norm[face[0]]*w0+norm[face[1]]*w1+norm[face[2]]*w2;n/=max(np.linalg.norm(n),1e-12)
    ot,ob=basis(p,ouv,n);nt,nb=basis(p,tuv,n);sn=sample(normalIm,old[0],old[1])*2-1;sn[0]*=normalScale;sn[1]*=normalScale
    obj=ot*sn[0]+ob*sn[1]+n*sn[2];obj/=max(np.linalg.norm(obj),1e-12)
    normals[y,x,0]=(np.dot(obj,nt)+1)/2;normals[y,x,1]=(np.dot(obj,nb)+1)/2;normals[y,x,2]=(np.dot(obj,n)+1)/2
    rough=sample(roughIm,old[0],old[1]);mr[y,x,0]=1;mr[y,x,1]=rough[1]*roughFactor;mr[y,x,2]=rough[2]*metalFactor;mask[y,x]=1
 return colors,normals,mr,mask

def bake():
 glb=GLB(ROOT/'simplified.glb');g=glb.g;stats=[]
 for mi,m in enumerate(g['meshes']):
  for p in m['primitives']:
   attrs=p['attributes'];mat=copy.deepcopy(g['materials'][p['material']]);mat.pop('extensions',None)
   if 'COLOR_0' not in attrs:continue
   colors=glb.arr(attrs['COLOR_0']);factor=np.array(mat.get('pbrMetallicRoughness',{}).get('baseColorFactor',[1,1,1,1]))
   g['materials'].append(mat);p['material']=len(g['materials'])-1
   if np.max(np.ptp(colors[:,:3],axis=0))<1e-5:
    mat.setdefault('pbrMetallicRoughness',{})['baseColorFactor']=[*np.clip(colors[0,:3]*factor[:3],0,1).tolist(),float(factor[3])];del attrs['COLOR_0'];continue
   pos=glb.arr(attrs['POSITION']).astype(np.float32);norm=glb.arr(attrs['NORMAL']).astype(np.float32);oldUv=glb.arr(attrs.get('TEXCOORD_0')).astype(np.float32) if 'TEXCOORD_0' in attrs else np.zeros((len(pos),2),np.float32);faces=glb.arr(p['indices']).reshape(-1,3).astype(np.uint32)
   res=1024 if len(faces)>18000 else 512 if len(faces)>1000 else 256
   atlas=xatlas.Atlas();atlas.add_mesh(pos,faces,normals=norm);pack=xatlas.PackOptions();pack.resolution=res;pack.padding=4;chart=xatlas.ChartOptions();chart.max_iterations=2;atlas.generate(chart,pack);mapping,faces,uv=atlas[0];pos=pos[mapping];norm=norm[mapping];oldUv=oldUv[mapping];colors=colors[mapping,:3]*factor[:3]
   pbr=mat.setdefault('pbrMetallicRoughness',{});normalIm=glb.image(mat['normalTexture']) if 'normalTexture' in mat else np.array([[[.5,.5,1]]],np.float32);roughIm=glb.image(pbr['metallicRoughnessTexture']) if 'metallicRoughnessTexture' in pbr else np.ones((1,1,3),np.float32)
   color,normal,mr,mask=raster(pos.astype(np.float64),norm.astype(np.float64),uv.astype(np.float64),oldUv.astype(np.float64),colors.astype(np.float64),faces,res,normalIm.astype(np.float64),mat.get('normalTexture',{}).get('scale',1),roughIm.astype(np.float64),pbr.get('roughnessFactor',1),pbr.get('metallicFactor',1))
   if not mask.any():raise ValueError('Empty baked atlas')
   nearest=distance_transform_edt(~mask.astype(bool),return_distances=False,return_indices=True)
   color=color[tuple(nearest)];normal=normal[tuple(nearest)];mr=mr[tuple(nearest)]
   color=np.clip(color,0,1);color=np.where(color<=.0031308,color*12.92,1.055*color**(1/2.4)-.055)
   to8=lambda a:np.rint(np.clip(a,0,1)*255).astype(np.uint8)
   pbr['baseColorFactor']=[1,1,1,float(factor[3])];pbr['baseColorTexture']=glb.texture(to8(color),f'color_{mi}');pbr['metallicRoughnessTexture']=glb.texture(to8(mr),f'roughness_{mi}');pbr['metallicFactor']=pbr['roughnessFactor']=1
   if 'normalTexture' in mat:mat['normalTexture']=glb.texture(to8(normal),f'normal_{mi}')
   p['attributes']={k:glb.accessor(a) for k,a in [('POSITION',pos),('NORMAL',norm),('TEXCOORD_0',uv)]};p['indices']=glb.accessor(faces.reshape(-1),True)
   stats.append((mi,len(faces),res));print('baked',mi,len(faces),res,flush=True)
 for mat in g['materials']:mat.pop('extensions',None)
 g.pop('extensionsUsed',None);g.pop('extensionsRequired',None)
 glb.write(ROOT/'celula-mobile-v2.glb');print('DONE',stats,flush=True)
if __name__=='__main__':bake()
