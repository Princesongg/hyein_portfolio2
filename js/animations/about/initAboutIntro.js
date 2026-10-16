import initWorkTyping from '../initWorkTyping.js';
export default function initAboutIntro(section) {
 const scroller = section.closest('.portfolio-scroll');
 const root = section.closest('.portfolio');
 const border = root.querySelector('.about-intro-frame');
 const header = root.querySelector('.portfolio-header');
 const media = window.matchMedia('(prefers-reduced-motion: reduce)');
 const cleanupTyping = initWorkTyping(section,{
  frameElement:border,
  subtitleSelector:'.about-intro-copy p',
  characterSelector:'.about-intro-character',
  distanceProperty:'--about-scroll-distance',
  preserveFrame:true,
 });
 let animation = 0;
 let current = 0;
 let lastTime = 0;
 const update = timestamp => {
  animation = 0;
  const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
  const entry = Math.max(0,Math.min(1,1-top/(scroller.clientHeight*.7)));
  const target = media.matches ? Number(top <= 0) : entry*entry*(3-2*entry);
  const elapsed = lastTime ? Math.min(64,timestamp-lastTime) : 16;
  current = media.matches ? target : current+(target-current)*(1-Math.exp(-elapsed/180));
  if (Math.abs(target-current)<.0001) current=target;
  border.style.opacity=String(current);
  const introHeaderTop=root.clientHeight*(window.innerWidth<=600 ? .05 : .0583);
  header.style.setProperty('--about-frame-header-offset',`${(introHeaderTop-20)*current}px`);
  border.style.transform=media.matches ? '' : `scale(${1+(1-current)*.015})`;
  lastTime=timestamp;
  if (current!==target) animation=requestAnimationFrame(update);
  else lastTime=0;
 };
 const schedule=()=>{if (!animation) animation=requestAnimationFrame(update);};
 const observer=new ResizeObserver(schedule);
 observer.observe(scroller);
 scroller.addEventListener('scroll',schedule,{passive:true});
 media.addEventListener('change',schedule);
 schedule();
 return ()=>{
  cleanupTyping();
  cancelAnimationFrame(animation);
  observer.disconnect();
  scroller.removeEventListener('scroll',schedule);
  media.removeEventListener('change',schedule);
  border.style.opacity='';
  border.style.transform='';
  header.style.removeProperty('--about-frame-header-offset');
 };
}
