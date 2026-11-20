import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

const API=import.meta.env.VITE_API_BASE_URL||"http://localhost:5000/api";
const money=(v,c="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency:c}).format(Number(v));
export default function CustomProductsSection({add}){
 const [items,setItems]=useState([]);
 useEffect(()=>{let cancelled=false;fetch(`${API}/catalog`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(!cancelled)setItems((d.products||[]).filter(p=>p.productId.startsWith("custom-")))}).catch(()=>{});return()=>{cancelled=true}},[]);
 if(!items.length)return null;
 return <section className="custom-products"><div className="section-heading"><div><span className="eyebrow">THE OPEN EDIT</span><h2>New to <i>the collection.</i></h2></div><p>Fresh additions from the AUREL studio and its curators.</p></div><div className="product-grid">{items.map(p=><article className="product-card" key={p._id}><div className="product-image"><img src={p.image} alt={p.name}/><button className="quick-add" onClick={()=>add({id:p.productId,name:p.name,price:p.price,currency:p.currency,collection:p.collection,image:p.image})}>ADD TO BAG <Plus size={14}/></button></div><div className="product-meta"><div><small>{p.collection.toUpperCase()} · {p.category.toUpperCase()}</small><h3>{p.name}</h3></div><b>{money(p.price,p.currency)}</b></div></article>)}</div></section>;
}
