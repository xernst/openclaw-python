"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  interpolate,
  type FillBlankStep,
} from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";
import HintReveal from "./_HintReveal";

const BLANK_TOKEN = "___";

function normalizeAnswer(
  raw: string,
  blank: FillBlankStep["blanks"][number],
): string {
  let value = raw;
  switch (blank.normalize) {
    case "trim":
      value = value.trim();
      break;
    case "collapse-ws":
      value = value.trim().replace(/\s+/g, " ");
      break;
    case "none":
    default:
      break;
  }
  if (!blank.caseSensitive) value = value.toLowerCase();
  return value;
}

function blankAccepts(
  raw: string,
  blank: FillBlankStep["blanks"][number],
): boolean {
  const got = normalizeAnswer(raw, blank);
  return blank.accept.some((accepted) => normalizeAnswer(accepted, blank) === got);
}

export default function FillBlankStepView({
  step,
  profile,
  onAttempt,
}: StepViewProps<FillBlankStep>) {
  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;
  const startedAtRef = useRef(new Date().toISOString());

  const segments = useMemo(() => splitOnBlanks(prompt, step.blanks.length), [
    prompt,
    step.blanks.length,
  ]);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(step.blanks.map((b) => [b.id, ""])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    setValues(Object.fromEntries(step.blanks.map((b) => [b.id, ""])));
    setSubmitted(false);
    setAllCorrect(false);
    setHintsUsed(0);
    startedAtRef.current = new Date().toISOString();
  }, [step.id, step.blanks]);

  const allFilled = step.blanks.every((b) => values[b.id]?.length > 0);

  function handleSubmit() {
    if (!allFilled || submitted) return;
    const correct = step.blanks.every((b) => blankAccepts(values[b.id] ?? "", b));
    setSubmitted(true);
    setAllCorrect(correct);
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct,
      hintsUsed,
      payload: { kind: "fill", values },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        {segments.map((segment, idx) => {
          if (segment.type === "text") {
            return (
              <ReactMarkdown
                key={`txt-${idx}`}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {segment.value}
              </ReactMarkdown>
            );
          }
          const blank = step.blanks[segment.blankIndex];
          if (!blank) return null;
          const isWrong = submitted && !blankAccepts(values[blank.id] ?? "", blank);
          return (
            <div key={`blank-${blank.id}`} className="my-2">
              <input
                type="text"
                aria-label={`blank ${segment.blankIndex + 1}`}
                value={values[blank.id] ?? ""}
                onChange={(e) =>
                  !submitted &&
                  setValues((prev) => ({ ...prev, [blank.id]: e.target.value }))
                }
                disabled={submitted && allCorrect}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && allFilled && !submitted) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className={cn(
                  "rounded border px-2 py-1 font-mono text-sm",
                  "border-ink-700 bg-ink-950 text-ember-300",
                  "focus:border-ember-500 focus:outline-none",
                  isWrong && "border-rose-500/60",
                )}
                placeholder="___"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        {!submitted || !allCorrect ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            className={cn(
              "rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition",
              "hover:bg-ember-400",
              "disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-500",
            )}
          >
            Check
          </button>
        ) : null}
        {submitted && (
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm",
              allCorrect ? "text-signal" : "text-rose-400",
            )}
          >
            {allCorrect ? (
              <>
                <CheckCircle2 size={16} /> That fits.
              </>
            ) : (
              <>
                <XCircle size={16} /> Not yet — read the line above the blank.
              </>
            )}
          </span>
        )}
      </div>
      {!allCorrect && (
        <HintReveal
          hints={step.hint}
          resetKey={step.id}
          onReveal={(level) => setHintsUsed((c) => Math.max(c, level))}
        />
      )}
    </div>
  );
}

type Segment = { type: "text"; value: string } | { type: "blank"; blankIndex: number };

const FENCE = "```";

// Splits a prompt on `___` blanks. If a blank lands inside a fenced code
// block, each text segment gets its share of fence rebalanced so React
// Markdown renders complete code blocks instead of dangling open fences.
function splitOnBlanks(prompt: string, blankCount: number): Segment[] {
  const parts = prompt.split(BLANK_TOKEN);
  const segments: Segment[] = [];
  let inFence = false;
  let fenceLang = "";

  for (let i = 0; i < parts.length; i++) {
    let text = parts[i];

    if (inFence) {
      text = `${FENCE}${fenceLang}\n${text}`;
    }

    const fenceMatches = [...text.matchAll(/```(\w*)/g)];
    const willEndInFence = fenceMatches.length % 2 === 1;

    if (willEndInFence && i < parts.length - 1) {
      text = `${text}\n${FENCE}`;
    }

    if (text.length > 0) segments.push({ type: "text", value: text });

    if (i < parts.length - 1) {
      segments.push({ type: "blank", blankIndex: Math.min(i, blankCount - 1) });
    }

    if (willEndInFence) {
      const opener = fenceMatches[fenceMatches.length - 1];
      fenceLang = opener?.[1] ?? "";
      inFence = !inFence;
    } else {
      // Track every closer/opener pair to keep state consistent in case of
      // multiple fences in one segment.
      for (let j = 0; j < fenceMatches.length; j += 2) {
        // pairs of opener+closer, no state change.
      }
    }
  }
  return segments;
}
