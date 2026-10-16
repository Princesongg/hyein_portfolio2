export default function initSkillOrbit(section) {
 const scroller = section.closest('.portfolio-scroll');
 const stage = section.querySelector('.skill-stage');
 const orbit = section.querySelector('.skill-orbit');
 const icons = [...orbit.children];
 const media = window.matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0;
 const clamp = value => Math.max(0,Math.min(1,value));
 const update = () => {
  frame = 0;
  if (media.matches) return;
  const top = section.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  const progress = clamp(-top/(scroller.clientHeight*1.2));
  const entry = clamp((progress-.025)/.28);
  const expansion = clamp(progress/.75);
  const growth = expansion*expansion*(3-2*expansion);
  const rotation = progress*Math.PI*2;
  const fullRadius = orbit.clientWidth*.4;
  const radius = fullRadius*(.35+.65*growth);
  const orbitCenter = orbit.getBoundingClientRect().top-stage.getBoundingClientRect().top+orbit.clientHeight/2;
  const startCenter = section.querySelector('.skill-heading').getBoundingClientRect().bottom-stage.getBoundingClientRect().top+25;
  const lift = scroller.clientWidth <= 700 ? 24 : 60;
  const centerOffset = (startCenter-orbitCenter)*(1-growth)-lift*growth;
  const verticalRadius = 32*(1-growth)+65*growth;
  icons.forEach((icon,index) => {
   const angle = index/icons.length*Math.PI*2+rotation;
   const depth = Math.sin(angle);
   const reveal = clamp(entry*1.4-index/icons.length*.4);
   const eased = reveal*reveal*(3-2*reveal);
   const scatterX = Math.sin(index*1.7)*30*(1-growth);
   const scatterY = Math.cos(index*2.3)*35*(1-growth);
   const x = Math.cos(angle)*radius+scatterX;
   const y = centerOffset+depth*verticalRadius+scatterY-(1-eased)*45;
   const scale = (.65+(depth+1)*.2)*(.45+.55*growth)*(.85+.15*eased);
   icon.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${depth*65*growth}px) rotateY(${-Math.cos(angle)*18*growth}deg) rotate(${Math.cos(angle)*7*growth}deg) scale(${scale})`;
   icon.style.opacity = String(eased*(.5+(depth+1)*.25));
   icon.style.zIndex = String(Math.round((depth+1)*10));
  });
 };
 const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
 const measure = () => {
  section.dataset.motion = String(!media.matches);
  section.style.setProperty('--skill-stage-height',`${stage.offsetHeight}px`);
  if (media.matches) icons.forEach(icon => {icon.style.transform='';icon.style.opacity='';icon.style.zIndex='';});
  schedule();
 };
 const observer = new ResizeObserver(measure);
 observer.observe(stage);
 observer.observe(scroller);
 scroller.addEventListener('scroll',schedule,{passive:true});
 media.addEventListener('change',measure);
 measure();
 return () => {
  cancelAnimationFrame(frame);
  observer.disconnect();
  scroller.removeEventListener('scroll',schedule);
  media.removeEventListener('change',measure);
  delete section.dataset.motion;
  section.style.removeProperty('--skill-stage-height');
  icons.forEach(icon => {icon.style.transform='';icon.style.opacity='';icon.style.zIndex='';});
 };
}
