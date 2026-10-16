
export default function initTeamHorizontal(ref, prefix = 'team-story') {
  const root = ref;
  const scroller = root.closest('.portfolio-scroll');
  const track = root.querySelector('.' + prefix + '-track');
  const rows = [...track.children];
  const media = window.matchMedia(prefix === 'ux-process' ? '(prefers-reduced-motion: reduce), (max-width: 900px)' : '(prefers-reduced-motion: reduce)');
  let frame = 0;
  let distance = 0;
  const update = () => {
   frame = 0;
   if (media.matches) return;
   const offset = scroller.getBoundingClientRect().top - root.getBoundingClientRect().top;
   const index = Math.round(Math.max(0, Math.min(distance, offset)) / scroller.clientWidth);
   root.querySelectorAll('.' + prefix + '-chapters button').forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
   });
   track.style.transform = `translate3d(${-Math.max(0, Math.min(distance, offset))}px,0,0)`;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => {
   root.dataset.horizontal = String(!media.matches);
   track.style.transform = '';
   root.style.removeProperty('--story-stage-height');
   if (media.matches) { root.style.removeProperty('--story-distance'); return; }
   // Measure the content before constraining the panels to the sticky stage.
   // This includes bottom padding that keeps content above the page footer.
   root.dataset.horizontal = 'false';
   const stageHeight = Math.max(scroller.clientHeight, ...rows.map(row => Math.max(row.offsetHeight, row.scrollHeight)));
   distance = Math.max(0, track.scrollWidth - scroller.clientWidth);
   root.style.setProperty('--story-stage-height', `${stageHeight}px`);
   root.style.setProperty('--story-distance', `${distance}px`);
   root.dataset.horizontal = 'true';
   schedule();
  };
  const onKey = event => {
   if (media.matches || event.target !== root.querySelector('.' + prefix + '-stage')) return;
   if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
   event.preventDefault();
   const start = scroller.scrollTop + root.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   const next = scroller.scrollTop + (event.key === 'ArrowRight' ? 1 : -1) * scroller.clientWidth;
   scroller.scrollTo({top:Math.max(start,Math.min(start + distance,next)),behavior:'smooth'});
  };
  const observer = new ResizeObserver(measure);
  observer.observe(scroller);
  root.addEventListener('load', measure, true);
  root.addEventListener('keydown', onKey);
  scroller.addEventListener('scroll', schedule, {passive:true});
  media.addEventListener('change', measure);
  measure();
  return () => {
   cancelAnimationFrame(frame);
   observer.disconnect();
   root.removeEventListener('load', measure, true);
   root.removeEventListener('keydown', onKey);
   scroller.removeEventListener('scroll', schedule);
   media.removeEventListener('change', measure);
   track.style.transform = '';
   delete root.dataset.horizontal;
   root.style.removeProperty('--story-stage-height');
   root.style.removeProperty('--story-distance');
  };
}
