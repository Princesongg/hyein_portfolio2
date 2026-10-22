const document = (id, label, title, columns) => ({id, label, title, columns, image:null});
const brandAudit = {
 ...document('brand','자사 분석','Brand audit',['브랜드 이미지','콘텐츠 구성','탐색 구조','개선 방향']),
 image:'/assets/work/ux/planning/brand-audit.jpg',
 description:'기존 딥티크 판매 채널의 콘텐츠·UI·비주얼·탐색 구조를 분석했습니다. 상품 중심의 구성에서 브랜드 스토리와 향의 감성이 충분히 전달되지 않는 점을 파악하고, 이를 보완하기 위한 개선 방향을 도출했습니다.',
 originalImage:{
  src:'/assets/work/ux/planning/brand-audit.jpg',
  width:1920,height:1080,
  alt:'팀원들과 함께 진행한 딥티크 자사분석 원본: Contents, UI, Visual, Marketing, Theme & Message, Support 항목별 평가와 상세 설명',
 },
};
const competitorResearch = {
 id:'competitors',label:'경쟁사 분석',title:'Competitor analysis',
 image:'/assets/work/ux/planning/competitor-research.jpg',
 description:'조 말론, 르 라보, 바이레도의 웹사이트를 비교하며 브랜드별 콘텐츠 구성, 시각적 표현 방식, 제품 탐색 구조를 분석했습니다. 각 브랜드의 강점과 개선점을 살펴보고, 이를 바탕으로 딥티크만의 차별화된 브랜드 경험을 위한 디자인 방향을 도출했습니다.',
 originalImage:{
  src:'/assets/work/ux/planning/competitor-research.jpg',
  width:2067,height:1653,
  alt:'팀원들과 함께 진행한 경쟁사 리서치 원본: 조말론, 르라보, 바이레도의 화면 구성과 콘텐츠, 탐색 및 프로모션 비교 분석',
 },
};
const steepAnalysis = {
 id:'steep',label:'STEEP',title:'STEEP analysis',
 image:'/assets/work/ux/planning/steep-analysis.png',
 description:'향수 시장에 영향을 미치는 사회·기술·경제·환경·정책 요인을 분석하고, 딥티크의 온라인 브랜드 경험을 강화하기 위한 방향을 도출했습니다.',
 originalImage:{
  src:'/assets/work/ux/planning/steep-analysis.png',
  width:1920,height:1200,
  alt:'딥티크 팀 프로젝트 STEEP 분석 원본: 사회, 기술, 경제, 환경, 정책 관점에서 살펴본 향수 시장과 온라인 경험',
 },
};
const threeCAnalysis = {
 id:'3c',label:'3C 분석',title:'3C analysis',
 image:'/assets/work/ux/planning/3c-analysis.png',
 description:'고객의 니즈와 경쟁사의 강점, 딥티크의 브랜드 특성을 분석하고, 편리한 제품 탐색과 감성적인 브랜드 경험을 연결할 개선 방향을 도출했습니다.',
 originalImage:{
  src:'/assets/work/ux/planning/3c-analysis.png',
  width:1920,height:1400,
  alt:'딥티크 팀 프로젝트 3C 분석 원본: 고객의 탐색 행동, 경쟁사의 시장 특징, 자사의 강점과 한계 및 인사이트',
 },
};
export const leanCanvases = [
 {id:'lean-01',label:'린캔버스 · PROBLEM 01',title:'Lean Product Canvas · Problem 01',image:'/assets/work/ux/lean-problem-01.jpg'},
 {id:'lean',label:'린캔버스 · PROBLEM 02 · PRIMARY PERSONA',title:'Lean Product Canvas · Problem 02',image:'/assets/work/ux/lean-problem-02.jpg'},
 {id:'lean-03',label:'린캔버스 · PROBLEM 03',title:'Lean Product Canvas · Problem 03',image:'/assets/work/ux/lean-problem-03.jpg'},
].map(material=>({...material,originalImage:{
 src:material.image,width:2200,height:1650,
 alt:material.label+' 팀 프로젝트 기획 원본 자료',
}}));
export const leanCanvas = leanCanvases[1];
export const personas = [
 {id:'persona-01',label:'퍼소나 01 · 기존 고객형',title:'Persona 01',image:'/assets/work/ux/planning/persona-01.jpg'},
 {id:'persona',label:'퍼소나 · PERSONA 02 · PRIMARY PERSONA',title:'Primary persona',image:'/assets/work/ux/planning/persona-02.jpg'},
 {id:'persona-03',label:'퍼소나 03 · 향 탐색의 어려움',title:'Persona 03',image:'/assets/work/ux/planning/persona-03.jpg'},
].map(material=>({...material,originalImage:{
 src:material.image,width:1600,height:1000,
 alt:material.label+' 팀 프로젝트 사용자 특성과 목표, 불편한 점 및 니즈 정리 원본',
}}));
export const journeyMaps = [
 {id:'journey-01',label:'저니맵 01 · 기존 고객형',title:'User journey 01',image:'/assets/work/ux/planning/journey-01.jpg'},
 {id:'journey',label:'저니맵 · JOURNEY 02 · PRIMARY PERSONA',title:'User journey 02',image:'/assets/work/ux/planning/journey-02.png'},
 {id:'journey-03',label:'저니맵 03 · 향 탐색',title:'User journey 03',image:'/assets/work/ux/planning/journey-03.jpg'},
].map(material=>({...material,originalImage:{
 src:material.image,width:1920,height:1080,
 alt:material.label+' 팀 프로젝트 사용자 행동, 감정, 불편한 점 및 해결 방향 정리 원본',
}}));
const moodboard = {
 id:'mood',label:'무드보드',title:'Moodboard',
 image:'/assets/work/ux/planning/moodboard.png',
 originalImage:{
  src:'/assets/work/ux/planning/moodboard.png',
  width:1920,height:1300,
  alt:'딥티크 팀 프로젝트 디자인 무드보드 원본: 향과 장면, 이야기를 담은 드로잉, 종이 콜라주, 식물과 빈티지 질감',
 },
};
const designMindmap = {
 id:'mindmap',label:'디자인 마인드맵',title:'Design mindmap',
 image:'/assets/work/ux/planning/design-mindmap.png',
 originalImage:{
  src:'/assets/work/ux/planning/design-mindmap.png',
  width:1920,height:1080,
  alt:'딥티크 팀 프로젝트 디자인 마인드맵 원본: 자연, 향수, 파리, 기억, 여행, 예술과 창립자를 중심으로 확장한 브랜드 이미지와 이야기 키워드',
 },
};
const designSystem = {
 id:'system',label:'디자인 시스템',title:'Design system',
 image:'/assets/work/ux/planning/design-system.png',
 originalImage:{
  src:'/assets/work/ux/planning/design-system.png',
  width:1920,height:1080,
  alt:'딥티크 팀 프로젝트 디자인 시스템 원본: 로고, 배경과 텍스트 컬러, 영문 및 한글 타이포그래피',
 },
};
const wireframe = {
 id:'wireframe',label:'와이어프레임',title:'Wireframe',
 image:'/assets/work/ux/planning/wireframe.png',
 originalImage:{
  src:'/assets/work/ux/planning/wireframe.png',
  width:1920,height:1080,
  alt:'딥티크 팀 프로젝트 와이어프레임 원본: 정보 구조를 바탕으로 정리한 주요 화면의 흐름과 레이아웃',
 },
};
const componentSheets = [
 {id:'component-grid',label:'웹·모바일 그리드',image:'/assets/work/ux/planning/component-grid.png',width:1287,height:634,alt:'딥티크 웹과 모바일 화면의 그리드 구성'},
 {id:'components',label:'컴포넌트',image:'/assets/work/ux/planning/components.png',width:2000,height:1200,alt:'딥티크 PC·모바일 내비게이션, 로그인 상태별 헤더, 더 보기와 TOP 버튼 및 화살표 컴포넌트'},
].map(({width,height,alt,...material})=>({...material,originalImage:{src:material.image,width,height,alt}}));
const components = {...componentSheets[1],pages:componentSheets};
const presentationPages = [
 {number:16,height:2660,alt:'장표 16: 기존 온라인 경험과 새롭게 디자인한 브랜드 경험 비교'},
 {number:18,height:2500,alt:'장표 18: 카테고리 탐색, 향 발견, 3D 향수와 푸터 모션 설명'},
 {number:8,height:2200,alt:'장표 8: 공식 경험 통합, 브랜드 경험 확장과 직관적인 향 탐색 솔루션'},
].map(({number,height,alt})=>{
 const image='/assets/work/ux/planning/presentation-'+number+'.png';
 return {id:'presentation-'+number,label:'장표 '+number,image,originalImage:{src:image,width:1920,height,alt}};
});
const presentation = {...presentationPages[0],id:'presentation',label:'장표',title:'Presentation',pages:presentationPages};
const menuTree = {
 id:'menu',label:'메뉴트리',title:'Information architecture',
 image:'/assets/work/ux/planning/menu-tree.jpg',
 originalImage:{
  src:'/assets/work/ux/planning/menu-tree.jpg',width:4545,height:3849,
  alt:'딥티크 메뉴트리: HOME, SHOP, ABOUT, GALERIE, CONTACT US, MY PAGE와 하위 메뉴 구성',
 },
};
const iaStructure = {
 id:'requirements',label:'IA 구조도',title:'Information architecture',
 image:'/assets/work/ux/planning/ia-structure.png',
 originalImage:{
  src:'/assets/work/ux/planning/ia-structure.png',width:1920,height:1080,
  alt:'딥티크 IA 구조도: HOME, SHOP, ABOUT, GALERIE, CONTACT US, MY PAGE의 주요 메뉴와 최대 3단계 하위 페이지 계층 관계',
 },
};
const flowPages = [
 {id:'flow-01',label:'페르소나 01 · 공식 정보 탐색과 재구매',width:2554,height:3648,alt:'페르소나 1번 기반 플로우차트: 공식 정보 탐색부터 재구매까지 이어지는 Full Site Flow'},
 {id:'flow-02',label:'페르소나 02 · 브랜드 경험과 향수 히스토리',width:2180,height:3426,alt:'페르소나 2번 기반 플로우차트: 브랜드 경험에서 향수 히스토리까지 이어지는 Immersive Flow'},
 {id:'flow-03',label:'페르소나 03 · 향의 시각적 탐색',width:2200,height:3200,alt:'페르소나 3번 기반 플로우차트: 향을 시각적으로 이해하고 탐색하는 GALERIE Flow'},
].map(({width,height,alt,...material},index)=>{
 const image='/assets/work/ux/planning/flow-persona-0'+(index+1)+'.jpg';
 return {...material,image,originalImage:{src:image,width,height,alt}};
});
const userFlow = {...flowPages[0],id:'flow',label:'사용자 플로우차트',title:'User flow',pages:flowPages};
const meetingPages = [
 {id:'meeting-01',label:'회의록 01',image:'/assets/work/ux/planning/meeting-notes-01.png',width:839,height:749,alt:'딥티크 팀 프로젝트 회의록: 9월 9일과 10일의 논의 내용, 수정 사항과 역할 분담'},
 {id:'meeting-02',label:'회의록 02',image:'/assets/work/ux/planning/meeting-notes-02.png',width:1261,height:909,alt:'딥티크 팀 프로젝트 회의록 모음: 화면 구성과 구현에 관한 팀 논의 기록'},
].map(({width,height,alt,...material})=>({...material,originalImage:{src:material.image,width,height,alt}}));
const meetingNotes = {...meetingPages[0],id:'meeting',label:'회의록',pages:meetingPages};
const surveyPages = [
 {id:'survey-01',label:'설문 문항과 응답',image:'/assets/work/ux/planning/survey-01.png',width:563,height:480,alt:'온라인 향수 탐색 시 확인하는 정보에 관한 설문 응답'},
 {id:'survey-02',label:'설문 결과 분석',image:'/assets/work/ux/planning/survey-02.png',width:681,height:800,alt:'향수 탐색 정보, 공식 사이트 방문 빈도와 중요 요소에 관한 설문 결과 그래프'},
 {id:'survey-03',label:'개선 의견과 인사이트',image:'/assets/work/ux/planning/survey-03.png',width:858,height:867,alt:'딥티크 온라인 경험의 개선점과 브랜드 이미지에 관한 응답자 의견'},
].map(({width,height,alt,...material})=>({...material,originalImage:{src:material.image,width,height,alt}}));
const survey = {...surveyPages[0],id:'survey',label:'설문',pages:surveyPages};
export const uxSteps = [
 {id:'research',title:'시장과 브랜드 조사',english:'Brand & market research',description:'브랜드와 경쟁사의 화면 구성, 콘텐츠, 탐색 구조를 비교하는 단계입니다.',documents:[brandAudit,competitorResearch,steepAnalysis,threeCAnalysis]},
 {id:'interview',title:'사용자 조사와 분석',english:'Listening to users',description:'설문과 인터뷰를 통해 사용자가 딥티크 온라인 사이트에서 제품과 향을 탐색하는 과정을 살펴봤습니다. 정보 탐색의 불편함과 브랜드 경험에 대한 기대를 분석하고, 이를 바탕으로 주요 개선 방향을 정리했습니다.',documents:[survey,{id:'interview',label:'인터뷰',image:'/assets/work/ux/planning/interview.png',originalImage:{src:'/assets/work/ux/planning/interview.png',width:1890,height:1710,alt:'딥티크 웹사이트 리뉴얼을 위한 사용자 인터뷰 질문과 응답'}}]},
 {id:'define',title:'문제 정의와 기획',english:'Defining the direction',description:'핵심 사용자와 탐색 흐름을 정리하고, 문제·가치·해결 방향을 연결하는 단계입니다.',documents:[personas[1],journeyMaps[1],leanCanvas]},
 {id:'structure',title:'팀 논의와 구조 설계',english:'Planning together',description:'팀의 논의를 바탕으로 정보 구조와 사용자 흐름, 화면별 요구사항을 정리하는 단계입니다.',documents:[userFlow,menuTree,iaStructure,meetingNotes]},
 {id:'visual',title:'디자인 방향 설정',english:'Shaping the visual language',description:'이미지·컬러·타이포그래피와 여백의 기준을 모아 공통 디자인 방향을 정리하는 단계입니다.',documents:[moodboard,designMindmap]},
 {id:'screens',title:'화면 설계와 구체화',english:'From structure to screens',description:'와이어프레임에서 정보의 우선순위를 정하고, 공통 스타일과 화면 구성을 구체화하는 단계입니다.',documents:[wireframe,designSystem,components,presentation]},
];
