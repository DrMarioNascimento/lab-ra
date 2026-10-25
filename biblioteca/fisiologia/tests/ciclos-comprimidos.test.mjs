import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

/* Todos os ciclos portáteis: GLB comprimido, com movimento e placa, e o
   USDZ ao lado. Pesos de referência (antes desta revisão) entre parênteses. */
const raiz = new URL('../', import.meta.url);
const TETO = { // bytes
  'coracao/ciclos/nivel-1.glb': 9_000_000,   // (20,5 MB)
  'coracao/ciclos/nivel-2.glb': 5_000_000,   // (37,0 MB)
  'pleura/ciclos/nivel-2.glb': 9_000_000,    // (22,9 MB)
  'osso-vivo/ciclos/nivel-1.glb': 4_000_000, // (18,0 MB)
};
const json = b => JSON.parse(b.toString('utf8', 20, 20 + b.readUInt32LE(12)));

const ciclos = fs.readdirSync(raiz, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(new URL(d.name + '/ciclos/', raiz)))
  .flatMap(d => fs.readdirSync(new URL(d.name + '/ciclos/', raiz)).filter(f => f.endsWith('.glb')).map(f => d.name + '/ciclos/' + f));

test('há ciclos nas sete experiências animadas', () => {
  assert.deepEqual([...new Set(ciclos.map(c => c.split('/')[0]))].sort(),
    ['coracao', 'juncao-neuromuscular', 'musculo-sarcomero', 'osso-vivo', 'pleura', 'retorno-venoso', 'starling']);
});

for (const c of ciclos) test(`${c}: Draco, movimento, placa, USDZ e peso`, () => {
  const b = fs.readFileSync(new URL(c, raiz)), g = json(b);
  assert.ok(g.extensionsRequired?.includes('KHR_draco_mesh_compression'), 'sem Draco');
  assert.ok(g.animations?.[0]?.channels.length > 0, 'sem animação');
  assert.ok(g.nodes.some(n => n.extras?.textoRA), 'sem placa em relevo');
  // relevo só como mapa normal: EXT_materials_bump não chega ao iPhone
  assert.ok(!(g.extensionsUsed || []).includes('EXT_materials_bump'), 'relevo em EXT_materials_bump');
  assert.ok(fs.existsSync(new URL(c.replace(/\.glb$/, '.usdz'), raiz)), 'sem USDZ');
  assert.ok(b.length < (TETO[c] ?? 2_600_000), `${b.length} bytes`);
});
