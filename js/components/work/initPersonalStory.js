import initTeamHorizontal from '../../animations/initTeamHorizontal.js';

// Mobile summaries keep each project readable on one screen; desktop copy stays intact.
const summaries = [
 ['핑크·블루 컬러와 콜라주, 스티커 그래픽으로 페리페라의 발랄한 감성을 표현한 랜딩페이지입니다.', '장식적인 그래픽과 정보 전달의 균형을 맞추며, 제품이 돋보이는 화면 구성을 배웠습니다.', '브랜드 비주얼·콜라주 제작, PC·모바일 UI 디자인과 랜딩페이지 구현을 진행했습니다.'],
 ['태양의 QUINTESSENCE 앨범을 블루 컬러와 대형 타이포그래피로 표현한 프로모션 페이지입니다.', '이미지·영상·타이포그래피를 조합해 음악의 분위기를 전달하는 콘텐츠 흐름을 고민했습니다.', '메인 비주얼, 앨범·영상 레이아웃, 회전형 CD 그래픽 제작과 UI 구현을 진행했습니다.'],
 ['블랙·옐로 컬러와 역동적인 레이아웃으로 오니츠카 타이거의 개성을 표현한 브랜드 페이지입니다.', '제품 이미지와 타이포그래피, 콘텐츠 배치로 브랜드의 분위기를 전달하는 방법을 익혔습니다.', '메인 비주얼과 제품 레이아웃, 상품 UI·인터랙션 디자인 및 페이지 구현을 진행했습니다.'],
 ['진료 정보와 주요 의료 서비스를 쉽게 찾도록 가독성과 정보 흐름을 정돈한 병원 웹사이트입니다.', '의료 정보를 목적에 따라 구분하며 정보의 우선순위와 화면 구성 방법을 고민했습니다.', '진료과목·의료진 UI, 빠른 메뉴와 병원 안내 레이아웃, 메인 페이지 구현을 진행했습니다.'],
 ['유니클로의 심플한 이미지를 바탕으로 제품 카테고리와 주요 콘텐츠를 직관적으로 구성했습니다.', '콘텐츠 배치와 여백, 타이포그래피가 가독성에 미치는 영향을 배우며 웹 레이아웃을 익혔습니다.', '브랜드 비주얼과 제품·콘텐츠 레이아웃, 타이포그래피 및 메인 페이지 UI 구현을 진행했습니다.']
];

export default function initPersonalStory(root) {
 const mobile=matchMedia('(max-width:700px)');
 const track=root.querySelector('.personal-projects-track');
 const nav=root.querySelector('.personal-projects-chapters');
 const originals=[...track.children],buttons=[...nav.children];
 let destroy=()=>{};
 const setup=()=>{
  destroy();const restore=[];
  if(mobile.matches){
   const panels=[];
   const move=(node,parent)=>{const marker=document.createComment('personal mobile position');node.before(marker);parent.append(node);restore.push(()=>marker.replaceWith(node));};
   originals.forEach((original,index)=>{
    const copy=original.querySelector('.personal-projects-copy');
    const panel=document.createElement('article');panel.className='personal-projects-panel personal-mobile-panel';panel.id=original.id;
    const header=document.createElement('header');header.className='personal-projects-copy';
    const title=copy.querySelector('h2').cloneNode(true);
    panel.setAttribute('aria-labelledby',title.id);header.append(copy.querySelector('.personal-projects-kicker').cloneNode(true),title);panel.append(header);
    move(original.querySelector('.personal-projects-visual'),panel);
    const body=copy.querySelector('.personal-projects-info').cloneNode(true);
    body.querySelectorAll('p').forEach((p,i)=>p.textContent=summaries[index][i]);
    body.querySelector('.personal-projects-tasks')?.remove();panel.append(body);
    move(copy.querySelector('.personal-projects-link'),panel);panels.push(panel);
   });
   track.replaceChildren(...panels);root.setAttribute('data-mobile-personal','');
  }
  const cleanup=initTeamHorizontal(root,'personal-projects');
  destroy=()=>{cleanup();restore.forEach(fn=>fn());track.replaceChildren(...originals);nav.replaceChildren(...buttons);root.removeAttribute('data-mobile-personal');};
 };
 mobile.addEventListener('change',setup);setup();
 return ()=>{mobile.removeEventListener('change',setup);destroy();};
}
