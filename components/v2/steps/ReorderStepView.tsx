"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical, XCircle } from "lucide-react";
import { interpolate, type ReorderStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";

type Fragment = { id: string; code: string };

function shuffle<T>(items: T[], seed: string): T[] {
  // Deterministic shuffle so SSR + client hydration don't mismatch.
  const out = [...items];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function ReorderStepView({
  step,
  profile,
  onAttempt,
}: StepViewProps<ReorderStep>) {
  const initialOrder = useMemo<Fragment[]>(
    () => shuffle([...step.fragments, ...step.distractors], step.id),
    [step.id, step.fragments, step.distractors],
  );

  const [order, setOrder] = useState<Fragment[]>(initialOrder);
  const [submitted, setSubmitted] = useState<null | { passed: boolean; reason?: string }>(null);
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const startedAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    setOrder(initialOrder);
    setSubmitted(null);
    setGrabbed(null);
    startedAtRef.current = new Date().toISOString();
  }, [initialOrder]);

  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;

  function move(id: string, direction: -1 | 1) {
    setOrder((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const out = [...prev];
      [out[idx], out[target]] = [out[target], out[idx]];
      return out;
    });
  }

  function handleSubmit() {
    if (submitted?.passed) return;
    const userIds = order.map((f) => f.id);
    const expected = step.correctOrder;
    const passed =
      userIds.length === expected.length &&
      userIds.every((id, i) => id === expected[i]);
    setSubmitted({
      passed,
      reason: passed ? undefined : "Order isn't quite right yet — read top-to-bottom.",
    });
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct: passed,
      hintsUsed: 0,
      payload: { kind: "reorder", order: userIds },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt}</ReactMarkdown>
      </div>
      <ol className="flex flex-col gap-1.5" aria-label="Code fragments to reorder">
        {order.map((fragment, idx) => {
          const isGrabbed = grabbed === fragment.id;
          return (
            <li
              key={fragment.id}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2.5 py-2 transition",
                "border-ink-800 bg-ink-900",
                isGrabbed && "border-ember-500",
              )}
            >
              <button
                type="button"
                onClick={() => setGrabbed(isGrabbed ? null : fragment.id)}
                aria-label={isGrabbed ? "Drop fragment" : "Grab fragment"}
                aria-pressed={isGrabbed}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    move(fragment.id, -1);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    move(fragment.id, 1);
                  }
                }}
                className="cursor-grab text-ink-500 hover:text-ink-200"
              >
                <GripVertical size={14} />
              </button>
              <span className="font-mono text-[10px] text-ink-500">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <code className="flex-1 font-mono text-sm text-ember-300">
                {fragment.code}
              </code>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(fragment.id, -1)}
                  disabled={idx === 0}
                  aria-label="Move up"
                  className="text-ink-500 hover:text-ink-100 disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => move(fragment.id, 1)}
                  disabled={idx === order.length - 1}
                  aria-label="Move down"
                  className="text-ink-500 hover:text-ink-100 disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted?.passed === true}
          className={cn(
            "rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition",
            "hover:bg-ember-400",
            "disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-500",
          )}
        >
          Check order
        </button>
      </div>
      {submitted && (
        <div
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
            submitted.passed
              ? "border-signal/50 bg-signal/5 text-signal"
              : "border-rose-500/40 bg-rose-500/5 text-rose-300",
          )}
        >
          {submitted.passed ? (
            <CheckCircle2 size={16} className="mt-0.5" />
          ) : (
            <XCircle size={16} className="mt-0.5" />
          )}
          <span>{submitted.passed ? "That's the order." : submitted.reason}</span>
        </div>
      )}
    </div>
  );
}
