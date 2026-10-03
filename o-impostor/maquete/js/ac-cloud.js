/* Adaptador: usa Firebase da mesa em producao e conserva ensaio local. */
(function(w){
 const local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
 let module;
 function cloud(){return module??=import('./ac-firestore.mjs');}
 w.ACFetch=async(url,options)=>{
   if(local&&!new URLSearchParams(location.search).has('acfirebase'))return fetch(url,options);
   return (await cloud()).request(url,options);
 };
 w.ACEvents=function(url){
   if(local&&!new URLSearchParams(location.search).has('acfirebase'))return new EventSource(url);
   let stop,closed=false;const self=this;
   cloud().then(m=>m.listen(url,data=>self.onmessage?.({data:JSON.stringify(data)}),()=>self.onopen?.(),e=>self.onerror?.(e))).then(fn=>{stop=fn;if(closed)stop();}).catch(e=>self.onerror?.(e));
   this.close=()=>{closed=true;stop?.();};
 };
 w.ACPrepareGroups=async(...args)=>(await cloud()).prepare(...args);
})(window);
