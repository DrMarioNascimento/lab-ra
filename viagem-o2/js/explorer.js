import { estadoInicial, reduzir, CORES_GRUPO } from './engine.js';
import { renderAluno, acaoAluno, novoLocal } from './views/aluno.js?v=cabine-20261110';
import { montar, setPath } from './ui.js?v=cabine-20261110';

const id = 'explorador';
let st = reduzir(estadoInicial('B1'), { t:'entrar', id, nome:'Explorador' });
st = reduzir(st, { t:'sortear', seed:42 });
st = { ...st, fase:'viagem' };
const loc = novoLocal();
const root = document.getElementById('explorer');
const colors = document.getElementById('cabinColor');
colors.innerHTML = CORES_GRUPO.map((c,i)=>`<option value="${i}">${c.nome}</option>`).join('');
// This selects a preview colour, never a group membership or physiological value.
colors.onchange = () => { root.style.setProperty('--team', CORES_GRUPO[Number(colors.value)].hex); };
let view;
const dispatch = action => { st = reduzir(st, action); requestAnimationFrame(() => view.draw()); };
view = montar(root, () => renderAluno(st,id,loc,{individual:true}), (a,el) => {
  const changed = acaoAluno(a,el,{st,id,loc,dispatch});
  if (a === 'parada') window.scrollTo({top:0,behavior:'instant'});
  return changed;
}, (path,value)=>setPath(loc,path,value));
view.draw();
