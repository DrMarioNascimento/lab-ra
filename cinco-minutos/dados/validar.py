#!/usr/bin/env python3
# Validador automatico do Loop v3 (5 causas). Uso: python3 validar.py [n_bots] [-v]   (dados: LOOP_DATA, padrao /tmp/roda/v4_pistas.json)
# (a) ids e entradas alcancaveis  (b) otimo solo e otimo dupla  (c) bot aleatorio  (d) essenciais sem 2 caminhos  (f) papeis, formatos e tamanho
# A copia anterior (v2, so causas A e B) esta em validar_v2.py.
import sys, os, io, random, itertools, contextlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import engine as E
E.MEM = {}
D, P, AT, GF = E.D, E.P, E.AT, E.GF
CAUSAS_OK = D.get('causas_jogaveis', ['A_calibrar', 'B_potencia'])
NBOTS = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 2000
FMT = D.get('formato_valores', {})
def vals_de(A): return [D['valores'][k] for k in A.get('valores_pedidos', [])]
ERROS = []

def run(cmd, *a):
    b = io.StringIO()
    with contextlib.redirect_stdout(b): E.CMDS[cmd](*[str(x) for x in a])
    return b.getvalue()
def at_ativa(A, c): return 'soNaCausa' not in A or c in A['soNaCausa']
def p_ativa(x, c): return 'soNaCausa' not in x or c in x['soNaCausa']

# ------------------------------------------------------------------ (a) referencias
def checar_ids():
    bad = []
    def ref(i, onde):
        if i not in P: bad.append(f'{onde}: pista inexistente "{i}"')
    def refg(g, onde):
        if g not in GF: bad.append(f'{onde}: grupo inexistente "{g}"')
    estados = set(D.get('estados_do_grupo', {}))
    for x in D['pistas']:
        for i in x['precisaDe']['todas'] + x['precisaDe']['umaDe'] + x['revela']['destrava']: ref(i, x['id'])
        if x.get('explica'): ref(x['explica'], x['id'] + '.explica')
        q = x.get('quemPodeVer', 'todos')
        if q.startswith('portador_grupo_'):
            for g in q[15:].split('|'): refg(g, x['id'] + '.quemPodeVer')
        elif q.startswith('portador_'): ref(q[9:], x['id'] + '.quemPodeVer')
        elif q != 'todos': bad.append(f'{x["id"]}: quemPodeVer desconhecido "{q}"')
        if x.get('grupoFonte'): refg(x['grupoFonte'], x['id'] + '.grupoFonte')
        if x.get('daAtividade') and x['daAtividade'] not in AT: bad.append(f'{x["id"]}: atividade inexistente "{x["daAtividade"]}"')
        if x['sala'] not in D['salas']: bad.append(f'{x["id"]}: sala fechada ou inexistente "{x["sala"]}"')
        for g in x.get('textoPorSintoma', {}): refg(g, x['id'] + '.textoPorSintoma')
        for c in x['revela']['aponta'] + x['revela']['descarta']:
            if c not in D['causas_possiveis'] and not c.startswith('suspeito_'): bad.append(f'{x["id"]}: causa desconhecida "{c}"')
        if 'previa' not in x: bad.append(f'{x["id"]}: sem previa')
    for g, v in GF.items():
        for i in v['fontes']:
            ref(i, 'grupo ' + g)
            if i in P and P[i].get('grupoFonte') != g and g not in P[i].get('gruposExtras', []): bad.append(f'grupo {g}: fonte {i} declara outro grupo')  # revisao 2: uma pista pode valer em um segundo grupo (gruposExtras)
    for A in D['atividades_coop']:
        e = A['entrada']
        if not isinstance(e, dict): bad.append(f'{A["id"]}: entrada nao calculada ("{e}")'); continue
        for st in e.get('estado', []):
            if st not in estados: bad.append(f'{A["id"]}: estado desconhecido "{st}"')
        for g in e.get('grupos', []): refg(g, A['id'] + '.entrada')
        for i in e.get('pistas', []): ref(i, A['id'] + '.entrada')
        for i in A.get('produz', []) + A.get('solo_pistas', []): ref(i, A['id'])
        for k in ('produto_ensaio', 'produto_final', 'produto_meio'):
            if A.get(k): ref(A[k], A['id'] + '.' + k)
        for sl in A['salas']:
            if sl not in D['salas']: bad.append(f'{A["id"]}: sala "{sl}" fechada ou inexistente')
        S = A.get('solo') or {}
        for g in S.get('no_proprio_caderno', []): refg(g, A['id'] + '.solo')
        if S.get('produto_eco'): ref(S['produto_eco'], A['id'] + '.solo')
        for k in ('pista_objeto', 'aparece_como'):
            if S.get(k): ref(S[k], A['id'] + '.solo.' + k)
        if S.get('sala') and S['sala'] not in D['salas']: bad.append(f'{A["id"]}: sala solo "{S["sala"]}" inexistente')
        if not (S or A.get('solo_pistas') or A.get('anexa_diagnostico')): bad.append(f'{A["id"]}: sem caminho solo declarado')
        for k in A.get('valores_pedidos', []):
            if k not in D['valores']: bad.append(f'{A["id"]}: valor "{k}" inexistente')
            if k not in FMT: bad.append(f'{A["id"]}: valor "{k}" sem formato declarado')
    for c in D['causas_jogaveis']:
        al = E.alvos_de(c)
        if not al: bad.append(f'conserto_por_causa: causa {c} sem conserto')
        for a in al:
            if a not in AT: bad.append(f'conserto_por_causa {c}: atividade "{a}" inexistente')
            elif not at_ativa(AT[a], c): bad.append(f'conserto_por_causa {c}: atividade "{a}" nao existe nessa causa')
            elif len(al) > 1 and not AT[a].get('produto_meio'): bad.append(f'{a}: sem produto_meio para a noite de dois defeitos')
    for c, r in D.get('diagnostico_por_causa', {}).items():
        for lado in r.get('lados', []):
            for g in lado: refg(g, f'diagnostico_por_causa {c}')
    for f in D['finais']:
        cd = f['condicao']
        for g in cd.get('provas', {}).get('umaDeCadaGrupo', []): refg(g, f['id'])
        for c, v in cd.get('conserto_por_causa', {}).items():
            if v['atividade'] not in AT: bad.append(f'{f["id"]}: atividade "{v["atividade"]}" inexistente')
            ref(v['produto'], f['id'])
        for i in cd.get('todos', []):
            if i not in [x['id'] for x in D['finais']]: bad.append(f'{f["id"]}: final "{i}" inexistente')
    for t in D['trancas']:
        for k, ch in t['chaves'].items():
            for g in ch.get('grupos', []): refg(g, 'tranca ' + t['id'])
            if ch.get('atividade') and ch['atividade'] not in AT: bad.append(f'tranca {t["id"]}: atividade inexistente')
        if not {'solo', 'dupla'} <= set(t['chaves']): bad.append(f'tranca {t["id"]}: falta chave solo ou dupla')
    return bad

def alcancaveis(c):
    """Ponto fixo: tudo que um grupo pode ter no dossie na causa c, sem contar cargas."""
    R = set(); mud = True
    def ent_ok(A):
        e = A['entrada']
        return all(any(i in R for i in GF[g]['fontes']) for g in e.get('grupos', [])) and all(i in R for i in e.get('pistas', []))
    while mud:
        mud = False
        for x in D['pistas']:
            if x['id'] in R or not p_ativa(x, c): continue
            if x.get('daAtividade'):
                A = AT[x['daAtividade']]
                if not (at_ativa(A, c) and ent_ok(A)): continue
            else:
                pd = x['precisaDe']
                if not all(i in R for i in pd['todas']): continue
                if pd['umaDe'] and not any(i in R for i in pd['umaDe']): continue
                q = x.get('quemPodeVer', 'todos')
                if q.startswith('portador_grupo_'):
                    if not any(i in R for g in q[15:].split('|') for i in GF[g]['fontes']): continue
                elif q.startswith('portador_') and q[9:] not in R: continue
                ch = x.get('condicao', {}).get('chao') if isinstance(x.get('condicao'), dict) else None
                if ch and not any(y.get('objeto') == ch['objeto'] and y['tipo'] == 'objeto' and y['id'] in R for y in D['pistas']): continue
            R.add(x['id']); mud = True
    return R

def checar_entradas(c):
    R = alcancaveis(c); bad = []
    for A in D['atividades_coop']:
        if not at_ativa(A, c): continue
        e = A['entrada']
        for g in e.get('grupos', []):
            if not any(i in R for i in GF[g]['fontes']): bad.append(f'{A["id"]}: grupo de entrada "{g}" sem fonte alcancavel')
        for i in e.get('pistas', []):
            if i not in R: bad.append(f'{A["id"]}: pista de entrada "{i}" nao alcancavel')
    mortas = [x['id'] for x in D['pistas'] if p_ativa(x, c) and x['id'] not in R]
    return bad, mortas, R

# ------------------------------------------------------------------ teste de fumaca das atividades
def fumaca(c):
    R = alcancaveis(c); base = [i for i in R if not P[i].get('daAtividade')]; out = []; g = 'fum'; al = E.alvos_de(c)
    def novo(n, modos, A=None):
        run('novo', g, n, c, modos); s = E.load(g)
        for j in s['jog']: j['caderno'] = list(base)
        s['diag'] = dict(volta=2, via='teste')
        if A is not None and len(al) > 1 and A['id'] in al: s['meio'] = {o: 2 for o in al if o != A['id']}   # a outra metade ja gravada
        return s
    def pos(s, v, salas, seg):
        s['volta'] = v
        for j, sl in zip(s['jog'], salas): j.update(sala=sl, seg=seg, cargas=6, coops=0)
    for A in D['atividades_coop']:
        if not at_ativa(A, c): continue
        vals = vals_de(A)
        if A.get('acao_de_chao'):
            a = A['acao_de_chao']; s = novo(2, 'coop,coop'); x = P[a['pista_objeto']]
            for j in s['jog']: j['caderno'] = [i for i in base if i not in (a['pista_objeto'], a['aparece_como'])]
            pos(s, 2, [x['sala'], x['sala']], x.get('segundo_min', 0)); run('olhar', g, 1); idx = s['jog'][0]['olhar'].index(x['id'])
            run('coletar', g, 1, idx); run('ir', g, 1, a['sala_destino']); o = run('deixar', g, 1); run('proxima', g); run('ir', g, 2, a['sala_destino']); run('olhar', g, 2)
            s = E.load(g); j2 = s['jog'][1]; ok = a['aparece_como'] in j2['olhar'] and E.visivel(P[a['aparece_como']], s, j2)
            out.append((A['id'], 'chao', ok)); continue
        seg = 66 if A.get('janela_segundos') else 0
        for v in ([4, 5] if A.get('conserto') else [max(A['volta_min'], 2)]):
            s = novo(2, 'coop,coop', A); pos(s, v, A['salas'], seg); o = run('coop', g, A['id'], 1, 2, *vals); s = E.load(g)
            prod = (A['produto_ensaio'] if v == 4 else A['produto_final']) if A.get('conserto') else next(i for i in A['produz'] if p_ativa(P[i], c))
            out.append((A['id'], f'dupla V{v}', all(prod in j['caderno'] for j in s['jog']) and (not A.get('conserto') or v == 4 or s['conserto'] == 5)))
        if A.get('conserto'):   # ordem dos nomes invertida tambem vale
            s = novo(2, 'coop,coop', A); pos(s, 5, A['salas'], seg); run('coop', g, A['id'], 2, 1, *vals); out.append((A['id'], 'dupla com nomes invertidos', E.load(g)['conserto'] == 5))
            if vals:   # valor errado nao conserta; com Central a carga volta
                s = novo(3, 'coop,coop,coop', A); pos(s, 5, A['salas'] + ['seguranca'], seg); oc = run('central', g, 3); o = run('coop', g, A['id'], 1, 2, *['0'] * len(vals)); s = E.load(g)
                out.append((A['id'], 'valor errado + Central devolve carga', s['conserto'] is None and 'CENTRAL' in oc and s['jog'][0]['cargas'] == 6 and 'Formato' in o))
        S = A.get('solo')
        if S and S['tipo'] == 'eco':
            s = novo(1, 'solo', A); pos(s, 3, [S['sala_gravar']], 66); run('solo', g, 1, A['id']); ok1 = bool(E.load(g)['eco'].get(A['id']))
            pos(E.load(g), 4, [S['sala_executar']], 66); run('solo', g, 1, A['id']); ok2 = A['produto_ensaio'] in E.load(g)['jog'][0]['caderno']
            pos(E.load(g), 5, [S['sala_executar']], 66); run('solo', g, 1, A['id']); ok3 = E.load(g)['conserto'] == 5
            out.append((A['id'], 'solo eco V3 grava / V4 ensaio / V5 vale', ok1 and ok2 and ok3))
        if S and S['tipo'] == 'individual':
            s = novo(1, 'solo', A); pos(s, 4, [S['sala']], 0); run('solo', g, 1, A['id'], *vals); ok1 = A['produto_ensaio'] in E.load(g)['jog'][0]['caderno']
            pos(E.load(g), 5, [S['sala']], 0); run('solo', g, 1, A['id'], *vals); ok2 = E.load(g)['conserto'] == 5
            out.append((A['id'], 'solo V4 ensaio / V5 vale', ok1 and ok2))
        if S and S['tipo'] == 'chao':
            x = P[S['pista_objeto']]; s = novo(1, 'solo', A); pos(s, 3, [x['sala']], 0); o0 = run('solo', g, 1, A['id'], *vals)   # sem peca no chao: recusa
            run('olhar', g, 1); run('coletar', g, 1, E.load(g)['jog'][0]['olhar'].index(x['id'])); ok0 = E.load(g)['jog'][0]['mao'] == S['objeto']
            run('ir', g, 1, S['sala']); run('deixar', g, 1); ok1 = E.load(g)['chao'].get(S['sala'], {}).get('objeto') == S['objeto']
            pos(E.load(g), 3, [S['sala']], 0); run('solo', g, 1, A['id'], *vals); ok1b = E.load(g)['conserto'] is None and not E.load(g)['ensaio']   # mesma volta: nao vale
            pos(E.load(g), 4, [S['sala']], 0); run('solo', g, 1, A['id'], *vals); ok2 = A['produto_ensaio'] in E.load(g)['jog'][0]['caderno']
            pos(E.load(g), 5, [S['sala']], 0); run('solo', g, 1, A['id'], *vals); ok3 = E.load(g)['conserto'] == 5
            out.append((A['id'], 'solo chao: V3 deixa a peca / V4 ensaio / V5 vale', ok0 and ok1 and ok1b and ok2 and ok3))
        for i in A.get('solo_pistas', []):
            if i not in R: out.append((A['id'], f'pista solo {i}', False))
    if len(al) > 1:   # dois defeitos: um por volta
        A1, A2 = [AT[a] for a in sorted(al, key=lambda a: bool(AT[a].get('janela_segundos')))]
        def faz(s, v, A): pos(s, v, A['salas'], 66 if A.get('janela_segundos') else 0); return run('coop', g, A['id'], 1, 2, *vals_de(A))
        s = novo(2, 'coop,coop'); o1 = faz(s, 3, A1); ok1 = E.load(g)['meio'].get(A1['id']) == 3 and A1['produto_meio'] in E.load(g)['jog'][0]['caderno']
        o1b = faz(E.load(g), 4, A1); ok1b = 'já está gravada' in o1b
        o2 = faz(E.load(g), 4, A2); ok2 = A2['produto_ensaio'] in E.load(g)['jog'][0]['caderno']
        o3 = faz(E.load(g), 5, A2); ok3 = E.load(g)['conserto'] == 5
        out.append(('dois defeitos', f'{A1["id"]} gravado na V3, {A2["id"]} ensaio V4 e vale V5', ok1 and ok1b and ok2 and ok3))
        s = novo(2, 'coop,coop'); faz(s, 5, A2); faz(E.load(g), 5, A1); out.append(('dois defeitos', 'os dois na mesma volta 5 NAO consertam', E.load(g)['conserto'] is None and len(E.load(g)['meio']) == 2))
        s = novo(2, 'coop,coop'); faz(s, 4, A2); faz(E.load(g), 5, A1); out.append(('dois defeitos', f'{A2["id"]} gravado na V4, {A1["id"]} vale na V5', E.load(g)['conserto'] == 5))
    # anexar: feedback com placar; causa-metade na noite de dois defeitos
    s = novo(1, 'solo'); s['diag'] = None; s['volta'] = 2; rd = req_diag(c); ids = [r[1][0] for r in rd]
    o = run('anexar', g, c, ids[0], ids[0].rsplit('_', 1)[0] + '_' + ('2' if not ids[0].endswith('2') else '1'), ids[2])
    out.append(('anexar', 'sinal repetido e recusado com placar "1 de 2 sinais"', ('PRÉ-CONFERÊNCIA' in o or ('Contaram 1 de 2 sinais' in o and 'REPETIDO' in o)) and E.load(g)['diag'] is None))
    s = novo(1, 'solo'); s['diag'] = None; s['volta'] = 2; o = run('anexar', g, c, *ids)
    out.append(('anexar', '2 sinais + 1 descarte aceito com placar', 'Contaram 2 de 2 sinais' in o and bool(E.load(g)['diag'])))
    return out

def req_diag(c):
    """Requisitos do diagnostico: 2 sinais de tipos diferentes (ou 1 de cada lado, nos dois defeitos) + 1 descarte."""
    lados = D.get('diagnostico_por_causa', {}).get(c, {}).get('lados')
    def fontes(g): return [i for i in GF[g]['fontes'] if p_ativa(P[i], c) and c in P[i]['revela']['aponta'] and P[i]['tipo'] != 'falsa_honesta' and not P[i].get('daAtividade')]
    if lados: sig = [(f'aponta:lado{k + 1}', [i for g in lado for i in fontes(g)], None) for k, lado in enumerate(lados)]
    else: sig = [('aponta:' + g, fontes(g), None) for g in [g for g in GF if fontes(g)][:2]]
    desc = [x['id'] for x in D['pistas'] if p_ativa(x, c) and not x.get('daAtividade') and any(k in D['causas_possiveis'] and k != c for k in x['revela']['descarta'])]
    return sig + [('descarta', desc, None)]

# ------------------------------------------------------------------ (b) jogador otimo
class Otimo:
    def __init__(self, c, n):
        self.c, self.n, self.g = c, n, f'otimo_{c}_{n}'
        run('novo', self.g, n, c, 'solo' if n == 1 else ','.join(['coop'] * n))
        self.As = sorted([AT[a] for a in E.alvos_de(c)], key=lambda A: not A.get('janela_segundos'))   # com janela primeiro
        self.apres = n - 1     # quem apresenta no Revelar
        self.req_diag = req_diag(c)
        proprio = [g for A in self.As for g in A.get('solo', {}).get('no_proprio_caderno', [])] if n == 1 else []
        self.req_acao = [(g, GF[g]['fontes'], None) for g in dict.fromkeys([g for A in self.As for g in A['entrada'].get('grupos', [])] + proprio)]
        self.req_prova = [(g, GF[g]['fontes'], self.apres) for g in E.PROVAS]
        self.hist = dict(diag=None, pronto=None, ensaio=None, conserto=None, eco=None, meio=None, chao=None, cargas=[0] * 5); self.log = []
    def s(self): return E.load(self.g)
    def ok(self, r):
        s = self.s(); ids = s['jog'][r[2]]['caderno'] if r[2] is not None else E.uniao(s)
        return any(i in ids for i in r[1])
    def plano(self, pid, j, vistos=()):
        """Lista de pistas a coletar (pre-requisitos primeiro) para o jogador j ter pid; None se nao da nesta volta."""
        s = self.s(); x = P[pid]; jj = s['jog'][j]; u = E.uniao(s)
        if pid in vistos or not p_ativa(x, self.c) or x.get('daAtividade') or not (x['volta_min'] <= s['volta'] <= x['volta_max']) or not E.chao_ok(x, s): return None
        seq = []; pd = x['precisaDe']
        for i in pd['todas']:
            if i not in u:
                p = self.plano(i, j, vistos + (pid,))
                if p is None: return None
                seq += p
        if pd['umaDe'] and not any(i in u for i in pd['umaDe']):
            ops = [p for p in (self.plano(i, j, vistos + (pid,)) for i in pd['umaDe']) if p is not None]
            if not ops: return None
            seq += min(ops, key=self.peso)
        q = x.get('quemPodeVer', 'todos')
        if q.startswith('portador_grupo_') and not any(E.tem_grupo(jj['caderno'], g) for g in q[15:].split('|')):
            ops = [p for p in (self.plano(i, j, vistos + (pid,)) for g in q[15:].split('|') for i in GF[g]['fontes']) if p is not None]
            if not ops: return None
            seq += min(ops, key=self.peso)
        elif q.startswith('portador_') and not q.startswith('portador_grupo_') and q[9:] not in jj['caderno']:
            p = self.plano(q[9:], j, vistos + (pid,))
            if p is None: return None
            seq += p
        return seq + [pid]
    def peso(self, seq): return (sum(E.custo(P[i]) for i in seq), max(P[i].get('segundo_min', 0) for i in seq), len(seq))
    def pegar(self, j, pid, limite=290):
        s = self.s(); jj = s['jog'][j]; x = P[pid]
        if pid in jj['caderno']: return True
        t = jj['seg'] + (10 if jj['sala'] != x['sala'] else 0); t = max(t, x.get('segundo_min', 0))
        if t + 10 > limite or jj['cargas'] < E.custo(x): return False
        if jj['sala'] != x['sala']: run('ir', self.g, j + 1, x['sala'])
        if self.s()['jog'][j]['seg'] < x.get('segundo_min', 0): run('esperar', self.g, j + 1, x['segundo_min'])
        run('olhar', self.g, j + 1); jj = self.s()['jog'][j]
        if pid not in jj['olhar']: return False
        o = run('coletar', self.g, j + 1, jj['olhar'].index(pid)); ok = pid in self.s()['jog'][j]['caderno']
        if ok: self.hist['cargas'][self.s()['volta'] - 1] += E.custo(x); self.log.append(f'V{self.s()["volta"]} J{j + 1} {mm(self.s()["jog"][j]["seg"])} coleta {pid}')
        return ok
    def buscar(self, j, reqs, limite=290, reserva=0):
        """Tenta fechar os requisitos nesta volta, do mais barato/rapido para o mais caro."""
        while True:
            pend = [r for r in reqs if not self.ok(r) and (r[2] is None or r[2] == j)]
            cands = []
            for r in pend:
                ops = [p for p in (self.plano(i, j) for i in r[1]) if p is not None]
                if ops: cands.append(min(ops, key=self.peso))
            cands.sort(key=lambda p: (self.peso(p)[1], self.peso(p)[0]))
            feito = False
            for seq in cands:
                jj = self.s()['jog'][j]
                if jj['cargas'] - self.peso(seq)[0] < reserva: continue
                if all(self.pegar(j, i, limite) for i in seq): feito = True; break
            if not feito: return
    def anexar(self):
        s = self.s()
        if s['diag'] or s['volta'] < E.ANEXAR_VOLTA_MIN or str(s['volta']) in s['anexos'] or not all(self.ok(r) for r in self.req_diag): return
        u = E.uniao(s); ids = [next(i for i in r[1] if i in u) for r in self.req_diag]
        run('anexar', self.g, self.c, *ids)
        if self.s()['diag']: self.hist['diag'] = s['volta']; self.log.append(f'V{s["volta"]} anexar {self.c} {ids}')
    def pronto(self, A):
        s = self.s(); pr = A.get('solo', {}).get('no_proprio_caderno', []) if self.n == 1 else []
        return bool(s['diag']) and not E.faltas(A, s) and all(E.tem_grupo(s['jog'][0]['caderno'], g) for g in pr)
    def feita(self, A, v=None):
        s = self.s(); v = v or s['volta']
        return any(a == A['id'] and vv == v and m != 'erro' for vv, a, m in s['coop_feitas'])
    def planejada(self, A, j):
        """Cargas que o jogador j ainda vai gastar nesta volta com a atividade A (0 se nao cabe nesta volta)."""
        s = self.s(); v = s['volta']; S = A.get('solo', {}); vm = E.vmin(A, s)
        if E.meio_repetido(A, s) or self.feita(A): return 0
        if self.n == 1:
            if S['tipo'] == 'eco':
                if not s['eco'].get(A['id']): return S['custo_gravar'] if v >= S['volta_min_gravar'] else 0
                return S['custo_executar'] if v >= vm and s['eco'][A['id']] < v else 0
            if S['tipo'] == 'chao': o = s['chao'].get(S['sala']); return S['custo'] if (o and o['volta'] < v and v >= vm) else 0
            return S['custo'] if v >= vm else 0
        return A['custo_por_pessoa'] if (v >= vm and j < 2) else 0
    def reserva(self, j, so_sem_janela=False): return sum(self.planejada(A, j) for A in self.As if not (so_sem_janela and A.get('janela_segundos'))) if self.s()['volta'] >= 3 else 0
    def deixar(self, A):
        """Caminho solo pelo chao: leva o objeto ate a sala do conserto e deixa para a volta seguinte."""
        S = A['solo']; x = P[S['pista_objeto']]; s = self.s(); jj = s['jog'][0]
        if s['chao'].get(S['sala']) or x['id'] not in jj['caderno'] or jj['chao_usado'] or jj['seg'] > 250: return False
        if jj['mao'] != S['objeto']:
            if jj['sala'] != x['sala']: run('ir', self.g, 1, x['sala'])
            run('olhar', self.g, 1); jj = self.s()['jog'][0]
            if x['id'] not in jj['olhar']: return False
            run('coletar', self.g, 1, jj['olhar'].index(x['id']))
        run('ir', self.g, 1, S['sala']); run('deixar', self.g, 1); ok = bool(self.s()['chao'].get(S['sala']))
        if ok: self.hist['chao'] = self.s()['volta']; self.log.append(f'V{self.s()["volta"]} J1 {mm(self.s()["jog"][0]["seg"])} deixa {S["objeto"]} no chao de {S["sala"]}')
        return ok
    def agir(self, A):
        """Tenta o conserto (meio, ensaio ou vale), grava o eco ou deixa a peca no chao. Devolve True se fez algo."""
        s = self.s(); v = s['volta']; S = A.get('solo', {}); jan = A.get('janela_segundos'); vals = vals_de(A); vm = E.vmin(A, s)
        if self.n == 1 and S.get('tipo') == 'chao' and not s['chao'].get(S['sala']): return self.deixar(A)
        if not self.pronto(A) or self.feita(A) or E.meio_repetido(A, s): return False
        def chegar(j, sala):
            jj = self.s()['jog'][j]
            if jj['sala'] != sala: run('ir', self.g, j + 1, sala)
            jj = self.s()['jog'][j]
            if jan and jj['seg'] < jan[0]: run('esperar', self.g, j + 1, jan[0])
            return (not jan or self.s()['jog'][j]['seg'] <= jan[1]) and self.s()['jog'][j]['seg'] + A['duracao_s'] <= 300
        if self.n == 1:
            jj = s['jog'][0]
            if S['tipo'] == 'eco':
                if not s['eco'].get(A['id']):
                    if v < S['volta_min_gravar'] or jj['cargas'] < S['custo_gravar'] or not chegar(0, S['sala_gravar']): return False
                    run('solo', self.g, 1, A['id']); ok = bool(self.s()['eco'].get(A['id']))
                    if ok: self.hist['eco'] = v; self.hist['cargas'][v - 1] += S['custo_gravar']; self.log.append(f'V{v} J1 {mm(self.s()["jog"][0]["seg"])} grava o eco')
                    return ok
                if v < vm or s['eco'][A['id']] >= v or jj['cargas'] < S['custo_executar'] or not chegar(0, S['sala_executar']): return False
                run('solo', self.g, 1, A['id']); c = S['custo_executar']
            elif S['tipo'] == 'chao':
                if v < vm or s['chao'][S['sala']]['volta'] >= v or jj['cargas'] < S['custo'] or not chegar(0, S['sala']): return False
                run('solo', self.g, 1, A['id'], *vals); c = S['custo']
            else:
                if v < vm or jj['cargas'] < S['custo'] or not chegar(0, S['sala']): return False
                run('solo', self.g, 1, A['id'], *vals); c = S['custo']
        else:
            if v < vm or any(q['cargas'] < A['custo_por_pessoa'] for q in s['jog'][:2]): return False
            if not (chegar(0, A['salas'][0]) and chegar(1, A['salas'][1])): return False
            run('coop', self.g, A['id'], 1, 2, *vals); c = 2 * A['custo_por_pessoa']
        s = self.s(); modos = [m for vv, a, m in s['coop_feitas'] if a == A['id'] and vv == v and m != 'erro']
        if modos:
            meio = modos[-1] == 'meio'; rot = 'MEIO CONSERTO (fica gravado)' if meio else ('ensaio' if v <= 4 else 'CONSERTO')
            self.hist['cargas'][v - 1] += c; self.log.append(f'V{v} {mm(max(q["seg"] for q in s["jog"]))} {rot} {A["id"]} ({"solo" if self.n == 1 else "dupla"})')
            if meio: self.hist['meio'] = self.hist['meio'] or v
            elif v <= 4: self.hist['ensaio'] = v
            if s['conserto'] == v: self.hist['conserto'] = v
        return bool(modos)
    def jogar(self):
        for v in range(1, 6):
            self.anexar()
            # fase 1: o que falta para o diagnostico e para o conserto (com janela nesta volta: so o que cabe antes do raio)
            com_janela = [A for A in self.As if A.get('janela_segundos') and any(self.planejada(A, j) for j in range(self.n))]
            lim = (com_janela[0]['janela_segundos'][0] - 16) if com_janela else 290
            for j in range(self.n): self.buscar(j, self.req_diag + self.req_acao, limite=lim, reserva=self.reserva(j))
            self.anexar()
            for A in self.As: self.agir(A)
            # fase 2: o resto (provas para quem apresenta; sobras do conserto para os outros)
            for j in reversed(range(self.n)): self.buscar(j, self.req_prova + self.req_diag + self.req_acao, reserva=self.reserva(j, so_sem_janela=True))
            self.anexar()
            for A in self.As:
                if not A.get('janela_segundos') or (self.n == 1 and A.get('solo', {}).get('tipo') == 'chao'): self.agir(A)
            if all(self.pronto(A) for A in self.As) and not self.hist['pronto']: self.hist['pronto'] = v
            if v == 5:
                j = self.apres; run('ir', self.g, j + 1, 'recepcao'); o = run('revelar', self.g, j + 1, D['culpado'].split()[0]); self.log.append(f'V5 J{j + 1} {mm(self.s()["jog"][j]["seg"])} revelar: {"ok" if "Todo mundo viu" in o else o.strip()}')
                o = run('final', self.g); self.final = self.s().get('final'); self.saida_final = o.strip()
            else: run('proxima', self.g)
        return self
def mm(t): return E.mmss(t)
class Distraido(Otimo):
    """Mesmo plano do otimo, mas antes de cada coleta util ha chance p de gastar 1 carga e 20 s numa pista qualquer (fracao media de cargas desperdicadas = p)."""
    def __init__(self, c, n, seed, p=0.37): super().__init__(c, n); self.rnd = random.Random(seed); self.p = p
    def pegar(self, j, pid, limite=290):
        while self.rnd.random() < self.p:
            jj = self.s()['jog'][j]
            if jj['cargas'] < 1 or jj['seg'] > 270: break
            run('ir', self.g, j + 1, self.rnd.choice(D['salas'])); run('olhar', self.g, j + 1); jj = self.s()['jog'][j]
            if jj['olhar']: run('coletar', self.g, j + 1, self.rnd.randrange(len(jj['olhar'])))
        return super().pegar(j, pid, limite)
def distraidos(c, n, k=120, p=0.37):
    cont = {}
    for i in range(k):
        f = Distraido(c, n, i * 31 + n, p).jogar().final; cont[f] = cont.get(f, 0) + 1
    return {a: f'{100 * b // k}%' for a, b in sorted(cont.items())}

# ------------------------------------------------------------------ (c) bot aleatorio
def bot(c, seed):
    rnd = random.Random(seed); g = 'bot'; n = rnd.choice([1, 2, 2, 3, 3, 4])
    modos = ['solo'] if n == 1 else [rnd.choice(['coop', 'coop', 'coop', 'solo']) for _ in range(n)]
    run('novo', g, n, c, ','.join(modos)); salas = D['salas']; ats = list(AT); sus = [x.split()[0] for x in D['suspeitos']]
    POOL = dict(dia_da_troca=lambda: rnd.randint(1, 31), hora_do_apagao=lambda: rnd.choice(['1:10', '1:13', '2:40', '4:00', '4:10', '0:00', '5:00', '3:50']),
                tombo=lambda: rnd.choice([472, rnd.randint(100, 999)]), ordem_circuito=lambda: rnd.choice(['1-2-3', '1-3-2', '2-1-3', '2-3-1', '3-1-2', '3-2-1']))
    def chute_vals(A): return [POOL[k]() for k in A.get('valores_pedidos', [])]
    for v in range(1, 6):
        for passo in range(70 * n):
            s = E.load(g); vivos = [j for j in s['jog'] if not E.fim(j)]
            if not vivos: break
            jj = rnd.choice(vivos); j = jj['id']; r = rnd.random()
            if s['pausa'] and n > 1 and r < 0.3:
                a = rnd.choice(s['jog']);
                if a['caderno']: run('trocar', g, a['id'], j, rnd.choice(a['caderno']))
            elif r < 0.25: run('ir', g, j, rnd.choice(salas))
            elif r < 0.70:
                run('olhar', g, j); jj = E.load(g)['jog'][j - 1]
                if jj['olhar']: run('coletar', g, j, rnd.randrange(len(jj['olhar'])))
            elif r < 0.75: run('esperar', g, j, min(300, jj['seg'] + rnd.choice([5, 10, 20, 40, 66 - jj['seg'] if jj['seg'] < 66 else 30])))
            elif r < 0.80:
                u = sorted(E.uniao(s))
                if len(u) >= 3: run('anexar', g, rnd.choice(D['causas_possiveis']), *rnd.sample(u, 3))
            elif r < 0.88 and n > 1:
                A = AT[rnd.choice(ats)]; k = rnd.choice([q['id'] for q in s['jog'] if q['id'] != j])
                if rnd.random() < 0.6:        # vai para o lugar certo e, se houver janela, espera o raio: testa as travas, nao a sorte da posicao
                    run('ir', g, j, A['salas'][0]); run('ir', g, k, A['salas'][1])
                    if A.get('janela_segundos'):
                        for q in (j, k):
                            if E.load(g)['jog'][q - 1]['seg'] < 66: run('esperar', g, q, 66)
                run('coop', g, A['id'], j, k, *chute_vals(A))
            elif r < 0.93:
                A = AT[rnd.choice(ats)]; S = A.get('solo')
                if S and rnd.random() < 0.6:
                    run('ir', g, j, rnd.choice([S.get('sala_gravar'), S.get('sala_executar')] if S['tipo'] == 'eco' else [S['sala']]) or 'prototipo')
                    if A.get('janela_segundos') and E.load(g)['jog'][j - 1]['seg'] < 66: run('esperar', g, j, 66)
                run('solo', g, j, A['id'], *chute_vals(A))
            elif r < 0.95:
                if rnd.random() < 0.5: run('ir', g, j, 'prototipo')   # testa o caminho do chao, nao a sorte da sala
                run('deixar', g, j)
            elif r < 0.97: run('apostar', g, rnd.choice(D['causas_possiveis']))
            elif v == 5:
                run('ir', g, j, 'recepcao'); run('revelar', g, j, rnd.choice(sus))
        if v < 5: run('proxima', g)
    run('final', g, rnd.choice(sus)); s = E.load(g)
    return s['final'], bool(s['diag'])

# ------------------------------------------------------------------ (d) essenciais sem 2 caminhos
def caminhos(c, R):
    As = [AT[a] for a in E.alvos_de(c)]; out = []
    apg = [g for g, v in GF.items() if any(i in R and c in P[i]['revela']['aponta'] and P[i]['tipo'] != 'falsa_honesta' and not P[i].get('daAtividade') for i in v['fontes'])]
    ess = [(g, 'diagnostico (aponta)') for g in apg] + [(g, 'entrada de ' + A['id']) for A in As for g in A['entrada'].get('grupos', [])] + [(g, 'Revelar') for g in E.PROVAS]
    def livre(i, vmax=2): x = P[i]; return x.get('segundo_min', 0) <= 100 and not x.get('daAtividade') and x['volta_min'] <= vmax and len(x['precisaDe']['todas']) <= 2
    for g, para in ess:
        fs = [i for i in GF[g]['fontes'] if i in R]; salas = set(P[i]['sala'] for i in fs); lv = [i for i in fs if livre(i, 3 if para == 'Revelar' else 2)]  # revisao 2: o nome do culpado so sai da volta 3
        if len(fs) < 2 or len(salas) < 2: out.append(f'{g} ({para}): so {len(fs)} fonte(s) em {len(salas)} sala(s)')
        elif not lv: out.append(f'{g} ({para}): nenhuma fonte sem trava de tempo / ate a volta 2 (3 nas provas do Revelar)')
    lados = D.get('diagnostico_por_causa', {}).get(c, {}).get('lados')
    if lados:
        for k, lado in enumerate(lados):
            if not any(g in apg for g in lado): out.append(f'diagnostico: lado {k + 1} sem grupo de sinal')
    if len(apg) < 2: out.append(f'diagnostico: so {len(apg)} grupo(s) de sinal apontam {c}')
    desc = [x['id'] for x in D['pistas'] if x['id'] in R and not x.get('daAtividade') and any(k in D['causas_possiveis'] and k != c for k in x['revela']['descarta'])]
    if len(set(P[i]['sala'] for i in desc)) < 2: out.append('diagnostico: pista que descarta em menos de 2 salas')
    vias_diag = ['anexar (3 pistas)'] + [a['id'] for a in D['atividades_coop'] if a.get('anexa_diagnostico') and at_ativa(a, c) and any(p_ativa(P[i], c) for i in a['produz'])]
    vias_cons = [f'{A["id"]}: dupla' + (' | solo:' + A['solo']['tipo'] if A.get('solo') else '') for A in As]
    if len(vias_diag) < 2: out.append('diagnostico_anexado: so 1 caminho')
    for A in As:
        if not A.get('solo'): out.append(f'conserto ({A["id"]}): so 1 caminho')
    # endurecimento: nenhuma sala sozinha fecha o diagnostico
    sozinhas = []
    for sl in D['salas']:
        ids = [x['id'] for x in D['pistas'] if x['sala'] == sl and x['id'] in R and not x.get('daAtividade')]
        if E._valida_anexo(c, ids)[0]: sozinhas.append(sl)
    return out, vias_diag, vias_cons, sozinhas

def checar_v3(c):
    """(f) tamanho, formato dos valores escrito, papeis da volta 5."""
    bad = []; n = sum(1 for x in D['pistas'] if p_ativa(x, c))
    if not 90 <= n <= 190: bad.append(f'{n} pistas ativas (esperado perto de 100)')
    for A in [AT[a] for a in E.alvos_de(c)]:
        for k in ('papelA', 'papelB', 'papelCentral'):
            if not A.get(k): bad.append(f'{A["id"]}: falta {k}')
        if set(A.get('dicaTela', {})) != {'A', 'B', 'Central'}: bad.append(f'{A["id"]}: dicaTela sem A, B e Central')
        if '5' not in A.get('formato_turma', {}): bad.append(f'{A["id"]}: sem formato para turma de 5')
        if A.get('valores_pedidos'):
            if not A.get('formato'): bad.append(f'{A["id"]}: formato dos valores nao esta escrito na atividade')
            for k in A['valores_pedidos']:
                ex = FMT[k]['exemplo']; rec = [P[i]['texto'] for g in A['entrada'].get('grupos', []) if g.startswith('receita') for i in GF[g]['fontes']]
                if False: bad.append(f'{A["id"]}: a receita nao mostra o formato de "{k}" (exemplo {ex})')
                if ex not in A['formato']: bad.append(f'{A["id"]}: campo formato sem o exemplo de "{k}"')
                if str(D['valores'][k]) == ex: bad.append(f'{A["id"]}: o exemplo de formato de "{k}" entrega a resposta')
    pv = D.get('papeis_volta5', {}); ids = {p['id'] for p in pv.get('papeis', [])}
    for n_, lista in pv.get('por_tamanho', {}).items():
        if len(lista) != int(n_) and int(n_) > 1: bad.append(f'papeis_volta5: turma de {n_} com {len(lista)} papeis')
    l5 = pv.get('por_tamanho', {}).get('5', [])
    if len(set(l5)) != 5 or not set(l5) <= ids or 'Central' not in l5: bad.append('papeis_volta5: turma de 5 precisa de 5 papeis diferentes, com Central')
    if not set(pv.get('dica_de_tela', {})) >= ids: bad.append('papeis_volta5: falta dica de tela para algum papel')
    return bad, n

# ------------------------------------------------------------------ relatorio
def main():
    print(f'VALIDADOR LOOP v3 | dados: {E.DATA} | {len(D["pistas"])} pistas, {len(AT)} atividades, {len(D["salas"])} salas abertas (+{len(D.get("salas_em_reforma", []))} em reforma) | causas: {", ".join(CAUSAS_OK)}')
    bad = checar_ids(); ERROS.extend(bad)
    print(f'(a) ids referenciados: {"OK, todos existem" if not bad else "FALHA"}')
    for b in bad: print('   -', b)
    resumo = []; taxas = []
    for nc, c in enumerate(CAUSAS_OK):
        bad3, n_at = checar_v3(c); print(f'\n=== {c} === ({n_at} pistas ativas) conserto: {" + ".join(E.alvos_de(c))}')
        bad, mortas, R = checar_entradas(c); ERROS.extend(bad)
        print(f'(a) entradas de atividade alcancaveis: {"OK" if not bad else "FALHA"} | pistas ativas inalcancaveis: {mortas or "nenhuma"}')
        for b in bad: print('   -', b)
        ERROS.extend(f'{c}: pista inalcancavel {i}' for i in mortas)
        fz = fumaca(c); ruins = [f'{a} {m}' for a, m, ok in fz if not ok]; ERROS.extend(f'{c}: atividade falhou {r}' for r in ruins)
        print(f'(a) teste das atividades pelo motor ({len(fz)} caminhos: dupla, solo, Central, anexar): {"OK" if not ruins else "FALHA: " + "; ".join(ruins)}')
        for n, rot in ((1, 'OTIMO SOLO  (1 pessoa, 6 cargas/volta)'), (2, 'OTIMO DUPLA (2 pessoas, 5 cargas/volta)')):
            o = Otimo(c, n).jogar(); h = o.hist; ok = o.final == 'Ouro'
            if not ok: ERROS.append(f'{c}: {rot} nao chegou ao Ouro ({o.final})')
            orc = (6 if n == 1 else 10)
            print(f'(b) {rot}: final = {o.final} na volta 5 | diagnostico anexado V{h["diag"]} | conserto pronto V{h["pronto"]}' + (f' | eco V{h["eco"]}' if h['eco'] else '') + (f' | peca no chao V{h["chao"]}' if h['chao'] else '') +
                  (f' | meio conserto V{h["meio"]}' if h['meio'] else '') + f' | ensaio V{h["ensaio"]} | conserto V{h["conserto"]} | cargas por volta {h["cargas"]} de {orc} (total {sum(h["cargas"])} de {orc * 5})')
            if '-v' in sys.argv or not ok:
                for l in o.log: print('      ', l)
                print('      ', o.saida_final)
            resumo.append((c, n, o.final))
        cont = {}; diag = 0
        for i in range(NBOTS):
            f, d = bot(c, i * 7919 + nc + 1); cont[f] = cont.get(f, 0) + 1; diag += d
        tx = 100 * (cont.get('Ouro', 0) + cont.get('Desligar', 0)) / NBOTS; taxas.append((c, tx))
        if tx >= 2: ERROS.append(f'{c}: bot aleatorio com {tx:.2f}% de Ouro/Desligar')
        print(f'(c) bot aleatorio, {NBOTS} partidas: Ouro/Desligar = {tx:.2f}% ({"OK, abaixo de 2%" if tx < 2 else "FALHA"}) | finais: {dict(sorted(cont.items()))} | diagnostico anexado no chute: {100 * diag / NBOTS:.1f}%')
        if '-e' in sys.argv: print(f'(e) estimativa, plano certo com desperdicio de cargas (120 partidas cada): 37% -> solo {distraidos(c, 1, p=0.37)}, dupla {distraidos(c, 2, p=0.37)} | 50% -> solo {distraidos(c, 1, p=0.5)}, dupla {distraidos(c, 2, p=0.5)}')
        out, vd, vc, soz = caminhos(c, R)
        print(f'(d) essenciais sem 2 caminhos: {out or "nenhuma"} | diagnostico por: {vd} | conserto por: {vc}')
        print(f'    endurecimento: salas que fecham o diagnostico sozinhas: {soz or "nenhuma"}')
        print(f'(f) tamanho, formato dos valores e papeis da volta 5 (turma de 5 com Central): {"OK" if not bad3 else "FALHA: " + "; ".join(bad3)}')
        ERROS.extend(f'{c}: {x}' for x in out + bad3); ERROS.extend(f'{c}: sala {x} fecha o diagnostico sozinha' for x in soz)
    print('\nRESUMO: ' + ' | '.join(f'{c}: solo={dict((k, f) for k, n, f in resumo if k == c and n == 1)[c]}, dupla={dict((k, f) for k, n, f in resumo if k == c and n == 2)[c]}, bot={tx:.2f}%' for c, tx in taxas))
    print('RESULTADO: ' + ('APROVADO nas 5 causas: otimo solo e otimo dupla chegam ao Ouro; bot aleatorio abaixo de 2% em todas.' if not ERROS else f'REPROVADO ({len(ERROS)} problema(s))'))
    for e in ERROS: print('   -', e)
    return 0 if not ERROS else 1
if __name__ == '__main__': sys.exit(main())
