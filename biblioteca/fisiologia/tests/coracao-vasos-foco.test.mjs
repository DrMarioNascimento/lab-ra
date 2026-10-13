import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { PARTES_FOCO_VASCULAR } from "../pleura/vasos-foco.js";

const URL_TORAX = new URL("../assets/torax-completo-lobos-corrigidos.glb", import.meta.url);
const URL_FOCO = new URL("../assets/coracao-e-vasos-foco.glb", import.meta.url);

function abrirGlb(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "glTF", "cabeçalho GLB");
  assert.equal(bytes.readUInt32LE(4), 2, "versão GLB 2");
  assert.equal(bytes.readUInt32LE(8), bytes.length, "tamanho declarado do GLB");
  let offset = 12;
  let json;
  let bin;
  while (offset < bytes.length) {
    const tamanho = bytes.readUInt32LE(offset);
    const tipo = bytes.readUInt32LE(offset + 4);
    const inicio = offset + 8;
    if (tipo === 0x4e4f534a) json = JSON.parse(bytes.toString("utf8", inicio, inicio + tamanho).replace(/\0+$/u, ""));
    if (tipo === 0x004e4942) bin = bytes.subarray(inicio, inicio + tamanho);
    offset = inicio + tamanho;
  }
  assert.ok(json && bin, "chunks JSON e BIN presentes");
  return { json, bin };
}

function assinaturaDaParte(modelo, nome) {
  const node = modelo.json.nodes.find(item => item.name === nome && item.mesh !== undefined);
  assert.ok(node, `nó ausente: ${nome}`);
  const mesh = modelo.json.meshes[node.mesh];
  const hash = createHash("sha256");
  hash.update(`${mesh.name}\0`);
  for (const primitive of mesh.primitives) {
    const refs = { ...primitive.attributes, indices: primitive.indices };
    for (const [semantic, id] of Object.entries(refs).sort(([a], [b]) => a.localeCompare(b))) {
      const accessor = modelo.json.accessors[id];
      const view = modelo.json.bufferViews[accessor.bufferView];
      const inicio = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
      const fim = (view.byteOffset ?? 0) + view.byteLength;
      hash.update(`${semantic}\0`);
      hash.update(JSON.stringify({
        componentType: accessor.componentType,
        type: accessor.type,
        count: accessor.count,
        byteOffset: accessor.byteOffset ?? 0,
        byteLength: view.byteLength,
        byteStride: view.byteStride ?? 0,
        normalized: accessor.normalized ?? false,
        min: accessor.min ?? null,
        max: accessor.max ?? null,
      }));
      hash.update("\0");
      hash.update(modelo.bin.subarray(inicio, fim));
    }
  }
  return hash.digest("hex");
}

test("o foco mostra coração, vasos pulmonares, grandes vasos e coronárias sem caixa torácica", async () => {
  const { json } = abrirGlb(await readFile(URL_FOCO));
  const partesVisiveis = json.nodes.filter(node => node.mesh !== undefined).map(node => node.name);
  assert.deepEqual(partesVisiveis, [...PARTES_FOCO_VASCULAR]);
  assert.equal(json.meshes.length, PARTES_FOCO_VASCULAR.length);
  assert.equal(json.scenes[json.scene].nodes.length, 1);
  assert.equal(json.nodes[json.scenes[json.scene].nodes[0]].children.length, PARTES_FOCO_VASCULAR.length);
});

test("o foco preserva sem alteração a geometria e as dimensões das peças originais", async () => {
  const original = abrirGlb(await readFile(URL_TORAX));
  const foco = abrirGlb(await readFile(URL_FOCO));
  for (const nome of PARTES_FOCO_VASCULAR) {
    assert.equal(assinaturaDaParte(foco, nome), assinaturaDaParte(original, nome), `${nome}: a geometria precisa ser idêntica`);
    const transformacao = node => ({ matrix: node.matrix, translation: node.translation, rotation: node.rotation, scale: node.scale });
    assert.deepEqual(
      transformacao(foco.json.nodes.find(node => node.name === nome)),
      transformacao(original.json.nodes.find(node => node.name === nome)),
      `${nome}: as dimensões e a posição precisam permanecer idênticas`,
    );
  }
});

test("o arquivo focado baixa só os elementos necessários para a visualização", async () => {
  const [torax, foco] = await Promise.all([stat(URL_TORAX), stat(URL_FOCO)]);
  assert.ok(foco.size < torax.size / 5, `foco ${foco.size} B; tórax ${torax.size} B`);
});
