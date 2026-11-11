import { afterEach, describe, expect, it, vi } from "vitest";
import { databaseConnectionString, getDatabase } from "@/src/server/db";

afterEach(() => vi.unstubAllEnvs());

describe("MIN-01 — destino local do banco", () => {
  it("AZ-07 rejeita configuração ausente antes de abrir conexão", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(() => getDatabase()).toThrow("Configure DATABASE_URL no servidor.");
  });

  it.each([
    "postgresql://fixture:fixture@remote.example/postgres",
    "postgresql://fixture:fixture@127.0.0.1/postgres?host=remote.example",
    "postgresql://fixture:fixture@127.0.0.1/postgres?hostaddr=192.0.2.1",
    "https://127.0.0.1/postgres",
    "invalid",
  ])("AZ-07 recusa destino não local ou inválido (%#)", (url) => {
    vi.stubEnv("DATABASE_URL", url);
    expect(() => getDatabase()).toThrow();
  });

  it.each([
    "postgresql://fixture:fixture@db.fixture.supabase.co:5432/postgres",
    "postgresql://postgres.fixture:fixture@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  ])("EMP-01 runtime de produção aceita Supabase sem conectar (%#)", (url) => {
    expect(databaseConnectionString({ NODE_ENV: "production", DATABASE_URL: url })).toBe(url);
    for (const mode of ["test", "development"] as const) {
      expect(() => databaseConnectionString({ NODE_ENV: mode, DATABASE_URL: url })).toThrow();
    }
  });

  it.each([
    "postgresql://fixture:fixture@remote.example/postgres",
    "postgresql://fixture:fixture@db.fixture.supabase.co.evil.test/postgres",
    "postgresql://fixture:fixture@aws-0-sa-east-1.pooler.supabase.com.evil.test/postgres",
    "postgresql://fixture:fixture@db.fixture.supabase.co/postgres?host=remote.example",
    "postgresql://fixture:fixture@db.fixture.supabase.co/postgres?HOSTADDR=192.0.2.1",
    "https://db.fixture.supabase.co/postgres",
    "invalid-secret-fixture",
  ])("EMP-01 produção rejeita destino/override inválido sem expor segredo (%#)", (url) => {
    expect(() => databaseConnectionString({ NODE_ENV: "production", DATABASE_URL: url })).toThrow();
    try {
      databaseConnectionString({ NODE_ENV: "production", DATABASE_URL: url });
    } catch (error) {
      expect(String(error)).not.toContain("fixture");
    }
  });
});
