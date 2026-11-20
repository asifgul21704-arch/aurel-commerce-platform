export const offcutItems = [
  ["Winged Skull Tee",48],["Heavy Blank Tee — Black",38],["Heavy Blank Tee — White",38],
  ["Offcut Longsleeve",55],["Rose & Chain Tee",52],["Varsity Jacket",240],
  ["No Restocks Longsleeve",58],["Arch Logo Hoodie",95],["Barbed Heart Tee",48],["Black Zip Hoodie",98]
].map(([name,price],index)=>({id:`offcut-${index}`,name,price,currency:"EUR",collection:"Offcut",index}));

export const fitItems = [
  {id:"fit-0",name:"Basic T-shirt",price:45,colors:[["White","#f4f2ee"],["Ash","#c9c7c2"],["Charcoal","#3b3c3f"],["Navy","#27324d"]],model:".37",garment:[1.14,3.06]},
  {id:"fit-1",name:"Basic Sweater",price:105,colors:[["White","#f6f4ef"],["Oat","#ddd3c2"],["Sage","#b9c2ae"],["Black","#1f1f21"]],model:"25",garment:[49.7,1.39]},
  {id:"fit-2",name:"Linen Shirt",price:95,colors:[["White","#f7f6f1"],["Sand","#d9ccb4"],["Sky","#bcd0e2"],["Olive","#717556"]],model:"49.86",garment:[98.2,3.33]},
  {id:"fit-3",name:"Grey Hoodie",price:110,colors:[["Heather","#a9a9a8"],["Bone","#e6e1d6"],["Forest","#33463a"],["Black","#1f1f21"]],model:"74.77",garment:[1.14,93.3]},
  {id:"fit-4",name:"Ringer Tee",price:55,colors:[["White / Black","#f4f2ee"],["Cream / Navy","#efe6d3"],["Grey / Red","#c9c7c2"],["White / Green","#e9efe8"]],model:"99.35",garment:[49.7,95.3]}
].map(item=>({...item,currency:"USD",collection:"VirtualFit"}));

export const maisonItems = [
  ["Feather Jacket",2900],["Satin Wide Leg Trousers",1450],["Pleated Dress",2200],["Gold Waist Belt",420],
  ["Satin Trench Dress",2350],["Top Handle Bag",980],["Billow Sleeve Blouse",860],["Tie Waist Trousers",740],
  ["Powder Long Coat",1980],["Ivory Straight Trousers",690],["Sculpted Ruffle Top",1120],["Pleated Maxi Skirt",1340]
].map(([name,price],index)=>({id:`maison-${index}`,name,price,currency:"USD",collection:"Maison Vell",index}));

export const maisonLooks = [
  {name:"Look 15",description:"Feather jacket and satin wide-leg trousers.",items:[0,1]},
  {name:"Look 16",description:"Pleated dress with a sculptural gold belt.",items:[2,3]},
  {name:"Look 17",description:"Satin trench dress and a top-handle bag.",items:[4,5]},
  {name:"Look 18",description:"Billow sleeve blouse with tie-waist trousers.",items:[6,7]},
  {name:"Look 19",description:"Powder long coat and ivory straight trousers.",items:[8,9]},
  {name:"Look 20",description:"Sculpted ruffle top and pleated maxi skirt.",items:[10,11]}
];

export const runwayLooks = [
  {name:"The City Edit",description:"A charcoal knit and easy denim.",products:["Air Jordan 12 Retro","Tshirt","Sweatshirt"]},
  {name:"Gallery Opening",description:"A clean white tee and relaxed denim.",products:["Tatum 5 Orbit","Hoodie Black","Tshirt"]},
  {name:"Gallery Opening",description:"Olive knitwear. A grounded palette.",products:["Sweatshirt Plus","Tatum 5 Orbit","Tshirt"]},
  {name:"Studio Day",description:"Black, white and laid-back denim.",products:["Hoodie Black","Air Jordan 12 Retro","Tshirt"]},
  {name:"Studio Day",description:"Burgundy layers. A tailored perspective.",products:["Sweatshirt","Tatum 5 Orbit","Tshirt"]},
  {name:"Studio Day",description:"A grey crew and your favourite denim.",products:["Hoodie","Luka 5","Tshirt"]}
];

export const runwayItems = [
  {id:"runway-0",name:"Air Jordan 12 Retro",price:149,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-air-jordan-12-retro-copy.webp",sizes:["40","41","42","43","44","45","46"],sizes:["40","41","42","43","44","45","46"],sizes:["40","41","42","43","44","45","46"]},
  {id:"runway-1",name:"Tatum 5 Orbit",price:149,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp"},
  {id:"runway-2",name:"Luka 5",price:149,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp"},
  {id:"runway-3",name:"Tshirt",price:199,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp",sizes:["S","L","M","XL"]},
  {id:"runway-4",name:"Sweatshirt",price:199,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp",sizes:["S","L","M","XL"]},
  {id:"runway-5",name:"Sweatshirt Plus",price:199,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt-plus.webp",sizes:["S","L","M","XL"]},
  {id:"runway-6",name:"Hoodie",price:199,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-hoodie.webp",sizes:["S","L","M","XL"]},
  {id:"runway-7",name:"Hoodie Black",price:199,currency:"USD",collection:"Try the Look",image:"https://reel-ref-try-the-look.vercel.app/assets/source-hoodie-black.webp",sizes:["S","L","M","XL"]}
];
