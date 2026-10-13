/* MOSAICO · O Eco do Amanhã · O Impostor — a partida (16/10 rev9-jogo).
   Monta a partida (o mesmo algoritmo de vestchip/partidas.py), a matriz de
   falas (vestchip/falas.py) e resolve as fichas do roteiro. Roda no celular
   (window.VCPartida) e no validador (Node: require). Não depende da tela. */
(function (g) {
  'use strict';
  var D = (typeof module !== 'undefined' && module.exports) ? require('./dados.js') : g.VC_DADOS;

  /* ── sorteio com semente (o mesmo gerador das outras mesas) ── */
  function gerador(semente) {
    semente = String(semente); var h = 1779033703 ^ semente.length;
    for (var i = 0; i < semente.length; i++) { h = Math.imul(h ^ semente.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return function () { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; var t = (h += 0x6D2B79F5); t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function misturar(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hash(s) { s = String(s); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  var E = D.elenco, TODOS = D.nucleo.concat(D.extras);

  function faixaDe(n) { for (var i = 0; i < D.faixas.length; i++) { var f = D.faixas[i]; if (n >= f[1] && n <= f[2]) return { nome: f[0], casa: f[3] }; } throw new Error('humanos fora das faixas (1 a 12)'); }
  function pressaoDe(I, elenco) { var c = ['investidora', 'advogada', 'jornalista']; for (var i = 0; i < c.length; i++) if (elenco.indexOf(c[i]) >= 0 && c[i] !== I) return c[i]; return 'conselho'; }

  /* montar(semente, {humanos, impostor}) — vestchip/partidas.py, montar() */
  function montar(semente, o) {
    o = o || {}; var r = gerador(semente + '|montar'), humanos = Math.max(1, Math.min(12, +o.humanos || 1));
    var fx = faixaDe(humanos), casa = fx.casa;
    var I = (o.impostor && E[o.impostor]) ? o.impostor : TODOS[Math.floor(r() * TODOS.length)];
    var nExt = casa - 6, esc = D.extras.indexOf(I) >= 0 ? [I] : [];
    var resto = misturar(D.extras.filter(function (e) { return esc.indexOf(e) < 0; }), r);
    esc = esc.concat(resto.slice(0, nExt - esc.length));
    var elenco = D.nucleo.concat(D.extras.filter(function (e) { return esc.indexOf(e) >= 0; }));
    var inoc = elenco.filter(function (c) { return c !== I; });
    function um(l) { return l[Math.floor(r() * l.length)]; }
    var A = um(inoc.filter(function (c) { return E[c].aj; }));
    var F = um(inoc.filter(function (c) { return c !== A; }));
    var Dd = um(inoc.filter(function (c) { return c !== A && c !== F; }));
    var hum = [A, F].slice(0, humanos);
    hum = hum.concat(misturar(inoc.filter(function (c) { return hum.indexOf(c) < 0; }), r).slice(0, humanos - hum.length));
    var fun = D.funil[String(casa)];
    var pool = misturar(inoc.filter(function (c) { return c !== Dd; }), r);
    var S7 = pool.slice(0, 2), rs = pool.slice(2);
    var S4 = rs.slice(0, fun[0]), S5 = rs.slice(fun[0], fun[0] + fun[1]), S6 = rs.slice(fun[0] + fun[1], fun[0] + fun[1] + fun[2]);
    var atraso = um([38, 40, 42, 44, 46]);
    var lote = 'LT-' + (1000 + Math.floor(r() * 9000)) + '-' + (10 + Math.floor(r() * 90));
    var peso = um([2, 3, 4]);
    var p = {
      id: o.id || String(semente), semente: String(semente), I: I, A: A, F: F, D: Dd, humanos: hum, n_humanos: humanos, faixa: fx.nome, casa: casa,
      elenco: elenco, extras: D.extras.filter(function (e) { return esc.indexOf(e) >= 0; }), S4: S4, S5: S5, S6: S6, S7: S7,
      atraso: atraso, lote: lote, peso: peso, hora_fc: F === 'filho' ? '20h41' : '20h46', RECON: um(elenco),
      CORTA_FOGO: elenco.filter(function (c) { return E[c].caminho.indexOf('escada-corta-fogo') >= 0; }),
      PRESSAO: pressaoDe(I, elenco), REFORCO: D.cred6.indexOf(I) >= 0
    };
    p.OBJ_F = D.objeto[F];
    p.tipos = {}; elenco.forEach(function (c) { p.tipos[c] = D.tipos[Math.floor(gerador(semente + '|tipo|' + c)() * 6)]; });
    /* Bem-vindo / Bem-vinda: a forma de cada personagem nesta partida. A dos humanos vem da
       escolha deles (o.formas, 'f' ou 'm'; 'n' = tanto faz, sorteado); a do sistema, impostor
       incluído, é sorteada pela semente, para que a forma nunca diga quem é humano. */
    p.formas = {}; TODOS.forEach(function (c) { var q = o.formas && o.formas[c]; p.formas[c] = (q === 'f' || q === 'm') ? q : (gerador(semente + '|forma|' + c)() < 0.5 ? 'f' : 'm'); });
    p.D_ini = hms(20, 26, 5);
    var ro = gerador(semente + '|ordem');
    p.ordemDI = ro() < 0.5 ? ['D', 'I'] : ['I', 'D'];
    p.ordem3 = misturar([I, Dd, S7[0]], ro);
    return p;
  }

  /* ── números e horas ── */
  function hms(h, m, s) { return h * 3600 + m * 60 + (s || 0); }
  function hora(s) { var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h + 'h' + ('0' + m).slice(-2) + (x ? 'min' + ('0' + x).slice(-2) + 's' : ''); }
  var UN = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  var DZ = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  var CT = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  function ext(n, fem) {
    var s;
    if (n < 20) s = UN[n];
    else if (n < 100) s = DZ[Math.floor(n / 10)] + (n % 10 ? ' e ' + UN[n % 10] : '');
    else if (n === 100) s = 'cem';
    else s = CT[Math.floor(n / 100)] + (n % 100 ? ' e ' + ext(n % 100) : '');
    if (fem) s = s.replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas').replace(/zentos/, 'zentas');
    return s;
  }
  function cap1(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function min1(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function janela(p, c) { var t = E[c].t; return [D.geo.CHAVE_RETIRADA - t, D.geo.CHAVE_DEVOLVIDA + t]; }
  function horaExt(h) { var m = /(\d+)h(\d+)/.exec(h), hh = +m[1] % 12, mm = +m[2]; return ext(hh) + (mm ? ' e ' + ext(mm) : ''); }

  /* ── nomes ── */
  var PREP = { de: ['da', 'do', 'de você'], a: ['à', 'ao', 'a você'], em: ['na', 'no', 'em você'], por: ['pela', 'pelo', 'por você'] };
  /* o personagem do jogador aparece pelo nome, em destaque (os pronomes da história continuam certos) */
  var FORMAS = null;   /* as formas da partida em jogo (usarFormas); sem elas, a forma canônica */
  function usarFormas(f) { FORMAS = f || null; }
  function formaDe(id, ctx) { var f = (ctx && ctx.formas) || FORMAS, P = E[id]; if (!P) return D.remotos[id] && D.remotos[id].a === 'o' ? 'm' : 'f'; return (f && f[id]) || (P.a === 'o' ? 'm' : 'f'); }
  function nomeDe(id, ctx) { var P = E[id]; if (!P) return D.remotos[id].n; if (!P.nf) return P.n; return formaDe(id, ctx) === 'm' ? P.nm : P.nf; }
  function artDe(id, ctx) { return formaDe(id, ctx) === 'm' ? 'o' : 'a'; }
  function nome(id, prep, ctx, maiusc) {
    var P = E[id] || D.remotos[id], fem = formaDe(id, ctx) === 'f', art = prep ? PREP[prep][fem ? 0 : 1] : (fem ? 'a' : 'o'), n = nomeDe(id, ctx);
    if (maiusc) art = cap1(art);
    return (ctx && ctx.eu === id) ? art + ' <b class="eu">' + n + '</b>' : art + ' ' + n;
  }
  /* {g:X:fem|masc}: X = ids ligados por + (fem só se todos forem fem); ids ausentes não contam */
  function generos(t, ctx, p) {
    return t.replace(/\{g:([A-Za-z0-9+]+):([^{}|]*)\|([^{}]*)\}/g, function (m, x, f, ms) {
      var ids = x.split('+').map(function (c) { return c === 'eu' && ctx ? ctx.eu : c; }).filter(function (c) { return E[c] && (!p || p.elenco.indexOf(c) >= 0); });
      if (!ids.length) ids = x.split('+').filter(function (c) { return E[c]; });
      return ids.every(function (c) { return formaDe(c, ctx) === 'f'; }) ? f : ms;
    });
  }
  function lista(ids) { ids = ids.map(function (c) { return '{' + c + '}'; }); return ids.length < 2 ? ids.join('') : ids.slice(0, -1).join(', ') + ' e ' + ids[ids.length - 1]; }
  var ROLES = { I: 1, A: 1, F: 1, D: 1, RECON: 1, PRESSAO: 1, S7a: 1, S7b: 1 };
  function papel(p, R) { return R === 'S7a' ? p.S7[0] : R === 'S7b' ? p.S7[1] : p[R]; }

  /* ── fichas que geram texto (antes da presença) ── */
  function macros(t, p) {
    var G = D.geo;
    var M = {
      DI: function () { return p.ordemDI.map(function (r) { return '{' + p[r] + '}'; }).join(' e '); },
      desm2: function () {
        return p.ordemDI.map(function (r) {
          var c = p[r], d = D.desm[c], ini, fim;
          if (r === 'I') { var j = janela(p, c); ini = j[0]; fim = j[1]; } else { ini = p.D_ini; fim = p.D_ini + E[c].aus[1]; }
          var tx = d[1].replace(/\{ini\}/g, hora(ini)).replace(/\{fim\}/g, hora(fim)) + (r === 'I' ? d[2] : '');
          return 'No posto {de:' + c + '}, ' + min1(tx);
        }).join('‖');
      },
      auto3: function () { var l = p.ordem3.map(function (c) { return '{' + c + '}, ' + D.term[c]; }); return l[0] + '; ' + l[1] + '; e ' + l[2]; },
      S6frase: function () { if (!p.S6.length) return ''; return lista(p.S6) + (p.S6.length > 1 ? ' tiveram' : ' teve') + ' a noite fechada pelos próprios registros, fora do percurso. '; },
      cred_ausentes: function () { var a = ['notaria', 'engenheira'].filter(function (c) { return p.elenco.indexOf(c) < 0; }); if (!a.length) return ''; var n = a.map(function (c) { return '«' + nome(c) + '»'; }); return ' ' + cap1(n.join(' e ')) + (a.length > 1 ? ' não estavam' : ' não estava') + ' na torre naquela noite.'; },
      atraso: function () { return String(p.atraso); }, atraso_ext: function () { return ext(p.atraso); },
      peso: function () { return String(p.peso); }, peso_ext: function () { return ext(p.peso); },
      lote: function () { return p.lote; }, hora_fc: function () { return p.hora_fc; }, hora_fc_ext: function () { return horaExt(p.hora_fc); },
      difmin_ext: function () { return ext(+p.hora_fc.slice(3) - 26); }
    };
    var POR = {
      alibis: function (k) { return p[k].map(function (c) { return D.alibi[c]; }).join('‖'); },
      npessoas: function (k) { return ext(p[k].length, true) + (p[k].length > 1 ? ' pessoas' : ' pessoa'); },
      lista: function (k) { return lista(p[k]); },
      objeto: function (c) { return D.objeto[c]; }, segredo3: function (c) { return '{' + c + '} ' + D.seg3[c]; },
      aus1: function (c) { return D.aus1[c]; }, mentira: function (c) { return E[c].mentira; }, confissao: function (c) { return E[c].confissao; },
      postode: function (c) { return D.postode[c]; }, postoem: function (c) { return D.postoem[c]; }, term: function (c) { return D.term[c]; },
      total_ext: function (c) { return ext(G.NUCLEO_ATO + 2 * E[c].t); }, total_cap: function (c) { return cap1(ext(G.NUCLEO_ATO + 2 * E[c].t)); },
      dur_cap: function (c) { return cap1(ext(E[c].aus[1])); }, ini: function (c) { return hora(janela(p, c)[0]); }, fim: function (c) { return hora(janela(p, c)[1]); }
    };
    for (var volta = 0; volta < 4; volta++) {
      var antes = t;
      t = t.replace(/\{([A-Za-z0-9_]+)\}/g, function (m, k) { return M[k] ? M[k]() : m; });
      t = t.replace(/\{([a-z0-9_]+):([A-Za-z0-9]+)\}/g, function (m, f, a) {
        if (!POR[f]) return m;
        if (f === 'alibis' || f === 'npessoas' || f === 'lista') return POR[f](a);
        var c = ROLES[a] ? papel(p, a) : a; return E[c] ? POR[f](c) : m;
      });
      if (t === antes) break;
    }
    t = t.replace(/\{g:([A-Za-z0-9+]+):/g, function (m, x) { return '{g:' + x.split('+').map(function (r) { return ROLES[r] ? papel(p, r) : r; }).join('+') + ':'; });
    /* papéis nas fichas de nome: {I} {de:F} */
    t = t.replace(/\{(?:(de|a|em|por):)?(I|A|F|D|RECON|PRESSAO|S7a|S7b)\}/g, function (m, f, R) {
      var c = papel(p, R);
      if (c === 'conselho') return '«' + (f ? PREP[f][1] : 'o') + ' conselho do fundo»';
      return '{' + (f ? f + ':' : '') + c + '}';
    });
    return t;
  }

  /* ── condicionais {?..}..{:}..{/}, com aninhamento ── */
  function condicao(c, p, ctx) {
    var m = /^(!?)([A-Za-z0-9]+)(?:(!?=)([a-z]+))?$/.exec(c);
    if (!m) throw new Error('condição inválida: ' + c);
    if (m[3]) { var v = ROLES[m[2]] ? papel(p, m[2]) : (m[2] === 'eu' ? ctx.eu : null); return m[3] === '=' ? v === m[4] : v !== m[4]; }
    var sim = p.elenco.indexOf(m[2]) >= 0; return m[1] ? !sim : sim;
  }
  function condicionais(t, p, ctx) {
    for (var g = 0; g < 50; g++) {
      var i = t.lastIndexOf('{?'); if (i < 0) return t;
      var f = t.indexOf('}', i), cond = t.slice(i + 2, f), resto = t.slice(f + 1);
      var fim = resto.indexOf('{/}'); if (fim < 0) throw new Error('condicional sem {/}: ' + cond);
      var corpo = resto.slice(0, fim), k = corpo.indexOf('{:}');
      var sim = k >= 0 ? corpo.slice(0, k) : corpo, nao = k >= 0 ? corpo.slice(k + 3) : '';
      t = t.slice(0, i) + (condicao(cond, p, ctx) ? sim : nao) + resto.slice(fim + 3);
    }
    throw new Error('condicionais demais');
  }
  function alternativas(t, p) {
    return t.replace(/\{alt(x:[A-Za-z0-9]+)?:([^{}]+)\}/g, function (m, x, l) {
      var pula = x ? papel(p, x.slice(2)) : null, op = l.split('|');
      for (var i = 0; i < op.length; i++) {
        if (op[i].charAt(0) === '=') return op[i].slice(1);
        if (p.elenco.indexOf(op[i]) >= 0 && op[i] !== pula) return '{' + op[i] + '}';
      }
      throw new Error('alternativa sem ninguém: ' + m);
    });
  }

  var VERBOS = '(?:disse|perguntou|respondeu|pediu|corrigiu|confirmou|acrescentou|insistiu|repetiu)';
  var RE_SP = new RegExp('^—[^—]*—\\s*' + VERBOS + '\\s+\\{(?:[a-z]+:)?([a-z]+)\\}');
  function reqOk(req, p) { for (var i = 0; i < req.length; i++) if (p.elenco.indexOf(req[i]) < 0) return false; return true; }
  function citados(t) { var o = [], re = /\{(?:(?:de|a|em|por):)?([a-z]+)\}/g, m; while ((m = re.exec(t))) o.push(m[1]); return o; }
  function nomes(t, ctx) {
    return generos(t, ctx).replace(/\{~?(?:(de|a|em|por):)?([a-z]+)\}/g, function (m, f, c, pos, s) {
      if (!E[c] && !D.remotos[c]) return m;
      var antes = s.slice(0, pos).replace(/<[^>]+>/g, '').replace(/\s+$/, '');
      return nome(c, f, ctx, !antes || /[.!?]$/.test(antes) || /^—$|[.!?]\s*—$/.test(antes));
    }).replace(/(^|[.!?]\s+)(«?)([a-zà-ú])/g, function (m, a, b, c) { return a + b + c.toUpperCase(); }).replace(/[«»]/g, '');
  }

  /* render(texto, p, ctx, sps) → [{txt, sp, fala}] — uma batida em linhas */
  function render(tpl, p, ctx, sps) {
    ctx = ctx || {};
    var t = generos(alternativas(condicionais(macros(tpl, p), p, ctx), p), ctx, p);
    var out = [];
    t.split('\n').forEach(function (linha, li) {
      linha = linha.trim(); var req = [];
      var m = /^\[([a-z,]*)\]\s*/.exec(linha);
      if (m && linha.indexOf('‖') < 0) { req = m[1].split(',').filter(Boolean); linha = linha.slice(m[0].length); }
      if (!linha || !reqOk(req, p)) return;
      var segs = linha.split('‖').map(function (s) {
        s = s.trim(); var r2 = /^\[([a-z,]*)\]\s*/.exec(s), rq = [];
        if (r2) { rq = r2[1].split(',').filter(Boolean); s = s.slice(r2[0].length); }
        if (!s || !reqOk(rq.concat(citados(s)), p)) return null; return s;
      }).filter(Boolean);
      if (!segs.length) return;
      var bruto = segs.join(' '), fala = /^—/.test(bruto), sp = null;
      if (fala) { var ms = RE_SP.exec(bruto); sp = (sps && sps[li]) || (ms && ms[1]) || null; }
      out.push({ txt: nomes(bruto, ctx), bruto: bruto, sp: sp, fala: fala });
    });
    return out;
  }
  /* a fala sem a marca "— disse X": o que o jogador pode mandar */
  function semMarca(bruto, ctx) {
    var atrib = new RegExp('^' + VERBOS + '\\s+\\{'), segs = [];
    bruto.split('—').forEach(function (x) {
      x = x.trim(); if (!x) return;
      if (atrib.test(x) || /^\{(?:[a-z]+:)?[a-z]+\}/.test(x)) return;
      segs.push(x);
    });
    var out = '';
    segs.forEach(function (x, i) {
      if (/^,/.test(x)) out = out.replace(/\.$/, '') + ', ' + x.replace(/^,\s*/, '');
      else out += (out ? ' ' : '') + x;
      var prox = segs[i + 1];
      if (!/[.!?,;:…”"]$/.test(out) && !(prox && /^,/.test(prox))) out += '.';
    });
    return nomes(out, ctx);
  }

  /* ── perguntas (a certa primeiro) ── */
  /* fixa as formas da partida no texto inteiro (uma vez por página): {g:..} e {~..} viram texto */
  function fixarFormas(p) {
    usarFormas(p.formas);
    function anda(o, k) {
      if (typeof o === 'string') return o.indexOf('{') < 0 ? o : generos(o, null, p).replace(/\{~(?:(de|a|em|por):)?([a-z]+)\}/g, function (m, f, c) { return E[c] ? nome(c, f) : m; });
      if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = anda(o[i]); return o; }
      if (o && typeof o === 'object') { for (var q in o) if (q !== 'geo') o[q] = anda(o[q], q); return o; }
      return o;
    }
    anda(D);
  }
  function rotulo(c, ctx) { return ctx && ctx.eu === c ? 'Você (' + nomeDe(c, ctx) + ')' : nomeDe(c, ctx); }
  function perguntas(p, cap, ctx) {
    var r = gerador(p.semente + '|perg|' + cap), out = [];
    function outros(certo, n, excl) { return misturar(p.elenco.filter(function (c) { return c !== certo && (excl || []).indexOf(c) < 0; }), r).slice(0, n); }
    D.perguntas.filter(function (q) { return q.cap === cap; }).forEach(function (q) {
      var P = { id: q.id, tipo: q.tipo, rotulo: q.tipo, pergunta: q.txt, peso: D.peso[q.tipo] };
      var k = q.resp;
      if (k.charAt(0) === '=') P.opcoes = D.opcoes[q.id].slice();
      else if (['S4', 'S5', 'S7', 'CORTA_FOGO'].indexOf(k) >= 0) {
        var cands = misturar(p.elenco, r); P.multi = true; P.candidatos = cands.map(function (c) { return rotulo(c, ctx); });
        P.certos = cands.map(function (c, i) { return p[k].indexOf(c) >= 0 ? i : -1; }).filter(function (i) { return i >= 0; }); P.ids = cands;
      } else if (k === 'I') P.opcoes = [p.I].concat(p.elenco.filter(function (c) { return c !== p.I && c !== ctx.eu; })).map(function (c) { return rotulo(c, ctx); });
      else if (k === 'A') P.opcoes = [p.A].concat(p.elenco.filter(function (c) { return c !== p.A && c !== p.I; })).map(function (c) { return rotulo(c, ctx); });
      else if (E[p[k]]) P.opcoes = [p[k]].concat(outros(p[k], 3)).map(function (c) { return rotulo(c, ctx); });
      else if (k === 'atraso') P.opcoes = [p.atraso].concat(misturar([38, 40, 42, 44, 46].filter(function (x) { return x !== p.atraso; }), r).slice(0, 3)).map(function (x) { return x + ' segundos'; });
      else if (k === 'peso') P.opcoes = [p.peso].concat([1, 2, 3, 4, 5].filter(function (x) { return x !== p.peso; }).slice(0, 3)).map(function (x) { return x + (x > 1 ? ' gramas' : ' grama'); });
      else if (k === 'lote') { var m = /LT-(\d{4})-(\d{2})/.exec(p.lote), a = +m[1], b = +m[2]; P.opcoes = [p.lote, 'LT-' + a + '-' + ((b + 17) % 90 + 10), 'LT-' + ((a + 1337) % 9000 + 1000) + '-' + b, 'LT-' + b + '' + b + '-' + (a % 90 + 10)]; }
      else if (k === 'OBJ_F') P.opcoes = [p.F].concat(outros(p.F, 3)).map(function (c) { return cap1(D.objeto[c]) + '.'; });
      else throw new Error('pergunta sem gabarito: ' + q.id);
      if (q.tipo === 'final') P.rotulo = 'final · o impostor (vale 3 vezes)';
      if (q.tipo === 'absurda') P.rotulo = 'de atenção (vale um quarto)';
      if (q.tipo === 'secundária') P.rotulo = 'secundária';
      out.push(P);
    });
    return out;
  }

  /* ── registros: os fatos de cada capítulo, por instrumento ── */
  function registros(p, cap, ctx) {
    return D.fatos.filter(function (f) { return f.cap === cap; }).map(function (f) {
      var l = render(f.txt.replace(/\{S4\}|\{S5\}|\{S6\}|\{S7\}/g, function (m) { return '{lista:' + m.slice(1, -1) + '}'; }), p, ctx);
      return { id: f.id, eixo: f.eixo, ess: f.ess, txt: l.map(function (x) { return x.txt; }).join(' ') };
    });
  }

  /* ── argumentos de exclusão (Caps. 4 a 7) ── */
  function exclusoes(p, ctx) {
    var o = [];
    p.S4.forEach(function (c) { o.push({ cap: 4, ids: [c], tpl: D.alibi[c] }); });
    p.S5.forEach(function (c) { o.push({ cap: 5, ids: [c], tpl: D.alibi[c] }); });
    p.S6.forEach(function (c) { o.push({ cap: 6, ids: [c], tpl: 'Os registros da noite fecharam {' + c + '} fora do percurso.' }); });
    o.push({ cap: 6, ids: [p.D], tpl: '{' + p.D + '} saiu do posto só por ' + E[p.D].aus[1] + ' segundos, curto demais para o percurso.' });
    p.S7.forEach(function (c) { o.push({ cap: 7, ids: [c], tpl: 'A presença lacrada situou {' + c + '} ' + D.postoem[c] + ' durante a janela inteira.' }); });
    o.forEach(function (x) { x.txt = render(x.tpl, p, ctx).map(function (l) { return l.txt; }).join(' '); });
    return o;
  }

  /* ── a revelação ── */
  function revelacao(p, ctx) {
    var I = p.I, j = janela(p, I), t = E[I].t, d = D.desm[I];
    var B = [
      ['O que fez', '{I} gravou a configuração na bancada às 20h23min30s, montou a ponte de cobre e levou o cartucho ao distribuidor da Central.'],
      ['Por onde foi', 'Do posto ({posto}) ao armário de serviço, ' + t + ' segundos; a chave às 20h25min33s; a grade da Galeria; o poço até o Arquivo (o chiado da gaveta às 20h26); o alçapão da Central; quarenta segundos de instalação; a volta pelo poço e o estalo da grade às 20h28min41s. Ao todo, {total_ext:I} segundos fora do posto.'],
      ['Quem viu não estar', 'Ninguém viu. A presença lacrada mostrou o posto vazio de ' + hora(j[0]) + ' a ' + hora(j[1]) + ', e a porta da corta-fogo não tem sensor.'],
      ['O que o registro desmente', '{mentira:I} ' + (d[1].replace(/\{ini\}/g, hora(j[0])).replace(/\{fim\}/g, hora(j[1]))) + d[2]],
      ['Quem ajudou, sem saber', '{A} passou adiante, às 20h03, o acesso de emergência que abriu o modo de manutenção. Achou que era uma tarefa atrasada.'],
      ['Por que os outros pareceram culpados', '{F} retirou do Arquivo {objeto:F} às {hora_fc}, depois do ato. {D} saiu do posto por ' + E[p.D].aus[1] + ' segundos, curto demais para o caminho. {diretora} antecipou a demonstração às 20h58, {g:diretora:pressionada|pressionado} pela mensagem das 20h57{?PRESSAO=conselho}, do conselho do fundo{:}, {de:PRESSAO}{/}.'],
      ['Por quê', '“{confissao:I}”']
    ];
    return B.map(function (b) { return [b[0], render(b[1].replace('{posto}', E[I].posto), p, ctx).map(function (l) { return l.txt; }).join(' ')]; });
  }

  /* ── desconfiança (vestchip/sim.py, C19) e as acusações do Cap. 8 ── */
  function desconfianca(p) {
    var d = {}; p.elenco.forEach(function (c) { d[c] = 1; });
    d[p.F] += 2; d[p.A] += 1; [p.I, p.D, p.S7[0]].forEach(function (c) { d[c] += 1; }); d[p.D] += 1; d[p.I] += 1;
    if (d.diretora) d.diretora += 1; if (d[p.PRESSAO]) d[p.PRESSAO] += 1;
    ['notaria', 'engenheira'].forEach(function (c) { if (d[c]) d[c] += 1; }); if (p.REFORCO) d[p.F] += 1;
    return d;
  }
  var MOTIVO_SUSP = function (p, c) {
    if (c === p.F) return 'a mídia azul retirada às ' + p.hora_fc;
    if (c === p.D) return 'a saída do posto que só apareceu no Capítulo 6';
    if (c === p.A) return 'o acesso de emergência das 20h03';
    if (c === 'diretora') return 'a ordem das 20h58';
    if (c === p.PRESSAO) return 'a mensagem das 20h57';
    if (c === 'notaria' || c === 'engenheira') return 'a credencial operacional';
    if (c === p.S7[0]) return 'o terminal que trabalhou sozinho';
    if (c === p.I) return 'a declaração de posto que o registro derrubou';
    return 'o silêncio na hora errada';
  };
  function acusacoes(p, ctx) {
    var d = desconfianca(p), r = gerador(p.semente + '|acusa'), o = [];
    p.elenco.forEach(function (c) {
      var alvo;
      if (c === p.I) alvo = p.F;
      else {
        var cs = p.elenco.filter(function (x) { return x !== c; }), tot = 0;
        cs.forEach(function (x) { tot += d[x] * d[x]; }); var v = r() * tot;
        for (var i = 0; i < cs.length; i++) { v -= d[cs[i]] * d[cs[i]]; if (v <= 0) { alvo = cs[i]; break; } }
        alvo = alvo || cs[0];
      }
      o.push({ quem: c, alvo: alvo, txt: 'Desconfiei {de:' + alvo + '}, por causa d' + MOTIVO_SUSP(p, alvo) + '.' });
    });
    o.forEach(function (x) { x.render = nomes(x.txt, ctx); });
    return o;
  }

  /* ── a matriz de falas (vestchip/falas.py) ── */
  function versoes(base, chave) {
    var b = base.trim(), nb = b.replace(/[.!?]+$/, ''), k = hash(chave);
    var explos = [nb + '!', 'Chega de rodeio: ' + min1s(nb) + '!', nb + '. E ninguém aqui vai fingir que não ouviu.'][k % 3];
    var curta = nb.split(';')[0].split(':')[0].trim();
    var calmo = curta !== nb ? curta + '.' : 'Só isto: ' + min1s(nb) + '.';
    var ing = [nb + '. Nem sei se ajuda.', 'Olha, ' + min1s(nb) + '. Achei que valia dizer.', nb + ', não é? Posso estar falando demais.'][k % 3];
    var leal = [nb + '. E digo isso sem apontar ninguém desta mesa.', nb + '. Confio em quem está aqui.', 'Antes que pensem mal de alguém: ' + min1s(nb) + '.'][k % 3];
    var evas = ['Se não me engano, ' + min1s(nb) + '. Mas por que a pergunta?', 'Depende de como se olha. ' + nb + '.', 'Talvez ' + min1s(nb) + '. Prefiro não afirmar.'][k % 3];
    var buro = ['Para constar: ' + min1s(nb) + '.', 'Conforme o registro, ' + min1s(nb) + '.', 'Fica anotado: ' + min1s(nb) + '.'][k % 3];
    var v = {}; [explos, calmo, ing, leal, evas, buro].forEach(function (x, i) { v[D.tipos[i]] = x; }); return v;
  }
  function min1s(t) { return t && /[A-ZÀ-Ú]/.test(t.charAt(0)) && !/[A-ZÀ-Ú]/.test(t.charAt(1)) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }
  function fmtF(t, p) { return t.replace(/\{lote\}/g, p.lote).replace(/\{peso\}/g, String(p.peso)).replace(/\{hora_fc\}/g, p.hora_fc).replace(/\{atraso\}/g, String(p.atraso)); }
  function linhaPapel(p, c, cap) {
    if (c === p.I) return { 4: 'Eu não saí do meu posto: ' + E[c].posto + '.', 5: 'O registro do meu posto mostra atividade o tempo todo.', 6: 'O registro está errado. Eu estava no meu posto.', 7: 'Ninguém me viu colocar peça nenhuma.', 8: 'Eu falo quando a ata estiver aberta.' }[cap] || null;
    if (c === p.F) { var l = { 1: 'Essa mídia é minha e não tem nada a ver com o apagão.', 3: 'Podem pesar. Não há ponte nenhuma nela.' }; if (p.REFORCO) l[6] = 'Agora apareceu um lacre com o meu código também? Alguém está montando isso em cima de mim.'; return l[cap] || null; }
    if (c === p.PRESSAO && cap === 6) return { investidora: 'Mandei, sim, a mensagem das 20h57. Pedir pressa é o meu trabalho; credencial eu não tenho.', advogada: 'Encaminhei o pedido do conselho às 20h57. Repassar prazo é o meu trabalho; credencial eu não tenho.', jornalista: 'Às 20h57 perguntei ' + nome('diretora', 'a') + ' se o teste sairia antes do fechamento. Pergunta não é ordem.' }[c];
    if (c === p.D && cap === 6) return 'Saí, sim: ' + E[c].aus[0] + '. Foram uns ' + E[c].aus[1] + ' segundos, não mais.';
    if (c === p.A && cap === 5) return 'Passei o acesso adiante às 20h03. Achei que era uma tarefa atrasada.';
    return null;
  }
  function falas(p) {
    var hum = {}; p.humanos.forEach(function (c) { hum[c] = 1; }); var out = [];
    for (var cap = 1; cap <= 8; cap++) {
      var usados = {};
      p.elenco.forEach(function (c, j) {
        var dom = E[c].dom, U = D.uteis[String(cap)];
        var cand = U.map(function (u, i) { var sc = 0, tags = u[0].split(' '); dom.forEach(function (x) { if (tags.indexOf(x) >= 0) sc++; }); return [-sc, hash(p.id + '|' + c + '|' + cap + '|' + i), i, u[1]]; });
        cand.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
        var uteis = [];
        cand.forEach(function (x) { if (uteis.length < 2 && !usados[x[2]]) { uteis.push(x[3]); usados[x[2]] = 1; } });
        cand.forEach(function (x) { if (uteis.length < 2 && uteis.indexOf(x[3]) < 0) uteis.push(x[3]); });
        uteis = uteis.map(function (t) { return fmtF(t, p); });
        var pap = linhaPapel(p, c, cap); if (pap) uteis = uteis.slice(0, 1);
        var conv = [D.conversa[c][(cap - 1) % 6], D.ambiente[String(cap)][(j + cap) % 4]];
        var itens = uteis.map(function (t) { return ['util', t]; }).concat(pap ? [['papel', pap]] : []).concat(conv.map(function (t) { return ['conversa', t]; })).concat([['neutra', D.neutra[String(cap)]]]);
        itens.forEach(function (it, k) {
          var v; if (it[0] === 'util') { v = {}; D.tipos.forEach(function (tp) { v[tp] = it[1]; }); } else v = versoes(it[1], p.id + '|' + c + '|' + cap + '|' + k);
          out.push({ id: p.id + '-c' + cap + '-' + c + '-' + k, cap: cap, quem: c, classe: it[0], versoes: v, opcao_do_jogador: !!hum[c] });
        });
      });
    }
    return out;
  }

  /* ── a batida de um capítulo, com os eventos ── */
  function capitulo(p, chave, ctx) {
    var R = D.roteiro[String(chave)] || [], EV = D.eventos[String(chave)] || [], out = [];
    R.forEach(function (b, i) {
      if (!b.req || reqOk(b.req, p)) {
        var ls = render(b.txt, p, ctx, b.sp);
        if (ls.length) out.push({ k: 'b', p: b.p, hh: b.hh || null, linhas: ls });
      }
      var prox = R[i + 1] ? R[i + 1].p : 1e9;
      EV.forEach(function (e) { if (e[0] >= b.p && e[0] < prox) out.push(Object.assign({ p: e[0] }, e[1])); });
    });
    return out;
  }

  var API = { D: D, gerador: gerador, misturar: misturar, hash: hash, montar: montar, render: render, semMarca: semMarca, nome: nome, nomes: nomes, macros: macros, usarFormas: usarFormas, fixarFormas: fixarFormas, formaDe: formaDe, nomeDe: nomeDe, artDe: artDe, generos: generos,
    perguntas: perguntas, registros: registros, exclusoes: exclusoes, revelacao: revelacao, acusacoes: acusacoes, desconfianca: desconfianca,
    falas: falas, linhaPapel: linhaPapel, capitulo: capitulo, hora: hora, ext: ext, janela: janela, cap1: cap1, TODOS: TODOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else g.VCPartida = API;
})(this);
