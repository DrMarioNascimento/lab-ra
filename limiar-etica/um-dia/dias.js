// Limiar Ético · registro dos dias jogáveis. O dia da empresa é o completo (com retomadas e cenas condicionais);
// os outros são dias simples (escola, academia, laboratório, clube e reabilitação com dez cenas, bairro com onze), com o mesmo sorteio por nível e o mesmo retorno.
import * as E from './dados.js?v=2.3';
import * as ESCOLA from './dia-escola.js?v=2.3';
import * as BAIRRO from './dia-bairro.js?v=2.3';
import * as ACADEMIA from './dia-academia.js?v=2.3';
import * as PESQUISA from './dia-pesquisa.js?v=2.3';
import * as CLUBE from './dia-clube.js?v=2.3';
import * as REAB from './dia-reabilitacao.js?v=2.3';
import * as EVEN from './dia-evento.js?v=2.3';
import * as ESTA from './dia-estagio.js?v=2.3';

export const DIAS = {
  empresa: {
    id: 'empresa', completo: true, instituicao: 'a empresa',
    nome: 'Um dia no trabalho e na faculdade', resumo: 'Evento à noite, trabalho em grupo para entregar e uma consulta da sua mãe.',
    ABERTURA: E.ABERTURA, CENAS: E.CENAS, CONTEXTOS: E.CONTEXTOS, VALORES: E.VALORES, APLICACAO: E.APLICACAO, FECHAMENTO: null
  },
  escola: {
    id: 'escola', completo: false, instituicao: 'a escola',
    nome: 'Um dia na escola', resumo: 'Estágio em uma escola pública: aulas, violência no entorno, materiais e jogos escolares.',
    ABERTURA: ESCOLA.ABERTURA, CENAS: ESCOLA.CENAS, CONTEXTOS: ESCOLA.CONTEXTOS, VALORES: ESCOLA.VALORES, APLICACAO: ESCOLA.APLICACAO, FECHAMENTO: ESCOLA.FECHAMENTO
  },
  bairro: {
    id: 'bairro', completo: false, instituicao: 'o projeto',
    nome: 'Um dia no projeto do bairro', resumo: 'Iniciação esportiva em uma comunidade, onde a violência do entorno entra na rotina.',
    ABERTURA: BAIRRO.ABERTURA, CENAS: BAIRRO.CENAS, CONTEXTOS: BAIRRO.CONTEXTOS, VALORES: BAIRRO.VALORES, APLICACAO: BAIRRO.APLICACAO, FECHAMENTO: BAIRRO.FECHAMENTO
  },
  academia: {
    id: 'academia', completo: false, instituicao: 'a academia',
    nome: 'Um dia na academia', resumo: 'Estágio em academia e personal: triagem, suplementos, imagem corporal, metas de venda e sigilo.',
    ABERTURA: ACADEMIA.ABERTURA, CENAS: ACADEMIA.CENAS, CONTEXTOS: ACADEMIA.CONTEXTOS, VALORES: ACADEMIA.VALORES, APLICACAO: ACADEMIA.APLICACAO, FECHAMENTO: ACADEMIA.FECHAMENTO
  },
  pesquisa: {
    id: 'pesquisa', completo: false, instituicao: 'o laboratório',
    nome: 'Um dia no laboratório', resumo: 'Iniciação científica: consentimento, dados que atrapalham, autoria, privacidade e eventos adversos.',
    ABERTURA: PESQUISA.ABERTURA, CENAS: PESQUISA.CENAS, CONTEXTOS: PESQUISA.CONTEXTOS, VALORES: PESQUISA.VALORES, APLICACAO: PESQUISA.APLICACAO, FECHAMENTO: PESQUISA.FECHAMENTO
  },
  clube: {
    id: 'clube', completo: false, instituicao: 'o clube',
    nome: 'Um dia no clube', resumo: 'Categorias de base de um clube: lesão antes da final, substâncias, seleção de atletas, vestiário e promessas a famílias.',
    ABERTURA: CLUBE.ABERTURA, CENAS: CLUBE.CENAS, CONTEXTOS: CLUBE.CONTEXTOS, VALORES: CLUBE.VALORES, APLICACAO: CLUBE.APLICACAO, FECHAMENTO: CLUBE.FECHAMENTO
  },
  reabilitacao: {
    id: 'reabilitacao', completo: false, instituicao: 'o programa',
    nome: 'Um dia na reabilitação cardiovascular', resumo: 'Hospital-escola: segurança do exercício, sintomas, medicação, informação à família, prontuário e vagas.',
    ABERTURA: REAB.ABERTURA, CENAS: REAB.CENAS, CONTEXTOS: REAB.CONTEXTOS, VALORES: REAB.VALORES, APLICACAO: REAB.APLICACAO, FECHAMENTO: REAB.FECHAMENTO
  },
  evento: {
    id: 'evento', completo: false, instituicao: 'a escola',
    nome: 'Um dia no evento da escola', resumo: 'Passeio e festival esportivo: autorizações, transporte, calor, times, regras, patrocínio, primeiros socorros, resultado e relatório.',
    ABERTURA: EVEN.ABERTURA, CENAS: EVEN.CENAS, CONTEXTOS: EVEN.CONTEXTOS, VALORES: EVEN.VALORES, APLICACAO: EVEN.APLICACAO, FECHAMENTO: EVEN.FECHAMENTO
  },
  estagio: {
    id: 'estagio', completo: false, instituicao: 'a escola',
    nome: 'Um dia no estágio', resumo: 'Estagiário na escola: presença, tarefas fora do plano, relatório, família, redes sociais, adaptação, castigo, pesquisa e limites.',
    ABERTURA: ESTA.ABERTURA, CENAS: ESTA.CENAS, CONTEXTOS: ESTA.CONTEXTOS, VALORES: ESTA.VALORES, APLICACAO: ESTA.APLICACAO, FECHAMENTO: ESTA.FECHAMENTO
  }
};
export const ORDEM_DIAS = ['empresa', 'escola', 'bairro', 'academia', 'pesquisa', 'clube', 'reabilitacao', 'evento', 'estagio'];
