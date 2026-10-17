import {gsap} from 'gsap';

export default function initTeamCrystal(art) {
 if(!art)return;
 const motion=gsap.matchMedia();
 let revealed=false;
 motion.add('(prefers-reduced-motion: no-preference)',()=>{
  const floating=art.querySelector('.team-crystal-float');
  const sparkles=art.querySelectorAll('.team-crystal-sparkle');
  const loops=[];
  let reveal;
  let visible=false;
  const playback=()=>loops.forEach(loop=>loop.paused(!visible||document.hidden));
  const startLoops=()=>{
   loops.push(gsap.fromTo(floating,{y:0},{y:-7,duration:3.5,ease:'sine.inOut',repeat:-1,yoyo:true}));
   sparkles.forEach((sparkle,index)=>{
    const pulse=gsap.timeline({repeat:-1,repeatDelay:4.8,delay:1+index*2.4});
    pulse.fromTo(sparkle,{opacity:0,scale:.75},{opacity:.9,scale:1.08,duration:.35,ease:'sine.out'})
     .to(sparkle,{opacity:0,scale:.8,duration:.65,ease:'sine.in'});
    loops.push(pulse);
   });
   playback();
  };
  if(!revealed)gsap.set(art,{opacity:0,scale:.92,y:20});
  else startLoops();
  const observer=new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;
   if(visible&&!revealed){
    revealed=true;
    reveal=gsap.to(art,{opacity:1,scale:1,y:0,duration:1,ease:'power2.out',onComplete:startLoops});
   }
   playback();
  },{root:art.closest('.portfolio-scroll'),threshold:.25});
  observer.observe(art);
  document.addEventListener('visibilitychange',playback);
  return ()=>{
   observer.disconnect();
   document.removeEventListener('visibilitychange',playback);
   reveal?.kill();
   loops.forEach(loop=>loop.kill());
  };
 });
 return ()=>motion.revert();
}
