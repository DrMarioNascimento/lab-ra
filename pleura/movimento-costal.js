/* Coordenadas em metros antes da escala externa da caixa torácica.
   Osso e cartilagem compartilham o mesmo campo contínuo de movimento. */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const suave=t=>t*t*(3-2*t);
export const pontoEsternal=(p,ec,inspiracao)=>({x:p.x*ec,y:p.y+.005*inspiracao,z:p.z*ec+.004*inspiracao});
export function pontoCostal(p,{lado,numero,origem,eixo,insercao},ec,inspiracao) {
  const rx=p.x-origem.x,ry=p.y-origem.y,rz=p.z-origem.z;
  const proj=rx*eixo.x+ry*eixo.y+rz*eixo.z;
  const off=Math.hypot(rx-eixo.x*proj,ry-eixo.y*proj,rz-eixo.z*proj);
  const peso=suave(clamp((off-.012)/.038,0,1));
  const x=p.x*(1+(ec-1)*peso)-origem.x,y=ry,z=p.z*(1+(ec-1)*peso)-origem.z;
  const ang=-lado*(5-3*clamp((numero-3)/7,0,1))*inspiracao*Math.PI/180;
  const c=Math.cos(ang),s=Math.sin(ang),dot=x*eixo.x+y*eixo.y+z*eixo.z;
  const v={x:origem.x+x*c+(eixo.y*z-eixo.z*y)*s+eixo.x*dot*(1-c),
    y:origem.y+y*c+(eixo.z*x-eixo.x*z)*s+eixo.y*dot*(1-c),
    z:origem.z+z*c+(eixo.x*y-eixo.y*x)*s+eixo.z*dot*(1-c)};
  if(insercao) {
    // Zona de encaixe acompanha integralmente o esterno/arco; a transição
    // abrange ambos os tecidos. Costelas 11–12 conservam a ponta livre.
    const dist=Math.hypot(p.x-insercao.x,p.y-insercao.y,p.z-insercao.z);
    const blend=suave(clamp((.080-dist)/.072,0,1)),a=pontoEsternal(p,ec,inspiracao);
    v.x+=(a.x-v.x)*blend;v.y+=(a.y-v.y)*blend;v.z+=(a.z-v.z)*blend;
  }
  return v;
}
