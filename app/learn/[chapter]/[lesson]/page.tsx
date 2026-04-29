import { notFound } from "next/navigation";
import { getChapters, getExercise, getNextExercise } from "@/lib/content";
import LessonClient from "@/components/LessonClient";

export function generateStaticParams() {
  const out: Array<{ chapter: string; lesson: string }> = [];
  for (const c of getChapters()) {
    for (const e of c.exercises) {
      out.push({ chapter: c.slug, lesson: e.slug });
    }
  }
  return out;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ chapter: string; lesson: string }>;
}) {
  const { chapter: chapterSlug, lesson: exerciseSlug } = await params;
  const found = getExercise(chapterSlug, exerciseSlug);
  if (!found) notFound();
  const next = getNextExercise(chapterSlug, exerciseSlug);

  return (
    <div className="h-full">
      <LessonClient chapter={found.chapter} exercise={found.exercise} next={next} />
    </div>
  );
}
