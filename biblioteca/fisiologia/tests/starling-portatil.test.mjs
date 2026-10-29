import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ciclo = (n, ext) => new URL(`../starling/ciclos/nivel-${n}.${ext}`, import.meta.url);
const json = b => JSON.parse(b.toString('utf8', 20, 20 + b.readUInt32LE(12)));

test('os cinco ciclos do Starling vão comprimidos em Draco, sem perder movimento nem placa', () => {
  for (let n = 1; n <= 5; n++) {
    const b = fs.readFileSync(ciclo(n, 'glb')), g = json(b);
    assert.ok(g.extensionsRequired?.includes('KHR_draco_mesh_compression'), `nível ${n} sem Draco`);
    assert.ok(g.animations?.[0]?.channels.length > 0, `nível ${n} sem animação`);
    assert.ok(g.nodes.some(x => x.extras?.textoRA), `nível ${n} sem placa em relevo`);
    // As deformações (vasomoção, linfângions, glicocálix) não entram no Draco;
    // mesmo assim cada nível fica abaixo do arquivo cru publicado antes.
    assert.ok(b.length < 1_500_000, `nível ${n} com ${b.length} bytes`);
  }
});

test('o tecido do Starling leva cor, relevo e aspereza no GLB e no USDZ', () => {
  for (let n = 1; n <= 5; n++) {
    const g = json(fs.readFileSync(ciclo(n, 'glb')));
    const tecido = g.materials.filter(m => m.pbrMetallicRoughness?.baseColorTexture);
    assert.ok(tecido.length > 0, `nível ${n} sem textura`);
    for (const m of tecido) {
      assert.ok(m.normalTexture && m.pbrMetallicRoughness.metallicRoughnessTexture, `nível ${n}: ${m.name} incompleto`);
      // a repetição tem de estar no UV: o conversor de USDZ não lê KHR_texture_transform
      assert.equal(m.pbrMetallicRoughness.baseColorTexture.extensions?.KHR_texture_transform, undefined);
    }
    /* O pacote USDZ guarda os nomes dos arquivos em claro (ZIP sem compressão). */
    const usdz = fs.readFileSync(ciclo(n, 'usdz')).toString('latin1');
    assert.ok((usdz.match(/textures\/texture_\d+\.jpg/g) || []).length >= 3, `nível ${n}: USDZ sem texturas`);
  }
});

test('as texturas são procedurais e determinísticas: nada de Math.random', () => {
  const src = fs.readFileSync(new URL('../texturas-tecido.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /Math\.random\s*\(/);
});
