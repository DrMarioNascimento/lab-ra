# LASTRO 0.3 — validação funcional

Data: 13 de novembro de 2026. Todas as trajetórias abaixo são sintéticas, produzidas pelo próprio motor. Nenhum participante humano foi medido; consistência de software não é validação fisiológica.

## Entrega

- Campanhas de 28, 84, 180 e 365 dias; avanço de 1, 3 ou 7 dias, sempre com integração diária.
- Cinco cenários fictícios, 40 acontecimentos em oito famílias de efeito, 23 indicadores e 23 controles.
- Modo individual e presencial com quatro, cinco ou seis equipes por setores.
- Mesmo orçamento de 24 horas e mesma trajetória para todos os setores.
- Salvamento local, JSON reconstruído ao importar, CSV e relatório HTML.
- Contrafactual por estratégia de uma etapa; acontecimentos e planos restantes preservados.
- Guia completo em proposta.html. Coeficientes em life-engine.js.

## Testes automáticos

Comando: npm test.

A suíte longitudinal completou 364 campanhas e 59.466 dias simulados, incluindo 364 exportações/importações com igualdade integral dos resultados. Cruza cinco perfis, quatro horizontes, três ritmos e modos individual/4/5/6 equipes; acrescenta seis políticas contrastantes.

Verificações adicionais:

- Todos os estados finitos e dentro das faixas declaradas.
- Agenda efetiva <= 24 horas, inclusive com atraso de transporte.
- Cortes de agenda registrados e encerramento no dia exato.
- Confirmação de todos os setores exigida pelo motor.
- Distribuição equilibrada e cobertura integral dos setores em grupos de 6 a 400 pessoas; isto testa aritmética, não viabilidade pedagógica de turmas tão grandes.
- Sono curto aumenta recuperação pendente e reduz desempenho no modelo.
- Meditação altera ativação, sem repor água ou combustível.
- Estímulos aeróbios e de força produzem adaptações específicas.
- Reposição hídrica acima das perdas não oferece vantagem ilimitada.
- Óculos afetam luminosidade, sem resfriamento direto.
- Comparação alternativa mantém a sequência externa.
- Rejeição de arquivos inválidos, dias fora de sequência, planos fora de faixa e avanço após encerramento.

As suítes antigas também passaram: 241 partidas individuais, 2.178 sessões por equipes e verificações de comparação/retomada das versões anteriores.

## Verificação no navegador

Chromium:

- Abertura, configuração e campanha individual completa de 28 dias.
- Campanha completa de 28 dias com seis equipes.
- Avanço bloqueado antes das confirmações; integração bloqueada antes dos outros setores.
- Mudança do plano invalida confirmações. Foi corrigido o texto que permanecia indicando “confirmado” após uma alteração.
- Configuração e painéis de quatro equipes, com fusões de setores e divisão 9/9/9/8 para 35 participantes.
- Retomada após recarregamento preserva decisões e rascunho. As confirmações são solicitadas novamente.
- Download JSON, CSV e HTML; o JSON baixado foi importado e recuperou a campanha no dia 28.
- Contrafactual exibiu a trajetória alternativa e diferenças de resultados.
- Os 23 indicadores abriram no painel detalhado.
- Layouts de configuração, campanha e relatório sem rolagem horizontal do corpo em viewport de 337 CSS px, obtido por zoom de 400%.
- Proposta completa abriu e apresentou as tabelas de indicadores e entradas.

Não foram realizados testes em aparelho iPhone/Android físico, Safari, impressão em papel ou uso simultâneo por uma turma. O modo por setores é presencial em uma tela, sem sincronização entre aparelhos.

## Exemplos de sensibilidade — 84 dias, perfil urbano

| Rotina sintética | Compromissos (%) | Desgaste final | Dias limitados |
| --- | ---: | ---: | ---: |
| Plano padrão | 96,319 | 0 | 0 |
| Trabalho prolongado + sono curto | 43,649 | 100 | 72 |
| Repouso sem trabalho | 0 | 0 | 0 |
| Exercício intenso diário | 20,530 | 100 | 69 |
| Sono curto | 28,800 | 100 | 68 |
| Calor + reposição insuficiente | 56,450 | 100 | 15 |

Esses resultados apenas mostram que as políticas geram consequências distintas no código. Saturação em 0/100 e diferenças entre perfis ainda precisam de calibração docente; não representam probabilidades, porcentagens de dano, incidência de doença ou limites seguros.

## Limites materiais

- Coeficientes didáticos, sem ajuste conjunto a dados humanos.
- Resolução diária; o custo de minutos/horas é integrado ao dia.
- Longo prazo é extrapolação experimental; não prevê uma vida real.
- Estratégias possuem efeitos determinísticos. As 40 narrativas compartilham oito estruturas de efeitos.
- Calendário, metas, prioridades de corte e interpretação final são regras do jogo.
- Nenhuma inferência de intenção, moralidade ou estado mental do jogador.
- Nenhuma transmissão de dados a terceiros durante o funcionamento do jogo.
