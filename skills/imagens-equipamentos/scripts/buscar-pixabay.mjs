import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PIXABAY_API_URL = "https://pixabay.com/api/";
export const PIXABAY_LICENSE_URL = "https://pixabay.com/service/license-summary/";
export const PIXABAY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const DEFAULT_CACHE_DIR = resolve(".cache/pixabay");
const MAX_CACHE_BYTES = 1_000_000;
const MAX_IMAGE_BYTES = 10_000_000;
const MAX_REDIRECTS = 3;
const PIXABAY_IMAGE_HOSTS = new Set(["pixabay.com", "cdn.pixabay.com"]);
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validHttpsUrl(value, hosts) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.has(url.hostname) && !url.username && !url.password &&
      !url.port && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function normalizeHit(value) {
  if (!isObject(value) || value.type !== "photo" || !Number.isSafeInteger(value.id) || value.id <= 0 ||
    !Number.isSafeInteger(value.user_id) || value.user_id <= 0 || typeof value.user !== "string" ||
    !value.user.trim() || value.user.length > 120 || typeof value.tags !== "string" ||
    !validHttpsUrl(value.pageURL, new Set(["pixabay.com"])) ||
    !validHttpsUrl(value.largeImageURL, PIXABAY_IMAGE_HOSTS) ||
    !Number.isSafeInteger(value.imageWidth) || value.imageWidth < 800 ||
    !Number.isSafeInteger(value.imageHeight) || value.imageHeight < 600) return null;

  return {
    id: value.id,
    type: "photo",
    pageURL: value.pageURL,
    largeImageURL: value.largeImageURL,
    tags: value.tags.slice(0, 1000),
    imageWidth: value.imageWidth,
    imageHeight: value.imageHeight,
    user: value.user.trim(),
    user_id: value.user_id,
  };
}

function cacheKey(query) {
  return createHash("sha256").update(JSON.stringify({ query, language: "pt", perPage: 20 })).digest("hex");
}

function isFreshCache(value, nowMs) {
  return isObject(value) && value.version === 1 && Number.isSafeInteger(value.createdAt) &&
    value.createdAt <= nowMs && nowMs - value.createdAt < PIXABAY_CACHE_TTL_MS &&
    Array.isArray(value.hits) && value.hits.length <= 20;
}

async function readCache(path, nowMs) {
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size > MAX_CACHE_BYTES) return null;
    const value = JSON.parse(await readFile(path, "utf8"));
    if (!isFreshCache(value, nowMs)) return null;
    const hits = value.hits.map(normalizeHit);
    if (hits.some((hit) => hit === null)) return null;
    return { version: 1, createdAt: value.createdAt, hits };
  } catch {
    return null;
  }
}

async function writeCache(path, cache) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(cache), { flag: "wx" });
    await rename(temporary, path);
  } catch {
    await rm(temporary, { force: true }).catch(() => {});
    throw new Error("Não foi possível guardar o cache local obrigatório do Pixabay.");
  }
}

function displaySearch(cacheId, hits, cached) {
  return {
    source: "Pixabay",
    cacheId,
    cached,
    resultCount: hits.length,
    results: hits.map((hit) => ({
      id: hit.id,
      pageURL: hit.pageURL,
      author: hit.user,
      authorProfileURL: `https://pixabay.com/users/${encodeURIComponent(hit.user)}-${hit.user_id}/`,
      tags: hit.tags,
      width: hit.imageWidth,
      height: hit.imageHeight,
    })),
  };
}

export async function buscarPixabay(query, {
  apiKey = process.env.PIXABAY_API_KEY,
  cacheDir = DEFAULT_CACHE_DIR,
  fetchImpl = fetch,
  now = () => Date.now(),
  timeoutMs = 10_000,
} = {}) {
  if (typeof query !== "string" || query.trim().length < 2 || query.trim().length > 100) {
    throw new Error("A busca precisa ter entre 2 e 100 caracteres.");
  }
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    throw new Error("PIXABAY_API_KEY não está configurada na máquina local.");
  }

  const normalizedQuery = query.trim();
  const key = cacheKey(normalizedQuery);
  const cachePath = resolve(cacheDir, `${key}.json`);
  const timestamp = now();
  const cached = await readCache(cachePath, timestamp);
  if (cached) return displaySearch(key.slice(0, 16), cached.hits, true);

  const url = new URL(PIXABAY_API_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", normalizedQuery);
  url.searchParams.set("lang", "pt");
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("min_width", "800");
  url.searchParams.set("min_height", "600");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "20");

  let response;
  try {
    response = await fetchImpl(url, { method: "GET", redirect: "error", signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new Error("Falha de rede ao consultar a API Pixabay.");
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => {});
    throw new Error(`A API Pixabay respondeu com HTTP ${response.status}.`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("A API Pixabay retornou uma resposta inválida.");
  }
  if (!isObject(payload) || !Array.isArray(payload.hits)) {
    throw new Error("A API Pixabay retornou uma resposta incompatível.");
  }

  const hits = payload.hits.slice(0, 20).map(normalizeHit).filter(Boolean);
  const result = { version: 1, createdAt: timestamp, hits };
  await writeCache(cachePath, result);
  return displaySearch(key.slice(0, 16), hits, false);
}

async function findCachedPhoto(id, cacheDir, nowMs) {
  let files;
  try {
    files = (await readdir(cacheDir)).filter((name) => /^[a-f0-9]{64}\.json$/.test(name));
  } catch {
    return null;
  }
  for (const name of files) {
    const cache = await readCache(resolve(cacheDir, name), nowMs);
    const hit = cache?.hits.find((candidate) => candidate.id === id);
    if (hit) return hit;
  }
  return null;
}

async function readImageBody(response, maxBytes) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    await response.body?.cancel().catch(() => {});
    throw new Error("A imagem excede o limite de tamanho.");
  }
  if (!response.body) throw new Error("A imagem não retornou conteúdo.");

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error("A imagem excede o limite de tamanho.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

async function fetchSelectedImage(urlValue, fetchImpl, timeoutMs) {
  let url = new URL(urlValue);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    if (!validHttpsUrl(url.href, PIXABAY_IMAGE_HOSTS)) throw new Error("A origem do arquivo não é permitida.");
    let response;
    try {
      response = await fetchImpl(url, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
    } catch {
      throw new Error("Falha de rede ao baixar a imagem selecionada.");
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => {});
      if (!location || redirects === MAX_REDIRECTS) throw new Error("Redirecionamento de imagem inválido.");
      try {
        const nextUrl = new URL(location, url);
        if (!validHttpsUrl(nextUrl.href, PIXABAY_IMAGE_HOSTS)) throw new Error("host não permitido");
        url = nextUrl;
      } catch {
        throw new Error("Redirecionamento de imagem inválido.");
      }
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      throw new Error(`O download da imagem respondeu com HTTP ${response.status}.`);
    }
    const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      await response.body?.cancel().catch(() => {});
      throw new Error("O arquivo selecionado não foi identificado como imagem suportada.");
    }
    return readImageBody(response, MAX_IMAGE_BYTES);
  }
  throw new Error("Redirecionamento de imagem inválido.");
}

export async function baixarPixabay(id, destino, {
  cacheDir = DEFAULT_CACHE_DIR,
  fetchImpl = fetch,
  now = () => Date.now(),
  timeoutMs = 10_000,
} = {}) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("ID Pixabay inválido.");
  if (typeof destino !== "string" || !destino.trim() || ![".jpg", ".jpeg", ".png", ".webp"].includes(extname(destino).toLowerCase())) {
    throw new Error("Informe um destino local com extensão JPG, PNG ou WebP.");
  }
  const hit = await findCachedPhoto(id, cacheDir, now());
  if (!hit) throw new Error("ID não encontrado em uma busca Pixabay local ainda válida; faça uma nova busca.");

  const bytes = await fetchSelectedImage(hit.largeImageURL, fetchImpl, timeoutMs);
  const destination = resolve(destino);
  try {
    await writeFile(destination, bytes, { flag: "wx" });
  } catch (error) {
    if (error?.code === "EEXIST") throw new Error("O destino já existe; nenhum arquivo foi sobrescrito.");
    throw new Error("Não foi possível salvar o arquivo local.");
  }
  return { source: "Pixabay", id, file: destination, bytes: bytes.length };
}

async function main() {
  const { config } = await import("dotenv");
  config({ path: resolve(".env.local"), quiet: true });

  const [mode, first, second] = process.argv.slice(2);
  if (mode === "buscar" && first) {
    process.stdout.write(`${JSON.stringify(await buscarPixabay(first), null, 2)}\n`);
    return;
  }
  if (mode === "baixar" && first && second && /^[1-9]\d*$/.test(first)) {
    process.stdout.write(`${JSON.stringify(await baixarPixabay(Number(first), second), null, 2)}\n`);
    return;
  }
  throw new Error("Uso: buscar-pixabay.mjs buscar <consulta> OU baixar <id> <arquivo-local.jpg>");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Falha na ferramenta local Pixabay.");
    process.exitCode = 1;
  });
}
