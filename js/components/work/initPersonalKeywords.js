import {personalProjectKeywords} from '../../data/personalProjectKeywords.js';

// All personal previews share one layout and tag renderer; only the data varies.
export default function initPersonalKeywords(root) {
 for(const [id,keywords] of Object.entries(personalProjectKeywords)) {
  const panel=root.querySelector(`#${id}`);
  const visual=panel?.querySelector('.personal-projects-visual');
  if(!visual)continue;
  panel.dataset.keywords='';
  if(!visual.parentElement.classList.contains('personal-visual-column')) {
   const column=document.createElement('div');
   column.className='personal-visual-column';
   visual.before(column);
   column.append(visual);
  }
  const section=document.createElement('section');
  section.className='personal-keywords';
  const heading=document.createElement('h3');
  heading.id=`${id}-keywords-title`;
  heading.textContent='KEYWORDS';
  section.setAttribute('aria-labelledby',heading.id);
  const list=document.createElement('ul');
  for(const keyword of keywords) {
   const tag=document.createElement('li');tag.textContent=keyword;list.append(tag);
  }
  section.append(heading,list);
  const existing=visual.querySelector('.personal-keywords');
  if(existing)existing.replaceWith(section);else visual.append(section);
 }
}
