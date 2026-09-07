import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";

const texto = p => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const bin = p => readFile(new URL(`../${p}`, import.meta.url));

function glbJson(buf) {
  assert.equal(buf.toString("ascii", 0, 4), "glTF");
  const jsonLen = buf.readUInt32LE(12);
  return JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8").trim());
}

test("a esteira da bancada 11 está documentada e não se faz de coração pronto", async () => {
  const spec = await texto("bancadas/11-coracao/SPEC.md");
  const readme = await texto("bancadas/11-coracao/README.md");
  for (const t of [spec, readme]) {
    assert.ok(t.includes("não é o coração") || t.includes("não o coração"), "WIP explícito");
    assert.ok(/1 mm|1 unidade = 1 mm/.test(t));
    assert.ok(t.includes("Y"));
    assert.ok(/ápice/i.test(t));
    assert.ok(t.includes("60"));
  }
  assert.ok(spec.includes("ventriculo_esquerdo"));
  assert.ok(spec.includes("cuspide_anterior_mitral"));
  assert.ok(spec.includes("duas superfícies") || spec.includes("duas faces") || spec.includes("parede_externa_ve"));
});

test("as quatro prioridades da spec estão nesta ordem e não invertidas", async () => {
  const spec = await texto("bancadas/11-coracao/SPEC.md");
  const i1 = spec.indexOf("Separação nomeada");
  const i2 = spec.indexOf("Câmaras fechadas");
  const i3 = spec.indexOf("Escala");
  const i4 = spec.indexOf("cúspide");
  assert.ok(i1 >= 0 && i2 > i1 && i3 > i2 && i4 > i3);
});

test("LICENSE/ATTRIBUTION cita BodyParts3D CC-BY-SA 2.1 JP e Z-Anatomy CC-BY-SA 4.0", async () => {
  const lic = await texto("bancadas/11-coracao/LICENSE.md");
  assert.ok(lic.includes("CC-BY-SA 2.1") || lic.includes("Share Alike 2.1"));
  assert.ok(lic.includes("Japan") || lic.includes("JP"));
  assert.ok(lic.includes("Z-Anatomy"));
  assert.ok(lic.includes("CC-BY-SA 4.0") || lic.includes("4.0"));
  const att = await texto("bancadas/11-coracao/ATTRIBUTION.md");
  assert.ok(att.includes("LICENSE.md"));
});

test("INVENTORY mapeia peças com presente / parcial / ausente e não inventa aurícula nem condução", async () => {
  const inv = await texto("bancadas/11-coracao/INVENTORY.md");
  assert.ok(inv.includes("✅"));
  assert.ok(inv.includes("⚠️"));
  assert.ok(inv.includes("❌"));
  const mapa = JSON.parse(await texto("bancadas/11-coracao/mapeamento.json"));
  const por = Object.fromEntries(mapa.pecas.map(p => [p.nome, p]));
  assert.equal(por.auricula_esquerda.status, "ausente");
  assert.equal(por.auricula_direita.status, "ausente");
  assert.equal(por.no_sinusal.status, "ausente");
  assert.equal(por.purkinje.status, "ausente");
  assert.equal(por.parede_externa_ve.status, "ausente");
  assert.equal(por.parede_interna_ve.status, "ausente");
  assert.equal(por.cuspide_anterior_mitral.status, "presente");
  assert.equal(por.cuspide_anterior_aortica.status, "presente");
  assert.equal(por.cavidade_ve.status, "presente");
  assert.equal(por.cuspide_posterior_mitral.status, "parcial");
  assert.ok(mapa.contagem.ausente >= 10);
  assert.ok(mapa.contagem.presente >= 20);
});

test("o catálogo PART-OF oficial e os OBJ do coração estão no repo", async () => {
  const lista = await texto("bancadas/11-coracao/fontes/bodyparts3d/catalogos/partof_parts_list_e.txt");
  assert.ok(lista.includes("FMA7101") && lista.includes("left ventricle"));
  assert.ok(lista.includes("FMA7242") && lista.includes("anterior leaflet of mitral valve"));
  assert.ok(!/auricle of heart/i.test(lista));
  const objs = await readdir(new URL("../bancadas/11-coracao/fontes/bodyparts3d/obj/", import.meta.url));
  const fjs = objs.filter(n => n.endsWith(".obj"));
  assert.ok(fjs.includes("FJ2422.obj"));
  assert.ok(fjs.length >= 80, `${fjs.length} OBJ`);
  const cab = await texto("bancadas/11-coracao/fontes/bodyparts3d/obj/FJ2422.obj");
  assert.ok(cab.includes("Share Alike 2.1 Japan"));
  assert.ok(cab.includes("Volume(cm3)"));
  assert.ok(cab.includes("Cavity of left ventricle"));
});

test("o glb WIP existe, declara WIP, e não põe malha em peça ausente", async () => {
  const buf = await bin("bancadas/11-coracao/export/coracao-bancada11-WIP.glb");
  const gltf = glbJson(buf);
  assert.equal(gltf.asset.extras.wip, true);
  const nos = Object.fromEntries(gltf.nodes.map(n => [n.name, n]));
  assert.ok(nos.coracao_WIP);
  assert.equal(nos.coracao_WIP.extras.wip, true);
  assert.ok(nos.coracao_WIP.extras.triangulos > 0);
  assert.equal(nos.coracao_WIP.extras.orcamento_60k, false);
  for (const nome of [
    "ventriculo_esquerdo", "valva_mitral", "cuspide_anterior_mitral",
    "auricula_esquerda", "no_sinusal", "parede_externa_ve",
  ]) {
    assert.ok(nos[nome], `falta nó ${nome}`);
  }
  assert.equal(nos.auricula_esquerda.mesh, undefined);
  assert.equal(nos.no_sinusal.mesh, undefined);
  assert.equal(nos.parede_externa_ve.mesh, undefined);
  assert.ok(nos.cuspide_anterior_mitral.mesh !== undefined);
  /* cada primitiva com malha aponta a um FJ — nenhuma geometria inventada */
  for (const mesh of gltf.meshes) {
    for (const pr of mesh.primitives) {
      assert.ok(/^FJ\d+$/.test(pr.extras.fj), `${mesh.name} sem FJ`);
      assert.ok(pr.extras.fonte.includes("BodyParts3D"));
    }
  }
  const meta = JSON.parse(await texto("bancadas/11-coracao/export/coracao-bancada11-WIP.json"));
  assert.equal(meta.wip, true);
  assert.equal(meta.orcamento_60k, false);
});

test("a bancada 11 ao vivo não foi trocada pelo glb WIP", async () => {
  const hub = await texto("bancadas.html");
  assert.ok(hub.includes('href="coracao/"'));
  assert.ok(!hub.includes("coracao-bancada11-WIP.glb"));
  const page = await texto("coracao/index.html");
  assert.ok(!page.includes("coracao-bancada11-WIP.glb"));
});
