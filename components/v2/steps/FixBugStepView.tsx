"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CheckCircle2, XCircle } from "lucide-react";
import { interpolate, type FixBugStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";
import { gradeRunResult } from "./_grader";
import HintReveal from "./_HintReveal";

export default function FixBugStepView({
  step,
  profile,
  onAttempt,
  ide,
}: StepViewProps<FixBugStep>) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { passed: boolean; reason?: string }>(null);
  const [failedCount, setFailedCount] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    setSubmitting(false);
    setSubmitted(null);
    setFailedCount(0);
    setSolutionRevealed(false);
    setHintsUsed(0);
    startedAtRef.current = new Date().toISOString();
  }, [step.id]);

  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;
  const revealAfter = step.revealAfter;
  const canReveal =
    revealAfter !== undefined && failedCount >= revealAfter && step.bugLines.length > 0;

  async function handleSubmit() {
    if (submitting || submitted?.passed) return;
    setSubmitting(true);
    const result = await ide.run();
    setSubmitting(false);
    if (!result) {
      setSubmitted({ passed: false, reason: "Editor isn't ready yet." });
      return;
    }
    const grade = gradeRunResult(step.grader, result);
    setSubmitted(grade.passed ? { passed: true } : { passed: false, reason: grade.reason });
    if (!grade.passed) setFailedCount((c) => c + 1);
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct: grade.passed,
      hintsUsed: solutionRevealed ? Math.max(hintsUsed, 99) : hintsUsed,
      payload: { kind: "fix", code: ide.getActiveCode() },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {prompt}
        </ReactMarkdown>
      </div>
      {step.bugLines.length > 0 && !submitted?.passed && (
        <div className="rounded-md border border-ink-800 bg-ink-900 px-3 py-2 text-xs text-ink-400">
          The break is on{" "}
          {step.bugLines.length === 1
            ? `line ${step.bugLines[0]}`
            : `lines ${step.bugLines.join(", ")}`}{" "}
          — but read the whole snippet first.
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || submitted?.passed === true}
          className={cn(
            "rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition",
            "hover:bg-ember-400",
            "disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-500",
          )}
        >
          {submitting ? "Running…" : "Submit fix"}
        </button>
        {canReveal && !solutionRevealed && (
          <button
            type="button"
            onClick={() => setSolutionRevealed(true)}
            className="text-xs text-ink-400 underline-offset-2 hover:text-ink-100 hover:underline"
          >
            Show me the line →
          </button>
        )}
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
          <span>{submitted.passed ? "Runs clean now." : submitted.reason}</span>
        </div>
      )}
      {solutionRevealed && step.bugLines.length > 0 && (
        <div className="rounded-md border border-ember-700/50 bg-ember-700/5 p-3 text-xs text-ink-300">
          The bug is on{" "}
          {step.bugLines.length === 1
            ? `line ${step.bugLines[0]}`
            : `lines ${step.bugLines.join(", ")}`}
          . Compare the variable names and punctuation to the expected output.
        </div>
      )}
      {!submitted?.passed && (
        <HintReveal
          hints={step.hint}
          resetKey={step.id}
          onReveal={(level) => setHintsUsed((c) => Math.max(c, level))}
        />
      )}
    </div>
  );
}
