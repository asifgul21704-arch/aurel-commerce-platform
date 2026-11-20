import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { fitItems } from "../data/experienceData.js";

const ROOM="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080623_c94c85a3-23d5-4a0c-afff-41be1b5b8191.png&w=2400&q=85";
const MODEL="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080717_e02cb856-b812-4c9b-9b86-8a741c7f65eb.png&w=2688&q=85";
const GARMENT="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261104_080719_f5a4cca2-cf42-4957-ab3b-ddec34d2b71a.png&w=2048&q=85";
export default function VirtualFitSection({add}){
  const [index,setIndex]=useState(0),[size,setSize]=useState("M"),[colour,setColour]=useState(0),[tab,setTab]=useState("TRY ON");
  const item=fitItems[index],modelStyle={backgroundImage:`url("${MODEL}")`,backgroundSize:"513% 111.76%",backgroundPosition:`${item.model}% 100%`};
  const garmentStyle={backgroundImage:`url("${GARMENT}")`,backgroundSize:"320% 212.5%",backgroundPosition:`${item.garment[0]}% ${item.garment[1]}%`};
  const change=d=>{setIndex(i=>(i+d+fitItems.length)%fitItems.length);setColour(0)};
  return <section className="virtualfit-section" id="virtualfit" style={{backgroundImage:`linear-gradient(90deg,rgba(35,34,31,.18),rgba(35,34,31,.02)),url("${ROOM}")`}}>
    <div className="vf-top"><span>04 — VIRTUALFIT / SPATIAL TRY-ON</span><div>{["TRY ON","COLLECTION","ABOUT"].map(t=><button className={tab===t?"active":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div></div>
    <div className="vf-ghost">FIT</div><div className="vf-copy"><span>YOUR FIT, REIMAGINED</span><h2>See it.<br/><i>Feel it.</i></h2><p>Five essentials. One seamless fitting room. Explore the silhouette before it becomes yours.</p></div>
    <div className="vf-model-wrap"><div className="vf-model" style={modelStyle}/><div className="vf-scan"/></div>
    <div className="vf-arc">{[-2,-1,0,1,2].map(offset=>{const idx=(index+offset+fitItems.length)%fitItems.length;const p=fitItems[idx];return <button key={p.id} className={offset===0?"vf-card selected":"vf-card"} style={{"--offset":offset,"--depth":Math.abs(offset)}} onClick={()=>setIndex(idx)}><span className="vf-card-art" style={{backgroundImage:`url("${GARMENT}")`,backgroundSize:"320% 212.5%",backgroundPosition:`${p.garment[0]}% ${p.garment[1]}%`}}/><small>{p.name}</small></button>})}</div>
    <div className="vf-buy"><div className="vf-thumb" style={garmentStyle}/><div className="vf-product"><small>SELECTED PIECE</small><strong>{item.name}</strong><span>${item.price}.00 USD</span></div><div className="vf-options"><small>SIZE</small><div className="vf-sizes">{["S","M","L","XL"].map(s=><button className={size===s?"active":""} key={s} onClick={()=>setSize(s)}>{s}</button>)}</div></div><div className="vf-options"><small>COLOUR · {item.colors[colour][0]}</small><div className="vf-colours">{item.colors.map(([name,hex],i)=><button key={name} title={name} onClick={()=>setColour(i)} className={colour===i?"active":""} style={{background:hex}}/>)}</div></div><button className="vf-add" onClick={()=>add({...item,name:`${item.name} · ${item.colors[colour][0]} · Size ${size}`})}>ADD TO BAG <ArrowRight size={15}/></button></div>
    <div className="vf-arrows"><button onClick={()=>change(-1)} aria-label="Previous"><ArrowLeft/></button><span>0{index+1} / 05</span><button onClick={()=>change(1)} aria-label="Next"><ArrowRight/></button></div>
  </section>;
}
