# Modelos 3D da cena (não aparecem para o aluno)

Origem: pasta "Nova atividade etica" do professor (11 e 12/11/2026). Os modelos vieram em pose T ou A, sem esqueleto e com 200 mil a 1 milhão de triângulos. Para a web foram:
- posicionados por código (braços baixados ou dobrados, sem rig);
- simplificados (10 a 60 mil triângulos), com texturas reduzidas para WebP e geometria comprimida (meshopt);
- recoloridos só na roupa, quando o mesmo corpo é usado por mais de uma pessoa.

| Arquivo na cena | Original | Uso |
|---|---|---|
| personal | Professor1 | personal (boné branco, camisa preta) |
| recep | Recepcionista | recepcionista |
| bia | Professora2 (legging rosa) | aluna com laudo |
| mae | Mae | mãe do jovem |
| lara | Estagiaria | estagiária |
| kaua | Jovem-laranja | jovem menor de idade, em pé ao lado do supino |
| homem | Praticante (camiseta vermelha) | fornecedor no estacionamento |
| treino | Praticante (camiseta roxa) | aluno treinando na frente da vista (E2) |
| colega | Professor-ou-praticante | rapaz filmando |
| joaquim | senhor | senhor grisalho do vestiário, com a sacola |
| dono | Social | dono no mezanino |
| t1 a t6 | vários, recoloridos | turma da aula funcional |
| balcao | balcao2 | recepção (2 módulos) |
| supino, maquina, torre, suporte2, halter, halter2, bola | os de mesmo nome | equipamentos |
| envelope | Envelope1 (tingido de pardo) | na mão da aluna, na entrega no balcão |
| frasco | Frasco | pote no balcão e na mochila |
| deitado | Jovem-academia-esqueleto (camiseta azul) | aluno deitado no banco do supino; único com esqueleto, pose tirada do fim da animação "Lie_Down" |
| banco, celular, lixeira, sacola | os de mesmo nome | banco da mochila, celular do rapaz que filma, lixeiras do corredor, sacola de farmácia do senhor |
| mesa1 | Mesa1 | mesa da sala de avaliação (receita e celular em cima) |
| mesa2 | Mesa2 | mesa do dono no mezanino (contrato em cima) |
| mochila | Mochila | mochila aberta no banco, com o pote |
| prateleira | Prateleira2 | prateleira de suplementos da recepção |
| carro | Carro | carro do fornecedor no estacionamento (porta-malas aberto, caixas dentro) |

Não usados: Crianças (sem textura e fora do contexto da academia às 19h), Envelope2 (brasão de uma marca de terceiros), Balcao (substituído pelo balcao2), Prateleira (frascos de poção em estilo fantasia; substituída pela Prateleira2), Mesa (carteira escolar; substituída por Mesa1 e Mesa2).

Para substituir um modelo: gerar o GLB com o mesmo nome em `assets/modelos/` já em escala real (metros), com os pés em y = 0 e de frente para +z.
