import { PARADAS } from './content/viagem.js';
import { esc } from './views/metro.js';

const asset = name => new URL(`../assets/${name}`, import.meta.url).href;
// Scenic illustrations, not anatomical maps. Team colours belong to the cockpit only.
export const SCENES = [
  { world:'air', image:'alveolos-viagem.webp', region:'VIAS AÉREAS', mission:'Acompanhe o ar até a região de troca.', note:'Aproximação dos alvéolos · visão ilustrativa', position:'48% 50%' },
  { world:'alveolus', image:'alveolos-viagem.webp', region:'ESPAÇO ALVEOLAR', mission:'Observe o encontro entre ventilação e perfusão.', note:'Dentro do alvéolo · as hemácias permanecem nos capilares', position:'60% 48%' },
  { world:'barrier', image:'alveolos-viagem.webp', region:'INTERFACE ALVÉOLO–SANGUE', mission:'Siga o O₂ que difunde pela barreira.', note:'Mudança de escala · a cápsula é um recurso de exploração', position:'20% 60%' },
  { world:'blood', image:'hemacias.webp', region:'CAPILAR PULMONAR', mission:'Acompanhe a captação de O₂ pelo sangue.', note:'A hemácia permanece dentro do vaso', position:'40% 50%' },
  { world:'blood', image:'hemacias.webp', region:'TRANSPORTE ARTERIAL', mission:'Investigue o transporte pela hemoglobina.', note:'Sangue oxigenado · segue pelas veias pulmonares ao coração esquerdo', position:'65% 42%' },
  { world:'heart', image:'coracao-viagem.webp', region:'CORAÇÃO ESQUERDO', mission:'Relacione o bombeamento ao fluxo de sangue.', note:'Percurso: veias pulmonares → átrio esquerdo → ventrículo esquerdo → aorta', position:'25% 60%' },
  { world:'arteriole', image:'hemacias.webp', region:'DISTRIBUIÇÃO DO FLUXO', mission:'Observe como o fluxo chega aos tecidos.', note:'Das artérias às arteríolas e aos capilares musculares', position:'80% 50%' },
  { world:'cell', image:'tecido-viagem.webp', region:'INTERIOR DA CÉLULA MUSCULAR', mission:'Acompanhe o O₂ até sua utilização na mitocôndria.', note:'Mudança de escala · O₂ difunde para a célula; hemácias ficam no capilar', position:'50% 50%' },
  { world:'venous', image:'hemacias.webp', region:'RETORNO VENOSO', mission:'Compare o sangue que chega com o que retorna.', note:'Agora seguimos o sangue venoso · o O₂ utilizado não retorna como O₂', position:'35% 45%' }
];
export function renderCabin(index = 0, { compact = false, label = 'EXPLORAÇÃO DO CORPO' } = {}) {
  const i = Math.max(0, Math.min(8, index)), s = SCENES[i], p = PARADAS[i];
  return `<section class="voyage-cabin ${compact ? 'compact' : ''}" data-scene="${i}" data-world="${s.world}" aria-label="Janela da cápsula: ${esc(p.titulo)}">
    <div class="cabin-window" aria-hidden="true"><img class="cabin-landscape" src="${asset(s.image)}" alt="" decoding="async" loading="lazy" style="object-position:${s.position}"><div class="cabin-depth"></div><div class="cabin-particles">${Array.from({length:10},(_,n)=>`<i style="--x:${Math.round(Math.cos(n*2.4)*650)}%;--y:${Math.round(Math.sin(n*2.4)*500)}%;--delay:${n*-.29}s"></i>`).join('')}</div><div class="cabin-reticle"></div></div>
    <div class="cabin-frame" aria-hidden="true"><i></i><i></i></div>
    <header class="cabin-hud"><div><span class="cabin-kicker">${esc(label)}</span><b>${s.region}</b></div><span class="cabin-coordinate">${String(i+1).padStart(2,'0')}<small> / 09</small></span></header>
    <div class="cabin-destination"><span class="cabin-status" role="status">Você está em</span><h2>${p.titulo}</h2><p>${s.mission}</p></div>
    <footer class="cabin-console"><div class="cabin-route" aria-label="Parada ${i+1} de 9">${PARADAS.map((_,k)=>`<i class="${k<=i?'visited':''}" ${k===i?'aria-current="step"':''}></i>`).join('')}</div><div class="cabin-buttons"><button type="button" data-cabin="skip" hidden>Pular viagem</button><button type="button" data-cabin="motion" aria-pressed="false">Reduzir movimento</button></div><p class="cabin-note">${s.note}</p></footer>
  </section>`;
}
let initialized = false;
let preference = false;
const media = () => window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => preference || media().matches;
function arrive(cabin) {
  cabin.classList.remove('travelling');
  cabin.querySelector('.cabin-status').textContent = 'Você chegou';
  cabin.querySelector('[data-cabin="skip"]').hidden = true;
}
function updateMotion() {
  document.documentElement.classList.toggle('voyage-still', reduced());
  for (const c of document.querySelectorAll('.voyage-cabin')) {
    const b = c.querySelector('[data-cabin="motion"]');
    b.setAttribute('aria-pressed', String(reduced()));
    b.textContent = reduced() ? 'Movimento reduzido' : 'Reduzir movimento';
    if (reduced()) arrive(c);
  }
}
export function initJourneys() {
  if (initialized) return;
  initialized = true;
  try { preference = localStorage.getItem('o2-motion-reduced') === '1'; } catch {}
  media().addEventListener('change', updateMotion);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cabin]');
    if (!b) return;
    if (b.dataset.cabin === 'skip') arrive(b.closest('.voyage-cabin'));
    else { preference = !reduced(); try { localStorage.setItem('o2-motion-reduced', preference ? '1' : '0'); } catch {} updateMotion(); }
  });
  document.addEventListener('animationend', e => {
    if (e.animationName === 'cabin-arrival') arrive(e.target.closest('.voyage-cabin'));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelectorAll('.voyage-cabin.travelling').forEach(arrive);
  });
  updateMotion();
}
export function activateJourneys(root) {
  initJourneys();
  for (const c of root.querySelectorAll('.voyage-cabin:not([data-ready])')) {
    c.dataset.ready = 'true';
    // Wait for the actual landscape, and do not animate offscreen simulated phones.
    const depart = () => {
      if (!c.isConnected) return;
      const r = c.getBoundingClientRect();
      if (!reduced() && r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) {
        c.classList.add('travelling');
        c.querySelector('.cabin-status').textContent = 'Em viagem · aproximando de';
        c.querySelector('[data-cabin="skip"]').hidden = false;
      }
    };
    const picture = c.querySelector('img');
    if (picture.complete) depart(); else picture.addEventListener('load', depart, {once:true});
  }
  updateMotion();
}
// Keep the same cockpit node when responses redraw the surrounding activity.
export function retainJourneys(root) {
  const previous = [...root.querySelectorAll('.voyage-cabin')];
  return () => {
    for (const c of root.querySelectorAll('.voyage-cabin')) {
      const old = previous.find(p => p.dataset.scene === c.dataset.scene && p.classList.contains('compact') === c.classList.contains('compact'));
      if (old) c.replaceWith(old);
    }
    activateJourneys(root);
  };
}
