import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Explicit opt-in command; never included in the default unit test suite.
const env = dotenv.parse(readFileSync(new URL("../.env.local", import.meta.url)));
if (!["localhost", "127.0.0.1"].includes(new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname)) {
  throw new Error("Este teste só pode usar Supabase local.");
}
const base = "http://127.0.0.1:3100";
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function mutation(name, input, cookie = "") {
  return fetch(`${base}/api/trpc/auth.${name}`, {
    method: "POST",
    headers: { origin: base, "content-type": "application/json", cookie },
    body: JSON.stringify(input),
  });
}

test("LOGIN-01/02/03/04/06/07 — cadastro, persistência, sessão e saída reais locais", async () => {
  const email = `auth-check-${randomUUID()}@example.test`;
  const password = randomUUID();
  let userId;
  try {
    const anonymous = await fetch(`${base}/catalogo`, { redirect: "manual" });
    assert.equal(anonymous.status, 307);
    assert.ok(anonymous.headers.get("location").endsWith("/login"));

    const signup = await mutation("signup", { email, password });
    assert.equal(signup.status, 200);
    const listed = await admin.auth.admin.listUsers({ perPage: 1000 });
    assert.equal(listed.error, null);
    const user = listed.data.users.find((entry) => entry.email === email);
    assert.ok(user, "Cadastro deve existir em auth.users");
    userId = user.id;
    const confirmed = await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    assert.equal(confirmed.error, null);

    const login = await mutation("login", { email, password });
    assert.equal(login.status, 200);
    assert.deepEqual((await login.json()).result.data, { success: true });
    const cookies = login.headers.getSetCookie();
    assert.ok(cookies.length > 0);
    assert.ok(cookies.every((value) => value.toLowerCase().includes("httponly")));
    assert.ok(cookies.every((value) => value.toLowerCase().includes("samesite=lax")));
    const cookie = cookies.map((value) => value.split(";")[0]).join("; ");
    const catalog = await fetch(`${base}/catalogo`, { headers: { cookie }, redirect: "manual" });
    assert.equal(catalog.status, 200);

    for (const candidate of [email, `missing-${randomUUID()}@example.test`]) {
      const invalid = await mutation("login", { email: candidate, password: randomUUID() });
      assert.equal(invalid.status, 401);
      assert.equal((await invalid.json()).error.message, "E-mail ou senha inválidos.");
    }
    const logout = await mutation("logout", null, cookie);
    assert.equal(logout.status, 200);
    assert.ok(logout.headers.getSetCookie().some((value) => value.includes("Max-Age=0")));
    const jar = new Map(cookies.map((value) => {
      const pair = value.split(";")[0];
      const separator = pair.indexOf("=");
      return [pair.slice(0, separator), pair.slice(separator + 1)];
    }));
    for (const change of logout.headers.getSetCookie()) {
      const pair = change.split(";")[0];
      const separator = pair.indexOf("=");
      const name = pair.slice(0, separator);
      if (change.includes("Max-Age=0")) jar.delete(name);
      else jar.set(name, pair.slice(separator + 1));
    }
    const afterLogout = await fetch(`${base}/catalogo`, {
      headers: { cookie: [...jar].map(([name, value]) => `${name}=${value}`).join("; ") },
      redirect: "manual",
    });
    assert.equal(afterLogout.status, 307);
  } finally {
    // Find the temporary account even if an assertion failed before userId was assigned.
    if (!userId) {
      const listed = await admin.auth.admin.listUsers({ perPage: 1000 });
      userId = listed.data?.users.find((entry) => entry.email === email)?.id;
    }
    if (userId) {
      const removed = await admin.auth.admin.deleteUser(userId);
      assert.equal(removed.error, null);
    }
  }
});

test("LOGIN-06 — conta de teste criada pela API administrativa persiste e autentica", async () => {
  const email = `admin-check-${randomUUID()}@example.test`;
  const password = randomUUID();
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  assert.equal(created.error, null);
  const userId = created.data.user.id;
  try {
    const stored = await admin.auth.admin.getUserById(userId);
    assert.equal(stored.error, null);
    assert.equal(stored.data.user.email, email);
    const response = await mutation("login", { email, password });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).result.data, { success: true });
  } finally {
    const removed = await admin.auth.admin.deleteUser(userId);
    assert.equal(removed.error, null);
  }
});
