import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const URL_MODELO = new URL("../assets/torax-completo-lobos-corrigidos.glb", import.meta.url);
const ASSINATURA_GEOMETRIA_EXISTENTE = "5e9f270cc4a0ee766f7759ab2e4c9e5529341370d586568ec552ff574eea27fc";
const VASOS_ACRESCENTADOS = [
  "arteria_pulmonar_D", "arteria_pulmonar_E",
  "veia_pulmonar_superior_D", "veia_pulmonar_inferior_D",
  "veia_pulmonar_superior_E", "veia_pulmonar_inferior_E",
  "arteria_coronaria_tronco_esquerdo", "arteria_coronaria_direita",
  "arteria_coronaria_descendente_anterior_LAD", "arteria_coronaria_diagonal",
  "arteria_coronaria_circunflexa", "arteria_coronaria_circunflexa_lateral",
  "arteria_coronaria_direita_AV", "arteria_coronaria_direita_posterior",
  "arteria_coronaria_descendente_posterior_PDA",
  "veia_coronaria_grande", "veia_coronaria_grande_lateral",
  "seio_coronario", "veia_coronaria_pequena", "cava_inferior",
];

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

function assinaturaDasMalhasAnteriores({ json, bin }) {
  const hash = createHash("sha256");
  for (const malha of json.meshes.slice(0, 79)) {
    hash.update(`${malha.name}\0`);
    for (const primitiva of malha.primitives) {
      const referencias = { ...primitiva.attributes, indices: primitiva.indices };
      for (const [semantica, id] of Object.entries(referencias).sort(([a], [b]) => a.localeCompare(b))) {
        const acessor = json.accessors[id];
        const view = json.bufferViews[acessor.bufferView];
        const inicio = (view.byteOffset ?? 0) + (acessor.byteOffset ?? 0);
        const fim = (view.byteOffset ?? 0) + view.byteLength;
        hash.update(`${semantica}\0`);
        hash.update(JSON.stringify({
          componentType: acessor.componentType,
          type: acessor.type,
          count: acessor.count,
          byteOffset: acessor.byteOffset ?? 0,
          byteLength: view.byteLength,
          byteStride: view.byteStride ?? 0,
          normalized: acessor.normalized ?? false,
          min: acessor.min ?? null,
          max: acessor.max ?? null,
        }));
        hash.update("\0");
        hash.update(bin.subarray(inicio, fim));
      }
    }
  }
  return hash.digest("hex");
}

test("GLB completo inclui as conexões cardiopulmonares e as coronárias", async () => {
  const bytes = await readFile(URL_MODELO);
  const { json } = abrirGlb(bytes);
  const malhas = new Map(json.meshes.map(malha => [malha.name, malha]));

  for (const nome of VASOS_ACRESCENTADOS) {
    assert.ok(malhas.has(nome), `malha ausente: ${nome}`);
    assert.match(malhas.get(nome).extras?.representation ?? "", /schematic vascular tube/u, `${nome} deve estar identificado como esquemático`);
  }
  assert.equal(json.meshes.length, 99, "79 malhas anatômicas preservadas mais 20 malhas vasculares");
});

test("os dados geométricos das 79 malhas aprovadas permanecem idênticos", async () => {
  const modelo = abrirGlb(await readFile(URL_MODELO));
  assert.equal(assinaturaDasMalhasAnteriores(modelo), ASSINATURA_GEOMETRIA_EXISTENTE,
    "posições, normais, índices e limites das malhas antigas não podem mudar");
});
