"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { interpolate, type ReadStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";

export default function ReadStepView({
  step,
  profile,
  onAttempt,
}: StepViewProps<ReadStep>) {
  const body = step.personalize ? interpolate(step.body, profile) : step.body;

  function handleContinue() {
    const now = new Date().toISOString();
    onAttempt({
      stepId: step.id,
      startedAt: now,
      submittedAt: now,
      correct: true,
      hintsUsed: 0,
      payload: { kind: "read-ack" },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {body}
        </ReactMarkdown>
      </div>
      <div className="flex">
        <button
          type="button"
          onClick={handleContinue}
          className={cn(
            "rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition",
            "hover:bg-ember-400",
          )}
        >
          {step.cta}
        </button>
      </div>
    </div>
  );
}
