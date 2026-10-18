// The shared 3D coordinate system follows Codrops' tilted-parent/depth-stack approach:
// https://github.com/codrops/3DStackMotion/blob/main/js/effect-1/stackMotionEffect.js
// Positions and motion below are bounded for the portfolio's text/photo split.
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
const out=value=>1-(1-clamp(value))**3;
const mix=(a,b,t)=>a+(b-a)*t;

export function createFanLayout(width,height,count) {
 const mobile=width<=700;
 const left=width*(mobile?.05:.38),top=height*(mobile?.33:.28);
 const areaWidth=width*(mobile?.90:.58),areaHeight=height*(mobile?.49:.56);
 const cardWidth=mobile?Math.min(112,width*.285,height*.18):Math.min(210,Math.max(160,width*.135),height*.27);
 const step=Math.min(cardWidth*(mobile?.27:.31),(areaWidth-cardWidth*(mobile?1.15:.8))/Math.max(1,count-1));
 const span=step*(count-1),cx=areaWidth*.50,cy=areaHeight*.43;
 const depth=mobile?.5:width<=1024?.8:1;
 const bases=Array.from({length:count},(_,index)=>{
  const t=index/Math.max(1,count-1);
  return {x:cx+(t-.5)*span,y:cy+areaHeight*(.20*(t*t)-.07),
   z:Math.tan((mobile?24:35)*Math.PI/180)*(t-.5)*span+mix(20,-20,t)*depth,ry:mix(-7,13,t)*depth,rz:mix(-3,3,t),scale:1,opacity:1};
 });
 return {width,height,count,mobile,cardWidth,depth,cx,cy,area:{left,top,width:areaWidth,height:areaHeight},bases};
}

export function fanState(layout,progress) {
 const p=clamp(progress),{count,mobile,depth,bases,cx,cy,area}=layout;
 // A stationary parent prevents tiny perspective shifts throughout the viewing hold.
 const group={rx:mobile?-10:-18,ry:mobile?24:35,rz:mobile?12:14,x:0,y:0,z:0};
 // Every photo gets the same arrival, viewing hold and curved departure interval.
 const focusStart=.13,focusEnd=.97;
 const step=(focusEnd-focusStart)/count;
 const activeIndex=p>=focusStart&&p<focusEnd?Math.min(count-1,Math.floor((p-focusStart)/step)):-1;
 const spread=out(p/.15);
 const cards=bases.map((base,index)=>{
  const local=(p-focusStart-index*step)/step;
  const arrival=smooth(local/.25);
  const exit=smooth((local-.70)/.30);
  const emphasis=arrival;
  const entrance=index===0?out((p-.105)/.04):out((p-(index-1)*.007)/.07);
  const backgroundScale=mix(.88,.76,index/Math.max(1,count-1));
  return {
   x:mix(cx+(base.x-cx)*mix(.28,1,spread),cx-area.width*.10,emphasis)+area.width*.14*(exit*.4+exit*exit*.6),
   y:cy+(base.y-cy)*mix(.35,1,spread)-emphasis*8+area.height*(.04*exit+.18*exit*exit),
   z:mix(base.z*mix(.3,1,spread)-90*depth,190*depth,emphasis)-exit*160*depth,
   // Counter the parent tilt so the hero reads as a forward-facing polaroid.
   ry:mix(base.ry,-group.ry+4,emphasis),rz:mix(base.rz,-group.rz-3,emphasis),
   scale:mix(backgroundScale,mobile?1.14:1.23,emphasis)-exit*.08,
   opacity:entrance*(1-exit),
  };
 });
 return {cards,group,activeIndex,titleOpacity:out(p/.045)*(1-smooth((p-.91)/.09)),
  titleScale:1,hintOpacity:1-smooth(p/.15)};
}
