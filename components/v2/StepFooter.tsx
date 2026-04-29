"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lightbulb, ArrowRight, SkipForward } from "lucide-react";
import type { Hint, Step } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

// C2 — sprint-queue.md: XP bar + Hint (cycles step.hint[]) + Skip + Continue/Next.
// ⌘↵ / Ctrl+↵ advances. Voice rules from Brand §3/§4: dry, no exclamation marks.

type Props = {
  step: Step;
  /** XP earned in the current lesson up to (and including) this step. */
  earnedXp: number;
  /** Total XP available in the current lesson. */
  totalXp: number;
  /** Label for the primary advance button — "Continue", "Next", "Submit", etc. */
  primaryLabel?: string;
  /** Whether the primary button is enabled (e.g., true once a step is graded). */
  primaryEnabled?: boolean;
  /** Called when the user advances (button click or ⌘↵). */
  onPrimary: () => void;
  /** Called when the user skips. Optional — when omitted, Skip is hidden. */
  onSkip?: () => void;
  /** Called when a hint is revealed. Receives the index of the hint shown. */
  onHintRevealed?: (index: number) => void;
};

export default function StepFooter({
  step,
  earnedXp,
  totalXp,
  primaryLabel = "Continue",
  primaryEnabled = true,
  onPrimary,
  onSkip,
  onHintRevealed,
}: Props) {
  const hints = useMemo<Hint[]>(() => step.hint ?? [], [step.hint]);
  const [hintsShown, setHintsShown] = useState(0);

  // Reset reveal count when the step changes (different id = different hints).
  useEffect(() => {
    setHintsShown(0);
  }, [step.id]);

  const revealNextHint = useCallback(() => {
    setHintsShown((n) => {
      if (n >= hints.length) return n;
      onHintRevealed?.(n);
      return n + 1;
    });
  }, [hints.length, onHintRevealed]);

  // ⌘↵ / Ctrl+↵ advances when the primary button is enabled.
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      if (!(e.metaKey || e.ctrlKey)) return;
      if (!primaryEnabled) return;
      e.preventDefault();
      onPrimary();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrimary, primaryEnabled]);

  const xpPct = totalXp > 0 ? Math.min(100, Math.round((earnedXp / totalXp) * 100)) : 0;
  const remainingHints = hints.length - hintsShown;

  return (
    <div className="flex flex-col gap-3">
      {hints.length > 0 && hintsShown > 0 && (
        <ul className="flex flex-col gap-1.5 rounded-md border border-ink-800 bg-ink-950 p-3 text-sm text-ink-300">
          {hints.slice(0, hintsShown).map((h, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-xs text-ember-400" aria-hidden>
                {i + 1}.
              </span>
              <span>{h.body}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-ink-500">
            <span>Lesson XP</span>
            <span>
              {earnedXp} / {totalXp}
            </span>
          </div>
          <div
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalXp}
            aria-valuenow={earnedXp}
            aria-label="Lesson XP progress"
          >
            <div
              className="h-full bg-ember-500 transition-[width] duration-300 ease-out"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hints.length > 0 && (
            <button
              type="button"
              onClick={revealNextHint}
              disabled={remainingHints <= 0}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-ink-800 bg-ink-950 px-3 py-2 text-xs text-ink-300 transition",
                remainingHints > 0
                  ? "hover:border-ink-600 hover:text-ink-100"
                  : "cursor-not-allowed opacity-50",
              )}
              aria-label={remainingHints > 0 ? "Reveal next hint" : "No more hints"}
            >
              <Lightbulb size={14} />
              <span>Hint{remainingHints > 0 ? ` (${remainingHints})` : ""}</span>
            </button>
          )}
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-800 bg-ink-950 px-3 py-2 text-xs text-ink-400 transition hover:border-ink-600 hover:text-ink-200"
            >
              <SkipForward size={14} />
              <span>Skip</span>
            </button>
          )}
          <button
            type="button"
            onClick={onPrimary}
            disabled={!primaryEnabled}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-ember-300",
              primaryEnabled
                ? "bg-ember-500 text-ink-950 hover:bg-ember-400"
                : "cursor-not-allowed bg-ink-800 text-ink-500",
            )}
            aria-keyshortcuts="Meta+Enter Control+Enter"
          >
            <span>{primaryLabel}</span>
            <ArrowRight size={14} />
            <kbd className="ml-1 hidden rounded border border-ink-950/30 bg-ink-950/20 px-1 font-mono text-[10px] text-ink-950/70 sm:inline">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
