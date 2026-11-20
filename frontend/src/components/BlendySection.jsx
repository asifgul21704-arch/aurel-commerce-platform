import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const BASE="https://images.higgs.ai/?default=1&output=webp&w=2048&q=85&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F";
const FLAVOURS=[
 {name:"Berry",color:"#C2B0DC",file:"hf_20261117_053958_8803e421-29b1-4c24-8efd-54cae3f479b4.png",bottle:[233,60,598,917],bottleAt:[518,138,372],crops:[[1209,272,569,573],[265,1230,579,572],[1192,1192,626,641]],pieces:[
  [2,383,178,104,0,false,"fruit"],[3,960,232,118,0,false,"fruit"],[1,295,478,129,-8,false,"fruit"],[1,1247,455,123,15,false,"fruit"],[2,968,590,110,30,false,"fruit"],[1,-15,590,255,0,false,"corner"],[3,1282,40,200,0,false,"corner"]]},
 {name:"Kiwi",color:"#B4D58A",file:"hf_20261117_053958_b5695e60-72da-4b5b-bfb7-a091d528af75.png",bottle:[217,90,610,874],bottleAt:[504,135,403],crops:[[1204,257,619,601],[250,1197,619,522],[1200,1186,633,650]],pieces:[
  [2,376,170,144,-150,true,"fruit"],[3,960,228,152,0,false,"fruit"],[1,303,460,168,0,false,"fruit"],[2,1187,462,148,-25,false,"fruit"],[2,946,606,150,10,true,"fruit"],[1,-10,575,260,0,false,"corner"],[3,1285,30,200,0,false,"corner"]]},
 {name:"Banana",color:"#F3DA8A",file:"hf_20261117_053958_6cf14029-4bce-4c9a-b9fc-1c5b185082e3.png",bottle:[194,76,579,873],bottleAt:[512,135,383],crops:[[1205,228,596,597],[230,1181,624,648],[1193,1182,646,659]],pieces:[
  [1,387,147,123,0,false,"fruit"],[2,970,223,136,-10,true,"fruit"],[3,298,483,132,15,false,"fruit"],[2,1245,462,150,20,false,"fruit"],[3,950,582,130,-12,false,"fruit"],[3,0,585,235,0,false,"corner"],[1,1280,30,190,0,false,"corner"]]},
 {name:"Strawberry",color:"#F2AFC0",file:"hf_20261117_055135_cbfb5a8d-c52b-4358-a6ee-d941c6c42285.png",bottle:[226,88,594,887],bottleAt:[512,135,386],crops:[[1190,216,561,653],[257,1168,604,662],[1240,1169,632,686]],pieces:[
  [1,372,142,128,0,false,"fruit"],[2,955,225,117,20,false,"fruit"],[3,290,455,140,-10,false,"fruit"],[3,1250,432,135,15,false,"fruit"],[2,962,558,146,-15,false,"fruit"],[1,-10,555,245,0,false,"corner"],[1,1285,35,200,20,false,"corner"]]}
];
function cropStyle(sheet,box){const [bx,by,bw,bh]=box;return {backgroundImage:`url("${sheet}")`,backgroundRepeat:"no-repeat",backgroundSize:`${2048/bw*100}% auto`,backgroundPosition:`${bx/(2048-bw)*100}% ${by/(2048-bh)*100}%`}}
function BlendyArtwork({flavour}){
 const sheet=BASE+flavour.file;
 const [bx,by,bw,bh]=flavour.bottle;
 const [x,y,w]=flavour.bottleAt;
 return <div className="blendy-artwork">
  <div className="blendy-word">{flavour.name}</div>
  <div className="blendy-bottle" style={{left:`${x/1440*100}%`,top:`${y/900*100}%`,width:`${w/1440*100}%`,aspectRatio:`${bw}/${bh}`,...cropStyle(sheet,flavour.bottle)}}/>
  {flavour.pieces.map(([item,px,py,pw,rotation,mirror,layer],i)=><div key={i} className={`blendy-piece ${layer}`} style={{left:`${px/1440*100}%`,top:`${py/900*100}%`,width:`${pw/1440*100}%`,aspectRatio:`${flavour.crops[item-1][2]}/${flavour.crops[item-1][3]}`,transform:mirror?"scaleX(-1)":undefined}}><div style={{...cropStyle(sheet,flavour.crops[item-1]),"--rot":`${rotation}deg`}}/></div>)}
 </div>;
}
export default function BlendySection({notify}){
 const [active,setActive]=useState(0),pauseUntil=useRef(0),pointer=useRef(null);
 const flavour=FLAVOURS[active];
 const go=i=>{setActive((i+4)%4);pauseUntil.current=Date.now()+6000};
 useEffect(()=>{const timer=setInterval(()=>{if(Date.now()>pauseUntil.current)setActive(i=>(i+1)%4)},2600);return()=>clearInterval(timer)},[]);
 const down=e=>{pointer.current={x:e.clientX,y:e.clientY}};
 const up=e=>{if(!pointer.current)return;const dx=e.clientX-pointer.current.x,dy=e.clientY-pointer.current.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(active+(dx<0?1:-1));pointer.current=null};
 return <section className="blendy-section" id="blendy" style={{background:flavour.color}} onPointerDown={down} onPointerUp={up}>
  <div className="blendy-top"><span>02 — BLENDY / REAL FRUIT SMOOTHIES</span><span>FRESHLY MIXED · ALWAYS BRIGHT</span></div>
  <div className="blendy-main"><div className="blendy-copy"><span className="eyebrow">A LITTLE DAILY JOY</span><h2>Real fruit.<br/><i>Real good.</i></h2><p>Four fruit-forward favourites. Find your flavour and make a moment of it.</p><div className="flavour-list">{FLAVOURS.map((d,i)=><button key={d.name} className={active===i?"selected":""} onClick={()=>go(i)}><span>0{i+1}</span>{d.name}<ArrowUpRight size={14}/></button>)}</div><button className="blendy-add" onClick={()=>{pauseUntil.current=Date.now()+6000;notify(`${flavour.name} flavour selected. Source prompt does not specify a product price.`)}}>SHOP NOW <ArrowUpRight size={15}/></button></div>
   <div className="blendy-stage"><BlendyArtwork key={flavour.name} flavour={flavour}/><div className="blendy-caption">FRUIT. FEELING. FRESHNESS.</div></div>
  </div>
  <div className="blendy-controls"><span>0{active+1} / 04</span><div><button onClick={()=>go(active-1)} aria-label="Previous flavour"><ArrowLeft/></button><button onClick={()=>go(active+1)} aria-label="Next flavour"><ArrowRight/></button></div></div>
 </section>;
}
