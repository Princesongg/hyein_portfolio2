export default function initMobileMenu(root) {
 const header=root.querySelector('.portfolio-header');
 const toggle=header.querySelector('.mobile-menu-toggle');
 const scroller=root.querySelector('.portfolio-scroll');
 const mobile=matchMedia('(max-width:700px)');
 let open=false;
 let previousOverflow='';
 let previousInert=false;
 const setOpen=(next,restoreFocus=false)=>{
  next=next&&mobile.matches;
  if(next===open)return;
  if(next){previousOverflow=scroller.style.overflowY;previousInert=scroller.inert;}
  open=next;
  header.classList.toggle('mobile-menu-is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
  scroller.style.overflowY=open?'hidden':previousOverflow;
  scroller.inert=open||previousInert;
  if(restoreFocus)toggle.focus({preventScroll:true});
 };
 const onToggle=()=>setOpen(!open);
 const onNavigate=event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  setOpen(false);
  if(!mobile.matches||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if(!target)return;
  event.preventDefault();
  // A section's existing top padding already reserves space for the menu.
  const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
  const reserved=parseFloat(getComputedStyle(target).paddingTop)||0;
  const offset=Math.max(0,clearance-reserved);
  const top=scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-offset;
  scroller.scrollTo({top:Math.max(0,top),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  history.replaceState(null,'',link.hash);
 };
 const onOutside=event=>{if(open&&!header.contains(event.target))setOpen(false,true);};
 const onKey=event=>{
  if(!open)return;
  if(event.key==='Escape'){event.preventDefault();setOpen(false,true);}
  if(event.key==='Tab'){
   const items=[...header.querySelectorAll('a,button')];
   const first=items[0],last=items.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 };
 const onResize=()=>{if(!mobile.matches)setOpen(false);};
 toggle.addEventListener('click',onToggle);
 header.addEventListener('click',onNavigate);
 document.addEventListener('pointerdown',onOutside);
 document.addEventListener('keydown',onKey);
 mobile.addEventListener('change',onResize);
 window.addEventListener('resize',onResize);
 return ()=>{
  setOpen(false);
  toggle.removeEventListener('click',onToggle);
  header.removeEventListener('click',onNavigate);
  document.removeEventListener('pointerdown',onOutside);
  document.removeEventListener('keydown',onKey);
  mobile.removeEventListener('change',onResize);
  window.removeEventListener('resize',onResize);
 };
}
