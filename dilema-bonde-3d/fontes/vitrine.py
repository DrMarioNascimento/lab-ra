import sys, subprocess, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8769'], cwd='/home/claude/maquete', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']); pg = b.new_page(viewport={'width': 1600, 'height': 900})
        pg.on('pageerror', lambda e: print('ERRO', e))
        for nome, m in [a.split('=', 1) for a in sys.argv[1:]]:
            pg.goto(f'http://localhost:8769/fontes/vitrine.html?m={m}'); pg.wait_for_function('window.ok===true', timeout=300000); pg.screenshot(path=f'/home/claude/maquete/fontes/vit_{nome}.png', timeout=200000)
        b.close()
finally: srv.terminate()
