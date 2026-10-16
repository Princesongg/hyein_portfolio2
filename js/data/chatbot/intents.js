import {answers} from './answers.js';
export const suggestions=['intro','experience','motivation','team','role','personal','video','skills','contact'];
export const projects=[
 {id:'peripera',name:'PERIPERA',keys:['페리페라','peripera'],target:'personal-02',url:'https://periperaproject.vercel.app/',description:'핑크·블루 컬러와 콜라주 그래픽으로 키치한 분위기를 표현한 코스메틱 랜딩페이지입니다.'},
 {id:'taeyang',name:'TAEYANG — QUINTESSENCE',keys:['태양','taeyang','quintessence'],target:'personal-03',url:'https://taeyang-album-project.vercel.app/',description:'대형 타이포그래피와 앨범·영상 콘텐츠를 활용한 앨범 프로모션 랜딩페이지입니다.'},
 {id:'onitsuka',name:'ONITSUKA TIGER',keys:['오니츠카','onitsuka'],target:'personal-04',url:'https://onitsukaproject.vercel.app/',description:'블랙·옐로 컬러를 활용한 패션 브랜드 메인 페이지입니다.'},
 {id:'yangji',name:'H+ YANGJI HOSPITAL',keys:['양지','yangji'],target:'personal-05',url:'https://jhi-yangji-hospitalproject.vercel.app/',description:'의료 정보의 가독성과 정보 흐름에 중점을 둔 병원 메인 페이지입니다.'},
 {id:'uniqlo',name:'UNIQLO',keys:['유니클로','uniqlo'],target:'personal-06',url:'https://uniqloproject.vercel.app/',description:'브랜드의 심플하고 실용적인 이미지를 표현한 패션 브랜드 메인 페이지입니다.'},
];
export const links={
 intro:[['ABOUT ME 보기','#about']],experience:[['ABOUT ME 보기','#about']],motivation:[['ABOUT ME 보기','#about']],
 team:[['DIPTYQUE 프로젝트 자세히 보기','#work-team'],['완성 웹사이트 보기','https://mbc-teamproject-alpha.vercel.app/']],
 role:[['DIPTYQUE 담당 역할 보기','#team-what-i-do']],personal:[['PERSONAL PROJECTS 보기','#work-personal']],
 video:[['SHORT-FORM CONTENTS 보기','#work-video']],skills:[['SKILL 보기','#skill']],contact:[['CONTACT 보기','#contact']],archive:[['ARCHIVE 보기','#archive']],
 fallback:[['WORK 보기','#work'],['ABOUT 보기','#about'],['CONTACT 보기','#contact']],
};
export const fallback='아직 그 질문에 대한 답변은 준비되어 있지 않아요. 💌 아래 추천 질문을 선택하거나 WORK, ABOUT, CONTACT 메뉴를 확인해 주세요.';
export const normalize=text=>text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const keywordGroups={
 role:['담당 역할','담당한 역할','어떤 역할','기여','팀장','메인 디자이너','galerie','디자인 총괄','코드 수정','담당 업무'],
 archive:['아카이브','archive','공모전','수상','텍스타일','lively summer','예전에 어떤 작업'],
 experience:['이전 경험','올리브영','일본','abc-mart','서비스 경험','경력','통번역','유학','근무','simtos','심토스'],
 motivation:['전공','디자인 시작','직무 전환','디자인 계기','uiux 시작','시작한 이유','시작 계기'],
 contact:['연락','채용','이메일','github','깃허브','이력서','contact','전화'],
 team:['딥티크','diptyque','팀 프로젝트','팀플'],
 personal:['개인 프로젝트','개인 작업'],
 video:['영상','숏폼','쇼츠','모션','short-form','capcut','프리미어'],
 skills:['스킬','사용 기술','프로그램','코딩','figma','피그마','html','css','javascript','codex','코덱스','react','리액트','포토샵','일러스트','도구'],
 intro:['자기소개','누구','어떤 디자이너','혜인 소개'],
};
export function matchIntent(input){
 const text=normalize(input);
 const has=words=>words.some(word=>text.includes(normalize(word)));
 // Personal work must not override employment or service experience.
 if(has(['이전 경험','일본','근무','통번역','서비스 경험','일했','무슨 일을','경력','올리브영','abc-mart','simtos','심토스'])) return 'experience';
 if(has(keywordGroups.role)) return 'role';
 if(has(['react','리액트'])) return 'skills';
 const project=projects.find(item=>has(item.keys));
 if(project) return project.id;
 for(const [id,keywords] of Object.entries(keywordGroups)) if(has(keywords)) return id;
 return 'fallback';
}
export function getReply(id){
 const project=projects.find(item=>item.id===id);
 if(project) return {answer:`${project.name}\n\n${project.description}`,links:[['프로젝트 자세히 보기',`#${project.target}`],['완성 웹사이트 보기',project.url]]};
 return {answer:answers[id]?.answer||fallback,links:links[id]||links.fallback};
}
