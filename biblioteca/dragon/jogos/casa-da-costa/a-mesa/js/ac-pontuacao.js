/* Os pontos do percurso d'A Casa na apuração da Mesa.

   Cada integrante de cada Fragmento tem um recibo (ac-replay.mjs, versão 2)
   com o que ganhou: sala (0–9), vela (0–30), chaves (0–24) e papéis (0–15).
   A apuração SOMA — nunca trava. Até 18/09/2026 ela exigia a dupla inteira
   concluída e os nove objetos da sala, e lançava erro no resto: quem saía da
   sala pelo prazo com oito objetos travava a Mesa inteira na decisão, e quem
   não chegava ao fim do percurso perdia os pontos que já tinha ganhado. */
(function(global){
 'use strict';
 const LIMITES={salaEscura:9,vela:30,chaves:24,papeis:15};
 function inteiro(n,max){n=Number(n);return Number.isFinite(n)?Math.max(0,Math.min(max,Math.round(n))):0;}
 /* Um recibo que não se sustenta não conta — e não derruba a apuração. */
 function validar(r){return !!(r&&r.version===2&&r.kind==='individual'&&typeof r.runId==='string'&&typeof r.jogador==='string'&&r.jogador);}
 function apurar(resultados){
   const out={},seen=new Set();
   for(const r of resultados||[]){
     if(!validar(r))continue;
     const k=r.jogador+'|'+r.runId;if(seen.has(k))continue;seen.add(k);
     const p=out[r.jogador]??={salaEscura:0,vela:0,chaves:0,papeis:0};
     for(const [campo,max] of Object.entries(LIMITES))p[campo]+=inteiro(r[campo],max);
   }
   return out;
 }
 /* As rodadas do percurso: as das tarefas gravadas E a que a Mesa abriu
    (acElencoAtividade.runId) — se ninguém concluiu, a rodada ainda existe e
    os pontos ganhos nela ainda contam. */
 async function carregar(tarefas,ativo,runsExtra){
   if(!ativo)return {};
   const runs=new Set((tarefas||[]).map(t=>String(t.runId||'')).filter(r=>r.includes('-salaEscura-')));
   for(const r of runsExtra||[])if(r&&String(r).includes('-salaEscura-'))runs.add(String(r));
   const rows=[];
   /* Percurso jogado com o parceiro automático (Mesa de um só): os pontos
      vêm na própria tarefa. */
   for(const t of tarefas||[])if(t&&t.pontosAC&&typeof t.jogadorId==='string')rows.push({version:2,kind:'individual',runId:String(t.runId||'solo'),jogador:t.jogadorId,...t.pontosAC});
   for(const run of runs){
     const r=await (globalThis.ACFetch||fetch)('/api/ac/individual?'+new URLSearchParams({run}));
     if(!r.ok)throw Error('Reconecte para recuperar os pontos do percurso.');
     const data=await r.json();if(Array.isArray(data))rows.push(...data);
   }
   return apurar(rows);
 }
 function aplicar(placar,pontos){return placar.map(l=>{const p=pontos[l.id];if(!p)return l;const componentes={...l.componentes,salaEscura:p.salaEscura,vela:p.vela,chaves:p.chaves,papeis:p.papeis};return {...l,componentes,total:Object.values(componentes).reduce((s,n)=>s+(Number(n)||0),0)};}).sort((a,b)=>b.total-a.total||String(a.nome).localeCompare(String(b.nome)));}
 global.ACPontuacao={validar,apurar,carregar,aplicar,LIMITES};
})(typeof window==='undefined'?globalThis:window);
