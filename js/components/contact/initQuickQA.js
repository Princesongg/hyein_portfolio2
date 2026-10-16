export default function initQuickQA(section) {
 if (!section) return;
 const items = [...section.querySelectorAll('.quick-qa-item')];
 const media = window.matchMedia('(prefers-reduced-motion: reduce)');
 const states = items.map(item => ({
  item, summary:item.querySelector('summary'),
  answer:item.querySelector('.quick-qa-answer'),
  expanded:item.open, animation:null,
 }));
 const settle = state => {
  state.animation?.cancel();
  state.animation = null;
  state.item.open = state.expanded;
  state.item.classList.remove('is-animating');
 };
 const change = (state, expanded) => {
  const {item, summary, answer} = state;
  const from = item.getBoundingClientRect().height;
  state.animation?.cancel();
  state.expanded = expanded;
  item.dataset.qaState = expanded ? 'open' : 'closed';
  summary.setAttribute('aria-expanded', String(expanded));
  answer.inert = !expanded;
  if (media.matches || !item.animate) {settle(state);return;}
  // Keep details open while shrinking so its answer remains measurable.
  item.open = true;
  const border = parseFloat(getComputedStyle(item).borderBottomWidth) || 0;
  const to = summary.getBoundingClientRect().height + border +
   (expanded ? answer.getBoundingClientRect().height : 0);
  item.classList.add('is-animating');
  state.animation = item.animate([{height:from+'px'}, {height:to+'px'}], {
   duration:280, easing:'cubic-bezier(.25,.1,.25,1)',
  });
  state.animation.onfinish = () => settle(state);
 };
 const listeners = states.map(state => {
  state.summary.setAttribute('aria-expanded', String(state.expanded));
  state.answer.inert = !state.expanded;
  const click = event => {
   event.preventDefault();
   const expanded = !state.expanded;
   if (expanded) states.forEach(other => {
    if (other !== state && other.expanded) change(other, false);
   });
   change(state, expanded);
  };
  state.summary.addEventListener('click', click);
  return () => state.summary.removeEventListener('click', click);
 });
 const motionChange = () => {if (media.matches) states.forEach(settle);};
 media.addEventListener('change', motionChange);
 return () => {
  listeners.forEach(remove => remove());
  states.forEach(settle);
  media.removeEventListener('change', motionChange);
 };
}
