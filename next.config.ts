import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Pyodide ships ~12MB of immutable wasm/asm.js per release.
        // Long-cache so repeat visitors don't redownload on every lesson load.
        // No `immutable` keyword — files in /public aren't content-hashed,
        // so a force-refresh must still be allowed to revalidate after a
        // pyodide version bump.
        source: "/pyodide/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
      {
        source: "/pyodide-worker.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
