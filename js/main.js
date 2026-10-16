import initHeroMotion from './animations/initHeroMotion.js';
import initLaptopPreview from './animations/initLaptopPreview.js';
import initDocumentDialog from './components/work/initDocumentDialog.js';
import initPostbox from './components/chatbot/initPostbox.js';
import initQuickQA from './components/contact/initQuickQA.js';
import initLetterInteraction from './animations/initLetterInteraction.js';
import initHeaderColor from './animations/initHeaderColor.js';
import initCon1Typing from './animations/initCon1Typing.js';
import initReadyTyping from './animations/initReadyTyping.js';
import initWorkTyping from './animations/initWorkTyping.js';
import initTeamBackground from './animations/initTeamBackground.js';
import initPersonalBackground from './animations/initPersonalBackground.js';
import initArchiveGallery from './animations/initArchiveGallery.js';
import initSkillOrbit from './animations/initSkillOrbit.js';
import initAboutIntro from './animations/about/initAboutIntro.js';
import initAboutPostcards from './animations/about/initAboutPostcards.js';
import initTeamHorizontal from './animations/initTeamHorizontal.js';
import initDotTransition from './animations/initDotTransition.js';
import initKeywordCards from './animations/initKeywordCards.js';
import initKeywordStack from './animations/initKeywordStack.js';
import initBracketReveal from './animations/initBracketReveal.js';
import initStoryReveal from './animations/initStoryReveal.js';
import initStampPress from './animations/initStampPress.js';
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
 root.querySelector('.hero').style.height = Math.max(root.clientHeight,1080 * scale)+'px';
 root.querySelector('.hero-canvas').style.transform = `translateX(-50%) scale(${scale})`;
 root.querySelector('.con1-letter>div').style.transform = `translateX(-50%) scale(${scale})`;
 root.querySelector('.portfolio-frame>div').style.transform = `scale(${scale},${root.clientHeight / 1080})`;
 root.querySelector('.portfolio-logo-icon img').style.transform = `scale(${Math.min(Math.max(scale,.66),1)})`;
}
resizeHero();
const resizeObserver = new ResizeObserver(resizeHero);
resizeObserver.observe(root);
cleanups.push(() => resizeObserver.disconnect());

start(initHeroMotion,root);
root.querySelectorAll('.team-laptop-preview,.team-story-preview,.team-story-mobile-preview,.team-story-galerie-preview,.personal-onitsuka-video').forEach(video=>start(initLaptopPreview,video));
root.querySelectorAll('.personal-projects-visual > a').forEach(preview=>{
 const label=document.createElement('span');
 label.className='personal-preview-caption';
 label.textContent='MAIN PAGE · PC / MOBILE UI DESIGN';
 preview.append(label);
});
start(initPostbox,root);
start(initQuickQA,reference('.quick-qa'));
start(initLetterInteraction,root);
start(initHeaderColor,root);
start(initDotTransition,reference('.con1-transition'));
start(initCon1Typing,reference('.con1-copy'));
start(initReadyTyping,reference('.contact-ready'));
start(initKeywordCards,reference('.con2'));
start(initKeywordStack,reference('.keywords-about-stack'));
root.querySelectorAll('.bracket-reveal').forEach(element => start(initBracketReveal,element));
start(initWorkTyping,reference('.work-intro'));
root.querySelectorAll('.team-start-art').forEach(art => start(initStampPress,art));
start(initTeamBackground,reference('.team-detail'));
start(initPersonalBackground,reference('.personal-start'));
start(initPersonalBackground,reference('.video-start'),{
 previousSelector:'.personal-projects',
 property:'--video-scroll-background',
 from:[210,222,235],
 to:[143,110,114],
 colors:{
  '--video-scroll-ink':[[65,97,148],[247,242,239]],
  '--video-scroll-muted':[[100,123,155],[247,242,238]],
  '--video-scroll-accent':[[100,123,155],[199,174,171]],
 },
});
start(initTeamHorizontal,reference('.team-story'));
start(initStoryReveal,reference('.team-story'));
start(initTeamHorizontal,reference('.ux-process'),'ux-process');
start(initTeamHorizontal,reference('.personal-projects'),'personal-projects');
start(initTeamHorizontal,reference('.short-form'),'short-form');
start(initArchiveGallery,reference('.archive-gallery'));
start(initSkillOrbit,reference('.skill-section'));
start(initAboutIntro,reference('.about-intro'));
start(initAboutPostcards,reference('.about-postcards'));
start(initPersonalBackground,reference('.about-intro'),{
 previousSelector:'.skill-section',
 property:'--about-scroll-background',
 from:[247,242,239],
 to:[200,174,170],
});
start(initPersonalBackground,reference('.archive-start'),{
 previousSelector:'.short-form',
 property:'--archive-scroll-background',
 from:[143,110,114],
 to:[247,242,239],
 colors:{
  '--archive-scroll-ink':[[247,242,239],[173,185,203]],
  '--archive-scroll-muted':[[226,207,204],[175,187,204]],
  '--archive-scroll-accent':[[226,207,204],[210,221,235]],
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
root.querySelectorAll('.project-filters button').forEach(button => {
 button.addEventListener('click',() => {
  const category = button.textContent.trim();
  root.querySelectorAll('.project-filters button').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  projectTrack.replaceChildren(...projects.filter(project => category === 'ALL' || project.dataset.category === category));
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
 const behavior = reducedMotion() ? 'instant' : 'smooth';
 if (section.dataset.horizontal !== 'true') {
  stage.scrollTo({left:index*stage.clientWidth,behavior});
 } else {
  const top = scroller.scrollTop+section.getBoundingClientRect().top-scroller.getBoundingClientRect().top;
  scroller.scrollTo({top:top+index*stage.clientWidth,behavior});
 }
}
root.addEventListener('click',event => {
 const link = event.target.closest('.project-detail-link');
 if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
 const target = reference(link.getAttribute('href'));
 if (!target) return;
 event.preventDefault();
 const personal = target.closest('.personal-projects');
 if (personal) {
  const panels = [...personal.querySelectorAll('.personal-projects-panel')];
  if (personal.dataset.horizontal !== 'true') {
   const top = scroller.scrollTop + personal.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
   scroller.scrollTo({top,behavior:reducedMotion() ? 'instant' : 'smooth'});
  }
  goToChapter(personal,'personal-projects',panels.indexOf(target));
 } else {
  const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 90;
  scroller.scrollTo({top,behavior:reducedMotion() ? 'instant' : 'smooth'});
 }
});
for (const prefix of ['team-story','ux-process','personal-projects','short-form']) {
 const section = root.querySelector('.'+prefix);
 const buttons = section.querySelectorAll('.'+prefix+'-chapters button');
 buttons.forEach((button,index) => button.addEventListener('click',() => goToChapter(section,prefix,index)));
 const stage = section.querySelector('.'+prefix+'-stage');
 stage.addEventListener('scroll',() => {
  if (section.dataset.horizontal === 'true') return;
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
 };
 if (step.id==='research') {
  previewButton.replaceChildren(documentPreview(current));
  addResearchLabel();
 }
 if (step.id==='interview') {
  previewButton.replaceChildren(documentPreview(current));
  previewButton.setAttribute('aria-label',current.label+' 크게 보기');
  caption.textContent=current.label;
 }
 const galleries=new Map();
 if (step.id==='define') {
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
  previewButton.replaceChildren(documentPreview(current));
  previewButton.setAttribute('aria-label',current.label+' 크게 보기');
  caption.textContent = current.label;
  addResearchLabel();
  if (step.id==='research') description.textContent=current.description || step.description;
  tabs.forEach(tab => tab.setAttribute('aria-pressed',String(tab === button)));
 }));
 previewButton.addEventListener('click',() => openDocument(current));
 panel.querySelector('.ux-material-caption button').addEventListener('click',() => openDocument(current));
});
window.addEventListener('pagehide',event => {if(!event.persisted) cleanups.forEach(cleanup => cleanup());});
