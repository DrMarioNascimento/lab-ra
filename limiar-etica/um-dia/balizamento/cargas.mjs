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

// Alavancas: os três temas em que o contexto do nível mexe em cada cena (o frequente, o urgente, o acumulado).
// medio = nota-base acima; alto = +1 em cada alavanca; baixo = −1 em cada alavanca (sempre entre 0 e 4).
export const ALAVANCAS = {
  mensagem: [0, 2, 9], nome: [0, 8, 9], numero: [0, 5, 9], horario: [0, 3, 9], troca: [0, 5, 9],
  verba: [1, 5, 9], figurinha: [6, 8, 9], ligacao: [0, 5, 9], fotos: [0, 5, 9], interprete: [1, 3, 9]
};

// Dias novos (notas de autoria, mesma régua; ids repetidos entre dias, como 'fotos', ficam separados por dia).
export const CARGAS_DIAS = {
  escola: {
    vaga:       [3, 3, 3, 2, 2, 3, 1, 3, 1, 2],
    gol:        [3, 2, 3, 2, 2, 1, 3, 2, 2, 1],
    halter:     [3, 3, 3, 3, 3, 2, 2, 3, 2, 3],
    gravacao:   [2, 2, 2, 2, 2, 2, 1, 2, 1, 2],
    quadra:     [2, 3, 2, 2, 3, 2, 2, 3, 2, 3],
    verba:      [2, 3, 2, 2, 3, 2, 2, 3, 3, 3],
    convocacao: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    joelho:     [2, 3, 3, 3, 3, 2, 2, 3, 2, 2],
    antecessor: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    fotos:      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2]
  },
  bairro: {
    barulho:  [4, 3, 4, 3, 3, 3, 2, 3, 2, 3],
    piso:     [2, 3, 2, 2, 2, 3, 2, 2, 2, 3],
    busca:    [3, 3, 4, 3, 3, 2, 2, 3, 2, 2],
    cansaco:  [3, 3, 3, 3, 3, 2, 2, 3, 2, 2],
    torneio:  [1, 2, 2, 2, 2, 3, 2, 2, 2, 2],
    briga:    [3, 3, 4, 3, 3, 3, 3, 3, 3, 3],
    favor:    [2, 3, 3, 3, 3, 2, 3, 3, 3, 3],
    convite:  [2, 3, 3, 3, 3, 3, 2, 3, 2, 3],
    imagens:  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    plano:    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    relato:   [3, 4, 4, 4, 4, 3, 2, 4, 3, 3]
  }
};
export const ALAVANCAS_DIAS = {
  escola: {
    vaga: [0, 5, 9], gol: [0, 6, 9], halter: [0, 3, 9], gravacao: [1, 3, 9], quadra: [0, 5, 9],
    verba: [1, 7, 9], convocacao: [1, 5, 9], joelho: [1, 2, 9], antecessor: [0, 6, 9], fotos: [0, 5, 9]
  },
  bairro: {
    barulho: [1, 5, 9], piso: [1, 5, 9], busca: [0, 3, 9], cansaco: [0, 3, 9], torneio: [1, 5, 9], briga: [0, 6, 9],
    favor: [1, 6, 9], convite: [1, 3, 9], imagens: [1, 5, 9], plano: [0, 6, 9], relato: [0, 5, 9]
  }
};

export function cargaDoNivel(id, nivel, dia = 'empresa') {
  const cargas = dia === 'empresa' ? CARGAS : CARGAS_DIAS[dia];
  const alavancas = dia === 'empresa' ? ALAVANCAS : ALAVANCAS_DIAS[dia];
  const base = [...cargas[id]];
  const d = nivel === 'alto' ? 1 : nivel === 'baixo' ? -1 : 0;
  for (const i of (alavancas[id] || [])) base[i] = Math.min(4, Math.max(0, base[i] + d));
  return base;
}

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

export function relatorioDia(dia) {
  const linhas = Object.entries(CARGAS_DIAS[dia]).map(([id]) => ({
    id, baixo: soma(cargaDoNivel(id, 'baixo', dia)), medio: soma(cargaDoNivel(id, 'medio', dia)), alto: soma(cargaDoNivel(id, 'alto', dia))
  }));
  return { linhas, media: linhas.reduce((a, l) => a + l.medio, 0) / linhas.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const d of Object.keys(CARGAS_DIAS)) {
    console.log(`\n${d}`);
    for (const l of relatorioDia(d).linhas) console.log(l.id.padEnd(11), `baixo ${l.baixo} (${faixa(l.baixo)}) · médio ${l.medio} (${faixa(l.medio)}) · alto ${l.alto} (${faixa(l.alto)})`);
  }
  console.log('\nempresa');
  const r = relatorio();
  for (const l of r.linhas) console.log(l.id.padEnd(11), String(l.total).padStart(3), l.faixa);
  console.log(`média ${r.media.toFixed(1)} · pico ${r.pico} · cenas em faixa alta ou limite: ${r.altas} de ${r.linhas.length}`);
}
