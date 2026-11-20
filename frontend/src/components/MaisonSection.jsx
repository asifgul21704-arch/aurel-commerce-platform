import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { maisonItems, maisonLooks } from "../data/experienceData.js";

const MODELS="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85";
const PIECES="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85";
const modelBoxes=[[12,176],[178,330],[331,470],[476,633],[634,767],[767,956]];
const pieceBoxes=[[26,224,28,214],[304,412,22,236],[530,666,12,242],[752,922,100,146],[70,176,246,466],[294,422,294,432],[508,688,240,452],[780,890,252,466],[64,178,484,698],[316,396,482,698],[530,672,508,682],[754,916,484,700]];
function Sprite({src,box,viewBox}){return <svg viewBox={viewBox} preserveAspectRatio="xMidYMax meet"><image href={src} width={box[0]} height={box[1]}/></svg>}
export default function MaisonSection({add}){
 const [index,setIndex]=useState(0),look=maisonLooks[index],model=modelBoxes[index];
 const prev=()=>setIndex(i=>(i+5)%6),next=()=>setIndex(i=>(i+1)%6);
 return <section className="maison-section" id="maison">
  <div className="maison-header"><span>05 — MAISON VELL / RUNWAY DEPTH LOOKBOOK</span><span>SPRING / SUMMER 2027</span></div>
  <div className="maison-main"><div className="maison-stage"><div className="maison-stage-title"><small>THE NEW COLLECTION</small><h2>Softness &<br/><i>strength.</i></h2><p>A study in modern silhouettes, delicate textures and considered details.</p></div><div className="maison-model"><svg viewBox={`${model[0]} 48 ${model[1]-model[0]} 448`} preserveAspectRatio="xMidYMax meet"><image href={MODELS} width="960" height="540"/></svg></div><div className="maison-index"><span>LOOK</span><strong>0{index+1}</strong><span>/ 06</span><div><button onClick={prev}><ArrowLeft/></button><button onClick={next}><ArrowRight/></button></div></div></div>
  <aside className="maison-rail"><div className="maison-look-heading"><small>THE LOOKBOOK</small><h3>{look.name}</h3><p>{look.description}</p></div><div className="maison-piece-grid">{look.items.map(id=>{const p=maisonItems[id],b=pieceBoxes[id];return <article key={p.id} className="maison-piece"><div><svg viewBox={`${b[0]} ${b[2]} ${b[1]-b[0]} ${b[3]-b[2]}`}><image href={PIECES} width="960" height="720"/></svg></div><small>MAISON VELL</small><b>{p.name}</b><span>${p.price.toLocaleString("en-US")}</span><button onClick={()=>add(p)}>ADD TO BAG <ArrowRight size={12}/></button></article>})}</div><div className="maison-rail-foot"><span>CURATED PIECES · {look.items.length}</span><span>01 — 06</span></div></aside></div>
 </section>;
}
