import {gsap} from 'gsap';

// A fresh document always creates an intro; section navigation never does.
export default function LoadingIntro() {
 const overlay=document.querySelector('.loading-intro');
 if(!overlay)return ()=>{};
 // Stationary half-plane clips keep the upper arc behind the star and the
 // lower arc in front, while both copies rotate and orbit in perfect sync.
 const originalSystem=overlay.querySelector('.loading-intro-orbit-system');
 const rear=document.createElement('div');
 rear.className='loading-intro-orbit-back';
 const front=document.createElement('div');
 front.className='loading-intro-orbit-front';
 rear.setAttribute('aria-hidden','true');
 front.setAttribute('aria-hidden','true');
 originalSystem.before(rear);
 rear.append(originalSystem);
 front.append(originalSystem.cloneNode(true));
 rear.after(front);
 let resolveFinished;
 window.portfolioIntroFinished=new Promise(resolve=>{resolveFinished=resolve;});
 const background=[document.querySelector('.portfolio'),document.querySelector('.postbox-widget')].filter(Boolean);
 const previous=background.map(element=>element.inert);
 background.forEach(element=>{element.inert=true;});
 const scroller=document.querySelector('.portfolio-scroll');
 const originalOverflow=scroller.style.overflowY;
 scroller.style.overflowY='hidden';
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const fill=overlay.querySelector('.loading-intro-fill');
 const number=overlay.querySelector('.loading-intro-number');
 const bar=overlay.querySelector('[role="progressbar"]');
 const state={value:0};
 let finished=false,ready=false,sequenceDone=false,ending=false;
 const timelines=[];
 const update=()=>{
  const value=Math.round(state.value);
  fill.style.transform=`scaleX(${state.value/100})`;
  number.textContent=String(value).padStart(3,'0')+'%';
  bar.setAttribute('aria-valuenow',String(value));
 };
 const finish=()=>{
  if(finished)return;
  finished=true;
  clearTimeout(slowTimer);
  timelines.forEach(timeline=>timeline.kill());
  media.removeEventListener('change',motionChange);
  background.forEach((element,index)=>{element.inert=previous[index];});
  scroller.style.overflowY=originalOverflow;
  overlay.remove();
  resolveFinished();
 };
 const complete=()=>{
  if(finished||ending||!ready||!sequenceDone)return;
  ending=true;
  const end=gsap.timeline({onComplete:finish});
  timelines.push(end);
  end.to(state,{value:100,duration:media.matches?0:.1,onUpdate:update,ease:'none'})
   .fromTo(overlay.querySelector('.loading-intro-highlight'),{opacity:0,scale:.6},{opacity:.85,scale:1.1,duration:media.matches?0:.15})
   .to(overlay.querySelector('.loading-intro-highlight'),{opacity:0,scale:.85,duration:media.matches?0:.15})
   .to(overlay,{opacity:0,duration:media.matches?0:.4,ease:'power1.inOut'});
 };
 const motionChange=()=>{if(media.matches){sequenceDone=true;complete();}};
 media.addEventListener('change',motionChange);
 const slowTimer=setTimeout(()=>{
  if(finished)return;
  overlay.querySelector('.loading-intro-slow').hidden=false;
 },8000);
 overlay.querySelector('.loading-intro-slow button').addEventListener('click',finish,{once:true});
 // These are presentation percentages, not network byte measurements.
 const reveal=gsap.timeline({onComplete:()=>{sequenceDone=true;complete();}});
 timelines.push(reveal);
 reveal.to(overlay.querySelector('.loading-intro-art'),{opacity:1,scale:1,startAt:{scale:.92},duration:media.matches?0:.5,ease:'power2.out'})
  .to(state,{value:92,duration:media.matches?0:1.2,ease:'sine.inOut',onUpdate:update});
 // Separate Figma assets keep the ring continuous as the bead travels.
 if(!media.matches){
  const system=overlay.querySelectorAll('.loading-intro-orbit-system');
  const bead=overlay.querySelectorAll('.loading-intro-bead');
  const orbit={angle:.35};
  const positionBead=()=>{
   const tilt=-24*Math.PI/180;
   const x=.515*Math.cos(orbit.angle),y=.135*Math.sin(orbit.angle);
   const left=(.5+x*Math.cos(tilt)-y*Math.sin(tilt))*100;
   const top=((.5+x*Math.sin(tilt)+y*Math.cos(tilt))*1.5-.25)*100;
   gsap.set(bead,{left:`${left}%`,top:`${top}%`});
  };
  positionBead();
  timelines.push(gsap.fromTo(system,{rotation:8},{rotation:368,duration:18,delay:.5,repeat:-1,ease:'none'}));
  timelines.push(gsap.to(orbit,{angle:.35+Math.PI*2,duration:6,delay:.5,repeat:-1,ease:'none',onUpdate:positionBead}));
 }
 // Wait one microtask for the header initializer to select its final logo src.
 Promise.resolve().then(()=>{
  const essential=[...document.querySelectorAll('.edition-scene img,.loading-intro img,.portfolio-logo-icon img')];
  return Promise.all([...essential.map(image=>image.decode?image.decode():Promise.resolve()),document.fonts.ready]);
 }).then(()=>{ready=true;complete();}).catch(()=>{
  if(!finished){overlay.querySelector('.loading-intro-slow').hidden=false;overlay.querySelector('.loading-intro-slow p').textContent='일부 이미지를 불러오지 못했어요. 새로고침하거나 사이트로 이동할 수 있어요.';}
 });
 return finish;
}
