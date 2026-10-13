// Repetição da observação já calculada, sem modificar o modelo fisiológico.
export function avancarInstante(instante,delta,duracao,loop=false){
 if(!Number.isFinite(duracao)||duracao<=0)throw new RangeError('Duração inválida');
 const next=Math.max(0,instante)+Math.max(0,delta);
 if(loop)return {instante:next%duracao,terminou:false};
 return {instante:Math.min(next,duracao),terminou:next>=duracao};
}
