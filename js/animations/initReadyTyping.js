import {gsap} from 'gsap';

export default function initReadyTyping(section) {
 if (!section) return;
 const lines = [...section.querySelectorAll('[data-ready-line]')];
 lines.forEach(line => {
  const characters = Array.from(line.textContent, text => {
   const character = document.createElement('span');
   character.className = 'contact-ready-character';
   character.textContent = text;
   return character;
  });
  line.replaceChildren(...characters);
 });
 const media = gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)', () => {
  const characters = section.querySelectorAll('.contact-ready-character');
  const photoLayers = [...section.querySelectorAll('.contact-ready-photo-layer')];
  const photos = section.querySelector('.contact-ready-photos');
  const scroller = section.closest('.portfolio-scroll');
  gsap.set(characters, {opacity:0});
  gsap.set(photoLayers, {autoAlpha:0,y:30,scale:.97,rotation:index=>index===0?-3:3,transformOrigin:'50% 70%'});
  const photoTimeline = gsap.timeline({paused:true});
  photoLayers.forEach((photo,index) => {
   photoTimeline.to(photo, {autoAlpha:1,y:0,scale:1,rotation:0,duration:.85,ease:'power2.out'}, index*1.15);
  });
  let photosVisible = false;
  let photosReady = false;
  const startPhotos = () => {
   if (photosVisible && photosReady) {
    photoTimeline.play();
   }
  };
  const photoObserver = new IntersectionObserver(entries => {
   photosVisible = entries.some(entry => entry.isIntersecting);
   startPhotos();
  }, {root:scroller,threshold:.15});
  if (photos) photoObserver.observe(photos);
  let cursor = null;
  const moveCursor = character => {
   cursor?.classList.remove('is-typing-cursor');
   cursor = character;
   cursor?.classList.add('is-typing-cursor');
  };
  const timeline = gsap.timeline({paused:true});
  let time = 0;
  lines.forEach((line, index) => {
   [...line.children].forEach(character => {
    timeline.set(character, {opacity:1}, time);
    timeline.call(() => moveCursor(character), [], time);
    time += (index < 2 ? .085 : .045) + (/[,，.]/.test(character.textContent) ? .16 : 0);
   });
   if (index===0) timeline.call(() => {photosReady=true;startPhotos();}, [], time);
   time += .25;
  });
  timeline.call(() => moveCursor(null), [], time + .3);
  let playing = false;
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (!entry.isIntersecting) {
     playing = false;
     timeline.pause(0);
     photoTimeline.pause(0);
     photosReady = false;
     moveCursor(null);
     gsap.set(characters, {opacity:0});
    } else if (entry.intersectionRatio >= .35 && !playing) {
     playing = true;
     timeline.restart();
    }
   });
  }, {root:scroller, threshold:[0,.35]});
  observer.observe(section);
  return () => {observer.disconnect();photoObserver.disconnect();moveCursor(null);timeline.kill();photoTimeline.kill();};
 }, section);
 return () => media.revert();
}
