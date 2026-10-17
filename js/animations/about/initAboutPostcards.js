import {aboutPostcards} from '../../data/about/postcards.js';

const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => {const t=clamp(value); return t*t*(3-2*t);};
const mix = (a,b,t) => a+(b-a)*t;
const boundedSize = value => Math.max(.86,Math.min(1.12,value));
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
// A full-screen floating collection: six columns, four loose rows.
const scatteredArchive = Array.from({length:24},(_,index)=>[
 .095+(index%6)*.162,
 .25+Math.floor(index/6)*.195+[-.018,.012,-.008,.025,-.012,.006][index%6],
]);
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
// Keep all 24 memories in view and reserve a clear center for the title.
const collage = Array.from({length:24},(_,index)=>{
 const size=[1.06,.92,1.12,.86,1.02,.96][index%6];
 const angle=[-7,5,-4,6,-5,3][index%6];
 if(index<8) return [.07+index*(.86/7),.23,size,angle];
 if(index<16) return [.07+(index-8)*(.86/7),.82,size,angle];
 const side=index-16;
 return [[.075,.205,.795,.925][side%4],side<4?.43:.62,size,angle];
});
const mobileCollage = Array.from({length:24},(_,index)=>[
 .14+(index%4)*.24,
 [.19,.29,.39,.68,.785,.89][Math.floor(index/4)],
 [1.04,.94,1.08,.9][index%4],
 [-6,4,-3,5][index%4],
]);
// Six restrained columns collect into the right-hand editorial gallery.
const letterStamps = Array.from({length:24},(_,index)=>[
 .075+(index%6)*.17,
 .10+Math.floor(index/6)*.26+[-.03,.01,-.015,.025,-.01,.02][index%6],
 [.86,1.08,.94,1.02,.9,1.12][index%6],
 [-9,6,-5,8,-7,4][index%6],
]);

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
  card.setAttribute('role','listitem');
  const picture=document.createElement('div');
  picture.className='about-postcard-window';
  const image=document.createElement('img');
  image.src=item.image;
  image.alt=`Personal memory ${item.id}`;
  image.width=480;
  image.height=640;
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
   // Space by arc length with deliberate gaps and room for larger photos.
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
  // Hold the finished editorial while the next section slides over the sticky stage.
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
  const cardHeights=cards.map(card=>card.offsetHeight);
  cards.forEach((card,index)=>{
   const fraction=index/(cards.length-1);
   const [dx,dy,scatterSize,scatterAngle]=scatterRhythm[index];
   const [,waveSize,waveAngle,waveOffset]=waveRhythm[index];
   const scatterX=width*(mobile ? .14+(index%4)*.24+dx*.15 : scatteredArchive[index][0]+dx*.2);
   const scatterY=height*(mobile ? .225+Math.floor(index/4)*.134+dy*.1 : scatteredArchive[index][1]+dy*.2);
   // One serpentine route instead of a straight row or rotating ring.
   const {x:flowX,y:flowY,normalX,normalY}=flowPoints[index];
   const flowAngle=Math.sin(fraction*Math.PI*3+1)*11+waveAngle;
   const [cx,cy,size,angle]=(mobile?mobileCollage:collage)[index];
   let x=mix(mix(scatterX,flowX,gather),cx*width,spread);
   let y=mix(mix(scatterY,flowY,gather),cy*height,spread);
   // Keep the dotted line smooth; let individual photos stray across it.
   points.push([x,y]);
   const drift=cardWidth*waveOffset*gather*(1-spread);
   x+=normalX*drift;
   y+=normalY*drift;
   const collect=ease((progress-.84-(index%4)*.008)/.19);
   const [lx,ly,letterSize,letterAngle]=letterStamps[index];
   const letterX=width*(mobile ? .09+(index%6)*.164 : .52+lx*.43);
   const letterY=height*(mobile ? .575+Math.floor(index/6)*.106+[-.004,.006,-.003,.004,-.006,.002][index%6] : .24+ly*.64);
   x=mix(x,letterX,collect);
   y=mix(y,letterY,collect);
   const rotation=mix(mix(mix(scatterAngle*.32,flowAngle*.25,gather),angle*.3,spread),letterAngle*.25,collect);
   const cardHeight=cardHeights[index];
   const editorialScale=Math.min(letterSize*(mobile?.72:.66),width*(mobile?.145:.062)*letterSize/cardWidth,height*(mobile?.09:.155)/cardHeight);
   const titleScale=Math.min((mobile?.78:.72)*boundedSize(size),height*(mobile?.091:.18)/cardHeight);
   const scatterScale=Math.min((mobile?.85:.76)*boundedSize(scatterSize),height*(mobile?.13:.17)/cardHeight);
   const scale=mix(mix(mix(scatterScale,(mobile?.62:.52)*Math.min(waveSize,1.15),gather),titleScale,spread),editorialScale,collect);
   // Rotated geometry stays clear of the viewport edges and fixed navigation.
   const radians=rotation*Math.PI/180;
   const halfWidth=(Math.abs(Math.cos(radians))*cardWidth+Math.abs(Math.sin(radians))*cardHeight)*scale/2;
   const halfHeight=(Math.abs(Math.sin(radians))*cardWidth+Math.abs(Math.cos(radians))*cardHeight)*scale/2;
   const inset=mobile?8:18;
   x=Math.max(inset+halfWidth,Math.min(width-inset-halfWidth,x));
   y=Math.max(Math.max(106,height*.11)+halfHeight,Math.min(height-inset-halfHeight,y));
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
