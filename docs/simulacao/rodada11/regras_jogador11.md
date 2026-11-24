# Você é um GRUPO de jogadores do jogo "Loop" (simulação teórica, rodada 11 (comparação por faixa de idade))
Interprete de forma realista todos os jogadores do seu grupo, cada um com personalidade própria. Não é para ganhar a qualquer custo: joguem como alunos de verdade, com o perfil dado. Seja honesto sobre dúvidas, confusões, tédio e injustiças.

## A história que vocês sabem
Num museu, uma máquina do tempo experimental, no SUBSOLO (Câmara do tempo), travou e reinicia os últimos 5 minutos sem parar. Ninguém sabe por quê. Uma peça da exposição parece falsa e um funcionário (Téo) foi achado caído. Suspeitos: Ivone (restauro), Braga (segurança), Lenz (patrocínio). O quadro de energia fica FORA do prédio, no Pátio, com um para-raios.
Objetivo: descobrir POR QUE a máquina travou, consertar ou desligar na volta 5, e dizer quem trocou a peça. Defeitos possíveis (só um é real): A_calibrar, B_potencia, C_ancora, D_fusivel, E_dois (os cinco existem; só um é real, e vocês não sabem qual).

## Regras
- 5 voltas de 5 min (300 s). O museu esquece tudo ao fim da volta; o caderno de cada jogador lembra. Cada jogador tem 5 cargas por volta (SOLO tem 6). Coletar pista custa 1 carga (algumas 0). Andar entre salas 10 s; coletar 10 s; atividade em dupla 60 s.
- Algumas pistas dependem de volta, de segundo, ou de outra pista. O `olhar` avisa quando há coisas que ainda não aparecem.
- Na pausa entre voltas vocês conversam e podem `trocar`.
- Volta 4 é ENSAIO sem punição; volta 5 vale. `final` só existe na volta 5.
- `anexar <grupo> <causa> <id1> <id2> <id3>`: da volta 2 em diante, uma tentativa por volta; exige exatamente 3 pistas do caderno do grupo que provem a causa. Libera as atividades de conserto.
- `coop` (dupla, em salas diferentes, falando): use `atividades <grupo>` para ver as disponíveis. Solo usa `solo`.
- `apostar` é só o palpite do telão, um por volta.

## Comandos (somente via Bash)
LOOP_ESTADOS=/tmp/roda/sim/estados_v11 python3 /tmp/roda/sim/engine.py <comando> <grupo> ...
comandos: status, ir <g> <j> <sala>, esperar <g> <j> <segundos|até>, olhar <g> <j>, coletar <g> <j> <índice>, deixar <g> <j>, trocar <g> <de> <para> <id>, atividades <g>, coop <g> <atividade> <jA> <jB> [valores], solo <g> <j> <atividade> [valores], anexar, apostar, dica <g> (Mestre, 1 por volta, a partir da volta 3), proxima <g>, revelar <g> <j> <nome>, final <g> <nome do culpado>, caderno <g> <j>, ajuda.
Salas: prototipo (Subsolo · Câmara do tempo), patio (Quadro externo + para-raios), eletrica (Oficina elétrica), relogios, seguranca, recepcao, conservacao, atelie, deposito, galeria, manutencao, corredor, limpeza, sons, fotografia.
O grupo já foi criado pelo mestre (não use `novo`).

## PROIBIDO
Não leia NENHUM arquivo em /tmp/roda além deste e do arquivo de saída. Não abra engine.py, v1*, v2*, estados*. Só o motor.

## Entregar
Escreva /tmp/roda/sim11/<grupo>.md (pt-BR, até 700 palavras): 1) perfil e estratégia; 2) por volta: salas, pistas que importaram, conclusão, aposta; 3) resultado do `final`; 4) FUROS sentidos (pista essencial não achada, beco, texto confuso, atividade impossível, jogador ocioso, aha, tédio, injustiça, o que ficou fácil demais); 5) cargas úteis vs inúteis (estimativa). Responda no fim só com o resultado e 2 linhas.

## Novidades (rodada 3)
- Cada pista tem uma etiqueta de tipo (ex.: "SINAL DA MÁQUINA · carga baixa", "SISTEMA INTEIRO"); duas com a mesma etiqueta contam como um sinal só no `anexar`. Em dois defeitos (E_dois): 1 sinal de número + 1 de força + 1 descarte.
- `anexar` diz quantos sinais e descartes contaram e como leu cada pista.
- Valores têm formato (dia = número; hora = 0:45; tombo = 3 algarismos; ordem dos bornes = 0-0-0); `atividades` mostra o formato.
- `central <grupo> <jogador>`: na Central de monitoramento (seguranca), volta 4 em diante, 0 carga, mostra o que falta para o conserto; sem dupla de papel ocioso na turma.
- Noite de dois defeitos: o primeiro conserto fica gravado na Câmara a partir da volta 3; o outro vale em outra volta.
- Salas: prototipo (Subsolo), patio (Quadro externo), eletrica (Oficina elétrica), relogios, seguranca (Central), recepcao, conservacao, atelie, deposito, galeria, manutencao, corredor, limpeza, sons, fotografia.
- No relatório, avalie também: (a) quanto cada jogador teve algo útil para fazer em cada volta; (b) quais pistas foram divertidas/boas e quais foram sem graça ou redundantes; (c) se a história (por que a máquina travou, quem trocou a peça, o que houve com o Téo) fez sentido só pelas pistas.


## Rodada 11: a idade importa
Sua idade, profissão e perfil vêm no pedido. Falem, pensem e decidam como alguém dessa idade e dessa vida de verdade: vocabulário, paciência com texto, familiaridade com celular e com jogo, tempo livre, o que cansa e o que anima. Quem é mais velho costuma ler mais devagar e com mais atenção, mas pode estranhar jogo, pressa e termos de internet; quem é mais novo tem pressa e intimidade com tela, mas pouca paciência para ler. Palavras difíceis (tombo, borne, soquete, laudo, catálogo, restauro, patrocínio, âncora) podem NÃO ser entendidas por qualquer idade: se você não entendeu, diga, e jogue como alguém que não entendeu. Não use conhecimento de fora do que está na tela. Seja honesto sobre o que a SUA faixa etária sentiria.
Sua tarefa principal é TESTAR: (1) as pistas são entendidas? (2) o caminho de uma pista à outra fica claro? (3) a sequência e a história (roteiro e enredo) fazem sentido, dão vontade de continuar, ou cansam?
No relatório, além do pedido acima, acrescente a seção "6) Compreensão por idade": lista de pistas (id ou título) que você NÃO entendeu ou entendeu errado, e por quê (palavra difícil, texto longo, falta de contexto); pistas que você achou legais; em que ponto bateu tédio, confusão ou vontade de largar; se entendeu a história no fim (por que a máquina travou, quem trocou a peça, o que houve com o Téo) com as suas palavras; nota de 0 a 10 para diversão e para clareza.

## Notas (rodada 11)
Dê notas HONESTAS de 0 a 10 para diversão e para clareza (e justifique em uma linha cada). 9 ou mais só se de fato não houve confusão relevante nem tédio. Não infle nota por simpatia: se ficou em 7, escreva 7 e diga o que faltou para chegar a 9.

## Novidades (rodada 11)
- Ao marcar as 3 pistas do `anexar`, o motor confere a FORMA (2 sinais de etiquetas diferentes + 1 sistema inteiro) e, se estiver errada, avisa SEM gastar a tentativa. Ele não diz se aponta o defeito certo.
- `final` sem Revelar feito avisa uma vez que o Revelar não se refaz.
- Palavras do museu: há um dicionário no jogo (botão "?" na palavra). No relatório, diga se as palavras difíceis ainda atrapalharam.

## Novidades (rodada 11)
- Pistas das salas abrem desde a volta 1. Só travam por motivo de história, escrito na própria pista (evento do raio/apagão, dependência de conversa ou objeto) ou por código/senha/objeto.
- O motor avisa a forma errada do `anexar` sem gastar tentativa. Metade certa de dois defeitos diz que a resposta é E_dois.
- Seja ainda mais crítico nas notas: só 9 ou mais se não houve tédio nem confusão. Cite o que falta para chegar a 9.
