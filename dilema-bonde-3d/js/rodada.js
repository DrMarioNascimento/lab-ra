import { normalizar,grupos,sortear,mudaRodada } from './configuracao.js?v=20261107-ra11';
import { refletir } from './etica.js?v=20261107-ra11';
export function criarRodada(m,config,{aoMudar=()=>{},aoResultado=()=>{},som=()=>{}}={}){
  let c=normalizar(config),fase='pronta',restante=c.pressao?3:c.tempo,pausada=false,bloqueios=new Set(),ocupada=false,resultado=null;
  const publicar=()=>aoMudar(api.estado());
  function zerar(){m.reiniciar();m.definirRota('principal');m.estado.vMax=c.velocidade;fase='pronta';restante=c.pressao?3:c.tempo;pausada=false;resultado=null;publicar();}
  m.estado.aoImpacto=rota=>{resultado=refletir(c,rota);som('impacto');};
  m.estado.aoFim=()=>{fase='resultado';resultado ||= refletir(c,m.rota);som('fim');publicar();aoResultado(resultado);};
  const api={
    config:()=>({...c}),
    estado:()=>({fase,tempo:Math.ceil(restante),pausada,bloqueada:bloqueios.size>0,ocupada,resultado,rota:m.rota,travado:m.estado.travado}),
    bloquear(chave,ativo){if(bloqueios.has(chave)===ativo)return;ativo?bloqueios.add(chave):bloqueios.delete(chave);publicar();},
    escolher(rota){if(ocupada||bloqueios.size||fase==='resultado')return false;const ok=m.definirRota(rota);publicar();return ok;},
    play(){if(ocupada||bloqueios.size||fase==='resultado')return;if(fase==='pronta'){fase='contagem';som('partir');}else pausada=!pausada;publicar();},
    async nova(config=c,{aleatorio=false}={}){
      if(ocupada)return false;ocupada=true;publicar();
      const anterior=c,novo=aleatorio?sortear(normalizar(config)):normalizar(config);
      try{await m.configurar(grupos(novo));c=novo;zerar();return true;}
      catch(error){c=anterior;throw error;}finally{ocupada=false;publicar();}
    },
    async ajustar(config){if(ocupada)return false;const novo=normalizar(config);if(mudaRodada(c,novo))return api.nova(novo);c=novo;publicar();return true;},
    reiniciar:zerar,
    atualizar(dt){
      const travadoAntes=m.estado.travado;
      if(ocupada||pausada||bloqueios.size){m.update(0);return;}
      if(fase==='contagem'){
        const t=Math.ceil(restante);restante=Math.max(0,restante-dt);if(Math.ceil(restante)!==t)som('tick');
        if(restante<=0){fase='percurso';m.partir();}if(Math.ceil(restante)!==t||fase==='percurso')publicar();
      }
      if(fase==='percurso'&&c.movimentoReduzido){
        // Mantém o tempo de decisão, mas apresenta o desfecho sem percurso animado.
        for(let i=0;i<5000&&fase==='percurso';i++)m.update(.05);
      }else m.update(dt);
      if(travadoAntes!==m.estado.travado)publicar();
    }
  };
  m.estado.vMax=c.velocidade;
  return api;
}
