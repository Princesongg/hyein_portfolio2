import {answers} from '../../data/chatbot/answers.js';
import {suggestions,projects,matchIntent,getReply} from '../../data/chatbot/intents.js';

export default function initPostbox(root) {
 const widget=document.querySelector('.postbox-widget');
 const launch=widget.querySelector('.postbox-launch');
 const panel=widget.querySelector('.postbox-panel');
 const log=widget.querySelector('.postbox-log');
 const input=widget.querySelector('textarea');
 const form=widget.querySelector('form');
 const scroller=root.querySelector('.portfolio-scroll');
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const controller=new AbortController();
 const {signal}=controller;
 let opened=false,closingTimer=0,openingFrame=0,composing=false;
 let hintTimer=0,hintHideTimer=0;
 function stopHint(){
  clearTimeout(hintTimer);
  clearTimeout(hintHideTimer);
  launch.classList.remove('postbox-hint-visible');
 }
 function scheduleHint(delay=20000){
  stopHint();
  if(opened||document.hidden)return;
  hintTimer=setTimeout(()=>{
   if(opened||document.hidden)return;
   launch.classList.add('postbox-hint-visible');
   hintHideTimer=setTimeout(()=>scheduleHint(16000),4000);
  },delay);
 }
 const behavior=()=>media.matches?'instant':'smooth';
 function close(){
  opened=false;
  cancelAnimationFrame(openingFrame);
  launch.setAttribute('aria-expanded','false');
  panel.classList.remove('is-open');
  panel.inert=true;
  launch.focus({preventScroll:true});
  clearTimeout(closingTimer);
  closingTimer=setTimeout(()=>{panel.hidden=true;},media.matches?0:250);
  scheduleHint();
 }
 function open(){
  if(opened) return;
  opened=true;
  stopHint();
  clearTimeout(closingTimer);
  panel.hidden=false;
  panel.inert=false;
  launch.setAttribute('aria-expanded','true');
  openingFrame=requestAnimationFrame(()=>{
   panel.classList.add('is-open');
   (window.innerWidth<=600?log:input).focus({preventScroll:true});
  });
 }
 function navigate(href){
  const target=document.getElementById(href.slice(1));
  if(!target) return;
  close();
  const personal=target.closest('.personal-projects');
  if(personal){
   const panels=[...personal.querySelectorAll('.personal-projects-panel')];
   const index=panels.indexOf(target);
   if(personal.dataset.horizontal!=='true'){
    scroller.scrollTo({top:scroller.scrollTop+personal.getBoundingClientRect().top-scroller.getBoundingClientRect().top,behavior:behavior()});
   } else {
    personal.querySelector('.personal-projects-stage').scrollTo({left:0,behavior:'instant'});
   }
   personal.querySelectorAll('.personal-projects-chapters button')[index]?.click();
  } else {
   const offset=['about','skill','archive','contact'].includes(target.id)?0:90;
   scroller.scrollTo({top:scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-offset,behavior:behavior()});
  }
 }
 function questionButton(id,label){
  const button=document.createElement('button');
  button.type='button';
  button.dataset.question=id;
  button.textContent=label;
  return button;
 }
 function message(text,user=false){
  const article=document.createElement('div');
  article.className='postbox-message'+(user?' postbox-message--user':'');
  article.setAttribute('aria-label',user?'방문자 질문':'우편함 답변');
  const paragraph=document.createElement('p');
  paragraph.textContent=text;
  article.append(paragraph);
  return article;
 }
 function addLinks(article,items){
  const area=document.createElement('div');
  area.className='postbox-related';
  items.forEach(([label,href])=>{
   if(href.startsWith('#')&&!document.getElementById(href.slice(1))) return;
   const link=document.createElement('a');
   link.textContent=label;
   link.href=href;
   if(href.startsWith('#')) link.dataset.sectionLink=href;
   else if(href.startsWith('https://')) {link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${label} (새 탭)`);}
   area.append(link);
  });
  if(area.children.length) article.append(area);
  return area;
 }
 function send(text,id=matchIntent(text)){
  text=text.trim().slice(0,500);
  if(!text) return;
  const reply=getReply(id);
  if(id==='skills'&&/react|리액트/i.test(text)) reply.answer+='\n\n현재 이 포트폴리오는 React가 아닌 HTML·CSS·JavaScript로 제작하고 있으며, Codex 등 AI 도구를 활용해 구현하고 있습니다.';
  const article=message(reply.answer);
  addLinks(article,reply.links);
  if(id==='personal'){
   const followups=document.createElement('div');
   followups.className='postbox-related';
   projects.forEach(project=>followups.append(questionButton(project.id,project.name)));
   article.append(followups);
  }
  if(id==='contact'){
   const realLinks=[...document.querySelectorAll('#contact a[href]')].map(a=>[a.textContent.trim(),a.getAttribute('href')]);
   addLinks(article,realLinks);
  }
  if(id==='fallback'){
   const followups=document.createElement('div');followups.className='postbox-related';
   ['intro','personal','contact'].forEach(key=>followups.append(questionButton(key,answers[key].label)));
   article.append(followups);
  }
  log.append(message(text,true),article);
  input.value='';
  // Only a visitor's new question moves the conversation, never background updates.
  log.scrollTo({top:log.scrollHeight,behavior:behavior()});
 }
 log.append(message('안녕하세요! 💌\n혜인의 포트폴리오에 오신 걸 환영해요.\n제가 어떤 경험을 해왔고, 어떤 작업을 진행했는지\n궁금하신가요?\n아래 질문을 선택하거나 직접 입력해 주세요!'));
 const recommended=widget.querySelector('.postbox-suggestions');
 suggestions.forEach(id=>recommended.append(questionButton(id,answers[id].label)));
 launch.addEventListener('click',()=>opened?close():open(),{signal});
 widget.querySelector('.postbox-close').addEventListener('click',close,{signal});
 widget.querySelector('.postbox-top').addEventListener('click',()=>{
  if(opened) close();
  scroller.scrollTo({top:0,behavior:behavior()});
 },{signal});
 widget.addEventListener('click',event=>{
  const button=event.target.closest('[data-question]');
  if(button){const id=button.dataset.question;send(answers[id]?.question||`${projects.find(p=>p.id===id).name} 프로젝트를 알려주세요.`,id);}
  const link=event.target.closest('[data-section-link]');
  if(link){event.preventDefault();navigate(link.dataset.sectionLink);}
 },{signal});
 form.addEventListener('submit',event=>{event.preventDefault();if(!composing)send(input.value);},{signal});
 input.addEventListener('compositionstart',()=>{composing=true;},{signal});
 input.addEventListener('compositionend',()=>{composing=false;},{signal});
 input.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&!composing&&event.keyCode!==229){event.preventDefault();form.requestSubmit();}
 },{signal});
 document.addEventListener('keydown',event=>{
  if(!opened) return;
  if(event.key==='Escape'){event.preventDefault();close();}
  if(event.key==='Tab'&&panel.contains(document.activeElement)){
   const focusables=[...panel.querySelectorAll('button,a[href],textarea,[tabindex="0"]')];
   const first=focusables[0],last=focusables.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 },{signal});
 function viewport(){
  widget.style.setProperty('--postbox-viewport-height',`${window.visualViewport?.height||window.innerHeight}px`);
  widget.style.setProperty('--postbox-viewport-top',`${window.visualViewport?.offsetTop||0}px`);
 }
 window.visualViewport?.addEventListener('resize',viewport,{signal});
 window.visualViewport?.addEventListener('scroll',viewport,{signal});
 viewport();
 document.addEventListener('visibilitychange',()=>document.hidden?stopHint():scheduleHint(8000),{signal});
 scheduleHint(8000);
 return ()=>{controller.abort();stopHint();clearTimeout(closingTimer);cancelAnimationFrame(openingFrame);};
}
