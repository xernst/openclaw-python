"use client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { useCallback, useEffect, useState } from "react";
import { Play, Send, Loader2 } from "lucide-react";
import { usePyodide } from "@/lib/use-pyodide";
import { setLesson } from "@/lib/storage";
import { awardPass } from "@/lib/streaks";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/types";

type Props = {
  chapterSlug: string;
  exercise: Exercise;
  initialCode: string;
  onResult: (r: { stdout: string; stderr: string; passed: boolean | null }) => void;
};

function normalize(s: string): string {
  return s.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trimEnd();
}

export default function CodeEditor({
  chapterSlug,
  exercise,
  initialCode,
  onResult,
}: Props) {
  const { status, run } = usePyodide();
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState<"run" | "submit" | null>(null);

  // Persist drafts as you type — keystroke-cheap because storage.ts is sync localStorage.
  const onChange = useCallback(
    (val: string) => {
      setCode(val);
      setLesson(chapterSlug, exercise.slug, { draft: val });
    },
    [chapterSlug, exercise.slug],
  );

  // Cmd/Ctrl+Enter = Run, Cmd/Ctrl+Shift+Enter = Submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) handleSubmit();
        else handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, status]);

  async function handleRun() {
    if (status !== "ready" || running) return;
    setRunning("run");
    const r = await run(code);
    setRunning(null);
    setLesson(chapterSlug, exercise.slug, {
      attempts: undefined, // attempts only count on Submit
      lastAttemptAt: new Date().toISOString(),
    });
    onResult({ stdout: r.stdout, stderr: r.stderr, passed: null });
  }

  async function handleSubmit() {
    if (status !== "ready" || running) return;
    setRunning("submit");
    const r = await run(code);
    setRunning(null);
    let passed: boolean | null = null;
    if (exercise.expectedStdout != null && !r.stderr) {
      passed = normalize(r.stdout) === normalize(exercise.expectedStdout);
    } else if (r.stderr) {
      passed = false;
    }
    setLesson(chapterSlug, exercise.slug, {
      status: passed ? "passed" : "attempted",
      attempts: undefined,
      lastAttemptAt: new Date().toISOString(),
      passedAt: passed ? new Date().toISOString() : undefined,
    });
    if (passed) awardPass();
    onResult({ stdout: r.stdout, stderr: r.stderr, passed });
  }

  const ready = status === "ready";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-auto">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[python()]}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            foldGutter: false,
            tabSize: 4,
          }}
          className="h-full text-[13px]"
        />
      </div>
      <div className="flex items-center justify-between border-t border-ink-800 bg-ink-950 px-3 py-2">
        <div className="text-xs text-ink-500">
          {!ready
            ? status === "loading"
              ? "loading Python (one-time, ~5s)..."
              : "warming up..."
            : "⌘↵ run · ⌘⇧↵ submit"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!ready || running !== null}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
              "bg-ink-800 text-ink-100 hover:bg-ink-700",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {running === "run" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={!ready || running !== null}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
              "bg-ember-600 text-white hover:bg-ember-500",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {running === "submit" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
