import { getChapters } from "@/lib/content";
import LearnChromeShell from "./_chrome/LearnChromeShell";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters().map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    exerciseCount: c.exercises.length,
    exerciseSlugs: c.exercises.map((e) => e.slug),
  }));

  return <LearnChromeShell chapters={chapters}>{children}</LearnChromeShell>;
}
