import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Heart, Plus, RotateCcw, RotateCw, Sparkles } from "lucide-react";
import { useCatalog } from "../hooks/useCatalog.js";

const BASE="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F";
const files=[
"hf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png",
"hf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png",
"hf_20261112_034742_9a8a92fd-79ae-4163-9ffa-14ae2a68717f.png",
"hf_20261112_034735_4e352e03-ad2b-44d1-9fcf-4b5b9454dc55.png",
"hf_20261112_034738_aeb8ea57-6399-4f3c-b54a-4a57d0bd971e.png",
"hf_20261112_034736_aace5c5f-8c14-4b00-83ba-744dbad2e337.png",
"hf_20261112_034735_3d9fb69e-b4e0-49f7-a2d4-e592bd616c27.png",
"hf_20261112_034740_3e3c5ad7-689b-46a2-8e09-c7d36a569b9c.png"
];
const names=["Denim Maxi","Cloud Set","Library Knit","Lilac Run","Satin Night","Night Suit","Sage Slip","Bomber Cargo"];
const groups=[
{tops:[["Ribbed crop tank","Charcoal",38]],bottoms:[["Washed denim maxi skirt","Light wash",96]],shoes:[["Knee-high leather boots","Black",210]],acc:[["Leather belt","Black",42],["Gold hoops","14k",64]]},
{tops:[["Half-zip sweatshirt","Oat",74]],bottoms:[["Wide sweatpants","Oat",68]],shoes:[["Chunky sneakers","White",120]],acc:[["Gold hoops","14k",64]]},
{tops:[["Cable-knit cardigan","Cream",112],["Cotton tee","White",24]],bottoms:[["Pleated wide trousers","Heather grey",98]],shoes:[["Penny loafers","Brown",150]],acc:[]},
{tops:[["Zip training jacket","Lilac",88],["Sports crop top","Lilac",44]],bottoms:[["High-rise leggings","Lilac",72]],shoes:[["Running sneakers","White",140]],acc:[]},
{tops:[["Satin pyjama shirt","Powder blue",66]],bottoms:[["Satin pyjama trousers","Powder blue",58]],shoes:[["Fluffy slippers","Ivory",34]],acc:[]},
{tops:[["Oversized blazer","Black",240],["Silk camisole","Ivory",82]],bottoms:[["Straight suit trousers","Black",160]],shoes:[["Pointed heels","Black",190]],acc:[]},
{full:[["Satin slip midi dress","Sage",180]],shoes:[["Strappy sandals","Silver",130]],acc:[["Fine chain necklace","Silver",56]]},
{tops:[["Leather bomber","Black",260],["Crop tee","White",22]],bottoms:[["Parachute cargo pants","Khaki",94]],shoes:[["Platform sneakers","Black",150]],acc:[]}
];
const categories=["All","Everyday","Athletic","Sleep","Formal","Party","Street"];
const categoryFor=["Everyday","Everyday","Everyday","Athletic","Sleep","Formal","Party","Street"];
const tabs=["DNA","BODY","STYLE","PERSONALITY","STORY"];
const traits=["Curious","Bold","Calm","Witty","Romantic","Driven","Playful","Gentle","Creative","Loyal"];
const identities=[["Han Seo-yeon",23,"Seoul","14",423],["Kim Ha-eun",22,"Busan","17",437],["Yoon Ji-woo",25,"Seoul","12",474],["Park Min-ji",24,"Incheon","13",511],["Lee Soo-ah",21,"Daegu","15",548]];
const filterStyles={Original:"none",Warm:"sepia(.16) saturate(1.2)",Mono:"grayscale(1)",Soft:"saturate(.72) brightness(1.08)",Cool:"hue-rotate(14deg) saturate(.9)"};
const vellCatalogFallback=[
 ...names.map((name,i)=>({id:`vell-${i}`,name,price:Object.values(groups[i]).flat().reduce((sum,p)=>sum+p[2],0),currency:"USD",collection:"VELL Studio",image:""})),
 ...groups.flatMap((look,i)=>Object.entries(look).flatMap(([key,items])=>items.map((p,j)=>({id:`vell-piece-${i}-${key}-${j}`,name:p[0],price:p[2],currency:"USD",collection:"VELL Studio",image:""}))))
];
function DnaHelix(){
 const [time,setTime]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setTime(t=>t+.03),32);return()=>window.clearInterval(timer)},[]);
 const rungs=Array.from({length:26},(_,i)=>{const x=10+i*11,depth=(Math.cos(i*.42+time)+1)/2,offset=Math.sin(i*.42+time)*38;return {x,y1:60+offset,y2:60-offset,depth}});
 return <svg className="vell-dna-helix" viewBox="0 0 300 120" role="img" aria-label="Animated character DNA helix">{rungs.map((r,i)=><g key={i} opacity={.4+r.depth*.6}><line x1={r.x} y1={r.y1} x2={r.x} y2={r.y2} stroke="white" strokeOpacity={.15+r.depth*.25} strokeWidth="1.2"/><circle cx={r.x} cy={r.y1} r={2+r.depth*2.4} fill="white"/><circle cx={r.x} cy={r.y2} r={2+r.depth*2.4} fill="white" opacity=".7"/></g>)}</svg>;
}
const tuneData={
 Face:{presets:["Soft","Defined","Natural","Sculpted"],sliders:[["Smile",35],["Jawline",50],["Freckles",10]]},
 Hair:{presets:["High bun","Low bun","Long straight","Bob","Ponytail"],sliders:[["Volume",60],["Shine",70]]},
 Makeup:{presets:["No-makeup","Glass skin","Soft glam","Editorial"],sliders:[["Blush",30],["Lip tint",45],["Glow",55]]},
 Accessories:{presets:["Gold hoops","Silver chain","Shoulder bag","Sunglasses","Watch","Hair clip"],sliders:[]},
 Tattoos:{presets:["None","Fine line","Floral","Script","Minimal dots"],sliders:[["Opacity",40]]},
 Details:{presets:["Studio","Natural","Cinematic"],sliders:[["Skin texture",70],["Fabric detail",80],["Lighting softness",60]]}
};
export default function VellStudio({add}){
 const liveCatalog=useCatalog(vellCatalogFallback);
 const productById=useMemo(()=>new Map(liveCatalog.map(p=>[p.id,p])),[liveCatalog]);
 const priceFor=(id,fallback)=>productById.get(id)?.price??fallback;
 const nameFor=(id,fallback)=>productById.get(id)?.name??fallback;
 const [look,setLook]=useState(0),[identityIndex,setIdentityIndex]=useState(0),[tab,setTab]=useState("STYLE"),[category,setCategory]=useState("All"),[view,setView]=useState("Outfits"),[realism,setRealism]=useState(75),[height,setHeight]=useState(168),[build,setBuild]=useState(50),[filter,setFilter]=useState("Original"),[traitsOn,setTraitsOn]=useState(["Curious","Creative","Gentle"]),[saved,setSaved]=useState([]),[favourites,setFavourites]=useState([]),[open,setOpen]=useState("tops"),[framing,setFraming]=useState("Full body"),[history,setHistory]=useState([{look:0,realism:75,height:168,build:50}]),[historyAt,setHistoryAt]=useState(0),[scan,setScan]=useState(false),[tuneValues,setTuneValues]=useState({}),[tuneSelected,setTuneSelected]=useState({Accessories:["Gold hoops"]});
 const identity=identities[identityIndex];
 const image=i=>`${BASE}${files[i]}&w=1000&q=85`;
 const commit=next=>{const copy=[...history.slice(0,historyAt+1),next];setHistory(copy);setHistoryAt(copy.length-1)};
 const pick=i=>{if(i===look)return;setLook(i);commit({look:i,realism,height,build});setScan(true);window.setTimeout(()=>setScan(false),1100)};
 const apply=s=>{setLook(s.look);setRealism(s.realism);setHeight(s.height);setBuild(s.build);setScan(true);window.setTimeout(()=>setScan(false),1100)};
 const undo=()=>{if(historyAt>0){setHistoryAt(historyAt-1);apply(history[historyAt-1])}};
 const redo=()=>{if(historyAt<history.length-1){setHistoryAt(historyAt+1);apply(history[historyAt+1])}};
 const total=useMemo(()=>priceFor(`vell-${look}`,Object.values(groups[look]).flat().reduce((sum,p)=>sum+p[2],0)),[look,productById]);
 const allLooks=(category==="All"?names.map((_,i)=>i):names.map((_,i)=>i).filter(i=>categoryFor[i]===category)).filter(i=>productById.get(`vell-${i}`)?.isActive!==false);
 const addPiece=(key,j,p)=>{const id=`vell-piece-${look}-${key}-${j}`,product=productById.get(id);if(product?.isActive===false)return;add({id,name:product?.name||p[0],price:product?.price??p[2],currency:product?.currency||"USD",collection:"VELL Studio",image:image(look)})};
 const addLook=()=>{const product=productById.get(`vell-${look}`);if(product?.isActive===false)return;add({id:`vell-${look}`,name:product?.name||names[look],price:product?.price??total,currency:product?.currency||"USD",collection:"VELL Studio",image:image(look)})};
 const toggleTrait=t=>setTraitsOn(old=>old.includes(t)?old.filter(x=>x!==t):old.length===3?[...old.slice(1),t]:[...old,t]);
 const save=()=>setSaved(old=>old.includes(look)?old:[...old,look]);
 const reset=()=>{const base={look:0,realism:75,height:168,build:50};setLook(0);setRealism(75);setHeight(168);setBuild(50);setFraming("Full body");commit(base)};
 return <div className="vell-studio">
  <div className="vell-scene" style={{backgroundImage:`linear-gradient(90deg,#20242a55,#20242a22),url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034551_6394b127-5366-40a8-9c82-3c416f1161f1.png&w=2400&q=85")`}}/>
  <div className="vell-top"><div className="vell-brand">VELL <small>CREATE A VELL</small></div><nav>{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>{setTab(t);setView(t==="STYLE"?"Outfits":t)}}>{t}</button>)}</nav><div className="vell-top-actions"><button onClick={()=>setFavourites(old=>old.includes(look)?old.filter(x=>x!==look):[...old,look])}><Heart fill={favourites.includes(look)?"white":"none"}/><span>{favourites.length}</span></button><button onClick={save}><Bookmark/><span>{saved.length}</span></button></div></div>
  <div className="vell-profile"><div className="vell-avatar" style={{backgroundImage:`url("${image(look)}")`}}/><div><b>{identity[0]}</b><small>{identity[1]} <i/> {identity[2]}, KR <i/> ☁ {identity[3]}°C</small></div><button onClick={()=>{setIdentityIndex(i=>(i+1)%identities.length);pick((look+1)%8)}}><Sparkles size={15}/></button></div>
  <div className="vell-character" key={look}><img src={image(look)} alt={names[look]} style={{filter:`saturate(${1+Math.max(0,(80-realism)/80)*.9}) contrast(${1+Math.max(0,(80-realism)/80)*.25}) blur(${Math.max(0,(80-realism)/80)*1.4}px) brightness(${1+Math.max(0,(80-realism)/80)*.05}) ${filterStyles[filter]||"none"}`,transform:`scaleX(${.965+build/1500}) scaleY(${.96+(height-168)/600})`}}/><span className="vell-look-tag">LOOK 0{look+1} — {names[look].toUpperCase()}</span>{scan&&<div className="vell-scan"/>}</div>
  <aside className="vell-side-menu">{["Face","Hair","Makeup","Body","Outfits","Accessories","Tattoos","Details"].map(v=><button key={v} className={view===v||view==="Outfits"&&v==="Outfits"?"active":""} onClick={()=>{setView(v);setTab(v==="Body"?"BODY":"STYLE")}}>{v}</button>)}</aside>
  <div className="vell-panel">
   <div className="vell-panel-head"><div><small>VELL CHARACTER STUDIO</small><h3>{tab==="STYLE"?"OUTFITS":tab}</h3></div><span>{tab==="STYLE"?"08 LOOKS":tab==="PERSONALITY"?"PICK UP TO 3":"YOUR CHARACTER"}</span></div>
   {tab==="STYLE"&&view==="Outfits"?<>
    <div className="vell-categories">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="vell-grid">{allLooks.map(i=><button key={i} className={look===i?"selected":""} onClick={()=>pick(i)} onDoubleClick={()=>setFavourites(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])}><img src={image(i).replace("w=1000","w=360")} alt={names[i]}/><span>{nameFor(`vell-${i}`,names[i])}</span>{favourites.includes(i)&&<Heart size={13} fill="white"/>}</button>)}</div>
    <div className="vell-accordion">{["tops","bottoms","full","shoes","acc"].map(key=>{const items=groups[look][key]||[];const label={tops:"TOPS",bottoms:"BOTTOMS",full:"FULL BODY",shoes:"SHOES",acc:"ACCESSORIES"}[key];return <div key={key}><button onClick={()=>setOpen(open===key?"":key)}>{label} <span>· {items.length}</span><b>{open===key?"−":"+"}</b></button>{open===key&&<div className="vell-piece-list">{items.length?items.map((p,j)=><div key={p[0]}><span>{p[0]}<small>{p[1]}</small></span><b>${priceFor(`vell-piece-${look}-${key}-${j}`,p[2])}</b><button disabled={productById.get(`vell-piece-${look}-${key}-${j}`)?.isActive===false} onClick={()=>addPiece(key,j,p)} aria-label={`Add ${p[0]}`}><Plus size={13}/></button></div>):<small>Nothing in this look</small>}</div>}</div>})}</div>
   </>:tab==="BODY"?<div className="vell-tune"><label>Height <b>{height} cm</b><input type="range" min="150" max="185" value={height} onChange={e=>setHeight(+e.target.value)} onMouseUp={()=>commit({look,realism,height,build})}/></label><label>Build <b>{build}</b><input type="range" min="0" max="100" value={build} onChange={e=>setBuild(+e.target.value)} onMouseUp={()=>commit({look,realism,height,build})}/></label><div className="vell-choice"><span>POSTURE</span>{["Relaxed","Confident","Editorial"].map(v=><button key={v}>{v}</button>)}</div><div className="vell-choice"><span>FRAMING</span>{["Full body","Mid shot","Portrait"].map(v=><button className={framing===v?"active":""} onClick={()=>setFraming(v)} key={v}>{v}</button>)}</div></div>
   :tab==="STYLE"?<div className="vell-tune"><p>{view} · changes re-render the model</p><div className="vell-traits">{(tuneData[view]?.presets||[]).map(p=><button key={p} className={(tuneSelected[view]||[]).includes(p)?"active":""} onClick={()=>{setTuneSelected(old=>({...old,[view]:view==="Accessories"?((old[view]||[]).includes(p)?old[view].filter(x=>x!==p):[...(old[view]||[]),p]):[p]}));setScan(true);window.setTimeout(()=>setScan(false),1050)}}>{p}</button>)}</div>{(tuneData[view]?.sliders||[]).map(([name,initial])=><label key={name}>{name}<b>{tuneValues[name]??initial}</b><input type="range" min="0" max="100" value={tuneValues[name]??initial} onChange={e=>setTuneValues(old=>({...old,[name]:+e.target.value}))} onMouseUp={()=>{setScan(true);window.setTimeout(()=>setScan(false),1050)}}/></label>)}</div>:tab==="DNA"?<div className="vell-tune"><div className="vell-dna-code">VL-0{identity[4]}-KR</div><p>Character DNA · Registered model profile</p><DnaHelix/><div className="vell-dna-grid"><span>FACE SHAPE<b>Soft oval</b></span><span>HAIR<b>High messy bun</b></span><span>DETAIL<b>Gold hoops</b></span><span>ORIGIN<b>{identity[2]}, KR</b></span></div></div>
   :tab==="PERSONALITY"?<div className="vell-tune"><p>Choose up to three traits for your character.</p><div className="vell-traits">{traits.map(t=><button key={t} className={traitsOn.includes(t)?"active":""} onClick={()=>toggleTrait(t)}>{t}</button>)}</div><div className="vell-radar"><span>OPENNESS</span><span>ENERGY</span><span>WARMTH</span><span>FOCUS</span><span>HUMOUR</span><div/></div></div>
   :<div className="vell-tune"><p className="vell-story">{identity[0]} is {height} cm of {traitsOn[0]||"creative"} energy from {identity[2]}. Mornings start with a long walk along the river in her {names[look].toLowerCase()} look; friends call her {traitsOn[1]||"gentle"} and a little {traitsOn[2]||"curious"}. She collects film cameras, keeps a sketchbook of strangers' outfits, and is saving for a studio of her own.</p><button className="vell-reset" onClick={()=>setTraitsOn(["Curious","Creative","Gentle"])}>Rewrite story</button></div>}
  </div>
  <div className="vell-bottom"><button disabled={historyAt===0} onClick={undo}><RotateCcw size={15}/> UNDO</button><button disabled={historyAt===history.length-1} onClick={redo}><RotateCw size={15}/> REDO</button><button onClick={()=>setFraming(f=>f==="Full body"?"Mid shot":f==="Mid shot"?"Portrait":"Full body")}>POSE · {framing==="Full body"?"FULL":framing==="Mid shot"?"MID":"PORTRAIT"}</button><button onClick={reset}>RESET</button><label>REALISM <input type="range" min="0" max="100" value={realism} onChange={e=>setRealism(+e.target.value)}/><span>{realism}</span></label><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Original</option><option>Warm</option><option>Mono</option><option>Soft</option><option>Cool</option></select><div className="vell-filter-thumbs">{["Original","Warm","Mono","Soft","Cool"].map((f,i)=><button key={f} title={f} className={filter===f?"active":""} onClick={()=>setFilter(f)} style={{backgroundImage:`url("${image(look)}")`,filter:filterStyles[f],backgroundSize:"121px 182px",backgroundPosition:"-44px -4px"}}/>)}</div><button className="vell-save" onClick={save}><Check size={14}/> SAVE TO LIBRARY</button><button className="vell-add" onClick={addLook} disabled={productById.get(`vell-${look}`)?.isActive===false}>ADD FULL LOOK · ${total}</button></div>
 </div>;
}
