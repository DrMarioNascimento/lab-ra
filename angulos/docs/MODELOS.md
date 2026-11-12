# Modelos 3D da cena (não aparecem para o aluno)

Origem: pasta "Nova atividade etica" do professor (11/11/2026). Os modelos vieram em pose T ou A, sem esqueleto e com 200 mil a 1 milhão de triângulos. Para a web foram:
- posicionados por código (braços baixados ou dobrados, sem rig);
- simplificados (10 a 60 mil triângulos), com texturas reduzidas para WebP e geometria comprimida (meshopt);
- recoloridos só na roupa, quando o mesmo corpo é usado por mais de uma pessoa.

| Arquivo na cena | Original | Uso |
|---|---|---|
| personal | Professor1 | personal (boné branco, camisa preta) |
| recep | Recepcionista | recepcionista |
| bia | Professora2 (legging rosa) | aluna com laudo |
| mae | Professora2 (calça vinho) | mãe do jovem |
| lara | Estagiaria | estagiária |
| kaua | Praticante (camiseta laranja) | jovem menor de idade |
| homem | Praticante (camiseta vermelha) | fornecedor no estacionamento |
| treino | Praticante (camiseta roxa) | aluno treinando na frente da vista (E2) |
| colega | Professor-ou-praticante | rapaz filmando |
| joaquim | Professor-ou-praticante (jaqueta verde) | senhor do vestiário |
| dono | Professor-ou-praticante (jaqueta azul-marinho) | dono no mezanino |
| t1 a t6 | vários, recoloridos | turma da aula funcional |
| balcao | balcao2 | recepção (2 módulos) |
| supino, maquina, torre, suporte2, halter, halter2, bola | os de mesmo nome | equipamentos |
| envelope | Envelope1 (tingido de pardo) | entrega no balcão |
| frasco | Frasco | pote no balcão e na mochila |

Não usados: Crianças (sem textura e fora do contexto da academia às 19h), Envelope2 (brasão de uma marca de terceiros), Balcao (substituído pelo balcao2).

Para substituir um modelo: gerar o GLB com o mesmo nome em `assets/modelos/` já em escala real (metros), com os pés em y = 0 e de frente para +z.
