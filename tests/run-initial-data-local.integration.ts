import { test, expect } from "vitest";
import { config } from "dotenv";
import { randomUUID, createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { interruptPostgresAfterInserts } from "./helpers/interrupt-postgres";
import { initialEquipment } from "../src/server/initial-data/preflight";
import { runLocalInitialData, verifyLocalPhotoFiles } from "../src/server/initial-data/run-local";

config({path:".env.local",quiet:true});
test("DAT-05C DADOS-01/02/03/04/05/06 — arquivos, conta e lote em fluxo local único",async()=>{
  const url=new URL(process.env.DATABASE_URL??""),authUrl=process.env.NEXT_PUBLIC_SUPABASE_URL??"";
  if(!["localhost","127.0.0.1","[::1]"].includes(url.hostname)||url.searchParams.has("host")||url.searchParams.has("hostaddr")||!["localhost","127.0.0.1","[::1]"].includes(new URL(authUrl).hostname))throw Error("Recusado");
  url.pathname="/empresti_image_clean_20261106";
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:url.toString(),max:1}),log:[]});
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY??"";
  const admin=createClient(authUrl,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const client=createClient(authUrl,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY??"",{auth:{persistSession:false,autoRefreshToken:false}});
  const directory=await mkdtemp(join(tmpdir(),"empresti-flow-"));
  const photos:Record<string,unknown>={},reviews:Record<string,unknown>={};
  let userId:string|undefined,fixtureAllowed=false;
  try{
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();fixtureAllowed=true;
    const email=`flow-${randomUUID()}@example.test`,password=randomUUID();
    const created=await admin.auth.admin.createUser({email,password,email_confirm:false});
    expect(created.error).toBeNull();userId=created.data.user?.id;if(!userId)throw Error("Fixture ausente");
    let i=0;
    for(const [tag] of initialEquipment){
      const bytes=await sharp({create:{width:800,height:600,channels:3,background:{r:++i*10,g:40,b:80}}}).png().toBuffer();
      const sha256=createHash("sha256").update(bytes).digest("hex");
      await writeFile(join(directory,`${tag}.png`),bytes);
      photos[tag]={provider:"pexels",sourceId:String(i),sourceUrl:`https://www.pexels.com/photo/${i}/`,photographer:"Fixture sintética",photographerUrl:"https://www.pexels.com/@fixture/",licenseUrl:"https://www.pexels.com/license/",licenseCheckedAt:"2026-11-06",bucket:"equipment-images",objectKey:`empresti/${tag}/${sha256}.png`,width:800,height:600,sha256};
      reviews[tag]={state:"approved",reviewer:"Fixture de teste, não aprovação real",date:"2026-11-06"};
    }
    const input={connectionString:url.toString(),supabaseUrl:authUrl,serviceRoleKey:key,userId,expectedEmail:email,directory,photos,reviews};
    expect((await runLocalInitialData({...input,reviews:{}})).reason).toBe("photo-files-or-review");
    expect((await runLocalInitialData(input)).reason).toBe("email-confirmation");
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
    const link=await admin.auth.admin.generateLink({type:"magiclink",email});
    if(link.error||!link.data.properties)throw Error("Link ausente");
    expect((await client.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:"magiclink"})).error).toBeNull();
    expect((await runLocalInitialData({...input,expectedEmail:"wrong@example.test"})).reason).toBe("identity");
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
    // DADOS-03 / DAT-07A: server confirms tenant + membership + six equipment INSERTs,
    // then connection is dropped before the transaction can commit. No mocked DB.
    const fault=await interruptPostgresAfterInserts(url,8);
    try {
      await expect(runLocalInitialData({...input,connectionString:fault.connectionString})).rejects.toThrow();
      expect(fault.interrupted).toBe(true);expect(fault.completedInserts).toBe(8);
      expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
      expect(await db.membership.count({where:{userId}})).toBe(0);
      expect(await db.equipment.count({where:{assetTag:{in:initialEquipment.map(e=>e[0])}}})).toBe(0);
      expect((await admin.auth.admin.getUserById(userId)).data.user?.id).toBe(userId);
    } finally {await fault.close();}
    const runs=await Promise.all([runLocalInitialData(input),runLocalInitialData(input)]);
    expect(runs.map(r=>r.created).sort((a,b)=>a-b)).toEqual([0,12]);expect(runs.every(r=>r.status==="local-loaded")).toBe(true);
    const tenant=await db.tenant.findUniqueOrThrow({where:{slug:"empresti"}});
    const before=await db.equipment.findMany({where:{tenantId:tenant.id},orderBy:{assetTag:"asc"}});
    expect(before).toHaveLength(12);expect((await runLocalInitialData(input)).reused).toBe(12);
    expect(await db.equipment.findMany({where:{tenantId:tenant.id},orderBy:{assetTag:"asc"}})).toEqual(before);
    expect(await db.loan.count({where:{borrowerId:userId}})).toBe(0);
    expect(await db.membership.count({where:{tenantId:tenant.id,userId,role:"COLABORADOR"}})).toBe(1);
    await db.equipment.update({where:{id:before[0].id},data:{name:"Divergência preservada"}});
    expect((await runLocalInitialData(input)).reason).toBe("equipment-conflict");
    expect((await db.equipment.findUniqueOrThrow({where:{id:before[0].id}})).name).toBe("Divergência preservada");
    await writeFile(join(directory,"TI-0001.png"),"corrompido");
    expect(await verifyLocalPhotoFiles(photos,directory,reviews)).toBe(false);
    expect((await runLocalInitialData(input)).status).toBe("blocked");
    await expect(runLocalInitialData({...input,supabaseUrl:"https://example.invalid"})).rejects.toThrow("somente");
  }finally{
    if(fixtureAllowed&&userId){const fixture=await db.tenant.findFirst({where:{slug:"empresti",memberships:{some:{userId}}}});if(fixture)await db.tenant.delete({where:{id:fixture.id}});}
    if(userId)expect((await admin.auth.admin.deleteUser(userId)).error).toBeNull();
    await db.$disconnect();await rm(directory,{recursive:true,force:true});
  }
});
