"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { loadProgress } from "@/lib/storage";
import { exerciseKey } from "@/lib/storage";
import { cn } from "@/lib/utils";

type ChapterLite = {
  slug: string;
  number: number;
  title: string;
  exerciseCount: number;
  exerciseSlugs: string[];
};

type Props = {
  chapters: ChapterLite[];
  activeChapter?: string;
  activeExercise?: string;
};

export default function ChapterNav({ chapters, activeChapter, activeExercise }: Props) {
  const [passed, setPassed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => {
      const p = loadProgress();
      const s = new Set<string>();
      for (const k in p.lessons) {
        if (p.lessons[k].status === "passed") s.add(k);
      }
      setPassed(s);
    };
    refresh();
    window.addEventListener("code-killa:progress", refresh);
    return () => window.removeEventListener("code-killa:progress", refresh);
  }, []);

  return (
    <nav className="flex h-full flex-col overflow-y-auto border-r border-ink-800 bg-ink-950">
      <div className="border-b border-ink-800 p-4">
        <Link href="/" className="block">
          <div className="text-sm font-bold tracking-tight text-ember-400">Pyloft</div>
          <div className="text-[10px] uppercase tracking-widest text-ink-500">python · vibe edition</div>
        </Link>
      </div>
      <div className="flex-1 px-2 py-3">
        {chapters.map((c) => {
          const isActive = c.slug === activeChapter;
          const chapterPassed = c.exerciseSlugs.filter((s) => passed.has(exerciseKey(c.slug, s))).length;
          const allDone = chapterPassed === c.exerciseCount && c.exerciseCount > 0;
          return (
            <div key={c.slug} className="mb-2">
              <Link
                href={`/learn/${c.slug}`}
                className={cn(
                  "flex items-center justify-between rounded px-2 py-1.5 text-xs transition",
                  isActive
                    ? "bg-ink-900 text-ink-100"
                    : "text-ink-400 hover:bg-ink-900 hover:text-ink-200",
                )}
              >
                <span className="truncate">
                  <span className={cn("mr-2 font-mono text-[10px]", allDone ? "text-ember-500" : "text-ink-600")}>
                    {String(c.number).padStart(2, "0")}
                  </span>
                  {c.title.replace(/^Chapter\s+\d+\s*[—\-]\s*/, "")}
                </span>
                <span className={cn("text-[10px] tabular-nums", allDone ? "text-ember-500" : "text-ink-600")}>
                  {chapterPassed}/{c.exerciseCount}
                </span>
              </Link>
              {isActive && c.exerciseSlugs.length > 0 && (
                <div className="ml-3 mt-1 border-l border-ink-800 pl-2">
                  {c.exerciseSlugs.map((slug, i) => {
                    const k = exerciseKey(c.slug, slug);
                    const done = passed.has(k);
                    const here = activeExercise === slug;
                    return (
                      <Link
                        key={slug}
                        href={`/learn/${c.slug}/${slug}`}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1 text-xs transition",
                          here ? "bg-ink-900 text-ember-400" : "text-ink-500 hover:text-ink-200",
                        )}
                      >
                        {done ? (
                          <Check size={11} className="text-ember-500" />
                        ) : (
                          <Circle size={9} className="text-ink-700" />
                        )}
                        <span>Exercise {c.number}.{i + 1}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
