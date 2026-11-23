/* CakeCanvas.co shared data, pricing and cake drawing. Used by the site (index.html) and the owner dashboard (studio.html). */
/* ---------- data ---------- */
const PAINTS=[
 {id:"blush",name:"Blush",c:"#F3C9D1"},{id:"ivory",name:"Ivory",c:"#F7F1E6"},{id:"butter",name:"Butter",c:"#F3E3B3"},
 {id:"sage",name:"Sage",c:"#C9D6BE"},{id:"sky",name:"Powder blue",c:"#C8D9E8"},{id:"lilac",name:"Lilac",c:"#DCCFE6"},
 {id:"cocoa",name:"Cocoa",c:"#6B4636"}];
const OPT={
 occasion:[["birthday","Birthday"],["wedding","Wedding"],["baby","Baby shower"],["anniv","Anniversary"],["justbc","Just because"]],
 shape:[["round","Round"],["heart","Heart"],["square","Square"]],
 tiers:[[1,"One"],[2,"Two"],[3,"Three"]],
 size:[[6,"6 in"],[8,"8 in"],[10,"10 in"]],
 finish:[["smooth","Smooth"],["ruffles","Ruffles"],["vintage","Vintage piping"],["knife","Palette knife"]],
 decor:[["flowers","Fresh flowers"],["cherries","Cherries"],["gold","Gold leaf"],["bows","Bows"]],
 slot:[["10","10 to 11 am"],["13","1 to 2 pm"],["16","4 to 5 pm"]],
 handoff:[["pickup","Pickup"],["delivery","Delivery, +$20"]]
};
const FLAVOURS=["Vanilla bean","Chocolate fudge","Red velvet","Lemon","Ube","Earl grey"];
const FILLINGS=["Strawberry","Raspberry","Salted caramel","Cream cheese","Lemon curd","Oreo crumble"];
const SIZEP={4:40,6:65,8:95,10:140}, SERVES={4:6,6:12,8:24,10:38};
const FINP={smooth:0,ruffles:20,vintage:30,knife:25}, DECP={flowers:25,cherries:12,gold:18,bows:10};
const SHAPEP={round:0,heart:15,square:10}, EXTRA={delivery:20};
const WEEK={perDay:4,closed:[1]};   // default cakes per day, closed weekdays (0 Sun ... 6 Sat)

let cfg={occasion:"birthday",shape:"round",tiers:2,size:8,flavour:"Vanilla bean",filling:"Strawberry",finish:"ruffles",paint:"blush",decor:["flowers"],msg:"",slot:"13",handoff:"pickup",date:null};

/* ---------- storage (best effort) ---------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* owner edits from the dashboard (studio.html) override the defaults above */
(function(){const p=store.get("cc_prices",null);if(p){Object.assign(SIZEP,p.size||{});Object.assign(FINP,p.finish||{});Object.assign(DECP,p.decor||{});Object.assign(SHAPEP,p.shape||{});Object.assign(EXTRA,p.extra||{})}
  const w=store.get("cc_week",null);if(w)Object.assign(WEEK,w);
  OPT.handoff[1][1]="Delivery, +$"+EXTRA.delivery})();
const today=new Date();today.setHours(0,0,0,0);
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const key=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const fmt=d=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const money=n=>"$"+n.toLocaleString("en-US");

function seedOrders(){
  const mk=(code,name,dd,status,c)=>({code,name,contact:(+code.slice(-1))%2?"(916) 555-01"+code.slice(-2):name.split(" ")[0].toLowerCase()+"@mail.com",date:key(addDays(today,dd)),created:key(addDays(today,dd-9)),status,cfg:Object.assign({},cfg,c,{decor:c.decor||[]}),notes:""});
  const o=[
   mk("CC-0136","Priya S.",-2,"Collected",{tiers:1,size:6,shape:"heart",paint:"blush",finish:"vintage",decor:["cherries"],msg:"Love you Mom"}),
   mk("CC-0137","Daniel R.",-1,"Collected",{tiers:2,size:8,paint:"cocoa",finish:"smooth",decor:["gold"],flavour:"Chocolate fudge"}),
   mk("CC-0138","Alyssa M.",1,"Ready",{tiers:1,size:8,paint:"sage",finish:"knife",decor:["flowers"],flavour:"Lemon",filling:"Raspberry"}),
   mk("CC-0139","Jordan T.",2,"Baking",{tiers:3,size:10,paint:"ivory",finish:"ruffles",decor:["flowers"],occasion:"wedding",msg:"Jordan & Priya",flavour:"Vanilla bean",filling:"Cream cheese"}),
   mk("CC-0141","Mara L.",3,"Baking",{tiers:2,size:8,paint:"lilac",finish:"vintage",decor:["bows"],msg:"Happy 30th Mara",flavour:"Ube",filling:"Salted caramel"}),
   mk("CC-0142","Kenji W.",6,"Confirmed",{tiers:1,size:6,paint:"sky",finish:"smooth",decor:["bows"],occasion:"baby",msg:"Oh baby",flavour:"Red velvet",filling:"Cream cheese"}),
   mk("CC-0144","Sofia G.",9,"Request",{tiers:2,size:6,shape:"square",paint:"butter",finish:"knife",decor:["flowers","gold"],flavour:"Earl grey",filling:"Lemon curd"})];
  /* a few months of past pickups so the money chart has history */
  const names=["Harleen K.","Ava P.","Noor S.","Ethan B.","Simran D.","Lucia R.","Maya T.","Gurpreet S.","Chloe W.","Arjun M.","Zara H.","Ben L.","Isha G.","Olivia N.","Ravi P.","Emma C."];
  const looks=[{tiers:1,size:6,paint:"blush",finish:"vintage",decor:["cherries"]},{tiers:2,size:8,paint:"ivory",finish:"ruffles",decor:["flowers"]},{tiers:1,size:8,paint:"cocoa",finish:"smooth",decor:["gold"]},{tiers:1,size:6,shape:"heart",paint:"lilac",finish:"vintage",decor:["bows"]},{tiers:2,size:6,paint:"sage",finish:"knife",decor:["flowers"]},{tiers:3,size:10,paint:"ivory",finish:"smooth",decor:["flowers","gold"],occasion:"wedding"}];
  for(let w=10,n=100;w>=1;w--){const per=[2,3,1,3,2,4,2,3,3,4][w-1];for(let j=0;j<per;j++,n++){
    o.push(mk("CC-0"+n,names[(w*3+j)%names.length],-(w*7)+((j*2+w)%6)-1,"Collected",looks[(w+j*2)%(w%5===0?6:5)]))}}
  o.forEach(x=>{x.price=priceOf(x.cfg).total;x.slot=x.cfg.slot;x.paid=["Baking","Ready","Collected"].includes(x.status)});
  return o;
}
let orders=store.get("cc_orders",null)||seedOrders();
let cap=store.get("cc_cap",{});   // key -> {slots:n, closed:bool}
const save=()=>{store.set("cc_orders",orders);store.set("cc_cap",cap)};

function dayCap(d){const k=key(d);const c=cap[k];if(c)return c;return {slots:WEEK.perDay,closed:WEEK.closed.includes(d.getDay())}}
function booked(d){const k=key(d);let n=orders.filter(o=>o.date===k&&!["Collected","Declined"].includes(o.status)).length;
  const h=(d.getDate()*7+d.getMonth()*3)%5; if(d>addDays(today,3)) n+= (h===0?4:h===1?3:h===2?1:0); return n}
function openSlots(d){const c=dayCap(d);if(c.closed)return 0;return Math.max(0,c.slots-booked(d))}

/* ---------- price ---------- */
function tierSizes(c){const s=[];let cur=+c.size;for(let i=0;i<c.tiers;i++){s.push(Math.max(4,cur));cur-=2}return s}
function priceOf(c){
  const sizes=tierSizes(c);let total=sizes.reduce((a,s)=>a+SIZEP[s],0);
  total+=FINP[c.finish]||0; (c.decor||[]).forEach(d=>total+=DECP[d]||0);
  total+=SHAPEP[c.shape]||0; if(c.handoff==="delivery")total+=EXTRA.delivery;
  const serves=sizes.reduce((a,s)=>a+SERVES[s],0);
  return {total,serves,deposit:Math.round(total/2)};
}

/* ---------- cake drawing (SVG) ---------- */
function shade(hex,p){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;
  const f=p<0?0:255,t=Math.abs(p);r=Math.round((f-r)*t+r);g=Math.round((f-g)*t+g);b=Math.round((f-b)*t+b);
  return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function shapePts(shape,cx,cy,w,ry){const p=[];
  if(shape==="round"){for(let i=0;i<64;i++){const a=i/64*Math.PI*2;p.push([cx+w/2*Math.cos(a),cy+ry*Math.sin(a)])}}
  else if(shape==="square"){const q=[[cx-w/2,cy],[cx,cy-ry],[cx+w/2,cy],[cx,cy+ry]];
    for(let s=0;s<4;s++){const A=q[s],B=q[(s+1)%4];for(let i=0;i<16;i++){const t=i/16;p.push([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t])}}}
  else{for(let i=0;i<64;i++){const t=i/64*Math.PI*2;const x=16*Math.pow(Math.sin(t),3);const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    p.push([cx+x*(w/33),cy-(y+2)*(ry/14)])}}
  return p}
const pd=(pts,dy=0)=>"M"+pts.map(p=>p[0].toFixed(1)+","+(p[1]+dy).toFixed(1)).join("L")+"Z";
function rnd(seed){let s=seed;return()=>{s=(s*9301+49297)%233280;return s/233280}}

function drawCake(c,opts={}){
  const paint=(PAINTS.find(p=>p.id===c.paint)||PAINTS[0]).c;
  const side=shade(paint,-0.1), top=shade(paint,0.25), pipe=c.paint==="cocoa"?"#F7F1E6":shade(paint,-0.32);
  const sizes=tierSizes(c);const H=c.tiers===3?58:66;
  const R=rnd(c.tiers*31+sizes[0]*7+c.finish.length*13);
  let s=`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of the cake">`;
  const u="ck"+(drawCake.n=(drawCake.n||0)+1);
  s+=`<defs><filter id="${u}b" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${u}c" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
    <radialGradient id="${u}p" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#F8F4F2"/><stop offset="1" stop-color="#EAE3E0"/></radialGradient>
    <filter id="${u}g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 .16  0 0 0 0 .1  0 0 0 0 .13  .3 0 0 0 -.1" result="na"/>
      <feComposite in="na" in2="SourceAlpha" operator="in" result="gr"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gr"/></feMerge></filter>
    <linearGradient id="${u}st" x1="0" x2="1"><stop offset="0" stop-color="#DCD3CF"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F4EFED"/><stop offset="1" stop-color="#CFC5C1"/></linearGradient>
    <radialGradient id="${u}t" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="${shade(paint,0.45)}"/><stop offset=".65" stop-color="${top}"/><stop offset="1" stop-color="${shade(paint,0.1)}"/></radialGradient></defs>`;
  const w0=tierSizes(c)[0]*24;
  s+=`<ellipse cx="200" cy="384" rx="92" ry="9" fill="#2A1B22" opacity=".12" filter="url(#${u}c)"/>`;
  s+=`<ellipse cx="200" cy="381" rx="66" ry="10" fill="#D8CFCB"/><ellipse cx="200" cy="378" rx="66" ry="10" fill="url(#${u}st)" stroke="#000" stroke-opacity=".12"/>`;
  s+=`<path d="M178,349 C186,356 190,362 189,372 L211,372 C210,362 214,356 222,349 Z" fill="url(#${u}st)" stroke="#000" stroke-opacity=".12"/>`;
  s+=`<ellipse cx="200" cy="372" rx="16" ry="3.5" fill="url(#${u}st)" stroke="#000" stroke-opacity=".1"/>`;
  s+=`<g transform="translate(0,-26)">`;
  s+=`<ellipse cx="200" cy="357" rx="168" ry="21" fill="#2A1B22" opacity=".07" filter="url(#${u}c)"/>`;
  s+=`<ellipse cx="200" cy="355" rx="170" ry="22" fill="#E4DCD8"/>`;
  s+=`<ellipse cx="200" cy="352" rx="170" ry="22" fill="url(#${u}p)" stroke="#000" stroke-opacity=".16" stroke-width="1"/>`;
  s+=`<ellipse cx="200" cy="349" rx="150" ry="16" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1"/>`;
  s+=`<path d="M58,345 Q200,328 342,345" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".9"/>`;
  s+=`<ellipse cx="200" cy="348" rx="${w0*.56}" ry="${w0*.11}" fill="#2A1B22" opacity=".22" filter="url(#${u}b)"/>`;
  s+=`<ellipse cx="200" cy="352" rx="170" ry="22" fill="none" stroke="#C9A24A" stroke-width="1.2" opacity=".55"/>`;
  s+=`<g filter="url(#${u}g)">`;
  let base=344, topInfo=null;
  sizes.forEach((sz,i)=>{
    const w=sz*24+(sz===4?10:0), ry=w*.15, topY=base-H;
    const pts=shapePts(c.shape,200,0,w,ry);
    if(i>0)s+=`<ellipse cx="200" cy="${base+ry*.25}" rx="${w*.52}" ry="${ry*1.05}" fill="#2A1B22" opacity=".2" filter="url(#${u}c)"/>`;
    s+=`<defs><linearGradient id="${u}s${i}" gradientUnits="userSpaceOnUse" x1="${200-w/2}" x2="${200+w/2}" y1="0" y2="0">
      <stop offset="0" stop-color="${shade(paint,-0.3)}"/><stop offset=".16" stop-color="${shade(paint,-0.12)}"/><stop offset=".36" stop-color="${shade(paint,0.1)}"/>
      <stop offset=".55" stop-color="${side}"/><stop offset=".84" stop-color="${shade(paint,-0.17)}"/><stop offset="1" stop-color="${shade(paint,-0.34)}"/></linearGradient></defs>`;
    s+=`<path d="${pd(pts,base)}" fill="${shade(paint,-0.22)}" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`;
    for(let y=base-1;y>topY;y-=1.5) s+=`<path d="${pd(pts,y)}" fill="url(#${u}s${i})"/>`;
    s+=`<path d="${pd(pts,topY)}" fill="url(#${u}t)" stroke="#000" stroke-opacity=".16" stroke-width="1"/>`;
    const front=pts.filter(p=>p[1]>=0).sort((a,b)=>a[0]-b[0]);
    const back=pts.filter(p=>p[1]<0).sort((a,b)=>a[0]-b[0]);
    back.forEach((p,j)=>{if(j%2===0)s+=`<circle cx="${p[0]}" cy="${p[1]+topY+1}" r="2.3" fill="${shade(paint,0.3)}" stroke="${shade(paint,-0.2)}" stroke-width=".5"/>`});
    s+=`<path d="M${front.map(p=>p[0].toFixed(1)+","+(p[1]+topY+1.2).toFixed(1)).join("L")}" fill="none" stroke="${shade(paint,0.55)}" stroke-width="1.4" stroke-linecap="round" opacity=".75"/>`;
    // finishes
    if(c.finish==="ruffles"){for(let r=1;r<=5;r++){const yy=topY+r*H/6;
      s+=`<path d="M${front.map((p,j)=>p[0].toFixed(1)+","+(p[1]+yy+Math.sin(j*1.3)*2.2).toFixed(1)).join("L")}" fill="none" stroke="${top}" stroke-width="3.2" stroke-linecap="round"/>`;
      s+=`<path d="M${front.map((p,j)=>p[0].toFixed(1)+","+(p[1]+yy+2.6+Math.sin(j*1.3)*2.2).toFixed(1)).join("L")}" fill="none" stroke="${shade(paint,-0.2)}" stroke-width="1" stroke-opacity=".6"/>`}}
    if(c.finish==="vintage"){let d="";for(let j=0;j<front.length-4;j+=4){const a=front[j],b=front[j+4];
      d+=`M${a[0]},${a[1]+topY+6}Q${(a[0]+b[0])/2},${(a[1]+b[1])/2+topY+22} ${b[0]},${b[1]+topY+6}`}
      s+=`<path d="${d}" fill="none" stroke="${pipe}" stroke-width="2.4" stroke-linecap="round"/>`;
      front.forEach((p,j)=>{if(j%2===0)s+=`<circle cx="${p[0]}" cy="${p[1]+topY+3}" r="3.4" fill="${top}" stroke="${pipe}" stroke-width=".8"/><circle cx="${p[0]-1.1}" cy="${p[1]+topY+1.8}" r="1.2" fill="#FFFFFF" opacity=".75"/>`})}
    if(c.finish==="knife"){const cols=[top,"#FFFFFF",shade(paint,-0.25),"#F3E3B3"];
      for(let k=0;k<14;k++){const p=front[Math.floor(R()*front.length)];const y=p[1]+topY+8+R()*(H-14);const l=10+R()*18;
        s+=`<path d="M${p[0]-l/2},${y}l${l},${-2-R()*4}" stroke="${cols[k%4]}" stroke-width="${4+R()*4}" stroke-linecap="round" opacity=".85"/>`}}
    if(c.finish!=="vintage")front.forEach((p,j)=>{if(j%2===1)s+=`<circle cx="${p[0]}" cy="${p[1]+topY+1.5}" r="2.6" fill="${top}" stroke="${shade(paint,-0.25)}" stroke-width=".6"/><circle cx="${p[0]-.8}" cy="${p[1]+topY+.6}" r="1" fill="#FFFFFF" opacity=".75"/>`});
    // bead border at base
    front.forEach((p,j)=>{if(j%2===0){const br=c.finish==="smooth"?3.6:2.8;s+=`<circle cx="${p[0]}" cy="${p[1]+base-3}" r="${br}" fill="${top}" stroke="${shade(paint,-0.25)}" stroke-width=".7"/><circle cx="${p[0]-br*.32}" cy="${p[1]+base-3-br*.35}" r="${br*.38}" fill="#FFFFFF" opacity=".7"/>`}});
    if(c.decor.includes("gold")){for(let k=0;k<5;k++){const p=front[Math.floor(R()*front.length)];const x=p[0],y=p[1]+topY+12+R()*(H-24);
      s+=`<path d="M${x},${y}l${5+R()*5},${-3}l${3},${6+R()*4}l${-7},${3}z" fill="#C9A24A" opacity=".95"/>`}}
    if(c.decor.includes("bows")){const x=200,y=ry+topY+H*.5;
      s+=`<g fill="${pipe}"><path d="M${x},${y}c-10,-10 -18,-6 -16,0c2,6 10,5 16,0z"/><path d="M${x},${y}c10,-10 18,-6 16,0c-2,6 -10,5 -16,0z"/><path d="M${x-2},${y}l-6,14l4,-1l4,-9zM${x+2},${y}l6,14l-4,-1l-4,-9z"/><circle cx="${x}" cy="${y}" r="3"/></g>`}
    topInfo={w,ry,topY};base=topY;
  });
  const t=topInfo;
  if(c.msg){const fs=Math.min(22,t.w/Math.max(6,c.msg.length)*1.6);
    s+=`<text x="200" y="${(t.topY+4)/0.5}" transform="scale(1,0.5)" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="${fs}" fill="${pipe}">${esc(c.msg)}</text>`}
  if(c.decor.includes("flowers")){const fl=[[-0.28,-0.3,13,"#E8A3B4"],[-0.12,-0.55,10,"#F7F1E6"],[-0.36,0.05,9,"#F3E3B3"],[0.3,-0.4,8,"#E8A3B4"]];
    fl.forEach(([fx,fy,r,col])=>{const x=200+fx*t.w,y=t.topY+fy*t.ry;
      s+=`<ellipse cx="${x+r*.9}" cy="${y+r*.3}" rx="${r*.8}" ry="${r*.35}" fill="#8FA57F" transform="rotate(-20 ${x} ${y})"/>`;
      s+=`<ellipse cx="${x+1.5}" cy="${y+r*.45}" rx="${r*1.05}" ry="${r*.5}" fill="#2A1B22" opacity=".14" filter="url(#${u}c)"/>`;
      for(let k=0;k<6;k++){const a=k/6*Math.PI*2;s+=`<circle cx="${x+Math.cos(a)*r*.55}" cy="${y+Math.sin(a)*r*.4}" r="${r*.5}" fill="${Math.sin(a)>0?shade(col,-0.08):col}" stroke="#000" stroke-opacity=".12" stroke-width=".6"/>`}
      for(let k=0;k<6;k++){const a=k/6*Math.PI*2+.3;s+=`<circle cx="${x+Math.cos(a)*r*.3}" cy="${y+Math.sin(a)*r*.22-1}" r="${r*.28}" fill="${shade(col,0.25)}" opacity=".9"/>`}
      s+=`<circle cx="${x}" cy="${y}" r="${r*.26}" fill="${shade(col,-0.35)}"/><circle cx="${x-r*.08}" cy="${y-r*.08}" r="${r*.09}" fill="#F3E3B3"/>`})}
  if(c.decor.includes("cherries")){[-0.32,-0.1,0.14,0.34].forEach((fx,k)=>{const x=200+fx*t.w,y=t.topY-t.ry*.55+Math.abs(fx)*t.ry*.6;
      s+=`<ellipse cx="${x+2}" cy="${y+6}" rx="8" ry="3" fill="#2A1B22" opacity=".22" filter="url(#${u}c)"/><path d="M${x},${y-6}q4,-14 10,-18" stroke="#3E5B2E" stroke-width="1.4" fill="none"/><circle cx="${x}" cy="${y}" r="7" fill="#9E1B32"/><circle cx="${x+1.2}" cy="${y+1.4}" r="5.4" fill="#7A1226" opacity=".55"/><circle cx="${x-2.4}" cy="${y-2.4}" r="1.9" fill="#FFFFFF" opacity=".75"/>`})}
  return s+"</g></g></svg>";
}
function esc(t){return String(t).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}

/* ---------- placard text ---------- */
const lab=(k,v)=>(OPT[k].find(o=>String(o[0])===String(v))||[,v])[1];
function placardHTML(c,title){
  const p=priceOf(c),sizes=tierSizes(c),paint=PAINTS.find(x=>x.id===c.paint).name;
  const tiers=c.tiers===1?"single tier":(c.tiers===2?"two tiers":"three tiers");
  const dec=c.decor.length?", "+c.decor.map(d=>lab("decor",d).toLowerCase()).join(", "):"";
  return `<b>${esc(title)}</b>${esc(c.flavour)} sponge, ${esc(c.filling.toLowerCase())} filling, ${lab("finish",c.finish).toLowerCase()} buttercream in ${paint.toLowerCase()}${dec}. ${sizes[0]} in ${lab("shape",c.shape).toLowerCase()}, ${tiers}. Serves about ${p.serves}.`;
}
function autoTitle(c){const paint=PAINTS.find(x=>x.id===c.paint).name;
  const f={smooth:"Quiet Study",ruffles:"Study in Ruffles",vintage:"Lambeth Revival",knife:"Palette Knife Sketch"}[c.finish];
  return `${f}, ${paint}`}

