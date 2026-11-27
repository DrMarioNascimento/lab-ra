import { agendaEscala, agendaInicial, agendaLuzPlantao, DIAS_AGENDA, relogio, TIPOS_AGENDA, TODOS_DIAS, tipoIntervalo } from '../motor/agenda.js?v=3';

import { agendaCompararLanche } from '../motor/glicemia-rotinas.js?v=2';

const lerHora = (v) => {
  if (!v) return NaN;
  const [h, m] = v.split(':').map(Number);
  return h * 60 + m;
};
const valorPadrao = (tipo, inicio = 1080) => ({
  tipo, inicio, fim: (inicio + 60) % 1440, duracao: 30, intensidade: 40, carboG: 50, aguaMl: 300, sodioMg: 0, ritmo: 6, lux: 100,
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
            eventos[indice] = { ...valorPadrao(entrada.value, inicio), dias: evento.dias };
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
      if (tipoIntervalo(evento.tipo)) adicionar('Fim', 'fim', { type: 'time', step: 300 });
      if (evento.tipo === 'luz') adicionar('Iluminância (lux)', 'lux', { type: 'number', min: 0, max: 10000, step: 'any' });
      if (evento.tipo === 'biofeedback') adicionar('Ritmo orientado', 'ritmo', { escolhas: { 5: '5 ciclos/min', 6: '6 ciclos/min', 7: '7 ciclos/min' } });
      if (evento.tipo === 'exercicio') {
        adicionar('Duração', 'duracao', { escolhas: { 15: '15 min', 30: '30 min', 45: '45 min' } });
        adicionar('Intensidade', 'intensidade', { escolhas: { 30: '30% VO₂máx', 40: '40% VO₂máx', 60: '60% VO₂máx' } });
      }
      if (evento.tipo === 'refeicao') adicionar('Carboidrato (g)', 'carboG', { type: 'number', min: 0, max: 100 });
      if (evento.tipo === 'bebida') {
        adicionar('Água (mL)', 'aguaMl', { type: 'number', min: 0, max: 1000 });
        adicionar('Sódio (mg)', 'sodioMg', { type: 'number', min: 0, max: 1500 });
      }
      const dias = document.createElement('div');
      dias.className = 'dias-evento';
      dias.setAttribute('role', 'group');
      dias.setAttribute('aria-label', 'Dias em que a atividade começa');
      DIAS_AGENDA.forEach((nome, i) => {
        const label = document.createElement('label');
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = (evento.dias ?? TODOS_DIAS).includes(i);
        box.setAttribute('aria-label', nome);
        box.addEventListener('change', () => {
          evento.dias = Array.from(dias.querySelectorAll('input')).flatMap((item, dia) => item.checked ? [dia] : []);
        });
        label.append(box, nome);
        dias.append(label);
      });
      linha.append(dias);
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
    container.querySelector('[data-pausa]').disabled = eventos.length >= 48;
  }

  container.querySelectorAll('[data-modelo]').forEach((btn) => btn.addEventListener('click', () => {
    eventos = agendaInicial(btn.dataset.modelo === 'noturno');
    desenhar();
  }));
  container.querySelector('[data-carregar-escala]').addEventListener('click', () => {
    const modelo = container.querySelector('[data-escala]').value;
    const modelos = {
      luzSuave: () => agendaLuzPlantao(100),
      luzIntensa: () => agendaLuzPlantao(2500),
      carboAs19: () => agendaCompararLanche(0),
      carboAs0030: () => agendaCompararLanche(10),
    };
    eventos = modelos[modelo]?.() ?? agendaEscala(modelo);
    desenhar();
  });
  container.querySelector('[data-pausa]').addEventListener('click', () => {
    const tipo = container.querySelector('[data-tipo-pausa]').value;
    eventos.push({ ...valorPadrao(tipo, 1020), fim: 1030, dias: [0, 1, 2, 3, 4] });
    desenhar();
    lista.lastElementChild.querySelector('select').focus();
  });
  container.querySelector('[data-copiar]').addEventListener('click', () => copiar(eventos));
  container.querySelector('[data-adicionar]').addEventListener('click', () => {
    eventos.push(valorPadrao('lazer'));
    desenhar();
    lista.lastElementChild.querySelector('select').focus();
  });
  desenhar();
  return {
    ler: () => structuredClone(eventos),
    carregar: (novos) => {
      eventos = structuredClone(novos);
      desenhar();
    },
  };
}
