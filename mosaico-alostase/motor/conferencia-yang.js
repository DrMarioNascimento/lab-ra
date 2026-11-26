import { MINUTOS_DIA, simularCardiovascular } from './cardiovascular.js';
import { aplicarCargaRestricao, proximaCargaRestricao } from './restricao-sono.js?v=2';

const SONO_LONGO = [23 * 60, 7 * 60];
const SONO_CURTO = [3 * 60, 7 * 60];
const VIGILIA = 11 * 60;
const QUATRO_HORAS = 240;
const curvas = {
  longo: simularCardiovascular({ sono: SONO_LONGO }),
  curto: simularCardiovascular({ sono: SONO_CURTO }),
};

function media(curva, campo, inicio, duracao) {
  let soma = 0;
  for (let min = 0; min < duracao; min++) soma += curva[(inicio + min) % MINUTOS_DIA][campo];
  return soma / duracao;
}

function resumo(curva, inicioSono) {
  const pasSono = media(curva, 'sis', inicioSono, QUATRO_HORAS);
  const padSono = media(curva, 'dia', inicioSono, QUATRO_HORAS);
  const pasVigilia = media(curva, 'sis', VIGILIA, 720);
  const padVigilia = media(curva, 'dia', VIGILIA, 720);
  return {
    pasSono, padSono, pasVigilia, padVigilia,
    quedaPas: 100 * (1 - pasSono / pasVigilia), quedaPad: 100 * (1 - padSono / padVigilia),
    pas20: media(curva, 'sis', VIGILIA, 1200), pad20: media(curva, 'dia', VIGILIA, 1200),
    pas24: media(curva, 'sis', 0, 1440), pad24: media(curva, 'dia', 0, 1440),
  };
}

export function simularProtocoloYang() {
  // 21 noites em 22 dias de internação. Dia da série é a data de início da noite.
  const controle = resumo(curvas.longo, SONO_LONGO[0]);
  const noites = [];
  let carga = 0;
  for (let dia = 1; dia <= 21; dia++) {
    const bloco = dia >= 4 && dia <= 19 ? Math.floor((dia - 4) / 4) + 1 : null;
    const curta = bloco !== null && (dia - 4) % 4 < 3;
    const sono = curta ? SONO_CURTO : SONO_LONGO;
    const fase = dia < 3 ? 'Adaptação' : dia === 3 ? 'Basal' : curta ? 'Restrição' : 'Recuperação';
    carga = proximaCargaRestricao(carga, curta ? 240 : 480, 2, 480);
    const pressao = resumo(aplicarCargaRestricao(curvas[curta ? 'curto' : 'longo'], carga), sono[0]);
    noites.push({ dia, fase, bloco, curta, sono, controle, ...pressao });
  }
  return noites;
}
