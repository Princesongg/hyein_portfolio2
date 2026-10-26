export default function initReadyApproach(root) {
 if(!root)return;
 const buttons=[...root.querySelectorAll('.ready-approach-option')];
 const descriptions=[...root.querySelectorAll('.ready-approach-description')];
 const status=root.querySelector('.ready-approach-status');
 const select=button=>{
  if(button.getAttribute('aria-pressed')==='true')return;
  const id=button.getAttribute('aria-controls');
  buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  descriptions.forEach(description=>{
   const selected=description.id===id;
   description.classList.toggle('is-selected',selected);
   description.setAttribute('aria-hidden',String(!selected));
   description.inert=!selected;
  });
  const description=descriptions.find(item=>item.id===id);
  status.textContent=`${button.querySelector('.ready-approach-word').textContent}. ${description.querySelector('h3').textContent}. ${description.querySelector('p').textContent}`;
 };
 const onClick=event=>{
  const button=event.target.closest('.ready-approach-option');
  if(button)select(button);
 };
 const onKey=event=>{
  const index=buttons.indexOf(event.target);
  if(index<0||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
  buttons[next].focus({preventScroll:true});
  select(buttons[next]);
 };
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const reveal=()=>{root.dataset.reveal='visible';observer?.disconnect();};
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting))reveal();
 },{root:root.closest('.portfolio-scroll'),threshold:.12});
 const onMotionChange=()=>{if(reduced.matches)reveal();};
 if(reduced.matches)reveal();
 else {root.dataset.reveal='pending';observer.observe(root);}
 root.addEventListener('click',onClick);
 root.addEventListener('keydown',onKey);
 reduced.addEventListener('change',onMotionChange);
 return ()=>{
  observer.disconnect();reduced.removeEventListener('change',onMotionChange);
  root.removeEventListener('click',onClick);root.removeEventListener('keydown',onKey);
  delete root.dataset.reveal;
 };
}
