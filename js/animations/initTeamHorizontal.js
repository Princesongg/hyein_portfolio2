
export default function initTeamHorizontal(ref, prefix = 'team-story') {
  const root = ref;
  const scroller = root.closest('.portfolio-scroll');
  const track = root.querySelector('.' + prefix + '-track');
  const rows = [...track.children];
  const buttons = [...root.querySelectorAll('.' + prefix + '-chapters button')];
  const media = window.matchMedia(prefix === 'ux-process' ? '(prefers-reduced-motion: reduce), (max-width: 900px)' : '(prefers-reduced-motion: reduce)');
  let frame = 0;
  let measureFrame = 0;
  let distance = 0;
  let hold = 0;
  let travel = 0;
  let activeIndex = -1;
  let previousOffset = -1;
  const update = () => {
   frame = 0;
   if (media.matches) return;
   const offset = scroller.getBoundingClientRect().top - root.getBoundingClientRect().top;
   const clampedOffset = Math.max(0, Math.min(travel, offset - hold));
   const index = Math.round(clampedOffset / scroller.clientWidth);
   if (index !== activeIndex) buttons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
   });
   activeIndex = index;
   if (clampedOffset !== previousOffset) track.style.transform = `translate3d(${-clampedOffset}px,0,0)`;
   previousOffset = clampedOffset;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => {
   activeIndex = -1;
   previousOffset = -1;
   root.dataset.horizontal = String(!media.matches);
   track.style.transform = '';
   root.style.removeProperty('--story-stage-height');
   if (media.matches) { root.style.removeProperty('--story-distance'); return; }
   // Measure the content before constraining the panels to the sticky stage.
   // This includes bottom padding that keeps content above the page footer.
   root.dataset.horizontal = 'false';
   const stageHeight = Math.max(scroller.clientHeight, ...rows.map(row => Math.max(row.offsetHeight, row.scrollHeight)));
   travel = Math.max(0, track.scrollWidth - scroller.clientWidth);
   hold = prefix === 'role-story' ? scroller.clientHeight * .65 : 0;
   distance = travel + hold * 2;
   root.style.setProperty('--story-hold', `${hold}px`);
   root.style.setProperty('--story-stage-height', `${stageHeight}px`);
   root.style.setProperty('--story-distance', `${distance}px`);
   root.dataset.horizontal = 'true';
   // Restore the current translation before the browser paints the measured layout.
   cancelAnimationFrame(frame);
   update();
  };
  const scheduleMeasure = () => {
   if (!measureFrame) measureFrame = requestAnimationFrame(() => {
    measureFrame = 0;
    measure();
   });
  };
  const onKey = event => {
   if (media.matches || event.target !== root.querySelector('.' + prefix + '-stage')) return;
   if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
   event.preventDefault();
   const start = scroller.scrollTop + root.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   const nextIndex = Math.max(0,Math.min(rows.length - 1,activeIndex + (event.key === 'ArrowRight' ? 1 : -1)));
   const next = start + hold + nextIndex * scroller.clientWidth;
   scroller.scrollTo({top:Math.max(start,Math.min(start + distance,next)),behavior:'smooth'});
  };
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(scroller);
  root.addEventListener('load', scheduleMeasure, true);
  root.addEventListener('keydown', onKey);
  scroller.addEventListener('scroll', schedule, {passive:true});
  media.addEventListener('change', measure);
  measure();
  // Font metrics can change panel heights after the first layout.
  document.fonts.addEventListener('loadingdone', scheduleMeasure);
  return () => {
   cancelAnimationFrame(frame);
   cancelAnimationFrame(measureFrame);
   observer.disconnect();
   root.removeEventListener('load', scheduleMeasure, true);
   document.fonts.removeEventListener('loadingdone', scheduleMeasure);
   root.removeEventListener('keydown', onKey);
   scroller.removeEventListener('scroll', schedule);
   media.removeEventListener('change', measure);
   track.style.transform = '';
   delete root.dataset.horizontal;
   root.style.removeProperty('--story-stage-height');
   root.style.removeProperty('--story-distance');
   root.style.removeProperty('--story-hold');
  };
}
