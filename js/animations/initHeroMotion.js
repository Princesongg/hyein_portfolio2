import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js';

gsap.registerPlugin(MotionPathPlugin);

export default function initHeroMotion(rootRef) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const root = rootRef;
   const select = selector => root.querySelector(selector);
   const plane = select('.plane');
   const timeline = gsap.timeline({ paused:true, defaults:{ease:'power3.out'} });
   let disposed = false;

   timeline
    .set(plane, {x:1200,y:-450,rotation:-16,autoAlpha:0})
    .set(select('.flight'), {clipPath:'inset(0% 0% 0% 100%)',autoAlpha:0})
    .to(plane, {autoAlpha:1,duration:.18}, .12)
    .to(plane, {
     motionPath:{path:[{x:1200,y:-450},{x:920,y:-300},{x:550,y:-70},{x:200,y:50},{x:0,y:0}],curviness:1.25},
     duration:2.3,ease:'power2.inOut'
    }, .12)
    .to(plane, {rotation:0,duration:1.9,ease:'power2.out'}, .4)
    .to(select('.flight'), {autoAlpha:1,duration:.2}, .5)
    .to(select('.flight'), {clipPath:'inset(0% 0% 0% 0%)',duration:1.85,ease:'power1.inOut'}, .55);

   // Every card enters from the same upper-right flight corridor, behind the plane.
   [
    ['.postcard', .38, 1.75, -12],
    ['.stamp', .58, 1.9, -18],
    ['.postmark', .76, 1.85, -10],
    ['.hero-envelope', .94, 2, -22],
   ].forEach(([selector, start, duration, rotation]) => {
    const card = select(selector);
    const centerX = card.offsetLeft + card.offsetWidth / 2;
    const centerY = card.offsetTop + card.offsetHeight / 2;
    const path = [
     {x:2250-centerX, y:230-centerY},
     {x:2050-centerX, y:290-centerY},
     {x:1840-centerX, y:380-centerY},
     {x:(1840-centerX)*.45, y:(380-centerY)*.3},
     {x:0, y:0},
    ];
    timeline.set(card, {x:path[0].x, y:path[0].y, scale:.78, rotation, autoAlpha:0}, 0);
    timeline.to(card, {autoAlpha:1, duration:.2}, start);
    timeline.to(card, {
     motionPath:{path, curviness:1.1},
     scale:1, rotation:0, duration, ease:'power2.inOut',
    }, start);
   });

   // Gently bob after the arrival motion finishes.
   timeline.to(plane, {
    y:-16,
    rotation:-1.2,
    duration:2.4,
    ease:'sine.inOut',
    repeat:-1,
    yoyo:true,
   }, 2.42);

   // Start together once the original illustrations are decoded.
   Promise.all([window.portfolioIntroFinished, ...Array.from(root.querySelectorAll('.hero-canvas img')).map(img =>
    img.decode ? img.decode().catch(() => {}) : Promise.resolve()
   )]).then(() => { if (!disposed) timeline.play(0); });

   return () => { disposed = true; };
  }, rootRef);
  return () => media.revert();
}
