import { test } from "node:test";
import assert from "node:assert/strict";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });
const url = new URL(process.env.DATABASE_URL);
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.searchParams.has("host") || url.searchParams.has("hostaddr")) throw new Error("Banco remoto recusado");
url.pathname = "/empresti_image_validation_20261106";

test("DAT-03 — image opcional, constraint e leitura por tenant em Postgres local", async () => {
  const client = new pg.Client({ connectionString: url.toString(), connectionTimeoutMillis: 3000 });
  await client.connect();
  try {
    await client.query("BEGIN");
    const tenantA = "11111111-1111-4111-8111-111111111111";
    const tenantB = "22222222-2222-4222-8222-222222222222";
    const userA = "33333333-3333-4333-8333-333333333333";
    const userB = "44444444-4444-4444-8444-444444444444";
    await client.query(`INSERT INTO tenants(id,slug,name) VALUES ($1,'image-test-a','A'),($2,'image-test-b','B')`, [tenantA,tenantB]);
    await client.query(`INSERT INTO memberships(tenant_id,user_id) VALUES ($1,$2),($3,$4)`, [tenantA,userA,tenantB,userB]);
    await client.query(`INSERT INTO equipment(id,tenant_id,asset_tag,name,category,updated_at) VALUES ('55555555-5555-4555-8555-555555555555',$1,'IMAGE-TEST','Teste','monitor',now())`,[tenantA]);
    assert.equal((await client.query(`SELECT image FROM equipment WHERE asset_tag='IMAGE-TEST'`)).rows[0].image,null);
    const image = { provider: "pixabay", sourceId: "1", width: 800, height: 600 };
    await client.query(`UPDATE equipment SET image=$1 WHERE asset_tag='IMAGE-TEST'`,[image]);
    for (const invalid of ['[]','"scalar"','1','null']) {
      await client.query("SAVEPOINT invalid_image");
      await assert.rejects(client.query(`UPDATE equipment SET image=$1::jsonb WHERE asset_tag='IMAGE-TEST'`,[invalid]),e=>e.code==='23514');
      await client.query("ROLLBACK TO SAVEPOINT invalid_image");
    }
    // Permissões temporárias apenas dentro desta transação, para testar RLS sem owner.
    await client.query("GRANT USAGE ON SCHEMA public TO authenticated");
    await client.query("GRANT SELECT ON equipment TO authenticated");
    await client.query("SET LOCAL ROLE authenticated");
    await client.query("SELECT set_config('request.jwt.claim.sub',$1,true)",[userA]);
    assert.deepEqual((await client.query(`SELECT image FROM equipment WHERE asset_tag='IMAGE-TEST'`)).rows,[{image}]);
    await client.query("SELECT set_config('request.jwt.claim.sub',$1,true)",[userB]);
    assert.equal((await client.query(`SELECT image FROM equipment WHERE asset_tag='IMAGE-TEST'`)).rowCount,0);
    await client.query("SELECT set_config('request.jwt.claim.sub','',true)");
    assert.equal((await client.query(`SELECT image FROM equipment WHERE asset_tag='IMAGE-TEST'`)).rowCount,0);
    await client.query("RESET ROLE");
    assert.equal((await client.query(`SELECT relrowsecurity FROM pg_class WHERE oid='public.equipment'::regclass`)).rows[0].relrowsecurity,true);
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});
