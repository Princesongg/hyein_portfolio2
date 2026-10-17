export default function initNeonHero(root) {
 const hero = root.querySelector('.neon-hero');
 const scroller = root.querySelector('.portfolio-scroll');
 const media = matchMedia('(prefers-reduced-motion: reduce)');
 const pointer = matchMedia('(pointer: fine) and (min-width: 901px)');
 let frame = 0;
 const update = () => {
  frame = 0;
  const visible = scroller.scrollTop < hero.offsetHeight;
  hero.querySelector('.neon-float').style.animationPlayState = visible && !media.matches ? 'running' : 'paused';
  hero.style.setProperty('--neon-scroll', media.matches || !pointer.matches ? '0px' : `${Math.min(scroller.scrollTop,hero.offsetHeight)*.12}px`);
 };
 const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
 const move = event => {
  if (media.matches || !pointer.matches) return;
  const rect = hero.getBoundingClientRect();
  hero.style.setProperty('--neon-x',`${(event.clientX / rect.width - .5)*14}px`);
  hero.style.setProperty('--neon-y',`${((event.clientY-rect.top) / rect.height - .5)*10}px`);
 };
 const navigate = event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({behavior:media.matches ? 'instant' : 'smooth',block:'start'});
  history.replaceState(null,'',link.hash);
 };
 hero.addEventListener('click',navigate);
 const reset = () => {hero.style.setProperty('--neon-x','0px');hero.style.setProperty('--neon-y','0px');};
 hero.addEventListener('pointermove',move);
 hero.addEventListener('pointerleave',reset);
 scroller.addEventListener('scroll',scroll,{passive:true});
 media.addEventListener('change',scroll);
 update();
 return () => { cancelAnimationFrame(frame);hero.removeEventListener('click',navigate);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);scroller.removeEventListener('scroll',scroll);media.removeEventListener('change',scroll); };
}
