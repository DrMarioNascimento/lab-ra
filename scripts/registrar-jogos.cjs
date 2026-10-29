/* Registra a procedência das cópias dos jogos em biblioteca/dragon.

   Uso: node scripts/registrar-jogos.cjs <data> <critério> <pasta>=<repositório>@<commit> …
   Ex.: node scripts/registrar-jogos.cjs 2026-10-25 "Tempestade…" casa-da-costa=DrMarioNascimento/casa-da-costa@<sha>

   Para cada pasta (dentro de biblioteca/dragon/jogos/), recalcula o hash de
   todo arquivo que mudou em relação a biblioteca/arquivos-originais.json e
   acrescenta em biblioteca/origens.json uma atualização com a lista. O hash
   segue a mesma regra de sincronizar-jogos.cjs (texto com quebras de linha
   normalizadas). As adaptações do Lab-RA ficam nos arquivos: este script só
   registra o que já foi copiado, não copia nada. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), root = path.resolve(__dirname, '..');
const [data, criterio, ...grupos] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '') || !criterio || !grupos.length) throw Error('Uso: data critério pasta=repo@commit …');
const hpath = path.join(root, 'biblioteca/arquivos-originais.json'), opath = path.join(root, 'biblioteca/origens.json');
const hashes = Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(hpath, 'utf8'))).map(([p, h]) => [p.replaceAll('\\', '/'), h]));
const origins = JSON.parse(fs.readFileSync(opath, 'utf8'));
function hash(file) { let b = fs.readFileSync(file); if (/\.(?:js|mjs|cjs|html|css|md|json|txt|py|svg|vtt|rules|gitkeep)$/i.test(file)) b = Buffer.from(b.toString('utf8').replace(/\r\n/g, '\n')); return crypto.createHash('sha256').update(b).digest('hex'); }
for (const g of grupos) {
  const m = /^([^=]+)=([^@]+)@([a-f0-9]{40})$/.exec(g); if (!m) throw Error('Grupo inválido: ' + g);
  const [, pasta, fonte, commit] = m, base = pasta === 'RA-VOLUME-MOVIMENTO.md' ? 'biblioteca/dragon/RA-VOLUME-MOVIMENTO.md' : 'biblioteca/dragon/jogos/' + pasta;
  const changed = [];
  function ver(file) { const key = path.relative(root, file).replaceAll('\\', '/'), next = hash(file); if (hashes[key] !== next) { changed.push({ arquivo: key, origem: pasta === 'RA-VOLUME-MOVIMENTO.md' ? 'RA-VOLUME-MOVIMENTO.md' : path.relative(path.join(root, base), file).replaceAll('\\', '/'), sha256_anterior: hashes[key] || null, sha256: next }); hashes[key] = next; } }
  (function walk(p) { const s = fs.statSync(p); if (s.isDirectory()) for (const e of fs.readdirSync(p)) walk(path.join(p, e)); else ver(p); })(path.join(root, base));
  origins.atualizacoes.push({ data, tipo: 'atualizacao-da-origem', fonte, commit_fonte: commit, criterio, arquivos: changed });
  console.log(fonte, changed.length, 'arquivos');
}
fs.writeFileSync(hpath, JSON.stringify(hashes, null, 2) + '\n'); fs.writeFileSync(opath, JSON.stringify(origins, null, 2) + '\n');
