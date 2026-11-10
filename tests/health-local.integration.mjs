import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync, existsSync } from "node:fs";
import { createServer, createConnection } from "node:net";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import dotenv from "dotenv";

const root = fileURLToPath(new URL("../", import.meta.url));
const next = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const local = dotenv.parse(readFileSync(new URL("../.env.local", import.meta.url)));
for (const key of ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]) {
  let url;
  try {
    url = new URL(local[key]);
  } catch {
    throw new Error(`${key} precisa conter uma URL local válida.`);
  }
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), `${key} deve apontar para serviço local.`);
  assert.ok(!url.searchParams.has("host") && !url.searchParams.has("hostaddr"), "Destino alternativo não permitido.");
}
assert.ok(existsSync(new URL("../build/BUILD_ID", import.meta.url)), "Execute npm run build antes desta integração.");

async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  return address.port;
}

async function availablePort() {
  const server = createServer();
  const port = await listen(server);
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function listening(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    const finish = (ready) => { socket.destroy(); resolve(ready); };
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
    socket.setTimeout(200, () => finish(false));
  });
}

async function startApplication(context, overrides = {}) {
  const port = await availablePort();
  const child = spawn(process.execPath, [next, "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: root,
    env: { ...process.env, ...local, ...overrides, NODE_ENV: "production" },
    stdio: "ignore",
    windowsHide: true,
  });
  let launchError;
  child.on("error", (error) => { launchError = error; });
  context.after(async () => {
    if (child.exitCode !== null || child.signalCode !== null || launchError) return;
    const stopped = once(child, "exit");
    child.kill();
    await stopped;
  });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    assert.ok(!launchError && child.exitCode === null, "A aplicação de teste não iniciou.");
    if (await listening(port)) return `http://127.0.0.1:${port}`;
    await delay(100);
  }
  assert.fail("A aplicação de teste não ficou pronta em 15 segundos.");
}

async function request(base, path) {
  return fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(8000) });
}

test("MIN-02 — integração HTTP com Postgres local, sem escrita", { timeout: 60000 }, async (t) => {
  const base = await startApplication(t);

  await t.test("AZ-02/04: conexão real retorna 200, corpo mínimo e no-store sem sessão", async () => {
    const response = await request(base, "/health");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok", database: "up" });
    assert.equal(response.headers.get("cache-control"), "no-store");
  });

  await t.test("AZ-05: página de diagnóstico é servida sem sessão", async () => {
    const response = await request(base, "/diagnostico");
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Diagnóstico da conexão/);
    assert.match(response.headers.get("cache-control"), /no-store/);
  });

  await t.test("AZ-04/LOGIN-03: catálogo e caminhos semelhantes a health continuam protegidos", async () => {
    for (const path of ["/catalogo", "/health-extra", "/health/private", "/diagnostico-extra", "/diagnostico/private"]) {
      const response = await request(base, path);
      assert.equal(response.status, 307);
      assert.equal(new URL(response.headers.get("location"), base).pathname, "/login");
    }
  });

  await t.test("AZ-02/04: servidor de banco sem resposta termina em 503 sem vazar configuração", async (context) => {
    const sockets = new Set();
    const unavailable = createServer((socket) => {
      sockets.add(socket);
      socket.on("error", () => {});
      socket.on("close", () => sockets.delete(socket));
    });
    const port = await listen(unavailable);
    context.after(async () => {
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve, reject) => unavailable.close((error) => error ? reject(error) : resolve()));
    });
    const isolated = await startApplication(context, {
      DATABASE_URL: `postgresql://fixture:fixture@127.0.0.1:${port}/fixture`,
    });
    const start = performance.now();
    const response = await request(isolated, "/health");
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: "error", database: "down" });
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.ok(performance.now() - start < 7000, "A falha não deve aguardar indefinidamente.");
  });
});
