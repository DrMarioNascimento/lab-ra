"""Leitura mínima de GLB para a conversão de animações em USDZ."""
import json,struct,io
from pathlib import Path
import numpy as np
from PIL import Image
class GLB:
 def __init__(self,path):
  b=Path(path).read_bytes();l=struct.unpack_from('<I',b,12)[0];self.g=json.loads(b[20:20+l]);self.bin=bytearray(b[28+l:])
 def arr(self,i):
  a=self.g['accessors'][i];v=self.g['bufferViews'][a['bufferView']];d=np.dtype({5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1',5122:'<i2',5120:'i1'}[a['componentType']]);n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
  ar=np.ndarray((a['count'],n),d,self.bin,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',d.itemsize*n),d.itemsize)).copy()
  if a.get('normalized'):ar=ar.astype(np.float32)/np.iinfo(d).max
  return ar
 def image(self,info):
  i=self.g['images'][self.g['textures'][info['index']]['source']];v=self.g['bufferViews'][i['bufferView']]
  return np.array(Image.open(io.BytesIO(self.bin[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB'),dtype=np.float32)/255

