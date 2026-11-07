import {NextResponse} from "next/server";
import {calculateCart} from "../../../lib/checkout";
export const runtime="nodejs";
export async function POST(req:Request){
 try{
  const body=await req.json();
  const cart=calculateCart(body.lines);
  // Do not capture payments until a persistent order and inventory reservation exists.
  return NextResponse.json({ready:false,reason:"El registro persistente de pedidos y la reserva de inventario aún no están configurados.",currency:cart.currency,totalUsd:(cart.cents/100).toFixed(2)},{status:503});
 }catch{return NextResponse.json({error:"Carrito no válido o productos no aprobados"},{status:400});}
}
