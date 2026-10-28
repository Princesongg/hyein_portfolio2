export default function initReadyApproach(root) {
 if (!root) return;
 const section = root.closest('.contact-ready');
 const layout = section.querySelector('.contact-ready-layout');
 const scroller = section.closest('.portfolio-scroll');
 const portfolio = section.closest('.portfolio');
 const buttons = [...root.querySelectorAll('.ready-approach-option')];
 const descriptions = buttons.map(button => root.querySelector('#' + button.getAttribute('aria-controls')));
 const status = root.querySelector('.ready-approach-status');
 const wide = matchMedia('(min-width:961px)');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let active = 0, scrolling = false, distance = 0, stickyTop = 0;
 let frame = 0, measureFrame = 0, disposed = false;
 const expose = () => descriptions.forEach((description, index) => {
  const hidden = scrolling && index !== active;
  description.classList.toggle('is-selected', index === active);
  description.setAttribute('aria-hidden', String(hidden));
  description.inert = hidden;
 });
 const select = (index, announce = false) => {
  active = index;
  buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  expose();
  // Scroll changes stay quiet; explicit keyboard/click choices are announced.
  if (announce) status.textContent = `${buttons[index].querySelector('.ready-approach-word').textContent}. ${descriptions[index].textContent}`;
 };
 const offset = () => scroller.getBoundingClientRect().top + stickyTop - section.getBoundingClientRect().top;
 const update = () => {
  frame = 0;
  if (!scrolling) return;
  const position = offset();
  const step = distance / buttons.length;
  let next = active;
  // A small dead band prevents trackpad jitter at either boundary.
  while (next < buttons.length - 1 && position > (next + 1) * step + 12) next++;
  while (next > 0 && position < next * step - 12) next--;
  if (next !== active) select(next);
 };
 const schedule = () => { if (scrolling && !frame) frame = requestAnimationFrame(update); };
 const measure = () => {
  measureFrame = 0;
  if (disposed) return;
  scrolling = wide.matches && !reduced.matches;
  section.dataset.approachMode = scrolling ? 'scroll' : 'expanded';
  section.style.removeProperty('--ready-scroll-height');
  section.style.removeProperty('--ready-sticky-top');
  if (scrolling) {
   const clearance = parseFloat(getComputedStyle(portfolio).getPropertyValue('--header-clearance')) || 86;
   const height = scroller.clientHeight;
   const contentHeight = layout.getBoundingClientRect().height;
   // If the full composition cannot fit, use natural flow and show every copy.
   scrolling = contentHeight + clearance + 24 <= height;
   if (scrolling) {
    stickyTop = Math.max(clearance + 12, (height - contentHeight) / 2);
    distance = Math.min(660, Math.max(420, height * .65));
    section.style.setProperty('--ready-scroll-height', `${contentHeight + distance}px`);
    section.style.setProperty('--ready-sticky-top', `${stickyTop}px`);
    const index = Math.max(0, Math.min(buttons.length - 1, Math.floor(offset() / (distance / buttons.length))));
    select(index);
   }
  }
  if (!scrolling) {
   section.dataset.approachMode = 'expanded';
   select(active);
  }
 };
 const scheduleMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure); };
 const choose = event => {
  const button = event.target.closest('.ready-approach-option');
  const index = buttons.indexOf(button);
  if (index >= 0) select(index, true);
 };
 const onKey = event => {
  const index = buttons.indexOf(event.target);
  if (index < 0 || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus({preventScroll:true});
 };
 const resize = new ResizeObserver(scheduleMeasure);
 resize.observe(scroller);
 scroller.addEventListener('scroll', schedule, {passive:true});
 portfolio.addEventListener('viewport-layout', scheduleMeasure);
 document.fonts.addEventListener('loadingdone', scheduleMeasure);
 root.addEventListener('click', choose);
 root.addEventListener('focusin', choose);
 root.addEventListener('keydown', onKey);
 wide.addEventListener('change', scheduleMeasure);
 reduced.addEventListener('change', scheduleMeasure);
 measure();
 return () => {
  disposed = true;
  cancelAnimationFrame(frame);cancelAnimationFrame(measureFrame);
  resize.disconnect();
  scroller.removeEventListener('scroll', schedule);
  portfolio.removeEventListener('viewport-layout', scheduleMeasure);
  document.fonts.removeEventListener('loadingdone', scheduleMeasure);
  root.removeEventListener('click', choose);root.removeEventListener('focusin', choose);root.removeEventListener('keydown', onKey);
  wide.removeEventListener('change', scheduleMeasure);reduced.removeEventListener('change', scheduleMeasure);
  delete section.dataset.approachMode;
  section.style.removeProperty('--ready-scroll-height');section.style.removeProperty('--ready-sticky-top');
  scrolling = false;expose();status.textContent = '';
 };
}
