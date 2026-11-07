// As orientações não ficam cobrindo a maquete. A procura da superfície permanece visível.
export function criarAvisos(elemento, { agendar = setTimeout, cancelar = clearTimeout } = {}) {
  let timer = null;
  function ocultar() { cancelar(timer); timer = null; elemento.hidden = true; }
  return {
    mostrar(texto, { persistente = false, duracao = 5500 } = {}) {
      ocultar(); elemento.textContent = texto; elemento.hidden = false;
      if (!persistente) timer = agendar(ocultar,duracao);
    },
    ocultar,
  };
}
