# Forças de Starling · Unidade 1 — Celular

Experiência independente do Fisiologia Interativa, transferida da versão aprovada do Lab RA, revisão `5ac3f4cce5b8d62d76d9fc3cced1e0e0bc2f224d`. [Abrir experiência](https://drmarionascimento.github.io/fisiologia-interativa/ra/starling/).

App, modelos, física, paleta de variáveis e estilos são cópias integrais da origem aprovada. A adaptação muda somente a identificação do projeto, a assinatura e o retorno ao Tutor do percurso de origem. Não exige Google nem carrega arquivos do Lab RA. Modelos e texturas são procedurais originais, cobertos pela [licença do projeto](../../LICENSE.md); artigos e bibliotecas conservam seus próprios direitos.

O card RA da Unidade 1 — Celular mantém A película de carga e acrescenta Forças de Starling com o mesmo destaque. O roteiro e três questões são compartilhados pelos Tutores EF, Fisioterapia e as duas versões Moodle, com e sem IA. As forças microvasculares de Starling não são a lei cardíaca de Frank–Starling.

## Modelo e funcionamento preservados

Cinco níveis: rede microvascular interligada, corte longitudinal do capilar,
contribuições de pressão, ampliação da barreira do glicocálix, edema e drenagem linfática.
Malhas procedurais originais, sem modelos anatômicos externos ou pedestais.
As estruturas são ampliadas em escalas diferentes para permitir sua leitura.

## Modelo fisiológico

- Pressões em mmHg; a interface também converte para cmH₂O (1 mmHg = 1,35951 cmH₂O).
- Clássico: Jv = Kf [(Pc − Pi) − σ(πc − πi)].
- Revisado: Jv = Kf [(Pc − Pi) − σ(πc − πsg)].
- No revisado, πsg é **especificada**, não estimada por transporte de proteínas.
  Portanto não se trata de uma solução estacionária completa do glicocálix.
  Uma soma negativa é tendência de absorção com as pressões fixadas; não autoriza
  afirmar que há absorção venosa sustentada. O cenário basal revisado ilustra
  filtração ao longo do leito e retorno pela linfa.
- Pc varia linearmente entre os extremos. Os controles mantêm Pc inicial ≥ Pc final.
- Os basais clássico e revisado usam pressões diferentes: não são uma comparação
  controlada do efeito isolado do glicocálix sob pressões idênticas.
- As contribuições dos cards pertencem ao mesmo ponto escolhido. As setas 3D
  mostram duas estações fixas, 22% e 78%, com escala de comprimento comum.
- Kf pertence ao **leito didático inteiro**, não à malha de um único capilar.
  Pressões, Kf e volumes não devem ser usados para estimar edema clínico.

O excesso de volume V obedece ao balanço:
dV/dt = filtração − absorção − linfa.
Pi = Pi basal + V / complacência.
Linfa = mínimo(capacidade, drenagem basal + ganho × V), ou zero na obstrução.
A integração usa RK4 com passos máximos de 0,1 minuto. V não fica negativo:
o modelo acompanha excesso sobre o basal, sem simular desidratação do tecido basal.
Complacência e ganho linfático são aproximações ilustrativas. Não há teto fixo
de volume nem um fator de segurança de 17 mmHg aplicado a todos os tecidos.
A concentração intersticial/subglicocálix permanece especificada; diluição,
retenção renal de sódio, adaptação proteica e remodelamento crônico não são resolvidos.

## Interação

Abre pausada. Iniciar/Pausar congela também as partículas, não só o relógio.
1× corresponde a 2 minutos simulados por segundo real. Estados rápidos e mudança
de modelo reiniciam a observação; ajustes manuais mantêm o líquido acumulado.
Reiniciar zera o excesso e o tempo, preservando os parâmetros selecionados.
A aba em segundo plano não avança a simulação.

A densidade visual de proteínas acompanha πc; a velocidade das gotas acompanha
o módulo da pressão líquida e Kf. Essas partículas são símbolos qualitativos:
contagem, tamanho e velocidade não constituem uma calibração molecular do fluxo.

A RA exporta apenas o nível visível e o estado pausado. É uma fotografia 3D,
sem a animação fisiológica do navegador. Exportações antigas são invalidadas
imediatamente ao mudar o estado. Legendas HTML ficam no navegador.
A ampliação no ambiente é de aproximadamente 65 cm, sem relação de escala
física entre níveis microscópicos.

Endereços conferíveis: ?nivel=1..5, ?modelo=revisado|classico,
?causa=normal|depe|cardiaca|hipoalbuminemia|inflamacao|linfatico,
?onc=4..34 e ?min=0..1440. min reconstrói a evolução desde o volume basal.
O antigo identificador depe agora abre **Estase venosa**; não confunde pressão
venosa distal em ortostatismo com uma pressão capilar universal.

## Referências

- Levick JR, Michel CC. Microvascular fluid exchange and the revised Starling
  principle. Cardiovascular Research. 2010;87:198–210.
  https://doi.org/10.1093/cvr/cvq062
- Michel CC. Fluid exchange in the microcirculation. Journal of Physiology.
  2004;557:701–702. https://doi.org/10.1113/jphysiol.2004.063511

Os testes em tests/starling.test.mjs conferem equações, áreas de filtração e
absorção, conversão de unidades, balanço de massa, integração, resposta às
causas e drenagem após reversão dos parâmetros.

## Leitura para os alunos

Os cinco níveis ficam visíveis em uma grade, sem depender de rolagem horizontal.
A seção de RA tem seu próprio seletor das cinco peças, sincronizado com a cena.
Há uma prévia por vez, identificada pelo nome da peça selecionada.

Como interpretar aparece antes de Modelo e referências. Define todas as variáveis
e unidades da interface. A paleta única está em variaveis.js: uma cor por variável
em controles, equações, contribuições, gráficos, guia e setas 3D. A cor identifica
a variável; sinais e pontas das setas continuam indicando a direção. O balanço
também explicita Jv (filtração menos absorção), antes de descontar QL (linfa).
