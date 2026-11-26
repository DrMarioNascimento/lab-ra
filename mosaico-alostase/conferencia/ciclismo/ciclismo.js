import { REFERENCIAS_CICLISMO, simularProtocoloCalorHidrico } from '../../motor/protocolo-calor-hidrico.js?v=2';

const variaveis = {
  perdaMassaPct: { nome: 'Perda de massa corporal', min: 120, unidade: '%', delta: 'p.p.', casas: 1, ajuste: true },
  centralC: { nome: 'Temperatura retal / central', min: 120, unidade: '°C', casas: 1, ajuste: true },
  fc: { nome: 'Frequência cardíaca', min: 110, unidade: 'bpm', casas: 0 },
  volumeSistolico: { nome: 'Volume sistólico', min: 110, unidade: 'mL/bat', casas: 0 },
  debito: { nome: 'Débito cardíaco', min: 110, unidade: 'L/min', casas: 1 },
};

const el = (id) => document.getElementById(id);
const resultados = REFERENCIAS_CICLISMO.map((ref) => ({ ref, sim: simularProtocoloCalorHidrico(ref.reposicaoPct) }));
for (const [chave, v] of Object.entries(variaveis)) el('variavel').add(new Option(v.nome, chave));

function exibir() {
  const chave = el('variavel').value;
  const v = variaveis[chave];
  const formato = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: v.casas, maximumFractionDigits: v.casas });
  const sinal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: v.casas, maximumFractionDigits: v.casas, signDisplay: 'exceptZero' });
  el('tempo').textContent = `Comparação aos ${v.min} minutos`;
  el('resultados').innerHTML = resultados.map(({ ref, sim }) => {
    const ajuste = v.ajuste && [0, 81].includes(ref.reposicaoPct);
    return `<tr><th scope="row">${ref.reposicaoPct}%${ajuste ? ' †' : ''}<small>${ref.nome}</small></th>
      <td>${chave === 'perdaMassaPct' ? '' : '≈ '}${formato.format(ref[chave])} ${v.unidade}</td>
      <td>${formato.format(sim[chave])} ${v.unidade}</td>
      <td>${sinal.format(sim[chave] - ref[chave])} ${v.delta ?? v.unidade}</td></tr>`;
  }).join('');
  el('criterio').textContent = v.ajuste
    ? '† Condições usadas no ajuste. As reposições intermediárias conferem o comportamento do motor.'
    : 'Os resultados cardiovasculares aos 110 minutos foram reservados para conferência.';
}

el('variavel').addEventListener('change', exibir);
exibir();
