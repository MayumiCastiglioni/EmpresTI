import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

export async function preparar(origem, destino) {
  const bytes = await sharp(await readFile(origem), { limitInputPixels: 40000000 })
    .rotate().resize(800, 600, { fit: "cover", position: "centre" }).png().toBuffer();
  const metadata = await sharp(bytes).metadata();
  if (metadata.width !== 800 || metadata.height !== 600) throw new Error("Dimensões inválidas");
  let reutilizado = false;
  try {
    await writeFile(destino, bytes, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    if (hash(await readFile(destino)) !== hash(bytes)) throw new Error("Destino contém imagem diferente; nada sobrescrito");
    reutilizado = true;
  }
  return { arquivo: resolve(destino), largura: 800, altura: 600, sha256: hash(bytes), reutilizado };
}

function texto(value) { return typeof value === "string" && value.trim().length > 0; }
function urlPixabay(value, pathPrefix = "/") {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === "pixabay.com" && !u.port && !u.search &&
      !u.hash && !u.username && !u.password && u.pathname.length > 1 && u.pathname.startsWith(pathPrefix) &&
      (pathPrefix !== "/users/" || /^\/users\/[^/]+\/?$/.test(u.pathname));
  }
  catch { return false; }
}

export async function validar(manifesto, base) {
  const { patrimoniosEsperados, fotos } = manifesto;
  if (!Array.isArray(patrimoniosEsperados) || !patrimoniosEsperados.length ||
    !patrimoniosEsperados.every(texto) || new Set(patrimoniosEsperados).size !== patrimoniosEsperados.length ||
    !Array.isArray(fotos) || fotos.length !== patrimoniosEsperados.length) throw new Error("Conjunto de patrimônios inválido");
  const patrimonios = new Set(), ids = new Set(), hashes = new Set();
  for (const foto of fotos) {
    if (!patrimoniosEsperados.includes(foto.patrimonio) || patrimonios.has(foto.patrimonio)) throw new Error("Patrimônio ausente, extra ou duplicado");
    if (![foto.tipo, foto.consulta, foto.fotografo, foto.arquivo, foto.licencaConsultadaEm].every(texto) ||
      !urlPixabay(foto.origem, "/") || !urlPixabay(foto.fotografoUrl, "/users/") ||
      foto.licencaUrl !== "https://pixabay.com/service/license-summary/") throw new Error("Metadados ou créditos Pixabay incompletos");
    if (!Number.isSafeInteger(foto.pixabayId) || foto.pixabayId <= 0 || ids.has(foto.pixabayId)) throw new Error("ID Pixabay inválido ou duplicado");
    if (foto.revisao?.estado !== "aprovada" || !texto(foto.revisao.responsavel) || !texto(foto.revisao.data)) throw new Error("Revisão visual pendente");
    const bytes = await readFile(resolve(base, foto.arquivo));
    const m = await sharp(bytes).metadata();
    if (m.width !== 800 || m.height !== 600 || foto.largura !== 800 || foto.altura !== 600) throw new Error("Dimensões inválidas");
    const digest = hash(bytes);
    if (digest !== foto.sha256 || hashes.has(digest)) throw new Error("Hash incorreto ou conteúdo duplicado");
    patrimonios.add(foto.patrimonio); ids.add(foto.pixabayId); hashes.add(digest);
  }
  return { quantidade: fotos.length, estado: "validacao-local-aprovada" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [modo, entrada, saida] = process.argv.slice(2);
    if (modo === "preparar" && entrada && saida) console.log(JSON.stringify(await preparar(entrada, saida)));
    else if (modo === "validar" && entrada && saida) console.log(JSON.stringify(await validar(JSON.parse(await readFile(entrada, "utf8")), saida)));
    else throw new Error("Uso: preparar <origem> <destino> OU validar <manifesto.json> <diretorio-base>");
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
