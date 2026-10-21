import initTeamHorizontal from '../../animations/initTeamHorizontal.js';

export default function initRoleStory(root) {
 const mobile=matchMedia('(max-width:700px)');
 const track=root.querySelector('.role-story-track');
 const nav=root.querySelector('.role-story-chapters');
 const originalPanels=[...track.children];
 const originalButtons=[...nav.children];
 let destroy=()=>{};
 const setup=()=>{
  destroy();
  const restore=[];
  if(mobile.matches){
   const features=[...originalPanels[0].querySelectorAll('.what-i-do-feature')];
   const contribution=originalPanels[1].querySelector('.what-i-do-contribution-grid');
   const copy=originalPanels[1].querySelector('.what-i-do-contribution-copy');
   const extra=originalPanels[1].querySelector('.what-i-do-extra');
   const figures=[...extra.querySelectorAll(':scope > figure')];
   const caption=extra.querySelector('.what-i-do-screen-caption');
   const move=(node,parent)=>{const marker=document.createComment('mobile role position');node.before(marker);parent.append(node);restore.push(()=>marker.replaceWith(node));};
   const labels=['01 메인','02 GALERIE','03 협업','04 화면 개선','05 모바일'];
   const subtitles=['메인 페이지 UI 디자인','GALERIE 디자인과 구현','디자인 방향 조율과 코드 개선','여러 페이지의 완성도 높이기','모바일 구매 화면과 상품 탐색'];
   const panels=labels.map((label,index)=>{
    const panel=document.createElement('section');panel.className='what-i-do role-mobile-panel';
    panel.id=index===0?originalPanels[0].id:index===2?originalPanels[1].id:`mobile-role-${index+1}`;
    panel.setAttribute('aria-label',label);
    const header=originalPanels[index<2?0:1].querySelector('.what-i-do-heading').cloneNode(true);
    header.querySelector('h2').id=index===0?'what-i-do-title':index===2?'what-i-do-more-title':`mobile-role-title-${index+1}`;
    panel.setAttribute('aria-labelledby',header.querySelector('h2').id);
    header.querySelector('div>p').textContent=`DIPTYQUE · MY ROLE / 0${index+1} / 05`;
    header.querySelector('div>span').textContent=subtitles[index];
    if(index!==0&&index!==2)header.querySelector('.what-i-do-heading-note')?.remove();
    panel.append(header);return panel;
   });
   move(features[0],panels[0]);move(features[1],panels[1]);move(contribution,panels[2]);
   const desktop=document.createElement('div');desktop.className='what-i-do-detail-row';
   move(copy,desktop);
   const desktopGallery=document.createElement('div');desktopGallery.className='what-i-do-extra';
   figures.slice(0,3).forEach(figure=>move(figure,desktopGallery));desktop.append(desktopGallery);panels[3].append(desktop);
   const phones=document.createElement('div');phones.className='what-i-do-extra role-mobile-phones';
   figures.slice(3).forEach(figure=>move(figure,phones));move(caption,phones);panels[4].append(phones);
   track.replaceChildren(...panels);
   nav.replaceChildren(...labels.map(label=>{const button=document.createElement('button');button.type='button';button.textContent=label;return button;}));
   root.setAttribute('data-mobile-role','');
  }
  const cleanup=initTeamHorizontal(root,'role-story');
  destroy=()=>{cleanup();restore.forEach(fn=>fn());track.replaceChildren(...originalPanels);nav.replaceChildren(...originalButtons);root.removeAttribute('data-mobile-role');};
 };
 mobile.addEventListener('change',setup);setup();
 return ()=>{mobile.removeEventListener('change',setup);destroy();};
}
