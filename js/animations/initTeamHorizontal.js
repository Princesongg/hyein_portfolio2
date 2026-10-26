
import initProjectHorizontal from './initProjectHorizontal.js';

export default function initTeamHorizontal(ref, prefix = 'team-story') {
  const mobile = matchMedia('(max-width:900px)');
  let cleanup = () => {};
  let initialized=false;
  const setup = () => {
    const scroller=ref.closest('.portfolio-scroll');
    const bounds=ref.getBoundingClientRect();
    const visible=initialized&&bounds.top<scroller.clientHeight&&bounds.bottom>0;
    const selected=Math.max(0,[...ref.querySelectorAll('.'+prefix+'-chapters button')].findIndex(button=>button.hasAttribute('aria-current')));
    cleanup();
    const reposition=()=>{
      if(!visible)return;
      const track=ref.querySelector('.'+prefix+'-track');
      const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
      const top=scroller.scrollTop+ref.getBoundingClientRect().top-scroller.getBoundingClientRect().top-clearance;
      if(mobile.matches){track.scrollLeft=selected*track.clientWidth;scroller.scrollTop=top;}
      else scroller.scrollTop=top+Number(track.children[selected]?.dataset.chapterOffset||0);
    };
    initialized=true;
    if (!mobile.matches) {
      ref.querySelector('.'+prefix+'-track').scrollLeft=0;
      ref.querySelector('.'+prefix+'-stage').scrollLeft=0;
      cleanup = initProjectHorizontal(ref,prefix);
      reposition();
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
    let lastWidth=track.clientWidth;
    let activePanel=selected;
    const update = () => {
      frame = 0;
      if(lastWidth!==track.clientWidth){lastWidth=track.clientWidth;track.scrollLeft=activePanel*lastWidth;}
      const active = Math.max(0, Math.min(rows.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
      activePanel=active;
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
    reposition();
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
