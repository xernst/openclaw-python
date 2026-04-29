"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  interpolate,
  type MultipleChoiceStep,
} from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import { cn } from "@/lib/utils";

export default function MultipleChoiceStepView({
  step,
  profile,
  onAttempt,
}: StepViewProps<MultipleChoiceStep>) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startedAtRef = useRef(new Date().toISOString());

  // Reset internal state when the step changes — keeps the view honest
  // when LessonShell swaps a new step in without unmounting.
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    startedAtRef.current = new Date().toISOString();
  }, [step.id]);

  const prompt = step.personalize ? interpolate(step.prompt, profile) : step.prompt;
  const isMulti = step.answerIds.length > 1;

  const correctSet = useMemo(() => new Set(step.answerIds), [step.answerIds]);

  function handleSubmit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    const correct = correctSet.has(selected) && !isMulti;
    onAttempt({
      stepId: step.id,
      startedAt: startedAtRef.current,
      submittedAt: new Date().toISOString(),
      correct,
      hintsUsed: 0,
      payload: { kind: "mc", selectedId: selected },
    });
  }

  // Keyboard: digits 1-9 pick, Enter submits.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter") {
        if (selected && !submitted) {
          event.preventDefault();
          handleSubmit();
        }
        return;
      }
      const idx = Number(event.key) - 1;
      if (idx >= 0 && idx < step.options.length) {
        setSelected(step.options[idx].id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, submitted, step.options]);

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt}</ReactMarkdown>
      </div>
      <ul className="flex flex-col gap-2" role="radiogroup" aria-label="Choices">
        {step.options.map((option, idx) => {
          const isSelected = selected === option.id;
          const isCorrectChoice = correctSet.has(option.id);
          const showCorrect = submitted && isCorrectChoice;
          const showWrong = submitted && isSelected && !isCorrectChoice;
          return (
            <li key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => !submitted && setSelected(option.id)}
                disabled={submitted}
                className={cn(
                  "w-full rounded-md border px-3 py-2.5 text-left text-sm transition",
                  "border-ink-800 bg-ink-900",
                  !submitted && "hover:border-ink-600",
                  isSelected && !submitted && "border-ember-500 bg-ink-800",
                  showCorrect && "border-signal/60 bg-signal/5 text-signal",
                  showWrong && "border-rose-500/60 bg-rose-500/5 text-rose-300",
                )}
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-ink-800 text-[10px] text-ink-400">
                  {idx + 1}
                </span>
                <span className="font-mono text-ink-100">{option.label}</span>
                {submitted && option.explain && (isSelected || isCorrectChoice) && (
                  <span className="mt-2 block text-xs text-ink-400">
                    {option.explain}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className={cn(
              "rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition",
              "hover:bg-ember-400",
              "disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-500",
            )}
          >
            Check
          </button>
        ) : (
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 text-sm",
              correctSet.has(selected ?? "") ? "text-signal" : "text-rose-400",
            )}
          >
            {correctSet.has(selected ?? "") ? (
              <>
                <CheckCircle2 size={16} /> Right.
              </>
            ) : (
              <>
                <XCircle size={16} /> Not that one.
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
