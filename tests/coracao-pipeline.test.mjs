import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";

const texto = p => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const bin = p => readFile(new URL(`../${p}`, import.meta.url));

/* o glb do WIP, lido uma vez por teste — helper para as regras de baixo */
async function lerGlb() {
  const buf = await bin("bancadas/11-coracao/export/coracao-bancada11-WIP.glb");
  return { gltf: glbJson(buf) };
}

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

test("A PEÇA ANATÔMICA ESTÁ VESTIDA DE BANCADA, e trancada como as irmãs", async () => {
  /* Ela nasceu protótipo, aberta no navegador por caminho de arquivo, e um dia
     virou destino de link do portal — sem tranca, sem marca e sem saída. Era a
     ÚNICA porta do laboratório que se abria sem conta.

     A tranca funciona a três pastas de fundura porque o `guard.js` resolve
     `authUrl` e `bancadasUrl` a partir do endereço do PRÓPRIO script, e não do
     da página. Conferido no navegador: sem a chave de sessão, a página devolve
     para `index.html?laboratorio=acesso&destino=<ela mesma>` — com o destino
     preservado, que é o que faz o aluno voltar À PEÇA depois de entrar, e não
     ao índice. */
  const peca = await texto("bancadas/11-coracao/prototipo/duas-pecas.html");

  assert.ok(/<html[^>]*data-ra-protected/.test(peca), "sem o sinalizador a tranca nem roda");
  assert.ok(peca.includes('src="../../../guard.js"'), "três níveis: prototipo, 11-coracao, bancadas");
  assert.ok(peca.includes('href="../../../laboratorio.css"'), "a folha do laboratório veste a barra");

  /* saída: quem entra tem de conseguir voltar sem o botão do navegador */
  assert.ok(peca.includes('class="back-link" href="../../../bancadas.html"'), "falta o Voltar");
  assert.ok(peca.includes('class="brand" href="../../../bancadas.html"'), "falta a marca que leva ao portal");
  assert.ok(peca.includes("brand/mestre-lap.webp"), "falta a assinatura no rodapé");

  /* A FOLHA DO LABORATÓRIO TEM DE VIR ANTES DA DA PÁGINA. Invertidas, o
     `body` e o `h1` do laboratório ganhariam por ordem, e o palco escuro desta
     bancada viraria o fundo do portal com um título em Cinzel a 4rem. */
  assert.ok(peca.indexOf("laboratorio.css") < peca.indexOf("<style>"),
    "a folha do laboratório tem de vir ANTES do <style> da página");

  /* e o título continua dizendo que é obra */
  assert.ok(peca.includes("em construção"), "a página não pode se anunciar pronta");
});

test("a bancada 11 ao vivo não foi trocada pelo glb WIP", async () => {
  const hub = await texto("bancadas.html");
  assert.ok(hub.includes('href="coracao/"'));
  assert.ok(!hub.includes("coracao-bancada11-WIP.glb"));
  const page = await texto("coracao/index.html");
  assert.ok(!page.includes("coracao-bancada11-WIP.glb"));
});

/* ══════════════════════════════════════════════════════════════════════════
   O QUE FICOU DECIDIDO OLHANDO A TELA, e que não pode voltar sozinho.

   Estas três regras não vêm de anatomia nem de livro: vieram de horas de
   professor olhando o modelo e dizendo o que atrapalhava. É justamente o
   tipo de decisão que ninguém recupera lendo o código depois — por isso
   fica travada aqui.
   ══════════════════════════════════════════════════════════════════════════ */

test("O MODELO NÃO ESTÁ ESPELHADO: o ventrículo direito é a câmara ANTERIOR", async () => {
  /* `transformar()` trocava dois eixos SEM inverter sinal — determinante -1,
     sistema canhoto. O VD aparecia ATRÁS do esquerdo quando é ele que encosta
     no esterno. Um sinal de menos conserta; este teste impede que volte. */
  const { gltf } = await lerGlb();
  const centroZ = nome => {
    const no = gltf.nodes.find(n => n.name === nome);
    assert.ok(no && no.mesh !== undefined, `falta ${nome}`);
    let mn = Infinity, mx = -Infinity;
    for (const pr of gltf.meshes[no.mesh].primitives) {
      const a = gltf.accessors[pr.attributes.POSITION];
      mn = Math.min(mn, a.min[2]); mx = Math.max(mx, a.max[2]);
    }
    return (mn + mx) / 2;
  };
  const vd = centroZ("parede_ad"), ve = centroZ("parede_ae");
  assert.ok(vd > ve,
    `o lado direito (z ${vd.toFixed(1)}) tem de estar À FRENTE do esquerdo (z ${ve.toFixed(1)})`);
});

test("AS PEÇAS QUE SAÍRAM CONTINUAM FORA", async () => {
  /* Decidido na tela: os tubos venosos e as veias pulmonares saltavam do
     modelo e dobravam a largura; o arco aórtico sai no ENCAIXE, que é a
     junção com a aorta ascendente — e ele não podia ser aparado por altura,
     porque corre na horizontal e o corte o fatiava no comprimento.
     As cavidades são o molde do SANGUE, não a câmara. */
  const { gltf } = await lerGlb();
  const comMalha = new Set(gltf.nodes.filter(n => n.mesh !== undefined).map(n => n.name));
  for (const fora of [
    "tronco_pulmonar", "veia_cava_superior", "veia_cava_inferior", "arco_aortico",
    "cavidade_ve", "cavidade_vd", "cavidade_ae", "cavidade_ad",
    "veia_pulmonar_superior_direita", "veia_pulmonar_inferior_direita",
    "veia_pulmonar_superior_esquerda", "veia_pulmonar_inferior_esquerda",
    /* a aorta ascendente saiu por último, e por um motivo que se vê: as três
       cúspides aórticas vivem entre y 49 e 71, DENTRO da faixa do tubo
       (50 a 98). A aorta era exatamente o que as tapava. */
    "aorta_ascendente",
  ]) assert.ok(!comMalha.has(fora), `${fora} voltou para a cena`);

  /* E O QUE ELA DESTAPOU TEM DE CONTINUAR À VISTA. Esta é a razão de a aorta
     ter saído; se as cúspides sumirem, o corte perdeu o sentido. */
  for (const c of ["cuspide_anterior_aortica", "cuspide_posterior_direita_aortica",
                   "cuspide_posterior_esquerda_aortica"])
    assert.ok(comMalha.has(c), `${c} sumiu — a valva aórtica é o que a aorta destapava`);
});

test("REMOVER POR NOME NÃO PODE VAZAR PELO CÓDIGO DO ARQUIVO", async () => {
  /* O defeito que quase passou: o laço principal pulava a peça mas não
     marcava os FJ dela como usados, e o laço dos órfãos readicionava os
     MESMOS arquivos com nome de FJ####. A contagem de triângulos não mudava
     um dígito. Por isso a régua é o TOTAL de malhas, e não a ausência de
     nomes: o vazamento reentra com outro nome, mas não consegue esconder o
     tamanho. */
  const { gltf } = await lerGlb();
  const n = gltf.nodes.filter(x => x.mesh !== undefined).length;
  assert.equal(n, 79, `o modelo fechou em 79 malhas; hoje tem ${n}`);
});

/* ── A PEÇA ESTÁ CONGELADA EM COMPONENTES (07/09/2026) ───────────────────
   Decisão do professor, dita assim: *"a peça também não vai acrescentar e nem
   tirar nada além da legenda, fica fixa em componentes"*.

   Isto FECHA um assunto que estava aberto e que eu reabri três vezes: o vazio
   do ápice. A peça não tem parede ventricular esquerda na ponta — abaixo de
   y≈4 só existe coronária, porque `parede_ae` para em y=15 e o `miocardio_ve`
   tem 780 triângulos. A saída que eu propunha era trazer de volta a
   `cavidade_ve`, o molde do sangue, pintada como músculo. Está DESCARTADA.

   O que pode mudar daqui para a frente: cor, material, movimento, legenda,
   decimação. O que NÃO pode: quais peças estão dentro. Se um dia a decimação
   precisar fundir malhas, este teste vai cair — e cair é o comportamento
   certo, porque fundir malha é mexer em componente e exige decisão de quem
   ensina, não do script. */
test("a composição está congelada: nem entra nem sai peça", async () => {
  const { gltf } = await lerGlb();
  const nomes = gltf.nodes.filter(x => x.mesh !== undefined).map(x => x.name).sort();
  /* as três paredes e o remanescente do miocárdio continuam dentro, mesmo sem
     legenda — não ter rótulo não é o mesmo que não estar na peça */
  for (const obrigatoria of ['parede_ae', 'parede_ad', 'miocardio_ve']) {
    assert.ok(nomes.includes(obrigatoria), `${obrigatoria} saiu da peça`);
  }
  /* e o molde do sangue continua FORA: foi apagado de propósito, e a decisão
     de não o trazer de volta é do professor */
  for (const proibida of ['cavidade_ve', 'cavidade_vd', 'cavidade_ae', 'cavidade_ad']) {
    assert.ok(!nomes.includes(proibida), `${proibida} voltou; ela foi apagada de propósito`);
  }
  assert.equal(new Set(nomes).size, nomes.length, 'nenhum nome de malha repetido');
});

/* ── OS PROTÓTIPOS TÊM DE ACHAR O MODELO ────────────────────────────────
   Cinco páginas foram commitadas pedindo `modelos/B-bodyparts3d.glb`, um
   diretório que só existia na máquina de quem escreveu. Elas nasceram
   quebradas e ninguém percebeu, porque quem abria já tinha o arquivo ao
   lado. A régua aqui não é "o texto está bonito": é que o caminho que a
   página carrega EXISTE no repositório. */
test("os protótipos da bancada 11 carregam modelos que existem no repositório", async () => {
  const dir = new URL("../bancadas/11-coracao/prototipo/", import.meta.url);
  const paginas = (await readdir(dir)).filter(f => f.endsWith(".html"));
  assert.ok(paginas.length >= 6, "as páginas de diagnóstico continuam lá");

  for (const nome of paginas) {
    const html = await readFile(new URL(nome, dir), "utf8");
    assert.ok(!html.includes("'modelos/"),
      `${nome} ainda pede o diretório fantasma 'modelos/'`);
    for (const m of html.matchAll(/'(\.\.[^']*\.glb)'/g)) {
      await assert.doesNotReject(
        readFile(new URL(m[1], dir)),
        `${nome} carrega ${m[1]}, que não existe no repositório`);
    }
  }
});

/* ── A CC BY PEDE CRÉDITO ONDE A PEÇA APARECE ───────────────────────────
   O scan é *Realistic Human Heart*, de neshallads, sob CC BY 4.0 — licença
   que permite redistribuir e modificar, e EXIGE atribuição e indicação das
   alterações. Antes de saber disso, o arquivo ficava fora do repositório e o
   código dizia "licença desconhecida" em quatro páginas. Sabendo, a regra
   inverte: o arquivo entra, e o que passa a ser obrigatório é o CRÉDITO na
   página, porque atribuição escondida num arquivo que ninguém abre não é
   atribuição.

   O teste é por PÁGINA e não pelo ATTRIBUTION.md, de propósito: o arquivo de
   créditos nunca vai faltar, quem falta é o crédito na tela. */
test("toda página que mostra o scan traz o crédito da CC BY na própria tela", async () => {
  const dir = new URL("../bancadas/11-coracao/prototipo/", import.meta.url);
  const paginas = (await readdir(dir)).filter(f => f.endsWith(".html"));
  let mostram = 0;
  for (const nome of paginas) {
    const html = await readFile(new URL(nome, dir), "utf8");
    if (!html.includes("fontes/scan/")) continue;
    mostram++;
    /* o crédito tem de estar no CORPO, visível — não só em comentário */
    const corpo = html.slice(html.indexOf("<body"));
    assert.match(corpo, /neshallads/, `${nome} não nomeia o autor na tela`);
    assert.match(corpo, /CC BY 4\.0/, `${nome} não nomeia a licença na tela`);
    assert.match(corpo, /creativecommons\.org\/licenses\/by\/4\.0/,
      `${nome} não traz o link da licença`);
    assert.match(corpo, /[Aa]lteraç(ões|oes)/,
      `${nome} não indica que houve alterações, que a CC BY exige`);
  }
  assert.ok(mostram >= 3, "as páginas que mostram o scan continuam lá");

  const attr = await texto("bancadas/11-coracao/ATTRIBUTION.md");
  assert.match(attr, /neshallads/);
  assert.match(attr, /CC BY 4\.0/);
  assert.match(attr, /escala/, "as alterações estão descritas, não só citadas");
  assert.match(attr, /materiais/);
  assert.match(attr, /anima/);
});

test("o scan está versionado, agora que a licença permite", async () => {
  const glb = await bin("bancadas/11-coracao/fontes/scan/A-scan-realista.glb");
  assert.equal(glb.toString("ascii", 0, 4), "glTF", "é um glb de verdade");
  const ignore = await texto("bancadas/11-coracao/.gitignore");
  assert.ok(!/fontes\/scan\//.test(ignore),
    "o .gitignore não pode mais excluir o scan: a CC BY permite redistribuir");
});

/* ── CAMINHO ABSOLUTO MENTE QUANDO A RAIZ MUDA ──────────────────────────
   As páginas importavam `/coracao/fisica.js`. No servidor de conferência a
   raiz é `lab-ra/`, então funcionava; no GitHub Pages a raiz é o domínio, e
   o mesmo caminho vira `drmarionascimento.github.io/coracao/...` — 404. A
   página subiu, abriu, mostrou o título e ficou MUDA: o módulo nunca rodou.

   É a segunda vez no mesmo dia que um caminho só quebra depois de publicado.
   A primeira foi `modelos/B-bodyparts3d.glb`, um diretório que só existia na
   máquina de quem escreveu. Os dois passam em qualquer conferência local, e é
   por isso que a regra tem de ser mecânica: import de página que vive num
   subdiretório é RELATIVO, e o alvo tem de existir a partir dali. */
test("os protótipos importam por caminho relativo, que sobrevive à publicação", async () => {
  const dir = new URL("../bancadas/11-coracao/prototipo/", import.meta.url);
  const paginas = (await readdir(dir)).filter(f => f.endsWith(".html"));
  for (const nome of paginas) {
    const html = await readFile(new URL(nome, dir), "utf8");
    for (const m of html.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const alvo = m[1];
      if (/^(three|https?:)/.test(alvo)) continue;      // CDN e importmap
      assert.ok(!alvo.startsWith("/"),
        `${nome} importa ${alvo} com barra na frente: quebra no Pages`);
      await assert.doesNotReject(readFile(new URL(alvo, dir)),
        `${nome} importa ${alvo}, que não existe a partir dali`);
    }
  }
});

/* ── SEM VIEWPORT O TELEFONE MENTE A LARGURA ────────────────────────────
   Nenhuma das seis páginas de protótipo declarava `viewport`. Sem essa
   linha o navegador do celular finge ter 980 px e encolhe a página inteira:
   a regra `@media (max-width: 900px)` NUNCA dispara, o painel continua com
   rolagem própria, o texto sai ilegível e sobra um vazio embaixo.

   O engano é cruel porque no computador está tudo certo, e no emulador de
   telefone também parece "só pequeno" — não parece defeito, parece zoom. As
   bancadas de verdade sempre tiveram a linha; eu escrevi os protótipos do
   zero e não copiei.

   É a terceira armadilha do mesmo feitio num dia: o caminho `modelos/` que
   só existia na minha máquina, o import com barra que só quebra publicado, e
   agora a largura que só mente no telefone. Todas passam em conferência
   local. Por isso viram teste, e não anotação. */
test("toda página de protótipo declara viewport, senão o telefone finge 980 px", async () => {
  const dir = new URL("../bancadas/11-coracao/prototipo/", import.meta.url);
  const paginas = (await readdir(dir)).filter(f => f.endsWith(".html"));
  for (const nome of paginas) {
    const html = await readFile(new URL(nome, dir), "utf8");
    assert.match(html, /<meta\s+name="viewport"[^>]*width=device-width/,
      `${nome} não declara viewport: no celular ela renderiza como se tivesse 980 px`);
  }
});
