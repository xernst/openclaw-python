// Server-only accessor for the v2 split manifest produced by
// scripts/build-content-v2.mjs. The TOC is loaded eagerly; each chapter's
// step detail is loaded on-demand from lib/generated/v2/chapters/{slug}.json.
//
// Lives separately from lib/content.ts (which serves the legacy exercise model)
// so the v1 path stays untouched until v2 retires it.

import "server-only";

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type {
  Chapter,
  Lesson,
  ManifestToc,
  Step,
} from "./content/schema";

import tocRaw from "./generated/v2/manifest.toc.json";

const CHAPTERS_DIR = join(process.cwd(), "lib", "generated", "v2", "chapters");
const chapterCache = new Map<string, Chapter>();

const toc = tocRaw as ManifestToc;

export function getV2Toc(): ManifestToc {
  return toc;
}

export async function getV2Chapter(slug: string): Promise<Chapter | undefined> {
  const cached = chapterCache.get(slug);
  if (cached) return cached;
  const file = join(CHAPTERS_DIR, `${slug}.json`);
  if (!existsSync(file)) return undefined;
  const raw = await readFile(file, "utf8");
  const chapter = JSON.parse(raw) as Chapter;
  chapterCache.set(slug, chapter);
  return chapter;
}

export async function getV2Lesson(
  chapterSlug: string,
  lessonSlug: string,
): Promise<{ chapter: Chapter; lesson: Lesson } | undefined> {
  const chapter = await getV2Chapter(chapterSlug);
  if (!chapter) return undefined;
  const lesson = chapter.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { chapter, lesson };
}

export async function getV2Step(
  chapterSlug: string,
  lessonSlug: string,
  stepIndex: number,
): Promise<
  | {
      chapter: Chapter;
      lesson: Lesson;
      step: Step;
      stepIndex: number;
    }
  | undefined
> {
  const found = await getV2Lesson(chapterSlug, lessonSlug);
  if (!found) return undefined;
  const step = found.lesson.steps[stepIndex];
  if (!step) return undefined;
  return { ...found, step, stepIndex };
}

export async function getNextV2Step(
  chapterSlug: string,
  lessonSlug: string,
  stepIndex: number,
): Promise<
  | { chapterSlug: string; lessonSlug: string; stepIndex: number }
  | null
> {
  const found = await getV2Lesson(chapterSlug, lessonSlug);
  if (!found) return null;
  const { chapter, lesson } = found;
  if (stepIndex + 1 < lesson.steps.length) {
    return { chapterSlug, lessonSlug, stepIndex: stepIndex + 1 };
  }
  // next lesson in same chapter
  const lessonIdx = chapter.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIdx >= 0 && lessonIdx + 1 < chapter.lessons.length) {
    return {
      chapterSlug,
      lessonSlug: chapter.lessons[lessonIdx + 1].slug,
      stepIndex: 0,
    };
  }
  // first lesson of next chapter (use TOC order)
  const tocIdx = toc.chapters.findIndex((c) => c.slug === chapterSlug);
  if (tocIdx >= 0 && tocIdx + 1 < toc.chapters.length) {
    const nextChapter = await getV2Chapter(toc.chapters[tocIdx + 1].slug);
    if (nextChapter && nextChapter.lessons.length > 0) {
      return {
        chapterSlug: nextChapter.slug,
        lessonSlug: nextChapter.lessons[0].slug,
        stepIndex: 0,
      };
    }
  }
  return null;
}

export async function getFirstV2Step(): Promise<
  { chapterSlug: string; lessonSlug: string; stepIndex: number } | null
> {
  for (const entry of toc.chapters) {
    const chapter = await getV2Chapter(entry.slug);
    if (chapter && chapter.lessons.length > 0 && chapter.lessons[0].steps.length > 0) {
      return {
        chapterSlug: chapter.slug,
        lessonSlug: chapter.lessons[0].slug,
        stepIndex: 0,
      };
    }
  }
  return null;
}

export async function listAllV2StepRoutes(): Promise<
  Array<{ chapter: string; lesson: string; stepIndex: string }>
> {
  const routes: Array<{ chapter: string; lesson: string; stepIndex: string }> = [];
  for (const entry of toc.chapters) {
    const chapter = await getV2Chapter(entry.slug);
    if (!chapter) continue;
    for (const lesson of chapter.lessons) {
      for (let i = 0; i < lesson.steps.length; i++) {
        routes.push({
          chapter: chapter.slug,
          lesson: lesson.slug,
          stepIndex: String(i),
        });
      }
    }
  }
  return routes;
}

export async function listAllV2LessonRoutes(): Promise<
  Array<{ chapter: string; lesson: string }>
> {
  const routes: Array<{ chapter: string; lesson: string }> = [];
  for (const entry of toc.chapters) {
    const chapter = await getV2Chapter(entry.slug);
    if (!chapter) continue;
    for (const lesson of chapter.lessons) {
      routes.push({ chapter: chapter.slug, lesson: lesson.slug });
    }
  }
  return routes;
}

export async function listAllV2ChapterRoutes(): Promise<
  Array<{ chapter: string }>
> {
  return toc.chapters.map((c) => ({ chapter: c.slug }));
}
