import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function verificarStorage(projectUrl, photos, { timeoutMs = 5000 } = {}) {
  const base = new URL(projectUrl);
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname);
  if (!((local && ["http:","https:"].includes(base.protocol)) || (base.protocol === "https:" && /^[a-z0-9-]+\.supabase\.co$/.test(base.hostname) && !base.port)) || base.username || base.password || base.search || base.hash || !["/", ""].includes(base.pathname)) throw Error("Informe apenas a origem de um projeto Supabase ou servidor local");
  const expected = Array.from({length:12},(_,i)=>`TI-${String(i+1).padStart(4,"0")}`);
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const ids=new Set(), hashes=new Set();
  if (!object(photos) || Object.keys(photos).length!==12) return {status:"blocked",checked:0,issues:[{field:"manifest"}]};
  for(const tag of expected){
    const image=photos[tag];
    if(!object(image) || image.provider!=="pexels" || typeof image.sourceId!=="string" || !/^[1-9]\d*$/.test(image.sourceId) || ids.has(image.sourceId) || typeof image.sha256!=="string" || !/^[a-f0-9]{64}$/.test(image.sha256) || hashes.has(image.sha256) || image.bucket!=="equipment-images" || image.objectKey!==`empresti/${tag}/${image.sha256}.png` || image.width!==800 || image.height!==600) return {status:"blocked",checked:0,issues:[{assetTag:tag,field:"manifest"}]};
    ids.add(image.sourceId);hashes.add(image.sha256);
  }
  const issues=[];let checked=0;
  for(const tag of expected){
    const image=photos[tag];
    const url=new URL(`/storage/v1/object/public/${image.bucket}/${image.objectKey}`,base);
    try{
      // No API key, cookie or Authorization: this must prove public access.
      const response=await fetch(url,{method:"GET",credentials:"omit",redirect:"error",signal:AbortSignal.timeout(timeoutMs)});
      if(response.status!==200){await response.body?.cancel();issues.push({assetTag:tag,field:"public-access"});continue;}
      if(!response.body)throw Error("Sem arquivo");
      const reader=response.body.getReader();const chunks=[];let size=0;
      try{
        while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>5000000){await reader.cancel();throw Error("Arquivo excede limite técnico");}chunks.push(value);}
      }finally{reader.releaseLock();}
      const bytes=Buffer.concat(chunks);
      const metadata=await sharp(bytes,{limitInputPixels:40000000}).metadata();
      await sharp(bytes,{limitInputPixels:40000000}).raw().toBuffer();
      if(metadata.format!=="png" || metadata.width!==800 || metadata.height!==600 || createHash("sha256").update(bytes).digest("hex")!==image.sha256){issues.push({assetTag:tag,field:"content"});continue;}
      checked++;
    }catch{issues.push({assetTag:tag,field:"request-or-file"});}
  }
  return {status:issues.length?"blocked":"public-files-verified",checked,issues};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{
    const [projectUrl,manifest]=process.argv.slice(2);
    if(!projectUrl||!manifest)throw Error("Uso: verificar-storage.mjs <origem-supabase> <fotos.json>");
    const data=JSON.parse(await readFile(manifest,"utf8"));
    const result=await verificarStorage(projectUrl,data.photos);console.log(JSON.stringify(result,null,2));
    if(result.status!=="public-files-verified")process.exitCode=1;
  }catch{console.error("Falha na configuração ou leitura do manifesto; nenhum segredo será exibido.");process.exitCode=1;}
}
