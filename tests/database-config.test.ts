import { afterEach, describe, expect, it, vi } from "vitest";
import { getDatabase } from "@/src/server/db";

afterEach(() => vi.unstubAllEnvs());

describe("MIN-01 — destino local do banco", () => {
  it("AZ-07 rejeita configuração ausente antes de abrir conexão", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(() => getDatabase()).toThrow("Configure DATABASE_URL para o banco local.");
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
});
