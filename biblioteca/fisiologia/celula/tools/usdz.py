from glb_data import GLB
from pathlib import Path
ROOT=Path(__file__).parent
from pxr import Usd,UsdGeom,UsdShade,UsdSkel,UsdUtils,Sdf,Gf,Vt
import numpy as np
from PIL import Image
from pathlib import Path
import json,struct,zipfile,re

def convert(source=None,destination=None):
 glb=GLB(source or ROOT/'celula-mobile-v2.glb');g=glb.g;out=ROOT/('usd-'+Path(destination).stem if destination else 'usd-final');out.mkdir(exist_ok=True);(out/'textures').mkdir(exist_ok=True)
 stage=Usd.Stage.CreateNew(str(out/'celula.usdc'));root=UsdSkel.Root.Define(stage,'/Cell');stage.SetDefaultPrim(root.GetPrim());UsdGeom.SetStageUpAxis(stage,UsdGeom.Tokens.y);UsdGeom.SetStageMetersPerUnit(stage,1);stage.SetTimeCodesPerSecond(24);stage.SetFramesPerSecond(24)
 imgs={}
 for i,img in enumerate(g.get('images',[])):
  v=g['bufferViews'][img['bufferView']];b=glb.bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];name=f'textures/texture_{i}.'+('jpg' if img.get('mimeType')=='image/jpeg' else 'png');(out/name).write_bytes(b);imgs[i]=name
 mats={}
 used={p['material'] for m in g['meshes'] for p in m['primitives']}
 for i in sorted(used):
  m=g['materials'][i];path=f'/Cell/Materials/M{i}';mat=UsdShade.Material.Define(stage,path);shader=UsdShade.Shader.Define(stage,path+'/Surface');shader.CreateIdAttr('UsdPreviewSurface');pbr=m.get('pbrMetallicRoughness',{});color=pbr.get('baseColorFactor',[1,1,1,1]);shader.CreateInput('diffuseColor',Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(*color[:3]));shader.CreateInput('roughness',Sdf.ValueTypeNames.Float).Set(pbr.get('roughnessFactor',1));shader.CreateInput('metallic',Sdf.ValueTypeNames.Float).Set(pbr.get('metallicFactor',1));shader.CreateInput('opacity',Sdf.ValueTypeNames.Float).Set(color[3] if m.get('alphaMode')=='BLEND' else 1)
  reader=UsdShade.Shader.Define(stage,path+'/UV');reader.CreateIdAttr('UsdPrimvarReader_float2');reader.CreateInput('varname',Sdf.ValueTypeNames.String).Set('st');reader.CreateOutput('result',Sdf.ValueTypeNames.Float2)
  def tex(info,name,space='raw',scale=(1,1,1,1),bias=(0,0,0,0)):
   t=UsdShade.Shader.Define(stage,path+'/'+name);t.CreateIdAttr('UsdUVTexture');t.CreateInput('file',Sdf.ValueTypeNames.Asset).Set(Sdf.AssetPath(imgs[g['textures'][info['index']]['source']]));t.CreateInput('sourceColorSpace',Sdf.ValueTypeNames.Token).Set(space);t.CreateInput('st',Sdf.ValueTypeNames.Float2).ConnectToSource(reader.ConnectableAPI(),'result');t.CreateInput('wrapS',Sdf.ValueTypeNames.Token).Set('repeat');t.CreateInput('wrapT',Sdf.ValueTypeNames.Token).Set('repeat');t.CreateInput('scale',Sdf.ValueTypeNames.Float4).Set(Gf.Vec4f(*scale));t.CreateInput('bias',Sdf.ValueTypeNames.Float4).Set(Gf.Vec4f(*bias));t.CreateOutput('rgb',Sdf.ValueTypeNames.Float3)
   for channel in ['r','g','b','a']:t.CreateOutput(channel,Sdf.ValueTypeNames.Float)
   return t
  if 'baseColorTexture' in pbr:shader.GetInput('diffuseColor').ConnectToSource(tex(pbr['baseColorTexture'],'Color','sRGB',tuple(color)).ConnectableAPI(),'rgb')
  if 'metallicRoughnessTexture' in pbr:
   t=tex(pbr['metallicRoughnessTexture'],'Roughness','raw',(1,pbr.get('roughnessFactor',1),pbr.get('metallicFactor',1),1));shader.GetInput('roughness').ConnectToSource(t.ConnectableAPI(),'g');shader.GetInput('metallic').ConnectToSource(t.ConnectableAPI(),'b')
  if 'normalTexture' in m:
   f=m['normalTexture'].get('scale',1);t=tex(m['normalTexture'],'Normal','raw',(2,2,2,1),(-1,-1,-1,0))
   if f!=1:
    nm=glb.image(m['normalTexture'])*2-1;nm[:,:,:2]*=f;nm/=np.maximum(np.linalg.norm(nm,axis=2,keepdims=True),1e-8);file=f'textures/normal_scaled_{i}.png';Image.fromarray(np.rint(np.clip((nm+1)/2,0,1)*255).astype(np.uint8)).save(out/file);t.GetInput('file').Set(Sdf.AssetPath(file))
   shader.CreateInput('normal',Sdf.ValueTypeNames.Normal3f).ConnectToSource(t.ConnectableAPI(),'rgb')
  shader.CreateOutput('surface',Sdf.ValueTypeNames.Token);mat.CreateSurfaceOutput().ConnectToSource(shader.ConnectableAPI(),'surface');mats[i]=mat
 nodePaths={};ops={};meshcount=0;meshes={}
 def node(i,parent):
  nonlocal meshcount
  n=g['nodes'][i];path=parent+'/N'+str(i)+'_'+re.sub(r'[^A-Za-z0-9_]','_',n.get('name','node'));x=UsdGeom.Xform.Define(stage,path);nodePaths[i]=path
  if 'matrix' in n:x.AddTransformOp().Set(Gf.Matrix4d(*np.array(n['matrix']).reshape(4,4).flatten().tolist()))
  else:
   tr=x.AddTranslateOp();rot=x.AddOrientOp();sc=x.AddScaleOp();tr.Set(Gf.Vec3d(*n.get('translation',[0,0,0])));q=n.get('rotation',[0,0,0,1]);rot.Set(Gf.Quatf(q[3],Gf.Vec3f(*q[:3])));sc.Set(Gf.Vec3f(*n.get('scale',[1,1,1])));ops[i]={'translation':tr,'rotation':rot,'scale':sc}
  if 'mesh' in n:
   for j,p in enumerate(g['meshes'][n['mesh']]['primitives']):
    meshcount+=1;mesh=UsdGeom.Mesh.Define(stage,path+'/Mesh'+str(j));a=p['attributes'];pos=glb.arr(a['POSITION']).astype(np.float32);faces=glb.arr(p['indices']).flatten().astype(np.int32) if 'indices' in p else np.arange(len(pos),dtype=np.int32);mesh.CreatePointsAttr(Vt.Vec3fArray.FromNumpy(pos));mesh.CreateFaceVertexCountsAttr(Vt.IntArray.FromNumpy(np.full(len(faces)//3,3,np.int32)));mesh.CreateFaceVertexIndicesAttr(Vt.IntArray.FromNumpy(faces));mesh.CreateSubdivisionSchemeAttr('none');mesh.CreateDoubleSidedAttr(g['materials'][p['material']].get('doubleSided',False));mesh.CreateExtentAttr([Gf.Vec3f(*pos.min(0).tolist()),Gf.Vec3f(*pos.max(0).tolist())])
    if 'NORMAL' in a:mesh.CreateNormalsAttr(Vt.Vec3fArray.FromNumpy(glb.arr(a['NORMAL']).astype(np.float32)));mesh.SetNormalsInterpolation('vertex')
    if 'TEXCOORD_0' in a:
     uv=glb.arr(a['TEXCOORD_0']).astype(np.float32);uv[:,1]=1-uv[:,1];UsdGeom.PrimvarsAPI(mesh).CreatePrimvar('st',Sdf.ValueTypeNames.TexCoord2fArray,'vertex').Set(Vt.Vec2fArray.FromNumpy(uv))
    UsdShade.MaterialBindingAPI.Apply(mesh.GetPrim()).Bind(mats[p['material']]);meshes.setdefault(i,[]).append((mesh,p))
  for child in n.get('children',[]):node(child,path)
 for n in g['scenes'][g.get('scene',0)]['nodes']:node(n,'/Cell')
 end=0;tracks=0
 for anim in g.get('animations',[])[:1]:
  for ch in anim['channels']:
   i=ch['target']['node'];prop=ch['target']['path'];s=anim['samplers'][ch['sampler']];times=glb.arr(s['input']).flatten();values=glb.arr(s['output']);assert s.get('interpolation','LINEAR') in ['LINEAR','STEP'];tracks+=1
   if prop=='weights':
    targets=len(g['meshes'][g['nodes'][i]['mesh']]['primitives'][0]['targets']);weights=values.reshape(len(times),targets);names=['shape_'+str(k) for k in range(targets)]
    skel=UsdSkel.Skeleton.Define(stage,nodePaths[i]+'/Skeleton');skel.CreateJointsAttr(['root']);skel.CreateRestTransformsAttr([Gf.Matrix4d(1)]);skel.CreateBindTransformsAttr([Gf.Matrix4d(1)])
    animation=UsdSkel.Animation.Define(stage,nodePaths[i]+'/Animation');animation.CreateJointsAttr(['root']);animation.CreateTranslationsAttr([Gf.Vec3f(0)]);animation.CreateRotationsAttr([Gf.Quatf(1)]);animation.CreateScalesAttr([Gf.Vec3h(1)]);animation.CreateBlendShapesAttr(names)
    UsdSkel.BindingAPI.Apply(skel.GetPrim()).CreateAnimationSourceRel().SetTargets([animation.GetPath()])
    for t,w in zip(times,weights):animation.CreateBlendShapeWeightsAttr().Set(Vt.FloatArray(w.tolist()),float(t)*24);end=max(end,float(t)*24)
    for mesh,p in meshes[i]:
     binding=UsdSkel.BindingAPI.Apply(mesh.GetPrim());binding.CreateSkeletonRel().SetTargets([skel.GetPath()]);binding.CreateAnimationSourceRel().SetTargets([animation.GetPath()]);binding.CreateGeomBindTransformAttr(Gf.Matrix4d(1));binding.CreateBlendShapesAttr(names)
     primvars=UsdGeom.PrimvarsAPI(mesh);primvars.CreatePrimvar('skel:jointIndices',Sdf.ValueTypeNames.IntArray,'constant',1).Set([0]);primvars.CreatePrimvar('skel:jointWeights',Sdf.ValueTypeNames.FloatArray,'constant',1).Set([1.0])
     paths=[]
     for k,target in enumerate(p['targets']):
      shape=UsdSkel.BlendShape.Define(stage,str(mesh.GetPath())+'/Shape_'+str(k));shape.CreateOffsetsAttr(Vt.Vec3fArray.FromNumpy(glb.arr(target['POSITION']).astype(np.float32)))
      if 'NORMAL' in target:shape.CreateNormalOffsetsAttr(Vt.Vec3fArray.FromNumpy(glb.arr(target['NORMAL']).astype(np.float32)))
      paths.append(shape.GetPath())
     binding.CreateBlendShapeTargetsRel().SetTargets(paths)
   else:
    op=ops[i][prop]
    for t,v in zip(times,values):
     val=Gf.Quatf(float(v[3]),Gf.Vec3f(*v[:3].astype(float))) if prop=='rotation' else Gf.Vec3d(*v.astype(float)) if prop=='translation' else Gf.Vec3f(*v.astype(float));op.Set(val,float(t)*24);end=max(end,float(t)*24)
 stage.SetStartTimeCode(0);stage.SetEndTimeCode(end);stage.GetRootLayer().Save();dest=Path(destination) if destination else ROOT/'celula-ios-v2.usdz'
 # Package without rewriting the source layer. USDZ requires uncompressed entries and 64-byte alignment.
 with zipfile.ZipFile(dest,'w',compression=zipfile.ZIP_STORED) as z:
  for file in [out/'celula.usdc', *sorted((out/'textures').iterdir())]:
   name=file.relative_to(out).as_posix();info=zipfile.ZipInfo(name);pad=(-(z.fp.tell()+30+len(name.encode())+4))%64;info.extra=struct.pack('<HH',0x1986,pad)+b'\0'*pad;z.writestr(info,file.read_bytes())
 checkstage=Usd.Stage.Open(str(dest));assert checkstage
 try:
  from pxr import UsdValidation
  registry=UsdValidation.ValidationRegistry();context=UsdValidation.ValidationContext(registry.GetOrLoadAllValidators());errors=context.Validate(checkstage)
 except ImportError:errors=[]
 report={'deformation':'UsdSkelBlendShape','meshes':meshcount,'tracks':tracks,'duration':end/24,'validation':[e.GetErrorAsString() for e in errors]}
 (dest.with_suffix('.validation.json')).write_text(json.dumps(report,indent=2));print('USDZ',dest.stat().st_size,'meshes',meshcount,'tracks',tracks,'validation',len(errors));print(report['validation'][:5])
if __name__=='__main__':convert()
