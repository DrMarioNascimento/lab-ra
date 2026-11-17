import asyncio
from playwright.async_api import async_playwright
ROD='<div style="width:100%;font-family:Sora,Arial,sans-serif;font-size:7pt;color:#5b6678;padding:0 16mm;display:flex;justify-content:space-between"><span>Prof. Mário César Nascimento, PhD © · Mosaico Vila · Manual · v1.0 · 17/11/2026</span><span class="pageNumber"></span></div>'
CAB='<div style="width:100%;font-family:Sora,Arial,sans-serif;font-size:6.6pt;letter-spacing:.12em;color:#9a6a08;padding:0 16mm;text-align:right">MOSAICO VILA · MANUAL</div>'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto("file://" + __import__("os").path.abspath("manual.html") + ""); await pg.wait_for_timeout(800)
        await pg.evaluate("document.fonts.ready")
        ruins=await pg.evaluate("()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src.split('/').pop())"); print('imagens quebradas:',ruins)
        await pg.pdf(path="Mosaico-Vila-Manual-v1.0.pdf",format="A4",print_background=True,display_header_footer=True,header_template=CAB,footer_template=ROD,margin={"top":"17mm","bottom":"18mm","left":"16mm","right":"16mm"})
        await b.close()
asyncio.run(main())
