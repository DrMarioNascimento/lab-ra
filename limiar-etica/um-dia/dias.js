// Limiar Ético · registro dos dias jogáveis. O dia da empresa é o completo (com retomadas e cenas condicionais);
// os outros dois são dias simples (escola com dez cenas, bairro com onze), com o mesmo sorteio por nível e o mesmo retorno.
import * as E from './dados.js?v=1.5';
import * as ESCOLA from './dia-escola.js?v=1.5';
import * as BAIRRO from './dia-bairro.js?v=1.5';

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
  }
};
export const ORDEM_DIAS = ['empresa', 'escola', 'bairro'];
