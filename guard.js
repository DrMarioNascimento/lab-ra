/* Lab RA — acesso público e compatibilidade com links antigos da entrada. */
(() => {
  "use strict";
  const script=document.currentScript||document.querySelector('script[src*="guard.js"]');
  const raiz=new URL(".",new URL(script?.src||"guard.js",location.href));
  const entrada=new URL("index.html",raiz),bancadas=new URL("bancadas.html",raiz);
  const busca=new URLSearchParams(location.search);
  function destinoPedido() {
    try {
      const bruto=busca.get("destino");if(!bruto)return null;
      const alvo=new URL(bruto,location.href);
      if(alvo.origin!==raiz.origin||!alvo.pathname.startsWith(raiz.pathname)||alvo.pathname===entrada.pathname)return null;
      return alvo.href;
    } catch { return null; }
  }
  // Favoritos que antes pediam Google mantêm a bancada e seus parâmetros.
  if(location.pathname===entrada.pathname&&(busca.get("laboratorio")==="acesso"||busca.has("destino"))) {
    location.replace(destinoPedido()||bancadas.href);
  }
})();
