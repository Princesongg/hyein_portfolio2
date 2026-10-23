import { gsap } from 'gsap';

export default function initCon1Typing(copyRef) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const copy = copyRef;
   const chars = copy.querySelectorAll('h2 .con1-character');
   const koreanLines = copy.querySelectorAll('.con1-statement .con1-typing-line, .con1-description .con1-typing-line');
   gsap.set(koreanLines, {y:24, autoAlpha:0});
   gsap.set(chars, {autoAlpha:0});
   let currentCursor = null;
   const setCursor = char => {
    currentCursor?.classList.remove('is-typing-cursor');
    currentCursor = char;
    currentCursor?.classList.add('is-typing-cursor');
   };
   const timeline = gsap.timeline({paused:true});
   let time = 0;
   copy.querySelectorAll('h2 .con1-typing-line').forEach(line => {
    const interval = .035;
    Array.from(line.querySelectorAll('.con1-character')).forEach((char,charIndex) => {
     timeline.set(char, {autoAlpha:1}, time);
     timeline.call(() => setCursor(char), [], time);
     // Small pauses around punctuation make the typing feel less mechanical.
     time += interval + (/[，,。.]/.test(char.textContent) ? .09 : charIndex % 7 === 5 ? .02 : 0);
    });
    time += .2;
   });
   timeline.call(() => setCursor(null), [], time + .35);
   timeline.to(koreanLines, {y:0, autoAlpha:1, duration:.85, stagger:.14, ease:'power3.out'}, time + .1);
   const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
     timeline.play(0);
     observer.disconnect();
    }
   }, {root:copy.closest('.portfolio-scroll'),threshold:.25});
   observer.observe(copy.querySelector('h2'));
   return () => {observer.disconnect();setCursor(null);};
  }, copyRef);
  return () => media.revert();
}
