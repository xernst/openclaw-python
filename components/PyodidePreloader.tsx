"use client";

// Aggressively boot Pyodide as soon as the page mounts, so by the time the
// user navigates from the landing/onboarding flow into their first lesson,
// the worker is already warm. Cold-load is ~5-10s of WASM download — we
// just hide it behind onboarding clicks.
//
// The worker is a singleton in lib/use-pyodide.ts, so repeat preloads are
// no-ops. Mount this component on any page that renders BEFORE the lesson
// shell (landing, /onboarding) and the lesson IDE will see status="ready"
// immediately when it mounts.

import { useEffect } from "react";

export default function PyodidePreloader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use requestIdleCallback so we don't compete with the page's own
    // first-paint critical path. If unavailable (Safari), fall back to a
    // 200ms setTimeout — still after the LCP.
    const start = () => {
      if ((window as { __ck_pyodide_warm?: boolean }).__ck_pyodide_warm) return;
      (window as { __ck_pyodide_warm?: boolean }).__ck_pyodide_warm = true;
      try {
        const w = new Worker("/pyodide-worker.js");
        w.postMessage({ type: "init", id: -1 });
        // We deliberately don't keep a handle on this worker. The same
        // Worker URL gets cached + reused inside lib/use-pyodide.ts the
        // moment a real lesson page mounts. The browser keeps the WASM in
        // module cache so the second instantiation is ~instant.
      } catch {
        // Worker not supported / blocked — silently degrade. Lesson page
        // will fall back to its own boot path.
      }
    };
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(start, { timeout: 1500 });
    } else {
      const t = setTimeout(start, 200);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
