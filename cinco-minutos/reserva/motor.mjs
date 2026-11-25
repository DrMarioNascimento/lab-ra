import { atividades, causas, finais, ordemCausas, provas, salas, missao, maquinaValores } from './banco.mjs';

export function criarPartida(jogadores, causa = 'C', duracao = 300, tamanho = 5, id = crypto.randomUUID()) {
  const pessoas = Object.fromEntries(jogadores.map((p, i) => [p.id, {
    nome: p.nome, equipe: Math.floor(i / tamanho), sala: '', pistas: {}, energia: 5, turno: null
  }]));
  return { id, causa: causas[causa] ? causa : 'C', duracao, volta: 1, etapa: 'escolha', inicia: null,
    pessoas, equipes: Array.from({length: Math.ceil(jogadores.length / tamanho)}, () => ({
      chave: null, envio: 0, pulso: 0, raio: 0, trocas: null, convites: {}, fatos: {}
    })), acks: {} };
}

export function tempo(p, agora) {
  if (p.etapa !== 'investigacao') return { restante: p.duracao, roteiro: 0 };
  const restante = Math.max(0, Math.min(p.duracao, (p.inicia + p.duracao * 1000 - agora)/1000));
  return { restante, roteiro: (p.duracao - restante) * 300 / p.duracao };
}

export function desfecho(fatos) {
  if (fatos.conserto && fatos.revelada) return 'Ouro';
  if (fatos.conserto) return 'Desligar';
  if (fatos.revelada) return 'Revelar';
  if (fatos.diagnostico || provas.filter(prova => fatos[prova]).length >= 2) return 'Parcial';
  return 'Mínimo';
}

function adicionar(pessoa, equipe, ids, volta) {
  for (const id of ids) {
    pessoa.pistas[id] ??= volta;
    equipe.fatos[id] ??= volta;
  }
}

export function disponivel(partida, uid, id, agora) {
  const p = partida.pessoas[uid], a = Object.hasOwn(atividades,id) ? atividades[id] : null;
  if (!p || !a || !a.salas.includes(p.sala) || partida.etapa !== 'investigacao') return 'Escolha o ambiente indicado.';
  if (tempo(partida, agora).restante <= 0) return 'A volta terminou.';
  const e = partida.equipes[p.equipe], f = e.fatos, v = partida.volta;
  if (v < (a.desde ?? 1) || v > (a.ate ?? 5)) return 'Esta ação pertence a outra volta.';
  if (p.sala === 'reserva' && id !== 'abrir' && p.turno !== v) return 'Abra a porta com a chave da Reserva.';
  if (id === 'abrir' && (e.chave !== uid || p.turno === v)) return p.turno === v ? 'Porta aberta nesta volta.' : 'A chave está com outra pessoa.';
  if (id === 'fotoConsulta' && f.foto) return 'A foto já está arquivada no dossiê.';
  if (id === 'caixa' && e.chave) return 'A chave já foi encontrada pela equipe.';
  if (id === 'revelar' && p.sala === 'camara' && Object.values(partida.pessoas).some(x => x !== p && x.equipe === p.equipe)) return 'A equipe apresenta as provas pela Recepção.';
  if (id === 'enviar' && (e.envio || p.energia < 1)) return e.envio ? 'O original já foi encaminhado.' : 'Reserve 1 de energia para o envio.';
  if (id === 'fixar' && p.energia < 2) return 'O conserto precisa de 2 de energia.';
  if (id === 'raio') {
    if (!['B','E'].includes(partida.causa)) return 'A causa desta noite usa outro procedimento.';
    const instante = tempo(partida,agora).roteiro;
    const janela = partida.duracao===30 ? [50,130] : [66,74];
    if (instante < janela[0] || instante > janela[1]) return 'Feche a chave na janela do raio (1:06 a 1:14 no ritmo completo).';
  }
  const missaoId = ({comparar:'quadro',cruzar:'trajeto',pegadas:'pegadas'})[id];
  if (missaoId && Object.values(partida.pessoas).filter(x=>x.equipe===p.equipe).length>1) {
    const m = missao[missaoId], convite = e.convites[missaoId];
    if (!(p.pistas[m.a] && p.pistas[m.b]) && !(convite?.membros.includes(uid) && convite.membros.every(x=>convite.aceites[x])))
      return 'Combine a dupla assim que as pistas complementares aparecerem.';
  }
  if (id === 'pegadas' && e.pulso > 0 && e.pulso <= agora) return 'A iluminação expirou. Peça para ligar de novo.';
  if (a.da?.length && a.da.every(x => f[x])) return 'Já registrado pela equipe.';
  for (const exigencia of a.precisa ?? []) {
    if (exigencia === 'abriu' || (exigencia === 'pulso' && e.pulso > agora)) continue;
    if (exigencia === 'preparo') {
      if (partida.causa === 'C' && !(e.envio > 0 && e.envio < v)) return 'O original precisa ser encaminhado em uma volta anterior.';
      if (['B','E'].includes(partida.causa) && !(f.eco && f.eco < v) && e.raio <= agora) return 'Prepare o eco numa volta anterior.';
      if (partida.causa === 'D' && !f.circuito) return 'Falta conferir os conectores na Oficina ou nas Coleções.';
      if (partida.causa === 'E' && !f.primeira) return 'Registre a primeira intervenção até a volta 4.';
      continue;
    }
    if (!f[exigencia]) return ({foto:'Falta reconstruir a foto na Reserva.',marca:'Falta examinar a marca na Galeria.',
      manual:'Falta o manual do Ateliê.',carga:'Falta o relatório técnico da Reserva.',original:'Encontre a peça original no caixote.',
      diagnostico:'Compare os sinais da Câmara.',oriente:'Consulte o cartão de serviço do Pátio ou da Oficina.',
      cadeado:'Abra primeiro o cadeado direcional.',pulso:'Aguarde o parceiro ligar a iluminação no Pátio.',
      copia:'Falta provar que a peça é uma cópia.',trajetoria:'Falta confirmar o trajeto.',identidade:'Falta confirmar o uso do crachá.',
      fita:'Falta restaurar a fita.',catraca:'Falta o registro da catraca.',emprestimo:'Falta a ficha de empréstimo.'})[exigencia] || 'Falta uma pista.';
  }
  return '';
}

export function conviteCandidatos(partida, uid) {
  const p = partida.pessoas[uid];
  if (!p) return [];
  const e = partida.equipes[p.equipe];
  const saidas = {quadro:'copia',trajeto:'identidade',pegadas:'trajetoria'};
  return Object.entries(missao).flatMap(([id,m]) => {
    if (e.fatos[saidas[id]] || !p.pistas[m.a] && !p.pistas[m.b]) return [];
    const marcado = e.convites[id]?.membros.find(chave => chave !== uid);
    const outro = Object.entries(partida.pessoas).find(([chave,x]) =>
      chave !== uid && (!marcado || marcado === chave) && x.equipe === p.equipe && (p.pistas[m.a] && x.pistas[m.b] || p.pistas[m.b] && x.pistas[m.a]));
    return outro ? [{id, nome:m.nome, parceiro:outro[0], apelido:outro[1].nome, salas:m.salas, convite:e.convites[id]}] : [];
  });
}

function tentativaCorreta(partida, atividade, resposta) {
  const a = atividades[atividade];
  switch (a.tipo) {
    case 'registro': return resposta === true;
    case 'caixa': return resposta === 'faixa/fundo/tampa';
    case 'chave': return resposta === 'aberta';
    case 'foto': return resposta === '012345';
    case 'luz': return resposta === 4;
    case 'comparar': return resposta === a.certo;
    case 'ordem': return resposta === a.itens.join('|');
    case 'sintomas': return resposta === partida.causa;
    case 'maquina': {
      const campos = maquinaValores[partida.causa];
      return resposta === (campos ? campos.map(c=>c[2]) : causas[partida.causa].ordem).join('|');
    }
    default: return false;
  }
}

export function aplicar(partida, comando, agora, mestre = false) {
  if (comando.partida !== partida.id || comando.volta !== partida.volta || comando.etapa !== partida.etapa) return [partida,'A etapa mudou.'];
  const novo = structuredClone(partida), p = novo.pessoas[comando.uid];
  const e = p && novo.equipes[p.equipe], {acao, valor} = comando;
  if (!p && !mestre) return [partida,'Você não está nesta equipe.'];
  const falha = texto => [partida,texto];
  if (acao === 'iniciar') {
    if (!mestre || novo.etapa !== 'escolha') return falha('O Mestre abre a volta.');
    novo.etapa = 'investigacao';
    novo.inicia = agora;
  } else if (acao === 'encerrar') {
    if (!mestre || novo.etapa !== 'investigacao' || novo.duracao !== 30 && tempo(novo, agora).restante > 0) return falha('A volta ainda está em andamento.');
    novo.etapa = novo.volta === 5 ? 'resultado' : 'pausa';
  } else if (acao === 'proxima') {
    if (!mestre || novo.etapa !== 'pausa') return falha('A próxima volta abre durante a pausa.');
    novo.volta += 1;
    novo.etapa = 'escolha';
    novo.inicia = null;
    for (const pessoa of Object.values(novo.pessoas)) Object.assign(pessoa,{sala:'',turno:null,energia:5});
    for (const equipe of novo.equipes) { equipe.pulso = 0; equipe.raio = 0; equipe.trocas = null; }
  } else if (acao === 'escolher') {
    if (!p || !Object.hasOwn(salas, valor) || novo.etapa !== 'escolha' && (novo.etapa !== 'investigacao' || p.sala || tempo(novo, agora).restante <= 0)) return falha('A sala desta volta já foi escolhida.');
    if (valor === 'reserva' && e.chave !== comando.uid) return falha('A Reserva só abre para quem está com a chave.');
    p.sala = valor;
  } else if (acao === 'oferecerChave' || acao === 'aceitarChave') {
    if (!p || novo.etapa !== 'pausa') return falha('Transfira a chave durante a pausa.');
    if (acao === 'oferecerChave') {
      if (e.chave !== comando.uid || valor === comando.uid || novo.pessoas[valor]?.equipe !== p.equipe) return falha('A chave vai para outra pessoa da sua equipe.');
      e.trocas = {de:comando.uid,para:valor};
    } else {
      if (e.trocas?.para !== comando.uid || e.chave !== e.trocas.de) return falha('A transferência não está disponível.');
      e.chave = comando.uid;
      e.trocas = null;
      adicionar(p,e,['chave'],novo.volta);
    }
  } else if (acao === 'desfazerDupla') {
    if (!p || !e.convites[valor]?.membros.includes(comando.uid)) return falha('Você não participa desta dupla.');
    delete e.convites[valor];
  } else if (acao === 'dupla') {
    const apta = p && conviteCandidatos(novo, comando.uid).find(c => c.id === valor);
    if (!apta) return falha('A dupla precisa de pistas complementares.');
    let par = e.convites[valor];
    if (!par) e.convites[valor] = par = {membros:[comando.uid,apta.parceiro], aceites:{}};
    if (!par.membros.includes(comando.uid)) return falha('O convite já foi reservado para outra dupla.');
    par.aceites[comando.uid] = true;
  } else if (acao === 'resolver') {
    if (!p || !valor || typeof valor.id !== 'string') return falha('Escolha uma atividade.');
    const bloqueio = disponivel(novo,comando.uid,valor.id,agora);
    if (bloqueio) return falha(bloqueio);
    if (!tentativaCorreta(novo,valor.id,valor.resposta)) return falha('Ainda não encaixou. Confira a pista da bancada.');
    const {id} = valor;
    if (id === 'caixa') e.chave = comando.uid;
    if (id === 'abrir') p.turno = novo.volta;
    if (id === 'enviar') { e.envio = novo.volta; p.energia -= 1; }
    if (id === 'raio') e.raio = agora + 45000;
    if (id === 'pulso') e.pulso = agora + (novo.duracao === 30 ? 15000 : 25000);
    if (id === 'fixar') p.energia -= 2;
    adicionar(p,e,atividades[id].da ?? [],novo.volta);
    if (id === 'bancada' && novo.causa === 'E') adicionar(p,e,['primeira'],novo.volta);
    const associada = ({comparar:'quadro',cruzar:'trajeto',pegadas:'pegadas'})[id];
    const par = e.convites[associada];
    if (par?.membros.includes(comando.uid) && par.membros.every(m => par.aceites[m])) {
      for (const membro of par.membros) adicionar(novo.pessoas[membro],e,atividades[id].da ?? [],novo.volta);
    }
  } else return falha('Ação desconhecida.');
  return [novo,''];
}

export const finalEquipe = e => ({titulo:desfecho(e.fatos), texto:finais[desfecho(e.fatos)]});
