"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CheckCircle2, Flame, XCircle } from "lucide-react";
import { interpolate, type CheckpointStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";
import { gradeRunResult } from "./_grader";

export default function CheckpointStepView({
  step,
  profile,
  onAttempt,
  ide,
}: StepViewProps<CheckpointStep>) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { passed: boolean; reason?: string }>(null);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const startedAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    setSubmitting(false);
    setSubmitted(null);
    setSolutionRevealed(false);
    startedAtRef.current = new Date().toISOString();
  }, [step.id]);

  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;

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
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct: grade.passed,
      hintsUsed: solutionRevealed ? 1 : 0,
      payload: { kind: "checkpoint", code: ide.getActiveCode() },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-ember-700/40 bg-ember-700/5 px-3 py-2 text-xs text-ember-300">
        <div className="flex items-center gap-1.5 font-display text-base text-ember-300">
          <Flame size={14} />
          Checkpoint
        </div>
        <p className="mt-1 text-ink-300">
          One last thing before we move on. Same surface as a write step — but the
          lesson doesn&apos;t complete until this passes.
        </p>
      </div>
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {prompt}
        </ReactMarkdown>
      </div>
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
          {submitting ? "Running…" : "Submit"}
        </button>
        {!submitted?.passed && (
          <button
            type="button"
            onClick={() => setSolutionRevealed(true)}
            className="text-xs text-ink-400 underline-offset-2 hover:text-ink-100 hover:underline"
          >
            Show solution →
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
          <span>
            {submitted.passed
              ? "Locked in. That's the lesson."
              : submitted.reason}
          </span>
        </div>
      )}
      {solutionRevealed && (
        <pre className="overflow-auto rounded-md border border-ink-800 bg-ink-950 p-3 font-mono text-xs text-ember-300">
          {step.solution}
        </pre>
      )}
    </div>
  );
}
