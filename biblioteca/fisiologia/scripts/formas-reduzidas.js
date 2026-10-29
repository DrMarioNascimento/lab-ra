/* Deformação em poucas formas básicas, em vez de uma cópia da malha por
   instante. Cada instante i é base + soma de c_ij · forma_j; as formas saem da
   decomposição da matriz de Gram dos deslocamentos (Jacobi), e entram até o
   maior erro em qualquer vértice ficar abaixo de 0,1% do tamanho da peça. Uma
   ondulação senoidal cabe em duas formas; uma dilatação, em uma. Os pesos são
   levados a [0, 1] por uma troca de base (o Quick Look pode recusar peso
   negativo), o que é exato porque tudo aqui é linear. */
export function formasReduzidas(base,formas){
 const n=formas.length,m=base.length,D=formas.map(f=>Float64Array.from(f,(v,i)=>v-base[i]));
 const G=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>{let s=0;const a=D[i],b=D[j];for(let k=0;k<m;k++)s+=a[k]*b[k];return s;}));
 const V=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:0));
 for(let volta=0;volta<60;volta++){let fora=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)fora+=G[i][j]**2;if(fora<1e-22)break;
  for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){if(Math.abs(G[p][q])<1e-30)continue;const th=.5*Math.atan2(2*G[p][q],G[q][q]-G[p][p]),c=Math.cos(th),s=Math.sin(th);
   for(let k=0;k<n;k++){const gp=G[k][p],gq=G[k][q];G[k][p]=c*gp-s*gq;G[k][q]=s*gp+c*gq;}
   for(let k=0;k<n;k++){const gp=G[p][k],gq=G[q][k];G[p][k]=c*gp-s*gq;G[q][k]=s*gp+c*gq;}
   for(let k=0;k<n;k++){const vp=V[k][p],vq=V[k][q];V[k][p]=c*vp-s*vq;V[k][q]=s*vp+c*vq;}}}
 const ordem=[...Array(n).keys()].map(j=>({j,l:G[j][j]})).filter(e=>e.l>1e-18).sort((a,b)=>b.l-a.l);
 let lo=Infinity,hi=-Infinity;for(let k=0;k<m;k++){lo=Math.min(lo,base[k]);hi=Math.max(hi,base[k]);}
 const tol=Math.max(1e-6,1e-3*(hi-lo)),R=D.map(d=>Float64Array.from(d)),usadas=[];
 for(const {j,l} of ordem){
  const raiz=Math.sqrt(l),forma=new Float64Array(m),a=Array.from({length:n},(_,i)=>V[i][j]/raiz);for(let i=0;i<n;i++){const w=a[i],d=D[i];for(let k=0;k<m;k++)forma[k]+=w*d[k];}
  const c=Array.from({length:n},(_,i)=>V[i][j]*raiz);let erro=0;
  for(let i=0;i<n;i++){const r=R[i];for(let k=0;k<m;k++){r[k]-=c[i]*forma[k];erro=Math.max(erro,Math.abs(r[k]));}}
  usadas.push({forma,c,a});if(erro<tol)break;
 }
 const base2=Float32Array.from(base),alvos=[],pesos=new Float32Array(n*usadas.length);
 const comb=[];
 usadas.forEach(({forma,c,a},j)=>{const mn=Math.min(...c),esc=Math.max(...c)-mn||1;for(let k=0;k<m;k++)base2[k]+=mn*forma[k];alvos.push(Float32Array.from(forma,v=>v*esc));for(let i=0;i<n;i++)pesos[i*usadas.length+j]=(c[i]-mn)/esc;comb.push({a,mn,esc});});
 return {base:base2,alvos,pesos,comb};
}

/* As mesmas formas aplicadas a outro atributo deformado junto (as normais):
   cada forma é a mesma combinação dos instantes, e a base recebe o mesmo
   deslocamento. Assim posição e normal continuam coerentes. */
export function aplicarCombinacao(base,formas,comb){
 const m=base.length,base2=Float32Array.from(base),alvos=[];
 for(const {a,mn,esc} of comb){const f=new Float64Array(m);a.forEach((w,i)=>{const d=formas[i];for(let k=0;k<m;k++)f[k]+=w*(d[k]-base[k]);});for(let k=0;k<m;k++)base2[k]+=mn*f[k];alvos.push(Float32Array.from(f,v=>v*esc));}
 return {base:base2,alvos};
}
