import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { baixarPixabay, buscarPixabay, PIXABAY_CACHE_TTL_MS } from "./buscar-pixabay.mjs";

const TEST_KEY = "SEGREDO-SINTETICO-NUNCA-EXIBIR";
const IMAGE_URL = "https://pixabay.com/get/photo-1280.jpg";

function hit(overrides = {}) {
  return {
    id: 123456,
    type: "photo",
    pageURL: "https://pixabay.com/photos/office-notebook-123456/",
    largeImageURL: IMAGE_URL,
    imageWidth: 1600,
    imageHeight: 1200,
    user: "Autor de teste",
    user_id: 77,
    tags: "notebook, office",
    ...overrides,
  };
}

async function temporaryDirectory(t, prefix) {
  const path = await mkdtemp(join(tmpdir(), prefix));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

test("PIX-01 — exige chave local e consulta específica sem expor segredo em erros", async () => {
  let calls = 0;
  await assert.rejects(buscarPixabay("notebook", {
    apiKey: "",
    fetchImpl: async () => { calls++; throw new Error("não deveria chamar"); },
  }), /PIXABAY_API_KEY/);
  await assert.rejects(buscarPixabay("x", { apiKey: TEST_KEY }), /entre 2 e 100/);
  assert.equal(calls, 0);

  await assert.rejects(buscarPixabay("notebook", {
    apiKey: TEST_KEY,
    fetchImpl: async (url) => { throw new Error(`erro de rede: ${url}?key=${TEST_KEY}`); },
  }), (error) => !error.message.includes(TEST_KEY) && /Falha de rede/.test(error.message));
});

test("PIX-02 — limita busca, filtra resultados inválidos e reutiliza cache por 24 horas", async (t) => {
  const cacheDir = await temporaryDirectory(t, "pixabay-cache-");
  let calls = 0;
  let nowMs = 1_800_000_000_000;
  const fetchImpl = async (input, init) => {
    calls++;
    const url = new URL(input);
    assert.equal(url.origin + url.pathname, "https://pixabay.com/api/");
    assert.equal(url.searchParams.get("key"), TEST_KEY);
    assert.equal(url.searchParams.get("q"), "notebook 14");
    assert.equal(url.searchParams.get("image_type"), "photo");
    assert.equal(url.searchParams.get("orientation"), "horizontal");
    assert.equal(url.searchParams.get("min_width"), "800");
    assert.equal(url.searchParams.get("min_height"), "600");
    assert.equal(url.searchParams.get("safesearch"), "true");
    assert.equal(url.searchParams.get("per_page"), "20");
    assert.equal(init.redirect, "error");
    return new Response(JSON.stringify({ hits: [
      hit(),
      hit({ id: 2, pageURL: "https://example.invalid/photo/2/" }),
      hit({ id: 3, imageWidth: 400, imageHeight: 300 }),
    ] }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const first = await buscarPixabay("  notebook 14  ", { apiKey: TEST_KEY, cacheDir, fetchImpl, now: () => nowMs });
  assert.equal(first.source, "Pixabay");
  assert.equal(first.cached, false);
  assert.equal(first.resultCount, 1);
  assert.equal(first.results[0].author, "Autor de teste");
  assert.equal(first.results[0].authorProfileURL, "https://pixabay.com/users/Autor%20de%20teste-77/");

  const files = await readdir(cacheDir);
  assert.equal(files.length, 1);
  const cacheText = await readFile(join(cacheDir, files[0]), "utf8");
  assert.equal(cacheText.includes(TEST_KEY), false);
  assert.equal(cacheText.includes("key="), false);

  nowMs += PIXABAY_CACHE_TTL_MS - 1;
  const cached = await buscarPixabay("notebook 14", {
    apiKey: TEST_KEY,
    cacheDir,
    fetchImpl: async () => { throw new Error("cache expirou antes do prazo"); },
    now: () => nowMs,
  });
  assert.equal(cached.cached, true);
  assert.equal(calls, 1);

  nowMs += 2;
  const refreshed = await buscarPixabay("notebook 14", { apiKey: TEST_KEY, cacheDir, fetchImpl, now: () => nowMs });
  assert.equal(refreshed.cached, false);
  assert.equal(calls, 2);
});

test("PIX-03 — baixa um ID selecionado do cache, limita redirecionamento e não sobrescreve", async (t) => {
  const base = await temporaryDirectory(t, "pixabay-download-");
  const cacheDir = join(base, "cache");
  const destination = join(base, "selected.jpg");
  await buscarPixabay("notebook", {
    apiKey: TEST_KEY,
    cacheDir,
    fetchImpl: async () => new Response(JSON.stringify({ hits: [hit()] }), { status: 200 }),
  });

  const seen = [];
  const fetchImpl = async (input, init) => {
    const url = new URL(input);
    seen.push(url.href);
    assert.equal(init.redirect, "manual");
    assert.equal(init.headers, undefined);
    if (url.hostname === "pixabay.com") {
      return new Response(null, { status: 302, headers: { location: "https://cdn.pixabay.com/photo/final.jpg" } });
    }
    return new Response(Buffer.from([1, 2, 3, 4]), { status: 200, headers: { "content-type": "image/jpeg" } });
  };

  const result = await baixarPixabay(123456, destination, { cacheDir, fetchImpl });
  assert.equal(result.source, "Pixabay");
  assert.equal(result.bytes, 4);
  assert.deepEqual([...await readFile(destination)], [1, 2, 3, 4]);
  assert.deepEqual(seen, [IMAGE_URL, "https://cdn.pixabay.com/photo/final.jpg"]);
  assert.equal(seen.some((url) => url.includes(TEST_KEY) || url.includes("key=")), false);

  await assert.rejects(baixarPixabay(123456, destination, { cacheDir, fetchImpl }), /já existe/);
  await assert.rejects(baixarPixabay(0, destination, { cacheDir, fetchImpl }), /ID Pixabay inválido/);
  await assert.rejects(baixarPixabay(123456, join(base, "file.pdf"), { cacheDir, fetchImpl }), /extensão/);
});

test("PIX-04 — recusa ID fora do cache, redirecionamento externo e arquivo grande", async (t) => {
  const base = await temporaryDirectory(t, "pixabay-block-");
  const cacheDir = join(base, "cache");
  await buscarPixabay("webcam", {
    apiKey: TEST_KEY,
    cacheDir,
    fetchImpl: async () => new Response(JSON.stringify({ hits: [hit({ id: 654321 })] }), { status: 200 }),
  });

  await assert.rejects(baixarPixabay(123456, join(base, "missing.jpg"), { cacheDir }), /não encontrado/);
  await assert.rejects(baixarPixabay(654321, join(base, "redirect.jpg"), {
    cacheDir,
    fetchImpl: async () => new Response(null, { status: 302, headers: { location: "https://example.invalid/image.jpg" } }),
  }), /Redirecionamento de imagem inválido/);
  await assert.rejects(baixarPixabay(654321, join(base, "large.jpg"), {
    cacheDir,
    fetchImpl: async () => new Response("small body", { status: 200, headers: {
      "content-type": "image/jpeg",
      "content-length": "10000001",
    } }),
  }), /limite de tamanho/);
});
