import {gsap} from 'gsap';

export default function initKeywordCards(section) {
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const grid=section.querySelector('.con2-grid');
  gsap.set(grid,{clipPath:'inset(0 49.8% 0 49.8%)'});
  grid.style.pointerEvents='none';
  let started=false;
  const reveal=()=>{
   if(started)return;
   started=true;
   observer.disconnect();
   gsap.to(grid,{
    clipPath:'inset(0 0% 0 0%)',duration:1.15,ease:'power3.inOut',
    onComplete:()=>{grid.style.clipPath='none';grid.style.pointerEvents='';},
   });
  };
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting))reveal();
  },{root:section.closest('.portfolio-scroll'),rootMargin:'0px 0px -18% 0px',threshold:.2});
  observer.observe(section);
  grid.addEventListener('focusin',reveal);
  return ()=>{
   observer.disconnect();
   grid.removeEventListener('focusin',reveal);
   grid.style.removeProperty('pointer-events');
  };
 },section);
 return ()=>media.revert();
}
