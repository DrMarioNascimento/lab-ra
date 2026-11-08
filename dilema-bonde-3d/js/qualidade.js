export const PERFIS = Object.freeze({
  economica: {nome:'Econômica',arvores:'economica',quantidade:18,pixelRatio:1,framebuffer:.65},
  equilibrada: {nome:'Equilibrada',arvores:'mobile',quantidade:27,pixelRatio:1.25,framebuffer:.85},
  detalhada: {nome:'Detalhada',arvores:'mobile',quantidade:27,pixelRatio:1.75,framebuffer:1},
});
export function resolverQualidade(opcao='auto', dispositivo={}) {
  if(PERFIS[opcao])return opcao;
  if(dispositivo.saveData || (dispositivo.memoria>0&&dispositivo.memoria<=4))return 'economica';
  return dispositivo.movel ? 'equilibrada':'detalhada';
}
export function qualidadeDoAparelho(opcao='auto') {
  return resolverQualidade(opcao,{movel: /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||navigator.maxTouchPoints>1,
    memoria:navigator.deviceMemory,saveData:navigator.connection?.saveData});
}
// Mantém os exemplares das bordas e retira primeiro repetições do centro.
export function selecionarArvores(novas,antigas,quantidade=27) {
  const candidatas=[...novas.map(a=>({...a,tipo:'nova'})),...antigas.map(a=>({...a,tipo:'antiga'}))];
  const borda=a=>Math.max(Math.abs(a.x)/76,Math.abs(a.z-2)/50);
  candidatas.sort((a,b)=>borda(b)-borda(a)||a.x-b.x);
  const escolhidas=candidatas.slice(0,quantidade);
  return {novas:escolhidas.filter(a=>a.tipo==='nova'),antigas:escolhidas.filter(a=>a.tipo==='antiga')};
}

// Somente reduz a resolução em Auto. Uma janela longa evita reagir a um pico de carga.
export function adaptarResolucao({automatica,renderer,perfil,agora=()=>performance.now()}){
  let inicio=agora(),quadros=0,ratio=0;
  return function quadro(ativo=true){
    if(!automatica||renderer.xr.isPresenting)return;
    if(!ativo){inicio=agora();quadros=0;return;}
    quadros++;const t=agora(),decorrido=t-inicio;if(decorrido<5000)return;
    const fps=quadros*1000/decorrido;inicio=t;quadros=0;
    if(fps<28){ratio=renderer.getPixelRatio();const proximo=Math.max(.75,ratio*.8);if(proximo<ratio-.01)renderer.setPixelRatio(proximo);}
  };
}
