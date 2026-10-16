export default function initWorkTyping(sectionRef, options = {}) {
  const section = sectionRef;
  const scroller = section.closest('.portfolio-scroll');
  const title = section.querySelector('h2');
  const portfolioFrame = options.frameElement || scroller.closest('.portfolio').querySelector('.portfolio-frame');
  const subtitle = section.querySelector(options.subtitleSelector || '.work-intro-copy p');
  const chars = [...title.querySelectorAll(options.characterSelector || '.work-character')];
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, travel = 0, distance = 1;
  let current = 0;
  let lastTime = 0;
  let previousProgress = -1, previousEntry = -1;
  const update = timestamp => {
   frame = 0;
   if (media.matches) {
    previousProgress = -1;
    lastTime = 0;
    title.style.transform = '';
    if (!options.preserveFrame) portfolioFrame.style.opacity = '';
    subtitle.style.opacity = '';
    subtitle.style.filter = '';
    subtitle.style.transform = '';
    chars.forEach(char => { char.style.filter = ''; char.style.opacity = ''; char.style.transform = ''; });
    return;
   }
   const viewport = scroller.getBoundingClientRect();
   const sectionTop = section.getBoundingClientRect().top;
   const progress = Math.max(0, Math.min(1, (viewport.top - sectionTop) / distance));
   const entry = Math.max(0,Math.min(1,(scroller.clientHeight-sectionTop+viewport.top)/(scroller.clientHeight*.8)));
   // Settled sections outside the viewport do not need more style updates.
   if (progress === previousProgress && entry === previousEntry && current === progress) return;
   previousProgress = progress;
   previousEntry = entry;
   const target = progress;
   const elapsed = lastTime ? Math.min(64, timestamp - lastTime) : 16;
   lastTime = timestamp;
   current += (target - current) * (1 - Math.exp(-elapsed / 110));
   if (Math.abs(target - current) < .0001) current = target;
   const slide = Math.min(1, current / .78);
   const settle = Math.max(0, (current - .78) / .22);
   const subtitleProgress = Math.max(0, Math.min(1, (settle - .45) / .55));
   const subtitleFade = subtitleProgress * subtitleProgress * (3 - 2 * subtitleProgress);
   subtitle.style.opacity = String(1 - subtitleFade);
   const frameEntry = options.enterFrame ? entry*entry*(3-2*entry) : 1;
   if (!options.preserveFrame) portfolioFrame.style.opacity = String(frameEntry*(1-subtitleFade));
   subtitle.style.filter = `blur(${subtitleFade * 8}px)`;
   subtitle.style.transform = `translateY(${-subtitleFade * 16}px)`;
   const width = scroller.clientWidth;
   title.style.transform = `translate3d(${width * .12 - travel * slide}px,0,0)`;
   // Read all character positions before writing their individual styles.
   const characterRects = chars.map(char => char.getBoundingClientRect());
   chars.forEach((char, index) => {
    const rect = characterRects[index];
    const x = rect.left + rect.width / 2 - viewport.left;
    const scale = width / 1920;
    const fogStart = 480 * scale;
    const fogEnd = -350 * scale;
    const edge = Math.max(0, Math.min(1, (fogStart - x) / (fogStart - fogEnd)));
    const positional = edge * edge * (3 - 2 * edge);
    const position = Math.max(0, Math.min(1, (x - fogEnd) / (width / 2 - fogEnd)));
    const stagger = Math.max(0, Math.min(1, (settle - position * .55) / .45));
    const fade = Math.max(positional, stagger * stagger * (3 - 2 * stagger));
    const blur = fade <= .55 ? fade * (22 / .55) : 22 + ((fade - .55) / .45) * 43;
    char.style.filter = `blur(${blur * scale}px)`;
    char.style.opacity = String(1 - fade);
    char.style.transform = `translateY(${-fade * 200 * scale}px)`;
   });
   if (current !== target) frame = requestAnimationFrame(update);
   else lastTime = 0;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const measure = () => {
   previousProgress = -1;
   travel = Math.max(0, title.scrollWidth - scroller.clientWidth * .38);
   distance = Math.max(scroller.clientHeight * 2, travel * 1.5);
   section.style.setProperty(options.distanceProperty || '--work-scroll-distance', distance + 'px');
   schedule();
  };
  const observer = new ResizeObserver(measure);
  observer.observe(scroller);
  observer.observe(title);
  scroller.addEventListener('scroll', schedule, { passive: true });
  media.addEventListener('change', measure);
  measure();
  return () => {
   cancelAnimationFrame(frame);
   if (!options.preserveFrame) portfolioFrame.style.opacity = '';
   observer.disconnect();
   scroller.removeEventListener('scroll', schedule);
   media.removeEventListener('change', measure);
  };
}
