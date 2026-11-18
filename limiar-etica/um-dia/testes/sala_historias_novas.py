# Fumaça das quatro histórias novas (academia, laboratório, clube, reabilitação) com sala simulada: sala fixa e sala livre.
# Rodar a partir da raiz do repositório:  python3 -m http.server 8765 &   e depois   python3 limiar-etica/um-dia/testes/sala_historias_novas.py
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
    async criarSessao(c,cfg){const d=ler(); d[c]={ativa:true,alunos:{},modo:(cfg&&cfg.modo)||'livre',dia:(cfg&&cfg.dia)||''}; gravar(d); return c}, async lerSessao(c){const d=ler(); const x=d[c]; return x&&x.ativa?{modo:x.modo,dia:x.dia}:null},
    async encerrarSessao(c){const d=ler(); if(d[c]) d[c].ativa=false; gravar(d)},
    async sessaoAtiva(c){const d=ler(); return !!(d[c]&&d[c].ativa)},
    async gravarAluno(c,id,x){const d=ler(); d[c].alunos[id]={...(d[c].alunos[id]||{}),...x,projeto:'limiar-etico'}; gravar(d)},
    async apagarAluno(c,id){const d=ler(); delete d[c].alunos[id]; gravar(d)},
    ouvirAlunos(c,cb){let ult=''; const t=setInterval(()=>{const d=ler(); const l=Object.entries((d[c]||{}).alunos||{}).map(([id,v])=>({id,...v})); const s=JSON.stringify(l); if(s!==ult){ult=s;cb(l)}},200); return ()=>clearInterval(t)}
  };
})();
"""
def jogar(pg, dia, fixo=False):
    if not fixo: pg.click(f'[data-acao="dia"][data-dia="{dia}"]')
    pg.click('[data-acao="comecar"]')
    for i in range(90):
        if pg.locator('[data-acao="escolher"]').count(): pg.locator('[data-acao="escolher"]').nth(i%3 if pg.locator('[data-acao="escolher"]').count()>2 else 0).click()
        if pg.locator('[data-acao="seguir"]').count(): pg.click('[data-acao="seguir"]')
        elif pg.locator('[data-acao="revelar"]').count(): pg.click('[data-acao="revelar"]'); break
        pg.wait_for_timeout(50)
    pg.wait_for_selector('[data-acao="abrir-salvar"]')
def enviar(pg,k):
    pg.click('[data-aba="aplicar"]'); pg.fill('#resposta-aplicacao',f'Resposta do aluno {k}: eu pediria autorização para cada uso.')
    pg.click('[data-acao="abrir-salvar"]'); pg.wait_for_selector('#salvar'); pg.click('[data-s="enviar"]')
    pg.wait_for_function("document.querySelector('#salvar-msg').textContent.includes('Enviado')")
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox']); ctx=b.new_context(viewport={'width':390,'height':844})
    ctx.add_init_script(FAKE); erros=[]
    prof=ctx.new_page(); prof.on('pageerror',lambda e:erros.append('prof:'+str(e)))
    prof.goto(BASE+'?professor'); prof.click('[data-acao="prof-entrar"]')
    prof.screenshot(path='/tmp/n_criar.png', full_page=True)
    print('overflow criar:', prof.evaluate('document.documentElement.scrollWidth > innerWidth'))
    # sala fixa na reabilitação
    prof.click('[data-acao="prof-modo"][data-modo="reabilitacao"]'); prof.click('[data-acao="prof-criar"]')
    codigo=prof.locator('.codigo-sala').inner_text(); print('codigo',codigo, prof.locator('.sala-topo, .prof-tela').first.inner_text()[:160].replace('\n',' | '))
    for k in range(5):
        pg=ctx.new_page(); pg.on('pageerror',lambda e,k=k:erros.append(f'a{k}:'+str(e)))
        pg.goto(BASE+f'?sala={codigo}'); pg.click('[data-acao="fechar-manual"]')
        pg.fill('#sala-nome',f'Aluno {k+1}'); pg.click('.emojis .emoji >> nth=%d'%k); pg.click('[data-acao="entrar-sala"]')
        pg.wait_for_selector('[data-acao="comecar"]')
        assert pg.locator('[data-acao="dia"]').count()==0, 'sala fixa mostrou escolha de dia'
        print('abertura:', pg.locator('h1,h2').first.inner_text())
        jogar(pg,'reabilitacao',True); enviar(pg,k+1)
    prof.wait_for_function("document.querySelectorAll('.card-aluno.enviou').length==5")
    prof.click('[data-acao="prof-vista"][data-v="turma"]'); prof.wait_for_selector('.cena-turma'); prof.wait_for_timeout(500)
    prof.screenshot(path='/tmp/n_turma_fixa.png', full_page=True)
    print('cenas na turma:', prof.locator('.cena-turma').count(), 'overflow:', prof.evaluate('document.documentElement.scrollWidth > innerWidth'))
    # sala livre com abas de 7 histórias
    prof2=ctx.new_page(); prof2.on('pageerror',lambda e:erros.append('prof2:'+str(e)))
    prof2.goto(BASE+'?professor'); prof2.click('[data-acao="prof-entrar"]'); prof2.click('[data-acao="prof-criar"]')
    cod2=prof2.locator('.codigo-sala').inner_text()
    for k,dia in enumerate(['clube']*5+['pesquisa','academia']):
        pg=ctx.new_page(); pg.on('pageerror',lambda e,k=k:erros.append(f'b{k}:'+str(e)))
        pg.goto(BASE+f'?sala={cod2}'); pg.click('[data-acao="fechar-manual"]')
        pg.fill('#sala-nome',f'Aluno {k+1}'); pg.click('.emojis .emoji >> nth=%d'%k); pg.click('[data-acao="entrar-sala"]')
        pg.wait_for_selector('[data-acao="dia"]'); jogar(pg,dia); enviar(pg,k+1)
    prof2.wait_for_function("document.querySelectorAll('.card-aluno.enviou').length==7")
    prof2.click('[data-acao="prof-vista"][data-v="turma"]'); prof2.wait_for_selector('.cena-turma'); prof2.wait_for_timeout(500)
    prof2.screenshot(path='/tmp/n_turma_livre.png')
    print('abas:', [t.inner_text().replace('\n',' ') for t in prof2.query_selector_all('.prof-dias .aba')], 'overflow:', prof2.evaluate('document.documentElement.scrollWidth > innerWidth'))
    print('ERROS', erros); b.close()
