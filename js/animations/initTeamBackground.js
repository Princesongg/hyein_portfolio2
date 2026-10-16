
export default function initTeamBackground(sectionRef) {
  const section = sectionRef;
  const scroller = section.closest('.portfolio-scroll');
  const preview = scroller.querySelector('.work-projects');
  const start = scroller.querySelector('.team-start');
  const surfaces = [preview, start, section].filter(Boolean);
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const clear = () => surfaces.forEach(element => element.style.removeProperty('--work-background'));
  const update = () => {
   frame = 0;
   if (media.matches) { clear(); return; }
   const top = (start || section).getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   const height = scroller.clientHeight;
   const entry = height * .75;
   const distance = entry + (start?.offsetHeight || 0);
   const position = Math.max(0, Math.min(distance, height - top));
   const firstHalf = position <= entry;
   const progress = firstHalf ? position / entry : (position - entry) / (distance - entry);
   const eased = progress * progress * (3 - 2 * progress);
   const from = firstHalf ? [175, 186, 203] : [237, 225, 223];
   const to = firstHalf ? [237, 225, 223] : [248, 244, 241];
   const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * eased));
   const color = `rgb(${channels.join(',')})`;
   surfaces.forEach(element => element.style.setProperty('--work-background', color));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  observer.observe(scroller);
  observer.observe(preview);
  if (start) observer.observe(start);
  scroller.addEventListener('scroll', schedule, {passive:true});
  media.addEventListener('change', schedule);
  update();
  return () => {
   cancelAnimationFrame(frame);
   observer.disconnect();
   scroller.removeEventListener('scroll', schedule);
   media.removeEventListener('change', schedule);
   clear();
  };
}
