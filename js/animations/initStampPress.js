
export default function initStampPress(artRef) {
  const art = artRef;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) return;
  art.dataset.stampState = 'waiting';
  const observer = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting)) {
    art.dataset.stampState = 'pressed';
    observer.disconnect();
   }
  }, { root: art.closest('.portfolio-scroll'), threshold: .65 });
  const reduceMotion = () => {
   if (media.matches) {
    delete art.dataset.stampState;
    observer.disconnect();
   }
  };
  observer.observe(art);
  media.addEventListener('change', reduceMotion);
  return () => {
   observer.disconnect();
   media.removeEventListener('change', reduceMotion);
   delete art.dataset.stampState;
  };
}
