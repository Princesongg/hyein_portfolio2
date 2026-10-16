
export default function initKeywordStack(stackRef) {
  const stack = stackRef;
  const keywords = stack.querySelector('.con2');
  const scroller = stack.closest('.portfolio-scroll');
  const introduction = stack.querySelector('.con3');
  let frame = 0;
  const updateDim = () => {
   frame = 0;
   const viewport = scroller.getBoundingClientRect();
   const top = introduction.getBoundingClientRect().top - viewport.top;
   const progress = Math.max(0, Math.min(1, 1 - top / scroller.clientHeight));
   stack.style.setProperty('--keywords-dim', String(progress * .5));
  };
  const scheduleDim = () => {
   if (!frame) frame = requestAnimationFrame(updateDim);
  };
  const update = () => {
   stack.style.setProperty('--keywords-pin-top',
    Math.min(0, scroller.clientHeight - keywords.offsetHeight) + 'px');
   scheduleDim();
  };
  const observer = new ResizeObserver(update);
  observer.observe(keywords);
  observer.observe(scroller);
  scroller.addEventListener('scroll', scheduleDim, { passive: true });
  update();
  return () => {
   observer.disconnect();
   scroller.removeEventListener('scroll', scheduleDim);
   cancelAnimationFrame(frame);
  };
}
