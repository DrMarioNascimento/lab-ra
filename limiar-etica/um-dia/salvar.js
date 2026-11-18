// Limiar Ético · janela "Salvar": lista de caixas para escolher o que levar, em PDF (impressão do navegador) e/ou imagem (PNG).
// Serve ao aluno, ao professor e à tela da turma: quem chama entrega os blocos já em HTML.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Quebra o HTML de uma aba em blocos (cada "cartão" de primeiro nível vira um item da lista).
export function blocosDe(html) {
  const raiz = document.createElement('div');
  raiz.innerHTML = html;
  const todos = [...raiz.querySelectorAll('section.cartao, .cartao.painel')];
  const topo = todos.filter(el => !el.parentElement.closest('.cartao'));
  return topo.map((el, i) => {
    const t = el.querySelector('h2, h3');
    return { rotulo: (t ? t.textContent : `Bloco ${i + 1}`).trim().replace(/\s+/g, ' '), html: el.outerHTML };
  });
}

function limpar(el) {
  el.querySelectorAll('textarea').forEach(t => { const p = document.createElement('p'); p.className = 'resposta-folha'; p.textContent = t.value || t.textContent; t.replaceWith(p); });
  el.querySelectorAll('.acoes, button, .ponto-alvo, [data-acao="contestar"]').forEach(b => b.remove());
  el.querySelectorAll('details').forEach(d => { d.open = true; d.hidden = false; });
  el.querySelectorAll('[hidden]').forEach(h => h.remove());
  el.querySelectorAll('[class*="entra"]').forEach(h => h.classList.remove('entra'));
  return el;
}

function montarFolha({ cabecalho, escolhidos }) {
  document.querySelector('#folha')?.remove();
  const f = document.createElement('div');
  f.id = 'folha';
  f.className = 'folha';
  f.innerHTML = `<header class="folha-topo"><strong>Limiar Ético</strong><span>${esc(cabecalho)}</span><span>${new Date().toLocaleDateString('pt-BR')}</span></header>` + escolhidos.map(b => b.html).join('');
  limpar(f);
  document.body.appendChild(f);
  return f;
}

let h2cPromessa = null;
function carregarH2C() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  if (!h2cPromessa) h2cPromessa = new Promise((ok, falha) => {
    const s = document.createElement('script');
    s.src = new URL('vendor/html2canvas.min.js', import.meta.url).href + '?v=1.4.1';
    s.onload = () => ok(window.html2canvas); s.onerror = () => { h2cPromessa = null; falha(new Error('não carregou')); };
    document.head.appendChild(s);
  });
  return h2cPromessa;
}

async function baixarUma(f, arquivo) {
  const h2c = await carregarH2C();
  // O canvas do iOS passa de cerca de 16 mil pixels de altura ou 16 milhões de pixels no total: a escala se ajusta ao tamanho.
  const escala = Math.max(1, Math.min(2, Math.sqrt(14e6 / (f.offsetWidth * f.offsetHeight))));
  const canvas = await h2c(f, { scale: escala, backgroundColor: '#fffaf0', useCORS: true, logging: false });
  const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = arquivo + '.png'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Imagens muito altas são divididas em partes (até ~7000 px cada), sempre entre blocos.
async function baixarImagem(cabecalho, escolhidos, arquivo, aviso) {
  const medida = montarFolha({ cabecalho, escolhidos });
  const alturas = [...medida.children].slice(1).map(el => el.offsetHeight + 16);
  const partes = []; let atual = [], soma = 0;
  escolhidos.forEach((b, i) => {
    if (atual.length && soma + alturas[i] > 7000) { partes.push(atual); atual = []; soma = 0; }
    atual.push(b); soma += alturas[i];
  });
  if (atual.length) partes.push(atual);
  for (let k = 0; k < partes.length; k++) {
    aviso(partes.length > 1 ? `Gerando a imagem ${k + 1} de ${partes.length}…` : 'Gerando a imagem…');
    const f = montarFolha({ cabecalho, escolhidos: partes[k] });
    await baixarUma(f, partes.length > 1 ? `${arquivo}-${k + 1}` : arquivo);
  }
}

function imprimirPDF(f) {
  return new Promise(ok => {
    document.body.classList.add('imprimindo');
    const fim = () => { document.body.classList.remove('imprimindo'); window.removeEventListener('afterprint', fim); ok(); };
    window.addEventListener('afterprint', fim);
    setTimeout(() => window.print(), 80);
  });
}

// opcoes: { titulo, cabecalho, arquivo, grupos:[{nome, blocos:[{rotulo, html}]}], enviar?:{rotulo, aoClicar} }
export function abrirSalvar(op) {
  if (document.querySelector('#salvar')) return;
  const caixa = document.createElement('div');
  caixa.className = 'manual-fundo';
  caixa.id = 'salvar';
  const grupos = op.grupos.filter(g => g.blocos.length);
  caixa.innerHTML = `<section class="cartao manual salvar" role="dialog" aria-modal="true" aria-labelledby="salvar-titulo">
    <h2 id="salvar-titulo">${esc(op.titulo || 'Salvar')}</h2>
    <p class="suave pequeno">Marque o que quer levar. Cada caixa é um bloco da tela.</p>
    <div class="salvar-lista">
      ${grupos.map((g, gi) => `<fieldset class="salvar-grupo"><legend><label><input type="checkbox" data-grupo="${gi}" checked> <strong>${esc(g.nome)}</strong></label></legend>
        ${g.blocos.map((b, bi) => `<label class="salvar-item"><input type="checkbox" data-g="${gi}" data-b="${bi}" checked> ${esc(b.rotulo)}</label>`).join('')}</fieldset>`).join('')}
    </div>
    <div class="salvar-formato"><strong>Formato</strong>
      <label><input type="checkbox" id="fmt-pdf" checked> PDF</label>
      <label><input type="checkbox" id="fmt-png" checked> Imagem (PNG)</label></div>
    <p id="salvar-msg" class="suave pequeno" role="status"></p>
    <div class="acoes"><button class="btn principal" data-s="salvar">Salvar</button>${op.enviar ? `<button class="btn secundario" data-s="enviar">${esc(op.enviar.rotulo)}</button>` : ''}<button class="btn secundario" data-s="fechar">Fechar</button></div>
  </section>`;
  document.body.appendChild(caixa);
  const msg = caixa.querySelector('#salvar-msg');
  const fechar = () => { caixa.remove(); document.removeEventListener('keydown', tecla); document.querySelector('#folha')?.remove(); };
  const tecla = e => { if (e.key === 'Escape') fechar(); };
  document.addEventListener('keydown', tecla);

  const itens = () => [...caixa.querySelectorAll('input[data-b]')];
  const sincronizaGrupos = () => caixa.querySelectorAll('input[data-grupo]').forEach(gc => {
    const filhos = itens().filter(i => i.dataset.g === gc.dataset.grupo);
    const marcados = filhos.filter(i => i.checked).length;
    gc.checked = marcados === filhos.length; gc.indeterminate = marcados > 0 && marcados < filhos.length;
  });
  caixa.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.grupo != null) itens().filter(i => i.dataset.g === t.dataset.grupo).forEach(i => { i.checked = t.checked; });
    sincronizaGrupos();
  });
  caixa.addEventListener('click', async e => {
    if (e.target === caixa) return fechar();
    const b = e.target.closest('[data-s]');
    if (!b) return;
    if (b.dataset.s === 'fechar') return fechar();
    if (b.dataset.s === 'enviar') { b.disabled = true; msg.textContent = 'Enviando…'; try { msg.textContent = await op.enviar.aoClicar(); } catch (er) { msg.textContent = 'Não consegui enviar. Verifique a internet e tente de novo.'; } b.disabled = false; return; }
    const escolhidos = itens().filter(i => i.checked).map(i => grupos[i.dataset.g].blocos[i.dataset.b]);
    const pdf = caixa.querySelector('#fmt-pdf').checked, png = caixa.querySelector('#fmt-png').checked;
    if (!escolhidos.length) { msg.textContent = 'Marque pelo menos um bloco.'; return; }
    if (!pdf && !png) { msg.textContent = 'Marque PDF, imagem ou os dois.'; return; }
    b.disabled = true;
    try {
      if (png) await baixarImagem(op.cabecalho, escolhidos, op.arquivo, t => { msg.textContent = t; });
      if (pdf) {
        const f = montarFolha({ cabecalho: op.cabecalho, escolhidos }); msg.textContent = 'Abrindo a impressão. Escolha "Salvar como PDF".'; caixa.hidden = true; await imprimirPDF(f); caixa.hidden = false; }
      msg.textContent = 'Pronto.';
    } catch (er) { console.error(er); caixa.hidden = false; msg.textContent = 'Não consegui gerar o arquivo. Tente só o PDF.'; }
    document.querySelector('#folha')?.remove();
    b.disabled = false;
  });
  caixa.querySelector('[data-s="salvar"]').focus();
}
