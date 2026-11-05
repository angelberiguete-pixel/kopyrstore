export const SHIPPING_ZONES = [
 {id:"dn",label:"Distrito Nacional / Norte / Oeste",amountDop:150},
 {id:"alcarrizos",label:"Los Alcarrizos",amountDop:250},
 {id:"sde",label:"Santo Domingo Este",amountDop:300},
 {id:"interior",label:"Interior del país",amountDop:300}
] as const;
export type ShippingZoneId = typeof SHIPPING_ZONES[number]["id"];
export function quoteShipping(zone: string | null): number | null {
 const match = SHIPPING_ZONES.find(item=>item.id===zone);
 return match?.amountDop ?? null;
}
// Historical draft rates only. Administrator approval required before live checkout.
