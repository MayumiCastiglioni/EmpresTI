import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node", include: ["tests/initial-data-local.integration.ts", "tests/professor-local.integration.ts", "tests/run-initial-data-local.integration.ts"], maxWorkers: 1, testTimeout: 60000, hookTimeout: 10000 } });
