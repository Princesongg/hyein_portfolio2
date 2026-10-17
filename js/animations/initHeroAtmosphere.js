import {gsap} from 'gsap';

export default function initHeroAtmosphere(hero) {
 const scroller=hero.closest('.portfolio-scroll');
 const light=document.createElement('div');
 light.className='edition-prism-light';
 light.setAttribute('aria-hidden','true');
 hero.querySelector('.edition-background').after(light);
 const motion=gsap.matchMedia();
 motion.add('(prefers-reduced-motion: no-preference)',()=>{
  const loops=[
   gsap.fromTo(light,{xPercent:-2,yPercent:-1,opacity:.08},
    {xPercent:2,yPercent:1,opacity:.16,duration:20,ease:'sine.inOut',repeat:-1,yoyo:true}),
   ...[
    ['.edition-sparkle',5.2,0,.5,.84,1.1],
    ['.edition-star',6.4,2.1,.35,.86,1.12],
   ].map(([selector,period,phase,opacity,minScale,maxScale])=>{
    const tween=gsap.fromTo(hero.querySelector(selector),{opacity:opacity*.7,scale:minScale,transformOrigin:'50% 50%'},
     {opacity,scale:maxScale,duration:period/2,ease:'sine.inOut',repeat:-1,yoyo:true});
    tween.totalTime(phase);
    return tween;
   }),
  ];
  let visible=true;
  const playback=()=>loops.forEach(tween=>tween.paused(!visible||document.hidden));
  const observer=new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;
   playback();
  },{root:scroller});
  observer.observe(hero);
  document.addEventListener('visibilitychange',playback);

  // Individual translate preserves floating transforms and moves the heart
  // image and its independent lighting surface together during scrolling.
  const layers=[
   [hero.querySelector('.edition-copy'),25],
   [hero.querySelector('.edition-heart'),34],
   [hero.querySelector('.edition-butterfly'),20],
   [hero.querySelector('.edition-cloud-bottom'),15],
   [hero.querySelector('.edition-cloud-right'),11],
   [hero.querySelector('.edition-cloud-top'),8],
  ];
  let frame=0;
  const update=()=>{
   frame=0;
   const viewport=scroller.getBoundingClientRect();
   const rect=hero.getBoundingClientRect();
   const progress=gsap.utils.clamp(0,1,(viewport.top-rect.top)/rect.height);
   const strength=matchMedia('(max-width:700px)').matches?.45:1;
   layers.forEach(([element,distance])=>{
    element.style.translate=`0px ${-progress*distance*strength}px`;
   });
   const fade=gsap.utils.clamp(0,1,(progress-.8)/.2);
   layers[0][0].style.opacity=String(1-fade*.15);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const resize=new ResizeObserver(schedule);
  resize.observe(hero);
  scroller.addEventListener('scroll',schedule,{passive:true});
  update();
  return ()=>{
   cancelAnimationFrame(frame);
   observer.disconnect();
   resize.disconnect();
   document.removeEventListener('visibilitychange',playback);
   scroller.removeEventListener('scroll',schedule);
   layers.forEach(([element])=>element.style.removeProperty('translate'));
   layers[0][0].style.removeProperty('opacity');
  };
 });
 return ()=>{motion.revert();light.remove();};
}
