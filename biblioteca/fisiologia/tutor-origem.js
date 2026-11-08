document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-voltar-tutor]').forEach(a=>{a.href='../../../bancadas.html#fisiologia';
 /* No logo, troca só o nome e preserva a imagem; nos demais links, troca o texto todo. */
 if(a.classList.contains('brand')){a.setAttribute('aria-label','Biblioteca LAB-RA');return;}
 a.textContent='Biblioteca LAB-RA';}));
