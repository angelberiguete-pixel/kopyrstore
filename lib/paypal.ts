const base=process.env.PAYPAL_ENV==="live"?"https://api-m.paypal.com":"https://api-m.sandbox.paypal.com";
export async function paypalAccessToken(){
 const id=process.env.PAYPAL_CLIENT_ID,secret=process.env.PAYPAL_CLIENT_SECRET;
 if(!id||!secret)throw Error("PayPal no configurado");
 const response=await fetch(base+"/v1/oauth2/token",{method:"POST",headers:{Authorization:"Basic "+Buffer.from(id+":"+secret).toString("base64"),"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
 if(!response.ok)throw Error("No se pudo autenticar PayPal");
 const body=await response.json();return body.access_token as string;
}
export async function paypalRequest(path:string,method:"GET"|"POST",payload?:unknown){
 const token=await paypalAccessToken();
 const response=await fetch(base+path,{method,headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","PayPal-Request-Id":crypto.randomUUID()},body:payload?JSON.stringify(payload):undefined,cache:"no-store"});
 const data=await response.json();if(!response.ok)throw Error("PayPal rechazó la operación");
 return data;
}
