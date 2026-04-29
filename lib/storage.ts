"use client";
import type { GlobalProgress, LessonProgress, StreakState } from "./types";

const KEY = "code-killa:progress:v1";

const FRESH_STREAK: StreakState = {
  lastActivityDate: "",
  current: 0,
  longest: 0,
  embers: 0,
  frozenFlames: 0,
  totalXp: 0,
  todayXp: 0,
  todayDate: "",
};

const FRESH: GlobalProgress = {
  lessons: {},
  streak: FRESH_STREAK,
  conceptsTouched: [],
  brainDump: [],
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): GlobalProgress {
  if (typeof window === "undefined") return FRESH;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FRESH;
    const parsed = JSON.parse(raw) as GlobalProgress;
    return { ...FRESH, ...parsed, streak: { ...FRESH_STREAK, ...parsed.streak } };
  } catch {
    return FRESH;
  }
}

export function saveProgress(p: GlobalProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  // Notify other tabs / our own listeners.
  window.dispatchEvent(new CustomEvent("code-killa:progress"));
}

export function updateProgress(
  fn: (p: GlobalProgress) => GlobalProgress,
): GlobalProgress {
  const cur = loadProgress();
  const next = fn(cur);
  saveProgress(next);
  return next;
}

export function exerciseKey(chapterSlug: string, exerciseSlug: string): string {
  return `${chapterSlug}/${exerciseSlug}`;
}

export function getLesson(
  p: GlobalProgress,
  chapterSlug: string,
  exerciseSlug: string,
): LessonProgress {
  const k = exerciseKey(chapterSlug, exerciseSlug);
  return (
    p.lessons[k] || {
      chapterSlug,
      exerciseSlug,
      status: "not-started",
      attempts: 0,
    }
  );
}

export function setLesson(
  chapterSlug: string,
  exerciseSlug: string,
  patch: Partial<LessonProgress>,
) {
  return updateProgress((p) => {
    const k = exerciseKey(chapterSlug, exerciseSlug);
    const cur = p.lessons[k] || {
      chapterSlug,
      exerciseSlug,
      status: "not-started" as const,
      attempts: 0,
    };
    return {
      ...p,
      lessons: { ...p.lessons, [k]: { ...cur, ...patch } },
      lastVisited: { chapterSlug, exerciseSlug },
      conceptsTouched: p.conceptsTouched.includes(chapterSlug)
        ? p.conceptsTouched
        : [...p.conceptsTouched, chapterSlug],
    };
  });
}

export { todayISO, FRESH_STREAK };
