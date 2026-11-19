# Ficha 12 · Treino: modelo aptidão-fadiga (conta de Treino)

18/11/2026 · versão de projeto, não aparece para o aluno.

**Estado: forma do modelo fechada; números não.** Nenhum artigo foi lido inteiro; tudo abaixo é **[resumo]** (resumos e uma revisão aberta em arXiv). Nada disto entrou no motor.

## 1. O que as fontes dizem

| Ponto | O que a fonte diz | Leitura |
|---|---|---|
| Forma | Banister (1975): desempenho = linha de base + aptidão − fadiga. Cada sessão de treino (impulso) soma uma aptidão pequena e duradoura (k1, constante de tempo τ1) e uma fadiga grande e curta (k2, τ2); as duas decaem em exponencial. No ajuste que melhora o desempenho valem k1 < k2 e τ2 < τ1. | [resumo] revisão em arXiv 2505.20859 (2025) |
| Limite 1 | É linear: todo treino vale o mesmo, qualquer que seja o treino anterior. Sem teto, o desempenho cresce sem limite; o otimizador da própria revisão dá um ganho irreal (cerca de 6.020 unidades em 4 semanas, contra 33,3 obtidos por pessoas reais em 14 semanas). | [resumo] arXiv 2505.20859 |
| Limite 2 | O impulso diário ignora o que acontece dentro do dia (aquecimento) e não separa intensidade de duração. | [resumo] arXiv 2505.20859 |
| Extensão | Busso (2003), dose-resposta variável: a fadiga de cada sessão (k2) varia com a história recente de treino, com mais fadiga quando as cargas são maiores e mais frequentes. Ajustado em 6 sujeitos. | [resumo] Busso, 2003, Med Sci Sports Exerc 35:1188 |
| Parâmetros, exemplo 1 | Média de 8 ciclistas em cicloergômetro por 14 semanas: k1 = 0,048; k2 = 0,117; τ1 = 38 dias; τ2 = 1,9 dia. | [resumo] citado em arXiv 2505.20859, tabela de outra referência |
| Parâmetros, exemplo 2 | Busso 2003: k1 = 0,031; τ1 = 30,8 dias; τ2 = 16,8 dias; k3 = 0,000035; τ3 = 2,3 dias. | [resumo] citado em arXiv 2505.20859 |

## 2. Por que ainda não é número no motor

- **τ2 varia de 1,9 a 16,8 dias** entre dois conjuntos publicados. Escolher um valor único para "a fadiga" seria inventar. Os parâmetros são individuais.
- Os ajustes são de **desempenho** (potência, tempo) em atletas, não de lactato, CK ou da fadiga que o jogo mostra. A ponte entre "desempenho" e "lactato/CK" não tem fonte lida.
- O modelo é **linear**: o GDD pede "carga acima da recuperação" (cobrança). O ponto de virada entre adaptação e sobrecarga não está no modelo de Banister, e sim nas extensões.
- Perfil do jogo é de adulto jovem saudável: os exemplos são de atletas.

## 3. O que se pode afirmar hoje (e usar no texto ao aluno)

- Treino deixa dois efeitos: um de queda rápida (fadiga) e outro de queda lenta (aptidão); a fadiga domina nos primeiros dias, a aptidão aparece depois.
- A ordem de grandeza da fadiga é dias; a da aptidão é de semanas (cerca de 30 a 40 dias nos dois exemplos).
- Não dar número de dias nem de ganho ao aluno antes de ler uma fonte com adultos não atletas.

## 4. Para virar número

1. Ler Banister (1975) e Busso (2003) inteiros.
2. Achar estudo com adultos jovens não atletas, com marcador fisiológico (não só desempenho).
3. Decidir se a conta de Treino usa só τ1 e τ2 como faixa (mínimo e máximo declarados) em vez de um valor.
4. Ler Hellard (2006), a crítica estatística ao modelo.

## Fontes

- Banister EW e colegas, 1975. Systems model of training for athletic performance. (não lido)
- Busso T, 2003. Variable dose-response relationship between exercise training and performance. Med Sci Sports Exerc 35:1188-1195. DOI 10.1249/01.mss.0000074465.13621.37 (resumo)
- Hellard P e colegas, 2006. Assessing the limitations of the Banister model in monitoring training. J Sports Sci. (só citado; não lido)
- Revisão aberta: Mathematical Modelling and Optimisation of Athletic Performance: Tapering and Periodisation. https://arxiv.org/html/2505.20859v1
