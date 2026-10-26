import initDetailSummaries from './components/initDetailSummaries.js';
import initViewportLayout from './components/initViewportLayout.js';
import initEditionHero from './animations/initEditionHero.js';
import initLaptopPreview from './animations/initLaptopPreview.js';
import initDocumentDialog from './components/work/initDocumentDialog.js';
import initPostbox from './components/chatbot/initPostbox.js';
import initQuickQA from './components/contact/initQuickQA.js';
import initHeaderColor from './animations/initHeaderColor.js';
import initMobileMenu from './components/initMobileMenu.js';
import initCon1Typing from './animations/initCon1Typing.js';
import initReadyTyping from './animations/initReadyTyping.js';
import initReadyApproach from './components/contact/initReadyApproach.js';
import initWorkTyping from './animations/initWorkTyping.js';
import initTeamBackground from './animations/initTeamBackground.js';
import initPersonalBackground from './animations/initPersonalBackground.js';
import initArchiveGallery from './animations/initArchiveGallery.js';
import initMobileOverview from './components/initMobileOverview.js';
import initSkillOrbit from './animations/initSkillOrbit.js';
import initAboutIntro from './animations/about/initAboutIntro.js';
import initAboutPostcards from './animations/about/initAboutPostcards.js';
import initTeamHorizontal from './animations/initTeamHorizontal.js';
import initRoleStory from './components/work/initRoleStory.js';
import initPersonalStory from './components/work/initPersonalStory.js';
import initDesignDetails from './animations/initDesignDetails.js';
import initKeywordCards from './animations/initKeywordCards.js';
import initMobileKeywords from './components/initMobileKeywords.js';
import initKeywordStack from './animations/initKeywordStack.js';
import initBracketReveal from './animations/initBracketReveal.js';
import initStoryReveal from './animations/initStoryReveal.js';
import initStampPress from './animations/initStampPress.js';
import initTeamCrystal from './animations/initTeamCrystal.js';
import {leanCanvas, leanCanvases, personas, journeyMaps, uxSteps} from './data/uxProcessData.js';

const root = document.querySelector('.portfolio');
const scroller = root.querySelector('.portfolio-scroll');
const reference = selector => root.querySelector(selector);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cleanups = [];
const start = (initialize,...args) => {
 const cleanup = initialize(...args);
 if (typeof cleanup === 'function') cleanups.push(cleanup);
};

// Keep the original 1920 × 1080 artwork aligned with the viewport.
function resizeHero() {
 const scale = root.clientWidth / 1920;
 if (!root.querySelector('.edition-hero')) root.querySelector('.hero').style.height = Math.max(root.clientHeight,1080 * scale)+'px';
 if (root.querySelector('.hero-canvas')) root.querySelector('.hero-canvas').style.transform = `translateX(-50%) scale(${scale})`;
 root.querySelector('.con1-letter>div').style.transform = `translateX(-50%) scale(${scale})`;
 root.querySelector('.portfolio-frame>div').style.transform = `scale(${scale},${root.clientHeight / 1080})`;
 root.querySelector('.portfolio-logo-icon img').style.transform = `scale(${Math.min(Math.max(scale,.66),1)})`;
}
resizeHero();
const resizeObserver = new ResizeObserver(resizeHero);
resizeObserver.observe(root);
cleanups.push(() => resizeObserver.disconnect());

start(initViewportLayout,root);
start(initDetailSummaries,root);
start(initEditionHero,root);
root.querySelectorAll('.team-laptop-preview,.team-story-preview,.team-story-mobile-preview,.team-story-galerie-preview,.what-i-do-preview,.personal-onitsuka-video').forEach(video=>start(initLaptopPreview,video));
root.querySelectorAll('.team-story-explore-mobile-scroll').forEach(preview=>{
 let visible=false;
 const update=()=>preview.toggleAttribute('data-playing',visible&&!document.hidden);
 const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);update();},{root:scroller,threshold:.15});
 observer.observe(preview);
 document.addEventListener('visibilitychange',update);
 cleanups.push(()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);});
});
root.querySelectorAll('.personal-projects-visual > a').forEach(preview=>{
 const label=document.createElement('span');
 label.className='personal-preview-caption';
 label.textContent='MAIN PAGE · PC / MOBILE UI DESIGN';
 preview.append(label);
});
start(initPostbox,root);
start(initQuickQA,reference('.quick-qa'));
start(initHeaderColor,root);
start(initMobileMenu,root);
start(initCon1Typing,reference('.con1-copy'));
start(initReadyTyping,reference('.contact-ready'));
start(initReadyApproach,reference('.ready-approach'));
start(initKeywordCards,reference('.con2'));
start(initMobileKeywords,root);
start(initKeywordStack,reference('.keywords-about-stack'));
root.querySelectorAll('.bracket-reveal').forEach(element => start(initBracketReveal,element));
start(initWorkTyping,reference('.work-intro'));
root.querySelectorAll('.team-start-art:not(.team-crystal-art)').forEach(art => start(initStampPress,art));
root.querySelectorAll('.team-crystal-art,.personal-crystal-art,.video-crystal-art,.archive-crystal-art').forEach(art=>start(initTeamCrystal,art));
start(initTeamBackground,reference('.team-detail'));
start(initPersonalBackground,reference('.personal-start'));
start(initPersonalBackground,reference('.video-start'),{
 previousSelector:'.personal-projects',
 property:'--video-scroll-background',
 from:[252,250,247],
 to:[244,239,234],
 colors:{
  '--video-scroll-ink':[[121,104,88],[121,104,88]],
  '--video-scroll-muted':[[98,86,77],[98,86,77]],
  '--video-scroll-accent':[[125,105,87],[125,105,87]],
 },
});
start(initDesignDetails,reference('.team-story-details'));
start(initTeamHorizontal,reference('.team-story'));
start(initRoleStory,reference('.role-story'));
start(initStoryReveal,reference('.team-story'));
start(initTeamHorizontal,reference('.ux-process'),'ux-process');
start(initPersonalStory,reference('.personal-projects'));
start(initTeamHorizontal,reference('.short-form'),'short-form');
start(initMobileOverview,root);
start(initArchiveGallery,reference('.archive-gallery'));
start(initSkillOrbit,reference('.skill-section'));
start(initAboutIntro,reference('.about-intro'));
start(initAboutPostcards,reference('.about-postcards'));
start(initPersonalBackground,reference('.about-intro'),{
 previousSelector:'.skill-section',
 property:'--about-scroll-background',
 from:[252,250,247],
 to:[241,234,226],
});
start(initPersonalBackground,reference('.archive-start'),{
 previousSelector:'.short-form',
 property:'--archive-scroll-background',
 from:[244,239,234],
 to:[252,250,247],
 colors:{
  '--archive-scroll-ink':[[121,104,88],[121,104,88]],
  '--archive-scroll-muted':[[98,86,77],[98,86,77]],
  '--archive-scroll-accent':[[125,105,87],[125,105,87]],
 },
});
const shortFormVideos = [...root.querySelectorAll('.short-form-visual video')];
const shortFormVideoVisibility = new IntersectionObserver(entries => {
 entries.forEach(({target:video,isIntersecting}) => {
  if (isIntersecting) video.play().catch(() => {});
  else video.pause();
 });
},{root:scroller,threshold:.5});
shortFormVideos.forEach(video => shortFormVideoVisibility.observe(video));
cleanups.push(() => {
 shortFormVideoVisibility.disconnect();
 shortFormVideos.forEach(video => video.pause());
});

// Filter existing HTML blocks rather than rebuilding the portfolio.
const projectTrack = root.querySelector('.project-track');
const projects = [...projectTrack.children];
const categories = ['TEAM','PERSONAL','PERSONAL','PERSONAL','PERSONAL','PERSONAL','VIDEO'];
projects.forEach((project,index) => {project.dataset.category = categories[index];});
// Leave enough space after the final card for its start edge to snap left.
const updateProjectTail=()=>{
 const last=projectTrack.lastElementChild;
 const gap=parseFloat(getComputedStyle(projectTrack).gap)||0;
 const space=last?Math.max(0,projectTrack.clientWidth-last.getBoundingClientRect().width-gap):0;
 projectTrack.style.setProperty('--project-tail-space',`${space}px`);
 projectTrack.toggleAttribute('data-tail-space',space>1);
};
const projectSizeObserver=new ResizeObserver(updateProjectTail);
projectSizeObserver.observe(projectTrack);
cleanups.push(()=>projectSizeObserver.disconnect());
updateProjectTail();
root.querySelectorAll('.project-filters button').forEach(button => {
 button.addEventListener('click',() => {
  const category = button.textContent.trim();
  root.querySelectorAll('.project-filters button').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  projectTrack.replaceChildren(...projects.filter(project => category === 'ALL' || project.dataset.category === category));
  updateProjectTail();
  projectTrack.scrollLeft = 0;
 });
});
root.querySelectorAll('.project-controls button').forEach((button,index) => {
 button.addEventListener('click',() => {
  const card = projectTrack.querySelector('.project-card');
  const gap = parseFloat(getComputedStyle(projectTrack).gap) || 0;
  projectTrack.scrollBy({left:(index === 0 ? -1 : 1)*(card.getBoundingClientRect().width+gap),behavior:reducedMotion() ? 'instant' : 'smooth'});
 });
});

function goToChapter(section,prefix,index) {
 const stage = section.querySelector('.'+prefix+'-stage');
 const bounds=section.getBoundingClientRect(),viewport=scroller.getBoundingClientRect();
 const inSection=bounds.top<viewport.bottom&&bounds.bottom>viewport.top;
 // Cross-section jumps must not animate through, and remeasure, every sticky story.
 const behavior = reducedMotion()||!inSection ? 'instant' : 'smooth';
 if(section.hasAttribute('data-native-mobile')){
  const track=section.querySelector('.'+prefix+'-track');
  const panel=track.children[index];
  if (!panel) return;
  track.scrollTo({left:index*track.clientWidth,behavior});
  const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
  scroller.scrollTo({top:scroller.scrollTop+section.getBoundingClientRect().top-scroller.getBoundingClientRect().top-clearance,behavior});
  section.querySelectorAll('.'+prefix+'-chapters button').forEach((button,i)=>i===index?button.setAttribute('aria-current','step'):button.removeAttribute('aria-current'));
  return;
 }
 if (section.dataset.horizontal !== 'true') {
  stage.scrollTo({left:index*stage.clientWidth,behavior});
 } else {
  const top = scroller.scrollTop+section.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  if(section.hasAttribute('data-content-scroll')){
   const panel=section.querySelector('.'+prefix+'-track').children[index];
   const clearance=parseFloat(getComputedStyle(root).getPropertyValue('--header-clearance'))||0;
   scroller.scrollTo({top:top-clearance+Number(panel.dataset.chapterOffset),behavior});
   return;
  }
  const hold = parseFloat(section.style.getPropertyValue('--story-hold')) || 0;
  const overflow = parseFloat(section.style.getPropertyValue('--story-overflow')) || 0;
  const detailsDistance = parseFloat(section.style.getPropertyValue('--details-distance')) || 0;
  const detailsRow = [...section.querySelector('.'+prefix+'-track').children].findIndex(row => row.querySelector('.details-slider'));
  scroller.scrollTo({top:top+overflow+hold+index*stage.clientWidth+(detailsRow >= 0 && index > detailsRow ? detailsDistance : 0),behavior});
 }
}
root.addEventListener('click',event => {
 const contactCard=event.target.closest('.contact-project-card');
 if(contactCard&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){
  const target=reference(contactCard.getAttribute('href'));
  if(!target)return;
  event.preventDefault();
  const align=()=>{
   const clearance=parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0;
   scroller.scrollTo({top:scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-clearance,behavior:'instant'});
  };
  align();
  requestAnimationFrame(()=>requestAnimationFrame(align));
  history.replaceState(null,'',contactCard.hash);
  return;
 }
 const link = event.target.closest('.project-detail-link');
 if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
 const target = reference(link.getAttribute('href'));
 if (!target) return;
 event.preventDefault();
 if (target.id === 'work-video') {
  // Jump across the sticky horizontal chapters without animating through them.
  // Re-read the destination after their scroll-driven layout has updated.
  const alignVideoIntro = () => {
   const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - (parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0);
   scroller.scrollTo({top,behavior:'instant'});
  };
  alignVideoIntro();
  requestAnimationFrame(() => requestAnimationFrame(alignVideoIntro));
  return;
 }
 const personal = target.closest('.personal-projects');
 if (personal) {
  const panels = [...personal.querySelectorAll('.personal-projects-panel')];
  if (personal.dataset.horizontal !== 'true') {
   const top = scroller.scrollTop + personal.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   scroller.scrollTo({top,behavior:reducedMotion() ? 'instant' : 'smooth'});
  }
  goToChapter(personal,'personal-projects',panels.indexOf(target));
 } else {
  const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - (parseFloat(getComputedStyle(scroller).scrollPaddingTop)||0);
  scroller.scrollTo({top,behavior:reducedMotion() ? 'instant' : 'smooth'});
 }
});
for (const prefix of ['team-story','role-story','ux-process','personal-projects','short-form']) {
 const section = root.querySelector('.'+prefix);
 const buttons = section.querySelectorAll('.'+prefix+'-chapters button');
 if(prefix==='role-story'||prefix==='personal-projects')section.querySelector('.'+prefix+'-chapters').addEventListener('click',event=>{
  const index=[...section.querySelectorAll('.'+prefix+'-chapters button')].indexOf(event.target.closest('button'));
  if(index>=0)goToChapter(section,prefix,index);
 });
 else buttons.forEach((button,index) => button.addEventListener('click',() => goToChapter(section,prefix,index)));
 const stage = section.querySelector('.'+prefix+'-stage');
 stage.addEventListener('scroll',() => {
  if (section.dataset.horizontal === 'true' || section.hasAttribute('data-native-mobile')) return;
  const active = Math.round(stage.scrollLeft/stage.clientWidth);
  buttons.forEach((button,index) => {
   if (index === active) button.setAttribute('aria-current','step');
   else button.removeAttribute('aria-current');
  });
 },{passive:true});
}

function element(tag,className,text) {
 const node = document.createElement(tag);
 if (className) node.className = className;
 if (text !== undefined) node.textContent = text;
 return node;
}
function documentPreview(material) {
 if (material.image) {
  const image = element('img','ux-document-image'+(material.originalImage ? ' ux-document-image--planning' : ''));
  image.src = material.image;
  image.alt = material.originalImage?.alt || material.label+' 기획 자료';
  if (material.originalImage) {
   image.width = material.originalImage.width;
   image.height = material.originalImage.height;
  }
  return image;
 }
 if (material.id==='presentation') {
  const placeholder=element('div','ux-presentation-placeholder','장표 이미지 등록 예정');
  return placeholder;
 }
 const sheet = element('div','ux-document');
 sheet.append(element('p','ux-document-eyebrow','DIPTYQUE / UX PLANNING'),element('h4','',material.title));
 const grid = element('div','ux-document-grid'+(material.id === 'lean' ? ' ux-document-grid--canvas' : ''));
 material.columns.forEach((column,index) => {
  const cell = element('div');
  cell.append(element('span','',String(index+1).padStart(2,'0')),element('h5','',column));
  for(let i=0;i<3;i++){const line=element('i');line.setAttribute('aria-hidden','true');cell.append(line);}
  grid.append(cell);
 });
 sheet.append(grid);
 sheet.append(element('p','ux-document-status','기획 자료 등록 예정'));
 return sheet;
}
const documentDialog=initDocumentDialog(root.querySelector('.ux-document-dialog'),{scroller,renderPreview:documentPreview});
const openDocument=documentDialog.open;
root.querySelectorAll('[data-archive-image]').forEach(button => {
 button.addEventListener('click',() => openDocument({
  label:button.querySelector('img').alt,
  image:button.dataset.archiveImage,
 }));
});
cleanups.push(documentDialog.destroy);
root.querySelector('.ux-lean-open').addEventListener('click',() => openDocument(leanCanvas));
root.querySelector('.archive-award-preview').addEventListener('click',() => openDocument({
 label:'LIVELY SUMMER · 한영 텍스타일 디자인 공모전 특선 상장',
 image:'/assets/archive/lively-summer-award.png',
}));
const planningPreview = root.querySelector('.ux-planning-preview');
const previewVisibility = new IntersectionObserver(entries => {
 entries.forEach(entry => planningPreview.contentWindow?.postMessage({type:'planning-preview',visible:entry.isIntersecting},location.origin));
},{root:scroller,threshold:.1});
previewVisibility.observe(planningPreview);
planningPreview.addEventListener('load',() => {
 previewVisibility.unobserve(planningPreview);
 previewVisibility.observe(planningPreview);
});
cleanups.push(() => previewVisibility.disconnect());
root.querySelectorAll('[data-lean-id]').forEach(button => {
 button.addEventListener('click',() => openDocument(leanCanvases.find(material => material.id === button.dataset.leanId)));
});
root.querySelectorAll('.ux-process-panel:not(.ux-process-intro)').forEach((panel,index) => {
 const step = uxSteps[index];
 const previewButton = panel.querySelector('.ux-document-open');
 const caption = panel.querySelector('.ux-material-caption span');
 const description = panel.querySelector('.ux-process-description');
 const tabs = panel.querySelectorAll('.ux-material-tabs button[aria-pressed]');
 let current = step.documents[Math.max(0,[...tabs].findIndex(button=>button.getAttribute('aria-pressed')==='true'))];
 const addResearchLabel = () => {
  if (step.id==='research') previewButton.append(element('span','ux-research-card-label',current.label+' ↗'));
  else if (['interview','structure','visual','screens'].includes(step.id)&&current.image&&!current.pages) {
   previewButton.append(element('span','ux-document-card-label',current.label+' ↗'));
  }
 };
 const updatePreview=()=>{
  previewButton.replaceChildren(documentPreview(current));
  addResearchLabel();
  previewButton.setAttribute('aria-label',current.label+' 크게 보기');
  caption.textContent=current.label;
 };
 if (['structure','visual','screens','research','interview'].includes(step.id)) updatePreview();
 const galleries=new Map();
 if (step.id==='screens') {
  const screenDescriptions=[
   '앞서 설계한 정보 구조를 바탕으로 주요 페이지의 레이아웃과 콘텐츠 배치를 구체화했습니다. 화면별 정보의 우선순위와 사용자 흐름을 고려해 기본 구조를 설계했습니다.',
   '브랜드의 시각적 일관성을 유지하기 위해 컬러, 타이포그래피, 간격 등 공통 디자인 기준을 정리했습니다. 팀원들이 통일된 방향으로 작업할 수 있도록 스타일을 체계화했습니다.',
   '버튼, 카드, 내비게이션 등 반복적으로 사용되는 UI 요소를 정리했습니다. 페이지마다 일관된 디자인을 적용하고 효율적으로 작업할 수 있도록 구성했습니다.',
   '기획 과정과 화면 설계, 디자인 결과물을 장표로 정리했습니다. 프로젝트의 진행 흐름과 주요 디자인 의도를 한눈에 이해할 수 있도록 구성했습니다.',
  ];
  description.textContent=screenDescriptions[0];
  tabs.forEach((button,index)=>button.addEventListener('click',()=>{
   description.textContent=screenDescriptions[index];
  }));
 }
 if (step.id==='visual') {
  const visualDescriptions=[
   '팀원들이 공유한 레퍼런스 이미지와 조사 자료를 바탕으로 무드보드를 직접 제작했습니다. 펜 드로잉, 페이퍼 콜라주, 식물 이미지와 빈티지 질감을 활용해 딥티크의 감성을 시각화하고, 팀의 공통 디자인 방향을 정리했습니다.',
   '딥티크의 브랜드 이미지와 핵심 키워드를 연결하며 디자인 콘셉트를 구체화했습니다. 다양한 아이디어를 정리하고, 이를 실제 콘텐츠와 화면 디자인에 적용할 방향을 함께 고민했습니다.',
  ];
  description.textContent=visualDescriptions[0];
  tabs.forEach((button,index)=>button.addEventListener('click',()=>{
   description.textContent=visualDescriptions[index];
  }));
 }
 if (step.id==='structure') {
  const structureDescriptions=[
   '사용자가 사이트에 접속해 브랜드를 알아보고 제품을 탐색하는 과정을 흐름도로 정리했습니다. 주요 행동과 페이지 간 이동 경로를 검토하며 자연스러운 탐색 흐름을 구성했습니다.',
   '사이트의 주요 페이지와 하위 메뉴를 분류하고, 팀원들과 논의하며 전체 메뉴 구조를 설계했습니다. 사용자가 원하는 정보에 쉽게 접근할 수 있도록 메뉴의 구성과 계층을 정리했습니다.',
   '콘텐츠의 성격과 중요도에 따라 정보를 그룹화하고, 페이지별 정보의 위계와 연결 관계를 구체화했습니다. 이를 통해 일관된 정보 구조와 화면 설계의 기준을 마련했습니다.',
   '팀원들과 페이지 구성, 콘텐츠 배치, 디자인 방향에 대한 의견을 공유하고 논의 내용을 기록했습니다. 결정 사항과 수정 내용을 정리하며 작업 방향을 함께 조율했습니다.',
  ];
  description.textContent=structureDescriptions[0];
  tabs.forEach((button,index)=>button.addEventListener('click',()=>{
   description.textContent=structureDescriptions[index];
  }));
 }
 if (step.id==='define') {
  const defineDescriptions=[
   '사용자 조사 내용을 바탕으로 서로 다른 목적과 니즈를 가진 세 가지 페르소나를 설정했습니다. 각 유형의 목표와 불편함을 정리해 사용자 중심의 개선 방향을 구체화했습니다.',
   '사용자가 브랜드를 탐색하고 제품을 선택하기까지의 과정을 단계별로 정리했습니다. 탐색 과정에서 발생하는 불편함을 파악하고, 각 단계에 필요한 개선 방안을 도출했습니다.',
   '공식 정보의 접근성, 브랜드 스토리 전달, 직관적인 향 탐색을 핵심 문제로 정의했습니다. 이를 바탕으로 사용자에게 제공할 가치와 해결 방향을 체계적으로 정리했습니다.',
  ];
  description.textContent=defineDescriptions[0];
  tabs.forEach((button,index)=>button.addEventListener('click',()=>{
   description.textContent=defineDescriptions[index];
  }));
  [{materials:personas,label:'퍼소나: 중앙 02, 왼쪽 01, 오른쪽 03',primaryLabel:'PERSONA 02 · PRIMARY'},
   {materials:journeyMaps,label:'저니맵: 중앙 02, 왼쪽 01, 오른쪽 03',primaryLabel:'JOURNEY 02'},
   {materials:leanCanvases,label:'린캔버스: 중앙 PROBLEM 02, 왼쪽 PROBLEM 01, 오른쪽 PROBLEM 03',primaryLabel:'PROBLEM 02'}].forEach(({materials,label,primaryLabel})=>{
   const gallery=element('div','ux-lean-trio');
   gallery.dataset.documentGallery=materials[1].id;
   gallery.setAttribute('role','group');
   gallery.setAttribute('aria-label',label);
   materials.forEach((material,materialIndex)=>{
    const button=element('button','ux-lean-trio-card'+(materialIndex===1?' ux-lean-trio-card--primary':''));
    button.type='button';
    button.setAttribute('aria-label',material.label+' 크게 보기');
    button.append(documentPreview(material),element('span','',materialIndex===1?primaryLabel:'0'+(materialIndex+1)));
    button.addEventListener('click',()=>openDocument(material));
    gallery.append(button);
   });
   galleries.set(materials[1].id,gallery);
   previewButton.before(gallery);
  });
 }
 step.documents.filter(material=>material.pages).forEach(material=>{
  const gallery=element('div','ux-document-pair');
  gallery.dataset.documentGallery=material.id;
  gallery.setAttribute('role','group');
  gallery.setAttribute('aria-label',material.label+' 원본 자료');
  material.pages.forEach(page=>{
   const button=element('button','ux-document-pair-card');
   button.type='button';
   button.setAttribute('aria-label',page.label+' 크게 보기');
   button.append(documentPreview(page),element('span','',page.label+' ↗'));
   button.addEventListener('click',()=>openDocument(page));
   gallery.append(button);
  });
  galleries.set(material.id,gallery);
  previewButton.before(gallery);
 });
 const updateGallery=()=>{
  galleries.forEach((gallery,id)=>{gallery.hidden=id!==current.id;});
  previewButton.hidden=galleries.has(current.id);
 };
 updateGallery();
 tabs.forEach((button,documentIndex) => button.addEventListener('click',() => {
  current = step.documents[documentIndex];
  updateGallery();
  updatePreview();
  if (step.id==='research') description.textContent=current.description || step.description;
  if (step.id==='interview') {
   const isInterview=current.id==='interview';
   panel.querySelector('#ux-step-interview').textContent=isInterview ? '사용자 인터뷰와 분석' : step.title;
   description.style.whiteSpace='normal';
   description.textContent=isInterview
    ? '딥티크 웹사이트 이용 경험을 바탕으로 제품 탐색 과정에서 느끼는 불편함과 브랜드 콘텐츠에 대한 기대를 살펴봤습니다. 인터뷰 답변을 통해 향수 비교의 어려움과 브랜드 스토리 전달의 아쉬움을 파악하고, 개선 방향을 구체화했습니다.'
    : step.description;
  }
  tabs.forEach(tab => tab.setAttribute('aria-pressed',String(tab === button)));
 }));
 previewButton.addEventListener('click',() => openDocument(current));
 panel.querySelector('.ux-material-caption button').addEventListener('click',() => openDocument(current));
});
window.addEventListener('pagehide',event => {if(!event.persisted) cleanups.forEach(cleanup => cleanup());});
