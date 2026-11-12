import { estadoInicial, reduzir, CORES_GRUPO } from './engine.js?v=desfecho-20261111';
import { renderAluno, acaoAluno, novoLocal } from './views/aluno.js?v=desfecho-20261111';
import { montar, setPath } from './ui.js?v=desfecho-20261111';

const id = 'explorador';
const iniciarViagem = () => ({
  ...reduzir(estadoInicial('B1'), { t:'entrar', id, nome:'Explorador' }),
  fase:'viagem',
});
let st = iniciarViagem();
let loc = novoLocal();
const root = document.getElementById('explorer');
const colors = document.getElementById('cabinColor');
colors.innerHTML = CORES_GRUPO.map((c,i)=>`<option value="${i}">${c.nome}</option>`).join('');
// This selects a preview colour, never a group membership or physiological value.
colors.onchange = () => { root.style.setProperty('--team', CORES_GRUPO[Number(colors.value)].hex); };
let view;
const dispatch = action => { st = reduzir(st, action); requestAnimationFrame(() => view.draw()); };
view = montar(root, () => renderAluno(st,id,loc,{individual:true}), (a,el) => {
  if (a === 'reiniciarViagem') {
    loc = novoLocal();
    st = iniciarViagem();
  } else if (!acaoAluno(a,el,{st,id,loc,dispatch})) return false;
  if (['parada', 'resumoViagem', 'reverParada', 'reiniciarViagem'].includes(a)) {
    requestAnimationFrame(() => {
      root.querySelector('.trip-summary-title')?.focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    });
  }
  return true;
}, (path,value)=>setPath(loc,path,value));
view.draw();
