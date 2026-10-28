export default function initDesignDetails(root) {
  const grid = root.querySelector('.team-story-details-grid');
  if (!grid) return;
  const original = grid.innerHTML;
  const panels = [...grid.children];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controls = document.createElement('nav');
  controls.className = 'details-controls';
  controls.setAttribute('aria-label', '디자인 디테일 선택');
  let active = 0;
  let lockedUntil = 0;
  let accumulated = 0;
  let lastWheel = 0;
  let touchY = 0;
  let touchX = 0;
  const story = root.closest('.team-story');
  const scrollDriven = () => story?.dataset.horizontal === 'true';
  panels.forEach((panel, index) => {
    const image = panel.firstElementChild;
    const copy = document.createElement('div');
    copy.className = 'details-slide-copy';
    if (index === 0) copy.append(...panel.lastElementChild.childNodes);
    else copy.append(...[...panel.children].slice(1));
    // Let larger copy wrap naturally without joining words across old hard breaks.
    if (root.closest('.diptyque-readable')) copy.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode(' ')));
    const visual = document.createElement('div');
    visual.className = 'details-slide-visual';
    visual.append(image);
    if (index === 0) {
      visual.classList.add('details-slide-visual--3d');
      const back = document.createElement('figure');
      back.className = 'details-back-photo';
      const backImage = document.createElement('img');
      backImage.src = '/assets/work/diptyque-3d-back.webp';
      backImage.alt = '오르페옹 3D 비주얼 뒷면 전체 화면';
      backImage.width = 2533;
      backImage.height = 1337;
      backImage.loading = 'lazy';
      const caption = document.createElement('figcaption');
      caption.textContent = 'BACK VIEW';
      back.append(backImage, caption);
      visual.append(back);
    }
    panel.replaceChildren(copy, visual);
    panel.className = 'details-slide';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', `${index + 1} / ${panels.length}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', copy.querySelector('strong').textContent);
    controls.append(button);
  });
  const count = document.createElement('span');
  count.className = 'details-count';
  count.setAttribute('aria-live', 'polite');
  controls.append(count);
  root.append(controls);
  root.classList.add('details-slider');
  grid.tabIndex = 0;
  grid.setAttribute('aria-label', '디자인 디테일. 위아래 방향키 또는 스크롤로 전환');
  const show = index => {
    active = Math.max(0, Math.min(panels.length - 1, index));
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === active);
      panel.inert = i !== active;
      panel.setAttribute('aria-hidden', String(i !== active));
    });
    [...controls.querySelectorAll('button')].forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === active));
    });
    count.textContent = `${String(active + 1).padStart(2, '0')} / 03`;
    lockedUntil = performance.now() + (reduced.matches ? 150 : 750);
  };
  const select = index => {
    index = Math.max(0, Math.min(panels.length - 1, index));
    if (scrollDriven()) root.dispatchEvent(new CustomEvent('details-seek', {bubbles:true,detail:{index}}));
    else show(index);
  };
  const onProgress = event => {
    if (active !== event.detail.index) show(event.detail.index);
  };
  root.addEventListener('details-progress', onProgress);
  const onClick = event => {
    const index = [...controls.querySelectorAll('button')].indexOf(event.target.closest('button'));
    if (index >= 0) select(index);
  };
  const onWheel = event => {
    if (matchMedia('(max-width:700px)').matches) return;
    if (scrollDriven()) return;
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const now = performance.now();
    if (now < lockedUntil) { event.preventDefault(); return; }
    if (active + direction < 0 || active + direction >= panels.length) return;
    event.preventDefault();
    if (now - lastWheel > 180 || Math.sign(accumulated) !== direction) accumulated = 0;
    lastWheel = now;
    accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : 1);
    if (Math.abs(accumulated) >= 40) { show(active + direction); accumulated = 0; }
  };
  const onKey = event => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    select(event.key === 'Home' ? 0 : event.key === 'End' ? 2 : active + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1));
  };
  const onTouchStart = event => { touchY = event.changedTouches[0].clientY; touchX = event.changedTouches[0].clientX; };
  const onTouchEnd = event => {
    if (scrollDriven()) return;
    const delta = touchX - event.changedTouches[0].clientX;
    const vertical = touchY - event.changedTouches[0].clientY;
    if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(vertical) * 1.3) show(active + Math.sign(delta));
  };
  controls.addEventListener('click', onClick);
  root.addEventListener('wheel', onWheel, {passive:false});
  grid.addEventListener('keydown', onKey);
  root.addEventListener('touchstart', onTouchStart, {passive:true});
  root.addEventListener('touchend', onTouchEnd, {passive:true});
  show(0);
  return () => {
    controls.remove();
    root.removeEventListener('details-progress', onProgress);
    root.classList.remove('details-slider');
    root.removeEventListener('wheel', onWheel);
    grid.removeEventListener('keydown', onKey);
    root.removeEventListener('touchstart', onTouchStart);
    root.removeEventListener('touchend', onTouchEnd);
    grid.removeAttribute('tabindex');
    grid.removeAttribute('aria-label');
    grid.innerHTML = original;
  };
}
