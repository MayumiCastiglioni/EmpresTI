import { readFile, realpath } from "node:fs/promises";
import { join, relative, isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { initialEquipment, preflightEquipment, validImage } from "./preflight";
import type { ProfessorLocalInput } from "./professor-local";

type LocalLoadInput = ProfessorLocalInput & { photos: unknown; directory: string; reviews: unknown };
export type LocalLoadResult = { status: "blocked" | "local-loaded"; reason?: string; created: number; reused: number };
const blocked = (reason: string): LocalLoadResult => ({status:"blocked",reason,created:0,reused:0});
function record(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }

// Local files only; names are fixed by the approved inventory, never manifest paths.
export async function verifyLocalPhotoFiles(photos: unknown, directory: string, reviews: unknown): Promise<boolean> {
  if (preflightEquipment(photos,[]).status === "blocked" || !record(photos) || !record(reviews)) return false;
  try {
    const root = await realpath(directory);
    for (const [tag] of initialEquipment) {
      const image=photos[tag], review=reviews[tag];
      if (!validImage(image,tag) || !record(review) || review.state !== "approved" || typeof review.reviewer !== "string" || !review.reviewer.trim() || typeof review.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(review.date) || !Number.isFinite(Date.parse(review.date)) || new Date(review.date).toISOString().slice(0,10)!==review.date) return false;
      const file=await realpath(join(root,`${tag}.png`));
      const rel=relative(root,file);
      if (rel.startsWith("..") || isAbsolute(rel)) return false;
      const bytes=await readFile(file);
      const meta=await sharp(bytes,{limitInputPixels:40000000}).metadata();
      // Force full decoding: header metadata alone can accept truncated files.
      await sharp(bytes,{limitInputPixels:40000000}).raw().toBuffer();
      if(meta.format!=="png" || meta.width!==800 || meta.height!==600 || createHash("sha256").update(bytes).digest("hex")!==image.sha256) return false;
    }
    return true;
  } catch { return false; }
}

// Internal local workflow. No upload/API route and no production credentials accepted.
export async function runLocalInitialData(input: LocalLoadInput): Promise<LocalLoadResult> {
  const pgUrl=new URL(input.connectionString), authUrl=new URL(input.supabaseUrl);
  const local=(host:string)=>["localhost","127.0.0.1","[::1]"].includes(host);
  if(!["postgres:","postgresql:"].includes(pgUrl.protocol)||!local(pgUrl.hostname)||pgUrl.searchParams.has("host")||pgUrl.searchParams.has("hostaddr")||!["http:","https:"].includes(authUrl.protocol)||!local(authUrl.hostname)||authUrl.username||authUrl.password||authUrl.search||authUrl.hash)throw Error("Carga permitida somente local");
  const photos:unknown=structuredClone(input.photos),reviews:unknown=structuredClone(input.reviews);
  if(!await verifyLocalPhotoFiles(photos,input.directory,reviews))return blocked("photo-files-or-review");
  if(!input.userId||!input.expectedEmail.trim()||!input.serviceRoleKey)return blocked("identity-input");
  const auth=createClient(input.supabaseUrl,input.serviceRoleKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const db=new PrismaClient({adapter:new PrismaPg({connectionString:input.connectionString,max:1,connectionTimeoutMillis:3000}),log:[]});
  try {
    return await db.$transaction(async tx=>{
      await tx.$executeRawUnsafe('LOCK TABLE "tenants", "equipment", "memberships", "loans" IN SHARE ROW EXCLUSIVE MODE');
      const tenant=await tx.tenant.findUnique({where:{slug:"empresti"}});
      if(tenant&&tenant.name!=="EmpresTI")return blocked("organization");
      const current=tenant?await tx.equipment.findMany({where:{tenantId:tenant.id}}):[];
      const comparison=preflightEquipment(photos,current);
      if(comparison.status==="blocked")return blocked("equipment-conflict");
      const {data,error}=await auth.auth.admin.getUserById(input.userId);
      if(error||!data.user||data.user.email?.toLowerCase()!==input.expectedEmail.trim().toLowerCase())return blocked("identity");
      if(!data.user.email_confirmed_at)return blocked("email-confirmation");
      if(await tx.loan.count({where:{borrowerId:input.userId}}))return blocked("existing-loans");
      const links=await tx.membership.findMany({where:{userId:input.userId}});
      if(links.some(m=>m.tenantId!==tenant?.id||m.role!=="COLABORADOR"))return blocked("membership-conflict");
      // Repeat file validation immediately before first write, under the database lock.
      if(!await verifyLocalPhotoFiles(photos,input.directory,reviews)||!record(photos))return blocked("photo-files-or-review");
      const target=tenant??await tx.tenant.create({data:{slug:"empresti",name:"EmpresTI"}});
      if(!links.length)await tx.membership.create({data:{tenantId:target.id,userId:input.userId,role:"COLABORADOR"}});
      for(const [assetTag,name,category,status] of initialEquipment){
        if(!comparison.create.includes(assetTag))continue;
        const image=photos[assetTag];if(!validImage(image,assetTag))throw Error("Metadados inconsistentes");
        await tx.equipment.create({data:{tenantId:target.id,assetTag,name,category,status,image}});
      }
      return {status:"local-loaded",created:comparison.create.length,reused:comparison.reuse.length};
    },{maxWait:15000,timeout:30000});
  }finally{await db.$disconnect();}
}
