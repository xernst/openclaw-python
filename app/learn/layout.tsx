import Link from "next/link";
import { getChapters } from "@/lib/content";
import ChapterNav from "@/components/ChapterNav";
import StreakWidget from "@/components/StreakWidget";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters().map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    exerciseCount: c.exercises.length,
    exerciseSlugs: c.exercises.map((e) => e.slug),
  }));

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
