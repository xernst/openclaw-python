"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, Circle, Lock } from "lucide-react";
import {
  loadProgressV2,
  type ProgressV2,
} from "@/lib/storage";
import type { Chapter, ManifestToc } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export type ChapterNavTree = {
  toc: ManifestToc;
  /**
   * Detail for the currently-active chapter (and any chapter the SSR side
   * resolved). Other chapters are still listed via the TOC entry — they
   * collapse closed and link to their first lesson.
   */
  detail: Chapter;
};

type Props = {
  tree: ChapterNavTree;
  activeChapter: string;
  activeLesson: string;
  activeStepIndex: number;
};

export default function V2ChapterNav({
  tree,
  activeChapter,
  activeLesson,
  activeStepIndex,
}: Props) {
  const [progress, setProgress] = useState<ProgressV2 | null>(null);
  const [openChapter, setOpenChapter] = useState<string>(activeChapter);

  useEffect(() => {
    function refresh() {
      setProgress(loadProgressV2());
    }
    refresh();
    window.addEventListener("code-killa:progress-v2", refresh);
    return () => window.removeEventListener("code-killa:progress-v2", refresh);
  }, []);

  useEffect(() => {
    setOpenChapter(activeChapter);
  }, [activeChapter]);

  return (
    <nav className="flex h-full flex-col overflow-y-auto bg-ink-900">
      <div className="border-b border-ink-800 px-4 py-4">
        <Link href="/" className="block">
          <div className="font-display text-base text-ember-400">Pyloft</div>
          <div className="text-[10px] uppercase tracking-widest text-ink-500">
            python for builders
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {tree.toc.chapters.map((entry) => {
          const isActive = entry.slug === activeChapter;
          const isOpen = openChapter === entry.slug;
          const detail = isActive ? tree.detail : null;
          return (
            <div key={entry.slug} className="mb-1">
              <button
                type="button"
                onClick={() => setOpenChapter(isOpen ? "" : entry.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition",
                  isActive
                    ? "bg-ink-800 text-ink-100"
                    : "text-ink-400 hover:bg-ink-800/50 hover:text-ink-200",
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {isOpen ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
                  <span className="font-mono text-[10px] text-ink-500">
                    {String(entry.number).padStart(2, "0")}
                  </span>
                  <span className="truncate">{shortChapterTitle(entry.title)}</span>
                </span>
              </button>
              {isOpen && detail && (
                <ChapterDetail
                  chapter={detail}
                  activeLesson={activeLesson}
                  activeStepIndex={activeStepIndex}
                  progress={progress}
                />
              )}
              {isOpen && !detail && (
                <div className="ml-5 mt-1 border-l border-ink-800 pl-3 py-1.5 text-[11px] text-ink-500">
                  <Link
                    href={`/learn/v2/${entry.slug}`}
                    className="text-ink-400 hover:text-ink-100"
                  >
                    Open chapter →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function ChapterDetail({
  chapter,
  activeLesson,
  activeStepIndex,
  progress,
}: {
  chapter: Chapter;
  activeLesson: string;
  activeStepIndex: number;
  progress: ProgressV2 | null;
}) {
  return (
    <div className="ml-5 mt-1 border-l border-ink-800 pl-3">
      {chapter.lessons.map((lesson) => {
        const isActiveLesson = lesson.slug === activeLesson;
        return (
          <div key={lesson.slug} className="my-2">
            <Link
              href={`/learn/v2/${chapter.slug}/${lesson.slug}`}
              className={cn(
                "block rounded px-1.5 py-1 text-[11px] uppercase tracking-wide transition",
                isActiveLesson
                  ? "text-ember-400"
                  : "text-ink-500 hover:text-ink-200",
              )}
            >
              {lesson.title}
            </Link>
            {isActiveLesson && (
              <ol className="mt-1 flex flex-col gap-0.5">
                {lesson.steps.map((step, idx) => {
                  const status = progress?.steps[step.id]?.status;
                  const here = idx === activeStepIndex;
                  return (
                    <li key={step.id}>
                      <Link
                        href={`/learn/v2/${chapter.slug}/${lesson.slug}/${idx}`}
                        className={cn(
                          "flex items-center gap-2 rounded px-1.5 py-1 text-xs transition",
                          here
                            ? "bg-ink-800 text-ember-400"
                            : "text-ink-500 hover:text-ink-100",
                        )}
                      >
                        <StepStatusIcon status={status} active={here} />
                        <span className="font-mono text-[10px] text-ink-500">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="capitalize">{step.type}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepStatusIcon({
  status,
  active,
}: {
  status?: "passed" | "failed" | "skipped";
  active: boolean;
}) {
  if (status === "passed")
    return <Check size={11} className="text-signal" />;
  if (active) return <Circle size={9} className="text-ember-500 fill-ember-500" />;
  if (status === "skipped" || status === "failed")
    return <Circle size={9} className="text-ink-500" />;
  return <Lock size={10} className="text-ink-700" />;
}

function shortChapterTitle(full: string): string {
  // Trim everything after the em-dash so "Variables — what AI reaches for" → "Variables"
  return full.split(/\s—\s/)[0];
}
