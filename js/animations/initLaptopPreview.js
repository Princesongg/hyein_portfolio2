export default function initLaptopPreview(video) {
 if (!video) return;
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false;
 const update=()=>{
  if (!visible || document.hidden || media.matches) {
   video.pause();
   return;
  }
  const source=video.querySelector('source');
  if (!source.hasAttribute('src')) {
   source.src=source.dataset.src;
   video.load();
  }
  video.play().catch(()=>{});
 };
 const observer=new IntersectionObserver(entries=>{
  visible=entries.some(entry=>entry.isIntersecting);
  update();
 },{root:video.closest('.portfolio-scroll'),threshold:.15});
 observer.observe(video);
 media.addEventListener('change',update);
 document.addEventListener('visibilitychange',update);
 return ()=>{
  observer.disconnect();
  media.removeEventListener('change',update);
  document.removeEventListener('visibilitychange',update);
  video.pause();
 };
}
