// Server-only. Imports the prebuilt manifest produced by scripts/build-content.mjs.
import "server-only";
import type { Chapter, Exercise, Manifest } from "./types";

// The manifest is a static JSON import, so it's tree-shaken into the build
// and zero-cost at request time.
import raw from "./generated/manifest.json";

const manifest = raw as Manifest;

export function getChapters(): Chapter[] {
  return manifest.chapters;
}

export function getChapter(slug: string): Chapter | undefined {
  return manifest.chapters.find((c) => c.slug === slug);
}

export function getExercise(
  chapterSlug: string,
  exerciseSlug: string,
): { chapter: Chapter; exercise: Exercise } | undefined {
  const chapter = getChapter(chapterSlug);
  if (!chapter) return undefined;
  const exercise = chapter.exercises.find((e) => e.slug === exerciseSlug);
  if (!exercise) return undefined;
  return { chapter, exercise };
}

export function getNextExercise(
  chapterSlug: string,
  exerciseSlug: string,
): { chapterSlug: string; exerciseSlug: string } | null {
  const chapters = getChapters();
  const chIdx = chapters.findIndex((c) => c.slug === chapterSlug);
  if (chIdx < 0) return null;
  const ch = chapters[chIdx];
  const exIdx = ch.exercises.findIndex((e) => e.slug === exerciseSlug);
  if (exIdx < 0) return null;
  if (exIdx + 1 < ch.exercises.length) {
    return { chapterSlug, exerciseSlug: ch.exercises[exIdx + 1].slug };
  }
  if (chIdx + 1 < chapters.length) {
    const next = chapters[chIdx + 1];
    if (next.exercises.length > 0) {
      return { chapterSlug: next.slug, exerciseSlug: next.exercises[0].slug };
    }
  }
  return null;
}

export function getFirstExercise(): { chapterSlug: string; exerciseSlug: string } | null {
  const chapters = getChapters();
  for (const c of chapters) {
    if (c.exercises.length > 0) {
      return { chapterSlug: c.slug, exerciseSlug: c.exercises[0].slug };
    }
  }
  return null;
}

export function exerciseKey(chapterSlug: string, exerciseSlug: string): string {
  return `${chapterSlug}/${exerciseSlug}`;
}
