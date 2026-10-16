function node(tag,className,text) {
 const result=document.createElement(tag);
 if (className) result.className=className;
 if (text!==undefined) result.textContent=text;
 return result;
}

function imageViewer(original,label) {
 const viewer=node('div','ux-image-viewer');
 const toolbar=node('div','ux-image-toolbar');
 toolbar.setAttribute('role','group');
 toolbar.setAttribute('aria-label','원본 이미지 확대·축소');
 const button=(text,action,ariaLabel=text)=>{
  const control=node('button','',text);
  control.type='button';
  control.dataset.zoom=action;
  control.setAttribute('aria-label',ariaLabel);
  return control;
 };
 const minus=button('−','out','이미지 축소');
 const plus=button('+','in','이미지 확대');
 const fit=button('화면 맞춤','fit');
 const actual=button('원본 크기','actual');
 const output=node('output','ux-image-zoom');
 output.setAttribute('aria-label','확대 비율');
 output.setAttribute('aria-live','polite');
 toolbar.append(minus,plus,fit,actual,output);
 const viewport=node('div','ux-image-viewport');
 viewport.tabIndex=0;
 viewport.setAttribute('role','region');
 viewport.setAttribute('aria-label',label+' 원본 이미지. 확대 후 가로·세로로 스크롤할 수 있습니다.');
 const canvas=node('div','ux-image-canvas');
 const image=node('img','ux-document-image');
 image.alt=original.alt || label+' 원본 자료';
 image.width=original.width;
 image.height=original.height;
 image.draggable=false;
 canvas.append(image);
 viewport.append(canvas);
 const note=node('p','ux-image-note','확대한 이미지는 가로·세로로 스크롤해 확인할 수 있습니다.');
 viewer.append(toolbar,viewport,note);
 let scale=1,fitScale=1;
 const controls=[minus,plus,fit,actual];
 controls.forEach(control=>{control.disabled=true;});
 const render=(next,preserveCenter=true)=>{
  const anchorX=(viewport.scrollLeft+viewport.clientWidth/2)/Math.max(1,canvas.scrollWidth);
  const anchorY=(viewport.scrollTop+viewport.clientHeight/2)/Math.max(1,canvas.scrollHeight);
  scale=Math.max(fitScale,Math.min(4,next));
  image.style.width=image.naturalWidth*scale+'px';
  output.value=Math.round(scale*100)+'%';
  minus.disabled=scale<=fitScale+.001;
  plus.disabled=scale>=4;
  fit.disabled=Math.abs(scale-fitScale)<.001;
  actual.disabled=Math.abs(scale-1)<.001;
  if (preserveCenter) {
   viewport.scrollLeft=anchorX*canvas.scrollWidth-viewport.clientWidth/2;
   viewport.scrollTop=anchorY*canvas.scrollHeight-viewport.clientHeight/2;
  } else {
   viewport.scrollLeft=0;
   viewport.scrollTop=0;
  }
 };
 const measure=()=>Math.min(1,(viewport.clientWidth-2)/image.naturalWidth,(viewport.clientHeight-2)/image.naturalHeight);
 const fitImage=()=>{
  if (!image.naturalWidth || !viewport.clientWidth || !viewport.clientHeight) return;
  fitScale=measure();
  render(fitScale,false);
 };
 const onLoad=()=>{controls.forEach(control=>{control.disabled=false;});fitImage();};
 const onError=()=>{note.textContent='이미지를 불러오지 못했습니다. 잠시 후 다시 열어주세요.';};
 image.addEventListener('load',onLoad);
 image.addEventListener('error',onError);
 image.src=original.src;
 const zoom=direction=>render(scale*(direction>0?1.25:1/1.25));
 toolbar.addEventListener('click',event=>{
  const control=event.target.closest('button[data-zoom]');
  if (!control || control.disabled) return;
  if (control===fit) fitImage();
  else if (control===actual) render(1);
  else zoom(control===plus?1:-1);
 });
 viewport.addEventListener('keydown',event=>{
  if (!image.naturalWidth) return;
  if (['+','=','-','0','1'].includes(event.key)) {
   event.preventDefault();
   if (event.key==='0') fitImage();
   else if (event.key==='1') render(1);
   else zoom(event.key==='-'?-1:1);
  }
 });
 // Trackpad pinch emits Ctrl+wheel; regular touch scrolling stays native.
 viewport.addEventListener('wheel',event=>{
  if (!(event.ctrlKey || event.metaKey) || !image.naturalWidth) return;
  event.preventDefault();
  zoom(event.deltaY<0?1:-1);
 },{passive:false});
 let pinch=null;
 const touchDistance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
 viewport.addEventListener('touchstart',event=>{
  if (event.touches.length!==2 || !image.naturalWidth) return;
  event.preventDefault();
  pinch={distance:touchDistance(event.touches),scale};
 },{passive:false});
 viewport.addEventListener('touchmove',event=>{
  if (!pinch || event.touches.length!==2) return;
  event.preventDefault();
  render(pinch.scale*touchDistance(event.touches)/Math.max(1,pinch.distance));
 },{passive:false});
 const endPinch=()=>{pinch=null;};
 viewport.addEventListener('touchend',endPinch);
 viewport.addEventListener('touchcancel',endPinch);
 const resize=new ResizeObserver(()=>{
  if (!image.naturalWidth || !viewport.clientWidth || !viewport.clientHeight) return;
  const wasFit=Math.abs(scale-fitScale)<.001;
  fitScale=measure();
  render(wasFit?fitScale:scale);
 });
 resize.observe(viewport);
 return {
  element:viewer,
  destroy:()=>{
   resize.disconnect();
   image.removeEventListener('load',onLoad);
   image.removeEventListener('error',onError);
  },
 };
}

export default function initDocumentDialog(dialog,{scroller,renderPreview}) {
 const content=dialog.querySelector('.ux-dialog-content');
 const title=dialog.querySelector('#ux-dialog-title');
 const closeButton=dialog.querySelector('.ux-dialog-heading button');
 let disposeViewer=null,restoreScroll=null,returnFocus=null;
 const lockScroll=()=>{
  const top=scroller.scrollTop,left=scroller.scrollLeft;
  const stage=returnFocus?.closest('.ux-process-stage');
  const stageLeft=stage?.scrollLeft;
  const targets=[...new Set([document.documentElement,document.body,scroller])];
  const saved=targets.map(target=>({target,styles:['overflow','overflow-x','overflow-y'].map(property=>({property,value:target.style.getPropertyValue(property),priority:target.style.getPropertyPriority(property)}))}));
  targets.forEach(target=>target.style.setProperty('overflow','hidden'));
  return ()=>{
   saved.forEach(({target,styles})=>{
    target.style.removeProperty('overflow');
    styles.forEach(({property,value,priority})=>{
     if (value) target.style.setProperty(property,value,priority);
    });
   });
   returnFocus?.focus({preventScroll:true});
   scroller.scrollTo({top,left,behavior:'instant'});
   if (stage) stage.scrollTo({left:stageLeft,behavior:'instant'});
  };
 };
 const close=()=>dialog.close();
 const onClose=()=>{
  if (dialog.open) return;
  disposeViewer?.();
  disposeViewer=null;
  restoreScroll?.();
  restoreScroll=null;
  returnFocus=null;
 };
 const onBackdrop=event=>{
  if (event.target!==dialog) return;
  const rect=dialog.getBoundingClientRect();
  if (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) close();
 };
 const onEscape=event=>{
  if (event.key!=='Escape') return;
  event.preventDefault();
  event.stopPropagation();
  close();
 };
 closeButton.addEventListener('click',close);
 dialog.addEventListener('click',onBackdrop);
 dialog.addEventListener('keydown',onEscape);
 dialog.addEventListener('close',onClose);
 const open=material=>{
  if (dialog.open) return;
  if (restoreScroll) onClose();
  returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  title.textContent=material.label;
  if (material.originalImage) {
   const viewer=imageViewer(material.originalImage,material.label);
   disposeViewer=viewer.destroy;
   content.replaceChildren(viewer.element);
   dialog.dataset.imageViewer='true';
  } else {
   content.replaceChildren(renderPreview(material));
   delete dialog.dataset.imageViewer;
  }
  restoreScroll=lockScroll();
  try {
   dialog.showModal();
   dialog.scrollTop=0;
  } catch (error) {
   onClose();
   throw error;
  }
 };
 return {
  open,
  destroy:()=>{
   if (dialog.open) dialog.close();
   onClose();
   closeButton.removeEventListener('click',close);
   dialog.removeEventListener('click',onBackdrop);
   dialog.removeEventListener('keydown',onEscape);
   dialog.removeEventListener('close',onClose);
  },
 };
}
