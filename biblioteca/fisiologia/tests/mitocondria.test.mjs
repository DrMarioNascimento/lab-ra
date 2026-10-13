import test from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
const ler = f => fs.readFileSync(new URL('../' + f, import.meta.url));
const glb = f => { const b = ler(f); assert.equal(b.toString('ascii', 0, 4), 'glTF'); return JSON.parse(b.toString('utf8', 20, 20 + b.readUInt32LE(12))); };

test('mitocôndria compartilhada: versão aberta com a organela inteira, fechada leve', () => {
  const aberta = glb('assets/mitocondria-aberta.glb'), nomes = aberta.nodes.map(n => n.name);
  for (const n of ['membrana_externa', 'membrana_interna_e_cristas', 'atp_sintase', 'cadeia_respiratoria', 'dna_mitocondrial', 'ribossomos', 'granulos_da_matriz'])
    assert(nomes.includes(n), n);
  const fechada = glb('assets/mitocondria-fechada.glb');
  assert.deepEqual(fechada.nodes.map(n => n.name), ['membrana_externa']);
  assert(ler('assets/mitocondria-fechada.glb').length < 400000);
  assert(ler('assets/mitocondria-aberta.glb').length < 4000000);
});

test('as três experiências trocam as mitocôndrias sem alterar os modelos aprovados', () => {
  const mem = ler('potencial-membrana/app.js').toString(), mus = ler('musculo-sarcomero/app.js').toString(), jun = ler('juncao-neuromuscular/app.js').toString();
  for (const app of [mem, mus, jun]) assert.match(app, /import \{ ?novaMitocondria ?\} from '\.\.\/mitocondria\.js';/);
  assert.match(mem, /\[\[\.94, \.70, \.54\], \[\.44, \.185, \.21\], -\.36, 'aberta'\]/);   // os números de modelos.js
  assert.match(mus, /new THREE\.CapsuleGeometry\(\.028, \.1, 4, 10\)\.attributes\.position\.count/);
  assert.match(mus, /novaMitocondria\('fechada'/);
  assert.match(jun, /novaMitocondria\('aberta',new THREE\.Vector3\(2,\.94,\.90\)\)/);
  assert.match(ler('juncao-neuromuscular/modelos.js').toString(), /organ\.userData\.mitocondria=true/);
});
