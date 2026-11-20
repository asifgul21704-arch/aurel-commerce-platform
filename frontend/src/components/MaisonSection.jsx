import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Plus } from "lucide-react";
import { maisonItems } from "../data/experienceData.js";

const MODELS="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042056_1a704ff7-b0e5-4a9f-bbda-62392b819fb6.png&w=3840&q=85";
const PIECES="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_042057_080e85b0-b4aa-4072-8eb9-2304c7baf42b.png&w=2400&q=85";
const LOOKS=[[12,176],[178,330],[331,470],[476,633],[634,767],[767,956]];
const PIECE_BOXES=[[26,224,28,214],[304,412,22,236],[530,666,12,242],[752,922,100,146],[70,176,246,466],[294,422,294,432],[508,688,240,452],[780,890,252,466],[64,178,484,698],[316,396,482,698],[530,672,508,682],[754,916,484,700]];
const KX=[1.2,.744,.496,.346,.235,.15,.085],KF=[1.14,.89,.777,.704,.651,.616,.59],KH=[1.18,.832,.574,.436,.334,.258,.19],KB=[0,0,1.5,4,8,12,17],KO=[1,1,1,1,.86,.5,0];
const groups=[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11]];
const mod=(n,m)=>((n%m)+m)%m;
function sample(table,d){const v=Math.max(-1,Math.min(5,d)),lo=Math.floor(v)+1,hi=Math.min(6,lo+1),t=v-Math.floor(v);return table[lo]*(1-t)+table[hi]*t}
function depthFor(i,p){return mod(i-p+1,6)-1}
function PieceImage({index}){
 const b=PIECE_BOXES[index];
 return <svg viewBox={`${b[0]} ${b[2]} ${b[1]-b[0]} ${b[3]-b[2]}`} preserveAspectRatio="xMidYMid meet"><svg x="0" y="0" width="960" height="720" viewBox="0 0 960 720"><image href={PIECES} width="960" height="720"/></svg></svg>;
}
export default function MaisonSection({add}){
 const stageRef=useRef(null),positionRef=useRef(0),targetRef=useRef(0),dragRef=useRef(null),wheelTimer=useRef(null);
 const [position,setPosition]=useState(0),[stageSize,setStageSize]=useState({width:900,height:620}),[saved,setSaved]=useState([]);
 const current=mod(Math.round(position),6),lookNumber=15+current,lookItems=groups[current].map(i=>maisonItems[i]);
 useEffect(()=>{
  const node=stageRef.current;if(!node)return;
  const measure=()=>{const r=node.getBoundingClientRect();setStageSize({width:r.width,height:r.height})};
  measure();const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  let raf,last=performance.now();
  const tick=now=>{const dt=Math.min(50,now-last);last=now;const p=positionRef.current,t=targetRef.current;const next=p+(t-p)*(1-Math.exp(-dt*.0072));positionRef.current=Math.abs(t-next)<.0004?t:next;setPosition(positionRef.current);if(Math.abs(t-positionRef.current)>.0004)raf=requestAnimationFrame(tick);else raf=null};
  const ensure=()=>{if(raf===null)raf=requestAnimationFrame(tick)};
  let raf=null;ensure();const timer=setInterval(ensure,40);
  return()=>{clearInterval(timer);if(raf!==null)cancelAnimationFrame(raf)};
 },[]);
 const step=d=>{targetRef.current=Math.round(targetRef.current+d)};
 const pointerDown=e=>{if(e.button!==0)return;dragRef.current={x:e.clientX,start:targetRef.current};e.currentTarget.setPointerCapture(e.pointerId)};
 const pointerMove=e=>{if(!dragRef.current)return;const dx=e.clientX-dragRef.current.x;targetRef.current=dragRef.current.start+dx/Math.max(150,stageSize.width*.2)};
 const pointerUp=()=>{if(!dragRef.current)return;targetRef.current=Math.round(targetRef.current);dragRef.current=null};
 const wheel=e=>{e.preventDefault();targetRef.current+=Math.max(-120,Math.min(120,e.deltaY+e.deltaX))/420;clearTimeout(wheelTimer.current);wheelTimer.current=setTimeout(()=>{targetRef.current=Math.round(targetRef.current)},150)};
 const key=e=>{if(["ArrowRight","ArrowDown"].includes(e.key)){e.preventDefault();step(1)}if(["ArrowLeft","ArrowUp"].includes(e.key)){e.preventDefault();step(-1)}};
 const modelNodes=LOOKS.map((box,i)=>{const d=depthFor(i,position),x=sample(KX,d),feet=sample(KF,d),h=stageSize.height*sample(KH,d),blur=sample(KB,d),opacity=sample(KO,d),ratio=(box[1]-box[0])/448;return {i,d,x,feet,h,w:h*ratio,blur,opacity}});
 return <section className="maison-section" id="maison">
  <div className="maison-header"><span>05 — MAISON VELL / RUNWAY DEPTH LOOKBOOK</span><span>SPRING / SUMMER 2027</span></div>
  <div className="maison-main"><div className="maison-stage" ref={stageRef} tabIndex={0} onKeyDown={key} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onWheel={wheel}>
   <div className="maison-stage-title"><small>SPRING SUMMER 2027</small><h2>Softness &<br/><i>strength.</i></h2><p>A study in softness and strength. The new season collection blends delicate textures and modern silhouettes, crafted for a more beautiful tomorrow.</p></div>
   {modelNodes.map(m=><button key={m.i} className="maison-model" style={{left:`${m.x*100}%`,top:`${m.feet*100}%`,width:`${m.w}px`,height:`${m.h}px`,opacity:m.opacity,filter:`blur(${m.blur}px)`,zIndex:100-Math.round(m.d*10),pointerEvents:m.opacity<.05?"none":"auto"}} onClick={()=>{targetRef.current=position+m.d}} aria-label={`View Look ${15+m.i}`}><svg viewBox={`${LOOKS[m.i][0]} 48 ${LOOKS[m.i][1]-LOOKS[m.i][0]} 448`} preserveAspectRatio="xMidYMax meet"><image href={MODELS} width="960" height="540"/></svg></button>)}
   <div className="maison-look-number"><span>LOOK</span><strong>{lookNumber}</strong><small>/ 20</small><a href="#maison-rail">SHOP THE LOOK</a></div>
   <div className="maison-arrows"><button onClick={()=>step(-1)} aria-label="Previous look"><ArrowLeft/></button><button onClick={()=>step(1)} aria-label="Next look"><ArrowRight/></button></div>
  </div>
  <aside className="maison-rail" id="maison-rail"><div className="maison-look-heading"><small>THE MAISON · LOOK {lookNumber}</small><h3>{["Feathered form","Sculpted grace","Liquid movement","Soft structure","Powder blue","Modern romance"][current]}</h3><p>Explore the pieces selected for this runway look. The collection moves with the model as you browse.</p></div><div className="maison-piece-grid">{lookItems.map(p=><article key={p.id} className="maison-piece"><div><PieceImage index={p.index}/></div><small>MAISON VELL</small><b>{p.name}</b><span>${p.price.toLocaleString("en-US")}</span><button onClick={()=>add(p)}>ADD TO BAG <Plus size={12}/></button></article>)}</div><div className="maison-rail-foot"><span>CURATED PIECES · {lookItems.length}</span><button onClick={()=>setSaved(s=>s.includes(current)?s.filter(x=>x!==current):[...s,current])}><Heart size={13} fill={saved.includes(current)?"currentColor":"none"}/> {saved.includes(current)?"SAVED":"SAVE LOOK"}</button></div></aside></div>
 </section>;
}
