export default function initPersonalBackground(section, options = {}) {
 const scroller = section.closest('.portfolio-scroll');
 const previous = scroller.querySelector(options.previousSelector || '.ux-process');
 const surfaces = [previous, section].filter(Boolean);
 const media = window.matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0;
 const property = options.property || '--personal-scroll-background';
 const colors = options.colors || {};
 const clear = () => surfaces.forEach(surface => {
  surface.style.removeProperty(property);
  Object.keys(colors).forEach(name => surface.style.removeProperty(name));
 });
 const update = () => {
  frame = 0;
  if (media.matches) { clear(); return; }
  const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
  const progress = Math.max(0, Math.min(1, (scroller.clientHeight - top) / (scroller.clientHeight * .75)));
  const eased = progress * progress * (3 - 2 * progress);
  const from = options.from || [238, 227, 225];
  const to = options.to || [210, 222, 235];
  const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * eased));
  surfaces.forEach(surface => {
   surface.style.setProperty(property, `rgb(${channels.join(',')})`);
   Object.entries(colors).forEach(([name, [start, end]]) => {
    const values = start.map((channel, index) => Math.round(channel + (end[index] - channel) * eased));
    surface.style.setProperty(name, `rgb(${values.join(',')})`);
   });
  });
 };
 const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
 const observer = new ResizeObserver(schedule);
 observer.observe(scroller);
 surfaces.forEach(surface => observer.observe(surface));
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
