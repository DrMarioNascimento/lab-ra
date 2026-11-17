# Mosaico Alostase · andamento

Versão de projeto, não aparece para o aluno. Atualizado em 17/11/2026, 18h45.

Endereço: `lab-ra.dragongames.dev.br/mosaico-alostase/` · card 08 na biblioteca do LAB-RA.

## Onde paramos

Dia de trabalho de 17/11/2026: o projeto saiu do GDD e virou protótipo jogável no celular, com dois modos, dia e semana 1, e um desafio com perfis. Tudo publicado. **Nada foi testado em iPhone real nem em TV.**

## O que existe

| Parte | Estado |
|---|---|
| GDD | v0.4 (`docs/GDD-mosaico-alostase-v0.4.md`) |
| Fichas de literatura | 00 a 07 em `docs/fichas/`, todas com partes ainda por ler |
| Motor de um dia | Cortisol (soro), glicemia e necessidade de sono; exercício, jornada noturna, noite ativa com álcool |
| Motor da semana 1 | Sete dias contínuos; dívida de sono em horas de vigília em excesso; REM perdido somado |
| Modo Prognóstico | Um dia (6 rotinas) e semana 1 (4 semanas prontas) |
| Modo Diagnóstico | Rotina livre (dia e semana) e Desafio da semana (3 perfis) |
| Testes | 43, todos passando (`npm test` nesta pasta) |

## Decisões do professor em 17/11/2026

- Nome: Mosaico Alostase, terceira versão ao lado do Alostase e do Mosaico Lastro.
- Variáveis: "estimáveis" e "observáveis". Modos: Prognóstico e Diagnóstico.
- Linha do tempo: 24 h na semana 1, semanal nas semanas 2 a 8, mensal até 1 ano.
- Longo prazo só com meta-análise, revisão sistemática ou estudo longitudinal; senão, extrapolação declarada.
- Trabalho noturno e vida noturna ativa entram na base (público jovem).
- Exercício físico tratado como jornada; esporte competitivo fica para depois.
- Perfil 3 do desafio: aula na semana e trabalho em eventos esportivos no fim de semana.
- O custo precisa estar à vista ("é esse tipo de coisa que precisa se ver"): cartão "O que este dia/esta semana custa" abre as telas.
- Glicemia identificada como de jejum ou pós-prandial; o pico de 143 mg/dL é explicado.
- "Pressão de sono" passa a se chamar "necessidade de sono" na tela, com a nota "não é pressão arterial".

## Suposições de Claude que aguardam conferência do professor

1. Horários e metas de estudo dos três perfis (cenário inventado).
2. Horário do evento esportivo: 6h às 16h, com uma hora de ida e outra de volta.
3. Exercício a 60% e 80% do VO2máx: ponto médio de dois estudos que divergem.
4. Subida da glicemia proporcional aos gramas de carboidrato (só 50 g tem dado).
5. Pagamento da dívida de sono hora por hora (a literatura sugere recuperação mais lenta).
6. Faixa aceita da dívida: 0,73 h vezes os dias corridos.
7. Frase sobre o critério de 140 mg/dL em 2 horas: escrita de conhecimento geral, sem ficha.
8. "Prova" fora do motor (falta tamanho do efeito em soro); o jogo não pede o cortisol em volta dela.
9. Aviso reforçado no modo Diagnóstico.
10. Manual do "i" ficou mais longo; pode precisar enxugar.

## Perguntas em aberto para o professor

- Pressão arterial: só o perfil saudável ou também um perfil hipertenso?
- PDF de Scheer e colegas (2009) no Drive, para a glicemia na jornada noturna.
- Ícones 3D: o jogo não tem nenhum; falta a lista de prompts.
- Incluir o Mosaico Alostase no Acervo (depende do gerador no PC).

## Próximo passo combinado

**Frequência cardíaca e pressão arterial**, com ficha antes de qualquer número. Fontes já localizadas, nenhuma lida inteira:

- Degaute e colegas, 1991: perfil de 24 h de pressão e frequência cardíaca em 31 homens jovens, com registro de sono.
- Phillips e colegas, 2023: frequência cardíaca de repouso ao longo de 24 h (433 pessoas; 54,5 bpm de dia e 50,5 à noite, lido só no resumo).
- Hipotensão pós-exercício: revisão de Marques-Silvestre e colegas; Brito, Queiroz e Forjaz, 2014.
- Swain e colegas: relação entre % da frequência cardíaca de reserva e % do VO2 de reserva.

Depois, pela ordem sugerida: conta de Treino; sala de aula com telão e `/simulador`; semanas 2 a 8 e meses por último.

## O que falta do GDD

Variáveis (3 de cerca de 20); contas de Estresse, Energia e Treino, juros, cobrança entre contas e moeda; semanas 2 a 8 e meses 3 a 12; virada de turno e ajuste do relógio; noite ativa como bloco próprio; perfis de corpo; modos "uma variável só" e dedução inversa; sala de aula; personagem 3D.

## Pendências fora deste projeto (mesma sessão)

- Rodar `_Acervo\atualizar-catalogo.cmd` (Mosaico Card Viagens no Acervo).
- Playtest de 28/11, principalmente do Mosaico Card; decisões do Mosaico Card aguardam o resultado.
- LAB-RA: 7 testes do Dilema do Bonde em RA e de texturas já falhavam antes e não foram tocados.
