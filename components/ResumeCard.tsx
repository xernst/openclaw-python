"use client";
// One-click resume — ADHD rule #1 (lower activation cost).
// Reads lastVisited from localStorage, deep-links straight back to that lesson.
// Never shows guilt about gaps — only "here's where you were."

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { loadProgress } from "@/lib/storage";

type ChapterIndex = Record<
  string,
  { number: number; title: string; exercises: Record<string, number> }
>;

type Props = {
  fallback: { chapterSlug: string; exerciseSlug: string };
  index: ChapterIndex;
};

export default function ResumeCard({ fallback, index }: Props) {
  const [where, setWhere] = useState<{ chapterSlug: string; exerciseSlug: string } | null>(null);

  useEffect(() => {
    const p = loadProgress();
    setWhere(p.lastVisited || null);
  }, []);

  const target = where || fallback;
  const link = `/learn/${target.chapterSlug}/${target.exerciseSlug}`;
  const ch = index[target.chapterSlug];
  const exNum = ch?.exercises[target.exerciseSlug];
  const heading = where
    ? ch
      ? `Ch ${ch.number} · Exercise ${ch.number}.${exNum ?? "?"}`
      : "Pick up where you left off"
    : "Chapter 1 · Getting Started";
  const sub = ch?.title.replace(/^Chapter\s+\d+\s*[—\-]\s*/, "") ?? "";

  return (
    <Link
      href={link}
      className="group flex items-center justify-between rounded-xl border border-ember-700/40 bg-gradient-to-br from-ember-950 to-ink-950 p-6 transition hover:border-ember-600 hover:from-ember-900"
    >
      <div>
        <div className="text-xs uppercase tracking-widest text-ember-500">
          {where ? "welcome back" : "start here"}
        </div>
        <div className="mt-1 text-2xl font-semibold text-ink-50">{heading}</div>
        <div className="mt-1 text-sm text-ink-500">
          {where ? sub || "pick up where you left off" : "first lesson — getting started"}
        </div>
      </div>
      <div className="rounded-full bg-ember-600 p-3 transition group-hover:bg-ember-500">
        <Play size={20} className="fill-white text-white" />
      </div>
    </Link>
  );
}
