"use client";

// First-visit redirect + v2 Resume card. Server can't read localStorage,
// so this client island handles the localStorage-dependent decisions:
//   1. If profile.name is empty, push /onboarding.
//   2. Otherwise, render a Resume card that prefers lastVisitedV2 over the
//      caller-supplied fallback start.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
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
  | { state: "redirecting" }
  | { state: "ready"; target: Fallback; isResume: boolean };

export default function HomeClient({ fallback, chapters }: Props) {
  const router = useRouter();
  const [resolved, setResolved] = useState<Resolved>({ state: "loading" });

  useEffect(() => {
    const progress = loadProgressV2();
    const name = progress.profile?.name?.trim();
    if (!name) {
      setResolved({ state: "redirecting" });
      router.push("/onboarding");
      return;
    }
    const last = getLastVisitedV2();
    if (last) {
      setResolved({ state: "ready", target: last, isResume: true });
      return;
    }
    setResolved({ state: "ready", target: fallback, isResume: false });
  }, [router, fallback]);

  if (resolved.state !== "ready") {
    return (
      <div
        aria-hidden
        className="h-[124px] rounded-xl border border-ink-800 bg-ink-950"
      />
    );
  }

  const { target, isResume } = resolved;
  const link = `/learn/v2/${target.chapterSlug}/${target.lessonSlug}/${target.stepIndex}`;
  const chapter = chapters.find((c) => c.slug === target.chapterSlug);
  const heading = isResume
    ? chapter
      ? `Ch ${chapter.number} · ${chapter.title.replace(/\s*—.*$/, "")}`
      : "Pick up where you left off"
    : "Chapter 1 · Variables";
  const sub = isResume
    ? "pick up where you left off"
    : "first lesson — naming things";

  return (
    <Link
      href={link}
      className="group flex items-center justify-between rounded-xl border border-ember-700/40 bg-gradient-to-br from-ember-950 to-ink-950 p-6 transition hover:border-ember-600 hover:from-ember-900"
    >
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-ember-500">
          {isResume ? "welcome back" : "start here"}
        </div>
        <div className="mt-1 truncate text-2xl font-semibold text-ink-50">
          {heading}
        </div>
        <div className="mt-1 truncate text-sm text-ink-500">{sub}</div>
      </div>
      <div className="ml-4 shrink-0 rounded-full bg-ember-600 p-3 transition group-hover:bg-ember-500">
        <Play size={20} className="fill-white text-white" />
      </div>
    </Link>
  );
}
