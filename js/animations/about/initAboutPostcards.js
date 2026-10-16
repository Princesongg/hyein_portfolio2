import {aboutPostcards} from '../../data/about/postcards.js';

const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => {const t=clamp(value); return t*t*(3-2*t);};
const mix = (a,b,t) => a+(b-a)*t;
// Small, intentional offsets preserve the original scattered composition.
// x offset / y offset / relative size / rotation. Five pieces act as anchors.
const scatterRhythm = [
 [0,.008,.86,-9],[-.018,-.030,1.06,7],[.013,.030,.76,-6],
 [-.022,-.032,1.50,12],[.022,.036,.88,-11],[-.012,-.025,1.10,5],
 [.018,.035,1.44,-13],[-.015,-.035,.80,9],[.013,.028,1.02,-7],
 [-.018,-.026,.86,13],[.018,.030,1.50,-9],[-.014,-.030,.72,6],
 [.020,.034,1.12,10],[-.020,-.028,.81,-12],[.012,.025,.98,7],
 [-.014,-.030,.88,-5],[.018,.034,1.46,13],[-.018,-.026,.76,-9],
 [.015,.032,1.08,6],[-.020,-.030,.86,-13],[.018,.028,1.40,10],
 [-.015,-.030,.80,-7],[.012,.034,1.10,11],[0,-.024,.92,-6],
];
// Balanced clusters laid over two envelopes, with a clear diagonal reading flow.
const scatteredArchive = [
 [.065,.26],[.15,.57],[.12,.80],[.235,.35],[.255,.67],[.36,.205],
 [.39,.50],[.36,.81],[.49,.30],[.52,.70],[.61,.43],[.56,.84],
 [.70,.235],[.68,.655],[.775,.38],[.74,.81],[.84,.58],[.91,.29],
 [.90,.77],[.965,.49],[.115,.415],[.475,.565],[.88,.185],[.605,.18],
];
// Gap rhythm / relative size / rotation offset / displacement from the route.
// Fixed art direction makes reverse scrolling and resizing deterministic.
const waveRhythm = [
 [1,1.05,-8,-.12],[.87,.84,7,.14],[1.15,1.18,-5,-.08],
 [.92,.93,10,.18],[1.08,1.28,-9,-.13],[.86,.82,4,.09],
 [1.17,1.12,-11,.16],[.91,.95,8,-.18],[1.09,1.34,-6,.12],
 [.88,.86,12,-.10],[1.16,1.16,-7,.17],[.93,.91,5,-.15],
 [1.10,1.25,9,.08],[.85,.80,-10,-.16],[1.18,1.08,6,.14],
 [.90,.94,-4,-.09],[1.12,1.30,11,.18],[.87,.85,-8,-.12],
 [1.14,1.12,5,.10],[.92,.92,-12,-.17],[1.08,1.22,8,.15],
 [.89,.83,-6,-.08],[1.16,1.10,10,.12],[.96,.96,-5,-.10],
];
// x / y / size / angle. Leave the center open; crop selected edge pieces.
const collage = [
 [-.01,.27,1.28,-12],[.13,.23,.83,8],[.27,.24,1.16,-6],[.42,.19,.73,11],
 [.55,.25,1.24,-8],[.70,.20,.84,7],[.85,.26,1.30,10],[1.01,.22,.95,-13],
 [.05,.48,.79,9],[.19,.44,1.04,-11],[.80,.47,.85,-8],[.96,.48,1.15,12],
 [-.02,.73,1.35,8],[.13,.69,.74,-7],[.28,.73,1.10,10],[.42,.77,.80,-12],
 [.57,.74,1.15,6],[.72,.72,.71,-9],[.86,.75,1.23,-7],[1.02,.78,.86,14],
 [.20,.96,.91,-8],[.38,.98,1.08,7],[.61,.98,.79,-12],[.78,.98,1.02,9],
];
const mobileCollage = [
 [-.02,.22,1.10,-12],[.24,.19,.84,8],[.51,.23,1.05,-6],[.80,.18,.78,11],
 [1.02,.30,1.10,-8],[.12,.34,.87,7],[.37,.34,.70,10],[.70,.33,.95,-13],
 [-.02,.48,.84,9],[.14,.61,.78,-11],[.89,.60,.82,-8],[1.02,.46,1.04,12],
 [-.03,.76,1.05,8],[.31,.68,.76,-7],[.59,.68,.98,10],[.82,.76,.75,-12],
 [.19,.83,.90,6],[.44,.83,.74,-9],[.65,.86,.91,-7],[1.04,.86,1.12,14],
 [.02,.98,.79,-8],[.32,1,.96,7],[.57,1.02,.82,-12],[.86,1.02,.95,9],
];
// Positions on the right-hand postcard: loose rows, varied sizes and angles.
const letterStamps = [
 [.10,.09,.88,-14],[.35,.04,1.02,8],[.61,.12,.76,-9],[.86,.06,.94,14],
 [.18,.28,.72,11],[.44,.24,.84,-17],[.71,.31,1.01,7],[.94,.26,.69,-12],
 [.04,.48,.81,-8],[.31,.45,.96,13],[.57,.47,.72,-15],[.84,.47,.91,8],
 [.15,.68,.95,12],[.43,.65,.71,-7],[.67,.68,.89,16],[.95,.66,.76,-10],
 [.06,.87,.72,-13],[.32,.89,.88,8],[.58,.87,1.02,-7],[.85,.90,.78,15],
 [.24,.16,.63,-20],[.55,.36,.66,18],[.20,.77,.67,-16],[.76,.79,.65,19],
];

export default function initAboutPostcards(section) {
 const scroller=section.closest('.portfolio-scroll');
 const stage=section.querySelector('.about-postcards-stage');
 const container=section.querySelector('.about-postcards-cards');
 const caption=section.querySelector('.about-postcards-caption');
 const nextSection=section.nextElementSibling;
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fragment=document.createDocumentFragment();
 const cards=aboutPostcards.map(item=>{
  const card=document.createElement('div');
  card.className='about-postcard';
  const picture=document.createElement('div');
  picture.className='about-postcard-window';
  const image=document.createElement('img');
  image.src=item.image;
  image.alt='';
  image.loading='lazy';
  image.decoding='async';
  picture.append(image);
  card.append(picture);
  fragment.append(card);
  return card;
 });
 container.append(fragment);
 const svgNS='http://www.w3.org/2000/svg';
 const route=document.createElementNS(svgNS,'svg');
 route.classList.add('about-postcards-route');
 route.setAttribute('aria-hidden','true');
 const path=document.createElementNS(svgNS,'path');
 route.append(path);
 stage.insertBefore(route,container);
 let frame=0,last=0,current=0,active=false;
 let flowWidth=0,flowHeight=0,flowPoints=[];
 const update=time=>{
  frame=0;
  if(media.matches) {
   cards.forEach(card=>{card.style.transform='';card.style.opacity='';});
   stage.style.removeProperty('--letter');
   stage.style.removeProperty('--qa-dim');
   stage.style.removeProperty('--archive-fade');
   caption.style.opacity='';
   route.style.opacity='0';
   last=0;
   return;
  }
  if(!active) {last=0;return;}
  const width=stage.clientWidth,height=stage.clientHeight;
  const mobile=width<700;
  if(width!==flowWidth||height!==flowHeight) {
   flowWidth=width;flowHeight=height;
   // Space by arc length with deliberate gaps and room for larger stamps.
   const samples=[];
   let distance=0;
   for(let i=0;i<=200;i++) {
    const t=i/200;
    const x=mobile?width*(.5+Math.sin(t*Math.PI*3-.7)*.32):width*(.035+t*.93);
    const y=mobile?height*(.17+t*.69):height*(.48+Math.sin(t*Math.PI*3-.7)*.23);
    if(i) distance+=Math.hypot(x-samples[i-1].x,y-samples[i-1].y);
    samples.push({x,y,distance});
   }
   const stops=[0];
   for(let i=1;i<cards.length;i++) {
    const gap=waveRhythm[i][0]*(waveRhythm[i-1][1]+waveRhythm[i][1])/2;
    stops.push(stops[i-1]+gap);
   }
   flowPoints=cards.map((_,index)=>{
    const at=stops[index]/stops[stops.length-1]*distance;
    const end=samples.findIndex(point=>point.distance>=at);
    const b=samples[Math.max(0,end)],a=samples[Math.max(0,end-1)];
    const t=(at-a.distance)/Math.max(1,b.distance-a.distance);
    const before=samples[Math.max(0,end-1)],after=samples[Math.min(200,end+1)];
    const length=Math.max(1,Math.hypot(after.x-before.x,after.y-before.y));
    return {
     x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),
     normalX:-(after.y-before.y)/length,normalY:(after.x-before.x)/length,
    };
   });
  }
  const top=section.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  const nextTop=nextSection.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  const cover=clamp(1-nextTop/height);
  stage.style.setProperty('--qa-dim',String(ease(cover)*.45));
  // Hold the finished letter while the next section slides over the sticky stage.
  const target=clamp(-top/Math.max(1,section.offsetHeight-height*2));
  const dt=last?Math.min(64,time-last):16;
  current+=(target-current)*(1-Math.exp(-dt/100));
  if(Math.abs(current-target)<.0005) current=target;
  const progress=current*1.20;
  const gather=ease((progress-.06)/.25);
  stage.style.setProperty('--archive-fade',String(1-ease((progress-.08)/.23)));
  const spread=ease((progress-.49)/.23);
  const letter=ease((progress-.84)/.22);
  stage.style.setProperty('--letter',String(letter));
  route.setAttribute('viewBox',`0 0 ${width} ${height}`);
  route.style.opacity=String(ease((progress-.36)/.10)*(1-ease((progress-.52)/.16)));
  const points=[];
  const cardWidth=cards[0].offsetWidth;
  cards.forEach((card,index)=>{
   const fraction=index/(cards.length-1);
   const [dx,dy,scatterSize,scatterAngle]=scatterRhythm[index];
   const [,waveSize,waveAngle,waveOffset]=waveRhythm[index];
   const scatterX=width*(mobile ? .05+fraction*.90+dx : scatteredArchive[index][0]);
   const scatterY=height*(mobile ? .17+((index*7)%17)/17*.66+dy : scatteredArchive[index][1]);
   // One serpentine route instead of a straight row or rotating ring.
   const {x:flowX,y:flowY,normalX,normalY}=flowPoints[index];
   const flowAngle=Math.sin(fraction*Math.PI*3+1)*11+waveAngle;
   const [cx,cy,size,angle]=(mobile?mobileCollage:collage)[index];
   let x=mix(mix(scatterX,flowX,gather),cx*width,spread);
   let y=mix(mix(scatterY,flowY,gather),cy*height,spread);
   // Keep the dotted line smooth; let individual stamps stray across it.
   points.push([x,y]);
   const drift=cardWidth*waveOffset*gather*(1-spread);
   x+=normalX*drift;
   y+=normalY*drift;
   const collect=ease((progress-.84-(index%4)*.008)/.19);
   const [lx,ly,letterSize,letterAngle]=letterStamps[index];
   const letterX=width*(mobile ? .09+lx*.82 : .51+lx*.43);
   const letterY=height*(mobile ? .57+ly*.34 : .24+ly*.64);
   x=mix(x,letterX,collect);
   y=mix(y,letterY,collect);
   const rotation=mix(mix(mix(scatterAngle,flowAngle,gather),angle,spread),letterAngle,collect);
   const scale=mix(mix(mix((mobile ? .48 : .57)*scatterSize,.34*waveSize,gather),size,spread),letterSize*(mobile ? .62 : .88),collect);
   card.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${rotation}deg) scale(${scale})`;
   card.style.opacity='1';
  });
  // Catmull-Rom-derived Beziers track the moving photo centers.
  let d=`M ${points[0].join(' ')}`;
  for(let i=0;i<points.length-1;i++) {
   const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],e=points[Math.min(points.length-1,i+2)];
   d+=` C ${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6},${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6},${c.join(' ')}`;
  }
  path.setAttribute('d',d);
  caption.style.opacity=String(ease((progress-.66)/.10)*(1-ease((progress-.82)/.06)));
  last=time;
  if(current!==target) frame=requestAnimationFrame(update);
  else last=0;
 };
 const schedule=()=>{if(!frame&&(active||media.matches)) frame=requestAnimationFrame(update);};
 const visibility=new IntersectionObserver(entries=>{
  active=entries.some(entry=>entry.isIntersecting);
  section.classList.toggle('is-postcards-active',active&&!media.matches);
  if(active) schedule();
  else {cancelAnimationFrame(frame);frame=0;last=0;}
 },{root:scroller,rootMargin:'100% 0px'});
 visibility.observe(section);
 const motionChange=()=>{
  section.classList.toggle('is-postcards-active',active&&!media.matches);
  schedule();
 };
 const resize=new ResizeObserver(schedule);
 resize.observe(stage);
 scroller.addEventListener('scroll',schedule,{passive:true});
 media.addEventListener('change',motionChange);
 schedule();
 return ()=>{
  cancelAnimationFrame(frame);
  resize.disconnect();
  visibility.disconnect();
  scroller.removeEventListener('scroll',schedule);
  media.removeEventListener('change',motionChange);
  section.classList.remove('is-postcards-active');
  cards.forEach(card=>card.remove());
  route.remove();
  caption.style.opacity='';
  stage.style.removeProperty('--letter');
  stage.style.removeProperty('--qa-dim');
  stage.style.removeProperty('--archive-fade');
 };
}
