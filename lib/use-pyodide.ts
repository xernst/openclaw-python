"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type RunResult = { ok: boolean; stdout: string; stderr: string };
type WorkerMsg =
  | { type: "status"; payload: "loading" | "ready" }
  | { type: "result"; id: number; payload: RunResult };

let workerSingleton: Worker | null = null;
function getWorker(): Worker {
  if (typeof window === "undefined") {
    throw new Error("Pyodide worker requested on the server");
  }
  if (!workerSingleton) {
    workerSingleton = new Worker("/pyodide-worker.js");
  }
  return workerSingleton;
}

export function usePyodide() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const pendingRef = useRef<Map<number, (r: RunResult) => void>>(new Map());
  const idRef = useRef(0);

  useEffect(() => {
    const w = getWorker();
    const onMsg = (e: MessageEvent<WorkerMsg>) => {
      const msg = e.data;
      if (msg.type === "status") {
        setStatus(msg.payload === "ready" ? "ready" : "loading");
      } else if (msg.type === "result") {
        const cb = pendingRef.current.get(msg.id);
        if (cb) {
          pendingRef.current.delete(msg.id);
          cb(msg.payload);
        }
      }
    };
    w.addEventListener("message", onMsg);
    setStatus((s) => (s === "idle" ? "loading" : s));
    w.postMessage({ type: "init", id: -1 });
    return () => {
      w.removeEventListener("message", onMsg);
    };
  }, []);

  const run = useCallback((code: string): Promise<RunResult> => {
    const w = getWorker();
    const id = ++idRef.current;
    return new Promise((resolve) => {
      pendingRef.current.set(id, resolve);
      w.postMessage({ type: "run", id, code });
    });
  }, []);

  return { status, run };
}
