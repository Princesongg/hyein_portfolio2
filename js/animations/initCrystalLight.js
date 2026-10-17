import {gsap} from 'gsap';

// Percent coordinates follow the unchanged PNG at every viewport size.
export const sparklePoints=[
 {left:29,top:30,size:24},
 {left:48,top:47,size:20},
 {left:42,top:17,size:14},
 {left:56,top:88,size:13},
];
const idlePatterns=[[0],[2,3],[1],[3,0]];
const settings={idleInterval:3.3,idleOpacity:1,hoverOpacity:1,duration:1.2};

export default function initCrystalLight(hero) {
 const heart=hero.querySelector('.edition-heart');
 const surface=document.createElement('div');
 surface.className='crystal-sparkles';
 surface.setAttribute('aria-hidden','true');
 const points=sparklePoints.map(({left,top,size})=>{
  const point=document.createElement('span');
  point.className='crystal-twinkle';
  point.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M12 1C13 9 15 11 23 12C15 13 13 15 12 23C11 15 9 13 1 12C9 11 11 9 12 1Z" fill="#FFFDF7" stroke="#C9AE8F" stroke-width=".65"/><path d="M12 5L13 11L19 12L13 13L12 19L11 13L5 12L11 11Z" fill="white"/></svg>';
  Object.assign(point.style,{left:left+'%',top:top+'%',width:size+'px',height:size+'px'});
  surface.append(point);
  return point;
 });
 heart.append(surface);
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const pulse=(timeline,index,at,opacity)=>timeline
   .fromTo(points[index],{opacity:0,scale:.35},{opacity:.5,scale:.65,duration:.18,ease:'sine.out',immediateRender:false},at)
   .to(points[index],{opacity,scale:1,duration:.22,ease:'sine.out'},at+.18)
   .to(points[index],{opacity,scale:1.04,duration:.26,ease:'sine.inOut'},at+.4)
   .to(points[index],{opacity:0,scale:.3,duration:settings.duration-.66,ease:'sine.inOut'},at+.66);
  const idle=gsap.timeline({repeat:-1,delay:2});
  idlePatterns.forEach((pattern,index)=>pattern.forEach((point,i)=>pulse(idle,point,index*settings.idleInterval+i*.35,settings.idleOpacity)));
  idle.to({}, {duration:settings.idleInterval-settings.duration});
  let hover=null,visible=true,hovered=false;
  const playback=()=>{
   const paused=!visible||document.hidden;
   idle.paused(paused||hovered);
   hover?.paused(paused);
  };
  const reset=()=>{points.forEach(point=>{point.style.opacity='0';});};
  const enter=event=>{
   if(event.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
   hovered=true;
   idle.pause();hover?.kill();gsap.killTweensOf(points);reset();
   hover=gsap.timeline();
   [1,0,2].forEach((point,index)=>pulse(hover,point,index*.65,settings.hoverOpacity));
   hover.eventCallback('onComplete',()=>{hover=null;hovered=false;idle.restart(true);playback();});
   playback();
  };
  const leave=()=>{
   hovered=false;
   hover?.kill();hover=null;
   gsap.killTweensOf(points);
   gsap.to(points,{opacity:0,scale:.8,duration:.3,ease:'sine.out',overwrite:true});
   idle.restart(true);playback();
  };
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;playback();},{root:hero.closest('.portfolio-scroll')});
  observer.observe(hero);
  heart.addEventListener('pointerenter',enter);
  heart.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',playback);
  return ()=>{observer.disconnect();hover?.kill();gsap.killTweensOf(points);reset();heart.removeEventListener('pointerenter',enter);heart.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',playback);};
 });
 return ()=>{media.revert();surface.remove();};
}
