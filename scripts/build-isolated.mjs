import { spawn } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempBase = path.resolve(os.tmpdir());
const tempBaseRelativeToProject = path.relative(projectRoot, tempBase);

if (
  !tempBaseRelativeToProject ||
  (!tempBaseRelativeToProject.startsWith("..") && !path.isAbsolute(tempBaseRelativeToProject)) ||
  tempBase.toLowerCase().includes("onedrive")
) {
  throw new Error("A pasta temporária precisa ficar fora do projeto e do OneDrive.");
}

dotenv.config({ path: path.join(projectRoot, ".env.local"), quiet: true });
dotenv.config({ path: path.join(projectRoot, ".env"), quiet: true });

const tempProject = await mkdtemp(path.join(tempBase, "empresti-build-"));
const excludedDirectories = new Set([
  ".git",
  ".next",
  ".next-validation",
  ".vercel",
  "build",
  "coverage",
  "node_modules",
  "playwright-report",
  "test-results",
]);

function shouldCopy(sourcePath) {
  const relativePath = path.relative(projectRoot, sourcePath);
  if (!relativePath) return true;

  const pathParts = relativePath.split(path.sep);
  if (pathParts.some((part) => excludedDirectories.has(part))) return false;

  const fileName = path.basename(sourcePath);
  return !fileName.startsWith(".env") && !fileName.endsWith(".tsbuildinfo");
}

function runNpm(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", args, {
      cwd: tempProject,
      env: process.env,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`npm ${args.join(" ")} falhou (${signal ?? `código ${code ?? "desconhecido"}`}).`));
    });
  });
}

try {
  await cp(projectRoot, tempProject, { recursive: true, filter: shouldCopy });
  console.log("Build isolado fora do OneDrive; dependências e saída serão temporárias.");
  await runNpm(["ci", "--include=dev", "--no-audit", "--no-fund"]);
  await runNpm(["run", "build"]);
  console.log("Build isolado concluído.");
} finally {
  const relativeTempPath = path.relative(tempBase, tempProject);
  if (
    !relativeTempPath ||
    relativeTempPath === ".." ||
    relativeTempPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeTempPath)
  ) {
    throw new Error("Caminho temporário inesperado; a limpeza automática foi interrompida.");
  }

  await rm(tempProject, { recursive: true, force: true, maxRetries: 3 });
}
