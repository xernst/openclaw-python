"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Hint } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type Props = {
  hints: Hint[];
  /** Reset reveal when this changes (typically step.id). */
  resetKey: string;
  /** Called whenever a new hint level is revealed. Lets the parent count hintsUsed. */
  onReveal?: (level: number) => void;
};

export default function HintReveal({ hints, resetKey, onReveal }: Props) {
  const [revealedLevels, setRevealedLevels] = useState<number[]>([]);

  useEffect(() => {
    setRevealedLevels([]);
  }, [resetKey]);

  if (!hints || hints.length === 0) return null;

  const sorted = [...hints].sort((a, b) => a.level - b.level);
  const revealed = sorted.filter((h) => revealedLevels.includes(h.level));
  const next = sorted.find((h) => !revealedLevels.includes(h.level));

  return (
    <div className="flex flex-col gap-2">
      {revealed.map((hint) => (
        <div
          key={hint.level}
          className="rounded-md border border-amber-700/40 bg-amber-700/5 px-3 py-2 text-xs text-amber-100"
        >
          <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            <Lightbulb size={11} />
            Hint {hint.level}
          </div>
          <div className="prose prose-sm max-w-none text-amber-50">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {hint.body}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      {next && (
        <button
          type="button"
          onClick={() => {
            setRevealedLevels((prev) => [...prev, next.level]);
            onReveal?.(next.level);
          }}
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-md border border-ink-800 bg-ink-900 px-3 py-1.5 text-xs",
            "text-ink-300 hover:border-amber-700/50 hover:text-amber-200 transition",
          )}
        >
          <Lightbulb size={12} />
          {revealedLevels.length === 0
            ? `Show hint${sorted.length > 1 ? " 1" : ""}`
            : `Show hint ${next.level}`}
        </button>
      )}
    </div>
  );
}
