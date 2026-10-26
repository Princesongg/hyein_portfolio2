// Share the measured menu boundary with anchors, sticky stages and slide navigation.
export default function initViewportLayout(root) {
 const header=root.querySelector('.portfolio-header');
 const scroller=root.querySelector('.portfolio-scroll');
 const prefixes=['team-story','role-story','ux-process','personal-projects','short-form'];
 let viewportWidth=root.clientWidth,viewportHeight=root.clientHeight;
 let resizing=false,resizeTimer=0,recordTimer=0,chapter=null;
 const record=()=>{
  if(resizing)return;
  const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
  const prefix=prefixes.find(prefix=>{
   const rect=root.querySelector('.'+prefix).getBoundingClientRect();
   return rect.top<=clearance+180&&rect.bottom>clearance+180;
  });
  if(!prefix){chapter=null;return;}
  const buttons=[...root.querySelectorAll('.'+prefix+'-chapters button')];
  chapter={prefix,index:Math.max(0,buttons.findIndex(button=>button.hasAttribute('aria-current')))};
 };
 const onScroll=()=>{clearTimeout(recordTimer);recordTimer=setTimeout(record,50);};
 const onResize=()=>{
  if(viewportWidth===root.clientWidth&&viewportHeight===root.clientHeight)return;
  resizing=true;viewportWidth=root.clientWidth;viewportHeight=root.clientHeight;
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
   if(chapter){
    const section=root.querySelector('.'+chapter.prefix),track=section.querySelector('.'+chapter.prefix+'-track');
    const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
    let top=scroller.scrollTop+section.getBoundingClientRect().top-scroller.getBoundingClientRect().top-clearance;
    if(section.hasAttribute('data-native-mobile'))track.scrollLeft=chapter.index*track.clientWidth;
    else top+=Number(track.children[chapter.index]?.dataset.chapterOffset||0);
    scroller.scrollTo({top,behavior:'instant'});
   }
   resizing=false;
  },300);
 };
 let frame=0;
 const measure=()=>{
  frame=0;
  const rect=header.getBoundingClientRect();
  const height=parseFloat(getComputedStyle(header).minHeight)||rect.height;
  const clearance=Math.ceil(rect.top-root.getBoundingClientRect().top+height+16);
  if(root.style.getPropertyValue('--header-clearance')===`${clearance}px`)return;
  root.style.setProperty('--header-clearance',`${clearance}px`);
  root.dispatchEvent(new Event('viewport-layout'));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
 const observer=new ResizeObserver(()=>{onResize();schedule();});
 observer.observe(root);observer.observe(header);
 const classes=new MutationObserver(schedule);
 classes.observe(header,{attributes:true,attributeFilter:['class']});
 header.addEventListener('transitionend',schedule);
 window.visualViewport?.addEventListener('resize',schedule);
 root.addEventListener('scroll',onScroll,true);
 window.addEventListener('resize',onResize);
 measure();
 return ()=>{observer.disconnect();classes.disconnect();cancelAnimationFrame(frame);clearTimeout(resizeTimer);clearTimeout(recordTimer);root.removeEventListener('scroll',onScroll,true);window.removeEventListener('resize',onResize);header.removeEventListener('transitionend',schedule);window.visualViewport?.removeEventListener('resize',schedule);};
}
