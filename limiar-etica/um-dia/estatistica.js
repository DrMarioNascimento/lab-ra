// Limiar Ético · estatística da turma (funções puras). Recebe os envios dos alunos e devolve agregados.
// Regra de proteção: nada aparece com menos de MIN_TURMA respostas (cena, opção, eixo ou turma).
import { EIXOS, CENA_EIXOS } from './programa.js?v=2.3';

export const MIN_TURMA = 5;

const media = v => v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
const mediana = v => { if (!v.length) return null; const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// Cada envio: { id, nome, avatar, dia, enviado:true, dadosJson, aplicacao }. Devolve só os válidos do dia pedido.
export function enviosDoDia(alunos, diaId) {
  const out = [];
  for (const a of alunos || []) {
    if (!a || !a.enviado || a.dia !== diaId || !a.dadosJson) continue;
    try { const dados = JSON.parse(a.dadosJson); if (dados && Array.isArray(dados.pontos)) out.push({ ...a, dados }); } catch (e) { /* envio corrompido: ignora */ }
  }
  return out;
}

export function agregar(alunos, DIA, diaId) {
  const envios = enviosDoDia(alunos, diaId);
  const n = envios.length;
  const liberado = n >= MIN_TURMA;
  const base = { n, minimo: MIN_TURMA, liberado };
  if (!liberado) return { ...base, cenas: [], medias: null, escala: [], eixos: [], conferiu: null, aplicacoes: [], niveis: null };

  const cenas = DIA.CENAS.map(c => {
    const respostas = envios.map(e => e.dados.pontos.find(p => p.cenaId === c.id)).filter(Boolean);
    const k = respostas.length;
    if (k < MIN_TURMA) return { id: c.id, hora: c.hora, titulo: c.titulo, n: k, oculta: true, opcoes: [], medias: null, tempoS: null };
    const opcoes = c.opcoes.map(o => {
      const q = respostas.filter(r => r.escolha === o.t).length;
      return { texto: o.t, n: q, pct: q / k };
    });
    return {
      id: c.id, hora: c.hora, titulo: c.titulo, n: k, oculta: false, opcoes,
      medias: {
        razao: media(respostas.map(r => r.razao)), emocao: media(respostas.map(r => r.emocao)), impulso: media(respostas.map(r => r.impulso)),
        margem: media(respostas.map(r => r.margem)), certoDesfecho: media(respostas.map(r => r.certoDesfecho))
      },
      tempoS: mediana(respostas.map(r => r.tempoS).filter(t => t != null)),
      altas: respostas.filter(r => r.nivel === 'alto').length
    };
  });

  const todos = envios.flatMap(e => e.dados.pontos);
  const medias = { razao: media(todos.map(p => p.razao)), emocao: media(todos.map(p => p.emocao)), impulso: media(todos.map(p => p.impulso)) };

  const chaves = (envios[0].dados.escala || []).map(e => ({ chave: e.chave, nome: e.nome }));
  const escala = chaves.map(c => ({ ...c, parte: media(envios.map(e => (e.dados.escala.find(x => x.chave === c.chave) || { parte: 0 }).parte)) }));

  // Eixos: nas cenas que tocam o eixo como principal, o quanto a turma pesou razão, emoção e impulso.
  const mapa = CENA_EIXOS[diaId] || {};
  const eixos = Object.keys(EIXOS).map(id => {
    const pts = todos.filter(p => (mapa[p.cenaId] || [])[0] === id);
    const cenasDoEixo = [...new Set(pts.map(p => p.cenaId))];
    if (pts.length < MIN_TURMA) return null;
    return { id, titulo: EIXOS[id].titulo, cenas: cenasDoEixo.length, respostas: pts.length, razao: media(pts.map(p => p.razao)), emocao: media(pts.map(p => p.emocao)), impulso: media(pts.map(p => p.impulso)) };
  }).filter(Boolean);

  const comInfo = envios.map(e => e.dados).filter(d => d.podiaConferir > 0);
  const conferiu = comInfo.length >= MIN_TURMA
    ? { abriram: comInfo.reduce((a, d) => a + d.conferiu, 0), podiam: comInfo.reduce((a, d) => a + d.podiaConferir, 0) } : null;

  const niveis = { baixo: 0, medio: 0, alto: 0 };
  for (const p of todos) if (niveis[p.nivel] != null) niveis[p.nivel]++;

  const aplicacoes = envios.map(e => String(e.aplicacao || '').trim()).filter(t => t.length >= 10);
  return { ...base, cenas, medias, escala, eixos, conferiu, aplicacoes, niveis };
}
