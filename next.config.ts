import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the existing OneDrive-managed .next tree, which fails cleanup.
  distDir: "build",
};

export default nextConfig;
