import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Plus } from "lucide-react";
import { runwayItems, runwayLooks } from "../data/experienceData.js";
import { useCatalog } from "../hooks/useCatalog.js";

const modelOrder=[1,5,4,6,3,2];
const modelUrl=i=>`https://reel-ref-try-the-look.vercel.app/assets/model-${modelOrder[i]}-640.webp`;
const lookItems=[[0,3,4],[1,7,3],[5,1,3],[7,0,3],[4,1,3],[6,2,3]];
export default function RunwaySection({add}){
 const liveItems=useCatalog(runwayItems);
 const [index,setIndex]=useState(0),[saved,setSaved]=useState([]),[sizes,setSizes]=useState({});
 const look=runwayLooks[index],items=lookItems[index].map(id=>liveItems.find(p=>p.id===runwayItems[id].id)).filter(Boolean);
 const step=d=>setIndex(i=>(i+d+6)%6);
 return <section className="runway-section" id="runway">
  <div className="runway-heading"><div><span className="eyebrow">06 — TRY THE LOOK / RUNWAY</span><h2>Styled head to <i>toe.</i></h2></div><span>SIX LOOKS · ONE POINT OF VIEW</span></div>
  <div className="runway-feature"><div className="runway-model-stage"><div className="runway-models">{[-1,0,1].map(d=>{const i=(index+d+6)%6;return <button key={i} className={d===0?"runway-model active":"runway-model"} onClick={()=>setIndex(i)}><img src={modelUrl(i)} alt={runwayLooks[i].name}/></button>})}</div><div className="runway-model-overlay"><span>LOOK 0{index+1} / 06</span><button onClick={()=>setSaved(s=>s.includes(index)?s.filter(x=>x!==index):[...s,index])} aria-label="Save this look"><Heart fill={saved.includes(index)?"currentColor":"none"}/></button></div><div className="runway-controls"><button onClick={()=>step(-1)}><ArrowLeft/></button><div><span style={{width:`${(index+1)/6*100}%`}}/></div><button onClick={()=>step(1)}><ArrowRight/></button></div></div>
  <aside className="runway-details"><small>THE EDIT · 0{index+1}</small><h3>{look.name}</h3><p>{look.description}</p><div className="runway-products">{items.map(p=><div className="runway-product" key={p.id}><img src={p.image} alt={p.name}/><div><b>{p.name}</b><small>{p.collection}</small><span>${p.price}.00</span></div><div className="runway-size-add"><select aria-label={`Size for ${p.name}`} value={sizes[p.id]||p.sizes[0]} onChange={e=>setSizes(old=>({...old,[p.id]:e.target.value}))}>{p.sizes.map(size=><option key={size} value={size}>{size}</option>)}</select><button disabled={p.isActive===false} onClick={()=>add({...p,size:sizes[p.id]||p.sizes[0]})} aria-label={`Add ${p.name}`}><Plus size={16}/></button></div></div>)}</div><div className="runway-bundle"><div><span>Complete the look</span><small>Bundle all 3 and save 10%</small></div><div><s>$547.00</s><b>$492.30</b></div></div><button className="dark-button runway-add" disabled={!items.every(p=>p.isActive!==false)} onClick={()=>items.forEach(p=>add({...p,size:sizes[p.id]||p.sizes[0]}))}>Add full look to bag <ArrowRight size={15}/></button><small className="runway-note">Reference bundle price shown. Bag items are added at their listed catalogue prices.</small></aside></div>
 </section>;
}
