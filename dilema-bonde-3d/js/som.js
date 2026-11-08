export function criarSom(config){
  let ctx;
  function tocar(tipo){const c=config();if(!c.som)return;try{
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
    ctx ||= new Audio();if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    const notas=tipo==='fim'?[392,523]:tipo==='partir'?[440,660]:tipo==='tick'?[440]:[330];
    notas.forEach((freq,j)=>{const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+j*.14;
      o.type=c.humor?'triangle':'sine';o.frequency.setValueAtTime(freq,t);if(c.humor)o.frequency.exponentialRampToValueAtTime(freq*1.25,t+.1);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(c.volume/100*.09,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.14);
      o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.16);o.onended=()=>{o.disconnect();g.disconnect();};
    });
  }catch{}}
  return {tocar,fechar:()=>ctx?.close()};
}
