import { gsap } from 'gsap';
export default function initBracketReveal(ref) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const root = ref;
   const word = root.querySelector('.bracket-word');
   const letters = Array.from(root.querySelectorAll('.bracket-character'));
   const widths = letters.map(letter => letter.getBoundingClientRect().width);
   const timeline = gsap.timeline({paused:true});
   gsap.set(letters, {autoAlpha:0});
   gsap.set(word, {width:0});
   let width = 0;
   letters.forEach((letter,index) => {
    width += widths[index];
    const time = .55 + index * .145;
    timeline.to(word, {width,duration:.11,ease:'power1.out'}, time);
    timeline.set(letter, {autoAlpha:1}, time + .055);
   });
   timeline.set(word, {width:'auto'}, '>');
   const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
     timeline.play();
     observer.disconnect();
    }
   }, {root:root.closest('.portfolio-scroll'),threshold:.8});
   observer.observe(root);
   return () => observer.disconnect();
  }, ref);
  return () => media.revert();
}
