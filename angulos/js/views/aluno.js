import { papelById, fotosDoGrupo, destinoRelato, desfecho, placarClassificacao } from "../engine.js";
import { PARADAS } from "../content/roteiro.js";
import { PESSOAS, FORA, FOTOS, CARTAS, ALTERNATIVAS, PAPEL_NA_SITUACAO, LENTES, DIMENSOES, ABERTURA, CONCLUSAO, txt } from "../content/cena.js";
import { fotosDaCena } from "../scene3d.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TAGS = { fato: "Fato", interp: "Interpretação", incerto: "Incerteza" };
const PREV = [["kaua", "o jovem de camiseta laranja"], ["bia", "a mulher de legging rosa"], ["lara", "a estagiária de boné"]];

export function novoLocal() {
  return { nome: "", parada: 0, ind: { classif: {}, vejo: [], fora: [], vulner: [], vulnerFora: [], deveres: [], prev: {}, cartas: [] }, gf: null, lab: { acoes: [] }, h2: {}, saida: "", verFoto: 0 };
}

function hd(st, me) {
  const g = me?.grupo ? st.grupos[me.grupo] : null;
  const p = g ? papelById(g.papel) : null;
  return `<div class="hd">${p ? `<span class="badge" style="background:${p.cor}">${g.i + 1}</span>` : `<span class="badge" style="background:#334155">◎</span>`}
    <div class="grow"><b>${esc(me?.nome || "Ângulos")}</b><div class="faint" style="font-size:12px">${p ? `${p.nome}${g.lider === me.id ? " · líder" : ""}` : "Deliberação ética em equipe"}</div></div></div>`;
}

const opt = (path, value, cur, label) => `<button class="opt ${cur === value ? "sel" : ""}" data-a="set" data-path="${path}" data-val="${esc(value)}">${label}</button>`;
const chip = (path, value, arr, label) => `<button class="btn sm ${arr?.includes(value) ? "warn on" : "sec"}" data-a="toggle" data-path="${path}" data-val="${esc(value)}">${label}</button>`;

let falhaGrafica = false;
function foto(st, fid, { pontos = true, sel = [], path } = {}) {
  let f;
  try { if (!falhaGrafica) f = fotosDaCena(st.pers)[fid]; }
  catch (erro) { falhaGrafica = true; console.error("Não foi possível gerar as imagens 3D", erro); }
  if (!f) return `<div class="card pill-bad" role="alert">Não foi possível gerar esta imagem 3D neste dispositivo. Atualize a página ou tente outro navegador com aceleração gráfica. A observação depende da imagem.</div>`;
  const pts = pontos ? Object.entries(f.pontos).map(([pid, c]) => `<button class="hot ${sel.includes(pid) ? "on" : ""}" style="left:${c.x * 100}%;top:${c.y * 100}%" ${path ? `data-a="toggle" data-path="${path}" data-val="${pid}"` : ""} title="${esc(PESSOAS[pid].desc)}">${sel.includes(pid) ? "✓" : ""}</button>`).join("") : "";
  return `<div class="foto-box"><label class="foto-zoom-controle"><input class="foto-zoom-input" type="checkbox"><span class="foto-zoom-abrir">⌕ Ampliar imagem</span><span class="foto-zoom-fechar">✕ Fechar imagem</span></label><div class="foto"><img src="${f.url}" alt="${esc(FOTOS[fid].titulo)}">${pts}</div></div><div class="faint" style="font-size:12px;margin-top:-6px">${esc(FOTOS[fid].titulo)}</div>`;
}

function ancora(st, p) {
  return `<div class="anchor" style="flex-direction:column;align-items:stretch;gap:4px"><span class="faint" style="font-size:12px">DOCUMENTO</span><b style="font:700 15px var(--font);color:var(--o2)">${esc(p.ancora.titulo)}</b><span>${esc(txt(p.ancora.texto, st.pers))}</span></div>`;
}

function classifForm(path, fids, classif) {
  return fids.map((fid) => FOTOS[fid].frases.map((fr, i) => {
    const k = `${fid}:${i}`;
    return `<div class="card" style="padding:10px 12px"><div style="margin-bottom:6px">${esc(fr.t)}</div><div class="row" style="gap:6px">${Object.entries(TAGS).map(([t, n]) => `<button class="btn sm ${classif[k] === t ? "on" : "sec"}" data-a="setk" data-path="${path}" data-k="${k}" data-val="${t}">${n}</button>`).join("")}</div></div>`;
  }).join("")).join("");
}

// Usar os marcadores realmente visíveis em cada foto, não apenas os personagens associados ao ângulo.
function pessoasDas(fids, st) {
  if (falhaGrafica) return [];
  const fotos = fotosDaCena(st.pers);
  return [...new Set(fids.flatMap((fid) => Object.keys(fotos[fid]?.pontos || {})))];
}

function blocoRoteiro(st, base, d, fids, mochila, { grupo = false } = {}) {
  const pes = pessoasDas(fids, st);
  const p = papelById(st.grupos[st.alunos[base.id].grupo].papel);
  const alts = ALTERNATIVAS[p.id];
  return `
    <h3 class="passo">1 · Fatos e incertezas</h3><p class="faint" style="margin:0">Cada frase é fato (está na imagem), interpretação (é o sentido que você dá) ou incerteza (não dá para saber)?</p>
    ${classifForm(`${base.path}.classif`, fids, d.classif)}
    <h3 class="passo">2 · Envolvidos e afetados</h3><p class="muted" style="margin:0">Quem você vê na cena? Toque nas pessoas da foto ou escolha abaixo.</p>
    <div class="row">${pes.map((pid) => chip(`${base.path}.vejo`, pid, d.vejo, esc(PESSOAS[pid].desc))).join("")}</div>
    <p class="muted" style="margin:6px 0 0">Para você, quem mais é afetado e não aparece?</p><div class="row">${FORA.map((f) => chip(`${base.path}.fora`, f.id, d.fora, esc(f.t))).join("")}</div>
    <h3 class="passo">3 · Vulnerabilidades e poder</h3><p class="muted" style="margin:0">Você vê alguém vulnerável na imagem?</p>
    <div class="row">${pes.map((pid) => chip(`${base.path}.vulner`, pid, d.vulner, esc(PESSOAS[pid].desc))).join("") || `<span class="faint">Ninguém aparece na sua foto.</span>`}</div>
    <p class="muted" style="margin:6px 0 0">Para você, há vulneráveis nessa situação, mesmo fora da imagem?</p><div class="row">${FORA.map((f) => chip(`${base.path}.vulnerFora`, f.id, d.vulnerFora, esc(f.t))).join("")}</div>
    <textarea data-in="${base.path}.poder" data-key="${base.path}-poder" placeholder="Para você, quem tem poder sobre quem aqui?">${esc(d.poder || "")}</textarea>
    <h3 class="passo">4 · Direitos, deveres e salvaguardas</h3><p class="muted" style="margin:0">Para você, que deveres ou princípios estão em jogo?</p>
    <div class="row">${Object.entries(CARTAS).filter(([, c]) => c.grupo === "Deveres" || c.grupo === "Princípios").map(([k, c]) => chip(`${base.path}.deveres`, k, d.deveres, esc(c.nome))).join("")}</div>
    <h3 class="passo">Seu papel na situação</h3>${Object.entries(PAPEL_NA_SITUACAO).map(([k, t]) => opt(`${base.path}.papel`, k, d.papel, t)).join("")}
    <h3 class="passo">Se nada for feito, em duas semanas…</h3>
    ${PREV.map(([k, t]) => `<div class="card" style="padding:10px 12px"><b>${t}</b><div class="dirs" style="margin-top:6px">${[["piora", "piora"], ["igual", "igual"], ["melhora", "melhora"]].map(([v, n]) => `<button class="btn sm ${d.prev?.[k] === v ? "on" : "sec"}" data-a="setk" data-path="${base.path}.prev" data-k="${k}" data-val="${v}">${n}</button>`).join("")}</div></div>`).join("")}
    <h3 class="passo">${grupo ? "O que o grupo faria agora?" : "O que você faria agora?"}</h3>${alts.map((al) => opt(`${base.path}.acao`, al.id, d.acao, esc(txt(al.t, st.pers)))).join("")}
    <h3 class="passo">Por quê?</h3><p class="faint" style="margin:0">${grupo ? "Use pelo menos 2 cartas das mochilas do grupo." : "Escolha até 2 cartas da sua mochila que sustentam a decisão."}</p>
    <div class="row">${mochila.map((k) => chip(`${base.path}.cartas`, k, d.cartas, "🎒 " + esc(CARTAS[k].nome))).join("") || `<span class="faint">Sua mochila está vazia.</span>`}</div>
    <textarea data-in="${base.path}.porque" data-key="${base.path}-porque" placeholder="Justifique com suas palavras">${esc(d.porque || "")}</textarea>`;
}

function completo(d, fids, minCartas = 0) {
  const nFr = fids.reduce((n, f) => n + FOTOS[f].frases.length, 0);
  return d && Object.keys(d.classif || {}).length >= nFr && d.papel && d.acao && PREV.every(([k]) => d.prev?.[k]) && (d.cartas || []).length >= minCartas && (d.porque || "").trim().length > 3;
}

export function renderAluno(st, id, loc) {
  const me = st.alunos[id];
  const g = me?.grupo ? st.grupos[me.grupo] : null;
  const p = g ? papelById(g.papel) : null;
  const souLider = g && g.lider === id;
  let b = "";
  if (!me) {
    b = st.fase === "entrada" ? `<h2>Embarque</h2><input type="text" data-in="nome" data-key="nome" value="${esc(loc.nome)}" placeholder="Seu nome"><button class="btn block" data-a="entrar">Entrar na sala</button>` : `<h2>A sala já começou</h2>`;
    return hd(st, me) + `<div class="bd">${b}</div>`;
  }
  const mochila = st.resp[id].viagem.mochila;
  switch (st.fase) {
    case "entrada": b = `<h2>Você está na sala</h2><p class="muted">Aguarde o professor sortear os grupos.</p>`; break;
    case "grupos":
      b = `<div class="card" style="background:${p.cor};color:#fff;text-align:center;padding:24px"><div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.9">Seu papel</div><div style="font-size:26px;font-weight:800;line-height:1.2">${esc(p.nome)}</div></div>
        <p class="muted">Procure na sala quem tem esta mesma cor:</p><div class="row">${g.membros.filter((m) => m !== id).map((m) => `<span class="chip">${esc(st.alunos[m].nome)}</span>`).join("")}</div>
        ${g.achou[id] ? `<p class="pill-ok">Pronto! Aguarde os demais.</p>` : `<button class="btn ok block" data-a="achei">Achei meu grupo</button>`}`;
      break;
    case "lider":
      if (g.lider) { b = g.lider === id ? `<h2>Você é o líder</h2><p>Só você envia as respostas do grupo. Antes de enviar, ouça todos e confira as respostas individuais.</p>` : `<h2>Líder: ${esc(st.alunos[g.lider].nome)}</h2><p class="muted">Só o líder envia a resposta do grupo. As respostas individuais continuam sendo suas.</p>`; break; }
      if (!g.metodo) b = `<h2>Como o grupo escolhe o líder?</h2><p class="muted">Vale a maioria. Empate: o sistema sorteia.</p>
        <button class="opt ${g.metodoVotos[id] === "votar" ? "sel" : ""}" data-a="metodo" data-val="votar"><b>Votação</b><br><span class="faint">cada um vota em alguém do grupo, menos em si</span></button>
        <button class="opt ${g.metodoVotos[id] === "sorteio" ? "sel" : ""}" data-a="metodo" data-val="sorteio"><b>O sistema sorteia</b></button><p class="faint">${Object.keys(g.metodoVotos).length}/${g.membros.length} já escolheram</p>`;
      else b = `<h2>Vote no líder</h2><p class="muted">Você não pode votar em si. Empate: sorteio entre os mais votados.</p>${g.membros.filter((m) => m !== id).map((m) => `<button class="opt ${g.votos[id] === m ? "sel" : ""}" data-a="votoLider" data-val="${m}">${esc(st.alunos[m].nome)}</button>`).join("")}<p class="faint">${Object.keys(g.votos).length}/${g.membros.length} votaram</p>`;
      break;
    case "viagem": {
      const r = st.resp[id].viagem.r;
      const i = Math.min(loc.parada, PARADAS.length - 1);
      const pa = PARADAS[i];
      const resp = r[pa.id];
      b = `<div class="row" style="justify-content:space-between"><span class="chip">Parada ${i + 1} de ${PARADAS.length}</span><span class="chip">🎒 ${mochila.length}/3</span></div>
        <h2>${pa.titulo}</h2><p>${pa.texto}</p>
        <div class="card"><b>Cartas desta parada</b><p class="faint" style="margin:2px 0 8px">Você só leva 3 cartas para o posto. Escolha com cuidado.</p>
        <div class="row">${pa.cartas.map((k) => `<button class="btn sm ${mochila.includes(k) ? "warn on" : "sec"}" data-a="mochila" data-val="${k}" ${!mochila.includes(k) && mochila.length >= 3 ? "disabled" : ""}>🎒 ${esc(CARTAS[k].nome)}</button>`).join("")}</div></div>
        <div class="card"><b>${pa.pergunta.q}</b>${pa.pergunta.op.map((o, k) => `<button class="opt ${resp == null ? "" : k === pa.pergunta.certa ? "right" : resp === k ? "wrong" : ""}" data-a="viagemResp" data-val="${k}" ${resp != null ? "disabled" : ""}>${o}</button>`).join("")}
        ${resp != null ? `<p class="${resp === pa.pergunta.certa ? "pill-ok" : "pill-bad"}">${resp === pa.pergunta.certa ? "Isso." : "Não foi dessa vez."}</p><p class="muted">${pa.pergunta.fb}</p>` : ""}</div>
        <div class="row"><button class="btn sec grow" data-a="parada" data-val="-1" ${i === 0 ? "disabled" : ""}>Anterior</button>${i < PARADAS.length - 1 ? `<button class="btn grow" data-a="parada" data-val="1">Próxima</button>` : `<button class="btn ok grow" data-a="concluirViagem" ${!PARADAS.every((p) => r[p.id] != null) || mochila.length < 2 || st.resp[id].viagem.concluida ? "disabled" : ""}>${st.resp[id].viagem.concluida ? "Viagem concluída ✓" : "Concluir viagem"}</button>`}</div>
        ${i === PARADAS.length - 1 ? `<p class="faint">${st.resp[id].viagem.concluida ? "Pronto! Aguarde o professor. Você ainda pode voltar para revisar suas cartas." : "Responda às sete paradas e leve pelo menos duas cartas para concluir."}</p>` : ""}`;
      break;
    }
    case "cena":
      b = `<span class="chip">Olhe o telão</span><h2>A cena</h2><p>${esc(ABERTURA)}</p><div class="card"><b>${esc(p.nome)}</b><p class="muted">${esc(p.abertura)}</p></div>
        <div class="card"><b>🎒 Sua mochila</b><div class="row" style="margin-top:6px">${mochila.map((k) => `<span class="chip law">${esc(CARTAS[k].nome)}</span>`).join("") || `<span class="faint">vazia</span>`}</div></div>`;
      break;
    case "posto": {
      const minha = g.fotoDe[id];
      const ind = st.resp[id].posto;
      const todas = fotosDoGrupo(g);
      const topo = `<h2>${esc(p.nome)}</h2><p class="muted">${esc(p.abertura)}</p>`;
      if (!ind) {
        const imagem = foto(st, minha, { sel: loc.ind.vejo, path: "ind.vejo" });
        if (falhaGrafica) { b = topo + imagem; break; }
        b = topo + imagem + ancora(st, p) + `<div class="sep"></div><h3 style="color:var(--o2)">Sua resposta individual</h3>` +
          blocoRoteiro(st, { id, path: "ind" }, loc.ind, [minha], mochila) +
          `<button class="btn ok block" data-a="postoInd" ${completo(loc.ind, [minha]) ? "" : "disabled"}>Enviar minha resposta</button>`;
      } else if (souLider && !g.h1) {
        if (!loc.gf) loc.gf = { ...structuredClone(ind), cartas: [], relato: { vimos: [], naoSabemos: "", preocupa: "" } };
        const membros = g.membros.map((m) => st.resp[m].posto).filter(Boolean);
        const cont = (f) => { const c = {}; membros.forEach((o) => [].concat(f(o)).forEach((x) => x && (c[x] = (c[x] || 0) + 1))); return Object.entries(c).sort((a, b2) => b2[1] - a[1]); };
        const cartasGrupo = [...new Set(g.membros.flatMap((m) => st.resp[m].viagem.mochila))];
        const frasesGrupo = todas.flatMap((fid) => FOTOS[fid].frases.map((fr, i) => ({ k: `${fid}:${i}`, fr })));
        const rel = loc.gf.relato;
        const imagens = todas.map((fid) => foto(st, fid, { sel: loc.gf.vejo, path: "gf.vejo" })).join("");
        if (falhaGrafica) { b = topo + imagens; break; }
        b = topo + `<div class="galeria">${imagens}</div>` + ancora(st, p) +
          `<div class="card"><b>Respostas individuais (${membros.length}/${g.membros.length})</b>
          ${cont((o) => o.acao).map(([k, n]) => `<div class="row" style="justify-content:space-between"><span>${esc(txt(ALTERNATIVAS[p.id].find((a) => a.id === k)?.t, st.pers))}</span><b>${n}</b></div>`).join("")}<div class="sep"></div>
          ${cont((o) => o.papel).map(([k, n]) => `<div class="row" style="justify-content:space-between"><span class="muted">${PAPEL_NA_SITUACAO[k]}</span><b>${n}</b></div>`).join("")}<div class="sep"></div>
          <span class="faint">Vulneráveis apontados:</span> ${cont((o) => [...(o.vulner || []), ...(o.vulnerFora || [])]).map(([k, n]) => `<span class="chip">${esc(PESSOAS[k]?.desc || FORA.find((f) => f.id === k)?.t)} · ${n}</span>`).join(" ") || "—"}</div>
          <h3 style="color:var(--o2)">Resposta do grupo (só você envia)</h3>` +
          blocoRoteiro(st, { id, path: "gf" }, loc.gf, todas, cartasGrupo, { grupo: true }) +
          `<h3 class="passo">Relato para outro papel</h3><p class="faint" style="margin:0">Seu relato vai para: <b>${esc(papelById(st.grupos[destinoRelato(st, g)]?.papel)?.nome || "—")}</b>. Ele não vê as suas fotos, só o relato.</p>
          <p class="muted" style="margin:6px 0 0">O que vimos (até 3 frases):</p>
          ${frasesGrupo.map(({ k, fr }) => `<button class="opt ${rel.vimos.includes(k) ? "sel" : ""}" data-a="toggleMax" data-path="gf.relato.vimos" data-val="${k}" data-max="3">${esc(fr.t)}</button>`).join("")}
          <textarea data-in="gf.relato.naoSabemos" data-key="rel-ns" maxlength="140" placeholder="O que não sabemos">${esc(rel.naoSabemos)}</textarea>
          <textarea data-in="gf.relato.preocupa" data-key="rel-pr" maxlength="140" placeholder="Quem nos preocupa e por quê">${esc(rel.preocupa)}</textarea>
          <button class="btn ok block" data-a="h1" ${completo(loc.gf, todas, 2) && rel.vimos.length ? "" : "disabled"}>Enviar pelo grupo</button>`;
      } else {
        b = topo + `<p class="pill-ok">Sua resposta foi enviada. Agora o grupo vê todas as fotos do papel:</p><div class="galeria">${todas.map((fid) => foto(st, fid, { pontos: false })).join("")}</div>` + ancora(st, p) +
          (g.h1 ? `<div class="card"><b>O grupo enviou</b><p>${esc(txt(ALTERNATIVAS[p.id].find((a) => a.id === g.h1.acao)?.t, st.pers))}</p></div>` : `<p class="muted">Discutam. ${souLider ? "" : `Quem envia é ${esc(st.alunos[g.lider].nome)}.`}</p>`);
      }
      break;
    }
    case "canais": {
      const recebidos = Object.values(st.grupos).filter((x) => x.relato && destinoRelato(st, x) === g.id);
      const para = st.grupos[destinoRelato(st, g)];
      b = `<h2>Canais</h2><p class="muted">Vocês não viram estas fotos. Só receberam o que outro papel contou.</p>
        ${recebidos.map((x) => `<div class="card"><b>✉ De: ${esc(papelById(x.papel).nome)}</b><div class="faint" style="font-size:12px;margin-top:6px">O que viram</div><ul style="margin:4px 0 0 18px;padding:0">${x.relato.vimos.map((k) => { const [f, i] = k.split(":"); return `<li>${esc(FOTOS[f].frases[+i].t)}</li>`; }).join("")}</ul>
          ${x.relato.naoSabemos ? `<div class="faint" style="font-size:12px;margin-top:6px">O que não sabem</div><p style="margin:2px 0">${esc(x.relato.naoSabemos)}</p>` : ""}${x.relato.preocupa ? `<div class="faint" style="font-size:12px;margin-top:6px">Quem os preocupa</div><p style="margin:2px 0">${esc(x.relato.preocupa)}</p>` : ""}</div>`).join("") || `<p class="faint">Nenhum relato chegou para o seu papel.</p>`}
        ${g.relato && para ? `<p class="faint">O relato do seu grupo foi para: ${esc(papelById(para.papel).nome)}.</p>` : ""}
        ${souLider && !g.ciente ? `<button class="btn block" data-a="ciente">Lemos os relatos</button>` : g.ciente ? `<p class="pill-ok">Relatos lidos.</p>` : ""}`;
      break;
    }
    case "laboratorio": {
      const lente = LENTES[g.i % LENTES.length];
      const alts = ALTERNATIVAS[p.id];
      if (!loc.lab.init) { loc.lab = { init: true, acoes: g.h1?.acao ? [g.h1.acao] : [] }; }
      const sim = desfecho(st, { papel: p.id, h2: { acoes: loc.lab.acoes } });
      const ruins = Object.entries(sim).filter(([, v]) => v.estado === "mal");
      b = `<h2>Laboratório de decisões</h2><div class="card"><span class="chip law">Lente do grupo: ${lente.nome}</span><p style="margin:8px 0 0">${lente.q}</p></div>
        <h3 class="passo">Teste até 2 ações do seu papel</h3>${alts.map((al) => `<button class="opt ${loc.lab.acoes.includes(al.id) ? "sel" : ""}" data-a="labToggle" data-val="${al.id}">${esc(txt(al.t, st.pers))}</button>`).join("")}
        <div class="card"><b>Se só o seu papel agir assim, em duas semanas…</b>
          ${Object.entries(DIMENSOES).map(([k, d]) => `<div class="row" style="justify-content:space-between;margin-top:6px"><span>${esc(d.curto)}</span><b class="${sim[k].estado === "bem" ? "pill-ok" : sim[k].estado === "mal" ? "pill-bad" : "muted"}">${sim[k].estado === "bem" ? "melhora" : sim[k].estado === "mal" ? "segue em risco" : "fica no ar"}</b></div>`).join("")}
          ${ruins.length ? `<p class="faint" style="margin-top:8px">O que segue em risco não se resolve só pelo seu papel. Outro papel vai precisar agir.</p>` : ""}</div>
        ${souLider && !g.h2 ? `<h3 style="color:var(--o2)">Decisão do grupo</h3>${[["mantem", "Manter o que decidimos no posto"], ["ajusta", "Ajustar"], ["abandona", "Abandonar e trocar"]].map(([k, t]) => opt("h2.decisao", k, loc.h2.decisao, t)).join("")}
          <p class="faint" style="margin:0">As ações enviadas são as que estão marcadas acima.</p>
          <div class="row">${[...new Set(g.membros.flatMap((m) => st.resp[m].viagem.mochila))].map((k) => chip("h2.cartas", k, loc.h2.cartas, "🎒 " + esc(CARTAS[k].nome))).join("")}</div>
          <textarea data-in="h2.porque" data-key="h2p" placeholder="O que fez vocês manterem ou mudarem?">${esc(loc.h2.porque || "")}</textarea>
          <button class="btn ok block" data-a="h2" ${loc.h2.decisao && loc.lab.acoes.length && (loc.h2.cartas || []).length >= 2 && (loc.h2.porque || "").trim().length > 3 ? "" : "disabled"}>Enviar decisão do grupo</button>`
          : g.h2 ? `<p class="pill-ok">O grupo decidiu: ${{ mantem: "manter", ajusta: "ajustar", abandona: "abandonar e trocar" }[g.h2.decisao]}.</p>` : `<p class="muted">Explorem juntos. Quem envia é ${esc(st.alunos[g.lider].nome)}.</p>`}`;
      break;
    }
    case "confronto": case "linhas": {
      const pl = placarClassificacao(st.resp[id].posto?.classif);
      b = `<span class="chip">Olhe o telão</span><h2>${st.fase === "confronto" ? "A cena inteira" : "Duas semanas depois"}</h2>
        <div class="card"><b>Você, na sua foto</b><p>Acertou ${pl.ok} de ${pl.tot} na separação entre fato, interpretação e incerteza.</p>${pl.interpComoFato ? `<p class="pill-bad">Marcou ${pl.interpComoFato} interpretação(ões) como fato.</p>` : `<p class="pill-ok">Não tratou interpretação como fato.</p>`}</div>`;
      break;
    }
    case "integracao": {
      const env = st.resp[id].saida;
      b = `<p class="big">${esc(CONCLUSAO)}</p><h2>Bilhete de saída</h2>${env ? `<p class="pill-ok">Enviado.</p><p class="muted">${esc(env)}</p>` : `<p>O que você tratou como fato e era interpretação? Isso mudou a sua decisão?</p><textarea data-in="saida" data-key="saida">${esc(loc.saida)}</textarea><button class="btn ok block" data-a="saida" ${loc.saida.trim().length > 3 ? "" : "disabled"}>Enviar</button>`}`;
      break;
    }
    default: b = "";
  }
  return hd(st, me) + `<div class="bd">${b}</div>`;
}

export function acaoAluno(a, el, ctx) {
  const { st, id, loc, dispatch } = ctx;
  const get = (path) => path.split(".").reduce((o, k) => (o[k] ??= {}), loc);
  const setP = (path, v) => { const ks = path.split("."); let o = loc; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] ??= {}; o[ks.at(-1)] = v; };
  const getArr = (path) => { const ks = path.split("."); let o = loc; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] ??= {}; if (!Array.isArray(o[ks.at(-1)])) o[ks.at(-1)] = []; return o[ks.at(-1)]; };
  switch (a) {
    case "set": setP(el.dataset.path, el.dataset.val); return true;
    case "setk": get(el.dataset.path)[el.dataset.k] = el.dataset.val; return true;
    case "toggle": { const arr = getArr(el.dataset.path); const k = arr.indexOf(el.dataset.val); if (k >= 0) arr.splice(k, 1); else arr.push(el.dataset.val); return true; }
    case "toggleMax": { const arr = getArr(el.dataset.path); const k = arr.indexOf(el.dataset.val); if (k >= 0) arr.splice(k, 1); else if (arr.length < +el.dataset.max) arr.push(el.dataset.val); return true; }
    case "labToggle": { const arr = loc.lab.acoes; const k = arr.indexOf(el.dataset.val); if (k >= 0) arr.splice(k, 1); else if (arr.length < 2) arr.push(el.dataset.val); return true; }
    case "entrar": if (loc.nome.trim()) dispatch({ t: "entrar", id, nome: loc.nome }); return true;
    case "achei": dispatch({ t: "achei", id }); return true;
    case "metodo": dispatch({ t: "metodo", id, m: el.dataset.val }); return true;
    case "votoLider": dispatch({ t: "votoLider", id, alvo: el.dataset.val }); return true;
    case "parada": loc.parada = Math.max(0, Math.min(PARADAS.length - 1, loc.parada + +el.dataset.val)); return true;
    case "concluirViagem": dispatch({ t: "concluirViagem", id }); return true;
    case "viagemResp": dispatch({ t: "viagemResp", id, parada: PARADAS[loc.parada].id, op: +el.dataset.val }); return true;
    case "mochila": dispatch({ t: "mochila", id, carta: el.dataset.val }); return true;
    case "postoInd": dispatch({ t: "postoInd", id, dados: structuredClone(loc.ind) }); return true;
    case "h1": { const { relato, ...dados } = structuredClone(loc.gf); dispatch({ t: "h1", id, dados, relato }); return true; }
    case "ciente": dispatch({ t: "ciente", id }); return true;
    case "h2": dispatch({ t: "h2", id, dados: { ...structuredClone(loc.h2), acoes: [...loc.lab.acoes] } }); return true;
    case "saida": dispatch({ t: "saida", id, texto: loc.saida }); return true;
    default: return false;
  }
}
