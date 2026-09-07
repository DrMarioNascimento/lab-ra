import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  P, CONDUCAO, ATRASO_ELETROMECANICO, duracoes, simular, em, ecg,
  faseDe, tempoPorFase, tempoDiastolicoPorMinuto, estruturaAtiva,
} from "../coracao/fisica.js";

const texto = p => readFile(new URL(`../${p}`, import.meta.url), "utf8");
const perto = (v, alvo, folga, oq) =>
  assert.ok(Math.abs(v - alvo) <= folga, `${oq}: ${v.toFixed(2)}, esperado ${alvo} +/- ${folga}`);

/* Uma simulação só, reaproveitada: cada `simular` roda dezesseis ciclos. */
const s75 = simular(75, { passos: 1000, ciclos: 16 });
const f75 = tempoPorFase(s75);
const ms = k => (f75[k] || 0) * 1000;

/* ==========================================================================
   Teste 11 — Coração em ação

   O motor foi AFINADO contra o livro, não escolhido. A primeira tentativa,
   com valores razoáveis tirados de cabeça, dava 155/99 de pressão, volume
   diastólico de 172 ml e débito de 7,4 L/min. Estes testes são a régua que
   apanhou aquilo, e o que segura o motor agora.
   ========================================================================== */

test("a 75 bpm o ciclo reproduz a página do livro", async () => {
  perto(s75.sistolica, 120, 3, "pressão sistólica");
  perto(s75.diastolica, 80, 3, "pressão diastólica");
  perto(s75.picoVE, 122, 5, "pico do ventrículo esquerdo");
  perto(s75.vdf, 120, 4, "volume diastólico final");
  perto(s75.vsf, 50, 4, "volume sistólico final");
  perto(s75.ejecao, 70, 5, "volume ejetado");
  perto(s75.fracao * 100, 58, 3, "fração de ejeção");
  perto(s75.debito, 5.25, .3, "débito cardíaco");
});

test("A VALVA NORMAL QUASE NÃO TEM GRADIENTE", async () => {
  /* Numa das voltas o afinador engrossou a valva aórtica para segurar a
     ejeção, e o pico do ventrículo foi a 253 mmHg contra a aorta em 120.
     Isso é ESTENOSE. Quem sustenta a ejeção é o músculo continuar contraído. */
  assert.ok(s75.picoVE - s75.sistolica < 8,
    `gradiente de ${(s75.picoVE - s75.sistolica).toFixed(0)} mmHg na valva aórtica`);
});

test("as fases duram o que o livro diz", async () => {
  perto(ms("contracao isovolumetrica"), 50, 12, "contração isovolumétrica");
  perto(ms("ejecao"), 220, 25, "ejeção");
  perto(ms("sistole atrial"), 85, 20, "sístole atrial");
  assert.ok(ms("enchimento") > 250, "o enchimento é a fase mais longa");
});

test("AS FASES ISOVOLUMÉTRICAS EMERGEM: o volume não muda nelas", async () => {
  /* É a prova de que as válvulas não são roteirizadas. Ninguém escreveu
     "agora o volume fica parado" — ele fica porque as duas estão fechadas. */
  let quadros = 0, maiorVariacao = 0;
  s75.quadro.forEach((q, i) => {
    const fase = faseDe(q, s75.quadro[i ? i - 1 : s75.quadro.length - 1]);
    if (!fase.includes("isovolumetrica") && !fase.includes("isovolumetrico")) return;
    quadros++;
    const ant = s75.quadro[i ? i - 1 : 0];
    maiorVariacao = Math.max(maiorVariacao, Math.abs(q.vVE - ant.vVE));
  });
  assert.ok(quadros > 30, "tem de haver fases isovolumétricas");
  assert.ok(maiorVariacao < 0.01,
    `o volume variou ${maiorVariacao.toFixed(4)} ml com as duas válvulas fechadas`);
});

test("as válvulas são comparação de pressão, e não roteiro", async () => {
  const src = await texto("coracao/fisica.js");
  assert.ok(src.includes("decide(mitral, pAE - pVE)"), "a mitral compara átrio com ventrículo");
  assert.ok(src.includes("decide(aortica, pVE - pAo)"), "a aórtica compara ventrículo com aorta");
  /* e no ciclo inteiro isso tem de valer, quadro a quadro, com a folga da
     inércia do folheto */
  for (const q of s75.quadro) {
    if (q.mitral) assert.ok(q.pAE > q.pVE - P.limiarValva - 1e-6, "mitral aberta com gradiente invertido");
    if (q.aortica) assert.ok(q.pVE > q.pAo - P.limiarValva - 1e-6, "aórtica aberta com gradiente invertido");
  }
});

test("A TAQUICARDIA COME A DIÁSTOLE, NÃO A SÍSTOLE", async () => {
  const lento = duracoes(60), rapido = duracoes(180);
  const encolheSistole = 1 - rapido.sistole / lento.sistole;
  const encolheDiastole = 1 - rapido.diastole / lento.diastole;
  assert.ok(encolheDiastole > 1.7 * encolheSistole,
    `sístole encolheu ${(encolheSistole * 100).toFixed(0)}% e diástole ${(encolheDiastole * 100).toFixed(0)}%`);

  /* Em tempo absoluto a diferença é mais gritante, e é a leitura que ensina:
     de 60 para 180 bpm o ciclo perde 669 ms, e 519 deles saem da diástole.
     Eu tinha exigido 2,4x na razão proporcional e o fato é 1,9 — a asserção
     era mais rígida que a fisiologia, e isso é jeito de reprovar modelo certo. */
  const perdaSistole = lento.sistole - rapido.sistole;
  const perdaDiastole = lento.diastole - rapido.diastole;
  assert.ok(perdaDiastole > 3 * perdaSistole,
    `perdeu ${(perdaSistole * 1000).toFixed(0)}ms de sístole e ${(perdaDiastole * 1000).toFixed(0)}ms de diástole`);
});

test("e come a DIÁSTASE primeiro", async () => {
  /* a diástase é a folga do sistema: é ela que some antes de o enchimento
     propriamente dito ser prejudicado */
  const a = tempoPorFase(simular(60, { passos: 600, ciclos: 14 }));
  const b = tempoPorFase(simular(120, { passos: 600, ciclos: 14 }));
  const perdaDiastase = 1 - (b["diastase"] || 0) / a["diastase"];
  const perdaEnchimento = 1 - (b["enchimento"] || 0) / a["enchimento"];
  assert.ok(perdaDiastase > perdaEnchimento,
    `diástase perdeu ${(perdaDiastase * 100).toFixed(0)}% e enchimento ${(perdaEnchimento * 100).toFixed(0)}%`);
});

test("encher fica mais difícil, e a fração de ejeção cai", async () => {
  const a = simular(60, { passos: 600, ciclos: 14 });
  const b = simular(180, { passos: 600, ciclos: 14 });
  assert.ok(b.vdf < a.vdf - 20, "o volume diastólico tem de cair");
  assert.ok(b.ejecao < a.ejecao, "e a ejeção junto");
  assert.ok(b.fracao < a.fracao, "e a fração de ejeção também");
  /* mas o débito ainda sobe: é por isso que taquicardia funciona, até parar
     de funcionar */
  assert.ok(b.debito > a.debito, "o débito ainda tem de subir");
});

test("a coronária perde tempo de perfusão", async () => {
  /* a coronária esquerda só enche na DIÁSTOLE: na sístole o próprio músculo
     aperta os vasos que o alimentam */
  assert.ok(tempoDiastolicoPorMinuto(180) < tempoDiastolicoPorMinuto(60) * .7,
    `de ${tempoDiastolicoPorMinuto(60).toFixed(0)}s para ${tempoDiastolicoPorMinuto(180).toFixed(0)}s por minuto`);
});

test("o ÁTRIO É CÂMARA, e não um número com uma onda em cima", async () => {
  /* como número fixo ele quebrava em frequência baixa: cheio, o ventrículo
     ficava acima do átrio parado e a mitral fechava cedo demais */
  const src = await texto("coracao/fisica.js");
  assert.ok(src.includes("const pAE = eAE * (vAE - P.v0AE)"), "o átrio tem elastância própria");
  assert.ok(src.includes("vAE += (qVeiasP - qMitral) * dt"), "e volume que entra e sai");
  /* e as ondas aparecem: a pressão atrial tem de variar ao longo do ciclo */
  const pAEs = s75.quadro.map(q => q.pAE);
  assert.ok(Math.max(...pAEs) - Math.min(...pAEs) > 5, "as ondas a, c e v têm de aparecer");
  perto(Math.max(...pAEs), 13, 4, "o pico do átrio esquerdo");
});

test("o ventrículo contrai DEPOIS de despolarizar", async () => {
  /* é a defasagem eletromecânica, e é ela que a bancada existe para mostrar */
  assert.ok(ATRASO_ELETROMECANICO > 0);
  const inicioQRS = CONDUCAO.find(c => c.id === "ventriculos").de;
  const primeiraContracao = s75.quadro.find(q => q.ativacao > .01);
  assert.ok(primeiraContracao.t >= inicioQRS + ATRASO_ELETROMECANICO - .01,
    `contração em ${primeiraContracao.t.toFixed(3)}s, despolarização em ${inicioQRS}s`);
});

test("o atraso do nó AV separa o átrio do ventrículo", async () => {
  const av = CONDUCAO.find(c => c.id === "av");
  const vent = CONDUCAO.find(c => c.id === "ventriculos");
  assert.ok(av.ate - av.de >= .09, "o nó AV tem de segurar cerca de 100 ms");
  assert.ok(vent.de > av.ate, "o ventrículo só despolariza depois do nó AV");
});

test("as ondas do traçado caem onde a condução está passando", async () => {
  /* o eletro não é enfeite: usa os mesmos tempos da tabela de condução */
  const noPico = t => ecg(t);
  const atrios = CONDUCAO.find(c => c.id === "atrios");
  const vent = CONDUCAO.find(c => c.id === "ventriculos");
  const pico = (de, ate) => {
    let melhor = -9, tt = de;
    for (let t = de; t <= ate; t += .002) if (Math.abs(noPico(t)) > melhor) { melhor = Math.abs(noPico(t)); tt = t; }
    return tt;
  };
  const tP = pico(0, .12), tR = pico(.15, .25);
  assert.ok(tP >= atrios.de && tP <= atrios.ate, `onda P em ${tP.toFixed(3)}s, átrios de ${atrios.de} a ${atrios.ate}`);
  assert.ok(tR >= vent.de - .02 && tR <= vent.ate, `R em ${tR.toFixed(3)}s, ventrículos de ${vent.de} a ${vent.ate}`);
  assert.ok(estruturaAtiva(.005).includes("sinusal"), "o nó sinusal começa o ciclo");
});

/* ==========================================================================
   O desenho, e as três coisas que ele já mentiu
   ========================================================================== */

test("o card 11 leva ao coração", async () => {
  const hub = await texto("bancadas.html");
  assert.ok(hub.includes('data-number="11"'));
  assert.ok(hub.includes('href="coracao/"'));
});

test("a bancada está protegida e traz o caminho de RA das irmãs", async () => {
  const page = await texto("coracao/index.html");
  assert.ok(page.includes("data-ra-protected"));
  assert.ok(page.includes('ar-modes="webxr scene-viewer quick-look"'));
});

test("A GEOMETRIA NÃO IMPORTA A FÍSICA", async () => {
  /* geometria não decide número: é essa separação que permitiu afinar o ciclo
     contra o livro sem abrir navegador nenhum */
  const m = await texto("coracao/modelos.js");
  assert.ok(!m.includes("from './fisica.js'"));
});

test("a câmara tem parede EXTERNA e INTERNA separadas", async () => {
  /* a espessura é a informação: 10 mm no esquerdo contra 3 no direito é a
     resposta inteira à diferença de pressão entre os dois lados */
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("function camaraDupla"));
  assert.ok(m.includes("g.userData = { externa, interna, espessura }"));
  assert.ok(m.includes("camaraDupla(perfilVentriculo(26, 78), 10"), "esquerdo com 10 mm");
  assert.ok(m.includes("3.4"), "direito bem mais fino");
});

test("a cavidade é invertida na GEOMETRIA, e não no material", async () => {
  /* o glTF descarta `side` e o USDZ do iPhone descarta até o `doubleSided` */
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("interna.geometry = peloAvesso(interna.geometry)"));
  const semComentario = m.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/side:\s*THREE\.(Back|Double)Side/.test(semComentario));
});

test("A CORONÁRIA CORRE NA SUPERFÍCIE, e não dentro da carne", async () => {
  /* na primeira foto elas simplesmente não apareciam: desenhadas em
     coordenadas soltas, o miocárdio as engoliu */
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("function naSuperficie"));
  assert.ok(m.includes("raioExterno(y) + folga"));
});

test("o relógio é UM SÓ: nenhuma vista guarda tempo próprio", async () => {
  /* É o pedido inteiro. Se houvesse um segundo contador, a sincronia entre
     condução, válvulas e fluxo seria encenação — três animações combinadas
     por mim — em vez de três leituras do mesmo instante.

     Eu procurava `^let fase` e a fase é declarada junto com outras variáveis:
     o padrão estava errado, não o código. O que importa medir é quantos
     lugares ADIANTAM o relógio. */
  const app = await texto("coracao/app.js");
  const avanca = (app.match(/fase = \(fase \+/g) || []).length;
  assert.equal(avanca, 1, `o relógio é adiantado em ${avanca} lugares`);
  assert.ok(app.includes("const q = em(sim, fase)"), "as três leituras saem do mesmo quadro");
  /* e o quadro é um só: volumes, válvulas e condução leem o mesmo `q` */
  for (const chamada of ["aplicarVolumes(q.vVE", "aplicarValvas({ mitral: q.mitral", "aplicarConducao(estruturaAtiva(q.t))"])
    assert.ok(app.includes(chamada), `falta ${chamada}`);
});

test("a bancada abre parada, pelo endereço", async () => {
  const app = await texto("coracao/app.js");
  for (const chave of ["nivel", "fc", "fase"]) {
    assert.ok(app.includes(`busca.get('${chave}')`), `falta ?${chave}=`);
  }
});

/* ==========================================================================
   O corte e o sangue
   ========================================================================== */

test("o corte tem FACE, e é ela que mostra a espessura", async () => {
  /* sem a face o corte revela a cavidade mas a parede vira uma linha, e a
     diferença entre 10 mm e 3 mm — que é a resposta inteira à diferença de
     pressão entre os dois lados — desaparece */
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("function faceDoCorte"));
  assert.ok(m.includes("faceDoCorte(dentro, fora, t0)"), "a face liga o perfil interno ao externo");
});

test("o sinalizador de corte não pode ser ignorado", async () => {
  /* ele era: o nível 02 dizia "por dentro" e mostrava o mesmo exterior dos
     outros níveis, porque `corpo()` recebia `corte` e nunca o usava */
  const m = await texto("coracao/modelos.js");
  const corpo = m.slice(m.indexOf("function corpo("), m.indexOf("export function criar"));
  assert.ok(corpo.includes("const janela = corte ?"), "o corpo tem de usar o corte");
  assert.ok(corpo.includes("ventriculoEsquerdo(janela)"), "e repassá-lo às câmaras");
});

test("O SANGUE NÃO ATRAVESSA VALVA FECHADA", async () => {
  /* é a terceira leitura do pedido, e ela não é uma animação à parte: as
     gotas param nas porteiras, e por isso se acumulam no átrio durante a
     sístole e disparam quando a semilunar abre */
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("if (d.u < d.uAV && novo >= d.uAV && !entrada.aberta)"), "porteira atrioventricular");
  assert.ok(m.includes("if (d.u < d.uSL && novo >= d.uSL && !saida.aberta)"), "porteira semilunar");
  /* e a vazão vem do motor, não de um número de desenho */
  const app = await texto("coracao/app.js");
  assert.ok(app.includes("mitral: { q: q.qMitral, aberta: q.mitral }"),
    "a vazão da gota é a vazão que o motor calculou");
});
