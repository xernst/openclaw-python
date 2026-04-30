"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { Loader2, Lock, Play, Terminal } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePyodide } from "@/lib/use-pyodide";
import { cn } from "@/lib/utils";

export type IDEFile = {
  name: string;
  body: string;
  readOnly?: boolean;
  language?: "python" | "text" | "json";
};

export type RunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs?: number;
};

export type PersistentIDEHandle = {
  run: () => Promise<RunResult | null>;
  getActiveCode: () => string;
  getFile: (name: string) => string | undefined;
  reset: () => void;
};

type Props = {
  /**
   * Per-step file set. The active tab's body seeds the editor.
   * The IDE preserves user edits for the same `name` between renders so the
   * editor never empties while moving through a single lesson.
   */
  files: IDEFile[];
  /**
   * When false, the Run button is hidden entirely. Defaults to true.
   * Even on `read` / `mc` steps the IDE is runnable so the learner can
   * press Run on the read-only example (UX §1.2).
   */
  runnable?: boolean;
  /**
   * Stable identifier for the current step. When this changes, the IDE
   * applies the new `files` from the prop (resetting any in-flight edits
   * that don't have a matching file name).
   */
  stepId: string;
  /**
   * Fires whenever the active editable file's body changes.
   */
  onCodeChange?: (file: IDEFile, code: string) => void;
  /**
   * Fires after each Run with the captured stdout/stderr.
   */
  onResult?: (result: RunResult) => void;
  /**
   * Optional extra controls rendered in the run bar (e.g. step's Submit button).
   */
  rightActions?: React.ReactNode;
  /**
   * Optional badge rendered above the output panel — used by step views to
   * surface "Passed" / "Try again" without owning the panel itself.
   */
  outputBadge?: React.ReactNode;
  /**
   * Optional extra content rendered inside the output panel (after stdout/stderr).
   */
  outputExtra?: React.ReactNode;
};

const STATUS_COPY: Record<"idle" | "loading" | "ready", string> = {
  idle: "Booting Python…",
  loading: "Booting Python (one-time, ~5s)…",
  ready: "press Run or use ⌘↵",
};

const PersistentIDE = forwardRef<PersistentIDEHandle, Props>(function PersistentIDE(
  {
    files,
    runnable = true,
    stepId,
    onCodeChange,
    onResult,
    rightActions,
    outputBadge,
    outputExtra,
  },
  ref,
) {
  const { status, run } = usePyodide();

  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    seedDrafts(files),
  );
  const [activeName, setActiveName] = useState<string>(
    () => files[0]?.name ?? "main.py",
  );
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [lastRun, setLastRun] = useState<{
    durationMs: number;
    at: number;
  } | null>(null);

  const lastStepIdRef = useRef(stepId);

  useEffect(() => {
    if (lastStepIdRef.current === stepId) return;
    lastStepIdRef.current = stepId;
    setDrafts((prev) => {
      const next: Record<string, string> = {};
      for (const file of files) {
        const carried = prev[file.name];
        next[file.name] =
          carried !== undefined && !file.readOnly ? carried : file.body;
      }
      return next;
    });
    setActiveName((current) =>
      files.some((f) => f.name === current) ? current : files[0]?.name ?? "main.py",
    );
    setStdout("");
    setStderr("");
    setLastRun(null);
  }, [stepId, files]);

  const activeFile = useMemo(
    () => files.find((f) => f.name === activeName) ?? files[0],
    [files, activeName],
  );

  const activeCode = activeFile ? drafts[activeFile.name] ?? activeFile.body : "";

  const handleChange = useCallback(
    (value: string) => {
      if (!activeFile || activeFile.readOnly) return;
      setDrafts((prev) => ({ ...prev, [activeFile.name]: value }));
      onCodeChange?.(activeFile, value);
    },
    [activeFile, onCodeChange],
  );

  const handleRun = useCallback(async (): Promise<RunResult | null> => {
    if (!activeFile || running) return null;
    // We don't bail when status === "loading" — the worker awaits ensurePyodide()
    // internally, so the run queues and resolves once Python finishes booting.
    // The user sees "Running…" instead of "Editor isn't ready yet."
    setRunning(true);
    setStdout("");
    setStderr("");
    const startedAt = performance.now();
    const code = drafts[activeFile.name] ?? activeFile.body;
    const result = await run(code);
    setStdout(result.stdout);
    setStderr(result.stderr);
    setLastRun({
      durationMs: result.durationMs ?? Math.round(performance.now() - startedAt),
      at: Date.now(),
    });
    setRunning(false);
    onResult?.(result);
    return result;
  }, [activeFile, drafts, onResult, run, running]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!runnable) return;
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun, runnable]);

  useImperativeHandle(
    ref,
    () => ({
      run: () => handleRun(),
      getActiveCode: () => (activeFile ? drafts[activeFile.name] ?? activeFile.body : ""),
      getFile: (name: string) => drafts[name],
      reset: () => {
        setDrafts(seedDrafts(files));
        setStdout("");
        setStderr("");
        setLastRun(null);
      },
    }),
    [activeFile, drafts, files, handleRun],
  );

  const extensions = useMemo(() => {
    const baseExtensions =
      activeFile?.language === "python" || activeFile?.language === undefined
        ? [python()]
        : [];
    if (activeFile?.readOnly) {
      return [...baseExtensions, EditorView.editable.of(false)];
    }
    return baseExtensions;
  }, [activeFile]);

  const ready = status === "ready";
  const hasOutput = stdout.length > 0 || stderr.length > 0;
  const ranEmpty = !running && lastRun !== null && !hasOutput;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink-950">
      <div
        role="tablist"
        aria-label="Editor files"
        className="flex items-center gap-1 border-b border-ink-800 bg-ink-900 px-2"
      >
        {files.map((file) => {
          const isActive = file.name === activeName;
          return (
            <button
              key={file.name}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveName(file.name)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition",
                isActive
                  ? "border-b-2 border-ember-500 text-ink-100"
                  : "border-b-2 border-transparent text-ink-500 hover:text-ink-300",
              )}
            >
              {file.readOnly && <Lock size={11} className="text-ink-500" />}
              {file.name}
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeFile ? (
          <CodeMirror
            key={`${stepId}:${activeFile.name}`}
            value={activeCode}
            height="100%"
            theme={oneDark}
            extensions={extensions}
            onChange={handleChange}
            readOnly={activeFile.readOnly ?? false}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: !activeFile.readOnly,
              foldGutter: false,
              tabSize: 4,
            }}
            className="h-full text-[13px]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-500">
            no file
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-ink-800 bg-ink-900 px-3 py-2">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 text-xs",
            ready ? "text-ink-500" : "text-ember-300",
          )}
        >
          {!ready && (
            <Loader2 size={11} className="animate-spin motion-reduce:animate-none" />
          )}
          {ready ? STATUS_COPY.ready : STATUS_COPY[status]}
        </div>
        <div className="flex items-center gap-2">
          {runnable && (
            <button
              type="button"
              onClick={() => void handleRun()}
              // The worker awaits ensurePyodide() internally, so a click during
              // load queues — the user sees "Running…" instead of a disabled
              // button that looks broken on first impression. We only block
              // re-clicks while a run is already in flight.
              disabled={running}
              aria-busy={running || !ready}
              aria-keyshortcuts="Meta+Enter Control+Enter"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition motion-reduce:transition-none",
                "bg-ink-800 text-ink-100 hover:bg-ink-700",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              {running || !ready ? (
                <Loader2 size={14} className="animate-spin motion-reduce:animate-none" />
              ) : (
                <Play size={14} />
              )}
              Run
            </button>
          )}
          {rightActions}
        </div>
      </div>
      <div className="flex h-44 min-h-0 flex-col border-t border-ink-800 bg-ink-950">
        <div className="flex items-center justify-between border-b border-ink-800 px-3 py-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-ink-500">
            <Terminal size={11} />
            Output
            {lastRun && !running && (
              <span className="ml-2 font-mono text-[10px] normal-case tracking-normal text-ink-600">
                {stderr ? "✗" : "✓"} ran in {lastRun.durationMs}ms
              </span>
            )}
            {running && (
              <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] normal-case tracking-normal text-ember-400">
                <Loader2 size={10} className="animate-spin motion-reduce:animate-none" />
                running…
              </span>
            )}
          </div>
          {outputBadge}
        </div>
        <div
          aria-live="polite"
          className="flex-1 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed"
        >
          {!hasOutput && !outputExtra && !ranEmpty && !running && (
            <div className="italic text-ink-600">
              Run your code to see output here.
            </div>
          )}
          {running && (
            <div className="italic text-ink-500">Running your code…</div>
          )}
          {ranEmpty && (
            <div className="text-ink-500">
              <span className="text-emerald-400">✓</span> Ran with no output.
              <span className="ml-1 text-ink-600">
                Add a <code className="rounded bg-ink-900 px-1 text-ink-400">print(…)</code> to see something.
              </span>
            </div>
          )}
          {stdout && <pre className="whitespace-pre-wrap text-ink-200">{stdout}</pre>}
          {stderr && (
            <pre className="mt-2 whitespace-pre-wrap text-rose-400">{stderr}</pre>
          )}
          {outputExtra && <div className="mt-3">{outputExtra}</div>}
        </div>
      </div>
    </div>
  );
});

function seedDrafts(files: IDEFile[]): Record<string, string> {
  const drafts: Record<string, string> = {};
  for (const file of files) drafts[file.name] = file.body;
  return drafts;
}

export default PersistentIDE;
