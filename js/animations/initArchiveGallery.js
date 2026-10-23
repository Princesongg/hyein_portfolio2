export default function initArchiveGallery(section) {
 const stage = section.querySelector('.archive-gallery-stage');
 const cards = [...stage.children];
 const buttons = [...section.querySelectorAll('[data-archive-direction]')];
 const count = section.querySelector('.archive-gallery-count');
 let index = 0;
 let timer;
 const update = () => {
  count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  buttons[0].disabled = index === 0;
  buttons[1].disabled = index === cards.length - 1;
 };
 const go = next => {
  index = Math.max(0,Math.min(cards.length - 1,next));
  update();
  stage.scrollTo({left:index * stage.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  const scroller = section.closest('.portfolio-scroll');
  if (scroller && section.getBoundingClientRect().top < scroller.getBoundingClientRect().top) {
   scroller.scrollTo({top:scroller.scrollTop + section.getBoundingClientRect().top - scroller.getBoundingClientRect().top,behavior:'instant'});
  }
 };
 const onClick = event => {
  const button = event.target.closest('[data-archive-direction]');
  if (button) go(index + Number(button.dataset.archiveDirection));
 };
 const onKey = event => {
  if (event.target !== stage || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  go(index + (event.key === 'ArrowRight' ? 1 : -1));
 };
 const onScroll = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
   index = Math.round(stage.scrollLeft / stage.clientWidth);
   update();
  },150);
 };
 const observer = new ResizeObserver(() => stage.scrollTo({left:index * stage.clientWidth,behavior:'instant'}));
 observer.observe(stage);
 section.addEventListener('click',onClick);
 stage.addEventListener('keydown',onKey);
 stage.addEventListener('scroll',onScroll,{passive:true});
 update();
 return () => {
  clearTimeout(timer);
  observer.disconnect();
  section.removeEventListener('click',onClick);
  stage.removeEventListener('keydown',onKey);
  stage.removeEventListener('scroll',onScroll);
 };
}
