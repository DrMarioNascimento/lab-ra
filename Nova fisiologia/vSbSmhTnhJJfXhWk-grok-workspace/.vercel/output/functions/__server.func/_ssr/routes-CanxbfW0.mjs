import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CanxbfW0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_BODY = {
	vagal: 44,
	catecol: 16,
	pulse: 8,
	glicose: 76,
	adenosina: 62,
	il6: 14,
	volemia: 64,
	cafeina: 0,
	creat: 8,
	pg: true,
	pgLeft: 0,
	sleepHours: 0,
	curveBroken: false,
	brake: false
};
function clamp(n, max = 100) {
	return Math.max(0, Math.min(max, n));
}
function applyEffect(body, effect) {
	const next = {
		...body,
		vagal: clamp(body.vagal + (effect.vagal ?? 0)),
		catecol: clamp(body.catecol + (effect.catecol ?? 0)),
		pulse: clamp(body.pulse + (effect.pulse ?? 0)),
		glicose: clamp(body.glicose + (effect.glicose ?? 0), 160),
		adenosina: clamp(body.adenosina + (effect.adenosina ?? 0)),
		il6: clamp(body.il6 + (effect.il6 ?? 0)),
		volemia: clamp(body.volemia + (effect.volemia ?? 0)),
		cafeina: clamp(body.cafeina + (effect.cafeina ?? 0)),
		sleepHours: effect.sleepHours ?? body.sleepHours,
		curveBroken: effect.curveBroken || body.curveBroken,
		brake: effect.brake ?? body.brake
	};
	if (effect.blockPgHours) {
		next.pg = false;
		next.pgLeft = effect.blockPgHours;
	}
	return next;
}
function derive(body, setPoint) {
	const cortisol = clamp(setPoint + body.pulse);
	const ang = clamp(body.catecol * .48 + Math.max(0, 68 - body.volemia) * 1.05);
	const stressed = ang > 32 || body.catecol > 34;
	const pgHelp = body.pg ? stressed ? 8 : 5 : 0;
	const rbf = clamp(74 - body.catecol * .34 - ang * .33 + (body.volemia - 55) * .32 + pgHelp);
	const tfg = rbf >= 47 ? clamp(66 + (rbf - 47) * .18) : clamp(rbf * .9);
	const fc = clamp(body.catecol * .62 + (100 - body.vagal) * .38);
	const pa = clamp(body.catecol * .4 + body.pulse * .28 + (100 - body.vagal) * .24);
	const renal = tfg < 47 ? "falha" : rbf < 58 ? "carga" : "folga";
	const renalLine = renal === "falha" ? "Fluxo saiu da faixa. A TFG acompanhou. Falha hemodinâmica, não necrose." : renal === "carga" ? "Fluxo baixo, TFG segura. É carga: a autoregulação ainda segura a filtração." : "Fluxo e TFG dentro da faixa. O rim ainda não é o limitante.";
	const fcWord = fc < 28 ? "branda" : fc < 48 ? "de vigília" : fc < 68 ? "alta" : "muito alta";
	const paWord = pa < 32 ? "baixa" : pa < 50 ? "de vigília" : pa < 68 ? "sustentada" : "alta";
	let kLine = null;
	if (tfg < 47) kLine = "TFG baixa: o rim excreta menos potássio. A catecolamina, se alta, empurra K+ para dentro da célula. Os dois efeitos não cabem no mesmo plasma.";
	else if (body.catecol > 42) kLine = "β2 empurra potássio para dentro da célula. O plasma pode cair sem o rim ter excretado nada.";
	return {
		cortisol,
		ang,
		rbf,
		tfg,
		fc,
		pa,
		renal,
		renalLine,
		fcWord,
		paWord,
		kLine
	};
}
/** Time between hours. Half-lives live here, not on the click. */
function passHours(body, hours, setPointBefore) {
	const before = derive(body, setPointBefore);
	const next = { ...body };
	next.catecol = clamp(body.catecol * .5 ** (hours / .45));
	next.pulse = clamp(body.pulse * .5 ** (hours / 1.5));
	next.cafeina = clamp(body.cafeina * .5 ** (hours / 5));
	if (next.pgLeft > 0) {
		next.pgLeft = Math.max(0, body.pgLeft - hours);
		if (next.pgLeft === 0) next.pg = true;
	}
	const sleep = Math.min(hours, body.sleepHours);
	const awake = hours - sleep;
	next.adenosina = clamp(body.adenosina + awake * 1.15 - sleep * 5.2);
	next.sleepHours = 0;
	if (sleep >= 5) next.vagal = clamp(body.vagal + 8 + sleep);
	else next.vagal = clamp(body.vagal - awake * .4);
	next.volemia = clamp(body.volemia - awake * .4 + sleep * .35);
	const glucosePull = body.pulse > 18 ? awake * .45 : (78 - body.glicose) * (1 - .5 ** (hours / 2));
	next.glicose = clamp(body.glicose + glucosePull, 160);
	if (body.brake) {
		next.vagal = clamp(next.vagal + 14);
		next.catecol = clamp(next.catecol * .35);
		next.brake = false;
	}
	const il6Target = (next.pulse < 10 ? 3 : -2) + (next.adenosina > 78 ? 5 : 1) + (sleep >= 5 ? -8 : 2);
	next.il6 = clamp(body.il6 * .72 + il6Target);
	const afterProbe = derive({
		...next,
		creat: body.creat
	}, setPointBefore);
	const worst = Math.min(before.tfg, afterProbe.tfg);
	const target = worst < 47 ? 8 + (47 - worst) * .55 : 8;
	next.creat = clamp(Math.round((body.creat + (target - body.creat) * (worst < 47 ? .85 : .35)) * 10) / 10, 40);
	const ranked = [];
	if (next.creat - body.creat >= 2) ranked.push("A creatinina subiu entre as horas. Ela descreve a TFG de antes, não a desta hora.");
	if (next.cafeina > 18) ranked.push("A cafeína ainda ocupa o receptor. A adenosina segue no tecido. A máscara é que não acabou.");
	if (body.pulse > 16 && next.pulse < 8 && next.il6 > body.il6 + 3) ranked.push("O cortisol caiu e a IL-6 apareceu. O hormônio que segurava a inflamação já foi embora, e o sono não veio no lugar.");
	if (body.brake) ranked.push("O freio vagal entrou depois da descarga. Catecolamina foi embora. O fluxo renal voltou com ela.");
	if (sleep >= 5) ranked.push("O sono descarregou parte da adenosina e devolveu vago. Não zerou a dívida. Descarregou o que a noite coube.");
	if (!body.pg && next.pg) ranked.push("O AINE saiu do COX. Se a TFG caiu, quem ainda conta isso é a creatinina, não a dor.");
	return {
		body: next,
		notices: ranked.slice(0, 2)
	};
}
function settleMorning(body, setPointBefore) {
	const night = passHours(body, 8, setPointBefore);
	const next = { ...night.body };
	if (body.curveBroken) {
		next.il6 = clamp(next.il6 + 10);
		next.glicose = clamp(next.glicose + 8, 160);
		next.pulse = clamp(next.pulse + 6);
	}
	const notices = [...night.notices];
	if (body.curveBroken) notices.unshift("Manhã com a curva torta: a noite não desceu e o pico do despertar não é o de um eixo em hora. IL-6 e glicose amanhecem mais altas. É um turno, não diabetes.");
	return {
		body: next,
		notices: notices.slice(0, 2)
	};
}
function narrate(choice, before, after, bodyAfter) {
	const renal = after.renal === "falha" ? "O fluxo saiu da faixa e a TFG cedeu." : after.renal === "carga" ? "O fluxo caiu e a TFG segurou. Carga, sem falha." : before.renal !== "folga" && after.renal === "folga" ? "O rim voltou para dentro da faixa." : "O rim segue dentro da faixa.";
	const text = {
		"vigilia-catecol": {
			now: `Medula e simpático em segundos. A glicose subiu por glicogenólise hepática, não porque a triagem “gastou cérebro”. ${renal}`,
			later: "Catecolamina de circulação some em minutos. Adenosina não sai junto: a vigília foi química."
		},
		"vigilia-hpa": {
			now: "CRH, ACTH, córtex adrenal. O cortisol útil chega em dezenas de minutos: tarde para o minuto da triagem. Segura IL-6 e prepara neoglicogênese. A vigília imediata não foi garantida.",
			later: "Meia-vida do cortisol circulante ~1,5 h. Às 9h40 este pulso já terá caído. O que resta é sono interrompido, não um número ainda alto."
		},
		"vigilia-silencio": {
			now: "O vago ficou. Sem descarga, não há taquicardia de defesa nem queda de fluxo. O risco desta hora é o microssono, com a adenosina mandando. Folga renal aqui não é vitória do sistema.",
			later: "A pressão de sono só cai dormindo. Empurrar a hora sem montar resposta aumenta a adenosina da manhã."
		},
		"manha-pulso": {
			now: "Segundo pulso, na hora em que a curva do dia já deveria descer. Um pulso isolado ainda freia CRH e ACTH. O segundo, no mesmo dia, atrasa essa descida.",
			later: "IL-6 segue contida enquanto o cortisol está alto. Aparece quando ele cair, se o sono não entrar no lugar."
		},
		"manha-vagal": {
			now: `Freio vagal, o braço rápido do barorreflexo. A frequência cede sem precisar que o cortisol zere. ${renal}`,
			later: "Angiotensina não ganhou outro motivo para subir. O pulso que já existia decai pela meia-vida dele, não por este gesto."
		},
		"manha-sustento": {
			now: `Não foi pico. Foi simpático médio sem desligar. ${renal} Pico curto o corpo devolve. Platô é o que a pressão deixa de ter para onde cair.`,
			later: "Se o platô atravessar a noite, a pressão não faz dipping. Um turno mostra o mecanismo. O risco cardiovascular é o ritmo repetido."
		},
		"sirene-retorno": {
			now: `Defesa na hora: catecolamina sobe, glicose de glicogenólise, fluxo renal cai. ${renal} O freio vagal entra quando a ameaça passa. Alostase com retorno.`,
			later: "Entre esta hora e a tarde, a catecolamina some. O que se lê depois é se o vago voltou."
		},
		"sirene-sustenta": {
			now: `A descarga era o certo. O freio não veio. Frequência e pressão seguem como se a escada ainda estivesse cheia. ${renal}`,
			later: "Descarga sem retorno é o caminho do non-dipping: a pressão da noite não desce. Ainda não é diagnóstico. É o passo."
		},
		"sirene-nao": {
			now: "Ameaça sem descarga. Não é recuperação vagal: é defesa que não montou. Músculo e vigília não receberam o que a saída pedia. O rim ficou folgado. Folga, aqui, é o sistema que não foi chamado.",
			later: "Não há meia-vida para encerrar, porque o eixo não ligou. O custo é a defesa que faltou, não uma creatinina."
		},
		"tarde-cafe": {
			now: "Antagonismo A1 e A2A. A adenosina continua no tecido. Some o sinal, não a molécula. A catecolamina sobe um pouco. Em quem não habituou, a diurese leve tira volume.",
			later: "Meia-vida da cafeína ~5 h. À noite a máscara ainda está, e a pressão de sono também."
		},
		"tarde-aine": {
			now: `COX inibida: PGE2 e PGI2 aferentes fora. Elas são a dilatação de reserva quando angiotensina e simpático contraem. ${renal} A creatinina não se move neste minuto.`,
			later: "Se a TFG caiu, o índice de creatinina aparece na hora seguinte. Se não caiu, é porque o rim ainda estava perfundido. Um AINE não derruba TFG em rim folgado."
		},
		"tarde-agua": {
			now: `Volume de volta, prostaglandina intacta, freio vagal. A adenosina segue honesta: você sente o que a cafeína esconderia. ${renal}`,
			later: "Com volume, a angiotensina perde o motivo principal. É esta a condição em que um AINE, se viesse, faria pouco."
		},
		"noite-eixo": {
			now: "Cortisol no nadir, a hora em que o eixo deveria estar no chão. A curva achata. ADH e o que restar de angiotensina seguram sódio e água. A glicose sobe quando o fígado deveria estar quieto.",
			later: "A manhã não fará um pico de despertar limpo. IL-6 e a tolerância à glicose amanhecem piores. Desenho de restrição de sono, não um laudo de diabetes."
		},
		"noite-frase": {
			now: "Descarga curta, sem pulso cheio de HPA. O nadir do cortisol ainda é possível. Parte da adenosina descarrega se o sono vier em seguida.",
			later: "Meia recuperação: o eixo não quebrou, e o sono não foi a noite inteira."
		},
		"noite-sono": {
			now: "Processo S começa a descarregar. O cortisol fica baixo, que é o que a hora pede. O vago tem a noite para voltar. O que ficou sem resposta não é um eixo. É a mensagem.",
			later: "De manhã a adenosina está menor e a IL-6 não teve a noite em claro para subir. A curva circadiana segue inteira."
		}
	}[choice.id];
	const k = bodyAfter.catecol > 42 || after.tfg < 47 ? after.kLine : null;
	return {
		now: k ? `${text.now} ${k}` : text.now,
		later: text.later
	};
}
function round(n) {
	return Math.round(n);
}
function readings(body, d, hour) {
	const masked = body.cafeina > 18;
	const dipping = hour.startsWith("23") && d.pa >= 50 && body.sleepHours === 0;
	return [
		{
			label: "Autônomo",
			value: `vago ${round(body.vagal)} · catecolamina ${round(body.catecol)}`
		},
		{
			label: "HPA",
			value: `cortisol ${round(d.cortisol)} · excesso ${round(body.pulse)}`
		},
		{
			label: "Metabólico",
			value: `glicose ${round(body.glicose)}`
		},
		{
			label: "Sono",
			value: masked ? `adenosina ${round(body.adenosina)} · café mascara` : `adenosina ${round(body.adenosina)}`
		},
		{
			label: "Imune",
			value: `IL-6 ${round(body.il6)}`
		},
		{
			label: "Pressão",
			value: dipping ? `FC ${d.fcWord} · PA ${d.paWord} · sem dipping` : `FC ${d.fcWord} · PA ${d.paWord}`
		},
		{
			label: "Rim",
			value: `fluxo ${round(d.rbf)} · TFG ${round(d.tfg)} · Cr ${round(body.creat)} · ${d.renal}`
		}
	];
}
function moved(before, after, d0, d1, hour) {
	const a = readings(before, d0, hour);
	return readings(after, d1, hour).filter((row, i) => row.value !== a[i]?.value);
}
function worstRenal(trace) {
	if (trace.some((t) => t.renal === "falha")) return "falha";
	if (trace.some((t) => t.renal === "carga")) return "carga";
	return "folga";
}
function writeReport(body, trace, morningCortisol, eveningCortisol) {
	const choiceIds = new Set(trace.map((t) => t.title));
	const failedDefense = choiceIds.has("Não ligar");
	const held = choiceIds.has("Platô simpático") || choiceIds.has("Ligar e manter") || choiceIds.has("Cortisol no nadir");
	const broken = choiceIds.has("Cortisol no nadir");
	const slept = choiceIds.has("Dormir") || choiceIds.has("Uma frase e dormir");
	const renal = worstRenal(trace);
	const creatUp = trace.some((t, i) => i > 0 && t.creat >= trace[0].creat + 2) || body.creat >= 11;
	let name = "Retorno";
	if (renal === "falha" || creatUp) name = "Falha hemodinâmica";
	else if (broken) name = "Curva quebrada";
	else if (failedDefense) name = "Sem defesa";
	else if (held && !slept) name = "Patamar";
	else if (renal === "carga") name = "Carga renal";
	else if (body.adenosina > 62 || body.volemia < 46 || body.il6 > 32) name = "Dívida";
	return {
		name,
		essay: essayFor(name),
		horizons: horizonsFor(name, {
			slept,
			broken,
			renal,
			morningCortisol,
			eveningCortisol
		}),
		questions: questionsFor({
			failedDefense,
			renal
		})
	};
}
function questionsFor(f) {
	return [
		f.failedDefense ? "A sirene sem descarga poupou o rim. Qual sistema falhou no lugar dele?" : "Onde a descarga era a defesa certa, e onde o mesmo eixo, à noite, quebrou a curva?",
		f.renal === "falha" ? "A TFG caiu nesta tarde. A creatinina de que hora está descrevendo o passado?" : "A TFG segurou. O que teria de estar junto — volume, angiotensina, prostaglandina — para ela cair?",
		"Se este passo se repetir três noites por semana, o que deixa de ser episódio e vira set point?"
	];
}
function essayFor(name) {
	switch (name) {
		case "Falha hemodinâmica": return "A TFG saiu da faixa. Não foi necrose: foi hemodinâmica. Simpático e angiotensina contraíram, o volume estava curto e a prostaglandina aferente — a dilatação de reserva — não estava lá. A creatinina sobe depois, porque descreve a TFG que já aconteceu. Com volume e com o COX livre, este desenho reverte. Vira doença se o passo se repetir, não porque a tarde existiu.";
		case "Curva quebrada": return "O cortisol subiu perto da meia-noite, quando o eixo deveria estar no nadir. A manhã não recebe um pico de despertar limpo: noite alta, manhã sem inclinação. IL-6 e a glicose amanhecem piores, na direção do que a restrição de sono faz com o dia seguinte. O rim pode ter segurado. A curva, não.";
		case "Sem defesa": return "Na sirene o corpo não montou descarga. Frequência, glicose de defesa e redistribuição de fluxo não vieram. O rim ficou folgado porque ninguém pediu vasoconstrição. Folga não repara a defesa que faltou. Alostase com retorno exige os dois tempos: ligar e desligar. Aqui o primeiro não aconteceu.";
		case "Patamar": return "Houve simpático sem freio, ou um eixo que não devolveu a noite ao nadir. Pico curto o barorreflexo encerra. Platô é a pressão que deixa de cair. Non-dipping, neste modelo, é isso visto à noite. Um plantão não dá o risco de uma década. Mostra o mecanismo que, repetido, vira o risco.";
		case "Carga renal": return "O fluxo caiu e a TFG segurou. É a faixa de autoregulação: o rim filtra quase o mesmo com menos sangue, até sair dela. Carga não é falha. É o quanto a falha está perto. Para cruzar, o modelo exige os três juntos: pouco volume, angiotensina alta e prostaglandina bloqueada.";
		case "Dívida": return "Os eixos que ligaram também devolveram, e a TFG não saiu da faixa. A manhã mesmo assim abre devendo: adenosina ainda alta, ou volume curto, ou IL-6 que não voltou ao basal. Meia-vida encerra o hormônio. Não encerra a noite que não foi dormida nem a água que não entrou.";
		default: return "Descarga onde a ameaça pedia, freio quando ela passou, e uma noite em que o cortisol pôde ficar baixo. A adenosina descarregou parte. A TFG não saiu da faixa. O custo ficou na hora. É alostase com retorno: sem juros de set point.";
	}
}
function horizonsFor(name, f) {
	const flat = f.eveningCortisol > f.morningCortisol - 8;
	return [
		{
			span: "Curto",
			when: "48 horas",
			text: name === "Falha hemodinâmica" ? "A creatinina de amanhã ainda pode estar descrevendo a TFG da tarde. Com volume e com o COX livre, a falha hemodinâmica deste desenho reverte. Não é lesão estabelecida só porque o índice subiu." : f.broken ? "A próxima manhã abre com a curva achatada: cortisol da noite alto demais, pico do despertar sem graça, IL-6 e glicose acima do que uma noite dormida deixaria. É a direção do que a restrição de sono faz com a tolerância à glicose no dia seguinte." : f.slept ? "Uma noite de sono devolve vago e derruba parte da adenosina. Não apaga a semana. O cortisol consegue um pico de despertar. Em 48 h, se o passo não se repetir, os índices voltam para a faixa." : "Sem sono, a adenosina segue e a IL-6 da manhã fica mais alta quando o cortisol finalmente baixa. A catecolamina em si já era. O que resta é o que ela não deixou o corpo fazer: dormir."
		},
		{
			span: "Médio",
			when: "meses",
			text: name === "Retorno" ? "Meses neste passo não criam patamar. O cortisol sobe na ameaça e desce depois. A pressão ainda tem noite para cair. O custo continua episódico." : name === "Falha hemodinâmica" ? "Repetir AINE com pouco volume e simpático alto é a situação em que o episódio hemodinâmico deixa de ser raro. O rim aguenta vários. Não aguenta como método. Pressão que não cai de noite, no mesmo período, soma o outro insulto." : "O que se repete vira inclinação: cortisol de fim de dia mais alto, manhã sem pico, pressão sem dipping, IL-6 que não volta ao basal. Carga alostática é esse conjunto, não um hormônio vilão. Três noites por semana bastam para o set point mudar de lugar."
		},
		{
			span: "Longo",
			when: "anos",
			text: flat ? "Anos de curva achatada, pressão sem dipping e inflamação de baixo grau andam juntos com risco cardiovascular e metabólico. O rim entra nessa conta pela pressão e pela glicose, não porque uma creatinina subiu numa tarde. Um turno não escreve a década. O ritmo escreve." : "A década cobra a noite que não teve volta, não a que ligou e desligou. Retorno repetido não é ausência de custo: é custo pago na hora, sem juros de set point. Insuficiência renal crônica não é o desfecho deste plantão. É o desfecho de pressão, glicose e inflamação que deixaram de ser episódio."
		}
	];
}
var BRIDGE = [
	"O modelo faz correr, com meia-vida, sete leituras: vago cardíaco, catecolamina, cortisol acima da curva circadiana, glicose, adenosina, IL-6, e o rim (fluxo, TFG, creatinina). Frequência e pressão são leitura, não um botão. Nada aqui é o seu exame.",
	"Catecolamina de circulação acaba em minutos. Cortisol circulante tem meia-vida de cerca de uma hora e meia. Cafeína, cerca de cinco horas, e só bloqueia o receptor de adenosina: não apaga a adenosina. Creatinina não se move no minuto em que a TFG cai. IL-6 cai sob cortisol agudo e sobe quando o cortisol desce sem sono no lugar.",
	"Angiotensina II, em nível moderado, contrai sobretudo a eferente e ainda segura a TFG, com fração de filtração maior. O modelo não simula esse degrau. Simula o extremo: simpático alto, pouco volume e prostaglandina aferente bloqueada ao mesmo tempo. É nesse extremo que a TFG cai. Um AINE em pessoa hidratada, em repouso, quase não move a filtração. E um turno, mesmo neste extremo, não é doença renal crônica. É uma falha hemodinâmica que reverte se a condição desfaz.",
	"Cortisol alto o bastante para saturar a 11β-HSD2 e agir como mineralocorticoide no rim é excesso sustentado, não um susto. O jogo não finge essa saturação. O potássio que ele menciona é o outro: β2 empurra K+ para a célula na hora; TFG baixa faz o contrário, horas depois. O plasma de um minuto não separa os dois.",
	"Restrição de sono piora a tolerância à glicose no dia seguinte. Isso está medido. O jogo só desloca a glicose e a IL-6 da manhã para você ver a direção. Não calcula um índice glicêmico. E não usa a história, já não sustentada, de que raciocinar esvazia a glicose do sangue.",
	"A passagem de ética ainda não está aqui. Será a mesma noite, com o menu inteiro. A pergunta, então, é se o gesto que você defender cabe no corpo que esta passagem acabou de deixar."
];
var SCENES = [
	{
		id: "vigilia",
		hour: "03:10",
		gap: 0,
		setPoint: 42,
		kicker: "Madrugada",
		title: "A vigília",
		cause: "Plantão de pé, última refeição já longe, adenosina alta. A triagem pede córtex acordado nos próximos minutos. O cortisol das 3h já vem subindo: é o começo da curva, não um pico de susto.",
		demand: "Ou a medula responde agora, ou o eixo lento responde tarde, ou ninguém responde e a adenosina continua no comando.",
		choices: [
			{
				id: "vigilia-catecol",
				title: "Catecolamina",
				act: "Simpático e medula adrenal. Vigília em segundos.",
				gloss: "Glicogenólise agora. Fluxo renal cai. A adenosina não sai.",
				effect: {
					catecol: 36,
					vagal: -16,
					glicose: 14,
					volemia: -5,
					adenosina: 3
				}
			},
			{
				id: "vigilia-hpa",
				title: "Eixo HPA",
				act: "CRH, ACTH, cortisol. O útil chega em dezenas de minutos.",
				gloss: "Segura IL-6. Não garante o minuto da triagem.",
				effect: {
					pulse: 22,
					il6: -4,
					glicose: 6,
					adenosina: 6,
					vagal: -4
				}
			},
			{
				id: "vigilia-silencio",
				title: "Não montar",
				act: "O vago fica. A pressão de sono também.",
				gloss: "O rim nem é chamado. O risco é o microssono.",
				effect: {
					vagal: 6,
					catecol: -8,
					adenosina: 8
				}
			}
		]
	},
	{
		id: "manha",
		hour: "09:40",
		gap: 6.5,
		setPoint: 36,
		kicker: "Manhã",
		title: "O segundo pulso",
		cause: "A curva do dia já deveria estar descendo depois do pico do despertar. Há uma conversa difícil pela frente. O pulso da madrugada, se houve, já perdeu a maior parte da meia-vida.",
		demand: "Um pulso novo, um freio vagal, ou um simpático médio que não desliga.",
		choices: [
			{
				id: "manha-pulso",
				title: "Segundo pulso",
				act: "Outro pico de cortisol, com a curva já devendo cair.",
				gloss: "O feedback negativo ainda existe. O segundo pico atrasa a descida.",
				effect: {
					pulse: 24,
					il6: -5,
					glicose: 8,
					vagal: -6
				}
			},
			{
				id: "manha-vagal",
				title: "Freio vagal",
				act: "Barorreflexo. A frequência cede sem um eixo novo.",
				gloss: "Não apaga o cortisol. Devolve vago.",
				effect: {
					vagal: 12,
					catecol: -10
				}
			},
			{
				id: "manha-sustento",
				title: "Platô simpático",
				act: "Sem pico claro. Catecolamina média, a manhã inteira.",
				gloss: "Platô custa mais retorno do que um pico curto.",
				effect: {
					catecol: 18,
					vagal: -14,
					volemia: -4,
					glicose: 6
				}
			}
		]
	},
	{
		id: "sirene",
		hour: "11:41",
		gap: 2,
		setPoint: 30,
		kicker: "Sirene",
		title: "A defesa",
		cause: "Alarme. A ameaça é de minutos. Aqui a descarga simpática é o sistema certo: frequência, glicose, sangue para o músculo. O erro novo é não desligar quando se está do lado de fora.",
		demand: "Ligar e devolver o vago, ligar e manter, ou não ligar.",
		choices: [
			{
				id: "sirene-retorno",
				title: "Ligar e desligar",
				act: "Descarga curta. O freio vagal entra quando a ameaça passa.",
				gloss: "Alostase com retorno. O fluxo cai e deve voltar.",
				effect: {
					catecol: 38,
					vagal: -18,
					glicose: 12,
					volemia: -4,
					brake: true
				}
			},
			{
				id: "sirene-sustenta",
				title: "Ligar e manter",
				act: "A mesma descarga, sem o freio.",
				gloss: "Defesa certa. Retorno ausente.",
				effect: {
					catecol: 38,
					vagal: -22,
					glicose: 12,
					volemia: -5
				}
			},
			{
				id: "sirene-nao",
				title: "Não ligar",
				act: "Sem taquicardia, sem glicose de defesa.",
				gloss: "Não é calma. É a defesa que não montou.",
				effect: {
					vagal: 3,
					catecol: -6
				}
			}
		]
	},
	{
		id: "tarde",
		hour: "16:20",
		gap: 4.6,
		setPoint: 22,
		kicker: "Tarde",
		title: "Volume e COX",
		cause: "Reunião longa, cabeça doendo, muitas horas sem beber. A adenosina está honesta. Três saídas químicas diferentes: bloquear o receptor do sono, bloquear a prostaglandina do rim, ou repor volume.",
		demand: "Cafeína mascara. AINE tira a dilatação de reserva. Água devolve o que a angiotensina estava usando de pretexto.",
		choices: [
			{
				id: "tarde-cafe",
				title: "Cafeína",
				act: "Bloqueia A1 e A2A. A adenosina fica. O aviso sai.",
				gloss: "Meia-vida ~5 h. Diurese leve se não houver habituação.",
				effect: {
					cafeina: 72,
					catecol: 12,
					vagal: -8,
					volemia: -6,
					glicose: 4
				}
			},
			{
				id: "tarde-aine",
				title: "AINE",
				act: "Inibe a COX. A dor cede. A PGE2 aferente também.",
				gloss: "Em rim folgado, a TFG quase não se move. Em rim já contraído, move.",
				effect: {
					blockPgHours: 6,
					catecol: 30,
					vagal: -10,
					volemia: -4,
					il6: -6
				}
			},
			{
				id: "tarde-agua",
				title: "Água e pausa",
				act: "Volume, prostaglandina intacta, freio vagal.",
				gloss: "A adenosina continua perceptível. O rim sai da zona de risco.",
				effect: {
					volemia: 18,
					vagal: 10,
					catecol: -8
				}
			}
		]
	},
	{
		id: "noite",
		hour: "23:48",
		gap: 7.5,
		setPoint: 12,
		kicker: "Nadir",
		title: "A curva",
		cause: "Perto da meia-noite o cortisol deveria estar no chão. A adenosina, no teto, se o dia não teve sono. Montar o eixo agora não é uma defesa a mais. É achatar a curva: noite alta, manhã sem pico.",
		demand: "Um pulso no nadir, uma descarga curta e dormir, ou só dormir.",
		choices: [
			{
				id: "noite-eixo",
				title: "Cortisol no nadir",
				act: "O eixo sobe na hora em que devia calar.",
				gloss: "Quebra a inclinação. A manhã paga em IL-6 e em glicose.",
				effect: {
					pulse: 36,
					catecol: 16,
					vagal: -14,
					glicose: 12,
					volemia: -3,
					curveBroken: true,
					sleepHours: 1
				}
			},
			{
				id: "noite-frase",
				title: "Uma frase e dormir",
				act: "Descarga curta, sem pulso cheio. Depois o sono.",
				gloss: "O nadir sobrevive. A noite de sono fica pela metade.",
				effect: {
					catecol: 12,
					vagal: -6,
					pulse: 4,
					sleepHours: 5
				}
			},
			{
				id: "noite-sono",
				title: "Dormir",
				act: "O processo S descarrega. O cortisol fica baixo.",
				gloss: "A curva segue inteira. A mensagem fica sem resposta.",
				effect: {
					sleepHours: 7,
					vagal: 4,
					catecol: -6
				}
			}
		]
	}
];
var STORE_KEY = "limiar-perfil";
var MORNING_SET = 52;
var MORNING_BROKEN = 40;
function Limiar() {
	const [phase, setPhase] = (0, import_react.useState)("intro");
	const [round, setRound] = (0, import_react.useState)(0);
	const [body, setBody] = (0, import_react.useState)(INITIAL_BODY);
	const [trace, setTrace] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [notices, setNotices] = (0, import_react.useState)([]);
	const [morning, setMorning] = (0, import_react.useState)(INITIAL_BODY);
	const [eveningCortisol, setEveningCortisol] = (0, import_react.useState)(12);
	const [bridgeOpen, setBridgeOpen] = (0, import_react.useState)(false);
	const [lastProfile, setLastProfile] = (0, import_react.useState)(null);
	const lock = (0, import_react.useRef)(false);
	const visibleRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		try {
			setLastProfile(localStorage.getItem(STORE_KEY));
		} catch {}
	}, []);
	const scene = SCENES[round];
	const derived = derive(body, phase === "laudo" ? morning.curveBroken ? MORNING_BROKEN : MORNING_SET : scene.setPoint);
	visibleRef.current = scene.choices;
	(0, import_react.useEffect)(() => {
		if (phase !== "night") return;
		function onKey(event) {
			if (event.key === "Enter" && pending) {
				advance();
				return;
			}
			const index = Number(event.key);
			const choice = visibleRef.current[index - 1];
			if (!pending && choice) choose(choice);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	function begin() {
		lock.current = false;
		setBody(INITIAL_BODY);
		setMorning(INITIAL_BODY);
		setTrace([]);
		setRound(0);
		setPending(null);
		setNotices([]);
		setBridgeOpen(false);
		setPhase("night");
	}
	function choose(choice) {
		if (lock.current || pending) return;
		lock.current = true;
		const before = body;
		const after = applyEffect(before, choice.effect);
		const d0 = derive(before, scene.setPoint);
		const d1 = derive(after, scene.setPoint);
		const text = narrate(choice, d0, d1, after);
		setPending({
			choice,
			before,
			after,
			d0,
			d1,
			now: text.now,
			later: text.later
		});
		setBody(after);
		setTrace((prev) => [...prev, {
			hour: scene.hour,
			title: choice.title,
			renal: d1.renal,
			tfg: d1.tfg,
			creat: after.creat
		}]);
	}
	function advance() {
		lock.current = false;
		if (!pending) return;
		if (round >= SCENES.length - 1) {
			const evening = derive(body, scene.setPoint).cortisol;
			const settled = settleMorning(body, scene.setPoint);
			const report = writeReport(settled.body, trace, derive(settled.body, settled.body.curveBroken ? MORNING_BROKEN : MORNING_SET).cortisol, evening);
			try {
				localStorage.setItem(STORE_KEY, report.name);
			} catch {}
			setLastProfile(report.name);
			setEveningCortisol(evening);
			setMorning(settled.body);
			setNotices(settled.notices);
			setPending(null);
			setPhase("laudo");
			return;
		}
		const nextScene = SCENES[round + 1];
		const passed = passHours(body, nextScene.gap, scene.setPoint);
		setBody(passed.body);
		setNotices(passed.notices);
		setRound((n) => n + 1);
		setPending(null);
	}
	if (phase === "intro") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, {
		lastProfile,
		onBegin: begin
	}) });
	if (phase === "laudo") {
		const report = writeReport(morning, trace, derive(morning, morning.curveBroken ? MORNING_BROKEN : MORNING_SET).cortisol, eveningCortisol);
		const morningDerived = derive(morning, morning.curveBroken ? MORNING_BROKEN : MORNING_SET);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laudo, {
			report,
			trace,
			morning,
			derived: morningDerived,
			notices,
			bridgeOpen,
			onToggleBridge: () => setBridgeOpen((v) => !v),
			onAgain: begin
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5 flex items-baseline justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg tracking-wide text-fg",
				children: "Limiar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [scene.hour, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-faint",
					children: [
						" ",
						"· ",
						round + 1,
						" de ",
						SCENES.length
					]
				})]
			})]
		}),
		notices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 grid gap-2",
			children: notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg",
				children: notice
			}, notice))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Systems, {
			body,
			derived,
			hour: scene.hour,
			line: derived.renalLine
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-accent uppercase",
					children: scene.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl leading-tight font-medium text-fg",
					children: scene.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-base leading-relaxed text-muted",
					children: scene.cause
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-fg",
					children: scene.demand
				})
			]
		}),
		pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aftermath, {
			pending,
			last: round >= SCENES.length - 1,
			onNext: advance
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3",
			children: scene.choices.map((choice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => choose(choice),
				className: "min-h-11 rounded-card border border-line bg-surface px-4 py-4 text-left transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl leading-tight text-fg",
							children: choice.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-faint",
							children: index + 1
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 block text-sm leading-relaxed text-muted",
						children: choice.act
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 block text-xs leading-relaxed text-faint",
						children: choice.gloss
					})
				]
			}, choice.id))
		})
	] });
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12",
		children
	});
}
function Intro({ lastProfile, onBegin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-widest text-accent uppercase",
			children: "Fisiologia · a primeira passagem"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 font-display text-6xl leading-none font-medium text-fg sm:text-7xl",
			children: "Limiar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 max-w-xl font-display text-2xl leading-snug font-medium text-fg italic",
			children: "O corpo, sistema por sistema. A ética fica para a outra passagem, com esta mesma noite."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Cinco horas. Em cada uma você não escolhe o certo moral: escolhe qual sistema responde. Autônomo, HPA, glicose, adenosina, IL-6, pressão, rim." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "O tempo é o jogo. Catecolamina acaba em minutos. Cortisol, em horas. Cafeína, na outra metade do dia. Creatinina só no compasso seguinte. IL-6 quando o cortisol já foi embora." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-fg",
					children: "Um turno não dá insuficiência renal crônica. A falha que pode aparecer é hemodinâmica: pouco volume, angiotensina, sem prostaglandina. Carga é o fluxo cair e a TFG segurar."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onBegin,
			className: "mt-8 min-h-11 rounded-full bg-accent px-6 py-3 text-base font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
			children: "Entrar na noite"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-faint",
			children: "Cerca de oito minutos. Os números são um modelo, não um exame."
		}),
		lastProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				"Última leitura desta sala: ",
				lastProfile,
				"."
			]
		}) : null
	] });
}
function Systems({ body, derived, hour, line }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-card border border-line bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line",
			children: readings(body, derived, hour).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline justify-between gap-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tracking-wide text-faint uppercase",
					children: row.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-right text-sm text-fg",
					children: row.value
				})]
			}, row.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "border-t border-line pt-3 text-sm leading-relaxed text-muted",
			children: line
		})]
	});
}
function Aftermath({ pending, last, onNext }) {
	const rows = moved(pending.before, pending.after, pending.d0, pending.d1, "agora");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-card border border-line bg-surface px-4 py-5 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-accent uppercase",
				children: "Nesta hora"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-3xl leading-tight text-fg",
				children: pending.choice.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base leading-relaxed text-muted",
				children: pending.now
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-fg",
				children: pending.later
			}),
			rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-1",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: row.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right text-fg",
						children: row.value
					})]
				}, row.label))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onNext,
				className: "mt-5 min-h-11 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				children: last ? "Ver a manhã" : "Avançar as horas"
			})
		]
	});
}
function Laudo({ report, trace, morning, derived, notices, bridgeOpen, onToggleBridge, onAgain }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-widest text-accent uppercase",
			children: "Manhã seguinte · fisiologia"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-5xl leading-none font-medium text-fg",
			children: report.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 max-w-2xl text-base leading-relaxed text-muted",
			children: report.essay
		}),
		notices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-2",
			children: notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg",
				children: notice
			}, notice))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl text-fg",
			children: "O corpo ao acordar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Systems, {
				body: morning,
				derived,
				hour: "07:10",
				line: derived.renalLine
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl text-fg",
			children: "Se o ritmo ficar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm leading-relaxed text-faint",
			children: "O mesmo passo, repetido. Não é sentença. É a curva de quem não muda a noite."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 grid gap-3",
			children: report.horizons.map((horizon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-line bg-surface px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tracking-widest text-accent uppercase",
					children: [horizon.span, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-faint",
						children: [" · ", horizon.when]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: horizon.text
				})]
			}, horizon.span))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl text-fg",
			children: "O que cada hora fez"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-3 divide-y divide-line border-y border-line",
			children: trace.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline justify-between gap-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-3 text-xs text-faint",
					children: step.hour
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-fg",
					children: step.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs tracking-wide text-muted uppercase",
					children: step.renal
				})]
			}, step.hour))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl text-fg",
			children: "Três perguntas para a sala"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-muted",
			children: report.questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: q }, q))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-expanded": bridgeOpen,
			onClick: onToggleBridge,
			className: "mt-8 min-h-11 text-left text-sm text-accent underline decoration-line underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
			children: bridgeOpen ? "Fechar o modelo" : "Abrir o modelo — o que está calculado, e o que não está"
		}),
		bridgeOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 max-w-2xl space-y-4 text-sm leading-relaxed text-muted",
			children: BRIDGE.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph.slice(0, 40)))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onAgain,
			className: "mt-8 min-h-11 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
			children: "Outra noite"
		})
	] });
}
var SplitComponent = Limiar;
//#endregion
export { SplitComponent as component };
