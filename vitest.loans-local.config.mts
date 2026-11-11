import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/loans-local.integration.ts"],
    maxWorkers: 1,
    testTimeout: 30000,
    hookTimeout: 15000,
  },
});
