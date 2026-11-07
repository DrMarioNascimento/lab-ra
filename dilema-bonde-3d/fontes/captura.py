# Captura a maquete em vistas diferentes; opcionalmente roda a animação (rota e segundos).
import sys, subprocess, time
from playwright.sync_api import sync_playwright
ROOT = '/home/claude/maquete'
import os
LEVE = os.environ.get('LEVE') == '1'
EXTRA = os.environ.get('EXTRA', '')
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8766'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(viewport={'width': 1600, 'height': 900})
        pg.on('pageerror', lambda e: print('ERRO:', e))
        pg.on('console', lambda m: print('console:', m.text) if m.type in ('error', 'warning') and 'GPU stall' not in m.text else None)
        for arg in sys.argv[1:]:
            nome, cam, *acao = arg.split('|')
            pg.goto(f'http://localhost:8766/index.html?cam={cam}' + EXTRA + ('&leve=1' if LEVE else ''))
            pg.wait_for_function('window.__pronto === true', timeout=180000)
            pg.wait_for_timeout(1500)
            if acao and acao[0] == 'pos':
                rota, ds = acao[1], float(acao[2])
                pg.evaluate(f"""() => {{ const m = window.__maquete; const alvo = m.S_ALVO['{rota}']; m.irPara('{rota}', alvo + ({ds}));  }}""")
                pg.wait_for_timeout(2500)
            elif acao:
                rota, segs = acao[0], float(acao[1])
                pg.evaluate(f"""() => {{ const m = window.__maquete; m.definirRota('{rota}'); m.estado.vMax = 14; m.partir(); }}""")
                pg.wait_for_timeout(int(segs * 1000))
            pg.screenshot(path=f'{ROOT}/fontes/cap_{nome}.png', timeout=240000)
        b.close()
finally:
    srv.terminate()
