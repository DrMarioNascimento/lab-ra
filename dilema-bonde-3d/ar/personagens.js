import { criarMaquete } from '../js/cena.js?v=20261107-ra11';
import { montarUSDZ } from './quicklook.js?v=20261107-ra11';

import {normalizar,grupos,PAPEIS} from '../js/configuracao.js?v=20261107-ra11';
import {qualidadeDoAparelho} from '../js/qualidade.js?v=20261107-ra11';
export async function prepararPersonagens(config) {
  const c=normalizar(config);
  const m=await criarMaquete({grupos:grupos(c),velocidade:c.velocidade,qualidade:qualidadeDoAparelho(c.qualidade),ra:true});
  // O exportador substitui algumas malhas: guardar também os recursos anteriores.
  const geometrias = new Set(), materiais = new Set(), texturas = new Set();
  function guardar() { m.root.traverse(o => {
    if (o.geometry) geometrias.add(o.geometry);
    for (const mat of (Array.isArray(o.material) ? o.material : [o.material])) if (mat) {
      materiais.add(mat); Object.values(mat).forEach(t => { if (t?.isTexture) texturas.add(t); });
    }
  }); }
  guardar();
  try {
    const { usdz } = await montarUSDZ(m);
    return { url: URL.createObjectURL(new Blob([usdz], { type: 'model/vnd.usdz+zip' })),
      descricao: `Trilho principal: ${c.nPrincipal} (${PAPEIS[c.principal]}). Ramal: ${c.nRamal} (${PAPEIS[c.ramal]}).` };
  } finally {
    guardar(); geometrias.forEach(g => g.dispose()); materiais.forEach(mat => mat.dispose());
    texturas.forEach(t => { t.dispose(); t.source?.data?.close?.(); });
  }
}
