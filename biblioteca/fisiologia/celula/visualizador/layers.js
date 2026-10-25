export function layerKind(name){
 if(name==='membrana_plasmatica'||name==='citosol')return 'cell';
 if(/^mitocondria_\d+_membrana$/.test(name))return 'mito';
 return null;
}
export function configureLayers(doc=document){
 const state={cell:true,mito:true},listeners=new Set();let model=null;
 const getVariant=()=>state.cell?(state.mito?'completa':'sem-membranas-mitocondriais'):(state.mito?'sem-membrana-celular':'sem-membranas');
 const buttons={cell:doc.getElementById('mem'),mito:doc.getElementById('mito')};
 function apply(){
  model?.traverse(o=>{const kind=layerKind(o.name);if(kind)o.visible=state[kind];});
  buttons.cell.textContent=state.cell?'Ocultar membrana celular':'Mostrar membrana celular';
  buttons.mito.textContent=state.mito?'Ocultar membranas das mitocôndrias':'Mostrar membranas das mitocôndrias';
  for(const kind of ['cell','mito'])buttons[kind].setAttribute('aria-pressed',String(state[kind]));
 }
 for(const kind of ['cell','mito'])buttons[kind].onclick=()=>{state[kind]=!state[kind];apply();listeners.forEach(fn=>fn());};
 apply();
 return {getVariant,subscribe(fn){listeners.add(fn);},attachModel(value){model=value;apply();}};
}
