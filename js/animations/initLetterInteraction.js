import { gsap } from 'gsap';

export default function initLetterInteraction(rootRef) {
  const root = rootRef;
  const button = root.querySelector('.letter');
  const image = button.querySelector('img');
  const pieces = [button, root.querySelector('.con1-letter-position')];
  const context = gsap.context(() => {}, root);
  let drag = null;
  let entering = false;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   entering = true;
   let disposed = false;
   // A close foreground card slides onto the scene, separate from the flying mail.
   const entrance = gsap.timeline({
    paused:true,
    onComplete:() => { entering = false; },
   });
   entrance
    .set(pieces, {x:-340, y:240, autoAlpha:0})
    .to(pieces, {autoAlpha:1, duration:.4}, .45)
    .to(pieces, {x:0, y:0, duration:1.75, ease:'power3.out'}, .45);
   Promise.all(pieces.map(piece => {
    const img = piece.querySelector('img');
    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
   })).then(() => {if (!disposed) entrance.play(0);});
   return () => {disposed = true; entering = false;};
  }, rootRef);
  const duration = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .65;
  context.add('move', (x, y, held = false) => {
   if (entering) return;
   gsap.to(pieces, {x, y, duration:held ? .12 : duration(), ease:held ? 'power2.out' : 'back.out(1.25)', overwrite:true});
   gsap.to(image, {filter:held ? 'drop-shadow(0 18px 18px rgba(64, 92, 145, .18))' : 'drop-shadow(0 0 0 rgba(64, 92, 145, 0))',duration:.25,overwrite:true});
  });
  const enter = () => {if (!drag) context.move(0,-12,true);};
  const leave = () => {if (!drag) context.move(0,0);};
  const down = event => {
   if (entering || event.button !== 0 || event.pointerType === 'touch') return;
   event.preventDefault();
   drag = {x:event.clientX,y:event.clientY,id:event.pointerId};
   button.setPointerCapture(event.pointerId);
   button.classList.add('is-grabbed');
   context.move(0,-12,true);
  };
  const move = event => {
   if (!drag || event.pointerId !== drag.id) return;
   const scale = root.clientWidth/1920;
   context.move(gsap.utils.clamp(-140,140,(event.clientX-drag.x)/scale),gsap.utils.clamp(-90,70,(event.clientY-drag.y)/scale)-12,true);
  };
  const release = event => {
   if (!drag || event.pointerId !== drag.id) return;
   const id = drag.id;
   drag = null;
   if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
   button.classList.remove('is-grabbed');
   context.move(0,0);
  };
  const key = event => {
   const offsets = {ArrowLeft:[-45,-12],ArrowRight:[45,-12],ArrowUp:[0,-45],ArrowDown:[0,25]};
   if (offsets[event.key]) {event.preventDefault();context.move(...offsets[event.key],true);}
  };
  const keyup = event => {if (event.key.startsWith('Arrow')) context.move(0,0);};
  const listeners = [[image,'pointerenter',enter],[image,'pointerleave',leave],[button,'pointerdown',down],[button,'pointermove',move],[button,'pointerup',release],[button,'pointercancel',release],[button,'lostpointercapture',release],[button,'focus',enter],[button,'blur',leave],[button,'keydown',key],[button,'keyup',keyup]];
  listeners.forEach(([target,event,handler]) => target.addEventListener(event,handler));
  return () => {listeners.forEach(([target,event,handler]) => target.removeEventListener(event,handler));media.revert();context.revert();};

}

