"use client";
import { CheckCircle2, XCircle, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  stdout: string;
  stderr: string;
  passed: boolean | null;
  expected?: string | null;
  next?: { chapterSlug: string; exerciseSlug: string } | null;
};

export default function OutputPane({ stdout, stderr, passed, expected, next }: Props) {
  const hasOutput = stdout.length > 0 || stderr.length > 0;
  return (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex items-center justify-between border-b border-ink-800 px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <Terminal size={12} />
          Output
        </div>
        {passed === true && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ember-400">
            <CheckCircle2 size={14} /> Passed +10 XP
          </span>
        )}
        {passed === false && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400">
            <XCircle size={14} /> Not yet
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed">
        {!hasOutput && (
          <div className="text-ink-600 italic">
            (run your code to see output here)
          </div>
        )}
        {stdout && (
          <pre className="whitespace-pre-wrap text-ink-200">{stdout}</pre>
        )}
        {stderr && (
          <pre className="whitespace-pre-wrap text-rose-400 mt-2">{stderr}</pre>
        )}
        {passed === false && expected && !stderr && (
          <div className="mt-3 rounded-md border border-ink-800 bg-ink-900 p-3">
            <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Expected</div>
            <pre className="whitespace-pre-wrap text-ember-300">{expected}</pre>
          </div>
        )}
      </div>
      {passed === true && next && (
        <div className="border-t border-ink-800 p-3">
          <Link
            href={`/learn/${next.chapterSlug}/${next.exerciseSlug}`}
            className={cn(
              "block w-full rounded-md bg-ember-600 px-3 py-2 text-center text-sm font-medium text-white",
              "hover:bg-ember-500 transition",
            )}
          >
            Next exercise →
          </Link>
        </div>
      )}
    </div>
  );
}
