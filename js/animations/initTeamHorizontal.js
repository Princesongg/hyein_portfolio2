
export default function initTeamHorizontal(ref, prefix = 'team-story') {
  const mobile = matchMedia('(max-width:700px)');
  let cleanup = () => {};
  const setup = () => {
    cleanup();
    if (!mobile.matches) {
      cleanup = initDesktopHorizontal(ref, prefix);
      return;
    }
    // The browser owns both swipe momentum and page scrolling.
    ref.dataset.horizontal = 'false';
    ref.dataset.nativeMobile = '';
    const track = ref.querySelector('.' + prefix + '-track');
    const rows = [...track.children];
    const buttons = [...ref.querySelectorAll('.' + prefix + '-chapters button')];
    const restore = [];
    if (prefix === 'short-form' || prefix === 'role-story') rows.forEach(row => {
      const copy = row.querySelector(prefix === 'short-form' ? '.short-form-copy' : '.what-i-do-contribution-copy');
      if (!copy) return;
      const nodes = [...copy.querySelectorAll(prefix === 'short-form'
        ? ':scope > .short-form-details, :scope > .short-form-disclaimer'
        : ':scope > .what-i-do-description')];
      if (!nodes.length) return;
      const detail = document.createElement('details');
      detail.className = 'mobile-card-detail';
      const summary = document.createElement('summary');
      summary.textContent = prefix === 'short-form' ? '제작 과정 · 담당 역할 자세히' : '화면 개선 · 작업 내용 자세히';
      nodes[0].before(detail);
      detail.append(summary);
      nodes.forEach(node => {
        const marker = document.createComment('full project detail');
        node.before(marker); detail.append(node);
        restore.push(() => marker.replaceWith(node));
      });
      restore.push(() => detail.remove());
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const active = Math.max(0, Math.min(rows.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
      track.style.height = rows[active].offsetHeight + 'px';
      buttons.forEach((button, index) => {
        if (index === active) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      const button = buttons[active];
      if (button) {
        const nav = button.parentElement;
        if (button.offsetLeft < nav.scrollLeft || button.offsetLeft + button.offsetWidth > nav.scrollLeft + nav.clientWidth) {
          nav.scrollTo({left:Math.max(0,button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2),behavior:'instant'});
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    track.addEventListener('scroll', schedule, {passive:true});
    const scroller = ref.closest('.portfolio-scroll');
    let gesture = null;
    let gestureTimer = 0;
    let wheelTimer = 0;
    let wheeling = false;
    const current = () => Math.max(0, Math.min(rows.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    const clearance = () => parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 82;
    const canStep = direction => current() + direction >= 0 && current() + direction < rows.length;
    const advance = (direction = 1) => {
      if (!gesture || gesture.switched || !canStep(direction)) return;
      gesture.switched = true;
      track.scrollTo({left:(current() + direction) * track.clientWidth, behavior:'instant'});
      update();
      const viewport = scroller.getBoundingClientRect();
      const offset = direction > 0
        ? ref.getBoundingClientRect().top - viewport.top - clearance()
        : track.getBoundingClientRect().bottom - viewport.bottom;
      scroller.scrollTo({top:scroller.scrollTop + offset, behavior:'instant'});
    };
    const onStart = event => {
      clearTimeout(gestureTimer);
      if (event.touches.length !== 1) { gesture = null; return; }
      const touch = event.touches[0];
      gesture = {x:touch.clientX, y:touch.clientY, switched:false, edge:false, vertical:false};
    };
    const onMove = event => {
      if (!gesture || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - gesture.x;
      const dy = gesture.y - event.touches[0].clientY;
      gesture.vertical = Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.3;
      gesture.direction = Math.sign(dy);
      if (!gesture.vertical || (!gesture.switched && !canStep(gesture.direction))) return;
      const viewport = scroller.getBoundingClientRect();
      const atEdge = gesture.direction > 0
        ? track.getBoundingClientRect().bottom <= viewport.bottom + 8
        : ref.getBoundingClientRect().top >= viewport.top + clearance() - 8;
      if (atEdge) {
        gesture.edge = true;
        if (event.cancelable) event.preventDefault();
      }
    };
    const onEnd = () => {
      if (gesture?.edge && gesture.vertical) advance(gesture.direction);
      clearTimeout(gestureTimer);
      gestureTimer = setTimeout(() => { gesture = null; }, 250);
    };
    const onPageScroll = () => {
      if (!gesture?.vertical) return;
      clearTimeout(gestureTimer);
      gestureTimer = setTimeout(() => { gesture = null; }, 250);
      if (!gesture.switched && !canStep(gesture.direction)) return;
      const viewport = scroller.getBoundingClientRect();
      const overshoot = gesture.direction > 0
        ? viewport.bottom - track.getBoundingClientRect().bottom
        : ref.getBoundingClientRect().top - viewport.top - clearance();
      if (overshoot > 0) {
        if (!gesture.switched) advance(gesture.direction);
        else scroller.scrollTop -= overshoot * gesture.direction;
      }
    };
    // Native scrolling may cancel the touch stream; keep its momentum bounded.
    const onCancel = () => {
      clearTimeout(gestureTimer);
      gestureTimer = setTimeout(() => { gesture = null; }, 250);
    };
    const onOutsideStart = event => { if (!ref.contains(event.target)) gesture = null; };
    const onWheel = event => {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.deltaY) return;
      const direction = Math.sign(event.deltaY);
      if (!wheeling || gesture?.direction !== direction) gesture = {vertical:true,direction,switched:false};
      wheeling = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {wheeling = false;gesture = null;},220);
      if (!gesture.switched && !canStep(direction)) return;
      const viewport = scroller.getBoundingClientRect();
      const atEdge = direction > 0
        ? track.getBoundingClientRect().bottom <= viewport.bottom + 8
        : ref.getBoundingClientRect().top >= viewport.top + clearance() - 8;
      if (atEdge) {event.preventDefault();advance(direction);}
    };
    {
      ref.addEventListener('touchstart', onStart, {passive:true});
      ref.addEventListener('touchmove', onMove, {passive:false});
      ref.addEventListener('touchend', onEnd, {passive:true});
      ref.addEventListener('touchcancel', onCancel, {passive:true});
      scroller.addEventListener('scroll', onPageScroll, {passive:true});
      scroller.addEventListener('touchstart', onOutsideStart, {passive:true});
      ref.addEventListener('wheel',onWheel,{passive:false});
    }
    const observer = new ResizeObserver(schedule);
    rows.forEach(row => observer.observe(row));
    update();
    cleanup = () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      ref.removeEventListener('touchstart', onStart);
      ref.removeEventListener('touchmove', onMove);
      ref.removeEventListener('touchend', onEnd);
      ref.removeEventListener('touchcancel', onCancel);
      scroller.removeEventListener('scroll', onPageScroll);
      scroller.removeEventListener('touchstart', onOutsideStart);
      clearTimeout(gestureTimer);
      clearTimeout(wheelTimer);
      ref.removeEventListener('wheel',onWheel);
      restore.forEach(undo => undo());
      observer.disconnect();
      track.style.removeProperty('height');
      delete ref.dataset.nativeMobile;
      delete ref.dataset.horizontal;
    };
  };
  mobile.addEventListener('change', setup);
  setup();
  return () => { mobile.removeEventListener('change', setup); cleanup(); };
}

function initDesktopHorizontal(ref, prefix) {
  const root = ref;
  const scroller = root.closest('.portfolio-scroll');
  const track = root.querySelector('.' + prefix + '-track');
  const rows = [...track.children];
  const buttons = [...root.querySelectorAll('.' + prefix + '-chapters button')];
  const mobileTeam = window.matchMedia('(max-width:600px)');
  const mobileRole = window.matchMedia('(max-width:700px)');
  const compactMobile=()=>prefix==='team-story'&&mobileTeam.matches||['role-story','ux-process','personal-projects','short-form'].includes(prefix)&&mobileRole.matches;
  const media = window.matchMedia(prefix === 'ux-process' ? '(prefers-reduced-motion: reduce), (min-width:701px) and (max-width:900px)' : '(prefers-reduced-motion: reduce)');
  let frame = 0;
  let measureFrame = 0;
  let distance = 0;
  let hold = 0;
  let travel = 0;
  let overflow = 0;
  let activeIndex = -1;
  let previousOffset = -1;
  let snapTimer = 0;
  let touching = false;
  let snapping = false;
  let snapFrame = 0;
  let measurePending = false;
  let measuredWidth = 0;
  let measuredHeight = 0;
  let lastDetailIndex = -1;
  const details = prefix === 'team-story' ? root.querySelector('.details-slider') : null;
  const detailRow = details ? rows.indexOf(details.closest('.team-story-row')) : -1;
  let detailDistance = 0;
  const chapterOffset = index => overflow + hold + index * scroller.clientWidth + (detailRow >= 0 && index > detailRow ? detailDistance : 0);
  const update = () => {
   frame = 0;
   if (media.matches) return;
   const offset = scroller.getBoundingClientRect().top - root.getBoundingClientRect().top;
   const raw = offset - overflow - hold;
   const detailStart = detailRow * scroller.clientWidth;
   const consumed = detailDistance ? Math.max(0, Math.min(detailDistance, raw - detailStart)) : 0;
   const clampedOffset = Math.max(0, Math.min(travel, raw - consumed));
   if (details) {
    const index = detailDistance ? Math.min(2, Math.floor(consumed / (detailDistance / 3))) : 0;
    if(index!==lastDetailIndex){details.dispatchEvent(new CustomEvent('details-progress', {detail:{index}}));lastDetailIndex=index;}
   }
   const index = Math.round(clampedOffset / scroller.clientWidth);
   if(index !== activeIndex && compactMobile() && rows[index]?.scrollTop)rows[index].scrollTop=0;
   if (index !== activeIndex) buttons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
   });
   if(index!==activeIndex&&compactMobile()&&buttons[index]){
    const button=buttons[index],nav=button.parentElement;
    if(button.offsetLeft<nav.scrollLeft||button.offsetLeft+button.offsetWidth>nav.scrollLeft+nav.clientWidth)nav.scrollTo({left:Math.max(0,button.offsetLeft-(nav.clientWidth-button.offsetWidth)/2),behavior:'instant'});
   }
   activeIndex = index;
   if (clampedOffset !== previousOffset) track.style.transform = `translate3d(${-clampedOffset}px,0,0)`;
   previousOffset = clampedOffset;
  };
  const stopSnap=()=>{cancelAnimationFrame(snapFrame);snapFrame=0;snapping=false;};
  const animateSnap=top=>{
   stopSnap();
   const from=scroller.scrollTop;
   const change=top-from;
   if(Math.abs(change)<1.5)return;
   snapping=true;
   const duration=prefix==='personal-projects'&&compactMobile()?320:Math.min(260,Math.max(160,Math.abs(change)*.45));
   let started;
   const tick=now=>{
    started??=now;
    const progress=Math.min(1,(now-started)/duration);
    scroller.scrollTo({top:from+change*(1-Math.pow(1-progress,3)),behavior:'instant'});
    if(progress<1)snapFrame=requestAnimationFrame(tick);
    else {snapFrame=0;snapping=false;if(measurePending){measurePending=false;scheduleMeasure();}}
   };
   snapFrame=requestAnimationFrame(tick);
  };
  const snap = () => {
   snapTimer = 0;
   if(!compactMobile() || media.matches || touching || snapping)return;
   const offset=scroller.getBoundingClientRect().top-root.getBoundingClientRect().top;
   if(offset<overflow+hold)return;
   if(offset>overflow+distance){
    const exit=offset-overflow-distance;
    if(exit>=scroller.clientHeight)return;
    const start=scroller.scrollTop+root.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
    const target=overflow+distance+(exit>=scroller.clientHeight*.5?scroller.clientHeight:0);
    if(Math.abs(target-offset)>=1.5)animateSnap(start+target);
    return;
   }
   const raw=offset-overflow-hold;
   const detailStart=detailRow*scroller.clientWidth;
   // Keep the three detail slides at their current position within their chapter.
   if(detailDistance && raw>=detailStart && raw<=detailStart+detailDistance)return;
   const consumed=detailDistance?Math.max(0,Math.min(detailDistance,raw-detailStart)):0;
   const index=Math.max(0,Math.min(rows.length-1,Math.round((raw-consumed)/scroller.clientWidth)));
   let target=chapterOffset(index);
   if(index===detailRow && raw>detailStart+detailDistance)target+=detailDistance;
   if(Math.abs(target-offset)<1.5)return;
   const start=scroller.scrollTop+root.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
   animateSnap(start+target);
  };
  const scheduleSnap=()=>{
   clearTimeout(snapTimer);
   if(compactMobile() && !media.matches && !touching && !snapping)snapTimer=setTimeout(()=>{if(measurePending){measurePending=false;measure();}snap();},110);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); scheduleSnap(); };
  const onTouchStart=()=>{touching=true;clearTimeout(snapTimer);stopSnap();};
  const onTouchEnd=event=>{touching=event.touches.length>0;if(!touching)scheduleSnap();};
  const onWheel=()=>{clearTimeout(snapTimer);stopSnap();};
  let swipe=null;
  const onSwipeStart=event=>{
   if(!['personal-projects','short-form'].includes(prefix)||!compactMobile()||media.matches||event.touches.length!==1)return;
   const offset=scroller.getBoundingClientRect().top-root.getBoundingClientRect().top;
   if(offset< -2||offset>overflow+distance+2)return;
   const touch=event.touches[0];
   swipe={x:touch.clientX,y:touch.clientY,top:scroller.scrollTop,index:Math.max(0,activeIndex),axis:null};
  };
  const onSwipeMove=event=>{
   if(!swipe)return;
   if(event.touches.length!==1){swipe=null;return;}
   const dx=event.touches[0].clientX-swipe.x,dy=event.touches[0].clientY-swipe.y;
   if(!swipe.axis&&Math.max(Math.abs(dx),Math.abs(dy))>8)swipe.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
   if(!swipe.axis)return;
   if(prefix==='short-form'&&swipe.axis==='y')return;
   event.preventDefault();
   const start=scroller.scrollTop+root.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
   const delta=swipe.axis==='x'?dx:dy;
   // A long drag can reach only the immediately adjacent project.
   const min=start+chapterOffset(Math.max(0,swipe.index-1));
   const max=start+chapterOffset(Math.min(rows.length-1,swipe.index+1));
   scroller.scrollTo({top:Math.max(min,Math.min(max,swipe.top-delta)),behavior:'instant'});
  };
  const onSwipeEnd=event=>{
   if(!swipe)return;
   const gesture=swipe;swipe=null;
   if(!gesture.axis)return;
   if(prefix==='short-form'&&gesture.axis==='y')return;
   const touch=event.changedTouches[0];
   const delta=gesture.axis==='x'?(touch?.clientX??gesture.x)-gesture.x:(touch?.clientY??gesture.y)-gesture.y;
   const step=event.type==='touchcancel'||Math.abs(delta)<40?0:delta<0?1:-1;
   const index=Math.max(0,Math.min(rows.length-1,gesture.index+step));
   const start=scroller.scrollTop+root.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
   touching=false;
   // Vertical swipes at either end continue to the neighbouring section.
   const boundary=gesture.axis==='y'&&step&&index===gesture.index;
   const target=boundary?chapterOffset(index)+step*scroller.clientHeight:chapterOffset(index);
   animateSnap(Math.max(0,start+target));
  };
  const refreshMobileFit=()=>rows.forEach(row=>{
   const content=[...row.children];
   row.toggleAttribute('data-mobile-fit',content.every(element=>element.offsetTop+element.offsetHeight<=scroller.clientHeight-2));
  });
  const measure = () => {
   const compactPanels=compactMobile();
   if(snapping&&(!compactPanels||media.matches))stopSnap();
   if(compactPanels&&!media.matches&&root.dataset.horizontal==='true'&&measuredWidth===scroller.clientWidth&&measuredHeight===scroller.clientHeight){refreshMobileFit();return;}
   const previousHeight = root.offsetHeight;
   const bounds = root.getBoundingClientRect();
   const viewport = scroller.getBoundingClientRect();
   const preserveFollowingContent = root.dataset.horizontal === 'true'
    && bounds.top < viewport.top && bounds.bottom < viewport.bottom;
   activeIndex = -1;
   previousOffset = -1;
   root.dataset.horizontal = String(!media.matches);
   rows.forEach(row=>row.removeAttribute('data-mobile-fit'));
   track.style.transform = '';
   root.style.removeProperty('--story-stage-height');
   root.style.removeProperty('--story-stage-top');
   if (media.matches) { overflow = 0; root.style.removeProperty('--story-overflow'); root.style.removeProperty('--story-distance'); root.style.removeProperty('--details-distance'); return; }
   // Measure the content before constraining the panels to the sticky stage.
   // This includes bottom padding that keeps content above the page footer.
   root.dataset.horizontal = 'false';
   const stageHeight = compactPanels ? scroller.clientHeight : Math.max(scroller.clientHeight, ...rows.map(row => Math.max(row.offsetHeight, row.scrollHeight)));
   // Let taller panels scroll to their bottom before the horizontal motion starts.
   overflow = Math.max(0, stageHeight - scroller.clientHeight);
   travel = compactPanels ? Math.max(0,rows.length-1)*scroller.clientWidth : Math.max(0, track.scrollWidth - scroller.clientWidth);
   hold = prefix === 'role-story' && !compactPanels ? scroller.clientHeight * .65 : 0;
   detailDistance = details ? scroller.clientHeight * 1.8 : 0;
   distance = travel + hold * 2 + detailDistance;
   root.style.setProperty('--details-distance', `${detailDistance}px`);
   root.style.setProperty('--story-hold', `${hold}px`);
   root.style.setProperty('--story-stage-height', `${stageHeight}px`);
   root.style.setProperty('--story-stage-top', `${-overflow}px`);
   root.style.setProperty('--story-overflow', `${overflow}px`);
   root.style.setProperty('--story-distance', `${distance}px`);
   root.dataset.horizontal = 'true';
   measuredWidth=scroller.clientWidth;measuredHeight=scroller.clientHeight;
   if(compactPanels)refreshMobileFit();
   // Late media/font measurements in a section we've passed must not move
   // the next section that the user is currently reading.
   if (preserveFollowingContent) scroller.scrollTop += root.offsetHeight - previousHeight;
   // Restore the current translation before the browser paints the measured layout.
   cancelAnimationFrame(frame);
   update();
  };
  const scheduleMeasure = () => {
   if(compactMobile()&&(touching||snapping)){measurePending=true;return;}
   if (!measureFrame) measureFrame = requestAnimationFrame(() => {
    measureFrame = 0;
    measure();
   });
  };
  const onKey = event => {
   if (media.matches || event.target !== root.querySelector('.' + prefix + '-stage')) return;
   if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
   event.preventDefault();
   const start = scroller.scrollTop + root.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   const nextIndex = Math.max(0,Math.min(rows.length - 1,activeIndex + (event.key === 'ArrowRight' ? 1 : -1)));
   const next = start + chapterOffset(nextIndex);
   scroller.scrollTo({top:Math.max(start,Math.min(start + overflow + distance,next)),behavior:'smooth'});
  };
  const observer = new ResizeObserver(scheduleMeasure);
  const onDetailSeek = event => {
   if (media.matches || !details) return;
   const start = scroller.scrollTop + root.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   scroller.scrollTo({top:start + chapterOffset(detailRow) + (event.detail.index + .15) * detailDistance / 3,behavior:'smooth'});
  };
  root.addEventListener('details-seek', onDetailSeek);
  observer.observe(scroller);
  root.addEventListener('load', scheduleMeasure, true);
  root.addEventListener('keydown', onKey);
  scroller.addEventListener('scroll', schedule, {passive:true});
  if(['personal-projects','short-form'].includes(prefix)){
   track.addEventListener('touchstart',onSwipeStart,{passive:true});
   track.addEventListener('touchmove',onSwipeMove,{passive:false});
   track.addEventListener('touchend',onSwipeEnd,{passive:true});
   track.addEventListener('touchcancel',onSwipeEnd,{passive:true});
  }
  if(['team-story','role-story','ux-process','personal-projects','short-form'].includes(prefix)){
   scroller.addEventListener('touchstart',onTouchStart,{passive:true});
   scroller.addEventListener('touchend',onTouchEnd,{passive:true});
   scroller.addEventListener('touchcancel',onTouchEnd,{passive:true});
   scroller.addEventListener('wheel',onWheel,{passive:true});
  }
  media.addEventListener('change', measure);
  measure();
  // Font metrics can change panel heights after the first layout.
  document.fonts.addEventListener('loadingdone', scheduleMeasure);
  return () => {
   cancelAnimationFrame(frame);
   cancelAnimationFrame(measureFrame);
   clearTimeout(snapTimer);
   stopSnap();
   observer.disconnect();
   root.removeEventListener('details-seek', onDetailSeek);
   root.removeEventListener('load', scheduleMeasure, true);
   document.fonts.removeEventListener('loadingdone', scheduleMeasure);
   root.removeEventListener('keydown', onKey);
   scroller.removeEventListener('scroll', schedule);
   track.removeEventListener('touchstart',onSwipeStart);
   track.removeEventListener('touchmove',onSwipeMove);
   track.removeEventListener('touchend',onSwipeEnd);
   track.removeEventListener('touchcancel',onSwipeEnd);
   scroller.removeEventListener('touchstart',onTouchStart);
   scroller.removeEventListener('touchend',onTouchEnd);
   scroller.removeEventListener('touchcancel',onTouchEnd);
   scroller.removeEventListener('wheel',onWheel);
   media.removeEventListener('change', measure);
   track.style.transform = '';
   delete root.dataset.horizontal;
   rows.forEach(row=>row.removeAttribute('data-mobile-fit'));
   root.style.removeProperty('--story-stage-height');
   root.style.removeProperty('--story-stage-top');
   root.style.removeProperty('--story-overflow');
   root.style.removeProperty('--story-distance');
   root.style.removeProperty('--story-hold');
   root.style.removeProperty('--details-distance');
  };
}
