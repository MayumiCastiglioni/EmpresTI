import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { preparar, validar } from "./preparar.mjs";

test("IMG-01 IMG-02 IMG-03 IMG-04 — preparação local e validação do manifesto", async (t) => {
  const base = await mkdtemp(join(tmpdir(), "empresti-fotos-"));
  t.after(() => rm(base, { recursive: true, force: true }));
  const entrada = join(base, "entrada.png"), destino = join(base, "final.png");
  await sharp({ create: { width: 1000, height: 900, channels: 3, background: "red" } }).png().toFile(entrada);
  const result = await preparar(entrada, destino);
  assert.equal((await sharp(destino).metadata()).width, 800);
  assert.equal((await sharp(destino).metadata()).height, 600);
  assert.equal((await preparar(entrada, destino)).reutilizado, true);
  const foto = { patrimonio: "TI-0001", tipo: "monitor", consulta: "monitor", pexelsId: 1,
    origem: "https://www.pexels.com/photo/1/", fotografo: "Autor fictício de teste",
    fotografoUrl: "https://www.pexels.com/@teste/", licencaUrl: "https://www.pexels.com/license/",
    licencaConsultadaEm: "2026-11-06", arquivo: "final.png", largura: 800, altura: 600, sha256: result.sha256,
    revisao: { estado: "aprovada", responsavel: "fixture sintética", data: "2026-11-06" } };
  const manifesto = { patrimoniosEsperados: ["TI-0001"], fotos: [foto] };
  assert.equal((await validar(manifesto, base)).quantidade, 1);
  await assert.rejects(validar({ ...manifesto, fotos: [{ ...foto, revisao: null }] }, base), /visual/);
  await assert.rejects(validar({ ...manifesto, fotos: [{ ...foto, sha256: "invalido" }] }, base), /Hash/);
  await assert.rejects(validar({ ...manifesto, fotos: [{ ...foto, fotografo: "" }] }, base), /créditos/);
  await assert.rejects(validar({ patrimoniosEsperados: ["TI-0001", "TI-0002"], fotos: [foto, { ...foto, patrimonio: "TI-0002" }] }, base), /duplicado/);
  await assert.rejects(validar({ patrimoniosEsperados: ["TI-0001", "TI-0002"], fotos: [foto, { ...foto, patrimonio: "TI-0002", pexelsId: 2 }] }, base), /duplicado/);
  await assert.rejects(validar({ ...manifesto, patrimoniosEsperados: ["TI-0002"] }, base), /Patrimônio/);
  const original = await readFile(destino);
  await sharp({ create: { width: 900, height: 900, channels: 3, background: "blue" } }).png().toFile(entrada);
  await assert.rejects(preparar(entrada, destino), /nada sobrescrito/);
  assert.deepEqual(await readFile(destino), original);
  await writeFile(entrada, "corrompido");
  await assert.rejects(preparar(entrada, join(base, "invalido.png")));
  await sharp({ create: { width: 10, height: 10, channels: 3, background: "red" } }).png().toFile(destino);
  await assert.rejects(validar(manifesto, base), /Dimensões/);
});

test("IMG-01 — PNG, recorte proporcional central e SHA-256 independente", async (t) => {
  const base = await mkdtemp(join(tmpdir(), "empresti-recorte-"));
  t.after(() => rm(base, { recursive: true, force: true }));
  const origem = join(base, "faixas.png"), destino = join(base, "recorte.png");
  // Fonte 2:1: cover para 4:3 deve remover as faixas laterais, sem esticar.
  const pixels = Buffer.alloc(1200 * 600 * 3);
  for (let y = 0; y < 600; y++) {
    for (let x = 0; x < 1200; x++) {
      const offset = (y * 1200 + x) * 3;
      if (x < 200) pixels[offset] = 255;
      else if (x >= 1000) pixels[offset + 2] = 255;
      else pixels[offset + 1] = 255;
    }
  }
  await sharp(pixels, { raw: { width: 1200, height: 600, channels: 3 } }).png().toFile(origem);
  const result = await preparar(origem, destino);
  const bytes = await readFile(destino);
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 800);
  assert.equal(metadata.height, 600);
  assert.equal(result.sha256, createHash("sha256").update(bytes).digest("hex"));
  const { data, info } = await sharp(bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const x of [20, 400, 780]) {
    const offset = (300 * info.width + x) * info.channels;
    assert.deepEqual([...data.subarray(offset, offset + 3)], [0, 255, 0]);
  }
});
