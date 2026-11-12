# Ângulos · Deliberação ética em equipe

Protótipo de teste no LAB-RA. Cada grupo é um papel numa academia (recepção, equipe técnica, estagiários, gestão, responsável técnico, alunos, família) e vê a mesma cena 3D de um ângulo diferente. A atividade segue o roteiro de deliberação ética em três níveis: individual (uma foto), grupo (as fotos do papel + relato para outro papel) e intergrupos (laboratório de decisões, confronto 360° e "duas semanas depois").

- `simulador/`: aula simulada no PC (telão em cima, turma embaixo, alunos em piloto automático).
- `js/content/cena.js`: papéis, pessoas, fotos (câmeras), frases, cartas, alternativas e efeitos.
- `js/content/roteiro.js`: as 7 paradas da viagem pelo roteiro.
- `js/scene3d.js`: cena 3D (three.js local em `vendor/`, modelos GLB em `assets/modelos/`), fotos por câmera e visor 360°.
- `js/engine.js`: motor da sala. `docs/`: notas de projeto (não aparecem para o aluno).

A versão definitiva vai para repositório próprio com Firebase.
