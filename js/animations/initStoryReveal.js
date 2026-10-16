import { gsap } from 'gsap';
export default function initStoryReveal(ref) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const rows = [...ref.querySelectorAll('.team-story-row')];
   const animations = rows.map(row => gsap.fromTo(row.querySelectorAll('.team-story-copy,.team-story-visual'), {y:32,opacity:0}, {y:0,opacity:1,duration:.8,stagger:.1,ease:'power2.out',paused:true}));
   const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting) {animations[rows.indexOf(entry.target)].play();observer.unobserve(entry.target);}
   }), {root:ref.closest('.portfolio-scroll'),threshold:.15});
   rows.forEach(row => observer.observe(row));
   return () => observer.disconnect();
  }, ref);
  return () => media.revert();
}
