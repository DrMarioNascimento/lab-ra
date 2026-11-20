#!/bin/sh
# Regera sala/conteudo.js a partir de ../game.js (dados dos 15 casos e montagem das pistas).
cd "$(dirname "$0")/.." || exit 1
L=$(grep -n "^const TIME_PATHS" game.js | cut -d: -f1)
{
echo "// Conteúdo do Loop (cópia própria de ../game.js, só os dados e a montagem das pistas)."
echo "// Usado pelo telão e pelo simulador. Se o conteúdo mudar em game.js, gere este arquivo de novo (sala/gerar-conteudo.sh)."
sed -n "3,$((L-1))p" game.js | grep -v '^const \$=id\|^const storageKey\|^let state\|^function load\|^function save\|^function chooseCase'
echo "export { ANDARES, ROOMS, EVENTS, ALARMS, FIGURES, ACTIONS, CASES, labels, figures, makeClues, esc };"
} > sala/conteudo.js
