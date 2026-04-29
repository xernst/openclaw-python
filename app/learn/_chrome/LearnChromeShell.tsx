"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import ChapterNav from "@/components/ChapterNav";
import StreakWidget from "@/components/StreakWidget";

type ChapterSummary = {
  slug: string;
  number: number;
  title: string;
  exerciseCount: number;
  exerciseSlugs: string[];
};

export default function LearnChromeShell({
  chapters,
  children,
}: {
  chapters: ChapterSummary[];
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  if (segment === "v2") {
    return <>{children}</>;
  }

  return (
    <div className="grid h-screen grid-cols-[240px_1fr] overflow-hidden">
      <ChapterNav chapters={chapters} />
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex h-12 items-center justify-between border-b border-ink-800 bg-ink-950 px-4">
          <Link href="/" className="text-xs text-ink-500 hover:text-ink-200">
            ← home
          </Link>
          <StreakWidget />
        </header>
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
