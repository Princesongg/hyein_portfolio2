import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {aboutPostcards} from '../../data/about/postcards.js';
import {createFanLayout,fanState} from './fanLayout.js';

gsap.registerPlugin(ScrollTrigger);
const cleanupKey=Symbol.for('portfolio.about.memoryFan.cleanup');

export default function initAboutPostcards(section) {
 section[cleanupKey]?.();
 const stage=section.querySelector('.about-postcards-stage');
 const deck=section.querySelector('.memory-fan-deck');
 const heading=section.querySelector('.memory-fan-heading');
 const hint=section.querySelector('.memory-fan-hint');
 const story=section.querySelector('.about-postcards-letter');
 const scroller=section.closest('.portfolio-scroll');
 const events=new AbortController();
 const listen=(target,type,handler,options={})=>target.addEventListener(type,handler,{...options,signal:events.signal});
 const fragment=document.createDocumentFragment();
 const photos=aboutPostcards.slice(0,12);
 const cards=photos.map((item,index)=>{
  const card=document.createElement('div');card.className='memory-fan-card';card.setAttribute('role','listitem');
  const button=document.createElement('button');button.type='button';button.className='memory-fan-photo';
  button.setAttribute('aria-label',`추억 사진 ${index+1} 크게 보기`);button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','about-photo-focus');
  const image=document.createElement('img');image.src=item.image;image.alt=item.alt||'간직하고 싶은 일상의 순간';
  image.loading='eager';image.decoding='async';image.draggable=false;
  button.append(image);card.append(button);fragment.append(card);return card;
 });
 deck.append(fragment);

 const dialog=document.createElement('dialog');dialog.id='about-photo-focus';dialog.className='about-photo-focus';dialog.setAttribute('aria-label','추억 사진 확대 보기');
 const closeButton=document.createElement('button');closeButton.type='button';closeButton.className='about-photo-focus-close';
 closeButton.textContent='×';closeButton.setAttribute('aria-label','확대 사진 닫기');closeButton.autofocus=true;
 const figure=document.createElement('figure'),focusImage=document.createElement('img');figure.append(focusImage);dialog.append(closeButton,figure);section.append(dialog);
 let disposed=false,opener=null,overflow='',savedScroll=0,media=null,timeline=null,resizeFrame=0;
 let layout=null,previousActive=-2;
 const render=progress=>{
  if(!layout) return;
  const state=fanState(layout,progress);
  const g=state.group;
  const groupTransform=`translate3d(${g.x}px,${g.y}px,${g.z}px) rotateX(${g.rx}deg) rotateY(${g.ry}deg) rotateZ(${g.rz}deg)`;
  if(deck.style.transform!==groupTransform) deck.style.transform=groupTransform;
  cards.forEach((card,index)=>{
   const p=state.cards[index];
   const transform=`translate3d(${p.x.toFixed(3)}px,${p.y.toFixed(3)}px,${p.z.toFixed(3)}px) translate(-50%,-50%) rotateY(${p.ry.toFixed(4)}deg) rotateZ(${p.rz.toFixed(4)}deg) scale(${p.scale.toFixed(6)})`;
   if(card.style.transform!==transform) card.style.transform=transform;
   card.style.opacity=p.opacity.toFixed(4);
   // Keep DOM stacking stable; the preserve-3d scene sorts continuous Z depths.
   card.style.zIndex=String(cards.length-index);
   const visible=p.opacity>.04;
   card.style.visibility=visible?'visible':'hidden';
   card.style.pointerEvents=visible?'':'none';
   card.setAttribute('aria-hidden',String(!visible));
   card.querySelector('button').tabIndex=visible?0:-1;
  });
  if(previousActive!==state.activeIndex) {
   cards.forEach((card,index)=>card.classList.toggle('is-active',index===state.activeIndex));
   previousActive=state.activeIndex;
  }
  heading.style.opacity=state.titleOpacity;
  if(section.classList.contains('has-inline-story')) {
   story.style.opacity=state.titleOpacity;
   story.style.visibility=state.titleOpacity<.001?'hidden':'visible';
  }
  heading.style.transform=`translateY(${(1-state.titleScale)*-140}px) scale(${state.titleScale})`;
  hint.style.opacity=state.hintOpacity;
  section.dataset.fanProgress=progress.toFixed(4);
 };
 const measure=()=>{
  layout=createFanLayout(stage.clientWidth,stage.clientHeight,cards.length);
  stage.style.setProperty('--fan-card-width',`${layout.cardWidth}px`);
  const space=section.querySelector('.memory-fan-space');
  space.style.left=`${layout.area.left}px`;space.style.top=`${layout.area.top}px`;
  space.style.width=`${layout.area.width}px`;space.style.height=`${layout.area.height}px`;
 };
 const refresh=()=>{
  cancelAnimationFrame(resizeFrame);
  resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;if(!disposed) ScrollTrigger.refresh();});
 };
 const resetCards=()=>{
  previousActive=-2;
  cards.forEach(card=>{card.removeAttribute('style');card.removeAttribute('aria-hidden');card.classList.remove('is-active');card.querySelector('button').tabIndex=0;});
  heading.removeAttribute('style');hint.removeAttribute('style');
  story.style.removeProperty('opacity');
  story.style.removeProperty('visibility');
  deck.style.removeProperty('transform');
  section.querySelector('.memory-fan-space').removeAttribute('style');
 };
 const setup=()=>{
  if(disposed) return;
  section.classList.add('is-fan-ready');
  media=gsap.matchMedia();
  media.add({reduced:'(prefers-reduced-motion: reduce)',mobile:'(max-width:700px)',desktop:'(min-width:701px)'},context=>{
   resetCards();
   if(context.conditions.reduced) {
    section.classList.add('is-memory-static');
    return ()=>section.classList.remove('is-memory-static');
   }
   if(!context.conditions.mobile) {
    stage.append(story);
    section.classList.add('has-inline-story');
   }
   measure();
   const playhead={progress:0};
   // Keep the gallery pinned for one additional viewport while Q&A covers it.
   const photoDistance=()=>scroller.clientHeight*(context.conditions.mobile?4.4:5.25);
   const transitionDistance=()=>context.conditions.mobile?0:scroller.clientHeight;
   const transitionRatio=()=>transitionDistance()/photoDistance();
   timeline=gsap.timeline({
    onUpdate:()=>render(playhead.progress),
    scrollTrigger:{id:'about-memory-fan',trigger:stage,scroller,start:'top top',
     end:()=>`+=${photoDistance()+transitionDistance()}`,
     pin:stage,pinType:'transform',pinSpacing:true,scrub:1.2,invalidateOnRefresh:true,anticipatePin:1,
     onRefresh:()=>{measure();render(playhead.progress);}},
   });
   timeline.to(playhead,{progress:1,duration:100,ease:'none'});
   if(!context.conditions.mobile) {
    timeline.to(stage,{'--memory-cover-dim':.30,duration:100*transitionRatio(),ease:'none'});
   }
   render(playhead.progress);
   return ()=>{
    timeline?.scrollTrigger?.kill();timeline?.kill();timeline=null;
    section.insertBefore(story,dialog);
    section.classList.remove('has-inline-story');
    resetCards();stage.style.removeProperty('--fan-card-width');
    stage.style.removeProperty('--memory-cover-dim');
   };
  },section);
  refresh();
 };
 // Decode the selected images before measuring so each frame keeps its real aspect ratio.
 Promise.all(cards.map(card=>card.querySelector('img').decode().catch(()=>{}))).then(setup);
 document.fonts.ready.then(()=>{if(media&&!disposed) refresh();});
 let previousWidth=scroller.clientWidth,previousHeight=scroller.clientHeight;
 const resize=new ResizeObserver(()=>{
  const width=scroller.clientWidth,height=scroller.clientHeight;
  if(width===previousWidth&&height===previousHeight) return;
  previousWidth=width;previousHeight=height;if(media) refresh();
 });
 resize.observe(scroller);
 listen(window,'load',()=>{if(media) refresh();},{once:true});

 const finishFocus=()=>{
  if(!opener) return;
  scroller.style.overflowY=overflow;scroller.scrollTop=savedScroll;
  const button=opener;opener=null;
  if(!disposed) button.focus({preventScroll:true});
 };
 listen(deck,'click',event=>{
  const button=event.target.closest('.memory-fan-photo');
  if(!button||dialog.open) return;
  const card=button.closest('.memory-fan-card');
  if(card.getAttribute('aria-hidden')==='true') return;
  // Finish the small scrub catch-up before opening, then preserve the exact scroll pose.
  timeline?.scrollTrigger?.getTween()?.progress(1);
  opener=button;overflow=scroller.style.overflowY;savedScroll=scroller.scrollTop;
  const source=button.querySelector('img');focusImage.src=source.src;focusImage.alt=source.alt;
  scroller.style.overflowY='hidden';dialog.showModal();
 });
 listen(closeButton,'click',()=>dialog.close());
 listen(dialog,'close',finishFocus);
 listen(dialog,'keydown',event=>{if(event.key==='Tab') {event.preventDefault();closeButton.focus();}});
 let outsideDown=false;
 const outside=event=>{const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
 listen(dialog,'pointerdown',event=>{outsideDown=event.target===dialog&&outside(event);});
 listen(dialog,'click',event=>{if(outsideDown&&event.target===dialog&&outside(event)) dialog.close();outsideDown=false;});
 listen(section.querySelector('.memory-fan-skip'),'click',event=>{
  event.preventDefault();
  if(section.classList.contains('has-inline-story')) {story.focus({preventScroll:true});return;}
  const top=scroller.scrollTop+story.getBoundingClientRect().top-scroller.getBoundingClientRect().top-110;
  timeline?.scrollTrigger?.getTween()?.progress(1);
  scroller.scrollTo({top,behavior:'instant'});story.focus({preventScroll:true});
 });
 const cleanup=()=>{
  if(disposed) return;
  disposed=true;
  if(dialog.open) dialog.close();finishFocus();
  events.abort();resize.disconnect();cancelAnimationFrame(resizeFrame);media?.revert();
  dialog.remove();cards.forEach(card=>card.remove());
  section.classList.remove('is-fan-ready','is-memory-static');
  delete section.dataset.fanProgress;stage.style.removeProperty('--fan-card-width');
  if(section[cleanupKey]===cleanup) delete section[cleanupKey];
 };
 section[cleanupKey]=cleanup;
 return cleanup;
}
