import { expect, test } from "vitest";
import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { initialEquipment } from "../src/server/initial-data/preflight";
import { loadLocalEquipment } from "../src/server/initial-data/load-local";

config({path:".env.local",quiet:true});
function photos() {
  return Object.fromEntries(initialEquipment.map(([tag],i)=> {
    const sha256=(i+1).toString(16).padStart(64,"0");
    return [tag,{provider:"pexels",sourceId:String(i+1),sourceUrl:`https://www.pexels.com/photo/${i+1}/`,photographer:"Fixture sintética",
      photographerUrl:"https://www.pexels.com/@fixture/",licenseUrl:"https://www.pexels.com/license/",licenseCheckedAt:"2026-11-06",bucket:"equipment-images",
      objectKey:`empresti/${tag}/${sha256}.png`,width:800,height:600,sha256}];
  }));
}

test("DAT-05B DADOS-01/02/03/06 — carga Prisma real local, concorrência, bloqueio e preservação", async()=> {
  const url=new URL(process.env.DATABASE_URL ?? "");
  if(!["localhost","127.0.0.1","[::1]"].includes(url.hostname)||url.searchParams.has("host")||url.searchParams.has("hostaddr"))throw Error("Destino recusado");
  url.pathname="/empresti_image_clean_20261106";
  const connection=url.toString();
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:connection,max:1}),log:[]});
  const id=randomUUID();let created=false;
  try {
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
    await db.tenant.create({data:{id,slug:"empresti",name:"EmpresTI"}});created=true;
    const denied=await loadLocalEquipment(connection,photos(),async()=>false);
    expect(denied.status).toBe("blocked");expect(await db.equipment.count({where:{tenantId:id}})).toBe(0);
    await expect(loadLocalEquipment(connection,photos(),async()=>{throw Error("pré-condição indisponível");})).rejects.toThrow();
    expect(await db.equipment.count({where:{tenantId:id}})).toBe(0);
    const runs=await Promise.all([loadLocalEquipment(connection,photos(),async()=>true),loadLocalEquipment(connection,photos(),async()=>true)]);
    expect(runs.map(r=>r.create.length).sort((a,b)=>a-b)).toEqual([0,12]);
    expect(runs.map(r=>r.reuse.length).sort((a,b)=>a-b)).toEqual([0,12]);
    const before=await db.equipment.findMany({where:{tenantId:id},orderBy:{assetTag:"asc"}});
    expect(before).toHaveLength(12);expect(before.filter(e=>e.status==="MANUTENCAO").map(e=>e.assetTag)).toEqual(["TI-0004","TI-0007"]);
    const repeated=await loadLocalEquipment(connection,photos(),async()=>true);
    expect(repeated.reuse).toHaveLength(12);
    expect(await db.equipment.findMany({where:{tenantId:id},orderBy:{assetTag:"asc"}})).toEqual(before);
    expect(await db.loan.count({where:{tenantId:id}})).toBe(0);
    await db.equipment.update({where:{id:before[0].id},data:{name:"Preservar divergência",notes:"Preservar observação"}});
    const state=await db.equipment.findMany({where:{tenantId:id},orderBy:{assetTag:"asc"}});
    let called=false;
    const conflict=await loadLocalEquipment(connection,photos(),async()=>{called=true;return true;});
    expect(conflict.status).toBe("blocked");expect(called).toBe(false);
    expect(await db.equipment.findMany({where:{tenantId:id},orderBy:{assetTag:"asc"}})).toEqual(state);
    await expect(loadLocalEquipment("postgresql://example.invalid/db",photos(),async()=>true)).rejects.toThrow("somente");
  } finally {
    if(created)await db.tenant.delete({where:{id}});
    await db.$disconnect();
  }
});
