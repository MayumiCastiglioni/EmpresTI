import { describe, expect, it } from "vitest";

import { getEntryRoute } from "@/src/lib/entry-route";

describe("getEntryRoute", () => {
  it("direciona quem não tem sessão para o login", () => {
    expect(getEntryRoute("anonymous")).toBe("/login");
  });

  it("direciona quem já tem sessão para o catálogo", () => {
    expect(getEntryRoute("authenticated")).toBe("/catalogo");
  });
});
