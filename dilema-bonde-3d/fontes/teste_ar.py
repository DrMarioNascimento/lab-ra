import sys, subprocess, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8768'], cwd='/home/claude/maquete', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/home/claude/maquete/fontes/cam_falsa.y4m'])
        ctx = b.new_context(viewport={'width': 1280, 'height': 720}, permissions=['camera'])
        pg = ctx.new_page(); pg.on('pageerror', lambda e: print('ERRO:', e))
        pg.on('console', lambda m: print('console:', m.type, m.text[:200]) if m.type in ('error',) else None)
        pg.goto('http://localhost:8768/ar/index.html'); pg.click('#comecar')
        try: pg.wait_for_function("document.getElementById('aviso').textContent.startsWith('Toque')", timeout=300000); print('MARCADOR ENCONTRADO')
        except Exception as e: print('marcador não encontrado:', str(e)[:80])
        pg.wait_for_timeout(3000); pg.screenshot(path='/home/claude/maquete/fontes/cap_ar.png', timeout=240000); b.close()
finally: srv.terminate()
