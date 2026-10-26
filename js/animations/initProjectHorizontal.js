// Each chapter starts below the menu, then scrolls its own full content before
// travelling horizontally. A tall neighbour cannot move another title upward.
export default function initProjectHorizontal(root,prefix) {
 const portfolio=root.closest('.portfolio');
 const scroller=root.closest('.portfolio-scroll');
 const stage=root.querySelector(`.${prefix}-stage`);
 const track=root.querySelector(`.${prefix}-track`);
 const rows=[...track.children];
 const contentWindow=document.createElement('div');
 contentWindow.className='horizontal-content-window';
 track.before(contentWindow);contentWindow.append(track);
 const footer=['personal-projects','short-form'].includes(prefix);
 contentWindow.style.inset=footer?'0 0 76px':'60px 0 0';
 const buttons=[...root.querySelectorAll(`.${prefix}-chapters button`)];
 const details=prefix==='team-story'?root.querySelector('.details-slider'):null;
 const detailRow=details?rows.indexOf(details.closest('.team-story-row')):-1;
 let detailDistance=0,lastDetail=-1;
 let starts=[],overflows=[],width=0,clearance=0,total=0,frame=0,measureFrame=0;
 const update=()=>{
  frame=0;
  const offset=Math.max(0,Math.min(total,scroller.getBoundingClientRect().top+clearance-root.getBoundingClientRect().top));
  let index=0;
  while(index<rows.length-1&&offset>=starts[index+1])index++;
  const local=offset-starts[index];
  const detailHold=index===detailRow?detailDistance:0;
  const travel=index<rows.length-1?Math.max(0,Math.min(1,(local-overflows[index]-detailHold)/width)):0;
  if(details){
   const detailIndex=index<detailRow?0:index>detailRow?2:Math.max(0,Math.min(2,Math.floor((local-overflows[index])/(detailDistance/3))));
   if(detailIndex!==lastDetail){details.dispatchEvent(new CustomEvent('details-progress',{detail:{index:detailIndex}}));lastDetail=detailIndex;}
  }
  track.style.transform=`translate3d(${-width*(index+travel)}px,0,0)`;
  rows.forEach((row,i)=>{
   const y=i<index?overflows[i]:i===index?Math.min(overflows[i],local):0;
   row.style.transform=`translateY(${-y}px)`;
  });
  buttons.forEach((button,i)=>i===(travel>.5?index+1:index)?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const measure=()=>{
  measureFrame=0;
  const previousHeight=root.offsetHeight;
  const bounds=root.getBoundingClientRect(),viewport=scroller.getBoundingClientRect();
  const passed=root.hasAttribute('data-content-scroll')&&bounds.top<viewport.top&&bounds.bottom<viewport.bottom;
  const oldIndex=buttons.findIndex(button=>button.hasAttribute('aria-current'));
  const oldStart=starts[Math.max(0,oldIndex)]||0;
  const oldOffset=scroller.getBoundingClientRect().top+clearance-root.getBoundingClientRect().top;
  const wasInside=oldOffset>=0&&oldOffset<=total;
  clearance=parseFloat(getComputedStyle(portfolio).getPropertyValue('--header-clearance'))||86;
  width=scroller.clientWidth;
  const available=Math.max(1,scroller.clientHeight-clearance);
  const contentHeight=Math.max(1,available-(footer?76:60));
  detailDistance=details?scroller.clientHeight*1.8:0;
  root.dataset.horizontal='true';root.dataset.contentScroll='';
  root.style.setProperty('--story-stage-top',`${clearance}px`);
  root.style.setProperty('--story-stage-height',`${available}px`);
  root.style.setProperty('--story-panel-height',`${contentHeight}px`);
  total=0;
  starts=rows.map((row,i)=>{
   const start=total;
   row.dataset.chapterOffset=String(start);
   const excess=row.scrollHeight-contentHeight;
   // A rounded fractional min-height is not extra personal-project content.
   overflows[i]=prefix==='personal-projects'&&excess<=1?0:Math.max(0,excess);
   total+=overflows[i]+(i===detailRow?detailDistance:0)+(i<rows.length-1?width:0);
   return start;
  });
  root.style.setProperty('--story-distance',`${total}px`);
  // Personal projects need no extra menu-height tail after the final chapter.
  root.style.height=`${(prefix==='personal-projects'?available:scroller.clientHeight)+total}px`;
  const correction=passed?root.offsetHeight-previousHeight:wasInside&&oldIndex>=0?starts[oldIndex]-oldStart:0;
  // Assigning even the same scrollTop cancels an in-flight smooth navigation.
  if(Math.abs(correction)>.5)scroller.scrollTop+=correction;
  update();
 };
 const scheduleMeasure=()=>{if(!measureFrame)measureFrame=requestAnimationFrame(measure);};
 const observer=new ResizeObserver(scheduleMeasure);
 observer.observe(scroller);rows.forEach(row=>observer.observe(row));
 root.addEventListener('load',scheduleMeasure,true);
 portfolio.addEventListener('viewport-layout',scheduleMeasure);
 document.fonts.addEventListener('loadingdone',scheduleMeasure);
 scroller.addEventListener('scroll',schedule,{passive:true});
 const onKey=event=>{
  if(event.target!==stage||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();
  const current=Math.max(0,buttons.findIndex(button=>button.hasAttribute('aria-current')));
  buttons[Math.max(0,Math.min(rows.length-1,current+(event.key==='ArrowRight'?1:-1)))]?.click();
 };
 stage.addEventListener('keydown',onKey);
 const seek=event=>{
  const top=scroller.scrollTop+root.getBoundingClientRect().top-scroller.getBoundingClientRect().top-clearance;
  scroller.scrollTo({top:top+starts[detailRow]+overflows[detailRow]+(event.detail.index+.15)*detailDistance/3,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 root.addEventListener('details-seek',seek);
 measure();
 return ()=>{
  observer.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(measureFrame);
  root.removeEventListener('load',scheduleMeasure,true);
  portfolio.removeEventListener('viewport-layout',scheduleMeasure);
  document.fonts.removeEventListener('loadingdone',scheduleMeasure);
  scroller.removeEventListener('scroll',schedule);stage.removeEventListener('keydown',onKey);root.removeEventListener('details-seek',seek);
  track.style.transform='';rows.forEach(row=>{row.style.transform='';delete row.dataset.chapterOffset;});
  contentWindow.replaceWith(track);
  delete root.dataset.horizontal;delete root.dataset.contentScroll;root.style.height='';
  for(const name of ['--story-stage-top','--story-stage-height','--story-panel-height','--story-distance'])root.style.removeProperty(name);
 };
}
