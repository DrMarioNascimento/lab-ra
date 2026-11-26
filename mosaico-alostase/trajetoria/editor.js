import { agendaInicial, relogio, TIPOS_AGENDA } from '../motor/agenda.js';

const lerHora = (v) => {
  if (!v) return NaN;
  const [h, m] = v.split(':').map(Number);
  return h * 60 + m;
};
const valorPadrao = (tipo, inicio = 1080) => ({
  tipo, inicio, fim: (inicio + 60) % 1440, duracao: 30, intensidade: 40, carboG: 50, aguaMl: 300, sodioMg: 0,
});

export function criarEditor(container, copiar) {
  const lista = container.querySelector('[data-lista]');
  let eventos = agendaInicial();

  function desenhar() {
    lista.replaceChildren(...eventos.map((evento, indice) => {
      const linha = document.createElement('fieldset');
      linha.className = 'agenda-evento';
      const legenda = document.createElement('legend');
      legenda.textContent = `Atividade ${indice + 1}`;
      linha.append(legenda);

      function adicionar(rotulo, campo, opcoes) {
        const label = document.createElement('label');
        label.textContent = rotulo;
        const entrada = document.createElement(opcoes.escolhas ? 'select' : 'input');
        entrada.setAttribute('aria-label', rotulo);
        if (opcoes.escolhas) {
          Object.entries(opcoes.escolhas).forEach(([v, texto]) => entrada.add(new Option(texto, v)));
        } else {
          Object.assign(entrada, opcoes);
        }
        const v = evento[campo];
        entrada.value = opcoes.type === 'time' ? (Number.isFinite(v) ? relogio(v) : '') : v ?? '';
        entrada.addEventListener('input', () => {
          if (campo === 'tipo') {
            const inicio = Number.isFinite(evento.inicio) ? evento.inicio : undefined;
            eventos[indice] = valorPadrao(entrada.value, inicio);
            desenhar();
            lista.children[indice].querySelector('select').focus();
          } else {
            evento[campo] = opcoes.type === 'time' ? lerHora(entrada.value) : (entrada.value === '' ? NaN : Number(entrada.value));
          }
        });
        label.append(entrada);
        linha.append(label);
      }

      adicionar('Tipo', 'tipo', { escolhas: TIPOS_AGENDA });
      adicionar('Início', 'inicio', { type: 'time', step: 300 });
      if (['dormir', 'trabalho', 'lazer', 'estudo'].includes(evento.tipo)) adicionar('Fim', 'fim', { type: 'time', step: 300 });
      if (evento.tipo === 'exercicio') {
        adicionar('Duração', 'duracao', { escolhas: { 15: '15 min', 30: '30 min', 45: '45 min' } });
        adicionar('Intensidade', 'intensidade', { escolhas: { 30: '30% VO₂máx', 40: '40% VO₂máx', 60: '60% VO₂máx' } });
      }
      if (evento.tipo === 'refeicao') adicionar('Carboidrato (g)', 'carboG', { type: 'number', min: 0, max: 100 });
      if (evento.tipo === 'bebida') {
        adicionar('Água (mL)', 'aguaMl', { type: 'number', min: 0, max: 1000 });
        adicionar('Sódio (mg)', 'sodioMg', { type: 'number', min: 0, max: 1500 });
      }
      const remover = document.createElement('button');
      remover.type = 'button';
      remover.className = 'btn sec sm';
      remover.textContent = 'Remover';
      remover.setAttribute('aria-label', `Remover atividade ${indice + 1}`);
      remover.addEventListener('click', () => {
        eventos.splice(indice, 1);
        desenhar();
        (lista.children[indice]?.querySelector('select') ?? container.querySelector('[data-adicionar]')).focus();
      });
      linha.append(remover);
      return linha;
    }));
    container.querySelector('[data-adicionar]').disabled = eventos.length >= 48;
  }

  container.querySelectorAll('[data-modelo]').forEach((btn) => btn.addEventListener('click', () => {
    eventos = agendaInicial(btn.dataset.modelo === 'noturno');
    desenhar();
  }));
  container.querySelector('[data-copiar]').addEventListener('click', () => copiar(eventos));
  container.querySelector('[data-adicionar]').addEventListener('click', () => {
    eventos.push(valorPadrao('lazer'));
    desenhar();
    lista.lastElementChild.querySelector('select').focus();
  });
  desenhar();
  return {
    ler: () => eventos.map((e) => ({ ...e })),
    carregar: (novos) => {
      eventos = novos.map((e) => ({ ...e }));
      desenhar();
    },
  };
}
