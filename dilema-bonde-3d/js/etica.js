// Mesmos indicadores ilustrativos do Dilema do Bonde 2D. Não são notas morais.
export function refletir(c,rota){
  const ativo=rota==='ramal',atingidos=ativo?c.nRamal:c.nPrincipal,poupados=ativo?c.nPrincipal:c.nRamal,d=poupados-atingidos;
  const perfis={desconhecidos:[0,0,0,0],trabalhador:[8,4,4,5],cientista:[10,4,8,12],colega:[8,16,12,8],criancas:[22,10,10,10],estudante:[15,8,8,8],gestante:[24,8,10,12],idoso:[18,6,8,10],vinculo:[10,24,16,10]};
  const [v,a,i,x]=perfis[ativo?c.ramal:c.principal]||perfis.desconhecidos,p=c.pressao||c.tempo<=3?10:0;
  let util=50+d*10-v*(ativo?.45:.25)-p*.2;
  util+=ativo?Math.max(0,poupados-1)*4:-Math.max(0,atingidos-1)*6;
  let virt=50+(ativo?8:-6)+Math.max(0,d)*4+v*.35+a*.15-p*.25-(!ativo&&atingidos>1?10:0);
  let inten=50+(ativo?14:-8)+i*(ativo?.8:.35)-p*.2-(ativo&&poupados<=atingidos?8:0);
  const exist=50+(ativo?22:-10)+p*.6+a*.35-(!ativo&&atingidos>=3?6:0);
  const comp=50+p*.9+x+(c.modo==='classico'?4:8)+Math.abs(d)*2+(ativo?6:2);
  return {rota,atingidos,poupados,indicadores:[['Consequências',util],['Virtudes',virt],['Intenção',inten],['Responsabilidade',exist],['Complexidade',comp]].map(([nome,v])=>({nome,valor:Math.round(Math.max(0,Math.min(100,v)))}))};
}
