import assert from "node:assert/strict";
import { test } from "node:test";
import { status } from "./status.mjs";

test("PROVA-01 — a fixture retorna o estado esperado", () => {
  assert.equal(status(), "ok");
});
