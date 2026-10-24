export default function initDetailSummaries(root) {
 const mobile = matchMedia('(max-width:700px)');
 const generated = [];
 root.querySelectorAll('.team-story-copy').forEach(copy => {
  const paragraphs = [...copy.querySelectorAll(':scope > .team-story-description')].slice(1);
  if (!paragraphs.length) return;
  const detail = document.createElement('details');
  detail.className = 'team-detail-expand team-story-expand';
  const summary = document.createElement('summary');
  summary.textContent = '작업 과정 자세히';
  paragraphs[0].before(detail);
  detail.append(summary, ...paragraphs);
  generated.push({detail,paragraphs});
 });
 const update = () => root.querySelectorAll('.team-detail-expand').forEach(detail => {detail.open = !mobile.matches;});
 mobile.addEventListener('change',update);
 update();
 return () => {
  mobile.removeEventListener('change',update);
  generated.forEach(({detail,paragraphs}) => detail.replaceWith(...paragraphs));
 };
}
