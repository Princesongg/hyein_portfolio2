import { gsap } from 'gsap';
export default function initKeywordCards(sectionRef) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const section = sectionRef;
   const cards = Array.from(section.querySelectorAll('.con2-card-reveal'));
   gsap.set(cards, {y:64,autoAlpha:0});
   const animations = cards.map((card,index) => gsap.to(card, {
    y:0,autoAlpha:1,duration:.95,delay:index*.12,ease:'power3.out',paused:true,
   }));
   const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
     if (!entry.isIntersecting) return;
     animations[cards.indexOf(entry.target)].play();
     observer.unobserve(entry.target);
    });
   }, {root:section.closest('.portfolio-scroll'),threshold:.15});
   cards.forEach(card => observer.observe(card));
   return () => observer.disconnect();
  }, sectionRef);
  return () => media.revert();
}
