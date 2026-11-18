// Limiar Ético · Um dia — motor do dia (sem interface).
import { CENAS, CENA_FINAL, CENA_NEGADA, ORDEM_PENDENCIAS, VOLTAS, CORRENTES } from './dados.js?v=0.6';

export function novoEstado() {
  return {
    fila: CENAS.map(c => c.id).concat('volta'),
    pos: 0,
    conf: { chefia: 0, equipe: 0, grupo: 0, cliente: 0 },
    familia: null,
    pend: [],
    cansaco: 0,
    evento: 0,
    trabalho: 0,
    adiou: false,
    log: []
  };
}

export function pendenciaPrincipal(est) {
  return ORDEM_PENDENCIAS.find(p => est.pend.includes(p)) || 'nenhuma';
}

export function cenaAtual(est) {
  const id = est.fila[est.pos];
  if (id === undefined) return null;
  if (id === 'negada') return CENA_NEGADA;
  if (id === 'volta') return { ...CENA_FINAL, texto: VOLTAS[pendenciaPrincipal(est)] };
  return CENAS.find(c => c.id === id);
}

export function totalCenas(est) { return est.fila.length; }

// Com cansaço alto, nas cenas da noite sobra menos tempo para conferir a informação.
// Devolve os segundos em que a informação fica disponível (Infinity = sempre).
export function janelaInfo(est, cena) {
  if (!cena || !cena.info) return 0;
  const noite = ['fotos', 'interprete'].includes(cena.id);
  if (!noite) return Infinity;
  if (est.cansaco >= 3) return 0;
  if (est.cansaco === 2) return 15;
  return Infinity;
}

function aplicar(est, ef) {
  for (const k of ['chefia', 'equipe', 'grupo', 'cliente']) if (ef[k]) est.conf[k] += ef[k];
  if (ef.cansaco) est.cansaco += ef.cansaco;
  if (ef.evento) est.evento += ef.evento;
  if (ef.trabalho) est.trabalho += ef.trabalho;
  if (ef.pend && !est.pend.includes(ef.pend)) est.pend.push(ef.pend);
  if (ef.familia) est.familia = ef.familia;
  if (ef.adiou) est.adiou = true;
}

// Registra a decisão, aplica os efeitos e devolve o texto do desfecho.
export function decidir(est, indiceOpcao, sinais = {}) {
  const cena = cenaAtual(est);
  if (!cena) throw new Error('O dia já terminou.');
  const op = cena.opcoes[indiceOpcao];
  if (!op) throw new Error('Alternativa inexistente.');
  let desfecho = op.d;
  aplicar(est, op.ef);

  if (op.pedeChefia) {
    if (est.conf.chefia >= 1) {
      aplicar(est, { familia: 'atendido', evento: -1 });
      desfecho = 'A chefia olha o relógio e libera: “Volta antes da abertura.” Você acompanha a consulta e chega de volta às 19h25, com o evento começando.';
    } else {
      est.fila.splice(est.pos + 1, 0, 'negada');
      desfecho = 'Você manda a mensagem para a chefia e espera a resposta.';
    }
  }

  if (cena.id === 'interprete' && indiceOpcao === 1 && est.conf.equipe >= 2) {
    est.evento += 1;
    desfecho = 'Uma colega da equipe ajuda a preparar as legendas e a distribuir os roteiros. O material fica disponível mais cedo. A medida ajuda parte da plateia, e a ausência de Libras continua sem reparo. No fim, a chefia diz que preferia ter sido avisada antes.';
  }

  est.log.push({
    cenaId: cena.id, hora: cena.hora, titulo: cena.titulo, margem: cena.margem,
    indice: indiceOpcao, opcao: op, conceito: cena.conceito,
    desfecho,
    tempoMs: sinais.tempoMs ?? null,
    abriuInfo: !!sinais.abriuInfo,
    tinhaInfo: !!cena.info && sinais.infoDisponivel !== false
  });
  est.pos += 1;
  return desfecho;
}

export function terminou(est) { return est.pos >= est.fila.length; }

function textoEvento(v) {
  if (v >= 2) return 'O evento aconteceu bem.';
  if (v >= 0) return 'O evento aconteceu, com algumas falhas.';
  return 'O evento aconteceu, com problemas que o cliente percebeu.';
}
function textoTrabalho(v) {
  if (v >= 1) return 'O trabalho foi entregue no prazo, com a sua parte feita por você.';
  if (v === 0) return 'O trabalho foi entregue no limite do prazo.';
  return 'O trabalho foi entregue, mas a sua parte ficou com os colegas ou incompleta.';
}
function textoFamilia(f) {
  if (f === 'atendido') return 'A sua mãe foi à consulta acompanhada.';
  if (f === 'adiado') return 'A sua mãe foi à consulta sozinha; você ficou de passar lá amanhã.';
  if (f === 'sem resposta') return 'A sua mãe foi à consulta sozinha.';
  return '';
}

// Tudo o que a revelação final precisa.
export function resumo(est) {
  const pontos = est.log.map((l, n) => ({
    n: n + 1, hora: l.hora, titulo: l.titulo, cenaId: l.cenaId,
    escolha: l.opcao.t, desfecho: l.desfecho, caracteristica: l.opcao.car, conceito: l.conceito,
    impulso: l.opcao.w.i, emocao: l.opcao.w.e, razao: l.opcao.w.r,
    certoDesfecho: l.opcao.cd, margem: l.margem,
    tempoS: l.tempoMs == null ? null : Math.round(l.tempoMs / 1000),
    abriuInfo: l.abriuInfo, tinhaInfo: l.tinhaInfo
  }));

  const correntes = Object.fromEntries(Object.keys(CORRENTES).map(k => [k, 0]));
  for (const l of est.log) for (const [k, v] of Object.entries(l.opcao.cor)) correntes[k] += v;
  const somaCor = Object.values(correntes).reduce((a, b) => a + b, 0) || 1;
  const escala = Object.keys(CORRENTES).map(k => ({
    chave: k, nome: CORRENTES[k], pontos: correntes[k], parte: correntes[k] / somaCor
  }));

  const media = campo => pontos.reduce((a, p) => a + p[campo], 0) / (pontos.length || 1);
  const comInfo = pontos.filter(p => p.tinhaInfo);

  return {
    pontos, escala,
    medias: { impulso: media('impulso'), emocao: media('emocao'), razao: media('razao') },
    conferiu: comInfo.filter(p => p.abriuInfo).length,
    podiaConferir: comInfo.length,
    metas: {
      evento: textoEvento(est.evento),
      trabalho: textoTrabalho(est.trabalho),
      familia: textoFamilia(est.familia)
    },
    pendencias: est.pend.slice(),
    adiou: est.adiou
  };
}
