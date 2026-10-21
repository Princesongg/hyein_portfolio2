export default function initTeamDetailPages(section) {
 const scroller=section.closest('.portfolio-scroll');
 const slot=section.querySelector('.team-detail-pages');
 const pages=[...slot.children];
 const mobile=matchMedia('(max-width:600px)');
 let frame=0;
 let active=-1;
 const update=()=>{
  frame=0;
  if(!mobile.matches)return;
  const top=section.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  const next=-top>scroller.clientHeight*.35?1:0;
  if(next===active)return;
  active=next;
  pages.forEach((page,index)=>{
   page.classList.toggle('team-detail-page--active',index===active);
   page.inert=index!==active;
   page.setAttribute('aria-hidden',String(index!==active));
  });
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const resize=()=>{
  section.toggleAttribute('data-mobile-pages',mobile.matches);
  active=-1;
  if(mobile.matches){
   slot.style.setProperty('--team-page-height',Math.ceil(Math.max(...pages.map(page=>page.scrollHeight)))+'px');
   update();
  }else{
   slot.style.removeProperty('--team-page-height');
   pages.forEach(page=>{page.classList.remove('team-detail-page--active');page.inert=false;page.removeAttribute('aria-hidden');});
  }
 };
 const observer=new ResizeObserver(resize);
 observer.observe(scroller);
 scroller.addEventListener('scroll',schedule,{passive:true});
 mobile.addEventListener('change',resize);
 resize();
 document.fonts.ready.then(()=>{if(section.isConnected)resize();});
 return ()=>{
  cancelAnimationFrame(frame);observer.disconnect();
  scroller.removeEventListener('scroll',schedule);mobile.removeEventListener('change',resize);
  section.removeAttribute('data-mobile-pages');slot.style.removeProperty('--team-page-height');
  pages.forEach(page=>{page.classList.remove('team-detail-page--active');page.inert=false;page.removeAttribute('aria-hidden');});
 };
}
