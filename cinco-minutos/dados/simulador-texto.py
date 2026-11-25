#!/usr/bin/env python3
# Mestre-motor da simulacao teorica do Loop (v4 revisao 3: 5 causas). Uso: python3 engine.py <comando> <grupo> [args]
# Dados: variavel de ambiente LOOP_DATA (padrao: pistas-v4.json ao lado deste arquivo, senao /tmp/roda/v4_pistas.json). Estados: LOOP_ESTADOS.
# Valores do conserto: os de valores_padrao, ou sorteados como o jogo faz quando LOOP_SEMENTE tem um numero
# (dia 9 a 25; raio em 1:00, 1:05, 1:10, 1:15 ou 1:20; registro 105 a 994; ordem dos 3 pontos; chave do para-raios; cofre = registro de tras para a frente).
# Revisao 3 (25/11/2026): energia 5 por volta para todo mundo; Revelar so na volta 5; a maquina so diz quantos valores estao certos; a Central nao devolve energia.
import json, sys, os, random
_AQUI = os.path.dirname(os.path.abspath(__file__))
DATA = os.environ.get('LOOP_DATA') or next((p for p in (os.path.join(_AQUI, 'pistas-v4.json'), '/tmp/roda/v4_pistas.json') if os.path.exists(p)), '/tmp/roda/v4_pistas.json')
D = json.load(open(DATA, encoding='utf-8'))
def sortear_valores(semente):
    """Mesmas faixas do jogo (lcVals em loop-central.js). O sorteio em si usa outro gerador: o que importa aqui e nao depender dos valores de exemplo."""
    r = random.Random(int(semente)); mm = lambda x: f'{x // 60}:{x % 60:02d}'
    dia = 9 + r.randrange(17); off = r.choice([-10, -5, 0, 5, 10]); R = 70 + off; reg = 105 + r.randrange(890)
    ordem = r.choice(['1-2-3', '1-3-2', '2-1-3', '2-3-1', '3-1-2', '3-2-1']); cp = r.choice([[1, 2, 3], [2, 3, 1], [3, 1, 2]])
    return dict(off=off, dia=dia, dia_a=dia - 4, dia_b=dia - 2, hora=mm(R), hora3=mm(R + 3), j0=mm(R - 6), j1=mm(R + 10), reg=reg, reg_inv=str(reg)[::-1],
                ordem=ordem, ordem_txt=ordem.replace('-', ', depois '), ch=cp[0], ch_b=cp[1], ch_c=cp[2])
SEMENTE = os.environ.get('LOOP_SEMENTE')
VAL = dict(D.get('valores_padrao', {}), off=0)
if 'reg_inv' not in VAL: VAL['reg_inv'] = str(VAL.get('reg', ''))[::-1]
if SEMENTE not in (None, ''): VAL = sortear_valores(SEMENTE)
def _tok(o):
    if isinstance(o, dict): return {k: _tok(v) for k, v in o.items()}
    if isinstance(o, list): return [_tok(v) for v in o]
    if isinstance(o, str):
        for k in sorted(VAL, key=len, reverse=True): o = o.replace('{' + k + '}', str(VAL[k]))
    return o
D0 = D; D = _tok(D)
OFF = VAL.get('off', 0)
D['valores'] = dict(D['valores'], dia_da_troca=VAL['dia'], hora_do_apagao=VAL['hora'], tombo=VAL['reg'], ordem_circuito=VAL['ordem'], chave_do_raio=VAL['ch'])
for _x in D['pistas']:   # o que acontece em volta do raio anda junto com a hora sorteada (como lcT no jogo)
    if 60 <= _x.get('segundo_min', 0) <= 100: _x['segundo_min'] += OFF
for _a in D['atividades_coop']:
    if _a.get('janela_segundos'): _a['janela_segundos'] = [64 + OFF, 80 + OFF]
ENERGIA = D['regras'].get('energia_por_volta', 5)   # igual para todo mundo, com ou sem dupla
P = {x['id']: x for x in D['pistas']}
AT = {a['id']: a for a in D['atividades_coop']}
GF = D['grupos_fonte']
SD = os.environ.get('LOOP_ESTADOS', '/tmp/roda/sim/estados_v3')
MEM = None            # validar.py troca por {} para rodar tudo em memoria
CAUSAS = D['causas_possiveis']
FMT = D.get('formato_valores', {})
F_REV = next(f for f in D['finais'] if f['id'] == 'final_revelar')['condicao']
PROVAS = F_REV['provas']['umaDeCadaGrupo']
JANELA = (64 + OFF, 80 + OFF)
ANEXAR_VOLTA_MIN = 2

def N(x): return int(str(x).upper().replace('J', ''))
def path(g): return f'{SD}/{g}.json'
def load(g):
    if MEM is not None: return MEM[g]
    return json.load(open(path(g)))
def save(g, s):
    if MEM is not None: MEM[g] = s; return
    os.makedirs(SD, exist_ok=True); json.dump(s, open(path(g), 'w'), ensure_ascii=False, indent=1)
def nome_sala(k): return D.get('salas_nomes', {}).get(k, k)
def mmss(t): return f'{t // 60}:{t % 60:02d}'
def uniao(s): return set().union(*[set(j['caderno']) for j in s['jog']])
def ativa(x, s): return ('soNaCausa' not in x) or (s['causa'] in x['soNaCausa'])
def custo(x): return x.get('custo', 0 if x['tipo'] == 'clima' else 1)
def tem_grupo(ids, g): return any(i in ids for i in GF.get(g, {}).get('fontes', []))
def pode_ver(x, j):
    if x.get('excl') and x['excl'] in j['caderno'] and j.get('modo') != 'solo': return False
    q = x.get('quemPodeVer', 'todos')
    if q.startswith('portador_grupo_'): return any(tem_grupo(j['caderno'], g) for g in q[15:].split('|'))
    if q.startswith('portador_'): return q[9:] in j['caderno']
    return True
def _de_chao(x): return isinstance(x.get('condicao'), dict) and bool(x['condicao'].get('chao'))
def chao_ok(x, s):
    c = x.get('condicao')
    c = c.get('chao') if isinstance(c, dict) else None
    if not c: return True
    o = s['chao'].get(c['sala'])
    return bool(o) and o['objeto'] == c['objeto'] and o['volta'] < s['volta']
def visivel(x, s, j):
    if not ativa(x, s) or (x.get('daAtividade') and not _de_chao(x)): return False
    if not (x['volta_min'] <= s['volta'] <= x['volta_max']): return False
    if x.get('segundo_min', 0) > j['seg']: return False
    return pode_ver(x, j) and chao_ok(x, s)
def liberada(x, s, j=None):
    u = set(j['caderno']) if j is not None else uniao(s); pd = x['precisaDe']
    return all(i in u for i in pd['todas']) and (not pd['umaDe'] or any(i in u for i in pd['umaDe']))
def texto(x, j, s=None):
    t = x['texto']
    if x.get('textoPorSintoma'):
        gs = [g for g in x['textoPorSintoma'] if tem_grupo(j['caderno'], g)]; pp = x.get('textoPorPar')
        par = bool(pp) and all(any(tem_grupo(j['caderno'], g) for g in lado) for lado in pp['grupos'])
        ult = next((P[i].get('grupoFonte') for i in reversed(j['caderno']) if P[i].get('grupoFonte') in gs), None)
        t = ' '.join(v for v in [t, pp['texto'] if par else x['textoPorSintoma'].get(ult)] if v)
    if s is not None and x.get('textoPorCausa', {}).get(s['causa']): t += ' ' + x['textoPorCausa'][s['causa']]
    return t
def etq(x): return f' [{x["etiqueta"]}]' if x.get('etiqueta') else ''
def fim(j): return j['seg'] >= 300
def agir(s): s['pausa'] = False
def onde_procurar(g, s):
    # uma sala para procurar: de preferencia fonte sem trava de tempo e sem "precisa de"
    fs = [P[i] for i in GF[g]['fontes'] if ativa(P[i], s) and not P[i].get('daAtividade')]
    fs.sort(key=lambda x: (x.get('segundo_min', 0) > 0, bool(x['precisaDe']['todas'] or x['precisaDe']['umaDe']), x['volta_min']))
    return f'{nome_sala(fs[0]["sala"])} [{fs[0]["sala"]}]' if fs else '?'
MSG_DIAG = 'o diagnóstico anexado (use anexar com 2 pistas que apontam a causa + 1 que descarta outra, ou faça Painel e Manual)'
def faltas(A, s, ids=None):
    """Entrada calculada da atividade: devolve a lista do que falta, em frase de jogador."""
    u = uniao(s) if ids is None else set(ids); e = A['entrada']; f = []
    for st in e.get('estado', []):
        if st == 'diagnostico_anexado' and not s.get('diag'): f.append(MSG_DIAG)
    for g in e.get('grupos', []):
        if not tem_grupo(u, g): f.append(f'{GF[g]["rotulo"]} (tente {onde_procurar(g, s)})')
    for i in e.get('pistas', []):
        if i not in u: f.append(f'"{P[i]["previa"]}" (tente {nome_sala(P[i]["sala"])} [{P[i]["sala"]}])')
    return f
def alvos_de(c):
    a = D['conserto_por_causa'].get(c) or []
    return a if isinstance(a, list) else [a]
def alvos(s): return alvos_de(s['causa'])
def vmin(A, s):
    # na noite de dois defeitos, o primeiro conserto pode ser gravado mais cedo
    return D['regras'].get('E_volta_min_meio', A['volta_min']) if len(alvos(s)) > 1 and A['id'] in alvos(s) else A['volta_min']
def falta_outro(A, s, solo=False):
    """Dois defeitos: True se os outros consertos ainda nao estao gravados em volta anterior."""
    al = alvos(s)
    return len(al) > 1 and A['id'] in al and not all((s['meio'].get(o, 99) <= s['volta']) if solo else (s['meio'].get(o, 99) < s['volta']) for o in al if o != A['id'])
def meio_repetido(A, s, solo=False): return falta_outro(A, s, solo) and A['id'] in s['meio']
MSG_MEIO = 'Esta metade já está gravada na Câmara. Falta o OUTRO defeito, e ele só entra em volta diferente da primeira gravação.'
def nao_desta_noite(s):
    if not s.get('diag'): return 'Ainda não acendeu. Falta ao grupo: ' + MSG_DIAG
    return 'Esta atividade não acende nesta noite: o defeito que o grupo anexou pede outro conserto.'

def cmd_novo(g, n, causa=None, modo=None):
    n = int(n); causa = causa or D['causa_sorteada']; modos = (modo or ','.join(['coop'] * n)).split(',')
    s = dict(causa=causa, volta=1, apostas={}, anexos={}, coop_feitas=[], log=[], diag=None, chao={}, eco={}, meio={}, central={}, central_usou={}, conserto=None, ensaio=[], revelado=None, pausa=False, dicas={}, jog=[
        dict(id=i + 1, modo=modos[i], cargas=ENERGIA, sala='recepcao', seg=0, caderno=[], olhar=[], mao=None, chao_usado=False, coops=0, trocou=0) for i in range(n)])
    save(g, s); print(f'Grupo {g}: {n} jogadores, volta 1. Salas abertas: {", ".join(D["salas"])}. Em reforma: {", ".join(D.get("salas_em_reforma", []))}. Todos começam na recepcao.')
def cmd_status(g):
    s = load(g); print(f'Volta {s["volta"]}/5 | apostas no telão: {s["apostas"]} | tentativas de anexar: {s["anexos"]} | diagnóstico anexado: {"sim" if s["diag"] else "não"} | pausa: {"sim" if s["pausa"] else "não"} | chão: { {k: v["objeto"] for k, v in s["chao"].items()} }')
    for j in s['jog']: print(f' J{j["id"]} [{j["modo"]}] sala={j["sala"]} energia={j["cargas"]} relógio={mmss(j["seg"])} ({j["seg"]}s) caderno({len(j["caderno"])})' + (f' na mão: {j["mao"]}' if j['mao'] else ''))
def cmd_ir(g, j, sala):
    s = load(g); jj = s['jog'][N(j) - 1]
    if fim(jj): print('A volta acabou para você. Use proxima.'); return
    if sala in D.get('salas_em_reforma', []): print(f'{nome_sala(sala)}: porta fechada, placa "em reforma". Não tem pista aí.'); return
    if sala not in D['salas']: print('Sala inexistente. Salas abertas:', ', '.join(D['salas'])); return
    agir(s); jj['sala'] = sala; jj['seg'] += 10; jj['olhar'] = []; save(g, s); print(f'J{N(j)} chegou em {nome_sala(sala)} [{sala}] (relógio {mmss(jj["seg"])}).')
def cmd_esperar(g, j, ate):
    s = load(g); jj = s['jog'][N(j) - 1]
    try: t = int(ate.split(':')[0]) * 60 + int(ate.split(':')[1]) if ':' in str(ate) else int(ate)
    except (ValueError, IndexError): print('Use: esperar <grupo> <jogador> <até quando>. Vale o minuto da volta (1:06) ou o segundo da volta (66). É sempre "até", nunca "mais tanto".'); return
    if t <= jj['seg']: print(f'Seu relógio já está em {mmss(jj["seg"])} ({jj["seg"]}s). O esperar é "até o minuto tal da volta" e só anda para a frente.'); return
    if t > 300: print('A volta acaba em 300 s (5:00).'); return
    agir(s); jj['seg'] = t; save(g, s); print(f'J{N(j)} esperou em {jj["sala"]}. Relógio: {mmss(t)} ({t}s). Não gastou energia.')
def cmd_olhar(g, j):
    s = load(g); jj = s['jog'][N(j) - 1]
    if fim(jj): print('A volta acabou para você.'); return
    agir(s)
    todos = [x for x in D['pistas'] if x['sala'] == jj['sala'] and ativa(x, s) and (not x.get('daAtividade') or _de_chao(x))]
    jj['olhar'] = [x['id'] for x in todos]; save(g, s)
    def repega(x): return x['tipo'] == 'objeto' and x.get('objeto') and jj['mao'] != x['objeto']
    vis = [(i, x) for i, x in enumerate(todos) if visivel(x, s, jj) and (x['id'] not in jj['caderno'] or repega(x))]
    futuras = [x for x in todos if x['volta_min'] <= s['volta'] <= x['volta_max'] and x.get('segundo_min', 0) > jj['seg'] and x['id'] not in jj['caderno']]
    quando = f'a primeira a partir de {mmss(min(x["segundo_min"] for x in futuras))}' if futuras else ''
    if not vis: print(f'Nada novo em {nome_sala(jj["sala"])} agora.' + (f' Tem {len(futuras)} coisa(s) que só aparecem mais tarde nesta volta ({quando}).' if futuras else '')); return
    u = uniao(s)
    print(f'Em {nome_sala(jj["sala"])} [{jj["sala"]}] (relógio {mmss(jj["seg"])}, energia={jj["cargas"]}). O número de cada pista é FIXO nesta sala:')
    for i, x in vis:
        tag = ''
        if not liberada(x, s, jj):
            pd = x['precisaDe']; falta = [k for k in pd['todas'] if k not in jj['caderno']] or pd['umaDe']
            tag = f' [TRAVADA: {x.get("porque") or "falta achar algo antes"} (em {nome_sala(P[falta[0]]["sala"])})]'
        gr = ' [o grupo já tem; na pausa dá para usar trocar]' if x['id'] in u else ''
        c = custo(x)
        if x['id'] in jj['caderno']: c = 0; gr = ' [já está no seu caderno: pegar o objeto de novo não gasta energia]'
        print(f'  [{i}] ({c} de energia) {x["previa"]}{tag}{gr}')
    if futuras: print(f'  (mais {len(futuras)} coisa(s) aparecem depois nesta sala; {quando})')
def cmd_coletar(g, j, idx, *resp):
    s = load(g); jj = s['jog'][N(j) - 1]
    if fim(jj): print('A volta acabou para você.'); return
    if not jj['olhar']:
        import io, contextlib
        with contextlib.redirect_stdout(io.StringIO()): cmd_olhar(g, j)
        s = load(g); jj = s['jog'][N(j) - 1]
    try: x = P[jj['olhar'][int(idx)]]
    except Exception: print('Use olhar nesta sala e escolha um número válido.'); return
    if x['sala'] != jj['sala']: print('Você mudou de sala. Use olhar de novo.'); return
    if x['id'] in jj['caderno']:
        if x['tipo'] == 'objeto' and x.get('objeto') and visivel(x, s, jj):
            agir(s); jj['mao'] = x['objeto']; jj['seg'] += 10; save(g, s); print(f'Você pega de novo: "{x["objeto"]}" está na sua mão (sem gastar energia). O que está na mão some no reinício; o que fica no chão, não.'); return
        print('Você já tem essa pista.'); return
    if not visivel(x, s, jj): print('Essa pista ainda não está disponível (o museu muda com o tempo e com o que você já sabe).'); return
    c = custo(x)
    en = x.get('enigma')
    if en:
        got = ''.join(ch for ch in ' '.join(resp).upper() if ch.isalnum())
        if got != str(en['resposta']).upper():
            print(f'ENIGMA: {en["rotulo"]}. {en["enunciado"]} {en["cifrado"]}. ' + ('Resposta errada, tente de novo (não gasta energia). ' if got else '') + f'Para tentar: coletar <g> <j> {idx} <resposta>'); return
    if jj['cargas'] < c: print(f'Falta energia: esta pista gasta {c} e você tem {jj["cargas"]}.'); return
    if not liberada(x, s, jj):
        pd = x['precisaDe']; falta = [k for k in pd['todas'] if k not in jj['caderno']] or pd['umaDe']
        print(f'Travada: {x.get("porque") or "falta achar algo antes"} Falta no SEU caderno uma pista de {nome_sala(P[falta[0]]["sala"])} ("{P[falta[0]]["previa"]}"). Outra pessoa pode passar na pausa.'); return
    agir(s); jj['cargas'] -= c; jj['seg'] += 10; jj['caderno'].append(x['id'])
    if x['tipo'] == 'objeto' and x.get('objeto'): jj['mao'] = x['objeto']
    s['log'].append((s['volta'], jj['id'], x['id']))
    arm = x.get('armadilha')
    if arm:
        for o in s['jog']: o['seg'] = min(300, o['seg'] + arm['seg'])
    save(g, s)
    print(f'PISTA [{x["id"]}]{etq(x)} (-{c} de energia): {texto(x, jj, s)}')
    if arm: print(f'ALARME! O relógio de TODO mundo deu um salto de {arm["seg"]} s nesta volta.')
def cmd_deixar(g, j):
    s = load(g); jj = s['jog'][N(j) - 1]
    if fim(jj): print('A volta acabou para você.'); return
    if not jj['mao']: print('Você não tem nenhum objeto na mão nesta volta. (O que está na mão some no reinício; a luva isolante sai do armário da Oficina técnica depois que a luz cai.)'); return
    if jj['chao_usado']: print('Você já usou o seu único objeto de chão nesta partida.'); return
    agir(s); obj = jj['mao']; s['chao'][jj['sala']] = dict(objeto=obj, volta=s['volta'], por=jj['id']); jj['chao_usado'] = True; jj['mao'] = None; jj['seg'] += 5; save(g, s)
    print(f'J{N(j)} deixou "{obj}" no chão de {nome_sala(jj["sala"])}. O chão guarda: na próxima volta qualquer pessoa do grupo acha aqui.')
def cmd_trocar(g, de, para, pid):
    s = load(g); a = s['jog'][N(de) - 1]; b = s['jog'][N(para) - 1]
    if not s['pausa']: print('Trocar só na pausa entre voltas (logo depois de proxima, antes de alguém se mexer).'); return
    if pid not in a['caderno']: print(f'J{N(de)} não tem essa pista.'); return
    if pid in b['caderno']: print('Quem recebe já tem.'); return
    if b.get('trocou',0) >= 3: print(f'J{N(para)} já recebeu 3 pistas nesta pausa. O limite é 3 por pessoa por pausa.'); return
    b['trocou'] = b.get('trocou',0) + 1; b['caderno'].append(pid); save(g, s); print(f'J{N(para)} recebeu {pid}{etq(P[pid])} (troca grátis). Texto: {texto(P[pid], b, s)}')
def _norm(k, v):
    """Aceita as formas mais comuns de escrever cada valor e devolve um conjunto de leituras possiveis."""
    v = str(v).strip().lower(); t = FMT.get(k, {}).get('tipo', 'texto'); dig = ''.join(ch for ch in v if ch.isdigit())
    if t == 'hora':
        for sep in ('h', 'm', '.', ',', ';', '-'): v = v.replace(sep, ':')
        v = v.rstrip('s:').strip()
        try:
            if ':' in v: a, b = v.split(':')[:2]; return {int(a) * 60 + int(b or 0)}
            if dig: return {int(dig)} | ({int(dig[:-2]) * 60 + int(dig[-2:])} if len(dig) >= 3 else set())
        except ValueError: pass
        return set()
    if t == 'numero': return {int(dig)} if dig else set()
    if t == 'sequencia': return {'-'.join(dig)} if dig else set()
    return {v}
def _valores(A, vals):
    ks = A['valores_pedidos']; erradas = []
    for n, k in enumerate(ks):
        esp = _norm(k, D['valores'][k]); dado = _norm(k, vals[n]) if n < len(vals) else set()
        if not (esp & dado): erradas.append(k)
    return len(ks) - len(erradas), len(ks), erradas
def _msg_erro(A, s, certos, tot, erradas, custo_txt, devolveu):
    o = f'A MÁQUINA NÃO REAGE: {certos} de {tot} valor(es) aceito(s). '
    o += 'Formato: ' + '; '.join(f'{FMT.get(k, {}).get("rotulo", k)} = {FMT.get(k, {}).get("como", "?")} (do jeito {FMT.get(k, {}).get("exemplo", "?")})' for k in A['valores_pedidos']) + '. '
    o += f'({custo_txt}' + ('; ensaio sem punição)' if s['volta'] == 4 else ')')
    return o
def _devolve(s):
    return False   # revisão 3: como no jogo, nenhuma tentativa errada devolve energia
def _janela(js):
    tarde = [q for q in js if q['seg'] > JANELA[1]]; cedo = [q for q in js if q['seg'] < JANELA[0]]
    if tarde: return f'O raio desta volta já passou (J{tarde[0]["id"]} está em {mmss(tarde[0]["seg"])}; a janela vai de {mmss(JANELA[0])} a {mmss(JANELA[1])}). Só na próxima volta.'
    if cedo: return f'Cedo demais: J{cedo[0]["id"]} está em {mmss(cedo[0]["seg"])} e o raio ainda não caiu. Use esperar até {JANELA[0]} (a janela vai de {mmss(JANELA[0])} a {mmss(JANELA[1])}).'
    return None
def _entrega(pid, js):
    for q in js:
        if pid not in q['caderno']: q['caderno'].append(pid)
    print(f'  → [{pid}]: {P[pid]["texto"]}')
def _conserto(g, s, A, js, modo):
    """Volta 4 = ensaio (a maquina reage ou nao). Volta 5 = vale."""
    if falta_outro(A, s, str(modo).startswith('sem dupla')):
        s['meio'][A['id']] = s['volta']; s['coop_feitas'].append((s['volta'], A['id'], 'meio')); save(g, s)
        print(f'MEIO CONSERTO ({modo}) gravado na Câmara na volta {s["volta"]}. O AVISO MUDOU DE LUGAR. Mudou, não sumiu: falta o outro defeito, em OUTRA volta.'); _entrega(A['produto_meio'], js); save(g, s); return
    if s['volta'] <= 4:
        s['ensaio'].append((A['id'], modo)); print(f'ENSAIO ({modo}): A MÁQUINA REAGE. Não valeu ainda: repita na volta 5.'); _entrega(A['produto_ensaio'], js)
    else:
        s['conserto'] = s['volta']; print(f'CONSERTO FEITO ({modo}) na volta {s["volta"]}. O botão "Loop Reset" agora responde.'); _entrega(A['produto_final'], js)
    s['coop_feitas'].append((s['volta'], A['id'], modo)); save(g, s)
def cmd_coop(g, aid, ja, jb, *vals):
    s = load(g); A = AT.get(aid)
    if not A: print('Atividade inexistente. Use o comando atividades para ver as que já acenderam.'); return
    if not ativa(A, s): print(nao_desta_noite(s)); return
    if N(ja) == N(jb): print('Atividade em dupla pede duas pessoas diferentes.'); return
    A_, B_ = s['jog'][N(ja) - 1], s['jog'][N(jb) - 1]
    if A_['sala'] == A['salas'][1] and B_['sala'] == A['salas'][0] and A['salas'][0] != A['salas'][1]: A_, B_ = B_, A_; ja, jb = jb, ja   # a ordem dos nomes nao importa
    if 'solo' in (A_['modo'], B_['modo']): print('Quem declarou jogo sem dupla não entra em dupla. O caminho sem dupla desta atividade: ' + A.get('saida_solo', '')); return
    if A.get('acao_de_chao'): print('O Correio do Loop não pede duas pessoas ao mesmo tempo: quem pegou o objeto usa "deixar" na sala certa; na volta seguinte qualquer pessoa pega no chão.'); return
    if s['volta'] < vmin(A, s): print(f'Só a partir da volta {vmin(A, s)}.'); return
    f = faltas(A, s)
    if f: print('O "Chamar dupla" ainda não acendeu. Falta ao grupo: ' + ' | '.join(f)); return
    if meio_repetido(A, s): print(MSG_MEIO); return
    if fim(A_) or fim(B_): print('A volta acabou para alguém da dupla.'); return
    if A_['sala'] != A['salas'][0] or B_['sala'] != A['salas'][1]: print(f'Posição errada: J{N(ja)} deve estar em {A["salas"][0]} e J{N(jb)} em {A["salas"][1]}.'); return
    if A_['coops'] >= 2 or B_['coops'] >= 2: print('Limite: 2 atividades em dupla por pessoa por volta.'); return
    cp = A.get('custo_por_pessoa', 1)
    if A_['cargas'] < cp or B_['cargas'] < cp: print(f'Falta energia: cada pessoa precisa de {cp}.'); return
    if A.get('janela_segundos'):
        m = _janela([A_, B_])
        if m: print(m); return
    bl = A.get('bloqueada_segundos')
    if bl and any(bl[0] <= q['seg'] <= bl[1] for q in (A_, B_)): print(f'A chave geral fica travada de {mmss(bl[0])} a {mmss(bl[1])} (é a hora do raio). Use esperar até {bl[1] + 1}.'); return
    agir(s); t0 = max(A_['seg'], B_['seg'])
    for q in (A_, B_): q['cargas'] -= cp; q['seg'] = t0 + A['duracao_s']; q['coops'] += 1
    if A.get('valores_pedidos'):
        certos, tot, erradas = _valores(A, vals)
        if certos != tot:
            dev = _devolve(s)
            if dev:
                for q in (A_, B_): q['cargas'] += cp
            s['coop_feitas'].append((s['volta'], aid, 'erro')); save(g, s)
            print(_msg_erro(A, s, certos, tot, erradas, f'-{cp} de energia por pessoa', dev)); return
    if A.get('conserto'): _conserto(g, s, A, (A_, B_), 'em dupla'); return
    print(f'ATIVIDADE FEITA: {A["nome"]} (-{cp} de energia por pessoa, {A["duracao_s"]} s). Os dois recebem:')
    for pid in A['produz']:
        if pid in P and ativa(P[pid], s): _entrega(pid, (A_, B_))
    if A.get('anexa_diagnostico') and not s['diag']:
        s['diag'] = dict(volta=s['volta'], via=aid); s['apostas'].setdefault(str(s['volta']), s['causa']); print('  A leitura completa entra no dossiê: DIAGNÓSTICO ANEXADO.')
    s['coop_feitas'].append((s['volta'], aid, 'em dupla')); save(g, s)
def cmd_solo(g, j, aid, *vals):
    s = load(g); A = AT.get(aid)
    if not A: print('Atividade inexistente.'); return
    q = s['jog'][N(j) - 1]; S = A.get('solo')
    if not ativa(A, s): print(nao_desta_noite(s)); return
    if not S: print('Esta atividade não tem comando próprio sem dupla. O caminho sem dupla dela é por pistas: ' + A.get('saida_solo', '')); return
    if fim(q): print('A volta acabou para você.'); return
    f = faltas(A, s)
    if f: print('Ainda não dá. Falta ao grupo: ' + ' | '.join(f)); return
    if S['tipo'] == 'chao':
        if s['volta'] < vmin(A, s): print(f'Só a partir da volta {vmin(A, s)}.'); return
        o = s['chao'].get(S['sala'])
        if not (o and o['objeto'] == S['objeto'] and o['volta'] < s['volta']):
            print(f'Sem dupla, a peça precisa já estar no chão de {nome_sala(S["sala"])} desde uma volta ANTERIOR: pegue em {nome_sala(P[S["pista_objeto"]]["sala"])} [{P[S["pista_objeto"]]["sala"]}], desça e use deixar. Na volta seguinte, repita este comando.'); return
        if q['sala'] != S['sala']: print(f'Você precisa estar em {S["sala"]}.'); return
        if q['cargas'] < S['custo']: print(f'Sem dupla, gasta {S["custo"]} de energia.'); return
        agir(s); q['cargas'] -= S['custo']; q['seg'] += S['duracao_s']
        certos, tot, erradas = _valores(A, vals)
        if certos != tot:
            dev = _devolve(s); q['cargas'] += S['custo'] if dev else 0
            s['coop_feitas'].append((s['volta'], aid, 'erro')); save(g, s); print(_msg_erro(A, s, certos, tot, erradas, f'-{S["custo"]} de energia', dev)); return
        _conserto(g, s, A, (q,), 'sem dupla'); return
    if S['tipo'] == 'eco':
        if q['sala'] == S['sala_gravar']:
            if s['volta'] < S['volta_min_gravar']: print(f'O eco só grava a partir da volta {S["volta_min_gravar"]}.'); return
            if s['eco'].get(aid): print(f'O eco já está gravado. Agora é a sua parte em {nome_sala(S["sala_executar"])}.'); return
            if q['cargas'] < S['custo_gravar']: print(f'Gravar o eco gasta {S["custo_gravar"]} de energia.'); return
            m = _janela([q])
            if m: print(m); return
            agir(s); q['cargas'] -= S['custo_gravar']; q['seg'] += 20; s['eco'][aid] = s['volta']
            print(f'ECO GRAVADO (-{S["custo_gravar"]} de energia).'); _entrega(S['produto_eco'], (q,)); save(g, s); return
        if q['sala'] == S['sala_executar']:
            if s['volta'] < vmin(A, s): print(f'Só a partir da volta {vmin(A, s)}.'); return
            if meio_repetido(A, s, True): print(MSG_MEIO); return
            if not s['eco'].get(aid) or s['eco'][aid] >= s['volta']: print(f'Sem dupla, falta o eco: numa volta anterior, grave a sua parte em {nome_sala(S["sala_gravar"])} [{S["sala_gravar"]}] com este mesmo comando, dentro da janela do raio.'); return
            if q['cargas'] < S['custo_executar']: print(f'A parte sem dupla gasta {S["custo_executar"]} de energia.'); return
            m = _janela([q])
            if m: print(m); return
            agir(s); q['cargas'] -= S['custo_executar']; q['seg'] += A['duracao_s']; _conserto(g, s, A, (q,), 'sem dupla'); return
        print(f'Caminho sem dupla: grave o eco em {nome_sala(S["sala_gravar"])} [{S["sala_gravar"]}] e, em outra volta, aja em {nome_sala(S["sala_executar"])} [{S["sala_executar"]}].'); return
    if S['tipo'] == 'individual':
        if s['volta'] < vmin(A, s): print(f'Só a partir da volta {vmin(A, s)}.'); return
        if meio_repetido(A, s, True): print(MSG_MEIO); return
        fp = [GF[x]['rotulo'] for x in S['no_proprio_caderno'] if not tem_grupo(q['caderno'], x)]
        if fp: print('Sem dupla, tudo precisa estar no SEU caderno. Falta nele: ' + ' | '.join(fp) + '. (Colete você ou peça por trocar na pausa.)'); return
        if q['sala'] != S['sala']: print(f'Você precisa estar em {S["sala"]}.'); return
        if q['cargas'] < S['custo']: print(f'Sem dupla, gasta {S["custo"]} de energia.'); return
        agir(s); q['cargas'] -= S['custo']; q['seg'] += S['duracao_s']
        certos, tot, erradas = _valores(A, vals)
        if certos != tot:
            dev = _devolve(s); q['cargas'] += S['custo'] if dev else 0
            s['coop_feitas'].append((s['volta'], aid, 'erro')); save(g, s); print(_msg_erro(A, s, certos, tot, erradas, f'-{S["custo"]} de energia', dev)); return
        _conserto(g, s, A, (q,), 'sem dupla')
def _valida_anexo(causa, ids):
    """Devolve (ok, motivo, linhas): quantos sinais e descartes contaram e como o dossie leu cada pista."""
    lados = D.get('diagnostico_por_causa', {}).get(causa, {}).get('lados')
    sinais = {}; desc = []; linhas = []; completo = False
    for i in ids:
        x = P[i]; g = x.get('grupoFonte'); ap = causa in x['revela']['aponta']; rot = f'"{x["previa"]}"'
        de = [c for c in x['revela']['descarta'] if c in CAUSAS and c != causa]
        if x.get('diagnosticoCompleto') and ap: completo = True; linhas.append(f'{rot}: leitura completa do painel. Vale sozinha.')
        elif x['tipo'] == 'falsa_honesta': linhas.append(f'{rot}: coisa estranha com explicação inocente. NÃO CONTA.')
        elif ap and g and g in sinais: linhas.append(f'{rot}: sinal REPETIDO (mesmo tipo: {GF[g]["rotulo"]}). Conta uma vez só.')
        elif ap and g: sinais[g] = i; linhas.append(f'{rot}: CONTOU como sinal (tipo: {GF[g]["rotulo"]}).')
        elif de: desc.append(i); linhas.append(f'{rot}: CONTOU como descarte (mostra outro leitura normal).')
        elif (g or '').startswith('sint_'): linhas.append(f'{rot}: é sinal da máquina, mas não combina com a causa que você escolheu. NÃO CONTOU.')
        elif (g or '').startswith('desc_'): linhas.append(f'{rot}: mostra algo leitura normal, mas não serve de descarte para esse defeito. NÃO CONTOU.')
        else: linhas.append(f'{rot}: não é sinal da máquina nem descarte (é história, manual ou ferramenta). NÃO CONTOU.')
    if completo: return True, '', linhas
    ns = min(len(sinais), 2); nd = min(len(desc), 1)
    if lados:
        tem = [any(g in sinais for g in lado) for lado in lados]; ns = sum(tem)
        placar = f'Contaram {ns} de 2 sinais (para dois defeitos: 1 sinal de número + 1 sinal de força) e {nd} de 1 descarte.'
    else: placar = f'Contaram {ns} de 2 sinais e {nd} de 1 descarte.'
    if ns < 2: return False, placar + ' Faltam sinais de tipos diferentes que apontem essa causa.', linhas
    if not nd: return False, placar + ' Falta 1 pista que descarte outra causa: prova de que outra parte está bem (ex.: números parados, fusíveis no lugar, carga cheia, modo livre).', linhas
    return True, placar, linhas
def cmd_anexar(g, causa, *ids):
    s = load(g)
    if causa not in CAUSAS: print('Causa inválida. Use: ' + ', '.join(CAUSAS)); return
    if s['diag']: print('O dossiê do grupo já tem um diagnóstico anexado.'); return
    if s['volta'] < ANEXAR_VOLTA_MIN: print(f'O dossiê só ganha a página de diagnóstico na volta {ANEXAR_VOLTA_MIN}. Por enquanto, só olhar e anotar.'); return
    if str(s['volta']) in s['anexos']: print('Uma tentativa de anexar por volta: o grupo já tentou nesta volta. Tente de novo na próxima.'); return
    u = uniao(s); fora = [i for i in ids if i not in u]; ids = list(dict.fromkeys(i for i in ids if i in u))
    if fora: print('Estas pistas não estão no dossiê do grupo: ' + ', '.join(fora)); return
    if len(ids) != 3: print('Para anexar, cite exatamente 3 pistas do dossiê do grupo: 2 que apontam a causa (de tipos diferentes) + 1 que descarta outra causa. (Não gastou a tentativa da volta.)'); return
    # pré-conferência pela etiqueta escrita nas pistas (como a tela do jogo faz): forma errada nao gasta a tentativa
    et = [(P[i].get('etiqueta') or '').upper() for i in ids]; sin = [e for e in et if e.startswith('SINAL')]; sis = [e for e in et if e.startswith('LEITURA')]
    if not any(P[i].get('diagnosticoCompleto') for i in ids) and not (len(sin) == 2 and len(set(sin)) == 2 and len(sis) == 1):
        print(f'PRÉ-CONFERÊNCIA (não gastou a tentativa): você marcou {len(sin)} sinal(is) com {len(set(sin))} tipo(s) e {len(sis)} de leitura normal. A forma certa é 2 sinais de etiquetas DIFERENTES + 1 de leitura normal. Pista sem etiqueta de sinal ou de leitura normal não conta.'); return
    ok, motivo, linhas = _valida_anexo(causa, ids)
    det = '\n' + '\n'.join('   • ' + l for l in linhas)
    if not ok: s['anexos'][str(s['volta'])] = causa; save(g, s); print('O dossiê não aceita. ' + motivo + det + '\nA tentativa desta volta foi gasta; dá para tentar de novo na próxima.'); return
    s['anexos'][str(s['volta'])] = causa; s['apostas'].setdefault(str(s['volta']), causa)
    if causa == s['causa']:
        s['diag'] = dict(volta=s['volta'], via='anexar', ids=ids); save(g, s)
        print('DIAGNÓSTICO ANEXADO. ' + motivo + ' O dossiê do grupo aceita a causa. O conserto pode acender (veja atividades).' + det)
        if len(alvos(s)) > 1: print('ATENÇÃO: são dois defeitos. Um conserto por volta: o primeiro fica gravado na Câmara, o segundo vale na volta 5.')
        elif any(AT[a].get('solo', {}).get('tipo') in ('eco', 'chao') for a in alvos(s)): print('AVISO para quem joga sem dupla: este conserto pede DUAS voltas (uma para preparar, outra para agir). Não deixe para a volta 5.')
    elif causa in D.get('composicao_E', {}).get('defeitos', []) and len(alvos(s)) > 1:
        save(g, s); print(motivo + ' MEIO CERTO: a máquina dá um tranco e o aviso muda de lugar. Mudou, não sumiu: tem OUTRO defeito junto, então a resposta é a opção dois defeitos (E_dois). A tentativa desta volta foi gasta.' + det)
    else: save(g, s); print(motivo + ' As provas até combinam, mas A MÁQUINA NÃO REAGE: o defeito escolhido não é esse. Releia os sinais do caderno antes da próxima tentativa. (A tentativa desta volta foi gasta.)' + det)
def cmd_apostar(g, causa):
    if causa not in CAUSAS: print('Causa inválida. Use: ' + ', '.join(CAUSAS)); return
    s = load(g)
    if str(s['volta']) in s['apostas']: print('Aposta única por volta: o palpite do grupo para o telão já foi dado nesta volta.'); return
    s['apostas'][str(s['volta'])] = causa; save(g, s); print(f'Aposta da volta {s["volta"]} registrada no telão: {causa}. (Apostar não liga a máquina: para isso, use anexar com as provas.)')
def cmd_atividades(g):
    s = load(g); print('Atividades em dupla (sala e papel só aparecem nas que já acenderam):')
    for A in D['atividades_coop']:
        if not ativa(A, s): print(f' - (apagada) {A["nome"]}'); continue
        if faltas(A, s): print(f' - (apagada) {A["nome"]}. Falta: ' + ' · '.join(faltas(A, s))); continue
        if s['volta'] < vmin(A, s): print(f' - (apagada) {A["nome"]}: só a partir da volta {vmin(A, s)}'); continue
        print(f' - ACESA [{A["id"]}] {A["nome"]}: {A["salas"][0]} + {A["salas"][1]}. A: {A["papelA"]} B: {A["papelB"]} | Central: {A.get("papelCentral", "")} | Sem dupla: {A.get("saida_solo", "")}' + (f' | Valores: {A["formato"]}' if A.get('formato') else ''))
def cmd_dica(g):
    s = load(g)
    if s['volta'] < 3: print('O Mestre só dá dica a partir da volta 3.'); return
    if s['dicas'].get(str(s['volta'])): print('Você já usou a dica desta volta.'); return
    s['dicas'][str(s['volta'])] = 1; save(g, s)
    if not s['diag']:
        u = uniao(s); et = sorted(set(P[i]['etiqueta'] for i in u if P[i].get('etiqueta')))
        print('DICA DO MESTRE: ainda não tem diagnóstico anexado. Juntem 2 pistas com etiqueta "SINAL DA MÁQUINA" de tipos diferentes e 1 com etiqueta "LEITURA NORMAL". Depois, anexar. O dossiê do grupo já tem: ' + (', '.join(et) or 'nenhuma etiqueta')); return
    for A in [AT[a] for a in alvos(s)]:
        if A['id'] in s['meio']: continue
        f = faltas(A, s)
        if f: print(f'DICA DO MESTRE: para o conserto ({A["nome"]}), falta: ' + f[0]); return
    if not s['conserto']:
        A = AT[alvos(s)[0]]
        if len(alvos(s)) > 1: print('DICA DO MESTRE: são dois consertos (' + ' e '.join(AT[a]['nome'] for a in alvos(s)) + '). Um por volta: o primeiro fica gravado, o segundo vale na volta 5. Gravados até agora: ' + (', '.join(AT[a]['nome'] for a in s['meio']) or 'nenhum')); return
        print(f'DICA DO MESTRE: o conserto está liberado ({A["nome"]}). Ensaio na volta 4, para valer na volta 5.'); return
    print('DICA DO MESTRE: máquina consertada. Falta levar as 3 provas à Recepção e Revelar.')

MISSOES = [
 ('Descubra o que o Braga está escondendo.', lambda c: 'cracha_3' in c or 'v4_braga' in c or tem_grupo(c,'alibi_braga')),
 ('Descubra o que derrubou o Téo.', lambda c: any(i in c for i in ('empurra_1','empurra_2','lenz_3'))),
 ('Descubra quem ganha dinheiro se a peça sumir.', lambda c: tem_grupo(c,'motivo_lenz')),
 ('Descubra por que a Ivone não pode ter trocado a peça.', lambda c: tem_grupo(c,'alibi_ivone') or 'ivone_2' in c),
 ('Descubra o que o Aurélio sabia e não disse.', lambda c: 'aurelio_1' in c or 'aurelio_2' in c)]
def cmd_missao(g, j):
    s = load(g); q = s['jog'][N(j) - 1]; m = MISSOES[(N(j) + sum(map(ord, g))) % 5]
    ok = m[1](q['caderno'])
    if ok and not q.get('missao_ok'): q['missao_ok'] = s['volta']; save(g, s)
    print('SUA MISSÃO SECRETA (só você sabe; na pausa conte ou blefe): ' + m[0] + (f' ✅ Cumprida na volta {q["missao_ok"]}: +1 de energia na volta seguinte.' if q.get('missao_ok') else ' Cumprir rende +1 de energia na volta seguinte.'))
def cmd_proxima(g):
    s = load(g)
    if s['volta'] >= 5: print('Já é a última volta. Use final.'); return
    s['volta'] += 1; s['pausa'] = True
    for j in s['jog']:
        m = MISSOES[(j['id'] + sum(map(ord, g))) % 5]
        if m[1](j['caderno']) and not j.get('missao_ok'): j['missao_ok'] = s['volta'] - 1
        extra = 1 if (j.get('missao_ok') == s['volta'] - 1) else 0
        j.update(cargas=ENERGIA + extra, seg=0, sala='recepcao', olhar=[], mao=None, coops=0, trocou=0)
    save(g, s); print(f'Volta {s["volta"]}. O museu esqueceu; os cadernos lembram; o chão guarda. Energia renovada, todos na recepcao. PAUSA: agora dá para trocar (até 3 pistas por pessoa). A pausa acaba quando alguém se mexer.')
def provas_de(ids): return [k for k in PROVAS if tem_grupo(ids, k)]
def nome_certo(n): return bool(n) and n.lower().startswith(D['culpado'].split()[0].lower())
def cmd_revelar(g, j, culpado=''):
    s = load(g); q = s['jog'][N(j) - 1]
    if s['revelado'] is not None: print('O grupo já usou a sua única tentativa de Revelar.'); return
    if s['volta'] != 5: print('O telão da Recepção só aceita o Revelar na última volta.'); return
    if fim(q): print('Passou de 5:00. O museu reiniciou antes.'); return
    if q['sala'] != F_REV['onde']: print(f'Para Revelar, quem apresenta precisa estar na {F_REV["onde"]}.'); return
    pv = provas_de(q['caderno'])
    if len(pv) < len(PROVAS): print('Quem apresenta precisa ter as 3 provas no PRÓPRIO caderno. Falta nele: ' + ' | '.join(GF[k]['rotulo'] + ' (procure em: ' + ', '.join(nome_sala(x) for x in GF[k].get('salas', [])[:4]) + ')' for k in PROVAS if k not in pv) + '. (Outra pessoa do grupo pode apresentar.)'); return
    if not culpado: print('Diga o nome: revelar <grupo> <jogador> <nome>.'); return
    agir(s); certo = nome_certo(culpado); s['revelado'] = dict(ok=certo, por=q['id'], nome=culpado, seg=q['seg']); q['seg'] += 20; save(g, s)
    print('REVELAR: as 3 provas vão para o telão da Recepção. ' + ('O nome fecha com as provas. Todo mundo viu.' if certo else 'Mas o nome dito não fecha com as provas. O telão apaga.'))
def cmd_final(g, culpado='', j=None):
    s = load(g)
    if s.get('final'): print('O final já foi decidido:', s['final']); return
    if s['volta'] != 5: print('O final só existe na volta 5. Antes disso: investigar, anexar e ensaiar.'); return
    if s['revelado'] is None and not culpado and not s.get('aviso_final'):
        s['aviso_final'] = True; save(g, s); print('ATENÇÃO: o Revelar ainda não foi feito (na Recepção, quem tem as 3 provas no próprio caderno). O final não se refaz. Se quiser fechar assim mesmo, repita o comando final.'); return
    if culpado and j and s['revelado'] is None: cmd_revelar(g, j, culpado); s = load(g)
    certa = bool(s['diag']); des = certa and s['conserto'] == 5; rev = bool(s['revelado'] and s['revelado']['ok'])
    nome = rev or nome_certo(culpado); pv = provas_de(uniao(s))
    if des and rev: r = 'Ouro'
    elif des: r = 'Desligar'
    elif rev: r = 'Revelar'
    elif certa or (nome and len(pv) >= 2): r = 'Parcial'
    else: r = 'Minimo'
    fd = next((f for f in D['finais'] if f['id'] == 'final_' + r.lower()), {}); txt = fd.get('texto_por_causa', {}).get(s['causa']) or fd.get('texto', '')
    print(f'FINAL: {r}. {txt} (diagnóstico anexado={certa}, conserto na volta 5={des}, revelar={rev}, provas no grupo={pv}, nome certo={nome})')
    s['final'] = r; save(g, s)
def cmd_caderno(g, j):
    s = load(g); jj = s['jog'][N(j) - 1]
    for i in jj['caderno']: print(f'- [{i}]{etq(P[i])} {texto(P[i], jj, s)}')
def cmd_central(g, j, *vals):
    """Papel Central (so no simulador de texto): le em voz alta onde cada pessoa esta e o que falta. Nao gasta nem devolve energia."""
    s = load(g); q = s['jog'][N(j) - 1]
    if s['volta'] < 4: print('O papel de Central acende na volta 4 (ensaio) e na volta 5 (vale). Antes disso, as câmeras só dão pistas comuns.'); return
    if fim(q): print('A volta acabou para você.'); return
    if q['sala'] != 'seguranca': print('A Central fica na Central de monitoramento [seguranca], na frente das câmeras.'); return
    agir(s); q['seg'] += 10; s['central'][str(s['volta'])] = q['id']
    print(f'CENTRAL (J{q["id"]}, relógio {mmss(q["seg"])}). Leia em voz alta para o grupo:')
    for o in s['jog']:
        if o['id'] != q['id']: print(f'  câmera: J{o["id"]} está em {nome_sala(o["sala"])}, relógio {mmss(o["seg"])}, energia {o["cargas"]}.')
    if not s['diag']: print('  dossiê: ainda SEM diagnóstico anexado. Sem ele nenhum conserto acende.')
    for A in [AT[a] for a in alvos(s)] if s['diag'] else []:
        f = faltas(A, s); on = {sl: [f'J{o["id"]}' for o in s['jog'] if o['sala'] == sl] for sl in A['salas']}
        print(f'  conserto "{A["nome"]}": ' + ('JÁ GRAVADO na Câmara. ' if A['id'] in s['meio'] else '') + ('entrada completa. ' if not f else 'FALTA ' + ' | '.join(f) + '. ') +
              ' '.join(f'{nome_sala(sl)}: {", ".join(on[sl]) or "ninguém"}.' for sl in A['salas']))
        for gk in A['entrada'].get('grupos', []): print(f'     {GF[gk]["rotulo"]}: no caderno de ' + (', '.join(f'J{o["id"]}' for o in s['jog'] if tem_grupo(o['caderno'], gk)) or 'ninguém'))
        if A.get('janela_segundos'): print(f'     janela do raio: de {mmss(JANELA[0])} a {mmss(JANELA[1])}. Diga "chave fechada" e "alavanca pronta" antes do raio.')
        if A.get('valores_pedidos') and vals:
            c, t, er = _valores(A, vals); print(f'     conferência dos valores ditos: {c} de {t} batem com o dossiê' + ('.' if c == t else '. Não confere: ' + ', '.join(FMT.get(k, {}).get('rotulo', k) for k in er) + '.'))
    pr = [f'J{o["id"]}' for o in s['jog'] if len(provas_de(o['caderno'])) == len(PROVAS)]
    print('  Revelar: ' + ('com as 3 provas no próprio caderno: ' + ', '.join(pr) if pr else 'NINGUÉM tem as 3 provas no próprio caderno ainda (' + ', '.join(f'J{o["id"]} tem {len(provas_de(o["caderno"]))}' for o in s['jog']) + ').'))
    print('  Central lida em voz alta. (Não muda a energia de ninguém.)'); save(g, s)
def cmd_ajuda(*a): print('OBJETIVO: descobrir por que a máquina do tempo travou, consertar até a volta 5 e provar quem trocou a peça. Volta 1: explorar e coletar; a partir da volta 2 dá para anexar o diagnóstico. GLOSSÁRIO: registro = número que identifica a peça; ponto de ligação = onde o fio se encaixa; roleta = a da entrada, que gira quando você passa; dossiê = o conjunto de pistas do grupo.\ncomandos: novo status ir esperar olhar coletar (coletar <g> <j> <n> [resposta]: se a pista for um enigma, escreva a resposta no fim) deixar trocar atividades coop solo central anexar apostar dica proxima revelar final caderno\nCustos: coletar pista = 1 de energia (algumas 0, algumas 2). trocar pista (só na pausa, até 3 por pessoa) = grátis. Atividade em dupla = 1 de energia de CADA pessoa. Sem dupla = 3 de energia (o comando atividades lista os nomes). Cada volta aceita UM conserto só: dois na mesma volta viram meio conserto cada. Duas pistas com a mesma etiqueta valem um sinal só. anexar = grátis, 1 tentativa por volta, a partir da volta 2: 3 pistas (2 sinais de tipos diferentes + 1 descarte; em dois defeitos: 1 sinal de número + 1 de força + 1 descarte). revelar: na recepcao, só na volta 5, 1 tentativa, quem apresenta precisa ter no PRÓPRIO caderno as 3 provas (peça falsa, trajeto, crachá). esperar <g> <j> <minuto, ex.: 1:06>: avança o relógio SÓ de quem espera (cada jogador tem relógio próprio).')
CMDS = {'novo': cmd_novo, 'status': cmd_status, 'ir': cmd_ir, 'esperar': cmd_esperar, 'olhar': cmd_olhar, 'coletar': cmd_coletar, 'deixar': cmd_deixar, 'trocar': cmd_trocar,
        'atividades': cmd_atividades, 'coop': cmd_coop, 'solo': cmd_solo, 'central': cmd_central, 'anexar': cmd_anexar, 'apostar': cmd_apostar, 'dica': cmd_dica, 'proxima': cmd_proxima,
        'proxima_volta': cmd_proxima, 'revelar': cmd_revelar, 'final': cmd_final, 'missao': cmd_missao, 'caderno': cmd_caderno}
if __name__ == '__main__':
    if len(sys.argv) < 2: cmd_ajuda(); sys.exit()
    c = sys.argv[1]; a = sys.argv[2:]
    try: CMDS.get(c, cmd_ajuda)(*a)
    except TypeError: print('Faltou ou sobrou argumento nesse comando.'); cmd_ajuda()
    except (IndexError, FileNotFoundError, KeyError): print('Grupo ou jogador inexistente. Use novo <grupo> <n> [causa] [modos] e jogadores J1, J2...')
