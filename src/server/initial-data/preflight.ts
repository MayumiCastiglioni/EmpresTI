export const initialEquipment = [
  ["TI-0001", "Notebook 14 polegadas", "notebook", "DISPONIVEL"],
  ["TI-0002", "Notebook 15 polegadas", "notebook", "DISPONIVEL"],
  ["TI-0003", "Notebook 13 polegadas", "notebook", "DISPONIVEL"],
  ["TI-0004", "Notebook 15 polegadas", "notebook", "MANUTENCAO"],
  ["TI-0005", "Monitor 24 polegadas", "monitor", "DISPONIVEL"],
  ["TI-0006", "Monitor 27 polegadas", "monitor", "DISPONIVEL"],
  ["TI-0007", "Monitor 22 polegadas", "monitor", "MANUTENCAO"],
  ["TI-0008", "Cabo HDMI 2 m", "cabo", "DISPONIVEL"],
  ["TI-0009", "Cabo USB-C 1 m", "cabo", "DISPONIVEL"],
  ["TI-0010", "Cabo de rede 3 m", "cabo", "DISPONIVEL"],
  ["TI-0011", "Webcam Full HD", "camera", "DISPONIVEL"],
  ["TI-0012", "Câmera compacta", "camera", "DISPONIVEL"],
] as const;

type JsonObject = Record<string, unknown>;
function object(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const imageKeys = ["provider", "sourceId", "sourceUrl", "photographer", "photographerUrl", "licenseUrl", "licenseCheckedAt", "bucket", "objectKey", "width", "height", "sha256"] as const;
export type EquipmentImage = {
  provider: "pixabay"; sourceId: string; sourceUrl: string; photographer: string;
  photographerUrl: string; licenseUrl: string; licenseCheckedAt: string;
  bucket: "equipment-images"; objectKey: string; width: 800; height: 600; sha256: string;
};
function pixabayUrl(value: unknown, pathPrefix = "/"): boolean {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === "pixabay.com" && !u.username && !u.password &&
      !u.search && !u.hash && !u.port && u.pathname.length > 1 && u.pathname.startsWith(pathPrefix) &&
      (pathPrefix !== "/users/" || /^\/users\/[^/]+\/?$/.test(u.pathname));
  } catch { return false; }
}
export function validImage(value: unknown, assetTag: string): value is EquipmentImage {
  if (!object(value) || Object.keys(value).length !== imageKeys.length || !imageKeys.every(k => Object.hasOwn(value, k))) return false;
  return value.provider === "pixabay" && typeof value.sourceId === "string" && /^[1-9]\d*$/.test(value.sourceId) &&
    pixabayUrl(value.sourceUrl) && pixabayUrl(value.photographerUrl, "/users/") &&
    value.licenseUrl === "https://pixabay.com/service/license-summary/" &&
    typeof value.photographer === "string" && value.photographer.trim().length > 0 &&
    typeof value.licenseCheckedAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.licenseCheckedAt) &&
    Number.isFinite(Date.parse(value.licenseCheckedAt)) && new Date(value.licenseCheckedAt).toISOString().slice(0,10) === value.licenseCheckedAt &&
    value.width === 800 && value.height === 600 && value.bucket === "equipment-images" &&
    typeof value.sha256 === "string" && /^[a-f0-9]{64}$/.test(value.sha256) &&
    value.objectKey === `empresti/${assetTag}/${value.sha256}.png`;
}
export type ExistingEquipment = {
  assetTag: string; name: string; category: string; status: string; image: unknown;
};
export type PreflightReport = {
  status: "blocked" | "equipment-comparison-passed";
  create: string[]; reuse: string[];
  issues: { assetTag: string; field: string }[];
};

// Pure equipment comparison only: does not read credentials, database, Auth or Storage.
// A passed report is not authorization to write: photo bytes/review and account need separate checks.
export function preflightEquipment(photos: unknown, existing: readonly ExistingEquipment[]): PreflightReport {
  const report: PreflightReport = { status: "blocked", create: [], reuse: [], issues: [] };
  if (!object(photos)) { report.issues.push({ assetTag: "lote", field: "photos" }); return report; }
  const expected = new Set<string>(initialEquipment.map(e => e[0]));
  for (const key of Object.keys(photos)) if (!expected.has(key)) report.issues.push({ assetTag: "lote", field: "unexpected-photo" });
  const ids = new Set<string>(), hashes = new Set<string>();
  for (const [assetTag, name, category, status] of initialEquipment) {
    const image = photos[assetTag];
    if (!validImage(image, assetTag)) { report.issues.push({ assetTag, field: "image" }); continue; }
    if (ids.has(image.sourceId) || hashes.has(image.sha256)) report.issues.push({ assetTag, field: "duplicate-photo" });
    ids.add(image.sourceId); hashes.add(image.sha256);
    const matches = existing.filter(e => e.assetTag === assetTag);
    if (matches.length > 1) { report.issues.push({ assetTag, field: "duplicate-equipment" }); continue; }
    const current = matches[0];
    if (!current) { report.create.push(assetTag); continue; }
    const before = report.issues.length;
    if (current.name !== name) report.issues.push({ assetTag, field: "name" });
    if (current.category !== category) report.issues.push({ assetTag, field: "category" });
    if (current.status !== status) report.issues.push({ assetTag, field: "status" });
    if (!object(current.image) || Object.keys(current.image).length !== imageKeys.length ||
      imageKeys.some(key => !object(current.image) || current.image[key] !== image[key])) report.issues.push({ assetTag, field: "image" });
    if (report.issues.length === before) report.reuse.push(assetTag);
  }
  if (report.issues.length === 0) report.status = "equipment-comparison-passed";
  else { report.create = []; report.reuse = []; }
  return report;
}
