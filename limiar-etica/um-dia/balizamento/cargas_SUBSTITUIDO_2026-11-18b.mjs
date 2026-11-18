// Limiar Ético · balizamento interno da carga de estresse das cenas.
// USO DE PROJETO: este arquivo NÃO é carregado pela página e não aparece para o aluno.
//
// A PSS-10 (Cohen, Kamarck & Mermelstein, 1983; Cohen & Williamson, 1988; adaptação brasileira de
// Reis, Hino & Añez, 2010) serve aqui só como RÉGUA DO AUTOR: dez temas, cada um com frequência de 0 a 4
// ("nunca" a "muito frequentemente"), somados de 0 a 40. Os temas abaixo são rótulos curtos, não o texto
// dos itens (o instrumento oficial deve ser obtido com o autor). Os quatro temas de enfrentamento (4, 5, 7 e 8)
// já estão registrados na direção do estresse (4 menos a nota do item), então a soma é comparável ao total da escala.
//
// Cada nota responde: "numa pessoa comum nesta situação, com que frequência esta vivência apareceria?"
// São notas de autoria, ainda sem avaliadores independentes: servem para comparar cenas e dias
// entre si, não para medir ninguém e não têm ponto de corte clínico (a PSS não tem).

export const TEMAS = [
  'inesperado',            // 1
  'controle do que importa', // 2
  'tensão e nervosismo',   // 3
  'confiança em lidar',    // 4 (invertido)
  'rumo favorável',        // 5 (invertido)
  'dar conta de tudo',     // 6
  'manejo de irritações',  // 7 (invertido)
  'domínio da situação',   // 8 (invertido)
  'raiva do que escapa',   // 9
  'dificuldades acumuladas'// 10
];

// Notas por cena, já na direção do estresse. Ordem = TEMAS.
export const CARGAS = {
  mensagem:   [3, 2, 2, 1, 1, 1, 2, 1, 1, 1],
  nome:       [3, 2, 3, 2, 2, 2, 2, 2, 2, 2],
  numero:     [1, 2, 2, 1, 1, 1, 1, 1, 1, 1],
  horario:    [2, 3, 3, 3, 3, 3, 2, 3, 3, 3],
  troca:      [3, 2, 3, 2, 2, 2, 2, 2, 1, 2],
  verba:      [3, 3, 3, 2, 2, 3, 1, 3, 2, 3],
  figurinha:  [1, 1, 2, 1, 1, 2, 2, 1, 2, 2],
  ligacao:    [3, 3, 3, 3, 3, 3, 2, 3, 2, 3],
  fotos:      [1, 3, 2, 2, 2, 2, 2, 2, 2, 2],
  interprete: [4, 2, 4, 3, 3, 3, 2, 3, 2, 3],
  volta:      [2, 2, 3, 3, 3, 3, 2, 3, 2, 4]
};

// Faixas internas (só comparativas, não clínicas), por soma de 0 a 40.
export const FAIXAS = [
  { ate: 13, nome: 'leve' },
  { ate: 21, nome: 'moderada' },
  { ate: 27, nome: 'alta' },
  { ate: 40, nome: 'limite' }
];

export const soma = notas => notas.reduce((a, b) => a + b, 0);
export const faixa = s => FAIXAS.find(f => s <= f.ate).nome;

export function relatorio() {
  const linhas = Object.entries(CARGAS).map(([id, n]) => ({ id, total: soma(n), faixa: faixa(soma(n)) }));
  const media = linhas.reduce((a, l) => a + l.total, 0) / linhas.length;
  return { linhas, media, pico: Math.max(...linhas.map(l => l.total)), altas: linhas.filter(l => l.total >= 22).length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = relatorio();
  for (const l of r.linhas) console.log(l.id.padEnd(11), String(l.total).padStart(3), l.faixa);
  console.log(`média ${r.media.toFixed(1)} · pico ${r.pico} · cenas em faixa alta ou limite: ${r.altas} de ${r.linhas.length}`);
}
