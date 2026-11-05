import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../lib/shipping.ts",import.meta.url),"utf8");
test("historical shipping bands are present",()=>{for(const amount of [150,250,300])assert.ok(source.includes("amountDop:"+amount));});
test("unrecognized zones are not silently priced",()=>assert.match(source,/return match\?\.amountDop \?\? null/));
test("unapproved catalog is never published",()=>{const entries=JSON.parse(readFileSync(new URL("../data/import-review.json",import.meta.url),"utf8"));assert.ok(entries.length>0);assert.ok(entries.every(p=>!p.publish&&!p.priceApproved&&!p.stockConfirmed));});
test("live catalog remains empty until approval",()=>{const entries=JSON.parse(readFileSync(new URL("../data/products.json",import.meta.url),"utf8"));assert.equal(entries.length,0);});
