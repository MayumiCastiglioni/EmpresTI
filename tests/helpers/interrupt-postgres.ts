import { createServer, connect, type Socket } from "node:net";

// Test-only TCP fault injection. Never logs or inspects credential payloads.
// Parses only server message boundaries and CommandComplete INSERT counters.
export async function interruptPostgresAfterInserts(target: URL, limit: number) {
  if (!["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) || target.searchParams.has("host") || target.searchParams.has("hostaddr")) throw Error("Proxy aceita somente Postgres local");
  const sockets = new Set<Socket>();
  let completedInserts = 0, interrupted = false;
  const server = createServer(client => {
    if (interrupted) { client.destroy(); return; }
    const upstream = connect({ host: target.hostname === "[::1]" ? "::1" : target.hostname, port: Number(target.port || 5432) });
    for (const socket of [client,upstream]) {
      sockets.add(socket);socket.on("error",()=>{client.destroy();upstream.destroy();});socket.on("close",()=>sockets.delete(socket));
    }
    client.on("data",data=>upstream.write(data));
    client.on("end",()=>upstream.end());
    let pending: Buffer<ArrayBufferLike> = Buffer.alloc(0);
    upstream.on("data",data=>{
      pending=Buffer.concat([pending,Buffer.isBuffer(data)?data:Buffer.from(data)]);
      while(pending.length>=5){
        const length=pending.readInt32BE(1)+1;
        if(length<5 || length>10000000){client.destroy();upstream.destroy();return;}
        if(pending.length<length)return;
        const packet=pending.subarray(0,length);pending=pending.subarray(length);
        if(packet[0]===67 && packet.subarray(5).toString("utf8").startsWith("INSERT ")){
          completedInserts++;
          if(completedInserts===limit){
            interrupted=true;client.destroy();upstream.destroy();return;
          }
        }
        client.write(packet);
      }
    });
    upstream.on("end",()=>client.end());
  });
  await new Promise<void>((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",()=>resolve());});
  const address=server.address();if(!address||typeof address==="string")throw Error("Proxy indisponível");
  const url=new URL(target);url.hostname="127.0.0.1";url.port=String(address.port);url.searchParams.set("sslmode","disable");
  return {
    connectionString:url.toString(),
    get completedInserts(){return completedInserts;},
    get interrupted(){return interrupted;},
    async close(){for(const socket of sockets)socket.destroy();await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));},
  };
}
