import { useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { offcutItems } from "../data/experienceData.js";

const SHEET="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261107_130252_7b1b8485-d5c5-440c-8921-f5ae01054c6a.png&w=2048&q=90";
function cropStyle(index,width=210,height=270){
  const sx=width/509.6,sy=height/530,col=index%5,row=Math.floor(index/5),x=col*409.6-50,y=row===0?80:700;
  return {backgroundImage:`url("${SHEET}")`,backgroundRepeat:"no-repeat",backgroundSize:`${2048*sx}px ${1360*sy}px`,backgroundPosition:`${-x*sx}px ${-y*sy}px`};
}
export default function OffcutSection({add}){
  const [active,setActive]=useState(null),[hover,setHover]=useState(null);
  const item=hover===null?null:offcutItems[hover];
  const step=d=>{const next=(active+d+offcutItems.length)%offcutItems.length;setActive(next);setHover(next)};
  return <section className="offcut-section" id="offcut">
    <div className="offcut-head"><div><span className="eyebrow">03 — OFFCUT STREETWEAR</span><h2>Made to <i>stand apart.</i></h2></div><span className="offcut-side-note">NO RESTOCKS. NO COMPROMISES.</span></div>
    <div className="offcut-rail">
      <div className="offcut-chrome"/>
      {offcutItems.map((p,i)=><button key={p.id} className="offcut-garment" style={{left:`${5+i*10}%`}} onMouseEnter={()=>setHover(i)} onFocus={()=>setHover(i)} onClick={()=>setActive(i)} aria-label={`View ${p.name}`}><span className="offcut-art" style={cropStyle(i)}/></button>)}
    </div>
    <div className="offcut-caption"><span>{item?item.name:"THE OFFCUT COLLECTION"}</span><span>{item?`€${item.price}`:"TEN PIECES · LIMITED EDITION"}</span></div>
    <div className="offcut-bottom"><span>SELECT A GARMENT TO DISCOVER</span><button className="offcut-view" onClick={()=>setActive(active===null?0:active)}>VIEW THE COLLECTION <ArrowRight size={14}/></button></div>
    {item&&<div className="offcut-detail"><button className="offcut-close" onClick={()=>setActive(null)} aria-label="Close"><X size={17}/></button><button className="offcut-step prev" onClick={()=>step(-1)} aria-label="Previous"><ArrowLeft/></button><div className="offcut-detail-art" style={cropStyle(active,360,430)}/><div className="offcut-detail-copy"><small>OFFCUT / 0{active+1} — 10</small><h3>{item.name}</h3><strong>€{item.price}</strong><p>Independent streetwear. Considered form, unapologetic character.</p><button className="light-button" onClick={()=>add(item)}>Add to bag <ArrowRight size={15}/></button></div><button className="offcut-step next" onClick={()=>step(1)} aria-label="Next"><ArrowRight/></button></div>}
    <div className="offcut-marquee">OFFCUT — BUILT DIFFERENT — OFFCUT — BUILT DIFFERENT — OFFCUT — BUILT DIFFERENT —</div>
  </section>;
}
