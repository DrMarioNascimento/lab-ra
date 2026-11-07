import { criarMaquete } from '../js/cena.js?v=20261107-ra5';
import { montarUSDZ } from './quicklook.js?v=20261107-ra5';

export async function prepararPersonagens() {
  const papeis = ['trabalhador', 'idoso', 'gestante', 'criancas', 'estudante', 'cientista', 'colega', 'vinculo', 'desconhecidos'];
  const nomes = { trabalhador: 'trabalhador', idoso: 'idoso', gestante: 'gestante', criancas: 'criança', estudante: 'estudante', cientista: 'cientista', colega: 'colega de turma', vinculo: 'vínculo afetivo', desconhecidos: 'desconhecidos' };
  const p1 = papeis.splice(Math.floor(Math.random() * papeis.length), 1)[0];
  const p3 = papeis[Math.floor(Math.random() * papeis.length)];
  const m = await criarMaquete({ grupos: { presetPrincipal: p1, nPrincipal: 1, presetRamal: p3, nRamal: 3 }, ra: true });
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
      descricao: `Trilho principal: 1 ${nomes[p1]}. Ramal: 3 (${nomes[p3]}).` };
  } finally {
    guardar(); geometrias.forEach(g => g.dispose()); materiais.forEach(mat => mat.dispose());
    texturas.forEach(t => { t.dispose(); t.source?.data?.close?.(); });
  }
}
