export default function initMobileKeywords(root) {
 const scroller=root.querySelector('.portfolio-scroll');
 const section=root.querySelector('.con2');
 const role=root.querySelector('.role-story');
 const readingSections=[section,role,root.querySelector('.ux-process'),root.querySelector('.personal-projects'),root.querySelector('.short-form'),root.querySelector('.archive-gallery'),root.querySelector('.memory-fan')].filter(Boolean);
 const widget=document.querySelector('.postbox-widget');
 const controls=widget.querySelector('.postbox-controls');
 const launch=widget.querySelector('.postbox-launch');
 const mobile=matchMedia('(max-width:700px)');
 const text=readingSections.flatMap(area=>[...area.querySelectorAll('.con2-title,.con2-number,.con2-card-heading,.con2-description,.what-i-do-heading,.what-i-do-role-title,.what-i-do-description,.what-i-do-scope,.what-i-do-site,.what-i-do-galerie-link,.ux-process-copy,.ux-material-caption,.personal-projects-info>div,.personal-projects-link,.short-form-copy,.archive-gallery-copy,.about-postcards-letter')]);
 let frame=0;
 let roleIndex=-1;
 const update=()=>{
  frame=0;
  const view=scroller.getBoundingClientRect();
  const reading=mobile.matches&&readingSections.some(section=>{const area=section.getBoundingClientRect();return area.bottom>view.top&&area.top<view.bottom;});
  if(mobile.matches&&role&&role.dataset.horizontal!=='true'){
   const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
   const panels=[...role.querySelector('.role-story-track').children];
   const index=panels.reduce((selected,panel,i)=>panel.getBoundingClientRect().top<=view.top+clearance+60?i:selected,0);
   if(index!==roleIndex){role.querySelectorAll('.role-story-chapters button').forEach((button,i)=>i===index?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));roleIndex=index;}
  }else{
   roleIndex=-1;
  }
  widget.toggleAttribute('data-mobile-keywords',reading);
  let obscured=false;
  if(reading&&launch.getAttribute('aria-expanded')!=='true'&&!controls.contains(document.activeElement)){
   const buttons=controls.getBoundingClientRect();
   obscured=text.some(element=>{
    const box=element.getBoundingClientRect();
    return box.bottom>buttons.top-12&&box.top<buttons.bottom+12&&box.right>buttons.left-12&&box.left<buttons.right+12;
   });
  }
  widget.toggleAttribute('data-keywords-obscured',obscured);
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const observer=new ResizeObserver(schedule);
 readingSections.forEach(section=>observer.observe(section));observer.observe(scroller);
 const stateObserver=new MutationObserver(schedule);
 stateObserver.observe(launch,{attributes:true,attributeFilter:['aria-expanded']});
 scroller.addEventListener('scroll',schedule,{passive:true});
 mobile.addEventListener('change',schedule);
 controls.addEventListener('focusin',schedule);controls.addEventListener('focusout',schedule);
 update();
 return ()=>{
  cancelAnimationFrame(frame);observer.disconnect();stateObserver.disconnect();
  scroller.removeEventListener('scroll',schedule);mobile.removeEventListener('change',schedule);
  controls.removeEventListener('focusin',schedule);controls.removeEventListener('focusout',schedule);
  widget.removeAttribute('data-mobile-keywords');widget.removeAttribute('data-keywords-obscured');
 };
}
