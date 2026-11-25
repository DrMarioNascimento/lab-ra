import { transporteReal, transporteFalso, transporteTelao } from '../sala/transporte.mjs';
import { aplicar } from './motor.mjs';

export { transporteFalso, transporteReal, transporteTelao };

export function comandar(partida, uid, acao, valor) {
  return {token:crypto.randomUUID(),partida:partida.id,volta:partida.volta,etapa:partida.etapa,uid,acao,valor:valor ?? null};
}

// No episódio, o campo de prontidão do participante carrega sua última
// solicitação. Só o Mestre aplica a transição no estado da sala.
export function ligarPartida(transporte, mudou) {
  const mestre = transporte.papel === 'master';
  let estado = null, escrevendo = false, fila = [];
  const espera = new Map();
  const agora = () => transporte.agora();

  function receber(sala, pessoas) {
    if (sala?.episodio && (!estado || estado.id !== sala.episodio.id || (sala.episodio.rev ?? 0) >= (estado.rev ?? 0))) estado=sala.episodio;
    const saiu = pessoas?.some(p=>p.id===transporte.uid && p.expulso);
    mudou(saiu || sala?.aulaEncerrada ? null : estado, pessoas ?? [], sala, saiu);
    if (saiu || sala?.aulaEncerrada || !estado) return;
    for (const [token, p] of espera) {
      const ack = estado.acks[p.uid];
      if (ack?.token === token) { clearTimeout(p.timer); espera.delete(token); p.resolver(ack.msg); }
    }
    if (!mestre) return;
    for (const x of pessoas ?? []) {
      const c=x.pronto;
      if (!estado.pessoas[x.id] || x.expulso || !c || c.episodio !== 1 || c.partida !== estado.id ||
          typeof c.token !== 'string' || c.token.length !== 36 || estado.acks[x.id]?.token === c.token || fila.some(f=>f.token===c.token)) continue;
      fila.push({...c,uid:x.id,local:false});
    }
    gravar();
  }

  async function gravar() {
    if (escrevendo || !mestre || !estado || !fila.length) return;
    escrevendo=true;
    const trabalho=fila[0];
    const [proposto,msg]=aplicar(estado,trabalho,agora(),!!trabalho.local);
    const rev={...proposto, rev:(estado.rev ?? 0)+1, acks:{...proposto.acks,[trabalho.uid]:{token:trabalho.token,msg}}};
    try {
      const ok=await transporte.atualizarSala({episodio:rev});
      if(ok) {
        estado=rev;
        fila.shift();
        trabalho.done?.(msg);
      } else {
        fila.shift();
        trabalho.done?.('O Mestre não conseguiu salvar. Tente novamente.');
      }
    } catch {
      fila.shift();
      trabalho.done?.('Conexão indisponível. Tente novamente.');
    } finally {
      escrevendo=false;
      if(fila.length) gravar();
    }
  }

  async function enviar(acao,valor) {
    if (!estado) return 'Aguarde o Mestre abrir a partida.';
    const c=comandar(estado,transporte.uid,acao,valor);
    if (mestre) return new Promise(done=>{fila.push({...c,done,local:true});gravar();});
    if (espera.size) return 'Aguarde a confirmação da última ação.';
    return new Promise(resolve=>{
      const timer=setTimeout(()=>{espera.delete(c.token);resolve('Sem confirmação do Mestre. Confira a conexão e tente novamente.');},9000);
      espera.set(c.token,{uid:c.uid,timer,resolver:resolve});
      transporte.atualizarEu({pronto:{episodio:1,...c}}).then(ok=>{
        if (!ok) {clearTimeout(timer);espera.delete(c.token);resolve('Não foi possível pedir a ação.');}
      }).catch(()=>{clearTimeout(timer);espera.delete(c.token);resolve('Sem conexão.');});
    });
  }
  transporte.aoMudar(receber);
  receber(transporte.sala,transporte.jogadores);
  return {enviar, agora, mestre, uid:transporte.uid};
}
