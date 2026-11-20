import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

const money=(value,currency="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency}).format(Number(value));
export default function ProductQuickView({product,onClose,add}){
 const [quantity,setQuantity]=useState(1);
 if(!product)return null;
 const addSelected=()=>{for(let i=0;i<quantity;i++)add(product);onClose()};
 return <div className="quickview-overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="quickview-panel" role="dialog" aria-modal="true" aria-label={product.name}>
  <button className="quickview-close" onClick={onClose} aria-label="Close product details"><X/></button>
  <div className="quickview-image"><img src={product.image} alt={product.name}/></div>
  <div className="quickview-info"><small>{product.collection?.toUpperCase()} · AUREL EDIT</small><h2>{product.name}</h2><strong>{money(product.price,product.currency||"USD")}</strong><p>A considered piece from the AUREL edit. Explore the collection, save the look and add your selection to the shopping bag.</p><div className="quickview-quantity"><span>QUANTITY</span><button onClick={()=>setQuantity(q=>Math.max(1,q-1))}>−</button><b>{quantity}</b><button onClick={()=>setQuantity(q=>Math.min(20,q+1))}>+</button></div><button className="dark-button" onClick={addSelected}>Add to bag <ArrowRight size={16}/></button><small className="quickview-note">Demo storefront · no real payment is collected.</small></div>
 </section></div>;
}
