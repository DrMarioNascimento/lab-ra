import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const ler = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('ciclo na mesa: o instante continua como antes e o ciclo é um botão a mais, só no Android', () => {
  const app = ler('coracao/app.js'), html = ler('coracao/index.html');
  // modo instante intacto
  assert.match(app, /const ehQuickLook = \/iPad\|iPhone\|iPod\/\.test\(navigator\.userAgent\)/);
  assert.match(app, /if \(batendo\) \{\s*\$\('launchAR'\)\.disabled = true;/);
  assert.match(app, /new GLTFExporter\(\)\.parseAsync\(wrap, \{ binary: true, onlyVisible: true \}\)/);
  assert.match(html, /<model-viewer id="arViewer"[^>]*ar-modes="webxr scene-viewer quick-look"[^>]*ar-placement="floor"[^>]*ar-scale="auto"/);
  // ciclo separado, escondido por padrão e liberado só no Android
  assert.match(html, /<div id="cicloTesteBox" hidden>/);
  assert.match(html, /<model-viewer id="arCiclo"[^>]*ar-modes="webxr scene-viewer quick-look"[^>]*ar-placement="floor"[^>]*ar-scale="auto"[^>]*autoplay[^>]*shadow-intensity="1"/);
  assert.match(app, /const ehAndroid = \/Android\/i\.test\(navigator\.userAgent\);/);
  assert.match(app, /if \(ehAndroid\) \{\s*\$\('cicloTesteBox'\)\.hidden = false;/);
  // diagnóstico só no console
  assert.match(app, /window\.pacoteCiclo = \(\) => ultimoCiclo;/);
  assert.doesNotMatch(html, /erro de interpola|pacoteCiclo|medirCiclo/);
});

test('ciclo na mesa: amostra o próprio motor e devolve a tela como estava', () => {
  const app = ler('coracao/app.js');
  const bloco = app.slice(app.indexOf('function amostrarCiclo'), app.indexOf('async function gerarCiclo'));
  assert.match(bloco, /peca\.aplicar\(em\(sim, fase\), dt\)/);          // a mesma função do desenho
  assert.match(bloco, /finally \{[\s\S]*fase = guarda\.fase; batendo = guarda\.batendo;/);
  assert.match(bloco, /Object\.assign\(peca\.aplicar\.abertura, guarda\.abertura\)/);
  assert.match(app, /aplicarB\.abertura = abertura;/);
});

test('ciclo na mesa: morphs relativos, uma trilha por malha e laço fechado no alvo 0', () => {
  const c = ler('ciclo-na-mesa.js');
  assert.match(c, /g\.morphTargetsRelative = true;/);
  assert.match(c, /\.morphTargetInfluences', tempos, pesos\)/);
  assert.match(c, /pesos\[k \* N \+ \(k % N\)\] = 1;/);
  assert.match(c, /animations: \[clip\]/);
  assert.match(c, /binary: true, onlyVisible: true/);
});
