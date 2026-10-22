/* Leftly – app logic
   Plain JavaScript, no frameworks. Data is saved in the browser (localStorage).
   Scanning, prices and stores are simulated for the prototype. */
(function(){
const DAY=864e5, today=new Date(); today.setHours(0,0,0,0);
const iso=d=>{const t=new Date(today.getTime()+d*DAY);return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")};
const days=s=>Math.round((new Date(s+"T00:00:00")-today)/DAY);
const nok=n=>n.toLocaleString("en-GB",{maximumFractionDigits:0});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const $=id=>document.getElementById(id);
const fmtDate=s=>new Date(s+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"});

const EMO={spinach:"🥬",chicken:"🍗",banana:"🍌",milk:"🥛","sour cream":"🥣",bread:"🍞",tomato:"🍅",yogurt:"🍶",pepper:"🫑",egg:"🥚",norvegia:"🧀",cheese:"🧀",mince:"🥩",pasta:"🍝",rice:"🍚",onion:"🧅",apple:"🍎",carrot:"🥕",salmon:"🐟",fish:"🐟",potato:"🥔",butter:"🧈",tortilla:"🫓",coffee:"☕",cucumber:"🥒",juice:"🧃",ham:"🥓",lettuce:"🥗",salad:"🥗",broccoli:"🥦"};
const emo=n=>{n=n.toLowerCase();for(const k in EMO)if(n.includes(k))return EMO[k];return"🍽️"};
const plate=(e,cls="")=>`<div class="plate ${cls}"><span>${e}</span></div>`;
const PEOPLE={Nora:"#1F5A3D",Sara:"#8A4F7D",Jonas:"#3E6FA8"};
const ICON={
 back:'<path d="M15 5l-7 7 7 7"/>',menu:'<path d="M4 7h16M4 12h10M4 17h16"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
 filter:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',chev:'<path d="M9 5l7 7-7 7"/>',bell:'<path d="M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',cart:'<path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',fridge:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M5 10h14M9 6v2M9 13v3"/>',
 pot:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h20M9 7c0-2 1.5-2 1.5-4M14 7c0-2 1.5-2 1.5-4"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/>',out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.5-5 6.5-5s5.7 1.5 6.5 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.5 5"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 ticket:'<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h3M21 18v3h-3"/>',
 camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 nav:'<path d="M12 2l7 19-7-4-7 4z"/>',chevl:'<path d="M15 5l-7 7 7 7"/>',
 tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
 snow:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',scan:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 12h10"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>'};
const ic=(n,sw=2)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`;
const navTop=(title,right="")=>`<div class="nav-top">${hist.length?`<button class="icon-btn" data-back aria-label="Back">${ic("back",2.4)}</button>`:"<span></span>"}<h2>${title}</h2>${right||"<span></span>"}</div>`;

/* ---------- data ---------- */
function seed(){
  const it=(navn,plass,d,type,pris,kg,av,ant=1)=>({id:Math.random().toString(36).slice(2),navn,plass,dato:iso(d),type,pris,kg,av,ant});
  const log=[];[[210,40],[180,95],[260,30],[240,60],[300,20],[150,0]].forEach(([s,k],i)=>{const d=-(5-i)*7-1;log.push({dato:iso(d),kr:s,kg:+(s/90).toFixed(1),ut:"brukt"});if(k)log.push({dato:iso(d),kr:k,kg:+(k/90).toFixed(1),ut:"kastet"})});
  return{items:[
    it("Spinach","Fridge",-1,"best",29,.2,"Sara"),it("Chicken fillet","Fridge",0,"siste",89,.6,"Nora"),it("Bananas","Pantry",1,"best",25,.8,"Jonas",5),
    it("Milk","Fridge",2,"best",22,1,"Nora"),it("Sour cream","Fridge",3,"best",24,.3,"Sara"),it("Wholegrain bread","Pantry",2,"best",39,.75,"Nora"),
    it("Tomatoes","Fridge",4,"best",32,.5,"Jonas",4),it("Yogurt","Fridge",6,"best",19,.5,"Sara",2),it("Bell peppers","Fridge",7,"best",18,.2,"Nora",2),
    it("Eggs","Fridge",12,"best",45,.7,"Nora",12),it("Norvegia cheese","Fridge",24,"best",99,.5,"Jonas"),it("Minced beef","Freezer",60,"siste",55,.4,"Nora"),
    it("Pasta","Pantry",280,"best",20,.5,"Sara"),it("Rice","Pantry",400,"best",35,1,"Jonas")],
   shop:[{t:"Tortillas",done:false,av:"Sara"},{t:"Onions",done:false,av:"Nora"},{t:"Milk",done:false,av:"Jonas"},{t:"Coffee",done:true,av:"Jonas"}],log};
}
const KEY="leftly-v1";let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.items)S=seed();
S.settings=Object.assign({dager:2,tid:"08:00",push:true,ukentlig:true,deling:true,tilbud:true},S.settings||{});
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const st=d=>d<=0?"bad":d<=3?"warn":"ok";
const label=d=>d<-1?`Expired ${-d} d ago`:d===-1?"Expired yesterday":d===0?"Today":d===1?"Tomorrow":d>60?`${Math.round(d/30)} mo`:`${d} days`;
const stText={bad:"Eat today",warn:"Expiring soon",ok:"Still fresh"};
const sorted=()=>[...S.items].sort((a,b)=>a.dato.localeCompare(b.dato));
const pill=d=>`<span class="pill p-${st(d)}">${label(d)}</span>`;
const dots=d=>`<div class="dots ${st(d)}"><i></i><i></i><i></i></div>`;

/* ---------- navigation ---------- */
const TABS=[["home","Home","home"],["varer","Fridge","fridge"],["scan","Scan","scan"],["shop","Shopping list","list"],["profile","Profile","user"]];
const NAVV=["home","varer","recipes","shop","stats","tilbud","profile"];
$("tabs").innerHTML=TABS.map(([k,n,i])=>k==="scan"?`<button class="tab scan-tab" data-scan="fridge" aria-label="Scan the fridge"><span class="sd">${ic("scan",2.4)}</span>${n}</button>`:`<button class="tab" data-tab="${k}" aria-selected="false" aria-label="${n}">${ic(i)}${n}</button>`).join("");
let cur="splash",hist=[],ctx={item:null,recipe:null,place:"All",status:"All",q:""};
function show(v,push=true){
  if(push&&cur!==v)hist.push(cur);
  cur=v;document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=="v-"+v);
  const isTab=NAVV.includes(v);$("tabs").hidden=!isTab;
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===v));
  if(isTab)hist=hist.filter(h=>!["splash","welcome","login","register"].includes(h));
  close();R[v]&&R[v]();$("v-"+v).scrollTop=0;
}
function back(){const p=hist.pop();if(p)show(p,false)}
document.addEventListener("click",e=>{
  const t=e.target;
  const g=t.closest("[data-go]");if(g){show(g.dataset.go);return}
  const tb=t.closest("[data-tab]");if(tb){hist=[];show(tb.dataset.tab,false);return}
  if(t.closest("[data-back]")){back();return}
  const rf=t.closest("[data-recfor]");if(rf){ctx.recFor=rf.dataset.recfor;show("recipes");return}
  const it=t.closest("[data-item]");if(it){ctx.item=it.dataset.item;show("detail");return}
  const rc=t.closest("[data-recipe]");if(rc){ctx.recipe=+rc.dataset.recipe;show("recipe");return}
  const ts=t.closest("[data-toast]");if(ts){toast(ts.dataset.toast);return}
  const ss=t.closest("[data-scanshop]");if(ss){ctx.scanMode="barcode";ctx.scanTarget="shop";ctx.photo=null;show("scan");return}
  const sc=t.closest("[data-scan]");if(sc){ctx.scanMode=sc.dataset.scan;ctx.scanTarget=null;ctx.photo=null;show("scan");return}
  if(t.closest("[data-invite]")){invite();return}
  if(t.closest("[data-drawer]"))drawer();
  if(t.closest("[data-filter]"))filterSheet();
});

/* ---------- auth ---------- */
const COL=[["🍝",120,-20,30],["🥗",104,250,-10],["🍳",90,-24,200],["🍌",80,290,170],["🥬",70,170,40],["🍅",64,110,230],["🥞",96,215,250]];
$("collage").innerHTML=COL.map(([e,s,x,y])=>`<div class="plate" style="width:${s}px;height:${s}px;left:${x}px;top:${y}px"><span style="font-size:${s*.48}px">${e}</span></div>`).join("")+`<div class="badge logo"><b>Leftly</b></div>`;
$("v-splash").addEventListener("click",()=>show("welcome",false));
$("login-form").addEventListener("submit",e=>{e.preventDefault();hist=[];show("home",false);setTimeout(pushBanner,1300)});
$("reg-form").addEventListener("submit",e=>{e.preventDefault();if(!$("r-name").value.trim()||!$("r-mail").value.trim()){toast("Enter your name and email");return}if($("r-pass").value!==$("r-pass2").value){toast("The passwords don't match");return}if(!$("r-ok").checked){toast("You need to accept the terms");return}hist=[];show("home",false);toast("Account created");setTimeout(pushBanner,2200)});

/* ---------- renderers ---------- */
const R={};
const fcard=i=>{const d=days(i.dato);return`<button class="fcard" data-item="${i.id}">${plate(emo(i.navn))}<div class="nm">${esc(i.navn)}</div><div class="sb">${i.plass} · qty ${i.ant}</div>${dots(d)}<div style="margin-top:4px">${pill(d)}</div></button>`};

R.home=()=>{
  const soon=sorted().filter(i=>days(i.dato)<=3);
  const r=scored()[0];
  const month=S.log.filter(l=>l.ut==="brukt"&&days(l.dato)>-30).reduce((s,l)=>s+l.kr,0);
  const unread=alerts().length;
  $("v-home").innerHTML=`
   <div class="nav-top"><button class="icon-btn" data-drawer aria-label="Menu">${ic("menu",2.2)}</button><span></span>
    <button class="icon-btn" data-go="notif" aria-label="Notifications" style="position:relative">${ic("bell")}${unread?`<i style="position:absolute;top:7px;right:8px;width:8px;height:8px;border-radius:50%;background:var(--red)"></i>`:""}</button></div>
   <h1 class="hero">Keep track of<br><b>your food</b> at home</h1>
   <div class="searchrow"><label class="search">${ic("search")}<input id="h-q" placeholder="Search food at home" aria-label="Search"></label><button class="dia" data-filter aria-label="Filter">${ic("filter",2.4)}</button></div>
   <button class="scan-banner" data-scan="fridge"><span class="si">${ic("scan",2.2)}</span><span class="tx"><b>Scan your fridge</b>Take one photo and we'll find the items, the dates and what you can cook.</span><span class="dia sm">${ic("arrow",2.6)}</span></button>
   <div class="cats">${catChips()}</div>
   <div class="sec-head"><h3>Expiring soon</h3><button class="link" data-tab="varer">See all</button></div>
   <div class="hscroll">${soon.length?soon.map(fcard).join(""):'<div class="empty">Nothing expires in the next few days 🎉</div>'}</div>
   ${r?`<div class="sec-head"><h3>Cook tonight</h3><button class="link" data-tab="recipes">More</button></div>
   <button class="lcard" data-recipe="${RECIPES.indexOf(RECIPES.find(x=>x.navn===r.navn))}">${plate(r.e)}<div class="mid"><div class="nm">${r.navn}</div><div class="sb">${r.min} min · you have ${r.uses.length} of ${r.ing.length}</div><div class="small" style="color:var(--red);font-weight:500">Saves ${r.uses.filter(u=>u.d<=3).map(u=>u.navn.toLowerCase()).join(", ")||"leftovers"}</div></div><span class="dia sm">${ic("arrow",2.6)}</span></button>`:""}
   <div class="sec-head"><h3>This week's deals</h3><button class="link" data-go="tilbud">See all</button></div>
   <div class="hscroll">${topDeals().slice(0,5).map(d=>`<button class="dcard" data-go="tilbud">${plate(emo(d.navn))}<span class="off-pill">-${d.pct} %</span><div class="nm">${esc(d.navn)}</div>${storeBadge(d.butikk)}<div class="price" style="font-size:15px"><i>kr</i>${kr2(d.pris)}</div></button>`).join("")}</div>
   <button class="daytip" data-go="tips"><span class="te">${TIPS[today.getDate()%TIPS.length].e}</span><span><small>Tip of the day</small>${TIPS[today.getDate()%TIPS.length].t}</span></button>
   <button class="save-card" data-tab="stats"><div><span>Saved in the last 30 days</span><b>kr ${nok(month)}</b></div><span>See savings →</span></button>`;
  $("h-q").addEventListener("keydown",e=>{if(e.key==="Enter"){ctx.q=e.target.value;hist=[];show("varer",false)}});
  $("v-home").querySelectorAll("[data-place]").forEach(b=>b.onclick=()=>{ctx.place=b.dataset.place;hist=[];show("varer",false)});
};
function catChips(){const P=[["All","🧺"],["Fridge","🧊"],["Freezer","❄️"],["Pantry","🥫"]];return P.map(([p,e])=>`<button class="cat" data-place="${p}" aria-pressed="${p===ctx.place}"><span class="ce">${e}</span>${p}</button>`).join("")}

R.varer=()=>{
  const q=ctx.q.trim().toLowerCase();
  const list=sorted().filter(i=>(ctx.place==="All"||i.plass===ctx.place)&&(ctx.status==="All"||stText[st(days(i.dato))]===ctx.status)&&i.navn.toLowerCase().includes(q));
  $("v-varer").innerHTML=`
   <div class="nav-top"><button class="icon-btn" data-go="kalender" aria-label="Calendar">${ic("cal")}</button><h2>Food at home</h2><button class="icon-btn" data-go="add" aria-label="Add item" style="color:var(--red)">${ic("plus",2.6)}</button></div>
   <div class="searchrow"><label class="search">${ic("search")}<input id="v-q" placeholder="Search for an item" value="${esc(ctx.q)}" aria-label="Search"></label><button class="dia" data-filter aria-label="Filter">${ic("filter",2.4)}</button></div>
   <div class="cats">${catChips()}</div>
   <p class="found">Found<br><b>${list.length} items</b>${ctx.status!=="All"?` <span class="pill p-bad" style="vertical-align:middle">${ctx.status}</span>`:""}</p>
   ${list.length?`<div class="grid">${list.map(fcard).join("")}</div>`:`<div class="empty">No items here.<br><button class="add-link" data-go="add" style="margin-top:12px">+ Add item</button></div>`}`;
  const inp=$("v-q");inp.addEventListener("input",()=>{ctx.q=inp.value;const pos=inp.selectionStart;R.varer();const n=$("v-q");n.focus();n.setSelectionRange(pos,pos)});
  $("v-varer").querySelectorAll("[data-place]").forEach(b=>b.onclick=()=>{ctx.place=b.dataset.place;R.varer()});
};

function filterSheet(){
  let stv=ctx.status,pl=ctx.place;
  sheet(`<h2 class="red-title" style="font-size:18px">Filter</h2>
   <div style="font-weight:500">Status</div><div class="seg" id="f-st">${["All","Eat today","Expiring soon","Still fresh"].map(s=>`<button data-v="${s}" aria-pressed="${s===stv}">${s}</button>`).join("")}</div>
   <div style="font-weight:500">Location</div><div class="seg" id="f-pl">${["All","Fridge","Freezer","Pantry"].map(s=>`<button data-v="${s}" aria-pressed="${s===pl}">${s}</button>`).join("")}</div>
   <div class="acts" style="margin-top:6px"><button class="btn outline" id="f-clear">Reset</button><button class="btn" id="f-apply">Apply</button></div>`,el=>{
    segBind(el,"#f-st",v=>stv=v);segBind(el,"#f-pl",v=>pl=v);
    el.querySelector("#f-clear").onclick=()=>{ctx.status="All";ctx.place="All";ctx.q="";close();hist=[];show("varer",false)};
    el.querySelector("#f-apply").onclick=()=>{ctx.status=stv;ctx.place=pl;close();hist=[];show("varer",false)};
  });
}
function segBind(el,sel,set){el.querySelector(sel).addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(!b)return;set(b.dataset.v);el.querySelectorAll(sel+" button").forEach(x=>x.setAttribute("aria-pressed",x===b))})}

R.detail=()=>{
  const i=S.items.find(x=>x.id===ctx.item);if(!i){back();return}
  const d=days(i.dato);
  const tip=i.type==="best"?`<b>Best before:</b> Food is often still good after this date. Look, smell and taste before you throw it out.`:`<b>Use by:</b> Don't eat it after this date. Freeze it before the date if you won't finish it in time.`;
  $("v-detail").innerHTML=`
   <div class="d-top">${navTop("",`<button class="icon-btn" aria-label="Favourite" style="color:var(--red)" data-toast="Added to favourites">${ic("heart")}</button>`)}
    ${plate(emo(i.navn))}
    <div class="qty"><button class="dia sm" id="q-m" aria-label="Fewer">${ic("minus",3)}</button><span>${i.ant}</span><button class="dia sm" id="q-p" aria-label="More">${ic("plus",3)}</button></div></div>
   <div class="d-body">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div class="small muted">${i.plass}</div><div style="font-size:20px;font-weight:600">${esc(i.navn)}</div></div>${pill(d)}</div>
    <div class="tipbox">${tip}</div>
    <div class="d-row"><span>${ic("clock")}${i.type==="best"?"Best before":"Use by"} ${fmtDate(i.dato)}</span><span>${ic("user")}${i.av}</span></div>
    <div class="d-total"><div><small>Value</small><span class="price"><i>kr</i>${nok(i.pris*i.ant)}</span></div><button class="dia lg" id="d-shop" aria-label="Buy again">${ic("cart",2.2)}</button></div>
    <div class="acts"><button class="btn" id="d-used">Eaten</button><button class="btn outline" id="d-waste">Thrown out</button></div>
    <button class="btn soft" id="d-freeze">${i.plass==="Freezer"?"Thaw (2 days in the fridge)":"Freeze (+3 months shelf life)"}</button>
   </div>`;
  $("q-m").onclick=()=>{if(i.ant>1){i.ant--;save();R.detail()}};
  $("q-p").onclick=()=>{i.ant++;save();R.detail()};
  $("d-shop").onclick=()=>{S.shop.unshift({t:i.navn,done:false,av:"Nora"});save();toast(`${i.navn} added to the shopping list`)};
  $("d-used").onclick=()=>{use(i,"brukt");ctx.saved=i;show("success")};
  $("d-waste").onclick=()=>{use(i,"kastet");back();toast(`${i.navn} logged as thrown out`)};
  $("d-freeze").onclick=()=>{if(i.plass==="Freezer"){i.plass="Fridge";i.dato=iso(2)}else{i.plass="Freezer";i.dato=iso(Math.max(d,0)+90)}save();R.detail();toast(i.plass==="Freezer"?"Moved to the freezer":"Thawing in the fridge")};
};
function use(i,ut){S.items=S.items.filter(x=>x.id!==i.id);S.log.push({dato:iso(0),kr:i.pris*i.ant,kg:+(i.kg*Math.min(i.ant,3)).toFixed(1),ut});save()}

R.success=()=>{
  const i=ctx.saved||{navn:"Food",pris:0,ant:1};const m=iso(0).slice(0,7);
  const month=S.log.filter(l=>l.ut==="brukt"&&days(l.dato)>-30).reduce((s,l)=>s+l.kr,0);
  $("v-success").innerHTML=`${navTop("")}
   <div class="illu red">${plate(emo(i.navn))}<span class="ck">${ic("check",3)}</span></div>
   <div class="hr"></div>
   <p class="red-title">Well done!</p>
   <p class="center muted small" style="margin:-8px 10px 0">You ate the ${esc(i.navn.toLowerCase())} instead of throwing it out. That's kr ${nok(i.pris*i.ant)} saved.</p>
   <p class="center small" style="margin:0">Saved in the last 30 days: <b>kr ${nok(month)}</b></p>
   <button class="btn" data-tab="varer" style="margin-top:auto">Back to items</button>`;
};

/* recipes */
const RECIPES=[
 {navn:"Banana pancakes",min:15,ing:["banana","egg","milk"],e:"🥞"},
 {navn:"Chicken stir-fry with rice",min:25,ing:["chicken","pepper","rice"],e:"🥘"},
 {navn:"Pasta with spinach and tomato",min:20,ing:["pasta","spinach","tomato","sour cream"],e:"🍝"},
 {navn:"French toast",min:15,ing:["bread","egg","milk"],e:"🍞"},
 {navn:"Green smoothie",min:5,ing:["banana","yogurt","spinach"],e:"🥤"},
 {navn:"Tacos",min:30,ing:["mince","tortilla","sour cream","tomato","pepper","norvegia"],e:"🌮"},
 {navn:"Leftover omelette",min:10,ing:["egg","pepper","tomato","norvegia"],e:"🍳"},
 {navn:"Salmon with rice and cucumber salad",min:25,ing:["salmon","rice","cucumber"],e:"🐟"},
 {navn:"Broccoli and carrot stir-fry",min:20,ing:["broccoli","carrot","rice","chicken"],e:"🥦"},
 {navn:"Ham sandwich",min:5,ing:["bread","butter","ham","lettuce"],e:"🥪"}];
function scored(inv=S.items){
  return RECIPES.map((r,ix)=>{const uses=[],miss=[];let score=0;
    r.ing.forEach(k=>{const i=inv.find(x=>x.navn.toLowerCase().includes(k));if(i){const d=days(i.dato);uses.push({...i,d,k});score+=Math.max(0,8-d)}else miss.push(k)});
    return{...r,ix,uses,miss,score:score-miss.length*2}}).sort((a,b)=>b.score-a.score);
}
R.recipes=()=>{
  const f=ctx.recFor;let list=scored();
  if(f)list=list.filter(r=>r.uses.some(u=>u.navn===f));
  $("v-recipes").innerHTML=`${navTop("Recipes")}
   <p class="found">Use up<br><b>your leftovers</b></p><p class="muted small" style="margin:-10px 0 0">Sorted by what goes off first in your home.</p>
   ${f?`<button class="filter-chip" id="rf-clear">With ${esc(f.toLowerCase())} · ${list.length} ideas <span aria-hidden="true">✕</span></button>`:""}
   <div class="stack">${list.length?list.map(r=>`<button class="lcard" data-recipe="${r.ix}">${plate(r.e)}<div class="mid"><div class="nm">${r.navn}</div><div class="sb">${r.min} min · you have ${r.uses.length} of ${r.ing.length}</div>
    ${r.uses.some(u=>u.d<=3)?`<div class="small" style="color:var(--red);font-weight:500">Saves ${r.uses.filter(u=>u.d<=3).map(u=>u.navn.toLowerCase()).join(", ")}</div>`:`<div class="small muted">Missing ${r.miss.length}</div>`}</div><span class="dia sm">${ic("arrow",2.6)}</span></button>`).join(""):'<div class="empty">No recipes use this item yet.</div>'}</div>`;
  $("rf-clear")&&($("rf-clear").onclick=()=>{ctx.recFor=null;R.recipes()});
};
R.recipe=()=>{
  const r=scored().find(x=>x.ix===ctx.recipe);if(!r){back();return}
  $("v-recipe").innerHTML=`${navTop("Recipe")}
   <div style="display:flex;flex-direction:column;align-items:center;gap:10px">${plate(r.e).replace('class="plate ','class="plate" style="width:170px;height:170px" data-x="').replace("<span>",'<span style="font-size:80px">')}
    <div style="font-size:19px;font-weight:600">${r.navn}</div><div class="small muted" style="margin-top:-8px">${r.min} min · ${r.ing.length} ingredients</div></div>
   <div class="stack">${r.ing.map(k=>{const u=r.uses.find(x=>x.k===k);return`<div class="info">${ic(u?"check":"cart",2.4)}<span>${cap(k)}</span><span class="r">${u?pill(u.d):'<span class="pill" style="background:var(--field);color:var(--muted)">Missing</span>'}</span></div>`}).join("")}</div>
   ${r.miss.length?`<button class="btn soft" id="r-miss">Add ${r.miss.length} missing to the shopping list</button>`:""}
   <button class="btn" id="r-cook">Cook this – mark items as used</button>`;
  $("r-miss")&&($("r-miss").onclick=()=>{let n=0;r.miss.forEach(k=>{if(!S.shop.some(s=>s.t.toLowerCase().includes(k))){S.shop.push({t:cap(k),done:false,av:"Nora"});n++}});save();toast(n?`${n} items added to the shopping list`:"Already on the shopping list")});
  $("r-cook").onclick=()=>{const used=r.uses.filter(u=>u.d<=7);used.forEach(u=>use(u,"brukt"));ctx.saved={navn:r.navn,pris:used.reduce((s,u)=>s+u.pris*u.ant,0),ant:1};show("success")};
};

/* shopping */
R.shop=()=>{
  const left=S.shop.filter(s=>!s.done).length,done=S.shop.length-left;
  const cmpS=compareStores();
  $("v-shop").innerHTML=`<div class="nav-top"><span></span><h2>Shopping list</h2><span></span></div>
   ${cmpS.length&&S.shop.some(x=>!x.done)?`<button class="cheap-card" data-go="tilbud">${storeBadge(cmpS[0].s,true)}<span style="flex:1">Cheapest for your list: <b>${STORES[cmpS[0].s].n} · kr ${kr2(cmpS[0].sum)}</b><br><span class="muted">Save kr ${kr2(cmpS[cmpS.length-1].sum-cmpS[0].sum)} compared with the priciest store</span></span><span class="dia sm">${ic("arrow",2.6)}</span></button>`:""}
   <form class="addrow" id="s-form"><input class="field" id="s-in" placeholder="Add item" autocomplete="off" aria-label="New item"><button class="dia" type="submit" aria-label="Add">${ic("plus",3)}</button></form>
   <div class="warnbox" id="s-warn" hidden></div>
   <div class="stack">${S.shop.length?S.shop.map((s,i)=>{const have=S.items.find(x=>x.navn.toLowerCase().includes(s.t.toLowerCase())||s.t.toLowerCase().includes(x.navn.toLowerCase()));
    return`<div class="lcard ${s.done?"done":""}" style="padding:10px 14px">${plate(emo(s.t)).replace("plate ",'plate" style="width:46px;height:46px" data-x="').replace("<span>",'<span style="font-size:22px">')}
     <div class="mid"><div class="nm">${esc(s.t)}</div>${have&&!s.done?`<div class="small" style="color:var(--warn);font-weight:500">You already have ${esc(have.navn.toLowerCase())} (${label(days(have.dato)).toLowerCase()})</div>`:`<div class="sb">Added by ${s.av}</div>`}</div>
     <button class="check" data-tick="${i}" aria-label="Tick off">${ic("check",3.4)}</button><button class="x" data-del="${i}" aria-label="Remove">×</button></div>`}).join(""):'<div class="empty">The shopping list is empty.</div>'}</div>
   <div class="summary"><div><div class="small muted">Left to buy</div><div style="font-size:20px;font-weight:600">${left} items</div></div><button class="btn" id="s-done" ${done?"":"disabled style=\"opacity:.5\""}>Done shopping (${done})</button></div>
   <p class="center muted small" style="margin:-6px 0 0">Ticked items move to “Food at home”.</p>
   <button class="scan-banner" data-scanshop><span class="si">${ic("camera",2)}</span><span class="tx"><b>Scan an item</b>Run out of something? Scan the barcode and it goes straight on the list.</span><span class="dia sm">${ic("arrow",2.6)}</span></button>`;
  $("s-form").onsubmit=e=>{e.preventDefault();const v=$("s-in").value.trim();if(!v)return;S.shop.unshift({t:cap(v),done:false,av:"Nora"});save();R.shop()};
  $("s-in").oninput=e=>{const v=e.target.value.trim().toLowerCase();const h=v.length>2&&S.items.find(x=>x.navn.toLowerCase().includes(v));$("s-warn").hidden=!h;if(h)$("s-warn").innerHTML=`<b>Hold on:</b> you already have ${esc(h.navn.toLowerCase())} at home (${label(days(h.dato)).toLowerCase()}).`};
  $("v-shop").querySelectorAll("[data-tick]").forEach(b=>b.onclick=()=>{const s=S.shop[+b.dataset.tick];s.done=!s.done;save();R.shop()});
  $("v-shop").querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{S.shop.splice(+b.dataset.del,1);save();R.shop()});
  $("s-done").onclick=()=>{const bought=S.shop.filter(s=>s.done);bought.forEach(s=>S.items.push({id:Math.random().toString(36).slice(2),navn:s.t,plass:"Fridge",dato:iso(7),type:"best",pris:30,kg:.4,av:"Nora",ant:1}));S.shop=S.shop.filter(s=>!s.done);save();R.shop();toast(`${bought.length} items added at home – check the dates`)};
};

/* stats */
R.stats=()=>{
  const b=S.log.filter(l=>l.ut==="brukt"),k=S.log.filter(l=>l.ut==="kastet"),sum=(a,f)=>a.reduce((s,l)=>s+l[f],0);
  const kg=sum(b,"kg"),rate=Math.round(100*sum(b,"kr")/Math.max(1,sum(b,"kr")+sum(k,"kr")));
  const weeks=[...Array(6)].map((_,i)=>{const end=today.getTime()-(5-i)*7*DAY+DAY,start=end-7*DAY;const inW=l=>{const t=new Date(l.dato+"T00:00:00").getTime();return t>=start&&t<end};return{b:sum(b.filter(inW),"kr"),k:sum(k.filter(inW),"kr"),lab:i===5?"Now":`-${5-i}w`}});
  const top=Math.ceil(Math.max(100,...weeks.map(w=>w.b+w.k))/100)*100,W=320,H=150,L=34,B=20,bw=22,step=(W-L-6)/6,y=v=>H-B-(v/top)*(H-B-10);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Saved and thrown out per week">`;
  [0,top/2,top].forEach(v=>svg+=`<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="#ECECEE"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="10" fill="#8E8E93" font-family="Poppins,sans-serif">${v}</text>`);
  weeks.forEach((w,i)=>{const x=L+i*step+(step-bw)/2;svg+=`<rect x="${x}" y="${y(w.b)}" width="${bw}" height="${H-B-y(w.b)}" rx="5" fill="#4E9F32"/>`;if(w.k)svg+=`<rect x="${x}" y="${y(w.b+w.k)}" width="${bw}" height="${y(w.b)-y(w.b+w.k)}" rx="5" fill="#D72F2F"/>`;svg+=`<text x="${x+bw/2}" y="${H-5}" text-anchor="middle" font-size="10" fill="#8E8E93" font-family="Poppins,sans-serif">${w.lab}</text>`});
  $("v-stats").innerHTML=`<div class="nav-top"><span></span><h2>Savings</h2><span></span></div>
   <div class="save-card" style="cursor:default"><div><span>Total saved with Leftly</span><b>kr ${nok(sum(b,"kr"))}</b></div><span>${rate} % eaten</span></div>
   <div class="bigs"><div class="bs"><b>${kg.toFixed(1)} kg</b><span>Food saved</span></div><div class="bs"><b>${(kg*2.5).toFixed(1)} kg</b><span>CO₂e avoided (about 2.5 per kg of food)</span></div></div>
   <div class="chart"><div style="font-weight:600;margin-bottom:8px">Last 6 weeks (kr)</div>${svg}</svg><div class="legend"><span><i style="background:var(--ok)"></i>Eaten</span><span><i style="background:var(--bad)"></i>Thrown out</span></div></div>
   <div class="sec-head"><h3>Household</h3><button class="link" id="inv">+ Invite</button></div>
   <div class="stack">${Object.entries(PEOPLE).map(([n,c])=>`<div class="lcard"><span class="av" style="background:${c}">${n[0]}</span><div class="mid"><div class="nm">${n}${n==="Nora"?" (you)":""}</div><div class="sb">${S.items.filter(i=>i.av===n).length} items added</div></div><span class="pill ${n==="Nora"?"p-bad":"p-ok"}">${n==="Nora"?"Owner":"Member"}</span></div>`).join("")}</div>`;
  $("inv").onclick=invite;
};
function qrSvg(seed){let x=seed;const rnd=()=>{x=(x*9301+49297)%233280;return x/233280};const N=25;let r="";
  const fin=(cx,cy)=>`<rect x="${cx}" y="${cy}" width="7" height="7" fill="#111"/><rect x="${cx+1}" y="${cy+1}" width="5" height="5" fill="#fff"/><rect x="${cx+2}" y="${cy+2}" width="3" height="3" fill="#111"/>`;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const inF=(i<8&&j<8)||(i<8&&j>N-9)||(i>N-9&&j<8);if(!inF&&rnd()>.52)r+=`<rect x="${j}" y="${i}" width="1" height="1" fill="#111"/>`}
  return`<svg viewBox="-1 -1 ${N+2} ${N+2}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect x="-1" y="-1" width="${N+2}" height="${N+2}" fill="#fff"/>${r}${fin(0,0)}${fin(N-7,0)}${fin(0,N-7)}</svg>`}
function invite(){sheet(`<h2 class="red-title" style="font-size:18px">Invite housemates</h2><p class="center muted small" style="margin:0">Let them scan the QR code in Leftly, and you'll share your food and shopping list.</p><div class="qr">${qrSvg(4821)}</div><div style="text-align:center;font-size:20px;font-weight:600;letter-spacing:.18em;color:var(--red)">FRDG-4821</div><button class="btn" id="cp">Copy code</button>`,el=>el.querySelector("#cp").onclick=()=>{try{navigator.clipboard.writeText("FRDG-4821").then(()=>toast("Code copied"),()=>toast("Write down the code: FRDG-4821"))}catch(e){toast("Write down the code: FRDG-4821")}close()})}

/* profile */
R.profile=()=>{
  const row=(go,ico,t,extra="")=>`<button class="row" ${go}><span style="display:flex;gap:12px;align-items:center">${ic(ico).replace("<svg",'<svg style="width:18px;height:18px;color:var(--red)"')}${t}</span>${extra}${ic("chev")}</button>`;
  const b=S.log.filter(l=>l.ut==="brukt");
  $("v-profile").innerHTML=`${navTop("My profile")}
   <div class="p-head"><button class="p-av" data-toast="Editing is coming in the next version" aria-label="Edit profile" style="border:0">N<span class="ed">${ic("edit",2.4)}</span></button>
    <div style="font-weight:600;font-size:17px">Nora Strand</div><div class="small muted">nora.strand@example.com</div></div>
   <div class="p-stats"><div><b>kr ${nok(b.reduce((s,l)=>s+l.kr,0))}</b><span>saved</span></div><div><b>${b.reduce((s,l)=>s+l.kg,0).toFixed(1)} kg</b><span>food saved</span></div><div><b>${Object.keys(PEOPLE).length}</b><span>in household</span></div></div>
   <div class="set-grp">${row('data-tab="stats"',"users","Household and savings")}${row("data-invite","qr","Invite with QR code")}${row('data-go="koder"',"ticket","My discount codes",'<span class="pill p-ok" style="margin-left:auto;margin-right:8px">2 new</span>')}</div>
   <div class="set-grp">${row('data-go="tips"',"bulb","Tips and tricks")}${row('data-go="notif"',"bell","Notifications")}${row('data-go="settings"',"gear","Settings")}${row('data-go="feedback"',"chat","Send feedback")}</div>
   <div class="set-grp"><button class="row" id="p-reset">Reset sample data ${ic("chev")}</button><button class="row" data-go="welcome" style="color:var(--bad)">Log out ${ic("chev")}</button></div>`;
  $("p-reset").onclick=()=>{S=seed();S.settings={dager:2,tid:"08:00",push:true,ukentlig:true,deling:true,tilbud:true};save();toast("Sample data reset")};
};

/* notifications */
function alerts(){const a=[];sorted().forEach(i=>{const d=days(i.dato);
  if(d<=0&&i.type==="siste")a.push([i,`${i.navn} must be used by today`,"Cook it or freeze it today."]);
  else if(d<0)a.push([i,`${i.navn} is past its best-before date`,"Look, smell and taste before you throw it out."]);
  else if(d<=S.settings.dager)a.push([i,`${i.navn} expires ${d===0?"today":d===1?"tomorrow":`in ${d} days`}`,"Find a recipe that uses it."]);});return a}
R.notif=()=>{const a=alerts();
  $("v-notif").innerHTML=`${navTop("Notifications")}<div class="small muted" style="font-weight:500">New</div>
   <div class="stack">${a.length?a.map(([i,t,m])=>{const n=scored().filter(r=>r.uses.some(u=>u.id===i.id)).length;return`<div class="lcard">${plate(emo(i.navn)).replace("plate ",'plate" style="width:44px;height:44px" data-x="').replace("<span>",'<span style="font-size:20px">')}<div class="mid" data-item="${i.id}" style="cursor:pointer"><div class="nm">${esc(t)}</div><div class="sb">${m}</div>${n?`<button class="sub-act" data-recfor="${esc(i.navn)}">${n} leftover recipes →</button>`:""}</div>${pill(days(i.dato))}</div>`}).join(""):'<div class="empty">No new notifications.</div>'}
   <div class="lcard"><span class="av" style="background:#8A4F7D">S</span><div class="mid"><div class="nm">Sara added tortillas to the shopping list</div><div class="sb">Shopping list</div></div></div>
   <div class="lcard"><span class="av" style="background:var(--red)">R</span><div class="mid"><div class="nm">Welcome to Leftly</div><div class="sb">Add what you have at home and we'll remind you.</div></div></div></div>`;
};

/* add item */
R.add=()=>{
  const pf=ctx.prefill;ctx.prefill=null;
  let plass="Fridge",type=pf?pf.type:"best";
  $("v-add").innerHTML=`${navTop("Add item")}
   <div class="illu" style="margin-top:4px;width:120px;height:120px">${ic("fridge",1.6)}</div><div class="hr"></div>
   <button class="btn outline" data-scan="barcode" style="display:flex;gap:8px;justify-content:center;align-items:center">${ic("scan").replace("<svg",'<svg style="width:18px;height:18px"')}Scan barcode</button>
   ${pf?`<div class="warnbox" style="background:var(--red-soft)"><b style="color:var(--red)">Barcode read:</b> ${esc(pf.navn)}. Check the date on the pack and tap Save.</div>`:""}
   <input class="field" id="a-n" placeholder="Item name, e.g. low-fat milk" autocomplete="off" value="${pf?esc(pf.navn):""}">
   <label class="lbl">Where</label><div class="seg" id="a-pl">${["Fridge","Freezer","Pantry"].map(p=>`<button data-v="${p}" aria-pressed="${p===plass}">${p}</button>`).join("")}</div>
   <label class="lbl">Date label</label><div class="seg" id="a-ty"><button data-v="best" aria-pressed="${type==="best"}">Best before</button><button data-v="siste" aria-pressed="${type==="siste"}">Use by</button></div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><input class="field" type="date" id="a-d" value="${iso(pf?pf.d:5)}" aria-label="Date"><input class="field" type="number" id="a-p" placeholder="Price (kr)" inputmode="numeric" value="${pf?pf.pris:""}"></div>
   <label class="cb"><input type="checkbox" checked id="a-notif"> Remind me 2 days before the date</label>
   <button class="btn" id="a-save">Save</button>`;
  const el=$("v-add");segBind(el,"#a-pl",v=>plass=v);segBind(el,"#a-ty",v=>type=v);
  $("a-save").onclick=()=>{const n=$("a-n").value.trim();if(!n){$("a-n").focus();toast("Enter the item name");return}
    S.items.push({id:Math.random().toString(36).slice(2),navn:cap(n),plass,dato:$("a-d").value||iso(5),type,pris:+$("a-p").value||30,kg:.4,av:"Nora",ant:1});save();back();toast(`${cap(n)} added`)};
};



/* ---------- deals (example prices) ---------- */
const STORES={rema:{n:"REMA 1000",k:"R",c:"#14316B"},kiwi:{n:"KIWI",k:"K",c:"#2E8B3A"},extra:{n:"Coop Extra",k:"E",c:"#E2A400"},meny:{n:"Meny",k:"M",c:"#B3122E"},bunnpris:{n:"Bunnpris",k:"B",c:"#1D5FA8"}};
const DEALS=[
 {navn:"Chicken fillet 900 g",key:"chicken",butikk:"meny",pris:109,for:159},
 {navn:"Tortillas 8 pcs",key:"tortilla",butikk:"kiwi",pris:19.9,for:32.9},
 {navn:"Onions 1 kg",key:"onion",butikk:"rema",pris:12.9,for:22.9},
 {navn:"Salmon fillet 4 pcs",key:"salmon",butikk:"extra",pris:79,for:129},
 {navn:"Low-fat milk 1 l",key:"milk",butikk:"bunnpris",pris:19.9,for:24.9},
 {navn:"Coffee 500 g",key:"coffee",butikk:"extra",pris:59,for:89.9},
 {navn:"Bananas 1 kg",key:"banana",butikk:"kiwi",pris:19.9,for:29.9},
 {navn:"Pasta 1 kg",key:"pasta",butikk:"rema",pris:15.9,for:26.9},
 {navn:"Norvegia cheese 1 kg",key:"norvegia",butikk:"meny",pris:99,for:139},
 {navn:"Eggs 12 pcs",key:"egg",butikk:"bunnpris",pris:39.9,for:49.9},
 {navn:"Broccoli",key:"broccoli",butikk:"rema",pris:14.9,for:24.9},
 {navn:"Minced beef 400 g",key:"mince",butikk:"kiwi",pris:34.9,for:52.9}];
DEALS.forEach(d=>d.pct=Math.round(100*(1-d.pris/d.for)));
const BASE={tortilla:31,onion:21,milk:24,coffee:86,banana:28,pasta:25,chicken:149,salmon:119,egg:48,norvegia:132,broccoli:23,mince:49,cucumber:16,tomato:32,rice:35,bread:39};
const FACT={rema:.97,kiwi:.95,extra:1.0,meny:1.08,bunnpris:1.04};
const kr2=n=>n%1?n.toFixed(2):String(n);
const storeBadge=(k,big)=>`<span class="store"><i style="background:${STORES[k].c}${big?";width:30px;height:30px;border-radius:9px;font-size:13px":""}">${STORES[k].k}</i>${big?"":STORES[k].n}</span>`;
const daysToSun=()=>{const d=(7-today.getDay())%7;return d===0?"today":d===1?"tomorrow":"Sunday"};
function topDeals(store){return DEALS.filter(d=>!store||store==="alle"||d.butikk===store).sort((a,b)=>b.pct-a.pct)}
function priceAt(name,store){const n=name.toLowerCase();const key=Object.keys(BASE).find(k=>n.includes(k));
  const deal=DEALS.find(d=>d.butikk===store&&n.includes(d.key));if(deal)return deal.pris;
  return Math.round((key?BASE[key]:30)*FACT[store]*10)/10}
function compareStores(){const list=S.shop.filter(x=>!x.done);if(!list.length)return[];
  return Object.keys(STORES).map(s=>({s,sum:Math.round(list.reduce((t,x)=>t+priceAt(x.t,s),0)*10)/10})).sort((a,b)=>a.sum-b.sum)}
R.tilbud=()=>{
  const store=ctx.store||"alle";const cmpS=compareStores();const list=S.shop.filter(x=>!x.done);
  const missing={};scored().forEach(r=>r.miss.forEach(k=>{(missing[k]=missing[k]||[]).push(r.navn)}));
  const max=cmpS.length?cmpS[cmpS.length-1].sum:1;
  $("v-tilbud").innerHTML=`${navTop("Weekly deals",`<button class="icon-btn" data-go="kart" aria-label="Stores nearby" style="color:var(--red)">${ic("pin")}</button>`)}
   ${cmpS.length?`<div class="cmp"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-weight:600">Cheapest for your shopping list</div><span class="small muted">${list.length} items</span></div>
     ${cmpS.map((c,i)=>`<div class="cmp-row ${i===0?"best":""}">${storeBadge(c.s)}<div class="cmp-bar"><span style="width:${Math.round(100*c.sum/max)}%"></span></div><b>kr ${kr2(c.sum)}</b></div>`).join("")}
     <div class="small" style="color:var(--red);font-weight:500">Shop at ${STORES[cmpS[0].s].n} and save kr ${kr2(Math.round((max-cmpS[0].sum)*10)/10)}</div></div>`:""}
   <div class="cats">${[["alle","All"],...Object.entries(STORES).map(([k,v])=>[k,v.n])].map(([k,n])=>`<button class="cat" data-st="${k}" aria-pressed="${k===store}">${k==="alle"?"":`<i style="width:10px;height:10px;border-radius:3px;background:${STORES[k].c};display:inline-block"></i>`}${n}</button>`).join("")}</div>
   <div class="sec-head"><h3>${store==="alle"?"Best deals":STORES[store].n} this week</h3><span class="small muted">valid until ${daysToSun()}</span></div>
   <div class="stack">${topDeals(store).map((d,ix)=>{const has=S.items.find(x=>x.navn.toLowerCase().includes(d.key));const fits=missing[d.key];const onList=S.shop.some(x=>x.t.toLowerCase().includes(d.key)&&!x.done);
     return`<div class="deal">${plate(emo(d.navn))}<div class="mid"><div class="nm">${esc(d.navn)}</div>${storeBadge(d.butikk)}<div class="pr"><b>kr ${kr2(d.pris)}</b><s>kr ${kr2(d.for)}</s><span class="off-pill">-${d.pct} %</span></div>
      ${has&&days(has.dato)<=7?`<div class="tagline" style="color:var(--warn)">You already have ${esc(has.navn.toLowerCase())} (${label(days(has.dato)).toLowerCase()}) – need more?</div>`:fits?`<div class="tagline" style="color:var(--red)">Goes with: ${fits.slice(0,2).join(", ")}</div>`:""}</div>
      <button class="add-btn ${onList?"done":""}" data-deal="${DEALS.indexOf(d)}" aria-label="Add ${esc(d.navn)} to the shopping list">${ic(onList?"check":"plus",3)}</button></div>`}).join("")}</div>
   <p class="demo-note">Sample prices in the prototype. A real app would fetch prices from the stores, for example via Kassalapp.</p>`;
  $("v-tilbud").querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{ctx.store=b.dataset.st;R.tilbud()});
  $("v-tilbud").querySelectorAll("[data-deal]").forEach(b=>b.onclick=()=>{const d=DEALS[+b.dataset.deal];const ex=S.shop.find(x=>x.t.toLowerCase().includes(d.key)&&!x.done);
    if(ex){toast(`${ex.t} is already on the shopping list`);return}
    S.shop.unshift({t:d.navn.replace(/ \d.*$/,""),done:false,av:"Nora"});save();R.tilbud();toast(`${d.navn} added to the shopping list`)});
};

/* ---------- scanning (simulated in this prototype) ---------- */
const SCAN={
 fridge:[["Salmon","siste",1,89,.4,22,30,97],["Ham","siste",2,35,.2,50,30,93],["Cucumber","best",5,15,.35,78,30,98],
  ["Juice","best",6,29,1,22,58,95],["Butter","best",30,45,.5,50,58,91],["Lettuce","best",2,32,.3,78,58,88],
  ["Carrots","best",14,20,.75,34,84,96],["Broccoli","best",4,25,.4,66,84,94]],
 receipt:[["Salmon","siste",2,89,.4],["Cucumber","best",6,15,.35],["Carrots","best",14,20,.75],["Low-fat milk","best",9,24,1],["Broccoli","best",5,25,.4],["Tortillas","best",21,32,.4]]
};
const RECEIPT=[["REMA 1000 GRÜNERLØKKA",""],["SALMON FILLET 400G","89.90"],["CUCUMBER","14.90"],["CARROTS 750G","19.90"],["TINE LOW-FAT MILK 1L","23.90"],["BROCCOLI","24.90"],["TORTILLA 8 PCS","31.90"],["",""],["TOTAL","205.40"]];
R.scan=()=>{
  const m=ctx.scanMode||"fridge";const items=SCAN.fridge;
  let scene;
  if(ctx.photo)scene=`<img src="${ctx.photo}" alt="Your photo">`;
  else if(m==="fridge")scene=`<div class="fridge">${[30,58,84].map(y=>`<div class="shelf" style="top:${y}%"></div>`).join("")}${items.map(([n,,,,,x,y])=>`<span class="fi" style="left:${x}%;top:${y}%">${emo(n)}</span>`).join("")}</div>
    ${items.map(([n,,,,,x,y,c],i)=>`<div class="bbox" data-b="${i}" style="left:calc(${x}% - 36px);top:calc(${y}% - 60px);width:72px;height:60px"><span>${n} ${c}%</span></div>`).join("")}`;
  else if(m==="receipt")scene=`<div style="position:absolute;inset:0;background:#26332D"></div><div class="paper"><b>RECEIPT</b>${RECEIPT.map(([a,b])=>`<div><span>${a}</span><span>${b}</span></div>`).join("")}</div>`;
  else if(m==="qr")scene=`<div class="bc"></div><div class="qr-card">${qrSvg(4821)}Join the household<br><span style="color:var(--red)">FRDG-4821</span></div>`;
  else scene=`<div class="bc"><span class="pack">🥛</span><span class="bars"></span></div>`;
  const hint=ctx.photo?"Your photo is ready – tap to analyse":m==="fridge"?"Point your phone at the fridge":m==="receipt"?"Lay the receipt flat":m==="qr"?"Scan a housemate's QR code":ctx.scanTarget==="shop"?"The item goes on the shopping list":"Aim at the barcode";
  $("v-scan").innerHTML=`<div class="cam-top"><button class="cam-btn" data-back aria-label="Close">${ic("back",2.4)}</button><h2>${m==="barcode"?(ctx.scanTarget==="shop"?"Scan to shopping list":"Scan barcode"):m==="receipt"?"Scan receipt":m==="qr"?"Join household":"Scan the fridge"}</h2><button class="cam-btn" data-toast="Flash on" aria-label="Flash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg></button></div>
   <div class="cam" id="cam">${scene}<div class="vf ${m==="barcode"?"bcf":""}" ${m==="qr"?'style="inset:auto;left:20%;right:20%;top:22%;height:48%"':""}><i></i><i></i><i></i><i></i></div><div class="sline"></div><div class="cam-hint" id="hint">${hint}</div></div>
   <div class="modes">${[["fridge","Fridge"],["receipt","Receipt"],["barcode","Barcode"],["qr","QR"]].map(([k,n])=>`<button data-mode="${k}" aria-pressed="${k===m}" style="padding:7px 10px">${n}</button>`).join("")}</div>
   <div class="shutter-row"><button class="cam-btn" id="pick" aria-label="Choose a photo from your phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg></button>
   <button class="shutter" id="shoot" aria-label="Take photo"><i></i></button>
   <button class="cam-btn" data-toast="Tip: good lighting gives better results" aria-label="Tips">${ic("info")}</button></div>`;
  $("v-scan").querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ctx.scanMode=b.dataset.mode;if(b.dataset.mode!=="barcode")ctx.scanTarget=null;ctx.photo=null;R.scan()});
  $("pick").onclick=()=>$("photo-in").click();
  let busy=false;
  $("shoot").onclick=()=>{if(busy)return;busy=true;const cam=$("v-scan");cam.classList.add("scanning");$("hint").textContent=m==="barcode"?"Reading barcode …":m==="receipt"?"Reading item lines …":m==="qr"?"Reading QR code …":"Recognising food …";
    if(m==="qr"){setTimeout(()=>{cam.classList.remove("scanning");busy=false;joinSheet()},1100);return}
    if(m==="barcode"&&ctx.scanTarget==="shop"){setTimeout(()=>{cam.classList.remove("scanning");ctx.scanTarget=null;S.shop.unshift({t:"Tine low-fat milk 1 l",done:false,av:"Nora"});save();back();toast("Tine low-fat milk 1 l added to the shopping list")},1200);return}
    if(m==="barcode"){setTimeout(()=>{cam.classList.remove("scanning");ctx.prefill={navn:"Tine low-fat milk 1 l",type:"best",d:9,pris:24};show("add")},1300);return}
    const boxes=[...cam.querySelectorAll(".bbox")];boxes.forEach((b,i)=>setTimeout(()=>b.classList.add("on"),250+i*220));
    setTimeout(()=>{cam.classList.remove("scanning");startResults(m==="receipt"?"receipt":"fridge")},boxes.length?450+boxes.length*220:1700)};
};
$("photo-in").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;try{ctx.photo=URL.createObjectURL(f)}catch(err){ctx.photo=null}ctx.scanMode="fridge";e.target.value="";R.scan()});
function startResults(kind){
  ctx.found=SCAN[kind].map(([navn,type,d,pris,kg],i)=>({id:"s"+i+Date.now(),navn,type,dato:iso(d),pris,kg,plass:"Fridge",av:"Nora",ant:1,sel:true,isNew:true,conf:SCAN.fridge.find(x=>x[0]===navn)?.[7]||99}));
  ctx.kind=kind;ctx.resTab="varer";show("scanres");
}
R.scanres=()=>{
  const F=ctx.found||[];const sel=F.filter(f=>f.sel);
  const inv=[...S.items,...sel];
  const soon=sel.filter(f=>days(f.dato)<=3).length;
  const recs=scored(inv).filter(r=>r.miss.length<=1&&r.uses.some(u=>u.isNew));
  let body="";
  if(ctx.resTab==="varer"){
    body=`<div class="stack">${F.map((f,i)=>{const d=days(f.dato),has=S.items.find(x=>x.navn.toLowerCase()===f.navn.toLowerCase());
      return`<div class="lcard ${f.sel?"":"off"}">${plate(emo(f.navn))}<div class="mid"><div class="nm">${esc(f.navn)}</div><div class="sb">${f.type==="siste"?"Use by":"Best before"} approx. ${fmtDate(f.dato)}${ctx.kind==="fridge"?` · ${f.conf} % sure`:""}</div>${has?`<div class="small" style="color:var(--warn);font-weight:500">Already have this – will be combined</div>`:""}</div>${pill(d)}<button class="check" data-pick="${i}" aria-label="Include ${esc(f.navn)}" style="${f.sel?"background:var(--red);border-color:var(--red)":""}">${ic("check",3.4).replace("<svg",`<svg style="opacity:${f.sel?1:0}"`)}</button></div>`}).join("")}</div>
     <p class="demo-note">Dates are estimated from typical shelf life. You can change them later.</p>`;
  }else if(ctx.resTab==="utlop"){
    const all=[...S.items.filter(i=>i.plass!=="Pantry"),...sel].sort((a,b)=>a.dato.localeCompare(b.dato));
    const G=[["bad","Eat today","var(--bad)"],["warn","Expiring soon (1–3 days)","var(--warn)"],["ok","Still fresh","var(--ok)"]];
    body=G.map(([k,t,c])=>{const L=all.filter(i=>st(days(i.dato))===k);if(!L.length)return"";
      return`<div class="grp"><i style="background:${c}"></i>${t} · ${L.length}</div><div class="stack">${L.map(i=>`<div class="lcard" style="padding:10px 14px">${plate(emo(i.navn)).replace("plate ",'plate" style="width:44px;height:44px" data-x="').replace("<span>",'<span style="font-size:20px">')}<div class="mid"><div class="nm">${esc(i.navn)}${i.isNew?'<span class="newtag">NEW</span>':""}</div><div class="sb">${i.plass}</div></div>${pill(days(i.dato))}</div>`).join("")}</div>`}).join("");
  }else{
    body=recs.length?`<div class="stack">${recs.slice(0,5).map(r=>`<div class="lcard">${plate(r.e)}<div class="mid"><div class="nm">${r.navn}</div><div class="sb">${r.min} min · you have ${r.uses.length} of ${r.ing.length}</div><div class="small" style="color:var(--red);font-weight:500">Uses new: ${r.uses.filter(u=>u.isNew).map(u=>u.navn.toLowerCase()).join(", ")}</div></div>${r.miss.length?`<span class="pill p-warn">Missing 1</span>`:`<span class="pill p-ok">Ready</span>`}</div>`).join("")}</div>`:`<div class="empty">No new recipes with these items.</div>`;
  }
  $("v-scanres").innerHTML=`${navTop("Scan results")}
   <div class="res-hero"><span class="ri">${ic(ctx.kind==="receipt"?"list":"scan",2.2)}</span><div><b>Found ${F.length} items</b><span>${soon} expire within 3 days · ${recs.length} recipes you can make</span></div></div>
   <div class="segbar">${[["varer","Items"],["utlop","Expiry"],["oppskr","Recipes"]].map(([k,n])=>`<button data-rt="${k}" aria-pressed="${ctx.resTab===k}">${n}</button>`).join("")}</div>
   ${body}
   <div class="res-foot"><button class="btn" id="res-add" ${sel.length?"":"disabled style=\"opacity:.5\""}>Add ${sel.length} items to the fridge</button></div>`;
  $("v-scanres").querySelectorAll("[data-rt]").forEach(b=>b.onclick=()=>{ctx.resTab=b.dataset.rt;R.scanres()});
  $("v-scanres").querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{const f=F[+b.dataset.pick];f.sel=!f.sel;R.scanres()});
  $("res-add").onclick=()=>{if(!sel.length)return;sel.forEach(f=>{const has=S.items.find(x=>x.navn.toLowerCase()===f.navn.toLowerCase());
      if(has){has.ant+=1;if(f.dato>has.dato)has.dato=f.dato}else S.items.push({id:Math.random().toString(36).slice(2),navn:f.navn,plass:f.plass,dato:f.dato,type:f.type,pris:f.pris,kg:f.kg,av:"Nora",ant:1})});
    save();ctx.found=null;ctx.place="All";ctx.status="All";ctx.q="";hist=[];show("varer",false);toast(`${sel.length} items added and sorted by date`)};
};


function joinSheet(){sheet(`<h2 class="red-title" style="font-size:18px">Join the household?</h2><p class="center muted small" style="margin:0">The Løkka flatshare · 3 members</p>
  <div style="display:flex;justify-content:center;gap:8px">${Object.entries(PEOPLE).map(([n,c])=>`<span class="av" style="background:${c}">${n[0]}</span>`).join("")}</div>
  <div class="tipbox">You share <b>food at home</b>, <b>the shopping list</b> and <b>savings</b>. Everyone gets an alert when something is about to expire.</div>
  <div class="acts"><button class="btn outline" id="j-no">Cancel</button><button class="btn" id="j-yes">Join</button></div>`,el=>{
  el.querySelector("#j-no").onclick=close;
  el.querySelector("#j-yes").onclick=()=>{el.innerHTML=`<div class="grab"></div><div class="spin"></div><p class="center" style="margin:0;font-weight:600">Syncing lists …</p>`;
    setTimeout(()=>{el.innerHTML=`<div class="grab"></div><div class="illu red" style="margin-top:0;width:90px;height:90px">${ic("check",2.6)}</div><p class="red-title" style="font-size:18px">Shared list updated</p><p class="center muted small" style="margin:0">${S.items.length} items at home and ${S.shop.filter(x=>!x.done).length} on the shopping list are now shared.</p><button class="btn" id="j-ok">Go to shopping list</button>`;
      el.querySelector("#j-ok").onclick=()=>{hist=[];show("shop",false)}},1300)};
});}

/* push notification (simulated) */
function pushBanner(){if(!S.settings.push||cur!=="home")return;const a=alerts();if(!a.length)return;const i=(a.find(x=>days(x[0].dato)<=0)||a[0])[0];
  const n=scored().filter(r=>r.uses.some(u=>u.id===i.id)).length;
  const el=document.createElement("button");el.className="push";el.innerHTML=`<span class="pi">R</span><span class="pt"><small><span>Leftly</span><span>now</span></small><b>${esc(i.navn)} ${days(i.dato)<=0?"expires today":"expires soon"}</b>${n?`${n} leftover recipes can use it. Tap for ideas.`:"Tap to see the item."}</span>`;
  el.onclick=()=>{el.remove();if(n){ctx.recFor=i.navn;show("recipes")}else{ctx.item=i.id;show("detail")}};
  $("app").appendChild(el);setTimeout(()=>el.remove(),6500);}

/* map */
const PLACES=[{s:"kiwi",omr:"Birkelunden",m:350,x:62,y:34,til:"23"},{s:"rema",omr:"Schous plass",m:420,x:30,y:58,til:"23"},{s:"bunnpris",omr:"Grünerløkka",m:180,x:46,y:46,til:"24"},{s:"extra",omr:"Carl Berners plass",m:900,x:80,y:72,til:"22"},{s:"meny",omr:"Sofienberg",m:650,x:24,y:22,til:"22"}];
R.kart=()=>{const cmp=compareStores();const sel=ctx.mapSel||"bunnpris";
  const sum=k=>{const c=cmp.find(x=>x.s===k);return c?c.sum:null};
  const cheapest=cmp[0]&&cmp[0].s;
  $("v-kart").innerHTML=`${navTop("Stores nearby")}
   <div class="map"><svg viewBox="0 0 360 290" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
     <rect width="360" height="290" fill="#E9EFE9"/><path d="M-10 250 C 60 220, 90 160, 70 90 S 90 10, 120 -10" fill="none" stroke="#B9D8EA" stroke-width="16"/>
     <rect x="150" y="70" width="70" height="55" rx="8" fill="#C9E3C4"/><rect x="250" y="180" width="60" height="45" rx="8" fill="#C9E3C4"/>
     <g stroke="#FFFFFF" stroke-width="9" fill="none"><path d="M0 120 H360"/><path d="M0 200 H360"/><path d="M110 0 V290"/><path d="M240 0 V290"/><path d="M0 40 L360 150"/></g>
     <g stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".9"><path d="M0 160 H360"/><path d="M175 0 V290"/><path d="M300 0 V290"/><path d="M0 80 H360"/></g>
     <text x="160" y="102" font-size="9" fill="#5E8A5A" font-family="Poppins">Birkelunden</text></svg>
     <span class="me" style="left:52%;top:52%"></span>
     ${PLACES.map(p=>`<button class="mpin ${p.s===sel?"sel":""}" data-pin="${p.s}" style="left:${p.x}%;top:${p.y}%"><i style="background:${STORES[p.s].c}"><b>${STORES[p.s].k}</b></i><span>${p.m} m</span></button>`).join("")}</div>
   <div class="sec-head"><h3>Closest to you</h3><span class="small muted">Grünerløkka, Oslo</span></div>
   <div class="stack">${[...PLACES].sort((a,b)=>a.m-b.m).map(p=>`<button class="srow ${p.s===sel?"sel":""}" data-pin="${p.s}">${storeBadge(p.s,true)}<span class="mid"><span class="nm" style="display:block">${STORES[p.s].n} ${p.omr}</span><span class="sb">${p.m} m · ${Math.max(2,Math.round(p.m/80))} min walk · open until ${p.til}</span>${p.s===cheapest?`<span class="pill p-ok" style="margin-top:4px">Cheapest for your list</span>`:""}</span>${sum(p.s)!=null?`<b style="font-size:13px;white-space:nowrap">kr ${kr2(sum(p.s))}</b>`:""}</button>`).join("")}</div>
   <button class="btn" data-toast="Opening directions in the maps app">${STORES[sel].n}: Directions</button>
   <p class="demo-note">Sample stores and distances in the prototype.</p>`;
  $("v-kart").querySelectorAll("[data-pin]").forEach(b=>b.onclick=()=>{ctx.mapSel=b.dataset.pin;const y=$("v-kart").scrollTop;R.kart();$("v-kart").scrollTop=y});
};

/* tips */
const TIPS=[
 {c:"Fridge",e:"🌡️",t:"Keep the fridge at 4 degrees",p:"That's where food lasts longest. A cheap fridge thermometer shows if it's right."},
 {c:"Fridge",e:"🥩",t:"Meat and fish at the bottom",p:"The bottom shelf is the coldest, and nothing drips onto other food."},
 {c:"Fridge",e:"↩️",t:"First in, first out",p:"Put new items at the back and the oldest at the front, so you eat them in the right order."},
 {c:"Fridge",e:"🥬",t:"Lettuce lasts longer with paper",p:"Put a paper towel in the bag or box. It soaks up moisture so the leaves don't go limp."},
 {c:"Counter & pantry",e:"🍌",t:"Keep bananas out of the fridge",p:"And away from apples. Apples and bananas give off a gas that makes other fruit ripen faster."},
 {c:"Counter & pantry",e:"🍅",t:"Tomatoes taste best at room temperature",p:"Keep them on the counter until they're ripe, then eat them soon after."},
 {c:"Counter & pantry",e:"🌿",t:"Herbs in a glass of water",p:"Put fresh herbs in a glass of water like a bouquet and they'll last for days."},
 {c:"Freezer",e:"🍞",t:"Freeze bread in slices",p:"Then you can take out one slice at a time and toast it straight from the freezer."},
 {c:"Freezer",e:"🏷️",t:"Label boxes with the date",p:"Write what it is and when you froze it. Then you know what to eat first."},
 {c:"Freezer",e:"🍌",t:"Freeze ripe fruit",p:"Brown bananas and soft berries are perfect for smoothies or banana bread."},
 {c:"Leftovers",e:"🥡",t:"Cool leftovers quickly",p:"Put leftovers in the fridge within a couple of hours, and eat them within a few days."},
 {c:"Leftovers",e:"📅",t:"Best before is not the same as use by",p:"Best before: look, smell and taste. Use by: don't eat the food after the date."}];
R.tips=()=>{const c=ctx.tipCat||"All";const L=TIPS.filter(t=>c==="All"||t.c===c);
  $("v-tips").innerHTML=`${navTop("Tips and tricks")}
   <p class="found">Smart<br><b>storage</b></p>
   <div class="cats">${["All","Fridge","Freezer","Counter & pantry","Leftovers"].map(k=>`<button class="cat" data-tc="${k}" aria-pressed="${k===c}">${k}</button>`).join("")}</div>
   <div class="stack">${L.map(t=>`<div class="tip"><span class="te">${t.e}</span><div><b>${t.t}</b><p>${t.p}</p><span class="tt">${t.c}</span></div></div>`).join("")}</div>`;
  $("v-tips").querySelectorAll("[data-tc]").forEach(b=>b.onclick=()=>{ctx.tipCat=b.dataset.tc;R.tips()});
};

/* member codes */
R.koder=()=>{const kg=S.log.filter(l=>l.ut==="brukt").reduce((s,l)=>s+l.kg,0);const goal=20;
  const C=[{s:"kiwi",v:"-20 %",t:"on fruit and veg",code:"LEFTLY20",til:"31 Oct"},{s:"rema",v:"-30 kr",t:"when you spend at least 300 kr",code:"SAVEFOOD30",til:"15 Nov"},{s:"meny",v:"2 for 1",t:"on bakery bread",code:"BREAD2FOR1",til:"20 Oct"},{s:"extra",v:"-25 %",t:"on frozen food",code:"",til:"",lock:true}];
  $("v-koder").innerHTML=`${navTop("Discount codes")}
   <div class="res-hero" style="flex-direction:column;align-items:stretch;gap:0"><div style="display:flex;gap:14px;align-items:center"><span class="ri">${ic("ticket",2)}</span><div><b>Member perks</b><span>You've saved ${kg.toFixed(1)} kg of food</span></div></div>
     <div class="prog"><span style="width:${Math.min(100,Math.round(100*kg/goal))}%"></span></div><span style="font-size:11.5px;margin-top:6px">${kg>=goal?"New code unlocked!":`${(goal-kg).toFixed(1)} kg to go until the next code`}</span></div>
   <div class="stack">${C.map(c=>`<div class="coupon ${c.lock?"locked":""}"><div class="cl" style="background:${STORES[c.s].c}">${c.v}<small>${STORES[c.s].n}</small></div><div class="cr"><b>${c.v} ${c.t}</b>${c.lock?`<span class="small muted" style="display:flex;gap:6px;align-items:center">${ic("lock").replace("<svg",'<svg style="width:14px;height:14px"')}Unlocks at ${goal} kg of food saved</span>`:`<span class="sb muted" style="font-size:11px">Valid until ${c.til}</span><span class="code">${c.code}<button data-code="${c.code}">Copy</button></span>`}</div></div>`).join("")}</div>
   <p class="demo-note">Sample codes in the prototype. Show the code at the checkout or use it in the store's app.</p>`;
  $("v-koder").querySelectorAll("[data-code]").forEach(b=>b.onclick=()=>{const c=b.dataset.code;try{navigator.clipboard.writeText(c).then(()=>toast(`${c} copied`),()=>toast(`The code is ${c}`))}catch(e){toast(`The code is ${c}`)}});
};

/* calendar */
R.kalender=()=>{const base=ctx.calMonth||new Date(today.getFullYear(),today.getMonth(),1);ctx.calMonth=base;
  const selIso=ctx.calSel||iso(0);const y=base.getFullYear(),mo=base.getMonth();
  const first=(new Date(y,mo,1).getDay()+6)%7,nd=new Date(y,mo+1,0).getDate();
  const isoOf=d=>`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const byDay={};S.items.forEach(i=>{(byDay[i.dato]=byDay[i.dato]||[]).push(i)});
  const col={bad:"var(--bad)",warn:"var(--warn)",ok:"var(--ok)"};
  let cells="";for(let i=0;i<first;i++)cells+=`<button class="ghost" tabindex="-1"></button>`;
  for(let d=1;d<=nd;d++){const k=isoOf(d),L=byDay[k]||[];const sts=[...new Set(L.map(i=>st(days(i.dato))))];
    cells+=`<button data-day="${k}" class="${k===iso(0)?"td":""} ${k===selIso?"sel":""}">${d}<span class="ds">${sts.slice(0,3).map(x=>`<i style="background:${k===selIso?"#fff":col[x]}"></i>`).join("")}</span></button>`}
  const L=(byDay[selIso]||[]);
  const week=S.items.filter(i=>{const d=days(i.dato);return d>=0&&d<7}).length;
  $("v-kalender").innerHTML=`${navTop("Calendar")}
   <div class="cal"><div class="cal-h"><button id="c-prev" aria-label="Previous month">${ic("chevl",2.4)}</button><b>${base.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</b><button id="c-next" aria-label="Next month">${ic("chev",2.4)}</button></div>
    <div class="cal-g">${["Mo","Tu","We","Th","Fr","Sa","Su"].map(w=>`<span class="wd">${w}</span>`).join("")}${cells}</div></div>
   <div class="legend" style="justify-content:center"><span><i style="background:var(--bad)"></i>Eat today</span><span><i style="background:var(--warn)"></i>Expiring soon</span><span><i style="background:var(--ok)"></i>Still fresh</span></div>
   <div class="sec-head"><h3>${new Date(selIso+"T00:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</h3><span class="small muted">${week} items expire this week</span></div>
   <div class="stack">${L.length?L.map(i=>`<button class="lcard" data-item="${i.id}" style="padding:10px 14px">${plate(emo(i.navn)).replace("plate ",'plate" style="width:44px;height:44px" data-x="').replace("<span>",'<span style="font-size:20px">')}<div class="mid"><div class="nm">${esc(i.navn)}</div><div class="sb">${i.plass} · ${i.type==="siste"?"Use by":"Best before"}</div></div>${pill(days(i.dato))}</button>`).join(""):'<div class="empty">Nothing expires on this day.</div>'}</div>`;
  $("v-kalender").querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{ctx.calSel=b.dataset.day;R.kalender()});
  $("c-prev").onclick=()=>{ctx.calMonth=new Date(y,mo-1,1);R.kalender()};$("c-next").onclick=()=>{ctx.calMonth=new Date(y,mo+1,1);R.kalender()};
};

/* settings */
R.settings=()=>{const g=S.settings;
  const sw=(k,t,sub)=>`<div class="set-row"><span>${t}${sub?`<small>${sub}</small>`:""}</span><button class="switch" role="switch" aria-checked="${!!g[k]}" data-sw="${k}" aria-label="${t}"></button></div>`;
  $("v-settings").innerHTML=`${navTop("Settings")}
   <div class="grp">Notifications</div>
   <div class="set-grp">${sw("push","Push notifications","When food is about to expire")}
    <div class="set-row"><span>Remind me<small>Days before the date</small></span><div class="seg" id="g-d">${[1,2,3,5].map(n=>`<button data-v="${n}" aria-pressed="${g.dager===n}" style="padding:5px 10px">${n}</button>`).join("")}</div></div>
    <div class="set-row"><span>Time<small>When the reminder arrives</small></span><input class="time-in" type="time" id="g-t" value="${g.tid}"></div>
    ${sw("ukentlig","Weekly summary","Every Sunday: what you saved and threw out")}</div>
   <div class="grp">Household and stores</div>
   <div class="set-grp">${sw("deling","Notify me when housemates add items")}${sw("tilbud","Show weekly deals","From stores nearby")}
    <button class="set-row" data-invite style="border:0;width:100%;text-align:left">Invite with QR code ${ic("chev").replace("<svg",'<svg style="width:15px;height:15px;color:var(--muted)"')}</button></div>
   <div class="grp">Account</div>
   <div class="set-grp"><div class="set-row">Language<span class="muted">English</span></div><button class="set-row" data-toast="The privacy policy will be in the finished app" style="border:0;width:100%;text-align:left">Privacy ${ic("chev").replace("<svg",'<svg style="width:15px;height:15px;color:var(--muted)"')}</button><button class="set-row" data-go="feedback" style="border:0;width:100%;text-align:left">Send feedback ${ic("chev").replace("<svg",'<svg style="width:15px;height:15px;color:var(--muted)"')}</button></div>
   <p class="demo-note">Leftly version 0.9 · school project on food waste</p>`;
  const el=$("v-settings");
  el.querySelectorAll("[data-sw]").forEach(b=>b.onclick=()=>{g[b.dataset.sw]=!g[b.dataset.sw];b.setAttribute("aria-checked",g[b.dataset.sw]);save()});
  segBind(el,"#g-d",v=>{g.dager=+v;save();toast(`Reminders ${v} ${v==1?"day":"days"} before the date`)});
  $("g-t").onchange=e=>{g.tid=e.target.value;save()};
};

/* feedback */
R.feedback=()=>{let stars=0,cat="Suggestion";
  const draw=()=>{$("v-feedback").innerHTML=`${navTop("Feedback")}
   <div class="illu" style="margin-top:0;width:110px;height:110px">${ic("chat",1.6)}</div><div class="hr"></div>
   <p class="red-title" style="font-size:19px">What do you think of Leftly?</p>
   <div class="stars">${[1,2,3,4,5].map(n=>`<button data-star="${n}" class="${n<=stars?"on":""}" aria-label="${n} stars">★</button>`).join("")}</div>
   <label class="lbl">What is it about?</label><div class="seg" id="f-c">${["Suggestion","Bug","Praise","Other"].map(c=>`<button data-v="${c}" aria-pressed="${c===cat}">${c}</button>`).join("")}</div>
   <textarea class="field" id="f-t" placeholder="Tell us what we could do better …"></textarea>
   <button class="btn" id="f-send">Send feedback</button>`;
   $("v-feedback").querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>{const t=$("f-t").value;stars=+b.dataset.star;draw();$("f-t").value=t});
   segBind($("v-feedback"),"#f-c",v=>cat=v);
   $("f-send").onclick=()=>{if(!stars&&!$("f-t").value.trim()){toast("Give a star or write a few words");return}
     $("v-feedback").innerHTML=`${navTop("Feedback")}<div class="illu red">${ic("check",2.6)}</div><div class="hr"></div><p class="red-title">Thank you!</p><p class="center muted small" style="margin:-8px 10px 0">Your feedback has been sent. We read everything and use it to make the app better.</p><button class="btn" data-tab="home" style="margin-top:auto">Back to Home</button>`}};
  draw();
};

/* drawer, sheet, toast */
function drawer(){
  const items=[["home","Home","home","tab"],["user","My profile","profile","tab"],["fridge","Food at home","varer","tab"],["pot","Recipes","recipes","tab"],["list","Shopping list","shop","tab"],["scan","Scan fridge","fridge","scan"],["tag","Weekly deals","tilbud","go"],["pin","Stores nearby","kart","go"],["cal","Calendar","kalender","go"],["bulb","Tips and tricks","tips","go"],["ticket","Discount codes","koder","go"],["chart","Savings","stats","tab"],["bell","Notifications","notif","go"]];
  $("layer").innerHTML=`<div class="drawer"><div class="panel"><div class="dr-user"><span class="av">N</span><div><div style="font-weight:600">Nora Strand</div><div style="font-size:11px;opacity:.85">nora.strand@example.com</div></div></div>
   ${items.map(([i,n,v,k],ix)=>`<button class="dr-item ${ix===0&&cur==="home"?"on":""}" data-${k}="${v}">${ic(i)}${n}</button>`).join("")}
   <div class="dr-sep"></div><button class="dr-item" data-go="settings">${ic("gear")}Settings</button><button class="dr-item" data-go="feedback">${ic("chat")}Send feedback</button><button class="dr-item" data-toast="Leftly – a school project on food waste">${ic("info")}About the app</button>
   <button class="dr-item" data-go="welcome" style="margin-top:auto">${ic("out")}Log out</button></div><button class="rest" aria-label="Close menu" id="dr-close"></button></div>`;
  $("dr-close").onclick=close;
}
function sheet(html,bind){$("layer").innerHTML=`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;bind&&bind($("layer").querySelector(".sheet"));$("scrim").addEventListener("click",e=>{if(e.target.id==="scrim")close()})}
function close(){$("layer").innerHTML=""}
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
let tt;function toast(m){document.querySelector(".toast")?.remove();const t=document.createElement("div");t.className="toast";t.textContent=m;$("app").appendChild(t);clearTimeout(tt);tt=setTimeout(()=>t.remove(),2400)}


/* drag to scroll sideways with a mouse */
(function(){let el=null,sx=0,sl=0,moved=false;
 document.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;const r=e.target.closest(".hscroll,.cats");if(!r||r.scrollWidth<=r.clientWidth)return;el=r;sx=e.clientX;sl=r.scrollLeft;moved=false});
 document.addEventListener("pointermove",e=>{if(!el)return;const dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;el.classList.add("dragging")}if(moved){el.scrollLeft=sl-dx;e.preventDefault()}});
 const end=()=>{if(el){el.classList.remove("dragging");el=null}};
 document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
 document.addEventListener("click",e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 document.addEventListener("dragstart",e=>{if(e.target.closest&&e.target.closest(".hscroll,.cats"))e.preventDefault()});
 document.addEventListener("wheel",e=>{const r=e.target.closest&&e.target.closest(".hscroll,.cats");if(!r||!e.shiftKey)return;r.scrollLeft+=e.deltaY;e.preventDefault()},{passive:false});
})();
show("splash",false);
setTimeout(()=>{if(cur==="splash")show("welcome",false)},1400);
})();
