// public/pyodide-worker.js
// Pyodide Web Worker. Loads CPython-on-WASM from CDN, runs user code,
// captures stdout, and reports results back.
//
// Boot.dev's blog post on the same pattern:
// https://www.boot.dev/blog/python/python-in-the-browser/

// Self-hosted Pyodide. Copied from node_modules/pyodide/ to /public/pyodide/
// by scripts/copy-pyodide.mjs (runs on predev + prebuild). Same-origin
// loading works even when jsdelivr is blocked / unreachable.
importScripts("/pyodide/pyodide.js");

let pyodide = null;
let loading = null;

async function ensurePyodide() {
  // Always echo current state so a freshly-mounted hook gets a status reply,
  // even when the worker is already warm. Without this, soft navigations land
  // on a page whose Run button stays disabled because the hook sent `init` but
  // the worker (already loaded) had no new status to broadcast.
  if (pyodide) {
    self.postMessage({ type: "status", payload: "ready" });
    return pyodide;
  }
  if (loading) {
    self.postMessage({ type: "status", payload: "loading" });
    return loading;
  }
  loading = (async () => {
    self.postMessage({ type: "status", payload: "loading" });
    pyodide = await self.loadPyodide({
      indexURL: "/pyodide/",
    });
    pyodide.runPython(`
import sys, io, traceback
def __ck_run(code):
    buf = io.StringIO()
    err = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = buf, err
    ok = True
    try:
        exec(code, {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException:
        traceback.print_exc()
        ok = False
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    return (ok, buf.getvalue(), err.getvalue())
    `);
    self.postMessage({ type: "status", payload: "ready" });
    return pyodide;
  })();
  return loading;
}

async function runCode(id, code) {
  const py = await ensurePyodide();
  const t0 = performance.now();
  const result = py.globals.get("__ck_run")(code);
  const ok = result.get(0);
  const stdout = result.get(1);
  const stderr = result.get(2);
  result.destroy();
  const durationMs = Math.round(performance.now() - t0);
  self.postMessage({
    type: "result",
    id,
    payload: { ok, stdout, stderr, durationMs },
  });
}

self.addEventListener("message", async (e) => {
  const { id, type, code } = e.data || {};
  try {
    if (type === "init") {
      await ensurePyodide();
      self.postMessage({ type: "result", id, payload: { ok: true } });
    } else if (type === "run") {
      await runCode(id, code);
    }
  } catch (err) {
    self.postMessage({
      type: "result",
      id,
      payload: { ok: false, stdout: "", stderr: String(err) },
    });
  }
});
