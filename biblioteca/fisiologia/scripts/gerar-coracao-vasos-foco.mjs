import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PARTES_FOCO_VASCULAR } from "../pleura/vasos-foco.js";

const URL_ENTRADA = new URL("../assets/torax-completo-lobos-corrigidos.glb", import.meta.url);
const URL_SAIDA = new URL("../assets/coracao-e-vasos-foco.glb", import.meta.url);

function lerGlb(bytes) {
  if (bytes.toString("ascii", 0, 4) !== "glTF" || bytes.readUInt32LE(4) !== 2) {
    throw new Error("O arquivo de origem não é um GLB 2 válido.");
  }
  let offset = 12;
  let json;
  let bin;
  while (offset < bytes.length) {
    const length = bytes.readUInt32LE(offset);
    const type = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (type === 0x4e4f534a) json = JSON.parse(bytes.toString("utf8", start, start + length).replace(/\0+$/u, ""));
    if (type === 0x004e4942) bin = bytes.subarray(start, start + length);
    offset = start + length;
  }
  if (!json || !bin) throw new Error("O GLB precisa conter chunks JSON e BIN.");
  return { json, bin };
}

function alinhar4(valor) {
  return (valor + 3) & ~3;
}

function empacotarGlb(json, bin) {
  const jsonChunk = Buffer.from(JSON.stringify(json), "utf8");
  const jsonPadded = Buffer.alloc(alinhar4(jsonChunk.length), 0x20);
  jsonChunk.copy(jsonPadded);
  const binPadded = Buffer.alloc(alinhar4(bin.length));
  bin.copy(binPadded);
  const totalLength = 12 + 8 + jsonPadded.length + 8 + binPadded.length;
  const header = Buffer.alloc(12);
  header.write("glTF", 0, "ascii");
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonPadded.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binPadded.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonPadded, binHeader, binPadded]);
}

function remapearPrimitiva(primitiva, accessorIds, materialIds) {
  const copia = structuredClone(primitiva);
  for (const key of Object.keys(copia.attributes ?? {})) copia.attributes[key] = accessorIds.get(copia.attributes[key]);
  if (copia.indices !== undefined) copia.indices = accessorIds.get(copia.indices);
  for (const alvo of copia.targets ?? []) {
    for (const key of Object.keys(alvo)) alvo[key] = accessorIds.get(alvo[key]);
  }
  if (copia.material !== undefined) copia.material = materialIds.get(copia.material);
  return copia;
}

const { json: origem, bin: binOrigem } = lerGlb(await readFile(URL_ENTRADA));
if (origem.extensionsUsed?.length || origem.images?.length || origem.textures?.length || origem.animations?.length || origem.skins?.length) {
  throw new Error("A origem ganhou recursos além de malhas simples; revise o extrator antes de gerar o foco.");
}

const cenaOrigem = origem.scenes[origem.scene ?? 0];
if (cenaOrigem.nodes.length !== 1) throw new Error("Esperava uma raiz anatômica única na cena do tórax.");
const raizOrigem = origem.nodes[cenaOrigem.nodes[0]];
const porNome = new Map(origem.nodes.map((node, index) => [node.name, { node, index }]));
const nosSelecionados = PARTES_FOCO_VASCULAR.map(name => {
  const item = porNome.get(name);
  if (!item || item.node.mesh === undefined) throw new Error(`Parte ausente ou sem malha: ${name}`);
  if (item.node.children?.length) throw new Error(`A parte ${name} tem subpartes não incluídas no foco.`);
  return { ...item, name };
});
if (new Set(nosSelecionados.map(item => item.index)).size !== PARTES_FOCO_VASCULAR.length) {
  throw new Error("O modelo de origem contém nomes duplicados entre as partes selecionadas.");
}

const malhasOriginais = nosSelecionados.map(item => origem.meshes[item.node.mesh]);
const idsAcessoresAntigos = new Set();
const idsMateriaisAntigos = new Set();
function coletarAcessor(id) {
  if (id === undefined || idsAcessoresAntigos.has(id)) return;
  idsAcessoresAntigos.add(id);
  const accessor = origem.accessors[id];
  if (accessor.bufferView !== undefined) idsBufferViewsAntigos.add(accessor.bufferView);
  if (accessor.sparse) {
    idsBufferViewsAntigos.add(accessor.sparse.indices.bufferView);
    idsBufferViewsAntigos.add(accessor.sparse.values.bufferView);
  }
}
const idsBufferViewsAntigos = new Set();
for (const malha of malhasOriginais) {
  for (const primitiva of malha.primitives) {
    for (const id of Object.values(primitiva.attributes ?? {})) coletarAcessor(id);
    coletarAcessor(primitiva.indices);
    for (const alvo of primitiva.targets ?? []) for (const id of Object.values(alvo)) coletarAcessor(id);
    if (primitiva.material !== undefined) idsMateriaisAntigos.add(primitiva.material);
  }
}

const bufferViewIds = new Map();
const bufferViews = [];
const blocos = [];
let offsetBin = 0;
for (const oldId of [...idsBufferViewsAntigos].sort((a, b) => a - b)) {
  const view = origem.bufferViews[oldId];
  if (view.buffer !== undefined && view.buffer !== 0) throw new Error("O GLB de origem usa mais de um buffer.");
  const inicio = view.byteOffset ?? 0;
  const fim = inicio + view.byteLength;
  offsetBin = alinhar4(offsetBin);
  const novo = { ...view, buffer: 0, byteOffset: offsetBin };
  bufferViewIds.set(oldId, bufferViews.length);
  bufferViews.push(novo);
  blocos.push({ offset: offsetBin, conteudo: binOrigem.subarray(inicio, fim) });
  offsetBin += view.byteLength;
}
const bin = Buffer.alloc(alinhar4(offsetBin));
for (const bloco of blocos) bloco.conteudo.copy(bin, bloco.offset);

const accessorIds = new Map();
const accessors = [];
for (const oldId of [...idsAcessoresAntigos].sort((a, b) => a - b)) {
  const accessor = structuredClone(origem.accessors[oldId]);
  if (accessor.bufferView !== undefined) accessor.bufferView = bufferViewIds.get(accessor.bufferView);
  if (accessor.sparse) {
    accessor.sparse.indices.bufferView = bufferViewIds.get(accessor.sparse.indices.bufferView);
    accessor.sparse.values.bufferView = bufferViewIds.get(accessor.sparse.values.bufferView);
  }
  accessorIds.set(oldId, accessors.length);
  accessors.push(accessor);
}

const materialIds = new Map();
const materials = [];
for (const oldId of [...idsMateriaisAntigos].sort((a, b) => a - b)) {
  materialIds.set(oldId, materials.length);
  materials.push(structuredClone(origem.materials[oldId]));
}

const meshes = malhasOriginais.map((mesh, index) => ({
  ...structuredClone(mesh),
  primitives: mesh.primitives.map(primitive => remapearPrimitiva(primitive, accessorIds, materialIds)),
}));
const nodes = [
  { ...structuredClone(raizOrigem), name: "Coração e vasos em foco", mesh: undefined, children: PARTES_FOCO_VASCULAR.map((_, index) => index + 1) },
  ...nosSelecionados.map((item, index) => ({
    ...structuredClone(item.node),
    mesh: index,
    children: undefined,
  })),
].map(node => {
  if (node.mesh === undefined) delete node.mesh;
  if (node.children === undefined) delete node.children;
  return node;
});
const saida = {
  asset: structuredClone(origem.asset),
  scene: 0,
  scenes: [{ name: "Coração e vasos em foco", nodes: [0] }],
  nodes,
  meshes,
  materials,
  accessors,
  bufferViews,
  buffers: [{ byteLength: offsetBin }],
};
if (origem.extras) saida.extras = structuredClone(origem.extras);

await writeFile(URL_SAIDA, empacotarGlb(saida, bin));
console.log(`Modelo focado gerado: ${fileURLToPath(URL_SAIDA)} (${PARTES_FOCO_VASCULAR.length} partes, ${Math.round(bin.length / 1024)} KiB de geometria).`);
