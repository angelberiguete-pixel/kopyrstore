import products from "../data/products.json";
export type CartLine={id:string;quantity:number};
type Product={id:string;name:string;priceUsd:number;available:boolean;stock?:number;priceApproved?:boolean};
const catalog=products as Product[];
export function calculateCart(lines:CartLine[]){
 if(!Array.isArray(lines)||lines.length===0||lines.length>50)throw Error("Carrito inválido");
 const seen=new Set<string>();let cents=0;
 const items=lines.map(line=>{
  if(typeof line.id!=="string"||!Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>20||seen.has(line.id))throw Error("Cantidad o producto inválido");
  seen.add(line.id);
  const p=catalog.find(x=>x.id===line.id);
  if(!p||!p.available||p.priceApproved!==true||!Number.isSafeInteger(p.priceUsd*100)||p.priceUsd<=0||!Number.isSafeInteger(p.stock)||p.stock!<line.quantity)throw Error("Producto no disponible o precio sin validar");
  const unitCents=Math.round(p.priceUsd*100);cents+=unitCents*line.quantity;
  return {id:p.id,name:p.name,quantity:line.quantity,unitCents};
 });
 if(cents<=0||cents>100000000)throw Error("Importe inválido");
 return {items,cents,currency:"USD" as const};
}
