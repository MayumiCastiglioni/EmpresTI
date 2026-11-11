import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { verificarStorage } from "./verificar-storage.mjs";

test("DADOS-04/06 DAT-08A — leitura pública, hash, dimensões, falhas e sem autenticação",async(t)=>{
  const photos={},files=new Map();let mode="ok",requests=0;
  for(let i=1;i<=12;i++){
    const tag=`TI-${String(i).padStart(4,"0")}`;
    const bytes=await sharp({create:{width:800,height:600,channels:3,background:{r:i*10,g:20,b:30}}}).png().toBuffer();
    const sha256=createHash("sha256").update(bytes).digest("hex");
    photos[tag]={provider:"pixabay",sourceId:String(i),sha256,bucket:"equipment-images",objectKey:`empresti/${tag}/${sha256}.png`,width:800,height:600};
    files.set(`/storage/v1/object/public/equipment-images/${photos[tag].objectKey}`,bytes);
  }
  const different=await sharp({create:{width:800,height:600,channels:3,background:"black"}}).png().toBuffer();
  const small=await sharp({create:{width:80,height:60,channels:3,background:"black"}}).png().toBuffer();
  const server=createServer((req,res)=>{
    requests++;assert.equal(req.method,"GET");assert.equal(req.headers.authorization,undefined);assert.equal(req.headers.cookie,undefined);
    if(mode==="404"){res.writeHead(404).end();return;}
    if(mode==="redirect"){res.writeHead(302,{location:"http://example.invalid"}).end();return;}
    if(mode==="timeout")return;
    const bytes=mode==="wrong"?Buffer.from("corrompido"):mode==="hash"?different:mode==="dimensions"?small:files.get(req.url);
    if(!bytes){res.writeHead(404).end();return;}
    res.writeHead(200,{"content-type":"image/png"}).end(bytes);
  });
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  t.after(()=>{server.closeAllConnections();return new Promise(resolve=>server.close(resolve));});
  const base=`http://127.0.0.1:${server.address().port}`;
  assert.deepEqual(await verificarStorage(base,photos),{status:"public-files-verified",checked:12,issues:[]});
  for(mode of ["404","wrong","hash","dimensions","redirect","timeout"]){
    const result=await verificarStorage(base,photos,{timeoutMs:100});
    assert.equal(result.status,"blocked");assert.equal(result.checked,0);assert.equal(result.issues.length,12);
  }
  const count=requests;
  assert.equal((await verificarStorage(base,{})).status,"blocked");assert.equal(requests,count);
  await assert.rejects(verificarStorage("https://example.invalid",photos));
  await assert.rejects(verificarStorage(`${base}/?key=private`,photos));
});
