import { expect, test } from "vitest";
import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { provisionLocalProfessor } from "../src/server/initial-data/professor-local";

config({path:".env.local",quiet:true});
test("DAT-06A DADOS-02/03/05/06 — Auth local, confirmação, vínculo repetido, divergências e empréstimos",async()=>{
  const pgUrl=new URL(process.env.DATABASE_URL??""), authUrl=process.env.NEXT_PUBLIC_SUPABASE_URL??"";
  if(!["localhost","127.0.0.1","[::1]"].includes(pgUrl.hostname)||pgUrl.searchParams.has("host")||pgUrl.searchParams.has("hostaddr")||!["localhost","127.0.0.1","[::1]"].includes(new URL(authUrl).hostname))throw Error("Destino recusado");
  pgUrl.pathname="/empresti_image_clean_20261106";
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY??"";
  const admin=createClient(authUrl,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const publicClient=createClient(authUrl,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY??"",{auth:{persistSession:false,autoRefreshToken:false}});
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:pgUrl.toString(),max:1}),log:[]});
  const email=`professor-fixture-${randomUUID()}@example.test`,password=randomUUID();
  let userId:string|undefined,tenantId:string|undefined;
  try {
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
    const created=await admin.auth.admin.createUser({email,password,email_confirm:false});
    expect(created.error).toBeNull();userId=created.data.user?.id;expect(userId).toBeTruthy();
    if(!userId)throw Error("Fixture não criada");
    const input={connectionString:pgUrl.toString(),supabaseUrl:authUrl,serviceRoleKey:key,userId,expectedEmail:email};
    expect((await provisionLocalProfessor(input)).status).toBe("awaiting-email-confirmation");
    expect(await db.tenant.findUnique({where:{slug:"empresti"}})).toBeNull();
    // Synthetic fixture confirms by token verification; implementation never confirms email.
    const link=await admin.auth.admin.generateLink({type:"magiclink",email});
    expect(link.error).toBeNull();
    if(!link.data.properties)throw Error("Link sintético não gerado");
    const verified=await publicClient.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:"magiclink"});
    expect(verified.error).toBeNull();
    expect((await provisionLocalProfessor({...input,expectedEmail:"different@example.test"})).reason).toBe("identity-mismatch");
    const runs=await Promise.all([provisionLocalProfessor(input),provisionLocalProfessor(input)]);
    expect(runs.map(r=>r.status).sort()).toEqual(["created-link","reused-link"]);
    const tenant=await db.tenant.findUniqueOrThrow({where:{slug:"empresti"}});tenantId=tenant.id;
    const before=await db.membership.findMany({where:{userId}});
    expect(before).toHaveLength(1);expect(before[0].role).toBe("COLABORADOR");
    expect((await provisionLocalProfessor(input)).status).toBe("reused-link");
    expect(await db.membership.findMany({where:{userId}})).toEqual(before);
    expect((await publicClient.auth.signInWithPassword({email,password})).error).toBeNull();
    await db.membership.update({where:{tenantId_userId:{tenantId,userId}},data:{role:"OPERACOES"}});
    expect((await provisionLocalProfessor(input)).reason).toBe("membership-mismatch");
    expect((await db.membership.findMany({where:{userId}}))[0].role).toBe("OPERACOES");
    await db.membership.update({where:{tenantId_userId:{tenantId,userId}},data:{role:"COLABORADOR"}});
    const equipment=await db.equipment.create({data:{tenantId,assetTag:"PROF-TEST",name:"Fixture",category:"monitor"}});
    const loan=await db.loan.create({data:{tenantId,equipmentId:equipment.id,borrowerId:userId,dueAt:new Date(Date.now()+86400000)}});
    expect((await provisionLocalProfessor(input)).reason).toBe("existing-loans");
    expect(await db.loan.findUnique({where:{id:loan.id}})).toEqual(loan);
    await expect(provisionLocalProfessor({...input,supabaseUrl:"https://example.invalid"})).rejects.toThrow("somente");
  } finally {
    // Remove only fixture rows created in this test, never an existing organization.
    if(tenantId)await db.tenant.delete({where:{id:tenantId}});
    if(userId)expect((await admin.auth.admin.deleteUser(userId)).error).toBeNull();
    await db.$disconnect();
  }
});
