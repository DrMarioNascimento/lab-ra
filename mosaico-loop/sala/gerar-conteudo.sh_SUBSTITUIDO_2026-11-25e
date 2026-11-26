#!/bin/sh
# Regera sala/conteudo.js a partir de ../game.js (dados dos 15 casos e montagem das pistas).
cd "$(dirname "$0")/.." || exit 1
L=$(grep -n "^const TIME_PATHS" game.js | cut -d: -f1)
{
echo "// Conteúdo do Loop (cópia própria de ../game.js, só os dados e a montagem das pistas)."
echo "// Usado pelo telão e pelo simulador. Se o conteúdo mudar em game.js, gere este arquivo de novo (sala/gerar-conteudo.sh)."
sed -n "3,$((L-1))p" game.js | grep -v '^const \$=id\|^const storageKey\|^let state\|^function load\|^function save\|^function chooseCase'
# Resposta certa das 8 perguntas, para o telão (a mesma regra do truth() do game.js).
sed -n '/^const CASE_PATHS/,/^];/p' game.js
echo "const EIXOS8 = [['event','O quê'],['where','Onde'],['when','Quando'],['how','Como'],['alarm','Por quê'],['figure','Quem'],['predict','Previsão'],['action','Intervenção']];"
echo "const verdade = (caso, k) => { const c = CASES[caso]; return k === 'where' ? c.room : k === 'when' || k === 'how' ? CASE_PATHS[caso] : k === 'predict' ? 'retorno' : c[k]; };"
echo "export { ANDARES, INICIO, ROOMS, LOOP_SALAS, sala, definirMuseu, sortearMuseu, montarMuseu, nomear, EVENTS, ALARMS, FIGURES, ACTIONS, CASES, labels, figures, makeClues, esc, CASE_PATHS, EIXOS8, verdade };"
} > sala/conteudo.js
