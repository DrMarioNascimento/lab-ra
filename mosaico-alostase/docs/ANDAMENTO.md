# Mosaico Alostase · andamento

Versão de projeto, não aparece para o aluno. Atualizado em 18/11/2026, 21h.

Endereço: `lab-ra.dragongames.dev.br/mosaico-alostase/` · card 08 na biblioteca do LAB-RA.

## Onde paramos

Dia de trabalho de 17/11/2026: o projeto saiu do GDD e virou protótipo jogável no celular, com dois modos, dia e semana 1, e um desafio com perfis. Tudo publicado. **Nada foi testado em iPhone real nem em TV.**

## O que existe

| Parte | Estado |
|---|---|
| GDD | v0.4 (`docs/GDD-mosaico-alostase-v0.4.md`) |
| Fichas de literatura | 00 a 11 em `docs/fichas/`, todas com partes ainda por ler (a 08, de frequência cardíaca e pressão, quase só resumos; a 09, de Scheer 2009, lida nos resultados; a 10, de Treino, e a 11, de Energia, só resumos) |
| Motor de um dia | Cortisol (soro), glicemia e necessidade de sono; exercício, jornada noturna, noite ativa com álcool |
| Motor da semana 1 | Sete dias contínuos; dívida de sono em horas de vigília em excesso; REM perdido somado |
| Modo Prognóstico | Um dia (6 rotinas) e semana 1 (4 semanas prontas) |
| Modo Diagnóstico | Rotina livre (dia e semana) e Desafio da semana (3 perfis) |
| Pressão arterial | Só no motor (`motor/hemodinamica.js`), de um normotenso; ainda sem tela e fora das rotinas do jogo |
| Frequência no esforço | Só no motor (`motor/treino.js`, FCmáx de Tanaka lido inteiro); sem tela |
| Testes | 52, todos passando (`npm test` nesta pasta) |

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
- Pressão arterial: só perfil saudável (decisão de 18/11/2026, porque o jogo é de fisiologia geral). Hipertensão fica fora do escopo.
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

- Glicemia na jornada noturna: Scheer 2009 foi lido (ficha 09). Decidir como entra no motor: multiplicador da subida pós-refeição com relógio mais de 6 h fora de fase?
- Ícones 3D: o jogo não tem nenhum; a lista de prompts está em `docs/ICONES-prompts-3D.md` (18/11), à espera de você gerar e substituir.
- Incluir o Mosaico Alostase no Acervo (depende do gerador no PC).

## Próximo passo

**Frequência cardíaca e pressão arterial:** a ficha 08 (18/11/2026) está escrita só com resumos. Sustentado: forma bimodal de 24 h, amplitudes relativas e a divisão sono/postura versus ritmo endógeno. Médias de pressão em normotensos e efeito crônico do trabalho noturno (+2 a +3 mmHg) já têm resumo. Falta: Degaute inteiro, média por faixa de 18 a 30 anos, frequência pós-exercício e frequência/pressão no sono diurno. Entrou no motor só a pressão arterial de normotenso (18/11, sem tela); frequência cardíaca, pós-exercício e a interface ficam esperando. Perfil: só saudável (decidido em 18/11).

Depois, pela ordem sugerida: conta de Treino (ficha 10 já escrita, só resumos); sala de aula com telão e `/simulador`; semanas 2 a 8 e meses por último.

## O que falta do GDD

Variáveis (3 de cerca de 20); contas de Estresse, Energia e Treino, juros, cobrança entre contas e moeda; semanas 2 a 8 e meses 3 a 12; virada de turno e ajuste do relógio; noite ativa como bloco próprio; perfis de corpo; modos "uma variável só" e dedução inversa; sala de aula; personagem 3D.

## Pendências fora deste projeto (mesma sessão)

- Rodar `_Acervo\atualizar-catalogo.cmd` (Mosaico Card Viagens no Acervo).
- Playtest de 28/11, principalmente do Mosaico Card; decisões do Mosaico Card aguardam o resultado.
- LAB-RA: 7 testes do Dilema do Bonde em RA e de texturas já falhavam antes e não foram tocados.


## 18/11/2026, 22h30: decisões tomadas com autorização total

- Frequência cardíaca no esforço aparece na leitura do Diagnóstico (perfil: 21 anos, ativo, VO2máx 45; modelagem).
- Glicemia com relógio fora de fase: +6% (Scheer 2009), linear de 3 a 6 h de deslocamento; só no motor (as rotinas do jogo ainda não passam deslocamento). 54 testes.
- Seguem abertos: sala ao vivo (Firebase próprio), personagem 3D, ícones 3D, semanas 2 a 8, leitura integral de Degaute, Panissa, van Loon, Gollnick, Iwayama e Salgin.
