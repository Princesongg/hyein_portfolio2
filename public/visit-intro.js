(() => {
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 if (motion.matches) return;

 let resolveFinished;
 window.portfolioIntroFinished = new Promise(resolve => { resolveFinished = resolve; });
 const overlay = document.createElement('div');
 overlay.className = 'visit-intro';
 overlay.setAttribute('aria-hidden', 'true');
 overlay.innerHTML = `<div class="visit-intro-content">
  <div class="visit-intro-heading"><span class="visit-intro-heart">&#9829;</span><p class="visit-intro-welcome">Welcome to</p><p class="visit-intro-title">Hyein&#39;s Portfolio</p></div>
  <div class="visit-intro-mailbox">
   <span class="visit-intro-state visit-intro-closed"><img src="/assets/contact/intro-mailbox-states.png" alt="" fetchpriority="high"></span>
   <span class="visit-intro-state visit-intro-open"><img src="/assets/contact/intro-mailbox-states.png" alt="" fetchpriority="high"></span>
   <span class="visit-intro-state visit-intro-letters"><img src="/assets/contact/intro-mailbox-states.png" alt="" fetchpriority="high"></span>
  </div>
 </div>`;
 let finished = false;
 let timer;
 const finish = () => {
  if (finished) return;
  finished = true;
  clearTimeout(timer);
  overlay.remove();
  motion.removeEventListener('change', onMotion);
  window.removeEventListener('pagehide', finish);
  resolveFinished();
 };
 const onMotion = () => { if (motion.matches) finish(); };
 motion.addEventListener('change', onMotion);
 window.addEventListener('pagehide', finish, {once:true});
 overlay.addEventListener('animationend', event => {
  if (event.target === overlay) finish();
 });
 document.body.append(overlay);
 // Never hold the page for a slow connection or a failed illustration.
 timer = setTimeout(finish, 3300);
 Promise.all([...overlay.querySelectorAll('img')].map(img => img.decode()))
  .then(() => {
   if (finished) return;
   clearTimeout(timer);
   overlay.classList.add('is-playing');
   timer = setTimeout(finish, 3050);
  }).catch(finish);
 // A short loading budget keeps the entire introduction brief.
 setTimeout(() => { if (!overlay.classList.contains('is-playing')) finish(); }, 250);
})();
