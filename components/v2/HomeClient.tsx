"use client";

// Resume / Start CTA — the localStorage-dependent island on the marketing
// home page. Replaces the older auto-redirect-to-onboarding behavior so the
// landing page actually has a chance to render. New users see "Start onboarding";
// returning users see "Continue Ch N · …"
//
// Decisions live here, not in app/page.tsx, because Server Components can't
// read localStorage.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { getLastVisitedV2, loadProgressV2 } from "@/lib/storage";

type Fallback = {
  chapterSlug: string;
  lessonSlug: string;
  stepIndex: number;
};

type ChapterMeta = {
  slug: string;
  title: string;
  number: number;
};

type Props = {
  fallback: Fallback;
  chapters: ChapterMeta[];
};

type Resolved =
  | { state: "loading" }
  | { state: "new-user" }
  | { state: "in-progress"; target: Fallback };

export default function HomeClient({ fallback, chapters }: Props) {
  const [resolved, setResolved] = useState<Resolved>({ state: "loading" });

  useEffect(() => {
    const progress = loadProgressV2();
    const name = progress.profile?.name?.trim();
    if (!name) {
      setResolved({ state: "new-user" });
      return;
    }
    const last = getLastVisitedV2();
    if (last) {
      setResolved({ state: "in-progress", target: last });
      return;
    }
    // Has profile but no lastVisited — finished onboarding, hasn't started a lesson yet.
    setResolved({ state: "in-progress", target: fallback });
  }, [fallback]);

  if (resolved.state === "loading") {
    return (
      <div
        aria-hidden
        className="h-[124px] rounded-xl border border-ink-800 bg-ink-950"
      />
    );
  }

  if (resolved.state === "new-user") {
    return (
      <Link
        href="/onboarding"
        className="group flex items-center justify-between rounded-xl border border-ember-700/40 bg-gradient-to-br from-ember-950 to-ink-950 p-6 transition hover:border-ember-600 hover:from-ember-900"
      >
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-ember-500">
            start here
          </div>
          <div className="mt-1 text-2xl font-semibold text-ink-50">
            Get started in under a minute
          </div>
          <div className="mt-1 text-sm text-ink-500">
            Five questions, then your first lesson.
          </div>
        </div>
        <div className="ml-4 shrink-0 rounded-full bg-ember-600 p-3 transition group-hover:bg-ember-500">
          <ArrowRight size={20} className="text-white" />
        </div>
      </Link>
    );
  }

  const { target } = resolved;
  const link = `/learn/v2/${target.chapterSlug}/${target.lessonSlug}/${target.stepIndex}`;
  const chapter = chapters.find((c) => c.slug === target.chapterSlug);
  const heading = chapter
    ? `Ch ${chapter.number} · ${chapter.title.replace(/\s*—.*$/, "")}`
    : "Pick up where you left off";

  return (
    <Link
      href={link}
      className="group flex items-center justify-between rounded-xl border border-ember-700/40 bg-gradient-to-br from-ember-950 to-ink-950 p-6 transition hover:border-ember-600 hover:from-ember-900"
    >
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-ember-500">
          welcome back
        </div>
        <div className="mt-1 truncate text-2xl font-semibold text-ink-50">
          {heading}
        </div>
        <div className="mt-1 truncate text-sm text-ink-500">
          pick up where you left off
        </div>
      </div>
      <div className="ml-4 shrink-0 rounded-full bg-ember-600 p-3 transition group-hover:bg-ember-500">
        <Play size={20} className="fill-white text-white" />
      </div>
    </Link>
  );
}
