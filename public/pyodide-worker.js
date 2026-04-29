// public/pyodide-worker.js
// Pyodide Web Worker. Loads CPython-on-WASM from CDN, runs user code,
// captures stdout, and reports results back.
//
// Boot.dev's blog post on the same pattern:
// https://www.boot.dev/blog/python/python-in-the-browser/

importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.4/full/pyodide.js");

let pyodide = null;
let loading = null;

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (loading) return loading;
  loading = (async () => {
    self.postMessage({ type: "status", payload: "loading" });
    pyodide = await self.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.4/full/",
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
  const result = py.globals.get("__ck_run")(code);
  const ok = result.get(0);
  const stdout = result.get(1);
  const stderr = result.get(2);
  result.destroy();
  self.postMessage({ type: "result", id, payload: { ok, stdout, stderr } });
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
