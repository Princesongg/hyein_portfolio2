import {gsap} from 'gsap';

export default function initKeywordCards(section) {
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const title=section.querySelector('.con2-title');
  const grid=section.querySelector('.con2-grid');
  const cards=[...grid.querySelectorAll('.con2-card')];
  // Keep the final layout fixed while its visible edge opens from left to right.
  gsap.set([title,grid],{clipPath:'inset(0 100% 0 0)'});
  gsap.set(title,{x:-14});
  const content=cards.map(card=>[...card.querySelectorAll('.con2-number,.con2-card-heading,.con2-description')]);
  gsap.set(content.flat(),{x:-18,opacity:0});
  grid.style.pointerEvents='none';
  const timeline=gsap.timeline({paused:true,onComplete:()=>{
   gsap.set([title,grid],{clearProps:'clipPath'});
   gsap.set([title,...content.flat()],{clearProps:'transform,opacity'});
   grid.style.pointerEvents='';
  }});
  timeline.to(title,{clipPath:'inset(0 0% 0 0)',x:0,duration:1.05,ease:'power3.inOut'},0);
  timeline.to(grid,{clipPath:'inset(0 0% 0 0)',duration:1.45,ease:'power3.inOut'},.18);
  content.forEach((elements,index)=>{
   timeline.to(elements,{x:0,opacity:1,duration:.8,stagger:.09,ease:'power3.out'},.42+index*.25);
  });
  let started=false;
  const reveal=()=>{
   if(started) return;
   started=true;observer.disconnect();timeline.play();
  };
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)) reveal();
  },{root:section.closest('.portfolio-scroll'),rootMargin:'0px 0px -18% 0px',threshold:.2});
  observer.observe(section);
  // Keyboard users can enter any column without waiting behind the reveal mask.
  const revealOnFocus=()=>{reveal();timeline.progress(1);};
  grid.addEventListener('focusin',revealOnFocus);
  return ()=>{
   observer.disconnect();timeline.kill();
   grid.removeEventListener('focusin',revealOnFocus);
   grid.style.removeProperty('pointer-events');
  };
 },section);
 return ()=>media.revert();
}
