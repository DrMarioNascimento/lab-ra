export const mmHgParaCmH2O=p=>p*133.322387415/98.0665;
// Escolhe uma amostra do ciclo atual; frequência não deixa o atalho sem significado.
export function faseDoInstante(sim,tipo){
 const candidatos=sim.quadro.filter(q=>tipo==='enchimento'?q.mitral&&q.tricuspide&&!q.aortica&&!q.pulmonar&&q.qMitral>0&&q.qTri>0:q.aortica&&q.pulmonar&&!q.mitral&&!q.tricuspide&&q.qAortica>0&&q.qPulm>0);
 if(!candidatos.length)return null;
 return candidatos.reduce((a,b)=>b.vVE>a.vVE?b:a).fase;
}
