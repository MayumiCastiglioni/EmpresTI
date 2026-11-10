import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const env = dotenv.parse(await readFile(new URL("../.env.local", import.meta.url)));
const base = "http://localhost:3100";
const appUrl = new URL(base);
const authUrl = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
const databaseUrl = new URL(env.DATABASE_URL);
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

if (!localHosts.has(appUrl.hostname) || !localHosts.has(authUrl.hostname) || !localHosts.has(databaseUrl.hostname)) {
  throw new Error("Esta integração só pode usar Supabase e Postgres locais.");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const database = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 2000,
    statement_timeout: 5000,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
  }),
  log: [],
});

function browserCookie(setCookie) {
  const [pair, ...attributes] = setCookie.split(";");
  const separator = pair.indexOf("=");
  assert.ok(separator > 0, "Cookie de sessão malformado.");
  const cookie = {
    name: pair.slice(0, separator),
    value: pair.slice(separator + 1),
    url: base,
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  };
  let domain;
  let path = "/";

  for (const attribute of attributes) {
    const [rawKey, ...rawValue] = attribute.trim().split("=");
    const key = rawKey.toLowerCase();
    const value = rawValue.join("=");
    if (key === "httponly") cookie.httpOnly = true;
    if (key === "secure") cookie.secure = true;
    if (key === "path" && value) path = value;
    if (key === "domain" && value) domain = value;
    if (key === "samesite" && ["strict", "lax", "none"].includes(value.toLowerCase())) {
      cookie.sameSite = value[0].toUpperCase() + value.slice(1).toLowerCase();
    }
  }

  if (domain) {
    delete cookie.url;
    cookie.domain = domain;
    cookie.path = path;
  }

  return cookie;
}

async function waitForLocalApp() {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${base}/login`);
      if (response.ok) return;
      lastError = new Error(`Next local respondeu ${response.status} em /login.`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next local não respondeu em ${base}. Inicie npm run dev -- --port 3100.`, {
    cause: lastError,
  });
}

test("EMP-09 — navegador local solicita empréstimo, mantém foco e cabe no viewport móvel", {
  timeout: 60_000,
}, async () => {
  const email = `loans-browser-${randomUUID()}@example.test`;
  const password = `${randomUUID()}Aa1!`;
  const assetTag = `BROWSER-${randomUUID()}`;
  let userId;
  let tenantId;
  let createdTenant = false;
  let memberCreated = false;
  let equipmentId;
  let maintenanceEquipmentId;
  const limitEquipmentIds = [];
  let browser;
  let context;

  try {
    await waitForLocalApp();

    const tenant = await database.tenant.findUnique({ where: { slug: "empresti" } });
    if (tenant) {
      tenantId = tenant.id;
    } else {
      const created = await database.tenant.create({
        data: { slug: "empresti", name: "EmpresTI" },
      });
      tenantId = created.id;
      createdTenant = true;
    }

    const account = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    assert.equal(account.error, null);
    userId = account.data.user.id;
    await database.membership.create({ data: { tenantId, userId, role: "COLABORADOR" } });
    memberCreated = true;

    const equipment = await database.equipment.create({
      data: {
        tenantId,
        assetTag,
        name: "Notebook de validação no navegador",
        category: "notebook",
        status: "DISPONIVEL",
      },
    });
    equipmentId = equipment.id;
    const maintenanceEquipment = await database.equipment.create({
      data: {
        tenantId,
        assetTag: `BROWSER-MAINT-${randomUUID()}`,
        name: "Monitor de validação em manutenção",
        category: "monitor",
        status: "MANUTENCAO",
      },
    });
    maintenanceEquipmentId = maintenanceEquipment.id;

    const login = await fetch(`${base}/api/trpc/auth.login`, {
      method: "POST",
      headers: { origin: base, "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(login.status, 200);
    const sessionCookies = login.headers.getSetCookie();
    assert.ok(sessionCookies.length > 0);
    assert.ok(sessionCookies.every((cookie) => cookie.toLowerCase().includes("httponly")));
    const rawCookieHeader = sessionCookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
    const directCatalog = await fetch(`${base}/api/trpc/inventory.catalog.list`, {
      headers: { cookie: rawCookieHeader },
    });
    assert.equal(directCatalog.status, 200, await directCatalog.text());

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addCookies(sessionCookies.map(browserCookie));
    const page = await context.newPage();
    const pageErrors = [];
    const apiResponses = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", async (apiResponse) => {
      if (!new URL(apiResponse.url()).pathname.startsWith("/api/trpc/")) return;
      apiResponses.push({
        path: new URL(apiResponse.url()).pathname,
        status: apiResponse.status(),
        body: await apiResponse.text(),
      });
    });

    const response = await page.goto(`${base}/catalogo`, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200);
    assert.match(page.url(), /\/catalogo$/);
    await page.getByRole("heading", { name: "Catálogo de equipamentos." }).waitFor();
    try {
      await page.getByRole("heading", { name: "Notebook de validação no navegador" }).waitFor({ timeout: 10_000 });
    } catch (error) {
      throw new Error(`Equipamento não renderizado. URL=${page.url()}; corpo=${await page.locator("body").innerText()}; API=${JSON.stringify(apiResponses)}`, { cause: error });
    }
    await page.getByRole("heading", { name: "Monitor de validação em manutenção" }).waitFor();
    await page.getByText("Você ainda não tem empréstimos.").waitFor();
    assert.equal(await page.getByText("Em manutenção", { exact: true }).count(), 1);
    assert.equal(await page.getByRole("button", { name: /Solicitar empréstimo de Monitor de validação em manutenção/ }).count(), 0);

    const screenshotDir = join(tmpdir(), `empresti-emp-t07-${randomUUID()}`);
    await mkdir(screenshotDir, { recursive: true });
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.screenshot({ path: join(screenshotDir, "catalogo-desktop.png"), fullPage: true });

    const requestButton = page.getByRole("button", {
      name: `Solicitar empréstimo de Notebook de validação no navegador, patrimônio ${assetTag}`,
    });
    await requestButton.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Confirmar empréstimo" });
    await dialog.waitFor();
    await page.screenshot({ path: join(screenshotDir, "confirmacao-desktop.png"), fullPage: true });
    const confirm = page.getByRole("button", { name: "Confirmar solicitação" });
    const cancel = page.getByRole("button", { name: "Cancelar" });
    assert.equal(await confirm.evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press("Tab");
    assert.equal(await cancel.evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press("Shift+Tab");
    assert.equal(await confirm.evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await requestButton.evaluate((element) => document.activeElement === element), true);

    const requestedAt = new Date(Date.now() - 2 * 86_400_000);
    const dueAt = new Date(Date.now() + 14 * 86_400_000);
    for (let index = 0; index < 5; index += 1) {
      const activeEquipment = await database.equipment.create({
        data: {
          tenantId,
          assetTag: `BROWSER-LIMIT-${randomUUID()}`,
          name: `Empréstimo ativo de teste ${index + 1}`,
          category: "notebook",
          status: "DISPONIVEL",
        },
      });
      limitEquipmentIds.push(activeEquipment.id);
      await database.loan.create({
        data: {
          tenantId,
          borrowerId: userId,
          equipmentId: activeEquipment.id,
          status: "RETIRADO",
          requestedAt,
          checkedOutAt: requestedAt,
          dueAt,
        },
      });
    }
    await requestButton.click();
    await page.getByRole("button", { name: "Confirmar solicitação" }).click();
    await page.getByRole("alert").filter({ hasText: "Você já tem cinco empréstimos ativos." }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Notebook de validação no navegador" }).count(), 1);
    assert.equal(await database.loan.count({ where: { borrowerId: userId, equipmentId } }), 0);
    await database.loan.deleteMany({ where: { borrowerId: userId, equipmentId: { in: limitEquipmentIds } } });
    await database.equipment.deleteMany({ where: { id: { in: limitEquipmentIds } } });
    await page.getByRole("button", { name: "Cancelar" }).click();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByText("Você ainda não tem empréstimos.").waitFor();

    await requestButton.click();
    await page.getByRole("button", { name: "Confirmar solicitação" }).click();
    await page.getByRole("status").filter({ hasText: "Empréstimo iniciado." }).waitFor();
    await page.getByRole("heading", { name: "Meus empréstimos" }).waitFor();
    await page.getByText("Notebook de validação no navegador").last().waitFor();
    await page.getByText("Emprestado", { exact: true }).waitFor();
    const createdLoan = await database.loan.findFirst({
      where: { borrowerId: userId, equipmentId },
      select: { id: true },
    });
    assert.ok(createdLoan);
    await page.getByRole("button", { name: /Solicitar empréstimo de Notebook de validação no navegador/ }).waitFor({ state: "detached" });

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileWidth = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    assert.ok(mobileWidth.content <= mobileWidth.viewport, `Overflow horizontal móvel: ${JSON.stringify(mobileWidth)}`);
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.screenshot({ path: join(screenshotDir, "catalogo-mobile.png"), fullPage: true });

    await page.route("**/api/trpc/inventory.catalog.list**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ result: { data: [] } }),
      });
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByText("Nenhum equipamento cadastrado.").waitFor();
    assert.deepEqual(pageErrors, [], "A interface não deve lançar erros no navegador.");

    process.stdout.write(`Capturas locais para revisão humana: ${screenshotDir}\n`);
  } finally {
    await context?.close();
    await browser?.close();
    if (userId) await database.loan.deleteMany({ where: { borrowerId: userId } });
    const fixtureEquipmentIds = [equipmentId, maintenanceEquipmentId, ...limitEquipmentIds].filter(Boolean);
    if (fixtureEquipmentIds.length) await database.equipment.deleteMany({ where: { id: { in: fixtureEquipmentIds } } });
    if (memberCreated) await database.membership.deleteMany({ where: { tenantId, userId } });
    if (createdTenant) await database.tenant.deleteMany({ where: { id: tenantId } });
    if (userId) {
      const removed = await admin.auth.admin.deleteUser(userId);
      assert.equal(removed.error, null);
    }
    await database.$disconnect();
  }
});
