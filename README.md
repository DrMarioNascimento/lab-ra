# Lab RA

Laboratório de realidade aumentada — separado do hub Dragon Games / MOSAICO.

**Entrar:** [drmarionascimento.github.io/lab-ra/](https://drmarionascimento.github.io/lab-ra/)

## O que há aqui

Conteúdo migrado de `DrMarioNascimento/Dragon/laboratorio-ra`:

| Bancada | Arquivo |
|---|---|
| Escala e imprecisão (câmera) | `comparacao.html` |
| Escrivaninha circulável (3D/AR) | `laboratorio-ra.html` + `escrivaninha.glb` |
| Gaveta e papel | `gaveta-e-papel.html` + `escrivaninha-gaveta.glb` |
| A marca partida (anamorfose) | `a-marca-partida.html` |
| Cadeia · três telas | `cadeia-*.html` + `cadeia.js` |
| Do músculo ao sarcômero | `musculo-sarcomero/` |

A porta de entrada (`index.html`) autentica com Google contra `config/mestres` no projeto Firebase **mosaico-game**. As bancadas ficam em `bancadas.html` (protegidas por `guard.js` + `sessionStorage`).

## GitHub Pages

1. Settings → Pages → Source: **Deploy from a branch**
2. Branch: `main` / folder: `/ (root)`
3. O arquivo `.nojekyll` evita o processamento Jekyll dos assets.

Domínio autorizado no Firebase Auth (mosaico-game): `drmarionascimento.github.io`.

## Dependências mínimas copiadas

- `brand/` — marca Dragon
- `vendor/v1/js/tarefa-sensor.js` (+ `sensor-casa-da-costa-v2.js`) — protocolo de sensor usado por A marca partida
