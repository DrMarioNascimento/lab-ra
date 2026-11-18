// Limiar Ético · Um dia — retorno por nível de estresse da situação.
// Funções puras: recebem os pontos do resumo e devolvem frases em conceitos éticos.
// O nível é o da situação na história, e não o que a pessoa sentiu. As cenas mudam de um nível para outro,
// então as frases descrevem o que aconteceu neste percurso e convidam à discussão; não são diagnóstico.
import { NIVEIS, NOME_NIVEL } from './dados.js?v=1.1';
import { CONCEITOS_DA_LEITURA } from './glossario.js?v=1.1';

const media = (lista, f) => lista.length ? lista.reduce((s, x) => s + f(x), 0) / lista.length : null;
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

export function agruparPorNivel(pontos) {
  const g = Object.fromEntries(NIVEIS.map(n => [n, []]));
  for (const p of pontos) if (p.nivel && g[p.nivel]) g[p.nivel].push(p);
  return g;
}

function contar(grupo, aplica) { return grupo.filter(aplica).length; }

export function gerarRetorno(pontos, opcoes = {}) {
  const instituicao = opcoes.instituicao || 'a empresa';
  const g = agruparPorNivel(pontos);
  const alto = g.alto, baixo = g.baixo;
  const temComparacao = alto.length >= 2 && baixo.length >= 2;
  const achados = [];

  // 1. Razão, emoção e impulso
  if (temComparacao) {
    const dRazao = media(alto, p => p.razao) - media(baixo, p => p.razao);
    achados.push({
      id: 'razao-emocao', titulo: 'Razão e emoção',
      texto: dRazao <= -0.12
        ? 'Nas cenas de alto estresse, as suas escolhas tiveram mais característica emotiva ou de impulso do que nas de baixo estresse.'
        : dRazao >= 0.12
          ? 'Nas cenas de alto estresse, as suas escolhas tiveram mais característica racional do que nas de baixo estresse.'
          : 'O peso entre razão, emoção e impulso foi parecido nas cenas de alto e de baixo estresse.'
    });
  }

  // 2. Coleguismo
  for (const n of ['alto', 'baixo']) {
    const gr = g[n];
    if (!gr.length) continue;
    const pres = contar(gr, p => p.prot.includes('colegas'));
    const sac = contar(gr, p => p.sac.includes('colegas'));
    if (pres + sac === 0) continue;
    const partes = [];
    if (pres) partes.push(`preservou o coleguismo em ${plural(pres, 'decisão', 'decisões')}`);
    if (sac) partes.push(`${pres ? 'o ' : ''}sacrificou${pres ? '' : ' o coleguismo'} em ${plural(sac, 'decisão', 'decisões')}`);
    achados.push({ id: `colegas-${n}`, titulo: 'Coleguismo', texto: `Nas cenas de ${NOME_NIVEL[n]}, você ${partes.join(' e ')}.` });
  }

  // 3. Meta pessoal no lugar dos colegas
  for (const n of ['alto', 'baixo']) {
    const k = contar(g[n], p => p.sac.includes('colegas') && p.prot.includes('meta'));
    if (k) achados.push({ id: `meta-colegas-${n}`, titulo: 'Meta pessoal e coleguismo', texto: `Em ${plural(k, 'cena', 'cenas')} de ${NOME_NIVEL[n]}, você deixou o coleguismo em segundo plano para proteger uma meta pessoal.` });
  }

  // 4. Justiça e equidade sem perder a empresa, o curso, a escola ou o projeto
  for (const n of ['alto', 'baixo', 'medio']) {
    const k = g[n].filter(p => p.prot.includes('justica') && (['empresa', 'instituicao'].some(c => p.prot.includes(c) && !p.sac.includes(c)) || (p.prot.includes('curso') && !p.sac.includes('curso'))));
    if (k.length) {
      const o = k.some(p => p.prot.includes('instituicao')) ? instituicao : k.some(p => p.prot.includes('empresa')) ? 'a empresa' : 'o curso';
      achados.push({ id: `justica-${n}`, titulo: 'Justiça e equidade', texto: `Em ${plural(k.length, 'cena', 'cenas')} de ${NOME_NIVEL[n]}, você agiu com justiça e equidade e ainda preservou ${o}.` });
    }
  }

  // 5. Ética profissional
  for (const n of ['alto', 'baixo']) {
    const gr = g[n];
    if (!gr.length) continue;
    const pres = contar(gr, p => p.prot.includes('profissional'));
    const sac = contar(gr, p => p.sac.includes('profissional'));
    if (pres + sac === 0) continue;
    achados.push({
      id: `profissional-${n}`, titulo: 'Ética profissional',
      texto: pres
        ? `Nas cenas de ${NOME_NIVEL[n]}, a ética profissional esteve presente em ${plural(pres, 'escolha', 'escolhas')}` + (sac ? ` e ficou de lado em ${sac}.` : '.')
        : `Nas cenas de ${NOME_NIVEL[n]}, a ética profissional ficou de lado em ${plural(sac, 'escolha', 'escolhas')}.`
    });
  }

  // 6. Virtudes
  if (temComparacao) {
    const d = media(alto, p => p.virtude) - media(baixo, p => p.virtude);
    if (Math.abs(d) >= 0.3) {
      achados.push({
        id: 'virtudes', titulo: 'Virtudes',
        texto: d > 0
          ? 'As suas escolhas nas cenas de alto estresse se aproximaram mais das virtudes (coragem, veracidade, justo meio) do que nas de baixo estresse.'
          : 'As suas escolhas nas cenas de baixo estresse se aproximaram mais das virtudes (coragem, veracidade, justo meio) do que nas de alto estresse.'
      });
    }
  }

  // 7. Certo e desfecho
  if (temComparacao) {
    const d = media(alto, p => p.certoDesfecho) - media(baixo, p => p.certoDesfecho);
    if (Math.abs(d) >= 0.25) {
      achados.push({
        id: 'certo-desfecho', titulo: 'O certo e o desfecho',
        texto: d > 0
          ? 'Nas cenas de alto estresse, você se apoiou mais no dever e no princípio do que nas de baixo estresse, quando olhou mais para as consequências.'
          : 'Nas cenas de alto estresse, você olhou mais para as consequências do que nas de baixo estresse, quando se apoiou mais no dever e no princípio.'
      });
    }
  }

  for (const a of achados) {
    const familia = a.id.replace(/-(alto|medio|baixo)$/, '');
    a.conceitos = CONCEITOS_DA_LEITURA[familia] || [];
  }

  const porNivel = NIVEIS.map(n => ({
    nivel: n, nome: NOME_NIVEL[n], cenas: g[n].map(p => p.titulo), total: g[n].length,
    razao: media(g[n], p => p.razao), emocao: media(g[n], p => p.emocao + p.impulso)
  }));
  return { porNivel, achados, temComparacao };
}
