import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, LockKeyhole, Menu, Minus, Plus, ShoppingBag, UserRound, X } from "lucide-react";
import OffcutSection from "./components/OffcutSection.jsx";
import VirtualFitSection from "./components/VirtualFitSection.jsx";
import MaisonSection from "./components/MaisonSection.jsx";
import RunwaySection from "./components/RunwaySection.jsx";
import VellStudio from "./components/VellStudio.jsx";
import ProductQuickView from "./components/ProductQuickView.jsx";
import BlendySection from "./components/BlendySection.jsx";
import CustomProductsSection from "./components/CustomProductsSection.jsx";
import { useCatalog } from "./hooks/useCatalog.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const CDN = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F";
const looks = [
  ["Denim Maxi","Everyday",450,"hf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png"],
  ["Cloud Set","Everyday",326,"hf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png"],
  ["Library Knit","Everyday",384,"hf_20261112_034742_9a8a92fd-79ae-4163-9ffa-14ae2a68717f.png"],
  ["Lilac Run","Athletic",344,"hf_20261112_034735_4e352e03-ad2b-44d1-9fcf-4b5b9454dc55.png"],
  ["Satin Night","Sleep",158,"hf_20261112_034738_aeb8ea57-6399-4f3c-b54a-4a57d0bd971e.png"],
  ["Night Suit","Formal",672,"hf_20261112_034736_aace5c5f-8c14-4b00-83ba-744dbad2e337.png"],
  ["Sage Slip","Party",366,"hf_20261112_034735_3d9fb69e-b4e0-49f7-a2d4-e592bd616c27.png"],
  ["Bomber Cargo","Street",526,"hf_20261112_034740_3e3c5ad7-689b-46a2-8e09-c7d36a569b9c.png"]
].map(([name,category,price,file],i)=>({id:`vell-${i}`,name,category,price,collection:"VELL Studio",image:`${CDN}${file}&w=1000&q=85`}));

const money = (value,currency="USD") => new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(Number(value));

function App(){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("aurel-user"))}catch{return null}});
  const [token,setToken]=useState(()=>localStorage.getItem("aurel-token"));
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("aurel-cart")||"[]")}catch{return[]}});
  const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem("aurel-saved")||"[]")}catch{return[]}});
  const [commerceReady,setCommerceReady]=useState(false);
  const [commerceOwner,setCommerceOwner]=useState("");
  const [bagOpen,setBagOpen]=useState(false);
  const [notice,setNotice]=useState("");
  const [mobileOpen,setMobileOpen]=useState(false);
  const navigate=useNavigate();
  const totals=cart.reduce((acc,p)=>{const currency=p.currency||"USD";acc[currency]=(acc[currency]||0)+p.price*p.quantity;return acc},{});
  const cartCurrencies=Object.keys(totals);
  const canCheckout=cartCurrencies.length===1;
  const count=cart.reduce((s,p)=>s+p.quantity,0);
  const notify=message=>{setNotice(message);window.setTimeout(()=>setNotice(""),2600)};
  useEffect(()=>{localStorage.setItem("aurel-cart",JSON.stringify(cart))},[cart]);
  useEffect(()=>{localStorage.setItem("aurel-saved",JSON.stringify(saved))},[saved]);
  useEffect(()=>{
    let active=true;
    if(!token){setCommerceReady(true);setCommerceOwner("");return()=>{active=false}};
    setCommerceReady(false);
    Promise.all([
      fetch(`${API}/account/me`,{headers:{Authorization:`Bearer ${token}`}}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to load your saved bag.");return data}),
      fetch(`${API}/catalog`).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to load the catalog.");return data})
    ])
      .then(([account,catalog])=>{if(!active)return;const byId=new Map((catalog.products||[]).map(product=>[product.productId,product]));setCart((account.cartItems||[]).map(item=>({...byId.get(item.productId),...item,id:item.productId})).filter(item=>item.name));setSaved(account.savedProductIds||[]);setCommerceOwner(token);setCommerceReady(true)})
      .catch(()=>{if(active)setCommerceReady(true)});
    return()=>{active=false};
  },[token]);
  useEffect(()=>{
    if(!token||!commerceReady||commerceOwner!==token)return;
    const items=cart.map(({id,productId,quantity,size,color})=>({productId:productId||id,quantity,size,color}));
    fetch(`${API}/account/cart`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({items})}).catch(()=>notify("Your bag could not sync. Please check your connection."));
  },[cart,token,commerceReady,commerceOwner]);
  const updateSaved=updater=>setSaved(previous=>{
    const next=typeof updater==="function"?updater(previous):updater;
    if(token)fetch(`${API}/account/wishlist`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({productIds:next})})
      .then(async response=>{if(!response.ok){const data=await response.json();throw new Error(data.message||"Wishlist could not sync.")}})
      .catch(()=>notify("Wishlist could not sync. Please sign in again."));
    return next;
  });
  const add=(product)=>{setCart(old=>{const same=p=>p.id===product.id&&p.size===product.size&&p.color===product.color;const found=old.find(same);return found?old.map(p=>same(p)?{...p,quantity:p.quantity+1}:p):[...old,{...product,quantity:1}]});notify(`${product.name} added to your bag`)};
  const signOut=()=>{localStorage.removeItem("aurel-token");localStorage.removeItem("aurel-user");setToken(null);setUser(null);setCart([]);setSaved([]);setCommerceReady(false);setCommerceOwner("");navigate("/")};
  const auth={user,token,setUser,setToken,notify};
  return <div className="app-shell">
    <div className="announcement">COMPLIMENTARY SHIPPING ON ORDERS OVER $150 <span>—</span> DISCOVER THE NEW EDIT</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen?<X/>:<Menu/>}</button>
      <Link className="wordmark" to="/">AUREL<span>®</span></Link>
      <nav className={mobileOpen?"main-nav open":"main-nav"}>
        <a href="/#collections" onClick={()=>setMobileOpen(false)}>Collections</a><a href="/#vell" onClick={()=>setMobileOpen(false)}>VELL Studio</a><a href="/#offcut" onClick={()=>setMobileOpen(false)}>Offcut</a><a href="/#virtualfit" onClick={()=>setMobileOpen(false)}>VirtualFit</a><a href="/#maison" onClick={()=>setMobileOpen(false)}>Maison Vell</a><a href="/#blendy" onClick={()=>setMobileOpen(false)}>Blendy</a><a href="/#runway" onClick={()=>setMobileOpen(false)}>Runway</a>
      </nav>
      <div className="header-actions">
        {user?<button className="text-action" onClick={()=>navigate(user.role==="owner"?"/owner":user.role==="admin"?"/admin":"/account")}>{user.name.split(" ")[0]}</button>:<Link className="text-action" to="/login">Sign in</Link>}
        <button className="icon-button saved-action" onClick={()=>navigate(user?"/account#saved":"/login")} aria-label="Saved looks"><Heart size={18}/></button>
        <button className="bag-trigger" onClick={()=>setBagOpen(true)}><ShoppingBag size={17}/> <span>Bag ({count})</span></button>
        {user&&<button className="text-action signout" onClick={signOut}>Sign out</button>}
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Home add={add} saved={saved} setSaved={setSaved} notify={notify}/>}/>
      <Route path="/login" element={<AuthPage mode="login" auth={auth}/>}/>
      <Route path="/signup" element={<AuthPage mode="signup" auth={auth}/>}/>
      <Route path="/checkout" element={<DemoCheckoutPage user={user} token={token} onCheckoutComplete={()=>setCart([])}/>}/>
      <Route path="/account" element={<AccountPage user={user} token={token} signOut={signOut}/>}/>
      <Route path="/admin" element={<Dashboard user={user} token={token} type="admin"/>}/>
      <Route path="/owner" element={<Dashboard user={user} token={token} type="owner"/>}/>
      <Route path="*" element={<Home add={add} saved={saved} setSaved={setSaved} notify={notify}/>}/>
    </Routes>
    <footer className="footer"><div className="footer-brand">AUREL<span>®</span></div><p>Considered pieces. Everyday rituals. A world of your own.</p><div className="footer-bottom"><span>© 2026 AUREL STUDIO</span><span>DESIGNED TO BE DISCOVERED</span><span>PRIVACY · TERMS · CONTACT</span></div></footer>
    {bagOpen&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setBagOpen(false)}><aside className="bag-panel"><div className="bag-head"><div><small>YOUR SELECTION</small><h2>Shopping bag <em>({count})</em></h2></div><button className="icon-button" onClick={()=>setBagOpen(false)}><X/></button></div>
      {cart.length===0?<div className="empty-bag"><ShoppingBag size={30}/><p>Your bag is waiting for something lovely.</p><button className="dark-button" onClick={()=>setBagOpen(false)}>Continue exploring</button></div>:<><div className="bag-items">{cart.map(p=><div className="bag-item" key={`${p.id}-${p.size||"one"}-${p.color||"none"}`}><img src={p.image} alt=""/><div className="bag-item-info"><b>{p.name}</b><small>{p.collection}{p.size?` · Size ${p.size}`:""}{p.color?` · ${p.color}`:""}</small><strong>{money(p.price,p.currency||"USD")}</strong><div className="quantity"><button onClick={()=>setCart(old=>old.map(x=>x.id===p.id&&x.size===p.size&&x.color===p.color?{...x,quantity:Math.max(1,x.quantity-1)}:x))}><Minus size={12}/></button><span>{p.quantity}</span><button onClick={()=>add(p)}><Plus size={12}/></button><button className="remove" onClick={()=>setCart(old=>old.filter(x=>!(x.id===p.id&&x.size===p.size&&x.color===p.color)))}>Remove</button></div></div></div>)}</div><div className="bag-checkout"><div className="bag-totals"><span>Subtotal</span>{cartCurrencies.map(currency=><b key={currency}>{money(totals[currency],currency)}</b>)}</div>{!canCheckout&&<small className="currency-warning">Your bag has multiple currencies. Please keep EUR and USD items in separate demo orders.</small>}<small>Demo checkout only — no real payment is collected.</small><button className="dark-button" disabled={!canCheckout} onClick={()=>{sessionStorage.setItem("aurel-checkout",JSON.stringify(cart.map(({id,quantity,size,color})=>({productId:id,quantity,size,color}))));setBagOpen(false);if(!user)navigate("/login");else navigate("/checkout")}}>Continue to demo checkout <ArrowRight size={16}/></button></div></>}
    </aside></div>}
    {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

function Home({add,saved,setSaved,notify}){
  const [slide,setSlide]=useState(0);
  const [filter,setFilter]=useState("All");
  const liveLooks=useCatalog(looks);
  const [selectedProduct,setSelectedProduct]=useState(null);
  const activeLooks=liveLooks.filter(p=>p.isActive!==false);const visible=filter==="All"?activeLooks:activeLooks.filter(p=>p.category===filter);
  const heroImages=[looks[0].image,looks[6].image,looks[7].image];
  const current=looks[slide%looks.length];
  const toggleSave=id=>setSaved(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
  return <main>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/>THE AUREL EDIT · NO. 01</div><h1>Wear your<br/><i>own story.</i></h1><p>A considered collection of modern essentials, virtual expression and little everyday rituals.</p><div className="hero-buttons"><a className="light-button" href="#collections">Explore the edit <ArrowUpRight size={16}/></a><a className="under-link" href="#vell">Discover VELL</a></div><div className="hero-index"><span>0{slide+1}</span><span className="index-line"/><span>03</span><div className="hero-arrows"><button onClick={()=>setSlide((slide+2)%3)} aria-label="Previous"><ArrowLeft/></button><button onClick={()=>setSlide((slide+1)%3)} aria-label="Next"><ArrowRight/></button></div></div></div>
      <div className="hero-art"><div className="hero-image" style={{backgroundImage:`url("${heroImages[slide]}")`}}/><div className="hero-art-note"><span>01 / 08</span><span>THE NEW SILHOUETTE</span></div><div className="hero-stamp">A<br/>/ R</div></div>
      <div className="hero-vertical">CURATED STYLE & LIVING — EST. 2026</div>
    </section>
    <section className="intro-strip" id="collections"><span>01 — OUR UNIVERSE</span><p>One destination.<br/><i>Many ways to express.</i></p><span>SCROLL TO EXPLORE ↓</span></section>
    <section className="collection-section" id="vell"><div className="section-heading"><div><span className="eyebrow">THE VELL STUDIO</span><h2>Find your <i>form.</i></h2></div><p>Eight looks. One character. A world of possibilities.<br/>Explore the original VELL virtual styling collection.</p></div>
      <VellStudio add={add}/>
      <div className="filter-row">{["All","Everyday","Athletic","Sleep","Formal","Party","Street"].map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}<span>{visible.length.toString().padStart(2,"0")} LOOKS</span></div>
      <div className="product-grid">{visible.map((p,i)=><article className="product-card" key={p.id}><div className="product-image" role="button" tabIndex={0} onClick={()=>setSelectedProduct(p)} onKeyDown={e=>e.key==="Enter"&&setSelectedProduct(p)}><img src={p.image} alt={p.name}/><span className="product-number">0{i+1}</span><button className={saved.includes(p.id)?"heart-button active":"heart-button"} onClick={e=>{e.stopPropagation();toggleSave(p.id)}} aria-label="Save look"><Heart size={17}/></button><button className="quick-add" onClick={e=>{e.stopPropagation();add(p)}}>ADD TO BAG <Plus size={14}/></button></div><div className="product-meta"><div><small>{p.category.toUpperCase()} · VELL STUDIO</small><h3>{p.name}</h3></div><b>{money(p.price,p.currency||"USD")}</b></div></article>)}</div>
    </section>
    <OffcutSection add={add}/>
    <VirtualFitSection add={add}/>
    <MaisonSection add={add}/>
    <RunwaySection add={add}/>
    <CustomProductsSection add={add}/>
    <section className="feature-band"><div className="feature-photo"><img src={looks[3].image} alt="Lilac Run look"/></div><div className="feature-copy"><span className="eyebrow">VIRTUAL EXPRESSION · 001</span><h2>Style is a<br/><i>feeling.</i></h2><p>Meet your digital muse. Change a silhouette, discover a mood and save the looks that feel like you.</p><a className="dark-button inline" href="#vell">Explore VELL Studio <ArrowUpRight size={16}/></a></div></section>
    <BlendySection notify={notify}/>
    <section className="manifesto" id="journal"><span className="eyebrow">THE AUREL POINT OF VIEW</span><p>Less, but <i>with intention.</i></p><a href="#collections">DISCOVER OUR WORLD <ArrowDown size={14}/></a></section>
    <ProductQuickView product={selectedProduct} onClose={()=>setSelectedProduct(null)} add={add}/>
  </main>;
}

function AuthPage({mode,auth}){
  const signup=mode==="signup";const [form,setForm]=useState({name:"",email:"",password:""});const [error,setError]=useState("");const [busy,setBusy]=useState(false);const navigate=useNavigate();
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{const response=await fetch(`${API}/auth/${signup?"signup":"login"}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to sign in");localStorage.setItem("aurel-token",data.token);localStorage.setItem("aurel-user",JSON.stringify(data.user));auth.setToken(data.token);auth.setUser(data.user);auth.notify("Welcome to AUREL");navigate(data.user.role==="owner"?"/owner":data.user.role==="admin"?"/admin":(sessionStorage.getItem("aurel-checkout")?"/checkout":"/account"));}catch(err){setError(err.message)}finally{setBusy(false)}};
  return <main className="auth-layout"><div className="auth-visual"><span className="eyebrow">AUREL MEMBERSHIP</span><h1>A world of<br/><i>your own.</i></h1><p>Save your favourites, keep your edits and make every discovery yours.</p><div className="auth-image"><img src={looks[1].image} alt="AUREL styling look"/></div></div><div className="auth-form-wrap"><div className="auth-form"><span className="eyebrow">{signup?"CREATE YOUR ACCOUNT":"WELCOME BACK"}</span><h2>{signup?"Join the edit.":"Sign in."}</h2><p>{signup?"Create an account to save looks and manage your orders.":"Your AUREL world is right where you left it."}</p><form onSubmit={submit}>{signup&&<label>Full name<input name="name" value={form.name} onChange={change} autoComplete="name" required minLength="2"/></label>}<label>Email address<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" required/></label><label>Password<input name="password" type="password" value={form.password} onChange={change} autoComplete={signup?"new-password":"current-password"} required minLength={signup?10:1}/>{signup&&<small>Use at least 10 characters.</small>}</label>{error&&<div className="form-error">{error}</div>}<button className="dark-button" disabled={busy}>{busy?"PLEASE WAIT…":signup?"CREATE ACCOUNT":"SIGN IN"} <ArrowRight size={16}/></button></form><div className="auth-switch">{signup?"Already part of AUREL?":"New to AUREL?"} <Link to={signup?"/login":"/signup"}>{signup?"Sign in":"Create an account"}</Link></div><small className="secure-note"><LockKeyhole size={13}/> Your password is securely hashed by the AUREL API.</small></div></div></main>;
}

function DemoCheckoutPage({user,token,onCheckoutComplete}){
  const [items]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("aurel-checkout")||"[]")}catch{return[]}});
  const [catalog,setCatalog]=useState([]);
  const [method,setMethod]=useState("demo-card");
  const [shipping,setShipping]=useState({fullName:user?.name||"",email:user?.email||"",phone:"",address:"",city:"",postalCode:"",country:"Pakistan"});
  const [outcome,setOutcome]=useState("succeeded");
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const navigate=useNavigate();

  useEffect(()=>{
    fetch(API+"/catalog").then(r=>r.json()).then(d=>setCatalog(d.products||[])).catch(()=>setError("The catalog could not be loaded. Please try again."));
  },[]);

  const lines=items.map(item=>{
    const product=catalog.find(p=>p.productId===item.productId);
    return product?{...item,product}:null;
  }).filter(Boolean);
  const total=lines.reduce((sum,line)=>sum+line.product.price*line.quantity,0);
  const currency=lines[0]?.product.currency||"USD";

  const submit=async event=>{
    event.preventDefault();
    setBusy(true);
    setError("");
    try{
      const response=await fetch(API+"/payments/demo-checkout",{
        method:"POST",
        headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},
        body:JSON.stringify({items,method,shipping,demoOutcome:outcome==="failed"?"failed":"succeeded"})
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||"Demo checkout could not be completed.");
      setResult(data);
      if(outcome==="succeeded"){
        sessionStorage.removeItem("aurel-checkout");
        onCheckoutComplete?.();
      }
    }catch(err){setError(err.message)}
    finally{setBusy(false)}
  };

  if(!user)return <main className="center-state"><h2>Sign in to continue.</h2><Link className="dark-button inline" to="/login">Sign in</Link></main>;
  if(!items.length&&!result)return <main className="center-state"><h2>Your checkout is empty.</h2><Link className="dark-button inline" to="/">Explore the edit</Link></main>;

  return <main className="dashboard-page checkout-page">
    <div className="dashboard-title"><span className="eyebrow">AUREL · SECURE DEMO CHECKOUT</span><h1>Complete your <i>selection.</i></h1><p>This is a payment simulation. No card information is requested and no money will be charged.</p></div>
    {error&&<div className="notice-box">{error}</div>}
    {result?<section className="account-card checkout-result">
      <span className="eyebrow">DEMO PAYMENT RESULT</span>
      <h2>{result.order?.payment?.status==="succeeded"?"Payment approved.":"Payment declined."}</h2>
      <p>{result.message}</p>
      <p><strong>Reference:</strong> {result.order?.payment?.reference}</p>
      <p><strong>Order total:</strong> {money(result.order?.total||0,result.order?.currency||"USD")}</p>
      <button className="dark-button inline" onClick={()=>navigate("/account")}>View my orders <ArrowRight size={16}/></button>
      {result.order?.payment?.status==="failed"&&<button className="under-link" onClick={()=>setResult(null)}>Try another demo outcome</button>}
    </section>:<div className="checkout-layout">
      <section className="account-card checkout-summary">
        <span className="eyebrow">YOUR ORDER</span>
        <h2>Order summary</h2>
        {lines.map(line=><div className="checkout-line" key={line.productId}>
          <div><b>{line.product.name}</b><small>{line.product.collection}{line.size?" · Size "+line.size:""}{line.color?" · "+line.color:""} × {line.quantity}</small></div>
          <strong>{money(line.product.price*line.quantity,line.product.currency||"USD")}</strong>
        </div>)}
        <div className="checkout-total"><span>Total</span><strong>{money(total,currency)}</strong></div>
        <p className="demo-disclaimer">Prices are loaded from the AUREL catalog. This is not a live transaction.</p>
      </section>
      <form className="account-card checkout-form" onSubmit={submit}>
        <span className="eyebrow">PAYMENT SIMULATOR</span>
        <h2>Shipping details</h2>
        <div className="shipping-fields">
          <label>Full name<input required maxLength="80" autoComplete="name" value={shipping.fullName} onChange={e=>setShipping({...shipping,fullName:e.target.value})}/></label>
          <label>Email address<input required type="email" maxLength="254" autoComplete="email" value={shipping.email} onChange={e=>setShipping({...shipping,email:e.target.value})}/></label>
          <label>Phone number<input required type="tel" maxLength="30" autoComplete="tel" value={shipping.phone} onChange={e=>setShipping({...shipping,phone:e.target.value})}/></label>
          <label>Street address<input required minLength="5" maxLength="240" autoComplete="street-address" value={shipping.address} onChange={e=>setShipping({...shipping,address:e.target.value})}/></label>
          <label>City<input required maxLength="80" autoComplete="address-level2" value={shipping.city} onChange={e=>setShipping({...shipping,city:e.target.value})}/></label>
          <label>Postal code<input maxLength="20" autoComplete="postal-code" value={shipping.postalCode} onChange={e=>setShipping({...shipping,postalCode:e.target.value})}/></label>
          <label>Country<input required maxLength="80" autoComplete="country-name" value={shipping.country} onChange={e=>setShipping({...shipping,country:e.target.value})}/></label>
        </div>
        <h2>Choose a demo method</h2>
        <div className="checkout-choices">
          <button type="button" className={method==="demo-card"?"checkout-choice active":"checkout-choice"} onClick={()=>setMethod("demo-card")}><strong>Demo card</strong><small>Simulated card approval or decline</small></button>
          <button type="button" className={method==="demo-wallet"?"checkout-choice active":"checkout-choice"} onClick={()=>setMethod("demo-wallet")}><strong>Demo wallet</strong><small>Simulated wallet transaction</small></button>
        </div>
        <h3>Test the result</h3>
        <label className="checkout-radio"><input type="radio" name="outcome" checked={outcome==="succeeded"} onChange={()=>setOutcome("succeeded")}/> Approved — create a processing order</label>
        <label className="checkout-radio"><input type="radio" name="outcome" checked={outcome==="failed"} onChange={()=>setOutcome("failed")}/> Declined — record a failed demo payment</label>
        <button className="dark-button" disabled={busy||!lines.length}>{busy?"PROCESSING…":"SIMULATE "+(outcome==="succeeded"?"APPROVED":"DECLINED")+" PAYMENT"} <ArrowRight size={16}/></button>
        <p className="demo-disclaimer">Never enter real card numbers, bank details, OTPs or passwords here.</p>
      </form>
    </div>}
  </main>;
}

function AccountPage({user,token,signOut}){
  const [orders,setOrders]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  useEffect(()=>{
    if(token)fetch(API+"/payments/my-orders",{headers:{Authorization:"Bearer "+token}})
      .then(r=>r.json()).then(d=>setOrders(d.orders||[])).catch(()=>{});
    if(token)fetch(API+"/account/wishlist",{headers:{Authorization:"Bearer "+token}})
      .then(r=>r.json()).then(d=>setWishlist(d.products||[])).catch(()=>{});
  },[token]);
  if(!user)return <div className="center-state"><h2>Sign in to view your account.</h2><Link className="dark-button inline" to="/login">Sign in</Link></div>;
  return <main className="dashboard-page">
    <div className="dashboard-title"><span className="eyebrow">YOUR AUREL ACCOUNT</span><h1>Hello, <i>{user.name.split(" ")[0]}.</i></h1><p>Keep your saved looks close and your orders in view.</p></div>
    <div className="account-grid">
      <div className="account-card"><small>MEMBER PROFILE</small><UserRound/><h3>{user.name}</h3><p>{user.email}</p><span className="role-pill">{user.role}</span><button className="under-link" onClick={signOut}>Sign out</button></div>
      <div className="account-card orders-card"><small>ORDER HISTORY</small><h3>Your orders</h3>{orders.length?orders.map(o=><div className="order-row" key={o._id}><span>{o.payment?.reference}</span><b>{money(o.total,o.currency||"USD")}</b><em>{o.payment?.status}</em></div>):<p>No orders yet. Your next discovery is waiting.</p>}</div>
      <div className="account-card orders-card" id="saved"><small>YOUR WISHLIST</small><h3>Saved pieces</h3>{wishlist.length?wishlist.map(p=><div className="order-row" key={p.productId}><span>{p.name}</span><b>{money(p.price,p.currency||"USD")}</b><em>{p.collection}</em></div>):<p>No saved products yet. Tap the heart on a product to keep it here.</p>}</div>
    </div>
    <p className="demo-disclaimer">Payments in this project are simulated for demonstration. No card details or real funds are processed.</p>
  </main>;
}

function Dashboard({user,token,type}){
  const [summary,setSummary]=useState(null),[admins,setAdmins]=useState([]),[orders,setOrders]=useState([]),[products,setProducts]=useState([]);
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [productForm,setProductForm]=useState({name:"",collection:"",category:"General",price:"",currency:"USD",image:"",description:""});
  const [editingProduct,setEditingProduct]=useState(null),[message,setMessage]=useState("");
  const headers={Authorization:`Bearer ${token}`};
  const loadOrders=()=>fetch(`${API}/payments/admin/orders`,{headers}).then(r=>r.json()).then(d=>setOrders(d.orders||[])).catch(()=>{});
  const loadAdmins=()=>fetch(`${API}/auth/admins`,{headers}).then(r=>r.json()).then(d=>setAdmins(d.admins||[])).catch(()=>{});
  const loadProducts=()=>fetch(`${API}/catalog/admin/products`,{headers}).then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>{});
  useEffect(()=>{
    if(!user||!["admin","owner"].includes(user.role)){setMessage("You do not have access to this dashboard.");return}
    fetch(`${API}/catalog/admin/summary`,{headers}).then(r=>r.json()).then(setSummary).catch(()=>{});
    loadOrders();loadProducts();
    if(user.role==="owner")loadAdmins();
  },[user,token]);
  const create=async e=>{
    e.preventDefault();setMessage("");
    const r=await fetch(`${API}/auth/admins`,{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(form)});
    const d=await r.json();if(!r.ok){setMessage(d.message);return}
    setForm({name:"",email:"",password:""});setMessage("Admin account created.");loadAdmins();
  };
  const saveProduct=async e=>{
    e.preventDefault();setMessage("");
    const url=editingProduct?`${API}/catalog/admin/products/${editingProduct}`:`${API}/catalog/admin/products`;
    const r=await fetch(url,{method:editingProduct?"PATCH":"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(productForm)});
    const d=await r.json();if(!r.ok){setMessage(d.message);return}
    setProductForm({name:"",collection:"",category:"General",price:"",currency:"USD",image:"",description:""});setEditingProduct(null);setMessage(editingProduct?"Product updated.":"Product created.");loadProducts();
    fetch(`${API}/catalog/admin/summary`,{headers}).then(r=>r.json()).then(setSummary).catch(()=>{});
  };
  const editProduct=p=>{setEditingProduct(p._id);setProductForm({name:p.name,collection:p.collection,category:p.category||"General",price:String(p.price),currency:p.currency||"USD",image:p.image||"",description:p.description||""});window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})};
  const archiveProduct=async p=>{
    const r=await fetch(`${API}/catalog/admin/products/${p._id}`,{method:"DELETE",headers});
    const d=await r.json();if(!r.ok){setMessage(d.message);return}
    setMessage(`${p.name} archived.`);loadProducts();
    fetch(`${API}/catalog/admin/summary`,{headers}).then(r=>r.json()).then(setSummary).catch(()=>{});
  };
  const changeStatus=async(id,status)=>{
    const r=await fetch(`${API}/payments/admin/orders/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({status})});
    const d=await r.json();if(!r.ok){setMessage(d.message);return}
    setOrders(old=>old.map(o=>o._id===id?d.order:o));setMessage("Order status updated.");
  };
  const toggleAdmin=async(admin)=>{
    const r=await fetch(`${API}/auth/admins/${admin._id}`,{method:"PATCH",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({isActive:!admin.isActive})});
    const d=await r.json();if(!r.ok){setMessage(d.message);return}
    setAdmins(old=>old.map(a=>a._id===admin._id?{...a,isActive:d.isActive}:a));setMessage("Administrator access updated.");
  };
  if(!user||!(type==="owner"?user.role==="owner":["admin","owner"].includes(user.role)))return <main className="center-state"><h2>Restricted area</h2><p>{message||"Sign in with an authorized account."}</p><Link className="dark-button inline" to="/login">Sign in</Link></main>;
  return <main className="dashboard-page">
    <div className="dashboard-title"><span className="eyebrow">{type==="owner"?"OWNER CONTROL ROOM":"ADMINISTRATION"}</span><h1>{type==="owner"?"Steward the":"Manage the"} <i>details.</i></h1><p>Welcome, {user.name}. This secure workspace is separate from the customer storefront.</p></div>
    {message&&<div className="notice-box">{message}</div>}
    <div className="stats-grid"><div className="stat-card"><small>ACTIVE CATALOG ITEMS</small><strong>{summary?.products??"—"}</strong><span>Across all collections</span></div><div className="stat-card"><small>COLLECTIONS</small><strong>{summary?.collections??"—"}</strong><span>Fashion and wellness</span></div><div className="stat-card"><small>ORDERS LOADED</small><strong>{orders.length}</strong><span>Latest 100 orders</span></div></div>
    <section className="admin-products"><div className="admin-section-title"><div><span className="eyebrow">CATALOG MANAGEMENT</span><h2>{editingProduct?"Edit product":"Products & collections"}</h2></div><button className="under-link" onClick={loadProducts}>Refresh catalog</button></div>
      <form className="product-admin-form" onSubmit={saveProduct}>
        <input placeholder="Product name" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required/>
        <input placeholder="Collection" value={productForm.collection} onChange={e=>setProductForm({...productForm,collection:e.target.value})} required/>
        <input placeholder="Category" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}/>
        <input type="number" min="0" step="0.01" placeholder="Price" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required/>
        <select value={productForm.currency} onChange={e=>setProductForm({...productForm,currency:e.target.value})}><option value="USD">USD</option><option value="EUR">EUR</option></select>
        <input className="wide-input" placeholder="Product image HTTPS URL (optional)" value={productForm.image} onChange={e=>setProductForm({...productForm,image:e.target.value})}/>
        <textarea className="wide-input" rows="2" placeholder="Short description (optional)" value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}/>
        <div className="product-form-actions"><button className="dark-button">{editingProduct?"Save changes":"Add product"} <Plus size={15}/></button>{editingProduct&&<button type="button" className="under-link" onClick={()=>{setEditingProduct(null);setProductForm({name:"",collection:"",category:"General",price:"",currency:"USD",image:"",description:""})}}>Cancel edit</button>}</div>
      </form>
      <div className="catalog-admin-list">{products.map(p=><div className="catalog-admin-row" key={p._id}><img src={p.image} alt=""/><div><b>{p.name}</b><small>{p.collection} · {p.category}</small></div><strong>{money(p.price,p.currency||"USD")}</strong><span className={p.isActive?"catalog-active":"catalog-archived"}>{p.isActive?"ACTIVE":"ARCHIVED"}</span><button onClick={()=>editProduct(p)}>Edit</button>{p.isActive&&<button className="archive-button" onClick={()=>archiveProduct(p)}>Archive</button>}</div>)}</div>
    </section>
    <section className="admin-orders"><div className="admin-section-title"><div><span className="eyebrow">ORDER MANAGEMENT</span><h2>Recent orders</h2></div><button className="under-link" onClick={loadOrders}>Refresh orders</button></div>
      {orders.length?<div className="orders-table"><div className="orders-table-head"><span>ORDER / CUSTOMER</span><span>DATE</span><span>TOTAL</span><span>PAYMENT</span><span>STATUS</span></div>{orders.map(order=><div className="orders-table-row" key={order._id}><div><b>{order.payment?.reference||order._id.slice(-8)}</b><small>{order.customer?.name||"Customer"} · {order.customer?.email||"—"}</small></div><span>{new Date(order.createdAt).toLocaleDateString()}</span><b>{money(order.total,order.currency||"USD")}</b><span>{order.payment?.status||"—"}</span><select value={order.status} onChange={e=>changeStatus(order._id,e.target.value)}><option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>)}</div>:<p className="admin-empty">No demo orders yet. Orders will appear here after a customer completes checkout.</p>}
    </section>
    {type==="owner"&&<section className="admin-owner-grid"><div className="create-admin"><span className="eyebrow">OWNER ONLY</span><h2>Create an administrator</h2><form onSubmit={create}><input placeholder="Admin full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input type="email" placeholder="Admin email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><input type="password" placeholder="Temporary password (12+ characters)" minLength="12" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><button className="dark-button">Create admin <Plus size={15}/></button></form></div><div className="admin-directory"><span className="eyebrow">OWNER ONLY</span><h2>Administrator access</h2>{admins.length?admins.map(a=><div className="admin-row" key={a._id}><div><b>{a.name}</b><span>{a.email}</span></div><button className={a.isActive?"access-on":"access-off"} onClick={()=>toggleAdmin(a)}>{a.isActive?"ACTIVE":"SUSPENDED"}</button></div>):<p>No administrators created yet.</p>}</div></section>}
    <p className="demo-disclaimer">All checkout activity is simulated. No real payment provider or customer card data is connected.</p>
  </main>;
}
export default App;
