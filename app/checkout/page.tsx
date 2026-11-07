"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
type Item={id:string;quantity:number};
export default function Checkout(){
 const [lines,setLines]=useState<Item[]>([]);
 const [status,setStatus]=useState("");
 const [loading,setLoading]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem("kopyr-cart");if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed))setLines(parsed);}}catch{}},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setLoading(true);setStatus("");
  const form=new FormData(e.currentTarget);
  const customer=Object.fromEntries(form.entries());
  try{const r=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lines,customer})});const d=await r.json();setStatus(d.reason||d.error||"El checkout todavía no está disponible.");}
  catch{setStatus("No se pudo conectar con el servidor.");}finally{setLoading(false);}
 }
 return <main><Link href="/">← Volver a la tienda</Link><section className="panel"><h1>Finalizar compra</h1><p className="muted">Los pagos estarán disponibles cuando el inventario y los precios en USD estén confirmados.</p><p>Artículos en el carrito: {lines.reduce((n,l)=>n+l.quantity,0)}</p><form onSubmit={submit} className="checkout-form">
 <label>Nombre completo<input name="fullName" required minLength={3} autoComplete="name"/></label>
 <label>Correo electrónico<input name="email" type="email" required autoComplete="email"/></label>
 <label>Teléfono<input name="phone" type="tel" required autoComplete="tel"/></label>
 <label>Dirección<input name="address" required autoComplete="street-address"/></label>
 <label>Provincia<input name="province" required/></label>
 <label>Municipio<input name="municipality" required/></label>
 <label>Sector<input name="sector" required/></label>
 <label>Referencia de entrega<input name="reference"/></label>
 <button className="button" disabled={loading||lines.length===0}>{loading?"Validando pedido…":"Comprobar disponibilidad y pago"}</button>
 {status&&<p role="status" className="muted">{status}</p>}
 </form></section></main>;
}
