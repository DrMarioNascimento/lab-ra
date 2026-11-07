import sys, subprocess, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8767'], cwd='/home/claude/maquete', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(); pg.on('pageerror', lambda e: print('ERRO:', e))
        pg.goto('http://localhost:8767/ar/compilar.html'); pg.wait_for_function('window.__ok === true', timeout=900000)
        open('/home/claude/maquete/ar/marcador.mind', 'wb').write(bytes(pg.evaluate('window.__dados'))); b.close()
finally: srv.terminate()
