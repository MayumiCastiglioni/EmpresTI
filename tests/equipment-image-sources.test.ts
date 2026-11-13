import { describe, expect, it } from "vitest";
import { validImage } from "../src/server/initial-data/preflight";

const base = {
  photographer: "Autor", licenseCheckedAt: "2026-11-13",
  bucket: "equipment-images", width: 800, height: 600,
  sha256: "a".repeat(64), objectKey: `empresti/TI-0006/${"a".repeat(64)}.png`,
};
const pexels = {
  ...base, provider: "pexels", sourceId: "5092815",
  sourceUrl: "https://www.pexels.com/photo/modern-computer-placed-near-server-racks-5092815/",
  photographerUrl: "https://www.pexels.com/photo/modern-computer-placed-near-server-racks-5092815/",
  licenseUrl: "https://www.pexels.com/legal-pages/license/",
};
const commons = {
  ...base, provider: "wikimedia", sourceId: "Computer_monitor.jpg",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Computer_monitor.jpg",
  photographerUrl: "https://commons.wikimedia.org/wiki/User:Zzubnik",
  licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
};

describe("DEC-FOTOS-PUBLICACAO - fontes recuperadas no caminho usado pelo catalogo", () => {
  it("aceita Pexels e Commons mantendo autor e origem reais", () => {
    expect(validImage(pexels, "TI-0006")).toBe(true);
    expect(validImage(commons, "TI-0006")).toBe(true);
  });
  it("aceita CC0 e perfil Pexels", () => {
    expect(validImage({ ...commons, licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" }, "TI-0006")).toBe(true);
    expect(validImage({ ...pexels, photographerUrl: "https://www.pexels.com/@autor/" }, "TI-0006")).toBe(true);
  });
  it("recusa dominio falso, credencial, esquema ativo e mistura de fornecedores", () => {
    for (const sourceUrl of ["javascript:alert(1)", "https://www.pexels.com.evil.example/photo/x/", "https://secret@www.pexels.com/photo/x/", "https://www.pexels.com/photo/x/?token=secret"]) {
      expect(validImage({ ...pexels, sourceUrl }, "TI-0006")).toBe(false);
    }
    expect(validImage({ ...pexels, provider: "pixabay" }, "TI-0006")).toBe(false);
    expect(validImage({ ...commons, licenseUrl: pexels.licenseUrl }, "TI-0006")).toBe(false);
    expect(validImage({ ...pexels, objectKey: "empresti/TI-0007/file.png" }, "TI-0006")).toBe(false);
  });
});
