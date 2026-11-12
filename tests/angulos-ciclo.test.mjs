import test from 'node:test';
import assert from 'node:assert/strict';

for (const curso of ['angulos', 'angulos-licenciatura']) {
  const root = new URL(`../${curso}/js/`, import.meta.url);
  const { estadoInicial, reduzir, progresso, FASES } = await import(new URL('engine.js', root));
  const { passoBot, NOMES } = await import(new URL('bots.js', root));
  const { PARADAS } = await import(new URL('content/roteiro.js', root));

  test(`${curso}: viagem só é concluída com respostas e cartas`, () => {
    let st = estadoInicial(); const enviar = (a) => { st = reduzir(st, a); };
    for (let i=0;i<6;i++) enviar({t:'entrar',id:`a${i}`,nome:NOMES[i]});
    enviar({t:'sortear',seed:23}); enviar({t:'fase',dir:1}); enviar({t:'fase',dir:1});
    enviar({t:'concluirViagem',id:'a0'}); assert.equal(progresso(st).feito,0);
    for (const p of PARADAS) enviar({t:'viagemResp',id:'a0',parada:p.id,op:0});
    enviar({t:'concluirViagem',id:'a0'}); assert.equal(progresso(st).feito,0);
    for (const carta of [PARADAS[0].cartas[0],PARADAS[1].cartas[0]]) enviar({t:'mochila',id:'a0',carta});
    enviar({t:'concluirViagem',id:'a0'}); assert.equal(progresso(st).feito,1);
    enviar({t:'mochila',id:'a0',carta:PARADAS[0].cartas[0]}); assert.equal(progresso(st).feito,0);
  });

  for (const n of [30,35,40]) test(`${curso}: simula 11 fases para ${n} alunos`, () => {
    let st=estadoInicial(),loc={};const enviar=(a)=>{st=reduzir(st,a)};
    for(let i=0;i<n;i++){const id=`a${i}`;loc[id]={parada:0,ind:{},lab:{acoes:[]},h2:{}};enviar({t:'entrar',id,nome:NOMES[i]});}
    enviar({t:'sortear',seed:n});assert.equal(Object.keys(st.grupos).length,7);
    for(let fase=1;fase<FASES.length;fase++){
      assert.equal(st.fase,FASES[fase].id);
      for(let rodada=0;rodada<500;rodada++){const p=progresso(st);if(!p||p.feito===p.total)break;for(const id of st.ordem)passoBot(st,id,loc[id],enviar);}
      const p=progresso(st);if(p)assert.equal(p.feito,p.total,`etapa ${st.fase}`);
      if(fase<FASES.length-1)enviar({t:'fase',dir:1});
    }
  });
}
