import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  P, CONDUCAO, ATRASO_ELETROMECANICO, duracoes, simular, em, ecg,
  faseDe, tempoPorFase, tempoDiastolicoPorMinuto, estruturaAtiva,
  faseDeSnapshotRA, bulhas,
} from "../coracao/fisica.js";
import {
  NIVEIS, nivelRevelaValvas, PLANO_VALVAR, TOPO_VE, TOPO_VD,
  TOLERANCIA_JUNCAO_MM, SUBIR_PLANO, VENTRICULO_DA_VALVA,
  ALTURA_VE, ALTURA_VD,
} from "../coracao/niveis.js";
import { provaSelosDaParede } from "../coracao/parede.js";

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
  assert.ok(ms("enchimento") + ms("diastase") > 250,
    "o enchimento (com a diástase) é a fase mais longa");
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
  assert.ok(src.includes("decideAV(mitral, pAE - pVE, aVent)"), "a mitral compara átrio com ventrículo");
  assert.ok(src.includes("decide(aortica, pVE - pAo)"), "a aórtica compara ventrículo com aorta");
  /* e no ciclo inteiro isso tem de valer, quadro a quadro, com a folga da
     inércia do folheto. Durante o relaxamento atrial a AV pode ficar aberta
     com gradiente invertido miúdo — é a histerese que impede o B1 falso. */
  for (const q of s75.quadro) {
    if (q.mitral && q.ativacao > 0)
      assert.ok(q.pAE > q.pVE - P.limiarValva - 1e-6, "mitral aberta com gradiente invertido na sístole");
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

test("o botão grande do card 11 entrega o que o card promete", async () => {
  /* O card anuncia as três leituras no mesmo relógio, o diagrama de Wiggers e
     a frequência ao vivo. Houve um dia em que o botão principal passou a
     abrir o protótipo da peça anatômica, que não tem nada disso — e o card
     virou promessa falsa, com a letra miúda embaixo confessando a troca. Não
     basta o link existir na página: o que o BOTÃO GRANDE abre tem de cumprir
     o que o PARÁGRAFO diz. */
  const hub = await texto("bancadas.html");
  assert.ok(hub.includes('data-number="11"'));

  const card = hub.split('data-number="11"')[1].split("</article>")[0];
  const primario = card.split('class="launch" href="')[1].split('"')[0];
  assert.equal(primario, "coracao/",
    "o botão grande abre a bancada do ciclo, não um protótipo");

  const bancada = await texto(primario + "index.html");
  for (const promessa of ["Wiggers", "bulha", "traçado"]) {
    assert.ok(bancada.includes(promessa),
      `o card promete ${promessa} e a página que ele abre não tem`);
  }

  /* a peça anatômica continua alcançável — e dizendo que está em obra */
  assert.ok(card.includes("bancadas/11-coracao/prototipo/duas-pecas.html"),
    "o caminho para a peça anatômica não pode sumir do card");
  assert.ok(card.includes("em construção"),
    "o link da peça não pode se anunciar como bancada pronta");
});

test("a bancada está protegida e traz o caminho de RA das irmãs", async () => {
  const page = await texto("coracao/index.html");
  assert.ok(page.includes("data-ra-protected"));
  assert.ok(page.includes('ar-modes="webxr scene-viewer quick-look"'));
  assert.ok(!page.includes("Onde a gravidade aperta?"),
    "o título padrão não é o da bancada da ortostase");
  assert.ok(page.includes("O que acontece entre duas batidas?"));
  assert.ok(page.includes('id="lentoValor">0.35×'),
    "o rótulo da câmera lenta nasce igual ao value do input");
  assert.ok(!/id="stage"[^>]*role="img"/.test(page),
    "role=img no #stage esconde o Recentrar do leitor de tela");
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
  assert.ok(m.includes("camaraDupla(perfilVentriculo(26, ALTURA_VE), 10"), "esquerdo com 10 mm");
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

/* ==========================================================================
   O que a revisão encontrou — e que não pode regressar em silêncio
   ========================================================================== */

test("o nível chamado 'As válvulas' de fato revela as válvulas", async () => {
  /* nome ↔ o que a cena constrói. O nível 03 já se chamava "As válvulas" e
     montava o coração opaco inteiro: cúspides no meio do cone, engolidas
     pelo miocárdio. Se o rótulo promete válvulas, a config tem de cortar /
     tornar o músculo transparente / enquadrar o plano valvar. */
  const i = NIVEIS.findIndex(n => /v[áa]lvulas/i.test(n.rotulo));
  assert.ok(i >= 0, "existe um nível cujo nome fala de válvulas");
  assert.equal(i, 2, "é o nível 03 (índice 2)");
  assert.notEqual(NIVEIS[i].comValvas, false, "as valvas estão na cena");
  assert.ok(nivelRevelaValvas(i), "a config expõe as valvas, não só as nomeia");
  assert.ok(NIVEIS[i].corte, "o corte abre a cunha até o plano valvar");
  assert.ok(NIVEIS[i].revelarValvas, "o miocárdio não pode ficar opaco por cima");
  assert.ok(NIVEIS[i].vidrarGrandesVasos,
    "aorta e tronco pulmonar entram no vidro — opacos, tapam as cúspides");
  assert.equal(NIVEIS[i].foco, "valvas", "a câmera enquadra o plano valvar");

  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("NIVEIS.map"), "criar() monta a cena a partir da tabela");
  assert.ok(m.includes("revelarValvas: n.revelarValvas"), "e passa o revelar");
  assert.ok(m.includes("vidrarGrandesVasos: n.vidrarGrandesVasos"),
    "e passa o vidro dos grandes vasos");
  assert.ok(m.includes("vidrar(vasos"),
    "os grandes vasos estão no conjunto translúcido daquele nível");
  assert.ok(m.includes("o.material = o.material.clone()"),
    "vidrar clona o material — o vidro não vaza para os outros níveis");
  const app = await texto("coracao/app.js");
  assert.ok(app.includes("foco === 'valvas'") || app.includes('foco === "valvas"'),
    "enquadrar() trata o foco das válvulas");
  assert.ok(app.includes("alvoDaCamera"), "a câmera deixa de apontar sempre à origem");
});

test("o nível do corte olha a face de FRENTE, e não de perfil", async () => {
  /* A face do corte SEMPRE esteve desenhada: pintada de verde numa cópia
     descartável, ela aparece como faixa larga e sólida. O que a escondia era
     o ângulo — em +13° de azimute a câmera olhava quase dentro do plano do
     cunho, e uma superfície vista de perfil vira linha. Os 10 mm contra 3,4,
     que são a lição inteira do nível, encolhiam a três pixels. Era óptica, e
     não geometria; por isso a regra aqui é sobre o SINAL do azimute, e não
     sobre a face existir. */
  const i = NIVEIS.findIndex(n => n.foco === "corte");
  assert.ok(i >= 0, "existe um nível cujo foco é o corte");
  assert.equal(i, 1, "é o nível 02 (índice 1)");
  assert.ok(NIVEIS[i].corte, "e ele de facto abre a cunha");
  assert.equal(NIVEIS[i].comCoronarias, false,
    "as coronárias correm por fora e cruzavam a abertura como grades");

  const app = await texto("coracao/app.js");
  assert.ok(app.includes("foco === 'corte'") || app.includes('foco === "corte"'),
    "enquadrar() trata o foco do corte");
  assert.ok(/camera\.position\.set\(alvo\.x \+ d \* \.22/.test(app),
    "o enquadramento padrão continua do lado positivo");
  assert.ok(/camera\.position\.set\(alvo\.x - d \* \.\d+/.test(app),
    "e o do corte vai para o lado OPOSTO — senão a face volta a ser linha");
});

test("o lado direito tem vazão própria, e não copia o esquerdo", async () => {
  /* qTri e qPulm já se integravam no volume, mas o quadro só guardava
     qMitral/qAortica. O app improvisava: gotas direitas andavam com o
     relógio da mitral. A tricúspide abre antes e fecha depois — ensinar
     o contrário é o erro. */
  for (const q of s75.quadro) {
    assert.ok("qTri" in q && "qPulm" in q, "o quadro traz qTri e qPulm");
    if (!q.tricuspide) assert.equal(q.qTri, 0, "tricúspide fechada ⇒ qTri = 0");
    if (!q.pulmonar) assert.equal(q.qPulm, 0, "pulmonar fechada ⇒ qPulm = 0");
    if (!q.mitral) assert.equal(q.qMitral, 0, "mitral fechada ⇒ qMitral = 0");
    if (!q.aortica) assert.equal(q.qAortica, 0, "aórtica fechada ⇒ qAortica = 0");
  }
  const divergemAV = s75.quadro.filter(q => q.mitral !== q.tricuspide);
  assert.ok(divergemAV.length > 10,
    `tricúspide e mitral têm de divergir (divergiram ${divergemAV.length} quadros)`);
  for (const q of divergemAV) {
    /* valva aberta pode ter vazão quase nula na diástase (inércia do folheto);
       o que não pode é o lado fechado herdar a vazão do outro */
    if (!q.tricuspide) assert.equal(q.qTri, 0);
    if (!q.mitral) assert.equal(q.qMitral, 0);
    assert.ok(q.qTri !== q.qMitral || q.qTri === 0,
      "qTri não pode ser uma cópia de qMitral quando as valvas divergem");
  }
  const divergemSL = s75.quadro.filter(q => q.aortica !== q.pulmonar);
  assert.ok(divergemSL.length > 0, "pulmonar e aórtica também divergem");

  const app = await texto("coracao/app.js");
  assert.ok(app.includes("q: q.qTri"), "o app liga a tricúspide a qTri");
  assert.ok(app.includes("q: q.qPulm"), "o app liga a pulmonar a qPulm");
  assert.ok(!app.includes("q.mitral ? q.qMitral"),
    "sumiu a improvisação que copiava o fluxo esquerdo");
  assert.ok(!app.includes("q.aortica ? q.qAortica"),
    "e a que copiava a aórtica para a pulmonar");
});

test("a onda T sobrevive à taquicardia", async () => {
  /* cravada em 0,390 s, a T some do ciclo a 180 bpm (RR = 0,333 s). Com
     Bazett ela encolhe com √RR e continua depois do QRS, dentro do ciclo. */
  for (const fc of [180, 200]) {
    const rr = 60 / fc;
    let pico = -9, tPico = 0;
    for (let t = 0.22; t < rr; t += 0.001) {
      const v = ecg(t, rr);
      if (v > pico) { pico = v; tPico = t; }
    }
    assert.ok(pico > 0.10, `T ausente a ${fc} bpm (pico ${pico.toFixed(3)} em t=${tPico.toFixed(3)})`);
    assert.ok(tPico > 0.215, `T tem de vir depois do QRS (a ${fc} bpm caiu em ${tPico.toFixed(3)}s)`);
    assert.ok(tPico < rr, `T tem de caber no ciclo de ${rr.toFixed(3)}s`);
  }
  /* e o quadro simulado guarda essa T, não um traçado com o centro antigo */
  const s180 = simular(180, { passos: 500, ciclos: 8 });
  const aposQrs = s180.quadro.filter(q => q.t > 0.22 && q.t < s180.duracoes.rr);
  const maxT = Math.max(...aposQrs.map(q => q.ecg));
  assert.ok(maxT > 0.10, `o quadro a 180 bpm perdeu a T (pico ${maxT.toFixed(3)})`);
});

test("o snapshot de RA do nível das válvulas escolhe a diástole, não um acaso", async () => {
  const i = NIVEIS.findIndex(n => /v[áa]lvulas/i.test(n.rotulo));
  assert.equal(NIVEIS[i].faseRA, "enchimento");
  const fase = faseDeSnapshotRA(s75, NIVEIS[i].faseRA);
  assert.ok(fase != null, "há um instante de enchimento no ciclo");
  const q = em(s75, fase);
  assert.equal(q.mitral, true, "mitral aberta");
  assert.equal(q.tricuspide, true, "tricúspide aberta");
  assert.equal(q.aortica, false, "aórtica fechada");
  assert.equal(q.pulmonar, false, "pulmonar fechada");
  const app = await texto("coracao/app.js");
  assert.ok(app.includes("faseDeSnapshotRA"), "prepararRA usa a fase pedagógica");
  assert.ok(app.includes("aplicarQuadro"), "e aplica o quadro no clone, não na cena viva");
});

test("o plano valvar senta no teto da massa ventricular", async () => {
  /* raiz: o cone ia a y=78 e os anéis a y≈53–60. SUBIR_PLANO = 18 mm põe
     as valvas na junção. Tolerância documentada: 8 mm. */
  assert.equal(SUBIR_PLANO, 18);
  for (const [nome, pos] of Object.entries(PLANO_VALVAR)) {
    const topo = VENTRICULO_DA_VALVA[nome] === "vd" ? TOPO_VD : TOPO_VE;
    const folga = Math.abs(pos[1] - topo);
    assert.ok(folga <= TOLERANCIA_JUNCAO_MM,
      `${nome} em y=${pos[1]}, teto ${VENTRICULO_DA_VALVA[nome]}=${topo}, folga ${folga} > ${TOLERANCIA_JUNCAO_MM}`);
  }
  const ys = Object.values(PLANO_VALVAR).map(p => p[1]);
  assert.ok(Math.min(...ys) >= 71 && Math.max(...ys) <= 78,
    `banda dos anéis ${Math.min(...ys)}–${Math.max(...ys)}, documentada 71–78`);
  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("PLANO_VALVAR.mitral"), "o corpo lê o plano da tabela, não números soltos");
  assert.ok(m.includes("vasos.position.y = SUBIR_PLANO"), "a origem dos vasos sobe com o plano");
});

test("há exatamente um B1 e um B2 por ciclo, de 40 a 200 bpm", async () => {
  /* Dois defeitos velhos: B1 falso no relaxamento atrial, e B2 sumindo a
     150 bpm porque o fechamento aórtico caía na emenda do ciclo. */
  for (const fc of [40, 60, 75, 120, 150, 180, 200]) {
    const s = simular(fc, { passos: 900, ciclos: 14 });
    const { b1, b2, todas } = bulhas(s.quadro);
    assert.ok(b1, `faltou B1 a ${fc} bpm`);
    assert.ok(b2, `faltou B2 a ${fc} bpm`);
    assert.equal(todas.length, 2, `a ${fc} bpm saíram ${todas.map(b => b.nome).join(",")} `);
    assert.equal(todas.filter(b => b.nome === "B1").length, 1);
    assert.equal(todas.filter(b => b.nome === "B2").length, 1);
    /* B1 cai quando o ventrículo começa a contrair, não no dip da onda a */
    const qB1 = s.quadro[b1.wrap ? 0 : b1.i];
    assert.ok(qB1.ativacao > 0 || qB1.t >= 0.20,
      `B1 falso a ${fc} bpm: t=${b1.t.toFixed(3)} ativ=${qB1.ativacao.toFixed(3)}`);
    /* B2 vem depois de B1; a 40 bpm a sístole é fração menor do RR, a 150
       o fechamento pode cair na emenda (fase 1) */
    assert.ok(b2.wrap || b2.t > b1.t,
      `B2 antes de B1 a ${fc} bpm (B1 t=${b1.t.toFixed(3)}, B2 t=${b2.t.toFixed(3)})`);
  }
  /* O WIGGERS SAIU DE `app.js` PARA `wiggers.js` quando a peça anatômica
     passou a ensinar o ciclo também: as duas páginas desenham a mesma régua,
     e por isso a régua tem de ser uma. A exigência não mudou de força, mudou
     de endereço — o desenho continua LENDO as bulhas da função, em vez de
     reimplementar o laço de fechamento com outros olhos. */
  const w = await texto("coracao/wiggers.js");
  assert.ok(w.includes("bulhas(q)"), "o Wiggers lê as bulhas da função, não reimplementa o laço");
  const app = await texto("coracao/app.js");
  assert.ok(!/function desenharTracosWiggers/.test(app),
    "o desenho não pode voltar a morar dentro de uma das duas páginas");
  const src = await texto("coracao/fisica.js");
  assert.ok(src.includes("(i - 1 + n) % n"), "o laço de fechamento dá a volta no ciclo");
});

test("a parede fecha no polo e no anel do corte, sem tamponar o lúmen", async () => {
  /* Três furos reais, medidos no perfil — não em pixel:
     1. o polo do lathe começava em r≈6 mm (Math.max(.4, r) com seno de 0,04π)
     2. a face do corte usava (r cos φ, r sin φ) e o LatheGeometry usa
        (r sin φ, r cos φ): o selo nascia longe da abertura
     3. o VD era meia-lua sem face nas bordas
     O óstio tem de continuar ABERTO: fechar a parede não é tampar a cavidade. */
  const p = provaSelosDaParede({ alturaVE: ALTURA_VE, alturaVD: ALTURA_VD });
  assert.equal(p.faceCoincideComLathe, true, "a face do corte tem de sentar no anel do lathe");
  assert.ok(p.vaoDaConvencaoAntigaMm > 8,
    `o defeito antigo era um vão; medido ${p.vaoDaConvencaoAntigaMm.toFixed(1)} mm`);

  for (const [nome, c] of [["VE", p.ve], ["VD", p.vd]]) {
    assert.equal(c.nIguais, true, `${nome}: interno e externo com o mesmo número de pontos`);
    assert.ok(c.polo0Dentro < 0.2, `${nome} polo interno aberto r=${c.polo0Dentro}`);
    assert.ok(c.polo0Fora < 0.2, `${nome} polo externo aberto r=${c.polo0Fora}`);
    assert.ok(c.polo1Dentro > 8, `${nome} óstio tamponado r=${c.polo1Dentro}`);
    assert.ok(c.espessura1 > 2, `${nome} anel do óstio sumiu (${c.espessura1} mm)`);
  }
  assert.ok(p.ve.espessura1 > p.vd.espessura1,
    "o anel do esquerdo tem de ser mais grosso que o do direito");
  assert.ok(p.ae.polo1Dentro < 0.2, `teto do átrio aberto r=${p.ae.polo1Dentro}`);
  assert.ok(p.ae.polo0Dentro > 5, `óstio AV tamponado r=${p.ae.polo0Dentro}`);
  assert.ok(p.labioAltura >= 3, `lábio do óstio plano (altura ${p.labioAltura} mm) some de lado`);
  assert.ok(p.labioNaoTampona, "o lábio não pode tampar o lúmen");
  assert.ok(p.tampoLumenVE > 8, `tampo do VE tamponou o lúmen r=${p.tampoLumenVE}`);
  assert.ok(p.tampoLumenVD > 8, `tampo do VD tamponou o lúmen r=${p.tampoLumenVD}`);
  assert.ok(p.tampoCobreVE > 0, "o tampo tem de passar da parede externa");
  assert.ok(p.tampoAltura >= 8, `tampo plano (altura ${p.tampoAltura} mm) some de lado`);
  assert.ok(p.ve.polo1Dentro < 14, `óstio do VE ainda largo r=${p.ve.polo1Dentro}, cresce em volta do vaso`);
  assert.ok(p.vd.polo1Dentro < 13, `óstio do VD ainda largo r=${p.vd.polo1Dentro}, cresce em volta do vaso`);
  for (const [nome, j] of Object.entries(p.juntas)) {
    assert.ok(j.rBase > j.rTubo + 3,
      `${nome}: rBase ${j.rBase} não cobre o cresce em volta do tubo ${j.rTubo}`);
    assert.ok(Number.isFinite(j.ySaida), `${nome}: colar sem plano y do teto`);
  }
  perto(p.saidaAortaY, p.juntas.aorta.ySaida, 0.6, "colar da aorta no teto do VE");
  perto(p.saidaPulY, p.juntas.pulmonar.ySaida, 0.6, "colar da pulmonar no teto do VD");
  assert.equal(p.juntas.aorta.ySaida, ALTURA_VE - SUBIR_PLANO,
    "ySaida da aorta é o teto do VE no grupo dos vasos");
  assert.equal(p.juntas.pulmonar.ySaida, TOPO_VD - SUBIR_PLANO,
    "ySaida da pulmonar é o teto do VD no grupo dos vasos");
  assert.ok(p.colarAntigoAcimaDoOstioMm > 4,
    `o colar a 38% do segmento ficava ${p.colarAntigoAcimaDoOstioMm.toFixed(1)} mm acima do óstio`);

  const m = await texto("coracao/modelos.js");
  assert.ok(m.includes("faceDoCorte(dentro, fora, t0)"), "a face liga o perfil interno ao externo");
  assert.ok(m.includes("camaraDupla(perfil, 3.4"), "o direito usa a mesma câmara selada");
  assert.ok(m.includes("papelParede = 'selo'"), "o selo acompanha o volume, senão a sístole abre o corte");
  assert.ok(m.includes("function colarDaRaiz"), "a raiz do vaso ganha colar contra a câmara");
  assert.ok(m.includes("labioDoOstio"), "o óstio tem lábio com altura, não anel plano");
  assert.ok(m.includes("coroaDoOstio"), "a coroa dá volume no teto, visível de lado");
  assert.ok(m.includes("saidaDaParede(pts, junta.ySaida)"), "o colar senta no plano do teto, não no ar");
  assert.ok(m.includes("function manguitoDoOstio"), "manguito 2π no óstio: a meia-lua não fecha o tubo sozinha");
  assert.ok(m.includes("[-13.4, 46, 9.4]"), "a pulmonar atravessa o óstio do VD, não a parede ao lado");
  assert.ok(m.includes("[0, 52, 0]"), "a aorta atravessa o óstio do VE, não a parede ao lado");
  assert.ok(m.includes("TorusGeometry"), "o colar tem torus com volume, não só anel plano");
  assert.ok(m.includes("o.material = o.material.clone()"), "o vidro continua isolado por clone");
  const semComentario = m.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.ok(!/dentro\[i\]\.x \* cos,\s*dentro\[i\]\.y,\s*dentro\[i\]\.x \* sin/.test(semComentario),
    "voltou a convenção (cos, sin), 90° fora do lathe");
});
