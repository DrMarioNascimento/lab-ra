import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const text = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const BANCADAS = ["musculo-sarcomero/app.js", "potencial-membrana/app.js"];

/* ==========================================================================
   O toque que o iPhone não anuncia

   O Quick Look abre no modo Objeto: o modelo aparece parado e a câmera só
   entra depois de um toque em "AR", no alto da folha. O iOS antigo abria
   direto na câmera, e as duas bancadas prometiam isso — a promessa quebrou
   sozinha, sem uma linha mudar. Quem lia "Toque para abrir a câmera", recebia
   um objeto parado e não via o seletor concluía que a RA estava quebrada.
   Foi o que aconteceu, e custou um diagnóstico inteiro.
   ========================================================================== */

test("as duas bancadas reconhecem o caminho do Quick Look", async () => {
  for (const app of BANCADAS) {
    const src = await text(app);
    assert.match(src, /iPad\|iPhone\|iPod/, app);
    /* iPad recente se apresenta como Mac: sem isto ele cai no texto errado */
    assert.match(src, /MacIntel.{0,40}maxTouchPoints/s, app);
  }
});

test("a mensagem de pronto não promete a câmera direto", async () => {
  for (const app of BANCADAS) {
    const src = await text(app);
    assert.match(src, /Tamanho no ambiente: \$\{TAM_REAL\[atual\]\.toFixed\(2\)\} m\. \$\{COMO_ABRIR\}/, app);
  }
});

test("no iPhone a mensagem nomeia o botão AR", async () => {
  for (const app of BANCADAS) {
    assert.match(await text(app), /depois em "AR" no alto da tela/, app);
  }
});
