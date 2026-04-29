// Copy the Pyodide runtime files from node_modules into public/pyodide/ so
// they're served same-origin instead of from cdn.jsdelivr.net (which is
// flaky / blocked in some networks). This is the fix for "Run never works"
// — the worker was hanging on jsdelivr requests that never resolved.
//
// Runs on every predev/prebuild via package.json.

import { mkdir, copyFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";

const REPO = resolve(new URL("..", import.meta.url).pathname);
const SRC = join(REPO, "node_modules", "pyodide");
const DST = join(REPO, "public", "pyodide");

// Files Pyodide needs at runtime. The package ships extras (.d.ts, .map,
// README, console.html) we don't need served. Copy only what the worker
// + loadPyodide will actually fetch.
const RUNTIME_FILES = [
  "pyodide.js",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "pyodide.mjs",
  "pyodide-lock.json",
  "python_stdlib.zip",
];

async function main() {
  if (!existsSync(SRC)) {
    console.error(
      `pyodide package not found at ${SRC}. Run \`pnpm install\` first.`,
    );
    process.exit(1);
  }
  await mkdir(DST, { recursive: true });

  // Copy the named runtime files.
  for (const f of RUNTIME_FILES) {
    const from = join(SRC, f);
    if (!existsSync(from)) {
      console.warn(`  skip (missing): ${f}`);
      continue;
    }
    await copyFile(from, join(DST, f));
  }

  // Pyodide also lazy-loads packages from `<indexURL>/<name>.whl` and
  // similar. The package ships a flat directory for those; copy any
  // remaining .whl / .tar / .data / .json files we haven't already grabbed.
  const entries = await readdir(SRC);
  for (const entry of entries) {
    if (RUNTIME_FILES.includes(entry)) continue;
    if (!entry.endsWith(".whl") && !entry.endsWith(".data")) continue;
    const from = join(SRC, entry);
    const s = await stat(from);
    if (!s.isFile()) continue;
    await copyFile(from, join(DST, entry));
  }

  console.log(`Pyodide copied to ${DST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
