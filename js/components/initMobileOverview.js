export default function initMobileOverview(root) {
 const mobile = matchMedia('(max-width:700px)');
 let undo = [];
 const setup = () => {
  undo.forEach(restore => restore()); undo = [];
  if (!mobile.matches) return;
  const orbit = root.querySelector('.skill-orbit');
  const icons = [...orbit.children];
  const belt = document.createElement('div'); belt.className = 'skill-mobile-belt';
  const group = document.createElement('div'); group.className = 'skill-mobile-group';
  group.append(...icons);
  const duplicate = group.cloneNode(true); duplicate.setAttribute('aria-hidden','true');
  belt.append(group,duplicate); orbit.append(belt);
  const skillVisibility = new IntersectionObserver(entries => {
   orbit.classList.toggle('is-visible',entries.some(entry => entry.isIntersecting));
  },{root:root.querySelector('.portfolio-scroll')});
  skillVisibility.observe(orbit);
  undo.push(() => {skillVisibility.disconnect();orbit.replaceChildren(...icons);orbit.classList.remove('is-visible');});
  // The project overview keeps the desktop's filter/arrow carousel interaction.
  const projectTrack = root.querySelector('.project-track');
  const projectCounter = root.querySelector('.project-controls p');
  const counterText = projectCounter.textContent;
  const updateProjects = () => {
   const cards = [...projectTrack.children];
   const gap = parseFloat(getComputedStyle(projectTrack).gap) || 0;
   const width = cards[0]?.getBoundingClientRect().width || projectTrack.clientWidth;
   const index = Math.max(0,Math.min(cards.length - 1,Math.round(projectTrack.scrollLeft / (width + gap))));
   projectCounter.textContent = `${String(index + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  };
  projectTrack.addEventListener('scroll',updateProjects,{passive:true});
  const projectObserver = new MutationObserver(updateProjects);
  projectObserver.observe(projectTrack,{childList:true});
  updateProjects();
  undo.push(() => {projectTrack.removeEventListener('scroll',updateProjects);projectObserver.disconnect();projectCounter.textContent = counterText;});
  const fold = (nodes,label) => {
   if (!nodes.length) return;
   const detail = document.createElement('details'); detail.className = 'mobile-card-detail';
   const summary = document.createElement('summary'); summary.textContent = label;
   nodes[0].before(detail); detail.append(summary);
   nodes.forEach(node => {
    const marker = document.createComment('mobile full copy'); node.before(marker); detail.append(node);
    undo.push(() => marker.replaceWith(node));
   });
   undo.push(() => detail.remove());
  };
  const intro = root.querySelector('.con1-description');
  const lead = document.createElement('p'); lead.className = 'mobile-intro-lead';
  lead.textContent = '미술·패션 디자인의 감각과 한국·일본에서의 경험을 바탕으로, 브랜드와 사용자를 함께 고려하는 UI/UX를 설계합니다.';
  intro.before(lead); undo.push(() => lead.remove());
  fold([intro],'디자인 배경 · 포트폴리오 이야기');
  root.querySelectorAll('.project-summary').forEach(summary => {
   fold([...summary.querySelectorAll(':scope > div')].slice(1),'담당 작업 자세히');
  });
  root.querySelectorAll('.archive-gallery-info').forEach(info => {
   const nodes = [...info.firstElementChild.querySelectorAll(':scope > p')].slice(1).concat([...info.children].slice(1));
   if (!nodes.length) return;
   const detail = document.createElement('details');
   detail.className = 'mobile-card-detail';
   const summary = document.createElement('summary'); summary.textContent = '작업 과정 · 담당 역할 자세히';
   nodes[0].before(detail); detail.append(summary);
   nodes.forEach(node => {
    const marker = document.createComment('archive detail'); node.before(marker); detail.append(node);
    undo.push(() => marker.replaceWith(node));
   });
   undo.push(() => detail.remove());
  });
  const gallery = root.querySelector('.archive-textile-gallery');
  const groups = [...gallery.children];
  const nav = document.createElement('nav'); nav.className = 'mobile-textile-tabs'; nav.setAttribute('aria-label','텍스타일 작업 선택');
  const labels = ['수상 작품','키즈 패턴','자연 모티브'];
  const buttons = groups.map((group,index) => {
   const button = document.createElement('button'); button.type = 'button'; button.textContent = labels[index];
   button.addEventListener('click', () => gallery.scrollTo({left:index * gallery.clientWidth,behavior:'smooth'}));
   nav.append(button); return button;
  });
  gallery.before(nav);
  const update = () => {
   const index = Math.max(0,Math.min(groups.length - 1,Math.round(gallery.scrollLeft / gallery.clientWidth)));
   buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i === index)));
   gallery.style.height = groups[index].offsetHeight + 'px';
  };
  gallery.addEventListener('scroll',update,{passive:true});
  const observer = new ResizeObserver(update); groups.forEach(group => observer.observe(group)); update();
  undo.push(() => {observer.disconnect();gallery.removeEventListener('scroll',update);gallery.style.removeProperty('height');nav.remove();});
 };
 mobile.addEventListener('change',setup); setup();
 return () => {mobile.removeEventListener('change',setup);undo.forEach(restore => restore());};
}
