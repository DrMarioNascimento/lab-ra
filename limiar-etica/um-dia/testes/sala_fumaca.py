# Teste de fumaça da sala ao vivo com sala simulada (sem rede). Rodar a partir da raiz do repositório:
#   python3 -m http.server 8765 &   e depois   python3 limiar-etica/um-dia/testes/sala_fumaca.py
import sys, json, re
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:8765/limiar-etica/um-dia/'
FAKE = """
(() => {
  const K='fake_sala_db';
  const ler=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}};
  const gravar=d=>localStorage.setItem(K,JSON.stringify(d));
  window.__LIMIAR_SALA_FALSA = {
    async entrarProfessor(){return true}, async sairProfessor(){},
    async criarSessao(c){const d=ler(); d[c]={ativa:true,alunos:{}}; gravar(d); return c},
    async encerrarSessao(c){const d=ler(); if(d[c]) d[c].ativa=false; gravar(d)},
    async sessaoAtiva(c){const d=ler(); return !!(d[c]&&d[c].ativa)},
    async gravarAluno(c,id,x){const d=ler(); d[c].alunos[id]={...(d[c].alunos[id]||{}),...x,projeto:'limiar-etico'}; gravar(d)},
    async apagarAluno(c,id){const d=ler(); delete d[c].alunos[id]; gravar(d)},
    ouvirAlunos(c,cb){let ult=''; const t=setInterval(()=>{const d=ler(); const l=Object.entries((d[c]||{}).alunos||{}).map(([id,v])=>({id,...v})); const s=JSON.stringify(l); if(s!==ult){ult=s;cb(l)}},200); return ()=>clearInterval(t)}
  };
})();
"""
def jogar(pg, dia):
    pg.click(f'[data-acao="dia"][data-dia="{dia}"]'); pg.click('[data-acao="comecar"]')
    for i in range(80):
        if pg.locator('[data-acao="escolher"]').count(): pg.locator('[data-acao="escolher"]').nth(i%3 if pg.locator('[data-acao="escolher"]').count()>2 else 0).click()
        if pg.locator('[data-acao="seguir"]').count(): pg.click('[data-acao="seguir"]')
        elif pg.locator('[data-acao="revelar"]').count(): pg.click('[data-acao="revelar"]'); break
        pg.wait_for_timeout(60)
    pg.wait_for_selector('[data-acao="abrir-salvar"]')
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox']); ctx=b.new_context(viewport={'width':390,'height':844}, accept_downloads=True)
    ctx.add_init_script(FAKE)
    erros=[]
    prof=ctx.new_page(); prof.on('pageerror',lambda e:erros.append('prof:'+str(e))); prof.on('console',lambda m: m.type=='error' and erros.append('profc:'+m.text))
    prof.goto(BASE+'?professor'); prof.click('[data-acao="prof-entrar"]'); prof.click('[data-acao="prof-criar"]')
    codigo=prof.locator('.codigo-sala').inner_text(); print('codigo',codigo)
    alunos=[]
    for k in range(6):
        pg=ctx.new_page(); pg.on('pageerror',lambda e,k=k:erros.append(f'a{k}:'+str(e)))
        pg.goto(BASE+f'?sala={codigo}'); pg.click('[data-acao="fechar-manual"]')
        pg.fill('#sala-nome',f'Aluno {k+1}'); pg.click('.emojis .emoji >> nth=%d'%k); pg.click('[data-acao="entrar-sala"]')
        pg.wait_for_selector('[data-acao="dia"]')
        jogar(pg,'bairro')
        pg.click('[data-aba="aplicar"]'); pg.fill('#resposta-aplicacao',f'Eu ouviria os dois lados antes de decidir, aluno {k+1}.')
        pg.click('[data-acao="abrir-salvar"]'); pg.wait_for_selector('#salvar')
        if k==0:
            pg.screenshot(path='/tmp/dlg_salvar.png')
            pg.uncheck('#fmt-pdf')
            with pg.expect_download(timeout=30000) as d: pg.click('[data-s="salvar"]')
            d.value.save_as('/tmp/dia_aluno.png'); print('png ok', d.value.suggested_filename)
        pg.click('[data-s="enviar"]'); pg.wait_for_function("document.querySelector('#salvar-msg').textContent.includes('Enviado')")
        alunos.append(pg)
    prof.wait_for_function("document.querySelectorAll('.card-aluno.enviou').length==6")
    prof.screenshot(path='/tmp/prof_cards.png', full_page=True)
    prof.click('[data-acao="prof-vista"][data-v="turma"]'); prof.wait_for_selector('.cena-turma'); prof.wait_for_timeout(500)
    prof.screenshot(path='/tmp/prof_turma.png', full_page=True)
    prof.click('[data-acao="prof-salvar-turma"]'); prof.wait_for_selector('#salvar')
    prof.uncheck('#fmt-pdf')
    with prof.expect_download(timeout=30000) as d: prof.click('[data-s="salvar"]')
    d.value.save_as('/tmp/turma.png'); print('turma png ok')
    prof.click('[data-s="fechar"]')
    prof.click('[data-acao="prof-vista"][data-v="alunos"]'); prof.click('.card-aluno.enviou >> nth=0'); prof.wait_for_selector('.prof-barra'); prof.wait_for_timeout(1500)
    print('quem:', prof.locator('.prof-quem').inner_text())
    prof.click('[data-acao="prof-prox"]'); print('quem2:', prof.locator('.prof-quem').inner_text())
    prof.keyboard.press('ArrowLeft'); print('quem3:', prof.locator('.prof-quem').inner_text())
    prof.click('[data-aba="aplicar"]'); print('aplicar:', prof.locator('.resposta-folha').first.inner_text())
    prof.screenshot(path='/tmp/prof_aluno.png', full_page=True)
    prof.click('[data-acao="telao"]'); print('telao:', prof.evaluate("document.body.classList.contains('telao')"), prof.locator('.prof-quem').inner_text())
    prof.click('.botao-sair-telao')
    print('ERROS', erros)
    b.close()
