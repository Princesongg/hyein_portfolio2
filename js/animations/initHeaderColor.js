
export default function initHeaderColor(rootRef) {
  const root = rootRef;
  const scroller = root.querySelector('.portfolio-scroll');
  const header = root.querySelector('.portfolio-header');
  const projects = root.querySelector('.work-projects');
  const sections = [...scroller.querySelectorAll('section')].reverse();
  let frame = 0;

  const update = () => {
   frame = 0;
   const projectTop = projects.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   header.classList.toggle('portfolio-header--raised', projectTop <= scroller.clientHeight * .0583 + header.offsetHeight);
   const backgroundOf = element => {
    for (let node = element; node; node = node.parentElement) {
     const color = getComputedStyle(node).backgroundColor;
     if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color;
    }
    return '';
   };
   const rect = header.getBoundingClientRect();
   const y = rect.top + rect.height / 2;
   const section = sections.find(section => {
    const area = section.getBoundingClientRect();
    return y >= area.top && y < area.bottom;
   });
   const channels = backgroundOf(section || root).match(/[\d.]+/g)?.map(Number);
   const theme = channels && channels[2] - channels[0] > 10 ? 'B' : 'P';
   if (header.dataset.theme !== theme) header.dataset.theme = theme;
  };
  const schedule = () => {
   if (!frame) frame = requestAnimationFrame(update);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(root);
  observer.observe(scroller.querySelector('.hero'));
  scroller.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  return () => {
   cancelAnimationFrame(frame);
   header.classList.remove('portfolio-header--raised');
   observer.disconnect();
   scroller.removeEventListener('scroll', schedule);
   window.removeEventListener('resize', schedule);
  };
}
