"use client";

import type { Step } from "@/lib/content/schema";

export default function StepPlaceholder({
  step,
  label,
}: {
  step: Step;
  label: string;
}) {
  return (
    <div className="rounded-md border border-ink-800 bg-ink-900 p-4 text-sm">
      <p className="text-ink-200">
        <span className="font-mono text-xs text-ember-400">{label}</span> view
        not implemented yet.
      </p>
      <pre className="mt-3 overflow-auto rounded bg-ink-950 p-2 text-[11px] text-ink-400">
        {JSON.stringify(step, null, 2)}
      </pre>
    </div>
  );
}
