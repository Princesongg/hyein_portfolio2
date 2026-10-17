import {gsap} from 'gsap';
import initHeroAtmosphere from './initHeroAtmosphere.js';
import initCrystalLight from './initCrystalLight.js';

export default function initEditionHero(root) {
 const hero = root.querySelector('.edition-hero');
 const logo = root.querySelector('.portfolio-logo-icon img');
 const originalLogo = logo.getAttribute('src');
 logo.setAttribute('src', '/assets/hero/edition/26562.png');
 const navigate = event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
  history.replaceState(null, '', link.hash);
 };
 hero.addEventListener('click', navigate);
 const motion = gsap.matchMedia();
 let introPlayed = false;
 let disposed=false;
 motion.add('(prefers-reduced-motion: no-preference)', () => {
  const floats = [
   ['.edition-butterfly',3,8,2,7.5,0],
   ['.edition-cloud-bottom',4,10,0,13,1.1],
   ['.edition-cloud-right',3,8,0,11,2.3],
   ['.edition-cloud-top',5,12,0,15,.6],
  ].map(([selector,x,y,rotation,period,phase]) => {
   const tween=gsap.fromTo(hero.querySelector(selector),
    {x:-x,y:-y,rotation:-rotation},
    {x,y,rotation,duration:period/2,ease:'sine.inOut',repeat:-1,yoyo:true});
   tween.totalTime(phase);
   return tween;
  });
  floats.push(gsap.fromTo(hero.querySelector('.edition-heart'),
   {'--heart-float-y':'0px'},
   {'--heart-float-y':'-10px',duration:2.8,ease:'sine.inOut',repeat:-1,yoyo:true}));
  if (!introPlayed) {
   introPlayed=true;
   const titleReveal=gsap.fromTo(hero.querySelectorAll('.edition-copy h1 > span,.edition-copy > p'),
    {opacity:0,y:16},
    {opacity:1,y:0,duration:.9,stagger:.15,ease:'power2.out',clearProps:'opacity,transform',paused:true});
   Promise.resolve(window.portfolioIntroFinished).then(()=>{
    if(!disposed&&!matchMedia('(prefers-reduced-motion: reduce)').matches)titleReveal.play();
   });
  }
  let visible=true;
  const updatePlayback=()=>floats.forEach(tween=>tween.paused(!visible||document.hidden));
  const observer=new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;
   updatePlayback();
  },{root:root.querySelector('.portfolio-scroll')});
  observer.observe(hero);
  document.addEventListener('visibilitychange',updatePlayback);
  return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',updatePlayback);};
 });
 const cleanupCrystal=initCrystalLight(hero);
 const cleanupAtmosphere=initHeroAtmosphere(hero);
 return () => {disposed=true;cleanupCrystal();cleanupAtmosphere();motion.revert();hero.removeEventListener('click', navigate);logo.setAttribute('src', originalLogo);};
}
