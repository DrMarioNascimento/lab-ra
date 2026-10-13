import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
test('paleta de vértices conserva o tom do material sem alterar a cena original',async()=>{
 class Color {
  constructor(r=1,g=1,b=1){this.r=r===0xffffff?1:r;this.g=g;this.b=b;}
  clone(){return new Color(this.r,this.g,this.b)}
  setRGB(r,g,b){this.r=r;this.g=g;this.b=b;return this}
  getHex(){return 0xffffff} // Fixture: atributo de vértice branco; o tom vem do material.
 }
 const color=new Color(.5,.25,.125),material={vertexColors:true,color,side:0,clone(){return {...this,color:this.color.clone()}}};
 const attribute={count:3,getX:()=>1,getY:()=>1,getZ:()=>1};
 const geometry={attributes:{color:attribute},clone(){return {...this,attributes:{...this.attributes}}},setAttribute(k,v){this.attributes[k]=v},deleteAttribute(k){delete this.attributes[k]}};
 const mesh={isMesh:true,geometry,material};
 const canvas={getContext:()=>({fillRect(){}})};
 const context={THREE:{Color,FrontSide:0,NearestFilter:1003,SRGBColorSpace:'srgb',CanvasTexture:class{constructor(image){this.image=image}},BufferAttribute:class{constructor(array,itemSize){this.array=array;this.itemSize=itemSize}}},document:{createElement:()=>canvas},raiz:{traverse:fn=>fn(mesh)}};
 let src=await readFile(new URL('../cores-para-ra.js',import.meta.url),'utf8');src=src.replace(/import \* as THREE from 'three';/,'').replace('export function prepararParaRA','function prepararParaRA');
 vm.runInNewContext(src+'\nprepararParaRA(raiz);',context);
 assert.notEqual(mesh.material,material);assert.notEqual(mesh.geometry,geometry);
 assert.deepEqual([mesh.material.color.r,mesh.material.color.g,mesh.material.color.b],[.5,.25,.125]);
 assert(mesh.material.map);assert.equal(mesh.material.vertexColors,false);assert(!mesh.geometry.attributes.color);assert(mesh.geometry.attributes.uv);
 assert.equal(material.vertexColors,true);assert.equal(material.color,color);assert.equal(geometry.attributes.color,attribute);
});
